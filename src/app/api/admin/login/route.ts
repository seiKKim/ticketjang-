import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signJwt } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { id, password } = await request.json();

    // The 'id' in login modal is treated as phoneNumber for admin lookup
    const user = await prisma.user.findUnique({
      where: { phoneNumber: id },
    });

    if (!user || user.role !== "ADMIN" || !user.password) {
      return NextResponse.json(
        { success: false, message: "접근 권한이 없거나 정보가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "비밀번호가 일치하지 않습니다." },
        { status: 401 }
      );
    }

    // Update login time
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Create JWT
    const token = await signJwt({
      userId: user.id,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({ success: true });
    
    // Set cookie that expires in 24 hours
    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("Login Check Error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
