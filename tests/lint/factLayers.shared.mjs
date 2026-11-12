/**
 * factLayers.shared.mjs — the layer walker's instruments, written once (W2-A-LEAVES, 2026-11-12). Read by
 * tests/lint/factLayers.walker.test.js and by its door, scripts/fact-layers-door.mjs; a helper, never a suite.
 *
 * Three arms, each a pure reading of the tree (nothing written):
 *   LEAVES   each leaf of `src/domain/facts/factLayers.js :: LEAVES` is called on a proxied record of the grid,
 *            and the strata it TOUCHES are read off the proxy (the layer map's read-tracer, `facts.mjs`).
 *   POOLS    each pool of the state-prose corpus: what its lines declare (marks, brace groups, the pool's own
 *            `declares`) and what they name (the presumed-things walker's own `thingsNamedIn`), each at its
 *            fact's layer, against the pool's layer in `factLayers.poolTable.json`.
 *   READERS  the defence-reader walker generalised to every homed fact: a line outside a fact's home that
 *            answers the fact again by a name test (`includes`, `test`, `some`, … with a literal holding one of
 *            the fact's house words), or by a roster helper called with a house word (`hasInst…('…')`).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { codeOf, resolveNameConstants } from './defenceFactReaders.shared.mjs';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(ROOT, 'src');
export const REGISTER_REL = 'tests/lint/factLayers.register.json';
export const POOL_TABLE_REL = 'tests/lint/factLayers.poolTable.json';

// ── THE GRID ─────────────────────────────────────────────────────────────────────────────────────
/** Six sizes, calm and each under one crisis; fixed, so the trace is the same on every run. */
export const GRID = Object.freeze([
  ['thorp', null], ['hamlet', null], ['village', null], ['town', null], ['city', null], ['metropolis', null],
  ['thorp', 'famine'], ['hamlet', 'under_siege'], ['village', 'wartime'], ['town', 'occupied'], ['city', 'plague_onset'], ['metropolis', 'insurgency'],
  ['village', 'monster_pressure'], ['town', 'succession_void'], ['city', 'mass_migration'], ['town', 'infiltrated'],
]);

/** The grid's births: `[seed, record]`, born as the census births them. */
export async function gridBirths() {
  const { generateSettlementPipeline } = await import(join(SRC, 'generators/generateSettlementPipeline.js'));
  const { birthConfig, loadGenerationLawPayloads } = await import(join(SRC, 'domain/density/densityCreateBoundary.js'));
  const { DEFAULT_CONFIG } = await import(join(SRC, 'store/configSlice.js'));
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  return GRID.map(([size, crisis], i) => {
    const seed = `layer-grid-${size}-${crisis || 'calm'}-${i}`;
    const cfg = birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
    return /** @type {[string, Record<string, unknown>]} */ ([seed, generateSettlementPipeline(cfg, null, { seed, customContent: {} })]);
  });
}

// ── THE LEAF ARM ─────────────────────────────────────────────────────────────────────────────────
const ARRAY_OWN = new Set(['length']);
/**
 * A deep read-tracing view of a record: every own data property read is recorded as a dotted path (array
 * indices dropped). The record is cloned first, so no frozen part trips a proxy invariant.
 * @param {object} record @param {Set<string>} paths
 */
export function traced(record, paths) {
  const clone = structuredClone(record);
  /** @param {any} target @param {string} at */
  const wrap = (target, at) => new Proxy(target, {
    get(t, prop, receiver) {
      const value = Reflect.get(t, prop, receiver);
      if (typeof prop !== 'string' || !Object.prototype.hasOwnProperty.call(t, prop)) return value;
      if (Array.isArray(t) && (ARRAY_OWN.has(prop) || /^\d+$/.test(prop))) {
        if (at) paths.add(at);
        return value && typeof value === 'object' ? wrap(value, at) : value;
      }
      const path = at ? `${at}.${prop}` : prop;
      paths.add(path);
      return value && typeof value === 'object' ? wrap(value, path) : value;
    },
  });
  return wrap(clone, '');
}

/** Force a lazy answer: call `has` for every crisis word, read every key, stringify. @param {unknown} v */
function exhaust(v) {
  if (v && typeof v === 'object' && typeof (/** @type {any} */ (v)).has === 'function') {
    for (const w of ['famine', 'under_siege', 'occupied', 'wartime', 'threat', 'hunger', 'succession', 'unrest', 'plague_onset', 'mass_migration']) /** @type {any} */ (v).has(w);
  }
  try { JSON.stringify(v); } catch { /* a cycle: the reads are already made */ }
}

