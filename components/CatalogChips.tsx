// Catalog row values drawn as icons and stamps instead of comma lists.
// Tool icons: one-colour marks from Iconify (thesvg; Excel from Simple Icons; Ai/Ae are thesvg-color with the tile removed;
// Affinity 3 is thesvg-color with the tile removed; Canva from Boxicons),
// saved in /public/tools and used as masks so they print in the card's ink. SPSS has no legible mark at this size, so it's text.
// [file, width ÷ height]. Every SVG is cropped to its drawing, so at one shared height the gaps between marks are
// equal. Procreate is its public-domain logo from Wikimedia Commons, cut out as a one-colour shape.
const TOOLS: Record<string, [file: string, ratio: number]> = {
  Python: ["python", 1.01], Excel: ["excel", 1.14], "IBM SPSS": ["", 0], "Google Forms": ["googleforms", 0.73], Figma: ["figma", 0.7],
  Illustrator: ["illustrator", 1.17], "After Effects": ["aftereffects", 1.65], Procreate: ["procreate-stroke", 1.05], Affinity: ["affinity", 0.87],
  Canva: ["canva", 1], React: ["react", 1.12], "Claude Code": ["claudecode", 1.6],
};

export function Tools({ names }: { names: (keyof typeof TOOLS)[] }) {
  return (
    <ul className="tools">
      {names.map((n) => (
        TOOLS[n][0] ? (
          <li key={n} tabIndex={0} data-name={n}>
            <span role="img" aria-label={n} style={{ "--icon": `url(/tools/${TOOLS[n][0]}.svg)`, "--ratio": TOOLS[n][1] } as React.CSSProperties} />
          </li>
        ) : <li key={n} className="tool-text">{n}</li>
      ))}
    </ul>
  );
}


// Language codes as red outlined pills; the language and level show on hover/focus
export function Langs({ items }: { items: [code: string, label: string, lang: string][] }) {
  return (
    <ul className="langs">
      {items.map(([code, label, lang]) => (
        <li key={code} lang={lang} tabIndex={0} data-name={label} aria-label={label}>{code}</li>
      ))}
    </ul>
  );
}
