/**
 * outlookSaysThePages.test.js — UPKEEP-8, steps 5 and 6 (2026-11-13).
 *
 * STEP 5 (the round-three cut's #228 #253 #326 #379; the increment's #ww-567 #ww-717 #ww-1541). THE CHAIR'S RULING: the
 * Outlook says only what the town's own pages say: not "keeps order" where law and order reads critical; not "pays its
 * way" where the town is poor and earns less than it spends; not "grows what it eats" or "feeds itself" where it buys
 * its food or lists critical imports. The seed's variant stands where it is true; else the next true one; else one twin.
 *
 * STEP 6: #608, the Economics glance's Output chip prints beside the prosperity word only where the two do not stand two
 * bands apart; C-L7, the Economic Survival bar's colour reads the band its row prints.
 * Red at the lane's base (995293e81).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { deriveViability } from '../../src/domain/display/dossierViewModel.js';
import { bandForVariable } from '../../src/domain/causalState.js';

beforeAll(async () => { await loadGenerationLawPayloads(); });

/** The readers' shapes: rv2-<crisis|calm>-<size>-<i> (the app's), rww-<size>-<crisis|calm>-<i> (random dials). */
function cfgFor(seed) {
  let m = /^rv2-([a-z_+]+)-(\w+)-\d+$/.exec(seed);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, settType: m[2], selectedStresses: m[1] === 'calm' ? [] : m[1].split('+'), selectedStressesRandom: false });
  m = /^rww-(\w+?)-([a-z_+]+)-(\d+)$/.exec(seed);
  return birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true });
}
const birth = (seed) => generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
const LOW = ['Subsistence', 'Struggling', 'Poor'];

const seeds = ['thorp', 'hamlet', 'village', 'town', 'city'].flatMap((t) => Array.from({ length: 12 }, (_, i) => `rv2-calm-${t}-${i}`));

describe('step 5: the Outlook says what the pages say', () => {
  test('the readers\' towns (#326 #ww-1541 #ww-567 #ww-717): no self-sufficiency beside marked imports or bought food', () => {
    for (const seed of ['rww-hamlet-calm-1', 'rww-hamlet-succession_void-1', 'rww-thorp-monster_pressure-1']) {
      const t = deriveViability(birth(seed)).summary;
      expect(t, seed).toMatch(/^VIABLE/);
      expect(t, seed).not.toMatch(/grows what it eats and makes what it needs|has to come from outside/); // anchored: the verdict asserted on the line above
    }
  });
  test('the law, over births of every size', () => {
    let read = 0;
    expectNoSeedFailures(collectSeedFailures(seeds, (seed) => {
      const s = birth(seed); const t = String(deriveViability(s).summary); const eco = s.economicState; read++;
      if (/keeps order/.test(t)) expect(['critical', 'collapsed'], `${seed}: ${t}`).not.toContain(bandForVariable(s, 'law_order'));
      if (/pays its (?:own )?way/.test(t)) expect(LOW, `${seed}: ${t}`).not.toContain(eco.prosperity);
      if (/feeds itself|grows what it eats|has to come from outside/.test(t)) expect(Number(eco.foodSecurity.foodRecord.normalImportPct), `${seed}: ${t}`).toBe(0);
      expect(t, seed).not.toMatch(/only while [a-z]+ keep arriving/); // a mass noun keeps arriving; anchored: `read` counts the verdicts, asserted below
    }));
    expect(read).toBe(seeds.length);
  });
});
