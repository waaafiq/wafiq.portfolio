import type { Metadata } from "next";
import PlayerCard from "@/components/PlayerCard";
import Compare from "@/components/Compare";
import Catalog from "@/components/Catalog";

export const metadata: Metadata = {
  title: "Bolahh",
  description: "Redesign of a live futsal booking and player progression platform.",
};

const todo = (what: string) => <span className="todo">TODO: {what} image from the owner</span>;

export default function Bolahh() {
  return (
    <main className="page read">
      <header className="page-head">
        <span className="sign"><b>UI</b>Redesign · Sep 2026</span>
        <h1>Bolahh</h1>
        <p className="lede">Redesign of a live futsal booking and player progression platform.</p>
        <Catalog
          head={["Bolahh", "Sep 2026"]}
          rows={[
            ["Project", "Interface redesign"],
            ["Live site", <a key="l" href="https://bolahh.com">bolahh.com</a>],
            ["Disciplines", "UI design, Front end"],
            ["Tools", "Figma, AI-assisted development tools"],
          ]}
        />
      </header>

      <section className="doc">
        <p className="eyebrow">What I did</p>
        <ul className="plain">
          <li>Redesigned the player cards, adding spin and tilt interactions.</li>
          <li>Renewed the landing screen.</li>
          <li>Fixed spacing and visual hierarchy across the interface.</li>
        </ul>
      </section>

      <section className="doc">
        <p className="eyebrow">Try it</p>
        <h2>A player card you can spin</h2>
        <p>Drag the card to spin it, or tilt it by moving your pointer over it. Let go and it settles back.</p>
        <PlayerCard />
      </section>

      <section className="doc">
        <p className="eyebrow">Before and after</p>
        <h2>Landing screen</h2>
        <Compare label="Landing screen" before={todo("before landing screen")} after={todo("after landing screen")} />
        <h2 style={{ marginTop: "var(--s5)" }}>Player cards</h2>
        <Compare label="Player cards" before={todo("before player card")} after={todo("after player card")} />
      </section>

      <section className="doc">
        <p className="eyebrow">Process</p>
        <p>I roughed out the designs in Figma, then built them in code with AI-assisted development tools.</p>
      </section>
    </main>
  );
}
