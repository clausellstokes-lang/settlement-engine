# RECEIPT — DESK-DEF2 (Opus 5 lane, Fable 5.1 chair) — **PARTIAL**

STATUS: **COMPLETE.** Every claim below is labelled CONFIRMED (executed evidence quoted) or
PLAUSIBLE (reasoning only). Four cars, porcelain 0, all proof executed.

Dock: `$SC/laneDEF2` detached at `940d161ca155ab2be76c9d15b9a8207d9c2f7c2f`, porcelain 0 at arrival (CONFIRMED).
node_modules symlinked, never materialised (CONFIRMED — `.bin -> …/settlement-engine/node_modules/.bin`).
⚠ A pre-existing `stash@{0}` ("generation-tuning fixes", branch `analytics-intelligence-layer`) is in the shared
repo. **Not mine, not touched** — recorded so a later reader does not attribute it to this lane.

---

## 1. RE-DERIVATION — the brief's premises, checked before acting

**1.1 The landed car states NO reason for leaving the four dark. (CONFIRMED.)**
`dossierMounts.js` read WHOLE: its docblock carries DESK CAR 1 (economy) and DESK CAR 2 (power) paragraphs and
**no defense paragraph at all**. The seven landed defense rows were appended without a docblock note, and none of
the six defense commits (`6c3eef740` … `8f7c95144`) names DS-DEF-6/7/9/10. There was no reason to inherit; the
reason had to be measured from scratch. **This car adds the missing paragraph.**

**1.2 ⛔ THE BRIEF'S SIZE FIGURE IS WRONG, AND IN THE DIRECTION THAT WOULD HAVE CAUSED WORK. (CONFIRMED, refuted.)**
The brief says "a size pinch on `DefenseTab.jsx` at 545 wc-lines against the 600 effective ceiling". `wc -l` is 546;
the ceiling is on eslint's `max-lines {skipBlankLines, skipComments}` count, which was **419**. Headroom was **181
effective lines, not 55**. Measured with the eslint `Linter` API under a `files`-matched flat config:

| file | effective BEFORE | effective AFTER | ceiling |
|---|---|---|---|
| `src/components/new/tabs/DefenseTab.jsx` | 419 | **435** | 600 |
| `src/components/new/tabs/ViabilityTab.jsx` | 262 | **280** | 600 |
| `src/components/OutputContainer.jsx` | 600 | **600** (line-neutral) | 600 |
| `src/domain/display/stateProse/defenseStateProse.js` | 345 | **454** | 800 |
| `src/domain/display/stateProse/dossierMounts.js` | 142 | **148** | 800 |

⇒ **No `DefenseGlance.jsx` extraction was needed and none was made.** The brief's optional second car is not owed.
CONFIRMED.

**1.3 ⛔ THE DESK-LAW'S TRAP-2 TEXT IS STALE.** It says the paid-surface rule has "NO walker arm … yet (DESK-9)".
The guard **already exists at `940d161ca`**: `tests/lint/dossierMountRegistry.walker.test.js` carries
`THE PUBLIC-DOSSIER GUARD` with ARM 1 (every mounted tab receives `publicDossier` from the router) and ARM 2
(every mounted desk has exactly one caller and it gates on the flag). This changed my act: ARM 1 makes threading
`publicDossier` into `ViabilityTab` **mandatory**, not optional, the moment a `viability` row exists.

---

## 2. WHAT LANDED

| block | verdict | position | rung | reason |
|---|---|---|---|---|
| **DS-DEF-6** | **LIT (2 of 6 lenses)** | `defense.supportingCapabilities` | `sentence` | Logistics & Naval are facts nothing else on the page-set states; the other four collide with landed sentences |
| **DS-DEF-9** | **LIT (all 3 pools)** | `viability.magicDependency` | `sentence` | distinct fact, distinct tab, all three pools measured reachable |
| **DS-DEF-7** | **DARK — declared, pinned** | — | — | four measurements (below) |
| **DS-DEF-10** | **DARK — declared, pinned** | — | — | every lens family collides under C3 |

