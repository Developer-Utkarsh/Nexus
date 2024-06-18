"use client";

import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

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
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>
					<Button
						onClick={onClick}
						className='bg-red-500 transition hover:bg-red-600 cursor-pointer lg:mb-3  p-2 text-xl  rounded-full'
					>
						<i className='fa-solid fa-power-off'></i>
					</Button>
				</TooltipTrigger>
				<TooltipContent className='bg-dark-1 border border-slate-700'>
					<p>End Meeting For Everyone</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default EndCallButton;
