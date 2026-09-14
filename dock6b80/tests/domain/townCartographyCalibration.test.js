/**
 * townCartographyCalibration.test.js — THE CARTOGRAPHY GROUND.
 *
 * The cartography stage's per-tier premises are CALIBRATIONS, and until this suite the
 * only corpus any of them was ever proved against was V2_GOLDEN_CONFIGS: twenty
 * hand-authored settlements whose institution counts are written down as constants
 * (thorp 2, hamlet 4, village 6, town 10, city 16, metropolis 22). A cap cannot be
 * exceeded by a corpus that cannot draw past it, so every cap looked green for months
 * while the real generator was producing counts two to five times larger.
 *
 * This suite replaces that ground. It runs the REAL `generateSettlementPipeline` across
 * the estate's own golden-master grid with the seed and threat dimensions rotated
 * (tests/fixtures/cartographyCalibrationCorpus.js states and defends the selection
 * rule), records what the stage ITSELF says about each settlement, and freezes the
 * result. A future premise change is measured against what the generator really
 * produces.
 *
 *   W0 RECORD      the manifest exists, and the ONE opt-in arm that re-records it.
 *   W1 CORPUS      the selection rule is a pure function of frozen vocabularies, the
 *                  arithmetic closes, and the manifest covers the corpus EXACTLY.
 *   W2 LIVE        a deterministic sample is RE-MEASURED live against the real
 *                  pipeline and must reproduce its manifest rows exactly, so a frozen
 *                  measurement cannot silently decay into a frozen fiction.
 *   W3 IDENTITY    the DRAWN block's own distinct institution refs equal the
 *                  settlement's institution roster size — two numbers produced by
 *                  different code, compared, so the corpus's cheap quantity is PROVEN
 *                  rather than assumed to stand for the expensive one.
 *   W4 RATCHET     the per-tier premise-failure inventory is frozen and SHRINK-ONLY,
 *                  with the honesty companion that forbids a stale row.
 *   W5 HEADROOM    each cap is reported beside the maximum the real pipeline actually
 *                  produces, and the shortfall is named rather than left to be
 *                  rediscovered.
 *   W6 DERIVATION  the three coupled caps ARE the derivation rather than literals that
 *                  agree with it, `bindings <= buildings` holds for ARBITRARY inputs,
 *                  and the declared headroom clears the criterion that set it.
 *   W8 DUPLICATES  the drawn corpus's identical-footprint census: ZERO stacked rows at
 *                  every tier, and a tier-banded ceiling on repeated SHAPES that is
 *                  derived from the measured reading rather than authored to pass.
 *   W7 OUTGROW     the derivation's INPUTS are exactly what this corpus reads, every
 *                  recorded row fits the caps derived from them, and the superseded
 *                  literals are shown NOT to fit — so the fit is a property of the
 *                  derivation and not of any arrangement of numbers.
 *
 * ── W4 IS NOW A ZERO, AND THAT IS THE POINT ──────────────────────────────────
 * When this suite was written, 287 of 504 real settlements raised a cartography
 * premise error and W4 was a shrink-only ratchet because a test asserting zero would
 * have been RED — a disabled guard. MF-CG1b repaired the ground the ratchet was
 * measuring: the inventory is 0 at every tier, the ratchet still only shrinks, and it
 * now guards the repair instead of recording the debt. A tier that grows past 0 means
 * a change made real settlements unable to draw a map again.
 *
 * ── WHY EVERY SUITE AND TEST IS REGISTERED STRAIGHT-LINE ─────────────────────
 * The re-record path is an opt-in ARM of W0's single test, not a conditional
 * `describe`. Wrapping registration in `if (process.env…)` — the shape
 * generatorGoldenMaster uses — parks the whole file in
 * tests/lint/sovereigntyLightingContract.walker.test.js under
 * `SUITE_UNREGISTERED` / `TEST_UNREGISTERED`, and a parked file's pins are real
 * coverage the census cannot see. MEASURED, not assumed: the conditional draft of this
 * file walked the census to `+1 file / +1 parked / +0 credited / +0 titles /
 * +0 suiteTitles`, every title swallowed. The manifest is therefore read through
 * `readManifest()` per test rather than once at module scope, so the re-record arm's
 * write is visible to the arms that verify it in the same run.
 *
 * ── SHIFT RECORD ─────────────────────────────────────────────────────────────
 * A frozen measurement cannot show WHY it moved, so every re-record is written here.
 *
 * 2026-08-31 — THE TRADES CHANGED QUARTERS (lane T8; 207 rows of 504 moved, 0 added,
 *   0 removed). RULED: ODQ §759.5 / §773.1, chair-approved at §858. This is NOT a
 *   cartography change — no premise, cap, packer or glyph rule was touched. T8 corrected 27
 *   catalog rows whose `priorityCategory` said 'government' while the institution was a trade
 *   (a tannery, a cobbler, a shepherd), and `townMap/institutionAssignment` reads that field
 *   to decide which quarter a building belongs to. The trades therefore moved out of the
 *   civic quarter and into the craft, industrial and merchant ones, which is the correct
 *   answer and a different map.
 *   EXACTLY THREE FIELDS MOVED, measured over the whole manifest rather than sampled:
 *     cartoBuildings 171 rows · cartoRowBytes 146 rows · cartoDupTranslate 170 rows
 *   `institutions`, `districts`, `sceneBuildings`, `dark`, `outcome` and `reported` are
 *   UNCHANGED on all 504 rows — so no roster moved, and ⭐ W4's premise-failure inventory is
 *   still ZERO at every tier: not one settlement became unable to draw a map.
 *   TWO FROZEN MAXIMA FELL AND ARE BANKED (the ratchet's own compliance path):
 *     town maxBuildings 115 -> 112 · city 203 -> 198
 *   ⚠ AND ONE READING ROSE, NAMED RATHER THAN BURIED, because it is a real if small cost on
 *   a surface the owner looks at: the repeated-SHAPE rate went village 66 -> 78, town
 *   59 -> 64, city 52 permille. Moving trades into shared craft and industrial quarters puts
 *   more buildings of the same glyph family side by side, so the drawn map repeats itself
 *   slightly more — about one building in thirteen at village tier, up from one in fifteen.
 *   Every tier remains well under its derived ceiling and `CARTOGRAPHY_HEADROOM_PERMILLE` is
 *   untouched, but the three derived ceilings are a readout of the reading and rose with it
 *   (106 -> 125, 95 -> 103, 82 -> 84) — stated at the assertion too, so nobody reads that as
 *   a cap being raised to fit. If the owner would rather have the old density, the lever is
 *   the packer's glyph variety, not this taxonomy.
 *   The generator-side half of the same shift is recorded in
 *   `tests/property/generatorGoldenMaster.test.js` (322 of 525 rows, one template).
 *
 * 2026-08-23 — FIRST RECORD (lane TE-CG-1, packet MF-CG1). Corpus captured at
 *   00e7af61 through the committed re-record arm below. 504 rows; dark compile
 *   504/504 clean; 287 lit failures in exactly TWO premise classes — 266
 *   `binding-cap` and 21 `tc4-bytes` — and zero in the `other` bucket. No tuning
 *   number was moved by the recording lane: the numbers below are the measured state
 *   of the estate, not a target this suite helped anyone reach.
 *
 * 2026-08-24 — SECOND RECORD (lane TE-CG-1b, packet MF-CG1b). ⚠⚠ A DELIBERATE,
 *   DECLARED SAME-SEED SHIFT, and the largest thing in this file's history. The three
 *   coupled caps stopped being literals: `MAXIMUM_INSTITUTION_BINDINGS`,
 *   `MAXIMUM_CARTOGRAPHY_BUILDINGS` and `TC4_ROW_BYTES_BAND` are now derived from the
 *   maxima THIS corpus measures, behind the single owner-signed headroom
 *   `CARTOGRAPHY_HEADROOM_PERMILLE` (ODQ §515, BAND 21). **The lit throw census moves
 *   287 → 0 of 504.** Two consequences are honest to state rather than bury:
 *
 *   (1) THE DRAWN OUTPUT MOVED at every tier, because the total building cap is a
 *       TRUNCATION cap and it rose from `{12,24,48,96,176,240}` to
 *       `{26,55,98,164,208,261}`. Same seed, same config, denser map. That is the
 *       cure, not a side effect: a hamlet that drew nothing now draws.
 *   (2) THE OLD IDENTITY CONTROL DIED WITH THE THROWS. W3 used to read the binding
 *       count out of a THROWN premise message, and there are no more thrown messages.
 *       It is replaced by a strictly stronger reading — the DRAWN block's own distinct
 *       `institutionRef` set, which is the binder's output rather than its complaint.
 *
 *   The recorded institution maxima are UNCHANGED (11/24/41/62/55/63), which is the
 *   evidence that the generator did not move underneath this re-record.
 *
 * 2026-08-24 — THIRD RECORD (lane TE-CG-2). ⚠ A DELIBERATE, DECLARED SAME-SEED SHIFT:
 *   every drawn map moves, and this is the honest statement of what moved and why.
 *
 *   THE DEFECT. TC-4's packer took a mod-4 SLOT into one medial subdivision, and the
 *   layer kept TWO counters over the same parcel — `flagshipsAt` for round-1
 *   institutions, `occupancy` for everything else. A footprint is a pure function of
 *   (parcel, slot, shrink), so both leaks drew buildings at IDENTICAL COORDINATES.
 *   Measured over THIS corpus at 79b78881c: 26.42% of 53,420 drawn buildings shared a
 *   footprint vertex-for-vertex with another building in the same settlement, 63.30%
 *   shared one up to translation, and 5,932 of 5,932 duplicate groups lay inside a
 *   SINGLE parcel. The slot is now a recursive medial ADDRESS, there is one ledger,
 *   and the footprint carries a tier-banded dressed FORM. Post-fix: 0.00% exact,
 *   5.93% translate.
 *
 *   (1) `cartoBuildings` FELL at every tier, 53,420 → 44,293 over the corpus, and the
 *       frozen per-tier maxima with it (13/31/57/152/208/261 → 12/25/47/114/196/261).
 *       A flagship now CONSUMES a cell from the one ledger, so a parcel that
 *       flagships over-subscribe no longer offers the same cell to a dwelling. The
 *       rows that stopped being drawn are rows that were being drawn on top of
 *       another row; the map lost 9,127 rows and had 14,112 stacked ones.
 *   (2) `cartoRowBytes` ROSE at every tier and the derivation's byte input with it,
 *       443 → 450. A dressed footprint may be a corner-truncated cell, and a fourth
 *       plan point costs about seven bytes a row.
 *   (3) `cartoInstitutionRefs` is UNCHANGED on 504 of 504 rows, and that is the
 *       control that matters: the ONE LAW says every canonical institution draws its
 *       flagship, and it still does. `institutions` (11/24/41/62/55/63) and the
 *       throw census (0 of 504) are likewise unmoved — MF-CG1b's cure is not
 *       regressed and the generator did not move underneath this re-record.
 *
 * 2026-08-24 — FOURTH RECORD (the TE-STACK-5 LANDING, MF-CG2 stacked on MF-CH3).
 *   ⚠ NOT A NEW CARTOGRAPHY CHANGE. Not one line of `src/domain/townCartography/**` moved
 *   between the third record and this one. This re-record exists because TWO CARS THROUGH
 *   ONE GATE both reach this corpus, and their combined output is a THIRD value that
 *   neither car's own recording could contain:
 *
 *     · MF-CH3 (catalog hygiene) frees `Multiple monasteries` and `Monastery or friary`
 *       into city and metropolis rosters, so 25 of the 504 rows carry a larger canonical
 *       institution set — measured, `cartoInstitutionRefs` differs from the MF-CG2-only
 *       recording on exactly 25 rows and from the MF-CH3-tip recording on ZERO.
 *     · MF-CG2 (the cell address) decides where those institutions are drawn.
 *
 *   WHAT MOVED, and it is one figure and one total:
 *     (1) `cartoBuildings` over the corpus 44,293 → 44,322 (+29). Those 29 rows are the
 *         flagships of the institutions MF-CH3 admitted; a flagship consumes a cell, so
 *         each admitted institution draws exactly one more building.
 *     (2) `DUPLICATES.city.permille` 51 → 50, and its DERIVED ceiling 82 → 80 with it.
 *         The city tier's translate-duplicate COUNT is essentially unmoved; the tier drew
 *         more rows, so the same repetition over a larger denominator rounds down by one
 *         permille. The ceiling is not loosened by hand — it is `Math.ceil(50 × 1600/1000)`,
 *         the same derivation, re-evaluated.
 *   WHAT DID NOT MOVE, each checked rather than assumed: EXACT duplication is 0.00% at
 *   every tier and 0 of 44,322 over the corpus (MF-CG2's cure is intact under the stack);
 *   `FROZEN.maxBuildings` stays 12/25/47/114/196/261; `maxInstitutions` stays
 *   11/24/41/62/55/63; the throw census stays 0 of 504; the worst `cartoRowBytes` stays
 *   450 so the derived byte band stays 720; the other five tiers read 109/181/72/68/48
 *   exactly as recorded; and THE ONE LAW holds — `cartoInstitutionRefs` equals
 *   `institutions` on 504 of 504 rows.
 *
 * 2026-08-24 — FIFTH RECORD (TE-CH-4, the district-profile registry; ODQ §555).
 *   ⚠ NOT A CARTOGRAPHY CHANGE. Not one line of `src/domain/townMap/**` or
 *   `src/domain/townCartography/**` moved. This re-record exists because the car
 *   re-classifies DISTRICTS, and a district's category decides its ring and its
 *   wall-embrace, which moves the centroid every building is placed around.
 *
 *   WHY IT IS THE DECLARED SHIFT AND NOT A DEFECT — the per-field signature says so.
 *   Over the 52-row W2 sample, 32 rows drift and ONLY the two drawn-geometry fields
 *   move: `cartoBuildings` 28 and `cartoRowBytes` 28. Every other recorded field is
 *   unmoved on every sampled row — `institutions` 0, `districts` 0, `sceneBuildings` 0,
 *   `dark` 0, `outcome` 0, `reported` 0, and `cartoInstitutionRefs` 0. So the generator
 *   did not move underneath this re-record, the district COUNT did not change (only
 *   which category each district is), no row newly throws, and THE ONE LAW still holds:
 *   every canonical institution draws its flagship.
 *
 *   ⛔ THE STACKING CHECK WAS RUN BEFORE ANYTHING WAS RE-RECORDED, because a re-record
 *   over a geometry regression is the one thing this manifest must never absorb.
 *   `cartoDupExact` measured LIVE at all six argmax rows reads 0, against 0 recorded —
 *   zero drawn buildings stand on another anywhere. MF-CG2's cure is intact under this
 *   car, and all eight W8 failures were record mismatches, not stacked geometry.
 *
 *   WHAT MOVED:
 *     (1) `FROZEN.maxBuildings` — village 47 → 46, town 114 → 116, city 196 → 203.
 *         thorp (12), hamlet (25) and metropolis (261) are unmoved. The arm is EXACT in
 *         both directions ("drew 46 < frozen 47 — lower it"), so village is lowered
 *         rather than left as slack.
 *     (2) `DUPLICATES.permille` — thorp 109 → 124, village 72 → 66, town 68 → 65,
 *         city 50 → 51, metropolis 53. hamlet (181) is unmoved. Shapes repeat at a
 *         different rate because the parcels they are drawn into moved, not because the
 *         packer changed.
 *     (3) The derived ceilings with them, 175/290/116/109/80/77 → 199/290/106/104/82/85.
 *         NOT loosened by hand — each is `Math.ceil(permille × 1600/1000)`, the same
 *         derivation re-evaluated, and two of the six went DOWN.
 *   WHAT DID NOT MOVE, each checked rather than assumed: `maxInstitutions` stays
 *   11/24/41/62/55/63; the throw census stays 0 of 504; and W2's live re-measure and
 *   W8's live argmax arm both pass against the new record.
 *
 * ── RE-RECORD 2026-08-30 — THE BURIAL LADDER (lane TE-RESIDUE-1, ODQ §708.5/§763.1) ──
 *   THE CAUSE IS ONE INSTITUTION PER SETTLEMENT, AT FIVE TIERS. The catalog could bury the
 *   dead at exactly one tier (`Graveyard`, village-only), so a `required: true` burial row
 *   was authored for thorp, hamlet, town, city and metropolis. Every settlement of those
 *   five tiers therefore carries one more canonical institution, and a canonical institution
 *   draws a FLAGSHIP — so it draws one more building. THE VILLAGE IS THE CONTROL AND IT DOES
 *   NOT MOVE anywhere in this record, because the village already had its graveyard.
 *   WHAT MOVED, and every one of these is a MEASUREMENT re-read off the regenerated corpus,
 *   never a number chosen to fit:
 *     (1) `MAX_INSTITUTIONS` / `FROZEN.maxInstitutions` 11/24/41/62/55/63 →
 *         12/25/41/63/56/65. Exactly +1 at every tier that gained a row except metropolis,
 *         whose argmax row gains two because it is the tier where `Cemetery network` and the
 *         `Parish churches (50-100+)` block coexist. Village unmoved at 41.
 *     (2) `FROZEN.maxBuildings` 12/25/46/116/203/261 → 13/27/46/115/203/264. ⚠ TOWN GOES
 *         DOWN (116 → 115): the caps are DERIVED from the institution maxima, so a bigger
 *         roster re-partitions the same block and the town's densest row draws one fewer.
 *         A re-record that only ever went up would have been the suspicious one.
 *     (3) `MAX_BUILDING_ROW_BYTES` 450 → 448, and the derived byte band 720 → 717 with it.
 *         The worst row got SMALLER, which only ever tightens a ceiling.
 *     (4) `DUPLICATES.permille` 124/181/66/65/51/53 → 147/218/66/59/51/58, and the derived
 *         ceilings 199/290/106/104/82/85 → 236/349/106/95/82/93 — `Math.ceil(reading ×
 *         CARTOGRAPHY_HEADROOM_PERMILLE / 1000)`, the same owner-signed operator re-evaluated
 *         on the new reading, exactly as the third record above did. Town goes DOWN, village
 *         and city do not move at all.
 *   ⛔⛔ AND THE DIRECTION AT THE TWO SMALL TIERS IS A PRODUCT FACT, NOT A BOOKKEEPING ONE.
 *   Thorp 124 → 147 and hamlet 181 → 218 permille means MORE of a small map's buildings now
 *   repeat a shape up to translation — 12.4% → 14.7% and 18.1% → 21.8%. THE CAUSE IS
 *   STRUCTURAL AND IT IS NOT ABOUT BURIAL: `FOOTPRINT_FORM_VARIANTS` bands the shape
 *   vocabulary at 3/3/6/9/12/12, so a thorp has THREE shapes to draw a dozen buildings with,
 *   and ANY new required institution at those tiers must raise the repeat rate. This car is
 *   simply the first content car to meet that wall. The lever MF-CG2's own anti-scope names —
 *   a wider footprint vocabulary, or `BUILDINGS_PER_PARCEL` / `PARCELS_PER_WARD` — is a
 *   design move for the estate wave and is deliberately NOT pulled here. Carried to the chair
 *   as a tuning-pass input rather than absorbed into a ceiling.
 *   WHAT DID NOT MOVE, each checked rather than assumed: EXACT duplication stays 0 at every
 *   tier (MF-CG2's cure is intact); the throw census stays 0 of 504; `CORPUS_ROWS` stays 504;
 *   the village row is unmoved on every axis; and THE ONE LAW holds — `cartoInstitutionRefs`
 *   equals `institutions` on 504 of 504 rows.
 *   ⚠ THE REGENERATION IS ORDER-DEPENDENT AND WAS RUN TWICE FOR THAT REASON. The building
 *   caps are DERIVED from `MAX_INSTITUTIONS`, so a corpus regenerated before the calibration
 *   constants move is drawn against the OLD cap: the first pass left metropolis recorded at
 *   261 while the live layer drew 264, and W2's live re-measure caught it. The constants were
 *   moved and the corpus regenerated a second time; the figures above are that second pass.
 *
 * To re-record after an INTENTIONAL change, run:
 *   UPDATE_CARTOGRAPHY_CALIBRATION=1 npx vitest run tests/domain/townCartographyCalibration.test.js
 * and add a row above before committing. Re-recording without adding a row is a
 * deleted alarm.
 *
 * @enforced-by tests/fixtures/cartographyCalibrationCorpus.js
 */
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { recordGolden } from '../helpers/goldenRecordDoor.js';
import { dirname, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  CALIBRATION_CULTURES,
  CALIBRATION_OUTCOMES,
  CALIBRATION_SAMPLE_STRIDE,
  CALIBRATION_SEEDS,
  CALIBRATION_TERRAINS,
  CALIBRATION_TERRAIN_ROUTE,
  CALIBRATION_THREATS,
  calibrationKeyOf,
  calibrationRows,
  calibrationSampleKeys,
  calibrationVocabularyReceipt,
  classifyCalibrationFailure,
  duplicateFootprintRows,
  exactFootprintKey,
  measureCalibrationRow,
  translateFootprintKey,
} from '../fixtures/cartographyCalibrationCorpus.js';
import {
  CARTOGRAPHY_CALIBRATION,
  CARTOGRAPHY_HEADROOM_PERMILLE,
  CARTOGRAPHY_TIERS,
  TOWN_CARTOGRAPHY_TUNING,
  cartographyBand,
  deriveCartographyCaps,
} from '../../src/domain/townCartography/cartographyTuning.js';

