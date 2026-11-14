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
import { fnv1a32 } from '../../kernel/proseHash.js';
import { UNTYPED } from '../hookThemes.js';

/** @typedef {import('./factVocabulary.js').FactsLike} FactsLike */

/**
 * The text a line of type T prints: a declared row's `text`, else the line itself.
 * @template T
 * @typedef {T extends { text: infer X } ? (X extends string ? string : X extends Function ? X : T) : T} LineText
 */

/**
 * The text a pool line prints: a bare string or template is itself; a declared line is
 * `{ text, … }` around either, and gives back its `text` — a string, or a template function the
 * caller applies (FIX-HOOK-OBJECT, 2026-11-09: a function-valued `text` was handed back as the
 * row and printed "[object Object]"; `tests/lint/declaredLineShape.test.js` holds the shape).
 * @template T
 * @param {T} line
 * @returns {LineText<T>}
 */
export function lineText(line) {
  if (line && typeof line === 'object') {
    const text = /** @type {{text?: unknown}} */ (line).text;
    if (typeof text === 'string' || typeof text === 'function') return /** @type {LineText<T>} */ (text);
  }
  return /** @type {LineText<T>} */ (line);
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
 * @template [L=unknown] the pool's line type
 * @typedef {object} DrawDeclaredOptions
 * @property {(pool: L[]) => L | null | undefined} draw the site's existing selector over the pool it is handed
 * @property {object|null|(() => object|null)} [facts] `factsOf(record)`, or a thunk to it (read only when a line declares)
 * @property {string} [key] the hash key prefix for the argmax resolution (`seed::pool`)
 * @property {string} [poolId] the pool's name in the ledger and the census
 * @property {string} [surface] the DM-facing surface (`npcs`, `overview`, …)
 * @property {'R'|'H'|'T'|'A'|'K'} [drawKind]
 * @property {boolean} [tagged] the table's entries declare through a `tags` field (registries)
 * @property {boolean} [crisisScoped] the pool opted into the crisis dimension
 * @property {ReadonlyArray<string>} [poolDeclares] the pool's own atoms
 * @property {(line: L) => L | null | undefined} [twin] the site's twin resolver (a text-keyed lookup)
 * @property {Record<string, unknown>} [ctx] the per-line context a context atom needs (`npc`)
 * @property {DrawRegistry<L>} [registry] the site's no-repeat registry when it draws through
 *   `hookVariety.js :: drawUnique` (R-AJ, CENSUS-1g unit 3): a refused line resolves FIRST to a
 *   fresh admitted template (`freshAdmitted`), before the twin and the argmax
 * @property {boolean} [keepRefused] the site KEEPS its drawn line when nothing is admitted (a slot
 *   that is never emptied: site 18's descriptions, the conversion beat): the result then carries
 *   the refused drawn line with `resolvedBy: 'kept'`, and the ledger notes it with its atoms so the
 *   birth self-check judges it (R-AM, CENSUS-1g unit 2)
 * @property {boolean} [dropRefused] `resolveSibling` only: a refused original with no admitted
 *   twin answers `null` and the site drops the slot (R-AU, CENSUS-1h); an UNANSWERED record (no
 *   facts) still keeps the original
 * @property {Set<string> | null} [held] MERGE-R2 (the chair's ruling 2, composing REVIEW-INTAKE-4):
 *   the texts the rest of the roster already carries. A line whose `heldKey` is held is excluded
 *   from the candidates BEFORE the draw (and from the twin and the argmax); a pool with every
 *   candidate held spends NO roll and answers `none`. An empty or absent set changes nothing.
 * @property {(line: L) => string} [heldKey] the text a line would put on the figure (default: its
 *   `lineText`, trimmed)
 */

/**
 * @template [L=unknown] the pool's line (template) type
 * @typedef {object} DrawRegistry the settlement-scoped registries `drawUnique` reads (HK-3)
 * @property {Set<string> | undefined} used the family registry (the template's key)
 * @property {(x: L) => string} keyFn a template's family key
 * @property {Set<string>} [themes] the theme registry
 * @property {(x: L) => string} [themeOfFn] a template's theme (`UNTYPED` blocks nothing)
 */

/**
 * The line type of a table cell: a sibling set's member, else the cell itself.
 * @template C
 * @typedef {C extends ReadonlyArray<infer E> ? E : C} CellLine
 */

/**
 * @template L the pool's line type
 * @typedef {object} DrawResult
 * @property {L | null | undefined} line the resolved line (null / undefined: nothing printed)
 * @property {LineText<L> | null | undefined} text its text
 * @property {string[] | null} refused the drawn line's refused atoms, null when it was admitted
 * @property {'drawn'|'twin'|'argmax'|'none'|'kept'} resolvedBy
 */

/**
 * THE REGISTRY-AWARE RESOLUTION (CENSUS-3e's `freshAdmittedTwin`, lifted here by R-AJ, CENSUS-1g
 * unit 3). When a line drawn through `drawUnique` is refused, the argmax keyed by the pool alone
 * ignores the settlement's registries: two refused draws resolve to the same template and a hook
 * is lost as a duplicate (HK-3's `pin:no-hook-is-lost`). This picks, among the admitted templates
 * whose family is still unused (preferring an unspoken theme, `drawUnique`'s tiers), the one with
 * the highest FNV-1a hash of `key::drawn::candidate`, and registers it. It consumes NO roll. With
 * no family registry, or nothing fresh, it answers `undefined` and the resolution goes on.
 * @template L
 * @param {ReadonlyArray<L>} list @param {L} drawn @param {DrawRegistry<L>} reg
 * @param {(x: L) => boolean} admits @param {string} key
 * @returns {L | undefined}
 */
function freshAdmitted(list, drawn, reg, admits, key) {
  const used = reg.used;
  if (!(used instanceof Set)) return undefined;
  const fresh = list.filter((x) => x !== drawn && !isTwin(x) && !used.has(reg.keyFn(x)) && admits(x));
  if (fresh.length === 0) return undefined;
  const themeOf = reg.themes instanceof Set && typeof reg.themeOfFn === 'function' ? reg.themeOfFn : null;
  const blocking = (/** @type {L} */ x) => {
    const t = themeOf ? themeOf(x) : null;
    return typeof t === 'string' && t !== '' && t !== UNTYPED ? t : null;
  };
  const unspoken = themeOf ? fresh.filter((x) => { const t = blocking(x); return t === null || !reg.themes?.has(t); }) : [];
  const candidates = unspoken.length > 0 ? unspoken : fresh;
  const own = reg.keyFn(drawn);
  let best = candidates[0]; let bestKey = -1;
  for (const x of candidates) {
    const k = fnv1a32(`${key}::${own}::${reg.keyFn(x)}`);
    if (k > bestKey) { best = x; bestKey = k; }
  }
  used.add(reg.keyFn(best));
  if (themeOf) { const t = blocking(best); if (t !== null) reg.themes?.add(t); }
  return best;
}

/**
 * @template L
 * @param {ReadonlyArray<L>} pool
 * @param {DrawDeclaredOptions<L>} options
 * @returns {DrawResult<L>}
 */
export function drawDeclared(pool, options) {
  const list = Array.isArray(pool) ? pool : [];
  const tagged = options.tagged === true;
  const scoped = options.crisisScoped === true;
  const poolAtoms = Array.isArray(options.poolDeclares) && options.poolDeclares.length ? options.poolDeclares : null;
  const declared = scoped || poolAtoms !== null || poolDeclares(list, tagged);
  const isHeld = heldTest(options);
  // THE DRAW, over the full pool (twins aside: they are reached by resolution only), less what the
  // roster already holds (MERGE-R2: `held`; nothing left → no roll, nothing drawn).
  const unheld = isHeld ? (/** @type {ReadonlyArray<L>} */ (pool)).filter((l) => !isHeld(l)) : pool;
  const domain = declared && list.some(isTwin) ? unheld.filter((l) => !isTwin(l)) : unheld;
  if (isHeld && domain.length === 0) {
    note(options, null, list, [], 'none');
    return { line: null, text: null, refused: null, resolvedBy: 'none' };
  }
  const drawn = options.draw(/** @type {L[]} */ (domain));
  if (!declared) {
    note(options, drawn, list, [], drawn == null ? 'none' : 'drawn');
    return { line: drawn, text: lineText(drawn), refused: null, resolvedBy: drawn == null ? 'none' : 'drawn' };
  }
  const facts = typeof options.facts === 'function' ? options.facts() : options.facts ?? null;
  const admit = (/** @type {L} */ line) => {
    if (isHeld && isHeld(line)) return { admitted: false, refused: ['(held)'] };
    if (poolAtoms && !declarationAdmits(declarationOfTags(poolAtoms), /** @type {FactsLike | null} */ (facts)).admitted) {
      return { admitted: false, refused: ['(pool) ' + poolAtoms.join(' · ')] };
    }
    return declarationAdmits(declarationOf(line, { tagged }), /** @type {FactsLike | null} */ (facts), { crisisScoped: scoped, ctx: options.ctx });
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
  // 1. a fresh admitted template (a registry site), else its twin
  const own = lineText(drawn);
  const fresh = options.registry
    ? freshAdmitted(list, drawn, options.registry, (l) => admit(l).admitted, options.key || options.poolId || '')
    : undefined;
  const twin = fresh !== undefined ? fresh
    : typeof options.twin === 'function'
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
  if (options.keepRefused === true) {
    // R-AM: the site prints its refused drawn line; the ledger sees it.
    note(options, drawn, list, atomsOf(declarationOf(drawn, { tagged })), 'kept');
    return { line: drawn, text: lineText(drawn), refused: verdict.refused, resolvedBy: 'kept' };
  }
  note(options, null, list, [], 'none');
  return { line: null, text: null, refused: verdict.refused, resolvedBy: 'none' };
}

/**
 * MERGE-R2: the held test of `options.held` (null when nothing is held).
 * @template L
 * @param {DrawDeclaredOptions<L>} options
 * @returns {((line: L) => boolean) | null}
 */
function heldTest(options) {
  const held = options.held;
  if (!held || held.size === 0) return null;
  const keyOf = typeof options.heldKey === 'function' ? options.heldKey : (/** @type {L} */ l) => String(lineText(l) ?? '');
  return (line) => line != null && held.has(String(keyOf(line) ?? '').trim());
}

/**
 * MERGE-R2 (the chair's ruling 2): does any candidate of `pool` survive `held`? A chain of pools
 * (a role's goals, then its category's, then the generic pool) skips a pool with none left
 * WITHOUT a roll, so the one roll lands on the first pool that can answer.
 * @template L
 * @param {ReadonlyArray<L> | null | undefined} pool
 * @param {Pick<DrawDeclaredOptions<L>, 'held'|'heldKey'>} options
 * @returns {boolean}
 */
export function hasUnheldCandidate(pool, options) {
  if (!Array.isArray(pool) || pool.length === 0) return false;
  const isHeld = heldTest(/** @type {DrawDeclaredOptions<L>} */ (options));
  return pool.some((l) => !isTwin(l) && !(isHeld && isHeld(l)));
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
    const ok = declarationAdmits(declarationOf(item, { tagged }), /** @type {FactsLike | null} */ (facts), { crisisScoped: scoped, ctx: options.ctx }).admitted;
    if (ok) note(options, item, items, atomsOf(declarationOf(item, { tagged })), 'drawn');
    return ok;
  });
}

/**
 * KIND T: a table cell with no draw. A cell that is a bare line is itself; a cell that is a
 * declared sibling set (an original and its twin) resolves to its first non-twin line, through
 * the same rule.
 * @template C
 * @param {C} cell a line, or a sibling set (an array of lines)
 * @param {Omit<DrawDeclaredOptions<CellLine<C>>, 'draw'>} options
 * @returns {DrawResult<CellLine<C>>}
 */
export function resolveDeclared(cell, options) {
  const pool = /** @type {ReadonlyArray<CellLine<C>>} */ (/** @type {unknown} */ (Array.isArray(cell) ? cell : [cell]));
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
 * text-keyed lookup's own rule, kept so no birth moves. A KEPT original — unanswered, or refused
 * with no admitted twin — is NOTED with its atoms (`resolvedBy: 'kept'`, R-AM, CENSUS-1g unit 2),
 * so the birth self-check (`cert:false-presumption`) re-asserts it against the final record.
 * @template T
 * @param {T} line the drawn line
 * @param {Readonly<Record<string, ReadonlyArray<unknown>>>} siblings the table's sibling sets
 * @param {Omit<DrawDeclaredOptions, 'draw'>} options
 * @returns {T}
 */
export function resolveSibling(line, siblings, options) {
  if (typeof line !== 'string' || !Object.prototype.hasOwnProperty.call(siblings, line)) return line;
  const facts = typeof options.facts === 'function' ? options.facts() : options.facts ?? null;
  if (!facts) { noteKept(line, siblings[line], options); return line; }
  const r = resolveDeclared(siblings[line], { ...options, facts });
  if (r.line == null) {
    // R-AU (CENSUS-1h): a site with no admitted twin DROPS its refused line (kind A, as site 15
    // does) — `null`, noted 'none' by `resolveDeclared` — never keeps-and-notes it.
    if (options.dropRefused === true) return /** @type {T} */ (/** @type {unknown} */ (null));
    noteKept(line, siblings[line], options);
    return line;
  }
  return /** @type {T} */ (lineText(r.line));
}

/**
 * R-AM: a sibling set's original kept as printed (no admitted twin, or no facts) is noted with the
 * original row's atoms.
 * @param {string} line @param {ReadonlyArray<unknown>} set
 * @param {Omit<DrawDeclaredOptions, 'draw'>} options
 */
function noteKept(line, set, options) {
  const original = set.find((l) => !isTwin(l) && lineText(l) === line) ?? set[0];
  note({ ...options, drawKind: options.drawKind || 'T' }, original, set, atomsOf(declarationOf(original, { tagged: options.tagged === true })), 'kept');
}

/**
 * The same, sentence by sentence: each sentence of a drawn passage that is a sibling key resolves;
 * every other sentence and the spacing between them are kept (a line whose drawn tail — an
 * event's name — keeps the whole from being a key).
 * @template T
 * @param {T} text
 * @param {Readonly<Record<string, ReadonlyArray<unknown>>>} siblings
 * @param {Omit<DrawDeclaredOptions, 'draw'>} options
 * @returns {T}
 */
export function resolveSiblingSentences(text, siblings, options) {
  if (typeof text !== 'string') return text;
  return /** @type {T} */ (/** @type {unknown} */ (text.split(/(?<=[.!?])(\s+)/).map((part) => resolveSibling(part, siblings, options)).join('')));
}

/**
 * A DECLARED LINE KEPT AS DRAWN (CENSUS-1f unit 3): a site whose table declares but carries no twin
 * and is never pre-filtered (a faction NAME drawn by position: CENSUS-5b's `FACTION_NAME_SIBLINGS`,
 * "no twin: a twin name is an addition that moves the R stream", R-G) does not resolve — it keeps
 * its line and NOTES it, with the original row's atoms, so the birth self-check
 * (`cert:false-presumption`) re-asserts them against the final record. Needs no facts; moves no
 * birth; a line that is no key is not noted.
 * @param {unknown} line
 * @param {Readonly<Record<string, ReadonlyArray<unknown>>>} siblings
 * @param {Omit<DrawDeclaredOptions, 'draw'|'facts'|'twin'|'key'>} options
 */
export function noteDeclared(line, siblings, options) {
  if (typeof line !== 'string' || !Object.prototype.hasOwnProperty.call(siblings, line)) return;
  const set = siblings[line];
  const original = set.find((l) => !isTwin(l) && lineText(l) === line) ?? set[0];
  note({ ...options, drawKind: options.drawKind || 'R' }, original, set, atomsOf(declarationOf(original)), 'drawn');
}

/** @param {unknown} line @param {number} i @returns {string | number} */
function lineIdOf(line, i) {
  if (line && typeof line === 'object' && (typeof /** @type {{ id?: unknown }} */ (line).id === 'string' || typeof /** @type {{ id?: unknown }} */ (line).id === 'number')) return /** @type {{ id: string | number }} */ (line).id;
  return i;
}

/**
 * @param {Pick<DrawDeclaredOptions, 'poolId'|'surface'|'drawKind'|'crisisScoped'|'poolDeclares'|'ctx'>} options
 * @param {unknown} line @param {ReadonlyArray<unknown>} pool @param {string[]} atoms
 * @param {'drawn'|'twin'|'argmax'|'none'|'kept'} resolvedBy
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
    ...(typeof line === 'object' && /** @type {{ colour?: unknown }} */ (line).colour === true ? { colour: true } : {}), // R-AO: counted by declared-share
    ...(options.ctx ? { ctx: options.ctx } : {}),
  });
}
