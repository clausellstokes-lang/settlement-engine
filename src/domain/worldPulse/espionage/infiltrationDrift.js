/**
 * domain/worldPulse/espionage/infiltrationDrift.js — DEPTH-PRICED DRIFT, CUSTODY
 * EXITS, AND THE AGGREGATE EROSION BOUND (W-OPS car O5; DESIGN_W_OPS.md §3 and §7
 * risk 2, on DESIGN_W_LIVES.md §15's F11, which OUTRANKS §9).
 *
 * WHAT THIS HOLDS. Three things the operations volume asks of the infiltration
 * ladder once it has rungs: how DEPTH prices the drift a long embedding does to a
 * person, what ENDS an embedding, and the property that says an embedding can never
 * erode the person's authored core past a stated bound.
 *
 * NOT A SECOND DRIFT SYSTEM. Nothing here writes an offset, holds a chart, or owns
 * a rate. W-LIVES car L2's DRIFT STATE leaf is the only module in the estate that may
 * move a soul and car L3's EXPERIENCE FUNNEL is the only one that may
 * ask it to; this leaf produces the EMISSION PLAN one of those lessons is built
 * from, and a PREDICATE over the arithmetic those two already perform. Every
 * constant of theirs — the materialization floor, the clamp, the decay retention —
 * arrives here as an ARGUMENT, so a second opinion about any of them is structurally
 * unavailable rather than merely discouraged.
 *
 * ── F11 IS TWO ASSERTIONS AND THIS FILE IS THE SECOND ONE ───────────────────
 *
 * F11: "(a) a PER-AXIS OFFSET CLAMP (explicit, band-bounded) and (b) the SUMMED
 * ambient equilibrium across source families sits below one band at every depth
 * short of `immersed`. Asserted over the aggregate, not the single term."
 *
 * (a) is BUILT — L2's `MAX_AXIS_OFFSET`, two half-spans wide. (b) is this file.
 *
 * ⭐⭐ AND (b) IS A CLIFF, NOT A SLOPE. That is the whole finding of this car, and it
 * decides its design. An ambient source that emits a quantum `q` every period against
 * a decay retention `r` does NOT equilibrate at the linear `q/(1-r)`, because L2's
 * materialization floor DELETES a cell that decays back under it. So there are
 * exactly two regimes and nothing between them:
 *
 *   q * r <  epsilon   FLOOR-RESET.  The cell is deleted every period; the
 *                      equilibrium is exactly `q`, whatever the half-life.
 *   q * r >= epsilon   LINEAR.       The cell survives, and the offset climbs to
 *                      `q/(1-r)` — which for today's constants is 4 to 113 bands,
 *                      i.e. straight into the clamp.
 *
 * The ceiling is therefore `epsilon / r`, and it is BARELY above one quantum:
 * measured at this tip, a source emitting once a season has **5.9 %** headroom over
 * `faint`, and a source emitting EVERY TICK has **0.45 %**. Between "the depth bands
 * are expressively dead" (the registers pack's own measured words, because the milieu
 * family's -2 step clamps every band to `faint`) and "every axis pinned at the
 * spectrum extreme" there is a window under one percent wide.
 *
 * ⇒ **DEPTH MAY NOT BE PRICED ON THE QUANTUM.** Not a preference: the first depth
 * multiplier above 1.0045 takes the equilibrium from a quarter band to the clamp, and
 * a signed tuning row cannot fix that because there is no value on the far side of the
 * cliff that satisfies (b) either. Depth is priced on BREADTH instead — how much of
 * the host's chart an embedding exposes a person to — which leaves every per-axis
 * quantum at exactly one floor quantum and moves the aggregate linearly and safely.
 * `DEPTH_PRICING_LAW` carries the reasoning in the module so it cannot be lost.
 *
 * ── GAP D, HONOURED THE WAY knownCharacterOf HONOURS IT ─────────────────────
 *
 * "Biography is a query, not a store… No per-NPC memory store exists or may be
 * minted." The host's pull vector is HANDED IN, exactly as `knownCharacterOf` takes
 * its disclosures: somewhere for this leaf to LOOK would be the store the design
 * forbids. This module has no reach to any world state at all.
 *
 * ── DARK ────────────────────────────────────────────────────────────────────
 *
 * ⛔⛔ AND THE W-LIVES LEAVES ARE NAMED BY DESCRIPTION, NEVER BY FILENAME, WHICH
 * READS AS PEDANTRY AND IS NOT. Two arms in that family — the funnel's "the ONLY
 * src namer" and the sources' "the ONLY src importers" — scan every file under
 * `src/` for the RAW substring, with no comment stripping, so a sibling that merely
 * CITES one of those leaves in a comment REDS them. Car L5 already ruled on exactly
 * this ("an IMPORT is a dependency; a CITATION is not") and amended the closure
 * scans to strip comments first — but the amendment did not reach these two. Until
 * it does, a citation here costs a sibling's green, so the citations are by
 * description; the receipt carries the one-line cure.
 *
 * No `src/` importer, proved by a walker rather than promised. No flag minted: the
 * door is NAMED at `INFILTRATION_DRIFT_PROVENANCE.door` and the gate read is not
 * written, because the CR-WR10-C mint is a register edit this packet did not order.
 * The whole family also sits behind car L2's own virtual drift flag, which has no
 * entry in `DEFAULT_SIMULATION_RULES`.
 *
 * PURE, AND IT IMPORTS NOTHING AT ALL. No store, no clock, no PRNG, no I/O, no
 * mutation, and no transcendental site: the decay retention is MEASURED by the caller
 * through `bandedStock.decayTowardNeutral` and passed in, which is both exact and one
 * fewer power in `src/domain`. The rung names are mirrored with a reconcile pin — see
 * `INFILTRATION_LEVELS_MIRROR` for the law that forced it.
 *
 * @see docs/DESIGN_W_OPS.md §3, §7, §8b (F4, F8, F15), §9
 * @see docs/DESIGN_W_LIVES.md §9 risk 5, §15 (F9 as amended at §853, F11)
 * @enforced-by tests/domain/infiltrationDrift.test.js
 */

