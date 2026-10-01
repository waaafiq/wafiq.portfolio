"use client";
import { useEffect, useRef, useState } from "react";

export type Bar = { value: number; text: string; tip: string; hi?: boolean };
type Tip = { id: string; text: string; x: number; y: number } | null;

// Flips true once the element is mostly on screen, so animations play when seen rather than on load.
function useSeen<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold: 0.4 });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

// Counts from 0 up to `to` once scrolled into view.
export function CountUp({ to, ms = 1900 }: { to: number; ms?: number }) {
  const [ref, seen] = useSeen<HTMLSpanElement>();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setN(to);
    const t0 = performance.now();
    let raf = requestAnimationFrame(function tick(t) {
      const p = Math.min(1, (t - t0) / ms);
      setN(Math.round(to * (1 - (1 - p) ** 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [seen, to, ms]);
  return <span ref={ref}><span aria-hidden="true">{n}</span><span className="sr-only">{to}</span></span>;
}

// Shared tooltip: hover, keyboard focus and tap all show it; tap again or tap elsewhere hides it.
// `narrow` (a phone-width chart) switches to a smaller drawing so the labels aren't shrunk to unreadable sizes.
function useTip() {
  const [box, seen] = useSeen<HTMLElement>();
  const [tip, setTip] = useState<Tip>(null);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setNarrow(e.contentRect.width < 480));
    ro.observe(box.current!);
    return () => ro.disconnect();
  }, [box]);
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
  return { box, props, node, seen, narrow };
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
  const { box, props, node, seen, narrow } = useTip();
  const W = narrow ? 400 : 640, H = narrow ? 270 : 290, m = { t: 26, r: 8, b: 58, l: narrow ? 42 : 48 };
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const y = (v: number) => m.t + ih - (v / max) * ih;
  const gw = iw / groups.length, nS = series.length, bw = Math.min(56, (gw * 0.62) / nS), gap = 2;
  return (
    <figure className="chart" ref={box} data-seen={seen || undefined} style={{ margin: 0 }}>
      {legend && (
        <div className="legend" aria-hidden="true">
          {series.map((s) => <span key={s.name}><i style={{ background: s.bars[0].hi ? "var(--accent)" : "var(--neutral)" }} />{s.name}</span>)}
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label={caption}>
        {ticks.map((t) => (
          <g key={t} aria-hidden="true">
            <line className="gridline" x1={m.l} x2={W - m.r} y1={y(t)} y2={y(t)} />
            <text className="axis" x={m.l - 8} y={y(t) + 5} textAnchor="end">{t}{axisSuffix}</text>
          </g>
        ))}
        {groups.map((g, gi) => {
          const cx = m.l + gw * gi + gw / 2, total = nS * bw + (nS - 1) * gap;
          return (
            <g key={g}>
              {series.map((s, si) => {
                const bar = s.bars[gi], x = cx - total / 2 + si * (bw + gap);
                return (
                  <g key={s.name} style={{ "--i": gi * nS + si } as React.CSSProperties}>
                    <path d={vbarPath(x, y(bar.value), bw, y(0) - y(bar.value))} {...props(`${gi}-${si}`, bar)} />
                    <text className="val" x={x + bw / 2} y={y(bar.value) - 7} textAnchor="middle" aria-hidden="true">{bar.text}</text>
                  </g>
                );
              })}
              {g.split("\n").map((line, li) => (
                <text key={li} className="lbl" x={cx} y={H - m.b + 24 + li * 18} textAnchor="middle" aria-hidden="true">{line}</text>
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
  const { box, props, node, seen, narrow } = useTip();
  // Narrow: each label sits on its own line above a full-width bar instead of in a column beside it.
  const W = narrow ? 400 : 640, row = narrow ? 52 : 44, pad = 6, labelW = narrow ? 0 : 250, right = 56;
  const H = pad * 2 + row * rows.length, iw = W - labelW - right;
  return (
    <figure className="chart h" ref={box} data-seen={seen || undefined} style={{ margin: 0 }}>
      <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label={caption}>
        {rows.map((r, i) => {
          const yy = pad + i * row, bh = 20, by = narrow ? yy + 24 : yy + (row - bh) / 2;
          const lines = r.label.split("\n"), w = Math.max(2, (r.value / max) * iw);
          return (
            <g key={r.label} style={{ "--i": i } as React.CSSProperties}>
              {narrow
                ? <text className="lbl" x={0} y={yy + 16} aria-hidden="true">{lines.join(" ")}</text>
                : lines.map((ln, li) => (
                  <text key={li} className="lbl" x={0} y={yy + row / 2 + 5 + (li - (lines.length - 1) / 2) * 18} aria-hidden="true">{ln}</text>
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
