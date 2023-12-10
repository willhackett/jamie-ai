import { User, getUserFromContext } from '@/model';
import { D1, and, eq, schema } from '@/service/d1';
import { Context } from 'hono';

export interface ICoreIntegration {
  handleUpdate(user: User | null, formData: FormData): Promise<Response>;
  handleConnect(user: User | null, formData: FormData): Promise<Response>;
  handleDisconnect(user: User | null): Promise<Response>;
  handleCallback(
    user: User | null,
    searchParams: URLSearchParams
  ): Promise<Response>;
}

abstract class CoreIntegration implements ICoreIntegration {
  public abstract id: string;
  public abstract name: string;
  public abstract description: string;
  protected c: Context;
  protected d1: D1;

  abstract handleUpdate(
    user: User | null,
    formData: FormData
  ): Promise<Response>;
  abstract handleConnect(
    user: User | null,
    formData: FormData
  ): Promise<Response>;
  abstract handleDisconnect(user: User | null): Promise<Response>;
  abstract handleCallback(
    user: User | null,
    searchParams: URLSearchParams
  ): Promise<Response>;

  constructor(c: Context) {
    this.c = c;
    this.d1 = new D1(c.env.DB);
  }

  /**
   * Function to handle the connection in the UI
   * @param c Hono Context
   */
  public async connect(formData: FormData): Promise<Response> {
    const user = await getUserFromContext(this.c);

    if (this.handleConnect) {
      return this.handleConnect(user, formData);
    }

    return this.c.text('Not allowed', 400);
  }

  /**
   * Function to handle the disconnection in the UI
   * @param c Hono Context
   */
  public async disconnect(): Promise<Response> {
    const user = await getUserFromContext(this.c);

    if (this.handleDisconnect) {
      return this.handleDisconnect(user);
    }

    return this.c.text('Not allowed', 400);
  }

  /**
   * Function to handle the update in the UI
   * @param c Hono Context
   */
  public async update(formData: FormData): Promise<Response> {
    const user = await getUserFromContext(this.c);

    if (this.handleUpdate) {
      return this.handleUpdate(user, formData);
    }

    return this.c.text('Not allowed', 400);
  }

  public async isConnected(): Promise<boolean> {
    const user = await getUserFromContext(this.c);

    if (!user) {
      return false;
    }

    const config = await this.getConfig();

    if (!config) {
      return false;
    }

    return true;
  }

  public async callback(searchParams: URLSearchParams): Promise<Response> {
    const user = await getUserFromContext(this.c);

    if (this.handleCallback) {
      return this.handleCallback(user, searchParams);
    }

    return this.c.text('Not allowed', 400);
  }

  protected async storeConfig<CT>(config: CT) {
    const user = await getUserFromContext(this.c);

    if (!user) {
      throw new Error('User not found');
    }

    const existingConfig = await this.d1.db
      .select()
      .from(schema.integration)
      .where(
        and(
          eq(schema.integration.userId, user.id),
          eq(schema.integration.integrationId, this.id)
        )
      )
      .get();

    if (!existingConfig) {
      return this.d1.db
        .insert(schema.integration)
        .values({
          integrationId: this.id,
          userId: user.id,
          config,
        })
        .run();
    }

    return this.d1.db
      .update(schema.integration)
      .set({
        config,
      })
      .where(eq(schema.integration.id, existingConfig.id))
      .run();
  }

  protected async getConfig<CT>() {
    const user = await getUserFromContext(this.c);

    if (!user) {
      return null;
    }

    const config = await this.d1.db
      .select()
      .from(schema.integration)
      .where(
        and(
          eq(schema.integration.userId, user.id),
          eq(schema.integration.integrationId, this.id)
        )
      )
      .get();

    if (!config) {
      return null;
    }

    return config.config as CT;
  }

  protected async deleteConfig() {
    const user = await getUserFromContext(this.c);

    if (!user) {
      return null;
    }

    return this.d1.db
      .delete(schema.integration)
      .where(
        and(
          eq(schema.integration.userId, user.id),
          eq(schema.integration.integrationId, this.id)
        )
      )
      .run();
  }
}

export { CoreIntegration };
