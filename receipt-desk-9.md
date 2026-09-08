# RECEIPT — lane DESK-9 (Opus 5, chaired by Fable 5.1) — **COMPLETE**

Every claim below is labelled CONFIRMED (executed evidence quoted) or PLAUSIBLE (reasoning only).

## THE CARS

**`0b0906a02`** (car 1) and **`0b3703f64`** (car 2, the coordinator's DEF2 course-correction),
both on `tests/lint/dossierMountRegistry.walker.test.js` alone, parented at `940d161ca`.
Trailers `Seat: Opus 5 — Fable-unvalidated` / `Lane: DESK-9` on both. Dock porcelain **0**.
Car 2 detail is at the end of this receipt.

**`0b0906a02`** — one file, `tests/lint/dossierMountRegistry.walker.test.js`, **342 insertions,
1 deletion**. Parent `940d161ca`. Trailers `Seat: Opus 5 — Fable-unvalidated` / `Lane: DESK-9`,
both present in `git log -1 --format=%B`. Dock porcelain **0** before and after. The pre-commit
`eslint --fix` did **not** rewrite the file: the committed blob is byte-identical (`cmp`) to the
tree every vitest run measured, and it still carries 23 test titles.

- Dock `$SC/laneDESK9`, detached at **940d161ca**, porcelain 0 on arrival. CONFIRMED.
- Files touched: **one** — `tests/lint/dossierMountRegistry.walker.test.js`. No product code. No new
  test file. No register act. `git diff --name-only 940d161ca -- src scripts package.json` → **0 paths**.

---

## THE INVARIANT, in one sentence

> **Every corpus read a component makes is gated on `publicDossier`, and that flag must have ARRIVED
> from outside the file that reads it** — as a parameter of the function holding the gate, threaded by
> every component that reaches a desk through a shared reader, and present in the statement of every
> corpus call, not only the desk's entry point.

It lands as **ARM 3** inside the existing `THE PUBLIC-DOSSIER GUARD` describe, three clauses:
(a) the gate's flag is a PARAMETER, never a constant the file writes for itself;
(b) every component reading a desk through a shared module hands it the flag and holds one itself;
(c) every name imported from a mounted desk's corpus leaf is gated in the statement of each call.

---

## ⛔ FINDING 0 — THE BRIEF'S PREMISE IS STALE (so this is not the car it asked for)

The brief's CONFIRMED finding says *"**No instrument enforces it.**"* True when written, **false at my
base**. `ac350e89c` (DESK CAR 3) already landed `THE PUBLIC-DOSSIER GUARD` in the very file I was sent
to extend — ARM 1 (every mounted tab receives `publicDossier` from the router `case` block), ARM 2
(one caller per desk, flag within 400 chars of the desk call), plus guard-the-guard and non-vacuity.

CONFIRMED: `git log -S 'THE PUBLIC-DOSSIER GUARD' -- tests/lint/dossierMountRegistry.walker.test.js`
→ `ac350e89c DESK CAR 3: the public-dossier GUARD…`.

Building the brief's arm verbatim would have been a duplicate. I re-derived what the guard still
misses instead. That is FINDING 1.

## ⛔ FINDING 1 — THE HOP THAT HAD NO ARM (this car's reason to exist)

```
router computes the flag ──ARM 1──▶ mounted TAB ──(no arm)──▶ shared READ MODULE ──ARM 2──▶ gated desk call
```

The middle hop did not exist when the guard was written and exists now. `warFaith` spans two tabs and
`general` spans seven; ARM 2 admits **exactly one caller per desk**; so both moved their gate into a
shared read module the tabs *call*:

| shared reader | flag arrives as | default when a caller omits it |
|---|---|---|
| `src/components/new/generalDeskRead.js:136` (DESK-GEN2) | `options.publicDossier === true` | **`false` — the SPEAKING path** |
| `src/components/new/tabs/WarFaithDesk.jsx:90` (DESK-WARFAITH) | `publicDossier = true` parameter default | `true` — silent (fail-closed) |

CONFIRMED by source at both sealed tips. A tab that calls `generalDeskLines(r, {playerView})` takes
the speaking path on a free anonymous dossier while **ARM 1 and ARM 2 both stay green**. Plant P3
below is exactly that, executed.

⚠ **The two shared readers disagree about which way a forgotten flag falls** — `WarFaithDesk` states
"THE GATE DEFAULTS CLOSED" in its own docblock; `generalDeskRead` defaults open. Neither leaks today
because every caller passes the flag, and ARM 3 clause (b) is what keeps that true. Recorded for the
chair as a consistency row, not a defect.

## ⛔ FINDING 2 — NINE CORPUS READS ARM 2 NEVER LOOKS AT

ARM 2 reads exactly one name per desk, `<desk>StateProse(`. A corpus leaf exports **more than its
entry point**, and every extra export builds rungs too. Measured across all three trees:

- `defenseStateProse.js` → DefenseTab: `defenseThreatProse`, `defenseForcesProse`,
  `defensePostureProse`, `defenseMilitaryStatusProse`, `defenseWallRationaleProse`,
  `defenseCriminalProse` (6)
- `powerStateProse.js` → PowerTab: `powerLadderRung` (1)
- `stressorsStateProse.js` → OverviewTab: `crisisBannerRung` (1)
- plus the 5–6 desk entry points ARM 2 does read.

**All nine are gated today, by hand, with nothing asking.** CONFIRMED by an executed source probe over
`940d161ca`, `refs/preserve/desk-warfaith-2026-09-05` and `refs/preserve/desk-gen2-2026-09-05`: every
call printed `GATED`, zero `UNGATED`. Clause (c) of ARM 3 makes that a duty; plant P4 proves it bites.

---

## THE PER-MOUNT TABLE

Rows: **33** at `940d161ca` · **40** at the warfaith tip (+7) · **39** at the gen2 tip (+6).
Grouped by the gate that governs them, because ARM 2's one-caller rule means one gate answers for
every mount of a desk. `✓` = ARM 3 green on that tree; `–` = the desk is not mounted there.

| desk | gate site :: reader | flag arrives as | consumers that must thread it | base | warfaith tip | gen2 tip |
|---|---|---|---|---|---|---|
| economy (8 mounts) | `new/tabs/EconomicsTab.jsx::EconomicsTab` | prop in signature | router JSX only | ✓ | ✓ | ✓ |
| power (7) | `new/tabs/PowerTab.jsx::PowerTab` | prop in signature | router JSX only | ✓ | ✓ | ✓ |
| stressors (3) | `new/tabs/OverviewTab.jsx::OverviewTab` | prop in signature | router JSX only | ✓ | ✓ | ✓ |
| defense (7) | `new/tabs/DefenseTab.jsx::DefenseTab` | prop in signature | router JSX only | ✓ | ✓ | ✓ |
| general (8 base / 14 gen2) | base `OverviewTab.jsx::OverviewTab`; gen2 `new/generalDeskRead.js::generalDeskLines` | base prop; gen2 `options.publicDossier` | gen2: HistoryTab + OverviewTab + PlotHooksTab + ViabilityTab | ✓ | ✓ | ✓ |
| warFaith (7, warfaith tip only) | `new/tabs/WarFaithDesk.jsx::warFaithDeskRungs` | destructured param, defaults CLOSED | WarTab + FaithTab | – | ✓ | – |

**No landed mount fails the invariant on any of the three trees.** CONFIRMED.

Two mount-literal placements are worth the chair's eye but are NOT arm failures (ARM 2's one-caller
rule covers their gate): `economics.prosperityHeader / economyTile / foodTile / seasonTile` are drawn
in `EconomicsGlance.jsx`, and `power.criminalUnderside` is drawn in `EconomicsGlance.jsx` too — a
POWER mount whose literal lives in an economy file.

