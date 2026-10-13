import type { Metadata } from "next";
import { VChart, HChart, CountUp } from "@/components/Charts";
import Respondents from "@/components/Respondents";
import Catalog from "@/components/Catalog";
import { Tools } from "@/components/CatalogChips";
import { REQ_ICONS } from "@/components/ReqIcons";

// Finding to requirement to feature, one column per requirement (numbers from section 7 of the brief).
type Req = { icon: keyof typeof REQ_ICONS; name: string; need: string; finding: React.ReactNode | React.ReactNode[]; response: React.ReactNode | React.ReactNode[]; later?: boolean; live?: boolean };
const REQS: Req[] = [
  { icon: "search", name: "Multilingual search", live: true, need: "Search by English name, Korean name or building number",
    finding: [<><span className="n">56%</span> couldn&apos;t search by building number</>, <>Naver Map rated <span className="n">2.75/5</span> by non-Korean readers</>],
    response: <>Search by number or name with an EN / <span lang="ko">한</span> toggle</> },
  { icon: "map", name: "Building number and map integration", live: true, need: "Connect the timetable to the map",
    finding: [<><span className="n">49%</span> couldn&apos;t match timetable numbers to the map</>, <><span className="n">89%</span> struggled most in the first weeks</>],
    response: ["Personal timetable", "Turn-by-turn routes", "Campus shuttle schedule"] },
  { icon: "eye", name: "Visual building identification", need: "Help students confirm they are at the right place",
    finding: <>Only <span className="n">15 of 45</span> rated campus signs clear</>,
    response: <>Building photos on the map</> },
  { icon: "indoor", name: "Indoor wayfinding", need: "Guide students past the front door", later: true,
    finding: [<><span className="n">64%</span> struggled to find rooms</>, <><span className="n">40%</span> said directions stop at the building</>],
    response: <>Floor plans for every building come after the building-level app ships</> },
];
// Several points read as a bulleted list, a single one as a sentence.
const points = (x: React.ReactNode | React.ReactNode[]) =>
  Array.isArray(x) ? <ul className="plain">{x.map((n, i) => <li key={i}>{n}</li>)}</ul> : <p>{x}</p>;

export const metadata: Metadata = {
  title: "ERICA Nav research",
  description: "A survey of 45 Hanyang ERICA students on campus wayfinding, and the requirements it produced for the ERICA Nav app.",
};

// Every number on this page comes from section 7 of PORTFOLIO_BRIEF.md and the course deck.
// The power figure in question 1 is a 20,000-run simulation of the chi-square test at the observed rates.
const groups = ["Native\nKorean", "Some\nKorean", "No\nKorean"];
const g = (i: number) => groups[i].replace("\n", " ");
const pct = (n: number, of: number) => (n / of) * 100;

const building = [5, 8, 10], room = [9, 10, 10];
const naver = [4.39, 3.56, 2.75], official = [4.0, 4.0, 3.75];

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

const GLANCE = [
  { q: "Does Korean ability affect finding buildings?", href: "#q1", test: "Chi-square", result: "33% → 53% → 67%, p = 0.185", verdict: "Not significant", chip: "next" },
  { q: "Do map apps help every group equally?", href: "#q2-naver", test: "ANOVA, Scheffé", result: "Naver Map p = 0.001; official map p > 0.8", verdict: "Naver Map only", chip: "wip" },
  { q: "Do most students struggle to find rooms?", href: "#q3", test: "Binomial vs 50%", result: "64%, p = 0.036", verdict: "Supported", chip: "live" },
];

const validation = [
  ["Usability", "4.03", "4.27", "4.31"],
  ["Usefulness", "4.16", "4.34", "4.57"],
  ["Satisfaction", "4.44", "4.37", "4.56"],
];

