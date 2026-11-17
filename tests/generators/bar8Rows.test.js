// THE GUARD OF BAR8-J-ROWS (BRIEF-BAR8, seat J-ROWS, 2026-11-17): G1, THE GENERAL GAP LINE BESIDE THE SUPPLY STORY'S OWN.
// The Resources tab printed "No iron ore reaches the mine." beside "The mine is worked out: its own ground is depleted (…)",
// "No clay reaches the potter." beside "The potter stands abandoned, …": two lines for one house and one material, and for a
// source house the general line misstates the work (the mine digs its ore). THE CURE IS A READING AT PRINT
// (`validationOnPage.js :: resourceGapLines`): where the house's own story line is printed, the general line does not name
// that material; a gap row with no story line keeps the general line, and no town loses its only gap line. The page's
// marks ("Short of stone.", the venture's mark) do not move: the mark's own reading of one house keeps the general line.
// The towns are the 150's (`docs/chair/2026-11-17/birth/birth3/seeds.w150.txt`) where the base printed the pair (auditor J's
// rule 11g), each beside a negative of the same town or kind. The counts over the thirty, the 150 and the 720 are in
// docs/chair/2026-11-17/bar8/BAR8-J-ROWS-HANDBACK.md. Items 1 and 2 of the seat's section are left by name there.
import { beforeAll, describe, expect, it } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { resourceGapLines } from '../../src/domain/display/validationOnPage.js';
import { housesShortOfInput } from '../../src/domain/display/crisisStoppedRow.js';
import { STORY_OF_RECORD } from '../../src/domain/facts/supplyStory.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { projectShareVeil } from '../../src/domain/display/galleryVeil.js';

