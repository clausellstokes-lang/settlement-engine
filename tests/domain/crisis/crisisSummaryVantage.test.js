/**
 * crisisSummaryVantage.test.js — #29, THE CRISIS SUMMARY BY SURFACE (STYLE-RULINGS §1(c),
 * WAVE-RULINGS item 2; W4 PEOPLE second seat, 2026-11-07), and THE §8 FLOOR (SW-5
 * CRISIS-VANTAGES, 2026-11-09, STYLE-RULINGS-2 A4). The crisis section keeps the full text; every
 * other surface prints a line from its own pool of four vantages, the town's seed choosing one
 * column of a Latin square, so one PDF never prints one paragraph twice and sibling towns under
 * one crisis print different frames.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import {
  CRISIS_SUMMARY_POOLS, SUMMARY_COLUMNS, SURFACE_VANTAGE_COLUMNS, crisisSummaryForSurface, summaryColumnOf,
} from '../../../src/domain/crisis/crisisSummaryVantage.js';
import { STRESS_TYPE_MAP } from '../../../src/data/stressTypes.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { buildViewModel } from '../../../src/pdf/lib/viewModel.js';
import { composeTonightSheet } from '../../../src/domain/summary/tonightSheet.js';
import { composeCrisisPage } from '../../../src/domain/crisis/crisisPage.js';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { deriveArmedForces } from '../../../src/domain/display/defenseDisplay.js';
import { hasMarketInstitution } from '../../../src/domain/facts/market.js';

const KINDS = Object.keys(STRESS_TYPE_MAP);
const SURFACES = /** @type {const} */ (['cover', 'overview', 'defence', 'tonight']);
const VOCABULARY = ['traveller', 'official', 'local', 'newcomer', 'trade', 'watch'];
/** every pool set of the table, the migration's two directions apart */
const SETS = KINDS.flatMap((kind) => (kind === 'mass_migration'
  ? [['mass_migration/arrivals', CRISIS_SUMMARY_POOLS.mass_migration.arrivals], ['mass_migration/departures', CRISIS_SUMMARY_POOLS.mass_migration.departures]]
  : [[kind, CRISIS_SUMMARY_POOLS[kind]]]));

