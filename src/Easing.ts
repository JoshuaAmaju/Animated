export const linear = (t: number): number => t;

export const sin = function(t: number): number {
  return 1 - Math.cos((t * Math.PI) / 2);
};

/**
 * from ReactNative Animated
 * https://github.com/facebook/react-native/blob/master/Libraries/Animated/src/Easing.js
 */
export const elastic = function(bounciness: number = 1): (t: number) => number {
  const p = bounciness * Math.PI;
  return t => 1 - Math.pow(Math.cos((t * Math.PI) / 2), 3) * Math.cos(t * p);
};

export const bounce = function(t: number): number {
  if (t < 1 / 2.75) {
    return 7.5625 * t * t;
  }

  if (t < 2 / 2.75) {
    const t2 = t - 1.5 / 2.75;
    return 7.5625 * t2 * t2 + 0.75;
  }

  if (t < 2.5 / 2.75) {
    const t2 = t - 2.25 / 2.75;
    return 7.5625 * t2 * t2 + 0.9375;
  }

  const t2 = t - 2.625 / 2.75;
  return 7.5625 * t2 * t2 + 0.984375;
};

export const easeIn = function(t: number): number {
  return t * t;
};

export const easeOut = function(t: number): number {
  return t * (2 - t);
};

export const easeInOut = function(t: number): number {
  return t <= 0.5 ? 2 * t * t : -2 * t * t + 4 * t - 1;
};

export const easeOutBounce = function(t: number): number {
  return t * (3 - 2 * t);
};

export const easeInCubic = function(t: number): number {
  return t * t * t;
};

export const easeOutCubic = function(t: number): number {
  return 1 + Math.pow(t - 1, 3);
};

export const easeInOutCubic = function(t: number): number {
  t *= 2;
  return t < 1 ? 0.5 * t * t * t : 0.5 * Math.pow(t - 2, 3) + 1;
};
