# EM-R0d — OPUS PRE-PROOF REPORT (tip `141a1d775`, 2026-09-20 06:54–07:15 EDT)

## VERDICT: ⛔ **BLOCKED** — three measured contradictions, one of them STOP-7 word for word

The packet's ladder science is sound and re-proves by execution. What blocks it is its **blast radius**: three
live instruments red on this edit and none of the three is in §7 or in `checks`. All three have one-line cures,
which this lane has drafted and (for two of them) measured GREEN. **One needs a chair ruling (Q1) because the
cure crosses §3's cap of three modified production files.**

**The three files (copies; the chair validates and places — nothing was written to the kit or any worktree):**

- `$SP/lane-preproof-EM-R0d-scratch/EM-R0d.md` — version 3, Status `DRAFT`, stamped BLOCKED
- `$SP/lane-preproof-EM-R0d-scratch/EM-R0d.manifest.json` — 12 change rows, 11 `requiredSymbols`, 8 checks
- `$SP/lane-preproof-EM-R0d-scratch/EM-R0d.evidence.md` — F-1…F-16 appended; D- and E- sections untouched
- plus `EM-R0d.lane-resume.md` (the gated commands) and `EM-R0d.preproof.report.md` (this file)

---

## 1. The J-T1 window — EMPTY from both compile bases

```
$ git merge-base --is-ancestor ad7ddf2c9 HEAD -> YES   e5bdfd031 -> YES   (29 commits e5bdfd031..HEAD)
$ git diff --stat ad7ddf2c9 141a1d775 -- src/data/bandLadders.js src/generators/factionDynamics.js \
    src/generators/defenseGenerator.js src/generators/foodGenerator.js tests/domain/bandLadders.test.js \
    tests/domain/generalStateProseDesk.test.js tests/ui/compendiumFoodSecurity.test.jsx \
    tests/ui/compendiumPower.test.jsx tests/build/generationWorkerLazy.test.js \
    tests/helpers/sourceContract.js tests/build/domainGeneratorsBoundary.test.js
            <empty>
$ git diff --stat e5bdfd031 141a1d775 -- <the same eleven paths>
            <empty>
```
**CONFIRMED.** Not one byte of any declared path moved. Every D-row and E-row over those files holds.

## 2. Every verified-fact row's verdict

