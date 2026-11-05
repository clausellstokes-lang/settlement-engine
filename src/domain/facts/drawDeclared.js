/**
 * domain/facts/drawDeclared.js — THE ONE DRAW FUNCTION (CENSUS-1b wave 1, item 3;
 * `docs/DESIGN_POOL_CENSUS.md` §3.3).
 *
 * `drawDeclared(pool, { facts, draw, key })` → `{ line, text, refused, resolvedBy }`.
 *
 * THE DRAW-COUNT RULE. `draw` is the site's EXISTING selector (a seeded `pick`, a hash modulus,
 * a lookup), and it is applied to the FULL pool exactly as before — once, over the same array —
 * so no roll is added, removed or re-mapped. Then the drawn line is RESOLVED:
 *   drawn    its declaration is admitted by the record (`factVocabulary.js :: declarationAdmits`):
 *            kept, byte-identical;
 *   twin     it is refused: its declared TWIN (a sibling line carrying `twinOf: <its text>`, the
 *            complementary atom; or the site's own `twin` resolver) if that is admitted;
 *   argmax   else the admitted member of the pool with the highest `hashKey(key::lineId)` (the
 *            kernel's hash, so no roll);
 *   none     else nothing.
 * Only a REFUSED winner ever moves. A line with no declaration is admitted everywhere (silence =
 * neutral) except in a pool that opted into the crisis dimension (`crisisScoped`), where silence
 * reads as calm. Twin lines are NOT in the draw's domain: they stand beside their original in the
 * table and are reached only by resolution, so dissolving a text-keyed twin into its table moves
 * no draw. The kernel's `eligibleVariants` keeps its pre-filter (for a hash argmax over `vid` the
 * pre-filter and resolve-after agree); every other site calls this.
 *
 * FAIL-CLOSED: a declared line drawn with no `facts` is refused (unanswered never reads absent).
 * Every resolved draw is noted in the open presumption ledger (`presumptionLedger.js`).
 *
 * Pure apart from the site's own `draw`; consumes no randomness of its own.
 *
 * @enforced-by tests/domain/facts/drawDeclared.test.js
 */
import { declarationOf, declarationAdmits, declarationOfTags, declares, atomsOf } from './factVocabulary.js';
import { activePresumptionLedger, notePresumption } from './presumptionLedger.js';
import { hashKey } from '../display/stateProse/stateProseKernel.js';

/**
 * The text a pool line prints: a bare string is itself; a declared line is `{ text, … }`.
 * @param {unknown} line
 * @returns {any}
 */
export function lineText(line) {
  if (line && typeof line === 'object' && typeof (/** @type {{text?: unknown}} */ (line)).text === 'string') {
    return /** @type {{text: string}} */ (line).text;
  }
  return line;
}

/** @param {unknown} line @returns {boolean} a twin line, reached only by resolution */
const isTwin = (line) => !!line && typeof line === 'object' && typeof (/** @type {{twinOf?: unknown}} */ (line)).twinOf === 'string';

/** @type {WeakMap<object, boolean>} pool → does any member declare or carry a twin */
const DECLARED_POOL = new WeakMap();

/** @param {ReadonlyArray<unknown>} pool @param {boolean} tagged */
function poolDeclares(pool, tagged) {
  if (!tagged) {
    const held = DECLARED_POOL.get(pool);
    if (held !== undefined) return held;
  }
  const any = pool.some((l) => isTwin(l) || declares(declarationOf(l, { tagged })));
  if (!tagged && Object.isFrozen(pool)) DECLARED_POOL.set(pool, any);
  return any;
}

/**
 * @typedef {object} DrawDeclaredOptions
 * @property {(pool: any[]) => any} draw the site's existing selector over the pool it is handed
 * @property {object|null|(() => object|null)} [facts] `factsOf(record)`, or a thunk to it (read only when a line declares)
 * @property {string} [key] the hash key prefix for the argmax resolution (`seed::pool`)
 * @property {string} [poolId] the pool's name in the ledger and the census
 * @property {string} [surface] the DM-facing surface (`npcs`, `overview`, …)
 * @property {'R'|'H'|'T'|'A'|'K'} [drawKind]
 * @property {boolean} [tagged] the table's entries declare through a `tags` field (registries)
 * @property {boolean} [crisisScoped] the pool opted into the crisis dimension
 * @property {ReadonlyArray<string>} [poolDeclares] the pool's own atoms
 * @property {(line: any) => any} [twin] the site's twin resolver (a text-keyed lookup)
 * @property {Record<string, unknown>} [ctx] the per-line context a context atom needs (`npc`)
 */

