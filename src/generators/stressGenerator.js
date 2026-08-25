/**
 * stressGenerator.js
 * Stress condition selection and application.
 *
 * Generates the stress object(s) for a settlement — either from forced user
 * selection, or probabilistically based on settlement characteristics.
 */

import { random as _rng } from '../kernel/rngContext.js';
import {tierAtLeast, getTradeRouteFeatures} from './helpers.js';
import { rollStressSummary, renderStressSummary } from './stressNarrative.js';

import {STRESS_TYPE_MAP} from '../data/stressTypes.js';

// ─── Tier helpers ─────────────────────────────────────────────────────────────

const SMALL_TIERS = ['thorp', 'hamlet', 'village'];
const isSmallTier = (tier) => SMALL_TIERS.includes(tier);

// ─── buildStressEntry ─────────────────────────────────────────────────────────

/**
 * Construct a full stress entry object from a stress type key and its map data.
 *
 * F8 (roll/render split): the settlement NAME does not exist at pipeline time —
 * resolveStress (step 3) rolls stress with name==='' and the name is minted 16
 * steps later in assembleSettlement. So we split the summary in two:
 *   - rollStressSummary draws the rng-derived choice (only wartime draws) into a
 *     small JSON-serializable `summaryRoll` token, at the EXACT position the old
 *     single-phase `stressSummary` call drew rng — keeping every downstream rng
 *     fork byte-identical.
 *   - renderStressSummary produces a PROVISIONAL summary now (name is '' here, so
 *     guarded templates render 'the settlement'; bare-name templates render a
 *     leading space). Nothing reads `.summary` before assembly, where
 *     assembleSettlement re-renders it from `summaryRoll` with the real name and
 *     then deletes the transient token.
 *
 * @param {string} settlementName  - '' at pipeline time; the real name at assembly
 * @param {string} stressType      - key from STRESS_TYPE_MAP
 * @param {Object} stressData      - STRESS_TYPE_MAP[stressType]
 */
export const buildStressEntry = (settlementName, stressType, stressData) => {
  const summaryRoll = rollStressSummary(stressType, { rng: _rng });
  return {
    type:          stressType,
    label:         stressData.label,
    icon:          stressData.icon,
    colour:        stressData.colour,
    summaryRoll,
    summary:       renderStressSummary(stressType, settlementName, summaryRoll),
    crisisHook:    stressData.crisisHook,
    viabilityNote: stressData.viabilityNote,
    historyColour: stressData.historyColour,
  };
};

// ─── buildStressContext ───────────────────────────────────────────────────────

/**
 * Compute the adjusted probability for a specific stress type given this
 * settlement's characteristics. Returns a value capped at 0.35.
 *
 * Each stress type starts from its base probability defined in STRESS_TYPE_MAP,
 * then multipliers are applied based on:
 *  - Monster threat level
 *  - Trade route type
 *  - Priority slider values
 *  - Nearby resources
 *  - Institution presence
 *
 * Exported for stressConfirmPass: resolveStress rolls against an EMPTY
 * institution list (institutions assemble two steps later), so the confirm
 * pass re-evaluates this with the real roster and uses the modified /
 * unmodified ratio to decide whether an emergent stressor survives.
 *
 * @param {string} stressType
 * @param {string} tier
 * @param {Object} config
 * @param {Array}  institutions
 * @returns {number} Adjusted probability (0–0.35)
 */
