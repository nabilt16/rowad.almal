/**
 * Confetti and star celebration effects.
 * Creates temporary DOM elements with CSS animations, then auto-removes them.
 */

const CONFETTI_COLORS = [
  '#F9A825', '#FFD54F', '#66BB6A', '#64B5F6',
  '#EF5350', '#AB47BC', '#FF7043', '#26C6DA',
];

/**
 * Creates 15-20 confetti pieces that fall from random x positions.
 */
export function confettiBurst(): void {
  const count = 15 + Math.floor(Math.random() * 6); // 15-20 pieces

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';

    const left = Math.random() * 100;
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const delay = Math.random() * 0.4;
    const duration = 0.8 + Math.random() * 0.6;
    const size = 6 + Math.random() * 8;

    piece.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 9998;
      left: ${left}%;
      top: ${20 + Math.random() * 30}%;
      width: ${size}px;
      height: ${size}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      background: ${color};
      animation: confettiFall ${duration}s ease ${delay}s forwards;
      opacity: 0;
      animation-fill-mode: forwards;
    `;

    // Make it visible at animation start via a slight trick
    piece.style.opacity = '1';

    document.body.appendChild(piece);

    // Remove from DOM after animation completes
    setTimeout(() => {
      piece.remove();
    }, (duration + delay) * 1000 + 100);
  }
}

/**
 * Creates star emojis that fly upward from random positions.
 * @param count Number of stars to create (default 5)
 */
export function flyStars(count = 5): void {
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'fly-star';
    star.textContent = '\u2B50';

    const left = 30 + Math.random() * 40; // 30-70% from left
    const delay = Math.random() * 0.3;
    const bottom = 30 + Math.random() * 20;

    star.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      left: ${left}%;
      bottom: ${bottom}%;
      font-size: ${24 + Math.random() * 12}px;
      animation: flyUp 0.9s ease ${delay}s forwards;
    `;

    document.body.appendChild(star);

    setTimeout(() => {
      star.remove();
    }, 1200);
  }
}
