/**
 * sacredClaim.js — THE RELIGIOUS CASUS BELLI, and its mirror.
 *
 * DESIGN_PEACE_ENGINE.md §14.1 lists an IDEOLOGY/FAITH family ("religious-contest
 * escalation... aggressive inter-deity stance... alignment antipathy at cultureDistance
 * extremes") that the eleven shipped reasons never implemented: the engine ran live faith
 * machinery and no court ever went to war over a god. §14.2's MORAL/FAITH entry names the
 * other side ("a shared or neutral faith brokers"). This module owns both halves —
 * `sacred_claim ↔ common_rite` — because, as with opportunism, they are ONE reading.
 *
 * ── THE SUBSTRATE, VERIFIED BEFORE IT WAS SCORED ────────────────────────────────────
 * Nothing here is invented. The faith system already publishes, per settlement:
 *   • `config.primaryDeitySnapshot._deityRef` — the patron's LOCAL ref (deity doctrine:
 *     there is no premade pantheon, every god is a local god, and refs are only ever
 *     compared for IDENTITY, never interpreted).
 *   • `config.faithProfile.patronSecurity` — 0..1, the patron's rightful claim (legitimacy
 *     -driven, damped when contested), written by projectReligionStateOntoSettlement.
 * `faithProximityOf` (this module's, moved here from peaceTerms.js so the treaty mint, the
 * mediation reason and these two reasons all read ONE function) folds the pair into
 * `{ samePatron, alignmentKinship01 }`, and `faithAlignmentQuadrant` — the engine's
 * EXISTING banding of exactly those two inputs — closes them into a four-member
 * vocabulary. FINITE SEMANTICS is satisfied structurally: the score comes off a closed
 * table keyed by a closed vocabulary, never off free text and never off a deity's name.
 *
 * ── THE TABLE (the same evidence, two columns) ──────────────────────────────────────
 *   brothers          same patron, kindred alignment  →  no claim, the strongest common rite
 *   respectable_rival rival patron, kindred alignment  →  no claim, a working common rite
 *   schism_axis       SAME patron, opposed alignment   →  the STRONGEST claim, no common rite
 *   natural_enemy     rival patron, opposed alignment  →  a strong claim, no common rite
 * The schism outranks the stranger deliberately: two courts that claim the same god and
 * read it oppositely are the ones who write holy wars, and a rival patron whose people
 * want the same things is a neighbour, not a heretic. Every row that scores on one side
 * scores zero on the other — one quadrant, two columns, no double-counting.
 *
 * BOTH SIDES ARE THEN SCALED BY THE OBSERVER'S OWN PATRON SECURITY. A church with
 * standing can press a claim or bless a peace; a contested, discredited one does neither,
 * because its own altars are the argument it is losing at home.
 *
 * ── DARK IS SILENT ──────────────────────────────────────────────────────────────────
 * Two independent guards, both required:
 *   1. THE FLAG — `isFaithSpreadEnabled` (canonical `faithSpreadEnabled`, tolerant of the
 *      legacy `religionDynamicsEnabled`). A religious casus belli is inherently the
 *      CROSS-SETTLEMENT faith lane, which is exactly what that flag governs.
 *   2. THE PATRONS — both towns must actually name a patron. This guard is load-bearing,
 *      not defensive: `faithAlignmentQuadrant` treats a no-signal pair as KINDRED (its
 *      documented charitable default), so a deity-free world would otherwise read
 *      `respectable_rival` on every pair and mint a common_rite everywhere. Absence of a
 *      faith is not a shared faith.
 * Either guard dark ⇒ 0 ⇒ no record ⇒ byte-identical.
 *
 * Pure leaf: no rng, no wall clock, no store, no writes; imports no reason mover (the
 * reasons DAG stays acyclic — warReasons, peaceReasons and peaceTerms all import THIS).
 *
 * @enforced-by tests/domain/warReasonsPredationFaith.test.js
 */

import { clamp01 } from '../../kernel/math.js';
import { faithAlignmentQuadrant } from '../spatial/cohesionWeave.js';
import { evil01 } from './deityAxes.js';
import { isFaithSpreadEnabled } from './simulationRules.js';
import { warReceipt, peaceReceipt } from './eventProse.js';

