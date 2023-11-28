import type { Config } from 'drizzle-kit';

export default {
  schema: './src/model/index.ts',
  out: './drizzle',
  driver: 'better-sqlite',
} satisfies Config;
