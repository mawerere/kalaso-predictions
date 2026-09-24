import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth";
import { db } from "@/db";
import { systemSettings, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const list = await db.select().from(systemSettings);
    const settingsMap: Record<string, string> = {};
    for (const item of list) {
      settingsMap[item.key] = item.value;
    }
    return NextResponse.json({
      success: true,
      settings: settingsMap,
      isSportsApiConfigured: Boolean(process.env.SPORTS_API_KEY && process.env.SPORTS_API_KEY.length > 5),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireSuperAdmin(req);
    const body = await req.json();

    const keys = Object.keys(body);
    for (const key of keys) {
      const val = String(body[key]);
      const existing = await db.select().from(systemSettings).where(eq(systemSettings.key, key)).limit(1);
      if (existing.length > 0) {
        await db.update(systemSettings).set({ value: val, updatedAt: new Date() }).where(eq(systemSettings.key, key));
      } else {
        await db.insert(systemSettings).values({ key, value: val });
      }
    }

    await db.insert(auditLogs).values({
      userId: admin.userId,
      userEmail: admin.email,
      action: "SETTINGS_UPDATED",
      details: `Admin updated system settings: ${keys.join(", ")}`,
      ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
    });

    return NextResponse.json({ success: true, message: "Settings saved successfully!" });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden: Super Admin required" }, { status: 403 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
