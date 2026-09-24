import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth";
import { db } from "@/db";
import { predictions, auditLogs } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    await requireSuperAdmin(req);
    const list = await db.select().from(predictions).orderBy(desc(predictions.id));
    return NextResponse.json({ success: true, predictions: list });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden: Super Admin required" }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || "Failed to fetch predictions" }, { status: 500 });
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

    if (!league || !homeTeam || !awayTeam || !prediction || !odds || !matchDate || !matchTime) {
      return NextResponse.json(
        { error: "Please fill in all required fields (League, Home Team, Away Team, Prediction, Odds, Date, Time)." },
        { status: 400 }
      );
    }

    const [newPred] = await db
      .insert(predictions)
      .values({
        league: league.trim(),
        homeTeam: homeTeam.trim(),
        awayTeam: awayTeam.trim(),
        prediction: prediction.trim(),
        odds: String(odds).trim(),
        matchDate: String(matchDate).trim(),
        matchTime: String(matchTime).trim(),
        status: status || "SCHEDULED",
        result: result || "PENDING",
        correctScore: correctScore ? String(correctScore).trim() : null,
        confidence: confidence ? Number(confidence) : 85,
        category: category || "FREE_TIP",
        notes: notes ? String(notes).trim() : null,
        isFeatured: Boolean(isFeatured),
        createdBy: admin.userId,
      })
      .returning();

    // Audit log
    await db.insert(auditLogs).values({
      userId: admin.userId,
      userEmail: admin.email,
      action: "PREDICTION_CREATED",
      details: `Created tip: ${homeTeam} vs ${awayTeam} (${prediction} @ ${odds})`,
      ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
    });

    return NextResponse.json({
      success: true,
      message: "Prediction published successfully!",
      prediction: newPred,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden: Super Admin required" }, { status: 403 });
    }
    console.error("Create prediction error:", error);
    return NextResponse.json({ error: error.message || "Failed to create prediction" }, { status: 500 });
  }
}
