import { useState } from 'react';

const PhoneInput = () => {
  const [telephone, setTelephone] = useState('+7');
  const [isValid, setIsValid] = useState(true);

  const handleChange = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    
    // Разрешаем только цифры и знак +
    const cleanedValue = value.replace(/[^\d+]/g, '');
    
    // Автоматически добавляем +7 если его нет
    let newValue = cleanedValue;
    if (!cleanedValue.startsWith('+7')) {
      newValue = '+7' + cleanedValue.replace(/[^\d]/g, '');
    }
    
    // Ограничиваем длину (максимум 12 символов: +7 и 10 цифр)
    if (newValue.length > 12) return;
    
    setTelephone(newValue);
    
    // Проверяем валидность
    setIsValid(
      newValue.startsWith('+7') && 
      newValue.length === 12
    );
  };

  return (
    <div className="relative">
      <input
        value={telephone}
        onChange={handleChange}
        className="h-full px-[20px] grow focus-within:outline-none"
        type="tel"
        placeholder="+7"
      />
    </div>
  );
};

export default PhoneInput;