// Library catalog card: a page's key facts on ruled card stock.
export default function Catalog({ head, rows }: { head: [string, string]; rows: [string, React.ReactNode][] }) {
  return (
    <div className="catalog">
      <div className="catalog-head"><span>{head[0]}</span><span>{head[1]}</span></div>
      <dl>
        {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>
    </div>
  );
}
