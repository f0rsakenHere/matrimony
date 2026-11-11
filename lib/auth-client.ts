import { createAuthClient } from "better-auth/react";

// Same-origin: the client talks to /api/auth/* on whatever host serves the app.
export const authClient = createAuthClient();
