/**
 * domain/worldPulse/stressorGates.js — organic birth gates: context invites
 * (or forbids) a crisis the way counterforces end one.
 *
 * Generalizes the one politics-gated birth that existed before this module
 * (coup_detat's coupSpawnGate, formerly local to stressors.js) into a
 * catalog-driven model covering every stressor type:
 *
 *   - A gate reads the SAME source vocabulary the counterforce catalog reads
 *     (ledgers, causal scores, institution classes, relationship edges) plus
 *     the live stressor field (co-located crises, neighbour crises, echoes)
 *     and returns either null — the birth is BLOCKED because the context
 *     contradicts the story (an occupation with no possible occupier, a
 *     migration wave through a sealed siege line) — or a gradient
 *     { probabilityMult, reasons } that scales the birth odds continuously.
 *   - RNG is preserved: the mult feeds the existing candidate probability
 *     formula; gates never roll and never guarantee an outcome.
 *   - Every factor that fires lands a reason string on the candidate, so the
 *     dossier can explain WHY this crisis emerged here ("no healing
 *     institutions", "the occupier's faith arrives with its garrison").
 *   - Companion/partner emergence is modelled as gate BOOSTS from co-located
 *     stressors and warm echoes (occupation→conversion, siege→famine,
 *     instability-echo→deadzone) — one spawn pipeline, no chained spawns.
 *
 * Deterministic: everything reads the world snapshot; no RNG, no Date.
 * Gates marked `requiresSnapshot` can hard-block and are skipped by the
 * legacy snapshot-less candidate path (exactly how the coup behaved).
 */

import { foodLedger } from '../foodLedger.js';
import { healingLedger } from '../healingLedger.js';
import { governanceLedger } from '../governanceLedger.js';
import { magicLedger, ARCANE_INSTITUTION_PATTERN } from '../magicLedger.js';
import { nativeSemanticName } from '../content/customContentSemanticAuthority.js';
import { coupContenders } from '../rulingPowerCoup.js';
import { occupationRegimeOf } from '../rulingPowerSeat.js';
import { FACTION_ARCHETYPES, factionArchetype } from '../factionArchetypes.js';
import { governingFactionOf } from '../rulingPower.js';
import { resolveBlockadeBypassChannel } from './foodStockpile.js';
import {
  institutionClassValue,
  relationshipTypeOf,
  hostileNeighborsOf,
  recentHostileMemory,
} from './stressorDynamics.js';

const INACTIVE_STATUSES = new Set(['resolved', 'dormant', 'residual']);
const WAR_TYPES = ['siege', 'wartime', 'occupation'];
const GATE_MULT_MIN = 0.1;
const GATE_MULT_MAX = 3;

/** @param {any} value */
function clampMult(value) {
  return Math.max(GATE_MULT_MIN, Math.min(GATE_MULT_MAX, value));
}

const NEUTRAL = Object.freeze({ probabilityMult: 1, reasons: [] });

// ── W-SEAT D4 · LEGITIMACY-SCALED UPHEAVAL (SEAT-2b, `legitimacyUpheavalEnabled`) ──
//
// §736's ATTEMPT moment: "any attempted coup or rebellion has a scaling factor according to
// the legitimacy of the ruling powers." Half of that is ALREADY WIRED and this layer must
// not re-wire it — every gate below already carries legitimacy band rows, and `coupSpawnGate`
// already multiplies by a band. ⭐ SO THE VOLUME'S "gate mult+reason rows scaled by the
// ruler's legitimacy band" WOULD BE A SECOND RESOLVER FOR A QUANTITY THE GATES ALREADY
// ANSWER (§2.1), and a silent double-count besides. What is genuinely missing is the
// amendment's OTHER half: the per-archetype SENSITIVITY — an autocracy is brittle to a
// sudden crisis, a council to a long slow decline — and that has no expression anywhere.
//
// ⛔ THE TABLE IS A REDISTRIBUTION, NOT AN INFLATION, and the suite asserts that rather than
// the literals: for every archetype the two multipliers straddle 1, so lighting the key
// cannot raise upheaval everywhere at once. It also reuses THE GATES' OWN THRESHOLDS (30
// and 45) rather than minting a band derivation — the estate holds three copies of the
// legitimacy band table already (rulingPower, timeProgression, generators/factionDynamics)
// and a fourth spelling here is exactly the §711.6 failure the seat family keeps refusing.
const A_ARCH = FACTION_ARCHETYPES;
export const UPHEAVAL_TUNING = Object.freeze({
  /**
   * `crisis` applies below 30 (the gates' Legitimacy-Crisis edge), `decline` at 30..44
   * (Contested). CRIMINAL is ABSENT BY DESIGN and that mirrors `COUP_COERCION`'s own
   * choice explicitly rather than by accident — criminal factions are filtered out of
   * contention at rulingPowerCoup.js's contender step, so a sensitivity for them would
   * price a seat that can never be contested openly.
   *
   * ⚠ TYPED `Record<string, …>` RATHER THAN LEFT TO INFERENCE, and that is the strict
   * ratchet's law rather than taste: a frozen object literal infers a closed key union, and
   * indexing it with the `string` an archetype resolver returns is TS7053 — the exact error
   * SEAT-1 met on its own frozen table. New/worsened files must be strict-clean.
   * @type {Readonly<Record<string, Readonly<{ crisis: number, decline: number }>>>}
   */
  SENSITIVITY: Object.freeze({
    [A_ARCH.MILITARY]: Object.freeze({ crisis: 1.25, decline: 0.85 }),
    [A_ARCH.NOBLE]: Object.freeze({ crisis: 1.2, decline: 0.9 }),
    [A_ARCH.OCCUPATION]: Object.freeze({ crisis: 1.2, decline: 0.9 }),
    [A_ARCH.ARCANE]: Object.freeze({ crisis: 1.15, decline: 0.95 }),
    // ⭐ THIS ROW WAS `{ crisis: 1.05, decline: 1.05 }` IN THE FIRST DRAFT, AND THE SUITE'S
    // OWN REDISTRIBUTION INVARIANT CAUGHT IT — both multipliers above 1 is an INFLATION, a
    // difficulty knob wearing the design's clothes, and it would have passed every arm that
    // only asked whether the table was reachable. The reading it forced is better than the
    // one it replaced: a religious seat holds a mandate from outside the political score, so
    // it WEATHERS a slow decline that would exhaust a secular council — and pays for that
    // when the crisis becomes total, because a sacred mandate has no gentler failure mode.
    [A_ARCH.RELIGIOUS]: Object.freeze({ crisis: 1.1, decline: 0.9 }),
    [A_ARCH.MERCHANT]: Object.freeze({ crisis: 0.95, decline: 1.15 }),
    [A_ARCH.GOVERNMENT]: Object.freeze({ crisis: 0.85, decline: 1.25 }),
    [A_ARCH.CIVIC]: Object.freeze({ crisis: 0.85, decline: 1.25 }),
    [A_ARCH.CRAFT]: Object.freeze({ crisis: 0.9, decline: 1.2 }),
    [A_ARCH.LABOR]: Object.freeze({ crisis: 0.9, decline: 1.2 }),
    [A_ARCH.OUTSIDER]: Object.freeze({ crisis: 1.1, decline: 1 }),
    [A_ARCH.OTHER]: Object.freeze({ crisis: 1, decline: 1 }),
  }),
  /** The band edges, taken from the gates rather than minted. */
  CRISIS_BELOW: 30,
  DECLINE_BELOW: 45,
  /**
   * The occupied insurgency replacement's span. ⛔ MEASURED, NOT CHOSEN: `insurgencyGate`'s
   * two existing rows multiply to `2.0 × 1.5 = 3.0`, which is EXACTLY `GATE_MULT_MAX`, so on
   * the one cell D4 targets — an occupied town in legitimacy crisis — every additional
   * stacked multiplier is arithmetically INVISIBLE and the whole occupied population sits at
   * one flat saturated value. That is why A2.2.6's "REPLACE, never stack" is not a
   * preference here: stacking provably cannot express anything. The replacement spans the
   * same top (3.0 at maximal resistance) and gives the middle back its range.
   */
  OCCUPIED_BASE: 1.6,
  OCCUPIED_SPAN: 1.4,
});

