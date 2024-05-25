import { SignUp } from "@clerk/nextjs";
import React from "react";

const SignUpPage = () => {
	return (
		<main className='flex h-screen w-full justify-center items-center '>
			<div className='pt-8'>
				<SignUp />
			</div>
			<div className='flex fixed bottom-0 border-t border-dark-2 w-full bg-dark-1 p-2 text-slate-100 justify-between  items-center hover:text-white transition px-8 mt-2 hover:border-blue-1'>
				<div
					className=' text-sm  
				 flex justify-center items-center  gap-1 '
				>
					<i className='fa-regular fa-copyright'></i>
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
		</main>
	);
};

export default SignUpPage;
