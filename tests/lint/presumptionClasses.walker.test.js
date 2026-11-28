/**
 * presumptionClasses.walker.test.js — THE PRESUMPTION-CLASSES WALKER: a line that presumes and declares nothing
 * fails (BAR6-GUARD; the chair's ruling BG1 of 2026-11-16, vetoable by the owner; designed by BAR6-AUDIT-G,
 * `docs/chair/2026-11-16/bar6/AUDIT/BAR6-AUDIT-G-HANDBACK.md` §4). The rule book is
 * `tests/lint/presumptionClasses.shared.mjs`; the register is `tests/lint/presumptionClasses.register.json`,
 * SHRINK-ONLY, written only by its door `scripts/presumption-classes-door.mjs`.
 *
 * It walks every prose literal (four words or more) under src/data, src/generators, src/domain and src/components
 * (the presumed-things walker's arm-1 roots; less `NOT_PAGE`, the surfaces that are no town page, by rule) and the six desks of the state annex, read structurally. A line holds a
 * PRESUMPTION CLASS when its words fall in one of thirteen classes (law 5's six crisis classes, and size, goods,
 * ease, threat, office, sovereign, resource): a word that presumes the town has a size, a trade, plenty, ease, no
 * threat, an office, a lord or a worked resource.
 *
 * THIS FILE REDS WHEN:
 *   • ARM 1: a line holds a class word and its declaration names no atom of a dimension that answers the class, and
 *     no register row banks it (a NEW undeclared line);
 *   • ARM 2: … where `crisis: any` is the only answer it gives a crisis class, or it is ruled `colour`;
 *   • ARM 3: … where only crisis KINDS answer a plenty, ease, threat or outside word and they leave its FAMILY open
 *     (`excludes: ['crisis: under_siege']` beside a famine);
 *   • ARM 4: … where a size word meets a tier band that admits a place too small (or too big) for it: districts,
 *     quarters, neighbourhoods and wards need a town or larger, streets and alleys a village or larger (BRIEF-BAR6,
 *     BAR6-DEFDESK's size atom), the small words ("a small group of traders") a town or smaller;
 *   • ARM 5 WIDENS: an exemption is a RULE (a negated mention; a line bound to its house, title or chain, for a goods,
 *     resource, office, iron or animals word only; the record's own fact printed back, `RECORD_FACT_POOLS`), never a
 *     row: the rules are pinned here as they stand;
 *   • the register holds a STALE row (a cure leaves its row: the round's close removes it through the door's
 *     `--shrink`; BG1: no other seat edits the walker or its register), a row of an unknown shape or status, or more
 *     rows than its ceiling, or the ceiling rises over the count banked at the base.
 * Every arm is EXECUTED against planted source in memory.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, test } from 'vitest';

import {
  BOUND_CLASSES, CLASS_DIMS, CLASS_FAMILIES, CLASS_IDS, NAMED_ATOMS, NOT_PAGE, RECORD_FACT_POOLS, REGISTER_REL, ROOTS, STOCK_STATUSES,
  bankedKeys, classesOf, gateAtomsOfPoolKey, hitsOf, knownDimension, notPage, rowKey, scanAnnex, scanSource, scanTree,
} from './presumptionClasses.shared.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
/** the debt banked at the base (afa46d644): the ceiling may only fall from here */
const BASE_CEILING = 1938;

/** The hits of a planted file, as `class:status` per text. @param {string} rel @param {string} src */
const planted = (rel, src) => hitsOf(scanSource(rel, src)).map((h) => `${h.cls}:${h.status} :: ${h.text}`);
const one = (rel, entry) => planted(rel, `export const POOL = [\n  ${entry},\n];\n`);

