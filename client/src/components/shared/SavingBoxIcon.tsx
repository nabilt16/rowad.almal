import type { CSSProperties } from 'react';

interface SavingBoxIconProps {
  size?: number;
  style?: CSSProperties;
}

/**
 * SVG illustration of a money saving box (قجة).
 * A classic piggy-bank-style coin box with a coin slot on top.
 */
export default function SavingBoxIcon({ size = 64, style }: SavingBoxIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      {/* Shadow */}
      <ellipse cx="40" cy="74" rx="22" ry="4" fill="rgba(0,0,0,0.18)" />

      {/* Box body */}
      <rect x="12" y="28" width="56" height="40" rx="10" fill="#F5A623" />
      <rect x="12" y="28" width="56" height="40" rx="10" fill="url(#boxGrad)" />

      {/* Box sheen (highlight) */}
      <rect x="16" y="32" width="20" height="8" rx="4" fill="rgba(255,255,255,0.25)" />

      {/* Front face details — horizontal lines */}
      <rect x="20" y="48" width="40" height="3" rx="1.5" fill="rgba(0,0,0,0.10)" />
      <rect x="20" y="55" width="28" height="3" rx="1.5" fill="rgba(0,0,0,0.10)" />

      {/* Lock */}
      <rect x="34" y="58" width="12" height="8" rx="3" fill="#C47A15" />
      <circle cx="40" cy="57" r="4" fill="none" stroke="#C47A15" strokeWidth="2.5" />
      <circle cx="40" cy="62" r="1.2" fill="#F5A623" />

      {/* Lid */}
      <rect x="10" y="22" width="60" height="10" rx="5" fill="#E8971F" />
      <rect x="10" y="22" width="60" height="10" rx="5" fill="url(#lidGrad)" />

      {/* Coin slot */}
      <rect x="32" y="19" width="16" height="5" rx="2.5" fill="#C47A15" />
      <rect x="33.5" y="20" width="13" height="2.5" rx="1.25" fill="#8B5200" />

      {/* Coin dropping in */}
      <ellipse cx="40" cy="18" rx="6" ry="3.5" fill="#FFD700" />
      <ellipse cx="40" cy="16.5" rx="6" ry="3.5" fill="#FFE44D" />
      <text
        x="40"
        y="18.5"
        textAnchor="middle"
        fontSize="5"
        fontWeight="bold"
        fill="#B8860B"
        fontFamily="serif"
      >
        ₪
      </text>

      {/* Coin sparkles */}
      <circle cx="28" cy="14" r="2" fill="#FFD700" opacity="0.7" />
      <circle cx="52" cy="12" r="1.5" fill="#FFD700" opacity="0.5" />
      <circle cx="55" cy="20" r="1" fill="#FFD700" opacity="0.6" />

      <defs>
        <linearGradient id="boxGrad" x1="12" y1="28" x2="68" y2="68" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F9B84A" />
          <stop offset="100%" stopColor="#D4820A" />
        </linearGradient>
        <linearGradient id="lidGrad" x1="10" y1="22" x2="70" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFCA5A" />
          <stop offset="100%" stopColor="#C47A15" />
        </linearGradient>
      </defs>
    </svg>
  );
}
