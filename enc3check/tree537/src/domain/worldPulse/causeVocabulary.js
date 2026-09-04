/**
 * domain/worldPulse/causeVocabulary.js — W-C5: the ~14 CAUSE CLASSES in 4 families,
 * their RESOLUTION PREDICATES, and the role→cause coherence weights.
 *
 * A compromise (the guard captain is corrupt) is attributed a CAUSE (the garrison
 * is underfunded) drawn ONLY from this closed vocabulary — never invented. The
 * cause classes and families are the owner's content-architecture contract
 * (PHASE5_CONTENT_ARCHITECTURE.md: "the trace/cause-chain classes the engine
 * ALREADY EMITS become the content selectors"): economic / war / faith / corruption.
 *
 * THE GOLDEN LAW (WC5 brief §1): attribution is LAZY and derived from the
 * settlement's ACTUAL concurrent state — a cause is "present" iff its underlying
 * condition genuinely holds in state RIGHT NOW. Resolution is the same read
 * inverted: a cause "resolves" when its condition genuinely CLEARS. Every read
 * here is a pure function of a normalized CauseContext (built once per settlement
 * by readCauseContext), so attribution and resolution consult the SAME signal and
 * the predicates are unit-testable without a live pulse.
 *
 * A deliberate HYSTERESIS BAND separates present (LOW) from clear (HIGH) on every
 * 0..100 score signal, so a score hovering at the edge reads `ambiguous` (neither
 * attributes nor resolves) rather than oscillating — the lifecycle's own
 * consecutive-tick hold sits ON TOP of this.
 *
 * PURE: no rng, no wall-clock, no mutation. Imports only leaf readers
 * (corruption, clergy plane) — no religion-engine cycle.
 */

import {
  hasCorruptingDeity, compromisedSecurityInstitutions,
} from '../corruption.js';
import { readClergyPlane } from './clergyTraitPlane.js';

/** @typedef {'economic'|'war'|'faith'|'corruption'} CauseFamily */
/** @typedef {import('../settlement.schema.js').SimSettlement} SimSettlement */
/** @typedef {{ npcStates?: Record<string, { roleArchetype?: string, corruption?: boolean }>, occupations?: Record<string, unknown>, deployments?: Record<string, unknown>, warPosture?: Record<string, { state?: string }>, causeLifecycle?: unknown }} WorldStateLike */
/** @typedef {{ id?: string|number, settlement?: SimSettlement, causal?: { scores?: Record<string, number> }, activeConditions?: Array<{ archetype?: string }> }} SnapshotItem */

/**
 * The closed cause vocabulary: 14 classes across 4 families. `class` is the stable
 * selector W2's content keys off (the conjunction key's causeClass), `family` the
 * coarse grouping, `label` a terse DM-facing mechanism name. NOTHING outside this
 * list is ever attributed.
 * @type {ReadonlyArray<{ class: string, family: CauseFamily, label: string }>}
 */
export const CAUSE_CLASSES = Object.freeze([
  // ── economic ───────────────────────────────────────────────────────────────
  { class: 'underfunded',     family: 'economic',   label: 'funds run short' },
  { class: 'chain-starved',   family: 'economic',   label: 'a broken supply chain' },
  { class: 'depleted',        family: 'economic',   label: 'stores run dry' },
  { class: 'trade-strangled', family: 'economic',   label: 'trade choked off' },
  // ── war ──────────────────────────────────────────────────────────────────────
  { class: 'levied-away',     family: 'war',        label: 'the strength levied away' },
  { class: 'garrison-drained',family: 'war',        label: 'a hollowed-out garrison' },
  { class: 'siege-scarred',   family: 'war',        label: 'the pressure of the war' },
  { class: 'occupation',      family: 'war',        label: 'the occupier’s hand' },
  // ── faith ─────────────────────────────────────────────────────────────────────
  { class: 'conduct-drift',   family: 'faith',      label: 'a patron that rewards the deed' },
  { class: 'conversion-pressure', family: 'faith',  label: 'a rival faith pressing in' },
  { class: 'secularization',  family: 'faith',      label: 'the faith gone cold' },
  { class: 'clergy-scandal',  family: 'faith',      label: 'a tainted priesthood' },
  // ── corruption ─────────────────────────────────────────────────────────────────
  { class: 'captured',        family: 'corruption', label: 'a captured institution' },
  { class: 'scandal',         family: 'corruption', label: 'a corruption scandal' },
]);

export const CAUSE_FAMILIES = Object.freeze(['economic', 'war', 'faith', 'corruption']);

