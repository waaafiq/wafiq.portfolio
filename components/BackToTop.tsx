"use client";
import { useEffect, useState } from "react";

// Glass chevron, bottom right, that appears once you have scrolled and takes you back to the top.
export default function BackToTop() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const on = () => setShown(window.scrollY > 600);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const top = () => window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  return (
    <button type="button" className="to-top glass" data-shown={shown || undefined} onClick={top} aria-label="Back to top" tabIndex={shown ? 0 : -1}>
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m18 15-6-6-6 6" /></svg>
    </button>
  );
}
