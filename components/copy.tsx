"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const CopyUrlButton = () => {
	const [isCopied, setIsCopied] = useState(false);

	const copyUrl = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			setIsCopied(true);
			setTimeout(() => setIsCopied(false), 2000); // Reset the state after 2 seconds
		} catch (err) {
			console.error("Failed to copy URL: ", err);
		}
	};

	return (
		<button
			onClick={copyUrl}
			className={cn(
				"rounded-md gap-2 px-3 py-2 text-sm font-medium cursor-pointer border border-slate-800 transition z-100 ",
				isCopied
					? "border-green-500 text-white hover:border-green-500"
					: "bg-dark-1 text-gray-100 hover:border-slate-700 ",
			)}
		>
			{isCopied ? "Link Copied!" : "Copy Call Link"}
			{isCopied ? (
				<i className='fa-solid fa-check text-green-500 ml-2'></i>
			) : (
				<i className='fa-regular fa-copy ml-2'></i>
			)}
		</button>
	);
};

export default CopyUrlButton;
