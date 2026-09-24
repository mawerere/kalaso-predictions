import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth";
import { db } from "@/db";
import { predictions, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireSuperAdmin(req);
    const { id } = await params;
    const predId = parseInt(id, 10);

    const body = await req.json();
    const { result, correctScore, status } = body;

    if (!result || !["WON", "LOST", "VOID", "PENDING"].includes(result.toUpperCase())) {
      return NextResponse.json({ error: "Invalid result value (WON, LOST, VOID, PENDING)." }, { status: 400 });
    }

    const cleanResult = result.toUpperCase();
    const cleanStatus = status || (cleanResult === "WON" || cleanResult === "LOST" || cleanResult === "VOID" ? "FINISHED" : "SCHEDULED");

    const [updated] = await db
      .update(predictions)
      .set({
        result: cleanResult,
        status: cleanStatus,
        correctScore: correctScore !== undefined ? (correctScore ? String(correctScore).trim() : null) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(predictions.id, predId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Prediction not found" }, { status: 404 });
    }

    await db.insert(auditLogs).values({
      userId: admin.userId,
      userEmail: admin.email,
      action: `RESULT_MARKED_${cleanResult}`,
      details: `Marked tip #${predId} (${updated.homeTeam} vs ${updated.awayTeam}) as ${cleanResult} ${correctScore ? `[Score: ${correctScore}]` : ""}`,
      ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
    });

    return NextResponse.json({
      success: true,
      message: `Prediction marked as ${cleanResult}!`,
      prediction: updated,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
