/** @vitest-environment jsdom */
/**
 * npcCardStandingServed.test.jsx — THE CARD'S WEIGHT ON A SERVED PAGE (PAGE-4 CARD-SERVED; the chair's condition (1) of
 * 14:17 UTC, 2026-11-20; docs/chair/2026-11-20/content/page/briefs/CARD-SERVED.md).
 *
 * The chair, verbatim: "THE WEIGHT ON A SERVED PAGE: it is ranked among the powers the document in hand holds; if that
 * document carries no power figure for a power (a served page may withhold raw measures), the row prints 'first of
 * <power>' WITH NO WEIGHT: a test on a made-up served document, red first."
 *
 *   (a) a power the document's roster HOLDS with no `power` figure: the card first of it prints "first of <power>" with no
 *       weight (the card's Standing row, `cardStandingLine`, the view model's `standingLine` and `firstOfLine`, the
 *       journal's "First of" row); the ranking counts only the powers with a figure.
 *   (b) FAIL CLOSED: a power the card's membership names that the document's roster does NOT hold (withheld) is never
 *       named in the row, and the row is absent when it was the only one.
 *
 * MADE-UP documents only; no pool sentence.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render } from '@testing-library/react';

vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('../../src/lib/saves.js', () => ({ saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false } }));

import { NPCInlineCard } from '../../src/components/new/npcComponents.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { buildJournalPages, esc } from '../../src/foundry/journalPages.js';
import { cardStandingLine, cardFirstOfWeights } from '../../src/domain/display/cardStandingRead.js';
import { useStore } from '../../src/store/index.js';

afterEach(cleanup);

beforeAll(() => {
  if (typeof window !== 'undefined' && !window.matchMedia) {
    // @ts-ignore jsdom has no matchMedia
    window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
  }
});

/** @param {any} n @param {any} t @returns {string | null} the card's Standing row as rendered */
function standingRowOf(n, t) {
  act(() => { useStore.setState({ settlement: t, savedSettlements: [], editMode: false }); });
  const r = render(<NPCInlineCard npc={n} settlement={t} />);
  fireEvent.click(r.getByRole('button', { expanded: false }));
  const row = [...r.container.querySelectorAll('div')].map((d) => d.textContent || '').find((s) => s.startsWith('Standing ')) ?? null;
  r.unmount();
  return row;
}

/** the view model's row and the journal's lines for one person (every row raised to a notable page) @param {any} t @param {string} name */
function printedFor(t, name) {
  const vm = buildViewModel({ settlement: t });
  const rows = (vm.npcs?.sorted || []).map((/** @type {any} */ r) => ({ ...r, power: 100 }));
  const row = rows.find((/** @type {any} */ r) => r.name === name);
  const journal = buildJournalPages({ ...vm, npcs: { ...vm.npcs, sorted: rows } }).map((/** @type {any} */ p) => String(p.markdown)).join('\n');
  const firstOfRows = journal.split('\n').filter((l) => l.startsWith('- **First of:**'));
  return { row, journal, firstOfRows };
}

/** A made-up SERVED document: its roster holds three powers, the Temple's figure withheld. @param {any[]} npcs */
const served = (npcs) => ({
  id: 'served-1', name: 'Fernhollow', npcs, relationships: [],
  powerStructure: {
    factions: [
      { faction: 'Council', power: 50, category: 'civic' },
      { faction: 'Guilds', power: 30, category: 'economic' },
      { faction: 'Temple', category: 'religious' },
    ],
    conflicts: [],
  },
  history: { age: 140, founding: null, historicalCharacter: '', eventsTimeline: [], currentTensions: [], historicalEvents: [] },
});

describe('(a) a power the served document holds with no figure: "first of <power>", no weight', () => {
  const tam = { id: 'npc_0', name: 'Tam Vell', title: 'the sexton', role: 'the sexton', memberships: [{ power: 'Temple', rank: 1 }] };
  const una = { id: 'npc_1', name: 'Una Marsh', title: 'the alderwoman', role: 'the alderwoman', memberships: [{ power: 'Temple', rank: 1 }, { power: 'Council', rank: 1 }] };
  const gil = { id: 'npc_2', name: 'Gil Fane', title: 'the factor', role: 'the factor', memberships: [{ power: 'Guilds', rank: 1 }] };
  const t = served([tam, una, gil]);

  it('the reader: the part kept, with no weight; two parts mix', () => {
    expect(cardStandingLine(tam, t)).toBe('first of Temple');
    expect(cardFirstOfWeights(tam, t)).toEqual([{ power: 'Temple', weightHere: null }]);
    expect(cardStandingLine(una, t)).toBe('first of Council, the stronger power here; first of Temple');
  });
  it('the ranking counts only the powers with a figure (the figureless Temple is not counted)', () => {
    expect(cardStandingLine(gil, t)).toBe('first of Guilds, the weaker power here');
  });
  it('THE CARD: the Standing row', () => {
    expect(standingRowOf(tam, t)).toBe('Standing first of Temple');
    expect(standingRowOf(una, t)).toBe('Standing first of Council, the stronger power here; first of Temple');
  });
  it('THE PDF and THE FOUNDRY JOURNAL: the view row\'s standingLine and firstOfLine, the journal\'s "First of" row', () => {
    const forTam = printedFor(t, 'Tam Vell');
    expect(forTam.row?.standingLine).toBe('first of Temple');
    expect(forTam.row?.firstOfLine).toBe('Temple');
    expect(forTam.firstOfRows).toContain(`- **First of:** ${esc('Temple')}`);
    const forUna = printedFor(t, 'Una Marsh');
    expect(forUna.row?.firstOfLine).toBe('Council, the stronger power here; Temple');
    expect(forUna.firstOfRows).toContain(`- **First of:** ${esc('Council, the stronger power here; Temple')}`);
  });
});

describe('(b) FAIL CLOSED: a power the served document withholds from its roster is never named in the row', () => {
  const HIDDEN = 'Shadow Hand';
  const vel = { id: 'npc_3', name: 'Vel Crane', title: 'the fence', role: 'the fence', memberships: [{ power: HIDDEN, rank: 1 }] };
  const wyn = { id: 'npc_4', name: 'Wyn Ash', title: 'the reeve', role: 'the reeve', memberships: [{ power: HIDDEN, rank: 1 }, { power: 'Council', rank: 1 }] };
  const t = served([vel, wyn]);

  it('the only first-of withheld: no row at all, on every surface', () => {
    expect(cardStandingLine(vel, t)).toBeNull();
    expect(cardFirstOfWeights(vel, t)).toEqual([]);
    expect(standingRowOf(vel, t)).toBeNull();
    const { row } = printedFor(t, 'Vel Crane');
    expect(row?.standingLine ?? null).toBeNull();
    expect(row?.firstOfLine ?? null).toBeNull();
  });
  it('beside a held power: the row names only the held one', () => {
    expect(cardStandingLine(wyn, t)).toBe('first of Council, the stronger power here');
    expect(standingRowOf(wyn, t)).toBe('Standing first of Council, the stronger power here');
    const { row, firstOfRows } = printedFor(t, 'Wyn Ash');
    expect(row?.standingLine).toBe('first of Council, the stronger power here');
    expect(row?.firstOfLine).toBe('Council, the stronger power here');
    for (const l of firstOfRows) expect(l.includes(HIDDEN), `the journal's "${l}"`).toBe(false);
  });
});
