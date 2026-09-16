/**
 * domain/display/npcInteriorityRead.js — INTERIORITY-LITE (DESIGN_VISION_WAVE V-24c).
 *
 * A PURE derived "disposition & wants" projection per named NPC, composed ENTIRELY from state
 * that already exists — goals, traits, and standing (player-safe), plus, for the DM, bonds,
 * grudges, and credibility drawn from the engine sidecar. It is a READ-MODEL, never new state:
 * the DM sees who wants what and how they are disposed; the engine stores NOTHING new. (This is
 * the ratified honest form of the old "inner lives" seed — a full inner-life simulation would
 * violate the world-only / simplicity boundary; this composes a display projection instead.)
 *
 * SECRETS-SEAM-SAFE: the DM-truth block (bonds / grudges / credibility / covert marks) is gated
 * behind `includeGroundTruth`. A non-DM audience receives ONLY the player-safe disposition &
 * wants — never a covert mark, a hidden bond, or a private grudge. Callers on a shared/gallery
 * surface pass includeGroundTruth=false (or omit it — it defaults to hidden, fail-closed).
 *
 * PRESENTATION ONLY. Pure; no store, no rng, no wall clock; ZERO persisted writes (it only
 * reads); inert-not-crash on absent/garbage inputs; every list codepoint-stable. Lazy display
 * leaf — byte-inert to the engine and its goldens.
 */

import { compareCodepoint } from '../deterministicSort.js';
import { getSpatialLedger, hasSpatialLedger } from '../spatial/distanceRead.js';
import { strongestBond, bondedPeersAbove } from '../worldPulse/npcLadderState.js';
import { npcCredibilityScoreOf, hasNpcCredibilityLedger } from '../worldPulse/npcCredibility.js';

/** The display NPC's own coarse standing signal → a stance word. */
const INFLUENCE_WORD = Object.freeze({ high: 'commanding', moderate: 'established', low: 'marginal' });

/** @param {unknown} v @returns {boolean} */
function nonEmpty(v) { return typeof v === 'string' && v.trim().length > 0; }

/** First non-empty string among the candidates (unwrapping a { short } goal object). Pure.
 *  @param {...unknown} vals @returns {string|null} */
function firstText(...vals) {
  for (const v of vals) {
    if (nonEmpty(v)) return /** @type {string} */ (v).trim();
    if (v && typeof v === 'object' && nonEmpty(/** @type {{ short?: unknown }} */ (v).short)) {
      return String(/** @type {{ short: unknown }} */ (v).short).trim();
    }
  }
  return null;
}

/** Dedupe (case-insensitive) while preserving first-seen order. @param {(string|null)[]} xs @returns {string[]} */
function dedupe(xs) {
  const seen = new Set();
  /** @type {string[]} */
  const out = [];
  for (const x of xs) {
    if (!nonEmpty(x)) continue;
    const k = /** @type {string} */ (x).toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(/** @type {string} */ (x));
  }
  return out;
}

/** A credibility band word from a signed score (0 = neutral). Pure. @param {number} score @returns {string} */
export function npcCredibilityWord(score) {
  const s = typeof score === 'number' && Number.isFinite(score) ? score : 0;
  if (s >= 4) return 'trusted';
  if (s <= -4) return 'doubted';
  return 'even';
}

/**
 * The DM-truth relational block for one NPC, read from the engine sidecar. Bonds/grudges/
 * credibility live in worldState.spatialLedgers (npcLadder / npcCredibility) — DM truth by
 * construction (the display mirror deliberately drops them). Returns null when there is no
 * sidecar or no record for `nid`. Pure; read-only.
 * @param {unknown} worldState @param {string} nid @param {number} tick
 * @returns {{ bonds: Array<{ nid: string, kind: string, sev: number }>, grudges: Array<{ nid: string, kind: string, sev: number }>, credibility: { score: number, band: string } | null } | null}
 */
