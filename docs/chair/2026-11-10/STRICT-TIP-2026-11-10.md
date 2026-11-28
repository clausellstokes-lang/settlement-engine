# STRICT-TIP — the record (2026-11-10, 04:22 UTC)

**Seat:** STRICT-TIP, a cure seat, child of the cloud chair (session `session_01FbPLbejcfwX5nii12VM673`). **Branch:** `lane/strict-tip-2026-11-10`, cut from `lane/integration-2026-11-07` at `bf14617ca`. **Brief:** the chair's dispatch of 2026-11-10 03:55 UTC (rulings T1–T5). **Outcome:** `npm run typecheck:domain:strict` EXIT 0 at the tip (1113 errors, ceiling 1113, no file above or below its ceiling); `npm run typecheck:ratchet` 167 (ceiling 167) at the tip and after every commit; 17 commits: 14 type cures, one comment-line fixup, one register re-stamped through its door, and this record. Every source change is JSDoc, a comment, line order, or parentheses; no emitted behaviour changes.

## 1. The measure that could refute the brief

At `bf14617ca`, `tsc --noEmit -p tsconfig.domain-strict.json` printed 1203 domain errors against the baseline's 1113: 24 files over their ceilings. **The excess is 90, not 87.** The brief's own per-file list sums to 90 (2+2+8+2+1+1+4+2+1+1+1+3+2+1+6+1+3+21+1+4+9+3+4+7); its total was an arithmetic slip, and the files and per-file figures were right.

The four files with a nonzero ceiling carry old rows that stayed inside it. For `settlementStrategy.js`, a strict run at `78a425f6b^` reproduces exactly the 16 baseline rows (Aug–Sep: `inputTick`, `strategyEmergencyRecallFor`, `addReason`, the termination receipt reads, the rules flags, `callerId`). `occupation.js`'s two and `tradeWar.js`'s two are the `sourceEventId` TS2353 rows of `7796954e7`. `warDeployment.js`'s five are those two plus the three TS7006 rows of `b243d3498`.

## 2. The census (sent to the chair before the first edit)

Kind (a) is a missing annotation on code a lane added. Kind (b) is a type narrowed or left wide elsewhere. Kind (c) is strict being right.

| Kind | Rows | Cause (introducing commit) | Files |
|---|---|---|---|
| (b) ONE TYPEDEF | 37 | `proseSelection.js :: ProseVariant` takes the open bag `Record<string, unknown>`; the STYLE-2 pools type their line parameter with a named slot bag (`7ba010c07` turned `@type {any}` into `TierLineSlots` and the others; the 11-09 style commits `0ad288756`, `e8549f5df`, `930b611cd`, `81fc1a2a0`, `67b3f7451`, `7bd8e0b8b`, `39a46b04b`, `78a425f6b`, `ee00c881a`, `47e6807fc`, `45773294d`, `1e05cafba`, `1aad33c36`, `3ef335ef7`, `34d80d56b`, `c1bcd443d` did the same), and strictFunctionTypes rejects them at `pickLine` (TS2345) | causeLifecycle 1, deploymentReturn 3, eventProse 2, moralInstitutionPressure 1, occupation 6, populationDynamics 1, realmEvents 3, settlementStrategy 3, stressors 1, stressorsCore 4, tierResourceDynamics 4, tradeWar 3, warDeployment 4, warRecordMode 1 |
| (b) ORPHANED JSDOC | 29 | A style commit put the new pool consts BETWEEN a function's JSDoc block and the function, so the block documented the const and the params went implicit-any | settlementStrategy `emitMove` 18 (TS7031 ×8, TS2339 ×3, TS2349, TS2322 ×5, plus the recall reasons' TS2322: `78a425f6b`, `ee00c881a`); warRecordMode `warExhaustionClearanceOutcome` 6 (`c1bcd443d`); tierResourceDynamics `resourceCandidatesFor` 5 (`1aad33c36`) |
| (a) | 6 | Untyped locals | powerSupport `dealDoubledNiches` 4 (`ac1a23085`); dossierViewModel `deriveViability`'s `pick` 1 (`0fc8f82d0`); npcProfile `inferPrimaryRelationship`'s `tense` 1 (`a9fc780d4`) |
| (b) WIDE/NARROW | 12 | defenseStateProse 8: the desks' settlement params leave `chainModifiers`/`traditions`/`flags` unknown while their readers name a shape, `withSaid` returns `object` (`ba1b81698`, `ec73f09f3`, `e4cbe50db`, `15e146c53`, `c66099791`); generalStateProse 2: `readings.inst` typed `object` (`86a30fdf2`); printProse 1: `r` is `object` (`86c893cc8`); validationOnPage 1: `ArrOf` (`b3b01abd2`) distributes an absent member into `never[]` at a `d3b9280f6` line | 4 files |
| (c) CANDIDATES | 6 | Each probed (§4): all unreachable | dossierViewModel `dependencyGoods` 1 (`0fc8f82d0`); newsBody `withDateline` 1 (`306a8dce4`) and `newsCardReasons` 1 (`fe87c9cad`); settlementQuickGuide `cultureScopeLine` 1 (`966709f9c`); factionRename `renameNpcRecord` 2 (`be2fa5b45`) |

