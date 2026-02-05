import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ success: true, data: notices });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, category, isActive, isPinned } = body;

    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        category: category || "NOTICE",
        isActive: isActive !== undefined ? isActive : true,
        isPinned: isPinned !== undefined ? isPinned : false
      }
    });

    return NextResponse.json({ success: true, data: notice });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Create failed" }, { status: 500 });
  }
}
