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
import { coupContenders } from '../rulingPower.js';
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

function clampMult(value) {
  return Math.max(GATE_MULT_MIN, Math.min(GATE_MULT_MAX, value));
}

const NEUTRAL = Object.freeze({ probabilityMult: 1, reasons: [] });

/** Compose fired factors into a gate result. */
function gateResult(factors, extraReasons = []) {
  const fired = factors.filter(Boolean);
  return {
    probabilityMult: clampMult(fired.reduce((m, f) => m * f.mult, 1)),
    reasons: [...fired.map(f => f.reason), ...extraReasons],
  };
}

// ── Snapshot readers ───────────────────────────────────────────────────────

function entryFor(snapshot, pressure) {
  return snapshot?.byId?.get?.(String(pressure.settlementId)) || null;
}

function causalScore(entry, key) {
  const score = entry?.causal?.scores?.[key];
  return Number.isFinite(score) ? score : 50;
}

function edgesOf(snapshot) {
  return snapshot?.regionalGraph?.edges || snapshot?.relationships || [];
}

function channelsOf(snapshot) {
  return snapshot?.regionalGraph?.channels || snapshot?.channels || [];
}

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

function liveStressors(snapshot) {
  return (snapshot?.worldState?.stressors || [])
    .filter(s => s && !INACTIVE_STATUSES.has(s.status));
}

/** Types of stressors currently gripping this settlement. */
export function activeTypesAt(snapshot, sid) {
  const id = String(sid);
  const out = new Set();
  for (const s of liveStressors(snapshot)) {
    if ((s.affectedSettlementIds || []).map(String).includes(id)) out.add(s.type);
  }
  return out;
}

/** Types of stressors currently gripping any neighbour of this settlement. */
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

/** Strongest residual memory of a given crisis type at this settlement. */
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

/** Distinct trade partners: confirmed trade channels + trade-labelled edges. */
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

function isEntrepot(settlement) {
  if (settlement?.economicState?.isEntrepot === true) return true;
  return (settlement?.economicState?.activeChains || [])
    .some(c => c?.status === 'entrepot' || c?.entrepot === true);
}

/**
 * The "magic matters here" signals for the deadzone gate. A deadzone is only
 * a crisis where magic is load-bearing — each signal names one way it is.
 */
export function magicDependenceSignals(settlement) {
  const signals = [];
  const ledger = magicLedger(settlement);
  if (!ledger.magicExists) return signals;
  const institutions = settlement?.institutions || [];
  if (institutions.some(inst => ARCANE_INSTITUTION_PATTERN.test(String(inst?.name || '')))) {
    signals.push('arcane institutions anchor daily life');
  }
  if (settlement?.defenseProfile?.magicDependency === true) {
    signals.push('the defenses lean on magic');
  }
  const chains = settlement?.economicState?.activeChains || [];
  if (chains.some(c => c?.status === 'magically_sustained' || c?.magicNote)) {
    signals.push('supply chains run on magical substitution');
  }
  // Live-first (the field-manifest contract): the channel is derived from
  // the standing roster, verdict as fallback — never the raw generation
  // verdict alone. The roster sniff stays OR'd in: a transport that exists
  // at all marks magic-borne trade as load-bearing for the deadzone story.
  const magicTrade = !!resolveBlockadeBypassChannel(settlement)
    || settlement?.config?._magicTradeOnly === true
    || institutions.some(inst => /teleportation|planar|extradimensional|airship/i.test(String(inst?.name || '')));
  if (magicTrade) signals.push('trade arrives by teleport or airship');
  if (['medium', 'high'].includes(ledger.magicLevel)) {
    signals.push(`ambient magic runs ${ledger.magicLevel}`);
  }
  return signals;
}

// Strongest hostile-class neighbour, or null. hostileNeighborsOf sorts most
// hostile first with a deterministic tiebreak (see stressorDynamics).
function strongestHostile(snapshot, sid) {
  const hostiles = hostileNeighborsOf(snapshot, sid);
  return hostiles.length ? hostiles[0] : null;
}

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
      && { mult: 0.4, reason: 'No declared enemy — only an unnamed host could press a siege here.' },
    ['frontier', 'plagued'].includes(threat)
      && { mult: 1.2, reason: 'A frontier settlement makes a tempting target.' },
    causalScore(entry, 'defense_readiness') >= 70
      && { mult: 0.8, reason: 'Strong walls give besiegers pause.' },
  ]);
}

