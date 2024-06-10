import { NextResponse } from "next/server";
import { Meeting } from "../../../../lib/modals/meetingModal";
import { User } from "../../../../lib/modals/userModal"; // Import User model
import { checkDbConnection } from "@/middleware";

const timeZone = "Asia/Kolkata";
const getCurrentDate = () => new Date().toLocaleString("en-US", { timeZone });

export async function POST(req: Request) {
	try {
		await checkDbConnection();

		const { meetingId } = await req.json();

		const meeting = await Meeting.findOne({ meetingId });

		if (!meeting) {
			return NextResponse.json(
				{ error: "Meeting not found" },
				{ status: 404 },
			);
		}

		const endTime = getCurrentDate();

		// Update meeting status
		meeting.status = "ended";
		meeting.isEnded = true;
		meeting.endedAt = endTime;
		meeting.activeUsers = [];
		await meeting.save();

		// Get all user emails from totalUsers array
		const userEmails = meeting.totalUsers.map((user: any) => user.email);

		// Update all users who joined the meeting
		await User.updateMany(
			{ email: { $in: userEmails } },
			{
				$set: {
					"totalMeetings.$[elem].status": "ended",
					"totalMeetings.$[elem].isEnded": true,
					"totalMeetings.$[elem].endedAt": endTime,
				},
			},
			{
				arrayFilters: [{ "elem.meetingId": meetingId }],
			},
		);

		// Update the user who created the meeting
		await User.updateOne(
			{ email: meeting.createdBy },
			{
				$set: {
					"createdMeetings.$[elem].status": "ended",
					"createdMeetings.$[elem].isEnded": true,
					"createdMeetings.$[elem].endedAt": endTime,
				},
			},
			{
				arrayFilters: [{ "elem.meetingId": meetingId }],
			},
		);

		return NextResponse.json(
			{ msg: "Meeting ended successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error ending meeting:", error);
		return NextResponse.json(
			{ error: "An error occurred while ending the meeting" },
			{ status: 500 },
		);
	}
}
