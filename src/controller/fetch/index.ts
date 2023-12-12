import { UserModel } from '@/model';
import {
  authRoute,
  integrationRoute,
  openaiRoute,
} from '@/controller/fetch/route';
import { Env } from '@/types';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { D1 } from '@/service/d1';

class FetchController extends Hono<{ Bindings: Env }> {
  public static init(request: Request, env: Env, ctx: any) {
    const controller = new FetchController();

    return controller.fetch(request, env, ctx);
  }

  constructor() {
    super();

    this.use('*', logger());

    this.get('/', async (c) => {
      const d1 = new D1(c.env.DB);
      const userModel = new UserModel(d1);

      const user = await userModel.getUserFromContext(c);

      if (user) {
        return c.redirect('/integration/list');
      }

      return c.redirect('/auth/login');
    });

    this.route('/integration', integrationRoute);

    this.route('/auth', authRoute);

    this.route('/openai', openaiRoute);
  }
}

export { FetchController };
