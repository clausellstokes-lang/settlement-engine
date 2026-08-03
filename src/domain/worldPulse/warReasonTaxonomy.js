/**
 * The closed war/peace-reason taxonomy.
 *
 * This dependency-free leaf is the one authority for persisted casus types. It is
 * deliberately separate from the reason mover so save normalization and pure
 * termination reads can validate records without pulling the world-pulse engine
 * into their import graph.
 */

/** The fifteen shipped casus-belli kinds. */
export const WAR_REASON_TYPES = Object.freeze([
  'grievance',
  'revanchism',
  'resource_pressure',
  'treaty_default',
  'encirclement',
  'legitimacy_hunger',
  'corruption_exposed',
  'foreign_clash',
  'fear_of_dominance',
  'ingratitude_debt',
  'dependency_by_design',
  'opportunism',
  'sacred_claim',
  'lineage_claim',
  'alliance_obligation',
]);

/** The fifteen shipped casus-pacis kinds. */
export const PEACE_REASON_TYPES = Object.freeze([
  'exhaustion',
  'belief_convergence',
  'economic_strangulation',
  'coalition_fracture',
  'mediation',
  'harvest_pressure',
  'realignment',
  'spheres_understanding',
  'balance_restored',
  'debt_forgiven',
  'bonds_of_commerce',
  'hopelessness',
  'common_rite',
  'kinship_bond',
  'obligation_discharged',
]);

/**
 * The DM-declarable subset. `lineage_claim` and `alliance_obligation` are
 * derived from durable graph/deployment facts; admitting either through the
 * generic decree verb would manufacture those facts. Keep derived causes in the closed reason
 * taxonomy (persistence/termination still validate them) but out of the
 * authoring dial.
 */
export const DECLARABLE_WAR_REASON_TYPES = Object.freeze(
  WAR_REASON_TYPES.filter((type) => type !== 'lineage_claim' && type !== 'alliance_obligation'),
);

/**
 * The symmetry-law bijection: every war reason has one distinct peace mirror.
 * Totality and bijection are held by the reason-catalog walkers.
 */
export const REASON_MIRRORS = Object.freeze({
  grievance: 'mediation',
  revanchism: 'harvest_pressure',
  resource_pressure: 'economic_strangulation',
  treaty_default: 'coalition_fracture',
  encirclement: 'realignment',
  legitimacy_hunger: 'exhaustion',
  corruption_exposed: 'belief_convergence',
  foreign_clash: 'spheres_understanding',
  fear_of_dominance: 'balance_restored',
  ingratitude_debt: 'debt_forgiven',
  dependency_by_design: 'bonds_of_commerce',
  opportunism: 'hopelessness',
  sacred_claim: 'common_rite',
  lineage_claim: 'kinship_bond',
  alliance_obligation: 'obligation_discharged',
});

/** Total validation for an unknown persisted casus type. @param {unknown} type */
export function isWarReasonType(type) {
  return typeof type === 'string' && WAR_REASON_TYPES.includes(type);
}
