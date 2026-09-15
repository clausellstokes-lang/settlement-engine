/**
 * @vitest-environment jsdom
 *
 * tests/components/scribeSurveyNotes.test.jsx — THE DM'S SURVEY NOTES (chair ruling 6; W4 car 4).
 *
 * Ruling 6 has two halves and the second is a refusal: refused units are SILENTLY the corpus on the
 * player page, and on the DM page the verdicts are readable as a REPORT — but "the archiver's hand
 * vs the survey's is NOT printed: the reader is not told which line a model wrote." So the arms
 * below pin what the panel says (which POOL, what happened, on which arms) and just as hard what it
 * never says and where it never appears.
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';

afterEach(cleanup);

const { storeRef } = vi.hoisted(() => ({ storeRef: { current: {} } }));

vi.mock('../../src/store/index.js', () => ({
  useStore: Object.assign(
    (selector) => selector(storeRef.current),
    { getState: () => storeRef.current },
  ),
}));

import { setFlagOverride } from '../../src/lib/flags.js';
import { landBlock, landReceipts, surveyNotesOf } from '../../src/lib/scribeArtefact.js';
import ScribeSurveyNotes from '../../src/components/dossier/ScribeSurveyNotes.jsx';

const KEYS = {
  advanceSeq: 0, renderedFor: 'seed-a', renderedAt: '2026-09-14T00:00:00.000Z',
  version: { engine: 'gen-1/sim-1' },
};

/** An artefact whose defense tab landed one PATCHED unit and refused one pool outright. */
function surveyed() {
  let prose = landBlock(null, {
    ...KEYS,
    blockId: 'DS-DEF-2',
    pools: { 'FAMILY: acute crisis': [{ vid: 3, spine: 'The watch keeps a short roll.', faces: [], notebook: [] }] },
    tab: 'defense',
    receipts: [{
      blockId: 'DS-DEF-2',
      poolKey: 'FAMILY: acute crisis',
      vid: 3,
      verdict: 'PATCHED',
      arms: ['T1-RECORD'],
      patched: ['face 1'],
    }],
  });
  prose = landReceipts(prose, {
    advanceSeq: 0,
    tab: 'defense',
    receipts: [{
      blockId: 'DS-DEF-5', poolKey: 'FORCE: militia', vid: 1, verdict: 'FAIL', arms: ['A6', 'WALL-10'], patched: [],
    }],
  });
  return prose;
}

function seat(prose = surveyed()) {
  storeRef.current = { settlement: { id: 't', _seed: 'seed-a', prose } };
}

afterEach(() => setFlagOverride('scribe', undefined));

describe('THE RECEIPTS ARE KEPT WHERE A REFUSED POOL CAN STILL BE FOUND', () => {
  test('a pool that landed NO block still has a row: it is the row a DM opens the notes for', () => {
    const notes = surveyNotesOf(surveyed());
    expect(notes.total).toBe(2);
    expect(notes.counts).toEqual({ failed: 1, patched: 1, withheld: 0 });
    const rows = notes.tabs[0].rows;
    expect(notes.tabs[0].tab).toBe('defense');
    expect(rows.map((r) => `${r.blockId}:${r.verdict}`)).toEqual(['DS-DEF-2:PATCHED', 'DS-DEF-5:FAIL']);
  });

  test('two rows for one pool become ONE, worst verdict and unioned arms', () => {
    // A unit earns a row from each reader. Two rows would read as two problems.
    const prose = landReceipts(surveyed(), {
      advanceSeq: 0,
      tab: 'defense',
      receipts: [{
        blockId: 'DS-DEF-2', poolKey: 'FAMILY: acute crisis', vid: 3, verdict: 'FAIL', arms: ['Q'], patched: [],
      }],
    });
    const rows = surveyNotesOf(prose).tabs[0].rows;
    expect(rows).toHaveLength(2);
    const merged = rows.find((r) => r.blockId === 'DS-DEF-2');
    expect(merged.verdict).toBe('FAIL');
    expect(merged.arms).toEqual(['Q', 'T1-RECORD']);
  });

  test('a PASS is not a note: the ordinary case would bury the three rows that matter', () => {
    const prose = landReceipts(surveyed(), {
      advanceSeq: 0,
      tab: 'overview',
      receipts: [{ blockId: 'DS-GEN-3', poolKey: 'prosperity: ok', vid: 9, verdict: 'PASS', arms: [], patched: [] }],
    });
    const notes = surveyNotesOf(prose);
    expect(notes.total).toBe(2);
    expect(notes.tabs.map((t) => t.tab)).toEqual(['defense']);
  });

  test('a receipt for another epoch is refused, so a stale tab cannot file against a fresh survey', () => {
    const prose = landReceipts(surveyed(), {
      advanceSeq: 9,
      tab: 'power',
      receipts: [{ blockId: 'DS-POW-1', poolKey: 'x', vid: 1, verdict: 'FAIL', arms: ['D'], patched: [] }],
    });
    expect(surveyNotesOf(prose).total).toBe(2);
  });

  test('an artefact with no survey at all, and a settlement with none, are both quiet', () => {
    expect(surveyNotesOf(null).total).toBe(0);
    expect(surveyNotesOf(landBlock(null, { ...KEYS, blockId: 'B', pools: { p: [] } })).total).toBe(0);
  });
});

