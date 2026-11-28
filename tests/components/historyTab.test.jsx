/** @vitest-environment jsdom */
/**
 * historyTab.test.jsx — Major Historical Events card honesty pins.
 *
 * The card used to render `description.slice(0,55) + '…'` as its ONLY body
 * and never rendered `evt.name` at all — virtually every event (descriptions
 * run 66–117 chars) showed a mid-word fragment and the expanded block never
 * revealed the rest. These pins lock the fix: the event's name is the card
 * title (type label when unnamed) and the description always reads in full.
 */

import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { foodStoresWords } from '../../src/domain/summary/tonightSheet.js';
import { criticalImportRow } from '../../src/domain/display/stateProse/economyStateProse.js';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { HistoryTab } from '../../src/components/new/tabs/HistoryTab.jsx';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { HISTORICAL_EVENTS_DATA } from '../../src/data/historyData.js';
import { SCARCITY_STORED_LIVE, SCARCITY_STORED_PAST } from '../../src/domain/display/tensionDescriptionShown.js';

const LONG_DESC =
  'Rights to the local iron deposits became the subject of a prolonged dispute between the settlement and a rival lord.';

function settlementWith(events) {
  return {
    name: 'Briarwatch',
    history: {
      age: 140,
      founding: null,
      historicalCharacter: '',
      eventsTimeline: [],
      currentTensions: [],
      historicalEvents: events,
    },
  };
}

afterEach(cleanup);

// The events fold is OPEN on first paint since the timeline became its header (chair ruling
// H6, 2026-10-30), so no click is needed; this asserts the fold's title is there instead.
function openMajorEvents(count = 1) {
  expect(screen.getByText(`Major Historical Events (${count})`)).toBeTruthy();
}

describe('HistoryTab Major Historical Events card', () => {
  it('renders the event name as the title and the >55-char description in full', () => {
    expect(LONG_DESC.length).toBeGreaterThan(55);
    render(<HistoryTab settlement={settlementWith([{
      type: 'economic',
      name: 'The Iron Dispute',
      description: LONG_DESC,
      yearsAgo: 38,
      severity: 'major',
      lastingEffects: ['Iron production rights still legally contested'],
      plotHooks: ['An old deed to the iron rights has resurfaced'],
      anchored: false,
    }])} />);
    openMajorEvents();

    expect(screen.getByText('The Iron Dispute')).toBeTruthy();
    expect(screen.getByText(LONG_DESC)).toBeTruthy();
    // The old mid-word snippet must be gone.
    expect(screen.queryByText(`${LONG_DESC.slice(0, 55)}…`)).toBeNull();
  });

  it('keeps the full description readable when the card is expanded', () => {
    render(<HistoryTab settlement={settlementWith([{
      type: 'economic',
      name: 'The Iron Dispute',
      description: LONG_DESC,
      yearsAgo: 38,
      lastingEffects: ['Iron production rights still legally contested'],
      plotHooks: [],
    }])} />);
    openMajorEvents();

    fireEvent.click(screen.getByText(LONG_DESC)); // expand the card
    expect(screen.getByText(LONG_DESC)).toBeTruthy();
    expect(screen.getByText('Iron production rights still legally contested')).toBeTruthy();
  });

  it('falls back to the type label as title when the event has no name', () => {
    render(<HistoryTab settlement={settlementWith([{
      type: 'economic',
      description: LONG_DESC,
      yearsAgo: 12,
    }])} />);
    openMajorEvents();

    expect(screen.getByText('Economic')).toBeTruthy();
    expect(screen.getByText(LONG_DESC)).toBeTruthy();
  });

  it('renders a campaign-era stamp (stressor aftermath shape) whole', () => {
    const campaignDesc =
      'The Saltmarsh Banditry gripped the settlement during the campaign and has passed into memory — burned waystations linger.';
    render(<HistoryTab settlement={settlementWith([{
      campaignEventId: 'campaign.echo-1.4',
      campaignEra: true,
      tick: 4,
      yearsAgo: 0,
      name: 'The Saltmarsh Banditry',
      type: 'external_threat',
      description: campaignDesc,
      severity: 'major',
      lastingEffects: ['burned waystations'],
      plotHooks: [],
      anchored: true,
    }])} />);
    openMajorEvents();

    expect(screen.getByText('The Saltmarsh Banditry')).toBeTruthy();
    expect(screen.getByText(campaignDesc)).toBeTruthy();
  });
});

