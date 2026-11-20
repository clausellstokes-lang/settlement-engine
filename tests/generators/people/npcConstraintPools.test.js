/**
 * npcConstraintPools.test.js — PEOPLE-1 B1b (2026-11-20; the chair's ruling of 16:51 UTC on
 * `docs/chair/2026-11-20/content/people/PROPOSAL-activeConstraint.md`, its (e) corrected at 17:13 UTC): THE POOLED LIMITS OF A
 * POST (`data/npcStructureVariants.js :: CONSTRAINT_VARIANTS`, chosen in `generators/npcStructure.js :: enrichNPCsWithStructure`).
 *   1. CANONICAL-AT-ZERO: index 0 of every pool is the writer's own constraint line; a seedless call prints index 0.
 *   2. Every printed wording on 100 places a size is admitted by the record (its `needs` hold, its `excludes` do not, the card
 *      as `ctx.npc`); no calm wording under a crisis; (a) "no paid hands" never beside a paid watch, a garrison or a hired
 *      company; (b) the guild row never where a guild power holds the seat, the watch row never on the watch's own head;
 *      (c) a `{house}` row only with a house of its kind; (d) the old families' wordings only on a card whose category is
 *      `other`.
 *   3. THE WALKER OF (e): no row of either pool NEEDS a fact about crime or a clandestine thing, and the `own house` atom
 *      never answers for a house of a hideable kind (`people/cardVeil.js :: isHideableHouse`, stamped `veiled` at birth).
 *   4. The word guards (MACHINERY, DEFENCE_WORDS with its atom, SUBORDINATE on the holder's constraint, UNDER on a head's row,
 *      office on the old families') pass over every constraint wording.
 */
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';
import { CONSTRAINT_VARIANTS, POSITION_VARIANTS, POSITION_POOL_OF } from '../../../src/data/npcStructureVariants.js';
import { enrichNPCsWithStructure, NOT_A_GOOD } from '../../../src/generators/npcStructure.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { atomHolds, declarationAdmits, declarationOf, parseAtom, FACT_DIMENSIONS } from '../../../src/domain/facts/factVocabulary.js';
import { houseFill } from '../../../src/generators/people/goals.js';
import { liveInstitutions } from '../../../src/domain/institutions/institutionRoster.js';
import { partitionDefenseInstitutions } from '../../../src/domain/institutions/defenseInstitutionBuckets.js';

// the writer's own table, SLICED FROM ITS FILE and evaluated (never retyped; the M1 measure's method): `T` is module-private
const WRITER = readFileSync(new URL('../../../src/generators/npcStructure.js', import.meta.url), 'utf8');
const cut = (/** @type {string} */ from, /** @type {string} */ to) => { const a = WRITER.indexOf(from); const b = WRITER.indexOf(to, a); if (a < 0 || b < 0) throw new Error(`slice ${from}`); return WRITER.slice(a, b); };
const TABLE = [cut('const GOVERNANCE_FRACTURED', 'function getPrimaryCondition'), cut('const T = {};', '// ── Score NPCs'), 'export { T };'].join('\n');
/** @type {Record<string, any>} the writer's own rows per `T` key */
const { T } = await import(/* @vite-ignore */ `data:text/javascript;base64,${Buffer.from(TABLE).toString('base64')}`);
/** @type {Record<string, string>} the writer's own constraint per `T` key */
const T_CONSTRAINT = Object.fromEntries(Object.entries(T).map(([k, v]) => [k, /** @type {any} */ (v).constraint]));

