/**
 * mediationPressure.js — GR-6: MEDIATION GENERALIZED (flag `mediationGeneralizedEnabled`;
 * docs/DESIGN_FP_ARCH_GR.md §5 GR-6, J-GRC-3; docs/DESIGN_FP_GRAMMAR.md §GR-6; R-25).
 *
 * The broker before the blood. `peaceTermsGraph.js :: findCrossPressuredMediator` has always
 * named a neutral third torn between two courts, but only at a war's EXIT. This leaf gives the
 * same finder — THE ONE FINDER, never a second algorithm (J-GR-6) — two new occasions, and it is
 * the only module that knows about either:
 *
 *   OCCASION 1, THE INTENT STAGE. A court's seat that resolved to march leaves an ORDER in
 *   `spatialLedgers.warIntents` (warIntent.js — the deposit). The ONE war opener consumes that
 *   order at its CONQUEST_MARGIN soft gate, and waives the gate for the ordered target because a
 *   real deliberation superseded it. When a cross-pressured neighbour stands between the pair,
 *   `mediationPressureFor` hands the opener a BOUNDED multiplier below one (the embassy suit's
 *   deposit-and-consume idiom, `roads/embassyLedger.js`, pointed the other way): the waiver is
 *   lifted and the gate is read at the scaled strength. ×1 EXACTLY when the layer is dark, when no
 *   order names the target, or when no broker stands, so the dormant opener is byte-identical.
 *   ⛔ NEVER FORCES: the multiplier scales one soft comparison and nothing else. Every hard gate
 *   still runs, a strong enough court still marches, and a pair with no order is untouched.
 *
 *   THE WAR THAT DID NOT HAPPEN. `WAR_INTENT_TTL_TICKS` is the window of one deliberation. At the
 *   treaty stage of the tick an order reaches that age still standing — neither obeyed (the apply
 *   pass consumes an obeyed order) nor re-stamped (a renewed order is a new deliberation) — it can
 *   no longer open, and when a broker stood between the pair the leaf mints ONE `brokered_back`
 *   receipt naming the broker, and the broker earns the same two-edge trust the war-exit broker
 *   does (`peaceTermsOverlay.js :: accrueMediationTrust`, reused — never re-spelled).
 *
 *   OCCASION 2, THE FRAYING PACT. A live treaty whose `frayingTermOf` read names a term slipping
 *   toward default, with a broker between its parties, has this tick's strain accrual softened by
 *   one banded notch — a smaller notch when the record was ALREADY strained before this tick
 *   (`pactAmendment.js :: worstObservedEverOf`, which answers 'honored' where GR-5A's renewal
 *   memory never lit) — and the broker earns the two-edge trust once, on the tick
 *   the pact first frays. GR-5's renewal round is not built, so the soften arm is the only arm.
 *
 * THE EDITOR (L10; SR-2): the direction `offer-good-offices` and the predicate `warIntentLive` are
 * DEFINED here in their registries' row shapes and proven headless. GR-6-c: the consumer lands
 * when U123 composes the direction transport. The direction's one payload field is the pair,
 * drawn from the live-pair pool, so it can name WHICH pressure and never an outcome.
 *
 * NO NEW STATE (L4): occasions read the intent and treaty ledgers and write only through the
 * overlay's own trust writer. No draw anywhere (L1): the finder is a codepoint scan.
 *
 * @enforced-by tests/domain/mediationGeneralizedGr6.test.js
 */
import { getSpatialLedger } from '../spatial/distanceRead.js';
import { WAR_INTENT_LEDGER_KEY, WAR_INTENT_TTL_TICKS, warIntentFor } from './warIntent.js';
import { reasonPairKey } from './warReasonTaxonomy.js';
import { pendingActorMajorFor } from './actorMajorApproval.js';
import { findCrossPressuredMediator } from './peaceTermsGraph.js';
import { accrueMediationTrust, accrueStrainResentment } from './peaceTermsOverlay.js';
import { frayingTermOf } from './peaceTermsDocument.js';
import { worstObservedEverOf } from './pactAmendment.js';
import { grammarReceipt } from './grammarNews.js';
import { stablePart } from './stablePart.js';

