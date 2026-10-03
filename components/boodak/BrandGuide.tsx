"use client";
import { useEffect, useRef } from "react";
import * as ART from "./art";

// One brand's guide as a hard-cornered bento, laid out from ~/Desktop/idk/brand identitiy bento_boodak.svg. Stickers sit where
// the file put them and tilt on hover; the tag hangs off the board's top edge on an elastic string and sways when the
// cursor brushes it, which knocks the slogan's lines down inside their tile. The palette tile copies hex on click.
export type Brand = { name: string; concept: string };

export const BOODAK: Brand = {
  name: "Boodak Studio",
  concept: "Boodak Studio takes its name from budak, the Malay word for kid. It’s a photography studio that doesn’t take itself too seriously, and the mark says so: a kid chilling with sunglasses on.",
};

// Board units are the Affinity file's px, so every number below is read straight off it.
const W = 2481, H = 1772;
const SLOGAN = { w: 1299, h: 591 };
const STICKERS = [
  { k: "STICKER_CAM", cx: 1557, cy: 712, w: 540, h: 281, rot: -16.8 },
  { k: "STICKER_SUN", cx: 1870, cy: 1059, w: 447.6, h: 470.7, rot: 19.6 }, // the art carries ~10% margin, so it's drawn larger to match the file
] as const;
// hx/hy: the string hole, as fractions of the tag box.
const TAG = { x: 2216, y: 807, w: 186, h: 427, hx: 0.508, hy: 0.1616 };
const AX = TAG.x + TAG.w * TAG.hx, AY = TAG.y + TAG.h * TAG.hy; // string anchor x, and the hole's rest y
const LINES = [{ t: "chaos,", x: 220.6, y: 183.6 }, { t: "captured", x: 64.9, y: 283.2 }, { t: "beautifully.", x: 102, y: 387.8 }];
const STRIPES = [{ name: "Cocoa", hex: "#52443C" }, { name: "Lime", hex: "#CEDF45" }, { name: "Cream", hex: "#F8F4E8" }];
// The type specimens' font boxes in the 590.6-unit tile, as the file sets them
const AA = [{ k: "outfit", font: "Outfit Semibold", x: 168.1, y: 73.9 }, { k: "chillax", font: "Chillax Semibold", x: 162.8, y: 299.4 }]; // Chillax's font box sits 6.6 lower in the browser

// Tag: gravity, string stiffness, air drag (board units, seconds). Rest length leaves the hole exactly at AY.
const TG = 4000, K = 80, C = 2.2, L0 = AY - TG / K;
const NUDGE = 2.5, NUDGE_MAX = 90, SWAY_MAX = 260; // cursor px → tag speed, per-nudge cap, total speed cap; lower = calmer sway
const G = 6000, PAD = 24; // slogan gravity; wall inset so a tilted line's corners stay inside the tile
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const mask = (k: keyof typeof ART) => `url("data:image/svg+xml,${encodeURIComponent(ART[k])}")`;

type Body = { x: number; y: number; vx: number; vy: number; a: number; va: number; held: boolean; gx: number; gy: number; w: number; h: number };
const body = (): Body => ({ x: 0, y: 0, vx: 0, vy: 0, a: 0, va: 0, held: false, gx: 0, gy: 0, w: 0, h: 0 });

function Art({ k, className = "", style }: { k: keyof typeof ART; className?: string; style?: React.CSSProperties }) {
  return <span className={`bd-art ${className}`} style={style} dangerouslySetInnerHTML={{ __html: ART[k] }} />;
}

