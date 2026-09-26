"use client";
import { useEffect, useRef, useState } from "react";

// Floating glass index for long case studies: shows where you are, steps between sections, and jumps anywhere.
export default function SectionIndex({ sections }: { sections: { id: string; label: string }[] }) {
  const [current, setCurrent] = useState(0);
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(els.indexOf(e.target as HTMLElement))),
      { rootMargin: "-35% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const onScroll = () => setShown(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, [sections]);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", close);
    return () => { document.removeEventListener("keydown", close); document.removeEventListener("pointerdown", close); };
  }, [open]);

  function go(i: number) {
    const el = document.getElementById(sections[i].id);
    if (!el) return;
    el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    setCurrent(i);
    setOpen(false);
  }

  return (
    <div className="sidx" ref={root} data-shown={shown || open} aria-hidden={!shown && !open ? true : undefined}>
      {open && (
        <ol className="sidx-list glass" id="sidx-list">
          {sections.map((s, i) => (
            <li key={s.id}>
              <button type="button" aria-current={i === current ? "true" : undefined} onClick={() => go(i)}>
                <span className="sidx-num">{String(i + 1).padStart(2, "0")}</span>{s.label}
              </button>
            </li>
          ))}
        </ol>
      )}
      <nav className="sidx-bar glass" aria-label="Sections on this page">
        <button type="button" className="sidx-step" onClick={() => go(Math.max(0, current - 1))} disabled={current === 0} aria-label="Previous section" tabIndex={shown ? 0 : -1}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg>
        </button>
        <button type="button" className="sidx-now" aria-expanded={open} aria-controls="sidx-list" onClick={() => setOpen(!open)} tabIndex={shown ? 0 : -1}>
          <span className="sidx-num">{String(current + 1).padStart(2, "0")}/{String(sections.length).padStart(2, "0")}</span>
          <span className="sidx-label">{sections[current].label}</span>
          <svg viewBox="0 0 16 16" aria-hidden="true" className="sidx-caret"><path d="M4 10l4-4 4 4" /></svg>
        </button>
        <button type="button" className="sidx-step" onClick={() => go(Math.min(sections.length - 1, current + 1))} disabled={current === sections.length - 1} aria-label="Next section" tabIndex={shown ? 0 : -1}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" /></svg>
        </button>
      </nav>
    </div>
  );
}