/** class → family, and the ordered class ids, precomputed for O(1) lookups + pins. */
export const CAUSE_FAMILY_OF = Object.freeze(
  Object.fromEntries(CAUSE_CLASSES.map((c) => [c.class, c.family])),
);
export const CAUSE_CLASS_IDS = Object.freeze(CAUSE_CLASSES.map((c) => c.class));
export const CAUSE_LABEL_OF = Object.freeze(
  Object.fromEntries(CAUSE_CLASSES.map((c) => [c.class, c.label])),
);

export const CAUSE_TUNING = Object.freeze({
  // 0..100 causal-score hysteresis band. A signal BELOW LOW reads `present`,
  // ABOVE HIGH reads `clear`, between reads `ambiguous`. The gap (40→55) is the
  // anti-oscillation cushion under the lifecycle's own consecutive-tick hold.
  SCORE_LOW: 40,
  SCORE_HIGH: 55,
  // The revealed-clergy-taint fraction at/above which a clergy scandal reads present.
  CLERGY_SCANDAL_MIN: 0.15,
});

/** @param {number|undefined|null} x @param {number} d */
const num = (x, d) => (Number.isFinite(x) ? /** @type {number} */ (x) : d);

/**
 * A normalized, pure snapshot of every signal the cause predicates read — built
 * ONCE per settlement per tick, then consulted by presence/resolution. Building it
 * here (not in the predicates) keeps the predicates trivially unit-testable: a
 * test constructs a CauseContext literal and asserts the classification.
 *
 * @typedef {Object} CauseContext
 * @property {Record<string, number>} scores       0..100 causal scores (flat map)
 * @property {Set<string>} conditions              active-condition archetype ids
 * @property {boolean} occupied                    a live occupation grips this settlement
 * @property {boolean} deployed                     an army is levied out / deployed
 * @property {string}  captureState                 criminalCaptureState ladder value
 * @property {boolean} corruptingDeity             an embedded EVIL patron is present
 * @property {boolean} rivalCult                    a non-patron cult contests here
 * @property {number}  revealedInstitutions         count of REVEALED compromised security institutions
 * @property {number}  clergyRevealedTaint          0..1 publicly-revealed clergy taint
 */

/**
 * Build the CauseContext for one settlement from the pulse snapshot item + the
 * live worldState ledgers. Pure. `cid` is the save id (occupation/posture keys).
 * @param {SnapshotItem} item
 * @param {WorldStateLike} worldState
 * @param {string} cid
 * @returns {CauseContext}
 */
export function readCauseContext(item, worldState, cid) {
  const settlement = item?.settlement || /** @type {SimSettlement} */ ({});
  const scores = item?.causal?.scores || {};
  const conds = Array.isArray(item?.activeConditions) ? item.activeConditions
    : Array.isArray(settlement?.activeConditions) ? settlement.activeConditions : [];
  const conditions = new Set(
    conds.map((/** @type {{ archetype?: string }} */ c) => String(c?.archetype || '')).filter(Boolean),
  );
  const occLedger = worldState?.occupations || {};
  const deployLedger = worldState?.deployments || {};
  const posture = String(worldState?.warPosture?.[String(cid)]?.state || '');
  const cults = settlement?.config?.cultDeitySnapshots;
  const clergy = readClergyPlane(settlement);
  const compromised = compromisedSecurityInstitutions(settlement);
  return {
    scores,
    conditions,
    occupied: Boolean(occLedger[String(cid)]) || conditions.has('occupation_burden') || conditions.has('occupation_resistance'),
    deployed: Boolean(deployLedger[String(cid)])
      || conditions.has('army_deployed') || conditions.has('war_drain') || conditions.has('reinforcement_cost')
      || posture === 'deployed',
    captureState: String(settlement?.powerStructure?.criminalCaptureState || 'none'),
    corruptingDeity: hasCorruptingDeity(settlement),
    rivalCult: Array.isArray(cults) && cults.length > 0,
    revealedInstitutions: compromised.revealed.length,
    clergyRevealedTaint: num(clergy?.revealedTaint, 0),
  };
}

/** Classify a 0..100 score where a LOW value = trouble (economic_capacity,
 *  food_security, defense_readiness, …): below LOW reads `present`, above HIGH
 *  reads `clear`, between reads `ambiguous`. @param {number} score */
function bandLowGood(score) {
  const s = num(score, 50);
  if (s < CAUSE_TUNING.SCORE_LOW) return 'present';
  if (s > CAUSE_TUNING.SCORE_HIGH) return 'clear';
  return 'ambiguous';
}

/** boolean flag → present/clear (never ambiguous). @param {boolean} flag */
const flagState = (flag) => (flag ? 'present' : 'clear');

