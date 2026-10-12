"use client";
// "Apa Khabar?" as ransom-note cut-out letters. On load each tile decodes: it flickers through random letters, numbers and
// symbols (and every few frames a new font, paper, pattern and cut), then settles on its real letter, left to right.
// After that, every SWAP_MS about SHUFFLE_SHARE of the letters re-roll font, paper, pattern, tilt and scissor cut.
// Tiles are a fixed size (globals.css .cutout), so re-rolls never change the word's footprint or move the page.
// First paint uses a fixed layout (seeded cuts) so server and client match; reduced-motion visitors keep it.
import { useEffect, useState } from "react";

const SWAP_MS = 850; // shuffle rate after the intro; lower = busier
const SHUFFLE_SHARE = .55; // each shuffle re-rolls about this share of the letters
const GLYPHS = "ABCDEFGHJKMNPRSTUVWXYZabdefghkmnpqrtuy0123456789#$%&@!?*+=<>/";
const SCRAMBLE_MS = 110, RESOLVE_MS = 150, RESOLVE_AFTER = 350; // flicker rate; gap between letters settling; wait before the first
const FLICKER_SHARE = .55; // on each flicker only this share of the unsettled tiles change; the rest hold
const RESTYLE_EVERY = 2; // ...and every 2nd flicker those tiles also re-roll font, paper, pattern and cut (~2.5 changes/s per tile, under 3 flashes/s)

type Tile = [string, string, string, string, number, string, string]; // letter, font class, paper, ink, tilt in degrees, clip-path, texture class

// Paper finishes (globals.css .tx-*); "" is plain paper so some tiles stay clean
const textures = ["", "tx-dots", "tx-lines", "tx-ruled", "tx-grid", "tx-check", "tx-argyle", "tx-grunge", "tx-stripe", "tx-halftone"];
const fonts = ["co-fat", "co-pixel", "co-code", "co-shade", "co-bebas", "co-serif", "co-term", "co-neon", "co-block", "co-dm"];
// Any hue, but paper and ink always sit at opposite ends of lightness so the letter stays readable
const rnd = (a: number, b: number) => Math.round(a + Math.random() * (b - a));
// Loud poster pairs (paper, ink), used about half the time so the collage always has some punch
const bold: [string, string][] = [["#FFD60A", "#111111"], ["#E10600", "#FFFFFF"], ["#E10600", "#FFD60A"], ["#111111", "#FFD60A"],
  ["#FFFFFF", "#E10600"], ["#FFD60A", "#E10600"], ["#111111", "#FF2E2E"], ["#0038FF", "#FFD60A"], ["#FF4FA3", "#111111"], ["#FF7A00", "#111111"]];
const paper = (): [string, string] => {
  if (Math.random() < .5) return pick(bold);
  const h = rnd(0, 359), h2 = (h + rnd(120, 240)) % 360;
  return Math.random() < .5
    ? [`hsl(${h} ${rnd(45, 90)}% ${rnd(62, 88)}%)`, `hsl(${h2} ${rnd(50, 90)}% ${rnd(12, 24)}%)`]
    : [`hsl(${h} ${rnd(45, 85)}% ${rnd(16, 30)}%)`, `hsl(${h2} ${rnd(60, 95)}% ${rnd(80, 92)}%)`];
};

const fixed: [string, string, string, string, number][][] = [
  [["A", "co-fat", "#7A2E3A", "#FFF3B5", -7], ["p", "co-pixel", "#F2B33D", "#12213A", 5], ["a", "co-code", "#12213A", "#7FC4A6", -3]],
  [["K", "co-shade", "#FFFFFF", "#1F4FB5", 6], ["h", "co-bebas", "#8FAEE6", "#12213A", -5], ["a", "co-serif", "#FFF3B5", "#7A2E3A", 3],
   ["b", "co-term", "#12213A", "#F2B33D", -8], ["a", "co-neon", "#FFFFFF", "#7A2E3A", 4], ["r", "co-block", "#1F4FB5", "#FFFFFF", -4], ["?", "co-dm", "#E6BE5A", "#12213A", 9]],
];

// Scissor cut: each corner nudged inward, plus sometimes an extra notch along an edge, so no two tiles are rectangles
const cut = (r: () => number) => {
  const j = (n: number) => +(r() * n * 1.6).toFixed(1); // up to 16% in from each corner
  const pts = [[j(10), j(10)]];
  if (r() < .5) pts.push([30 + j(40), j(7)]);
  pts.push([100 - j(10), j(10)]);
  if (r() < .5) pts.push([100 - j(7), 30 + j(40)]);
  pts.push([100 - j(10), 100 - j(10)]);
  if (r() < .5) pts.push([30 + j(40), 100 - j(7)]);
  pts.push([j(10), 100 - j(10)]);
  return `polygon(${pts.map(([x, y]) => `${x}% ${y}%`).join(", ")})`;
};
let seed = 7; // fixed seed for the first paint only
const seeded = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const initial: Tile[][] = fixed.map(w => w.map((t): Tile => [...t, cut(seeded), textures[Math.floor(seeded() * textures.length)]]));

const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const roll = (ch: string): Tile => [ch, pick(fonts), ...paper(), rnd(-14, 14), cut(Math.random), pick(textures)];
const reroll = (words: Tile[][]) => words.map(word => word.map((t): Tile => Math.random() < SHUFFLE_SHARE ? roll(t[0]) : t));

export default function Cutouts() {
  const [words, setWords] = useState(initial);
  const [shown, setShown] = useState<string[] | null>(null); // decoding glyphs while the intro runs, null once settled
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const letters = initial.flat().map(t => t[0]), start = performance.now();
    let t: ReturnType<typeof setInterval>;
    let frame = 0;
    const tick = () => {
      const settled = Math.floor(Math.max(0, performance.now() - start - RESOLVE_AFTER) / RESOLVE_MS);
      if (settled >= letters.length) { clearInterval(scramble); setShown(null); t = setInterval(() => setWords(reroll), SWAP_MS); return; }
      const hit = letters.map(() => Math.random() < FLICKER_SHARE), restyle = frame++ % RESTYLE_EVERY === 0;
      setShown(prev => letters.map((ch, k) => k < settled ? ch : !prev || hit[k] ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)] : prev[k]));
      if (restyle) setWords(ws => { let k = 0; return ws.map(word => word.map((tile): Tile => { const i = k++; return i < settled || !hit[i] ? tile : roll(tile[0]); })); });
    };
    const scramble = setInterval(tick, SCRAMBLE_MS);
    tick(); // first frame straight away, so the real letters don't flash before decoding
    return () => { clearInterval(scramble); clearInterval(t); };
  }, []);
  let n = 0; // running letter index across both words
  return words.map((word, w) => (
    <span key={w} className="cutout-word" aria-hidden="true">
      {word.map(([ch, font, bg, fg, tilt, clip, tx], i) => (
        <span key={i} className={`cutout ${tx}`} style={{ "--i": n++, backgroundColor: bg, color: fg, rotate: `${tilt}deg`, clipPath: clip } as React.CSSProperties}><span className={font}>{shown?.[n - 1] ?? ch}</span></span>
      ))}
    </span>
  ));
}
