
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, verifyJwt } from "@/lib/auth";

export async function PUT(request: Request) {
  try {
    const { currentPassword, newPassword } = await request.json();

    // 1. Verify User from Token
    const token = request.headers.get("cookie")?.split("; ").find(c => c.startsWith("admin_token="))?.split("=")[1];

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyJwt(token);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = payload.userId as string;

    // 2. Get User
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // 3. Verify Current Password
    const isValid = await verifyPassword(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ success: false, message: "현재 비밀번호가 일치하지 않습니다." }, { status: 400 });
    }

    // 4. Update Password
    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true, message: "비밀번호가 변경되었습니다." });

  } catch (error) {
    console.error("Password Change Error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
