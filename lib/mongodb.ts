import mongoose from "mongoose";

/* eslint-disable no-var */

/**
 * Extend the Node.js global object so the Mongoose connection cache survives
 * Next.js hot module replacement (HMR) in development. Without this, every
 * module reload would create a new connection, exhausting the connection pool.
 */
declare global {
  var mongooseCache:
    | {
        /** The resolved Mongoose instance once connected. */
        conn: typeof mongoose | null;
        /** The in-flight connection promise (prevents duplicate connections). */
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

/* eslint-enable no-var */

// ---------------------------------------------------------------------------
// Environment variable
// ---------------------------------------------------------------------------

const MONGODB_URI: string = process.env.MONGODB_URI ?? "";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// ---------------------------------------------------------------------------
// Cached connection singleton
// ---------------------------------------------------------------------------

/**
 * Read the existing cache from the global object, or initialise a fresh one.
 * `globalThis.mongooseCache` persists across HMR boundaries in development.
 */
const cached: NonNullable<typeof globalThis.mongooseCache> =
  globalThis.mongooseCache ?? { conn: null, promise: null };

// Ensure the cache is written back to the global object so it survives HMR.
if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = cached;
}

/**
 * Connect to MongoDB via Mongoose, reusing an existing connection whenever
 * possible.
 *
 * - **Server Components / Route Handlers / API routes** — call this at the top
 *   of the function body before performing any database operations.
 * - **Development** — the cached connection is stored on `globalThis` so it
 *   survives hot reloads without creating redundant connections.
 * - **Production** — the module-level `cached` variable is sufficient because
 *   the module is only evaluated once.
 *
 * @returns The connected Mongoose instance. Access the underlying connection
 *   via `.connection` (e.g. `mongoose.connection.readyState`).
 *
 * @example
 * ```ts
 * import { connectToDatabase } from "@/lib/mongodb";
 *
 * export async function GET() {
 *   await connectToDatabase();
 *   // ... query models ...
 * }
 * ```
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  // ── Already connected ────────────────────────────────────────────────
  if (cached.conn) {
    return cached.conn;
  }

  // ── Start a connection if none is in-flight ──────────────────────────
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      // Wait up to 5 seconds for the server to respond before failing.
      serverSelectionTimeoutMS: 5000,
    });
  }

  // ── Await the (possibly already in-flight) connection ────────────────
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset the promise so a subsequent call retries instead of re-using a
    // rejected promise.
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}