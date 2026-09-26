"use client";
import { useRef, useState } from "react";

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

// Placeholder outlines until the owner supplies the icon set. pathLength lets the draw-in animation work on any shape.
const ICONS = [
  <circle key="c" cx="12" cy="12" r="8" pathLength={100} />,
  <rect key="r" x="4" y="4" width="16" height="16" rx="3" pathLength={100} />,
  <path key="t" d="M12 4 L20 19 H4 Z" pathLength={100} />,
  <path key="p" d="M5 12 H19 M12 5 V19" pathLength={100} />,
  <path key="w" d="M3 15 Q7.5 7 12 15 T21 15" pathLength={100} />,
  <path key="h" d="M4 11 L12 4 L20 11 V20 H4 Z" pathLength={100} />,
];
function Icon({ i, size }: { i: number; size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[i]}</svg>;
}

export function IconSet() {
  const dlg = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(0);
  return (
    <>
      <ul className="icon-grid">
        {ICONS.map((_, i) => (
          <li key={i}>
            <button type="button" className="icon-btn" aria-label={`Placeholder icon ${i + 1}, view at real sizes`}
              onClick={() => { setOpen(i); dlg.current?.showModal(); }}>
              <Icon i={i} size={40} />
            </button>
          </li>
        ))}
      </ul>
      <dialog ref={dlg} aria-labelledby="icon-dlg-h" onClick={(e) => e.target === dlg.current && dlg.current.close()}>
        <h2 id="icon-dlg-h" style={{ fontSize: "1.2rem" }}>Placeholder icon {open + 1} at real sizes</h2>
        <div className="sizes">
          {[16, 24, 48].map((s) => (
            <figure key={s}><Icon i={open} size={s} /><figcaption className="label">{s} px</figcaption></figure>
          ))}
        </div>
        <form method="dialog"><button className="btn small">Close</button></form>
      </dialog>
    </>
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

export function ShortClip({ n, src, poster }: { n: number; src?: string; poster?: string }) {
  const vid = useRef<HTMLVideoElement>(null);
  const [t, setT] = useState(0);
  const toggle = () => { const v = vid.current; if (v) (v.paused ? v.play() : v.pause()); };
  return (
    <figure className="clip" style={{ margin: 0 }}>
      {src ? (
        <button type="button" className="screen" onClick={toggle} aria-label={`Play or pause short ${n}`}
          onPointerEnter={(e) => e.pointerType === "mouse" && vid.current?.play()}
          onPointerLeave={(e) => e.pointerType === "mouse" && vid.current?.pause()}>
          <video ref={vid} src={src} poster={poster} muted loop playsInline preload="metadata"
            onTimeUpdate={(e) => setT(e.currentTarget.currentTime / (e.currentTarget.duration || 1))} />
        </button>
      ) : (
        <div className="screen"><span className="todo">TODO: After Effects short {n} and poster frame</span></div>
      )}
      <input type="range" min={0} max={1} step={0.001} value={t} disabled={!src} aria-label={`Scrub short ${n}`}
        onChange={(e) => { const v = vid.current; setT(+e.target.value); if (v?.duration) v.currentTime = +e.target.value * v.duration; }} />
      <figcaption className="label">TODO: title for short {n}</figcaption>
    </figure>
  );
}