function famineGate(snapshot, pressure) {
  const entry = entryFor(snapshot, pressure);
  if (!entry) return NEUTRAL;
  const sid = String(pressure.settlementId);
  const ledger = foodLedger(entry.settlement);
  const foodInst = institutionClassValue(entry.settlement, 'food');
  const besieged = activeTypesAt(snapshot, sid).has('siege');
  return gateResult([
    besieged && { mult: 1.6, reason: 'The blockade is starving the granaries.' },
    ledger.deficitPct > 15 && { mult: 1.5, reason: `Production already runs ${Math.round(ledger.deficitPct)}% short.` },
    ledger.storageMonths >= 4
      ? { mult: 0.25, reason: `${Math.round(ledger.storageMonths)} months of stores stand between hunger and the town.` }
      : ledger.storageMonths >= 2
        && { mult: 0.6, reason: 'The granaries hold a real reserve.' },
    foodInst >= 1 && { mult: 0.75, reason: 'Redundant food institutions blunt a bad season.' },
  ]);
}

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
    besieged && { mult: 1.8, reason: 'Sieges end in occupations — the army is already at the walls.' },
    !besieged && hostile && { mult: 1.2, reason: 'A hostile neighbour stands ready to march in.' },
    !besieged && atWar && { mult: 1.2, reason: 'The war footing puts an army within reach of the gates.' },
    causalScore(entry, 'defense_readiness') >= 70
      && { mult: 0.7, reason: 'Taking this settlement would cost an occupier dearly.' },
  ]);
}

function politicalFractureGate(snapshot, pressure) {
  const entry = entryFor(snapshot, pressure);
  if (!entry) return NEUTRAL;
  const sid = String(pressure.settlementId);
  const legitimacy = governanceLedger(entry.settlement).legitimacyScore;
  const here = activeTypesAt(snapshot, sid);
  const coupEcho = echoStrengthAt(snapshot, sid, 'coup_detat');
  return gateResult([
    legitimacy < 30
      ? { mult: 1.6, reason: 'Legitimacy is in open crisis — every ruling claim is contestable.' }
      : legitimacy < 45 && { mult: 1.3, reason: 'The rulers are merely tolerated, and barely that.' },
    here.has('succession_void') && { mult: 1.4, reason: 'An empty seat invites rival claims to law itself.' },
    coupEcho > 0.15 && { mult: 1.3, reason: 'The recent coup left the constitution in splinters.' },
    institutionClassValue(entry.settlement, 'admin') >= 1
      && { mult: 0.7, reason: 'Working courts and councils absorb constitutional shocks.' },
    legitimacy >= 70 && { mult: 0.4, reason: 'A trusted government leaves fracture little to grip.' },
  ]);
}

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
    'Cheap credit flows in first — the spiral begins as a boom.',
  ]);
}

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
      && { mult: 0.45, reason: 'The purges are fresh — surviving conspirators lie low.' },
  ]);
}

function infiltrationGate(snapshot, pressure) {
  const entry = entryFor(snapshot, pressure);
  if (!entry) return NEUTRAL;
  const sid = String(pressure.settlementId);
  return gateResult([
    causalScore(entry, 'criminal_opportunity') >= 60
      && { mult: 1.4, reason: 'Open criminal ground gives a network room to root.' },
    hostileFactor(snapshot, sid, { hostileMult: 1.3, coldWarMult: 1.3 }),
    institutionClassValue(entry.settlement, 'security') >= 1
      && { mult: 0.7, reason: 'A practised watch makes infiltration slow, expensive work.' },
  ]);
}