export const buildStressContext = (stressType, tier, config, institutions) => {
  let prob = STRESS_TYPE_MAP[stressType].probability;

  const threat    = config.monsterThreat    || 'frontier';
  const route     = config.tradeRouteAccess || 'road';
  const military  = config.priorityMilitary ?? 50;
  const economy   = config.priorityEconomy  ?? 50;
  const criminal  = config.priorityCriminal ?? 50;
  const religion  = config.priorityReligion ?? 50;
  const magic     = config.priorityMagic    ?? 50;

  // Resource presence flags
  const resources = config.nearbyResources || [];
  const hasGrain   = resources.some(r => r.includes('grain') || r.includes('fertile') ||
                                         r.includes('farm')  || r.includes('grazing'));
  const hasFish    = resources.some(r => r.includes('fish'));
  const hasTimber  = resources.some(r => r.includes('timber') || r.includes('forest'));

  // Institution presence flags (by keyword)
  const instNames   = (institutions || []).map(i => (i.name || '').toLowerCase());
  const hasWalls    = instNames.some(n => n.includes('wall')    || n.includes('citadel') || n.includes('palisade'));
  const hasMilitary = instNames.some(n => n.includes('garrison')|| n.includes('militia') || n.includes('watch'));
  const hasGranary  = instNames.some(n => n.includes('granary') || n.includes('granar'));
  const hasMarket   = instNames.some(n => n.includes('market')  || n.includes('fair'));
  const hasChurch   = instNames.some(n => n.includes('church')  || n.includes('temple') ||
                                          n.includes('cathedral')|| n.includes('monastery'));
  const hasHealer   = instNames.some(n => n.includes('healer')  || n.includes('physician') || n.includes('hospital'));
  const hasGuild    = instNames.some(n => n.includes('guild')   || n.includes('merchant'));
  const hasBank     = instNames.some(n => n.includes('bank')    || n.includes('moneylender'));

  // ── Siege / monster pressure ─────────────────────────────────────────────
  if (stressType === 'under_siege' || stressType === 'monster_pressure') {
    if (threat === 'plagued')   prob *= 2.5;
    if (threat === 'frontier')  prob *= 1.4;
    if (threat === 'heartland') prob *= 0.3;
    if (military < 30)          prob *= 1.5;
    if (hasWalls)               prob *= 0.6;
    if (hasMilitary)            prob *= 0.7;
  }

  // ── Famine ──────────────────────────────────────────────────────────────
  if (stressType === 'famine') {
    if (route === 'isolated')          prob *= 2.0;
    if (economy < 30)                  prob *= 1.5;
    if (isSmallTier(tier))             prob *= 1.3;
    if (hasGrain)                      prob *= 0.4;  // local grain reduces risk
    if (hasFish)                       prob *= 0.7;
    if (hasGranary)                    prob *= 0.5;
    if (hasMarket && route !== 'isolated') prob *= 0.6;
  }

  // ── Indebted ─────────────────────────────────────────────────────────────
  if (stressType === 'indebted') {
    if (economy < 35)    prob *= 2.0;
    if (route === 'isolated') prob *= 1.4;
    if (hasBank)         prob *= 1.4;  // banking infrastructure = debt access
    if (hasGuild)        prob *= 1.2;
    if (economy > 65)    prob *= 0.5;  // prosperous settlements rarely default
  }

  // ── Political instability cluster ────────────────────────────────────────
  if (['politically_fractured', 'recently_betrayed', 'succession_void'].includes(stressType)) {
    if (criminal > 60) prob *= 1.4;
    if (military > 65) prob *= 0.6;
    if (religion > 65) prob *= 0.7;
  }

  // ── Infiltrated ──────────────────────────────────────────────────────────
  if (stressType === 'infiltrated') {
    if (criminal > 55)             prob *= 1.5;
    if (getTradeRouteFeatures(tier)) prob *= 1.3; // larger settlements are richer targets
    if (hasGuild)                  prob *= 1.2;
    if (route === 'isolated')      prob *= 0.4;
  }

  // ── Occupied ─────────────────────────────────────────────────────────────
  if (stressType === 'occupied') {
    if (military < 25)            prob *= 1.6;
    if (hasWalls)                 prob *= 0.5;
    if (hasMilitary)              prob *= 0.6;
    if (route === 'isolated')     prob *= 0.5;
    if (threat === 'heartland')   prob *= 0.4;
  }

  // ── Plague ───────────────────────────────────────────────────────────────
  if (stressType === 'plague_onset') {
    if (religion > 60 && hasChurch) prob *= 0.5; // religious healing suppresses plague
    if (hasHealer)                  prob *= 0.6;
    if (route === 'port')           prob *= 1.6; // ports are disease vectors
    if (route === 'crossroads')     prob *= 1.3;
    if (route === 'isolated')       prob *= 0.4;
    if (magic > 60)                 prob *= 0.6;
  }

  // ── Succession void ──────────────────────────────────────────────────────
  if (stressType === 'succession_void') {
    if (military < 35 && criminal > 55) prob *= 1.5;
    if (getTradeRouteFeatures(tier))    prob *= 1.2;
    if (military > 65)                  prob *= 0.5;
  }

  // ── Monster pressure (timber boosts — forests hide monsters) ─────────────
  // Walls/military suppression is already applied in the shared under_siege/
  // monster_pressure block above; only the timber boost is unique here.
  if (stressType === 'monster_pressure') {
    if (hasTimber)   prob *= 1.3;
  }

  // ── generators-domain-1: probability coupling for the 5 newer stress types ─
  // Each new type is coupled to the settlement characteristics that actually
  // invite it (register: "slave revolt needs the economy that invites it —
  // seeded, bounded"). All deterministic multipliers (no rng), bounded by the
  // Math.min(prob, 0.35) ceiling below.
  const neighborRel = (config.neighborRelationship?.relationshipType || '').toLowerCase();
  const neighborHostile = neighborRel.includes('hostile') || neighborRel.includes('rival') || neighborRel.includes('cold_war');

  // Insurgency ↔ weak/illegitimate governance (a hollow garrison and a poor economy
  // erode the mandate; a strong garrison or high religious authority shore it up). A
  // criminal underworld tilts it only mildly — insurgency is a legitimacy failure,
  // not primarily an organised-crime one.
  if (stressType === 'insurgency') {
    if (military < 35)  prob *= 1.4;
    if (economy < 30)   prob *= 1.3;
    if (criminal > 60)  prob *= 1.2;
    if (military > 70)  prob *= 0.6;
    if (religion > 65)  prob *= 0.8;
  }

  // Mass migration ↔ trade-route connectivity (people flow through hubs; an
  // isolated settlement neither draws nor sheds population at scale).
  if (stressType === 'mass_migration') {
    if (route === 'crossroads')      prob *= 1.6;
    if (route === 'port')            prob *= 1.5;
    if (route === 'road')            prob *= 1.1;
    if (route === 'isolated')        prob *= 0.4;
    if (getTradeRouteFeatures(tier)) prob *= 1.3; // larger, more connected settlements
  }

  // Wartime ↔ a hostile neighbour and a frontier posture (a militarised heartland
  // town far from any enemy is rarely at war).
  if (stressType === 'wartime') {
    if (neighborHostile)        prob *= 1.8;
    if (threat === 'frontier')  prob *= 1.5;
    if (threat === 'plagued')   prob *= 1.3;
    if (threat === 'heartland') prob *= 0.4;
    if (military > 60)          prob *= 1.2;
  }

  // Religious conversion ↔ a religious settlement with a faith worth contesting;
  // a secular one has little to convert from or to.
  if (stressType === 'religious_conversion') {
    if (religion > 60)  prob *= 1.5;
    if (hasChurch)      prob *= 1.3;
    if (religion < 30)  prob *= 0.5;
    if (!hasChurch)     prob *= 0.7;
  }

  // Slave revolt ↔ the extractive economy that makes it possible: wealth built on
  // coerced labour (a strong economy served by a strong criminal/coercive apparatus).
  // Absent that economy there is little to revolt against, so it is suppressed. A
  // strong garrison contains it. (Base probability is already low, and it is
  // town-gated in STRESS_TYPE_MAP.requiresTier.) Economy is read from priorities —
  // not an institution-name match — to avoid a fuzzy label-join site.
  if (stressType === 'slave_revolt') {
    const extractive = economy > 55 && criminal > 50;
    if (extractive)     prob *= 2.0;
    else                prob *= 0.4;
    if (military > 65)  prob *= 0.6;
  }

  return Math.min(prob, 0.35);
};

