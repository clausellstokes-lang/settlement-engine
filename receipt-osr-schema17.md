# RECEIPT — LANE OSR-SCHEMA17 — ⚠ **PARTIAL: THE ACT LANDED, FOUR PROOFS ARE OWED**
⟦Seat: Opus 5 — Fable-unvalidated · Lane: OSR-SCHEMA17 · 2026-09-05⟧

**STATUS — read this before anything else.**
- ✅ **The act is COMPLETE and LANDED in the dock.** Three cars; the schema-17 rung is minted, the
  register is re-frozen, and `node scripts/check-observed-shape-readers.mjs` **exits 0** at the tip.
- ⛔ **FOUR VITEST PROOFS ARE OWED**, because the chair ordered a vitest hold mid-lane
  ("HOLD ALL VITEST NOW until the chair sends RESUME"). **No vitest arm has been executed at the
  cured tip.** The exact commands and my written predictions are in
  **PROOFS — OWED-UNTIL-RESUME** below. ⚠ Do not compose this consist onto the product tip until
  they have run.
- ⚠ The header stays PARTIAL for that reason alone; nothing here is blocked or half-built.

| sha | car |
|---|---|
| `d65329d58` | the corpus gains a STRESS-LOADED TOPOLOGY pass, into `roots` and deliberately not `generated` |
| `0742f8ff5` | the schema **16 → 17** rung is minted |
| `a2af55cde` | the schema-17 genesis: the governed migration executed, the register re-frozen |

**Headline:** rows cleared **12** (+1 unfrozen target = 13) · rows minted **0** · rung **17** ·
gate cost **+3 s / ≈ +20 %** · dock porcelain **0**.

## Dock, verified on arrival
- `$SC/laneINTEG-tree` HEAD = `940d161ca155ab2be76c9d15b9a8207d9c2f7c2f` ✅ matches brief
- porcelain **0** ✅ · detached ✅ · `node_modules` 454 symlinks, `pg` present ✅
- `scripts/lib/observed-shape-corpus.mjs` sha256 `c964bb9f…a3e7` — byte-identical to the file lane
  OSRCORPUS recorded, so the surface I measured is the surface they measured.
- ⚠ NO ACTIVE GIT HOOKS in this dock (`.git/hooks` holds only `*.sample`; `core.hooksPath` unset),
  so no `eslint --fix` re-stage can void a green here.

## STEP 1 — THE PREMISE, RE-DERIVED. BOTH LEGS CONFIRMED.

### 1a · The corpus IS a governed detector source — CONFIRMED, executed
```
isDetectorSourcePath('scripts/lib/observed-shape-corpus.mjs')  ->  true
DETECTOR_INPUT_PATHS = ["tests/fixtures/spatialPackFixtures.js"]   # the only absorbable one
BASELINE_SCHEMA = 16 · baseline.schema = 16 · LEAF_MIGRATION_PREDECESSOR tops out at 16:15
```
⇒ **rung 17 is free and nothing has claimed it.** Receipt: `$SC/osrschema17/p1-detector.out`.

### 1b · The topology-only change clears the target with ZERO new identities — CONFIRMED
The gate refuses to scan a moved detector source, so the comparison was taken **out of band**
through the gate's own declared post-scan chain (M6 → M11 → M12 → M8/M9 → M13), and the
reproduction was **validated against the frozen register before it was trusted**:

| BASE run of my chain | frozen baseline | |
|---|---|---|
| identities 1410, total 1994, files 388 | 1409 / 1993 / 388 | ✅ differs by exactly the ONE new row |
| corpusMeta, all nine fields | the baseline's frozen `corpusMeta` | ✅ **field for field** |
| inventory diff vs frozen | — | **0 gone · 1 new · 0 count-moved** |

The one new row is `src/domain/display/stateProse/economyStateProse.js :: isCriminal on
incomeSources` — the exact row the real gate reports (`gate-BASE.out`, exit **1**).
⇒ my out-of-band instrument reproduces the register identity-for-identity. It is the same measurement.

## STEP 2 — the topology-only corpus change (applied; see commit below)

