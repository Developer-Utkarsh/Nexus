"use client";
import {
	DeviceSettings,
	useCall,
	VideoPreview,
} from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

const MeetingSetup = ({
	setIsSetupComplete,
}: {
	setIsSetupComplete: (value: boolean) => void;
}) => {
	useEffect(() => {
		fetch("/api/connectToDB")
			.then((response) => response.json())
			.then((data) => console.log(data))
			.catch((error) => console.error(error));
	}, []);

	const [isMicEnabled, setIsMicEnabled] = useState(true);
	const [isCamEnabled, setIsCamEnabled] = useState(true);
	const call = useCall();
	const { user } = useUser();

	if (!call) {
		throw new Error("useCall must be used within StreamCall Component");
	}

	useEffect(() => {
		// Enable microphone and camera by default on component mount
		call?.microphone.enable();
		call?.camera.enable();

		// Clean up function to disable microphone and camera on component unmount
		return () => {
			call?.microphone.disable();
			call?.camera.disable();
		};
	}, [call]);

	const toggleMic = () => {
		if (isMicEnabled) {
			call?.microphone.disable();
		} else {
			call?.microphone.enable();
		}
		setIsMicEnabled(!isMicEnabled);
	};

	const toggleCam = () => {
		if (isCamEnabled) {
			call?.camera.disable();
		} else {
			call?.camera.enable();
		}
		setIsCamEnabled(!isCamEnabled);
	};

	const storeMeeting = async (
		title: String,
		description: String,
		createdBy: String,
		meetingStatus: String,
		meetingId: any,
		hostpic: String,
		activeUsers: any[],
		totalUsers: any[],
		endedAt: String,
		isScheduled: Boolean,
		isStarted: Boolean,
		isEnded: Boolean,
		isPersonal: Boolean,
		scheduledAt: String,
		joinedAt: String,
		startsAt: String,
	) => {
		const timeZone = "Asia/Kolkata"; // Replace with your desired time zone (e.g., "America/New_York")
		const currentDate = new Date();
		const options = { timeZone };
		const createdAt = currentDate.toLocaleString("en-US", options);
		const response = await axios.post("/api/meetings/", {
			title,
			description,
			createdAt,
			createdBy,
			status: meetingStatus,
			meetingId,
			hostpic,
			activeUsers,
			totalUsers,
			endedAt,
			isScheduled,
			isStarted,
			isEnded,
			isPersonal,
			scheduledAt,
			joinedAt,
			startsAt,
		});
	};

	const joinMeeting = async (
		meetingId: any,
		userImage: string,
		username: string,
		email: string,
		joinedAt: Date,
	) => {
		const response = await axios.post("/api/meetings/joined/", {
			meetingId,
			username,
			userImage,
			email,
			joinedAt,
		});
	};

	const title = window.location.href.includes("personal")
		? "Personal Meeting"
		: "Instant Meeting";
	const personal = window.location.href.includes("personal") ? true : false;

	useEffect(() => {
		storeMeeting(
			title,
			title === "Personal Meeting"
				? "This is a personal meeting"
				: "This is an instant meeting",
			user?.emailAddresses[0]?.emailAddress || "default@email.com",
			"created",
			call.id,
			user?.imageUrl || "", // Fix the image error by providing a default value
			[],
			[],
			"not ended yet",
			false,
			false,
			false,
			personal,
			"",
			"",
			"",
		);
	}, []);

	return (
		<div className='flex h-screen flex-col w-full items-center justify-center gap-3 text-white'>
			<h1 className='text-2xl font-bold'>{title}</h1>
			<VideoPreview />
			<div className='flex h-16 items-center justify-center gap-4 mt-2 z-50'>
				<button
					className={`p-2 rounded-full text-xl transition-colors duration-300 ${
						isMicEnabled ? "bg-blue-500" : "bg-red-500"
					}`}
					onClick={toggleMic}
				>
					<i
						className={`fa-solid ${
							isMicEnabled
								? "fa-microphone"
								: "fa-microphone-slash"
						} px-[3px]`}
					></i>
				</button>
				<button
					className={`p-2 rounded-full text-2xl transition-colors duration-300 ${
						isCamEnabled ? "bg-blue-500" : "bg-red-500"
					}`}
					onClick={toggleCam}
				>
					{isCamEnabled ? (
						<i className='fa-solid fa-camera px-[4px]'></i>
					) : (
						<Image
							src='/icons/camera-off.svg'
							alt='camera off'
							width={32}
							height={32}
							className='camera-icon mt-1 px-[4px]'
						/>
					)}
				</button>
				<DeviceSettings />
			</div>
			<Button
				className='rounded-md bg-green-500 px-4 py-2.5 mt-2 hover:bg-green-600 transition-colors duration-300 z-50'
				onClick={() => {
					call.join();
					joinMeeting(
						call.id,
						user?.username || "default",
						user?.imageUrl || "", // Fix the image error by providing a default value
						user?.emailAddresses[0]?.emailAddress ||
							"default@email.com",
						new Date(),
					);
					setIsSetupComplete(true);
				}}
			>
				Join Meeting
			</Button>
		</div>
	);
};

export default MeetingSetup;
