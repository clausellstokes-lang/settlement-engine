/**
 * domain/townMap/fabric/partitionDress.js — ⭐⭐⭐ **DRESS-1 · THE STRUCTURAL INK.**
 * DESIGN_SPINE_COMPLETION §1 (DRESS-1 half) as amended by PA.3/PA.4/PA.6 and OA.1–OA.5.
 *
 * ⭐⭐⭐ **WHAT THIS FILE IS.** SPINE-1 built `projectPage`, which produces a fully-formed,
 * painter-ready page frame — and until now NOTHING CONSUMED IT AS INK: its only readers were a
 * census printing counts and a test asserting a bijection. §686.6(iii) says so in the ledger
 * (*"`renderFolio.mjs` holds no reference to `spinePartition`/`projectPage`/`partitionView`"*).
 * This module is the ink: page frame + wall publication + a closed lens vocabulary → SVG.
 *
 * ⭐⭐ **THE FOUR CURES IT IS BUILT AROUND, EACH A REVIEW CONVICTION, NOT A PREFERENCE:**
 *   I4  *"buildings/yards/plots merge into one pale texture"* → the street ground and the plot
 *       ground are SEPARATE TONES, and the separation is asserted by the census, not hoped for.
 *   I3  *"~60 % of fabric at near-paper value … the 320 px squint inverts"* → a VALUE FLOOR:
 *       no fabric fill sits within one value step of the paper. See `VALUE_STEP`.
 *   I7  *"stray grain-line family (stroke 0.25 / opacity 0.72, 814 subpaths) crosses streets,
 *       buildings, the river and the open sea"* → every grain line is SCANLINE-CLIPPED to the
 *       face that owns it. The clip is exact, so the §650.2 clip census reads a true zero.
 *   B7  *"flat-tinted footprints with no hips / two-tone planes / chimneys / eaves shadow; the
 *       ridge segments … OVERSHOOT eaves (max 52.6 u)"* → hf208's plan-view roof grammar, with
 *       the ridge clipped to **the run's own dissolved footprint** (PA.6), never the chunk.
 *   I10 *"symmetric tick-ladder band reads as railway … ditch is plain dashes"* → the band is
 *       coursed rubble-fill between two edges with the ditch as RADIATING HACHURE (hf314).
 *
 * ⭐⭐ **PA.6's LOOK, RULED AND OBEYED: the built band with visible toft ground wins.** A mass
 * draws the BUILT FOOTPRINT — the run IS the eaves line (hf208 / hf208's own plan rule) — and the
 * YARDS REMAIN GROUND at the plot-ground tone. That is what makes I4's separation visible at page
 * scale: three tones, not one wash.
 *
 * ⛔ **NO CONSTANT IS MINTED HERE.** Every number below is either (a) read from the estate's own
 * signed tables (`WALL_BAND`, `COMB_PITCH_FRONTAGES`, `TEXTURE_PITCH_FRONTAGES`,
 * `TEXTURE_PATCH_SHARE`, `STAIR_PITCH_FRONTAGES`, `V_QUAY_BAND`), (b) expressed in PLOT
 * FRONTAGES so it survives the tier ladder (renderFolio's own §179 lesson: ink stated in view
 * units is right at one tier and wrong at the rest), or (c) the §9.7 VALUE STEP restated. The two
 * wear thresholds are PA.4's chair-signed provisionals and live in `wallPublication.js`, not here.
 *
 * PURITY: pure. No `Date`, no `Math.random`, no rng — the dress reads the publication's already
 * seeded decisions. A view that draws is a view that cannot be re-derived (partitionView's law).
 */

import { r2, splitPolygon, centroid, absArea, cosI, sinI } from './fabricGeometry.js';
import { resolveLens, luminance, HATCH } from './folioLenses.js';
import { V_QUAY_BAND } from './waterWorks.js';
import {
  COMB_PITCH_FRONTAGES, TEXTURE_PITCH_FRONTAGES, TEXTURE_PATCH_SHARE, STAIR_PITCH_FRONTAGES,
} from './rampartWorks.js';

export const DRESS_SCHEMA_VERSION = 1;

/**
 * ⭐⭐ **THE VALUE STEP — RESTATED, NOT MINTED.** `folioLenses.lensContrast` already defines it:
 * *"each step ≈ 1.28×, so three ≈ 2.1×"*. I3's cure is "no fabric falls to paper", and the
 * estate's own unit for "one value apart" is this ratio. Using it means the floor is the same
 * quantity §9.7's binding sub-law is written in, on cream paper and on a night ground alike.
 */
export const VALUE_STEP = 1.28;

/**
 * ⭐ **THE GRAIN-LINE FAMILY, KEPT AND CLIPPED (I7).** The review did not convict the family's
 * WEIGHT — it convicted its REACH: *"crosses streets, buildings, the river, and the open sea"*.
 * The stroke and opacity are therefore carried forward verbatim and the cure is the clip.
 */
export const GRAIN = Object.freeze({ stroke: 0.25, opacity: 0.72 });

/** Draw order. Ground first, pieces over it, marks last — `PAGE_LAYERS` with the ink's own rows. */
export const DRESS_LAYERS = Object.freeze(['paper', 'fields', 'relief', 'water', 'ground', 'voids',
  'masses', 'roofs', 'band', 'gates', 'crossings', 'quays', 'terraces', 'decline', 'state', 'marks']);

/** Every `<g id>` the dress can emit, so the legend census has a closed roster to check against. */
export const DRESS_GROUPS = Object.freeze([
  'dress-paper', 'dress-fields', 'dress-grain', 'dress-water', 'dress-shore', 'dress-ground',
  'dress-street', 'dress-voids', 'dress-yards', 'dress-masses', 'dress-eaves', 'dress-ridges',
  'dress-hips', 'dress-planes', 'dress-chimneys', 'dress-unitlines', 'dress-band', 'dress-coursing',
  'dress-comb', 'dress-towers', 'dress-ditch', 'dress-stairs', 'dress-gates', 'dress-decks',
  'dress-ford', 'dress-stepping', 'dress-quays', 'dress-vquay', 'dress-relict',
  /** ⚠ E11's group belongs on this roster: the legend census found it TAUGHT-BUT-UNDRAWABLE on
   *  all 18 leaves, which is precisely the one-directional failure the census exists to catch —
   *  and it caught it in its own author's roster. */
  'dress-accessible',
  /**
   * ⭐⭐⭐ ⟦CAR-SEATING W3⟧ THE INSTITUTION REGISTER MARK — the FIRST ink this page carries for the
   * seated institutions, and deliberately a MARK rather than a silhouette. A silhouette is massing
   * work: it owes shape variants, a monumental budget and the massing bijection pin, and none of
   * those belong to a seating car. A mark owes one thing — that something IS here and the register
   * says what — which is exactly what the seating pass now knows and the page previously did not.
   * ⛔ ITS GLYPH IS LICENSED, NOT INVENTED. `shapeCode.js`'s `mark` archetype already defines it:
   * *"A SINGLE SMALL FIGURE — the corpus's licensed plan glyph"*, sourced `hf303-legend-masterplate`.
   * The `plate` column is not decoration (a row with no plate is the `hf61-chrome-plate` failure
   * this file names), so the legend row below cites that plate and no other.
   */
  'dress-register',
  /**
   * ⭐⭐⭐ ⟦DRESS-2 W1⟧ **THE §10 STATE EXPRESSIONS — REVIEW I2's CURE, AND IT IS A BRIDGE RATHER
   * THAN A DRAWING.** §696.4: a reader with no knowledge of this project looked at eighteen plates
   * and said four of them *"all appear to be the same underlying map… rendered four separate
   * times"*. Decoded, those four are `town`, `siege`, `plague`, `famine` — and the reader was not
   * describing an impression. MEASURED at this tip: those four plates share ONE sha256
   * (`1a4dc52d…`), as do `city` and `migration` (`9078699e…`). **The eighteen-leaf corpus was
   * FOURTEEN distinct drawings.**
   *
   * ⛔⛔ AND THE CAUSE IS NOT THAT THE TRUTH IS MISSING. `fabric.stateMarks` has carried the whole
   * §10 register all along — nine besieger's tents at a measured bowshot, a lazar house held far
   * out, a barred gate per law, six empty stall outlines — ground-law-swept and explicitly
   * protected from small-body suppression (`minFootprint.js`: *"A SIEGE TENT AND A QUARANTINE BAR
   * ARE NOT BUILDINGS… suppressing a besieger's tent for being small would delete a state
   * expression the §10 law requires to be visible"*). It reached `renderFolio` §15b and **nothing
   * on the page path**: `partitionInputs` carries nine keys and no state, so the partition never
   * learns the leaf is besieged. The cure is the SEATING shape one wave later — carry the truth
   * across the bridge, do not mint it.
   *
   * ⛔ ONE FAMILY PER GROUP, DELIBERATELY. §692.9's caution is that L-REG-34's census passes on a
   * BIJECTION and not on legibility, so a glyph that shares an id with another glyph is taught by
   * a row that teaches two things. Each family below is its own group and its own legend row.
   */
  'dress-camp', 'dress-barred', 'dress-emptystall', 'dress-watchfire', 'dress-trampled',
  'dress-barricade',
  /**
   * ⭐⭐⭐ ⟦DRESS-2 W2⟧ **RELIEF — I6's CURE AND §646.2's CONVICTION, AND IT IS A BRIDGE TOO.**
   * §646.2 convicted *"ZERO relief marks on the whole sheet against a steep-hills cartouche"*, and
   * on this page that is not an exaggeration but a literal fact: `partitionView.js` and this file
   * both contained **zero occurrences of the word "relief"** before this wave. Meanwhile
   * `fabric.relief` has been publishing 42–191 hachures, 7–16 form-lines, 1–26 terraces, crags and
   * marsh per leaf, derived, budgeted, and read by `renderFolio` alone. The second bridge.
   *
   * ⛔ **THE PROFILE HILL IS REFUSED, AND THE DETAIL REGISTER IS WHY.** The legacy draws
   * `relief.hills` as splayed profile molehills. §8 of the register rules that the profile system
   * *"is offered by hf376 as an ALTERNATIVE register, not the default"* and that **our top-down
   * geometry uses hachure/contour, reserving profile for the licensed tokens.** A plan page that
   * carried profile hills would be mixing registers on the one axis the projection doctrine is
   * strictest about, so `relief.hills` is read, counted, and deliberately not drawn.
   */
  'dress-hachure', 'dress-formline', 'dress-terrace', 'dress-crag', 'dress-marsh',
  /**
   * ⭐⭐⭐ ⟦REG-D⟧ **THE DECLINE LADDER — THE PIECES THAT EMPTIED, DRAWN AT THE STAGE THE LEDGER
   * REACHED.** `partitionDecline.js` has been minting `LOSSREGION` faces since SPINE-2 and this
   * file contained **zero occurrences of the word** before this wave: 467 faces on `highwater`,
   * 2.598 % of that plate's area, drawing nothing at all.
   *
   * ⛔ **AND THE DEFECT IS NOT THE ONE THE ABSENCE SUGGESTS — CORRECTED AGAINST THE PLATE ITSELF.**
   * The first spelling of this note said the ruins "render as bare paper". They do not, and the
   * crop says so: the WAYS of a dead quarter are still drawn, so what a reader saw was **a street
   * grid with completely empty blocks**, with the seated institutions' register marks floating in
   * ground that carried no ink. That reads as an UNFINISHED DRAWING rather than a ruined one —
   * a worse failure than a hole, because a hole says *nothing stood here* and an empty grid says
   * *the artist stopped*.
   *
   * ⛔ **NO INVENTED DECAY, AND THE SHAPE OF THE FILE ENFORCES IT.** Every mark below is keyed by
   * `RUIN_DRESS`, whose keys are checked against the schema the publication carries — so a state
   * the ledger never reached draws nothing, and a state the schema gains without a dress reds.
   * The dress derives no age, no severity and no stage: it reads `state`, `stageClock` and
   * `pressureClock` off the published record and draws the rung they name.
   *
   * ⚠ **INK ONLY — NOT ONE DECLARED TONE MOVES.** A ruin's ground is not a new fabric role, and
   * minting one would walk straight into the three failures the tone ladder below records (the
   * rung that became a ceiling, the night-lens direction, i5's `water:ground` floor). hf323 draws
   * the distinction the corpus actually uses: *"roofed = white interior, unroofed ruin = hatched"*
   * — the hatch IS the tone, and the value census is untouched by construction.
   */
  'dress-ruin-standing', 'dress-ruin-unroofed', 'dress-ruin-footings', 'dress-ruin-clearing',
  'dress-soilmark',
]);

/** ⟦DRESS-2 W2⟧ the relief families, named once so a census cannot drift from the ink */
export const RELIEF_GROUPS = Object.freeze([
  'dress-hachure', 'dress-formline', 'dress-terrace', 'dress-crag', 'dress-marsh',
]);

/**
 * ⭐⭐⭐ **I6's CURE, STATED AS A RULE RATHER THAN AS AN INTENTION: A HACHURE IS A MEMBER OF A RUN
 * OR IT IS NOT DRAWN.** The review convicted the relief marks as *tick noise* — independent
 * one-segment strokes scattered over open ground, which is exactly what `renderFolio` emits
 * (`for (const h of relief.hachures) hach += M…L…`, one segment per mark, no structure at all).
 * hf112's grammar is the opposite: *strokes radial to slope, darker and denser as it steepens*,
 * organised into **spur-and-coombe forms** — that is, into RUNS that share a fall line.
 *
 * So the marks are grouped by their own downslope bearing and their own neighbourhood, and a group
 * that cannot reach `RUN_MIN` members is **dropped rather than drawn**. A lone tick on an open
 * hillside is the defect; three of them agreeing is a landform. The census counts both, so the
 * drop is visible rather than silent.
 */
export const RUN_MIN = 3;
/** bearing agreement for run membership, in degrees — hf112's spur-and-coombe grain */
export const RUN_ARC = 30;

/**
 * ⭐⭐ ⟦DRESS-2 W1⟧ **THE §10 SUBSET OF `DRESS_GROUPS`, NAMED ONCE SO THE CENSUS CANNOT DRIFT.**
 * The scenario element-diff counts a mark only if it exists BECAUSE the settlement is in a stated
 * condition, and this is that roster. Keeping it here rather than in the census is what makes the
 * two impossible to disagree: a family added to the dress without being added here would be
 * invisible to the census, so the roster lives beside the ink it names.
 */
export const STATE_GROUPS = Object.freeze([
  'dress-camp', 'dress-barred', 'dress-emptystall', 'dress-watchfire', 'dress-trampled',
  'dress-barricade',
]);

/** ⟦REG-D⟧ the decline families, named once so `declineCensus` cannot drift from the ink. */
export const DECLINE_GROUPS = Object.freeze([
  'dress-ruin-standing', 'dress-ruin-unroofed', 'dress-ruin-footings', 'dress-ruin-clearing',
  'dress-soilmark',
]);

/**
 * ⭐⭐⭐ ⟦REG-D⟧ **THE STATE → RUNG TABLE. THE LADDER IS hf379's, NOT OURS.**
 *
 * DETAIL-REGISTER §11: *"**hf379-spec-ruin-stages** (REQUIRED): eight decay states of one house —
 * lived-in, empty-but-sound, unroofed (hatched), walls-failing (tree in the footprint), footings,
 * platform, under-the-plough (furrows wrap the resistant patch), lost-but-for-the-ground (soil-mark
 * + a dog-leg in the path as the only witness)"*, and *"hf379's later stages are the plan-view
 * vocabulary for absence (dashed ghosts, stipple debris, soil-mark hatch)"*. The schema's six
 * states are mapped ONTO that ladder rather than beside it; every row names the rung it took.
 *
 * ⛔⛔ **`CONTACTED` AND `FROZEN_MID_BITE` SHARE ONE FAMILY, AND THE REASON IS A MEASUREMENT OF THE
 * MEDIUM, NOT A CONVENIENCE.** The two states differ by exactly one thing: whether demand is STILL
 * being spent on the ruin. That is a fact about the NEXT epoch, not about the ground — at the
 * instant the map draws, a half-cleared ruin under a live front and a half-cleared ruin whose
 * front stopped are the same object in the same condition. §695.7's law is the one that applies:
 * *"a gate can fail by asking too little OR by asking the impossible, and only measuring the
 * question against the medium tells you which."* Minting a second glyph to separate them would be
 * inventing a distinction the world does not draw — the same refusal `dress-barred` already
 * records for `barredGate` vs `quarantineBar`. What the family DOES carry is the honest half: the
 * SHARE the clearing reached, straight off `pressureClock / law.reclaimCost`.
 *
 * ⚠ THE `walls-failing` RUNG (a tree in the footprint) IS DELIBERATELY UNUSED. Our schema has no
 * state between DEBRIS and BREAKING_DOWN, and drawing a rung no state reaches is the whole of what
 * "no dress without a state" forbids.
 */
export const RUIN_DRESS = Object.freeze({
  INTACT: Object.freeze({
    group: 'dress-ruin-standing',
    rung: 'hf379 rung 2 — empty-but-sound',
    mark: 'the footprint outlined and nothing inside it',
    why: 'the house still stands; what is gone is the household. In plan the only difference'
      + ' between a lived-in house and an empty one is the roof furniture, so the mark is the'
      + ' eaves line WITHOUT the ridge, hips, planes or chimney a mass would carry',
  }),
  DEBRIS: Object.freeze({
    group: 'dress-ruin-unroofed',
    rung: 'hf379 rung 3 — unroofed (hatched)',
    mark: 'the footprint outlined and hatched',
    why: 'hf323 draws the same distinction on the church ladder in one clause — "roofed = white'
      + ' interior, unroofed ruin = hatched" — so the hatch is the corpus\'s own sign for a'
      + ' standing shell open to the sky, and it needs no new tone to say it',
  }),
  CONTACTED: Object.freeze({
    group: 'dress-ruin-clearing',
    rung: 'hf379 read backwards — the ladder running the other way',
    mark: 'the hatch stops where the clearing reached; the cleared share is left as ground',
    why: 'a ruin under the growth front is being taken back, and the ledger records exactly how'
      + ' far it got in `pressureClock` against `law.reclaimCost`. The drawn share is that'
      + ' quotient and nothing else',
  }),
  BREAKING_DOWN: Object.freeze({
    group: 'dress-ruin-footings',
    rung: 'hf379 rungs 5–6 — footings / platform ("dashed ghosts")',
    mark: 'a dashed ghost of the footprint, nothing inside',
    why: 'the walls are down to their footings and the plot is legible only as a rectangle in the'
      + ' grass. ⚠ THE DASH IS LICENSED HERE AND CONVICTED ELSEWHERE: review I10 struck dashes'
      + ' for the DITCH because the corpus draws a ditch as radiating hachure — hf379 names the'
      + ' dashed ghost as the plan-view vocabulary for absence, which is the opposite case',
  }),
  FROZEN_MID_BITE: Object.freeze({
    group: 'dress-ruin-clearing',
    rung: 'hf379 read backwards — the ladder stopped',
    mark: 'the hatch stops where the clearing reached; the cleared share is left as ground',
    why: 'identical to CONTACTED at the instant the map draws — see this table\'s own note. The'
      + ' one FROZEN region in the corpus stands at `pressureClock` 1.00 of a cost of 2, so it'
      + ' draws exactly half taken',
  }),
  RECLAIMED: Object.freeze({
    group: 'dress-soilmark',
    rung: 'hf379 rungs 7–8 — under-the-plough / lost-but-for-the-ground',
    mark: 'a dotted trace of the lost plot on ground now worked',
    why: '⛔ THE FACE IS NO LONGER A LossRegion — `recoverByPressure` returns it to FIELD, so the'
      + ' reclamation survives ONLY in `state.losses` (PA.8 says exactly this) and the mark has to'
      + ' be joined back to the field face by footprint id. What the reader sees is the corpus\'s'
      + ' own telltale for a lost feature: the ground is worked, and the old plot still shows',
  }),
});

