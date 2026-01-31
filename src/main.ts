import { EXTENSION_OPTIONS, PRISMA_OPTIONS } from 'src/config';
import { PrismaClient } from '../prisma/.generated/client';
import { speedExtension } from '../prisma/.generated/sql';

async function reproduce() {
  const prisma = new PrismaClient<typeof PRISMA_OPTIONS>(PRISMA_OPTIONS);
  const client = prisma.$extends(speedExtension(EXTENSION_OPTIONS));

  const user = await client.user.findFirst({
    where: { kickId: null, isDeleted: false, country: { countryCode: 'US' } },
    select: { id: true, isDeleted: true, country: { select: { countryNameEn: true } } },
  });

  console.table(user);
}

reproduce();
