import { CoreIntegration, ICoreIntegration } from '@/interface/integration';
import { Context } from 'hono';

class ICloudCalendarIntegration extends CoreIntegration {
  public static name = 'iCloud Calendar';
  public static description =
    "Read and write calendar events from Apple's iCloud Calendar";
  constructor(protected c: Context) {
    super(c);
  }

  handleConnect = async (formData: FormData): Promise<void> => {};
  handleDisconnect = async (): Promise<void> => {};
  handleUpdate = async (formData: FormData): Promise<void> => {};
}

export { ICloudCalendarIntegration };
