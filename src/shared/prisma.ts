// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { env } from '../../prisma/env';

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.DATABASE_URL,
    },
  },
});