const DEG = Math.PI / 180;

/**
 * ⭐⭐⭐ **THE PAGE-REGISTER QUANTUM, AND IT IS A MEASURED CURE FOR A MEASURED RED.** The first
 * full-corpus render of this dress put the metropolis at **839,019 B against its signed 830,000 B
 * ceiling — OVER by 9,019 (1.09 %)**, and the byte table binds FIRST at town+ by §641.4's own
 * signature. Byte attribution found no single hog (the largest group was 14.5 %), so a cut would
 * have had to delete a whole family of marks the review asked for. The cause was elsewhere: every
 * coordinate was written at TWO decimals.
 *
 * ⭐ At page register the frame is ~1,200 world units drawn into 1,000–2,200 px, so **0.1 world
 * unit is 0.08–0.18 px** — under half a pixel at the highest raster this estate shoots.
 *
 * ⛔⛔ **AND THE CONTROL CORRECTED THE CLAIM THAT WAS FIRST WRITTEN HERE.** This comment said the
 * cure had *"NO drawing change"*. `harness/laneDRESS1/precisionControl.mjs` renders the metropolis
 * at both precisions and diffs the 2,200 px rasters, and the honest figures are:
 * **839,019 → 707,981 B (−131,038, −15.62 %)** with **max channel Δ 38 and mean Δ 0.0289 over
 * 4,840,000 px** — sub-perceptual in aggregate (0.011 % of the channel), NOT byte-identical.
 * Against the liveness plant (whole units) at max Δ 119 / mean Δ 0.163, the cure moves **5.6×
 * less in the mean**. THE SHAPES DRAWN ARE THE SAME SHAPES; what moves is where their vertices
 * land inside a pixel, which is an anti-aliasing shift at edges and nothing else. Recorded at its
 * measured size rather than as the zero the first sentence claimed.
 *
 * ⚠ `fabricGeometry.r2` IS DELIBERATELY NOT CHANGED. It is the LEGACY renderer's shared rounding;
 * moving it would move the shipped corpus render and take this wave's dormancy claim with it.
 * The quantum is local to the dress, which is the only surface it governs.
 */
export const PAGE_QUANTUM_DECIMALS = 1;

/**
 * ⚠ **A MODULE-SCOPED QUANTUM, AND IT EXISTS FOR EXACTLY ONE CALLER.** `precisionControl.mjs` has
 * to render the SAME geometry at two precisions to prove the cure invisible; re-rounding the
 * already-rounded output is a NO-OP, which is what the control's first execution actually
 * measured (`707981 → 707981, −0 B`) and reported as a −0 % saving. `dressPage` sets this from
 * `opts.decimals` on entry and restores it in a `finally`, so the default is the only value any
 * production caller ever sees and no state can survive a throw.
 */
let QUANTUM = 10 ** PAGE_QUANTUM_DECIMALS;
const q = (v) => Math.round(v * QUANTUM) / QUANTUM;

/** SVG path data for a closed ring at the page quantum. */
export function polyPath(poly) {
  let s = '';
  for (let i = 0; i < poly.length; i++) s += (i === 0 ? 'M' : 'L') + q(poly[i][0]) + ' ' + q(poly[i][1]);
  return s + 'Z';
}

/** SVG path data for an open polyline at the page quantum. */
export function linePath(pts) {
  let s = '';
  for (let i = 0; i < pts.length; i++) s += (i === 0 ? 'M' : 'L') + q(pts[i][0]) + ' ' + q(pts[i][1]);
  return s;
}

/**
 * ⭐⭐⭐ **DRESS ONE PAGE FRAME.**
 *
 * @param {any} page a `PARTITION_PAGE_FRAME` from `projectPage`
 * @param {{lens?:string, roadWidth?:number, walls?:any, water?:any, crossings?:any,
 *          quays?:any, accessible?:boolean, tier?:string, seating?:any, state?:any,
 *          relief?:any, losses?:any}} [opts]
 *
 * ⚠ `opts.state` is `fabric.stateMarks`, handed in the same way `walls` and `seating` already are
 *   — the §10 register is a fact ABOUT the settlement rather than a face of the partition, and
 *   `partitionInputs`' nine keys carry no state, so it cannot arrive off the page.
 *
 * ⭐⭐ ⟦REG-D⟧ `opts.losses` IS `partition.losses` — `publishLosses`' own record — AND IT ARRIVES
 *   AS PLAIN DATA FOR A STRUCTURAL REASON. `stageManifest`'s S22 row states it outright: *"It
 *   takes NO partition module: the dress consumes a PAGE FRAME and a WALL PUBLICATION as plain
 *   data, which is why the ink can be judged without the constructor being in scope."* Importing
 *   `partitionDecline.js` for `LOSS_STATES`/`LOSS_LAW` would have added a backward stage edge and
 *   broken that property to save one parameter. Instead the schema and the law RIDE the record,
 *   and `declineCensus` asserts `RUIN_DRESS`'s keys against `losses.schema.states` — so a schema
 *   drift is a red rather than a silently undrawn state.
 *   ⚠ It is also why folio dormancy holds by construction: `renderFolio` never receives a page,
 *   never receives a loss record, and is not touched by this wave.
 */
export function dressPage(page, opts = {}) {
  const keptQuantum = QUANTUM;
  if (Number.isFinite(opts.decimals)) QUANTUM = 10 ** opts.decimals;
  try {
    return dressPageInner(page, opts);
  } finally {
    QUANTUM = keptQuantum;
  }
}