const T = TOWN_CARTOGRAPHY_TUNING;
const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'cartography-calibration-corpus.json');
/** The tuning module's own source, read by W6's single-writer scan. */
const TUNING_SOURCE = resolve(
  process.cwd(), 'src', 'domain', 'townCartography', 'cartographyTuning.js',
);

/**
 * THE FROZEN INVENTORY — re-measured 2026-08-24 at the MF-CG1b tip. SHRINK-ONLY.
 *
 * `throws` is the number of the tier's 84 corpus rows on which the lit cartography
 * compile raises a premise error. It was `28 / 71 / 83 / 84 / 21 / 0` when this file
 * landed and it is ZERO everywhere now. NEVER raise a number — a tier that grows past
 * its frozen count means a change made real settlements unable to draw a map again,
 * which is the whole event this ratchet exists to make loud.
 *
 * `maxInstitutions` is the largest canonical institution roster the real pipeline
 * produced at that tier over this corpus. It is an EXACT pin, not a ceiling: it measures
 * the GENERATOR, so a move in either direction is generator drift that must be seen and
 * explained, never silently absorbed. It is ALSO the derivation's own input — the same
 * six numbers appear in `CARTOGRAPHY_CALIBRATION.MAX_INSTITUTIONS`, and W7 pins the two
 * readings against each other so the caps can never drift away from their ground.
 *
 * `maxBuildings` is the largest block the TC-4 layer actually DREW at that tier. It is
 * a bound rather than an exact pin: it is a function of the caps, so pinning it exactly
 * would red on every deliberate cap change and say nothing the count cap does not.
 */
