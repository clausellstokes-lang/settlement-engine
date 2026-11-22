/**
 * warConvergenceForces.js — WR-9c: amendment L's SIX FORCES, as six graded cells.
 *
 * WHAT THE AMENDMENT ASKED FOR, VERBATIM (DESIGN_WAR_RULINGS_ARCHITECTURE.md, the
 * WR-9 section): "home-front acceleration measured (force 1); capability collapse
 * reachable (force 2, P4's floor); ruler-change frequency rising with war duration
 * (force 3 — the self-accelerating loop, measured); round-over-round band widening
 * monotone (force 4); fragmentation producing pairwise peaces (force 5); terminal
 * resolution rare but present (force 6)."
 *
 * ⛔ NO PERSISTED WORLD STATE, exactly as WR-9's lifecycle clause requires. This
 * module imports nothing from the engine — not one worldPulse module — and reads
 * only the receipt-side observation the collector writes. The engine constants the
 * cells are ABOUT are named in prose here and pinned to their real modules in
 * tests/domain/warConvergenceForces.test.js, so the citation cannot rot into a
 * stale line address while production code stays free of the import edge.
 *
 * ⛔ NOTHING HERE IS RATIFIED. Every number in `WAR_CONVERGENCE_FORCE_TUNING` is
 * RAW-AUTHORED and UNSOAKED, in the same idiom as `WAR_CONVERGENCE_TUNING` beside
 * it. THE PROMISE binds: bands are owner-SIGNED and versioned, and this wave has no
 * authority to sign one.
 *
 * THREE VERDICT STATES, AND WHY THE THIRD ONE EXISTS. A force cell answers PASS,
 * FAIL, or UNOBSERVED. `UNOBSERVED` is NON-PASSING and NON-VACUOUS: it names what
 * is missing rather than scoring a zero, because "the world did not do this" and
 * "nothing in the tree could ever have measured this" call for opposite repairs and
 * must never share a bucket — the same law `warEndingClassifier.js` states for its
 * unclassified reasons. An omitted cell would be worse still: a force nobody can
 * see is a force nobody will build.
 *
 * ⚠️⚠️ THE CERTIFICATE CANNOT PASS WHILE FORCE 3 IS UNOBSERVED, AND THAT IS THE
 * POINT. These ids carry the `war_convergence.` prefix, so they join the group that
 * earns `war_convergence_instrumented`, and an UNOBSERVED cell is non-passing. Force
 * 3 has no substrate at all (below), so the WR-9 property is unearnable until the
 * engine grows one. WR-9 is "the acceptance harness for the whole program: the
 * program is DONE when these envelopes hold on the owner-ordered soak redo, and not
 * before" — a harness that certified around its own blind spot would be the
 * greenwash the wave exists to prevent.
 *
 * THE SUBSTRATE, MEASURED AT 2026-08-04 ON `claude/composite-r4` @ 43b3195b:
 *
 *   FORCE 1 — LIVE. `warCosts.js` amplifies the home-front pressure score by
 *     `durationGain = min(DURATION_GAIN_CAP, age * DURATION_GAIN_PER_TICK)` and
 *     bands the age over `WAR_HOME_FRONT_DURATION_BANDS`
 *     (opening / sustained / protracted). A census can therefore report a mean
 *     pressure per duration band, which is what "acceleration measured" means.
 *
 *   FORCE 2 — LIVE, AND THE BRIEF'S PREMISE WAS WRONG. The lane brief recorded that
 *     force 2 "returned ZERO greps under cannotCampaign / capabilityCollapse /
 *     campaignFloor / CAMPAIGN_FLOOR and may not exist as a declared floor", and
 *     ruled that this cell must state that absence as its finding. RE-MEASURED
 *     HERE, THE FLOOR EXISTS: `demographicsWar.js` — whose own docstring opens
 *     "WAVE P4 (THE WORLD'S HAND)" — declares
 *     `WAR_DEMOGRAPHIC_TUNING.CAPABILITY_FLOOR`, clamps `warCapabilityOf`'s
 *     `capability01` to it, and speaks the collapse sentence ("this realm cannot
 *     feed a season in the field") at `CAPABILITY_FLOOR + 0.05`. The brief's grep
 *     set simply did not contain the constant's real spelling. Authoring
 *     "no declared floor exists" into the acceptance harness would have planted a
 *     FALSE receipt in the one instrument whose whole job is to be believed, so
 *     this cell GRADES reachability instead, and the correction is recorded in
 *     docs/FABLE_VALIDATION_QUEUE.md rather than left in a transcript.
 *
 *   FORCE 3 — NO SUBSTRATE. Seat transitions are real and persisted
 *     (`npcLadderKernel.js` / `npcLadderState.js`, read at `warPeaceDecision.js`),
 *     and a normalized row carries `{id, fromRulerId, toRulerId, cause, tick}` plus
 *     optional faction and war-demand fields. NOT ONE of them names a war, and none
 *     carries the war's age or opening tick — so there is no pair to correlate, and
 *     no census this wave may build can invent one. Giving this force an address in
 *     the observation would imply it is fillable; it is not, so it deliberately has
 *     none. Closing it needs an ENGINE change to a PERSISTED record, which is
 *     owner-gated and which WR-9's own lifecycle clause forbids this wave.
 *
 *   FORCE 4 — LIVE. `compromiseRound.js`'s `widenAcceptance` is documented
 *     "MONOTONE in the round index by construction" and has exactly one consumer.
 *     A census can record each pair's round-over-round `widening01` series, which
 *     is the sequence this cell walks.
 *
 *   FORCE 5 — LIVE MACHINERY, NO CENSUS. `peaceTermsCoalition.js` mints a typed
 *     `coalition_separate_peace` fact and `peaceTerms.js` emits it from three
 *     sites; `coalition_fracture` is a first-class peace reason. What does not
 *     exist is anything that COUNTS the pairwise peaces a fragmentation produced —
 *     a collector obligation, not a substrate absence, which is why this cell has
 *     an address and force 3 does not.
 *
 *   FORCE 6 — LIVE, AND GRADED TODAY. Terminal resolution is read straight off the
 *     endings mix the WR-9 observation already carries, so this cell needs no new
 *     address and answers on the corpus as it stands. Its substrate is partial and
 *     the partiality is disclosed in `WAR_TERMINAL_ENDING_KEYS` below.
 *
 * PURE: no rng, no wall clock, no mutation, no state, no world reads, no imports.
 */

