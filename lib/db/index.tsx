import mongoose from "mongoose";

// ✅ We create a global cache object so that when using Next.js (or other
// serverless environments that hot-reload modules), we don’t create multiple
// database connections. This prevents memory leaks and "too many connections" errors.
// If a connection already exists in `global.mongoose`, reuse it.
// Otherwise, initialize with conn: null, promise: null.
const cached = (global as any).mongoose || { conn: null, promise: null };

// ✅ This function connects to MongoDB using Mongoose.
// It returns an existing connection if available, otherwise creates a new one.
export const connectionToDatabase = async (
    MONGODB_URI = process.env.MONGODB_URI // Default to environment variable, but allow override
) => {
    // ⚡ If we already have a cached connection (conn is not null),
    // return it immediately (no need to reconnect).
    if (cached.conn) return cached.conn;

    // 🚨 If no MongoDB URI is provided, throw an error.
    // This ensures that the function fails early instead of trying to connect without credentials.
    if (!MONGODB_URI) throw new Error('MONGO_URI is missing');

    // 🌀 If no connection promise exists yet, start one using mongoose.connect.
    // Mongoose.connect returns a Promise that resolves to the connection.
    // We store it in cached.promise so multiple calls share the same pending connection.
    cached.promise = cached.promise || mongoose.connect(MONGODB_URI);

    // ✅ Wait for the promise to resolve, then store the actual connection in cached.conn
    cached.conn = await cached.promise;

    // 🔁 Return the active MongoDB connection
    return cached.conn;
};