---

## THE PLANT-OUT, BY DESIGN — what each plant cuts and which arm should speak

(the executed vitest exits and the quoted convictions are further down, under THE PLANT-OUT)

Every plant was made in a `git archive` extraction of the tree it belongs to (never in the dock), and
every one was restored and verified with `cmp` against a backup taken BEFORE the plant.
`tip-base` was proved byte-identical to the dock's working tree first:
`diff -rq --exclude=node_modules --exclude=.git` → **0 differences**. CONFIRMED.

| plant | tree | what was cut | arm that spoke | ARM 1 | ARM 2 |
|---|---|---|---|---|---|
| **P1** un-gated mount | base | a `daily_life.probe` row + a decorative literal in `DailyLifeTab.jsx` | **ARM 1** | RED | green |
| **P2** self-written flag | base | `EconomicsTab`'s `publicDossier` prop → a module-scope `const publicDossier = false;` | **ARM 3 (a)** | green | **green** |
| **P3** consumer hands none | gen2 tip | `generalDeskLines(r, {publicDossier, playerView})` → `{playerView}` | **ARM 3 (b)** | green | **green** |
| **P4** ungated 2nd producer | base | `PowerTab.jsx:477` `publicDossier ? null :` removed from the `powerLadderRung` read | **ARM 3 (c)** | green | **green** |

