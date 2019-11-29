import * as Easing from "./Easing";
import { Value } from "./values/Value";
import { ValueXY } from "./values/ValueXY";
import { timing, parallel, sequence, stagger } from "./helpers/helpers";
import { useValue, useTransition, useVariables, useStyle } from "./helpers/use";

export const Animated = {
  Value,
  Easing,
  timing,
  ValueXY,
  stagger,
  useStyle,
  parallel,
  sequence,
  useValue,
  useVariables,
  useTransition
};
