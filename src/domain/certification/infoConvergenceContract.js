/**
 * IN-6's information convergence contract: THE ENVELOPES, each cross-checked against the Endings
 * entries the volume promised it, each carrying a raw-authored band that a tuning-constant mutant
 * moves to red (FP IN-6 U5; DESIGN_FP_INFORMATION.md §5 IN-6 "The envelopes" [CORRECTED
 * 2026-08-02 (fp-audit)]; DESIGN_FP_ARCH_IN.md §IN-6; the compiled block #22). The war and trade
 * convergence contracts are the template (warConvergenceContract.js, tradeConvergenceContract.js).
 *
 * WHAT AN ENVELOPE IS HERE. A measured expectation a lit soak is checked against, never a dial
 * the engine reads: no engine module imports this file, and nothing here touches world state.
 * The program is DONE when these envelopes hold on the owner-signed lit soak (the volume's own
 * words), so this module is the part that is true today: the closed vocabularies, where each
 * ending is produced (or that it is not), the bands, and the evaluator.
 *
 * ⛔ THE BANDS ARE RAW-AUTHORED AND UNSOAKED, in the idiom of WAR_CONVERGENCE_TUNING. They do not
 * live in src/domain/tuning/proposedSoakBands.js, whose gate requires an owner RATIFIED status:
 * putting them there would forge a signature this wave has no authority to give (THE PROMISE:
 * tuning is owner-signed). Each is revisitable with evidence at the signed soak.
 *
 * THE AVAILABILITY OF EVERY ENDING, MEASURED AT THE BUILD TREE (d8fea9898 plus IN-6 U1..U4):
 *   RECEIPTED         a receipt carries it (a news kind or a selected candidate), so a collector
 *                     reading a soak can count it.
 *   SILENT_BY_DESIGN  the producer computes it and deliberately mints no receipt (a refused
 *                     intercept is not an event; the trivial race is silent, J-INF-5; a house's
 *                     exposure is a binary read, J-INF-13).
 *   UNMOUNTED         the producer is built and nothing calls it yet (the sweep, U123).
 *   OWED              no producer exists in the information modules; the row names the wave
 *                     whose Endings entry promised it. The walker reds the day a producer appears,
 *                     so the deferral cannot ghost.
 * Only RECEIPTED endings are graded by default: a share over endings no receipt can carry would
 * grade a corpus the instrument cannot read, so such a mix answers NOT_EXECUTABLE and says why.
 *
 * SPINE REQ 13 (ALIGNMENT): DECLARED EMPTY WITH REASON, an instrument reads no world state and
 * colours no verb. SPINE REQ 14 (THE EDIT VERB): ENGINE-ONLY, RECORDED, a DM-editable envelope
 * would let one campaign rename the words its own certification is graded in.
 *
 * @enforced-by tests/lint/infoConvergenceContract.walker.test.js
 */

/** @typedef {{ module: string, symbol: string, literal?: string }} ProducerAddress */
/**
 * @typedef {Object} InfoEnding
 * @property {string} token          the graded spelling (the BUILT token where one exists)
 * @property {string} volumeToken    the volume's Endings spelling
 * @property {string} availability   one of INFO_ENDING_AVAILABILITY
 * @property {ProducerAddress} [producer]  the module and exported symbol that produce it
 * @property {string} [receipt]      the news kind or candidate type that carries it
 * @property {string} [owedBy]       the wave whose Endings entry promised it (OWED only)
 */
/**
 * @typedef {Object} InfoEnvelope
 * @property {string} id
 * @property {'mix' | 'share' | 'series'} kind
 * @property {string} volumeName     the phrase that names it in the volume's IN-6 list
 * @property {ReadonlyArray<{ wave: string, name: string, tokens: ReadonlyArray<string> }>} volumeGroups
 * @property {ReadonlyArray<InfoEnding>} endings  (mix envelopes only)
 * @property {ProducerAddress | null} producer    (share and series envelopes)
 */

/** @type {ReadonlyArray<string>} */
export const INFO_ENDING_AVAILABILITY = Object.freeze(['OWED', 'RECEIPTED', 'SILENT_BY_DESIGN', 'UNMOUNTED']);

/** @type {ReadonlyArray<string>} */
export const INFO_ENVELOPE_VERDICTS = Object.freeze(['FAIL', 'NOT_EXECUTABLE', 'PASS', 'REGISTRY_STALE']);

/**
 * THE BANDS, one block per envelope so each envelope's mutant moves its own constant.
 * RAW-AUTHORED, UNSOAKED, UNSIGNED (see the header). Shares are 0..1 of the graded endings.
 */