/** @typedef {Record<string, unknown>} UnknownRecord */

/**
 * The six cell ids, in amendment order. The `war_convergence.` prefix is load
 * bearing: it is what puts these cells in the group that earns the
 * `war_convergence_instrumented` property.
 * @type {ReadonlyArray<string>}
 */
export const WAR_CONVERGENCE_FORCE_IDS = Object.freeze([
  'war_convergence.force_1_home_front_acceleration',
  'war_convergence.force_2_capability_collapse_reachable',
  'war_convergence.force_3_ruler_change_rises_with_duration',
  'war_convergence.force_4_compromise_widening_monotone',
  'war_convergence.force_5_fragmentation_pairwise_peaces',
  'war_convergence.force_6_terminal_resolution_rare',
]);

/**
 * The closed verdict vocabulary. `passed` on the returned row is exactly
 * `state === 'PASS'`, so UNOBSERVED can never be mistaken for a pass by a consumer
 * that reads only the boolean.
 * @type {ReadonlyArray<string>}
 */
export const WAR_FORCE_STATES = Object.freeze(['PASS', 'FAIL', 'UNOBSERVED']);

/**
 * The closed reasons a force may be UNOBSERVED. Each is a DISTINCT diagnosis with a
 * DISTINCT repair, and they may never be merged:
 *
 *   `no_substrate_in_tree`   nothing in the engine can produce the reading at all.
 *                            The repair is an engine change, not a collector.
 *   `no_evidence_carried`    the address exists and no receipt filled it. The
 *                            repair is the collector.
 *   `insufficient_spread`    evidence arrived but cannot express the claim (one
 *                            duration band, or a single-round sequence). The repair
 *                            is a longer horizon, not a wider band.
 *   `vocabulary_drift`       the cell was handed a histogram missing a key it
 *                            grades. The repair is the vocabulary.
 * @type {ReadonlyArray<string>}
 */
