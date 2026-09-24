/**
 * domain/worldPulse/infoLure.js — IN-2, THE LURE: lies that BAIT, not only deter.
 * (docs/DESIGN_FP_ARCHITECTURE.md §5 #18 and §4's IN paragraph; docs/DESIGN_FP_ARCH_IN.md
 * §3 and §4 IN-2, NORMATIVE; docs/DESIGN_FP_INFORMATION.md §4 and §5 IN-2; the fold's §12.2
 * row 14; R-28.)
 *
 * A PURE LEAF of the information-statecraft writer family (ruling R-BLD-4: the single-writer
 * law reads ONE WRITER FAMILY, never one file). `informationStatecraft.processLies` stays the
 * family head and the ONE writer of `spatialLedgers.disinfo`; this leaf owns the law it
 * consults and the shapes it folds, and mutates nothing.
 *
 * ── WHAT LANDS HERE ──────────────────────────────────────────────────────────────
 *   THE AXIS MODEL (§4): a disinfo record MAY carry `axis`, `assertedValue`, `trueValue` and
 *     `intent`, four conditional fields spelled into a record by ONE function, `lureRecordOf`.
 *     ABSENT `axis` IS THE LEGACY STRENGTH SEMANTICS (`assertedBand`/`trueBand`), so every
 *     record already in a save reads exactly as it did: the only migration is no migration.
 *   THE ONE EXPOSURE LAW, AXIS-TYPED (J-INF-3): `lieExposure`. A strength record is judged by
 *     band distance (the head's own law, moved here byte for byte), a rung axis by distance on
 *     its own ladder at the SAME tolerance (borrowed, never re-authored), the live `faithLabel`
 *     axis by label inequality (J-INA-3: "stated, not discovered"). One age arm for every axis.
 *   THE TWO-CHANNEL RULING (J-INA-2): the envoy-picture plant channel is per-errand and
 *     ephemeral; this channel is the persistent belief axis. The axis tokens are axis NAMES,
 *     never belief-field names, because two of those (the strength band and the stores band)
 *     ARE picture fields; `LURE_AXES` therefore shares no token with the picture vocabulary and
 *     this file quotes none of that channel's words or machinery. The pin is a source scan in
 *     the acceptance file.
 *   THE SPRING (the weakness bait): a deflate strength lie standing in a mark's reckoning, and
 *     the mark's OWN march on that very court, decided a tick after the story landed and on
 *     exactly the band it asserted, stamped by the built misjudgment detector (which stamps the
 *     chooser's resolved deploy and nothing else). `lure_sprung` joins the two. No new
 *     consequence wiring: opportunism's foe half already scores believed weakness.
 *   BLUFF AGAINST BLUFF, ON THE EXPIRY ARM: when an aged-out bluff is exposed while the
 *     audience's own counter-bluff was standing in the liar's court, the receipt names both.
 *   THE COMMISSION (R-28): the DM's lie commission is a DIRECTION over the plant road with an
 *     axis-typed subject, DEFINED here in `operations.js`'s OpTypeDeclaration shape, with its
 *     predicate `plantChannel` in `worldConditions.js`'s liveRow shape; both are proven
 *     HEADLESS. IN-2-c: the commission's consumer lands when U123 composes the direction
 *     transport. `lureCommission` is the producer that consumer will call.
 *
 * ── J-FP-5, RE-MEASURED AT THIS BUILD (bfe4830d0) ─────────────────────────────────
 * SP-B's families are LIVE substrate (`beliefAxisSubjects.js`), so every family's AXIS, its
 * record, its exposure law and its commission land HERE, and a planted family is read at once
 * by the jaws that already exist: GR-2's trade-demand trigger reads believed scarcity, pull and
 * devotion (`pactFormation.js`), and WR-10's appraisal reads believed stores and route
 * (`sovereigntyMarketStage.js :: beliefLegsOf`). The DM-truth JOIN beats for those springs (the
 * annex's WEALTH and DEVOTION sub-pools of `lure_sprung`) are IN-2b. `axisFamiliesGrewSinceIn2`
 * is authored against the AT-BUILD family set so neither the slice nor a new family can ghost.
 *
 * ── THE COUNTERPARTY (L10 (c)) ────────────────────────────────────────────────────
 * Real-only for the spring and for the commission's subject and mark: a phantom is a hidden
 * library row that never enters a campaign's courts (judgment FP-12), so every court this leaf
 * reads comes from the snapshot and a phantom is excluded BY CONSTRUCTION, never by a second
 * reading of the discriminant (`edit/phantoms.js`'s importer roster stays exact).
 *
 * PURE, TOTAL, ZERO-DRAW: no rng, no hash, no clock, no store, no mutation. The bait selection
 * takes the candidate marks softest ground first by an INJECTED reader (the volume's "aim
 * through IN-1's mirror": this leaf imports no mirror, because IN-1's fence pins the mirror's
 * one render-time caller and names a pulse-side importer as its regression; the consumer that
 * lands at U123 injects it, with that fence's ruling), then by codepoint, and takes the first
 * the bait would move; the mouthpiece is the lowest id the one participation chokepoint admits:
 * no weight, no fork, nothing for the chooser registry to classify.
 *
 * @enforced-by tests/domain/infoLureIn2.test.js
 * @enforced-by tests/lint/infoLureKindPools.walker.test.js
 */

