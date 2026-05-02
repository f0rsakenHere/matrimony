import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export interface AuthResult {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  /** Firebase sign-in provider, e.g. "password", "google.com". */
  provider: string | null;
}

/**
 * Verify the Firebase ID token from the Authorization header.
 * Returns the decoded identity on success, or null if the token is
 * missing/invalid. Trust uid/email/provider from this result, NOT from
 * client-supplied request bodies.
 */
export async function verifyAuth(
  request: Request
): Promise<AuthResult | null> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const idToken = authHeader.slice(7);
  try {
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      emailVerified: Boolean(decoded.email_verified),
      provider:
        (decoded.firebase as { sign_in_provider?: string } | undefined)
          ?.sign_in_provider ?? null,
    };
  } catch {
    return null;
  }
}

/**
 * Require authentication. Returns the auth result or a 401 response.
 */
export async function requireAuth(
  request: Request
): Promise<AuthResult | NextResponse> {
  const result = await verifyAuth(request);
  if (!result) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return result;
}

/**
 * Require admin privileges. Returns the uid or a 401/403 response.
 */
export async function requireAdmin(
  request: Request
): Promise<{ uid: string } | NextResponse> {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  await connectDB();
  const user = await User.findOne({ firebaseUid: authResult.uid })
    .select("isAdmin")
    .lean();
  if (!(user as { isAdmin?: boolean })?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return authResult;
}
