/**
 * tests/domain/dossier/entityIndex.test.js
 *
 * Pins the Phase A dossier hyperlink index: buildDossierEntityIndex turns a
 * settlement into an id->entity resolver covering each structured entity type,
 * and currentName is resolved LIVE so a rename is reflected without rebuilding.
 */
import { describe, it, expect } from 'vitest';
import {
  buildDossierEntityIndex,
  entityAnchor,
  entityIdFor,
  neighbourIdFor,
  localNpcId,
} from '../../../src/domain/dossier/entityLinks.js';
import { factionIdFromName } from '../../../src/lib/entities.js';

function sampleSettlement() {
  return {
    id: 'settlement.ashford',
    name: 'Ashford',
    npcs: [
      { id: 'npc_1', name: 'Mara Voss', role: 'Reeve', factionAffiliation: 'Iron Guild' },
      { id: 'npc_2', name: 'Toller Finch', role: 'Smuggler', factionAffiliation: 'Iron Guild' },
    ],
    powerStructure: {
      factions: [
        { faction: 'Iron Guild', power: 60, desc: 'The metalworkers.' },
        { faction: 'Free Wharf', power: 40, desc: 'The dockers.' },
      ],
    },
    institutions: [
      { id: 'institution.town_watch', name: 'Town Watch' },
    ],
    neighbourNetwork: [
      { id: 'link_a_b', name: 'Greymoor', neighbourName: 'Greymoor', relationshipType: 'trade_partner' },
      { name: 'Dunhollow', neighbourName: 'Dunhollow', relationshipType: 'rival' }, // no id → derived
    ],
    history: {
      historicalEvents: [
        { id: 'evt_flood', name: 'The Great Flood', yearsAgo: 40, severity: 'major' },
        { name: 'The Long Winter', yearsAgo: 12, severity: 'minor' }, // no id → derived
      ],
    },
    config: {
      nearbyResources: ['iron_ore', 'timber'],
    },
  };
}

