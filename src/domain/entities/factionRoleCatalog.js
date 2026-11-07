/**
 * Faction-gated NPC candidates that are not derivable from institutions alone.
 *
 * MOVED HERE from src/generators/npc/factionRoleCatalog.js at the rung-1 landing (LANDING-2,
 * 2026-11-04; the domain -> generators boundary): the reader battery reads NOBLE_ROLES, and a
 * domain module may not import a generator. Moved verbatim; the old path re-exports it. NOBLE_ROLES
 * itself is the one table in src/data/nobleRoles.js (CENSUS-4's move, met at the rung-2 merge).
 *
 * These are immutable module data rather than per-generation allocations.
 * Eligibility remains the orchestrator's responsibility: tier, faction, guild,
 * route, and WorldLaw gates are applied before a candidate enters a draw pool.
 */

// NOBLE_ROLES lives in data/ (CENSUS-4, for the domain's role-class rule, src/domain/roles/roleClass.js);
// re-exported here unchanged so the catalogue stays one import (LANDING-R2's merge: one table, not two).
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