export const WAR_FORCE_UNOBSERVED_REASONS = Object.freeze([
  'no_substrate_in_tree',
  'no_evidence_carried',
  'insufficient_spread',
  'vocabulary_drift',
]);

/**
 * The home-front duration vocabulary, ORDERED shortest-first. Declared here rather
 * than imported so this leaf keeps zero engine imports; a pin in
 * tests/domain/warConvergenceForces.test.js asserts it is character-identical to
 * `WAR_HOME_FRONT_DURATION_BANDS` in src/domain/worldPulse/warCosts.js, so a rename
 * there reds here instead of silently splitting the vocabulary in two.
 * @type {ReadonlyArray<string>}
 */
export const WAR_FORCE_HOME_FRONT_DURATION_BANDS = Object.freeze([
  'opening',
  'sustained',
  'protracted',
]);

/**
 * The endings that resolve a war TERMINALLY — by removing a belligerent or taking
 * its town — rather than by agreement.
 *
 * ⚠️ THE SUBSTRATE IS PARTIAL AND THAT IS DISCLOSED, NOT HIDDEN. `conquest` rides a
 * real `candidateType` (pulseKernel's siege fork) and both sack roads ride real
 * razing outcomes, but `annihilation` exists NOWHERE in the engine as an emitted
 * token: `warEndingClassifier.js` earns it only from a census-supplied `loserDied`
 * flag. The key is kept in the set anyway, because dropping it would make the
 * terminal share silently understate itself the day the flag starts arriving.
 * @type {ReadonlyArray<string>}
 */
export const WAR_TERMINAL_ENDING_KEYS = Object.freeze([
  'conquest',
  'annihilation',
  'punitive_sack_initiation',
  'punitive_sack_vengeance',
]);

/**
 * ⛔ RAW-AUTHORED, UNSOAKED, UNRATIFIED — the WR-9c force bands (the §7 tuning row's
 * force half). Every number is a first authored guess at the SHAPE the amendment
 * describes, not a measurement. They exist so each force is a number somebody can
 * argue with rather than a sentence nobody can execute.
 */
export const WAR_CONVERGENCE_FORCE_TUNING = Object.freeze({
  /**
   * Acceleration is a COMPARISON, so it needs at least two duration bands to
   * compare. A corpus whose wars all ended inside the opening band has not
   * disproved acceleration; it has failed to reach the question.
   */
  HOME_FRONT_MIN_BANDS_OBSERVED: 2,
  /** "Reachable" is an existence claim: one real collapse reading answers it. */
  CAPABILITY_COLLAPSE_MIN_OBSERVATIONS: 1,
  /**
   * ...but a world where the floor is the ordinary condition has not made collapse
   * reachable, it has made it the weather. Wide because it is unmeasured: this band
   * exists to catch a degenerate world, not to tune a healthy one.
   */
  CAPABILITY_COLLAPSE_MAX_SHARE: 0.5,
  /** One observed compromise series is enough to test monotonicity. */
  COMPROMISE_MIN_SEQUENCES: 1,
  /** A single round has no round-OVER-round to be monotone in. */
  COMPROMISE_MIN_ROUNDS_PER_SEQUENCE: 2,
  /**
   * "Fragmentation producing pairwise peaces": every fragmentation must produce at
   * least one. A fragmentation that produced none is a coalition that dissolved
   * into nothing, which is the failure the force names.
   */
  FRAGMENTATION_MIN_PEACES_PER_FRAGMENTATION: 1,
  /** "Present": at least one terminal resolution in the whole graded corpus. */
  TERMINAL_RESOLUTION_MIN_COUNT: 1,
  /** "Rare": ...and never this large a share of all endings. */
  TERMINAL_RESOLUTION_MAX_SHARE: 0.35,
});

/** @param {unknown} value @returns {UnknownRecord} */
const asRecord = (value) => (
  value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {UnknownRecord} */ (value)
    : {}
);

/** @param {unknown} value @returns {number} */
const asCount = (value) => (Number.isInteger(value) && Number(value) >= 0 ? Number(value) : 0);