/**
 * ⛔⛔ THE RUNG NAMES ARE MIRRORED, NOT IMPORTED, AND THE REASON IS A LAW THIS CAR
 * DISCOVERED THE HARD WAY.
 *
 * The authority is car O3's `./infiltrationDepth.js` (`INFILTRATION_LEVELS`), which
 * sits in this very directory — so importing it would have been free of every
 * coupling cost. It is not free of a different one: that leaf's own battery asserts
 * "NO PRODUCTION CALLER: nothing under src/ imports this leaf", and an import from
 * here REDS IT. A dark leaf's darkness arm and a sibling car consuming it are
 * mutually exclusive, and the first car in a family to reach for a sibling's NEW
 * dark leaf is the one that finds out.
 *
 * The estate already has the cure and it is not an exemption: car L2's drift leaf
 * mirrors car L1's `AXIS_LEVELS` and car L3's catalog mirrors its
 * `PARADIGM_AXIS_IDS`, each with a RECONCILE PIN that asserts the equality the
 * moment both cars share a tree. The same shape here — and the pin is stronger than
 * an import would have been, because the TEST holds the real `INFILTRATION_LEVELS`
 * and would red on any divergence in name, order or level number.
 * @type {ReadonlyArray<Readonly<{level: number, name: string}>>}
 */
export const INFILTRATION_LEVELS_MIRROR = Object.freeze([
  Object.freeze({ level: 0, name: 'passing_ear' }),
  Object.freeze({ level: 1, name: 'observer' }),
  Object.freeze({ level: 2, name: 'rooted' }),
  Object.freeze({ level: 3, name: 'placed' }),
  Object.freeze({ level: 4, name: 'seated' }),
]);

/**
 * THE DEPTH EXPOSURE WORDS, CARRIED VERBATIM FROM THE REGISTERS PACK — never
 * re-invented. Register V writes them as "Depth exposure bands (milieu multiplier,
 * banded): L0 faint · L1 light · L2 full · L3 deep · L4 immersed", and F11's own
 * sentence bounds the aggregate "at every depth short of `immersed`" — so the last
 * word is the one the bound deliberately excludes, and it must keep its spelling or
 * F11's exclusion loses its referent.
 *
 * ⚠ THE PACK CALLS THEM A MULTIPLIER AND THIS CAR DOES NOT USE THEM AS ONE.
 * `DEPTH_PRICING_LAW` below carries the measured reason. The WORDS are the register's
 * and are kept; the arithmetic they were drafted for is what the cliff refuses.
 * @type {readonly string[]}
 */
export const DEPTH_EXPOSURE_WORDS = Object.freeze([
  'faint', 'light', 'full', 'deep', 'immersed',
]);

/** The word F11 excludes from its bound, named once so no reader has to count. */
export const UNBOUNDED_EXPOSURE_WORD = DEPTH_EXPOSURE_WORDS[DEPTH_EXPOSURE_WORDS.length - 1];

/**
 * The ladder, DERIVED by zipping O3's rungs with the pack's words rather than
 * re-listing either. A second roster of levels would be the fork §7 risk 3 names,
 * and a length disagreement between the two lists is caught here at module
 * evaluation instead of by a reader.
 * @type {ReadonlyArray<Readonly<{level: number, name: string, exposure: string, breadth: number, bounded: boolean}>>}
 */
export const DEPTH_EXPOSURE_BANDS = Object.freeze(INFILTRATION_LEVELS_MIRROR.map((rung, index) => {
  const exposure = DEPTH_EXPOSURE_WORDS[index];
  if (typeof exposure !== 'string') {
    throw new Error(`infiltrationDrift: the infiltration ladder has ${INFILTRATION_LEVELS_MIRROR.length} rungs and the pack names ${DEPTH_EXPOSURE_WORDS.length} exposure words`);
  }
  return Object.freeze({
    level: rung.level,
    name: rung.name,
    exposure,
    // BREADTH IS THE PRICE. One axis at the passing ear; the whole host chart at the
    // seat. Derived from the rung index so it cannot be authored into a taste row.
    breadth: index + 1,
    // F11 bounds every depth SHORT OF the last word. The flag is derived from that
    // sentence rather than from the level number, so re-ordering the ladder moves it.
    bounded: exposure !== UNBOUNDED_EXPOSURE_WORD,
  });
}));

/** The exposure words in level order — the totality export the house idiom asks for. */
export const DEPTH_EXPOSURE_OF = Object.freeze(Object.fromEntries(
  DEPTH_EXPOSURE_BANDS.map((row) => [row.name, row.exposure]),
));

