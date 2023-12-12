import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { D1, createId, lt, eq } from '@/service/d1';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { user } from './user';

class ScheduleModel {
  constructor(protected d1: D1) {}

  public async getJobs() {
    const jobs = await this.d1.db.query.schedule.findMany({
      where: lt(schedule.runAt, new Date()),
    });

    return jobs;
  }

  public async deleteJob(id: string) {
    const deletedJob = await this.d1.db
      .delete(schedule)
      .where(eq(schedule.id, id))
      .run();

    return deletedJob;
  }

  public async scheduleJob(userId: string, context: string, runAt: Date) {
    const createdJob = await this.d1.db
      .insert(schedule)
      .values({
        userId,
        context,
        runAt,
      })
      .returning({ id: schedule.id })
      .get();

    return createdJob;
  }
}

export const schedule = sqliteTable('schedule', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id')
    .references(() => user.id)
    .notNull(),
  context: text('context').notNull(),
  runAt: int('run_at', { mode: 'timestamp' }).notNull(),
});

export type Schedule = InferSelectModel<typeof schedule>;

export type InsertSchedule = InferInsertModel<typeof schedule>;

export { ScheduleModel };
