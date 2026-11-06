/**
 * domain/facts/declarationRegisters.js — THE TWO DECLARATION REGISTERS' READINGS (CENSUS-1d
 * unit 3; `docs/DESIGN_POOL_CENSUS.md` §3.5).
 *
 * ONE reading of the state-prose corpus (the six generated leaves, the wiring census's pools)
 * that both registers pin:
 *   • THE UNDECLARED-LINES REGISTER (`tests/lint/undeclaredLines.register.json`, shrink-only):
 *     per pool, the lines that carry no declaration and whose pool is not ruled `{colour}`. A
 *     line DECLARES when its marks carry a fact atom of the vocabulary (`variantFactDeclaration`'s
 *     reading: `X`, `no X`, `crisis: …`) or one of the kernel's FACT dimension words — `walls` and
 *     F12's five crisis families, the same words as the vocabulary's atoms (R-O) — or when its pool
 *     declares for it (a brace group's atoms, or `{crisis-scoped}`: every line of an opted pool
 *     answers the crisis dimension). "Pure colour" is a POOL ruling (`{colour}`), never a line's
 *     silence, so "nobody declared it" stays distinct from "it presumes nothing". The kernel's
 *     three demoted STATE words (`severity`, `deficit`, `anchor`) and the audience mark are a
 *     desk's own reading, not declarations.
 *   • THE CRISIS-SCOPED REGISTER (`tests/lint/crisisScopedPools.register.json`, grow-only): the
 *     pools that opted into the inverse default. A pool leaving it needs the chair's note.
 *
 * Pool-level rulings ("this pool is pure colour") are possible once these exist: the ruling is a
 * `{colour}` brace on the pool's heading, and its row leaves the undeclared register by name.
 *
 * Pure: reads the leaves it is handed; no file, no clock.
 *
 * @enforced-by tests/domain/facts/declarationRegisters.test.js
 */
import { COLOUR_MARK, STATE_MARK_DIMENSIONS, declarationOfTags, declares } from './factVocabulary.js';

/** The kernel mark dimensions that are FACT dimensions (R-O): `walls` and F12's five families. */
export const FACT_MARK_DIMENSIONS = Object.freeze(['walls', 'threat', 'hunger', 'succession', 'unrest', 'crisis']);

/** @type {ReadonlySet<string>} every word of a fact mark dimension */
const FACT_MARK_WORDS = new Set(FACT_MARK_DIMENSIONS.flatMap((d) => STATE_MARK_DIMENSIONS[d]));
/** @type {ReadonlySet<string>} every kernel mark word (fact or state) */
const KERNEL_MARK_WORDS = new Set(Object.values(STATE_MARK_DIMENSIONS).flat());

/**
 * Does one state-prose variant declare? (Its own marks only; the pool's rulings are the caller's.)
 * @param {{ marks?: ReadonlyArray<string> } | null | undefined} variant
 * @returns {boolean}
 */
export function variantDeclares(variant) {
  const marks = Array.isArray(variant?.marks) ? variant.marks : [];
  if (marks.some((m) => FACT_MARK_WORDS.has(m))) return true;
  const atoms = marks.filter((m) => m !== 'dm-only' && !KERNEL_MARK_WORDS.has(m));
  return atoms.length > 0 && declares(declarationOfTags(atoms));
}

/**
 * The marks beside a `colour` mark that DECLARE (R-AO: a colour line declares nothing else) — a
 * fact atom or a fact mark word. Empty for a line that carries no `colour`, or carries it beside
 * only the audience mark and the kernel's state words.
 * @param {ReadonlyArray<string>} marks
 * @returns {string[]}
 */
export function colourConflicts(marks) {
  const list = Array.isArray(marks) ? marks : [];
  if (!list.includes(COLOUR_MARK)) return [];
  return list.filter((m) => m !== COLOUR_MARK && variantDeclares({ marks: [m] }));
}

/**
 * Is one state-prose variant marked colour by its own marks (R-AO)? Read; presumes nothing.
 * @param {{ marks?: ReadonlyArray<string> } | null | undefined} variant
 */
export function variantColour(variant) {
  return Array.isArray(variant?.marks) && variant.marks.includes(COLOUR_MARK);
}

