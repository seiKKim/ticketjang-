import { PrismaClient } from "@prisma/client";

// NOTE: In a real app, instantiate PrismaClient as a singleton
const prisma = new PrismaClient();

export async function checkBlacklist(
  identifier: string, // phone or account number
  type: "PHONE" | "ACCOUNT"
): Promise<boolean> {
  // Mock check for now
  if (identifier === "010-0000-0000" || identifier === "1234567890") {
    return true; // Is Blacklisted
  }
  
  // Real DB check
  // const entry = await prisma.blacklist.findUnique({ where: { value: identifier } });
  // return !!entry;

  return false;
}

export async function checkFraudRisk(
  ipAddress: string,
  userId: string
): Promise<{ isRisky: boolean; reason?: string }> {
  // 1. Check if IP has too many requests in last 10 mins
  // 2. Check if User has pending manual reviews
  
  console.log(`Checking fraud risk for IP: ${ipAddress}, User: ${userId}`);

  // Mock Logic
  if (ipAddress === "192.168.0.100") {
    return { isRisky: true, reason: "의심스러운 IP 대역입니다." };
  }

  return { isRisky: false };
}
