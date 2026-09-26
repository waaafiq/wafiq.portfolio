import type { Metadata } from "next";
import { LogoSlot, StickerBoard, ShortClip } from "@/components/Graphic";
import Catalog from "@/components/Catalog";

export const metadata: Metadata = {
  title: "Graphic design",
  description: "Logos, icons, stickers and motion graphics by Hakeem Wafiq.",
};

export default function GraphicDesign() {
  return (
    <main className="page">
      <header className="page-head">
        <span className="sign"><b>GD</b>Branding · Motion</span>
        <h1>Graphic design</h1>
        <p className="lede">Logos, icons, stickers and motion graphics.</p>
        <Catalog
          head={["Graphic design", "TODO: date"]}
          rows={[
            ["Contents", "3 logos, 1 sticker sheet (optional), 2 After Effects ads"],
            ["Status", <span key="s" className="todo">TODO: logos and stickers from the owner. Those slots are placeholders.</span>],
          ]}
        />
      </header>

      <section className="doc">
        <p className="eyebrow">Logos</p>
        <p>Tap a logo to see it on a sign, a shirt and an app icon.</p>
        <div className="slot-grid">{[1, 2, 3].map((n) => <LogoSlot key={n} n={n} />)}</div>
      </section>

      <section className="doc">
        <p className="eyebrow">Stickers (optional)</p>
        <p>Pick up a sticker and move it around the board.</p>
        <StickerBoard />
      </section>

      <section className="doc">
        <p className="eyebrow">Motion graphics</p>
        <div className="clips">
          <ShortClip src="/motion/papago.mp4" poster="/motion/papago.jpg" title="Bridging Barriers, Connecting People">
            <span className="label">Midterm project · Apr 2026</span>
            <h3>Bridging Barriers, Connecting People</h3>
            <p>A 50-second spec ad for Papago, Naver&apos;s translation app. Two strangers bump into each other in a park and can&apos;t understand each other&apos;s language until the Papago parrot lands on his head and translates. The slogan reads 「장벽을 잇고, 사람을 연결하다」.</p>
            <p className="note">Student concept, not commissioned by Naver<br />Storyboarded in 9 cuts, animated in After Effects</p>
          </ShortClip>
          <ShortClip src="/motion/evian.mp4" poster="/motion/evian.jpg" title="A Journey Through Nature's Purity" ratio="4 / 3">
            <span className="label">Final project · Jun 2026</span>
            <h3>A Journey Through Nature&apos;s Purity</h3>
            <p>A 56-second spec ad for evian. A letter addressed to the source in Évian-les-Bains opens into the water&apos;s path: rain and snow on the French Alps, 15 years filtering through glacial rock, a clear river, and finally the bottle, marking evian&apos;s 200 years (1826 to 2026).</p>
            <p className="note">Student concept, not commissioned by evian<br />Storyboarded in 8 cuts, animated in After Effects</p>
          </ShortClip>
        </div>
      </section>
    </main>
  );
}
