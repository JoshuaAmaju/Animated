export function delay(func: () => any, time: number): { clear(): void } {
  let id = setTimeout(func, time);
  return {
    clear() {
      clearTimeout(id);
    }
  };
}

export function lerp(start: number, end: number, fraction: number): number {
  return start * (1 - fraction) + end * fraction;
}

export function inverseLerp(a: number, b: number, v: number): number {
  return clamp((v - a) / (b - a));
}

export function clamp(v: number, min: number = 0, max: number = 1): number {
  return Math.min(max, Math.max(min, v));
}
