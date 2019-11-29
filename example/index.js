let box = document.querySelector(".box");

let {
  parallel,
  sequence,
  useValue,
  useStyle,
  useTransition,
  Easing: { elastic, linear }
} = Animated;

let { scale, transform } = useValue({
  scale: 1,
  transform: { x: 0, y: 0 }
});

const calc = (x, y) => [
  -(y - window.innerHeight / 2) / 20,
  (x - window.innerWidth / 2) / 20,
  2
];

let style = useStyle(box, {
  perspective: "600px",
  transform: {
    rotateX: {
      unit: "deg",
      value: transform.x
    },
    rotateY: {
      unit: "deg",
      value: transform.y
    },
    scale: {
      value: scale
    }
  }
});

box.onmousemove = e => {
  let [x, y, s] = calc(e.clientX, e.clientY);
};

box.onmouseleave = e => {
  send({ x: 0, y: 0, s: 1 }).start();
};
