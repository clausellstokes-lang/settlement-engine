/**
 * domain/display/deityNames.js — the ONE shared deity-name resolver
 * (content-immersion-r2-4 / domain-display-readmodels-1). Two lossy patterns were
 * copy-pasted across the display layer:
 *
 *   • a tail-split floor (`String(ref).split(/[:_]/).filter(Boolean).pop()`) that,
 *     because a minted ref is `deity:<scope>:<underscore_slug>` (mintDeityRef slugs
 *     with sep '_'), popped only the LAST word — "War Father" rendered as "Father",
 *     "The Silent Queen" as "Queen" — on the paid PDF, the admin panel, the public
 *     gallery snapshot, and zero-seat pantheon rows;
 *   • a snapshot-first resolver (realmArcSummary / PantheonPanel) that read only
 *     `primaryDeitySnapshot`, never `cultDeitySnapshots`.
 *
 * This module is the single home for both: `deityDisplayNameFromRef` (the loss-
 * minimizing floor — isolate the last ref-segment, split its slug on '_'/'-',
 * title-case each token, join with spaces) and `deityNameFromSnapshots` (resolve
 * the authored name from the embedded primary AND cult snapshots, floor-fallback).
 *
 * ⚠️ THE FLOOR STILL CANNOT recover casing/punctuation the slug destroyed
 * ("Aurelion, the Dawnfather" → "Aurelion The Dawnfather"): only the embedded
 * snapshot, or a displayName PERSISTED on the pantheon entry at first mint, carries
 * that. Persisting a displayName is the robust belt-and-suspenders for the zero-
 * seat twilight case (no settlement carries the deity) — but the pantheon entry is
 * ENGINE state (worldPulse/pantheon.js createPantheonEntry) with a `toEqual`-pinned
 * 5-field shape and lives in same-seed goldens, so it is a golden-shifting engine
 * change recorded as Track-G2 material, NOT built on this display-lane wave.
 *
 * PRESENTATION ONLY. Pure; imports nothing (zero eager bytes).
 */

/**
 * The loss-minimizing display name from a deity ref. Isolates the last ':'-segment
 * (the slug), splits it on '_'/'-', title-cases each token, and joins with spaces.
 *   deity:Vael                     → "Vael"
 *   deity:lu_a:war_father          → "War Father"
 *   converted:aurelion_the_dawn... → "Aurelion The Dawn..."
 * @param {unknown} ref
 * @returns {string}
 */
export function deityDisplayNameFromRef(ref) {
  const s = String(ref == null ? '' : ref);
  const seg = s.split(':').filter(Boolean).pop() || s;
  const tokens = seg.split(/[_-]/).filter(Boolean);
  if (tokens.length === 0) return s;
  return tokens.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(' ');
}

/** Loose property read off an unknown value (cast-free of `any`). @param {unknown} o @param {string} k @returns {unknown} */
function prop(o, k) {
  return o && typeof o === 'object' ? /** @type {Record<string, unknown>} */ (o)[k] : undefined;
}

/**
 * Resolve the AUTHORED deity name from the embedded snapshots on a settlement list
 * (primary AND cult), matching on the ref. Falls back to the floor when no snapshot
 * carries the deity (the zero-seat twilight case).
 * @param {Array<unknown> | null | undefined} settlements
 * @param {unknown} deityId
 * @returns {string}
 */
export function deityNameFromSnapshots(settlements, deityId) {
  const target = String(deityId);
  const list = Array.isArray(settlements) ? settlements : [];
  for (const item of list) {
    const cfg = prop(prop(item, 'settlement'), 'config') || prop(item, 'config');
    if (!cfg) continue;
    const rawCults = prop(cfg, 'cultDeitySnapshots');
    const cults = Array.isArray(rawCults) ? rawCults : [];
    for (const deity of [prop(cfg, 'primaryDeitySnapshot'), ...cults]) {
      if (!deity) continue;
      const name = prop(deity, 'name');
      const ref = prop(deity, '_deityRef') || prop(deity, 'primaryDeityRef') || (name ? `deity:${name}` : null);
      if (String(ref) === target && name) return String(name);
    }
  }
  return deityDisplayNameFromRef(deityId);
}
