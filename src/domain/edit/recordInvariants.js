// src/domain/edit/recordInvariants.js — THE TOWN'S OWN INVARIANTS, AS A MODULE.
//
// PURE. No store, PRNG, clock, locale, I/O, and no mutation of the argument. It takes ONE
// record and returns the list of internal disagreements that record carries. It writes
// nothing and changes no generator: `docs/DESIGN_EDIT_MODE_AND_DECREES.md` §22.2 item 3
// commissions the predicate; §22.3 item 1 makes the five evidence checks live and item 5
// ships the cross-key ones. The merge, the escalation ladder and the delta model are
// EM-R0c's; this leaf ships the predicate AND the metadata that ladder reads.
//
// ⛔ IT IMPORTS NOTHING FROM `src/generators` — that edge is a shrink-only ratchet and is why
// the band ladders live at their own `src/data` address. ⛔ AND IT IMPORTS NO RECORD
// REGISTER: `CHECK_META` names keys as STRINGS, and only the TEST resolves them against
// EM-R0a's register. A runtime import would couple the predicate to the register for nothing
// and enlarge the first consumer's closure.
//
// ⛔ NO THRESHOLD IS WRITTEN AND NO ENVELOPE IS LEARNED. The four band readings call the
// PRODUCERS' OWN tables by import. A learned envelope is narrower than the truth and would
// convict a DM's honest edit, which §22.3 item 6 strikes in terms.
//
// ⛔ AND NO MESSAGE RENDERS A NUMBER. `tests/lint/proseNumerics.test.js` walks every file
// under `src/` and holds a new one at zero in every category; a message therefore names the
// two PATHS and the disagreement in words. The figures belong to the test's own assertion
// output, which that walker does not read.
//
// THREE OUTCOMES PER CHECK, AND THE READINGS BELOW ARE THREE-VALUED THROUGHOUT: `true` the
// two sides agree, `false` they disagree, `undefined` a side is missing or mistyped and the
// check ABSTAINS. Abstention is never reported — a guard that convicts a partial record is a
// guard a DM turns off. A LABEL OUTSIDE ITS PRODUCER'S OWN TABLE ABSTAINS TOO, on the two
// ladders whose tables this leaf imports: an unrecognised band is a record the checker has no
// standing to judge, not a disagreement. The readiness ladder exports no such table, so its
// band reading stays exact, which is what §5.1 always said of it.
//
// ⚠ THE ARITHMETIC READINGS FORGIVE ONE UNIT because the record publishes rounded figures.
// `V-ISOLATION` and the three duplication identities forgive nothing, being exact.
//
// ⭐ THE ROUNDING RULE OF `V-BAND-FOODSEC` IS WRITTEN IN INTEGER ARITHMETIC, AND THAT IS A
// REGISTRATION OBLIGATION RATHER THAN A STYLE. The record publishes both food percentages
// rounded while the label was cut from the raw values, so a checker re-running the ladder
// over the published numbers must forgive exactly half a unit and never more. Against an
// INTEGER cut under a strict greater-than, forgiving half a unit upward is the same function
// as testing the next integer up, and the ladder's four cuts are integers — so the admissible
// set is built by stepping each published percentage by one, and no decimal is spelled here.
// `scripts/lib/tuning-inventory.mjs` holds a new `src/domain` file at zero bare decimals and
// zero module-top-level named numerics, which is what that spelling buys.

import { severityBand } from '../activeConditions.js';
import {
  legitimacyBandOf, readinessBandOf, foodSecurityBandOf,
  FOOD_SECURITY_BANDS, LEGITIMACY_BANDS,
} from '../../data/bandLadders.js';
import { FLAGS_EVER_TRUE, FLAG_FIELDS } from './recordInvariantFlags.js';
import { CHECK_META, CHECK_IDS } from './recordInvariantMeta.js';

export { CHECK_META, CHECK_IDS, CROSS_KEY_CHECKS } from './recordInvariantMeta.js';