const FROZEN = Object.freeze({
  thorp: Object.freeze({ throws: 0, maxInstitutions: 12, maxBuildings: 13 }),
  hamlet: Object.freeze({ throws: 0, maxInstitutions: 25, maxBuildings: 27 }),
  village: Object.freeze({ throws: 0, maxInstitutions: 41, maxBuildings: 46 }),
  town: Object.freeze({ throws: 0, maxInstitutions: 63, maxBuildings: 112 }),
  city: Object.freeze({ throws: 0, maxInstitutions: 56, maxBuildings: 198 }),
  metropolis: Object.freeze({ throws: 0, maxInstitutions: 65, maxBuildings: 264 }),
});

/**
 * THE DUPLICATE-FOOTPRINT CENSUS — frozen, and the two readings carry DIFFERENT KINDS
 * OF CEILING on purpose. `tests/fixtures/cartographyCalibrationCorpus.js` defines both
 * readings and the suite consumes that ONE definition, so the pin and the recording
 * can never drift into measuring two different things.
 *
 * ── WHERE THE LINE IS DRAWN, AND WHY IT IS DRAWN THERE ───────────────────────
 * EXACT duplication — the same vertex list at the same absolute coordinates — is
 * NEVER correct, at any tier, and its ceiling is a flat ZERO with no headroom. It is
 * not "less variety"; it is one building standing inside another. It is invisible to
 * a reader, it makes a canonical institution that the ONE LAW promised would appear
 * not actually appear, and `cartographyProperty.js` subtracts member footprints from
 * the parcel ring under an EVEN-ODD fill, so two identical holes cancel and the yard
 * beneath a stacked pair renders as solid ground. A tier-scaled allowance for it would
 * be an allowance for a rendering bug.
 *
 * TRANSLATE duplication — the same shape and size, drawn somewhere else — IS
 * legitimately tier-scaled, and this is the honest half of the line.
 * `PLAN_UNIT_CM_BY_TIER` (compileTownSceneManifest.js) sets a thorp's plan unit at
 * 10 cm against a metropolis's 80: a thorp's buildings are genuinely smaller and
 * genuinely less varied, because a thorp IS a dozen of the same cottage. So the form
 * vocabulary bands by tier (`FOOTPRINT_FORM_VARIANTS` 3/3/6/9/12/12) and the ceiling
 * bands with it. `hamlet` is the loosest reading in the corpus at 184 permille and
 * that is the vocabulary doing what it was asked to: three forms over a block of
 * seventeen buildings cannot help repeating a shape.
 *
 * ── THE CEILING IS DERIVED, NOT PICKED ───────────────────────────────────────
 * `permille` below is the tier's MEASURED reading over this corpus — an exact pin, for
 * the same reason `maxInstitutions` is one: a move in either direction is drift that
 * must be seen. The CEILING each tier is held to is that reading carried up by the
 * estate's one declared headroom, `CARTOGRAPHY_HEADROOM_PERMILLE`, exactly as the
 * three coupled caps are derived — so no number here was chosen to make a test pass,
 * and raising a ceiling means moving a measurement and saying so.
 *
 * THE READINGS AT THE BASE THIS CURED (79b78881c, same corpus, same instrument, and
 * re-measured after the lane's dependency tree was rebuilt from this worktree's own
 * lockfile): exact 264 permille of 53,420 rows and translate 633. Per tier the
 * translate reading was 647 / 750 / 821 / 810 / 590 / 544, and the EXACT reading was
 * 556 / 667 / 666 / 491 / 197 / 96. Every number below is an order of magnitude off
 * those, which is the evidence that the census measures the cure rather than nothing.
 */
