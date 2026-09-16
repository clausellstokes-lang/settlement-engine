/**
 * domain/worldPulse/grievanceRead.js — THE MEMORY WEAVE substrate read (D-7a).
 *
 * A pure, flag-free read leaf that scores a settlement pair's edge from the
 * ORGANIC relationship-memory substrate — `resentment`, the decayed
 * `memoryScore`, and the typed decade-clock `recentIncidents` — NEVER the coarse
 * ten-value relationship rung. It clones the warReasons.scoreGrievance /
 * scoreRevanchism template (warReasons.js:425 / :443) into a leaf the
 * contested-goals class (D-4 tunnel-vision fixation + contest-salience) reads,
 * WITHOUT coupling to the war layer: the war scorers keep their own dials and
 * their own wound set; this leaf owns the memory-weave read and extends the
 * wound set to catch the ghost-event incidents (route_seized / rite_imposed).
 *
 * PURE / DORMANCY-NEUTRAL: zero writes, zero flag. A pure read cannot move a
 * golden — the memoryWeaveEnabled gate lives at the CONSUMER (the ghost wirings,
 * the fixation term), never here. Every input is read defensively (absent ⇒ 0),
 * so a pre-fold world with no typed incidents scores every pair 0 vacuously.
 *
 * @enforced-by tests/domain/grievanceRead.test.js
 */
import { clamp01 } from '../../kernel/math.js';

// The fixation read's own dial. Mirrors warReasons.REASON_TUNING's grievance /
// revanchism weights by construction (the clone), but is DELIBERATELY
// independent — the war layer tunes casus-belli; this tunes personal fixation,
// and the two must be free to diverge without a cross-file coupling.
export const GRIEVANCE_READ_TUNING = Object.freeze({
  // scoreGrievance clone: fresh resentment blended with decayed incident memory.
  GRIEVANCE_RESENTMENT_W: 0.65,
  GRIEVANCE_MEMORY_W: 0.35,
  // scoreRevanchism clone: OLD typed wounds under a live grudge (the decade clock).
  REVANCHISM_MIN_AGE_TICKS: 8,
  REVANCHISM_PER_WOUND: 0.35,
  REVANCHISM_RESENTMENT_FLOOR: 0.2,
  // The blend of the two components into the single 0..1 fixation lean the
  // D-4 formula multiplies (§8 tunnel-vision: `+ 0.3 × grievanceLean`). The
  // revanchism bonus rides ON TOP of grievance (an old wound deepens fixation),
  // bounded so a maximally-grieved pair still reads ≤ 1.
  REVANCHISM_LEAN_BONUS: 0.4,
});

// The typed-incident wound set for the memory-weave revanchism clone. It is the
// war layer's set (war | betray | tribute | conquest | occupation | sack | raid)
// EXTENDED to catch the ghost-event marks D-7b mints — route_seized ⇒ /seiz/,
// rite_imposed ⇒ /impos/, and any future imposition/seizure incident — plus
// contest_loss (the D-4c aftermath grudge feeds fixation of the next contest).
// A separate leaf regex, so the war scorer stays byte-identical.
const WOUND_TYPE_RE = /war|betray|tribute|conquest|occupation|sack|raid|seiz|impos|contest_loss|contest_forestalled/i;

/**
 * The GRIEVANCE component (scoreGrievance clone): fresh resentment blended with
 * the decayed incident memoryScore, both already 0..1 on the edge state.
 * @param {{ resentment?: number, memoryScore?: number } | null | undefined} relState
 * @returns {number} 0..1
 */
export function scoreGrievanceLean(relState) {
  const resentment = clamp01(Number(relState?.resentment) || 0);
  const memory = clamp01(Number(relState?.memoryScore) || 0);
  return clamp01(
    GRIEVANCE_READ_TUNING.GRIEVANCE_RESENTMENT_W * resentment
    + GRIEVANCE_READ_TUNING.GRIEVANCE_MEMORY_W * memory,
  );
}