const INSTITUTION_PROBES = ['temple', 'docks', 'mill', 'granary', 'smith', 'tavern', 'monastery', 'bank', 'healer', 'hospital'];

/**
 * The strata one leaf touches on one record.
 * @param {Readonly<import('../../src/domain/facts/factLayers.js').LeafRow>} row
 * @param {Record<string, any>} record
 * @param {Record<string, any>} modules module path → its namespace (loaded by the caller)
 * @param {(path: string) => string|undefined} stratumOf
 * @returns {Set<string>} stratum keys, and `UNPLACED:<path>` for a path no stratum places
 */
export function leafTouches(row, record, modules, stratumOf) {
  /** @type {Set<string>} */ const paths = new Set();
  const view = traced(record, paths);
  if (row.stored) {
    let v = /** @type {any} */ (view);
    for (const part of row.exported.split('.')) v = v?.[part];
    exhaust(v);
  } else if (row.call === 'factsGetter' || row.call === 'factsCall') {
    const facts = modules['domain/facts/factsOf.js'].factsOf(view);
    const getter = row.exported.replace(/^factsOf\./, '');
    if (row.call === 'factsGetter') exhaust(facts[getter]);
    else if (getter === 'hasInstitution') for (const kind of INSTITUTION_PROBES) facts.hasInstitution(kind);
    else if (getter === 'hasOtherNpc') facts.hasOtherNpc(Array.isArray(record.npcs) ? record.npcs[0] : 0);
  } else if (row.call === 'crimeLists') {
    exhaust(modules[row.module][row.exported]({ seats: /** @type {any} */ (view).powerStructure?.factions, estate: /** @type {any} */ (view).institutions }));
  } else {
    exhaust(modules[row.module][row.exported](view));
  }
  // a parent read on the way to a child is not a read of the parent: keep the deepest paths only
  const deepest = [...paths].filter((p) => ![...paths].some((q) => q.startsWith(`${p}.`)));
  /** @type {Set<string>} */ const out = new Set();
  for (const p of deepest) out.add(stratumOf(p) ?? `UNPLACED:${p.split('.')[0]}`);
  return out;
}

/**
 * The verdicts on one leaf's touches: an UNDECLARED touch (the table is wrong), an UNREAD declaration (the
 * table claims a read the trace never sees), an UNPLACED path, and a VIOLATION (a touched stratum at or
 * above the leaf's layer; a stored leaf may read its own stratum).
 * @param {{ layer: number, reads: ReadonlyArray<string>, stored?: boolean }} row
 * @param {Iterable<string>} touches
 * @param {Readonly<Record<string, number>>} strata
 */
export function verdictOf(row, touches, strata) {
  const list = [...new Set(touches)].sort();
  const declared = new Set(row.reads);
  const placed = list.filter((t) => !t.startsWith('UNPLACED:'));
  return {
    touches: placed,
    undeclared: placed.filter((t) => !declared.has(t)),
    unread: [...declared].filter((t) => !placed.includes(t)).sort(),
    unplaced: list.filter((t) => t.startsWith('UNPLACED:')),
    violations: placed.filter((t) => (row.stored ? strata[t] > row.layer : strata[t] >= row.layer)),
  };
}

/**
 * Every leaf's touches over the grid, and the verdicts: an UNDECLARED touch (the table is wrong), an
 * UNPLACED path (a stored field no stratum places), and a VIOLATION (a touched stratum at or above the
 * leaf's layer; a stored leaf may read its own stratum).
 * @param {Array<[string, Record<string, any>]>} births
 */
export async function leafArm(births) {
  const table = await import(join(SRC, 'domain/facts/factLayers.js'));
  /** @type {Record<string, any>} */ const modules = {};
  for (const row of Object.values(table.LEAVES)) {
    if (!row.stored && !modules[row.module]) modules[row.module] = await import(join(SRC, row.module));
  }
  if (!modules['domain/facts/factsOf.js']) modules['domain/facts/factsOf.js'] = await import(join(SRC, 'domain/facts/factsOf.js'));
  /** @type {Record<string, ReturnType<typeof verdictOf>>} */
  const out = {};
  for (const [id, row] of Object.entries(table.LEAVES)) {
    /** @type {Set<string>} */ const touches = new Set();
    for (const [, record] of births) for (const t of leafTouches(row, record, modules, table.stratumOf)) touches.add(t);
    out[id] = verdictOf(row, touches, table.STRATA);
  }
  return out;
}

// ── THE POOL ARM ─────────────────────────────────────────────────────────────────────────────────
export const CORPUS_LEAVES = Object.freeze(['economy', 'defense', 'general', 'power', 'stressors', 'warFaith']);

