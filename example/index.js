let value = new Animated.Value(0);
let box = document.querySelector(".box");

value.subscribe(v => (box.style.transform = `translate3d(${v}px, 0, 0)`));
box.onclick = e => Animated.timing(value, { toValue: 200 }).start();