| row | verdict at `141a1d775` | command |
|---|---|---|
| all 9 `requiredSymbols` | ⭐ HOLD, `1x` verbatim each; all survive the packet's own edits | `grep -cF` per pair, F-4 |
| CREATE target absent | ⭐ HOLD — `src/data/bandLadders.js` and `src/domain/bandLadders.js` both absent | `ls`, F-4 |
| the four ladders (cuts, operators, inputs) | ⭐ HOLD, re-proved by EXECUTION: A2 0 mismatches over 0..100, A3 54/54, A4 54/54, the `(15,20]` disagreement reproduced | F-13 |
| `EAGER_FIRST_PAINT_MODULES` | ⛔ **FIGURE REFUTED, DELTA HOLDS** — live **268**, not 283. `268 → 268` byte-identical; forbidden placement `268 → 270` | imported the set, F-2 |
| `ENGINE_SHARED_DOMAIN` | ⛔ **FIGURE REFUTED, DELTA HOLDS** — live post-excision **51**, not 68. `51 → 51` | F-2 |
| worker byte delta | ⚠ **RE-PRICED +2,205 B** vs E-2's +1,801 B; both inside the 3,314 B bound | esbuild per-file, F-8 |
| preamble SHA-256 | ⛔ **STALE** — now `16dfb96f…`; version 2's `b90a95b7…` predates the second amendment | `shasum -a 256`, F-1 |
| the ceiling arm's dist guard | ⛔ **MIS-STATED** — `describe.runIf(DIST_EXISTS)` skips on NO DIST, not on a missing `VERIFY_DIST=1` | F-9 |
| tuning register | ⭐ HOLD, identical to D-7 (48 · 46 · 63) | the repo's own scanner, F-10 |
| prose-numerics (step 13) | ⭐ HOLD — 218 rows, none for any of my paths | F-10 |
| observed-shape | ⭐ HOLD, identical to D-12 | F-10 |
| wiring census STAMP (step 15) | ⭐ HOLD — none of the three producers stamped | F-10 |
| ⛔ wiring census CITE (step 16) | ⛔ **REFUTED — THE ARM REDS** | F-7 |
| edge-shared (§P2 row 10) | ⭐ HOLD — measured against all five metas' `inputs`: none of mine | F-10 |
| mutation-coverage | ⭐ HOLD — no row owed; the manifest is held by **EM-P2 (READY)**, which this packet does not name | F-10 |
| hot files | ⭐ HOLD — the list grew to 8 rows but none of my paths is on it | F-10 |
| Q5 / collisions | ⭐ HOLD with a **new subject**: 193 entries, the one non-LANDED is **EM-P2 (READY)**, not EM-B3c; all twelve paths free | F-11 |
| lighting delta | ⭐ HOLD, re-executed: `files +1 · credited +1 · parked +0 · titles +8 · suiteTitles +1` | the walker's own `classify`, F-12 |
| ⛔ four source-text anchors | ⛔ **REFUTED — THERE ARE SIX** | F-5 |
| ⛔ authored-vocabulary allowlist | ⛔ **REFUTED — TWO ARMS RED** | F-6 |
| §22.3 item 6 · charter amendment 29 · ODQ §934.47 add. 25/29/38 | ⭐ all four rulings read and honoured; no contradiction | ledger `git show` |

## 3. The three blocking findings, smallest contradiction first

### ⛔ F-5 — a FIFTH and SIXTH source-text anchor. This is STOP-7 verbatim.
`tests/components/dossierLabelCase.test.jsx:238-244` `readFileSync`s BOTH `defenseGenerator.js` and
`foodGenerator.js` and asserts every readiness label and every food label is still spelled `'<label>'` there.
Executed against the packet's own edit:
```
AT THE TIP    readiness missing: []          food missing: []
AFTER EM-R0d  readiness missing: ["Fortress","Well-Defended","Defensible","Lightly Defended","Vulnerable","Undefended"]
              food     missing: all SIX  (all six live ONLY inside the deleted chain, lines 342–357)
```
D-8's two greps could not reach it: its anchors are a `.filter(l => !src.includes(...))`, not a `mustExtract`.
**Cure (drafted, §7):** import `READINESS_BANDS` and `FOOD_SECURITY_BANDS` and compare against
`…BANDS.map(b => b.label)` — the same upgrade §7 already applies to the two Compendium guards. The file is
CREDITED (13 titles · 6 suites), so the cure adds no `it`.

### ⛔ F-6 — `tests/copy/voiceMechanics.test.js` reds in two independent arms.
Tier 2 walks **`src/data`** — where this leaf lands — with an **exact-diff** ratchet (shrink reds too). Measured
with the walker's own allowlist, `countFile` and `SCANNED_FILES`:
```
TIP-BASE        rows=55 em=311 bang=8   DIFFS vs the committed baseline: 0       (GREEN today)
PACKET          rows=56 em=312          RED (1): src/data/bandLadders.js: baseline em:0 bang:0 -> current em:1 bang:0
PACKET + re-key rows=55 em=311          GREEN — byte-identical to the committed baseline
```
And the separate exact-count arm: the allowlist declares `'src/generators/foodGenerator.js' :: 'Deficit — Active
Famine': count 1`; after the edit that file measures **0**. **Cure: ONE re-key** of that entry to
`'src/data/bandLadders.js'`, measured to discharge both. No baseline refreeze is owed; the file is PARKED so the
census is untouched.

