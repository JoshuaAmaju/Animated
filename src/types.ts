import { Value } from "./values/Value";
import { ValueXY } from "./values/ValueXY";

export type AnimationEndCallback = () => void;
export type AnimationUpdateCallback = (value: number) => void;

export type TimingConfig = {
  delay?: number;
  duration: number;
  easing?: (value: number) => number;
  toValue: number | Value | ValueXY | { x: number; y: number };
};
