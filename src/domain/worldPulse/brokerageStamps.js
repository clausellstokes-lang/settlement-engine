/**
 * domain/worldPulse/brokerageStamps.js — [W-I INFORMATION BROKERAGES] I2, THE RELIABILITY
 * LADDER (docs/DESIGN_INFORMATION_BROKERAGES.md §5 primary effect, §10 crown jewel).
 *
 * WHAT A STAMP IS. Where an information house stands, the settlement's derived news view
 * grades each item on a closed four-rung ladder: confirmed, corroborated, reported,
 * tavern_talk. Everywhere else the news reads exactly as it does today, because the
 * game's baseline uncertainty is UNLABELLED BY DESIGN (§5). A stamp is therefore never a
 * decoration: it is a claim about the world that the calibration-honesty envelope
 * (tests/domain/brokerageCalibration.test.js) checks against ground truth the sim
 * already knows.
 *
 * THE STAMP IS EARNED, NEVER DRAWN. There is no rng in this file and no constant grade.
 * A grade is a pure function of the telling's ACTUAL provenance, read off the rumour
 * arrival record the settlement already holds.
 *
 * ── WHAT THE PROVENANCE MEASUREMENT SAID (2026-08-01, and it changed the design) ──
 *
 * Before authoring a single band this file's author measured the estate's own rumour
 * physics: 18,377 arrival records produced by the REAL advance (advanceRumorLedgers over
 * two witness topologies, thirty seeds, forty ticks each), each record's content compared
 * against the origin telling captured from an undegraded run. Two truth predicates were
 * measured, the CORE claim (what, where, scope, magnitude) and the STRICT claim (the core
 * plus the involved-party list):
 *
 *     hop 0   n= 2520   core 1.000   strict 1.000
 *     hop 1   n= 5036   core 0.765   strict 0.678
 *     hop 2   n= 5037   core 0.635   strict 0.502
 *     hop 3   n= 3506   core 0.534   strict 0.379
 *     hop 4   n= 2278   core 0.465   strict 0.288
 *
 *     roots 1  n=16019  core 0.679   strict 0.568
 *     roots 2  n= 2028  core 0.690   strict 0.571
 *     roots 3  n=  330  core 0.676   strict 0.570
 *
 * HOP COUNT PREDICTS TRUTH. CORROBORATION COUNT DOES NOT. That second line is the
 * finding, and it is not what the design's example phrasing ("confirmed by three roads")
 * assumes. The reason is mechanical: when a second telling of one event reaches a
 * settlement, rumorNetwork.mergeArrival keeps the BETTER telling by completeness and then
 * accuracy (pickBetterTelling). It does not take a vote. Corroboration therefore records
 * that several roads carried the story; it does not repair what the roads did to it.
 *
 * So the ladder is HOP-DRIVEN and corroboration rides the PROSE, where it is true: the
 * house can say the tale came in on another road without claiming that made it truer.
 * Making corroboration lift a rung would put a number on the stamp that the world does
 * not honour, and the envelope in §10 would be measuring a lie. RECORDED SEAM: give
 * mergeArrival a consensus rule over independent roots and corroboration becomes
 * predictive; that is an engine change to the rumour merge, out of I2's scope, and until
 * it happens the honest ladder is this one.
 *
 * ── COMPETENCE DECIDES WHAT A HOUSE WILL VOUCH FOR, NOT HOW LOUDLY ──
 *
 * The authored channel-competence table (I1, data/informationBrokerageTuning.js) enters
 * a stamp in two places, both of which can only ever make a house QUIETER:
 *
 *   • BELOW the vouch floor the house declines the channel outright and emits no stamp.
 *     A Rookery does not grade a grain dispatch; a Listening post does not grade the
 *     underworld. Silence, never a guess.
 *   • BELOW the sharp floor the house may not award the top rung, whatever the
 *     provenance. It will say corroborated where a guild would say confirmed.
 *
 * That direction is deliberate and it is what keeps the crown jewel provable. Capping
 * moves high-truth items DOWN the ladder, so every rung's observed truth rate can only
 * RISE above its declared band. An arrangement in which competence LIFTED a rung would
 * put low-provenance items into high rungs and break the envelope by construction.
 *
 * ── PURITY, DORMANCY, FIRST PAINT ──
 *
 * PURE: no rng, no wall clock, no mutation, no tier or entitlement read, no store. The
 * gate reads the virtual flag INLINE rather than importing the belief engine, which is
 * the settlementRumors.js precedent for a read-model selector (a stamp is surfaced by the
 * Herald read model, and dragging beliefMap into that chunk to answer a boolean would be
 * the lazy-import-reparents-the-closure defect). tests/domain/brokerageStamps.test.js
 * pins this local reading against the canonical beliefsActive / infoStatecraftActive
 * predicates over a totality table, so the duplicate can never drift.
 *
 * Every accessor is TOTAL and fails CLOSED: an unknown channel, an unrecognised roster,
 * an absent arrival record, or a dark flag all read as "no stamp", never as a default
 * grade.
 */

