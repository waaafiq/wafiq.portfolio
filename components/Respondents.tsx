"use client";
import { useState } from "react";

// One dot per student: 45 respondents, 3 language groups of 15. Counts come from section 7 of the brief.
const GROUPS = [
  { name: "Native Korean", room: 9, building: 5 },
  { name: "Some Korean", room: 10, building: 8 },
  { name: "No Korean", room: 10, building: 10 },
];
const VIEWS = { room: "The room", building: "The building" } as const;
type View = keyof typeof VIEWS;

export default function Respondents() {
  const [view, setView] = useState<View>("room");
  const total = GROUPS.reduce((s, g) => s + g[view], 0);
  return (
    <figure className="respondents">
      <div className="resp-head">
        <p className="resp-total" aria-live="polite">
          <span className="n">{total} of 45</span> students had trouble {view === "room" ? "finding the room inside a building" : "finding the building"}
        </p>
        <div className="seg" role="group" aria-label="Show trouble with">
          {(Object.keys(VIEWS) as View[]).map((v) => (
            <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}>{VIEWS[v]}</button>
          ))}
        </div>
      </div>
      <div className="resp-rows">
        {GROUPS.map((g) => (
          <div className="resp-row" key={g.name}>
            <span className="resp-label">{g.name}</span>
            <span className="resp-dots" role="img" aria-label={`${g.name}: ${g[view]} of 15`}>
              {Array.from({ length: 15 }, (_, i) => (
                <i key={i} className={i < g[view] ? "on" : ""} style={{ transitionDelay: `${i * 14}ms` }} />
              ))}
            </span>
            <span className="resp-count n">{g[view]}/15</span>
          </div>
        ))}
      </div>
      <figcaption className="note">Each dot is one respondent. Filled dots had trouble.</figcaption>
    </figure>
  );
}
