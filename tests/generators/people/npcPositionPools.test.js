/**
 * npcPositionPools.test.js — PEOPLE-1 B1 (2026-11-20; the chair's ruling of 16:41 UTC on
 * `docs/chair/2026-11-20/content/people/PROPOSAL-structuralPosition.md`, as amended by `READ-M1-npcStructure.md`): THE
 * POOLED PLACE IN THE ORDER (`data/npcStructureVariants.js :: POSITION_VARIANTS`, chosen in `generators/npcStructure.js ::
 * enrichNPCsWithStructure`).
 *   1. CANONICAL-AT-ZERO: index 0 of every pool is the writer's own line (the census declaration of `T`), and a seedless call
 *      prints index 0 on every row.
 *   2. Every printed wording on 100 places a size, born as the chair's instrument births them, is admitted by the record:
 *      its `needs` hold and its `excludes` do not (`factVocabulary.js :: declarationAdmits`, the card as `ctx.npc`); no calm
 *      row's wording prints in a place under a crisis.
 *   3. The word guards pass over every wording of the data file: `npcStructureSeatPlain.test.js`'s MACHINERY and
 *      DEFENCE_WORDS (a defence word only on a row that declares its atom), `seatHolderOnThePage.test.jsx`'s SUBORDINATE on
 *      the holder's pools, the holder's opening, `lordNotGovernment.test.js`'s office on the old families, and
 *      `npcStructureBody.test.js`'s UNDER on a head's row.
 */
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import { POSITION_VARIANTS, POSITION_POOL_OF } from '../../../src/data/npcStructureVariants.js';
import { enrichNPCsWithStructure } from '../../../src/generators/npcStructure.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { declarationAdmits, declarationOf, parseAtom } from '../../../src/domain/facts/factVocabulary.js';

// the writer's own table, SLICED FROM ITS FILE and evaluated (never retyped; the M1 measure's method): `T` is module-private
const WRITER = readFileSync(new URL('../../../src/generators/npcStructure.js', import.meta.url), 'utf8');
const cut = (/** @type {string} */ from, /** @type {string} */ to) => { const a = WRITER.indexOf(from); const b = WRITER.indexOf(to, a); if (a < 0 || b < 0) throw new Error(`slice ${from}`); return WRITER.slice(a, b); };
const TABLE = [cut('const GOVERNANCE_FRACTURED', 'function getPrimaryCondition'), cut('const T = {};', '// ── Score NPCs'), 'export { T };'].join('\n');
/** @type {Record<string, any>} the writer's own rows per `T` key */
const { T } = await import(/* @vite-ignore */ `data:text/javascript;base64,${Buffer.from(TABLE).toString('base64')}`);
/** @type {Record<string, string>} the writer's own line per `T` key */
const T_POSITION = Object.fromEntries(Object.entries(T).map(([k, v]) => [k, /** @type {any} */ (v).position]));

