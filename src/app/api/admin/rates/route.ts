import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { VOUCHERS } from "@/lib/constants";

export async function GET() {
  // Sync Vouchers from code to DB
  // This ensures all vouchers in constants.tsx exist in the DB
  for (const v of VOUCHERS) {
    const rateValue = parseFloat(v.purchaseRate.replace(/[^0-9.]/g, "")) / 100;
    
    await prisma.rate.upsert({
      where: { voucherType: v.id },
      update: {}, // Don't overwrite existing user settings
      create: { 
        voucherType: v.id, 
        buyRate: rateValue 
      }
    });
  }

  const rates = await prisma.rate.findMany({
    orderBy: { voucherType: 'asc' }
  });
  
  return NextResponse.json(rates);
}

export async function POST(request: Request) {
  try {
    const { voucherType, buyRate } = await request.json();
    
    const rate = await prisma.rate.upsert({
      where: { voucherType },
      update: { buyRate: parseFloat(buyRate) },
      create: { 
        voucherType, 
        buyRate: parseFloat(buyRate) 
      }
    });

    return NextResponse.json({ success: true, rate });
  } catch (error) {
    console.error("Rate update error:", error);
    return NextResponse.json(
      { success: false, message: "시세 수정 실패" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const voucherType = searchParams.get('voucherType');

    if (!voucherType) return NextResponse.json({ success: false }, { status: 400 });

    await prisma.rate.delete({
      where: { voucherType }
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { voucherType, isActive } = await request.json();

    const rate = await prisma.rate.update({
      where: { voucherType },
      data: { isActive }
    });

    return NextResponse.json({ success: true, rate });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
