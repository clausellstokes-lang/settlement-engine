/**
 * directions.js — WHAT THE DM DIRECTS, PURE (EM-E5, wave 3; design §18 and §19
 * rulings 2, 4 and 6; the chair's judgments 265 and 270).
 *
 * ⛔ THIS IS NOT `directives.js`, AND THE TWO WORDS NAME DIFFERENT ACTS. EM-E4's leaf
 * PINS: it names a registered fork and the outcome the process must reach, and the
 * simulation plays the consequences by its own rules. THIS leaf DIRECTS: it surfaces the
 * acts the world ALREADY HAS VERBS FOR, with the world's own predicate deciding whether
 * each is offered and the world's own prose saying why it is not. A pin chooses INSIDE a
 * process; a direction STARTS one. Nothing here reads a fork, and nothing in the pins
 * leaf reads a verb.
 *
 * ⛔ NOT ONE WORD OF VOCABULARY IS SPELLED HERE (design §19 ruling 2: "bind to what is
 * built; never mint a second surface"). Every list below arrives by IMPORT from the
 * module that owns it, so an upstream rename empties the list and the arms red instead of
 * this leaf quietly offering a word the world stopped meaning. The realm verbs are
 * `executableRealmVerbs()`'s, the herald's refusal is `realmVetoProse`'s, the engagement
 * moves are `convergence.js`'s, the muster rungs are `mobilization.js`'s own `RAMP`, the
 * levy is `treasury.js`'s two lists and its `TREASURY_SUSPENSIONS`, the postures are
 * `occupation.js`'s, the tempo is `narrativeTempo.js`'s, the brokerage menu is
 * `brokerageServices.js`'s, the channel statuses are `region/graph.js`'s, the credibility
 * kinds are `informationStatecraft.js`'s, and the belief bands are DERIVED from
 * `beliefMap.js`'s own classifier because that module keeps its count private.
 *
 * ⛔ THE ROWS ARE NOT SPLICED INTO `OP_TYPES`, AND THAT IS MEASURED RATHER THAN CHOSEN.
 * `tests/domain/editOperations.test.js` case A1 pins the composed catalogue at EXACTLY
 * twenty-two rows in both directions, and `tests/lint/opGuardCoverage.walker.test.js`
 * derives its scan roster from the SPREAD NAMES inside the `OP_TYPES` literal. A splice
 * would red a landed arm in a file this member does not own and would enrol this leaf in
 * a totality walker the same landing. So the rows are authored in `operations.js`'s OWN
 * `OpTypeDeclaration` shape and handed to EM-C1's `resolveDecree` as its `opTypes`
 * argument, exactly as EM-C1's header says its catalogues arrive. The composition into
 * one catalogue is the chair's, at the unfreeze.
 *
 * ⛔ IT NEVER REFUSES OUT LOUD AND NEVER THROWS, exactly as EM-C1's registry and EM-E4's
 * pins do not. A value outside a declared list is refused by EM-C1's own `resolveDecree`
 * over these rows, with `RESOLUTION_MISSING_KINDS`' own `pool-value`; no refusal word is
 * minted here, and THE GUARDS STILL ONLY JUDGE (design §2.7, judgment 270). A malformed
 * world answers "not offered", never an exception.
 *
 * ⛔ PURE, TOTAL, FALSE-ON-ABSENCE. No writes, no clock, no draw, no store, no React.
 */

/** @typedef {import('./types.js').Op} Op */

import { compareCodepoint } from '../deterministicSort.js';
import { executableRealmVerbs, realmVerbFor, realmVerbs, realmVetoProse } from '../events/realmManifest.js';
import { REGIONAL_CHANNEL_STATUSES } from '../region/graph.js';
import { strengthBandOf } from '../worldPulse/beliefMap.js';
import { BROKERAGE_SERVICE_MENU_KEYS } from '../worldPulse/brokerageServices.js';
import { ENGAGEMENT_MOVES } from '../worldPulse/convergence.js';
import { CREDIBILITY_DELTA_KINDS } from '../worldPulse/informationStatecraft.js';
import { RAMP } from '../worldPulse/mobilization.js';
import { TEMPO_TIERS } from '../worldPulse/narrativeTempo.js';
import { OCCUPATION_POSTURES } from '../worldPulse/occupation.js';
import { TAX_FORMS, TAX_RATE_BANDS, TREASURY_SUSPENSIONS } from '../worldPulse/treasury.js';

