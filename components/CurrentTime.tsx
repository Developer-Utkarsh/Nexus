"use client"

import {useState,useEffect} from "react"

const CurrentTime = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => {
			clearInterval(timer);
		};
	}, []);
    const time = currentTime.toLocaleString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
  return (
    <div>{time}</div>
  )
}

export default CurrentTime