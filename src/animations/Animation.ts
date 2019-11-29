import { AnimationEndCallback, AnimationUpdateCallback } from "../types";

export class Animation {
  frame: any;
  timeout: any;
  startTime: number;
  isRunning: boolean;
  now: any = Date.now;
  onEnd: AnimationEndCallback;
  onUpdate: AnimationUpdateCallback;

  stop(): void {}

  start(
    fromValue: number,
    onUpdate: AnimationUpdateCallback,
    onEnd?: AnimationEndCallback
  ): void {}

  update(): void {}

  /**
   * prevents exceeding the callstack which
   * would be caused by calling the endCallback
   * which would in turn call update and update calls
   * onEnd...
   */
  protected end(): void {
    let onEnd = this.onEnd;
    this.onEnd = null;
    if (onEnd) onEnd();
  }
}
