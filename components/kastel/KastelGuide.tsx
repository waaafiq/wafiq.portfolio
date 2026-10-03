"use client";
import { useEffect, useRef } from "react";

// Kastel's guide, laid out exactly as ~/Desktop/idk/brand identitiy bento_kastel.svg (2481 x 1772, 210 x 150 mm): a 60 mm
// logo banner beside four 15 mm swatches, then the photo beside the 50 mm type tile and the 40 mm "25'" tile. Every
// number below is read straight off that file, in its own units. The medals hang from the top of the photo on ribbons
// and teeter like Boodak's tag; the metal shine slides as they swing.
type Box = { x: number; y: number; w: number; h: number };
const TILES = {
  logo: { x: 0, y: 0, w: 1890, h: 708.7 }, type: { x: 1890, y: 708.7, w: 591, h: 590.5 },
  num: { x: 1890, y: 1299.2, w: 591, h: 472.8 }, photo: { x: 0, y: 708.7, w: 1890, h: 1063.3 },
};
// Exported pieces carry a 2-unit margin in their viewBox, so each sits 2 units out from its painted bounds.
const piece = (x: number, y: number, w: number, h: number) => ({ x: x - 2, y: y - 2, w: w + 4, h: h + 4 });
const PIECES = {
  mark: piece(399.1, 161, 378, 340.6), wordmark: piece(871.5, 241.5, 619.2, 89.9), num: piece(2029.8, 1467.2, 336.6, 137), runner: piece(1964.7, 1357.3, 453.1, 414.3),
  aa: piece(2051.5, 839.5, 268, 102.1), // the file has it 9 units right of centre; centred here, paired with AA below
};
// Text boxes (font box = 1.208 em tall, so line-height matches): the subtitle lines and the Montserrat specimen
// The file spreads both subtitle lines to about the same width, so each has its own tracking. y is nudged 2.1 down for
// the browser's taller font box.
const SUB = [{ t: "Karnival Sukan", x: 874.7, y: 360.2, ls: ".216em" }, { t: "Telekom Malaysia", x: 872.6, y: 420.8, ls: ".102em" }];
const AA = { x: 2056, y: 1006.5 }; // ink centred under the display "Aa.", 108.8 below it; the pair centred on the tile
// Place a box (board units) inside a tile, as percentages of that tile
const at = (b: Box | { x: number; y: number }, t: Box): React.CSSProperties => ({
  left: `${((b.x - t.x) / t.w) * 100}%`, top: `${((b.y - t.y) / t.h) * 100}%`,
  ...("w" in b ? { width: `${(b.w / t.w) * 100}%`, height: `${(b.h / t.h) * 100}%` } : {}),
});

const MW = 429.7, MH = 589.7; // medal size, margin included
// The medals hang in their own layer over the photo, pinned at its top edge (the banner's bottom). Each ribbon carries on
// EXTRA units above the layer, which clips it, so the ribbon reads as running on behind the banner while the medal swings.
const W = TILES.photo.w, H = TILES.photo.h, EXTRA = 420;
// As in the file: gold left, silver raised in the middle, bronze right. top: the medal's top, relative to the photo.
const MEDALS = [
  { k: "gold", label: "Gold medal", left: 160.9, top: 308.9 },
  { k: "silver", label: "Silver medal", left: 709.7, top: 178.9 },
  { k: "bronze", label: "Bronze medal", left: 1258.5, top: 308.9 },
] as const;
// The medal's slot, as fractions of the medal: the ribbon loops through it
const SLOT = { y0: 0.022, y1: 0.062, w: 0.37 };
const STRIPES = [{ name: "TM Blue", hex: "#1700E7" }, { name: "TM Orange", hex: "#FE5E00" }, { name: "Ember", hex: "#C14522" }, { name: "Off-white", hex: "#D7FBF4" }];

// Pendulum: stiffness, damping (per second), cursor px → angular speed, speed and angle caps (radians)
const K = 14, C = 1.6, NUDGE = 0.004, KICK = 1.4, SPEED_MAX = 2.4, ANGLE_MAX = 0.4;
const pct = (v: number, of: number) => `${(v / of) * 100}%`;

