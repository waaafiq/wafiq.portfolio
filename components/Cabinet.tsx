"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Each page is a folder in the sorter. The active folder's tab comes to the front and its colour wraps the paper sheet.
export const FOLDERS = [
  { href: "/", label: "Index", short: "Index", c: "index" },
  { href: "/work/erica-nav", label: "ERICA Nav", short: "ERICA", c: "erica" },
  { href: "/work/bolahh", label: "Bolahh", short: "Bolahh", c: "bolahh" },
  { href: "/work/graphic-design", label: "Graphic design", short: "Graphic", c: "graphic" },
  { href: "/about", label: "About", short: "About", c: "about" },
];

export default function Cabinet({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const active = FOLDERS.find((f) => f.href === path) ?? FOLDERS[0];
  return (
    <div className="cabinet" data-folder={active.c}>
      <nav className="tabs" aria-label="Main">
        {FOLDERS.map((f) => (
          <Link key={f.href} href={f.href} className="tab" data-folder={f.c} aria-current={f === active && path === f.href ? "page" : undefined}>
            <span className="tab-label"><span className="full">{f.label}</span><span className="short" aria-hidden="true">{f.short}</span></span>
          </Link>
        ))}
      </nav>
      <div className="folder">
        <div className="sheet" id="main">{children}</div>
      </div>
    </div>
  );
}