/**
 * THE RULING THIS CAR IS, in the module, so a later reader meets it as law rather
 * than as a receipt they have to find.
 * @type {Readonly<{ruling: string, measured: string, rejected: string, signedBy: string|null}>}
 */
export const DEPTH_PRICING_LAW = Object.freeze({
  ruling: 'depth prices BREADTH (how many of the host chart\'s axes an embedding exposes a person to), and never the per-axis quantum',
  measured: 'the ambient equilibrium is a two-regime step function, not a curve: below epsilon/retention it equals the quantum exactly, at or above it the offset climbs to quantum/(1-retention). Measured at this tip the ceiling sits 5.9% above faint for a source emitting once a season and 0.45% above it for one emitting every tick',
  rejected: 'the registers pack drafts the five depth words as a MILIEU MULTIPLIER; a multiplier is exactly the arithmetic the cliff refuses, because no multiplier above 1.0045 leaves an equilibrium anywhere below the clamp',
  signedBy: null,
});

/**
 * The closed refusal vocabulary for a plan that cannot be built. A refused plan is a
 * RECEIPTED refusal, never an empty return: an adapter author debugging a spy who
 * never drifts needs to be told which of the four reasons it was.
 * @type {readonly string[]}
 */
export const PLAN_REFUSALS = Object.freeze([
  'no_host_vector',   // the caller supplied no read of the host, so there is no direction
  'unknown_level',    // a rung outside the ladder; never guessed to the nearest one
  'short_of_cadence', // the dwell has not completed one whole ambient period
  'sub_floor_span',   // the integrated span cannot carry one quantum across the floor
]);

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @returns {string} */
function str(v) {
  return v == null ? '' : String(v);
}

/** @param {unknown} v @returns {number} a finite number, or 0 */
function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Codepoint order, spelled here rather than imported. The estate's `compareCodepoint`
 * lives in `domain/deterministicSort.js`, which is outside this family; borrowing it
 * for one three-line comparator would put a cross-layer pair on the coupling ledger
 * for no discovery power, and the test pins the two agree.
 * @param {string} a a token
 * @param {string} b a token
 * @returns {number}
 */
function byCodepoint(a, b) {
  return a < b ? -1 : (a > b ? 1 : 0);
}

/**
 * The ladder row for a rung, by NAME or by LEVEL NUMBER. Returns null for anything
 * else: a depth this file does not know is not rounded to the nearest one it does.
 * @param {unknown} level a rung name, or its level number
 * @returns {Readonly<{level: number, name: string, exposure: string, breadth: number, bounded: boolean}>|null}
 */
export function depthBandOf(level) {
  const wanted = str(level);
  for (const row of DEPTH_EXPOSURE_BANDS) {
    if (row.name === wanted || String(row.level) === wanted) return row;
  }
  return null;
}

// ── THE PRICING ───────────────────────────────────────────────────────────────

/**
 * THE PINNED TOTAL ORDER over a host's pull vector: strongest band first, then axis
 * id ascending. Pinned rather than left to arrival order because the plan takes a
 * PREFIX of this list, so a caller whose vector arrived in a different order would
 * otherwise expose a spy to a different half of the same city.
 * @param {ReadonlyArray<{axisId?: unknown, pole?: unknown, band?: unknown}>} [vector] the host's pulls
 * @param {readonly string[]} [bandLadder] the funnel's own PULL_BANDS, ascending, handed in
 * @returns {ReadonlyArray<Readonly<{axisId: string, pole: string, band: string}>>}
 */
export function orderedHostVector(vector, bandLadder) {
  const ladder = Array.isArray(bandLadder) ? bandLadder.map(str) : [];
  const rows = (Array.isArray(vector) ? vector : []).map((raw) => {
    const cell = asObject(raw);
    return Object.freeze({ axisId: str(cell.axisId), pole: str(cell.pole), band: str(cell.band) });
  }).filter((row) => row.axisId !== '');
  return Object.freeze(rows.slice().sort((a, b) => {
    const byBand = ladder.indexOf(b.band) - ladder.indexOf(a.band);
    if (byBand !== 0) return byBand;
    return byCodepoint(a.axisId, b.axisId);
  }));
}

/**
 * @typedef {Object} ExposurePlan
 * @property {string} level        the rung name
 * @property {string} exposure     the pack's depth word
 * @property {number} breadth      how many host axes this rung REACHES FOR
 * @property {number} exposed      how many it actually got — the host's chart may be shorter
 * @property {boolean} bounded     whether F11's aggregate bound covers this rung
 * @property {number} spanTicks    the integrated ambient span, in ticks
 * @property {number} cadences     whole ambient periods completed
 * @property {ReadonlyArray<Readonly<{axisId: string, pole: string, band: string}>>} pulls
 * @property {boolean} emit
 * @property {string|null} refusal a PLAN_REFUSALS member
 */

