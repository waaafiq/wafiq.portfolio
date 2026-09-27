"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Live products, keyed by case study page.
const LIVE: Record<string, { href: string; name: string }> = {
  "/work/erica-nav": { href: "https://erica-nav.vercel.app", name: "ERICA Nav" },
  "/work/bolahh": { href: "https://bolahh.com", name: "Bolahh" },
};

// Bottom right: a link to the live product on case study pages, and a glass chevron that appears once you have
// scrolled and takes you back to the top.
export default function BackToTop() {
  const live = LIVE[usePathname()];
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const on = () => setShown(window.scrollY > 600);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const top = () => window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  return (
    <div className="float-actions">
      {live && (
        <a className="live-site glass" href={live.href} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${live.name} (opens in a new tab)`}>
          {/* Lucide square-arrow-out-up-right */}
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" /><path d="m21 3-9 9" /><path d="M15 3h6v6" /></svg>
          <span className="live-tip" aria-hidden="true">Visit {live.name}</span>
        </a>
      )}
      <button type="button" className="to-top glass" data-shown={shown || undefined} onClick={top} aria-label="Back to top" tabIndex={shown ? 0 : -1}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m18 15-6-6-6 6" /></svg>
      </button>
    </div>
  );
}