export default function EricaNav() {
  return (
    <main className="page read erica">
      <header className="page-head">
        <span className="pill glass">Data analysis · Campus wayfinding</span>
        <h1>Why do students get lost on campus?</h1>
        <p className="lede"><strong>We surveyed 45 Hanyang ERICA students and tested three hypotheses.</strong><br />Half had trouble finding buildings. Naver Map, the app most of them use, scored 2.75 out of 5 with students who don&apos;t read Korean and 4.39 with native speakers.</p>
        <Catalog
          head={["", "Project overview"]}
          rows={[
            ["Module", "Human-Computer System Design"],
            ["My role", "Survey Design, Analysis, Presentation"],
            ["Team", <span key="n"><span className="dot">5</span>people</span>],
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
        <p className="viz">ERICA timetables list classes by building number and room. Map apps search by street and place name. We split 45 students into three groups by their Korean when they arrived.</p>
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

      <section className="doc" id="glance">
        <p className="eyebrow">Results at a glance</p>
        <h2>Two results held up, one needs more data</h2>
        <div className="tablewrap">
          <table className="glance wide">
            <caption className="sr-only">Each research question with its test, result and verdict</caption>
            <thead><tr><th scope="col">Question</th><th scope="col">Test</th><th scope="col">Result</th><th scope="col">Verdict</th></tr></thead>
            <tbody>
              {GLANCE.map((r) => (
                <tr key={r.q}>
                  <th scope="row" className="rowh"><a href={r.href}>{r.q}</a></th>
                  <td data-label="Test">{r.test}</td>
                  <td data-label="Result">{r.result}</td>
                  <td><span className={`chip ${r.chip}`}>{r.verdict}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="doc duo" id="q1">
        <p className="eyebrow">Question 1 · Finding buildings</p>
        <h2>Less Korean, more trouble, but not significant</h2>
        <div className="keyfig">
          <div className="num"><CountUp to={51} /><small>%</small></div>
          <p>of students had trouble finding a building.</p>
        </div>
        <p>Trouble rose as Korean ability fell, but the difference wasn&apos;t significant. With 15 students per group, the test had about a 1 in 3 chance of detecting a gap this size.</p>
        <ul className="note">
          <li>χ²(2, N = 45) = 3.379, p = 0.185</li>
          <li>Power at observed rates ≈ 0.36 (simulation)</li>
        </ul>
        <Respondents />
      </section>

      <div className="doc-row">
      <section className="doc finding" id="q2-naver">
          <p className="eyebrow">Question 2 · Naver Map</p>
          <h3>Naver Map falls short without Korean</h3>
          <VChart
            caption="Mean helpfulness of Naver Map by Korean ability, 1 to 5"
            groups={groups} max={5} ticks={[0, 1, 2, 3, 4, 5]}
            series={[{ name: "Naver Map helpfulness", bars: naver.map((v, i) => ({ value: v, text: v.toFixed(2), tip: `${g(i)}: mean ${v.toFixed(2)} out of 5`, hi: i === 2 })) }]}
          />
          <p>58% of students use Naver Map. Both foreign groups rated it significantly lower than native speakers.</p>
          <div className="note">
            <p>One-way ANOVA with Scheffé post hoc:</p>
            <ul>
              <li>Native vs some Korean: p = 0.028</li>
              <li>Native vs no Korean: p = 0.001</li>
              <li>Some vs no Korean: p = 0.151</li>
            </ul>
          </div>
        </section>

      <section className="doc finding" id="q2-official">
          <p className="eyebrow">Question 2 · Official campus map</p>
          <h3>The official map works the same for everyone</h3>
          <VChart
            caption="Mean helpfulness of the official campus map by Korean ability, 1 to 5"
            groups={groups} max={5} ticks={[0, 1, 2, 3, 4, 5]}
            series={[{ name: "Official map helpfulness", bars: official.map((v, i) => ({ value: v, text: v.toFixed(2), tip: `${g(i)}: mean ${v.toFixed(2)} out of 5` })) }]}
          />
          <p>33% use the official map. Its ratings held steady across groups, which suggests the gap comes from Naver Map itself.</p>
          <div className="note">
            <p>Scheffé post hoc: p = 1.000, 0.939, 0.887</p>
            <p>Mean across all users: Naver Map 3.73, official map 3.60</p>
          </div>
        </section>
      </div>

      <section className="doc" id="problems">
        <p className="eyebrow">What goes wrong · Descriptive</p>
        <div className="split">
          <div>
            <h3>Map apps can&apos;t handle building numbers</h3>
            <HChart caption="Problems students reported with map apps on campus, share of 45 respondents" rows={of45(problems)} />
            <p>Both top problems involve building numbers. Only 15 of 45 rated campus signs clear.</p>
            <div className="note">
              <p>Multi-select, share of 45 respondents</p>
              <p>Sign clarity ratings:</p>
              <ul>
                <li>Clear or very clear: 15</li>
                <li>Neutral: 21</li>
                <li>Unclear: 9</li>
              </ul>
            </div>
          </div>
          <div>
            <h3>Students get lost early and in new buildings</h3>
            <HChart caption="Situations in which students found campus navigation difficult, share of 45 respondents" rows={of45(situations)} />
            <p>Early campus familiarity averaged below 2 out of 5 in every group.</p>
            <div className="note">
              <p>Multi-select, share of 45 respondents</p>
              <p>First-months familiarity, 1 to 5:</p>
              <ul>
                <li>Native: 1.87</li>
                <li>Some Korean: 1.60</li>
                <li>No Korean: 1.47</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="doc duo" id="q3">
        <p className="eyebrow">Question 3 · Finding rooms</p>
        <h2>Most students get lost once they&apos;re inside</h2>
        <p>Yes: 29 of 45 (64%), significantly more than half. Native speakers found rooms much harder than buildings (60% vs 33%). The other groups struggled with both about equally. With map apps, 40% said directions stop at the building, not the room, and 22% couldn&apos;t find the entrance or floor.</p>
        <ul className="note">
          <li>Binomial test vs 50%, one-tailed p = 0.036</li>
        </ul>
        <VChart
          caption="Share of students with trouble finding a building versus a room, by Korean ability"
          groups={groups} max={100} ticks={[0, 25, 50, 75, 100]} axisSuffix="%" legend
          series={[
            { name: "Trouble finding a building", bars: building.map((n, i) => ({ value: pct(n, 15), text: `${Math.round(pct(n, 15))}%`, tip: `${g(i)}: ${n} of 15 had trouble finding a building` })) },
            { name: "Trouble finding a room inside it", bars: room.map((n, i) => ({ value: pct(n, 15), text: `${Math.round(pct(n, 15))}%`, tip: `${g(i)}: ${n} of 15 had trouble finding a room`, hi: true })) },
          ]}
        />
      </section>

      <section className="doc" id="design">
        <p className="eyebrow">From data to design</p>
        <h2>Every feature answers a finding</h2>
        <p>The course prototype covered all four. The full app starts with buildings: every room address begins with a building number, and indoor maps need floor plans for each building.</p>
        <div className="reqs">
          {REQS.map((r) => (
            <article className="req" key={r.name}>
              <div className="req-head">
                <span className="req-icon">{REQ_ICONS[r.icon]}</span>
                <h3>{r.name}</h3>
                <p>{r.need}</p>
              </div>
              <div className="req-part"><span className="label">Finding</span>{points(r.finding)}</div>
              <div className="req-part"><span className="label">How ERICA Nav responds</span><span className={`chip ${r.live ? "live" : r.later ? "next" : "wip"}`}>{r.live ? "Live" : r.later ? "Later" : "In development"}</span>{points(r.response)}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="doc duo" id="validation">
        <p className="eyebrow">Validation</p>
        <h2>Students without Korean liked it most</h2>
        <p>10 students per group rated the course prototype from 1 to 5. We didn&apos;t test it against Naver Map, so this doesn&apos;t show it beats existing apps.</p>
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
          <li>Recruit more participants. 15 per group was too few to test the building trend.</li>
          <li>Time real journeys, like main gate to classroom, instead of asking about difficulty.</li>
          <li>Ask more about rooms. 64% struggled, but the survey had two questions on it.</li>
        </ul>
      </section>

      <a className="attach" href="/ERICA_Nav_Research_Presentation.pdf">
        <svg viewBox="0 0 28 34" aria-hidden="true"><path d="M2 3a2 2 0 0 1 2-2h14l8 8v22a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" fill="var(--doc)" stroke="currentColor" strokeWidth="1.4" /><path d="M18 1v8h8" fill="none" stroke="currentColor" strokeWidth="1.4" /><text x="14" y="25" textAnchor="middle" fontSize="7" fontWeight="700" fill="currentColor" fontFamily="monospace">PDF</text></svg>
        <span>Full course presentation (PDF)<br /><span className="label">Attached to this file</span></span>
      </a>
    </main>
  );
}
