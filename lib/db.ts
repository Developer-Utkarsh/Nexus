import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL!;

interface MongooseConn {
	conn: Mongoose | null;
	promise: Promise<Mongoose> | null;
}

let cached: MongooseConn = (global as any).mongoose;

if (!cached) {
	cached = (global as any).mongoose = {
		conn: null,
		promise: null,
	};
}

export let isConnected = false;

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
