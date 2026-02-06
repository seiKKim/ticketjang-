
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const phoneNumber = args[0];
  const password = args[1];

  if (!phoneNumber || !password) {
    console.error("Usage: npx tsx scripts/create-admin.ts <phoneNumber> <password>");
    process.exit(1);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const user = await prisma.user.upsert({
      where: { phoneNumber },
      update: {
        role: "ADMIN",
        password: hashedPassword,
      },
      create: {
        phoneNumber,
        name: "Admin",
        bankName: "AdminBank",
        accountNumber: "0000",
        role: "ADMIN",
        password: hashedPassword,
      },
    });

    console.log(`✅ Admin user configured: ${user.name} (${user.phoneNumber})`);
  } catch (e) {
    console.error("Failed to create admin:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
