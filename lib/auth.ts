import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { members } from "@/lib/db/schema";

export interface AuthResult {
  /** Better Auth user id. Matches members.uid. */
  uid: string;
  email: string | null;
  emailVerified: boolean;
}

/**
 * Resolve the signed-in user from the session cookie. Trust uid/email from
 * this result, NOT from client-supplied request bodies.
 */
export async function verifyAuth(request: Request): Promise<AuthResult | null> {
  try {
    const result = await auth.api.getSession({ headers: request.headers });
    if (!result) return null;
    return {
      uid: result.user.id,
      email: result.user.email ?? null,
      emailVerified: Boolean(result.user.emailVerified),
    };
  } catch {
    return null;
  }
}

/** Require authentication. Returns the auth result or a 401 response. */
export async function requireAuth(request: Request): Promise<AuthResult | NextResponse> {
  const result = await verifyAuth(request);
  if (!result) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return result;
}

/** Require admin privileges (members.is_admin). Returns 401/403 otherwise. */
export async function requireAdmin(request: Request): Promise<AuthResult | NextResponse> {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  const [m] = await db
    .select({ isAdmin: members.isAdmin })
    .from(members)
    .where(eq(members.uid, authResult.uid))
    .limit(1);
  if (!m?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return authResult;
}

/** Client IP for rate limiting. nginx sets X-Real-IP from the socket address. */
export function clientIp(request: Request): string {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ??
    "unknown"
  );
}