function dressPageInner(page, opts) {
  const LENS = resolveLens(opts.lens);
  const rw = opts.roadWidth || 5;
  const T = tones(LENS, opts);
  const INK = inkScale(rw, LENS.ink);
  const out = [];
  const prims = { n: 0 };
  const census = {
    grainSegments: 0, grainOutside: 0, ridges: 0, ridgeClipped: 0, ridgeOutside: 0,
    masses: 0, planes: 0, hips: 0, chimneys: 0, unitLines: 0,
    bandFaces: 0, coursing: 0, towers: 0, gatehouses: 0, ditchHachure: 0,
    waterFaces: 0, shoreStrokes: 0, decks: 0, fords: 0, steppingStones: 0, quays: 0, vquay: 0,
    relictDressed: 0, relictSuppressed: 0, registerMarks: 0,
    /** ⟦DRESS-2 W1⟧ the §10 register, counted per FAMILY so a scenario diff is attributable */
    stateBodies: 0, barredGates: 0, emptyStalls: 0, watchFires: 0, trampled: 0, barricades: 0,
    stateExpressed: 0,
    /** ⟦DRESS-2 W2⟧ relief — the DROPPED count is as load-bearing as the drawn one (I6) */
    hachureRuns: 0, hachuresDrawn: 0, hachuresDropped: 0, formLines: 0, terraces: 0,
    crags: 0, marshTicks: 0, profileHillsRefused: 0, reliefMarks: 0,
    /**
     * ⟦REG-D⟧ the decline, counted PER RUNG so the totality census is attributable — and
     * `ruinUndressed` is the load-bearing one: a LOSSREGION face whose state has no dress is the
     * failure this whole family exists to make impossible, so it is counted rather than assumed 0.
     */
    ruinFaces: 0, ruinStanding: 0, ruinUnroofed: 0, ruinFootings: 0, ruinClearing: 0,
    ruinHatch: 0, ruinCleared: 0, soilMarks: 0, ruinUndressed: 0, declineMarks: 0,
    /** the RECLAIMED regions the page could not seat, i.e. whose field face is gone (PA.8) */
    soilMarksHomeless: 0,
  };
  const g = (id, body) => {
    if (!body) return;
    out.push(`<g id="${id}">${body}</g>`);
  };

  const F = page.frame;
  // ── PAPER ────────────────────────────────────────────────────────────────────────────────
  g('dress-paper', `<rect x="${r2(F.x)}" y="${r2(F.y)}" width="${r2(F.w)}" height="${r2(F.h)}"`
    + ` fill="${T.paper}"/>`);
  prims.n += 1;

  // ── FIELDS + THE GRAIN, CLIPPED (I7's cure) ──────────────────────────────────────────────
  {
    const fills = [];
    const grain = [];
    for (const f of page.fields) {
      if (f.ring.length < 3) continue;
      fills.push(polyPath(f.ring));
      // ⭐ THE GRAIN IS THE FURLONG'S OWN STRIP TEXTURE (hf140), and it is SCANLINE-CLIPPED to
      //   this face. A segment outside its face is the I7 defect and the census counts it.
      const ang = grainAngle(f.ring);
      for (const seg of hatchPolygon(f.ring, ang, rw * 1.15)) {
        grain.push(linePath(seg));
        census.grainSegments++;
      }
    }
    // ⭐ DRESS-FRAME · the countryside's fill goes back toward the paper at its SOLVED alpha. The
    //   declared tone is untouched, so every `valueCensus` row reads exactly what it read before;
    //   what changes is what lands. See `tones`' field block for the relation being solved.
    g('dress-fields', fills.length
      ? `<path d="${fills.join('')}" fill="${T.field}" fill-opacity="${T.fieldOpacity}" stroke="none"/>` : '');
    // ⚠ THE GRAIN IS DRAWN IN THE FIELD'S OWN DARKER TONE, NOT IN INK. On the first render the
    //   countryside's corduroy OUT-SHOUTED the town at page scale — which is I3's inversion
    //   arriving from the other side (fabric not falling to paper, but the field rising past it).
    //   A furrow is a tonal texture in the corpus (hf140), not a drawn line in map ink.
    g('dress-grain', grain.length
      ? `<path d="${grain.join('')}" fill="none" stroke="${T.grain}" stroke-width="${GRAIN.stroke}"`
        + ` stroke-opacity="${T.grainOpacity}"/>` : '');
    prims.n += fills.length + grain.length;
  }

  // ── ⭐⭐⭐ ⟦DRESS-2 W2⟧ RELIEF — STRUCTURED GRAMMAR, NOT TICK NOISE (I6 · §646.2) ────────────
  //
  // Drawn HERE, over the countryside's own fill and under everything the settlement builds,
  // because relief is a property of the GROUND. The terrace steps are the exception and are drawn
  // much later, over the fabric — a terrace wall retains the houses standing on it.
  //
  // ⚠ THE TONE IS SOLVED, NOT PICKED, AND IT IS THE SAME LAW THE FURROW ALREADY OBEYS: what lands
  //   on the page is at most ONE VALUE STEP under the surface it lies on. DRESS-FRAME took the
  //   countryside to within 1.085 of bare paper (§707.4) and this wave adds ink to exactly that
  //   surface, so the ink is placed by the ladder rather than beside it.
  {
    const R = opts.relief;
    const runs = [];
    const forms = [];
    const crags = [];
    const marsh = [];
    if (R) {
      census.profileHillsRefused = (R.hills || []).length;
      // ── hf112's SPUR-AND-COOMBE GRAIN: CHAIN along the contour, do not bucket into cells ────
      //
      // ⛔⛔ **THE FIRST SPELLING OF THIS BLOCK REPRODUCED §646.2 INSIDE THE CURE FOR IT.** It
      // bucketed hachures into a grid of three median lengths and required RUN_MIN co-occupants.
      // MEASURED: `mountain` — the steepest leaf in the corpus, relief 0.66, 191 derived hachures
      // — kept **3 and dropped 188**, `fjord` kept 15 of 187, and `metropolis` formed **zero
      // runs**. A cure for *tick noise* that prints a mountain as a flat sheet is the very defect
      // §646.2 convicted, arriving from the other side. The bucket was the wrong shape: hachures
      // sit on a jittered lattice at STRIDE 2, so co-occupancy of any fixed cell is a lottery.
      //
      // ⭐ A HACHURE RUN IS A CHAIN, NOT A CLUSTER. Cartographically the run walks ALONG THE
      // CONTOUR, each stroke beside the last, all of them pointing down the same fall line. So the
      // marks are chained greedily to their nearest unused neighbour whose bearing agrees, and the
      // reach is the marks' own median length — a quantity that scales with the leaf, never a view
      // unit (§179). The RULE is unchanged and is still the point: a chain shorter than `RUN_MIN`
      // is dropped, because a lone tick on an open hillside is exactly what I6 convicted.
      const inView = (x, y, pad) => x >= F.x - pad && x <= F.x + F.w + pad
        && y >= F.y - pad && y <= F.y + F.h + pad;
      const all = (R.hachures || []).filter((h) => Number.isFinite(h.x) && Number.isFinite(h.y)
        && Number.isFinite(h.len) && h.len > 0);
      const lens = all.map((h) => h.len).sort((a, b) => a - b);
      const med = lens.length ? lens[Math.floor(lens.length / 2)] : rw;
      // ⚠ CULLED TO THE PAGE, AND THE MARGIN IS THE MARK'S OWN LENGTH so a stroke that straddles
      //   the frame is kept — DRESS-FRAME's own named hazard for the culling it deferred.
      const hs = all.filter((h) => inView(h.x, h.y, h.len));
      census.hachuresDropped += all.length - hs.length;
      const used = new Uint8Array(hs.length);
      const reach2 = (med * 2.6) ** 2;
      const agrees = (a, b) => {
        const d = a.dx * b.dx + a.dy * b.dy;
        return d >= Math.cos(RUN_ARC * DEG);
      };
      for (let i = 0; i < hs.length; i++) {
        if (used[i]) continue;
        const chain = [hs[i]];
        used[i] = 1;
        // grow from BOTH ends of the chain, so a run found from its middle is not cut in half
        for (const end of [0, 1]) {
          let head = end ? chain[chain.length - 1] : chain[0];
          for (;;) {
            let best = -1; let bd = reach2;
            for (let j = 0; j < hs.length; j++) {
              if (used[j] || !agrees(head, hs[j])) continue;
              const d = (hs[j].x - head.x) ** 2 + (hs[j].y - head.y) ** 2;
              if (d < bd) { bd = d; best = j; }
            }
            if (best < 0) break;
            used[best] = 1;
            if (end) chain.push(hs[best]); else chain.unshift(hs[best]);
            head = hs[best];
          }
        }
        if (chain.length < RUN_MIN) { census.hachuresDropped += chain.length; continue; }
        for (const h of chain) {
          runs.push(linePath([[h.x, h.y], [h.x + h.dx * h.len, h.y + h.dy * h.len]]));
          census.hachuresDrawn++;
        }
        census.hachureRuns++;
      }
      /**
       * ⛔⛔ **THE FORM LINES HAD TO BE CLIPPED, AND THE MEASUREMENT IS WHY.** `buildRelief` traces
       * contours over the WHOLE LEAF, so a form line is a polyline of hundreds of vertices
       * spanning an extent the fitted page shows a fraction of. Emitted whole, MEASURED:
       * `dress-formline` was **47,776 B on `mountain` — 47 % of the entire plate — for sixteen
       * lines**, and 38,337 B on `town-2`. Almost every vertex was off-page ink nobody could see.
       * ⭐ So the contour is trimmed to the frame rather than culled by a bounding test: a line
       * that crosses the page keeps the part that shows and loses the part that does not, which is
       * exactly the straddling case DRESS-FRAME named as the hazard in the culling it deferred.
       */
      for (const l of (R.formLines || [])) {
        for (const seg of clipPolyline(l, F)) {
          forms.push(linePath(seg));
          census.formLines++;
        }
      }
      // ── hf113's CRAG LAW: the HEAVY line is the cliff TOP and the facet texture HANGS from it.
      //    The legacy drew an outline with two symmetric ticks and no top at all; the plate says
      //    the two halves are not equal, so they are emitted as two families at two weights.
      for (const c of (R.crags || [])) {
        const ca = Math.cos(c.ang * DEG); const sa = Math.sin(c.ang * DEG);
        crags.push({ top: linePath([[c.x - ca * c.r, c.y - sa * c.r], [c.x + ca * c.r, c.y + sa * c.r]]),
          facets: [-1, 1].map((i) => linePath([
            [c.x + ca * c.r * i * 0.5, c.y + sa * c.r * i * 0.5],
            [c.x + ca * c.r * i * 0.5 - sa * c.r * 1.1, c.y + sa * c.r * i * 0.5 + ca * c.r * 1.1]])) });
        census.crags++;
      }
      // ── hf115 STATES THE MARSH LAW ON THE PLATE: *reed-tick clusters of THREE-TO-FIVE strokes*.
      //    The legacy draws TWO. Three is the plate's own floor, so the port is a correction.
      for (const m of (R.marsh || [])) {
        for (let i = 0; i < 3; i++) {
          const ox = (i - 1) * rw * 0.22;
          marsh.push(linePath([[m.x + ox, m.y], [m.x + ox + rw * 0.26, m.y]]));
          census.marshTicks++;
        }
      }
    }
    g('dress-hachure', runs.length
      ? `<path d="${runs.join('')}" fill="none" stroke="${T.relief}"`
        + ` stroke-opacity="${T.reliefOpacity}" stroke-width="${INK.hair}" stroke-linecap="round"/>` : '');
    g('dress-formline', forms.length
      ? `<path d="${forms.join('')}" fill="none" stroke="${T.relief}"`
        + ` stroke-opacity="${r2(T.reliefOpacity * 0.72)}" stroke-width="${INK.hair}"/>` : '');
    g('dress-crag', crags.length
      ? `<path d="${crags.map((c) => c.top).join('')}" fill="none" stroke="${T.relief}"`
        + ` stroke-opacity="${T.reliefOpacity}" stroke-width="${INK.detail}" stroke-linecap="butt"/>`
        + `<path d="${crags.map((c) => c.facets.join('')).join('')}" fill="none" stroke="${T.relief}"`
        + ` stroke-opacity="${r2(T.reliefOpacity * 0.6)}" stroke-width="${INK.hair}"/>` : '');
    g('dress-marsh', marsh.length
      ? `<path d="${marsh.join('')}" fill="none" stroke="${T.waterInk}"`
        + ` stroke-opacity="${T.reliefOpacity}" stroke-width="${INK.hair}" stroke-linecap="round"/>` : '');
    census.reliefMarks = census.hachuresDrawn + census.formLines + census.crags + census.marshTicks;
    prims.n += runs.length + forms.length + crags.length * 3 + marsh.length;
  }

  // ── WATER: the bank-bounded body with SHORE-PARALLEL strokes ──────────────────────────────
  {
    const body = [];
    const shore = [];
    const calm = [];
    for (const w of page.water) {
      if (w.ring.length < 3) continue;
      census.waterFaces++;
      body.push(polyPath(w.ring));
      // ⭐ hf322's RECESSION LINES: strokes PARALLEL TO SHORE, hugging the edge — never a
      //   perspective wave, and never a fill. Three inset rings, each thinner than the last.
      for (let k = 1; k <= 3; k++) {
        const r = insetRing(w.ring, rw * 0.30 * k);
        if (r && r.length >= 3) { shore.push(polyPath(r)); census.shoreStrokes++; }
      }
      // ⭐ HARBOUR WATER IS CALM-RULED (the charter's own word): a still body takes ruled
      //   horizontals rather than shore echoes, which is what makes a basin read as sheltered.
      if (w.kind === 'harbour' || w.kind === 'sea' || w.kind === 'lake' || w.kind === 'coast') {
        for (const seg of hatchPolygon(w.ring, 0, rw * 1.8)) calm.push(linePath(seg));
      }
    }
    g('dress-water', body.length
      ? `<path d="${body.join('')}" fill="${T.water}" stroke="none"/>` : '');
    g('dress-shore', shore.length || calm.length
      ? `<path d="${shore.concat(calm).join('')}" fill="none" stroke="${T.waterInk}"`
        + ` stroke-width="${INK.hair}" stroke-opacity="0.55"/>` : '');
    prims.n += body.length + shore.length + calm.length;
  }

  // ── GROUND: the STREET GAP as its own surface, at its own tone (I4's cure) ────────────────
  {
    const streets = [];
    for (const w of page.ways) {
      if (w.ring.length < 3) continue;
      streets.push(polyPath(w.ring));
    }
    g('dress-street', streets.length
      ? `<path d="${streets.join('')}" fill="${T.street}" stroke="none"/>` : '');
    prims.n += streets.length;
  }

  // ── VOIDS at their own register — never aggregated (§4 / L-REG-30 generalized) ────────────
  {
    const voids = [];
    for (const v of page.voids) if (v.ring.length >= 3) voids.push(polyPath(v.ring));
    g('dress-voids', voids.length
      ? `<path d="${voids.join('')}" fill="${T.voidGround}" stroke="${T.ink}"`
        + ` stroke-width="${INK.hair}" stroke-opacity="0.5"/>` : '');
    prims.n += voids.length;
  }

  // ── MASSES: PA.6's LOOK — the BUILT band over visible toft ground ─────────────────────────
  {
    const yards = [];
    const built = [];
    const nwPlane = [];
    const sePlane = [];
    const ridges = [];
    const hips = [];
    const eaves = [];
    const chimneys = [];
    const unit = [];
    for (const m of page.masses) {
      if (!m.ring || m.ring.length < 3) continue;
      census.masses++;
      // THE YARD IS GROUND. The chunk's own ring carries the toft; the BUILT footprint is the
      // run band inside it. Two rings, two tones — which is the whole of PA.6's ruled look.
      yards.push(polyPath(m.ring));
      for (const [ri, runRing] of (m.runRings || []).entries()) {
        if (!runRing || runRing.length < 3) continue;
        const ridge = (m.ridgeOfRun || m.ridges || [])[ri] || null;
        // ⭐⭐ **THE RUN IS THE EAVES LINE** (hf208, honouring the hf208/hf208-plan rule): the
        //     built footprint IS the run's dissolved ring, inset by a hair so the toft shows.
        const foot = insetRing(runRing, rw * 0.10) || runRing;
        built.push(polyPath(foot));
        // ⭐⭐ **RIDGE CLIPPED TO THE RUN'S OWN FOOTPRINT (PA.6) — B7's overshoot class dies.**
        if (ridge) {
          census.ridges++;
          const clipped = clipSegment(foot, ridge[0], ridge[1]);
          if (!clipped) { census.ridgeOutside++; continue; }
          if (!sameSeg(clipped, ridge)) census.ridgeClipped++;
          ridges.push(linePath(clipped));
          // ⭐ TWO-TONE PLANES, SE DARK (hf208 rule 4; NW light / SE shadow throughout the corpus)
          const [a, b] = splitPolygon(foot, clipped[0][0], clipped[0][1],
            clipped[1][0] - clipped[0][0], clipped[1][1] - clipped[0][1]);
          if (a && b) {
            const ca = centroid(a); const cb = centroid(b);
            const aIsSE = (ca[0] + ca[1]) > (cb[0] + cb[1]);
            sePlane.push(polyPath(aIsSE ? a : b));
            nwPlane.push(polyPath(aIsSE ? b : a));
            census.planes += 2;
          }
          // ⭐ HIPS AT RUN ENDS (hf208 rule 3): the ridge stops short and angled lines run from
          //   each ridge end to the footprint's two nearest corners.
          for (const end of [clipped[0], clipped[1]]) {
            for (const c of twoNearest(foot, end)) { hips.push(linePath([end, c])); census.hips++; }
          }
          // ⭐ CHIMNEYS ASTRIDE THE RIDGE (hf208 rule 9) — a square only; smoke is not drawn on
          //   a sound house. One per run, at the ridge's own third, and only where the run is
          //   large enough for the square to read at page scale.
          if (absArea(foot) > (rw * rw) * 1.6) {
            const p = lerp(clipped[0], clipped[1], 0.34);
            const s = rw * 0.16;
            chimneys.push(polyPath([[p[0] - s, p[1] - s], [p[0] + s, p[1] - s],
              [p[0] + s, p[1] + s], [p[0] - s, p[1] + s]]));
            census.chimneys++;
          }
        }
        // ⭐ EAVES SHADOW: a tick along the SE-facing edges of the footprint, one value step
        //   under the built tone. It is what stops the fabric reading as flat tint.
        for (const seg of seFacingEdges(foot)) eaves.push(linePath(seg));
      }
      // ⭐⭐ MEMBER UNIT-LINES (A1.2) — **HOLLOW WASH IS BANNED**: a 30-member mass is 31
      //     primitives, and the interior party lines are what make it an aggregation.
      for (const l of m.unitLines) { unit.push(linePath(l)); census.unitLines++; }
    }
    g('dress-yards', yards.length
      ? `<path d="${yards.join('')}" fill="${T.plotGround}" stroke="none"/>` : '');
    g('dress-masses', built.length
      ? `<path d="${built.join('')}" fill="${T.built}" stroke="${T.ink}"`
        + ` stroke-width="${INK.detail}"/>` : '');
    g('dress-planes', (nwPlane.length ? `<path d="${nwPlane.join('')}" fill="${T.roofNW}" stroke="none"/>` : '')
      + (sePlane.length ? `<path d="${sePlane.join('')}" fill="${T.roofSE}" stroke="none"/>` : ''));
    g('dress-eaves', eaves.length
      ? `<path d="${eaves.join('')}" fill="none" stroke="${T.eaves}" stroke-width="${INK.body}"`
        + ` stroke-linecap="butt"/>` : '');
    g('dress-ridges', ridges.length
      ? `<path d="${ridges.join('')}" fill="none" stroke="${T.ink}" stroke-width="${INK.body}"/>` : '');
    g('dress-hips', hips.length
      ? `<path d="${hips.join('')}" fill="none" stroke="${T.ink}" stroke-width="${INK.detail}"`
        + ` stroke-opacity="0.85"/>` : '');
    g('dress-chimneys', chimneys.length
      ? `<path d="${chimneys.join('')}" fill="${T.ink}" stroke="none"/>` : '');
    g('dress-unitlines', unit.length
      ? `<path d="${unit.join('')}" fill="none" stroke="${T.ink}" stroke-width="${INK.hair}"`
        + ` stroke-opacity="0.78"/>` : '');
    prims.n += yards.length + built.length + nwPlane.length + sePlane.length + ridges.length
      + hips.length + eaves.length + chimneys.length + unit.length;
  }

  // ── WALLS: REG-2's vocabulary re-targeted to the BAND FACE ────────────────────────────────
  if (opts.walls && opts.walls.circuits) {
    const bandFill = [];
    const coursing = [];
    const comb = [];
    const towers = [];
    const ditch = [];
    const stairs = [];
    const gates = [];
    const relict = [];
    for (const c of opts.walls.circuits) {
      // ⭐⭐ **B4's CURE: a relict ring is DRESSED or SUPPRESSED — never a bare floating slash.**
      //     The review found *"bare strokes … with no anatomy, no endpoints on any district
      //     edge, no legend row"*. A circuit whose wear has reached `crumbling` and which is not
      //     the outermost is DRESSED as a robbed stretch (hf123's "vanished wall" — the line
      //     survives as a property boundary), never stroked as a naked slash.
      const relictRing = c.index < opts.walls.circuits.length - 1;
      for (const f of c.fragments) {
        const bandPoly = bandOf(f.ring, c.band, f.closed);
        if (!bandPoly) continue;
        census.bandFaces++;
        if (relictRing && c.wear && c.wear.grade === 'crumbling') {
          // the dressed relict: the band's line kept as a BOUND, with the ditch's ghost, and
          // counted so a reader can tell dressing from suppression.
          relict.push(f.closed ? polyPath(f.ring) : linePath(f.ring));
          census.relictDressed++;
          continue;
        }
        bandFill.push(polyPath(bandPoly));
        // ⭐ COURSING IN PATCHES, NOT A CONTINUOUS LADDER (hf261 rung 4 — and it is what makes
        //   it affordable). The pitch and the patch share are the estate's own signed figures.
        const patch = hatchPolygon(bandPoly, 90, rw * TEXTURE_PITCH_FRONTAGES);
        /**
         * ⛔⛔ **`Math.max(1, …)` GUARANTEED AT LEAST ONE ELEMENT OF A LIST THAT CAN BE EMPTY.**
         * WALL-CURTAIN. `hatchPolygon` returns `[]` for a band too narrow to catch a single rule
         * line at this pitch, and the floor of 1 then indexed `patch[0]` — `undefined` — straight
         * into `linePath`, which reads `.length` off it and throws. **A band that small was
         * unreachable until the curtain was clipped at the bank instead of at the facet**: the
         * shortest published fragment on the corpus is now **3.554 u** on `year-100` (and 0.674 u
         * on `town-2`), where before the shortest was a whole facet. Latent, not introduced — any
         * future narrow band would have found it — and the floor is now a CLAMP, which is what it
         * was always meant to be: *keep a share of the patches, but never more than there are.*
         *
         * ⚠ AND IT IS ONLY A CRASH BECAUSE NOTHING IN THE GATE RENDERS THIS PAGE. The full gate
         * ran **19 files / 439 tests EXIT 0** at the very tip whose page renderer threw on leaf 14
         * of 18. That gap is recorded in the receipt; it is not this line's to close.
         */
        const keep = Math.min(patch.length, Math.max(1, Math.round(patch.length * TEXTURE_PATCH_SHARE)));
        for (let i = 0; i < keep; i++) { coursing.push(linePath(patch[i])); census.coursing++; }
        // ⭐ THE COMB on the OUTER edge only — hf103's MURUS SECUNDUS, and the reason I10's
        //   "symmetric tick-ladder reads as railway" dies: a comb on one edge is not a ladder.
        for (const seg of combTicks(f.ring, c.band, rw * COMB_PITCH_FRONTAGES, f.closed)) {
          comb.push(linePath(seg));
        }
        // ⭐ THE DITCH AS RADIATING HACHURE (I10's cure, hf314): strokes running OUTWARD from
        //   the outer edge, not a dashed line. Only where the run's own policy dug one.
        for (const [i, ri] of f.runOfVertex.entries()) {
          if (!f.runs[ri] || !f.runs[ri].ditch) continue;
          if (i % 2) continue;
          const n = outwardNormal(f.ring, i, f.closed);
          const p = f.ring[i];
          const o = c.band.stone / 2 + c.band.outer;
          ditch.push(linePath([[p[0] + n[0] * o, p[1] + n[1] * o],
            [p[0] + n[0] * (o + rw * 0.85), p[1] + n[1] * (o + rw * 0.85)]]));
          census.ditchHachure++;
        }
        // ⭐ WALL-STAIR FLIGHTS on the INNER face, and they are RARE (hf314) — one every
        //   ~9 frontages, which is the estate's own `STAIR_PITCH_FRONTAGES`.
        for (let i = 0; i < f.ring.length; i += Math.max(1, Math.round(STAIR_PITCH_FRONTAGES))) {
          const n = outwardNormal(f.ring, i, f.closed);
          const p = f.ring[i];
          const inn = c.band.stone / 2;
          stairs.push(linePath([[p[0] - n[0] * inn, p[1] - n[1] * inn],
            [p[0] - n[0] * (inn + rw * 0.4), p[1] - n[1] * (inn + rw * 0.4)]]));
        }
        // ⭐ TOWERS AS PLAN SHAPES STRADDLING THE BAND (hf315) — a type, never a repeat.
        for (const [ti, t] of f.towers.entries()) {
          towers.push(towerPlan(t, f.towerTypes[ti], c.band.stone, c.rung));
          census.towers++;
        }
        // ⭐ GATES SEATED **IN** THE BAND with hf313 anatomy — a gate that floats in a band gap
        //   is I10's second conviction. The passage is cut through the band and the flanking
        //   work is drawn on it.
        for (const gt of f.gates) {
          gates.push(gatePlan(gt, c.band, c.rung, rw));
          census.gatehouses++;
        }
      }
    }
    g('dress-band', bandFill.length
      ? `<path d="${bandFill.join('')}" fill="${T.bandGround}" stroke="${T.wall}"`
        + ` stroke-width="${INK.wall}" stroke-linejoin="round"/>` : '');
    g('dress-coursing', coursing.length
      ? `<path d="${coursing.join('')}" fill="none" stroke="${T.wall}" stroke-width="${INK.hair}"`
        + ` stroke-opacity="0.62"/>` : '');
    g('dress-comb', comb.length
      ? `<path d="${comb.join('')}" fill="none" stroke="${T.wall}" stroke-width="${INK.detail}"/>` : '');
    g('dress-ditch', ditch.length
      ? `<path d="${ditch.join('')}" fill="none" stroke="${T.ink}" stroke-width="${INK.hair}"`
        + ` stroke-opacity="0.7"/>` : '');
    g('dress-stairs', stairs.length
      ? `<path d="${stairs.join('')}" fill="none" stroke="${T.wall}" stroke-width="${INK.hair}"`
        + ` stroke-opacity="0.8"/>` : '');
    g('dress-towers', towers.length
      ? `<path d="${towers.join('')}" fill="${T.bandGround}" stroke="${T.wall}"`
        + ` stroke-width="${INK.strong}"/>` : '');
    g('dress-gates', gates.length
      ? `<path d="${gates.join('')}" fill="${T.paper}" stroke="${T.wall}"`
        + ` stroke-width="${INK.strong}"/>` : '');
    g('dress-relict', relict.length
      ? `<path d="${relict.join('')}" fill="none" stroke="${T.ink}" stroke-width="${INK.detail}"`
        + ` stroke-dasharray="${r2(rw * 0.9)} ${r2(rw * 0.5)}" stroke-opacity="0.65"/>` : '');
    prims.n += bandFill.length + coursing.length + comb.length + ditch.length + stairs.length
      + towers.length + gates.length + relict.length;
  }

  // ── CROSSINGS: decks OVER water with the shadow line · the FORD per PA.3 ──────────────────
  {
    const decks = [];
    const shadow = [];
    const ford = [];
    const stepping = [];
    for (const c of (page.crossings || [])) {
      const w = c.localWidth || rw * 2;
      if (c.kind === 'bridge') {
        const q = deckQuad(c, w, rw);
        if (q) {
          decks.push(polyPath(q));
          // ⭐ §649.2's FRESH-EYES EXIT: the deck reads as OVER the water because it casts a
          //   shadow line on the SE side. Without it a deck is a rectangle lying in the river.
          shadow.push(linePath([q[1], q[2]]));
          census.decks++;
        }
      } else if (c.kind === 'ford') {
        // ⭐⭐⭐ **PA.3 — THE FORD RULING, A TASTE CALL ALREADY MADE.** hf264-zoom-river-works is
        //   the BINDING PLATE: STIPPLE SHALLOWS across the widened reach, with SPLAYED FUNNEL
        //   APPROACH CHEVRONS on both banks. §649.2's "narrows + ripples" prose is CORRECTED and
        //   does not bind — and the widened reach is also §3e's own ford-at-the-wide-reach law.
        for (const d of fordStipple(c, w, rw)) ford.push(d);
        for (const d of fordChevrons(c, w, rw)) ford.push(d);
        census.fords++;
      } else if (c.kind === 'stepping' || c.kind === 'stones') {
        // ⭐ A DISTINCT CROSSING DRESS (PA.3), drawn only where truth mints it.
        for (const d of steppingStones(c, w, rw)) { stepping.push(d); census.steppingStones++; }
      }
    }
    g('dress-decks', decks.length
      ? `<path d="${decks.join('')}" fill="${T.deck}" stroke="${T.ink}" stroke-width="${INK.body}"/>`
        + (shadow.length ? `<path d="${shadow.join('')}" fill="none" stroke="${T.ink}"`
          + ` stroke-width="${INK.strong}" stroke-opacity="0.55"/>` : '') : '');
    g('dress-ford', ford.length
      ? `<path d="${ford.join('')}" fill="none" stroke="${T.waterInk}" stroke-width="${INK.hair}"`
        + ` stroke-linecap="round"/>` : '');
    g('dress-stepping', stepping.length
      ? `<path d="${stepping.join('')}" fill="${T.ink}" stroke="none"/>` : '');
    prims.n += decks.length + shadow.length + ford.length + stepping.length;
  }

  // ── QUAY / PIER INK on the moored faces, with V-QUAY at its SIGNED band ───────────────────
  {
    const quays = [];
    const vq = [];
    // ⚠ A QUAY RECORD CARRIES A **FACE ID**, NOT A RING (`partitionWater.mintQuays`), so the ring
    //   is resolved through the caller's own face reader rather than re-walked here — the view
    //   law again: the dress reads, it does not re-derive.
    const ringOfFace = opts.ringOfFace || (() => null);
    for (const q of (page.quays || [])) {
      const ring = q.ring || q.polygon || ringOfFace(q.face);
      if (!ring || ring.length < 3) continue;
      census.quays++;
      quays.push(polyPath(ring));
      // ⭐ V-QUAY AT ITS SIGNED BAND (SIGNED_CONSTANTS: 2–5 per drawn quay). The COUNT is the
      //   band's floor plus the quay's own size, never a roll — a dress opens no stream.
      // ⛔ `V_QUAY_BAND` IS A TUPLE `[2, 5]`, NOT `{min, max}` — the first spelling read
      //   `.min`/`.max` as `undefined`, `Math.max(undefined, …)` returned `NaN`, the loop never
      //   ran, and the census printed **`vquay: 0` on a leaf with a drawn quay**. The zero was the
      //   tell; without the census row it would have shipped as "this leaf has no furniture".
      const [vqLo, vqHi] = V_QUAY_BAND;
      const n = Math.max(vqLo, Math.min(vqHi, vqLo + Math.floor(absArea(ring) / (rw * rw * 4))));
      const c0 = centroid(ring);
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) / n;
        const p = alongRing(ring, t);
        const s = rw * 0.14;
        vq.push(polyPath([[p[0] - s, p[1] - s], [p[0] + s, p[1] - s],
          [p[0] + s, p[1] + s], [p[0] - s, p[1] + s]]));
        census.vquay++;
      }
      void c0;
    }
    g('dress-quays', quays.length
      ? `<path d="${quays.join('')}" fill="${T.plotGround}" stroke="${T.ink}"`
        + ` stroke-width="${INK.body}"/>` : '');
    g('dress-vquay', vq.length
      ? `<path d="${vq.join('')}" fill="${T.ink}" stroke="none"/>` : '');
    prims.n += quays.length + vq.length;
  }

  // ── ⭐⭐ ⟦DRESS-2 W2⟧ THE TERRACE STEPS, DRAWN **OVER** THE FABRIC (hf116) ──────────────────
  // The one relief family that is not ground texture: `buildRelief` splits its contours by
  // `inTown`, so a TERRACE is by definition a contour crossing ground the settlement had to cut,
  // at or above `RELIEF_BANDS.terrace`. It is drawn last of the relief because a terrace wall
  // RETAINS the houses standing on it — the legacy's own stated reason, and the only reason its
  // draw order differs from its siblings'. Its alpha is solved against the SETTLED ground it lies
  // on rather than against the countryside, for the same reason.
  {
    const terr = [];
    for (const t of ((opts.relief && opts.relief.terraces) || [])) {
      for (const seg of clipPolyline(t, F)) {
        terr.push(linePath(seg));
        census.terraces++;
      }
    }
    g('dress-terrace', terr.length
      ? `<path d="${terr.join('')}" fill="none" stroke="${T.relief}"`
        + ` stroke-opacity="${T.terraceOpacity}" stroke-width="${INK.detail}"`
        + ` stroke-linecap="round"/>` : '');
    census.reliefMarks += census.terraces;
    prims.n += terr.length;
  }

  // ── ⭐⭐⭐ ⟦REG-D⟧ THE DECLINE LADDER — WHAT THE LEDGER REACHED, AND ONLY THAT ────────────────
  //
  // ⭐⭐ **THE TWO ROSTERS, AND WHY THERE HAVE TO BE TWO.** A ruin that still stands is a
  // `LOSSREGION` face and arrives on `page.loss` with its own ring. A ruin that was CLEARED is not
  // a face any more — `recoverByPressure` sets `f.cls = 'FIELD'` — so a face-walk finds nothing and
  // the reclamation survives only in the published record. PA.8 rules the census over
  // `state.losses`/`publishLosses` for exactly this reason, and the ink obeys the same rule: the
  // standing rungs come off `page.loss`, and RECLAIMED is joined from `opts.losses.regions` back to
  // the FIELD face that used to be the plot.
  //
  // ⛔⛔ **THE MEASUREMENT THAT BOUNDS THIS WHOLE FAMILY, RECORDED WHERE THE INK IS.** On 16 of the
  // 18 corpus leaves EVERY decline mark falls outside the fitted frame — measured two ways
  // (polygon clip to the frame, and centroid-in-frame), both returning zero area and zero faces.
  // The mechanism is not a bug in either half: §3f abandons the OUTERMOST pieces because a
  // population fall IS a contraction of the built radius, and DRESS-FRAME fits the page to
  // `bound.radius`, which is far inside the built radius. **The rim is what empties and the rim is
  // what the fit crops.** Only `highwater` (349 of 467 ruin faces in frame) and `mountain` (2
  // reclaimed) carry any of it. That is the framing trade's FOURTH measured cost and it is the
  // owner's row, not this file's — recorded here so nobody reads the ink's silence as its absence.
  {
    const LOSS = opts.losses;
    const standing = [];
    const unroofed = [];
    const hatchD = [];
    const footings = [];
    const clearing = [];
    const clearHatch = [];
    const soil = [];
    // the growth front comes from the settlement's own centre — `recoverByPressure` takes the
    // ruins nearest the core first, so "the side the clearing came from" is not a choice here
    const bx = (page.bound && Number.isFinite(page.bound.cx)) ? page.bound.cx : F.x + F.w / 2;
    const by = (page.bound && Number.isFinite(page.bound.cy)) ? page.bound.cy : F.y + F.h / 2;
    const byKey = new Map();
    for (const R of ((LOSS && LOSS.regions) || [])) byKey.set(R.key, R);
    const cost = (LOSS && LOSS.law && LOSS.law.reclaimCost > 0) ? LOSS.law.reclaimCost : 0;
    for (const L of (page.loss || [])) {
      if (!L.ring || L.ring.length < 3) continue;
      census.ruinFaces++;
      const row = RUIN_DRESS[L.state];
      if (!row) { census.ruinUndressed++; continue; }
      if (row.group === 'dress-ruin-standing') {
        standing.push(polyPath(L.ring));
        census.ruinStanding++;
      } else if (row.group === 'dress-ruin-unroofed') {
        unroofed.push(polyPath(L.ring));
        // ⚠ THE HATCH FOLLOWS THE FACE'S OWN AXIS, not a sheet angle. `grainAngle` is the estate's
        //   own device for "this piece's long direction", already used by the furlong, so a field
        //   of ruins comes out broken rather than mechanically parallel — B4's own tell.
        for (const seg of hatchPolygon(L.ring, grainAngle(L.ring), rw * 0.5)) {
          hatchD.push(linePath(seg));
          census.ruinHatch++;
        }
        census.ruinUnroofed++;
      } else if (row.group === 'dress-ruin-footings') {
        footings.push(polyPath(L.ring));
        census.ruinFootings++;
      } else if (row.group === 'dress-ruin-clearing') {
        clearing.push(polyPath(L.ring));
        const R = byKey.get(L.key);
        // the share NOT yet taken back. With no published cost the honest reading is "none of it
        // is proven cleared", so the whole face keeps its hatch — never a guessed denominator.
        const taken = (R && cost) ? Math.max(0, Math.min(1, R.pressureClock / cost)) : 0;
        const segs = hatchPolygon(L.ring, grainAngle(L.ring), rw * 0.5);
        // order the rules by distance from the settlement's centre; the clearing ate the near end
        const keyed = segs.map((s) => ({ s, d: Math.hypot((s[0][0] + s[1][0]) / 2 - bx, (s[0][1] + s[1][1]) / 2 - by) }))
          .sort((a, b) => a.d - b.d || a.s[0][0] - b.s[0][0]);
        const drop = Math.round(keyed.length * taken);
        for (let i = 0; i < keyed.length; i++) {
          if (i < drop) { census.ruinCleared++; continue; }
          clearHatch.push(linePath(keyed[i].s));
          census.ruinHatch++;
        }
        census.ruinClearing++;
      }
      census.declineMarks++;
    }
    // ── RECLAIMED · joined back to the FIELD face the plot became (PA.8's own reason) ──────────
    if (LOSS && LOSS.regions) {
      const fieldRing = new Map();
      for (const f of (page.fields || [])) fieldRing.set(f.face, f.ring);
      for (const R of LOSS.regions) {
        if (R.state !== 'RECLAIMED') continue;
        const ring = fieldRing.get(R.footprint);
        if (!ring || ring.length < 3) { census.soilMarksHomeless++; continue; }
        soil.push(polyPath(ring));
        census.soilMarks++;
        census.declineMarks++;
      }
    }
    // ⚠ EVERY WEIGHT AND EVERY DASH BELOW IS AN EXISTING ROLE AT AN EXISTING RUNG. Nothing here
    //   mints a tone, an opacity ladder or a stroke scale: `T.ink`, `T.wall` and `INK.*` are the
    //   ones the fabric already draws with, so `valueCensus` reads exactly what it read before.
    g('dress-ruin-standing', standing.length
      ? `<path d="${standing.join('')}" fill="none" stroke="${T.ink}" stroke-width="${INK.body}"`
        + ` stroke-linejoin="round"/>` : '');
    g('dress-ruin-unroofed', unroofed.length
      ? `<path d="${unroofed.join('')}" fill="none" stroke="${T.ink}" stroke-width="${INK.detail}"`
        + ` stroke-linejoin="round"/>`
        + (hatchD.length ? `<path d="${hatchD.join('')}" fill="none" stroke="${T.ink}"`
          + ` stroke-width="${INK.hair}" stroke-opacity="0.8"/>` : '') : '');
    g('dress-ruin-footings', footings.length
      ? `<path d="${footings.join('')}" fill="none" stroke="${T.ink}" stroke-width="${INK.hair}"`
        + ` stroke-dasharray="${r2(rw * 0.35)} ${r2(rw * 0.35)}" stroke-opacity="0.7"/>` : '');
    g('dress-ruin-clearing', clearing.length
      ? `<path d="${clearing.join('')}" fill="none" stroke="${T.ink}" stroke-width="${INK.detail}"`
        + ` stroke-linejoin="round"/>`
        + (clearHatch.length ? `<path d="${clearHatch.join('')}" fill="none" stroke="${T.ink}"`
          + ` stroke-width="${INK.hair}" stroke-opacity="0.8"/>` : '') : '');
    // ⚠ THE SOIL-MARK IS DOTTED, NOT DASHED, AND IT IS PALER THAN THE FOOTINGS GHOST. It is one
    //   rung FURTHER down hf379's ladder than the footings — the ground is worked and the plot is
    //   a trace under the plough — so it may not read as heavy as the stage above it.
    g('dress-soilmark', soil.length
      ? `<path d="${soil.join('')}" fill="none" stroke="${T.ink}" stroke-width="${INK.hair}"`
        + ` stroke-dasharray="${r2(rw * 0.12)} ${r2(rw * 0.30)}" stroke-opacity="0.55"`
        + ` stroke-linecap="round"/>` : '');
    prims.n += standing.length + unroofed.length + hatchD.length + footings.length
      + clearing.length + clearHatch.length + soil.length;
  }

  // ── ⭐⭐⭐ ⟦DRESS-2 W1⟧ THE §10 STATE EXPRESSIONS, IN CALM INK ──────────────────────────────
  //
  // ⭐⭐ **THE REGISTER LAW IS THE LEGACY'S OWN, CARRIED OVER VERBATIM** (`renderFolio` §15b):
  // *a siege is a row of small tents on a road, a plague is short bars across the gates, a famine
  // is a market place with its stall rows marked out and nothing on them.* Nothing here is
  // coloured differently from the rest of the leaf, and nothing here is DERIVED here — every
  // coordinate arrives from `fabric.stateMarks`, in the page's own world space.
  //
  // ⛔ **THREE ROWS OF THE CHARTER ARE NOT BUILT, AND EACH REFUSAL IS A MEASUREMENT:**
  //  (i)  *"siege/circumvallation lines"* — `circumvallation` and `contravallation` have ZERO
  //       occurrences in this tree. There is no such truth to draw, and a dress that minted a
  //       siege line would be a renderer deriving world facts, which `partitionView`'s own law
  //       forbids outright. Reported, not invented.
  //  (ii) *"barred-gate emphasis at EVERY gate"* conflates two different laws. §10.12 bars the
  //       ONE gate a besieger invests (`stateMarks` marks exactly one, `label:'INVESTED'`);
  //       §10.13 bars EVERY gate against the pestilence. Drawing every gate barred on a siege
  //       leaf would contradict the shipped truth in order to satisfy a brief.
  //  (iii)*"tents OUTSIDE bowshot (the Corfe band)"* is ALREADY the shipped law —
  //       `stateMarks.js`'s `stand = max(frontage × 5, builtRadius × 0.16)`, with its own reason
  //       written above it. The bridge carries it; there was nothing to build.
  //
  // ⚠ `colonize.*` BODIES ARE DELIBERATELY NOT DRAWN HERE. They are §18.4 market-infill fossils
  //   present on every town-and-above leaf, so they carry NO scenario signal, and drawing them in
  //   the scenario wave would put an unattributable shift inside the very measurement that wave
  //   exists to take. They belong with the market furniture. Deferred, with its reason.
  {
    const S = opts.state;
    const camps = [];
    const barred = [];
    const stalls = [];
    const fires = [];
    const tramp = [];
    const barricades = [];
    if (S) {
      census.stateExpressed = (S.expressed || []).length;
      for (const b of (S.bodies || [])) {
        // `state.*` is a §10 expression; `colonize.*` is §18.4 infill. The key is the discriminator
        // the fabric already publishes — no kind list to fall out of date.
        if (!String(b.key || '').startsWith('state.')) continue;
        if (!b.polygon || b.polygon.length < 3) continue;
        camps.push(polyPath(b.polygon));
        census.stateBodies++;
      }
      for (const mk of (S.marks || [])) {
        if (mk.kind === 'barredGate' || mk.kind === 'quarantineBar') {
          // ⭐ THE BAR SPANS THE ROAD, AND THAT IS WHY IT IS STATED IN ROAD WIDTHS. The legacy
          //   used `builtRadius × 0.035`, a VIEW-UNIT quantity — §179's own lesson is that ink
          //   stated in view units is right at one tier and wrong at the rest. A gate passage is
          //   about a road wide at every tier, so the road IS the module.
          const nx = -mk.dy; const ny = mk.dx;
          const o = rw * 0.9;
          for (let i = -1; i <= 1; i++) {
            const t = i * rw * 0.34;
            barred.push(linePath([[mk.x + nx * o + mk.dx * t, mk.y + ny * o + mk.dy * t],
              [mk.x - nx * o + mk.dx * t, mk.y - ny * o + mk.dy * t]]));
          }
          census.barredGates++;
        } else if (mk.kind === 'emptyStall') {
          if (!mk.polygon || mk.polygon.length < 3) continue;
          stalls.push(polyPath(mk.polygon));
          census.emptyStalls++;
        } else if (mk.kind === 'watchFire') {
          // a fire KEPT, not a fire burning: a ring with a cross in it. hf311's approach-road
          // furniture is drawn singly, and this is one of those.
          const r = mk.r;
          fires.push(`M${q(mk.x - r)} ${q(mk.y)}a${q(r)} ${q(r)} 0 1 0 ${q(r * 2)} 0`
            + `a${q(r)} ${q(r)} 0 1 0 ${q(-r * 2)} 0`);
          fires.push(linePath([[mk.x - r * 0.6, mk.y - r * 0.6], [mk.x + r * 0.6, mk.y + r * 0.6]]));
          census.watchFires++;
        } else if (mk.kind === 'trampled') {
          // ⛔⛔ ⟦CAR-STATE-BRIDGE⟧ **A TRIG INDEX, READ AS A TRIG INDEX AT LAST.** `stateMarks`
          //   publishes `ang` through its own `bearingOf`, which scans the frozen table and
          //   returns an index in **0…TRIG_N-1 (1023)**. This line read it as DEGREES, so the
          //   hatch of every trampled patch was rotated by an arbitrary amount — `ang = 300`
          //   drew 300° where the world said 105.5°. ⭐ THE DEFECT WAS FOUND BY CROSS-READING
          //   THE TWO CONSUMERS OF ONE PUBLISHED FIELD: `renderFolio.mjs:2953` reads the very
          //   same `mk.ang` as `cosI(mk.ang)`, and the folio is the one that is right.
          //   ⚠ Re-anchoring a mark while leaving the unit its ORIENTATION arrives in wrong
          //   would only re-place the same defect one field over, which is why it is cured here.
          const c2 = cosI(mk.ang); const s2 = sinI(mk.ang);
          for (let i = -2; i <= 2; i++) {
            const px = mk.x - s2 * i * mk.r * 0.32; const py = mk.y + c2 * i * mk.r * 0.32;
            tramp.push(linePath([[px - c2 * mk.r * 0.5, py - s2 * mk.r * 0.5],
              [px + c2 * mk.r * 0.5, py + s2 * mk.r * 0.5]]));
          }
          census.trampled++;
        } else if (mk.kind === 'barricade') {
          const L = Math.hypot(mk.dx, mk.dy) || 1;
          const nx = -mk.dy / L; const ny = mk.dx / L; const h = mk.w * 0.6;
          barricades.push(linePath([[mk.x - nx * h, mk.y - ny * h], [mk.x + nx * h, mk.y + ny * h]]));
          census.barricades++;
        }
      }
    }
    // ⭐ A TENT IS CANVAS, NOT TILE — it stands one value step off the paper like every other
    //   fabric tone, but NEARER the paper than a roof. The 0.42 is the legacy renderer's own
    //   shipped relation (`mix(P.paper, P.roofs, 0.42)`); the floor is this module's `VALUE_STEP`.
    g('dress-camp', camps.length
      ? `<path d="${camps.join('')}" fill="${T.camp}" stroke="${T.ink}"`
        + ` stroke-width="${INK.detail}" stroke-linejoin="round"/>` : '');
    g('dress-barred', barred.length
      ? `<path d="${barred.join('')}" fill="none" stroke="${T.wall}"`
        + ` stroke-width="${INK.body}" stroke-linecap="round"/>` : '');
    g('dress-emptystall', stalls.length
      ? `<path d="${stalls.join('')}" fill="none" stroke="${T.ink}" stroke-width="${INK.body}"`
        + ` stroke-opacity="0.75" stroke-linejoin="round"/>` : '');
    g('dress-watchfire', fires.length
      ? `<path d="${fires.join('')}" fill="none" stroke="${T.ink}" stroke-width="${INK.body}"`
        + ` stroke-linecap="round"/>` : '');
    g('dress-trampled', tramp.length
      ? `<path d="${tramp.join('')}" fill="none" stroke="${T.ink}" stroke-width="${INK.hair}"`
        + ` stroke-opacity="0.7"/>` : '');
    g('dress-barricade', barricades.length
      ? `<path d="${barricades.join('')}" fill="none" stroke="${T.wall}"`
        + ` stroke-width="${INK.strong}" stroke-linecap="butt"/>` : '');
    prims.n += camps.length + barred.length + stalls.length + fires.length + tramp.length
      + barricades.length;
  }

  // ── ⭐⭐⭐ ⟦CAR-SEATING W3⟧ THE INSTITUTION REGISTER, MARKED ─────────────────────────────────
  // The seating arrives by `opts.seating` rather than off the page, and that is the same shape
  // `walls` already uses here: the seating pass READS the page, so the page cannot carry it
  // without a cycle. This is the LAST mark drawn, on the `marks` row of `DRESS_LAYERS`.
  //
  // ⚠ AN OPEN DIAMOND, NOT A FILLED SQUARE, AND THE REASON IS LEGIBILITY RATHER THAN TASTE: the
  // V-QUAY bollards immediately above are small FILLED axis-aligned squares, so a filled square
  // here would be a second mark wearing the first one's face. A rotated open figure reads as a
  // different thing at a glance, which is the whole job of a register mark.
  {
    const marks = [];
    const seats = (opts.seating && Array.isArray(opts.seating.seats)) ? opts.seating.seats : [];
    for (const st of seats) {
      if (!Number.isFinite(st.x) || !Number.isFinite(st.y)) continue;
      const s = rw * 0.30;
      marks.push(polyPath([[st.x, st.y - s], [st.x + s, st.y], [st.x, st.y + s], [st.x - s, st.y]]));
      census.registerMarks++;
    }
    g('dress-register', marks.length
      ? `<path d="${marks.join('')}" fill="none" stroke="${T.ink}"`
        + ` stroke-width="${INK.hair}"/>` : '');
    prims.n += marks.length;
  }

  const svg = out.join('');
  return Object.freeze({
    artifactKind: 'PARTITION_PAGE_DRESS',
    schemaVersion: DRESS_SCHEMA_VERSION,
    svg,
    frame: F,
    lens: LENS.id,
    tones: Object.freeze(T),
    ink: Object.freeze(INK),
    groups: Object.freeze(out.map((s) => (s.match(/^<g id="([^"]+)"/) || [])[1]).filter(Boolean)),
    elements: out.length,
    primitives: prims.n,
    census: Object.freeze(census),
    reason: `${out.length} group(s), ${prims.n} primitive(s) on the ${LENS.id} lens:`
      + ` ${census.masses} mass(es) drawing ${census.ridges} ridge(s)`
      + ` (${census.ridgeClipped} clipped to their run's own footprint, ${census.ridgeOutside} refused),`
      + ` ${census.planes} roof plane(s), ${census.hips} hip(s), ${census.chimneys} chimney(s);`
      + ` ${census.bandFaces} band fragment(s) with ${census.towers} tower(s),`
      + ` ${census.gatehouses} gate(s), ${census.ditchHachure} ditch hachure(s);`
      + ` ${census.waterFaces} water face(s), ${census.decks} deck(s), ${census.fords} ford(s),`
      + ` ${census.quays} quay(s) carrying ${census.vquay} V-QUAY mark(s);`
      + ` ${census.grainSegments} grain segment(s), ${census.grainOutside} of them outside their face;`
      + ` §10 state: ${census.stateExpressed} expression(s) drawing ${census.stateBodies} camp`
      + ` body(ies), ${census.barredGates} barred gate(s), ${census.emptyStalls} empty stall(s),`
      + ` ${census.watchFires} watch-fire(s), ${census.trampled} trampled patch(es);`
      + ` relief: ${census.reliefMarks} mark(s) — ${census.hachuresDrawn} hachure(s) in`
      + ` ${census.hachureRuns} run(s) with ${census.hachuresDropped} dropped for want of a run,`
      + ` ${census.formLines} form line(s), ${census.terraces} terrace step(s), ${census.crags}`
      + ` crag(s), ${census.marshTicks} reed tick(s); ${census.profileHillsRefused} profile hill(s)`
      + ` read and refused as an alternative register;`
      + ` decline: ${census.declineMarks} mark(s) over ${census.ruinFaces} LossRegion face(s) —`
      + ` ${census.ruinStanding} standing, ${census.ruinUnroofed} unroofed, ${census.ruinFootings}`
      + ` at their footings, ${census.ruinClearing} being cleared (${census.ruinCleared} rule(s)`
      + ` dropped for the share already taken), ${census.soilMarks} soil-mark(s) on ground that`
      + ` came back, ${census.ruinUndressed} face(s) in a state with no dress`,
  });
}

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * THE TONE LADDER — I3's value floor and I4's separation, both computable
 * ════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐⭐⭐ **THE THREE-TONE GROUND, AND WHY IT IS THREE.** Review I4: *"buildings/yards/plots merge
 * into one pale texture; §650 negative-space streets read only in regularized grids."* A negative
 * -space street can only read if the two sides of the gap DIFFER IN VALUE — so the street ground,
 * the plot (toft) ground and the built footprint are three separate tones, and `valueCensus`
 * asserts the separation rather than trusting it.
 *
 * ⭐⭐ **AND EVERY FABRIC TONE CLEARS THE PAPER BY A FULL VALUE STEP (I3).** `stepFrom` walks a
 * tone toward the ink until its WCAG contrast against the paper reaches `VALUE_STEP`. On a NIGHT
 * lens it walks toward the lens's own pale role instead, because "away from the paper" is a
 * direction, not a sign.
 */
export function tones(LENS, opts = {}) {
  const R = LENS.roles;
  const paper = R.paper;
  const away = LENS.night ? R.roads : R.ink;
  const t = (hex, k, rungs) => atLeast(paper, mix(hex, away, k), VALUE_STEP ** rungs, away);
  // ⛔⛔ **THE FIRST SPELLING OF THIS LADDER SHIPPED I4's OWN DEFECT AND MEASUREMENT CAUGHT IT.**
  // A single floor (*"walk until contrast ≥ VALUE_STEP"*) is a CEILING in disguise: every tone
  // paler than the floor lands EXACTLY on it. The town's first render read
  // `street #c6beac` against `plotGround #c7bfac` — a contrast ratio of **1.00**, which is review
  // I4 (*"buildings/yards/plots merge into one pale texture"*) re-created inside the cure for it.
  // ⭐ THE CURE IS A LADDER, NOT A FLOOR: each ground role is floored at its OWN RUNG of the value
  // step, so the roles are spaced BY CONSTRUCTION and `valueCensus` verifies the spacing it was
  // built with rather than hoping for it.
  // ⛔⛔ **AND THE SECOND SPELLING FAILED TOO, BY 0.06, FOR A REASON WORTH RECORDING.** Rungs
  // measured from the PAPER do not guarantee spacing between the RUNGS: the street landed at
  // 1.367 against its 1.280 rung and ate the gap, so `plot:street` read **1.220 against 1.280**.
  // ⭐ THE LADDER IS THEREFORE SEQUENTIAL — each rung is floored against the tone ABOVE IT, not
  // against the paper — which is the only spelling where "a full step apart" is what the number
  // means. Both failures are left in the record because the second is the interesting one.
  // ⛔⛔ **AND A THIRD FAILURE, ON THE NIGHT LENS, FOR A THIRD REASON — recorded because it is the
  // one that generalises.** "Away from the paper" is a DIRECTION, and on `darkFantasy` the paper
  // is a deep blue-grey ground: walking a ground role toward the INK moves it TOWARD the paper,
  // not away. Measured: `plot:street 1.000` and `built:paper 1.107`. So the walk picks its pole
  // from the tone's own side of the paper, and the poles are read off the LENS'S OWN ROLE TABLE
  // rather than assumed to be white and black.
  const poles = polesOf(R);
  const from = (hex) => (luminance(hex) >= luminance(paper) ? poles.light : poles.dark);
  const street = atLeast(paper, R.roads, VALUE_STEP, from(R.roads));
  // ⭐ THE GROUND LADDER DESCENDS TOWARD THE DARK POLE ON EVERY LENS — that is what makes a mass
  //   stand ON its yard and a yard stand IN its street, night palette included.
  const plotGround = atLeast(street, mix(R.roads, poles.dark, 0.22), VALUE_STEP, poles.dark);
  const built = atLeast(plotGround, R.roofs, VALUE_STEP, poles.dark);
  /**
   * ⛔⛔ **DRESS-FABRIC · THE COUNTRYSIDE GETS A CEILING, AND IT IS THE DEFECT A FLOOR-ONLY LADDER
   * CANNOT SEE.** Every rung above is a FLOOR — *"walk this tone away from the paper until it
   * clears its rung"* — and `valueCensus` asserts five of them and passed 5/5 while the page was
   * wrong. MEASURED at the SPINE-3 tip, parchment lens:
   *
   * ```
   *   paper 0.7351 · street 0.8333 · voidGround 0.6752 · plotGround 0.5121
   *   field 0.3171   ← DARKER THAN THE TOFT IT SURROUNDS
   *   grain 0.1572   ← contrast against BUILT 0.139 is 1.097: the ground hatch and a roof are
   *                    the SAME VALUE, which is the review's "competes with the fabric behind it"
   * ```
   *
   * ⭐ AND THE AREA IS WHAT MAKES IT DECISIVE. i14's page-budget row measures the field at
   * **49–68 % of every plate** against the whole settlement's **1.7–6.9 %**. Weighting each region's
   * distance from the paper by its share of the sheet, the countryside carries **18× the visual mass
   * of the fabric** on the city leaf. The largest region on the page was also its second-darkest.
   *
   * ⭐⭐ **THE CURE MINTS NO NUMBER. IT ADDS TWO RELATIONS, EACH TO A TONE THE LADDER ALREADY
   * COMPUTES**, so the countryside is placed against the town rather than against the paper alone:
   *   1 · the FIELD may never be darker than `plotGround` — the settled ground outranks the
   *       countryside — clamped so the existing `field:paper ≥ VALUE_STEP` floor is untouchable;
   *   2 · the GRAIN keeps a full value step clear of `built` — a ground texture is not a roof.
   * Both are asserted as NEW rows in `valueCensus`. No existing floor is relaxed to make them pass:
   * a census loosened to reach a count is the one move §9 law 7 forbids outright.
   */
  /**
   * ⛔⛔ **THE FIELD FILL IS UNCHANGED AT THIS TIP, AND THE REASON IS A MEASUREMENT, NOT A CHOICE.**
   * The demotion was built, executed corpus-wide and then WITHDRAWN: it reds
   * `i5-role-contrast`'s `water:ground` floor — the only instrument in the estate that sets a
   * non-zero exit code — on `city` (1.4866 → 1.2574) and `town` (1.3768 → 1.1641) against 1.35.
   * ⚠ `town` stood **1.9 % above that floor before this lane touched anything**, so the leaf admits
   * a field move of about **0.03 of luminance — a twentieth of the demotion the page needs.**
   * ⭐ AND WHAT THE ROW ACTUALLY MEASURES IS THE RULING THE CHAIR IS OWED: decomposed pixel by
   * pixel on `city`, i5's `ground` population is **30.3 % roofSE + 23.7 % built + 12.8 % eaves =
   * 66.8 % ROOF**, **25.6 % FIELD**, and **0.7 % `plotGround`** — a role named *ground* that is
   * two thirds roof and contains almost no ground, because `building` builds i5's urban envelope
   * and is then not among its measured roles. Lowering that floor or re-predicating that role is
   * PA.5's act and not a lane's; the demotion waits on it rather than shipping a red.
   */
  const field = atLeast(paper, mix(R.greens, from(R.greens), 0.06), VALUE_STEP, from(R.greens));
  /**
   * The furrow's own tone: the field, further down — then held a full step clear of a ROOF.
   * ⛔⛔ **AND THE DIRECTION IS PICKED FROM THE LENS, WHICH THIS FUNCTION'S OWN HEADER ALREADY
   * WARNED ABOUT AND I WALKED INTO ANYWAY.** The first spelling walked the grain *toward the paper*
   * — right on parchment, wrong on `darkFantasy`, where the paper (lum 0.0175) is DARKER than the
   * built tone (0.0248), so "toward the paper" moves the hatch INTO the roof's own value and the
   * loop can never escape: measured, `grain:built` **1.069 against 1.280**. The quiet side of a
   * roof is whichever pole the PAPER lies on, exactly as the third failure recorded above this
   * ladder concluded — *"away from the paper is a DIRECTION, not a sign"* — one function further
   * down and in the same week.
   */
  /**
   * ⛔⛔ **AND THE FIRST CURE PUT THE FURROW ON THE WATER'S OWN VALUE — i5 CAUGHT IT, AND THE FIX
   * IS A BETTER RULE RATHER THAN A SOFTER ONE.** With the field demoted, `mix(field, dark, 0.34)`
   * landed the grain at lum **0.261** against the water's **0.260**: the two roles became the same
   * value. `i5-role-contrast` — the one instrument in the estate that sets a non-zero exit code —
   * went **`water:ground` 1.4866 → 1.2616 on `city` and 1.3768 → 1.1681 on `town`, against its
   * 1.35 floor**. Its `ground` population on a dress plate is 31,045 px of urban-envelope pixels
   * left over after street/wall/water, and their measured RGB tracks the GRAIN, so what that row
   * actually reads on this plate is *the water against the countryside's furrow hatch*.
   *
   * ⛔ **THE FLOOR IS NOT MINE TO LOWER**, whatever the row is really measuring. The furrow is
   * re-derived instead: a texture belongs to its own surface, so it is stated as **at most one
   * value step under the FIELD it lies on** — which is a relation to the thing it textures, where
   * the old `0.34 toward black` was a walk with no referent at all. Two clearances follow and both
   * are asserted rather than assumed: a step off a ROOF, and a step off the WATER.
   */
  /**
   * ⭐⭐ **`clearOf` — WALK A TONE AWAY FROM AN OBSTACLE, AND LET THE OBSTACLE PICK THE DIRECTION.**
   * Every earlier walk in this ladder took its pole from the PAPER, which is right for a rung and
   * wrong for a clearance: to get clear of a role you must move to the far side of THAT role, and
   * which side that is depends on where you already stand. Hard-coding either pole is how this
   * lane put the furrow inside the roof on `darkFantasy` twice in one afternoon.
   */
  const water = atLeast(paper, R.water, VALUE_STEP, from(R.water));
  /**
   * ⭐⭐⭐ **THE FURROW IS DEMOTED AT THE SURFACE THE READER SEES, NOT IN THE TONE TABLE — AND THAT
   * IS THE ONLY DOOR THE PALETTE LEAVES OPEN.**
   *
   * The named defect is real and measured: `grain:built` = **1.097** at the SPINE-3 tip, i.e. the
   * countryside's hatch and a roof are the same value. But every cure that moves a TONE is closed:
   *   · moving the FIELD reds i5's `water:ground` (see the field's own line above);
   *   · moving the GRAIN's tone cannot satisfy both clearances at once — on `illustrated` the roof
   *     (lum 0.1516) and the water (0.2317) are **1.397 apart in contrast**, and a full step from
   *     each would need **1.28 × 1.28 = 1.638**. There is no such colour. Measured, not argued:
   *     the same construction reds `grain:built` at 1.273 (parchment), 1.134 (watercolor) and
   *     1.020 (illustrated).
   *
   * ⭐ SO THE HATCH IS QUIETED BY ITS **OPACITY**, WHICH IS DERIVED RATHER THAN PICKED. The rendered
   * furrow is `field` seen through `grain` at α; α is solved so that what actually lands on the
   * page is **exactly one value step under the field it textures** — the same law the tone version
   * wanted, asked at the pixel instead of at the table. `GRAIN.opacity`'s 0.72 was carried forward
   * verbatim from a review that convicted the family's REACH and not its weight, and it was never
   * anybody's derived figure. On parchment α solves to ≈0.50: the hatch keeps its hue, its pitch,
   * its stroke and its clip, and stops out-shouting the fabric it sits behind.
   *
   * ⚠ **AND IT MOVES NO DECLARED TONE, SO NO EXISTING VALUE ROW CAN MOVE** — which is exactly why
   * it is the shippable half of this lever.
   */
  /**
   * ⭐⭐⭐ **DRESS-FRAME · THE COUNTRYSIDE GOES BACK TOWARD BARE PAPER — SOLVED, NOT CHOSEN, AND AT
   * THE PIXEL BECAUSE EVERY TONE-SIDE DOOR IS STILL SHUT.**
   *
   * The reference paints plain countryside with **ZERO INK**: it is the page ground, the brightest
   * value on the plate, and the settlement is the only dark mass on it (R-WATABOU-PAINT §2). Ours
   * runs the other way — MEASURED on parchment at this tip, `field` sits at luminance **0.3171
   * against `plotGround`'s 0.5121**, so the countryside is a DARKER thing than the ground the town
   * itself stands on. That is the reference's value hierarchy inverted, over the largest region on
   * the sheet.
   *
   * ⛔ THE TWO DOORS THAT ARE STILL SHUT, and neither is mine to open:
   *   · moving the FIELD's declared tone reds `valueCensus`'s `field:paper ≥ VALUE_STEP` floor —
   *     and relaxing a census to reach a count is the one move §9 law 7 forbids outright;
   *   · §701.5 measured a tone-side demotion redding `i5`'s `water:ground` on `city` and `town`,
   *     and that instrument's cure is PA.5's act.
   *
   * ⭐⭐ **AND THE SECOND DOOR IS NOW OPEN BY MEASUREMENT — WHICH IS THE FRAMING PAYING FOR THE
   * PAINT.** i5's `ground` role is the urban envelope minus street/wall/water, so it was two-thirds
   * ROOF and a quarter FIELD (§701.6). Fitting the page to the settlement multiplies the envelope:
   * `town`'s ground population goes **32,782 px → 112,067 px**, and `water:ground` with it —
   * **town 1.3745 → 1.7987, city 1.4897 → 1.6856**, against the 1.35 floor. The headroom that
   * blocked §701.5 was **1.9 %**; it is **33 %** here. Both figures are executed at this tip on the
   * estate's own i5 through its own shooter, base and tip, and both plates read `I5_PASS`.
   *
   * ⭐ SO THE DEMOTION SHIPS THE WAY THE FURROW DID — by a SOLVED ALPHA, which moves no declared
   * tone and therefore no value row. The relation it solves mints no number: **the countryside, as
   * the reader meets it, stands one value step on the PAPER'S OWN SIDE of the settled ground.**
   * The town's ground is the darker thing and the countryside the lighter, which is the reference's
   * law stated in our own ladder's units. On `darkFantasy` the field is already on the right side
   * and α solves to 1 — the night lens is untouched, as it should be.
   */
  const fieldOpacity = solveFieldAlpha(paper, field, plotGround);
  /** What the reader actually meets where the countryside is drawn. */
  const fieldOnPage = mix(paper, field, fieldOpacity);
  const grain = mix(field, poles.dark, 0.34);
  /**
   * ⚠ **THE FURROW IS NOW SOLVED AGAINST WHAT LANDS, NOT AGAINST WHAT IS DECLARED — and that is a
   * correction to §701.5's own arm rather than an addition to it.** Its law is *"one value step
   * under the field it textures"*; with the field itself stepping back toward the paper, solving
   * against the declared tone would leave the hatch a full three steps louder than the ground it
   * lies on, and the countryside would end up reading as corduroy on bare paper — the same defect
   * §701.5 cured, arriving from the other side. The law is unchanged; the surface it is asked at is
   * the one the reader sees, which is what that arm said it was doing all along.
   */
  const grainOpacity = solveFurrowAlpha(fieldOnPage, grain);
  /** ⟦DRESS-2 W2⟧ the two relief alphas — see the `relief` row below for why there are two */
  const reliefInk = mix(fieldOnPage, poles.dark, 0.55);
  const reliefOpacity = solveFurrowAlpha(fieldOnPage, reliefInk);
  const terraceOpacity = solveFurrowAlpha(plotGround, reliefInk);
  return {
    reliefOpacity,
    terraceOpacity,
    /** ⭐ THE ALPHA THE COUNTRYSIDE'S FILL IS DRAWN AT, solved per lens. See the block above. */
    fieldOpacity,
    /** The field as the reader meets it — published so a census can read the SEEN tone. */
    fieldOnPage,
    paper,
    ink: R.ink,
    wall: R.walls,
    water,
    waterInk: mix(R.water, poles.dark, 0.45),
    field,
    /** RUNG 1 · the palest ground role — §9.7's own law, and the street IS the gap */
    street,
    /** ⭐ RUNG 2 · THE TOFT. A full step off the STREET, or the negative space stops reading. */
    plotGround,
    voidGround: atLeast(street, mix(R.roads, poles.dark, 0.10), VALUE_STEP ** 0.5, poles.dark),
    /** the furrow's own tone: the field, further down — a texture, never map ink */
    grain,
    /**
     * ⭐ THE ALPHA THE FURROW IS DRAWN AT, SOLVED PER LENS. See `tones`' furrow block: the hatch is
     * demoted at the pixel because every tone-side cure is arithmetically closed on this palette.
     */
    grainOpacity,
    /** ⭐ RUNG 3 · the built footprint, a full step under the toft it stands in */
    built,
    /**
     * ⭐⭐ ⟦DRESS-2 W1⟧ **THE CANVAS TONE — a tent is not a roof, and it mints no number.**
     * The legacy renderer draws every §10 body at `mix(P.paper, P.roofs, 0.42)`. The 0.42 is its
     * shipped relation and the only figure here that is not this module's.
     *
     * ⛔⛔ **AND THE FIRST SPELLING OF THIS LINE FAILED ON `darkFantasy` FOR THE FOURTH TIME IN
     * THIS FILE'S HISTORY, FOR THE THIRD TIME FOR THE SAME REASON.** Written literally — walk
     * `mix(paper, built, 0.42)` away from the paper toward `poles.dark` — it measured
     * **`camp:paper` 1.242 against 1.280** and redded the gate. On the night lens the paper IS the
     * dark pole's neighbour, so "walk toward dark" walks TOWARD the paper and the 48-iteration
     * bound expires with the tone still inside the step. *Away from the paper is a DIRECTION, not
     * a sign* — this module's own words, recorded twice above this line, and I walked into it
     * anyway. ⭐ **It was the `valueCensus` row that caught it, on its own first day, which is
     * what that row is for and is why it is not a vacuous assertion.**
     *
     * ⭐⭐ **THE CURE IS A RELATION, NOT A WALK, AND IT CANNOT HAVE A DIRECTION BUG.** The canvas
     * is placed between two tones THE LADDER ALREADY COMPUTES — *a tent stands between the ground
     * it is pitched on and the roof it is not.* `plotGround` is rung 2 and `built` is rung 3, so
     * both already clear the paper by construction on every lens, in whichever direction that
     * lens's own palette runs; a blend of the two is bracketed by them and inherits the clearance.
     * There is no pole to pick, and on `darkFantasy` the ordering that broke the walk is the very
     * thing that now makes the relation hold.
     */
    camp: mix(plotGround, built, 0.42),
    /**
     * ⭐⭐ ⟦DRESS-2 W2⟧ **RELIEF INK, AND IT MINTS NO NUMBER EITHER.** The land's own marks are a
     * GROUND TEXTURE in the reference (§8: hachure and contour are plan systems drawn on the
     * ground, not map ink laid over it), so they take the FURROW'S OWN LAW — *at most one value
     * step under the surface they lie on* — asked at the pixel through the same solver §701.5
     * already ships. The construction is the grain's, one step further down because a relief
     * stroke is a line and a furrow is a texture.
     *
     * ⛔ TWO ALPHAS, NOT ONE, AND THE SECOND IS NOT AN AFTERTHOUGHT. The open families lie on the
     * COUNTRYSIDE and the terraces lie on the SETTLED GROUND, which DRESS-FRAME deliberately left
     * two value steps apart. One alpha would make the terraces invisible on the toft or the
     * hachures shout on the field; solving each against the surface it actually lands on is the
     * same discipline that made the furrow's own cure work.
     */
    relief: mix(fieldOnPage, poles.dark, 0.55),
    roofNW: built,
    roofSE: mix(built, poles.dark, 0.26),
    eaves: mix(R.roofs, poles.dark, 0.55),
    bandGround: mix(R.walls, R.paper, 0.42),
    deck: mix(built, poles.dark, 0.18),
    accessible: !!opts.accessible || LENS.pattern,
  };
}

/** Walk `hex` away from `paper` until its contrast against the paper reaches `want`. */
export function atLeast(paper, hex, want, away) {
  let cur = hex;
  for (let i = 0; i < 48 && contrast(paper, cur) < want; i++) cur = mix(cur, away, 0.06);
  return cur;
}

/**
 * ⭐ **THE MIRROR OF `atLeast`, AND THE ESTATE HAD NO SPELLING OF IT.** Walk `hex` toward `toward`
 * until its contrast against `anchor` falls TO `want`. Every rung in this module was a floor; a
 * ladder made only of floors has no way to say *"and no darker than this"*, which is precisely how
 * the countryside walked past the fabric with a 5/5 census behind it. Same 0.06 step and same
 * 48-iteration bound as `atLeast`, so the two are each other's exact inverse.
 */
export function atMost(anchor, hex, want, toward) {
  let cur = hex;
  for (let i = 0; i < 48 && contrast(anchor, cur) > want; i++) {
    const next = mix(cur, toward, 0.06);
    /**
     * ⛔ **IT APPROACHES FROM ABOVE AND NEVER CROSSES, AND THE FIRST SPELLING DID CROSS.** Walking
     * *while* contrast > want stops on the first step BELOW it: measured, `field:paper` landed at
     * **1.274 against its own 1.280 floor** and reddened the very row this ceiling was built to
     * leave alone. A ceiling that breaks the floor under it is not a ceiling, it is a bug — so the
     * step is refused when it would cross, and the FLOOR wins every tie. Where the two coincide
     * (`fieldCeiling` clamped up to `VALUE_STEP`) this function is therefore a no-op by design.
     */
    if (contrast(anchor, next) < want) break;
    cur = next;
  }
  return cur;
}

/**
 * ⭐⭐ **SOLVE THE FURROW'S ALPHA.** Return the largest α ∈ (0,1] at which `field` seen through
 * `grain` still lies within ONE VALUE STEP of `field` — the hatch as the reader meets it, not as
 * the table declares it. Coarse-to-fine over 100 steps: a closed form would need the sRGB transfer
 * function inverted through a three-channel blend, and the search is exact to 1 % of α, which is
 * finer than any opacity difference a raster can express at this register.
 *
 * ⚠ It never returns 0: a furrow that cannot clear the step at any opacity is still drawn at the
 * finest α the search offers, because a countryside with no texture at all is a different defect
 * from a countryside with a loud one.
 */
/**
 * ⭐⭐ **SOLVE THE COUNTRYSIDE'S ALPHA (DRESS-FRAME).** Return the largest α ∈ (0,1] at which the
 * field, seen over the paper, still stands a full value step clear of the settled `ground` **on the
 * paper's own side of it** — so the town's ground is the darker thing and the countryside the
 * lighter, whichever way round the lens's own palette runs.
 *
 * ⚠ THE SIDE TEST IS NOT DECORATION. Contrast is a magnitude and has no sign, so a search that
 * asked only for `contrast ≥ VALUE_STEP` would happily return α = 1 on a lens whose field is a step
 * clear of the ground on the WRONG side — which is the state this function exists to leave. This is
 * the same lesson `tones` records three times over: *away from the paper is a DIRECTION, not a sign.*
 *
 * ⚠ It never returns 0, for `solveFurrowAlpha`'s reason: a countryside painted at nothing at all is
 * a different defect from one painted too loud, and the caller is entitled to see which it has.
 */
export function solveFieldAlpha(paper, field, ground) {
  const paperIsLighter = luminance(paper) >= luminance(ground);
  let best = 0.01;
  for (let i = 1; i <= 100; i++) {
    const a = i / 100;
    const seen = mix(paper, field, a);
    const onPaperSide = paperIsLighter
      ? luminance(seen) > luminance(ground) : luminance(seen) < luminance(ground);
    if (onPaperSide && contrast(seen, ground) >= VALUE_STEP) best = a; else break;
  }
  return Math.round(best * 100) / 100;
}

export function solveFurrowAlpha(field, grain) {
  let best = 0.01;
  for (let i = 1; i <= 100; i++) {
    const a = i / 100;
    if (contrast(field, mix(field, grain, a)) <= VALUE_STEP) best = a; else break;
  }
  return Math.round(best * 100) / 100;
}

/** One value step off the paper — the floor I3's cure names. Kept for callers that want it bare. */
export function stepFrom(paper, hex, away) { return atLeast(paper, hex, VALUE_STEP, away); }

/**
 * ⭐⭐ **THE VALUE-HIERARCHY CENSUS (exit 2), COMPUTED FROM THE TONES THEMSELVES.** Two claims,
 * both from the review: I3 — *no fabric at near-paper value* — and I4 — *street ground ≠ plot
 * ground*. Both are properties of the ladder, so both are checkable without a raster.
 */
export function valueCensus(T) {
  const rows = [
    /** ⭐ I4's OWN ROW — the one the first spelling failed at 1.00 and the second at 1.220. */
    ['plot:street', contrast(T.street, T.plotGround), VALUE_STEP],
    /** ⭐ I3's OWN ROW: the mass clears the yard it stands in, and the gap it stands beside */
    ['built:plot', contrast(T.plotGround, T.built), VALUE_STEP],
    ['built:street', contrast(T.street, T.built), VALUE_STEP],
    /** the countryside genuinely lies on bare page, so it genuinely owes the paper a step */
    ['field:paper', contrast(T.paper, T.field), VALUE_STEP],
    ['roofSE:roofNW', contrast(T.roofNW, T.roofSE), 1.10],
    /**
     * ⭐⭐ **DRESS-FABRIC's TWO CEILING ROWS — the half of the hierarchy five floors could not
     * state.** Both are floors on NEW pairs, not relaxations of the five above: nothing that
     * passed before is asked for less.
     *
     * `grain:built` — the ground hatch keeps a full value step clear of a roof. It measured
     *   **1.097** at the SPINE-3 tip: the countryside's texture and the town's fabric were the
     *   same value, which is the review's *"the chevron ground-hatch competes with the fabric it
     *   should sit behind"* as a number rather than an impression.
     * ⚠ **AND THE COUNTRYSIDE-ORDERING ROW IS DELIBERATELY ABSENT.** The natural third ceiling —
     *   *the field may not sit further from the paper than the toft* — is TRUE of the page's needs
     *   and FALSE of this tip (`field:paper` 2.138 against `plotGround:paper` 1.397), and the cure
     *   for it is blocked by i5's `water:ground` floor as recorded at the field's own line above.
     *   **An asserted row that the shipped palette fails is a red, and a row written to be skipped
     *   is worse than no row**, so the claim is carried in the ledger as a chair ruling rather than
     *   planted here as a test that would have to be exempted on its first day.
     */
    /**
     * ⭐⭐ **THE RENDERED FURROW, WHICH IS THE ROW THE PAGE ACTUALLY OWES.** `grain:built` is a
     * pair of DECLARED tones and it is unsatisfiable at this palette (see `tones`), so flooring it
     * would plant a row that reds on its first day. What IS satisfiable, and is what the eye reads,
     * is the hatch AS DRAWN: `field` seen through `grain` at the emitted opacity, held to at most
     * one value step under the field. Stated as a ratio so it is a floor like every other row.
     * ⛔ **THE ROW CONVICTS THE BASE**: at `GRAIN.opacity` 0.72 the rendered furrow measures 1.628
     * under its field, ratio 0.786 — red. That is the negative control, and it is the shipped
     * predicate rather than a comment about one.
     */
    ['furrow≤onestep', VALUE_STEP / contrast(T.field, mix(T.field, T.grain, T.grainOpacity)), 1.0],
    /**
     * ⭐ ⟦DRESS-2 W1⟧ **THE CANVAS OWES THE PAPER A STEP TOO.** The §10 bodies are the first ink
     * on this page whose tone relation came from OUTSIDE this ladder (the legacy renderer's
     * `mix(paper, roofs, 0.42)`), so it is the family most likely to land near-paper on a lens
     * nobody checked. The floor is I3's own, and it is asserted rather than assumed.
     */
    ['camp:paper', contrast(T.paper, T.camp), VALUE_STEP],
  ];
  /**
   * ⚠⚠ **THREE PAIRS ARE REPORTED AND NOT FLOORED, AND EACH REFUSAL IS A RULING WITH A SOURCE —
   * this is the fourth correction this census forced on its own author.**
   *
   * `street:paper` — §9.7's binding sub-law is *"ROADS ARE THE PALEST ROLE ON THE PAGE"*. A street
   *   therefore CANNOT be walked further from the paper; on `accessible` the two are the same
   *   white by design. Flooring it would convict every lens for obeying the law above it. The
   *   street reads because the FABRIC AROUND IT is darker — which is `plot:street`, floored above.
   * `built:paper` — the built fabric never stands on bare page; it stands in its toft inside its
   *   street, and both of those pairs are floored. On a night lens the roofs sit near the ground's
   *   own value BY DESIGN (folioLenses: *"the paper is a deep blue-grey ground"*).
   * `water:paper` — i5's own header rules that **water is read by HUE, not value**, and i1 measures
   *   it on blue-minus-red for exactly that reason. A value floor is the wrong instrument here;
   *   i7's hue band is the water test.
   * All three ride as WATCH FIGURES so a drift is visible in a diff, exactly as i10's s* rides
   * beside the `wall:all` row.
   */
  const watch = [
    ['street:paper', contrast(T.paper, T.street)],
    ['built:paper', contrast(T.paper, T.built)],
    ['water:paper', contrast(T.paper, T.water)],
  ];
  const fails = rows.filter(([, v, f]) => !(v >= f - 1e-9));
  return {
    rows: rows.map(([k, v, f]) => ({ pair: k, ratio: Math.round(v * 1e4) / 1e4, floor: Math.round(f * 1e4) / 1e4, pass: v >= f - 1e-9 })),
    watch: watch.map(([k, v]) => ({ pair: k, ratio: Math.round(v * 1e4) / 1e4 })),
    ok: fails.length === 0,
    nearPaper: rows.filter(([k, v]) => k.endsWith(':paper') && v < VALUE_STEP).map(([k]) => k),
    reason: `${rows.length - fails.length}/${rows.length} value pair(s) clear their rung`
      + `${fails.length ? `; FAILING: ${fails.map(([k, v, f]) => `${k} ${v.toFixed(3)}<${f.toFixed(3)}`).join(', ')}` : ''}`
      + `; WATCH ${watch.map(([k, v]) => `${k} ${v.toFixed(3)}`).join(' · ')}`,
  };
}

/**
 * ⭐ THE LENS'S OWN TWO POLES, read off its role table rather than assumed. A night lens's dark
 * pole is its ink (`#05070B`) and its light pole its roads (`#6E7486`) — neither is white or
 * black, and hard-coding either is how a value ladder inverts on a palette it was not written for.
 */
export function polesOf(roles) {
  let light = null; let dark = null; let lo = Infinity; let hi = -Infinity;
  for (const hex of Object.values(roles)) {
    const l = luminance(hex);
    if (l > hi) { hi = l; light = hex; }
    if (l < lo) { lo = l; dark = hex; }
  }
  return { light, dark };
}

/** WCAG contrast ratio between two hexes, on `folioLenses.luminance`'s own formula. */
export function contrast(a, b) {
  const la = luminance(a); const lb = luminance(b);
  return la > lb ? (la + 0.05) / (lb + 0.05) : (lb + 0.05) / (la + 0.05);
}

/** Linear blend in sRGB space. Enough for a value ladder; no colour library is pulled in. */
export function mix(a, b, k) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * k));
  return `#${c.map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('')}`;
}