const esc = (/** @type {string} */ s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/**
 * Every row of every pool AS THE WRITER COMPOSES IT (PEOPLE-1 B1c: [the `T` row, ...the data pool]): index 0 is the `T` row's
 * own constraint with the `T` row's own declaration (its `tags`), never retyped; a sibling's index is its composed index (the
 * gates' `#n` keys).
 */
const composedOf = (/** @type {string} */ key) => [{ text: T_CONSTRAINT[key], ...declarationOf(T[key], { tagged: true }) }, ...CONSTRAINT_VARIANTS[key]];
const ROWS = Object.keys(CONSTRAINT_VARIANTS).flatMap((key) => composedOf(key).map((row, at) => ({
  key, at, row, re: new RegExp(`^${esc(row.text).replace(/\\\{(?:house|export|import)\\\}/g, '(.+)')}$`),
})));
const VARIANTS = ROWS.filter((r) => r.at > 0);

// the kinds of house, as the chair's (c) names them, read from the same homes the writer reads (the defence partition's force
// buckets; the catalogue's faith shelf; no home for an old family's house, so it fits none)
/** @param {any} s @param {any} c */
const houseRecordOf = (s, c) => (liveInstitutions(s) || []).find((/** @type {any} */ r) => r?.name === c.institution?.key) || null;
/** @param {any} rec @param {string[]} keys */
const inBuckets = (rec, keys) => !!rec && keys.some((k) => (/** @type {any} */ (partitionDefenseInstitutions(/** @type {any} */ ([rec])))[k] || []).length > 0);
/** @param {string | undefined} kind @param {any} rec */
const fits = (kind, rec) => !kind || (kind === 'people' ? inBuckets(rec, ['garrison', 'watch', 'militia', 'mercenary']) : kind === 'building' ? rec?.category === 'Religious' : false);

// the guards, copied verbatim from npcStructureSeatPlain.test.js, seatHolderOnThePage.test.jsx and npcStructureBody.test.js
const MACHINERY = /legitimacy|institutional|governance|governing|structur|faction|civic|rather than|Formal title|contingent|consolidat|accountab|capacity|settlement/i;
const DEFENCE_WORDS = /\bsoldiers?\b|\bgarrison|\b(?:walls|walled)\b|\bhospitals?\b|Guard Captain/i;
const SUBORDINATE = new RegExp([
  'Heads an old family while the seat', 'Serves the faith under its leaders', 'Belongs to a lesser', 'Runs a smaller house',
  'Leads a squad', 'Works spells under', 'Holds an office', 'Holds a place',
  'under (its|the|a) (leaders|senior casters|seat|crew)', 'behind the leading', 'a lesser (old )?family', 'smaller house',
  'takes orders from', 'only as strong as the seat', 'without the seniors\'? leave', 'has little say',
  'decides? what it (may|can) do', 'offices that run things', 'truly runs? the seat', 'say (slowly )?shrinks',
].join('|'));
const UNDER = /under its leaders|under the senior casters|under the crew's boss|in a crew|Works spells|Serves the faith|Holds a place/;

/** THE (e) WALKER'S CLASS: the vocabulary's dimensions about crime or a clandestine thing, read off its homes. */
const CRIME_HOMES = new Set(['crime', 'criminalIncome', 'rivalRings', 'crimeWave']);
const CRIME_DIMENSIONS = Object.entries(FACT_DIMENSIONS).filter(([name, d]) => CRIME_HOMES.has(d.home) || /crim|clandestin|smuggl|thie|racket|black market/i.test(name)).map(([name]) => name);

describe('PEOPLE-1 B1b · the constraint pools, canonical at zero', () => {
  it('index 0 of every pool is the writer\'s own constraint (composed from the T row; the data pool holds the siblings only); every alias names a pool of the same line', () => {
    for (const [key, pool] of Object.entries(CONSTRAINT_VARIANTS)) {
      expect(T_CONSTRAINT[key], `${key} is a T row`).toBeDefined();
      expect(composedOf(key)[0].text, key).toBe(T_CONSTRAINT[key]);
      expectAbsentWithAnchor(pool.map((r) => r.text), T_CONSTRAINT[key], pool[0]?.text, `${key}: the data pool holds no copy of its T line (its first sibling present)`);
      expect(composedOf(key).length, `${key} is a pool`).toBeGreaterThan(1);
    }
    for (const [alias, key] of Object.entries(POSITION_POOL_OF)) expect(T_CONSTRAINT[alias], alias).toBe(T_CONSTRAINT[key]);
    expect(VARIANTS.length, 'the ruling\'s 78 wordings').toBe(78);
  });
});

describe('PEOPLE-1 B1b · the walker of (e) and the word guards', () => {
  it('(e) no row of either pool needs a fact about crime or a clandestine thing', () => {
    expect(CRIME_DIMENSIONS, 'premise: the vocabulary names its crime facts').toEqual(expect.arrayContaining(['organised crime', 'criminal income', 'rival rings', 'crime', 'crime wave']));
    const bad = [];
    for (const [table, pools] of /** @type {const} */ ([['position', POSITION_VARIANTS], ['constraint', CONSTRAINT_VARIANTS]])) {
      for (const [key, pool] of Object.entries(pools)) pool.forEach((row, i) => { const at = i + 1; // the composed index (B1c: index 0 is the T row)
        for (const a of row.needs) if (CRIME_DIMENSIONS.includes(/** @type {any} */ (parseAtom(a))?.dimension)) bad.push(`${table} ${key}#${at} needs ${a}`);
      });
    }
    expect(bad).toEqual([]);
  });

  it('(e) `own house` never answers for a house of a hideable kind (stamped veiled at birth), and answers for a public one', () => {
    const facts = factsOf({ tier: 'town', institutions: [] });
    expect(atomHolds('own house', facts, { npc: { institution: { kind: 'house', key: "Thieves' Guild", veiled: true } } })).toBe(false);
    expect(atomHolds('own house', facts, { npc: { institution: { kind: 'house', key: 'Smugglers den', veiled: undefined } } })).toBe(false);
    expect(atomHolds('own house', facts, { npc: { institution: { kind: 'house', key: 'Town Watch', veiled: false } } })).toBe(true);
    expect(atomHolds('own house', facts, { npc: { institution: { kind: 'power', key: 'Merchant Guilds', veiled: false } } })).toBe(false);
  });

  it('every constraint wording passes the word guards and declares only the vocabulary', () => {
    const misses = [];
    for (const { key, at, row } of ROWS) {
      const t = row.text;
      for (const a of [...row.needs, ...row.excludes]) if (!parseAtom(a)) misses.push(`${key}#${at}: not an atom '${a}'`);
      if (MACHINERY.test(t)) misses.push(`${key}#${at}: machinery: ${t}`);
      const defence = t.match(DEFENCE_WORDS)?.[0];
      if (defence && !row.needs.some((a) => (/wall/i.test(defence) ? a === 'walls' : a === 'garrison'))) misses.push(`${key}#${at}: a defence word without its atom: ${t}`);
      if (/^government__.*__dominant$/.test(key) && SUBORDINATE.test(t)) misses.push(`${key}#${at}: subordinates the holder: ${t}`);
      if (/^other__/.test(key) && /\boffice\b/i.test(t)) misses.push(`${key}#${at}: an old family's row says office: ${t}`);
      if (/__dominant$/.test(key) && UNDER.test(t)) misses.push(`${key}#${at}: a head's row places it under: ${t}`);
      if (/__stable__/.test(key) && !row.excludes.includes('crisis')) misses.push(`${key}#${at}: a calm row that does not exclude crisis: ${t}`);
      if (/\{house\}/.test(t) !== row.needs.includes('own house')) misses.push(`${key}#${at}: a {house} slot and its atom disagree: ${t}`);
      if (/\{export\}/.test(t) !== row.needs.includes('export good') || /\{import\}/.test(t) !== row.needs.includes('import good')) misses.push(`${key}#${at}: a goods slot and its atom disagree: ${t}`);
      if (/no paid hands/i.test(t) && !['paid watch', 'garrison', 'mercenary'].every((a) => row.excludes.includes(a))) misses.push(`${key}#${at}: (a) "no paid hands" beside a paid force: ${t}`);
    }
    expect(misses).toEqual([]);
  });
});

describe('PEOPLE-1 B1b · every printed constraint is the record\'s (100 places a size)', () => {
  /** @type {Array<{ seed: string, s: any }>} */ const births = [];
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    for (const size of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
      for (let i = 0; i < 100; i++) {
        const seed = `hxd-${size}-${i}`;
        births.push({ seed, s: generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }) });
      }
    }
  }, 1_200_000);

  it('a printed wording is admitted, of its house\'s kind, past its gates, and on its own category', () => {
    const misses = [];
    let printed = 0; let housed = 0;
    for (const { seed, s } of births) {
      const facts = factsOf(s);
      const crisis = facts.crisis?.active === true;
      const governingTrade = (s.powerStructure?.factions || []).some((/** @type {any} */ f) => f.isGoverning && (f.category === 'economy' || f.category === 'crafts'));
      for (const c of s.npcs || []) {
        const p = String(c.activeConstraint || '');
        if (!p) continue;
        for (const v of VARIANTS.filter((x) => x.re.test(p))) {
          printed++;
          const where = `${seed} ${c.name} (${c.category}) ${v.key}#${v.at}: ${p}`;
          const verdict = declarationAdmits(declarationOf(v.row), facts, { ctx: { npc: c } });
          if (!verdict.admitted) misses.push(`refused (${verdict.refused.join(', ')}): ${where}`);
          if (crisis && v.row.excludes.includes('crisis')) misses.push(`a calm wording under a crisis: ${where}`);
          if (/^other__/.test(v.key) && c.category !== 'other') misses.push(`(d) an old family's wording off an old family's card: ${where}`);
          if (v.key === 'government__stable__dominant' && v.at === 2 && governingTrade) misses.push(`(b) the guild row where the trade holds the seat: ${where}`);
          if (v.key === 'military__stable__dominant' && v.at === 9 && inBuckets(houseRecordOf(s, c), ['watch'])) misses.push(`(b) the watch row on the watch's own head: ${where}`);
          if (v.row.needs.includes('own house')) {
            housed++;
            const house = houseFill(c.institution?.key);
            if (c.institution?.veiled !== false) misses.push(`(e) a hideable house named: ${where}`);
            if (!fits(/** @type {any} */ (v.row).house, houseRecordOf(s, c))) misses.push(`(c) a house not of the row's kind (${house}): ${where}`);
          }
        }
      }
    }
    expect(misses).toEqual([]);
    expect(printed, 'premise: the births print pooled constraints').toBeGreaterThan(300);
    expect(housed, 'premise: some card names its own house').toBeGreaterThan(0);
  });

  it('a goods slot (both pools) agrees with no verb after it and never fills with a service or a work', () => {
    // the integrator's unit of 2026-11-20: "furs and pelts goes out", "what its river fish fetches"; "sends out spellcasting"
    const GOODS = [...Object.entries(POSITION_VARIANTS).map(([k, pool]) => ['structuralPosition', k, pool]), ...Object.entries(CONSTRAINT_VARIANTS).map(([k, pool]) => ['constraint', k, pool])]
      .flatMap(([field, key, pool]) => /** @type {any[]} */ (pool).map((row, i) => ({ field, key, at: i + 1, row })))
      .filter((r) => /\{(?:export|import)\}/.test(r.row.text))
      .map((r) => ({ ...r, re: new RegExp(`^${esc(r.row.text).replace(/\\\{(?:house|export|import)\\\}/g, '(.+)')}$`), slot: r.row.text.search(/\{(?:export|import)\}/) }));
    const misses = [];
    let filled = 0;
    for (const { seed, s } of births) {
      for (const c of s.npcs || []) {
        for (const g of GOODS) {
          const text = String((g.field === 'constraint' ? c.activeConstraint : c.structuralPosition) || '').replace(/ Still .+ as well\.$/, '');
          const m = g.re.exec(text);
          if (!m) continue;
          filled++;
          const fill = m[1];
          const after = text.slice(text.indexOf(fill) + fill.length);
          if (/^ (?:goes out|fetches)\b/.test(after) || / goes out| fetches/.test(after)) misses.push(`${seed} ${g.key}#${g.at}: a verb agrees with the slot: ${text}`);
          if (NOT_A_GOOD.test(fill)) misses.push(`${seed} ${g.key}#${g.at}: a refused name fills the slot (${fill}): ${text}`);
        }
      }
    }
    expect(misses).toEqual([]);
    expect(filled, 'premise: the births fill goods slots').toBeGreaterThan(30);
  });

  it('a seedless re-run of the structural pass prints no pooled constraint but index 0', () => {
    const leaks = [];
    for (const { seed, s } of births.filter((b) => /^hxd-(?:town|city)-/.test(b.seed))) {
      const cleared = (s.npcs || []).map((/** @type {any} */ c) => ({ ...c, activeConstraint: undefined, structuralPosition: undefined }));
      for (const c of enrichNPCsWithStructure(cleared, { ...s, _seed: undefined })) {
        const p = String(c.activeConstraint || '');
        if (p && VARIANTS.some((v) => v.re.test(p))) leaks.push(`${seed} ${c.name}: ${p}`);
      }
    }
    expect(leaks).toEqual([]);
  });
});