/**
 * ⭐ EVERY DOOR INTO THIS LEAF IS `unknown`, NEVER `any` — `worldConditions.js`'s own
 * discipline, for its own reason: the any-cast ratchet counts every cast on a new
 * `src/domain` line, and a type predicate buys the same freedom with no hole.
 *
 * @typedef {{
 *   verb: string, label: string, family: string, lane: string, offered: boolean,
 *   reasons: readonly string[], unlocks: readonly string[], covers: readonly string[],
 * }} RealmSeal
 *
 * The verdict shape every realm predicate answers (`realmManifest.js`'s `feasibilityGate`).
 * @typedef {{ available: boolean, reasons: readonly string[], unlocks: readonly string[] }} RealmVerdict
 *
 * @typedef {{ kind: string, values?: readonly string[], required: boolean }} DirectionFieldSpec
 *
 * @typedef {{
 *   target: string,
 *   payload: Readonly<Record<string, DirectionFieldSpec>>,
 *   stage: string,
 *   consequence: string,
 *   requires: { world: readonly string[], registry: readonly string[] },
 *   enables: readonly string[],
 *   relatedTo: readonly string[],
 *   conflictsWith: readonly string[],
 *   duration: number|null,
 *   guards: readonly Function[],
 *   guardsStated: string,
 * }} DirectionTypeDeclaration
 *
 * One information fact, at the module and symbol that OWNS it.
 * @typedef {{
 *   module: string, symbol: string, condition: string,
 *   offered: boolean, reason: string,
 * }} InformationSource
 */

/** @param {unknown} value @returns {value is Record<string, unknown>} a plain object, never an array and never null */
function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/**
 * ⭐ THE MANIFEST'S ROWS ARRIVE THROUGH AN `unknown` DOORWAY, AND THAT IS MEASURED. Its
 * entries are a UNION of sixteen literal object types, and six of them are built by
 * spreading a parked factory's result, so half the union has no literal `verb` or `family`
 * in its inferred type. A type predicate applied straight to that union narrows to the
 * union again and every read of those two fields is a strict error — six of them, measured
 * on the first run of this leaf. Widening to `unknown` FIRST lets the same predicate narrow
 * to one honest shape, which is the `worldConditions.js` discipline and costs no cast: an
 * `any` here would have type-checked by surrendering, and the ratchet counts every one.
 * @param {unknown} row @returns {Record<string, unknown>|null}
 */
function manifestRow(row) {
  /** @type {unknown} */
  const entry = row;
  return isPlainObject(entry) ? entry : null;
}

/** @param {unknown} value @returns {value is string} a non-empty string */
function isName(value) {
  return typeof value === 'string' && value.length > 0;
}

/** @param {unknown} value @returns {readonly string[]} the non-empty names of a list, in author order */
function namesOf(value) {
  return Array.isArray(value) ? Object.freeze(value.filter(isName)) : Object.freeze([]);
}

// ── The realm half (design §19 ruling 2; §18's conditions and herald's reason) ───────

/**
 * The one op type a surfaced realm verb stages under. ONE type over all sixteen verbs,
 * for the reason design §16 gives `pin-fork` one type over all forks: the verb is the
 * payload, and a type per verb would be sixteen roster rows saying the same sentence.
 */
export const REALM_DIRECTION_TYPE = 'direct-realm';

/** The payload a `direct-realm` carries, in `compareCodepoint` order of the names. */
export const REALM_DIRECTION_FIELDS = Object.freeze(/** @type {const} */ (['dials', 'verb']));

/**
 * THE MANIFEST'S PROPOSAL LANE, BY VERB NAME, IN THE MANIFEST'S OWN ORDER. This is the
 * `direct-realm` vocabulary, and it is `executableRealmVerbs()`'s list verbatim: the lane
 * word is never spelled here, so a third lane arriving upstream widens this leaf by
 * arriving rather than by being remembered. A seal carries its own `lane` through from the
 * row, which is how a card knows a `deferred` verb is registered and grayed with its own
 * reason rather than simply missing.
 */