/**
 * @param {ReadonlyArray<any>} pool
 * @param {DrawDeclaredOptions} options
 * @returns {{ line: any, text: any, refused: string[] | null, resolvedBy: 'drawn'|'twin'|'argmax'|'none' }}
 */
export function drawDeclared(pool, options) {
  const list = Array.isArray(pool) ? pool : [];
  const tagged = options.tagged === true;
  const scoped = options.crisisScoped === true;
  const poolAtoms = Array.isArray(options.poolDeclares) && options.poolDeclares.length ? options.poolDeclares : null;
  const declared = scoped || poolAtoms !== null || poolDeclares(list, tagged);
  // THE DRAW, over the full pool (twins aside: they are reached by resolution only).
  const domain = declared && list.some(isTwin) ? list.filter((l) => !isTwin(l)) : pool;
  const drawn = options.draw(/** @type {any[]} */ (domain));
  if (!declared) {
    note(options, drawn, list, [], drawn == null ? 'none' : 'drawn');
    return { line: drawn, text: lineText(drawn), refused: null, resolvedBy: drawn == null ? 'none' : 'drawn' };
  }
  const facts = typeof options.facts === 'function' ? options.facts() : options.facts ?? null;
  const admit = (/** @type {any} */ line) => {
    if (poolAtoms && !declarationAdmits(declarationOfTags(poolAtoms), /** @type {any} */ (facts)).admitted) {
      return { admitted: false, refused: ['(pool) ' + poolAtoms.join(' · ')] };
    }
    return declarationAdmits(declarationOf(line, { tagged }), /** @type {any} */ (facts), { crisisScoped: scoped, ctx: options.ctx });
  };
  if (drawn == null) {
    note(options, drawn, list, [], 'none');
    return { line: drawn, text: lineText(drawn), refused: null, resolvedBy: 'none' };
  }
  const verdict = admit(drawn);
  if (verdict.admitted) {
    note(options, drawn, list, atomsOf(declarationOf(drawn, { tagged })), 'drawn');
    return { line: drawn, text: lineText(drawn), refused: null, resolvedBy: 'drawn' };
  }
  // 1. its twin
  const own = lineText(drawn);
  const twin = typeof options.twin === 'function'
    ? options.twin(drawn)
    : list.find((l) => isTwin(l) && /** @type {{twinOf: string}} */ (l).twinOf === own);
  if (twin != null && twin !== drawn && admit(twin).admitted) {
    note(options, twin, list, atomsOf(declarationOf(twin, { tagged })), 'twin');
    return { line: twin, text: lineText(twin), refused: verdict.refused, resolvedBy: 'twin' };
  }
  // 2. the hash argmax over the admitted members (no roll)
  let best = null; let bestKey = -1;
  list.forEach((l, i) => {
    if (isTwin(l) || !admit(l).admitted) return;
    const k = hashKey(`${options.key || options.poolId || ''}::${lineIdOf(l, i)}`);
    if (k > bestKey) { best = l; bestKey = k; }
  });
  if (best !== null) {
    note(options, best, list, atomsOf(declarationOf(best, { tagged })), 'argmax');
    return { line: best, text: lineText(best), refused: verdict.refused, resolvedBy: 'argmax' };
  }
  note(options, null, list, [], 'none');
  return { line: null, text: null, refused: verdict.refused, resolvedBy: 'none' };
}

/**
 * KIND A: a list printed whole has no draw to protect — it is filtered, and it is lawful iff each
 * item is. Order is kept; each kept item is noted.
 * @template T
 * @param {ReadonlyArray<T>} list
 * @param {Omit<DrawDeclaredOptions, 'draw'|'twin'|'key'>} options
 * @returns {T[]}
 */
