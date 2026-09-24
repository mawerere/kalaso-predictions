import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth";
import { db } from "@/db";
import { users, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireSuperAdmin(req);
    const { id } = await params;
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Check if target user is super admin
    const target = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!target[0]) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (target[0].role === "SUPER_ADMIN" && target[0].id === admin.userId) {
      return NextResponse.json({ error: "Cannot suspend your own admin account." }, { status: 400 });
    }

    const updated = await db
      .update(users)
      .set({ status: "SUSPENDED", updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    // Audit log
    await db.insert(auditLogs).values({
      userId: admin.userId,
      userEmail: admin.email,
      action: "USER_SUSPENDED",
      details: `Admin suspended user: ${target[0].name} (${target[0].email})`,
      ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
    });

    return NextResponse.json({
      success: true,
      message: `User ${target[0].name} has been suspended`,
      user: updated[0],
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || "Failed to suspend user" }, { status: 500 });
  }
}
