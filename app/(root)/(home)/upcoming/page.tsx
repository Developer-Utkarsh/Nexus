import CallList from "@/components/CallList";
import React from "react";

import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Nexus - Upcoming Meetings",
	description:
		"This page will show the upcoming meetings which is scheduled by you earlier.",
};

const Upcoming = () => {
	return (
		<section className='flex size-full flex-col gap-10 text-white'>
			<h1 className='text-3xl font-bold'>Upcoming</h1>
			<CallList type='upcoming' />
		</section>
	);
};

export default Upcoming;