export const INFO_CONVERGENCE_TUNING = Object.freeze({
  /** The desk earns weight, it does not flood: the share of routed Herald items on the knowledge desk. */
  knowledge_share: Object.freeze({ minShare: 0.02, maxShare: 0.2 }),
  /** The lure economy's health; `exposed` must carry real share or the counterforce is decoration. */
  plant: Object.freeze({ minSample: 8, dominanceMaxShare: 0.85, floors: Object.freeze({ exposed: 0.05 }) }),
  /** A corpus where nothing is ever caught means the counter-game never bites. */
  intercept: Object.freeze({ minSample: 8, dominanceMaxShare: 0.9, floors: Object.freeze({ caught: 0.02 }) }),
  /** The share of settlement-weeks paying a non-identity secrecy factor. */
  toll_incidence: Object.freeze({ minShare: 0.01, maxShare: 0.35 }),
  /** Every lure springing means the counterforces are decoration; resisted must carry real share. */
  lure: Object.freeze({ minSample: 6, dominanceMaxShare: 0.8, floors: Object.freeze({ resisted: 0.1 }) }),
  /** `person` rare but present; `story` dominant at distance (the physics). */
  race: Object.freeze({
    minSample: 8,
    dominanceMaxShare: 0.85,
    floors: Object.freeze({ person: 0.01, story: 0.3 }),
    ceilings: Object.freeze({ person: 0.25 }),
  }),
  /** The witch-hunt share is the paranoia health metric. */
  sweep: Object.freeze({ minSample: 6, dominanceMaxShare: 0.85, ceilings: Object.freeze({ false_accusation: 0.5 }) }),
  /** The both-sides drama's health metric. */
  house: Object.freeze({ minSample: 6, dominanceMaxShare: 0.85 }),
  courier_errand: Object.freeze({ minSample: 8, dominanceMaxShare: 0.9 }),
  /** All four closed endings graded (J-INF-16): withdrawn is not dropped. */
  arc: Object.freeze({ minSample: 6, dominanceMaxShare: 0.7, minDistinct: 3 }),
  /** Fog, not blindness: never pinned at exactly one through the whole final window. */
  divergence_sane: Object.freeze({ finalWindowYears: 10, pinnedAt: 1 }),
});

const P = 'src/domain/worldPulse/';

/**
 * @param {string} token @param {string} availability
 * @param {{ volumeToken?: string, producer?: ProducerAddress, receipt?: string, owedBy?: string }} [extra]
 * @returns {InfoEnding}
 */
function ending(token, availability, extra = {}) {
  return Object.freeze({ token, volumeToken: extra.volumeToken || token, availability, ...extra });
}
/** @param {string} module @param {string} symbol @param {string} [literal] @returns {ProducerAddress} */
const at = (module, symbol, literal) => Object.freeze({ module: `${P}${module}`, symbol, ...(literal ? { literal } : {}) });

/**
 * THE ENVELOPES, in the volume's IN-6 list order. `volumeGroups` are the Endings groups each one
 * grades, spelled as the volume spells them; the walker parses the volume and holds the two equal.
 * @type {ReadonlyArray<InfoEnvelope>}
 */
