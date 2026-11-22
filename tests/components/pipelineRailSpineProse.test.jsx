/**
 * @vitest-environment jsdom
 *
 * tests/components/pipelineRailSpineProse.test.jsx — the spine card, as a
 * first-run user actually reads it.
 *
 * WHY A RENDER PIN AND NOT ONLY THE DOMAIN TEST: the two defects the chair
 * found on the live site were invisible to any assertion made on the deriver's
 * return value alone. The deriver returned "Strained by under Siege,
 * infiltrated." — a string that is perfectly well-formed in isolation. The
 * defect only exists once the rail prints its OWN label above it and the eye
 * reads the pair as one line:
 *
 *     It is currently strained by
 *     Strained by under Siege, infiltrated.
 *
 * The frame word was authored in two places — the deriver and the component —
 * and no test looked at both at once. This one does: it reads the rendered
 * <dt>/<dd> pairs out of the DOM and asserts the composed reading is
 * grammatical, over a REAL generated settlement rather than a fixture built
 * from the same beliefs as the code.
 */

import React from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

// `gen` is the estate's one spelling of a headless seeded generation:
// generateSettlementPipeline(config, null, { seed, customContent: {} }). Calling
// the pipeline directly here is how this file previously put its seed in the
// CONFIG slot, where nothing reads it — see the seed-family note in
// tests/domain/simulationSpine.test.js.
import { gen } from '../simulation/simHelpers.js';

const H = vi.hoisted(() => ({ state: null }));

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(H.state);
  useStore.getState = () => H.state;
  return { useStore };
});

const { default: PipelineRail } = await import('../../src/components/PipelineRail.jsx');

afterEach(() => {
  cleanup();
  H.state = null;
});

/** Render the rail over a settlement and read back the spine card's rows. */
function spineRowsOnScreen(settlement) {
  H.state = {
    settlement,
    pipelineHistory: [{ id: 'resolveConfig', ts: 1, summary: 'Config resolved' }],
  };
  const { container } = render(<PipelineRail />);
  const card = container.querySelector('section[aria-label="Simulation spine"]');
  expect(card, 'the spine card did not render').toBeTruthy();
  return [...card.querySelectorAll('dl > div')].map(row => ({
    label: row.querySelector('dt').textContent.trim(),
    body: row.querySelector('dd').textContent.trim(),
  }));
}

describe('the spine card as rendered', () => {
  test('a besieged settlement reads grammatically, label and body together', () => {
    const settlement = gen(
      { settType: 'town', stressTypes: ['under_siege', 'infiltrated'] },
      'rail-spine-siege',
    );
    expect(settlement._seed, 'the seed must reach the pipeline').toBe('rail-spine-siege');
    const rows = spineRowsOnScreen(settlement);

    // Positive control: the card really rendered all its rungs.
    expect(rows.length).toBeGreaterThanOrEqual(6);

    const strain = rows.find(r => r.label === 'It is currently strained by');
    expect(strain).toBeTruthy();
    // BEFORE (live site): body was "Strained by under Siege, infiltrated."
    expect(strain.body)
      .toBe('an active siege and quiet penetration by an outside interest.');
    expect(`${strain.label} ${strain.body}`)
      .toBe('It is currently strained by an active siege and quiet penetration by an outside interest.');

    const fear = rows.find(r => r.label === 'Its people fear');
    expect(fear).toBeTruthy();
    // BEFORE (live site): body was "People fear a return of the settlement is
    // under active siege. Every resource decision is a military decision. The
    // debate is no longer about policy - it is about survival.."
    expect(fear.body)
      .toBe('the wall coming down before any relief arrives and learning at last who has been listening.');
  });

  test('no rendered row repeats its own label, on any settlement', () => {
    for (const [seed, config] of [
      ['rail-spine-a', { settType: 'town',    tradeRouteAccess: 'crossroads' }],
      ['rail-spine-b', { settType: 'village', tradeRouteAccess: 'river' }],
      ['rail-spine-c', { settType: 'city',    tradeRouteAccess: 'port' }],
    ]) {
      const settlement = gen(config, seed);
      expect(settlement._seed, 'the seed must reach the pipeline').toBe(seed);
      const rows = spineRowsOnScreen(settlement);
      expect(rows.length).toBeGreaterThanOrEqual(6);
      for (const { label, body } of rows) {
        const keyWord = label.split(/\s+/).pop().toLowerCase();
        expect(
          body.toLowerCase().startsWith(keyWord),
          `row "${label}" printed its own frame word again: "${body}"`,
        ).toBe(false);
        expect(body, `row "${label}" stacked terminal marks`).toMatch(/[^.!?][.!?]$/);
      }
      cleanup();
    }
  });
});
