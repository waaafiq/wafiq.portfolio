"use client";
import { useState } from "react";
import * as ART from "./art";

// One brand's guide: logo suite on mockups, palette, type and misuse. Data-driven so the next two logos reuse it.
type Swatch = { name: string; hex: string; role: string; share: number; pair: string };
export type Brand = {
  name: string; alt: string; concept: string;
  lockups: { key: keyof typeof ART; label: string; note: string }[];
  palette: Swatch[];
  type: { family: string; note: string; sample: string };
};

export const BOODAK: Brand = {
  name: "Boodak Studio",
  alt: "ブウダクスタジオ",
  concept: "Budak is Malay for kid, so Boodak Studio reads as “kid studio”: a photography studio that doesn’t take itself too seriously. The mark is a kid in sunglasses, drawn in one line weight so it holds from a shopfront sign down to a watermark on a print.",
  lockups: [
    { key: "PRIMARY", label: "Primary", note: "Default lockup. The yellow lenses are the one pop of colour." },
    { key: "STACKED", label: "Stacked", note: "For square spaces like posts and stickers. The yellow bar works as a highlighter across the eyes." },
    { key: "BADGE", label: "Badge", note: "For stamps, stickers and print backs. Name wraps the face in English and katakana." },
    { key: "WORDMARK", label: "Wordmark", note: "The formal version, for invoices and signage." },
    { key: "MARK", label: "Mark", note: "The face on its own, once people know the name." },
    { key: "ICON", label: "Icon", note: "Just the sunglasses. Favicons, buttons and anything under 32px." },
  ],
  palette: [
    { name: "Cocoa", hex: "#52443C", role: "Line work and type", share: 45, pair: "9.3:1 on white" },
    { name: "Paper", hex: "#FFFFFF", role: "Ground", share: 30, pair: "Background for everything" },
    { name: "Mist", hex: "#CCDAE0", role: "Soft fills and rules", share: 15, pair: "Cocoa on Mist 6.5:1" },
    { name: "Sunshine", hex: "#FFD851", role: "Accent, one touch per layout", share: 10, pair: "Cocoa on Sunshine 6.7:1. Never as text on white (1.4:1)" },
  ],
  type: { family: "Poppins SemiBold", note: "Lowercase, ending in a Sunshine full stop. Caps only in the formal wordmark.", sample: "boodak studio" },
};

const MOCKS = ["Plain", "Sign", "Shirt", "App icon", "Card", "Sticker"] as const;
const VARIANTS = [["light", "Light"], ["dark", "Dark"], ["mono", "One colour"]] as const;
const DONTS = [["stretch", "Don’t stretch it"], ["tint", "Don’t recolour the face"], ["tilt", "Don’t tilt it"], ["busy", "Don’t set it on busy photos"]] as const;
const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(", ");

function Art({ k, className = "" }: { k: keyof typeof ART; className?: string }) {
  return <span className={`bd-art ${className}`} dangerouslySetInnerHTML={{ __html: ART[k] }} />;
}

