import { FC, ReactNode, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './Tooltip.module.scss';

interface TooltipProps {
    text: string;
    children?: ReactNode;
}

export const Tooltip: FC<TooltipProps> = ({ text }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 1024);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const getTooltipStyle = (): React.CSSProperties => {
        if (!wrapperRef.current || isMobile) return {};

        const rect = wrapperRef.current.getBoundingClientRect();
        const spaceNeeded = 300;
        
        let left = rect.left + (rect.width / 2) - (spaceNeeded / 2);
        const top = rect.top - 10;
        
        if (left < 16) left = 16;
        if (left + spaceNeeded > window.innerWidth - 16) {
            left = window.innerWidth - spaceNeeded - 16;
        }
        
        return {
            position: 'fixed',
            left: `${left}px`,
            top: `${top}px`,
            transform: 'translateY(-100%)',
            zIndex: 1000
        };
    };

    const handleClick = (e: React.MouseEvent) => {
        if (isMobile) {
            e.stopPropagation();
            setIsVisible(!isVisible);
        }
    };

    return (
        <div 
            ref={wrapperRef}
            className={styles.tooltipWrapper}
            onClick={handleClick}
            {...(!isMobile && {
                onMouseEnter: () => setIsVisible(true),
                onMouseLeave: () => setIsVisible(false)
            })}
        >
            <div className={styles.iconWrapper}>
                <Image src="/card/hint.svg" alt="hint" width={24} height={24} />
            </div>
            {isVisible && (
                <>
                    {isMobile && (
                        <div 
                            className={styles.overlay} 
                            onClick={() => setIsVisible(false)} 
                        />
                    )}
                    <div 
                        className={styles.tooltip}
                        style={getTooltipStyle()}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {text}
                    </div>
                </>
            )}
        </div>
    );
}; 