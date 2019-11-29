import { Animation } from "../animations/Animation";
import { AnimationEndCallback } from "../types";

export class Value {
  private value: number;
  private animation: any;
  private startValue: number;
  private listeners: object = {};

  constructor(value: number) {
    this.startValue = this.value = value;
  }

  getValue() {
    return this.value;
  }

  reset() {
    this.value = this.startValue;
  }

  next(value: number): void {
    this.value = value;
    Object.values(this.listeners).map(fn => fn(this.getValue()));
  }

  animate(animation: Animation, callback?: AnimationEndCallback) {
    if (this.animation) this.animation.stop();
    this.animation = animation;

    let onEnd = () => {
      callback && callback();
      this.animation = null;
    };

    let onUpdate = (value: number) => this.next(value);
    animation.start(this.getValue(), onUpdate, onEnd);
  }
}
