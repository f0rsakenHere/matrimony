import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getMemberByUid, memberJson } from "@/lib/server/members";

export async function GET(request: Request) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const user = await getMemberByUid(authResult.uid);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user: memberJson(user) });
  } catch (error) {
    console.error("[/api/profile] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