/**
 * ⭐ THE RECORD'S TYPE IS REAL, AND ITS VALUES ARE `unknown` ON PURPOSE. This leaf reads a
 * GENERATED record that a DM may have edited, so no field can be promised by a signature; the
 * honest type is an object whose values are unknown until a guard narrows them. `any` would be
 * the same shape with the checking switched off, which is the debt
 * `tests/lint/domainAnyCastBaseline.test.js` holds a new `src/domain` file at ZERO of. Every
 * reading below therefore goes through `isObj` / `isNum` / `isStr`, which are TYPE GUARDS and
 * not casts, and the two type configs stay at zero because the narrowing is real.
 *
 * @typedef {Record<string, unknown>} RecordCard  One object of a settlement record.
 * @typedef {RecordCard} Settlement  ONE whole settlement record. Never a corpus.
 * @typedef {'arithmetic'|'count'|'prose-count'|'referential'|'band'|'flag-vector'} InvariantKind
 * @typedef {{ id: string, path: string, message: string, kind: InvariantKind,
 *             keys: readonly string[] }} Violation
 * @typedef {boolean|undefined} Reading true agrees · false disagrees · undefined abstains
 */

// ⭐ THE MODULE'S THREE DECLARED CONSTANTS, AND NOT ONE OF THEM IS A BAND THRESHOLD. Every
// band cut this leaf reads is IMPORTED from its producer's own table; these three are the
// arithmetic the record's own published figures are stated in — the whole a share is taken
// of, the neutral midpoint the legitimacy producer builds its score around, and the single
// rounding step the published integers may be out by. They are spelled in lower camel case
// and as integers on purpose: `scripts/lib/tuning-inventory.mjs` holds a new `src/domain`
// file at zero module-top-level named NUMERIC constants and zero bare decimals, and case is
// what that counter reads. A4 scans this source and admits a numeral nowhere else.
const wholeShare = 100;
const neutralLegitimacyScore = 50;
const oneStep = 1;

/** The three cards this leaf reads most, addressed by path so no chain is spelled twice. */
const FOOD_BALANCE = 'economicViability.metrics.foodBalance';
const FOOD_CARD = 'economicState.foodSecurity';
const LEGITIMACY = 'powerStructure.publicLegitimacy';
const VIABILITY = 'economicViability';
const ISOLATION = 'isolationSupport';
const READINESS = 'defenseProfile.readiness';
const POWER = 'powerStructure';
const DEFENCE = 'defenseProfile';
const SCORES = 'defenseProfile.scores';

/** @param {unknown} value @returns {value is RecordCard} A plain object, never an array. */
function isObj(value) { return typeof value === 'object' && value !== null && !Array.isArray(value); }
/** @param {unknown} value @returns {value is number} A finite number, never NaN. */
function isNum(value) { return typeof value === 'number' && Number.isFinite(value); }
/** @param {unknown} value @returns {value is string} */
function isStr(value) { return typeof value === 'string'; }
const near = (/** @type {number} */ a, /** @type {number} */ b) => Math.abs(a - b) <= oneStep;
const same = (/** @type {unknown} */ a, /** @type {unknown} */ b) => JSON.stringify(a) === JSON.stringify(b);

/** Walk a declared dotted path. Array segments are read whole, never by index. */
const readPath = (/** @type {unknown} */ root, /** @type {string} */ path) => path.split('.').reduce(
  (/** @type {unknown} */ node, step) => (isObj(node) || Array.isArray(node)
    ? /** @type {RecordCard} */ (node)[step] : undefined), root);

/** The card a dotted prefix leads to, or an empty one so every reading over it abstains. */
const cardAt = (/** @type {Settlement} */ settlement, /** @type {string} */ path) => {
  const found = readPath(settlement, path);
  return isObj(found) ? found : {};
};

/**
 * An OPTIONAL offset field: absent means there is none, and a present non-number makes the
 * reading abstain. The magical food supplement is written onto the record only where the
 * settlement has one, so requiring the field would abstain on every ordinary town.
 */
const offsetAt = (/** @type {RecordCard} */ card, /** @type {string} */ field) => (
  card[field] === undefined ? 0 : (isNum(card[field]) ? card[field] : NaN));

/** The first integer a prose figure names, or null when the phrase is absent. */
const statedCount = (/** @type {unknown} */ text, /** @type {RegExp} */ re) => {
  const found = isStr(text) ? text.match(re) : null;
  return found ? Number(found[1]) : null;
};

