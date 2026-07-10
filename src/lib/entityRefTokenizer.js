/**
 * entityRefTokenizer — split free-form narrative prose into renderable segments.
 *
 * The narrative server wraps known entity NAMES it finds in refined prose with
 * an id-bearing token so the client can turn them into in-dossier links without
 * re-scanning prose at render. The token is intentionally rare-unicode-fenced so
 * it can never collide with real prose or be reconstructed by ordinary text.
 *
 * TOKEN FORMAT:  ⟦entity:<id>|<displayName>⟧
 *   - ⟦ … ⟧  (U+27E6 / U+27E7 mathematical white square brackets) — never typed
 *     in ordinary prose, JSON-safe, and survive a JSON round-trip unescaped.
 *   - `entity:` prefix disambiguates from any other future fenced token.
 *   - `<id>` is the STABLE dossier entity id (npc.id / faction.<snake> / …) the
 *     client index resolves; `<displayName>` is the text to show when the id
 *     does NOT resolve (the degrade fallback — see EntityLink / EntityRef).
 *
 * tokenizeProse is O(n), allocates one regex per call, and NEVER throws: any
 * non-string input collapses to an empty segment list, and prose with no tokens
 * returns a single `text` segment (so old stored narratives render as plain
 * prose with zero reader-side branching).
 */

// One canonical pattern shared by parse + the server wrapper's double-wrap
// guard. The id half forbids `|` (the field separator) and the name half forbids
// the closing bracket, so a malformed token simply fails to match and is carried
// through as literal text rather than throwing.
export const ENTITY_REF_PATTERN = /⟦entity:([^|]+)\|([^⟧]+)⟧/g;

/**
 * @typedef {Object} ProseSegment
 * @property {'text'|'ref'} type
 * @property {string} value        Plain text (type 'text') or display text (type 'ref').
 * @property {string} [id]         Stable entity id (type 'ref' only).
 * @property {string} [displayText] Alias of `value` for ref segments (the name to show).
 */

/**
 * Split prose into ordered text / ref segments.
 *
 * @param {unknown} prose
 * @returns {ProseSegment[]}
 */
export function tokenizeProse(prose) {
  if (typeof prose !== 'string' || prose.length === 0) return [];

  /** @type {ProseSegment[]} */
  const segments = [];
  // Fresh regex state per call (the exported constant is shared/global-flagged).
  const re = new RegExp(ENTITY_REF_PATTERN.source, 'g');
  let lastIndex = 0;
  let match;

  while ((match = re.exec(prose)) !== null) {
    const [full, id, displayText] = match;
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: prose.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'ref', value: displayText, id, displayText });
    lastIndex = match.index + full.length;
    // Defensive: a zero-length match would spin forever. The pattern always
    // consumes at least the fences, so this can't fire — but guard anyway.
    if (re.lastIndex === match.index) re.lastIndex += 1;
  }

  if (lastIndex < prose.length) {
    segments.push({ type: 'text', value: prose.slice(lastIndex) });
  }

  // No tokens at all -> a single text segment so callers never special-case it.
  if (segments.length === 0) {
    segments.push({ type: 'text', value: prose });
  }
  return segments;
}

export default tokenizeProse;
