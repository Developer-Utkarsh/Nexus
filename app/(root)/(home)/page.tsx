"use client";

import MeetingTypeList from "@/components/MeetingTypeList";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

const Home = () => {
	const [currentTime, setCurrentTime] = useState(new Date());

	const { user } = useUser();

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => {
			clearInterval(timer);
		};
	}, []);

	const time = currentTime.toLocaleString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});

	const date = currentTime.toLocaleDateString("en-US", {
		weekday: "long",
		month: "short",
		day: "2-digit",
		year: "numeric",
	});

	return (
		<section className='flex size-full flex-col gap-10 text-white'>
			<div className='h-[260px] w-full rounded-[20px] bg-hero bg-cover'>
				<div className='flex h-full flex-col justify-between max-lg:px-5 max-lg:py-8 lg:p-6 '>
					<h2 className='glassmorphism max-w-[264px] rounded py-2 text-center text-base font-medium border border-zinc-600 hover:border-blue-1  transition-all duration-300'>
						Welcome to Nexus!
						<span className='text-blue-1 ml-1 font-semibold uppercase'>
							{user?.username}
						</span>
					</h2>
					<div className='flex flex-col gap-1'>
						<h1 className='text-4xl font-extrabold lg:text-7xl'>
							{time}
						</h1>
						<p className='text-lg font-medium text-sky-1 lg:text-xl'>
							{date}
						</p>
					</div>
				</div>
			</div>

			<MeetingTypeList />
		</section>
	);
};

export default Home;
