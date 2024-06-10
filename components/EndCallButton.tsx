"use client";

import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";

const EndCallButton = ({ onClick }: { onClick: () => void }) => {
	const call = useCall();
	const { toast } = useToast();

	const router = useRouter();

	const { useLocalParticipant } = useCallStateHooks();

	const localParticipant = useLocalParticipant();

	const isMeetingOwner =
		localParticipant &&
		call?.state.createdBy &&
		localParticipant.userId === call.state.createdBy.id;

	if (!isMeetingOwner) return null;

	return (
		<Button
			onClick={onClick}
			className='bg-red-500 transition hover:bg-red-600 cursor-pointer lg:mb-3   rounded-full'
		>
			End Meeting
		</Button>
	);
};

export default EndCallButton;
