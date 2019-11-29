import { invariant } from "../utils";
import { Value } from "../values/Value";
import { ValueXY } from "../values/ValueXY";
import { ValueNode } from "../values/_Value";
import { TimingConfig, ComposedAnimation, StylerType } from "../types";
import { timing, parallel } from "./helpers";
import { CSSVariables } from "../styler/Variable";
import Style from "../styler/Style";

interface ValueType {
  [key: string]: Value | ValueXY;
}

interface TransitionType {
  [key: string]: {
    config: TimingConfig;
    from: Value | ValueXY;
    to: Value | ValueXY | number;
  };
}

export function useValue(values: ValueType): {} {
  let valuesObj: ValueType = {};

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
  let transitionsObj: any = {};
  let animations: ComposedAnimation[] = [];

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

  // const applyTransitions = (transitions: TransitionType) => {
  //   let transitionsObj: any = {};
  //   let animations: ComposedAnimation[] = [];

  //   const start = () => {
  //     parallel(animations).start();
  //   };

  //   const reset = () => {
  //     animations.forEach(animation => {
  //       animation.reset();
  //     });
  //   };

  //   for (const key in transitions) {
  //     if (transitions.hasOwnProperty(key)) {
  //       let transition: any = transitions[key];
  //       let {
  //         to: toValue,
  //         from: startValue,
  //         config: internalConfig
  //       } = transition;

  //       invariant(
  //         !(startValue instanceof ValueNode),
  //         "{from} should be of type Value or ValueXY"
  //       );

  //       let newConfig: any = internalConfig || { ...config, toValue };
  //       let animation = timing(startValue, newConfig);
  //       transitionsObj[key] = animation;
  //       animations.push(animation);
  //     }
  //   }

  //   return { ...transitionsObj, start, reset, transitions: animations };
  // };

  // if (typeof transitions === "function") {
  //   let _transitions: any = transitions;
  //   return (value: any) => {
  //     let _trans = _transitions()(value);
  //     return applyTransitions(_trans);
  //   };
  // } else {
  //   return applyTransitions(transitions);
  // }
}

export function useVariables(
  variables: StylerType,
  element?: HTMLElement
): void {
  new CSSVariables(element).setVariables(variables);
}

export function useStyle(element: HTMLElement, styles: StylerType): void {
  new Style(element).setStyle(styles);
}
