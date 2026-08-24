/**
 * domain/townMap/fabric/rampartWorks.js — ⭐⭐⭐ **THE RAMPART GRAMMAR (ODQ §590/§598) AND THE
 * §575 BAND REGIME.** REG-2's derivation half; the ink half lives in the lens.
 *
 * ⭐ WHAT THIS MODULE IS FOR, IN ONE SENTENCE: the circuit already knows everything a rampart
 * needs — its runs, their causes, their stone thickness, its gates, its towers and their KINDS —
 * and what it has never published is **the band those facts describe and the JOINTS that hold
 * it together**. This file publishes those two things and nothing else.
 *
 * ⭐⭐ IT EXTENDS, IT DOES NOT RE-DERIVE (charter §4). Three facts were checked before a line was
 * written, and each removed a mechanism this file would otherwise have minted:
 *   1. THE BAND'S THICKNESS ALREADY EXISTS. `wallRuns.runBand(...).stone` is the number §200's
 *      reservation was computed from, so a band drawn at it is inside the reservation BY
 *      CONSTRUCTION and the ink can never disagree with the claim (walls.js's own law).
 *   2. THE TIER LADDER ALREADY EXISTS. hf261's five rungs are hurdle · palisade-on-bank ·
 *      bank-and-ditch-revetted · narrow curtain · full curtain, and `WALL_FORMS` +
 *      `wallRuns.towerKind` ALREADY produce exactly that ladder's tower biases — square for a
 *      palisade or bank, open-backed-D for a sparse stone run, ringed drum for a clustered one.
 *      **The ladder was in the fabric with no dress on it.** This file gives it the dress.
 *   3. THE TOWER STATIONS ALREADY EXIST, seeded-irregular per run (`wallRuns.towersFor`), and
 *      their density is a tuning-signature surface (§9). So the joint field CONSUMES them as a
 *      candidate class rather than replacing them: it moves nothing about HOW MANY towers a
 *      wall has, and adds only the STRUCTURAL joints the charter names.
 *
 * ⭐⭐⭐ **THE COMB AND THE BAND FILL COME FROM DIFFERENT PLATES, AND THE ONE THAT GOVERNS IS THE
 * ONE DRAWN AT OUR REGISTER.** This was got wrong once and the correction is worth the paragraph.
 *
 * hf261 — the REQUIRED-DETAIL ANCHOR — draws its five rungs at FORTY-YARD zoom: at that scale its
 * full curtain shows a rubble-filled band and NO comb, because individual merlons would be legible
 * and the plate chose to show the fill instead. Reading that as "masonry carries no comb" and
 * cutting the comb was the first spelling here, and **hf103-metropolis-rings refutes it**: a whole
 * metropolis on one plate — OUR register exactly — draws `MURUS SECUNDUS` as a band with a FINE
 * COMB of crenel ticks along its outer face, running the entire circuit, at a pitch of roughly a
 * third of a percent of the plate width. The comb is what makes a band read as a WALL at a glance.
 *
 * ⭐ THE CLASS: **A REFERENCE'S ZOOM IS PART OF WHAT IT SAYS.** hf261 governs the RUNG LADDER
 * (which works a wall of each kind carries); hf103 governs the GRAIN at whole-town scale. Where
 * they appear to disagree they are answering different questions. So: the comb rides EVERY rung
 * (pales on the palisade, crenels on the masonry) at hf103's own fine pitch, and the band's
 * interior stays plain except where the rung's own plate shows a texture.
 *
 * PURITY: pure functions of the circuit. No Date, no Math.random, no runtime trig, no draws.
 */

