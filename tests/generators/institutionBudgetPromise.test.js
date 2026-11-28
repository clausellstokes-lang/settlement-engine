/**
 * X-46 car 3 — THE PROMISE (docs/DESIGN_X46_SCALE_TRAIN.md §2, §4 "The mechanism").
 *
 * The institution budget scales CHANCES only: the density factor is computed once from the
 * population before the first draw, and the catalogue's draw order and the number of draws are
 * the catalogue's own. So with the factor forced to 1.0 every seed must be byte-identical to the
 * tip the budget was built on (8cc245db0, X-46 car 1 U4; on the composed window, 79c4423). The sixty
 * record hashes below were read at that tip, by this file, before a line of the budget existed.
 *
 * The cells are the certification matrix's first sixty (`configForIndex`: ten per tier, every
 * culture, terrain, route, threat, content profile and magic scenario it cycles), born the app's
 * way (`birthConfig` after `loadGenerationLawPayloads`), seed `x46-promise-<i>`.
 */
import { createHash } from 'node:crypto';
import { beforeAll, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/data/institutionBudget.js', async (importOriginal) => {
  const actual = /** @type {Record<string, unknown>} */ (await importOriginal());
  return { ...actual, densityFactor: () => 1 };
});

import { configForIndex } from '../../scripts/audit/generation-certification-soak.mjs';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

