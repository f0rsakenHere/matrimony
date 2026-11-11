import { NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { members } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth";
import { bio, sisterHasWali } from "@/lib/db/helpers";
import { getMemberByUid } from "@/lib/server/members";

export async function GET(request: Request) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const uid = authResult.uid;

    const currentUser = await getMemberByUid(uid);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userGender = currentUser.biodata?.personal?.gender || "";
    if (!userGender) {
      return NextResponse.json({ profiles: [] });
    }
    const targetGender = userGender === "Male" ? "Female" : "Male";

    // Opposite gender, not self, never shadow profiles.
    const rows = await db
      .select({
        id: members.id,
        profileName: members.profileName,
        photoURL: members.photoURL,
        biodata: members.biodata,
      })
      .from(members)
      .where(
        and(
          ne(members.uid, uid),
          eq(bio(members.biodata, "personal", "gender"), targetGender),
          eq(members.isShadow, false),
          sisterHasWali(members.biodata)
        )
      );

    const profiles = rows.map((r) => ({
      _id: r.id,
      profileName: r.profileName,
      photoURL: r.photoURL,
      biodata: {
        personal: r.biodata?.personal,
        education: r.biodata?.education,
        religious: r.biodata?.religious,
        lifestyle: r.biodata?.lifestyle,
        aboutMe: r.biodata?.aboutMe,
      },
    }));

    return NextResponse.json({ profiles });
  } catch (error) {
    console.error("Profiles fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
