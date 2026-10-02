/**
 * domain/prose/wiringCensus.js — INSTR-912 car 8: THE WIRING CENSUS.
 *
 * ⚠ AN INSTRUMENT, NOT A PRODUCT SURFACE. Nothing under `src/` outside `src/domain/prose/`
 * may import this module, and the walker asserts that by bytes. It runs at the gate and in
 * a lane's probe; it never runs at the draw, it holds no state, and it reads no file (every
 * source it measures arrives as a STRING from the caller — the test helper owns the I/O).
 *
 * ── WHAT THE OWNER ASKED FOR (2026-09-07 ~19:55, the 19:01 addendum) ────────────────
 * Every variant is already tied to a state by three things: its block's reading function,
 * its POOL KEY's selecting predicate (the field and the value that choose the pool), and
 * the slots the composer's bag fills. This module recovers that triple per (block, pool)
 * and prints it beside the composed-fill census, so that the wave has a YARDSTICK:
 *
 *   The BEFORE's prose is evidence of what the pool was WRITTEN to say.
 *   The wiring is what it is ENTITLED to say.
 *
 * A BEFORE claim the wiring does not license is a PRE-EXISTING unlicensed claim — banked
 * for the wave as NOTE/WITHHELD, never counted as a rewrite failure. A pool whose predicate
 * is not recoverable is `WIRING-UNRESOLVED` with its reason, never inferred from the prose.
 *
 * ── THE RECOVERY LADDER, DECLARED IN ORDER, AND WHY IT STOPS WHERE IT STOPS ─────────
 * The key STRINGS are human-readable predicates ("COMBINATION C2: a high rung on a narrow
 * approach"). They are the LABEL and they are never the predicate: reading a field out of a
 * pool name is exactly the inference the owner forbade. So the ladder reads the composers'
 * SOURCE and nothing else:
 *
 *   1. LITERAL — a `…PoolKey` function's body returns the key as a string literal. The
 *      predicate is the branch's own guard, split into `{field, op, value}` rows.
 *   2. TEMPLATE — the body returns `` `posture ${status}` `` and the pool is "posture peace".
 *      The pattern binds the hole to "peace" and the hole's expression resolves to a field,
 *      so the predicate is `{field, '===', 'peace'}`. That is recovery: the value is READ
 *      OFF the key against the template the composer itself wrote.
 *   3. TABLE — a module-level `const NAME = { '<value>': '<pool key>' }` and a function that
 *      indexes it. The predicate is `{field: the indexing expression, '===', the map key}`.
 *   4. Everything else is WIRING-UNRESOLVED with the reason MEASURED (an unmounted block, a
 *      corpus-derived key table, a key built inside a non-key function, a key literal that
 *      appears in no composer source at all).
 *
 * Rung 4 is not a failure of the instrument; it is the instrument's finding. A block the
 * mount registry does not mount has no composer, therefore no predicate, therefore no pool
 * of it can be spoken — and that is the sharpest MISSING signal the authoring wave gets.
 *
 * ── THE MAP READS BOTH WAYS (the owner's 21:50 addendum) ────────────────────────────
 * `factIndex` inverts the same rows: for every fact a key function reads, which pools can
 * speak to it, with how many variants and how many grammars. `tierRows` then sorts the
 * dossier's blocks into MISSING (a held fact, or a co-occurring fact PAIR, with no pool),
 * THIN (one variant, one grammar, or a slot set of {settlement} alone) and COVERED. Every
 * tier row names the block, the field(s), the reading function and the COUNT that put it
 * there, so the chair can hand the wave a list and not a judgment.
 *
 * ⚠ NO THRESHOLD IS BAKED IN. `coOccurringPairs` takes its "many towns" floor as an
 * argument and returns NOT-EXECUTABLE without one (car 7's tuning-register lesson: a number
 * this module invented would become a design constraint nobody re-asked).
 */
import { sourceOfRow } from './holderTable.js';
import { classifyMoves, orderIdOf } from './moveGrammar.js';
import {
  balancedSlice, branchPath, fieldChains, guardFields, readingAliases,
} from './wiringBranch.js';

// THE TWO SOURCE READERS THIS MODULE OWNED UNTIL ARCH CAR 0e MOVE WHOLE to `wiringBranch.js`
// beside the branch reader that needs them, and are re-exported here so that the estate keeps
// ONE bracket reader and ONE chain reader (`tests/helpers/dossierComposedFill.js` re-exports
// `balancedSlice` from this module and still does).
export { balancedSlice, fieldChains };

/** Statuses a census row can carry. RESOLVED means the predicate was READ, never guessed. */
export const WIRING_STATUS = Object.freeze({
  RESOLVED: 'RESOLVED',
  UNRESOLVED: 'WIRING-UNRESOLVED',
});

/**
 * The tiers the authoring wave is sized from. The fourth arrives with the RATE corpus
 * (SITTING §O.5): a pool that fires somewhere and never at a size where its block mounts,
 * whose silence the corpus cannot explain by the branch choosing another value class there.
 */
export const TIERS = Object.freeze({
  MISSING: 'MISSING', THIN: 'THIN', COVERED: 'COVERED', MISSING_AT_TIER: 'MISSING-AT-TIER',
});

// ── THE SOURCE READERS (pure; every input is a string) ──────────────────────────────

/**
 * Comments name fields constantly and explain at length why they are NOT read. A reader
 * that measured them would report a composer's own reasoning as its reach.
 * @param {string} src
 * @returns {string}
 */
export function codeOnly(src) {
  return String(src)
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .split('\n')
    .filter((line) => !/^\s*\/\//.test(line))
    .join('\n');
}

/**
 * @typedef {object} KeyFunction
 * @property {string} file
 * @property {string} name
 * @property {string[]} params
 * @property {string} body code-only
 * @property {number} line
 */

/**
 * Every `…PoolKey` function in one composer's source, with its parameter names and body.
 * @param {string} src
 * @param {string} file
 * @returns {KeyFunction[]}
 */
export function poolKeyFunctions(src, file) {
  /** @type {KeyFunction[]} */
  const out = [];
  for (const m of src.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*[Pp]oolKey)\s*\(/g)) {
    const open = (m.index || 0) + m[0].length - 1;
    /** @type {{inner: string, end: number}} */
    let args;
    try { args = balancedSlice(src, open); } catch { continue; }
    const brace = src.indexOf('{', args.end);
    if (brace < 0) continue;
    /** @type {{inner: string, end: number}} */
    let body;
    try { body = balancedSlice(src, brace); } catch { continue; }
    out.push({
      file,
      name: m[1],
      params: args.inner.split(',')
        .map((p) => (p.trim().match(/^([A-Za-z_$][\w$]*)/) || ['', ''])[1])
        .filter(Boolean),
      body: codeOnly(body.inner),
      line: src.slice(0, m.index).split('\n').length,
    });
  }
  return out;
}

/**
 * The local `const` aliases of a function body, mapped to the first param-rooted chain in
 * their initialiser. `const state = text(captureState)` makes `state` a reading of
 * `captureState`; without this hop the commonest predicate shape in the estate
 * (`if (state === 'capture')`) resolves to no field at all.
 *
 * ⛔ THE BARE LIMB STAYS AT THE LEADING IDENTIFIER, AND THAT IS A REFUSAL WITH A NUMBER
 * (ARCH car 0e). Reading one token further — the first PARAM the initialiser names rather
 * than its first identifier — gives 50 more aliases and resolves 50 more pools through the
 * template rung (RESOLVED 318 to 368), and FIFTY OF THOSE PREDICATES WOULD BE FALSE:
 * `beastsRowPoolKey`'s `const family = measuredMonsterFamily(monsterThreat)` is a LOOKUP,
 * so `family === 'settled'` becomes `config.monsterThreat === 'settled'` while the config
 * value that produces it is `heartland`. This map answers "what VALUE selects the pool" and
 * a lookup breaks that; `readingAliases` in `wiringBranch.js` answers the other question,
 * "what field does the branch READ", where the same hop is exact and is taken.
 * @param {string} body
 * @param {ReadonlyArray<string>} params
 * @returns {Map<string, string>} alias → the chain it reads
 */
export function localAliases(body, params) {
  /** @type {Map<string, string>} */
  const out = new Map();
  for (const m of body.matchAll(/\bconst\s+([A-Za-z_$][\w$]*)\s*=\s*([^;\n]+)/g)) {
    const chains = fieldChains(m[2], params);
    if (chains.length) { out.set(m[1], chains[0]); continue; }
    const bare = m[2].match(/\b([A-Za-z_$][\w$]*)\b/);
    if (bare && params.includes(bare[1])) out.set(m[1], bare[1]);
  }
  return out;
}

/**
 * @typedef {object} PredicateRow
 * @property {string} field the reading the branch consults, as the source spells it
 * @property {string} op `===` `!==` `<` `>` `<=` `>=` `truthy` `falsy` `else`
 * @property {string} value the literal the field is compared against, or a note
 */

/**
 * One guard expression, split at `&&` / `||` into `{field, op, value}` rows. An atom whose
 * subject resolves to no reading is dropped rather than guessed — a predicate row nobody
 * can trace to a field is the inference this census exists to refuse.
 * @param {string} guard
 * @param {ReadonlyArray<string>} params
 * @param {Map<string, string>} aliases
 * @returns {PredicateRow[]}
 */
