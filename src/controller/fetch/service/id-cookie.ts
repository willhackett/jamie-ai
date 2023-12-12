import { Context } from 'hono';
import { getSignedCookie, setSignedCookie, deleteCookie } from 'hono/cookie';
import type { Env } from '@/types';

class IdCookie {
  private static readonly COOKIE_NAME = 'jai-id';
  private secret: string;

  constructor(protected context: Context<{ Bindings: Env }>) {
    this.secret = context.env.COOKIE_SECRET;
  }

  public async getId(): Promise<string | null> {
    const cookie = await getSignedCookie(
      this.context,
      this.secret,
      IdCookie.COOKIE_NAME
    );

    if (cookie) {
      return cookie;
    }

    return null;
  }

  public async setId(id: string): Promise<void> {
    await setSignedCookie(this.context, IdCookie.COOKIE_NAME, id, this.secret);
  }

  public async clearId(): Promise<void> {
    await deleteCookie(this.context, IdCookie.COOKIE_NAME);
  }
}

export { IdCookie };
