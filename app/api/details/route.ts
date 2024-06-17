import { NextResponse } from "next/server";
import { Meeting } from "../../../lib/modals/meetingModal";
import { User } from "../../../lib/modals/userModal";
import { checkDbConnection } from "@/middleware";

export async function POST(req: Request) {
	try {
		await checkDbConnection();

		const { meetingId } = await req.json();

		// Use projection to fetch only necessary fields
		const meeting = await Meeting.findOne(
			{ meetingId },
			{
				createdBy: 1,
				endedAt: 1,
				isEnded: 1,
				isStarted: 1,
				isScheduled: 1,
				scheduledAt: 1,
				title: 1,
			},
		);

		if (!meeting) {
			return NextResponse.json(
				{ error: "Meeting not found" },
				{ status: 404 },
			);
		}

		const user = await User.findOne({ email: meeting.createdBy });

		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 },
			);
		}

		const fullName = user.firstName + " " + user.lastName;

		const startsAt = meeting.scheduledAt;

		console.log(startsAt);

		return NextResponse.json(
			{
				isEnded: meeting.isEnded,
				isStarted: meeting.isStarted,
				isScheduled: meeting.isScheduled,
				fullName: fullName,
				createdBy: user.username,
				hostEmail: meeting.createdBy,
				endedAt: meeting.endedAt || null,
				startsAt: meeting.scheduledAt,
				title: meeting.title,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error fetching meeting details:", error);
		return NextResponse.json(
			{ error: "An error occurred while fetching meeting details" },
			{ status: 500 },
		);
	}
}
