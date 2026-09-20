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
 * ⭐ THE SECOND STRIP, AND WHY IT IS HERE RATHER THAN IN A NEW FILE (FIX-T2, 2026-09-20).
 * `commentsOnly` blanks comments and KEEPS string, template and regex text. It serves the
 * opposite class from `codeOnly`: a detector counting a RENDERED or BEHAVIOURAL literal —
 * a JSX text node, a `<button` tag, a `'Loading…'` string, a `fallback={null}` prop — is
 * measuring something that only exists INSIDE a literal, so `codeOnly` blanks exactly the
 * evidence and the instrument goes vacuously green. What such a detector must still refuse
 * to count is the same word written in PROSE. The two live in one file because they must
 * never disagree about what a comment is.
 *
 * ⛔ THERE IS A THIRD STRIP IN THIS ESTATE AND IT IS NOT A RIVAL — PICK BY THE QUESTION
 * (chair's ruling, ODQ §934.47 addendum 90, 2026-09-20). `stripComments` in
 * `tests/helpers/dossierManifest.js` (CURE-J, `c127cdfb2`) is DIGEST-grade: it REMOVES
 * comments, collapses whitespace and keeps a comment written inside a `${…}` interpolation,
 * so it answers "is this the same CODE?" for an identity pin and deliberately errs toward an
 * extra re-record. `commentsOnly` below is COUNTER-grade: it BLANKS in place, preserves every
 * offset so a match keeps its true `file:line`, and blanks interpolation comments too,
 * because for a counter a kept comment is a counted comment. Reach for the digest when you
 * are hashing; reach for this one when you are counting or reporting an address. Measured on
 * the two shipped ratchet patterns, they agree on the totals exactly (32 → 29, 38 → 37), so
 * the choice is about contract, not arithmetic.
 *
 * The estate has hand-rolled this second strip at least five times (`withoutComments` in
 * `tests/build/customContentCharsetLazy.test.js`; `stripComments` in
 * `tests/build/contentIdentityLazy.test.js` and in
 * `tests/application/commands/commandRegistry.walker.test.js`; the one-line regex pair in
 * `tests/lint/clampPrimitiveBaseline.test.js` and `tests/lint/slugifyIdiomBaseline.test.js`)
 * — a second spelling of a source strip is how two instruments come to disagree while both
 * report green.
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

/**
 * COMMENTS BLANKED, LITERALS KEPT — the strip for a detector that counts a RENDERED or
 * BEHAVIOURAL literal. String, template and regex TEXT survives byte-for-byte; only `//`,
 * block and JSX `{/* … *\/}` comments become spaces. Offsets and newlines are preserved, so
 * a match found in the stripped text is at its true source offset.
 *
 * ⛔ WHY IT TRACKS STRINGS AND REGEX LITERALS THOUGH IT BLANKS NEITHER. It has to know
 * where they END. A naive scanner that only hunts `//` blanks the rest of the line from
 * inside `'https://x'`, and one that only tracks quotes swallows a file from the `'` inside
 * `/['"`>]Loading/` — which is this estate's own ratchet regex. The regex-opener rule (a
 * `/` can only open a literal where an expression may begin) is `codeSkeleton`'s, in
 * `tests/lint/contractTestAntiVacuity.walker.test.js`, including its measured `'>'`-after-
 * arrow case.
 *
 * ⛔ THE TWO EXTRA GUARDS ARE BOTH MEASURED, NOT TASTE. `/>` is ambiguous: `<Foo {...p} />`
 * self-closes after a `}` (an opener), while `expect(/>/.test(line))` is a real regex whose
 * body is `>`. Scored against `@babel/parser` over 5,148 files: gating on `d !== '>'` alone
 * leaves 26 comment characters standing in `tests/domain/amnestyJubileeRegistration.test.js`
 * (the real `/>/`); no gate at all leaves 24 in `tests/ui/CommandPalette.test.jsx` (the JSX).
 * Requiring the `>` to be closed immediately by `/`, AND abandoning a regex scan that runs
 * into a `//`, each drive that to ZERO on their own; both ship, because each closes the
 * other's only observed failure and an unescaped `//` cannot occur inside a regex body
 * outside a character class anyway.
 *
 * ⛔ A TEMPLATE INTERPOLATION IS CODE, SO IT IS RE-ENTERED, NOT SKIPPED. The first cut of
 * this function skipped `${…}` whole and declared the comment inside one a cannot-catch.
 * The byte-differential against `@babel/parser` refuted that in the tree's own source:
 * `src/domain/display/defenseDisplay.js:379` writes
 * `` `Upkeep underfunded: ${…Math.round(/** @type {number} *\/ (gate) * 100)}%` ``, 164
 * comment characters the skip left standing. The interpolation stack below is why the
 * differential now reports zero disagreement over all 2,247 files.
 *
 * @param {string} src @returns {string} the same string, COMMENTS blanked, every literal's
 * text intact, offsets and newlines preserved.
 */
export function commentsOnly(src) {
  const out = src.split('');
  const n = src.length;
  const blank = (a, b) => { for (let k = a; k < b && k < n; k++) if (out[k] !== '\n') out[k] = ' '; };
  let i = 0;
  let prev = '';
  // Each entry is the brace depth the enclosing interpolation opened at; a `}` seen at
  // depth 0 with a non-empty stack closes the interpolation and returns us to template text.
  const templates = [];
  let depth = 0;
  let inTemplateText = false;
  while (i < n) {
    const c = src[i]; const d = src[i + 1];
    if (inTemplateText) {
      if (c === '\\') { i += 2; continue; }
      if (c === '`') { inTemplateText = false; prev = '`'; i++; continue; }
      if (c === '$' && d === '{') {
        templates.push(depth); depth = 0; inTemplateText = false; prev = '{'; i += 2; continue;
      }
      i++; continue;
    }
    if (c === '/' && d === '/') { let j = i; while (j < n && src[j] !== '\n') j++; blank(i, j); i = j; continue; }
    if (c === '/' && d === '*') {
      let j = i + 2;
      while (j < n && !(src[j] === '*' && src[j + 1] === '/')) j++;
      const end = Math.min(j + 2, n);
      blank(i, end); i = end; continue;
    }
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n) {
        if (src[j] === '\\') { j += 2; continue; }
        if (src[j] === c || src[j] === '\n') break;
        j++;
      }
      i = j + 1; prev = c; continue;
    }
    if (c === '`') { inTemplateText = true; i++; continue; }
    if (c === '{') { depth++; prev = '{'; i++; continue; }
    if (c === '}') {
      if (depth === 0 && templates.length) { depth = templates.pop(); inTemplateText = true; i++; continue; }
      if (depth > 0) depth--;
      prev = '}'; i++; continue;
    }
    if (c === '/' && !(d === '>' && src[i + 2] !== '/') && (prev === '' || '(,=:[!&|?{;}>+-*%^~'.includes(prev))) {
      let j = i + 1; let cls = false; let aborted = false;
      while (j < n) {
        if (src[j] === '\\') { j += 2; continue; }
        if (src[j] === '\n') break;
        if (src[j] === '/' && src[j + 1] === '/' && !cls) { aborted = true; break; }
        if (src[j] === '[') cls = true;
        else if (src[j] === ']') cls = false;
        else if (src[j] === '/' && !cls) break;
        j++;
      }
      if (!aborted && j < n && src[j] === '/') {
        i = j + 1;
        while (i < n && /[a-z]/i.test(src[i])) i++;
        prev = '/'; continue;
      }
    }
    if (!/\s/.test(c)) prev = c;
    i++;
  }
  return out.join('');
}
