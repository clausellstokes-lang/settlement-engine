/**
 * lib/galleryAliveness.js — the gallery ALIVENESS score (GALLERY-2 phase 2,
 * owner-signed 2026-07-17).
 *
 * "Most alive" ranks shared worlds by how much LIVING has actually happened in
 * them: a settlement published out of a deeply-simulated campaign (many pulses
 * run, seasons of world-time elapsed) outranks a fresh generate-and-share. The
 * score is a publish-time SNAPSHOT — exactly like gallery_facet_at_war — because
 * it reads the owning campaign's live worldState, which the gallery row cannot
 * recompute on its own. Rows shared before the score existed read null (the
 * owner re-shares to stamp it), mirroring at_war's backfill posture (063).
 *
 * THE FORMULA (JUDGMENT — the exact numbers are vetoable):
 *
 *   aliveness = round(100 · (0.7 · depthScore + 0.3 · ageScore))    ∈ [0, 100]
 *
 *   depthScore = min(pulseHistory.length, 80) / 80
 *     — pulse-history depth is the DOMINANT term (0.7): each retained pulse is
 *       a real simulation beat the owner ran. 80 is MAX_HISTORY (worldState.js)
 *       — the retention cap IS the saturation point, so a fully-lived history
 *       maxes the term honestly rather than against an invented constant.
 *
 *   ageScore = the world's age band (ageBandForElapsed over calendar
 *   elapsedWeeks, falling back to worldState.tick — tick == week), mapped:
 *       this-week 0.15 · this-month 0.35 · this-season 0.60 ·
 *       this-year 0.85 · years-past 1.00
 *     — world age contributes MILDLY (0.3): it distinguishes a long-lived world
 *       whose pulse history has rolled off (the cap keeps only the last 80) from
 *       a young one, without letting idle calendar age outrank actual play.
 *       The ladder rides the canonical AGE_BANDS boundaries (4/13/52 weeks) —
 *       never hardcoded arithmetic (the ageBands.js owner rule).
 *
 * Anchors: fresh canonized world (0 pulses, week 1) ≈ 5. A year of steady play
 * with a full 80-pulse history ≈ 96. Only a years-past world with a saturated
 * history reads 100.
 *
 * PURE leaf: imports only domain/ageBands.js (itself a pure leaf). Deterministic
 * — no wall-clock, no rng. Shared by BOTH publish paths (ShareToGallery's
 * settlement facets and galleryMapsUtils' campaign facets) so the two snapshots
 * can never diverge.
 */

import { ageBandForElapsed } from '../domain/ageBands.js';

/** MAX_HISTORY (worldState.js pulseHistory retention cap) — the depth saturation
 *  point. Pinned equal to the worldState cap by tests/lib/galleryAliveness.test.js
 *  (not imported: worldState would drag the engine into every gallery chunk). */
export const ALIVENESS_DEPTH_CAP = 80;

/** The weighting (JUDGMENT): history depth dominates; world age is the mild term. */
export const ALIVENESS_WEIGHTS = Object.freeze({ depth: 0.7, age: 0.3 });

/** Age-band id → maturity score. Every AGE_BANDS id has an entry (pinned). */
export const ALIVENESS_AGE_SCORES = Object.freeze({
  'this-week': 0.15,
  'this-month': 0.35,
  'this-season': 0.6,
  'this-year': 0.85,
  'years-past': 1.0,
});

/**
 * THE ONE null-safe clamp for aliveness values, shared by every read/write/
 * render site. The habitat this removes: `Number(null)` coerces to 0, so any
 * site clamping with a bare Number() smears "unknown" (null) into "provably
 * lifeless" (0) — the same bug shape appeared three times while building the
 * feature (write patch, read sanitizer, badge). All sites now route here.
 * @param {unknown} value
 * @returns {number | null} an integer 0–100, or null for null/undefined/non-finite
 */
export function clampAliveness(value) {
  if (value === null || value === undefined) return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.max(0, Math.min(100, Math.round(n)));
}

/**
 * The aliveness score of an owning campaign, 0–100, or null when there is no
 * campaign (an un-owned / never-simulated settlement has no liveness to claim —
 * the column stays null, exactly like at_war's "cannot recompute" posture).
 *
 * @param {{ worldState?: { pulseHistory?: unknown[], tick?: number,
 *   calendar?: { elapsedWeeks?: number } } } | null | undefined} campaign
 * @returns {number | null}
 */
export function computeAliveness(campaign) {
  const ws = campaign?.worldState;
  if (!ws || typeof ws !== 'object') return null;
  const depth = Array.isArray(ws.pulseHistory) ? ws.pulseHistory.length : 0;
  const depthScore = Math.min(Math.max(depth, 0), ALIVENESS_DEPTH_CAP) / ALIVENESS_DEPTH_CAP;
  // calendar.elapsedWeeks is the canonical clock; tick (== week) is the
  // normalized fallback for a drifted/legacy worldState shape.
  const elapsedRaw = Number(ws.calendar?.elapsedWeeks);
  const elapsed = Number.isFinite(elapsedRaw) ? elapsedRaw : Number(ws.tick) || 0;
  const ageScore = ALIVENESS_AGE_SCORES[ageBandForElapsed(elapsed)] ?? 0;
  return Math.round(100 * (ALIVENESS_WEIGHTS.depth * depthScore + ALIVENESS_WEIGHTS.age * ageScore));
}

/**
 * The world-age band id of an owning campaign (the Campaigns-tab card facet),
 * or null when there is no campaign/worldState.
 * @param {{ worldState?: { tick?: number, calendar?: { elapsedWeeks?: number } } } | null | undefined} campaign
 * @returns {string | null}
 */
export function campaignWorldAgeBand(campaign) {
  const ws = campaign?.worldState;
  if (!ws || typeof ws !== 'object') return null;
  const elapsedRaw = Number(ws.calendar?.elapsedWeeks);
  const elapsed = Number.isFinite(elapsedRaw) ? elapsedRaw : Number(ws.tick) || 0;
  return ageBandForElapsed(elapsed);
}
