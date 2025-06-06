import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

export const getAgeWord = (age: number): string => {
    const lastDigit = age % 10;
    const lastTwoDigits = age % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'лет';
    if (lastDigit === 1) return 'год';
    if (lastDigit >= 2 && lastDigit <= 4) return 'года';
    return 'лет';
};

export const clearStorage = (is_research_redirect: boolean = false) => {
  localStorage.removeItem('app_age')
  localStorage.removeItem('app_diseases_psychologist')
  localStorage.removeItem('app_traumatic')
  localStorage.removeItem('app_conditions')
  localStorage.removeItem('app_gender_psychologist')
  localStorage.removeItem('matching_attempts')
  
  if(!is_research_redirect){
    localStorage.removeItem('app_occupation')
  }
}