/**
 * THE CONSOLIDATED HISTORY PAGE (chair rulings H1, H5-H9; X-2, 2026-10-30): no count span in
 * the header (the section titles carry the counts), no Recent Events slice (the Chronicle owns
 * the feed), the timeline drawn once as the events' header with ONE still-relevant mark (the
 * big dot), Founding open on first paint, and no inline plot hooks on tensions or events.
 */
describe('HistoryTab — the consolidated page', () => {
  const town = () => ({
    name: 'Briarwatch',
    history: {
      age: 140,
      founding: { reason: 'A ford on the salt road', foundedBy: 'Three drover families' },
      historicalCharacter: 'A town that never forgave the flood.',
      eventsTimeline: [
        { name: 'The Iron Dispute', type: 'economic', yearsAgo: 38, anchored: true },
        { name: 'The Long Siege', type: 'military', yearsAgo: 90, anchored: false },
      ],
      currentTensions: [{ type: 'guild_conflict', description: 'The tanners and the dyers share one stream.', severity: 'major', plotHooks: ['A dyer asks the party to foul the tannery outflow.'] }],
      historicalEvents: [
        { type: 'economic', name: 'The Iron Dispute', description: LONG_DESC, yearsAgo: 38, anchored: true, lastingEffects: ['Rights still contested'], plotHooks: ['An old deed to the iron rights has resurfaced.'] },
        { type: 'military', name: 'The Long Siege', description: 'The walls held for a winter.', yearsAgo: 90, anchored: false, plotHooks: [] },
      ],
    },
  });
  const recent = [{ id: 'e1', title: 'Market burned', summary: 'The east market burned in the night.', source: 'world' }];

  it('the header carries no count span, and no Recent Events slice renders', () => {
    const { container } = render(<HistoryTab settlement={town()} recentEvents={recent} />);
    const text = container.textContent;
    const anchor = 'Major Historical Events (2)';
    expect(text).toContain(anchor);
    expect(text).toContain('Current Tensions (1)');
    expectAbsentWithAnchor(text, 'historical events ·', anchor, 'H1 count span');
    expectAbsentWithAnchor(text, 'Recent Events', anchor, 'H5 Recent Events');
    expectAbsentWithAnchor(text, 'The east market burned in the night.', anchor, 'H5 feed row');
  });

  it('the timeline is the events block\'s header, with one still-relevant mark', () => {
    const { container } = render(<HistoryTab settlement={town()} />);
    const timeline = screen.getByTestId('history-timeline');
    // Drawn once, inside the events fold, above the first card.
    expect(container.querySelectorAll('[data-testid="history-timeline"]')).toHaveLength(1);
    const text = container.textContent;
    const follows = (a, b) => !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    expect(follows(screen.getByText('Major Historical Events (2)'), timeline)).toBe(true);
    expect(follows(timeline, screen.getByText('The Iron Dispute'))).toBe(true);
    // The big dot says "still relevant" in its own title; the legend mark and the banner are gone.
    expect(timeline.querySelector('[title*="still relevant today"]')).toBeTruthy();
    expectAbsentWithAnchor(text, 'Still relevant today ()', 'The Iron Dispute', 'H6 legend defect');
    expectAbsentWithAnchor(text, 'Still relevant today', 'The Iron Dispute', 'H9 anchored banner');
  });

  it('Founding is open on first paint, and tensions and events carry no plot hooks', () => {
    const { container } = render(<HistoryTab settlement={town()} />);
    expect(screen.getByText('A ford on the salt road')).toBeTruthy();
    fireEvent.click(screen.getByText(LONG_DESC)); // expand the event: lasting effects only
    const text = container.textContent;
    expect(text).toContain('Rights still contested');
    expectAbsentWithAnchor(text, 'A dyer asks the party to foul the tannery outflow.', 'The tanners and the dyers share one stream.', 'H7 tension hooks (X-2)');
    expectAbsentWithAnchor(text, 'An old deed to the iron rights has resurfaced.', 'Rights still contested', 'H9 event hooks (X-2)');
    expectAbsentWithAnchor(text, 'Plot hooks', 'Rights still contested', 'the inline hooks kicker');
  });
});