P2, P3 and P4 are the point: **ARM 2 passes all three.** P2 in particular satisfies ARM 2's
400-character lookback exactly while gating nothing.

---

## REGISTERS — PREDICTED IN WRITING BEFORE ANY INSTRUMENT RAN

| register | predicted | why |
|---|---|---|
| lighting census `titles` | 23268 → **23271** (+3) | three new `test()` titles in an already-credited file (20 → 23, counted) |
| lighting census `suiteTitles` | **6232, unmoved** | no new `describe` — the arms join the existing guard describe |
| lighting census `files` / `parked` / `credited` | **2522 / 371 / 2151, unmoved** | no new file |
| mounts baseline `.dossier-mounts-baseline.json` | **64, unmoved** (measured dark = 36) | no mount row added or struck |
| prose-numerics | **unmoved** | 0 of its 225 rows address `tests/` (measured) |
| writer-reach · sizeBaseline · tuning | **unmoved** | no `src/` byte changes |
| test-ratchet collapse floors | **unbreached** | +3 titles RAISES totals; the floors are 90% collapse floors |

⇒ `tests/lint/sovereigntyLightingContract.walker.test.js` is EXPECTED RED, reading
`expected 23271 to be 23268` (vitest prints ACTUAL first). The chair re-takes the census at the
landing; I take no register door.

---

## THE VITEST RECEIPTS — every exit captured in-shell

The quiet-window law was probed to **three consecutive quiet minutes** before any vitest
(`load1 < 4.0` AND zero `[v]itest/dist/workers`; log at `$SC/desk9/quiet-2.log`, probes at
07:03:17 / 07:04:17 / 07:05:17 reading 3.84 / 3.05 / 2.66 with 0 workers), and every run went
through `sh scripts/gate-mutex.sh --run --`, which reported
`acquired atomic lock at /tmp/settlementforge-vitest-gate.502.lock as PID 26800`.

| run | tree | result | exit |
|---|---|---|---|
| **A1** walker alone | dock @ 940d161ca + ARM 3 | `Tests 23 passed (23)`, 892ms | **0** |
| **B1** walker alone | `refs/preserve/desk-warfaith-2026-09-05` (7 warFaith mounts) | `Tests 23 passed (23)` | **0** |
| **B2** walker alone | `refs/preserve/desk-gen2-2026-09-05` (6 general mounts, the READ MODULE) | `Tests 23 passed (23)` | **0** |
| **A2** `npx vitest run tests/lint/` WHOLE | dock | `Test Files 3 failed | 135 passed (138)`, `Tests 4 failed | 2130 passed (2134)`, 91.56s | **1** |

All CONFIRMED. The tip runs were made in `git archive` extractions of each sealed tip with MY
patch applied on top of that tip's OWN walker (gen2 had edited the C3 describe; `patch -p1`
kept its change), `node_modules` **symlinked**, never materialised.

### A2's failing-arm list, in full

