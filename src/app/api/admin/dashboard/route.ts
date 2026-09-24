import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth";
import { db } from "@/db";
import { users, predictions, liveMatches, auditLogs } from "@/db/schema";
import { desc, count } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const admin = await requireSuperAdmin(req);

    // Total Users
    const userRows = await db.select().from(users).orderBy(desc(users.id));
    const allPredictions = await db.select().from(predictions).orderBy(desc(predictions.id));
    const allLiveMatches = await db.select().from(liveMatches).orderBy(desc(liveMatches.id));
    const recentLogs = await db.select().from(auditLogs).orderBy(desc(auditLogs.id)).limit(15);

    const wonCount = allPredictions.filter((p) => p.result === "WON").length;
    const lostCount = allPredictions.filter((p) => p.result === "LOST").length;
    const pendingCount = allPredictions.filter((p) => p.result === "PENDING").length;
    const voidCount = allPredictions.filter((p) => p.result === "VOID").length;
    const activeUsersCount = userRows.filter((u) => u.status === "ACTIVE").length;
    const suspendedUsersCount = userRows.filter((u) => u.status === "SUSPENDED").length;

    const finished = wonCount + lostCount;
    const winRate = finished > 0 ? Math.round((wonCount / finished) * 100) : 100;

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: userRows.length,
        activeUsers: activeUsersCount,
        suspendedUsers: suspendedUsersCount,
        totalPredictions: allPredictions.length,
        totalLiveMatches: allLiveMatches.length,
        wonPredictions: wonCount,
        lostPredictions: lostCount,
        pendingPredictions: pendingCount,
        voidPredictions: voidCount,
        winRate,
      },
      recentPredictions: allPredictions.slice(0, 10),
      recentUsers: userRows.slice(0, 10),
      recentLogs,
      admin: {
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
    if (error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Access denied. Super Admin privileges required." }, { status: 403 });
    }
    console.error("Admin dashboard error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
