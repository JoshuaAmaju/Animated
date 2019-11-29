import { Value } from "./values/Value";
import { ValueXY } from "./values/ValueXY";
import Interpolation from "./Interpolation";

export type AnimationEndCallback = () => void;
export type AnimationUpdateCallback = (value: number) => void;

export type SubscriptionCancelType = {
  unsubscribe(): void;
};

export interface SubscriptionType {
  [key: string]: (value: any) => void;
}

export type TimingConfig = {
  delay?: number;
  duration: number;
  easing?: (value: number) => number;
  toValue: number | Value | ValueXY | { x: number; y: number };
};

export type InterpolationConfig = {
  inputRange: number[];
  outputRange: number[];
  easing?: (value: number) => number;
};

export type ComposedAnimation = {
  stop: () => void;
  reset: () => void;
  start: (callback?: AnimationEndCallback) => void;
};

/** Basic inner object parameter type for
 * Animated.style and Animated.variables.
 **/
export type StylerObjectType = {
  unit: string;
  value: number | String | Value | Interpolation;
};

/** Basic outter object parameter type for
 * Animated.style and Animated.variables.
 * e.g {
 * opacity: {
 *    unit: 'px',
 *    value: animatedValue
 *  }
 * }
 **/
export type StylerType = {
  [key: string]: number | string | Value | Interpolation | StylerObjectType;
};
