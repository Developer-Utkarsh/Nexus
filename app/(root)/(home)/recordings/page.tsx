import CallList from "@/components/CallList";
import React from "react";

import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Nexus - Recordings",
	description:
		"This page will show the Meetings Recordings which is Recorded by you in earlier meetings conference.",
};

const Recordings = () => {
	return (
		<section className='flex size-full flex-col gap-10 text-white'>
			<h1 className='text-3xl font-bold'>Recordings</h1>

			<CallList type='recordings' />
		</section>
	);
};

export default Recordings;