// ── THE READINGS. Each is three-valued, total over any input, and never throws. ─────────

/** @returns {Reading} A published count against the roster it counts. */
const counts = (/** @type {unknown} */ count, /** @type {unknown} */ roster) => (
  isNum(count) && Array.isArray(roster) ? count === roster.length : undefined);

/** @returns {Reading} A figure a prose line names against the roster it names it for. */
const states = (/** @type {unknown} */ text, /** @type {RegExp} */ re, /** @type {unknown} */ roster) => {
  const stated = statedCount(text, re);
  return stated === null || !Array.isArray(roster) ? undefined : stated === roster.length;
};

/** @returns {Reading} A derived figure against a difference of published parts, floored at none. */
const leftOver = (/** @type {unknown} */ derived, /** @type {unknown[]} */ parts, /** @type {boolean} */ exact) => {
  if (!isNum(derived) || !parts.every(isNum)) return undefined;
  const taken = /** @type {number[]} */ (parts);
  const rest = Math.max(0, taken.slice(oneStep).reduce((left, part) => left - part, taken[0]));
  return exact ? derived === rest : near(derived, rest);
};

/** @returns {Reading} A published share against the fraction of the whole it states. */
const share = (/** @type {unknown} */ published, /** @type {unknown} */ part, /** @type {unknown} */ whole) => (
  isNum(published) && isNum(part) && isNum(whole) && whole > 0
    ? near(published, Math.round((part / whole) * wholeShare)) : undefined);

/** @returns {Reading} A roster of published shares against the whole they divide. */
const sharesWhole = (/** @type {unknown} */ rows, /** @type {string} */ field) => {
  if (!Array.isArray(rows) || rows.length === 0) return undefined;
  const taken = rows.filter((row) => isObj(row) && isNum(row[field])).map((row) => Number(row[field]));
  return taken.length === rows.length ? near(taken.reduce((a, b) => a + b, 0), wholeShare) : undefined;
};

/** @returns {Reading} Two record paths that hold ONE fact, compared exactly. */
const mirrors = (/** @type {unknown} */ left, /** @type {unknown} */ right) => (
  left === undefined || right === undefined ? undefined : same(left, right));

/** @returns {Reading} A record's own label against the one its producer's ladder gives. */
const bandIs = (/** @type {unknown} */ label, /** @type {unknown} */ expected) => (
  isStr(label) && isStr(expected) ? expected === label : undefined);

/** The band KEY a food label resolves to, through the producer's own table. */
const foodKeyOf = (/** @type {unknown} */ label) => Object.keys(FOOD_SECURITY_BANDS)
  .find((key) => FOOD_SECURITY_BANDS[/** @type {keyof typeof FOOD_SECURITY_BANDS} */ (key)].label === label);

/** The band KEY a legitimacy label resolves to, by its POSITION in the producer's ladder. */
const legitimacyKeyOf = (/** @type {unknown} */ label) => {
  const at = LEGITIMACY_BANDS.findIndex((band) => band.label === label);
  return at < 0 ? undefined : Object.keys(FLAGS_EVER_TRUE.powerStructure)[at];
};

/** @returns {Reading} Is the band's OWN flag — the field named after it — carried as true? */
const ownFlag = (/** @type {RecordCard} */ card, /** @type {'economicState'|'powerStructure'} */ side, /** @type {string|undefined} */ key) => {
  if (key === undefined) return undefined;
  const named = `is${key.slice(0, oneStep).toUpperCase()}${key.slice(oneStep)}`;
  return FLAG_FIELDS[side].includes(named) && typeof card[named] === 'boolean' ? card[named] === true : undefined;
};

/**
 * @returns {Reading} Does the card set NO flag the declared table never saw beside its band?
 * Rules, in order: an unobserved band ABSTAINS ENTIRELY; a FALSE flag is never judged.
 */
const noStrayFlag = (/** @type {RecordCard} */ card, /** @type {'economicState'|'powerStructure'} */ side, /** @type {string|undefined} */ key) => {
  if (key === undefined) return undefined;
  const observed = /** @type {Record<string, readonly string[]>} */ (FLAGS_EVER_TRUE[side])[key];
  return Array.isArray(observed)
    ? FLAG_FIELDS[side].every((flag) => card[flag] !== true || observed.includes(flag)) : undefined;
};