/**
 * The ONE by-name read of `legitimacyUpheavalEnabled`, off the WORLD STATE rather than the
 * normalized rules (a virtual key has no DEFAULT_SIMULATION_RULES entry to normalize — the
 * `occupierGovernsHere` idiom two hundred lines below, verbatim).
 * ⛔ The positive `=== true` spelling is what the engine-gated-key census discovers; a
 * `!== true` early return reads identically at runtime and is INVISIBLE to it.
 * @param {{worldState?: {simulationRules?: Record<string, unknown>}}} snapshot
 */
function upheavalLit(snapshot) {
  return snapshot?.worldState?.simulationRules?.legitimacyUpheavalEnabled === true;
}

/**
 * The per-archetype sensitivity multiplier for a settlement's SITTING seat.
 * Returns exactly `1` when the key is dark, when no seat governs, or when the score is out
 * of both bands — so every caller below is `x * 1`, which is bit-exact for finite doubles.
 * @param {{worldState?: {simulationRules?: Record<string, unknown>}}} snapshot
 * @param {unknown} settlement
 * @param {number} score
 */
function upheavalSensitivity(snapshot, settlement, score) {
  if (!upheavalLit(snapshot)) return 1;
  const T = UPHEAVAL_TUNING;
  const band = score < T.CRISIS_BELOW ? 'crisis' : score < T.DECLINE_BELOW ? 'decline' : null;
  if (!band) return 1;
  // ⚠ THE CAST NAMES A REAL TYPE RATHER THAN AN ESCAPE HATCH, and that is this file's own
  // ratchet law rather than taste: `domainAnyCastBaseline` freezes this file's hole count as
  // a monotone-down literal, so a new hole regrows debt a burn-down already closed.
  const governing = governingFactionOf(/** @type {import('../rulingPower.js').RulingPowerSettlement} */ (settlement));
  if (!governing) return 1;
  const row = T.SENSITIVITY[factionArchetype(governing)] ?? T.SENSITIVITY[A_ARCH.OTHER];
  return row[band];
}

/**
 * The sensitivity as a `gateResult` FACTOR ROW — `false` (so the composer drops it) whenever
 * the multiplier is exactly 1, which is every dark call. A dropped row also leaves the
 * gate's `reasons` array untouched, so a dark run's receipt is the pre-car one word for word
 * rather than a reason that says nothing.
 * @param {{worldState?: {simulationRules?: Record<string, unknown>}}} snapshot
 * @param {unknown} settlement
 * @param {number} score
 */
function sensitivityRow(snapshot, settlement, score) {
  const mult = upheavalSensitivity(snapshot, settlement, score);
  if (mult === 1) return false;
  return {
    mult,
    reason: mult > 1
      ? 'This kind of seat is brittle to exactly this kind of decline.'
      : 'This kind of seat weathers exactly this kind of decline.',
  };
}

/**
 * Preserve the legacy institution-class fallback for native and genuinely
 * unstamped rows without treating a current custom display name as a class key.
 *
 * `institutionClassValue` remains the canonical classifier. The projection here
 * is local because this module is the consumer deciding whether those native
 * class mechanics may affect stressor birth.
 *
 * @param {import('../settlement.schema.js').SimSettlement} settlement
 * @param {string} className
 */
function nativeInstitutionClassValue(settlement, className) {
  const institutions = Array.isArray(settlement?.institutions)
    ? settlement.institutions.filter(institution => (
      nativeSemanticName(institution)
    ))
    : settlement?.institutions;
  return institutionClassValue({ ...settlement, institutions }, className);
}

/**
 * Compose fired factors into a gate result.
 * @param {any} factors
 * @param {any[]} extraReasons
 */
function gateResult(factors, extraReasons = []) {
  const fired = factors.filter(Boolean);
  return {
    probabilityMult: clampMult(fired.reduce((/** @type {any} */ m, /** @type {any} */ f) => m * f.mult, 1)),
    reasons: [...fired.map((/** @type {any} */ f) => f.reason), ...extraReasons],
  };
}

// ── Snapshot readers ───────────────────────────────────────────────────────

/**
 * @param {any} snapshot
 * @param {any} pressure
 */
function entryFor(snapshot, pressure) {
  return snapshot?.byId?.get?.(String(pressure.settlementId)) || null;
}

/**
 * @param {any} entry
 * @param {any} key
 */
function causalScore(entry, key) {
  const score = entry?.causal?.scores?.[key];
  return Number.isFinite(score) ? score : 50;
}

/** @param {any} snapshot */
function edgesOf(snapshot) {
  return snapshot?.regionalGraph?.edges || snapshot?.relationships || [];
}

/** @param {any} snapshot */
function channelsOf(snapshot) {
  return snapshot?.regionalGraph?.channels || snapshot?.channels || [];
}

/**
 * @param {any} snapshot
 * @param {any} sid
 */
