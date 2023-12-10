import { Hono } from 'hono';
import { logger } from 'hono/logger';

import { authRoute, integrationRoute } from './route';
import { HomePage } from './view/homepage';
import { getUserFromContext } from './model';
import { Env } from './types';
import { Cron, MessageQueue, Email } from './controller';
import { type EmailMessage } from 'cloudflare:email';

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

export default {
  fetch: app.fetch,
  async email(message: ForwardableEmailMessage, env: Env): Promise<void> {
    const emailMessage = new Email(env);

    await emailMessage.process({
      from: message.from,
      to: message.to,
      headers: message.headers,
      raw: message.raw,
    });
  },
  async scheduled(event: ScheduledEvent, env: Env): Promise<void> {
    const cron = new Cron(env);

    await cron.process(event);
  },
  async queue(batch: MessageBatch<Error>, env: Env): Promise<void> {
    const queue = new MessageQueue(env);

    await queue.process(batch);
  },
};
