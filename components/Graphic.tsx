"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const STICKERS = Array.from({ length: 16 }, (_, i) => `/stickers/${i + 1}.svg`);
// Three random stickers start loose on the page, in fixed spots placed against the Stickers sheet so they land the same
// at any width, each at a random tilt: x is a fraction of the sheet's width, y px from the sheet's top.
const LOOSE = [
  { x: 0.796, y: -23 }, // hanging off the bottom of the Toolkit card
  { x: 1.09, y: 158 }, // out past the sheet's right edge
  { x: -0.014, y: 224 }, // off the sheet's left edge
];
const G = 2400, H = 1 / 120; // gravity px/s², fixed physics step

type Body = { x: number; y: number; px: number; py: number; a: number; mode: "box" | "held" | "stuck" | "tween"; gx: number; gy: number; vx: number; vy: number;
  tw?: { x0: number; y0: number; a0: number; x1: number; y1: number; a1: number; t0: number; dur: number; then: "box" | "stuck"; sway?: number; swings?: number } };

const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// A box of flower stickers with gravity. Drag one out of the box and it sticks anywhere on the page;
// "Release stickers!" opens the floor and lets them drift down onto the page.
export function StickerBoard() {
  const boxRef = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const bodies = useRef<Body[]>([]);
  const geo = useRef({ L: 0, T: 0, R: 0, B: 0, W: 0, Hh: 0, r: 40, d: 80, ml: 0, mt: 0 });
  const openRef = useRef(false);
  const zTop = useRef(1);
  const wake = useRef(() => {});
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  // As the button's spot reaches the top of the screen, the button detaches and sticks there (same 16px offset, so the
  // handoff is seamless); scrolling back up docks it under the box again.
  const dockRef = useRef<HTMLDivElement>(null);
  const [floating, setFloating] = useState(false);
  useEffect(() => {
    let raf = 0;
    const check = () => { raf = 0; setFloating(dockRef.current!.getBoundingClientRect().top < 16); };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => setHost(boxRef.current!.closest("main")), []);

  useEffect(() => {
    if (!host) return;
    const box = boxRef.current!, layer = host.querySelector<HTMLElement>(".sticker-layer")!;
    const measure = () => {
      // Box height fits all 16 stickers packed in rows, plus a little headroom, so there's no empty band on top.
      const w = box.clientWidth, d = clamp(w / 7.5, 64, 118) + 5, cols = Math.max(1, Math.floor(w / (0.92 * d + 4)));
      const h = `${Math.round(Math.ceil(STICKERS.length / cols) * 0.88 * d + 0.8 * d)}px`;
      if (box.style.height !== h) box.style.height = h;
      // Coordinates are relative to the layer, which spans the viewport width but only the page's height.
      const m = layer.getBoundingClientRect(), b = box.getBoundingClientRect(), g = geo.current;
      g.ml = m.left; g.mt = m.top; g.W = Math.min(m.width, document.documentElement.clientWidth - m.left); g.Hh = m.height;
      g.L = b.left - m.left + 1; g.R = b.right - m.left - 1; g.T = b.top - m.top + 1; g.B = b.bottom - m.top - 6;
      g.d = clamp((g.R - g.L) / 7.5, 64, 118) + 5; g.r = g.d * 0.46;
      layer.style.setProperty("--d", `${g.d}px`);
    };
    measure();
    // Spawn: three random stickers stuck in the LOOSE spots, the rest dropped into the box. Phones keep all of them in the box.
    const mobile = matchMedia("(max-width: 560px)").matches;
    const g = geo.current, loose = mobile ? [] : [...STICKERS.keys()].sort(() => Math.random() - 0.5).slice(0, 3), sheet = box.closest(".doc")!.getBoundingClientRect();
    const slot = slots();
    bodies.current = STICKERS.map((_, i) => {
      const k = loose.indexOf(i);
      // Loose spots can sit past the sheet's edge; keep them fully on screen in narrower windows.
      const [x, y] = k >= 0 ? [clamp(sheet.left - g.ml + LOOSE[k].x * sheet.width, g.d / 2 + 8, g.W - g.d / 2 - 8), sheet.top - g.mt + LOOSE[k].y] : slot.shift()!;
      return { x, y, px: x, py: y, a: rand(-0.5, 0.5), mode: k >= 0 ? "stuck" : "box", gx: 0, gy: 0, vx: 0, vy: 0 };
    });

    let raf = 0, last = performance.now(), acc = 0;
    const frame = (now: number) => {
      measure();
      const { L, T, R, B, W, Hh, r, d } = geo.current, bs = bodies.current;
      acc = Math.min(acc + (now - last) / 1000, 4 * H); last = now;
      for (; acc >= H; acc -= H) {
        for (const b of bs) if (b.mode === "box") {
          const vx = (b.x - b.px) * 0.996, vy = (b.y - b.py) * 0.996;
          b.px = b.x; b.py = b.y; b.x += vx; b.y += vy + G * H * H;
        }
        for (let it = 0; it < 3; it++) {
          for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) {
            const p = bs[i], q = bs[j];
            const pa = p.mode === "box", qa = q.mode === "box";
            if (!(pa || qa) || !(pa || p.mode === "held") || !(qa || q.mode === "held")) continue;
            const dx = q.x - p.x, dy = q.y - p.y, dist = Math.hypot(dx, dy) || 0.01, o = 2 * r - dist;
            if (o <= 0) continue;
            const ux = dx / dist, uy = dy / dist, sp = pa && qa ? 0.5 : pa ? 1 : 0, sq = pa && qa ? 0.5 : qa ? 1 : 0;
            p.x -= ux * o * sp; p.y -= uy * o * sp; q.x += ux * o * sq; q.y += uy * o * sq;
          }
          for (const b of bs) if (b.mode === "box") {
            b.x = clamp(b.x, L + r, R - r); b.y = clamp(b.y, T + r, B - r);
            if (b.y >= B - r) b.px += (b.x - b.px) * 0.15; // floor friction
          }
        }
        for (const b of bs) if (b.mode === "box") b.a += (b.x - b.px) / r; // roll
      }
      bs.forEach((b, i) => {
        if (b.mode === "tween" && b.tw) {
          const t = b.tw, p = t.dur ? clamp((now - t.t0) / t.dur, 0, 1) : 1;
          if (t.sway) {
            // Falling leaf: swings side to side, tilting into each swing and dipping at the bottom of it, then settles softly.
            const e = (1 - Math.cos(Math.PI * p)) / 2, th = p * t.swings! * 2 * Math.PI, env = Math.sin(Math.PI * p);
            b.x = t.x0 + (t.x1 - t.x0) * e + Math.sin(th) * t.sway * env;
            b.y = t.y0 + (t.y1 - t.y0) * e - Math.abs(Math.sin(th)) * 28 * env;
            b.a = t.a0 + (t.a1 - t.a0) * e + Math.cos(th) * 0.8 * env * Math.sign(t.sway);
          } else {
            const e = p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2; // ease in-out cubic
            b.x = t.x0 + (t.x1 - t.x0) * e; b.y = t.y0 + (t.y1 - t.y0) * e; b.a = t.a0 + (t.a1 - t.a0) * e;
          }
          if (p >= 1) { b.mode = t.then; b.px = b.x; b.py = b.y; if (t.then === "stuck") land(i); }
        }
        if (b.mode === "stuck") { b.x = clamp(b.x, 0.75 * d, W - 0.75 * d); b.y = clamp(b.y, r, Hh - 0.75 * d); } // tilted flowers reach ~0.7d from centre, so keep them off the clipped side and bottom edges
        const el = els.current[i];
        if (el) el.style.transform = `translate(${b.x - d / 2}px, ${b.y - d / 2}px) rotate(${b.a}rad)`;
      });
      // The loop measures layout every frame, so it sleeps while the box is off screen and nothing is moving.
      raf = visible || bs.some((b) => b.mode === "held" || b.mode === "tween") ? requestAnimationFrame(frame) : 0;
    };
    let visible = true;
    wake.current = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) wake.current(); });
    io.observe(box);
    addEventListener("resize", wake.current);
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); io.disconnect(); removeEventListener("resize", wake.current); };
  }, [host]);

  // Grid of spawn points in the upper part of the box, so nothing starts overlapping.
  function slots() {
    const { L, T, R, r } = geo.current, cols = Math.max(1, Math.floor((R - L) / (2 * r + 4)));
    return STICKERS.map((_, k) => [L + r + 2 + (k % cols) * (2 * r + 4) + rand(-3, 3), T + r + Math.floor(k / cols) * (2 * r + 2)]).reverse();
  }
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  function land(i: number) {
    const el = els.current[i];
    if (!el) return;
    el.classList.remove("land"); void el.offsetWidth; el.classList.add("land");
  }
  const at = (e: React.PointerEvent) => ({ x: e.clientX - geo.current.ml, y: e.clientY - geo.current.mt });

  function down(i: number, e: React.PointerEvent<HTMLDivElement>) {
    const b = bodies.current[i];
    if (b.mode === "tween") return;
    e.preventDefault(); // no text selection while dragging
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = at(e);
    Object.assign(b, { mode: "held", gx: p.x - b.x, gy: p.y - b.y, vx: 0, vy: 0 });
    e.currentTarget.style.zIndex = String(++zTop.current);
    e.currentTarget.style.setProperty("--tilt", `${(Math.random() < 0.5 ? -1 : 1) * rand(5, 9)}deg`);
    e.currentTarget.classList.add("held");
    wake.current();
  }
  function move(i: number, e: React.PointerEvent) {
    const b = bodies.current[i];
    if (b.mode !== "held") return;
    const p = at(e), x = p.x - b.gx, y = p.y - b.gy;
    b.vx = x - b.x; b.vy = y - b.y; b.x = x; b.y = y;
  }
  function up(i: number, e: React.PointerEvent<HTMLDivElement>) {
    const b = bodies.current[i], { L, T, R, B } = geo.current;
    if (b.mode !== "held") return;
    e.currentTarget.classList.remove("held");
    if (!openRef.current && b.x > L && b.x < R && b.y > T && b.y < B) {
      b.mode = "box"; b.px = b.x - clamp(b.vx, -12, 12) * 0.5; b.py = b.y - clamp(b.vy, -12, 12) * 0.5; // a little throw
    } else { b.mode = "stuck"; land(i); }
  }

  function toggle() {
    const now = performance.now(), { L, R, T, B, W, Hh, r, d } = geo.current, rm = reduced();
    const next = !openRef.current;
    openRef.current = next; setOpen(next); wake.current();
    if (next) {
      // Floor slides away, then the stickers drift down one by one, lowest first, landing anywhere across the page
      // width, a flower's width in from each side. Each landing spot is the best of 40 random tries (the one farthest from every sticker already
      // on the page), so they spread out instead of piling up.
      const placed = bodies.current.filter((b) => b.mode === "stuck").map((b) => [b.x, b.y]);
      bodies.current.map((b, i) => [b, i] as const).filter(([b]) => b.mode === "box").sort(([a], [b]) => b.y - a.y).forEach(([b], k) => {
        let x1 = b.x, y1 = b.y, best = -1;
        for (let n = 0; n < 40; n++) {
          const x = rand(d, W - d), y = clamp(rand(B + 120, B + innerHeight * 3.2), r, Hh - d); // a full flower clear of the page bottom
          const gap = Math.min(Infinity, ...placed.map(([px, py]) => Math.hypot(px - x, py - y)));
          if (gap > best) { best = gap; x1 = x; y1 = y; }
        }
        placed.push([x1, y1]);
        const dur = 2000 + (y1 - b.y) * 2.2; // ~450px/s
        b.mode = "tween";
        b.tw = { x0: b.x, y0: b.y, a0: b.a, x1, y1, a1: b.a + rand(-1, 1),
          t0: now + (rm ? 0 : 450 + k * 160), dur: rm ? 0 : dur, then: "stuck", sway: rand(90, 150) * (Math.random() < 0.5 ? -1 : 1), swings: Math.max(1.5, dur / 1800) };
      });
    } else {
      // Gather every sticker back into the box, then gravity packs them.
      const s = slots();
      bodies.current.forEach((b, k) => {
        const [x1, y1] = s.shift()!;
        b.mode = "tween";
        b.tw = { x0: b.x, y0: b.y, a0: b.a, x1: clamp(x1, L + r, R - r), y1: clamp(y1, T + r, B - r), a1: rand(-0.4, 0.4), t0: now + (rm ? 0 : k * 50), dur: rm ? 0 : 900, then: "box" };
      });
    }
  }

  return (
    <>
      <div className={`sticker-box ${open ? "open" : ""}`} ref={boxRef} role="group" aria-label="Box of flower stickers. Drag a sticker out of the box to stick it anywhere on the page; positions reset when the page reloads." />
      {/* The dock keeps the button's place; the button itself moves to a fixed spot while floating */}
      <div className="release-dock" ref={dockRef}>
        {!floating && <button type="button" className="btn small glass release" onClick={toggle}>{open ? "Put them back!" : "Release stickers!"}</button>}
      </div>
      {floating && createPortal(
        <button type="button" className="btn small glass release floating" onClick={toggle}>{open ? "Put them back!" : "Release stickers!"}</button>,
        document.body)}
      {host && createPortal(
        <div className="sticker-layer" aria-hidden="true">
          {STICKERS.map((src, i) => (
            <div key={src} ref={(el) => { els.current[i] = el; }} className="sticker" style={{ transform: "translate(-999px, -999px)" }}
              onPointerDown={(e) => down(i, e)} onPointerMove={(e) => move(i, e)} onPointerUp={(e) => up(i, e)} onPointerCancel={(e) => up(i, e)}
              onAnimationEnd={(e) => e.currentTarget.classList.remove("land")}>
              <span className="sk" style={{ "--src": `url(${src})` } as React.CSSProperties}><img src={src} alt="" draggable={false} /></span>
            </div>
          ))}
        </div>, host)}
    </>
  );
}