describe('the lexicon', () => {
  test('every answering dimension is a dimension of the facts\' vocabulary', () => {
    const bad = Object.entries(CLASS_DIMS).flatMap(([c, ds]) => ds.filter((d) => !knownDimension(d) && !NAMED_ATOMS[d]).map((d) => `${c}: ${d}`));
    expect(bad).toEqual([]);
    expect(Object.keys(CLASS_DIMS).sort()).toEqual([...CLASS_IDS].sort());
  });
  test('RULING CD1: the seats\' new atoms answer their classes (named until the joined vocabulary holds them)', () => {
    expect(Object.keys(NAMED_ATOMS).sort()).toEqual(['crime wave', 'exported', 'food surplus', 'force', 'legitimacy crisis', 'monster frontier', 'sovereign']);
    expect(one('src/data/plantedPool.js', `{ text: 'The watch walks its patrols every night.', needs: ['force: paid'] }`)).toEqual([]);
    expect(one('src/data/plantedPool.js', `{ text: 'Bales of wool leave by the river each spring.', needs: ['exported: wool'] }`)).toEqual(['resource:other :: Bales of wool leave by the river each spring.']);
    expect(one('src/data/plantedPool.js', `{ text: 'The lord holds the valley in an ordinary way.', excludes: ['legitimacy crisis'] }`)).toEqual([]);
    const F = 'src/data/plantedPool.js';
    expect(one(F, `{ text: 'The lord takes his dues at the harvest.' }`)).toEqual(['sovereign:none :: The lord takes his dues at the harvest.']);
    expect(one(F, `{ text: 'The lord takes his dues at the harvest.', needs: ['sovereign'] }`)).toEqual([]);
    expect(one(F, `{ text: 'Nothing threatens the town from the hills.', needs: ['no monster frontier'] }`)).toEqual([]);
    expect(one(F, `{ text: 'There is plenty on every table this week.', needs: ['food surplus'] }`)).toEqual([]);
    expect(one(F, `{ text: 'Crime is rare and doors are left unlocked.', excludes: ['crime wave'] }`)).toEqual([]);
  });
  test('the four misses of the audit are read (an arrival of goods, crop farming, small for big, "for this scale")', () => {
    expect(classesOf('Porters under loaded frames come past the gate at dusk.')).toContain('outside');
    expect(classesOf('Its terraces and raised fields feed the whole valley.')).toContain('resource');
    expect(classesOf('A small group of traders sets up by the well each morning.')).toContain('size');
    expect(classesOf('A heavy force for this scale, and its captain is heard in council.')).toContain('size');
  });
  test('three word senses are narrowed, and the presuming sense of each stands', () => {
    expect(classesOf('Protective wards are scratched into the lintels here.')).toEqual([]);
    expect(classesOf('The town is divided into four wards by the river.')).toEqual(['size']);
    expect(classesOf('The hills roll on as ever beyond the fields.')).toEqual([]);
    expect(classesOf('Anyone who is paid can be asked a favour here.')).toEqual([]);
    expect([classesOf('Buys at a quarter of the worth.'), classesOf('A checkpoint a quarter mile from the gate.'), classesOf('Every quarter of the city keeps a shrine.')]).toEqual([[], [], ['size']]);
    expect(classesOf('The guards are paid on the first of each month.')).toEqual(['office']);
  });
});