const esc = (/** @type {string} */ s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/**
 * Every row of every pool AS THE WRITER COMPOSES IT (PEOPLE-1 B1c: [the `T` row, ...the data pool]), with its key, index and a
 * matcher for its filled text: index 0 is the `T` row's own line with the `T` row's own declaration (its `tags`), never retyped.
 */
const composedOf = (/** @type {string} */ key) => [{ text: T_POSITION[key], ...declarationOf(T[key], { tagged: true }) }, ...POSITION_VARIANTS[key]];
const ROWS = Object.keys(POSITION_VARIANTS).flatMap((key) => composedOf(key).map((row, at) => ({
  key, at, row, re: new RegExp(`^${esc(row.text).replace(/\\\{(?:house|export|import)\\\}/g, '.+')}$`),
})));
const VARIANTS = ROWS.filter((r) => r.at > 0);
const HOUSE_TAIL = / Still .+ as well\.$/;

// the guards, copied verbatim from the files named in the header
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
const HOLDS = /^Holds the seat\b/;
const isHolderPool = (/** @type {string} */ key) => /^government__.*__dominant$/.test(key);

describe('PEOPLE-1 B1 · the pools, canonical at zero', () => {
  it('index 0 of every pool is the writer\'s own line (composed from the T row; the data pool holds the siblings only); every alias names a pool of the same line', () => {
    for (const [key, pool] of Object.entries(POSITION_VARIANTS)) {
      expect(T_POSITION[key], `${key} is a T row`).toBeDefined();
      expect(composedOf(key)[0].text, key).toBe(T_POSITION[key]);
      expect(pool.map((r) => r.text), `${key}: the data pool holds no copy of its T line`).not.toContain(T_POSITION[key]);
      expect(composedOf(key).length, `${key} is a pool`).toBeGreaterThan(1);
    }
    for (const [alias, key] of Object.entries(POSITION_POOL_OF)) expect(T_POSITION[alias], alias).toBe(T_POSITION[key]);
  });

  it('a seedless call prints index 0 on every row (a constructed place for each pooled key)', () => {
    const head = (/** @type {string} */ category, /** @type {number} */ rank, /** @type {string} */ id) => ({ id, name: `${id} Hale`, role: 'Reeve', category, memberships: [{ power: 'Seat', rank, share: 1 }], goal: { short: 'g', long: 'g' }, institution: { kind: 'house', key: 'Town Watch' } });
    const CONDITIONS = /** @type {Record<string, Record<string, any>>} */ ({
      governance_fractured: { publicLegitimacy: { governanceFractured: true } }, contested: { publicLegitimacy: { isContested: true } },
      economic_stress: {}, corruption: { criminalCaptureState: 'corrupted' }, food_crisis: {}, stable: {},
    });
    const keys = [...Object.keys(POSITION_VARIANTS), ...Object.keys(POSITION_POOL_OF)];
    let read = 0;
    for (const key of keys) {
      const [category, condition, rank] = key.split('__');
      const seatCategory = category === 'other' ? 'noble' : category;
      /** @param {string | undefined} seed */
      const place = (seed) => ({
        ...(seed ? { _seed: seed } : {}), tier: 'city', population: 30000, stress: [], institutions: [], config: {},
        powerStructure: {
          factions: category === 'government'
            ? [{ faction: 'Seat', category, power: 60, isGoverning: true }]
            : [{ faction: 'Council', category: 'government', power: 60, isGoverning: true }, { faction: 'Seat', category: seatCategory, power: 60 }],
          criminalCaptureState: 'none', ...CONDITIONS[condition],
        },
        economicState: { prosperity: condition === 'economic_stress' ? 'Struggling' : 'Comfortable', foodSecurity: { label: condition === 'food_crisis' ? 'Famine' : '' }, primaryExports: ['Raw wool'], primaryImports: ['Iron'] },
      });
      const cards = rank === 'dominant' ? [head(category, 1, 'a'), head(category, 3, 'b'), head(category, 3, 'c')] : [head(category, 3, 'a'), head(category, 3, 'b'), head(category, 1, 'c')];
      const pool = composedOf(POSITION_POOL_OF[key] || key);
      const canon = new Set([pool[0].text, 'Heads the leading house in the trade in quiet times, though its word counts for little beyond the trade.', 'Heads the casters in quiet times; their spells are in demand, though their word counts for little beyond them.']);
      for (const c of enrichNPCsWithStructure(cards, place(undefined))) {
        const p = String(c.structuralPosition || '').replace(HOUSE_TAIL, '');
        if (!p) continue;
        expect(VARIANTS.filter((v) => v.re.test(p)).map((v) => `${v.key}#${v.at}`), `${key}: ${p}`).toEqual([]);
        if (`${category}__${condition}__${rank}` === key && pool.some((r) => r.text === p)) { expect(canon.has(p), `${key}: ${p}`).toBe(true); read++; }
      }
    }
    expect(read, 'premise: the constructed places reach the pooled rows').toBeGreaterThan(8);
  });
});

describe('PEOPLE-1 B1 · the wordings guarded', () => {
  it('every wording of the data file passes the word guards, and declares only the vocabulary', () => {
    const misses = [];
    for (const { key, at, row } of ROWS) {
      const t = row.text;
      for (const a of [...row.needs, ...row.excludes]) if (!parseAtom(a)) misses.push(`${key}#${at}: not an atom '${a}'`);
      if (MACHINERY.test(t)) misses.push(`${key}#${at}: machinery: ${t}`);
      const defence = t.match(DEFENCE_WORDS)?.[0];
      if (defence && !row.needs.some((a) => (/wall/i.test(defence) ? a === 'walls' : a === 'garrison'))) misses.push(`${key}#${at}: a defence word without its atom: ${t}`);
      if (isHolderPool(key) && SUBORDINATE.test(t)) misses.push(`${key}#${at}: subordinates the holder: ${t}`);
      if (isHolderPool(key) && !HOLDS.test(t)) misses.push(`${key}#${at}: the holder does not hold the seat: ${t}`);
      if (!isHolderPool(key) && HOLDS.test(t)) misses.push(`${key}#${at}: "Holds the seat" off the holder: ${t}`);
      if (/^other__/.test(key) && /\boffice\b/i.test(t)) misses.push(`${key}#${at}: an old family's row says office: ${t}`);
      if (/__dominant$/.test(key) && UNDER.test(t)) misses.push(`${key}#${at}: a head's row places it under: ${t}`);
      if (/__stable__/.test(key) && !row.excludes.includes('crisis')) misses.push(`${key}#${at}: a calm row that does not exclude crisis: ${t}`);
      if (at > 0 && /(?:its hold|their place) is secure|say is real/.test(t)) misses.push(`${key}#${at}: a new wording claims a secure hold: ${t}`);
    }
    expect(misses).toEqual([]);
    expect(VARIANTS.length, 'premise: the pools hold their wordings').toBeGreaterThan(50);
  });
});

describe('PEOPLE-1 B1 · every printed wording is the record\'s (100 places a size)', () => {
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

  it('a printed wording\'s needs hold and its excludes do not; no calm wording under a crisis', () => {
    const misses = [];
    let printed = 0;
    for (const { seed, s } of births) {
      const facts = factsOf(s);
      const crisis = facts.crisis?.active === true;
      for (const c of s.npcs || []) {
        const p = String(c.structuralPosition || '').replace(HOUSE_TAIL, '');
        if (!p) continue;
        for (const v of VARIANTS.filter((x) => x.re.test(p))) {
          printed++;
          const verdict = declarationAdmits(declarationOf(v.row), facts, { ctx: { npc: c } });
          if (!verdict.admitted) misses.push(`${seed} ${c.name}: ${v.key}#${v.at} refused (${verdict.refused.join(', ')}): ${p}`);
          if (crisis && v.row.excludes.includes('crisis')) misses.push(`${seed} ${c.name}: a calm wording under a crisis: ${p}`);
        }
      }
    }
    expect(misses).toEqual([]);
    expect(printed, 'premise: the births print pooled wordings').toBeGreaterThan(300);
  });

  it('a seedless re-run of the structural pass prints no pooled wording but index 0', () => {
    const leaks = [];
    for (const { seed, s } of births.filter((b) => /^hxd-(?:town|city)-/.test(b.seed))) {
      const cleared = (s.npcs || []).map((/** @type {any} */ c) => ({ ...c, structuralPosition: undefined }));
      for (const c of enrichNPCsWithStructure(cleared, { ...s, _seed: undefined })) {
        const p = String(c.structuralPosition || '').replace(HOUSE_TAIL, '');
        if (p && VARIANTS.some((v) => v.re.test(p))) leaks.push(`${seed} ${c.name}: ${p}`);
      }
    }
    expect(leaks).toEqual([]);
  });
});
