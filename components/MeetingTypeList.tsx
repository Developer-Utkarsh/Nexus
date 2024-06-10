"use client";
import { useRouter } from "next/navigation";
import HomeCard from "./HomeCard";
import { useState } from "react";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

import ReactDatePicker from "react-datepicker";

import { Textarea } from "@/components/ui/textarea";

const MeetingTypeList = () => {
	const router = useRouter();

	const { toast } = useToast();

	const [meetingState, setMeetingState] = useState<
		| "isScheduleMeeting"
		| "isJoiningMeeting"
		| "isInstantMeeting"
		| undefined
	>();

	const { user } = useUser();

	const [values, setValues] = useState({
		dateTime: new Date(),
		description: "",
		link: "",
	});

	const [callDetails, setCallDetails] = useState<Call>();

	const client = useStreamVideoClient();

	const createMeeting = async () => {
		if (!client || !user) return;

		try {
			if (!values.dateTime) {
				toast({
					title: "Please Provide date and time.",
				});
			}

			const id = crypto.randomUUID();

			const call = client.call("default", id);

			if (!call) throw new Error("Failed to create call");

			const startsAt =
				values.dateTime.toISOString() ||
				new Date(Date.now()).toISOString();

			const description = values.description || "Instant Meeting";
			const title = description;
			await call.getOrCreate({
				data: {
					starts_at: startsAt,
					custom: {
						description,
					},
				},
			});
			setCallDetails(call);

			if (!values.description) {
				router.push(`/meeting/${call.id}`);
			}
			toast({
				title: "Meeting Created Succesfully",
			});
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Failed to Create Meeting",
			});

			console.log(error);
		}
	};

	const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

	return (
		<section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
			<HomeCard
				img='/icons/add-meeting.svg'
				title='New Meeting'
				description='Start an instant meeting'
				handleClick={() => {
					setMeetingState("isInstantMeeting");
				}}
				className='bg-orange-1'
			/>
			<HomeCard
				img='/icons/join-meeting.svg'
				title='Join Meeting'
				description='via Invitation Link'
				handleClick={() => {
					setMeetingState("isJoiningMeeting");
				}}
				className='bg-blue-1'
			/>
			<HomeCard
				img='/icons/schedule.svg'
				title='Schedule Meeting'
				description='Plan your Meeting'
				handleClick={() => {
					setMeetingState("isScheduleMeeting");
				}}
				className='bg-purple-1'
			/>
			<HomeCard
				img='/icons/recordings.svg'
				title='View Recordings'
				description='Check out your Recordings'
				handleClick={() => {
					router.push("/recordings");
				}}
				className='bg-yellow-1'
			/>

			{!callDetails ? (
				<MeetingModal
					isOpen={meetingState === "isScheduleMeeting"}
					onClose={() => setMeetingState(undefined)}
					title='Schedule a Meeting'
					handleClick={createMeeting}
				>
					<div className='flex flex-col gap-2.5'>
						<label className='text-base text-normal leading-[22px] text-sky-2'>
							Add a Description
						</label>
						<Textarea
							className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
							onChange={(e) => {
								setValues({
									...values,
									description: e.target.value,
								});
							}}
						/>
					</div>
					<div className='flex w-full flex-col gap-2.5'>
						<label className='text-base text-normal leading-[22px] text-sky-2'>
							Select Date and Time
						</label>

						<ReactDatePicker
							selected={values.dateTime}
							onChange={(date) =>
								setValues({ ...values, dateTime: date! })
							}
							showTimeSelect
							timeFormat='HH:mm'
							timeIntervals={15}
							timeCaption='time'
							dateFormat={"MMMM d, yyyy h:mm aa"}
							className='w-full rounded-lg p-2 focus:outline-none bg-dark-3'
						/>
					</div>
				</MeetingModal>
			) : (
				<MeetingModal
					isOpen={meetingState === "isScheduleMeeting"}
					onClose={() => setMeetingState(undefined)}
					title='Meeting Created'
					className='text-center'
					buttonText='Copy Meeting Link'
					handleClick={() => {
						navigator.clipboard.writeText(meetingLink);
						toast({ title: "Link Copied" });
					}}
					image='/icons/checked.svg'
					buttonIcon='/icons/copy.svg'
				/>
			)}

			<MeetingModal
				isOpen={meetingState === "isInstantMeeting"}
				onClose={() => setMeetingState(undefined)}
				title='Start an Instant Meeting'
				className='text-center'
				buttonText='Start Meeting'
				handleClick={createMeeting}
			/>
			<MeetingModal
				isOpen={meetingState === "isJoiningMeeting"}
				onClose={() => setMeetingState(undefined)}
				title='Paste the Link Here'
				className='text-center'
				buttonText='Join Meeting'
				handleClick={() => [router.push(values.link)]}
			>
				<Input
					placeholder='Meeting Link '
					className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
					onChange={(e) =>
						setValues({ ...values, link: e.target.value })
					}
				/>
			</MeetingModal>
		</section>
	);
};

export default MeetingTypeList;
