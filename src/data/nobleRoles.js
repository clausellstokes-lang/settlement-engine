/**
 * data/nobleRoles.js — the noble NPC candidates (moved from `generators/npc/factionRoleCatalog.js`,
 * CENSUS-4, so the domain's role-class rule can read them without importing a generator; the
 * catalogue re-exports this table unchanged, so every generator reader keeps its import).
 *
 * Immutable module data. Eligibility remains the orchestrator's responsibility.
 */

export const NOBLE_ROLES = Object.freeze([
  {
    role: 'Lord/Lady of the Manor',
    title: 'noble',
    priority: 8,
    minTier: 'village',
    category: 'noble',
    goalCategories: ['power', 'wealth'],
  },
  {
    role: 'Baron/Baroness',
    title: 'noble',
    priority: 9,
    minTier: 'town',
    category: 'noble',
    goalCategories: ['power', 'wealth'],
  },
  {
    role: 'Court Advisor',
    title: 'advisor',
    priority: 7,
    minTier: 'town',
    category: 'noble',
    goalCategories: ['power', 'knowledge'],
  },
  {
    role: 'House Steward',
    title: 'steward',
    priority: 6,
    minTier: 'village',
    category: 'noble',
    goalCategories: ['wealth', 'personal'],
  },
  {
    role: 'Noble Heir',
    title: 'noble',
    priority: 5,
    minTier: 'hamlet',
    category: 'noble',
    goalCategories: ['personal', 'power'],
  },
  {
    role: 'Land Agent',
    title: 'agent',
    priority: 5,
    minTier: 'village',
    category: 'noble',
    goalCategories: ['wealth', 'personal'],
  },
  {
    role: 'Knight/Dame',
    title: 'knight',
    priority: 7,
    minTier: 'village',
    category: 'noble',
    goalCategories: ['protection', 'personal'],
  },
  {
    role: 'Duke/Duchess',
    title: 'noble',
    priority: 10,
    minTier: 'metropolis',
    category: 'noble',
    goalCategories: ['power', 'wealth'],
  },
  {
    role: 'Royal Chamberlain',
    title: 'noble',
    priority: 8,
    minTier: 'city',
    category: 'noble',
    goalCategories: ['power', 'personal'],
  },
]);
