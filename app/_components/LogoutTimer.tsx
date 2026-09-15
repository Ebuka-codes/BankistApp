"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

const INACTIVITY_TIME = 1 * 30;

const LogoutTimer = () => {
  const [time, setTime] = useState(INACTIVITY_TIME);

  useEffect(() => {
    const resetTimer = () => {
      setTime(INACTIVITY_TIME);
    };

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    const interval = setInterval(() => {
      setTime((previousTime) => {
        if (previousTime <= 1) {
          clearInterval(interval);
          signOut({ redirectTo: "/" });
          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);

      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);

  return <div className="text-[14px] text-center"></div>;
};

export default LogoutTimer;
