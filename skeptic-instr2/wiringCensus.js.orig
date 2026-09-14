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
import { classifyMoves, orderIdOf } from './moveGrammar.js';

/** Statuses a census row can carry. RESOLVED means the predicate was READ, never guessed. */
export const WIRING_STATUS = Object.freeze({
  RESOLVED: 'RESOLVED',
  UNRESOLVED: 'WIRING-UNRESOLVED',
});

/** The three tiers the authoring wave is sized from. */
export const TIERS = Object.freeze({
  MISSING: 'MISSING', THIN: 'THIN', COVERED: 'COVERED',
});

// ── THE SOURCE READERS (pure; every input is a string) ──────────────────────────────

/**
 * Read from an opening bracket to its match, respecting strings, template literals and
 * comments. The sibling reader `tests/helpers/dossierComposedFill.js` re-exports THIS one
 * rather than keeping a second spelling: a bracket reader that disagrees with itself across
 * two instruments is how one census counts a key the other cannot see.
 * @param {string} src
 * @param {number} open index of `(` `{` or `[`
 * @returns {{inner: string, end: number}}
 */
export function balancedSlice(src, open) {
  /** @type {Record<string, string>} */
  const pairs = { '(': ')', '{': '}', '[': ']' };
  if (!pairs[src[open]]) throw new Error(`wiringCensus.balancedSlice: index ${open} is not an opening bracket`);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') { i = src.indexOf('\n', i); if (i < 0) break; continue; }
    if (c === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i) + 1; if (i < 1) break; continue; }
    if (c === '\'' || c === '"' || c === '`') {
      const quote = c;
      i++;
      while (i < src.length && src[i] !== quote) { if (src[i] === '\\') i++; i++; }
      continue;
    }
    if (c === '(' || c === '{' || c === '[') depth++;
    else if (c === ')' || c === '}' || c === ']') {
      depth--;
      if (depth === 0) return { inner: src.slice(open + 1, i), end: i };
    }
  }
  throw new Error(`wiringCensus.balancedSlice: unbalanced bracket at ${open}`);
}

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
 * The member chains a body reads, rooted at one of `roots`. `legitimacy?.breakdown.safety`
 * normalises to `legitimacy.breakdown.safety`; the optional-chain marker carries no fact.
 * @param {string} body
 * @param {ReadonlyArray<string>} roots
 * @returns {string[]} sorted, unique
 */
export function fieldChains(body, roots) {
  /** @type {Set<string>} */
  const out = new Set();
  for (const root of roots) {
    const re = new RegExp(`\\b${root}((?:\\s*\\??\\.\\s*[A-Za-z_$][\\w$]*)+)`, 'g');
    for (const m of body.matchAll(re)) out.add(`${root}${m[1].replace(/\s*\??\.\s*/g, '.')}`);
  }
  return [...out].sort();
}

/**
 * The local `const` aliases of a function body, mapped to the first param-rooted chain in
 * their initialiser. `const state = text(captureState)` makes `state` a reading of
 * `captureState`; without this hop the commonest predicate shape in the estate
 * (`if (state === 'capture')`) resolves to no field at all.
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
    rows.push({ field, op: bare[1] === '!' ? 'falsy' : 'truthy', value: '(no literal)' });
  }
  return rows;
}

/**
 * @typedef {object} KeyForm
 * @property {'literal'|'template'} kind
 * @property {string} text the literal, or the template with each hole replaced by the NUL marker
 * @property {string[]} holes the hole expressions, in order
 * @property {string} guard the nearest preceding `if (…)` on the same statement, or ''
 */

/**
 * The hole marker, and the pair separator in `coOccurringPairs`. Both are U+0000, written
 * as an ESCAPE and never as a byte: a marker that CAN occur in the subject (a space, a
 * colon) makes a template carrying that character split into the wrong number of parts, and
 * it does so silently.
 */
const HOLE = '\u0000';

/**
 * Every key FORM a function body can produce — string literals and template patterns —
 * each carrying the guard that stands immediately before it.
 * @param {KeyFunction} fn
 * @returns {KeyForm[]}
 */
