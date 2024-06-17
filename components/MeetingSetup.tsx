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
import TopLoadingBar from "./TopLoadingBar";

const MeetingSetup = ({
	setIsSetupComplete,
	createdBy,
	title,
}: {
	setIsSetupComplete: (value: boolean) => void;
	createdBy: string;
	title: string;
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
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(0);

	if (!call) {
		throw new Error("useCall must be used within StreamCall Component");
	}

	useEffect(() => {
		call?.microphone.enable();
		call?.camera.enable();

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

	const joinMeeting = async (
		meetingId: any,
		userImage: string,
		username: string,
		email: string,
		joinedAt: Date,
	) => {
		let fullName;

		if (user) {
			fullName = user?.firstName + " " + user?.lastName;
		} else {
			fullName = "unknown";
		}

		setLoading(true);
		setProgress(30);
		const response = await axios.post("/api/meetings/joined/", {
			meetingId,
			username,
			userImage,
			email,
			joinedAt,
			fullName,
		});
		setProgress(70);
		setTimeout(() => setProgress(0), 500);
		setLoading(false);
	};

	const meetingTitle = window.location.href.includes("personal")
		? "Personal Meeting"
		: title;
	const personal = window.location.href.includes("personal") ? true : false;

	return (
		<div className='flex h-screen flex-col w-full items-center justify-center gap-3 text-white'>
			<TopLoadingBar progress={progress} />
			<h1 className='text-4xl font-bold tracking-wide uppercase'>
				{meetingTitle}
			</h1>
			<p className='text-sm font-medium tracking-wide  text-neutral-400'>
				Created by{" "}
				<span className='text-blue-1 hover:text-blue-600 '>
					@{createdBy}
				</span>
			</p>
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
						user?.imageUrl || "",
						user?.emailAddresses[0]?.emailAddress ||
							"default@email.com",
						new Date(),
					);
					setIsSetupComplete(true);
				}}
				isLoading={loading}
			>
				Join Meeting
			</Button>
		</div>
	);
};

export default MeetingSetup;
