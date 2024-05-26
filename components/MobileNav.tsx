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
											<div>
												<Link
													key={link.label}
													href={link.route}
													className={cn(
														"flex gap-4 items-center p-4 rounded-[10px] w-full ",
														{
															"bg-blue-1":
																isActive,
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
											</div>
										</SheetClose>
									);
								})}
							</section>
						</SheetClose>
					</div>
					<div className='flex fixed bottom-0 border-t border-gray-700 bg-dark-1 px-2 py-[6px] text-slate-100 justify-between  items-center hover:text-white transition hover:border-blue-1 w-[70%]'>
						<div
							className=' text-[14px] 
				 flex justify-center items-center  gap-1 '
						>
							<i className='fa-regular fa-copyright mt-[1px]'></i>
							<p>Utkarsh Tiwari</p>
						</div>
						<div className='flex gap-3  text-base  '>
							<a
								href='https://www.linkedin.com/in/DeveloperUtkarsh/'
								target='_blank'
							>
								<i className='fa-brands fa-linkedin-in  hover:text-blue-1 hover:transform hover:scale-110 transition cursor-pointer'></i>
							</a>
							<a
								href='https://github.com/Developer-Utkarsh'
								target='_blank'
							>
								<i className='fa-brands fa-github hover:text-blue-1 hover:transform hover:scale-110 transition cursor-pointer'></i>
							</a>
							<a
								href='https://instagram.com/developer_utkarsh/'
								target='_blank'
							>
								<i className='fa-brands fa-instagram  hover:text-blue-1 hover:transform hover:scale-110 transition cursor-pointer'></i>
							</a>
						</div>
					</div>
				</SheetContent>
			</Sheet>
		</section>
	);
}