/**
 * The additive force address carried by a WR-9 observation. Force 3 has no entry
 * ON PURPOSE (see the header): an address is a promise that a collector could fill
 * it, and nothing in the tree can.
 *
 * Every counter starts at zero and every series starts empty, so an empty address
 * is structurally valid and deliberately INELIGIBLE — each cell answers UNOBSERVED
 * (`no_evidence_carried`) until a collector replaces it with measured evidence.
 */
export function createEmptyWarForceEvidence() {
  return {
    homeFrontByDurationBand: Object.fromEntries(
      WAR_FORCE_HOME_FRONT_DURATION_BANDS.map((band) => [band, { samples: 0, scoreTotal: 0 }]),
    ),
    capabilityReadings: { readings: 0, atCollapse: 0 },
    compromiseWideningSequences: [],
    coalitionFragmentation: { fragmentations: 0, pairwisePeaces: 0 },
  };
}

/**
 * Totality wall over one force address, in the same idiom as the observation's
 * histogram validator: every declared key must be present, no undeclared key may
 * be, and no counter may be negative or fractional. Errors are returned already
 * prefixed with their receipt path so the caller can concatenate them verbatim.
 *
 * @param {unknown} raw
 * @returns {string[]}
 */
export function validateWarForceEvidence(raw) {
  /** @type {string[]} */
  const errors = [];
  const base = 'warConvergence.forceEvidence';
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return [`${base} must be an object.`];
  }
  const evidence = asRecord(raw);
  const expectedTop = new Set([
    'homeFrontByDurationBand',
    'capabilityReadings',
    'compromiseWideningSequences',
    'coalitionFragmentation',
  ]);
  for (const key of Object.keys(evidence)) {
    if (!expectedTop.has(key)) errors.push(`${base} has unknown key ${key}.`);
  }

  const homeFront = evidence.homeFrontByDurationBand;
  if (!homeFront || typeof homeFront !== 'object' || Array.isArray(homeFront)) {
    errors.push(`${base}.homeFrontByDurationBand must be an object.`);
  } else {
    const bands = asRecord(homeFront);
    const expected = new Set(WAR_FORCE_HOME_FRONT_DURATION_BANDS);
    for (const band of WAR_FORCE_HOME_FRONT_DURATION_BANDS) {
      if (!Object.prototype.hasOwnProperty.call(bands, band)) {
        errors.push(`${base}.homeFrontByDurationBand is missing ${band}.`);
        continue;
      }
      const cell = asRecord(bands[band]);
      if (!Number.isInteger(cell.samples) || Number(cell.samples) < 0) {
        errors.push(`${base}.homeFrontByDurationBand.${band}.samples must be a non-negative integer.`);
      }
      if (!Number.isFinite(Number(cell.scoreTotal)) || Number(cell.scoreTotal) < 0) {
        errors.push(`${base}.homeFrontByDurationBand.${band}.scoreTotal must be a finite non-negative number.`);
      }
    }
    for (const band of Object.keys(bands)) {
      if (!expected.has(band)) {
        errors.push(`${base}.homeFrontByDurationBand has unknown key ${band}.`);
      }
    }
  }

  const capability = evidence.capabilityReadings;
  if (!capability || typeof capability !== 'object' || Array.isArray(capability)) {
    errors.push(`${base}.capabilityReadings must be an object.`);
  } else {
    const row = asRecord(capability);
    for (const key of ['readings', 'atCollapse']) {
      if (!Number.isInteger(row[key]) || Number(row[key]) < 0) {
        errors.push(`${base}.capabilityReadings.${key} must be a non-negative integer.`);
      }
    }
    if (Number.isInteger(row.readings) && Number.isInteger(row.atCollapse)
      && Number(row.atCollapse) > Number(row.readings)) {
      errors.push(`${base}.capabilityReadings.atCollapse cannot exceed readings.`);
    }
  }

  const sequences = evidence.compromiseWideningSequences;
  if (!Array.isArray(sequences)) {
    errors.push(`${base}.compromiseWideningSequences must be an array.`);
  } else {
    for (const [index, sequence] of sequences.entries()) {
      if (!Array.isArray(sequence)) {
        errors.push(`${base}.compromiseWideningSequences[${index}] must be an array.`);
        continue;
      }
      if (sequence.some((step) => !Number.isFinite(Number(step)) || Number(step) < 0
        || typeof step !== 'number')) {
        errors.push(
          `${base}.compromiseWideningSequences[${index}] must contain only finite non-negative numbers.`,
        );
      }
    }
  }

  const fragmentation = evidence.coalitionFragmentation;
  if (!fragmentation || typeof fragmentation !== 'object' || Array.isArray(fragmentation)) {
    errors.push(`${base}.coalitionFragmentation must be an object.`);
  } else {
    const row = asRecord(fragmentation);
    for (const key of ['fragmentations', 'pairwisePeaces']) {
      if (!Number.isInteger(row[key]) || Number(row[key]) < 0) {
        errors.push(`${base}.coalitionFragmentation.${key} must be a non-negative integer.`);
      }
    }
  }

  return errors;
}

