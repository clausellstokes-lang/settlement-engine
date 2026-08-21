/**
 * Canonical mappings used to translate live pressure into current tensions and
 * timeline categories into authored history templates.
 *
 * Keeping this declarative vocabulary outside the history orchestrator makes
 * both maps independently auditable while preserving their public exports.
 */

export const STRESS_TO_TENSION = Object.freeze({
  under_siege: 'occupation_legacy',
  famine: 'resource_scarcity',
  occupied: 'occupation_legacy',
  politically_fractured: 'leadership_vacuum',
  indebted: 'outside_debt',
  recently_betrayed: 'corruption_scandal',
  infiltrated: 'infiltration_fear',
  plague_onset: 'resource_scarcity',
  succession_void: 'succession_crisis',
  monster_pressure: 'external_threat',
  insurgency: 'legitimacy_crisis',
  mass_migration: 'demographic_pressure',
  wartime: 'external_threat',
  religious_conversion: 'legitimacy_crisis',
  slave_revolt: 'legitimacy_crisis',
});

export const TIMELINE_CATEGORY_TYPES = Object.freeze({
  economic: Object.freeze([
    'economic_disparity',
    'outside_debt',
    'resource_scarcity',
    'guild_conflict',
    'market_crash',
    'trade_collapse',
  ]),
  political: Object.freeze([
    'succession_crisis',
    'corruption_scandal',
    'infiltration_fear',
    'leadership_vacuum',
    'occupation_legacy',
    'disputed_land',
    'population_friction',
    'generational_divide',
    'popular_uprising',
    'tyranny',
  ]),
  disaster: Object.freeze([
    'external_threat',
    'great_fire',
    'plague_years',
    'great_flood',
  ]),
  religious: Object.freeze([
    'religious_tension',
    'heresy_trial',
    'pilgrimage_surge',
  ]),
  magical: Object.freeze([
    'magical_controversy',
    'wild_magic',
  ]),
  occupation_infiltration: Object.freeze(['infiltration_fear']),
  exile_return: Object.freeze(['occupation_legacy']),
  demographic: Object.freeze(['population_friction']),
});
