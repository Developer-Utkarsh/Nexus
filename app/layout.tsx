import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import { BackgroundBeams } from "@/components/ui/background-beams";

import NextTopLoader from "nextjs-toploader";

const inter = Noto_Sans({
	weight: "400",
	subsets: ["latin" as "latin"],
});

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";

export const metadata: Metadata = {
	title: "Nexus - Your Video & Audio Conferrencign APP",
	description:
		"Nexus is a fast and easy to use video conferencing app which helps to conduct and schedule meetings with personal rooms for personal meetings and recordings. Nexus uses less data during meetings and provides a fast and lag-free experience.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<head>
				<link
					rel='stylesheet'
					href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css'
					integrity='sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=='
					crossOrigin='anonymous'
					referrerPolicy='no-referrer'
				/>
			</head>

			<ClerkProvider
				appearance={{
					layout: {
						logoImageUrl: "/icons/logo.svg",
					},
					variables: {
						colorText: "#fff",
						colorPrimary: "#0e78f9",
						colorBackground: "#1c1f2e",
						colorInputBackground: "#252a41",
						colorInputText: "#fff",
					},
				}}
			>
				<body className={`${inter.className} bg-dark-2`}>
					<NextTopLoader
						color='#0E78F9'
						initialPosition={0.1}
						crawlSpeed={100}
						height={3}
						crawl={true}
						showSpinner={true}
						easing='ease-in-out'
						speed={500}
						shadow='0 0 10px #2299DD,0 0 5px #2299DD'
						template='<div class="bar" role="bar"><div class="peg"></div></div> 
  <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
						zIndex={1600}
						showAtBottom={false}
					/>
					<div className='z-0'>
						<BackgroundBeams />
					</div>
					<div className='z-50'>
						{children}
						<Toaster />
					</div>
				</body>
			</ClerkProvider>
		</html>
	);
}