import { compareCodepoint } from '../deterministicSort.js';
import { clamp } from '../../kernel/math.js';
import { beliefsActive, strengthBandOf } from './beliefMap.js';
import { subjectAxesActive } from './beliefAxes.js';
import { LIE_TUNING, applyBeliefOverrides, seatBeliefRecord } from './disinformationPlant.js';
import {
  CONDITIONS_KEYS, DEVOTION_BANDS, PULL_BANDS, ROUTE_POSITION_BANDS, SCARCITY_BANDS,
  STORES_BANDS, SUBJECT_AXIS_FIELDS,
} from './beliefAxisSubjects.js';
import { REGIONAL_GOOD_CATEGORIES } from '../region/goodsCatalog.js';
import { BROKERAGE_SERVICE_MENU_KEYS, servicesAvailable } from './brokerageServices.js';
import { brokerageEffectsActive, brokerageHouseRosterIn } from './brokerageStamps.js';
import { makeOpportunismRead } from './opportunism.js';
import { OFF_STAGE_STATUSES, isOffStage } from '../roads/state.js';
import { NPC_UNAVAILABLE_STATUSES, importanceWeight } from '../entities/npcs.js';
import { npcId } from './npcAgency.js';
import { npcCredibilityActive } from './npcCredibility.js';
import { stablePart } from './stablePart.js';
import { informationReceipt } from './informationNews.js';

/** @typedef {import('./beliefMap.js').BeliefRecord} BeliefRecord */
/** @typedef {Record<string, unknown>} Row */

/** @param {unknown} v @returns {Row} */
function asObject(v) {
  return v != null && typeof v === 'object' && !Array.isArray(v) ? /** @type {Row} */ (v) : {};
}
/** The head's own spelling, kept identical so the legacy arm is the head's law exactly.
 *  @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {unknown} v @returns {string} */
function strictText(v) {
  return typeof v === 'string' && v.length > 0 && v.trim() === v ? v : '';
}

// ── THE GATE ──────────────────────────────────────────────────────────────────
/**
 * Is the lure LIT? Beliefs live (the spatial marker AND a non-omniscient infoMode) AND the
 * virtual flag, read BY NAME with the strict idiom; this is the ONE read of the key in the
 * tree. Its lighting-order preconditions (the brokerages, statecraft, the mirror) are the
 * LIT-n unit's to judge, never doors here; `processLies` only runs under statecraft anyway.
 * @param {unknown} worldState @returns {boolean}
 */
export function infoLureActive(worldState) {
  if (!beliefsActive(/** @type {Parameters<typeof beliefsActive>[0]} */ (asObject(worldState)))) return false;
  const rules = asObject(asObject(worldState).simulationRules);
  return rules.infoLureEnabled === true;
}

// ── THE VOCABULARIES ──────────────────────────────────────────────────────────
/**
 * HBF-72's OUTCOME VOCABULARY, minted where the lie's law lives and re-exported by the
 * writer, `informationStatecraft.js`, the fork's own module: a lie is TOLD (afield, not yet
 * holding), BELIEVED (the mark's reckoning sits on what was asserted) or CAUGHT (exposed).
 * `lieExposure` answers one of the three for every record. SAVE-DATA CONTRACT the day a
 * decree names one (L10 (e)).
 * @type {readonly string[]}
 */
export const LIE_OUTCOMES = Object.freeze(['told', 'believed', 'caught']);

/** How a bait reads in the mark's court under the world's live-strength restraint. */
export const LURE_ATTRACTIONS = Object.freeze(['attractive', 'refused', 'unattractive']);

/** The commission's closed refusals, codepoint-ordered (never a throw, never a silent drop). */
export const LIE_COMMISSION_REFUSALS = Object.freeze([
  'axis_dark', 'dark', 'no_house', 'no_lie', 'no_mark', 'no_truth', 'phantom_subject', 'value_off_axis',
]);

/** The strength axis. Its records keep the legacy spelling and carry NO `axis` key. */
export const STRENGTH_AXIS = 'strength';
const FAITH_AXIS = 'faith';
const DEVOTION_AXIS = 'devotion';
const SCARCITY_PREFIX = 'scarcity.';
/** The conditions stems the lure speaks; the belief key is `${stem}Band`, FOUND in SP-B's list. */
const CONDITIONS_STEMS = Object.freeze(['pull', 'routePosition', 'stores']);
/** @type {Readonly<Record<string, readonly string[]>>} */
const STEM_LADDERS = Object.freeze({ pull: PULL_BANDS, routePosition: ROUTE_POSITION_BANDS, stores: STORES_BANDS });

/** The strength classifier's own answers, derived (never typed): what a strength lie may assert. */
const STRENGTH_BAND_VALUES = Object.freeze(
  [...new Set(Array.from({ length: 101 }, (_, step) => strengthBandOf(step / 100)))].sort((a, b) => a - b),
);

/**
 * THE TRIPWIRE'S SET (§9 seam row 12): the SP-B families this wave was authored against, in
 * SP-B's own codepoint order. `axisFamiliesGrewSinceIn2` below holds it against the live list.
 * @type {readonly string[]}
 */
export const IN2_AXIS_FAMILIES = Object.freeze(['conditionsBands', 'devotionBand', 'scarcityBands']);

/**
 * `gate` names SP-B's own family switch (`beliefAxes.subjectAxesActive`), null where the axis
 * rides the base record (strength, faith) and can always be held.
 * @typedef {{ axis: string, kind: 'band'|'rung'|'label', field: string, key: string|null,
 *   ladder: readonly string[]|null, gate: 'scarcity'|'conditions'|'devotion'|null }} LureAxisSpec
 */