/**
 * Fold every case's force address into one corpus-wide reading. Counters add and
 * series concatenate: a compromise sequence belongs to ONE pair in ONE case, so
 * merging two cases' series must never merge their rounds.
 *
 * @param {unknown[]} rawEvidences
 */
function foldForceEvidence(rawEvidences) {
  const homeFront = Object.fromEntries(
    WAR_FORCE_HOME_FRONT_DURATION_BANDS.map((band) => [band, { samples: 0, scoreTotal: 0 }]),
  );
  const capability = { readings: 0, atCollapse: 0 };
  /** @type {number[][]} */
  const sequences = [];
  const fragmentation = { fragmentations: 0, pairwisePeaces: 0 };
  for (const raw of Array.isArray(rawEvidences) ? rawEvidences : []) {
    const evidence = asRecord(raw);
    const bands = asRecord(evidence.homeFrontByDurationBand);
    for (const band of WAR_FORCE_HOME_FRONT_DURATION_BANDS) {
      const cell = asRecord(bands[band]);
      homeFront[band].samples += asCount(cell.samples);
      const total = Number(cell.scoreTotal);
      homeFront[band].scoreTotal += Number.isFinite(total) && total > 0 ? total : 0;
    }
    const readings = asRecord(evidence.capabilityReadings);
    capability.readings += asCount(readings.readings);
    capability.atCollapse += asCount(readings.atCollapse);
    for (const sequence of Array.isArray(evidence.compromiseWideningSequences)
      ? evidence.compromiseWideningSequences : []) {
      if (Array.isArray(sequence)) {
        sequences.push(sequence.map((step) => (typeof step === 'number' && Number.isFinite(step) ? step : 0)));
      }
    }
    const fractures = asRecord(evidence.coalitionFragmentation);
    fragmentation.fragmentations += asCount(fractures.fragmentations);
    fragmentation.pairwisePeaces += asCount(fractures.pairwisePeaces);
  }
  return { homeFront, capability, sequences, fragmentation };
}

/**
 * @param {string} id
 * @param {string} label
 * @param {string} state one of WAR_FORCE_STATES
 * @param {string} unobservedReason '' unless state is UNOBSERVED
 * @param {unknown} observed
 * @param {unknown} threshold
 */
function forceRow(id, label, state, unobservedReason, observed, threshold) {
  return {
    id,
    label,
    // The boolean and the state can never disagree: UNOBSERVED is not a pass, and a
    // consumer that reads only `passed` still gets the honest answer.
    passed: state === 'PASS',
    state,
    unobservedReason: state === 'UNOBSERVED' ? unobservedReason : '',
    observed,
    threshold,
  };
}

/** @param {{samples:number, scoreTotal:number}} cell @returns {number|null} */
const meanOf = (cell) => (cell.samples > 0 ? cell.scoreTotal / cell.samples : null);

/**
 * FORCE 1 — the home front degrades FASTER the longer a war runs. Graded as a mean
 * pressure per duration band that never falls as the band lengthens; a corpus that
 * only ever reached one band answers `insufficient_spread` rather than passing on a
 * comparison it never made.
 * @param {Record<string, {samples:number, scoreTotal:number}>} homeFront
 */
