import Link from "next/link";

export default function NotFound() {
	return (
		<div className='flex flex-col items-center justify-center h-screen  text-gray-50 overflow-hidden'>
			<div className='relative w-full max-w-3xl'>
				<div className='absolute -top-32 -left-32 w-80 h-80 bg-[#00b894] rounded-full blur-3xl opacity-50 animate-pulse' />
				<div className='absolute -bottom-32 -right-32 w-80 h-80 bg-[#e84393] rounded-full blur-3xl opacity-50 animate-pulse' />
				<div className='relative z-10 flex flex-col items-center justify-center space-y-8'>
					<div className='w-full flex justify-center items-center'>
						<img
							src='/images/404.png'
							width={300}
							height={150}
							alt='404 Illustration'
							className='flex justify-center items-center animate-bounce'
						/>
					</div>
					<div className='space-y-4 text-center'>
						<h1 className='text-5xl font-bold tracking-tighter'>
							Nexus - Meeting Not Found
						</h1>
						<p className='text-lg text-gray-400'>
							Oops, it looks like the Meeting you're looking for
							doesn't exist. Please check the Meeting URL or try
							navigating back to the main app.
						</p>
						<Link
							href='/'
							className='inline-flex items-center justify-center h-10 px-6 py-2 rounded-md bg-blue-1 text-gray-100 font-medium hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-1 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 transition-colors gap-2'
							prefetch={false}
						>
							<i className='fa-solid fa-house'></i> Go Back Home
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