const I = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;
const ICON = {
  play: <svg {...I}><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" /></svg>,
  pause: <svg {...I}><rect x="14" y="3" width="5" height="18" rx="1" /><rect x="5" y="3" width="5" height="18" rx="1" /></svg>,
  sound: <svg {...I}><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" /><path d="M16 9a5 5 0 0 1 0 6" /><path d="M19.364 18.364a9 9 0 0 0 0-12.728" /></svg>,
  muted: <svg {...I}><path d="M11 4.702a.7.7 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.7.7 0 0 0 11 19.298z" /><path d="m16.5 14.5 5-5" /><path d="m16.5 9.5 5 5" /></svg>,
};
const mmss = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

// Video with a glass control bar: play/pause, slim scrubber, mute. Starts muted; tap the video to play or pause.
export function ShortClip({ src, poster, title, ratio = "16 / 9", children }: { src: string; poster: string; title: string; ratio?: string; children?: React.ReactNode }) {
  const vid = useRef<HTMLVideoElement>(null);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  // The metadata can load before hydration, so read the duration once on mount too.
  useEffect(() => { const v = vid.current; if (v && v.readyState >= 1) setDur(v.duration); }, []);
  const toggle = () => { const v = vid.current; if (v) (v.paused ? v.play() : v.pause()); };
  const mute = () => { const v = vid.current; if (v) { v.muted = !v.muted; setMuted(v.muted); } };
  // Like YouTube: any movement, tap or key shows the controls, and while playing they fade after a moment of stillness.
  const [awake, setAwake] = useState(true);
  const idle = useRef(0);
  const wake = () => { setAwake(true); clearTimeout(idle.current); idle.current = window.setTimeout(() => setAwake(false), 2500); };
  useEffect(() => () => clearTimeout(idle.current), []);
  return (
    <article className="clip">
      <div className="player" style={{ aspectRatio: ratio }} data-playing={playing || undefined} data-awake={awake || undefined}
        onPointerMove={wake} onPointerDown={wake} onKeyDown={wake} onFocus={wake}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") { clearTimeout(idle.current); setAwake(false); } }}>
        <video ref={vid} src={src} poster={poster} muted playsInline loop preload="metadata" onClick={toggle}
          onPlay={() => { setPlaying(true); wake(); }} onPause={() => setPlaying(false)}
          onLoadedMetadata={(e) => setDur(e.currentTarget.duration)} onDurationChange={(e) => setDur(e.currentTarget.duration)}
          onTimeUpdate={(e) => setT(e.currentTarget.currentTime)} />
        <div className="player-bar glass">
          <button type="button" onClick={toggle} aria-label={playing ? `Pause ${title}` : `Play ${title}`}>{playing ? ICON.pause : ICON.play}</button>
          <input type="range" min={0} max={dur || 1} step={0.01} value={t} aria-label={`Scrub ${title}`} aria-valuetext={`${mmss(t)} of ${mmss(dur)}`}
            style={{ "--p": `${dur ? (t / dur) * 100 : 0}%` } as React.CSSProperties}
            onChange={(e) => { const v = vid.current; const x = +e.target.value; setT(x); if (v) v.currentTime = x; }} />
          <span className="player-time">{mmss(t)} / {mmss(dur)}</span>
          <button type="button" onClick={mute} aria-label={muted ? "Turn sound on" : "Mute"} aria-pressed={!muted}>{muted ? ICON.muted : ICON.sound}</button>
        </div>
      </div>
      {children && <div className="clip-info">{children}</div>}
    </article>
  );
}
