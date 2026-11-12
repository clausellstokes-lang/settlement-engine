/** @vitest-environment jsdom */
/**
 * pageCensus.walker.test.jsx — THE RENDERED-DOSSIER ARM IN THE SUITE (W2-A-LEAVES, 2026-11-12; the second
 * wave's charter §0 item 6 (ii)).
 *
 * Twelve births of the census's own corpus (tests/components/pageCensusWalk.shared.mjs :: censusPlan, prefix
 * `r2`): each size once calm and once under a crisis. Each is rendered through the real OutputContainer as the
 * owner sees it, walked (every group, sub-tab and disclosure), and read by the page battery's `page-census`
 * check (src/domain/coherence/pageCensusFindings.js). The rows each dossier carries must equal the register's
 * `grid` row for its seed EXACTLY (scripts/census/page-census.register.json): a new row is red in the lane that
 * prints it; a cure lowers the register in the same commit. The 720 are scripts/census/page-census.mjs's.
 *
 * Anti-vacuity: every birth renders at least twenty views, and the grid carries at least one row of every
 * reader's class until the cures empty them; then the plants (tests/domain/coherence/pageCensusFindings.test.js)
 * are what prove the reader.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { censusPlan, configOf, storeFor, walkDossier } from './pageCensusWalk.shared.mjs';

const mocks = vi.hoisted(() => ({ store: {} }));
vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(mocks.store);
  useStore.subscribe = () => () => {}; useStore.getState = () => mocks.store;
  return { useStore };
});
vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('../../src/generators/aiLayer', () => ({ runTemplateNarrative: vi.fn() }));
vi.mock('../../src/lib/analytics.js', () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));

import OutputContainer from '../../src/components/OutputContainer.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { withPublicProse } from '../../src/domain/display/publicProse.js';
import { composePublicProse } from '../../src/components/new/publicProseCompose.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { coherenceBattery } from '../../src/domain/coherence/coherenceBattery.js';

const REGISTER = JSON.parse(readFileSync(join(process.cwd(), 'scripts/census/page-census.register.json'), 'utf8'));
/** The grid: each size's first calm birth and its first birth under the crisis at the size's index in the census's order. */
const PLAN = censusPlan('r2');
const GRID = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'].flatMap((size, i) => [
  PLAN.find((r) => r.size === size && r.crisis === null),
  PLAN.filter((r) => r.size === size && r.crisis !== null)[i * 4 * 2],
]);

const viewport = { matches: false, listeners: new Set() };
window.matchMedia = Object.assign(vi.fn((q) => ({ media: q, get matches() { return viewport.matches; }, addEventListener: (_t, f) => viewport.listeners.add(f), removeEventListener: (_t, f) => viewport.listeners.delete(f), addListener: (f) => viewport.listeners.add(f), removeListener: (f) => viewport.listeners.delete(f) })), { SF_CONTROLLED: true });
afterEach(cleanup);

/** @type {Record<string, string[]>} */ const seen = {};
describe('the rendered dossier reads exactly its banked rows (the grid)', () => {
  test('the grid is twelve births, six sizes calm and in crisis, and the register holds a row for each', () => {
    expect(GRID.map((r) => r.seed)).toEqual(Object.keys(REGISTER.grid));
    expect(new Set(GRID.map((r) => r.size)).size).toBe(6);
    expect(GRID.filter((r) => r.crisis).length).toBe(6);
  });
  for (const row of GRID) {
    test(row.seed, async () => {
      await loadGenerationLawPayloads();
      let town = generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} });
      town = withPublicProse(town, composePublicProse(town));
      mocks.store = storeFor(town, vi.fn);
      const { container } = render(<OutputContainer settlement={town} />);
      const views = await walkDossier(container, { fireEvent, waitFor, expect });
      expect(Object.keys(views).length).toBeGreaterThanOrEqual(20);
      const surfaces = Object.fromEntries(Object.entries(views).map(([k, v]) => [k, v.join('\n')]));
      const found = coherenceBattery(town, surfaces, { only: ['page-census'] });
      expect(found.filter((f) => /instrument threw/.test(f.detail))).toEqual([]);
      const rows = [...new Set(found.map((f) => f.detail.split(':')[0]))].sort();
      seen[row.seed] = rows;
      expect(rows).toEqual(REGISTER.grid[row.seed]);
    }, 120000);
  }
  test('every grid row is a register row, and the grid still carries each reader class it banked', () => {
    for (const rows of Object.values(REGISTER.grid)) for (const r of rows) expect(REGISTER.rows[r]).toBeTruthy();
    const banked = new Set(Object.values(REGISTER.grid).flat().map((r) => REGISTER.rows[r].reader));
    const now = new Set(Object.values(seen).flat().map((r) => REGISTER.rows[r].reader));
    expect([...now].sort()).toEqual([...banked].sort());
  });
});
