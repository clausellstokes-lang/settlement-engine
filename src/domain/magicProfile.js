/**
 * domain/magicProfile.js - Magic as a structured system.
 *
 * Tier 4.8 of the roadmap. Until now magic existed as a single
 * config flag (`config.magicLevel`: low / moderate / high / pervasive)
 * plus a Phase 17 substrate variable (`magical_stability`). The
 * roadmap calls for 10 facets covering availability, legality,
 * institutional control, cost, risk, religious acceptance, and four
 * role facets (economic / military / medical / infrastructure).
 *
 *   deriveMagicProfile(settlement) -> {
 *     availability, legality, institutionalControl,
 *     cost, risk, religiousAcceptance,
 *     roles: { economic, military, medical, infrastructure },
 *     contributors[],
 *   }
 *
 * Pure read-only. Composes Phase 9 factions, Phase 17 substrate,
 * Phase 21 magical capacity. No mutation.
 */

import { deriveAllFactionProfiles } from './factionProfile.js';
import { deriveCausalState } from './causalState.js';
import { deriveCapacityProfile } from './capacityModel.js';

const MAGIC_LEVEL_VALUES = Object.freeze({
  rare:      { availability: 'rare',       baseRisk: 'low' },
  low:       { availability: 'limited',    baseRisk: 'low' },
  moderate:  { availability: 'moderate',   baseRisk: 'moderate' },
  common:    { availability: 'common',     baseRisk: 'moderate' },
  high:      { availability: 'broad',      baseRisk: 'elevated' },
  pervasive: { availability: 'pervasive',  baseRisk: 'high' },
});

const AVAILABILITY_BANDS = Object.freeze([
  'rare', 'limited', 'moderate', 'common', 'broad', 'pervasive',
]);

const LEGALITY_BANDS = Object.freeze([
  'forbidden', 'restricted', 'regulated', 'tolerated', 'celebrated',
]);

const RISK_BANDS = Object.freeze([
  'low', 'moderate', 'elevated', 'high', 'extreme',
]);

const ROLE_BANDS = Object.freeze([
  'absent', 'occasional', 'common', 'integral',
]);

const ARCANE_PATTERN = /(tower|college|conclave|circle|enclave|atheneum|library.*arcane|sanctum)/i;
const HEALING_PATTERN = /(temple|chapel|infirmary|healer|hospice|herbalist|apothecary|shrine)/i;

function institutionsByPattern(s, pattern) {
  const inst = Array.isArray(s?.institutions) ? s.institutions : [];
  return inst.filter(i => pattern.test(String(i?.name || '')));
}

// ── Derivers ─────────────────────────────────────────────────────────────

function deriveAvailability(settlement, contributors) {
  const magic = settlement.config?.magicLevel || 'low';
  const tmpl = MAGIC_LEVEL_VALUES[magic] || MAGIC_LEVEL_VALUES.low;
  contributors.push({ source: 'config.magicLevel', effect: 'baseline', reason: `Magic level: ${magic}.` });

  // Arcane institutions raise availability one step
  const arcane = institutionsByPattern(settlement, ARCANE_PATTERN);
  if (arcane.length >= 1) {
    contributors.push({
      source: 'institutions',
      effect: 'arcane_present',
      reason: `${arcane.length} arcane institution(s) extend public availability.`,
    });
    return upBand(AVAILABILITY_BANDS, tmpl.availability, 1);
  }
  return tmpl.availability;
}

function deriveLegality(settlement, profiles, contributors) {
  // Religious faction with strong power tends toward restricted/regulated.
  const religious = profiles.find(p => p.archetype === 'religious');
  const arcane = profiles.find(p => p.archetype === 'arcane');

  // Default: regulated if magic is moderate+, tolerated if low.
  const magic = settlement.config?.magicLevel || 'low';
  let legality = (magic === 'high' || magic === 'pervasive') ? 'tolerated' :
                 (magic === 'moderate' || magic === 'common') ? 'regulated' :
                 'restricted';

  if (religious && religious.power >= 40) {
    legality = downBand(LEGALITY_BANDS, legality, 1);
    contributors.push({
      source: religious.id,
      effect: 'restricts',
      reason: `${religious.name} (power ${religious.power}) restricts arcane practice.`,
    });
  }
  if (arcane && arcane.power >= 35) {
    legality = upBand(LEGALITY_BANDS, legality, 1);
    contributors.push({
      source: arcane.id,
      effect: 'normalizes',
      reason: `${arcane.name} (power ${arcane.power}) normalizes arcane practice.`,
    });
  }
  return legality;
}

