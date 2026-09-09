/**
 * fieldSynonyms.js — THE NOUNS A FIELD MAY BE NAMED BY IN PROSE (REWRITE car 8a-6;
 * SITTING §H rule 3, §T.5; the chair's M-9 ruling 4).
 *
 * ⛔⛔ WHY IT IS ITS OWN MODULE AND NOT A BLOCK INSIDE `wiringCensus.js`, WITH THE MEASUREMENT.
 * Written there first, it took that file OVER its 800 effective-line layer ceiling and
 * `tests/lint/sizeBaseline.test.js` refused it by name — "decompose it, or add it as a
 * burn-down entry". Decomposing is the honest half of that choice, and ARCH car 0 already made
 * it once for the same reason: the branch reader became `wiringBranch.js` rather than a
 * burn-down row. It is also the truer shape. This table is RATIFIED DATA — rows a chair signed,
 * each citing where its join comes from — and the census is a SCANNER. Data that changes when a
 * sitting rules does not belong inside a module whose job is to read source.
 *
 * ⛔ AND THE MOVE CURED A SECOND DEFECT BY ITSELF. While the table lived in `wiringCensus.js`
 * the census's own producer scan read its property names as leaf keys the estate WRITES: an
 * object keyed `{ treasury: …, court: … }` flipped the `absent` label on four DS-DEF-2 rows
 * from `not-produced` to `measured`. The rows below are a LIST for that reason, and out here
 * the scan does not reach them at all.
 *
 * PURE, HEADLESS. No I/O, no clock, no RNG.
 *
 * @enforced-by tests/lint/proseWiringCensus.walker.test.js
 */
import { HOLDER_KINDS } from './holderTable.js';

/**
 * ⭐⭐ THE NOUNS A FIELD MAY BE NAMED BY IN PROSE — A REPORT COLUMN, RATIFIED LIKE AN ALIAS.
 *
 * ⛔ THE DEFECT IT CURES, IN THE CHAIR'S OWN WORDS (SITTING §H rule 3). The owner's exemplar
 * line `stone keeps itself, and wages do not.` was flagged by arm Q as "a coordinate naming no
 * second field", though the spine reads `settlement.defenseProfile.economicGates.military` and
 * `wages` is exactly what that gate IS in the world. `claimsField`'s vocabulary is the field
 * PATH's own words and nothing else — `military`, `gates`, `economic` — so a noun the path does
 * not contain can map to nothing, and the arm convicted a lawful line for want of a word.
 *
 * ⛔⛔ A SYNONYM IS RATIFIED LIKE AN ALIAS: CITED TO THE CARD, NEVER TO A COMMENT OR A PROSE
 * STRING (SITTING §H, the alias law applied). Every row below names WHERE the join comes from,
 * and the source is a typed artefact — the holder table's own kind list, or the field's own
 * card. A row whose only evidence is that a writer used the word is not a synonym; it is a
 * writer using a word, and the arm is right to withhold it.
 *
 * ⛔ AND IT IS A REPORT, NEVER A GATE. The column widens what arm Q, F25 and A0b can SEE; it
 * licenses nothing on its own. A synonym that turned out to be wrong would make an arm quieter,
 * which is why the roster is short, cited and closed rather than generous.
 * @type {ReadonlyArray<{field: string, nouns: ReadonlyArray<string>, at: string}>}
 */
export const FIELD_SYNONYM_ROWS = Object.freeze([
  Object.freeze({
    field: 'settlement.defenseProfile.economicGates.military',
    nouns: Object.freeze(['wages', 'wage', 'pay', 'purse']),
    at: 'SITTING §H rule 3. The military economic gate IS the town\'s pay for its watch;'
      + ' the licence card prints the gate as the pool\'s read and the writers author against it',
  }),
]);

/**
 * The HOLDER-KIND nouns, which are a synonym family of a different shape: a `books` or a `roll`
 * names the RECORD a fact is kept in, and the holder table already answers which kind keeps
 * which field. So the row is generated from `HOLDER_KINDS` rather than typed out, and a kind
 * added to that frozen list gains its nouns with no edit here.
 *
 * ⛔ `books` AND `roll` ARE KIND-WIDE AND NOT FIELD-WIDE, which is why they are kept apart from
 * the rows above. They license the RECORD noun on any field whose holder is that kind, so the
 * table is built per field by `fieldSynonymsFor` from the row's own `source.kind`.
 *
 * ⛔⛔ AN ARRAY OF ROWS AND NOT AN OBJECT KEYED BY KIND, AND THE REASON IS A DEFECT THIS CAR
 * PRODUCED AND CAUGHT. Written first as `{ treasury: [...], court: [...], … }`, this table
 * changed the census's own measurement: the census scans `src/` for the leaf keys the estate
 * WRITES, read a property named `court:` inside the module it scans, and flipped the `absent`
 * label on four DS-DEF-2 rows from `not-produced` to `measured`. An instrument that contaminates
 * its own reading by being added to the file it reads is the exact class this register exists to
 * refuse, and no comment can fix it — the shape has to stop being a write. As rows there is no
 * key for the scan to misread, and the census's four rows are byte-identical again (proven:
 * `--dry` reads `ROWS that would move: 0` after the change and 4 before it).
 * @type {ReadonlyArray<{kind: string, nouns: ReadonlyArray<string>}>}
 */
