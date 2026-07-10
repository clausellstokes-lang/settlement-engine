/**
 * domain/worldPulse/deityAxes.js — the deity AXIS-PROJECTION + temper-derivation
 * leaf (Phase 4 W-F2). A TRUE dependency-free leaf: it imports NOTHING, so every
 * consumer — the stance core (deityStance.js), the niche key (cultImpositionApply),
 * the temper readers (religiousContest / religionState / disposition), and the
 * W-F3 corruption-plane surface — can read ONE mapping without an import cycle.
 *
 * The double-axis behavior reads a deity's alignment on two 0..1 COORDINATES:
 * `evil01` (the good–evil malice axis) and `chaos01` (the law–chaos disorder axis),
 * each centered so `neutral` (and a legacy/absent axis) reads exactly 0.5 — the
 * no-signal midpoint. These are the owner-named `evil01` / `chaos01` the W-F3
 * amplified-site table consumes.
 *
 * `deriveTemper` is the axis-integration DERIVATION: warlike/peacelike/neutral is
 * no longer an independent stored axis — it falls out of the two alignment axes
 * (evil + chaos push warlike; good + law push peacelike; the neutral core reads
 * neutral). `deityTemper` is the read-time SHIM every temper reader now routes
 * through: for an EXISTING deity (one that carries a stored temperamentAxis — every
 * deity today) it returns that value VERBATIM, so this wave is byte-identical; only
 * a DERIVED-only deity (no stored axis; W-F4/W-F5) actually runs the derivation.
 *
 * (Homed in worldPulse rather than the domain/deityConstants leaf so the W-F2 diff
 * stays clear of that leaf's edge-function bundle; corruption.js can still import it
 * without a cycle — this leaf imports nothing.)
 */

/** @type {Record<string, number>} */
const EVIL01 = Object.freeze({ evil: 1, neutral: 0.5, good: 0 });
/** @type {Record<string, number>} */
const CHAOS01 = Object.freeze({ chaotic: 1, neutral: 0.5, lawful: 0 });

/**
 * The 0..1 malice coordinate of a deity's alignment axis: evil 1 · neutral 0.5 ·
 * good 0. A legacy/absent alignmentAxis reads neutral (0.5). Pure.
 * @param {{ alignmentAxis?: string } | null} [deity]
 * @returns {number}
 */
export function evil01(deity) {
  return EVIL01[String(deity?.alignmentAxis ?? 'neutral')] ?? 0.5;
}

/**
 * The 0..1 disorder coordinate of a deity's law axis: chaotic 1 · neutral 0.5 ·
 * lawful 0. A legacy/absent lawAxis reads neutral (0.5) — the lawAxis-absence ⇒
 * neutral back-compat discipline. Pure.
 * @param {{ lawAxis?: string } | null} [deity]
 * @returns {number}
 */
export function chaos01(deity) {
  return CHAOS01[String(deity?.lawAxis ?? 'neutral')] ?? 0.5;
}

// Weights for the intrinsic-temper derivation. Intent (good–evil) dominates the
// niche-grid temper; chaos adds belligerence (method); a dead-band around the
// neutral core reads 'neutral'. INERT this wave — the shim returns stored values
// for every existing deity — so these tune only DERIVED-only deities (W-F4/W-F5).
export const TEMPER_DERIVATION = Object.freeze({
  W_EVIL: 0.7,      // evil ⇒ warlike, good ⇒ peacelike (intent leads intrinsic temper)
  W_CHAOS: 0.3,     // chaos adds belligerence; lawful order is calmer
  THRESHOLD: 0.15,  // dead-band half-width around the neutral core ⇒ 'neutral'
});

/**
 * Derive an intrinsic temperament ('warlike' | 'peacelike' | 'neutral') from the
 * two 0..1 alignment coordinates (the spec's alignment01 / law01, i.e. evil01 /
 * chaos01) — the niche-grid temper for a DERIVED-only deity. `context` is reserved
 * for W-F4/W-F5 culture/terrain affinity biasing and is ignored this wave. Pure.
 * @param {number} evilCoord   0 good … 1 evil (the evil01 coordinate)
 * @param {number} chaosCoord  0 lawful … 1 chaotic (the chaos01 coordinate)
 * @param {unknown} [context]  reserved (affinity biasing) — ignored this wave
 * @returns {'warlike' | 'peacelike' | 'neutral'}
 */
export function deriveTemper(evilCoord, chaosCoord, context) {
  void context;
  const { W_EVIL, W_CHAOS, THRESHOLD } = TEMPER_DERIVATION;
  const score = W_EVIL * (evilCoord - 0.5) + W_CHAOS * (chaosCoord - 0.5);
  if (score > THRESHOLD) return 'warlike';
  if (score < -THRESHOLD) return 'peacelike';
  return 'neutral';
}

/**
 * The READ-TIME temperament shim. For an EXISTING deity (one carrying a stored
 * temperamentAxis — every deity today) returns that value VERBATIM, so every
 * temper reader is byte-identical this wave; for a DERIVED-only deity (no stored
 * axis; W-F4/W-F5) derives it from the two alignment axes. A null/absent deity ⇒
 * undefined (the callers' pre-existing neutral fallback). Pure.
 * @param {{ temperamentAxis?: string, alignmentAxis?: string, lawAxis?: string } | null} [deity]
 * @returns {string | undefined}
 */
export function deityTemper(deity) {
  if (!deity) return undefined;
  if (deity.temperamentAxis != null) return deity.temperamentAxis;
  return deriveTemper(evil01(deity), chaos01(deity));
}
