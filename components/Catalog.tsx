"use client";
import { useEffect, useRef, useState } from "react";

// Tilt angles for a hovered sticky note; each hover picks a different one than last time.
const TILTS = [-3, -4.5]; // negative: the right side lifts

// Library catalog card: a page's key facts on ruled card stock. Hovering swings it on its pin hole.
// Touch has no hover: a tap swings it, and a second tap or a tap anywhere else lets it fall back.
export default function Catalog({ head, rows }: { head: [string, string]; rows: [string, React.ReactNode][] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilted, setTilted] = useState(false);
  const tilt = () => {
    const el = ref.current!, last = el.style.getPropertyValue("--tilt");
    const pick = TILTS.filter((t) => `${t}deg` !== last);
    el.style.setProperty("--tilt", `${pick[Math.floor(Math.random() * pick.length)]}deg`);
  };
  const tap = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    if (!tilted) tilt();
    setTilted(!tilted);
  };
  useEffect(() => {
    if (!tilted) return;
    const away = (e: PointerEvent) => { if (!ref.current!.contains(e.target as Node)) setTilted(false); };
    addEventListener("pointerdown", away);
    return () => removeEventListener("pointerdown", away);
  }, [tilted]);
  return (
    <div className="catalog" ref={ref} data-tilted={tilted || undefined}
      onPointerEnter={(e) => e.pointerType === "mouse" && tilt()} onPointerUp={tap}>
      <div className="catalog-head">{head.filter(Boolean).map((h) => <span key={h}>{h}</span>)}</div>
      <dl>
        {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>
    </div>
  );
}
