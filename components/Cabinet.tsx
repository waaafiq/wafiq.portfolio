"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { TAB_ICONS } from "./TabIcons";

// Each page is a folder in the sorter. The active folder's tab comes to the front and its colour fills the file.
export const FOLDERS = [
  { href: "/", label: "Index", mid: "Index", short: "Index", c: "index" },
  { href: "/work/erica-nav", label: "ERICA Nav", mid: "ERICA", short: "ERICA", c: "erica" },
  { href: "/work/bolahh", label: "Bolahh", mid: "Bolahh", short: "Bolahh", c: "bolahh" },
  { href: "/work/graphic-design", label: "Graphic design", mid: "G. Design", short: "Design", c: "graphic" },
  { href: "/about", label: "About", mid: "About", short: "About", c: "about" },
];

export default function Cabinet({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const activeIndex = Math.max(0, FOLDERS.findIndex((f) => f.href === path));
  const active = FOLDERS[activeIndex];
  const [hovered, setHovered] = useState<number | null>(null);
  const target = hovered ?? activeIndex;
  // Peek: the hovered folder's file edge rises behind the open file. Remember the last one so it keeps its colour while sinking.
  const peeking = hovered !== null && hovered !== activeIndex;
  const [peekFolder, setPeekFolder] = useState(active.c);
  useLayoutEffect(() => { if (peeking) setPeekFolder(FOLDERS[hovered].c); }, [peeking, hovered]);

  // Chevron marker: sits above the open tab, slides to whichever tab is hovered or focused, and slides back on leave.
  const tabsRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [x, setX] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  useLayoutEffect(() => {
    const place = () => {
      const t = tabRefs.current[target], nav = tabsRef.current;
      if (!t || !nav) return;
      const r = t.getBoundingClientRect(), n = nav.getBoundingClientRect();
      setX(r.left - n.left + r.width / 2);
    };
    place();
    const ro = new ResizeObserver(place);
    if (tabsRef.current) ro.observe(tabsRef.current);
    document.fonts?.ready.then(place);
    return () => ro.disconnect();
  }, [target]);
  // Enable the glide only after the first placement, so nothing animates on page load.
  useLayoutEffect(() => {
    if (x === null || ready) return;
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [x, ready]);

  return (
    <div className="cabinet" data-folder={active.c}>
      <nav className="tabs" aria-label="Main" ref={tabsRef} onPointerLeave={() => setHovered(null)}>
        {x !== null && (
          <span className="tab-marker" data-ready={ready || undefined} style={{ transform: `translateX(${x}px)` }} aria-hidden="true">
            <svg key={target} viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
          </span>
        )}
        {FOLDERS.map((f, i) => (
          <Link key={f.href} href={f.href} className="tab" data-folder={f.c} ref={(el) => { tabRefs.current[i] = el; }}
            aria-current={i === activeIndex && path === f.href ? "page" : undefined}
            onPointerEnter={() => setHovered(i)} onFocus={() => setHovered(i)} onBlur={() => setHovered(null)}>
            {TAB_ICONS[f.c]}
            <span className="tab-label"><span className="full">{f.label}</span><span className="mid" aria-hidden="true">{f.mid}</span><span className="short" aria-hidden="true">{f.short}</span></span>
          </Link>
        ))}
      </nav>
      <div className="peek-anchor" aria-hidden="true">
        <div className="peek" data-folder={peekFolder} data-on={peeking || undefined} />
      </div>
      <div className="folder">
        <div className="sheet" id="main">{children}</div>
      </div>
    </div>
  );
}