Total: 37 + 29 + 6 + 12 + 6 = 90. (The census message to the chair said "8" for kind (a) and "13" for the wide/narrow rows. Those were miscounts; the rows were listed right, and they are 6 and 12, as above.)

## 3. Each file, its commit, both checkers

Strict figures are `tsconfig.domain-strict.json` domain errors / excess over the ceilings. Full figures are `npm run typecheck:ratchet` over `tsconfig.full.json`. Every row's strict diff against the parent is message-normalized: **0 rows introduced** at every commit.

| Commit | File | Rows cured | Strict total (excess) before → after | Full (`typecheck:ratchet`) |
|---|---|---|---|---|
| `816810435` | proseSelection.js (14 files cured) | 37 | 1203 (90) → 1166 (53) | 167 / 167 |
| `d042cd5e8` | warRecordMode.js | 6 | 1166 (53) → 1160 (47) | 167 / 167 |
| `e040e4967` | tierResourceDynamics.js | 5 | 1160 (47) → 1155 (42) | 167 / 167 |
| `7447fb03f` | settlementStrategy.js | 18 | 1155 (42) → 1137 (24) | 167 / 167 |
| `93b177152` | dossier/powerSupport.js | 4 | 1137 (24) → 1133 (20) | 167 / 167 |
| `45286ecf4` | npcProfile.js | 1 | 1133 (20) → 1132 (19) | 167 / 167 |
| `6152cff51` | display/dossierViewModel.js | 2 | 1132 (19) → 1130 (17) | 167 / 167 |
| `8327caaee` | summary/settlementQuickGuide.js | 1 | 1130 (17) → 1129 (16) | 167 / 167 |
| `296c62c83` | stateProse/defenseStateProse.js | 8 | 1129 (16) → 1121 (8) | 167 / 167 |
| `37b7e9ef0` | stateProse/generalStateProse.js | 2 | 1121 (8) → 1119 (6) | 167 / 167 |
| `a26d00aa0` | stateProse/printProse.js | 1 | 1119 (6) → 1118 (5) | 167 / 167 |
| `f08fc30a9` | display/validationOnPage.js | 1 | 1118 (5) → 1117 (4) | 167 / 167 |
| `8dbfe8957` | display/newsBody.js | 2 | 1117 (4) → 1115 (2) | 167 / 167 |
| `2dc4acdef` | factionRename.js | 2 | 1115 (2) → 1113 (0) | 167 / 167 |
| `504cd6e03` | display/dossierViewModel.js | 0 | 1113 (0) → 1113 (0) | 167 / 167 |
| `a933f085b` | docs/content/wiring-census.json (through its door) | 0 | 1113 (0) → 1113 (0) | 167 / 167 |

What each cure is:

- **`816810435` · `proseSelection.js :: pickLine`** gains a JSDoc `@overload`. A pool typed over `T` takes `T` as `interp`, so a call that leaves out a slot its lines read is now checked. Untyped pools keep the open-bag signature. The @overload idiom is already in the tree (`inferSupplyChains.js`).
- **`d042cd5e8`, `e040e4967`, `7447fb03f`**: the orphaned blocks are back on their functions. Only line order changes; no line's text does. The frozen module-scope pools are read at call time, so their order cannot change what is read. In `settlementStrategy.js`, the recall override's `[cond ? line : null, pickLine(…)].filter(Boolean)` is spelled `/** @type {string[]} */ (…)`, the house idiom (`worldPulseFeedCuration.js`, `glossary.js`). It adds parentheses only.
- **`93b177152`**: `dealt` is typed from what the loop pushes. `list` is spelled `HouseBack[]` at the push, because the guard above it already proved it: `landing` was found IN `list`.
- **`45286ecf4`, `6152cff51`, `8327caaee`**: annotations, and parenthesized casts to the type the code's own guard or constant proves.
- **`296c62c83`**: the desk params spell the fields their readers read. `withSaid` returns its unit's own type (`@template U`). DS-DEF-4's `rung` takes `ComposedUnit|null`, which is what `composeStateProse` returns.
- **`37b7e9ef0`, `a26d00aa0`**: `inst` is spelled `Record<string, unknown>`, as the defence desks spell it. The faith-flags read is spelled at the read.
- **`f08fc30a9`**: `ArrOf` tests `NonNullable<T>`, so an absent member adds no element type.
- **`8dbfe8957`, `2dc4acdef`**: the dateline names are spelled `string[]` after the filter. `newsReasonPhrases` admits `reasons: null`, which its `Array.isArray` guard already handles. `NPC_FACTION_FIELDS`'s type says that an `each` row names its parent.