/**
 * ⭐ INK IN PLOT FRONTAGES, NEVER IN VIEW UNITS. renderFolio's §179 lesson, verbatim in effect:
 * *"the module the town was laid out in is the module its ink is drawn in, so the hierarchy
 * survives every tier automatically instead of being right at one and wrong at the rest."*
 */
export function inkScale(rw, mult = 1) {
  const s = (k, lo, hi) => Math.max(lo, Math.min(hi, rw * k)) * mult;
  return {
    hair: r2(s(0.030, 0.16, 0.55)),
    detail: r2(s(0.055, 0.26, 0.95)),
    body: r2(s(0.085, 0.40, 1.45)),
    strong: r2(s(0.130, 0.60, 2.20)),
    wall: r2(s(0.300, 1.80, 4.60)),
  };
}

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * THE CLIP — one exact primitive, and every texture in this file goes through it
 * ════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐⭐⭐ **SCANLINE HATCH, EXACTLY CLIPPED TO AN ARBITRARY (possibly non-convex) RING.** This is
 * I7's cure and the §650.2 clip census's own guarantee: a texture generated this way CANNOT leave
 * its face, because the spans are the ring's own interior intervals along each rule. No tolerance,
 * no snapping, and no `clipPath` element (which would cost an op per family and still not be
 * checkable by a census reading the path data).
 *
 * @param {Array<[number,number]>} ring
 * @param {number} angDeg rule direction in degrees
 * @param {number} pitch spacing between rules, in world units
 */