/** Every pool of the corpus: `{ id, variants, meta }`. */
export async function corpusPools() {
  /** @type {Array<{ id: string, variants: Array<Record<string, any>>, meta: Record<string, any> }>} */
  const out = [];
  for (const name of CORPUS_LEAVES) {
    const mod = await import(join(SRC, `data/dossierStateProse/${name}.generated.js`));
    const corpus = Object.values(mod).find((v) => v && typeof v === 'object' && !Array.isArray(v));
    for (const [blockId, block] of Object.entries(/** @type {Record<string, any>} */ (corpus))) {
      for (const [poolKey, variants] of Object.entries(block?.pools || {})) {
        if (Array.isArray(variants)) out.push({ id: `${blockId}::${poolKey}`, variants, meta: (block.poolMeta || {})[poolKey] || {} });
      }
    }
  }
  return out;
}

/**
 * Each pool's reads at a layer at or above its own: the declared atoms (a variant's marks and fact
 * declaration, the pool's `declares`) and the registered things its lines name, each at its fact's layer
 * (a thing at the lowest layer of its atoms, as the layer map's `guardCount.mjs` reads it).
 * @param {Array<{ id: string, variants: Array<Record<string, any>>, meta: Record<string, any> }>} pools
 * @param {Record<string, { layer: number|'W', src: string }>} poolTable
 */
export async function poolArm(pools, poolTable) {
  const { FACT_DIMENSIONS, atomsOf, declarationOfMarks, parseAtom } = await import(join(SRC, 'domain/facts/factVocabulary.js'));
  const { variantFactDeclaration } = await import(join(SRC, 'domain/display/stateProse/stateProseKernel.js'));
  const { LEAVES } = await import(join(SRC, 'domain/facts/factLayers.js'));
  const { THINGS, thingsNamedIn } = await import('./presumedThings.shared.mjs');
  /** @param {string} written */
  const atomLayer = (written) => {
    const a = parseAtom(written.replace(/^no\s+/, ''));
    if (!a) return undefined;
    const dimension = FACT_DIMENSIONS[a.dimension];
    return dimension ? LEAVES[dimension.home]?.layer : undefined;
  };
  /** @type {Record<string, number|undefined>} */
  const thingLayer = Object.fromEntries(Object.entries(THINGS).map(([k, v]) => {
    const ls = v.atoms.map(atomLayer).filter((/** @type {unknown} */ l) => typeof l === 'number');
    return [k, ls.length ? Math.min(...ls) : undefined];
  }));
  /** @type {Record<string, string[]>} */ const violations = {};
  /** @type {string[]} */ const unplaced = [];
  /** @type {string[]} */ const unlayered = [];
  for (const pool of pools) {
    const row = poolTable[pool.id];
    if (!row) { unplaced.push(pool.id); continue; }
    if (row.layer === 'W') continue;
    /** @type {Set<string>} */ const found = new Set();
    for (const v of pool.variants) {
      const atoms = [...atomsOf(variantFactDeclaration(v)), ...atomsOf(declarationOfMarks(v.marks || [])), ...(pool.meta.declares || [])];
      for (const a of atoms) {
        const l = atomLayer(a);
        if (l === undefined) { if (parseAtom(a.replace(/^no\s+/, ''))) unlayered.push(`${pool.id} :: ${a}`); continue; }
        if (l >= row.layer) found.add(`declares ${a.replace(/^no\s+/, '')} (layer ${l})`);
      }
      for (const thing of thingsNamedIn(String(v.text ?? ''))) {
        const l = thingLayer[thing];
        if (typeof l === 'number' && l >= row.layer) found.add(`names ${thing} (layer ${l})`);
      }
    }
    if (found.size) violations[pool.id] = [...found].sort();
  }
  return { violations, unplaced, unlayered: [...new Set(unlayered)] };
}

// ── THE READER ARM (the defence-reader walker, generalised) ──────────────────────────────────────
/**
 * Each homed fact's house words, and the home(s) where a name test of them is the fact's own reading.
 * The defence words (walls, garrison, militia, watch, mercenary, court, gate) are the defence-reader
 * walker's and are not counted twice here.
 */
