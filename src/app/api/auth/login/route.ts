import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, auditLogs } from "@/db/schema";
import { comparePassword } from "@/lib/auth";
import { signToken } from "@/lib/jwt";
import { ensureDatabaseTablesAndSeed } from "@/lib/seed";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    await ensureDatabaseTablesAndSeed();
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const userList = await db.select().from(users).where(eq(users.email, cleanEmail)).limit(1);
    const user = userList[0];

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email address or password." },
        { status: 401 }
      );
    }

    if (user.status === "SUSPENDED") {
      return NextResponse.json(
        { error: "Your account has been suspended. Please contact Kalaso support on WhatsApp (+256745090955)." },
        { status: 403 }
      );
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email address or password." },
        { status: 401 }
      );
    }

    // Log login
    await db.insert(auditLogs).values({
      userId: user.id,
      userEmail: user.email,
      action: user.role === "SUPER_ADMIN" ? "ADMIN_LOGIN" : "USER_LOGIN",
      details: `${user.role} logged in: ${user.name}`,
      ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role as "USER" | "SUPER_ADMIN",
    });

    const response = NextResponse.json({
      success: true,
      message: "Login successful!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    });

    response.cookies.set("kalaso_token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during login." },
      { status: 500 }
    );
  }
}
