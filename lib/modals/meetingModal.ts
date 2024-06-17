import mongoose, { Schema, model, models } from "mongoose";

const MeetingUserSchema = new Schema({
	email: String,
	username: String,
	image: String,
	joinedAt: String,
	fullName: String,
});
const MeetingsTotalUserSchema = new Schema({
	email: String,
	username: String,
	fullName: String,
	image: String,
	joinedAt: String,
	leavedAt: String,
});

const MeetingSchema = new Schema({
	_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
	createdBy: { type: String, required: true },
	hostPic: { type: String },
	createdAt: { type: String },
	totalUsers: [MeetingsTotalUserSchema],
	activeUsers: [MeetingUserSchema],
	meetingId: { type: String, required: true, unique: true, index: true },
	title: { type: String, required: true },
	description: { type: String },
	status: { type: String },
	endedAt: { type: String },
	isStarted: { type: Boolean },
	startsAt: { type: String },
	isScheduled: { type: Boolean },
	isEnded: { type: Boolean },
	scheduledAt: { type: String },
	endMeetingTimeout: { type: Number }, // Added field to store the timeout ID
});

const Meeting = models?.meetings || model("meetings", MeetingSchema);

export { Meeting };
