/**
 * domain/magicProfile.js — Magic as a structured system.
 *
 * Until now magic existed as a single
 * config flag (`config.magicLevel`: low / moderate / high / pervasive)
 * plus a substrate variable (`magical_stability`). The
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
 * Pure read-only. Composes factions and substrate.
 * No mutation.
 */

import { deriveAllFactionProfiles } from './factionProfile.js';
import { deriveCausalState } from './causalState.js';
import { ARCANE_INSTITUTION_PATTERN as ARCANE_PATTERN, magicLedger } from './magicLedger.js';
import { HEALING_INSTITUTION_PATTERN as HEALING_PATTERN } from './healingLedger.js';

const MAGIC_LEVEL_VALUES = Object.freeze({
  // Canonical bands the GENERATOR emits (getMagicLevel: 0=none, <=25 low, <=65 medium, else high).
  none:      { availability: 'rare',       baseRisk: 'low' },
  medium:    { availability: 'moderate',   baseRisk: 'moderate' },
  // Legacy / manual vocabulary (6-tier) — preserved so old saves + manual configs are unchanged.
  rare:      { availability: 'rare',       baseRisk: 'low' },
  low:       { availability: 'limited',    baseRisk: 'low' },
  moderate:  { availability: 'moderate',   baseRisk: 'moderate' },
  common:    { availability: 'common',     baseRisk: 'moderate' },
  high:      { availability: 'broad',      baseRisk: 'elevated' },
  pervasive: { availability: 'pervasive',  baseRisk: 'high' },
});

// 'absent' is the dead-magic floor (config.magicExists === false): magic does not
// function in the world, so there is nothing to band. Only the dead-magic short
// circuit assigns it — up/down band steps never reach it.
const AVAILABILITY_BANDS = Object.freeze([
  'absent', 'rare', 'limited', 'moderate', 'common', 'broad', 'pervasive',
]);

const LEGALITY_BANDS = Object.freeze([
  'absent', 'forbidden', 'restricted', 'regulated', 'tolerated', 'celebrated',
]);

const RISK_BANDS = Object.freeze([
  'absent', 'low', 'moderate', 'elevated', 'high', 'extreme',
]);

const ROLE_BANDS = Object.freeze([
  'absent', 'occasional', 'common', 'integral',
]);

// ARCANE_PATTERN + HEALING_PATTERN now imported (single canonical matchers).

/**
 * @param {import('./settlement.schema.js').SimSettlement} s
 * @param {any} pattern
 * @returns {any}
 */
function institutionsByPattern(s, pattern) {
  const inst = Array.isArray(s?.institutions) ? s.institutions : [];
  return inst.filter((/** @type {any} */ i) => pattern.test(String(i?.name || '')));
}

// ── Dominant-deity ⇄ magic regulation ───────────────────────────────────────
// A theocracy regulates magic. When a settlement carries an embedded major-deity
// snapshot (the same config.primaryDeitySnapshot the religion layer activates on),
// a dominant orthodox god shifts magic LEGALITY tighter and RELIGIOUS ACCEPTANCE more
// hostile — a WARLIKE or EVIL major god harder still. Absent deity ⇒ no term ⇒ the
// magic profile is byte-identical to legacy (a deity-free world reads NONE of this).
// Pure: reads the self-contained snapshot, never customContent. Bounded to one band
// step so the deity nudges, never overrides, the faction-derived baseline.

/** The embedded major-deity snapshot, or null. ONLY a MAJOR god regulates a realm's
 *  magic — a minor god or fringe cult lacks the institutional reach.
 *  @param {import('./settlement.schema.js').SimSettlement} settlement
 *  @returns {any} */
function dominantDeityOf(settlement) {
  const deity = settlement?.config?.primaryDeitySnapshot;
  if (!deity || deity.rankAxis !== 'major') return null;
  return deity;
}

/** True when the major deity is the kind that REGULATES magic hard — a warlike or
 *  evil orthodoxy polices arcane power as a rival authority. A good/neutral peacelike
 *  major god still tightens legality one notch (the theocracy term) but is not hostile.
 *  @param {any} deity
 *  @returns {boolean} */
export function deityIsRegulatory(deity) {
  return deity.temperamentAxis === 'warlike' || deity.alignmentAxis === 'evil';
}

