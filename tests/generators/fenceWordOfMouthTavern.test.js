/**
 * THE FENCE'S WORD-OF-MOUTH LINE NAMES A TAVERN ONLY WHERE ONE STANDS (R3-CODE-C-3; CENSUS-2 kind a,
 * `servicesGenerator.js` "Ask around at the right tavern.", 10 towns of the 720 at 9e57f5023, every one a
 * village with no inn, tavern or ale house on its roster, e.g. r2r-village-19).
 *
 * The line names a house, so it reads the roster (record 386): the estate's one reader of a standing
 * house, `facts/institutions.js :: hasInstitution(record, 'tavern')`. Where none stands, its twin, which
 * names no house, prints under the same branches beside the same "Fence (word of mouth)" row. No draw.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const TAVERN = 'Ask around at the right tavern. Someone moves goods without questions.';
const QUIET = 'Ask around quietly. Someone moves goods without questions.';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** The fence's word-of-mouth lines a born town stores. */
const fenceLines = (s) => (s.availableServices?.criminal || []).map((row) => row.desc).filter((d) => d === TAVERN || d === QUIET);

describe('the fence names a tavern only where one stands', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  // THE GUARD TOWN: the census's own birth (the 720's dials), a village of 102 under a siege, no tavern.
  it('r2r-village-55 (no inn, tavern or ale house): the twin, never the tavern', () => {
    const seed = 'r2r-village-55';
    const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: 'village' }), null, { seed, customContent: {} });
    expect((s.institutions || []).some((i) => /\btavern|\binns?\b|\bale ?house/i.test(String(i?.name)))).toBe(false);
    expect(fenceLines(s)).toEqual([QUIET]);
  });

  // anchored: the reader's town with a tavern keeps the tavern line
  it('rww-town-famine-1 (a tavern stands): the tavern line', () => {
    const seed = 'rww-town-famine-1';
    const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'town', selectedStressesRandom: false, selectedStresses: ['famine'], _randomizePriorities: true }), null, { seed, customContent: {} });
    expect(fenceLines(s)).toEqual([TAVERN]);
  });

  // THE CHAIR'S RULING (2026-11-13 23:40Z): a service never prints under the name of a house the roster does not
  // hold. 'Fence (word of mouth)' is a catalogue house; the fallback's row takes that name only where it stands, and
  // is otherwise "Fencing stolen goods" (a catalogue SERVICE name already, registered criminal; names no house).
  const fenceRows = (s) => (s.availableServices?.criminal || []).filter((row) => row.institution === '(covert)' && /^Fenc/.test(row.name));
  const born = (seed, settType) => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType }), null, { seed, customContent: {} });
  it('r2r-village-55 (no fence house): the row is "Fencing stolen goods"', () => {
    const s = born('r2r-village-55', 'village');
    expect((s.institutions || []).some((i) => i?.name === 'Fence (word of mouth)')).toBe(false);
    expect(fenceRows(s).map((r) => r.name)).toEqual(['Fencing stolen goods']);
  });
  it('r2r-town-15 (the fence house stands): the row keeps the house\'s name', () => {
    const s = born('r2r-town-15', 'town');
    expect((s.institutions || []).some((i) => i?.name === 'Fence (word of mouth)')).toBe(true);
    expect(fenceRows(s).map((r) => r.name)).toEqual(['Fence (word of mouth)']);
  });
});
