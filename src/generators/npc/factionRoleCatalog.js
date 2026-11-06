// The faction role catalogue MOVED to src/domain/entities/factionRoleCatalog.js (LANDING-2, the domain ->
// generators boundary); re-exported here so npcGenerator.js keeps its import. NOBLE_ROLES is the one
// table in src/data/nobleRoles.js (CENSUS-4), re-exported through the domain catalogue.
export { CRAFTS_ROLES, NOBLE_ROLES } from '../../domain/entities/factionRoleCatalog.js';
