import type { Metadata } from "next";
import { LogoSlot, IconSet, StickerBoard, ShortClip } from "@/components/Graphic";

export const metadata: Metadata = {
  title: "Graphic design",
  description: "Logos, icons, stickers and motion graphics by Hakeem Wafiq.",
};

export default function GraphicDesign() {
  return (
    <main className="page">
      <header className="stack read" style={{ gap: 20, margin: 0 }}>
        <span className="sign"><b>GD</b>Branding · Motion</span>
        <h1>Graphic design</h1>
        <p className="lede">Logos, icons, stickers and motion graphics.</p>
        <p className="todo">TODO: final pieces from the owner. Every slot below is a placeholder.</p>
      </header>

      <section>
        <p className="eyebrow">Logos</p>
        <p>Tap a logo to see it on a sign, a shirt and an app icon.</p>
        <div className="slot-grid">{[1, 2, 3].map((n) => <LogoSlot key={n} n={n} />)}</div>
      </section>

      <section>
        <p className="eyebrow">Icon set</p>
        <p>Tap an icon to see it at 16, 24 and 48 px.</p>
        <p className="todo">TODO: icon set from the owner. The shapes below are placeholders.</p>
        <IconSet />
      </section>

      <section>
        <p className="eyebrow">Stickers (optional)</p>
        <p>Pick up a sticker and move it around the board.</p>
        <StickerBoard />
      </section>

      <section>
        <p className="eyebrow">Motion</p>
        <p>Muted After Effects shorts. Hover or tap to play, and use the slider to scrub.</p>
        <div className="clips"><ShortClip n={1} /><ShortClip n={2} /></div>
      </section>
    </main>
  );
}
