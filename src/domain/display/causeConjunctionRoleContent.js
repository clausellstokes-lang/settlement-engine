/**
 * domain/display/causeConjunctionRoleContent.js — W2: the ROLE-TIER conjunction
 * content table (rung 2 of the selection ladder in causeConjunctionContent.js).
 *
 * TIER-1 COVERAGE: every affinity-reachable (role × causeClass) pair — and the
 * built roleCauseAffinity has a nonzero floor for every family, so that is ALL
 * 12 × 14 = 168 pairs — at every lifecycle stage. Per pair: two variants on the
 * high-frequency stages (attributed, exposed-public, reformed), one on the rest
 * (re-caused, historicized, re-adjudicated); nine authored lines per pair.
 *
 * Each pair is ONE concrete arrangement (what this bearer actually sold, given
 * this pressure) viewed at six moments of the W-C5 lifecycle, so the stages of a
 * pair corroborate each other and no two pairs share a receipt. Role personas
 * are the established archetype nouns (causeLifecycleVocabulary.ROLE_LABEL):
 * captain / ruler / claimant / guildmaster / priest / boss / adept / official /
 * healer / foreman / envoy / agitator.
 *
 * SIDE-CAR LAW (institutionVocabulary.js precedent): generation NEVER imports
 * this file. It is read only through the lazy dossier NPC card, so authoring
 * here is byte-inert to every golden and adds nothing to the first-paint entry
 * closure. Pure data: no imports, no slots (personas are written in), no rng.
 *
 * STAGE SEMANTICS (causeLifecycle.js): at re-caused and re-adjudicated the
 * key's causeClass is the NEW sustaining cause. Those lines present it as what
 * carries the arrangement NOW; the prior cause is never named (it is not in the
 * key). Lines are AGE-BAND-NEUTRAL: no "years ago" / "lean years" register
 * (that belongs to the floor, which reads the band), and no fresh-age claims,
 * because a stamp renders at any age.
 *
 * DECOMPOSED (THE DECOMPOSITION WAVE, lane D): the twelve authored role blocks
 * moved verbatim into ./causeConjunctionRole/<role>.js leaves, one per persona.
 * This head keeps the contract above, the assembly order, and the single shallow
 * Object.freeze the read surface has always had. Behaviour-identical: the
 * assembled object is deep-equal, key-order-equal, to the pre-split table.
 *
 * @type {Readonly<Record<string, Record<string, Record<string, ReadonlyArray<string>>>>>}
 */
import { MILITARY_ROLE_CONTENT } from './causeConjunctionRole/military.js';
import { RULER_ROLE_CONTENT } from './causeConjunctionRole/ruler.js';
import { HEIR_ROLE_CONTENT } from './causeConjunctionRole/heir.js';
import { MERCHANT_ROLE_CONTENT } from './causeConjunctionRole/merchant.js';
import { RELIGIOUS_ROLE_CONTENT } from './causeConjunctionRole/religious.js';
import { CRIMINAL_ROLE_CONTENT } from './causeConjunctionRole/criminal.js';
import { ARCANE_ROLE_CONTENT } from './causeConjunctionRole/arcane.js';
import { CIVIC_ROLE_CONTENT } from './causeConjunctionRole/civic.js';
import { HEALER_ROLE_CONTENT } from './causeConjunctionRole/healer.js';
import { LABOR_RESOURCE_ROLE_CONTENT } from './causeConjunctionRole/laborResource.js';
import { DIPLOMAT_OUTSIDER_ROLE_CONTENT } from './causeConjunctionRole/diplomatOutsider.js';
import { DISSIDENT_ROLE_CONTENT } from './causeConjunctionRole/dissident.js';

export const ROLE_CONTENT = Object.freeze({
  military: MILITARY_ROLE_CONTENT,
  ruler: RULER_ROLE_CONTENT,
  heir: HEIR_ROLE_CONTENT,
  merchant: MERCHANT_ROLE_CONTENT,
  religious: RELIGIOUS_ROLE_CONTENT,
  criminal: CRIMINAL_ROLE_CONTENT,
  arcane: ARCANE_ROLE_CONTENT,
  civic: CIVIC_ROLE_CONTENT,
  healer: HEALER_ROLE_CONTENT,
  labor_resource: LABOR_RESOURCE_ROLE_CONTENT,
  diplomat_outsider: DIPLOMAT_OUTSIDER_ROLE_CONTENT,
  dissident: DISSIDENT_ROLE_CONTENT,
});
