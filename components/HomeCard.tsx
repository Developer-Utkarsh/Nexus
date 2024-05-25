"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface HomeCardProps {
	className: string;
	img: string;
	description: string;
	title: string;
	handleClick: () => void;
}

const HomeCard = ({
	className,
	img,
	title,
	description,
	handleClick,
}: HomeCardProps) => {
	return (
		<div
			className={cn(
				" px-4 py-6 flex flex-col justify-between w-full xl:max-w-[278px] min-h-[208px] rounded-[8px] cursor-pointer transform hover:scale-110 transition duration-300 ",

				className,
			)}
			onClick={handleClick}
		>
			<div className='flex-center glassmorphism-card size-12 rounded-[10px] '>
				<Image src={img} alt='meeting' width={24} height={24} />
			</div>
			<div className='flex flex-col gap-1 '>
				<h1 className='text-2xl font-bold'>{title}</h1>
				<p className='text-sm font-normal text-gray-100'>
					{description}
				</p>
			</div>
		</div>
	);
};

export default HomeCard;