/**
 * X-14b (the owner, 2026-10-30): "Still relevant today" is a HOOK MARKER for the DM. An event
 * wears it when it carries an open thread: it has a plot hook, or a current tension cites it
 * by name. The generator's `anchored` flag is template provenance and is NOT read; age,
 * severity and the character line play no part. The timeline's big dot is the one mark.
 */
describe('HistoryTab — the still-relevant mark is a hook marker (X-14b)', () => {
  const town = () => ({
    name: 'Briarwatch',
    history: {
      age: 300, founding: null, historicalCharacter: 'The Old Flood made this town.',
      eventsTimeline: [
        { name: 'The Old Flood', type: 'natural_disaster', yearsAgo: 150, anchored: true },
        { name: 'The Tithe Riot', type: 'political', yearsAgo: 220, anchored: false },
        { name: 'The Salt Pact', type: 'economic', yearsAgo: 12, anchored: false },
      ],
      currentTensions: [{ type: 'guild_conflict', description: 'The guilds still quarrel over what The Tithe Riot settled.' }],
      historicalEvents: [
        { name: 'The Old Flood', type: 'natural_disaster', yearsAgo: 150, severity: 'minor', anchored: true, plotHooks: [], description: 'The river rose.' },
        { name: 'The Tithe Riot', type: 'political', yearsAgo: 220, severity: 'minor', anchored: false, plotHooks: [], description: 'A riot over tithes.' },
        { name: 'The Salt Pact', type: 'economic', yearsAgo: 12, severity: 'minor', anchored: false, plotHooks: ['A copy of the pact is missing a clause.'], description: 'A trade pact.' },
      ],
    },
  });
  const YEARS = { 'The Old Flood': 150, 'The Tithe Riot': 220, 'The Salt Pact': 12 };
  const dot = (container, name) => [...container.querySelectorAll('[data-testid="history-timeline"] [title]')]
    .find((n) => n.getAttribute('title').includes(`- ${YEARS[name]}y ago`));

  it('a 150-year-old minor event with no hook and no citing tension loses the mark, even when anchored and named by the character line', () => {
    const { container } = render(<HistoryTab settlement={town()} />);
    expect(dot(container, 'The Old Flood'), 'no dot for The Old Flood').toBeTruthy();
    expect(dot(container, 'The Old Flood').getAttribute('title')).not.toMatch(/still relevant today/); // anchored: the two arms below prove the same render marks other events
  });

  it('an event a current tension cites by name, and an event with a plot hook, both wear it', () => {
    const { container } = render(<HistoryTab settlement={town()} />);
    expect(dot(container, 'The Tithe Riot').getAttribute('title')).toMatch(/still relevant today/);
    expect(dot(container, 'The Salt Pact').getAttribute('title')).toMatch(/still relevant today/);
  });
});

