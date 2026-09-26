import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Atkinson_Hyperlegible, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import Nav from "@/components/Nav";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["500", "700"], variable: "--f-display" });
const body = Atkinson_Hyperlegible({ subsets: ["latin"], weight: ["400", "700"], variable: "--f-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--f-mono" });

export const metadata: Metadata = {
  title: { default: "Hakeem Wafiq, data analyst who designs", template: "%s · Hakeem Wafiq" },
  description: "Portfolio of Hakeem Wafiq, Media Technology student at Hanyang University ERICA. I turn research into products people can actually use.",
};
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F7FA" },
    { media: "(prefers-color-scheme: dark)", color: "#0E1522" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <header className="site-head">
          <Link href="/" className="home-link sign"><b>HW</b>Hakeem Wafiq</Link>
          <Nav />
        </header>
        <div id="main">{children}</div>
        <footer className="site-foot">
          <span>Hakeem Wafiq</span>
          <a href="mailto:hakeemwafiq04@gmail.com">hakeemwafiq04@gmail.com</a>
          <a href="https://github.com/waaafiq">GitHub</a>
        </footer>
      </body>
    </html>
  );
}