function neighborIdsOf(snapshot, sid) {
  const id = String(sid);
  const out = new Set();
  for (const edge of edgesOf(snapshot)) {
    const from = String(edge?.from ?? '');
    const to = String(edge?.to ?? '');
    if (from === id && to) out.add(to);
    if (to === id && from) out.add(from);
  }
  for (const channel of channelsOf(snapshot)) {
    const from = String(channel?.from ?? '');
    const to = String(channel?.to ?? '');
    if (from === id && to) out.add(to);
    if (to === id && from) out.add(from);
  }
  out.delete(id);
  return out;
}

/** @param {any} snapshot */
function liveStressors(snapshot) {
  return (snapshot?.worldState?.stressors || [])
    .filter((/** @type {any} */ s) => s && !INACTIVE_STATUSES.has(s.status));
}

/**
 * Types of stressors currently gripping this settlement.
 * @param {any} snapshot
 * @param {any} sid
 */
export function activeTypesAt(snapshot, sid) {
  const id = String(sid);
  const out = new Set();
  for (const s of liveStressors(snapshot)) {
    if ((s.affectedSettlementIds || []).map(String).includes(id)) out.add(s.type);
  }
  return out;
}

/**
 * Types of stressors currently gripping any neighbour of this settlement.
 * @param {any} snapshot
 * @param {any} sid
 */
export function activeTypesAtNeighbors(snapshot, sid) {
  const neighbors = neighborIdsOf(snapshot, sid);
  const out = new Set();
  for (const s of liveStressors(snapshot)) {
    for (const affected of s.affectedSettlementIds || []) {
      if (neighbors.has(String(affected))) { out.add(s.type); break; }
    }
  }
  return out;
}

/**
 * Strongest residual memory of a given crisis type at this settlement.
 * @param {any} snapshot
 * @param {any} sid
 * @param {any} type
 */
export function echoStrengthAt(snapshot, sid, type) {
  const id = String(sid);
  let best = 0;
  for (const s of snapshot?.worldState?.stressors || []) {
    if (s?.type !== type || s?.status !== 'residual') continue;
    if (!(s.affectedSettlementIds || []).map(String).includes(id)) continue;
    best = Math.max(best, Number.isFinite(s.memoryStrength) ? s.memoryStrength : 0);
  }
  return best;
}

/**
 * Distinct trade partners: confirmed trade channels + trade-labelled edges.
 * @param {any} snapshot
 * @param {any} sid
 */
export function tradeLinkCount(snapshot, sid) {
  const id = String(sid);
  const partners = new Set();
  for (const channel of channelsOf(snapshot)) {
    if (!['trade_route', 'trade_dependency', 'export_market'].includes(String(channel?.type))) continue;
    if (String(channel?.status || 'confirmed') !== 'confirmed') continue;
    const from = String(channel?.from ?? '');
    const to = String(channel?.to ?? '');
    if (from === id && to) partners.add(to);
    if (to === id && from) partners.add(from);
  }
  for (const edge of edgesOf(snapshot)) {
    const from = String(edge?.from ?? '');
    const to = String(edge?.to ?? '');
    if (from !== id && to !== id) continue;
    if (['trade_partner', 'allied'].includes(relationshipTypeOf(edge))) partners.add(from === id ? to : from);
  }
  return partners.size;
}

/** @param {import('../settlement.schema.js').SimSettlement} settlement */
function isEntrepot(settlement) {
  if (settlement?.economicState?.isEntrepot === true) return true;
  return (settlement?.economicState?.activeChains || [])
    .some((/** @type {any} */ c) => c?.status === 'entrepot' || c?.entrepot === true);
}

/**
 * The "magic matters here" signals for the deadzone gate. A deadzone is only
 * a crisis where magic is load-bearing — each signal names one way it is.
 * @param {import('../settlement.schema.js').SimSettlement} settlement
 */
export function magicDependenceSignals(settlement) {
  /** @type {any[]} */
  const signals = [];
  const ledger = magicLedger(settlement);
  if (!ledger.magicExists) return signals;
  const institutions = settlement?.institutions || [];
  if (institutions.some((/** @type {any} */ inst) => (
    ARCANE_INSTITUTION_PATTERN.test(nativeSemanticName(inst))
  ))) {
    signals.push('arcane institutions anchor daily life');
  }
  if (settlement?.defenseProfile?.magicDependency === true) {
    signals.push('the defenses lean on magic');
  }
  const chains = settlement?.economicState?.activeChains || [];
  if (chains.some((/** @type {any} */ c) => c?.status === 'magically_sustained' || c?.magicNote)) {
    signals.push('supply chains run on magical substitution');
  }
  // Live-first (the field-manifest contract): the channel is derived from
  // the standing roster, verdict as fallback — never the raw generation
  // verdict alone. The roster sniff stays OR'd in: a transport that exists
  // at all marks magic-borne trade as load-bearing for the deadzone story.
  const magicTrade = !!resolveBlockadeBypassChannel(settlement)
    || settlement?.config?._magicTradeOnly === true
    || institutions.some((/** @type {any} */ inst) => (
      /teleportation|planar|extradimensional|airship/i.test(
        nativeSemanticName(inst),
      )
    ));
  if (magicTrade) signals.push('trade arrives by teleport or airship');
  if (['medium', 'high'].includes(ledger.magicLevel)) {
    signals.push(`ambient magic runs ${ledger.magicLevel}`);
  }
  return signals;
}

// Strongest hostile-class neighbour, or null. hostileNeighborsOf sorts most
// hostile first with a deterministic tiebreak (see stressorDynamics).
/**
 * @param {any} snapshot
 * @param {any} sid
 */
function strongestHostile(snapshot, sid) {
  const hostiles = hostileNeighborsOf(snapshot, sid);
  return hostiles.length ? hostiles[0] : null;
}

/**
 * @param {any} snapshot
 * @param {any} sid
 * @param {any} options
 */
function hostileFactor(snapshot, sid, { hostileMult, coldWarMult = null }) {
  const top = strongestHostile(snapshot, sid);
  if (!top) return null;
  if (top.type === 'hostile') {
    return { mult: hostileMult, reason: 'An openly hostile neighbour has the motive.' };
  }
  if (top.type === 'cold_war' && coldWarMult) {
    return { mult: coldWarMult, reason: 'A cold war simmers at the border.' };
  }
  return null;
}

// ── The gates ──────────────────────────────────────────────────────────────
// Each: (snapshot, pressure, context?) => null | { probabilityMult, reasons }.
// Blocking gates return null without an entry (they require political/world
// context to exist at all); gradient-only gates fall back to NEUTRAL.

/**
 * @param {any} snapshot
 * @param {any} pressure
 */