describe('the print history chapter marks the same events (X-14b, chair item 3)', () => {
  function collectText(node, out = []) {
    if (node == null || typeof node === 'boolean') return out;
    if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
    if (Array.isArray(node)) { for (const n of node) collectText(n, out); return out; }
    if (typeof node === 'object') {
      if (typeof node.type === 'function') return collectText(node.type(node.props), out);
      return collectText(node.props?.children, out);
    }
    return out;
  }
  it('HistoryFounding spells "Still relevant today" on exactly the events the screen marks', async () => {
    const { HistoryFounding } = await import('../../src/pdf/sections/HistoryFounding.jsx');
    const { eventHasOpenThread } = await import('../../src/domain/display/historyOpenThreads.js');
    const h = {
      age: 300, historicalCharacter: null, founding: {},
      events: [
        { title: 'The Old Flood', type: 'natural_disaster', yearsAgo: 150, severity: 'minor', hooks: [], lastingEffects: [] },
        { title: 'The Tithe Riot', type: 'political', yearsAgo: 220, severity: 'minor', hooks: [], lastingEffects: [] },
        { title: 'The Salt Pact', type: 'economic', yearsAgo: 12, severity: 'minor', hooks: ['A clause is missing.'], lastingEffects: [] },
      ],
      tensions: [{ label: 'guild_conflict', description: 'The guilds still quarrel over what The Tithe Riot settled.', hooks: [] }],
      timeline: [],
    };
    const texts = collectText(HistoryFounding({ settlement: { name: 'Briarwatch' }, vm: { history: h }, stateProse: null }));
    const marks = texts.filter((t) => t === 'Still relevant today').length;
    // The screen's derivation over the same record: the riot (cited) and the pact (hooked).
    const screen = [
      { name: 'The Old Flood', plotHooks: [] }, { name: 'The Tithe Riot', plotHooks: [] }, { name: 'The Salt Pact', plotHooks: ['A clause is missing.'] },
    ].filter((e) => eventHasOpenThread(e, { currentTensions: [{ description: h.tensions[0].description }] })).length;
    expect(screen).toBe(2);
    expect(marks).toBe(screen);
  });

  it('F12 (X-2): the print chapter prints no event or tension hook text; the Plot Hooks chapter is their one print home', async () => {
    const { HistoryFounding } = await import('../../src/pdf/sections/HistoryFounding.jsx');
    const h = {
      age: 300, historicalCharacter: null, founding: {},
      events: [{ title: 'The Salt Pact', type: 'economic', yearsAgo: 12, severity: 'minor', hooks: ['A clause is missing from the sealed copy.'], lastingEffects: ['Tolls halved'] }],
      tensions: [{ label: 'guild_conflict', description: 'The guilds still quarrel.', hooks: ['A guild clerk wants the old charter burned.'] }],
      timeline: [],
    };
    const text = collectText(HistoryFounding({ settlement: { name: 'Briarwatch' }, vm: { history: h }, stateProse: null })).join(' ');
    expectAbsentWithAnchor(text, 'A clause is missing from the sealed copy.', 'Tolls halved', 'F12 event hooks in print');
    expectAbsentWithAnchor(text, 'A guild clerk wants the old charter burned.', 'The guilds still quarrel.', 'F12 tension hooks in print');
    expectAbsentWithAnchor(text, 'Plot hooks', 'Still relevant today', 'the print hooks kicker');
  });
});

