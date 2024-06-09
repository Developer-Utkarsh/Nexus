import mongoose, { Schema, model, models } from "mongoose";

const MeetingDetailsSchema = new Schema({
	title: String,
	meetingId: String,
	createdAt: Date,
	image: String,
	createdBy: String,
	status: String,
	joinedAt: String,
	startsAt: String,
	endedAt: Date,
	isEnded: Boolean,
	isStarted: Boolean,
	isScheduled: Boolean,
	scheduledAt: Date,
});
const PublicMeetingDetailsSchema = new Schema({
	title: String,
	meetingId: String,
	createdAt: Date,
	image: String,
	createdBy: String,
	status: String,
	joinedAt: Date,
	totalUsers: [MeetingDetailsSchema],
	endedAt: Date,
	isEnded: Boolean,
	isStarted: Boolean,
	isScheduled: Boolean,
	scheduledAt: Date,
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
	isPrivate:{type:Boolean}
});

const User = models?.users || model("users", UserSchema);

export { User };
