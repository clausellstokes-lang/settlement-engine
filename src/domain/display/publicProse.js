/**
 * domain/display/publicProse.js — THE PUBLIC PROSE PROJECTION'S LEAF (STYLE-RULINGS-2 B10(a);
 * lane SW-B7b PROJECTION, the chair's rulings of 12:5x and 13:0x).
 *
 * THE LAW. The shared dossier (the gallery page and the players' link, both `publicDossier`)
 * prints the owner's PLAYER-AUDIENCE view minus the veiled rows, byte for byte. Every desk draws
 * on `String(s._seed ?? s.id)`, and the seed never leaves the owner's record (099/121), so a
 * public page cannot re-draw a sentence: it can only print one drawn owner-side. So the owner's
 * save composes each desk call site's drawn rungs ONCE (`components/new/publicProseCompose.js`,
 * loaded lazily) and writes them as TEXT into the record:
 *
 *     data.publicProse = { v: PUBLIC_PROSE_VERSION, blocks: { <site>: <the drawn desk> } }
 *
 * and each desk's public branch reads `publicProseOf(r, site)` here in place of drawing.
 *
 * TWO RULES, both fail-closed (pinned in tests/domain/publicProse.test.js):
 *   1. An ABSENT `publicProse` (a save not yet re-published under this client) reads null, and
 *      every desk's public branch turns null into its SILENT shape: never a seedless re-draw, so
 *      no wrong sentence ever prints. The backfill is the owner's next save through the row
 *      builder (`lib/saves.js`), never a data migration.
 *   2. A mismatched `v` reads null too. Bump PUBLIC_PROSE_VERSION when the stored shape of a
 *      site changes; every town then prints silent at that site until its next save.
 *
 * THE KEY NAMES. The projection's deeper keys keep the denylist (`publicSafe.js ::
 * PRIVATE_KEY_RE`: `hook`, `notes`, `seed`, `dm`, `chronicle`, `plot_hooks`, …), so a site or
 * a field whose name carries a token is stripped on the way out. The site keys below are chosen
 * clear of every token; `tests/domain/publicProse.test.js` pins that the projection keeps them.
 *
 * A zero-import leaf: every tab chunk that reads its site pays for nothing else.
 */

/** The stored shape's version tag. A record stamped under another tag prints silent. */
export const PUBLIC_PROSE_VERSION = 'pp-1';

/**
 * The shipped desk for one call site, or null (absent, mismatched version, or a site the save
 * did not compose). The caller turns null into its own SILENT shape.
 * @param {{publicProse?: {v?: unknown, blocks?: Record<string, unknown>|null}|null}|null|undefined} settlement the record the tab holds (the public projection on a public page)
 * @param {string} site a call-site key (`economy:economics`, `general:overview`, …)
 * @returns {unknown}
 */
export function publicProseOf(settlement, site) {
  const projection = settlement?.publicProse;
  if (!projection || typeof projection !== 'object') return null;
  if (projection.v !== PUBLIC_PROSE_VERSION) return null;
  const blocks = projection.blocks;
  if (!blocks || typeof blocks !== 'object') return null;
  const shipped = blocks[site];
  return shipped === undefined ? null : shipped;
}

/**
 * A drawn desk reduced to what a page prints: the strings, the arrays and the objects that
 * hold them. `provenance` (the pool key, the variant id, the pieces) is the recorder's, never
 * the page's, and is dropped; so are functions and `undefined`. Frozen objects come back as
 * plain JSON-safe values.
 * @param {unknown} value @returns {unknown}
 */
export function shippedProseOf(value) {
  if (value === null) return null;
  if (Array.isArray(value)) return value.map((item) => (item === undefined ? null : shippedProseOf(item)));
  if (typeof value === 'object') {
    /** @type {Record<string, unknown>} */
    const out = {};
    for (const [key, child] of Object.entries(value)) {
      if (key === 'provenance' || child === undefined || typeof child === 'function') continue;
      out[key] = shippedProseOf(child);
    }
    return out;
  }
  if (typeof value === 'number' && !Number.isFinite(value)) return null;
  return value;
}

/**
 * The record with its projection written. A null projection (the composer could not load or
 * had no settlement) leaves the record exactly as it was, so a save never fails on it.
 * @param {Record<string, unknown>|null|undefined} record
 * @param {{v: string, blocks: Record<string, unknown>}|null} projection
 * @returns {Record<string, unknown>|null|undefined}
 */
export function withPublicProse(record, projection) {
  if (!projection || !record || typeof record !== 'object' || Array.isArray(record)) return record;
  return { ...record, publicProse: projection };
}