export const INFO_ENVELOPES = Object.freeze([
  Object.freeze({
    id: 'knowledge_share',
    kind: 'share',
    volumeName: 'knowledge-beat share of routed tokens',
    volumeGroups: Object.freeze([]),
    endings: Object.freeze([]),
    // The knowledge desk as the routing table spells it (a value of EXACT_SECTION). Not the
    // section list itself: naming that list makes a file a reader in IN-5's consumer census.
    producer: Object.freeze({ module: 'src/domain/realm/heraldRouting.js', symbol: 'EXACT_SECTION', literal: 'knowledge' }),
  }),
  Object.freeze({
    id: 'plant',
    kind: 'mix',
    volumeName: 'the PLANT outcome mix',
    volumeGroups: Object.freeze([Object.freeze({ wave: 'IN-0a', name: 'plant', tokens: Object.freeze(['took', 'died_quiet', 'exposed', 'backfired']) })]),
    endings: Object.freeze([
      ending('took', 'RECEIPTED', { producer: at('brokeragePlantHandoff.js', 'PLANT_TOOK_KIND', 'plant_took'), receipt: 'plant_took' }),
      ending('died_quiet', 'OWED', { owedBy: 'IN-0a' }),
      ending('exposed', 'RECEIPTED', { producer: at('infoLure.js', 'LIE_OUTCOMES', 'caught'), receipt: 'infowar_lie_exposed' }),
      ending('backfired', 'OWED', { owedBy: 'IN-0a' }),
    ]),
    producer: null,
  }),
  Object.freeze({
    id: 'intercept',
    kind: 'mix',
    volumeName: 'the INTERCEPT outcome mix',
    volumeGroups: Object.freeze([Object.freeze({ wave: 'IN-0b', name: 'intercept', tokens: Object.freeze(['read', 'refused', 'caught']) })]),
    endings: Object.freeze([
      ending('read', 'RECEIPTED', { producer: at('brokerageServices.js', 'INTERCEPT_ENDINGS', 'read'), receipt: 'brokerage_intercept' }),
      ending('refused', 'SILENT_BY_DESIGN', { producer: at('brokerageServices.js', 'INTERCEPT_ENDINGS', 'refused') }),
      ending('caught', 'UNMOUNTED', { producer: at('counterIntelSweep.js', 'SWEEP_OUTCOMES', 'caught') }),
    ]),
    producer: null,
  }),
  Object.freeze({
    id: 'toll_incidence',
    kind: 'share',
    volumeName: 'the TOLL INCIDENCE',
    volumeGroups: Object.freeze([]),
    endings: Object.freeze([]),
    producer: at('secrecyTradeFactor.js', 'secrecyTradeFactorOf'),
  }),
  Object.freeze({
    id: 'lure',
    kind: 'mix',
    volumeName: 'lure outcome mix',
    volumeGroups: Object.freeze([Object.freeze({ wave: 'IN-2', name: 'lure', tokens: Object.freeze(['sprung', 'resisted', 'exposed_first', 'backfired']) })]),
    endings: Object.freeze([
      ending('sprung', 'RECEIPTED', { producer: at('informationNews.js', 'INFORMATION_KIND_REGISTRY', 'lure_sprung'), receipt: 'lure_sprung' }),
      ending('resisted', 'OWED', { owedBy: 'IN-2' }),
      ending('exposed_first', 'OWED', { owedBy: 'IN-2' }),
      ending('backfired', 'OWED', { owedBy: 'IN-2' }),
    ]),
    producer: null,
  }),
  Object.freeze({
    id: 'race',
    kind: 'mix',
    volumeName: 'race outcome mix over the BUILT tokens',
    volumeGroups: Object.freeze([Object.freeze({ wave: 'IN-4', name: 'race', tokens: Object.freeze(['person', 'story', 'together', 'neither']) })]),
    endings: Object.freeze([
      ending('person', 'RECEIPTED', { producer: at('routeNetworkConsumersRace.js', 'RACE_OUTCOMES', 'person'), receipt: 'race_person' }),
      ending('story', 'RECEIPTED', { producer: at('routeNetworkConsumersRace.js', 'RACE_OUTCOMES', 'story'), receipt: 'race_story' }),
      ending('together', 'RECEIPTED', { producer: at('routeNetworkConsumersRace.js', 'RACE_OUTCOMES', 'together'), receipt: 'race_together' }),
      ending('neither', 'SILENT_BY_DESIGN', { producer: at('routeNetworkConsumersRace.js', 'RACE_OUTCOMES', 'neither') }),
    ]),
    producer: null,
  }),
  Object.freeze({
    id: 'sweep',
    kind: 'mix',
    volumeName: 'sweep outcome mix',
    volumeGroups: Object.freeze([Object.freeze({ wave: 'IN-3', name: 'sweep', tokens: Object.freeze(['catch', 'clean_miss', 'witch_hunt']) })]),
    // SR-4 DRIFT, graded in the built spelling (the race precedent): the volume's catch is the
    // built `caught`, its witch_hunt the built `false_accusation` (SWEEP_OUTCOMES).
    endings: Object.freeze([
      ending('caught', 'UNMOUNTED', { volumeToken: 'catch', producer: at('counterIntelSweep.js', 'SWEEP_OUTCOMES', 'caught') }),
      ending('clean_miss', 'UNMOUNTED', { producer: at('counterIntelSweep.js', 'SWEEP_OUTCOMES', 'clean_miss'), receipt: 'sweep_launched' }),
      ending('false_accusation', 'UNMOUNTED', { volumeToken: 'witch_hunt', producer: at('counterIntelSweep.js', 'SWEEP_OUTCOMES', 'false_accusation'), receipt: 'false_accusation' }),
    ]),
    producer: null,
  }),
  Object.freeze({
    id: 'house',
    kind: 'mix',
    volumeName: 'the HOUSE outcome mix',
    volumeGroups: Object.freeze([Object.freeze({ wave: 'IN-3', name: 'house', tokens: Object.freeze(['unmasked', 'weathered', 'ruined_name']) })]),
    endings: Object.freeze([
      ending('unmasked', 'SILENT_BY_DESIGN', { producer: at('patronExposure.js', 'exposedPatronInstitutions') }),
      ending('weathered', 'OWED', { owedBy: 'IN-3' }),
      ending('ruined_name', 'OWED', { owedBy: 'IN-3' }),
    ]),
    producer: null,
  }),
  Object.freeze({
    id: 'courier_errand',
    kind: 'mix',
    volumeName: 'the COURIER ERRAND mix',
    volumeGroups: Object.freeze([Object.freeze({ wave: 'IN-4', name: 'courier errand', tokens: Object.freeze(['delivered', 'intercepted', 'lost', 'turned']) })]),
    endings: Object.freeze([
      ending('delivered', 'OWED', { owedBy: 'IN-4' }),
      ending('intercepted', 'OWED', { owedBy: 'IN-4' }),
      ending('lost', 'OWED', { owedBy: 'IN-4' }),
      ending('turned', 'OWED', { owedBy: 'IN-4' }),
    ]),
    producer: null,
  }),
  Object.freeze({
    id: 'arc',
    kind: 'mix',
    volumeName: 'arc completion histogram',
    // J-INF-16: the arc's endings ARE IN-3's engagement endings plus IN-4's turned.
    volumeGroups: Object.freeze([
      Object.freeze({ wave: 'IN-3', name: 'engagement', tokens: Object.freeze(['burned', 'withdrawn', 'gone_quiet']) }),
      Object.freeze({ wave: 'IN-5', name: 'arc', tokens: Object.freeze(['burned', 'withdrawn', 'gone_quiet']) }),
      Object.freeze({ wave: 'IN-5', name: 'arc', tokens: Object.freeze(['turned']) }),
    ]),
    endings: Object.freeze([
      ending('burned', 'OWED', { owedBy: 'IN-5' }),
      ending('withdrawn', 'OWED', { owedBy: 'IN-5' }),
      ending('gone_quiet', 'OWED', { owedBy: 'IN-5' }),
      ending('turned', 'OWED', { owedBy: 'IN-5' }),
    ]),
    producer: null,
  }),
  Object.freeze({
    id: 'divergence_sane',
    kind: 'series',
    volumeName: 'divergence01 sane',
    volumeGroups: Object.freeze([]),
    endings: Object.freeze([]),
    producer: Object.freeze({ module: 'scripts/audit/behavioral-observation.mjs', symbol: 'observeBeliefDivergence' }),
  }),
]);

