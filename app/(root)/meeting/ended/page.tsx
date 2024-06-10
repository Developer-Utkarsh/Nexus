import Link from "next/link";

import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Nexus - Meeting Ended",
	description: "Your Nexus Meeting is Ended Now.",
};
export default function Component() {
	return (
		<div className='flex flex-col items-center justify-center h-screen  text-gray-50'>
			<div className='max-w-md px-10 py-8 rounded-lg bg-dark-1 shadow-lg z-50'>
				<div className='flex flex-col items-center'>
					<VideoOffIcon className='h-16 w-16 text-gray-400' />
					<h2 className='text-2xl font-bold mt-4'>
						You <span className='text-blue-500'>Left</span> the
						Meeting
					</h2>
					<div className='text-center w-full leading-normal flex justify-center items-center  flex-col mt-4 '>
						<p className='text-gray-300 font-semibold text-md'>
							You have left the video conference.
						</p>
						<p className='text-gray-400 font-medium text-[12px]'>
							The meeting is still ongoing for other participants.
						</p>
					</div>
					<Link
						href='/'
						className='flex items-center justify-center px-4 py-2 rounded-md bg-blue-1  font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950 gap-2 cursor-pointer text-lg mt-6 w-full'
						prefetch={false}
					>
						<i className='fa-solid fa-house'></i> Return to Home
					</Link>
				</div>
			</div>
		</div>
	);
}

function VideoOffIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		>
			<path d='M10.66 6H14a2 2 0 0 1 2 2v2.5l5.248-3.062A.5.5 0 0 1 22 7.87v8.196' />
			<path d='M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2' />
			<path d='m2 2 20 20' />
		</svg>
	);
}