/** @returns {Map<string, LureAxisSpec>} */
function buildAxisSpecs() {
  /** @type {Map<string, LureAxisSpec>} */
  const specs = new Map();
  const [conditionsField, devotionField, scarcityField] = IN2_AXIS_FAMILIES;
  // The strength axis is read and written BY PROPERTY (`belief.strengthBand`), never by a
  // quoted field name: that word is also a picture-channel field, and J-INA-2's scan holds this
  // file to naming none of them.
  specs.set(STRENGTH_AXIS, { axis: STRENGTH_AXIS, kind: 'band', field: '', key: null, ladder: null, gate: null });
  specs.set(FAITH_AXIS, { axis: FAITH_AXIS, kind: 'label', field: 'faithLabel', key: null, ladder: null, gate: null });
  specs.set(DEVOTION_AXIS, {
    axis: DEVOTION_AXIS, kind: 'rung', field: devotionField, key: null, ladder: DEVOTION_BANDS, gate: 'devotion',
  });
  for (const stem of CONDITIONS_STEMS) {
    const key = CONDITIONS_KEYS.find((candidate) => candidate === `${stem}Band`);
    if (key) specs.set(stem, { axis: stem, kind: 'rung', field: conditionsField, key, ladder: STEM_LADDERS[stem], gate: 'conditions' });
  }
  for (const category of REGIONAL_GOOD_CATEGORIES) {
    const axis = `${SCARCITY_PREFIX}${category}`;
    specs.set(axis, { axis, kind: 'rung', field: scarcityField, key: category, ladder: SCARCITY_BANDS, gate: 'scarcity' });
  }
  return specs;
}
const AXIS_SPECS = buildAxisSpecs();

/**
 * THE CLOSED AXIS VOCABULARY, codepoint-ordered: strength, the live faith label, and every
 * SP-B family the lure may assert (devotion; three conditions stems; scarcity per good class).
 * Decree-addressable, so renaming a member is a §20.3 vocabulary move (L10 (e)).
 * @type {readonly string[]}
 */
export const LURE_AXES = Object.freeze([...AXIS_SPECS.keys()].sort(compareCodepoint));

/** The values one axis may assert: its ladder, the strength classifier's bands, or null (a label).
 *  @param {string} axis @returns {readonly (string|number)[]|null} */
export function lureAxisValues(axis) {
  const spec = AXIS_SPECS.get(String(axis));
  if (!spec) return null;
  return spec.kind === 'band' ? STRENGTH_BAND_VALUES : spec.ladder;
}

/**
 * THE TRIPWIRE (§9 seam row 12). When a family joins or leaves SP-B's `SUBJECT_AXIS_FIELDS`
 * (HB-6's doctrine sheet is the chartered next) this answers true, and the lure's vocabulary
 * is re-opened deliberately, never silently: the IN-2b spring joins read the same set.
 * @returns {boolean}
 */
export function axisFamiliesGrewSinceIn2() {
  return SUBJECT_AXIS_FIELDS.length !== IN2_AXIS_FAMILIES.length
    || SUBJECT_AXIS_FIELDS.some((field, index) => field !== IN2_AXIS_FAMILIES[index]);
}

// ── READING ONE AXIS OFF A BELIEF ─────────────────────────────────────────────
/** @param {LureAxisSpec} spec @param {unknown} belief @returns {string|number|null} */
function axisValueOf(spec, belief) {
  const record = asObject(belief);
  if (spec.kind === 'band') return typeof record.strengthBand === 'number' ? record.strengthBand : null;
  const held = record[spec.field];
  if (spec.key == null) return typeof held === 'string' && held ? held : null;
  const value = asObject(held)[spec.key];
  return typeof value === 'string' && value ? value : null;
}

/** @param {LureAxisSpec} spec @param {BeliefRecord} prior @param {string|number} value @returns {BeliefRecord} */
function withAxisValue(spec, prior, value) {
  if (spec.kind === 'band') return { ...prior, strengthBand: Number(value) };
  if (spec.key == null) return { ...prior, [spec.field]: value };
  const family = { ...asObject(asObject(prior)[spec.field]), [spec.key]: value };
  /** @type {Row} */
  const ordered = {};
  for (const key of Object.keys(family).sort(compareCodepoint)) ordered[key] = family[key];
  return { ...prior, [spec.field]: ordered };
}

/** The rung distance on a ladder, or null when either word is off it.
 *  @param {readonly string[]} ladder @param {unknown} a @param {unknown} b @returns {number|null} */
function rungGap(ladder, a, b) {
  const i = ladder.indexOf(String(a));
  const j = ladder.indexOf(String(b));
  return i < 0 || j < 0 ? null : Math.abs(i - j);
}

/** @param {LureAxisSpec} spec @param {unknown} asserted @param {unknown} truth @returns {'inflate'|'deflate'|null} */
function intentOf(spec, asserted, truth) {
  if (spec.kind === 'label') return null;
  const ladder = spec.ladder;
  const up = spec.kind === 'band'
    ? Number(asserted) - Number(truth)
    : (ladder ? ladder.indexOf(String(asserted)) - ladder.indexOf(String(truth)) : 0);
  return up > 0 ? 'inflate' : up < 0 ? 'deflate' : null;
}

// ── THE ONE EXPOSURE LAW ──────────────────────────────────────────────────────
/**
 * Judge ONE disinfo record against the audience's reckoning now. ABSENT `axis` ⇒ the legacy
 * strength law, spelled exactly as the head spelled it: `current` is the believed band (the
 * true band when the audience holds no record), contradicted at EXPOSE_CONTRADICT_BANDS. An
 * axis record reads its own field: a rung by ladder distance at the same tolerance (borrowed,
 * never re-authored), a label by inequality. A missing reading falls back to the record's own
 * true value, exactly as the legacy arm does. An unknown axis never contradicts and still ages.
 * @param {Row} rec @param {BeliefRecord|null} belief @param {number} now
 * @returns {{ current: unknown, contradicted: boolean, agedOut: boolean, outcome: string }}
 */