// The number of band-steps a MAJOR deity tightens magic legality by: one for any
// major god (the theocracy term), a second for a WARLIKE/EVIL orthodoxy that
// polices arcane power as a rival authority. Exported as the single source the
// shared deityEffects coupling reads (proven equal to deriveLegality's inline use).
export const DEITY_MAGIC_LEGALITY_STEPS = Object.freeze({ regulatory: 2, major: 1 });

// ── Derivers ─────────────────────────────────────────────────────────────

/**
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 * @param {any} contributors
 */
function deriveAvailability(settlement, contributors) {
  const magic = settlement.config?.magicLevel || 'low';
  const tmpl = /** @type {any} */ (MAGIC_LEVEL_VALUES)[magic] || MAGIC_LEVEL_VALUES.low;
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

/**
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 * @param {any} profiles
 * @param {any} contributors
 */
function deriveLegality(settlement, profiles, contributors) {
  // Religious faction with strong power tends toward restricted/regulated.
  const religious = profiles.find((/** @type {any} */ p) => p.archetype === 'religious');
  const arcane = profiles.find((/** @type {any} */ p) => p.archetype === 'arcane');

  // Default: regulated if magic is moderate+, tolerated if low.
  const magic = settlement.config?.magicLevel || 'low';
  let legality = (magic === 'high' || magic === 'pervasive') ? 'tolerated' :
                 (magic === 'moderate' || magic === 'common' || magic === 'medium') ? 'regulated' :
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

  // A dominant major deity regulates magic (a theocracy polices arcane power).
  // One band tighter for any major god; a WARLIKE/EVIL orthodoxy tightens a second
  // step (it treats free magic as a rival authority). Gated on the embedded deity
  // snapshot ⇒ a deity-free settlement is byte-identical.
  const deity = dominantDeityOf(settlement);
  if (deity) {
    const steps = deityIsRegulatory(deity) ? DEITY_MAGIC_LEGALITY_STEPS.regulatory : DEITY_MAGIC_LEGALITY_STEPS.major;
    legality = downBand(LEGALITY_BANDS, legality, steps);
    contributors.push({
      source: deity._deityRef || 'primaryDeity',
      effect: 'theocratic_regulation',
      reason: `${deity.name || 'The patron deity'} (major${deityIsRegulatory(deity) ? `, ${deity.temperamentAxis === 'warlike' ? 'warlike' : 'evil'}` : ''}) regulates arcane practice as a rival authority.`,
    });
  }
  return legality;
}

/**
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 * @param {any} profiles
 * @param {any} contributors
 */
function deriveInstitutionalControl(settlement, profiles, contributors) {
  const arcane = profiles.find((/** @type {any} */ p) => p.archetype === 'arcane');
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
      reason: `Arcane institution(s) without dominant faction presence. Control is fragmented.`,
    });
    return 'fragmented';
  }
  contributors.push({
    source: 'config',
    effect: 'unregulated',
    reason: 'No arcane institutions. Practice is informal or absent.',
  });
  return 'unregulated';
}

/**
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 * @param {any} contributors
 */
function deriveCost(settlement, contributors) {
  const magic = settlement.config?.magicLevel || 'low';
  if (magic === 'pervasive')                    { contributors.push({ source: 'config.magicLevel', effect: 'cheap', reason: 'Pervasive magic. Services cheap.' }); return 'cheap'; }
  if (magic === 'high' || magic === 'common')   { contributors.push({ source: 'config.magicLevel', effect: 'moderate', reason: 'Magic widespread. Services priced moderately.' }); return 'moderate'; }
  if (magic === 'moderate' || magic === 'medium') { contributors.push({ source: 'config.magicLevel', effect: 'costly', reason: 'Moderate magic. Services costly.' }); return 'costly'; }
  contributors.push({ source: 'config.magicLevel', effect: 'extortionate', reason: 'Rare magic. Services extortionate.' });
  return 'extortionate';
}

/**
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 * @param {any} causal
 * @param {any} contributors
 */
function deriveRisk(settlement, causal, contributors) {
  const magic = settlement.config?.magicLevel || 'low';
  const base = /** @type {any} */ (MAGIC_LEVEL_VALUES)[magic]?.baseRisk || 'low';
  contributors.push({ source: 'config.magicLevel', effect: 'baseline', reason: `Baseline risk for ${magic} magic: ${base}.` });

  const stabBand = causal.bands?.magical_stability;
  if (stabBand === 'strained' || stabBand === 'critical' || stabBand === 'collapsed') {
    contributors.push({
      source: 'var.magical_stability',
      effect: 'destabilized',
      reason: `Magical stability is ${stabBand}. Risks rise.`,
    });
    return upBand(RISK_BANDS, base, 1);
  }
  return base;
}

