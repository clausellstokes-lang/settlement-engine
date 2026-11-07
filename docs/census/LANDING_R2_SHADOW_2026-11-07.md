# LANDING-R2 SHADOW — phase 1 redone from the remote (R2-SHADOW, 2026-11-07)

> Insurance seat for the rung-2 landing (brief: R2-SHADOW, 2026-11-07; Opus 5.5, a child of the cloud chair, Fable 5.1, session `01FE9mEvGxnFx6WTBkEC6ie9`). Branch `lane/rung2-shadow-2026-11-07`, cut from `origin/lane/rung2-landing-2026-11-06` at `f5dc50c6b`, worktree `/home/user/r2shadow` (a separate git worktree: switching the session's main checkout was refused by the harness, and CLAUDE.md forbids it; the main checkout stays clean on master). Phase 1 only. Nothing re-recorded, no register written on the branch, no test touched beyond the merge's own conflict hunks. **HOLDING** for the chair's "DISCARD" or "CONTINUE to phase 2".

## 1. The merge — `704e5efc5` (origin/master `db832c892`, rung 1 landed, into `f5dc50c6b`)

Ten conflicts; every resolution is named in the merge commit's body.

| file | kind | resolution |
|---|---|---|
| `docs/content/wiring-census.json` (24 hunks) | GENERATED | rung 1's side; re-derived through its door in phase 2 (§4) |
| `src/data/dossierStateProse/defense.generated.js` (1) · `general.generated.js` (2) | GENERATED | rung 1's side (the hunks: `readsCount`, the census's `colour` flags); re-derived in phase 2 |
| `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` (the authored corpus the prose generator projects) | DOCS | union: DS-ECO-9 lines 2–3 keep the census's scope tags (`institution: granary`, `grain`); line 4 takes rung 1's sentence (`282891162`, "sealed off" without "from the road") |
| `src/domain/coherence/readerBattery.js` (7) | SOURCE | union: the census's homes (role-class rule in `domain/roles/roleClass.js`, `facts/water.js`, `facts/terrain.js`, `factsOf` guard answer, the R11 shape rule, `[gap-vs-record]`) with rung 1's typing (LANDING-6 `ReaderRecord`/`ReaderNpc` on every conflicted signature); rung 1's imports of `NOBLE_ROLES`/`hasMarketInstitution`/`POWER_ROLES_BY_CATEGORY` dropped: the census moved their readers out of this module |
| `src/domain/coherence/hookTruthRecord.js` | SOURCE | both imports (`crisisEntries`, the census; `buildViabilitySummary`, LANDING-6 V-SUMMARY-HOOKS), both used |
| `src/generators/economy/viability.js` | SOURCE | **two moves of one rule**: rung 1 (LANDING-2) moved `hasMarketInstitution` to `domain/marketInstitution.js`; the census (CENSUS-1 fact 5) to `domain/facts/market.js` (the live-roster reading, measured by rungs 2E/2F). The shim re-exports the census home; `domain/marketInstitution.js` becomes a re-export of it, so no second copy exists |
| `src/generators/npc/factionRoleCatalog.js` | SOURCE | rung 1's shim (from `domain/entities/factionRoleCatalog.js`); that module's `NOBLE_ROLES` literal replaced by a re-export of the census's `data/nobleRoles.js` (byte-identical table; 9 rows, measured) |
| `tests/domain/terrainPoolsWatersideScopes.test.js` | SOURCE (test) | rung 1's shape (LANDING-7 A: one parameterless labelled loop) carrying the census's assertions (phase B unit 2, the inland scope phrase) — no assertion dropped |
| `tests/domain/warFaithStateProseDesk.test.js` | SOURCE (test) | both import lines (`STATE_MARK_DIMENSIONS`, `poolMemberTexts`) |

`npm ci` exit 0. The five resolved modules import cleanly; the four conflicted suites besides warFaith pass (§4).

## 2. The 1,000 (`soak-review.mjs --count 1000 --workers 4`)

