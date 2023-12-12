import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { D1, createId, eq } from '@/service/d1';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { integration } from '.';
import { type Context } from 'hono';
import { IdCookie } from '@/controller/fetch/service/id-cookie';

class UserModel {
  constructor(protected d1: D1) {}

  public async getUserById(id: string) {
    const firstUser = await this.d1.db.query.user.findFirst({
      where: eq(user.id, id),
    });

    if (!firstUser) {
      return null;
    }

    return firstUser;
  }

  public async createUser(id: string, email: string) {
    const createdUser = await this.d1.db
      .insert(user)
      .values({
        id,
        email,
      })
      .returning({ id: user.id })
      .get();

    return createdUser;
  }

  public async getUserFromContext(c: Context): Promise<User | null> {
    const idCookie = new IdCookie(c);
    const d1 = new D1(c.env.DB);

    const id = await idCookie.getId();

    if (!id) {
      return null;
    }

    const firstUser = await d1.db.query.user.findFirst({
      where: eq(user.id, id),
    });

    if (!firstUser) {
      return null;
    }

    return firstUser;
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    const firstUser = await this.d1.db.query.user.findFirst({
      where: eq(user.email, email),
    });

    if (!firstUser) {
      return null;
    }

    return firstUser;
  }

  public async getUserByThreadId(threadId: string): Promise<User | null> {
    const firstUser = await this.d1.db.query.user.findFirst({
      where: eq(user.threadId, threadId),
    });

    if (!firstUser) {
      return null;
    }

    return firstUser;
  }
}

export const user = sqliteTable(
  'user',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),
    email: text('email').notNull().unique(),

    given_name: text('given_name'),
    family_name: text('family_name'),

    threadId: text('thread_id'),
    assistantId: text('assistant_id'),

    timezone: text('timezone'),
  },
  (table) => {
    return {
      emailIdx: index('user_email_idx').on(table.email),
    };
  }
);

export type User = InferSelectModel<typeof user>;

export type InsertUser = InferInsertModel<typeof user>;

export const userToIntegrationRelation = relations(user, ({ many }) => ({
  integrations: many(integration, {
    relationName: 'integrations',
  }),
}));

export { UserModel };
