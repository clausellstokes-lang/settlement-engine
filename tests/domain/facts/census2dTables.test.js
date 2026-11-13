/**
 * CENSUS-2d unit 3 — the off-census tables carry the ledger's declarations (Phase A's
 * `docs/census/declarations/<TABLE>.json`; `docs/DESIGN_POOL_CENSUS.md` §3.1, the sibling column;
 * the chair's R-C). Each declaring ledger line is found at its path in the LIVE table, its text is
 * the ledger's verbatim, and its row declares exactly what the ledger says under this lane's
 * reading of the rulings:
 *   - a pool keyed on a crisis does not re-declare its key (R-B1);
 *   - in a `{crisis-scoped}` pool `calm` is silence and `any` is written; outside one, `any` is
 *     noise and is not written;
 *   - Phase A's spellings map onto the vocabulary (`deficit` → `starving`, `>=` → `≥`).
 * Every atom written must be declarable (a home exists: R-E). An R/H/T consumer whose site is not
 * wired reads its row through `textOf` (R-C), so carrying a declaration moves no birth.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { declarationOf, assertDeclarable } from '../../../src/domain/facts/factVocabulary.js';
import { textOf } from '../../../src/domain/facts/textOf.js';
import { STRESS_DESCS } from '../../../src/data/narrativeData.js';
import { CULTURE_PROFILES } from '../../../src/data/cultureProfiles.js';
import * as espree from 'espree';

const ledger = (name) => JSON.parse(readFileSync(new URL(`../../../docs/census/declarations/${name}.json`, import.meta.url), 'utf8'));

/** @param {string} a */
const norm = (a) => a.replace(/^deficit$/, 'starving').replace(/^other-npc$/, 'other npc').replace(/>=/g, '≥').replace(/<=/g, '≤').trim();

/**
 * ORDER ITEM 3 (CENSUS-2d): the ledger's parked `stop` lines whose atom now has a home — "guards"
 * (watch | garrison | militia | a hired company) is `guardPresence`, the one composite (the
 * vocabulary rulings §3); "soldiers" (a garrison or a hired company) is `soldiers` (CENSUS-1c).
 * The occupied vignettes' soldiers are the occupier's (the key's), and the culture lines'
 * military households / warrior followings describe a tradition drawn before any roster exists:
 * neither is declared (open question in the lane doc).
 * @type {Readonly<Record<string, string>>}
 */
const PARKED = Object.freeze({
  'STRESS_DESCS.under_siege[1]': 'guardPresence',
  'STRESS_DESCS.under_siege[2]': 'guardPresence',
  'STRESS_DESCS.famine[1]': 'guardPresence',
  'STRESS_DESCS.famine[3]': 'guardPresence',
  'STRESS_DESCS.occupied[1]': 'guardPresence',
  'STRESS_DESCS.politically_fractured[1]': 'guardPresence',
  'STRESS_DESCS.recently_betrayed[0]': 'guardPresence',
  'STRESS_DESCS.infiltrated[1]': 'guardPresence',
  'STRESS_DESCS.infiltrated[2]': 'guardPresence',
  'STRESS_DESCS.infiltrated[5]': 'guardPresence',
  'STRESS_DESCS.monster_pressure[2]': 'guardPresence',
  'STRESS_DESCS.insurgency[0]': 'guardPresence',
  'STRESS_DESCS.mass_migration[0]': 'guardPresence',
  'STRESS_DESCS.slave_revolt[0]': 'guardPresence',
  'STRESS_DESCS.slave_revolt[2]': 'guardPresence',
  'STRESS_DESCS.insurgency[2]': 'soldiers',
  'STRESS_DESCS.wartime[2]': 'soldiers',
  'CULTURE_PROFILES.latin.defensePattern[1]': 'guardPresence',
  'CULTURE_PROFILES.mesoamerican.defensePattern[1]': 'guardPresence',
  'CULTURE_PROFILES.steppe.defensePattern[1]': 'guardPresence'
});

