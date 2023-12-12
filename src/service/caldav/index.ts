import { CoreIntegration, ICoreIntegration } from '@/interface/integration';
import { AESCrypto } from '@/util/aes-crypto';
import { Context } from 'hono';
import { CalDavApi } from './api/caldav';
import { User } from '@/model';
import { and, eq, schema } from '@/service/d1';

interface CalDavIntegrationConfig {
  hostname: string;
  username: string;
  password: string;
  defaultCalendar?: {
    href: string;
    summary: string;
  };
}

class CalDavIntegration extends CoreIntegration {
  public id = 'caldav';
  public name = 'CalDav Calendar';
  public description =
    'Read and write calendar events from CalDav calendars like iCloud Calendar & FastMail';

  constructor(protected c: Context) {
    super(c);
  }

  handleConnect = async (
    _user: User,
    formData: FormData
  ): Promise<Response> => {
    const hostname = formData.get('hostname');
    const username = formData.get('username');
    const password = formData.get('password');
    const defaultCalendar = formData.get('defaultCalendar');

    if (!hostname || !username || !password) {
      return this.c.text('Missing parameters', 400);
    }

    const encryptedPassword = await AESCrypto.encrypt(
      `${password}`,
      this.c.env.AES_KEY
    );

    const config: CalDavIntegrationConfig = {
      hostname: `${hostname}`,
      username: `${username}`,
      password: encryptedPassword,
    };

    const calDavApi = new CalDavApi(
      config.hostname,
      config.username,
      `${password}`
    );

    const calendarList = await calDavApi.getCalendarList();

    if (defaultCalendar) {
      const defaultCalendarDetail = calendarList.find(
        (calendar) => calendar.href === defaultCalendar
      );

      if (!defaultCalendarDetail) {
        throw new Error('Invalid default calendar');
      }

      config.defaultCalendar = defaultCalendarDetail;
    } else {
      config.defaultCalendar = calendarList[0];
    }

    await this.storeConfig(config);

    return this.c.redirect('/integration/caldav', 302);
  };
  handleDisconnect = async (user: User): Promise<Response> => {
    await this.d1.db
      .delete(schema.integration)
      .where(
        and(
          eq(schema.integration.userId, user.id),
          eq(schema.integration.integrationId, this.id)
        )
      );

    return this.c.redirect('/integration/caldav', 302);
  };
  handleUpdate = async (_user: User, formData: FormData): Promise<Response> => {
    const hostname = formData.get('hostname');
    const username = formData.get('username');
    const password = formData.get('password');
    const defaultCalendar = formData.get('defaultCalendar');

    if (!hostname || !username || !password) {
      return this.c.text('Missing parameters', 400);
    }

    const config = await this.getConfig<CalDavIntegrationConfig>();

    if (!config) {
      return this.c.text('Integration not found', 404);
    }

    if (password) {
      const encryptedPassword = await AESCrypto.encrypt(
        `${password}`,
        this.c.env.AES_KEY
      );

      config.password = encryptedPassword;
    }

    if (hostname) {
      config.hostname = `${hostname}`;
    }

    if (username) {
      config.username = `${username}`;
    }

    const calDavApi = new CalDavApi(
      config.hostname,
      config.username,
      `${password}`
    );

    const calendarList = await calDavApi.getCalendarList();

    if (defaultCalendar) {
      const defaultCalendarDetail = calendarList.find(
        (calendar) => calendar.href === defaultCalendar
      );

      if (!defaultCalendarDetail) {
        throw new Error('Invalid default calendar');
      }

      config.defaultCalendar = defaultCalendarDetail;
    } else {
      config.defaultCalendar = calendarList[0];
    }

    await this.storeConfig(config);

    return this.c.redirect('/integration/caldav', 302);
  };

  handleCallback = async () => {
    return this.c.text('Not Found', 404);
  };

  public async getCalendarList() {
    const config = await this.getConfig<CalDavIntegrationConfig>();

    if (!config) {
      return null;
    }

    const decryptedPassword = await AESCrypto.decrypt(
      config.password,
      this.c.env.AES_KEY
    );

    const calDavApi = new CalDavApi(
      config.hostname,
      config.username,
      decryptedPassword
    );

    const calendarList = await calDavApi.getCalendarList();

    return calendarList;
  }

  public async getPublicConfig() {
    const config = await this.getConfig<CalDavIntegrationConfig>();

    if (!config) {
      return null;
    }

    const { username, hostname, defaultCalendar } = config;

    return {
      username,
      hostname,
      defaultCalendar,
    };
  }
}

export { CalDavIntegration };
