import { StylerType } from "../types";
import { Value } from "../values/Value";
import { Interpolation } from "../Interpolation";

export default class Transform {
  constructor(public transform: StylerType) {}

  private isValue(value: any): boolean {
    return value instanceof Value;
  }

  private isInterpolation(value: any): boolean {
    return value instanceof Interpolation;
  }

  style(node: HTMLElement): void {
    let transforms: { [key: string]: string } = {};

    let applyTransform = (key: string, value: number, unit: string): void => {
      let transformStr = [];
      transforms[key] = `${value}${unit ? unit : ""}`;

      for (const key in transforms) {
        transformStr.push(`${key}(${transforms[key]})`);
      }

      node.style.transform = transformStr.join(" ");
    };

    for (const key in this.transform) {
      if (this.transform.hasOwnProperty(key)) {
        const transform = this.transform[key].value;

        if (this.isInterpolation(transform)) {
          let parent = transform.parent;
          let unit = this.transform[key].unit;

          parent.subscribe((v: any) => {
            let value = transform.getValue();
            applyTransform(key, value, unit);
          });
        } else if (this.isValue(transform)) {
          let unit = this.transform[key].unit;
          transform.subscribe((v: any) => applyTransform(key, v, unit));
        } else {
          let unit = this.transform[key].unit;
          applyTransform(key, transform, unit);
        }
      }
    }
  }
}
