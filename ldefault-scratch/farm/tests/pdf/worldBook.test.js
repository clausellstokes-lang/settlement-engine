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
import { describe, it, expect, vi } from 'vitest';

// PASSTHROUGH SPY on the layout entry point. It does NOT fabricate a shape or a
// return value — the real autoLayout runs and the real positions are painted; the
// spy exists only so a pin can read the edges the World Book ACTUALLY hands it.
// (The World Book's map chapter is module-private, and its geometry is not
// recoverable from the painted stream without re-deriving the chapter's private
// frame constants — observing the real call is the honest instrument.)
// PASSTHROUGH spy on the analytics sink. Only `track` is swapped; EVENTS and every
// other export stay real, so the pin asserts the REAL constant the exporter emits.
vi.mock('../../src/lib/analytics.js', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, track: vi.fn() };
});

vi.mock('../../src/utils/graphLayout.js', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, autoLayout: vi.fn(actual.autoLayout) };
});
import { existsSync, rmSync, statSync } from 'node:fs';
import { collectWorldBook, generateWorldBook, realmChapterRows } from '../../src/utils/generateWorldBook.js';
import { loadBookFace as loadFace } from '../helpers/bookFaceLoader.js';
import { autoLayout } from '../../src/utils/graphLayout.js';
import { track, EVENTS } from '../../src/lib/analytics.js';

