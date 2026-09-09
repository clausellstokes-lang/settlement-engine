/**
 * domain/prose/wiringBranch.js — ARCH car 0e: THE SELECTING BRANCH, READ STRUCTURALLY.
 *
 * ⚠ AN INSTRUMENT, NOT A PRODUCT SURFACE. This is the ELEVENTH module of the fenced prose
 * island (`tests/lint/proseWiringCensus.walker.test.js` arm (e)): nothing under `src/`
 * outside `src/domain/prose/` may name it, it reads no file, and it holds no state.
 *
 * ── WHY IT EXISTS, AND WHY IT IS ITS OWN FILE ───────────────────────────────────────
 * ARCH §4.4 defines a pool's `tests` as "every field the SELECTING BRANCH evaluates".
 * INSTR-912 car 8 implemented the FUNCTION-WIDE reading instead, so two branches of one
 * key function shared one read set, and the sitting's §O.1 ruled the grain back to the
 * branch. Reading a branch means reading the `if` chain STRUCTURALLY — the guards an
 * execution must have satisfied to reach a given literal — and that is a scanner, not a
 * column. The census module carries a hard 800-effective-line ceiling and stood at 745
 * before this car; the estate's own answer to that (car 0's refusal 1, ratified as §O.7)
 * is a second island module rather than a trim, so this is it. `balancedSlice` and
 * `fieldChains` move here WHOLE and the census module re-exports them, because a bracket
 * reader or a chain reader that disagrees with itself across two instruments is how one
 * census counts a key the other cannot see.
 *
 * ── WHAT "THE PATH" MEANS, EXACTLY ──────────────────────────────────────────────────
 * For a key literal at index `at`, the path is every guard an execution reaching `at` must
 * have decided, in source order:
 *
 *   1. an ENCLOSING `if` whose consequent contains `at` — decided TRUE;
 *   2. a PRECEDING SIBLING `if` in a region that also holds `at`, whose consequent EXITS
 *      (`return` / `throw` / `continue` / `break`) — decided FALSE, and that exclusion is a
 *      reading of the same field: ARCH §6.3 spells DS-DEF-11's THREATENED and QUIET tests
 *      as "{walls, gate (by exclusion), family}";
 *   3. an `else` branch holding `at` — the enclosing guard, decided FALSE.
 *
 * A sibling `if` whose consequent does NOT exit is left OUT: falling past it decides
 * nothing, so claiming its field would hand the pool a licence it does not hold. The
 * guards INSIDE a sibling's consequent are left out too, which is the whole reason this is
 * a recursion over regions and not a backwards scan for the nearest `if`: at
 * `defenseStateProse.js:757` the UNWALLED literals sit AFTER the walled block, and a
 * depth-blind reader hands them the gate and the monster family they never see.
 */

/**
 * Read from an opening bracket to its match, respecting strings, template literals and
 * comments.
 * @param {string} src
 * @param {number} open index of `(` `{` or `[`
 * @returns {{inner: string, end: number}}
 */
