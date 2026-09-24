import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth";
import { db } from "@/db";
import { auditLogs } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    await requireSuperAdmin(req);
    const logs = await db.select().from(auditLogs).orderBy(desc(auditLogs.id)).limit(100);
    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden: Super Admin required" }, { status: 403 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
