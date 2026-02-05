
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Connecting...');
    await prisma.$connect()
    
    // 1. Check if we can select all fields including updatedAt
    console.log('Fetching first rate...');
    const rate = await prisma.rate.findFirst();
    console.log('Rate found:', rate);
    
    if (rate) {
        console.log('Keys in rate object:', Object.keys(rate));
        if ('updatedAt' in rate) {
            console.log('updatedAt exists and is:', rate.updatedAt);
        } else {
            console.error('CRITICAL: updatedAt is MISSING in the returned object!');
        }
    } else {
        console.log('No rates found to check structure.');
    }

    // 2. Try an UPSERT explicitly to reproduce the crash
    console.log('Attempting Upsert...');
    const now = Date.now();
    const testType = `TEST_${now}`;
    
    try {
        const result = await prisma.rate.upsert({
            where: { voucherType: 'CULTURE' }, // Use a known one or random
            update: { buyRate: 0.88 },
            create: { voucherType: 'CULTURE', buyRate: 0.88 }
        });
        console.log('Upsert successful:', result);
    } catch (upsertError) {
        console.error('Upsert FAILED:', upsertError);
    }

  } catch(e) {
    console.error('General Error:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