export function lieExposure(rec, belief, now) {
  const T = LIE_TUNING;
  const agedOut = now - Math.floor(finiteNumber(rec.seededTick, now)) >= T.EXPOSE_MAX_AGE_TICKS;
  const spec = rec.axis === undefined ? null : AXIS_SPECS.get(String(rec.axis)) || null;
  /** @type {unknown} */
  let current;
  let contradicted = false;
  let holds = false;
  if (rec.axis === undefined) {
    current = belief ? Math.round(finiteNumber(belief.strengthBand, T.INFLATE_BANDS)) : rec.trueBand;
    contradicted = Math.abs(Number(current) - Math.round(Number(rec.assertedBand))) >= T.EXPOSE_CONTRADICT_BANDS;
    holds = Number(current) === Math.round(Number(rec.assertedBand));
  } else if (spec) {
    const read = belief ? axisValueOf(spec, belief) : null;
    current = read == null ? rec.trueValue : read;
    if (spec.kind === 'label') {
      contradicted = current !== rec.assertedValue;
    } else {
      const gap = spec.kind === 'band'
        ? Math.abs(Math.round(Number(current)) - Math.round(Number(rec.assertedValue)))
        : rungGap(/** @type {readonly string[]} */ (spec.ladder), current, rec.assertedValue);
      contradicted = gap != null && gap >= T.EXPOSE_CONTRADICT_BANDS;
    }
    holds = current === rec.assertedValue;
  }
  const outcome = contradicted || agedOut ? LIE_OUTCOMES[2] : holds ? LIE_OUTCOMES[1] : LIE_OUTCOMES[0];
  return { current, contradicted, agedOut, outcome };
}

/**
 * The size of an exposed lie in bands, for the mouthpiece's personal charge. The legacy arm is
 * the head's expression verbatim; a rung lie is its ladder distance; a label lie is charged as
 * the lie law's own standard exaggeration (INFLATE_BANDS), borrowed rather than authored.
 * @param {Row} rec @returns {number}
 */
export function lieExposedBandOf(rec) {
  if (rec.axis === undefined) {
    return clamp(Math.abs(Math.round(finiteNumber(rec.assertedBand, 0)) - Math.round(finiteNumber(rec.trueBand, 0))), 0, 4);
  }
  const spec = AXIS_SPECS.get(String(rec.axis));
  if (!spec) return 0;
  if (spec.kind === 'label') return LIE_TUNING.INFLATE_BANDS;
  const gap = spec.kind === 'band'
    ? Math.abs(Math.round(Number(rec.assertedValue)) - Math.round(Number(rec.trueValue)))
    : rungGap(/** @type {readonly string[]} */ (spec.ladder), rec.assertedValue, rec.trueValue);
  return clamp(gap == null ? 0 : gap, 0, 4);
}

/** The parenthetical every legacy exposure has always carried, byte for byte. */
const LEGACY_CLAIM = '(that its strength was greater than it is)';

/**
 * WHAT THE LIE CLAIMED, as the exposure receipt's parenthetical. A court's own bluff keeps its
 * legacy sentence exactly, lit or dark. A legacy strength lie about a THIRD court (a bought
 * plant, the weakness bait's road) keeps it too while the lure is dark, and names its subject
 * and its direction once the lure is lit, because "its strength was greater" is false of a
 * deflate plant about someone else. An axis record names the subject and the axis in words,
 * never a strength sentence on a granary plant, and never a number.
 * @param {Row} rec @param {(id: string) => string} nameFor @param {boolean} lit
 * @returns {string}
 */
export function lieClaimClause(rec, nameFor, lit) {
  const who = nameFor(String(rec.subjectId));
  if (rec.axis === undefined) {
    if (!lit || rec.subjectId === rec.liarId) return LEGACY_CLAIM;
    const more = Number(rec.assertedBand) > Number(rec.trueBand);
    return `(that ${who} was ${more ? 'stronger' : 'weaker'} than it is)`;
  }
  const spec = AXIS_SPECS.get(String(rec.axis));
  if (!spec) return `(a story about ${who} that no longer holds)`;
  if (spec.kind === 'label') return `(that ${who} keeps a god it does not keep)`;
  const more = rec.intent === 'inflate';
  if (spec.axis === DEVOTION_AXIS) return `(that ${who} prays ${more ? 'harder' : 'less'} than it does)`;
  if (spec.axis === 'stores') return `(that the granaries of ${who} held ${more ? 'more' : 'less'} than they do)`;
  if (spec.axis === 'pull') return `(that ${who} draws people ${more ? 'more' : 'less'} than it does)`;
  if (spec.axis === 'routePosition') return `(that the roads of ${who} carry ${more ? 'more' : 'less'} than they do)`;
  if (spec.kind === 'band') return `(that ${who} is ${more ? 'stronger' : 'weaker'} than it is)`;
  return `(that ${who} ${more ? 'has plenty' : 'goes short'} of ${String(spec.key).replace(/_/g, ' ')} when it does not)`;
}

// ── THE ONE WRITER OF THE FOUR CONDITIONAL FIELDS ─────────────────────────────
/**
 * THE AXIS-TYPED DISINFO RECORD. The only place in the tree that spells `assertedValue`,
 * `trueValue` or a record-side `intent` into a record (a source census in the acceptance file
 * holds it so). Drop-when-absent at every field: a strength lie keeps the legacy spelling and
 * carries NO `axis`; a label lie carries no `intent`; a mouthpiece rides only when one was cast.
 * Null on any value the axis cannot hold, and on a "lie" that asserts the truth.
 * @param {{ liarId: string, audienceId: string, subjectId: string, axis: string,
 *   assertedValue: unknown, trueValue: unknown, tick: number, spokespersonNpcId?: string|null }} args
 * @returns {Row|null}
 */