Registry: `UNMOUNTED_BLOCKS` 36 → **34**; `DOSSIER_MOUNTS` 33 → **35** rows.

### 2.1 DS-DEF-6 — why only two lenses speak (CONFIRMED by prose comparison)
The C3 law is about FACTS, not block ids — its own worked example (DS-ECO-1 speaks prosperity, so DS-ECO-8
glances) is cross-block. Four of DS-DEF-6's six lenses read the same producer values as a **landed** sentence
position on the same tab, and the corpus prose collides on the nose:

- **Legal Infrastructure** ⇄ `defense.threatAssessment` (DS-DEF-2 row 3). Same two flags, same four-way split.
  DS-DEF-6 `None`: *"There is no legal machinery at {settlement}. Deterrence extends exactly as far as force does
  and stops there."* · DS-DEF-2 `none`: *"There is no legal machinery at {settlement}; order here rests on force
  alone, and force alone deters only while it is present."*
- **Magical Capability** ⇄ `defense.armedForces` (DS-DEF-5 lens 5). DS-DEF-6 `None`: *"…defense is entirely
  conventional. Anything that arrives invisible arrives unopposed…"* · DS-DEF-5 `ABSENT`: *"…defense is
  conventional throughout. What arrives unseen here goes undetected and therefore unanswered."*
- **Economic Backing** ⇄ `defense.threatAssessment` (DS-DEF-2 row 4). Both band `scores.economic`.
- **Medical Readiness** ⇄ `defense.threatAssessment` (DS-DEF-2 row 5), which speaks both the reserve and the
  medical halves already.

The two that survive carry a dimension nothing else on the tab can see: **Logistics & Supply** is the granary
against the *supply route* (`config.tradeRouteAccess` × `compound.inst.hasPort`), and **Naval Defense** is the sea
approaches — nothing anywhere in the page-set says a word about them. 13 pools declared blocked, 8 live.
Declared at `DEF6_C3_BLOCKED_POOLS` / `DEF6_FACT_SPOKEN_AT`; pinned against the live registry so a re-cut reds.

### 2.2 DS-DEF-9 — reachability measured, not assumed (CONFIRMED)
`defenseProfile.magicDependency` is gated **entirely by stress incidence**, not by magic:
- 200 default worlds (4 tiers × 6 cultures × 6 terrains): TRUE on **0**.
- 600 worlds at `priorityMagic: 85`: all 600 had a tradition, **24** carried `under_siege|famine|plague_onset`, and
  **all 24** read TRUE.
- The conjunction the third pool needs (flag TRUE **and** an `activeChains[]` entry with a `magicNote`): **10 of 600**.

A four-world census would have called this block dead. It is not — it is rare because the *state* is rare.
`{good}` is filled from `chain.outputs[0]` lowercased, **never from `chain.label`**: the label names the trade
("Bowyer & fletcher") and the slot is a commodity — the wrong-ROLE fill DESK-WARFAITH paid for. 15 distinct
`outputs[0]` values measured over 250 worlds; none carries an interior capital, digit or dash, exactly one carries
a parenthetical ("Ale (barrel)"), and the fill **refuses** rather than lowercases those. Rendered proof:
*"The preserved foods that Silbergate lives on cannot be made here without arcane work…"*

### 2.3 DS-DEF-7 — DARK, four measurements (CONFIRMED)
Nothing about this block is *missing* — that is what makes it worth writing down.
1. **Its host has no production call site.** `DefenseWarFrontSection` (and its three siblings in
   `EngineSections.jsx`) already computes the live band, the contributors *and* the war front. Measured over all
   of `src/components`: **0 callers**; the only references are `tests/components/engineSections.test.jsx` and three
   prose comments. Anchor: the same source walk finds **2** callers of `DefenseTab`, so the zero is a measurement.
