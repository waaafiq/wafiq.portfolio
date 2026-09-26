"use client";
import { useState } from "react";

// Before and after slider. Pointer events handle mouse and touch; the range input handles keyboard and screen readers.
export default function Compare({ label, before, after }: { label: string; before: React.ReactNode; after: React.ReactNode }) {
  const [v, setV] = useState(50);
  function at(e: React.PointerEvent<HTMLDivElement>) {
    const b = e.currentTarget.getBoundingClientRect();
    setV(Math.round(Math.max(0, Math.min(1, (e.clientX - b.left) / b.width)) * 100));
  }
  return (
    <div
      className="compare"
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); at(e); }}
      onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && at(e)}
    >
      <div className="pane after">{after}</div>
      <div className="pane before" style={{ clipPath: `inset(0 ${100 - v}% 0 0)` }}>{before}</div>
      <span className="sign tagl">Before</span>
      <span className="sign tagr"><b>After</b></span>
      <div className="divider" style={{ left: `${v}%` }} />
      <input type="range" min={0} max={100} value={v} onChange={(e) => setV(+e.target.value)} aria-label={`${label}: compare before and after`} />
    </div>
  );
}