function siegeGate(snapshot, pressure) {
  const entry = entryFor(snapshot, pressure);
  if (!entry) return NEUTRAL;
  const sid = String(pressure.settlementId);
  const here = activeTypesAt(snapshot, sid);
  const near = activeTypesAtNeighbors(snapshot, sid);
  const hostile = hostileFactor(snapshot, sid, { hostileMult: 1.4, coldWarMult: 1.15 });
  const warContext = here.has('wartime') || near.has('wartime') || near.has('siege');
  const threat = entry.settlement?.config?.monsterThreat;
  return gateResult([
    hostile,
    warContext && { mult: 1.3, reason: 'War is already on the march in the region.' },
    !hostile && !warContext
      && { mult: 0.4, reason: 'No declared enemy stands here; only an unnamed host could press a siege.' },
    ['frontier', 'plagued'].includes(threat)
      && { mult: 1.2, reason: 'A frontier settlement makes a tempting target.' },
    causalScore(entry, 'defense_readiness') >= 70
      && { mult: 0.8, reason: 'Strong walls give besiegers pause.' },
  ]);
}

/**
 * @param {any} snapshot
 * @param {any} pressure
 */
function famineGate(snapshot, pressure) {
  const entry = entryFor(snapshot, pressure);
  if (!entry) return NEUTRAL;
  const sid = String(pressure.settlementId);
  const ledger = foodLedger(entry.settlement);
  const foodInst = nativeInstitutionClassValue(entry.settlement, 'food');
  const besieged = activeTypesAt(snapshot, sid).has('siege');
  return gateResult([
    besieged && { mult: 1.6, reason: 'The blockade is starving the granaries.' },
    ledger.deficitPct > 15 && { mult: 1.5, reason: 'Production falls far short of the town\'s needs.' },
    ledger.storageMonths >= 4
      ? { mult: 0.25, reason: 'Deep stores stand between hunger and the town.' }
      : ledger.storageMonths >= 2
        && { mult: 0.6, reason: 'The granaries hold a real reserve.' },
    foodInst >= 1 && { mult: 0.75, reason: 'Redundant food institutions blunt a bad season.' },
  ]);
}

/**
 * @param {any} snapshot
 * @param {any} pressure
 */
function occupationGate(snapshot, pressure) {
  const entry = entryFor(snapshot, pressure);
  if (!entry) return null; // gated births require world context
  const sid = String(pressure.settlementId);
  const here = activeTypesAt(snapshot, sid);
  const hostile = strongestHostile(snapshot, sid);
  const besieged = here.has('siege');
  const atWar = here.has('wartime');
  // No plausible occupier — nobody is at the gates, nobody hostile nearby.
  if (!besieged && !atWar && !hostile) return null;
  return gateResult([
    besieged && { mult: 1.8, reason: 'Sieges end in occupations, and the army is already at the walls.' },
    !besieged && hostile && { mult: 1.2, reason: 'A hostile neighbour stands ready to march in.' },
    !besieged && atWar && { mult: 1.2, reason: 'The war footing puts an army within reach of the gates.' },
    causalScore(entry, 'defense_readiness') >= 70
      && { mult: 0.7, reason: 'Taking this settlement would cost an occupier dearly.' },
  ]);
}

/**
 * @param {any} snapshot
 * @param {any} pressure
 */
function politicalFractureGate(snapshot, pressure) {
  const entry = entryFor(snapshot, pressure);
  if (!entry) return NEUTRAL;
  const sid = String(pressure.settlementId);
  const legitimacy = governanceLedger(entry.settlement).legitimacyScore;
  const here = activeTypesAt(snapshot, sid);
  const coupEcho = echoStrengthAt(snapshot, sid, 'coup_detat');
  return gateResult([
    legitimacy < 30
      ? { mult: 1.6, reason: 'Legitimacy is in open crisis; every ruling claim is contestable.' }
      : legitimacy < 45 && { mult: 1.3, reason: 'The rulers are merely tolerated, and barely that.' },
    here.has('succession_void') && { mult: 1.4, reason: 'An empty seat invites rival claims to law itself.' },
    coupEcho > 0.15 && { mult: 1.3, reason: 'The recent coup left the constitution in splinters.' },
    nativeInstitutionClassValue(entry.settlement, 'admin') >= 1
      && { mult: 0.7, reason: 'Working courts and councils absorb constitutional shocks.' },
    legitimacy >= 70 && { mult: 0.4, reason: 'A trusted government leaves fracture little to grip.' },
  ]);
}

/**
 * @param {any} snapshot
 * @param {any} pressure
 */
function indebtednessGate(snapshot, pressure) {
  const entry = entryFor(snapshot, pressure);
  if (!entry) return NEUTRAL;
  const sid = String(pressure.settlementId);
  const trade = causalScore(entry, 'trade_connectivity');
  const here = activeTypesAt(snapshot, sid);
  const shockEcho = echoStrengthAt(snapshot, sid, 'market_shock');
  return gateResult([
    trade < 25
      ? { mult: 1.7, reason: 'A starved economy borrows at any price.' }
      : trade < 40 && { mult: 1.4, reason: 'Weak trade leaves the ledgers short every season.' },
    here.has('market_shock') && { mult: 1.5, reason: 'The crash drives everyone to the moneylenders.' },
    !here.has('market_shock') && shockEcho > 0.15
      && { mult: 1.25, reason: 'The last crash is still being paid off.' },
    trade >= 70 && { mult: 0.6, reason: 'Strong commerce services its own debts.' },
  ], [
    // The spiral's first act is a boom: borrowed coin buys real prosperity
    // before the creditors call it back. (The drag arrives with severity.)
    'Cheap credit flows in first, so the spiral begins as a boom.',
  ]);
}

/**
 * @param {any} snapshot
 * @param {any} pressure
 * @param {any} context
 */
function betrayalGate(snapshot, pressure, context = {}) {
  const entry = entryFor(snapshot, pressure);
  if (!entry) return NEUTRAL;
  const sid = String(pressure.settlementId);
  const memory = recentHostileMemory(snapshot, sid, context.tick ?? 0);
  return gateResult([
    hostileFactor(snapshot, sid, { hostileMult: 1.3 }),
    !!memory && { mult: 1.2, reason: 'A recently-ended feud left its agents behind.' },
    causalScore(entry, 'criminal_opportunity') >= 60
      && { mult: 1.2, reason: 'The underworld offers willing knives.' },
    causalScore(entry, 'social_trust') >= 70
      && { mult: 0.6, reason: 'A cohesive community is hard ground for treachery.' },
    // Saturation: a betrayal's own fresh echo SUPPRESSES rebirth — loyalty
    // tests and purge fear make a second knife much harder to organize
    // (without this, persistent legitimacy pressure churns a betrayal every
    // other tick: born, purged, reborn, forever).
    echoStrengthAt(snapshot, sid, 'betrayal') > 0.3
      && { mult: 0.45, reason: 'The purges are fresh, so surviving conspirators lie low.' },
  ]);
}

