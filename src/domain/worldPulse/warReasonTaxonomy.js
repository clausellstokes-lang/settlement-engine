/**
 * The closed war/peace-reason taxonomy.
 *
 * This dependency-free leaf is the one authority for persisted casus types. It is
 * deliberately separate from the reason mover so save normalization and pure
 * termination reads can validate records without pulling the world-pulse engine
 * into their import graph.
 */

/**
 * The sixteen shipped casus-belli kinds.
 *
 * WR-8 / CR-WR8-C added the sixteenth pair, `atrocity_answer` ↔ `atrocity_atoned`
 * — THE ATROCITY-COALITION CASUS. Amendment R claimed "every piece of that ledger
 * already exists"; the 2026-08-02 self-audit measured that this piece did not, and
 * the chair ruled the spelling. It is registered here FIRST, ahead of its producer,
 * for the same reason `treaty_default` and `corruption_exposed` were: the taxonomy
 * is walker-enforced for totality AND bijection across five surfaces, so a casus
 * cannot be minted by a wave that has not already authored its peace mirror, its
 * dissolution mode and its two prose clauses. Registration-first is the only order
 * this taxonomy admits. Until R's razing writer feeds it, the scorer is passed
 * `undefined` ⇒ 0 ⇒ no record ⇒ byte-identical.
 */
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
  'atrocity_answer',
]);

/** The sixteen shipped casus-pacis kinds. */
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
  'atrocity_atoned',
]);

/**
 * THE ATROCITY PAIR, named as data (CR-WR8-C). Prefix-stable: ONE grep family
 * `atrocity_*` finds both halves, and the mirror keeps the atrocity as its
 * SUBJECT — "the atrocity was atoned", not "the avenger was satisfied" — which is
 * how the Herald receipts a resolution rather than a mood. The 2026-08-02 block's
 * `atrocity_outrage` ↔ `atonement_accepted` was retired by that ruling before any
 * code carried either spelling.
 *
 * Exported so pins and the razing wave name the members through the taxonomy
 * rather than re-spelling two string literals in six files.
 */
export const ATROCITY_CASUS_PAIR = Object.freeze({
  war: 'atrocity_answer',
  peace: 'atrocity_atoned',
});

/**
 * The DM-declarable subset. `lineage_claim` and `alliance_obligation` are
 * derived from durable graph/deployment facts; admitting either through the
 * generic decree verb would manufacture those facts. Keep derived causes in the closed reason
 * taxonomy (persistence/termination still validate them) but out of the
 * authoring dial.
 *
 * `atrocity_answer` joins them, and its exclusion is the STRONGEST of the three.
 * Its durable fact is a RAZING, and R2's moral economy hangs the vengeance
 * license off exactly that fact — so a decree that materialized this casus would
 * not merely manufacture a graph edge, it would manufacture the atrocity itself
 * and, through it, a license to burn a city. The volume defers the false-license
 * road (R2/J-WR-7) rather than building it; the decree verb must not open it by
 * accident. THE DERIVED-CAUSE COUNT IS NOW THREE.
 */
const NON_DECLARABLE_WAR_REASON_TYPES = Object.freeze([
  'lineage_claim', 'alliance_obligation', 'atrocity_answer',
]);

export const DECLARABLE_WAR_REASON_TYPES = Object.freeze(
  WAR_REASON_TYPES.filter((type) => !NON_DECLARABLE_WAR_REASON_TYPES.includes(type)),
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
  atrocity_answer: 'atrocity_atoned',
});

/** Total validation for an unknown persisted casus type. @param {unknown} type */
export function isWarReasonType(type) {
  return typeof type === 'string' && WAR_REASON_TYPES.includes(type);
}