/** the declaration a ledger line carries under this lane's reading (see the header) */
export function expectedDeclaration(pool, line) {
  const key = new Set(pool.poolCrisis || []);
  const keyed = key.size > 0;
  const c = line.crisis;
  let crisis = [];
  if (Array.isArray(c)) crisis = keyed && c.some((v) => key.has(v)) ? [] : c.filter((v) => v !== 'calm');
  else if (c === 'any' && pool.crisisScoped && !keyed) crisis = ['any'];
  if (Array.isArray(c) && c.includes('calm') && crisis.length) crisis.push('calm');
  const needs = (line.needs || []).map(norm);
  if (PARKED[line.lineId]) needs.push(PARKED[line.lineId]);
  return { needs, excludes: (line.excludes || []).map(norm), crisis };
}

/** @param {string} id */
const parseLineId = (id) => {
  const out = []; const re = /([^.[\]]+)|\[(\d+)\]|\[['"]([^'"]+)['"]\]/g; let m;
  while ((m = re.exec(id))) out.push(m[2] !== undefined ? Number(m[2]) : (m[3] ?? m[1]));
  return out;
};

/**
 * @param {string} name the ledger file
 * @param {object} root the live table
 * @param {{ drop?: number, render?: (row: any) => string }} [opts]
 */
function holdsLedger(name, root, opts = {}) {
  const d = ledger(name);
  const render = opts.render || ((row) => { const t = textOf(row); return typeof t === 'function' ? t('{name}') : t; });
  const rows = [];
  for (const pool of d.pools) for (const line of pool.lines) {
    const path = parseLineId(line.lineId).slice(opts.drop ?? 1);
    let node = root;
    for (const step of path) node = node?.[step];
    rows.push({ pool, line, node, path });
  }
  return rows;
}

const TABLES = [
  ['STRESS_DESCS', STRESS_DESCS],
  ['CULTURE_PROFILES_DAILY', CULTURE_PROFILES],
  ['CULTURE_ARCHITECTURAL_DETAILS', CULTURE_PROFILES],
];

// LANDING-R2 seat E: the three tables run as ONE plain suite whose tests read the table list in their
// bodies (a `describe.each` hands its callback a parameter, which the lighting census measured as a
// latent closure costing zero estate files: SUITE_CONTEXT_PARAM). Every finding is prefixed by its table.
describe('STRESS_DESCS, CULTURE_PROFILES_DAILY and CULTURE_ARCHITECTURAL_DETAILS carry the ledger\'s declarations', () => {
  const ROWS = TABLES.map(([name, root]) => [name, holdsLedger(name, root)]);
  it('every ledger line is at its path, verbatim', () => {
    for (const [name, rows] of ROWS) {
      const missing = rows.filter((r) => r.node == null).map((r) => r.line.lineId);
      expect(missing, name).toEqual([]);
      const drift = rows.filter((r) => { const t = textOf(r.node); return (typeof t === 'function' ? t('{name}') : t) !== r.line.text; }).map((r) => r.line.lineId);
      expect(drift, name).toEqual([]);
    }
  });
  it('every row declares what the ledger says (R-B1; scoped calm is silence)', () => {
    for (const [name, rows] of ROWS) {
      const wrong = rows.filter((r) => {
        const want = expectedDeclaration(r.pool, r.line);
        const have = declarationOf(r.node);
        return JSON.stringify([have.needs, have.excludes, have.crisis]) !== JSON.stringify([want.needs, want.excludes, want.crisis]);
      }).map((r) => `${r.line.lineId}: ${JSON.stringify(declarationOf(r.node))} ≠ ${JSON.stringify(expectedDeclaration(r.pool, r.line))}`);
      expect(wrong, name).toEqual([]);
    }
  });
  it('every atom written has a home (R-E)', () => {
    for (const [name, rows] of ROWS) {
      for (const r of rows) {
        const d = declarationOf(r.node);
        for (const a of [...d.needs, ...d.excludes]) expect(() => assertDeclarable(a), `${name} ${r.line.lineId}: ${a}`).not.toThrow();
      }
    }
  });
});

// ── INLINE TABLES (T branches inside a generator function: no live table to walk) ────────────

