/**
 * tests/domain/healingLedger.test.js — P3.3b Stage 4.
 *
 * One canonical healing classifier, previously copy-pasted byte-identical in three lenses
 * (capacityModel.deriveHealing, causalState.deriveHealingCapacity, magicProfile). Pin: the
 * ledger counts healing-capable institutions by name, surfaces the (Stage-4b) availableServices
 * list, and — routed into the two scored lenses — preserves their counts exactly (the disease
 * pressure that reads healing_capacity must not move).
 */

import { describe, it, expect } from 'vitest';
import {
  healingLedger, BURIAL_INSTITUTION_PATTERN, HEALING_INSTITUTION_PATTERN,
} from '../../src/domain/healingLedger.js';
import { deriveCapacityProfile } from '../../src/domain/capacityModel.js';
import { deriveSystemVariable } from '../../src/domain/causalState.js';

const town = (names) => ({
  name: 'T', tier: 'town', population: 2000, config: { monsterThreat: 'safe' },
  institutions: names.map((n, i) => ({ id: `i${i}`, name: n })),
  powerStructure: { factions: [] }, activeConditions: [],
});

describe('healingLedger', () => {
  it('counts institutions whose name reads as healing-capable', () => {
    expect(healingLedger(town(['Temple of Light', 'Apothecary', 'Hospice'])).healerCount).toBe(3);
    expect(healingLedger(town(['Blacksmith', 'Market'])).healerCount).toBe(0);
    expect(healingLedger(town(['Healer\'s Lodge'])).healerCount).toBe(1);
  });

  it('surfaces availableServices.healing when present (for Stage 4b)', () => {
    const s = { institutions: [], economicState: { availableServices: { healing: ['Disease treatment'] } } };
    expect(healingLedger(s).services).toEqual(['Disease treatment']);
  });

  it('is safe for null / partial settlements', () => {
    expect(healingLedger(null).healerCount).toBe(0);
    expect(healingLedger(null).services).toEqual([]);
    expect(healingLedger({}).present).toBe(false);
    expect(healingLedger({ institutions: [] }).present).toBe(true);
  });

  it('the exported pattern is the single classifier', () => {
    expect(HEALING_INSTITUTION_PATTERN.test('Riverside Infirmary')).toBe(true);
    expect(HEALING_INSTITUTION_PATTERN.test('Town Granary')).toBe(false);
  });
});

// Both scored lenses now count via the one ledger; more healers -> more capacity/score. The
// banding is unchanged, so this is behaviour-preserving (the regex/count is identical to before).
describe('healing lenses count via the canonical ledger (P3.3b Stage 4)', () => {
  it('capacity supply and causal healing_capacity both rise with healer count', () => {
    const lean = town([]);
    const rich = town(['Temple', 'Infirmary', 'Apothecary']);
    expect(deriveCapacityProfile('healing', rich).supply)
      .toBeGreaterThan(deriveCapacityProfile('healing', lean).supply);
    expect(deriveSystemVariable('healing_capacity', rich).score)
      .toBeGreaterThan(deriveSystemVariable('healing_capacity', lean).score);
  });
});

// P3.3b Stage 4b: a town offering healing SERVICES but with no healer-named institution is not
// "no healing" — the services rescue the harsh absent penalty (informal care), reading above a
// truly-bare town but below one with a dedicated institution.
describe('healing services rescue the absent penalty (P3.3b Stage 4b)', () => {
  const servicesOnly = {
    name: 'T', tier: 'town', population: 2000, config: { monsterThreat: 'safe' },
    institutions: [], // no healer-named institution -> healerCount 0
    economicState: { availableServices: { healing: ['Basic wound care', 'Medical care (basic)', 'Poor relief'] } },
    powerStructure: { factions: [] }, activeConditions: [],
  };
  const bare = town([]); // no institutions, no services

  it('services-only town reads higher healing supply than a truly-bare town', () => {
    expect(deriveCapacityProfile('healing', servicesOnly).supply)
      .toBeGreaterThan(deriveCapacityProfile('healing', bare).supply);
  });

  it('services-only town reads higher causal healing_capacity than a truly-bare town', () => {
    expect(deriveSystemVariable('healing_capacity', servicesOnly).score)
      .toBeGreaterThan(deriveSystemVariable('healing_capacity', bare).score);
  });

  it('but still below a town with a dedicated healing institution', () => {
    const withInst = town(['Infirmary']);
    expect(deriveCapacityProfile('healing', servicesOnly).supply)
      .toBeLessThan(deriveCapacityProfile('healing', withInst).supply);
  });
});


