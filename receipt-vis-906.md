# RECEIPT — VIS-906 (PARTIAL — lane in flight, updated after every proof)
Seat: Opus 5 — Fable-unvalidated · Lane: VIS-906 · Chair: Fable 5.1 · 2026-09-06
Dock: `$SC/laneANCHOR905`

## STATUS: PARTIAL (arrival verified; no car committed yet)

## P0 — arrival (CONFIRMED)
- `git rev-parse HEAD` = `0eb02811156fd5f181ca9e0f27443b6b4e1c1639` — matches the brief's `0eb028111`.
- `git log --oneline -3`: `0eb028111` (§905 follow-on car, ANCHOR-905's, NOT mine) over `6582958ce` (§904 capsule car = product tip) over `56ac834ad`.
- `git status --porcelain | wc -l` = **0**.
- `git rev-list --count 6582958ce..HEAD` = **1** (the anchor car).
- `node_modules` = 456 entries, symlinked; never materialised.
- `$SC/HOLD-VITEST` absent at arrival.

---

## P1 — CAR 1 measurement (CONFIRMED, all by `sed -n '<N>p'` at `0eb028111`)
The brief's premises re-derived: `wc -l src/App.jsx` = **947** ✅; mobile header `{isMobile && (` at **:533**, closing `)}` at **:560** ✅; bottom nav `{isMobile && (` at **:733**, closing `)}` at **:776** ✅; `MOBILE_NAV_PRIORITY` at **:88** ✅; `.slice(0, 5)` at **:482** ✅; mobile `AccountMenu` compact at **:550-558** with `onAccount={() => setView('account')}` at **:556** ✅. Every brief figure held.

Measured citation table (old → new), each re-verified after the edit:

| Doc row | Stale citation | Measured truth |
|---|---|---|
| `*File:*` | `App.jsx:358-424, 661-726` | `:533-560` (header), `:733-776` (bottom nav) |
| Cohesion | `App.jsx:318` | `:88` (`MOBILE_NAV_PRIORITY`) + `:482` (`.slice(0, 5)`) |
| Touch targets | `App.jsx:681`; `AccountMenu.jsx:90,117` | `:757` (`minHeight: 44`), `:758` (padding `SP.sm + 2`); `AccountMenu.jsx:97, 153` |
| Accessibility | `App.jsx:684-687`, `App.jsx:713` | `:759` fill, `:761` border, `:763` colour, `:764` weight, `:749` `aria-current`; `:713` green is DELETED |
| Distinctness | `App.jsx:700-723` | slot DELETED; bar children are `:742-774`; account control is `:550-558` |
| Consistency | `App.jsx:703` | slot DELETED; one import `:37`, mobile `:550-558`, desktop `:651-658` |

### The three findings that were FALSE, not merely stale
1. **"About correctly demotes to the account menu"** — FALSE. The dropdown carries Account / Messages / Manage subscription & credits and nothing else (`AccountMenu.jsx:185-201`; `grep -c about src/components/AccountMenu.jsx` = 0). About's real mobile door is the footer's `LegalRibbonRow` (`LegalRibbonRow.jsx:107`, mounted `App.jsx:728`), which the source itself documents at `App.jsx:85-86`. Verdict **good** survives — there is a door, and the landing route's footer suppression (`App.jsx:722`) is covered by `LandingBelowFold.jsx:326` mounting the same row.
2. **The green `#4A7A3A` account chip** — `grep -c 4A7A3A src/App.jsx` = **0**. The chip's tones are now `SHAFT_SAGE` / `SHAFT_STEEL` (`AccountMenu.jsx:136-138`), pinned at exactly `4.63` (`tests/design/contrast.test.js:495-496`), above AA (`:485-486`), with the old GREEN/GREEN_DEEP steps kept as negative controls (`:533-537`).
3. **Consistency "weak"** — CONTRADICTED by measurement, so **re-graded weak → good** as the brief authorises. One `AccountMenu` import (`App.jsx:37`); mobile `:550-558` and desktop `:651-658` render the SAME component with byte-identical `onSignIn`/`onAccount`/`onMessages`/`onManageSubscription` handlers (`:556` vs `:656`); the only delta is the `compact` prop (`:551`) — size/padding/`maxWidth`/44px floor, NOT the interaction model. Both open the same dropdown. The old "weak" rested wholly on the deleted single-chrome jump.

### CAR 1 proof
- `git diff --stat` = **exactly one file**, `docs/UIUX_AUDIT_AND_PLAN.md | 16 ++++---- (8 insertions, 8 deletions)`. Zero `src/`, zero `tests/`.
- **Docs-only ⇒ no vitest owed and no typecheck owed.** No file added/renamed/deleted ⇒ CAR 1 alone owes no `tests/lint/` directory run.
- Commit **`79b35fdcb62a0fd6ba6043bad5e1ef70f80da1d8`**; trailers verified via `git log -1 --format='%(trailers)'` = `Seat: Opus 5 — Fable-unvalidated` / `Lane: VIS-906`. Porcelain 0. Cars over `6582958ce` = **2**.

### ⚠ TWO LANE JUDGMENTS — VETOABLE (docs-only; revert is a one-line edit each)
- **J1 — I corrected the SECOND Overhaul bullet (the green account-chip re-check), which the brief did not name.** It instructs a future lane to re-check a colour with zero occurrences in the build. Same defect class, same subsection, fully measured (finding 2 above). Marked `[done — superseded by measurement 2026-09-06]` rather than deleted. Veto = restore the `**[low]**` bullet.
- **J2 — I corrected the two `AccountMenu.jsx:90,117` citations**, which are not `App.jsx:N` and so fell outside the brief's letter. They were stale in a cell I was already rewriting; leaving a known-false citation inside an edited line would have been dishonest. Measured: `:97` and `:153`.
- **Verdict cells left alone per the brief:** the Accessibility row's evidence would now support better than **adequate**, but the brief scoped re-grades to the Consistency row. Flagged inline in the cell for the chair.

### ⚠ OUT-OF-SCOPE DEFECT OBSERVED, NOT TOUCHED (chair row)
The NEXT subsection, "AccountMenu (chip + dropdown)" (`docs/UIUX_AUDIT_AND_PLAN.md`, the `*Purpose:*`/`*Layout today:*` lines and the two `**good**` rows), describes a **three-row dropdown ending in a divided, danger-toned Sign out** and cites `AccountMenu.jsx:145-163` / `:156-164`. Measured at `0eb028111`: the dropdown is `AccountMenu.jsx:185-201` and its three rows are **Account / Messages / Manage subscription & credits** — there is **no Sign out row and no divider** in the component. Two `**good**` verdicts there rest on code that is not in the build. Out of my brief's scope (I touched nothing); recommend a follow-on docs car.

---

## P2/P3 — CAR 2 measurement (CONFIRMED at `0eb028111`, before any test was written)

### The brief's premises, re-derived — three drifted, none load-bearing
| Brief claim | Measured |
|---|---|
| `HeraldBody.jsx:239-245` mounts `<WarResolveSection>` | **:240-246**; and it is the **sixth** child of the war grid, not the fifth — the brief's list omits `<DoorLensChip section="war" />` at :233 |
| `flag('warEconomySurfacing')` at `HeraldBody:192` | ✅ exact |
| `WarResolveSection` hosts at `:163, :171` | ✅ exact |
| `HowToUse.jsx:436` renders the voiced header via `PageHeader` | `:436` is `const voiced = useFlag('handbookVoice')`; **`<PageHeader {...header} />` is at :454** |
| `HowToUse.jsx:192` forks the essay coda inside `QuickStart` (:183) | `:192` is the `useFlag` read; **the fork is at :263** (`{voiced ? <VoicedConceptIntro /> : conceptIntro}`). `QuickStart` at :183 ✅ |
| `GuideSection` "always open (design §3)", `:71-73` | **:73-81** (the docblock's phrase is at :70-71) ✅ in substance |
| flags ship `true` | ✅ `flagRegistry.js:117` (`handbookVoice`), `:118` (`warEconomySurfacing`) |

### THE HOST CHAINS, AND WHICH MECHANISM EACH PRIMITIVE OFFERED
**War & Resolve** — `HeraldBody:231` → `HeraldSection:51` grid → **`:52 {children}`** → `HeraldBody:232` grid → `:240 {showResolve && …}` → `WarResolveSection:154` → **`:163 <Section heading="At war">`** → `WorldPulsePrimitives:187 <section>` → `:196 {children}`.
- `HeraldSection` — **offers no fold on this path at all.** Its `{children}` (:52) is rendered OUTSIDE the `<Section>` opened at :53, which wraps only the report feed. The brief's "inside `HeraldSection`" is true of the component, not of its fold. *Mechanism used: a positional source read, pinned in the test.*
- `WorldPulsePrimitives.Section` (:185-199) — **is not a fold.** Plain `<section>` + `<h3>` + unconditional `{children}`; no open state, no `defaultOpen`, no `aria-expanded`, no toggle. The file's only `useState` (:59) belongs to an unrelated input. *It offered NO runtime mechanism, so the source read was the only honest instrument.*
- `<Section heading="At war">` carries no `collapsible` ⇒ the walker's `hostOpenness` (:1420-1428) grades it **open**. *Mechanism used: source read of the opening tag, exactly as the walker does.*
- `RealmInspector` — no `<Section>`/`<Collapsible>` anywhere; its only `hidden` is `overflow: 'hidden'`, which is not a first-paint hide.
- ⚠ The one real gate is DATA, not a fold: `{atWar.length > 0 && …}` (:162). Hence the siege fixture.

**The Handbook** — `HowToUse:453 <Page>` → `:454 <PageHeader>` (header) and `:458 <GuideSection unit="quick">` → `QuickStart:183` → `:263` fork (essay).
- `GuideSection` (:73-81) — **not a fold**: plain `<section>` + `<h2>` + unconditional `{children}`, "the de-collapsed replacement for a former tab … always open (design §3)" (:70-71).
- `Page` and `PageHeader` (primitives) — plain divs; no fold, no `hidden`, no `aria-hidden`. `PageHeader` renders the title as `<h1>` (`as = 'h1'`, :27,:44), so the header is assertable by ROLE.
- *No primitive on this page exposes `aria-expanded` or a toggle heading, so the fold half is asserted at the DOM level instead — see the finding below.*

### ⭐ FINDING — `standalone` IS INERT, AND THE EXISTING PIN'S DOCBLOCK IS STALE
`export default function HowToUse()` (`HowToUse.jsx:429`) **takes no props**; `grep -c standalone src/components/HowToUse.jsx` = **0**. So `<HowToUse standalone />` (the existing pin, `handbookVoice.test.jsx:53,63,72,82`) and `<HowToUse />` (`AppViews.jsx:133`) mount the IDENTICAL tree — the brief's P3 question, answered.
Consequently `expandHandbook` (`handbookVoice.test.jsx:33-37`) is a **DEAD HELPER** and its docblock claim ("the Keeper's Handbook … is COLLAPSED by default", :30-32) is **STALE** — there is no `button[aria-expanded]` matching /Keeper/ in the rendered page. It is the very `openSection()` shape the walker condemns at :1294-1299. I did NOT delete it (it is not my car and the pins above pass); I pinned its premise dead instead, so a reintroduced fold reds.

## ⛔ STOP RULE: **NOT FIRED.** Both surfaces PASS the first-paint law.
No shut fold, no hidden ancestor, prose present on first paint with zero interaction, on both. No `test.todo`, no CAR 3, **zero `src/` bytes**.

## PREDICTIONS — IN WRITING, BEFORE ANY REGISTER INSTRUMENT RUNS
Tests added: warFaithSurfacing **+3**, handbookVoice **+3** ⇒ **N = 6**. `describe(` added: **+1** each ⇒ **M = 2**. No file added, renamed or deleted.
- **Lighting census** — `files` **2543 UNCHANGED**, `parked` 373, `credited` 2170 unchanged. `titles` 23653 + 1 (the anchor car's, already in the tree and not mine) + 6 = **23660**. `suiteTitles` 6333 + 2 = **6335**. The arm is sequenced and stops at the first failure, so I predict **exactly ONE red**: `expected 23660 to be 23653` (ACTUAL first), with suiteTitles never reached. The door is the chair's — I take no `LIGHTING_CENSUS_REFREEZE`.
- **Test ratchet** — totalTests 31970 + 1 + 6 = **31977**, and **NO DOOR OWED**: `check-test-ratchet.mjs` compares against `Math.floor(total × 0.9)` collapse floors (the anchor car's P4), and 31977 sits far above `floor(31970 × 0.9)` = 28773.
- **Negative-assertion frozen rows — UNCHANGED, both.** Scanned with the walker's own three rules (`BARE_NEGATIVE_RE` / `HELPER_RE` / `ANNOTATION_RE`, :92-98,:124-134): `tests/components/warFaithSurfacing.test.jsx` = **0 un-anchored ⇒ stays ABSENT from the frozen list** (it is absent today); `tests/components/handbookVoice.test.jsx` = **2 un-anchored, at :58 and :68, both PRE-EXISTING ⇒ stays at its frozen 2** (`negativeAssertionAnchor.walker.test.js:303`). Every negative I wrote is anchored: 4 via `expectAbsentWithAnchor`, 2 via a `// anchored:` line.
- **OSR** — `check-observed-shape-readers.mjs` = **1972 exact**, no drift (zero `src/` bytes).
- **Typecheck** — **NOT OWED**: zero `src/` bytes in either car. (A CAR 3 cure would have owed `typecheck:domain:strict` + `typecheck:ratchet`; no CAR 3 exists.)
