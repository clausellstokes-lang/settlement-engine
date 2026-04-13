/**
 * stressGenerator.js
 * Stress condition selection and application.
 *
 * Generates the stress object(s) for a settlement — either from forced user
 * selection, or probabilistically based on settlement characteristics.
 */

import { random as _rng } from './rngContext.js';
import {tierAtLeast, getTradeRouteFeatures} from './helpers.js';

import {STRESS_TYPE_MAP} from '../data/stressTypes.js';

// ─── Tier helpers ─────────────────────────────────────────────────────────────

const SMALL_TIERS = ['thorp', 'hamlet', 'village'];
const isSmallTier = (tier) => SMALL_TIERS.includes(tier);

// ─── buildStressEntry ─────────────────────────────────────────────────────────

/**
 * Construct a full stress entry object from a stress type key and its map data.
 *
 * @param {string} settlementName
 * @param {string} stressType    - key from STRESS_TYPE_MAP
 * @param {Object} stressData    - STRESS_TYPE_MAP[stressType]
 */
const buildStressEntry = (settlementName, stressType, stressData) => ({
  type:          stressType,
  label:         stressData.label,
  icon:          stressData.icon,
  colour:        stressData.colour,
  summary:       stressData.summary({ name: settlementName }),
  crisisHook:    stressData.crisisHook,
  viabilityNote: stressData.viabilityNote,
  historyColour: stressData.historyColour,
});

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
 * @param {string} stressType
 * @param {string} tier
 * @param {Object} config
 * @param {Array}  institutions
 * @returns {number} Adjusted probability (0–0.35)
 */
const buildStressContext = (stressType, tier, config, institutions) => {
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
  if (stressType === 'monster_pressure') {
    if (hasTimber)   prob *= 1.3;
    if (hasWalls)    prob *= 0.6;
    if (hasMilitary) prob *= 0.7;
  }

  return Math.min(prob, 0.35);
};

// ─── Stress priority ordering ─────────────────────────────────────────────────

// Higher weight = stress is more narratively severe and gets priority in multi-stress resolution.
const STRESS_SEVERITY_WEIGHT = {
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