/**
 * @typedef {object} PoolCount
 * @property {number} lines the pool's variants
 * @property {number} declaring the variants that declare (their own marks)
 * @property {number} colourLines the variants marked `colour` by their own marks (R-AO): read,
 *   presuming nothing — counted as declared by the register, never by `declaring`
 * @property {number} undeclared the register's count: 0 for a `{colour}` pool or a pool whose
 *   brace group declares for every line (atoms or `{crisis-scoped}`), else
 *   lines − declaring − colourLines
 * @property {boolean} crisisScoped @property {boolean} colour
 */

/**
 * One state-prose block as a leaf carries it: its pools (each a variant array) and each pool's brace
 * rulings (`{crisis-scoped}`, `{colour}`, a declares group).
 * @typedef {object} StatePoolBlock
 * @property {Readonly<Record<string, unknown>>} [pools]
 * @property {Readonly<Record<string, Readonly<{ crisisScoped?: unknown, colour?: unknown, declares?: unknown }>>>} [poolMeta]
 */

/**
 * The per-pool counts over the leaves, keyed `<blockId>::<poolKey>`, in the leaves' order.
 * @param {ReadonlyArray<Readonly<Record<string, StatePoolBlock>>>} leaves the six `DOSSIER_STATE_PROSE_*` objects
 * @returns {Record<string, PoolCount>}
 */
export function statePoolCounts(leaves) {
  /** @type {Record<string, PoolCount>} */
  const out = {};
  for (const leaf of leaves) {
    for (const [blockId, block] of Object.entries(leaf || {})) {
      const pools = block && typeof block === 'object' ? block.pools || {} : {};
      for (const [poolKey, variants] of Object.entries(pools)) {
        const meta = (block.poolMeta || {})[poolKey] || {};
        const list = Array.isArray(variants) ? variants : [];
        const declaring = list.filter(variantDeclares).length;
        const colourLines = list.filter((v) => variantColour(v) && !variantDeclares(v)).length;
        const crisisScoped = meta.crisisScoped === true;
        const colour = meta.colour === true;
        const poolSpeaks = crisisScoped || (Array.isArray(meta.declares) && meta.declares.length > 0);
        out[`${blockId}::${poolKey}`] = {
          lines: list.length, declaring, colourLines,
          undeclared: colour || poolSpeaks ? 0 : list.length - declaring - colourLines, crisisScoped, colour,
        };
      }
    }
  }
  return out;
}

/**
 * The undeclared register's pinned shape: every pool with an undeclared line, its count.
 * @param {Record<string, PoolCount>} counts
 * @returns {Record<string, number>}
 */
export function undeclaredRows(counts) {
  /** @type {Record<string, number>} */
  const out = {};
  for (const [id, c] of Object.entries(counts)) if (c.undeclared > 0) out[id] = c.undeclared;
  return out;
}

/**
 * The crisis-scoped register's pinned shape: the opted pools, sorted.
 * @param {Record<string, PoolCount>} counts
 * @returns {string[]}
 */
export function crisisScopedRows(counts) {
  return Object.keys(counts).filter((id) => counts[id].crisisScoped).sort();
}

/**
 * Compare a reading with its pinned register. `rose` and `added` are the refusals (a count may
 * never rise; a new undeclared pool may not appear unpinned); `fell` and `gone` are the re-pins
 * the same commit owes (the register is re-taken, never left stale).
 * @param {Record<string, number>} now @param {Record<string, number>} pinned
 */
export function compareUndeclared(now, pinned) {
  /** @type {string[]} */ const rose = []; /** @type {string[]} */ const added = [];
  /** @type {string[]} */ const fell = []; /** @type {string[]} */ const gone = [];
  for (const [id, n] of Object.entries(now)) {
    if (!(id in pinned)) added.push(`${id}: ${n}`);
    else if (n > pinned[id]) rose.push(`${id}: ${pinned[id]} → ${n}`);
    else if (n < pinned[id]) fell.push(`${id}: ${pinned[id]} → ${n}`);
  }
  for (const id of Object.keys(pinned)) if (!(id in now)) gone.push(id);
  return { rose, added, fell, gone };
}
