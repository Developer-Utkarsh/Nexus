import StreamVideoProvider from "@/providers/StreamClientProvider";
import React, { ReactNode } from "react";

import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Nexus - Meeting Joining Invitation",
	description:
		"Nexus is a fast and easy to use video conferencing app which helps to conduct and schedule meetings with personal rooms for personal meetings and recordings. Nexus uses less data during meetings and provides a fast and lag-free experience.",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
	return (
		<main className='z-50'>
			<StreamVideoProvider>{children}</StreamVideoProvider>
		</main>
	);
};

export default RootLayout;
