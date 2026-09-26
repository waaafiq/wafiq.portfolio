import type { Metadata } from "next";
import Catalog from "@/components/Catalog";
import CopyEmail from "@/components/CopyEmail";
import { ResumeButton } from "@/components/Contact";

export const metadata: Metadata = {
  title: "About",
  description: "Hakeem Wafiq, Media Technology student at Hanyang University ERICA.",
};

export default function About() {
  return (
    <main className="page read">
      <header className="page-head">
        <h1>About</h1>
        <p className="lede">Media Technology student at Hanyang University ERICA, on the AI &amp; Data Analytics and UI/UX tracks.</p>
        <Catalog
          head={["Hakeem Wafiq", "Hanyang ERICA"]}
          rows={[
            ["Study", "Media Technology"],
            ["Tracks", "AI & Data Analytics, UI/UX"],
            ["Tools", "Python, Excel, SPSS, Figma, Illustrator, After Effects"],
            ["Languages", "Malay (native), English (fluent), Korean (limited conversational)"],
            ["Resume", <ResumeButton key="r" />],
            ["Email", <CopyEmail key="e" />],
            ["GitHub", <a key="g" href="https://github.com/waaafiq">github.com/waaafiq</a>],
            ["LinkedIn", <span key="l" className="todo">TODO: LinkedIn URL</span>],
          ]}
        />
      </header>

      <section className="doc">
        <p className="eyebrow">Bio</p>
        <p className="todo">TODO: short bio from the owner</p>
      </section>
    </main>
  );
}
