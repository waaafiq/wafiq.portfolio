import type { Metadata } from "next";
import RankCardDemo from "@/components/bolahh/RankCardDemo";
import BadgePicker from "@/components/bolahh/BadgePicker";
import Catalog from "@/components/Catalog";
import { Tools } from "@/components/CatalogChips";

export const metadata: Metadata = {
  title: "Bolahh",
  description: "Redesign of a live futsal booking and player progression platform.",
};


export default function Bolahh() {
  return (
    <main className="page read">
      <header className="page-head">
        <span className="pill glass">UI redesign</span>
        <h1>Bolahh.</h1>
        <p className="lede">Redesign of a live futsal booking and player progression platform.</p>
      </header>

      <div className="doc-row">
        <section className="doc">
          <Catalog
            head={["", "Project overview"]}
            rows={[
              ["My role", "UI Design, Frontend"],
              ["Team", "4 people"],
              ["Timeline", "Sep 2026"],
              ["Tools", <Tools key="t" names={["Figma", "React", "Claude Code"]} />],
              ["Live site", <a key="l" href="https://bolahh.com">bolahh.com</a>],
            ]}
          />
          <div className="doc-sub">
          <p className="eyebrow">Contribution</p>
          <ul className="plain">
            <li>Designed and built an achievement badge system. Unlock rules live in the database, so admins can change them without a code update.</li>
            <li>Redesigned the player card: a design for each rank tier, a tilt interaction and a flip side showing player stats.</li>
            <li>Redesigned the landing page and standardised element and text spacing across the site.</li>
          </ul>
          </div>
        </section>
        <section className="doc">
          <p className="eyebrow">Achievement badges</p>
          <h2>The badge system</h2>
          <p>Players unlock badges by playing, then equip up to three and choose their order. Hover or tap a badge to see what unlocks it.</p>
          <div className="bp-stage">
            <BadgePicker />
          </div>
        </section>
      </div>

      <section className="doc">
        <p className="eyebrow">Player card</p>
        <h2>The player card in every tier</h2>
        <p>There are 10 ranks in total. Play games to raise your overall rating (OVR) and climb to the next one.</p>
        <RankCardDemo />
      </section>

      <section className="doc">
        <p className="eyebrow">Landing page</p>
        <h2>A clearer landing page</h2>
        <a className="doc-media" href="/bolahh/landing.webp" target="_blank" rel="noopener" title="Open full size">
        <img className="doc-img" src="/bolahh/landing.webp" width={2400} height={1525} decoding="async" alt="The redesigned Bolahh landing page: pill navigation bar, one orange call to action and the gold player card with glowing badges" loading="lazy" />
        </a>
      </section>
    </main>
  );
}