export const REALM_DIRECTION_VERBS = Object.freeze(
  executableRealmVerbs().map((row) => String(manifestRow(row)?.verb ?? '')).filter(isName),
);

/**
 * A predicate's verdict, normalized. A verdict that is not the manifest's shape reads as
 * NOT OFFERED with no reason of its own, which is this leaf's false-on-absence law: a
 * half-shaped answer must never read as permission.
 * @param {unknown} verdict @returns {RealmVerdict}
 */
function verdictOf(verdict) {
  if (!isPlainObject(verdict)) return Object.freeze({ available: false, reasons: Object.freeze([]), unlocks: Object.freeze([]) });
  return Object.freeze({
    available: verdict.available === true,
    reasons: namesOf(verdict.reasons),
    unlocks: namesOf(verdict.unlocks),
  });
}

/**
 * EVERY REALM VERB AS A §18 SEAL, in the manifest's own order, each judged by ITS OWN
 * predicate over the live world. This is the whole of design §19 ruling 2's first
 * sentence in code: the surface offers what the manifest offers, and the condition that
 * decides is the manifest's, never a second reading of the same world.
 *
 * The predicate is called exactly as `RealmVerbComposer.jsx` calls it — the same-function
 * law — and a row whose predicate is not callable reads as not offered rather than
 * throwing, because a card that cannot render is a worse answer than a seal that is not
 * offered (design §9's tie-break).
 *
 * @param {unknown} worldState @param {unknown} ctx the realm context bag `{ settlements, tick }`
 * @returns {readonly RealmSeal[]}
 */
export function realmSealsFor(worldState, ctx) {
  /** @type {RealmSeal[]} */
  const seals = [];
  for (const row of realmVerbs()) {
    const entry = manifestRow(row);
    if (!entry || !isName(entry.verb)) continue;
    const predicate = entry.predicate;
    const verdict = typeof predicate === 'function'
      ? verdictOf(/** @type {(a: unknown, b: unknown) => unknown} */ (predicate)(worldState, ctx))
      : verdictOf(null);
    seals.push(Object.freeze({
      verb: entry.verb,
      label: isName(entry.label) ? entry.label : entry.verb,
      family: isName(entry.family) ? entry.family : '',
      lane: isName(entry.lane) ? entry.lane : '',
      offered: verdict.available,
      reasons: verdict.reasons,
      unlocks: verdict.unlocks,
      covers: namesOf(entry.coversVetoCodes),
    }));
  }
  return Object.freeze(seals);
}

/**
 * THE HERALD'S ONE LINE for a seal that is not offered (design §18: "the card says why in
 * the herald's voice"). The predicate's own first reason wins, because that is the
 * sentence the wave module wrote about its own gate; a verb whose predicate refuses
 * WITHOUT a reason falls to `realmVetoProse` over the first code it covers, which is the
 * same prose the applier would speak. An offered seal has no reason, and says so as the
 * empty string rather than as a sentence nobody needs.
 *
 * @param {unknown} seal @returns {string}
 */
export function realmSealReason(seal) {
  if (!isPlainObject(seal) || seal.offered === true) return '';
  const reasons = namesOf(seal.reasons);
  if (reasons.length > 0) return reasons[0];
  const covers = namesOf(seal.covers);
  return covers.length > 0 ? realmVetoProse(covers[0], '') : '';
}

/**
 * The herald's sentence for a veto code THE VERB ITSELF COVERS. `coversVetoCodes` is the
 * manifest's own claim about which refusals a verb answers for, so a code outside it is
 * not this verb's to explain and reads as the empty string: a card that spoke another
 * verb's refusal would be the second surface ruling 2 forbids.
 *
 * @param {unknown} verb @param {unknown} code @param {unknown} [detail]
 * @returns {string}
 */
export function realmRefusalProse(verb, code, detail) {
  const entry = isName(verb) ? manifestRow(realmVerbFor(verb)) : null;
  if (!entry || !isName(code)) return '';
  return namesOf(entry.coversVetoCodes).includes(code)
    ? realmVetoProse(code, isName(detail) ? detail : '')
    : '';
}