const DUPLICATES = Object.freeze({
  thorp: Object.freeze({ permille: 147 }),
  hamlet: Object.freeze({ permille: 218 }),
  village: Object.freeze({ permille: 78 }),
  town: Object.freeze({ permille: 64 }),
  city: Object.freeze({ permille: 52 }),
  metropolis: Object.freeze({ permille: 58 }),
});

/**
 * The ceiling one tier's repeated-shape rate is held to: the measured reading at the
 * declared headroom. Pure and total over CARTOGRAPHY_TIERS.
 * @param {string} tier
 * @returns {number} permille
 */
function duplicateCeilingPermille(tier) {
  return Math.ceil((DUPLICATES[tier].permille * CARTOGRAPHY_HEADROOM_PERMILLE) / 1000);
}

/**
 * THE SUPERSEDED LITERALS — the three tables MF-CG1b replaced, kept because W7 uses
 * them as its FALSIFIER. Without them "the corpus fits the caps" is a claim with no
 * demonstrated alternative; with them it is a claim that 266 of these very rows did
 * NOT fit the arrangement of numbers that stood here for months.
 */
const SUPERSEDED = Object.freeze({
  bindings: Object.freeze({
    thorp: 8, hamlet: 12, village: 20, town: 32, city: 64, metropolis: 96,
  }),
  buildings: Object.freeze({
    thorp: 12, hamlet: 24, village: 48, town: 96, city: 176, metropolis: 240,
  }),
  rowBytes: 400,
});

/** Rows per tier in the corpus — cultures x terrains, closed by the receipt in W1. */
const ROWS_PER_TIER = 84;

const rows = calibrationRows();

/**
 * @typedef {{ tier: string, institutions: number, districts: number,
 *   sceneBuildings: number, dark: string, outcome: string, reported: number[],
 *   cartoBuildings: number, cartoRowBytes: number, cartoInstitutionRefs: number,
 *   cartoDupExact: number, cartoDupTranslate: number }} Row
 */

/** Read the frozen measurement. Per test, never once at module scope — see the header.
 *  @returns {Record<string, Row>} */
function readManifest() {
  return existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf-8')) : {};
}

/** @param {Record<string, Row>} manifest @param {string} tier @returns {Array<[string, Row]>} */
function rowsOfTier(manifest, tier) {
  return Object.entries(manifest).filter(([, value]) => value.tier === tier);
}

/** @param {Record<string, Row>} manifest @param {string} tier @returns {number} */
function throwsOfTier(manifest, tier) {
  return rowsOfTier(manifest, tier).filter(([, value]) => value.outcome !== 'ok').length;
}

describe('W0 the frozen record, and the one arm that re-records it', () => {
  it('the manifest exists, and UPDATE_CARTOGRAPHY_CALIBRATION re-records it', () => {
    // ONE test, TWO arms, registered straight-line so the file stays credited. The
    // re-record arm is opt-in because it drives 504 full pipeline generations and 1,008
    // scene compiles; CI takes the existence arm and W2's live sample instead.
    if (process.env.UPDATE_CARTOGRAPHY_CALIBRATION) {
      /** @type {Record<string, Row>} */
      const out = {};
      for (const row of rows) {
        const measured = measureCalibrationRow(row);
        out[measured.key] = {
          tier: measured.tier,
          institutions: measured.institutions,
          districts: measured.districts,
          sceneBuildings: measured.sceneBuildings,
          dark: measured.dark,
          outcome: measured.outcome,
          reported: measured.reported,
          cartoBuildings: measured.cartoBuildings,
          cartoRowBytes: measured.cartoRowBytes,
          cartoInstitutionRefs: measured.cartoInstitutionRefs,
          cartoDupExact: measured.cartoDupExact,
          cartoDupTranslate: measured.cartoDupTranslate,
        };
      }
      if (!existsSync(dirname(MANIFEST))) mkdirSync(dirname(MANIFEST), { recursive: true });
      // ⚠ KEY ORDER BY CONSTRUCTION, NEVER BY REPLACER. `JSON.stringify(out, keys, n)`
      // reads its second argument as an ALLOW-LIST applied at EVERY level, so an array of
      // top-level keys silently empties every nested record — the first capture wrote 504
      // rows of `{}` and only W1's outcome arm noticed. Sorting the entries is the shape
      // that cannot do that.
      const sorted = Object.fromEntries(Object.keys(out).sort().map((key) => [key, out[key]]));
      recordGolden({ surface: 'cartography-calibration-corpus', path: MANIFEST, produce: () => `${JSON.stringify(sorted, null, 1)}\n` });
      expect(Object.keys(out).length).toBe(rows.length);
    }
    expect(existsSync(MANIFEST), 'run UPDATE_CARTOGRAPHY_CALIBRATION=1 to create it').toBe(true);
  }, 1_200_000);
});

describe('W1 the corpus is a rule, and the manifest covers it exactly', () => {
  it('the vocabulary arithmetic closes', () => {
    const receipt = calibrationVocabularyReceipt();
    expect(receipt.tiers).toBe(6);
    expect(receipt.terrains).toBe(7);
    expect(receipt.threats).toBe(4);
    expect(receipt.seeds).toBe(12);
    // Cultures are DERIVED from the profile registry; the corpus size is derived from
    // the three vocabularies, so this closes rather than restates.
    expect(receipt.cultures).toBe(CALIBRATION_CULTURES.length);
    expect(receipt.rows).toBe(receipt.tiers * receipt.cultures * receipt.terrains);
    expect(rows.length).toBe(receipt.rows);
    expect(receipt.rows / receipt.tiers).toBe(ROWS_PER_TIER);
  });

  it('every row obeys the stated selection rule, index for index', () => {
    // The rule is the fixture's contract, so it is CHECKED rather than described: a row
    // that drifted off the rotation would still hash into the manifest and would make
    // the corpus a list somebody edited instead of a function anybody can rebuild.
    /** @type {string[]} */
    const offenders = [];
    rows.forEach((row, index) => {
      if (row.monsterThreat !== CALIBRATION_THREATS[index % CALIBRATION_THREATS.length]) {
        offenders.push(`${index}: threat ${row.monsterThreat}`);
      }
      if (row._seed !== CALIBRATION_SEEDS[index % CALIBRATION_SEEDS.length]) {
        offenders.push(`${index}: seed ${row._seed}`);
      }
      if (row.tradeRouteAccess !== CALIBRATION_TERRAIN_ROUTE[row.terrainOverride]) {
        offenders.push(`${index}: route ${row.tradeRouteAccess}`);
      }
      if (!CALIBRATION_TERRAINS.includes(row.terrainOverride)) {
        offenders.push(`${index}: terrain ${row.terrainOverride}`);
      }
    });
    expect(offenders).toEqual([]);
  });

  it('the rotation reaches every (tier, seed) and (tier, threat) pair', () => {
    // A rotation whose period aligned with the inner loop would visit one column and
    // look exactly as broad as this one. That failure is invisible to a row count, so
    // it is closed here by construction.
    const seedPairs = new Set(rows.map((row) => `${row.settType}|${row._seed}`));
    const threatPairs = new Set(rows.map((row) => `${row.settType}|${row.monsterThreat}`));
    expect(seedPairs.size).toBe(CARTOGRAPHY_TIERS.length * CALIBRATION_SEEDS.length);
    expect(threatPairs.size).toBe(CARTOGRAPHY_TIERS.length * CALIBRATION_THREATS.length);
  });

  it('the manifest key set equals the corpus key set exactly', () => {
    // Exact, never a subset: an added row without a measurement and a stale row whose
    // config no longer exists are the same defect wearing two faces.
    expect(rows.map(calibrationKeyOf).sort()).toEqual(Object.keys(readManifest()).sort());
  });

  it('every recorded row carries a known outcome and a dark compile that succeeded', () => {
    const manifest = readManifest();
    const unknown = Object.entries(manifest)
      .filter(([, value]) => !CALIBRATION_OUTCOMES.includes(value.outcome))
      .map(([key, value]) => `${key}: ${value.outcome}`);
    expect(unknown).toEqual([]);
    // `other` is deliberately expected empty: a premise class this corpus has never
    // seen must be loud rather than folded into one of the two known ones.
    const other = Object.entries(manifest)
      .filter(([, value]) => value.outcome === 'other').map(([key]) => key);
    expect(other).toEqual([]);
    // The pipeline's output is NOT malformed, and that is a load-bearing claim: it is
    // what makes every failure below a CALIBRATION defect rather than a generator bug.
    const darkFailures = Object.entries(manifest)
      .filter(([, value]) => value.dark !== 'ok').map(([key, value]) => `${key}: ${value.dark}`);
    expect(darkFailures).toEqual([]);
  });

  it('the failure classifier reads the stage\'s own words, and refuses foreign ones', () => {
    // The classifier is the corpus's only interpretation step, so its NEGATIVE arm
    // matters more than its positive one: a classifier that matched everything would
    // make the `other` bucket above vacuously empty.
    expect(classifyCalibrationFailure(
      'townCartography TC-3 premise: 52 institution bindings exceed the town cap of 32',
    )).toEqual({ outcome: 'binding-cap', reported: [52, 32] });
    expect(classifyCalibrationFailure(
      'townCartography TC-3 premise: the TC-4 layer measures 71209 bytes against the city band of 70400',
    )).toEqual({ outcome: 'tc4-bytes', reported: [71209, 70400] });
    expect(classifyCalibrationFailure('some other premise entirely'))
      .toEqual({ outcome: 'other', reported: [] });
  });
});