export function hatchPolygon(ring, angDeg, pitch) {
  if (!ring || ring.length < 3 || !(pitch > 0)) return [];
  const ca = Math.cos(angDeg * DEG); const sa = Math.sin(angDeg * DEG);
  // rotate into rule-space, band by the perpendicular coordinate
  const proj = ring.map(([x, y]) => [x * ca + y * sa, -x * sa + y * ca]);
  let lo = Infinity; let hi = -Infinity;
  for (const p of proj) { if (p[1] < lo) lo = p[1]; if (p[1] > hi) hi = p[1]; }
  const out = [];
  const n = proj.length;
  for (let v = Math.ceil(lo / pitch) * pitch; v <= hi; v += pitch) {
    const xs = [];
    for (let i = 0; i < n; i++) {
      const a = proj[i]; const b = proj[(i + 1) % n];
      if ((a[1] > v) === (b[1] > v)) continue;
      const t = (v - a[1]) / (b[1] - a[1]);
      xs.push(a[0] + (b[0] - a[0]) * t);
    }
    if (xs.length < 2) continue;
    xs.sort((p, q) => p - q);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      if (xs[k + 1] - xs[k] < 1e-6) continue;
      out.push([
        [xs[k] * ca - v * sa, xs[k] * sa + v * ca],
        [xs[k + 1] * ca - v * sa, xs[k + 1] * sa + v * ca],
      ]);
    }
  }
  return out;
}

