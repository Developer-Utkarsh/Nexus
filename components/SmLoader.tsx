import Image from "next/image";
import React from "react";

const SmLoader = () => {
	return (
		<div className='flex-center h-screen w-full'>
			<Image
				src='/icons/loading-circle.svg'
				alt='loading'
				width={8}
				height={8}
			/>
		</div>
	);
};

export default SmLoader;
