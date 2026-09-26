"use client";
import { useRef, useState } from "react";

export type Bar = { value: number; text: string; tip: string; hi?: boolean };
type Tip = { id: string; text: string; x: number; y: number } | null;

// Shared tooltip: hover, keyboard focus and tap all show it; tap again or tap elsewhere hides it.
function useTip() {
  const box = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<Tip>(null);
  function show(id: string, text: string, el: Element) {
    const r = box.current!.getBoundingClientRect(), b = el.getBoundingClientRect();
    setTip({ id, text, x: b.left + b.width / 2 - r.left, y: b.top - r.top });
  }
  const hide = () => setTip(null);
  function props(id: string, bar: Bar) {
    return {
      tabIndex: 0,
      role: "img",
      "aria-label": bar.tip,
      "data-active": tip?.id === id,
      className: `bar ${bar.hi ? "fill-accent" : "fill-neutral"}`,
      onPointerEnter: (e: React.PointerEvent) => e.pointerType === "mouse" && show(id, bar.tip, e.currentTarget),
      onPointerLeave: (e: React.PointerEvent) => e.pointerType === "mouse" && hide(),
      onClick: (e: React.MouseEvent) => (tip?.id === id ? hide() : show(id, bar.tip, e.currentTarget)),
      // Only keyboard focus shows the tip here; a tap focuses too, and its click would otherwise toggle it straight back off.
      onFocus: (e: React.FocusEvent) => e.currentTarget.matches(":focus-visible") && show(id, bar.tip, e.currentTarget),
      onBlur: hide,
    };
  }
  const node = tip && <div className="tip" style={{ left: tip.x, top: tip.y }} aria-hidden="true">{tip.text}</div>;
  return { box, props, node };
}

function vbarPath(x: number, y: number, w: number, h: number) {
  const r = Math.min(4, h, w / 2);
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}
function hbarPath(x: number, y: number, w: number, h: number) {
  const r = Math.min(4, w, h / 2);
  return `M${x},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x}Z`;
}

function SrTable({ caption, head, rows }: { caption: string; head: string[]; rows: string[][] }) {
  return (
    <div className="sr-only"><table>
      <caption>{caption}</caption>
      <thead><tr>{head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
      <tbody>{rows.map((r) => <tr key={r[0]}>{r.map((c, i) => (i ? <td key={i}>{c}</td> : <th key={i} scope="row">{c}</th>))}</tr>)}</tbody>
    </table></div>
  );
}

export function VChart({ caption, groups, series, max, ticks, axisSuffix = "", legend }: {
  caption: string;
  groups: string[];
  series: { name: string; bars: Bar[] }[];
  max: number;
  ticks: number[];
  axisSuffix?: string;
  legend?: boolean;
}) {
  const { box, props, node } = useTip();
  const W = 640, H = 280, m = { t: 24, r: 8, b: 48, l: 40 };
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const y = (v: number) => m.t + ih - (v / max) * ih;
  const gw = iw / groups.length, nS = series.length, bw = Math.min(56, (gw * 0.62) / nS), gap = 2;
  return (
    <figure className="chart" ref={box} style={{ margin: 0 }}>
      {legend && (
        <div className="legend" aria-hidden="true">
          {series.map((s) => <span key={s.name}><i style={{ background: s.bars[0].hi ? "var(--accent)" : "var(--neutral)" }} />{s.name}</span>)}
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label={caption}>
        {ticks.map((t) => (
          <g key={t} aria-hidden="true">
            <line className="gridline" x1={m.l} x2={W - m.r} y1={y(t)} y2={y(t)} />
            <text className="axis" x={m.l - 8} y={y(t) + 4} textAnchor="end">{t}{axisSuffix}</text>
          </g>
        ))}
        {groups.map((g, gi) => {
          const cx = m.l + gw * gi + gw / 2, total = nS * bw + (nS - 1) * gap;
          return (
            <g key={g}>
              {series.map((s, si) => {
                const bar = s.bars[gi], x = cx - total / 2 + si * (bw + gap);
                return (
                  <g key={s.name}>
                    <path d={vbarPath(x, y(bar.value), bw, y(0) - y(bar.value))} {...props(`${gi}-${si}`, bar)} />
                    <text className="val" x={x + bw / 2} y={y(bar.value) - 6} textAnchor="middle" aria-hidden="true">{bar.text}</text>
                  </g>
                );
              })}
              {g.split("\n").map((line, li) => (
                <text key={li} className="lbl" x={cx} y={H - m.b + 20 + li * 15} textAnchor="middle" aria-hidden="true">{line}</text>
              ))}
            </g>
          );
        })}
        <line className="baseline" x1={m.l} x2={W - m.r} y1={y(0)} y2={y(0)} aria-hidden="true" />
      </svg>
      {node}
      <SrTable caption={caption} head={["Group", ...series.map((s) => s.name)]}
        rows={groups.map((g, gi) => [g.replace("\n", " "), ...series.map((s) => s.bars[gi].tip)])} />
    </figure>
  );
}

export function HChart({ caption, rows, max = 100 }: {
  caption: string;
  rows: (Bar & { label: string })[];
  max?: number;
}) {
  const { box, props, node } = useTip();
  const W = 640, row = 44, pad = 6, labelW = 250, right = 56;
  const H = pad * 2 + row * rows.length, iw = W - labelW - right;
  return (
    <figure className="chart" ref={box} style={{ margin: 0 }}>
      <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label={caption}>
        {rows.map((r, i) => {
          const yy = pad + i * row, bh = 20, by = yy + (row - bh) / 2;
          const lines = r.label.split("\n"), w = Math.max(2, (r.value / max) * iw);
          return (
            <g key={r.label}>
              {lines.map((ln, li) => (
                <text key={li} className="lbl" x={0} y={yy + row / 2 + 4 + (li - (lines.length - 1) / 2) * 15} aria-hidden="true">{ln}</text>
              ))}
              <rect className="track" x={labelW} y={by} width={iw} height={bh} rx={4} aria-hidden="true" />
              <path d={hbarPath(labelW, by, w, bh)} {...props(String(i), r)} />
              <text className="val" x={labelW + w + 8} y={by + bh / 2 + 4} aria-hidden="true">{r.text}</text>
            </g>
          );
        })}
      </svg>
      {node}
      <SrTable caption={caption} head={["Item", "Result"]} rows={rows.map((r) => [r.label.replace("\n", " "), r.tip])} />
    </figure>
  );
}
