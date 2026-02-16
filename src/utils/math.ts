// ─────────────────────────────────────────────────────────
//  math.ts — Lerp helpers, easing functions
// ─────────────────────────────────────────────────────────

/**
 * Linear interpolation between two values.
 */
export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

/**
 * Clamp a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

/**
 * Ease-in-out cubic — smooth start and stop.
 */
export function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Ease-out cubic — fast start, slow stop.
 */
export function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
}
