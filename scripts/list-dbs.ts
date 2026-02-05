import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "mysql://bookclub_admin:Bookclub2025!%40%23SecurePass@133.186.211.196:3306/?ssl=false"
    },
  },
})

async function main() {
  try {
    await prisma.$connect()
    const dbs = await prisma.$queryRaw`SHOW DATABASES`
    console.log('Available databases:', dbs)
  } catch(e) {
    console.error('Failed to list databases:')
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