/**
 * Every object literal `{ text: <literal>, needs?, excludes?, crisis? }` in a source file, keyed by
 * its text (a template literal's text is its quasis joined with `${…}` source).
 * @param {string} rel the file, repo-relative
 * @returns {Map<string, { needs: string[], excludes: string[], crisis: string[] }[]>}
 */
export function declaredLiteralsOf(rel) {
  const src = readFileSync(new URL(`../../../${rel}`, import.meta.url), 'utf8');
  const ast = espree.parse(src, { ecmaVersion: 'latest', sourceType: 'module', range: true, ecmaFeatures: { jsx: true } });
  /** @type {Map<string, any[]>} */ const out = new Map();
  const str = (n) => n.type === 'Literal' ? n.value : n.type === 'TemplateLiteral'
    ? n.quasis.map((q, i) => q.value.cooked + (i < n.expressions.length ? '${' + src.slice(...n.expressions[i].range) + '}' : '')).join('') : undefined;
  const walk = (n) => {
    if (!n || typeof n !== 'object') return;
    if (n.type === 'ObjectExpression') {
      const prop = (k) => n.properties.find((p) => p.type === 'Property' && (p.key.name === k || p.key.value === k));
      const t = prop('text');
      if (t && typeof str(t.value) === 'string') {
        const arr = (k) => { const p = prop(k); return p && p.value.type === 'ArrayExpression' ? p.value.elements.map((e) => e.value) : []; };
        const key = str(t.value);
        out.set(key, [...(out.get(key) || []), { needs: arr('needs'), excludes: arr('excludes'), crisis: arr('crisis') }]);
      }
    }
    for (const k of Object.keys(n)) { const v = n[k]; if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v.type === 'string') walk(v); }
  };
  walk(ast);
  return out;
}

/**
 * @param {string} name the ledger
 * @param {string} rel the source file
 * @param {(lineId: string, atom: string) => boolean} guaranteed atoms the cell's key or branch already guarantees (not written)
 */
function inlineArm(name, rel, guaranteed) {
  const d = ledger(name);
  const found = declaredLiteralsOf(rel);
  const wrong = [];
  for (const pool of d.pools) for (const line of pool.lines) {
    if (line.text.includes('${')) continue; // a template row: held by its own arm
    const want = expectedDeclaration(pool, line);
    want.needs = want.needs.filter((a) => !guaranteed(line.lineId, a));
    want.excludes = want.excludes.filter((a) => !guaranteed(line.lineId, a));
    const declaring = want.needs.length || want.excludes.length || want.crisis.length;
    const have = found.get(line.text);
    if (!declaring) { if (have) wrong.push(`${line.lineId}: declares, the ledger does not`); continue; }
    if (!have || have.length !== 1) { wrong.push(`${line.lineId}: ${have ? have.length : 0} declared rows`); continue; }
    if (JSON.stringify(have[0]) !== JSON.stringify(want)) wrong.push(`${line.lineId}: ${JSON.stringify(have[0])} ≠ ${JSON.stringify(want)}`);
  }
  return wrong;
}

describe('SPATIAL_TEXT (spatialGenerator.js, inline T cells; carried through textOf)', () => {
  // The cells are keyed by terrain, and some by a branch on the roster: those atoms are the key's
  // (R-B1 widened to a cell key — the chair's ruling this lane makes, recorded in the lane doc).
  const guaranteed = (lineId, a) => a.startsWith('terrain:')
    || (a === 'institution: temple' && /\.(sacred|shrine)$/.test(lineId))
    || (a === 'walls' && /^villageLayouts\.(hills|desert)(\.walled)?$/.test(lineId))
    || (a === 'garrison' && lineId === 'townLayouts.mountain.garrison');
  it('every declaring ledger line is declared in place, exactly', () => {
    expect(inlineArm('SPATIAL_TEXT', 'src/generators/spatialGenerator.js', guaranteed)).toEqual([]);
  });
  it('the three template rows carry their atoms', () => {
    const found = declaredLiteralsOf('src/generators/spatialGenerator.js');
    const by = (head) => [...found.entries()].filter(([k]) => k.startsWith(head)).map(([, v]) => v[0]);
    expect(by('Great river city: bridge quarter')).toEqual([{ needs: ['river', 'market'], excludes: [], crisis: [] }]);
    expect(by('${sacredSubject} and green above the tideline')).toEqual([{ needs: ['coast'], excludes: [], crisis: [] }]);
    expect(by('Close-built stone houses below the ${sacredHouse}')).toEqual([{ needs: ['gate'], excludes: [], crisis: [] }]);
  });
});