export default function BrandGuide({ brand }: { brand: Brand }) {
  const [lock, setLock] = useState(0);
  const [mock, setMock] = useState(0);
  const [variant, setVariant] = useState<string>("light");
  const [space, setSpace] = useState(false);
  const [hot, setHot] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [text, setText] = useState(brand.type.sample);
  const L = brand.lockups[lock];

  const copy = (hex: string) => {
    navigator.clipboard?.writeText(hex).catch(() => {});
    setCopied(hex);
    setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1400);
  };

  return (
    <article className="bd">
      <header className="bd-head">
        <div>
          <h2>{brand.name}</h2>
          <p className="label" lang="ja">{brand.alt}</p>
        </div>
        <p>{brand.concept}</p>
      </header>

      <div className="logo-slot">
        <button type="button" className="stage bd-stage" data-variant={variant} data-mock={MOCKS[mock]} onClick={() => setMock((m) => (m + 1) % MOCKS.length)}>
          <span className="sr-only">{L.label} lockup on {MOCKS[mock]}, tap for the next mockup.</span>
          {mock === 0 && <span className={`bd-plain${space ? " bd-space" : ""}`}><Art k={L.key} /></span>}
          {mock === 1 && (
            <span className="bd-hang">
              <span className="bd-hang-disc"><Art k="BADGE" /></span>
            </span>
          )}
          {mock === 2 && (
            <span className="mock-shirt">
              <svg viewBox="0 0 200 200" aria-hidden="true"><path d="M70 20 L40 30 L10 70 L35 85 L50 70 L50 185 L150 185 L150 70 L165 85 L190 70 L160 30 L130 20 Q100 45 70 20 Z" fill="var(--bd-ground)" stroke="currentColor" strokeWidth="2" /></svg>
              <Art k={L.key} className="bd-on-shirt" />
            </span>
          )}
          {mock === 3 && (
            <span className="bd-home">
              {(["MARK", "ICON"] as const).map((k, i) => (
                <span key={k} className="bd-home-app"><span className={`bd-tile${i ? " alt" : ""}`}><Art k={k} /></span><span>{i ? "Icon" : "Mark"}</span></span>
              ))}
            </span>
          )}
          {mock === 4 && (
            <span className="bd-cards">
              <span className="bd-card back"><Art k="ICON" /></span>
              <span className="bd-card front"><Art k="MARK" /><span className="bd-card-text"><b>boodak studio<i>.</i></b><span>Photography</span></span></span>
            </span>
          )}
          {mock === 5 && <span className="bd-sticker"><Art k="BADGE" /></span>}
        </button>
        <div className="stack">
          <div className="stack" style={{ gap: "var(--s2)" }}>
            <span className="label">Lockup</span>
            <div className="seg">{brand.lockups.map((l, i) => <button key={l.key} type="button" aria-pressed={lock === i} onClick={() => setLock(i)}>{l.label}</button>)}</div>
            <p className="bd-note">{L.note}</p>
          </div>
          <div className="stack" style={{ gap: "var(--s2)" }}>
            <span className="label">Mockup</span>
            <div className="seg">{MOCKS.map((m, i) => <button key={m} type="button" aria-pressed={mock === i} onClick={() => setMock(i)}>{m}</button>)}</div>
          </div>
          <div className="stack" style={{ gap: "var(--s2)" }}>
            <span className="label">Colour</span>
            <div className="seg">{VARIANTS.map(([v, l]) => <button key={v} type="button" aria-pressed={variant === v} onClick={() => setVariant(v)}>{l}</button>)}</div>
          </div>
          <div>
            <button type="button" className="btn small" aria-pressed={space} onClick={() => { setSpace(!space); setMock(0); }}>{space ? "Hide clear space" : "Show clear space"}</button>
          </div>
        </div>
      </div>

      <section className="stack">
        <span className="label">Colour · hover a colour for its values, click to copy the hex</span>
        <div className="bd-palette" onMouseLeave={() => setHot(null)}>
          {brand.palette.map((s, i) => (
            <button key={s.hex} type="button" className="bd-swatch" style={{ background: s.hex, flexGrow: hot === i ? s.share + 30 : s.share, color: i === 0 ? "#fff" : "#52443C" }}
              onMouseEnter={() => setHot(i)} onFocus={() => setHot(i)} onBlur={() => setHot(null)} onClick={() => copy(s.hex)} aria-label={`${s.name} ${s.hex}, copy hex`}>
              <span className="bd-sw-name">{s.name}</span>
              <span className="bd-sw-meta">
                <b>{copied === s.hex ? "Copied" : s.hex}</b>
                <span>RGB {rgb(s.hex)}</span>
                <span>{s.role}</span>
              </span>
              <span className="bd-sw-share">{s.share}%</span>
            </button>
          ))}
        </div>
        <p className="bd-note" aria-live="polite">{hot === null ? "Bar widths show how much of a layout each colour should take." : brand.palette[hot].pair}</p>
      </section>

      <section className="bd-type">
        <div className="stack">
          <span className="label">Type · {brand.type.family}</span>
          <p className="bd-aa">Aa</p>
          <p className="bd-note">{brand.type.note}</p>
        </div>
        <label className="stack">
          <span className="label">Try it</span>
          <input className="bd-input" value={text} maxLength={28} onChange={(e) => setText(e.target.value)} aria-label="Type a name to preview in the brand style" />
          <p className="bd-preview">{text.trim().toLowerCase() || " "}<i>.</i></p>
        </label>
      </section>

      <section className="stack">
        <span className="label">Misuse</span>
        <div className="bd-donts">
          {DONTS.map(([k, l]) => (
            <figure key={k} className="bd-dont" data-dont={k}>
              <div><Art k="MARK" /></div>
              <figcaption>{l}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </article>
  );
}
