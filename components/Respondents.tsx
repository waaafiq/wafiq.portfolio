// One dot per student: 45 respondents, 3 language groups of 15, trouble finding a building.
// Counts come from section 7 of the brief. Room counts live in question 3's chart.
const GROUPS = [
  { name: "Native Korean", n: 5 },
  { name: "Some Korean", n: 8 },
  { name: "No Korean", n: 10 },
];

export default function Respondents() {
  const total = GROUPS.reduce((s, g) => s + g.n, 0);
  return (
    <figure className="respondents">
      <div className="resp-head">
        <p className="resp-total"><span className="n">{total} of 45</span> students had trouble finding buildings</p>
      </div>
      <div className="resp-rows">
        {GROUPS.map((g) => (
          <div className="resp-row" key={g.name}>
            <span className="resp-label">{g.name}</span>
            <span className="resp-dots" role="img" aria-label={`${g.name}: ${g.n} of 15`}>
              {Array.from({ length: 15 }, (_, i) => (
                <i key={i} className={i < g.n ? "on" : ""} style={{ transitionDelay: `${i * 14}ms` }} />
              ))}
            </span>
            <span className="resp-count n">{g.n}/15</span>
          </div>
        ))}
      </div>
      <figcaption className="note">Each dot is one respondent. Filled dots had trouble.</figcaption>
    </figure>
  );
}
