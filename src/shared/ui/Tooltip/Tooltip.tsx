import { FC, ReactNode, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './Tooltip.module.scss';
import { createPortal } from 'react-dom';

interface TooltipProps {
    text: string;
    customMargin ?: string;
    children?: ReactNode;
    className?: string
}

export const Tooltip: FC<TooltipProps> = ({ text, children, customMargin, className }) => {
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
                top: rect.bottom + 8, // 8px смещение вниз
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
            dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br />') }}
        />
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
            className={`${styles.tooltipWrapper} ${className}`}
            onClick={handleClick}
            {...(!isMobile && {
                onMouseEnter: () => setIsVisible(true),
                onMouseLeave: () => setIsVisible(false)
            })}
        >
            <div className={styles.iconWrapper}>
                {children ? children : <Image src="/card/hint.svg" alt="hint" width={24} height={24} />}
            </div>
            {isVisible && ((isMobile || coords.top !== 0) && (
                <>
                    {isMobile && createPortal(overlayContent, document.body)}
                    {createPortal(tooltipContent, document.body)}
                </>
            ))}
        </div>
    );
}; 