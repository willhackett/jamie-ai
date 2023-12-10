import { D1, and, lte, schema } from '@/service/d1';
import { Env } from '@/types';

class Cron {
  d1: D1;

  constructor(protected env: Env) {
    this.d1 = new D1(env.DB);
  }

  public schedule(userId: string, context: string, runAt: Date) {
    const cron = this.d1.db
      .insert(schema.schedule)
      .values({
        userId,
        context,
        runAt,
      })
      .returning({ id: schema.schedule.id })
      .get();

    return cron;
  }

  public process() {
    const now = new Date();

    const cron = this.d1.db
      .select()
      .from(schema.schedule)
      .where(and(lte(schema.schedule.runAt, now)))
      .get();

    return cron;
  }
}

export { Cron };
