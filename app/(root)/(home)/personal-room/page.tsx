"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useGetCallByID } from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React from "react";

const Table = ({
	title,
	description,
}: {
	title: string;
	description: string;
}) => {
	return (
		// Added return statement here
		<div className='flex flex-col items-start gap-2 xl:flex-row'>
			<h1 className='text-base font-medium text-sky-1 lg:text-lg xl:min-w-32'>
				{title}
			</h1>
			<h1 className='truncate text-sm font-bold max-sm:max-w-[320px] lg:text-lg'>
				{description}
			</h1>
		</div>
	);
};

const PersonalRoom = () => {
	const { user } = useUser();
	const meetingId = user?.id;
	const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`;
	const client = useStreamVideoClient();

	const router = useRouter();

	const { toast } = useToast();

	const { call } = useGetCallByID(meetingId!);

	const description = "Personal Meeting";

	const startRoom = async () => {
		if (!client || !user) return;

		if (!call) {
			const newCall = client.call("default", meetingId!);
			await newCall.getOrCreate({
				data: {
					starts_at: new Date().toISOString(),
					custom: {
						description,
					},
				},
			});
		}

		router.push(`/meeting/${meetingId}?personal=true`);
	};

	return (
		<section className='flex size-full flex-col gap-2 text-white'>
			<h1 className='text-3xl font-bold'>Personal Room</h1>

			<div className='flex w-full flex-col gap-8 xl:max-w-[750px]'>
				<Table
					title='Topic'
					description={`${user?.username}'s Meeting Room`}
				/>
				<Table title='Meeting ID' description={meetingId!} />
				<Table title='Meeting Link' description={meetingLink!} />
				<div className='flex gap-5'>
					<Button className='bg-blue-1' onClick={startRoom}>
						Start Meeting
					</Button>

					<Button
						className='bg-dark-3'
						onClick={() => {
							navigator.clipboard.writeText(meetingLink);
							toast({ title: "Link Copied" });
						}}
					>
						Copy Invitation
					</Button>
				</div>
			</div>
		</section>
	);
};

export default PersonalRoom;
