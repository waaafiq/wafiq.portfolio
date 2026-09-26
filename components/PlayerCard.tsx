"use client";
import { useRef, useState } from "react";

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Drag to spin, move the pointer over it to tilt, release and it eases back to rest.
export default function PlayerCard() {
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const [mode, setMode] = useState<"rest" | "drag" | "tilt">("rest");
  const start = useRef({ px: 0, py: 0, y: 0 });

  function rest(y = rot.y) {
    setMode("rest");
    setRot({ x: 0, y: Math.round(y / 180) * 180 });
  }
  function down(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { px: e.clientX, py: e.clientY, y: rot.y };
    setMode("drag");
  }
  function move(e: React.PointerEvent<HTMLDivElement>) {
    if (mode === "drag") {
      const dx = e.clientX - start.current.px, dy = e.clientY - start.current.py;
      setRot({ x: Math.max(-25, Math.min(25, -dy * 0.3)), y: start.current.y + dx * 0.6 });
    } else if (e.pointerType === "mouse" && !reduced()) {
      const b = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - b.left) / b.width - 0.5, py = (e.clientY - b.top) / b.height - 0.5;
      setMode("tilt");
      setRot((r) => ({ x: -py * 20, y: Math.round(r.y / 180) * 180 + px * 20 }));
    }
  }
  function key(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      rest(rot.y + (e.key === "ArrowLeft" ? -180 : 180));
    }
  }

  return (
    <div className="card-stage">
      <div
        className={`pcard ${mode === "drag" ? "dragging" : mode === "rest" ? "resting" : ""}`}
        style={{ transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)` }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={() => rest()}
        onPointerCancel={() => rest()}
        onPointerLeave={() => mode === "tilt" && rest()}
        onKeyDown={key}
        tabIndex={0}
        role="img"
        aria-label="Demo player card. Drag to spin it, or press the arrow keys to flip it."
      >
        <div className="face front">
          <span className="label" style={{ color: "inherit" }}>Bolahh · Player</span>
          <div className="portrait">TODO: player card artwork from the owner</div>
          <span className="label" style={{ color: "inherit" }}>Drag to spin</span>
        </div>
        <div className="face back">Bolahh</div>
      </div>
    </div>
  );
}