function relationalGroundTruth(worldState, nid, tick) {
  if (!nid) return null;
  const ws = /** @type {Record<string, unknown>} */ (worldState);
  /** @type {Array<{ nid: string, kind: string, sev: number }>} */
  let bonds = [];
  /** @type {Array<{ nid: string, kind: string, sev: number }>} */
  let grudges = [];
  if (hasSpatialLedger(ws, 'npcLadder')) {
    const ladder = /** @type {{ npcs?: Record<string, unknown> } | null} */ (getSpatialLedger(ws, 'npcLadder'));
    const st = ladder && ladder.npcs ? /** @type {import('../worldPulse/npcLadderKernel.js').LadderStanding} */ (ladder.npcs[nid]) : null;
    if (st) {
      const strongest = strongestBond(st);
      // The full bonded set (strongest-first); strongestBond is the headline, kept in the list.
      bonds = bondedPeersAbove(st, 0);
      if (strongest && !bonds.length) bonds = [strongest];
      const g = /** @type {Record<string, { sev?: number, kind?: string }>} */ (/** @type {{ grudges?: unknown }} */ (st).grudges || {});
      grudges = Object.keys(g).sort(compareCodepoint).map((to) => ({
        nid: to, kind: typeof g[to]?.kind === 'string' ? String(g[to].kind) : 'grudge',
        sev: typeof g[to]?.sev === 'number' && Number.isFinite(g[to].sev) ? Number(g[to].sev) : 0,
      }));
    }
  }
  /** @type {{ score: number, band: string } | null} */
  let credibility = null;
  if (hasNpcCredibilityLedger(ws)) {
    const score = npcCredibilityScoreOf(ws, nid, Number(tick) || 0);
    if (typeof score === 'number' && Number.isFinite(score) && score !== 0) {
      credibility = { score, band: npcCredibilityWord(score) };
    }
  }
  if (!bonds.length && !grudges.length && !credibility) return null;
  return { bonds, grudges, credibility };
}

/**
 * The "disposition & wants" projection for ONE named NPC. Player-safe by default; the DM-truth
 * block is added only when includeGroundTruth is true (secrets-seam-safe). Returns null when the
 * NPC yields nothing to show. Pure; read-only; inert on garbage.
 * @param {Object} args
 * @param {Record<string, unknown>} args.npc  the display NPC object
 * @param {unknown} [args.worldState]  the engine sidecar source (DM-truth bonds/grudges/credibility)
 * @param {string} [args.nid]  the NPC's ladder id (needed for the sidecar reads)
 * @param {number} [args.tick]  current tick (credibility decay)
 * @param {boolean} [args.includeGroundTruth]  DM view ⇒ true (covert + relational truth)
 * @returns {{ present: boolean, wants: string[], disposition: string[], groundTruth?: Record<string, unknown> } | null}
 */
export function npcInteriority({ npc, worldState, nid, tick = 0, includeGroundTruth = false } = /** @type {never} */ ({})) {
  const n = npc && typeof npc === 'object' ? /** @type {Record<string, unknown>} */ (npc) : null;
  if (!n) return null;
  const p = /** @type {Record<string, unknown>} */ (n.personality && typeof n.personality === 'object' && !Array.isArray(n.personality) ? n.personality : {});

  // WANTS (player-safe): the NPC's visible ambition — its goal, ambition, and ideal.
  const wants = dedupe([
    firstText(n.goal, n.goals),
    firstText(p.ambition, p.ambitions, n.ambition, n.ambitions),
    firstText(p.ideal, p.ideals, n.ideal, n.ideals),
  ]);

  // DISPOSITION (player-safe): the NPC's visible stance — temperament, standing, loyalty, fear.
  const disposition = dedupe([
    firstText(p.dominant, n.temperament),
    (/** @type {Record<string, string>} */ (INFLUENCE_WORD))[String(n.influence)] || null,
    firstText(n.loyalty, n.loyalties),
    firstText(n.fear, n.fears),
  ]);

  /** @type {{ present: boolean, wants: string[], disposition: string[], groundTruth?: Record<string, unknown> }} */
  const out = { present: wants.length > 0 || disposition.length > 0, wants, disposition };

  if (includeGroundTruth) {
    // COVERT / DM-only marks (never surfaced to a non-DM audience): the compromise stance + the
    // gm secret, plus the relational truth (bonds / grudges / credibility) from the sidecar.
    const compromised = n.corrupt ? 'compromised' : (n.ousted ? 'exposed' : null);
    const secretRaw = typeof n.secret === 'string' ? n.secret : firstText(/** @type {{ what?: unknown }} */ (n.secret || {}).what);
    const relational = relationalGroundTruth(worldState, String(nid || ''), tick);
    /** @type {Record<string, unknown>} */
    const gt = {};
    if (compromised) gt.compromised = compromised;
    if (nonEmpty(secretRaw)) gt.secret = /** @type {string} */ (secretRaw).trim();
    if (relational) Object.assign(gt, relational);
    if (Object.keys(gt).length) { out.groundTruth = gt; out.present = true; }
  }

  return out.present ? out : null;
}
