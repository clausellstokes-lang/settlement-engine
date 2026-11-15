/**
 * tests/generators/tailDefeconBatch3Lines.test.js — TAIL-DEFECON-3 batch 3 (2026-11-15; the fish and quarry lines of
 * `incomeLineSiblings.js :: trueIncomeDesc`, `docs/chair/2026-11-14/tail/TAIL-DEFECON-HANDBACK.md`): under a famine whose
 * failed source is fish no income line offers fish; where every fishery near the place is fished out the catch is not
 * landed (the salted fish bought in, or no sentence: D5, #77); the quarry sells to regional builders only where the place
 * sells stone; the entrepôt's duties and fees only where a house of transit stands; international commerce under a
 * siege prints its label and share alone; the iron hooks only where the import list holds iron (D8, #20893); the banks' "little trade" only
 * where the export list is short, and the craft advice names only the crafts the roster lacks; an inland harbour master regulates no port; and (D2, #10700) "Highly diversified" only where the income mix's own leaf reads a broad spread. Each GONE pair is a census town (the 720's configuration) that printed the line where its own record
 * makes it false, red at the base, and names what prints instead, or that the slot is silent by design. Each KEEP pair
 * is a town where the original is true, and still prints it.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { deriveEconomicComplexity } from '../../src/generators/economy/prosperity.js';
import { incomeMixPoolKey } from '../../src/domain/display/stateProse/economyStateProse.js';

// The census's 720 configuration (SECOND-WAVE-CENSUS births.mjs): every random dial on.
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
function censusBirth(seed) {
  let m = seed.match(/^r2r-(\w+)-(\d+)$/);
  if (m) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] }), null, { seed, customContent: {} });
  m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] }), null, { seed, customContent: {} });
}
/** Every income row as the Economics tab, the PDF and the journal print it: the source, then its line. */
const incomeText = (s) => [...(s.economicState?.incomeSources ?? []).map((e) => `${e.source} :: ${e.desc ?? ''}`), `Economic complexity :: ${s.economicState?.economicComplexity ?? ''}`, `Viability :: ${JSON.stringify(s.economicViability ?? null)}`, ...(s.institutions ?? []).map((i) => `${i.name} :: ${i.desc ?? ''}`)].join('\n');

const SILENT = null;
/** [row, seed, the text that must NOT print, what prints instead (SILENT: the row prints its label and share alone, or no hook stands in the slot)] */
const GONE = [
  ['B07355', 'r2s-famine-hamlet-0', 'Catch landed and sold fresh or preserved', SILENT],
  ['B07356', 'r2s-famine-hamlet-2', 'Catch landed here and sold fresh or preserved', SILENT],
  ['B07361', 'r2s-famine-city-0', 'Fish is sold here, fresh or preserved', SILENT],
  ['B07357', 'r2r-hamlet-10', 'Catch landed here and sold fresh or preserved', SILENT],
  ['B07361', 'r2r-town-3', 'Fish is sold here, fresh or preserved', 'The fishery here is fished out; the fish sold now is salted and bought in.'],
  ['18655', 'r2s-succession_void-hamlet-0', 'provides dressed stone to regional builders', "Stone Quarrying :: Stone is quarried here for the place's own building."],
  ['07231', 'r2r-village-9', 'Transit duties, warehouse fees', 'Entrepôt Trade :: Goods passing through the crossroads, and what their traders spend while they stop.'],
  ['11808', 'r2s-under_siege-metropolis-1', 'Revenue from international trade', 'International Commerce :: '],
  ['20893', 'r2r-hamlet-30', 'The iron carts are three weeks late', SILENT],
  ['20893', 'r2r-city-36', 'A new toll on the iron road', SILENT],
  ['04271', 'r2s-infiltrated-metropolis-3', 'does little trade', SILENT],
  ['B04151', 'r2s-politically_fractured-city-0', 'Its banks find little business to do', SILENT],
  ['30890', 'r2s-politically_fractured-city-2', 'Add craft guilds: smiths', 'Add craft guilds: weavers, etc.'],
  ['16403', 'r2r-metropolis-9', 'Regulates port and airship traffic', "Harbour master's office :: Regulates airship traffic, assigns mooring berths, collects anchorage fees."],
  ['10700', 'r2r-city-0', 'Highly diversified', 'Economic complexity :: Diversified — broad institutional economic base'],
];
/** [row, seed, a true sibling that must still print] */
const KEEP = [
  ['B07361', 'r2r-town-15', 'Fish & Preserved Produce :: Fish is sold here, fresh or preserved.'],
  ['B07356', 'r2r-thorp-43', 'Fish & Maritime Produce :: Catch landed here and sold fresh or preserved.'],
  ['B07355', 'r2r-thorp-22', 'Fish & Maritime Produce :: Catch landed and sold fresh or preserved; salt fish are a major regional export commodity.'],
  ['18655', 'r2r-village-4', 'Stone Quarrying :: Local quarry provides dressed stone to regional builders'],
  ['07231', 'r2r-town-13', 'Entrepôt Trade :: Transit duties, warehouse fees, and re-export premiums from goods passing through the crossroads.'],
  ['11808', 'r2r-metropolis-10', 'International Commerce :: Revenue from international trade: licensing fees, currency exchange, and commodity brokerage.'],
  ['20893', 'r2r-town-1', 'The iron carts are three weeks late'],
  ['10700', 'r2r-city-18', 'Economic complexity :: Highly diversified — multiple major revenue streams'],
];

const towns = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...GONE, ...KEEP].map((r) => r[1]))) towns[seed] = incomeText(censusBirth(seed));
}, 300_000);

describe('TAIL-DEFECON-3 batch 3: the fish, quarry and diversity lines say only what the record holds', () => {
  for (const [row, seed, gone, instead] of GONE) {
    test(`#${row} ${seed}: not "${gone}"; ${instead === SILENT ? 'silent by design' : `"${instead}"`}`, () => {
      expect(towns[seed]).not.toContain(gone);
      if (instead !== SILENT) expect(towns[seed]).toContain(instead);
    });
  }
  for (const [row, seed, kept] of KEEP) {
    test(`#${row} ${seed} keeps "${kept}"`, () => expect(towns[seed]).toContain(kept));
  }
});

describe('ONE HOME (D2, #10700): "Highly diversified" agrees with the income mix\'s own reading', () => {
  test.each([[5], [15], [19], [20], [35], [49], [50], [80]])('a leader of %i%%', (lead) => {
    const rows = [{ percentage: lead }, ...Array.from({ length: 9 }, () => ({ percentage: 5 }))];
    const highly = deriveEconomicComplexity('city', rows.length, 3, true, null, rows).startsWith('Highly diversified');
    expect(highly).toBe(incomeMixPoolKey(rows) === 'INCOME MIX: a broad spread, no leader');
  });
});
