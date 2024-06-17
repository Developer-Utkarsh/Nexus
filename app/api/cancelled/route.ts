import { NextResponse } from "next/server";
import { Meeting } from "../../../lib/modals/meetingModal";
import { checkDbConnection } from "@/middleware";

export async function POST() {
	try {
		await checkDbConnection();

		const now = new Date();
		const overdueTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);

		const overdueMeetings = await Meeting.updateMany(
			{
				isScheduled: true,
				isStarted: false,
				scheduledAt: { $lt: overdueTime },
			},
			{ $set: { status: "cancelled" } },
		);

		return NextResponse.json(
			{ success: true, updatedCount: overdueMeetings.modifiedCount },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error cancelling overdue meetings:", error);
		return NextResponse.json(
			{ error: "An error occurred while cancelling overdue meetings" },
			{ status: 500 },
		);
	}
}
