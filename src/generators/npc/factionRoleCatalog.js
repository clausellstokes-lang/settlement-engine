/**
 * Faction-gated NPC candidates that are not derivable from institutions alone.
 *
 * These are immutable module data rather than per-generation allocations.
 * Eligibility remains the orchestrator's responsibility: tier, faction, guild,
 * route, and WorldLaw gates are applied before a candidate enters a draw pool.
 */

export { NOBLE_ROLES } from '../../data/nobleRoles.js'; // CENSUS-4: the table lives in data/, read by the domain's role-class rule

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
