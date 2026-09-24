import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth";
import { db } from "@/db";
import { liveMatches, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireSuperAdmin(req);
    const { id } = await params;
    const matchId = parseInt(id, 10);

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

    const [updated] = await db
      .update(liveMatches)
      .set({
        league: league?.trim(),
        homeTeam: homeTeam?.trim(),
        awayTeam: awayTeam?.trim(),
        homeScore: homeScore !== undefined ? parseInt(homeScore, 10) : undefined,
        awayScore: awayScore !== undefined ? parseInt(awayScore, 10) : undefined,
        matchMinute: matchMinute !== undefined ? String(matchMinute) : undefined,
        status: status || undefined,
        matchDate: matchDate ? String(matchDate).trim() : undefined,
        matchTime: matchTime ? String(matchTime).trim() : undefined,
        predictionId: predictionId !== undefined ? (predictionId ? parseInt(predictionId, 10) : null) : undefined,
        predictionText: predictionText !== undefined ? (predictionText ? String(predictionText).trim() : null) : undefined,
        odds: odds !== undefined ? (odds ? String(odds).trim() : null) : undefined,
        liveCommentary: liveCommentary !== undefined ? (liveCommentary ? String(liveCommentary).trim() : null) : undefined,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(liveMatches.id, matchId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Live match not found" }, { status: 404 });
    }

    await db.insert(auditLogs).values({
      userId: admin.userId,
      userEmail: admin.email,
      action: "LIVE_MATCH_UPDATED",
      details: `Updated live match #${matchId}: ${updated.homeTeam} ${updated.homeScore}-${updated.awayScore} ${updated.awayTeam} (${updated.matchMinute})`,
      ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
    });

    return NextResponse.json({
      success: true,
      message: "Live match updated successfully!",
      match: updated,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireSuperAdmin(req);
    const { id } = await params;
    const matchId = parseInt(id, 10);

    const [deleted] = await db
      .delete(liveMatches)
      .where(eq(liveMatches.id, matchId))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    await db.insert(auditLogs).values({
      userId: admin.userId,
      userEmail: admin.email,
      action: "LIVE_MATCH_DELETED",
      details: `Deleted live match #${matchId}: ${deleted.homeTeam} vs ${deleted.awayTeam}`,
      ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
    });

    return NextResponse.json({
      success: true,
      message: "Live match deleted successfully!",
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