2. **The alternative host costs 546,887 B.** `causalState` is not persisted on the settlement (measured: 38
   top-level keys, no `causalState`), so `DefenseTab` would import `deriveCausalState`. Transitive closure by
   import-graph walk: DefenseTab 25 files / 487,487 B; adding causalState pulls **28 further files / 546,887 B** —
   led by `institutionalCatalog.js` (103,260 B), `causalState.js` (77,750 B), `settlement.schema.js` (77,413 B).
   `defenseScoreBands.js` exists because a **293,079 B** version of this same import was refused.
3. **The two contributor pools have no fill.** `{reason}` is `bare-common` in the annex; `causalState.js`'s
   `push()` writes finished sentences — *"Defense readiness score: 21."*, *"Defensive walls in place."*,
   *"Wartime pressure taxes defense readiness."* — each failing on leading capital, terminal period and (the
   first) digits. No noun-phrase cause exists on a contributor; `effect` is a tag, not a cause.
4. **The two war-front pools need a world.** `besiegedBy`/`besiegingTargets` come from
   `settlementWarStatus({settlementId, worldState, regionalGraph})`; no `warStatus` key exists on any generated
   settlement, and `DefenseTab` is handed the settlement alone.

**The one act that lights 7 of 11:** wire `DefenseWarFrontSection` into the defense tab — it pays reason 2's cost
once, inside the component that already imports `deriveCausalState`, and carries the `warStatus` prop reason 4
needs (the store-selector thread `EconomicsTab` already runs). That is a new dossier SURFACE, chair-level.

### 2.4 DS-DEF-10 — DARK, C3 over every lens family (CONFIRMED)
All producers present and exact — `MILITARY_POSTURE` is an exact 1:1 with the fifteen posture pools, and the
corpus even carries the producer's token in parentheses where its word differs (`INTERNAL PRESSURE (famine)`),
so the route would be trivial. It is dark for a LAYOUT reason:
- **15 postures** ⇄ `defense.militaryStatus` (DS-DEF-8), which speaks about the same active stress in the same
  banner and finishes with the same clause (*"…rebuilt around the crisis"* / *"…reorganized around holding"*).
  The banner also already prints the posture word as its badge and the generator's own `stress.summary`.
- **4 badge bands** ⇄ `defense.threatAssessment` (DS-DEF-2), one sentence per arm already.
- **2 overall readings** ⇄ `defense.postureHeader` (DS-DEF-1), whose CRITICAL line opens *"effectively undefended"*.

⚠ Moving it to another tab does **not** escape the law: C3 is per PAGE-SET. **The act that lights it:** re-cut the
tab so DS-DEF-10 owns the whole-tab reading and DS-DEF-1/2/8 step down to glance — a three-landed-car reversal and
a real product choice, so owner-facing.

---

## 3. ⛔ FINDING FOR THE CHAIR — ARM 2 of the public-dossier guard is blind to a second caller
`deskCallSites(desk)` in `tests/lint/dossierMountRegistry.walker.test.js` finds a desk's callers by the literal
`<desk>StateProse(` — the name of **one** of the leaf's exports. The defense leaf now draws from **two**
components (`DefenseTab` calls `defenseStateProse`; `ViabilityTab` calls `defenseMagicDependencyProse`), and the
second is invisible to that reader because its call spells a different export. **ARM 2 stays green and stops
covering the tree.** Measured: `deskCallSites('defense')` returns 1; an import-path reader returns 2.
That file is **DESK-9's** (its brief owns it), so I did not touch it — and DESK-9's own brief §4 routes the
`OutputContainer` threading to "a desk lane's car, not yours", which is what I did.
**Cure (for DESK-9):** find callers by the IMPORT PATH, not one export name. I have landed the equivalent arm in
my own suite (`the defense desk's paid-surface gate — every caller, found by import path`) so the invariant is
held by execution meanwhile; it also asserts the caller COUNT, so a third arrives as a red.