/**
 * @param {any} snapshot
 * @param {any} pressure
 */
function infiltrationGate(snapshot, pressure) {
  const entry = entryFor(snapshot, pressure);
  if (!entry) return NEUTRAL;
  const sid = String(pressure.settlementId);
  return gateResult([
    causalScore(entry, 'criminal_opportunity') >= 60
      && { mult: 1.4, reason: 'Open criminal ground gives a network room to root.' },
    hostileFactor(snapshot, sid, { hostileMult: 1.3, coldWarMult: 1.3 }),
    nativeInstitutionClassValue(entry.settlement, 'security') >= 1
      && { mult: 0.7, reason: 'A practised watch makes infiltration slow, expensive work.' },
  ]);
}

/**
 * @param {any} snapshot
 * @param {any} pressure
 */
function diseaseOutbreakGate(snapshot, pressure) {
  const entry = entryFor(snapshot, pressure);
  if (!entry) return NEUTRAL;
  const sid = String(pressure.settlementId);
  const healing = causalScore(entry, 'healing_capacity');
  const healers = healingLedger(entry.settlement).healerCount;
  const here = activeTypesAt(snapshot, sid);
  return gateResult([
    healing < 35 && { mult: 1.5, reason: 'Healing capacity has collapsed; nothing stands between a fever and a plague.' },
    healers === 0 && { mult: 1.4, reason: 'No healing institutions at all, so the sick have nowhere to go.' },
    here.has('mass_migration') && { mult: 1.4, reason: 'Crowded refugee camps are kindling for contagion.' },
    here.has('famine') && { mult: 1.3, reason: 'The hungry sicken first.' },
    tradeLinkCount(snapshot, sid) >= 3 && { mult: 1.15, reason: 'Contagion travels the trade roads.' },
    healing >= 70 && healers >= 2
      && { mult: 0.55, reason: 'Strong, redundant healing catches outbreaks early.' },
  ]);
}

/**
 * @param {any} snapshot
 * @param {any} pressure
 */
function successionVoidGate(snapshot, pressure) {
  const entry = entryFor(snapshot, pressure);
  if (!entry) return null;
  const sid = String(pressure.settlementId);
  // The coup IS the succession contest — let it play out instead.
  if (activeTypesAt(snapshot, sid).has('coup_detat')) return null;
  const authority = causalScore(entry, 'ruling_authority');
  return gateResult([
    echoStrengthAt(snapshot, sid, 'coup_detat') > 0.15
      && { mult: 1.4, reason: 'The coup hollowed out the line of succession.' },
    echoStrengthAt(snapshot, sid, 'betrayal') > 0.15
      && { mult: 1.2, reason: 'The purges left offices empty and heirs distrusted.' },
    authority < 40 && { mult: 1.3, reason: 'Authority is too weak to settle a disputed seat.' },
    authority >= 70 && { mult: 0.6, reason: 'A firm hand on power forecloses succession games.' },
  ]);
}

/**
 * @param {any} snapshot
 * @param {any} pressure
 */
function monsterRaiderGate(snapshot, pressure) {
  const entry = entryFor(snapshot, pressure);
  if (!entry) return NEUTRAL;
  const sid = String(pressure.settlementId);
  const threat = entry.settlement?.config?.monsterThreat;
  const near = activeTypesAtNeighbors(snapshot, sid);
  const warNearby = WAR_TYPES.some(t => near.has(t));
  return gateResult([
    threat === 'plagued'
      ? { mult: 1.7, reason: 'These lands are plagued, and the wilds press in from every side.' }
      : threat === 'frontier'
        ? { mult: 1.35, reason: 'Frontier country: the wilds are never far.' }
        : threat === 'heartland'
          && { mult: 0.5, reason: 'Settled heartland keeps the wilds at a distance.' },
    warNearby && { mult: 1.3, reason: 'War next door, and raiders follow armies like crows.' },
    causalScore(entry, 'defense_readiness') >= 70
      && { mult: 0.7, reason: 'A hard target; raiders prefer easier prey.' },
    nativeInstitutionClassValue(entry.settlement, 'defense') >= 1
      && { mult: 0.85, reason: 'Standing defenses patrol the approaches.' },
  ]);
}

/**
 * @param {any} snapshot
 * @param {any} pressure
 */
function insurgencyGate(snapshot, pressure) {
  const entry = entryFor(snapshot, pressure);
  if (!entry) return null;
  const sid = String(pressure.settlementId);
  const legitimacy = governanceLedger(entry.settlement).legitimacyScore;
  // Nobody takes up arms against a regime they believe in.
  if (legitimacy >= 75) return null;
  const occupied = activeTypesAt(snapshot, sid).has('occupation');
  // W-SEAT D4 (SEAT-2b), amendment A2.2.6: under occupation the deficit term is REPLACED by
  // `resistance`, never summed with it — the two quantities fight, because resistance carries
  // live legitimacy at +0.3 while every gate reads it inverted, so a town whose ruler is
  // BELIEVED IN would have had both a low deficit and a high resistance pushing opposite
  // ways through one product. The replacement also un-saturates the cell: see
  // UPHEAVAL_TUNING.OCCUPIED_BASE for the measurement that makes stacking unbuildable here.
  // ⛔ THE REPLACEMENT APPLIES ONLY WHERE OCCUPATION TRULY GOVERNS, and that is a SCOPE the
  // first landing of this row did not draw. `occupied` above is the STRESSOR spelling; the
  // `resistance` the replacement spends is the LEDGER's. Reading one and spending the other
  // without asking whether the ledger agrees is the two-consumers-of-one-word failure this
  // family keeps meeting, and it goes wrong in two directions that nothing here could red:
  //   • a town occupied by STRESSOR with NO ledger record resolves `resistance` to its
  //     absent-record default of 0, so the cell would fire at OCCUPIED_BASE — BELOW the 2.0
  //     the pre-car code gave it, and below the 3.0 it gave in crisis. A missing ledger row
  //     would have made an occupied town SAFER, which is a bookkeeping gap deciding a world.
  //   • a MATURED VASSALAGE (ledger present, `occupied` false by the estate's own resolver,
  //     because the rung is `vassalized`) would still have spent an occupier's resistance on
  //     a seat that is no longer under occupation at all.
  // So the predicate is the resolver's own `occupied`, exactly as this file already spells it
  // in `occupierGovernsHere` further down. `occupied === true` implies
  // `ledgerPresent === true` there (the no-`occupierId` path returns both false together), so
  // this one read carries both questions. Anything the ledger does not confirm falls through
  // to the stacked rows, which is the pre-car arithmetic plus this car's own rows.
  const regime = occupied && upheavalLit(snapshot)
    ? occupationRegimeOf(snapshot?.worldState, sid)
    : null;
  const occupiedResistance = regime?.occupied ? regime.resistance : null;
  if (occupiedResistance !== null) {
    const T = UPHEAVAL_TUNING;
    return gateResult([
      { mult: T.OCCUPIED_BASE + T.OCCUPIED_SPAN * occupiedResistance, reason: 'Occupation breeds resistance; every garrison post is a recruiting poster.' },
    ]);
  }
  return gateResult([
    occupied && { mult: 2.0, reason: 'Occupation breeds resistance; every garrison post is a recruiting poster.' },
    legitimacy < 30 && { mult: 1.5, reason: 'The regime has lost the people entirely.' },
    // The 30..45 row `rebellionGate` has always had and this gate never did. The asymmetry
    // was unexplained; D4's rows are chartered to decide it, and the decision is that a
    // merely-tolerated regime faces a WEAKER pull toward armed insurgency than toward
    // rebellion (1.2 against 1.3) because taking up arms is the harder step of the two.
    !occupied && upheavalLit(snapshot) && legitimacy >= 30 && legitimacy < 45
      && { mult: 1.2, reason: 'The regime is merely tolerated, and tolerance arms slowly.' },
    sensitivityRow(snapshot, entry.settlement, legitimacy),
  ]);
}