import { clamp01 } from '../../kernel/math.js';
import { isLiveInstitution } from '../institutions/institutionRoster.js';
// The canonical id slug, a true dependency-free leaf (its own docblock's whole point), so
// the Herald read model's chunk pays nothing for it.
import { stablePart } from './stablePart.js';
import {
  INFORMATION_CHANNELS,
  INFORMATION_BROKERAGE_TUNING,
  brokerageChannelCompetence,
  brokerageFormOf,
  brokerageLegalityOf,
  isInformationBrokerage,
} from '../../data/informationBrokerageTuning.js';

// ── The closed ladder (design §5) ────────────────────────────────────────────

/**
 * THE RELIABILITY LADDER, best first. Closed vocabulary; a value outside it is not a
 * grade, and every table below is derived from THIS array rather than re-spelling it, so
 * a rung cannot exist in one place and be missing from another.
 * @type {readonly string[]}
 */
export const RELIABILITY_LADDER = Object.freeze([
  'confirmed', 'corroborated', 'reported', 'tavern_talk',
]);

/** Rung index of a grade token, or -1. @param {unknown} grade @returns {number} */
export function reliabilityRungOf(grade) {
  return RELIABILITY_LADDER.indexOf(typeof grade === 'string' ? grade : '');
}

/**
 * THE DECLARED TRUTH BANDS: the rate at or above which items carrying each grade must
 * actually be true, over a seeded corpus, against ground truth. This object is the
 * THEOREM the stamps carry (design §10) and the envelope executes it.
 *
 * Authored UNDER the measured strict-predicate rates quoted in the header, with margin:
 * confirmed measured 1.000 against a declared 0.90, corroborated 0.678 against 0.60,
 * reported (hops two and three pooled) 0.452 against 0.40, tavern_talk 0.288 against
 * 0.15. The margins absorb tuning drift in the rumour weathering rolls; a tuning edit
 * that erased them would red the envelope rather than ship a stamp that lies.
 * @type {Readonly<Record<string, number>>}
 */
export const RELIABILITY_TRUTH_BANDS = Object.freeze({
  confirmed: 0.90,
  corroborated: 0.60,
  reported: 0.40,
  tavern_talk: 0.15,
});

/**
 * The declared truth band of a grade, or 0 for anything that is not a grade (fails
 * closed: an unknown token promises nothing).
 * @param {unknown} grade @returns {number}
 */
export function reliabilityBandOf(grade) {
  const key = typeof grade === 'string' ? grade : '';
  return Object.prototype.hasOwnProperty.call(RELIABILITY_TRUTH_BANDS, key)
    ? RELIABILITY_TRUTH_BANDS[key] : 0;
}

// ── The authored stamp tuning (PROPOSED, soak-vetoable) ──────────────────────

/**
 * THE HOP LADDER. Index i holds the number of relay hops at which a telling FALLS OUT of
 * rung i. Read through `rungOfHopCount`. Derived from the measurement in the header:
 * firsthand is the only rung the world lets a house call confirmed, one relay still
 * carries two thirds of the truth, two and three relays are the ordinary middle, and a
 * telling four roads old is talk.
 * @type {readonly number[]}
 */
const HOP_RUNG_BOUNDS = Object.freeze([1, 2, 4]);

export const BROKERAGE_STAMP_TUNING = Object.freeze({
  /** Below this channel competence the house declines the channel and emits no stamp. */
  CHANNEL_VOUCH_FLOOR: 0.30,
  /** Below this channel competence the house may not award the top rung. */
  SHARP_VOUCH_FLOOR: 0.70,
  /**
   * Below this source-credibility weight (the statecraft credibility stock read, neutral
   * 1.0) the house demotes the telling one rung. A proven liar's word is graded down, and
   * because demotion only ever lowers a grade it cannot break the envelope.
   */
  DEMOTING_CREDIBILITY: 0.85,
  /** The hop bounds above, exposed for the pins. */
  HOP_RUNG_BOUNDS,
});

