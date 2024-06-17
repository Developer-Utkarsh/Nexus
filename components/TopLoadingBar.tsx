import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const TopLoadingBar = ({ progress }: { progress: number }) => {
	return (
		<div className='fixed top-0 left-0 w-full h-1 z-50'>
			<div
				className={cn("h-full bg-blue-1 transition-all duration-1000")}
				style={{ width: `${progress}%` }}
			></div>
		</div>
	);
};

export default TopLoadingBar;
