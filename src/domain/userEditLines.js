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
 *     character id;
 *   - the house's backing (`backs`, domain/dossier/powerSupport.js): power names parted by a
 *     middle dot, read case-folded against the faction roster.
 *
 * A rename that moved the record and left the line would leave the DM's part on a name the
 * roster no longer answers to, and the reader drops such a part without a word. TRUST THE DM:
 * the rename modules re-key each line through `rekeyCastLine` and `rekeyBacksLine`, beside
 * the one spelling of each here.
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

/** The house's editable backing path (EDITABLE_FIELDS.institution). */
export const BACKS_PATH = 'backs';
/**
 * THE `backs` EDIT'S SPELLING (X-45). The DM's list lives in the house's own edit record as ONE
 * line of power names parted by a middle dot. These two helpers are the only spellers.
 */
export const BACKS_SEPARATOR = ' · ';

/** @param {unknown} value @returns {string[]} the names, trimmed, deduplicated (first spelling kept) */
export function parseBacksValue(value) {
  if (typeof value !== 'string') return [];
  /** @type {string[]} */ const out = [];
  const seen = new Set();
  for (const part of value.split(/[·,;\n]/)) {
    const name = part.trim();
    const key = name.toLowerCase();
    if (!name || seen.has(key)) continue;
    seen.add(key); out.push(name);
  }
  return out;
}

/** @param {readonly string[]} names @returns {string} */
export function formatBacksValue(names) {
  return parseBacksValue((names || []).join(BACKS_SEPARATOR)).join(BACKS_SEPARATOR);
}

/**
 * The DM's backing line with the renamed power re-spelled. Case-folded, because the reader
 * resolves each name case-folded against the roster (powerSupport.js :: houseBacksOf), so a
 * name the DM typed in another case named this power and must follow it. A line where nothing
 * moves is returned AS GIVEN; a line that moves is re-spelled through `formatBacksValue`.
 *
 * @param {unknown} value the stored line
 * @param {string} oldName
 * @param {string} newName
 * @returns {unknown} the re-keyed line, or `value` itself when nothing moved
 */
export function rekeyBacksLine(value, oldName, newName) {
  if (typeof value !== 'string' || !oldName || !newName || oldName === newName) return value;
  const folded = oldName.trim().toLowerCase();
  const names = parseBacksValue(value);
  if (!names.some((n) => n.toLowerCase() === folded)) return value;
  return formatBacksValue(names.map((n) => (n.toLowerCase() === folded ? newName : n)));
}
