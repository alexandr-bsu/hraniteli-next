import { useRef, useCallback, useEffect } from 'react';

interface UseDragToScrollOptions {
    direction?: 'horizontal' | 'vertical' | 'both';
    sensitivity?: number;
    disabled?: boolean;
}

export const useDragToScroll = (options: UseDragToScrollOptions = {}) => {
    const {
        direction = 'both',
        sensitivity = 1,
        disabled = false
    } = options;

    const elementRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startPos = useRef({ x: 0, y: 0 });
    const scrollStart = useRef({ left: 0, top: 0 });
    const animationFrame = useRef<number | null>(null);

    const handleMouseDown = useCallback((e: MouseEvent) => {
        if (disabled || !elementRef.current) return;

        // Только левая кнопка мыши
        if (e.button !== 0) return;

        isDragging.current = true;
        startPos.current = { x: e.clientX, y: e.clientY };
        scrollStart.current = {
            left: elementRef.current.scrollLeft,
            top: elementRef.current.scrollTop
        };

        // Предотвращаем выделение текста
        e.preventDefault();

        // Меняем курсор
        if (elementRef.current) {
            elementRef.current.style.cursor = 'grabbing';
            elementRef.current.style.userSelect = 'none';
        }
    }, [disabled]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging.current || !elementRef.current) return;

        e.preventDefault();

        const deltaX = (e.clientX - startPos.current.x) * sensitivity;
        const deltaY = (e.clientY - startPos.current.y) * sensitivity;

        if (direction === 'horizontal' || direction === 'both') {
            elementRef.current.scrollLeft = scrollStart.current.left - deltaX;
        }

        if (direction === 'vertical' || direction === 'both') {
            elementRef.current.scrollTop = scrollStart.current.top - deltaY;
        }
    }, [direction, sensitivity]);

    const handleMouseUp = useCallback(() => {
        if (!isDragging.current) return;

        isDragging.current = false;

        // Восстанавливаем курсор
        if (elementRef.current) {
            elementRef.current.style.cursor = 'grab';
            elementRef.current.style.userSelect = '';
        }
    }, []);

    // Touch события для мобильных устройств
    const handleTouchStart = useCallback((e: TouchEvent) => {
        if (disabled || !elementRef.current) return;

        const touch = e.touches[0];
        isDragging.current = true;
        startPos.current = { x: touch.clientX, y: touch.clientY };
        scrollStart.current = {
            left: elementRef.current.scrollLeft,
            top: elementRef.current.scrollTop
        };

        // Предотвращаем стандартное поведение только если нужно
        if (direction === 'horizontal') {
            e.preventDefault();
        }
    }, [disabled, direction]);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!isDragging.current || !elementRef.current) return;

        const touch = e.touches[0];
        const deltaX = (touch.clientX - startPos.current.x) * sensitivity;
        const deltaY = (touch.clientY - startPos.current.y) * sensitivity;

        if (direction === 'horizontal' || direction === 'both') {
            elementRef.current.scrollLeft = scrollStart.current.left - deltaX;
            e.preventDefault(); // Предотвращаем горизонтальный скролл страницы
        }

        if (direction === 'vertical' || direction === 'both') {
            elementRef.current.scrollTop = scrollStart.current.top - deltaY;
        }
    }, [direction, sensitivity]);

    const handleTouchEnd = useCallback(() => {
        isDragging.current = false;
    }, []);

    useEffect(() => {
        const element = elementRef.current;
        if (!element || disabled) return;

        // Устанавливаем начальный курсор
        element.style.cursor = 'grab';

        // Mouse события
        element.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        // Touch события
        element.addEventListener('touchstart', handleTouchStart, { passive: false });
        element.addEventListener('touchmove', handleTouchMove, { passive: false });
        element.addEventListener('touchend', handleTouchEnd);

        // Предотвращаем контекстное меню при долгом нажатии
        element.addEventListener('contextmenu', (e) => {
            if (isDragging.current) {
                e.preventDefault();
            }
        });

        return () => {
            element.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchmove', handleTouchMove);
            element.removeEventListener('touchend', handleTouchEnd);

            // Восстанавливаем стили
            element.style.cursor = '';
            element.style.userSelect = '';
        };
    }, [handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd, disabled]);

    return elementRef;
};