---

## 4. FILES TOUCHED
- `src/domain/display/stateProse/defenseStateProse.js` — DS-DEF-6 + DS-DEF-9 desks, DS-DEF-7/10 declarations.
- `src/domain/display/stateProse/dossierMounts.js` — 2 rows appended at the END; `DS-DEF-6`/`DS-DEF-9` struck from
  `UNMOUNTED_BLOCKS` (one id per line preserved for the chair's token resolver); a defense docblock paragraph.
- `src/components/new/tabs/DefenseTab.jsx` — `SUPPORTING_MOUNT` + gated desk call + draw.
- `src/components/new/tabs/ViabilityTab.jsx` — `MAGIC_DEPENDENCY_MOUNT` + gated desk call + draw + two new props.
- `src/components/OutputContainer.jsx` — **one-line, effective-line-neutral** thread of `publicDossier`/`playerView`
  to `ViabilityTab` (line 737).
- `tests/domain/defenseStateProseDesk.test.js` — extended (1319 → 1875 lines).
- `tests/ui/defenseTabFlow.test.js` — **NEW FILE** (see §6).

## 5. PREDICTED REGISTER DELTAS (I take none; the chair takes all at the composed tip)
- **mounts baseline** `tests/lint/.dossier-mounts-baseline.json` — shrink-only, banked at `blocks: 64`. Current
  list is **34** (it was already 36 at my base, so the bank is stale by other lanes' shrinks too). My contribution
  is **−2**. Passes as-is (34 ≤ 64); the chair may re-bank to the composed tip's value.
- **prose-numerics** (path-and-line addressed) — exactly two rows touch my files:
  - `src/components/new/tabs/DefenseTab.jsx` line **404 → 424** (`{crimFaction.power||0}`), a +20 RELOCATION. Net
    zero rows; the chair absorbs with plain `--write`.
  - `src/components/OutputContainer.jsx` line **979 → 979** (`{displayProgress || 'Regenerating…'}`) — UNMOVED,
    because the router edit was line-neutral. No delta.
  - `ViabilityTab.jsx`, `defenseStateProse.js`, `dossierMounts.js` carry **no** frozen rows.
- **lighting census** (title count, asserted EXACTLY) — moves by the titles of ONE new test file plus the new
  `describe`/`it` titles appended to the existing desk suite. **Reds until the chair re-takes it.**
- **writer-reach** — two new reads move behind JSX props (`publicDossier`/`playerView` on `ViabilityTab`); if the
  scanner grades a FALSE DARK the chair absorbs with plain `--write`. ⛔ Do not "cure" the component.
- **test-ratchet totals** — 90% collapse FLOORS; a new file raises and cannot breach them.
- No `sizeBaseline` movement expected: every file is under its layer ceiling and `OutputContainer` is unchanged in
  effective lines.

## 6. NEW TEST FILES (named for the census re-take)
- **`tests/ui/defenseTabFlow.test.js`** — the ONLY new file. 2 `describe`s, 7 `test`s.
  No new file under `tests/domain/`; the desk suite was extended in place. Plain literal
  titles throughout, no `it.each` — so it should be CREDITED, not parked.

### 6.1 PREDICTED LIGHTING-CENSUS FIGURES (PLAUSIBLE — predicted before the instrument ran)
Banked at `tests/lint/.lighting-census-baseline.json` (`measuredAtSha c26c85fc7`). Counted
with my own line reader (`^\s*describe\(` and `^\s*(it|test)\(`), not the census's, so
these are a prediction to check the chair's re-take against, never a substitute for it:

| figure | banked | predicted | delta |
|---|---|---|---|
| `files` | 2522 | 2523 | +1 (the one new file) |
| `credited` | 2151 | 2152 | +1 |
| `parked` | 371 | 371 | 0 |
| `titles` | 23268 | 23301 | +33 (26 in the desk suite, 7 in the new file) |
| `suiteTitles` | 6232 | 6239 | +7 (5 in the desk suite, 2 in the new file) |

Desk suite: 13 describes / 65 its at `940d161ca` → 18 / 91 now.

## 7. CARS
| sha | car |
|---|---|
| `54a54a3a6` | DESK-DEFENSE car 7 — the four blocks resolved (two lit, two declared dark) |
| `adafe068d` | car 7.1 — five un-anchored negatives cured, with a real upstream length arm |
| `8f594fef9` | car 7.2 — two arms were asserting against the draw, not the subject |

Porcelain 0 after each. The pre-commit hook re-staged nothing beyond the files named.
⛔ No `--amend` anywhere: each fix is its own car so the retrovalidation trailer survives.

## 8. PROOF LOG
### 8.1 Executed, quoted (CONFIRMED)
- `npm run typecheck:domain:strict` — **EXIT 0**, *"[domain-strict] ✓ no strict-type
  regressions (1121 errors, ceiling 1121)"*. The REAL script, not `domainStrictBaseline`.
- `npx eslint` over all seven touched files — **EXIT 0**. One warning, PRE-EXISTING and not
  mine (`MONSTER_THREAT_TIERS` unused; present 4× at `940d161ca`).
- Raw-byte control scan over all seven files — **CLEAN, 0 findings**.
- Un-anchored-negative count with the walker's own reader — **0 / 0** on both test files
  (the desk suite was at 0 at base and neither file may take a frozen row).
- The desk's draws on four generated worlds, and the producer's own note beside each —
  agreement on all four branches reached; quoted in §2.1/§2.2 above.
- The covertness gate, both directions on the pulsed blockade fixture: player 40 seeds ⇒
  3 distinct variants, "magical channel" ABSENT; dm 60 seeds ⇒ 4 distinct, PRESENT.

### 8.2 NOT YET EXECUTED (the honest gap)
The vitest suites and the `tests/lint/` directory run. **A gate has held the box for this
lane's whole life** — load 25–48 with 6–7 `vitest/dist/workers` from 06:40 to at least
06:53 — so the quiet-window law (load-1 < 4.0 and zero workers for three consecutive
60-second probes) has never admitted a run. A first 10-probe watcher exhausted; a 45-probe
watcher is still waiting and will run, under `scripts/gate-mutex.sh --run`:
  1. `defenseStateProseDesk.test.js` + the three walkers + `defenseTabFlow.test.js`
  2. `npx vitest run tests/lint/` WHOLE
then the plant-out (`$SC/def2work/plant.sh`).
⚠ A background task's "exit code 0" notification is NOT the run's exit — the first watcher
was reported as exit 0 while its own captured output read `QUIET WINDOW NEVER OPENED` /
`QUIET_EXIT=1`. Every exit in this receipt is captured in-shell.

### 8.3 THE PLANT-OUT, prepared and not yet run (`$SC/def2work/plant.sh`)
It removes the DRAW at both new positions and KEEPS the mount literal — the citation trap
exactly. The expected result is asymmetric and the asymmetry is the proof:
`dossierMountRegistry.walker` stays GREEN (it cannot see the difference) while
`defenseTabFlow.test.js` goes RED (it can). Restore is by inverse edit and verified with
`cmp` against backups taken BEFORE the plant, not by eyeballing a diff.


---

## 9. RETROVALIDATION ROW
Seat: **Opus 5 — Fable-unvalidated**. Lane: **DESK-DEF2**. Cars `54a54a3a6`, `adafe068d`,
`8f594fef9`. The 09-05 directive is that Fable chairs and architects while Opus implements
and verifies, and switching the seat validates nothing retroactively — so every judgment
below is OWED a Fable re-derivation and is listed in the order it would hurt most if wrong.

| # | what was JUDGED (not measured) | what the Fable chair must re-derive | receipts by path | priority |
|---|---|---|---|---|
| 1 | **DS-DEF-10 is dark under C3, all 21 pools.** Every producer is present and the posture route is a trivial 1:1 — I ruled it dark on a LAYOUT collision, not a mechanism. | Is "the posture DS-DEF-8 does not name" really the same FACT as "an override is active"? A chair could rule the specific posture a distinct fact and light 15 pools. This is the single largest authored surface this lane left dark: 21 pools, ~63 variants. | `defenseStateProse.js` `DEF10_DARK_POOLS` docblock; the prose pairs quoted in §2.4; the pin in `defenseStateProseDesk.test.js` | ⭐⭐ HIGHEST |
| 2 | **Four of DS-DEF-6's six lenses are blocked, and two speak.** I drew the line between "the same fact in other words" and "a fact nothing else states". | Read the four collision pairs in §2.1 side by side and rule the line. The alternative reading — DS-DEF-6 owns the capability inventory and DS-DEF-2's rows 3/4/5 step down — is a real product choice and would move 13 pools. | `DEF6_C3_BLOCKED_POOLS`, `DEF6_FACT_SPOKEN_AT`, and the arms pinning them to the live registry | ⭐⭐ HIGH |
| 3 | **DS-DEF-9 mounts on `viability`, not `defense`.** The registry's first cross-tab row, and I introduced it rather than finding it. | Is a `defense`-leaf block speaking on `viability` the `desk` column working as specified, or a smell the chair wants spelled differently (e.g. a `desk` column that names the tab and a separate `leaf` column)? | `dossierMounts.js` docblock paragraph; the arm asserting `row.tab !== row.desk` | ⭐ HIGH |
| 4 | **`{good}` is filled from `chain.outputs[0]`, never `chain.label`.** A role judgment about which field the corpus's commodity slot means. | Read one rendered line per branch and confirm the commodity reads true of the town. The refusals (interior capital, parenthetical) are mine and could be too strict or too loose. | `namedMagicChainGood` docblock; the fill arms; §2.2's rendered sample | ⭐ MEDIUM |
| 5 | **DS-DEF-7 stays dark rather than being mounted into `DefenseWarFrontSection`.** I judged that mounting into a component with zero production callers would satisfy the walker and lie. | Confirm the citation reading. Then rule the act: wiring `DefenseWarFrontSection` (and its three unmounted siblings) into the dossier is a SURFACE decision, and those four components have been built and unwired for some time — which is its own finding. | `DEF7_DARK_POOLS` docblock; the zero-caller arm with its liveness anchor | ⭐ MEDIUM |
| 6 | **The producer's granary/no-granary asymmetry is mirrored rather than cured.** `deriveSupportingCapabilities` branches on the institution flag on one side and the config value on the other. | Is mirroring right, or should the producer be cured and both sides read one field? Mirroring keeps the sentence and the note agreeing; curing changes what the tab prints. | `supplyLogisticsPoolKey` docblock; the mirror arm over four generated worlds | ⚪ LOW |
| 7 | **The ARM 2 blindness is reported, not fixed.** I did not edit `dossierMountRegistry.walker.test.js` because DESK-9's brief owns it. | Route the cure to DESK-9 (find callers by IMPORT PATH). Until then the estate's guard under-covers every multi-export desk, not just this one. | §3 above; my equivalent arm in `defenseStateProseDesk.test.js` | ⭐ MEDIUM — it is a GUARD, and a guard that has stopped covering is worse than a missing one |

### Standing caution
Per the 09-05 owner directive, anything built on this lane may be built on an Opus fault.
The two lit positions are load-bearing on judgment #2 in particular: if the chair rules the
other way, DS-DEF-6's mount stays but its READ changes, and the four blocked lenses would
need DS-DEF-2/DS-DEF-5 stepped down in the same commit.

---

# ADDENDUM — THE EXECUTED PROOF (this section supersedes §8.2 and §8.3)

The gate released the box at 06:58. The quiet window opened after 13 probes
(`=== QUIET WINDOW OPEN at 06:58:40 after 13 probes ===`), and everything below ran through
`sh scripts/gate-mutex.sh --run`. Every exit captured in-shell.

## A. THE SUITES — CONFIRMED GREEN
```
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/defenseStateProseDesk.test.js \
  tests/lint/dossierMountRegistry.walker.test.js \
  tests/lint/couplingDesk.walker.test.js \
  tests/lint/autoresolveTwoMount.walker.test.js \
  tests/ui/defenseTabFlow.test.js
RUN1B_EXIT=0    Test Files  5 passed (5)      Tests  133 passed (133)
```
The first run of the same five was 132/133; the single red was **my own imprecise claim**,
not the code, and it is corrected in car `468663f56` (§D below).

## B. `npx vitest run tests/lint/` WHOLE — CONFIRMED, exit 1, and every red attributed
```
RUN2B_EXIT=1    Test Files  4 failed | 134 passed (138)
                     Tests  6 failed | 2125 passed (2131)
```
| failing arm | mine? | verdict |
|---|---|---|
| `sovereigntyLightingContract` ×1 — *"the estate's file count moved: expected 2523 to be 2522"* | **YES, and PREDICTED** | the lighting census, moved by this lane's ONE new test file. **CHAIR RE-TAKES.** My §6.1 prediction of `files 2522 → 2523` is CONFIRMED exactly by the instrument's own message. |
| `proseNumerics` ×2 — *"DefenseTab.jsx:404 is no longer a source line"* | **YES, and PREDICTED** | the 404 → 424 relocation. Net zero rows. **CHAIR ABSORBS with plain `--write`.** |
| `observedShapeReaders` ×2 | **NO** | driven by `economyStateProse.js:328 isCriminal on incomeSources` (`row?.isCriminal`). That file is **byte-identical to `940d161ca`** in this dock (`git diff 940d161ca --stat` on it is empty), so it is red AT BASE. ⚠ Raised to the chair below. |
| `clampPrimitiveBaseline` ×1 | **NO** | named in `_DESK-LAW.md` as the one red that is not a lane's. |

⭐ The observed-shape arms were **3** on the first run and are **2** now: one row WAS mine and
is cured (§D2). Confirmed by `node scripts/check-observed-shape-readers.mjs`, violations
**2 → 1**, and by `--report`, in which **no row is attributed to any new line this lane
wrote** (the 13 report lines naming my files are all pre-existing rows at lines I did not
touch — `ViabilityTab` `warnings` ×6, `OutputContainer` `campaignState` ×7).

## C. THE PLANT-OUT — CONFIRMED, and it is a two-sided proof of THE CITATION LAW
The plant removed the DRAW at both new positions and KEPT the mount literal.
```
PLANT_WALKER_EXIT=0   dossierMountRegistry.walker  Test Files 1 passed   Tests 20 passed (20)
PLANT_UI_EXIT=1       defenseTabFlow               Test Files 1 failed   Tests 6 failed | 1 passed (7)
CMP_DEFENSETAB_EXIT=0  CMP_VIABILITYTAB_EXIT=0     PORCELAIN_LINES=0
```
**The walker stayed GREEN over a page that draws nothing.** That is the trap `_DESK-LAW.md`
names, demonstrated rather than quoted: the reachability arm sees the literal and cannot
tell a draw from a citation. The UI test went red on **six of its seven** arms, and it failed
on the LIVENESS ANCHOR — `expectPresentThenAbsent` refused to let the public-gate negative
pass vacuously against a page that had stopped speaking, which is the anchored-negative
helper doing exactly its job:
> *LIVENESS ANCHOR [public gate: the DS-DEF-9 dependency sentence]: the before-collection
> must already contain the member the operation is supposed to remove. It does not — so the
> "it is gone afterwards" assertion below would pass vacuously.*

Restore was by INVERSE EDIT and verified with `cmp` against backups taken BEFORE the plant
(both exit 0), not by eyeballing a diff. The one arm that still passed under the plant is
the router-threading arm, which reads source rather than DOM — correct, and it is why it is
not the only arm.

## D. TWO CORRECTIONS THE INSTRUMENTS FORCED (car `468663f56`)
Both are the **charter-the-permission, measure-the-mechanism** shape: the ruling car 7 made
was right; the mechanism it named was wrong.

**D1. The parenthetical is the token DE-UNDERSCORED, not the token.** Car 7 claimed the
corpus "carries the producer's own stress token in parentheses", and its pin redded:
> *AssertionError: politically fractured is not a stress type: expected [ 'under_siege',
> 'famine', …(13) ] to include 'politically fractured'*

MEASURED over all six parenthesised pools: all six resolve after `replace(/ /g, '_')`, and
exactly **three** resolve without it (`famine`, `indebted`, `wartime` — the single-word
tokens). So a route keying on the parenthetical verbatim reaches 3 of 6 and drops 3 in
silence. The arm now pins the trap's SIZE, not just its existence.

**D2. `sentence on dependency` — a false positive about the behaviour, a true one about the
name.** The observed-shape ratchet convicted `ViabilityTab.jsx:37`. Its diagnosis ("a key no
writer produces") is wrong — `legibilityRung` writes that `sentence` two modules away. What
it actually found is that it grounds a receiver BY NAME and **`dependency` is already the
supply-chain vocabulary's own word** (`activeChains[].dependency`,
`magicSubstitution.js`'s `substitution.dependency.band`, `EconomicsTrade.jsx`'s
`c.dependency`). Car 7 had put a second, unrelated meaning on a load-bearing identifier.
The cure is the **rename to `arcaneReliance`** — right for a human reader independently of
the ratchet — and not a contortion to dodge the scanner. Confirmed: violations 2 → 1.

## E. ⛔ SECOND FINDING FOR THE CHAIR — a red at the consist's own base
`src/domain/display/stateProse/economyStateProse.js:328` reads `row?.isCriminal` on
`incomeSources`, a key the generation corpus never observes, and the file has **no frozen
row for it (ceiling 0)**. The file is byte-identical to `940d161ca`, so this is red at the
base every desk lane of this span is sitting on, and it will red `npx vitest run tests/lint/`
for all of them. It is the economy desk's leaf — DESK-ECON2's neighbourhood, not mine. Per
the preamble's own law it should be INVESTIGATED, never deleted on the ratchet's word: the
ratchet reports its corpus's reach, not the code's truth, and `isCriminal` may well be
written by a path the four-config corpus does not exercise.

## F. FINAL STATE
```
HEAD      468663f56abcff211f2ed0d0d8990532e7ca03a3
porcelain 0
```
| sha | car |
|---|---|
| `54a54a3a6` | car 7 — the four blocks resolved: DS-DEF-6 and DS-DEF-9 lit, DS-DEF-7 and DS-DEF-10 declared dark with measurement |
| `adafe068d` | car 7.1 — five un-anchored negatives cured with a real upstream length arm |
| `8f594fef9` | car 7.2 — two arms were asserting against the draw, not the subject |
| `468663f56` | car 7.3 — the de-underscored token, and the `dependency` name collision |

⛔ No `--amend` anywhere. No register door taken: no `--write`, no `--update`, no `--genesis`,
no `--rebank`, no `*_REFREEZE`. No `npm run build`, no `npm install`, no `git stash`, no
`git add -A`, node_modules never materialised. `dossierMounts.js` touched only in this
leaf's rows: two appended at the END of `DOSSIER_MOUNTS`, two ids removed from
`UNMOUNTED_BLOCKS`, one id per line preserved for the chair's token resolver.
