import { CoreIntegration } from '@/interface/integration';
import { Context } from 'hono';
import { GoogleCalendarAuth } from './api/auth';
import { User } from '@/model';
import { GoogleCalendarApi } from './api/calendar';

interface GoogleCalendarIntegrationConfig {
  accessToken: string;
  refreshToken: string;
  expiry: number;
  scope: string;
  defaultCalendar: {
    id: string;
    summary: string;
  };
}

class GoogleCalendarIntegration extends CoreIntegration {
  public id = 'google-calendar';
  public name = 'Google Calendar';
  public description = 'Read and write calendar events from Google Calendar';
  protected auth: GoogleCalendarAuth;

  constructor(protected c: Context) {
    super(c);

    this.auth = new GoogleCalendarAuth(c);
  }

  handleConnect = async () => {
    const authorizeUrl = this.auth.getAuthUrl();

    return this.c.redirect(authorizeUrl, 302);
  };
  handleDisconnect = async () => {
    const config = await this.getConfig<GoogleCalendarIntegrationConfig>();

    return this.c.redirect('/integration/google-calendar', 302);
  };
  handleCallback = async (user: User | null, searchParams: URLSearchParams) => {
    const code = searchParams.get('code');

    if (!code) {
      return this.c.text('Missing code', 400);
    }

    const tokenResponse = await this.auth.getAccessToken(code);

    if (!tokenResponse) {
      return this.c.text('Missing token response', 400);
    }

    const calendarApi = new GoogleCalendarApi(tokenResponse.access_token);

    const calendars = await calendarApi.getCalendars();

    const defaultCalendar = calendars.items.find(
      (calendar) => calendar.primary === true
    );

    const config = {
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      expiry: Date.now() + tokenResponse.expires_in - 5000,
      scope: tokenResponse.scope,
      defaultCalendar: defaultCalendar
        ? {
            id: defaultCalendar.id,
            summary: defaultCalendar.summary,
          }
        : null,
    };

    await this.storeConfig(config);

    return this.c.redirect('/integration/google-calendar?success=true', 302);
  };

  handleUpdate = async () => {
    return this.c.redirect('/integration/google-calendar', 302);
  };

  getCalendarDetails = async () => {
    const config = await this.getConfig<GoogleCalendarIntegrationConfig>();

    console.log({ config });

    if (!config) {
      return null;
    }

    return config.defaultCalendar;
  };

  getCalendarList = async () => {
    const config = await this.getConfig<GoogleCalendarIntegrationConfig>();

    if (!config) {
      return null;
    }

    if (Date.now() > config.expiry) {
      const tokenResponse = await this.auth.refreshAccessToken(
        config.refreshToken
      );

      if (!tokenResponse) {
        return null;
      }

      config.accessToken = tokenResponse.access_token;
      config.expiry = Date.now() + tokenResponse.expires_in - 5000;
      config.refreshToken = tokenResponse.refresh_token ?? config.refreshToken;

      await this.storeConfig(config);
    }

    const calendarApi = new GoogleCalendarApi(config.accessToken);

    const calendars = await calendarApi.getCalendars();

    return calendars.items;
  };
}

export { GoogleCalendarIntegration };
