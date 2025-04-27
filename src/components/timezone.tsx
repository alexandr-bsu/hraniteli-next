import { useState, useEffect } from 'react';

interface TimezoneIndicatorProps {
    className?: string;
}

const calculateMskOffset = (): number => {
    const mskTime = new Date().toLocaleString('en-US', {
        timeZone: 'Europe/Moscow',
        hour12: false
    });
    
    const localTime = new Date();
    const mskDate = new Date(mskTime);
    
    return Math.round((localTime.getTime() - mskDate.getTime()) / (1000 * 60 * 60));
};

const formatOffset = (offset: number): string => {
    if (offset === 0) return '+0';
    return offset > 0 ? `+${offset}` : `${offset}`;
};

export const TimezoneIndicator: React.FC<TimezoneIndicatorProps> = ({ className = '' }) => {
    const [offset, setOffset] = useState<string>('');

    useEffect(() => {
        const mskOffset = calculateMskOffset();
        setOffset(formatOffset(mskOffset));
    }, []);

    return (
        <span className={className}>
            МСК ({offset})
        </span>
    );
};

export default TimezoneIndicator;
