import mongoose, { type Mongoose } from "mongoose";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

const MONGODB_URI = mongoUri;

/**
 * Cache the database connection across hot reloads in development.
 * This prevents multiple mongoose connections from being created while the app is reloading.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis.mongooseCache ?? {
  conn: null,
  promise: null,
};

globalThis.mongooseCache = cached;

/**
 * Connect to MongoDB and reuse the cached connection if it already exists.
 */
export async function connectToDatabase(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoOptions = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, mongoOptions).then((connection) => {
      return connection;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
