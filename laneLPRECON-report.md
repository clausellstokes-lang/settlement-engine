# lane LP-RECON — report

**Mandate:** make the landing-page handoff dispatchable. **Mode:** read-only. Nothing
written in the repository; no ref moved; no worktree created; no npm/test/build run.

## OUTCOME (read this first)

**The handoff is NOT dispatchable as implementation work, and the ceiling that §318.3
named was resolved thirteen ODQ rows ago.** The "ceiling" is the owner's FOUR-LANE
AGENT-SEAT ceiling — not a test census, not a byte budget. It cleared on 2026-08-21
when V5-R collected; §319.3 dispatched TE-LANDING into the freed seat; §320 collected
that lane at **zero diff** and ratified its refusal. §347.1's queue row 8 —
"Landing-page handoff recon/compile (§318.3's queued-at-the-ceiling constraint resolved
first)" — is a **stale carry-forward of an already-discharged item**.

What IS real, dispatchable, and currently unowned is a much smaller thing I found by
independent measurement: **`docs/LANDING_HANDOFF_AMENDMENTS.md` makes a false
completeness claim.** It asserts "handoff + this file = current law", and its last
update is 2026-07-11 — **37 landing-estate commits ago**, at least fifteen of which
carry explicit owner orders. That doc is the only in-repo bridge between the Desktop
spec and the live page, and it is the artifact whose staleness manufactured §318.3's
dispatch error in the first place.

⚠ **Hazard hit during this recon, reported before anything else:** the main working
tree is NOT the build tip and NOT the ledger tip. See §0.

---

## §0 — TREE TOPOLOGY (measure here before trusting any figure below)

CONFIRMED by `git rev-parse` / `git for-each-ref`:

