import { delay, lerp } from "../utils";
import { linear } from "../Easing";
import { Animation } from "./Animation";
import {
  TimingConfig,
  AnimationUpdateCallback,
  AnimationEndCallback
} from "../types";

export default class Timing extends Animation {
  private toValue: any;
  private delay: number;
  private duration: number;
  private fromValue: number;
  private deltaTime: number;
  private easing: (value: number) => number;

  constructor({ delay, easing, toValue, duration }: TimingConfig) {
    super();
    this.delay = delay;
    this.toValue = toValue;
    this.easing = easing || linear;
    this.duration = duration || 300;
  }

  start(
    fromValue: number,
    onUpdate: AnimationUpdateCallback,
    onEnd?: AnimationEndCallback
  ): void {
    this.onEnd = onEnd;
    this.isRunning = true;
    this.onUpdate = onUpdate;
    this.fromValue = fromValue;

    const start = () => {
      if (this.duration === 0) {
        this.onUpdate(this.toValue);
      } else {
        this.startTime = this.now();
        this.frame = requestAnimationFrame(this.update);
      }
    };

    if (this.delay) {
      this.timeout = delay(start, this.delay);
    } else {
      start();
    }
  }

  update = (): void => {
    /**
     * stop might have been called while the
     * animation was running.
     */
    if (!this.isRunning) return;

    this.deltaTime = Math.floor(this.now() - this.startTime);
    let time = this.easing(this.deltaTime / this.duration);
    this.onUpdate(lerp(this.fromValue, this.toValue, time));

    if (this.deltaTime > this.duration) {
      this.stop();
    } else {
      this.frame = requestAnimationFrame(this.update);
    }
  };

  stop() {
    this.isRunning = false;
    cancelAnimationFrame(this.frame);
    if (this.timeout) this.timeout.clear();
    this.end();
  }
}
