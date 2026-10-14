import { Langs } from "@/components/CatalogChips";
import Catalog from "@/components/Catalog";
import Cutouts from "@/components/Cutouts";
import FileBrowser, { type FileItem } from "@/components/FileBrowser";
import { Silkscreen, VT323, JetBrains_Mono, Abril_Fatface, Bungee_Shade, Monoton, Rubik_Mono_One } from "next/font/google";
import "@/components/bolahh/bolahh-fonts.css"; // Bebas Neue, DM Sans, Space Mono for the cut-out letters

// Extra fonts for the cut-out letters only, so they load on this page alone
const pixel = Silkscreen({ subsets: ["latin"], weight: "700", variable: "--co-pixel" });
const term = VT323({ subsets: ["latin"], weight: "400", variable: "--co-term" });
const code = JetBrains_Mono({ subsets: ["latin"], weight: "800", variable: "--co-code" });
const fat = Abril_Fatface({ subsets: ["latin"], weight: "400", variable: "--co-fat" });
const shade = Bungee_Shade({ subsets: ["latin"], weight: "400", variable: "--co-shade" });
const neon = Monoton({ subsets: ["latin"], weight: "400", variable: "--co-neon" });
const block = Rubik_Mono_One({ subsets: ["latin"], weight: "400", variable: "--co-block" });
const coFonts = [pixel, term, code, fat, shade, neon, block].map(f => f.variable).join(" ");


const files: FileItem[] = [
  {
    href: "/work/erica-nav",
    title: "ERICA Nav",
    text: "Why students get lost on campus: a survey of 45 students, the statistics behind it and the app requirements it led to.",
    kind: "Case study",
    date: "Spring 2026",
    folder: "erica",
    tags: ["Data analysis", "UX research", "UI design"],
  },
  {
    href: "/work/bolahh",
    title: "Bolahh",
    text: "Redesign of a live futsal booking platform: player cards, an achievement badge system and the landing page.",
    kind: "Redesign",
    date: "Sep 2026",
    folder: "bolahh",
    tags: ["UI design", "Frontend"],
  },
  {
    href: "/work/graphic-design",
    title: "Graphic Design",
    text: "Brand identities for a photo studio and a sports carnival, and two After Effects spec ads.",
    kind: "Collection",
    date: "2026",
    folder: "graphic",
    tags: ["Branding", "Illustration", "Motion"],
  },
];

export default function Home() {
  return (
    <main className="page">
      <header className="page-head">
        <span className="pill glass">Introduction</span>
        <h1>Hello!<br /><span lang="ms" className={`cutouts ${coFonts}`} aria-label="Apa Khabar?"><Cutouts /></span></h1>
        <p className="lede">I&apos;m Wafiq, a Media Technology student from Malaysia who loves data analytics and UI/UX design.</p>
        <Catalog
          head={["", "About me"]}
          rows={[
            ["Institution", "Hanyang University ERICA"],
            ["Tracks", "AI & Data Analytics, UI/UX"],
            ["Languages", <Langs key="l" items={[["BM", "Malay · Native", "ms"], ["EN", "English · Fluent", "en"], ["한", "Korean · Limited Conversational", "ko"]]} />],
            ["Email", <a key="e" href="mailto:hakeemwafiq04@gmail.com">hakeemwafiq04@gmail.com</a>],
            ["GitHub", <a key="g" href="https://github.com/waaafiq">github.com/waaafiq</a>],
          ]}
        />
      </header>

      <section className="doc" id="work">
        <p className="eyebrow">Project index</p>
        <FileBrowser files={files} />
      </section>
    </main>
  );
}
