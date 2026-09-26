"use client";
import { useEffect, useRef, useState } from "react";

const MOCKS = ["Sign", "Shirt", "App icon"] as const;
const VARIANTS = [["light", "Light"], ["dark", "Dark"], ["mono", "One colour"]] as const;

function Mark({ n }: { n: number }) {
  return <span className="mark">TODO: logo {n}</span>;
}

export function LogoSlot({ n }: { n: number }) {
  const [mock, setMock] = useState(0);
  const [variant, setVariant] = useState<string>("light");
  const [grid, setGrid] = useState(false);
  return (
    <article className="logo-slot">
      <button type="button" className="stage" data-variant={variant} onClick={() => setMock((m) => (m + 1) % MOCKS.length)}
>
        <span className="sr-only">Logo {n} on {MOCKS[mock]}, tap for the next mockup.</span>
        {mock === 0 && <span className="mock-sign"><Mark n={n} /></span>}
        {mock === 1 && (
          <span className="mock-shirt">
            <svg viewBox="0 0 200 200" aria-hidden="true"><path d="M70 20 L40 30 L10 70 L35 85 L50 70 L50 185 L150 185 L150 70 L165 85 L190 70 L160 30 L130 20 Q100 45 70 20 Z" fill="var(--bg)" stroke="currentColor" strokeWidth="2" /></svg>
            <Mark n={n} />
          </span>
        )}
        {mock === 2 && <span className="mock-app"><Mark n={n} /></span>}
        {grid && <span className="construct" />}
      </button>
      <div className="stack">
        <h2 style={{ fontSize: "1.2rem" }}>TODO: logo {n} name</h2>
        <div className="stack" style={{ gap: "var(--s2)" }}>
          <span className="label">Mockup</span>
          <div className="seg">{MOCKS.map((m, i) => <button key={m} type="button" aria-pressed={mock === i} onClick={() => setMock(i)}>{m}</button>)}</div>
        </div>
        <div className="stack" style={{ gap: "var(--s2)" }}>
          <span className="label">Colour</span>
          <div className="seg">{VARIANTS.map(([v, l]) => <button key={v} type="button" aria-pressed={variant === v} onClick={() => setVariant(v)}>{l}</button>)}</div>
        </div>
        <div><button type="button" className="btn small" aria-pressed={grid} onClick={() => setGrid(!grid)}>{grid ? "Hide construction" : "Show construction"}</button></div>
        {grid && <p className="todo">TODO: one-line concept note for logo {n}</p>}
      </div>
    </article>
  );
}

const START = [[6, 10], [36, 30], [64, 8], [14, 58], [58, 55]];

export function StickerBoard() {
  const board = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(START.map(([x, y]) => ({ x, y })));
  const [order, setOrder] = useState(START.map((_, i) => i));
  const [held, setHeld] = useState<number | null>(null);
  const grab = useRef({ dx: 0, dy: 0 });

  function down(i: number, e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    const s = e.currentTarget.getBoundingClientRect();
    grab.current = { dx: e.clientX - s.left, dy: e.clientY - s.top };
    setHeld(i);
    setOrder((o) => [...o.filter((k) => k !== i), i]);
  }
  function move(i: number, e: React.PointerEvent<HTMLDivElement>) {
    if (held !== i) return;
    const b = board.current!.getBoundingClientRect(), w = e.currentTarget.offsetWidth;
    const x = Math.max(0, Math.min(b.width - w, e.clientX - b.left - grab.current.dx));
    const y = Math.max(0, Math.min(b.height - w, e.clientY - b.top - grab.current.dy));
    setPos((p) => p.map((q, k) => (k === i ? { x: (x / b.width) * 100, y: (y / b.height) * 100 } : q)));
  }
  return (
    <div className="board" ref={board} role="group" aria-label="Sticker board. Drag stickers around; positions reset when the page reloads.">
      {pos.map((p, i) => (
        <div key={i} className={`sticker ${held === i ? "held" : ""}`}
          style={{ left: `${p.x}%`, top: `${p.y}%`, zIndex: held === i ? 50 : order.indexOf(i) + 1 }}
          onPointerDown={(e) => down(i, e)} onPointerMove={(e) => move(i, e)}
          onPointerUp={() => setHeld(null)} onPointerCancel={() => setHeld(null)}>
          TODO: sticker {i + 1}
        </div>
      ))}
    </div>
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
  return (
    <article className="clip">
      <div className="player" style={{ aspectRatio: ratio }} data-playing={playing || undefined}>
        <video ref={vid} src={src} poster={poster} muted playsInline loop preload="metadata" onClick={toggle}
          onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
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
