import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Terms of use", description: "Terms for using this portfolio and its content." };

export default function Terms() {
  return (
    <main className="page read legal">
      <header className="page-head">
        <span className="pill glass">Legal</span>
        <h1>Terms of use.</h1>
        <p className="lede">This is a personal portfolio. You can browse it, link to it and share it. Please ask before reusing the work.</p>
        <p className="note">Effective 27 September 2026</p>
      </header>

      <section className="doc">
        <p className="eyebrow">Who runs this site</p>
        <p>Hakeem Wafiq, a student at Hanyang University ERICA, Republic of Korea. This is not a business and has no registration number. Contact: <a href="mailto:hakeemwafiq04@gmail.com">hakeemwafiq04@gmail.com</a>.</p>
      </section>

      <section className="doc">
        <p className="eyebrow">Ownership</p>
        <p>© 2026 Hakeem Wafiq. The designs, stickers, videos, text and code on this site are mine unless stated otherwise. Don&apos;t copy, sell or republish them without written permission.</p>
        <ul className="plain">
          <li>ERICA Nav began as a team project for the Human-Computer System Design course. The survey data and course presentation belong to the team.</li>
          <li>Bolahh is a live product built by a team of 4. The Bolahh name and platform belong to its owners.</li>
          <li>Fonts are licensed under the SIL Open Font License. Tab icons are Material Symbols by Google (Apache License 2.0). Other icons are from Lucide (ISC License).</li>
        </ul>
      </section>

      <section className="doc">
        <p className="eyebrow">Trademarks and affiliation</p>
        <ul className="plain">
          <li>The Papago and evian ads are student spec work. Naver and Danone did not commission or endorse them. Papago, Naver and evian are trademarks of their owners.</li>
          <li>ERICA Nav is an unofficial student project, not affiliated with or endorsed by Hanyang University.</li>
        </ul>
      </section>

      <section className="doc">
        <p className="eyebrow">Payments and refunds</p>
        <p>Nothing is sold on this site and it takes no payments, so no refund policy applies.</p>
      </section>

      <section className="doc">
        <p className="eyebrow">Accuracy and liability</p>
        <p>The research figures come from a 45-person course survey and are shown as reported, without warranty. Links to other sites are for convenience; I don&apos;t control their content. The laws of the Republic of Korea govern these terms. See the <Link href="/privacy">privacy policy</Link> for how data is handled.</p>
      </section>
    </main>
  );
}
