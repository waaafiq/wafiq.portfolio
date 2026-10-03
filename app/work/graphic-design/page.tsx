import type { Metadata } from "next";
import { Outfit, Montserrat } from "next/font/google";
import { StickerBoard, ShortClip } from "@/components/Graphic";
import BrandGuide, { BOODAK } from "@/components/boodak/BrandGuide";
import KastelGuide from "@/components/kastel/KastelGuide";
import Catalog from "@/components/Catalog";
import { Tools } from "@/components/CatalogChips";

// Boodak Studio's brand face, scoped to the logo section
const outfit = Outfit({ subsets: ["latin"], weight: ["600"], variable: "--f-brand" });
// Kastel's typeface, for its subtitle and type specimen
const montserrat = Montserrat({ subsets: ["latin"], weight: ["600"], variable: "--f-km" });

export const metadata: Metadata = {
  title: "Graphic Design",
  description: "Flower stickers, a photo studio brand identity and After Effects spec ads by Hakeem Wafiq.",
};

export default function GraphicDesign() {
  return (
    <main className="page">
      <header className="page-head note-left">
        <span className="pill glass">Illustration</span>
        <h1>Graphic Design.</h1>
        <p className="lede">A collection of designs I&apos;ve made.</p>
        <Catalog head={["", "Toolkit"]} rows={[["Tools", <Tools key="t" names={["Illustrator", "After Effects", "Procreate", "Affinity", "Canva"]} />]]} />
      </header>

      <section className="doc">
        <p className="eyebrow">Stickers</p>
        <p>Drag a flower out of the box and stick it anywhere on the page.</p>
        <StickerBoard />
      </section>

      <section className={`doc ${outfit.variable}`}>
        <p className="eyebrow">Branding</p>
        <BrandGuide brand={BOODAK} />
      </section>

      <section className={`doc ${montserrat.variable}`}>
        <p className="eyebrow">Branding</p>
        <KastelGuide name="Kastel" concept="Kastel, short for Karnival Sukan Telekom Malaysia, is TM's annual sports carnival. Its mark shows three people forming a trophy: the trophy stands for competition, the people for togetherness, and the signal wave above them for TM." />
      </section>

      <section className="doc">
        <p className="eyebrow">Motion graphics</p>
        <div className="clips">
          <ShortClip src="/motion/papago.mp4" poster="/motion/papago.jpg" title="Bridging Barriers, Connecting People">
            <span className="label">Midterm project · Apr 2026</span>
            <h3>Bridging Barriers, Connecting People</h3>
            <p>A spec ad for Papago, Naver&apos;s translation app. Two strangers bump into each other in a park and can&apos;t understand each other&apos;s language until the Papago parrot lands on his head and translates. The slogan reads 「장벽을 잇고, 사람을 연결하다」.</p>
          </ShortClip>
          <ShortClip src="/motion/evian.mp4" poster="/motion/evian.jpg" title="A Journey Through Nature's Purity" ratio="4 / 3">
            <span className="label">Final project · Jun 2026</span>
            <h3>A Journey Through Nature&apos;s Purity</h3>
            <p>A spec ad for evian. A letter addressed to the source in Évian-les-Bains opens into the water&apos;s path: rain and snow on the French Alps, 15 years filtering through glacial rock, a clear river, and finally the bottle, marking evian&apos;s 200 years (1826 to 2026).</p>
          </ShortClip>
        </div>
      </section>
    </main>
  );
}