function diseaseOutbreakGate(snapshot, pressure) {
  const entry = entryFor(snapshot, pressure);
  if (!entry) return NEUTRAL;
  const sid = String(pressure.settlementId);
  const healing = causalScore(entry, 'healing_capacity');
  const healers = healingLedger(entry.settlement).healerCount;
  const here = activeTypesAt(snapshot, sid);
  return gateResult([
    healing < 35 && { mult: 1.5, reason: 'Healing capacity has collapsed — nothing stands between a fever and a plague.' },
    healers === 0 && { mult: 1.4, reason: 'No healing institutions at all — the sick have nowhere to go.' },
    here.has('mass_migration') && { mult: 1.4, reason: 'Crowded refugee camps are kindling for contagion.' },
    here.has('famine') && { mult: 1.3, reason: 'The hungry sicken first.' },
    tradeLinkCount(snapshot, sid) >= 3 && { mult: 1.15, reason: 'Contagion travels the trade roads.' },
    healing >= 70 && healers >= 2
      && { mult: 0.55, reason: 'Strong, redundant healing catches outbreaks early.' },
  ]);
}

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

function monsterRaiderGate(snapshot, pressure) {
  const entry = entryFor(snapshot, pressure);
  if (!entry) return NEUTRAL;
  const sid = String(pressure.settlementId);
  const threat = entry.settlement?.config?.monsterThreat;
  const near = activeTypesAtNeighbors(snapshot, sid);
  const warNearby = WAR_TYPES.some(t => near.has(t));
  return gateResult([
    threat === 'plagued'
      ? { mult: 1.7, reason: 'These lands are plagued — the wilds press in constantly.' }
      : threat === 'frontier'
        ? { mult: 1.35, reason: 'Frontier country: the wilds are never far.' }
        : threat === 'heartland'
          && { mult: 0.5, reason: 'Settled heartland keeps the wilds at a distance.' },
    warNearby && { mult: 1.3, reason: 'War next door — raiders follow armies like crows.' },
    causalScore(entry, 'defense_readiness') >= 70
      && { mult: 0.7, reason: 'A hard target; raiders prefer easier prey.' },
    institutionClassValue(entry.settlement, 'defense') >= 1
      && { mult: 0.85, reason: 'Standing defenses patrol the approaches.' },
  ]);
}

function insurgencyGate(snapshot, pressure) {
  const entry = entryFor(snapshot, pressure);
  if (!entry) return null;
  const sid = String(pressure.settlementId);
  const legitimacy = governanceLedger(entry.settlement).legitimacyScore;
  // Nobody takes up arms against a regime they believe in.
  if (legitimacy >= 75) return null;
  const occupied = activeTypesAt(snapshot, sid).has('occupation');
  return gateResult([
    occupied && { mult: 2.0, reason: 'Occupation breeds resistance — every garrison post is a recruiting poster.' },
    legitimacy < 30 && { mult: 1.5, reason: 'The regime has lost the people entirely.' },
  ]);
}

function religiousConversionGate(snapshot, pressure) {
  const entry = entryFor(snapshot, pressure);
  if (!entry) return NEUTRAL;
  const sid = String(pressure.settlementId);
  const authority = causalScore(entry, 'religious_authority');
  const religious = institutionClassValue(entry.settlement, 'religious');
  const occupied = activeTypesAt(snapshot, sid).has('occupation');
  return gateResult([
    occupied && { mult: 1.6, reason: "The occupier's faith arrives with its garrison." },
    authority < 40 && { mult: 1.3, reason: 'A weakened orthodoxy cannot hold its flock.' },
    religious >= 1 && { mult: 1.25, reason: 'A plural religious landscape gives the new creed a foothold.' },
    religious === 0 && { mult: 0.7, reason: 'Few congregations here to fracture.' },
    authority >= 75 && { mult: 0.6, reason: 'A strong orthodoxy suppresses schism before it spreads.' },
  ]);
}

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
      && { mult: 1.3, reason: 'Bread and debt — the oldest fuel of uprisings.' },
    here.has('wartime') && { mult: 1.25, reason: 'War taxes grind the commons toward revolt.' },
  ]);
}

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
      && { mult: 0.3, reason: 'No enemy in sight — mobilization would be against shadows.' },
  ]);
}

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
    institutionClassValue(entry.settlement, 'finance') >= 1
      && { mult: 0.8, reason: 'Established finance houses can absorb a run.' },
  ]);
}