describe('W2 the frozen measurement is re-measured live', () => {
  it('the sample rule picks a stride UNION every tier\'s argmax row', () => {
    const manifest = readManifest();
    const recorded = Object.entries(manifest)
      .map(([key, value]) => ({ key, tier: value.tier, institutions: value.institutions }));
    const sample = calibrationSampleKeys(recorded);
    expect(sample.length).toBeGreaterThanOrEqual(
      Math.ceil(rows.length / CALIBRATION_SAMPLE_STRIDE),
    );
    // The argmax rows are the only rows whose drift can move a recorded ceiling, so
    // their presence is the property that makes the sample worth running at all.
    for (const tier of CARTOGRAPHY_TIERS) {
      const best = recorded
        .filter((entry) => entry.tier === tier)
        .reduce((left, right) => (right.institutions > left.institutions ? right : left));
      expect(sample, `${tier} argmax row is not sampled`).toContain(best.key);
    }
  });

  it('every sampled row reproduces its manifest record exactly', () => {
    // This is what keeps the manifest honest. It runs the REAL pipeline and the REAL
    // compiler; if generation or the stage moved, the sampled rows disagree and this
    // reds — the manifest cannot quietly become a description of a tree that is gone.
    const manifest = readManifest();
    const recorded = Object.entries(manifest)
      .map(([key, value]) => ({ key, tier: value.tier, institutions: value.institutions }));
    const sample = calibrationSampleKeys(recorded);
    const byKey = new Map(rows.map((row) => [calibrationKeyOf(row), row]));
    /** @type {string[]} */
    const drift = [];
    for (const key of sample) {
      const measured = measureCalibrationRow(/** @type {never} */ (byKey.get(key)));
      const frozen = manifest[key];
      if (measured.institutions !== frozen.institutions
        || measured.districts !== frozen.districts
        || measured.sceneBuildings !== frozen.sceneBuildings
        || measured.dark !== frozen.dark
        || measured.outcome !== frozen.outcome
        || measured.reported.join(',') !== frozen.reported.join(',')
        || measured.cartoBuildings !== frozen.cartoBuildings
        || measured.cartoRowBytes !== frozen.cartoRowBytes
        || measured.cartoInstitutionRefs !== frozen.cartoInstitutionRefs) {
        drift.push(`${key}: recorded ${JSON.stringify(frozen)} measured ${JSON.stringify({
          institutions: measured.institutions,
          districts: measured.districts,
          sceneBuildings: measured.sceneBuildings,
          dark: measured.dark,
          outcome: measured.outcome,
          reported: measured.reported,
          cartoBuildings: measured.cartoBuildings,
          cartoRowBytes: measured.cartoRowBytes,
          cartoInstitutionRefs: measured.cartoInstitutionRefs,
        })}`);
      }
    }
    expect(drift).toEqual([]);
  }, 600_000);
});

describe('W3 the corpus quantity is proven, not assumed', () => {
  it('the DRAWN block\'s distinct institution refs equal the settlement\'s roster', () => {
    // TWO independently produced numbers: the left one is the set of `institutionRef`
    // values on the rows cartographyBuildings.js actually emitted — the TC-3b binder's
    // OUTPUT, arrived at through parcel carving, prominence grading and footprint
    // packing — and the right one is the length of the roster the pipeline wrote long
    // before any compile. Their agreement is what licenses the rest of this suite to
    // reason about `institutions` as the calibration quantity, and their disagreement,
    // if the binder's eligibility rule ever narrows, is exactly the event that must not
    // pass silently.
    //
    // ⚠ THIS CONTROL WAS REBUILT BY MF-CG1b AND IS STRONGER THAN THE ONE IT REPLACED.
    // The original read the binding count out of a THROWN premise message, so it could
    // only see the 266 rows that FAILED — and the moment the caps admitted the roster
    // it would have had nothing left to read and would have gone vacuously empty. This
    // one reads the drawn block, so it covers all 504 rows and gets STRONGER as the
    // ground is repaired rather than weaker.
    const drawn = Object.entries(readManifest())
      .filter(([, value]) => value.cartoBuildings > 0);
    // Non-vacuity: an empty left-hand side would make the filter below prove nothing.
    expect(drawn.length).toBe(rows.length);
    const disagreements = drawn
      .filter(([, value]) => value.cartoInstitutionRefs !== value.institutions)
      .map(([key, value]) => (
        `${key}: drew ${value.cartoInstitutionRefs} refs, roster ${value.institutions}`
      ));
    expect(disagreements).toEqual([]);
  });

  it('every row records a real drawn measurement, never the −1 of a row that threw', () => {
    // The two lit figures are −1 by construction when the compile throws, and −1 is a
    // number that sails through a `<=` bound. This is the arm that stops a silent
    // regression to "nothing drew, so nothing exceeded anything".
    const missing = Object.entries(readManifest())
      .filter(([, value]) => !(value.cartoBuildings > 0)
        || !(value.cartoRowBytes > 0)
        || !(value.cartoInstitutionRefs >= 0))
      .map(([key, value]) => (
        `${key}: buildings ${value.cartoBuildings} rowBytes ${value.cartoRowBytes} `
        + `refs ${value.cartoInstitutionRefs}`
      ));
    expect(missing).toEqual([]);
  });

  it('the classifier can still read the DERIVED band out of the stage\'s own words', () => {
    // The stage no longer refuses any row in this corpus, so the two premise messages
    // are no longer sampled live. They are still the corpus's only interpretation step,
    // so the classifier is exercised against messages built FROM the caps in force: if
    // the band's derivation and the message's wording ever drift apart, this reds while
    // the corpus itself has nothing to say.
    const tier = 'city';
    const band = cartographyBand(T.MAXIMUM_CARTOGRAPHY_BUILDINGS, tier) * T.TC4_ROW_BYTES_BAND;
    const cap = cartographyBand(T.MAXIMUM_INSTITUTION_BINDINGS, tier);
    expect(classifyCalibrationFailure(
      `townCartography TC-3 premise: the TC-4 layer measures ${band + 1} bytes `
      + `against the ${tier} band of ${band}`,
    )).toEqual({ outcome: 'tc4-bytes', reported: [band + 1, band] });
    expect(classifyCalibrationFailure(
      `townCartography TC-3 premise: ${cap + 1} institution bindings exceed the `
      + `${tier} cap of ${cap}`,
    )).toEqual({ outcome: 'binding-cap', reported: [cap + 1, cap] });
  });
});

