/**
 * instantWorld/factionDedup.js — WORLD-SCOPED faction-name de-duplication.
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
import { fnv1a32 } from '../../kernel/proseHash.js';
import { compareCodepoint } from '../../domain/deterministicSort.js';

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

/**
 * Pick a world-unique name for a collided faction: fnv-hash a stable seed to a start
 * index, then probe deterministically for the first candidate not yet used world-wide.
 * The candidate ORDER (clean bases, then modifier combos) makes a descriptor SWAP win
 * over any suffix/modifier form whenever a clean base is free. Numeric disambiguator only
 * if the whole (bases × modifiers) space is exhausted — impossible for any realistic
 * realm. Pure (no rng). @param {string} category @param {Set<string>} used @param {string} seed
 */
function pickUniqueName(category, used, seed) {
  const bases = basePool(category);
  // Hash to a start index WITHIN the clean-base band so the swap is seed-varied but
  // still always prefers a whole distinct base before any modifier form.
  const baseStart = fnv1a32(seed) % bases.length;
  for (let i = 0; i < bases.length; i += 1) {
    const name = bases[(baseStart + i) % bases.length];
    if (!used.has(name)) return name;
  }
  // All clean bases used world-wide → walk the guard-clean modifier combos (built lazily,
  // only when the whole clean-base pool is spent — the rare last-resort path).
  const cands = candidateNames(category);
  const modStart = fnv1a32(`${seed}::mod`) % cands.length;
  for (let i = 0; i < cands.length; i += 1) {
    const name = cands[(modStart + i) % cands.length];
    if (!used.has(name)) return name;
  }
  let n = 2;
  let name;
  do { name = `${bases[baseStart]} ${n}`; n += 1; } while (used.has(name));
  return name;
}

/** Exact-phrase substring replace in a string leaf, applying every (old→new) in the map. */
const replacePhrase = (s, renameMap) => {
  if (typeof s !== 'string') return s;
  let out = s;
  for (const [oldName, newName] of renameMap) if (out.includes(oldName)) out = out.split(oldName).join(newName);
  return out;
};

/**
 * Apply a settlement's (oldName → newName) rename map to its conflict references — the
 * ONLY fields besides factions[].name that hold a FACTION_DESCRIPTORS name (parties exact,
 * desc/plotHooks embedded), both top-level and the powerStructure mirror. Targeted rather
 * than a deep walk: the settlement carries frozen leaves (deity refs) a blind walk would
 * choke on, and the dossier PROSE uses the shared power-ROLE archetype names, never these.
 * Replaces the holder objects (not their frozen properties) so it is safe over frozen
 * sub-trees. @param {any} settlement @param {Map<string,string>} renameMap
 */
function applyConflictRenames(settlement, renameMap) {
  if (!settlement || typeof settlement !== 'object' || renameMap.size === 0) return;
  const renameConflicts = (conflicts) => (Array.isArray(conflicts)
    ? conflicts.map((c) => {
      if (!c || typeof c !== 'object') return c;
      return {
        ...c,
        parties: Array.isArray(c.parties) ? c.parties.map((p) => renameMap.get(p) ?? p) : c.parties,
        desc: replacePhrase(c.desc, renameMap),
        plotHooks: Array.isArray(c.plotHooks) ? c.plotHooks.map((h) => replacePhrase(h, renameMap)) : c.plotHooks,
      };
    })
    : conflicts);
  if (settlement.conflicts) settlement.conflicts = renameConflicts(settlement.conflicts);
  if (settlement.powerStructure && settlement.powerStructure.conflicts) {
    settlement.powerStructure = { ...settlement.powerStructure, conflicts: renameConflicts(settlement.powerStructure.conflicts) };
  }
}

/**
 * De-duplicate faction names across the members of a composed world, in place. The first
 * settlement (by stable order) to use a name keeps it; every later collision is renamed to
 * a world-unique, same-category descriptor. Returns the rename ledger (for tests / trace).
 * @param {Array<{ id?: any, _slot?: number, settlement?: any }>} members
 * @returns {Array<{ member: any, from: string, to: string }>}
 */
export function dedupeWorldFactionNames(members) {
  if (!Array.isArray(members) || members.length === 0) return [];
  const ordered = [...members].sort(
    // _slot is the primary order (composeInstantWorld stamps a unique _slot per site,
    // so the tie-break is normally dead); the id tie-break uses codepoint order — never
    // localeCompare — so a rename decision can never depend on host locale. Byte-identical
    // on the live path (unique slots ⇒ tie-break never fires), removes the armed hazard.
    (a, b) => (a?._slot ?? 0) - (b?._slot ?? 0) || compareCodepoint(a?.id, b?.id),
  );
  const used = new Set();
  const renames = [];
  for (const m of ordered) {
    const s = m?.settlement;
    if (!s || !Array.isArray(s.factions)) continue;
    // Rename by IDENTITY (per array position), not by name-match: a settlement can carry
    // two factions with the SAME local name (local dedup caps out), and a name-match rename
    // would collapse both to one string. The index in the seed guarantees two same-named
    // factions get DIFFERENT new names; pickUniqueName's `used` probe keeps them world-unique.
    const renameMap = new Map();
    s.factions = s.factions.map((f, i) => {
      if (!f || typeof f.name !== 'string' || !f.name) return f;
      if (!used.has(f.name)) { used.add(f.name); return f; }
      const category = f.category || f.dominantCategory || 'other';
      const newName = pickUniqueName(category, used, `${m.id}:${m._slot}:${i}:${f.name}:${category}`);
      used.add(newName);
      renameMap.set(f.name, newName); // for conflict refs (last wins on the rare intra-dup)
      renames.push({ member: m.id, from: f.name, to: newName });
      return { ...f, name: newName };
    });
    applyConflictRenames(s, renameMap);
  }
  return renames;
}
