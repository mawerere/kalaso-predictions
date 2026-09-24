import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, auditLogs } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { signToken } from "@/lib/jwt";
import { ensureDatabaseTablesAndSeed } from "@/lib/seed";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    await ensureDatabaseTablesAndSeed();
    const body = await req.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "All fields (Name, Email, Phone, Password) are required." },
        { status: 400 }
      );
    }

    const cleanEmail = typeof email === "string" ? email.toLowerCase().trim() : "";
    const emailParts = cleanEmail.split("@");
    const emailDomain = emailParts[1] || "";
    const validEmail =
      emailParts.length === 2 &&
      cleanEmail.length <= 254 &&
      emailParts[0].length > 0 &&
      emailParts[0].length <= 64 &&
      /^[^\s@]+$/.test(emailParts[0]) &&
      emailDomain.length >= 4 &&
      /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i.test(emailDomain);

    if (!validEmail) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Check if user exists
    const existing = await db.select().from(users).where(eq(users.email, cleanEmail)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please login." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const [newUser] = await db
      .insert(users)
      .values({
        name: name.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        passwordHash,
        role: "USER",
        status: "ACTIVE",
      })
      .returning();

    // Create audit log
    await db.insert(auditLogs).values({
      userId: newUser.id,
      userEmail: newUser.email,
      action: "USER_REGISTERED",
      details: `New user registration: ${newUser.name} (${newUser.phone})`,
      ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
    });

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone,
      role: newUser.role as "USER" | "SUPER_ADMIN",
    });

    const response = NextResponse.json({
      success: true,
      message: "Account created successfully!",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
      token,
    });

    // Set secure HTTP cookie
    response.cookies.set("kalaso_token", token, {
      httpOnly: false, // Accessible to client app
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during registration." },
      { status: 500 }
    );
  }
}