describe('buildDossierEntityIndex', () => {
  it('resolves each entity type to the right { type, currentName, tab }', () => {
    const index = buildDossierEntityIndex(sampleSettlement());

    const npc = index.resolve('npc_1');
    expect(npc).toBeTruthy();
    expect(npc.type).toBe('npc');
    expect(npc.currentName).toBe('Mara Voss');
    expect(npc.tab).toBe('npcs');

    const faction = index.resolve(factionIdFromName('Iron Guild'));
    expect(faction).toBeTruthy();
    expect(faction.type).toBe('faction');
    expect(faction.currentName).toBe('Iron Guild');
    expect(faction.tab).toBe('power');

    const inst = index.resolve('institution.town_watch');
    expect(inst).toBeTruthy();
    expect(inst.type).toBe('institution');
    expect(inst.currentName).toBe('Town Watch');
    // Institutions are enumerated only on the Overview tab's Institutions
    // disclosure (their sink), so the link routes there — not the Power tab,
    // which renders no institution as its own object.
    expect(inst.tab).toBe('overview');

    const settlement = index.resolve('settlement.ashford');
    expect(settlement).toBeTruthy();
    expect(settlement.type).toBe('settlement');
    expect(settlement.currentName).toBe('Ashford');
    expect(settlement.tab).toBe('overview');
  });

  it("keys factions by factionIdFromName so an NPC's affiliation resolves with no name-matching", () => {
    const s = sampleSettlement();
    const index = buildDossierEntityIndex(s);
    // The id an NPC card computes for its faction link (factionIdFromName of the
    // stated affiliation) MUST hit the faction's own index entry.
    const linkId = factionIdFromName(s.npcs[0].factionAffiliation);
    expect(index.resolve(linkId)).toBeTruthy();
    expect(index.resolve(linkId).currentName).toBe('Iron Guild');
  });

  it('returns null for an unknown id (broken-link guard)', () => {
    const index = buildDossierEntityIndex(sampleSettlement());
    expect(index.resolve('faction.does_not_exist')).toBeNull();
    expect(index.resolve(undefined)).toBeNull();
  });

  it('indexes neighbours by their persisted id and a derived id when absent', () => {
    const index = buildDossierEntityIndex(sampleSettlement());

    const byPersistedId = index.resolve('link_a_b');
    expect(byPersistedId).toBeTruthy();
    expect(byPersistedId.type).toBe('neighbour');
    expect(byPersistedId.currentName).toBe('Greymoor');
    // Neighbours route to the superset 'relationships' tab (the NeighbourLinkCard
    // sink renders there and the tab is registered on a broader condition than
    // the narrower 'neighbours' tab), so the link never no-ops.
    expect(byPersistedId.tab).toBe('relationships');

    // An entry with no id gets a stable, name-derived id.
    const derived = index.resolve('neighbour.dunhollow');
    expect(derived).toBeTruthy();
    expect(derived.type).toBe('neighbour');
    expect(derived.currentName).toBe('Dunhollow');
  });

  it('synthesizes a live neighbour entry from neighborRelationship (unsaved settlements)', () => {
    const s = { ...sampleSettlement(), neighbourNetwork: [], neighborRelationship: { name: 'Karth', relationshipType: 'allied' } };
    const index = buildDossierEntityIndex(s);
    const live = index.resolve('live_Karth');
    expect(live).toBeTruthy();
    expect(live.type).toBe('neighbour');
    expect(live.currentName).toBe('Karth');
  });

  it('dedupes a persisted neighbour over the synthesized live one by name', () => {
    const s = {
      ...sampleSettlement(),
      neighbourNetwork: [{ id: 'link_x', name: 'Karth', neighbourName: 'Karth', relationshipType: 'rival' }],
      neighborRelationship: { name: 'Karth', relationshipType: 'allied' },
    };
    const index = buildDossierEntityIndex(s);
    expect(index.neighbours.filter(n => n.currentName === 'Karth')).toHaveLength(1);
    expect(index.resolve('link_x')).toBeTruthy();
    expect(index.resolve('live_Karth')).toBeNull(); // the live duplicate was dropped
  });

  it('indexes events by id or a derived event.<name> id (link targets)', () => {
    const index = buildDossierEntityIndex(sampleSettlement());

    const byId = index.resolve('evt_flood');
    expect(byId).toBeTruthy();
    expect(byId.type).toBe('event');
    expect(byId.currentName).toBe('The Great Flood');
    expect(byId.tab).toBe('history');

    const derived = index.resolve('event.the-long-winter');
    expect(derived).toBeTruthy();
    expect(derived.type).toBe('event');
    expect(derived.currentName).toBe('The Long Winter');
  });

  it('resolves a trade partner name to its neighbour relationship card (same type)', () => {
    const index = buildDossierEntityIndex(sampleSettlement());
    // economicState stores a partner as a bare neighbour NAME; it links to the
    // SAME relationship card rather than a separate entity type.
    const partner = index.resolveTradePartner('Greymoor');
    expect(partner).toBeTruthy();
    expect(partner.type).toBe('neighbour');
    expect(partner.id).toBe('link_a_b');
    // A partner id resolves directly too.
    expect(index.resolveTradePartner('link_a_b')?.id).toBe('link_a_b');
    // An unknown partner degrades to null (plain text downstream).
    expect(index.resolveTradePartner('Nowhere')).toBeNull();
  });

  it('keeps resources resolvable by id (degrade-safe, decorated)', () => {
    const index = buildDossierEntityIndex(sampleSettlement());
    const iron = index.resolve('iron_ore');
    expect(iron).toBeTruthy();
    expect(iron.type).toBe('resource');
    expect(iron.tab).toBe('resources');
  });

  it('keeps a neighbour link rename-safe (id stable across a partner rename)', () => {
    const s = sampleSettlement();
    const index = buildDossierEntityIndex(s);
    const entry = index.resolve('link_a_b');
    expect(entry.currentName).toBe('Greymoor');
    // Rename the partner on the raw entry AFTER build — the id is unchanged and
    // currentName tracks the new value (no rebuild, no dead link).
    s.neighbourNetwork[0].neighbourName = 'Greymoor Hold';
    expect(index.resolve('link_a_b')).toBeTruthy();
    expect(entry.currentName).toBe('Greymoor Hold');
  });

  it('resolves currentName LIVE so a rename shows the new name (rename-safe)', () => {
    const s = sampleSettlement();
    const index = buildDossierEntityIndex(s);
    const entry = index.resolve('npc_1');
    expect(entry.currentName).toBe('Mara Voss');

    // Mutate the underlying raw entity AFTER the index was built. Because
    // currentName is a live getter off the raw entity (never cached), the
    // same entry now reports the new name with no rebuild.
    s.npcs[0].name = 'Mara the Reeve';
    expect(entry.currentName).toBe('Mara the Reeve');

    // Factions rename-safely the same way for their display name.
    const faction = index.resolve(factionIdFromName('Iron Guild'));
    s.powerStructure.factions[0].faction = 'Iron Guild';
    s.powerStructure.factions[0].name = undefined;
    s.powerStructure.factions[0].faction = 'The Iron Guild';
    expect(faction.currentName).toBe('The Iron Guild');
  });
});

