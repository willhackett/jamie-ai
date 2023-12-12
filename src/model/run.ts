import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { user } from './user';
import { D1, notInArray } from '@/service/d1';

type RunStatus =
  | 'queued'
  | 'in_progress'
  | 'requires_action'
  | 'cancelling'
  | 'cancelled'
  | 'failed'
  | 'completed'
  | 'expired';

class RunModel {
  constructor(protected d1: D1) {}

  public async getIncompleteRuns() {
    const runs = await this.d1.db.query.run.findMany({
      where: notInArray(run.status, [
        'completed',
        'expired',
        'cancelled',
        'cancelling',
        'failed',
      ]),
      with: {
        user: true,
      },
    });

    return runs;
  }

  public async createRun(userId: string, runId: string) {
    const createdRun = await this.d1.db
      .insert(run)
      .values({
        id: runId,
        userId,
        status: 'queued',
      })
      .returning({ id: run.id })
      .get();

    return createdRun;
  }

  public async updateRunStatus(runId: string, status: RunStatus) {
    const updatedRun = await this.d1.db
      .update(run)
      .set({
        status,
      })
      .where(eq(run.id, runId))
      .run();

    return updatedRun;
  }

  public async getRunById(runId: string) {
    const firstRun = await this.d1.db.query.run.findFirst({
      where: eq(run.id, runId),
    });

    if (!firstRun) {
      return null;
    }

    return firstRun;
  }
}

export const run = sqliteTable('run', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .references(() => user.id)
    .notNull(),
  status: text('status').notNull(),
});

export const userRelation = run;

export const runsRelation = relations(run, ({ one }) => ({
  user: one(user, {
    fields: [run.userId],
    references: [user.id],
    relationName: 'user',
  }),
}));

export type SelectRun = InferSelectModel<typeof run>;

export type InsertRun = InferInsertModel<typeof run>;

export { RunModel };