1. `tests/lint/clampPrimitiveBaseline.test.js` — the estate's standing red. Not this lane's.
2. `tests/lint/observedShapeReaders.walker.test.js` ×2 —
   `expected { violations: 1, stale: +0 } to deeply equal { violations: +0, stale: +0 }` and
   `expected 65 to be 64`. **Not this lane's**: `git diff --name-only 940d161ca` in the dock
   returns exactly one path, `tests/lint/dossierMountRegistry.walker.test.js`, and
   `scripts/check-observed-shape-readers.mjs` walks `join(root, 'src')` — src only.
   **Measured, not deduced**: `git diff --name-only 940d161ca -- src scripts package.json`
   returns **0 paths**, and running the real scanner in this dock (`node
   scripts/check-observed-shape-readers.mjs`, exit 1) names the offender:
   `src/domain/display/stateProse/economyStateProse.js: NEW isCriminal on incomeSources — 1
   read(s); this file has no frozen row for it (ceiling 0)`. `git log -1` on that file →
   `0e78576d4 DESK-ECONFAITH C3`. **A DIFFERENT LANE, BEFORE MY PARENT.**
   ⚠ A pristine `git archive` could NOT be used as the substrate here — that walker refuses
   outside a git repo (`observed-shape migration genesis is not a committed ancestor of
   current HEAD`), so the archive route was abandoned for the scanner run above rather than
   reported as a result it never produced.

   ### ⛔ FINDING 3 (free, and the chair should see it)
   **`940d161ca` already ships an observed-shape violation.** `economyStateProse.js` reads
   `incomeSources[].isCriminal`, a key the scanner has never observed a writer produce. Per
   the standing law an observation ratchet reports its CORPUS's reach and not the code's
   truth, so this is an **investigation**, not a deletion: measure `isCriminal` over many
   generated worlds before touching the read. It is DESK-ECONFAITH's row, not mine.
3. `tests/lint/sovereigntyLightingContract.walker.test.js` — **MINE, and predicted exactly**:
   `expected 23271 to be 23268`. Vitest prints ACTUAL first, so the tree measures **23271** and
   the frozen figure is 23268: the +3 this car's three test titles add. Counted independently:
   `git show 940d161ca:…walker.test.js | grep -c` gives **20** test titles and the working copy
   gives **23**; `describe(` is **4** on both sides, so `suiteTitles` is unmoved. The chair
   re-takes the census at the landing. **I opened no register door.**

### THE PLANT-OUT — four plants, each reddening EXACTLY ONE of 23 arms

| plant | tree | what was cut | arm | vitest |
|---|---|---|---|---|
| **P1** un-gated mount | base | a `daily_life.probe` row + a decorative literal in `DailyLifeTab.jsx` | **ARM 1** (`:977`) | `1 failed | 22 passed (23)`, exit 1 |
| **P2** self-written flag | base | `EconomicsTab`'s prop → module-scope `const publicDossier = false;` | **ARM 3** (`:1078`) | `1 failed | 22 passed (23)`, exit 1 |
| **P3** consumer hands none | gen2 tip | `generalDeskLines(r, {publicDossier, playerView})` → `{playerView}` | **ARM 3** | `1 failed | 22 passed (23)`, exit 1 |
| **P4** ungated 2nd producer | base | `PowerTab.jsx:477` loses `publicDossier ? null :` on its `powerLadderRung` read | **ARM 3** | `1 failed | 22 passed (23)`, exit 1 |

The three ARM 3 plants each left **ARM 1 AND ARM 2 GREEN** — 22 of 23 arms passed every time.
That is the whole argument for ARM 3, executed rather than argued. The convictions, quoted:

- P2 → `economy: EconomicsTab in src/components/new/tabs/EconomicsTab.jsx does not RECEIVE publicDossier — the name its gate reads is written by that file itself, and a flag a file writes for itself gates nothing`
- P3 → `general: src/components/new/tabs/HistoryTab.jsx reads the desk through generalDeskLines() and hands it no publicDossier, so the shared reader falls back to its own default`
- P4 → `src/components/new/tabs/PowerTab.jsx: powerLadderRung() reads the corpus in a statement that never mentions publicDossier, so a free anonymous viewer draws it`
- P1 → ARM 1's own message, with the received DOM being the finding: `case '          ': return <DailyLifeTab settlement={s} … />` carrying no `publicDossier`.

