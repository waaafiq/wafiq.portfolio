"use client";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import type { ComponentType } from "react";
import { BADGE_TYPE_LIST, BADGE_RARITY_COLORS, BADGE_RARITY_LABELS } from "./FifaCard";
import "./bolahh-fonts.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- ported JS component
const BadgeIcon = dynamic(() => import("./FifaCard").then((m) => m.AchievementBadgeIcon), { ssr: false }) as ComponentType<any>;

// Ported from Bolahh's profile "Edit Badges" panel (ProfilePage.jsx + BadgeReorderList.jsx), without the heading and the
// Cancel / Save buttons. Unlock state and requirement text are WAFIQ H's from the local database:
// 24 matches (common, rare), 3 MVP awards (common), top of Emas (every Ranked tier).
type Rarity = keyof typeof BADGE_RARITY_COLORS;
const RARITIES = Object.keys(BADGE_RARITY_COLORS) as Rarity[];
const REQS: Record<string, Record<Rarity, { text: string; unlocked: boolean }>> = {
  matches: {
    common: { text: "Played 5 matches", unlocked: true }, rare: { text: "Played 15 matches", unlocked: true },
    epic: { text: "Played 30 matches", unlocked: false }, legendary: { text: "Played 50 matches", unlocked: false },
  },
  mvp: {
    common: { text: "Become MVP 3 times", unlocked: true }, rare: { text: "Become MVP 10 times", unlocked: false },
    epic: { text: "Become MVP 15 times", unlocked: false }, legendary: { text: "Become MVP 30 times", unlocked: false },
  },
  ranked: {
    common: { text: "Joined Bolahh", unlocked: true }, rare: { text: "Reach top 3 of overall Gangsa tier or higher", unlocked: true },
    epic: { text: "Reach top 3 of overall Perak tier or higher", unlocked: true }, legendary: { text: "Reach top 3 of overall Emas tier", unlocked: true },
  },
};
type Badge = { type: string; rarity: Rarity };
const LABEL = (key: string) => (BADGE_TYPE_LIST as { key: string; label: string }[]).find((t) => t.key === key)?.label ?? key;

export default function BadgePicker() {
  const [selected, setSelected] = useState<Badge[]>([
    { type: "ranked", rarity: "legendary" }, { type: "matches", rarity: "rare" }, { type: "mvp", rarity: "common" },
  ]);
  const [tip, setTip] = useState<string | null>(null);
  const [leaving, setLeaving] = useState<string | null>(null);
  // Removing plays a short exit animation before the row leaves the list.
  const remove = (type: string) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setSelected((p) => p.filter((x) => x.type !== type));
    setLeaving(type);
    setTimeout(() => { setSelected((p) => p.filter((x) => x.type !== type)); setLeaving(null); }, 200);
  };
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Same rules as the app: pick a type once, tap another unlocked tier of it to re-tier, tap the active tile to remove.
  const tap = (type: string, rarity: Rarity, unlocked: boolean) => {
    if (!unlocked) return;
    const i = selected.findIndex((b) => b.type === type);
    if (i === -1) { if (selected.length < 3) setSelected([...selected, { type, rarity }]); return; }
    if (selected[i].rarity === rarity) return remove(type);
    setSelected(selected.map((b, k) => (k === i ? { ...b, rarity } : b)));
  };

  return (
    <div className="bp">
      {(BADGE_TYPE_LIST as { key: string; label: string }[]).map((t) => (
        <div key={t.key} className="bp-type">
          <div className="bp-type-name">{t.label.toUpperCase()}</div>
          <div className="bp-tiles">
            {RARITIES.map((r) => {
              const req = REQS[t.key][r];
              const on = selected.some((b) => b.type === t.key && b.rarity === r);
              const key = `${t.key}-${r}`;
              const colour = BADGE_RARITY_COLORS[r];
              return (
                <div key={r} className="bp-cell">
                  <button type="button" className="bp-tile" data-on={on || undefined} data-locked={!req.unlocked || undefined}
                    aria-label={`${t.label}, ${BADGE_RARITY_LABELS[r]}: ${req.unlocked ? "unlocked" : "locked"}. ${req.text}`} aria-pressed={on}
                    onMouseEnter={() => setTip(key)} onMouseLeave={() => setTip((k) => (k === key ? null : k))}
                    onFocus={() => setTip(key)} onBlur={() => setTip((k) => (k === key ? null : k))}
                    onClick={() => {
                      tap(t.key, r, req.unlocked);
                      if (matchMedia("(hover: none)").matches) { clearTimeout(timer.current); setTip(key); timer.current = setTimeout(() => setTip((k) => (k === key ? null : k)), 2000); }
                    }}>
                    <BadgeIcon type={t.key} rarity={r} />
                    {!req.unlocked && (
                      <span className="bp-lock" aria-hidden="true">
                        <svg viewBox="0 0 512 512" width="15" height="15" fill="rgba(255,255,255,.75)"><path d="M368 192h-16v-80a96 96 0 1 0-192 0v80h-16a64.07 64.07 0 0 0-64 64v176a64.07 64.07 0 0 0 64 64h224a64.07 64.07 0 0 0 64-64V256a64.07 64.07 0 0 0-64-64zm-48 0H192v-80a64 64 0 1 1 128 0z" /></svg>
                      </span>
                    )}
                    <span className="bp-tip" data-open={tip === key || undefined} aria-hidden="true">
                      <strong style={{ color: req.unlocked ? "#4ade80" : "#6b6d6f" }}>{req.unlocked ? "Unlocked" : "Locked"}</strong>
                      {req.text}
                    </span>
                  </button>
                  <span className="bp-pill" style={req.unlocked ? { background: `${colour}30`, color: colour, borderColor: `${colour}70` } : undefined}>
                    {BADGE_RARITY_LABELS[r]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {selected.length > 0 && (
        <ol className="bp-list">
          {selected.map((b, i) => {
            const colour = BADGE_RARITY_COLORS[b.rarity];
            return (
              <li key={b.type} data-leaving={leaving === b.type || undefined}>
                <button type="button" onClick={() => remove(b.type)} aria-label={`Remove ${LABEL(b.type)}`}>{i + 1}</button>
                <span className="bp-list-name">{LABEL(b.type)}</span>
                <span key={b.rarity} className="bp-list-pill" style={{ background: `${colour}22`, color: colour, borderColor: `${colour}55` }}>{BADGE_RARITY_LABELS[b.rarity]}</span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