describe('⛔ THE PANEL IS ABSENT DARK, AND ABSENT WHEREVER IT WOULD BE THE WRONG READER', () => {
  test('with no override at all (the shipped default) nothing renders', () => {
    seat();
    expect(render(<ScribeSurveyNotes />).container.innerHTML).toBe('');
  });

  test('with the flag explicitly dark, still nothing', () => {
    setFlagOverride('scribe', false);
    seat();
    expect(render(<ScribeSurveyNotes />).container.innerHTML).toBe('');
  });

  test('never on the player page and never on the public projection', () => {
    setFlagOverride('scribe', true);
    seat();
    expect(render(<ScribeSurveyNotes playerView />).container.innerHTML).toBe('');
    cleanup();
    expect(render(<ScribeSurveyNotes publicDossier />).container.innerHTML).toBe('');
  });

  test('and quiet on a survey with nothing to report', () => {
    setFlagOverride('scribe', true);
    seat(landBlock(null, { ...KEYS, blockId: 'B', pools: { p: [{ vid: 1, spine: 'x', faces: [], notebook: [] }] } }));
    expect(render(<ScribeSurveyNotes />).container.innerHTML).toBe('');
  });
});

describe('LIT ON THE DM PAGE', () => {
  test('it is COLLAPSED by default and says how the survey went in one line', () => {
    setFlagOverride('scribe', true);
    seat();
    render(<ScribeSurveyNotes />);
    const handle = screen.getByRole('button');
    expect(handle.getAttribute('aria-expanded')).toBe('false');
    expect(handle.textContent).toBe('Survey notes (1 drawn from the written corpus, 1 with one line replaced)');
    expect(screen.queryByText(/FAMILY: acute crisis/)).toBe(null);
  });

  test('opened, a PATCHED row names its SEAT and its ARMS as the refuter prints them', () => {
    setFlagOverride('scribe', true);
    seat();
    render(<ScribeSurveyNotes />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText(
      'FAMILY: acute crisis: kept, with a line replaced by the written corpus at face 1 (T1-RECORD)',
    )).toBeTruthy();
    expect(screen.getByText('FORCE: militia: fell to the written corpus (A6, WALL-10)')).toBeTruthy();
    expect(screen.getByText('Defense')).toBeTruthy();
  });

  test('⛔ IT NEVER TELLS THE READER WHICH LINE A MODEL WROTE, and carries no em dash', () => {
    setFlagOverride('scribe', true);
    seat();
    const { container } = render(<ScribeSurveyNotes />);
    fireEvent.click(screen.getByRole('button'));
    const text = container.textContent;
    // The E2 ratchet: a report about prose keeps the same mark bar as the prose it reports on.
    expect(text.includes('—')).toBe(false);
    // Ruling 6's second half: no line is marked as the model's or as the archiver's.
    for (const forbidden of ['AI', 'model wrote', 'machine-written', 'generated by']) {
      expect(text.includes(forbidden), `the panel must not say ${forbidden}`).toBe(false);
    }
    expect(text).toMatch(/Every line on this dossier is the archiver's\./);
  });
});
