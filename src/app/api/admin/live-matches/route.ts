import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth";
import { db } from "@/db";
import { liveMatches, auditLogs } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    await requireSuperAdmin(req);
    const list = await db.select().from(liveMatches).orderBy(desc(liveMatches.id));
    return NextResponse.json({ success: true, matches: list });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden: Super Admin required" }, { status: 403 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireSuperAdmin(req);
    const body = await req.json();

    const {
      league,
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      matchMinute,
      status,
      matchDate,
      matchTime,
      predictionId,
      predictionText,
      odds,
      liveCommentary,
      isPublished,
    } = body;

    if (!league || !homeTeam || !awayTeam || !matchDate || !matchTime) {
      return NextResponse.json(
        { error: "Please fill all required match fields (League, Home Team, Away Team, Match Date, Match Time)." },
        { status: 400 }
      );
    }

    const [created] = await db
      .insert(liveMatches)
      .values({
        league: league.trim(),
        homeTeam: homeTeam.trim(),
        awayTeam: awayTeam.trim(),
        homeScore: homeScore !== undefined ? parseInt(homeScore, 10) : 0,
        awayScore: awayScore !== undefined ? parseInt(awayScore, 10) : 0,
        matchMinute: matchMinute || "1'",
        status: status || "LIVE",
        matchDate: matchDate.trim(),
        matchTime: matchTime.trim(),
        predictionId: predictionId ? parseInt(predictionId, 10) : null,
        predictionText: predictionText ? predictionText.trim() : null,
        odds: odds ? String(odds).trim() : null,
        liveCommentary: liveCommentary ? liveCommentary.trim() : null,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      })
      .returning();

    await db.insert(auditLogs).values({
      userId: admin.userId,
      userEmail: admin.email,
      action: "LIVE_MATCH_CREATED",
      details: `Created live match: ${homeTeam} vs ${awayTeam}`,
      ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
    });

    return NextResponse.json({
      success: true,
      message: "Live match created successfully!",
      match: created,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