Two runs. **A** = the merge commit `704e5efc5` as committed (generated leaves at rung 1's side). **B** = the same tree with ONLY the three generated files re-derived through their doors in a scratch worktree (`node scripts/wiring-census.mjs`, then `node scripts/generate-dossier-state-prose.mjs`; nothing else differs; not committed).

| class | kind | rung 1E (1,000) | 2F tip `663a19c36` (1,000, phase E) | **A: merge as committed** | **B: leaves re-derived** |
|---|---|---|---|---|---|
| `cert:*` · `cert:false-presumption` | cert | 1,000 / 1,000 · 0 | 1,000 / 1,000 · 0 | 1,000 / 1,000 · **0** | 1,000 / 1,000 · **0** |
| `coh:crisis-blind-prose` | 10 | 0 | 0 | **143 / 229 — RISES** | **0** |
| `A-12:self-vouch-false` | wording | 0 | 0 | **12 / 12 — RISES** | **0** |
| every other `coh:*` | 1–10 | 0 | 0 | 0 | 0 |
| `A-09:behaviour-line-share` | 6 | 8 | 8 | 8 | 8 |
| `info:battery-would-not-vouch` | info | 691 | 676 | 676 | 676 |
| `A-05:lacks-access-lines` | info | 977 | 0 | 0 | 0 |
| `reader:faction-role-fit` · `tension-memory` · `relation-types` | 9 | (no instrument) | — | 352/525 · 61 · 0 | 352/525 · 61 · 0 |
| findings · verdict | | | 684 · CLIMB (compose) | **925 · STOP** | **684 · CLIMB** |
| errors · replay · bands outside | | 0 | 0 | 0 · 0 · none | 0 · 0 · none |

**The rise, bisected to its side: CONFIRMED the GENERATED LEAVES at rung 1's side, not either side's code.** The census's crisis scoping reaches the runtime only through the projected leaves (`poolMeta` is projected from the wiring census); with rung 1's leaves the census's `colour`/crisis-scope marks are absent on the conflicted pools, and the crisis-blind claims return (the A-12 twelve ride them, as in 2D). Re-deriving those three files alone returns run B to the compose's exact 684 findings and CLIMB. Nothing to cure in code; phase 2's door chain cures it (§4). B's figures equal rung 2F's 1,000 class for class; rung 1E's `A-05` 977 and `info` 691 are the R1 validation lane's and 2D's falls, carried by the census line.

## 3. The bisect of the all-525 golden move, by lane commit

Method: a scratch hasher (`hash525.mjs`, not committed) mirroring `tests/property/generatorGoldenMaster.test.js :: hashFor` exactly, with ONE corpus spelling for every tree (`tests/helpers/goldenMasterCorpus.js` of the merge). **Validated**: on master `db832c892` it reproduces the freshly signed `tests/fixtures/generator-golden-master.json` 525 of 525. Candidates: the 305 non-merge commits in `3bc72bc0c..f5dc50c6b` (rung 2D tip → the rung-2 branch tip), filtered to the 134 that touch a `src/` file in the pipeline's import graph (esbuild metafile of `generateSettlementPipeline.js`, union of both ends: 324 modules; a file absent at both ends counted as in), plus every file transient to the range. Each candidate hashed at itself and at its FIRST parent (its OWN LINEAGE on its own branch): 203 trees, 0 generation errors. The reverse stages were not attempted (LANDING-R2's finding: the census cross-merges hand-joined imports, so reverse-applying conflicts by construction).

