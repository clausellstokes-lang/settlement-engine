/**
 * Faction-gated NPC candidates that are not derivable from institutions alone.
 *
 * MOVED HERE from src/generators/npc/factionRoleCatalog.js at the rung-1 landing (LANDING-2,
 * 2026-11-04; the domain -> generators boundary): the reader battery reads NOBLE_ROLES, and a
 * domain module may not import a generator. Moved verbatim; the old path re-exports it.
 *
 * These are immutable module data rather than per-generation allocations.
 * Eligibility remains the orchestrator's responsibility: tier, faction, guild,
 * route, and WorldLaw gates are applied before a candidate enters a draw pool.
 */

// The noble table lives in src/data/nobleRoles.js (CENSUS-4, the role-class rule reads it there);
// the two moves composed at the rung-2 merge: one table, re-exported here unchanged.
export { NOBLE_ROLES } from '../../data/nobleRoles.js';

export const CRAFTS_ROLES = Object.freeze([
  {
    role: 'Master Blacksmith',
    title: 'master',
    priority: 7,
    minTier: 'hamlet',
    category: 'crafts',
    goalCategories: ['wealth', 'personal'],
  },
  {
    role: 'Master Carpenter',
    title: 'master',
    priority: 6,
    minTier: 'hamlet',
    category: 'crafts',
    goalCategories: ['wealth', 'personal'],
  },
  {
    role: 'Master Weaver',
    title: 'master',
    priority: 6,
    minTier: 'village',
    category: 'crafts',
    goalCategories: ['wealth', 'personal'],
  },
  {
    role: 'Master Tanner',
    title: 'master',
    priority: 5,
    minTier: 'village',
    category: 'crafts',
    goalCategories: ['wealth', 'personal'],
  },
  {
    role: 'Head Brewer',
    title: 'guild',
    priority: 5,
    minTier: 'hamlet',
    category: 'crafts',
    goalCategories: ['wealth', 'personal'],
  },
  {
    role: 'Guild Warden',
    title: 'guild',
    priority: 7,
    minTier: 'town',
    category: 'crafts',
    goalCategories: ['power', 'wealth'],
    requiresGuild: true,
  },
  {
    role: 'Journeyman Overseer',
    title: 'overseer',
    priority: 5,
    minTier: 'town',
    category: 'crafts',
    goalCategories: ['wealth', 'personal'],
  },
  {
    role: 'Craft Guild Representative',
    title: 'guild',
    priority: 6,
    minTier: 'city',
    category: 'crafts',
    goalCategories: ['power', 'wealth'],
    requiresGuild: true,
  },
  {
    role: 'Master Potter',
    title: 'master',
    priority: 4,
    minTier: 'village',
    category: 'crafts',
    goalCategories: ['wealth', 'personal'],
  },
  {
    role: 'Master Glassblower',
    title: 'master',
    priority: 5,
    minTier: 'town',
    category: 'crafts',
    goalCategories: ['wealth', 'personal'],
  },
]);