/**
 * The rung a telling earns from its relay count alone, before any cap or demotion.
 * Total: a negative, absent or unreadable hop count reads as the bottom rung rather than
 * as firsthand.
 * @param {unknown} hopCount @returns {number} index into RELIABILITY_LADDER
 */
export function rungOfHopCount(hopCount) {
  const hops = typeof hopCount === 'number' && Number.isFinite(hopCount)
    ? Math.max(0, Math.floor(hopCount)) : Number.POSITIVE_INFINITY;
  for (let rung = 0; rung < HOP_RUNG_BOUNDS.length; rung += 1) {
    if (hops < HOP_RUNG_BOUNDS[rung]) return rung;
  }
  return RELIABILITY_LADDER.length - 1;
}

// ── The houses standing in a settlement (the presence gate) ──────────────────

/**
 * @typedef {Object} BrokerageHouse
 * @property {string} legality  'legal' or 'illegal'
 * @property {string} form      'minor' or 'major'
 */

/**
 * @typedef {Object} BrokerageHouseRecord
 * @property {string} institutionId  the capture-addressable slug (see `brokerageHouseRosterIn`)
 * @property {string} name           the house's roster name, for the legible line
 * @property {string} legality       'legal' or 'illegal'
 * @property {string} form           'minor' or 'major'
 */

/** @param {unknown} v @returns {string} */
function text(v) {
  return typeof v === 'string' ? v : String(v == null ? '' : v);
}

/**
 * THE PRESENCE GATE. The information houses STANDING on an institution roster, in a
 * deterministic order (legality then form, both from the closed I1 vocabularies). Reads
 * ONLY the declared service keys and governed tags, never a name, so a custom
 * brokerage-class institution counts exactly as a native one does.
 *
 * STANDING IS MEANT LITERALLY — THE RUIN FILTER (coherence audit R3, the ruin-filter
 * class; K1's hasPrison reasoning applied to news). A calamity-ruined, abandoned or
 * economically-closed house is left SITTING in `settlement.institutions`, stamped
 * `_worldPulseInactive` and a non-active status, and it can no more weigh a telling than a
 * flattened gaol can hold a prisoner: there are no correspondents left to have heard it and
 * no register left to grade it against. So every candidate is put through the canonical
 * predicate (institutionRoster.isLiveInstitution) before it can become a house. This is the
 * ONE place either half of I2 turns a roster into houses, so both the stamp and the fidelity
 * floor inherit the filter here rather than re-spelling it — including the raw roster
 * `heraldItemReliability` hands down below, which is filtered by this call and not before.
 * Impairment is deliberately NOT liveness: a corrupt house still trades, corruptly.
 *
 * An empty result is the whole of "elsewhere the news reads as today": no house, no
 * stamp, and the read model adds no key at all.
 *
 * @param {readonly unknown[]|null|undefined} institutions a settlement's roster
 * @returns {readonly BrokerageHouse[]}
 */
export function brokerageHousesOf(institutions) {
  /** @type {BrokerageHouse[]} */
  const houses = [];
  const seen = new Set();
  for (const record of buildHouseRoster(institutions)) {
    const key = `${record.legality}:${record.form}`;
    if (seen.has(key)) continue;
    seen.add(key);
    houses.push({ legality: record.legality, form: record.form });
  }
  houses.sort((a, b) => (a.legality < b.legality ? -1 : a.legality > b.legality ? 1
    : (a.form < b.form ? -1 : a.form > b.form ? 1 : 0)));
  return Object.freeze(houses);
}

