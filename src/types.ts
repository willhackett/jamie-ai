import type { Context } from 'hono';

export type Env = {
  DB: D1Database;
  QUEUE: Queue;
  COOKIE_SECRET: string;
  AES_KEY: string;
  OAUTH_CLIENT_ID: string;
  OAUTH_CLIENT_SECRET: string;
  OAUTH_ISSUER_HOSTNAME: string;
  OAUTH_REDIRECT_URI: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REDIRECT_URI: string;
  OPENAI_API_KEY: string;
};

export type AppContext = Context<{ Bindings: Env }>;
