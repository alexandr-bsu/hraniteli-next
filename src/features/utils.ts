import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// // Конвертируем текущее время в МСК
// export const getMoscowTime = (): Date => {
//   const userTime = new Date();
//   const userTimeZoneOffset = userTime.getTimezoneOffset() * 60 * 1000; // get user's time zone offset in milliseconds
//   const moscowOffset = 3 * 60 * 60 * 1000; // Moscow is UTC+3
//   const moscowTime = new Date(
//     userTime.getTime() + userTimeZoneOffset + moscowOffset
//   );

//   return moscowTime;
// };

// // Получить разницу в часовых поясах между московским временем и временем пользователя
//  getTimeDifference = (): number => {
//   const userTime = new Date().getTime();
//   const moscowTime = getMoscowTime().getTime();
//   const timeDifference = Math.round((userTime - moscowTime) / 1000 / 60 / 60);
//   return timeDifference;
// };

export const getMoscowTime = (): Date => {
  const now = new Date();
  // Московское время — это текущее UTC время +3 часа
  return new Date(now.getTime() + 3 * 60 * 60 * 1000);
};

export const getTimeDifference = (): number => {
  // Смещение пользователя в часах (например, для UTC+3 вернет 3)
  const userOffset = -(new Date().getTimezoneOffset() / 60);
  const moscowOffset = 3; // Москва UTC+3
  // Разница = Московское смещение - пользовательское смещение
  return userOffset-moscowOffset;
};  