/**
 * THE SAME PRESENCE GATE, KEEPING THE IDENTITIES (W-I I3). `brokerageHousesOf` answers
 * "what can this settlement grade" and collapses two listening posts into one competence,
 * which is right for a stamp and wrong for a patron: two houses can serve two powers. This
 * accessor is the un-collapsed roster, and it is the ONE place a house gets an id.
 *
 * THE ID IS THE CAPTURE MACHINERY'S, NOT A NEW ONE. `stablePart(id or name or label or the
 * positional fallback)` is exactly what factionCompetition's institution target uses, so a
 * binding here addresses the same institution `faction_institution_capture` accretes into
 * `controlledInstitutions`. The positional fallback therefore has to be computed over the
 * RAW roster index (before the ruin filter drops anything), which is why the walk indexes
 * first and filters second.
 *
 * IT TAKES THE SETTLEMENT, NOT THE ROSTER, and that shape is structural rather than
 * convenient. The ruin-filter ratchet (tests/lint/ruinFilterRoster.walker.test.js) is
 * FILE-GRANULAR: any domain file that reads a raw institution roster must itself name the
 * canonical liveness predicate. Every I3/I4 consumer wants houses rather than rows, so
 * taking the settlement here keeps the raw roster read inside the ONE file that owns the
 * filter and leaves the service, patronage and plant leaves with no roster read at all.
 * That is the ratchet's intent satisfied structurally rather than an exemption negotiated.
 *
 * RECORDED EDGE: the capture chooser looks at the first twelve institutions only, so a
 * house sitting past that window can be bound but never captured. That is the capture
 * layer's own bound, not this reader's, and narrowing the roster here to match would hide
 * the house from the patronage derivation entirely, which is worse: a house nobody can
 * take still serves the power it was born serving.
 *
 * @param {{ institutions?: unknown }|null|undefined} settlement
 * @returns {readonly BrokerageHouseRecord[]}
 */
export function brokerageHouseRosterIn(settlement) {
  const host = asObject(settlement);
  return buildHouseRoster(Array.isArray(host.institutions) ? host.institutions : null);
}

/** The shared walk. `brokerageHousesOf` (the stamp side) and `brokerageHouseRosterIn` (the
 *  patron side) both come through here, so the ruin filter has exactly one spelling.
 *  @param {readonly unknown[]|null|undefined} institutions
 *  @returns {readonly BrokerageHouseRecord[]} */
function buildHouseRoster(institutions) {
  /** @type {BrokerageHouseRecord[]} */
  const out = [];
  (Array.isArray(institutions) ? institutions : []).forEach((candidate, index) => {
    if (!isLiveInstitution(candidate)) return;
    if (!isInformationBrokerage(candidate)) return;
    const legality = brokerageLegalityOf(candidate);
    const form = brokerageFormOf(candidate);
    if (!legality || !form) return;
    const entry = asObject(candidate);
    const name = text(entry.name || entry.label || entry.id || `Institution ${index + 1}`);
    out.push({
      institutionId: stablePart(entry.id || entry.name || entry.label || `institution_${index}`),
      name,
      legality,
      form,
    });
  });
  return Object.freeze(out);
}

/**
 * The best competence any standing house has in one channel, 0 when none of them reads
 * that channel at all (or when the channel is outside the closed vocabulary). This is the
 * number both effects read: the stamp uses it to decide what the settlement will vouch
 * for, and the fidelity term uses it to decide how much sharper local belief gets.
 *
 * @param {readonly BrokerageHouse[]|null|undefined} houses
 * @param {unknown} channel one of INFORMATION_CHANNELS
 * @returns {number} in [0, FIDELITY_CEILING]
 */
export function houseChannelCompetence(houses, channel) {
  if (!INFORMATION_CHANNELS.includes(text(channel))) return 0;
  let best = 0;
  for (const house of Array.isArray(houses) ? houses : []) {
    const value = brokerageChannelCompetence(house?.legality, house?.form, channel);
    if (value > best) best = value;
  }
  return Math.min(best, INFORMATION_BROKERAGE_TUNING.FIDELITY_CEILING);
}

// ── The Herald channel read (a section is not a channel) ─────────────────────

/**
 * THE SECTION TO CHANNEL MAP. The Herald files a news item under one of six SECTIONS; a
 * brokerage is competent in one of six CHANNELS, and the two vocabularies are not the
 * same list. This map is the join, and it is deliberately a table rather than a prose
 * scan of the headline (the Herald's own filing law).
 *
 * It is kept as a local copy rather than imported from domain/realm/heraldRouting.js for
 * the reason settlementRumors.js keeps its own copies: this leaf must stay light enough
 * to sit in the Herald read model's chunk. tests/domain/brokerageStamps.test.js imports
 * the canonical HERALD_SECTIONS and asserts this map covers it EXACTLY both ways, so a
 * section added upstream reds here instead of falling through to a default.
 * @type {Readonly<Record<string, string>>}
 */
