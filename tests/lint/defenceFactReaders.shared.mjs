/**
 * defenceFactReaders.shared.mjs — the walker's patterns, written once (COHERENCE-AGREE, 2026-11-11; the
 * second member COHERENCE-AGREE-3, 2026-11-12; the words keyed to the home's atoms and the third member
 * COHERENCE-AGREE-6, 2026-11-12). Read by tests/lint/defenceFactReaders.walker.test.js and
 * by nothing else; a helper, never a suite.
 */
const NOT_THE_HOME = String.raw`(?!\s*(?:defen[cs]e|d|home)\b\.)`;
const CALL = /\b(?:includes|test|hasAny|hasInst|some|match|find|filter)\s*\(/;
/** @param {string} word */
const literalOf = (word) => new RegExp(String.raw`'[^'\n]*${word}[^'\n]*'|"[^"\n]*${word}[^"\n]*"|\x60[^\x60\n]*${word}[^\x60\n]*\x60|/[^/\n]*${word}[^/\n]*/[gimsuy]*`, 'i');

/**
 * THE WORDS, KEYED TO THE HOME'S ATOMS (COHERENCE-AGREE-6, REVIEW-AGREE-2 F8 (ii), the chair's ruling of 2026-11-12):
 * every atom `src/domain/facts/factVocabulary.js :: FACT_DIMENSIONS` homes on the defence record, with the words a
 * private reader names it by and the member that counts them. The walker's test holds that every homed atom has a
 * word here, so a fact homed later without teaching the walker goes red. Rows: [atom, member, word].
 */
export const ATOM_WORDS = Object.freeze([
  ['walls', 1, 'walls?'], ['garrison', 1, 'garrison'], ['garrison', 1, 'barracks'], ['militia', 1, 'militia'], ['watch', 1, 'watch'],
  ['mercenary', 1, String.raw`mercenar\w*`],
  ['court', 2, 'court(?:house|s)?'], ['court', 2, 'court buildings'], ['court', 2, 'town hall'], ['court', 2, 'city hall'],
  ['gate', 2, 'gates?'], ['gate', 2, 'gatehouse'],
  ['mercenary', 2, 'hireling hall'], ['mercenary', 2, 'free company'], ['mercenary', 2, 'hired muscle'], ['mercenary', 2, "veteran's lodge"],
  ['mercenary', 2, 'sellswords?'],
  ['palisade', 3, 'palisades?'], ['palisade', 3, 'earthworks?'], ['prison', 3, 'prisons?'], ['prison', 3, 'gaols?'], ['prison', 3, 'jails?'],
  ['hospital', 3, 'hospitals?'], ['hospital', 3, String.raw`infirmar\w*`], ['healer', 3, 'healers?'],
].map((row) => Object.freeze(row)));
/** @param {number} member */
const wordsOf = (member) => ATOM_WORDS.filter(([, m]) => m === member).map(([, , word]) => word).join('|');

/** The first member: walls, garrison, militia, watch, mercenaries (banked at 99bcc6944). */
const ASSIGN = new RegExp(String.raw`\bhas(?:Walls|Garrison|Militia|Watch|Mercenary)\s*[:=](?!=)${NOT_THE_HOME}`);
const LITERAL = literalOf(String.raw`\b(?:${wordsOf(1)})\b`);
/** @param {string} line */
export const reads = (line) => ASSIGN.test(line) || (CALL.test(line) && LITERAL.test(line));

/**
 * The second member (REVIEW-AGREE F9): the court, the gate, and a hired company under its other names (the
 * names priorityHelpers.js listed for it before cure 9, and "sellsword").
 */
const ASSIGN_COURT_GATE = new RegExp(String.raw`\bhas(?:Gates?|Court(?:System)?|Courthouse|FreeCompany)\s*[:=](?!=)${NOT_THE_HOME}`);
// (a word may open a regex literal right after its own `\b`, where no word boundary stands: `/\bgates?\b/`)
const LITERAL_COURT_GATE = literalOf(String.raw`(?:\b|(?<=\\b))(?:${wordsOf(2)})\b`);
/** @param {string} line */
export const readsCourtGate = (line) => ASSIGN_COURT_GATE.test(line) || (CALL.test(line) && LITERAL_COURT_GATE.test(line));

/**
 * The third member (COHERENCE-AGREE-6, F8 (ii)): the four homed atoms the first two never named: the palisade, the
 * prison, the hospital and the healer. Two shapes are not private readers and are ruled out by rule, not by row:
 * - ANOTHER SENSE: a name list tested against a person's role archetype (`['healer', …].includes(x.roleArchetype)`):
 *   a healer the person IS, not one the town has;
 * - AN AGREEMENT CHECK: a line that tests printed text and reads the home's own answer on the same line
 *   (`factsOf(…).defence.<atom>`), as the coherence receipt does: it reads the home, it does not replace it.
 */
const ASSIGN_ATOMS = new RegExp(String.raw`\bhas(?:Prison|Hospital|Healer|Palisade)\s*[:=](?!=)${NOT_THE_HOME}`);
const LITERAL_ATOMS = literalOf(String.raw`(?:\b|(?<=\\b))(?:${wordsOf(3)})\b`);
const ROLE_ARCHETYPE = /\.includes\(\s*\(?\s*[\w$.?]*\broleArchetype\s*\)?\s*\)/;
const READS_THE_HOME = /\bfactsOf\s*\(.*\)\s*\.defence\.\w+/;
/** @param {string} line */
export const readsAtoms = (line) => ASSIGN_ATOMS.test(line)
  || (CALL.test(line) && LITERAL_ATOMS.test(line) && !ROLE_ARCHETYPE.test(line) && !READS_THE_HOME.test(line));

/** Comments out, line count kept. @param {string} source */
export const codeOf = (source) => source
  .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
  .replace(/(^|[^:'"`])\/\/[^\n]*/g, '$1');

/**
 * A word held in a constant (COHERENCE-AGREE-6, REVIEW-AGREE-2 F8 (i)): `const MERC = 'mercenary'; … n.includes(MERC)`.
 * Each identifier a file binds to a NAME-LIKE string (`const|let|var NAME = '…'`; no comma, 40 characters at most:
 * a name a name test compares, not a sentence of prose) is read, on every other line of the same file, as that
 * string literal, so the members above see it. The binding line itself is left as it is (it tests nothing), and a
 * property key or an assignment target (`NAME:`, `NAME =`) is not replaced. The line count is kept.
 * @param {string} code a file's code, comments out (`codeOf`)
 * @returns {string}
 */
export const resolveNameConstants = (code) => {
  /** @type {Map<string, string>} */
  const bound = new Map();
  for (const m of code.matchAll(/\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(['"])([^'"\n]*)\2\s*[;,\n]/g)) {
    if (!m[3].includes(',') && m[3].length <= 40) bound.set(m[1], `${m[2]}${m[3]}${m[2]}`);
  }
  if (!bound.size) return code;
  const names = [...bound.keys()].sort((a, b) => b.length - a.length).map((name) => name.replace(/\$/g, '\\$'));
  const use = new RegExp(String.raw`(?<![\w$.'"])(${names.join('|')})(?![\w$]|\s*[:=](?!=))`, 'g');
  return code.split('\n')
    .map((line) => (/\b(?:const|let|var)\s[^=]*=\s*['"]/.test(line) ? line : line.replace(use, (name) => /** @type {string} */ (bound.get(name)))))
    .join('\n');
};

/** The lines of one source file a member counts, with comments out and name-like constants read as their strings. */
export const linesReading = (/** @type {string} */ source, /** @type {(line: string) => boolean} */ test) =>
  resolveNameConstants(codeOf(source)).split('\n').filter(test).length;
