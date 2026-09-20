# EM-P2 version 3 — COMPILE REPORT (Opus COMPILE lane, session 7d3418f8, 2026-09-19 16:11 EDT)

## Status: **DRAFT** — the packet compiles. Nothing is BLOCKED.

`SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`

**Files produced** (all under `$SP/lane-em-p2-v3-scratch/`):

| file | lines |
|---|---:|
| `EM-P2.md` (version 3, DRAFT, twelve sections; header base `__BASE__`, preamble left as the chair's stamp) | 453 |
| `EM-P2.manifest.json` (JSON validated) | 104 |
| `EM-P2.evidence.md` (E-0 … E-18, every command with its output) | 462 |
| `EM-P2.compile.report.md` (this file) | — |
| `proto/` — the executed prototype: `vimock-loader.mjs`, `register.mjs`, `shim-prng.mjs`, `shim-proseHash.mjs`, `harness.mjs`, `p1-controls.mjs`, `p2-sample.mjs`, `p3-tier2.mjs`, `p4-resolver.mjs`, `p5-emit.mjs`, `generationForkRegistry.SPEC.js` | — |

**Nothing was edited, staged or committed anywhere.** `git -C $SP/read-tip-a41a0e109 status --porcelain` empty; HEAD `a41a0e109bdee8fe3a0df082bf35b36d2399301e`. No vitest, no eslint, no npm script, no build, no gate; one `node` process at a time.

---

## 1. The budget table — MEASURED, not estimated

| Budget | Limit | This packet | How |
|---|---:|---:|---|
| handwritten files | ≤ 12 | **4** + 1 manifest row | 1 src leaf, 2 test files, 1 test helper |
| new production effective lines | ≤ 400 | **106** | emitted and counted under eslint `max-lines` semantics |
| effective lines per leaf | ≤ 250 | **106** — ONE LEAF | the pre-approved two-leaf split is **measured and NOT TAKEN** |
| new logic leaves | ≤ 2 | **1** | |
| existing logic files modified | ≤ 3 | **0** | |
| acceptance cases | ≤ 8 | **8** | A1, A2, A3s, A3, A4, A5, A6, A7, A8 — A3s is the static half of A3 and A8 spans both files; nine `it`s, eight cases |
| hot files | 0 | **0** | |

Packet total: 117 raw / **106 effective** lines in the leaf; longest line 322 chars and `eslint.config.js` declares **no `max-len` rule** (CONFIRMED). Collision group: **NONE** — `src/domain/generation/` does not exist at the base and no other EM member names any path this packet touches.

---

## 2. ⭐ THE IN-VITEST INSTRUMENT — chosen, and proven

**Three channels, three mechanisms, zero edits to `src/kernel/**` or `src/generators/**`.**

**(a) Tier 1 needs NO MOCK.** `runPipeline` takes the root PRNG as an argument and `pipeline.js:229` hands the object the root's `fork` returned to `setActiveRng`, so a test-side recursive counting proxy sees the ambient channel, `pickRandom2` and every `.fork(` receiver **by construction**. Precedent: `tests/generators/pipelinePinnedMode.test.js`'s `countingStream` / `instrumentedRoot`.

**(b) The MINT census is `vi.mock('../../src/kernel/prng.js', importOriginal)` — AND IT MUST RE-IMPLEMENT `fork`.** This is the hard part the brief named, and the answer is exact rather than approximate.

> `src/kernel/prng.js:84` is ``fork: (label) => createPRNG(`${seed}::${label}`),`` — an **intra-module** call, and the only one in the file. `vi.mock` replaces a module's exports for its importers and leaves intra-module bindings alone. The estate already has the lesson written down, at `tests/property/advanceEpochDormancyFence.test.js:77-82`: *"wrapping a function in its OWN module's namespace counts ZERO when the caller invokes it intra-module."* The cure: the wrapper re-implements `fork(label)` as `mint(\`${seed}::${label}\`, 'fork')` — **the same derivation, therefore the same stream byte for byte** — and counts it. The equivalence is pinned by A5's source assertion on that line (the pin `pipelinePinnedMode.test.js` A7 already carries).

**(c) The HASH census is `vi.mock` over `src/kernel/proseHash.js`, with no re-implementation.** `pickVariant` has no intra-module caller (so its wrapper is total) and calls `fnv1a32` intra-module (so the `fnv1a32` wrapper counts only EXTERNAL hash sites). **The two censuses are disjoint by construction** — a property, not a convenience, and A6 asserts it.

**How it was proven without vitest.** `proto/vimock-loader.mjs` is a Node ESM `resolve` hook that reproduces `vi.mock`'s export-replacement semantics exactly: importers are redirected to a shim, the shim reaches the original through a `?__actual=1` query (the stand-in for `importOriginal()`), and the tree on disk is never written. `EMP2_REIMPL_FORK=0` turns the fork re-implementation off: the negative control.

### The controls, quoted

```
=== C0 — export parity ===   prng.js EQUAL=true ; proseHash.js EQUAL=true
=== C1 — THE GOLDEN CONTROL ===
row      = town|germanic|plains|road|civilized|golden-master-v3
manifest = b77b5909009112855bad4dacf881847d06e43385f64a15f4b528e0d30c91c3ce
measured = b77b5909009112855bad4dacf881847d06e43385f64a15f4b528e0d30c91c3ce
EQUAL    = true
stride-21 sweep: checked=25 moved=0 (none)
=== C2 — THE PIN CONTROL ===
unpinned generatePopulation: draws=315 random=315 other=0 innerForks=0   > 67? true
fully pinned generatePopulation: draws=0   === 0? true
pinned run reproduces the record? true
=== C3 — THE MINT CENSUS ===
total mints = 35  (direct=4, via fork=31)
   "golden-master-v3::generatePower::power-structure" x4  vias=[fork|direct|direct|direct]
mints whose seed does NOT start with the run's root seed = 0
=== C4 — THE HASH CENSUS ===
pickVariant calls = 96; real choices (pool>1 AND non-falsy seed) = 96; distinct seeds = 96
fnv1a32 EXTERNAL call sites executed = 6
=== C5 — CROSS-CHECK ===
census mints via fork = 31  (expected = 22 step forks + 9 sub-forks = 31)
```

### ⛔ The negative control — the number that makes the design load-bearing

```
$ EMP2_REIMPL_FORK=0 …
total mints = 4  (direct=4, via fork=0)
   "golden-master-v3::generatePower::power-structure" x3  vias=[direct|direct|direct]
```

**4 against 35 — a naive `vi.mock` wrapper is blind to 31 of 35 mints (89%)**, and reads the power-structure seed as minted three times rather than four, losing the fork that puts the seed STRING on `powerIntent` in the first place. C0, C1, C2 and C4 stay **green** under it: nothing but this control would have caught it.

### What the build lane must see, and what makes it STOP

Run **A1 first and alone**, before a line of literal is typed. Required: golden `b77b5909…` with a ≥ 25-row sweep at 0 moved; `generatePopulation` **315 / 0** with the pinned run reproducing; export parity; **4 DIRECT mints and ≥ 31 via fork**; `viaFork === 22 + sub-forks`; `pickVariant` 96 on the probe row; `fnv1a32` external 6. **STOP if:** a golden moves (STOP-3); `prng.js:84` is not the expected line (STOP-4); the mint split is not 4/≥31 — report the number, never assert the smaller one (STOP-6); or the instrument cannot install without a `src/` or shared-config edit (STOP-5, chair question Q-2).

---

## 3. Row counts, and where my re-run stands against the recon

**Tier 1 — 75 rows. Tier 2 — 10 rows.**

**I re-executed the whole classification over the 63-row sample (1,449 pipeline runs, 25,426 ms) and diffed all 75 rows against the recon's published full-525 literal: ZERO DISAGREEMENTS.** The rare rows land dead-on — `tradeRoute` 5/63 vs 5/525, `terrainType` 3/63 vs 3/525, `resolvedTerrain` 3/63 vs 3/525, `effectiveConfig` 7/63 vs 7/525, `factionCorrelationPass` drew in 1/63 vs 1/525 — because the sample carries the whole 21-row tail. 13 of 22 steps draw, in both.

**Two places where a figure is refined rather than contradicted — both for the chair:**

1. ⚠ **The classification is 28 `drawn` · 1 `label` · 46 `pure`, not 29 drawn / 46 pure.** §21.5.1's headline counts the rows that MOVE; §21.5.2's own rule then reclassifies one of them (`generatePower|powerIntent`: `stepDraws 0/63`, `keyMoves 63/63`) as `label`. The packet compiles 28/1/46. **Q-1.**
2. ⚠ **The off-corpus ratios are a property of the seed SET, not of the tree.** My 24 seeds moved `townPlus` 13/24 where the recon's moved it 11/24, and `priorityMagicEffective` 23/24 where the recon's moved it 24/24. Same verdict, different ratio. The packet's A7 therefore asserts `> 0` and records the observed count — **a ratio assertion would be a flake with a number on it.**

**Three row-level facts the packet pins that a global constant would have got wrong** (measured across 9 rows spanning all six tiers): `direct` mints = **4 on 9 of 9**; `fnv1a32` external = **6 on 9 of 9**; but total mints is **35 or 36** and `pickVariant` runs **20 to 125**. §21.5.7's "96 choices per settlement" is a TOWN-row figure. A5 pins the DIRECT count; A6 pins the declared probe row.

**`onRecord` re-executed** over village/town/city with the recon's ladder: 51 distinct keys → `absent` 20, `same` 19, `transformed` 12 (over the 75 rows: 21 / 37 / 17). The recon's headline sets are strict subsets of mine in both directions — its 5 ABSENT and its 4 VALUE-DIFFERS are all present — the extras being its "not carried" and "name elsewhere, value differs" rows folded into §21.5.4's coarser three-state vocabulary. **One key, `generationRepairs`, is tier-dependent** (`same` at village and city, `absent` at town): the register records the declared town probe row and names the tier-dependence as a blind half. **Q-5.**

**Tier 2, re-measured over 42 rows × 22 perturbations — §21.5.3 CONFIRMED independently:** `institutions[].name`/`category` and `npcs[].name`/`role`/`status` are `drawn` under their holding steps; `factions[].faction`, `.category`, `.power`, `governingName` and `factions[].isGoverning` move under **no** perturbation of `generatePower` in 42 of 42 rows ⇒ **five rows `computed`, and all ten editable** (editability is not conditioned on entropy). `powerStructure.seats[].holder` resolves **0/42** (the STOP's S4, re-confirmed) and is carried as an anchored negative; `institutions[].state` resolves 0/42 and takes EM-A1's `createdBy` branch instead of a row.

**The resolver.** The offset direction died with the static scan; the arm Tier 2 needs is EM-A1's I-3 in the other direction — *is this declared writer declared exactly once in its file?* A `registerStep`-aware form set finds **22/22** step names exactly once; the model's finds **0/22**. `pickFirst` (module-local, never exported) = 1 and `generatePowerStructure` = 1. Guard-the-guard executed: two nonexistent symbols at 0, and a name appearing only in a `//` comment, only in a `'…'` string, or only inside a template literal is not counted while a real `registerStep('actuallyHere', …)` and a real `export function alsoHere()` both are. ⚠ The one subtlety a build lane must not lose: **`codeOnly` blanks string contents, so a step's name is read back from the RAW source at the preserved offset.** The model is read, never edited.

---

## 4. Predicted register moves, as DELTAS

| register | base | predicted | confidence |
|---|---:|---:|---|
| lighting `files` | 2,646 | **2,648** (+2) | **CONFIRMED** — `TEST_FILES` filters `/\.test\.(js\|jsx)$/`; the live count equals the frozen figure, so the delta is arithmetic. The `tests/helpers/` helper is a plain `.js` and does not enter the denominator. |
| lighting `suiteTitles` | 6,671 | **6,673** (+2) | **CONFIRMED** by construction — 2 `describe`s, literal titles |
| lighting `titles` | 25,005 | **25,016** (+11) | **CONFIRMED** by construction — 2 `describe` + 9 `it`, all literal; no `.each`, no looped or conditional registration, no nested describes (§P3.4) |
| lighting `credited` | 2,263 | 2,265 (+2) | **PLAUSIBLE** — the walker's per-file crediting rules were read only in outline |
| lighting `parked` | 383 | 383 (+0) | **PLAUSIBLE**, same reason |
| mutation coverage | — | **+1 row** | **CONFIRMED** — §P2.2 is mandatory for a new `tests/lint/` file; appended surgically, `kind: 'rationale'` following `chooserTotality.walker.test.js`'s own row |
| observed-shape register | — | **no move** | **CONFIRMED** — no domain reader of `dmLayer`/`decrees`; §P2.3's door is not opened |
| writer-reach / OSR readers | — | **no move** | **CONFIRMED** — no new reader of settlement fields under `src/domain/edit/**` |
| `scripts/.size-baseline.json` | — | **no entry** | **CONFIRMED** — 106 effective against a domain ceiling of 800 |

The lighting red is named as an INTERIOR RED and run so its figure is RECORDED; the census is re-derived whole at the terminal **by the chair** (§P2.1). The packet schedules no refreeze and lists no baseline as a generated artifact.

---

## 5. The bundle measurement (preamble rows 10–11)

**Zero bytes, and the claim is executable rather than argued.** `ls src/domain/generation` fails; `git grep -n "generationForkRegistry" -- src tests scripts supabase` prints nothing (exit 1); the only importers the packet creates are two `tests/` files and one `tests/` helper. With no production importer the leaf enters **no** closure: not the generation worker (`WORKER_BUNDLE_CEILING_BYTES = 1401128`, zero slack), not the lazy engine, not `EAGER_FIRST_PAINT_MODULES`, and not any edge-shared meta. The five metas carry explicit `inputs` path lists (114 / 74 / 115 / 2 / 2 files) and **none lists a `src/domain/generation` path**, which §P2.10's INPUT-MEMBERSHIP test is exactly about. **`npm run build:edge-shared` is not owed; no bundle-ceiling TEST row is carried; the build lane owes no `npm run build` attribution.** The packet modifies zero existing `src/` files, so §P2.11's per-path measurement has an empty subject set. STOP-5 fires if a production import ever looks necessary.

---

## 6. Cost

**25,426 ms** for the 63-row × 23-run classification with the instrument installed (403.6 ms/row; 1,449 pipeline runs), against the recon's **23,287 ms** for the same sample under the loader hook — the `vi.mock` wrapper costs **+9%**. A3's explicit budget is a **180,000 ms** timeout, the figure and idiom `pipelinePinnedMode.test.js` already uses; every other case is **120,000 ms**. A7 is 192 runs ≈ 4 s.

---

## 7. Questions only the chair can answer (listed; the lane did not wait)

- **Q-1** — §21.5.1 says *"29 rows are drawn, 46 pure"*; under §21.5.2's own rule it is **28 drawn · 1 label · 46 pure**. The packet compiles 28/1/46. Confirm, or restate §21.5.1.
- **Q-2** — if vitest's module mocking cannot reach `prng.js` through the generator import graph, the fallback is a shared-config change (a `setupFiles` entry or an inline Vite plugin in `vite.config.js`). Outside a wave-1 member's scope; it is a chair act. **The seven existing `vi.mock('.../kernel/prng.js')` files make this unlikely, but a precedent is not a receipt** — hence STOP-5.
- **Q-3** — `recordPath` is an ADDITION to §21.5.4's ruled `onRecord` triple. Added because ARCH-REDERIVE's question (a) — *which value a pin holds for a key the record carries transformed* — is unanswerable without the path, and the recon's own literal carries it. **Vetoable: delete the field and the arm with it.**
- **Q-4** — `producer` is a REVIEWED declaration the census can refute but not derive. Declared non-null for **2 of 10** rows (`npcGenerator.js#pickFirst`, `power/rulingStructure.js#generatePowerStructure`) and `null` for 8. Confirm a mostly-null column, or strike the field and let EM-A1 carry the writer.
- **Q-5** — `generationRepairs`'s `onRecord` is tier-dependent. The register records the declared town probe row and names it as a blind half. Confirm, or ask for a per-tier column.

---

## 8. What was NOT measured, and what would settle it

1. **The instrument inside real vitest.** CONFIRMED by an exact semantic simulation; **PLAUSIBLE** that vitest's own module runner behaves identically. Settled by the build lane running A1 first and alone.
2. **`credited` / `parked` deltas.** PLAUSIBLE. Settled by the recorded lighting red.
3. **Whether `pickVariant` is the whole hash channel.** The packet censuses 6 external `fnv1a32` sites per run; `pairProse`'s FNV pick (`generateSettlementPipeline.js:216`) was not separately attributed. Declared as a blind half.
4. **Leaf `producer` attribution for 8 of 10 Tier-2 rows.** Declared `null` rather than guessed.
5. **Whether a key `pure` over both corpora is pure under EVERY reachable config.** Declared as the corpus-ceiling blind half.
6. **The town-map glyph stream** (`glyphAssign.js:125`, name-keyed, 0 executions during generation). Named as EM-P1b's class; nothing asserted.

---

# DELTA — the chair's five rulings applied (2026-09-19 16:2x EDT)

Status unchanged: **DRAFT**. One execution (`proto/p6-onrecord-counts.mjs`, 31,101 ms) re-measured the whole classification at the ruled shape; the packet, manifest and evidence were re-cut from it.

## Sites changed, per ruling

| ruling | what changed | where |
|---|---|---|
| **Q-1** 28 · 1 · 46 | the "recorded, not adjudicated" contradiction row became a chair ruling; the count is stated in the budget, the derivation rules, A3s and the receipt. **Re-executed independently: the class tally came back 28 drawn / 1 label / 46 pure and 13 drawing steps a second time.** | `EM-P2.md` §1, §6.2, A3s, §12 |
| **Q-2** STOP, never a config edit | new **§6.3a** makes the instrument's own control the census's FIRST arm with the executable bound (`total mints` 35–36, `via fork` ≥ 31, golden unchanged, population 315 / 0) and names **4 as the signature of a mock that never reached the generator graph**; **STOP-5 rewritten** to forbid `vite.config.js`, `setupFiles` and any shared vitest config outright; A1 re-worded; §8 step 3 re-worded | `EM-P2.md` §6.3a, A1, STOP-5, §8; manifest `acceptanceCases[0]` |
| **Q-3** `recordPath` stays | contracted exactly: `record.<key>` for an own property, the found dotted path for a nested or renamed landing (e.g. `record.config.stressTypes`, `record.generationCoherenceReceipt.repairs`), `null` iff `absent`, **never `''`**; A3s asserts the biconditional | `EM-P2.md` §6.1, §6.2, A3s |
| **Q-4** strike `producer` | column removed from the typedef, the Tier-2 table, arm D, the manifest and the emitted leaf; **STOP-9 now names a `producer` field as a STOP** | `EM-P2.md` §6.1, §6.5, §6.6, A8, STOP-9; manifest `tier2Shape` |
| **Q-5** counts, not a probe row | `onRecord` is now `{ absent, same, transformed }` + a derived `onRecordClass` ∈ `absent\|same\|transformed\|varies`; the probe-row block and its blind half are **deleted**; new **§6.2a** tabulates the `varies` rows; A4 re-written to run over all 63 rows; **new STOP-11** for the non-unanimous-path tripwire | `EM-P2.md` §6.1, §6.2, §6.2a, A4, STOP-11 |
| **EM-P3** | new header block: EM-P3 is in the slot, moves `resolveConfig.js`, adds two option-list modules; **18 of 75 Tier-1 rows are `resolveConfig` rows**; the pre-proof at promotion re-runs the full 75-row classification at the then-tip; expectation zero, receipt required | `EM-P2.md` header, §12; manifest `basePressure` |

**Does any `requiredSymbols` row name `resolveConfig.js`? NO — CONFIRMED.** The manifest's step-file rows are `assembleInstitutions.js`, `generatePopulation.js` and `generatePower.js` only. EM-P3's move cannot break a required symbol of mine; the entire exposure is the Tier-1 **data**, and three of the 18 rows turn on a handful of corpus rows (`tradeRoute` 5/63, `terrainType` 3/63, `resolvedTerrain` 3/63), which is exactly where a moved `resolveConfig` would show first.

## The `varies` rows — six of 75, with counts

| row | absent | same | transformed | recordPath |
|---|---:|---:|---:|---|
| `resolveResources\|nearbyResourcesDepleted` | 0 | 23 | 40 | `record.config.nearbyResourcesDepleted` |
| `resolveResources\|nearbyResourcesNativeDepleted` | 0 | 23 | 40 | `record.config.nearbyResourcesNativeDepleted` ⚠ non-unanimous |
| `resolveStress\|stressTypes` | 0 | 51 | 12 | `record.config.stressTypes` |
| `stressConfirmPass\|stressTypes` | 0 | 51 | 12 | `record.config.stressTypes` |
| `assembleInstitutions\|generationRepairs` | 43 | 20 | 0 | `record.generationCoherenceReceipt.repairs` |
| `coherenceRepairPass\|generationRepairs` | 43 | 20 | 0 | `record.generationCoherenceReceipt.repairs` |

Full tally: **`absent` 19 · `same` 35 · `transformed` 15 · `varies` 6.** Six rows over **four distinct keys** (the duplicates are the two multi-producer keys and the two resource siblings). ⭐ **The ruling paid for itself on `generationRepairs`:** it is not tier-dependent as the three-tier probe suggested — it is a **43/20 split over the corpus**, which a town column would have called a flat `absent` and a village column a flat `same`. Same for `stressTypes` (51/12).

**One row's landing path is non-unanimous** (`nearbyResourcesNativeDepleted`: its own path ×40, its sibling's ×23, because in 23 rows the two arrays are identical). It is already `varies`, and **STOP-11 makes that a tripwire rather than a coincidence** — a row that landed in two places while reading unanimously `same` would be a register asserting a single truth it does not have.

## Final budget

| Budget | Limit | Now | Δ |
|---|---:|---:|---|
| handwritten files | ≤ 12 | 4 + 1 manifest row | — |
| new production effective lines | ≤ 400 | **106** | unchanged |
| effective lines per leaf | ≤ 250 | **106** — **the two-leaf split stays untaken** | unchanged |
| new logic leaves | ≤ 2 | 1 | — |
| existing logic files modified | ≤ 3 | 0 | — |
| acceptance cases | ≤ 8 | 8 | — |

The `onRecord` counts lengthen a Tier-1 row and striking `producer` shortens a Tier-2 row; neither adds a LINE (longest line 287 chars, no `max-len` rule), so the leaf is **106 effective lines, unchanged**. Census cost rose to **31,101 ms** for 63 rows (from 25,426) because the per-row record index is now built on every baseline run; A3/A4's 180,000 ms timeout still holds with ~5.8× headroom.

## What gives me pause

1. ⭐⭐ **Q-6, the comparand — the one thing I would most like ruled.** `onRecord` compares the key's **final-context** value to the record. The **post-step** value — what *this step* produced — costs nothing extra and I measured it beside: **18 of 75 rows would carry a different label.** Seven `effectiveConfig` rows read `same` finally and **`absent`** post-step; eleven `institutions`/`stress`/`economicState` rows read `same` finally and **`varies`** post-step. That gap is not noise — it is ARCH-REDERIVE's question (a), *which value a pin holds*, showing up as data. The register as shipped says "the key's value is on the record"; it does not say "the value this step produced is on the record", and for those eighteen rows those are different claims. I did not switch it, because the chair accepted the recon's ladder and the comparand was not in the ruling. **The 18-row delta is in `EM-P2.evidence.md` §E-21.**
2. **Q-7, the ladder fix I took on my own judgment.** Admitting only objects and arrays to the value-hash search implements the recon's stated intent (*"so a scalar cannot match by coincidence"*), which its byte floor does not deliver — `"crossroads"` is 12 bytes, `"mountain_pass"` is 15. It removed 5 false `same` verdicts on `resolveConfig|tradeRoute` and added none, and it brought my reading into agreement with the recon's own published verdict for that key. It is a defect fix, not a redesign — but it *is* a change to an accepted measurement, so it is flagged rather than buried. Vetoable in one line.
3. **The instrument still has not run inside vitest.** Everything about it is CONFIRMED against a faithful simulation and seven in-tree precedents mock the same module the same way — but a precedent is not a receipt, which is precisely why Q-2's control is now the first arm and a STOP. I would rather the build lane discover this in thirty seconds with a number than at the terminal.
4. **`credited` and `parked` remain PLAUSIBLE.** Everything else in the lighting prediction is arithmetic over a measured denominator; those two depend on walker rules I read only in outline, and they will be settled by the recorded red.
5. **The base is moving under this packet.** EM-P3 is in the slot now and owns `resolveConfig.js`, which holds 18 of my 75 rows. The obligation is written into the header and the receipt, and it is a re-run rather than a re-compile — but it is the one thing between this DRAFT and a promotion that is not yet a receipt.

---

# DELTA 2 — Q-6 and Q-7 carried; EM-P2 version 3 CLOSED (2026-09-19 16:4x EDT)

Status: **DRAFT, closed.** No open chair questions. One execution (`proto/p6-onrecord-counts.mjs`, 25,885 ms) re-measured everything at the final shape.

## Sites changed

| ruling | what changed | where |
|---|---|---|
| **Q-6** both comparands | Tier-1 rows now carry **two** count triples with their derived classes — `onRecord`/`onRecordClass` (the key's FINAL value vs the record) and `producedOnRecord`/`producedOnRecordClass` (the POST-STEP value vs the record) — each contracted in one sentence, both derived by the same four rules, both summing to `rows`. `recordPath` is defined against the FINAL comparand. **New §6.2b** tabulates all 18 disagreeing rows. A3s and A4 assert both triples over the 63 rows; the mismatch arm prints both. | `EM-P2.md` §6.1, §6.2, §6.2b, A3s, A4, VF-17/19/20, §12; manifest `tier1Shape` |
| **Q-6** `producedPath` | **measured, and NOT carried** — see below | `EM-P2.md` §6.2, VF-20, A4 |
| **Q-7** the type gate | accepted and recorded in the evidence as a defect-and-fix note with the before/after for `resolveConfig\|tradeRoute`, so the next reader does not re-find it | evidence **§E-27** |
| standing note | header line: **design §22 (ARCH-REDERIVE v1) is a consumer alongside EM-A1**, its re-entry family `EM-R1…R6` reading Tier 1 per writer; **EM-P0b WITHDRAWN** and every follow-on sentence now names the EM-R family | `EM-P2.md` header, §2, §6.2, §6.2a/b; manifest `consumers` |
| closure | the open-questions block is replaced by **"NONE OPEN"**; Q-1…Q-7 all sit in the carried-rulings table | `EM-P2.md` §11 |

## ⭐ `producedPath`: measured, not needed

```
rows with ANY differing landing path (both non-null) = 0 of 75
=> a separate producedPath field is NOT NEEDED
```

Over 63 corpus rows × 75 register rows, counting only rows where **both** comparands land (a `null` is an absence the `producedOnRecord` triple already reports): **no row ever sees the post-step value land somewhere other than where the final value lands.** The two comparands disagree about *whether* a value reaches the record, never about *where*. One `recordPath` therefore serves both triples — and **A4 re-measures that zero**, so the field cannot quietly become owed without a red.

## Where the two comparands differ: 18 of 75 (unchanged across re-runs)

| `onRecordClass` | `producedOnRecordClass` | rows |
|---|---|---:|
| `same` | **`absent`** | 7 — every `effectiveConfig` row (`resolveConfig`, `resolveResources`, `resolveStress`, `resolveNeighbour`, `isolationPass`, `stressConfirmPass`, `generateEconomy`) |
| `same` | **`varies`** | 10 — `stress` ×3, `institutions` ×5, `isolationSupport`, `economicState` |
| `varies` | **`absent`** | 1 — `assembleInstitutions\|generationRepairs` |

Tallies: `onRecordClass` **19 · 35 · 15 · 6**; `producedOnRecordClass` **27 · 18 · 15 · 15**. The class tally is unchanged at **28 drawn · 1 label · 46 pure** with 13 drawing steps — now measured four independent times in this lane.

The sharpest row is `resolveConfig|effectiveConfig`: `onRecord` says `same` (the config *is* on the record) while `producedOnRecord` says `absent` (what that step handed on is not what the record carries — six later steps mutate it). A re-entry trusting `onRecord` alone would hold, at seven different writers, a value none of them wrote. That is design §22's "held facts are FINAL at every writer" as a measurement.

## Final budget and cost

| | limit | final | across all three shapes |
|---|---:|---:|---|
| effective lines per leaf | 250 | **106** | **unchanged** — pre-ruling, one triple, two triples |
| new production effective lines | 400 | **106** | — |
| handwritten files | 12 | 4 + 1 manifest row | — |
| existing logic files modified | 3 | **0** | — |
| acceptance cases | 8 | **8** | — |

A second triple lengthens a Tier-1 row from 287 to **384 characters** and adds no LINE (no `max-len` rule). **The pre-approved two-leaf split stays untaken, measured at every shape.**

**Census wall-clock: 25,885 ms** for the 63-row × 23-run classification filling both triples (410.9 ms/row; 1,449 pipeline runs plus one record index per baseline). Across this lane's three executions of the same sample: **25,426 / 31,101 / 25,885 ms** — the packet budgets against **~31 s, not the best run**, under a 180,000 ms timeout (≈5.8× headroom).

## Closing note

Nothing is left for the chair to decide. The two obligations that outlive this compile are **executions, not decisions**: A1's instrument control at the build lane's very first run (a `total mints` of 4 means the mocks never reached the generator graph — write the STOP with the numbers, touch no shared config), and the 75-row re-classification at the then-tip if EM-P3 lands first. **EM-P2 version 3 is closed and waits for its turn in the slot.**
