import Transform from "./Transform";
import { StylerType } from "../types";
import { Value } from "../values/Value";
import { Interpolation } from "../Interpolation";

export default class Style {
  constructor(public node: HTMLElement) {}

  setStyle(styles: StylerType) {
    let transform: any = styles.transform;
    this.node.style.willChange = Object.keys(styles).join(",");

    if (transform) {
      new Transform(transform).style(this.node);
      delete styles.transform;
    }

    for (const key in styles) {
      if (styles.hasOwnProperty(key)) {
        let unit: any;
        const style: any = styles[key];
        let value: any = style;

        if (
          Object.prototype.toString.call(style) === "[object Object]" &&
          !(style instanceof Value) &&
          !(style instanceof Interpolation)
        ) {
          value = style.value;
          unit = style.unit;
        }

        if (value instanceof Value) {
          value.subscribe((v: any) => {
            this.node.setAttribute("style", `${key}: ${v}${unit ? unit : ""}`);
          });
        } else if (value instanceof Interpolation) {
          let interpolation = value;
          interpolation.parent.subscribe((v: any) => {
            this.node.setAttribute(
              "style",
              `${key}: ${interpolation.getValue()}${unit ? unit : ""}`
            );
          });
        } else {
          this.node.setAttribute(
            "style",
            `${key}: ${value}${unit ? unit : ""}`
          );
        }
      }
    }
  }
}