function force1(homeFront) {
  const T = WAR_CONVERGENCE_FORCE_TUNING;
  const byBand = Object.fromEntries(WAR_FORCE_HOME_FRONT_DURATION_BANDS.map((band) => [
    band,
    { samples: homeFront[band].samples, scoreTotal: homeFront[band].scoreTotal, meanScore: meanOf(homeFront[band]) },
  ]));
  const observedBands = WAR_FORCE_HOME_FRONT_DURATION_BANDS
    .filter((band) => homeFront[band].samples > 0);
  const samples = WAR_FORCE_HOME_FRONT_DURATION_BANDS
    .reduce((total, band) => total + homeFront[band].samples, 0);
  /** @type {string[]} */
  const inversions = [];
  for (let index = 1; index < observedBands.length; index += 1) {
    const previous = Number(byBand[observedBands[index - 1]].meanScore);
    const current = Number(byBand[observedBands[index]].meanScore);
    if (current < previous) inversions.push(`${observedBands[index - 1]}->${observedBands[index]}`);
  }
  const observed = { samples, bandsObserved: observedBands, byBand, inversions };
  const threshold = {
    minBandsObserved: T.HOME_FRONT_MIN_BANDS_OBSERVED,
    orderedBands: WAR_FORCE_HOME_FRONT_DURATION_BANDS,
    engineSubstrate: 'warCosts.js durationGain amplifies the pressure score by war age; warHomeFrontDurationBand names the band',
    ratified: false,
  };
  const label = 'force 1 — the home front degrades faster the longer a war runs';
  const id = WAR_CONVERGENCE_FORCE_IDS[0];
  if (samples === 0) {
    return forceRow(id, label, 'UNOBSERVED', 'no_evidence_carried', observed, threshold);
  }
  if (observedBands.length < T.HOME_FRONT_MIN_BANDS_OBSERVED) {
    return forceRow(id, label, 'UNOBSERVED', 'insufficient_spread', observed, threshold);
  }
  return forceRow(id, label, inversions.length === 0 ? 'PASS' : 'FAIL', '', observed, threshold);
}

/**
 * FORCE 2 — a realm CAN be starved out of the field. Graded as reachability: the
 * collapse state must be reached at least once and must not be the ordinary
 * condition. See the header for why this cell grades rather than reporting the
 * absence the lane brief expected.
 * @param {{readings:number, atCollapse:number}} capability
 */
function force2(capability) {
  const T = WAR_CONVERGENCE_FORCE_TUNING;
  const share = capability.readings > 0 ? capability.atCollapse / capability.readings : 0;
  const observed = { readings: capability.readings, atCollapse: capability.atCollapse, collapseShare: share };
  const threshold = {
    minCollapseObservations: T.CAPABILITY_COLLAPSE_MIN_OBSERVATIONS,
    maxCollapseShare: T.CAPABILITY_COLLAPSE_MAX_SHARE,
    engineSubstrate: "demographicsWar.js WAR_DEMOGRAPHIC_TUNING.CAPABILITY_FLOOR clamps warCapabilityOf; warCapabilityClause speaks the collapse sentence within 0.05 of it",
    ratified: false,
  };
  const label = 'force 2 — capability collapse is reachable without being the weather';
  const id = WAR_CONVERGENCE_FORCE_IDS[1];
  if (capability.readings === 0) {
    return forceRow(id, label, 'UNOBSERVED', 'no_evidence_carried', observed, threshold);
  }
  const passed = capability.atCollapse >= T.CAPABILITY_COLLAPSE_MIN_OBSERVATIONS
    && share <= T.CAPABILITY_COLLAPSE_MAX_SHARE;
  return forceRow(id, label, passed ? 'PASS' : 'FAIL', '', observed, threshold);
}

/**
 * FORCE 3 — ruler changes grow more frequent the longer a war runs. STRUCTURALLY
 * UNOBSERVED: a seat-transition row names its rulers, its cause and its tick, and
 * names no war and no war age, so the correlation has no pair to be computed from.
 * The repair is an engine change to a persisted record, which is owner-gated and
 * which WR-9's lifecycle clause forbids this wave.
 */
