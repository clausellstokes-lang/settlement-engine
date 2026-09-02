/**
 * scripts/lib/tuning-inventory.mjs — THE TUNING ESTATE, MEASURED.
 *
 * ⛔⛔ THIS MODULE MEASURES. IT NEVER PROPOSES A VALUE, AND IT NEVER SIGNS ONE.
 * Tuning values are the owner's, signed LAST at the tuning sitting (THE PROMISE; the
 * carve-out by nature no delegation covers). Everything here is either a MEASUREMENT of
 * what the source already says or a REFUSAL of a write that would move a signed digest
 * without the owner's record. `status: 'signed'` is written by exactly one path — the
 * refreeze ritual driven by a signing record file — and by no other.
 *
 * ⭐ THE SURFACE, STATED BEFORE THE ARMS (FOLD 25's law). Three populations, every one a
 * TEXT measurement over `codeOnly`-stripped source, so a name written in prose is never
 * measured as a value:
 *
 *   P1 TABLES  — every `const *_TUNING` under `src/`, PLUS every (file, export) the
 *                declared register's `homes[]` names (the unsuffixed exports the glob
 *                cannot see: the density ladder, `HALF_LIFE_WEEKS`, `INTERVAL_WEEKS`,
 *                `CAUSAL_SWING`, the faith surface). TOTALITY BOTH WAYS: no baseline and
 *                no ceiling, because a new table must red BY ID until it is registered.
 *                A ceiling here would let a lane buy silence with a number.
 *   P2 NAMED   — module-top-level `const UPPER_SNAKE = <numeric>;` outside every P1 span
 *                and not an aggregator leaf. SHRINK-ONLY per file, new files at 0.
 *   P3 BARE    — bare decimal literals in code text outside every P1 span and P2 line.
 *                SHRINK-ONLY per file, new files at 0.
 *
 * ⚠ P2/P3 SCOPE IS `src/domain` + `src/generators`, NOT ALL OF `src` — the two trees that
 * are exactly the seeded pipeline. `src/data`'s catalogs carry thousands of non-tuning
 * numerics and would drown the signal. The two `_TUNING` tables outside `src/domain`
 * (`src/data/informationBrokerageTuning.js`, `src/lib/townScene/adaptiveQuality.js`) are
 * still P1: totality is over ALL of `src`, only the shrink-only populations are scoped.
 *
 * ⭐ THE CANNOT-CATCH LIST, STATED SO NOBODY RE-DERIVES IT AS A DISCOVERY. P3 counts
 * decimals; it does NOT count integer tuning literals (`>= 30`, the 52/104/156 cooldowns,
 * the 6-tick window), and it does not read regex literals. A decimal inside `${…}` IS
 * counted (an interpolation is code); a decimal inside a comment or a string is NOT (the
 * shared strip blanks both, and the URL trap proves it). `1.0` and `0.5` count like any
 * other decimal. Widening P3 to integers is an owner row, not a lane's choice.
 *
 * ⚠ TWO FILES, NOT ONE MODULE, AND THE SPLIT IS LOAD-BEARING. `.tuning-inventory.json` is
 * MEASURED and machine-written by the ritual alone; `.tuning-register.json` is DECLARED and
 * is the pen's file. "Never hand-edit a measured field" is therefore structural rather than
 * a promise in a docblock. It also keeps 208 prose `note`s out of `src/domain`, where
 * `tests/copy/voiceMechanics.test.js` scans every string literal at a banked ceiling with
 * zero headroom.
 *
 * Pure except where it is explicitly not: `resolveDependents`/`measureTree` read the
 * filesystem, `refreezeRefusals` shells out to git for a dirty-tree check and a sha
 * resolution. No describe/test lives here.
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname, resolve as resolvePath } from 'node:path';
import { execFileSync } from 'node:child_process';
import { parse as espreeParse } from 'espree';
import { codeOnly } from '../../tests/helpers/codeOnlySource.js';

/** The totality tree: a table anywhere under `src/` must be registered. */
export const TREES_P1 = Object.freeze(['src']);
/** The shrink-only trees: exactly the seeded pipeline. */
export const TREES_P2P3 = Object.freeze(['src/domain', 'src/generators']);

/** A tuning table definition line. Anchored at line start so a mention cannot match. */
export const TABLE_DEF_RE = /^\s*(export\s+)?const\s+([A-Za-z0-9_]*_TUNING)\b/;
/** A module-top-level named numeric constant. No leading space: top level only. */
export const NAMED_NUMERIC_CONST_RE = /^(export\s+)?const\s+([A-Z][A-Z0-9_]+)\s*=\s*(-?\d+(?:\.\d+)?)\s*;/;
/** A bare decimal literal, not part of an identifier or a member access. */
export const BARE_DECIMAL_RE = /(?<![\w.])\d+\.\d+(?![\w.])/g;

/** The closed unit vocabulary. FINITE SEMANTICS: fourteen words, typed, never free text. */
export const UNIT_VOCABULARY = Object.freeze([
  'ticks', 'weeks', 'years', 'fraction01', 'probability', 'share', 'count',
  'people', 'mouths', 'score100', 'points', 'multiplier', 'rank', 'mixed',
]);

/** Why two members of one role may legitimately hold different values. */
export const DIVERGENCE_REASONS = Object.freeze(['distinct-by-design', 'unit-differs', 'drift-suspected']);

/** How a table's leaves are written. `computed` is the HONEST fallback, never a failure. */
export const IDIOMS = Object.freeze(['literal', 'aggregator', 'computed', 'mixed']);

/** The two states a declared row may hold. */
export const SIGNATURE_STATES = Object.freeze(['draft', 'signed']);

/**
 * The GOLDEN shift record's `cause` for a tuning version's re-record. The door itself
 * verifies FORM only and knows nothing of `signatures[]`, so this RE is the hook that
 * couples the two — read from BOTH directions by the walker's arms 33 and 33b.
 */
export const TUNING_SHIFT_CAUSE_RE = /^tuning-register v(\d+) signed (§\S+)/;

/**
 * The typed refusals the refreeze ritual may return. FINITE SEMANTICS: eight, closed.
 *
 * ⚠ THE EIGHTH IS `GENESIS_REFUSED`, AND IT IS THIS LANE'S ADDITION TO THE SEVEN THE DESIGN
 * NAMED. The design's list assumed an inventory already exists: with `previous` null, the
 * growth comparison reads every file as `0 -> N` and the FIRST refreeze can never succeed.
 * MEASURED, not reasoned — the genesis run refused itself with 221 phantom growth rows.
 * The fix is not to skip the guard silently, because that is the WRWALKER hazard exactly
 * (a second genesis would re-bank the whole live population with no history row). Genesis is
 * therefore an EXPLICIT, CHARTERED act that refuses when a baseline already exists.
 */
export const REFUSALS = Object.freeze([
  'DIRTY_TREE', 'BLANK_PROVENANCE', 'POPULATION_GREW', 'SIGNED_DIGEST_MOVED',
  'RECORD_VERSION_MISMATCH', 'RECORD_MALFORMED', 'ID_NOT_IN_RECORD', 'GENESIS_REFUSED',
]);

