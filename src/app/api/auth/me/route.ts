import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const userPayload = await getCurrentUser(req);
    if (!userPayload) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Refresh from DB
    const userList = await db.select().from(users).where(eq(users.id, userPayload.userId)).limit(1);
    const user = userList[0];

    if (!user || user.status === "SUSPENDED") {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