function force3() {
  return forceRow(
    WAR_CONVERGENCE_FORCE_IDS[2],
    'force 3 — ruler-change frequency rises with war duration',
    'UNOBSERVED',
    'no_substrate_in_tree',
    {
      halfPresent: 'seat transitions are persisted and normalized (npcLadderState.js), and read at warPeaceDecision.js',
      halfMissing: 'no seat-transition row carries a war id, a war age, or a war opening tick, so no census can pair a transition with a duration',
      measuredAt: '2026-08-04',
    },
    {
      requiresEngineChange: true,
      forbiddenThisWave: 'WR-9 adds NO persisted world state (the amendment L lifecycle clause)',
      ownerGated: 'a new field on a persisted record is a persistence-shape decision',
    },
  );
}

/**
 * FORCE 4 — every failed compromise round widens the acceptance band, and it never
 * narrows. Graded by WALKING each recorded series, so the catching power lives in
 * this cell and not in whatever produced the number: a narrowing series reds here.
 * @param {number[][]} sequences
 */
function force4(sequences) {
  const T = WAR_CONVERGENCE_FORCE_TUNING;
  const gradable = sequences.filter((series) => series.length >= T.COMPROMISE_MIN_ROUNDS_PER_SEQUENCE);
  /** @type {Array<{sequence:number, step:number, from:number, to:number}>} */
  const narrowings = [];
  for (const [index, series] of gradable.entries()) {
    for (let step = 1; step < series.length; step += 1) {
      if (series[step] < series[step - 1]) {
        narrowings.push({ sequence: index, step, from: series[step - 1], to: series[step] });
      }
    }
  }
  const observed = {
    sequencesObserved: sequences.length,
    sequencesGraded: gradable.length,
    roundsGraded: gradable.reduce((total, series) => total + series.length, 0),
    narrowings,
  };
  const threshold = {
    minSequences: T.COMPROMISE_MIN_SEQUENCES,
    minRoundsPerSequence: T.COMPROMISE_MIN_ROUNDS_PER_SEQUENCE,
    maxNarrowings: 0,
    engineSubstrate: 'compromiseRound.js widenAcceptance, documented monotone in the round index by construction',
    ratified: false,
  };
  const label = 'force 4 — the acceptance band widens round over round and never narrows';
  const id = WAR_CONVERGENCE_FORCE_IDS[3];
  if (sequences.length < T.COMPROMISE_MIN_SEQUENCES) {
    return forceRow(id, label, 'UNOBSERVED', 'no_evidence_carried', observed, threshold);
  }
  if (gradable.length === 0) {
    return forceRow(id, label, 'UNOBSERVED', 'insufficient_spread', observed, threshold);
  }
  return forceRow(id, label, narrowings.length === 0 ? 'PASS' : 'FAIL', '', observed, threshold);
}

/**
 * FORCE 5 — a coalition that fragments leaves pairwise peaces behind it. The
 * machinery is live on both halves; what the tree has never had is the count, so
 * this cell has an address and answers `no_evidence_carried` until a collector
 * fills it.
 * @param {{fragmentations:number, pairwisePeaces:number}} fragmentation
 */
function force5(fragmentation) {
  const T = WAR_CONVERGENCE_FORCE_TUNING;
  const required = fragmentation.fragmentations * T.FRAGMENTATION_MIN_PEACES_PER_FRAGMENTATION;
  const observed = {
    fragmentations: fragmentation.fragmentations,
    pairwisePeaces: fragmentation.pairwisePeaces,
    peacesPerFragmentation: fragmentation.fragmentations > 0
      ? fragmentation.pairwisePeaces / fragmentation.fragmentations
      : null,
    requiredPairwisePeaces: required,
  };
  const threshold = {
    minPeacesPerFragmentation: T.FRAGMENTATION_MIN_PEACES_PER_FRAGMENTATION,
    engineSubstrate: "peaceTermsCoalition.js mints the coalition_separate_peace fact; coalition_fracture is a live peace reason",
    ratified: false,
  };
  const label = 'force 5 — a fragmenting coalition leaves pairwise peaces behind it';
  const id = WAR_CONVERGENCE_FORCE_IDS[4];
  if (fragmentation.fragmentations === 0 && fragmentation.pairwisePeaces === 0) {
    return forceRow(id, label, 'UNOBSERVED', 'no_evidence_carried', observed, threshold);
  }
  // A pairwise peace with no fragmentation behind it is incoherent evidence, not an
  // absence: something counted one half of the pair and not the other.
  const passed = fragmentation.fragmentations > 0 && fragmentation.pairwisePeaces >= required;
  return forceRow(id, label, passed ? 'PASS' : 'FAIL', '', observed, threshold);
}

