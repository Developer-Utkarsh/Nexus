import React, { ReactNode, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface MeetingModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	className?: string;
	children?: ReactNode;
	handleClick?: () => void;
	buttonText?: string;
	image?: string;
	buttonIcon?: string;
}

const MeetingModal = ({
	isOpen,
	onClose,
	title,
	className,
	children,
	handleClick,
	buttonText,
	image,
	buttonIcon,
}: MeetingModalProps) => {
	const [loading, setLoading] = useState(false);

	const buttonClicked = () => {
		setLoading(true);
		if (handleClick) {
			handleClick();
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='flex w-full max-w-[520px] flex-col gap-6 border-none bg-dark-1 px-6 py-9 text-white'>
				<div className='flex flex-col gap-6'>
					{image && (
						<div className='flex flex-col gap-6 justify-center items-center'>
							<Image
								src={image}
								alt='image'
								width={72}
								height={72}
							/>
						</div>
					)}
					<h1
						className={cn(
							"text-3xl font-bold leading-[42px]",
							className,
						)}
					>
						{title}
					</h1>
					{children}
					<Button
						className='bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-background transform hover:scale-105 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950 cursor-pointer w-full transition'
						onClick={handleClick}
					>
						{buttonIcon && (
							<Image
								src={buttonIcon}
								alt='button icon'
								width={12}
								height={12}
							/>
						)}
						&nbsp;
						{buttonText || "Schedule Meeting"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default MeetingModal;
