import { FC, ReactNode, useState, useRef, useEffect } from 'react';
import styles from './Tooltip.module.scss';
import { createPortal } from 'react-dom';

interface TextTooltipProps {
    text: string;
    children: ReactNode;
}

export const TextTooltip: FC<TextTooltipProps> = ({ text, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [coords, setCoords] = useState<{top: number, left: number, width: number}>({top: 0, left: 0, width: 0});
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isVisible && !isMobile && wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + 8,
                left: rect.left + rect.width / 2,
                width: rect.width
            });
        }
    }, [isVisible, isMobile]);

    const getTooltipStyle = (): React.CSSProperties => {
        if (isMobile) {
            return {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 2147483647
            };
        }
        return {
            position: 'fixed',
            top: coords.top,
            left: coords.left,
            transform: 'translateX(-50%)',
            zIndex: 2147483647
        };
    };

    const handleClick = (e: React.MouseEvent) => {
        if (isMobile) {
            e.stopPropagation();
            setIsVisible(!isVisible);
        }
    };

    const tooltipContent = (
        <div 
            className={styles.tooltip}
            style={getTooltipStyle()}
            onClick={(e) => e.stopPropagation()}
        >
            {text}
        </div>
    );

    const overlayContent = (
        <div 
            className={styles.overlay} 
            onClick={() => setIsVisible(false)} 
        />
    );

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
            {children}
            {isVisible && (
                <>
                    {isMobile && createPortal(overlayContent, document.body)}
                    {createPortal(tooltipContent, document.body)}
                </>
            )}
        </div>
    );
}; 