### ⛔ F-7 — brief step 16: three line-addressed citations the wiring-census walker reads LIVE.
`src/domain/prose/holderTable.js` cites `govMultiplier → factionDynamics.js:127`,
`governanceFractured → :133`, `breakdown → :179`; `proseWiringCensus.walker.test.js` › SEAM car 5b re-derives
every `cite` from a live syntax-tree pass and reds on a stale one. Simulated, the edit shifts the file −18 lines:
`:127 → :109`, `:133 → :115`, `:179 → :161`. **Cure: an addresses-only `MODIFY` row**, the three re-derived from
the built file, plus the walker joining `checks`. `defenseGenerator.js:458`/`:467` are above the edit and do not
move; the `:608` literal sits in a `.not.toContain` withdrawn list.

## 4. The `requiredSymbols` delta

Nine → **eleven**; none removed, none retired. Added because the deliverable now edits their containers and must
find them unchanged (both verified `1x` at the tip):
`src/domain/prose/holderTable.js :: export const HOLDER_SOURCES` and
`tests/copy/voiceMechanics.test.js :: const AUTHORED_VOCABULARY_ALLOWLIST`.
`retiredSymbols` stays **EMPTY** — the real retirements are source-text anchors no verbatim check can see, and
all six are now declared TEST rows.

## 5. Step 5 — the bundle budgets, measured by importing the set

| budget | base | with the packet | how |
|---|---:|---:|---|
| `EAGER_FIRST_PAINT_MODULES` | **268** | **268 (+0)**, same sorted-list sha `f21c167bcc41b3c3` | imported from `vite.config.js` over a `cp -R` overlay that reproduces the live set exactly |
| …with EM-R0b v2's domain reader | 268 | **268 (+0)** | same |
| ⛔ forbidden placement (generator → `src/domain`) | 268 | **270 (+2)** | same |
| `ENGINE_SHARED_DOMAIN` (live, post-excision) | **51** | **51 (+0)** | F-2 |
| generation worker static closure | 220 | **221 (+1)** | E-1 (unmoved inputs) |
| generation worker bytes | — | **+1,801 … +2,205 B** vs bound 3,314 | esbuild per-file, F-8 |
| lazy `engine` | — | predicted SHRINK (`vite.config.js:862` vs `:885`, both re-addressed) | READ at the build |
| edge-shared metas | — | **none of mine** | all five `inputs` lists, F-10 |

**What I added because of step 5:** nothing new — the packet already carried the ceiling TEST row and §8 step 9.
What changed is that the two first-paint absolutes are withdrawn and restated from the real instrument, and the
worker figure is a range with the worst-case room named (1,109 B, not 1,513 B).

## 6. Budget

| row | measured |
|---|---|
| new leaf effective lines | **53** (non-blank, non-comment) vs the packet's ≤90 and the standard's 250 |
| `factionDynamics.js` net effective | **−16** |
| handwritten files | 9 → **12**, exactly at the cap of 12 |
| existing production files modified | 3 → **4** if `holderTable.js` counts — **Q1** |

## 6b. The chair's two instructions of 2026-09-20 (from EM-R0b's pre-proof) — both discharged

### (1) Which cuts the corpus witnesses — SIX of SIXTEEN
Ran the golden master's own `goldenCorpus()` through the real pipeline: **525/525 generated, 0 failures.**
Readiness has **41 distinct scores with the hole at 34..44** — R0b's figure reproduced by an independent
instrument. Legitimacy 26 distinct, published `deficitPct` 28, published `surplusPct` **3** (`[0,7,8]`).

