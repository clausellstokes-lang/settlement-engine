/**
 * hookTruth.test.js — THE STANDALONE CHECK (the chair's acceptance 5).
 *
 * `hookTruthFindings(settlement)` reads every hook the RECORD stores and says which of them
 * the record itself contradicts. The two arms that matter:
 *   - a record whose hooks are all true of it answers [];
 *   - a record with a 'starving' hook planted on a fed place answers at least one finding.
 *
 * The planted arm is the one that keeps this instrument honest. The collector's truth gate
 * refuses a false hook at the page, so a check that read the PAGE would answer [] by
 * construction and prove nothing; this one reads the engine's own stored text, which is
 * where a writer's debt lives.
 */
import { describe, expect, test } from 'vitest';

import { FOOD_SECURITY_BANDS } from '../../../src/data/bandLadders.js';
import { hookTruthViolations, settlementHookFacts } from '../../../src/domain/coherence/hookTruth.js';
import { hookTruthFindings, renderedHookTruthFindings } from '../../../src/domain/coherence/hookTruthFindings.js';

const STARVING = 'The settlement is starving. Villagers are turning to banditry, and a merchant has offered to supply food at a price the settlement cannot pay in coin.';

/** @param {{ tier?: string, band?: string, months?: number, hooks?: string[] }} spec */
function record(spec) {
  return {
    name: 'Testholm',
    tier: spec.tier || 'village',
    economicState: {
      foodSecurity: { label: spec.band || 'Secure', storageMonths: spec.months === undefined ? 12 : spec.months },
    },
    defenseProfile: { institutions: { garrison: [{ name: 'Barracks' }], walls: [{ name: 'Town walls' }], watch: [{ name: 'Watch house' }] } },
    institutions: [{ name: 'Hospital' }],
    config: { magicExists: true, priorityMagic: 55 },
    economicViability: { plotHooks: (spec.hooks || []).map((hook) => ({ hook, severity: 'high' })) },
  };
}

describe('hookTruthFindings — the record is read, not the page', () => {
  test('a record whose hooks are true of it answers nothing', () => {
    const findings = hookTruthFindings(record({
      hooks: ['The miller and the smith have stopped speaking, and the whole place is taking sides.'],
    }));
    expect(findings).toEqual([]);
  });

  test('a starving hook planted on a fed record is found', () => {
    const findings = hookTruthFindings(record({ band: 'Secure', months: 12, hooks: [STARVING] }));
    expect(findings.length).toBeGreaterThanOrEqual(1);
    expect(findings.map((f) => f.code)).toContain('famine_words_on_a_fed_place');
    expect(findings[0].detail).toContain('Secure');
  });

  test('the same planted hook never reaches the page', () => {
    const planted = record({ band: 'Secure', months: 12, hooks: [STARVING] });
    expect(hookTruthFindings(planted).length).toBeGreaterThanOrEqual(1);
    expect(renderedHookTruthFindings(planted)).toEqual([]);
  });

  test('a famine with empty granaries is not a finding', () => {
    expect(hookTruthFindings(record({ band: FOOD_SECURITY_BANDS.famine.label, months: 0.5, hooks: [STARVING] }))).toEqual([]);
  });

  test('the stored-months floor is the band, not the corpus: 1.9 months of Import-Dependent is a finding', () => {
    const findings = hookTruthFindings(record({ tier: 'thorp', band: 'Import-Dependent', months: 1.9, hooks: [STARVING] }));
    expect(findings.map((f) => f.code)).toContain('famine_words_on_a_fed_place');
  });

  test('a hook stored on an NPC is read too', () => {
    const settlement = {
      ...record({ band: 'Secure' }),
      npcs: [{ name: 'Alda', plotHooks: [STARVING] }],
    };
    expect(hookTruthFindings(settlement).map((f) => f.code)).toContain('famine_words_on_a_fed_place');
  });
});

describe('settlementHookFacts — a fact the record does not carry licenses nothing', () => {
  test('an empty record contradicts nothing', () => {
    const facts = settlementHookFacts({});
    expect(facts.foodKnown).toBe(false);
    expect(hookTruthViolations(STARVING, facts)).toEqual([]);
  });

  test('a record with no defence roster does not deny a garrison', () => {
    const facts = settlementHookFacts({ tier: 'town', economicState: { foodSecurity: { label: 'Secure', storageMonths: 9 } } });
    expect(facts.defenseKnown).toBe(false);
    const findings = hookTruthViolations('The garrison has not been paid in two months.', facts);
    expect(findings).toEqual([]);
  });

  test('a record with a roster and no force denies one', () => {
    const facts = settlementHookFacts({ tier: 'village', defenseProfile: { institutions: { garrison: [], militia: [] } } });
    expect(facts.hasArmedForce).toBe(false);
    expect(hookTruthViolations('The garrison has not been paid in two months.', facts).map((f) => f.code))
      .toContain('armed_force_without_one');
  });

  test('a garrison the world pulse ruined is no garrison, though the birth roster still lists it', () => {
    const record = {
      tier: 'town',
      institutions: [
        { name: 'Garrison', category: 'Defense', status: 'ruined' },
        { name: 'Town watch', category: 'Defense' },
      ],
      defenseProfile: { institutions: { garrison: ['Garrison'], watch: ['Town watch'] } },
    };
    const facts = settlementHookFacts(record);
    expect(facts.hasGarrison).toBe(false);
    expect(facts.hasWatch).toBe(true);
    expect(hookTruthViolations('The garrison has not been paid in two months.', facts).map((f) => f.code))
      .toContain('armed_force_without_one');
  });

  // R3-CODE-C-2, ROUND-3-CUT-INCREMENT #ww-4 (HIGH, rww-thorp-calm-1, Summary/Plot Hooks): re-keyed by
  // identity (the walls arm on the sealed-walls hook) with its cause, the chair's ruling of
  // 2026-11-13 (record 386: a hook that names walls reads the roster). It pinned the opposite
  // ("a building's walls are not the settlement's walls"); the reader read the hook in a thorp
  // whose page says "Unfortified. No perimeter walls." and found it false.
  test("'inside the walls' is the place's walls; 'inside the walls of' a building is that building's", () => {
    const facts = settlementHookFacts({ tier: 'thorp', defenseProfile: { institutions: { walls: [] } } });
    expect(hookTruthViolations('Something was sealed inside the walls during construction, deliberately', facts).map((f) => f.code))
      .toEqual(['walls_without_walls']);
    // anchored: the same reader passes a building's walls, and the walled place's hook
    expect(hookTruthViolations('Something was sealed inside the walls of the old chapel, deliberately', facts)).toEqual([]);
    const walled = settlementHookFacts({ tier: 'thorp', institutions: [{ name: 'Palisade', category: 'Defense' }], defenseProfile: { institutions: { walls: ['Palisade'] } } });
    expect(walled.hasWalls).toBe(true);
    expect(hookTruthViolations('Something was sealed inside the walls during construction, deliberately', walled)).toEqual([]);
    expect(hookTruthViolations('The town walls have a gap nobody will admit to leaving.', facts).map((f) => f.code))
      .toContain('walls_without_walls');
  });

  test('the stored figure is measured against the store', () => {
    const facts = settlementHookFacts(record({ band: 'Deficit', months: 15 }));
    expect(hookTruthViolations('The settlement has 12 days of reserves, and nothing enters or leaves.', facts).map((f) => f.code))
      .toContain('stored_days_contradict_the_store');
    const right = hookTruthViolations('The settlement has 450 days of reserves, and nothing enters or leaves.', facts);
    expect(right).toEqual([]);
  });
});
