"use client";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { useEffect, useRef, useState } from "react";
import { RANKS, getRankTier } from "./rankUtils";
import { getCardTheme } from "./FifaCard";
import "./bolahh-fonts.css";

// FifaCard reads matchMedia on first render, so it only renders in the browser.
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- ported JS component, every prop optional
const FifaCard = dynamic(() => import("./FifaCard"), { ssr: false }) as ComponentType<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- ported JS component
const BadgeIcon = dynamic(() => import("./FifaCard").then((m) => m.AchievementBadgeIcon), { ssr: false }) as ComponentType<any>;
const RARITY_GLOW = { common: "#9aa0a6", rare: "#0fa958", epic: "#9966cc", legendary: "#ec4d6d" } as const;
// Badges around the spinning card, in the layout picked from Emas II: one left at mid-height, two right (top and bottom),
// each bobbing at its own rate.
const SCATTER = [
  { type: "mvp", side: "left", top: 185, x: -34, floatMul: 0.4 },
  { type: "matches", side: "right", top: 95, x: -30, floatMul: -0.35 },
  { type: "ranked", side: "right", top: 325, x: -26, floatMul: 0.55 },
] as const;

const PROFILE = { name: "WAFIQ H", position: "Midfielder", games_played: 24 };
const JOINED = "1973-12-12";
// One fixed player shape (PAC and DRI strong, DEF weak), shifted to each tier's OVR so the stats stay consistent
// across cards while the OVR still lands inside the tier. Offsets sum to zero, so OVR = the tier's target.
const SHAPE = { pac: 6, sho: -2, pas: 3, dri: 5, def: -8, phy: -4 };
const statsFor = (rank: (typeof RANKS)[number]) => {
  const target = rank.name === "Novis" ? 24 : Math.round((rank.minOvr + rank.maxOvr) / 2);
  return Object.fromEntries(Object.entries(SHAPE).map(([k, d]) => [k, Math.max(1, Math.min(99, target + d))]));
};

// Same motion as the Bolahh landing hero: a constant 14deg/s Y-axis spin (card and crown star in lockstep),
// on a -4deg tilted wrapper that bobs 12px. Driven through refs, not state, so it never re-renders.
const SPIN_DEG_PER_SEC = 14;
function SpinningCard({ rarity, ...props }: { rarity: keyof typeof RARITY_GLOW } & Record<string, unknown>) {
  const flipRef = useRef<HTMLElement>(null);
  const starRef = useRef<HTMLElement>(null);
  const bobRef = useRef<HTMLDivElement>(null);
  const badgeRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0, start: number | null = null;
    const animate = (ts: number) => {
      start ??= ts;
      const t = (ts - start) / 1000, deg = t * SPIN_DEG_PER_SEC;
      if (flipRef.current) flipRef.current.style.transform = `rotateY(${deg}deg)`;
      if (starRef.current) starRef.current.style.transform = `rotateY(${deg}deg)`;
      const bob = Math.sin(t * 0.8) * 12;
      if (bobRef.current) bobRef.current.style.transform = `translateY(${bob}px) rotate(-4deg)`;
      SCATTER.forEach((b, k) => { const el = badgeRefs.current[k]; if (el) el.style.transform = `translateY(${bob * b.floatMul}px)`; });
      frame = requestAnimationFrame(animate);
    };
    // Spin only while the card is on screen
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(frame);
      if (e.isIntersecting) frame = requestAnimationFrame(animate);
    });
    if (bobRef.current) io.observe(bobRef.current);
    return () => { cancelAnimationFrame(frame); io.disconnect(); };
  }, []);
  return (
    <div style={{ position: "relative" }}>
      <div ref={bobRef} style={{ transform: "rotate(-4deg)", willChange: "transform" }}>
        <FifaCard {...props} flipRef={flipRef} starRef={starRef} starFloatDuration={6} />
      </div>
      {SCATTER.map((b, k) => (
        <div key={b.type} ref={(el) => { badgeRefs.current[k] = el; }} aria-hidden="true"
          style={{ position: "absolute", top: b.top - (rarity === "common" ? 38 : 0), [b.side]: b.x, width: 40, height: 40, filter: rarity === "legendary" ? undefined : `drop-shadow(0 0 6px ${RARITY_GLOW[rarity]}40)` }}>
          <BadgeIcon type={b.type} rarity={rarity} />
        </div>
      ))}
    </div>
  );
}

// All three achievement badges, at the rarity that matches the tier family.
const RARITY = { novis: "common", gangsa: "rare", perak: "epic", emas: "legendary" } as const;
const rarityFor = (name: string) => RARITY[getRankTier(name) as keyof typeof RARITY];
const badgesFor = (name: string) => ["mvp", "matches", "ranked"].map((type) => ({ type, rarity: rarityFor(name) }));

// The player row from Bolahh's leaderboard and friends lists (renderPlayerRow in LeaderboardPage.jsx),
// ported with the same theme colours, shown at #00 for the placeholder player.
function PlayerRow({ rank, ovr }: { rank: string; ovr: number }) {
  const theme = getCardTheme(rank);
  return (
    <div className="player-row" style={{ background: theme.bg, border: `1.5px solid ${theme.border}` }}>
      <div className="pr-pos" style={{ color: theme.muted }}>#00</div>
      <div className="pr-avatar" style={{ background: theme.statBg, border: `1.5px solid ${theme.border}`, color: theme.text }}>W</div>
      <div className="pr-meta">
        <span className="pr-name" style={{ color: theme.text }}>{PROFILE.name}</span>
        <span className="pr-rank" style={{ color: theme.text }}>{rank} · {PROFILE.position.toUpperCase()}</span>
      </div>
      <div className="pr-ovr">
        <div style={{ color: theme.text }}>{ovr}</div>
        <span style={{ color: theme.muted }}>OVR</span>
      </div>
    </div>
  );
}

export default function RankCardDemo() {
  const [i, setI] = useState(RANKS.length - 1);
  const rank = RANKS[i];
  const stats = statsFor(rank);
  const badges = badgesFor(rank.name);
  return (
    <div className="rank-demo-wrap">
      <div className="rank-tiers" role="group" aria-label="Rank tier">
        {RANKS.map((r, k) => (
          <button key={r.name} type="button" aria-pressed={k === i} onClick={() => setI(k)} data-family={getRankTier(r.name)}>{r.name}</button>
        ))}
      </div>
      <div className="rank-demo">
        <div className="rank-demo-col">
          <div className="rank-demo-head"><span className="rank-demo-label">Tilt and flip</span></div>
          <div className="rank-demo-card" key={`i-${rank.name}`}>
            <FifaCard profile={PROFILE} cardStats={stats} rank={rank.name} size="normal" interactive memberSince={JOINED} achievementBadges={badges} starFloatDuration={6} />
          </div>
        </div>
        <div className="rank-demo-col">
          <div className="rank-demo-head"><span className="rank-demo-label">360° rotation</span></div>
          <div className="rank-demo-card" key={`s-${rank.name}`}>
            <SpinningCard profile={PROFILE} cardStats={stats} rank={rank.name} size="normal" memberSince={JOINED} rarity={rarityFor(rank.name)} />
          </div>
        </div>
        <div className="rank-demo-col rank-demo-row">
          <div className="rank-demo-head"><span className="rank-demo-label">Leaderboard and friends display</span></div>
          <div className="rank-demo-card"><PlayerRow rank={rank.name} ovr={Math.round(Object.values(stats).reduce((a: number, b) => a + Number(b), 0) / 6)} /></div>
        </div>
      </div>
    </div>
  );
}