describe('#29 and the §8 floor — the crisis summary by surface, four vantages per surface', () => {
  it('the square: every surface pool holds four of §8\'s vantages, every column four different ones, column 0 is #29\'s', () => {
    expect(SUMMARY_COLUMNS).toBe(4);
    expect(Object.keys(SURFACE_VANTAGE_COLUMNS).sort()).toEqual([...SURFACES].sort());
    for (const s of SURFACES) {
      const col = SURFACE_VANTAGE_COLUMNS[s];
      expect(col.length, s).toBe(SUMMARY_COLUMNS);
      expect(new Set(col).size, `${s}: four different vantages`).toBe(SUMMARY_COLUMNS);
      for (const v of col) expect(VOCABULARY, `${s}: ${v}`).toContain(v);
    }
    for (let k = 0; k < SUMMARY_COLUMNS; k += 1) {
      expect(new Set(SURFACES.map((s) => SURFACE_VANTAGE_COLUMNS[s][k])).size, `column ${k}`).toBe(4);
    }
    expect(SURFACES.map((s) => SURFACE_VANTAGE_COLUMNS[s][0])).toEqual(['traveller', 'local', 'watch', 'official']);
  });

  it('every crisis kind carries four lines per surface, each naming the place, none another\'s words', () => {
    expect(SETS.length).toBe(16);
    /** @type {Set<string>} */
    const every = new Set();
    const failures = collectSeedFailures(SETS, ([kind, set]) => {
      expect(set, kind).toBeTruthy();
      for (const surface of SURFACES) {
        const pool = set[surface];
        expect(Object.keys(pool).sort(), `${kind}/${surface}: the square's vantages`).toEqual([...SURFACE_VANTAGE_COLUMNS[surface]].sort());
        for (const line of Object.values(pool)) {
          expect(typeof line === 'string' && line.includes('{name}'), `${kind}/${surface}: ${line}`).toBe(true);
          // a vantage claims no defence the record may lack, no figure (the digit ban), no tier noun, no retired word
          expect(line).not.toMatch(/\b(?:garrison|soldiers?|walls?|walled|hospitals?)\b/i); // anchored: the line two above pins this same string as a real line with its {name} slot
          expect(line).not.toMatch(/[0-9]/); // anchored: the same string, pinned three lines above
          expect(line).not.toMatch(/\b(?:town|city|village|hamlet|thorp|factions?)\b/i); // anchored: the same string, pinned four lines above
          // the Defence tab prints no stored food beside its one Food endurance line (defenseWordsFindings.test.js)
          if (surface === 'defence') expect(line).not.toMatch(/\bgranar(?:y|ies)\b|\bfood (?:reserves|buffer|stored)\b|\b(?:household|common) stores\b|\bstored food\b|\bput by\b/i); // anchored: the same string, pinned six lines above
          every.add(line);
        }
      }
    });
    expectNoSeedFailures(failures, 'every crisis kind has four distinct, slotted lines per surface');
    expect(every.size, 'no line is used twice anywhere in the table').toBe(16 * 4 * 4);
  });

  it('the stored summary stays the crisis section\'s, and the fallback for a kind the table does not know', () => {
    const entry = { type: 'famine', summary: 'Stored.' };
    expect(crisisSummaryForSurface(entry, 'Thornwall', /** @type {any} */ ('crisis'))).toBe('Stored.');
    expect(crisisSummaryForSurface({ type: 'custom_crisis', summary: 'Authored.' }, 'Thornwall', 'overview')).toBe('Authored.');
    expect(crisisSummaryForSurface(entry, '', 'overview')).toBe('Stored.');
    const k = summaryColumnOf('Thornwall', 'famine');
    expect(crisisSummaryForSurface(entry, 'Thornwall', 'overview'))
      .toBe(CRISIS_SUMMARY_POOLS.famine.overview[SURFACE_VANTAGE_COLUMNS.overview[k]].replace('{name}', 'Thornwall'));
  });

  it('a migration speaks in the direction its record declares', () => {
    const k = summaryColumnOf('Thornwall', 'mass_migration');
    const v = SURFACE_VANTAGE_COLUMNS.cover[k];
    const arrivals = crisisSummaryForSurface({ type: 'mass_migration', direction: 'arrivals' }, 'Thornwall', 'cover');
    const departures = crisisSummaryForSurface({ type: 'mass_migration', direction: 'departures' }, 'Thornwall', 'cover');
    expect(arrivals).toBe(CRISIS_SUMMARY_POOLS.mass_migration.arrivals.cover[v].replace('{name}', 'Thornwall'));
    expect(departures).toBe(CRISIS_SUMMARY_POOLS.mass_migration.departures.cover[v].replace('{name}', 'Thornwall'));
    // an entry saved before the field reads as arrivals, the ruled default (ODQ §934.101)
    expect(crisisSummaryForSurface({ type: 'mass_migration' }, 'Thornwall', 'cover')).toBe(arrivals);
  });

  it('the seed chooses: one town prints the same line forever, its four surfaces four different lines, and sibling towns spread over every column', () => {
    const names = Array.from({ length: 64 }, (_, i) => `Sibling${i}`);
    for (const kind of KINDS) {
      const entry = { type: kind, summary: 'Stored.' };
      /** @type {Set<string>} */
      const covers = new Set();
      for (const name of names) {
        const lines = SURFACES.map((s) => crisisSummaryForSurface(entry, name, s));
        expect(SURFACES.map((s) => crisisSummaryForSurface(entry, name, s)), `${kind}/${name}: stable`).toEqual(lines);
        expect(new Set(lines).size, `${kind}/${name}: four surfaces, four lines`).toBe(4);
        covers.add(String(lines[0]).replace(name, '@'));
      }
      expect(covers.size, `${kind}: sibling towns print every cover variant`).toBe(SUMMARY_COLUMNS);
    }
  });

  it('over generated crisis towns, the four surfaces print their own lines and the crisis page the full text', () => {
    const cases = KINDS.map((kind, i) => ({ kind, seed: `vantage-${i}` }));
    const failures = collectSeedFailures(cases, ({ kind, seed }) => {
      const s = generateSettlementPipeline({ settType: 'town', stressTypes: [kind] }, null, { seed, customContent: {} });
      const entry = (Array.isArray(s.stress) ? s.stress : [s.stress]).find((x) => x?.type === kind);
      expect(entry, `${kind} drawn`).toBeTruthy();
      const vm = buildViewModel({ settlement: s });
      const cover = vm.summary.crisis.chips.find((c) => c.label === entry.label)?.summary;
      const overview = vm.overview.stress.find((c) => c.label === entry.label)?.summary;
      const tonight = composeTonightSheet(s).opening;
      const page = composeCrisisPage(s).find((x) => x.type === kind)?.summary;
      expect(page, `${kind}: the crisis page keeps the stored summary`).toBe(entry.summary);
      expect(cover).toBe(crisisSummaryForSurface(entry, s.name, 'cover'));
      expect(overview).toBe(crisisSummaryForSurface(entry, s.name, 'overview'));
      expect(tonight).toContain(crisisSummaryForSurface(entry, s.name, 'tonight'));
      expect(new Set([cover, overview, entry.summary]).size, `${kind}: no surface repeats another`).toBe(3);
    });
    expectNoSeedFailures(failures, 'every surface prints its own line of the crisis');
  });
});

