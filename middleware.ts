import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const protectedRoutes = createRouteMatcher([
	"/",
	"/upcoming",
	"/previous",
	"/recordings",
	"/personal-room",
	"/meeting(.*)",
]);

export default clerkMiddleware((auth, req) => {
	if (protectedRoutes(req)) {
		auth().protect();
	}
});

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*?)"],
};

export async function checkDbConnection() {
	if (typeof window === "undefined") {
		const { connect, checkConnection } = await import("@/lib/db");
		try {
			if (!checkConnection()) {
				await connect();
			}
		} catch (error) {
			console.error("Database connection error:", error);
			throw new Error("Failed to connect to the database");
		}
	}
}
