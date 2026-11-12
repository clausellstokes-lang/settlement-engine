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
