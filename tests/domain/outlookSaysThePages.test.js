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
import { deriveViability, outputChipBesideWord } from '../../src/domain/display/dossierViewModel.js';
import { bandForVariable } from '../../src/domain/causalState.js';
import { deriveDefenseReadiness } from '../../src/domain/display/defenseDisplay.js';

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
      if (/keeps order/.test(t)) expect(['critical', 'collapsed'], `${seed}: ${t}`).not.toContain(bandForVariable(s, 'law_order')); // anchored: the guard on this line holds the phrase present in `t`
      if (/pays its (?:own )?way/.test(t)) expect(LOW, `${seed}: ${t}`).not.toContain(eco.prosperity); // anchored: the guard on this line holds the phrase present in `t`
      if (/feeds itself|grows what it eats|has to come from outside/.test(t)) expect(Number(eco.foodSecurity.foodRecord.normalImportPct), `${seed}: ${t}`).toBe(0);
      expect(t, seed).not.toMatch(/only while [a-z]+ keep arriving/); // anchored: (a mass noun keeps arriving) `read` counts the verdicts, asserted below
    }));
    expect(read).toBe(seeds.length);
  });
});

describe('step 6: the glance chip and the Economic Survival colour', () => {
  test('#608: the reader\'s town prints the word alone; a town whose figure agrees keeps the chip', () => {
    const s = birth('rww-metropolis-infiltrated-1');
    expect(s.economicState.prosperity).toBe('Prosperous');
    expect(Math.round(s.economicState.compound.economyOutput)).toBeLessThan(35);
    expect(outputChipBesideWord(Math.round(s.economicState.compound.economyOutput), s.economicState.prosperity)).toBe(false);
    expect(outputChipBesideWord(55, 'Moderate')).toBe(true);
    expect(outputChipBesideWord(74, 'Poor')).toBe(false);
  });
  test('C-L7: the Economic Survival bar is coloured by the band its row prints', () => {
    const COLOR = { STRONG: '#1a4a2a', ADEQUATE: '#7a5010', WEAK: '#8b1a1a', CRITICAL: '#8b1a1a' };
    let edges = 0;
    expectNoSeedFailures(collectSeedFailures(seeds.slice(0, 40), (seed) => {
      const row = deriveDefenseReadiness(birth(seed)).find((r) => r.label === 'Economic Survival');
      if ((row.score >= 60 && row.score < 65) || (row.score >= 35 && row.score < 40)) edges++;
      expect(row.barColor, `${seed} ${row.score} ${row.status}`).toBe(COLOR[row.status]);
    }));
    expect(edges, 'scores between the old cuts and the band\'s were read (rv2-calm-thorp-3: 37, Weak)').toBeGreaterThan(0);
  });
  // UPKEEP-9 (the chair's ruling of 2026-11-14 01:30 on C-L7's other two bars): one home for a bar's colour is its own
  // band. Measured first on the 1,490 at 06818b064: the military bar disagreed with the band printed beside it in 94
  // births, the internal bar in 162 (scores from 35 to 39 and from 60 to 64). Red at 06818b064.
  test('C-L7: the Invasion & War and Internal Security bars are coloured by the band their rows print', () => {
    const COLOR = { STRONG: '#1a4a2a', ADEQUATE: '#7a5010', WEAK: '#8b1a1a', CRITICAL: '#8b1a1a' };
    const edges = { 'Invasion & War': 0, 'Internal Security': 0 };
    expectNoSeedFailures(collectSeedFailures(seeds, (seed) => {
      for (const row of deriveDefenseReadiness(birth(seed)).filter((r) => r.label in edges)) {
        if ((row.score >= 60 && row.score < 65) || (row.score >= 35 && row.score < 40)) edges[row.label] += 1;
        expect(row.barColor, `${seed} ${row.label} ${row.score} ${row.status}`).toBe(COLOR[row.status]);
      }
    }));
    expect(edges['Invasion & War'], 'military scores between the old cuts and the band\'s were read').toBeGreaterThan(0);
    expect(edges['Internal Security'], 'internal scores between the old cuts and the band\'s were read').toBeGreaterThan(0);
  });
});