/**
 * The RESOLUTION-PREDICATE TABLE. Each cause class maps its underlying condition to
 * one of 'present' | 'clear' | 'ambiguous'. Attribution reads `present`; resolution
 * fires when the attributed class reads `clear` (held N ticks, upstream). Documented
 * 1:1 with the report's cause→resolution table. Pure — a function of CauseContext.
 * @type {Readonly<Record<string, (ctx: CauseContext) => 'present'|'clear'|'ambiguous'>>}
 */
export const CAUSE_SIGNAL = Object.freeze({
  // ── economic ───────────────────────────────────────────────────────────────
  // underfunded: the settlement's live economic slack (war-affordability) — a
  // garrison/watch/office starved of coin. Funded ⇒ economic_capacity recovers.
  underfunded: (ctx) => bandLowGood(ctx.scores.economic_capacity),
  // chain-starved: a broken supply chain / route — trade_connectivity collapsed OR a
  // standing route-disruption condition. Restored ⇒ connectivity recovers, no condition.
  'chain-starved': (ctx) => {
    if (ctx.conditions.has('regional_route_disruption') || ctx.conditions.has('trade_route_cut')) return 'present';
    return bandLowGood(ctx.scores.trade_connectivity);
  },
  // depleted: stores run dry — food_security collapsed OR a famine/import-shortage
  // condition. Replenished ⇒ food_security recovers, no condition.
  depleted: (ctx) => {
    if (ctx.conditions.has('famine') || ctx.conditions.has('regional_import_shortage') || ctx.conditions.has('food_anchor_lost')) return 'present';
    return bandLowGood(ctx.scores.food_security);
  },
  // trade-strangled: an embargo / sanctions / lost export market — a discrete
  // condition, present iff one holds. Lifted ⇒ none.
  'trade-strangled': (ctx) => flagState(
    ctx.conditions.has('trade_embargo') || ctx.conditions.has('cold_war_sanctions')
    || ctx.conditions.has('regional_export_market_loss') || ctx.conditions.has('vassal_trade_coercion'),
  ),
  // ── war ──────────────────────────────────────────────────────────────────────
  // levied-away: the settlement's strength is deployed/levied out. Home ⇒ no deployment.
  'levied-away': (ctx) => flagState(ctx.deployed),
  // garrison-drained: a hollowed garrison — defense_readiness collapsed OR a war_drain.
  // Refilled ⇒ readiness recovers, no war_drain.
  'garrison-drained': (ctx) => {
    if (ctx.conditions.has('war_drain') || ctx.conditions.has('war_exhaustion')) return 'present';
    return bandLowGood(ctx.scores.defense_readiness);
  },
  // siege-scarred: the pressure of an active war — a siege/war-pressure/mobilization
  // condition. Lifted ⇒ none.
  'siege-scarred': (ctx) => flagState(
    ctx.conditions.has('siege') || ctx.conditions.has('war_pressure') || ctx.conditions.has('war_mobilization'),
  ),
  // occupation: a live occupation grips the town (ledger OR occupation condition).
  // Liberated ⇒ none.
  occupation: (ctx) => flagState(ctx.occupied),
  // ── faith ─────────────────────────────────────────────────────────────────────
  // conduct-drift: an embedded EVIL patron that rewards the compromised deed — the
  // corruption "from within" gate. Persists while the patron does (rarely resolves).
  'conduct-drift': (ctx) => flagState(ctx.corruptingDeity),
  // conversion-pressure: a rival faith pressing in — a religious-pressure condition OR
  // a contesting cult. Repelled ⇒ none.
  'conversion-pressure': (ctx) => flagState(ctx.conditions.has('regional_religious_pressure') || ctx.rivalCult),
  // secularization: the faith gone cold — religious_authority collapsed. Revived ⇒ recovers.
  secularization: (ctx) => bandLowGood(ctx.scores.religious_authority),
  // clergy-scandal: a tainted priesthood already on public record (revealed clergy taint).
  // Reformed ⇒ taint clears.
  'clergy-scandal': (ctx) => flagState(ctx.clergyRevealedTaint >= CAUSE_TUNING.CLERGY_SCANDAL_MIN),
  // ── corruption ─────────────────────────────────────────────────────────────────
  // captured: the underworld holds the institution (criminalCaptureState corrupted/capture).
  // Broken ⇒ recedes to none/adversarial (equilibrium reads ambiguous).
  captured: (ctx) => {
    if (ctx.captureState === 'corrupted' || ctx.captureState === 'capture') return 'present';
    if (ctx.captureState === 'none' || ctx.captureState === 'adversarial') return 'clear';
    return 'ambiguous';
  },
  // scandal: a corruption scandal on the books — a corruption_exposed condition OR a
  // revealed compromised institution. Reformed ⇒ none.
  scandal: (ctx) => flagState(ctx.conditions.has('corruption_exposed') || ctx.revealedInstitutions > 0),
});

