import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const getMoscowTime= (): Date => {
    const userTime = new Date();
    const userTimeZoneOffset = userTime.getTimezoneOffset() * 60 * 1000; // get user's time zone offset in milliseconds
    const moscowOffset = 3 * 60 * 60 * 1000; // Moscow is UTC+3
    const moscowTime = new Date(
      userTime.getTime() + userTimeZoneOffset + moscowOffset
    );

    return moscowTime;
}

export const getTimeDifference = (): number => {
    const userTime = new Date().getTime();
    const moscowTime = getMoscowTime().getTime();
    const timeDifference = Math.round((userTime - moscowTime) / 1000 / 60 / 60);
    return timeDifference;
};
