"use client";

import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function MobileNav() {
	const pathname = usePathname();

	return (
		<section className='w-full'>
			<Sheet>
				<SheetTrigger asChild>
					<Image
						src='/icons/hamburger.svg'
						width={32}
						height={32}
						alt='menu'
						className='cursor-pointer sm:hidden'
					/>
				</SheetTrigger>
				<SheetContent
					side='left'
					className='border-none bg-dark-1 px-4'
				>
					<Link href='/' className='flex items-center gap-1'>
						<Image
							src='/icons/logo.svg'
							width={28}
							height={28}
							alt='logo'
							className='max-sm:size-10`'
						/>
						<p className='text-[26px] font-extrabold text-white '>
							Nexus
						</p>
					</Link>
					<div className='flex h-[calc(100vh-72px)] p-0 flex-col justify-between overflow-y-auto'>
						<SheetClose asChild>
							<section className='flex h-full gap-4 gap-x-2 pt-6 text-white flex-col '>
								{sidebarLinks.map((link) => {
									const isActive = pathname === link.route;
									return (
										<SheetClose asChild key={link.route}>
											<Link
												key={link.label}
												href={link.route}
												className={cn(
													"flex gap-4 items-center p-4 rounded-[10px] w-full ",
													{
														"bg-blue-1": isActive,
													},
												)}
											>
												<Image
													src={link.imgUrl}
													alt={link.label}
													width={24}
													height={24}
												/>
												<p className='text-lg  font-semibold '>
													{link.label}
												</p>
											</Link>
										</SheetClose>
									);
								})}
							</section>
						</SheetClose>
					</div>
				</SheetContent>
			</Sheet>
		</section>
	);
}