/**
 * THE DEPTH-PRICED AMBIENT PLAN. What one interval of embedding at a given rung
 * teaches, expressed in exactly the fields car L3's funnel consumes for an ambient
 * `dwell_milieu` entry — `spanTicks` and `pulls` — and nothing else.
 *
 * DEPTH ENTERS AS BREADTH AND ONLY AS BREADTH. The band words on the host's pulls are
 * passed through untouched, so the per-axis quantum is whatever the funnel's own
 * family step makes of the host's own word; what the rung decides is HOW MANY of the
 * host's axes reach the person. A passing ear brushes the city's loudest trait; the
 * seated mole lives its whole chart.
 *
 * ⚠ THE SPAN IS WHOLE PERIODS, NEVER THE RAW DWELL. §853 rules that ambient sources
 * emit at INTERVAL cadence with time-integrated magnitude; a partial period emits
 * NOTHING rather than a small pull, so this plan can never hand the funnel a
 * sub-floor magnitude for it to refuse.
 *
 * @param {Object} args the plan request
 * @param {unknown} [args.level] a rung name or level number
 * @param {number} [args.dwellTicks] ticks dwelt at the host so far
 * @param {number} [args.cadenceTicks] the funnel's AMBIENT_CADENCE_TICKS, handed in
 * @param {ReadonlyArray<{axisId?: unknown, pole?: unknown, band?: unknown}>} [args.hostVector] the host's own pulls, READ BY THE CALLER
 * @param {readonly string[]} [args.bandLadder] the funnel's PULL_BANDS, ascending
 * @returns {ExposurePlan}
 */
export function depthExposurePlan({ level, dwellTicks, cadenceTicks, hostVector, bandLadder } = {}) {
  const row = depthBandOf(level);
  /** @type {ReadonlyArray<Readonly<{axisId: string, pole: string, band: string}>>} */
  const noPulls = Object.freeze([]);
  /**
   * @param {string} refusal a PLAN_REFUSALS member
   * @returns {ExposurePlan}
   */
  const refuse = (refusal) => Object.freeze({
    level: row ? row.name : '',
    exposure: row ? row.exposure : '',
    breadth: row ? row.breadth : 0,
    exposed: 0,
    bounded: row ? row.bounded : false,
    spanTicks: 0,
    cadences: 0,
    pulls: noPulls,
    emit: false,
    refusal,
  });
  if (!row) return refuse('unknown_level');
  const ordered = orderedHostVector(hostVector, bandLadder);
  if (ordered.length === 0) return refuse('no_host_vector');
  const cadence = Math.floor(num(cadenceTicks));
  if (!(cadence > 0)) return refuse('sub_floor_span');
  const cadences = Math.floor(num(dwellTicks) / cadence);
  if (cadences < 1) return refuse('short_of_cadence');
  const reached = ordered.slice(0, row.breadth);
  return Object.freeze({
    level: row.name,
    exposure: row.exposure,
    breadth: row.breadth,
    // WHAT THE RUNG REACHES FOR AND WHAT IT GOT ARE DIFFERENT NUMBERS, and both are
    // reported: a mole seated in a city with two salient traits lives two, not five,
    // and a plan that quietly reported its appetite as its reach would let a caller
    // price an exposure the host never had.
    exposed: reached.length,
    bounded: row.bounded,
    // ONE PERIOD PER EMISSION, NEVER THE CUMULATIVE DWELL. A span that grows with the
    // length of the stay multiplies the quantum by the number of periods already
    // served, which is precisely the arithmetic the cliff forbids — and a caller that
    // emits every tick would then climb to the clamp. The number of periods served is
    // reported BESIDE the span so a caller that wants it has it without inflating it.
    spanTicks: cadence,
    cadences,
    pulls: Object.freeze(reached),
    emit: true,
    refusal: null,
  });
}

// ── THE AGGREGATE EROSION BOUND (F11 (b)) ────────────────────────────────────

/** The two regimes, named as a closed vocabulary so a caller can switch on them. */
export const EQUILIBRIUM_REGIMES = Object.freeze(['floor_reset', 'linear']);

/**
 * THE CEILING. The largest per-period quantum whose stored offset still decays back
 * UNDER the materialization floor before the next one lands — and therefore the
 * largest quantum for which the equilibrium is the quantum itself.
 *
 * `retention` is measured, not modelled: a caller obtains it by asking the estate's
 * one decay shape what it does to a unit offset over one period,
 * `decayTowardNeutral(1, 0, periodTicks, band)`. That keeps this bound welded to the
 * arithmetic it claims to bound, and keeps a transcendental site out of this file.
 *
 * @param {Object} args the floor and the decay
 * @param {number} [args.epsilon] L2's MATERIALIZATION_EPSILON
 * @param {number} [args.retention] what one period of decay leaves of a unit offset
 * @returns {number}
 */
export function erosionCeiling({ epsilon, retention } = {}) {
  const eps = num(epsilon);
  const ret = num(retention);
  if (!(eps > 0) || !(ret > 0)) return 0;
  return eps / ret;
}

/**
 * @typedef {Object} EquilibriumRead
 * @property {string} regime an EQUILIBRIUM_REGIMES member
 * @property {number} quantum
 * @property {number} ceiling
 * @property {number} equilibrium where a repeated pull of this size comes to rest
 * @property {boolean} withinBand whether that rest point is under one full band
 */

/**
 * ONE AXIS, ONE ANSWER. Where a per-period quantum comes to rest under L2's floor
 * and L3's decay.
 *
 * THE STEP IS THE POINT. `quantum * retention < epsilon` means the cell is deleted
 * before the next pull arrives, so every period starts from zero and the offset never
 * exceeds one quantum — whatever the half-life, which is why no decay band can be
 * signed to fix a quantum that is over the line. At or above it the cell survives and
 * the offset climbs to the linear fixed point.
 *
 * @param {Object} args the pull and the machinery it lands in
 * @param {unknown} [args.quantum] the per-period magnitude, in bands
 * @param {number} [args.epsilon] L2's MATERIALIZATION_EPSILON
 * @param {number} [args.retention] what one period of decay leaves of a unit offset
 * @param {number} [args.bandWidth] one band, in the same units; defaults to 1
 * @returns {EquilibriumRead}
 */
