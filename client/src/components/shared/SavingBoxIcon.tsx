import type { CSSProperties } from 'react';

interface SavingBoxIconProps {
  size?: number;
  style?: CSSProperties;
}

/**
 * Money saving box (قجة) — uses the project photo of a transparent
 * coin box filled with Israeli shekel notes and coins.
 * Image must be placed at: client/public/saving-box.png
 */
export default function SavingBoxIcon({ size = 64, style }: SavingBoxIconProps) {
  return (
    <img
      src="/saving-box.png"
      alt="قجة التوفير"
      width={size}
      height={size}
      style={{ objectFit: 'contain', display: 'block', ...style }}
    />
  );
}
