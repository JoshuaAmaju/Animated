import { StylerType } from "../types";
import { Value } from "../values/Value";
import { Interpolation } from "../Interpolation";

export class CSSVariables {
  node: HTMLElement;
  variables: StylerType;

  constructor(node?: HTMLElement) {
    this.node = node || document.documentElement;
  }

  setVariables(variables: StylerType) {
    for (const key in variables) {
      if (variables.hasOwnProperty(key)) {
        const variable: any = variables[key];
        let unit: any;
        let value: any = variable;

        if (
          Object.prototype.toString.call(variable) === "[object Object]" &&
          !(variable instanceof Value) &&
          !(variable instanceof Interpolation)
        ) {
          value = variable.value;
          unit = variable.unit;
        }

        if (value instanceof Value) {
          value.subscribe(v => {
            this.node.style.setProperty(`--${key}`, `${v}${unit ? unit : ""}`);
          });
        } else if (value instanceof Interpolation) {
          let interpolation = value;
          interpolation.parent.subscribe((v: any) => {
            this.node.style.setProperty(
              `--${key}`,
              `${interpolation.getValue()}${unit ? unit : ""}`
            );
          });
        } else {
          this.node.style.setProperty(
            `--${key}`,
            `${value}${unit ? unit : ""}`
          );
        }
      }
    }
  }
}
