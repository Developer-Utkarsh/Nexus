import mongoose, { Schema, model, models } from "mongoose";

// User Schema
const UserSchema = new Schema({
	_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
	email: { type: String, required: true, unique: true, index: true },
	image: { type: String },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	totalMeetings: [
		{ type: mongoose.Schema.Types.ObjectId, ref: "Meetings" },
	],
	createdMeetings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Meetings" }],
	publicMeetings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pubic Meetings" }],
	clerkId: { type: String, required: true, unique: true, index: true },
	username: { type: String, unique: true, index: true },
	firstName: { type: String },
	lastName: { type: String },
});


const User = models?.user || model("users", UserSchema);


export { User };
