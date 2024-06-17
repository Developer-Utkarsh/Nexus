import Link from "next/link";
import { useState } from "react";
import Loader from "@/components/Loader";

interface MeetingNotStartedProps {
	status: string;
	startsAt: string;
	username: string;
	onRefresh: () => void;
}

export default function MeetingNotStarted({
	status,
	startsAt,
	username,
	onRefresh,
}: MeetingNotStartedProps) {
	const [isRefreshing, setIsRefreshing] = useState(false);

	const handleRefresh = async () => {
		setIsRefreshing(true);
		await onRefresh();
		setIsRefreshing(false);
	};

	return (
		<div className='flex flex-col items-center justify-center min-h-[100dvh] px-4 sm:px-6 md:px-8'>
			{isRefreshing ? (
				<Loader />
			) : (
				<div className='max-w-md w-full bg-dark-1 dark:bg-gray-2 rounded-lg shadow-lg p-8 z-50'>
					<div className='flex flex-col items-center space-y-6'>
						<CalendarCheckIcon className='h-16 w-16 text-red-500' />
						<div className='text-center'>
							<h1 className='text-2xl font-bold text-gray-100 dark:text-gray-100'>
								Meeting Not Started Yet
							</h1>
							<p className='text-gray-400 dark:text-gray-400 mt-2'>
								This meeting is not started yet by{" "}
								<span className='text-blue-1 font-semibold tracking-wide'>
									@{username}
								</span>
								.
							</p>
						</div>
						<div className='flex justify-between items-center w-full '>
							<div className='flex flex-col items-start text-left'>
								<p className='text-sm font-medium text-gray-400 dark:text-gray-400'>
									Starts At:
								</p>
								<p className='text-base text-slate-200 whitespace-pre-line'>
									{startsAt}
								</p>
							</div>
							<div className='flex flex-col items-end text-right'>
								<p className='text-sm font-medium text-gray-400 dark:text-gray-400'>
									Status:
								</p>
								<p
									className={`text-base whitespace-pre-line rounded-full text-gray-200 ${
										status === "Scheduled"
											? "bg-blue-1 p-1 px-2"
											: "bg-orange-500 p-1 px-2"
									}`}
								>
									{status}
								</p>
							</div>
						</div>
						<div className='flex w-full gap-2'>
							<button
								onClick={handleRefresh}
								className='flex items-center justify-center px-4 py-2 rounded-md bg-blue-1 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950 gap-2 cursor-pointer text-lg mt-6 w-full text-gray-200'
							>
								<i
									className={`fa-solid fa-repeat ${
										isRefreshing ? "animate-spin" : ""
									}`}
								></i>{" "}
								Refresh
							</button>
							<Link href='/' prefetch={false}>
								<a className='flex items-center justify-center px-4 py-2 rounded-md border border-blue-1 font-medium hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950 gap-2 cursor-pointer text-lg mt-6 w-full text-gray-200'>
									<i className='fa-solid fa-house'></i> Home
								</a>
							</Link>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

function CalendarCheckIcon(props: React.SVGProps<SVGSVGElement>) {
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
			<path d='M8 2v4' />
			<path d='M16 2v4' />
			<rect width='18' height='18' x='3' y='4' rx='2' />
			<path d='M3 10h18' />
			<path d='m9 16 2 2 4-4' />
		</svg>
	);
}