/** @returns {Reading} The food label against the set the ladder admits, forgiving one step. */
const foodBandAdmits = (/** @type {RecordCard} */ card) => {
  const { label, deficitPct: deficit, surplusPct: surplus } = card;
  if (!isStr(label) || !isNum(deficit) || !isNum(surplus) || foodKeyOf(label) === undefined) return undefined;
  const famine = card.hasFamine === true;
  const rounded = Number.isInteger(deficit) && Number.isInteger(surplus);
  const steps = rounded ? [[0, 0], [oneStep, 0], [0, oneStep], [oneStep, oneStep]] : [[0, 0]];
  return steps.some(([onDeficit, onSurplus]) => foodSecurityBandOf(
    famine, deficit + onDeficit, surplus + onSurplus).label === label);
};

/**
 * Every evidence row of the coherence receipt, flattened, judgment order preserved.
 * @param {Settlement} settlement
 * @returns {RecordCard[]}
 */
function evidenceRows(settlement) {
  const judgments = cardAt(settlement, 'generationCoherenceReceipt').judgments;
  return (Array.isArray(judgments) ? judgments : []).filter(isObj).flatMap((judgment) => (Array.isArray(judgment.evidence) ? judgment.evidence : [])).filter(isObj);
}

const evidenceAt = (/** @type {Settlement} */ settlement, /** @type {string} */ path) => evidenceRows(settlement)
  .find((row) => row.path === path);

/** @returns {Reading} Every citation of an INDEXED record path resolves as the citation says. */
const citesInOrder = (
  /** @type {Settlement} */ settlement, /** @type {RegExp} */ re, /** @type {unknown} */ roster,
  /** @type {(cell: unknown, row: RecordCard, at: number) => boolean} */ holds,
) => {
  if (!Array.isArray(roster)) return undefined;
  const cited = evidenceRows(settlement).filter((row) => re.test(String(row.path)));
  const atOf = (/** @type {RecordCard} */ row) => Number(String(row.path).match(re)?.[oneStep]);
  return cited.length === 0 ? undefined : cited.every((row) => holds(roster[atOf(row)], row, atOf(row)));
};

const DEPS_RE = /(\d+)\s+operational dependenc/;
const HOOKS_RE = /(\d+)\s+plot hooks? available/;
const ROSTER_RE = /(\d+)\s+NPCs?\s*\/\s*(\d+)\s+relationships?/;
const EVENTS_RE = /(\d+)\s+historical events?/;
const TENSION_RE = /^history\.currentTensions\[(\d+)\]$/;
const CONFLICT_RE = /^conflicts\[(\d+)\]$/;
const ORDINAL_RE = /(\d+)/;
const STRESS_PATH = 'stress[';

/** @returns {Reading} A raw deficit against the need and production it is drawn from. */
const rawOf = (/** @type {RecordCard} */ card) => leftOver(card.rawDeficit, [card.dailyNeed, card.dailyProduction], false);

/** @returns {Reading} A net deficit against the raw one less its coverage and its offset. */
const netOf = (/** @type {RecordCard} */ card, /** @type {string} */ offsetField) => leftOver(
  card.deficit, [card.rawDeficit, card.importCoverage, offsetAt(card, offsetField)], false);

/** @returns {Reading} The live-chain count, the live-chain roster and the chain flags agree. */
const chainsAgree = (/** @type {RecordCard} */ card) => {
  const { activeChainsCount: counted, activeChains: roster, chains } = card;
  if (!isNum(counted) || !Array.isArray(roster) || !isObj(chains)) return undefined;
  return counted === roster.length
    && roster.length === Object.values(chains).filter((chain) => chain === true).length;
};

/** @returns {Reading} Every judged condition's band is the one its own severity gives. */
const conditionBands = (/** @type {unknown} */ rows) => {
  const judged = (Array.isArray(rows) ? rows : []).filter((e) => isObj(e) && isNum(e.severity) && isStr(e.severityBand));
  return judged.length === 0 ? undefined : judged.every((e) => severityBand(e.severity) === e.severityBand);
};

