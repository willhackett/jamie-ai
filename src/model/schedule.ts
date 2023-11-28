import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createId } from '@/service/d1';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { user } from './user';

export const schedule = sqliteTable('schedule', {
  id: text('id').$defaultFn(createId).primaryKey(),
  integrationId: text('integration_id').notNull(),
  userId: text('user_id')
    .references(() => user.id)
    .notNull(),
  runAt: int('run_at', { mode: 'timestamp' }).notNull(),
});

export type Schedule = InferSelectModel<typeof schedule>;

export type InsertSchedule = InferInsertModel<typeof schedule>;
