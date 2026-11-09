# ALLEGIANCE-CAR4 — the goals rebuilt: goals by families at the seam's end, the keyed intent, the law's pursuit, the uncanny rarity, and the written pools wired (2026-11-08, worked 2026-11-09)

Seat: ALLEGIANCE-CAR4 (session `session_01FbPLbccUzaWmQYhp6feW9L`), a build seat and child of the cloud chair (`session_01FbPLbejcfwX5nii12VM673`), under the owner's full delegation. Brief: `docs/allegiance/BRIEF-ALLEGIANCE-CAR4-2026-11-08.md` on `lane/chair-2026-11-08`, binding in every line. Design: `ALLEGIANCE_DESIGN_2026-11-08.md` §1.6, §2 A9, §3.5, §3.6, §4 I-8/I-9/I-10/I-11/I-13, §6, §10 row 4, J-14/J-15/J-16. Code is cited as `path :: symbol`. Figures are **CONFIRMED** (read from the named command's output) unless marked **PLAUSIBLE**.

## 0. The base and the components

- Cut from car 2's final tip `46715e751` (verified: `git rev-parse` = `46715e751f04…`).
- **COMPONENTS, by merge** (the train brief §0.2; two plain merge commits):
  - `71678841a` — `origin/lane/write-goals-2026-11-08` at `82796628e`: `src/data/people/goalFamilies.js` (524 goal lines — 464 of §6.6 plus the 60 UNCANNY — in 1,080 source lines), its test (21 arms), the writer's record. Blob-equal to the lane.
  - `f6209c0c5` — `origin/lane/write-people-3-2026-11-08` at `5ee39a56c` (carrying WRITE-PEOPLE-2's `ac6c44316`): `src/data/people/titleSecretsPresentations.js` (147 titles × 3 secrets + 3 presentations), its pin, both writers' records. Blob-equal to the lane.
  - The roster through its door at each merge: `dated` 162 → 163 → 165 (WRITE-PEOPLE-3's record was born uncounted on its lane; the walker's own arm measured 165).
- **The base's reds**: the full vitest run in a clean worktree of `f6209c0c5` (`--reporter=json`): **37,805 tests, 77 failed** (82 lines with the file-level reds; kept in the scratch `base-reds.txt`). A clean run skips `tests/build`'s byte arms (no `dist/`); the base's worker bundle, built in that worktree, measures **1,769,418 B against the ceiling 1,735,881** — over at the base already (§7).

## 1. The measures first (brief §2 item 1), on the soak 1,000

Instrument: a scratch script births `soak1k-0…999` through `scripts/audit/soak-review/corpus.mjs :: birth` (`ensureLaws()` first), four workers, 0 errors; the same script at the base and the tip; the referee's repetition figure is `scripts/audit/soak-review/prose.mjs :: pairwiseRepeat` over each town's goal skeletons (`skeletonOf`, names replaced).

| measure | base `f6209c0c5` | tip | design band (§5) | verdict |
|---|---|---|---|---|
| cards with no goal | **15,687 of 29,043 (54.0%)** | **23 (0.08%)** | ≤ 2% | inside — the 23 are exactly the crisis-minted temporary cards (`steps/resolveCrisisCast.js`, step 23, after the seam), goalless at the base too |
| distinct short goals | 307 | **13,754** | ≥ 3,000 | inside |
| the ten most-used lines' share | 33.9% | 5.3% | — | — |
| goal-frame repetition (pairwise, all / same tier) | 0.274 / 0.396 | **0.065 / 0.066** | — | the referee's figure falls six-fold |
| lines in more than 2% of a tier's towns | 490 | 1,234 | none | **outside** — a question (§8 item 1): the frames (PERSONALITY's 96 slotless lines; TIES' lines once the name is a skeleton) recur because every card now has a goal |

Per tier, the share with no goal at the base: thorp 3.4% · hamlet 4.6% · village 21.7% · town 37.5% · city 57.5% · metropolis 64.3%; at the tip 0 in every tier but the temporary cards (thorp 10, hamlet 6, village 7).

**What the record supports** (the design §0.7 table, re-measured: the share of cards for which the family has at least one fillable, admitted line, SHORT vantage, nothing held — draw-free; the facts are the same at the base, A9 is the last writer):

| tier | RANK | POWER | INSTITUTION | SUPPLY | TIES | PERSONALITY | ALLEGIANCE | CRISIS |
|---|---|---|---|---|---|---|---|---|
| thorp | 62.5 | 11.1 | 90.4 | 1.1 | 73.9 | 100 | 0 | 20.4 |
| hamlet | 79.8 | 18.5 | 84.3 | 39.4 | 94.5 | 100 | 1.3 | 12.1 |
| village | 75.2 | 55.7 | 92.1 | 21.5 | 99.6 | 100 | 1.0 | 11.3 |
| town | 87.0 | 77.6 | 97.9 | 47.7 | 98.5 | 100 | 5.1 | 12.5 |
| city | 89.8 | 79.4 | 99.0 | 45.9 | 97.2 | 100 | 9.9 | 10.9 |
| metropolis | 90.1 | 78.4 | 98.3 | 46.2 | 97.0 | 100 | 11.1 | 10.5 |

**Cards whose record supports no TIES sub-kind: 833 of 29,020** (thorps' lone faces, mostly). They draw from the families they do support; no tie is forced into a cell. The chair's table `TIE_TYPE_TO_GOAL_SUBKIND` reaches political, respect and patron_client (WRITE-GOALS §5 item 4's 28%); the covert handler tie is ALLEGIANCE's, never a TIES goal.

## 2. The causes, each with its commit

| commit | what |
|---|---|
| `03ff59084` CAUSE 1 | THE GOALS REBUILT: `src/generators/people/goals.js` (`dealGoals`, `GOAL_FAMILY_TUNING`, `LAW_PURSUIT_TUNING`, the receipt), A9 at the seam's end, the `lawEnforcement` mark, the catalog keys, the veil test extended, `goals.test.js` |
| `eabc93dfe` CAUSE 2 | ITEM 15: `poolMap.js :: titleLinesFor`; the 147 titles' secrets and presentations by title |
| `0a18ff311` CAUSE 3 | the telemetry fingerprint, shape 2 (no generator move) |
| `34ab636a7`, `70f08597d`, `e84071544`, `fcc77e526`, `ced60375a`, `e47e96415`, `9d293639b` | registers through their doors (§6) |
| `ce9b067ca`, `622f80120`, `dd1800956` (the register seat, this car's subagent) | the observed-shape rung 37; writer reach re-frozen (§6) |
| `396b793d3` … `4e2ab3b98` (the pin seat, this car's subagent) | the ten pins that read the retired draws, re-keyed by identity and cause (§10) |

### 2.1 How A9 draws (design §6.2; the receipt names each step)

Each card draws on its own keyed fork `people-goals::<card id>` off the seam's stream. In order:
1. **The law's pursuit** — a law face (its house carries `lawEnforcement`) with a real target pool rolls `pWarrant` (an OPEN crim-house face), else `pSuspicion` (a hidden allegiance), by §3.5's formulas; the target is drawn by `exposure × importance`. Never itself, never a card of its own powers; a corrupt enforcer never names its own allegiance's house or power, nor a fellow agent of its guild (I-8).
2. **The UNCANNY roll** — only where `domain/facts/magic.js :: magicOf(settlement).functions`; `perCard[tier]`; at most `capPerSettlement` per town; the five kinds evenly among those that fill.
3. **The SHORT draw** — `w = base × fit` over the families with a candidate line (draw-free gates), one weighted pick; then the sub-kind evenly; then the line evenly.
4. **The LONG draw** — the same, never SHORT's family. A law face whose SHORT roll did not land may draw a LONG pursuit (its heaviest target, draw-free).
5. **The floor** — if every family's lines are held, the card's own cluster's first line (counted in the receipt as `floor`).

A line is a candidate when every slot fills from the record (WRITE-GOALS §6's rules; the `{house}` noun table `PERSON_HOUSE_PLACE` bound in `goals.js`), its `needs` are admitted by the record's facts, and its filled text is not held by another card (REVIEW-INTAKE-4). Only the DRAWN line is noted on the presumption ledger (`cert:false-presumption` reads what the card prints, not the candidates).

## 3. The family shares per tier (the §5 band; % of dealt cards)

SHORT:

| tier | RANK | POWER | INSTITUTION | SUPPLY | TIES | PERSONALITY | ALLEGIANCE | CRISIS | UNCANNY |
|---|---|---|---|---|---|---|---|---|---|
| thorp | 16.8 | 1.1 | 33.6 | 0.7 | 21.8 | 19.3 | 0 | 6.1 | 0.7 |
| hamlet | 19.4 | 2.0 | 23.0 | 9.8 | 25.0 | 16.4 | 1.2 | 3.1 | 0.2 |
| village | 19.5 | 9.6 | 21.7 | 5.0 | 25.7 | 14.6 | 0.7 | 3.0 | 0.2 |
| town | 19.8 | 11.3 | 19.8 | 11.1 | 20.1 | 11.8 | 3.4 | 2.4 | 0.3 |
| city | 18.0 | 10.3 | 20.9 | 10.0 | 21.0 | 11.8 | 6.4 | 1.1 | 0.6 |
| metropolis | 17.6 | 10.2 | 20.8 | 9.7 | 20.7 | 12.5 | 7.0 | 0.9 | 0.6 |

LONG:

| tier | RANK | POWER | INSTITUTION | SUPPLY | TIES | PERSONALITY | ALLEGIANCE | CRISIS |
|---|---|---|---|---|---|---|---|---|
| thorp | 16.1 | 3.2 | 23.9 | 0 | 20.0 | 31.8 | 0 | 5.0 |
| hamlet | 20.4 | 3.6 | 18.5 | 8.8 | 23.7 | 22.4 | 0.2 | 2.5 |
| village | 18.1 | 11.2 | 22.9 | 5.7 | 22.7 | 17.4 | 0.1 | 1.8 |
| town | 17.8 | 12.2 | 21.8 | 10.4 | 20.7 | 15.6 | 0.6 | 0.9 |
| city | 18.7 | 11.2 | 22.0 | 10.1 | 21.2 | 15.3 | 1.3 | 0.3 |
| metropolis | 18.6 | 10.6 | 22.7 | 9.4 | 21.6 | 15.6 | 1.2 | 0.3 |

The §6.2 expectation reads true: no family dominates, PERSONALITY is the floor (its ×0.6 keeps it a tenth to a third of the draws, highest in the thorp where the record supports least), ALLEGIANCE rises with the agents (tier by tier, as the corruption does). The intent keys reached: 20 of the extended catalogue (`answer_the_uncanny, collect_debt, consolidate_power, control_institution, escape_patron, expand_influence, expand_trade_house, indulge_trait, keep_agent, mobilize_defenses, protect_ally, prove_allegiance, pursue_warrant, repay_debt, restore_order, secure_office, secure_supply, serve_patron, settle_rivalry, survive_crisis`).

**The law's pursuit** (§5's row): 1,563 law faces. WARRANT on **462 of 1,187 (38.9%)** law faces in towns with an open criminal house — **above the 15–35% band by 3.9 points, a question for the owner's dial** (§8 item 2); SUSPICION on **178 of 951 (18.7%)** in towns with an agent — inside 5–20%; **0 of 376** where neither stands — inside. 100 law faces carry a LONG pursuit.

## 4. THE UNCANNY TABLE (the owner's word: magic on only as the gate; rare; scaling with size)

| tier | towns | magic-on towns | towns with ≥ 1 uncanny goal | cards | kinds |
|---|---|---|---|---|---|
| thorp | 167 | 85 | **2** (1.2%) | 2 | bargain 1, omen 1 |
| hamlet | 167 | 85 | **1** (0.6%) | 1 | omen 1 |
| village | 167 | 79 | **3** (1.8%) | 3 | haunting, components, bargain |
| town | 167 | 78 | **10** (6.0%) | 11 | haunting 2, omen 2, components 3, bargain 4 |
| city | 166 | 88 | **43** (25.9%) | 55 | components 12, commission 10, bargain 10, haunting 10, omen 13 |
| metropolis | 166 | 81 | **58** (34.9%) | 81 | bargain 21, commission 19, haunting 15, components 12, omen 14 |

0 where magic does not function (executed: `goals.test.js`, the forced-roll arm deals the cap with magic on and 0 with it off). A thorp or hamlet holds one in about one world in a hundred; a village rarely; a town sometimes; a city or metropolis often one or two (the cap, 2). The five kinds land evenly within the family. `GOAL_FAMILY_TUNING.uncanny` is a DRAFT dial for the owner's veto: `perCard` thorp 0.003 · hamlet 0.004 · village 0.006 · town 0.008 · city 0.011 · metropolis 0.013, `capPerSettlement` 2, `vantage` short.

## 5. The deltas per cause (UNSIGNED; for MERGE-TRAIN's signing — nothing re-recorded here)

Each stage built with `scripts/audit/landing-stage.sh build` and measured stage to stage with `landing-stage.sh measure` (clean stages of each commit; the previous stage as the base):

| cause commit | gm /525 | fence /360 | herald | prose /1,050 | witness | pdf /18 |
|---|---|---|---|---|---|---|
| `03ff59084` the goals rebuilt (vs `f6209c0c5`) | **525** (every row) | **360** (every row) | 0 (448 rows) | **168** | 0 (8) | 0 |
| `eabc93dfe` item 15 (vs `03ff59084`) | **525** | **360** | 0 | 0 | 0 | 0 |
| `34ab636a7` … the tip's register commits (vs `eabc93dfe`) | 0 | 0 | 0 | 0 | 0 | 0 |

The blast is TOTAL as the design foresaw (every card's goal; item 15 every titled face's secret and presentation). The golden suites (`generatorGoldenMaster`, `espionageDormancyFence`, `dossierProseManifest`, …) are red at the base and the tip alike by their pending re-records; this lane hand-edits none.

## 6. The registers, each through its door

- **The goods consumer roster** (`src/domain/goods.schema.js`): `goals.js` R | l | none | member (`34ab636a7`).
- **The size ratchet**: `npcGenerator.js` 1192 → 942 effective lines, re-keyed by cause with its `_note` (the role-goal draw left the file).
- **The tuning register**: `goals.js#GOAL_FAMILY_TUNING`, `#LAW_PURSUIT_TUNING` born DRAFT rows; the inventory refrozen by the ritual at a clean tip, verified 76/76.
- **The flavor census** A7: the stress override bag's reader moved with its cause (8 → 7 occurrences).
- **The anchor walker**: this car's seven negatives anchored.
- **Citations** (rule 32): four drifted line citations of `npcGenerator.js` re-addressed to `:: generateNPCs` (`fcc77e526`).
- **The holder census** re-taken by its writer (`ced60375a`, rows 0, the producer index 1310 → 1311).
- **The edge-shared bundles** rebuilt (`e47e96415`, engine sourceHash `2e0998d8d7980c1f` → `c1e5a2060003cda4`, 349 inputs; 955/957 edge tests).
- **The landing fixture** re-emitted at `lf-033` (its two shown goals; receipts unchanged).
- **The rename ledgers** (in cause 1): `factionRename.js` (goal.long prose; the power-kind intent targets as keys, a dotted parent), `institutionRename.js` (the house-kind targets; the exact-row pin 39 → 41), `goal.short/long` declared non-cascaded for a person rename (prose policy, owner-gated).
- **The observed-shape rung 37** (`ce9b067ca` act 1, `622f80120` act 2; review `docs/allegiance/osr-rung37-goals-review.json`): NEW 8 · GONE 19 · DECREASED 1 · SAME 1,514, each bisected (six scans: the parent `f6209c0c5` equals the schema-36 register; `eabc93dfe` and `34ab636a7` move nothing). NEW: 7 in `envoyEncounter.js` (cause 1: the envoy's own `intent` records now ground to the goal's `intent` shape) and 1 in `structuralFingerprint.js` (cause 3). GONE: 3 in `npcGenerator.js`, a lawful repair (the retired goal draw's reads gone; `_government` 3 → 1); **16 retired as UNCURED INSTRUMENT EROSION, the rung-32 precedent — a judgment call for the chair's veto**: 8 `facets` rows in `worldPulse/warSeatBooks.js` now also bind to the goals' `short` shape, and 8 `merchant` rows in `facts/drawDeclared.js` / `facts/factVocabulary.js` lost their binding when cause 1 moved the stress-override table; every one of the 16 reads still stands in source, none tagged, none class (a); curing them is a corpus or detector change, not this car's. The freeze: 2,177 findings · 1,523 identities · 428 files; bank 76/50.
- **Writer reach** re-frozen through its shrink-only door (`dd1800956`, `--write`): cohort 1,418 → 1,418, 0 dark, 0 stale, nothing folded; the goals add 13 judged identities (12,233 → 12,246, lit 609 → 610). Both walkers + the four observed-shape suites 227/227.
- **The fork census**: `people-goals` joins the coherence tail's labels (`059ea4b4f`, retired under a held roster); the hash channel's external fnv1a32 callers 14 → 15 (`b95d667fb`, traced caller by caller: both causes shift the birth stream, one card's `power` 1 → 2 and a tie draws a new archetype). The fork census's A1 control-row hash waits on the golden re-record (MERGE-TRAIN).

## 7. THE BYTES (STOP 3, reported to the chair)

The generation worker bundle: base `f6209c0c5` **1,769,418 B** (already +33,537 over `WORKER_BUNDLE_CEILING_BYTES` 1,735,881 — a base red a dist-less clean run cannot see); tip **1,970,510 B** — this car adds **+201,092 B**, the two writers' data files now shipped in the worker (`goalFamilies.js`, `titleSecretsPresentations.js`). A rise is the owner's: the ceiling is untouched on this lane and the bytes are recorded **OWED**, attributed to the owner's content (the chair's ruling on STOP 3: MERGE-TRAIN re-records the worker ceiling once at its final tip, by car).

The chair's two measures (no build): (a) **gzip** (the user pays gzip): the worker **566,965 B at the base, 630,311 B at the tip (+63,346)**; the two tables minified alone (esbuild `--minify`) — `goalFamilies.js` **45,319 B, 13,881 B gzip**; `titleSecretsPresentations.js` **150,003 B, 46,587 B gzip** — together about 60 KB of the 63 KB gzip rise, the rest the wiring. (b) **Lazy?** `goalFamilies.js`: **no** — A9 reads it synchronously inside the synchronous pipeline (`generateCoherence`), so a lazy load needs an async seam in the generator. `titleSecretsPresentations.js`: **no** for the same reason (`generateSingleNPC` draws from it at birth); either could only be split into a second chunk the worker ENTRY awaits before its first request, which moves the bytes to a second fetch, not out of the user's total. The buy-back, if any, is the train's or a post-train lane's.

## 8. Judgment calls (each the default applied; vetoable)

1. **The 2% line band.** "No line in more than 2% of a tier's towns" fails on frames: the writers' slotless lines (PERSONALITY 96, SUPPLY isolation) and the TIES / RANK lines whose only slot is a name recur once every card holds a goal. Not tuned; the band is a question for the owner (more variants, or the band read on filled text).
2. **The warrant band** (38.9% against 15–35%): the dial is the owner's; `enfStrength` reads the enforcer's strongest power (the garrison's Military/Guard often 25–30 points). Not tuned.
3. **The law face's LONG pursuit**: drawn only where the SHORT roll did not land, its heaviest target, draw-free.
4. **INSTITUTION and SUPPLY skip a face in no power** (the musician, the fortune teller, the dragon): they keep no books.
5. **`takeover` and `expansion` gated to the Crafts, Economy and Entertainment shelves** (WRITE-GOALS §5 item 6's PLAUSIBLE).
6. **A chain or a dependency naming another tier's spelling of a house** resolves through the catalogue family to the roster's own house (I-11: a target never names a house the roster lacks).
7. **The personality cluster** keys on the flaw, else the temperament, else the modifier (WRITE-GOALS §4 item 6's default).
8. **`intent` carries `kind`** (the sub-kind) beside `family, key, target` — for the DM view and the simulation; the design's shape plus one field.
9. **The CRISIS gate** reads the card's role bucket (today's override rule, verbatim) — the role is the title since M-1b, so this is the one place a title reaches a goal, and only through the stress table's own buckets (J-16 noted).
10. **The held refusal** applies to LONG goals too (a separate held set).
11. **The fingerprint** counts the fallback titles through `TITLE_ORDER` (the data module, counted, never copied).

## 9. The chair's rulings applied (2026-11-09, on this car's STOPs)

- STOP 1: A9 is one call after `drawTies` in `generateCoherence` AND one line in `generateSettlementPipeline.js :: regenNPCsPipeline` (preserved keepers kept) — **the minimal wiring outside the manifest**; the structure pass's top-N template goal is overwritten by A9 (position and constraint kept; the seat-goal pool retired); the pins reading the retired draws re-keyed in this car's own commit.
- STOP 2: (a) one line in `representatives.js` passing `title` — **the minimal wiring outside the manifest**; (b) the eleven `NPC_AIMS` rows in `worldPulse/heraldDeeds.js`, data, **PROPOSED LINES FOR THE OWNER'S VETO**: secure_supply "keep their supplies coming" · repay_debt "pay off what they owe" · collect_debt "collect what they are owed" · protect_ally "stand by someone close to them" · serve_patron "serve the people they answer to" · escape_patron "get free of the people they answer to" · keep_agent "keep someone in line" · pursue_warrant "bring someone to justice" · prove_allegiance "prove who someone really answers to" · indulge_trait "live as they please" · answer_the_uncanny "deal with something uncanny"; (c) the eleventh key.
- **AMENDMENT to the design §6.3 (2026-11-09, ALLEGIANCE-CAR4, the chair's ruling on STOP 2c):** the new keys are the ten of §6.3 **and `answer_the_uncanny`**, the UNCANNY family's door (the owner's own addition of 2026-11-08); every key with `{ onAchieve, onFail, drive }` as data in `NPC_GOAL_CATALOG`.

## 10. The proof

- **The full vitest run** at `fcc77e526` in a clean worktree: 37,822 tests, 117 failed, against the base's 37,805 tests and 77 failed (82 lines, `base-reds.txt`). One base red is green at the tip (`regenPreservesUserCanon`: no secret names a displaced character). The tip-only reds, every one cured after that run or named:
  - cured by the register commits that followed it: the engine bundle replay ×4, engineServiceCore, the edge-shared freshness and reproducibility ×7 (`e47e96415`), the landing fixture ×2 (`9d293639b`), the observed-shape walker ×3 and writer reach ×4 (`622f80120`, `dd1800956`), the holder census ×2 (`ced60375a`);
  - cured by the pin seat, re-keyed by identity and cause (never loosened): stress-type registration (`396b793d3`: STRESS_GOALS is the siege rows by design), the allegiance integration's agent goal (`e6a096eb2`: the ALLEGIANCE family's), crisis-blind soak1k-1803 (`f1b2b441c`), the fork census A6 (`b95d667fb`), the held-roster A2 (`059ea4b4f`), the crime-signal writers (`a6ead1d4d`: item 15's title secrets do NOT bypass the substitution; the secret row re-pointed 52 → 255), the certification cohort 59 → 52 (`6e897d6f7`: the seven that left held only the retired role goal "Found an institution (a hospital…)"), self-vouch soak1k-178 (`a92dc1ed1`), terrain pools soak1k-921 (`7b298e7af`), the edit-corpus A8 [21, 12] → [21, 14] (`4e2ab3b98`);
  - **STOP 4, RULED and cured** (`c41147a11`, 4 arms of `tests/data/foundingSeeds.probe.test.js`): the showcase's receipt 3 read the Thieves' Guild head's structural condition goal, which A9 retires; the chair ruled (a)+(c) together — `masterOf` re-keyed to the master's structural row (head, governance_fractured, the dominant criminal position), the fact renamed 'master placed', and `src/data/foundingSeeds.js`'s the-contested-crown re-said in the chair's words (the owner's copy, vetoable). The chair names the gap for a post-deploy packet: CONDITION, the structural rows as A9's ninth family;
  - red at the base and the tip alike: the edit-corpus A3 / A7 (the base reads 328 and [668, 264, 2100] on its own archive; this car's share +0 and +2/+2/+8), the golden suites and the held-roster A1 / fork-census A1 (the pending re-records).
- **The final run** at the composed tip: `4e2ab3b98` (every code and register commit; the later commits are this record and STOP 4's data/test cure), a clean worktree with a FRESH `vite build` (so `tests/build`'s byte arms run): **37,822 tests, 81 failed** against the base's 77. Tip-only, by name, and nothing else: the worker bundle's ceiling (§7, OWED — over at the base too, which a dist-less base run cannot see) and the four foundingSeeds arms, cured after it by STOP 4's ruling in the next commit (24/24 there). Base-only: `regenPreservesUserCanon` (green at the tip). So **the tip's reds = the base's 77 − 1 + the bytes owed**, every golden suite's row red at both by its pending re-record.
- `npx eslint` on every JS file the lane touched (40; the generated edge bundles excluded): exit 0. `tsc -p tsconfig.full.json`: no new error in a touched file (the 11 in `npcGenerator.js`, `publicSafe.js`, `representatives.js` are the base's own).
- `npm run build`: exit 0 (the worker bundle's bytes in §7).
- **The soak 1,000** (`node scripts/audit/soak-review.mjs --count 1000 --workers 4`, each in a clean worktree): base `f6209c0c5` **CLIMB**, battery-would-not-vouch 698 · reader:tension-memory 61 · A-09 4 · reader:hook-pools 3, 0 errors; tip **CLIMB**, battery-would-not-vouch **653** · 61 · 4 · 3, 0 errors. cert and coh 0 at both, `coh:tier-noun` 0. The battery's 45 fewer non-vouching towns are the retired role goal's false presumptions gone.
- **The invariants, red-first then green** (`tests/generators/people/goals.test.js`, 16 arms): I-8 / I-9 (a planted corrupt enforcer's warrant on its own guild's house, a suspicion on a clean card, a self-target — each reds the checker), I-11 (every target resolves), I-13 (removing a card leaves every card that read nothing of it byte-identical), the uncanny gate executed (the cap with magic on, 0 off), J-14 (the mark on exactly the six families, never the courthouse), J-16 (the module reads no title), item 15 (a table title draws its own lines, a mint keeps its category, a fully-held title falls back).
- **The veil walk** (I-10 extended, `tests/security/allegianceVeil.pglite.test.js`, 7/7): on six generated criminal / organized / infiltrated cities, the generator's own WARRANT and SUSPICION goals, their `intent` and their targets reach 0 times the client projection, the SQL projection and the gallery payload; the control finds them on the raw records.
- **Two notes from the pin seat, for the chair** (not this car's defects to cure here): a power mint's secret can still name "thieves' guild" in a crime-less place (3 at the base, 1 at the tip); twelve landlocked metropolises print an A9 goal naming their "airship docking" house (a true fact of the roster, high magic).

## 11. The seams for MERGE-TRAIN

- `narrativeGenerator.js :: enrichNpcCoherence`: this car REMOVED the `CORRUPT_SHORT_GOAL` rewrite block between `dealAllegiances` and `rankPowers` (car 3's patronage lines, if any, compose after A3/A4 as before). `narrativeGenerator.js :: generateCoherence`: A9 (`dealGoals`) sits after `drawTies` and before `withTies`; `npcs` returned is `goaledNpcs`.
- `allegiance.js :: CORRUPT_SHORT_GOAL` is now read by no generator (left for car 1's owner to retire).
- `representatives.js`: one argument added to the `generateSingleNPC` call (`title`).

## 12. CONFIRMED vs PLAUSIBLE

CONFIRMED: every figure in §0, §1, §3–§5 and §7, each read from the named command's output (the scratch instrument on the 1,000, 0 errors; the stages; the builds). PLAUSIBLE: §8 item 2's reading of why the warrant share sits above its band (argued from the formula, not bisected); the 2% band's cause (read from the top frames, not counted per family).