export function predicateRows(guard, params, aliases) {
  /** @param {string} name @returns {string} */
  const resolve = (name) => {
    const chains = fieldChains(name, params);
    if (chains.length) return chains[0];
    const head = (name.match(/\b([A-Za-z_$][\w$]*)\b/) || ['', ''])[1];
    if (params.includes(head)) return head;
    const alias = aliases.get(head);
    return alias || '';
  };
  /** @type {PredicateRow[]} */
  const rows = [];
  for (const atom of String(guard).split(/&&|\|\|/)) {
    const cmp = atom.match(/^\s*!?\(?\s*([A-Za-z_$][\w$.?[\]'"\s]*?)\s*(===|!==|<=|>=|<|>)\s*(.+?)\)?\s*$/);
    if (cmp) {
      const field = resolve(cmp[1]);
      if (!field) continue;
      rows.push({ field, op: cmp[2], value: cmp[3].trim().replace(/^['"`]|['"`]$/g, '') });
      continue;
    }
    const bare = atom.match(/^\s*(!?)\s*([A-Za-z_$][\w$.?]*)\s*$/);
    if (!bare) continue;
    const field = resolve(bare[2]);
    if (!field) continue;
    // The `(!?)` group captures the negation mark or the empty string, so a non-empty
    // capture IS the negation: the mark itself never has to sit in a string literal.
    rows.push({ field, op: bare[1] ? 'falsy' : 'truthy', value: '(no literal)' });
  }
  return rows;
}

/**
 * @typedef {object} KeyForm
 * @property {'literal'|'template'} kind
 * @property {string} text the literal, or the template with each hole replaced by the NUL marker
 * @property {string[]} holes the hole expressions, in order
 * @property {string} guard the nearest preceding `if (…)` on the same statement, or ''
 * @property {string[]} path every guard on the path from the function entry to this literal
 */

/**
 * The hole marker, and the pair separator in `coOccurringPairs`. Both are U+0000, written
 * as an ESCAPE and never as a byte: a marker that CAN occur in the subject (a space, a
 * colon) makes a template carrying that character split into the wrong number of parts, and
 * it does so silently.
 */
const HOLE = '\u0000';

/**
 * @typedef {object} StringLiteral
 * @property {'single'|'double'|'template'} kind
 * @property {string} text the literal's own bytes, escapes left as written
 * @property {number} index where it opens in the body
 */

/**
 * EVERY string literal in a body, read by ONE scanner that knows all three quote characters.
 *
 * ⛔ WHY THIS REPLACED THREE INDEPENDENT REGEXES (INSTR-912 car 10, cure 7). `keyForms` used
 * to scan single quotes with `/'((?:[^'\\]|\\.)*)'/g` over a body `codeOnly` strips of
 * COMMENTS but not of STRINGS. A regex that knows one quote character cannot see the other
 * two, so one apostrophe inside a DOUBLE-quoted literal — `warFaithStateProse.js:668` returns
 * `"NICHE: the patron's niche carries a contestant"` — opened a phantom string and ate every
 * later single-quoted key in that function. And the same blindness in the other direction
 * meant a key WRITTEN with double quotes was never a key form at all, so its pool read
 * WIRING-UNRESOLVED with a reason that is affirmatively untrue.
 *
 * ⭐ MEASURED, AND IT CORRECTS THE FOLD'S MECHANISM. FOLD-2 attributes four false-UNRESOLVED
 * rows (DS-FTH-3 ×2, DS-ECO-11, DS-GEN-8) to the desync alone. Executed: the desync's live
 * reach is exactly ONE row (`DS-FTH-3 :: NICHE: every niche uncontested`, the key that
 * followed the apostrophe); the other three are keys the composers WROTE in double quotes,
 * which no mask can reach. One scanner closes both halves — which is why this is a scanner
 * and not a mask.
 * @param {string} body
 * @returns {StringLiteral[]} in source order
 */
export function stringLiterals(body) {
  const src = String(body);
  /** @type {StringLiteral[]} */
  const out = [];
  for (let i = 0; i < src.length; i++) {
    const quote = src[i];
    if (quote !== '\'' && quote !== '"' && quote !== '`') continue;
    let j = i + 1;
    let text = '';
    while (j < src.length && src[j] !== quote) {
      if (src[j] === '\\') { text += src[j] + (src[j + 1] ?? ''); j += 2; continue; }
      text += src[j];
      j += 1;
    }
    // An UNTERMINATED literal is where a one-quote scanner starts inventing. Stop reading
    // rather than run on: a partial roster of key forms is a finding, a desynced one is a lie.
    if (j >= src.length) break;
    /** @type {'single'|'double'|'template'} */
    let kind = 'template';
    if (quote === '\'') kind = 'single';
    else if (quote === '"') kind = 'double';
    out.push({ kind, text, index: i });
    i = j;
  }
  return out;
}

/**
 * Every key FORM a function body can produce — string literals and template patterns —
 * each carrying the guard that stands immediately before it.
 *
 * THE LADDER'S ORDER IS THE DOCBLOCK'S ORDER: every LITERAL first (rung 1), then every
 * TEMPLATE (rung 2). The scanner reads in source order; this function does not, because the
 * rung a pool is attributed to must not depend on where in a function body its key happens
 * to be written.
 * @param {KeyFunction} fn
 * @returns {KeyForm[]}
 */
export function keyForms(fn) {
  /** @type {KeyForm[]} */
  const out = [];
  const literals = stringLiterals(fn.body);
  /** @param {number} at @returns {string} */
  const guardAt = (at) => {
    const before = fn.body.slice(0, at);
    // ⛔ THE **LAST** `if (` BEFORE THE LITERAL, NEVER THE LEFTMOST (INSTR-912 car 10, cure 1).
    // `String.match` with a non-global, `$`-anchored pattern takes the leftmost START that can
    // reach the end, so in a key function with more than one branch `[\s\S]*?` spanned from
    // the FIRST `if (` to the last `)` before the literal and swallowed every statement in
    // between. `predicateRows` then either failed to parse the blob (→ `predicate: []`, 143
    // rows of 310) or parsed a garbage atom (11 rows carrying a code fragment as their
    // VALUE). The estate's key functions are ladders — `shadowEconomyPoolKey` has four `if`s
    // before its last literal — and the one-branch control could not exercise that shape,
    // which is why the defect was invisible to the gate for two cars.
    let last = -1;
    for (const hit of before.matchAll(/\bif\s*\(/g)) last = hit.index ?? last;
    if (last < 0) return '';
    const m = before.slice(last).match(/^if\s*\(([\s\S]*?)\)\s*(?:\{\s*)?(?:return\s*)?$/);
    return m ? m[1].replace(/\s+/g, ' ').trim() : '';
  };
  // RUNG 1 — every plain literal, in EITHER quote, plus a backtick literal with no hole.
  for (const lit of literals) {
    if (lit.kind === 'template' && lit.text.includes('${')) continue;
    out.push({
      kind: 'literal', text: lit.text, holes: [], guard: guardAt(lit.index),
      path: branchPath(fn.body, lit.index),
    });
  }
  // RUNG 2 — the templates.
  for (const lit of literals) {
    if (lit.kind !== 'template' || !lit.text.includes('${')) continue;
    /** @type {string[]} */
    const holes = [];
    const text = lit.text.replace(/\$\{([^}]*)\}/g, (_, e) => { holes.push(String(e).trim()); return HOLE; });
    // A template that is nothing BUT a hole matches every key ever written; it recovers
    // nothing and would make the census claim total coverage it does not have.
    if (text === HOLE) continue;
    out.push({
      kind: 'template', text, holes, guard: guardAt(lit.index),
      path: branchPath(fn.body, lit.index),
    });
  }
  return out;
}

/**
 * Bind a template form to a concrete pool key. Returns the hole bindings, or null.
 * @param {KeyForm} form
 * @param {string} key
 * @returns {Array<{hole: string, value: string}>|null}
 */
export function bindTemplate(form, key) {
  if (form.kind !== 'template') return null;
  const parts = form.text.split(HOLE);
  const source = `^${parts.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('(.+?)')}$`;
  const m = String(key).match(new RegExp(source));
  if (!m) return null;
  return form.holes.map((hole, i) => ({ hole, value: m[i + 1] }));
}

/**
 * @typedef {object} KeyTable
 * @property {string} name
 * @property {Array<{value: string, key: string}>} entries map key → pool key
 * @property {string[]} readers the expressions this table is indexed by
 * @property {'object'|'pairs'} shape the literal the composer wrote it as
 */

/**
 * The expressions a module-level table is CONSULTED by — an index `NAME[expr]` and, for a
 * pair array, the value a `.find` compares its first element against.
 * @param {string} src code-only
 * @param {string} name
 * @returns {string[]}
 */
function tableReaders(src, name) {
  /** @type {string[]} */
  const readers = [];
  for (const r of src.matchAll(new RegExp(`\\b${name}\\s*\\??\\[([^\\]]+)\\]`, 'g'))) readers.push(r[1].trim());
  for (const r of src.matchAll(new RegExp(`\\b${name}\\s*\\.\\s*find\\s*\\(`, 'g'))) {
    const open = (r.index || 0) + r[0].length - 1;
    /** @type {{inner: string, end: number}} */
    let args;
    try { args = balancedSlice(src, open); } catch { continue; }
    const cmp = args.inner.match(/===\s*([A-Za-z_$][\w$.?[\]']*)/);
    if (cmp) readers.push(cmp[1].trim());
  }
  return readers;
}

/**
 * Module-level key tables and the expressions that index them. Rung 3 of the ladder: the
 * predicate is the indexing expression compared against the table's own key.
 *
 * TWO SHAPES, because the estate writes two. `{ '<field value>': '<pool key>' }` is the
 * commoner one; `Object.freeze([['<field value>', '<pool key>'], …])` consulted through
 * `.find(([token]) => token === x)` is the other (`powerStateProse.js:304`'s
 * `STABILITY_LADDER`). ⛔ READING ONLY THE FIRST SHAPE WAS A MEASURED DEFECT (INSTR-912
 * car 10, cure 6): four DS-POW-2 rows read WIRING-UNRESOLVED carrying the reason *no
 * module-level key table names it* while a module-level key table named every one of them.
 * A reason that is affirmatively untrue is worse than no reason, because the tier table the
 * authoring wave is sized from counts it.
 * @param {string} src code-only
 * @returns {KeyTable[]}
 */
export function moduleKeyTables(src) {
  /** @type {KeyTable[]} */
  const out = [];
  for (const m of src.matchAll(/\bconst\s+([A-Z][A-Z0-9_]*)\s*=\s*(?:Object\.freeze\()?\s*\{/g)) {
    const brace = src.indexOf('{', (m.index || 0) + m[0].length - 1);
    /** @type {{inner: string, end: number}} */
    let obj;
    try { obj = balancedSlice(src, brace); } catch { continue; }
    /** @type {Array<{value: string, key: string}>} */
    const entries = [];
    for (const e of obj.inner.matchAll(/(?:'([^']*)'|"([^"]*)"|([A-Za-z_$][\w$]*))\s*:\s*'([^']*)'/g)) {
      entries.push({ value: e[1] ?? e[2] ?? e[3], key: e[4] });
    }
    if (entries.length === 0) continue;
    out.push({
      name: m[1], entries, readers: tableReaders(src, m[1]), shape: 'object',
    });
  }
  // THE PAIR-ARRAY SHAPE — `const NAME = Object.freeze([['<value>', '<pool key>'], …])`.
  for (const m of src.matchAll(/\bconst\s+([A-Z][A-Z0-9_]*)\s*=\s*(?:Object\.freeze\()?\s*\[/g)) {
    const bracket = src.indexOf('[', (m.index || 0) + m[0].length - 1);
    /** @type {{inner: string, end: number}} */
    let arr;
    try { arr = balancedSlice(src, bracket); } catch { continue; }
    /** @type {Array<{value: string, key: string}>} */
    const entries = [];
    for (const e of arr.inner.matchAll(/\[\s*'([^']*)'\s*,\s*'([^']*)'\s*\]/g)) {
      entries.push({ value: e[1], key: e[2] });
    }
    if (entries.length === 0) continue;
    out.push({
      name: m[1], entries, readers: tableReaders(src, m[1]), shape: 'pairs',
    });
  }
  return out;
}

/**
 * The argument expressions a key function is CALLED with, per parameter. This is the hop
 * that joins a key function's local parameter name to the composer's own reading path, so
 * `legitimacy.governanceFractured` becomes `readings.legitimacy.governanceFractured` and
 * the fact→text map can join to car 5's unrendered-facts census.
 * @param {string} src code-only
 * @param {KeyFunction} fn
 * @returns {Map<string, string[]>} param → the argument expressions seen
 */
export function callArguments(src, fn) {
  /** @type {Map<string, string[]>} */
  const out = new Map();
  for (const m of src.matchAll(new RegExp(`\\b${fn.name}\\s*\\(`, 'g'))) {
    const open = (m.index || 0) + m[0].length - 1;
    /** @type {{inner: string, end: number}} */
    let args;
    try { args = balancedSlice(src, open); } catch { continue; }
    if (/function\s*$/.test(src.slice(Math.max(0, (m.index || 0) - 20), m.index))) continue;
    const parts = args.inner.split(',').map((p) => p.trim());
    fn.params.forEach((p, i) => {
      const expr = parts[i];
      if (!expr || !/^[A-Za-z_$][\w$.?]*$/.test(expr)) return;
      if (!out.has(p)) out.set(p, []);
      const list = out.get(p);
      if (list && !list.includes(expr)) list.push(expr);
    });
  }
  return out;
}

// ── THE CENSUS ──────────────────────────────────────────────────────────────────────

/**
 * @typedef {object} CensusRow
 * @property {string} block
 * @property {string} pool
 * @property {PredicateRow[]} predicate
 * @property {string[]} fieldsRead every reading the block's key function touches
 * @property {string[]} slotsFilled the slots the composer's bag can offer here
 * @property {string[]} slotsNamed the slots this pool's variants actually name
 * @property {string[]} slotsWithoutProvider named, but never filled
 * @property {boolean} hasBag does any composer call site offer this block a bag at all?
 * @property {'RESOLVED'|'WIRING-UNRESOLVED'} status
 * @property {string} reason why, when UNRESOLVED
 * @property {string} keyFunction the function that produces the key, or ''
 * @property {'literal'|'template'|'table'|'annex'|'none'} rung which rung of the ladder answered
 * @property {'spine'|'modifier'|'turn'} [role] the pool's declared ROLE (ARCH §2.3), absent on
 *   every shipped pool because every shipped pool is a spine. A row whose role is `modifier`
 *   is NOT a spine of its block, so every corpus figure derived over SPINES excludes it: the
 *   attach sets, the fact budget, the mounts-per-fact table, the tiers and the summary all
 *   read the spine rows alone, and the modifier rows are counted in their own line. That is
 *   what keeps every pinned integer of this register meaning what it was pinned to mean on
 *   the day the estate's first modifier pool is born.
 * @property {number} variants
 * @property {number} grammars distinct move orders across the pool's variants
 * ── ARCH car 0's columns, written by `decorateRows` in the census's second pass ──
 * @property {string[]} [branchReads] the SELECTING BRANCH's own fields, [] where none was recovered
 * @property {'branch'|'function'} [readsGrain] which grain `reads` carries (ARCH §O.1)
 * @property {string[]} [reads] what the pool is ENTITLED to claim: `tests` unless narrowed
 * @property {boolean} [narrowed] did a chair-ruled NARROWS line narrow `reads`?
 * @property {Record<string, string>} [absent] per read path: measured | default | not-produced
 * @property {boolean} [covert] any read on the frozen COVERT-SOURCE list
 * @property {string|null} [objectClass] the civic object the KEY names, from the closed list
 * @property {string[]} [objectClasses] EVERY class the key names; T-F12 refuses on the SET
 * @property {string[]} [sites] the mounts where this pool can speak
 * @property {string[]} [attach] a MODIFIER's derived spine set; empty on a spine
 * @property {number|null} [k] the fact budget `3 - |reads|`; null when UNRESOLVED
 * @property {number|null} [rateBp] the firing share on the RATE corpus, in basis points
 * @property {0|1|null} [departure] the norm bit, frozen at the pool's birth car
 * ── SEAM car 5b's column (SITTING §Q), written by `decorateRows` in the same second pass ──
 * @property {{kind: string, kinds: string[], fields: Record<string, string>, holder: null,
 *   holderReason: string, standing: string, twoSource: boolean}} [source] the in-world SOURCE of
 *   every fact this pool reads: the record-holder KIND per field, the row's own standing, and a
 *   `holder` that is null WITH ITS REASON because a register is not a town (`holdersOf` names
 *   the institution and `standingOf` its standing once a settlement is supplied)
 */

/**
 * @typedef {object} CensusInput
 * @property {Map<string, string>} sources composer path → its source text
 * @property {Map<string, Map<string, ReadonlyArray<{text: string, slots?: ReadonlyArray<string>}>>>} pools
 *   block → pool key → its variants
 * @property {Map<string, ReadonlyArray<string>>} [fill] block → the slots the composer offers
 * @property {Map<string, ReadonlyArray<string>>} [fillByKeyFunction] `block :: keyFn` → the
 *   slots the bag at THAT call site offers. The composed-fill census's own header says the
 *   bag is keyed on the (block, pool) pair or it is wrong (`craftSlots` fills {resource} on
 *   HOME-FED and refuses it on STALLED, in one block); this is that refinement, and the
 *   block-wide bag is the fallback when no call site can be attributed.
 * @property {ReadonlyArray<string>} [unmounted] blocks the mount registry does not mount
 * @property {Map<string, NarrowsLine>} [narrows] the chair-ruled NARROWS lines, `block :: pool` keyed
 * @property {Set<string>} [produced] every leaf key some writer in the estate writes
 * @property {ReadonlyArray<{mount: string, tab: string, blockId: string}>} [mounts] the mount registry
 * @property {Map<string, {role: string, reads: ReadonlyArray<string>}>} [declared] the ANNEX's
 *   own typed declaration per `block :: pool` (ARCH §2.5's `ROLE:` and `READS:` lines). It
 *   exists for ONE class of pool: a MODIFIER, whose selecting predicate lives in its desk's
 *   `*StateProseCandidates.js` leaf and not in a pool-key function, so none of the ladder's
 *   three rungs can ever answer for it and the row would read WIRING-UNRESOLVED with no
 *   reading at all. The projector then refuses the pool's own `READS:` line against an empty
 *   `tests`, which is a deadlock rather than a finding.
 *
 *   ⛔ THE READING IS AUTHOR-DECLARED AND THE ROW SAYS SO. `rung: 'annex'` is a FOURTH rung
 *   and it is weaker than the other three by construction: nothing in this module verified
 *   it against code. The executable cross-check is the candidate leaf's own arm (TASTE car
 *   M-3), which asserts that every field a candidate function reads is a field its annex row
 *   declares and no other. The veto shape is a full AST rung over the candidate leaves —
 *   a second key-recovery ladder for a second call shape — priced on the receipt.
 */

/**
 * THE (block, pool) → {predicate, fields read, slots filled} CENSUS.
 * @param {CensusInput} input
 * @returns {{rows: CensusRow[], functions: number, consulted: number, tables: number,
 *   refusals: string[]}}
 *   `functions` is how many key functions the reader FOUND; `consulted` is how many the
 *   ladder actually walks. The two must be equal, and the walker asserts it. `refusals`
 *   carries every NARROWS line the second pass refused, with its reason.
 */
export function wiringCensus(input) {
  const sources = input.sources || new Map();
  /** @type {KeyFunction[]} */
  const fns = [];
  /** @type {Map<string, KeyTable[]>} */
  const tables = new Map();
  /** @type {Map<string, string>} */
  const code = new Map();
  for (const [file, src] of sources) {
    const bare = codeOnly(src);
    code.set(file, bare);
    fns.push(...poolKeyFunctions(src, file));
    tables.set(file, moduleKeyTables(bare));
  }
  /** @type {Map<string, {fn: KeyFunction, forms: KeyForm[], aliases: Map<string, string>, readAliases: Map<string, string>, args: Map<string, string[]>}>} */
  const prepared = new Map();
  for (const fn of fns) {
    // ⛔ KEYED ON `file::name`, NEVER ON THE BARE NAME (INSTR-912 car 10, cure 8). Two desks
    // both export `foodSecurityPoolKey` (`economyStateProse.js:394`, `generalStateProse.js:354`),
    // so a bare-name key silently dropped one of them: 118 functions found, 117 consulted,
    // and the walker asserted 118 — `fns.length`, not what the ladder reads. Harmless at this
    // tip (both are corpus-derived and return no literal), and the next same-named pair would
    // have lost real keys with no gate saying so. `consulted` is published so the two counts
    // can be asserted EQUAL rather than one standing in for the other.
    prepared.set(`${fn.file}::${fn.name}`, {
      fn,
      forms: keyForms(fn),
      aliases: localAliases(fn.body, fn.params),
      // A SECOND MAP, FOR THE READ AND NEVER FOR THE VALUE (see `readingAliases`).
      readAliases: readingAliases(fn.body, fn.params),
      args: callArguments(code.get(fn.file) || '', fn),
    });
  }
  const unmounted = new Set(input.unmounted || []);
  /** @type {CensusRow[]} */
  const rows = [];
  for (const [block, poolMap] of input.pools || new Map()) {
    const filled = [...(input.fill?.get(block) || [])].sort();
    for (const [pool, variants] of poolMap) {
      const row = censusRow({
        block, pool, variants, filled, prepared, tables, unmounted, declared: input.declared,
      });
      // THE PER-CALL-SITE REFINEMENT, applied once the ladder has named the key function.
      const perSite = row.keyFunction ? input.fillByKeyFunction?.get(`${block} :: ${row.keyFunction}`) : undefined;
      if (perSite) {
        row.slotsFilled = [...perSite].sort();
        row.slotsWithoutProvider = row.slotsNamed.filter((slot) => !row.slotsFilled.includes(slot));
      }
      rows.push(row);
    }
  }
  let tableCount = 0;
  for (const list of tables.values()) tableCount += list.length;
  // THE SECOND PASS (ARCH car 0). Six columns need a row's own recovered `fieldsRead` and
  // the estate's own tables, so they are written after every row exists rather than inside
  // the ladder, where they would have to be threaded through three rungs that do not use them.
  /** @type {Map<string, string>} */
  const bodies = new Map();
  for (const { fn } of prepared.values()) bodies.set(fn.name, `${bodies.get(fn.name) || ''}\n${fn.body}`);
  const refusals = decorateRows(rows, {
    narrows: input.narrows, produced: input.produced, bodies, mounts: input.mounts,
  });
  return {
    rows, functions: fns.length, consulted: prepared.size, tables: tableCount, refusals,
  };
}

/**
 * One row of the census. Split out because the ladder is the interesting part and a reader
 * should meet it without the two enclosing loops.
 * @param {{block: string, pool: string,
 *   variants: ReadonlyArray<{text: string, slots?: ReadonlyArray<string>}>,
 *   filled: string[],
 *   prepared: Map<string, {fn: KeyFunction, forms: KeyForm[], aliases: Map<string, string>,
 *     readAliases: Map<string, string>, args: Map<string, string[]>}>,
 *   tables: Map<string, KeyTable[]>, unmounted: Set<string>,
 *   declared?: Map<string, {role: string, reads: ReadonlyArray<string>}>}} args
 * @returns {CensusRow}
 */
function censusRow(args) {
  const {
    block, pool, variants, filled, prepared, tables, unmounted,
  } = args;
  /** @type {Set<string>} */
  const named = new Set();
  for (const v of variants) {
    for (const m of String(v.text).matchAll(/\{([a-zA-Z_][\w]*)\}/g)) named.add(m[1]);
    for (const s of v.slots || []) named.add(s);
  }
  /** @type {Set<string>} */
  const orders = new Set();
  for (const v of variants) orders.add(orderIdOf(classifyMoves(v.text)) || classifyMoves(v.text).join('>'));
  const base = {
    block,
    pool,
    slotsFilled: filled,
    slotsNamed: [...named].sort(),
    slotsWithoutProvider: [...named].filter((s) => !filled.includes(s)).sort(),
    hasBag: filled.length > 0,
    variants: variants.length,
    grammars: orders.size,
  };
  // ── RUNG 0 — THE ANNEX'S OWN DECLARATION, FOR A MODIFIER AND FOR NOTHING ELSE ──────
  // A modifier's selecting predicate is its desk's candidate function, which returns no pool
  // key as a literal and binds no template and sits in no key table, so rungs 1 to 3 answer
  // WIRING-UNRESOLVED on it BY CONSTRUCTION. This rung is asked FIRST and only for a pool the
  // caller hands over as `role: modifier`; a spine can never reach it, so no shipped row can
  // move through it. The row carries `role` so every spine-shaped figure of this register can
  // exclude it, and `rung: 'annex'` so a reader can see at a glance that nothing verified the
  // reading against code (see the `declared` note on CensusInput).
  const annex = args.declared instanceof Map ? args.declared.get(`${block} :: ${pool}`) : undefined;
  if (annex && annex.role === 'modifier') {
    const reads = [...new Set(annex.reads || [])].sort();
    return {
      ...base,
      role: 'modifier',
      predicate: [],
      branchReads: reads,
      fieldsRead: reads,
      status: WIRING_STATUS.RESOLVED,
      reason: '',
      keyFunction: '',
      rung: 'annex',
    };
  }
  // RUNG 1 and RUNG 2 — the key function's own forms.
  for (const {
    fn, forms, aliases, readAliases, args: callArgs,
  } of prepared.values()) {
    for (const form of forms) {
      /** @type {PredicateRow[]|null} */
      let extra = null;
      if (form.kind === 'literal' && form.text === pool) extra = [];
      else {
        const bound = bindTemplate(form, pool);
        if (bound) {
          extra = bound
            .map((b) => ({ field: resolveHole(b.hole, fn, aliases), op: '===', value: b.value }))
            .filter((r) => r.field !== '');
          if (extra.length === 0) extra = null;
        }
      }
      if (!extra) continue;
      const guardRows = predicateRows(form.guard, fn.params, aliases);
      // THE BRANCH GRAIN (SITTING §O.1, ARCH §4.4). `tests` is what the SELECTING BRANCH
      // evaluates: the guards on the path from the function's entry to this literal, plus
      // the template holes the key itself binds. `fieldsRead` below stays the function-wide
      // union, so both grains ship on every row and the cost of the ruling is measurable
      // rather than argued.
      const branch = [...new Set([
        ...form.path.flatMap((g) => guardFields(g, fn.params, readAliases)),
        ...extra.map((r) => r.field),
      ].map((f) => reroot(f, fn, callArgs)))].sort();
      return {
        ...base,
        predicate: qualify([...guardRows, ...extra], fn, callArgs),
        branchReads: branch,
        fieldsRead: readings(fn, callArgs),
        status: WIRING_STATUS.RESOLVED,
        reason: '',
        keyFunction: fn.name,
        rung: form.kind === 'literal' ? 'literal' : 'template',
      };
    }
  }
  // RUNG 3 — a module-level key table.
  for (const [file, list] of tables) {
    for (const table of list) {
      const entry = table.entries.find((e) => e.key === pool);
      if (!entry) continue;
      const reader = table.readers[0] || '(the table is never indexed)';
      // ⚠ THE PREDICATE'S FIELD AND `fieldsRead` MUST BE THE SAME STRING on this rung. A
      // first cut spelled the reading twice (once with the file name appended) and the
      // "predicates over a field the block does not read" arm then reported all 74 table
      // rows — the instrument measuring its own bookkeeping and calling it a finding.
      const readField = `${reader} (via ${table.name} in ${file.split('/').pop()})`;
      return {
        ...base,
        predicate: [{ field: readField, op: '===', value: entry.value }],
        branchReads: [readField],
        fieldsRead: [readField],
        status: WIRING_STATUS.RESOLVED,
        reason: '',
        keyFunction: table.name,
        rung: 'table',
      };
    }
  }
  return {
    ...base,
    predicate: [],
    branchReads: [],
    fieldsRead: [],
    status: WIRING_STATUS.UNRESOLVED,
    reason: unmounted.has(block)
      ? 'the block is UNMOUNTED (dossierMounts.UNMOUNTED_BLOCKS): no composer reads it, so no predicate selects this pool'
      : 'no pool-key function returns this key as a literal, no template of one binds it, and no module-level key table names it',
    keyFunction: '',
    rung: 'none',
  };
}

/**
 * A template hole's expression, resolved to a reading. `${status}` where
 * `const status = text(war.status)` resolves to `war.status`.
 * @param {string} hole
 * @param {KeyFunction} fn
 * @param {Map<string, string>} aliases
 * @returns {string}
 */
function resolveHole(hole, fn, aliases) {
  const chains = fieldChains(hole, fn.params);
  if (chains.length) return chains[0];
  const head = (hole.match(/\b([A-Za-z_$][\w$]*)\b/) || ['', ''])[1];
  if (fn.params.includes(head)) return head;
  return aliases.get(head) || '';
}

/**
 * Re-root a predicate row's field on the CALLER's own reading path, where the call site
 * supplies one. Without this a census row says `legitimacy.breakdown` and car 5's census
 * says `readings.legitimacy`, and the two-way map cannot join.
 * @param {PredicateRow[]} rows
 * @param {KeyFunction} fn
 * @param {Map<string, string[]>} callArgs
 * @returns {PredicateRow[]}
 */
function qualify(rows, fn, callArgs) {
  return rows.map((r) => ({ ...r, field: reroot(r.field, fn, callArgs) }));
}

/**
 * @param {string} chain
 * @param {KeyFunction} fn
 * @param {Map<string, string[]>} callArgs
 * @returns {string}
 */
function reroot(chain, fn, callArgs) {
  const head = chain.split('.')[0];
  if (!fn.params.includes(head)) return chain;
  const supplied = callArgs.get(head);
  if (!supplied || supplied.length !== 1) return chain;
  return `${supplied[0].replace(/\?\./g, '.')}${chain.slice(head.length)}`;
}

/**
 * Every reading a key function touches, re-rooted on the caller's path.
 * @param {KeyFunction} fn
 * @param {Map<string, string[]>} callArgs
 * @returns {string[]}
 */
function readings(fn, callArgs) {
  const chains = fieldChains(fn.body, fn.params);
  const bare = fn.params.filter((p) => new RegExp(`\\b${p}\\b`).test(fn.body));
  return [...new Set([...chains, ...bare].map((c) => reroot(c, fn, callArgs)))].sort();
}

// ── THE MAP, READ THE OTHER WAY ─────────────────────────────────────────────────────

/**
 * @typedef {object} FactRow
 * @property {string} fact
 * @property {string[]} pools `block :: pool`
 * @property {number} variants
 * @property {number} grammars
 * @property {string[]} blocks
 */

/**
 * FACT → TEXT. For every reading a key function conjoins, which pools can speak to it.
 * @param {ReadonlyArray<CensusRow>} rows
 * @returns {FactRow[]} sorted by fact
 */
export function factIndex(rows) {
  /** @type {Map<string, {pools: string[], variants: number, grammars: number, blocks: Set<string>}>} */
  const index = new Map();
  for (const row of rows) {
    for (const fact of new Set(row.predicate.map((p) => p.field))) {
      if (!index.has(fact)) {
        index.set(fact, {
          pools: [], variants: 0, grammars: 0, blocks: new Set(),
        });
      }
      const seat = index.get(fact);
      if (!seat) continue;
      seat.pools.push(`${row.block} :: ${row.pool}`);
      seat.variants += row.variants;
      seat.grammars += row.grammars;
      seat.blocks.add(row.block);
    }
  }
  return [...index].map(([fact, seat]) => ({
    fact,
    pools: seat.pools,
    variants: seat.variants,
    grammars: seat.grammars,
    blocks: [...seat.blocks].sort(),
  })).sort((a, b) => (a.fact < b.fact ? -1 : 1));
}

/**
 * @typedef {object} TierRow
 * @property {'MISSING'|'THIN'|'COVERED'|'MISSING-AT-TIER'} tier
 * @property {string} block
 * @property {string} subject the pool, the fact, or the fact pair
 * @property {string[]} fields
 * @property {string} readingFunction
 * @property {string} count the measurement that put this row in its tier
 */

/**
 * EVERY FACT THE CENSUS'S ROWS SPEAK TO — each as the source spells it AND as `rootOf`
 * normalises it, taken from the PREDICATE and from `fieldsRead` alike.
 *
 * ⛔ WHY BOTH HALVES (INSTR-912 car 10, cure 3). The MISSING tier's membership test used to
 * read `r.predicate.map(p => p.field)` on the raw string. Two independent faults followed,
 * and together they overstated MISSING by 41 %:
 *
 *   1. A pool whose key function READS a fact but whose guard did not parse carries
 *      `predicate: []`, so the fact it keys on was invisible — 24 of the 58 MISSING facts
 *      appear in some row's `fieldsRead`, `readings.criticalIssueCount` among them, keyed by
 *      `criticalIssuePoolKey` on two pools while the tier row said "0 pools keyed on this fact".
 *   2. With no `rootOf` — unlike `censusSummary`'s own unread-field arm, which normalises —
 *      a fact spoken to only through a DEEPER path was falsely MISSING: `readings.exportPosture`
 *      while DS-ECO-10's predicates name `readings.exportPosture.status`. Three rows.
 *
 * A fact a key function reads is spoken to whether or not the guard reader could follow it.
 * @param {ReadonlyArray<CensusRow>} rows
 * @returns {Set<string>}
 */
function spokenToSet(rows) {
  /** @type {Set<string>} */
  const out = new Set();
  for (const row of rows) {
    for (const p of row.predicate) {
      if (!p.field) continue;
      out.add(p.field);
      out.add(rootOf(p.field));
    }
    for (const field of row.fieldsRead || []) {
      if (!field) continue;
      out.add(field);
      out.add(rootOf(field));
    }
  }
  return out;
}

/**
 * THE THREE TIERS, keyed to the dossier's blocks. Every row names the block, the field(s),
 * the reading function and the COUNT — so the chair hands the wave a list, not a judgment.
 * @param {{rows: ReadonlyArray<CensusRow>, held: ReadonlyArray<string>,
 *   pairs?: ReadonlyArray<{a: string, b: string, towns: number}>}} input
 *   `held` is car 5's unrendered-facts census: every fact the composers hold.
 * @returns {TierRow[]}
 */
export function tierRows(input) {
  const rows = input.rows || [];
  /** @type {TierRow[]} */
  const out = [];
  const spokenTo = spokenToSet(rows);
  for (const fact of input.held || []) {
    if (spokenTo.has(fact) || spokenTo.has(rootOf(fact))) continue;
    // A held fact is named by its composer; the block is the composer's, not one pool's.
    out.push({
      tier: TIERS.MISSING,
      block: '(composer-wide)',
      subject: fact,
      fields: [fact],
      readingFunction: '(no key function reads it)',
      count: '0 pools keyed on this fact',
    });
  }
  for (const pair of input.pairs || []) {
    const both = rows.some((r) => {
      const fields = new Set(r.predicate.map((p) => p.field));
      return fields.has(pair.a) && fields.has(pair.b);
    });
    if (both) continue;
    out.push({
      tier: TIERS.MISSING,
      block: '(co-occurrence)',
      subject: `${pair.a} + ${pair.b}`,
      fields: [pair.a, pair.b],
      readingFunction: '(no key function conjoins them)',
      count: `co-fire on ${pair.towns} towns; 0 pools keyed on both`,
    });
  }
  for (const row of rows) {
    const settlementOnly = row.slotsNamed.length > 0
      && row.slotsNamed.every((s) => s === 'settlement');
    const thin = row.variants === 1 || row.grammars === 1 || settlementOnly;
    out.push({
      tier: thin ? TIERS.THIN : TIERS.COVERED,
      block: row.block,
      subject: row.pool,
      fields: [...new Set(row.predicate.map((p) => p.field))],
      readingFunction: row.keyFunction || '(unresolved)',
      count: `${row.variants} variant(s) · ${row.grammars} grammar(s) · slots {${row.slotsNamed.join(', ') || 'none'}}`,
    });
  }
  return out;
}

/**
 * FACT PAIRS THAT CO-FIRE BY EXECUTION. `firings` is one entry per town: the (block, pool)
 * keys that FIRED on it, composed through the shipped composers with REAL readings. The
 * facts of a town are the readings of the keys that fired; a pair that co-fires on at least
 * `minTowns` towns and has no pool keyed on both is the authoring wave's input.
 *
 * NO DEFAULT FLOOR. Without `minTowns` the measure declares itself not-executable rather
 * than answering with a number this module invented.
 * @param {{firings: ReadonlyArray<ReadonlyArray<{block: string, pool: string}>>,
 *   rows: ReadonlyArray<CensusRow>, minTowns?: number}} input
 * @returns {{pairs: Array<{a: string, b: string, towns: number}>, notExecutable: string[],
 *   towns: number}}
 */
export function coOccurringPairs(input) {
  const rows = input.rows || [];
  const firings = input.firings || [];
  if (typeof input.minTowns !== 'number' || !Number.isFinite(input.minTowns)) {
    return {
      pairs: [],
      towns: firings.length,
      notExecutable: ['no `minTowns` floor supplied: "co-fire on many towns" is a threshold, and this instrument does not invent one'],
    };
  }
  /** @type {Map<string, string[]>} */
  const factsOf = new Map();
  for (const row of rows) factsOf.set(`${row.block} :: ${row.pool}`, [...new Set(row.predicate.map((p) => p.field))]);
  /** @type {Map<string, number>} */
  const counts = new Map();
  for (const town of firings) {
    /** @type {Set<string>} */
    const facts = new Set();
    for (const fired of town) for (const f of factsOf.get(`${fired.block} :: ${fired.pool}`) || []) facts.add(f);
    const sorted = [...facts].sort();
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        const key = `${sorted[i]}${HOLE}${sorted[j]}`;
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    }
  }
  /** @type {Array<{a: string, b: string, towns: number}>} */
  const pairs = [];
  for (const [key, towns] of counts) {
    if (towns < input.minTowns) continue;
    const [a, b] = key.split(HOLE);
    const both = rows.some((r) => {
      const fields = new Set(r.predicate.map((p) => p.field));
      return fields.has(a) && fields.has(b);
    });
    if (!both) pairs.push({ a, b, towns });
  }
  pairs.sort((x, y) => y.towns - x.towns || (x.a < y.a ? -1 : 1));
  return { pairs, towns: firings.length, notExecutable: [] };
}

/**
 * The reading a field path is rooted in. `readings.legitimacy.breakdown.safety` roots in
 * `readings.legitimacy`; a bare `axis` (a key-function parameter no call site supplied a
 * traceable argument for) roots in itself, and therefore matches no held reading — which is
 * the finding, not a defect of the reader.
 * @param {string} field
 * @returns {string}
 */
export function rootOf(field) {
  const parts = String(field).split('.');
  if ((parts[0] === 'readings' || parts[0] === 'settlement') && parts.length > 1) return `${parts[0]}.${parts[1]}`;
  return parts[0];
}

/**
 * ⭐ THE SPINE ROWS — the population every corpus figure of this register is computed over.
 *
 * ⛔ WHY A FILTER AND NOT A NEW SET OF FIGURES (TASTE car M-2). Every integer this register
 * publishes — RESOLVED 340, the tiers, the attach coverage, the fact budget, the
 * mounts-per-fact table, the holder standings — was measured on a corpus in which every pool
 * was a SPINE, because no modifier pool had ever existed. The day the first one is born those
 * integers must keep meaning what they were pinned to mean, or every pin in the walker becomes
 * a re-record nobody reads and the register stops being a ratchet. So a modifier row is a row
 * of the census and is NOT a spine of its block: it is carried in `rows`, it is counted on its
 * own line, and it is excluded from every spine-shaped derivation by this one function.
 *
 * The alternative measured worse and is recorded rather than argued: leaving modifier rows in
 * `attachSets` makes DS-DEF-11 read NINE spines where it has five, and the attach coverage the
 * authoring wave is sized from would count a modifier as a site a modifier can attach to.
 * @param {ReadonlyArray<CensusRow>} rows
 * @returns {CensusRow[]}
 */
export function spineRows(rows) {
  return (rows || []).filter((row) => (row.role || 'spine') !== 'modifier');
}

/**
 * The MODIFIER rows, the complement of `spineRows` — counted on their own line so that a
 * reader adding the two gets `rows.length` and nothing is hidden by a filter.
 * @param {ReadonlyArray<CensusRow>} rows
 * @returns {CensusRow[]}
 */
export function modifierRows(rows) {
  return (rows || []).filter((row) => (row.role || 'spine') === 'modifier');
}

/**
 * The census as a lookup the walkers take as an INPUT. `block :: pool` → its row.
 * @param {ReadonlyArray<CensusRow>} rows
 * @returns {Map<string, CensusRow>}
 */
export function censusIndex(rows) {
  /** @type {Map<string, CensusRow>} */
  const index = new Map();
  for (const row of rows) index.set(`${row.block} :: ${row.pool}`, row);
  return index;
}

/**
 * A predicate row nobody can read as a `{field, op, value}` triple — the shape the leftmost-
 * `if` guard reader used to produce, where the VALUE was every statement between the first
 * branch and the literal. Kept as an exported rule because `resolvedWithCleanPredicate` is a
 * wave-sizing integer and a reader must be able to check what it counted.
 *
 * ⚠ THE FIGURE IS THE RULE'S. Under this statement-boundary rule the pre-cure tip reads
 * ELEVEN such rows; FOLD-2's lens reports fourteen and names no rule, and a rule that also
 * counts a bare `(` reads eighteen (it catches `(no literal)`, the truthy/falsy marker). The
 * count is published with its predicate so the next reader compares like with like.
 */
const CODE_FRAGMENT = /[;{}\n]|=>|\breturn\b|\bif\s*\(/;

/**
 * Is every row of this predicate readable as a comparison — a field, an operator and a value
 * that is a value?
 * @param {ReadonlyArray<PredicateRow>} predicate
 * @returns {boolean} false for an EMPTY predicate: nothing recovered is not clean recovery
 */
export function cleanPredicate(predicate) {
  const rows = predicate || [];
  if (rows.length === 0) return false;
  return rows.every((r) => Boolean(r.field) && !CODE_FRAGMENT.test(String(r.value)));
}

/**
 * The summary the receipt prints: totals, the status split by block, the largest unresolved
 * reasons, the slots with no provider, and the variants-per-pool histogram (the owner's
 * 21:50 ruling makes the variant count a first-class column: every semantic variant will
 * get a family of FOUR wordings and nothing is ever trimmed, so the tier table sizes that
 * authoring too).
 *
 * ⛔ "RESOLVED" IS NOT "RECOVERED", AND THIS SUMMARY NOW SAYS SO IN INTEGERS (INSTR-912
 * car 10, cure 2). `resolved` counts rows that reached a recovery RUNG. Two narrower counts
 * ship beside it — `resolvedWithPredicate` (the rung produced at least one predicate row) and
 * `resolvedWithCleanPredicate` (every one of those rows is a readable comparison) — because
 * the receipt, the walker's own assertion message and the wave's tier table all read
 * "RESOLVED 310" as "the selecting predicate was recovered", and at the pre-cure tip 143 of
 * those 310 carried `predicate: []`.
 * @param {ReadonlyArray<CensusRow>} rows
 * @param {ReadonlyArray<string>} [held] car 5's unrendered-facts census — every reading the
 *   composers HOLD. The "a predicate over a field the block does not read" arm compares each
 *   predicate's root against this set; WITHOUT it the arm is NOT-EXECUTABLE and says so,
 *   because a comparison against nothing answers `[]` and reads as a clean bill.
 * @returns {{total: number, resolved: number, unresolved: number,
 *   resolvedWithPredicate: number, resolvedWithCleanPredicate: number,
 *   byBlock: Array<[string, {resolved: number, unresolved: number}]>,
 *   reasons: Array<[string, number]>, slotless: Array<{block: string, pool: string, slots: string[]}>,
 *   bagless: Array<{block: string, pool: string, slots: string[]}>,
 *   predicatesOverUnreadFields: Array<{block: string, pool: string, field: string, rung: string}>,
 *   syntheticTableFields: number, predicateArmExecutable: boolean,
 *   variantHistogram: Array<[number, number]>, variants: number,
 *   perBlock: Array<[string, number]>}}
 *
 * ⛔ NO FORMATTED MEAN IS RETURNED (INSTR-912 car 11). An earlier cut carried
 * `meanPerPool: (variants / total).toFixed(2)` — a float interpolation and a two-decimal
 * score, the two numeric-prose classes the estate's prose-numerics register counts, and it
 * leaked two rows over that register's reviewed ceiling. The census publishes `variants` and
 * `total` as INTEGERS and every derived mean is formatted by the CALLER, outside `src/`.
 * A summary that formats is also a summary that has decided a presentation for a reader it
 * cannot see, which is the wrong seat for this module.
 */
export function censusSummary(rows, held) {
  /** @type {Map<string, {resolved: number, unresolved: number}>} */
  const byBlock = new Map();
  /** @type {Map<string, number>} */
  const reasons = new Map();
  /** @type {Map<number, number>} */
  const histogram = new Map();
  /** @type {Map<string, number>} */
  const perBlock = new Map();
  /** @type {Array<{block: string, pool: string, slots: string[]}>} */
  const slotless = [];
  /** @type {Array<{block: string, pool: string, slots: string[]}>} */
  const bagless = [];
  /** @type {Array<{block: string, pool: string, field: string, rung: string}>} */
  const overUnread = [];
  const heldSet = Array.isArray(held) ? new Set(held) : null;
  let resolved = 0;
  let variants = 0;
  let withPredicate = 0;
  let withCleanPredicate = 0;
  let syntheticTableFields = 0;
  for (const row of rows) {
    if (!byBlock.has(row.block)) byBlock.set(row.block, { resolved: 0, unresolved: 0 });
    const seat = byBlock.get(row.block);
    if (seat) {
      if (row.status === WIRING_STATUS.RESOLVED) seat.resolved++; else seat.unresolved++;
    }
    if (row.status === WIRING_STATUS.RESOLVED) {
      resolved++;
      if (row.predicate.length > 0) withPredicate++;
      if (cleanPredicate(row.predicate)) withCleanPredicate++;
    } else reasons.set(row.reason, (reasons.get(row.reason) || 0) + 1);
    histogram.set(row.variants, (histogram.get(row.variants) || 0) + 1);
    perBlock.set(row.block, (perBlock.get(row.block) || 0) + row.variants);
    variants += row.variants;
    if (row.slotsWithoutProvider.length) {
      (row.hasBag ? slotless : bagless).push({ block: row.block, pool: row.pool, slots: row.slotsWithoutProvider });
    }
    // ⛔ THE TABLE RUNG'S FIELD IS THIS INSTRUMENT'S OWN LABEL, NOT A COMPOSER'S READING
    // (INSTR-912 car 10, cure 4). Rung 3 writes the SAME synthetic string into `predicate[]`
    // and into `fieldsRead`: `"<reader> (via <TABLE> in <file>)"`. Its `rootOf` is the whole
    // string, which no held-facts set can ever contain, so EVERY table row was reported as a
    // predicate over an unheld field BY CONSTRUCTION — 74 of the 158 at the pre-cure tip. The
    // first cut of this arm compared against the key function's own `fieldsRead` and could
    // not fail; the comparison moved to the held set and the artefact moved with it. The rows
    // are counted separately rather than dropped, because a count nobody can see is how the
    // artefact came back the first time.
    if (row.rung === 'table') syntheticTableFields += row.predicate.length;
    if (heldSet && row.rung !== 'table') {
      for (const p of row.predicate) {
        if (p.field === '' || heldSet.has(rootOf(p.field))) continue;
        overUnread.push({
          block: row.block, pool: row.pool, field: p.field, rung: row.rung,
        });
      }
    }
  }
  const total = rows.length;
  return {
    total,
    resolved,
    unresolved: total - resolved,
    resolvedWithPredicate: withPredicate,
    resolvedWithCleanPredicate: withCleanPredicate,
    byBlock: [...byBlock].sort((a, b) => b[1].unresolved - a[1].unresolved),
    reasons: [...reasons].sort((a, b) => b[1] - a[1]),
    slotless,
    bagless,
    predicatesOverUnreadFields: overUnread,
    syntheticTableFields,
    predicateArmExecutable: heldSet !== null,
    variantHistogram: [...histogram].sort((a, b) => a[0] - b[0]),
    variants,
    perBlock: [...perBlock].sort((a, b) => b[1] - a[1]),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════════
// ARCH CAR 0 — THE COLUMNS THE COMPOSED-PROSE WAVE IS SIZED FROM
//
// Car 8 answered "what selects this pool". The composed-prose model (ARCH §3.2) needs
// six more answers per row before a modifier can be authored anywhere, and every one of
// them is a MEASUREMENT the wave's arithmetic rests on rather than a judgment:
//
//   reads       what the pool is ENTITLED to claim — `tests` by default, narrower only
//               by a chair-ruled NARROWS line carrying its ruling id and quoted sentence
//   absent      what an ABSENT value at a read path MEANS: measured, a reader's default,
//               or a path no writer produces (ARCH §3.3, the general test of
//               dossierMounts.js:56-80 read at the field grain)
//   covert      the read is on the frozen COVERT-SOURCE list, so the pool may hold no
//               unmarked variant and can never be a candidate on the player face
//   objectClass the civic object the key NAMES, from a closed list this module emits
//   sites       the mounts where the pool can speak
//   k           the fact budget left for modifiers: `3 - |reads|`
//
// ⛔ THE LABEL RULE STILL BINDS, AND `objectClass` IS ITS ONE LICENSED USE. The pool key
// string is never the PREDICATE (the owner's rule; §M.2 item 54). `objectClass` is the
// LABEL half by construction — ARCH T-F12 asks for "the civic object class the key string
// names", so this column reads the key and nothing else reads the key. Every other column
// below is derived from the recovered wiring or from a table the estate itself exports.
// ═══════════════════════════════════════════════════════════════════════════════════

/**
 * THE COVERT-SOURCE LIST, published as a frozen constant (ARCH §2.5, T-F5). A pool whose
 * `reads` names one of these may not hold an unmarked variant: on the player face it is
 * not a candidate at all, so nothing it does — including what it prevented — is
 * observable there. The roster is DECLARED rather than inferred, and the general limb
 * (`isCovertPath`) catches a `covert` segment anywhere in a chain so a new covert reading
 * cannot arrive unnamed.
 * @type {ReadonlyArray<string>}
 */
export const COVERT_SOURCES = Object.freeze([
  'compromisedSecurityInstitutions',
  'npc.corrupt',
  'corruptNpc',
  'impairment.covert',
  'mobilization.covert',
  'blocs.covert',
]);

/**
 * @param {string} field
 * @returns {boolean} is this reading on the covert list, or does it carry a covert segment?
 */
export function isCovertPath(field) {
  const chain = String(field);
  if (COVERT_SOURCES.some((source) => chain.includes(source))) return true;
  return chain.split('.').includes('covert');
}

/**
 * ⭐ THE JAVASCRIPT METHOD NAMES A READ CHAIN MAY END IN, published as a frozen constant so a
 * reader can see what is excluded and add to it rather than re-deriving the rule (MEASURE
 * car 3, the fold's P5 and cure 10). A dotted chain whose TAIL is one of these records a CALL
 * the key function made on a reading, never a field of the world: `eco.incomeSources.reduce`
 * is `Array.prototype.reduce`. Two instruments read this one list — the `absent` column here
 * and the pair table's member class in `scripts/prose-rate-corpus.mjs` — because the same
 * token was miscounted in both and a second spelling is how one of them would drift back.
 *
 * ⚠ THE LIST IS SHORT ON PURPOSE. A name here that is also a real settlement field would be
 * excluded wrongly, so it carries the builtin surface a composer plausibly reaches and no
 * more, and the walker asserts what it excludes on the shipped corpus.
 * @type {ReadonlySet<string>}
 */
export const JS_METHOD_TAILS = Object.freeze(new Set([
  'at', 'concat', 'endsWith', 'entries', 'every', 'filter', 'find', 'findIndex', 'flat',
  'flatMap', 'forEach', 'includes', 'indexOf', 'join', 'keys', 'lastIndexOf', 'map', 'match',
  'padEnd', 'padStart', 'pop', 'push', 'reduce', 'replace', 'reverse', 'shift', 'slice',
  'some', 'sort', 'split', 'startsWith', 'test', 'toFixed', 'toLowerCase', 'toString',
  'toUpperCase', 'trim', 'values',
]));

/**
 * THE CLOSED CIVIC-OBJECT CLASS LIST (ARCH T-F12). Two pieces about the SAME civic object
 * restate each other in meaning even when their fields are disjoint: "there are no
 * reserves" beside "the stores are short" passes every field guard and says one thing
 * twice. The projector refuses an attach whose spine key and modifier key name the same
 * class, and this is the list it refuses from.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const CIVIC_OBJECT_CLASSES = Object.freeze({
  wall: Object.freeze(['wall', 'walled', 'unwalled', 'perimeter', 'rampart', 'palisade', 'gate']),
  force: Object.freeze(['garrison', 'militia', 'muster', 'watch', 'guard', 'soldier', 'patrol', 'armed']),
  // ⛔⛔ `granary` LEFT THIS CLASS AT REWRITE car 8a-8 (SITTING §T.5's T-F12 re-cut). The word
  // named two different civic objects and the class could not tell them apart: `GRANARY: thin`
  // is about the STOCK, and `Disasters & Famine: granary AND hospital` is about WHICH BUILDINGS
  // EXIST. One class for both refused `stores: short` beside the very attach site ARCH §8.3's
  // own worked card names. The STOCK words stay here; the BUILDING has its own class below.
  store: Object.freeze(['stores', 'reserve', 'reserves', 'stock', 'larder', 'harvest']),
  market: Object.freeze(['market', 'trade', 'export', 'import', 'commerce', 'merchant', 'caravan']),
  law: Object.freeze(['court', 'prison', 'gaol', 'law', 'justice', 'magistrate', 'assize']),
  temple: Object.freeze(['temple', 'shrine', 'church', 'parish', 'clergy', 'faith', 'patron']),
  road: Object.freeze(['road', 'route', 'approach', 'port', 'harbour', 'bridge', 'pass', 'ford']),
  hall: Object.freeze(['hall', 'council', 'charter', 'seat', 'office', 'chamber', 'moot']),
  care: Object.freeze(['hospital', 'infirmary', 'healer', 'medical', 'physician', 'ward']),
  craft: Object.freeze(['forge', 'smith', 'workshop', 'guild', 'craft', 'mill', 'yard']),
  // ⭐ THE BUILDING THAT HOLDS THE STOCK, split out of `store` at REWRITE car 8a-8. A key
  // naming it ALONGSIDE ANOTHER CIVIC OBJECT is listing buildings; a key naming it ALONE is
  // speaking about what is in it, and `objectClassesOf` reads it as the stock there too. That
  // asymmetry is deliberate and it errs SAFE: a lone `granary` keeps `store`, so a stock
  // modifier is still refused beside it.
  storehouse: Object.freeze(['granary', 'silo', 'storehouse', 'warehouse']),
});

/**
 * ⛔⛔ THE POLARITY MARKER A SIBLING KEY CARRIES BECAUSE T-F3 REQUIRES IT (REWRITE car 8a-8).
 *
 * T-F3 makes a relation that flips with the spine's polarity into TWO pools with disjoint
 * attach sets, and naming that pair puts the SPINE'S POLARITY in the modifier's key:
 * `country: pressed (walled)` and `country: pressed (unwalled)`. T-F12 then read `walled` as a
 * civic object the key names, so the modifier collided with every DS-DEF-11 spine on a word
 * one rule made the other rule write. Three of the taste's five waived refusals were that.
 *
 * ⛔ A CLOSED LIST OF POLARITY WORDS, NOT "ANY TRAILING PARENTHETICAL". A parenthetical can
 * name a real object, and a rule that stripped all of them would blind the guard wherever a
 * writer used one. These eight are values of a boolean-ish typed field, and nothing else.
 *
 * ⛔ AND IT MOVES NO SHIPPED ROW: measured, ZERO of the 708 shipped keys carries a trailing
 * polarity parenthetical, because only a T-F3 SIBLING PAIR needs one and no shipped pool is a
 * modifier. The cure bites exactly where the defect was.
 */
const POLARITY_MARKER = /\s*\((?:walled|unwalled|present|absent|revealed|covert|true|false)\)\s*$/i;

/**
 * ⭐ EVERY civic object class a pool key names, in the frozen list's own order — never the
 * first alone (the MEASURE fold's P3, cure 9).
 *
 * ⛔ WHY THE SET AND NOT THE FIRST. `Disasters & Famine: granary AND hospital` names a STORE
 * and a CARE house; the first-wins reading answered `store`, so T-F12 — whose whole job is to
 * refuse an attach whose spine and modifier name the SAME civic object — would have admitted
 * a `care` modifier beside a spine that already names the hospital. Measured at this tip: 12
 * of the 99 classed keys match more than one class, and the object literal's own key order
 * silently decided every one of them. T-F12 refuses on the SET: two keys collide when their
 * class sets INTERSECT, not when their first classes happen to agree.
 * @param {string} poolKey
 * @returns {string[]} every matching class, in the frozen list's order
 */
export function objectClassesOf(poolKey) {
  // ⭐ THE T-F3 POLARITY MARKER IS STRIPPED FIRST (REWRITE car 8a-8): it is the sibling rule's
  // word and not the writer's, so reading it as a civic object made one rule refuse another.
  const key = String(poolKey).replace(POLARITY_MARKER, '');
  const words = new Set(key.toLowerCase().split(/[^a-z]+/).filter(Boolean));
  const classes = Object.entries(CIVIC_OBJECT_CLASSES)
    .filter(([, tokens]) => tokens.some((token) => words.has(token)))
    .map(([klass]) => klass);
  // ⭐ A STOREHOUSE STANDING ALONE IS READ AS ITS STOCK, which is the conservative half of the
  // split: `GRANARY: thin` names one object and is about what is in it, so a `stores:` modifier
  // beside it is still a restatement and is still refused. A storehouse named ALONGSIDE another
  // civic object — `granary AND hospital` — is a list of buildings, and a stock modifier beside
  // it adds a fact rather than repeating one. ARCH §6.4 says exactly that in words: only the two
  // `NO reserves` cells are held, and those two carry a STOCK word of their own.
  if (classes.length === 1 && classes[0] === 'storehouse') classes.unshift('store');
  return classes;
}

/**
 * The FIRST civic object class a pool key names, or null — the single-valued column kept
 * beside the set so a reader of one row still gets an answer. A refusal reads the SET.
 * @param {string} poolKey
 * @returns {string|null}
 */
export function objectClassOf(poolKey) {
  return objectClassesOf(poolKey)[0] ?? null;
}

/**
 * WHAT AN ABSENT VALUE AT THIS PATH MEANS (ARCH §3.3), generalising the mount registry's
 * own test — "DORMANT IS A TRUE STATEMENT, NOT A FALLBACK" — from the surface to the field:
 *
 *   `default`      the READ SITE supplies a fallback (`|| x`, `?? x`), so an absent
 *                  producer value arrives wearing a reading's clothes and a predicate over
 *                  it cannot tell absence from the fallback. THIS IS THE FINDING CLASS.
 *   `not-produced` no writer anywhere in the estate produces this leaf.
 *   `measured`     a writer produces it and the read does not default, so absence is
 *                  visible to the predicate and a guarded `present AND …` is available.
 *   `method-call`  the chain's TAIL is a JavaScript method the key function called on a
 *                  reading (`eco.incomeSources.reduce`, `readings.notableAbsences.map`), so
 *                  the path names no field and no absence semantics apply to it. Asking a
 *                  producer index about `map` answers `not-produced` on every one of them,
 *                  which is a wrong verdict rather than a finding.
 *
 * The estate's own case: `economicGates.military` is ABSENT rather than 1.0 when there is
 * no paid stack (`defenseGenerator.js :: computeDefenseScores` writes the key only under `hasAnyDefense`),
 * and `wallRationalePoolKey` guards `typeof === 'number' && Number.isFinite` before `< 1`.
 * That read is `measured`; the same predicate written without the guard would be the
 * projector error ARCH §3.3 names.
 * @param {string} field the reading path
 * @param {string} body the source of the read site the census can see (the key function)
 * @param {Set<string>|null} produced every leaf key some writer in the estate writes
 * @returns {'measured'|'default'|'not-produced'|'method-call'}
 */
export function absenceOf(field, body, produced) {
  const parts = String(field).split('.').filter(Boolean);
  if (parts.length === 0) return 'not-produced';
  // ⛔ A CALL IS NOT A FIELD, AND THE DOT MADE IT LOOK LIKE ONE (MEASURE car 3, the same shape
  // the fold's P5 found in the pair table's `fact` class). `x.map` is `Array.prototype.map`;
  // no writer in the estate produces `map`, so the producer index answered `not-produced` on
  // eleven cells of the shipped corpus and each was a wrong verdict rather than a finding.
  if (parts.length > 1 && JS_METHOD_TAILS.has(parts[parts.length - 1])) return 'method-call';
  const src = String(body || '');
  // THE LONGEST SUFFIX THE BODY ACTUALLY CARRIES decides, because a row's field is
  // RE-ROOTED on the caller's path (`forces.walls.present` is read as `walls.present`
  // inside the key function). A leaf-only match would let one `present ||` anywhere in a
  // body label every `*.present` path in that function a default, which is the coarse
  // reading the estate has already been bitten by once.
  for (let start = 0; start < parts.length; start++) {
    const chain = parts.slice(start)
      .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('\\s*\\??\\.\\s*');
    if (!new RegExp(`\\b${chain}\\b`).test(src)) continue;
    // ⛔ A REFUSAL GUARD IS THE OPPOSITE OF A DEFAULT, AND THE REGEX COULD NOT TELL THEM
    // APART (the MEASURE fold's R3, cure 8). `x || fallback` hands the predicate a value it
    // cannot distinguish from a reading — the finding this column exists for. `!x || typeof x
    // !== 'object'` REFUSES: the read site returns null and no predicate ever sees a
    // substitute, which is `measured` behaviour written defensively. Both spell `x ||`, so
    // the disambiguator is the operand: a `||` whose left side is the NEGATION of the chain
    // is a guard. Measured at this tip: 7 of the 10 `default` cells were guards
    // (`readings.inst` 5, `link` 2), so `default 10` was `default 3`.
    let fallback = false;
    for (const hit of src.matchAll(new RegExp(`\\b${chain}\\b\\s*(?:\\|\\||\\?\\?)`, 'g'))) {
      if (!/!\s*$/.test(src.slice(0, hit.index))) fallback = true;
    }
    if (fallback) return 'default';
    break;
  }
  return produced instanceof Set && !produced.has(parts[parts.length - 1]) ? 'not-produced' : 'measured';
}

/**
 * @typedef {object} NarrowsLine
 * @property {ReadonlyArray<string>} fields the narrowed reads
 * @property {string} ruling the chair ruling id
 * @property {string} quote the sentence the ruling quotes
 */

/**
 * `reads` DEFAULTS TO `tests` (ARCH §4.4, E-F2, T-F7). Every field the selecting branch
 * evaluates is a field the pool is entitled to claim, and the fact budget is counted over
 * it. A NARROWS line may narrow the set and it is refused without a chair ruling id AND
 * the sentence quoted, and refused again where it names a field the branch does not test:
 * a narrowing nobody ruled is a licence the census would be handing out on its own.
 *
 * ⛔ THE GRAIN IS THE BRANCH'S WHERE ONE WAS RECOVERED, AND FUNCTION-WIDE WHERE NONE WAS
 * (SITTING §O.1). The fallback is FAIL-CLOSED and not a convenience: a row whose branch
 * reader recovered nothing has an EMPTY branch set, and reading that as the pool's tests
 * would answer `k = 3` — three free modifier seats on a pool nobody has recovered a
 * predicate for, which is the friendliest number and the §908 law's own forbidden answer.
 * @param {CensusRow} row
 * @param {Map<string, NarrowsLine>|undefined} narrows
 * @returns {{reads: string[], narrowed: boolean, refusal: string, grain: 'branch'|'function'}}
 */
export function narrowedReads(row, narrows) {
  const branch = row.branchReads || [];
  /** @type {'branch'|'function'} */
  const grain = branch.length > 0 ? 'branch' : 'function';
  const tests = branch.length > 0 ? [...branch] : [...(row.fieldsRead || [])];
  const line = narrows instanceof Map ? narrows.get(`${row.block} :: ${row.pool}`) : undefined;
  if (!line) return { reads: tests, narrowed: false, refusal: '', grain };
  const at = `${row.block} :: ${row.pool}`;
  if (!line.ruling || !line.quote) {
    return { reads: tests, narrowed: false, grain, refusal: `NARROWS at ${at} carries no chair ruling id with its quoted sentence` };
  }
  const outside = (line.fields || []).filter((f) => !tests.includes(f));
  if (outside.length > 0) {
    return { reads: tests, narrowed: false, grain, refusal: `NARROWS at ${at} names ${outside.join(', ')}, which the branch does not test` };
  }
  return { reads: [...line.fields], narrowed: true, refusal: '', grain };
}

/**
 * THE DERIVED ATTACH SETS AND THEIR COVERAGE (ARCH §2.2, §6.2, E-F1). A would-be modifier
 * reading ONE field may attach to every RESOLVED spine of its block whose own `tests`
 * EXCLUDE that field — a spine that already tests the field would be restating itself.
 * `attach` is DERIVED and UNCAPPED, and that is the whole reason the authored corpus stays
 * linear: under a cap of three a modifier reaching a 42-spine block cost fourteen replicas.
 *
 * COVERAGE is printed per block in two integers, because the two answer different owner
 * questions: `spinesReachedBp` is the share of the block's spines that ANY would-be
 * modifier can sit beside (can this block compose at all), and `meanReachBp` is the mean
 * share of spines one fact's modifier reaches (how far one authored piece travels).
 * @param {ReadonlyArray<CensusRow & {reads?: string[]}>} rows
 * @returns {Array<{block: string, spines: number, facts: number, spinesReachedBp: number,
 *   meanReachBp: number, byFact: Array<{field: string, attach: string[]}>}>}
 */
export function attachSets(rows) {
  /** @type {Map<string, Array<CensusRow & {reads?: string[]}>>} */
  const byBlock = new Map();
  for (const row of rows) {
    if (row.status !== WIRING_STATUS.RESOLVED) continue;
    const seat = byBlock.get(row.block);
    if (seat) seat.push(row); else byBlock.set(row.block, [row]);
  }
  /** @type {Array<{block: string, spines: number, facts: number, spinesReachedBp: number, meanReachBp: number, byFact: Array<{field: string, attach: string[]}>}>} */
  const out = [];
  for (const [block, spines] of byBlock) {
    /** @type {Set<string>} */
    const facts = new Set();
    for (const spine of spines) for (const f of spine.reads || spine.fieldsRead || []) facts.add(f);
    /** @type {Array<{field: string, attach: string[]}>} */
    const byFact = [];
    /** @type {Set<string>} */
    const reached = new Set();
    let reachTotal = 0;
    for (const field of [...facts].sort()) {
      const attach = spines
        .filter((s) => !(s.reads || s.fieldsRead || []).includes(field))
        .map((s) => s.pool);
      byFact.push({ field, attach });
      for (const pool of attach) reached.add(pool);
      reachTotal += attach.length;
    }
    const denominator = spines.length * Math.max(facts.size, 1);
    out.push({
      block,
      spines: spines.length,
      facts: facts.size,
      spinesReachedBp: Math.round((reached.size / spines.length) * 10000),
      meanReachBp: Math.round((reachTotal / denominator) * 10000),
      byFact,
    });
  }
  return out.sort((a, b) => (a.block < b.block ? -1 : 1));
}

// MOUNTS PER FACT lives in `scripts/wiring-census.mjs` (ARCH T-F10). It needs the facts
// each DESK holds, which is car 5's unrendered-facts census and therefore file I/O; this
// module's own header forbids it to read a file, and `src/domain/**` carries a hard
// 800-effective-line ceiling this file now stands close to. The estate's idiom for a
// scanner a walker must assert is `scripts/` plus an import, which is what it uses.

/**
 * THE FACT BUDGET, COUNTED (ARCH §4.4, E-F8). A unit carries at most three facts, so a
 * spine leaves `k = 3 - |reads|` seats for modifiers and a three-field spine leaves NONE.
 * The k = 0 count is the number the owner vetoes the budget against: on DS-DEF-2 it is the
 * MOST SPECIFIC shipped cells that can never gain a fact.
 *
 * ⛔ COUNTED OVER RESOLVED ROWS ONLY, AND THE REST ARE NOT-EXECUTABLE. An UNRESOLVED row
 * has `reads: []`, which would read as `k = 3` — a budget of three seats on a pool whose
 * predicate nobody has recovered. That is the §908 law: a row whose input is missing
 * declares itself not-executable rather than answering with the friendliest number.
 * @param {ReadonlyArray<CensusRow & {reads?: string[]}>} rows
 * @returns {{zeroK: number, executable: number, notExecutable: number,
 *   byBlock: Array<[string, {zeroK: number, spines: number}]>, histogram: Array<[number, number]>}}
 */
export function factBudget(rows) {
  /** @type {Map<string, {zeroK: number, spines: number}>} */
  const byBlock = new Map();
  /** @type {Map<number, number>} */
  const histogram = new Map();
  let zeroK = 0;
  let executable = 0;
  let notExecutable = 0;
  for (const row of rows) {
    if (row.status !== WIRING_STATUS.RESOLVED) { notExecutable += 1; continue; }
    executable += 1;
    const k = 3 - (row.reads || row.fieldsRead || []).length;
    histogram.set(k, (histogram.get(k) || 0) + 1);
    let seat = byBlock.get(row.block);
    if (!seat) { seat = { zeroK: 0, spines: 0 }; byBlock.set(row.block, seat); }
    seat.spines += 1;
    if (k <= 0) { zeroK += 1; seat.zeroK += 1; }
  }
  return {
    zeroK,
    executable,
    notExecutable,
    byBlock: [...byBlock].sort((a, b) => b[1].zeroK - a[1].zeroK),
    histogram: [...histogram].sort((a, b) => a[0] - b[0]),
  };
}

/**
 * CUSTOM-CONTENT PARITY (ARCH §16 item 8, the owner's 2026-09-08 ~04:00 row). Which
 * in-house (block, pool) predicates read a fact a CUSTOM definition of some kind can
 * carry? Every reachable combination with no custom analogue is a MISSING-CUSTOM tier row
 * for the CUSTOM-PROSE train.
 *
 * THREE LIMBS, EACH DECLARED AND EACH NAMED ON THE ROW, so a reader can see which rule
 * caught a pool rather than trusting a verdict:
 *   `bucket` a reads path names the kind's own bucket key or its singular
 *   `field`  a reads path's LEAF is a MECHANICAL field of that kind (a presentation field
 *            changes no world state, so a predicate over one is not a mechanical reach)
 *   `value`  a predicate VALUE is a member of a closed enum a mechanical field declares
 * @param {ReadonlyArray<CensusRow & {reads?: string[]}>} rows
 * @param {ReadonlyArray<{key: string, singular?: string, authorable?: boolean,
 *   fields?: ReadonlyArray<{key: string, effect?: string, values?: ReadonlyArray<string>}>}>} categories
 * @returns {{byKind: Array<[string, number]>, rows: Array<{block: string, pool: string, kind: string, via: string, on: string}>}}
 */
export function customReachable(rows, categories) {
  /** @type {Array<{kind: string, tokens: Set<string>, fields: Set<string>, values: Set<string>}>} */
  const kinds = [];
  for (const category of categories || []) {
    if (category.authorable === false) continue;
    const mechanical = (category.fields || []).filter((f) => f.effect === 'mechanical');
    kinds.push({
      kind: category.key,
      tokens: new Set([category.key, String(category.singular || '').replace(/\s+/g, '')].map((t) => t.toLowerCase()).filter(Boolean)),
      fields: new Set(mechanical.map((f) => f.key)),
      values: new Set(mechanical.flatMap((f) => [...(f.values || [])])),
    });
  }
  /** @type {Array<{block: string, pool: string, kind: string, via: string, on: string}>} */
  const hits = [];
  /** @type {Map<string, number>} */
  const counts = new Map(kinds.map((k) => [k.kind, 0]));
  for (const row of rows) {
    const reads = row.reads || row.fieldsRead || [];
    const segments = reads.flatMap((r) => r.split('.').map((s) => s.toLowerCase()));
    const leaves = reads.map((r) => r.split('.').filter(Boolean).pop() || '');
    const values = (row.predicate || []).map((p) => String(p.value));
    for (const kind of kinds) {
      const bucket = segments.find((s) => kind.tokens.has(s));
      const field = leaves.find((l) => kind.fields.has(l));
      const value = values.find((v) => kind.values.has(v));
      const via = bucket ? 'bucket' : (field ? 'field' : (value ? 'value' : ''));
      if (!via) continue;
      hits.push({
        block: row.block, pool: row.pool, kind: kind.kind, via, on: bucket || field || value || '',
      });
      counts.set(kind.kind, (counts.get(kind.kind) || 0) + 1);
    }
  }
  return { byKind: [...counts].sort((a, b) => b[1] - a[1]), rows: hits };
}

/**
 * THE SECOND PASS — the six ARCH car-0 columns written onto every row. Exported so a
 * fixture census can be decorated on its own and each column driven present-then-absent.
 * @param {Array<CensusRow>} rows mutated in place
 * @param {{narrows?: Map<string, NarrowsLine>, produced?: Set<string>,
 *   bodies?: Map<string, string>, mounts?: ReadonlyArray<{mount: string, tab: string, blockId: string}>}} input
 * @returns {string[]} every NARROWS line the census REFUSED, with its reason
 */
export function decorateRows(rows, input) {
  const bodies = input.bodies instanceof Map ? input.bodies : new Map();
  const produced = input.produced instanceof Set ? input.produced : null;
  /** @type {Map<string, string[]>} */
  const sites = new Map();
  for (const m of input.mounts || []) {
    const seat = sites.get(m.blockId);
    if (seat) seat.push(m.mount); else sites.set(m.blockId, [m.mount]);
  }
  /** @type {string[]} */
  const refusals = [];
  for (const row of rows) {
    const narrowed = narrowedReads(row, input.narrows);
    if (narrowed.refusal) refusals.push(narrowed.refusal);
    row.reads = narrowed.reads;
    row.readsGrain = narrowed.grain;
    row.narrowed = narrowed.narrowed;
    const body = bodies.get(row.keyFunction) || '';
    // ⛔ THE TABLE RUNG'S FIELD IS THIS INSTRUMENT'S OWN LABEL (car 10, cure 4). Rung 3
    // writes `"<reader> (via <TABLE> in <file>)"` into both `predicate[].field` and
    // `fieldsRead`; asking a producer index whether anything writes that string answers
    // `not-produced` on every table row BY CONSTRUCTION, which is the artefact that arm
    // already had to be cured of once. Table rows carry an EMPTY absence record and the
    // caller counts them apart, because a count nobody can see is how it came back before.
    row.absent = row.rung === 'table'
      ? {}
      : Object.fromEntries(row.reads.map((f) => [f, absenceOf(f, body, produced)]));
    row.covert = row.reads.some((f) => isCovertPath(f));
    row.objectClasses = objectClassesOf(row.pool);
    row.objectClass = row.objectClasses[0] ?? null;
    row.sites = [...(sites.get(row.block) || [])].sort();
    // A SPINE'S ATTACH SET IS EMPTY BY CONSTRUCTION and every shipped pool is a spine at
    // this tip; `attachSets` derives the would-be modifier sets the wave is sized from.
    row.attach = [];
    row.k = row.status === WIRING_STATUS.RESOLVED ? 3 - row.reads.length : null;
    row.rateBp = null;
    row.departure = null;
    // ⭐ THE SOURCE COLUMN (SITTING §Q.4 step 1). It is written HERE and not in the ladder
    // because it reads `row.reads`, which the narrowing above has only just settled; the
    // resolution itself is the holder table's and this module keeps none of its vocabulary.
    row.source = sourceOfRow(row);
  }
  return refusals;
}
