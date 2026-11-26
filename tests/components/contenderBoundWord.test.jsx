/**
 * @vitest-environment jsdom
 *
 * contenderBoundWord.test.jsx — D6 (WORDS-1; the tenth chair's ruling G7 of 2026-11-25, intake item 11, SCOPE-LINE decision 2):
 * THE CONTENDER's WORD. A power the page itself shows as BOUND to the ruler (its tie with the printed ruler, or with the
 * form whose seat that ruler holds, is dependent, symbiotic or subordinate) does not "contest" in the present tense: its
 * card reads "Could contend" and its roster marker "Could contest the seat". Any other contender keeps "Contender" and
 * "Contests the seat". The word only: no power's standing, seat, tie or order moves. Measured at 0ec96f13d
 * (`docs/chair/2026-11-24/tenth/gen/words-1/reports/D6.md`): pages changed C 502, V 452.
 * THE ORACLE reads the raw record's `powerStructure.factionRelationships`, never the strata's own flag.
 */
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { PowerStrata } from '../../src/components/new/tabs/power/PowerStrata.jsx';
import { derivePowerStrata } from '../../src/domain/dossier/powerStrata.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';

afterEach(cleanup);
const BOUND = new Set(['dependent', 'symbiotic', 'subordinate']);
/** dp-town-16 (C): ruler the Merchant Guilds holding the Guild Council's seat; the Guard symbiotic and the Religious
 * Authorities dependent (bound), the Craft Guilds tense (not bound) */
const SEED = 'dp-town-16';
/** @type {any} */ let town = null;
beforeAll(async () => {
  await loadGenerationLawPayloads();
  town = generateSettlementPipeline(birthConfig({ settType: 'town' }), null, { seed: SEED, customContent: {} });
}, 300000);

/** the raw record's verdict: is `name` bound to any of `rulers`? @param {string} name @param {string[]} rulers */
const boundInRecord = (name, rulers) => (town.powerStructure.factionRelationships || [])
  .some((/** @type {any} */ r) => Array.isArray(r.pair) && r.pair.includes(name) && rulers.some((x) => r.pair.includes(x)) && r.pair[0] !== r.pair[1] && BOUND.has(r.type));

describe('D6 · the contender\'s word', () => {
  it('each contender card and roster marker reads by its tie to the ruler (both words met)', () => {
    const { powers } = derivePowerStrata(town);
    const ruler = powers.find((p) => p.role === 'ruler');
    const rulers = [ruler.name, ruler.seatOf].filter(Boolean);
    const contenders = powers.filter((p) => p.role === 'contender');
    const verdicts = contenders.map((c) => boundInRecord(c.name, rulers));
    expect(verdicts, 'fixture premise: a bound contender and a free one').toContain(true);
    expect(verdicts).toContain(false);
    const { container } = render(<PowerStrata settlement={town} powerStructure={town.powerStructure} expandedFaction={null} setExpandedFaction={() => {}} focusIndex={-1} focusedRowRef={null} />);
    const text = container.textContent || '';
    contenders.forEach((c, k) => {
      const card = verdicts[k] ? `Could contend${c.name}` : `Contender${c.name}`;
      expect(text, c.name).toContain(card);
      const row = container.querySelector(`button[aria-label^="${c.name} "]`);
      expect(row?.textContent, c.name).toBe(verdicts[k] ? 'Could contest the seat' : 'Contests the seat');
    });
    expect(text.split('Could contest the seat').length - 1).toBe(verdicts.filter(Boolean).length);
    expect(text.split('Contests the seat').length - 1).toBe(verdicts.filter((v) => !v).length);
  });
});
