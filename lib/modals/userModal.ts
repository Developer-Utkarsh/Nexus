import mongoose, { Schema, model, models } from "mongoose";

const MeetingDetailsSchema = new Schema({
	title: String,
	meetingId: String,
	createdAt: String,
	image: String,
	createdBy: String,
	status: String,
	joinedAt: String,
	startsAt: String,
	endedAt: String,
	isEnded: Boolean,
	isStarted: Boolean,
	isScheduled: Boolean,
	scheduledAt: String,
	leavedAt: String,
});
const PublicMeetingDetailsSchema = new Schema({
	title: String,
	meetingId: String,
	createdAt: String,
	image: String,
	createdBy: String,
	status: String,
	joinedAt: String,
	totalUsers: [MeetingDetailsSchema],
	endedAt: String,
	isEnded: Boolean,
	isStarted: Boolean,
	isScheduled: Boolean,
	scheduledAt: String,
	leavedAt: String,
});

// User Schema
const UserSchema = new Schema({
	_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
	email: { type: String, required: true, unique: true, index: true },
	image: { type: String },
	createdAt: { type: Date, default: new Date() },
	updatedAt: { type: Date, default: new Date() },
	totalMeetings: [MeetingDetailsSchema], // Changed to use MeetingDetailsSchema
	createdMeetings: [MeetingDetailsSchema],
	publicMeetings: [PublicMeetingDetailsSchema],
	clerkId: { type: String, required: true, unique: true, index: true },
	username: { type: String, unique: true, index: true },
	firstName: { type: String },
	lastName: { type: String },
	isPrivate: { type: Boolean },
});

const User = models?.users || model("users", UserSchema);

export { User };