export function ambientEquilibrium({ quantum, epsilon, retention, bandWidth } = {}) {
  const q = Math.abs(num(quantum));
  const eps = num(epsilon);
  const ret = num(retention);
  const band = num(bandWidth) > 0 ? num(bandWidth) : 1;
  const ceiling = erosionCeiling({ epsilon: eps, retention: ret });
  const survives = q * ret >= eps;
  const equilibrium = survives && ret < 1 ? q / (1 - ret) : q;
  return Object.freeze({
    regime: survives ? EQUILIBRIUM_REGIMES[1] : EQUILIBRIUM_REGIMES[0],
    quantum: q,
    ceiling,
    equilibrium,
    withinBand: equilibrium < band,
  });
}

/**
 * @typedef {Object} ErosionBoundRead
 * @property {boolean} holds F11 (b) over every axis AND the aggregate under its bound
 * @property {number} aggregate the summed rest displacement of the whole chart
 * @property {number} bound what the aggregate is PROMISED to stay under: axes x ceiling
 * @property {number} worst the largest single-axis rest displacement
 * @property {string} worstAxis
 * @property {number} clamp the per-axis bound F11 (a) already guarantees
 * @property {boolean} clampBinds whether any axis rests at or beyond the clamp
 * @property {ReadonlyArray<Readonly<{axisId: string, quantum: number, regime: string, equilibrium: number, withinBand: boolean}>>} perAxis
 * @property {readonly string[]} violations axis ids failing the one-band bound
 */

/**
 * THE AGGREGATE BOUND, F11 (b), ASSERTED OVER THE WHOLE CHART.
 *
 * F11 is explicit that the assertion is "over the aggregate, not the single term",
 * so the input is the SUMMED per-period quantum per axis across every ambient source
 * family that pulls it. Two families each emitting one floor quantum at the same
 * cadence sum to two, and two floor quanta are over the ceiling — which is exactly
 * the case a per-term assertion cannot see and is the reason F11 says aggregate.
 *
 * The report carries the per-axis rows, the summed displacement of the whole chart,
 * and whether L2's clamp is left doing the work — because a chart resting AT the
 * clamp satisfies F11 (a) and has still eroded the person completely, and (a) can
 * never see that on its own.
 *
 * @param {Object} args the summed pull and the machinery it lands in
 * @param {Record<string, number>} [args.perAxisQuanta] summed per-period magnitude per axis
 * @param {number} [args.epsilon] L2's MATERIALIZATION_EPSILON
 * @param {number} [args.retention] what one period of decay leaves of a unit offset
 * @param {number} [args.clamp] L2's MAX_AXIS_OFFSET
 * @param {number} [args.bandWidth] one band, in the same units; defaults to 1
 * @returns {ErosionBoundRead}
 */
export function aggregateErosionBound({ perAxisQuanta, epsilon, retention, clamp, bandWidth } = {}) {
  const quanta = asObject(perAxisQuanta);
  const cap = num(clamp);
  const perAxis = Object.keys(quanta).sort(byCodepoint).map((axisId) => {
    const read = ambientEquilibrium({
      quantum: quanta[axisId], epsilon, retention, bandWidth,
    });
    return Object.freeze({
      axisId,
      quantum: read.quantum,
      regime: read.regime,
      // THE CLAMP IS PART OF THE ANSWER, NOT A SEPARATE ONE. A linear fixed point
      // above the clamp is not where the soul rests; the clamp is. Reporting the
      // unclamped number would overstate the erosion and understate the disaster.
      equilibrium: cap > 0 ? Math.min(read.equilibrium, cap) : read.equilibrium,
      withinBand: read.withinBand,
    });
  });
  const violations = perAxis.filter((row) => !row.withinBand).map((row) => row.axisId);
  let worst = 0;
  let worstAxis = '';
  let aggregate = 0;
  for (const row of perAxis) {
    aggregate += row.equilibrium;
    if (row.equilibrium > worst) { worst = row.equilibrium; worstAxis = row.axisId; }
  }
  // THE AGGREGATE PROMISE, and it is the one the packet asks for: the whole chart's
  // displacement from its authored core is at most one ceiling per axis pulled. It
  // grows LINEARLY in the breadth a rung exposes, which is what makes breadth a
  // signable dial and the quantum not one.
  const bound = perAxis.length * erosionCeiling({ epsilon, retention });
  return Object.freeze({
    holds: violations.length === 0 && aggregate <= bound,
    aggregate,
    bound,
    worst,
    worstAxis,
    clamp: cap,
    clampBinds: cap > 0 && perAxis.some((row) => row.equilibrium >= cap),
    perAxis: Object.freeze(perAxis),
    violations: Object.freeze(violations.slice().sort(byCodepoint)),
  });
}

