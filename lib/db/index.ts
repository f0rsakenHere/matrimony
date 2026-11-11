import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

declare global {
  var __pgPool: Pool | undefined;
}

function getPool(): Pool {
  if (!global.__pgPool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    global.__pgPool = new Pool({ connectionString, max: 10 });
  }
  return global.__pgPool;
}

let _db: NodePgDatabase<typeof schema> | undefined;

/**
 * Lazily-initialised Drizzle client. Lazy so `next build` doesn't need a
 * database connection.
 */
export const db = new Proxy({} as NodePgDatabase<typeof schema>, {
  get(_target, prop) {
    if (!_db) _db = drizzle(getPool(), { schema });
    return Reflect.get(_db, prop, _db);
  },
});

export { schema };