// ── E-RES-11 (§782.4) — A GRAVEYARD IS NOT INFORMAL CARE ──────────────────────────────────
//
// ⚠ DECLARED SHIFT, T7 · HYGIENE (car TE-UNITS-1). The burial tier ladder (§708.5) gave every
// tier a burial house; `serviceCategoryTables` files every burial menu under `healing`
// (correctly — that table answers DOMAIN, and the whole religious block answers healing); and
// both healing derivers rescued the harsh "absent" penalty on the bucket being NON-EMPTY. So
// the rescue went near-universal and the -10 penalty became UNREACHABLE.
//
// MEASURED, 1,680 real settlements from `generateSettlementPipeline` (6 tiers x 8 cultures x
// 7 terrains x 5 routes), before the cure:
//     broad 372 · limited 797 · services_only 511 · ABSENT 0
//   Of the 511 rescues, 24 — every one a THORP — were carried by BURIAL SERVICES ALONE.
// After the cure those 24 fall to `absent`: the branch fires on 1.43% of the corpus instead of
// 0.00%, and the alarm it exists to raise can raise again. The other 487 rescues are genuine
// informal care (parish church 786 entries, midwife 40, bathhouse, foundling home) and do not
// move. Nothing on the generation path reads these derivers, so the 525-row generator golden
// master is unaffected — verified, not assumed.
describe('careServices: burial is domain-healing but NOT healing capacity (E-RES-11)', () => {
  const withHealingServices = (entries) => ({
    name: 'T', tier: 'thorp', population: 40, config: { monsterThreat: 'safe' },
    institutions: [], // healerCount 0 — the rescue branch is the one under test
    economicState: { availableServices: { healing: entries } },
    powerStructure: { factions: [] }, activeConditions: [],
  });
  const burialOnly = withHealingServices([
    { name: 'Burial', institution: 'Burial ground' },
    { name: 'Grave marking', institution: 'Burial ground' },
  ]);
  const parish = withHealingServices([
    { name: 'Life ceremonies', institution: 'Access to parish church' },
  ]);

  it('the burial pattern covers the catalog ladder and no care house', () => {
    for (const house of ['Graveyard', 'Burial ground', 'Parish burial grounds',
      'Burial grounds and charnel house', 'Cemetery network']) {
      expect(BURIAL_INSTITUTION_PATTERN.test(house), `${house} must read as burial`).toBe(true);
    }
    for (const house of ['Parish church', 'Access to parish church', 'Midwife', 'Apothecary',
      'Almshouse', 'Small hospital', 'Foundling home', 'Public bathhouse', 'Monastery or friary']) {
      expect(BURIAL_INSTITUTION_PATTERN.test(house), `${house} must NOT read as burial`).toBe(false);
    }
  });

  it('a burial-only bucket has services but ZERO careServices', () => {
    const ledger = healingLedger(burialOnly);
    expect(ledger.services).toHaveLength(2);   // the raw bucket is untouched
    expect(ledger.careServices).toHaveLength(0);
  });

  it('a parish bucket keeps its care entry', () => {
    expect(healingLedger(parish).careServices).toHaveLength(1);
  });

  it('an entry whose house cannot be read STAYS IN — unreadable is not proof of a graveyard', () => {
    expect(healingLedger(withHealingServices(['Basic wound care'])).careServices).toHaveLength(1);
    expect(healingLedger(withHealingServices([{ name: 'Something' }])).careServices).toHaveLength(1);
  });

  it('THE SHIFT: a burial-only thorp now scores as ABSENT, and a parish thorp does not', () => {
    // Both lenses, both directions. Under the old reading these two were EQUAL.
    const burialSupply = deriveCapacityProfile('healing', burialOnly).supply;
    const parishSupply = deriveCapacityProfile('healing', parish).supply;
    expect(burialSupply).toBeLessThan(parishSupply);
    expect(deriveSystemVariable('healing_capacity', burialOnly).score)
      .toBeLessThan(deriveSystemVariable('healing_capacity', parish).score);

    // …and it lands on the ABSENT contributor BY NAME with its exact delta, not merely lower.
    const burialContribs = deriveCapacityProfile('healing', burialOnly).supplyContributors;
    expect(
      burialContribs.find((c) => c.source === 'institutions' && c.effect === 'absent'),
      'the burial-only thorp must reach the absent branch, not a quieter one',
    ).toMatchObject({ delta: -10 });
    // The parish thorp takes the rescue instead — the two branches are distinguished, which is
    // the whole claim. Under the old reading BOTH took the rescue.
    expect(
      deriveCapacityProfile('healing', parish).supplyContributors
        .find((c) => c.effect === 'services_only'),
    ).toMatchObject({ delta: 4 });
  });

  it('ANTI-VACUITY: a burial-only thorp still reads BELOW one with a real healer', () => {
    const withHealer = {
      ...burialOnly,
      institutions: [{ id: 'h', name: 'Herbalist' }],
    };
    expect(deriveCapacityProfile('healing', burialOnly).supply)
      .toBeLessThan(deriveCapacityProfile('healing', withHealer).supply);
  });
});