function deriveInstitutionalControl(settlement, profiles, contributors) {
  const arcane = profiles.find(p => p.archetype === 'arcane');
  const arcaneInst = institutionsByPattern(settlement, ARCANE_PATTERN);
  if (arcane && arcane.power >= 30 && arcaneInst.length >= 1) {
    contributors.push({
      source: arcane.id,
      effect: 'controls',
      reason: `${arcane.name} controls arcane training and practice through institutional presence.`,
    });
    return 'guild_controlled';
  }
  if (arcaneInst.length >= 1) {
    contributors.push({
      source: 'institutions',
      effect: 'institutional',
      reason: `Arcane institution(s) without dominant faction presence - fragmented control.`,
    });
    return 'fragmented';
  }
  contributors.push({
    source: 'config',
    effect: 'unregulated',
    reason: 'No arcane institutions - practice is informal or absent.',
  });
  return 'unregulated';
}

function deriveCost(settlement, contributors) {
  const magic = settlement.config?.magicLevel || 'low';
  if (magic === 'pervasive')                    { contributors.push({ source: 'config.magicLevel', effect: 'cheap', reason: 'Pervasive magic - services cheap.' }); return 'cheap'; }
  if (magic === 'high' || magic === 'common')   { contributors.push({ source: 'config.magicLevel', effect: 'moderate', reason: 'Magic widespread - services priced moderately.' }); return 'moderate'; }
  if (magic === 'moderate')                     { contributors.push({ source: 'config.magicLevel', effect: 'costly', reason: 'Moderate magic - services costly.' }); return 'costly'; }
  contributors.push({ source: 'config.magicLevel', effect: 'extortionate', reason: 'Rare magic - services extortionate.' });
  return 'extortionate';
}

function deriveRisk(settlement, causal, contributors) {
  const magic = settlement.config?.magicLevel || 'low';
  const base = MAGIC_LEVEL_VALUES[magic]?.baseRisk || 'low';
  contributors.push({ source: 'config.magicLevel', effect: 'baseline', reason: `Baseline risk for ${magic} magic: ${base}.` });

  const stabBand = causal.bands?.magical_stability;
  if (stabBand === 'strained' || stabBand === 'critical' || stabBand === 'collapsed') {
    contributors.push({
      source: 'var.magical_stability',
      effect: 'destabilized',
      reason: `Magical stability is ${stabBand} - risks rise.`,
    });
    return upBand(RISK_BANDS, base, 1);
  }
  return base;
}

function deriveReligiousAcceptance(settlement, profiles, contributors) {
  const religious = profiles.find(p => p.archetype === 'religious');
  const arcane = profiles.find(p => p.archetype === 'arcane');
  if (!religious) {
    contributors.push({ source: 'powerStructure', effect: 'no_religious', reason: 'No religious faction - acceptance defaults to indifferent.' });
    return 'indifferent';
  }
  const relPower = religious.power || 0;
  const arcPower = arcane?.power || 0;
  if (relPower > arcPower + 20) {
    contributors.push({ source: religious.id, effect: 'hostile', reason: `${religious.name} dominates arcane influence - opposition is open.` });
    return 'hostile';
  }
  if (arcPower > relPower + 20) {
    contributors.push({ source: arcane?.id || 'powerStructure', effect: 'syncretic', reason: 'Arcane power dwarfs religious - magic woven into ritual.' });
    return 'syncretic';
  }
  contributors.push({ source: religious.id, effect: 'wary', reason: 'Religious and arcane powers in rough balance - wary coexistence.' });
  return 'wary';
}