// Re-keyed by identity 2026-11-04 (rung-1 pins, unit 1): the sixty were read at the budget's own
// base 8cc245db0; composed onto the window branch, "the tip before the budget" is 79c4423 (the
// window with x46-1b composed, x46-3 not yet), whose generation the sibling lanes moved (x46-2's
// renames, the dragon licence, the tailed metropolis roll). Re-read at 79c4423 by this file's own
// loop with no budget module present; the composed tip at d ≡ 1 matches all sixty.
// RE-KEYED again 2026-11-04 (window branch, the chair's I7 (2)): RUNG1-TRUTH's generator changes (the derived
// hooks, the crisis tier noun, the criminal structure, the named stress factions) moved the sixty, which no longer
// have a pre-budget tip to read on the window branch; re-captured by this file's own loop at the composed tip
// (6ca454d2) with the factor forced to 1.0, twice and equal. The arm now guards the d = 1 path against drift.
// RE-KEYED BY IDENTITY 2026-11-06 (LANDING-7 lane E, the chair's ruling R-E12, §934.105): 56 of 60 moved (0, 13, 19 and
// 42 held), and the promise STANDS UNDER F6'S LAW. F6 (record 22, docs/RUNG1B_F6_BUDGET_FLOOR_2026-11-04.md) changed only
// how d is computed (the target gives way: anchor − R − X over the scalable rows); its new code reaches the draw only through
// `densityFactor`, which this file forces to 1, and X is an expectation read without a draw. MEASURED, this file's own loop
// per first-parent stage from 6ca454d2b (0 moved): F5 INSTRUMENTS 7e28a6331 0 → 5, F6 BUDGET-FLOOR 6d84aa834 5 → 5 (moves
// NONE), F1 DEFENCE-WORDS 5e9ffb220 5 → 28, F3 FOOD-WORDS db8ce5da8 28 → 38, F4 CRIME-SIGNAL ba9fde402 38 → 56, and no later
// stage to this branch's tip. The movers are the rung-1B word and instrument lanes' generator changes on the d = 1 path, not
// the budget. Re-captured by this file's own loop at 6fb0de59f with the factor forced to 1.0, twice and equal.
// RE-KEYED BY IDENTITY 2026-11-06 (LANDING-9, the rung-1 landing at 3c62e8ef5): 13 of 60 moved, by four signed records,
// none of them the budget. MEASURED, this file's own loop per first-parent stage from 3d8a74e4b (0 moved), each step's
// mover isolated by reverse-applying its other commits' src/ diffs: lane D b37bbf395 moves 24 (bfd70d809, the food floor
// that record 34 supersedes); lane F1 3da1104da moves 8, 20, 44 (59237b232, the Village watch's texts, record 32); lane G
// 64ad4fe47 moves 51, 53 (5d3f7b5cb, the vacant seat from its fact, record 33); lane H 18fd6b442 moves 6, 13, 24, 30, 31,
// 36, 49 (66b1407bd, the food per cent from the pounds, record 34) and 8, 14, 20, 44 (8e92c0440, the Village watch
// presumes no governor, record 35); 5f6d243b2 and every other step move none. Re-captured at 3c62e8ef5 with the factor
// forced to 1.0, twice and equal.
// RE-KEYED BY IDENTITY 2026-11-07 (WIRING-W0 cause 1, THE MIGRATION DIRECTION DECLARED ONCE, the chair's R-W7 (e); record
// docs/shift-records/2026-11-07-w0-01-migration-direction.json): 1 of 60 moved, 57 (c71c3f22a9a9ff75 → a9588a373c64d70f), a
// mass_migration place (its record gains stress[].direction and the config projection, the stability label names the one
// direction, the arrivals vignette and secret pool); not the budget. Measured by this file's own loop at 343bd4eec against
// its parent 76febf9b0 (0 moved there); re-captured with the factor forced to 1.0, twice and equal.
// RE-KEYED BY IDENTITY again at the lane tip (WIRING-W0 records 02-05: the import share, the food-source count and the
// legacy annotations dated at birth reach every record; not the budget): 60 of 60 moved. Re-captured by this file's own
// loop at 1dd31a377 with the factor forced to 1.0, twice and equal.
// RE-KEYED BY IDENTITY 2026-11-07 (LANDING-R2, the pool census composed on rung 1's final 1bff51c6d, §934.105): 60 of 60
// moved, none by the budget (densityFactor is still forced to 1). The cause is the census's generator changes on the d = 1
// path — the same 33 lane commits the generator golden's record names (docs/shift-records/2026-11-06-rung2-01-census-
// composed-generator-master.json, the chair's ruled exception: per-cause stages are unbuildable on this landing). MEASURED,
// this file's own loop: rung 1's final 1bff51c6d 0 moved (the file green there); the census side f5dc50c6b red; and the
// all-row mover on its own lineage, 73fa1a1e7 (reader-tonight-wants R11 unit 3, the 76 registry goals rewritten in the
// house register) against its parent 7f0632463, moves 60 of 60 by itself. Re-captured at the tip dd2aab21d with the factor
// forced to 1.0, twice and equal.
// RE-KEYED BY IDENTITY 2026-11-08, MERGE-CAR (the integration landing: records A and B, the rung-2 landing's merge and the
// people car's merge over the integration branch; docs/shift-records/2026-11-08-merge-car-a-rung2-composition.json and
// docs/shift-records/2026-11-08-merge-car-b-people-car-composition.json): 60 of 60 moved, none by the budget (densityFactor
// is still forced to 1). MEASURED, this file's own loop on git-archive trees, by stage: the car's side carried W0's sixty
// (c30a69cf2; the W0 lane tip eb4c508e1 reads them byte for byte), and the W0 lane's merge into the integration branch
// fc834a6bd (composed over review-intake's generator changes) already moves 60 of 60, as does the merge base 262e8b255, so
// the car's tip 373a2947b read red (base -> car moves 60 more). The rung-2 side carried LANDING-R2's sixty (captured at
// dd2aab21d, on the rung-2 lane), which the integration tip 7b3ffb6ee also reads red (base -> integration moves 60). The
// people car's merge 8dff691f3 moves 60 against either side; the merged tip 2c7437030 equals the merge (its post-merge src
// fixes move none). Re-captured at 2c7437030 with the factor forced to 1.0, twice and equal.
// THEN 3 of 60 moved by the car's seam cure b19740ab3 (MERGE-CAR: the car's birth seams carry `_government` into the
// goal draw, and crisisCast refuses a seat-house member as instigator), seeds 21 (dccc50cde44307e5 -> 463e8f7a3e88d12f),
// 27 (ee38718de1b929c9 -> 9057c386767a53ef) and 43 (a57cae4ca1a8eaf8 -> 20d12b33835a0846): measured by this file's own
// loop, 4c39885fc reads the sixty as captured at 2c7437030 and the tip 3f95e3484 moves exactly these three; between them only b19740ab3 touches generation (9fd906c23 is display-only,
// record C 3f95e3484 is fence-only). Re-captured at 3f95e3484 with the factor forced to 1.0, twice and equal.
// RE-KEYED BY IDENTITY 2026-11-10 (GREEN-TIP, the chair's ruling on the census's group (6)): 60 of 60 moved, none by the
// budget (densityFactor is still forced to 1). MEASURED, this file's own loop (an untracked probe reproducing it) at
// 8308f13f8 (the MERGE-CAR re-key, 0 moved) and every first-parent stage of 8308f13f8..bf14617ca touching src/, the
// helpers or scripts (73 stages, git-archive trees); the stages that moved a hash, with how many of the sixty each moved:
// W1 ECO ea0e269a9 (40), W2 DEF 82a4e2856 (54), W3 POW 1a160d599 (59), W4 PEOPLE 66c23bfea (47),
// W5 HIS e510409b1 (60), W7 HOOKS 501c97412 (60), FIX-FOOD-ISOLATION c6e8a4ad6 (10),
// FIX-PUBLIC-VEIL 7e65c7bec (60), MERGE-WAVE ruling (a) docks read bcf3e7f8a (5), ALLEGIANCE-CAR1 e5f88930b (60),
// ALLEGIANCE-CAR2 f51058995 (15), ALLEGIANCE-CAR3 c6ded8e3a (22), OWNER-WORDS-DOSSIER 5f6160284 (1),
// ALLEGIANCE-CAR4 824a8ce2f (60), SW-0 point fix ca15421ff (6), SW-2 INSTITUTIONS ef4645832 (47),
// SW-3 REALM-PROSE 1ef46ca30 (5), SW-5 CRISIS-VANTAGES a7770ecfe (45), SW-B2 FIRST-IMPRESSIONS 52da4542c (17),
// SW-B5 FRAMES 46e0121c2 (44), SW-B6 ECO-DEF-BLOCKS 8de6c4a1a (1), SW-7 POWER-SIDE a3062d919 (60),
// SW-B1 CONTRADICTIONS 0f2cb865c (43), SW-10 HOOKS 856de8427 (60), SW-6 CRISIS-SURFACES ac1442a3d (60),
// SW-8 RENAME-POWERS 56f3b2df7 (60), URBAN-FIX 17b814803 (52).
// Every stage is a lane merge with its own signed shift record under docs/shift-records/ (the movers inside each merge
// are not isolated: PLAUSIBLE per commit, CONFIRMED per stage). Re-captured at the green-tip lane over bf14617ca (whose
// generation is bf14617ca's byte for byte) with the factor forced to 1.0, twice and equal.
// RE-KEYED BY IDENTITY 2026-11-10 (RESIDUE, the chair's packet item 4, at the simulation batch's merged tip — STYLE-2-MERGE
// point 36, GREEN-TIP and PULSE-SITES): 3 of 60 moved, none by the budget (densityFactor is still forced to 1; no commit in
// bf14617ca..the tip or in either lane touches src/data/institutionBudget.js; with the factor planted at 1.25 all 60 move, so
// the pin is armed). MEASURED, this file's own loop (an untracked probe reproducing it) at bf14617ca (0 moved against the
// GREEN-TIP sixty) and at every first-parent stage of bf14617ca..90774f2fa touching src/ or the soak config: ONE stage moves,
// SW-9b-B 8e532a663 (point 27) — seeds 21 (79379bee35da9918 -> 7bee45ae807037d6), 52 (dd6681b153dad267 -> b50ff039d9ebf891) and 53 (8347fa12cbf96c74 -> 5e0de535fa6d748f); points 28-35 and
// the line's hygiene stages move none. Inside point 27, by merging each lane prefix onto its first parent: b23e4e91b (SW-9b-B
// row 2b, E-3: the small-name instigator says it speaks for the gaining power from a house it backs) moves exactly these three;
// the four lane commits before it move none. The batch itself (GREEN-TIP + PULSE-SITES over the line) moves none. Re-captured at
// the merged tip with the factor forced to 1.0, twice and equal.
// RE-KEYED BY IDENTITY 2026-11-12 (STYLE-2-MERGE-8): 37 of 60 moved, none by the budget (densityFactor still forced to 1),
// by the COHERENCE-QUARREL merge d4723749a (STYLE-2-MERGE point 42; lane/coherence-quarrel-2026-11-11 at 1c7b5786c, record docs/shift-records/2026-11-12-style-2-merge-42-coherence-quarrel.json: the quarrels' issues, stakes, descriptions and hooks, and the safety record's plot hooks); the line's tip decc7bf15 reads all sixty green, the merge these 37 red (the lane's own predicted 37).
// Re-captured at the merge with the factor forced to 1.0, this file's own loop (an untracked probe), twice and equal.
// RE-KEYED BY IDENTITY 2026-11-12 (STYLE-2-MERGE-8, point 43): 56 of 60 moved, none by the budget (densityFactor still
// forced to 1), by the COHERENCE-PRESUME merge f922124d0 (docs/shift-records/2026-11-12-style-2-merge-43-coherence-presume.json: a line names a thing the town does not have: the culture lines, the re-titled watch role and the ties it re-deals, the history and institution texts); the line before the merge reads all sixty green.
// Re-captured at the merge with the factor forced to 1.0, this file's own loop (an untracked probe), twice and equal.
// RE-KEYED BY IDENTITY 2026-11-12 (STYLE-2-MERGE-9, point 46): 50 of 60 moved, none by the budget (densityFactor still
// forced to 1), by the COHERENCE-POWERS merge 6aeaa4154 (docs/shift-records/2026-11-13-style-2-merge-46-coherence-powers.json: the dual hat re-deals the cast); the line before the merge reads all sixty green.
// Re-captured at the merge with the factor forced to 1.0, this file's own loop (an untracked probe), twice and equal.
// RE-KEYED BY IDENTITY 2026-11-13 (STYLE-2-MERGE-11, point 47): 60 of 60 moved, none by the budget (densityFactor still
// forced to 1), by the COHERENCE-AGREE merge 22cc9ef7d (docs/shift-records/2026-11-13-style-2-merge-47-coherence-agree.json: one fact, one answer: the resource roll's refused members refilled, the economy and defence read off the town's own record); the line before the merge reads all sixty green.
// Re-captured at the merge with the factor forced to 1.0, this file's own loop (an untracked probe), twice and equal.
// RE-KEYED BY IDENTITY 2026-11-13 (STYLE-2-MERGE-13, point 49): 1 of 60 moved, none by the budget (densityFactor still
// forced to 1), by the W2-B-DECLARE merge (lane/w2-b-declare-2026-11-12 at 5657a229c; its draft record's ONE generated
// cause, item 5, 1ae138b47: the church note reads the stored flag safetyProfile.flags.theocraticEconomy): seed 41
// (6fce6e3d180fc1be -> 0b896078cabcb3c9) gains one `power_economic` coherence note, its only moved leaves
// (.coherenceNotes.0: type, severity, tab, note); the line's tip 9e57f5023 reproduces the old hash. Red at the lane's own
// tip and base for the agreement lane's cause, so the lane could not see it. Re-captured at the merge, the probe and this loop.
// RE-KEYED BY IDENTITY 2026-11-14 (R2-CODE-B-7, the merge 0aa0cce00 of the line 976db5b19 into lane/r2-code-b-2026-11-13):
// 9 of 60 moved against the line's sixty, none by the budget (densityFactor still forced to 1; src/data/institutionBudget.js
// unchanged on both sides): seeds 2, 13, 20, 27, 36, 43, 48, 49, 51, by THIS LANE's declared generator moves (R2-CODE-B-4
// item 4, the crisis cast's reasons and the empty seat; R2-CODE-B-6 items 0 and 0b, the wartime summary), measured leaf by
// leaf against a frozen tree of the line's tip: `stress` 34 leaves and `stressors` 34 leaves in the nine, `npcs` 3 leaves in
// seeds 13, 43, 49; nothing else. Against the lane's own pin (c40da4ec6) all 60 moved, by the line's points 47-49.
// Re-captured at the merged tip e285c603f (whose generation is 0aa0cce00's: the commits after it are display only) with the
// factor forced to 1.0, this file's own loop (an untracked probe), twice and equal.
// RE-KEYED BY IDENTITY 2026-11-14 (JOIN-3, THE TRUE JOIN on lane/join-2026-11-14, nine lanes merged over the line 976db5b19):
// 60 of 60 moved against the pin (the r2-code-b lane's sixty, taken whole at the join), none by the budget (densityFactor still
// forced to 1; src/data/institutionBudget.js unchanged by every lane). MEASURED, this file's own loop (an untracked probe hashing
// each record and its leaves two levels down) at the line and at each lane's merged tip: the line reads its own sixty; a lane's
// tip moves, of the line's sixty: r3-code-c 28, r2-code-a 37, powers-follow-up 53, w2-fix-data 60, r2-code-b 9 (exactly its pin),
// coherence-upkeep 60; r3-tabs, w2-write and w2-c-leaves none. At the join all 60 move, and on every seed every moved leaf is a
// leaf that some lane moving that seed moves at its own tip: no seed and no leaf moved by the join alone. Each mover is a lane's
// DECLARED generation move (the generator golden's re-record in each lane's drafted shift record; the powers lane's draft names
// this pin among the digests its writers re-take). Re-captured at the joined tree e663b2b80 with the factor forced to 1.0, twice
// and equal.
// RE-KEYED BY IDENTITY 2026-11-15 (the close of the tail round, TAIL-CLOSE-DOORS-4; the owner's word, 2026-11-15 06:00 UTC, in
// the chair's chat; record docs/shift-records/2026-11-15-the-close-of-the-tail-round.json): 60 of 60 moved, none by the budget
// (densityFactor still forced to 1; src/data/institutionBudget.js untouched by the round), by the round's declared generation
// moves (the golden master re-recorded 525 of 525 under the same record: a face for every seat of power and the casts drawn
// after it, the data, upkeep and economy lanes' fields). Re-captured at the golden's tree 8c11f73ea with the factor forced to
// 1.0, this file's own loop (an untracked probe), twice and equal.
// RE-KEYED BY IDENTITY 2026-11-15 (the close of the round BAR2, BAR2-CLOSE-DOORS-2; the owner's word, 2026-11-15 20:27:16 UTC, in
// the chair's chat; record docs/shift-records/2026-11-15-the-close-of-the-round-bar2.json): 55 of 60 moved, none by the budget
// (densityFactor still forced to 1; src/data/institutionBudget.js untouched by the round), by the round's five builder branches'
// declared text cures; the stored sixty reproduce at 74ded1800 (60 of 60). FIELD-DIFFED by leaf path, text leaves only: tie
// descriptions and tensions, service rows, origin rows, house and faction descriptions, the people's positions, constraints,
// dealings and secret, the arrival scene, the foodways lines, the slavic social texture (534c29fac), the pressure, safety and guard
// lines, one income row, the validator's embattled-region reason (c1f9889ae, LB4) and the stability phrase (e36bd855e, PP11).
// Re-captured at the joined line's 1011a8a91 with the factor forced to 1.0, this file's own loop (an untracked probe), twice and equal.
// RE-KEYED BY IDENTITY 2026-11-16 (the close of the round BAR3, BAR3-CLOSE-DOORS-2; the owner's word, 2026-11-15 20:30:10 UTC, "Yes that one too", in the
// chair's chat; record docs/shift-records/2026-11-16-the-close-of-the-round-bar3.json): 56 of 60 moved by the round's declared cures; the stored sixty
// reproduce at 83fc14ad6 (60 of 60). FIELD-DIFFED by leaf path: text leaves (tie descriptions and tensions, the foodways lines, the people's dominant
// trait (P7a), the entrepot note, house, faction and origin rows, the arrival, the recent conflict, the drag, safety and guard lines, the pressure
// line, the prominent tie, the crisis summaries, hooks, viability notes and cast reasons (one the second repair seat's letter d, efdb3841d), two
// secrets, the viability issues, a history event) and ONE non-text leaf, declared: economicState.safetyProfile.flags.theocraticEconomy true -> false
// on seeds 29, 35 and 47, with the coherence note it drives withdrawn (BAR3-DEFECON 7a4b48a84, `settleTheocraticFlag`: its hand-back's table row
// `flags.theocraticEconomy` and `coherenceNotes`, the theocratic note); the budget module untouched. Re-captured on the doors' branch after the
// merge b46b26d92 with the factor forced to 1.0, this file's own loop (an untracked probe), twice and equal.
// RE-KEYED BY IDENTITY 2026-11-16 (the close of the round BAR4, BAR4-CLOSE-DOORS-2; the owner's words, 2026-11-16 08:55:14 UTC and 18:51:17 UTC, "Yes to
// plain yes for the example-town refresh.", in the chair's chat; record docs/shift-records/2026-11-16-the-close-of-the-round-bar4.json): 47 of 60 moved by
// the round's declared cures; the stored sixty reproduce at c4ac1ef84a (60 of 60). FIELD-DIFFED by leaf path: tie descriptions, a tension and its variant
// index (BAR4-PEOPLE, the repair seat's PD1 twin), the supply gaps with their entries in and out and one priority note (BAR4-RECORD), the foodways lines
// and six houses (BAR4-HOUSES), two secrets and four presentations (BAR4-PEOPLE), three guard lines (BAR4-SAFETY e52d5582, the guard's pay) and one
// conflict's hook twin (BAR4-SAFETY 2ee6f3a0), two history tensions and a power's description (BAR4-HISTORY), an income line and an outlook hook
// (BAR4-CORPUS-ECO); the budget module untouched. Re-captured on the doors' branch over Part 1's final tip 6483322cc (no byte under src/ moved since
// the capture) with the factor forced to 1.0, this file's own loop (an untracked probe), twice and equal.
// RE-KEYED BY IDENTITY 2026-11-18 (the close of the rounds BAR5 to BAR8, CLOSE-DOORS-2; the owner's word, 2026-11-18 03:03:46 UTC, "yes: refresh the stored
// reference files and open the pull request.", in the chair's chat; record docs/shift-records/2026-11-18-the-close-of-the-rounds-bar5-to-bar8.json): 57 of 60
// moved by the rounds' declared cures; the stored sixty reproduce at the last green corpus 0ac61b4b4 (60 of 60). FIELD-DIFFED by leaf path: the supply gaps,
// imports, need lists and priority notes (BAR5-CHAINS, BIRTH-1 to -3), the ties' tensions and lines (BAR5-THINGS, BAR6-PEOPLE, BAR7-LINES), the rare secrets
// (SECRETS-1), the crier's and the fish market's rows, arrivals, exports, chains, production, income, issues and traces (BAR6-RECORD), the foodways, the
// powers' descriptions (BAR6-POWERS), card twins and tempers (BAR5-POWERS, BAR6-PEOPLE), four houses' twins (BAR5-MARKS's siege twins, the supply story's), the
// history's tensions and character, two safety hooks and a crime line (BAR6-CRIME), a war's crown line (BAR7-LINES) and a pressure sentence; the budget module untouched since 0ac61b4b4. Re-captured at the frozen
// line 70e557d5b and again on the doors' branch over Part 1's final tip 0af60594a (the sixty equal) with the factor forced to 1.0, this file's own loop
// (an untracked probe), twice and equal.
// RE-KEYED BY IDENTITY 2026-11-19 (the last close before the deploy, LASTCLOSE-SIGN; the owner's word, 2026-11-18 about 19:07 UTC, "Yes to both", in the
// chair's chat; the chair's line SIGN 2026-11-19 01:04 UTC; record docs/shift-records/2026-11-18-the-last-close-points-54-to-70.json): 34 of 60 moved by the
// landed points' declared cures; the stored sixty reproduce at the first close's tip 0dee69e17 (60 of 60). MEASURED BY STEP, this file's own loop (an untracked
// probe, the factor forced to 1.0) at each of the seventeen first-parent landing commits over 0dee69e17 that touch src/: K-WATCH and K-POWERS (48, 49, 57) 12;
// K-PEOPLE and PEOPLE-2 (50, 58) 13; FAULTS-NEED (61) 4 (21, 35, 46, 53), re-moved by LAST-VARIETY (70) (the goals); FAULTS-PEOPLE (62) 5; FAULTS-BIRTH (63) 11
// and its follow-ups (68) 10; FAULTS-ROWS (65) 5; FAULTS-WATCH (66) 2; LAST-DECLARE (69) 4; no other step moves one (a seed may move at more than one step);
// the budget module untouched since 0dee69e17. Re-captured at a7a25bd39's tree with the factor forced to 1.0, this file's own loop, twice and equal.
const BEFORE = Object.freeze([
  '4d0898f640228682', // 0
  'ebb3bd6d0f9b9fa7', // 1
  '5bd448cab8295176', // 2
  'e957907cd7a3e660', // 3
  '8991e968b8c36cf6', // 4
  '3d8e681e3985a78e', // 5
  'c5498ec2b51948c1', // 6
  '4aea2e12af1c2547', // 7
  '41a67125c4a6b854', // 8
  'e4621f28a3d7bbe9', // 9
  'c88aef5b8fe2594b', // 10
  'bf28e6894faa1cc9', // 11
  'aca46be0b50e89f6', // 12
  '480a61630a44d29c', // 13
  'ffad5c6c5ebf08c8', // 14
  'f4da126984a6ea6c', // 15
  'ad5229d892f81f1e', // 16
  'f4a2e6f53a76b411', // 17
  '0db196f6d02bed77', // 18
  '84f3edffb24d0bd5', // 19
  '2464eef6aeadaa10', // 20
  '42fc02d687edb18d', // 21
  'e1573114757ca02b', // 22
  '8fc73650501a48a4', // 23
  'd0994cf9e6ef3e11', // 24
  '122eda3ce8fb3aec', // 25
  '3e2cec0fc7290d2e', // 26
  '4f0f6a1bb6d9a0a0', // 27
  '4dddebd50b8192f0', // 28
  '647bf64ecec5195c', // 29
  '12733f0e55868f2e', // 30
  '386c22d026f03da0', // 31
  '057b48872a1bb7e9', // 32
  '6e915251ac905b40', // 33
  '3f0ea7c41d340d70', // 34
  'b9a858b45702243c', // 35
  'e62883aa87c4df42', // 36
  'fa7c618b028538fc', // 37
  '3c0836589d5afd73', // 38
  'c9c32a6250c5f39a', // 39
  '7aa1e92182b9e5ca', // 40
  'fc0a3137973e6740', // 41
  '321469e63fba2f70', // 42
  '488cbd01af0bd360', // 43
  '6ed60e90c892a539', // 44
  '8559014a7604e697', // 45
  '9a2555046c6525e6', // 46
  '43ca1753ffe93383', // 47
  '8f138c3f8263f8c2', // 48
  'a1d8329d3c8262b1', // 49
  '00db8d629525a0f6', // 50
  '09f3cd8de43af7e2', // 51
  '487ee08e65439155', // 52
  '8abf0226ffb4d73c', // 53
  'a7d451d34253d39f', // 54
  '39b6b62465804e3d', // 55
  '57b7fed95a69a216', // 56
  '229268f1b07e7160', // 57
  '9a4bfe3d92b66427', // 58
  '565a159c41470d98', // 59
]);

const hashOf = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex').slice(0, 16);

describe('X-46 car 3 — the promise: the factor at 1.0 is the tip before the budget', () => {
  /** @type {string[]} */
  const hashes = [];
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    for (let i = 0; i < 60; i += 1) {
      const config = birthConfig({ ...DEFAULT_CONFIG, ...configForIndex(i) });
      hashes.push(hashOf(generateSettlementPipeline(config, null, { seed: `x46-promise-${i}` })));
    }
  }, 240_000);

  it('every one of sixty seeds is byte-identical with the density factor forced to 1.0', () => {
    expect(hashes).toHaveLength(60);
    expect(BEFORE).toHaveLength(60);
    const moved = hashes.map((h, i) => (h === BEFORE[i] ? null : i)).filter((i) => i !== null);
    expect(moved).toEqual([]);
  });
});
