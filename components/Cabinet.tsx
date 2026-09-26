"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import { TAB_ICONS } from "./TabIcons";

// Each page is a folder in the sorter. The active folder's tab comes to the front and its colour fills the file.
export const FOLDERS = [
  { href: "/", label: "Index", mid: "Index", short: "Index", c: "index" },
  { href: "/work/erica-nav", label: "ERICA Nav", mid: "ERICA", short: "ERICA", c: "erica" },
  { href: "/work/bolahh", label: "Bolahh", mid: "Bolahh", short: "Bolahh", c: "bolahh" },
  { href: "/work/graphic-design", label: "Graphic design", mid: "G. Design", short: "Design", c: "graphic" },
  { href: "/about", label: "About", mid: "About", short: "About", c: "about" },
];

// Strong ease-in-out: slow start, quick through the middle, soft landing.
const ease = (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);

export default function Cabinet({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const activeIndex = Math.max(0, FOLDERS.findIndex((f) => f.href === path));
  const active = FOLDERS[activeIndex];

  // Chevron marker: rests on the open tab. When the open folder changes it slides from the old tab to the new one,
  // lifting each tab it passes over. Driven imperatively so the slide never re-renders the page.
  const tabsRef = useRef<HTMLElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const fromIndex = useRef(activeIndex);
  const xRef = useRef<number | null>(null);

  const centre = (i: number) => {
    const t = tabRefs.current[i], nav = tabsRef.current;
    if (!t || !nav) return null;
    const r = t.getBoundingClientRect(), n = nav.getBoundingClientRect();
    return r.left - n.left + r.width / 2;
  };
  const setX = (x: number) => {
    xRef.current = x;
    if (!markerRef.current) return;
    markerRef.current.style.transform = `translateX(${x}px)`;
    markerRef.current.setAttribute("data-placed", "");
  };
  // Restart the bob so it begins once the slide has landed.
  const bob = (delayMs: number) => {
    const svg = markerRef.current?.querySelector("svg");
    if (!svg) return;
    svg.style.animation = "none";
    void svg.getBoundingClientRect();
    svg.style.animation = "";
    svg.style.animationDelay = `${delayMs}ms`;
  };

  // Keep the chevron on the open tab through resizes and font loads.
  useLayoutEffect(() => {
    const place = () => { const x = centre(activeIndex); if (x !== null) setX(x); };
    const ro = new ResizeObserver(place);
    if (tabsRef.current) ro.observe(tabsRef.current);
    document.fonts?.ready.then(place);
    return () => ro.disconnect();
  }, [activeIndex]);

  // Slide on folder change.
  useLayoutEffect(() => {
    const from = fromIndex.current, to = activeIndex;
    fromIndex.current = to;
    const end = centre(to);
    if (end === null) return;
    const start = from === to || xRef.current === null ? end : xRef.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (start === end || reduced) { setX(end); bob(0); return; }

    const steps = Math.abs(to - from);
    const duration = 600 + 300 * steps; // ms: 0.9s for one tab over, 1.8s from end to end
    const tabs = tabRefs.current;
    const clearPassing = () => tabs.forEach((t) => t?.removeAttribute("data-passing"));
    bob(duration);
    const t0 = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const x = start + (end - start) * ease(p);
      setX(x);
      // Lift whichever tab the chevron is crossing (not the tab it left or the one it is heading to).
      const nav = tabsRef.current!.getBoundingClientRect();
      tabs.forEach((t, i) => {
        if (!t) return;
        const r = t.getBoundingClientRect();
        const over = x >= r.left - nav.left && x <= r.right - nav.left;
        if (over && i !== to && i !== from && p < 1) t.setAttribute("data-passing", ""); else t.removeAttribute("data-passing");
      });
      if (p < 1) raf = requestAnimationFrame(frame); else clearPassing();
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); clearPassing(); };
  }, [activeIndex]);

  return (
    <div className="cabinet" data-folder={active.c}>
      <nav className="tabs" aria-label="Main" ref={tabsRef}>
        <span className="tab-marker" ref={markerRef} aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
        </span>
        {FOLDERS.map((f, i) => (
          <Link key={f.href} href={f.href} className="tab" data-folder={f.c} ref={(el) => { tabRefs.current[i] = el; }}
            aria-current={i === activeIndex && path === f.href ? "page" : undefined}>
            {TAB_ICONS[f.c]}
            <span className="tab-label"><span className="full">{f.label}</span><span className="mid" aria-hidden="true">{f.mid}</span><span className="short" aria-hidden="true">{f.short}</span></span>
          </Link>
        ))}
      </nav>
      <div className="folder-stack">
        <div className="folder">
          <div className="sheet" id="main">{children}</div>
        </div>
      </div>
    </div>
  );
}