| ladder | cut | verdict | below | at/above | hole |
|---|---:|---|---:|---:|---|
| legitimacy | 75 | ⚠ FROM ABOVE ONLY | 72 | 75 | 73..74 |
| legitimacy | 60 | ⛔ UNWITNESSED | 58 | 61 | 59..60 |
| legitimacy | 45 | ⭐ WITNESSED | 44 | 45 | — |
| legitimacy | 30 | ⛔⛔ UNWITNESSED, 30 wide | 5 | 36 | 6..35 |
| readiness | 76 | ⭐ WITNESSED | 75 | 76 | — |
| readiness | 55 | ⭐ WITNESSED | 54 | 55 | — |
| readiness | 38 | ⛔⛔ UNWITNESSED, 11 wide | 33 | 45 | 34..44 |
| readiness | 24 | ⚠ FROM ABOVE ONLY | 20 | 24 | 21..23 |
| readiness | 12 | ⭐ WITNESSED | 11 | 12 | — |
| food LABEL `deficitPct` | 40 | ⛔ UNWITNESSED | 37 | 47 | 38..46 |
| food LABEL `deficitPct` | 15 | ⛔ UNWITNESSED | 14 | 19 | 15..18 |
| food LABEL `deficitPct` | 5 | ⭐ WITNESSED | 5 | 6 | — |
| food LABEL `surplusPct` | 40 | ⛔⛔ UNWITNESSED **and UNREACHABLE** | 8 | none | 9..∞ |
| food FLAG `deficitPct` | 20 | ⭐ WITNESSED | 20 | 21 | — |
| food FLAG `deficitPct` | 5 | ⭐ WITNESSED (shared) | 5 | 6 | — |
| food FLAG `surplusPct` | 40 | ⛔⛔ UNWITNESSED **and UNREACHABLE** (shared) | 8 | none | 9..∞ |

⛔⛔ **`Surplus` 0 of 525, `isSurplus` 0 of 525** — the owner's ODQ §934.57 "unreachable Surplus rung", now
measured on the FULL corpus rather than the 63-row stride. Rung census:
`Import-Dependent 208 · Pressured 151 · Secure 117 · Deficit — Active Famine 36 · Deficit 13 · Surplus 0`.