// ── The levy's §18 condition (design §19's "suspended by siege/occupation") ──────────

/**
 * WHICH SUSPENSION GRIPS THE TOWN, or the empty string. `treasury.js` keeps its own
 * `suspensionFor` private and states the reason in its header: "a second, independently
 * written occupied-detector would be internally consistent, disagree with the granary
 * about the same siege, and never red". So this reader takes THE SAME ARGUMENT that
 * private one takes — the blockade record the granary pass already derived for this
 * settlement this tick (`foodStockpile.js :: blockadeFor`) — and reads the two words out
 * of `TREASURY_SUSPENSIONS`, which is ordered by the precedence the treasury ruled: siege
 * outranks occupation, because under siege all normal economic activity stops.
 *
 * @param {unknown} blockade @returns {string} a `TREASURY_SUSPENSIONS` member, or ''
 */
export function levySuspension(blockade) {
  const type = isPlainObject(blockade) && isName(blockade.type) ? blockade.type : '';
  for (const word of TREASURY_SUSPENSIONS) if (word === type) return word;
  return '';
}

// ── The belief bands, DERIVED from the writer's own classifier ───────────────────────

/**
 * THE BELIEF STRENGTH BANDS. `beliefMap.js` keeps `STRENGTH_BANDS` module-private, so the
 * bands are not retyped here: they are the DISTINCT ANSWERS its own exported classifier
 * gives across the closed zero-to-one domain it clamps. A band count that moves upstream
 * moves this list with it, which a literal could never do.
 */
export const BELIEF_STRENGTH_BANDS = Object.freeze(
  [...new Set(Array.from({ length: 101 }, (_, step) => strengthBandOf(step / 100)))]
    .sort((a, b) => a - b),
);

// ── The rows (design §19 ruling 2's ruled-in directions and ruling 6's information) ──

/** @param {readonly string[]} values @returns {DirectionFieldSpec} a required enum over a LIVE list */
const pick = (values) => Object.freeze({ kind: 'enum', values: Object.freeze([...values]), required: true });
/** @returns {DirectionFieldSpec} */
const ref = () => Object.freeze({ kind: 'ref', required: true });
/** @param {boolean} required @returns {DirectionFieldSpec} */
const free = (required) => Object.freeze({ kind: 'free', required });

/** The stage and consequence every direction carries (design §13: a direction acts at home). */
const HOME = 'home';

/**
 * @param {DirectionTypeDeclaration} decl @returns {DirectionTypeDeclaration}
 */
function row(decl) {
  return Object.freeze({
    ...decl,
    payload: Object.freeze(decl.payload),
    requires: Object.freeze({
      world: Object.freeze(decl.requires.world),
      registry: Object.freeze(decl.requires.registry),
    }),
    enables: Object.freeze(decl.enables),
    relatedTo: Object.freeze(decl.relatedTo),
    conflictsWith: Object.freeze(decl.conflictsWith),
    guards: Object.freeze(decl.guards),
  });
}

/**
 * THE DIRECTION CATALOGUE, authored in `compareCodepoint` order and in `operations.js`'s
 * own eleven-field declaration shape, so EM-C1's `resolveDecree` reads it without a
 * translation and EM-C3's rules can judge it the day the chair composes the two.
 *
 * Every `requires.world` id is a LIVE row of `worldConditions.js`'s roster, corrected by
 * design §19 ruling 6: `beliefExists`, `forceInField`, `openRoute`, `siegeInProgress`,
 * `tradeWith`. Not one id is invented, and the two rows that roster declares honestly
 * absent are named by no row here.
 * @type {Readonly<Record<string, DirectionTypeDeclaration>>}
 */
