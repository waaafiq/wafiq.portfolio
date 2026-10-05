"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { TAB_ICONS } from "./TabIcons";
import { confetti } from "./confetti";

// Each page is a folder in the sorter. The active folder's tab comes to the front and its colour fills the file.
// Order on screen, left to right: Index last (Index always shows its name as the rightmost tab).
export const FOLDERS = [
  { href: "/work/graphic-design", label: "Design", mid: "Design", short: "Design", c: "graphic" },
  { href: "/work/bolahh", label: "Bolahh", mid: "Bolahh", short: "Bolahh", c: "bolahh" },
  { href: "/work/erica-nav", label: "ERICA Nav", mid: "ERICA", short: "ERICA", c: "erica" },
  { href: "/", label: "Index", mid: "Index", short: "Index", c: "index" },
];

// Strong ease-in-out: slow start, quick through the middle, soft landing.
const ease = (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);

// Lucide "sparkle"
const SPARK = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" /></svg>;

export default function Cabinet({ children, footer }: { children: React.ReactNode; footer: React.ReactNode }) {
  const path = usePathname();
  // Paths without their own folder (404s) are filed under Index.
  const found = FOLDERS.findIndex((f) => f.href === path);
  const activeIndex = found < 0 ? FOLDERS.length - 1 : found;
  const active = FOLDERS[activeIndex];

  // Chevron marker: rests on the open tab. When the open folder changes it slides from the old tab to the new one,
  // lifting each tab it passes over. Driven imperatively so the slide never re-renders the page.
  const tabsRef = useRef<HTMLElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const fromIndex = useRef(activeIndex);
  const xRef = useRef<number | null>(null);

  // While the chevron visits a right-hand tab (name or sparkle), it points there instead of at the open folder.
  const visiting = useRef<HTMLElement | null>(null);
  const centre = (i: number) => {
    const t = visiting.current ?? tabRefs.current[i], nav = tabsRef.current;
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

  // Stacked tabs (hover-capable screens 701px and up), like real folder tabs: every tab keeps its full length and name,
  // and tabs overlap so each name is tucked under the tab to its right, leaving only the icon strip showing. Stacking
  // order never changes (each tab sits over its left neighbour, under its right one). Opening a tab, by hover, focus or
  // choosing its folder, slides the tabs to its right away to uncover it; GSAP animates each tab's overlap.
  const hoverIndex = useRef<number | null>(null);
  const sliding = useRef(false);
  const activeRef = useRef(activeIndex);
  const stackRef = useRef<(animate: boolean) => void>(() => {});
  const stackOn = useRef(false);
  useLayoutEffect(() => {
    const nav = tabsRef.current;
    if (!nav) return;
    const mq = matchMedia("(min-width: 701px) and (hover: hover)");
    const REVEAL = 60; // visible strip of a tucked tab: shoulder, icon and a little breathing room
    const OPEN_GAP = -4; // an uncovered tab's shoulder just meets the next tab
    let full: number[] = [];
    const tabs = () => tabRefs.current.filter(Boolean) as HTMLAnchorElement[];
    const measure = () => {
      const list = tabs();
      gsap.set(list[list.length - 1], { clearProps: "width" });
      full = list.map((t) => Math.ceil(t.getBoundingClientRect().width));
      // The last tab is never covered, so it must be wide enough to hide the tucked tab before it.
      const last = list.length - 1, need = full[last - 1] - REVEAL + 8;
      if (need > full[last]) { gsap.set(list[last], { width: need }); full[last] = need; }
    };
    const apply = (animate: boolean) => {
      if (!stackOn.current) return;
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const list = tabs();
      list.forEach((t, i) => {
        const open = i === activeRef.current || i === hoverIndex.current || i === list.length - 1;
        gsap.to(t, {
          marginRight: i === list.length - 1 ? 0 : open ? OPEN_GAP : REVEAL - full[i],
          duration: animate && !reduced ? 0.5 : 0, ease: "power3.inOut", overwrite: "auto",
          onUpdate: () => { if (!sliding.current) { const x = centre(activeRef.current); if (x !== null) setX(x); } },
        });
        // A tucked tab's name would peek out past its icon, so it fades while covered and back in as it is uncovered.
        const label = t.querySelector(".tab-label");
        // overwrite: true also cancels a fade-in still waiting out its delay; "auto" only stops running tweens, so a quick
        // hover-and-leave let the delayed fade-in start after the fade-out and left the name showing on a tucked tab.
        if (label) gsap.to(label, { opacity: open ? 1 : 0, duration: animate && !reduced ? (open ? 0.3 : 0.15) : 0, delay: open && animate ? 0.15 : 0, overwrite: true });
        t.toggleAttribute("data-open", open);
      });
    };
    const setup = () => {
      stackOn.current = mq.matches;
      if (mq.matches) { nav.setAttribute("data-stack", ""); measure(); apply(false); }
      else { nav.removeAttribute("data-stack"); gsap.set(tabs(), { clearProps: "marginRight,top,width" }); gsap.set(tabs().map((t) => t.querySelector(".tab-label")), { clearProps: "opacity" }); }
      const x = centre(activeRef.current); if (x !== null) setX(x);
    };
    stackRef.current = apply;
    setup();
    document.fonts?.ready.then(setup);
    mq.addEventListener("change", setup);
    return () => { mq.removeEventListener("change", setup); gsap.killTweensOf(tabs()); };
  }, []);

  // Changing folder: the tabs in front slide aside to uncover the new one; the old one is covered again as its
  // neighbours slide back. Runs alongside the chevron slide.
  useLayoutEffect(() => {
    const prev = activeRef.current;
    activeRef.current = activeIndex;
    if (prev === activeIndex) return;
    stackRef.current(true);
  }, [activeIndex]);

  // A tab counts as hovered only when the mouse really moves over it. Tabs sliding under a still cursor (after a click,
  // or while others open) must not open them, so layout-driven pointerenter events are ignored.
  const hover = (i: number | null) => {
    if (hoverIndex.current === i) return;
    hoverIndex.current = i;
    tabRefs.current.forEach((t, k) => t?.toggleAttribute("data-hover", k === i));
    stackRef.current(true);
  };
  const onNavMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || (e.movementX === 0 && e.movementY === 0)) return;
    const el = (e.target as HTMLElement).closest(".tab");
    hover(el ? tabRefs.current.indexOf(el as HTMLAnchorElement) : null);
  };

  // Slide on folder change.
  useLayoutEffect(() => {
    visiting.current = null;
    clearTimeout(visitTimer.current);
    glideId.current++; // stop any visit glide mid-flight
    const from = fromIndex.current, to = activeIndex;
    fromIndex.current = to;
    const end = centre(to);
    if (end === null) return;
    const start = from === to || xRef.current === null ? end : xRef.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (start === end || reduced) { setX(end); bob(0); return; }

    const steps = Math.abs(to - from);
    const duration = 600 + 300 * steps; // ms: 0.9s for one tab over, 1.8s from end to end
    // The chosen tab stays raised (as it was under the pointer) until the chevron reaches it, then settles.
    const arriving = tabRefs.current[to];
    arriving?.setAttribute("data-arriving", "");
    const tabs = tabRefs.current;
    const clearPassing = () => tabs.forEach((t) => t?.removeAttribute("data-passing"));
    bob(duration);
    sliding.current = true;
    const t0 = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const x = start + ((centre(to) ?? end) - start) * ease(p); // the target tab may be widening, so track it live
      setX(x);
      // Lift whichever tab the chevron is crossing (not the tab it left or the one it is heading to). Tabs overlap, each
      // sitting over its left neighbour, so the one under the chevron is the rightmost whose box contains it. That way
      // each tab drops as soon as the chevron moves onto the next, one after another, like an accordion.
      const nav = tabsRef.current!.getBoundingClientRect();
      let under = -1;
      tabs.forEach((t, i) => {
        const r = t?.getBoundingClientRect();
        if (r && x >= r.left - nav.left && x <= r.right - nav.left) under = i;
      });
      tabs.forEach((t, i) => {
        if (i === under && i !== to && i !== from && p < 1) t?.setAttribute("data-passing", ""); else t?.removeAttribute("data-passing");
      });
      if (p < 1) raf = requestAnimationFrame(frame); else { clearPassing(); sliding.current = false; arriving?.removeAttribute("data-arriving"); }
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); clearPassing(); sliding.current = false; arriving?.removeAttribute("data-arriving"); };
  }, [activeIndex]);

  // Landing on the Index: the portfolio, name and sparkle tabs rise one after another like an accordion (each drops as the next rises).
  useLayoutEffect(() => {
    if (path !== "/" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const me = [...(tabsRef.current?.querySelectorAll(".tab-me") ?? [])];
    const steps = me.flatMap((t, i): [number, () => void][] => [
      [500 + i * 160, () => t.setAttribute("data-passing", "")],
      [500 + (i + 1) * 160 + (i === me.length - 1 ? 350 : 0), () => t.removeAttribute("data-passing")], // the sparkle stays up for its spin
    ]);
    const timers = steps.map(([ms, fn]) => setTimeout(fn, ms));
    return () => { timers.forEach(clearTimeout); me.forEach((t) => t.removeAttribute("data-passing")); };
  }, []);

  // Slide the chevron over to a right-hand tab, run `then` when it lands, and after a pause slide it home to the
  // open folder. Same ease as a folder change.
  const visitTimer = useRef(0);
  const glideId = useRef(0);
  const glide = (to: () => number | null, ms: number, done?: () => void) => {
    const start = xRef.current, t0 = performance.now(), id = ++glideId.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frame = (now: number) => {
      const end = to(), p = reduced ? 1 : Math.min(1, (now - t0) / ms);
      if (end === null || id !== glideId.current) return;
      setX(start === null ? end : start + (end - start) * ease(p));
      if (p < 1) requestAnimationFrame(frame); else { bob(0); done?.(); }
    };
    requestAnimationFrame(frame);
  };
  const visit = (el: HTMLElement, then?: () => void) => {
    clearTimeout(visitTimer.current);
    visiting.current = el;
    sliding.current = true;
    glide(() => centre(activeIndex), 700, () => {
      sliding.current = false;
      then?.();
      visitTimer.current = window.setTimeout(() => {
        visiting.current = null;
        sliding.current = true;
        glide(() => centre(activeIndex), 700, () => { sliding.current = false; });
      }, 2200);
    });
  };

  return (
    <div className="cabinet" data-folder={active.c}>
      {/* Narrow screens: the portfolio / name / sparkle tabs don't fit beside the folder tabs, so they sit above as plain text */}
      <div className="me-bar">
        <span className="me-folio">portfolio</span>
        <span className="me-name">by <b>Hakeem Wafiq</b></span>
        <button type="button" className="me-spark" aria-label="Throw confetti" onClick={(e) => confetti(e.currentTarget)}>{SPARK}</button>
      </div>
      <nav className="tabs" aria-label="Main" ref={tabsRef} onPointerMove={onNavMove} onPointerLeave={() => hover(null)}>
        <span className="tab-marker" ref={markerRef} aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
        </span>
        {FOLDERS.map((f, i) => (
          <Link key={f.href} href={f.href} className="tab" data-folder={f.c} ref={(el) => { tabRefs.current[i] = el; }}
            aria-current={i === activeIndex && path === f.href ? "page" : undefined}
            onFocus={(e) => e.currentTarget.matches(":focus-visible") && hover(i)} onBlur={() => hover(null)}>
            {TAB_ICONS[f.c]}
            <span className="tab-label"><span className="full">{f.label}</span><span className="mid" aria-hidden="true">{f.mid}</span><span className="short" aria-hidden="true">{f.short}</span></span>
          </Link>
        ))}
        {/* Three tabs filed at the far right: a "portfolio" label, a name tag, and a sparkle that throws confetti. Neither is a folder; the
            chevron just pays them a visit. */}
        <button type="button" className="tab tab-me tab-folio" data-folder="folio" onClick={(e) => visit(e.currentTarget)}>
          <span className="tab-label">portfolio</span>
        </button>
        <button type="button" className="tab tab-me tab-name" data-folder="name" onClick={(e) => visit(e.currentTarget)}>
          <span className="tab-label">by <b>Hakeem Wafiq</b></span>
        </button>
        <button type="button" className="tab tab-me tab-spark" data-folder="spark" aria-label="Throw confetti"
          onClick={(e) => { const el = e.currentTarget; visit(el, () => confetti(el)); }}>
          {SPARK}
        </button>
      </nav>
      <div className="folder-stack">
        <div className="folder">
          <div className="sheet" id="main">{children}<div className="foot-in">{footer}</div></div>
        </div>
      </div>
      {/* Wide screens show the footer under the folder; narrow screens show the copy inside it (CSS picks one) */}
      <div className="foot-out">{footer}</div>
    </div>
  );
}
