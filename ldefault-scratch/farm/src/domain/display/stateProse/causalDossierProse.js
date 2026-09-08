/**
 * domain/display/stateProse/causalDossierProse.js — LANE P: the causal join reader.
 *
 * THE FOURTH REGISTER. RECEIPT_POOLS_CAUSAL_DOSSIER.md holds every join family's causal
 * truth written in the DOSSIER's own idiom — present tense, woven, the settlement
 * explaining its own condition — as opposed to the Herald's HEADLINE / SUBHEADER /
 * TELLING. Seventy-eight families, six `[angle · arm]` variants each. This module is
 * the only thing that renders one.
 *
 * ── THE TWO THINGS THAT GO WRONG, AND WHAT STOPS THEM ────────────────────────────────
 *
 * 1. THE FAMILY SPEAKS OVER A JOIN THE TOWN DOES NOT HAVE. A throughput number is not a
 *    war; a quiet road is not a blockade. The corpus is entailed prose — every line
 *    asserts the join it is about — so a reader that could SELECT a family from a
 *    settlement's state would let the page invent history out of a band. It cannot:
 *    this module renders only the joins it is HANDED. The caller derives them from real
 *    records (`causes[]`, `sourceEventId`, the CW-0 `receiptField` map) and this module
 *    has no path to a settlement, no path to a ledger, and therefore no way to conjure
 *    one. Anchored liveness at the slot grain is the kernel's; anchored liveness at the
 *    JOIN grain is this shape.
 *
 * 2. THE PAGE PRINTS THE NEIGHBOUR'S CONDITION. R-DOS-A is the annex's most-likely
 *    mis-wiring: in the Herald's molds `{settlement}` is the ACTING town of a directed
 *    join, and here it is always the town whose page is being read, whichever end of the
 *    join that town sits on. Which end it sits on is the ARM, and a family's variants
 *    are arm-tagged. A caller that passes the wrong arm gets the wrong town's sentence,
 *    so the arm is a REQUIRED argument with no default, and an arm the family does not
 *    declare renders nothing rather than falling through to the other one.
 *
 * THE CONTAMINATION FENCE and THE TRUTH LAW extend here identically (§0a): the inputs
 * are truth-side records only, never a rumor ledger, a belief map or a disinfo record.
 * This leaf reads nothing but its own corpus and the caller's arguments, so the fence is
 * structural rather than promised.
 *
 * PURE HEADLESS LEAF apart from the corpus it serves and the kernel it draws with.
 *
 * @enforced-by tests/domain/causalDossierProse.test.js
 */
import { DOSSIER_CAUSAL_PROSE } from '../../../data/dossierCausalProse.generated.js';
import { AUDIENCE_DM, AUDIENCE_PLAYER, eligibleVariants, drawVariant, fillSlots, SOLE_POOL } from './stateProseKernel.js';

/**
 * The eight dossier sections a causal family can land in (§0e). A family declares a
 * PRIMARY and, where one of its angles genuinely lives elsewhere, a SECOND.
 * @type {ReadonlyArray<string>}
 */
export const CAUSAL_SECTION_TARGETS = Object.freeze([
  'economy', 'history', 'tensions', 'faith', 'power', 'population', 'defense', 'relations',
]);

/**
 * A join the caller has EVIDENCE for.
 * @typedef {object} DossierJoin
 * @property {string} familyId e.g. 'JF-CPL-1a'
 * @property {string} arm which end of the join this page's town sits on
 * @property {Record<string, unknown>} [slots] fills derived from the join's own records
 */

/**
 * @param {string} familyId
 * @returns {import('./stateProseKernel.js').StateProseBlock|undefined}
 */
export function causalFamily(familyId) {
  return /** @type {any} */ (DOSSIER_CAUSAL_PROSE)[familyId];
}

/**
 * The arms a family declares. An empty result means the family id is unknown, and the
 * caller should treat that as a wiring error rather than a quiet no-op.
 * @param {string} familyId
 * @returns {ReadonlyArray<string>}
 */
export function causalArms(familyId) {
  return causalFamily(familyId)?.arms ?? [];
}

/**
 * Every family whose PRIMARY or SECOND target is this section. Discovery only — being
 * listed here is not permission to render; a family still renders only when the caller
 * hands it a join with evidence behind it.
 * @param {string} section
 * @returns {ReadonlyArray<string>}
 */
export function causalFamiliesForSection(section) {
  return Object.keys(DOSSIER_CAUSAL_PROSE)
    .filter((id) => (causalFamily(id)?.sectionTarget || []).includes(section));
}

/**
 * Render one join, in the dossier's own voice, from the page town's end of it.
 *
 * Returns `null` — meaning the composer renders NOTHING — when the family is unknown,
 * when the arm is not one the family declares, when the audience cannot hear any
 * surviving variant, or when no variant's slots are all filled.
 *
 * @param {DossierJoin} join
 * @param {{seed?: string, audience?: string}} [options]
 * @returns {{familyId: string, arm: string, angle: string, section: string, text: string}|null}
 */
export function readCausalDossierLine(join, options = {}) {
  const family = causalFamily(join?.familyId);
  if (!family) return null;
  const arms = family.arms || [];
  // An undeclared arm is a wiring error, and falling through to the other arm would
  // print the counterpart's condition on this town's page (R-DOS-A).
  if (!join.arm || !arms.includes(join.arm)) return null;

  const slots = join.slots || {};
  const audience = options.audience === AUDIENCE_DM ? AUDIENCE_DM : AUDIENCE_PLAYER;
  const armed = (family.pools[SOLE_POOL] || [])
    .filter((/** @type {import('./stateProseKernel.js').StateProseVariant} */ variant) =>
      (variant.marks || []).includes(join.arm));
  const eligible = eligibleVariants(armed, { slots, audience });
  // The draw key carries the arm: the same family read from both ends of one join must
  // not draw the same index and read as a copied sentence.
  const variant = drawVariant(eligible, join.familyId, join.arm, options.seed || '');
  if (!variant) return null;
  const text = fillSlots(variant.text, slots);
  if (text === null) return null;
  return Object.freeze({
    familyId: join.familyId,
    arm: join.arm,
    angle: variant.angle || '',
    section: (family.sectionTarget || [])[0] || '',
    text,
  });
}

/**
 * Render every join the caller has evidence for that lands in one section, in the order
 * the caller supplied them. Joins that cannot speak are dropped, not stubbed.
 *
 * @param {string} section one of CAUSAL_SECTION_TARGETS
 * @param {ReadonlyArray<DossierJoin>} joins
 * @param {{seed?: string, audience?: string, secondTargets?: boolean}} [options]
 * @returns {ReadonlyArray<object>}
 */
export function causalLinesForSection(section, joins, options = {}) {
  if (!Array.isArray(joins) || joins.length === 0) return [];
  const allowSecond = options.secondTargets !== false;
  const lines = [];
  for (const join of joins) {
    const targets = causalFamily(join?.familyId)?.sectionTarget || [];
    const index = targets.indexOf(section);
    if (index < 0) continue;
    if (index > 0 && !allowSecond) continue;
    const line = readCausalDossierLine(join, options);
    if (line) lines.push(Object.freeze({ ...line, section, isSecondTarget: index > 0 }));
  }
  return Object.freeze(lines);
}