function deriveRoles(settlement, profiles, capacity, contributors) {
  const magic = settlement.config?.magicLevel || 'low';
  const arcanePower = profiles.find(p => p.archetype === 'arcane')?.power || 0;
  const arcaneInstCount = institutionsByPattern(settlement, ARCANE_PATTERN).length;
  const healingInstCount = institutionsByPattern(settlement, HEALING_PATTERN).length;

  function role(name, present, integral) {
    if (integral) {
      contributors.push({ source: 'magicProfile', effect: `${name}_integral`, reason: `${name} role of magic is integral to settlement function.` });
      return 'integral';
    }
    if (present) {
      contributors.push({ source: 'magicProfile', effect: `${name}_common`, reason: `${name} role of magic is regular but not foundational.` });
      return 'common';
    }
    if (magic !== 'rare' && magic !== 'low') {
      return 'occasional';
    }
    return 'absent';
  }

  const economic     = role('economic',     arcanePower >= 30 || arcaneInstCount >= 1, magic === 'pervasive');
  const military     = role('military',     arcanePower >= 35, magic === 'pervasive' && arcanePower >= 50);
  const medical      = role('medical',      healingInstCount >= 1 && magic !== 'rare' && magic !== 'low', healingInstCount >= 2 && (magic === 'high' || magic === 'pervasive'));
  const infrastructure = role('infrastructure', arcaneInstCount >= 1 && (magic === 'high' || magic === 'pervasive'), magic === 'pervasive' && arcaneInstCount >= 1);

  return { economic, military, medical, infrastructure };
}

// ── Band step helpers ───────────────────────────────────────────────────

function upBand(bands, current, steps) {
  const idx = bands.indexOf(current);
  if (idx === -1) return current;
  return bands[Math.min(bands.length - 1, idx + steps)];
}

function downBand(bands, current, steps) {
  const idx = bands.indexOf(current);
  if (idx === -1) return current;
  return bands[Math.max(0, idx - steps)];
}

// ── Composer ─────────────────────────────────────────────────────────────

/**
 * Derive the structured MagicProfile for a settlement.
 *
 * @param {Object} settlement
 * @returns {Object} MagicProfile
 */
export function deriveMagicProfile(settlement) {
  if (!settlement) return null;
  const profiles = deriveAllFactionProfiles(settlement);
  const causal = deriveCausalState(settlement);
  const capacity = deriveCapacityProfile('magical', settlement);
  const contributors = [];

  return {
    availability:         deriveAvailability(settlement, contributors),
    legality:             deriveLegality(settlement, profiles, contributors),
    institutionalControl: deriveInstitutionalControl(settlement, profiles, contributors),
    cost:                 deriveCost(settlement, contributors),
    risk:                 deriveRisk(settlement, causal, contributors),
    religiousAcceptance:  deriveReligiousAcceptance(settlement, profiles, contributors),
    roles:                deriveRoles(settlement, profiles, capacity, contributors),
    contributors,
  };
}

// ── Diagnostic helpers ───────────────────────────────────────────────────

export function magicAvailabilityBands() { return [...AVAILABILITY_BANDS]; }
export function magicLegalityBands()     { return [...LEGALITY_BANDS]; }
export function magicRiskBands()         { return [...RISK_BANDS]; }
export function magicRoleBands()         { return [...ROLE_BANDS]; }

/** Human-readable summary. */
export function summarizeMagic(settlement) {
  const m = deriveMagicProfile(settlement);
  if (!m) return [];
  return [
    `Availability: ${m.availability}.`,
    `Legality: ${m.legality}.`,
    `Institutional control: ${m.institutionalControl}.`,
    `Cost: ${m.cost}. Risk: ${m.risk}.`,
    `Religious acceptance: ${m.religiousAcceptance}.`,
    `Roles - economic: ${m.roles.economic}; military: ${m.roles.military}; medical: ${m.roles.medical}; infrastructure: ${m.roles.infrastructure}.`,
  ];
}
