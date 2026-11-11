import { NextResponse } from "next/server";
import { and, count, desc, eq, inArray, ne, or, type SQL } from "drizzle-orm";
import { db } from "@/lib/db";
import { members } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth";
import { bio, biodataFilters, containsCI, sisterHasWali } from "@/lib/db/helpers";
import { apiLimiter } from "@/lib/rate-limit";
import { getMemberByUid } from "@/lib/server/members";

export async function GET(request: Request) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const uid = authResult.uid;

    const { success } = apiLimiter.check(uid);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("q")?.trim();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10) || 12));

    // Exclude self and shadow profiles (they haven't consented to being
    // browsed by registered users).
    const conds: SQL[] = [ne(members.uid, uid), eq(members.isShadow, false), sisterHasWali(members.biodata)];

    // Default to opposite gender; an explicit ?gender= overrides (handled
    // by biodataFilters below).
    const genderExpr = bio(members.biodata, "personal", "gender");
    if (!searchParams.get("gender")) {
      const me = await getMemberByUid(uid);
      const myGender = me?.biodata?.personal?.gender;
      conds.push(
        myGender
          ? eq(genderExpr, myGender === "Male" ? "Female" : "Male")
          : inArray(genderExpr, ["Male", "Female"])
      );
    }

    conds.push(...biodataFilters(members.biodata, searchParams));

    if (search) {
      conds.push(
        or(
          containsCI(members.profileName, search),
          containsCI(bio(members.biodata, "personal", "city"), search),
          containsCI(bio(members.biodata, "personal", "country"), search),
          containsCI(bio(members.biodata, "education", "occupation"), search),
          containsCI(bio(members.biodata, "education", "institution"), search),
          containsCI(bio(members.biodata, "education", "fieldOfStudy"), search)
        )!
      );
    }

    const where = and(...conds);
    const [rows, [{ total }]] = await Promise.all([
      db
        .select({
          id: members.id,
          profileName: members.profileName,
          photoURL: members.photoURL,
          biodata: members.biodata,
        })
        .from(members)
        .where(where)
        .orderBy(desc(members.updatedAt))
        .limit(limit)
        .offset((page - 1) * limit),
      db.select({ total: count() }).from(members).where(where),
    ]);

    // Wali contact details are never exposed in search results.
    const profiles = rows.map((r) => {
      const family = { ...(r.biodata?.family ?? {}) } as Record<string, string>;
      for (const k of ["waliName", "waliPhone", "waliEmail", "waliRelationship", "waliContactMethod"]) {
        if (k in family) family[k] = "";
      }
      return {
        _id: r.id,
        profileName: r.profileName,
        photoURL: r.photoURL,
        biodata: {
          personal: r.biodata?.personal,
          education: r.biodata?.education,
          religious: r.biodata?.religious,
          lifestyle: r.biodata?.lifestyle,
          family,
          aboutMe: r.biodata?.aboutMe,
        },
      };
    });

    return NextResponse.json({
      profiles,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
