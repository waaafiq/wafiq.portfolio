import type { Metadata, Viewport } from "next";
import { Zalando_Sans_Expanded, Plus_Jakarta_Sans, Figtree, Playfair_Display } from "next/font/google";
import Link from "next/link";
import Cabinet from "@/components/Cabinet";
import BackToTop from "@/components/BackToTop";
// import HandCursor from "@/components/HandCursor";
import "./globals.css";

const display = Zalando_Sans_Expanded({ subsets: ["latin"], weight: ["500", "700"], variable: "--f-display" });
const body = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--f-body" });
// Labels and tab names share Figtree
// Italic serif for the "portfolio" tab only
const serif = Playfair_Display({ subsets: ["latin"], weight: "500", style: "italic", variable: "--f-serif" });
const mono = Figtree({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--f-mono" });

export const metadata: Metadata = {
  title: { default: "Hakeem Wafiq · Portfolio", template: "%s · Hakeem Wafiq" },
  description: "Portfolio of Hakeem Wafiq (Waaafiq), Media Technology student at Hanyang University ERICA: campus wayfinding research, a futsal platform redesign and graphic design.",
};
export const viewport: Viewport = { themeColor: "#F4F2EC", colorScheme: "light" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} ${serif.variable}`}>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <Cabinet>{children}</Cabinet>
        <BackToTop />
        {/* <HandCursor /> */}
        <footer className="site-foot">
          <span>© 2026 Hakeem Wafiq</span>
          <a href="mailto:hakeemwafiq04@gmail.com">hakeemwafiq04@gmail.com</a>
          <a href="https://github.com/waaafiq">GitHub</a>
          <nav className="legal-links" aria-label="Legal">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/cookies">Cookies</Link>
          </nav>
        </footer>
      </body>
    </html>
  );
}
