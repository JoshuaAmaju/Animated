const linear = (t) => t;
const sin = function (t) {
    return 1 - Math.cos((t * Math.PI) / 2);
};
/**
 * from ReactNative Animated
 * https://github.com/facebook/react-native/blob/master/Libraries/Animated/src/Easing.js
 */
const elastic = function (bounciness = 1) {
    const p = bounciness * Math.PI;
    return t => 1 - Math.pow(Math.cos((t * Math.PI) / 2), 3) * Math.cos(t * p);
};
const bounce = function (t) {
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
const easeIn = function (t) {
    return t * t;
};
const easeOut = function (t) {
    return t * (2 - t);
};
const easeInOut = function (t) {
    return t <= 0.5 ? 2 * t * t : -2 * t * t + 4 * t - 1;
};
const easeOutBounce = function (t) {
    return t * (3 - 2 * t);
};
const easeInCubic = function (t) {
    return t * t * t;
};
const easeOutCubic = function (t) {
    return 1 + Math.pow(t - 1, 3);
};
const easeInOutCubic = function (t) {
    t *= 2;
    return t < 1 ? 0.5 * t * t * t : 0.5 * Math.pow(t - 2, 3) + 1;
};
//# sourceMappingURL=Easing.js.map

var Easing = /*#__PURE__*/Object.freeze({
  __proto__: null,
  linear: linear,
  sin: sin,
  elastic: elastic,
  bounce: bounce,
  easeIn: easeIn,
  easeOut: easeOut,
  easeInOut: easeInOut,
  easeOutBounce: easeOutBounce,
  easeInCubic: easeInCubic,
  easeOutCubic: easeOutCubic,
  easeInOutCubic: easeInOutCubic
});

class ValueNode {
    reset() { }
    getValue() { }
    stopAnimation() { }
    resetAnimation() { }
}
//# sourceMappingURL=_Value.js.map

function lerp(start, end, fraction) {
    return start * (1 - fraction) + end * fraction;
}
function inverseLerp(a, b, v) {
    return clamp((v - a) / (b - a));
}
function clamp(v, min = 0, max = 1) {
    return Math.min(max, Math.max(min, v));
}
function invariant(condition, message) {
    if (condition)
        throw message;
}
function delay(func, time) {
    let id = setTimeout(func, time);
    return {
        clear() {
            clearTimeout(id);
        }
    };
}
function createInterpolation(config) {
    let easing = config.easing || linear;
    let input = config.inputRange;
    let output = config.outputRange;
    const rangeLength = input.length;
    const finalIndex = rangeLength - 1;
    return (v) => {
        // If value outside minimum range, quickly return
        // if (v <= input[0]) return output[0];
        // // If value outside maximum range, quickly return
        // if (v >= input[finalIndex]) return output[finalIndex];
        let i = 1;
        // Find index of range start
        for (; i < rangeLength; i += 1) {
            if (input[i] > v || i === finalIndex)
                break;
        }
        const range = inverseLerp(input[i - 1], input[i], v);
        let result = lerp(output[i - 1], output[i], easing(range));
        return result;
    };
}
//# sourceMappingURL=utils.js.map

class Interpolation {
    constructor(parent, config) {
        this.parent = parent;
        this.config = config;
        this.interpolation = createInterpolation(config);
    }
    getValue() {
        let parent = this.parent.getValue();
        return this.interpolation(parent);
    }
    interpolate(config) {
        return new Interpolation(this, config);
    }
}
//# sourceMappingURL=Interpolation.js.map

class Value extends ValueNode {
    constructor(value) {
        super();
        this.uuid = 1;
        this.listeners = {};
        this.value = value;
        this.startValue = value;
    }
    getValue() {
        return this.value;
    }
    reset() {
        this.value = this.startValue;
    }
    next(value) {
        this.value = value;
        Object.values(this.listeners).map(fn => fn(this.getValue()));
    }
    interpolate(config) {
        return new Interpolation(this, config);
    }
    animate(animation, callback) {
        if (this.animation)
            this.animation.stop();
        this.animation = animation;
        let onEnd = () => {
            callback && callback();
            this.animation = null;
        };
        let onUpdate = (value) => this.next(value);
        animation.start(this.getValue(), onUpdate, onEnd);
    }
    stopAnimation() {
        if (this.animation) {
            this.animation.stop();
            this.animation = null;
        }
    }
    resetAnimation() {
        this.reset();
        this.stopAnimation();
    }
    subscribe(fn) {
        let uuid = String(this.uuid++);
        this.listeners[uuid] = fn;
        return {
            unsubscribe() {
                delete this.listeners[uuid];
            }
        };
    }
}
//# sourceMappingURL=Value.js.map

class ValueXY extends ValueNode {
    constructor(x = 0, y = 0) {
        super();
        invariant(arguments.length < 2, "ValueXY must be initialize with two values {x, y}.");
        this.x = new Value(x);
        this.y = new Value(y);
    }
    getValue() {
        return { x: this.x.getValue(), y: this.y.getValue() };
    }
    next(x, y) {
        this.x.next(x);
        this.y.next(y);
    }
    reset() {
        this.x.reset();
        this.y.reset();
    }
    stopAnimation() {
        this.x.stopAnimation();
        this.y.stopAnimation();
    }
    resetAnimation() {
        this.x.stopAnimation();
        this.y.stopAnimation();
    }
    subscribe(fn) {
        let callback = (value) => fn(this.getValue());
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
//# sourceMappingURL=ValueXY.js.map

class Animation {
    constructor() {
        this.now = Date.now;
    }
    stop() { }
    start(fromValue, onUpdate, onEnd) { }
    update() { }
    /**
     * prevents exceeding the callstack which
     * would be caused by calling the endCallback
     * which would in turn call update and update calls
     * onEnd...
     */
    end() {
        let onEnd = this.onEnd;
        this.onEnd = null;
        if (onEnd)
            onEnd();
    }
}
//# sourceMappingURL=Animation.js.map

class Timing extends Animation {
    constructor({ delay, easing, toValue, duration }) {
        super();
        this.update = () => {
            /**
             * stop might have been called while the
             * animation was running.
             */
            if (!this.isRunning)
                return;
            this.deltaTime = Math.floor(this.now() - this.startTime);
            let time = this.easing(this.deltaTime / this.duration);
            this.onUpdate(lerp(this.fromValue, this.toValue, time));
            if (this.deltaTime > this.duration) {
                this.stop();
            }
            else {
                this.frame = requestAnimationFrame(this.update);
            }
        };
        this.delay = delay;
        this.toValue = toValue;
        this.easing = easing || linear;
        this.duration = duration || 300;
    }
    start(fromValue, onUpdate, onEnd) {
        this.onEnd = onEnd;
        this.isRunning = true;
        this.onUpdate = onUpdate;
        this.fromValue = fromValue;
        const start = () => {
            if (this.duration === 0) {
                this.onUpdate(this.toValue);
            }
            else {
                this.startTime = this.now();
                this.frame = requestAnimationFrame(this.update);
            }
        };
        if (this.delay) {
            this.timeout = delay(start, this.delay);
        }
        else {
            start();
        }
    }
    stop() {
        this.isRunning = false;
        cancelAnimationFrame(this.frame);
        if (this.timeout)
            this.timeout.clear();
        this.end();
    }
}
//# sourceMappingURL=Timing.js.map

function isXYAnimation(value, config, animation) {
    if (value instanceof ValueXY) {
        let valueX = value.x;
        let valueY = value.y;
        const configX = Object.assign({}, config);
        const configY = Object.assign({}, config);
        for (const key in config) {
            const { x, y } = config[key];
            if (x !== undefined && y !== undefined) {
                configX[key] = x;
                configY[key] = y;
            }
        }
        let animations = [];
        if (valueX)
            animations.push(animation(valueX, configX));
        if (valueY)
            animations.push(animation(valueY, configY));
        return parallel(animations);
    }
    return null;
}
function timing(value, config) {
    const start = (value, callback) => {
        let _value = value;
        _value.animate(new Timing(config), callback);
    };
    return (isXYAnimation(value, config, timing) || {
        start(callback) {
            start(value, callback);
        },
        stop() {
            value.stopAnimation();
        },
        reset() {
            value.resetAnimation();
        }
    });
}
function parallel(animations) {
    let count = 0;
    return {
        start(callback) {
            animations.forEach(animation => {
                let fn = () => {
                    count++;
                    if (count === animations.length) {
                        count = 0;
                        callback && callback();
                        return;
                    }
                };
                animation.start(fn);
            });
        },
        stop() {
            animations.forEach(animation => animation.stop());
        },
        reset() {
            animations.forEach(animation => animation.reset());
        }
    };
}
function delay$1(time) {
    return timing(new Value(0), {
        toValue: 0,
        duration: 1,
        delay: time
    });
}
function stagger(time, animations) {
    return parallel(animations.map((animation, index) => {
        return sequence([delay$1(time * index), animation]);
    }));
}
function sequence(animations) {
    let count = 0;
    return {
        start(callback) {
            let onComplete = () => {
                count++;
                if (count >= animations.length) {
                    callback && callback();
                    return;
                }
                let animation = animations[count];
                if (animation)
                    animation.start(onComplete);
            };
            if (animations.length === 0) {
                callback && callback();
            }
            else {
                animations[count].start(onComplete);
            }
        },
        stop() {
            if (count < animations.length) {
                animations[count].stop();
            }
        },
        reset() {
            animations.forEach(animation => animation.reset());
        }
    };
}
//# sourceMappingURL=helpers.js.map

class CSSVariables {
    constructor(node) {
        this.node = node || document.documentElement;
    }
    setVariables(variables) {
        for (const key in variables) {
            if (variables.hasOwnProperty(key)) {
                const variable = variables[key];
                let unit;
                let value = variable;
                if (Object.prototype.toString.call(variable) === "[object Object]" &&
                    !(variable instanceof Value) &&
                    !(variable instanceof Interpolation)) {
                    value = variable.value;
                    unit = variable.unit;
                }
                if (value instanceof Value) {
                    value.subscribe(v => {
                        this.node.style.setProperty(`--${key}`, `${v}${unit ? unit : ""}`);
                    });
                }
                else if (value instanceof Interpolation) {
                    let interpolation = value;
                    interpolation.parent.subscribe((v) => {
                        this.node.style.setProperty(`--${key}`, `${interpolation.getValue()}${unit ? unit : ""}`);
                    });
                }
                else {
                    this.node.style.setProperty(`--${key}`, `${value}${unit ? unit : ""}`);
                }
            }
        }
    }
}
//# sourceMappingURL=Variable.js.map

class Transform {
    constructor(transform) {
        this.transform = transform;
    }
    isValue(value) {
        return value instanceof Value;
    }
    isInterpolation(value) {
        return value instanceof Interpolation;
    }
    style(node) {
        let transforms = {};
        let applyTransform = (key, value, unit) => {
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
                    parent.subscribe((v) => {
                        let value = transform.getValue();
                        applyTransform(key, value, unit);
                    });
                }
                else if (this.isValue(transform)) {
                    let unit = this.transform[key].unit;
                    transform.subscribe((v) => applyTransform(key, v, unit));
                }
                else {
                    let unit = this.transform[key].unit;
                    applyTransform(key, transform, unit);
                }
            }
        }
    }
}
//# sourceMappingURL=Transform.js.map

class Style {
    constructor(node) {
        this.node = node;
    }
    setStyle(styles) {
        let transform = styles.transform;
        this.node.style.willChange = Object.keys(styles).join(",");
        if (transform) {
            new Transform(transform).style(this.node);
            delete styles.transform;
        }
        for (const key in styles) {
            if (styles.hasOwnProperty(key)) {
                let unit;
                const style = styles[key];
                let value = style;
                if (Object.prototype.toString.call(style) === "[object Object]" &&
                    !(style instanceof Value) &&
                    !(style instanceof Interpolation)) {
                    value = style.value;
                    unit = style.unit;
                }
                if (value instanceof Value) {
                    value.subscribe((v) => {
                        this.node.setAttribute("style", `${key}: ${v}${unit ? unit : ""}`);
                    });
                }
                else if (value instanceof Interpolation) {
                    let interpolation = value;
                    interpolation.parent.subscribe((v) => {
                        this.node.setAttribute("style", `${key}: ${interpolation.getValue()}${unit ? unit : ""}`);
                    });
                }
                else {
                    this.node.setAttribute("style", `${key}: ${value}${unit ? unit : ""}`);
                }
            }
        }
    }
}
//# sourceMappingURL=Style.js.map

function useValue(values) {
    let valuesObj = {};
    for (const key in values) {
        if (values.hasOwnProperty(key)) {
            let value = values[key];
            valuesObj[key] =
                typeof value === "number"
                    ? new Value(value)
                    : new ValueXY(value.x, value.y);
        }
    }
    return valuesObj;
}
function useTransition(transitions, config) {
    let transitionsObj = {};
    let animations = [];
    const start = () => {
        parallel(animations).start();
    };
    const reset = () => {
        animations.forEach(animation => {
            animation.reset();
        });
    };
    for (const key in transitions) {
        if (transitions.hasOwnProperty(key)) {
            let transition = transitions[key];
            let { to: toValue, from: startValue, config: internalConfig } = transition;
            invariant(!(startValue instanceof ValueNode), "{from} should be of type Value or ValueXY");
            let newConfig = internalConfig || Object.assign(Object.assign({}, config), { toValue });
            let animation = timing(startValue, newConfig);
            transitionsObj[key] = animation;
            animations.push(animation);
        }
    }
    return Object.assign(Object.assign({}, transitionsObj), { start, reset, transitions: animations });
    // const applyTransitions = (transitions: TransitionType) => {
    //   let transitionsObj: any = {};
    //   let animations: ComposedAnimation[] = [];
    //   const start = () => {
    //     parallel(animations).start();
    //   };
    //   const reset = () => {
    //     animations.forEach(animation => {
    //       animation.reset();
    //     });
    //   };
    //   for (const key in transitions) {
    //     if (transitions.hasOwnProperty(key)) {
    //       let transition: any = transitions[key];
    //       let {
    //         to: toValue,
    //         from: startValue,
    //         config: internalConfig
    //       } = transition;
    //       invariant(
    //         !(startValue instanceof ValueNode),
    //         "{from} should be of type Value or ValueXY"
    //       );
    //       let newConfig: any = internalConfig || { ...config, toValue };
    //       let animation = timing(startValue, newConfig);
    //       transitionsObj[key] = animation;
    //       animations.push(animation);
    //     }
    //   }
    //   return { ...transitionsObj, start, reset, transitions: animations };
    // };
    // if (typeof transitions === "function") {
    //   let _transitions: any = transitions;
    //   return (value: any) => {
    //     let _trans = _transitions()(value);
    //     return applyTransitions(_trans);
    //   };
    // } else {
    //   return applyTransitions(transitions);
    // }
}
function useVariables(variables, element) {
    new CSSVariables(element).setVariables(variables);
}
function useStyle(element, styles) {
    new Style(element).setStyle(styles);
}

const Animated = {
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
//# sourceMappingURL=animated.js.map

export { Animated };
