import Image from "next/image";
import Link from "next/link";
import React from "react";
import MobileNav from "./MobileNav";
import {
	ClerkProvider,
	SignInButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";
const Navbar = () => {
	return (
		<nav className='flex-between fixed z-50 w-full bg-dark-1/60 px-4 max-md:px-6 py-3 max-md:py-[14px]  lg:px-6'>
			<Link href='/' className='flex items-center gap-1 '>
				<Image
					src='/icons/logo.svg'
					width={30}
					height={30}
					alt='logo'
					className='max-sm:size-10'
				/>
				<p className='text-[24px] font-extrabold text-white max-sm:hidden'>
					Nexus
				</p>
			</Link>

			<div className='flex-between flex gap-5'>
				<SignedIn>
					<UserButton />
				</SignedIn>
				<MobileNav />
			</div>
		</nav>
	);
};

export default Navbar;
