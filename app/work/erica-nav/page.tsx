import type { Metadata } from "next";
import { VChart, HChart, CountUp } from "@/components/Charts";
import Respondents from "@/components/Respondents";
import Catalog from "@/components/Catalog";
import { Tools } from "@/components/CatalogChips";
import { REQ_ICONS } from "@/components/ReqIcons";

// Finding to requirement to feature, one column per requirement (numbers from section 7 of the brief).
type Req = { icon: keyof typeof REQ_ICONS; name: string; need: string; finding: React.ReactNode | React.ReactNode[]; response: React.ReactNode | React.ReactNode[]; later?: boolean };
const REQS: Req[] = [
  { icon: "search", name: "Multilingual search", need: "Search by English name, Korean name or building number",
    finding: [<><span className="n">56%</span> couldn&apos;t search by building number</>, <>Naver Map rated <span className="n">2.75/5</span> by non-Korean readers</>],
    response: <>Search by number or name with an EN / <span lang="ko">한</span> toggle</> },
  { icon: "map", name: "Building number and map integration", need: "Connect the timetable to the map",
    finding: [<><span className="n">49%</span> couldn&apos;t match timetable numbers to the map</>, <><span className="n">89%</span> struggled most in the first weeks</>],
    response: ["Personal timetable", "Turn-by-turn routes", "Campus shuttle schedule"] },
  { icon: "eye", name: "Visual building identification", need: "Help students confirm they are at the right place",
    finding: <>Only <span className="n">15 of 45</span> rated campus signs clear</>,
    response: <>Building photos on the map</> },
  { icon: "indoor", name: "Indoor wayfinding", need: "Guide students past the front door", later: true,
    finding: [<><span className="n">64%</span> struggled to find rooms</>, <><span className="n">40%</span> said directions stop at the building</>],
    response: <>Not planned yet: floor maps are a much larger build, so they come after the core app</> },
];
// Several points read as a bulleted list, a single one as a sentence.
const points = (x: React.ReactNode | React.ReactNode[]) =>
  Array.isArray(x) ? <ul className="plain">{x.map((n, i) => <li key={i}>{n}</li>)}</ul> : <p>{x}</p>;
import SectionIndex from "@/components/SectionIndex";

const SECTIONS = [
  { id: "question", label: "The question" },
  { id: "key", label: "Key finding" },
  { id: "method", label: "Method" },
  { id: "f1", label: "Room vs building" },
  { id: "f2", label: "The Naver Map gap" },
  { id: "f3", label: "Building numbers" },
  { id: "f4", label: "The first weeks" },
  { id: "design", label: "From data to design" },
  { id: "validation", label: "Validation" },
  { id: "reflection", label: "Reflection" },
];

export const metadata: Metadata = {
  title: "ERICA Nav research",
  description: "A survey of 45 Hanyang ERICA students on campus wayfinding, and the requirements it produced for the ERICA Nav app.",
};

// Every number on this page comes from section 7 of PORTFOLIO_BRIEF.md.
const groups = ["Native\nKorean", "Some\nKorean", "No\nKorean"];
const g = (i: number) => groups[i].replace("\n", " ");
const pct = (n: number, of: number) => (n / of) * 100;

const building = [5, 8, 10], room = [9, 10, 10];
const naver = [4.39, 3.56, 2.75];

const problems = [
  { label: "Can't search by\nbuilding number", n: 25, hi: true },
  { label: "Can't match timetable\nnumber to the map", n: 22, hi: true },
  { label: "Directions stop at the\nbuilding, not the room", n: 18 },
  { label: "Can't find the entrance\nor floor", n: 10 },
  { label: "Other", n: 5 },
];
const situations = [
  { label: "First weeks of\nthe semester", n: 40, hi: true },
  { label: "Visiting a building\nfor the first time", n: 32, hi: true },
  { label: "Unfamiliar\nbuilding name", n: 14 },
  { label: "Other", n: 4 },
];
const of45 = (rows: { label: string; n: number; hi?: boolean }[]) =>
  rows.map((r) => ({
    label: r.label,
    hi: r.hi,
    value: pct(r.n, 45),
    text: `${Math.round(pct(r.n, 45))}%`,
    tip: `${r.label.replace("\n", " ")}: ${r.n} of 45 (${Math.round(pct(r.n, 45))}%)`,
  }));

const validation = [
  ["Usability", "4.03", "4.27", "4.31"],
  ["Usefulness", "4.16", "4.34", "4.57"],
  ["Satisfaction", "4.44", "4.37", "4.56"],
];