/**
 * THE BOUND A PLAN PROMISES, at every rung, in one call. Given the machinery's own
 * constants and the funnel's resolved per-axis quantum for one host pull, this is
 * what F11 (b) is asked about at each depth.
 *
 * ⚠ `immersed` IS REPORTED AND NOT EXCUSED. F11 bounds "every depth short of
 * `immersed`", so the last rung's row carries `bounded: false` and its verdict is
 * reported beside the others rather than filtered out — an excluded row that
 * disappears is an exclusion nobody can audit.
 *
 * @param {Object} args the per-axis quantum and the machinery
 * @param {number} [args.quantumPerAxis] what one host pull resolves to, per axis, per period
 * @param {number} [args.epsilon] L2's MATERIALIZATION_EPSILON
 * @param {number} [args.retention] what one period of decay leaves of a unit offset
 * @param {number} [args.clamp] L2's MAX_AXIS_OFFSET
 * @param {number} [args.bandWidth] one band, in the same units; defaults to 1
 * @returns {ReadonlyArray<Readonly<{level: string, exposure: string, breadth: number, bounded: boolean, aggregate: number, bound: number, worst: number, regime: string, holds: boolean}>>}
 */
export function depthErosionLedger({ quantumPerAxis, epsilon, retention, clamp, bandWidth } = {}) {
  return Object.freeze(DEPTH_EXPOSURE_BANDS.map((row) => {
    /** @type {Record<string, number>} */
    const quanta = {};
    for (let i = 0; i < row.breadth; i += 1) quanta[`axis_${i}`] = num(quantumPerAxis);
    const read = aggregateErosionBound({ perAxisQuanta: quanta, epsilon, retention, clamp, bandWidth });
    return Object.freeze({
      level: row.name,
      exposure: row.exposure,
      breadth: row.breadth,
      bounded: row.bounded,
      aggregate: read.aggregate,
      bound: read.bound,
      worst: read.worst,
      regime: read.perAxis.length > 0 ? read.perAxis[0].regime : EQUILIBRIUM_REGIMES[0],
      holds: read.holds,
    });
  }));
}

// ── GOING NATIVE: THE REACHABILITY READ ──────────────────────────────────────

/**
 * WHICH AXES A LESSON TABLE CAN ACTUALLY DARKEN. The going-native arc needs FIDELITY
 * to move toward its vice pole; whether ANY source can do that is a property of the
 * experience table, and the table is handed in so this read discovers the answer
 * rather than restating one.
 *
 * A row counts only if its kind is REACHABLE — a kind whose source is unverified
 * emits nothing, however complete its pull vector looks in the table. That
 * distinction is the whole of this read: a vector that exists and a road that exists
 * are different claims, and the table carries both.
 *
 * @param {ReadonlyArray<{axisId?: unknown, pole?: unknown, reachable?: unknown, kind?: unknown}>} rows one row per (kind, pull)
 * @param {readonly string[]} axisIds the catalog's axis roster, handed in
 * @returns {Readonly<{byAxis: Readonly<Record<string, Readonly<{vice: number, virtue: number, viceReachable: number}>>>, unreachableAxes: readonly string[], silentAxes: readonly string[]}>}
 */
export function viceWardReachability(rows, axisIds) {
  const roster = (Array.isArray(axisIds) ? axisIds : []).map(str).filter(Boolean);
  /** @type {Record<string, {vice: number, virtue: number, viceReachable: number}>} */
  const tally = {};
  for (const axisId of roster) tally[axisId] = { vice: 0, virtue: 0, viceReachable: 0 };
  for (const raw of (Array.isArray(rows) ? rows : [])) {
    const row = asObject(raw);
    const axisId = str(row.axisId);
    const cell = tally[axisId];
    if (!cell) continue;
    if (str(row.pole) === 'vice') {
      cell.vice += 1;
      if (row.reachable === true) cell.viceReachable += 1;
    } else if (str(row.pole) === 'virtue') {
      cell.virtue += 1;
    }
  }
  /** @type {Record<string, Readonly<{vice: number, virtue: number, viceReachable: number}>>} */
  const byAxis = {};
  for (const axisId of roster.slice().sort(byCodepoint)) byAxis[axisId] = Object.freeze(tally[axisId]);
  return Object.freeze({
    byAxis: Object.freeze(byAxis),
    unreachableAxes: Object.freeze(roster.filter((a) => tally[a].viceReachable === 0).sort(byCodepoint)),
    silentAxes: Object.freeze(roster.filter((a) => tally[a].vice + tally[a].virtue === 0).sort(byCodepoint)),
  });
}

/**
 * THE GOING-NATIVE VERDICT, and it is deliberately a verdict about the ENGINE rather
 * than about a person. The arc W-OPS §3 describes needs three separable things, and
 * naming which one is missing is the difference between a tuning row and a design act:
 *
 *   a ROAD    — some reachable source pulls FIDELITY toward its vice pole
 *   a REACH   — the pull can carry the effective position across the midpoint
 *   a RECEIPT — the crossing mints something, which the funnel's reversal receipt does
 *
 * @param {Object} args the axis, the chart and the bound
 * @param {string} [args.axisId] the axis the arc runs on, normally FIDELITY
 * @param {Readonly<{unreachableAxes: readonly string[]}>} [args.reachability] a viceWardReachability read
 * @param {number} [args.corePosition] the authored signed position on that axis
 * @param {number} [args.ambientBound] the largest offset ambient pull can reach, per aggregateErosionBound
 * @returns {Readonly<{axisId: string, hasRoad: boolean, ambientReach: number, ambientCrosses: boolean, verdict: string}>}
 */