⛔ **The (15, 20] window, to the row: 36 rows, 12 `isPressured`, 24 `isDeficit`** — and the 24 are NOT famine
rows; all publish `deficitPct` exactly `20` with an unrounded value above it. **So the rounding hazard is 0 of
525 for the LABEL (RECON-G's figure, reproduced) and 24 of 525 for the FLAG.** The charter's tolerance amendment
covers the band check only → Q7.

**Done to the matrix, as instructed:** §11 gains a `CANNOT-CATCH` row saying that for the ten unwitnessed /
above-only cuts **A6's unmoved golden proves the corpus never reached the boundary, not that the cut survived**;
A2/A3/A4 stay the real proof because they are constructed over the functions. §5.1b says **EM-R7's corpus
ratchet records the witnessed score set**, and hands it all four sets verbatim.

### (2) The second `bandLadders.js` basename — named, measured, NOT renamed
`src/domain/compendium/bandLadders.js` (`buildBandLadders()`, the Compendium's ladder prose) is read by
`scripts/generate-compendium-data.mjs:64`, `src/domain/compendium/searchIndex.js:213`,
`src/components/compendium/CatalogTabs.jsx:28`, `tests/ui/compendiumBandLadders.test.jsx` and
`tests/domain/compendiumSearchDrift.test.js`, and holds three baseline rows.

| instrument | how it addresses | verdict |
|---|---|---|
| observed-shape baseline | its three rows are VALUES of a full `path` field (`manifests.{executionTree,scanTree,sourceTree}.entries[N].path`); **0** bare `"bandLadders.js"` in the whole file | ⭐ no conflation |
| mutation register `NAME_PATTERN` (on `basename(rel)`) | executed **false** for `bandLadders.js`, `bandLadders.test.js`, `compendiumBandLadders.test.jsx`; none of `src/data/`, `src/domain/compendium/`, `tests/domain/` is an `ENFORCER_DIR` | ⭐ no row, no conflation |
| the one `basename()`-against-text walker, `dossierMountRegistry.walker.test.js:1019` | its `drawer` population is the dossier mounts' importers (`src/domain/display/stateProse/**`) | ⭐ no conflation |
| any walker on the bare literal | `git grep "'bandLadders"` → empty | ⭐ none |

**No rename** — and renaming would break a compiled sibling (EM-R0b v2 already imports `../../data/bandLadders.js`).
⛔ **The one trap, cured in A8:** A8 must assert the **EXACT** path `src/domain/bandLadders.js` is absent, never
a glob, which would match the Compendium's file and false-red; the same arm now asserts that file IS present and
is imported by no `src/generators/**` file. The homonym is named in the leaf's header and §5.1c.

## 7. Questions for the chair (seven; each with a recommendation)

1. ⭐⭐ **Does an addresses-only citation row count against §3's cap of three modified production files?**
   `src/domain/prose/holderTable.js` is a frozen declaration table; the edit is three `file:line` strings, byte-
   neutral, no logic. **Recommend: NO — rule it a CITATION row outside the logic cap** (brief step 16 / CURE-D's
   own shape puts the citing file in the manifest without calling it a behaviour change), and record the ruling
   so the next step-16 packet does not re-ask. The alternative is STOP-4 and a split, which would put three
   line-shifts and their cure in a separate packet landing after the shift — the worst ordering.
2. **Version 3 is a pre-proof rewrite, not a resume of the compile lane.** Three rows, two withdrawn absolutes
   and a re-priced byte figure are more than a stamp. **Recommend: accept version 3 as the pre-proof's cut and
   promote from it**, rather than sending it back to the compile lane — every added fact is executed here.
3. ⚠ **FIX-C2 vs EM-R0d — a sequencing collision the chair owns.** FIX-C2 ("58 stale citation addresses
   re-addressed", `36c6b5a5c8` / `9af544fe74`) is **NOT an ancestor of `141a1d775`**; it lives on
   `fix-citations-2026-09-20`. If it lands first, EM-R0d shifts addresses it just fixed; if EM-R0d lands first,
   FIX-C2's baseline must be re-taken. **Recommend: land FIX-C2 FIRST**, then EM-R0d re-addresses three lines
   against a gate that already checks them — and EM-R0d's §7 row becomes routine rather than novel.
4. **Keep the 3,314 B bound?** Two lanes, same method, 404 B apart (+1,801 vs +2,205). **Recommend: KEEP it** —
   it still covers the worse figure with 1,109 B, EM-P3's precedent says the real build lands near 0.4× the
   estimate, and re-raising a bound the chair named before the price was spent would spend the bound's meaning.
6. ⭐ **`Surplus` is emitted 0 of 525 and `isSurplus` 0 of 525 — the cut is 40 and the corpus maxes at 8.**
   This is §934.62's standing decision point (ODQ §934.57), which the chair has already taken under the
   delegation "at the composition train's sitting, against EM-R0d's measured ladders". **Recommend: this is
   that measurement — take it at the sitting, not here.** EM-R0d moves the rung unchanged either way, so the
   ruling does not gate this packet; but the chair's leaning (strike the rung from the Compendium's ladder
   text) now has a full-corpus number behind it instead of the 63-row stride.
7. ⭐ **The rounding tolerance the charter gave EM-R0b v2 covers the BAND CHECK only, and the FLAGS need it
   too** — measured 0 of 525 disagreement for the label, **24 of 525 for `isDeficit`** (all publishing exactly
   `20`). **Recommend: extend the amendment's tolerance sentence to the flag vector** and hand it to EM-R0b v2
   in the same breath, before it compiles its `V-FLAGVEC` arm against published numbers. EM-R0d exports the
   unrounded comparison and rules nothing, so this is R0b's to carry, not a re-cut here.
5. **The three noticed stale prose addresses** (`proseEntryContradiction:393 → factionDynamics.js:466`,
   `voiceMechanics:362 → foodGenerator.js:342` — a line that will not exist at all —, and
   `RECEIPT_POOLS_DOSSIER_STATE.md:5295 → defenseGenerator.js:525-531` / `foodGenerator.js:339-357`). None
   gates at this tip. **Recommend: fold them into FIX-C2's sweep** rather than into this packet, and name them
   in FIX-C2's charter now so they are not re-found.

## 8. ⛔ Noticed and not touched — each specific enough to slot

1. **`voiceMechanics.test.js:362`'s `why` will become false in BOTH halves** — it says `'Deficit — Active Famine'`
   "transcribes `src/generators/foodGenerator.js:342` byte for byte", and after EM-R0d that file holds no such
   line. The §7 cure re-keys the entry; the `why` must be rewritten to name the leaf. → **inside EM-R0d's own
   TEST row.**
2. **`tests/lint/proseEntryContradiction.walker.test.js:393` carries `where: 'src/generators/factionDynamics.js:466'`**,
   which shifts −18. The field is used only in failure MESSAGES (`:407`, `:409`, `:432`), so it does not gate —
   it just lies. → **FIX-C2's sweep (Q5).**
3. **`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:5295` cites `defenseGenerator.js:525-531` and
   `foodGenerator.js:339-357`** — the second range IS the chain this packet deletes. Ungated at this tip only
   because FIX-C2 is not merged. → **FIX-C2's sweep (Q5); it becomes gated the moment FIX-C2 lands.**
4. **`severityBand` is declared FOUR times across the estate** over different quantities (`heraldFilter.js:20`,
   `activeConditions.js:541`, `settlementRumors.js:893` module-local, `structuralFingerprint.js:45`) — a fifth
   ladder family. §22.3 item 6 calls the active-condition severity ladder "the only one importable from the
   domain layer today"; that is `activeConditions.js:541` and the other three are not it. → **EM-R0b v2's
   measurement, or EM-R7's terminal sweep.**
5. **`tests/build/generationWorkerLazy.test.js` is PARKED** (`SUITE_NOT_RUNNING:describe.runIf()` + 5
   `TEST_UNREGISTERED:it`), so its five `it`s count nowhere in the lighting census. Harmless for EM-R0d, but any
   packet that ever prices a title there would price a phantom. → **a line in the pre-proof brief's step 14(b).**
6. **`stamp.producerIndexFiles` in `docs/content/wiring-census.json` is a NUMBER (1171), not a list** — E-5 read
   `.length` of a number and printed `0`, which happened to be the right answer for the wrong reason. → **a
   correction in the compile brief's step 15 wording.**
7. **The hot-file list moved under both compile bases** (`convergence.js` 798 → 764; `institutionLifecycle.js`,
   `App.jsx`, `SettlementsPanel.jsx` joined). D-12's five-name quote is superseded. No EM-R0d path is on it. →
   **a re-quote in any packet still citing the five-name list.**
8. **`src/domain/compendium/bandLadders.js` names the food top rung `Active Famine`** where the producer says
   `Deficit — Active Famine`; §7's `compendiumFoodSecurity` cure compares with `label.includes(name)` for exactly
   this reason. The Compendium also documents **no rungs at all** for the overall readiness ladder. →
   **FIX-C1**, already chartered.
9. **`tests/lint/proseWiringCensus.walker.test.js:1685-1691` asserts exactly four `generator-write` evidence
   rows, one of them in `defenseGenerator.js`**, and separately `.not.toContain('src/generators/defenseGenerator.js:608')`.
   Both are line-sensitive to this packet's defence edit in ways I could not fully bound without running the
   walker. → **the build lane runs `tests/lint/proseWiringCensus.walker.test.js` whole (now in `checks`) and
   STOPS on either arm.**

## 9. Gate posture

Every ungated step is done. No vitest, no eslint, no npm script, no build was run; every probe was plain `node`.
The gated commands are written in order in `EM-R0d.lane-resume.md`. ⛔ **The chair should rule Q1 before the
gate is spent** — if `holderTable.js` is refused as a fourth row, the packet splits and the gate run changes.