export function keyForms(fn) {
  /** @type {KeyForm[]} */
  const out = [];
  /** @param {number} at @returns {string} */
  const guardAt = (at) => {
    const before = fn.body.slice(0, at);
    const m = before.match(/\bif\s*\(([\s\S]*?)\)\s*(?:\{\s*)?(?:return\s*)?$/);
    return m ? m[1].replace(/\s+/g, ' ').trim() : '';
  };
  for (const m of fn.body.matchAll(/'((?:[^'\\]|\\.)*)'/g)) {
    out.push({
      kind: 'literal', text: m[1], holes: [], guard: guardAt(m.index || 0),
    });
  }
  for (const m of fn.body.matchAll(/`((?:[^`\\]|\\.)*)`/g)) {
    const raw = m[1];
    if (!raw.includes('${')) {
      out.push({
        kind: 'literal', text: raw, holes: [], guard: guardAt(m.index || 0),
      });
      continue;
    }
    /** @type {string[]} */
    const holes = [];
    const text = raw.replace(/\$\{([^}]*)\}/g, (_, e) => { holes.push(String(e).trim()); return HOLE; });
    // A template that is nothing BUT a hole matches every key ever written; it recovers
    // nothing and would make the census claim total coverage it does not have.
    if (text === HOLE) continue;
    out.push({
      kind: 'template', text, holes, guard: guardAt(m.index || 0),
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
 */

/**
 * Module-level `const NAME = { '<field value>': '<pool key>' }` tables and the expressions
 * that index them. Rung 3 of the ladder: the predicate is the indexing expression compared
 * against the map's own key.
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
    /** @type {string[]} */
    const readers = [];
    for (const r of src.matchAll(new RegExp(`\\b${m[1]}\\s*\\??\\[([^\\]]+)\\]`, 'g'))) readers.push(r[1].trim());
    out.push({ name: m[1], entries, readers });
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
 * @property {'literal'|'template'|'table'|'none'} rung which rung of the ladder answered
 * @property {number} variants
 * @property {number} grammars distinct move orders across the pool's variants
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
 */

/**
 * THE (block, pool) → {predicate, fields read, slots filled} CENSUS.
 * @param {CensusInput} input
 * @returns {{rows: CensusRow[], functions: number, tables: number}}
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
  /** @type {Map<string, {fn: KeyFunction, forms: KeyForm[], aliases: Map<string, string>, args: Map<string, string[]>}>} */
  const prepared = new Map();
  for (const fn of fns) {
    prepared.set(fn.name, {
      fn,
      forms: keyForms(fn),
      aliases: localAliases(fn.body, fn.params),
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
        block, pool, variants, filled, prepared, tables, unmounted,
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
  return { rows, functions: fns.length, tables: tableCount };
}

/**
 * One row of the census. Split out because the ladder is the interesting part and a reader
 * should meet it without the two enclosing loops.
 * @param {{block: string, pool: string,
 *   variants: ReadonlyArray<{text: string, slots?: ReadonlyArray<string>}>,
 *   filled: string[],
 *   prepared: Map<string, {fn: KeyFunction, forms: KeyForm[], aliases: Map<string, string>,
 *     args: Map<string, string[]>}>,
 *   tables: Map<string, KeyTable[]>, unmounted: Set<string>}} args
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
  // RUNG 1 and RUNG 2 — the key function's own forms.
  for (const { fn, forms, aliases, args: callArgs } of prepared.values()) {
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
      return {
        ...base,
        predicate: qualify([...guardRows, ...extra], fn, callArgs),
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
 * @property {'MISSING'|'THIN'|'COVERED'} tier
 * @property {string} block
 * @property {string} subject the pool, the fact, or the fact pair
 * @property {string[]} fields
 * @property {string} readingFunction
 * @property {string} count the measurement that put this row in its tier
 */

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
  const spokenTo = new Set(rows.flatMap((r) => r.predicate.map((p) => p.field)));
  for (const fact of input.held || []) {
    if (spokenTo.has(fact)) continue;
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
      notExecutable: ['no `minTowns` floor supplied — "co-fire on many towns" is a threshold, and this instrument does not invent one'],
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
 * The summary the receipt prints: totals, the status split by block, the largest unresolved
 * reasons, the slots with no provider, and the variants-per-pool histogram (the owner's
 * 21:50 ruling makes the variant count a first-class column: every semantic variant will
 * get a family of FOUR wordings and nothing is ever trimmed, so the tier table sizes that
 * authoring too).
 * @param {ReadonlyArray<CensusRow>} rows
 * @param {ReadonlyArray<string>} [held] car 5's unrendered-facts census — every reading the
 *   composers HOLD. The "a predicate over a field the block does not read" arm compares each
 *   predicate's root against this set; WITHOUT it the arm is NOT-EXECUTABLE and says so,
 *   because a comparison against nothing answers `[]` and reads as a clean bill.
 * @returns {{total: number, resolved: number, unresolved: number,
 *   byBlock: Array<[string, {resolved: number, unresolved: number}]>,
 *   reasons: Array<[string, number]>, slotless: Array<{block: string, pool: string, slots: string[]}>,
 *   bagless: Array<{block: string, pool: string, slots: string[]}>,
 *   predicatesOverUnreadFields: Array<{block: string, pool: string, field: string}>,
 *   predicateArmExecutable: boolean,
 *   variantHistogram: Array<[number, number]>, variants: number, meanPerPool: string,
 *   perBlock: Array<[string, number]>}}
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
  /** @type {Array<{block: string, pool: string, field: string}>} */
  const overUnread = [];
  const heldSet = Array.isArray(held) ? new Set(held) : null;
  let resolved = 0;
  let variants = 0;
  for (const row of rows) {
    if (!byBlock.has(row.block)) byBlock.set(row.block, { resolved: 0, unresolved: 0 });
    const seat = byBlock.get(row.block);
    if (seat) {
      if (row.status === WIRING_STATUS.RESOLVED) seat.resolved++; else seat.unresolved++;
    }
    if (row.status === WIRING_STATUS.RESOLVED) resolved++;
    else reasons.set(row.reason, (reasons.get(row.reason) || 0) + 1);
    histogram.set(row.variants, (histogram.get(row.variants) || 0) + 1);
    perBlock.set(row.block, (perBlock.get(row.block) || 0) + row.variants);
    variants += row.variants;
    if (row.slotsWithoutProvider.length) {
      (row.hasBag ? slotless : bagless).push({ block: row.block, pool: row.pool, slots: row.slotsWithoutProvider });
    }
    if (heldSet) {
      for (const p of row.predicate) {
        if (p.field === '' || heldSet.has(rootOf(p.field))) continue;
        overUnread.push({ block: row.block, pool: row.pool, field: p.field });
      }
    }
  }
  const total = rows.length;
  return {
    total,
    resolved,
    unresolved: total - resolved,
    byBlock: [...byBlock].sort((a, b) => b[1].unresolved - a[1].unresolved),
    reasons: [...reasons].sort((a, b) => b[1] - a[1]),
    slotless,
    bagless,
    predicatesOverUnreadFields: overUnread,
    predicateArmExecutable: heldSet !== null,
    variantHistogram: [...histogram].sort((a, b) => a[0] - b[0]),
    variants,
    meanPerPool: total ? (variants / total).toFixed(2) : '0',
    perBlock: [...perBlock].sort((a, b) => b[1] - a[1]),
  };
}
