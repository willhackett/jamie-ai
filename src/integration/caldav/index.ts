import { CoreIntegration, ICoreIntegration } from '@/interface/integration';
import { AESCrypto } from '@/util/aes-crypto';
import { Context } from 'hono';

interface CalDavIntegrationConfig {
  hostname: string;
  username: string;
  password: string;
  defaultCalendar: {
    id: string;
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

  handleConnect = async (formData: FormData): Promise<Response> => {
    const hostname = formData.get('hostname');
    const username = formData.get('username');
    const password = formData.get('password');
    const defaultCalendar = formData.get('defaultCalendar');

    if (!hostname || !username || !password || !defaultCalendar) {
      return this.c.text('Missing parameters', 400);
    }

    const aesKey = await AESCrypto.importKey(this.c.env.AES_KEY);
    const encryptedPassword = await AESCrypto.encrypt(`${password}`, aesKey);

    const config: CalDavIntegrationConfig = {
      hostname: `${hostname}`,
      username: `${username}`,
      password: encryptedPassword,
      defaultCalendar: {},
    };

    await this.storeConfig(config);

    return this.c.redirect('/integration/caldav', 302);
  };
  handleDisconnect = async (): Promise<void> => {};
  handleUpdate = async (formData: FormData): Promise<void> => {};
  // Un-used
  handleCallback = async () => {
    this.c.text('Not allowed', 400);
  };
}

export { CalDavIntegration };
