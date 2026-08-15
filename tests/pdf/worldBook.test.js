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
import { existsSync, rmSync, statSync } from 'node:fs';
import { collectWorldBook, generateWorldBook, realmChapterRows } from '../../src/utils/generateWorldBook.js';

function fixtureCampaign() {
  const ashford = {
    id: 'ashford', name: 'Ashford',
    settlement: {
      name: 'Ashford', tier: 'town', population: 1800, culture: 'Hillfolk',
      history: { historicalCharacter: 'A grain town that outlasted a hard famine.' },
      institutions: [{ name: 'The Granary Guild' }, { name: 'Ashford Watch' }],
      // ⚠ THE HOOK MOVED OFF THE SETTLEMENT ROOT (2026-08-11). It used to be
      // `settlement.plotHooks`, an address NO writer in this repo produces — so
      // this fixture was the only reason the World Book's HOOKS (DM) chapter ever
      // had content, and the chapter was empty for every real settlement. It now
      // hangs off the NPC, one of the live addresses the canonical collector
      // (domain/dossier/plotHooks.js) walks, and the player-face pin below is
      // STRONGER for it: publicSafe.js strips `npcs[].plotHooks` by name, so the
      // covert string is now dropped by the projector AND by the collector's own
      // player guard, where the root key was only ever dropped by the guard.
      npcs: [{
        name: 'Mayor Elda', role: 'Mayor', influence: 8,
        goal: 'COVERTGOAL betray the guild', secret: 'COVERTSECRET',
        plotHooks: ['COVERTHOOK the mayor is secretly a smuggler'],
      }],
      neighbourNetwork: [{ id: 'brightwater', relationshipType: 'trade_partner' }],
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
      // Deliberately hook-free: the second settlement proves an empty HOOKS
      // chapter still binds. The root `plotHooks: []` it used to carry was the
      // same writerless address as Ashford's and said nothing either way.
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

describe('the chronicle reads start → end, and covert history never reaches the player face (SB2)', () => {
  // Production stores wizardNews NEWEST-FIRST (sortEntries: b.tick - a.tick); the
  // old fixture was hand-ordered ascending, so the order pin never saw the real
  // shape. This fixture is stored descending, carries a covert-tagged MAJOR, and
  // canonizes the world so the realm chapter (collectRealmSummary) is exercised.
  function covertFixture() {
    const { campaign, saves } = fixtureCampaign();
    campaign.worldState = { tick: 32, canonizedAt: '2026-01-01T00:00:00.000Z' };
    campaign.wizardNews = {
      schemaVersion: 1, currentTick: 32, entries: [
        { id: 'w30', tick: 30, headline: 'The harvest held', summary: '', significance: 'major' },
        { id: 'c20', tick: 20, headline: 'SECRET_CABAL_MOVE', summary: 'COVERTSUMMARY', significance: 'major', tags: ['covert'] },
        { id: 'w10', tick: 10, headline: 'A hard winter', summary: '', significance: 'notable' },
      ],
    };
    return { campaign, saves };
  }

  it('a newest-first feed binds an ASCENDING chronicle (the season reads start → end)', () => {
    const { campaign, saves } = covertFixture();
    expect(collectWorldBook(campaign, saves, { mode: 'dm' }).chronicle.map(c => c.tick)).toEqual([10, 20, 30]);
  });

  it('the DM face keeps the covert major — chronicle AND realm', () => {
    const { campaign, saves } = covertFixture();
    const book = collectWorldBook(campaign, saves, { mode: 'dm' });
    expect(book.chronicle.some(c => c.headline === 'SECRET_CABAL_MOVE')).toBe(true);
    expect(book.realm.present).toBe(true);
    expect((book.realm.majors || [])).toContain('SECRET_CABAL_MOVE');
  });

  it('the player face drops the covert major from EVERY chapter (chronicle, realm, whole JSON)', () => {
    const { campaign, saves } = covertFixture();
    const book = collectWorldBook(campaign, saves, { mode: 'player' });
    expect(book.chronicle.map(c => c.tick)).toEqual([10, 30]); // covert tick 20 gone, order kept
    expect(book.realm.present).toBe(true);
    expect((book.realm.majors || [])).toContain('The harvest held');
    expect((book.realm.majors || [])).not.toContain('SECRET_CABAL_MOVE');
    // The whole serialized book carries neither the covert headline nor its summary
    // (JSON.stringify skips realm.nameFor, a function — data only).
    const json = JSON.stringify(book);
    expect(json).not.toContain('SECRET_CABAL_MOVE');
    expect(json).not.toContain('COVERTSUMMARY');
  });
});

describe('the State of the Realm chapter names the besieged settlement', () => {
  // The chapter used to read `sg.id` off a liveSieges row, which carries only
  // `targetId` — so every 'Under siege' row painted the literal string
  // 'undefined'. The fixture drives a REAL siege through the REAL collector
  // (a deployment against Ashford ⇒ liveSieges mints { targetId:'ashford', … }),
  // so the pin fails the moment the row keys on a field liveSieges never emits.
  function besiegedFixture() {
    const { campaign, saves } = fixtureCampaign();
    campaign.worldState = {
      tick: 40,
      canonizedAt: '2026-01-01T00:00:00.000Z',
      deployments: { brightwater: { targetId: 'ashford', sinceTick: 38, role: 'attacker' } },
      warExhaustion: { brightwater: 0.84 },
    };
    return { campaign, saves };
  }

  it('the collector carries a targetId-keyed siege and NO id field', () => {
    const { campaign, saves } = besiegedFixture();
    const { realm } = collectWorldBook(campaign, saves, { mode: 'dm' });
    expect(realm.present).toBe(true);
    expect(realm.sieges.map(sg => sg.targetId)).toEqual(['ashford']);
    expect(realm.sieges[0].id).toBeUndefined();
  });

  it('the rendered rows resolve the settlement NAME, never the string "undefined"', () => {
    const { campaign, saves } = besiegedFixture();
    const rows = realmChapterRows(collectWorldBook(campaign, saves, { mode: 'dm' }).realm);
    expect(rows.sieges).toEqual(['Ashford']);
    expect(rows.sieges).not.toContain('undefined');
    // The war-weary row keys on `id` (warExhaustionStandings' own field) — the
    // two rows read DIFFERENT keys, which is exactly how the bug slipped in.
    expect(rows.weary).toEqual(['Brightwater']);
  });

  it('an unresolvable id degrades to the id itself, not to "undefined"', () => {
    const rows = realmChapterRows({ present: true, sieges: [{ targetId: 'ghost' }], weary: [], majors: [] });
    expect(rows.sieges).toEqual(['ghost']);
  });
});

describe('painter smoke (no bytes asserted — the collector pins stay the contract)', () => {
  // Fix wave 3 rewired the chronicle row (calendar date via tickCalendarLabel +
  // a measured at-the-table offset); this proves the painter still runs
  // end-to-end over the fixture, without ever comparing painter bytes.
  it('generateWorldBook paints and saves without throwing (dm + player faces)', () => {
    const { campaign, saves } = fixtureCampaign();
    // jsPDF's save is an OWN instance property (defineProperty in its
    // constructor — un-stubbable from outside), and its node build writes a
    // real file to cwd. So the receipt IS the artifact: paint both faces,
    // assert the PDFs materialized with real bytes, then remove them.
    const dmFile = 'world-book-the-long-winter.pdf';
    const playerFile = 'world-book-the-long-winter-player.pdf';
    try {
      generateWorldBook(campaign, saves, { mode: 'dm', now: '1/1/2026' });
      generateWorldBook(campaign, saves, { mode: 'player', now: '1/1/2026' });
      expect(existsSync(dmFile), 'dm face saved').toBe(true);
      expect(existsSync(playerFile), 'player face saved').toBe(true);
      expect(statSync(dmFile).size).toBeGreaterThan(1000);
      expect(statSync(playerFile).size).toBeGreaterThan(1000);
    } finally {
      rmSync(dmFile, { force: true });
      rmSync(playerFile, { force: true });
    }
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