export function lureRecordOf({ liarId, audienceId, subjectId, axis, assertedValue, trueValue, tick, spokespersonNpcId = null }) {
  const spec = AXIS_SPECS.get(String(axis));
  const values = lureAxisValues(String(axis));
  const seededTick = Math.max(0, Math.floor(finiteNumber(tick, 0)));
  if (!spec || !strictText(liarId) || !strictText(audienceId) || !strictText(subjectId)) return null;
  const valid = (/** @type {unknown} */ v) => (values ? values.includes(/** @type {string|number} */ (v)) : !!strictText(v));
  if (!valid(assertedValue) || !valid(trueValue) || assertedValue === trueValue) return null;
  const intent = intentOf(spec, assertedValue, trueValue);
  const head = { liarId, subjectId, audienceId };
  const tail = { seededTick, lineageId: `disinfo:${liarId}:${audienceId}:${seededTick}` };
  const speaker = spokespersonNpcId ? { spokespersonNpcId } : {};
  if (spec.kind === 'band') {
    return { ...head, assertedBand: Number(assertedValue), trueBand: Number(trueValue), ...tail, intent, ...speaker };
  }
  return {
    ...head, ...tail, axis: spec.axis, assertedValue, trueValue, ...(intent ? { intent } : {}), ...speaker,
  };
}

// ── THE BAIT: ATTRACTION, THE AIM, THE MARK, THE MOUTHPIECE ───────────────────
/**
 * Would a weakness bait MOVE the mark? The built casus answers, never a second model:
 * opportunism's foe half reads the mark's belief (here, the belief AS PLANTED) against its
 * own truth, under the world's live-strength restraint exactly as the war reasons apply it
 * (`warReasons.js`'s `predationCounterforcesLit`: warLayerEnabled ∧ warTerminationEnabled —
 * a local there, so re-read here and held equal by a source pin). 'attractive' when the casus
 * fires; 'refused' when only the lit restraint stops it (the misjudgment channel's own
 * receipt); else 'unattractive'.
 * @param {{ snapshot: unknown, worldState: Row, markId: string, subjectId: string, planted: BeliefRecord }} args
 * @returns {{ attraction: string, receipt: string }}
 */
export function lureAttractionOf({ snapshot, worldState, markId, subjectId, planted }) {
  const maps = asObject(asObject(worldState.spatialLedgers).beliefMaps);
  const overrides = new Map([[String(markId), new Map([[String(subjectId), planted]])]]);
  const plantedWorld = { ...worldState, spatialLedgers: { ...asObject(worldState.spatialLedgers), beliefMaps: applyBeliefOverrides(maps, overrides) } };
  const rules = asObject(worldState.simulationRules);
  const restraint = rules.warLayerEnabled === true && rules.warTerminationEnabled === true;
  const read = makeOpportunismRead({ snapshot: /** @type {Parameters<typeof makeOpportunismRead>[0]['snapshot']} */ (snapshot), worldState: plantedWorld });
  const lit = read.opportunismOf(String(markId), String(subjectId), undefined, { enforceLiveStrength: restraint });
  if (lit.score > 0) return { attraction: LURE_ATTRACTIONS[0], receipt: lit.receipt };
  const unrestrained = restraint ? read.opportunismOf(String(markId), String(subjectId), undefined, {}) : lit;
  return unrestrained.score > 0
    ? { attraction: LURE_ATTRACTIONS[1], receipt: lit.receipt }
    : { attraction: LURE_ATTRACTIONS[2], receipt: '' };
}

/** The campaign's courts, codepoint-ordered. A phantom never enters them (judgment FP-12).
 *  @param {unknown} snapshot @returns {Array<{ id: string, settlement: Row }>} */
function courtsOf(snapshot) {
  const rows = Array.isArray(asObject(snapshot).settlements) ? /** @type {unknown[]} */ (asObject(snapshot).settlements) : [];
  return rows.map((row) => ({ id: String(asObject(row).id ?? ''), settlement: asObject(asObject(row).settlement) }))
    .filter((row) => row.id)
    .sort((a, b) => compareCodepoint(a.id, b.id));
}

/**
 * THE AIM's seam (the volume: "aim where the record says the ground is soft"). `softnessOf`
 * answers how soft the ground is in a mark's court for a story about the subject — larger is
 * softer — and is INJECTED: the reader is IN-1's mirror (what the mark has been shown of the
 * subject, and how long ago), which this leaf does not import (see the header). Absent, every
 * court reads alike and the order is codepoint — the named degraded arm, and the arm a dark
 * mirror reads anyway.
 * @typedef {(subjectId: string, markId: string) => number} GroundSoftness
 */

/**
 * THE MARK: among the REAL courts, other than the liar and the subject, that hold a reckoning
 * of the subject (the lie verb's own channel rule), the one the aim reaches first — softest
 * ground, then codepoint — that the bait would MOVE. For a strength bait "move" is the built
 * casus above; a family bait's jaws are the consumers the header names, so its mark is the
 * first soft court that can hold the story. No weight, no draw: an order over a fixed set.
 * @param {{ snapshot: unknown, worldState: Row, liarId: string, subjectId: string, axis: string,
 *   assertedValue: unknown, softnessOf?: GroundSoftness|null }} args
 * @returns {{ markId: string, planted: BeliefRecord, prior: BeliefRecord, receipt: string }|null}
 */
