/**
 * domain/worldPulse/counterIntelSweep.js — IN-3, THE COUNTER-GAME: THE SWEEP AND ITS VERBS.
 * (docs/DESIGN_FP_ARCHITECTURE.md §5 #19; docs/DESIGN_FP_ARCH_IN.md §4 IN-3, NORMATIVE;
 * docs/DESIGN_FP_INFORMATION.md §5 IN-3; R-29; the fold's §12.2 rows 8, 9 and 13.)
 *
 * THE DM-TRUTH SIDE of the counter-game. `suspicion.js` is the court's reading and never reads
 * truth; this module RESOLVES a hunt against the truth it hunts (the covert watchers standing
 * on the town, the covert errands at its gate), which is why the acceptance file's truth-token
 * scan convicts THIS file as its guard-the-guard control.
 *
 *   THE SWEEP (`resolveSweep`): a paid hunt over the covert eyes on the home. `SWEEP_OUTCOMES`
 *     is minted here: CAUGHT (a keyed draw per watcher, fork `sweep:<home>:<tick>`; the caught
 *     ids go to the head's own exposure path, whose beat and blowback are built, so none is
 *     re-authored here), CLEAN_MISS (nothing found; the price was the affordability gate and the
 *     hum is its receipt; no spy is ever fabricated), FALSE_ACCUSATION (nothing found by a court
 *     whose suspicion clears its zeal band: it names a resident anyway, a REPUTATION event only,
 *     priced as a deception charge against its own court, the people's credibility stock).
 *   VET ("Test their word."): the third reception arm, `vet` in `ENVOY_RECEPTION_DECISIONS`, a
 *     CONSUMER of the one vetting home (`sendTwoDivergence.js :: vetVolunteerEnvoy`, ⟨F8⟩): it
 *     carries that decider's verdict whole and moves the envoy's testimony rung by it.
 *   SEND-TWO: consumes `sendTwoDivergence.js`, the one home of the divergence reader (J-INF-15),
 *     with the tolerance rung that keeps two honest, weathered accounts from reading as a traitor.
 *   THE EDITOR (SR-2): the direction `sweep-for-agents` in `operations.js`'s OpTypeDeclaration
 *     shape and its predicate `suspicionAbove` in `worldConditions.js`'s liveRow shape, proven
 *     HEADLESS. IN-3-c: the consumer lands when U123 composes the direction transport.
 *
 * NO-FATES (§1b): the accused is NAMED, never removed; every sentence here is a reputation.
 * THE COUNTERPARTY (L10 (c)): home+record for a sweep (the home court's own); a phantom never
 * enters the snapshot, so a sweep of one is refused by construction (`no_court`).
 * PURE: no clock, no store, no mutation; the one draw is the keyed catch fork.
 * @enforced-by tests/domain/counterIntelIn3.test.js
 */
import { compareCodepoint } from '../deterministicSort.js';
import { clamp01 } from '../../kernel/math.js';
import { PROSPERITY_TIERS, prosperityRank } from '../../data/constants.js';
import { getSpatialLedger } from '../spatial/distanceRead.js';
import { NPC_UNAVAILABLE_STATUSES, importanceWeight } from '../entities/npcs.js';
import { OFF_STAGE_STATUSES, isOffStage } from '../roads/state.js';
import { ENVOY_PURPOSE_CLASSES, ENVOY_RECEPTION_DECISIONS, purposeClassOf } from './envoyErrandVocabulary.js';
import { inboundEnvoysAt } from './envoyInbound.js';
import { TESTIMONY_LADDER, testimonyRungOf } from './envoyTestimony.js';
import { informationReceipt } from './informationNews.js';
import { npcId } from './npcAgency.js';
import { readSendTwoDivergence, VETTING_QUALITIES, vetVolunteerEnvoy } from './sendTwoDivergence.js';
import { stablePart } from './stablePart.js';
import {
  SUSPICION_TUNING, ZEAL_POSTURES, counterIntelActive, suspicionClears, suspicionOf, zealOf,
} from './suspicion.js';

/** @typedef {Record<string, unknown>} Row */
/** @typedef {import('../edit/operations.js').OpTypeDeclaration} OpTypeDeclaration */

/** @param {unknown} v @returns {Row} */
function asObject(v) {
  return v != null && typeof v === 'object' && !Array.isArray(v) ? /** @type {Row} */ (v) : {};
}
/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

