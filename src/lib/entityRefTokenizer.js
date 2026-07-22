/**
 * entityRefTokenizer — split free-form narrative prose into renderable segments.
 *
 * The narrative server wraps known entity NAMES it finds in refined prose with
 * an id-bearing token so the client can turn them into in-dossier links without
 * re-scanning prose at render. The token is intentionally rare-unicode-fenced so
 * it can never collide with real prose or be reconstructed by ordinary text.
 *
 * TWO TOKEN FORMATS, one fence, one field grammar:
 *
 *   ⟦entity:<id>|<displayName>⟧    — a NAME link. Renders the entity's CURRENT
 *     name (rename-safe, resolved live at render), links to its card.
 *   ⟦pronoun:<id>|<pronoun>⟧       — a PRONOUN link (the contract extension).
 *     Renders the wrapped word VERBATIM (a resolved 'he' stays 'he', never the
 *     entity's name), and still links to the same card. This is what lets
 *     "Aldric rules. He commands the guard." link the "He" to Aldric without
 *     replacing it with "Aldric". A resolved name token and a resolved pronoun
 *     token differ ONLY in which text is shown — the link target is identical.
 *
 *   - ⟦ … ⟧  (U+27E6 / U+27E7 mathematical white square brackets) — never typed
 *     in ordinary prose, JSON-safe, and survive a JSON round-trip unescaped.
 *   - the `entity:` / `pronoun:` prefix selects render mode (currentName vs
 *     verbatim); the id + display grammar is otherwise identical for both.
 *   - `<id>` is the STABLE dossier entity id (npc.id / faction.<snake> / …) the
 *     client index resolves; the second field is the text to SHOW — a name to
 *     render live (entity), or the exact word to keep (pronoun). Either way it is
 *     the degrade fallback when the id does NOT resolve (see EntityLink /
 *     EntityRef).
 *
 * tokenizeProse is O(n), allocates one regex per call, and NEVER throws: any
 * non-string input collapses to an empty segment list, and prose with no tokens
 * returns a single `text` segment (so old stored narratives render as plain
 * prose with zero reader-side branching).
 */

// The NAME-link pattern (kept byte-identical to its original form, so every
// existing token, golden and importer is unaffected). The id half forbids `|`
// (the field separator) and the name half forbids the closing bracket, so a
// malformed token simply fails to match and is carried through as literal text
// rather than throwing.
export const ENTITY_REF_PATTERN = /⟦entity:([^|]+)\|([^⟧]+)⟧/g;

// The PRONOUN-link pattern — same field grammar, distinct prefix. Kept separate
// (rather than a third field on the entity token) so the entity pattern above,
// and everything that matches it, stays exactly as it was.
export const PRONOUN_REF_PATTERN = /⟦pronoun:([^|]+)\|([^⟧]+)⟧/g;

// The combined scanner tokenizeProse walks: either prefix, capturing the mode in
// group 1 so a `pronoun` hit renders verbatim. Entity captures (id, display) are
// byte-identical to ENTITY_REF_PATTERN's, so entity segments are unchanged.
const ANY_REF_PATTERN = /⟦(entity|pronoun):([^|]+)\|([^⟧]+)⟧/g;

/**
 * @typedef {Object} ProseSegment
 * @property {'text'|'ref'} type
 * @property {string} value        Plain text (type 'text') or display text (type 'ref').
 * @property {string} [id]         Stable entity id (type 'ref' only).
 * @property {string} [displayText] Alias of `value` for ref segments (the name to show).
 * @property {true} [verbatim]     Present (and true) ONLY on a pronoun ref: the
 *                                 renderer must show `value` verbatim rather than
 *                                 the resolved entity's current name. Absent on a
 *                                 name ref, so a name segment's shape is unchanged.
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
  const re = new RegExp(ANY_REF_PATTERN.source, 'g');
  let lastIndex = 0;
  let match;

  while ((match = re.exec(prose)) !== null) {
    const [full, mode, id, displayText] = match;
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: prose.slice(lastIndex, match.index) });
    }
    // A name ref keeps its original 4-field shape (no `verbatim` key); a pronoun
    // ref adds `verbatim: true` so the renderer shows the word, not the name.
    const seg = /** @type {ProseSegment} */ ({ type: 'ref', value: displayText, id, displayText });
    if (mode === 'pronoun') seg.verbatim = true;
    segments.push(seg);
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
