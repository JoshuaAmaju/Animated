let box = document.querySelector(".box");

let {
  sequence,
  useValue,
  useTransition,
  Easing: { elastic, linear }
} = Animated;

let { opacity, transform } = useValue({
  opacity: 1,
  transform: { x: 0, y: 0 }
});

let { transitions } = useTransition(
  {
    x: { from: transform, to: { x: 200, y: 0 } },
    y: { from: transform, to: { x: 200, y: 200 } },
    opacity: { from: opacity, config: { easing: linear, toValue: 0 } }
  },
  { duration: 1000, easing: elastic(3) }
);

opacity.subscribe(v => (box.style.opacity = v));

transform.subscribe(({ x, y }) => {
  box.style.transform = `translate3d(${x}px, ${y}px, 0)`;
});

box.onclick = e => sequence(transitions).start();
