import { NextResponse } from "next/server";
import { Meeting } from "../../../../lib/modals/meetingModal";
import { User } from "../../../../lib/modals/userModal";
import { connect } from "@/lib/db";

const timeZone = "Asia/Kolkata";
const getCurrentDate = () => new Date().toLocaleString("en-US", { timeZone });

connect();

export async function POST(req: Request) {
	try {
		const { meetingId, email, username, userImage, startsAt, fullName } =
			await req.json();

		// Fetch the meeting details from the database
		const meeting = await Meeting.findOne({ meetingId });

		if (!meeting) {
			return new NextResponse(
				JSON.stringify({ error: "Meeting not found" }),
				{
					status: 404,
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
		}

		// Check if startsAt is an empty string and replace it with the current date
		const actualStartsAt = startsAt === "" ? getCurrentDate() : startsAt;

		// Check if the meeting is not started and not ended
		if (!meeting.isStarted && !meeting.isEnded) {
			// Update the meeting with the provided startsAt date and set isStarted to true
			await Meeting.findOneAndUpdate(
				{ meetingId },
				{
					$set: {
						startsAt: actualStartsAt,
						isStarted: true,
						status: "joined",
					},
					$push: {
						totalUsers: {
							email,
							username,
							image: userImage,
							joinedAt: getCurrentDate(),
							leavedAt: "not yet leaved",
							fullName: fullName,
						},
						activeUsers: {
							email,
							username,
							image: userImage,
							joinedAt: getCurrentDate(),
							fullName: fullName,
						},
					},
				},
				{ new: true },
			);
		}

		// Find the user by email
		const user = await User.findOne({ email });

		if (user) {
			// Update user's meeting details
			const updateMeetingDetails = {
				meetingId,
				createdBy: meeting.createdBy,
				title: meeting.title,
				image: meeting.hostPic,
				startsAt: actualStartsAt,
				joinedAt: getCurrentDate(),
			};

			interface MeetingDetail {
				meetingId: string;
				// include other properties of meeting details if there are any
			}

			// Update totalMeetings and createdMeetings
			const totalMeetingIndex = user.totalMeetings.findIndex(
				(m: MeetingDetail) => m.meetingId === meetingId,
			);
			if (totalMeetingIndex !== -1) {
				user.totalMeetings[totalMeetingIndex] = updateMeetingDetails;
			} else {
				user.totalMeetings.push(updateMeetingDetails);
			}

			const createdMeetingIndex = user.createdMeetings.findIndex(
				(m: MeetingDetail) => m.meetingId === meetingId,
			);
			if (createdMeetingIndex !== -1) {
				user.createdMeetings[createdMeetingIndex] =
					updateMeetingDetails;
			}

			// Save the updated user document
			await user.save();
		}

		// Return success message as JSON response
		return NextResponse.json({
			msg: "Meeting status updated to joined successfully",
		});
	} catch (error) {
		console.error("Error in joining meeting:", error);
		return new NextResponse(
			JSON.stringify({
				error: "an error occurred while joining the meeting",
			}),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	}
}