/**
 * Bounded, owner-retunable tuning (soak). The two tables are keyed by the CLOSED quadrant
 * vocabulary, so a new quadrant would be a compile-visible gap rather than a silent zero.
 */
export const SACRED_CLAIM_TUNING = Object.freeze({
  /** The claim a court can press, per quadrant. The heretic outranks the stranger. */
  CLAIM_BY_QUADRANT: Object.freeze({
    brothers: 0,
    respectable_rival: 0,
    schism_axis: 0.75,
    natural_enemy: 0.60,
  }),
  /** The common ground a court can stand on, per quadrant — the same table, read the other way. */
  RITE_BY_QUADRANT: Object.freeze({
    brothers: 0.80,
    respectable_rival: 0.45,
    schism_axis: 0,
    natural_enemy: 0,
  }),
  /** A church with no published security still speaks, but only at the neutral voice. */
  NEUTRAL_PATRON_SECURITY: 0.50,
});

const T = SACRED_CLAIM_TUNING;

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/**
 * ONE SNAPSHOT MEMBER as this module reads it.
 * @typedef {{ settlement?: { config?: {
 *   primaryDeitySnapshot?: Record<string, unknown> | null,
 *   faithProfile?: { patronSecurity?: unknown } | null } } | null }} FaithItem
 */

/**
 * The faith×alignment proximity inputs for a pair of snapshot items (the
 * generosityKernel faithProximity derivation, kept identical so the quadrant
 * reads agree across movers).
 *
 * MOVED HERE from peaceTerms.js: peaceTerms imports warReasons' gate, so warReasons could
 * never have imported this back without closing a cycle. It lives in this leaf now and
 * peaceTerms imports it — ONE reader, three consumers, no fork.
 * Takes FaithItem (declared above) rather than restating a narrower inline shape:
 * the two disagreed on whether `settlement` itself may be null, which is exactly the
 * two-spellings-of-one-record class this tree has been bitten by. One declaration.
 * @param {FaithItem | null | undefined} itemA
 * @param {FaithItem | null | undefined} itemB
 * @returns {{ samePatron: boolean, alignmentKinship01: number }}
 */
export function faithProximityOf(itemA, itemB) {
  const dA = itemA?.settlement?.config?.primaryDeitySnapshot || null;
  const dB = itemB?.settlement?.config?.primaryDeitySnapshot || null;
  const refA = dA && dA._deityRef != null ? String(dA._deityRef) : '';
  const refB = dB && dB._deityRef != null ? String(dB._deityRef) : '';
  const samePatron = !!(refA && refA === refB);
  const alignmentKinship01 = clamp01(1 - Math.abs(evil01(dA) - evil01(dB)));
  return { samePatron, alignmentKinship01 };
}

/** The patron ref a town names, or '' when it names none. @param {FaithItem | null | undefined} item */
function patronRefOf(item) {
  const snap = asObject(asObject(asObject(item).settlement).config).primaryDeitySnapshot;
  const ref = asObject(snap)._deityRef;
  return ref != null ? String(ref) : '';
}

/**
 * The observer church's standing — `patronSecurity` verbatim off the published faith
 * profile, or the neutral voice where the profile carries none.
 * @param {FaithItem | null | undefined} item @returns {number}
 */
export function patronSecurityOf(item) {
  const profile = asObject(asObject(asObject(item).settlement).config).faithProfile;
  const security = Number(asObject(profile).patronSecurity);
  return Number.isFinite(security) ? clamp01(security) : T.NEUTRAL_PATRON_SECURITY;
}

/**
 * THE ONE READING both reasons come off: the pair's closed quadrant, plus the observer's
 * standing to speak. Null when either town names no patron — absence of a faith is not a
 * shared faith (see the module header's guard 2).
 * @param {FaithItem | null | undefined} observerItem
 * @param {FaithItem | null | undefined} subjectItem
 * @returns {{ quadrant: string, samePatron: boolean, security01: number } | null}
 */