// ── THE VOCABULARIES AND THE DIALS ────────────────────────────────────────────
/** The sweep's outcome vocabulary (the fork's `actionVocabulary`; SAVE-DATA CONTRACT once a
 *  pin names one): nothing found, the wrong soul named, the watchers caught. */
export const SWEEP_OUTCOMES = Object.freeze(['clean_miss', 'false_accusation', 'caught']);

/** Why a sweep never ran, codepoint-ordered (never a throw, never a silent drop). */
export const SWEEP_REFUSALS = Object.freeze(['cannot_afford', 'dark', 'no_court']);

/** The seal labels the shell will print (the chair's splice). */
export const SWEEP_SEAL_LABEL = 'Search for their agents.';
export const VET_SEAL_LABEL = 'Test their word.';

/**
 * THE DIALS (DRAFT register rows; nothing signed): the catch odds per covert watcher, the
 * prosperity a court must hold to pay for a hunt (the SEE upkeep idiom: an affordability gate
 * priced in the prosperity vocabulary, never a drain), the deception charge a witch-hunt lays
 * on its own court, the two beats' Herald weights, and the rank an unknown prosperity reads at
 * (mid, non-blocking: the SEE upkeep's own reading of the same absence).
 */
export const SWEEP_TUNING = Object.freeze({
  catchOdds: 0.35,
  affordFloor: 0.3,
  falseAccusationCharge: 0.5,
  accusationSeverity: 0.4,
  humSeverity: 0.2,
  unknownProsperity: 0.5,
});

/** The rung a send-two divergence must reach before it reads as a signature (DRAFT). */
export const SEND_TWO_TUNING = Object.freeze({ toleranceRung: 'reported' });

// ── THE TRUTH THE SWEEP HUNTS ─────────────────────────────────────────────────
/**
 * THE COVERT EYES ON A TOWN: every watcher whose sight posture on `homeId` is covert, in
 * codepoint order. DM truth, read off the SEE ledger its one writer keeps.
 * @param {unknown} worldState @param {string} homeId @returns {string[]}
 */
export function covertWatchersOf(worldState, homeId) {
  const sight = asObject(getSpatialLedger(/** @type {Parameters<typeof getSpatialLedger>[0]} */ (asObject(worldState)), 'sightPostures'));
  return Object.keys(sight).sort(compareCodepoint).filter((watcherId) => {
    const posture = asObject(asObject(sight[watcherId])[homeId]);
    return watcherId !== homeId && Object.keys(posture).length > 0 && posture.covert !== false;
  });
}

/**
 * THE WATCH PANEL'S ROWS (DM truth): whom the town watches, who watches the town, whether its
 * gates stand closed, and the court's own suspicion reading.
 * @param {{ worldState: unknown, snapshot: unknown, settlementId: string }} args
 */
export function watchRowsFor({ worldState, snapshot, settlementId }) {
  const id = String(settlementId);
  const world = /** @type {Parameters<typeof getSpatialLedger>[0]} */ (asObject(worldState));
  const sight = asObject(getSpatialLedger(world, 'sightPostures'));
  const watches = Object.keys(asObject(sight[id])).sort(compareCodepoint)
    .map((targetId) => ({ targetId, covert: asObject(asObject(sight[id])[targetId]).covert !== false }));
  const watchedBy = Object.keys(sight).sort(compareCodepoint).filter((w) => w !== id && Object.keys(asObject(asObject(sight[w])[id])).length > 0)
    .map((watcherId) => ({ watcherId, covert: asObject(asObject(sight[watcherId])[id]).covert !== false }));
  const gateClosed = Object.keys(asObject(asObject(getSpatialLedger(world, 'secrecyPostures'))[id])).length > 0;
  return { watches, watchedBy, gateClosed, suspicion: suspicionOf({ worldState, snapshot, settlementId: id }) };
}

/** A settlement's prosperity as a 0..1 rank (the E1d vocabulary; unknown reads mid).
 *  @param {Row} settlement @returns {number} */
function prosperity01Of(settlement) {
  const rank = prosperityRank(asObject(settlement.economicState).prosperity);
  return rank < 0 ? SWEEP_TUNING.unknownProsperity : clamp01(rank / Math.max(1, PROSPERITY_TIERS.length - 1));
}