/**
 * ⭐⭐ **CLIP A SEGMENT TO A RING — PA.6's ridge clip, and B7's overshoot class dies here.** The
 * returned segment is the LONGEST interior span of the infinite line through `a`,`b` that also
 * lies within the original segment. `null` when the ridge lies wholly outside its own footprint,
 * which the census counts rather than silently drawing.
 */
export function clipSegment(ring, a, b) {
  const dx = b[0] - a[0]; const dy = b[1] - a[1];
  const L2 = dx * dx + dy * dy;
  if (L2 < 1e-12) return null;
  const ts = [0, 1];
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i]; const q = ring[(i + 1) % ring.length];
    const ex = q[0] - p[0]; const ey = q[1] - p[1];
    const den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-12) continue;
    const t = ((p[0] - a[0]) * ey - (p[1] - a[1]) * ex) / den;
    const u = ((p[0] - a[0]) * dy - (p[1] - a[1]) * dx) / den;
    if (u >= 0 && u <= 1 && t > 0 && t < 1) ts.push(t);
  }
  ts.sort((x, y) => x - y);
  let best = null; let bestLen = 0;
  for (let i = 0; i + 1 < ts.length; i++) {
    const m = (ts[i] + ts[i + 1]) / 2;
    const px = a[0] + dx * m; const py = a[1] + dy * m;
    if (!inRing(ring, px, py)) continue;
    const len = ts[i + 1] - ts[i];
    if (len > bestLen) { bestLen = len; best = [ts[i], ts[i + 1]]; }
  }
  if (!best || bestLen < 1e-9) return null;
  return [[a[0] + dx * best[0], a[1] + dy * best[0]], [a[0] + dx * best[1], a[1] + dy * best[1]]];
}

