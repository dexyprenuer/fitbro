import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Prisma CLI (migrate/studio) needs a DIRECT connection, not the pgbouncer
    // pooling URL — that's why this points at DIRECT_URL, not DATABASE_URL.
    url: env('DIRECT_URL'),
  },
});