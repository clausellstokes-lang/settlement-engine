/**
 * domain/facts/bareLine.js — THE CONSUMER'S TOLERANCE FOR AN OBJECT LINE (CENSUS-4b; the chair's
 * R-C: "never leave a consumer that breaks on an object").
 *
 * A table whose entries are already objects (the NPC goals `{ short, long, driven_by }`, the
 * registry entries) carries its declaration as a FIELD on the entry (`needs`, `excludes`,
 * `crisis`, `tags`; `docs/DESIGN_POOL_CENSUS.md` §3.1). The draw reads it; the record must not:
 * a goal stored on an NPC with its `needs` field beside it would move every birth that drew a
 * declared line, admitted or not. `bareLine` hands the consumer the entry WITHOUT its declaration
 * column — the same object when it carries none (byte-identical by identity), a shallow copy with
 * the four fields dropped when it does. `drawDeclared.js :: lineText` is the string half of the
 * same rule (`{ text } → text`).
 *
 * Pure.
 */

/** The declaration column's fields (the sibling column and the registry `tags`). */
const DECLARATION_FIELDS = Object.freeze(['needs', 'excludes', 'crisis', 'tags']);

/**
 * @template T
 * @param {T} line a drawn entry
 * @returns {T} the entry as its consumer stores it
 */
export function bareLine(line) {
  if (!line || typeof line !== 'object' || Array.isArray(line)) return line;
  const o = /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (line));
  if (!DECLARATION_FIELDS.some((k) => k in o)) return line;
  /** @type {Record<string, unknown>} */ const out = {};
  for (const [k, v] of Object.entries(o)) if (!DECLARATION_FIELDS.includes(k)) out[k] = v;
  return /** @type {T} */ (/** @type {unknown} */ (out));
}
