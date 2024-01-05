import { EmailMessageController } from '@/controller/email-message';
import { Env, PostmarkWebHook } from '@/types';
import { Hono } from 'hono';

const route = new Hono<{ Bindings: Env }>();

// Handle Postmark Inbound WebHook
route.post('/webhook', async (c) => {
  const json = await c.req.json();

  const body = json as PostmarkWebHook;

  const emailMessageController = new EmailMessageController(c.env);

  await emailMessageController.process(body);
});

export { route };
