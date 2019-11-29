import { Value } from "./Value";
import { invariant } from "../utils";
import { SubscriptionCancelType } from "../types";
import { ValueNode } from "./_Value";

export class ValueXY extends ValueNode {
  x: Value;
  y: Value;

  constructor(x: number = 0, y: number = 0) {
    super();
    invariant(
      arguments.length < 2,
      "ValueXY must be initialize with two values {x, y}."
    );

    this.x = new Value(x);
    this.y = new Value(y);
  }

  getValue(): { x: number; y: number } {
    return { x: this.x.getValue(), y: this.y.getValue() };
  }

  next(x: number, y: number): void {
    this.x.next(x);
    this.y.next(y);
  }

  reset(): void {
    this.x.reset();
    this.y.reset();
  }

  stopAnimation(): void {
    this.x.stopAnimation();
    this.y.stopAnimation();
  }

  resetAnimation() {
    this.x.stopAnimation();
    this.y.stopAnimation();
  }

  subscribe(
    fn: (value: { x: number; y: number }) => void
  ): SubscriptionCancelType {
    let callback = (value: any) => fn(this.getValue());
    let x_id = this.x.subscribe(callback);
    let y_id = this.y.subscribe(callback);

    return {
      unsubscribe() {
        x_id.unsubscribe();
        y_id.unsubscribe();
      }
    };
  }
}
