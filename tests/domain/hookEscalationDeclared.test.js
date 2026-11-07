/**
 * HOOK_ESCALATION declares what it presumes (CENSUS-2c unit 3; `docs/DESIGN_POOL_CENSUS.md` §3.3
 * kind A; the ledger `docs/census/declarations/HOOK_ESCALATION.json`). The consequence lists and the
 * clock stages print whole, so there is no draw to protect: a declared line the record refuses is
 * replaced IN PLACE by its twin (a clock keeps its six stages) or, with no twin, leaves the list.
 * The originals stay strings; the declarations sit beside them (`HOOK_ESCALATION_SIBLINGS`, keyed by
 * the original text, CENSUS-1c's dissolved-twin shape). With no settlement in hand every line is
 * kept, byte-identical.
 */
import { describe, it, expect } from 'vitest';
import { deriveStructuredHook, HOOK_ESCALATION_SIBLINGS, spokenEscalationLines } from '../../src/domain/hookEscalation.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';

const BREAD = ['Flour prices rise.', 'Bakers reduce loaves.', 'Workers accuse {controller} of hoarding.', 'The temple opens emergency stores.', 'The council sends the watch to guard warehouses.', 'Riot breaks out in the market.'];
const BARE = factsOf({ tier: 'village', institutions: [{ name: 'Granary' }], economicState: { foodSecurity: { foodRecord: { storageMonths: 0 } } } });

describe('HOOK_ESCALATION: refused lines take their twins in place, or leave the list', () => {
  it('a place with no temple, council, watch or market keeps six bread-riot stages, the three refused ones by their twins', () => {
    expect(spokenEscalationLines(BREAD, BARE)).toEqual([
      'Flour prices rise.', 'Bakers reduce loaves.', 'Workers accuse {controller} of hoarding.',
      'Households begin pooling what food they have.', 'Those who hold the stores start sleeping beside them.',
      'A crowd gathers where the food is handed out, and it turns ugly.',
    ]);
  });
  it('the magic-free twin answers the external confrontation where magic does not work', () => {
    const hook = deriveStructuredHook('Raiders burn the outlying farms.', { name: 'Avel', tier: 'village', institutions: [], config: { magicExists: false, priorityMagic: 0 } });
    expect(hook.origin).toBe('external');
    expect(hook.possibleResolutions[0]).toBe('Confront the external force directly, by arms or by talks.');
  });
  it('a line with no twin leaves the list when refused (no stores: no hoarded reserves to release)', () => {
    const lines = ['Negotiate an emergency supply contract with a neighbouring settlement.', 'Expose hoarding and force the controller to release reserves.'];
    expect(spokenEscalationLines(lines, BARE)).toEqual([lines[0]]);
  });
  it('with no facts every line is kept (byte-identical)', () => {
    expect(spokenEscalationLines(BREAD, null)).toEqual(BREAD);
    expect(deriveStructuredHook('Raiders burn the outlying farms.').possibleResolutions[0]).toBe('Confront the external force directly (combat, diplomacy, magic).');
  });
  it('every sibling set is keyed by its original, which is a printed line', () => {
    for (const [key, set] of Object.entries(HOOK_ESCALATION_SIBLINGS)) {
      expect(set[0].text).toBe(key);
      for (const twin of set.slice(1)) expect(twin.twinOf).toBe(key);
    }
    expect(Object.keys(HOOK_ESCALATION_SIBLINGS)).toHaveLength(9);
  });
});
