import * as Easing from "./Easing";
import { Value } from "./values/Value";
import { ValueXY } from "./values/ValueXY";
import { useValue, useTransition } from "./helpers/use";
import { timing, parallel, sequence, stagger } from "./helpers/helpers";

export const Animated = {
  Value,
  Easing,
  timing,
  ValueXY,
  stagger,
  parallel,
  sequence,
  useValue,
  useTransition
};