// R6 (RULING-R, the eleventh chair, 2026-11-27): the resource-scarcity tension's stored words name no good ("A critical
// resource …"), while the Economics tab names the one the record holds short (the DS-ECO shortfall line's reader,
// economyStateProse.js :: criticalImportRow). Where the record names the good, the tension prints a named twin; the
// stored string stays; where it names none, the line prints as stored.
describe('HistoryTab — the scarcity tension names the good the record holds short (R6)', () => {
  const PAST = 'A critical resource became scarce, causing hoarding and price gouging';
  const LIVE = 'A critical resource is running short, and some are hoarding it while others cannot pay the prices asked';
  const townWith = (description, imports) => ({
    ...settlementWith([]),
    history: { ...settlementWith([]).history, currentTensions: [{ type: 'resource_scarcity', description, factions: [], severity: ['minor'] }] },
    ...(imports ? { resourceAnalysis: { imports } } : {}),
  });
  const SAWMILL = { critical: ['timber', 'stone'], reasons: { timber: 'Required by Sawmill but not available in Plains terrain', stone: 'Plains terrain cannot produce this locally' } };
  it('both stored forms print the good by name, and the record keeps its words', () => {
    for (const [stored, shown] of [
      [PAST, 'A critical resource, timber, became scarce, causing hoarding and price gouging'],
      [LIVE, 'A critical resource, timber, is running short, and some are hoarding it while others cannot pay the prices asked'],
    ]) {
      const s = townWith(stored, SAWMILL);
      render(<HistoryTab settlement={s} />);
      expect(screen.getByText(shown)).toBeTruthy();
      expectAbsentWithAnchor(document.body.textContent || '', stored, shown);
      expect(s.history.currentTensions[0].description).toBe(stored);
      cleanup();
    }
  });
  it('the helper\'s two held sentences equal the table\'s, word for word (RULING 122-A-1: the table is not imported)', () => {
    const scarcity = HISTORICAL_EVENTS_DATA.find((e) => e.type === 'resource_scarcity');
    expect(SCARCITY_STORED_PAST).toBe(scarcity.description);
    expect(SCARCITY_STORED_LIVE).toBe(scarcity.byMemory.unanchored.description);
    expect([PAST, LIVE]).toEqual([SCARCITY_STORED_PAST, SCARCITY_STORED_LIVE]);
  });
  it('where the record names no short good, the stored words print as they are', () => {
    render(<HistoryTab settlement={townWith(PAST, null)} />);
    expect(screen.getByText(PAST)).toBeTruthy();
  });
  // RULING 122-A-2 (the independent reader, by rendering): in eleven towns of V the named good was grain while the same page's
  // stores line (`summary/tonightSheet.js :: foodStoresWords`) printed a full granary of grain. Where that reader reports a store
  // of the named good the stored, unnamed sentence prints; a good it does not store (C dp-town-4's grapes, beside a granary of
  // grain) is still named. Births as the corpora bear them (rmeasure/tools: `birthConfig(row.config)`, `{ seed, customContent: {} }`).
  describe('a birth: the good is not named where the page\'s own stores hold it', () => {
    beforeAll(async () => { await loadGenerationLawPayloads(); });
    const bear = (/** @type {any} */ config, /** @type {string} */ seed) => generateSettlementPipeline(birthConfig(config), null, { seed, customContent: {} });
    const scarcityOf = (/** @type {any} */ town) => town.history.currentTensions.find((/** @type {any} */ t) => t.type === 'resource_scarcity');
    it('V dp-city-21 (granary, about nine months of grain; the short good grain): the stored sentence prints, grain is not named', () => {
      const town = bear({ ...DEFAULT_CONFIG, settType: 'city', _randomizePriorities: true }, 'dp-city-21');
      expect(foodStoresWords(town.economicState.foodSecurity.foodRecord)).toBe('Stores: a granary, about nine months of grain.');
      expect(criticalImportRow(town.resourceAnalysis.imports)?.good).toBe('grain');
      expect(scarcityOf(town).description).toBe(LIVE);
      render(<HistoryTab settlement={town} />);
      expect(screen.getByText(LIVE)).toBeTruthy();
      expectAbsentWithAnchor(document.body.textContent || '', 'A critical resource, grain,', LIVE, 'a good the stores hold is not named');
      expect(scarcityOf(town).description).toBe(LIVE);
    });
    it('C dp-town-4 (granary of grain; the short good grapes): the good is still named', () => {
      const town = bear({ settType: 'town' }, 'dp-town-4');
      expect(foodStoresWords(town.economicState.foodSecurity.foodRecord)).toBe('Stores: a granary, about six months of grain.');
      expect(criticalImportRow(town.resourceAnalysis.imports)?.good).toBe('grapes');
      const stored = scarcityOf(town).description;
      expect([PAST, LIVE]).toContain(stored);
      render(<HistoryTab settlement={town} />);
      const named = `A critical resource, grapes, ${stored.slice('A critical resource '.length)}`;
      expect(screen.getByText(named)).toBeTruthy();
      expectAbsentWithAnchor(document.body.textContent || '', stored, named, 'a good the stores do not hold is named');
    });
  });
});