export const HERALD_SECTION_CHANNEL = Object.freeze({
  war: 'war',
  faith: 'faith',
  trade: 'trade',
  // The realm's civic lane. A ruling, a docket order and a general realm matter are all
  // read by the same correspondents who read a court, so they price as politics.
  politics: 'politics',
  events: 'politics',
  adjudication: 'politics',
  // A forecast has not happened yet, so no telling of it can have travelled and the
  // fail-closed provenance rule leaves it unstamped in practice. It is mapped anyway so
  // the table stays total against the section vocabulary.
  divination: 'politics',
});

/**
 * The channel a Herald item prices in. A named person among the item's subjects wins over
 * the section, because a story about a wanderer IS the persons channel whatever door it
 * came through, and the persons channel is the mechanical bridge the consequences design
 * asks for. Total: an unreadable section yields null and the caller emits no stamp.
 *
 * @param {unknown} section a Herald section token
 * @param {readonly unknown[]|null|undefined} subjectKinds the item's subject kinds
 * @returns {string|null}
 */
export function heraldChannelOf(section, subjectKinds) {
  for (const kind of Array.isArray(subjectKinds) ? subjectKinds : []) {
    if (text(kind) === 'npc') return 'persons';
  }
  const key = text(section);
  return Object.prototype.hasOwnProperty.call(HERALD_SECTION_CHANNEL, key)
    ? HERALD_SECTION_CHANNEL[key] : null;
}

// ── The gate (design Law 5) ──────────────────────────────────────────────────

/** @param {unknown} v @returns {Record<string, unknown>} */
function asRules(v) {
  return v != null && typeof v === 'object' && !Array.isArray(v)
    ? /** @type {Record<string, unknown>} */ (v) : {};
}

/**
 * THE ONE GATE, for both halves of I2 (design Law 5: infoStatecraftActive AND the virtual
 * `informationBrokeragesEnabled`, which has no entry in DEFAULT_SIMULATION_RULES). False
 * ⇒ no stamp is ever derived and the fidelity term is never built ⇒ byte-identical.
 *
 * The three canonical conjuncts are read INLINE here (see the module header): the spatial
 * canon marker plus a non-omniscient info mode is beliefsActive, and the statecraft flag
 * on top of it is infoStatecraftActive. The parity pin holds this equal to the canonical
 * predicates over a totality table.
 *
 * Takes `unknown` deliberately: the read model hands it whatever a campaign carries, and a
 * gate that had to be given a well-typed world before it could refuse would be no gate.
 * @param {unknown} worldState
 * @returns {boolean}
 */
export function brokerageEffectsActive(worldState) {
  if (!worldState || typeof worldState !== 'object') return false;
  const world = /** @type {{ spatialCanonVersion?: unknown, simulationRules?: unknown }} */ (worldState);
  const marker = world.spatialCanonVersion;
  if (!(Number.isInteger(marker) && Number(marker) > 0)) return false;
  const rules = asRules(world.simulationRules);
  const mode = rules.infoMode;
  if (mode !== 'perfect_delayed' && mode !== 'unreliable' && mode !== 'full' && mode !== 'delayed') return false;
  return rules.infoStatecraftEnabled === true && rules.informationBrokeragesEnabled === true;
}

// ── The stamp (the earned grade + its in-world sentence) ─────────────────────

/**
 * @typedef {Object} ReliabilityStamp
 * @property {string} grade    a member of RELIABILITY_LADDER
 * @property {string} channel  the channel the house graded it in
 * @property {string} label    the glance reading (legibility law, no numbers)
 * @property {string} detail   the sentence reading (legibility law, no numbers)
 * @property {number} band     the declared truth rate this grade claims
 */

/** The glance label of each rung, in the ladder's own order. @type {readonly string[]} */
const RUNG_LABELS = Object.freeze(['Confirmed', 'Corroborated', 'Reported', 'Tavern talk']);

/**
 * THE SENTENCE IS BUILT IN THREE HONEST PIECES, and the split is not cosmetic. What the
 * house is WILLING TO SAY is the graded rung, which competence and a discredited source
 * can lower. Where the tale CAME FROM is the raw hop count, which nothing lowers. Keeping
 * them apart is what stops a capped stamp from lying about the road: a guildless house
 * reading a firsthand report says it will stand behind the tale AND that it had the tale
 * from its own ears, and a reader can see the caution for what it is.
 * @type {readonly string[]}
 */
