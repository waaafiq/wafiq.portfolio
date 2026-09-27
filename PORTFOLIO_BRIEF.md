# Portfolio site: build brief

Handover brief for building Hakeem Wafiq's internship portfolio. Read this whole file before writing code. Put it in the repo root (or copy it into CLAUDE.md) so every session starts from it.

## 1. Who it's for and what it must do

- **Owner:** Hakeem Wafiq, Media Technology student at Hanyang University ERICA (AI & Data Analytics and UI/UX tracks).
- **Goal:** land an internship. Role priority: **1. data analyst, 2. UI/UX designer or UX researcher, 3. graphic designer.**
- **Positioning:** "Data analyst who designs."
- **Audience:** recruiters who spend about a minute on the site, often on a phone. Every screen should make the work easier to understand, never slower to reach.

## 2. Tech

- Next.js (App Router) with TypeScript, deployed on Vercel. Owner already deploys ERICA Nav this way.
- Styling: CSS modules or Tailwind, your choice, but keep all colours, fonts and spacing as design tokens in one place.
- Motion: CSS for simple things. Use GSAP or Framer Motion only where the interaction needs it (drag, physics, scrubbing).
- Charts: hand-built SVG or a light library (for example visx or Recharts). Charts must be real, interactive charts, not images.
- No backend, no CMS, no analytics scripts for now.

## 3. Hard rules

- **Never invent content.** No made-up statistics, clients, testimonials, awards or quotes. If text is missing, leave a clearly marked `TODO:` placeholder.
- **ERICA Nav numbers come only from section 7 of this brief.** Don't recompute from any CSV.
- **No em dashes anywhere in the copy.** Use commas, colons or full stops. The owner dislikes them.
- **Metric units only**, if units ever come up.
- **Every interaction works by tap on mobile**, not only hover.
- **Respect `prefers-reduced-motion`:** turn off non-essential motion.
- **Nothing hides the work.** No intro or loading animations, no content that only appears after an interaction. The first screen shows real content.
- Keyboard focus is always visible. Every chart has a text or table equivalent for screen readers.

## 4. Site structure

One site, one URL. Pages:

1. **Home** `/`
2. **ERICA Nav** `/work/erica-nav` (the data case study, most important page)
3. **Bolahh** `/work/bolahh`
4. **Graphic design** `/work/graphic-design`
5. **About** `/about` (short bio, contact)

Each page must be linkable on its own, because the owner will send direct links in cover letters (the ERICA Nav page for data roles, the graphic design page for design roles).

## 5. Design direction

Inspired by campus wayfinding signage: clear, precise, confident. Lots of white space.

**Colour tokens (light mode)**

| Token | Hex |
|---|---|
| background | `#F5F7FA` |
| surface | `#FFFFFF` |
| ink (text) | `#12213A` |
| ink secondary | `#44526A` |
| muted | `#6B778C` |
| line | `#DCE2EB` |
| accent (signage blue) | `#1F4FB5` |
| accent soft | `#E6EDFA` |
| neutral bar | `#B7C0CE` |

**Dark mode** (support it, following the system setting): background `#0E1522`, surface `#152033`, ink `#E9EEF6`, ink secondary `#B6C1D3`, muted `#8C99AE`, line `#26344B`, accent `#7FA4F0`, accent soft `#1B2B47`, neutral bar `#4A5870`.

**Type** (Google Fonts)
- Headings: Bricolage Grotesque, 500 and 700
- Body: Atkinson Hyperlegible, 400 and 700 (chosen because it was designed for legibility, which fits the signage theme)
- Labels and numbers: JetBrains Mono, small, uppercase, slight letter-spacing

**Signature detail:** small dark "sign" chips, styled like a campus building sign, used for eyebrows and tags (for example a blue block reading `ERICA` followed by a label).

**Avoid:** gradients, stock photos, emoji, glassmorphism, identical rounded cards everywhere, everything centred.

## 6. Home page

