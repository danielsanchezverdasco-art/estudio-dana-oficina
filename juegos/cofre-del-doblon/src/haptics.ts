// Doubloon Rush — haptics only (vibration feedback on hits).
// The game is fully silent by design: this module has no playback
// of any kind and there are no volume controls anywhere.

/** Short vibration on supported devices (hit / fail feedback). */
export function vibrate(pattern: number | number[]): void {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* ignore */
  }
}