export function selectLureMark({ snapshot, worldState, liarId, subjectId, axis, assertedValue, softnessOf = null }) {
  const spec = AXIS_SPECS.get(String(axis));
  if (!spec) return null;
  const maps = asObject(asObject(worldState.spatialLedgers).beliefMaps);
  const soft = (/** @type {string} */ id) => (typeof softnessOf === 'function' ? finiteNumber(softnessOf(subjectId, id), 0) : 0);
  const candidates = courtsOf(snapshot)
    .filter((court) => court.id !== liarId && court.id !== subjectId && seatBeliefRecord(maps, court.id, subjectId))
    .map((court) => ({ id: court.id, soft: soft(court.id) }))
    .sort((a, b) => (b.soft - a.soft) || compareCodepoint(a.id, b.id));
  for (const { id } of candidates) {
    const prior = /** @type {BeliefRecord} */ (seatBeliefRecord(maps, id, subjectId));
    const planted = withAxisValue(spec, prior, /** @type {string|number} */ (assertedValue));
    if (spec.kind !== 'band') return { markId: id, planted, prior, receipt: '' };
    const read = lureAttractionOf({ snapshot, worldState, markId: id, subjectId, planted });
    if (read.attraction === LURE_ATTRACTIONS[0]) return { markId: id, planted, prior, receipt: read.receipt };
  }
  return null;
}

/** The unavailable statuses the chokepoint leaves to each consumer (derived, never spelled).
 *  Widened to `readonly string[]` for the membership test: the needle is an untrusted value.
 *  @type {readonly string[]} */
const CONSUMER_PAIRED_STATUSES = Object.freeze(NPC_UNAVAILABLE_STATUSES
  .filter((status) => !(/** @type {readonly string[]} */ (OFF_STAGE_STATUSES)).includes(status)));

/**
 * THE MOUTHPIECE, a cast person: the lowest npc id on the liar's PARTICIPATION roster (the
 * snapshot's view, which the master gate already filtered) that the ONE participation
 * chokepoint (`roads/state.js :: isOffStage`) admits, paired with the status that chokepoint
 * leaves to its consumers, and never a minor soul (the one importance table's weight zero,
 * which "suppresses propagation entirely": the head's mouthpiece floor, read off that table).
 * Cast per commission, never stored except as the record's own `spokespersonNpcId`. '' when
 * nobody can speak, and '' for a record with no roster at all (a phantom's minimal row).
 * @param {string} liarId @param {Row} settlement @returns {string}
 */
export function castLureMouthpiece(liarId, settlement) {
  const people = Array.isArray(settlement.npcs) ? /** @type {unknown[]} */ (settlement.npcs) : [];
  /** @type {string[]} */
  const ids = [];
  people.forEach((raw, index) => {
    const npc = asObject(raw);
    if (!Object.keys(npc).length || isOffStage(npc)) return;
    if (CONSUMER_PAIRED_STATUSES.includes(String(npc.status ?? '').toLowerCase())) return;
    if (!(importanceWeight(/** @type {Parameters<typeof importanceWeight>[0]} */ (npc)) > 0)) return;
    ids.push(npcId(liarId, /** @type {Parameters<typeof npcId>[1]} */ (npc), index));
  });
  return ids.sort(compareCodepoint)[0] || '';
}

// ── THE PLANT CHANNEL (the predicate) AND THE COMMISSION (the direction) ──────
/** The service a house must sell for a story to be placed through it, read off the menu. */
const PLANT_SERVICE = BROKERAGE_SERVICE_MENU_KEYS.find((key) => key === 'info_plant') || '';

/**
 * THE HOUSES a story can be placed through on one record: the settlement's live brokerage
 * houses whose own menu sells the plant service. Dark (the lure or the brokerages unlit, or
 * no campaign) ⇒ none. These are the SUBJECTS of `plantChannel` (J-EM-3, R-38).
 * @param {unknown} record @param {unknown} campaignState @returns {readonly string[]}
 */
export function plantChannelHouses(record, campaignState) {
  const world = asObject(asObject(campaignState).worldState);
  if (!Object.keys(world).length || !infoLureActive(world) || !brokerageEffectsActive(world) || !PLANT_SERVICE) return Object.freeze([]);
  const houses = brokerageHouseRosterIn(asObject(record))
    .filter((house) => servicesAvailable(house.legality, house.form, 'crime').includes(PLANT_SERVICE))
    .map((house) => String(house.institutionId));
  return Object.freeze([...new Set(houses)].sort(compareCodepoint));
}

/** The world condition this module defines for the editor. */
export const PLANT_CHANNEL_CONDITION = 'plantChannel';

/**
 * THE PREDICATE ROW, in `worldConditions.js`'s liveRow shape: the predicate is DERIVED from
 * its subjects (the `pendingPeaceOffer` idiom). The chair composes it into WORLD_CONDITIONS.
 */
export const PLANT_CHANNEL_ROW = Object.freeze({
  predicate: (/** @type {unknown} */ record, /** @type {unknown} */ campaignState) => plantChannelHouses(record, campaignState).length > 0,
  subjects: plantChannelHouses,
  readers: Object.freeze([Object.freeze({
    id: 'brokerage-roster', module: 'src/domain/worldPulse/brokerageStamps.js', symbol: 'brokerageHouseRosterIn', gate: null,
  })]),
  source: /** @type {const} */ ('live'),
});

/** The rows this module adds to `WORLD_CONDITIONS`, keyed for the chair's splice. */
export const LURE_WORLD_CONDITIONS = Object.freeze({ [PLANT_CHANNEL_CONDITION]: PLANT_CHANNEL_ROW });

/** The one direction type this module defines (R-28: the DM's lie commission). */
export const LURE_DIRECTION_TYPE = 'commission-lie';

