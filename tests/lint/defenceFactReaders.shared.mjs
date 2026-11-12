/**
 * defenceFactReaders.shared.mjs — the walker's patterns, written once (COHERENCE-AGREE, 2026-11-11; the
 * second member COHERENCE-AGREE-3, 2026-11-12). Read by tests/lint/defenceFactReaders.walker.test.js and
 * by nothing else; a helper, never a suite.
 */
const NOT_THE_HOME = String.raw`(?!\s*(?:defen[cs]e|d|home)\b\.)`;
const CALL = /\b(?:includes|test|hasAny|hasInst|some|match|find|filter)\s*\(/;
/** @param {string} word */
const literalOf = (word) => new RegExp(String.raw`'[^'\n]*${word}[^'\n]*'|"[^"\n]*${word}[^"\n]*"|\x60[^\x60\n]*${word}[^\x60\n]*\x60|/[^/\n]*${word}[^/\n]*/[gimsuy]*`, 'i');

/** The first member: walls, garrison, militia, watch, mercenaries (banked at 99bcc6944). */
const ASSIGN = new RegExp(String.raw`\bhas(?:Walls|Garrison|Militia|Watch|Mercenary)\s*[:=](?!=)${NOT_THE_HOME}`);
const LITERAL = literalOf(String.raw`\b(?:walls?|garrison|barracks|militia|watch|mercenar\w*)\b`);
/** @param {string} line */
export const reads = (line) => ASSIGN.test(line) || (CALL.test(line) && LITERAL.test(line));

/**
 * The second member (REVIEW-AGREE F9): the court, the gate, and a hired company under its other names (the
 * names priorityHelpers.js listed for it before cure 9, and "sellsword").
 */
const ASSIGN_COURT_GATE = new RegExp(String.raw`\bhas(?:Gates?|Court(?:System)?|Courthouse|FreeCompany)\s*[:=](?!=)${NOT_THE_HOME}`);
// (a word may open a regex literal right after its own `\b`, where no word boundary stands: `/\bgates?\b/`)
const LITERAL_COURT_GATE = literalOf(String.raw`(?:\b|(?<=\\b))(?:court(?:house|s)?|court buildings|town hall|city hall|gates?|gatehouse|hireling hall|free company|hired muscle|veteran's lodge|sellswords?)\b`);
/** @param {string} line */
export const readsCourtGate = (line) => ASSIGN_COURT_GATE.test(line) || (CALL.test(line) && LITERAL_COURT_GATE.test(line));

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