export const DIRECTION_OP_TYPES = Object.freeze({
  'correct-belief': row({
    target: 'settlement',
    payload: { subject: ref() },
    stage: HOME, consequence: HOME,
    requires: { world: ['beliefExists'], registry: [] },
    enables: [], relatedTo: ['mutate-belief', 'set-belief-confidence'], conflictsWith: ['mutate-belief'],
    duration: null, guards: [],
    guardsStated: 'No guard is wired here. The act carries no vocabulary because it writes the ground truth the belief was wrong about, which is a fact of the world and never a word the DM picks.',
  }),
  'direct-credibility': row({
    target: 'settlement',
    payload: { kind: pick(CREDIBILITY_DELTA_KINDS), subject: ref() },
    stage: HOME, consequence: HOME,
    requires: { world: ['beliefExists'], registry: [] },
    enables: [], relatedTo: [], conflictsWith: [],
    duration: null, guards: [],
    guardsStated: 'No guard is wired here. The four kinds are advanceCredibility own fold words, read out of the process that spends them.',
  }),
  'direct-force': row({
    target: 'settlement',
    payload: { move: pick(ENGAGEMENT_MOVES) },
    stage: HOME, consequence: HOME,
    requires: { world: ['forceInField'], registry: [] },
    enables: [], relatedTo: [], conflictsWith: [],
    duration: null, guards: [],
    guardsStated: 'No guard is wired here. The four moves are the ones a side EV-selects among each tick, so directing the force names a move the war layer already knows how to play.',
  }),
  [REALM_DIRECTION_TYPE]: row({
    target: 'settlement',
    payload: { dials: free(false), verb: pick(REALM_DIRECTION_VERBS) },
    stage: HOME, consequence: HOME,
    requires: { world: [], registry: [] },
    enables: [], relatedTo: [], conflictsWith: [],
    duration: null, guards: [],
    guardsStated: 'No guard is wired here. The seal offered is decided by the verb OWN predicate, which is design 18 world-state condition rather than a guard, and the approval route is the verb own authority column.',
  }),
  'mutate-belief': row({
    target: 'settlement',
    payload: { band: pick(BELIEF_STRENGTH_BANDS.map(String)), subject: ref() },
    stage: HOME, consequence: HOME,
    requires: { world: ['beliefExists'], registry: [] },
    enables: [], relatedTo: ['correct-belief'], conflictsWith: ['correct-belief'],
    duration: null, guards: [],
    guardsStated: 'No guard is wired here. The bands are the belief writer own classifier answers, so a twist can only reach a strength the map can hold.',
  }),
  'offer-brokerage': row({
    target: 'institution',
    payload: { service: pick(BROKERAGE_SERVICE_MENU_KEYS) },
    stage: HOME, consequence: HOME,
    requires: { world: ['tradeWith'], registry: [] },
    enables: [], relatedTo: [], conflictsWith: [],
    duration: null, guards: [],
    guardsStated: 'No guard is wired here. The menu is the house own key list, and which of them a house will actually sell stays servicesAvailable answer.',
  }),
  'set-belief-confidence': row({
    target: 'settlement',
    payload: { confidence01: free(true), subject: ref() },
    stage: HOME, consequence: HOME,
    requires: { world: ['beliefExists'], registry: [] },
    enables: [], relatedTo: ['correct-belief', 'mutate-belief'], conflictsWith: [],
    duration: null, guards: [],
    guardsStated: 'No guard is wired here. Confidence is a zero-to-one reading the belief writer decays on its own, and banding it here would mint a vocabulary that module does not have.',
  }),
  'set-channel-status': row({
    target: 'settlement',
    payload: { channel: ref(), status: pick(REGIONAL_CHANNEL_STATUSES) },
    stage: HOME, consequence: HOME,
    requires: { world: ['openRoute'], registry: [] },
    enables: [], relatedTo: [], conflictsWith: [],
    duration: null, guards: [],
    guardsStated: 'No guard is wired here. The four statuses are the regional graph own, and the writer stays setRegionalChannelStatus.',
  }),
  'set-levy': row({
    target: 'settlement',
    payload: { band: pick(TAX_RATE_BANDS), form: pick(TAX_FORMS) },
    stage: HOME, consequence: HOME,
    requires: { world: [], registry: [] },
    enables: [], relatedTo: [], conflictsWith: [],
    duration: null, guards: [],
    guardsStated: 'No guard is wired here. The seal is withheld while levySuspension answers a word, which is design 18 world-state condition read off the same blockade record the granary derived.',
  }),
  'set-muster': row({
    target: 'settlement',
    payload: { posture: pick(RAMP) },
    stage: HOME, consequence: HOME,
    requires: { world: [], registry: [] },
    enables: [], relatedTo: ['direct-force'], conflictsWith: [],
    duration: null, guards: [],
    guardsStated: 'No guard is wired here. The four rungs are the ordered ramp a town climbs, and the off-ramp states the war layer enters are not the DM to set.',
  }),
  'set-occupation-posture': row({
    target: 'settlement',
    payload: { posture: pick(OCCUPATION_POSTURES) },
    stage: HOME, consequence: HOME,
    requires: { world: [], registry: [] },
    enables: [], relatedTo: [], conflictsWith: [],
    duration: null, guards: [],
    guardsStated: 'No guard is wired here. The three postures are the occupier own hand, and the default stays a constant by ruling rather than a derivation.',
  }),
  'set-tempo': row({
    target: 'settlement',
    payload: { tier: pick(TEMPO_TIERS) },
    stage: HOME, consequence: HOME,
    requires: { world: [], registry: [] },
    enables: [], relatedTo: [], conflictsWith: [],
    duration: null, guards: [],
    guardsStated: 'No guard is wired here. The four tiers are the tempo fold own, in ascending loudness, and the budgets behind them stay the owner to retune.',
  }),
});