export function faithStandingBetween(observerItem, subjectItem) {
  if (!patronRefOf(observerItem) || !patronRefOf(subjectItem)) return null;
  const read = faithAlignmentQuadrant(faithProximityOf(observerItem, subjectItem));
  return { quadrant: read.quadrant, samePatron: read.samePatron, security01: patronSecurityOf(observerItem) };
}

/**
 * SACRED CLAIM (§14.1 ideology/faith) — the altars of a neighbour whose rite this court
 * holds to be wrong, pressed by a church with the standing to press it. Bounded 0..1 by
 * construction (a table value times a 0..1 security); no gain, no new cap.
 * @param {{ standing: { quadrant: string, security01: number } | null }} args
 * @param {string} [seed] @returns {{ score: number, receipt: string }}
 */
export function scoreSacredClaim({ standing }, seed) {
  if (!standing) return { score: 0, receipt: '' };
  const band = Number(/** @type {Record<string, number>} */ (T.CLAIM_BY_QUADRANT)[standing.quadrant]) || 0;
  const score = clamp01(band * clamp01(standing.security01));
  if (score <= 0) return { score: 0, receipt: '' };
  // The two claim quadrants are told apart in the receipt: a schism is a quarrel inside
  // one rite, a natural enemy is a quarrel between two.
  return { score, receipt: warReceipt(`sacred_claim.${standing.quadrant}`, seed) };
}

/**
 * COMMON RITE (§14.2 moral/faith) — THE SAME QUADRANT, read the other way: the ground two
 * courts already share, which is a reason to stop and not merely an absence of a reason to
 * start. Distinct from `mediation`, which is a THIRD party standing between them; this is
 * the two of them standing on the same floor.
 * @param {{ standing: { quadrant: string, security01: number } | null }} args
 * @param {string} [seed] @returns {{ score: number, receipt: string }}
 */
export function scoreCommonRite({ standing }, seed) {
  if (!standing) return { score: 0, receipt: '' };
  const band = Number(/** @type {Record<string, number>} */ (T.RITE_BY_QUADRANT)[standing.quadrant]) || 0;
  const score = clamp01(band * clamp01(standing.security01));
  if (score <= 0) return { score: 0, receipt: '' };
  return { score, receipt: peaceReceipt(`common_rite.${standing.quadrant}`, seed) };
}

/**
 * Build the per-tick faith context BOTH reason movers consume (the hegemonyFear shape).
 * `lit` is the cheap ground-truth gate: the faith flag dark ⇒ every read is 0 without any
 * per-pair work ⇒ byte-identical (the negative-control pin).
 * @param {{ snapshot: { byId?: Map<string, unknown>, settlements?: unknown[] } | null | undefined,
 *           worldState: Record<string, unknown> }} args
 */
export function makeSacredClaimRead({ snapshot, worldState }) {
  const rules = asObject(worldState).simulationRules;
  const lit = isFaithSpreadEnabled(/** @type {Record<string, unknown>} */ (asObject(rules)));
  const settlements = /** @type {FaithItem[]} */ (
    Array.isArray(asObject(snapshot).settlements) ? asObject(snapshot).settlements : []);
  /** @type {Map<string, FaithItem>} */
  const byId = asObject(snapshot).byId instanceof Map
    ? /** @type {Map<string, FaithItem>} */ (asObject(snapshot).byId)
    : new Map(settlements.map((it) => [String(asObject(it).id), it]));

  /** @param {string} observerId @param {string} subjectId */
  const standingFor = (observerId, subjectId) => (lit
    ? faithStandingBetween(byId.get(String(observerId)) || null, byId.get(String(subjectId)) || null)
    : null);

  return {
    lit,
    /** sacred_claim for the directed pair. @param {string} fromId @param {string} toId */
    sacredClaimOf(fromId, toId) {
      if (!lit) return { score: 0, receipt: '' };
      return scoreSacredClaim({ standing: standingFor(fromId, toId) }, `${fromId}>${toId}`);
    },
    /** common_rite for the directed pair. @param {string} partyId @param {string} foeId */
    commonRiteOf(partyId, foeId) {
      if (!lit) return { score: 0, receipt: '' };
      return scoreCommonRite({ standing: standingFor(partyId, foeId) }, `${partyId}>${foeId}`);
    },
  };
}
