import { PrismaClient } from '@prisma/client';

/**
 * A single shared PrismaClient instance, not one created per-request.
 * Prisma manages its own connection pool internally - creating a new client
 * per request would exhaust Postgres's connection limit under load instead
 * of reusing connections efficiently.
 */
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});