Every plant was made in a `git archive` extraction, **never in the dock**, and every one was
restored and verified with `cmp` against a backup taken BEFORE the plant —
`P1_RESTORED_CMP_CLEAN`, `P2_RESTORED_CMP_CLEAN`, `P3_RESTORED_CMP_CLEAN`,
`P4_RESTORED_CMP_CLEAN`. The base extraction was first proved byte-identical to the dock's
working tree: `diff -rq --exclude=node_modules --exclude=.git` → **0 differences**.

`npx eslint tests/lint/dossierMountRegistry.walker.test.js` → **exit 0**. CONFIRMED.

---

## RETROVALIDATION ROW (for the Fable 5.1 chair)

| # | what an Opus seat JUDGED | what the chair must RE-DERIVE | receipts | priority |
|---|---|---|---|---|
| 1 | **Refusing the brief and building a different arm.** The card's "no instrument enforces it" is stale; `ac350e89c` landed the guard. I built the arm for the hop the guard misses instead of duplicating it. | That refusing was right — that ARMS 1+2 really are already present and that ARM 3 is not a third spelling of either. | `git log -S 'THE PUBLIC-DOSSIER GUARD'` → `ac350e89c`; plants P2/P3/P4 all pass ARM 1 and ARM 2 | ⭐⭐ HIGH — the whole car rests on it |
| 2 | **The invariant's WORDING**, which is the arm's name and its failure message. I derived it from O2GATE's shape (`prop → gated ternary`), not from a rule I preferred. | That "the flag must ARRIVE" is the O2GATE law and not a stricter one I invented; in particular that **fail-closed defaults were NOT required**, because `EconomicsTab` itself defaults `publicDossier = false`. | `450f7dbb7` diff, `EconomicsTab.jsx:241` | ⭐⭐ HIGH |
| 3 | **Scope: I added clause (c)** (nine secondary corpus producers) beyond the brief's ask, because it is the same leak one export along and it cost no census title. | Whether a lane should have widened scope here, and whether the statement-scoped reader is the right strictness (it forces the gate ADJACENT to the read; a gate hoisted into an earlier statement would red). | clause (c) green on all 3 trees; P4 reds it | ⭐ MEDIUM |
| 4 | **The two shared readers' opposite defaults** recorded as a consistency ROW, not fixed. Fixing `generalDeskRead`'s default would be a product-code edit and another lane's car. | Whether `generalDeskRead.js:136` should be made fail-closed like `WarFaithDesk.jsx:90`. | both lines quoted above | ⭐ MEDIUM — owner-adjacent (paid surface) |
| 5 | **Two mount literals live away from their tab**: the four economy glance mounts and `power.criminalUnderside` are all drawn in `EconomicsGlance.jsx`. Reported, not touched. | Whether a POWER mount drawn from an economy file is intended. | the per-mount table above | ⭐ LOW |
| 6 | **The plants were run in `git archive` extractions rather than the dock.** | That an extraction proved byte-identical to the dock is an acceptable plant substrate. | `diff -rq` → 0 differences | ⭐ LOW |
| 7 | **Attributing the `observedShapeReaders` red to the parent by running the SCANNER in the dock** after the archive route was refused by that walker's own git check. | That the src/scripts/package.json zero-diff plus the scanner naming `economyStateProse.js` is a sufficient attribution, and that **FINDING 3** (`incomeSources[].isCriminal`) reaches DESK-ECONFAITH rather than dying here. | `$SC/desk9/osr-dock.txt`; `git log -1` → `0e78576d4` | ⭐⭐ HIGH — it is a live red on the base |

## WHAT THIS LANE DID NOT DO
No product code. No new test file. No register act (`--update`/`--write`/`--genesis`/`--rebank`,
no `*_REFREEZE`). No `npm run build`, no `npm install`, no `node_modules` touched, no `git stash`,
no `git add -A`, no `--amend`, no push, no ref write. `npm run typecheck:domain:strict` is not
owed — this car changes no `src/` byte.


---

# CAR 2 — the caller set stops being a call spelling (coordinator course-correction, DESK-DEF2's finding)

