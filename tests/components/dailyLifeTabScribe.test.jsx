/**
 * @vitest-environment jsdom
 *
 * tests/components/dailyLifeTabScribe.test.jsx — DAILY LIFE RENDERS BY DEFAULT (design §5c rule 4;
 * the owner, 2026-09-14 ~06:5x: "it is automatically default that the daily life tab be populated
 * rather than on command"; W4 car 3).
 *
 * ⛔ THE CONTROL RUNS BOTH WAYS, AND THE DARK ONE IS THE POINT. The lit arm proves the five beats
 * reach the page from the artefact and that the Generate button goes away with them; the DARK arm
 * proves the tab's markup is the SAME STRING it was with the flag off, on a town that is carrying a
 * full set of rendered beats. A feature that is dark only when nobody has used it is not dark.
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

afterEach(cleanup);

const { storeRef } = vi.hoisted(() => ({ storeRef: { current: {} } }));

vi.mock('../../src/store/index.js', () => ({
  useStore: Object.assign(
    (selector) => selector(storeRef.current),
    { getState: () => storeRef.current },
  ),
}));
vi.mock('../../src/hooks/useLivePricing.js', () => ({
  useLiveAiCostResolver: () => () => 4,
}));
vi.mock('../../src/lib/supabase.js', () => ({ isConfigured: true }));

import { setFlagOverride } from '../../src/lib/flags.js';
import { landBlock } from '../../src/lib/scribeArtefact.js';
import { DAILY_LIFE_BEATS, DAILY_LIFE_BLOCK, dailyLifeBeats } from '../../src/domain/prose/dailyLifeBeats.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import DailyLifeTab from '../../src/components/new/tabs/DailyLifeTab.jsx';

const BEAT_TEXT = Object.freeze([
  'The gate crew unbars the doors while the cart teams wait in the cold.',
  'The market square fills with the sound of the scale pans settling.',
  'At midday the council hall keeps its door open and its clerks busy.',
  'The taproom takes the afternoon shift in and the talk turns to the roads.',
  'By dark the watch walks the lanes and the shutters go up one street at a time.',
]);

function town(seed = 'daily-life-scribe') {
  return generateSettlementPipeline(
    { settType: 'town', culture: 'germanic' }, null, { seed, customContent: {} },
  );
}

/** A settlement carrying a full DS-DAILY block, keyed to its own seed and its own engine. */
function scribed(s, texts = BEAT_TEXT) {
  const renderedFor = String(s._seed ?? s.id ?? '');
  const pools = {};
  DAILY_LIFE_BEATS.forEach((beat, i) => {
    if (texts[i] === null) return;
    pools[beat] = [{ vid: 0, spine: texts[i], faces: [], notebook: [] }];
  });
  return {
    ...s,
    prose: landBlock(null, {
      advanceSeq: 0,
      blockId: DAILY_LIFE_BLOCK,
      pools,
      renderedFor,
      renderedAt: '2026-09-14T00:00:00.000Z',
      version: { engine: `gen-${String(s.generatorVersion ?? '')}/sim-${String(s.simulationVersion ?? '')}` },
    }),
  };
}

function seat() {
  storeRef.current = {
    requestDailyLife: () => {},
    aiDailyLife: null,
    aiLoading: false,
    aiRegenerating: false,
    aiError: null,
    aiProgress: '',
    creditBalance: 0,
  };
}

afterEach(() => setFlagOverride('scribe', undefined));

describe('⛔ DARK — the tab is byte-identical, even on a town whose beats are already rendered', () => {
  test('the markup with the flag off is the same string with and without an artefact', () => {
    seat();
    const s = town();
    const plain = render(<DailyLifeTab settlement={s} saveId="a" />).container.innerHTML;
    cleanup();
    const withArtefact = render(<DailyLifeTab settlement={scribed(s)} saveId="a" />).container.innerHTML;
    expect(withArtefact).toBe(plain);
  });

  test('and it still offers the Generate button and the empty state', () => {
    seat();
    render(<DailyLifeTab settlement={scribed(town())} saveId="a" />);
    expect(screen.getByRole('button').textContent).toMatch(/Generate Daily Life/);
    expect(screen.getByText(/What is daily life like here\?/)).toBeTruthy();
  });
});

describe('LIT — the five beats come off the artefact and the button goes away with them', () => {
  test('every rendered beat is on the page, under its own label', () => {
    setFlagOverride('scribe', true);
    seat();
    render(<DailyLifeTab settlement={scribed(town())} saveId="a" />);
    for (const text of BEAT_TEXT) expect(screen.getByText(text)).toBeTruthy();
    expect(screen.getByText('Dawn')).toBeTruthy();
    expect(screen.getByText('Night')).toBeTruthy();
  });

  test('the Generate / Regenerate button is gone: the survey-level Redraw covers it', () => {
    setFlagOverride('scribe', true);
    seat();
    const { container } = render(<DailyLifeTab settlement={scribed(town())} saveId="a" />);
    expect(container.querySelector('button')).toBe(null);
    expect(screen.queryByText(/What is daily life like here\?/)).toBe(null);
  });

  test('a beat that did not land falls back to ITS OWN offline paragraph, not to a hole', () => {
    setFlagOverride('scribe', true);
    seat();
    const s = town();
    const partial = [BEAT_TEXT[0], null, BEAT_TEXT[2], null, BEAT_TEXT[4]];
    render(<DailyLifeTab settlement={scribed(s, partial)} saveId="a" />);
    const offline = dailyLifeBeats(s);
    expect(screen.getByText(BEAT_TEXT[0])).toBeTruthy();
    expect(screen.getByText(offline[1])).toBeTruthy();
    expect(screen.getByText(offline[3])).toBeTruthy();
  });

  test('an artefact rendered for ANOTHER seed is not this town\'s, so the tab reads as dark', () => {
    setFlagOverride('scribe', true);
    seat();
    const s = town();
    const foreign = scribed({ ...s, _seed: 'some-other-town' });
    const { container } = render(<DailyLifeTab settlement={{ ...foreign, _seed: s._seed }} saveId="a" />);
    expect(container.querySelector('button')).toBeTruthy();
    expect(screen.queryByText(BEAT_TEXT[0])).toBe(null);
  });

  test('an artefact from an engine the world has migrated past is not drawn either', () => {
    setFlagOverride('scribe', true);
    seat();
    const s = town();
    const migrated = { ...scribed(s), simulationVersion: `${s.simulationVersion}-next` };
    const { container } = render(<DailyLifeTab settlement={migrated} saveId="a" />);
    expect(container.querySelector('button')).toBeTruthy();
    expect(screen.queryByText(BEAT_TEXT[0])).toBe(null);
  });
});
