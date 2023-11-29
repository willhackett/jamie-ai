import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { D1, createId, eq } from '@/service/d1';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { integration } from '.';
import { type Context } from 'hono';
import { IdCookie } from '@/util/id-cookie';

export const user = sqliteTable(
  'user',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),
    email: text('email').notNull().unique(),

    given_name: text('given_name'),
    family_name: text('family_name'),

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

export async function getUserFromContext(c: Context): Promise<User | null> {
  const idCookie = new IdCookie(c);
  const d1 = new D1(c);

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

export async function getUserById(
  c: Context,
  id: string
): Promise<User | null> {
  const d1 = new D1(c);

  const firstUser = await d1.db.query.user.findFirst({
    where: eq(user.id, id),
  });

  if (!firstUser) {
    return null;
  }

  return firstUser;
}

export async function createUser(
  c: Context,
  id: string,
  email: string
): Promise<{ id: string }> {
  const d1 = new D1(c);

  const createdUser = await d1.db
    .insert(user)
    .values({
      id,
      email,
    })
    .returning({ id: user.id })
    .get();

  return createdUser;
}
