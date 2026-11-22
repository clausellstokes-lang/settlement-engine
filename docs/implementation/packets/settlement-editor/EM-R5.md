# Settlement editor / EM-R5 — THE TRACE PARTITIONED BY EVERY STEP ABOUT A HELD KEY: a carried step's recorded run is restored whole, a deriving step's is the re-derivation's, the clock is re-stamped to the position it always was, and the draw-skip that already landed stops losing 2,207 entries

- **Status:** `LANDED`
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line and takes `status`
  only when exactly one row matches. Every stamp, caveat and date belongs on these continuation
  lines, never on the row.
  ⭐ MEMBER 7 of the re-entry family EM-R (design §22.2's build order: R0a · R0b · R1 · R2 · R3 ·
  R4 · **R5** · R0c · R6 · R7). It is written to the SIXTH amendment, which has LANDED (train
  EM-T13's first commit) and STANDS at version 2's read tip `c69d16a5d`: the preamble line below
  measures the sixth itself, byte-identical to the chair's draft `drafts/amendment-6/EM-PREAMBLE.amended.md`
  (judgment 144), both `125c693214235a81bf4f2b38506b621859a35e0325ff2ea58d335b4e0681a99d`.
  ⛔ VERSION 2 MOVED THE ONE MODIFY ROW, MEASURED: `rederive` does not live in the store seat.
- **Landed at:** `f76bd62ab90babc9b2ad8c79f2c382072fa81be8` — the trace partitioned by every step about a held key (version 2): the pure leaf tracePartition.js with the subject register over 47 recordTrace sites and 4,810 corpus entries; partitionTrace carries a held step's recorded run whole, a deriving step's is the re-derivation's, ts re-stamped (2,207 entries carried, 63/63 restored); the MODIFY re-homed to dmLayer.js :: rederive (judgment 197f) with dmLayerGoldenIsolation in its checks (197g); the byte-arm holder of train EM-T15 (197h); judgments 184 a–d, 197 f–h
- **Packet version:** 2
  - Version 1 was the first cut, compiled against train EM-T12's landed tip `91cc9ef5a` by an Opus
    COMPILE seat (session cce01f87, 2026-09-22). It ANSWERS ruling 8's "MEASUREMENT OWED" by
    execution over the 63-row corpus and it REFUTES one clause of the charter's row by measurement
    — see §0 — contracting the behaviour the tree actually needs.
  - **Version 2 is the Opus PRE-PROOF re-cut at train EM-T14's composed tip `c69d16a5d`** (session
    cce01f87, 2026-09-22), and it changed exactly four things, each from a measurement the tip
    made possible. **(i) THE MODIFY ROW MOVED, and this was version 1's one refuted premise**
    (judgment 184b ordered the re-measurement): EM-B2a4 LANDED, and the file it created holds NO
    `rederive` — `src/store/settlementRederiveAction.js :: regenerateWithLayer` merely awaits the
    engine and forwards to `src/domain/edit/dmLayer.js :: rederive`, whose envelope
    `{ record, unapplied }` carries no pin set, so the bag's key set is NOT in scope in the seat
    and version 1's §6.2 could not be built there. The contract is UNCHANGED in every word — one
    call at `rederive`'s single return point, covering both `R0` and `R1` — and only its HOME
    moved to the file that actually holds `rederive`. **(ii)** the `checks` array was re-derived at
    the tip: version 1 recorded both MODIFY-side basenames as new (true at `91cc9ef5a`, where the
    seat did not exist), and the governing set is now real. **(iii)** the register absolutes were
    re-measured as deltas (§P3.5). **(iv)** the preamble line now measures the LANDED sixth.
  - ⛔ The path move is the ONE thing the chair must ratify (the pre-proof's Q1); everything else
    in this version is a re-measurement.
- **Verified base:** `em-t15-r5-2026-09-22` at `ec4cd1c2d5aebbda4df788fd4e600252adb81b5c`
  ⚠ Left for the chair's promotion stamp. **The revalidation sentence the chair will use**, every
  clause of it EXECUTED by the pre-proof at `c69d16a5dd6462068cddf140b98129bbb66d80373` (train
  EM-T14's composed tip):
  *"Re-measured at `<the train base's 40-char sha>`: both CREATE targets ABSENT
  (`src/domain/edit/tracePartition.js`, `tests/domain/tracePartition.test.js`); the one MODIFY
  target PRESENT (`src/domain/edit/dmLayer.js`, landed by EM-B2a1 on train EM-T10 and modified by
  EM-B2a4 on EM-T13); all TEN `requiredSymbols` present VERBATIM at count 1 each;
  `retiredSymbols` EMPTY; the preamble measured
  `125c693214235a81bf4f2b38506b621859a35e0325ff2ea58d335b4e0681a99d` (the SIXTH, landed)."*
  ⛔ A `__BASE__` packet can NEVER pass `validate:packets`; validation is downstream of this stamp,
  never a precondition of it. The chair's placement replaces `__BASE__` with the form
  `parsePacketHeader` parses into BOTH fields — ``- **Verified base:** `em-t16-em-r5-<date>` at
  `<sha>` `` — with the value ALONE on its line (§P9(c)).
- **Last revalidated:** left for the chair, with the sentence above.
- **Depends on:**
  - **EM-B2a4 — LANDED** (train EM-T13, `35a031ac7`), and the pre-proof read its code rather than
    its packet (judgment 134). Measured at `c69d16a5d`: `src/domain/edit/dmLayer.js :: rederive` is
    `rederive(record, config, layer, engine, declarations)` at arity FIVE, it computes its bag with
    `pinsFrom(record, layer, declarations, engine)` and it has ONE return point,
    `return { record: derived, unapplied };`. The store seat EM-B2a4 created,
    `src/store/settlementRederiveAction.js :: regenerateWithLayer`, is a four-argument async
    wrapper that awaits `loadEngine()` and forwards; it holds no `rederive` and no pin set.
    **This member therefore MODIFIES `dmLayer.js`, not the seat, and EM-B2a4 is no longer an
    ordering constraint of any kind** — the path has existed since EM-B2a1 landed on train EM-T10.
  - **EM-R1** — pins cloned on entry at the runner, and judgment 170a's ruling that a held STEP is
    SKIPPED AT ITS FORK. That skip is what empties a carried step's run in the re-derivation, which
    is what this member restores. ⚠ A PACKET, not landed code. Its declared change paths
    (`src/generators/pipeline.js`, `src/generators/steps/assembleInstitutions.js`,
    `src/generators/steps/generatePower.js`, a `tests/lint` CREATE) are **path-disjoint from this
    member's three, measured** (§5a).
  - **EM-R2 · EM-R3 · EM-R4** — the roster, the power structure and the name held. Each empties
    more carried runs; none of them changes this member's contract, and all three are path-disjoint
    (§5a). ⚠ R3 and R4 are compiling beside this member; their disjointness is PLAUSIBLE until
    their packets are installed.
  - **LANDED at this read tip, read as real code:** **EM-R0a**
    (`src/domain/edit/recordRegister.js` — the class register this member imports rather than
    re-typing, and the one import its leaf carries), **EM-B2a3** (the LANDED pin consult in
    `assembleInstitutions` whose draw-skip creates the gap this member cures), **EM-P0**
    (`runPipeline`'s pins channel and the partial-pin refusal), **EM-B2a2**
    (`export function chooseOrPin`), and the rest of trains EM-T8–T12.
  - **NOT a dependency:** EM-R0c (the merge). This member partitions each RE-DERIVATION's own
    trace, so `R0` and `R1` both reach the merge already carrying the record's runs; the merge's
    landed `ATOMIC_COLLECTIONS` row for `simulationTrace` then does the right thing unchanged.
- **Collision group:** **EM-B2b** on `src/domain/edit/dmLayer.js` — a waiting DRAFT that is NOT
  PLACED (absent from the tree's 222-packet `PACKET_MANIFEST.json`, measured), so it reserves
  nothing today and the two are separated by PLACEMENT ORDER: whichever is placed first holds the
  path, and the other's pre-proof carries the collision row. The two LANDED holders of that path,
  EM-B2a1 (CREATE) and EM-B2a4 (MODIFY), reserve nothing. No waiting packet names either CREATE
  target: `src/domain/edit/tracePartition.js` and `tests/domain/tracePartition.test.js` are named
  by NOBODY among the 42 waiting manifests and by NOBODY in the tree, measured.
  This member carries **no** row on `scripts/mutation-coverage-manifest.json` (its CREATE is under
  `tests/domain`, which `ENFORCER_DIRS` does not name), so it reserves nothing there either.
- **Commit authority:** edits only; the chair commits
- **Baseline posture:** measured at the read tip — no `scripts/.size-baseline.json` row exists for
  any of this member's paths (`src/domain/edit/dmLayer.js` included: `grep` prints no row), so no
  hot file is touched; the leaf's own cap is the standard's **250 effective lines** and the measured
  figure is **93**, and the MODIFY moves `dmLayer.js` from **195** to **204** effective lines,
  **+9** (eslint's `Linter` under `max-lines` with `skipBlankLines` + `skipComments`, §P9's one
  instrument, run over the file as it stands and over the planned text). Every register figure
  this packet predicts is a DELTA; the live absolutes are the chair's to stamp.
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR)
  > **Measured at version 2's read tip `c69d16a5d`** with `shasum -a 256`:
  > `125c693214235a81bf4f2b38506b621859a35e0325ff2ea58d335b4e0681a99d` — **the SIXTH amendment,
  > LANDED**, byte-identical to `drafts/amendment-6/EM-PREAMBLE.amended.md` (judgment 144), which
  > version 1 could only cite as a draft (the fifth, `fdecd4268…dacc9e7c`, stood at version 1's tip
  > `91cc9ef5a`). Every §P citation below is the sixth's numbering and the chair re-stamps this line
  > at placement from its own tip. ⭐ §P2.22: every citation here is `path :: symbol`.
- **Evidence:** every VERIFIED row below is receipted in `EM-R5.evidence.md` by command and output.

---

## §0 · THE MEASUREMENT — ruling 8's owed measurement answered, and the one clause the tree refutes

**§0.1 — THE "MEASUREMENT OWED" IS ANSWERED, IN BOTH DIRECTIONS.** Design §22 ruling 8 leaves open
*"whether the trace's entries carry enough to be partitioned"*. Executed over the 63-row structured
sample at `91cc9ef5a`: **4,810 entries; `step` 4,810/4,810; `ts` 4,810/4,810; `targetType`
4,810/4,810; `targetId` 4,810/4,810; `result` 4,810/4,810; `causes` and `downstreamEffects` arrays
4,810/4,810** — and the entry shape is exactly those seven fields, with no row missing any. The
second recon's `step` 95/95 was one town row; this is the same fact at corpus scale with the
SUBJECT added. **The partition is exact.**

**§0.2 — ⛔ THE ONE CLAUSE THE TREE REFUTES: "precedes any draw-skip" IS ALREADY FALSE.** The
charter's row reads *"the trace partitioned by every step ABOUT a held key | precedes any
draw-skip"*, and design §22.2 item 11 says the skip of 3,324 + 985 draws *"lands only after the
trace partition"*. **EM-B2a3 landed that skip on train EM-T12.**
`src/generators/steps/assembleInstitutions.js :: registerStep('assembleInstitutions'` now consults
`chooseOrPin` for all three of its choosers and short-circuits its whole production when the roster
is held — its own comment says *"none of its draws is taken"*. MEASURED with the landed pin channel
and the runner's own partial-pin closure, over 63 rows: **`assembleInstitutions` draws 3,324 → 0 and
entries 2,207 → 0, in 63 of 63 rows**; `subsumptionPass` 28 → 0; `coherenceRepairPass` 32 → 2;
`cascadePass` 404 → 380; `isolationPass` 14 → 7.

⇒ **EM-R5 is the CURE for a live gap on the integration branch, not a precondition for a future
one.** Nothing here is a STOP: the seam is dark behind `TIER_GATE[tier].settlementEditor` (§P11.1)
and no caller hands the runner a record-built bag until EM-B2a4 lands, so no user and no golden can
see it. The charter's ordering clause is re-worded at the charter's next amendment; the CHAIR's, not
this lane's (Q3).

**§0.3 — THE PARTITION KEY, MEASURED.** §22.1 correction 4 says the key is *"every step whose
entries are ABOUT a held key … not the producers alone"*. Measured per step over the corpus
(`institutions`, `npcs`, `factions`, `relationships`, `conflicts`, `powerStructure`, `name` read
from `src/domain/edit/recordRegister.js :: RECORD_CLASSES`):

| about a held key only | about a reading only | MIXED |
|---|---|---|
| `assembleInstitutions` 2,207 · `generatePower` 408 · `cascadePass` 404 · `generatePopulation` 126 · `corruptionPass` 46 · `coherenceRepairPass` 32 · `subsumptionPass` 28 | `economyReconcilePass` 945 · `resolveResources` 341 · `generateNarratives` 126 · `resolveConfig` 79 · `resolveStress` 54 | `isolationPass` 7 held / 7 reading |

Twelve of the thirteen emitting steps are pure; **exactly one is MIXED** (two by SOURCE, because
`coherenceRepairPass`'s `condition` site is dormant on this corpus). The producers alone are the
second recon's H1 = 7/63; the held set here is its H2 ∪ the producers = **ten steps**, which is
correction 4's own point.

**§0.4 — THE THREE STRUCTURAL FACTS THE CONTRACT RESTS ON.**
1. **`ts` IS the entry's position, 4,810/4,810.** `src/domain/trace.js :: recordTrace` stamps `ts`
   from `ctx._traceClock`, seeded `0` by
   `src/generators/generateSettlementPipeline.js :: _traceClock: 0,`, so a recorded `ts` is a
   POSITION. Carrying it verbatim would be a lie the moment a deriving step's count moved; the
   partition RE-STAMPS it.
2. **Every step's entries form ONE CONTIGUOUS RUN, 63/63.** A run is therefore the smallest unit
   that can be substituted without inventing an order, and 621 runs over 63 rows contain **zero**
   interleaved subject classes (the one mixed step's two mixed runs are reading-first two-block).
3. ⛔ **TWO STEPS MUTATE EARLIER ENTRIES AND NEITHER GOES THROUGH `recordTrace`.**
   `src/generators/steps/powerEconomyReconcilePass.js` (16 entries over 63 rows) and
   `src/generators/steps/assembleSettlement.js` (57) both call
   `src/generators/power/economyReconciliation.js :: refreshPowerGenerationTraces` over
   `generatePower`'s run. **Both run BEFORE
   `src/generators/steps/assembleSettlement.js :: settlement.simulationTrace = ctx.simulationTrace`,
   so the record's `generatePower` run is the POST-refresh one** — which is precisely why a
   POST-HOC carry needs no gate inside `economyReconciliation.js`, a file two waiting members
   already hold.

**§0.5 — THE SOURCE CENSUS.** `git grep -o -F 'recordTrace(' -- src/generators | wc -l` prints
**50**; three of those are COMMENTS. With comments blanked by the walkers' own idiom the population
is **47 CALL SITES over 17 step files**, spelling **24 distinct `(step, targetType)` pairs** — every
one declared in this member's register, and every one of the 4,810 corpus entries resolving there
(`unmapped = 0`). Two sites spell a computed `step`:
`src/generators/steps/generateEconomy.js :: computeEconomyState` (called from BOTH `generateEconomy`
and `economyReconcilePass`, which is why the first emits 0 and the second 945) and
`src/generators/steps/subsumptionPass.js`.

---

## §1 · Reconciled authority

| authority | what it binds here |
|---|---|
| `docs/implementation/preambles/EM-PREAMBLE.md` | the family preamble, cited by MEASURED SHA-256 above; §P2, §P3.5, §P4, §P6, §P7, §P9, §P10, §P11 bind whole |
| `docs/DESIGN_EDIT_MODE_AND_DECREES.md` §22 ruling 8 | *"`simulationTrace` is a generation receipt, partitioned by step: a held step re-emits nothing and its recorded entries are carried; a deriving step's entries are re-derived."* Its MEASUREMENT OWED is answered in §0.1 |
| same, §22.1 correction 4 | the partition key is every step whose entries are ABOUT a held key, not the producers alone |
| same, §22.2 item 5 | *"The TRACE merges by STEP: ruling 8's partition carries the record's entries for steps ABOUT a held key; every other step's entry list is atomic."* This member puts the partition in the RE-DERIVATION, so the merge's landed atomic row is left exactly as EM-R0a wrote it |
| same, §22.2 item 11 | draw-SKIP is legal only under ruling 8's partition — §0.2 measures that the skip landed FIRST |
| same, §22.2 item 7 | the record's key classes are declared BY PATH; `simulationTrace` is a READING |
| `docs/implementation/charters/EDIT-MODE-TRAIN.md` | the EM-R5 row (*"the trace partitioned by every step ABOUT a held key | precedes any draw-skip"*) and the amendments of 2026-09-19 16:2x, 16:5x and 17:25 |
| `src/domain/edit/recordRegister.js` (EM-R0a, LANDED) | the HELD class, read from its producer and never re-typed |
| THE PROMISE | lived history is immutable: a carried entry is the record's own account of how the town was first made, and this member copies it rather than re-authoring it |

This member names no other additional source.

---

## §2 · Outcome

**One pure leaf and one call.** `src/domain/edit/tracePartition.js` declares the trace's SUBJECT
REGISTER — which record key each `(step, targetType)` pair's entries are about, total over the 47
`recordTrace` call sites and over the 4,810 corpus entries — and exports `partitionTrace(recorded,
derived, heldKeys)`: it groups both traces by step, emits each registered step's run in the runner's
own order, taking the RECORD's run for a step whose entries are about a HELD key and the
RE-DERIVATION's run for every other, carries any entry whose step the runner does not register in a
declared tail, and re-stamps `ts` to the output position. `src/domain/edit/dmLayer.js :: rederive`
calls it once, at its single return point, so BOTH `R0` and `R1` reach the merge already carrying
the record's runs (design §22 ruling 8's own words: `R0 = rederive(record)` and
`R1 = rederive(record + edit)`, so one call site is both by construction).

**With nothing held the function returns the derivation's own array BY IDENTITY**, so plain
generation, the 525-row golden master and the prose manifest cannot move: the goldens never call it
at all, and the arm that proves it is A5.

NON-GOALS, named: the runner's clone (EM-R1), the roster (EM-R2), the power replay (EM-R3), the
name mint (EM-R4), the three-way merge (EM-R0c), the institution cascade (EM-R6), the corpus ratchet
(EM-R7). This member changes no `src/generators` file and takes no draw away from any stream.

---

## §3 · Hard scope budget

| budget | cap | this member | how measured |
|---|---|---|---|
| handwritten files | 12 | **3** | §7's table |
| new/changed effective production lines | 400 | **102** | 93 (the leaf) + 9 (the MODIFY: `dmLayer.js` 195 → 204), eslint `Linter` / `max-lines`, `skipBlankLines` + `skipComments` |
| effective lines per new leaf | 250 | **93** | same instrument, over the planned text |
| new logic leaves | 2 | **1** | `src/domain/edit/tracePartition.js` |
| existing logic files modified | 3 | **1** | `src/domain/edit/dmLayer.js` |
| acceptance cases | 8 | **8** | §9's matrix, one `it` each |
| hot files | none | **none** | no `scripts/.size-baseline.json` row exists for any of the three paths, `dmLayer.js` included (measured at `c69d16a5d`) |

⛔ THE COUNT LAW (§P9(f)): the CREATE row for `tests/domain/tracePartition.test.js` says **adds
exactly 8 literal `it`s**; §9's matrix homes **8** cases there; §10 and §12 state the lighting delta
as **titles +8**. `EM-R5.count-prover.mjs` proves the four agree and exits non-zero on any
inequality.

---

## §4 · Sealed dispatch, preflight, and THE BLOCK

**§4a — the dry read of `scripts/implementation-session.mjs`'s checks, at the placement tip.**

| check | verdict |
|---|---|
| branch name is a token | `em-t16-em-r5-<date>` (or `em-t15-…` under Q4's alternative) |
| HEAD equals the verified base | the lane branch is cut FROM the train's promotion commit (§P10.1/§P10.2) |
| substrate unchanged since the verified base | the three paths are untouched between the promotion commit and the lane's HEAD |
| CREATE targets ABSENT | `src/domain/edit/tracePartition.js` and `tests/domain/tracePartition.test.js`: `git ls-files` prints nothing and neither exists on disk at `c69d16a5d`; named by NOBODY in the tree's 222-packet manifest or in the 42 waiting manifests, measured |
| MODIFY target PRESENT | `src/domain/edit/dmLayer.js` — PRESENT at `c69d16a5d` (490 lines), landed by EM-B2a1 on train EM-T10; **this member has no placement precondition left** |
| git-clean | the lane commits nothing (§P10.5) |
| `duplicate change path across packets` | none at the tip: of the three paths only `dmLayer.js` is named by another packet at all, and both holders (EM-B2a1, EM-B2a4) are LANDED. ⚠ EM-B2b, a waiting DRAFT, names it too and would reserve it the moment IT is placed (§5a) |

**§4b — VERSION 1's BLOCK IS DISSOLVED, AND WHAT REPLACED IT.** Version 1 blocked on EM-B2a4's
landing because its MODIFY row named the file EM-B2a4 CREATEs. EM-B2a4 has landed, the pre-proof
read the real code, and the row moved to `src/domain/edit/dmLayer.js` — a path that has existed
since train EM-T10 — so this member now has NO placement precondition. What remains is ONE ruling
for the chair (the pre-proof's Q1): ratify the moved home, or take the alternative in §6.3 item 4
(keep the seat and give it its own `pinsFrom` call). Nothing in this packet's behaviour changes
between them; the `checks` array and §7's one row do.

---

## §5 · Verified tree contract

| # | fact | proved by |
|---|---|---|
| V1 | A trace entry carries `step`, `ts`, `targetType`, `targetId`, `result`, `causes`, `downstreamEffects` and nothing else, 4,810/4,810 over the 63-row sample | `probes/m1-trace-census.mjs` |
| V2 | `ts` equals the entry's index, 4,810/4,810 | `probes/m4-shape-order.mjs` |
| V3 | Every step's entries form ONE contiguous run, 63/63 rows | same |
| V4 | 47 `recordTrace` call sites under `src/generators` over 17 files, spelling 24 `(step, targetType)` pairs; the grep count of 50 includes 3 comments | `probes/m2-sites.mjs` |
| V5 | `isolationPass` is the one MIXED step at the corpus (7 held / 7 reading); `coherenceRepairPass` is mixed by SOURCE with a dormant site | `probes/m4-shape-order.mjs`, `probes/m2-sites.mjs` |
| V6 | 621 runs, 0 interleaved subject classes | `probes/m5-mixed.mjs` |
| V7 | With the LANDED pin channel, `assembleInstitutions` draws 3,324 → 0 and entries 2,207 → 0 in 63/63 rows | `probes/m3-landed-skip.mjs` |
| V8 | `refreshPowerGenerationTraces` mutates `generatePower` entries at two call sites, both BEFORE the copy-through | `probes/m4-shape-order.mjs`, source |
| V9 | `src/domain/edit/**` is in NEITHER the generation worker's static source closure NOR the eager first-paint set, and so is `src/store/**`: the membership probe imports `vite.config.js :: EAGER_FIRST_PAINT_MODULES` and reads no `dist`, so it cannot skip (§P2.11). The two closure SIZES at `c69d16a5d` are 222 files and 270 modules — quoted as an as-of figure, never as a pin (§P3.5) | `probes/m6-closure.mjs` |
| V10 | `tests/lint/mutationCoverage.shared.mjs :: ENFORCER_DIRS` does not name `tests/domain` | source, read at the tip |
| V11 | No importer roster or dormancy arm pins `recordRegister.js`'s importers EXACT | `git grep -l -F 'recordRegister' -- tests`; `editMutationPath.walker.test.js :: WATCHED` |
| V12 | All ten `requiredSymbols` present VERBATIM, count 1 each, re-run at `c69d16a5d` — including the two on files train EM-T14 moved (`economyReconciliation.js`, -31 lines by EM-R0f; `generateSettlementPipeline.js`, 1 line) | `probes/reqsym.mjs` (`indexOf` over the file text), §11 of the evidence |
| V13 | `src/store/settlementRederiveAction.js` holds NO `rederive`: it imports it from `../domain/edit/dmLayer.js` and exports `regenerateWithLayer(seed, config, layer, declarations)`, whose body awaits `loadEngine()` and returns the leaf's envelope verbatim. `rederive`'s envelope is `{ record, unapplied }` and carries NO pin set, so the bag's key set is not in scope in the seat | the file read WHOLE at `c69d16a5d` (71 lines) |
| V14 | A read of a settlement field added under `src/domain/edit/**` moves NO writer-reach row: `scripts/lib/writer-reach-scan.mjs :: SURFACE_CLOSURE_STOP` halts every one of the six surface closures at `src/store/`, which is the only static way in, and `scripts/.writer-reach-baseline.json` names no edit-path module at all (`dmLayer` 0, `editSlice` 0, `recordRegister` 0) | `git grep`, the scan library and the baseline read at `c69d16a5d` |
| V15 | The six landed arms of `tests/property/dmLayerGoldenIsolation.test.js` that call `rederive` stay GREEN against this member's planned edit, EXECUTED in plain node over the real engine: A2 one result across six absence shapes and the record unmoved; A4 the closed refusal set and the casualties; A5 same-twice; A6 the persist hop; A7 a dormant layer IS the committed golden on a 25-row stride (0 misses, 0 records moved) and a one-root layer still moves that root and only it | `probes/p1-dmlayer-arms.mjs`, `probes/p3-arms456.mjs` |

**§5a — PATH DISJOINTNESS, MEASURED TWICE AT `c69d16a5d`** (42 waiting manifests, 209 change rows;
the tree's 222-packet `PACKET_MANIFEST.json`).
- **INSIDE train EM-T15.** EM-R1 names `src/generators/pipeline.js`,
  `src/generators/steps/assembleInstitutions.js`, `src/generators/steps/generatePower.js`, a
  `tests/lint` CREATE, a `tests/generators` TEST and the row-keyed mutation-coverage REGISTER;
  EM-R2 names `src/generators/narrativeGenerator.js`, `src/generators/steps/assembleSettlement.js`,
  `src/generators/steps/generatePopulation.js`, `src/domain/prose/holderTable.js`, a
  `tests/generators` CREATE and the same row-keyed REGISTER under its own `rowKey`. **The
  intersection with this member's three paths is EMPTY**, and this member reserves no register row
  at all.
- **AGAINST TRAINS EM-T13 / EM-T14, WHICH LAND FIRST** (both already composed at this read tip, so
  these are LANDED fences rather than predictions, judgment 134): EM-B2a4 created the store seat and
  modified `dmLayer.js`; EM-R0d moved `src/generators/{defenseGenerator,factionDynamics,foodGenerator}.js`
  and `src/domain/prose/holderTable.js`; EM-R0f moved `src/generators/power/economyReconciliation.js`;
  EM-R6 moved `src/domain/factionRename.js` and created two institution leaves. **None of them names
  this member's CREATE targets**, and the one MODIFY path they touch (`dmLayer.js`, by EM-B2a4) is
  read here as landed code.
- **AGAINST EM-T16's EM-R3**, which names `src/generators/power/economyReconciliation.js`,
  `src/generators/steps/powerEconomyReconcilePass.js`, `src/generators/steps/assembleSettlement.js`
  and one TEST: EMPTY intersection. What EM-R3 owes this member is a RE-MEASUREMENT, not a path —
  judgment 184d: with the partition landed, a step ABOUT a held key carries the record's run whole,
  so EM-R3's declared `simulationTrace` movement is re-measured at its own pre-proof.
- **THE ONE LIVE RESERVATION:** EM-B2b (waiting, unplaced) names `src/domain/edit/dmLayer.js`.
  Placement order decides it; nothing else of this member's is contended.

---

## §6 · Exact contracts

**§6.1 — `src/domain/edit/tracePartition.js` (CREATE, pure).** No branch on ambient state; no
import from `src/generators`, `src/store` or `src/lib`; exactly ONE import,
`./recordRegister.js`, so the HELD class is read from its producer (EM-R0a's law) and no new
domain→generators edge is created. Exports:

- `TRACE_STEP_ORDER` — a frozen array of the 22 registered step names in the runner's topological
  order. A domain module may not import the runner, so the order is DECLARED here and arm A4 holds
  it equal to `src/generators/pipeline.js :: getStepOrder`, which a test may import from both sides.
- `TRACE_SUBJECTS` — a frozen `Record<string, string>` keyed `` `${step}::${targetType}` `` whose
  value is the RECORD KEY that pair's entries are about. **24 rows, total in both directions**: every
  one of the 47 `recordTrace` call sites spells a declared pair, and every corpus entry resolves.
- `MIXED_TRACE_STEPS` — a frozen map naming the two steps that emit about BOTH a held key and a
  reading, with the reading subjects a whole-run carry freezes: `isolationPass →
  ['isolationSupport', 'stress']`, `coherenceRepairPass → ['isolationSupport']`.
- `traceSubjectKey(entry)` → the record key, or `null` when the pair is undeclared. No throw.
- `carriedTraceSteps(heldKeys)` → a `Set` of step names. **The caller's set is FILTERED THROUGH
  `RECORD_CLASSES` first**, so a key the runner's partial-pin rule forced into the bag without being
  classed HELD (`stress`, `isolationSupport`, `stressTypes`, `catalogForTier`, `generationRepairs`)
  can never freeze a reading's account. A step is carried when AT LEAST ONE of its declared subjects
  is a HELD record key. With the seven HELD keys the answer is exactly ten steps:
  `assembleInstitutions`, `cascadePass`, `coherenceRepairPass`, `corruptionPass`,
  `factionCorrelationPass`, `generatePopulation`, `generatePower`, `isolationPass`,
  `neighbourFactions`, `subsumptionPass`.
- `partitionTrace(recordedTrace, derivedTrace, heldKeys)` → `readonly TraceLike[]`. **Exactly:**
  1. a non-array `derivedTrace` reads as `[]`; a non-array `recordedTrace` reads as `[]`;
  2. **when `carriedTraceSteps(heldKeys)` is empty the DERIVED ARRAY IS RETURNED BY IDENTITY** —
     not a copy, not a new array — which is the golden law's whole proof;
  3. otherwise both traces are grouped by `step` (order-preserving, an absent or non-string `step`
     grouping under `''`);
  4. for each step of `TRACE_STEP_ORDER`, in that order: a CARRIED step contributes the RECORDED
     group, each entry DEEP-CLONED with `structuredClone` (design §22 ruling 6 — the caller's record
     is never aliased); every other step contributes the DERIVED group by reference; a step with no
     group contributes nothing;
  5. then the TAIL: every RECORDED group whose step `TRACE_STEP_ORDER` does not name, deep-cloned,
     in recorded order; then every DERIVED group whose step is named by neither `TRACE_STEP_ORDER`
     nor the record;
  6. finally every entry is shallow-copied with `ts` set to its INDEX in the output.
  Determinism: no draw, no clock read, no locale, no ambient randomness. Purity: the two input
  arrays and their entries are never mutated.
- Strict types: the file measures **0 errors** under `tsconfig.full.json` AND **0** under
  `tsconfig.domain-strict.json` (the compiler API, plain node). ⭐ The first cut measured **12**
  strict errors and was re-typed until both read zero.
- Voice: **0 em dashes and 0 exclamation points** in any of its 82 string literals; the file is
  baselined at zero and no baseline rises. The replacement idiom is spelled here and not left to a
  build lane: the register's keys use `'::'`, never a dash.
- Tuning: **no module-top-level `const UPPER_SNAKE = <number>;` and no fractional decimal literal**,
  so it enters `tests/lint/.tuning-inventory.json` at ZERO and no dial is landed (§P11.3).
- Entropy: **no `createPRNG(` site** and no `WORLD_ROOTS` read, so neither count pin moves.

**§6.2 — `src/domain/edit/dmLayer.js :: rederive` (MODIFY, +9 effective lines, MEASURED).** One
static sibling import, `./tracePartition.js`, and one insertion at `rederive`'s single return
point. The landed function is
`rederive(record, config, layer, engine, declarations)`; it computes `const { pins, unapplied } =
pinsFrom(record, layer, declarations, engine)`, runs the injected engine, and ends
`return { record: derived, unapplied };`. **The bag's key set is `Object.keys(pins)`, and it is in
scope at exactly that point and nowhere else in the estate.** The inserted text, exactly:

```js
  const heldKeys = Object.keys(pins);
  const out = /** @type {Record<string, unknown>} */ (isPlainObject(derived) ? derived : {});
  if (heldKeys.length > 0 && Array.isArray(out.simulationTrace)) {
    const kept = /** @type {Record<string, unknown>} */ (isPlainObject(record) ? record : {});
    out.simulationTrace = partitionTrace(
      Array.isArray(kept.simulationTrace) ? kept.simulationTrace : [], out.simulationTrace, heldKeys,
    );
  }
```

Exactly: the write lands on `derived`, the engine's own fresh output, so ⛔ **the caller's record is
still never touched** (the leaf's standing law, re-proved by execution: A2's and A7's record hashes
are unmoved). The key is ASSIGNED IN PLACE, never spread into a new object, so the record's key
ORDER is preserved and a serialized hash cannot move for that reason. With an empty bag the branch
is not taken at all, and with a bag of only non-HELD keys `partitionTrace` returns the derived array
BY IDENTITY, so a dormant layer's re-derivation is byte-identical to today's — which is what the
landed golden arm asserts on every corpus row. Because BOTH `R0` and `R1` come out of `rederive`
(design §22 ruling 8 spells them `R0 = rederive(record)` and `R1 = rederive(record + edit)`), one
call site covers both. ⛔ NO STORE FILE IS TOUCHED, so `tests/store/deadOperationRatchet.test.js`'s
literal-dispatch rule (§P2.20) is not engaged by this member at all; and the new edge is
`src/domain/edit → src/domain/edit`, which crosses no boundary, names no generators specifier
(`tests/property/dmLayerGoldenIsolation.test.js`'s A8 second arm re-run over the planned text: 0
hits in both files) and adds no eager byte (`dmLayer.js` is in neither closure, measured).

**§6.3 — WHAT THIS MEMBER DELIBERATELY DOES NOT DO, with the reason.**
- It does not touch `src/generators/pipeline.js`. An in-runner fence would collide with EM-R1 on a
  path that is not a row-keyed register, and it would buy nothing the post-hoc partition does not:
  the record's runs are already final and post-refresh (§0.4 item 3).
- It does not split a MIXED step at the ENTRY. The run is the substitution unit because contiguity
  is measured and interleaving is not guaranteed by source; the freeze is DECLARED in
  `MIXED_TRACE_STEPS` and its corpus cost is 7 entries in 63 rows. Q1 puts the alternative to the
  chair.
- It does not change `src/domain/edit/recordRegister.js :: ATOMIC_COLLECTIONS`. `simulationTrace`
  stays ATOMIC for the merge, which is correct once both re-derivations carry the record's runs.
- **IT DOES NOT PUT THE CALL IN THE STORE SEAT, and that is version 2's one changed decision.**
  `src/store/settlementRederiveAction.js :: regenerateWithLayer` has the record and the engine but
  NOT the bag: `rederive` computes `pins` internally and returns `{ record, unapplied }`. A call
  there would have to import `pinsFrom` as well and run the whole pin pass a SECOND time — a second
  deep clone of every pinned collection on every re-derivation, and two computations that must agree
  forever. The alternative is lawful and the chair may take it (the pre-proof's Q1); it costs one
  extra import, one duplicated pass, and it buys a governing set of two files instead of thirteen.

---

## §7 · Exact change manifest

| action | path | what changes | eff Δ | notes |
|---|---|---|---|---|
| `CREATE` | `src/domain/edit/tracePartition.js` | the subject register, the mixed-step declaration and `partitionTrace` / `carriedTraceSteps` / `traceSubjectKey` | **+93** | pure; one import, `./recordRegister.js`; 0 TS errors under both configurations; tuning 0/0; voice 0/0; 0 `createPRNG(`; not a `.institutions` reader |
| `CREATE` | `tests/domain/tracePartition.test.js` | the acceptance battery — **adds exactly 8 literal `it`s** under ONE literal `describe` | n/a | straight-line registration; `it`/`test`/`describe` bound exactly once; no `.each`, no loop, no conditional, no parameter named `it`; every negative carries `// anchored:` on the line immediately above the `expect` itself |
| `MODIFY` | `src/domain/edit/dmLayer.js` | one sibling import and one insertion at `rederive`'s single return point (§6.2) | **+9** | 195 → 204 effective lines; the landed home of `rederive` and of the pin bag, MEASURED at `c69d16a5d` (version 1 named the store seat, which holds neither); tuning 0/0 unmoved; voice 120 → 121 literals, 0 em and 0 bang; 0 `createPRNG(`; 0 `.institutions` code reads; 0 TypeScript errors under BOTH `tsconfig.full.json` and `tsconfig.domain-strict.json` with the insertion in place |

**DEFERRED ROWS (the chair's terminal acts, named here and executed nowhere in this packet):**
- `tests/lint/.lighting-census-baseline.json` — `files +1 · parked +0 · credited +1 · titles +8 ·
  suiteTitles +1`. The member never edits that file and its `checks` never name the lighting walker.
- `docs/content/wiring-census.json` — `stamp.producerIndexFiles **+1**`, naming
  `src/domain/edit/tracePartition.js` (the count reads 1,182 at `c69d16a5d`, quoted as an as-of
  figure); `stamp.files` UNMOVED — it is a 7-entry sha map and NEITHER `dmLayer.js` NOR any path of
  this member is in it, measured, so the MODIFY cannot red the census's `stale-bytes` arm;
  `stamp.candidateLeaves` UNMOVED (6 entries, all under `src/domain/display/stateProse/`);
  `totals.*` UNMOVED (no pool, variant or relation). The path appears in NEITHER this table NOR the
  capsule NOR the `checks`, and no lane runs `node scripts/wiring-census.mjs`.

**NOT OWED, each with its measurement:** `scripts/mutation-coverage-manifest.json` (the CREATE is
under `tests/domain`, absent from `ENFORCER_DIRS`); `src/domain/goods.schema.js`'s ST-2 roster (no
goods identity half-table import); `tests/lint/ruinFilterRoster.walker.test.js` (0 `.institutions`
code reads); `tests/lint/proseNumerics.test.js` (renders no figure); `EXPLAINED_WRITER_EXEMPTIONS`
and `scripts/check-writer-reach.mjs` — the member adds no domain reader of the save-time keys
`dmLayer` or `decrees`, and its ONE new read of a settlement field under `src/domain/edit/**`
(`record.simulationTrace`, inside `rederive`) lights nothing: `scripts/lib/writer-reach-scan.mjs ::
SURFACE_CLOSURE_STOP` halts all six surface closures at `src/store/`, the only static way into
`src/domain/edit/**`, and `scripts/.writer-reach-baseline.json` names no module of the edit path
(V14); `npm run build:edge-shared`
(none of the three paths is an input of any of the five bundle metas); `e2e/` (no route, test id,
accessible name, label, nav, header, footer or page chrome).

---

## §8 · Ordered coding sequence

1. **MEASURE BEFORE YOU SEAL** (§P10.3's six): branch, HEAD and verified base are the dispatch
   note's three; §7's path set and the capsule's `changeManifest` are SET-EQUAL; both CREATE targets
   ABSENT and the MODIFY target PRESENT; all ten required symbols found verbatim; the count law run
   through `EM-R5.count-prover.mjs` from the kit path; every line-addressed register grepped for
   `src/domain/edit/dmLayer.js` (the pre-proof's run at `c69d16a5d` found NO row that addresses it
   by line: no `proseNumerics` row, no `path:NNN` citation of it anywhere under `src/`,
   `tests/` or `docs/content/`, and the only `tests/lint` file that names it,
   `editMutationPath.walker.test.js`, keys on the symbol `applyEdit` and not on a line).
2. Write `src/domain/edit/tracePartition.js` whole. Run the TypeScript compiler API over it under
   BOTH configurations and require 0 errors before anything else.
3. Write `tests/domain/tracePartition.test.js` with its 8 `it`s, A1 first (the denominator arm).
4. RED-FIRST, in this order: A7 and A8 are genuinely red before the leaf exists (the module does not
   resolve). A1, A2, A3 and A4 are WRITTEN-CONTRACT arms — they hold at the base — and are proved by
   the counterforces of §9a, each quoted in the receipt beside its arm (§P6).
5. Add the MODIFY at `src/domain/edit/dmLayer.js :: rederive`'s single return point (§6.2's exact
   text), then re-run the TypeScript compiler API over `dmLayer.js` under BOTH configurations.
6. Run the focused battery, then the scoped eslint, then the two typecheck ratchets.
7. Stage exactly the three paths by explicit path. Never `git add -A`, `-u` or `.`. Write the commit
   message to scratch and STOP; the chair's one queue runs the gate script and commits.

---

## §9 · Acceptance matrix

Eight cases. Every one names the file that holds it and the §7 row that authorises that file.

| # | Case | Home | Authorised by |
|---|---|---|---|
| **A1** | THE ENTRY CARRIES ENOUGH TO BE PARTITIONED. Over the whole 63-row stride, every entry has a non-empty string `step`, `targetType` and `targetId`, and `traceSubjectKey` resolves it. The DENOMINATOR is asserted in the same arm, so an empty corpus can never pass it | `tests/domain/tracePartition.test.js` | §7's `CREATE` row |
| **A2** | EVERY STEP'S ENTRIES ARE ONE CONTIGUOUS RUN, 63/63 rows — the premise that makes a run the substitution unit. A step seen twice with another step between is the failure | same | §7's `CREATE` row |
| **A3** | THE CLOCK IS THE POSITION. `ts` equals the entry's index in every record of the stride, which is why the partition re-stamps rather than carries it | same | §7's `CREATE` row |
| **A4** | THE TWO REGISTERS ARE TOTAL AGAINST THEIR PRODUCERS, BOTH DIRECTIONS. `TRACE_STEP_ORDER` equals `getStepOrder()` IMPORTED from the runner; every `(step, targetType)` the corpus emits is a declared row; every declared subject is a key of `RECORD_CLASSES` IMPORTED from the register. No table is re-typed | same | §7's `CREATE` row |
| **A5** | INERT WITH NOTHING HELD — THE GOLDENS CANNOT MOVE. `partitionTrace(rec, der, new Set())` and `partitionTrace(rec, der, new Set(['economicState']))` return `der` BY IDENTITY (`toBe`), and `carriedTraceSteps(new Set()).size === 0`. WRITTEN-CONTRACT: proved by the counterforce of §9a.1, not red-first | same | §7's `CREATE` row |
| **A6** | THE CARRIED SET IS THE PARTITION, BOTH DIRECTIONS. A step is carried iff at least one of its declared subjects is a HELD record key — computed from the two IMPORTED registers, asserted equal to `carriedTraceSteps(HELD)` in both directions, size 10; `MIXED_TRACE_STEPS`'s two steps are SET-EQUAL to the steps with at least one held and at least one non-held subject. THE PAIRED NEGATIVE: a bag of `['stress','isolationSupport']` carries ZERO steps, so a key the partial-pin closure drags in can never freeze a reading | same | §7's `CREATE` row |
| **A7** | THE CARRY RESTORES AND NEVER ALIASES, AT EVERY DEPTH. For every row of the stride: a derivation (itself deep-cloned, as a real re-derivation's would be) stripped of every carried step's run is partitioned back to the record's trace BYTE-IDENTICALLY with `ts` re-stamped to the index; and NO output entry is the same object as a recorded entry AND no output entry's `causes` or `downstreamEffects` ARRAY is the record's. ⛔ THE NESTED HALF IS THE ARM: `partitionTrace` ends in a shallow spread, so a top-level identity check passes even with the clone deleted — mutant M5 proved exactly that at this compile | same | §7's `CREATE` row |
| **A8** | THE UNKNOWN STEP IS CARRIED IN THE DECLARED TAIL. An entry whose `step` the runner does not register is emitted LAST, its `ts` re-stamped, and it appears nowhere before the tail. ANCHORED NEGATIVE with its positive control: the tail assertion above it is what makes the absence meaningful | same | §7's `CREATE` row |

### §9a · ⭐ THE NEGATIVE CONTROLS THIS BATTERY MUST CARRY

1. **A5's counterforce is mandatory.** "Returns the derived array" is true of a function that does
   nothing, so the arm is proved by running the SAME assertion with a HELD bag, where identity must
   fail and a new array must come back.
2. **A1's denominator is mandatory.** A corpus that generated nothing would pass a bare
   "no malformed entry" assertion; the entry count is asserted greater than zero in the same arm.
3. **A6's reading-only bag is mandatory.** Without it, "the filter through `RECORD_CLASSES` works"
   is unfalsifiable.
4. **A7's alias arm is mandatory, and it must reach the NESTED arrays**, over every row. MEASURED
   AT THIS COMPILE: with the `structuredClone` deleted, a top-level identity check stayed GREEN on
   all 63 rows — `partitionTrace`'s closing `{ ...entry, ts: index }` makes a new top object for
   every entry either way. The arm therefore collects the record's `causes` and `downstreamEffects`
   ARRAY references and asserts no output entry carries one. The derived trace the arm feeds in is
   itself deep-cloned first, exactly as a real re-derivation's would be, so the only alias the arm
   can see is the one this member could actually create.
5. **Every anchor sits on the line IMMEDIATELY above the `expect` itself**, never above a wrapped
   `expect`'s first line (EM-B1c1 version 5's build red).
6. **No seed loop.** Every arm collects into an array and asserts ONCE
   (`tests/lint/seedLoopTotality.walker.test.js`).

---

## §10 · Verification commands

Run through the shared gate mutex, one holder at a time; a lane runs no gated line itself under a
parallel train — it writes ONE gate script and the chair's one queue runs it (§P10.5). Every vitest
line goes through `sh scripts/gate-mutex.sh --run -- …` with `GATE_MUTEX_TIER=shared
GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20`, each exit captured in-shell and never piped
(§P7).

1. `npx vitest run --pool=threads --maxWorkers=2 tests/domain/tracePartition.test.js` — the battery.
2. The governing set, RE-DERIVED at `c69d16a5d` and grouped one directory per array (the capsule's
   `checks`): `tests/domain` (the battery beside `dmLayer`, `trace`, `trace.coverage`,
   `tracePresentation`), `tests/lint` (the 32 walkers that govern `tests/domain` or name
   `dmLayer`, MINUS the lighting walker and MINUS `proseWiringCensus`), `tests/lib`
   (`importScrub`, `accountData`, `editTravel`), `tests/store` (`editSlice`,
   `decreeRegistryPersistence`), `tests/ops` (`migrationRehearsal`), `tests/security`
   (`galleryScannerMirrorTotality`) and `tests/property` — where
   `tests/property/dmLayerGoldenIsolation.test.js` is the LANDED arm over `rederive` itself and is
   this member's first-importer obligation (judgment 148): the pre-proof EXECUTED all six of its
   `rederive` arms against the planned edit in plain node and every one is green (V15), so the arm
   is a CHECK and not a TEST row — no assertion of it is widened, weakened or moved.
   ⛔ `tests/build/vendorPdfLazy.test.js` names `dmLayer.js` too and is NOT in the array: it is a
   dist-reading byte arm and belongs to the train's byte-arm holder alone (§P2.11, §P10.8).
3. `npx vitest run --pool=threads --maxWorkers=2 tests/property/generatorGoldenMaster.test.js
   tests/property/dossierProseManifest.test.js` — the goldens, UNCHANGED.
4. `npx eslint src/domain/edit/tracePartition.js src/domain/edit/dmLayer.js
   tests/domain/tracePartition.test.js`.
5. `npm run typecheck:ratchet` (over `tsconfig.full.json`) and `npm run typecheck:domain:strict`
   (over `tsconfig.domain-strict.json`), both by name, both at their exact floors.
6. `node scripts/implementation-packets.mjs validate`.

**THE BUILD LANE'S OWN INSTRUMENTS, NEVER SEALED CHECKS (§P7):**
- `npx vitest run --pool=threads --maxWorkers=2 tests/lint
  --exclude=tests/lint/sovereigntyLightingContract.walker.test.js` MUST EXIT 0, with the exclusion
  proved by vitest's own collection listing.
- `npx vitest run --pool=threads --maxWorkers=2 tests/lint/sovereigntyLightingContract.walker.test.js`
  run ALONE, expected NONZERO, the `expected … to be …` line naming `files` (the walker asserts in
  the register's own order and stops at the first moved figure).
- `npx vitest run --pool=threads --maxWorkers=2 tests/lint/proseWiringCensus.walker.test.js` run
  ALONE, expected NONZERO on exactly two arms, until the TERMINAL's one regeneration.
- `node <kit>/EM-R5.count-prover.mjs <packet.md> <capsule.json>` BEFORE the seal, from the kit path.
  It is kit furniture: never in the tree, never a `checks` entry, never a §7 row.

---

## §11 · Mandatory STOP conditions

In addition to `PACKET_STANDARD.md`'s list and the preamble's §P8, this member STOPS when:

1. a golden or the prose manifest moves by so much as a byte;
2. `partitionTrace` is reached from plain generation — it must be unreachable from any path the
   goldens run;
3. `src/domain/edit/dmLayer.js :: rederive` no longer computes its bag with `pinsFrom` or no longer
   has ONE return point at the verified base — the insertion of §6.2 has then lost its seat, and a
   re-addressed insertion is a version, never a lane's improvisation;
4. any instrument of §P2.21 reds with a figure this packet did not predict; the arm's own message
   decides and a figure adopted by hand is the failure;
5. a number this member lands under `src/domain` would be a simulation dial (§P11.3 — tuning is the
   owner's); the leaf lands none, and the acceptance arm is the tuning inventory reading ZERO;
6. the generation worker's `WORKER_BUNDLE_CEILING_BYTES` or the eager `CLOSURE_BUDGET_BYTES` would
   move beyond the train's byte-arm holder's stated bound (§P11.2 — the owner's);
7. a spec, a walker or a ratchet would be weakened, widened or skipped to make this member pass;
8. the entry shape measured in §0.1 no longer holds at the placement tip — the partition's whole
   premise — or a `(step, targetType)` pair appears that the register does not declare.

---

## §12 · Completion receipt

The build lane's receipt QUOTES, in this order:

1. the six pre-seal measurements of §P10.3, each PASS or the smallest measured contradiction;
2. `EM-R5.count-prover.mjs`'s output line per file and its exit 0, run from the kit path;
3. the focused battery's count line and exit (a log with no printed count DID NOT RUN, §P7);
4. each written-contract arm's COUNTERFORCE, measured, quoted beside its arm (§P6);
5. the excluded `tests/lint` directory run at exit 0, with the exclusion proved by vitest's own
   collection;
6. the lighting walker run ALONE, its `expected … to be …` line quoted, the delta it forecasts being
   `files +1 · parked +0 · credited +1 · titles +8 · suiteTitles +1`;
7. `tests/lint/proseWiringCensus.walker.test.js` run ALONE, NONZERO on exactly two arms, with
   `stamp.producerIndexFiles +1` named as the terminal's regeneration;
8. both TypeScript ratchets by name at their exact floors, and the scoped eslint;
9. the goldens and the prose manifest UNCHANGED, quoted;
10. the byte statement: worker `+0 B`, eager `+0 B / +0 modules` — the MEMBERSHIP proof re-run by
    importing `vite.config.js :: EAGER_FIRST_PAINT_MODULES` and the worker's own static closure, so
    it cannot skip (§P2.11); neither `src/domain/edit/**` nor `src/store/**` is in either set at
    `c69d16a5d` (222 files / 270 modules, as-of figures). The lazy chunk's predicted `≤ +400 B` is
    handed to the train's byte-arm holder, whose bound covers the train's SUM;
10b. `tests/property/dmLayerGoldenIsolation.test.js` GREEN at the member's own commit, with its own
    count line quoted: it is the landed arm over the function this member modifies, and its A7
    asserts on every corpus row that a dormant layer's re-derivation IS the committed golden;
11. the mutants of §P6, each reddening its OWN acceptance title, each restored to its exact
    pre-mutant SHA-256, then green. **The six the compile already planted and convicted against the
    planned text** (pre-mutant `sha256 eac205e2573b24091dca69eee1638c58b9c3c2a31aa9d6a494eacdb3166682f0`,
    restored EXACT after every plant), which the build lane re-plants in the tree:

| mutant | the arm it must red |
|---|---|
| drop `'subsumptionPass::institution'` from `TRACE_SUBJECTS` | **A1** (and A6) |
| drop `'subsumptionPass'` from `TRACE_STEP_ORDER` | **A4** (and A7) |
| delete `partitionTrace`'s inert early return | **A5** |
| drop `carriedTraceSteps`'s filter through `RECORD_CLASSES` | **A6** (and A5) |
| carry by reference, `structuredClone` deleted | **A7**, and ONLY through its nested half |
| delete the `ts` re-stamp | **A8** |
