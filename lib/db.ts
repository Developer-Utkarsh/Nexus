let mongoose;
let isConnected = false;

if (typeof window === "undefined") {
	// Dynamically import mongoose only on the server-side
	mongoose = require("mongoose");

	const MONGODB_URL = process.env.MONGODB_URL;

	interface MongooseConn {
		conn: typeof mongoose | null;
		promise: Promise<typeof mongoose> | null;
	}

	let cached: MongooseConn = (global as any).mongoose;

	if (!cached) {
		cached = (global as any).mongoose = {
			conn: null,
			promise: null,
		};
	}

	export const connect = async () => {
		if (isConnected) return;
		if (cached.conn) {
			isConnected = true;
			return cached.conn;
		}

		if (!MONGODB_URL) {
			throw new Error("MONGODB_URL is not defined");
		}

		try {
			cached.promise =
				cached.promise ||
				mongoose.connect(MONGODB_URL, {
					dbName: "nexus",
					bufferCommands: false,
					connectTimeoutMS: 10000,
				});

			cached.conn = await cached.promise;
			isConnected = true;
			console.log("Database connected successfully");
			return cached.conn;
		} catch (error) {
			isConnected = false;
			console.error("Database connection error:", error);
			throw error;
		}
	};

	export function checkConnection() {
		return isConnected;
	}
} else {
	// Provide stubs for browser or environments where mongoose cannot be used
	export const connect = async () => {
		console.error("Mongoose cannot be used on the client-side.");
	};
	export function checkConnection() {
		return false;
	}
}