/** @param {unknown} v @returns {number} */
function count(v) {
  return typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : 0;
}

/**
 * One envelope's band. A mix reads minSample, dominanceMaxShare and the optional floors, ceilings
 * and minDistinct; a share reads minShare and maxShare; the series reads finalWindowYears and pinnedAt.
 * @typedef {{ minSample?: number, dominanceMaxShare?: number, floors?: Readonly<Record<string, number>>,
 *   ceilings?: Readonly<Record<string, number>>, minDistinct?: number, minShare?: number, maxShare?: number,
 *   finalWindowYears?: number, pinnedAt?: number }} InfoBand
 * @typedef {{ envelope: string, verdict: string, findings: string[], shares?: Record<string, number> }} EnvelopeResult
 * @typedef {{ mixes?: Record<string, Record<string, unknown>>, shares?: Record<string, { numerator?: unknown, denominator?: unknown }>,
 *   series?: Record<string, ReadonlyArray<unknown>> }} InfoObservation
 */

/** @param {number | undefined} v @param {number} fallback @returns {number} */
const dial = (v, fallback) => (typeof v === 'number' && Number.isFinite(v) ? v : fallback);

/**
 * @param {InfoEnvelope} row @param {Record<string, unknown>} counts @param {InfoBand} band
 * @param {ReadonlyArray<string>} graded @returns {EnvelopeResult}
 */
