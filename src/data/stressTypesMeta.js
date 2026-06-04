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
    viabilityNote: 'Land-based economic activity is suspended. Port access (if present) provides a partial lifeline. The only metric that matters is how long food, water, and ammunition hold out.',
  },
  famine: {
    label: 'Famine',
    historyColour: 'economic',
    viabilityNote: 'Short-term economic viability is critically compromised. Normal income projections do not apply.',
  },
  occupied: {
    label: 'Under Occupation',
    historyColour: 'political',
    viabilityNote: 'Revenue flows to the occupying authority. Local institutions continue under oversight.',
  },
  politically_fractured: {
    label: 'Politically Fractured',
    historyColour: 'political',
    viabilityNote: 'Decision-making is paralysed. Infrastructure maintenance is being neglected. Crisis is deferred, not resolved.',
  },
  indebted: {
    label: 'Indebted to Outside Power',
    historyColour: 'economic',
    viabilityNote: 'A significant portion of revenue is being extracted by the creditor. Capital investment has stopped.',
  },
  recently_betrayed: {
    label: 'Recently Betrayed',
    historyColour: 'political',
    viabilityNote: 'Trust in institutions is low. Some key systems are not operating at full capacity as a result.',
  },
  infiltrated: {
    label: 'Infiltrated',
    historyColour: 'political',
    viabilityNote: 'No economic impact yet. The infiltration is strategic, not extractive — so far.',
  },
  plague_onset: {
    label: 'Disease Outbreak',
    historyColour: 'disaster',
    viabilityNote: 'Market activity is reduced. Travel is being discouraged. Some supply chains are disrupted.',
  },
  succession_void: {
    label: 'Succession Void',
    historyColour: 'political',
    viabilityNote: 'Major decisions are deferred. Some institutions are operating autonomously, for better or worse.',
  },
  monster_pressure: {
    label: 'Beast & Raider Threat',
    historyColour: 'military',
    viabilityNote: 'Trade disruption is reducing income. Defensive expenditure is increasing. Population anxiety is rising.',
  },
  insurgency: {
    label: 'Insurgency',
    historyColour: 'political',
    viabilityNote: 'Tax collection is contested. Several institutions have stopped forwarding revenue to the central authority. Normal governance is functioning on momentum.',
  },
  religious_conversion: {
    label: 'Religious Conversion',
    historyColour: 'religious',
    viabilityNote: 'Tithing income splits or redirects. Religious market days and fairs are contested or duplicated. Properties of the old institution are in legal ambiguity. Cross-faith trade is complicated.',
  },
  slave_revolt: {
    label: 'Slave Revolt',
    historyColour: 'political',
    viabilityNote: 'The slave market\'s commercial operations are suspended. Labour-dependent production is disrupted. The security apparatus is entirely focused on containment.',
  },
  wartime: {
    label: 'Wartime',
    historyColour: 'military',
    viabilityNote: 'Military expenditure dominates the economy. Trade disruption is significant but offset by war contracts for some. Labour shortage from conscription affects agricultural and craft output.',
  },
  mass_migration: {
    label: 'Mass Migration',
    historyColour: 'demographic',
    viabilityNote: 'Immigration: food balance stressed, labour market disrupted, criminal opportunity elevated. Emigration: tax base shrinking, institutions hollowing, labour shortage emerging.',
  },
};
