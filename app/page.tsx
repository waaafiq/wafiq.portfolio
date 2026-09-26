import Link from "next/link";
import Catalog from "@/components/Catalog";
import CopyEmail from "@/components/CopyEmail";
import FileBrowser, { type FileItem } from "@/components/FileBrowser";
import { ResumeButton } from "@/components/Contact";

const files: FileItem[] = [
  {
    href: "/work/erica-nav",
    title: "ERICA Nav",
    text: "Research and design for a campus wayfinding app. Survey of 45 students, statistical analysis, and a prototype.",
    kind: "Case study",
    date: "Spring 2026",
    folder: "erica",
    tags: ["Data analysis", "UX research", "UI design"],
    preview: <EricaPreview />,
  },
  {
    href: "/work/bolahh",
    title: "Bolahh",
    text: "Interface redesign for a live futsal booking and player progression platform.",
    kind: "Redesign",
    date: "Sep 2026",
    folder: "bolahh",
    tags: ["UI design", "Front end"],
    preview: <BolahhPreview />,
  },
  {
    href: "/work/graphic-design",
    title: "Graphic design",
    text: "Logos, icons, stickers and motion graphics.",
    kind: "Visual",
    date: "TODO",
    folder: "graphic",
    tags: ["Branding", "Motion"],
    preview: <span className="todo">TODO: key visual from the owner</span>,
  },
];

export default function Home() {
  return (
    <main className="page">
      <div className="home-top">
        <section className="hero">
          <h1>Hakeem Wafiq</h1>
          <p className="line">Data analyst who designs.</p>
          <p className="lede">I turn research into products people can actually use.</p>
          <div className="btns">
            <a className="btn primary" href="#work">View work</a>
            <ResumeButton />
          </div>
        </section>
        <Catalog
          head={["Hakeem Wafiq", "Portfolio"]}
          rows={[
            ["Study", "Media Technology, Hanyang University ERICA"],
            ["Tracks", "AI & Data Analytics, UI/UX"],
            ["Tools", "Python, Excel, SPSS, Figma, Illustrator, After Effects"],
            ["Email", <CopyEmail key="e" />],
            ["GitHub", <a key="g" href="https://github.com/waaafiq">github.com/waaafiq</a>],
            ["LinkedIn", <span key="l" className="todo">TODO: LinkedIn URL</span>],
          ]}
        />
      </div>

      <section className="doc" id="work">
        <p className="eyebrow">Selected work</p>
        <FileBrowser files={files} />
        <p><Link href="/about">More about me</Link></p>
      </section>
    </main>
  );
}

// Mini version of the ERICA Nav headline chart: rooms vs buildings by group.
function EricaPreview() {
  const b = [33, 53, 67], r = [60, 67, 67];
  return (
    <svg viewBox="0 0 200 130" width="100%">
      <text x="0" y="20" className="val" style={{ fontSize: 22 }}>64%</text>
      <text x="48" y="19" className="axis" style={{ fontSize: 9 }}>had trouble finding the room</text>
      {b.map((v, i) => (
        <g key={i}>
          <rect x={20 + i * 60} y={125 - v} width="18" height={v} rx="2" className="fill-neutral" />
          <rect x={40 + i * 60} y={125 - r[i]} width="18" height={r[i]} rx="2" className="fill-accent" />
        </g>
      ))}
    </svg>
  );
}

function BolahhPreview() {
  return (
    <div className="pcard" style={{ width: 120, cursor: "inherit", transform: "perspective(600px) rotateY(-14deg) rotateX(6deg)" }}>
      <div className="face front"><span className="label" style={{ color: "inherit" }}>Bolahh</span><div className="portrait">Player card</div></div>
    </div>
  );
}
