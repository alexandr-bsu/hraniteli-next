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
    const optionsRef = useRef({ direction, sensitivity, disabled });

    // Обновляем опции в ref при каждом рендере
    optionsRef.current = { direction, sensitivity, disabled };

    const handleMouseDown = useCallback((e: MouseEvent) => {
        if (optionsRef.current.disabled || !elementRef.current) return;
        if (e.button !== 0) return; // Только левая кнопка мыши
        isDragging.current = true;
        startPos.current = { x: e.clientX, y: e.clientY };
        scrollStart.current = {
            left: elementRef.current.scrollLeft,
            top: elementRef.current.scrollTop
        };

        e.preventDefault();

        if (elementRef.current) {
            elementRef.current.style.cursor = 'grabbing';
            elementRef.current.style.userSelect = 'none';
        }
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging.current || !elementRef.current) return;

        e.preventDefault();

        const { direction, sensitivity } = optionsRef.current;
        const deltaX = (e.clientX - startPos.current.x) * sensitivity;
        const deltaY = (e.clientY - startPos.current.y) * sensitivity;

        if (direction === 'horizontal' || direction === 'both') {
            elementRef.current.scrollLeft = scrollStart.current.left - deltaX;
        }

        if (direction === 'vertical' || direction === 'both') {
            elementRef.current.scrollTop = scrollStart.current.top - deltaY;
        }
    }, []);

    const handleMouseUp = useCallback(() => {
        if (!isDragging.current) return;

        isDragging.current = false;

        if (elementRef.current) {
            elementRef.current.style.cursor = 'grab';
            elementRef.current.style.userSelect = '';
        }
    }, []);

    const handleTouchStart = useCallback((e: TouchEvent) => {
        if (optionsRef.current.disabled || !elementRef.current) return;

        const touch = e.touches[0];
        isDragging.current = true;
        startPos.current = { x: touch.clientX, y: touch.clientY };
        scrollStart.current = {
            left: elementRef.current.scrollLeft,
            top: elementRef.current.scrollTop
        };

        if (optionsRef.current.direction === 'horizontal') {
            e.preventDefault();
        }
    }, []);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!isDragging.current || !elementRef.current) return;

        const touch = e.touches[0];
        const { direction, sensitivity } = optionsRef.current;
        const deltaX = (touch.clientX - startPos.current.x) * sensitivity;
        const deltaY = (touch.clientY - startPos.current.y) * sensitivity;

        if (direction === 'horizontal' || direction === 'both') {
            elementRef.current.scrollLeft = scrollStart.current.left - deltaX;
            e.preventDefault();
        }

        if (direction === 'vertical' || direction === 'both') {
            elementRef.current.scrollTop = scrollStart.current.top - deltaY;
        }
    }, []);

    const handleTouchEnd = useCallback(() => {
        isDragging.current = false;
    }, []);

    // Используем отдельный useEffect для отслеживания изменений elementRef
    useEffect(() => {
        const setupEventListeners = () => {
            const element = elementRef.current;
            if (!element) {
                return null;
            }

            element.style.cursor = 'grab';

            element.addEventListener('mousedown', handleMouseDown);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            element.addEventListener('touchstart', handleTouchStart, { passive: false });
            element.addEventListener('touchmove', handleTouchMove, { passive: false });
            element.addEventListener('touchend', handleTouchEnd);

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

                element.style.cursor = '';
                element.style.userSelect = '';
            };
        };

        // Пробуем сразу
        let cleanup = setupEventListeners();

        // Если элемент не найден, пробуем через небольшую задержку
        if (!cleanup) {
            const timer = setTimeout(() => {
                cleanup = setupEventListeners();
            }, 100);

            return () => {
                clearTimeout(timer);
                if (cleanup) cleanup();
            };
        }

        return cleanup;
    }, [handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd]);


    return elementRef;
};