/** The catalogue in its authored order, for a caller that wants the roster. */
export const DIRECTION_TYPES = Object.freeze(Object.keys(DIRECTION_OP_TYPES).sort(compareCodepoint));

// ── The information half (design §19 rulings 4 and 6) ────────────────────────────────

/**
 * WHERE EVERY INFORMATION FACT LIVES, and which of them may be a seal at all.
 *
 * ⛔ TWO ROWS ARE NOT OFFERED, AND BOTH REFUSALS ARE THE DESIGN'S OWN. `sight` is design
 * §19 ruling 4 by name: the observation noise "would make the world lie with provenance
 * reading `observed`", and `SightPosture.fidelity01` IS that noise, so it is never a
 * seal. `secrecy` is measurement owed under ruling 1's law: `SecrecyPosture.level01` is a
 * bare zero-to-one reading with no banded vocabulary beside it, and a seal with invented
 * words is the thing FINITE-SEMANTICS forbids. Neither is dropped; each says why, as
 * data, where the surface can read it.
 * @type {Readonly<Record<string, InformationSource>>}
 */
export const INFORMATION_SOURCES = Object.freeze({
  belief: Object.freeze({
    module: 'src/domain/worldPulse/beliefMap.js',
    symbol: 'advanceBeliefMaps',
    condition: 'beliefExists',
    offered: true,
    reason: '',
  }),
  credibility: Object.freeze({
    module: 'src/domain/worldPulse/informationStatecraft.js',
    symbol: 'advanceCredibility',
    condition: 'beliefExists',
    offered: true,
    reason: '',
  }),
  lies: Object.freeze({
    module: 'src/domain/worldPulse/informationStatecraft.js',
    symbol: 'processLies',
    condition: 'beliefExists',
    offered: true,
    reason: '',
  }),
  secrecy: Object.freeze({
    module: 'src/domain/worldPulse/informationStatecraft.js',
    symbol: 'processSecrecy',
    condition: 'beliefExists',
    offered: false,
    reason: 'A secrecy posture is a bare zero-to-one level with no banded words beside it, so a seal here would have to invent them. Measurement is owed on the source, not words on the card.',
  }),
  sight: Object.freeze({
    module: 'src/domain/worldPulse/informationStatecraft.js',
    symbol: 'processSight',
    condition: 'beliefExists',
    offered: false,
    reason: 'Sight fidelity is the observation noise design 19 ruling 4 keeps off every card: a pinned fidelity would make the world lie while its provenance still read observed.',
  }),
});

/**
 * The information acts a card may offer, in `compareCodepoint` order. A row the table
 * declares not offered is absent from this list and its `reason` is the herald's line.
 * @returns {readonly string[]}
 */
export function offeredInformationFacts() {
  return Object.freeze(
    Object.keys(INFORMATION_SOURCES)
      .filter((key) => INFORMATION_SOURCES[key].offered === true)
      .sort(compareCodepoint),
  );
}