function fixtureCampaign() {
  const ashford = {
    id: 'ashford', name: 'Ashford',
    settlement: {
      // ⚠ culture sits on the RESOLVED CONFIG, the only address the engine writes.
      // This fixture carried it at the settlement ROOT — a key with no writer
      // anywhere — which is why the dossier's blank culture never reded here.
      name: 'Ashford', tier: 'town', population: 1800, config: { culture: 'Hillfolk' },
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

  // The SAME dead-address defect the campaign PDF carried: the dossier read
  // `st_.culture`, a key no writer produces, so the settlement line
  // ("<tier> - <pop> souls - <culture>") dropped its culture for every save the
  // current generator makes. The fixture above encoded that same dead address,
  // which is why the suite could never have caught it.
  it('a dossier resolves culture from the RESOLVED config, not the never-written root', () => {
    const modern = {
      id: 'tidewatch',
      name: 'Tidewatch',
      settlement: { name: 'Tidewatch', tier: 'town', population: 900, config: { culture: 'tide_reaver' } },
    };
    const book = collectWorldBook(
      { ...campaign, settlementIds: [...campaign.settlementIds, 'tidewatch'] },
      [...saves, modern],
      { mode: 'dm' },
    );
    expect(book.dossiers.find(d => d.id === 'tidewatch').culture).toBe('tide_reaver');
    expect(book.dossiers.find(d => d.id === 'ashford').culture).toBe('Hillfolk');
  });

  it('the materialized culturalIdentity.key resolves a config-stripped save', () => {
    const stripped = {
      id: 'keyed',
      name: 'Keyford',
      settlement: { name: 'Keyford', tier: 'village', population: 300, culturalIdentity: { key: 'norse' } },
    };
    const book = collectWorldBook(
      { ...campaign, settlementIds: [...campaign.settlementIds, 'keyed'] },
      [...saves, stripped],
      { mode: 'dm' },
    );
    expect(book.dossiers.find(d => d.id === 'keyed').culture).toBe('norse');
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
  it('generateWorldBook paints and saves without throwing (dm + player faces)', async () => {
    const { campaign, saves } = fixtureCampaign();
    // jsPDF's save is an OWN instance property (defineProperty in its
    // constructor — un-stubbable from outside), and its node build writes a
    // real file to cwd. So the receipt IS the artifact: paint both faces,
    // assert the PDFs materialized with real bytes, then remove them.
    const dmFile = 'world-book-the-long-winter.pdf';
    const playerFile = 'world-book-the-long-winter-player.pdf';
    try {
      await generateWorldBook(campaign, saves, { mode: 'dm', now: '1/1/2026', loadFace });
      await generateWorldBook(campaign, saves, { mode: 'player', now: '1/1/2026', loadFace });
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

/**
 * MEMBER RESOLUTION across the id-type seam. Same defect, same cause as the campaign
 * PDF's (pinned in exportDateSeam.test.js): `collectWorldBook` resolved members with
 * a raw `Set.has(s.id)`, so a numeric save id against a string `settlementIds` (or the
 * reverse) collected ZERO dossiers and the paid World Book printed an empty book.
 * Nine sibling sites in src/ already coerce both ends with `String`.
 */
describe('member ids resolve across the id-type seam', () => {
  const member = (id, name) => ({ id, name, settlement: { name, tier: 'town', population: 1500 } });

  it('NUMERIC save ids resolve against STRING settlementIds', () => {
    const wb = collectWorldBook({ id: 'w1', name: 'WB', settlementIds: ['1', '2'] }, [member(1, 'Ashford'), member(2, 'Grimhold')]);
    expect(wb.dossiers.map(d => d.name)).toEqual(['Ashford', 'Grimhold']);
  });

  it('STRING save ids resolve against NUMERIC settlementIds', () => {
    const wb = collectWorldBook({ id: 'w2', name: 'WB', settlementIds: [1, 2] }, [member('1', 'Ashford'), member('2', 'Grimhold')]);
    expect(wb.dossiers.map(d => d.name)).toEqual(['Ashford', 'Grimhold']);
  });

  it('a genuine non-member is still excluded (the coercion is not a wildcard)', () => {
    const wb = collectWorldBook({ id: 'w3', name: 'WB', settlementIds: ['1'] }, [member(1, 'Ashford'), member(2, 'Grimhold')]);
    expect(wb.dossiers.map(d => d.name)).toEqual(['Ashford']);
  });
});

/**
 * THE REALM MAP'S SPRINGS. buildMapModel emits edges as `{from, to, type}` — the
 * shape graphLayout's forceLayout reads (:111-112) and the shape the campaign PDF's
 * own map hands it verbatim (generateCampaignPDF.js:336-339). The World Book's map
 * chapter alone REMAPPED them to `{source, target, type}` on the way in, so
 * `indexById.get(undefined)` missed on every edge and forceLayout `continue`d past
 * all of them: EVERY spring in the force simulation was silently dropped, and the
 * realm map was laid out as if no settlement were connected to any other.
 *
 * It is invisible below 9 settlements — autoLayout returns circularLayout for ≤8 and
 * ignores edges entirely — which is why a small fixture could never catch it. These
 * pins therefore use a NINE-settlement realm, the smallest that reaches the force
 * path, and read the edges the painter actually handed the layout (tests/utils/
 * graphLayout.determinism.test.js pins the sink itself: a `{source,target}` edge set
 * lays out identically to no edges at all).
 */
describe('the realm map hands the layout edges it can actually read (9+ settlements)', () => {
  function ringRealm() {
    const ids = Array.from({ length: 9 }, (_, i) => `ring-${i}`);
    const saves = ids.map((id, i) => ({
      id,
      name: `Hold ${i}`,
      settlement: {
        name: `Hold ${i}`, tier: 'town', population: 900,
        neighbourNetwork: [{ id: ids[(i + 1) % ids.length], relationshipType: 'trade_partner' }],
      },
    }));
    return { campaign: { id: 'ring', name: 'The Ring', settlementIds: ids }, saves };
  }

  it('the map model itself carries {from,to} edges (the producer is not the defect)', () => {
    const { campaign, saves } = ringRealm();
    const book = collectWorldBook(campaign, saves, {});
    expect(book.map.nodes).toHaveLength(9);
    expect(book.map.edges).toHaveLength(9);
    for (const e of book.map.edges) {
      expect(typeof e.from).toBe('string');
      expect(typeof e.to).toBe('string');
    }
  });

  it('the painter hands those edges to autoLayout UNCHANGED — every spring survives', async () => {
    const { campaign, saves } = ringRealm();
    const book = collectWorldBook(campaign, saves, {});
    const file = 'world-book-the-ring.pdf';
    autoLayout.mockClear();
    try {
      await generateWorldBook(campaign, saves, { mode: 'dm', now: '1/1/2026', loadFace });
    } finally {
      rmSync(file, { force: true });
    }
    expect(autoLayout).toHaveBeenCalled();
    const [, edgesPassed] = autoLayout.mock.calls[autoLayout.mock.calls.length - 1];
    expect(edgesPassed).toHaveLength(9);
    // Every endpoint the layout will read must be a real node id — the exact
    // resolution forceLayout performs before it decides to keep or drop a spring.
    const nodeIds = new Set(book.map.nodes.map(n => String(n.id)));
    for (const e of edgesPassed) {
      expect(nodeIds.has(String(e.from))).toBe(true);
      expect(nodeIds.has(String(e.to))).toBe(true);
    }
  });
});

/**
 * THE WORLD BOOK IS A PAID EXPORT THAT REPORTED NOTHING WHEN IT SUCCEEDED.
 *
 * Both siblings emit PDF_EXPORT_COMPLETED the moment the download is triggered —
 * generateSettlementPDF.js after `a.click()`, generateCampaignPDF.js after
 * `doc.save()` — and this lane's repair 12 gave all three exports their intent
 * counterpart (PDF_EXPORT_CLICKED, emitted for the World Book at
 * CampaignFolder.jsx:147). The World Book emitted NO completion at all, so the
 * campaign scope carried an intent count whose completion count was missing one of
 * its two producers: every World Book a buyer successfully downloaded read, in the
 * funnel, as an export that was asked for and never arrived.
 *
 * Funnel consistency, not a new capability: same event, same moment in the flow,
 * same payload SHAPE the campaign sibling already emits (`canon_phase` is omitted at
 * campaign scope because a multi-settlement export has no single phase, and there is
 * no narrative variant).
 */
describe('a completed World Book reports itself (the funnel numerator)', () => {
  it('emits PDF_EXPORT_COMPLETED once, with the campaign-scope payload shape', async () => {
    const { campaign, saves } = fixtureCampaign();
    const file = 'world-book-the-long-winter.pdf';
    track.mockClear();
    try {
      await generateWorldBook(campaign, saves, { mode: 'dm', now: '1/1/2026', loadFace });
    } finally {
      rmSync(file, { force: true });
    }
    const completed = track.mock.calls.filter(([name]) => name === EVENTS.PDF_EXPORT_COMPLETED);
    // anchored: exactly one per export — not zero, and not a double-fire that would
    // over-count the numerator against PDF_EXPORT_CLICKED.
    expect(completed).toHaveLength(1);
    const [, props] = completed[0];
    expect(props).toMatchObject({ scope: 'campaign', narrative_mode: false });
    expect(typeof props.duration_band).toBe('string');
    // The campaign sibling omits canon_phase at this scope; the shapes must match.
    expect(props).not.toHaveProperty('canon_phase'); // anchored: toMatchObject({ scope, narrative_mode }) above proves props is the live COMPLETED payload
  });

  it('the player face reports too (both faces are real exports)', async () => {
    const { campaign, saves } = fixtureCampaign();
    const file = 'world-book-the-long-winter-player.pdf';
    track.mockClear();
    try {
      await generateWorldBook(campaign, saves, { mode: 'player', now: '1/1/2026', loadFace });
    } finally {
      rmSync(file, { force: true });
    }
    expect(track.mock.calls.filter(([n]) => n === EVENTS.PDF_EXPORT_COMPLETED)).toHaveLength(1);
  });
});

/**
 * THE SAME CAP LATENCY, ON THE BOUND BOOK. `slugify(title, { max: 40 })` edge-trims
 * BEFORE it caps, so a title whose 40th character is a separator downloads as
 * `world-book-…-cliffs-.pdf`. Cured at this call site, exactly as the dossier
 * exporter was (repair 10) and the campaign exporter is — the kernel is deliberately
 * untouched, because several call sites mint PERSISTED ids through its `max`.
 */
describe('the World Book filename cap never leaves a dangling separator', () => {
  const LONG = 'Thornbury Under The Everwatchful Cliffs Of Old Kingsmoor And The Sundered Vale';

  it('a long book title is capped at 40 and trimmed clean', async () => {
    const trimmed = 'world-book-thornbury-under-the-everwatchful-cliffs.pdf';
    const dangling = 'world-book-thornbury-under-the-everwatchful-cliffs-.pdf';
    let saved = null;
    try {
      await generateWorldBook({ id: 'wb-slug', name: LONG, settlementIds: [] }, [], { mode: 'dm', now: '1/1/2026', loadFace });
      if (existsSync(trimmed)) saved = trimmed;
      else if (existsSync(dangling)) saved = dangling;
    } finally {
      rmSync(trimmed, { force: true });
      rmSync(dangling, { force: true });
    }
    // anchored: a book really was painted and saved under one of the two candidates.
    expect(saved).not.toBeNull();
    const slug = saved.replace(/^world-book-/, '').replace(/\.pdf$/, '');
    expect(slug.length).toBeLessThanOrEqual(40);
    expect(slug.endsWith('-')).toBe(false);
    expect(slug.startsWith('thornbury-under-the')).toBe(true);
  });
});
