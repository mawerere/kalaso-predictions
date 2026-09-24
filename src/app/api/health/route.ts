import { NextResponse } from "next/server";
import { ensureDatabaseTablesAndSeed } from "@/lib/seed";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Run seed and table init check
    await ensureDatabaseTablesAndSeed();

    // Verify DB connectivity
    const res = await db.execute(sql`SELECT 1 as health`);

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "Kalaso Predictions API",
      version: "1.0.0",
      database: "connected",
    });
  } catch (err: any) {
    console.error("Healthcheck error:", err);
    return NextResponse.json(
      {
        status: "unhealthy",
        error: err?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