/**
 * @param {any} snapshot
 * @param {any} pressure
 */
function religiousConversionGate(snapshot, pressure) {
  const entry = entryFor(snapshot, pressure);
  if (!entry) return NEUTRAL;
  const sid = String(pressure.settlementId);
  const authority = causalScore(entry, 'religious_authority');
  const religious = nativeInstitutionClassValue(entry.settlement, 'religious');
  const occupied = activeTypesAt(snapshot, sid).has('occupation');
  return gateResult([
    occupied && { mult: 1.6, reason: "The occupier's faith arrives with its garrison." },
    authority < 40 && { mult: 1.3, reason: 'A weakened orthodoxy cannot hold its flock.' },
    religious >= 1 && { mult: 1.25, reason: 'A plural religious landscape gives the new creed a foothold.' },
    religious === 0 && { mult: 0.7, reason: 'Few congregations here to fracture.' },
    authority >= 75 && { mult: 0.6, reason: 'A strong orthodoxy suppresses schism before it spreads.' },
  ]);
}

/**
 * @param {any} snapshot
 * @param {any} pressure
 */
function rebellionGate(snapshot, pressure) {
  const entry = entryFor(snapshot, pressure);
  if (!entry) return null;
  const sid = String(pressure.settlementId);
  const here = activeTypesAt(snapshot, sid);
  // Under occupation the uprising is a RESISTANCE — insurgency models it.
  if (here.has('occupation')) return null;
  const legitimacy = governanceLedger(entry.settlement).legitimacyScore;
  if (legitimacy >= 75) return null; // no rebellion against a beloved regime
  return gateResult([
    legitimacy < 30
      ? { mult: 1.7, reason: 'The rulers have lost the streets.' }
      : legitimacy < 45 && { mult: 1.3, reason: 'Public patience with the rulers is spent.' },
    (here.has('famine') || here.has('indebtedness'))
      && { mult: 1.3, reason: 'Bread and debt: the oldest fuel of uprisings.' },
    here.has('wartime') && { mult: 1.25, reason: 'War taxes grind the commons toward revolt.' },
    // W-SEAT D4 (SEAT-2b). No occupied arm is needed here: this gate already returns null
    // under occupation, by its own two-lines-up rule that insurgency models the resistance.
    sensitivityRow(snapshot, entry.settlement, legitimacy),
  ]);
}

/**
 * @param {any} snapshot
 * @param {any} pressure
 */
function wartimeGate(snapshot, pressure) {
  const entry = entryFor(snapshot, pressure);
  if (!entry) return NEUTRAL;
  const sid = String(pressure.settlementId);
  const here = activeTypesAt(snapshot, sid);
  const near = activeTypesAtNeighbors(snapshot, sid);
  const hostile = hostileFactor(snapshot, sid, { hostileMult: 1.5, coldWarMult: 1.2 });
  const warNearby = WAR_TYPES.some(t => near.has(t));
  const raiders = here.has('monster_raider_pressure');
  return gateResult([
    hostile,
    warNearby && { mult: 1.3, reason: 'The war next door demands a footing of its own.' },
    raiders && { mult: 1.2, reason: 'Raider pressure pushes the militia toward full mobilization.' },
    !hostile && !warNearby && !raiders
      && { mult: 0.3, reason: 'No enemy in sight; mobilization would be against shadows.' },
  ]);
}

/**
 * @param {any} snapshot
 * @param {any} pressure
 */
function massMigrationGate(snapshot, pressure) {
  const entry = entryFor(snapshot, pressure);
  if (!entry) return null;
  const sid = String(pressure.settlementId);
  const here = activeTypesAt(snapshot, sid);
  // The siege line is sealed: nobody marches a column of refugees through it.
  if (here.has('siege')) return null;
  const near = activeTypesAtNeighbors(snapshot, sid);
  const neighborCrisis = ['famine', 'siege', 'wartime', 'occupation', 'disease_outbreak']
    .some(t => near.has(t));
  return gateResult([
    neighborCrisis && { mult: 1.6, reason: 'Crisis next door sends its people up this road.' },
    !neighborCrisis && { mult: 0.7, reason: 'No neighbouring crisis is driving people from their homes.' },
    here.has('occupation') && { mult: 0.5, reason: 'The occupier controls movement in and out.' },
  ]);
}

/**
 * @param {any} snapshot
 * @param {any} pressure
 */
function marketShockGate(snapshot, pressure) {
  const entry = entryFor(snapshot, pressure);
  if (!entry) return NEUTRAL;
  const sid = String(pressure.settlementId);
  const links = tradeLinkCount(snapshot, sid);
  const here = activeTypesAt(snapshot, sid);
  const near = activeTypesAtNeighbors(snapshot, sid);
  return gateResult([
    links >= 3 && { mult: 1.3, reason: 'Deep market exposure: what crashes elsewhere crashes here.' },
    links === 0 && { mult: 0.3, reason: 'A near-closed economy has little market to shock.' },
    isEntrepot(entry.settlement) && { mult: 1.3, reason: 'An entrepôt lives and dies by the flow of goods.' },
    near.has('market_shock') && { mult: 1.4, reason: 'The panic is already spreading along the trade roads.' },
    here.has('indebtedness') && { mult: 1.3, reason: 'Leveraged ledgers amplify every tremor.' },
    nativeInstitutionClassValue(entry.settlement, 'finance') >= 1
      && { mult: 0.8, reason: 'Established finance houses can absorb a run.' },
  ]);
}