/** The statuses the participation chokepoint leaves to each consumer (derived, never spelled). */
const CONSUMER_PAIRED_STATUSES = /** @type {readonly string[]} */ (Object.freeze(NPC_UNAVAILABLE_STATUSES
  .filter((status) => !(/** @type {readonly string[]} */ (OFF_STAGE_STATUSES)).includes(status))));

/**
 * THE ACCUSED, a cast person: the lowest npc id on the home's participation roster that the ONE
 * chokepoint (`roads/state.js :: isOffStage`) admits, the dead paired, never a minor soul. Named,
 * never removed. '' when nobody can be named.
 * @param {string} homeId @param {Row} settlement @returns {{ id: string, name: string }}
 */
export function castAccused(homeId, settlement) {
  /** @type {Array<{ id: string, name: string }>} */
  const named = [];
  (Array.isArray(settlement.npcs) ? /** @type {unknown[]} */ (settlement.npcs) : []).forEach((raw, index) => {
    const npc = asObject(raw);
    if (!Object.keys(npc).length || isOffStage(npc)) return;
    if (CONSUMER_PAIRED_STATUSES.includes(String(npc.status ?? '').toLowerCase())) return;
    if (!(importanceWeight(/** @type {Parameters<typeof importanceWeight>[0]} */ (npc)) > 0)) return;
    named.push({ id: npcId(homeId, /** @type {Parameters<typeof npcId>[1]} */ (npc), index), name: String(npc.name ?? '') });
  });
  return named.sort((a, b) => compareCodepoint(a.id, b.id))[0] || { id: '', name: '' };
}

// ── THE SWEEP ─────────────────────────────────────────────────────────────────
/**
 * @typedef {{ refused: string|null, outcome: string|null, zeal: string|null,
 *   caughtWatcherIds: string[], accusedNpcId: string|null,
 *   deltas: Array<{ id: string, kind: string, magnitude01: number }>, newsEntries: Row[] }} SweepResult
 */

/**
 * RESOLVE ONE SWEEP of `settlementId`'s own town. The producer the direction's consumer will call.
 * @param {{ worldState: unknown, snapshot: unknown, settlementId: unknown, tick: number,
 *   rng?: { fork?: (label: string) => { random: () => number } }|null, posture?: unknown,
 *   nameFor?: (id: string) => string }} args
 * @returns {SweepResult}
 */
export function resolveSweep({ worldState, snapshot, settlementId, tick, rng = null, posture = null, nameFor = (id) => id }) {
  const home = String(settlementId ?? '');
  const now = Math.max(0, Math.floor(finiteNumber(tick, 0)));
  /** @type {SweepResult} */
  const result = { refused: null, outcome: null, zeal: null, caughtWatcherIds: [], accusedNpcId: null, deltas: [], newsEntries: [] };
  if (!counterIntelActive(worldState)) return { ...result, refused: 'dark' };
  const byId = asObject(snapshot).byId;
  const settlement = asObject(asObject(byId instanceof Map ? byId.get(home) : null).settlement);
  if (!home || !Object.keys(settlement).length) return { ...result, refused: 'no_court' };
  if (prosperity01Of(settlement) < SWEEP_TUNING.affordFloor) return { ...result, refused: 'cannot_afford' };
  const zeal = zealOf(worldState, home, ZEAL_POSTURES.includes(String(posture)) ? posture : null);
  result.zeal = zeal.word;
  // THE CATCH, one keyed fork per (home, tick) and one draw per covert watcher, codepoint order.
  const fork = rng && typeof rng.fork === 'function' ? rng.fork(`sweep:${home}:${now}`) : null;
  for (const watcherId of covertWatchersOf(worldState, home)) {
    const u = fork && typeof fork.random === 'function' ? clamp01(finiteNumber(fork.random(), 1)) : 1;
    if (u < SWEEP_TUNING.catchOdds) result.caughtWatcherIds.push(watcherId);
  }
  if (result.caughtWatcherIds.length) return { ...result, outcome: 'caught' };
  const reading = suspicionOf({ worldState, snapshot, settlementId: home });
  const accused = reading.score01 >= SUSPICION_TUNING.zealAt * zeal.factor ? castAccused(home, settlement) : { id: '', name: '' };
  if (!accused.id || !accused.name) return { ...result, outcome: 'clean_miss', newsEntries: sweepNews('sweep_launched', home, now, nameFor, '') };
  return {
    ...result,
    outcome: 'false_accusation',
    accusedNpcId: accused.id,
    deltas: [{ id: home, kind: 'deception', magnitude01: SWEEP_TUNING.falseAccusationCharge }],
    newsEntries: sweepNews('false_accusation', home, now, nameFor, accused.name, accused.id),
  };
}