1. **Hero:** "Hakeem Wafiq". Line: "Data analyst who designs." Sentence: "I turn research into products people can actually use." Button: "View work" (scrolls to projects). No resume on the site (owner removed it). Keep the hero short, not full-screen.
2. **Selected work** (large cards, in this order):
   - **ERICA Nav:** "Research and design for a campus wayfinding app. Survey of 45 students, statistical analysis, and a prototype." Tags: Data analysis, UX research, UI design.
   - **Bolahh:** "Interface redesign for a live futsal booking and player progression platform." Tags: UI design, Front end.
   - **Graphic design:** "Logos, icons, stickers and motion graphics." Tags: Branding, Motion.
3. **About (short):** Media Technology at Hanyang University ERICA, AI & Data Analytics and UI/UX tracks. Tools: Python, Excel, SPSS, Figma, Illustrator, After Effects.
4. **Contact:** hakeemwafiq04@gmail.com (show it as selectable text with a copy button), GitHub github.com/waaafiq.

Card interaction: a subtle lift on hover or tap and a preview of the key visual. No heavy effects.

## 7. ERICA Nav page (data case study)

A finished version of this page already exists as `erica-nav-research.html` (supplied with this brief). **Port its content, structure and charts into the site.** It is the source for copy and layout. The facts below are the source of truth for every number.

**Header**
- Title: "Why students get lost at ERICA, and what a map app should do about it"
- Lede: "A survey of 45 Hanyang ERICA students showed that the hardest part of getting to class is not finding the building. It is finding the room once you are inside, especially for students who don't read Korean."
- Details: My role: Questionnaire design, research, analysis, presentation. Team: Team project, Human-Computer System Design course (**do not state a team size**). Timeline: Spring 2026. Methods: Literature review, survey, χ², binomial test, one-way ANOVA.

**Key finding:** 64% of students had trouble finding a classroom or facility inside a building (29 of 45, binomial test vs 50%, one-tailed p = 0.036).

**Method:** 45 students, online questionnaire. 3 groups of 15 by Korean ability at admission: native, some Korean, no Korean. 3 question sections (language and campus familiarity, navigation experience, map tools). 2 papers reviewed: Yvette & Song (2026) bilingual campus app; Li & Giudice (2013) 2D vs 3D indoor maps.

**Findings (all numbers from the course presentation, do not change them):**

1. **Finding the room is as hard as or harder than finding the building.** Grouped bar chart. Trouble finding a building: native 33%, some Korean 53%, no Korean 67%. Trouble finding a room: 60%, 67%, 67%. Buildings by group: χ²(2, N = 45) = 3.379, p = 0.185 (not significant, a trend only). Rooms: binomial p = 0.036.
2. **The most-used map app works far less well for students who don't read Korean.** Bar chart of Naver Map helpfulness (1 to 5): native 4.39, some Korean 3.56, no Korean 2.75. 58% of students use Naver Map. Official campus map rated 4.00 / 4.00 / 3.75 (no significant difference). Scheffé post hoc: native vs some p = 0.028, native vs none p = 0.001, some vs none p = 0.151. Say the gap "suggests" it comes from the app; don't claim it proves it.
3. **Building numbers are the main source of confusion.** Horizontal bars, share of 45: can't search by building number 25 (56%), can't match timetable number to the map 22 (49%), directions stop at the building not the room 18 (40%), can't find entrance or floor 10 (22%), other 5 (11%). Sign clarity: 15 rated clear or very clear, 21 neutral, 9 unclear.
4. **The problem peaks in the first weeks of the semester.** Horizontal bars: first weeks of the semester 40 (89%), visiting a building for the first time 32 (71%), unfamiliar building name 14 (31%), other 4 (9%). First-months familiarity (1 to 5): native 1.87, some Korean 1.60, no Korean 1.47.

**Finding to requirement to feature table** (status chips: "In development" or "Later"):

| Finding | Requirement | How ERICA Nav responds | Status |
|---|---|---|---|
| 56% couldn't search by building number; Naver Map rated 2.75/5 by non-Korean readers | Multilingual search | Search by number or name with an EN / 한 toggle | In development |
| 49% couldn't match timetable numbers to the map; 89% struggled most in the first weeks | Building number and map integration | Personal timetable, turn-by-turn routes, campus shuttle schedule | In development |
| Only 15 of 45 rated campus signs clear | Visual building identification | Building photos on the map | In development |
| 64% struggled to find rooms; 40% said directions stop at the building | Indoor wayfinding | Not planned yet, comes after the core app | Later |

