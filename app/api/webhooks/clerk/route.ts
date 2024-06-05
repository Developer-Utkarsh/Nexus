import { clerkClient } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser, deleteUser, updateUser } from "@/lib/actions/useraction";
import { Webhook } from "svix";

export async function POST(req: Request) {
	const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
	if (!WEBHOOK_SECRET)
		throw new Error(
			"Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
		);

	// Get the headers
	const headerPayload = headers();
	const svix_id = headerPayload.get("svix-id");
	const svix_timestamp = headerPayload.get("svix-timestamp");
	const svix_signature = headerPayload.get("svix-signature");

	// If there are no headers, error out
	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new Response("Error occurred -- no svix headers", {
			status: 400,
		});
	}

	// Get the body
	const payload = await req.json();
	const body = JSON.stringify(payload);

	// Create a new Svix instance with your secret.
	const wh = new Webhook(WEBHOOK_SECRET);
	let evt: WebhookEvent;

	// Verify the payload with the headers
	try {
		evt = wh.verify(body, {
			"svix-id": svix_id,
			"svix-timestamp": svix_timestamp,
			"svix-signature": svix_signature,
		}) as WebhookEvent;
	} catch (err) {
		console.error("Error verifying webhook:", err);
		return new Response("Error occurred", {
			status: 400,
		});
	}

	// Do something with the payload
	const { id } = evt.data;
	const eventType = evt.type;

	// Create User in MongoDB
	if (eventType === "user.created") {
		const timeZone = "Asia/Kolkata"; // Replace with your desired time zone (e.g., "America/New_York")
		const currentDate = new Date();
		const options = { timeZone };
		const formattedDate = currentDate.toLocaleString("en-US", options);
		const { email_addresses, image_url, first_name, last_name, username } =
			evt.data;
		const user = {
			clerkId: id,
			createdAt: formattedDate,
			updatedAt: formattedDate,
			conversationIds: [],
			seenMessageIds: [],
			messages: [],
			email: email_addresses[0].email_address,
			username: username,
			firstName: first_name,
			lastName: last_name,
			image: image_url,
		};
		const newUser = await createUser(user);
		if (newUser && typeof id === "string") {
			await clerkClient.users.updateUserMetadata(id, {
				publicMetadata: {
					userId: newUser._id,
				},
			});
		}
		return NextResponse.json({
			message: "New User Created",
			user: newUser,
		});
	}

	if (eventType === "user.updated") {
		const {
			id,
			email_addresses,
			image_url,
			first_name,
			last_name,
			username,
		} = evt.data;
		const user = {
			clerkId: id,
			email: email_addresses[0].email_address,
			username: username,
			firstName: first_name,
			lastName: last_name,
			image: image_url,
		};
		const updatedUser = await updateUser(id, user);
		return NextResponse.json({
			message: "User Updated",
			user: updatedUser,
		});
	}

	if (eventType === "user.deleted") {
		const { id } = evt.data;
		console.log(evt.data);
		console.log(id);
		if (typeof id === "string") {
			// Ensure id is a string
			const deletionResult = await deleteUser(id);
			return NextResponse.json({
				message: deletionResult,
			});
		} else {
			return new Response("ID is undefined", { status: 400 });
		}
	}

	console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
	console.log("Webhook body:", body);
	return new Response("", { status: 200 });
}
