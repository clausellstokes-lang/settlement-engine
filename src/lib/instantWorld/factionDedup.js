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

import { FACTION_DESCRIPTORS } from '../../data/powerData.js';
import { fnv1a32 } from '../../kernel/proseHash.js';

// Suffixes that distinguish a reused base descriptor without introducing a foreign
// category keyword the inferFactionCategory fallback would mis-read (Assembly/Bloc etc.
// are deliberately excluded — they map to government/noble in factionCategories.js).
const DISAMBIG_SUFFIXES = Object.freeze(['Inner Circle', 'League', 'Coalition', 'Concord', 'Combine']);

/**
 * The deterministic candidate name space for a category: the base descriptors first (the
 * clean, distinct names), then base+suffix combos. Pure.
 * @param {string} category @returns {string[]}
 */
function candidateNames(category) {
  const bases = FACTION_DESCRIPTORS[category] || FACTION_DESCRIPTORS.other;
  const out = [...bases];
  for (const suf of DISAMBIG_SUFFIXES) for (const b of bases) out.push(`${b} ${suf}`);
  return out;
}

/**
 * Pick a world-unique name for a collided faction: fnv-hash a stable seed to a start
 * index in the candidate space, then probe deterministically for the first name not yet
 * used world-wide. Falls back to a numeric disambiguator only if the whole space (bases ×
 * suffixes) is exhausted — impossible for any realistic realm. Pure (no rng).
 * @param {string} category @param {Set<string>} used @param {string} seed
 */
function pickUniqueName(category, used, seed) {
  const cands = candidateNames(category);
  const start = fnv1a32(seed) % cands.length;
  for (let i = 0; i < cands.length; i += 1) {
    const name = cands[(start + i) % cands.length];
    if (!used.has(name)) return name;
  }
  let n = 2;
  let name;
  do { name = `${cands[start]} ${n}`; n += 1; } while (used.has(name));
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
    (a, b) => (a?._slot ?? 0) - (b?._slot ?? 0) || String(a?.id ?? '').localeCompare(String(b?.id ?? '')),
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
