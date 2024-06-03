import { cn } from "@/lib/utils";
import {
	CallControls,
	CallingState,
	CallParticipantsList,
	CallStatsButton,
	PaginatedGridLayout,
	SpeakerLayout,
	useCallStateHooks,
} from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutList, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import EndCallButton from "./EndCallButton";
import Loader from "./Loader";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import Image from "next/image";
import CopyUrlButton from "./copy";
import CurrentTime from "./CurrentTime";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const MeetingRoom = () => {
	const searchParams = useSearchParams();
	const { toast } = useToast();

	const isPersonalRoom = !!searchParams.get("personal");

	const [layout, setLayout] = useState<CallLayoutType>("speaker-left");

	const [showParticipants, setShowParticipants] = useState(false);

	const { useCallCallingState } = useCallStateHooks();

	const callingState = useCallCallingState();
	const router = useRouter();

	

	if (callingState !== CallingState.JOINED) return <Loader />;

	const CallLayout = () => {
		switch (layout) {
			case "grid":
				return <PaginatedGridLayout />;
				break;

			case "speaker-right":
				return <SpeakerLayout participantsBarPosition='left' />;

			default:
				return <SpeakerLayout participantsBarPosition='right' />;
		}
	};
	
	return (
		<section className='relative h-screen w-full overflow-hidden pt-4 text-white'>
			<div className='relative flex size-full justify-center'>
				<div className='flex absolute top-0 w-full justify-between items-center px-10 py-1 max-md:px-4 '>
					<div className='flex justify-center items-center max-sm:flex-col'>
						<div className='gap-1 flex justify-center items-center'>
							<Image
								src='/icons/logo.svg'
								width={30}
								height={30}
								alt='logo'
								className='max-sm:size-10'
							/>
							<p className='text-[24px] flex font-extrabold text-white  text-center '>
								Nexus
								<Image
									src='/icons/vertical-line.png'
									width={24}
									height={24}
									alt='pipe'
									className='max-sm:hidden'
								/>
							</p>
						</div>

						<div className=' text-[12px] flex justify-center items-center  gap-1 max-sm:mt-[1px]'>
							<i className='fa-regular fa-copyright'></i>
							<p>Utkarsh Tiwari</p>
						</div>
					</div>
					<div className=''>
						<CopyUrlButton />
					</div>
				</div>

				<div className='flex size-full max-w-[920px] items-center'>
					<CallLayout />
				</div>
				<div
					className={cn("h-[calc(100vh-86px)] hidden ml-2", {
						"show-block": showParticipants,
					})}
				>
					<CallParticipantsList
						onClose={() => setShowParticipants(false)}
					/>
				</div>
			</div>

			<div className='max-md:hidden flex w-full'>
				<div className='  hover:border-blue-1 transition  p-2 px-4 shadow-md bg-dark-1 rounded-md border border-gray-800 hover:shadow-xl fixed bottom-5 left-5  flex    justify-start ml-4  items-center z-100 '>
					<p className='text-xl font-extrabold '>

<CurrentTime />

					</p>
				</div>
				<div className='absolute bottom-2 flex  m-auto w-full gap-3 flex-wrap  justify-center items-center'>
					
						<CallControls
							onLeave={async () => {
								router.push("/");
								toast({
									title: "You Left the Meeting Room",
								});
							}}
						/>

						{!isPersonalRoom && <EndCallButton />}
					
				</div>
				<div className='fixed bottom-5 right-5  flex   gap-3 justify-end mr-4  items-center'>
					<button
						onClick={() => setShowParticipants((prev) => !prev)}
					>
						<div className='flex items-center justify-center rounded-full bg-[#19232d] p-2 hover:bg-[#4c535b] cursor-pointer'>
							<Users size={20} className='text-white' />
						</div>
					</button>
					<DropdownMenu>
						<div className='flex items-center '>
							<DropdownMenuTrigger className='cursor-pointer rounded-full bg-[#19232d]  p-2 hover:bg-[#4c535b]'>
								<LayoutList size={20} className='text-white' />
							</DropdownMenuTrigger>
						</div>

						<DropdownMenuContent className='border-dark-1 bg-dark-1 text-white'>
							{["Grid", "Speaker-Left", "Speaker-Right"].map(
								(item, index) => (
									<div key={index}>
										<DropdownMenuItem
											key={item}
											className='cursor-pointer '
											onClick={() => {
												setLayout(
													item.toLowerCase() as CallLayoutType,
												);
											}}
										>
											{item}
										</DropdownMenuItem>
										<DropdownMenuSeparator className='border-dark-1' />
									</div>
								),
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			{!isPersonalRoom ? (
				<>
					<div className='sm:hidden '>
						<div className='fixed bottom-0 flex w-full  gap-2 flex-wrap  justify-center items-center flex-col'>
							<div>
								<CallControls
									onLeave={async () => {
										router.push("/");
										toast({
											title: "You Left the Meeting Room",
										});
									}}
								/>
							</div>
							<div className='w-full  gap-2  flex justify-center items-center mb-3'>
								{!isPersonalRoom && <EndCallButton />}
								<button
									onClick={() =>
										setShowParticipants((prev) => !prev)
									}
								>
									<div className='flex items-center justify-center rounded-full bg-[#19232d] p-2 hover:bg-[#4c535b] cursor-pointer'>
										<Users
											size={20}
											className='text-white'
										/>
									</div>
								</button>
								<DropdownMenu>
									<div className='flex items-center '>
										<DropdownMenuTrigger className='cursor-pointer rounded-full bg-[#19232d]  p-2 hover:bg-[#4c535b]'>
											<LayoutList
												size={20}
												className='text-white'
											/>
										</DropdownMenuTrigger>
									</div>

									<DropdownMenuContent className='border-dark-1 bg-dark-1 text-white'>
										{[
											"Grid",
											"Speaker-Left",
											"Speaker-Right",
										].map((item, index) => (
											<div key={index}>
												<DropdownMenuItem
													key={item}
													className='cursor-pointer '
													onClick={() => {
														setLayout(
															item.toLowerCase() as CallLayoutType,
														);
													}}
												>
													{item}
												</DropdownMenuItem>
												<DropdownMenuSeparator className='border-dark-1' />
											</div>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
					</div>
					<div className='md:hidden max-sm:hidden'>
						<div className='fixed bottom-0 flex w-full  gap-2 flex-wrap  justify-center items-center'>
							<CallControls
								onLeave={async () => {
									router.push("/");
									toast({
										title: "You Left the Meeting Room",
									});
								}}
							/>

							{!isPersonalRoom && <EndCallButton />}
							<button
								onClick={() =>
									setShowParticipants((prev) => !prev)
								}
							>
								<div className='flex items-center justify-center rounded-full bg-[#19232d] p-2 hover:bg-[#4c535b] cursor-pointer'>
									<Users size={20} className='text-white' />
								</div>
							</button>
							<DropdownMenu>
								<div className='flex items-center '>
									<DropdownMenuTrigger className='cursor-pointer rounded-full bg-[#19232d]  p-2 hover:bg-[#4c535b]'>
										<LayoutList
											size={20}
											className='text-white'
										/>
									</DropdownMenuTrigger>
								</div>

								<DropdownMenuContent className='border-dark-1 bg-dark-1 text-white'>
									{[
										"Grid",
										"Speaker-Left",
										"Speaker-Right",
									].map((item, index) => (
										<div key={index}>
											<DropdownMenuItem
												key={item}
												className='cursor-pointer '
												onClick={() => {
													setLayout(
														item.toLowerCase() as CallLayoutType,
													);
												}}
											>
												{item}
											</DropdownMenuItem>
											<DropdownMenuSeparator className='border-dark-1' />
										</div>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>{" "}
				</>
			) : (
				<>
					<div className='sm:hidden '>
						<div className='fixed bottom-0 flex w-full  gap-2 flex-wrap  justify-center items-center'>
							<CallControls
								onLeave={async () => {
									router.push("/");
									toast({
										title: "You Left the Meeting Room",
									});
								}}
							/>

							{!isPersonalRoom && <EndCallButton />}
							<button
								onClick={() =>
									setShowParticipants((prev) => !prev)
								}
							>
								<div className='flex items-center justify-center rounded-full bg-[#19232d] p-2 hover:bg-[#4c535b] cursor-pointer'>
									<Users size={20} className='text-white' />
								</div>
							</button>
							<DropdownMenu>
								<div className='flex items-center '>
									<DropdownMenuTrigger className='cursor-pointer rounded-full bg-[#19232d]  p-2 hover:bg-[#4c535b]'>
										<LayoutList
											size={20}
											className='text-white'
										/>
									</DropdownMenuTrigger>
								</div>

								<DropdownMenuContent className='border-dark-1 bg-dark-1 text-white'>
									{[
										"Grid",
										"Speaker-Left",
										"Speaker-Right",
									].map((item, index) => (
										<div key={index}>
											<DropdownMenuItem
												key={item}
												className='cursor-pointer '
												onClick={() => {
													setLayout(
														item.toLowerCase() as CallLayoutType,
													);
												}}
											>
												{item}
											</DropdownMenuItem>
											<DropdownMenuSeparator className='border-dark-1' />
										</div>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
					<div className='md:hidden max-sm:hidden'>
						<div className='fixed bottom-0 flex w-full  gap-2 flex-wrap  justify-center items-center'>
							<CallControls
								onLeave={async () => {
									router.push("/");
									toast({
										title: "You Left the Meeting Room",
									});
								}}
							/>

							{!isPersonalRoom && <EndCallButton />}
							<button
								onClick={() =>
									setShowParticipants((prev) => !prev)
								}
							>
								<div className='flex items-center justify-center rounded-full bg-[#19232d] p-2 hover:bg-[#4c535b] cursor-pointer'>
									<Users size={20} className='text-white' />
								</div>
							</button>
							<DropdownMenu>
								<div className='flex items-center '>
									<DropdownMenuTrigger className='cursor-pointer rounded-full bg-[#19232d]  p-2 hover:bg-[#4c535b]'>
										<LayoutList
											size={20}
											className='text-white'
										/>
									</DropdownMenuTrigger>
								</div>

								<DropdownMenuContent className='border-dark-1 bg-dark-1 text-white'>
									{[
										"Grid",
										"Speaker-Left",
										"Speaker-Right",
									].map((item, index) => (
										<div key={index}>
											<DropdownMenuItem
												key={item}
												className='cursor-pointer '
												onClick={() => {
													setLayout(
														item.toLowerCase() as CallLayoutType,
													);
												}}
											>
												{item}
											</DropdownMenuItem>
											<DropdownMenuSeparator className='border-dark-1' />
										</div>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</>
			)}
		</section>
	);
};

export default MeetingRoom;