export default function EricaNav() {
  return (
    <main className="page read">
      <header className="page-head">
        <span className="pill glass">Data analysis · Campus wayfinding</span>
        <h1>Why do students get lost on campus?</h1>
        <p className="lede"><strong>We surveyed 45 Hanyang ERICA students.</strong><br />56% couldn&apos;t search for a building by its number, and Naver Map, the app most of them use, worked far worse for students who don&apos;t read Korean.</p>
        <Catalog
          head={["", "Project overview"]}
          rows={[
            ["Module", "Human-Computer System Design"],
            ["My role", "Survey Design, Analysis, Presentation"],
            ["Team", "5 people"],
            ["Timeline", "Spring 2026"],
            ["Methods", "Survey, chi-square test, binomial test, ANOVA"],
            ["Tools", <Tools key="t" names={["Google Forms", "Excel", "IBM SPSS"]} />],
            ["Live site", <a key="l" href="https://erica-nav.vercel.app">erica-nav.vercel.app</a>],
          ]}
        />
      </header>

      <section className="doc duo" id="question">
        <p className="eyebrow">The question</p>
        <h2>Does knowing Korean influence your ERICA wayfinding experience?</h2>
        <p className="viz">ERICA timetables list classes only by building and room number, and popular map apps are built for streets, not campuses. We wanted to find where students lose their way, and whether international students struggle more.</p>
      </section>

      <section className="doc duo" id="key">
        <p className="eyebrow">Key finding</p>
        <div className="keyfig">
          <div className="num"><CountUp to={64} /><small>%</small></div>
          <p>of students had trouble finding a room inside a building.</p>
          <p className="note">Binomial test vs 50%, one-tailed p = 0.036</p>
        </div>
        <Respondents />
      </section>

      <section className="doc" id="method">
        <p className="eyebrow">Method</p>
        <div className="method">
          <div><strong>45 students</strong><span>Online questionnaire</span></div>
          <div><strong>3&#8239;×&#8239;15 groups</strong><ul><li>Native Korean</li><li>Some Korean</li><li>No Korean</li></ul></div>
          <div><strong>3 sections</strong><ul><li>Familiarity</li><li>Navigation</li><li>Map tools</li></ul></div>
          <div><strong>2 papers</strong><ul><li>A bilingual campus app (Yvette &amp; Song, 2026)</li><li>2D vs 3D indoor maps (Li &amp; Giudice, 2013)</li></ul></div>
        </div>
      </section>

      <div className="doc-row">
      <section className="doc finding" id="f1">
          <p className="eyebrow">Finding 1</p>
          <h3>Finding the room is as hard as or harder than finding the building</h3>
          <VChart
            caption="Share of students with trouble finding a building versus a room, by Korean ability"
            groups={groups} max={100} ticks={[0, 25, 50, 75, 100]} axisSuffix="%" legend
            series={[
              { name: "Trouble finding a building", bars: building.map((n, i) => ({ value: pct(n, 15), text: `${Math.round(pct(n, 15))}%`, tip: `${g(i)}: ${n} of 15 had trouble finding a building` })) },
              { name: "Trouble finding a room inside it", bars: room.map((n, i) => ({ value: pct(n, 15), text: `${Math.round(pct(n, 15))}%`, tip: `${g(i)}: ${n} of 15 had trouble finding a room`, hi: true })) },
            ]}
          />
          <p>Native speakers had the least trouble between buildings but still struggled inside (33% vs 60%). Building trouble rose as Korean ability fell (33% to 67%), though not significantly.</p>
          <ul className="note">
            <li>Rooms: binomial p = 0.036</li>
            <li>Buildings by group: χ²(2, N = 45) = 3.379, p = 0.185</li>
          </ul>
        </section>

      <section className="doc finding" id="f2">
          <p className="eyebrow">Finding 2</p>
          <h3>The most-used map app works far less well for students who don&apos;t read Korean</h3>
          <VChart
            caption="Mean helpfulness of Naver Map by Korean ability, 1 to 5"
            groups={groups} max={5} ticks={[0, 1, 2, 3, 4, 5]}
            series={[{ name: "Naver Map helpfulness", bars: naver.map((v, i) => ({ value: v, text: v.toFixed(2), tip: `${g(i)}: mean ${v.toFixed(2)} out of 5`, hi: i === 2 })) }]}
          />
          <p>58% of students use Naver Map. Native speakers rated it 4.39 out of 5, students with no Korean 2.75. The official campus map scored about the same in every group (4.00, 4.00, 3.75), which suggests the app causes the gap.</p>
          <div className="note">
            <p>One-way ANOVA with Scheffé post hoc:</p>
            <ul>
              <li>Native vs some Korean: p = 0.028</li>
              <li>Native vs no Korean: p = 0.001</li>
              <li>Some vs no Korean: p = 0.151</li>
            </ul>
          </div>
        </section>
      </div>

      <div className="doc-row">
      <section className="doc finding" id="f3">
          <p className="eyebrow">Finding 3</p>
          <h3>Building numbers are the main source of confusion</h3>
          <HChart caption="Problems students reported with map apps on campus, share of 45 respondents" rows={of45(problems)} />
          <p>The top two problems both involve building numbers: 56% couldn&apos;t search by number, and 49% couldn&apos;t match their timetable to the map. Only 15 of 45 rated campus signs clear.</p>
          <div className="note">
            <p>Multi-select, share of 45 respondents</p>
            <p>Sign clarity ratings:</p>
            <ul>
              <li>Clear or very clear: 15</li>
              <li>Neutral: 21</li>
              <li>Unclear: 9</li>
            </ul>
          </div>
        </section>

      <section className="doc finding" id="f4">
          <p className="eyebrow">Finding 4</p>
          <h3>The problem peaks in the first weeks of the semester</h3>
          <HChart caption="Situations in which students found campus navigation difficult, share of 45 respondents" rows={of45(situations)} />
          <p>89% found the first weeks of semester hardest, and 71% struggled in buildings they hadn&apos;t visited before. Early campus familiarity averaged below 2 out of 5 in every group.</p>
          <div className="note">
            <p>Multi-select, share of 45 respondents</p>
            <p>First-months familiarity, 1 to 5:</p>
            <ul>
              <li>Native: 1.87</li>
              <li>Some Korean: 1.60</li>
              <li>No Korean: 1.47</li>
            </ul>
          </div>
        </section>
      </div>

      <section className="doc" id="design">
        <p className="eyebrow">From data to design</p>
        <h2>Each requirement traces back to a finding</h2>
        <p>The course prototype tested these ideas. I&apos;m now building the first three into a full app, starting with the campus map.</p>
        <div className="reqs">
          {REQS.map((r) => (
            <article className="req" key={r.name}>
              <div className="req-head">
                <span className="req-icon">{REQ_ICONS[r.icon]}</span>
                <h3>{r.name}</h3>
                <p>{r.need}</p>
              </div>
              <div className="req-part"><span className="label">Finding</span>{points(r.finding)}</div>
              <div className="req-part"><span className="label">How ERICA Nav responds</span><span className={`chip ${r.later ? "next" : "wip"}`}>{r.later ? "Later" : "In development"}</span>{points(r.response)}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="doc duo" id="validation">
        <p className="eyebrow">Validation</p>
        <h2>The prototype scored above 4 out of 5 in every group</h2>
        <p>10 students per language group rated the course prototype from 1 to 5. Students with no Korean gave it the highest usefulness and satisfaction scores. There was no side-by-side test with Naver Map, so this doesn&apos;t show it beats existing apps.</p>
        <div className="tablewrap">
          <table className="scores">
            <caption className="sr-only">Prototype ratings by group, mean on a scale of 1 to 5, 10 students per group</caption>
            <thead><tr><th scope="col">Measure</th><th scope="col">Native</th><th scope="col">Some Korean</th><th scope="col">No Korean</th></tr></thead>
            <tbody>
              {validation.map(([m, ...v]) => (
                <tr key={m}><th scope="row" className="rowh">{m}</th>{v.map((x, i) => <td key={i} className="n">{x}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="doc duo" id="reflection">
        <p className="eyebrow">Reflection</p>
        <h2>What I would do differently</h2>
        <ul className="plain">
          <li>Recruit more participants. Small subgroups weaken the ANOVA.</li>
          <li>Time real journeys, like walking from the main gate to a room, instead of relying on self-reported difficulty.</li>
          <li>Ask more about indoor navigation. It affected 64% of students but got only two questions.</li>
        </ul>
      </section>

      <a className="attach" href="/ERICA_Nav_Research_Presentation.pdf">
        <svg viewBox="0 0 28 34" aria-hidden="true"><path d="M2 3a2 2 0 0 1 2-2h14l8 8v22a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" fill="var(--doc)" stroke="currentColor" strokeWidth="1.4" /><path d="M18 1v8h8" fill="none" stroke="currentColor" strokeWidth="1.4" /><text x="14" y="25" textAnchor="middle" fontSize="7" fontWeight="700" fill="currentColor" fontFamily="monospace">PDF</text></svg>
        <span>Full course presentation (PDF)<br /><span className="label">Attached to this file</span></span>
      </a>
      <SectionIndex sections={SECTIONS} />
    </main>
  );
}