## ⛔ FINDING 4 — RE-DERIVED, AND THE MECHANISM WAS HALF-CURED ALREADY

DESK-DEF2 (`refs/preserve/desk-def2-2026-09-05` @ `468663f56`, receipt `b3cf58692`) reported
that ARM 2 finds a desk's callers by grepping the literal `<desk>StateProse(`, and that its
`viability.magicDependency` car gave the defense leaf a SECOND drawer — `ViabilityTab.jsx`,
binding `defenseMagicDependencyProse`, never spelling the entry point.

**Re-measured rather than believed**, per desk, per tree:

| desk | ARM 2's spelling reader | an import-path reader | files (DEF2 tip) |
|---|---|---|---|
| **defense** | **1** | **2** | `DefenseTab.jsx` + `ViabilityTab.jsx` |
| economy / general / power / stressors | 1 | 1 | unchanged |

DEF2's figure is exact. CONFIRMED.

⚠ **But the shapes the report leads with were already red.** Car 1's clause (c) already keyed
on IMPORT PATH and already resolved `as` aliases. Measured against the *committed* car-1 arm
(`0b0906a02`) at the DEF2 tip:

| probe | what it plants | car-1 arm |
|---|---|---|
| **A** | ViabilityTab's second-export draw, un-gated | **already RED** (clause c) |
| **B** | the same draw under `as arcaneRead`, un-gated | **already RED** (clause c) |
| **C** | ViabilityTab keeps a gate but writes its own flag | ⛔ **SILENTLY GREEN** |

**Probe C is the real residue and nobody had named it.** Clauses (a) and (b) still *started*
from `deskCallSites`, so they examined only the file that spelled the entry point. A second
importer could drop its prop, write `const publicDossier = false;` at module scope, keep a gate
expression that gates nothing, and no clause would look at it — the exact defect car 1 convicts
in `EconomicsTab`, one component along and invisible. This is the standing law in miniature:
**charter the permission, measure the mechanism.** The ruling was right; two thirds of the
mechanism it named was already cured, and the third was somewhere else.

## THE CURE

Every clause now starts from `deskImporters(desk)` — any component whose source carries the
leaf's import PATH, whatever name it binds. An import path cannot be aliased away; an export
name can. `deskReadersIn` derives a drawer's exported readers from its bound names instead of
one literal, so `generalDeskLines`, `warFaithDeskRungs`, `ViabilityTab` and the four tab-side
desks are found by one reader. The "0 gate sites" offence becomes "no component imports its
corpus leaf".

## ⛔ FINDING 5 — A PLANT CONVICTED CAR 1'S OWN STATEMENT READER

`enclosingStatement` stopped only at a `;` at depth zero. From a corpus read written as the
FIRST statement of a function it therefore walked back out of the body and into the
**signature** — and a signature that merely NAMES `publicDossier` made the read grade as
**gated**. PLANT 6 is that shape and it passed until the reader learned to stop at a `{` at
depth zero. The stop is sound: a depth-zero `{` reached backwards cannot be an object literal
we are inside, because that literal's `}` would have raised the depth first. All four trees
stay green with it, and the guard-the-guard arm now drives it in both directions.

## THE JUDGMENT I DID NOT MAKE ALONE — ARM 2 IS LEFT UNTOUCHED

ARM 2's "exactly one caller per desk" is now **false** at the DEF2 tip: two components draw the
defense leaf, which is two places to forget the gate — the shape it shipped broken from twice.
Re-keying ARM 2 to import paths would **red a landed car** on an auditability rule the chair
owns. So this lane makes the SAFETY invariant total and hands the DESIGN question up. ARM 2 is
not weakened, not widened, and not touched.

## REGISTERS — CAR 2 MOVES NONE

Test titles **23** and `describe` **4**, both unchanged from car 1 (one title was reworded; the
census asserts a COUNT). So the lighting census delta for this lane remains car 1's **+3**
(23268 → 23271) and no other register is touched: no `src/` byte, no new file, no baseline.

## CAR 2's VITEST RECEIPTS — every exit captured in-shell

