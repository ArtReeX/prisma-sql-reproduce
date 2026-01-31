import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import os from 'os';
import postgres from 'postgres';
import { PrismaClient } from '../src/.generated/client';
import { speedExtension } from '../src/.generated/sql';

async function reproduce() {
  const client = new PrismaClient({
    adapter: new PrismaPg({
      keepAlive: true,
      connectionString: process.env.DATABASE_URL,

      min: Math.min(os.availableParallelism() * 1, 10),
      max: Math.min(os.availableParallelism() * 2, 20),

      idle_in_transaction_session_timeout: 30 * 1000,
      options: '-c random_page_cost=1.1 -c seq_page_cost=1.0 -c work_mem=64MB -c temp_buffers=16MB',
    }),

    log: ['info', 'warn', 'error'],
    omit: { user: { password: true } },
    transactionOptions: { maxWait: 2_000, timeout: 10_000 },
  });

  const extension = speedExtension({
    debug: true,
    postgres: postgres(process.env.DATABASE_URL, {
      keep_alive: 10_000,
      max: Math.min(os.availableParallelism() * 2, 20),
    }),
  });

  const user = await client.$extends(extension).user.findFirst({
    select: { id: true, isDeleted: true },
    where: { kickId: { not: null }, isDeleted: false },
  });

  console.log(user);
}

reproduce();
