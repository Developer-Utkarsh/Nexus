import { NextResponse } from "next/server";
import { Meeting } from "../../../../lib/modals/meetingModal";
import { User } from "../../../../lib/modals/userModal"; // Import User model
import { checkDbConnection } from "@/middleware";

const timeZone = "Asia/Kolkata";
const getCurrentDate = () => new Date().toLocaleString("en-US", { timeZone });

export async function POST(req: Request) {
	try {
		await checkDbConnection();

		const { email, meetingId } = await req.json();

		const meeting = await Meeting.findOne({ meetingId });

		if (!meeting) {
			return NextResponse.json(
				{ error: "Meeting not found" },
				{ status: 404 },
			);
		}

		// Remove user from activeUsers array
		meeting.activeUsers = meeting.activeUsers.filter(
			(userEmail: string) => userEmail !== email,
		);

		// Update leavedAt field in totalUsers array
		meeting.totalUsers = meeting.totalUsers.map((user: any) => {
			if (user.email === email) {
				return { ...user, leavedAt: getCurrentDate() };
			}
			return user;
		});

		await meeting.save();

		// If no users are left in activeUsers, set a timeout to end the meeting
		if (meeting.activeUsers.length === 0) {
			const endMeetingTimeout = setTimeout(async () => {
				const updatedMeeting = await Meeting.findOne({ meetingId });

				// Check again if activeUsers is still empty
				if (updatedMeeting && updatedMeeting.activeUsers.length === 0) {
					const endTime = getCurrentDate();
					updatedMeeting.status = "ended";
					updatedMeeting.isEnded = true;
					updatedMeeting.endedAt = endTime;
					updatedMeeting.activeUsers = [];

					await updatedMeeting.save();

					// Get all user emails from totalUsers array
					const userEmails = updatedMeeting.totalUsers.map(
						(user: any) => user.email,
					);

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
						{ email: updatedMeeting.createdBy },
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

					console.log("Meeting ended due to no active users");
				}
			}, 2 * 60 * 1000); // 2 minutes

			// Store the timeout ID in the meeting document to clear it if needed
			meeting.endMeetingTimeout = endMeetingTimeout;
			await meeting.save();
		}

		return NextResponse.json(
			{ msg: "User removed from active users and leavedAt updated" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error updating meeting:", error);
		return NextResponse.json(
			{ error: "An error occurred while updating the meeting" },
			{ status: 500 },
		);
	}
}
