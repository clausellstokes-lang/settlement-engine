# RECEIPT — VIS-906 (COMPLETE — two cars landed, every proof executed)
Seat: Opus 5 — Fable-unvalidated · Lane: VIS-906 · Chair: Fable 5.1 · 2026-09-06
Dock: `$SC/laneANCHOR905`

## STATUS: COMPLETE — CAR 1 `79b35fdcb`, CAR 2 `2f1f9381f`. STOP RULE NOT FIRED (both surfaces PASS the first-paint law); no CAR 3 exists and none is needed. One register act is OWED TO THE CHAIR: the lighting-census refreeze (retrovalidation R7).

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

---

## CAR 2 — proofs (all mutex-serialised, exits captured in-shell with `CMD; E=$?`)
| # | Proof | Exit | Result |
|---|---|---|---|
| 1 | `npx vitest run tests/components/warFaithSurfacing.test.jsx` | **0** | 16/16 (13 pre-existing + 3 new) |
| 2 | `npx vitest run tests/components/handbookVoice.test.jsx` | **0** | 6/6 (3 pre-existing + 3 new) |
| 3 | `npx vitest run tests/ui/warResolveSection.test.jsx` — **UNTOUCHED** | **0** | 4/4 |
| 4 | `GATE_MUTEX_TIER=shared … npx vitest run tests/lint/ --maxWorkers=2` | **1** | Test Files 1 failed \| **139 passed (140)**; Tests 1 failed \| **2193 passed (2194)** |
| 5 | `node scripts/check-observed-shape-readers.mjs` | **0** | "observed-shape readers: **1972** finding(s), exactly matching the frozen inventory." |