## PROGRESS
- [x] brief + preamble + 4 rulings read in order
- [x] step 1: premise re-derived — BOTH LEGS CONFIRMED
- [ ] step 2 committed
- [ ] step 3: schema-17 mint
- [ ] step 4: shrink re-freeze + every vanished row named
- [ ] step 5: corpus generation cost
- [ ] proofs
- [ ] RETROVALIDATION ROW

## ⭐ EVERY REGISTER FIGURE, PREDICTED IN WRITING BEFORE THE INSTRUMENT RAN
(preamble rule; measured out of band through the validated chain, at the tree with car A + car B)

| figure | predicted |
|---|---|
| `schema` | **17** |
| `predecessorSame` | **1397** |
| `predecessorGone` | **12** |
| `predecessorNew` / `predecessorIncreased` / `predecessorDecreased` | **0 / 0 / 0** |
| froze | **1972 findings / 1397 identities / 386 files** |
| report `issues` | **exactly 1** — the scanner transition, naming FOUR delta paths |
| review decisions | **1410** = 1409 predecessor rows + 1 scanner transition |
| `rowTags` | **41 addresses / 62 reads** (was 43 / 64) |
| `corpusMeta` | seeds 4 · configs 4 · generations 16 · pulseIntervals 12 · flagsLit 80 · steadings 12 · shapeCount 1299 · **originCount 8560** · **transitionCount 14496** |
| `minRows` / `originMinRows` | 40 / 8, unmoved |
| `unscannedInputDigest` | `158d2a7b…` UNMOVED (this rung touches only `scripts/`, not a subject path) |

### The delta set, MEASURED and re-measured after it was written (a fixed point)
```
MOVED (4):     scripts/check-observed-shape-readers.mjs · scripts/lib/observed-shape-baseline.mjs
               scripts/lib/observed-shape-corpus.mjs · scripts/migrate-observed-shape-readers.mjs
BYTE-SAME (7): package.json · package-lock.json · governed-artifact-io.mjs ·
               legacy-reader-shape-scan.mjs · observed-shape-governance.mjs ·
               reader-shape-scan.mjs · spatialPackFixtures.js
```
`package.json` and `package-lock.json` are **measured** byte-same, not asserted. 11 − 4 = **7 retained**.

### The walker pins this rung moves, each predicted before running
| pin | from | to | why |
|---|---|---|---|
| register bank `{reads, addresses}` | 64 / 43 | **62 / 41** | the two banked `isCriminal` addresses are deleted by the shrink |
| `live.explainedWriters.banked` | 64 | **62** | same |
| `bankedIdentities` roster | 9 | **8** | `isCriminal on incomeSources` banks nothing now (still DECLARED — roster stays 9) |
| both per-identity maps | `isCriminal…: {2,2}` | **`{0,0}`** | same |
| `clearOutright` length | `findings − 64` | **`findings − 62`** | same |
| shapes carrying `source` | 12 | **14** (`stress`, `stressors`) | the stress pass's own receipt that it executed |
| the tree-shaped triple | — | **self-curing** | it reads `registerFigures()`, not a literal |
| UNREVIEWED-UI gap `{1, 18, 48}` | — | **predicted UNCHANGED** | all four filter-cleared counts are byte-identical BASE vs cured (124 / 11 / 0 / 4) |

---

## STEPS 2–4 — LANDED. THREE CARS.

| sha | car |
|---|---|
| `d65329d58` | the corpus gains a STRESS-LOADED TOPOLOGY pass, into `roots` and deliberately not `generated` |
| `0742f8ff5` | the schema 16 → 17 rung is minted |
| `a2af55cde` | the schema-17 genesis: the governed migration executed, the register re-frozen |

### Step 2 — the topology-only corpus change
One config × the four seeds under `insurgency` + `famine`, pushed into `roots` and NOT into
`generated`. Documented at the edit site: why `roots` (a conditional writer invisible to a corpus
that never satisfies its condition), why not `generated` (it is producer 2's save list; anything
added re-rolls the pulse and pushes thin shapes across `MIN_ROWS` into being judgeable, which
MINTS rows), and why `meta.generations` deliberately stays at 16 (`seeds`/`configs`/`generations`/
`pulseIntervals` are the migration's EXECUTION-IDENTITY keys and must match the predecessor exactly
— the mechanical reason this pass cannot go through `generated`).