describe('the five arms, planted', () => {
  const F = 'src/data/plantedPool.js';
  test('ARM 1: a class word with no answer is a hit; an answering atom clears it', () => {
    expect(one(F, `{ text: 'Caravans come in from the coast every week.' }`)).toEqual(['outside:none :: Caravans come in from the coast every week.']);
    expect(one(F, `{ text: 'Caravans come in from the coast every week.', needs: ['route: road'] }`)).toEqual([]);
    expect(one(F, `{ text: 'Caravans come in from the coast every week.', needs: ['prosperity: ≥ comfortable'] }`)).toEqual(['outside:other :: Caravans come in from the coast every week.']);
  });
  test('ARM 2: `crisis: any` answers no crisis class, and `colour` beside a class word is a hit', () => {
    expect(one(F, `{ text: 'There is plenty on every table this week.', crisis: ['any'] }`)).toEqual(['plenty:any :: There is plenty on every table this week.']);
    expect(one(F, `{ text: 'The old quarter smells of bread and smoke.', colour: true }`)).toEqual(['size:colour :: The old quarter smells of bread and smoke.']);
  });
  test('ARM 3: a crisis class needs its families, not one kind', () => {
    const t = 'There is plenty on every table this week.';
    expect(one(F, `{ text: '${t}', crisis: ['any'], excludes: ['crisis: under_siege'] }`)).toEqual([`plenty:one-kind :: ${t}`]);
    expect(one(F, `{ text: '${t}', crisis: ['any'], excludes: ['crisis: hunger'] }`)).toEqual([]);
    expect(one(F, `{ text: '${t}', crisis: ['any'], excludes: ['crisis: famine', 'crisis: under_siege'] }`)).toEqual([]);
    expect(one(F, `{ text: '${t}', excludes: ['crisis'] }`)).toEqual([]);
    expect(one(F, `{ text: '${t}', needs: ['crisis: calm'] }`)).toEqual([]);
    expect(CLASS_FAMILIES).toEqual({ plenty: ['hunger'], ease: ['threat', 'hunger'], threat: ['threat'], outside: ['threat'] });
  });
  test('ARM 4: a size word meets its band', () => {
    const n = 'Each neighbourhood keeps its own small shrine.';
    expect(one(F, `{ text: '${n}', needs: ['tier: ≥ village'] }`)).toEqual([`size:band :: ${n}`]);
    expect(one(F, `{ text: '${n}', needs: ['tier: ≥ town'] }`)).toEqual([]);
    expect(one(F, `{ text: '${n}', needs: ['population: ≥ middling'] }`)).toEqual([]);
    const s = 'Children chase each other down the narrow streets.';
    expect(one(F, `{ text: '${s}', needs: ['tier: ≥ village'] }`)).toEqual(['ease:other :: Children chase each other down the narrow streets.']);
    expect(one(F, `{ text: '${s}', needs: ['tier: ≥ hamlet'] }`)).toEqual(['ease:other :: Children chase each other down the narrow streets.', `size:band :: ${s}`]);
    const m = 'A small group of traders sets up by the well each morning.';
    expect(one(F, `{ text: '${m}', needs: ['tier: ≥ city'] }`)).toEqual([`size:band :: ${m}`]);
    expect(one(F, `{ text: '${m}', excludes: ['tier: ≥ city'] }`)).toEqual([]);
  });
  test('ARM 5: exempt by rule: a negated mention, a bound line (never for size), the record\'s own fact', () => {
    expect(one(F, `{ text: 'No caravans have come this way in years.' }`)).toEqual([]);
    const B = 'src/data/institutionServices.js';
    expect(one(B, `{ text: 'Sells wine and ale by the cask to all comers.' }`)).toEqual([]);
    expect(one(B, `{ text: 'Serves every quarter of the city from one counter.' }`)).toEqual(['size:none :: Serves every quarter of the city from one counter.']);
    expect([...BOUND_CLASSES].sort()).toEqual(['animals', 'goods', 'iron', 'office', 'resource']);
    expect(planted('src/generators/demandProfile.js', `const FACTION_DEMAND = {\n  government: ['Fine silk and embroidered cloth'],\n};\n`)).toEqual([]);
    expect(planted('src/generators/otherDemand.js', `const FACTION_DEMAND = {\n  government: ['Fine silk and embroidered cloth'],\n};\n`)).toEqual(['goods:none :: Fine silk and embroidered cloth']);
    expect(RECORD_FACT_POOLS.map((r) => `${r.file} :: ${r.pool} :: ${r.classes.join(',')}`)).toEqual([
      'src/generators/demandProfile.js :: FACTION_DEMAND :: goods',
      'src/generators/narrativeGenerator.js :: genArrivalDetail :: resource,outside,goods',
      'src/data/narrativeData.js :: TERRAIN_NARRATIVE_HOOKS :: resource,outside',
      'src/generators/narrative/settlementOriginProse.js :: ORIGIN_POOLS :: outside',
      'src/data/economicData.js :: TRADE_DEPENDENCY_NEEDS :: resource,goods',
      'src/generators/structuralValidator.js :: FUNDED_EMBATTLED :: office',
      'src/domain/summary/settlementQuickGuide.js :: scopeAtSize :: size',
    ]);
  });
  test('a key names its band or its gate: the verified tier key, and the annex pool keyed by its gate', () => {
    expect(planted(F, `const LAYOUT_BY_TIER = {\n  city: {\n    hills: 'Hill town: the old quarter below the heights',\n  },\n  hamlet: {\n    hills: 'A hamlet: the old quarter below the heights',\n  },\n};\n`))
      .toEqual(['size:band :: A hamlet: the old quarter below the heights']);
    expect(gateAtomsOfPoolKey('militia PRESENT (no garrison)')).toEqual(['militia']);
    expect(gateAtomsOfPoolKey('walls ABSENT')).toEqual([]);
    expect(gateAtomsOfPoolKey('DIRECTION: stable · CRISIS: famine')).toEqual(['crisis: famine']);
    expect(gateAtomsOfPoolKey('posture UNDER OCCUPATION')).toEqual(['crisis: occupied']);
  });
  test('the annex is read structurally: a variant\'s marks and its pool\'s rulings', () => {
    const block = (marks, pm = {}) => ({ B1: { pools: { calm: [{ text: 'The streets are quiet and nothing threatens the town.', marks }] }, poolMeta: { calm: pm } } });
    const rel = 'src/data/dossierStateProse/planted.generated.js';
    const st = (b) => hitsOf(scanAnnex(rel, b)).map((h) => `${h.cls}:${h.status}`);
    expect(st(block([]))).toEqual(['size:none', 'threat:none']);
    expect(st(block(['no threat', 'tier: ≥ village']))).toEqual([]);
    expect(st(block(['colour']))).toEqual(['size:colour', 'threat:colour']);
    expect(st(block([], { crisisScoped: true }))).toEqual(['size:none']);
  });
  test('the scope is the four roots, less the surfaces that are no town page (by rule, each present in the tree)', () => {
    expect(ROOTS).toEqual(['src/data', 'src/generators', 'src/domain', 'src/components']);
    expect(NOT_PAGE.map(([p]) => p).filter((p) => !existsSync(join(ROOT, p)))).toEqual([]);
    expect(NOT_PAGE.length).toBe(21); // 19 -> 20: the closed list of venal secrets, by the chair's ruling of 2026-11-20 16:04 UTC (GOALS-3, R2); 20 -> 21: SURVEY S-C's table of exclusions (data, imported by no file under src; presumedThings' rule-book pin holds that)
    expect([notPage('src/domain/worldPulse/heraldLines.js'), notPage('src/components/new/tabs/DefenseTab.jsx'), notPage('src/components/HomeHero.jsx')]).toEqual([true, false, true]);
  });
});

