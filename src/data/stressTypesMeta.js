/**
 * stressTypesMeta.js — Pure-data metadata for every stressor type.
 *
 * Why this file exists: `stressTypes.js` contains the full STRESS_TYPE_MAP
 * with runtime closures that capture `_rng` from `generators/rngContext.js`.
 * Importing it drags the generator chunk into the import graph.
 *
 * `customRegistry` only needs three string fields per stressor (label,
 * historyColour, viabilityNote) to enumerate prebuilt stressors for the
 * Compendium UI. By keeping those here in pure-data form, customRegistry
 * — and through it the store's dependencyEngine wiring at app boot —
 * avoids ever loading the generator chunk on first paint.
 *
 * Keep this in sync with stressTypes.js: adding a stressor there requires
 * adding the same key here. A unit test (stressTypesMeta.test.js) verifies
 * both maps have identical keys to catch drift.
 *
 * No imports. No closures. No runtime work. Pure data.
 */

/** @typedef {{ label: string, historyColour: string, viabilityNote: string }} StressTypeMeta */

/** @type {Record<string, StressTypeMeta>} */
export const STRESS_TYPE_META = {
  under_siege: {
    label: 'Under Siege',
    historyColour: 'military',
    viabilityNote: 'Field work and trade have stopped, and everything now turns on how long the food and water last.',
  },
  famine: {
    label: 'Famine',
    historyColour: 'economic',
    viabilityNote: 'No one can earn a normal living while the famine lasts, and every coin goes on food.',
  },
  occupied: {
    label: 'Under Occupation',
    historyColour: 'political',
    viabilityNote: 'The occupiers take the revenue, and local offices work only under their eye.',
  },
  politically_fractured: {
    label: 'Politically Fractured',
    historyColour: 'political',
    viabilityNote: 'Nothing gets decided, repairs are put off, and every problem is left for later.',
  },
  indebted: {
    label: 'Indebted to Outside Power',
    historyColour: 'economic',
    viabilityNote: 'Much of what is earned here goes straight to the creditor, and nothing is left to build with.',
  },
  recently_betrayed: {
    label: 'Recently Betrayed',
    historyColour: 'political',
    viabilityNote: 'People no longer trust those in charge, and some of the work that depends on that trust has stopped.',
  },
  infiltrated: {
    label: 'Infiltrated',
    historyColour: 'political',
    viabilityNote: 'Nothing is being taken yet; whoever has got inside wants influence, not money, for now.',
  },
  plague_onset: {
    label: 'Disease Outbreak',
    historyColour: 'disaster',
    viabilityNote: 'Fewer people come to market, travel is discouraged, and some goods stop arriving.',
  },
  succession_void: {
    label: 'Succession Void',
    historyColour: 'political',
    viabilityNote: 'Big decisions wait for a new leader, and in the meantime each office does as it sees fit.',
  },
  monster_pressure: {
    label: 'Beast & Raider Threat',
    historyColour: 'military',
    viabilityNote: 'Trade suffers as carts stop coming, more is spent on defence, and people grow afraid.',
  },
  insurgency: {
    label: 'Insurgency',
    historyColour: 'political',
    viabilityNote: 'Taxes are disputed, some offices no longer send their revenue on, and the government runs on habit.',
  },
  religious_conversion: {
    label: 'Religious Conversion',
    historyColour: 'religious',
    viabilityNote: 'The tithe is split, feast days and fairs are held twice over, the old house\'s property has no clear owner, and trade across the faiths is harder.',
  },
  slave_revolt: {
    label: 'Slave Revolt',
    historyColour: 'political',
    viabilityNote: 'Owners keep their gangs only on work they can watch, less gets made, and everyone who keeps order is busy containing the revolt.',
  },
  wartime: {
    label: 'Wartime',
    historyColour: 'military',
    viabilityNote: 'The war takes most of the money: trade suffers, a few grow rich on army contracts, and the fields are short of the men called up.',
  },
  mass_migration: {
    label: 'Mass Migration',
    historyColour: 'demographic',
    viabilityNote: 'If people arrive: food will run short, there will not be work for everyone, and some newcomers will take what they cannot earn. If people leave: taxes will fall short, offices will stand empty, and the fields will lack the hands to work them.',
  },
};