describe('W4 the premise-failure inventory only shrinks', () => {
  it('every tier contributes its full share of the corpus', () => {
    const manifest = readManifest();
    for (const tier of CARTOGRAPHY_TIERS) {
      expect(rowsOfTier(manifest, tier).length, tier).toBe(ROWS_PER_TIER);
    }
  });

  it('no tier throws on more rows than its frozen count', () => {
    const manifest = readManifest();
    /** @type {string[]} */
    const violations = [];
    for (const tier of CARTOGRAPHY_TIERS) {
      const throws = throwsOfTier(manifest, tier);
      const ceiling = FROZEN[tier].throws;
      if (throws > ceiling) {
        violations.push(
          `${tier}: ${throws} of ${ROWS_PER_TIER} real settlements raise a cartography premise `
          + `error; the frozen count is ${ceiling}. The stage's per-tier ceilings are `
          + 'CALIBRATIONS and this corpus is the ground they are calibrated against. '
          + 'Repair the premise that fires, re-record with '
          + 'UPDATE_CARTOGRAPHY_CALIBRATION=1, and LOWER this tier\'s number in FROZEN. '
          + 'Never raise a number: a tier that grew made the ground worse.',
        );
      }
    }
    expect(violations).toEqual([]);
  });

  it('HONESTY: no frozen row is stale', () => {
    // Without this, a repaired tier keeps its old headroom and the ratchet quietly
    // stops guarding it. A tier frozen at 0 asserts only that it stays at 0.
    const manifest = readManifest();
    /** @type {string[]} */
    const stale = [];
    for (const tier of CARTOGRAPHY_TIERS) {
      const throws = throwsOfTier(manifest, tier);
      const ceiling = FROZEN[tier].throws;
      if (ceiling > 0 && throws < ceiling) {
        stale.push(`${tier}: ${throws} < frozen ${ceiling} — bank the win, lower the number`);
      }
    }
    expect(stale).toEqual([]);
  });

  it('the recorded per-tier institution maximum is exactly what was frozen', () => {
    // EXACT, not a bound: this measures the GENERATOR. A literal table compared against
    // a manifest-derived maximum is two readings; deriving both sides from the manifest
    // would be the same reading twice and would rise with the corpus forever.
    const manifest = readManifest();
    /** @type {Record<string, number>} */
    const measured = {};
    for (const tier of CARTOGRAPHY_TIERS) {
      measured[tier] = rowsOfTier(manifest, tier)
        .reduce((best, [, value]) => Math.max(best, value.institutions), 0);
    }
    expect(measured).toEqual(Object.fromEntries(
      CARTOGRAPHY_TIERS.map((tier) => [tier, FROZEN[tier].maxInstitutions]),
    ));
  });

  it('no tier DRAWS more than its frozen block, so density cannot creep', () => {
    // A BOUND, not an exact pin, and deliberately so: the drawn block is a function of
    // the caps, and pinning it exactly would red on every deliberate cap change while
    // saying nothing the cap does not already say. As a bound it catches the case the
    // cap cannot — output growing under a FIXED cap, which would mean the layer started
    // emitting rows it did not emit before. Raising a cap on purpose reds this too, and
    // that is correct: a deliberate density change owes a deliberate re-record.
    const manifest = readManifest();
    /** @type {string[]} */
    const grown = [];
    for (const tier of CARTOGRAPHY_TIERS) {
      const drew = rowsOfTier(manifest, tier)
        .reduce((best, [, value]) => Math.max(best, value.cartoBuildings), 0);
      if (drew > FROZEN[tier].maxBuildings) {
        grown.push(`${tier}: drew ${drew} > frozen ${FROZEN[tier].maxBuildings}`);
      }
      // And the frozen figure is not stale either — the pair is what keeps it honest.
      if (drew < FROZEN[tier].maxBuildings) {
        grown.push(`${tier}: drew ${drew} < frozen ${FROZEN[tier].maxBuildings} — lower it`);
      }
    }
    expect(grown).toEqual([]);
  });
});

describe('W5 the headroom every cap actually has against real output', () => {
  it('NO tier\'s binding cap falls short of the maximum the real pipeline produces', () => {
    // This list held FOUR entries when the file landed — thorp, hamlet, village and
    // town, every one of them a tier that could not draw. It is empty now, and it is
    // spelled as a LIST rather than a per-tier assertion so a regression names the tier
    // and both numbers in its own failure message instead of saying "false".
    /** @type {string[]} */
    const short = [];
    for (const tier of CARTOGRAPHY_TIERS) {
      const cap = cartographyBand(T.MAXIMUM_INSTITUTION_BINDINGS, tier);
      if (cap < FROZEN[tier].maxInstitutions) {
        short.push(`${tier}: cap ${cap} < measured max ${FROZEN[tier].maxInstitutions}`);
      }
    }
    expect(short).toEqual([]);
  });

  it('every tier clears its measured maximum BY THE DECLARED HEADROOM, not barely', () => {
    // The complement of the list above, and strictly stronger than it: clearing the
    // maximum by one is not what BAND 21 signed. Each cap must be at least the measured
    // maximum times the declared headroom, which is the same arithmetic the derivation
    // performs — read back from the OTHER end, off the frozen inventory rather than off
    // the calibration table, so a calibration that silently drifted from the corpus
    // cannot satisfy both sides.
    /** @type {string[]} */
    const thin = [];
    for (const tier of CARTOGRAPHY_TIERS) {
      const cap = cartographyBand(T.MAXIMUM_INSTITUTION_BINDINGS, tier);
      const owed = Math.ceil((FROZEN[tier].maxInstitutions * CARTOGRAPHY_HEADROOM_PERMILLE) / 1000);
      if (cap < owed) thin.push(`${tier}: cap ${cap} < ${owed} owed at the declared headroom`);
    }
    expect(thin).toEqual([]);
  });

  it('the binding cap never exceeds the total building cap, at every tier', () => {
    // The invariant tests/domain/townCartographyBuildings.test.js also holds, restated
    // here because it is the CONSTRAINT any repair of the caps above must satisfy: a
    // flagship is drawn for every bound institution, so a binding cap over the total
    // building cap promises more flagships than the layer may ever emit. W6 proves it
    // holds by CONSTRUCTION; this one proves it holds of the tables actually in force.
    for (const tier of CARTOGRAPHY_TIERS) {
      expect(cartographyBand(T.MAXIMUM_INSTITUTION_BINDINGS, tier), tier)
        .toBeLessThanOrEqual(cartographyBand(T.MAXIMUM_CARTOGRAPHY_BUILDINGS, tier));
    }
  });
});

