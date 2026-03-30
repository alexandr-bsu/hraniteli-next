'use client';

import type { CSSProperties } from 'react';
import { COLORS } from '@/shared/constants/colors';

type Props = {
  src: string;
  isActive: boolean;
};

/**
 * Внешние SVG в mask нельзя перекрасить через fill/currentColor как у inline-SVG.
 * Фон = фирменный цвет, альфа задаётся маской по силуэту файла.
 */
export function ContactBrandIcon({ src, isActive }: Props) {
  const style: CSSProperties = {
    opacity: isActive ? 1 : 0.45,
    backgroundColor: COLORS.primary,
    WebkitMaskImage: `url(${src})`,
    WebkitMaskSize: '92% 92%',
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskPosition: '50% 50%',
    WebkitMaskOrigin: 'border-box',
    maskImage: `url(${src})`,
    maskSize: '92% 92%',
    maskRepeat: 'no-repeat',
    maskPosition: '50% 50%',
    maskOrigin: 'border-box',
  };

  return (
    <span
      aria-hidden
      className="block h-7 w-7 shrink-0 self-center"
      style={style}
    />
  );
}
