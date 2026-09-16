/**
 * tests/helpers/codeOnlySource.js — THE ONE SOURCE-STRIP THIS ESTATE'S WALKERS SHARE.
 *
 * `codeOnly` blanks comments AND string/template CONTENTS while preserving every offset,
 * so a name written in PROSE — a row's `other` text, a header paragraph, a frozen roster's
 * `reason` — is not measured as a USE. Template `${...}` expressions are KEPT, because an
 * interpolation is code and a call inside one is a real call.
 *
 * ⛔ WHY IT LIVES HERE, AND IT IS THE dormancyOracle INCIDENT'S OWN LESSON. The body used
 * to be `export`ed from `tests/lint/engineGatedRuleKeys.walker.test.js`, and importing a
 * symbol from a `.test.js` file RE-EVALUATES that module — so every importer re-registers
 * that walker's suites inside its own file, which is why a fence that imported it reports
 * seven tests it does not own. That coupling makes a plain refactor expensive: a NEW
 * importer moves the lighting census's title tuple, so the shared strip could not be
 * adopted without paying a register bill. Extracting the pure body to a plain helper (no
 * describe/test here — see this file's sibling `dormancyOracle.js` for the incident) breaks
 * the coupling: the walker re-exports it, its ten existing importers are untouched, and a
 * new adopter costs nothing.
 *
 * ⭐ THE CLASS IT EXISTS FOR, stated once so the next walker does not re-derive it: a
 * detector making a USE claim must read code, because a call cannot execute from inside a
 * quoted literal. The substrate coupling met that class EIGHT times — a comment, a frozen
 * `home:` path, a ban list, a seam-name constant, a receipt string, a data roster, and
 * twice in one wave in the two instruments that classify chooser idioms, each of which
 * convicted a registry for DESCRIBING the thing it classifies.
 *
 * Pure: no imports, no side effects, deterministic.
 */

/**
 * @param {string} src @returns {string} the same string, comments and string TEXT blanked,
 * offsets and newlines preserved, template interpolations left standing.
 */
export function codeOnly(src) {
  const out = src.split('');
  const n = src.length;
  let i = 0;
  const blank = (a, b) => { for (let k = a; k < b && k < n; k++) if (out[k] !== '\n') out[k] = ' '; };
  while (i < n) {
    const c = src[i]; const d = src[i + 1];
    if (c === '/' && d === '/') { let j = i; while (j < n && src[j] !== '\n') j++; blank(i, j); i = j; continue; }
    if (c === '/' && d === '*') {
      let j = i + 2;
      while (j < n && !(src[j] === '*' && src[j + 1] === '/')) j++;
      blank(i, Math.min(j + 2, n)); i = j + 2; continue;
    }
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n) {
        if (src[j] === '\\') { j += 2; continue; }
        if (src[j] === c || src[j] === '\n') break;
        j++;
      }
      blank(i + 1, j); i = j + 1; continue;
    }
    if (c === '`') {
      let j = i + 1;
      while (j < n) {
        if (src[j] === '\\') { blank(j, j + 2); j += 2; continue; }
        if (src[j] === '`') break;
        if (src[j] === '$' && src[j + 1] === '{') {
          let depth = 1; j += 2;
          while (j < n && depth > 0) { if (src[j] === '{') depth++; else if (src[j] === '}') depth--; j++; }
          continue;
        }
        if (src[j] !== '\n') out[j] = ' ';
        j++;
      }
      i = j + 1; continue;
    }
    i++;
  }
  return out.join('');
}