/**
 * @param {any} snapshot
 * @param {any} pressure
 */
function criminalCorridorGate(snapshot, pressure) {
  const entry = entryFor(snapshot, pressure);
  if (!entry) return NEUTRAL;
  const sid = String(pressure.settlementId);
  const links = tradeLinkCount(snapshot, sid);
  const corridorChannel = channelsOf(snapshot).some((/** @type {any} */ c) =>
    String(c?.type) === 'criminal_corridor'
    && (String(c?.from) === sid || String(c?.to) === sid));
  return gateResult([
    links === 0 && !corridorChannel
      && { mult: 0.35, reason: 'A corridor needs traffic, and there is none here to hide in.' },
    causalScore(entry, 'criminal_opportunity') >= 60
      && { mult: 1.4, reason: 'The underworld already owns the night here.' },
    activeTypesAt(snapshot, sid).has('infiltration')
      && { mult: 1.25, reason: 'Embedded agents keep the route open.' },
    governanceLedger(entry.settlement).legitimacyScore < 40
      && { mult: 1.2, reason: 'Nobody trusts the authorities enough to inform.' },
    nativeInstitutionClassValue(entry.settlement, 'security') >= 1
      && { mult: 0.75, reason: 'A practised watch chokes smuggling at the gates.' },
  ]);
}

/**
 * @param {any} snapshot
 * @param {any} pressure
 */
function magicalInstabilityGate(snapshot, pressure) {
  const entry = entryFor(snapshot, pressure);
  if (!entry) return null;
  const sid = String(pressure.settlementId);
  const ledger = magicLedger(entry.settlement);
  if (!ledger.magicExists) return null; // low magic is not wild magic
  const arcane = nativeInstitutionClassValue(entry.settlement, 'arcane');
  if (arcane === 0 && !['medium', 'high'].includes(ledger.magicLevel)) return null;
  // Dead ground and wild surges cannot share a sky.
  if (activeTypesAt(snapshot, sid).has('magic_deadzone')) return null;
  return gateResult([
    arcane >= 1 && { mult: 1.3, reason: 'Concentrated arcane practice, where experiments go wrong at scale.' },
    causalScore(entry, 'magical_stability') < 40
      && { mult: 1.4, reason: 'The weave here is already frayed.' },
  ]);
}

/**
 * @param {any} snapshot
 * @param {any} pressure
 */
function magicDeadzoneGate(snapshot, pressure) {
  const entry = entryFor(snapshot, pressure);
  if (!entry) return null;
  const sid = String(pressure.settlementId);
  const signals = magicDependenceSignals(entry.settlement);
  // The deadzone is only a crisis where magic is load-bearing.
  if (!signals.length) return null;
  // Mutual exclusion: a wild surge and dead ground cannot coexist.
  if (activeTypesAt(snapshot, sid).has('magical_instability')) return null;
  const instabilityEcho = echoStrengthAt(snapshot, sid, 'magical_instability');
  return gateResult([
    instabilityEcho > 0.15
      && { mult: 1.5, reason: 'The burned-out surge left dead ground behind it.' },
    signals.length >= 2
      && { mult: 1.3, reason: `Magic is load-bearing here: ${signals.slice(0, 2).join('; ')}.` },
    nativeInstitutionClassValue(entry.settlement, 'arcane') >= 1
      && { mult: 0.8, reason: 'Standing wards resist the silence, for now.' },
  ], [
    `Why it matters here: ${signals[0]}.`,
  ]);
}

/**
 * THE OCCUPIED PREDICATE AT THE COUP GATE — W-SEAT SEAT-1, D4's named move
 * ("the coupSpawnGate's occupation-null moves from the stressor spelling to THE
 * occupied predicate", law §2.1), landed FLAG-GATED exactly as A1.1.2 rules.
 *
 * ⚠ THIS IS A MEASURED WIDENING, NOT PLUMBING, AND THE MEASUREMENT CAME FIRST.
 * A1.1.2 forbids assuming the two spellings agree, so SEAT-1 measured them
 * (receipt: the four-case probe in `tests/domain/foreignSeatResolver.test.js`,
 * "the occupied-predicate delta"). They diverge in BOTH directions because they
 * read two arrays that no writer links:
 *
 *   • LEDGER-ONLY (`worldState.occupations[sid]`): a war-layer conquest mints a
 *     ledger row at occupation.js:966 and NEVER a `type:'occupation'` stressor.
 *     Measured: the stressor spelling reads `false`, so THIS GATE OPENS and a
 *     coup spawns in a town whose seat is already held at spearpoint. That is
 *     the live defect the move cures.
 *   • STRESSOR-ONLY (`worldState.stressors`): a generation-authored `occupied`
 *     stress (stressorPicker.js:38) or a pressure-born occupation stressor has
 *     no ledger row at all. The gate blocks today, and MUST keep blocking.
 *
 * So the lit predicate is the UNION, never a swap: it can only ever block MORE
 * coups than today, never fewer. ⛔ AND THE DARK PATH KEEPS THE STRESSOR
 * SPELLING VERBATIM — that is the written admission A1.1.2 demands, not an
 * oversight: a dark world's coup gate behaves byte-identically to before this
 * commit, and "0-when-dark" is NEVER cited as a licence for a predicate swap.
 * Promotion to an unconditional declared repair is an OWNER ruling with this
 * measurement in hand, not a later lane's judgment call.
 *
 * The flag is read off the WORLD STATE rather than normalized rules — a virtual
 * key has no DEFAULT_SIMULATION_RULES entry to normalize, so the normalizer
 * would strip it (the `brokerageEffectsActive` idiom, brokerageStamps.js:397).
 *
 * ⚠ THE SHAPE IS SPELLED OUT RATHER THAN LEFT `any`, and that is the any-cast
 * ratchet's law rather than taste: this file's allowance is a frozen number and a
 * new hole regrows debt a burn-down closed. The two keys named here are the only
 * two this function reads off the snapshot.
 * @param {{worldState?: {simulationRules?: Record<string, unknown>}}} snapshot
 * @param {string} sid @returns {boolean}
 */
function occupierGovernsHere(snapshot, sid) {
  const stressorSpelling = activeTypesAt(snapshot, sid).has('occupation');
  // ⛔ THE POSITIVE `=== true` SPELLING IS LOAD-BEARING, NOT STYLE. The engine-gated-key
  // census (tests/lint/engineGatedRuleKeys.walker.test.js) discovers virtual flags by
  // scanning for exactly this form; a `!== true` early-return reads identically at runtime
  // and is INVISIBLE to it, which would leave this key manifested with no measured gate.
  // The errandSpine row records the same trap from the other side.
  const simulationRules = snapshot?.worldState?.simulationRules;
  if (simulationRules?.foreignSeatEnabled === true) {
    return stressorSpelling || occupationRegimeOf(snapshot?.worldState, sid).occupied;
  }
  return stressorSpelling;
}

