/**
 * userEditLines.js — THE GRAMMAR OF THE DM'S ONE-LINE LIST EDITS, and their re-key on a rename
 * (RUNG1B-F8, 2026-11-04).
 *
 * Two DM edits spell a LIST as one line of parts (the X-45 idiom: every reader of an edit
 * record still reads a string), and both name a record by its DISPLAY NAME, because the record
 * gives that kind no other identity (design §22.4: a faction's identity IS its display name; a
 * house carries `name` and no `id`):
 *
 *   - the crisis cast (`castRoles`, domain/crisis/crisisCast.js): `role=kind:id` parts, where a
 *     `faction:` or `institution:` part's id is the name and an `npc:` part's is the durable
 *     character id.
 *
 * A rename that moved the record and left the line would leave the DM's part on a name the
 * roster no longer answers to, and the reader drops such a part without a word. TRUST THE DM:
 * the rename modules re-key the line through `rekeyCastLine`, the one place the grammar lives
 * beside its spelling here.
 *
 * A LEAF. No imports, so the rename modules (fetched at the call seam to stay off first paint)
 * take the grammar without taking the crisis derivation's graph.
 *
 * PURE. Strings in, strings out.
 */

/** The crisis entry's editable path (EDITABLE_FIELDS.crisis). */
export const CAST_EDIT_PATH = 'castRoles';
/** The separator between the cast line's `role=kind:id` parts. */
export const CAST_EDIT_SEPARATOR = ' · ';

/** One `role=kind:id` part, read as the cast reader reads it (domain/crisis/crisisCast.js :: parseCastRoles). */
const CAST_PART = /^([a-z]+)=([a-z]+):(.+)$/;

/**
 * The DM's cast line with every `<kind>:<oldName>` part re-keyed to `newName`. Kind-scoped: a
 * faction, a house and a person may share a display name, and a rename of one must not move
 * the others' parts. The match is exact (trimmed, not case-folded), as the reader's is. Every
 * part that does not move is kept byte for byte, and a line where nothing moves is returned
 * AS GIVEN, so the caller can tell a move from a no-op by identity.
 *
 * @param {unknown} value the stored line
 * @param {'npc' | 'faction' | 'institution'} kind
 * @param {string} oldName
 * @param {string} newName
 * @returns {unknown} the re-keyed line, or `value` itself when nothing moved
 */
export function rekeyCastLine(value, kind, oldName, newName) {
  if (typeof value !== 'string' || !oldName || !newName || oldName === newName) return value;
  let moved = false;
  const parts = value.split(CAST_EDIT_SEPARATOR).map((part) => {
    const m = CAST_PART.exec(part.trim());
    if (!m || m[2] !== kind || m[3].trim() !== oldName) return part;
    moved = true;
    return `${m[1]}=${kind}:${newName}`;
  });
  return moved ? parts.join(CAST_EDIT_SEPARATOR) : value;
}
