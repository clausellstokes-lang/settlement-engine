/**
 * worldBook.test.js — R-4 THE WORLD BOOK collector pins.
 *
 * Following the campaign-PDF precedent (campaignPdfLivingWorld.test.js): the pure
 * COLLECTOR is exported and its STRUCTURE is walked — never bytes, never the painter
 * (the download fn is browser-only, jsPDF-bound, like generateCampaignPDF).
 *
 * Pins: deterministic collection for a fixed fixture · every section present · the
 * player-safe face carries ZERO covert marks (toPublicSafe engaged).
 */
import { describe, it, expect } from 'vitest';
import { collectWorldBook } from '../../src/utils/generateWorldBook.js';

function fixtureCampaign() {
  const ashford = {
    id: 'ashford', name: 'Ashford',
    settlement: {
      name: 'Ashford', tier: 'town', population: 1800, culture: 'Hillfolk',
      history: { historicalCharacter: 'A grain town that outlasted a hard famine.' },
      institutions: [{ name: 'The Granary Guild' }, { name: 'Ashford Watch' }],
      npcs: [{ name: 'Mayor Elda', role: 'Mayor', influence: 8, goal: 'COVERTGOAL betray the guild', secret: 'COVERTSECRET' }],
      neighbourNetwork: [{ id: 'brightwater', relationshipType: 'trade_partner' }],
      plotHooks: ['COVERTHOOK the mayor is secretly a smuggler'],
      dmNotes: 'COVERTNOTE only the DM should see this',
    },
  };
  const brightwater = {
    id: 'brightwater', name: 'Brightwater',
    settlement: {
      name: 'Brightwater', tier: 'village', population: 600, culture: 'Rivermen',
      history: { historicalCharacter: 'A river village of ferrymen.' },
      institutions: [{ name: 'The Ferry Company' }],
      npcs: [{ name: 'Captain Ros', role: 'Ferrymaster', influence: 5 }],
      neighbourNetwork: [{ id: 'ashford', relationshipType: 'trade_partner' }],
      plotHooks: [],
    },
  };
  const campaign = {
    id: 'camp1', name: 'The Long Winter', description: 'A frontier holding through hard years.',
    settlementIds: ['ashford', 'brightwater'],
    wizardNews: {
      schemaVersion: 1, currentTick: 12, entries: [
        { id: 'w1', tick: 3, headline: 'A hard winter', summary: 'Grain ran short across the vale.', significance: 'major' },
        { id: 't1', tick: 5, headline: 'Relief at the table (major)', summary: 'The party bought grain from the south.', source: 'table', tags: ['table', 'stressor-relief', 'major'] },
      ],
    },
    worldState: { tick: 12 },
  };
  return { campaign, saves: [ashford, brightwater] };
}

describe('collectWorldBook — structure', () => {
  const { campaign, saves } = fixtureCampaign();

  it('is deterministic: the same fixture yields a deep-equal book', () => {
    expect(collectWorldBook(campaign, saves, { mode: 'dm' })).toEqual(collectWorldBook(campaign, saves, { mode: 'dm' }));
  });

  it('binds every section: chronicle, dossiers, map, receipts, realm', () => {
    const book = collectWorldBook(campaign, saves, { mode: 'dm' });
    expect(book.present).toBe(true);
    expect(book.title).toBe('The Long Winter');
    expect(book.settlementCount).toBe(2);
    // The five sections exist as booleans; the content sections the fixture feeds are present.
    expect(book.sections).toHaveProperty('chronicle');
    expect(book.sections).toHaveProperty('dossiers');
    expect(book.sections).toHaveProperty('map');
    expect(book.sections).toHaveProperty('receipts');
    expect(book.sections).toHaveProperty('realm');
    expect(book.sections.chronicle).toBe(true);
    expect(book.sections.dossiers).toBe(true);
    expect(book.sections.map).toBe(true);
    // The chronicle carries the tick-placed history, distinguishing table-authored.
    expect(book.chronicle.map(c => c.tick)).toEqual([3, 5]);
    expect(book.chronicle.find(c => c.source === 'table')).toBeTruthy();
    // The map binds both settlements and the trade link between them.
    expect(book.map.nodes.map(n => n.id).sort()).toEqual(['ashford', 'brightwater']);
    expect(book.map.edges).toHaveLength(1);
    // Dossiers carry overview + institutions + figures.
    const ash = book.dossiers.find(d => d.id === 'ashford');
    expect(ash.overview).toMatch(/famine/i);
    expect(ash.institutions).toContain('The Granary Guild');
    expect(ash.npcs[0].name).toBe('Mayor Elda');
  });

  it('the DM face carries hooks + figure influence', () => {
    const book = collectWorldBook(campaign, saves, { mode: 'dm' });
    const ash = book.dossiers.find(d => d.id === 'ashford');
    expect(ash.hooks.length).toBe(1);
    expect(ash.hooks[0]).toMatch(/smuggler/i);
    expect(ash.npcs[0].influence).toBe(8);
    // The DM book DOES surface the hook text.
    expect(JSON.stringify(book)).toContain('COVERTHOOK');
  });
});

describe('the player-safe face carries ZERO covert marks', () => {
  const { campaign, saves } = fixtureCampaign();

  it('drops hooks, DM notes, NPC secrets/goals, and influence', () => {
    const book = collectWorldBook(campaign, saves, { mode: 'player' });
    expect(book.mode).toBe('player');
    const ash = book.dossiers.find(d => d.id === 'ashford');
    // Hooks gone; influence nulled.
    expect(ash.hooks).toEqual([]);
    expect(ash.npcs[0].influence).toBe(null);
    // The whole book, stringified, contains NONE of the covert markers.
    const json = JSON.stringify(book);
    for (const covert of ['COVERTHOOK', 'COVERTNOTE', 'COVERTGOAL', 'COVERTSECRET']) {
      expect(json).not.toContain(covert);
    }
    // But the public dossier is not hollow — overview + institutions survive.
    expect(ash.overview).toMatch(/famine/i);
    expect(ash.institutions).toContain('The Granary Guild');
    expect(ash.npcs[0].name).toBe('Mayor Elda');
  });

  it('is deterministic in player mode too', () => {
    expect(collectWorldBook(campaign, saves, { mode: 'player' })).toEqual(collectWorldBook(campaign, saves, { mode: 'player' }));
  });
});

describe('edge cases', () => {
  it('a missing campaign returns present:false', () => {
    expect(collectWorldBook(null, [], {}).present).toBe(false);
  });
  it('a campaign with no members still binds (empty content sections)', () => {
    const book = collectWorldBook({ id: 'c', name: 'Empty', settlementIds: [] }, [], {});
    expect(book.present).toBe(true);
    expect(book.sections.dossiers).toBe(false);
    expect(book.sections.map).toBe(false);
  });
});