/**
 * The two beats a sweep can voice, in their registered voices: the hum a quiet sweep leaves, and
 * the witch-hunt's receipt (public, the town remembers whose name it was).
 * @param {string} kind @param {string} home @param {number} now @param {(id: string) => string} nameFor
 * @param {string} npcName @param {string} [accusedId] @returns {Row[]}
 */
function sweepNews(kind, home, now, nameFor, npcName, accusedId = '') {
  const receipt = informationReceipt(kind, `sweep:${home}:${now}`, { settlement: nameFor(home), npc: npcName });
  if (!receipt) return [];
  const accusation = kind === 'false_accusation';
  return [{
    id: `wizard_news.${now}.${receipt.kind}.${stablePart(home)}`,
    kind: receipt.kind,
    impactKind: receipt.kind,
    significance: receipt.significance,
    severity: accusation ? SWEEP_TUNING.accusationSeverity : SWEEP_TUNING.humSeverity,
    score: accusation ? 58 : 40,
    tick: now,
    scope: 'local',
    headline: accusation ? `${nameFor(home)} names a spy it never found` : `${nameFor(home)} questions every stranger`,
    summary: receipt.line,
    reasons: accusation
      ? [`The sweep at ${nameFor(home)} found no paid eyes. ${npcName} was named on association alone; the charge is a reputation, not a sentence.`,
        `The court that names an innocent spends its own people's trust. A legitimacy wound and a people-held grievance ride with the charge.`]
      : [`The sweep at ${nameFor(home)} found no paid eyes, and none were invented to justify it.`],
    settlementIds: [home],
    ...(accusedId ? { npcIds: [accusedId] } : {}),
    familyId: receipt.familyId,
    audience: receipt.audience,
    section: receipt.section,
    tags: ['world_pulse', 'infowar', 'counter_intel', accusation ? 'false_accusation' : 'sweep'],
  }];
}

// ── VET AND SEND-TWO ──────────────────────────────────────────────────────────
/** The reception word this module answers for, read OUT of SP-D2's closed list. */
export const VET_DECISION = ENVOY_RECEPTION_DECISIONS.filter((word) => word === 'vet')[0] || '';

/** The errand class an ES agent rides, read OUT of the errand family's closed list. */
const COVERT_CLASS = ENVOY_PURPOSE_CLASSES.filter((word) => word === 'covert')[0] || '';

/**
 * VET: TEST THEIR WORD, answered by the ONE vetting home. The careful seat of
 * `sendTwoDivergence.js :: vetVolunteerEnvoy` decides; this arm carries its verdict WHOLE and
 * mints no acceptance and no refusal basis of its own (⟨F8⟩: a vetting refusal is minted in one
 * place). A man the verdict clears keeps his testimony rung, a man it refuses drops one rung
 * toward tavern talk. Deterministic: same envoy, same records, same verdict.
 * @param {{ rung: unknown, volunteer: unknown }} args
 * @returns {{ decision: string, verdict: ReturnType<typeof vetVolunteerEnvoy>, rung: string }}
 */
export function weighEnvoyWord({ rung, volunteer }) {
  const careful = VETTING_QUALITIES.filter((q) => q === 'careful')[0] || '';
  const verdict = vetVolunteerEnvoy({ quality: careful, volunteer });
  const index = testimonyRungOf(rung);
  const after = verdict.accepted ? index : Math.min(TESTIMONY_LADDER.length - 1, index + 1);
  return { decision: VET_DECISION, verdict, rung: TESTIMONY_LADDER[after] };
}

/**
 * SEND-TWO, over the ONE divergence reader: a divergence is a signature only when its best
 * account sits at or above the tolerance rung, so two honest carriers of weathered hearsay
 * never read as a traitor.
 * @param {{ testimony?: unknown, encounterId?: unknown, attendedBy?: unknown }} args
 * @returns {{ verdict: string, flagged: boolean, topRung: string }}
 */