export const FAMILIES = Object.freeze({
  market: { words: String.raw`\bmarket(?:place|s)?\b|\bbazaar|\bfair\b`, homes: ['src/domain/facts/market.js'] },
  faith: { words: String.raw`\bchurch|\btemple|\bshrine|\bchapel|\bcathedral|\babbey|\bmonaster|\bfriary|\bpriory`, homes: ['src/domain/facts/institutions.js', 'src/domain/dossier/faithReading.js'] },
  docks: { words: String.raw`\bdocks?\b|\bwharf|\bharbou?r|\bpier\b|\bquay|\bshipyard|\bport\b`, homes: ['src/domain/facts/institutions.js', 'src/domain/facts/water.js'] },
  mill: { words: String.raw`\bmill\b|\bmills\b|\bwatermill|\bwindmill`, homes: ['src/domain/facts/institutions.js'] },
  smith: { words: String.raw`\bsmith|\bforge|\bfoundr|\bsmelt`, homes: ['src/domain/facts/institutions.js'] },
  tavern: { words: String.raw`\btavern|\binn\b|\balehouse`, homes: ['src/domain/facts/institutions.js'] },
  granary: { words: String.raw`\bgranar`, homes: ['src/domain/facts/institutions.js', 'src/domain/facts/storesMonths.js'] },
  bank: { words: String.raw`\bbank\b|\bbanking|\bmoneylend|\bexchequer`, homes: ['src/domain/facts/institutions.js'] },
  healer: { words: String.raw`\bhealer|\bhospital|\binfirmar|\bphysician|\bapothecar`, homes: ['src/domain/facts/institutions.js', 'src/domain/defense/defenseFacts.js'] },
  guild: { words: String.raw`(?<!thieves['’]? )\bguild(?:hall|s)?\b`, homes: ['src/domain/facts/guild.js'] },
  crime: { words: String.raw`\bthie(?:f|ves)|\bgang|\bcriminal|\bsmuggl|\bsyndicate|\bracket|\bunderworld|\bfence\b`, homes: ['src/domain/crimeSignal.js', 'src/domain/corruption.js'] },
  magic: { words: String.raw`\bwizard|\bmage\b|\bmages\b|\bsorcer|\barcane|\balchemi|\bwitch|\bmagic`, homes: ['src/domain/magicReliance.js', 'src/domain/facts/magic.js'] },
  quarryMine: { words: String.raw`\bquarr|\bmine\b|\bmines\b|\bmining`, homes: ['src/domain/facts/institutions.js'] },
});

const CALL = /\b(?:includes|test|hasAny|hasInst\w*|some|match|find|filter|startsWith|indexOf|endsWith)\s*\(/;
/** @param {string} words */
const literalOf = (words) => new RegExp(String.raw`'[^'\n]*(?:${words})[^'\n]*'|"[^"\n]*(?:${words})[^"\n]*"|\x60[^\x60\n]*(?:${words})[^\x60\n]*\x60|/[^/\n]*(?:${words})[^/\n]*/[gimsuy]*`, 'i');
/** @type {Record<string, RegExp>} */
const LITERALS = Object.fromEntries(Object.entries(FAMILIES).map(([k, v]) => [k, literalOf(v.words)]));

/** Does this code line answer the family's fact by a name test? @param {string} family @param {string} line */
export const readsFamily = (family, line) => CALL.test(line) && LITERALS[family].test(line);

/**
 * The roots and exclusions: the fact homes' folder, the data tables, generated files and each family's own homes are
 * not counted; nor the page battery's instruments (`src/domain/coherence/`), which test the PRINTED page's words
 * against the record by design and derive no fact (W2-A-LEAVES's call, 2026-11-12: three banked lines fell).
 */
const EXCLUDED = /^src\/(?:domain\/facts|domain\/coherence|data)\//;

/** @param {string} dir @param {string[]} [out] @returns {string[]} */
const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out); else out.push(path);
  }
  return out;
};

/**
 * Per file, per family: the lines that answer a homed fact by a name test.
 * @param {(family: string, line: string) => boolean} [test]
 * @returns {Record<string, Record<string, number>>}
 */
export function readerArm(test = readsFamily) {
  /** @type {Record<string, Record<string, number>>} */ const out = {};
  for (const path of walk(SRC)) {
    const rel = relative(ROOT, path).replace(/\\/g, '/');
    if (!/\.(js|jsx)$/.test(rel) || /\.generated\.js$/.test(rel) || EXCLUDED.test(rel)) continue;
    const lines = resolveNameConstants(codeOf(readFileSync(path, 'utf8'))).split('\n');
    for (const [family, def] of Object.entries(FAMILIES)) {
      if (def.homes.includes(rel)) continue;
      const n = lines.filter((line) => test(family, line)).length;
      if (n) (out[rel] ||= {})[family] = n;
    }
  }
  return out;
}

/** Read a JSON file under the root. @param {string} rel */
export const readJson = (rel) => JSON.parse(readFileSync(join(ROOT, rel), 'utf8'));
