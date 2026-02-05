
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { id, password } = await request.json();

    const ADMIN_ID = process.env.ADMIN_ID;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (id === ADMIN_ID && password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true });
      
      // Set cookie that expires in 24 hours
      response.cookies.set({
        name: "admin_session",
        value: "true",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
