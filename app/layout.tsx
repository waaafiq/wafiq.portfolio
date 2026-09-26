import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans, JetBrains_Mono, Roboto_Mono } from "next/font/google";
import Link from "next/link";
import Cabinet from "@/components/Cabinet";
import BackToTop from "@/components/BackToTop";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["500", "700"], variable: "--f-display" });
const body = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--f-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--f-mono" });
const tabFont = Roboto_Mono({ subsets: ["latin"], weight: ["500", "600"], variable: "--f-tab" });

export const metadata: Metadata = {
  title: { default: "Hakeem Wafiq, data analyst who designs", template: "%s · Hakeem Wafiq" },
  description: "Portfolio of Hakeem Wafiq, Media Technology student at Hanyang University ERICA. I turn research into products people can actually use.",
};
export const viewport: Viewport = { themeColor: "#F4F2EC", colorScheme: "light" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} ${tabFont.variable}`}>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <header className="site-head">
          <Link href="/" className="home-link sign"><b>HW</b>Hakeem Wafiq</Link>
          <span className="label">Data analyst who designs</span>
        </header>
        <Cabinet>{children}</Cabinet>
        <BackToTop />
        <footer className="site-foot">
          <span>Hakeem Wafiq</span>
          <a href="mailto:hakeemwafiq04@gmail.com">hakeemwafiq04@gmail.com</a>
          <a href="https://github.com/waaafiq">GitHub</a>
        </footer>
      </body>
    </html>
  );
}