describe('the tree against its register', () => {
  const register = JSON.parse(readFileSync(join(ROOT, REGISTER_REL), 'utf8'));
  /** @type {Awaited<ReturnType<typeof scanTree>>} */ let hits = [];
  beforeAll(async () => { hits = await scanTree(ROOT); }, 120_000);

  test('the walk sees the tree (a blind walk would pass every arm below)', () => {
    expect(hits.length).toBeGreaterThan(1000);
    expect(new Set(hits.map((h) => h.file)).size).toBeGreaterThan(100);
  });
  test('no NEW undeclared line: every hit is banked (declare the line; the door never banks a new one)', () => {
    const banked = bankedKeys(register);
    const fresh = hits.filter((h) => !banked.has(h.key)).map((h) => `${h.file} · ${h.cls}:${h.status} · ${h.text.slice(0, 100)}`);
    expect(fresh).toEqual([]);
  });
  test('no stale row: a cured line leaves the register (the close runs `node scripts/presumption-classes-door.mjs --shrink`)', () => {
    const found = new Set(hits.map((h) => h.key));
    expect([...bankedKeys(register)].filter((k) => !found.has(k))).toEqual([]);
  });
  test('every row is of the register\'s shape, unique, and the register only shrinks', () => {
    const rows = Object.entries(register.rows).flatMap(([f, rs]) => rs.map((r) => [f, r]));
    const bad = rows.filter(([, r]) => !(Array.isArray(r) && r.length === 4 && CLASS_IDS.includes(r[0]) && STOCK_STATUSES.includes(r[1]) && typeof r[2] === 'string' && /^[0-9a-f]{16}$/.test(r[3])));
    expect(bad).toEqual([]);
    expect(new Set(rows.map(([f, r]) => rowKey(f, r))).size).toBe(rows.length);
    expect(register.base).toBe('afa46d644');
    expect(rows.length).toBeLessThanOrEqual(register.ceiling);
    expect(register.ceiling).toBeLessThanOrEqual(BASE_CEILING);
  });
});
