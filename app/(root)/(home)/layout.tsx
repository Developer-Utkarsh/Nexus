import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import React, { ReactNode } from "react";

const HomeLayout = ({ children }: { children: ReactNode }) => {
	return (
		<main className='relative'>
			<Navbar />
			<div className='flex'>
				<Sidebar />
				<section className='flex min-h-screen flex-1 flex-col px-10 pb-2 pt-[92px] max-sm:pt-24 max-md:pb-14 sm:px-10'>
					<div className='w-full'>{children}</div>
				</section>
			</div>
		</main>
	);
};

export default HomeLayout;