/**
 * Sink wiring — every cross-link must land on a real DOM target. These pin the
 * contract the destination cards rely on: the anchor string a SINK card declares
 * (entityAnchor(...)) is byte-identical to the index entry's stored anchor, and
 * the identity a link carries (entry.id) is what the card's focus effect matches.
 * (OverviewTab institutions, NeighbourLinkCard, WarFaithSection deity.)
 */
describe('dossier sink anchors + ids', () => {
  it('institution: link routes to overview and the index anchor == the sink pill anchor', () => {
    const s = sampleSettlement();
    const index = buildDossierEntityIndex(s);
    const inst = s.institutions[0];
    const entry = index.resolve('institution.town_watch');
    expect(entry.tab).toBe('overview');
    // The OverviewTab pill declares id={entityAnchor('institution', inst)}; it
    // must equal the index entry's anchor so getElementById + the href resolve.
    expect(entityAnchor('institution', inst)).toBe(entry.anchor);
    // And the link's id (what EntityLink carries + the focus effect matches)
    // equals the index id.
    expect(entityIdFor('institution', inst)).toBe(entry.id);
  });

  it('neighbour: link targets its card via the shared neighbourIdFor anchor', () => {
    const s = sampleSettlement();
    const index = buildDossierEntityIndex(s);
    const link = s.neighbourNetwork[0]; // { id: 'link_a_b', neighbourName: 'Greymoor' }
    const entry = index.resolve('link_a_b');
    expect(entry.tab).toBe('relationships');
    // NeighbourLinkCard computes its anchor from neighbourIdFor(link) — the SAME
    // id the index keys the entry by — so the card is the link's scroll target.
    const cardId = neighbourIdFor(link);
    expect(cardId).toBe('link_a_b');
    expect(entityAnchor('neighbour', { id: cardId, name: link.neighbourName })).toBe(entry.anchor);

    // An id-less neighbour still gets a stable name-derived anchor that matches.
    const dun = s.neighbourNetwork[1];
    const dunEntry = index.resolve('neighbour.dunhollow');
    const dunId = neighbourIdFor(dun);
    expect(dunId).toBe('neighbour.dunhollow');
    expect(entityAnchor('neighbour', { id: dunId, name: dun.neighbourName })).toBe(dunEntry.anchor);
  });

  it('deity: the sink anchor (entityAnchor by name) matches the index entry anchor + id', () => {
    const s = {
      ...sampleSettlement(),
      config: { ...sampleSettlement().config, primaryDeitySnapshot: { name: 'Saint Vael', rankAxis: 'major' } },
    };
    const index = buildDossierEntityIndex(s);
    const entry = index.deities[0];
    expect(entry).toBeTruthy();
    expect(entry.type).toBe('deity');
    expect(entry.tab).toBe('war_faith');
    // WarFaithSection's outer div declares id={entityAnchor('deity', { name })};
    // it must equal the stored anchor (a true `dossier-deity-<slug>`, not the
    // old borrowed `dossier-settlement-<slug>`).
    expect(entry.anchor).toBe('dossier-deity-saint-vael');
    expect(entityAnchor('deity', { name: 'Saint Vael' })).toBe(entry.anchor);
    // And the id WarFaithSection's EntityLink/focus matches is the deity.<slug> id.
    expect(entry.id).toBe('deity.saint-vael');
    expect(index.resolve('deity.saint-vael')).toBeTruthy();
  });

  it('localNpcId resolves a bare name (no stable id) to the canonical NPC id', () => {
    const s = sampleSettlement();
    const index = buildDossierEntityIndex(s);
    // A sub-faction member / rival carries only a name; the canonical id is the
    // real npc.id, not the slug a {name}-only entityIdFor would mint.
    expect(localNpcId(index, 'Mara Voss')).toBe('npc_1');
    // Case-insensitive, trims; a renamed NPC still resolves via live currentName.
    s.npcs[0].name = 'Mara the Reeve';
    expect(localNpcId(index, '  mara the reeve ')).toBe('npc_1');
    // A foreign contact (absent from the index) degrades to null → plain text.
    expect(localNpcId(index, 'Nobody')).toBeNull();
  });
});