export default function BrandGuide({ brand }: { brand: Brand }) {
  const boardRef = useRef<HTMLDivElement>(null);
  const lineEls = useRef<(HTMLElement | null)[]>([]);
  const tagEl = useRef<HTMLElement>(null);
  const cordEl = useRef<SVGPathElement>(null);
  const sloganEl = useRef<HTMLDivElement>(null);
  const kick = useRef(() => {});
  const sim = useRef({
    lines: LINES.map(body),
    tag: { ...body(), x: AX, y: AY }, // x/y: the hole, in board units
    fallen: false, homing: false, moved: false, down: { x: 0, y: 0, t: 0 },
  });

  useEffect(() => {
    const board = boardRef.current!, s = sim.current;
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0, last = 0, acc = 0;
    const DT = 1 / 120;

    const render = () => {
      const k = board.clientWidth / W;
      s.lines.forEach((b, i) => { const el = lineEls.current[i]; if (el) el.style.transform = `translate(${b.x * k}px, ${b.y * k}px) rotate(${b.a}deg)`; });
      const t = s.tag;
      if (tagEl.current) tagEl.current.style.transform = `translate(${(t.x - AX) * k}px, ${(t.y - AY) * k}px) rotate(${t.a}deg)`;
      // Slack string sags into a curve; taut string is straight.
      const d = Math.hypot(t.x - AX, t.y), sag = d < L0 ? Math.sqrt(L0 * L0 - d * d) * 0.5 : 0;
      cordEl.current?.setAttribute("d", `M${AX} 0Q${(AX + t.x) / 2} ${t.y / 2 + sag} ${t.x} ${t.y}`);
    };

    const step = () => {
      // Tag: a weight on an elastic string. The string only pulls, never pushes.
      const t = s.tag;
      const dx = t.x - AX, dy = t.y, d = Math.hypot(dx, dy) || 1;
      let ax = -C * t.vx, ay = TG - C * t.vy;
      if (d > L0) { const f = (-K * (d - L0)) / d; ax += f * dx; ay += f * dy; }
      t.vx += ax * DT; t.vy += ay * DT; t.x += t.vx * DT; t.y += t.vy * DT;
      // The tag's angle chases the string's with its own spring, so it lags and wobbles through a swing.
      const target = (-Math.atan2(t.x - AX, t.y) * 180) / Math.PI;
      t.va += ((target - t.a) * 120 - t.va * 8) * DT; t.a += t.va * DT;

      // Slogan lines: gravity, walls of their own tile, and they stack on each other.
      if (s.homing) {
        let done = true;
        for (const b of s.lines) {
          const e = Math.min(1, DT * 7); b.x -= b.x * e; b.y -= b.y * e; b.a -= b.a * e; b.vx = b.vy = b.va = 0;
          if (Math.abs(b.x) + Math.abs(b.y) + Math.abs(b.a) > 0.5) done = false; else b.x = b.y = b.a = 0;
        }
        if (done) s.homing = s.fallen = false;
      } else if (s.fallen) {
        s.lines.forEach((b, i) => {
          if (b.held) return;
          b.vy += G * DT; b.x += b.vx * DT; b.y += b.vy * DT; b.a += b.va * DT; b.va *= Math.exp(-3 * DT);
          b.a = clamp(b.a, -7, 7);
          const L = LINES[i], x0 = PAD - L.x, x1 = SLOGAN.w - PAD - b.w - L.x, y1 = SLOGAN.h - PAD - b.h - L.y;
          if (b.x < x0 || b.x > x1) { b.x = clamp(b.x, x0, x1); b.vx *= -0.4; }
          if (b.y < PAD - L.y) { b.y = PAD - L.y; b.vy = Math.abs(b.vy) * 0.3; }
          if (b.y > y1) {
            b.y = y1;
            if (b.vy > 400) b.va += (Math.random() - 0.5) * b.vy * 0.06;
            b.vy = b.vy > 250 ? -b.vy * 0.4 : 0; b.vx *= Math.exp(-8 * DT);
          }
        });
        // Rest each line on whatever is below it: resolve bottom-up so a stack settles in one pass.
        const order = s.lines.map((b, i) => i).sort((i, j) => LINES[j].y + s.lines[j].y - (LINES[i].y + s.lines[i].y));
        for (let it = 0; it < 3; it++) for (const i of order) for (const j of order) {
          if (i === j) continue;
          const p = s.lines[i], q = s.lines[j], P = LINES[i], Q = LINES[j];
          const pl = P.x + p.x, pt = P.y + p.y, ql = Q.x + q.x, qt = Q.y + q.y;
          const ox = Math.min(pl + p.w - ql, ql + q.w - pl), oy = Math.min(pt + p.h - qt, qt + q.h - pt);
          if (ox <= 0 || oy <= 0) continue;
          if (oy < ox) {
            const [up, lo] = pt < qt ? [p, q] : [q, p];
            if (up.held) continue;
            up.y -= oy;
            if (up.vy > lo.vy) { up.vy = lo.vy; up.vx *= Math.exp(-8 * DT); }
          } else {
            const sx = pl < ql ? -ox / 2 : ox / 2;
            if (!p.held) p.x += sx;
            if (!q.held) q.x -= sx;
            [p.vx, q.vx] = [q.vx * 0.5, p.vx * 0.5];
          }
        }
      }
    };

    const busy = () => {
      const t = s.tag, moving = (b: Body) => b.held || Math.abs(b.vx) + Math.abs(b.vy) > 4 || Math.abs(b.va) > 1;
      const tagRest = Math.abs(t.x - AX) + Math.abs(t.y - AY) + Math.abs(t.a) < 0.3 && Math.abs(t.vx) + Math.abs(t.vy) + Math.abs(t.va) < 2;
      return !tagRest || s.homing || (s.fallen && s.lines.some(moving));
    };

    const frame = (now: number) => {
      acc = Math.min(acc + (now - last) / 1000, 8 * DT); last = now;
      for (; acc >= DT; acc -= DT) step();
      render();
      if (busy()) raf = requestAnimationFrame(frame);
      else { raf = 0; const t = s.tag; t.x = AX; t.y = AY; t.a = t.vx = t.vy = t.va = 0; render(); }
    };
    kick.current = () => {
      if (rm.matches) { const t = s.tag; t.x = AX; t.y = AY; t.vx = t.vy = 0; }
      if (!raf) { last = performance.now(); acc = 0; raf = requestAnimationFrame(frame); }
    };

    const ro = new ResizeObserver(render);
    ro.observe(board);
    render();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  // Pointer → board units, relative to the board's top-left.
  const at = (e: React.PointerEvent) => {
    const r = boardRef.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * W) / r.width, y: ((e.clientY - r.top) * H) / r.height };
  };

  // Fallen slogan lines can be picked up and thrown around their tile.
  function grab(b: Body, e: React.PointerEvent<HTMLElement>) {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = at(e), s = sim.current;
    Object.assign(b, { held: true, gx: p.x - b.x, gy: p.y - b.y, vx: 0, vy: 0 });
    s.down = { x: e.clientX, y: e.clientY, t: performance.now() };
    kick.current();
  }
  function drag(b: Body, i: number, e: React.PointerEvent<HTMLElement>) {
    if (!b.held) return;
    const s = sim.current, p = at(e), now = performance.now(), dt = Math.max(0.008, (now - s.down.t) / 1000), L = LINES[i];
    if (Math.hypot(e.clientX - s.down.x, e.clientY - s.down.y) > 4) s.moved = true;
    const x = clamp(p.x - b.gx, PAD - L.x, SLOGAN.w - PAD - b.w - L.x), y = clamp(p.y - b.gy, PAD - L.y, SLOGAN.h - PAD - b.h - L.y);
    b.vx = b.vx * 0.4 + ((x - b.x) / dt) * 0.6; b.vy = b.vy * 0.4 + ((y - b.y) / dt) * 0.6;
    b.x = x; b.y = y; s.down.t = now;
    kick.current();
  }
  function drop(b: Body) {
    if (!b.held) return;
    b.held = false;
    if (performance.now() - sim.current.down.t > 80) b.vx = b.vy = 0; // held still before letting go: no throw
    b.vx = clamp(b.vx, -5000, 5000); b.vy = clamp(b.vy, -5000, 5000);
    kick.current();
  }
  function sheen(e: React.PointerEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  }

  // Nudging the tag knocks the slogan down, one line at a time.
  function nudge(v: number) {
    const s = sim.current;
    s.tag.vx = clamp(s.tag.vx + clamp(v, -NUDGE_MAX, NUDGE_MAX), -SWAY_MAX, SWAY_MAX);
    if (!s.fallen && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      s.fallen = true; s.homing = false;
      const k = boardRef.current!.clientWidth / W;
      s.lines.forEach((b, i) => {
        const el = lineEls.current[i]!;
        b.w = el.offsetWidth / k; b.h = el.offsetHeight / k;
        b.vx = (Math.random() - 0.5) * 900; b.vy = -1000 - i * 200; b.va = (Math.random() - 0.5) * 60;
      });
      sloganEl.current?.setAttribute("title", "Tap to put the words back");
    }
    kick.current();
  }

  function onClick(e: React.MouseEvent) {
    const s = sim.current;
    if (s.moved) { s.moved = false; return; }
    const target = e.target as HTMLElement;
    if (s.fallen && !s.homing && target.closest(".bt-slogan")) {
      s.homing = true; sloganEl.current?.removeAttribute("title"); kick.current(); return;
    }
    const el = target.closest<HTMLElement>("[data-hex]");
    if (!el) return;
    navigator.clipboard?.writeText(el.dataset.hex!).catch(() => {});
    el.dataset.copied = "";
    clearTimeout(Number(el.dataset.timer));
    el.dataset.timer = String(window.setTimeout(() => delete el.dataset.copied, 1400));
  }

  const s = sim.current;
  return (
    <article className="bd">
      <header className="bd-head">
        <h2>{brand.name}</h2>
        <p>{brand.concept}</p>
      </header>

      <div className="bento" ref={boardRef} onClick={onClick} onPointerDownCapture={() => { sim.current.moved = false; }}>
        <figure className="bt bt-photo bt-hero" style={{ gridArea: "hero" }}>
          <img src="/boodak/hero.jpg" alt="A boy in blue sunglasses framing a shot on a small camera." loading="lazy" />
          <Art k="PRIMARY" className="bd-hero-logo" />
        </figure>

        <div className="bt bt-word" style={{ gridArea: "word" }}><Art k="WORDMARK" /></div>
        <div className="bt bt-cream" style={{ gridArea: "stk" }} />

        <div className="bt bt-type" style={{ gridArea: "type" }}>
          {AA.map((a) => <span key={a.k} className={`bd-aa-${a.k}`} title={a.font} style={{ left: `${(a.x / 590.6) * 100}%`, top: `${(a.y / 590.6) * 100}%` }}>Aa.</span>)}
        </div>

        <div className="bt bt-stripes" style={{ gridArea: "strp" }}>
          {STRIPES.map((c) => (
            <button key={c.name} type="button" style={{ background: c.hex, "--tile": c.hex } as React.CSSProperties} data-hex={c.hex} aria-label={`${c.name} ${c.hex}, copy hex`} />
          ))}
        </div>

        <div className="bt bt-photo bt-slogan" style={{ gridArea: "slogan" }} ref={sloganEl}>
          <img src="/boodak/chase.jpg" alt="Two kids chasing each other across a playground." loading="lazy" />
          {LINES.map((l, i) => (
            <p key={l.t} ref={(el) => { lineEls.current[i] = el; }} className="bd-line"
              style={{ left: `${(l.x / SLOGAN.w) * 100}%`, top: `${(l.y / SLOGAN.h) * 100}%` }}
              onPointerDown={(e) => s.fallen && !s.homing && grab(s.lines[i], e)}
              onPointerMove={(e) => drag(s.lines[i], i, e)}
              onPointerUp={() => drop(s.lines[i])} onPointerCancel={() => drop(s.lines[i])}>{l.t}</p>
          ))}
        </div>

        {/* Stickers and the tag float over every tile; the tag may swing out past the board. */}
        <div className="bd-layer">
          <svg className="bd-cord" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
            <path ref={cordEl} d={`M${AX} 0L${AX} ${AY}`} />
          </svg>
          {STICKERS.map((st) => (
            <span key={st.k} className="bd-stk" aria-hidden="true"
              style={{ left: `${((st.cx - st.w / 2) / W) * 100}%`, top: `${((st.cy - st.h / 2) / H) * 100}%`, width: `${(st.w / W) * 100}%`, rotate: `${st.rot}deg` }}
              onPointerMove={sheen}>
              <Art k={st.k} style={{ "--src": mask(st.k) } as React.CSSProperties} />
            </span>
          ))}
          <span ref={tagEl} className="bd-stk bd-tag" role="button" tabIndex={0} aria-label="Tag sticker on a string, nudge it to knock the slogan down"
            style={{ left: `${(TAG.x / W) * 100}%`, top: `${(TAG.y / H) * 100}%`, width: `${(TAG.w / W) * 100}%`, transformOrigin: `${TAG.hx * 100}% ${TAG.hy * 100}%` }}
            onPointerMove={(e) => { sheen(e); if (e.pointerType === "mouse" && e.movementX) nudge(e.movementX * NUDGE); }}
            onPointerDown={(e) => { if (e.pointerType !== "mouse") nudge((Math.random() < 0.5 ? -1 : 1) * NUDGE_MAX); }}
           
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); nudge(NUDGE_MAX); } }}>
            <Art k="STICKER_TAG" style={{ "--src": mask("STICKER_TAG") } as React.CSSProperties} />
            {/* The front strand of the loop, over the tag from the hole to its tip; the back strand is the cord behind it. */}
            <svg className="bd-loop" viewBox={`0 0 ${TAG.w} ${TAG.h}`} aria-hidden="true">
              <path d={`M${TAG.w * TAG.hx} ${TAG.h * TAG.hy}Q${TAG.w * TAG.hx + 20} 30 ${TAG.w * TAG.hx} -14`} />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}
