import { Hono } from 'hono';
import { logger } from 'hono/logger';

import { authRoute, integrationRoute } from './route';
import { HomePage } from './view/homepage';
import { getUserFromContext } from './model';

export type Env = {
  DB: D1Database;
  QUEUE: Queue;
  COOKIE_SECRET: string;
  OAUTH_CLIENT_ID: string;
  OAUTH_CLIENT_SECRET: string;
  OAUTH_ISSUER_HOSTNAME: string;
  OAUTH_REDIRECT_URI: string;
  OPENAI_API_KEY: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use('*', logger());

app.get('/', async (c) => {
  const user = await getUserFromContext(c);

  if (user) {
    return c.redirect('/integration/list');
  }

  return c.redirect('/auth/login');
});

app.route('/integration', integrationRoute);
app.route('/auth', authRoute);

app.use('*', async (c, next) => {
  console.log(c);
  await next();
});

export default {
  fetch: app.fetch,
  async scheduled(
    event: ScheduledEvent,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    console.log('scheduled');
  },
  async queue(batch: MessageBatch<Error>, env: Env): Promise<void> {
    // Do something with messages in the batch
    // i.e. write to R2 storage, D1 database, or POST to an external API
    // You can also iterate over each message in the batch by looping over batch.messages
  },
};