// R3-CODE-C-3 (ROUND-3-CUT-INCREMENT #ww-15, #pf-85, #pf-667; CENSUS-2 c36): four lines presumed what their
// crisis kind does not guarantee (the file's own law: a line states only what its kind guarantees and names no
// force): a body that keeps order and guards the stores, merchants, streets. Reworded to what holds in a thorp with
// no watch and no market and in a metropolis alike. THE GUARD TOWNS are the readers' own, born in the app's shape.
describe('R3-CODE-C-3: a vantage promises no force, no merchant and no streets its kind does not', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const appShape = (seed) => {
    const m = seed.match(/^(?:rww|rpf)-(\w+)-([a-z_+]+)-(\d+)$/);
    const stresses = m[2] === 'calm' ? [] : m[2].split('+');
    return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} });
  };
  const linesOf = (s) => (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : [])
    .flatMap((e) => SURFACES.map((sf) => crisisSummaryForSurface(e, s.name, sf) || ''));
  it('the four lines, reworded', () => {
    expect(CRISIS_SUMMARY_POOLS.famine.defence.official).not.toMatch(/keep order|guard/i);
    expect(CRISIS_SUMMARY_POOLS.famine.tonight.watch).not.toMatch(/guard/i);
    expect(CRISIS_SUMMARY_POOLS.succession_void.tonight.trade).not.toMatch(/merchant/i);
    expect(CRISIS_SUMMARY_POOLS.politically_fractured.defence.local).not.toMatch(/streets?/i);
  });
  it('rww-thorp-calm-1 (a famine; nobody paid to keep order): no line guards its stores', () => {
    const s = appShape('rww-thorp-calm-1');
    expect(linesOf(s).filter((l) => /guarding the stores|under guard|the guards/i.test(l))).toEqual([]);
  });
  it('rpf-thorp-succession_void-13 (no market, no merchant): no line speaks of its merchants', () => {
    const s = appShape('rpf-thorp-succession_void-13');
    expect(linesOf(s).filter((l) => /merchant/i.test(l))).toEqual([]);
  });
});

// R3-CODE-C-5 (the third seat's "Found on the way", ruled by the chair as one rewording pass of the table): the same
// presumption in the table's other lines. "Those who keep order" and "everyone set to keep order" (a force), "the
// merchants" (a market's people) and "streets" (a size) are facts no crisis kind guarantees, and the call sites pass
// no roster, so every line is worded to what holds in a thorp with no force and no market and in a metropolis alike.
// The one line that keeps "keeping order" is the occupation's: its occupiers are the kind's own force. THE GUARD
// TOWNS are births the rewording was not tuned on (the lane's fresh seeds, the census's dials), each printing its
// family's false line at e2aa8e278.
describe('R3-CODE-C-5: no line of the table promises a force, a merchant or a street', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  /** @param {[string, object][]} sets @returns {[string, string][]} */
  const lines = (sets) => sets.flatMap(([kind, set]) => SURFACES.flatMap((sf) => Object.entries(set[sf]).map(([v, l]) => [`${kind}.${sf}.${v}`, l])));
  const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const born = (seed) => {
    const m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
    return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] }), null, { seed, customContent: {} });
  };
  const printed = (s) => (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : [])
    .flatMap((e) => SURFACES.map((sf) => crisisSummaryForSurface(e, s.name, sf) || ''));
  it('no line names a body that keeps order, but the occupation\'s own', () => {
    expect(lines(SETS).filter(([, l]) => /\bkeep(?:s|ing)? order\b/i.test(l)).map(([k]) => k)).toEqual(['occupied.defence.official']);
  });
  it('no line names a merchant', () => {
    expect(lines(SETS).filter(([, l]) => /\bmerchants?\b/i.test(l)).map(([k]) => k)).toEqual([]);
  });
  it('no line names a street', () => {
    expect(lines(SETS).filter(([, l]) => /\bstreets?\b/i.test(l)).map(([k]) => k)).toEqual([]);
  });
  it('r2s-slave_revolt-thorp-70 (a thorp of 12, no force): no line sets anyone to keep order', () => {
    const s = born('r2s-slave_revolt-thorp-70');
    const af = deriveArmedForces(s);
    expect([s.tier, af.standing.length + af.contracted.length]).toEqual(['thorp', 0]);
    expect(printed(s).filter((l) => /keep(?:s|ing)? order/i.test(l))).toEqual([]);
  });
  it('r2s-occupied-hamlet-70 (a hamlet of 47, no market): no line speaks of its merchants', () => {
    const s = born('r2s-occupied-hamlet-70');
    expect([s.tier, hasMarketInstitution(s.institutions)]).toEqual(['hamlet', false]);
    expect(printed(s).filter((l) => /merchant/i.test(l))).toEqual([]);
  });
  it('r2s-plague_onset-thorp-70 (a thorp of 26): no line speaks of its streets', () => {
    const s = born('r2s-plague_onset-thorp-70');
    expect(s.tier).toBe('thorp');
    expect(printed(s).filter((l) => /\bstreets?\b/i.test(l))).toEqual([]);
  });
  // The chair's ruling of 02:06Z: "Those who keep {name} safe" is the same presumption where no force stands.
  it('no line names people who keep the place safe', () => {
    expect(lines(SETS).filter(([, l]) => /\bkeeps? \S+ safe\b/i.test(l)).map(([k]) => k)).toEqual([]);
  });
  it('r2s-wartime-thorp-70 (a thorp of 29, no force): no line names its keepers', () => {
    const s = born('r2s-wartime-thorp-70');
    const af = deriveArmedForces(s);
    expect([s.tier, af.standing.length + af.contracted.length]).toEqual(['thorp', 0]);
    expect(printed(s).filter((l) => /\bkeeps? \S+ safe\b/i.test(l))).toEqual([]);
  });
});
