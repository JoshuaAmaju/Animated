import { linear } from "./Easing";
import { InterpolationConfig } from "./types";

export function lerp(start: number, end: number, fraction: number): number {
  return start * (1 - fraction) + end * fraction;
}

export function inverseLerp(a: number, b: number, v: number): number {
  return clamp((v - a) / (b - a));
}

export function clamp(v: number, min: number = 0, max: number = 1): number {
  return Math.min(max, Math.max(min, v));
}

export function invariant(condition: boolean, message: string) {
  if (condition) throw message;
}

export function delay(func: () => any, time: number): { clear(): void } {
  let id = setTimeout(func, time);
  return {
    clear() {
      clearTimeout(id);
    }
  };
}

export function createInterpolation(config: InterpolationConfig) {
  let easing = config.easing || linear;
  let input: number[] = config.inputRange;
  let output: number[] = config.outputRange;

  const rangeLength = input.length;
  const finalIndex = rangeLength - 1;

  return (v: number) => {
    // If value outside minimum range, quickly return
    // if (v <= input[0]) return output[0];

    // // If value outside maximum range, quickly return
    // if (v >= input[finalIndex]) return output[finalIndex];

    let i = 1;

    // Find index of range start
    for (; i < rangeLength; i += 1) {
      if (input[i] > v || i === finalIndex) break;
    }

    const range = inverseLerp(input[i - 1], input[i], v);
    let result = lerp(output[i - 1], output[i], easing(range));

    return result;
  };
}
