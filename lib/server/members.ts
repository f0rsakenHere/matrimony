import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { members, type Member } from "@/lib/db/schema";
import { withId } from "@/lib/db/helpers";
import { normalizeBiodata } from "@/lib/types/biodata";

export async function getMemberByUid(uid: string): Promise<Member | undefined> {
  const [m] = await db.select().from(members).where(eq(members.uid, uid)).limit(1);
  return m;
}

export async function getMemberById(id: string): Promise<Member | undefined> {
  const [m] = await db.select().from(members).where(eq(members.id, id)).limit(1);
  return m;
}

/** Full member row as JSON for the member themselves or an admin. */
export function memberJson(m: Member) {
  return withId({ ...m, biodata: normalizeBiodata(m.biodata) });
}
