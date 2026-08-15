/**
 * design/organic/ornament/fnv.js — the seed hash for seeded ornament.
 *
 * FNV-1a 32-bit — the house display-sidecar idiom (settlementRumors / marketPrices
 * keep their own 8-line copy rather than import a sibling's tables; the ornament
 * layer does the same so it stays a light, dependency-free lazy leaf: no seedrandom,
 * no kernel import). Pure: no rng, no wall clock — same seed ⇒ byte-identical
 * ornament, which is what the seeded-ornament golden family pins.
 */

/** @param {string} str @returns {number} 32-bit unsigned FNV-1a hash */
export function fnv1a32(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/**
 * A deterministic picker over one seed: pick(slot, pool) chooses a pool member
 * from the sub-hash fnv1a32(`${seed}::${slot}`), so independent slots decorrelate
 * (a settlement's cartouche frame, its corners, and its emblem are chosen
 * independently but reproducibly). Also exposes int(slot, n) for a raw index.
 * @param {string|number} seed
 */
export function seededPicker(seed) {
  const s = String(seed);
  const int = (slot, n) => (n <= 0 ? 0 : fnv1a32(`${s}::${slot}`) % n);
  return {
    seed: s,
    int,
    /** @template T @param {string} slot @param {readonly T[]} pool @returns {T} */
    pick: (slot, pool) => pool[int(slot, pool.length)],
    /** a 0..1 fraction for a slot (deterministic) */
    frac: (slot) => fnv1a32(`${s}::${slot}`) / 0x100000000,
  };
}
