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

export type PostmarkWebHook = {
  From: string;
  FromFull: {
    Email: string;
    Name: string;
  };
  To: string;
  ToFull: {
    Email: string;
    Name: string;
  }[];
  Cc: string;
  CcFull: {
    Email: string;
    Name: string;
  }[];
  Subject: string;
  MessageID: string;
  ReplyTo: string;
  MailboxHash: string;
  Date: string;
  TextBody: string;
  StrippedTextReply: string;
  Tag: string;
  Headers: {
    Name: string;
    Value: string;
  }[];
};