/**
 * ⭐⭐ ⟦DRESS-2 W2⟧ **TRIM AN OPEN POLYLINE TO THE PAGE FRAME, KEEPING EVERY VISIBLE RUN.**
 * Returns zero or more sub-polylines. A segment that crosses an edge is cut AT the edge, so a
 * contour entering and leaving the page three times yields three drawn runs — the straddling case
 * that made off-page culling a hazard rather than a free win. Liang–Barsky per segment, which is
 * exact for an axis-aligned rectangle and needs no tolerance.
 *
 * ⚠ It is deliberately NOT used on rings. A closed shape trimmed this way stops being closed, and
 * every ring on this page is a fill whose winding the renderer needs intact.
 */
export function clipPolyline(pts, F) {
  if (!pts || pts.length < 2) return [];
  const x0 = F.x; const y0 = F.y; const x1 = F.x + F.w; const y1 = F.y + F.h;
  const inside = (p) => p[0] >= x0 && p[0] <= x1 && p[1] >= y0 && p[1] <= y1;
  const out = [];
  let run = [];
  const flush = () => { if (run.length >= 2) out.push(run); run = []; };
  for (let i = 0; i + 1 < pts.length; i++) {
    const a = pts[i]; const b = pts[i + 1];
    if (!Number.isFinite(a[0]) || !Number.isFinite(b[0])) { flush(); continue; }
    let t0 = 0; let t1 = 1;
    const dx = b[0] - a[0]; const dy = b[1] - a[1];
    let drop = false;
    for (const [p, q] of [[-dx, a[0] - x0], [dx, x1 - a[0]], [-dy, a[1] - y0], [dy, y1 - a[1]]]) {
      if (p === 0) { if (q < 0) { drop = true; break; } continue; }
      const r = q / p;
      if (p < 0) { if (r > t1) { drop = true; break; } if (r > t0) t0 = r; } else if (r < t0) { drop = true; break; } else if (r < t1) t1 = r;
    }
    if (drop) { flush(); continue; }
    const pa = [a[0] + dx * t0, a[1] + dy * t0];
    const pb = [a[0] + dx * t1, a[1] + dy * t1];
    if (!run.length) run.push(pa);
    else if (Math.abs(run[run.length - 1][0] - pa[0]) > 1e-9
      || Math.abs(run[run.length - 1][1] - pa[1]) > 1e-9) { flush(); run.push(pa); }
    run.push(pb);
    // the segment left the page part-way along it, so the run ends here
    if (t1 < 1 - 1e-9 || !inside(b)) flush();
  }
  flush();
  return out;
}

export function inRing(ring, px, py) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0]; const yi = ring[i][1];
    const xj = ring[j][0]; const yj = ring[j][1];
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * small ring arithmetic
 * ════════════════════════════════════════════════════════════════════════════════════════ */

function insetRing(ring, d) {
  if (!ring || ring.length < 3 || !(d > 0)) return ring;
  const c = centroid(ring);
  const out = ring.map(([x, y]) => {
    const dx = x - c[0]; const dy = y - c[1];
    const L = Math.hypot(dx, dy);
    if (L <= d * 1.05) return [x, y];
    return [x - (dx / L) * d, y - (dy / L) * d];
  });
  return out;
}

function grainAngle(ring) {
  // the furlong's strips run with the face's own long axis — never a global direction, which
  // is what makes hf140's "varying orientations" true rather than decorative.
  let bi = 0; let bj = 1; let bd = -1;
  for (let i = 0; i < ring.length; i++) {
    for (let j = i + 1; j < ring.length; j++) {
      const d = (ring[i][0] - ring[j][0]) ** 2 + (ring[i][1] - ring[j][1]) ** 2;
      if (d > bd) { bd = d; bi = i; bj = j; }
    }
  }
  return (Math.atan2(ring[bj][1] - ring[bi][1], ring[bj][0] - ring[bi][0]) / DEG) + 90;
}

function seFacingEdges(ring) {
  const out = [];
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i]; const b = ring[(i + 1) % ring.length];
    const nx = b[1] - a[1]; const ny = -(b[0] - a[0]);
    // SE is +x,+y on the page; an edge whose outward normal points that way catches the shadow
    if (nx + ny > 0) out.push([a, b]);
  }
  return out;
}

function twoNearest(ring, p) {
  const d = ring.map((q, i) => [i, (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2]);
  d.sort((a, b) => a[1] - b[1]);
  return d.slice(0, 2).map(([i]) => ring[i]);
}

function lerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }

function sameSeg(a, b) {
  return Math.abs(a[0][0] - b[0][0]) < 1e-9 && Math.abs(a[0][1] - b[0][1]) < 1e-9
    && Math.abs(a[1][0] - b[1][0]) < 1e-9 && Math.abs(a[1][1] - b[1][1]) < 1e-9;
}

function alongRing(ring, t) {
  let total = 0;
  const seg = [];
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i]; const b = ring[(i + 1) % ring.length];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    seg.push([a, b, L]); total += L;
  }
  let want = total * t;
  for (const [a, b, L] of seg) {
    if (want <= L) return lerp(a, b, L > 0 ? want / L : 0);
    want -= L;
  }
  return ring[0];
}

function outwardNormal(ring, i, closed) {
  const n = ring.length;
  const a = ring[(i - 1 + n) % n]; const b = ring[(i + 1) % n];
  const dx = b[0] - a[0]; const dy = b[1] - a[1];
  const L = Math.hypot(dx, dy) || 1;
  let nx = dy / L; let ny = -dx / L;
  if (closed) {
    const c = centroid(ring);
    if ((ring[i][0] - c[0]) * nx + (ring[i][1] - c[1]) * ny < 0) { nx = -nx; ny = -ny; }
  }
  return [nx, ny];
}

/** The band FACE as a polygon: the ring offset both ways by half the stone. */
function bandOf(ring, band, closed) {
  if (!ring || ring.length < 3) return null;
  const h = band.stone / 2;
  const outer = [];
  const inner = [];
  for (let i = 0; i < ring.length; i++) {
    const n = outwardNormal(ring, i, closed);
    outer.push([ring[i][0] + n[0] * h, ring[i][1] + n[1] * h]);
    inner.push([ring[i][0] - n[0] * h, ring[i][1] - n[1] * h]);
  }
  return outer.concat(inner.reverse());
}

function combTicks(ring, band, pitch, closed) {
  const out = [];
  const h = band.stone / 2;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i]; const b = ring[(i + 1) % ring.length];
    if (!closed && i === ring.length - 1) break;
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const k = Math.max(1, Math.floor(L / pitch));
    const n = outwardNormal(ring, i, closed);
    for (let j = 0; j < k; j++) {
      const p = lerp(a, b, (j + 0.5) / k);
      out.push([[p[0] + n[0] * h, p[1] + n[1] * h],
        [p[0] + n[0] * (h + pitch * 0.45), p[1] + n[1] * (h + pitch * 0.45)]]);
    }
  }
  return out;
}

/** hf315's ten tower plans, reduced to the five kinds `TOWER_TYPES` actually mints. */
function towerPlan(t, kind, stone, rung) {
  const [x, y] = t;
  const r = stone * ((rung && rung.towerScale) || 1);
  if (kind === 'drum') {
    return `M${q(x - r)} ${q(y)}a${q(r)} ${q(r)} 0 1 0 ${q(r * 2)} 0`
      + `a${q(r)} ${q(r)} 0 1 0 ${q(-r * 2)} 0Z`;
  }
  if (kind === 'beaked') {
    return polyPath([[x - r, y - r], [x + r * 0.2, y - r], [x + r * 1.5, y],
      [x + r * 0.2, y + r], [x - r, y + r]]);
  }
  if (kind === 'open-backed-D') {
    return `M${q(x)} ${q(y - r)}a${q(r)} ${q(r)} 0 0 1 0 ${q(r * 2)}`;
  }
  if (kind === 'angle') {
    return polyPath([[x - r, y - r * 0.8], [x + r, y - r * 0.8], [x + r * 0.8, y + r],
      [x - r * 0.8, y + r]]);
  }
  return polyPath([[x - r, y - r], [x + r, y - r], [x + r, y + r], [x - r, y + r]]);
}

/**
 * ⭐ hf313's PLAN VIGNETTES, seated **IN** the band. The passage is a rectangle cut through the
 * band along the gate's own normal; the anatomy from the rung decides what flanks it.
 */
function gatePlan(g, band, rung, rw) {
  const half = band.stone * (rung && rung.gate === 'twin-drum' ? 1.9 : rung && rung.gate === 'block' ? 1.5 : 1.1);
  const depth = band.stone / 2 + band.outer * 0.35;
  const dx = g.dx || 1; const dy = g.dy || 0;
  const L = Math.hypot(dx, dy) || 1;
  const nx = dx / L; const ny = dy / L;
  const tx = -ny; const ty = nx;
  const p = [g.x, g.y];
  const quad = [
    [p[0] + tx * half - nx * depth, p[1] + ty * half - ny * depth],
    [p[0] + tx * half + nx * depth, p[1] + ty * half + ny * depth],
    [p[0] - tx * half + nx * depth, p[1] - ty * half + ny * depth],
    [p[0] - tx * half - nx * depth, p[1] - ty * half - ny * depth],
  ];
  let d = polyPath(quad);
  if (rung && rung.gate === 'twin-drum' && !g.water) {
    // hf313's twin drums, one at each end of the passage
    const r = band.stone * 0.9;
    for (const s of [1, -1]) {
      const cx = p[0] + tx * half * s; const cy = p[1] + ty * half * s;
      d += `M${q(cx - r)} ${q(cy)}a${q(r)} ${q(r)} 0 1 0 ${q(r * 2)} 0a${q(r)} ${q(r)} 0 1 0 ${q(-r * 2)} 0Z`;
    }
  }
  if (g.water) {
    // ⭐ hf313's WATER GATE: a NARROWER work with NO flanking drums, and the chain boom drawn
    //   link by link across the passage. The narrowing is the plate's own anatomy.
    const b0 = [p[0] + tx * half * 0.7, p[1] + ty * half * 0.7];
    const b1 = [p[0] - tx * half * 0.7, p[1] - ty * half * 0.7];
    const links = 5;
    for (let i = 0; i < links; i++) {
      // ⚠ NAMED `link`, NOT `q` — the module's page-quantum function is `q`, and a local of that
      //   name SHADOWS it: `q(q[0] - r)` would call an array. The same shadowing class
      //   `rampartWorks.js:415` records (*"the loop counter was `a` and it shadowed the argument
      //   object"*), caught here by a test rather than by a census that failed to move.
      const link = lerp(b0, b1, (i + 0.5) / links);
      const r = rw * 0.10;
      d += `M${q(link[0] - r)} ${q(link[1])}a${q(r)} ${q(r)} 0 1 0 ${q(r * 2)} 0a${q(r)} ${q(r)} 0 1 0 ${q(-r * 2)} 0Z`;
    }
  }
  return d;
}

function deckQuad(c, w, rw) {
  if (!c.at) return null;
  const [x, y] = c.at;
  const half = Math.max(w, rw) * 0.62;
  const d = rw * 0.55;
  return [[x - half, y - d], [x + half, y - d], [x + half, y + d], [x - half, y + d]];
}

/**
 * ⭐⭐⭐ **PA.3's FORD, DRAWN FROM hf264.** STIPPLE SHALLOWS across the widened reach: short
 * broken-water ticks laid in staggered rows over the crossing's own span. The stipple is what a
 * shallow reads as from above; a ring or a dot-chain is the glyph the §646 sweep struck.
 */
function fordStipple(c, w, rw) {
  const out = [];
  if (!c.at) return out;
  const [x, y] = c.at;
  const half = Math.max(w, rw) * 0.9;
  const rows = 4;
  const cols = 7;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const ox = (j % 2) * (half / cols);
      const px = x - half + ox + (i * 2 * half) / cols;
      const py = y - rw * 0.7 + (j * rw * 1.4) / rows;
      out.push(linePath([[px, py], [px + rw * 0.22, py]]));
    }
  }
  return out;
}

/** ⭐ SPLAYED FUNNEL APPROACH CHEVRONS on BOTH banks (PA.3 / hf264) — the road opening out. */
function fordChevrons(c, w, rw) {
  const out = [];
  if (!c.at) return out;
  const [x, y] = c.at;
  const half = Math.max(w, rw) * 0.9;
  for (const s of [-1, 1]) {
    for (let k = 1; k <= 3; k++) {
      const spread = rw * 0.55 * k;
      const ay = y + s * (rw * 0.9 + k * rw * 0.42);
      out.push(linePath([[x - spread, ay], [x, y + s * rw * 0.75], [x + spread, ay]]));
      void half;
    }
  }
  return out;
}

function steppingStones(c, w, rw) {
  const out = [];
  if (!c.at) return out;
  const [x, y] = c.at;
  const span = Math.max(w, rw) * 1.1;
  const n = Math.max(3, Math.round(span / (rw * 0.55)));
  for (let i = 0; i < n; i++) {
    const px = x - span + (i * 2 * span) / (n - 1);
    const s = rw * 0.16;
    out.push(polyPath([[px - s, y - s * 0.7], [px + s, y - s * 0.7],
      [px + s, y + s * 0.7], [px - s, y + s * 0.7]]));
  }
  return out;
}

/**
 * ⭐⭐⭐ **L-REG-34 · THE LEGEND, AND IT IS A ROSTER RATHER THAN A PICTURE.** The exit is
 * *"every legend row locatable, every glyph taught"* — a two-directional census, so the legend
 * has to be a DATA object the census can walk, not a block of SVG a reader has to squint at.
 * Each row names the group it teaches, the mark, and the PLATE it is drawn from, so a row that
 * teaches nothing and a group that is taught nowhere are both findable by machine.
 *
 * ⛔ THE `plate` COLUMN IS NOT DECORATION. The detail register binds per class, and a row with no
 * plate is a mark this estate invented — which is the exact failure `hf61-chrome-plate` is the
 * hard anti-exemplar for (*"ornament simulated without meaning"*).
 */
