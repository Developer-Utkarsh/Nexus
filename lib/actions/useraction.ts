"use server";

import { User } from "../modals/userModal";

import { connect } from "@/lib/db";

export async function createUser(user: any) {
	try {
		await connect();
		const newUser = await User.create(user);
		return JSON.parse(JSON.stringify(newUser));
	} catch (error) {
		console.log(error);
	}
}
export async function updateUser(id: string, user: any) {
	try {
		const timeZone = "Asia/Kolkata"; // Replace with your desired time zone (e.g., "America/New_York")
		const currentDate = new Date();
		const options = { timeZone };
		const formattedDate = currentDate.toLocaleString("en-US", options);
		
		await connect();
		if (id) {
			const updatedUser = await User.findOneAndUpdate(
				{ clerkId: id }, // Correctly match clerkId with the provided id
				{
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					username: user.username,
					image: user.image,
					updatedAt: formattedDate,
				},
				{
					new: true, // Return the updated document
				},
			);
			console.log("Updated User", updatedUser);
			return JSON.parse(JSON.stringify(updatedUser));
		}
		console.log("No id found");
	} catch (error) {
		console.log(error);
	}
}
export async function deleteUser(id: string) {
	try {
		await connect();
		if (id) {
			const updatedUser = await User.findOneAndDelete({ clerkId: id });
			return JSON.parse(JSON.stringify("User deleted"));
		}
		console.log("No id found");
	} catch (error) {
		console.log(error);
	}
}