### Step 3 — the schema-17 mint, part by part
- `STRESS_TOPOLOGY_TARGET_SCHEMA = 17` + its rung docblock
- `LEAF_MIGRATION_PREDECESSOR[17] = 16` (the chain stays SINGLE-STEP)
- `LEAF_PREDECESSOR_VALIDATOR[16] = validateSchema16Baseline`, re-bound to its RETIRED literal
- `SCANNER_TRANSITION_BY_TARGET[17]` with the MEASURED four-path `deltaPaths`
- `STRESS_TOPOLOGY_SCANNER_TRANSITION_POLICY = 'schema-16-to-17-exact-scanner-transition-v1'`
- `RETIRED_COMPANION_GATE_BASELINE_SCHEMA = 16`, `BASELINE_SCHEMA = 17`,
  `validateSchema17Baseline` minted, the checker's three bindings moved to it
- header rationale paragraphs in `migrate-observed-shape-readers.mjs` (the list entry and the
  rung docblock), in the voice every prior rung uses
- the CLI's default target and its allowed-target law
- ⭐ **the delta set is a FIXED POINT**: re-measured after it was written (writing it changes
  `migrate-observed-shape-readers.mjs`, itself a member) — declared == measured == **4**

### Step 4 — the governed shrink re-freeze, and EVERY VANISHED ROW BY NAME
```
node scripts/check-observed-shape-readers.mjs --write --migrate-schema=17 --migration-review=<bundle>
=> froze 1972 finding(s) / 1397 identit(ies) across 386 file(s)          EXIT 0
```
Every predicted figure hit exactly. Reconciliation: **same 1397 · gone 12 · new 0 · increased 0 ·
decreased 0.** Structural proof rather than a trusted count: `minRows`, `originMinRows` and `_doc`
are BYTE-IDENTICAL to the schema-16 predecessor; the inventory removes 12 rows, adds **zero**, and
changes **not one** surviving row's count.

| # | file | identity | was | CAUSE — the writer the corpus can now see |
|---|---|---|---|---|
| 1 | `src/components/new/tabs/EconomicsTab.jsx` | `isCriminal on incomeSources` | 1 | `economy/economicState.js:349`, inside `if (safetyProfile.blackMarketCapture > 10)`; `safetyProfile.js:607-619` makes `stressShadowBonus` exactly 0 with no stress flag |
| 2 | `src/domain/worldPulse/treasury.js` | `isCriminal on incomeSources` | 1 | same writer, same gate |
| 3 | `src/domain/display/stateProse/economyStateProse.js` | `isCriminal on incomeSources` | (the NEW row — never frozen) | same writer, same gate — **the lane's target** |
| 4 | `src/domain/rulingPower.js` | `modifiers on factions` | 4 | `power/stressFactions.js:179`, `ke('insurgency')` appending `'contested legitimacy'` |
| 5 | `src/domain/worldPulse/occupation.js` | `modifiers on factions` | 5 | same |
| 6 | `src/domain/worldPulse/applyWorldPulseOccupationAuthority.js` | `modifiers on factions` | 1 | same |
| 7 | `src/pdf/lib/viewModel.js` | `modifiers on factions` | 1 | same |
| 8 | `src/domain/worldPulse/factionCompetition.js` | `captureState on factions` | 3 | `power/rulingStructure.js:766`, stamped only at rung `equilibrium`/`corrupted`/`capture` |
| 9 | `src/domain/worldPulse/beliefMap.js` | `captureState on factions` | 1 | same |
| 10 | `src/domain/worldPulse/npcLadderKernel.js` | `captureState on factions` | 1 | same |
| 11 | `src/generators/historyGenerator.js` | `message on issues` | 1 | `economy/foodBalance.js:437-451`, gated on `if (stressNotes.length > 0)` — unstressed, the `issues` shape is not observed AT ALL |
| 12 | `src/pdf/lib/viewModel.js` | `priorityNote on issues` | 1 | same |
| 13 | `src/pdf/lib/viewModelBodySlices.js` | `priorityNote on issues` | 1 | same |