/** All cause classes reading `present` in this context, in canonical CAUSE_CLASSES
 *  order (deterministic). @param {CauseContext} ctx @returns {string[]} */
export function presentCauseClasses(ctx) {
  return CAUSE_CLASS_IDS.filter((cls) => CAUSE_SIGNAL[cls](ctx) === 'present');
}

/** Whether a specific attributed cause class now reads `clear` (its condition
 *  genuinely resolved). @param {string} causeClass @param {CauseContext} ctx */
export function causeIsClear(causeClass, ctx) {
  const fn = CAUSE_SIGNAL[causeClass];
  return fn ? fn(ctx) === 'clear' : false;
}

// ── Role → cause COHERENCE ──────────────────────────────────────────────────────
// Attribution picks the MOST ROLE-COHERENT present cause (owner: "coherent for the
// role"): a guard captain's compromise most naturally roots in the garrison's pay
// (military × underfunded), a merchant's in choked trade, a priest's in the faith.
// Coherence = family affinity for the role + a small per-class bonus for the
// canonical pairings. Ties break on a seeded fork upstream. Every role has a
// nonzero floor for every family, so a cause is ALWAYS attributable when present.

/** role → per-family affinity (0..1). Roles are npcAgency's NPC_ROLE_ARCHETYPES ids.
 *  @type {Readonly<Record<string, { economic: number, war: number, faith: number, corruption: number }>>} */
const ROLE_FAMILY_AFFINITY = Object.freeze({
  military:          { economic: 0.7, war: 1.0, faith: 0.3, corruption: 0.6 },
  ruler:             { economic: 0.7, war: 0.6, faith: 0.5, corruption: 0.8 },
  heir:              { economic: 0.6, war: 0.5, faith: 0.4, corruption: 0.8 },
  merchant:          { economic: 1.0, war: 0.4, faith: 0.2, corruption: 0.7 },
  religious:         { economic: 0.3, war: 0.3, faith: 1.0, corruption: 0.5 },
  criminal:          { economic: 0.5, war: 0.3, faith: 0.2, corruption: 1.0 },
  arcane:            { economic: 0.5, war: 0.3, faith: 0.6, corruption: 0.5 },
  civic:             { economic: 0.8, war: 0.4, faith: 0.4, corruption: 0.8 },
  healer:            { economic: 0.8, war: 0.3, faith: 0.5, corruption: 0.4 },
  labor_resource:    { economic: 0.9, war: 0.4, faith: 0.3, corruption: 0.5 },
  diplomat_outsider: { economic: 0.7, war: 0.5, faith: 0.4, corruption: 0.7 },
  dissident:         { economic: 0.6, war: 0.5, faith: 0.6, corruption: 0.7 },
});
const DEFAULT_FAMILY_AFFINITY = Object.freeze({ economic: 0.6, war: 0.5, faith: 0.4, corruption: 0.7 });

/** Small per-(role, class) bonuses for the canonical pairings the owner names.
 *  @type {Readonly<Record<string, Record<string, number>>>} */
const ROLE_CLASS_BONUS = Object.freeze({
  military: { underfunded: 0.25, 'garrison-drained': 0.2, 'levied-away': 0.15 },
  merchant: { 'trade-strangled': 0.2, 'chain-starved': 0.15 },
  religious: { 'conduct-drift': 0.2, 'clergy-scandal': 0.2, 'conversion-pressure': 0.15 },
  civic: { underfunded: 0.2, captured: 0.15 },
  criminal: { captured: 0.2, scandal: 0.15 },
  labor_resource: { depleted: 0.2, 'chain-starved': 0.15 },
});

/**
 * The coherence weight of attributing `causeClass` to a `role` bearer. Higher ⇒
 * more natural. Pure, deterministic. @param {string|null|undefined} role
 * @param {string} causeClass @returns {number}
 */
export function roleCauseAffinity(role, causeClass) {
  const family = CAUSE_FAMILY_OF[causeClass];
  if (!family) return 0;
  const fam = ROLE_FAMILY_AFFINITY[String(role || '')] || DEFAULT_FAMILY_AFFINITY;
  const base = num(fam[family], 0.5);
  const bonus = num(ROLE_CLASS_BONUS[String(role || '')]?.[causeClass], 0);
  return base + bonus;
}
