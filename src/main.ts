import { LogOptions } from 'src/.generated/internal/class';
import { PrismaClientOptions } from 'src/.generated/internal/prismaNamespace';
import { EXTENSION_OPTIONS, PRISMA_OPTIONS } from 'src/config';
import { PrismaClient } from '../src/.generated/client';
import { speedExtension } from '../src/.generated/sql';

async function reproduce() {
  const prisma = new PrismaClient<typeof PRISMA_OPTIONS, LogOptions<PrismaClientOptions>>(PRISMA_OPTIONS);
  const client = prisma.$extends(speedExtension(EXTENSION_OPTIONS));

  const user = await client.user.findFirst({
    select: { id: true, isDeleted: true },
    where: { kickId: { not: null }, isDeleted: false },
  });

  console.log(user);
}

reproduce();
