import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { desc, ilike, or } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    await requireSuperAdmin(req);
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    let allUsers;
    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      allUsers = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          phone: users.phone,
          role: users.role,
          status: users.status,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(
          or(
            ilike(users.name, term),
            ilike(users.email, term),
            ilike(users.phone, term)
          )
        )
        .orderBy(desc(users.id));
    } else {
      allUsers = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          phone: users.phone,
          role: users.role,
          status: users.status,
          createdAt: users.createdAt,
        })
        .from(users)
        .orderBy(desc(users.id));
    }

    return NextResponse.json({
      success: true,
      users: allUsers,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
    if (error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden: Super Admin required" }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || "Failed to fetch users" }, { status: 500 });
  }
}
