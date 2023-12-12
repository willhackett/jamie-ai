import { type DrizzleD1Database, drizzle } from 'drizzle-orm/d1';
import * as schema from '@/model';
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
  not,
  notInArray,
} from 'drizzle-orm';

export type Database = DrizzleD1Database<typeof schema>;

export function db(d1: D1Database) {
  const db = drizzle(d1, {
    schema,
  });

  return db;
}

export class D1 {
  public db: Database;

  constructor(d1: D1Database) {
    this.db = drizzle(d1, {
      schema,
    });
  }
}
