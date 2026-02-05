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
    await prisma.$executeRawUnsafe('CREATE DATABASE IF NOT EXISTS ticketjang')
    console.log('Database created successfully')
  } catch(e) {
    console.error('Failed to create database:')
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