const RUNG_SENTENCES = Object.freeze([
  'The house sets its own name to this.',
  'The house will stand behind this.',
  'The house passes this on as it came.',
  'The house keeps this as talk.',
]);

/**
 * Where the tale came from, by hop count. Always true of the telling, never graded.
 * @type {readonly string[]}
 */
const SOURCE_SENTENCES = Object.freeze([
  ' It had this from its own ears, in the place it happened.',
  ' It had this from a rider who stood one road away.',
  ' It has this at second hand, and the road behind it runs on.',
  ' It has this from far down the road, through hands it cannot name.',
]);

/** The corroboration clause, which reports the roads WITHOUT claiming they graded it. */
const ONE_OTHER_ROAD = ' It came in again on another road.';
const MANY_OTHER_ROADS = ' It came in again on other roads.';

/**
 * @typedef {Object} StampProvenance
 * @property {unknown} [hopCount]            relay hops behind the telling (0 is firsthand)
 * @property {unknown} [independentSources]  independent origin tellings behind it
 * @property {unknown} [credibility01]       the source-credibility weight, neutral 1
 */

/**
 * THE STAMP. The grade a settlement's houses put on one news item, or null when no house
 * stands, no house will vouch for the channel, or the item carries no provenance at all.
 *
 * Pure and total. The order is load bearing: the provenance EARNS a rung, competence may
 * only lower it, and a discredited source may only lower it again.
 *
 * @param {Object} args
 * @param {readonly BrokerageHouse[]|null|undefined} args.houses the settlement's houses
 * @param {unknown} args.channel the channel the item prices in
 * @param {StampProvenance|null|undefined} args.provenance the telling's actual provenance
 * @returns {ReliabilityStamp|null}
 */
export function newsReliabilityStamp({ houses, channel, provenance }) {
  const channelKey = text(channel);
  if (!INFORMATION_CHANNELS.includes(channelKey)) return null;
  if (!provenance || typeof provenance !== 'object') return null;
  const competence = houseChannelCompetence(houses, channelKey);
  const T = BROKERAGE_STAMP_TUNING;
  if (competence < T.CHANNEL_VOUCH_FLOOR) return null;

  const sourceRung = rungOfHopCount(provenance.hopCount);
  let rung = sourceRung;
  // Competence may only make the house quieter (module header, the envelope's guarantee).
  if (competence < T.SHARP_VOUCH_FLOOR && rung < 1) rung = 1;
  const credibility = typeof provenance.credibility01 === 'number' && Number.isFinite(provenance.credibility01)
    ? provenance.credibility01 : 1;
  if (credibility < T.DEMOTING_CREDIBILITY) rung += 1;
  if (rung > RELIABILITY_LADDER.length - 1) rung = RELIABILITY_LADDER.length - 1;

  const roots = typeof provenance.independentSources === 'number' && Number.isFinite(provenance.independentSources)
    ? Math.max(1, Math.floor(provenance.independentSources)) : 1;
  const clause = roots >= 3 ? MANY_OTHER_ROADS : (roots === 2 ? ONE_OTHER_ROAD : '');
  const grade = RELIABILITY_LADDER[rung];
  return {
    grade,
    channel: channelKey,
    label: RUNG_LABELS[rung],
    detail: `${RUNG_SENTENCES[rung]}${SOURCE_SENTENCES[sourceRung]}${clause}`,
    band: clamp01(reliabilityBandOf(grade)),
  };
}

// ── The Herald seam (the settlement's derived news view) ─────────────────────

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v != null && typeof v === 'object' && !Array.isArray(v)
    ? /** @type {Record<string, unknown>} */ (v) : {};
}

/**
 * The rumour ledgers, read WITHOUT importing the frozen-digest reader. The nested read is
 * four lines and distanceRead.js is fifty-three kilobytes whose own docblock says it never
 * reaches first paint; a read model that only needs one nested property must not drag it
 * into the Herald's chunk. tests/domain/brokerageStamps.test.js pins this read equal to
 * getSpatialLedger over a tolerance table so the copy cannot drift.
 * @param {unknown} worldState @returns {Record<string, unknown>}
 */
function rumorLedgersOf(worldState) {
  return asObject(asObject(asObject(worldState).spatialLedgers).rumorLedgers);
}

