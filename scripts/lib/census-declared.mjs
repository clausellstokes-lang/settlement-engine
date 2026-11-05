/**
 * scripts/lib/census-declared.mjs — THE WIRING CENSUS'S DECLARED COLUMNS (CENSUS-1g unit 5;
 * `docs/DESIGN_POOL_CENSUS.md` §3.5 "The wiring census, extended").
 *
 * Every state row gains `declares` (the pool's own atoms, its brace group), `lineDeclares` (an
 * atom histogram over its variants: each atom in its tag spelling, the kernel's fact mark words
 * — `walls`, F12's families — and `colour` for a line marked read-and-presumes-nothing, R-AO),
 * `undeclared` (the undeclared register's count, by the registers' ONE reading,
 * `declarationRegisters.js :: statePoolCounts`) and `crisisScoped`. They are read from the ANNEX
 * through the projector's own parse (`dossier-annex-parse.mjs`), never the generated leaves:
 * the leaves are projected FROM this census, so columns read off them are born one projection
 * stale.
 *
 * `tablePools` is the second table: one row per off-census pool (`table-pools.mjs`), the same
 * four columns plus `drawKind` and `drawSite`, its lines walked from the live export.
 *
 * Pure apart from the module imports the table walk needs; no clock, no RNG.
 */
import { CONNECTIVES_HEADING_RE } from './dossier-annex-grammar.mjs';
import { parseAnnex, STATE_HEADER } from './dossier-annex-parse.mjs';
import { COLOUR_MARK, atomsOf, declarationOf, declarationOfTags, declares, isColourLine } from '../../src/domain/facts/factVocabulary.js';
import { FACT_MARK_DIMENSIONS, statePoolCounts, variantColour } from '../../src/domain/facts/declarationRegisters.js';
import { STATE_MARK_DIMENSIONS } from '../../src/domain/facts/factVocabulary.js';

const FACT_MARK_WORDS = new Set(FACT_MARK_DIMENSIONS.flatMap((d) => STATE_MARK_DIMENSIONS[d]));
const KERNEL_MARK_WORDS = new Set(Object.values(STATE_MARK_DIMENSIONS).flat());

/** @param {Record<string, number>} h @param {string} k */
const bump = (h, k) => { h[k] = (h[k] || 0) + 1; };
/** @param {Record<string, number>} h */
const sorted = (h) => Object.fromEntries(Object.entries(h).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));

/**
 * The annex's declared columns, keyed `${block} :: ${pool}` (the census row key).
 * @param {string} stateSrc the state annex
 * @returns {Map<string, { declares: string[], lineDeclares: Record<string, number>, undeclared: number, crisisScoped: boolean }>}
 */
export function annexDeclaredColumns(stateSrc) {
  const blocks = parseAnnex(stateSrc, STATE_HEADER, 'DOSSIER_STATE', { regionEnd: CONNECTIVES_HEADING_RE, closedMarks: true });
  /** @type {Record<string, any>} */ const leaf = {};
  for (const b of blocks) {
    leaf[b.id] = { pools: {}, poolMeta: {} };
    for (const p of b.pools) {
      leaf[b.id].pools[p.key] = p.variants;
      leaf[b.id].poolMeta[p.key] = {
        ...(p.braces?.colour ? { colour: true } : {}),
        ...(p.braces?.crisisScoped ? { crisisScoped: true } : {}),
        ...(p.braces?.declares?.length ? { declares: p.braces.declares } : {}),
      };
    }
  }
  const counts = statePoolCounts([leaf]);
  const out = new Map();
  for (const b of blocks) {
    for (const p of b.pools) {
      /** @type {Record<string, number>} */ const hist = {};
      for (const v of p.variants) {
        const marks = Array.isArray(v.marks) ? v.marks : [];
        for (const m of marks) if (FACT_MARK_WORDS.has(m)) bump(hist, m);
        const atoms = marks.filter((m) => m !== 'dm-only' && m !== COLOUR_MARK && !KERNEL_MARK_WORDS.has(m));
        for (const a of atomsOf(declarationOfTags(atoms))) bump(hist, a);
        if (variantColour(v)) bump(hist, COLOUR_MARK);
      }
      const c = counts[`${b.id}::${p.key}`];
      out.set(`${b.id} :: ${p.key}`, {
        declares: [...(p.braces?.declares || [])],
        lineDeclares: sorted(hist),
        undeclared: c.undeclared,
        crisisScoped: c.crisisScoped,
      });
    }
  }
  return out;
}