// ─── Stress priority ordering ─────────────────────────────────────────────────

// Higher weight = stress is more narratively severe and gets priority in multi-stress resolution.
export const STRESS_SEVERITY_WEIGHT = {
  under_siege:         10,
  famine:               9,
  plague_onset:         8,
  occupied:             7,
  politically_fractured: 6,
  recently_betrayed:    6,
  succession_void:      5,
  indebted:             5,
  infiltrated:          4,
  monster_pressure:     4,
  wartime:              8,
  slave_revolt:         7,
  insurgency:           6,
  religious_conversion: 5,
  mass_migration:       4,
};

// ─── generateStress ──────────────────────────────────────────────────────────

/**
 * Generate the stress condition(s) for a settlement.
 *
 * Three modes:
 *  1. Forced single: config.stressType is set and selectedStressesRandom !== false
 *  2. Forced pool:   config.selectedStressesRandom === false → use selectedStresses list
 *  3. Probabilistic: roll against each stress type's adjusted probability
 *
 * Returns null, a single stress object, or an array of stress objects.
 *
 * @param {{ tier: string, institutions: Array, name: string }} settlement
 * @param {Object} config
 */
export const generateStress = (settlement, config = {}) => {
  const { tier, institutions = [], name } = settlement;

  // ── Mode 0: stressTypes array (from UI/config) ─────────────────────────
  if (config.stressTypes?.length && config.selectedStressesRandom !== false) {
    const entries = config.stressTypes
      .filter(t => STRESS_TYPE_MAP[t])
      .map(t => buildStressEntry(name, t, STRESS_TYPE_MAP[t]));
    if (entries.length === 1) return entries[0];
    if (entries.length > 1) return entries;
  }

  // ── Mode 1: Forced single stress type ─────────────────────────────────
  if (config.stressType && STRESS_TYPE_MAP[config.stressType] &&
      config.selectedStressesRandom !== false) {
    return buildStressEntry(name, config.stressType, STRESS_TYPE_MAP[config.stressType]);
  }

  // ── Mode 2: User-selected pool (checkbox list) ─────────────────────────
  if (config.selectedStressesRandom === false) {
    const selected = config.selectedStresses || [];
    if (selected.length === 0) return null;

    const entries = selected
      .filter(type => STRESS_TYPE_MAP[type])
      .map(type => buildStressEntry(name, type, STRESS_TYPE_MAP[type]));

    if (entries.length === 0) return null;
    return entries.length === 1 ? entries[0] : entries;
  }

  // ── Mode 3: Probabilistic roll ─────────────────────────────────────────
  // Roll ALL stress types independently first (random order prevents severity-sort bias).
  // Then sort fired stresses by severity so the most significant becomes primary.
  const allStressTypes = Object.keys(STRESS_TYPE_MAP);
  // Shuffle to eliminate ordering bias
  for (let i = allStressTypes.length - 1; i > 0; i--) {
    const j = Math.floor(_rng() * (i + 1));
    [allStressTypes[i], allStressTypes[j]] = [allStressTypes[j], allStressTypes[i]];
  }

  const fired = [];

  for (const type of allStressTypes) {
    const data = STRESS_TYPE_MAP[type];

    // Tier gate: some stresses only apply to larger settlements
    if (data.requiresTier && !tierAtLeast(tier, data.requiresTier)) continue;

    const adjustedProb = buildStressContext(type, tier, config, institutions);
    if (_rng() < adjustedProb) fired.push(type);
  }

  // Cap: primary stress + rare secondary. Sort by severity so most significant is primary.
  const sorted = fired.sort(
    (a, b) => (STRESS_SEVERITY_WEIGHT[b] || 0) - (STRESS_SEVERITY_WEIGHT[a] || 0)
  );
  // Second stress: only fires ~10% of the time when a primary exists
  const active = sorted.length === 0 ? []
               : sorted.length === 1 ? sorted
               : _rng() < 0.10 ? sorted.slice(0, 2) : sorted.slice(0, 1);

  if (active.length === 0) return null;
  if (active.length === 1) return buildStressEntry(name, active[0], STRESS_TYPE_MAP[active[0]]);
  return active.map(type => buildStressEntry(name, type, STRESS_TYPE_MAP[type]));
};