export const INVENTORY_REL = 'tests/lint/.tuning-inventory.json';
export const REGISTER_REL = 'tests/lint/.tuning-register.json';
export const SCHEMA_VERSION = 1;

/* ------------------------------------------------------------------ identity */

/**
 * THE ID GRAMMAR. Never the bare export name — three names collide across files
 * (`REACTION_TUNING` ×3, `LADDER_TUNING` ×2, `DISPATCH_TUNING` ×2), so a bare-name key
 * would silently fold seven distinct tables into three rows and the register would be
 * measuring something other than the estate.
 * @param {string} file repo-relative, forward slashes
 * @param {string} exportName
 * @returns {string} `<file>#<export>`
 */
export function tuningIdFor(file, exportName) {
  return `${String(file).replace(/\\/g, '/')}#${exportName}`;
}

/** The home file of an id. */
export const fileOfId = (id) => String(id).split('#')[0];
/** The export name of an id. */
export const exportOfId = (id) => String(id).split('#')[1];

/* ------------------------------------------------------------------ walking */

const SOURCE_RE = /\.(js|jsx)$/;
const isSourcePath = (rel) => SOURCE_RE.test(rel) && !/\.test\.(js|jsx)$/.test(rel);

/** Every source file under `dir`, repo-relative, sorted — deterministic by construction. */
export function walkSources(root, dir) {
  const abs = join(root, dir);
  if (!existsSync(abs)) return [];
  const out = [];
  const recurse = (d) => {
    for (const entry of readdirSync(d).sort()) {
      const p = join(d, entry);
      if (statSync(p).isDirectory()) recurse(p);
      else {
        const rel = relative(root, p).replace(/\\/g, '/');
        if (isSourcePath(rel)) out.push(rel);
      }
    }
  };
  recurse(abs);
  return out.sort();
}

/**
 * THE READ-AND-STRIP CACHE. Three of this module's passes want the same two strings for the
 * same ~1,200 files — the raw source and its `codeOnly` projection — and running the strip
 * once per pass put the whole measurement at 7.9 s against a 5 s target and a 10 s STOP.
 * Caching is not an optimisation here so much as the difference between an instrument that
 * rides the gate and one that has to be split. Scoped per `measureTree` call, so a walker
 * that measures a doctored tree in a temp dir never reads a stale entry.
 */