/**
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 * @param {any} profiles
 * @param {any} contributors
 */
function deriveReligiousAcceptance(settlement, profiles, contributors) {
  const religious = profiles.find((/** @type {any} */ p) => p.archetype === 'religious');
  const arcane = profiles.find((/** @type {any} */ p) => p.archetype === 'arcane');
  const deity = dominantDeityOf(settlement);

  // A dominant WARLIKE/EVIL major deity forces OPEN hostility toward magic
  // regardless of the faction balance (the orthodoxy treats arcane power as a rival
  // it must suppress). This OVERRIDES the faction-derived band. A non-regulatory
  // major god nudges acceptance one notch warier below. Gated on the deity snapshot.
  if (deity && deityIsRegulatory(deity)) {
    contributors.push({
      source: deity._deityRef || 'primaryDeity',
      effect: 'hostile',
      reason: `${deity.name || 'The patron deity'} (major, ${deity.temperamentAxis === 'warlike' ? 'warlike' : 'evil'}) brooks no rival to its authority. Magic is openly opposed.`,
    });
    return 'hostile';
  }

  if (!religious) {
    // A benevolent major deity with no formal religious faction still makes the realm
    // wary of magic (the orthodoxy exists in the snapshot even without a power bloc).
    if (deity) {
      contributors.push({ source: deity._deityRef || 'primaryDeity', effect: 'wary', reason: `${deity.name || 'The patron deity'} (major) lends the realm a wary orthodoxy toward arcane practice.` });
      return 'wary';
    }
    contributors.push({ source: 'powerStructure', effect: 'no_religious', reason: 'No religious faction. Acceptance defaults to indifferent.' });
    return 'indifferent';
  }
  const relPower = religious.power || 0;
  const arcPower = arcane?.power || 0;
  if (relPower > arcPower + 20) {
    contributors.push({ source: religious.id, effect: 'hostile', reason: `${religious.name} dominates arcane influence. Opposition is open.` });
    return 'hostile';
  }
  if (arcPower > relPower + 20) {
    // A benevolent major deity tempers a syncretic balance into wary coexistence.
    if (deity) {
      contributors.push({ source: deity._deityRef || 'primaryDeity', effect: 'wary', reason: `${deity.name || 'The patron deity'} (major) keeps the realm wary even where arcane power runs strong.` });
      return 'wary';
    }
    contributors.push({ source: arcane?.id || 'powerStructure', effect: 'syncretic', reason: 'Arcane power dwarfs religious. Magic woven into ritual.' });
    return 'syncretic';
  }
  contributors.push({ source: religious.id, effect: 'wary', reason: 'Religious and arcane powers in rough balance. Wary coexistence.' });
  return 'wary';
}

/**
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 * @param {any} profiles
 * @param {any} contributors
 */
function deriveRoles(settlement, profiles, contributors) {
  const magic = settlement.config?.magicLevel || 'low';
  // The 'integral' role tier keyed on magic === 'pervasive', a band the GENERATOR
  // never emits (getMagicLevel tops out at 'high'), so every procedurally-generated
  // settlement's economic/military/infrastructure roles capped at 'common'. Route the
  // top-band check through magicLedger's canonical band — which folds the generator's
  // 'high' AND the legacy/manual 'pervasive' into the same top tier — the same fix
  // capacityModel.deriveMagical already uses. 'high'-magic generated content can now
  // reach 'integral'; legacy 'pervasive' configs are unchanged (both canon to 'high').
  const topBand = magicLedger(settlement).magicLevel === 'high';
  const arcanePower = profiles.find((/** @type {any} */ p) => p.archetype === 'arcane')?.power || 0;
  const arcaneInstCount = institutionsByPattern(settlement, ARCANE_PATTERN).length;
  const healingInstCount = institutionsByPattern(settlement, HEALING_PATTERN).length;

  /**
   * @param {any} name
   * @param {any} present
   * @param {any} integral
   */
  function role(name, present, integral) {
    if (integral) {
      contributors.push({ source: 'magicProfile', effect: `${name}_integral`, reason: `${name} role of magic is integral to settlement function.` });
      return 'integral';
    }
    if (present) {
      contributors.push({ source: 'magicProfile', effect: `${name}_common`, reason: `${name} role of magic is regular but not foundational.` });
      return 'common';
    }
    if (magic !== 'rare' && magic !== 'low' && magic !== 'none') {
      return 'occasional';
    }
    return 'absent';
  }

  const economic     = role('economic',     arcanePower >= 30 || arcaneInstCount >= 1, topBand);
  const military     = role('military',     arcanePower >= 35, topBand && arcanePower >= 50);
  const medical      = role('medical',      healingInstCount >= 1 && magic !== 'rare' && magic !== 'low', healingInstCount >= 2 && topBand);
  const infrastructure = role('infrastructure', arcaneInstCount >= 1 && topBand, topBand && arcaneInstCount >= 1);

  return { economic, military, medical, infrastructure };
}

