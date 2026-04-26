import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";

let app: App;
let adminAuth: Auth;

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. " +
        "Generate a service account key from Firebase Console → Project Settings → Service Accounts, " +
        "then base64-encode the JSON and set it as FIREBASE_SERVICE_ACCOUNT_KEY in .env.local"
    );
  }

  const serviceAccount = JSON.parse(
    Buffer.from(serviceAccountKey, "base64").toString("utf-8")
  );

  return initializeApp({
    credential: cert(serviceAccount),
  });
}

export function getAdminAuth(): Auth {
  if (!adminAuth) {
    app = getAdminApp();
    adminAuth = getAuth(app);
  }
  return adminAuth;
}