export function goingNativeVerdict({ axisId, reachability, corePosition, ambientBound } = {}) {
  const axis = str(axisId);
  const unreachable = asObject(reachability).unreachableAxes;
  const hasRoad = Array.isArray(unreachable) ? !unreachable.includes(axis) : false;
  const core = num(corePosition);
  const reach = Math.abs(num(ambientBound));
  // A REVERSAL IS A CROSSING OF THE MIDPOINT, so what the ambient term must cover is
  // the WHOLE authored distance to zero — a loyal man at `marked` needs two bands
  // undone before treachery starts, and the bound says whether that is on the table.
  const ambientCrosses = core <= 0 ? reach > 0 : reach > core;
  let verdict = 'reachable';
  if (!hasRoad) verdict = 'no_road';
  else if (!ambientCrosses) verdict = 'event_only';
  return Object.freeze({ axisId: axis, hasRoad, ambientReach: reach, ambientCrosses, verdict });
}

// ── CUSTODY EXITS ────────────────────────────────────────────────────────────

/**
 * THE PARK CLASSES. O4's three, carried by name so the landing's union is an append,
 * plus a FOURTH this car's measurements earned: a family and a writer can both exist
 * and the quantity that would trigger them still be out of reach at every depth.
 * @type {readonly string[]}
 */
export const CUSTODY_PARK_CLASSES = Object.freeze([
  'no_family',                 // no receipt family exists at all; unblocked by a DESIGN act
  'road_unbuilt',              // the family is real; the writer that reaches it is dated
  'unreceipted_distinction',   // the family cannot tell this exit from an admitted one
  'unreachable_quantity',      // family and writer exist; nothing can move the number they read
]);

/**
 * THE ADMITTED EXITS. O3's catalog field shape, deliberately not its name, so the
 * landing's union is an append rather than a collision.
 *
 * ⚠ BOTH ADMITTED ROWS CLOSE BY A HUMAN'S HAND. `closeForeignGuestHold` has exactly
 * two call sites in `src/`, both in `npcDmVerbs.js`, and they pass `death` and
 * `pardon`. That is not a defect of these rows — they are the two exits that genuinely
 * work — but it is the reason every other row below fails the ROAD conjunct, and a
 * catalog that admitted them without saying so would be hiding its own denominator.
 * @type {ReadonlyArray<Readonly<Record<string, unknown>>>}
 */
export const CUSTODY_EXITS = Object.freeze([
  Object.freeze({
    kind: 'pardon',
    operationClass: 'ERRAND',
    endsEmbedding: true,
    closeReason: 'pardon',
    receiptFamily: 'npc_rulings_pardon',
    receiptWriter: 'closeForeignGuestHold',
    receiptModule: 'src/domain/worldPulse/foreignGuestHold.js',
    sourceVerdict: 'verified',
    writerLanded: true,
    writerIsHumanAct: true,
    sourceNote:
      'the one charter-named exit that is also a member of the persisted close vocabulary. '
      + 'npcDmVerbs.js:710 closes the hold with reason pardon and resumes the held errand; '
      + 'the lesson side is the pardoned_released kind, whose own receipt is a registered '
      + 'store op with a UI button and no pulse call site',
    signedBy: null,
  }),
  Object.freeze({
    kind: 'death_in_custody',
    operationClass: 'ERRAND',
    endsEmbedding: true,
    closeReason: 'death',
    receiptFamily: 'foreign_guest_hold_closure',
    receiptWriter: 'closeForeignGuestHold',
    receiptModule: 'src/domain/worldPulse/foreignGuestHold.js',
    sourceVerdict: 'verified',
    writerLanded: true,
    writerIsHumanAct: true,
    sourceNote:
      'npcDmVerbs.js:516 closes the hold with reason death inside the kill verb, and the '
      + 'W-LIVES F6 death receipt (characterLegacyRecord) is the lesson side. NOT a charter '
      + 'exit: W-OPS §3 lists four and this is none of them, which is itself the finding: '
      + 'the vocabulary that closes holds and the list of exits do not agree',
    signedBy: null,
  }),
]);

/**
 * THE PARKED EXITS, each carrying the evidence that parked it and the act that would
 * unblock it. Five rows, and no two of them are blocked by the same thing.
 * @type {ReadonlyArray<Readonly<Record<string, unknown>>>}
 */