/**
 * The REVANCHISM component (scoreRevanchism clone, the decade clock): OLD typed
 * wounds still held under a live grudge. Counts wound-typed incidents at least
 * REVANCHISM_MIN_AGE_TICKS old; requires a resentment floor (no grudge, no
 * revanche). Returns a normalized 0..1 (wounds × per-wound, gated by resentment).
 * @param {{ resentment?: number, recentIncidents?: Array<{ type?: string, tick?: number }> } | null | undefined} relState
 * @param {number} tick
 * @returns {number} 0..1
 */
export function scoreRevanchismLean(relState, tick) {
  const resentment = clamp01(Number(relState?.resentment) || 0);
  if (resentment < GRIEVANCE_READ_TUNING.REVANCHISM_RESENTMENT_FLOOR) return 0;
  const incidents = Array.isArray(relState?.recentIncidents) ? relState.recentIncidents : [];
  const now = Number(tick);
  if (!Number.isFinite(now)) return 0;
  let wounds = 0;
  for (const inc of incidents) {
    if (!WOUND_TYPE_RE.test(String(inc?.type || ''))) continue;
    const at = Number(inc?.tick);
    if (!Number.isFinite(at)) continue;
    if (now - at >= GRIEVANCE_READ_TUNING.REVANCHISM_MIN_AGE_TICKS) wounds += 1;
  }
  if (wounds === 0) return 0;
  return clamp01(wounds * GRIEVANCE_READ_TUNING.REVANCHISM_PER_WOUND) * resentment;
}

/**
 * THE GRIEVANCE LEAN (D-4 fixation term): a single 0..1 read of how much a pair's
 * organic history should bias a contestant toward fixating on THIS rival — the
 * grievance component with a bounded revanchism bonus on top (an old, still-held
 * wound deepens the fixation beyond fresh resentment alone). Pure; NEVER the
 * coarse rung. Absent/undefined edge ⇒ 0 (a pair with no history stays rational).
 * @param {{ resentment?: number, memoryScore?: number, recentIncidents?: Array<{ type?: string, tick?: number }> } | null | undefined} relState
 * @param {number} tick
 * @returns {number} 0..1
 */
export function grievanceLean(relState, tick) {
  if (!relState || typeof relState !== 'object') return 0;
  const grievance = scoreGrievanceLean(relState);
  const revanchism = scoreRevanchismLean(relState, tick);
  return clamp01(grievance + GRIEVANCE_READ_TUNING.REVANCHISM_LEAN_BONUS * revanchism);
}

// The downward (flavor) bias magnitude — how far a hostile / warm settlement pair skews
// cross-border ELITE bond vs grudge formation (D-7f). Centered on 1; bounded.
const DISPOSITION_SKEW = 0.5;

/**
 * D-7f DOWNWARD FLAVOR: the settlement-pair disposition biasing cross-border formation
 * events. Reads the pair's edge (trust vs resentment) and returns multipliers centered on
 * 1.0: a HOSTILE pair (resentment > trust) DAMPENS elite bond formation and AMPLIFIES grudge
 * formation (suspicion); a WARM / trade pair does the reverse (merchant bonds ease). A neutral
 * or absent edge ⇒ { bondMult: 1, grudgeMult: 1 } (byte-identical — no bias). Pure.
 * @param {{ trust?: number, resentment?: number } | null | undefined} relState
 * @returns {{ bondMult: number, grudgeMult: number }}
 */
export function dispositionOf(relState) {
  if (!relState || typeof relState !== 'object') return { bondMult: 1, grudgeMult: 1 };
  const trust = clamp01(Number(relState.trust) || 0);
  const resentment = clamp01(Number(relState.resentment) || 0);
  const lean = trust - resentment; // −1 (hostile) .. +1 (warm)
  return {
    bondMult: Math.max(0, 1 + DISPOSITION_SKEW * lean),   // warm ⇒ >1 (bonds ease); hostile ⇒ <1
    grudgeMult: Math.max(0, 1 - DISPOSITION_SKEW * lean), // hostile ⇒ >1 (suspicion); warm ⇒ <1
  };
}
