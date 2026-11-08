/**
 * instantWorld/factionDedup.js — the faction-name DE-CLUNK GUARD (the candidate space).
 *
 * THE DEDUP IS DELETED (the people car, PEOPLE-5A, 2026-11-07; the chair's ruling M-2): the
 * world-scoped pass renamed the NPC grouping's minted names (`settlement.factions[].name`), and
 * since GS-2 every group was named for one of its own powers — which the pass never renamed — so
 * on every composed world it was a no-op; the grouping itself leaves with the landing. The powers'
 * names are fixed archetype labels every town may share. What stays is the de-clunk guard over the
 * candidate space (candidateNames, hasBannedStack), which the arcane identity reads.
 *
 * HISTORY (the pass as it was):
 *
 * The survey's worst content-thinness surface: FACTION_DESCRIPTORS dedup is
 * settlement-LOCAL only (factionGrouping.js builds usedNames from one settlement's own
 * factions), so a realm of N settlements collides almost immediately — many towns each
 * name a faction "The Trade Compact", and the chronicle then shows identical faction
 * names on opposite sides of an inter-settlement conflict. The survey's recommended fix
 * is a world-scoped dedupe registry, NOT more names.
 *
 * This is that registry, as a PURE, rng-FREE post-pass over an already-composed world
 * bundle. Per-settlement generation is left completely untouched (byte-identical, zero
 * rng-stream perturbation, zero generator-golden shift) — the pass runs only after the
 * members are minted and renames CROSS-settlement collisions deterministically. The
 * FACTION_DESCRIPTORS names live only in settlement.factions[].name and the conflicts
 * fields (parties / desc / plotHooks, plus their powerStructure mirror); the dossier
 * prose (pressureSentence, arrivalScene) uses the shared power-ROLE archetype names
 * (powerStructure.factions[].faction), never these, so a rename cannot desync prose.
 *
 * Determinism: the ordering (by slot, then id) and the fnv-hashed candidate probe are
 * pure functions of the composed bundle, so same (seed, knobs) → same renames → the
 * instantWorldFingerprint determinism pin holds (its VALUE shifts once — a parked golden
 * that regenerates with everything else at the ONE REGEN).
 */

import { FACTION_DESCRIPTORS, FACTION_DESCRIPTORS_EXTRA } from '../../data/powerData.js';

// ── AMENDMENT A — THE FACTION DE-CLUNK RULE ──────────────────────────────────
// The old strategy stacked a collective-noun SUFFIX onto a reused base descriptor
// ("The Commercial Circle Inner Circle", "The Free Alliance Coalition", "The Devout
// Circle League"). Two clunk classes: a repeated collective noun (Circle…Circle) and
// a doubled collective/honorific (Alliance + Coalition). The rework:
//   1. DESCRIPTOR-SWAP FIRST — draw a DIFFERENT clean base from a WIDENED same-category
//      pool. This resolves almost every realistic collision with a whole, distinct name.
//   2. A distinguishing PREFIX MODIFIER (adjectival, NEVER a collective noun) only as a
//      last resort, when every clean base in the category is already used world-wide.
//      A prefix adjective cannot stack a second org-noun, so the two clunk classes are
//      STRUCTURALLY IMPOSSIBLE — proved by the banned-stack guard over the whole space.
//   3. A numeric disambiguator only if even that is exhausted (never, for any realm).
//
// The widened pool is DEDUP-ONLY and is never merged into powerData.FACTION_DESCRIPTORS:
// generateFactions draws per-settlement names from that shared table through a draw-count-
// VARIABLE retry loop, so widening it would perturb the per-settlement rng stream and
// cascade the generator golden. This pass is rng-free and runs only on the composed
// bundle, so these extras touch nothing in per-settlement generation.
//
// MG-3h moved the CONSTANT to src/data/powerData.js (beside the pool it widens) and
// re-exports it here for every existing consumer. The reason is single-source: the
// authored category key IS the arcane tag, and domain/arcaneIdentity.js — the canonical
// detector under chair ruling R-BLD-5 — must read the same authored table rather than
// re-guessing "The Tower Union" from a name regex. Nothing about the pool changed.
export { FACTION_DESCRIPTORS_EXTRA } from '../../data/powerData.js';

// Collective/organisational nouns — the tokens a faction name ends on. Two of these in
// the ADDED disambiguation is the clunk the amendment forbids; a MODIFIER is never one.
export const COLLECTIVE_NOUNS = Object.freeze(new Set([
  'Alliance', 'Coalition', 'Bloc', 'Combine', 'League', 'Compact', 'Circle', 'Concord',
  'Council', 'Assembly', 'Guild', 'Union', 'Order', 'Consortium', 'Congress', 'Chamber',
  'Syndicate', 'Front', 'Board', 'Company', 'Conclave', 'Ring', 'Cartel',
]));

// Distinguishing prefixes: strictly ADJECTIVAL (none is a collective noun, asserted by a
// test), so `${MOD} ${base}` adds no second org-noun and reads as a real faction name.
export const DISTINGUISH_MODIFIERS = Object.freeze([
  'Greater', 'Elder', 'United', 'Reformed', 'Grand', 'Old', 'New', 'Lesser',
  'Lower', 'Upper', 'Second', 'Third', 'Northern', 'Southern', 'Eastern', 'Western',
]);

/** The widened, dedup-only clean-base pool for a category. Pure. @param {string} c */
function basePool(c) {
  return [...(FACTION_DESCRIPTORS[c] || FACTION_DESCRIPTORS.other), ...(FACTION_DESCRIPTORS_EXTRA[c] || [])];
}

/**
 * THE BANNED-STACK GUARD. A name is banned iff it has an adjacent duplicate word
 * ("Circle Circle") OR any single collective noun appears more than once ("… Circle …
 * Circle"). Base descriptors carrying two DISTINCT collectives ("The Guild Alliance",
 * "The Order of the Watch") are legitimate and pass. Because every disambiguation adds
 * only an adjectival prefix (no collective), the doubled-collective clunk
 * ("Alliance Coalition") can never be minted — a test asserts the whole candidate space
 * (bases ∪ modifier×base) is guard-clean. @param {string} name @returns {boolean}
 */
export function hasBannedStack(name) {
  const toks = String(name).replace(/^The\s+/i, '').split(/\s+/);
  for (let i = 0; i < toks.length - 1; i += 1) if (toks[i] === toks[i + 1]) return true;
  const seen = new Map();
  for (const t of toks) {
    if (!COLLECTIVE_NOUNS.has(t)) continue;
    const n = (seen.get(t) || 0) + 1;
    if (n > 1) return true;
    seen.set(t, n);
  }
  return false;
}

/**
 * The full deterministic candidate space for a category, in priority order: the widened
 * clean bases first (SWAP), then guard-clean `${modifier} ${base}` combos (last resort).
 * Pure. Exported for the de-clunk guard test. @param {string} category @returns {string[]}
 */
export function candidateNames(category) {
  const bases = basePool(category);
  const out = [...bases];
  for (const mod of DISTINGUISH_MODIFIERS) {
    for (const b of bases) {
      const name = `The ${mod} ${b.replace(/^The\s+/i, '')}`;
      if (!hasBannedStack(name)) out.push(name);
    }
  }
  return out;
}

