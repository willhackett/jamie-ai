import { CoreIntegration } from '@/interface/integration';
import { Context } from 'hono';

class GoogleCalendarIntegration extends CoreIntegration {
  public static name = 'Google Calendar';
  public static description =
    'Read and write calendar events from Google Calendar';

  constructor(protected c: Context) {
    super(c);
  }

  handleConnect = async (formData: FormData): Promise<void> => {};
  handleDisconnect = async (): Promise<void> => {};
  handleUpdate = async (formData: FormData): Promise<void> => {};
}

export { GoogleCalendarIntegration };
