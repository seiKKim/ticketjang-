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
    console.log('Successfully connected to server!')
  } catch(e) {
    console.error('Connection to server failed:')
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