/** @typedef {import('./peaceTermsCatalog.js').TreatyRecord} TreatyRecord */
/** @typedef {import('./warIntent.js').WarIntentRecord} WarIntentRecord */
/** @typedef {{ byId?: Map<string, Record<string, unknown>> } | null | undefined} BrokerSnapshot */

/**
 * THE BANDS — DRAFT, unsigned (the chair's refreeze signs them). `intentPressureW` is the share of
 * the would-be besieger's strength the broker's pressure takes off the soft comparison; the two
 * soften notches are the share of one tick's strain burden a broker takes off a fraying pact,
 * clean record then slipped record; severity and score are the GR-0 lifecycle voice's weight for
 * a beat above routine (`treatyLifecycleVoice.js :: presentationWeight`), re-read for this kind.
 */
export const MEDIATION_TUNING = Object.freeze({
  intentPressureW: 0.15,
  fraySoften: 0.5,
  fraySoftenSlipped: 0.25,
  beatSeverity: 0.56,
  beatScore: 58,
});

/** The receipt kind "the war that did not happen" (annex `# GR-6`, `brokered_back`). */
export const BROKERED_BACK_KIND = 'brokered_back';

/** @param {unknown} v @returns {Record<string, unknown>} */
function recordOf(v) {
  return v != null && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {string} a @param {string} b @returns {number} */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * THE GATE, read BY NAME and strict. A CONJUNCTION with the peace engine's two keys, read as
 * `warIntent.treatyEligibleWarTargets` reads them: every occasion speaks through the treaty stage,
 * which is dark without the peace engine, so a pressure lit without it would hold wars back with
 * no receipt anywhere.
 * @param {unknown} worldState @returns {boolean}
 */
export function mediationGeneralizedActive(worldState) {
  const rules = recordOf(recordOf(worldState).simulationRules);
  return rules.mediationGeneralizedEnabled === true && rules.warLayerEnabled === true && rules.peaceEngineEnabled === true;
}

/** @param {unknown} graph @returns {Array<Record<string, unknown>>} */
function edgesOf(graph) {
  const edges = recordOf(graph).edges;
  return Array.isArray(edges) ? edges : [];
}

/**
 * OCCASION 1 — the multiplier the opener's soft gate reads for ONE candidate target.
 * @param {unknown} worldState @param {BrokerSnapshot} snapshot @param {unknown} graph
 * @param {string|number} fromId @param {string|number} targetId @param {WarIntentRecord|null|undefined} intent
 * @returns {number} 1 exactly, or the bounded pressure below it
 */
export function mediationPressureFor(worldState, snapshot, graph, fromId, targetId, intent) {
  if (!intent || intent.targetId !== String(targetId) || !mediationGeneralizedActive(worldState)) return 1;
  const broker = findCrossPressuredMediator(snapshot, { edges: edgesOf(graph) }, String(fromId), String(targetId));
  return broker ? 1 - MEDIATION_TUNING.intentPressureW : 1;
}

/** @param {BrokerSnapshot} snapshot @param {string} id @returns {string} */
function nameOf(snapshot, id) {
  const item = recordOf(snapshot?.byId?.get?.(id));
  const name = item.name ?? recordOf(item.settlement).name;
  return typeof name === 'string' && name.trim() && name.trim() !== id ? name.trim() : '';
}

/**
 * THE RECEIPT. `{settlement}` is the broker and the two `{counterpart}` fills are the pair in the
 * receipt's party order (the annex's slot convention), the second carried as `counterpartSecond`.
 * The calendar season is the context the one seasonal family is honest under. `cause` is the
 * cause row (L10): present only when a decree caused the pressure — structurally absent until
 * slot GR-6-c lands — and never defaulted.
 * @param {{ tick: number, brokerId: string, brokerName: string, besiegerId: string, besiegerName: string,
 *   targetId: string, targetName: string, season?: string, cause?: string }} a
 * @returns {Record<string, unknown>|null}
 */
export function brokeredBackBeat(a) {
  if (!a.brokerName || !a.besiegerName || !a.targetName) return null;
  const interp = { settlement: a.brokerName, counterpart: a.besiegerName, counterpartSecond: a.targetName };
  const sourceEventId = `${a.brokerId}.${a.besiegerId}.${a.targetId}.${a.tick}`;
  const line = grammarReceipt(BROKERED_BACK_KIND, sourceEventId, interp, a.season || null);
  if (!line) return null;
  return {
    id: `wizard_news.${a.tick}.${BROKERED_BACK_KIND}.${stablePart(a.brokerId)}.${stablePart(a.besiegerId)}.${stablePart(a.targetId)}`,
    kind: BROKERED_BACK_KIND,
    impactKind: 'brokered_back',
    significance: line.significance,
    severity: MEDIATION_TUNING.beatSeverity,
    score: MEDIATION_TUNING.beatScore,
    tick: a.tick,
    scope: 'regional',
    headline: `The march ${a.besiegerName} ordered on ${a.targetName} never set out`,
    summary: line.line,
    reasons: [`${a.brokerName} stood between the two courts, bound to each by a different tie, until the order lapsed unopened.`],
    settlementIds: [a.brokerId, a.besiegerId, a.targetId],
    settlementNames: [a.brokerName, a.besiegerName, a.targetName],
    parties: [a.besiegerId, a.targetId],
    familyId: line.familyId,
    audience: line.audience,
    section: line.section,
    tags: ['world_pulse', 'pact_grammar', 'mediation'],
    ...(a.cause ? { cause: a.cause } : {}),
  };
}

/**
 * THE WAR THAT DID NOT HAPPEN — every order whose window closes THIS tick still standing, with a
 * broker between the pair. An army already marching on the target, or a siege held before the
 * table, is a war still possible and is never told as one that did not happen.
 * @param {{ worldState: Record<string, unknown>, snapshot: BrokerSnapshot, graph: unknown, tick: number, now?: unknown }} args
 * @returns {{ worldState: Record<string, unknown>, newsEntries: Array<Record<string, unknown>> }}
 */
export function brokeredWarsThatDidNotHappen({ worldState, snapshot, graph, tick, now = null }) {
  const edges = edgesOf(graph);
  const deployments = recordOf(worldState.deployments);
  const season = String(recordOf(worldState.calendar).season || '');
  let state = worldState;
  /** @type {Array<Record<string, unknown>>} */
  const newsEntries = [];
  for (const besiegerId of Object.keys(recordOf(getSpatialLedger(worldState, WAR_INTENT_LEDGER_KEY))).sort(codepoint)) {
    const intent = warIntentFor(worldState, besiegerId, tick);
    if (!intent || Number(tick) - intent.tick !== WAR_INTENT_TTL_TICKS) continue;
    if (recordOf(deployments[besiegerId]).targetId != null || pendingActorMajorFor(worldState, 'strategy_deploy', besiegerId)) continue;
    const broker = findCrossPressuredMediator(snapshot, { edges }, besiegerId, intent.targetId);
    if (!broker) continue;
    state = accrueMediationTrust(state, edges, broker.id, besiegerId, intent.targetId, now);
    const beat = brokeredBackBeat({
      tick: Number(tick), brokerId: broker.id, brokerName: nameOf(snapshot, broker.id), besiegerId,
      besiegerName: nameOf(snapshot, besiegerId), targetId: intent.targetId, targetName: nameOf(snapshot, intent.targetId), season,
    });
    if (beat) newsEntries.push(beat);
  }
  return { worldState: state, newsEntries };
}

/**
 * The treaty stage's one head line: folds the pass onto the succession answer's result, and
 * returns THAT RESULT BY REFERENCE when the layer is dark or nothing closed.
 * @param {{ worldState: Record<string, unknown>, newsEntries: Array<Record<string, unknown>> }} result
 * @param {{ snapshot: BrokerSnapshot, graph: unknown, tick: number, now?: unknown }} args
 * @returns {{ worldState: Record<string, unknown>, newsEntries: Array<Record<string, unknown>> }}
 */
export function withBrokeredWars(result, args) {
  if (!mediationGeneralizedActive(result.worldState)) return result;
  const pass = brokeredWarsThatDidNotHappen({ ...args, worldState: result.worldState });
  if (pass.worldState === result.worldState && pass.newsEntries.length === 0) return result;
  return { ...result, worldState: pass.worldState, newsEntries: [...result.newsEntries, ...pass.newsEntries] };
}

/**
 * OCCASION 2 — the strain accrual, softened where a broker stands between a fraying pact's
 * parties. Dark, not fraying, or no broker: `accrueStrainResentment` with the caller's own
 * arguments, verbatim.
 * @param {{ worldState: Record<string, unknown>, edges: Array<Record<string, unknown>>, snapshot: BrokerSnapshot,
 *   treaty: TreatyRecord, previous?: unknown, loserId: string, victorId: string, burden01: number, tick: number, now?: unknown }} a
 * @returns {Record<string, unknown>}
 */
export function mediatedStrainAccrual(a) {
  const fraying = mediationGeneralizedActive(a.worldState)
    && frayingTermOf(Array.isArray(a.treaty.terms) ? a.treaty.terms : [], a.tick, a.treaty) !== null;
  const broker = fraying ? findCrossPressuredMediator(a.snapshot, { edges: a.edges }, a.victorId, a.loserId) : null;
  if (!broker) return accrueStrainResentment(a.worldState, a.edges, a.loserId, a.victorId, a.burden01, a.now, a.treaty);
  const notch = worstObservedEverOf(a.previous) === 'honored' ? MEDIATION_TUNING.fraySoften : MEDIATION_TUNING.fraySoftenSlipped;
  const strained = accrueStrainResentment(a.worldState, a.edges, a.loserId, a.victorId, a.burden01 * (1 - notch), a.now, a.treaty);
  const firstFray = a.previous != null && String(recordOf(a.previous).complianceState || 'honored') === 'honored';
  return firstFray ? accrueMediationTrust(strained, a.edges, broker.id, a.victorId, a.loserId, a.now) : strained;
}

// ── THE EDITOR'S ROWS (defined here, composed by the chair at U123; SR-2) ─────────────────────

/** The direction's op type, in the catalogue's kebab spelling. */
export const GOOD_OFFICES_OP_TYPE = 'offer-good-offices';
/** The predicate id the direction requires. */
export const WAR_INTENT_LIVE = 'warIntentLive';
/** The pool the direction's pair is drawn from: the live, brokered pairs. */
export const MEDIATION_PAIR_POOL = 'mediation.livePair';

/**
 * Every live order whose pair a broker stands between, as `{ pair, broker, parties }`, keyed by
 * the directed war-pair spelling (`warReasonTaxonomy.js :: reasonPairKey`), codepoint-ordered.
 * @param {unknown} worldState @param {BrokerSnapshot} snapshot @param {unknown} graph
 * @returns {Array<{ pair: string, broker: string, parties: [string, string] }>}
 */
function brokeredIntents(worldState, snapshot, graph) {
  if (!mediationGeneralizedActive(worldState)) return [];
  const world = recordOf(worldState);
  const tick = Number(world.tick) || 0;
  /** @type {Array<{ pair: string, broker: string, parties: [string, string] }>} */
  const out = [];
  for (const besiegerId of Object.keys(recordOf(getSpatialLedger(world, WAR_INTENT_LEDGER_KEY))).sort(codepoint)) {
    const intent = warIntentFor(world, besiegerId, tick);
    const broker = intent ? findCrossPressuredMediator(snapshot, { edges: edgesOf(graph) }, besiegerId, intent.targetId) : null;
    if (intent && broker) out.push({ pair: reasonPairKey(besiegerId, intent.targetId), broker: broker.id, parties: [besiegerId, intent.targetId] });
  }
  return out;
}

/**
 * The live-pair pool the direction's `pair` resolves against (`resolveDecree`'s pools bag).
 * @param {unknown} worldState @param {BrokerSnapshot} snapshot @param {unknown} graph
 * @returns {readonly string[]}
 */
export function mediationLivePairs(worldState, snapshot, graph) {
  return Object.freeze(brokeredIntents(worldState, snapshot, graph).map((row) => row.pair));
}

/**
 * The courts of every live pair THIS card's court stands between — the subjects of
 * `warIntentLive`. The campaign bag carries the courts as `settlements` (the realm composer's
 * own shape: the library filtered to the campaign, so a phantom never enters it).
 * @param {unknown} record @param {unknown} campaignState @returns {readonly string[]}
 */
function brokeredCourtsOf(record, campaignState) {
  const bag = recordOf(campaignState);
  const self = recordOf(record).id != null ? String(recordOf(record).id) : '';
  const courts = Array.isArray(bag.settlements) ? bag.settlements : [];
  const byId = new Map(courts.map((row) => [String(recordOf(row).id), recordOf(row)]));
  const rows = self ? brokeredIntents(bag.worldState, { byId }, bag.regionalGraph).filter((row) => row.broker === self) : [];
  return Object.freeze([...new Set(rows.flatMap((row) => row.parties))].sort(codepoint));
}

/**
 * THE PREDICATE, in `worldConditions.js`'s live-row shape (J-EM-3, R-38): the subjects are the
 * pair's courts and the predicate is DERIVED from them. Dark answers the empty list (J-EM-4).
 * @type {Readonly<Record<string, import('../edit/worldConditions.js').WorldConditionRow>>}
 */
export const MEDIATION_WORLD_CONDITIONS = Object.freeze({
  [WAR_INTENT_LIVE]: Object.freeze({
    predicate: (/** @type {unknown} */ record, /** @type {unknown} */ campaignState) => brokeredCourtsOf(record, campaignState).length > 0,
    subjects: brokeredCourtsOf,
    readers: Object.freeze([Object.freeze({ id: 'war-intent-ledger', module: 'src/domain/worldPulse/warIntent.js', symbol: 'warIntentFor', gate: null })]),
    source: 'live',
  }),
});

/**
 * "Offer good offices." (R-25): a DIRECTION, never a mission, and it can only ADD PRESSURE — its
 * one field selects a live, brokered pair and names no outcome. Composed into
 * `DIRECTION_OP_TYPES` by the chair; its consumer is slot GR-6-c.
 * @type {Readonly<Record<string, import('../edit/operations.js').OpTypeDeclaration>>}
 */
export const MEDIATION_DIRECTION_OP_TYPES = Object.freeze({
  [GOOD_OFFICES_OP_TYPE]: Object.freeze({
    target: 'settlement',
    payload: Object.freeze({ pair: Object.freeze({ kind: 'pool', pool: MEDIATION_PAIR_POOL, required: true }) }),
    stage: 'home',
    consequence: 'home',
    requires: Object.freeze({ world: Object.freeze([WAR_INTENT_LIVE]), registry: Object.freeze([]) }),
    enables: Object.freeze([]),
    relatedTo: Object.freeze([]),
    conflictsWith: Object.freeze([]),
    duration: null,
    guards: Object.freeze([]),
    guardsStated: 'No guard is wired here. The seal is offered only while this court stands between a pair whose order still stands, and the pair is a member of the live pool.',
  }),
});
