import { FC, ReactNode, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './Tooltip.module.scss';

interface TooltipProps {
    text: string;
    children?: ReactNode;
}

export const Tooltip: FC<TooltipProps> = ({ text }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isVisible && wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            const spaceNeeded = 300; // максимальная ширина тултипа
            
            // Вычисляем позицию
            let left = rect.left + (rect.width / 2) - (spaceNeeded / 2);
            const top = rect.top - 10 - 90; // 70px - примерная высота тултипа
            
            // Проверяем выход за левый край
            if (left < 16) {
                left = 16; // минимальный отступ от края
            }
            
            // Проверяем выход за правый край
            if (left + spaceNeeded > window.innerWidth - 16) {
                left = window.innerWidth - spaceNeeded - 16;
            }
            
            setTooltipStyle({
                left: `${left}px`,
                top: `${top}px`
            });
        }
    }, [isVisible]);

    return (
        <div 
            ref={wrapperRef}
            className={styles.tooltipWrapper}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            <div className={styles.iconWrapper}>
                <Image src="/card/hint.svg" alt="hint" width={24} height={24} />
            </div>
            {isVisible && (
                <div 
                    className={styles.tooltip}
                    style={tooltipStyle}
                >
                    {text}
                </div>
            )}
        </div>
    );
}; 