### The ONE red, quoted (ACTUAL first, as vitest prints it)
`tests/lint/sovereigntyLightingContract.walker.test.js:7455` — "THE CENSUS IS AN ASSERTION, NOT A SENTENCE":
```
AssertionError: the live TEST-title count moved from SP-C's measured 18,471 … :
  expected 23660 to be 23653 // Object.is equality
- Expected  23653
+ Received  23660
```
**ACTUAL 23660 · EXPECTED 23653.** 23653 + 1 (the anchor car's, already in the tree and not mine) + 6 (mine) = 23660 — **the figure predicted in writing above, exactly.** The arm is sequenced and stopped here, so `files` (2543), `parked` (373) and `credited` (2170) each PASSED before it — executed proof that no file moved — and `suiteTitles` (6333 → 6335) was never reached. **NOT cured and NOT banked:** the baseline's `_doc` forbids hand-editing the five figures and the only legal cure is the `LIGHTING_CENSUS_REFREEZE` door, which is the chair's. Every other arm of all 140 lint files is green, the whole scanner family included.

### Register outcomes vs predictions
| Register | Predicted | Measured | |
|---|---|---|---|
| Lighting `titles` | 23660 | **23660** | ✅ |
| Lighting `files` / `parked` / `credited` | 2543 / 373 / 2170 unchanged | passed before the stop | ✅ |
| Lighting `suiteTitles` | 6335, unreached | unreached | ✅ |
| Negative-assertion — `warFaithSurfacing` | ABSENT (0) | **absent** — walker green | ✅ |
| Negative-assertion — `handbookVoice` | **2** (:58, :68, pre-existing) | **2**, row untouched at `:303` — walker green | ✅ |
| Test ratchet | 31977, NO door | no ratchet arm red in the dir run | ✅ |
| OSR | 1972 exact | **1972 exact** | ✅ |
| `src/` bytes | zero | **zero** — `git diff --stat` = 2 test files only | ✅ |
| Typecheck | not owed | not owed, not run | ✅ |

### ⭐ THE INSTRUMENT'S OWN NEGATIVE CONTROL (an assertion that cannot fail is not a proof)
The ancestor walk was proven able to FAIL rather than assumed to be:
- Backup taken BEFORE the plant → `$SC/vis906-scratch/handbookVoice.PREPLANT.bak`.
- PLANTED `essay.parentElement.setAttribute('aria-hidden','true')` → **EXIT 1**, 1 failed | 5 passed, message `FIRST-PAINT LAW [guide → voiced essay]: <div> on the host chain hides the surface with aria-hidden="true". A lit sentence a reader cannot see is dark.`
- RESTORED by inverse edit → `cmp` against the backup: **IDENTICAL**. Re-run **EXIT 0**, 6/6.
- `grep -rn VIS906 tests/ src/` → **no marker in the tree**.
The four `expectAbsentWithAnchor` negatives carry their own vacuity guard (the helper asserts the anchor sibling is PRESENT before asserting the member is absent), so all six negatives in this car are non-vacuous by construction.

### The rendered text, for the chair's TASTE read (no taste judgment made in this lane)
- `$SC/vis906-scratch/rendered-war-resolve.txt` — 520 bytes, the `WarResolveSection` root's `textContent` in DOM order (intro line → "At war" → both settlement cards).
- `$SC/vis906-scratch/rendered-handbook.txt` — 14,766 bytes, the guide page's `textContent`, opening on the voiced header.
⚠ PROVENANCE: the war dump came from a 2-line TRANSIENT PLANT in the (green) suite, run with `VIS906_OUT`, removed by inverse edit and `cmp`-verified identical. A standalone throwaway dump file was tried first, rendered an empty body, and was DELETED — it is not in the tree and no register instrument ever saw it (porcelain was verified to be exactly my two test files before proof 1 ran).

## DOCK TIP
`2f1f9381f6a3f096b1a6e57bf3ab0a9686912222` · **3 cars over `6582958ce`** (`0eb028111` ANCHOR-905's, NOT mine · `79b35fdcb` CAR 1 DOCS-906 · `2f1f9381f` CAR 2 VIS-906) · porcelain **0** · both my cars carry `Seat: Opus 5 — Fable-unvalidated` then `Lane: VIS-906`, verified with `git log -1 --format='%(trailers)'`. The anchor car was never amended, rebased, reset or rewritten.

## RETROVALIDATION ROW — what the Fable chair must re-derive
| # | What was judged | What the chair must re-derive | Receipts | Priority |
|---|---|---|---|---|
| R1 | **The Consistency verdict re-graded weak → good** in the audit doc. | That "same component + same handlers + `compact` changes only size" really does retire the "different interaction model" finding — the brief authorised this re-grade *if* measurement contradicted "weak", and it did. | `docs/UIUX_AUDIT_AND_PLAN.md` Consistency row; `src/App.jsx:37, 550-558, 651-658, 556, 656, 551` | **HIGH** — the only verdict cell moved. |
| R2 | **J1 — I corrected an Overhaul bullet the brief did not name** (the green account-chip re-check), marking it `[done — superseded by measurement]`. | Whether an unrequested (if fully measured) docs correction is in scope for this car, or should be reverted to `**[low]**` and re-opened as its own row. | `grep -c 4A7A3A src/App.jsx` = 0; `AccountMenu.jsx:136-138`; `tests/design/contrast.test.js:485-486, 495-496, 533-537` | **MED** — vetoable by a one-line edit. |
| R3 | **J2 — I corrected two `AccountMenu.jsx` citations** (`:90,117` → `:97,153`), which are not `App.jsx:N` and so fell outside the brief's letter. | Whether the citation sweep was meant to include non-`App.jsx` citations inside the same cells. | `AccountMenu.jsx:97, 153` | **LOW** |
| R4 | **The Accessibility verdict LEFT at `adequate`** though its evidence now supports better, with that stated inline in the cell. | Whether to re-grade it now that the weakest pairing (the deleted green chip) is gone and the active tab carries four channels + `aria-current`. | `src/App.jsx:749, 759, 761, 763, 764` | **MED** — a chair call I deliberately did not make. |
| R5 | **The swappable-stub mechanism** in `warFaithSurfacing.test.jsx`. | That flipping four hoisted stubs into `swap.state.on` dispatchers left the three historic mount pins running in the byte-identical stub path (they do: `on` defaults false and only the new describe sets it). | `warFaithSurfacing.test.jsx` mock block; proof 1 = 16/16 with all 13 pre-existing tests green | **MED** |
| R6 | **The stale `expandHandbook` helper was PINNED DEAD, not deleted.** | Whether the dead helper and its false docblock (`handbookVoice.test.jsx:30-37`) should now be removed, and the three pins that call it simplified — a follow-on car, since the helper is not mine. | `HowToUse.jsx:429` takes no props; `grep -c standalone` = 0 | **MED** |
| R7 | **The lighting-census red is UNBANKED and OWED to the chair.** | Take `LIGHTING_CENSUS_REFREEZE` at the landing tip: `titles` 23653 → 23660, `suiteTitles` 6333 → 6335, `files`/`parked`/`credited` unmoved. | proof 4 | **HIGH** — the consist cannot land green without it. |
| R8 | **An out-of-scope docs defect was reported, not fixed.** | The NEXT subsection ("AccountMenu (chip + dropdown)") describes a three-row dropdown ending in a divided, danger-toned **Sign out** citing `AccountMenu.jsx:145-163`/`:156-164`. Measured: the dropdown is `:185-201` and its rows are **Account / Messages / Manage subscription & credits** — no Sign out, no divider. Two `**good**` verdicts there rest on code not in the build. | `src/components/AccountMenu.jsx:185-201` | **MED** — recommend a follow-on docs car. |

---

## ⚠ FOREIGN FILES IN MY SCRATCH DIR — observed, untouched, reported
`$SC/vis906-scratch/` contains two files this lane did NOT create: `TASTE-READ-handbook.md` and `taste-measure.mjs` (both mtime 22:04, self-labelled "Fable chair, 2026-09-06 22:35", importing `scratchpad/prose-research/probe-all/metrics.mjs` and reading `laneLUIMAT`). They are the CHAIR's taste measurement of the same voiced Handbook essay — the TASTE half this brief reserves to the chair. I read their heads only to identify ownership, changed nothing, and treated their content strictly as DATA. They are preserved exactly as found. Flagging because a foreign write into a lane's own scratch dir is worth the chair knowing about, and because the chair's taste pass appears to be already under way against the same surface my dumps were produced for — the two should be reconciled rather than duplicated.