export function makeSourceCache() {
  const cache = new Map();
  return (root, file) => {
    const key = `${root}\u0000${file}`;
    let hit = cache.get(key);
    if (hit === undefined) {
      try {
        const raw = readFileSync(join(root, file), 'utf8');
        hit = {
          raw,
          get stripped() {
            const value = codeOnly(raw);
            Object.defineProperty(this, 'stripped', { value });
            return value;
          },
          get importHead() {
            // ⭐ THE SPECIFIER SCAN NEEDS THE STRIP, BUT ONLY WHERE A SPECIFIER CAN BE.
            // A docblock routinely writes `import { x } from './y.js'` as an EXAMPLE, so
            // the scan genuinely must read stripped text rather than raw — but stripping
            // 2,154 whole files to find imports that all sit near the top cost 5.5 s of a
            // 6.8 s measurement, against a 5 s target. Past the LAST line that could hold a
            // specifier there is by definition no match to find, so the strip stops there.
            // Truncation cannot hide a real import: an unclosed block comment before the
            // cut means the last candidate line is itself commented out, which is exactly
            // the answer the strip would have given anyway.
            let cut = 0;
            const re = /(?:from|import)\s*['"]/g;
            let match;
            while ((match = re.exec(raw)) !== null) cut = match.index;
            if (cut === 0 && !/(?:from|import)\s*['"]/.test(raw)) return '';
            const lineEnd = raw.indexOf('\n', cut);
            const value = codeOnly(raw.slice(0, lineEnd < 0 ? raw.length : lineEnd + 1));
            Object.defineProperty(this, 'importHead', { value });
            return value;
          },
        };
      } catch {
        hit = null;
      }
      cache.set(key, hit);
    }
    return hit;
  };
}

/* ------------------------------------------------------------------ the span */

/**
 * THE SPAN MACHINE, ADOPTED VERBATIM FROM THE RECON THAT PROVED IT (208/208 tables closed
 * at `60255ca8e`). Brace-matched from the first `{` after the `=` to the close of the
 * outermost wrapper, counting depth-1 `:` as keys, with comments and strings skipped INSIDE
 * the matcher so a brace in prose cannot move the end.
 *
 * ⚠ IT RETURNS `residue` AND THAT FIELD IS THE STOP. A span the machine cannot close is not
 * a table this instrument may guess at — the base has moved under the detector, and the
 * honest act is to red, not to record a truncated digest that would look like a measurement.
 *
 * @param {string} text file source, from the definition line onward
 * @returns {{ ok: boolean, spanText: string, keys: number, endOffset: number,
 *             lineSpan: number, wrapper: string, residue: string }}
 */
export function tableSpan(text) {
  const eq = text.indexOf('=');
  if (eq < 0) return { ok: false, spanText: '', keys: 0, endOffset: 0, lineSpan: 0, wrapper: 'none', residue: 'no `=` on the definition' };
  // ⛔ WHICHEVER DELIMITER COMES FIRST, AND THIS IS NOT A NICETY. A rostered table may be a
  // frozen ARRAY — `TIER_ORDER`, `IMPORTANCE_ORDER`, `FAITH_TUNING_COVERAGE`. Searching only
  // for `{` walks straight PAST the array and finds the brace of the NEXT declaration in the
  // file, so the span, and therefore the DIGEST, measured unrelated code. A signed digest over
  // the wrong text is worse than no digest: it would be stable, plausible, and about something
  // else entirely. MEASURED: three rostered arrays reported keys against zero leaves.
  const braceAt = text.indexOf('{', eq);
  const bracketAt = text.indexOf('[', eq);
  const open = braceAt < 0 ? bracketAt
    : bracketAt < 0 ? braceAt
      : Math.min(braceAt, bracketAt);
  if (open < 0) return { ok: false, spanText: '', keys: 0, endOffset: 0, lineSpan: 0, wrapper: 'none', residue: 'no `{` or `[` after the `=`' };

  const between = text.slice(eq + 1, open);
  const wrapper = /Object\.freeze\s*\(\s*$/.test(between) ? 'Object.freeze'
    : /deepFreeze\s*\(\s*$/.test(between) ? 'deepFreeze'
      : between.trim() === '' ? 'bare'
        : 'other';
  if (wrapper === 'other') {
    return { ok: false, spanText: '', keys: 0, endOffset: 0, lineSpan: 0, wrapper, residue: `unrecognised head "${between.trim().slice(0, 60)}"` };
  }

  let depth = 0;
  let keys = 0;
  let inStr = null;
  let inLineComment = false;
  let inBlockComment = false;
  let end = -1;
  for (let k = open; k < text.length; k++) {
    const c = text[k];
    const n = text[k + 1];
    if (inLineComment) { if (c === '\n') inLineComment = false; continue; }
    if (inBlockComment) { if (c === '*' && n === '/') { inBlockComment = false; k++; } continue; }
    if (inStr) {
      if (c === '\\') { k++; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '/' && n === '/') { inLineComment = true; continue; }
    if (c === '/' && n === '*') { inBlockComment = true; continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '{' || c === '[' || c === '(') { depth++; continue; }
    if (c === '}' || c === ']' || c === ')') {
      depth--;
      if (depth === 0) { end = k; break; }
      continue;
    }
    if (depth === 1 && c === ':') keys++;
  }
  if (end < 0) {
    return { ok: false, spanText: '', keys: 0, endOffset: 0, lineSpan: 0, wrapper, residue: 'the outermost brace never closed' };
  }

  // ⚠ THE ONE PLACE THIS DEPARTS FROM THE RECON, AND IT IS A REPAIR, NOT A REDESIGN. The
  // recon's machine starts depth at the `{`, so it closes on the matching `}` and STOPS —
  // one character short of `Object.freeze(`'s own `)`. That was invisible to the recon,
  // which only counted keys and lines, and it stays invisible to any consumer that only
  // digests the text. It is FATAL to a consumer that parses it: `Object.freeze({…}` is an
  // unterminated call, every table came back `unparsed`, and the whole estate silently
  // measured as `idiom: 'computed'` with zero leaves. Extending the end over the wrapper's
  // closing parens keeps the recon's proven depth-1 key semantics EXACTLY and makes the
  // span a complete expression. Measured: 210/210 tables parse after this, 0/210 before.
  const wrapperParens = wrapper === 'bare' ? 0 : 1;
  let close = end;
  for (let remaining = wrapperParens; remaining > 0;) {
    let k = close + 1;
    while (k < text.length && /\s/.test(text[k])) k++;
    if (text[k] !== ')') {
      return { ok: false, spanText: '', keys: 0, endOffset: 0, lineSpan: 0, wrapper, residue: `the ${wrapper} wrapper never closed` };
    }
    close = k;
    remaining -= 1;
  }
  const end2 = close;
  const spanText = text.slice(0, end2 + 1);
  return {
    ok: true,
    spanText,
    keys,
    endOffset: end2 + 1,
    lineSpan: spanText.split('\n').length,
    wrapper,
    residue: '',
  };
}

/**
 * THE SPAN DIGEST — `sha256` over the `codeOnly`-stripped, whitespace-normalised span.
 * BLIND to comments, docblocks and reflow by construction; SEES any key, value or
 * structural change. That blindness is the point: the `wizardNewsAuthoring` line-address
 * hazard bit this estate once already, and a digest that moved when someone added a
 * comment would make every documentation pass a signing event.
 */
export function spanDigest(spanText) {
  return createHash('sha256').update(normalizeWhitespace(codeOnly(spanText)), 'utf8').digest('hex');
}

/** Collapse every whitespace run to one space and trim. */
export function normalizeWhitespace(text) {
  return String(text).replace(/\s+/g, ' ').trim();
}

/* ------------------------------------------------------------------ leaves */

const ESPREE_OPTIONS = Object.freeze({
  ecmaVersion: 'latest',
  sourceType: 'module',
  ecmaFeatures: { jsx: true },
  range: true,
});

/**
 * Parse a span expression. Returns `{ node, offset }` where `offset` maps an AST range back
 * to a `spanText` index, or null when unparsable.
 *
 * ⚠ THE OFFSET IS NOT DECORATION. The expression is trimmed and wrapped in parentheses
 * before parsing, so AST ranges are shifted from `spanText` by the `=`, the leading
 * whitespace AND the added `(`. Slicing `spanText` with a raw AST range therefore returns
 * text from the wrong place — MEASURED: a computed leaf came back as the expression
 * `"he intended texture. STRENGTH: Object.freeze({ faint:"`, which is a fragment of the
 * table's own DOCBLOCK. It looked like a plausible `computed` fallback and was garbage.
 */
function objectNodeOf(spanText) {
  const eq = spanText.indexOf('=');
  if (eq < 0) return null;
  const rest = spanText.slice(eq + 1);
  const lead = rest.length - rest.trimStart().length;
  const expression = rest.trim().replace(/;\s*$/, '');
  let program;
  try {
    program = espreeParse(`(${expression})`, ESPREE_OPTIONS);
  } catch {
    return null;
  }
  let node = program.body[0]?.expression;
  while (node && node.type === 'CallExpression') node = node.arguments[0];
  if (!node || (node.type !== 'ObjectExpression' && node.type !== 'ArrayExpression')) return null;
  // AST index X sits at expression index X-1 (the wrapping paren), which sits at
  // spanText index eq + 1 + lead + (X - 1).
  return { node, offset: eq + lead };
}

/** The depth-1 key names an INDEPENDENT implementation reads from the syntax tree. */
export function astKeyNames(spanText) {
  const parsed = objectNodeOf(spanText);
  if (!parsed) return null;
  if (parsed.node.type === 'ArrayExpression') {
    // A frozen ARRAY is a table whose keys are its positions, and the ORDER is the meaning
    // (the tier ladder, the importance ladder). Indices are its key names.
    return parsed.node.elements.map((_, index) => String(index));
  }
  return parsed.node.properties
    .filter((property) => property.type === 'Property')
    .map((property) => keyNameOf(property))
    .filter((name) => name !== null);
}

const keyNameOf = (property) => {
  if (property.key.type === 'Identifier') return property.key.name;
  if (property.key.type === 'Literal') return String(property.key.value);
  return null;
};

/**
 * FLATTEN A SPAN TO `path -> LeafValue`. A LeafValue is a `number`, or `{ expr }` for an
 * expression this instrument deliberately does not evaluate, or `{ array }` for a list.
 *
 * ⚠ IT DOES NOT EVALUATE SOURCE. Importing `src/domain` to read a value would give this
 * measuring instrument a runtime dependency on the thing it measures, and one circular
 * import would turn a walker into a build. Everything here is read off the syntax tree.
 *
 * @returns {{ leaves: Record<string, unknown>, idiom: string, unparsed: boolean }}
 */
export function flattenLeaves(spanText) {
  const parsed = objectNodeOf(spanText);
  if (!parsed) return { leaves: {}, idiom: 'computed', unparsed: true };
  const { node: root, offset } = parsed;
  const leaves = {};
  const kinds = new Set();

  const literalNumber = (node) => {
    if (node.type === 'Literal' && typeof node.value === 'number') return node.value;
    if (node.type === 'UnaryExpression' && node.operator === '-'
      && node.argument.type === 'Literal' && typeof node.argument.value === 'number') {
      return -node.argument.value;
    }
    return undefined;
  };

  const descend = (node, path) => {
    if (node.type === 'ArrayExpression') {
      node.elements.forEach((element, index) => {
        const here = path ? `${path}.${index}` : String(index);
        if (!element) { kinds.add('computed'); return; }
        if (element.type === 'ObjectExpression' || element.type === 'ArrayExpression') { descend(element, here); return; }
        const asNumber = literalNumber(element);
        if (asNumber !== undefined) { leaves[here] = asNumber; kinds.add('literal'); return; }
        if (element.type === 'Literal') { leaves[here] = element.value; kinds.add('literal'); return; }
        if (element.type === 'Identifier') { leaves[here] = { expr: element.name }; kinds.add('aggregator'); return; }
        leaves[here] = { expr: normalizeWhitespace(codeOnly(spanText.slice(offset + element.range[0], offset + element.range[1]))).slice(0, 120) };
        kinds.add('computed');
      });
      return;
    }
    for (const property of node.properties) {
      if (property.type !== 'Property') { kinds.add('computed'); continue; }
      // ⚠ A COMPUTED KEY IS STILL A KEY, AND DROPPING IT SILENTLY IS THE ONE THING A
      // TOTALITY INSTRUMENT MAY NOT DO. `UPHEAVAL_TUNING.SENSITIVITY` is keyed by
      // `[A_ARCH.MILITARY]` and friends; the first cut returned no leaf for any of them, so
      // the table reported five keys and four leaves and a whole sensitivity ladder was
      // invisible to the register. The key's SOURCE TEXT becomes the path segment, which is
      // stable under reflow (the digest already ignores whitespace) and says plainly that
      // the name is an expression rather than a word.
      const name = keyNameOf(property)
        ?? normalizeWhitespace(codeOnly(spanText.slice(offset + property.key.range[0], offset + property.key.range[1])));
      if (!name) { kinds.add('computed'); continue; }
      const here = path ? `${path}.${name}` : name;
      const value = property.value;
      if (value.type === 'ObjectExpression' || value.type === 'ArrayExpression') { descend(value, here); continue; }
      if (value.type === 'CallExpression') {
        // `KEY: Object.freeze({...})` is a nested table, not an opaque expression.
        let inner = value;
        while (inner && inner.type === 'CallExpression') inner = inner.arguments[0];
        if (inner && (inner.type === 'ObjectExpression' || inner.type === 'ArrayExpression')) { descend(inner, here); continue; }
      }
      const asNumber = literalNumber(value);
      if (asNumber !== undefined) { leaves[here] = asNumber; kinds.add('literal'); continue; }
      if (value.type === 'Literal') { leaves[here] = value.value; kinds.add('literal'); continue; }
      if (value.type === 'ArrayExpression') {
        leaves[here] = { array: value.elements.length };
        kinds.add('literal');
        continue;
      }
      if (value.type === 'Identifier') {
        leaves[here] = { expr: value.name };
        kinds.add('aggregator');
        continue;
      }
      leaves[here] = { expr: normalizeWhitespace(codeOnly(spanText.slice(offset + value.range[0], offset + value.range[1]))).slice(0, 120) };
      kinds.add('computed');
    }
  };
  descend(root, '');

  return { leaves, idiom: idiomOf(kinds), unparsed: false };
}

/**
 * The idiom of a table, from the kinds its leaves exhibit. `mixed` is a real answer, not a
 * shrug: a table that is half literal and half computed is exactly the shape a reviewer
 * should be told about before signing it.
 */
export function idiomOf(kinds) {
  const set = kinds instanceof Set ? kinds : new Set(kinds);
  if (set.size === 0) return 'literal';
  if (set.size === 1) return [...set][0];
  return 'mixed';
}

/* ------------------------------------------------------------------ dependents */

/**
 * ⭐⭐ THE CITATION LAW'S SECOND FACE, EXECUTED — AND THE TRAP THAT MAKES IT NECESSARY.
 *
 * An import specifier is a CITATION, and the estate's ONE shared strip is a USE-claim strip:
 * `codeOnly` blanks string CONTENTS. Run it over `import { a } from './foo.js'` and you get
 * `import { a } from '        '` — the specifier is GONE. A dependents scan built on the
 * shared strip therefore finds nothing at all, silently, and reports the honest-looking
 * result that every table in the estate is unimported. MEASURED, not feared: the first cut
 * of this module did exactly that and returned `zeroDependentTables: 210 / 210`.
 *
 * The repair uses the shared strip for what it is FOR, and no second strip is invented.
 * `codeOnly` PRESERVES OFFSETS EXACTLY, so a match found in the STRIPPED text proves the
 * statement is real code rather than prose in a comment, while the specifier itself is read
 * out of the RAW text at those same offsets. USE claim from the strip; citation from source.
 */
const IMPORT_SPEC_RE = /(?:^|[\s;])(?:import|export)\s[^'"]*?from\s*(['"])/g;
const BARE_IMPORT_RE = /(?:^|[\s;])import\s*(['"])/g;
const REEXPORT_STAR_RE = /(?:^|[\s;])export\s*\*\s*(?:as\s+[A-Za-z0-9_$]+\s*)?from\s*(['"])/g;
/** The clause between `import`/`export` and `from` — the names actually taken. */
const IMPORT_CLAUSE_RE = /(?:^|[\s;])(?:import|export)\s+([^'"]*?)\s*from\s*(['"])/g;

/** Read the specifier out of RAW source at the offset the stripped text proved is code. */
function specifierAt(raw, quoteOffset, quote) {
  const end = raw.indexOf(quote, quoteOffset + 1);
  if (end < 0) return null;
  return raw.slice(quoteOffset + 1, end);
}

/** Every specifier `re` matches in `stripped`, read from `raw` at the same offsets. */
function specifiersVia(re, stripped, raw) {
  const out = [];
  re.lastIndex = 0;
  let match;
  while ((match = re.exec(stripped)) !== null) {
    const quoteOffset = match.index + match[0].length - 1;
    const specifier = specifierAt(raw, quoteOffset, match[1]);
    if (specifier) out.push(specifier);
  }
  return out;
}

/** Resolve a relative specifier against an importing file, to a repo-relative source path. */
export function resolveSpecifier(root, fromFile, specifier) {
  if (!specifier.startsWith('.')) return null;
  const base = resolvePath(join(root, dirname(fromFile)), specifier);
  const candidates = [base, `${base}.js`, `${base}.jsx`, join(base, 'index.js'), join(base, 'index.jsx')];
  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isFile()) {
      return relative(root, candidate).replace(/\\/g, '/');
    }
  }
  return null;
}

/**
 * MEASURE the importers of every source file, following re-exports ONE hop.
 *
 * ⭐ WHY THIS COLUMN EXISTS. The estate carries 113 of 206 `_TUNING` tables with no
 * consumer at all. That is not an opinion this design asserts — it is a number this
 * function measures, and the review reads it. A table nothing imports is a dial nobody can
 * turn, and a register that listed it beside a live one without saying so would be
 * flattering the estate rather than describing it.
 *
 * ⚠ A TABLE READ BY A TEST ONLY IS NOT DEAD — the test is its consumer. This scans `src/`
 * for the register's purposes and the caller is told which tree it measured.
 *
 * @returns {Map<string, string[]>} home file -> sorted importer files
 */
export function resolveDependents(root, trees = TREES_P1, sourceOf = makeSourceCache()) {
  const files = trees.flatMap((tree) => walkSources(root, tree));
  const direct = new Map();
  const reexports = new Map();
  const named = new Map(); // home file -> (importer -> { names:Set, namespace:boolean })
  for (const file of files) {
    const cached = sourceOf(root, file);
    if (!cached) continue;
    const raw = cached.raw;
    const stripped = cached.importHead;
    const targets = new Set();
    for (const re of [IMPORT_SPEC_RE, BARE_IMPORT_RE]) {
      for (const specifier of specifiersVia(re, stripped, raw)) {
        const target = resolveSpecifier(root, file, specifier);
        if (target) targets.add(target);
      }
    }
    for (const target of targets) {
      if (!direct.has(target)) direct.set(target, new Set());
      direct.get(target).add(file);
    }

    // THE SHARPER COLUMN: which NAMES this importer actually took from that file.
    IMPORT_CLAUSE_RE.lastIndex = 0;
    let clauseMatch;
    while ((clauseMatch = IMPORT_CLAUSE_RE.exec(stripped)) !== null) {
      const quoteOffset = clauseMatch.index + clauseMatch[0].length - 1;
      const specifier = specifierAt(raw, quoteOffset, clauseMatch[2]);
      if (!specifier) continue;
      const target = resolveSpecifier(root, file, specifier);
      if (!target) continue;
      const clause = clauseMatch[1];
      if (!named.has(target)) named.set(target, new Map());
      const perImporter = named.get(target);
      if (!perImporter.has(file)) perImporter.set(file, { names: new Set(), namespace: false });
      const entry = perImporter.get(file);
      // `import * as ns` / `export *` take everything, so every export is reached.
      if (/\*/.test(clause)) entry.namespace = true;
      const braces = /\{([^}]*)\}/.exec(clause);
      if (braces) {
        for (const part of braces[1].split(',')) {
          const name = part.trim().split(/\s+as\s+/)[0].trim();
          if (name) entry.names.add(name);
        }
      }
    }

    for (const specifier of specifiersVia(REEXPORT_STAR_RE, stripped, raw)) {
      const target = resolveSpecifier(root, file, specifier);
      if (target) {
        if (!reexports.has(file)) reexports.set(file, new Set());
        reexports.get(file).add(target);
      }
    }
  }
  // ONE HOP: an importer of a barrel that re-exports the home counts as a dependent.
  for (const [barrel, targets] of reexports) {
    const barrelImporters = direct.get(barrel);
    if (!barrelImporters) continue;
    for (const target of targets) {
      if (!direct.has(target)) direct.set(target, new Set());
      for (const importer of barrelImporters) direct.get(target).add(importer);
    }
  }
  const out = new Map();
  for (const [file, importers] of direct) out.set(file, [...importers].sort());
  return { byFile: out, byName: named };
}

/**
 * The importers that actually TAKE `exportName` from `file` — a namespace import counts,
 * because it reaches every export.
 *
 * ⚠ THIS COLUMN AND `dependents` ANSWER DIFFERENT QUESTIONS, AND THE DIFFERENCE IS LARGE.
 * `dependents` is the charter's letter — importers whose specifier resolves to the home
 * FILE — and at C′ it leaves only 8 of 210 tables at zero, because a file holding six
 * tables lends its one importer to all six. `namedDependents` is per EXPORT, and it is the
 * column a cull must read: deleting a table because its FILE is imported somewhere would
 * delete a live dial, and deleting one because no importer names it is the claim the
 * estate's 113/206 figure was actually making. Both are recorded; neither is inferred from
 * the other.
 */
export function namedDependentsOf(byName, file, exportName) {
  const perImporter = byName.get(file);
  if (!perImporter) return [];
  const out = [];
  for (const [importer, entry] of perImporter) {
    if (entry.namespace || entry.names.has(exportName)) out.push(importer);
  }
  return out.sort();
}

/* ------------------------------------------------------------------ discovery */

/**
 * Find every P1 table: the `_TUNING` glob over `src/`, PLUS every `homes[]` row the
 * declared register names. The roster half is how the unsuffixed exports the glob cannot
 * see — the density ladder, `HALF_LIFE_WEEKS`, `INTERVAL_WEEKS`, `CAUSAL_SWING`, the faith
 * surface — enter the register at all.
 *
 * @returns {{ tables: Array<object>, unclosed: Array<{id: string, residue: string}> }}
 */
export function discoverTables(root, register = null, sourceOf = makeSourceCache()) {
  const wanted = new Map(); // file -> Set(exportName) demanded by the roster
  for (const home of register?.homes ?? []) {
    if (home?.kind !== 'tables') continue;
    for (const name of home.exports ?? []) {
      if (!wanted.has(home.file)) wanted.set(home.file, new Set());
      wanted.get(home.file).add(name);
    }
  }

  const files = new Set(TREES_P1.flatMap((tree) => walkSources(root, tree)));
  for (const file of wanted.keys()) files.add(file);

  const tables = [];
  const unclosed = [];
  for (const file of [...files].sort()) {
    const cached = sourceOf(root, file);
    if (!cached) continue;
    const source = cached.raw;
    const lines = source.split('\n');
    const lineOffsets = [];
    { let at = 0; for (const l of lines) { lineOffsets.push(at); at += l.length + 1; } }
    const rosterHere = wanted.get(file) ?? new Set();
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const globbed = TABLE_DEF_RE.exec(line);
      let exportName = null;
      let exported = false;
      if (globbed) {
        exportName = globbed[2];
        exported = Boolean(globbed[1]);
      } else if (rosterHere.size) {
        const named = /^\s*(export\s+)?const\s+([A-Za-z0-9_]+)\s*=/.exec(line);
        if (named && rosterHere.has(named[2])) {
          exportName = named[2];
          exported = Boolean(named[1]);
        }
      }
      if (!exportName) continue;

      const from = lines.slice(i).join('\n');
      const span = tableSpan(from);
      const id = tuningIdFor(file, exportName);
      if (!span.ok) {
        // A scalar roster home (`export const CAUSAL_SWING = 20;`) is not a failure — it is
        // a one-leaf table, and refusing it would push a real dial out of the register.
        const scalar = /^\s*(export\s+)?const\s+[A-Za-z0-9_]+\s*=\s*(-?\d+(?:\.\d+)?)\s*;/.exec(line);
        if (scalar) {
          tables.push({
            id, file, export: exportName, exported, idiom: 'literal', keys: 1, line: i + 1,
            spanText: line, spanStart: lineOffsets[i], spanDigest: spanDigest(line), leaves: { value: Number(scalar[2]) },
            wrapper: 'scalar', lineSpan: 1,
          });
          continue;
        }
        unclosed.push({ id, residue: span.residue });
        continue;
      }
      const { leaves, idiom, unparsed } = flattenLeaves(span.spanText);
      // ⚠ THE KEY COUNT COMES FROM THE SYNTAX TREE, NOT THE `:` COUNTER, AND THE DIFFERENCE
      // IS NOT COSMETIC. The recon's machine counts depth-1 COLONS, so a SHORTHAND
      // aggregator — `Object.freeze({ BASE_ATTACKER_LOSS, BASE_DEFENDER_LOSS, ... })` —
      // carries no colon at all and reports ZERO keys for a real table. MEASURED: 21 of 210
      // tables disagree, `attrition.js#ATTRITION_TUNING` reading 0 against its actual 17.
      // The estate's own recon carried the same blind spot (it recorded "1,870 top-level
      // keys" alongside "12 shorthand aggregators" without reconciling the two). The tree
      // sees a shorthand property exactly as it sees a written one; the counter cannot.
      const astNames = astKeyNames(span.spanText);
      tables.push({
        id, file, export: exportName, exported,
        idiom: unparsed ? 'computed' : idiom,
        keys: astNames ? astNames.length : span.keys,
        machineKeys: span.keys,
        line: i + 1,
        spanText: span.spanText,
        spanStart: lineOffsets[i],
        spanDigest: spanDigest(span.spanText),
        leaves,
        wrapper: span.wrapper,
        lineSpan: span.lineSpan,
      });
    }
  }
  return { tables, unclosed };
}

/* ------------------------------------------------------------------ P2 / P3 */

/** Offsets covered by a P1 span within one file, so P2/P3 never double-count a table. */
function spanRangesFor(tables, file) {
  const ranges = [];
  for (const table of tables) {
    if (table.file !== file) continue;
    if (table.spanStart >= 0) ranges.push([table.spanStart, table.spanStart + table.spanText.length]);
  }
  return ranges;
}

const insideAny = (ranges, offset) => ranges.some(([a, b]) => offset >= a && offset < b);

/**
 * P2 — module-top-level named numeric constants outside every table span. Aggregator leaves
 * are REMOVED: a const that a table references by name is that table's value written once,
 * not a second unregistered dial, and counting it twice would punish the tidier idiom.
 */
export function countUnregisteredNamed(root, tables, trees = TREES_P2P3, sourceOf = makeSourceCache()) {
  const counts = {};
  const sites = {};
  const aggregatorNames = new Set();
  for (const table of tables) {
    for (const leaf of Object.values(table.leaves ?? {})) {
      if (leaf && typeof leaf === 'object' && typeof leaf.expr === 'string') aggregatorNames.add(leaf.expr);
    }
  }
  for (const file of trees.flatMap((tree) => walkSources(root, tree))) {
    const cached = sourceOf(root, file);
    if (!cached) continue;
    const { stripped } = cached;
    const ranges = spanRangesFor(tables, file);
    const lines = stripped.split('\n');
    let offset = 0;
    let n = 0;
    const found = [];
    for (const line of lines) {
      const match = NAMED_NUMERIC_CONST_RE.exec(line);
      if (match && !insideAny(ranges, offset) && !aggregatorNames.has(match[2])) {
        n += 1;
        found.push(match[2]);
      }
      offset += line.length + 1;
    }
    if (n > 0) { counts[file] = n; sites[file] = found; }
  }
  return { counts, sites };
}

/**
 * P3 — bare decimal literals in code text, outside every table span and every P2 line.
 * The strip is what makes this honest: a decimal inside a URL in a comment is prose, and
 * the URL trap plant exists to keep that true.
 */
export function countBareDecimals(root, tables, trees = TREES_P2P3, sourceOf = makeSourceCache()) {
  const counts = {};
  for (const file of trees.flatMap((tree) => walkSources(root, tree))) {
    const cached = sourceOf(root, file);
    if (!cached) continue;
    const { stripped } = cached;
    const ranges = spanRangesFor(tables, file);
    const namedLines = new Set();
    {
      let offset = 0;
      for (const line of stripped.split('\n')) {
        if (NAMED_NUMERIC_CONST_RE.test(line)) namedLines.add(offset);
        offset += line.length + 1;
      }
    }
    const lineStartOf = (index) => stripped.lastIndexOf('\n', index - 1) + 1;
    let n = 0;
    BARE_DECIMAL_RE.lastIndex = 0;
    let match;
    while ((match = BARE_DECIMAL_RE.exec(stripped)) !== null) {
      const at = match.index;
      if (insideAny(ranges, at)) continue;
      if (namedLines.has(lineStartOf(at))) continue;
      n += 1;
    }
    if (n > 0) counts[file] = n;
  }
  return counts;
}

/* ------------------------------------------------------------------ the measurement */

/**
 * THE ONE SPELLING OF THE MEASUREMENT. The assertion arms and the refreeze ritual both read
 * the estate through this function, so what is frozen is BY CONSTRUCTION what is asserted.
 * A regeneration path carrying its own copy of these scans would be a second implementation
 * that drifts, and the drift would be invisible because each half would agree with itself.
 *
 * @param {string} root repo root (absolute)
 * @param {object|null} register the declared register, for its `homes[]` roster
 * @returns {object} a `TuningInventory`
 */
export function measureTree(root, register = null) {
  const sourceOf = makeSourceCache();
  const { tables, unclosed } = discoverTables(root, register, sourceOf);
  const { byFile, byName } = resolveDependents(root, TREES_P1, sourceOf);
  const { counts: unregisteredNamed } = countUnregisteredNamed(root, tables, TREES_P2P3, sourceOf);
  const bareDecimals = countBareDecimals(root, tables, TREES_P2P3, sourceOf);

  const measured = {};
  for (const table of tables) {
    measured[table.id] = {
      exported: table.exported,
      idiom: table.idiom,
      keys: table.keys,
      line: table.line,
      spanDigest: table.spanDigest,
      leaves: table.leaves,
      dependents: (byFile.get(table.file) ?? []).filter((f) => f !== table.file),
      namedDependents: namedDependentsOf(byName, table.file, table.export).filter((f) => f !== table.file),
    };
  }

  const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);
  return {
    schemaVersion: SCHEMA_VERSION,
    trees: { p1: [...TREES_P1], p2p3: [...TREES_P2P3] },
    tables: measured,
    unregisteredNamed,
    bareDecimals,
    unclosed,
    totals: {
      tables: Object.keys(measured).length,
      keys: Object.values(measured).reduce((a, t) => a + t.keys, 0),
      unregisteredNamed: sum(unregisteredNamed),
      bareDecimals: sum(bareDecimals),
      zeroDependentTables: Object.values(measured).filter((t) => t.dependents.length === 0).length,
      zeroNamedDependentTables: Object.values(measured).filter((t) => t.namedDependents.length === 0).length,
    },
  };
}

/* ------------------------------------------------------------------ loading */

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));

/** Load the DECLARED register. Returns null when absent — callers fail closed. */
export function loadTuningRegister(root) {
  const path = join(root, REGISTER_REL);
  if (!existsSync(path)) return null;
  return readJson(path);
}

/** Load the MEASURED inventory. Returns null when absent — callers fail closed. */
export function loadTuningInventory(root) {
  const path = join(root, INVENTORY_REL);
  if (!existsSync(path)) return null;
  return readJson(path);
}

/**
 * The signature state of one id. FAIL CLOSED: an id with no declared row is `draft` at
 * version 0, never `signed`, so a missing row can never read as an owner's approval.
 */
export function signatureStateOf(register, id) {
  const row = register?.tables?.[id];
  const version = Number(register?.signatureVersion ?? 0);
  if (!row) return { status: 'draft', signedAt: null, version };
  return {
    status: row.status === 'signed' ? 'signed' : 'draft',
    signedAt: row.status === 'signed' ? (row.signedAt ?? null) : null,
    version,
  };
}

/**
 * THE FINGERPRINT every consumer reads — SOAKCHAIN's receipts, READERREVIEW's manifest,
 * CAPACITY's provenance. Digests of the two files as they sit on disk, so a receipt can
 * prove which register version a run executed under.
 */
export function tuningRegisterFingerprint(root) {
  const sha256 = (rel) => {
    const path = join(root, rel);
    if (!existsSync(path)) return null;
    return createHash('sha256').update(readFileSync(path)).digest('hex');
  };
  const register = loadTuningRegister(root);
  const inventory = loadTuningInventory(root);
  return {
    signatureVersion: Number(register?.signatureVersion ?? 0),
    measuredAtSha: inventory?.measuredAtSha ?? null,
    declaredSha256: sha256(REGISTER_REL),
    inventorySha256: sha256(INVENTORY_REL),
  };
}

/* ------------------------------------------------------------------ the ritual */

/**
 * ⚠⚠ PORCELAIN LINES ARE READ WITHOUT TRIMMING THE OUTPUT, AND THAT IS A BUG THIS LANE
 * ALREADY PAID FOR. `git status --porcelain` spells a modified-unstaged file as `" M path"`,
 * with a LEADING SPACE that is part of the two-character status field. Trimming the whole
 * output eats that space on the FIRST LINE ONLY, so a `slice(3)` that is correct for every
 * other line strips one character too many from line one. MEASURED, verbatim from the
 * refusal this produced: `Dirty: ests/lint/.tuning-inventory.json` — the permitted path,
 * mangled, and therefore not matching the allowlist, so the refreeze refused itself for a
 * file it was built to allow. The failure is SILENT in the safe direction, which is exactly
 * why it survives: it refuses when it should permit, and a refusal reads as caution.
 */
const gitPorcelainPaths = (root) => execFileSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' })
  .split('\n')
  .filter((line) => line.length > 3)
  .map((line) => line.slice(3).trim())
  .filter(Boolean);

/** True when `sha` names a real commit in this checkout's object store. */
export function gitResolvesCommitIn(root, sha) {
  try {
    execFileSync('git', ['cat-file', '-e', `${sha}^{commit}`], { cwd: root, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * THE REFUSALS, AS A PURE-ENOUGH FUNCTION SO THE ARMS CAN DRIVE EVERY BRANCH.
 *
 * ⭐ WHY THE RITUAL LIVES IN THE WALKER AND NOT IN A `--update` CLI. This estate has the
 * receipt for the other choice: `voiceMechanics`' bare `writeFileSync` banked +1013 rows in
 * silence, because a documented `UPDATE_*` mode with no shrink guard is a mode that disarms
 * the guard it belongs to. Keeping every refusal in ONE function, driven by the walker's
 * own arms, means the refusal logic is TESTED by the same run that enforces it. The CLI is
 * report-only.
 *
 * ⛔ AND THE SIGNING BRANCH IS THE OWNER'S, NOT A LANE'S. `SIGNED_DIGEST_MOVED` is the
 * refusal that makes the promise mechanical: once a value is signed, its digest is frozen,
 * and moving it requires a signing record naming that exact id at that exact version. A
 * retune is version N+1 by construction. No path in this module writes `status: 'signed'`
 * without a record file that the owner wrote.
 *
 * @returns {{ ok: boolean, refusal: string|null, detail: string }}
 */
export function refreezeRefusals({
  root,
  measuredBy,
  note,
  previous,
  measured,
  register,
  record = null,
  genesisCharter = null,
  allowedDirty = [INVENTORY_REL],
}) {
  const who = String(measuredBy ?? '').trim();
  const why = String(note ?? '').trim();
  if (who === '' || who === '1' || why === '') {
    return {
      ok: false,
      refusal: 'BLANK_PROVENANCE',
      detail: 'provenance is an input, not a formality — set TUNING_INVENTORY_REFREEZE to the'
        + ' lane or seat doing the measuring (not "1") and TUNING_INVENTORY_NOTE to the cause.',
    };
  }

  // A `git archive` extraction carries no object store at all, and the wave-end attribution
  // method runs suites inside exactly those trees. A caller that shelled out unconditionally
  // would red in the trees it is read in most, so an unanswerable tree reports no dirt.
  const dirty = (() => {
    try {
      return gitPorcelainPaths(root).filter((path) => !allowedDirty.includes(path));
    } catch {
      return [];
    }
  })();
  if (dirty.length) {
    return {
      ok: false,
      refusal: 'DIRTY_TREE',
      detail: `this inventory measures the WORKING TREE, and in a shared tree those paths may`
        + ` belong to another lane. Commit first, then refreeze at the clean tip. Dirty: ${dirty.join(', ')}`,
    };
  }

  // GENESIS — the first write, and the only one with nothing to be measured against.
  const charter = String(genesisCharter ?? '').trim();
  if (previous == null) {
    if (!/^\u00a7\S+/.test(charter)) {
      return {
        ok: false,
        refusal: 'GENESIS_REFUSED',
        detail: 'there is no committed inventory, so this is a GENESIS and every population'
          + ' would be banked from nothing. That is an explicit, chartered act: set'
          + ' TUNING_INVENTORY_GENESIS to the charter section authorising it.',
      };
    }
  } else if (charter !== '') {
    return {
      ok: false,
      refusal: 'GENESIS_REFUSED',
      detail: `a committed inventory already exists, so a GENESIS is refused. A second genesis`
        + ' would silently re-bank the whole live population with no history row, which is the'
        + ' one movement a shrink-only register can never recover from. Refreeze without'
        + ' TUNING_INVENTORY_GENESIS, and let the growth door attribute what actually moved.',
    };
  }

  // POPULATION GROWTH — shrink-only, with DECLARED_GROWTH the one attributed door.
  const declaredGrowth = register?.declaredGrowth ?? {};
  const grew = [];
  for (const population of previous == null ? [] : ['unregisteredNamed', 'bareDecimals']) {
    const before = previous?.[population] ?? {};
    const after = measured?.[population] ?? {};
    for (const [file, count] of Object.entries(after)) {
      const was = before[file] ?? 0;
      if (count <= was) continue;
      const declared = declaredGrowth[population]?.[file];
      if (!declared) { grew.push(`${population}:${file} ${was} -> ${count} (no DECLARED_GROWTH row)`); continue; }
      if (!/^[0-9a-f]{40}$/.test(String(declared.introducedAt ?? ''))) {
        grew.push(`${population}:${file} DECLARED_GROWTH introducedAt is not a 40-hex sha`);
        continue;
      }
      if (!gitResolvesCommitIn(root, String(declared.introducedAt))) {
        grew.push(`${population}:${file} DECLARED_GROWTH introducedAt ${declared.introducedAt} resolves to NO commit`);
        continue;
      }
      if (String(declared.cause ?? '').length <= 60) {
        grew.push(`${population}:${file} DECLARED_GROWTH cause is shorter than 60 characters`);
        continue;
      }
      if (Number(declared.sites ?? 0) < count - was) {
        grew.push(`${population}:${file} DECLARED_GROWTH declares ${declared.sites} sites, measured +${count - was}`);
      }
    }
  }
  if (grew.length) {
    return { ok: false, refusal: 'POPULATION_GREW', detail: grew.join('; ') };
  }

  // SIGNED DIGESTS — frozen unless a valid signing record names the id at this version.
  const signedIds = Object.entries(register?.tables ?? {})
    .filter(([, row]) => row?.status === 'signed')
    .map(([id]) => id);
  const moved = signedIds.filter((id) => {
    const was = previous?.tables?.[id]?.spanDigest;
    const now = measured?.tables?.[id]?.spanDigest;
    return was && now && was !== now;
  });
  if (moved.length) {
    if (!record) {
      return {
        ok: false,
        refusal: 'SIGNED_DIGEST_MOVED',
        detail: `a SIGNED table's value changed with no signing record: ${moved.join(', ')}.`
          + ' A retune of a signed value is version N+1 through the owner\'s door, never an edit.',
      };
    }
    const malformed = signingRecordMalformations(record);
    if (malformed) return { ok: false, refusal: 'RECORD_MALFORMED', detail: malformed };
    const expected = Number(register?.signatureVersion ?? 0) + 1;
    if (Number(record.version) !== expected) {
      return {
        ok: false,
        refusal: 'RECORD_VERSION_MISMATCH',
        detail: `the record is version ${record.version}; versions are dense from 1 and the`
          + ` register sits at ${register?.signatureVersion ?? 0}, so the next is ${expected}.`,
      };
    }
    const notNamed = moved.filter((id) => !(record.ids ?? []).includes(id));
    if (notNamed.length) {
      return {
        ok: false,
        refusal: 'ID_NOT_IN_RECORD',
        detail: `the record does not name: ${notNamed.join(', ')}. The write is refused WHOLE —`
          + ' a record signs exactly the ids it names and never one more.',
      };
    }
  }

  return { ok: true, refusal: null, detail: '' };
}

/** The malformations of a signing record, as one message, or null when it is well formed. */
export function signingRecordMalformations(record) {
  if (!record || typeof record !== 'object') return 'the signing record is not an object';
  const problems = [];
  for (const field of ['ownerWords', 'ownerDate', 'odqRow', 'seat']) {
    if (typeof record[field] !== 'string' || record[field].trim() === '') {
      problems.push(`'${field}' is blank — the owner's word is the record`);
    }
  }
  if (!Number.isInteger(record.version) || record.version < 1) {
    problems.push(`'version' is ${JSON.stringify(record.version)}; versions are dense integers from 1`);
  }
  if (!Array.isArray(record.ids) || record.ids.length === 0) {
    problems.push("'ids' is empty — a record that names no table signs nothing");
  }
  return problems.length ? problems.join('; ') : null;
}

/* ------------------------------------------------------------------ signing */

/**
 * ⛔⛔ THE ONE PATH THAT MAY EVER WRITE `status: 'signed'`, AND IT IS THE OWNER'S.
 *
 * It is a PURE FUNCTION returning a NEW register, which is how "all or none" stops being a
 * promise and becomes a property: there is no partial state to leave behind, because nothing
 * is mutated. Either a complete next register comes back, or a typed refusal does.
 *
 * WHAT IT REFUSES, and why each refusal is the owner's protection rather than a formality:
 *  - a malformed record: the owner's words, date and ODQ row ARE the record. A blank
 *    template must not sign anything, and it ships blank so that arm always has a subject.
 *  - a version that is not exactly N+1: versions are dense from 1, so a signature can never
 *    be inserted into a gap or written twice at one number.
 *  - an id the register does not carry: a record cannot sign a table nobody registered.
 *  - a UNIT-LESS id: signing a value whose meaning nobody wrote down is signing a number,
 *    not a decision. The owner may sign a value; nobody may sign an unlabelled one.
 *  - a MODULE-SIDE id: the owner ruled at §725.1 that no map constant is launch tuning.
 *    The register may INDEX them by totality; the sitting may not sign them.
 *
 * It signs EXACTLY the ids the record names and never one more, and it records the live
 * `spanDigest` of each at the moment of signing, which is what freezes the value: a retune
 * afterwards moves the digest, and moving a signed digest is version N+1 by construction.
 *
 * @returns {{ ok: boolean, refusal: string|null, detail: string, register: object|null }}
 */
export function applySigningRecord({ register, inventory, record, date = null }) {
  const refuse = (refusal, detail) => ({ ok: false, refusal, detail, register: null });

  const malformed = signingRecordMalformations(record);
  if (malformed) return refuse('RECORD_MALFORMED', malformed);

  const expected = Number(register?.signatureVersion ?? 0) + 1;
  if (Number(record.version) !== expected) {
    return refuse('RECORD_VERSION_MISMATCH',
      `the record is version ${record.version}; the register sits at`
      + ` ${register?.signatureVersion ?? 0}, so the next dense version is ${expected}.`);
  }

  const problems = [];
  for (const id of record.ids) {
    if (!register.tables?.[id]) { problems.push(`${id}: no declared row`); continue; }
    if (!inventory?.tables?.[id]) { problems.push(`${id}: no measured table`); continue; }
    if (register.tables[id].unit === null) {
      problems.push(`${id}: unit-less — signing it would sign a number whose meaning nobody wrote down`);
    }
    if ((register.moduleSide ?? []).some((prefix) => id.startsWith(prefix))) {
      problems.push(`${id}: module-side (§725.1) — the register indexes it; the sitting does not sign it`);
    }
  }
  if (problems.length) return refuse('ID_NOT_IN_RECORD', problems.join('; '));

  const digests = {};
  for (const id of record.ids) digests[id] = inventory.tables[id].spanDigest;

  const tables = { ...register.tables };
  for (const id of record.ids) {
    tables[id] = { ...tables[id], status: 'signed', signedAt: record.version };
  }
  const signatures = [...(register.signatures ?? []), {
    version: record.version,
    date: date ?? record.ownerDate,
    signedBy: record.seat,
    odqRow: record.odqRow,
    ownerWords: record.ownerWords,
    ids: [...record.ids],
    digests,
    goldenShiftRecord: null,
  }];

  return {
    ok: true,
    refusal: null,
    detail: '',
    register: { ...register, signatureVersion: record.version, signatures, tables },
  };
}

/**
 * THE SITTING'S DESK SHEET. Every DRAFT table with what the owner needs in front of them to
 * sign it: what it is, what unit it carries, what it holds now, who reads it, and which role
 * it belongs to. Module-side ids are EXCLUDED and counted separately — §725.1 put every map
 * constant outside launch tuning, so they may be indexed but never put on this desk.
 */
export function deskSheet(register, inventory, { roster = [] } = {}) {
  const moduleSide = register.moduleSide ?? [];
  const isModuleSide = (id) => moduleSide.some((prefix) => id.startsWith(prefix));
  const roleOf = (id) => Object.entries(register.roles ?? {})
    .filter(([, role]) => role.members.some((member) => member.startsWith(`${id}.`) || member === id))
    .map(([name]) => name);

  const rows = [];
  let excluded = 0;
  for (const [id, row] of Object.entries(register.tables)) {
    if (isModuleSide(id)) { excluded += 1; continue; }
    const measured = inventory?.tables?.[id];
    rows.push({
      id,
      status: row.status,
      unit: row.unit,
      band: row.band,
      keys: measured?.keys ?? 0,
      values: measured?.leaves ?? {},
      dependents: measured?.dependents?.length ?? 0,
      namedDependents: measured?.namedDependents?.length ?? 0,
      roles: roleOf(id),
      onRoster: roster.includes(id),
    });
  }
  rows.sort((a, b) => {
    if (a.onRoster !== b.onRoster) return a.onRoster ? -1 : 1;
    if ((a.unit === null) !== (b.unit === null)) return a.unit === null ? 1 : -1;
    return a.id.localeCompare(b.id);
  });
  return { rows, moduleSideExcluded: excluded };
}
