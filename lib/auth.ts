import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

/**
 * Verify the Firebase ID token from the Authorization header.
 * Returns the decoded uid on success, or null if the token is missing/invalid.
 */
export async function verifyAuth(
  request: Request
): Promise<{ uid: string } | null> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const idToken = authHeader.slice(7);
  try {
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    return { uid: decoded.uid };
  } catch {
    return null;
  }
}

/**
 * Require authentication. Returns the uid or a 401 response.
 */
export async function requireAuth(
  request: Request
): Promise<{ uid: string } | NextResponse> {
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
