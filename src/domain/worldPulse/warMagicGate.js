/**
 * warMagicGate.js — MG-3b: THE WAR LAYER LEARNS THE WORLD'S MAGIC LAW.
 *
 * The realm magic toggle (docs/DESIGN_REALM_MAGIC_TOGGLE.md) exposed two war-layer
 * leaks that predate it and that a whole-mundane realm makes impossible to ignore:
 *
 *   L2 — feasibilityGate could return the `require_magic` verdict ("arcane force could
 *        tip an otherwise-hopeless siege") off a materiel edge computed from PURELY
 *        MUNDANE stuff: weapons, armour, forges, siege trains. No magic was consulted
 *        anywhere in that arm, so a world without magic still produced sieges that only
 *        magic could win.
 *   L3 — warDeployment minted a `magicSupport` combat facet as `materiel/100` with no
 *        magic gate at all, and attrition then paid that facet a real mitigation term.
 *        A mundane army was being shielded by sorcery it does not have — and its
 *        materiel was being counted TWICE, once as equipment and once as magic.
 *
 * THE SHAPE (MG-LAW-1 — projection, never a second authority): there is no realm-level
 * war-magic rule to consult. The ONE truth is each settlement's own config, read here
 * through the canonical `magicLedger` accessor, and STAMPED ONTO THE FACETS ENVELOPE at
 * the single place war capacity is derived (warDeployment's capacity lookup). Every
 * downstream reader — the feasibility classifier, the deployment seeder, the DM-facing
 * mobilization preview — then sees the law on the object it already receives, with no
 * new argument threaded through five call sites and no second place to forget.
 *
 * PRESENT-GUARDED, and the guard is the whole point: `magicLedger`'s neutral envelope
 * for an UN-GENERATED settlement is itself `magicExists:false`, so an unguarded read
 * would declare every config-less war fixture in the estate mundane and move goldens
 * that have nothing to do with magic. Only a settlement that actually carries a magic
 * axis AND asserts magic absent is gated. Absent stamp ⇒ magic functions ⇒ byte-identical.
 *
 * PURE: no rng, no clock, no store, no tier read. warDeployment is the WRITER (it stamps
 * at the capacity lookup); feasibilityGate is a READER (it asks the stamped envelope the
 * pair question). Both go through this module so the rule has exactly one definition.
 */
import { magicLedger } from '../magicLedger.js';

/**
 * Does magic FUNCTION for this settlement? A snapshot item (`{ settlement }`) or a bare
 * settlement both read correctly — the war layer passes both shapes.
 *
 * @param {any} item  a worldSnapshot item, a settlement, or nullish.
 * @returns {boolean} false ONLY when the settlement carries a magic axis that says so.
 */
export function warMagicFunctions(item) {
  const settlement = item?.settlement || item || null;
  const ledger = magicLedger(settlement);
  return !(ledger.present === true && ledger.magicExists === false);
}

/**
 * Stamp the magic law onto a military-capacity facets envelope. ADDITIVE AND ONE-SIDED:
 * a world where magic functions gets the model's own object back UNTOUCHED (identity —
 * no clone, no new key, no byte moved), so every pre-MG deployment record, verdict and
 * golden is unchanged. A mundane settlement gets a copy carrying `magicFunctions:false`.
 *
 * Never mutates the model's facets: the capacity model owns that object and caches it.
 *
 * @param {any} facets  the military-capacity model facets.
 * @param {any} item    the settlement / snapshot item those facets belong to.
 * @returns {any} the facets envelope, stamped only where magic is asserted absent.
 */
export function stampWarMagicLaw(facets, item) {
  if (warMagicFunctions(item)) return facets;
  return { ...(facets || {}), magicFunctions: false };
}

/**
 * Does an arcane advantage MEAN anything for this matchup? Both ends must stand in a
 * world where magic functions: the contest is fought on the defender's ground, and
 * arcane force cannot tip a siege in lands where arcane force does not work. This is
 * the pair rule MG-3b names; a single mundane end is enough to close the arm.
 *
 * Reads the STAMPED facets rather than the settlements, so it stays a pure structural
 * predicate — and an unstamped (pre-MG, or magical) envelope answers true.
 *
 * @param {{ magicFunctions?: unknown } | null | undefined} attackerFacets
 * @param {{ magicFunctions?: unknown } | null | undefined} defenderFacets
 * @returns {boolean}
 */
export function pairMagicFunctions(attackerFacets, defenderFacets) {
  return attackerFacets?.magicFunctions !== false && defenderFacets?.magicFunctions !== false;
}