export function filterDeclared(list, options) {
  const items = Array.isArray(list) ? list : [];
  const tagged = options.tagged === true;
  const scoped = options.crisisScoped === true;
  if (!scoped && !poolDeclares(items, tagged)) {
    for (const item of items) note(options, item, items, [], 'drawn');
    return [...items];
  }
  const facts = typeof options.facts === 'function' ? options.facts() : options.facts ?? null;
  return items.filter((item) => {
    if (isTwin(item)) return false;
    const ok = declarationAdmits(declarationOf(item, { tagged }), /** @type {any} */ (facts), { crisisScoped: scoped, ctx: options.ctx }).admitted;
    if (ok) note(options, item, items, atomsOf(declarationOf(item, { tagged })), 'drawn');
    return ok;
  });
}

/**
 * KIND T: a table cell with no draw. A cell that is a bare line is itself; a cell that is a
 * declared sibling set (an original and its twin) resolves to its first non-twin line, through
 * the same rule.
 * @param {any} cell
 * @param {Omit<DrawDeclaredOptions, 'draw'>} options
 */
export function resolveDeclared(cell, options) {
  const pool = Array.isArray(cell) ? cell : [cell];
  return drawDeclared(pool, { ...options, draw: (p) => p[0], drawKind: options.drawKind || 'T' });
}

/**
 * A DECLARED SIBLING SET, resolved where its original was drawn (CENSUS-1c unit 1: the twins of
 * `defenceTwinLines.js` and `inlandHookLines.js` dissolved into their originals' own tables). A
 * table keeps its original line where its string consumers read it and declares, BESIDE it in the
 * same file, the set `[{ text: <original>, needs }, { text: <twin>, twinOf: <original>, excludes }]`
 * keyed by the original's text. A drawn line that is no key is handed back untouched; a key
 * resolves through `resolveDeclared` (the original if admitted, else its twin). No roll is added:
 * the draw already happened. An UNANSWERED record (no facts) keeps the original — the retired
 * text-keyed lookup's own rule, kept so no birth moves (the self-check still re-asserts it).
 * @template T
 * @param {T} line the drawn line
 * @param {Readonly<Record<string, ReadonlyArray<any>>>} siblings the table's sibling sets
 * @param {Omit<DrawDeclaredOptions, 'draw'>} options
 * @returns {T}
 */
export function resolveSibling(line, siblings, options) {
  if (typeof line !== 'string' || !Object.prototype.hasOwnProperty.call(siblings, line)) return line;
  const facts = typeof options.facts === 'function' ? options.facts() : options.facts ?? null;
  if (!facts) return line;
  const r = resolveDeclared(siblings[line], { ...options, facts });
  return r.line == null ? line : /** @type {T} */ (lineText(r.line));
}

/**
 * The same, sentence by sentence: each sentence of a drawn passage that is a sibling key resolves;
 * every other sentence and the spacing between them are kept (a line whose drawn tail — an
 * event's name — keeps the whole from being a key).
 * @template T
 * @param {T} text
 * @param {Readonly<Record<string, ReadonlyArray<any>>>} siblings
 * @param {Omit<DrawDeclaredOptions, 'draw'>} options
 * @returns {T}
 */
export function resolveSiblingSentences(text, siblings, options) {
  if (typeof text !== 'string') return text;
  return /** @type {T} */ (/** @type {unknown} */ (text.split(/(?<=[.!?])(\s+)/).map((part) => resolveSibling(part, siblings, options)).join('')));
}

/** @param {any} line @param {number} i */
function lineIdOf(line, i) {
  if (line && typeof line === 'object' && (typeof line.id === 'string' || typeof line.id === 'number')) return line.id;
  return i;
}

/**
 * @param {DrawDeclaredOptions | Omit<DrawDeclaredOptions, 'draw'|'twin'|'key'>} options
 * @param {any} line @param {ReadonlyArray<any>} pool @param {string[]} atoms
 * @param {'drawn'|'twin'|'argmax'|'none'} resolvedBy
 */
function note(options, line, pool, atoms, resolvedBy) {
  if (activePresumptionLedger() === null || line == null) return;
  const i = pool.indexOf(line);
  notePresumption({
    pool: options.poolId || '(unnamed)',
    lineId: lineIdOf(line, i),
    atoms,
    surface: options.surface || '(unnamed)',
    drawKind: options.drawKind || 'R',
    resolvedBy,
    ...(options.crisisScoped ? { crisisScoped: true } : {}),
    ...(options.poolDeclares && options.poolDeclares.length ? { poolDeclares: options.poolDeclares } : {}),
    ...(options.ctx ? { ctx: options.ctx } : {}),
  });
}