describe('PRESSURE_SENTENCES (narrativeText.js, R: the rows inside each stressor\'s closure; carried through textOf)', () => {
  it('every declaring ledger line is declared in place, exactly (a crisis-keyed pool does not re-declare its key, R-B1)', () => {
    // the ledger writes `${name}`; the closure writes `${r.name}`: compared with each `${…}` folded
    const fold = (t) => t.replace(/\$\{(?:[^{}]|\{[^{}]*\})*\}/g, '${}');
    const found = new Map([...declaredLiteralsOf('src/generators/narrativeText.js')].map(([k, v]) => [fold(k), v]));
    const d = ledger('PRESSURE_SENTENCES');
    const wrong = [];
    let declaring = 0;
    for (const pool of d.pools) for (const line of pool.lines) {
      const want = expectedDeclaration(pool, line);
      const have = found.get(fold(line.text));
      if (!(want.needs.length || want.excludes.length || want.crisis.length)) { if (have) wrong.push(`${line.lineId}: declares, the ledger does not`); continue; }
      declaring++;
      if (!have || JSON.stringify(have[0]) !== JSON.stringify(want)) wrong.push(`${line.lineId}: ${JSON.stringify(have)} ≠ ${JSON.stringify(want)}`);
    }
    expect(wrong).toEqual([]);
    // 17 -> 16 (COHERENCE-PRESUME): the mass-migration line no longer names a market, so it declares nothing
    // 16 -> 18 (R2-CODE-A-3, round three #40 / #4): famine[0] and famine[4] presume a common store and need a granary
    expect(declaring).toBe(18);
  });
});

// ── SIBLING SETS (a multi-reader T table keeps its cells as strings; its declarations stand beside
//    it keyed by the original's text — CENSUS-1c's dissolved-twin shape, accepted by R-P 3) ─────
import { STRESS_TYPE_MAP, STRESS_TYPE_SIBLINGS } from '../../../src/data/stressTypes.js';
import { STRESSOR_SPINE_PHRASES, STRESSOR_SPINE_SIBLINGS } from '../../../src/data/stressorSpinePhrases.js';
import { CONDITION_ARCHETYPE_TEMPLATES, CONDITION_ARCHETYPE_SIBLINGS } from '../../../src/domain/activeConditions.js';
import { QUICK_GUIDE_SIBLINGS } from '../../../src/domain/summary/settlementQuickGuide.js';

/** cells reworded under R-U since Phase A read them (counted by cause in their commit) */
const REWORDED = new Set(['STRESS_TYPE_MAP.slave_revolt.viabilityNote']);

/** @param {string} name @param {Record<string, any[]>} siblings @param {object|null} root the live table (null: by text alone) */
function siblingArm(name, siblings, root) {
  const d = ledger(name);
  const wrong = [];
  let declaring = 0;
  for (const pool of d.pools) for (const line of pool.lines) {
    const want = expectedDeclaration(pool, line);
    if (root) {
      let node = root; for (const step of parseLineId(line.lineId).slice(1)) node = node?.[step];
      if (node !== line.text && !REWORDED.has(line.lineId)) wrong.push(`${line.lineId}: the live cell is not the ledger's text`);
    }
    const set = Object.prototype.hasOwnProperty.call(siblings, line.text) ? siblings[line.text] : null;
    if (!(want.needs.length || want.excludes.length || want.crisis.length)) { if (set) wrong.push(`${line.lineId}: declared, the ledger does not`); continue; }
    declaring++;
    const have = set ? declarationOf(set[0]) : null;
    if (!have || JSON.stringify([have.needs, have.excludes, have.crisis]) !== JSON.stringify([want.needs, want.excludes, want.crisis])) wrong.push(`${line.lineId}: ${JSON.stringify(have)} ≠ ${JSON.stringify(want)}`);
    for (const twin of (set || []).slice(1)) if (twin.twinOf !== line.text) wrong.push(`${line.lineId}: a twin keyed elsewhere`);
  }
  return { wrong, declaring, sets: Object.keys(siblings).length };
}

