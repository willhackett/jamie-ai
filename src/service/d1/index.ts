import { type DrizzleD1Database, drizzle } from 'drizzle-orm/d1';
import * as schema from '@/model';
import { type Context } from 'hono';
import { type Env } from '@/types';
export { createId } from '@paralleldrive/cuid2';

export * as schema from '@/model';

export {
  and,
  asc,
  desc,
  eq,
  or,
  isNull,
  isNotNull,
  lt,
  gt,
  lte,
  gte,
} from 'drizzle-orm';

export type Database = DrizzleD1Database<typeof schema>;

export function db(c: Context) {
  const db = drizzle(c.env.DB, {
    schema,
  });

  return db;
}

export class D1 {
  public db: Database;

  constructor(c: Context<{ Bindings: Env }>) {
    this.db = drizzle(c.env.DB, {
      schema,
    });
  }
}
