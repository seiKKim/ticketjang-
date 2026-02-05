
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: "ID and status are required" },
        { status: 400 }
      );
    }

    // Optional: Add validation for allowed status transitions if needed
    
    // Update transaction
    const transaction = await prisma.transaction.update({
      where: { id },
      data: { 
        status,
        updatedAt: new Date(),
        // If completing, set completedAt
        completedAt: status === 'COMPLETED' ? new Date() : undefined,
        // If verifying, set processedAt
        processedAt: ['VERIFIED', 'COMPLETED'].includes(status) ? new Date() : undefined
      },
    });

    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    console.error("Transaction update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update transaction" },
      { status: 500 }
    );
  }
}
