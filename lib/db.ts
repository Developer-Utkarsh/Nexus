import { Mongoose } from "mongoose";

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

export async function connect() {
	if (isConnected) return;
	try {
		if (!MONGODB_URL) {
			throw new Error("MONGODB_URI is not defined");
		}

		const mongoose = await import("mongoose");
		cached.conn = await mongoose.connect(MONGODB_URL, {
			dbName: "nexus",
			bufferCommands: false,
			connectTimeoutMS: 10000,
		});
		isConnected = true;
		console.log("Database connected successfully");
	} catch (error) {
		isConnected = false;
		console.error("Database connection error:", error);
		throw error;
	}
}

export function checkConnection() {
	return isConnected;
}