/**
 * THE DIRECTION ROW, in `operations.js`'s eleven-field OpTypeDeclaration shape, so
 * `resolveDecree` reads it as an `opTypes` catalogue. The target is the commissioning town;
 * `subject` is the REAL court the lie is about; `axis` is the closed vocabulary above, imported
 * by reference, so §20.3's resolver withdraws a pending commission whose axis word moved. The
 * value is the axis's own (a ladder word, a strength band, or a public faith label, which is a
 * world's deity name and no closed list holds), so it is declared free and judged PER AXIS
 * against the imported ladders by `lieCommissionRefusal` rather than by one flat list.
 * @type {Readonly<Record<string, import('../edit/operations.js').OpTypeDeclaration>>}
 */
export const LURE_DIRECTION_OP_TYPES = Object.freeze({
  [LURE_DIRECTION_TYPE]: Object.freeze({
    target: /** @type {const} */ ('settlement'),
    payload: Object.freeze({
      assertedValue: Object.freeze({ kind: /** @type {const} */ ('free'), required: true }),
      axis: Object.freeze({ kind: /** @type {const} */ ('enum'), values: LURE_AXES, required: true }),
      subject: Object.freeze({ kind: /** @type {const} */ ('ref'), required: true }),
    }),
    stage: /** @type {const} */ ('home'),
    consequence: /** @type {const} */ ('home'),
    requires: Object.freeze({ world: Object.freeze(['beliefExists', PLANT_CHANNEL_CONDITION]), registry: Object.freeze([]) }),
    enables: Object.freeze([]),
    relatedTo: Object.freeze(['mutate-belief']),
    conflictsWith: Object.freeze([]),
    duration: null,
    guards: Object.freeze([]),
    guardsStated: 'No guard is wired here. The axis is the closed lure vocabulary and the value is judged on its own axis by lieCommissionRefusal; whether a house will place the story is the plantChannel condition rather than a guard.',
  }),
});

/**
 * JUDGE ONE COMMISSION's words before any world is read: the subject must be a REAL court of
 * this campaign (a phantom is a library row that never enters the snapshot, so it is refused by
 * construction), the axis must be the lure's own, and the value must be one that axis can hold.
 * @param {unknown} op the staged op @param {unknown} snapshot the campaign's courts
 * @returns {{ code: string, detail: string }|null}
 */
export function lieCommissionRefusal(op, snapshot) {
  const payload = asObject(asObject(op).payload);
  const subjectId = strictText(payload.subject);
  if (!subjectId || !courtsOf(snapshot).some((court) => court.id === subjectId)) {
    return { code: 'phantom_subject', detail: 'An off-stage court can hold a story and never answer one; a lie needs a real subject.' };
  }
  const values = lureAxisValues(String(payload.axis));
  const value = payload.assertedValue;
  if (!LURE_AXES.includes(String(payload.axis)) || (values ? !values.includes(/** @type {string|number} */ (value)) : !strictText(value))) {
    return { code: 'value_off_axis', detail: 'That is not a thing that can be said on that axis.' };
  }
  return null;
}

/**
 * THE COMMISSION — the producer the direction's consumer will call (IN-2-c, at U123). Reads the
 * subject's truth on the axis from the caller (the head is truth-side), aims the bait through
 * `selectLureMark`, casts the mouthpiece when npcCredibility is lit, and returns the record and
 * the planted belief the ONE writer folds, or an honest refusal. A family axis needs its SP-B
 * family lit, or no reckoning can hold the story (`axis_dark`).
 * @param {{ worldState: Row, snapshot: unknown, liarId: string, subjectId: string, axis: string,
 *   assertedValue: unknown, trueValue: unknown, tick: number, softnessOf?: GroundSoftness|null }} args
 * @returns {{ refused: boolean, refusal: string|null, key: string|null, record: Row|null, override: BeliefRecord|null, markId: string|null }}
 */
export function lureCommission({ worldState, snapshot, liarId, subjectId, axis, assertedValue, trueValue, tick, softnessOf = null }) {
  const refuse = (/** @type {string} */ refusal) => ({ refused: true, refusal, key: null, record: null, override: null, markId: null });
  if (!infoLureActive(worldState)) return refuse('dark');
  const words = lieCommissionRefusal({ payload: { subject: subjectId, axis, assertedValue } }, snapshot);
  if (words) return refuse(words.code);
  const gate = AXIS_SPECS.get(String(axis))?.gate;
  const gates = subjectAxesActive(/** @type {Parameters<typeof subjectAxesActive>[0]} */ (worldState));
  if (gate && !(gates && gates[gate])) return refuse('axis_dark');
  const liar = courtsOf(snapshot).find((court) => court.id === liarId);
  if (!liar || !plantChannelHouses(liar.settlement, { worldState }).length) return refuse('no_house');
  if (trueValue == null) return refuse('no_truth');
  if (trueValue === assertedValue) return refuse('no_lie');
  const mark = selectLureMark({ snapshot, worldState, liarId, subjectId, axis, assertedValue, softnessOf });
  if (!mark) return refuse('no_mark');
  const speaker = npcCredibilityActive(worldState) ? castLureMouthpiece(liarId, liar.settlement) : '';
  const record = lureRecordOf({
    liarId, audienceId: mark.markId, subjectId, axis, assertedValue, trueValue, tick, spokespersonNpcId: speaker || null,
  });
  if (!record) return refuse('value_off_axis');
  return {
    refused: false, refusal: null, key: `plant:${liarId}:${mark.markId}:${subjectId}`, record, override: { ...mark.planted, lastUpdateTick: Number(record.seededTick) }, markId: mark.markId,
  };
}

// ── THE SPRING AND THE COLLISION (lit only; the head asks the gate first) ─────
/** A weakness bait: a strength lie that tells the mark its subject is WEAKER than it is.
 *  @param {Row} rec @returns {boolean} */
function isWeaknessBait(rec) {
  if (rec.axis !== undefined) return false;
  return Number(rec.assertedBand) < Number(rec.trueBand);
}

