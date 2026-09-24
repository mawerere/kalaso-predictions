import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth";
import { db } from "@/db";
import { predictions, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireSuperAdmin(req);
    const { id } = await params;
    const predId = parseInt(id, 10);

    const rows = await db.select().from(predictions).where(eq(predictions.id, predId)).limit(1);
    if (!rows[0]) {
      return NextResponse.json({ error: "Prediction not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, prediction: rows[0] });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireSuperAdmin(req);
    const { id } = await params;
    const predId = parseInt(id, 10);

    const body = await req.json();
    const {
      league,
      homeTeam,
      awayTeam,
      prediction,
      odds,
      matchDate,
      matchTime,
      status,
      result,
      correctScore,
      confidence,
      category,
      notes,
      isFeatured,
    } = body;

    const [updated] = await db
      .update(predictions)
      .set({
        league: league?.trim(),
        homeTeam: homeTeam?.trim(),
        awayTeam: awayTeam?.trim(),
        prediction: prediction?.trim(),
        odds: odds ? String(odds).trim() : undefined,
        matchDate: matchDate ? String(matchDate).trim() : undefined,
        matchTime: matchTime ? String(matchTime).trim() : undefined,
        status: status || undefined,
        result: result || undefined,
        correctScore: correctScore !== undefined ? (correctScore ? String(correctScore).trim() : null) : undefined,
        confidence: confidence !== undefined ? Number(confidence) : undefined,
        category: category || undefined,
        notes: notes !== undefined ? (notes ? String(notes).trim() : null) : undefined,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(predictions.id, predId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Prediction not found" }, { status: 404 });
    }

    // Audit log
    await db.insert(auditLogs).values({
      userId: admin.userId,
      userEmail: admin.email,
      action: "PREDICTION_UPDATED",
      details: `Updated tip #${predId}: ${updated.homeTeam} vs ${updated.awayTeam}`,
      ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
    });

    return NextResponse.json({
      success: true,
      message: "Prediction updated successfully!",
      prediction: updated,
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
    const predId = parseInt(id, 10);

    const [deleted] = await db
      .delete(predictions)
      .where(eq(predictions.id, predId))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Prediction not found" }, { status: 404 });
    }

    await db.insert(auditLogs).values({
      userId: admin.userId,
      userEmail: admin.email,
      action: "PREDICTION_DELETED",
      details: `Deleted tip #${predId}: ${deleted.homeTeam} vs ${deleted.awayTeam}`,
      ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
    });

    return NextResponse.json({
      success: true,
      message: "Prediction deleted successfully!",
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
