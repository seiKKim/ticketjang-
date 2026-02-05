import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rates = await prisma.rate.findMany({
      where: { isActive: true },
      select: { voucherType: true, buyRate: true }
    });

    return NextResponse.json({ 
      success: true, 
      data: rates,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch rates" }, 
      { status: 500 }
    );
  }
}
