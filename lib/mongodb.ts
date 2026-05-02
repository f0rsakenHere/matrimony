import mongoose from "mongoose";
import dns from "node:dns";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  resolvedUri: string | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache =
  global.mongoose ?? { conn: null, promise: null, resolvedUri: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

// Some local DNS resolvers (e.g. Xiaomi routers) refuse Node's SRV queries
// with ECONNREFUSED, breaking mongodb+srv:// connections. We resolve the SRV
// records ourselves through public DNS and rewrite the URI to a plain
// mongodb:// form, so the driver never has to do an SRV lookup.
async function expandSrvUri(uri: string): Promise<string> {
  if (!uri.startsWith("mongodb+srv://")) return uri;

  const url = new URL(uri);
  const host = url.hostname;

  const resolver = new dns.promises.Resolver();
  resolver.setServers(["1.1.1.1", "8.8.8.8"]);

  const [srvRecords, txtRecords] = await Promise.all([
    resolver.resolveSrv(`_mongodb._tcp.${host}`),
    resolver.resolveTxt(host).catch(() => [] as string[][]),
  ]);

  const hosts = srvRecords
    .map((r) => `${r.name}:${r.port}`)
    .join(",");

  const auth =
    url.username || url.password
      ? `${url.username}${url.password ? ":" + url.password : ""}@`
      : "";

  const params = new URLSearchParams(url.search);
  if (!params.has("ssl") && !params.has("tls")) params.set("ssl", "true");
  if (!params.has("authSource")) params.set("authSource", "admin");

  for (const recordSet of txtRecords) {
    for (const part of recordSet.join("").split("&")) {
      const [k, v] = part.split("=");
      if (k && v && !params.has(k)) params.set(k, v);
    }
  }

  const path = url.pathname || "/";
  return `mongodb://${auth}${hosts}${path}?${params.toString()}`;
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      if (!cached.resolvedUri) {
        cached.resolvedUri = await expandSrvUri(MONGODB_URI);
      }
      return mongoose.connect(cached.resolvedUri);
    })();
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