Quiet-window law re-probed for this batch (`$SC/desk9/quiet-4.log`; the window took ~30
minutes to open because sibling lanes held the machine at load 20–40 with 7 vitest workers),
then `sh scripts/gate-mutex.sh --run --`.

| run | tree | result | exit |
|---|---|---|---|
| **A1** walker | dock @ car 2 | `Tests 23 passed (23)` | **0** |
| **B** walker | base · warfaith · gen2 · **def2** | `Tests 23 passed (23)` on each | **0** ×4 |
| **C/P1** un-gated mount | base | `1 failed | 22 passed (23)` — **ARM 1** at `:1052` | 1 |
| **C/P2** self-written flag | base | `1 failed | 22 passed (23)` — **ARM 3** at `:1157` | 1 |
| **C/P3** consumer hands none | gen2 | `1 failed | 22 passed (23)` — **ARM 3** | 1 |
| **C/P4** un-gated 2nd producer | base | `1 failed | 22 passed (23)` — **ARM 3** at `:1157` | 1 |
| **C/P5** 2nd importer writes its own flag | **def2** | `1 failed | 22 passed (23)` — **ARM 3** at `:1157` | 1 |
| **C/P6** aliased un-gated draw | **def2** | `1 failed | 22 passed (23)` — **ARM 3** at `:1157` | 1 |
| **A2** `npx vitest run tests/lint/` | dock | `Test Files 3 failed | 135 passed (138)`, `Tests 4 failed | 2130 passed (2134)` | 1 |

Every plant restored `cmp`-clean (`P1_…`–`P6_RESTORED_CMP_CLEAN`). The committed blob is
byte-identical (`cmp`) to the tree every run measured — the pre-commit `eslint --fix` rewrote
nothing.

**A2's failing-arm list is byte-identical to car 1's**, which is the proof that car 2 moves no
register: `clampPrimitiveBaseline` (standing red), `observedShapeReaders` ×2 (`expected 65 to
be 64`), `sovereigntyLightingContract` (`expected 23271 to be 23268` — still car 1's +3).

## RETROVALIDATION ROWS FOR CAR 2

| # | what an Opus seat JUDGED | what the chair must RE-DERIVE | receipts | priority |
|---|---|---|---|---|
| 8 | **Reporting that the coordinator's mechanism was two-thirds already cured**, and re-aiming the car at probe C instead of building what was described. | That probes A and B really were red on the committed car-1 arm, so the cure landed where the hole actually was. | probe A/B/C runs against `0b0906a02` at the DEF2 tip | ⭐⭐ HIGH |
| 9 | **Leaving ARM 2 untouched** while its "exactly one caller" is now false at the DEF2 tip. | Whether ARM 2 should be re-keyed to import paths — which would RED the DEF2 car — or whether two defense-desk drawers is an accepted design. **This is a chair/owner call, not a lane's.** | the importer table above | ⭐⭐ HIGH |
| 10 | **The brace stop in `enclosingStatement`** — a behaviour change to car 1's own reader, found by a plant rather than by review. | That stopping at a depth-zero `{` cannot false-red a legitimate gate; all four trees are green with it, but the argument (an object literal's `}` raises depth first) is mine and should be checked. | PLANT 6; four clean trees | ⭐ MEDIUM |


## REPRODUCING THE PROOFS

The three `git archive` extractions were deleted after use (≈1 GB). Rebuild any of them in
seconds; `$SC/desk9/arm3.patch` is this car's diff and the plant/run scripts are kept beside it
(`run-dock.sh`, `run-tips.sh`, `run-everything.sh`, `quiet2.sh`), with full logs in
`$SC/desk9/all-run.log` + `$SC/desk9/quiet-2.log` (car 1) and `$SC/desk9/run2.log` +
`$SC/desk9/quiet-4.log` (car 2). The DEF2 tip is `468663f56`.

```sh
git -C <main> archive <sha> | tar -x -C <dir>      # 940d161ca | the two preserve tips
ln -s <dock>/node_modules <dir>/node_modules       # SYMLINK, never materialise
cd <dir> && patch -p1 < $SC/desk9/arm3.patch       # applies cleanly on all three
```
