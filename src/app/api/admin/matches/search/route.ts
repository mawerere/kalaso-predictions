import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth";
import { sportsDataService } from "@/lib/sports-api";

export async function GET(req: NextRequest) {
  try {
    await requireSuperAdmin(req);
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || searchParams.get("q") || "";

    const results = await sportsDataService.searchMatches(query);

    return NextResponse.json({
      success: true,
      query,
      results,
      count: results.length,
      isApiConfigured: Boolean(process.env.SPORTS_API_KEY && process.env.SPORTS_API_KEY.length > 5),
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden: Super Admin required" }, { status: 403 });
    return NextResponse.json({ error: error.message || "Failed to search matches" }, { status: 500 });
  }
}