describe('W6 the caps ARE the derivation, and the invariant is structural', () => {
  it('all three tables in force are exactly what the derivation returns', () => {
    // The point of MF-CG1b. If this reds, somebody re-authored a cap as a literal that
    // happens to agree today, and the machinery is decoration.
    const derived = deriveCartographyCaps(CARTOGRAPHY_CALIBRATION, CARTOGRAPHY_HEADROOM_PERMILLE);
    expect(T.MAXIMUM_INSTITUTION_BINDINGS).toEqual(derived.bindings);
    expect(T.MAXIMUM_CARTOGRAPHY_BUILDINGS).toEqual(derived.buildings);
    expect(T.TC4_ROW_BYTES_BAND).toBe(derived.rowBytes);
    // Total over the ladder, so no tier can fall out of the derivation and read
    // `undefined` — which `<=` would silently pass.
    for (const tier of CARTOGRAPHY_TIERS) {
      expect(Number.isInteger(derived.bindings[tier]), tier).toBe(true);
      expect(Number.isInteger(derived.buildings[tier]), tier).toBe(true);
    }
    expect(Object.keys(derived.bindings).sort()).toEqual([...CARTOGRAPHY_TIERS].sort());
    expect(Object.keys(derived.buildings).sort()).toEqual([...CARTOGRAPHY_TIERS].sort());
  });

  it('SOURCE SCAN: the three cap fields are ASSIGNED from the derivation, not authored', () => {
    // The arm above compares VALUES, and a literal table that happens to agree with the
    // derivation today would sail straight through it — which is exactly the regression
    // this member exists to prevent. Only a source scan can tell "derived" from "equal".
    // This is the estate's single-writer-by-source-scan shape, applied to three fields.
    const source = readFileSync(TUNING_SOURCE, 'utf8');
    /** @type {string[]} */
    const authored = [];
    for (const field of [
      'MAXIMUM_INSTITUTION_BINDINGS', 'MAXIMUM_CARTOGRAPHY_BUILDINGS', 'TC4_ROW_BYTES_BAND',
    ]) {
      const assignment = new RegExp(`^\\s*${field}:\\s*(.+?),\\s*$`, 'm').exec(source);
      if (!assignment) authored.push(`${field}: no single-line assignment found at all`);
      else if (!/^DERIVED_CAPS\.[A-Za-z]+$/.test(assignment[1])) {
        authored.push(`${field} is assigned \`${assignment[1]}\`, not a DERIVED_CAPS field`);
      }
    }
    expect(authored).toEqual([]);
    // And DERIVED_CAPS itself is the derivation evaluated at the declared inputs, once.
    expect(source).toContain(
      'const DERIVED_CAPS = deriveCartographyCaps(\n  CARTOGRAPHY_CALIBRATION, CARTOGRAPHY_HEADROOM_PERMILLE,\n);',
    );
    // ANTI-VACUITY: the scan really read the tuning module and not an empty string. The
    // anchor is a field this member did NOT touch, so a file that lost its cap tables
    // entirely reds above rather than passing here.
    expect(source).toMatch(/^\s*MAXIMUM_WARDS: Object\.freeze\(\{$/m);
    expect(source.length).toBeGreaterThan(5000);
  });

  it('bindings <= buildings holds for ARBITRARY calibrations and headrooms', () => {
    // THE STRUCTURAL CLAIM, and the reason the cure does not have to violate the
    // invariant the way every hand-authored candidate did. The old tables satisfied it
    // by luck and an assertion; this derivation satisfies it by arithmetic, so the
    // proof is a sweep over hostile inputs rather than a reading of one table.
    const headrooms = [0, 1, 500, 1000, 1600, 4000, 100_000];
    const institutionSets = [
      { thorp: 0, hamlet: 0, village: 0, town: 0, city: 0, metropolis: 0 },
      { thorp: 1, hamlet: 1, village: 1, town: 1, city: 1, metropolis: 1 },
      { thorp: 999, hamlet: 999, village: 999, town: 999, city: 999, metropolis: 999 },
      // Inverted: the smallest tier carrying the largest roster, which is the shape a
      // per-tier hand-authored table gets wrong and a derivation cannot.
      { thorp: 900, hamlet: 700, village: 500, town: 300, city: 100, metropolis: 1 },
      CARTOGRAPHY_CALIBRATION.MAX_INSTITUTIONS,
    ];
    /** @type {string[]} */
    const violations = [];
    for (const headroom of headrooms) {
      for (const MAX_INSTITUTIONS of institutionSets) {
        const caps = deriveCartographyCaps({ MAX_INSTITUTIONS, MAX_BUILDING_ROW_BYTES: 443 }, headroom);
        for (const tier of CARTOGRAPHY_TIERS) {
          if (caps.bindings[tier] > caps.buildings[tier]) {
            violations.push(`h=${headroom} ${tier}: ${caps.bindings[tier]} > ${caps.buildings[tier]}`);
          }
        }
      }
    }
    expect(violations).toEqual([]);
    // ANTI-VACUITY: the sweep really ran, and it really varied the caps it produced.
    const spread = new Set(headrooms.map((headroom) => deriveCartographyCaps(
      CARTOGRAPHY_CALIBRATION, headroom,
    ).bindings.town));
    expect(spread.size).toBe(headrooms.length);
  });

  it('the declared headroom clears the CRITERION that set it, measured live', () => {
    // THE HEADROOM'S OWN JUSTIFICATION, re-derived from the manifest on every run
    // rather than quoted from a comment. Each of the twelve seed slices is a corpus of
    // the same shape and one twelfth the size; the factor by which the worst of them
    // under-measures its tier's maximum is the sharpest honest statement this corpus
    // can make about how far short of a true ceiling it might fall. The headroom must
    // be at least that. It reds if a re-record ever makes the corpus less stable.
    const manifest = readManifest();
    let worst = 0;
    /** @type {string} */
    let worstAt = '';
    for (const tier of CARTOGRAPHY_TIERS) {
      const tierRows = rowsOfTier(manifest, tier);
      /** @type {Map<string, number>} */
      const perSeed = new Map();
      for (const [key, value] of tierRows) {
        const seed = key.split('|')[5];
        perSeed.set(seed, Math.max(perSeed.get(seed) ?? 0, value.institutions));
      }
      // Non-vacuity: every seed must actually appear, or the minimum below is taken
      // over a set the rotation never filled and the ratio is meaningless.
      expect(perSeed.size, tier).toBe(CALIBRATION_SEEDS.length);
      const full = Math.max(...perSeed.values());
      const ratio = full / Math.min(...perSeed.values());
      if (ratio > worst) {
        worst = ratio;
        worstAt = `${tier} (${Math.min(...perSeed.values())} -> ${full})`;
      }
    }
    expect(worst, 'the seed slices agree suspiciously well — is the rotation live?')
      .toBeGreaterThan(1);
    expect(
      CARTOGRAPHY_HEADROOM_PERMILLE / 1000,
      `the worst single-seed slice under-measures by ${worst.toFixed(4)} at ${worstAt}, `
      + 'which is more room than the declared headroom leaves. Raise '
      + 'CARTOGRAPHY_HEADROOM_PERMILLE deliberately, or explain why this corpus is now '
      + 'a ceiling when it was not.',
    ).toBeGreaterThanOrEqual(worst);
  });
});

describe('W7 a corpus that outgrows the derived caps is LOUD', () => {
  it('the derivation\'s institution input is exactly what this corpus reads', () => {
    // The caps are only as good as the reading behind them, so the reading is pinned
    // to the corpus and not to a memory of it. EXACT in both directions: a calibration
    // above the corpus is unearned headroom, one below it is a cap that will bite.
    const manifest = readManifest();
    /** @type {Record<string, number>} */
    const measured = {};
    for (const tier of CARTOGRAPHY_TIERS) {
      measured[tier] = rowsOfTier(manifest, tier)
        .reduce((best, [, value]) => Math.max(best, value.institutions), 0);
    }
    expect(measured).toEqual({ ...CARTOGRAPHY_CALIBRATION.MAX_INSTITUTIONS });
  });

  it('the derivation\'s byte input is exactly the corpus\'s worst drawn row', () => {
    const worst = Object.values(readManifest())
      .reduce((best, value) => Math.max(best, value.cartoRowBytes), 0);
    expect(worst).toBe(CARTOGRAPHY_CALIBRATION.MAX_BUILDING_ROW_BYTES);
    expect(CARTOGRAPHY_CALIBRATION.CORPUS_ROWS).toBe(rows.length);
  });

  it('every recorded row fits under the caps derived from those inputs', () => {
    // Count AND bytes, per row, against the real derived budget — the same product the
    // stage computes at the line that raises the byte premise.
    const manifest = readManifest();
    /** @type {string[]} */
    const over = [];
    for (const [key, value] of Object.entries(manifest)) {
      const countCap = cartographyBand(T.MAXIMUM_CARTOGRAPHY_BUILDINGS, value.tier);
      if (value.cartoBuildings > countCap) {
        over.push(`${key}: drew ${value.cartoBuildings} > cap ${countCap}`);
      }
      if (value.cartoBuildings * value.cartoRowBytes > countCap * T.TC4_ROW_BYTES_BAND) {
        over.push(`${key}: ${value.cartoBuildings} x ${value.cartoRowBytes} B over `
          + `the ${value.tier} budget ${countCap * T.TC4_ROW_BYTES_BAND}`);
      }
    }
    expect(over).toEqual([]);
  });

  it('THE FALSIFIER: this same corpus does NOT fit the SUPERSEDED literals', () => {
    // Without this, "the corpus fits the caps" is a claim with no demonstrated
    // alternative and the three arms above could be passing on a corpus that fits
    // anything. The superseded binding caps are the arrangement of numbers that stood
    // in this file for months, and the roster counts are generator-driven — cap
    // independent — so the count they refuse is reproducible from the recorded rows.
    const manifest = readManifest();
    /** @type {Record<string, number>} */
    const refused = {};
    for (const value of Object.values(manifest)) {
      if (value.institutions > SUPERSEDED.bindings[value.tier]) {
        refused[value.tier] = (refused[value.tier] ?? 0) + 1;
      }
    }
    // The 266 binding-cap throws MF-CG1 recorded at 00e7af61, re-derived here from the
    // roster counts alone. The four tiers are the four that could not draw.
    expect(refused).toEqual({ thorp: 47, hamlet: 72, village: 83, town: 84 });
    expect(Object.values(refused).reduce((sum, count) => sum + count, 0)).toBe(286);
    // And the superseded per-row byte band is below what the corpus really produces,
    // which is the second premise the cap change alone could never have reached.
    const worstRow = Object.values(manifest)
      .reduce((best, value) => Math.max(best, value.cartoRowBytes), 0);
    expect(worstRow).toBeGreaterThan(SUPERSEDED.rowBytes);
  });
});

describe('W8 the drawn corpus does not repeat itself', () => {
  it('ZERO drawn buildings anywhere in the corpus stand on another building', () => {
    const manifest = readManifest();
    /** @type {string[]} */
    const stacked = [];
    let drawn = 0;
    for (const [key, value] of Object.entries(manifest)) {
      if (value.cartoBuildings < 0) continue;
      drawn += value.cartoBuildings;
      if (value.cartoDupExact !== 0) {
        stacked.push(`${key}: ${value.cartoDupExact} of ${value.cartoBuildings} rows stacked`);
      }
    }
    expect(stacked).toEqual([]);
    // ANTI-VACUITY, and it is not decoration: `cartoDupExact` reads −1 on a row that
    // could not draw, and a corpus that stopped drawing would satisfy the line above
    // by drawing nothing at all. This closes the same hole W4's throw census closes.
    expect(drawn).toBeGreaterThan(40_000);
    expect(Object.keys(manifest).length).toBe(rows.length);
  });

  it('each tier repeats a SHAPE at exactly its frozen reading, under the derived ceiling', () => {
    const manifest = readManifest();
    /** @type {string[]} */
    const drift = [];
    for (const tier of CARTOGRAPHY_TIERS) {
      const tierRows = rowsOfTier(manifest, tier).filter(([, value]) => value.cartoBuildings >= 0);
      const drawn = tierRows.reduce((sum, [, value]) => sum + value.cartoBuildings, 0);
      const repeated = tierRows.reduce((sum, [, value]) => sum + value.cartoDupTranslate, 0);
      const permille = Math.round((1000 * repeated) / drawn);
      const ceiling = duplicateCeilingPermille(tier);
      if (permille !== DUPLICATES[tier].permille) {
        drift.push(`${tier}: reads ${permille} permille, frozen at ${DUPLICATES[tier].permille}`);
      }
      if (permille > ceiling) drift.push(`${tier}: ${permille} permille over its ${ceiling} ceiling`);
      if (tierRows.length !== ROWS_PER_TIER) drift.push(`${tier}: ${tierRows.length} rows drew`);
    }
    expect(drift).toEqual([]);
    // The ceilings are the derivation evaluated, not a second table: a reader can
    // check every one of them by hand against DUPLICATES and the declared headroom.
    // ⚠ THESE THREE ROSE WITH THE READING, AND THAT IS THE DERIVATION, NOT A RAISED CAP.
    // `duplicateCeilingPermille` is reading + CARTOGRAPHY_HEADROOM_PERMILLE, so re-freezing
    // village/town/city upward in T8 lifts their derived ceilings with them (106 -> 125,
    // 95 -> 103, 82 -> 84). The invariant that actually bounds this surface is the headroom
    // constant, which is UNCHANGED; the ceiling is a readout of it, and a reader who wants
    // the bound should read the headroom, not these six numbers.
    expect(CARTOGRAPHY_TIERS.map(duplicateCeilingPermille)).toEqual([236, 349, 125, 103, 84, 93]);
    // And the derivation is live — a hypothetical reading derives its own ceiling.
    expect(Math.ceil((100 * CARTOGRAPHY_HEADROOM_PERMILLE) / 1000)).toBe(160);
  });

  /**
   * THE ARM THAT MAKES W8 CONVICT A SOURCE CHANGE, and the reason it exists.
   *
   * The two arms above read the FROZEN record, so a packer regression cannot red them
   * until somebody re-records — the same structural gap MF-CG1's W2 exists to close for
   * the rest of the corpus. This one re-measures LIVE, through the real pipeline, on the
   * six rows that carry each tier's largest canonical roster. That choice is not
   * arbitrary: over-subscription is what the old mod-4 wrap turned into stacking, so the
   * argmax rows are exactly the rows where a regression appears FIRST. Six full pipeline
   * generations is a second or two; the whole corpus would be ninety.
   */
  it('LIVE: each tier\'s argmax row re-measures at ZERO stacked buildings, and matches its record', () => {
    const manifest = readManifest();
    /** @type {Map<string, { key: string, value: Row }>} */
    const argmax = new Map();
    for (const [key, value] of Object.entries(manifest)) {
      const best = argmax.get(value.tier);
      if (!best || value.institutions > best.value.institutions) argmax.set(value.tier, { key, value });
    }
    // The selection covered the whole ladder — a tier missing here would be a silent
    // hole in the only live arm this section has.
    expect([...argmax.keys()].sort()).toEqual([...CARTOGRAPHY_TIERS].sort());
    const byKey = new Map(rows.map((row) => [calibrationKeyOf(row), row]));
    /** @type {string[]} */
    const failures = [];
    let measured = 0;
    for (const [tier, { key, value }] of argmax) {
      const source = byKey.get(key);
      if (!source) {
        failures.push(`${tier}: ${key} is recorded but the corpus rule does not produce it`);
        continue;
      }
      const live = measureCalibrationRow(source);
      measured += Math.max(0, live.cartoBuildings);
      if (live.cartoDupExact !== 0) {
        failures.push(`${tier} ${key}: ${live.cartoDupExact} of ${live.cartoBuildings} rows stacked LIVE`);
      }
      if (live.cartoDupTranslate !== value.cartoDupTranslate) {
        failures.push(`${tier} ${key}: translate live ${live.cartoDupTranslate} vs recorded ${value.cartoDupTranslate}`);
      }
      if (live.cartoBuildings !== value.cartoBuildings) {
        failures.push(`${tier} ${key}: drew ${live.cartoBuildings} live vs recorded ${value.cartoBuildings}`);
      }
    }
    expect(failures).toEqual([]);
    // ANTI-VACUITY: the six rows actually drew, so the zero above is a measurement.
    expect(measured).toBeGreaterThan(600);
  }, 300_000);

  it('CONVICTING CONTROL: the census instrument reds on a block that IS duplicated', () => {
    const clean = [
      { footprint: [[0, 0], [10, 0], [10, 10]] },
      { footprint: [[0, 0], [20, 0], [20, 20]] },
      { footprint: [[5, 5], [10, 0], [10, 10]] },
    ];
    // POSITIVE: three distinct footprints read zero under BOTH readings.
    expect(duplicateFootprintRows(clean, exactFootprintKey)).toBe(0);
    expect(duplicateFootprintRows(clean, translateFootprintKey)).toBe(0);
    // MUTATION 1 — one footprint copied onto another row, which is exactly the shape
    // the pre-CG-2 mod-4 wrap produced. Both readings convict, and they convict THREE
    // rows rather than one, because a duplicate group counts every member.
    const stacked = [clean[0], clean[1], { footprint: [[0, 0], [10, 0], [10, 10]] }];
    expect(duplicateFootprintRows(stacked, exactFootprintKey)).toBe(2);
    const trio = [...stacked, { footprint: [[0, 0], [10, 0], [10, 10]] }];
    expect(duplicateFootprintRows(trio, exactFootprintKey)).toBe(3);
    // MUTATION 2 — the same shape MOVED. The exact reading acquits it and the
    // translate reading convicts it, which is what makes them two readings and not
    // one written twice. This is the medial subdivision's own signature: subcells 0,
    // 1 and 2 of any triangle are translates of one another.
    const moved = [clean[0], clean[1], { footprint: [[100, 100], [110, 100], [110, 110]] }];
    expect(duplicateFootprintRows(moved, exactFootprintKey)).toBe(0);
    expect(duplicateFootprintRows(moved, translateFootprintKey)).toBe(2);
    // MUTATION 3 — the same shape, ROTATED to start at another vertex. The translate
    // reading still convicts, which is the property its start-rotation buys; a naive
    // JSON key would acquit here and the census would under-report by the share of
    // rows the packer happens to emit from a different corner.
    const rotated = [clean[0], { footprint: [[10, 0], [10, 10], [0, 0]] }];
    expect(duplicateFootprintRows(rotated, exactFootprintKey)).toBe(0);
    expect(duplicateFootprintRows(rotated, translateFootprintKey)).toBe(2);
  });
});
