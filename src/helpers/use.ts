import { invariant } from "../utils";
import { Value } from "../values/Value";
import { ValueXY } from "../values/ValueXY";
import { ValueNode } from "../values/_Value";
import { TimingConfig, ComposedAnimation } from "../types";
import { timing, parallel } from "./helpers";

interface ValueType {
  [key: string]: number;
}

interface TransitionType {
  [key: string]: {
    from: Value | ValueXY;
    to: Value | ValueXY | number;
  };
}

export function useValue(values: ValueType) {
  let valuesObj: { [key: string]: Value | ValueXY } = {};

  for (const key in values) {
    if (values.hasOwnProperty(key)) {
      let value: any = values[key];
      valuesObj[key] =
        typeof value === "number"
          ? new Value(value)
          : new ValueXY(value.x, value.y);
    }
  }

  return valuesObj;
}

export function useTransition(
  transitions: TransitionType,
  config: TimingConfig
) {
  let animations: ComposedAnimation[] = [];
  let transitionsObj: any = {};

  const start = () => {
    parallel(animations).start();
  };

  const reset = () => {
    animations.forEach(animation => {
      animation.reset();
    });
  };

  for (const key in transitions) {
    if (transitions.hasOwnProperty(key)) {
      let transition: any = transitions[key];
      let {
        to: toValue,
        from: startValue,
        config: internalConfig
      } = transition;

      invariant(
        !(startValue instanceof ValueNode),
        "{from} should be of type Value or ValueXY"
      );

      let newConfig: any = internalConfig || { ...config, toValue };
      let animation = timing(startValue, newConfig);
      transitionsObj[key] = animation;
      animations.push(animation);
    }
  }

  return { ...transitionsObj, start, reset, transitions: animations };
}
