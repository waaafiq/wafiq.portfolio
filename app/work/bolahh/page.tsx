import type { Metadata } from "next";
import RankCardDemo from "@/components/bolahh/RankCardDemo";
import Catalog from "@/components/Catalog";

export const metadata: Metadata = {
  title: "Bolahh",
  description: "Redesign of a live futsal booking and player progression platform.",
};


export default function Bolahh() {
  return (
    <main className="page read">
      <header className="page-head">
        <span className="sign"><b>UI</b>Redesign</span>
        <h1>Bolahh</h1>
        <p className="lede">Redesign of a live futsal booking and player progression platform.</p>
        <Catalog
          head={["Bolahh", "Sep 2026"]}
          rows={[
            ["Team", "Team of 4"],
            ["Live site", <a key="l" href="https://bolahh.com">bolahh.com</a>],
            ["Disciplines", "UI design, Front end"],
          ]}
        />
      </header>

      <div className="doc-row">
      <section className="doc">
        <p className="eyebrow">What I did</p>
        <ul className="plain">
          <li>Redesigned the player card: a design for each rank tier, a tilt interaction and a flip side showing player stats.</li>
          <li>Designed and built an achievement badge system. Unlock rules live in the database, so admins can change them without a code update.</li>
          <li>Redesigned the landing page and standardised element and text spacing across the site.</li>
        </ul>
      </section>
      <section className="doc">
        <p className="eyebrow">Process</p>
        <p>I designed in Figma, then built the designs in React with Claude Code.</p>
      </section>
      </div>

      <section className="doc">
        <p className="eyebrow">Player identity and badges</p>
        <h2>The player card, in every tier</h2>
        <RankCardDemo />
      </section>

      <section className="doc">
        <p className="eyebrow">Achievement badges</p>
        <h2>A badge system admins can tune without a code change</h2>
        <div className="shot-pair">
          <figure className="shot">
            <img className="doc-img" src="/bolahh/admin-badges.webp" alt="Admin Badges tab: unlock thresholds for Matches Played and MVP Award at common, rare, epic and legend, and rank requirements for Ranked" loading="lazy" />
            <figcaption><strong>Admin Badges tab.</strong> Unlock requirements are stored in the database. Admins set the threshold for each rarity, and the requirement text is generated from the number.</figcaption>
          </figure>
          <figure className="shot">
            <img className="doc-img" src="/bolahh/badge-editor.webp" alt="Player badge editor: unlocked and locked badges for Matches Played, MVP Award and Ranked, with three equipped badges in order" loading="lazy" />
            <figcaption><strong>Player badge editor.</strong> Players pick up to three unlocked badges and set their order. Locked ones show a padlock.</figcaption>
          </figure>
        </div>
      </section>

      <section className="doc duo">
        <p className="eyebrow">Landing page</p>
        <h2>A clearer first screen</h2>
        <ul className="plain">
          <li>Grouped the navigation into one pill bar and added a Player Card link.</li>
          <li>Cut the hero down to one call to action: Check out games now.</li>
          <li>Put the redesigned player card in the hero, with floating achievement badges.</li>
        </ul>
        <img className="doc-img viz" src="/bolahh/landing.webp" alt="The redesigned Bolahh landing page: pill navigation bar, one orange call to action and the gold player card with glowing badges" loading="lazy" />
      </section>
    </main>
  );
}