export const DRESS_LEGEND = Object.freeze([
  { group: 'dress-paper', mark: 'the sheet', teaches: 'the page ground', plate: 'hf303 master key' },
  { group: 'dress-fields', mark: 'open tone', teaches: 'field ground outside the settled pieces', plate: 'hf140 plains open-field' },
  { group: 'dress-grain', mark: 'parallel strip lines', teaches: 'the furlong\'s selion strips', plate: 'hf140' },
  { group: 'dress-water', mark: 'flat wash inside its banks', teaches: 'water body, bank-bounded', plate: 'hf377 water textures' },
  { group: 'dress-shore', mark: 'shore-parallel recession lines', teaches: 'the water\'s edge and its calm', plate: 'hf322 waterfront edge' },
  { group: 'dress-street', mark: 'the palest ground', teaches: 'the way as a GAP — there is no street object', plate: 'hf320 street hierarchy' },
  { group: 'dress-voids', mark: 'an outlined open ground', teaches: 'square / market / green', plate: 'hf259 market voids' },
  { group: 'dress-yards', mark: 'the toft tone', teaches: 'the plot\'s own ground behind the building', plate: 'hf120 burgage frontage' },
  { group: 'dress-masses', mark: 'the built footprint', teaches: 'the eaves line of a party run', plate: 'hf208 roof ticks' },
  { group: 'dress-planes', mark: 'two tints per roof', teaches: 'NW light, SE shadow — one value step', plate: 'hf208' },
  { group: 'dress-eaves', mark: 'a tick along the SE edge', teaches: 'the cast shadow at the eaves', plate: 'hf208' },
  { group: 'dress-ridges', mark: 'one line down the long axis', teaches: 'ONE ridge per party run', plate: 'hf208 / hf378' },
  { group: 'dress-hips', mark: 'angled lines to the corners', teaches: 'a hipped end', plate: 'hf208' },
  { group: 'dress-chimneys', mark: 'a small square astride the ridge', teaches: 'a lived-in house', plate: 'hf208 / hf90' },
  { group: 'dress-unitlines', mark: 'interior party lines', teaches: 'the members inside an aggregated mass', plate: 'hf378 density ladder' },
  { group: 'dress-band', mark: 'a double-edged band', teaches: 'the wall as thin FACE, not a stroke', plate: 'hf261 wall ladder' },
  { group: 'dress-coursing', mark: 'ticks across the band, in patches', teaches: 'coursed masonry', plate: 'hf261 rung 4' },
  { group: 'dress-comb', mark: 'a comb on the OUTER edge', teaches: 'merlons — and a one-sided comb is not a railway', plate: 'hf103 / hf314' },
  { group: 'dress-towers', mark: 'plan shapes straddling the band', teaches: 'a tower is a TYPE, not a repeat', plate: 'hf315 tower variety' },
  { group: 'dress-ditch', mark: 'strokes radiating outward', teaches: 'the ditch — hachure, never dashes', plate: 'hf314 wall head' },
  { group: 'dress-stairs', mark: 'short rungs on the inner face', teaches: 'wall-stair flights, and they are rare', plate: 'hf314' },
  { group: 'dress-gates', mark: 'a passage cut through the band', teaches: 'a gate is SEATED IN the wall', plate: 'hf313 gate anatomy' },
  { group: 'dress-relict', mark: 'a dashed line where a wall stood', teaches: 'a robbed circuit surviving as a boundary', plate: 'hf123 wall seam' },
  { group: 'dress-decks', mark: 'a deck with a shadow line', teaches: 'the bridge passes OVER the water', plate: 'hf263 bridge types' },
  { group: 'dress-ford', mark: 'stipple with splayed chevrons', teaches: 'a ford — shallow because it is wide', plate: 'hf264 river works' },
  { group: 'dress-stepping', mark: 'a line of small slabs', teaches: 'stepping stones — a DISTINCT crossing', plate: 'hf264' },
  { group: 'dress-quays', mark: 'a worked edge on the water', teaches: 'a quay face', plate: 'hf122 quay basin' },
  { group: 'dress-vquay', mark: 'bollards on the quay', teaches: 'the V-QUAY furniture band', plate: 'hf122 / hf133' },
  { group: 'dress-accessible', mark: 'ruled hatch by direction and pitch', teaches: 'category carried by PATTERN, not hue', plate: '§9.7 accessible' },
  { group: 'dress-register', mark: 'a single small open figure at the seat', teaches: 'an institution IS seated here, keyed to the register', plate: 'hf303-legend-masterplate' },
  /**
   * ⟦DRESS-2 W1⟧ THE §10 REGISTER. ⛔ EVERY PLATE HERE IS A REAL DETAIL-REGISTER ANCHOR, and the
   * two that carry the most weight are exact rather than approximate: **hf311's *"lepers' station
   * held far out"*** is the lazar house by name, and **hf342's *"market stalls are small
   * rectangles in rows with a dashed stall-line"*** is the famine mark drawn EMPTY — the same
   * glyph the market already owns, with nothing on it, which is §10.A2's own sentence.
   * ⚠ AND ONE HONEST LIMIT, RECORDED RATHER THAN DRESSED OVER: `barredGate` and `quarantineBar`
   * share one glyph, because they are one physical thing — a gate shut. What separates them for a
   * reader is COUNT AND NEIGHBOUR (one gate barred with a camp outside it is an investment; every
   * gate barred with a lazar house beyond is a pestilence), which is the register law itself and
   * not a gap in it. Minting a second glyph to tell them apart would be inventing a distinction
   * the world does not draw.
   */
  { group: 'dress-camp', mark: 'small filled bodies in a row beyond the wall', teaches: 'a camp the settlement\'s condition put there — besiegers at a bowshot, migrants at the busiest gate, a lazar house held far out', plate: 'hf311 gate-suburb (queue carts, beast pound, lepers\' station)' },
  { group: 'dress-barred', mark: 'three short bars across a gate passage', teaches: 'a gate SHUT — against a besieger where a camp stands outside it, against the pestilence where every gate carries one', plate: 'hf313 gate anatomy (the chain boom across the passage)' },
  { group: 'dress-emptystall', mark: 'the stall row outlined and nothing on it', teaches: 'a market place still marked out for trade with no trade in it — famine', plate: 'hf342 civic knot / hf259 market voids' },
  { group: 'dress-watchfire', mark: 'a ring with a cross in it', teaches: 'a watch-fire KEPT on an approach road — pressure from outside', plate: 'hf311 (wayside furniture drawn singly)' },
  { group: 'dress-trampled', mark: 'a short calm hatch on open ground', teaches: 'ground worn by men and beasts standing on it — a muster, a war', plate: 'hf311 trampled blob / hf345 muster-ground wear paths' },
  { group: 'dress-barricade', mark: 'a single heavy chord across a way', teaches: 'a street stopped up from inside', plate: 'hf320 street hierarchy (the way as an edged band)' },
  /** ⟦DRESS-2 W2⟧ RELIEF. §8's exemplars, each cited for the specific law it states on the plate. */
  { group: 'dress-hachure', mark: 'ticks radial to the slope, laid in RUNS', teaches: 'the fall line — length carries steepness, and a tick with no run is not a landform', plate: 'hf112 hill-hachure study (spur-and-coombe forms) / hf376' },
  { group: 'dress-formline', mark: 'a chained level line over open ground', teaches: 'the shape of the land where it is not cut', plate: 'hf376 relief conventions (contour rings)' },
  { group: 'dress-terrace', mark: 'a level line crossing the built ground, over the fabric', teaches: 'ground the settlement had to CUT to stand on — a terrace retains the houses above it', plate: 'hf116 terrace study' },
  { group: 'dress-crag', mark: 'a heavy line with lighter facets hanging from it', teaches: 'a cliff — and the HEAVY line is its TOP', plate: 'hf113 crag / cliff study' },
  { group: 'dress-marsh', mark: 'reed ticks in clusters of three', teaches: 'standing water in the ground', plate: 'hf115 marsh reed study (the law is stated on the plate)' },
  /**
   * ⟦REG-D⟧ THE DECLINE LADDER. ⛔ Every plate here is hf379 or hf323 — the two REQUIRED-DETAIL
   * anchors that carry ruin content — and each row teaches ONE rung, because a ladder taught as a
   * single row would be §692.9's defect wearing a legend's face.
   */
  { group: 'dress-ruin-standing', mark: 'a footprint outlined and empty', teaches: 'a house still standing with nobody in it — the eaves line WITHOUT the roof furniture a lived-in house carries', plate: 'hf379-spec-ruin-stages rung 2 (empty-but-sound)' },
  { group: 'dress-ruin-unroofed', mark: 'a footprint outlined and hatched', teaches: 'a shell open to the sky — the corpus hatches an unroofed ruin and leaves a roofed one white', plate: 'hf379-spec-ruin-stages rung 3 / hf323 church ladder ("unroofed ruin = hatched")' },
  { group: 'dress-ruin-footings', mark: 'a dashed ghost of a footprint', teaches: 'walls down to their footings — the plot legible only as a rectangle in the grass', plate: 'hf379-spec-ruin-stages rungs 5–6 (footings / platform, the "dashed ghost")' },
  { group: 'dress-ruin-clearing', mark: 'a hatched shell whose hatch stops part way', teaches: 'a ruin being taken back — the cleared share is the ledger\'s own pressure against the price of clearing', plate: 'hf379-spec-ruin-stages (the ladder read backwards)' },
  { group: 'dress-soilmark', mark: 'a dotted trace on worked ground', teaches: 'a plot that was cleared and returned to the fields — the soil-mark is all that is left of it', plate: 'hf379-spec-ruin-stages rungs 7–8 (under-the-plough / lost-but-for-the-ground)' },
]);

/**
 * ⭐⭐⭐ ⟦REG-D⟧ **THE REACHED-STATE TOTALITY CENSUS — *every LossRegion state has its dress; no
 * dress without a state*.**
 *
 * ⛔⛔ **IT IS DEFINED OVER `publishLosses`, NEVER OVER A FACE-WALK, AND PA.8 SAYS SO BY NAME.** A
 * RECLAIMED region has no `LOSSREGION` face left — `recoverByPressure` returns the ground to
 * `FIELD` — so a walk of the arrangement finds 89 of the corpus's regions and misses none of them
 * by accident: it misses them BY CONSTRUCTION, and the census would come back green over a
 * population that had silently lost its most interesting member.
 *
 * THE FOUR ROWS, and each one can fail on its own:
 *   R1 `schemaAgreed`  `RUIN_DRESS`'s keys are exactly the states the record's own schema carries.
 *                      This is the drift arm: a seventh state minted upstream reds here rather
 *                      than drawing nothing and passing.
 *   R2 `undressed`     states this leaf REACHED whose family emitted no group. The totality half.
 *   R3 `unearned`      groups this leaf DREW whose states it never reached. The honesty half —
 *                      "no dress without a state", i.e. zero invented decay, mechanically.
 *   R4 `homeless`      RECLAIMED regions whose field face is not on the page, so the mark could
 *                      not be seated. Counted rather than swallowed: it is the join failing.
 *
 * ⚠ **A LEAF WITH NO LOSSES PASSES ALL FOUR AND MEANS NOTHING BY IT** — which is why `reached` and
 * `regions` are published beside the verdict. A green over an empty population is the vacuity
 * §714.6 spent a whole wave on; the caller is handed the denominator so it cannot be quoted
 * without one.
 *
 * @param {any} dress a `PARTITION_PAGE_DRESS`
 * @param {any} losses a `publishLosses` record
 */
export function declineCensus(dress, losses) {
  const states = (losses && losses.schema && losses.schema.states) ? [...losses.schema.states] : [];
  const keys = Object.keys(RUIN_DRESS);
  const schemaAgreed = states.length === keys.length && states.every((s) => keys.includes(s));
  const byState = (losses && losses.byState) || {};
  const reached = states.filter((s) => (byState[s] || 0) > 0);
  const drawn = new Set((dress && dress.groups) || []);
  const wanted = new Set(reached.map((s) => RUIN_DRESS[s] && RUIN_DRESS[s].group).filter(Boolean));
  const undressed = reached.filter((s) => {
    const row = RUIN_DRESS[s];
    return !row || !drawn.has(row.group);
  });
  // ⚠ RECLAIMED is exempt from R2 only when its face is off the page — the join failing is R4's
  //   finding, not R2's, and conflating them would let a missing family hide behind a missing face.
  const c = (dress && dress.census) || {};
  const homeless = c.soilMarksHomeless || 0;
  const undressedReal = undressed.filter((s) => !(s === 'RECLAIMED' && homeless >= (byState.RECLAIMED || 0)));
  const unearned = [...drawn].filter((gp) => DECLINE_GROUPS.includes(gp) && !wanted.has(gp));
  const ok = schemaAgreed && undressedReal.length === 0 && unearned.length === 0
    && (c.ruinUndressed || 0) === 0;
  return {
    ok,
    schemaAgreed,
    states,
    reached,
    regions: (losses && losses.regions) ? losses.regions.length : 0,
    byState,
    undressed: undressedReal,
    unearned,
    homeless,
    facesInAStateWithNoDress: c.ruinUndressed || 0,
    reason: `${(losses && losses.regions) ? losses.regions.length : 0} region(s) in`
      + ` ${reached.length} of ${states.length} schema state(s);`
      + ` ${undressedReal.length} reached state(s) with no dress,`
      + ` ${unearned.length} dress family(ies) with no state,`
      + ` ${homeless} RECLAIMED region(s) with no field face on the page,`
      + ` schema agreement ${schemaAgreed ? 'OK' : 'DRIFTED'}`,
  };
}

/**
 * ⭐⭐⭐ ⟦REG-D · L-REG-36⟧ **RUINS NEED ADDRESSES — A PLACEMENT ASSERTION, NOT AN EXISTENCE ONE.**
 *
 * §710.6's class, applied before it can bite again: *every census W1 wrote asked whether the mark
 * exists; not one asked whether it is on the thing it means.* A ruin is a former tenement, and a
 * tenement fronts a way — so the question is not "is a ruin drawn" but "does it stand where a
 * house could have stood".
 *
 * ⭐ **ADJACENCY IS EXACT OFF THE PAGE, AND THAT WAS MEASURED BEFORE IT WAS TRUSTED.** The rings
 * come from one planar subdivision, so two faces are neighbours iff they share an EDGE — the same
 * two vertices, in reverse order — with no tolerance and no snapping. Checked against the
 * arrangement's own half-edge answer on four leaves: `highwater` 446 = 446, `village` 0 = 0,
 * `mountain` 0 = 0, `town` 0 = 0. The page can answer this by itself.
 *
 * ⛔⛔ **AND THE PRECONDITION IS STATED RATHER THAN ASSUMED, BECAUSE IT BIT THIS FUNCTION'S OWN
 * TEST FIXTURE.** Exactness needs a page whose rings really are one subdivision: `projectPage`
 * filters every ring through ONE keep-set, so a dropped vertex is dropped on BOTH sides of the
 * edge and the pair still matches. A hand-built page where one long street edge faces four short
 * frontages is NOT that, and this census correctly returns "unaddressed" for all of them — which
 * reads as a defect in the ink when it is a defect in the page. Any caller handing this function
 * a synthetic page owes it a subdivision.
 *
 * ⛔⛔ **AND IT SHIPS WITH ITS OWN DENOMINATOR, BECAUSE WITHOUT ONE THE ROW IS UNREADABLE.** "0 of
 * 3 ruins front a way" is a defect on a leaf whose houses front ways and a fact of the road
 * topology on a leaf where nothing does. The MASSES are the control: they are the built fabric of
 * the same subdivision asked the same question by the same code. Measured at base: `highwater`
 * ruins 95.5 % against masses 98.9 %; `village` 0 % of 1 against 87.9 %; `mountain` 0 % of 3
 * against 89.3 %. A verdict is only offered where the control itself is healthy.
 *
 * @param {any} page a `PARTITION_PAGE_FRAME`
 * @param {number} [floor] the share of ruins that must be addressed, as a fraction of the CONTROL
 */
export function ruinAddressCensus(page, floor = 0.9) {
  const key = (p) => `${p[0].toFixed(6)},${p[1].toFixed(6)}`;
  const edgesOf = (ring) => {
    const out = [];
    for (let i = 0; i < ring.length; i++) {
      const a = key(ring[i]); const b = key(ring[(i + 1) % ring.length]);
      out.push(a < b ? `${a}|${b}` : `${b}|${a}`);
    }
    return out;
  };
  const wayEdges = new Set();
  for (const w of (page.ways || [])) if (w.ring && w.ring.length >= 3) for (const e of edgesOf(w.ring)) wayEdges.add(e);
  const addressed = (ring) => !!ring && ring.length >= 3 && edgesOf(ring).some((e) => wayEdges.has(e));
  const ruins = (page.loss || []).filter((L) => L.ring && L.ring.length >= 3);
  const ruinAddr = ruins.filter((L) => addressed(L.ring)).length;
  const masses = (page.masses || []).filter((m) => m.ring && m.ring.length >= 3);
  const massAddr = masses.filter((m) => addressed(m.ring)).length;
  const ruinRate = ruins.length ? ruinAddr / ruins.length : null;
  const controlRate = masses.length ? massAddr / masses.length : null;
  // ⚠ NO SUBJECT AND NO CONTROL BOTH RETURN `null`, NEVER `true`. A census that passes when it has
  //   nothing to measure is the vacuity this programme keeps convicting; the caller must see it.
  const verdict = (ruins.length === 0 || controlRate === null) ? null
    : (ruinRate >= controlRate * floor);
  return {
    verdict,
    ruins: ruins.length,
    ruinAddressed: ruinAddr,
    ruinRate,
    masses: masses.length,
    massAddressed: massAddr,
    controlRate,
    floor,
    unaddressed: ruins.filter((L) => !addressed(L.ring)).map((L) => L.face),
    reason: ruins.length === 0
      ? 'no LossRegion face on this page — NO SUBJECT, not a pass'
      : `${ruinAddr}/${ruins.length} ruin(s) front a way`
        + ` (${(ruinRate * 100).toFixed(1)} %) against the built fabric's own`
        + ` ${massAddr}/${masses.length} (${controlRate === null ? 'n/a' : (controlRate * 100).toFixed(1)} %)`
        + ` at a floor of ${(floor * 100).toFixed(0)} % of the control`,
  };
}

/**
 * ⭐⭐ **L-REG-34's CENSUS, BOTH DIRECTIONS.** *Every legend row locatable* (the group it teaches
 * is actually drawn) and *every glyph taught* (every drawn group has a row). A one-directional
 * spelling passes a legend that teaches marks the page does not carry — which is `hf61`'s failure
 * exactly, and the reason the census is written as a bijection rather than as a lookup.
 */
export function legendCensus(dress) {
  const drawn = new Set(dress.groups);
  const taught = new Set(DRESS_LEGEND.map((r) => r.group));
  const untaught = [...drawn].filter((gp) => !taught.has(gp));
  // a legend row for a group this LEAF does not draw is lawful (an unwalled leaf has no band);
  // a row for a group the DRESS CANNOT EVER draw is not.
  const unlocatable = [...taught].filter((gp) => !DRESS_GROUPS.includes(gp));
  const plateless = DRESS_LEGEND.filter((r) => !r.plate || r.plate.length < 4).map((r) => r.group);
  return {
    drawn: drawn.size,
    taught: taught.size,
    untaught,
    unlocatable,
    plateless,
    ok: untaught.length === 0 && unlocatable.length === 0 && plateless.length === 0,
    reason: `${drawn.size} group(s) drawn, ${taught.size} taught;`
      + ` ${untaught.length} drawn-but-untaught, ${unlocatable.length} taught-but-undrawable,`
      + ` ${plateless.length} row(s) with no corpus plate`,
  };
}

/**
 * ⭐⭐ **E11 · THE ACCESSIBLE-LENS ARM — structurally homeless until ink existed, and this is the
 * ink.** §9.7: *"patterns replace hue"* means REAL HATCH GEOMETRY, and `folioLenses.HATCH` already
 * holds the closed table (angle index into the 64-step trig table, pitch in frontages). This
 * function is the consumer that table never had: given a page and a character per mass, it emits
 * the category hatch, clipped by the same exact primitive everything else in this file uses — so
 * the accessible lens cannot leak a pattern outside the face that owns it either.
 */
export function accessibleHatch(page, opts = {}) {
  const rw = opts.roadWidth || 5;
  const charOf = opts.characterOf || (() => 'residential');
  const out = [];
  let segs = 0;
  const byClass = {};
  for (const m of page.masses) {
    const ch = charOf(m) || 'other';
    const row = HATCH[ch] || HATCH.other;
    if (!row.pitch) { byClass[ch] = byClass[ch] || 0; continue; }
    const ang = (row.ang / 64) * 360;
    for (const rr of (m.runRings || [])) {
      if (!rr || rr.length < 3) continue;
      for (const seg of hatchPolygon(rr, ang, rw * row.pitch)) { out.push(linePath(seg)); segs++; }
    }
    byClass[ch] = (byClass[ch] || 0) + 1;
  }
  return Object.freeze({
    svg: out.length ? `<g id="dress-accessible"><path d="${out.join('')}" fill="none"`
      + ` stroke="#000000" stroke-width="0.4"/></g>` : '',
    segments: segs,
    byClass: Object.freeze(byClass),
    vocabulary: Object.freeze(Object.keys(HATCH)),
    reason: `${segs} hatch segment(s) over ${page.masses.length} mass(es);`
      + ` ${Object.keys(byClass).length} character class(es) drawn of ${Object.keys(HATCH).length}`
      + ` in the closed vocabulary — an unhatched class (pitch 0) is the MATRIX, not an omission`,
  });
}