/** The fields a table ROW prints from, in order (CENSUS-1i unit 2): the first that holds a string — or a closure — is the row's line. */
const ROW_TEXT_KEYS = Object.freeze(['text', 'short', 'secret', 'line', 'desc']);

/**
 * A row object's printed text (a string or a closure), or null when the object is no row.
 * @param {unknown} node @returns {string|Function|null}
 */
export function rowTextOf(node) {
  if (!node || typeof node !== 'object' || Array.isArray(node)) return null;
  for (const k of ROW_TEXT_KEYS) {
    const v = /** @type {Record<string, unknown>} */ (node)[k];
    if (typeof v === 'string' || typeof v === 'function') return /** @type {string|Function} */ (v);
  }
  return null;
}

/**
 * Every printed line of a table: a string, a closure, or a ROW — `{ text }`, a goal's `{ short, long }`,
 * a secret's `{ secret, stakes }`, a service's `{ desc }`, a closure row `{ line }` (CENSUS-1i unit 2:
 * one line each, declaring by its own fields; before, a row with no `text` was walked into its
 * strings and its declaration fields were lost). Arrays and other plain objects are walked.
 * @param {unknown} node @param {unknown[]} [acc]
 * @returns {unknown[]}
 */
export function tableLines(node, acc = []) {
  if (typeof node === 'string' || typeof node === 'function') acc.push(node);
  else if (Array.isArray(node)) for (const x of node) tableLines(x, acc);
  else if (node && typeof node === 'object') {
    if (rowTextOf(node) !== null) acc.push(node);
    else for (const x of Object.values(node)) tableLines(x, acc);
  }
  return acc;
}

/**
 * The declaration channels held BESIDE a table (CENSUS-1i unit 2): sibling sets keyed by the
 * original's text (`[{ text, needs }, { text, twinOf, excludes }]`) and declaration columns keyed by
 * the line's text (`{ needs?, excludes?, crisis? }` or `{ colour: true }`).
 * @typedef {{ siblings?: Readonly<Record<string, ReadonlyArray<any>>>, column?: Readonly<Record<string, any>> }} BesideChannel
 */

/**
 * One `tablePools` row.
 * @param {{ id: string, module: string, name: string, drawKind: string, drawSite: string, rulings?: string[], lines?: (t: any) => unknown }} entry
 * @param {unknown} table the live export
 * @param {ReadonlyArray<BesideChannel>} [channels] every declaration channel held beside a table
 */
export function tablePoolRow(entry, table, channels = []) {
  const own = tableLines(entry.lines ? entry.lines(table) : table);
  /** @type {unknown[]} */ const lines = [];
  for (const l of own) {
    const text = typeof l === 'string' ? l : rowTextOf(l);
    let read = l;
    if (typeof text === 'string') {
      for (const c of channels) {
        const set = c.siblings && Object.prototype.hasOwnProperty.call(c.siblings, text) ? c.siblings[text] : null;
        if (set) {
          read = set.find((x) => typeof x?.twinOf !== 'string' && x?.text === text) ?? set[0];
          for (const twin of set) if (typeof twin?.twinOf === 'string') lines.push(twin);
          break;
        }
        const col = c.column && Object.prototype.hasOwnProperty.call(c.column, text) ? c.column[text] : null;
        if (col) { read = { text, ...col }; break; }
      }
    }
    lines.push(read);
  }
  /** @type {Record<string, number>} */ const hist = {};
  let declaring = 0; let colourLines = 0;
  for (const l of lines) {
    const d = declarationOf(l);
    const twin = !!l && typeof l === 'object' && typeof (/** @type {{twinOf?: unknown}} */ (l)).twinOf === 'string';
    if (declares(d) || twin) { declaring += 1; for (const a of atomsOf(d)) bump(hist, a); }
    else if (isColourLine(l)) { colourLines += 1; bump(hist, COLOUR_MARK); }
  }
  const rulings = entry.rulings || [];
  return {
    id: entry.id, module: entry.module, name: entry.name, drawKind: entry.drawKind, drawSite: entry.drawSite,
    lines: lines.length,
    declares: [],
    lineDeclares: sorted(hist),
    undeclared: rulings.includes('colour') ? 0 : lines.length - declaring - colourLines,
    crisisScoped: rulings.includes('crisis-scoped'),
    ...(rulings.includes('colour') ? { colour: true } : {}),
  };
}
