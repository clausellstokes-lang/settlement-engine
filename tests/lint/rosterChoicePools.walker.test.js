/**
 * rosterChoicePools.walker.test.js — R3-CURE unit 3 (VEIL-23's builder; R3-CURE-BRIEF; the chair's ruling of 07:39 UTC):
 * THE THREE CLOSED POOLS OF R3'S HOST AGAINST THE ENGINE THAT WRITES THEM, in 212 AND in the twin.
 *
 * R3's host (212 :: _gallery_veil_roster_choices, the twin galleryRosterChoices.js :: applyRosterChoices) keeps a served
 * entry of three lists only where its own closed pool holds it, and withholds it otherwise (fail closed):
 *   safety.crimeTypes   each type by the house flags that raise it (212 `raisers`, twin CRIME_TYPE_RAISERS);
 *   safety.plotHooks    each hook of the safety profile's pool by its raising flags (212 `hooks`, twin SAFETY_HOOK_RAISERS);
 *   institutions.desc   the descriptions the roster-moved fact 'rival power' chooses between (212 `rival`, twin RIVAL_POWER_DESCS).
 * A pool that drifts from the engine fails toward withholding, quietly: a new crime type, a new telling of a hook, would be
 * withheld on every shared page with a hidden house. This walker reads the ENGINE'S OWN SETS from its sources and holds the
 * two engines' pools EQUAL to them, key for key, both ways (a key the engine no longer writes is drift too).
 *   crime types: every `crimeTypes.push({ type: … })` and `addCrimeIfMissing('…')` of src/generators/safetyProfile.js (an
 *     identifier resolved from its export in src/domain/crimeSignal.js); settleCrimeLinesToSignal rewrites descriptions only.
 *   hooks: every `plotHooks.push(…)` of the safety profile (a template's `${crimeRef}` over its literal values; `said(x)` over
 *     SAFETY_LINE_SIBLINGS[x]'s tellings; the drawn SMUGGLING_HOOKS and their siege twins, smugglingHookUnderSiege).
 *   rival descriptions: every telling of a declared set of src/data/institutionDescVariants.js one of whose tellings
 *     excludes or needs 'rival power'.
 * TEETH: the last arm removes one key from each pool and holds that the walker names it.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '..', '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf-8');
const SQL = read('supabase/migrations/212_share_veil_later_cures.sql');
const SAFETY = read('src/generators/safetyProfile.js');
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const lit = (m) => m.replace(/\\(['"`\\])/g, '$1');

/** The engine's crime types, from its source. */
function engineCrimeTypes() {
  const consts = Object.fromEntries([...read('src/domain/crimeSignal.js').matchAll(/export const ([A-Z_][A-Z0-9_]*) = '([^']+)'/g)].map((m) => [m[1], m[2]]));
  const out = new Set();
  for (const m of SAFETY.matchAll(/crimeTypes\.push\(\{\s*type:\s*(?:'((?:[^'\\]|\\.)+)'|"((?:[^"\\]|\\.)+)"|([A-Z_][A-Z0-9_]*))/g)) {
    const v = m[1] ?? m[2] ?? consts[m[3]];
    if (!v) throw new Error(`a crime type the walker cannot read: ${m[0]}`);
    out.add(lit(v));
  }
  for (const m of SAFETY.matchAll(/addCrimeIfMissing\(\s*(?:'((?:[^'\\]|\\.)+)'|"((?:[^"\\]|\\.)+)")/g)) out.add(lit(m[1] ?? m[2]));
  return out;
}

/** The engine's safety hooks, from its source and its declared tellings. */
async function engineHooks() {
  const { SAFETY_LINE_SIBLINGS } = await import('../../src/generators/safetyProfile.js');
  const { smugglingHookUnderSiege } = await import('../../src/generators/safetyLineTruth.js');
  const start = SAFETY.indexOf('const plotHooks = [];');
  const end = SAFETY.indexOf('plotHooks,', start);
  if (start < 0 || end < 0) throw new Error('the safety profile\'s hook block is not where the walker reads it');
  const block = SAFETY.slice(start, end);
  const out = new Set();
  const STR = String.raw`(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|\x60((?:[^\x60\\]|\\.)*)\x60)`;
  const refs = [...block.matchAll(/const crime(?:Turf|Ref) = ([^;]+);/g)].flatMap((m) => [...m[1].replace(/\[[^\]]*\]/g, '').matchAll(/'([^']+)'/g)].map((x) => x[1]));
  for (const m of block.matchAll(new RegExp(String.raw`plotHooks\.push\((said\()?${STR}`, 'g'))) {
    const text = lit(m[2] ?? m[3] ?? m[4]);
    const texts = text.includes('${crimeRef}') ? refs.map((r) => text.replace('${crimeRef}', r)) : [text];
    if (texts.some((t) => t.includes('${'))) throw new Error(`a hook template the walker cannot expand: ${text}`);
    for (const t of texts) {
      out.add(t);
      if (m[1]) for (const s of SAFETY_LINE_SIBLINGS[t] || []) if (typeof s?.text === 'string') out.add(s.text);
    }
  }
  if (/drawDeclared\(SMUGGLING_HOOKS/.test(block)) {
    const decl = SAFETY.slice(SAFETY.indexOf('const SMUGGLING_HOOKS = Object.freeze(['));
    const arr = decl.slice(0, decl.indexOf('].map('));
    for (const m of arr.matchAll(/'((?:[^'\\]|\\.)+)'/g)) { const h = lit(m[1]); out.add(h); out.add(smugglingHookUnderSiege(h, true)); }
  }
  return out;
}

/** The descriptions 'rival power' chooses between, from the declared sets. */
async function engineRivalDescs() {
  const mod = await import('../../src/data/institutionDescVariants.js');
  const out = new Set();
  const walk = (v) => {
    if (Array.isArray(v)) {
      const recs = v.filter(isRec);
      if (recs.some((x) => [x.excludes, x.needs].some((l) => Array.isArray(l) && l.includes('rival power')))) for (const x of recs) if (typeof x.text === 'string') out.add(x.text);
      v.forEach(walk);
    } else if (isRec(v)) Object.values(v).forEach(walk);
  };
  for (const k of ['INSTITUTION_DESC_VARIANTS', 'DESC_VARIANT_SIBLINGS', 'DESC_VARIANT_DECLARATIONS', 'DESC_LATE_SIBLINGS']) walk(mod[k]);
  return out;
}

/** 212's three pools, read from R3's section. */
function sqlPools() {
  const sec = SQL.slice(SQL.indexOf('-- ── R3: the roster choices'));
  const fn = sec.slice(0, sec.indexOf('end $$;'));
  const rm = fn.match(/raisers jsonb := '(\{[\s\S]*?\})';/);
  const hm = fn.match(/hooks jsonb := jsonb_build_object\(([\s\S]*?)\);\n/);
  const vm = fn.match(/rival text\[\] := array\[([\s\S]*?)\];/);
  if (!rm || !hm || !vm) throw new Error('212\'s R3 pools are not where the walker reads them');
  const un = (x) => x.replace(/''/g, "'");
  const hooks = {};
  for (const m of hm[1].matchAll(/'((?:[^']|'')*)',\s*'(\[[^\]]*\])'::jsonb/g)) hooks[un(m[1])] = JSON.parse(m[2]);
  return { types: JSON.parse(rm[1]), hooks, rival: [...vm[1].matchAll(/'((?:[^']|'')*)'/g)].map((m) => un(m[1])) };
}

/** The drift between an engine set and a pool's keys: [missing from the pool, in the pool but not the engine's]. */
const drift = (engine, keys) => [[...engine].filter((k) => !keys.includes(k)).sort(), keys.filter((k) => !engine.has(k)).sort()];

describe('R3-CURE unit 3: the roster-choice pools of 212 and the twin against the engine', () => {
  it('the walker reads the engine (each set is the size its sources hold, with the known members)', async () => {
    const types = engineCrimeTypes();
    expect(types.size).toBeGreaterThanOrEqual(30);
    for (const t of ['Smuggling', 'Criminal governance', 'debt evasion', 'contested property', 'State predation']) expect(types.has(t), t).toBe(true);
    const hooks = await engineHooks();
    expect(hooks.size).toBeGreaterThanOrEqual(15);
    expect([...hooks].filter((h) => /smuggl/i.test(h)).length).toBe(6);
    expect((await engineRivalDescs()).size).toBe(6);
  });

  it('crime types: 212 `raisers` and the twin CRIME_TYPE_RAISERS hold every type the engine writes, and no other', async () => {
    const twin = await import('../../src/domain/display/galleryRosterChoices.js');
    const engine = engineCrimeTypes();
    expect({ sql: drift(engine, Object.keys(sqlPools().types)), twin: drift(engine, Object.keys(twin.CRIME_TYPE_RAISERS || {})) }).toEqual({ sql: [[], []], twin: [[], []] });
    expect(sqlPools().types).toEqual(twin.CRIME_TYPE_RAISERS);
  });

  it('plot hooks: 212 `hooks` and the twin SAFETY_HOOK_RAISERS hold every hook the safety profile writes, and no other', async () => {
    const twin = await import('../../src/domain/display/galleryRosterChoices.js');
    const engine = await engineHooks();
    expect({ sql: drift(engine, Object.keys(sqlPools().hooks)), twin: drift(engine, Object.keys(twin.SAFETY_HOOK_RAISERS || {})) }).toEqual({ sql: [[], []], twin: [[], []] });
    expect(sqlPools().hooks).toEqual(twin.SAFETY_HOOK_RAISERS);
  });

  it('rival descriptions: 212 `rival` and the twin RIVAL_POWER_DESCS hold every telling \'rival power\' chooses between, and no other', async () => {
    const twin = await import('../../src/domain/display/galleryRosterChoices.js');
    const engine = await engineRivalDescs();
    expect({ sql: drift(engine, sqlPools().rival), twin: drift(engine, [...(twin.RIVAL_POWER_DESCS || [])]) }).toEqual({ sql: [[], []], twin: [[], []] });
  });

  // R3-CURE-2 (VEIL-24's builder, unit 2 (a)): the operations list's label table, re-derived over the served houses
  it('operations labels: 212 `crimlabels` and the twin CRIMINAL_INST_LABELS are safetyProfile.js\'s CRIMINAL_INST_LABELS, entry for entry; with one entry removed, the walker names it', async () => {
    const twin = await import('../../src/domain/display/galleryRosterChoices.js');
    const block = SAFETY.match(/const CRIMINAL_INST_LABELS = \{([\s\S]*?)\};/);
    if (!block) throw new Error('the engine\'s label table is not where the walker reads it');
    const engine = Object.fromEntries([...block[1].matchAll(/(?:'((?:[^'\\]|\\.)+)'|"((?:[^"\\]|\\.)+)")\s*:\s*(?:'((?:[^'\\]|\\.)+)'|"((?:[^"\\]|\\.)+)")/g)].map((m) => [lit(m[1] ?? m[2]), lit(m[3] ?? m[4])]));
    expect(Object.keys(engine).length).toBe(15);
    expect(engine['multiple criminal factions']).toBe('Rival Gangs');
    const sec = SQL.slice(SQL.indexOf('-- ── R3: the roster choices'));
    const lm = sec.match(/crimlabels jsonb := '(\{[\s\S]*?\})';/);
    if (!lm) throw new Error('212\'s label table is not where the walker reads it');
    const sql = JSON.parse(lm[1].replace(/''/g, "'"));
    expect(sql).toEqual(engine);
    expect({ ...twin.CRIMINAL_INST_LABELS }).toEqual(engine);
    const less = { ...engine }; delete less['street gang'];
    expect(drift(new Set(Object.keys(engine)), Object.keys(less))[0]).toEqual(['street gang']);
  });

  it('TEETH: a pool with one key removed is named by the walker (each pool, each engine)', async () => {
    const twin = await import('../../src/domain/display/galleryRosterChoices.js');
    const sql = sqlPools();
    const cases = [['crime types', engineCrimeTypes(), Object.keys(twin.CRIME_TYPE_RAISERS || {})], ['crime types (212)', engineCrimeTypes(), Object.keys(sql.types)],
      ['hooks', await engineHooks(), Object.keys(twin.SAFETY_HOOK_RAISERS || {})], ['hooks (212)', await engineHooks(), Object.keys(sql.hooks)],
      ['rival', await engineRivalDescs(), [...(twin.RIVAL_POWER_DESCS || [])]], ['rival (212)', await engineRivalDescs(), sql.rival]];
    for (const [what, engine, keys] of cases) {
      const gone = [...engine][0];
      expect(drift(engine, keys.filter((k) => k !== gone))[0], what).toEqual([gone]);
    }
  });
});