import { fabricRng } from './fabricRng.js';
import { TOWER_TYPES, quantile } from './wallRuns.js';
import { onImpassable } from './cliffs.js';
import { isInWater } from './waterMode.js';

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * §575 · THE BAND REGIME
 * ════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐⭐⭐ L-REG-5 · **CLEAR-SPACE OR TANGENTIAL, DERIVED — NEVER A DIAL.**
 *
 * A wall band is either kept CLEAR (a militarily active town holds open ground on both faces:
 * the intervallum for the garrison inside, the glacis for the field of fire outside) or it is
 * TANGENTIAL (a long-peaceful, prosperous town lets its fabric run along the stones and lean on
 * them). The charter forbids a dial, so the regime is a comparison of two READS assembled from
 * facts the dossier and the fabric already carry.
 *
 * ⭐ THE TWO READS ARE COMPARED, NOT SUMMED, AND THE TIE GOES TO `clear`. A wall is built for
 * war; the tangential regime has to be EARNED by peace. Summing them into one score with signed
 * terms would be a dial wearing a derivation's clothes — the exact shape §575 rules out.
 *
 * ⚠ NO INPUT IS INVENTED. Every term below names the field it reads and the law that already
 * reads it; where a fact is absent the term is ZERO, which UNDERSTATES the peace read rather
 * than fabricating a date (walls.js's own `vintage unknown … UNDERSTATED rather than invented`).
 */
export const BAND_REGIMES = Object.freeze(['clear', 'tangent']);

/**
 * The stressors that mean a war is on THIS settlement, not merely that the world is hard.
 * ⚠ `mass_migration` is NOT here and the omission is deliberate: a migration crowds a gate, it
 * does not garrison a wall — §10.A11's own reading — and putting it here would convict a
 * prosperous refuge of being a fortress.
 */
export const WAR_STRESSORS = Object.freeze([
  'under_siege', 'monster_pressure', 'border_raids', 'banditry', 'civil_unrest', 'war',
]);

/** The readiness vocabulary that means a frontier posture (walls.js `threatRead`'s own set). */
const FRONTIER_READINESS = /fortified|contested|hostile|exposed|frontier|besieged/;

/**
 * ⚠ §42/§43 VALUE, ARGUED, UNSOAKED — it rides the tuning signature (§9: "any constant that
 * shapes worlds"). A LONG PEACE is four generations: long enough that nobody now alive
 * remembers the wall being manned in anger, which is what lets a town build against it.
 */
export const LONG_PEACE_YEARS = 120;

/**
 * @param {Object} a
 * @param {any} a.settlement
 * @param {boolean} a.glacisClear   §5.0e.3's own wall-foot order read
 * @param {number} a.prosperityRank the fabric's own 0..5 rank
 * @param {number} a.formWeight     `WALL_FORMS[form].weight` — the masonry investment
 * @param {number|null} a.wallStoodYears  present age − age at build, or null where unknown
 * @returns {{regime:string, military:number, peace:number, inputs:Record<string,number>, reason:string}}
 */
export function bandRegime(a) {
  const dp = (a.settlement && a.settlement.defenseProfile) || {};
  const readiness = String(dp.defensiveTerrain || dp.readiness || '').toLowerCase();
  const stressors = Array.isArray(a.settlement && a.settlement.stressors) ? a.settlement.stressors : [];
  const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

  const atWar = stressors.some((s) => WAR_STRESSORS.includes(String(s))) ? 1 : 0;
  const frontier = FRONTIER_READINESS.test(readiness) ? 1 : 0;
  // The masonry precedence in `wallForm` is itself an investment reading (threatRead says so).
  const masonry = clamp01((Number(a.formWeight) - 2) / 3);
  const order = a.glacisClear ? 1 : 0;
  const prosperity = clamp01(Number(a.prosperityRank) / 5);
  // ⚠ ZERO WHERE THE DATE IS UNKNOWN. A wall with no recorded vintage makes NO peace claim.
  const stood = Number.isFinite(a.wallStoodYears) && a.wallStoodYears > 0
    ? clamp01(a.wallStoodYears / LONG_PEACE_YEARS) : 0;
  // ⛔⛔ **AND THE LONG-PEACE TERM IS EXTINGUISHED BY A PRESENT WAR — A MEASUREMENT FORCED THIS,
  // AND IT IS A CORRECTION OF MEANING RATHER THAN OF WEIGHTS.** My first spelling let the two
  // reads compete term for term, and MEASURED over the corpus **the besieged town derived
  // TANGENT** (military 0.55 against peace 0.58): every corpus wall is older than
  // LONG_PEACE_YEARS, so the peace read floors at 0.40 before prosperity is counted, and no
  // amount of siege could out-argue the calendar.
  // ⭐ THE CAUSE IS WHAT THE TERM MEANS. `stood` is "years since the wall was built" standing in
  // as a proxy for **years since it was last needed** — and that proxy is VOID the moment the
  // dossier says it is needed now. A besieged town's wall is not an old wall nobody mans; it is
  // a wall being manned. So the term is GATED rather than reweighted: a present war, or a
  // frontier posture, sets the peace this settlement has had to zero.
  // ⭐ THE CLASS, and it is this estate's own: **A PROXY IS ONLY VALID WHERE THE THING IT STANDS
  // IN FOR IS UNOBSERVED** — where the fact itself is on the record, the proxy must yield to it.
  const peaceable = 1 - Math.max(atWar, frontier);
  const peaceYears = stood * peaceable;

  const military = atWar * 0.45 + frontier * 0.25 + masonry * 0.20 + order * 0.10;
  const peace = peaceYears * 0.40 + prosperity * 0.30 + (1 - order) * 0.30;
  const regime = peace > military ? 'tangent' : 'clear';

  return {
    regime,
    military: Math.round(military * 1000) / 1000,
    peace: Math.round(peace * 1000) / 1000,
    inputs: { atWar, frontier, masonry: Math.round(masonry * 1000) / 1000, order, prosperity: Math.round(prosperity * 1000) / 1000, stood: Math.round(stood * 1000) / 1000, peaceable, peaceYears: Math.round(peaceYears * 1000) / 1000 },
    reason: `§575 BAND REGIME = ${regime.toUpperCase()} — military ${military.toFixed(2)}`
      + ` (war ${atWar}, frontier readiness ${frontier}${readiness ? ` '${readiness}'` : ''}, masonry ${masonry.toFixed(2)}, glacis order ${order})`
      + ` vs peace ${peace.toFixed(2)} (wall stood ${a.wallStoodYears == null ? 'UNKNOWN — no peace claimed' : `${Math.round(a.wallStoodYears)}y`}`
      + ` of ${LONG_PEACE_YEARS}${peaceable ? '' : ' — EXTINGUISHED: this settlement is at war or on a frontier, so the years-since-built proxy is void'}`
      + `, prosperity ${prosperity.toFixed(2)}, wall-foot lean-tos ${1 - order})`
      + `; ties go to CLEAR — a wall is built for war and the tangential regime is earned by peace`,
  };
}

/**
 * ⭐⭐ **THE REGIME'S ONE EFFECT ON GROUND, AND IT ONLY EVER FREES.** `wallRuns.runBand`'s own
 * law: *"THE EXEMPTION ONLY EVER FREES GROUND. A run that carries no lane reserves LESS than the
 * whole-ring band did, never more, so nothing this function does can put a body inside a
 * reservation that already stood."* The regime obeys that law in one direction only:
 *
 *   CLEAR    — the per-cause policy stands untouched. The clear band IS the baseline, because
 *              the run policy table was written from military causes in the first place.
 *   TANGENT  — a run whose lane exists by ACCRETION rather than by DECISION gives it up: the
 *              fabric runs along the stones there. The runs that keep their lane are the ones a
 *              town DECIDED about (crest, notch, new-cutting) — a deliberate military work keeps
 *              its intervallum however long the peace, because that is what it was cut for.
 *
 * ⚠⚠ AND A RUN CARRYING A GATE KEEPS ITS LANE WHATEVER THE REGIME. §202's access law reads the
 * wall-side lane as part of the street web (`circuitWallLanes` feeds it), so dropping the lane
 * under a gate could strand the gate's own road — the §202 flood's exact shape, arriving through
 * a new door. The exemption is refused there and the refusal is counted.
 */
export const TANGENT_KEEPS_LANE = Object.freeze(['crest', 'notch', 'new-cutting']);

/**
 * @param {{type:string, lane:boolean}} run
 * @param {string} regime
 * @param {boolean} runHasGate
 * @returns {{lane:boolean, changed:boolean, why:string|null}}
 */
export function regimeLane(run, regime, runHasGate) {
  if (regime !== 'tangent' || !run.lane) return { lane: run.lane, changed: false, why: null };
  if (runHasGate) {
    return { lane: true, changed: false, why: 'a run carrying a gate keeps its lane in every regime (§202: the lane is the gate road\'s own street)' };
  }
  if (TANGENT_KEEPS_LANE.includes(run.type)) {
    return { lane: true, changed: false, why: `'${run.type}' was a decision, not an accretion — a deliberate work keeps the intervallum it was cut for` };
  }
  return { lane: false, changed: true, why: `§575 TANGENT — '${run.type}' gives up its lane; the fabric runs along the stones here` };
}

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * §614.2 · RAMPART WEAR
 * ════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐⭐⭐ **THE WEAR GRADE — DERIVED, BECAUSE THE FACTS TURNED OUT TO EXIST.**
 *
 * The house law is measure-before-minting: check what maintenance facts the base carries, derive
 * from THOSE, and never invent an upkeep field. The check was made, and three real facts answer it:
 *
 *   1. **THE BURDEN** — `tierScale.highWater.deficit`. §161f/§161g's own reading: a demoted
 *      settlement keeps the circuit its PEAK built, and the deficit is exactly how much more wall
 *      it has than souls to keep it. `cutGates` already spends this fact ("a high-water circuit
 *      with a shrunken population cannot man every gate it once did") — wear is the same fact
 *      applied to the stones between the gates. ⭐ This is the §611 synergy asked for, and it is
 *      structural rather than tuned: a declined city's oversized circuit lands in the worst grade
 *      BECAUSE its peak-vs-present ratio is what the term reads.
 *   2. **THE MEANS** — the prosperity rank, the same 0..5 `faubourgSeriousness` reads.
 *   3. **THE ATTENTION** — the §575 military read, already derived above. A manned wall is a
 *      maintained wall; that is not a metaphor, it is what a garrison's masons were for.
 *
 * …and the EXPOSURE is the wall's own standing years, which `bandRegime` already reads.
 *
 * ⭐ THE SHAPE IS **EXPOSURE × (1 − UPKEEP)**, NOT A SUM. A new wall cannot be crumbling however
 * poor its town, and a well-kept ancient wall is not a ruin — those are multiplicative facts, and
 * a sum would let poverty alone convict a wall built last year.
 * ⚠ WHERE THE VINTAGE IS UNKNOWN THE EXPOSURE IS 0 and the grade is `kept`: understated rather
 * than invented, the same rule `bandRegime` applies to the same missing date.
 */
export const WEAR_GRADES = Object.freeze(['kept', 'weathered', 'crumbling']);
/** ⚠ §42/§43 VALUES, ARGUED, UNSOAKED — they ride the tuning signature (§9). Two long peaces is
 *  the span over which an unmaintained curtain goes from sound to visibly failing. */
export const WEAR_FULL_YEARS = 240;
export const WEAR_CUTS = Object.freeze({ weathered: 0.28, crumbling: 0.55 });

/**
 * @param {Object} a
 * @param {number|null} a.wallStoodYears
 * @param {number} a.prosperityRank
 * @param {number} a.military      the §575 military read, 0..1
 * @param {number} a.deficit       `tierScale.highWater.deficit`, 0 when the town never declined
 * @returns {{grade:string, wear:number, exposure:number, upkeep:number, inputs:object, reason:string}}
 */
export function wearGrade(a) {
  const c = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const exposure = Number.isFinite(a.wallStoodYears) && a.wallStoodYears > 0
    ? c(a.wallStoodYears / WEAR_FULL_YEARS) : 0;
  const prosperity = c(Number(a.prosperityRank) / 5);
  const deficit = c(Number(a.deficit) || 0);
  const upkeep = c(prosperity * 0.45 + c(Number(a.military)) * 0.35 + (1 - deficit) * 0.20);
  const wear = exposure * (1 - upkeep);
  const grade = wear >= WEAR_CUTS.crumbling ? 'crumbling'
    : wear >= WEAR_CUTS.weathered ? 'weathered' : 'kept';
  return {
    grade,
    wear: Math.round(wear * 1000) / 1000,
    exposure: Math.round(exposure * 1000) / 1000,
    upkeep: Math.round(upkeep * 1000) / 1000,
    inputs: { prosperity: Math.round(prosperity * 1000) / 1000, military: Math.round(c(Number(a.military)) * 1000) / 1000, deficit: Math.round(deficit * 1000) / 1000 },
    reason: `§614.2 WEAR = ${grade.toUpperCase()} (${wear.toFixed(2)}) — exposure ${exposure.toFixed(2)}`
      + ` (${a.wallStoodYears == null ? 'vintage UNKNOWN, no exposure claimed' : `${Math.round(a.wallStoodYears)}y of ${WEAR_FULL_YEARS}`})`
      + ` × (1 − upkeep ${upkeep.toFixed(2)}: purse ${prosperity.toFixed(2)}, garrison attention ${c(Number(a.military)).toFixed(2)},`
      + ` high-water burden ${deficit.toFixed(2)})`,
  };
}

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * hf261 · THE RUNG LADDER
 * ════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐⭐⭐ **hf261's WALL LADDER, KEYED ON THE FORM THE FABRIC ALREADY DERIVED.** The plate's five
 * rungs are hurdle-and-thorn · palisade-on-bank · bank-and-ditch-revetted · the narrow curtain ·
 * the full curtain, and `wallForm`'s four forms land on the top four of them. The hurdle rung has
 * no producer (a settlement that thorn-hedges itself does not read as WALLED in the model) and is
 * recorded here as DARK rather than left as a silence — §270.1's rule, the shape
 * `wallRuns.RULED_DARK` established.
 *
 * Each row is a DRESS decision and cites the plate feature it draws:
 *  `walk`      the band carries a toned surface between its edges (rungs 4–5; the bank rungs are
 *              one tone with no walk to draw)
 *  `core`      the band carries an interior texture line — hf261's rubble fill at rung 5
 *  `pales`     the outer edge carries the pale comb — hf261's palisade rung, and ONLY it
 *  `courses`   the band carries course ticks ACROSS it — hf261's narrow curtain draws them in
 *              PATCHES, never as a continuous ladder (which is also what makes them affordable)
 *  `chamber`   a tower is drawn with its own interior void (the ringed drum, the open gorge)
 *  `gate`      the gate anatomy from hf313's PLAN vignettes
 */
export const RAMPART_RUNGS = Object.freeze({
  palisade: {
    rung: 2, plate: 'hf261 PALISADE ON BANK', walk: false, core: false,
    comb: 'pales', texture: 'none', stairs: false, wedge: false,
    chamber: false, gate: 'posts', gatePit: false, gateStair: false, towerScale: 1.00,
  },
  bank: {
    rung: 3, plate: 'hf261 BANK & DITCH REVETTED', walk: true, core: false,
    comb: 'crenel', texture: 'revet', stairs: false, wedge: false,
    chamber: false, gate: 'posts', gatePit: true, gateStair: false, towerScale: 1.05,
  },
  stone: {
    rung: 4, plate: 'hf261 THE NARROW CURTAIN', walk: true, core: false,
    comb: 'crenel', texture: 'course', stairs: true, wedge: false,
    chamber: true, gate: 'block', gatePit: true, gateStair: true, towerScale: 1.10,
  },
  citywall: {
    // ⚠ `core: false` — hf103's own MURUS SECUNDUS carries a PLAIN band interior with the comb on
    //   its outer face; hf261's rubble fill is that band seen at forty-yard zoom. The same
    //   register rule that RESTORED the comb REMOVES the fill: our plate is hf103's.
    rung: 5, plate: 'hf261 THE FULL CURTAIN + hf103 MURUS SECUNDUS', walk: true, core: false,
    comb: 'crenel', texture: 'none', stairs: true, wedge: true,
    chamber: true, gate: 'twin-drum', gatePit: true, gateStair: false, towerScale: 1.20,
  },
});

/**
 * ⭐⭐ **THE COMB'S PITCH, MEASURED OFF hf103 RATHER THAN CHOSEN.** On that plate the crenel ticks
 * run at roughly 0.33 % of the plate width. Our page is 1,000 units, so the pitch is ~3.3 units at
 * city scale — which is 0.53 of that leaf's own drawn frontage (6.24). Expressing it in FRONTAGES
 * rather than in units is what makes it survive the tier ladder: a thorp's module is six times a
 * metropolis's, and a comb pitched in absolute units would be a fringe of hair on one and a row of
 * fence posts on the other.
 * ⚠ §42/§43 VALUE, MEASURED-OFF-PLATE, UNSOAKED — it rides the tuning signature.
 */
export const COMB_PITCH_FRONTAGES = 0.55;
/** The band texture's pitch, in frontages. hf261 rung 4 draws coursing in PATCHES, not as a
 *  continuous ladder — the patch share is the third figure. */
export const TEXTURE_PITCH_FRONTAGES = 1.15;
export const TEXTURE_PATCH_SHARE = 0.62;
/** hf261 rung 4 / hf314: the wall-stair flights on the INNER face, and they are rare — a stair
 *  every ~9 frontages, not a ladder. */
export const STAIR_PITCH_FRONTAGES = 9;

/** ⭐ THE RULED-DARK RUNG, recorded rather than silent (§270.1). */
export const RUNG_DARK = Object.freeze({
  'hurdle-and-thorn': 'hf261 rung 1 has no producer: `wallForm` mints no hedge form, because a'
    + ' settlement that thorn-hedges its edge does not read as WALLED in the landed model'
    + ' (`meta.hasWalls`). Minting one would be inventing a defence the dossier never states.',
});

export function rampartRung(form) {
  return RAMPART_RUNGS[form] || RAMPART_RUNGS.palisade;
}

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * THE JOINT FIELD
 * ════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐⭐ **A TOWER IS A JOINT.** The charter's phrase is "towers-as-joints", and it is a claim about
 * WHERE, not about how many: the works on a circuit stand where the masonry has to be held
 * together — at the gates, at the corners, and where the wall ends. A tower planted by spacing
 * alone and a corner left bare is the tell that a wall was drawn rather than built.
 *
 * ⭐ THE PRIORITY ORDER, and each class is a fact rather than a preference:
 *   0 GATEHOUSE — the most heavily built thing on a circuit (§161m.4). It never moves and it
 *                 occupies the field first, so no other work can pile onto it.
 *   1 TERMINUS  — where the curtain STOPS: a cliff brink (§577) or the water's edge (§161m.3).
 *                 An open end is the one thing a real segmented circuit never presented.
 *   2 ANGLE TURN— a real corner. `wallRuns.towerKind` already calls this the `angle` tower's own
 *                 cause ("the one that stands where two runs meet at a REAL corner").
 *   3 STATION   — the seeded-irregular tower the run chain already placed. It is LAST because it
 *                 is the only class that is a spacing fact rather than a structural one, and a
 *                 station that collides with a corner should yield to the corner.
 *
 * ⛔⛔ **THE SPACING FIELD IS GLOBAL, AND A PER-RUN FLOOR CANNOT DO ITS JOB.** The §590 preview
 * measured the failure: three joints from three DIFFERENT runs landed inside 15 units at the
 * fjord and drew as one blob, because each run's own spacing rule could not see the others. The
 * field here holds every accepted work from every run and every ring of the circuit.
 *
 * ⚠ TWO FLOORS, WHICHEVER IS LARGER — the preview's other measured finding. A tower-scale floor
 * alone lets a wavery run with many small turns draw as a BEAD CHAIN (technically spaced,
 * visually a necklace), so a CURTAIN-scale floor stands beside it.
 */
export const JOINT_CLEAR_K = 1.55;
/** …and no two works closer than this multiple of the band's own stone thickness. */
export const JOINT_MIN_SPAN = 4.1;
/** The absolute floor under the per-ring turn quantile, in degrees. */
export const TURN_FLOOR_DEG = 12;
/** The quantile of a ring's OWN turns above which a vertex is a corner. */
export const TURN_QUANTILE = 0.75;

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

/** The turn at ring vertex i, in degrees, winding-agnostic. */
export function turnAt(ring, i) {
  const n = ring.length;
  const a = ring[(i - 1 + n) % n], b = ring[i], c = ring[(i + 1) % n];
  const a1 = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const a2 = Math.atan2(c[1] - b[1], c[0] - b[0]);
  let d = a2 - a1;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return Math.abs(d) * 180 / Math.PI;
}

/**
 * ⭐⭐⭐ DERIVE ONE CIRCUIT'S RAMPART WORKS.
 *
 * @param {Object} a
 * @param {Array<[number,number]>} a.ring        the circuit polygon
 * @param {Array<any>} a.runs                    the typed run chain
 * @param {number[]} a.runOfVertex               vertex → run index
 * @param {Array<any>} a.runBands                per-run bands (carries `stone`)
 * @param {Array<any>} a.gates                   the ring's gates
 * @param {Array<[number,number]>} a.towers      the seeded stations already placed
 * @param {string[]} a.towerTypes                their kinds
 * @param {Array<any>} a.terminalWorks           §577 cliff termini (may be empty)
 * @param {boolean} a.halfRing                   §161m.3 — the water is the fourth wall
 * @param {string} a.form
 * @param {number} a.stone                       the ring's own band stone thickness
 * @param {{seed:string|number, variant?:any}} a.seeding
 * @param {number} a.epoch
 * @returns {{rung:any, turnCut:number, joints:Array<any>, gatehouses:Array<any>, stats:any}}
 */
export function deriveRampartWorks(a) {
  const { ring, runs, runOfVertex, runBands, gates, towers, towerTypes, form, stone, seeding, epoch } = a;
  const rung = rampartRung(form);
  const rng = fabricRng(seeding.seed, `rampart.E${epoch}`, { variant: seeding.variant });

  /* ── the per-ring turn cut. A quantile with a floor: `wallRuns`' own recorded lesson is that a
   *    quantile is only a threshold where the distribution has spread, and a palisade ring's
   *    turns (p50 ≈ 6.7°) and a citywall's (p50 ≈ 26°) are different distributions entirely. */
  const turns = ring.map((_, i) => turnAt(ring, i));
  const turnCut = Math.max(TURN_FLOOR_DEG, quantile(turns, TURN_QUANTILE));

  // ⚠⚠ THE LOOP COUNTER IS `k`, NOT `a`, AND THE FIRST SPELLING WAS A SILENT NO-OP. Written with
  // `for (let a = 0 …)` the ring counter SHADOWED this function's own argument object, so
  // `a.cliffs` read a property off a number, came back `undefined`, and the whole refusal was
  // skipped — and it LOOKED like it worked, because the census figure it was meant to move simply
  // did not move. ⭐ THE CLASS: **A GUARD THAT SILENTLY EVALUATES TO FALSE IS INDISTINGUISHABLE
  // FROM A GUARD THAT PASSED**, which is why the census was re-run rather than the code re-read.
  const REFUSAL_RINGS = 8;
  const cliffs = a.cliffs || null;
  const water = a.water && a.water.line ? a.water : null;
  const siteRefused = (p, r) => {
    if (!cliffs && !water) return null;
    for (let k = 0; k < REFUSAL_RINGS; k++) {
      const ang = (k / REFUSAL_RINGS) * Math.PI * 2;
      // ⚠ THE RIM AND THE BODY BOTH, because a work can straddle a narrow spit with a clear rim.
      for (const f of [0.55, 1]) {
        const x = p[0] + Math.cos(ang) * r * f, y = p[1] + Math.sin(ang) * r * f;
        if (cliffs && onImpassable(cliffs, x, y)) return 'cliff';
        if (water && isInWater(water, x, y)) return 'water';
      }
    }
    return null;
  };
  /* ── 0 · THE GATEHOUSES. hf313's PLAN vignettes, scaled by the rung. They are placed FIRST and
   *      occupy the joint field, so a circuit tower can never pile onto a gate — which is
   *      already the rule `walls.traceWalls` applies to its own tower list, restated here for
   *      the works that outrank it. */
  /** @type {Array<{p:[number,number], rad:number}>} */ const taken = [];
  /** @type {Array<any>} */ const gatehouses = [];
  for (const g of gates) {
    // The gatehouse's own scale: a gate was the most heavily built thing on a circuit, so its
    // block is a multiple of the stones it interrupts — never an absolute size.
    let half = stone * (rung.gate === 'twin-drum' ? 3.1 : rung.gate === 'block' ? 2.6 : 1.9);
    const depth = stone * (rung.gate === 'posts' ? 1.3 : 1.7);
    // ⭐⭐ **A GATE CANNOT MOVE, SO IT SHRINKS.** A gate is where one particular road crosses one
    // particular ring (`cutGates`' own law), so the pull-back that saves an end-work is not
    // available to it — and the over-ground census caught the coastal city's twin-drum block
    // standing with three of its eight rim points in the sea. hf313's own answer is on the plate:
    // the WATER GATE is a narrower work with NO flanking drums. So a block whose footprint the
    // ground will not carry is reduced toward that anatomy, step by step, and what it could not
    // fix is reported rather than hidden.
    let shrunk = 0;
    while (shrunk < 4 && siteRefused([g.x, g.y], half)) { half *= 0.78; shrunk++; }
    const gateOverhang = siteRefused([g.x, g.y], half);
    gatehouses.push({
      key: `gatehouse.${g.key}`,
      x: g.x, y: g.y, dx: g.dx, dy: g.dy,
      anatomy: rung.gate, half, depth,
      bricked: !!g.bricked,
      // hf313's twin-drum vignette: a drum at each end of the passage, each with its chamber.
      ...(shrunk ? { shrunk } : {}),
      ...(gateOverhang ? { overhang: gateOverhang } : {}),
      // ⚠ A SHRUNKEN GATE LOSES ITS FLANKING DRUMS FIRST — hf313's water gate has none, and a
      // drum outboard of a block that already will not fit is the part standing in the water.
      drums: rung.gate === 'twin-drum' && !shrunk
        ? [1, -1].map((s) => ({ x: g.x - g.dy * half * s, y: g.y + g.dx * half * s, r: stone * 1.35 }))
        : [],
      // The portcullis: hf313 draws it as a toothed line across the passage. Only where there is
      // a gatehouse to hang it in — a pair of timber posts never carried one.
      portcullis: rung.gate !== 'posts' && !g.bricked,
      pit: rung.gatePit && !shrunk,
      stair: rung.gateStair,
      plate: 'hf313 ' + (rung.gate === 'twin-drum' ? 'twin drum towers with portcullis'
        : rung.gate === 'block' ? 'plain square tower over highway' : 'simple timber arch in earthwork palisade'),
    });
    taken.push({ p: [g.x, g.y], rad: half });
  }

  /* ── THE CANDIDATES, each with its class and its own radius. */
  /** @type {Array<any>} */ const cand = [];
  const runIsGated = new Set();
  for (const g of gates) {
    // Which run owns this gate — the nearest ring vertex, the SAME `runOfVertex` map the ink,
    // the ditch and the claim all use. Two spellings of "which run owns this" is the shape every
    // divergence in this programme has had (§230's whole family).
    let bi = 0, bd = Infinity;
    for (let i = 0; i < ring.length; i++) {
      const d = (ring[i][0] - g.x) ** 2 + (ring[i][1] - g.y) ** 2;
      if (d < bd) { bd = d; bi = i; }
    }
    runIsGated.add(runOfVertex[bi]);
  }

  // class 1 · THE TERMINI — the cliff end-works §577 already raised, plus the WATER terminations
  // §161m.3 implies and nothing had ever drawn. A `water-termination` run carries no towers by
  // policy (correctly — no tower stands on the river wall), but its ENDS are where the curtain
  // meets the bank, and that junction is a work in every real segmented circuit.
  for (const t of (a.terminalWorks || [])) {
    cand.push({ p: [t.x, t.y], t: [t.dx, t.dy], cls: 1, kind: 'angle', rad: stone * 1.45,
      why: `§577 cliff terminus (${t.via})`, key: t.key });
  }
  for (let j = 0; j < runs.length; j++) {
    const run = runs[j];
    if (run.type !== 'water-termination' || !run.line || run.line.length < 2) continue;
    for (const [pi, qi] of [[0, 1], [run.line.length - 1, run.line.length - 2]]) {
      const p = run.line[pi], q = run.line[qi];
      const L = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
      cand.push({ p, t: [(q[0] - p[0]) / L, (q[1] - p[1]) / L], cls: 1, kind: 'angle',
        rad: stone * 1.45, why: '§161m.3 water terminus — the curtain meets the bank',
        key: `waterEnd.E${epoch}.${run.key}.${pi ? 'b' : 'a'}` });
    }
  }

  /* ── ⭐⭐⭐ **§161m.3, DRAWN: WHERE THE WATER IS THE WALL, THERE IS NO WALL TO DRAW.**
   *
   * ⛔⛔ THE DEFECT, MEASURED AND THEN SEEN. Rule 3 drops the ring vertices the river defends by a
   * DISTANCE (`distToPolyline > water.width * 1.1`) and then CLOSES the polygon across the gap —
   * so on a coast, where the "line" is a traced shoreline and the body is a bay, the chord sails
   * over open water. The over-ground census convicted it at 32.9 % of one drawn curtain piece on
   * the coastal city, in the SEALED base as much as here; the rampart merely made it visible,
   * because a bold band across a harbour is a thing a reader sees at a glance and a hairline is not.
   * ⭐ THE CLASS IS THIS FILE’S NEIGHBOUR’S: **AN EXEMPTION EXPRESSED AS A TOLERANCE IS A SECOND
   * SPELLING OF THE RULE IT EXCUSES** — walls.js says exactly that of the water flank, and the
   * filter is the same rule spelled as a distance. The honest test is `isInWater`, the fabric’s own.
   *
   * ⚠⚠ AND THE CURE IS INK, NOT TRACE, DELIBERATELY. Re-aiming rule 3’s filter would move the ring
   * on every bankside and coastal leaf — and with it the band, the district partition, the
   * containment residuals and every census that reads them. walls.js refused exactly that inside a
   * micro-wave once already (*"re-aiming the search is a trace-behaviour change that would move
   * leaves this wave’s declared shift has not measured"*). So the RING is untouched, its claims
   * and its partition are untouched, and what changes is that the CURTAIN is not drawn over open
   * water — which is the same contract §577 already publishes for the scarp (`cliffChordEdges`:
   * *"the polygon EDGES that are NOT wall"*). One rule, two impassable facts, one expression.
   */
  const wetEdge = new Array(ring.length).fill(false);
  if (water) {
    const pitch = Math.max(0.75, stone * 0.75);
    for (let i = 0; i < ring.length; i++) {
      const p0 = ring[i], p1 = ring[(i + 1) % ring.length];
      const L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
      const steps = Math.max(2, Math.ceil(L / pitch));
      let wet = 0;
      for (let k = 0; k <= steps; k++) {
        const f = k / steps;
        if (isInWater(water, p0[0] + (p1[0] - p0[0]) * f, p0[1] + (p1[1] - p0[1]) * f)) wet++;
      }
      // ⚠ A MAJORITY, NOT A TOUCH. A facet that clips a bank for one sample is a wall on the
      //   waterfront (which is lawful and is what a quay wall IS); a facet mostly in the water is
      //   a wall in the water. The cut is at the half so the two readings cannot both apply.
      wetEdge[i] = wet > steps / 2;
    }
  }
  // …and an END-WORK stands at every transition, because a curtain that simply STOPS presents an
  // open end — §577’s second half, owed to the water exactly as it is owed to the scarp.
  for (let i = 0; i < ring.length; i++) {
    const prev = wetEdge[(i - 1 + ring.length) % ring.length];
    if (prev === wetEdge[i]) continue;
    const nb = ring[(wetEdge[i] ? (i - 1 + ring.length) : (i + 1)) % ring.length];
    const L = Math.hypot(nb[0] - ring[i][0], nb[1] - ring[i][1]) || 1;
    cand.push({ p: ring[i], t: [(nb[0] - ring[i][0]) / L, (nb[1] - ring[i][1]) / L], cls: 1,
      kind: 'angle', rad: stone * 1.45, why: '§161m.3 the water is the wall here — the curtain ends',
      key: `waterBrink.E${epoch}.v${i}` });
  }
  // class 2 · THE ANGLE TURNS. ⚠ Within the class the SHARPEST corner wins its site: the §590
  // preview measured a 12° seam claiming ground and pushing a 40° corner off the wall.
  for (let i = 0; i < ring.length; i++) {
    if (turns[i] < turnCut) continue;
    const rj = runOfVertex[i];
    // ⛔ NOT ON A SURRENDERED FLANK. §205.3 is ruled — *a cliff flank needs NO wall, drawing one
    // is the violation* — and a tower on the parapet at the brink is the same violation one mark
    // further in. The run policy already says `towers: 'none'` there; the joint field obeys it.
    if (runs[rj] && runs[rj].towerPolicy === 'none') continue;
    const n = ring.length;
    const pv = ring[(i - 1 + n) % n], nx0 = ring[(i + 1) % n];
    const L = Math.hypot(nx0[0] - pv[0], nx0[1] - pv[1]) || 1;
    cand.push({ p: ring[i], t: [(nx0[0] - pv[0]) / L, (nx0[1] - pv[1]) / L], cls: 2, kind: 'angle',
      rad: stone * rung.towerScale * 1.15, turn: turns[i], vertex: i,
      why: `angle turn ${turns[i].toFixed(0)}° ≥ cut ${turnCut.toFixed(0)}°`,
      key: `angle.E${epoch}.v${i}` });
  }

  // class 3 · THE STATIONS the run chain already placed, with the kinds it already chose.
  for (let i = 0; i < towers.length; i++) {
    const t = towers[i];
    let bi = 0, bd = Infinity;
    for (let k = 0; k < ring.length; k++) {
      const d = (ring[k][0] - t[0]) ** 2 + (ring[k][1] - t[1]) ** 2;
      if (d < bd) { bd = d; bi = k; }
    }
    const n = ring.length;
    const pv = ring[(bi - 1 + n) % n], nx0 = ring[(bi + 1) % n];
    const L = Math.hypot(nx0[0] - pv[0], nx0[1] - pv[1]) || 1;
    cand.push({ p: t, t: [(nx0[0] - pv[0]) / L, (nx0[1] - pv[1]) / L], cls: 3,
      kind: towerTypes[i] || 'drum', rad: stone * rung.towerScale, vertex: bi,
      why: 'seeded station (wallRuns.towersFor)', key: `station.E${epoch}.${i}` });
  }

  /* ── ⭐⭐⭐ **A WORK'S SITE MUST HOLD THE WORK'S OWN FOOTPRINT**, and a MEASUREMENT put this
   *    rule here. The over-ground census walked the DRAWN marks and convicted four end-works and
   *    three sealed tower stations on the polycentric leaf: each stands with its centre on lawful
   *    ground and a quarter of its BODY over the brink. ⭐ THE CLASS is `terminateAtCliffs`' own,
   *    one dimension out: **A PREDICATE SAMPLED AT A POINT MEASURES THE POINT, NOT THE BODY** —
   *    §577 puts the terminus on passable ground by construction, and a tower is not a point.
   *
   * ⚠ THE TWO OUTCOMES ARE DIFFERENT BY CLASS, and that difference is the rule rather than a
   *   convenience. A TERMINUS work is PULLED BACK along its own masonry (its `t` is walls.js's
   *   *"the direction the masonry runs from it"*) and never refused — a curtain that simply stops
   *   presents an open end, which is the one thing §577's second half exists to forbid. Any other
   *   work is REFUSED: the ground would not carry it, and the site's cover then falls to whatever
   *   the spacing field seats next, which is what the coverage census is there to show. */
  let pulled = 0, groundRefused = 0, drowned = 0;
  for (let i = cand.length - 1; i >= 0; i--) {
    const q = cand[i];
    let why = siteRefused(q.p, q.rad);
    if (!why) continue;
    if (q.cls === 1) {
      // Pull back along the masonry in half-radius steps until the footprint clears.
      // ⚠ THE RANGE IS TWELVE HALF-RADII, NOT FOUR, AND A MEASUREMENT SET IT. A coastal city’s
      //   circuit has 43 facets over 2,841 units — 66 units a facet — so a terminus that lands
      //   inside a bay needs to walk a real distance to find the bank, and four half-radii moved
      //   it 15 % of one facet. MEASURED before: the water end-work came back with 24 of 24
      //   samples submerged; after: it clears.
      for (let k = 1; k <= 12 && why; k++) {
        const p2 = [q.p[0] + q.t[0] * q.rad * 0.5 * k, q.p[1] + q.t[1] * q.rad * 0.5 * k];
        if (!siteRefused(p2, q.rad)) { q.p = p2; q.pulled = q.rad * 0.5 * k; why = null; pulled++; }
      }
      // ⛔⛔ **AND IF IT STILL WILL NOT CLEAR, IT IS DROPPED — MY FIRST RULING HERE WAS WRONG AND
      // THE CENSUS SAID SO.** I first wrote that an end-work which cannot find ground STAYS,
      // reasoning that an open end is worse than an overhang. MEASURED on the coastal city: the
      // work came back with **24 of 24 samples in the sea** — a tower drawn floating in a harbour,
      // which is not a lesser evil than an open end, it is a worse one.
      // ⭐ AND THE ARGUMENT WAS WRONG AT ITS ROOT, not merely in its balance: where the ground is
      // water, THE WATER IS THE WALL (§161m.3) — so there is no open end to close, because there
      // is no curtain there to leave open. hf313 draws exactly this: its WATER GATE is the one
      // anatomy on the plate with NO flanking drums. A site the ground refuses is not a site.
      if (why) { cand.splice(i, 1); drowned++; }
    } else {
      cand.splice(i, 1); groundRefused++;
    }
  }

  /* ── ACCEPT IN CLASS ORDER AGAINST THE ONE FIELD. */
  const crowded = (q) => taken.some((o) => dist(o.p, q.p) < Math.max((o.rad + q.rad) * JOINT_CLEAR_K, stone * JOINT_MIN_SPAN));
  cand.sort((x, y) => x.cls - y.cls
    || (y.turn || 0) - (x.turn || 0)
    || (x.key < y.key ? -1 : x.key > y.key ? 1 : 0));
  /** @type {Array<any>} */ const joints = [];
  let rejected = 0;
  for (const q of cand) {
    if (crowded(q)) { rejected++; q.rejected = true; continue; }
    taken.push({ p: q.p, rad: q.rad });
    // ⚠ THE KIND STAYS INSIDE `TOWER_TYPES`. A tenth kind is a ruling (the totality walker's own
    // rule) and this wave mints none: an angle turn takes the vocabulary's OWN member for a
    // junction, and a station keeps the kind the run chain already chose for it.
    const kind = TOWER_TYPES.includes(q.kind) ? q.kind : 'drum';
    joints.push({
      key: q.key, x: q.p[0], y: q.p[1], dx: q.t[0], dy: q.t[1], kind, cls: q.cls,
      r: q.rad, why: q.why,
      ...(q.pulled ? { pulledBack: Math.round(q.pulled * 100) / 100 } : {}),
      ...(q.overhang ? { overhang: q.overhang } : {}),
      // hf261 rung 4/5: the open gorge and the ringed drum carry an interior void. A jitter so a
      // rank of works is not a rank of identical stamps — the seeded hand §214 asks for.
      chamber: rung.chamber && q.cls !== 1 ? q.rad * rng.range(0.40, 0.50) : 0,
    });
  }

  /* ── THE COVERAGE ANSWER, computed HERE because this is the only scope that holds both the
   *    structural sites and the works that were accepted. A site whose own candidate was refused
   *    for crowding is COVERED by the work that crowded it — that work stands within the spacing
   *    floor, which is to say on the same corner. An EXCEPTION is a site with no work inside the
   *    floor at all, and that is the number the exit asks for. */
  const covers = (p) => joints.some((j) => dist([j.x, j.y], p) <= Math.max((j.r + stone * rung.towerScale) * JOINT_CLEAR_K, stone * JOINT_MIN_SPAN))
    || gatehouses.some((g) => dist([g.x, g.y], p) <= g.half * JOINT_CLEAR_K + stone * JOINT_MIN_SPAN);
  const sites = { turn: [], terminus: [], gate: [] };
  for (let i = 0; i < ring.length; i++) {
    if (turns[i] < turnCut) continue;
    if (runs[runOfVertex[i]] && runs[runOfVertex[i]].towerPolicy === 'none') continue;
    sites.turn.push(ring[i]);
  }
  for (const c of cand) if (c.cls === 1) sites.terminus.push(c.p);
  for (const g of gates) sites.gate.push([g.x, g.y]);
  const exceptions = {
    turn: sites.turn.filter((p) => !covers(p)).length,
    terminus: sites.terminus.filter((p) => !covers(p)).length,
    // A gate is covered by its own gatehouse by construction; the count is kept so a future
    // change that stopped emitting one would red rather than go quiet.
    gate: sites.gate.filter((p) => !gatehouses.some((g) => dist([g.x, g.y], p) < 1e-6)).length,
  };

  return {
    rung,
    wetEdges: wetEdge.map((v, i) => (v ? i : -1)).filter((i) => i >= 0),
    turnCut: Math.round(turnCut * 10) / 10,
    joints,
    gatehouses,
    stats: {
      candidates: cand.length, accepted: joints.length, rejected,
      byClass: [0, 1, 2, 3].map((c) => joints.filter((j) => j.cls === c).length),
      byKind: Object.fromEntries(TOWER_TYPES.map((k) => [k, joints.filter((j) => j.kind === k).length])),
      sites: { turn: sites.turn.length, terminus: sites.terminus.length, gate: sites.gate.length },
      exceptions,
      stations: towers.length,
      runBandsSeen: (runBands || []).length,
      pulledBack: pulled, groundRefused, terminiDrowned: drowned,
      gatesShrunk: gatehouses.filter((g) => g.shrunk).length,
      gatesOverhanging: gatehouses.filter((g) => g.overhang).length,
      overhanging: joints.filter((j) => j.overhang).length,
    },
    reason: `§590 RAMPART rung ${rung.rung} (${rung.plate}); turn cut ${turnCut.toFixed(0)}°`
      + ` (floor ${TURN_FLOOR_DEG}°, ring p${Math.round(TURN_QUANTILE * 100)} ${quantile(turns, TURN_QUANTILE).toFixed(0)}°)`
      + `; ${joints.length} joint work(s) from ${cand.length} candidate(s), ${rejected} refused by the spacing field`
      + `; ${gatehouses.length} gatehouse(s) at ${rung.gate}`
      + `; UNCOVERED — ${exceptions.turn} turn(s), ${exceptions.terminus} terminus/termini, ${exceptions.gate} gate(s)`
      + `; GROUND — ${pulled} end-work(s) pulled back onto firm ground, ${groundRefused} candidate(s) refused by the ground, ${drowned} terminus/termini dropped because the water is the wall there`,
  };
}
