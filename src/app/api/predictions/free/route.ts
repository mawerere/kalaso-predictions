import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { predictions } from "@/db/schema";
import { ensureDatabaseTablesAndSeed } from "@/lib/seed";
import { desc, eq, and, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    await ensureDatabaseTablesAndSeed();

    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get("limit");
    const resultParam = searchParams.get("result"); // PENDING | WON | LOST | VOID
    const leagueParam = searchParams.get("league");
    const dateParam = searchParams.get("date"); // YYYY-MM-DD
    const featuredParam = searchParams.get("featured");

    const conditions = [];

    if (resultParam && resultParam !== "ALL") {
      conditions.push(eq(predictions.result, resultParam.toUpperCase()));
    }
    if (leagueParam && leagueParam !== "ALL") {
      conditions.push(eq(predictions.league, leagueParam));
    }
    if (dateParam) {
      conditions.push(eq(predictions.matchDate, dateParam));
    }
    if (featuredParam === "true") {
      conditions.push(eq(predictions.isFeatured, true));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const tips = await db
      .select()
      .from(predictions)
      .where(whereClause)
      .orderBy(
        sql`CASE 
              WHEN status = 'LIVE' THEN 1
              WHEN result = 'PENDING' THEN 2
              WHEN result = 'WON' THEN 3
              ELSE 4
            END`,
        desc(predictions.matchDate),
        desc(predictions.id)
      )
      .limit(limit && !isNaN(limit) ? limit : 100);

    // Get aggregated stats for confidence & badges
    const allTips = await db.select().from(predictions);
    const wonCount = allTips.filter((t) => t.result === "WON").length;
    const lostCount = allTips.filter((t) => t.result === "LOST").length;
    const pendingCount = allTips.filter((t) => t.result === "PENDING").length;
    const voidCount = allTips.filter((t) => t.result === "VOID").length;
    const finishedCount = wonCount + lostCount;
    const winRate = finishedCount > 0 ? Math.round((wonCount / finishedCount) * 100) : 88;

    return NextResponse.json({
      success: true,
      predictions: tips,
      stats: {
        total: allTips.length,
        won: wonCount,
        lost: lostCount,
        pending: pendingCount,
        void: voidCount,
        winRate,
      },
    });
  } catch (error: any) {
    console.error("Fetch predictions error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch predictions" },
      { status: 500 }
    );
  }
}