**Result: 33 moving causes** (LANDING-R2's count, reproduced independently). The all-525 mover is `73fa1a1e7` (lane R11, reader-tonight-wants, carried into the mechanism lane at `950b75014` with census-4) — not a census-4b/4c record shape, which the compose had called PLAUSIBLE; CENSUS-4's 145 rows are `b84dc1d39`'s own, exactly as its record says.

| commit | lane | unit (subject prefix) | own-lineage rows | the cause, as the lane commit states it |
|---|---|---|---|---|
| `1e28fbfd3` | census-4 | census-4 R9 | 17 | a guild master's title never doubles a possessive (reader:possessive-slip) |
| `f4f765b72` | census-1b | census-1b unit A (c) | 4 | the viability water-dependency check reads water from the home |
| `e152ee220` | census-4 | census-4 R8 | 171 | the designer's threshold notes move off the page into the catalogue's own field (reader:rule-text) |
| `596cb8b1b` | census-4 | census-4 R3 | 441 | the tie rule — one role-class rule for the tie step and the instrument (reader:relation-types) |
| `acd70a977` | census-4 | census-4 R12 | 272 | faction-role-fit — reader:faction-role-fit (kind 9) and the assembly seam's re-home |
| `73fa1a1e7` | reader-tonight-wants (R11) | fix(npc) | 525 | R11 unit 3 — the 76 registry goals rewritten in the house register |
| `b84dc1d39` | census-4b | census-4b unit 2 (Appendix B item 3) | 145 | the goals declare — the registry's tags, the npcGenerator goal pools, NPC_FACTION_GOALS |
| `e267287e7` | census-1d | census-1d unit 2 (the chair's R-A ruling, 02 | 409 | 30): the NPC structure registry lookup resolves through the one rule — CENSUS-4b's CALM_ONLY tags enforced |
| `b8fdcd3d5` | census-1e | census-1e unit 1 (Appendix B item 23, T) | 409 | the registry goal lookup resolves through the one rule |
| `1c00ed235` | census-1e | census-1e unit 2, rulingStructure (Appendix B item 23, inline T) | 168 | CENSUS-5b's FACTION_DESC_SIBLINGS resolve where they print |
| `cf937ca76` | census-3d | census-3d unit 6a, the history hooks (HISTORICAL_EVENTS_DATA[].plotHooks) | 60 | twelve rows declare; the tensions list filters (kind A); the timeline roll reads text (R-C) |
| `f2367a403` | census-1e | census-1e unit 2 cure (R-Q) | 168 | FACTION_DESC_SIBLINGS' two militia sets wait on order — cert:false-presumption 24 → 0 |
| `fa39513d3` | census-4d | census-4d unit 2b (the chair's answer 2, R-X) | 142 | the catalogue's guild tag leaves the village scribe, the town crier, the official mint and the veterans' lodge |
| `1abf16d8d` | census-4d | census-4d unit 2c (the chair's answer 3, R-W) | 212 | the bowyers' "Military supply" presumes a guard, not garrison AND militia |
| `eb4a35feb` | census-3e | census-3e unit 2a, the NPC loyalty guard rows (answer 4) | 12 | NPC_FACTION_LOYALTY declares the ledger's fourteen rows; the loyalty draw stores text and resolves a refused row to a fresh admitted template |
| `bc3483002` | census-3e | census-3e unit 2c, the grain-monopoly hook (answer 2) | 38 | R-V measured, `guild` is not settled at the economy step, so the hook is reworded to presume only the imports |
| `d422a8dbd` | census-1f | census-1f unit 1a (Appendix B site 19, H) | 24 | the tie draw resolves through drawDeclared |
| `1e712616f` | census-1f | census-1f unit 1b (Appendix B site 18, H) | 145 | the institution description draw resolves through drawDeclared |
| `9eee701c0` | census-1f | census-1f unit 1c (Appendix B site 15, R) | 74 | the per-definition service roll resolves through drawDeclared |
| `f6ec896f3` | census-1f | census-1f unit 2 | 3 | the arrival scene's ⚠ redraw-once enforces the beats' declarations |
| `b3d4fa202` | census-5c | census-5c (the chair's ruling of 05 | 168 | 25, R-A): FACTION_DESC_SIBLINGS' militia sets measured, reworded (R-Q → R-U) |
| `4dfb47bef` | census-1f | census-1f unit 3c (Appendix B item 23, T) | 104 | the outlook hooks resolve through OUTLOOK_HOOK_SIBLINGS |
| `cb46c3e2b` | census-1f | census-1f unit 3d (Appendix B item 12, R) | 77 | the timeline hook roll resolves through drawDeclared |
| `25145f198` | census-4e | census-4e unit 2 (the chair's answer 2 to CENSUS-4d, R-X) | 183 | the guild tag leaves Hired blades, Contract killer, Customs house, Auction house and Assay office |
| `1b74763a6` | census-5d | census-5d unit 1 (the chair's answer 2, R-AN / R-U) | 168 | the three twin-less garrison sets reworded |
| `167c95700` | census-3g | census-3g unit 5 (R-AM read) | 167 | the starving outlook set reworded and twinned |
| `113a165e0` | census-3h | census-3h unit 3 (R-AV) | 131 | the moderate-gap twin carries the band the food record reads |
| `0c445be43` | census-1h | census-1h R-AT | 12 | a resolution's tie-break key carries the settlement's identity |
| `d035cf840` | census-1h | census-1h R-AU | 64 | the outlook-hook site drops a refused hook with no admitted twin |
| `ba7887862` | census-1i | census-1i unit 1 (R-AW) | 168 | the Military/Guard label resolves against the final record at the birth's close |
| `597866207` | census-1i | census-1i unit 3 (R-AX, refined) | 103 | both rolls of the criminal secret read the holder's role |
| `24ca3ee49` | census-1i | census-1i unit 5 (R-AT's wider audit) | 84 | the ten keyless or constant-key drawDeclared callers keyed on the settlement |
| `e36e4916f` | census-1i | census-1i unit 6 | 21 | NPC_WANTS's site wired through drawDeclared, CENSUS-4f's declarations enforced |

The cause column is the lane commit's own subject (its record names it; the lane records are `docs/CENSUS_{1,1B,2,3,4,5}_LANE_2026-11-04.md`, `docs/READER_R11_TONIGHT_WANTS_2026-11-04.md`, `docs/census/CHAIR_RULINGS_2026-11-05.md`). Phase 2's records quote each lane record's cause sentence verbatim (the chair's option (b)); this table locates them.

**Reconciliation.** Sum of own-lineage rows 4,889 (rows move under several causes). The union of the 33 causes' own-lineage row sets is **525**; the rung-2 tip `f5dc50c6b` vs `3bc72bc0c` moves **525**; the residual — tip rows no cause moves on its own lineage — is **0 rows**. (The interaction is in WHICH bytes a row ends at, not WHETHER it moves: every row is moved by `73fa1a1e7` alone, so no row-set residual can exist; the per-surface record states the exception and this reason.)

**Against the base phase 2 records on top of:**

| comparison | rows of 525 |
|---|---|
| merge `704e5efc5` vs master `db832c892` (= the signed manifest) | **525** |
| merge `704e5efc5` vs rung-2 tip `f5dc50c6b` (rung 1's lanes moving rows on the census line) | **101** |
| run B's re-derived tree vs `704e5efc5` (the prose-leaf re-derive) | **0** (display leaves; the generator golden does not see them) |

## 4. Strict types and registers at the merge commit (listed, not cured)

| check | result |
|---|---|
| `npm run typecheck:domain:strict` | **green**: 1,113 errors, ceiling 1,113 |
| `npm run typecheck:ratchet` | **green**: 167, ceiling 167 |
| `tests/domain/facts/declarationRegisters.test.js` | **2 red** at `704e5efc5` ("no pool's undeclared count rose…": e.g. `DS-GEN-3::foodSecurity.label: Deficit × Active Famine: 4`; "every pinned pool is still {crisis-scoped}"); **green** on run B's re-derived tree: same cause as §2 |
| `node scripts/wiring-census.mjs --dry` | STALE: 709 rows, 111,606 bytes, stamp + 7 stamped `stateProse/*` files (rung 1's side of the register) |
| `node scripts/generate-dossier-state-prose.mjs --check` | exit 1: refuses on the stale census (its guard `assertCensusCurrent`) |
| after census → prose re-derive (scratch) | prose `--check` exit 0 (68 blocks / 2,342 variants); wiring `--check` STILL stale by **8 rows / 1 byte** (`DS-DEF-1 :: strategic value LOW`, four DS-DEF-2 rows, `DS-DEF-11 :: WALLED-QUIET`, …): the census reads the leaves it feeds, so phase 2's chain is census → prose → census (→ prose `--check`) to a fixed point |
| `tests/domain/warFaithStateProseDesk.test.js` | **2 red on both trees**: "nine blocks, 138 pools, 418 authored variants" expects 430 (rung 1's pin; the census line pinned 418) and the leaf holds **433** (both sides' authored variants); "only the wall-variant pools partition, only by walls…" false. A pin re-key owed by the composition (both sides' variants), phase 2's — not touched here |

## 5. For phase 2 (if CONTINUE)

1. The door chain first: wiring census → prose → census to its fixed point; then the registers' test, the prose `--check`, the warFaith pins (re-keyed by cause: the union's variant count).
2. The generator golden: one record per moving SURFACE at the tip naming the 33 causes above with their own-lineage rows (option (b)); the merge's 525 vs the signed manifest, of which 101 are rung 1 composed on the census line; A7's pin restated.
3. The owner's row on `dossierConnectives.generated.js`'s ceiling (04:43 ruling) as briefed.

Scratch (not committed): the hasher, driver, 203 hash files and both 1,000s' artifacts live in this seat's scratchpad and die with its container; the method above reproduces them.
