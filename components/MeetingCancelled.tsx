import Link from "next/link";

interface MeetingEndedProps {
	createdBy: string;
	createdAt: React.ReactNode;
	fullName: string;
}

export default function MeetingEnded({
	createdBy,
	createdAt,
	fullName,
}: MeetingEndedProps) {
	const formatEndedBy = (endedBy: string) => {
		const username = `@${endedBy.split(" ").join("").toLowerCase()}`;
		return (
			<>
				{fullName}
				<br />
				<span className='text-sm text-gray-500'>{username}</span>
			</>
		);
	};

	return (
		<div className='flex flex-col items-center justify-center min-h-[100dvh] px-4 sm:px-6 md:px-8'>
			<div className='max-w-md w-full bg-dark-1 dark:bg-gray-2 rounded-lg shadow-lg p-8 z-50'>
				<div className='flex flex-col items-center space-y-6'>
					<CalendarXIcon className='h-16 w-16 text-red-500' />
					<div className='text-center'>
						<h1 className='text-2xl font-bold text-gray-100 dark:text-gray-100'>
							Meeting Cancelled
						</h1>
						<p className='text-gray-400 dark:text-gray-400 mt-2'>
							This meeting is cancelled.
						</p>
					</div>
					<div className='flex justify-between items-center w-full '>
						<div className='flex flex-col items-start text-left'>
							<p className='text-sm font-medium text-gray-400 dark:text-gray-400'>
								Created At:
							</p>
							<p className='text-base text-slate-200  whitespace-pre-line'>
								{createdAt}
							</p>
						</div>
						<div className='flex flex-col items-end text-right'>
							<p className='text-sm font-medium text-gray-400 dark:text-gray-400'>
								Created By:
							</p>
							<p className='text-base text-slate-200 whitespace-pre-line'>
								{formatEndedBy(createdBy)}
							</p>
						</div>
					</div>
					<Link
						href='/'
						className='flex items-center justify-center px-4 py-2 rounded-md bg-blue-1 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950 gap-2 cursor-pointer text-lg mt-6 w-full text-gray-100'
						prefetch={false}
					>
						<i className='fa-solid fa-house'></i> Return to Home
					</Link>
				</div>
			</div>
		</div>
	);
}

function CalendarXIcon(props: React.SVGProps<SVGSVGElement>) {
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
			<path d='m14 14-4 4' />
			<path d='m10 14 4 4' />
		</svg>
	);
}
