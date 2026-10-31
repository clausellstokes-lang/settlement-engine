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
  eventIdFor,
  neighbourIdFor,
  localNpcId,
} from '../../../src/domain/dossier/entityLinks.js';
import { factionIdFromName } from '../../../src/lib/entities.js';
import {
  searchDossier,
  enumerateDossierObjects,
  MATCH,
} from '../../../src/domain/dossier/dossierSearch.js';
import {
  linkMentions,
  mentionScopeFor,
  isMentionAllowed,
} from '../../../src/domain/dossier/linkMentions.js';

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
    // VERIFIER F15: the Overview no longer lists institutions (T1-15); the
    // Institutions tab (T1-14, always registered) is their one sink, so the link
    // routes there.
    expect(inst.tab).toBe('institutions');

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

  it('gives an unnamed legacy event content identity that survives reordering and export', () => {
    const anonymous = {
      type: 'political',
      description: 'A council dissolved without a surviving title.',
      yearsAgo: 22,
    };
    const id = eventIdFor(anonymous, 0);
    const reorderedId = eventIdFor(
      JSON.parse(JSON.stringify({
        yearsAgo: 22,
        description: 'A council dissolved without a surviving title.',
        type: 'political',
      })),
      99,
    );

    expect(id).toMatch(/^event\.legacy-/);
    expect(id).not.toContain('index');
    expect(reorderedId).toBe(id);
  });

  it('keeps duplicate anonymous legacy events readable but non-interactive', () => {
    const duplicate = {
      type: 'political',
      description: 'An untitled record survived the old export.',
      yearsAgo: 9,
    };
    const settlement = {
      ...sampleSettlement(),
      history: {
        historicalEvents: [
          { ...duplicate },
          { ...duplicate },
        ],
      },
    };
    const index = buildDossierEntityIndex(settlement);

    expect(index.events).toHaveLength(2);
    expect(new Set(index.events.map(event => event.id)).size).toBe(1);
    expect(index.events.every(event => (
      event.identity.state === 'degraded_collision'
      && event.identity.interactive === false
    ))).toBe(true);
    expect(index.resolve(index.events[0].id).identity.interactive).toBe(false);
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
 * (InstitutionsTab cards, NeighbourLinkCard, WarFaithSection deity.)
 */
describe('dossier sink anchors + ids', () => {
  it('institution: link routes to the Institutions tab and the index anchor == the sink card anchor', () => {
    const s = sampleSettlement();
    const index = buildDossierEntityIndex(s);
    const inst = s.institutions[0];
    const entry = index.resolve('institution.town_watch');
    expect(entry.tab).toBe('institutions');
    // The InstitutionsTab card declares id={entityAnchor('institution', inst)}; it
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
    expect(entry.tab).toBe('faith');
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

/**
 * THE DOSSIER SEARCH, its pure half (RULINGS-CROSS X-19 / X-19b; BUILD-W2-SEARCH U1). The
 * enumerator walks the same index the links resolve through, so these sit beside it. A
 * result is the dossier's OWN object (the raw record its tab renders), grouped under the
 * owning tab: exact name > name prefix > a word in the name > a name containing the query >
 * the text containing it; prominence breaks a tie; the groups run by their best object, then
 * people first. Audience: a player view is enumerated from the public projection, and a
 * public dossier never matches a secret.
 */
describe('dossierSearch (X-19b): the one-stop shop of the dossier\'s own objects', () => {
  function searchTown() {
    return {
      id: 'settlement.ashford',
      name: 'Ashford',
      npcs: [
        { id: 'npc_1', name: 'Mara Voss', role: 'Reeve', influence: 'low', factionAffiliation: 'Iron Guild',
          secret: 'She buried the tithe ledger under the mill race.',
          plotHooks: ['Mara Voss needs the ledger found before the audit.'] },
        { id: 'npc_2', name: 'Mara Voskov', role: 'Factor', influence: 'high', factionAffiliation: 'Free Wharf' },
        { id: 'npc_3', name: 'Tomas Marabel', role: 'Smith', influence: 'moderate' },
        { id: 'npc_4', name: 'Odo Penn', role: 'Clerk', influence: 'low', title: 'Keeper of the Mara rolls' },
      ],
      relationships: [
        { type: 'rival', typeName: 'Rivals', npc1Name: 'Mara Voss', npc2Name: 'Odo Penn', description: 'An old quarrel.', tension: 'Penn wants the reeve\'s seat.' },
        { type: 'ally', typeName: 'Allies', npc1Name: 'Tomas Marabel', npc2Name: 'Odo Penn', description: 'Drinking companions.' },
      ],
      conflicts: [
        { parties: ['Iron Guild', 'Free Wharf'], issue: 'dock tolls', stakes: 'Whether Mara Voss keeps the toll books.', intensity: 'high' },
      ],
      powerStructure: { factions: [{ faction: 'Iron Guild', power: 60 }, { faction: 'Free Wharf', power: 40 }] },
      neighbourNetwork: [{ id: 'link_a_b', name: 'Greymoor', neighbourName: 'Greymoor', relationshipType: 'trade_partner' }],
      history: {
        historicalEvents: [{ id: 'evt_flood', name: 'The Great Flood', yearsAgo: 40, severity: 'major', description: 'The river took the lower town.' }],
        currentTensions: [{ type: 'guild_conflict', description: 'The guild and the wharf will not share the quay.', severity: 'major' }],
      },
    };
  }

  it('ranks exact name > prefix > word > text, prominence breaking a tie, groups by their best object', () => {
    const order = (result, tab) => result.groups.find(g => g.tab === tab)?.objects.map(o => o.names[0]);

    // "mara": no exact name. Two prefixes (the HIGH-influence Voskov before the low Voss),
    // then a word in a name (Marabel's surname starts it), then a text match (a title).
    const mara = searchDossier(searchTown(), 'mara');
    expect(order(mara, 'npcs')).toEqual(['Mara Voskov', 'Mara Voss', 'Tomas Marabel', 'Odo Penn']);
    expect(mara.groups.find(g => g.tab === 'npcs').objects.map(o => o.score))
      .toEqual([MATCH.PREFIX, MATCH.PREFIX, MATCH.WORD, MATCH.TEXT]);

    // An exact name: the person's own card leads its group. The tie and the hook name her
    // exactly too, so the three groups tie and run in the strip's own tab order (chair ruling
    // X-25c: SEARCH_TAB_ORDER follows TAB_GROUPS, Summary's Plot Hooks before World's NPCs).
    const exact = searchDossier(searchTown(), 'Mara Voss');
    expect(exact.groups.map(g => g.tab)).toEqual(['plot_hooks', 'npcs', 'relationships']);
    const people = exact.groups.find(g => g.tab === 'npcs');
    expect(people.objects[0].raw).toBe(exact.settlement.npcs[0]);
    expect(people.objects[0].score).toBe(MATCH.EXACT);
  });

  it('an exact NPC name returns their card, and every tie, conflict and hook naming them, under their own tabs', () => {
    const town = searchTown();
    const { groups } = searchDossier(town, 'mara voss');
    const byType = (type) => groups.flatMap(g => g.objects).filter(o => o.type === type);
    expect(byType('npc').map(o => o.raw)).toContain(town.npcs[0]);
    expect(byType('tie').map(o => o.raw)).toEqual([town.relationships[0]]);
    expect(byType('conflict').map(o => o.raw)).toEqual([town.conflicts[0]]);
    expect(byType('hook').map(o => o.raw.text)).toEqual(['Mara Voss needs the ledger found before the audit.']);
    // Every object is the raw record its tab renders and carries the tab that owns it.
    expect(byType('tie')[0].tab).toBe('relationships');
    expect(byType('conflict')[0].tab).toBe('relationships');
    expect(byType('hook')[0].tab).toBe('plot_hooks');
    expect(byType('npc')[0].id).toBe('npc_1');
  });

  it('enumerates the families the index does not hold, each under its owning tab', () => {
    const { objects } = enumerateDossierObjects(searchTown());
    const tabsOf = (type) => [...new Set(objects.filter(o => o.type === type).map(o => o.tab))];
    expect(tabsOf('event')).toEqual(['history']);
    expect(tabsOf('tension')).toEqual(['history']);
    expect(tabsOf('faction')).toEqual(['power']);
    expect(tabsOf('neighbour')).toEqual(['relationships']);
    expect(objects.find(o => o.type === 'neighbour').id).toBe('link_a_b');
    expect(objects.find(o => o.type === 'event').id).toBe('evt_flood');
    expect(searchDossier(searchTown(), 'guild conflict').groups[0].objects[0].type).toBe('tension');
  });

  it('a player view never carries a secret or a hook, and a public dossier never matches a secret', () => {
    const secretWords = 'tithe ledger';
    // The DM finds the card by its secret: the secret is part of the card the DM reads.
    expect(searchDossier(searchTown(), secretWords).groups[0].objects[0].raw.name).toBe('Mara Voss');

    // PLAYER VIEW: the secret cannot be matched, the card that IS found carries no secret
    // field to render, and the plot hooks family is not enumerated at all.
    const player = searchDossier(searchTown(), 'Mara Voss', { playerView: true });
    const card = player.groups[0].objects[0].raw;
    expect(card.name).toBe('Mara Voss');
    // anchored: the line above proves the card is the live, found record, so its missing secret cannot be vacuous
    expect(card).not.toHaveProperty('secret');
    expect(player.groups.map(g => g.tab)).toEqual(['npcs', 'relationships']);
    expect(searchDossier(searchTown(), secretWords, { playerView: true }).total).toBe(0);

    // PUBLIC DOSSIER: the card is still found by name, but never by its secret.
    // (X-25c: the tied Plot Hooks group now runs first, so the card is read from its own group.)
    expect(searchDossier(searchTown(), 'Mara Voss', { publicDossier: true }).groups.find(g => g.tab === 'npcs').objects[0].raw.name).toBe('Mara Voss');
    expect(searchDossier(searchTown(), secretWords, { publicDossier: true }).total).toBe(0);
  });

  it('drops a family whose tab the viewer does not have, and a one-letter query is no query', () => {
    const tabs = ['npcs', 'history'];
    expect(searchDossier(searchTown(), 'Mara Voss', {}, { tabs }).groups.map(g => g.tab)).toEqual(['npcs']);
    expect(searchDossier(searchTown(), 'm').total).toBe(0);
    expect(searchDossier(searchTown(), '  ').groups).toEqual([]);
    expect(searchDossier(null, 'Mara').total).toBe(0);
  });
});

describe('linkMentions (X-20): every mention is a door', () => {
  function mentionTown() {
    return {
      id: 'settlement.ashford',
      name: 'Ashford',
      npcs: [
        { id: 'npc_1', name: 'Mara Voss', role: 'Reeve' },
        { id: 'npc_2', name: 'Odo Penn', role: 'Smith' },
        { id: 'npc_3', name: 'Al', role: 'Child' },
      ],
      powerStructure: {
        factions: [
          { faction: 'Guild', power: 10 },
          { faction: 'Iron Guild', power: 60 },
        ],
      },
      institutions: [{ name: 'Granary' }],
      config: { nearbyResources: ['timber'] },
      history: { historicalEvents: [{ id: 'evt_fire', name: 'The Great Fire', yearsAgo: 40 }] },
    };
  }
  const links = (segments) => segments.filter((s) => s.type === 'link').map((s) => [s.value, s.id]);
  const rejoin = (segments) => segments.map((s) => s.value).join('');

  it('links exact whole-word canonical names and keeps every character of the text', () => {
    const index = buildDossierEntityIndex(mentionTown());
    const text = 'Mara Voss owes Odo Penn, and the Granary knows it; Mara Voss\'s debt dates from The Great Fire.';
    const segs = linkMentions(text, index);
    expect(rejoin(segs)).toBe(text);
    expect(links(segs)).toEqual([
      ['Mara Voss', 'npc_1'], ['Odo Penn', 'npc_2'], ['Granary', index.institutions[0].id],
      ['Mara Voss', 'npc_1'], ['The Great Fire', 'evt_fire'],
    ]);
  });

  it('links the longer name when a faction is named inside another faction', () => {
    const index = buildDossierEntityIndex(mentionTown());
    const segs = linkMentions('The Iron Guild outbids the Guild.', index);
    expect(links(segs)).toEqual([['Iron Guild', factionIdFromName('Iron Guild')], ['Guild', factionIdFromName('Guild')]]);
  });

  it('never links a surname alone, a different case, a name inside a word, or a too-short name', () => {
    const index = buildDossierEntityIndex(mentionTown());
    for (const text of ['Voss signed it.', 'mara voss signed it.', 'MARA VOSS signed it.', 'Guilds and Guildhall', 'Al came', 'Mara Vossberg came.']) {
      expect(links(linkMentions(text, index))).toEqual([]);
    }
    expect(links(linkMentions('(Mara Voss), "Odo Penn"!', index))).toEqual([['Mara Voss', 'npc_1'], ['Odo Penn', 'npc_2']]);
  });

  it('keeps a card from linking to itself and keeps resources out of prose', () => {
    const index = buildDossierEntityIndex(mentionTown());
    expect(links(linkMentions('Mara Voss trusts Odo Penn.', index, null, { selfId: 'npc_1' }))).toEqual([['Odo Penn', 'npc_2']]);
    expect(links(linkMentions('Ashford sells timber.', index))).toEqual([]);
    expect(links(linkMentions('timber', index, null, { structural: true }))).toEqual([['timber', 'timber']]);
  });

  it('leaves an ambiguous name as text: two people sharing one name link to neither', () => {
    const town = mentionTown();
    town.npcs.push({ id: 'npc_4', name: 'Odo Penn', role: 'Cousin' });
    const index = buildDossierEntityIndex(town);
    expect(links(linkMentions('Odo Penn and Mara Voss', index))).toEqual([['Mara Voss', 'npc_1']]);
  });

  it('links only what the viewer may open: the tab must be present', () => {
    const town = mentionTown();
    const index = buildDossierEntityIndex(town);
    const scope = mentionScopeFor(town, { tabs: ['npcs'] });
    expect(links(linkMentions('Mara Voss and the Iron Guild', index, scope))).toEqual([['Mara Voss', 'npc_1']]);
    expect(isMentionAllowed(scope, index.factions[1])).toBe(false);
    expect(isMentionAllowed(null, index.factions[1])).toBe(true);
  });

  it('a player view links only objects that survive the public projection', () => {
    const town = mentionTown();
    // The DM's record holds a person the projection the player receives does not carry
    // (toPublicSafe drops an NPC with neither name nor role; the gallery veil drops more).
    const dmIndex = buildDossierEntityIndex({ ...town, npcs: [...town.npcs, { id: 'npc_9', name: 'Hidden Hand', role: 'Spy' }] });
    const projected = { ...town, npcs: [...town.npcs, { id: 'npc_9', name: '', role: '' }] };
    const player = mentionScopeFor(projected, { playerView: true, tabs: ['npcs', 'power', 'history', 'institutions'] });
    expect(links(linkMentions('Hidden Hand pays Mara Voss.', dmIndex, player))).toEqual([['Mara Voss', 'npc_1']]);
    const owner = mentionScopeFor(projected, { tabs: ['npcs'] });
    expect(links(linkMentions('Hidden Hand pays Mara Voss.', dmIndex, owner))).toEqual([['Hidden Hand', 'npc_9'], ['Mara Voss', 'npc_1']]);
  });

  it('returns no segments for a non-string and one text segment with no index', () => {
    expect(linkMentions(null, null)).toEqual([]);
    expect(linkMentions('Mara Voss', null)).toEqual([{ type: 'text', value: 'Mara Voss' }]);
  });
});