export function balancedSlice(src, open) {
  /** @type {Record<string, string>} */
  const pairs = { '(': ')', '{': '}', '[': ']' };
  if (!pairs[src[open]]) throw new Error(`wiringBranch.balancedSlice: index ${open} is not an opening bracket`);
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
  throw new Error(`wiringBranch.balancedSlice: unbalanced bracket at ${open}`);
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
 * EVERY READING AN EXPRESSION EVALUATES — the same three sources `readings()` unions over a
 * whole function body, applied to one guard: the param-rooted member chains, the bare
 * params the expression names, and the local aliases it names, each replaced by the chain
 * the alias reads. Spelled to MATCH the function-wide reader so that the two grains the
 * census prints side by side are comparable rather than two different questions.
 *
 * ⚠ IT IS NOT `predicateRows`. A guard row needs a `{field, op, value}` triple and drops an
 * atom it cannot split, so `SMALL_TIERS.includes(size)` yields no row at all — and ARCH
 * §6.3 counts `tier` among UNWALLED's tests. What the branch EVALUATES and what a triple
 * can be recovered from are different questions; this answers the first.
 * @param {string} expr
 * @param {ReadonlyArray<string>} params
 * @param {Map<string, string>} [aliases] alias to the chain it reads
 * @returns {string[]} sorted, unique
 */
export function guardFields(expr, params, aliases) {
  const text = String(expr);
  /** @type {Set<string>} */
  const out = new Set(fieldChains(text, params));
  for (const m of text.matchAll(/\b([A-Za-z_$][\w$]*)\b/g)) {
    if (params.includes(m[1])) { out.add(m[1]); continue; }
    const alias = aliases instanceof Map ? aliases.get(m[1]) : undefined;
    if (alias) out.add(alias);
  }
  return [...out].sort();
}

/**
 * THE ALIAS MAP FOR A READ, WHICH IS NOT THE ALIAS MAP FOR A VALUE. `localAliases` in the
 * census module maps an alias to the reading whose VALUE selects the pool, so its bare limb
 * stops at the initialiser's leading identifier; reading further would let a LOOKUP
 * (`const family = measuredMonsterFamily(monsterThreat)`) claim `monsterThreat === 'settled'`
 * when the config value behind that family is `heartland`. Fifty pools resolve that way and
 * fifty predicates would be false, so the census refuses it there.
 *
 * A READ is the other question and the same hop is exact on it: whatever the helper does to
 * the value, the branch DOES read `monsterThreat`, and ARCH §6.3 counts it among the tests
 * of DS-DEF-11's THREATENED and QUIET. So this map takes the first PARAM the initialiser
 * names, and it is used for `reads` and never for a predicate row.
 * @param {string} body
 * @param {ReadonlyArray<string>} params
 * @returns {Map<string, string>} alias to the chain or param it reads
 */
export function readingAliases(body, params) {
  /** @type {Map<string, string>} */
  const out = new Map();
  for (const m of String(body).matchAll(/\bconst\s+([A-Za-z_$][\w$]*)\s*=\s*([^;\n]+)/g)) {
    const chains = fieldChains(m[2], params);
    if (chains.length) { out.set(m[1], chains[0]); continue; }
    for (const bare of m[2].matchAll(/\b([A-Za-z_$][\w$]*)\b/g)) {
      if (!params.includes(bare[1])) continue;
      out.set(m[1], bare[1]);
      break;
    }
  }
  return out;
}

/** The statement kinds whose presence at the end of a consequent makes it EXIT. */
const EXITS = /^\s*(?:return|throw|continue|break)\b/;

/**
 * Does a consequent leave the enclosing region rather than fall through to what follows?
 * Read off the LAST statement line, comments stripped: a consequent whose last line is a
 * nested `if` is left as NOT exiting, which under-claims the path and never over-claims it.
 * @param {string} text
 * @returns {boolean}
 */
function exits(text) {
  const lines = String(text)
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .split('\n')
    .map((line) => line.replace(/\/\/.*$/, '').trim())
    .filter((line) => line !== '' && line !== '}' && line !== '{');
  return lines.length > 0 && EXITS.test(lines[lines.length - 1]);
}

/**
 * Advance past a comment or a string literal opening at `i`; otherwise return `i`.
 * @param {string} src
 * @param {number} i
 * @returns {number}
 */
function skipAtomic(src, i) {
  const c = src[i];
  if (c === '/' && src[i + 1] === '/') {
    const nl = src.indexOf('\n', i);
    return nl < 0 ? src.length : nl + 1;
  }
  if (c === '/' && src[i + 1] === '*') {
    const end = src.indexOf('*/', i);
    return end < 0 ? src.length : end + 2;
  }
  if (c !== '\'' && c !== '"' && c !== '`') return i;
  let j = i + 1;
  while (j < src.length && src[j] !== c) { if (src[j] === '\\') j++; j++; }
  return j + 1;
}

/**
 * The end of a single-statement consequent: the first `;` outside any bracket group.
 * @param {string} src
 * @param {number} from
 * @returns {number} the index one past the statement
 */
function statementEnd(src, from) {
  let i = from;
  while (i < src.length) {
    const skipped = skipAtomic(src, i);
    if (skipped !== i) { i = skipped; continue; }
    const c = src[i];
    if (c === '(' || c === '{' || c === '[') { i = balancedSlice(src, i).end + 1; continue; }
    if (c === ';' || c === '\n') return i;
    i += 1;
  }
  return src.length;
}

/**
 * The next non-space, non-comment index at or after `i`.
 * @param {string} src
 * @param {number} i
 * @returns {number}
 */
function nextCode(src, i) {
  let j = i;
  for (;;) {
    while (j < src.length && /\s/.test(src[j])) j += 1;
    const skipped = j < src.length && src[j] === '/' ? skipAtomic(src, j) : j;
    if (skipped === j) return j;
    j = skipped;
  }
}

/**
 * The guards on the path from the entry of one statement REGION to `at`, appended to `out`.
 * @param {string} src the function body, code-only
 * @param {number} from region start
 * @param {number} to region end
 * @param {number} at the index the path leads to
 * @param {string[]} out
 * @returns {string[]} `out`
 */
function regionPath(src, from, to, at, out) {
  const ident = /[A-Za-z_$][\w$]*/y;
  /** @param {{inner: string}} g @returns {string} */
  const flat = (g) => g.inner.replace(/\s+/g, ' ').trim();
  let i = from;
  while (i < to && i < at) {
    const skipped = skipAtomic(src, i);
    if (skipped !== i) { i = skipped; continue; }
    const c = src[i];
    if (c === '(' || c === '{' || c === '[') { i = balancedSlice(src, i).end + 1; continue; }
    ident.lastIndex = i;
    const word = ident.exec(src);
    if (!word) { i += 1; continue; }
    if (word[0] !== 'if') { i += word[0].length; continue; }
    const paren = nextCode(src, i + 2);
    if (src[paren] !== '(') { i += 2; continue; }
    const guard = balancedSlice(src, paren);
    const body = nextCode(src, guard.end + 1);
    const block = src[body] === '{';
    const start = block ? body + 1 : body;
    const end = block ? balancedSlice(src, body).end : statementEnd(src, body);
    if (at >= start && at < end) {
      out.push(flat(guard));
      return regionPath(src, start, end, at, out);
    }
    const after = nextCode(src, end + 1);
    if (/^else\b/.test(src.slice(after, after + 5))) {
      const elseAt = nextCode(src, after + 4);
      const elseBlock = src[elseAt] === '{';
      const elseStart = elseBlock ? elseAt + 1 : elseAt;
      const elseEnd = elseBlock ? balancedSlice(src, elseAt).end : statementEnd(src, elseAt);
      if (at >= elseStart && at < elseEnd) {
        out.push(flat(guard));
        return regionPath(src, elseStart, elseEnd, at, out);
      }
      i = elseEnd + 1;
      continue;
    }
    // A SIBLING DECIDED FALSE — but only where falling past it decides anything at all.
    if (exits(src.slice(start, end))) out.push(flat(guard));
    i = end + 1;
  }
  return out;
}

/**
 * THE SELECTING BRANCH'S GUARDS, from the function's entry to a key literal.
 * @param {string} body the key function's body, code-only
 * @param {number} at the index the key literal opens at
 * @returns {string[]} the guard expressions, entry first
 */
export function branchPath(body, at) {
  const src = String(body);
  const index = Number(at);
  // ⛔ NO `try/catch` HERE. A scanner that answered `[]` on its own failure would hand every
  // row the function-wide grain and read as a measurement; `balancedSlice` throws loudly on
  // an unbalanced body and this reader lets it, because a silent degrade is the false green
  // this estate has a name for.
  if (!Number.isFinite(index) || index < 0 || index > src.length) return [];
  return regionPath(src, 0, src.length, index, []);
}
