"use client";

// Tilt angles for a hovered sticky note; each hover picks a different one than last time.
const TILTS = [-3, -4.5]; // negative: the right side lifts

// Library catalog card: a page's key facts on ruled card stock. Hovering swings it on its pin hole.
export default function Catalog({ head, rows }: { head: [string, string]; rows: [string, React.ReactNode][] }) {
  const tilt = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget, last = el.style.getPropertyValue("--tilt");
    const pick = TILTS.filter((t) => `${t}deg` !== last);
    el.style.setProperty("--tilt", `${pick[Math.floor(Math.random() * pick.length)]}deg`);
  };
  return (
    <div className="catalog" onPointerEnter={tilt}>
      <div className="catalog-head">{head.filter(Boolean).map((h) => <span key={h}>{h}</span>)}</div>
      <dl>
        {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>
    </div>
  );
}
