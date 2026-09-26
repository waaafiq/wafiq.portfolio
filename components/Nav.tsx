"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["/work/erica-nav", "ERICA Nav"],
  ["/work/bolahh", "Bolahh"],
  ["/work/graphic-design", "Graphic design"],
  ["/about", "About"],
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav aria-label="Main">
      {links.map(([href, label]) => (
        <Link key={href} href={href} aria-current={path === href ? "page" : undefined}>{label}</Link>
      ))}
    </nav>
  );
}
