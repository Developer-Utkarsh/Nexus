import { NextResponse } from "next/server";
import { Meeting } from "../../../lib/modals/meetingModal";
import { User } from "../../../lib/modals/userModal";
import { connect } from "@/lib/db";

const timeZone = "Asia/Kolkata";
const getCurrentDate = () => new Date().toLocaleString("en-US", { timeZone });

export async function POST(req: Request) {
	try {
		await connect();

		const {
			title,
			description,
			createdBy,
			status,
			hostpic,
			totalUsers,
			activeUsers,
			endedAt,
			meetingId,
			isScheduled,
			isStarted,
			isEnded,
			scheduledAt,
			joinedAt,
			startsAt,
		} = await req.json();

		const existingMeeting = await Meeting.findOne({ meetingId });

		if (existingMeeting) {
			const user = await User.findOne({ email: createdBy });

			const meetingExists = user.totalMeetings.some(
				(meeting: { meetingId: string }) =>
					meeting.meetingId === meetingId,
			);

			if (!meetingExists) {
				await User.updateOne(
					{ email: createdBy },
					{
						$push: {
							totalMeetings: {
								title,
								meetingId,
								createdAt: getCurrentDate(),
								image: hostpic,
								createdBy,
								status,
								endedAt,
								joinedAt: "",
								startsAt,
								isEnded,
								isStarted,
								isScheduled,
								scheduledAt,
							},
						},
					},
				);
			}

			return NextResponse.json(
				{ msg: "Meeting with this ID already exists" },
				{ status: 200 },
			);
		}

		const newMeeting = await Meeting.create({
			title,
			description,
			createdBy,
			status,
			hostpic,
			totalUsers,
			activeUsers,
			endedAt,
			meetingId,
			isScheduled,
			isStarted,
			isEnded,
			createdAt: getCurrentDate(),
			scheduledAt,
			startsAt: "",
			endMeetingTimeout: null,
		});

		await User.updateOne(
			{ email: createdBy },
			{
				$push: {
					createdMeetings: {
						title,
						meetingId,
						createdAt: getCurrentDate(),
						image: hostpic,
						createdBy,
						status,
						joinedAt,
						startsAt,
						endedAt,
						isEnded,
						isStarted,
						isScheduled,
						scheduledAt,
					},
					totalMeetings: {
						title,
						meetingId,
						createdAt: getCurrentDate(),
						image: hostpic,
						createdBy,
						status,
						joinedAt,
						startsAt,
						endedAt,
						isEnded,
						isStarted,
						isScheduled,
						scheduledAt,
					},
				},
			},
		);

		console.log("New Meeting Stored to DB Successfully");

		return NextResponse.json(
			{ msg: "Meeting is created successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error creating meeting:", error);
		return NextResponse.json(
			{ error: "An error occurred while creating the meeting" },
			{ status: 500 },
		);
	}
}