export default function KastelGuide({ name, concept }: { name: string; concept: string }) {
  const hangEls = useRef<(HTMLElement | null)[]>([]);
  const sim = useRef(MEDALS.map(() => ({ a: 0, v: 0 })));
  const kick = useRef((i: number, v: number) => {});

  useEffect(() => {
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    const s = sim.current;
    let raf = 0, last = 0;
    const render = () => s.forEach((m, i) => {
      const el = hangEls.current[i];
      if (!el) return;
      el.style.rotate = `${m.a}rad`;
      el.style.setProperty("--sh", `${30 - m.a * 160}%`); // the light stays put while the metal turns under it
    });
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30); last = now;
      let moving = false;
      for (const m of s) {
        m.v += (-K * m.a - C * m.v) * dt;
        m.a = Math.max(-ANGLE_MAX, Math.min(ANGLE_MAX, m.a + m.v * dt));
        if (Math.abs(m.a) > 0.0005 || Math.abs(m.v) > 0.0005) moving = true;
        else m.a = m.v = 0;
      }
      render();
      raf = moving ? requestAnimationFrame(frame) : 0;
    };
    kick.current = (i, v) => {
      if (rm.matches) return;
      const m = s[i];
      m.v = Math.max(-SPEED_MAX, Math.min(SPEED_MAX, m.v + v));
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
    };
    return () => cancelAnimationFrame(raf);
  }, []);

  function copy(e: React.MouseEvent) {
    const el = (e.target as HTMLElement).closest<HTMLElement>("[data-hex]");
    if (!el) return;
    navigator.clipboard?.writeText(el.dataset.hex!).catch(() => {});
    el.dataset.copied = "";
    clearTimeout(Number(el.dataset.timer));
    el.dataset.timer = String(window.setTimeout(() => delete el.dataset.copied, 1400));
  }

  return (
    <article className="bd">
      <header className="bd-head">
        <h2>{name}</h2>
        <p>{concept}</p>
      </header>

      <div className="bento km" onClick={copy}>
        <div className="bt km-logo" style={{ gridArea: "logo" }}>
          <img className="km-at" style={at(PIECES.mark, TILES.logo)} src="/kastel/mark.svg" alt="Kastel mark: three figures with raised arms forming a trophy under a signal wave" />
          <img className="km-at" style={at(PIECES.wordmark, TILES.logo)} src="/kastel/wordmark.svg" alt="KASTEL" />
          {SUB.map((l) => <span key={l.t} className="km-at km-sub" style={{ ...at(l, TILES.logo), letterSpacing: l.ls }}>{l.t}</span>)}
        </div>

        <div className="bt bt-stripes" style={{ gridArea: "strp" }}>
          {STRIPES.map((c) => (
            <button key={c.name} type="button" style={{ background: c.hex, "--tile": c.hex } as React.CSSProperties} data-hex={c.hex} aria-label={`${c.name} ${c.hex}, copy hex`} />
          ))}
        </div>

        <div className="bt km-type" style={{ gridArea: "type" }}>
          <img className="km-at" style={at(PIECES.aa, TILES.type)} src="/kastel/aa.svg" alt="Aa. in the Kastel display face" title="Display face" />
          <span className="km-at km-aa" style={at(AA, TILES.type)} title="Montserrat Semibold">Aa.</span>
        </div>

        <div className="bt km-num" style={{ gridArea: "num" }}>
          <img className="km-at" style={at(PIECES.runner, TILES.num)} src="/kastel/runner.svg" alt="" />
          <img className="km-at" style={at(PIECES.num, TILES.num)} src="/kastel/num.svg" alt="25'" />
        </div>

        <figure className="bt bt-photo km-photo" style={{ gridArea: "photo" }}>
          <img src="/kastel/huddle.jpg" alt="A team huddled in a circle, hands in the middle, seen from below." loading="lazy" />
        </figure>

        <div className="km-hangs">
          {MEDALS.map((m, i) => {
            const len = EXTRA + m.top + MH; // ribbon top (behind the banner) to the medal's bottom
            const drop = EXTRA + m.top + MH * SLOT.y1; // down to the bottom of the slot
            return (
              <span key={m.k} ref={(el) => { hangEls.current[i] = el; }} className="km-hang" data-k={m.k} role="button" tabIndex={0}
                aria-label={`${m.label} on a ribbon, nudge it to swing`}
                style={{ left: pct(m.left, W), top: pct(-EXTRA, H), width: pct(MW, W), height: pct(len, H), transformOrigin: `50% ${pct(EXTRA, len)}`,
                  "--src": `url(/kastel/${m.k}.svg)` } as React.CSSProperties}
                onPointerMove={(e) => { if (e.pointerType === "mouse" && e.movementX) kick.current(i, e.movementX * NUDGE); }}
                onPointerDown={(e) => { if (e.pointerType !== "mouse") kick.current(i, (Math.random() < 0.5 ? -1 : 1) * KICK); }}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); kick.current(i, KICK); } }}>
                <span className="km-ribbon" style={{ width: pct(MW * SLOT.w, MW), height: pct(drop, len) }} />
                <span className="km-medal" style={{ height: pct(MH, len) }}>
                  <img src={`/kastel/${m.k}.svg`} alt="" draggable={false} />
                </span>
                {/* The ribbon's front strand, folded over the tab and down through the slot */}
                <span className="km-ribbon km-fold" style={{ width: pct(MW * SLOT.w * 1.04, MW), top: pct(EXTRA + m.top - 6, len), height: pct(MH * SLOT.y1 + 6, len) }} />
              </span>
            );
          })}
        </div>
      </div>
    </article>
  );
}
