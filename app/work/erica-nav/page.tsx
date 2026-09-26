import type { Metadata } from "next";
import { VChart, HChart } from "@/components/Charts";
import Respondents from "@/components/Respondents";
import Catalog from "@/components/Catalog";
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
        <span className="sign"><b>ERICA</b>Research · Campus wayfinding</span>
        <h1>Why students get lost at ERICA, and what a map app should do about it</h1>
        <p className="lede">A survey of 45 Hanyang ERICA students showed that the hardest part of getting to class is not finding the building. It is finding the room once you are inside, especially for students who don&apos;t read Korean.</p>
        <Catalog
          head={["ERICA Nav", "Spring 2026"]}
          rows={[
            ["My role", "Questionnaire design, research, analysis, presentation"],
            ["Team", "Team project, Human-Computer System Design course"],
            ["Timeline", "Spring 2026"],
            ["Methods", "Literature review, survey, χ², binomial test, one-way ANOVA"],
          ]}
        />
      </header>

      <section className="doc" id="question">
        <p className="eyebrow">The question</p>
        <h2>What makes it hard to find your way around ERICA, and does knowing Korean change that?</h2>
        <p>ERICA timetables list classes only as a building number and a room number. The popular map apps are built for streets, not campuses. We wanted to know where exactly students lose their way, and whether international students struggle more than Korean students.</p>
      </section>

      <section className="doc" id="key">
        <p className="eyebrow">Key finding</p>
        <div className="keyfig">
          <div className="num">64<small>%</small></div>
          <p>of students had trouble finding a classroom or facility inside a building. Current map apps stop at the front door, which makes indoor wayfinding the clearest gap to close.</p>
          <p className="note">29 of 45 respondents · binomial test vs 50%, one-tailed p = 0.036</p>
        </div>
        <Respondents />
      </section>

      <section className="doc" id="method">
        <p className="eyebrow">Method</p>
        <div className="method">
          <div><strong>45</strong><span>students completed an online questionnaire</span></div>
          <div><strong>3 × 15</strong><span>equal groups by Korean ability at admission: native, some Korean, no Korean</span></div>
          <div><strong>3</strong><span>question sections: language and campus familiarity, navigation experience, map tools</span></div>
          <div><strong>2</strong><span>papers reviewed: Yvette &amp; Song (2026) on a bilingual campus app, and Li &amp; Giudice (2013) on 2D vs 3D indoor maps</span></div>
        </div>
      </section>

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
          <p>Even native Korean speakers, who had the least trouble between buildings, struggled once inside (33% vs 60%). Building-level difficulty rose as Korean ability fell (33% to 67%), but that trend was not statistically significant with this sample.</p>
          <p className="note">Rooms: binomial p = 0.036 · Buildings by group: χ²(2, N = 45) = 3.379, p = 0.185</p>
        </section>

      <section className="doc finding" id="f2">
          <p className="eyebrow">Finding 2</p>
          <h3>The most-used map app works far less well for students who don&apos;t read Korean</h3>
          <VChart
            caption="Mean helpfulness of Naver Map by Korean ability, 1 to 5"
            groups={groups} max={5} ticks={[0, 1, 2, 3, 4, 5]}
            series={[{ name: "Naver Map helpfulness", bars: naver.map((v, i) => ({ value: v, text: v.toFixed(2), tip: `${g(i)}: mean ${v.toFixed(2)} out of 5`, hi: i === 2 })) }]}
          />
          <p>58% of students use Naver Map on campus. Among them, native speakers rated it 4.39 out of 5, while students with no Korean rated it 2.75. Every group rated the official campus map about the same (4.00, 4.00 and 3.75, no significant difference). That suggests the gap comes from the app, not the students.</p>
          <p className="note">One-way ANOVA with Scheffé post hoc · native vs some Korean p = 0.028 · native vs no Korean p = 0.001 · some vs no Korean p = 0.151</p>
        </section>

      <section className="doc finding" id="f3">
          <p className="eyebrow">Finding 3</p>
          <h3>Building numbers are the main source of confusion</h3>
          <HChart caption="Problems students reported with map apps on campus, share of 45 respondents" rows={of45(problems)} />
          <p>The two most common problems were both about building numbers: 56% could not search for a building by its number, and 49% could not match the number on their timetable to a building on the map. Campus signs did not fill the gap: only 15 of 45 students rated them clear.</p>
          <p className="note">Multi-select, share of 45 respondents · Sign clarity: 15 rated clear or very clear, 21 neutral, 9 unclear</p>
        </section>

      <section className="doc finding" id="f4">
          <p className="eyebrow">Finding 4</p>
          <h3>The problem peaks in the first weeks of the semester</h3>
          <HChart caption="Situations in which students found campus navigation difficult, share of 45 respondents" rows={of45(situations)} />
          <p>Almost every student (89%) said navigation was hardest in the first weeks of the semester, and 71% said it was hard when visiting a building for the first time. Students also started with low familiarity: in their first months, the average rating was below 2 out of 5 in every group.</p>
          <p className="note">Multi-select, share of 45 respondents · First-months familiarity (1 to 5): native 1.87, some Korean 1.60, no Korean 1.47</p>
        </section>

      <section className="doc" id="design">
        <p className="eyebrow">From data to design</p>
        <h2>Each requirement traces back to a finding</h2>
        <p>The course prototype tested these ideas. I am now building them into a full app, starting with the campus map, then indoor floor maps.</p>
        <div className="tablewrap">
          <table className="wide">
            <thead><tr><th scope="col">Finding</th><th scope="col">Requirement</th><th scope="col">How ERICA Nav responds</th></tr></thead>
            <tbody>
              <tr>
                <td><span className="n">56%</span> couldn&apos;t search by building number; Naver Map rated <span className="n">2.75/5</span> by non-Korean readers</td>
                <td><strong>Multilingual search</strong>Search by English name, Korean name or building number</td>
                <td><span className="chip wip">In development</span>Search by number or name with an EN / <span lang="ko">한</span> toggle</td>
              </tr>
              <tr>
                <td><span className="n">49%</span> couldn&apos;t match timetable numbers to the map; <span className="n">89%</span> struggled most in the first weeks</td>
                <td><strong>Building number and map integration</strong>Connect the timetable to the map</td>
                <td><span className="chip wip">In development</span>Personal timetable, turn-by-turn routes, campus shuttle schedule</td>
              </tr>
              <tr>
                <td>Only <span className="n">15 of 45</span> rated campus signs clear</td>
                <td><strong>Visual building identification</strong>Help students confirm they are at the right place</td>
                <td><span className="chip wip">In development</span>Building photos on the map</td>
              </tr>
              <tr>
                <td><span className="n">64%</span> struggled to find rooms; <span className="n">40%</span> said directions stop at the building</td>
                <td><strong>Indoor wayfinding</strong>Guide students past the front door</td>
                <td><span className="chip next">Next</span>Floor maps and room-level directions</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="doc" id="validation">
        <p className="eyebrow">Validation</p>
        <h2>The prototype scored above 4 out of 5 in every group</h2>
        <p>We tested the course prototype with 10 students per language group, on a scale of 1 to 5. Students with no Korean gave the highest usefulness and satisfaction scores, the group the current apps serve worst. The prototype was rated on its own, not side by side with Naver Map, so these scores show it was well received, not that it beats the current apps.</p>
        <div className="tablewrap">
          <table>
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

      <section className="doc" id="reflection">
        <p className="eyebrow">Reflection</p>
        <h2>What I would do differently</h2>
        <ul className="plain">
          <li>Recruit more participants. Some subgroups were very small, which weakens the ANOVA result.</li>
          <li>Measure behaviour, not only opinions. A timed task, such as walking from the main gate to a specific room, would show real navigation time instead of self-reported difficulty.</li>
          <li>Ask about indoor navigation in more detail. It turned out to be the biggest problem, which is why indoor maps are the next thing I am building.</li>
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
