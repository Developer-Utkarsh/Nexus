"use client";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
const Sidebar = () => {
	const pathname = usePathname();
	return (
		<section className='sticky left-0 top-0 flex h-screen w-fit flex-col justify-between bg-dark-1  pt-[72px] text-white max-sm:hidden lg:w-[18%] '>
			<div className='flex flex-1 flex-col gap-2  p-3 '>
				{sidebarLinks.map((link) => {
					const isActive = pathname === link.route;
					return (
						<Link
							key={link.label}
							href={link.route}
							className={cn(
								"flex gap-4 items-center p-3  justify-start rounded-[6px] hover:bg-dark-2 transition",
								{
									"bg-blue-1 hover:bg-blue-500": isActive,
								},
							)}
						>
							<Image
								src={link.imgUrl}
								alt={link.label}
								width={18}
								height={18}
							/>
							<p className='text-lg  font-semibold max-lg:hidden'>
								{link.label}
							</p>
						</Link>
					);
				})}
			</div>

			<div className='flex fixed bottom-0 border-t border-gray-700 w-full bg-dark-1 px-2 py-[6px] text-slate-100 justify-between  items-center hover:text-white transition lg:w-[18%] hover:border-blue-1'>
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
		</section>
	);
};

export default Sidebar;
