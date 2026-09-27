"use client";
import { useEffect, useRef, useState } from "react";

// Native cursors max out at 128px, so on mouse devices the hand is drawn as an image that follows the pointer.
// The CSS still decides which hand shows: with html.hand, --cursor ends in "auto" and --click in "pointer".
const SIZE = 96; // cursor height in px
const HANDS = {
  cursor: { src: "/cursors/cursor-lg.png", x: 21, y: 5 }, // x, y: fingertip hotspot at SIZE
  click: { src: "/cursors/click-lg.png", x: 13, y: 6 },
};

export default function HandCursor() {
  const ref = useRef<HTMLImageElement>(null);
  const [on, setOn] = useState(false);
  const [hand, setHand] = useState<keyof typeof HANDS | null>(null);

  useEffect(() => {
    const fine = matchMedia("(pointer: fine)");
    if (!fine.matches) return;
    document.documentElement.classList.add("hand");
    setOn(true);
    new Image().src = HANDS.click.src; // no blank frame on the first hover
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const c = e.target instanceof Element ? getComputedStyle(e.target).cursor : "";
      // Our cursors end in "pointer" or "auto"; anything else (grab, not-allowed) is a real system cursor.
      const next = c.startsWith("url") ? (c.endsWith("pointer") ? "click" : "cursor") : null;
      setHand(next);
      const h = next && HANDS[next];
      if (h && ref.current) ref.current.style.transform = `translate(${e.clientX - h.x}px, ${e.clientY - h.y}px)`;
    };
    const leave = () => setHand(null);
    addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      document.documentElement.classList.remove("hand");
      removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  if (!on) return null;
  return (
    <img
      ref={ref}
      className="hand-cursor"
      src={HANDS[hand ?? "cursor"].src}
      alt=""
      aria-hidden
      style={{ height: SIZE, visibility: hand ? "visible" : "hidden" }}
    />
  );
}