export const HOLDER_KIND_NOUN_ROWS = Object.freeze([
  Object.freeze({ kind: 'treasury', nouns: Object.freeze(['books', 'purse', 'chest']) }),
  Object.freeze({ kind: 'muster', nouns: Object.freeze(['roll', 'rolls', 'muster']) }),
  Object.freeze({ kind: 'census', nouns: Object.freeze(['roll', 'rolls', 'count']) }),
  Object.freeze({ kind: 'parish', nouns: Object.freeze(['register', 'book', 'books']) }),
  Object.freeze({ kind: 'toll-bar', nouns: Object.freeze(['book', 'books', 'toll']) }),
  Object.freeze({ kind: 'market', nouns: Object.freeze(['book', 'books', 'stall']) }),
  Object.freeze({ kind: 'watch', nouns: Object.freeze(['roll', 'rolls', 'watch']) }),
  Object.freeze({ kind: 'court', nouns: Object.freeze(['roll', 'rolls', 'record']) }),
  Object.freeze({ kind: 'elders', nouns: Object.freeze(['word', 'memory']) }),
  Object.freeze({ kind: 'tradition', nouns: Object.freeze(['word', 'memory']) }),
  Object.freeze({ kind: 'road', nouns: Object.freeze(['book', 'books']) }),
  Object.freeze({ kind: 'office', nouns: Object.freeze(['book', 'books', 'record']) }),
]);

/**
 * ⛔ EVERY FROZEN HOLDER KIND HAS ITS NOUNS, asserted at module load rather than in a test, so
 * a kind added to `HOLDER_KINDS` cannot ship mute. It throws rather than warning: a synonym
 * table that silently covers eleven of twelve kinds is an arm quietly blind on the twelfth.
 */
const missingKinds = HOLDER_KINDS.filter(
  (kind) => !HOLDER_KIND_NOUN_ROWS.some((row) => row.kind === kind),
);
if (missingKinds.length) {
  throw new Error(`fieldSynonyms: HOLDER_KINDS gained ${missingKinds.join(', ')} with no record`
    + ' noun; give each a row or the arms are blind on it');
}

/**
 * THE VOCABULARY FOR ONE CENSUS ROW: every noun its read fields may be named by, keyed by
 * field path, in the shape `claimsField` takes as its third argument.
 *
 * ⛔ THE HOLDER NOUNS APPLY TO EVERY FIELD OF THE ROW AND THE FIELD ROWS TO THEIR OWN, and the
 * difference matters: a `roll` is the record the WHOLE row is kept in, while `wages` names ONE
 * gate. Merging the two would let a `books` claim a field the treasury does not keep.
 * @param {{reads?: ReadonlyArray<string>, source?: {kind?: string}}} row a census row
 * @returns {Record<string, string[]>}
 */
export function fieldSynonymsFor(row) {
  /** @type {Record<string, string[]>} */
  const out = {};
  const reads = Array.isArray(row?.reads) ? row.reads : [];
  const kind = String(row?.source?.kind || '');
  const kindNouns = (HOLDER_KIND_NOUN_ROWS.find((entry) => entry.kind === kind) || {}).nouns || [];
  for (const field of reads) {
    const own = FIELD_SYNONYM_ROWS.find((entry) => entry.field === field);
    const nouns = [...new Set([...(own ? own.nouns : []), ...kindNouns])].sort();
    if (nouns.length) out[field] = nouns;
  }
  return out;
}

/**
 * THE WHOLE TABLE, over every row of a census, for the committed REPORT column. Keyed by field
 * path so a reader can look one up without a row, and so `censusSynonymTable` in the wave gate
 * finds it under the name it already looks for.
 * @param {ReadonlyArray<object>} rows
 * @returns {Record<string, string[]>}
 */
export function fieldSynonymTable(rows) {
  /** @type {Record<string, Set<string>>} */
  const merged = {};
  for (const row of rows || []) {
    for (const [field, nouns] of Object.entries(fieldSynonymsFor(row))) {
      merged[field] = merged[field] || new Set();
      for (const noun of nouns) merged[field].add(noun);
    }
  }
  return Object.fromEntries(Object.entries(merged).sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([field, nouns]) => [field, [...nouns].sort()]));
}
