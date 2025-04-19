import { useState, useEffect } from 'react';

const TimezoneIndicator = () => {
  const [offset, setOffset] = useState('');

  useEffect(() => {
    // Московское время всегда UTC+3
    const mskTime = new Date().toLocaleString('en-US', {
      timeZone: 'Europe/Moscow',
      hour12: false
    });
    
    // Локальное время пользователя
    const localTime = new Date();
    
    // Вычисляем разницу в часах
    const mskDate = new Date(mskTime);
    const diffHours = Math.round((localTime.getTime() - mskDate.getTime()) / (1000 * 60 * 60));
    
    setOffset(diffHours === 0 ? '+0' : (diffHours > 0 ? `+${diffHours}` : `${diffHours}`));
  }, []);

  return <span>МСК ({offset})</span>;
};

export default TimezoneIndicator;