// ── Coup spawn gate (moved verbatim-in-spirit from stressors.js) ───────────
// A coup is gated on settlement POLITICS rather than raw pressure alone: it
// needs an exposed seat (legitimacy Contested or worse — rare at Contested,
// likely at Crisis), a governing authority weak enough to move against, no
// occupier already governing at spearpoint, and at least one non-criminal
// faction with the muscle to act (criminal factions never vie openly — the
// capture ladder is their path).
/**
 * @param {any} snapshot
 * @param {any} pressure
 */
function coupSpawnGate(snapshot, pressure) {
  const sid = String(pressure.settlementId);
  const entry = snapshot?.byId?.get?.(sid);
  const settlement = entry?.settlement;
  if (!settlement) return null; // gated births require political context
  // ⭐ THROUGH THE LEDGER, LIKE EVERY OTHER GATE IN THIS FILE — the :399 cure
  // (R-T4-MINIWIN, SHIFT RECORD SR-d). This line was the file's ONLY bypass of
  // `governanceLedger`: four sibling gates (politicalFracture, insurgency, rebellion,
  // criminalCorridor) read the conserved quantity through the ledger and this one read the
  // raw field. The bypass was NOT cosmetic. The ledger deliberately honours a LEGACY
  // BARE-NUMBER `publicLegitimacy` — that is the null/legacy handling it exists to unify —
  // while `Number.isFinite(legitimacy?.score)` sees `undefined` on exactly those saves and
  // falls to a neutral 50. So on a legacy world in legitimacy crisis every other gate saw
  // the real score and the coup gate refused to open, at 45.
  //
  // ⛔ THE MOVEMENT IS THREE CELLS AND THE GENERATOR CANNOT MINT ANY OF THEM. Measured over
  // the whole shape space: canonical object, string score, NaN score, null and absent all
  // read identically both ways; only the bare number moves, and on two of its three sampled
  // values the gate flips REFUSES -> opens. Every producer in `src/` writes the object form,
  // and every sim writer spreads `{ ...pl, score }`, which upgrades a bare number to an
  // object on first write — so no corpus, golden or probe arm can reach this delta.
  const score = governanceLedger(settlement).legitimacyScore;
  if (score >= 45) return null; // Tolerated or better — nobody moves
  if (occupierGovernsHere(snapshot, sid)) return null; // the occupier IS the authority
  const { challengers } = coupContenders(settlement);
  if (!challengers.length) return null;
  const ra = entry?.causal?.scores?.ruling_authority;
  const authority = Number.isFinite(ra) ? ra : 50;
  const bandMult = score < 30 ? 1 : 0.35; // rare at Contested, likely at Crisis
  const authorityMult = authority < 15 ? 1.5 : authority < 30 ? 1.2 : authority < 50 ? 1 : 0.6;
  // W-SEAT D4 (SEAT-2b) — the per-archetype sensitivity. The band scaling §736 asks for is
  // ALREADY HERE as `bandMult`; adding a second band multiplier would be a second resolver
  // for one quantity and a double-count.
  const sensitivity = upheavalSensitivity(snapshot, settlement, score);
  // ⭐ THE PRODUCT IS BOUNDED LIKE EVERY OTHER GATE'S — the :384 cure (R-T4-MINIWIN, SHIFT
  // RECORD SR-c). This is the one gate in the file that does not compose through
  // `gateResult`, so for its whole life its product escaped `clampMult` while all nineteen
  // siblings were bounded to [0.1, 3]. SEAT-2b clamped its new FACTOR alone and recorded the
  // gate's unboundedness as a deferred declared shift; the mini-window closes it at the
  // composition, where the invariant actually lives, and the factor-level clamp is retired as
  // redundant rather than left as a second bound on one quantity.
  //
  // ⛔ AND IT MOVES NOTHING TODAY — MEASURED, WHICH FALSIFIES THE PREMISE OF ITS OWN
  // DEFERRAL. laneT4-receipt.md:384 deferred the cure because "curing it is a same-seed shift
  // on every world with a contested seat". The input set is finite and was enumerated WHOLE:
  // `bandMult` has 2 values, `authorityMult` 4, `sensitivity` 1 dark and 8 lit. All 8 dark
  // products fall in [0.21, 1.5] and all 64 lit ones in [0.1785, 1.875] — every one already
  // inside [0.1, 3], so the clamp is the identity on every reachable state and the dark
  // products are bit-identical through it. The top cell has 2.00x of head-room before the
  // bound bites. So this is a STRUCTURAL cure with an executed zero-movement proof, not a
  // same-seed mover; the pin lives in tests/domain/stressorGates.test.js.
  return {
    probabilityMult: clampMult(bandMult * authorityMult * sensitivity),
    reasons: [
      'Legitimacy is openly contested; the seat stands exposed.',
      `Governing authority ${authority < 30 ? 'is crumbling' : authority < 50 ? 'is strained' : 'still holds'}.`,
      `Factions with the power to move: ${challengers.map(c => c.name).join(', ')}.`,
    ],
  };
}

export const STRESSOR_SPAWN_GATES = Object.freeze({
  siege: siegeGate,
  famine: famineGate,
  occupation: occupationGate,
  political_fracture: politicalFractureGate,
  indebtedness: indebtednessGate,
  betrayal: betrayalGate,
  infiltration: infiltrationGate,
  disease_outbreak: diseaseOutbreakGate,
  succession_void: successionVoidGate,
  monster_raider_pressure: monsterRaiderGate,
  insurgency: insurgencyGate,
  religious_conversion_fracture: religiousConversionGate,
  rebellion: rebellionGate,
  wartime: wartimeGate,
  mass_migration: massMigrationGate,
  market_shock: marketShockGate,
  criminal_corridor: criminalCorridorGate,
  magical_instability: magicalInstabilityGate,
  magic_deadzone: magicDeadzoneGate,
  coup_detat: coupSpawnGate,
});

// Gates that can hard-block need real world context; the legacy snapshot-less
// candidate path skips these types entirely (the coup always behaved so).
for (const type of [
  'occupation', 'succession_void', 'insurgency', 'rebellion', 'mass_migration',
  'magical_instability', 'magic_deadzone', 'coup_detat',
]) {
  /** @type {any} */ (STRESSOR_SPAWN_GATES)[type].requiresSnapshot = true;
}
