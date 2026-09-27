import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Cookie policy", description: "This site sets no cookies." };

export default function Cookies() {
  return (
    <main className="page read legal">
      <header className="page-head">
        <span className="pill glass">Legal</span>
        <h1>Cookie policy.</h1>
        <p className="lede">This site sets no cookies and stores nothing in your browser, so there is no cookie banner to click through.</p>
        <p className="note">Effective 27 September 2026</p>
      </header>

      <section className="doc">
        <p className="eyebrow">What that covers</p>
        <ul className="plain">
          <li>No cookies, first party or third party.</li>
          <li>No local storage, session storage or similar browser storage.</li>
          <li>No analytics, advertising or embedded third-party content that could set its own.</li>
        </ul>
        <p>The stickers on the Graphic Design page reset when you reload, because their positions are never saved.</p>
      </section>

      <section className="doc">
        <p className="eyebrow">If this changes</p>
        <p>If I ever add analytics or anything else that stores data on your device, I will ask for your consent first and update this page. The <Link href="/privacy">privacy policy</Link> covers everything else.</p>
      </section>
    </main>
  );
}
