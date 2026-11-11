/**
 * Grant (or revoke) admin access for a registered member.
 *
 * The person must have registered at /register first.
 *
 * Usage:
 *   npx tsx scripts/make-admin.ts someone@example.com
 *   npx tsx scripts/make-admin.ts someone@example.com --revoke
 *
 * Requires DATABASE_URL in the environment (or .env).
 */
import "dotenv/config";
import { Pool } from "pg";

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  const revoke = process.argv.includes("--revoke");
  if (!email) {
    console.error("Usage: npx tsx scripts/make-admin.ts <email> [--revoke]");
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const res = await pool.query(
      `UPDATE members SET is_admin = $1, updated_at = now()
       WHERE is_shadow = false AND lower(email) = $2
       RETURNING id, email, is_admin`,
      [!revoke, email]
    );
    if (res.rowCount === 0) {
      console.error(`No registered member with email ${email}. Register at /register first.`);
      process.exit(1);
    }
    console.log(`${revoke ? "Revoked" : "Granted"} admin:`, res.rows[0]);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