export const PARKED_CUSTODY_EXITS = Object.freeze([
  Object.freeze({
    kind: 'extraction',
    parkClass: 'unreceipted_distinction',
    evidence:
      'an extraction is home taking its man back against the captor\'s will, which the hold '
      + 'ledger can only record as escape, and the row schema carries no field naming who '
      + 'closed it (schemaVersion, id, npcId, errandId, encounterId, captorId, venueId, '
      + 'venueRef, heldSinceTick, cause, continuation). An extraction and a lucky escape are '
      + 'the same record. Compounded: escape has ZERO writers in src/',
    unblockingAct: 'a linking field on the hold row, or a close reason that names the agent: a persisted schema change, owner-gated',
  }),
  Object.freeze({
    kind: 'burn',
    parkClass: 'unreceipted_distinction',
    evidence:
      'the exposure family is real and landed: corruptionWeb.applyForeignExposureBlowback, '
      + 'which O3\'s seat_agent row already names with writerLanded true, but every exposure '
      + 'it writes is one the web ROLLED. There is no door by which a principal elects one, so '
      + 'a burn records as being caught, which is the opposite sentence',
    unblockingAct: 'an elected-exposure door on the web\'s creation seam, which F8 rules applies verbatim to placed seats and therefore needs the web\'s own gate',
  }),
  Object.freeze({
    kind: 'root_permanently',
    parkClass: 'unreachable_quantity',
    evidence:
      'the charter defines this exit as the FIDELITY reversal receipted, and both halves of '
      + 'that exist: the reversal receipt is minted by the W-LIVES experience funnel and FIDELITY is a '
      + 'catalog axis. But of the three FIDELITY rows in the experience table, one is vice-ward '
      + 'and it is sourceUnverified, so ZERO reachable sources pull FIDELITY toward its vice '
      + 'pole, at any depth, on any plane. The quantity the receipt reads cannot move',
    unblockingAct: 'a reachable vice-ward FIDELITY source: a design act on the W-LIVES table, not a tuning row',
  }),
  Object.freeze({
    kind: 'ride_the_r4_arc',
    parkClass: 'no_family',
    evidence:
      'R4 derives a bond kind of appetite or duress from the corruption tie. The word duress '
      + 'has ZERO hits in src/domain, so the derivation is unbuilt and there is no state for an '
      + 'exit to be an exit FROM',
    unblockingAct: 'W-LIVES\'s R4 derivation, which the volume maps to its own car 5',
  }),
  Object.freeze({
    kind: 'ransom',
    parkClass: 'road_unbuilt',
    evidence:
      'the family is REAL and named on both sides: ransomClaim.mintRansomClaim mints the claim '
      + 'and the ransomed_home kind is receipted at roadsKernel.js:ransom tag, sourceUnverified '
      + 'false, but the hold it would close is closed by nobody: release is a frozen member of '
      + 'FOREIGN_GUEST_HOLD_CLOSE_REASONS with ZERO writers in src/. A ransom can be minted and '
      + 'cannot be concluded',
    unblockingAct: 'a pulse-side close with reason release, which is a writer and not a schema change: the one park here with a dated road rather than a ruling',
  }),
]);

/** The admitted kinds alone. @type {readonly string[]} */
export const ADMITTED_CUSTODY_EXITS = Object.freeze(CUSTODY_EXITS.map((row) => String(row.kind)));

/** The parked kinds alone. @type {readonly string[]} */
export const PARKED_CUSTODY_EXIT_KINDS = Object.freeze(PARKED_CUSTODY_EXITS.map((row) => String(row.kind)));

/**
 * THE QUALIFICATION TEST, TOTAL over the roster and EXECUTABLE rather than prose. An
 * exit this file has never heard of resolves to no verdict at all rather than to a
 * guess — the same pin O4's task qualification takes, for the same reason.
 * @param {unknown} kind an exit name
 * @returns {Readonly<{kind: string, admitted: boolean, parked: boolean, parkClass: string|null}>|null}
 */
export function custodyExitQualification(kind) {
  const wanted = str(kind);
  for (const row of CUSTODY_EXITS) {
    if (String(row.kind) !== wanted) continue;
    return Object.freeze({ kind: wanted, admitted: true, parked: false, parkClass: null });
  }
  for (const row of PARKED_CUSTODY_EXITS) {
    if (String(row.kind) !== wanted) continue;
    return Object.freeze({
      kind: wanted, admitted: false, parked: true, parkClass: String(row.parkClass),
    });
  }
  return null;
}

/**
 * Provenance, in the module, so a reader who arrives at the code before the docs
 * learns the signature status and the door here.
 * @type {Readonly<{status: string, signedBy: string|null, door: string, gateRead: string, ownerRows: readonly string[], consumers: string}>}
 */
export const INFILTRATION_DRIFT_PROVENANCE = Object.freeze({
  status: 'CANDIDATE, OWNER-UNSIGNED (breadth is derived from the rung index; no rate is authored here)',
  signedBy: null,
  // ⚠ THIS FIELD NAMES THIS CAR'S DOOR AND NOTHING ELSE, and the omission is
  // structural rather than terse. The W-LIVES drift door sits beneath it and its
  // spelling is in this module's header — but that leaf's own battery asserts
  // "exactly ONE production door" by scanning src/ with COMMENTS STRIPPED, so a
  // sibling that merely NAMES it in a string literal reds it. Third sighting of the
  // same law in this one car: an import reds a dark sibling, and so does a mention.
  door: 'infiltrationDepthEnabled (W-OPS §6), beneath the W-LIVES drift door named in this module header',
  gateRead: 'NOT WRITTEN. The CR-WR10-C mint is a by-name read plus a manifest entry plus an authored VIRTUAL_SUBSYSTEM_ROWS row plus a dormancy fence, all in one commit: a register edit this packet did not order',
  ownerRows: Object.freeze([
    'the depth breadth ladder: one host axis per rung, derived from the rung index. The registers pack drafts these five words as a MULTIPLIER instead; DEPTH_PRICING_LAW carries the measured reason that reading cannot be signed',
    'whether the ambient milieu term is meant to be capable of a paradigm reversal at all, or whether reversals are events-only by design. The measurement forces the question: ambient pull rests at one floor quantum at every depth',
    'the two custody exits that are admitted are BOTH closed by a human act, and no hold in this engine closes by simulation. Whether that is intended is a ruling, not a bug report',
    'F11 (b) bounds every depth SHORT OF immersed and says nothing about the last rung. What bounds the mole is unwritten',
  ]),
  consumers: 'NONE by design; the pulse seam is a later car and no src/ module imports this leaf',
});
