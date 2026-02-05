import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "mysql://globepoint:globepoint@180.210.83.9:3306/ticketjang"
    },
  },
})

async function main() {
  try {
    await prisma.$connect()
    console.log('Successfully connected to new database!')
    const dbs = await prisma.$queryRaw`SHOW DATABASES`
    console.log('Available databases:', dbs)
  } catch(e) {
    console.error('Connection failed:')
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
