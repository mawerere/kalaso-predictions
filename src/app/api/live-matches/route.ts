import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { liveMatches, predictions } from "@/db/schema";
import { ensureDatabaseTablesAndSeed } from "@/lib/seed";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    await ensureDatabaseTablesAndSeed();

    const matches = await db
      .select()
      .from(liveMatches)
      .where(eq(liveMatches.isPublished, true))
      .orderBy(desc(liveMatches.id));

    return NextResponse.json({
      success: true,
      matches,
    });
  } catch (error: any) {
    console.error("Fetch live matches error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch live matches" },
      { status: 500 }
    );
  }
}
