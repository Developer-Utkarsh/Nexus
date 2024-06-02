import StreamVideoProvider from "@/providers/StreamClientProvider";
import React, { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
	return (
		<main className="z-50">
			<StreamVideoProvider>{children}</StreamVideoProvider>
		</main>
	);
};

export default RootLayout;
