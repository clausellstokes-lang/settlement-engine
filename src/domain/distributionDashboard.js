/**
 * domain/distributionDashboard.js - Aggregate stats over many settlements.
 *
 * Tier 3.10 of the roadmap. Generation is stochastic; the DEV dashboard
 * shows aggregate distributions across N settlements to make tuning
 * sane: institution frequency per tier, prosperity bands, faction
 * archetype frequencies, food-security distribution, crisis frequencies.
 *
 *   aggregateDistribution(settlements) -> {
 *     n,
 *     institutionFrequency: { [category]: count },
 *     prosperityBands:      { [band]: count },
 *     factionArchetypes:    { [archetype]: count },
 *     foodSecurity:         { [band]: count },
 *     substrateBandFloors:  { [variable]: { surplus, adequate, strained, critical, collapsed } },
 *     contradictionTypes:   { [type]: count },
 *     averages:             { institutions, factions, npcs, hooks, chains }
 *   }
 *
 * Pure read-only.
 */

import { deriveAllFactionProfiles } from './factionProfile.js';
import { deriveCausalState, SYSTEM_VARIABLES, CAUSAL_BANDS } from './causalState.js';
import { detectContradictions } from './contradictions.js';

function blank() {
  return {
    n: 0,
    institutionFrequency: {},
    prosperityBands: {},
    factionArchetypes: {},
    foodSecurity: {},
    substrateBandFloors: {},
    contradictionTypes: {},
    averages: {
      institutions: 0,
      factions: 0,
      npcs: 0,
      hooks: 0,
      chains: 0,
    },
  };
}

function incr(obj, key) {
  obj[key] = (obj[key] || 0) + 1;
}

function institutionCategory(name) {
  const n = String(name || '').toLowerCase();
  if (/granary|mill|silo|storage|bakery|farm/.test(n))           return 'food';
  if (/temple|cathedral|shrine|monastery|chapel/.test(n))        return 'religious';
  if (/watch|garrison|barracks|militia|guard/.test(n))           return 'military';
  if (/market|bazaar|exchange|trade hall|warehouse/.test(n))     return 'trade';
  if (/forge|smithy|workshop|guild/.test(n))                     return 'craft';
  if (/court|hall|council|chancery/.test(n))                     return 'civic';
  if (/inn|tavern|hospitality/.test(n))                          return 'hospitality';
  if (/tower|college|conclave|sanctum/.test(n))                  return 'arcane';
  if (/apothecary|healer|hospice|infirmary/.test(n))             return 'healing';
  return 'other';
}

/**
 * Aggregate distribution stats across many settlements. Pure.
 *
 * @param {Object[]} settlements
 * @returns {Object}
 */
export function aggregateDistribution(settlements) {
  if (!Array.isArray(settlements) || settlements.length === 0) {
    return blank();
  }

  const out = blank();
  out.n = settlements.length;

  // Initialize substrate floor tracking
  for (const v of SYSTEM_VARIABLES) {
    out.substrateBandFloors[v] = {};
    for (const b of CAUSAL_BANDS) out.substrateBandFloors[v][b] = 0;
  }

  let instSum = 0, factSum = 0, npcSum = 0, hookSum = 0, chainSum = 0;

  for (const s of settlements) {
    if (!s) continue;

    // Institution category counts
    const insts = Array.isArray(s.institutions) ? s.institutions : [];
    instSum += insts.length;
    for (const i of insts) {
      incr(out.institutionFrequency, institutionCategory(i?.name));
    }

    // Prosperity band
    const prosp = s.economicState?.prosperity?.tier
               || s.economicState?.prosperity
               || 'unspecified';
    incr(out.prosperityBands, String(prosp));

    // Faction archetypes
    const profs = deriveAllFactionProfiles(s);
    factSum += profs.length;
    for (const p of profs) incr(out.factionArchetypes, p.archetype || 'unknown');

    // Substrate bands
    const causal = deriveCausalState(s);
    for (const v of SYSTEM_VARIABLES) {
      const band = causal.bands[v];
      if (band && out.substrateBandFloors[v][band] !== undefined) {
        out.substrateBandFloors[v][band] += 1;
      }
    }

    // Food security legacy band
    const fs = s.economicState?.foodSecurity;
    if (fs?.band) incr(out.foodSecurity, fs.band);

    // Contradiction types
    for (const c of detectContradictions(s)) {
      incr(out.contradictionTypes, c.type);
    }

    // Aggregate counts for averages
    npcSum += Array.isArray(s.npcs) ? s.npcs.length : 0;
    hookSum += Array.isArray(s.plotHooks) ? s.plotHooks.length : 0;
    chainSum += Array.isArray(s.economicState?.activeChains) ? s.economicState.activeChains.length : 0;
  }

  out.averages.institutions = +(instSum / out.n).toFixed(2);
  out.averages.factions     = +(factSum / out.n).toFixed(2);
  out.averages.npcs         = +(npcSum / out.n).toFixed(2);
  out.averages.hooks        = +(hookSum / out.n).toFixed(2);
  out.averages.chains       = +(chainSum / out.n).toFixed(2);

  return out;
}

/**
 * Convert an aggregate to a flat array of `{label, value}` rows
 * suitable for table rendering.
 */
export function distributionRows(aggregate, section) {
  if (!aggregate || !aggregate[section]) return [];
  const map = aggregate[section];
  if (typeof map !== 'object') return [];
  return Object.entries(map)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => (b.value || 0) - (a.value || 0));
}

/** Catalog of available sections for the dashboard. */
export function distributionSections() {
  return [
    'institutionFrequency',
    'prosperityBands',
    'factionArchetypes',
    'foodSecurity',
    'contradictionTypes',
  ];
}