The app is **not finished**: the campus map is in progress and indoor maps are not planned yet (the hardest build, last on the list). Don't promote indoor navigation as an upcoming feature. Never describe any feature as live. No screenshots exist yet: leave `TODO:` image slots only if the owner asks for them.

**Validation:** course prototype tested with 10 students per group (1 to 5). Usability 4.03 / 4.27 / 4.31, usefulness 4.16 / 4.34 / 4.57, satisfaction 4.44 / 4.37 / 4.56 (native / some Korean / no Korean).

**Reflection:** more participants (some subgroups were very small); measure behaviour with timed tasks, not only opinions; ask about indoor navigation in more detail (only two survey questions covered it).

**Claims that must never appear** (not supported by the data): that lower Korean proficiency made students take longer (time was never measured); that the prototype made buildings easier to find (never compared or timed); that bilingual or icon labels got higher ratings (never compared).

**Bottom of page:** link "Full course presentation (PDF)" to `ERICA_Nav_Research_Presentation.pdf` (supplied).

**Chart interaction:** hover or tap a bar to see the exact count (for example "8 of 15 had trouble finding a building"). Highlight the bars that matter in the accent colour and keep the rest neutral. Direct labels on bars, a legend only where there are two series, recessive gridlines, the same colours in light and dark mode via tokens.

## 8. Bolahh page

- Title: Bolahh. Link: bolahh.com.
- Summary: redesign of a live futsal booking and player progression platform, Sep 2026.
- What was done: redesigned the player cards (added spin and tilt interactions), renewed the landing screen, fixed spacing and visual hierarchy across the interface.
- Process: designs roughed out in Figma, then built in code with AI-assisted development tools.
- **Signature interaction:** a player card visitors can spin and tilt themselves (pointer and touch driven, with a gentle return to rest). Rebuild it as a demo on the page.
- Before and after comparison of the landing screen and the player cards: a drag slider over two images. `TODO:` before and after images from the owner.
- Only use facts listed here. Anything else is `TODO:`.

## 9. Graphic design page

The owner hasn't picked final pieces yet. Build the layout and interactions with clearly labelled `TODO:` slots. Target: 3 logos, 1 sticker sheet (optional), 2 After Effects ads (done: Papago midterm, evian final). Icon set section removed by the owner.

- **Logos (3 slots):** each has a mockup switcher (tap or hover to cycle the logo across a sign, a shirt and an app icon), a "Show construction" toggle revealing the grid and a one-line concept note, and colour variants (light, dark, one-colour).
- **Icon set:** grid of icons. Each animates on hover or tap (for example an SVG line draw-in). Clicking one opens it at real sizes, 16, 24 and 48 px. Filled or outline toggle only if both versions are supplied.
- **Stickers (optional):** visitors can drag stickers around a board, with a slight peel or lift effect when picked up. Positions reset on reload. Must work with touch.
- **After Effects shorts (2 slots):** muted, play on hover or tap, with a scrub slider. Provide poster frames so nothing is blank before playing.

## 10. About page

Short bio (`TODO:` final text from the owner), email with copy button, GitHub. Languages: Malay (native), English (fluent), Korean (limited conversational).

## 11. Done means

- Lighthouse performance and accessibility both 90 or above on mobile.
- Works at 375 px width with no horizontal scroll.
- Light and dark mode both checked by eye.
- Reduced motion checked.
- Every number on the ERICA Nav page matches section 7 exactly.
- Every remaining gap is a visible `TODO:`, listed in a final summary to the owner.

## 12. Files supplied with this brief

- `erica-nav-research.html`: the finished ERICA Nav research page, to port.
- `ERICA_Nav_Research_Presentation.pdf`: trimmed course presentation, linked from the ERICA Nav page.
- Still to come from the owner: logo, icon, sticker and After Effects files; Bolahh before and after images; About text.
