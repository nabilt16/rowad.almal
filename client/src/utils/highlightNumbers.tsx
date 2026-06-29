import React from 'react';
import type { CSSProperties } from 'react';

const numStyle: CSSProperties = {
  fontWeight: 800,
  color: '#4DF0A0',
};

// Matches ONLY: ₪+digits, digits+₪, digits+%, bare digit sequences (including single digits), math operators.
// No Arabic letters are ever captured.
const SPLIT_RE = /(₪\s*\d[\d,.]*|\d[\d,.]*\s*₪|\d[\d,.]*\s*%|\d[\d,.]*|[=+\-×÷])/g;
const IS_HIGHLIGHT = /[\d₪%=+\-×÷]/;

export function highlightNumbers(text: string): React.ReactNode {
  const parts = text.split(SPLIT_RE);
  return parts.map((p, i) =>
    IS_HIGHLIGHT.test(p) ? <span key={i} style={numStyle}>{p}</span> : p
  );
}