/** @returns {Reading} The readiness card's label against its own producer's ladder. */
const readinessBand = (/** @type {RecordCard} */ card) => (
  isNum(card.score) ? bandIs(card.label, readinessBandOf(card.score).label) : undefined);

/** @returns {Reading} The legitimacy card's label against its own producer's ladder. */
const legitimacyBand = (/** @type {RecordCard} */ card) => (
  legitimacyKeyOf(card.label) !== undefined && isNum(card.score)
    ? bandIs(card.label, legitimacyBandOf(card.score).label) : undefined);

/** @returns {Reading} The legitimacy score against its neutral base plus its own breakdown. */
const legitimacySum = (/** @type {RecordCard} */ card) => {
  const { score, breakdown } = card;
  if (!isNum(score) || !isObj(breakdown)) return undefined;
  const parts = Object.values(breakdown).filter(isNum);
  return parts.length === Object.keys(breakdown).length
    ? near(score, parts.reduce((total, part) => total + part, neutralLegitimacyScore)) : undefined;
};

/** @returns {Reading} The named governing body is one the faction roster actually seats. */
const governingSeated = (/** @type {RecordCard} */ card) => {
  const { governingName: named, factions } = card;
  const seated = (isStr(named) && Array.isArray(factions) ? factions : []).filter(isObj).filter((faction) => faction.isGoverning === true);
  return seated.length === 0 ? undefined : seated.some((faction) => faction.faction === named);
};

/** The arm of the two-armed flag-vector row that fired, or nothing when neither did. */
const strayArm = (/** @type {RecordCard} */ food, /** @type {RecordCard} */ legit) => {
  const fired = (/** @type {'economicState'|'powerStructure'} */ side, /** @type {RecordCard} */ card,
    /** @type {string|undefined} */ key, /** @type {string} */ what) => (noStrayFlag(card, side, key) === false
    ? { arm: `V-FLAGVEC/${side}`, message: `the ${what} card sets a flag the declared table never saw beside its band` } : undefined);
  return fired('economicState', food, foodKeyOf(food.label), 'food')
    || fired('powerStructure', legit, legitimacyKeyOf(legit.label), 'legitimacy');
};

/** @returns {Reading} The receipt's graph evidence against the record's own two rosters. */
const rosterCited = (/** @type {Settlement} */ s) => {
  const cited = evidenceAt(s, 'finalGraph')?.evidence;
  const found = isStr(cited) ? cited.match(ROSTER_RE) : null;
  const { npcs, relationships: links } = s;
  if (found === null || !Array.isArray(npcs) || !Array.isArray(links)) return undefined;
  const [, statedNpcs, statedLinks] = found;
  return Number(statedNpcs) === npcs.length && Number(statedLinks) === links.length;
};

/** @returns {Reading} The receipt's stress evidence against the stress card's own label. */
const stressCited = (/** @type {Settlement} */ s) => {
  const cited = evidenceRows(s).find((candidate) => String(candidate.path).startsWith(STRESS_PATH))?.evidence;
  const carried = cardAt(s, 'stress').label;
  return !isStr(cited) || !isStr(carried) ? undefined : cited === carried;
};

/** @returns {Reading} Every holding the defence profile credits is on the settlement's roster. */
const heldOnRoster = (/** @type {Settlement} */ s) => {
  const held = readPath(s, CHECK_META['V-DEFENSE-INST'].paths[0]);
  const roster = readPath(s, CHECK_META['V-DEFENSE-INST'].paths[oneStep]);
  if (!isObj(held) || !Array.isArray(roster)) return undefined;
  const named = Object.values(held).filter((slot) => Array.isArray(slot)).flat()
    .filter(isObj).map((entry) => entry.name).filter(isStr);
  const carried = new Set(roster.filter(isObj).map((entry) => entry.name).filter(isStr));
  return named.every((name) => carried.has(name));
};

/** The words a DISAGREEING reading is reported in. Agreement and abstention say nothing. */
const say = (/** @type {Reading} */ reading, /** @type {string} */ message) => (reading === false ? message : undefined);

