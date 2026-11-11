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
const BEFORE = Object.freeze([
  '9ea891a6cd71384f', // 0
  'db8107a73f8e16d3', // 1
  'c8da048a8b671556', // 2
  'f89c6ddbaa4d79d1', // 3
  'ca7937c6e4df84b6', // 4
  '25ef272eece6c93e', // 5
  'efaed43c65014b7f', // 6
  'e713930d43fcb13f', // 7
  '41c2a5e973aecb53', // 8
  '83c354d6b8b30852', // 9
  '3ca18413eea83dcf', // 10
  '3219516b2f59cb43', // 11
  '454aed839015a540', // 12
  '8ba475c451a9b5a2', // 13
  '8a93b1dd7b27b713', // 14
  'cfd561b7e33fa828', // 15
  '802f79507c92464b', // 16
  '7c2a30476d8ead8e', // 17
  '6c3ee69139e1d282', // 18
  '8eba55db8f713789', // 19
  'f0b2c3f298f0a6d7', // 20
  '7bee45ae807037d6', // 21
  'b27abe5cb502f601', // 22
  'b5cdf30cab302d82', // 23
  '70bae71dd604e229', // 24
  '614cdf17c5d6a99c', // 25
  'b28dbf5e186fa8e1', // 26
  '76c77ecd8ce25d5c', // 27
  '3e8c4e7b49a05e5a', // 28
  '74dcdb8369175567', // 29
  '8a87eda6cd3bb8d5', // 30
  'cd3a6e8965861e12', // 31
  '226eb89f3eb020a9', // 32
  '6ba1bfcf8e76c260', // 33
  '2528c405ca6cf1aa', // 34
  '04733be6711756f7', // 35
  '23be44f4096920fb', // 36
  'd2ed7b024737ce2b', // 37
  '649668a88d1dec46', // 38
  '99593d91943d4584', // 39
  '97eefab01b80a080', // 40
  '3ce7d054b4fab967', // 41
  '71a0ca608a347c49', // 42
  'c4d41d245deea1d6', // 43
  'a6a62e11010b2123', // 44
  '4a83192339c8b082', // 45
  'e266852520b4d626', // 46
  'b27d6e2c2fe85d3d', // 47
  'fe1119df5272b368', // 48
  '47e7fd5d33ef7502', // 49
  '1b7c1d9a005e5c77', // 50
  'a1dfeedcaa0139c8', // 51
  'b50ff039d9ebf891', // 52
  '5e0de535fa6d748f', // 53
  '20e7ba95a6e6ccb3', // 54
  '052a13d1839465b4', // 55
  '34e309e2a8c48f4f', // 56
  '885e516ef7dbb6b4', // 57
  'c45030a898849fbe', // 58
  'ef0e824f44739113', // 59
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
