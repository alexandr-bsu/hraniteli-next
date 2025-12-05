import { useRef, useCallback, useLayoutEffect, useEffect } from 'react';

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

    const elementRef = useRef<HTMLDivElement | null>(null);
    const isDragging = useRef(false);
    const startPos = useRef({ x: 0, y: 0 });
    const scrollStart = useRef({ left: 0, top: 0 });
    const optionsRef = useRef({ direction, sensitivity, disabled });
    const touchDirection = useRef<'horizontal' | 'vertical' | null>(null);

    // Обновляем опции в ref при каждом рендере
    optionsRef.current = { direction, sensitivity, disabled };

    const handleMouseDown = useCallback((e: MouseEvent) => {
        if (optionsRef.current.disabled || !elementRef.current) return;
        if (e.button !== 0) return; // Только левая кнопка мыши
        
        // Не перехватываем события для стандартного вертикального скролла
        // Только для горизонтального drag-to-scroll
        if (optionsRef.current.direction === 'horizontal') {
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
        }
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging.current || !elementRef.current) return;

        const { direction, sensitivity } = optionsRef.current;
        const deltaX = (e.clientX - startPos.current.x) * sensitivity;
        const deltaY = (e.clientY - startPos.current.y) * sensitivity;

        // Для горизонтального скролла
        if (direction === 'horizontal') {
            elementRef.current.scrollLeft = scrollStart.current.left - deltaX;
            e.preventDefault();
        } else if (direction === 'both') {
            // Для режима 'both' обрабатываем оба направления
            elementRef.current.scrollLeft = scrollStart.current.left - deltaX;
            elementRef.current.scrollTop = scrollStart.current.top - deltaY;
            e.preventDefault();
        } else if (direction === 'vertical') {
            // Для вертикального - только drag-to-scroll, не блокируем стандартный скролл
            elementRef.current.scrollTop = scrollStart.current.top - deltaY;
            e.preventDefault();
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
        touchDirection.current = null; // Сбрасываем направление
    }, []);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!isDragging.current || !elementRef.current) return;

        const touch = e.touches[0];
        const { direction, sensitivity } = optionsRef.current;
        const deltaX = (touch.clientX - startPos.current.x) * sensitivity;
        const deltaY = (touch.clientY - startPos.current.y) * sensitivity;

        // Определяем направление свайпа при первом движении
        if (touchDirection.current === null && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
            touchDirection.current = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
        }

        // Для горизонтального скролла
        if (direction === 'horizontal') {
            if (touchDirection.current === null || touchDirection.current === 'horizontal') {
                elementRef.current.scrollLeft = scrollStart.current.left - deltaX;
                e.preventDefault();
            } else {
                // Если направление вертикальное, разрешаем стандартный скролл
                isDragging.current = false;
            }
        } else if (direction === 'both') {
            // Для режима 'both' обрабатываем оба направления
            if (touchDirection.current === 'horizontal') {
                elementRef.current.scrollLeft = scrollStart.current.left - deltaX;
                e.preventDefault();
            } else if (touchDirection.current === 'vertical') {
                elementRef.current.scrollTop = scrollStart.current.top - deltaY;
                e.preventDefault();
            }
        } else if (direction === 'vertical') {
            // Для вертикального - только drag-to-scroll, не блокируем стандартный скролл
            if (touchDirection.current === null || touchDirection.current === 'vertical') {
                elementRef.current.scrollTop = scrollStart.current.top - deltaY;
                e.preventDefault();
            }
        }
    }, []);

    const handleTouchEnd = useCallback(() => {
        isDragging.current = false;
        touchDirection.current = null;
    }, []);

    // Храним cleanup функцию для предыдущего элемента
    const cleanupRef = useRef<(() => void) | null>(null);

    // Функция для установки слушателей событий
    const setupEventListeners = useCallback((element: HTMLDivElement) => {
        // Устанавливаем начальные стили
        element.style.cursor = 'grab';

        // Добавляем слушатели событий
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
    }, [handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd]);

    // Callback ref для гарантированного получения элемента после монтирования
    const setElementRef = useCallback((element: HTMLDivElement | null) => {
        // Очищаем предыдущие слушатели
        if (cleanupRef.current) {
            cleanupRef.current();
            cleanupRef.current = null;
        }

        elementRef.current = element;
        
        // Если элемент установлен, сразу устанавливаем слушатели
        if (element) {
            // Используем requestAnimationFrame для гарантии, что элемент полностью готов
            requestAnimationFrame(() => {
                if (elementRef.current === element) {
                    cleanupRef.current = setupEventListeners(element);
                }
            });
        }
    }, [setupEventListeners]);

    // Cleanup при размонтировании
    useEffect(() => {
        return () => {
            if (cleanupRef.current) {
                cleanupRef.current();
                cleanupRef.current = null;
            }
        };
    }, []);

    return setElementRef;
};