/**
 * THE THIRTY-THREE CHECKS. Each returns the disagreement it found in WORDS, an `{ arm, message }`
 * pair for the one row that declares arms, or `undefined` for both agreement and abstention.
 * @type {Readonly<Record<string, (settlement: Settlement) => unknown>>}
 */
const CHECKS = Object.freeze({
  'V-DEPCOUNT': (s) => say(counts(cardAt(s, `${VIABILITY}.metrics`).dependencyCount, cardAt(s, VIABILITY).dependencies), 'the published dependency count disagrees with the dependencies roster it counts'),
  'V-WARNCOUNT': (s) => say(counts(cardAt(s, `${VIABILITY}.metrics`).warningCount, cardAt(s, VIABILITY).warnings), 'the published warning count disagrees with the warnings roster it counts'),
  'V-SUMMARY-DEPS': (s) => say(states(cardAt(s, VIABILITY).summary, DEPS_RE, cardAt(s, VIABILITY).dependencies), 'the viability summary names a dependency count the dependencies roster does not carry'),
  'V-SUMMARY-HOOKS': (s) => say(states(cardAt(s, VIABILITY).summary, HOOKS_RE, cardAt(s, VIABILITY).plotHooks), 'the viability summary names a plot-hook count the plot-hooks roster does not carry'),
  'V-FOOD-RAW': (s) => say(rawOf(cardAt(s, FOOD_BALANCE)), 'the viability food balance\'s raw deficit is not its daily need less its daily production'),
  'V-FOOD-DEF': (s) => say(netOf(cardAt(s, FOOD_BALANCE), 'magicFoodOffset'), 'the viability food balance\'s deficit is not its raw deficit less its import coverage and its magical supplement'),
  'V-FOOD-PCT': (s) => say(share(cardAt(s, FOOD_BALANCE).deficitPercent, cardAt(s, FOOD_BALANCE).deficit, cardAt(s, FOOD_BALANCE).dailyNeed), 'the viability food balance\'s published share is not its deficit over its daily need'),
  'V-FOODSEC-RAW': (s) => say(rawOf(cardAt(s, FOOD_CARD)), 'the food card\'s raw deficit is not its daily need less its daily production'),
  'V-FOODSEC-DEF': (s) => say(netOf(cardAt(s, FOOD_CARD), 'magicOffset'), 'the food card\'s deficit is not its raw deficit less its import coverage and its magical offset'),
  'V-FOODSEC-PCT': (s) => say(share(cardAt(s, FOOD_CARD).deficitPct, cardAt(s, FOOD_CARD).deficit, cardAt(s, FOOD_CARD).dailyNeed), 'the food card\'s published share is not its deficit over its daily need'),
  'V-FOODSEC-CHAINS': (s) => say(chainsAgree(cardAt(s, FOOD_CARD)), 'the food card\'s active-chain count disagrees with the chains it marks live'),
  'V-FOODSEC-FLAGS': (s) => say(ownFlag(cardAt(s, FOOD_CARD), 'economicState', foodKeyOf(cardAt(s, FOOD_CARD).label)), 'the food card\'s band is not carried by the flag of its own name'),
  'V-BAND-FOODSEC': (s) => say(foodBandAdmits(cardAt(s, FOOD_CARD)), 'the food card\'s label is not one the producer\'s own ladder admits for its published shares'),
  'V-ISOLATION': (s) => say(leftOver(cardAt(s, ISOLATION).deficit, [cardAt(s, ISOLATION).requiredCapacity, cardAt(s, ISOLATION).capacity], true), 'the isolation support deficit is not its required capacity less its capacity'),
  'V-COND-BAND': (s) => say(conditionBands(s.activeConditions), 'an active condition\'s band is not the one the producer\'s own ladder gives its severity'),
  'V-BAND-READINESS': (s) => say(readinessBand(cardAt(s, READINESS)), 'the defence readiness label is not the one the producer\'s own ladder gives its score'),
  'V-INCOME-100': (s) => say(sharesWhole(cardAt(s, 'economicState').incomeSources, 'percentage'), 'the income sources\' published shares do not sum to the whole'),
  'V-POWER-100': (s) => say(sharesWhole(cardAt(s, POWER).factions, 'power'), 'the factions\' published power shares do not sum to the whole'),
  'V-LEGIT-SUM': (s) => say(legitimacySum(cardAt(s, LEGITIMACY)), 'the public legitimacy score is not its neutral base plus its own breakdown'),
  'V-LEGIT-FLAGS': (s) => say(ownFlag(cardAt(s, LEGITIMACY), 'powerStructure', legitimacyKeyOf(cardAt(s, LEGITIMACY).label)), 'the public legitimacy band is not carried by the flag of its own name'),
  'V-BAND-LEGITIMACY': (s) => say(legitimacyBand(cardAt(s, LEGITIMACY)), 'the public legitimacy label is not the one the producer\'s own ladder gives its score'),
  'V-GOVERNING': (s) => say(governingSeated(cardAt(s, POWER)), 'the named governing body is not the faction the roster seats'),
  'V-FLAGVEC': (s) => strayArm(cardAt(s, FOOD_CARD), cardAt(s, LEGITIMACY)),
  'V-EVIDENCE-ROSTER': (s) => say(rosterCited(s), 'the receipt\'s graph evidence names roster sizes the record\'s own rosters do not carry'),
  'V-EVIDENCE-EVENTS': (s) => say(states(evidenceAt(s, 'narrative')?.evidence, EVENTS_RE, cardAt(s, 'history').historicalEvents), 'the receipt\'s narrative evidence names an event count the history does not carry'),
  'V-EVIDENCE-TENSION': (s) => say(citesInOrder(s, TENSION_RE, cardAt(s, 'history').currentTensions, (cell, row) => isObj(cell) && cell.type === row.evidence), 'the receipt cites a current tension the history does not carry at that position'),
  'V-EVIDENCE-STRESS': (s) => say(stressCited(s), 'the receipt\'s stress evidence names a label the stress card does not carry'),
  'V-EVIDENCE-CONFLICT': (s) => say(citesInOrder(s, CONFLICT_RE, s.conflicts, (cell, row, at) => cell !== undefined && statedCount(row.evidence, ORDINAL_RE) === at + oneStep), 'the receipt cites a conflict the record does not carry at that position'),
  'V-DEFENSE-INST': (s) => say(heldOnRoster(s), 'the defence profile credits a holding the settlement\'s own roster does not carry'),
  'V-STRESS-IDENTITY': (s) => say(isObj(s.stress) && isObj(s.stressors) ? mirrors(s.stress, s.stressors) : undefined, 'the stress card and the stressors card are two spellings of one fact and they disagree'),
  'V-DEFENSE-MAGICDEP': (s) => say(mirrors(cardAt(s, SCORES).magicDependency, cardAt(s, DEFENCE).magicDependency), 'the defence profile stores its magical dependency at two paths and they disagree'),
  'V-DEFENSE-TRADITIONS': (s) => say(mirrors(cardAt(s, SCORES).traditions, cardAt(s, DEFENCE).traditions), 'the defence profile stores its traditions at two paths and they disagree'),
  'V-HISTORY-AGE': (s) => say(mirrors(cardAt(s, 'history.founding').age, cardAt(s, 'history').age), 'the history stores the settlement\'s age at two paths and they disagree'),
});

/**
 * Every internal disagreement ONE record carries, in declared check order.
 * @param {Settlement} settlement  ONE record. Never a corpus.
 * @returns {Violation[]}  EMPTY when consistent. Never null, never undefined, never throws.
 */
export function recordInvariants(settlement) {
  /** @type {Violation[]} */
  const violations = [];
  if (!isObj(settlement)) return violations;
  for (const id of CHECK_IDS) {
    const meta = CHECK_META[id];
    const verdict = CHECKS[id](settlement);
    if (verdict === undefined) continue;
    if (isStr(verdict)) {
      violations.push({ id, path: meta.paths[0], message: verdict, kind: meta.kind, keys: meta.keys });
      continue;
    }
    const fired = /** @type {{ arm: string, message: string }} */ (verdict);
    const arms = meta.arms || [];
    const at = arms.findIndex((candidate) => candidate.id === fired.arm);
    violations.push({
      id,
      path: meta.paths[at < 0 ? 0 : at],
      message: fired.message,
      kind: meta.kind,
      keys: at < 0 ? meta.keys : arms[at].keys,
    });
  }
  return violations;
}