// ── Band step helpers ───────────────────────────────────────────────────

/**
 * @param {any} bands
 * @param {any} current
 * @param {any} steps
 */
function upBand(bands, current, steps) {
  const idx = bands.indexOf(current);
  if (idx === -1) return current;
  return bands[Math.min(bands.length - 1, idx + steps)];
}

/**
 * @param {any} bands
 * @param {any} current
 * @param {any} steps
 */
function downBand(bands, current, steps) {
  const idx = bands.indexOf(current);
  if (idx === -1) return current;
  return bands[Math.max(0, idx - steps)];
}

// ── Composer ─────────────────────────────────────────────────────────────

/**
 * Derive the structured MagicProfile for a settlement.
 *
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 * @returns {any} MagicProfile
 */
export function deriveMagicProfile(settlement) {
  if (!settlement) return null;

  // Dead-magic world (config.magicExists === false): magic does not function,
  // so there is no availability/cost/risk envelope to fabricate — even if a
  // legacy magicLevel band, slider, or 'Wizard's Tower' survives on the record.
  // Say so honestly instead of profiling a system that does not exist.
  if (settlement.config?.magicExists === false) {
    return {
      magicExists: false,
      availability: 'absent',
      legality: 'absent',
      institutionalControl: 'unregulated',
      cost: 'absent',
      risk: 'absent',
      religiousAcceptance: 'indifferent',
      roles: { economic: 'absent', military: 'absent', medical: 'absent', infrastructure: 'absent' },
      contributors: [{
        source: 'config.magicExists',
        effect: 'no_magic',
        reason: 'Magic does not function in this world: no availability, legality, cost, or risk to profile.',
      }],
    };
  }

  const profiles = deriveAllFactionProfiles(settlement);
  const causal = deriveCausalState(settlement);
  /** @type {any[]} */
  const contributors = [];

  return {
    magicExists:          true,
    availability:         deriveAvailability(settlement, contributors),
    legality:             deriveLegality(settlement, profiles, contributors),
    institutionalControl: deriveInstitutionalControl(settlement, profiles, contributors),
    cost:                 deriveCost(settlement, contributors),
    risk:                 deriveRisk(settlement, causal, contributors),
    religiousAcceptance:  deriveReligiousAcceptance(settlement, profiles, contributors),
    roles:                deriveRoles(settlement, profiles, contributors),
    contributors,
  };
}

// ── Diagnostic helpers ───────────────────────────────────────────────────

export function magicAvailabilityBands() { return [...AVAILABILITY_BANDS]; }
export function magicLegalityBands()     { return [...LEGALITY_BANDS]; }
export function magicRiskBands()         { return [...RISK_BANDS]; }
export function magicRoleBands()         { return [...ROLE_BANDS]; }

/** Human-readable summary.
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 */
export function summarizeMagic(settlement) {
  const m = deriveMagicProfile(settlement);
  if (!m) return [];
  return [
    `Availability: ${m.availability}.`,
    `Legality: ${m.legality}.`,
    `Institutional control: ${m.institutionalControl}.`,
    `Cost: ${m.cost}. Risk: ${m.risk}.`,
    `Religious acceptance: ${m.religiousAcceptance}.`,
    `Roles. Economic: ${m.roles.economic}; military: ${m.roles.military}; medical: ${m.roles.medical}; infrastructure: ${m.roles.infrastructure}.`,
  ];
}
