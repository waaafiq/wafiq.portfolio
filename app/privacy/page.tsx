import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Privacy policy", description: "What personal data this portfolio handles, and your rights." };

export default function Privacy() {
  return (
    <main className="page read legal">
      <header className="page-head">
        <span className="pill glass">Legal</span>
        <h1>Privacy policy.</h1>
        <p className="lede">This site collects as little as a website can. It has no accounts, no forms, no analytics and no cookies.</p>
        <p className="note">Effective 27 September 2026</p>
      </header>

      <section className="doc">
        <p className="eyebrow">Who runs this site</p>
        <p>Hakeem Wafiq, a student at Hanyang University ERICA in Ansan, Republic of Korea, runs this personal, non-commercial portfolio. It is not a business. Contact: <a href="mailto:hakeemwafiq04@gmail.com">hakeemwafiq04@gmail.com</a>.</p>
      </section>

      <section className="doc">
        <p className="eyebrow">What data is handled</p>
        <h2>When you visit</h2>
        <p>Vercel Inc., the host, receives technical request data from your browser to deliver the pages: IP address, browser type, the page requested and the time. Vercel keeps this in server logs for security and reliability under <a href="https://vercel.com/legal/privacy-policy">its own privacy policy</a>. I don&apos;t use these logs to identify or profile visitors.</p>
        <h2>When you email me</h2>
        <p>If you write to me, I receive your email address and whatever you include. I use it only to reply, and I delete it on request. Gmail (Google) stores the message.</p>
        <h2>What this site doesn&apos;t do</h2>
        <ul className="plain">
          <li>No cookies, local storage or tracking pixels. See the <Link href="/cookies">cookie policy</Link>.</li>
          <li>No analytics, advertising or social media scripts.</li>
          <li>No forms. Fonts, images and videos load from this site, not from third parties.</li>
          <li>No selling or sharing of personal data.</li>
        </ul>
      </section>

      <section className="doc">
        <p className="eyebrow">Your rights</p>
        <p>Under Korea&apos;s Personal Information Protection Act, and the GDPR where it applies, you can ask to see, correct or delete personal data I hold about you. Email me and I will answer within 10 days. You can also complain to the Personal Information Protection Commission (<a href="https://www.pipc.go.kr">pipc.go.kr</a>) or the KISA privacy centre (<a href="https://privacy.kisa.or.kr">privacy.kisa.or.kr</a>, call 118).</p>
      </section>

      <section className="doc">
        <p className="eyebrow">Links and changes</p>
        <p>Links to GitHub, bolahh.com and ERICA Nav lead to sites with their own privacy policies. If this policy changes, the date at the top changes with it.</p>
      </section>
    </main>
  );
}
