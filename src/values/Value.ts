import { Animation } from "../animations/Animation";
import {
  AnimationEndCallback,
  SubscriptionCancelType,
  SubscriptionType,
  InterpolationConfig
} from "../types";
import { ValueNode } from "./_Value";
import { Interpolation } from "../Interpolation";

export class Value extends ValueNode {
  private value: number;
  private animation: any;
  private uuid: number = 1;
  private startValue: number;
  private listeners: SubscriptionType = {};

  constructor(value: number) {
    super();
    this.value = value;
    this.startValue = value;
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

  interpolate(config: InterpolationConfig) {
    return new Interpolation(this, config);
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

  stopAnimation() {
    if (this.animation) {
      this.animation.stop();
      this.animation = null;
    }
  }

  resetAnimation() {
    this.reset();
    this.stopAnimation();
  }

  subscribe(fn: (value: number) => void): SubscriptionCancelType {
    let uuid = String(this.uuid++);
    this.listeners[uuid] = fn;

    return {
      unsubscribe() {
        delete this.listeners[uuid];
      }
    };
  }
}
