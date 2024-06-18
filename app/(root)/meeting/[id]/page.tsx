"use client";

import Loader from "@/components/Loader";
import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import MeetingEnded from "@/components/MeetingEnded";
import MeetingNotStarted from "@/components/MeetingNotStarted";
import MeetingCancelled from "@/components/MeetingCancelled";
import { useGetCallByID } from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import React, { useState, useEffect } from "react";
import NotFound from "@/components/MeetingNotFound";

interface MeetingDetails {
	isEnded: boolean;
	isStarted: boolean;
	isScheduled: boolean;
	isCancelled: boolean;
	createdBy: string;
	hostEmail: string;
	endedAt: string | null;
	startsAt: string;
	fullName: string;
	title: string;
}

const Meeting = ({ params: { id } }: { params: { id: string } }) => {
	const { user, isLoaded } = useUser();
	const [isSetupComplete, setIsSetupComplete] = useState(false);
	const [meetingDetails, setMeetingDetails] = useState<MeetingDetails | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(true);
	const { call, isCallLoading } = useGetCallByID(id);
	const [isPersonal, setIsPersonal] = useState(false);

	useEffect(() => {
		setIsPersonal(window.location.href.includes("personal"));
	}, []);

	const getMeetingDetails = async () => {
		if (isPersonal) return;

		try {
			const response = await fetch("/api/details", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ meetingId: id }),
			});

			if (!response.ok) {
				throw new Error("Meeting not found");
			}

			const data: MeetingDetails = await response.json();
			setMeetingDetails(data);
			if (data.createdBy) {
				document.title = `Nexus - Meeting by ${data.createdBy}`;
			}
		} catch (error) {
			console.error("Error fetching meeting details:", error);
			setMeetingDetails(null); // Ensure meetingDetails is null if there's an error
		} finally {
			setIsLoading(false);
		}
	};

	const cancelOverdueMeetings = async () => {
		if (isPersonal) return;
		try {
			await fetch("/api/cancelled", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
			getMeetingDetails();
		} catch (error) {
			console.error("Error cancelling overdue meetings:", error);
		}
	};

	useEffect(() => {
		getMeetingDetails();
	}, [id]);

	useEffect(() => {
		const interval = setInterval(cancelOverdueMeetings, 60000); // Check every minute
		return () => clearInterval(interval);
	}, []);

	const formatStartsAt = (startsAt: string) => {
		const now = new Date();
		const startDate = new Date(startsAt);
		const diffInDays = Math.floor(
			(startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
		);

		let dayText;
		if (diffInDays === 0) {
			dayText = "Today";
		} else if (diffInDays === 1) {
			dayText = "Tomorrow";
		} else {
			dayText = startDate.toLocaleDateString("en-US", {
				day: "numeric",
				month: "long",
			});
		}

		return `${dayText} at ${startDate.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		})}`;
	};

	const formatEndedAt = (endedAt: string | null) => {
		if (!endedAt) return "N/A";
		const endDate = new Date(endedAt);
		return endDate.toLocaleString("en-US", {
			month: "numeric",
			day: "numeric",
			year: "numeric",
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
			hour12: true,
		});
	};

	const getStatus = (startsAt: string) => {
		const now = new Date();
		const startDate = new Date(startsAt);
		return now > startDate ? "Delayed" : "Scheduled";
	};

	if (isLoading || !isLoaded || isCallLoading) {
		return <Loader />;
	}

	if (!meetingDetails && !isPersonal) {
		return <NotFound />; // Show NotFound component if meetingDetails is null
	}

	if (meetingDetails?.isCancelled) {
		return (
			<MeetingCancelled
				createdBy={meetingDetails.createdBy}
				createdAt={formatStartsAt(meetingDetails.startsAt)}
				fullName={meetingDetails.fullName}
			/>
		);
	}

	if (meetingDetails?.isEnded) {
		return (
			<MeetingEnded
				endedBy={meetingDetails.createdBy}
				endedAt={formatEndedAt(meetingDetails.endedAt)}
				fullName={meetingDetails.fullName}
			/>
		);
	}

	if (!meetingDetails?.isStarted && meetingDetails?.isScheduled) {
		if (
			user?.emailAddresses[0]?.emailAddress !== meetingDetails.hostEmail
		) {
			return (
				<MeetingNotStarted
					status={getStatus(meetingDetails.startsAt)}
					startsAt={formatStartsAt(meetingDetails.startsAt)}
					username={meetingDetails.createdBy}
					onRefresh={getMeetingDetails}
				/>
			);
		}
	}

	return (
		<main className='w-full h-screen z-50'>
			<StreamCall call={call}>
				<StreamTheme>
					{!isSetupComplete ? (
						<MeetingSetup
							setIsSetupComplete={setIsSetupComplete}
							createdBy={meetingDetails?.createdBy ?? ""}
							title={meetingDetails?.title ?? ""}
						/>
					) : (
						<MeetingRoom />
					)}
				</StreamTheme>
			</StreamCall>
		</main>
	);
};

export default Meeting;
