import { Value } from "../values/Value";
import Timing from "../animations/Timing";
import { ValueXY } from "../values/ValueXY";

import {
  TimingConfig,
  ComposedAnimation,
  AnimationEndCallback
} from "../types";

function isXYAnimation(
  value: Value | ValueXY,
  config: any,
  animation: any
): ComposedAnimation {
  if (value instanceof ValueXY) {
    let valueX = value.x;
    let valueY = value.y;

    const configX = { ...config };
    const configY = { ...config };

    for (const key in config) {
      const { x, y } = config[key];
      if (x !== undefined && y !== undefined) {
        configX[key] = x;
        configY[key] = y;
      }
    }

    let animations: ComposedAnimation[] = [];

    if (valueX) animations.push(animation(valueX, configX));
    if (valueY) animations.push(animation(valueY, configY));

    return parallel(animations);
  }

  return null;
}

export function timing(
  value: Value | ValueXY,
  config: TimingConfig
): ComposedAnimation {
  const start = (value: Value | ValueXY, callback?: AnimationEndCallback) => {
    let _value: any = value;
    _value.animate(new Timing(config), callback);
  };

  return (
    isXYAnimation(value, config, timing) || {
      start(callback?: AnimationEndCallback): void {
        start(value, callback);
      },
      stop() {
        value.stopAnimation();
      },
      reset() {
        value.resetAnimation();
      }
    }
  );
}

export function parallel(animations: ComposedAnimation[]): ComposedAnimation {
  let count = 0;

  return {
    start(callback?: AnimationEndCallback): void {
      animations.forEach(animation => {
        let fn = () => {
          count++;

          if (count === animations.length) {
            count = 0;
            callback && callback();
            return;
          }
        };

        animation.start(fn);
      });
    },
    stop() {
      animations.forEach(animation => animation.stop());
    },
    reset() {
      animations.forEach(animation => animation.reset());
    }
  };
}

export function delay(time: number) {
  return timing(new Value(0), {
    toValue: 0,
    duration: 1,
    delay: time
  });
}

export function stagger(time: number, animations: ComposedAnimation[]) {
  return parallel(
    animations.map((animation, index) => {
      return sequence([delay(time * index), animation]);
    })
  );
}

export function sequence(animations: ComposedAnimation[]) {
  let count = 0;

  return {
    start(callback?: AnimationEndCallback): void {
      let onComplete = () => {
        count++;

        if (count >= animations.length) {
          callback && callback();
          return;
        }

        let animation = animations[count];
        if (animation) animation.start(onComplete);
      };

      if (animations.length === 0) {
        callback && callback();
      } else {
        animations[count].start(onComplete);
      }
    },
    stop() {
      if (count < animations.length) {
        animations[count].stop();
      }
    },
    reset() {
      animations.forEach(animation => animation.reset());
    }
  };
}