**12 frozen + the 1 unfrozen target = 13.** Five keys entering three shapes; 3 + 4 + 3 + 1 + 2 = 13
accounts for every vanished row with **nothing left over**.

⭐ **Each cause was measured, not argued** — producer 1 folded alone, unstressed vs stressed:
```
incomeSources   unstressed keys: desc, percentage, priorityNote, source, weight
                stressed   keys: desc, ISCRIMINAL, percentage, priorityNote, source, weight
factions        unstressed: … modifier … (no `modifiers`, no `captureState`)
                stressed:   … CAPTURESTATE, crisisNote, legitimacyCrisis, MODIFIERS …
issues          unstressed: THE SHAPE DOES NOT EXIST
                stressed:   category, description, MESSAGE, PRIORITYNOTE, severity, title, type
```
⛔ **AND A ROW COULD NOT HAVE VANISHED FOR ANY OTHER REASON — structurally, not case by case.** The
pass ADDS roots and removes none, so no shape can lose rows and none can fall back under
`MIN_ROWS = 40`. The only available mechanism for a disappearance is a key entering an observed
shape's union.

⭐ **An arithmetic cross-check I did not plant.** The exemption's own recorded figure was "3,068
observed incomeSources rows"; the cured corpus observes **3,107**, and my isolated 4-generation
stress fold observes **39**. 3,068 + 39 = 3,107 — two independent measurements, taken years of
commits apart, reconciling to the row.

---

## STEP 5 — THE CORPUS'S NEW GENERATION COST, WHICH THE CHAIR PAYS ON EVERY RUN

⚠ **The honest headline is the GATE-GRADE before/after**, because it is one whole scan of the real
instrument on each side and it is the thing the chair actually waits for:

| | command | wall | load-1 at the time |
|---|---|---|---|
| **BEFORE** | `node scripts/check-observed-shape-readers.mjs` at `940d161ca` | **15 s** | 5.19 |
| **AFTER** | the same command at `a2af55cde` | **18 s** | 3.33 |

⇒ **≈ +3 s, about +20 %, on every full gate run.** Mechanism: producer 1 does 20 generations
instead of 16 (+25 % of the generation leg); producer 2's pulse — the expensive half — is
untouched, which is why the whole-gate figure is well under +25 %.

⛔ **AND A CORRECTION THE CHAIR SHOULD HAVE: "≈ free / +1 %" IS NOT WHAT I MEASURED.** The
`buildObservedCorpus()`-only timings I took are badly load-confounded on a four-lane machine and I
am reporting them as such rather than picking the flattering one:

| build-only | ms | conditions |
|---|---|---|
| BASE (unchanged corpus) | **8 429** | load-1 ≈ 5 |
| CURED, run 1 | **12 777** | load-1 rising |
| CURED, run 2 | **21 953** | a sibling's `tests/domain tests/lint tests/copy` in flight |

The spread inside ONE configuration (12.8 s → 22.0 s) is larger than the difference between
configurations, so **no build-only figure here is trustworthy and I did not loop to chase one** —
the brief's own instruction. Take the gate-grade **+3 s / +20 %** and treat the earlier
"≈ free" as unmeasured on a busy machine.

---

## FINDINGS THE CHAIR OWNS — none of them absorbed, none of them fixed by me