/**
 * THE MARCHES the previous pulse's record carries: the misjudgment the built detector stamps
 * on the chooser's resolved deploy — and on nothing else (`settlementStrategy.js`'s one
 * `misjudgmentFor` call site is the deploy branch; the acceptance file pins that) — read as a
 * STRENGTH misjudgment with the marcher, the court it marched on, and the band it believed
 * when it chose. Exact-tick read of the last pulse record, so a march is joined once and never
 * again (the IN-0a consume-once idiom).
 * @param {Row} worldState @param {number} now @returns {Row[]}
 */
function misjudgedMarchesAt(worldState, now) {
  const history = Array.isArray(worldState.pulseHistory) ? /** @type {unknown[]} */ (worldState.pulseHistory) : [];
  const last = asObject(history[history.length - 1]);
  if (now < 1 || last.tick !== now - 1) return [];
  return (Array.isArray(last.selectedOutcomes) ? /** @type {unknown[]} */ (last.selectedOutcomes) : [])
    .map((outcome) => asObject(asObject(asObject(outcome).metadata).misjudgment))
    .filter((mis) => Array.isArray(mis.kinds) && mis.kinds.includes(STRENGTH_AXIS)
      && strictText(mis.observerId) && strictText(mis.subjectId));
}

/**
 * THE SPRING. The previous pulse's record carries the mark's own march on a court, stamped a
 * strength misjudgment, and a weakness bait about that very court stood in the mark's
 * reckoning when it chose: seeded at least a tick before the march (a story told this tick is
 * not yet believed when the chooser runs), and the band the court marched on IS the band the
 * bait asserted. ONE beat per bait, DM truth (`covert`, fail-closed upstream), in the
 * registered `lure_sprung` voice. A record may already be exposed this tick; the spring it
 * caused still happened, and the two beats say so separately.
 * @param {{ worldState: Row, disinfo: Row, tick: number, nameFor: (id: string) => string }} args
 * @returns {Array<Row>}
 */
export function lureSprungEntries({ worldState, disinfo, tick, nameFor }) {
  const now = Math.max(0, Math.floor(finiteNumber(tick, 0)));
  const marches = misjudgedMarchesAt(worldState, now);
  /** @type {Array<Row>} */
  const out = [];
  if (!marches.length) return out;
  for (const key of Object.keys(disinfo).sort(compareCodepoint)) {
    const rec = asObject(disinfo[key]);
    if (!isWeaknessBait(rec) || !(finiteNumber(rec.seededTick, now) < now - 1)) continue;
    const joined = marches.some((mis) => mis.observerId === rec.audienceId && mis.subjectId === rec.subjectId
      && Number(mis.believedStrengthBand) === Math.round(Number(rec.assertedBand)));
    if (!joined) continue;
    const liarId = String(rec.liarId);
    const markId = String(rec.audienceId);
    const subjectId = String(rec.subjectId);
    const receipt = informationReceipt('lure_sprung', `${key}:${now}`, {
      settlement: nameFor(liarId), counterpart: nameFor(subjectId), faction: nameFor(markId),
      house: strictText(asObject(asObject(rec.commission).receipt).marketName),
    });
    if (!receipt) continue;
    out.push({
      id: `wizard_news.${now}.lure_sprung.${stablePart(liarId)}.${stablePart(markId)}.${stablePart(subjectId)}`,
      kind: 'lure_sprung',
      impactKind: 'lure_sprung',
      significance: receipt.significance,
      // The public twin's own material weight (`belief_misjudgment`, the same march read from the
      // street): a covert beat reaches only the DM's feed (`projectWizardNewsForAudience` omits
      // it for every other reader), so the weight moves no player meter.
      severity: 0.5,
      score: 60,
      tick: now,
      scope: 'regional',
      headline: `${nameFor(markId)} marches on a weakness planted for it`,
      summary: receipt.line,
      reasons: [
        `A telling planted in ${nameFor(markId)} called ${nameFor(subjectId)} weaker than it is, and ${nameFor(markId)} marched on it.`,
        `The lie traces to ${nameFor(liarId)}. Nobody in ${nameFor(markId)} knows it was planted.`,
      ],
      settlementIds: [liarId, markId, subjectId],
      familyId: receipt.familyId,
      audience: receipt.audience,
      section: receipt.section,
      ...(receipt.audience === 'dm-only' ? { covert: true } : {}),
      tags: ['world_pulse', 'infowar', 'deception', 'lure'],
    });
  }
  return out;
}

/**
 * BLUFF AGAINST BLUFF, ON THE EXPIRY ARM. When a court's own bluff is exposed by AGE (not by
 * contradiction) while the audience's own counter-bluff was standing in the liar's court at the
 * tick's opening, both courts had been reading the other's planted strength as true; the
 * receipt names BOTH lies. Empty otherwise.
 * @param {Row} rec the exposed record @param {{ contradicted: boolean, agedOut: boolean }} exposure
 * @param {Row} disinfo the ledger it was exposed from @param {(id: string) => string} nameFor
 * @returns {string[]}
 */
export function bluffCollisionReasons(rec, exposure, disinfo, nameFor) {
  const liarId = String(rec.liarId);
  const audienceId = String(rec.audienceId);
  if (!exposure.agedOut || exposure.contradicted || rec.subjectId !== rec.liarId) return [];
  const counter = asObject(disinfo[`lie:${audienceId}:${liarId}`]);
  if (!Object.keys(counter).length || counter.subjectId !== audienceId) return [];
  return [`Two bluffs met: ${nameFor(audienceId)}'s own inflated strength was standing in ${nameFor(liarId)}'s court when this one aged out, and each court had read the other's lie as true.`];
}