function criminalCorridorGate(snapshot, pressure) {
  const entry = entryFor(snapshot, pressure);
  if (!entry) return NEUTRAL;
  const sid = String(pressure.settlementId);
  const links = tradeLinkCount(snapshot, sid);
  const corridorChannel = channelsOf(snapshot).some(c =>
    String(c?.type) === 'criminal_corridor'
    && (String(c?.from) === sid || String(c?.to) === sid));
  return gateResult([
    links === 0 && !corridorChannel
      && { mult: 0.35, reason: 'A corridor needs traffic — there is none here to hide in.' },
    causalScore(entry, 'criminal_opportunity') >= 60
      && { mult: 1.4, reason: 'The underworld already owns the night here.' },
    activeTypesAt(snapshot, sid).has('infiltration')
      && { mult: 1.25, reason: 'Embedded agents keep the route open.' },
    governanceLedger(entry.settlement).legitimacyScore < 40
      && { mult: 1.2, reason: 'Nobody trusts the authorities enough to inform.' },
    institutionClassValue(entry.settlement, 'security') >= 1
      && { mult: 0.75, reason: 'A practised watch chokes smuggling at the gates.' },
  ]);
}

function magicalInstabilityGate(snapshot, pressure) {
  const entry = entryFor(snapshot, pressure);
  if (!entry) return null;
  const sid = String(pressure.settlementId);
  const ledger = magicLedger(entry.settlement);
  if (!ledger.magicExists) return null; // low magic is not wild magic (Wave 1 #5)
  const arcane = institutionClassValue(entry.settlement, 'arcane');
  if (arcane === 0 && !['medium', 'high'].includes(ledger.magicLevel)) return null;
  // Dead ground and wild surges cannot share a sky.
  if (activeTypesAt(snapshot, sid).has('magic_deadzone')) return null;
  return gateResult([
    arcane >= 1 && { mult: 1.3, reason: 'Concentrated arcane practice — experiments go wrong at scale.' },
    causalScore(entry, 'magical_stability') < 40
      && { mult: 1.4, reason: 'The weave here is already frayed.' },
  ]);
}

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
    institutionClassValue(entry.settlement, 'arcane') >= 1
      && { mult: 0.8, reason: 'Standing wards resist the silence — for now.' },
  ], [
    `Why it matters here: ${signals[0]}.`,
  ]);
}

// ── Coup spawn gate (moved verbatim-in-spirit from stressors.js) ───────────
// A coup is gated on settlement POLITICS rather than raw pressure alone: it
// needs an exposed seat (legitimacy Contested or worse — rare at Contested,
// likely at Crisis), a governing authority weak enough to move against, no
// occupier already governing at spearpoint, and at least one non-criminal
// faction with the muscle to act (criminal factions never vie openly — the
// capture ladder is their path).
function coupSpawnGate(snapshot, pressure) {
  const sid = String(pressure.settlementId);
  const entry = snapshot?.byId?.get?.(sid);
  const settlement = entry?.settlement;
  if (!settlement) return null; // gated births require political context
  const legitimacy = settlement.powerStructure?.publicLegitimacy;
  const score = Number.isFinite(legitimacy?.score) ? legitimacy.score : 50;
  if (score >= 45) return null; // Tolerated or better — nobody moves
  if (activeTypesAt(snapshot, sid).has('occupation')) return null; // the occupier IS the authority
  const { challengers } = coupContenders(settlement);
  if (!challengers.length) return null;
  const ra = entry?.causal?.scores?.ruling_authority;
  const authority = Number.isFinite(ra) ? ra : 50;
  const bandMult = score < 30 ? 1 : 0.35; // rare at Contested, likely at Crisis
  const authorityMult = authority < 15 ? 1.5 : authority < 30 ? 1.2 : authority < 50 ? 1 : 0.6;
  return {
    probabilityMult: bandMult * authorityMult,
    reasons: [
      `Legitimacy stands at ${Math.round(score)} (${legitimacy?.label || 'Contested'}) — the seat is exposed.`,
      `Governing authority ${authority < 30 ? 'is crumbling' : authority < 50 ? 'is strained' : 'still holds'} (ruling authority ${Math.round(authority)}).`,
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
  STRESSOR_SPAWN_GATES[type].requiresSnapshot = true;
}