/**
 * The sharpest telling of an event a settlement holds, over every carrier that brought it.
 * Deterministic total order: fewest hops, then most independent roots, then codepoint of
 * the ledger key. Null when the settlement never heard of it, which is the fail-closed
 * reading that leaves the item unstamped.
 * @param {unknown} ledger the settlement's rumour ledger
 * @param {ReadonlySet<string>} refs the event references this item could be recorded under
 * @returns {{ hopCount: number, independentSources: number }|null}
 */
function sharpestTelling(ledger, refs) {
  /** @type {{ key: string, hopCount: number, independentSources: number }|null} */
  let best = null;
  for (const [key, value] of Object.entries(asObject(ledger))) {
    const record = asObject(value);
    if (!refs.has(text(record.eventRef))) continue;
    const hopCount = typeof record.hopCount === 'number' && Number.isFinite(record.hopCount)
      ? Math.max(0, Math.floor(record.hopCount)) : Number.MAX_SAFE_INTEGER;
    const roots = Array.isArray(record.corroborationRoots) ? record.corroborationRoots.length : 1;
    const row = { key, hopCount, independentSources: Math.max(1, roots) };
    if (!best || row.hopCount < best.hopCount
      || (row.hopCount === best.hopCount && row.independentSources > best.independentSources)
      || (row.hopCount === best.hopCount && row.independentSources === best.independentSources && row.key < best.key)) {
      best = row;
    }
  }
  return best ? { hopCount: best.hopCount, independentSources: best.independentSources } : null;
}

/**
 * @typedef {Object} HeraldReliability
 * @property {string} grade
 * @property {string} channel
 * @property {string} label
 * @property {string} detail
 * @property {number} band
 * @property {string} graderId  the settlement whose house graded it (the address law)
 */

/**
 * THE HERALD SEAM. The reliability stamp one news item carries, or NULL, which is the
 * common case and the whole of "elsewhere the news reads as today". Null is returned when
 * the layer is dark, when no settlement on the item's address hosts a house, when no
 * standing house will vouch for the item's channel, or when no settlement that could grade
 * it ever actually heard the telling.
 *
 * The grading settlement is chosen from the item's own address chain in the read model's
 * order, taking the FIRST hosting settlement that also holds a telling: a house grades the
 * news of the place it stands in, and it cannot grade what never reached it.
 *
 * DEFERRED, RECORDED: the credibility demotion (a discredited origin costs a rung) is
 * implemented and pinned in `newsReliabilityStamp`, but this seam does not yet supply
 * `credibility01`. The stock lives behind the statecraft module's own tuning and the slice
 * that reads it for the QUERY service (I3) is the one that should wire it here; passing a
 * hand-rolled second reading of the stock would fork the credibility math.
 *
 * @param {Object} args
 * @param {unknown} args.worldState the campaign world state
 * @param {Map<string, Record<string, unknown>>|null|undefined} args.settlements id to settlement
 * @param {unknown} args.section the item's Herald section
 * @param {readonly unknown[]|null|undefined} args.subjects the item's subject descriptors
 * @param {unknown} args.source the item's raw source record
 * @returns {HeraldReliability|null}
 */
export function heraldItemReliability({ worldState, settlements, section, subjects, source }) {
  if (!brokerageEffectsActive(worldState)) return null;
  const rows = Array.isArray(subjects) ? subjects.map(asObject) : [];
  const channel = heraldChannelOf(section, rows.map((row) => row.kind));
  if (!channel) return null;
  const record = asObject(source);
  const outcome = asObject(record.outcome);
  const refs = new Set([record.sourceEventId, record.id, outcome.sourceEventId, outcome.id]
    .map(text).filter((value) => value !== ''));
  if (refs.size === 0) return null;
  const ledgers = rumorLedgersOf(worldState);
  const index = settlements instanceof Map ? settlements : new Map();
  for (const row of rows) {
    if (text(row.kind) !== 'settlement') continue;
    const settlementId = text(row.id);
    const institutions = asObject(index.get(settlementId)).institutions;
    const houses = brokerageHousesOf(Array.isArray(institutions) ? institutions : null);
    if (houses.length === 0) continue;
    const provenance = sharpestTelling(ledgers[settlementId], refs);
    if (!provenance) continue;
    const stamp = newsReliabilityStamp({ houses, channel, provenance });
    if (stamp) return { ...stamp, graderId: settlementId };
  }
  return null;
}
