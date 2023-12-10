import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createId } from '@/service/d1';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { user } from './user';

export const emailMessage = sqliteTable('email_message', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id')
    .references(() => user.id)
    .notNull(),
  from: text('from').notNull(),
  to: text('to', { mode: 'json' }).notNull(),
  cc: text('cc', { mode: 'json' }),
  bcc: text('bcc', { mode: 'json' }),
  subject: text('subject').notNull(),
  text: text('text'),
  html: text('html'),
  attachments: text('attachments', { mode: 'json' }),
  messageId: text('message_id'),
  inReplyTo: text('in_reply_to'),
});

export type EmailMessage = InferSelectModel<typeof emailMessage>;

export type InsertEmailMessage = InferInsertModel<typeof emailMessage>;
