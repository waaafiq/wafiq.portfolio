import Link from "next/link";
import Contact, { ResumeButton } from "@/components/Contact";

const work = [
  {
    href: "/work/erica-nav",
    title: "ERICA Nav",
    folder: "erica",
    tab: "01 · Case study",
    text: "Research and design for a campus wayfinding app. Survey of 45 students, statistical analysis, and a prototype.",
    tags: ["Data analysis", "UX research", "UI design"],
    preview: <EricaPreview />,
  },
  {
    href: "/work/bolahh",
    title: "Bolahh",
    folder: "bolahh",
    tab: "02 · Redesign",
    text: "Interface redesign for a live futsal booking and player progression platform.",
    tags: ["UI design", "Front end"],
    preview: <BolahhPreview />,
  },
  {
    href: "/work/graphic-design",
    title: "Graphic design",
    folder: "graphic",
    tab: "03 · Visual",
    text: "Logos, icons, stickers and motion graphics.",
    tags: ["Branding", "Motion"],
    preview: <span className="todo">TODO: key visual from the owner</span>,
  },
];

export default function Home() {
  return (
    <main className="page">
      <section className="hero">
        <span className="sign"><b>HW</b>Portfolio</span>
        <h1>Hakeem Wafiq</h1>
        <p className="line">Data analyst who designs.</p>
        <p className="lede">I turn research into products people can actually use.</p>
        <div className="btns">
          <a className="btn primary" href="#work">View work</a>
          <ResumeButton />
        </div>
      </section>

      <section id="work" aria-labelledby="work-h">
        <p className="eyebrow" id="work-h">Selected work</p>
        <div className="work-list">
          {work.map((w) => (
            <Link key={w.href} href={w.href} className="work-card" data-folder={w.folder}>
              <span className="file-tab" aria-hidden="true">{w.tab}</span>
              <div className="body">
                <h2>{w.title}</h2>
                <p>{w.text}</p>
                <ul className="tags" aria-label="Tags">{w.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                <span className="go" aria-hidden="true">View project →</span>
              </div>
              <div className="preview" aria-hidden="true">{w.preview}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="split">
        <div className="stack">
          <p className="eyebrow">About</p>
          <p>Media Technology at Hanyang University ERICA, on the AI &amp; Data Analytics and UI/UX tracks.</p>
          <dl className="kv"><div><dt>Tools</dt><dd>Python, Excel, SPSS, Figma, Illustrator, After Effects</dd></div></dl>
          <p><Link href="/about">More about me</Link></p>
        </div>
        <div className="stack">
          <p className="eyebrow">Contact</p>
          <Contact />
        </div>
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
