/**
 * tests/domain/facts/crisisKind.test.js — CENSUS-1 wave 0, fact 1: THE CRISIS-KIND HOME.
 *
 * RED-FIRST. Before the home, the kernel's crisis families read `settlement.stress` alone and
 * matched the generator's keys only, so (1) a record whose container is the `stressors` alias
 * (a legacy fixture; the alias order every other reader uses) read CALM, and (2) a pulse-typed
 * entry (`siege`, the roaming stressor's type, as a DM's campaign stressor stores it) read no
 * threat and no hunger. Both arms below were red at the base through the OLD module paths
 * (`crisis/crisisFacts.js`, `crisis/crisisPage.js`), which this lane keeps as the public names.
 *
 * @enforced-by npx vitest run tests/domain/facts/crisisKind.test.js
 */
import { describe, expect, it } from 'vitest';
import { crisisDimensionsOf, activeCrisisTypes } from '../../../src/domain/crisis/crisisFacts.js';
import { crisisEntriesOf } from '../../../src/domain/crisis/crisisPage.js';

const loadHome = () => import('../../../src/domain/facts/crisisKind.js');

describe('the crisis-kind home (CENSUS-1 fact 1)', () => {
  it('RED-FIRST: a container carried under the `stressors` alias is read, not taken as calm', () => {
    const record = { stressors: [{ type: 'under_siege', label: 'Under Siege' }] };
    expect(activeCrisisTypes(record)).toEqual(['under_siege']);
    expect(crisisDimensionsOf(record)).toMatchObject({ threat: 'threat', hunger: 'hunger', crisis: 'crisis' });
    expect(crisisEntriesOf(record).map((e) => e.index)).toEqual([0]);
  });

  it('RED-FIRST: a pulse-typed entry names its record kind (siege → under_siege)', () => {
    const record = { stress: [{ type: 'siege', label: 'Siege pressure' }] };
    expect(crisisDimensionsOf(record)).toMatchObject({ threat: 'threat', hunger: 'hunger' });
  });

  it('the one reader: kinds, families, the world pulse folded in only when the caller passes it', async () => {
    const { crisisOf, CRISIS_KINDS } = await loadHome();
    const record = { stress: [{ type: 'famine' }, { type: 'my_custom_crisis' }], activeConditions: [{ archetype: 'famine' }, { archetype: 'rebellion' }] };
    const alone = crisisOf(record);
    expect(alone.types).toEqual(['famine', 'my_custom_crisis']);
    expect(alone.kinds).toEqual(['famine']);
    expect(alone.families).toEqual(['hunger', 'crisis']);
    expect(alone.conditionKinds).toEqual(['famine']); // `rebellion` mirrors no kind
    expect(alone.has('famine') && alone.has('hunger') && !alone.has('under_siege')).toBe(true);
    const world = [{ type: 'siege', affectedSettlementIds: ['s1'] }, { type: 'wartime', affectedSettlementIds: ['s2'] }];
    const withWorld = crisisOf(record, { worldStressors: world, settlementId: 's1' });
    expect(withWorld.has('under_siege')).toBe(true);
    expect(withWorld.families).toEqual(['threat', 'hunger', 'crisis']);
    expect(withWorld.has('wartime')).toBe(false);
    expect(CRISIS_KINDS).toContain('under_siege');
    expect(crisisOf({}).active).toBe(false);
  });

  it('the stress container keeps every slot, so an index is its edit address', async () => {
    const { crisisContainer, crisisEntries } = await loadHome();
    const record = { stress: [null, { type: 'plague_onset', label: 'Plague' }] };
    expect(crisisContainer(record).length).toBe(2);
    expect(crisisEntries(record).length).toBe(1);
    expect(crisisEntriesOf(record).map((e) => e.index)).toEqual([1]);
  });

  it('factsOf(record).crisis is the same reader, read live', async () => {
    const { factsOf } = await import('../../../src/domain/facts/factsOf.js');
    const record = { stress: [{ type: 'occupied' }] };
    const facts = factsOf(record);
    expect(facts.crisis.kinds).toEqual(['occupied']);
    record.stress = [];
    expect(facts.crisis.active).toBe(false);
  });

  it('factsOf names all fourteen homes, each read live', async () => {
    const { factsOf } = await import('../../../src/domain/facts/factsOf.js');
    const record = {
      tier: 'town', population: 900, config: { terrainType: 'coastal', tradeRouteAccess: 'port', priorityMagic: 30 },
      institutions: [{ name: 'Town walls' }, { name: 'Weekly market' }, { name: 'Grain mill' }],
      npcs: [{ name: 'Ada' }, { name: 'Bo' }], powerStructure: { government: 'Town Council' },
      stress: [{ type: 'mass_migration', direction: 'exodus' }],
      economicState: { foodSecurity: { storageMonths: 3, foodRecord: { storageMonths: 3, band: 'deficit' } } },
    };
    const f = factsOf(record);
    expect([f.storesMonths, f.defence.walls, f.water.kind, f.market, f.famine.starvingAllowed, f.magic.functions,
      f.rulerKind, f.migration.direction, f.warState, f.hasInstitution('mill'), f.populationBand, f.terrain, f.hasOtherNpc(0)])
      .toEqual([3, true, 'maritime', true, true, true, 'council', 'exodus', 'peace', true, 'middling', 'coastal', true]);
  });
});
