import { Context } from 'hono';

export interface ICoreIntegration {
  handleUpdate(formData: FormData): Promise<void>;
  handleConnect(formData: FormData): Promise<void>;
  handleDisconnect(): Promise<void>;
}

abstract class CoreIntegration implements ICoreIntegration {
  static name: string;
  static description: string;
  protected c: Context;

  abstract handleUpdate(formData: FormData): Promise<void>;
  abstract handleConnect(formData: FormData): Promise<void>;
  abstract handleDisconnect(): Promise<void>;

  constructor(c: Context) {
    this.c = c;
  }

  /**
   * Function to handle the connection in the UI
   * @param c Hono Context
   */
  public async connect(formData: FormData): Promise<void> {
    if (this.handleConnect) {
      await this.handleConnect(formData);
    }
  }

  /**
   * Function to handle the disconnection in the UI
   * @param c Hono Context
   */
  public async disconnect(): Promise<void> {
    if (this.handleDisconnect) {
      await this.handleDisconnect();
    }
  }

  /**
   * Function to handle the update in the UI
   * @param c Hono Context
   */
  public async update(formData: FormData): Promise<void> {
    if (this.handleUpdate) {
      await this.handleUpdate(formData);
    }
  }
}

export { CoreIntegration };