// LANDING-R2 seat E: the four sibling tables read inside one plain test (no `describe.each` parameter).
describe('the declared sibling sets stand beside their tables', () => {
  it('every declaring ledger line has its set, exactly; nothing else is declared', () => {
    for (const [name, siblings, root, n] of [
      ['STRESS_TYPE_MAP', STRESS_TYPE_SIBLINGS, STRESS_TYPE_MAP, 4],
      ['STRESSOR_SPINE_PHRASES', STRESSOR_SPINE_SIBLINGS, STRESSOR_SPINE_PHRASES, 2],
      ['CONDITION_ARCHETYPE_TEMPLATES', CONDITION_ARCHETYPE_SIBLINGS, CONDITION_ARCHETYPE_TEMPLATES, 6],
      ['QUICK_GUIDE_CLAUSES', QUICK_GUIDE_SIBLINGS, null, 9], // CENSUS-2g unit 7 (R-AY): the Slavic scope's `river` dropped, 7 → 6; RUNG-2 LANDING phase B: the inland Norse and Slavic forms declare `excludes: navigable`, 6 → 8; phase C unit 4: the Greek inland form aligned, 8 → 9
    ]) {
      const r = siblingArm(name, siblings, root);
      expect(r.wrong, name).toEqual([]);
      expect([r.declaring, r.sets], name).toEqual([n, n]);
    }
  });
});

describe('THORP_PRESSURES and the slave-revolt cells (CENSUS-2d)', () => {
  it('the thorp fallback\'s miller line needs a mill (inline, through textOf)', () => {
    const found = declaredLiteralsOf('src/generators/narrativeGenerator.js');
    expect(found.get("The question of who tends the shared fields when the miller's household falls ill has never been properly settled.")).toEqual([{ needs: ['institution: mill'], excludes: [], crisis: [] }]);
  });
  it('no slave-revolt cell names a slave market (R-U; "needs a home")', () => {
    expect(Object.values(STRESS_TYPE_MAP.slave_revolt).filter((v) => typeof v === 'string' && /slave market/i.test(v))).toEqual([]);
  });
});

import { CAST_CRISIS_SIBLINGS as CAST_REASON_SIBLINGS } from '../../../src/domain/crisis/crisisCast.js';
import { resolveSibling } from '../../../src/domain/facts/drawDeclared.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';

describe('CRISIS_CAST_REASONS: the brunt reasons a crisis reaches by more than one kind (enforced at the wired site)', () => {
  const opts = (record) => ({ facts: factsOf(record), drawKind: /** @type {'T'} */ ('T') });
  const rec = (types, band, extra = {}) => ({ stress: types.map((type) => ({ type, ...extra })), economicState: { foodSecurity: { foodRecord: { band } } } });
  it('food_security under a famine keeps the hunger; under a fed influx it is the strain', () => {
    expect(resolveSibling('the hunger falls first on its people', CAST_REASON_SIBLINGS, opts(rec(['famine'], 'famine')))).toBe('the hunger falls first on its people');
    expect(resolveSibling('the hunger falls first on its people', CAST_REASON_SIBLINGS, opts(rec(['mass_migration'], 'secure', { direction: 'influx' })))).toBe('the strain falls first on its people');
  });
  it('housing_pressure under monster pressure names no newcomers', () => {
    expect(resolveSibling('its people take in the newcomers', CAST_REASON_SIBLINGS, opts(rec(['monster_pressure'], 'secure')))).toBe('its houses are where the crisis is felt first');
  });
});
