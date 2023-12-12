import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { D1, createId, eq } from '@/service/d1';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { user } from './user';

class IntegrationModel {
  constructor(protected d1: D1) {}

  public async getUserIntegrations(userId: string) {
    const integrations = await this.d1.db.query.integration.findMany({
      where: eq(integration.userId, userId),
    });

    return integrations;
  }
}

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

export { IntegrationModel };