## 4. The kind (c) findings, each probed (not read)

The probe was a temporary vitest file run against the lane's modules, then deleted; it is not committed. Its source is quoted in the lane's transcript. Each line below is CONFIRMED by execution.

| Row | Probe | Result | Verdict |
|---|---|---|---|
| dossierViewModel `dependencyGoods` goods[0] `string\|undefined` | `deriveViability` on the `dependent` branch with dependency rows `Imports `, `{}`, `Imports 3 grain`, `null`, `{title: 7}`, `Imports salt (coastal)` | four summaries, `goods` / `grain` / `grain and salt`; no `undefined` | unreachable: `filter(g && …)` drops every unmatched row |
| newsBody `withDateline` names `string\|undefined` | `newsBodyText` with ids `nope`, `7`, `null` against a one-name map | `"A thing happened."` (as filed) | unreachable: the typeof filter |
| newsBody `newsCardReasons` → `newsReasonPhrases` (`reasons: null`) | `newsReasonPhrases({reasons: null})`, `newsCardReasons(null)` | `[]`, `[]` | handled: the `Array.isArray` guard |
| settlementQuickGuide `cultureScopeLine` possibly-undefined call | 200 seeds, a Germanic record | 200 non-empty strings, no throw | unreachable: a frozen five-frame pool |
| factionRename `renameNpcRecord` `npc[null]` ×2 | the table's `each` rows; a rename on an NPC with `memberships` | one `each` row, `parent: 'memberships'`; the rename touches `npcs[].memberships[].power` | unreachable: no `each` row has a null parent |

No kind (c) row needed a behaviour cure, so T2's red-first path was not used and no test was added.

## 5. The hand-back runs

Every run below executed at the lane's working tree (the type commits plus the two repairs), each read through `sh scripts/gate-tail.sh`.

- **`npx vitest run tests/lint tests/scripts tests/architecture --maxWorkers=2`** (first run, before the two repairs): 15 failed / 3557 passed in 243 files. **The base's own 11.** The same nine files run at `bf14617ca` in a base worktree give the identical 11 failing titles: `layerBoundaries` "dependency-cycle set equals the checked-in baseline"; `ledgerCitationIntegrity` (file-level); `newsHeadlineContract` A2, A3; `observedShapeReaders` ×4; `proseFamilyContract` A1, A3, A5; `proseRegisterLoaders` R6; `provenanceMap` (file-level). **The lane's 4**, each cured:
  - `proseWiringCensus` "EVERY MAPPING ROW IS CITED TO A PRODUCER…": my one added comment line moved `holderTable.js`'s line-keyed `dossierViewModel.js:654`. Cured by `504cd6e03`, which removes the line.
  - `proseWiringCensus` "THE DRY READ" and "byte-identical to a fresh build": the stamp over `defenseStateProse.js` and `generalStateProse.js`. Re-stamped through `scripts/wiring-census.mjs` by `a933f085b` (0 rows moved, bytes delta 0).
  - `sourceCitationIntegrity` "the archival exclusion…": this record joins the dated roster. Cured by the roster bump in this record's commit (`dated` 216 → 217, the baseline note and the walker header, through the Edit tool).
  - After the repairs, those two files ran 97 / 97 green.
- **The T2 golden run** (const reorders and parentheses moved runtime lines without changing them): `tests/property/generatorGoldenMaster.test.js`, `heraldKnowledgeDeskGolden.test.js` and every `tests/property/*ormancy*.test.js`. 62 files, 522 / 522 green, **0 moved**.
- **`npm run typecheck:domain:strict`** at the tip: EXIT 0, "1113 errors, ceiling 1113". **`npm run typecheck:ratchet`**: 167, ceiling 167.
- **The kind (c) probe file** (§4): 4 / 4 green, then deleted.

## 6. CONFIRMED against PLAUSIBLE

CONFIRMED by execution: both checkers at every commit (§3, a fresh `tsc` run per sha in a replay worktree), the gate's exit at the tip, the probes in §4, and the suites and goldens in §5. PLAUSIBLE, not executed: that a downstream lane's merge over `src/domain/worldPulse/*` composes cleanly. The hunks are minimal, but three of them move a pool const across a JSDoc block, and a lane that also edited those exact lines will conflict textually.

## 7. What stays

- The 1113 baseline rows are untouched. No row was added or raised, no `--update` was run, and nothing ended below its ceiling, so there was no ratchet-down to take.
- `pickLine`'s new overload makes slot omissions a type error at every typed-pool call site. Today there are 0 such omissions; a future pool that reads a slot its caller does not pass will now redden the strict gate instead of printing `undefined`.
- Two eslint warnings in `defenseStateProse.js` (`MONSTER_THREAT_TIERS` unused; `rung` unused in `defenseForcesProse`) are 0 errors and are not this lane's: the same two print at `bf14617ca` (eslint over the base blob).
