
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Connecting to database defined in system environment or .env...');
    const url = process.env.DATABASE_URL;
    console.log('Using URL:', url ? url.replace(/:[^:@]*@/, ':****@') : 'undefined'); // Mask password

    await prisma.$connect()
    console.log('Connected.');

    // 1. Try to fetch a dummy rate or count rates
    console.log('Checking Rate table access...');
    const count = await prisma.rate.count();
    console.log('Rate count:', count);

    // 2. Try to fetch one rate to see columns implicitly
    const firstRate = await prisma.rate.findFirst();
    console.log('First Rate:', firstRate);

    // 3. Try specifically fetching by ID if one exists, or simulate what the app does
    // App does upsert on voucherType 'CULTURE' for example.
    
  } catch(e) {
    console.error('Error during verification:');
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