function evaluateMix(row, counts, band, graded) {
  const envelope = row.id;
  const stale = row.endings.filter((e) => !graded.includes(e.token) && count(counts[e.token]) > 0);
  if (stale.length) {
    return { envelope, verdict: 'REGISTRY_STALE', findings: stale.map((e) => `${e.token} carries a count but is ${e.availability}`) };
  }
  if (graded.length < 2) {
    return { envelope, verdict: 'NOT_EXECUTABLE', findings: [`fewer than two graded endings (${graded.join(', ') || 'none'}): no share can be graded`] };
  }
  const total = graded.reduce((n, t) => n + count(counts[t]), 0);
  const minSample = dial(band.minSample, 1);
  if (total < minSample) return { envelope, verdict: 'NOT_EXECUTABLE', findings: [`${total} graded endings, under the sample floor ${minSample}`] };
  /** @type {Record<string, number>} */
  const shares = {};
  for (const t of graded) shares[t] = count(counts[t]) / total;
  /** @type {string[]} */
  const findings = [];
  const dominance = dial(band.dominanceMaxShare, 1);
  for (const t of graded) if (shares[t] > dominance) findings.push(`${t} carries ${shares[t]} of the mix, over ${dominance}`);
  for (const [t, floor] of Object.entries(band.floors || {})) {
    if (graded.includes(t) && shares[t] < floor) findings.push(`${t} carries ${shares[t]}, under its floor ${floor}`);
  }
  for (const [t, ceiling] of Object.entries(band.ceilings || {})) {
    if (graded.includes(t) && shares[t] > ceiling) findings.push(`${t} carries ${shares[t]}, over its ceiling ${ceiling}`);
  }
  const distinct = graded.filter((t) => count(counts[t]) > 0).length;
  const minDistinct = dial(band.minDistinct, 0);
  if (distinct < minDistinct) findings.push(`${distinct} distinct endings observed, under ${minDistinct}`);
  return { envelope, verdict: findings.length ? 'FAIL' : 'PASS', findings, shares };
}

/**
 * Grade ONE envelope over an observation. `graded` overrides the default (the RECEIPTED endings)
 * so a band can be exercised for the day its producers land; the default is the honest reading.
 * @param {InfoEnvelope} row @param {InfoObservation | null | undefined} observation
 * @param {{ tuning?: Readonly<Record<string, InfoBand>>, graded?: ReadonlyArray<string> | null }} [options]
 * @returns {EnvelopeResult}
 */
export function evaluateInfoEnvelope(row, observation, { tuning = INFO_CONVERGENCE_TUNING, graded = null } = {}) {
  const envelope = row.id;
  const band = tuning[row.id] || {};
  if (row.kind === 'mix') {
    const tokens = graded || row.endings.filter((e) => e.availability === 'RECEIPTED').map((e) => e.token);
    return evaluateMix(row, observation?.mixes?.[row.id] || {}, band, tokens);
  }
  if (row.kind === 'share') {
    const raw = observation?.shares?.[row.id] || {};
    const denominator = count(raw.denominator);
    if (denominator < 1) return { envelope, verdict: 'NOT_EXECUTABLE', findings: ['no denominator observed'] };
    const share = count(raw.numerator) / denominator;
    /** @type {string[]} */
    const findings = [];
    if (share < dial(band.minShare, 0)) findings.push(`share ${share} under ${band.minShare}`);
    if (share > dial(band.maxShare, 1)) findings.push(`share ${share} over ${band.maxShare}`);
    return { envelope, verdict: findings.length ? 'FAIL' : 'PASS', findings, shares: { share } };
  }
  const series = (observation?.series?.[row.id] || []).filter((v) => v !== null && v !== undefined);
  if (!series.length) return { envelope, verdict: 'NOT_EXECUTABLE', findings: ['nothing comparable in any year'] };
  const outside = series.filter((v) => typeof v !== 'number' || !(v >= 0 && v <= 1));
  if (outside.length) return { envelope, verdict: 'FAIL', findings: [`${outside.length} readings outside zero to one`] };
  const windowYears = dial(band.finalWindowYears, 1);
  const pinnedAt = dial(band.pinnedAt, 1);
  const window = series.slice(-windowYears);
  const pinned = window.length === windowYears && window.every((v) => v === pinnedAt);
  return { envelope, verdict: pinned ? 'FAIL' : 'PASS', findings: pinned ? [`pinned at ${pinnedAt} through the final ${windowYears} readings`] : [] };
}

/**
 * Grade every envelope, in the registry's order.
 * @param {InfoObservation | null | undefined} observation
 * @param {{ tuning?: Readonly<Record<string, InfoBand>>, graded?: ReadonlyArray<string> | null }} [options]
 * @returns {EnvelopeResult[]}
 */
export function evaluateInfoConvergence(observation, options = {}) {
  return INFO_ENVELOPES.map((row) => evaluateInfoEnvelope(row, observation, options));
}
