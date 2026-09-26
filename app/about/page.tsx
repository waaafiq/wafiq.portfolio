import type { Metadata } from "next";
import Contact, { ResumeButton } from "@/components/Contact";

export const metadata: Metadata = {
  title: "About",
  description: "Hakeem Wafiq, Media Technology student at Hanyang University ERICA.",
};

export default function About() {
  return (
    <main className="page read">
      <header className="stack" style={{ gap: 20 }}>
        <span className="sign"><b>HW</b>About</span>
        <h1>About</h1>
        <p className="lede">Media Technology student at Hanyang University ERICA, on the AI &amp; Data Analytics and UI/UX tracks.</p>
        <p className="todo">TODO: short bio from the owner</p>
      </header>

      <section>
        <dl className="kv">
          <div><dt>Tools</dt><dd>Python, Excel, SPSS, Figma, Illustrator, After Effects</dd></div>
          <div><dt>Languages</dt><dd>Malay (native), English (fluent), Korean (limited conversational)</dd></div>
        </dl>
      </section>

      <section>
        <p className="eyebrow">Resume</p>
        <div className="btns"><ResumeButton /></div>
      </section>

      <section>
        <p className="eyebrow">Contact</p>
        <Contact />
      </section>
    </main>
  );
}
