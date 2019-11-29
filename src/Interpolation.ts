import { InterpolationConfig } from "./types";
import { createInterpolation } from "./utils";

export class Interpolation {
  private interpolation: any;

  constructor(public parent: any, public config: InterpolationConfig) {
    this.interpolation = createInterpolation(config);
  }

  getValue() {
    let parent = this.parent.getValue();
    return this.interpolation(parent);
  }

  interpolate(config: InterpolationConfig) {
    return new Interpolation(this, config);
  }
}
