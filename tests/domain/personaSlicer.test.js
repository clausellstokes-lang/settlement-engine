/**
 * tests/domain/personaSlicer.test.js — the CLIENT persona-slicer pins (Surveyor S3 parley,
 * DESIGN_AI_CONTROL_SURFACE §2d + THE TOTAL-GROUNDING LAW).
 *
 *   PIN A (TOTAL-GROUNDING COVERAGE): the built slice covers every required manifest key
 *     for its entity class (the persona slice ⊇ the engine-consumer census).
 *   PIN B (EPISTEMIC SCOPING): the slice is built from the entity's OWN knowledge + its
 *     home settlement — it never reaches into another settlement's ground truth.
 *   PIN C (THE GLUE TYPOLOGY): a patronage-glue collective reads 'patron'; anything else
 *     (or no live bloc) reads the governing 'seat'.
 *   PIN D (CENSUS PARITY): the required person facets are exactly NPC_FACET_KINDS (the one
 *     enumerable no-dead-facet census, consumed in reverse); the client + edge manifests
 *     never drift.
 */
import { describe, it, expect } from 'vitest';
import { buildPersonaSlice, sliceCoversManifest, sliceManifestKeys } from '../../src/domain/ai/personaSlicer.js';
import { requiredManifestKeys as clientRequired, PERSON_FACET_KEYS } from '../../src/domain/ai/groundingManifest.js';
import { requiredManifestKeys as edgeRequired } from '../../supabase/functions/parley/parleyCore.ts';
import { NPC_FACET_KINDS } from '../../src/domain/npc/npcBank.js';

function fixture() {
  const settlement = {
    id: 's1', name: 'Ashford',
    npcs: [{ id: 'n1', name: 'Mira', role: 'reeve', alignment: 'lawful_selfish', personality: { dominant: 'guarded' }, goal: { short: 'buy the mill' }, factionAffiliation: 'The Guildhall' }],
    relationships: [{ npc1Id: 'n1', npc2Id: 'n9', type: 'rival', strength: 3 }],
    economicState: { prosperity: 'lean', foodSecurity: { storageMonths: 2 }, primaryExports: ['grain'] },
    config: { primaryDeitySnapshot: { name: 'Vael' }, cultDeitySnapshots: [] },
    powerStructure: { factions: [{ name: 'The Guildhall' }] },
  };
  // a SECOND settlement carrying a private secret the persona must NEVER be able to voice
  const other = { id: 's2', name: 'Thornwall', dmNotes: 'THE_SECRET_PLOT', npcs: [{ id: 'x9', secret: { what: 'THE_SECRET_PLOT' } }] };
  return { settlement, other, worldState: { clock: { week: 40 }, npcStates: { n1: { rivalryTargets: ['n9'] } } } };
}

describe('persona slicer — total-grounding coverage (PIN A)', () => {
  it('an NPC persona covers every required manifest key', () => {
    const { settlement, worldState } = fixture();
    const slice = buildPersonaSlice({ entity: settlement.npcs[0], entityClass: 'npc', settlement, worldState });
    expect(sliceCoversManifest(slice)).toBe(true);
    for (const k of clientRequired('npc')) expect(sliceManifestKeys(slice)).toContain(k);
  });

  it('a settlement persona covers the §2d manifest (no person facets)', () => {
    const { settlement, worldState } = fixture();
    const slice = buildPersonaSlice({ entity: settlement, entityClass: 'settlement', settlement, worldState });
    expect(sliceCoversManifest(slice)).toBe(true);
    expect(sliceManifestKeys(slice)).not.toContain('temperament');   // person-only facet absent
  });

  it('a dormant / partial worldState still covers the manifest (muted facets, never gaps)', () => {
    const slice = buildPersonaSlice({ entity: { id: 'n5', role: 'guard' }, entityClass: 'npc', settlement: null, worldState: null });
    expect(sliceCoversManifest(slice)).toBe(true);   // degrades to muted facets, never crashes
  });
});

describe('persona slicer — epistemic scoping (PIN B)', () => {
  it('the slice is built from the entity + its HOME settlement, never another settlement', () => {
    const { settlement, worldState } = fixture();
    const slice = buildPersonaSlice({ entity: settlement.npcs[0], entityClass: 'npc', settlement, worldState });
    // the neighbouring settlement's secret can NEVER appear — the slicer only reads `home`
    expect(JSON.stringify(slice)).not.toContain('THE_SECRET_PLOT');
    // her own knowledge IS present (role, goal, her rivalry)
    const blob = JSON.stringify(slice);
    expect(blob).toContain('reeve');
    expect(blob).toContain('buy the mill');
    expect(blob).toContain('n9');       // her rival, from her own web
  });
});

describe('persona slicer — the glue typology (PIN C)', () => {
  it('a patronage bloc reads patron; anything else reads the governing seat', () => {
    const patronSettlement = { id: 'sp', name: 'PatronTown', politicsLedgers: { sp: { blocs: [{ id: 'b1', glue: [{ type: 'patronage' }], strain: 0.5 }] } } };
    expect(buildPersonaSlice({ entity: patronSettlement, entityClass: 'settlement', settlement: patronSettlement }).voice).toBe('patron');
    const seatSettlement = { id: 'ss', name: 'SeatTown', politicsLedgers: { ss: { blocs: [{ id: 'b1', glue: [{ type: 'concession' }], strain: 0.5 }] } } };
    expect(buildPersonaSlice({ entity: seatSettlement, entityClass: 'settlement', settlement: seatSettlement }).voice).toBe('seat');
    // no live bloc ⇒ the governing seat (never a patron by default)
    const bare = { id: 'sb', name: 'BareTown' };
    expect(buildPersonaSlice({ entity: bare, entityClass: 'settlement', settlement: bare }).voice).toBe('seat');
    // an NPC always speaks as self
    expect(buildPersonaSlice({ entity: { id: 'n1' }, entityClass: 'npc' }).voice).toBe('self');
  });
});

describe('persona slicer — census parity, no drift (PIN D)', () => {
  it('the required person facets ARE the enumerable no-dead-facet census (consumed in reverse)', () => {
    expect(PERSON_FACET_KEYS).toEqual([...NPC_FACET_KINDS]);
  });

  it('the client + edge manifests agree for every entity class (no drift)', () => {
    for (const cls of ['npc', 'settlement', 'faction']) {
      expect(clientRequired(cls).slice().sort()).toEqual(edgeRequired(cls).slice().sort());
    }
  });
});
