import type { Metadata } from "next";
import { LogoSlot, IconSet, StickerBoard, ShortClip } from "@/components/Graphic";
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
            ["Contents", "3 logos, 1 icon set, 1 sticker sheet (optional), 2 After Effects shorts"],
            ["Disciplines", "Branding, Motion"],
            ["Status", <span key="s" className="todo">TODO: final pieces from the owner. Every slot below is a placeholder.</span>],
          ]}
        />
      </header>

      <section className="doc">
        <p className="eyebrow">Logos</p>
        <p>Tap a logo to see it on a sign, a shirt and an app icon.</p>
        <div className="slot-grid">{[1, 2, 3].map((n) => <LogoSlot key={n} n={n} />)}</div>
      </section>

      <section className="doc">
        <p className="eyebrow">Icon set</p>
        <p>Tap an icon to see it at 16, 24 and 48 px.</p>
        <p className="todo">TODO: icon set from the owner. The shapes below are placeholders.</p>
        <IconSet />
      </section>

      <section className="doc">
        <p className="eyebrow">Stickers (optional)</p>
        <p>Pick up a sticker and move it around the board.</p>
        <StickerBoard />
      </section>

      <section className="doc">
        <p className="eyebrow">Motion</p>
        <p>Muted After Effects shorts. Hover or tap to play, and use the slider to scrub.</p>
        <div className="clips"><ShortClip n={1} /><ShortClip n={2} /></div>
      </section>
    </main>
  );
}
