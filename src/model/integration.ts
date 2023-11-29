import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createId } from '@/service/d1';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { user } from './user';

export const integration = sqliteTable('integration', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  integrationId: text('integration_id').notNull(),
  userId: text('user_id')
    .references(() => user.id)
    .notNull(),

  config: text('config', { mode: 'json' }),
});

export type Integration = InferSelectModel<typeof integration>;

export type InsertIntegration = InferInsertModel<typeof integration>;
