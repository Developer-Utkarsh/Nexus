"use client";
import {
	DeviceSettings,
	useCall,
	VideoPreview,
} from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";

const MeetingSetup = ({
	setIsSetupComplete,
}: {
	setIsSetupComplete: (value: boolean) => void;
}) => {
	const [isMicToggleOn, setIsMicToggleOn] = useState(true);
	const [isCamToggleOn, setIsCamToggleOn] = useState(true);
	const call = useCall();

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
		if (isMicToggleOn) {
			call?.microphone.disable();
		} else {
			call?.microphone.enable();
		}
		setIsMicToggleOn(!isMicToggleOn);
	};

	const toggleCam = () => {
		if (isCamToggleOn) {
			call?.camera.disable();
		} else {
			call?.camera.enable();
		}
		setIsCamToggleOn(!isCamToggleOn);
	};

	return (
		<div className='flex h-screen flex-col w-full items-center justify-center gap-3 text-white'>
			<h1 className='text-2xl font-bold'>Setup</h1>
			<VideoPreview />
			<div className='flex h-16 items-center justify-center gap-4 mt-2'>
				<button
					className={`p-2 rounded-full text-xl transition-colors duration-300 ${
						isMicToggleOn ? "bg-blue-500" : "bg-red-500"
					}`}
					onClick={toggleMic}
				>
					<i
						className={`fa-solid ${
							isMicToggleOn
								? "fa-microphone"
								: "fa-microphone-slash"
						} px-[3px]`}
					></i>
				</button>
				<button
					className={`p-2 rounded-full text-2xl transition-colors duration-300 ${
						isCamToggleOn ? "bg-blue-500" : "bg-red-500"
					}`}
					onClick={toggleCam}
				>
					{isCamToggleOn ? (
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
				className='rounded-md bg-green-500 px-4 py-2.5 mt-2 hover:bg-green-600 transition-colors duration-300'
				onClick={() => {
					call.join();
					setIsSetupComplete(true);
				}}
			>
				Join Meeting
			</Button>
		</div>
	);
};

export default MeetingSetup;