### F1 ⭐ THE NINTH EXEMPTION IS NOW UNEXERCISED, AND ITS RECORDED `why` WAS FALSE
`isCriminal on incomeSources` is still one of **nine DECLARED** explained-writer exemptions, but it
now banks **zero** rows (the gate says so itself: *"9 declared identit(ies) … banked and enforced
62 read(s) across 8 of them"*). Its `why` recorded *"MEASURED: the corpus observed 3,068
incomeSources rows and NOT ONE carried isCriminal … dead on generated worlds by construction"* —
the count was true, the conclusion was **the corpus speaking for the code**, and this rung
falsifies it. **I corrected the `why` in place** (the `ruling` field is untouched: it is history,
and a tag reason is append-only without numeric growth).
⛔ **Whether to RETIRE the declaration is a CHAIR act, not a lane one** — the declared roster of
nine is pinned in three arms and its removal would move a ceiling. My reason for keeping it: the
read is real, W-COIN taxation must have it, and the entry is the standing permission if the corpus
ever loses that reach again.

### F2 ⚠ THE REGISTER'S OWN `_doc` HEADER IS SIX RUNGS STALE, AND I DELIBERATELY DID NOT FIX IT
`scripts/check-observed-shape-readers.mjs:2543` still opens the register with *"SCHEMA 10 = schema
9's topology, tag law and **eight-identity** M8/M9 bank …"*. The live schema is **17** and the bank
is **nine** declared. Rungs 11 through 16 each left it as it stands, so this is a pre-existing
condition and not something my rung introduced.
⛔ **Not fixed, and the reason is mechanical, not preference:** `_doc` is a source constant inside a
governed DETECTOR SOURCE. Editing it moves the detector digest, which invalidates the manifest this
rung just froze and would require a SECOND `--write` — and the brief's fence is *"take no other
register act."* It is the next rung's cheapest passenger. **Deliberately deferred — documented,
not a bug to re-find.**

### F3 ⚠ THE CORPUS COST IS +20 % AT GATE GRADE, NOT "≈ FREE"
See STEP 5. The "≈ free / +1 %" carried into this brief is not what I measured, and my own
build-only numbers are too load-confounded to replace it with a better small number. The gate-grade
before/after is the figure to quote.

### F4 ⭐ `stress` AND `stressors` NOW CARRY AN OBSERVED `source` KEY
The walker's shapes-carrying-`source` roster goes 12 → 14. That is the corpus's own receipt that
the stress pass actually executed, and it is why that pin is a good place for it to be visible.

### F5 ⚠ THE NEXT FREE RUNG IS NOW 18
`RULING-SCOPE-CORRECTIONS.md` §2 says the lighting wave's migration, if owed, takes the next free
rung after this one. **That rung is 18.** `LEAF_MIGRATION_PREDECESSOR` now tops out at `17: 16`.

### F6 ⭐ THE 10→11 RE-RUNNABILITY DEMONSTRATION IS NOW A FACT, NOT A DEMONSTRATION
The 15→16 car proved by execution that `assertPredecessorCustody` accepts a predecessor whose
`frozenAtSha` has advanced past its `subjectSha`. This mint's predecessor was exactly such a
baseline — frozen at `c08df7d5`, subject `0cf7185e1` — and the migration accepted it. A future
17 → 18 survives an ordinary shrink for the same reason.

---

## PROOFS — WHAT RAN, AND WHAT IS **OWED-UNTIL-RESUME**

⛔ **THE CHAIR ORDERED A VITEST HOLD MID-LANE** (09:49, "HOLD ALL VITEST NOW until the chair sends
RESUME — a gate-class run … needs the quiet window"). I stopped my quiet-window probe at that
message and ran no vitest. Every vitest proof below is **OWED**, with its exact command.
⚠ My own quiet-window probe never opened in 30 minutes of probing anyway — the machine went
`load1 = 2.04 → 59.48` with 2–15 sibling vitest workers throughout; best streak was **1 of 3**
(probe 19, 09:38). Log: `$SC/osrschema17/quiet.log`.

### ✅ RAN — every exit captured in-shell as `CMD; E=$?`
| proof | exit | result |
|---|---|---|
| `node scripts/check-observed-shape-readers.mjs` (BASE, `940d161ca`) | **1** | one NEW row: `isCriminal on incomeSources` — the target, reproduced |
| `node scripts/check-observed-shape-readers.mjs --scan-only --scan-mode=legacy-leaf` | **0** | 1972 findings; bank "**62 read(s) across 8 of** 9 declared" |
| `migrate-observed-shape-readers.mjs … --target-schema=17` (report + template) | **0** | same 1397 · gone 12 · new 0 · increased 0 · decreased 0; **exactly 1 issue** |
| the same with `--review` + `--bundle` | **0** | bundle built, 1410 accepted decisions |
| `check-observed-shape-readers.mjs --write --migrate-schema=17 --migration-review=<bundle>` | **0** | `froze 1972 finding(s) / 1397 identit(ies) across 386 file(s)` |
| **`node scripts/check-observed-shape-readers.mjs` (CURED, `a2af55cde`)** | **0** | **"1972 finding(s), exactly matching the frozen inventory."** |
| `npm run typecheck:domain:strict` (the REAL script) | **0** | `✓ no strict-type regressions (1121 errors, ceiling 1121)` |
| `npx eslint` on all 8 touched source/test files | **0** | clean |

### ⏳ OWED-UNTIL-RESUME — run these, in this order, once the chair sends RESUME
All under the quiet-window law and the mutex, from `$SC/laneINTEG-tree`:
```sh
sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/observedShapeReaders.walker.test.js
sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/dossierMountRegistry.walker.test.js \
      tests/lint/couplingDesk.walker.test.js tests/lint/autoresolveTwoMount.walker.test.js
sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/
```
then **THE PLANT, as ONE atomic block** (the backups are already taken, so the restore is a
byte-exact copy rather than a hand inverse edit — strictly stronger, and never `git checkout`):
```sh
cp $SC/osrschema17/corpus.mjs.PRE   scripts/lib/observed-shape-corpus.mjs   # plant OUT
node scripts/check-observed-shape-readers.mjs; E=$?                        # expect 1
sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/observedShapeReaders.walker.test.js
cp $SC/osrschema17/corpus.mjs.CURED scripts/lib/observed-shape-corpus.mjs   # restore
cmp $SC/osrschema17/corpus.mjs.CURED scripts/lib/observed-shape-corpus.mjs  # MUST be silent
git status --porcelain | wc -l                                             # MUST be 0
```
`corpus.mjs.PRE` sha256 `c964bb9f…a3e7` (verified `cmp`-identical to `d65329d58^`'s version);
`corpus.mjs.CURED` sha256 `a11fca20…dca3`.

### ⭐ PREDICTED OUTCOMES FOR THE OWED PROOFS — written BEFORE they run, so they can convict me
1. `observedShapeReaders.walker.test.js` → **green**. Its five moved pins were measured, not
   guessed: register bank 62/41, `live.explainedWriters.banked` 62, banked roster 8 (declared 9),
   both per-identity maps `isCriminal…: {0,0}`, `clearOutright = findings − 62`, and the
   shapes-carrying-`source` roster 12 → 14 with `stress` and `stressors` joining.
2. The UNREVIEWED-UI gap `{files: 1, identities: 18, counts: 48}` → **unchanged**, because all four
   filter-cleared counts are byte-identical BASE vs cured (**124 / 11 / 0 / 4** — measured on both
   sides, and the real detector printed the same four at the cured tip).
3. The scalar-corpus pins (`wizardNewsFinalEntries: 240`, `wizardNewsAccumulatedEntries: 1567`,
   `wizardNewsUnique: 272`, `pulseHistory: 12`, `regionalEventLog: 77`) → **unchanged**. Read at
   source: `scalarRoots` is fed only by producer 2 and the two AO families; the stress pass writes
   to `roots` alone and never enters `saves`.
4. `tests/lint/` WHOLE → exit **1** with **only `clampPrimitiveBaseline`** failing (not mine).
5. The three desk walkers → **136 passed (3 files)**, unchanged: this lane touched no `src/` file,
   no `dossierMounts.js` and no desk leaf.
6. THE PLANT → the gate **exit 1** on the detector-source refusal (the corpus would no longer match
   the digest schema 17 just froze), and the walker **red** — on MORE than the two original arms
   now, because the register has moved to the cured figures: SHRINK-ONLY (12 rows reappear as
   growth against the frozen inventory), the A1/A7 bank (64 ≠ 62), the banked roster (9 ≠ 8) and
   the shapes-carrying-`source` roster (12 ≠ 14). **If any of those four stays green with the
   change planted out, this act is not doing what I claim and the chair should say so.**

### Census
**No file was added, renamed or deleted** under `src/` or `tests/` — 9 files modified, listed above.
**No census act is owed.** No `src/` file was touched at all, so no desk leaf and no
`dossierMounts.js` conflict with the five sibling desk cars on this base.

---

## WHAT I DID NOT DO
No ceiling was raised. **No identity was added — 0 minted, measured three independent ways** (the
out-of-band chain, the migration report's `predecessorNew: 0`, and a field-by-field diff of the
frozen inventory). No read was deleted or re-pointed. No exemption was removed. No CONFIG was
added to the corpus. No `src/` file was touched. No second register act, no `--rebank`, no
`--genesis`, no hand-edit of the baseline, no ceiling file touched. No rebase, no push, no ref
write, no `git stash`, no `git add -A`, no `--amend`, no `git checkout --`, no
`git show <sha>:<path> > <path>`. No `npm install`, no `npm run build`, no `node_modules` touched.
No vitest after the chair's hold.

---

## RETROVALIDATION ROW
⟦**OPUS-AUTHORED — Fable retrovalidation OWED**⟧ · lane OSR-SCHEMA17 · 2026-09-05 · Seat: Opus 5.

**WHAT WAS JUDGED (chair must re-derive):**
1. **That a shrink of the explained-writer BANK is inside "no ceiling moves".** I moved the walker's
   deliberate literal 64/43 → 62/41 and the live banked count 64 → 62. The withdrawn ruling's
   refused act was a RAISE (64 → 65); this is the opposite direction and it is what a governed
   shrink looks like. **A chair who disagrees should say the walker may not be re-pinned, in which
   case the whole act is unlandable** — the rung cannot both clear the rows and leave the bank pin.
2. **That the ninth exemption is KEPT rather than retired** now that it banks zero rows. My reason
   is in F1; retiring it is a roster change and I judged that a chair act.
3. **That the exemption's falsified `why` should be corrected in place** rather than left standing
   or deleted. The `ruling` field is untouched.
4. **That `_doc`'s six-rung staleness is deferred, not fixed** (F2) — because fixing it needs a
   second `--write`, which the brief's fence forbids.
5. **The choice of `insurgency` + `famine` on `CONFIGS[0]` × four seeds** — one config, not four,
   to keep the added topology minimal.

**RE-DERIVE THESE FIGURES:** `predecessorGone 12 / New 0`; the four-path delta as a fixed point;
bank 62/41; corpusMeta `originCount 8560`, `transitionCount 14496` with the other seven unmoved;
and the **+20 % gate cost**, which contradicts the "≈ free" figure this brief inherited (F3).

**RECEIPTS BY PATH** (all under `$SC/osrschema17/`):
`p1-detector.out` (detector-source + rung-free proof) · `gate-BASE.out` + `gate-BASE.exit` ·
`chain.mjs`, `chain2.mjs`, `chain-BASE.json`, `chain-OPTB.json`, `chain-OPTB2.json`,
`inv-BASE.json`, `inv-OPTB.json`, `rows-*.tsv` (the validated out-of-band chain) ·
`p2-vanished.mjs` + `p2-vanished.out` (every vanished row's cause, producer 1 folded alone) ·
`predecessor-schema16.json`, `legacy-artifact.json`, `report.json`, `review-template.json`,
`review-completed.json`, `bundle.json`, `write.out` (the governed migration, end to end) ·
`gate-CURED.out` + `gate-CURED.exit` · `typecheck.out` · `eslint.out` · `quiet.log` ·
`corpus.mjs.PRE` / `corpus.mjs.CURED` (the plant's backups).

**PRIORITY: HIGH.** This is a register act plus a schema rung, and the desk consist was blocked on
it. The four owed vitest proofs (walker, the three desk walkers, `tests/lint/` WHOLE, and the
plant) must be run at RESUME **before this consist is composed onto the product tip** — the gate,
the migration and the typecheck are green, but no vitest arm has been executed at the cured tip.

**PLAUSIBLE (reasoning only, not executed):** every item in the "PREDICTED OUTCOMES FOR THE OWED
PROOFS" list above. **CONFIRMED (executed, quoted):** everything in the "RAN" table, every figure
in the prediction table that the instrument then printed, the 12 vanished rows and their causes,
and the final dock state.

**DOCK AT HAND-OFF:** `HEAD = a2af55cde53b1a5744c9ae91c7122ae23588d238`, porcelain **0**, three
cars over `940d161ca` (which is itself the 23-car desk consist over product `90702c3e9`).
`node_modules` untouched — 454 symlinks, `pg` present. Not rebased; the chair replays.
