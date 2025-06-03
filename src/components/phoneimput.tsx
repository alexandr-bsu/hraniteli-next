import { ChangeEvent, useState } from 'react';

interface PhoneInputProps {
    onChange?: (value: string) => void;
    className?: string;
}

const formatPhoneNumber = (value: string): string => {
    // Убираем все кроме цифр и +
    const cleaned = value.replace(/[^\d+]/g, '');
    
    // Если нет +7 в начале, добавляем
    const withPrefix = cleaned.startsWith('7') ? cleaned : `7${cleaned.replace(/[^\d]/g, '')}`;
    
    // Ограничиваем длину до 12 символов (+7 и 10 цифр)
    return withPrefix.slice(0, 12);
};

const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+7\d{10}$/;
    return phoneRegex.test(phone);
};

export const PhoneInput: React.FC<PhoneInputProps> = ({ onChange, className = '' }) => {
    const [phone, setPhone] = useState('7');
    const [isValid, setIsValid] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const formattedPhone = formatPhoneNumber(e.target.value);
        const valid = validatePhone(formattedPhone);
        
        setPhone(formattedPhone);
        setIsValid(valid);
        onChange?.(formattedPhone);
    };

    return (
        <div className="relative w-full">
            <input
                value={phone}
                onChange={handleChange}
                className={`h-full px-[20px] grow focus-within:outline-none w-full ${className}`}
                type="tel"
                placeholder="+7"
                aria-invalid={!isValid}
            />
        </div>
    );
};

export default PhoneInput;