export function sendTwoRead(args) {
  const read = readSendTwoDivergence(args);
  const within = testimonyRungOf(read.topRung) <= testimonyRungOf(SEND_TWO_TUNING.toleranceRung);
  return { verdict: String(read.verdict), flagged: read.signature === true && within, topRung: String(read.topRung) };
}

// ── THE EDITOR: THE PREDICATE AND THE DIRECTION ───────────────────────────────
/**
 * THE SUBJECTS OF `suspicionAbove`: the home court itself, when its suspicion clears its
 * posture-scaled threshold OR an ES covert errand stands at its gate (SP-D2's one inbound
 * reader, the errand's true class; the charter's `infiltrationDepth` record, which that ladder
 * does not persist). Dark, or no campaign, none.
 * @param {unknown} record @param {unknown} campaignState @returns {readonly string[]}
 */
export function suspicionAboveSubjects(record, campaignState) {
  const id = String(asObject(record).id ?? '');
  const world = asObject(asObject(campaignState).worldState);
  if (!id || !Object.keys(world).length || !counterIntelActive(world)) return Object.freeze([]);
  const snapshot = { byId: new Map([[id, { id, settlement: record }]]), regionalGraph: asObject(campaignState).regionalGraph };
  const suspicious = suspicionClears(suspicionOf({ worldState: world, snapshot, settlementId: id }), zealOf(world, id));
  const agents = inboundEnvoysAt(world, id).some((row) => purposeClassOf(row) === COVERT_CLASS);
  return Object.freeze(suspicious || agents ? [id] : []);
}

/** The world condition this module defines for the editor. */
export const SUSPICION_ABOVE_CONDITION = 'suspicionAbove';

/** THE PREDICATE ROW, liveRow-shaped and DERIVED from its subjects (the pendingPeaceOffer idiom). */
export const SUSPICION_ABOVE_ROW = Object.freeze({
  predicate: (/** @type {unknown} */ record, /** @type {unknown} */ campaignState) => suspicionAboveSubjects(record, campaignState).length > 0,
  subjects: suspicionAboveSubjects,
  readers: Object.freeze([
    Object.freeze({ id: 'suspicion-read', module: 'src/domain/worldPulse/suspicion.js', symbol: 'suspicionOf', gate: null }),
    Object.freeze({ id: 'inbound-envoy', module: 'src/domain/worldPulse/envoyInbound.js', symbol: 'inboundEnvoysAt', gate: null }),
  ]),
  source: /** @type {const} */ ('live'),
});

/** The rows this module adds to `WORLD_CONDITIONS`, keyed for the chair's splice. */
export const COUNTER_INTEL_WORLD_CONDITIONS = Object.freeze({ [SUSPICION_ABOVE_CONDITION]: SUSPICION_ABOVE_ROW });

/** The one direction type this module defines: the DM's "Search for their agents." */
export const SWEEP_DIRECTION_TYPE = 'sweep-for-agents';

/**
 * THE DIRECTION ROW, operations.js's eleven fields. The target is the home court; `posture` is
 * the zeal word by reference (absent, the court's own posture decides), so §20.3's resolver
 * withdraws a pending sweep whose word moved.
 * @type {Readonly<Record<string, OpTypeDeclaration>>}
 */
export const SWEEP_DIRECTION_OP_TYPES = Object.freeze({
  [SWEEP_DIRECTION_TYPE]: Object.freeze({
    target: /** @type {const} */ ('settlement'),
    payload: Object.freeze({
      posture: Object.freeze({ kind: /** @type {const} */ ('enum'), values: ZEAL_POSTURES, required: false }),
    }),
    stage: /** @type {const} */ ('home'),
    consequence: /** @type {const} */ ('home'),
    requires: Object.freeze({ world: Object.freeze([SUSPICION_ABOVE_CONDITION]), registry: Object.freeze([]) }),
    enables: Object.freeze([]),
    relatedTo: Object.freeze(['set-belief-confidence']),
    conflictsWith: Object.freeze([]),
    duration: null,
    guards: Object.freeze([]),
    guardsStated: 'No guard is wired here. Whether a sweep is offered is the suspicionAbove condition; whether a court can pay for one and what it finds are the sweep resolution, which refuses honestly rather than a guard.',
  }),
});