/** The towns, with the house whose story line the base doubled and the general line that must stay (a row with no story). */
const TOWNS = Object.freeze({
  'bar0-hamlet-under_siege-rand-37': { house: "hunter's lodge", story: 'is worked out' },
  'bar0-metropolis-calm-rand-32': { house: 'mine', story: 'is worked out' },
  'bar0-metropolis-calm-rand-29': { house: 'mine', story: 'is worked out', keeps: 'No clay reaches the potter.' },
  'bar0-town-calm-rand-32': { house: 'potter', story: 'stands abandoned' },
  'bar0-village-calm-rand-40': { house: 'sawmill', story: 'stands abandoned' },
  'bar0-town-calm-rand-29': { house: null, keeps: 'No clay reaches the potter.' },
  // a worked-out peat cutter: its marsh yields reeds, and the page's mark reads "peat" off the general line in its own reading
  'r2r-hamlet-49': { house: 'peat cutter', story: 'is worked out' },
});

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
/** CENSUS-3 seedcfg.mjs's census and bar arms, verbatim in shape (as `bar7Lines.test.js` reads them). @param {string} seed */
function configOf(seed) {
  const c = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
  if (c) return { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded', settType: c[1] };
  const m = seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-(\\d+)$`));
  if (!m) throw new Error(`a guard seed is a census or a read seed: ${seed}`);
  const st = m[2] === 'calm' ? [] : m[2].split('+'); const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return { ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true };
}

const GENERAL = /^No (.+?) reach(?:es)? the (.+?)\.$/;
/** Every general gap line printed for a house whose own story line is printed too. @param {string[]} lines */
export function doubledGapLines(lines) {
  const out = [];
  for (const line of lines) {
    const m = GENERAL.exec(line);
    if (!m) continue;
    const cap = `The ${m[2]}`;
    const own = lines.find((l) => l.startsWith(`${cap} is worked out:`) || l.startsWith(`${cap} is failing:`) || l.startsWith(`${cap} stands abandoned`));
    if (own) out.push(`${line} | ${own}`);
  }
  return out;
}

/** @type {Map<string, any>} */
const BORN = new Map();
beforeAll(async () => {
  const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  await boundary.loadGenerationLawPayloads();
  for (const seed of Object.keys(TOWNS)) BORN.set(seed, generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }), null, { seed, customContent: {} }));
}, 600000);

describe('BAR8-J-ROWS G1: one house, one material, one gap line', () => {
  it('the detector fires on the pair as the base printed it, and not on a lone general line', () => {
    expect(doubledGapLines(['No iron ore reaches the mine.', 'The mine is worked out: its own ground is depleted (Iron ore deposits).'])).toHaveLength(1);
    expect(doubledGapLines(['No clay reaches the potter.', 'The potter stands abandoned, a venture of an earlier time: no clay lies near and none is brought in.'])).toHaveLength(1);
    // anchored: a literal list built here, its positive twin asserted on the line above
    expect(doubledGapLines(['No clay reaches the potter.', 'No grapes reach the vintner.'])).toEqual([]);
  });

  it('no town prints the general line beside the story line of the same house; the story line still prints', () => {
    expectNoSeedFailures(collectSeedFailures([...BORN], ([seed, town]) => {
      const lines = resourceGapLines(town).map((l) => l.impact);
      expect(doubledGapLines(lines), `${seed}: one house, one material, one line`).toEqual([]);
      const want = TOWNS[/** @type {keyof typeof TOWNS} */ (seed)];
      if (want.house) {
        const story = `The ${want.house} ${want.story}`;
        const general = lines.find((l) => GENERAL.exec(l)?.[2] === want.house);
        expect(lines.some((l) => l.startsWith(story)), `${seed}: "${story} …" prints`).toBe(true);
        expect(general, `${seed}: no general line for the ${want.house}`).toBeUndefined();
      }
      expect(lines.length, `${seed}: the town keeps a gap line`).toBeGreaterThan(0);
    }), 'no general line beside the story line of the same house');
  });

  it('a gap row with no story line keeps the general line', () => {
    expectNoSeedFailures(collectSeedFailures(Object.entries(TOWNS).filter(([, want]) => !!want.keeps), ([seed, want]) => {
      const lines = resourceGapLines(BORN.get(seed)).map((l) => l.impact);
      expect(lines, `${seed}`).toContain(want.keeps);
    }), 'a row with no story line keeps its general line');
    const lines = resourceGapLines(BORN.get('bar0-metropolis-calm-rand-29')).map((l) => l.impact);
    expectAbsentWithAnchor(lines, 'No coal reaches the mine.', 'No clay reaches the potter.');
    expect(housesShortOfInput(BORN.get('r2r-hamlet-49')).get('Peat cutter'), 'the worked-out peat cutter\'s mark keeps its peat').toBe('peat');
  });

  it('the mark\'s own reading of one house (its record under STORY_OF_RECORD) keeps the general line it reads its noun off', () => {
    const town = BORN.get('r2r-hamlet-49');
    const own = town.resourceAnalysis.gaps.filter((/** @type {{ institution?: unknown }} */ g) => g?.institution === 'Peat cutter');
    const alone = resourceGapLines({ ...town, resourceAnalysis: { ...town.resourceAnalysis, gaps: own }, [STORY_OF_RECORD]: town }).map((l) => l.impact);
    expect(alone[0]).toBe('No peat reaches the peat cutter.');
    expect(alone.some((l) => l.startsWith('The peat cutter is worked out:'))).toBe(true);
    expectAbsentWithAnchor(resourceGapLines(town).map((l) => l.impact), 'No peat reaches the peat cutter.', alone[1]);
  });

  it('the page\'s mark still reads every house the story line tells of', () => {
    expectNoSeedFailures(collectSeedFailures(Object.entries(TOWNS).filter(([, want]) => !!want.house), ([seed, want]) => {
      const short = housesShortOfInput(BORN.get(seed));
      const name = [...short.keys()].find((k) => k.toLowerCase().startsWith(String(want.house)));
      expect(name, `${seed}: the ${want.house} is still marked short`).toBeTruthy();
    }), 'the mark still reads every house the story line tells of');
  });

  it('N4: the owner\'s page, the public projection and the share veil print the same gap lines', () => {
    expectNoSeedFailures(collectSeedFailures([...BORN], ([seed, town]) => {
      const own = resourceGapLines(structuredClone(town)).map((l) => l.impact);
      expect(own.length, `${seed}: a gap line prints`).toBeGreaterThan(0);
      expect(resourceGapLines(toPublicSafe(structuredClone(town))).map((l) => l.impact), `${seed}: public`).toEqual(own);
      expect(resourceGapLines(projectShareVeil(toPublicSafe(structuredClone(town)), null)).map((l) => l.impact), `${seed}: veil`).toEqual(own);
    }), 'N4: the owner\'s page, the public projection and the share veil alike');
  });
});