/**
 * FORCE 6 — wars end terminally sometimes, and only sometimes. Read straight off
 * the endings mix the observation already carries, so this cell grades the corpus
 * as it stands rather than waiting on a new address.
 * @param {Record<string, number>} endingTotals
 * @param {number} endingsObserved
 */
function force6(endingTotals, endingsObserved) {
  const T = WAR_CONVERGENCE_FORCE_TUNING;
  const missingKeys = WAR_TERMINAL_ENDING_KEYS
    .filter((key) => !Object.prototype.hasOwnProperty.call(endingTotals, key));
  const terminalCount = WAR_TERMINAL_ENDING_KEYS
    .reduce((total, key) => total + (Number(endingTotals[key]) || 0), 0);
  const share = endingsObserved > 0 ? terminalCount / endingsObserved : 0;
  const observed = {
    terminalKeys: WAR_TERMINAL_ENDING_KEYS,
    terminalCount,
    endingsObserved,
    terminalShare: share,
    missingKeys,
  };
  const threshold = {
    minTerminalCount: T.TERMINAL_RESOLUTION_MIN_COUNT,
    maxTerminalShare: T.TERMINAL_RESOLUTION_MAX_SHARE,
    substratePartial: "annihilation has no engine token; it is earned only from a census-supplied loserDied flag",
    ratified: false,
  };
  const label = 'force 6 — terminal resolution is rare but present';
  const id = WAR_CONVERGENCE_FORCE_IDS[5];
  if (missingKeys.length > 0) {
    return forceRow(id, label, 'UNOBSERVED', 'vocabulary_drift', observed, threshold);
  }
  if (endingsObserved === 0) {
    return forceRow(id, label, 'UNOBSERVED', 'no_evidence_carried', observed, threshold);
  }
  const passed = terminalCount >= T.TERMINAL_RESOLUTION_MIN_COUNT
    && share <= T.TERMINAL_RESOLUTION_MAX_SHARE;
  return forceRow(id, label, passed ? 'PASS' : 'FAIL', '', observed, threshold);
}

/**
 * Grade all six forces over one corpus.
 *
 * TOTALITY (the force-side arm of the collector-totality obligation): the returned
 * array is ALWAYS exactly `WAR_CONVERGENCE_FORCE_IDS.length` rows, in declared
 * order, and every row's `state` names a cell of `WAR_FORCE_STATES`. A force can be
 * PASS, FAIL or UNOBSERVED; it can never be missing, and a missing force is the one
 * failure mode this shape makes impossible.
 *
 * WHEN THE RECEIPT SHAPE ITSELF FAILED, nothing here may claim to have read
 * anything: `shapePassed` false routes every gradable cell to
 * `no_evidence_carried`, because a corpus the address wall rejected has not
 * supplied evidence, it has supplied a defect.
 *
 * @param {{
 *   shapePassed?: boolean,
 *   forceEvidences?: unknown[],
 *   endingTotals?: Record<string, number>,
 *   endingsObserved?: number,
 * }} input
 */
export function evaluateWarConvergenceForces(input) {
  const args = asRecord(input);
  const shapePassed = args.shapePassed === true;
  const folded = foldForceEvidence(
    shapePassed ? /** @type {unknown[]} */ (args.forceEvidences) : [],
  );
  const endingTotals = shapePassed
    ? /** @type {Record<string, number>} */ (asRecord(args.endingTotals))
    : {};
  const endingsObserved = shapePassed ? Number(args.endingsObserved) || 0 : 0;
  return [
    force1(folded.homeFront),
    force2(folded.capability),
    force3(),
    force4(folded.sequences),
    force5(folded.fragmentation),
    force6(
      shapePassed
        ? endingTotals
        : Object.fromEntries(WAR_TERMINAL_ENDING_KEYS.map((key) => [key, 0])),
      endingsObserved,
    ),
  ];
}
