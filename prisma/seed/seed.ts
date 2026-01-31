import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../.generated/client';
import { countries } from './lists/countries.list';
import { users } from './lists/users.list';

async function executeSeeds() {
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

  try {
    await prisma.$transaction(async (tx) => {
      if (!(await tx.country.count())) {
        await tx.country.createMany({ skipDuplicates: true, data: countries });
      }

      if (!(await tx.user.count())) {
        await tx.user.createMany({ skipDuplicates: true, data: users });
      }
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

executeSeeds();
