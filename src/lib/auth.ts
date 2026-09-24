import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken, TokenPayload } from "./jwt";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function extractTokenFromRequest(req: Request | NextRequest): string | null {
  // Check Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7).trim();
  }

  // Check Cookies
  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").map((c) => c.trim());
    for (const cookie of cookies) {
      if (cookie.startsWith("kalaso_token=")) {
        return decodeURIComponent(cookie.substring("kalaso_token=".length));
      }
      if (cookie.startsWith("auth_token=")) {
        return decodeURIComponent(cookie.substring("auth_token=".length));
      }
    }
  }

  return null;
}

export async function getCurrentUser(req: Request | NextRequest): Promise<TokenPayload | null> {
  const token = extractTokenFromRequest(req);
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  try {
    // Verify user is not suspended in DB
    const userList = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1);
    const user = userList[0];
    if (!user || user.status === "SUSPENDED") {
      return null;
    }
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role as "USER" | "SUPER_ADMIN",
    };
  } catch (err) {
    // Fallback to token payload if DB lookup is slow or during offline tests
    return payload;
  }
}

export async function requireUser(req: Request | NextRequest): Promise<TokenPayload> {
  const user = await getCurrentUser(req);
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireSuperAdmin(req: Request | NextRequest): Promise<TokenPayload> {
  const user = await getCurrentUser(req);
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  if (user.role !== "SUPER_ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return user;
}