| tree/ref | sha | what it is |
|---|---|---|
| **`claude/composite-r4`** | `5d18b4a0` | ⭐ **THE BUILD TIP** (ODQ §352's CAS target) |
| `review-fixes-2026-07-08` | `2baa0302` (§361) | the LEDGER branch — carries the ODQ; **moved twice during this lane** |
| main worktree working copy | — | **4,720 porcelain lines divergent**; landing sources dated Jul 22 |

Three traps, each CONFIRMED by execution:

1. **`claude/composite-r4` is NOT an ancestor of the ledger branch.** The two branches
   carry *different* landing sources. `LandingBelowFold.jsx`, `src/copy/landing.js`, and
   `tests/ui/homeLanding.test.jsx` all differ between them (27 / 2 / 4 line delta). Any
   landing measurement taken on the ledger branch is wrong for the build.
2. **The main worktree is stale, not dirty-with-WIP.** Its `HomeLanding.jsx` still names
   the hero `village-1400.jpg` and section `02 Brief`; the build tip has the C2 FILM
   RULING hero (`/media/journey-legs/bg/still-0-desk.jpg`) and `02 Visual`. I read the
   worktree file first and it was misleading. **Read landing sources via
   `git show claude/composite-r4:<path>`, never from the working tree.**
3. **The ledger branch moved under me mid-lane** (§359 → §360 → §361 appeared between
   two of my reads; the ODQ grew 14,989 → 15,105 lines). Re-read the ODQ tail
   immediately before acting on it.

---

## §1 — THE HANDOFF DOCUMENT, READ IN FULL

**Path:** `/Users/cstokes/Desktop/Settlement Forge template review/HANDOFF - Landing Page for Claude Code.md`
**Present. 159 lines + trailing newline, 17,952 bytes, filesystem date Jul 11 02:00.**
No transcript-recovery route was needed. Siblings in the same folder: `Landing Page.dc.html`
(54,018 b, the approved prototype), `Dossier Redesign.dc.html`, `Index.dc.html`, `_ds/`
(design-system tokens), `assets/`, plus eight Higgsfield PNGs and
`V5-NANO-BANANA-REFERENCES.md` added later (Aug 4).

**What it asks for, section by section:**

- **§1 Objective** — replace the single-hero `HomeLanding.jsx` with a scrollable page
  that is "both advertisement and onboarding", walking the visitor down "the salt road"
  (Forge → Brief → Narrate → Canon/Realm → Gallery). Governing law: *derived, not
  rolled* — zero contradictions, zero dead controls, every claim shown as a real-looking
  artifact **rendered from components, never screenshots**.
- **§2 Files** — rewrite `src/components/HomeLanding.jsx` (identical export/mount
  contract); add all copy to **`src/copy/strings.js`**; reuse `Button`/`Badge`/
  `StateBadge`/`Card`, the `index.css` scrim system, `tokens.js`; assets = resized
  landing variants at `public/backgrounds/landing/*-1400.jpg`, ≤1400px, JPEG q≈70,
  ≤350KB each. No CSS framework, no styled-components, no new fonts.
- **§3 Global constraints (10, binding)** — tokens only, nothing sub-11px · gold the
  only brand accent, one gold primary per section, **violet ONLY on AI affordances** ·
  verbs Forge/Reforge/Save Draft/Canonize/Apply Event/Narrate/Export Dossier, CTA always
  "Forge…" never "Get started/Try/Generate" · Crimson Text display+prose, Nunito 700–900
  chrome, JetBrains Mono provenance · **no emoji, Lucide only** (map, hammer, sparkles,
  lock, arrow-right, chevron-down, book-marked) · **§3.7 the anon ceiling string exists
  ONCE and is the only place the free limit is stated** · every control routes,
  decorative chips are plain `<span>` · single `h1`, `<section aria-labelledby>`,
  AA over imagery · `prefers-reduced-motion` kills the cue bounce and parallax.
- **§4 Page architecture** — seven sections, rhythm dark→painted→plain→plain→painted→
  plain→dark; 1080px content column; `repeat(auto-fit, minmax(380px,1fr))`; plus the
  **salt-road waypoint spine** (56px hairline, 11px gold dot with 2px `#FFFBF5` ring,
  mono pill `01 · Forge` … `06 · Set out`, dark variant on dark sections).
- **§5 Backgrounds & scrims** — hero `background-attachment: fixed` (hero ONLY, iOS
  fallback preserved), min-height 86vh; cream scrims on §01/§04; on painted sections
  text never sits on the painting (0.9-alpha parchment panel, radius 8, tier-1 shadow).
- **§6 Section specs — copy verbatim.** Hero (eyebrow `A SIMULATOR FOR DUNGEON MASTERS`,
  h1 "Your players have a thousand choices. Now you have every answer.", sub containing
  "Not a dice roll.") · 01 Forge (Instant Draft artifact with **five size pills: Hamlet
  20–80, Village 80–400, Town 400–3,000, City 3,000–12k 🔒, Metropolis 12,000+ 🔒**, then
  the ceiling string) · 02 The brief (Briarhollow / Maera Voss authored dossier copy) ·
  03 The voice (RAW vs NARRATED cards, `✦ 1 credit`, the only violet on the page) ·
  04 The Realm (why-trace `ADVANCE TIME — MONTH 7`, realm map card, Chronicle) ·
  05 The commons ("Towns other DMs have forged.", 3 decorative gallery cards) ·
  06 Set out (three tiers Wanderer/Cartographer/**Founder = LIFETIME, one payment**;
  no prices on the page).
- **§7 Responsive** — verify 360/768/1200; h1 58→34px; ≥44px tap targets.
- **§8 Performance budget** — ≤1 fixed layer; images ≤1400px/≤350KB; **total ≤1.6MB**;
  IntersectionObserver swap for below-fold scenes; LCP <2.5s.
- **§9 QA checklist** — 10 items (one h1 · ceiling appears exactly once · zero
  handler-less interactives · violet only §03 · one gold primary/section · AA panels ·
  no font <11px · reduced-motion · Lighthouse LCP/CLS · copy verbatim).
- **§10 What NOT to do** — no screenshots-as-images, no new colors, no carousel or
  scroll-animation libraries, no restating tier limits outside ceiling + tier strip.
- **§11 strings.js additions** — the full `landing.*` key list, ending
  `footer.tagline ("derived, never rolled")`.

**Assets it references — all five exist at the exact named paths and are UNDER budget.**
CONFIRMED at the build tip by `git cat-file -s claude/composite-r4:…`:

| file | bytes | ≤350KB |
|---|---|---|
| `public/backgrounds/landing/city-1400.jpg` | 228,429 | PASS |
| `public/backgrounds/landing/create-1400.jpg` | 158,032 | PASS |
| `public/backgrounds/landing/thorpe-1400.jpg` | 303,645 | PASS |
| `public/backgrounds/landing/village-1400.jpg` | 268,788 | PASS |
| `public/backgrounds/landing/world-map-1400.jpg` | 153,282 | PASS |
| **total** | **1,112,176 (1.06 MB)** | PASS (≤1.6 MB) |

Nothing to generate, resize, or re-encode.

---

## §2 — THE CEILING CONSTRAINT, DECODED

**§318.3 verbatim** (ODQ `review-fixes-2026-07-08:docs/OWNER_DECISION_QUEUE.md`, the
row headed *"§318 · THE ARROW/RIBBON ANSWERED … THE LANDING-PAGE HANDOFF DISCOVERED AND
QUEUED AT THE CEILING (2026-08-21; chair: FABLE)"*):

> ⭐ **THE LANDING-PAGE HANDOFF IS DISCOVERED AND IS REAL QUEUED WEBSITE WORK**: the
> owner's design project holds "HANDOFF — Landing Page for Claude Code.md" (159 lines,
> an approved-prototype implementation spec: rewrite HomeLanding.jsx as the scrollable
> advertisement+onboarding "salt road" page, tokens-only, verbs/type/color law,
> every-control-works, A11y, reduced-motion) beside the approved prototype and reference
> assets. **QUEUED FOR THE NEXT FREED AGENT SLOT** — four lanes are at the owner's
> ceiling now (T2B, WF1C, NOTICES, V5-R); the landing implementation dispatches the
> moment one collects, with the HANDOFF as its binding spec and the BRAND-landing
> conventions loaded. It lands dark-until-deploy like every product surface; the deploy
> stays the owner's gate.

**The ceiling it names is the owner's FOUR-LANE AGENT-SEAT ceiling.** CONFIRMED — the
row enumerates the four occupants by name (T2B, WF1C, NOTICES, V5-R) and states the
release condition as "the moment one collects". Corroborated by the standing directive
(memory `owner-directives-2026-08-21-sitting.md`, ODQ §291, and
`docs/RESUME_STATE.md:60`: *"30-min ScheduleWakeup cadence + up to FOUR lanes (ONE
landing/ONE gate stand)"*). **It is not the test census and not a byte budget.**

**It has already been discharged.** CONFIRMED, three consecutive rows:

- **§319.3** — *"THE FREED SLOT DISPATCHES §318.3's LANDING PAGE: TE-LANDING (Opus,
  slot-aware, CAS queue last) implements the HANDOFF spec exactly…"*
- **§320.1** — *"COLLECTED — ZERO DIFF, AND THE REFUSAL IS THE DELIVERABLE. The
  salt-road landing page ALREADY EXISTS (commit a943cd8d + ~15 successors)… THE REFUSAL
  IS RATIFIED AS EXEMPLARY — live code outranks a delivered spec."*
- **§320.2** — the chair's own dispatch error banked as law: *"A DELIVERED SPEC IS
  PRESUMED IMPLEMENTED UNTIL THE LIVE TREE SAYS OTHERWISE."*

**Therefore §347.1's queue row 8 is stale.** Its parenthetical asks for a constraint to
be "resolved first" that resolved on 2026-08-21, gating work that was executed and closed
the same day. The current queue head (§361.2) is CT-0/TC-DOSSIER; nothing between §347
and §361 re-opens the landing item.

### Headroom actually measured at the build tip (`claude/composite-r4` = `5d18b4a0`)

All read-only, via `git show` / `git cat-file`. No test was run.

| ceiling | value at build tip | headroom | label |
|---|---|---|---|
| **Agent lane seats** | 4 max (§291) | queue head is CT-0 (§361.2) | CONFIRMED |
| **Test-failure census** — `scripts/.test-ratchet-baseline.json` entries vs `tests/lint/testRatchet.test.js:179 const CEILING = 17` | **11 / 17** | **6 rows** | CONFIRMED |
| Census `skippedCeiling` | 1 | — | CONFIRMED |
| Walker ledgers (`testRatchet.test.js:754/767`) | `ADMITTED_CEILING = 4`, `OWED_CEILING = 8` | — | CONFIRMED |
| `scripts/.size-baseline.json` | **no landing file has an entry** — all sit under the 600-line component layer ceiling | see below | CONFIRMED |
| Landing asset budget (spec §8) | 1,112,176 b | 0.49 MB under 1.6 MB | CONFIRMED |

⭐ **A standing memory is now WRONG and should be corrected.**
`memory/test-census-ceiling-forecloses-new-rows.md` (measured 2026-08-10 at `9df7e428`)
says the census sits at **17/17 — zero headroom, "JUST CENSUS IT IS NOT AVAILABLE"**. At
the build tip the baseline holds **11 entries against the same literal `CEILING = 17`**.
The census has been burned down by six; six attributed rows of headroom now exist. (The
ledger branch still carries the old 17-entry copy — another reason §0 matters.) The
ceiling literal itself is unchanged and still monotone-down; the *scarcity* claim is what
expired.

Per-file size headroom (effective lines ≈ eslint `skipBlankLines`+`skipComments`;
my count approximates eslint's — treat the exact numbers as **PLAUSIBLE**, the
"comfortably under 600" conclusion as CONFIRMED since none of these files needs a
`.size-baseline.json` entry):

| file (build tip) | raw | eff≈ | layer ceiling | headroom≈ |
|---|---|---|---|---|
| `src/components/home/LandingBelowFold.jsx` | 513 | 413 | 600 | ~187 |
| `src/components/home/LandingArtifacts.jsx` | 425 | 337 | 600 | ~263 |
| `src/components/home/landingFixture.js` | 206 | 181 | 800 | ~619 |
| `src/components/home/HomeSampleDossier.jsx` | 174 | 130 | 600 | ~470 |
| `src/components/HomeLanding.jsx` | 146 | 102 | 600 | ~498 |
| `src/copy/landing.js` | 244 | 137 | 800 | ~663 |

---

## §3 — THE COLLISION MAP: HANDOFF ASKS vs WHAT IS ALREADY LIVE

Applying the §320 law (a delivered spec is presumed implemented until the live tree says
otherwise), I re-derived the delta from the build tip rather than from the spec.

**Files the handoff would touch, and their live state** — CONFIRMED at
`claude/composite-r4`:

| spec §2 target | live at build tip | delta |
|---|---|---|
| rewrite `src/components/HomeLanding.jsx` | exists, 146 L; docstring cites the spec by number ("spec §3.5", "spec §8", "spec §9/§10"); hero-only + `React.lazy` below-fold chunk | **none** |
| copy in `src/copy/strings.js` | **no such file** — copy lives in `src/copy/landing.js` (244 L) with its own `tl()` resolver, lazily segmented for the first-paint byte budget | spec clause **obsolete** |
| (not in spec) | `src/components/home/LandingBelowFold.jsx`, `LandingArtifacts.jsx`, `landingFixture.js`, `HomeSampleDossier.jsx` | built beyond spec |
| `public/backgrounds/landing/*-1400.jpg` | all five present, all under budget (§1 table) | **none** |
| §9 QA checklist | already an enforced test estate — 11 files reference the landing at the build tip | **none** |

**Live landing test estate** (CONFIRMED, `git grep -l` at the build tip):
`tests/ui/homeLanding.test.jsx` (255 L) · `tests/copy/landingClaimsParity.test.js` ·
`tests/components/welcomeJourney.test.jsx` · `tests/components/landingFooterMigration.test.jsx` ·
`tests/build/loadingJourneyLazy.test.js` · `tests/build/vendorPdfLazy.test.js` ·
`tests/copy/voiceMechanics.test.js` · `tests/docs/docCounts.test.js` ·
`tests/lint/lucideTotality.test.js` · `tests/store/campaignRuntimeRouteGate.test.js` ·
`tests/ui/authMobileReflow.test.jsx`.

**Superseded spec clauses (a re-implementation would REVERT these).** I independently
re-derived the commit chain; it agrees with §320 and the TE-LANDING receipt:

| spec clause | superseded by (verified in `git log`) |
|---|---|
| hero over village scene, `background-attachment: fixed` | **C2 THE FILM RULING** — `46ef7167` (2026-07-19), hero over `still-0-desk.jpg` + journey film |
| hero eyebrow `A SIMULATOR FOR DUNGEON MASTERS` | removed, no replacement — `docs/LANDING_HANDOFF_AMENDMENTS.md` §W-L1 A |
| hero sub "Not a dice roll." | `5edac6f0` (2026-07-11) |
| Instant Draft widget, five size pills | deleted, owner order 2026-07-22 — `6736eeff`; Cnocby `MiniDossierCard` took the slot |
| sizes Hamlet 20–80 / Village 80–400 / Town 400–3,000 … | **the spec's figures are WRONG** — Walk W1 owner order 2026-07-21, `85b6af4e`/`4b1459bb`, corrected to engine canon `POPULATION_RANGES`; adopting them re-creates the exact landing-vs-Create contradiction W1 was ordered to fix |
| `02 · The brief`, Briarhollow/Maera authored copy | `6736eeff` retitle to `02 · The visual`; W-L2/1 replaced authored copy with **frozen real engine output** (`landingFixture.js`, seed `lf-033` → Cnocby) |
| §03 `✦ 1 credit` | repriced to 5 credits |
| §04 `ADVANCE TIME — MONTH 7` | engine unit is **weeks** — `Advance time · week {week}` |
| §05 three decorative gallery cards | six slots fed live from the real gallery — Walk W1 |
| §06 three tiers, Founder = LIFETIME one payment | **four tiers** incl. Surveyor AI band; **DOM-3 `cea076f5` — "a chair is given, never sold"**, ODQ §118; 2×2 grid per orders 9–11 |
| §11 `footer.tagline` "derived, never rolled" | key deleted — `c2631ee9` |
| §10 "no em dashes" era copy | `e26f082f` |

**HELD (the spec's law is live and pinned):** single `h1` + `aria-labelledby` sections ·
waypoint spine incl. dark variant · tokens-only · violet confined to §03 plus the §04
faith chip (which §6 itself permits) · every control routes, decorative chips are spans ·
Lucide only, no emoji · reduced-motion.

### ⭐ THE ONE TRUE DELTA I FOUND — and it is not in §320's list

**`docs/LANDING_HANDOFF_AMENDMENTS.md` is stale and states a falsehood about itself.**

Its opening claim (identical on both branches, byte-for-byte):

> The binding spec is `HANDOFF - Landing Page for Claude Code.md` (the design project).
> **This file records every owner amendment issued since; handoff + this file = current
> law.** Sections below are numbered by wave.

CONFIRMED by measurement:

- Its last commit is **`35dd9293` (2026-07-11, "W-L2")**. It documents waves W-L1 and
  W-L2 only.
- **37 commits touching `src/components/home/`, `src/components/HomeLanding.jsx`, or
  `src/copy/landing.js` post-date it** on the build branch (`git log 35dd9293..claude/composite-r4 -- …`).
- At least fifteen of those name an owner order or ruling in their subject line, among
  them `46ef7167` (C2 film ruling), `85b6af4e`+`4b1459bb`+`cac062a2` (the W1 walk),
  `6736eeff` (orders 9–11), `01bbc1aa` (delegated launch-tail rulings), `35ac0d52`
  (owner order superseding the film ruling's stop-4 line), `c2631ee9` (tagline deleted).

This is the **mechanism** behind §320.2's banked chair error, not merely a symptom of it.
The chair reached for the Desktop spec because the in-repo bridge document silently
claimed to be current. Repairing that claim is what actually forecloses the class:
§320.2's cure ("one grep of the target surface, and it belongs to the chair BEFORE the
lane") depends on a chair remembering to grep; a truthful amendment ledger removes the
need to remember.

⚠ Hazard for whoever repairs it: editing any `docs/**.md` is a gate risk — naked-claim
debt is **per-claim** and a new claim can red an otherwise green test
(`tests/docs/enforcement-claims.test.js`, which is itself one of the 11 banked census
rows). Run the exact `CLAIM_RE` before writing. Also note `tests/docs/docCounts.test.js`
is in the landing-referencing set.

---

## §4 — ⚠ THE §320.3 ANON-CEILING DISCLOSURE QUESTION (FLAGGED, NOT RESOLVED)

**Where the handoff touches it — four places.** The spec is unusually emphatic here:

- **§3.7 (binding)** — *"Anon ceiling string exists ONCE (§11 `landing.ceiling`) and is
  the only place the free limit is stated: 'Free mode forges up to a Town. Sign in for
  all sizes, saving, and full Basic / Advanced control.'"*
- **§6 / 01 Forge** — the artifact ends *"Divider, then the ceiling string (§3.7),
  12px/700"*, immediately below the five size pills whose City/Metropolis entries are
  lock-iconed at opacity 0.55.
- **§9 QA** — *"Grep: the anon ceiling appears exactly once, from `strings.js`."*
- **§10** — *"Don't restate tier limits anywhere outside the ceiling string + tier strip."*

**Live state — the inverse is pinned.** CONFIRMED at the build tip:

- `src/copy/landing.js:52` — the key survives, owner-reworded:
  `ceiling: 'Without an account, forge up to a Town. Sign in free for every size, saving, and full Basic / Advanced control.'`
- `tests/ui/homeLanding.test.jsx:104-107` — a test titled *"the anon ceiling string does
  not appear on the landing"* asserting `expect(screen.queryAllByText(landing.forge.ceiling)).toHaveLength(0);`,
  with the owner walk order 2026-07-22 recorded inline at lines 100–102 (the Instant
  Draft widget that carried it was deleted; the ceiling copy now lives on the Create
  page's picker).
- `tests/copy/landingClaimsParity.test.js:47` still claim-binds the inert key to
  `ANON_MAX_SIZE_LABEL`, so it cannot silently drift out of parity with enforcement.
- Net: **the landing discloses the anonymous size cap nowhere.** The hero says "Free. No
  account needed to forge your first town."; `forge.micro` says "No account needed";
  neither states the cap.

**⛔ FLAGGED, NOT RESOLVED — and its governance status has moved since §320.3, which the
sitting appears to have missed.** Tracing it forward:

- **§320.3** docketed it as *"an OWNER product-disclosure question, docketed with
  §317.1's list."*
- **§336** — the owner's blanket grant ("I give permissions if that is what you're
  asking for") was interpreted, vetoably, to convert a named list of preference-shaped
  items into **chair rulings**, and that list **explicitly includes "§320.3's
  disclosure"**. It is named alongside the by-nature carve-outs it is *not* — lens
  entitlement, cull, support email, licence elections, tuning signature, every push.
- **§359 — the delegated decision sitting that executed §336.1 — did NOT rule it.** I
  read all eleven rulings and all seven stay-owner items: **§320.3's disclosure appears
  in neither list.** It is not ruled, and it is not recorded as staying with the owner.

So the item is currently **chair-delegable by §336, unruled by §359, and unassigned** —
a dropped thread rather than a parked one. Per my mandate I am flagging, not resolving.
The chair should decide explicitly whether it (a) rides the website train's charter
alongside §359 items 6–10, (b) gets its own ruling row, or (c) is returned to the owner
notwithstanding §336. Two sub-facts a ruling will want: the string is already
owner-reworded (so the spec's verbatim text is not the candidate copy), and the absence
is *pinned*, so any change is a two-file act (copy + the inverse pin) plus a census-title
check.

**Adjacent, smaller, and also unowned — RAISED-3 from the TE-LANDING receipt, which I
re-verified at the build tip:** `LandingBelowFold.jsx:232` builds
`const TIER_FACT_VARS = { anonSize: ANON_MAX_SIZE_LABEL, freeSaves: FREE_SAVE_LIMIT, seats: FOUNDER_SEATS };`
while no surviving tier body carries an `{anonSize}` token — the binding is inert, and
the comment above it at line 229 still describes `{anonSize}` as live, which is the part
that will mislead the next reader. `tests/copy/landingClaimsParity.test.js:53` already
records the retirement. Cosmetic; deliberately deferred by the prior lane; **documented,
not a bug to re-find.**

---

## §5 — DISPATCH-READINESS VERDICT

### What blocks a TE-LP executor: the premise

**⛔ Do not dispatch an implementation lane against this handoff.** The work is done; the
spec is its origin document; §320.1 ratified the refusal as exemplary. A lane briefed to
"implement the handoff" would revert the C2 film ruling, the W1 population correction,
DOM-3, the Surveyor band, the six-slot commons, the Brief→Visual retitle, and the deleted
tagline. **Recommended chair act: strike §347.1 row 8 and replace it** with the two
scoped items below, or close it citing §320.

### What IS dispatchable — TE-LPDOC (recommended, chair-scope, low risk)

**Subject: make `docs/LANDING_HANDOFF_AMENDMENTS.md` true.** Fold the 37 post-`35dd9293`
landing commits into a W-L3+ amendments section, or replace the false completeness claim
with a mechanically honest one (e.g. a pointer to `git log -- <the four landing paths>`
as the authority, which cannot rot).

- **Files (exact per-file targets — broad fences are forbidden by
  `docs/implementation/PACKET_STANDARD.md:574`, verified: *"Broad fences such as
  `src/domain/**`, `src/components/**`, or `tests/**` are not allowed"*):**
  `docs/LANDING_HANDOFF_AMENDMENTS.md` — **one file, docs-only.**
- **Budget:** ~1.5–2.5 lane-hours (the commit archaeology is the work; the write is small).
- **Tests / census exposure:** **no new test file, no new test title → zero census
  exposure.** The risk is entirely the docs-claim gate: run the exact `CLAIM_RE` before
  and after (`tests/docs/enforcement-claims.test.js` is one of the 11 banked rows —
  reddening it differently is a regression, not a bank). Sweep
  `vitest run tests/lint tests/build` before the gate per the five-ratchets law.
- **Census headroom if anything does need banking:** 6 rows (11/17). Not expected to be
  needed.
- **Packet scope:** not a packet surface. `PACKET_STANDARD.md` scopes packets to
  "implement a not-yet-built subsystem slice"; this is a documentation repair.

### Also dispatchable, but only after a chair ruling

- **The §320.3 disclosure** (see §4). Needs a ruling first — it is *unruled*, not
  *unassigned-to-a-lane*. If ruled "disclose", the executor's targets are exactly
  `src/copy/landing.js` (the string, already worded), the rendering site in
  `src/components/home/LandingBelowFold.jsx`, and `tests/ui/homeLanding.test.jsx:104-107`
  (the inverse pin must flip, and its **title is a census key** — changing a title is a
  census event; cure only with a separate passing pin, never by renaming). Budget ~2–3
  lane-hours. If ruled "do not disclose", the correct act is a one-line comment at the
  pin recording the ruling, ~15 minutes.
- **RAISED-3's inert `anonSize` binding** — fold into whichever landing lane runs next;
  ~15 minutes; `LandingBelowFold.jsx:229,232` only. Not worth its own seat.

### Standing conditions any landing lane inherits

1. **Base off `claude/composite-r4`**, never the ledger branch, never the main worktree (§0).
2. **Load the `BRAND-landing` skill and read `copy/brand-kit.md` first** — §318.3
   specified it and it remains correct for any landing work.
3. **Landing suites are load-flake-prone.** CONFIRMED mechanism from the prior lane: at
   load average 71→90 the `React.lazy` below-fold chunk exceeds its 10s first-mount
   budget; `homeLanding` 11/11 and `welcomeJourney` 4/4 pass in isolation. Tell: transform
   28.65s→5.35s, environment 23.39s→3.37s, and *later* tests in the same file pass on the
   module cache while first-mount ones fail. **Never bank these as code reds.**
4. **Dark-until-deploy**; the deploy stays the owner's gate (§318.3).

---

## §6 — EVIDENCE-PRESERVATION FLAG (chair action owed)

`laneTELANDING-receipt.md` (12,555 b, 2026-08-21 14:06) — the receipt §320 cites as its
basis — exists **only in the shared session scratchpad** at
`/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/6298872d-53af-4c8a-99e5-139bfc5bfc1f/scratchpad/laneTELANDING-receipt.md`,
alongside four of its logs and the lane's worktree. CONFIRMED: it is **absent from
`refs/preserve/program-receipts-2026-08-21`** (I listed that ref's tree; it holds 27
`receipts/*` and 12 `session-2026-08-21/*` entries, none of them TE-LANDING).

This is precisely the loss mode §318.2 banked as twice-proven law — *"banked deliverables
fold to a durable surface the day they bank"* — and §312.3/§351.1 generalize
(*"a HASH-CITED file must be a committed object the day it is cited"*). The receipt is
the sole detailed record of a ruling §320 called exemplary, and the scratchpad is shared
and periodically purged. **Recommend folding it into the preserve ref at the next
collection.** I did not move it: LP-RECON is read-only.

---

## Labels

- **CONFIRMED** (executed reads/greps this lane): the handoff's existence, byte size,
  and full content · all five assets' presence and byte sizes at the build tip · the
  §318.3 quotation and its four-lane ceiling · §319.3/§320.1/§320.2/§320.3's text ·
  §336's inclusion of §320.3 in the delegable list · §359's eleven rulings and seven
  stay-owner items containing no §320.3 entry · §347.1 row 8's wording · the branch
  topology and worktree staleness · the ratchet baseline's 11 entries against
  `CEILING = 17` · the absence of landing entries in `.size-baseline.json` · the live
  ceiling string and its inverse pin · the inert `anonSize` binding · the amendment
  doc's last commit and the 37 subsequent landing commits · `PACKET_STANDARD.md:574` ·
  the TE-LANDING receipt's absence from the preserve ref.
- **PLAUSIBLE** (reasoning or approximation, not executed): the per-file *effective*
  line counts in §2 (my blank/comment filter approximates eslint's
  `skipBlankLines`+`skipComments` but is not eslint) — the conclusion that no landing
  file approaches its layer ceiling is CONFIRMED by their absence from
  `.size-baseline.json` · the lane-hour budget estimates in §5 · the inference that
  §347.1 row 8 is a stale carry-forward rather than a deliberate re-queue (the
  parenthetical cites §318.3 rather than §320.3, and no ODQ row between §320 and §361
  re-opens it, but no row explicitly retires it either).
- **NOT MEASURED** (compute constraint — a protected gate was running): no test, build,
  lint, or npm command was executed by this lane. Every figure above comes from `git
  show`/`git cat-file`/`git log`/`git grep` and file reads.
