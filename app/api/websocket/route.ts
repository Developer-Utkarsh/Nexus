import { WebSocketServer, WebSocket } from "ws";
import { NextApiRequest, NextApiResponse } from "next";
import { IncomingMessage } from "http"; // Import IncomingMessage
import { checkDbConnection } from "@/middleware";
import { Meeting } from "@/lib/modals/meetingModal";
import { User } from "@/lib/modals/userModal";
import { connect } from "@/lib/db";

connect();

const wss = new WebSocketServer({ noServer: true });

export const config = {
	api: {
		bodyParser: false,
	},
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect);
	} else {
		res.status(405).end(); // Method Not Allowed
	}
}

function onSocketConnect(ws: WebSocket, req: IncomingMessage) {
	// Change type to IncomingMessage
	const { meetingId, email } = JSON.parse(req.url!.split("?")[1]);

	ws.on("close", async () => {
		await checkDbConnection();

		const meeting = await Meeting.findOne({ meetingId });

		if (!meeting) return;

		meeting.activeUsers = meeting.activeUsers.filter(
			(userEmail: string) => userEmail !== email,
		);

		meeting.totalUsers = meeting.totalUsers.map((user: any) => {
			if (user.email === email) {
				return { ...user, leavedAt: getCurrentDate() };
			}
			return user;
		});

		await meeting.save();

		if (meeting.activeUsers.length === 0) {
			const endMeetingTimeout = setTimeout(async () => {
				const updatedMeeting = await Meeting.findOne({ meetingId });

				if (updatedMeeting && updatedMeeting.activeUsers.length === 0) {
					const endTime = getCurrentDate();
					updatedMeeting.status = "ended";
					updatedMeeting.isEnded = true;
					updatedMeeting.endedAt = endTime;
					updatedMeeting.activeUsers = [];

					await updatedMeeting.save();

					const userEmails = updatedMeeting.totalUsers.map(
						(user: any) => user.email,
					);

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

			meeting.endMeetingTimeout = endMeetingTimeout;
			await meeting.save();
		}
	});
}

const getCurrentDate = () =>
	new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
