// Paper confetti out of an element, in the folder colours. Each bit is a span flown along a sampled gravity arc
// with the Web Animations API, then removed. Skipped when the viewer prefers reduced motion.
const COLOURS = ["--f-graphic", "--f-bolahh", "--f-erica", "--f-index", "--f-spark", "--accent", "--card-stock"];
const G = 1400; // px/s²

export function confetti(from: HTMLElement, count = 90) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const r = from.getBoundingClientRect(), css = getComputedStyle(document.documentElement);
  const colours = COLOURS.map((c) => css.getPropertyValue(c).trim()).filter(Boolean);
  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:100;overflow:hidden";
  document.body.append(layer);
  let left = count;
  for (let i = 0; i < count; i++) {
    const bit = document.createElement("span");
    const w = 7 + Math.random() * 7, h = w * (0.4 + Math.random() * 0.5);
    bit.style.cssText = `position:absolute;left:${r.left + Math.random() * r.width}px;top:${r.top + r.height / 3}px;width:${w}px;height:${h}px;border-radius:1.5px;background:${colours[i % colours.length]}`;
    layer.append(bit);
    // A short hop up out of the tab, fanned wide, so it rains down over the folder instead of leaving the top of the screen
    const a = (-90 + (Math.random() - 0.5) * 150) * (Math.PI / 180), v = 260 + Math.random() * 340;
    const vx = Math.cos(a) * v, vy = Math.sin(a) * v, spin = (Math.random() - 0.5) * 1440, dur = 1.6 + Math.random() * 0.9;
    const frames = Array.from({ length: 9 }, (_, k) => {
      const t = (k / 8) * dur;
      return { transform: `translate(${vx * t}px, ${vy * t + 0.5 * G * t * t}px) rotate(${spin * t}deg) rotateX(${spin * t * 1.5}deg)`, opacity: k > 6 ? 0 : 1 };
    });
    bit.animate(frames, { duration: dur * 1000, easing: "linear", fill: "forwards" }).onfinish = () => { if (--left === 0) layer.remove(); };
  }
}
