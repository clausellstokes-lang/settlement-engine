/** @vitest-environment jsdom */
/**
 * tests/components/autoplacementConsent.test.jsx — THE CONSENT POPUP
 * (realm directive 1 / J-D1, wave G).
 *
 * WHAT IS PINNED, and why each pin exists:
 *
 *   1. NOTHING BEFORE CONFIRM — the survey runs on mount and reads the pack, but
 *      no placement writer is called until the user presses the primary. The
 *      failure this prevents is the button that "helpfully" rearranges a realm the
 *      moment it is pressed out of curiosity.
 *   2. THE THREE CLASSES STAY SEPARATE — moves are pre-selected, the paint class
 *      renders as an honest unavailability with its reason, and the re-terrain
 *      option appears only on a mismatch and is never pre-selected. A bundled
 *      consent is the exact failure J-D1 was written to forbid.
 *   3. MISMATCHES ARE OPT-IN — a settlement whose ground this realm lacks is NOT
 *      submitted unless the user checks it themselves.
 *   4. THE CANON LOCK SPEAKS — a canonized realm gets a sentence, not a silent
 *      no-op, and no writer is reachable at all.
 *
 * The store is mocked (the store's own behaviour is pinned in
 * tests/store/autoplacementStore.test.js), but the PLANNER AND RASTER ARE REAL:
 * only the bridge's pack read is faked, so these pins exercise the true pipeline
 * from captured pack to itemized row.
 */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const store = vi.hoisted(() => ({
  applyAutoplacement: vi.fn(() => ({ ok: true, moved: 1, placed: 0, refused: 0 })),
  addPlacement: vi.fn(),
  updatePlacement: vi.fn(),
  activeCampaignId: 'camp-1',
  campaigns: [{ id: 'camp-1', worldState: { canonizedAt: null } }],
  mapState: { placements: {}, seed: 'seed-1' },
}));

vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector(store),
}));

// The ONE faked seam: the live map frame. Everything downstream of it — the
// raster adapter, the fit predicate, the planner — is the real implementation.
const bridge = vi.hoisted(() => ({ pack: null }));
vi.mock('../../src/lib/spatialCaptureRegistry.js', () => ({
  getSpatialCaptureBridge: () => (bridge.pack
    ? { isReady: true, getSpatialPack: async () => ({ pack: bridge.pack }) }
    : null),
}));

import AutoplacementConsent, { rosterForPlanning } from '../../src/components/map/AutoplacementConsent.jsx';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const GRASS = [30, 4, 0];
const RIDGE = [80, 4, 0];

function gridPack({ w, h, ground }) {
  const cells = { h: [], biome: [], r: [], p: [], c: [] };
  for (let row = 0; row < h; row += 1) {
    for (let col = 0; col < w; col += 1) {
      const [height, biome, river] = ground(col, row);
      cells.h.push(height); cells.biome.push(biome); cells.r.push(river);
      cells.p.push([col * 10, row * 10]);
      const n = [];
      if (col > 0) n.push(row * w + col - 1);
      if (col < w - 1) n.push(row * w + col + 1);
      if (row > 0) n.push((row - 1) * w + col);
      if (row < h - 1) n.push((row + 1) * w + col);
      cells.c.push(n);
    }
  }
  return { cells };
}

const PLAINS_ONLY = gridPack({ w: 14, h: 14, ground: () => GRASS });
const MIXED = gridPack({ w: 14, h: 14, ground: (col) => (col >= 11 ? RIDGE : GRASS) });

// `phase: 'canon'` is the REAL canon contract (domain/campaign/canon.js reads
// phase / canonizedAt, never a `canon` boolean) — the fixture uses the pipeline's
// own shape so these pins cannot pass over a projection that rejects real saves.
const save = (id, name, terrain) => ({
  id, name, phase: 'canon', tier: 'village',
  settlement: { name, tier: 'village', config: { terrainType: terrain } },
});

beforeEach(() => {
  bridge.pack = PLAINS_ONLY;
  store.applyAutoplacement.mockClear();
  store.campaigns = [{ id: 'camp-1', worldState: { canonizedAt: null } }];
  store.mapState = {
    seed: 'seed-1',
    placements: {
      b1: { settlementId: 'flat', x: 0, y: 0, cellId: 0 },
      b2: { settlementId: 'peak', x: 10, y: 0, cellId: 1 },
    },
  };
});
afterEach(cleanup);

const SAVES = [save('flat', 'Wheatlow', 'plains'), save('peak', 'Cragholt', 'mountain')];

describe('the roster projection hands the planner no generation input', () => {
  test('it carries ids, names, terrain and tier only — never a config object', () => {
    const roster = rosterForPlanning(SAVES, store.mapState.placements);
    expect(roster).toHaveLength(2);
    for (const row of roster) {
      expect(Object.keys(row).sort()).toEqual(['burgId', 'cellId', 'id', 'name', 'terrain', 'tier']);
      // The planner is structurally unable to write a config it never receives.
      // anchored: the exact-key assertion on the line above pins the whole shape, so an emptied or re-shaped row fails there rather than passing vacuously here
      expect(row).not.toHaveProperty('config');
      // anchored: same exact-key assertion above pins the complete key set
      expect(row).not.toHaveProperty('settlement');
    }
    expect(roster.map((r) => r.terrain).sort()).toEqual(['mountain', 'plains']);
  });

  test('a non-canon settlement is never planned for', () => {
    const draft = { id: 'draft', name: 'Nowhere', phase: 'draft', settlement: { config: {} } };
    expect(rosterForPlanning([...SAVES, draft], {}).map((r) => r.id)).toEqual(['flat', 'peak']);
  });
});

describe('nothing is written before the user confirms', () => {
  test('the survey itemizes the plan and calls NO writer', async () => {
    bridge.pack = MIXED;
    render(<AutoplacementConsent saves={SAVES} onClose={() => {}} />);
    await screen.findByText(/Move a settlement/i);
    // The dialog is a real modal, labelled by its heading.
    const dialog = screen.getByTestId('autoplacement-consent');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('role')).toBe('dialog');

    // THE PIN: a full survey ran (rows are on screen) and nothing was written.
    expect(store.applyAutoplacement).not.toHaveBeenCalled();
    expect(store.updatePlacement).not.toHaveBeenCalled();
    expect(store.addPlacement).not.toHaveBeenCalled();
  });

  test('confirming submits exactly the checked rows, once', async () => {
    bridge.pack = MIXED;
    const onClose = vi.fn();
    render(<AutoplacementConsent saves={SAVES} onClose={onClose} />);
    const confirm = await screen.findByRole('button', { name: /Place \d+ settlement/i });
    fireEvent.click(confirm);

    await waitFor(() => expect(store.applyAutoplacement).toHaveBeenCalledTimes(1));
    const arg = store.applyAutoplacement.mock.calls[0][0];
    expect(arg.seed).toBe('seed-1');
    expect(arg.proposals.length).toBeGreaterThan(0);
    // Every submitted row carries a real destination in map coordinates.
    for (const p of arg.proposals) {
      expect(Number.isFinite(p.x) && Number.isFinite(p.y)).toBe(true);
      expect(Number.isInteger(p.toCell)).toBe(true);
    }
    expect(onClose).toHaveBeenCalled();
  });

  test('NEGATIVE CONTROL: unchecking every row disables the primary, so nothing can be submitted', async () => {
    bridge.pack = MIXED;
    render(<AutoplacementConsent saves={SAVES} onClose={() => {}} />);
    await screen.findByText(/Move a settlement/i);
    for (const box of screen.getAllByRole('checkbox')) {
      if (box.checked) fireEvent.click(box);
    }
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Place 0 settlements/i }).disabled).toBe(true);
    });
    expect(store.applyAutoplacement).not.toHaveBeenCalled();
  });
});

describe('the three classes are strictly separated', () => {
  test('the paint class renders as an honest unavailability, never a control', async () => {
    render(<AutoplacementConsent saves={SAVES} onClose={() => {}} />);
    const note = await screen.findByTestId('paint-unavailable');
    expect(note.textContent).toMatch(/no way to paint terrain/i);
    // There is no paint affordance anywhere: an unavailable class must not ship a
    // button that quietly does nothing.
    expect(screen.queryByRole('button', { name: /paint/i })).toBeNull();
    expect(screen.queryByRole('checkbox', { name: /paint/i })).toBeNull();
  });

  test('a mismatch starts UNCHECKED and its re-terrain option is never pre-selected', async () => {
    // A plains-only realm cannot house Cragholt, the mountain settlement.
    bridge.pack = PLAINS_ONLY;
    render(<AutoplacementConsent saves={SAVES} onClose={() => {}} />);
    await screen.findByText(/cannot house/i);

    const mismatch = screen.getByLabelText(/Cragholt/i);
    expect(mismatch.checked, 'a mismatch was pre-consented').toBe(false);

    // The re-terrain option is present, labelled, and states its consequence in
    // plain words — and it is a disclosure, not a selected action.
    const reterrain = screen.getByTestId('reterrain-peak');
    expect(reterrain.textContent).toMatch(/regenerat/i);
    expect(reterrain.textContent).toMatch(/same-seed/i);
    expect(reterrain.textContent).toMatch(/separate decision/i);
    expect(reterrain.querySelector('input')).toBeNull();

    // THE PIN: confirming without touching the mismatch submits the safe class only.
    fireEvent.click(screen.getByRole('button', { name: /Place \d+ settlement/i }));
    await waitFor(() => expect(store.applyAutoplacement).toHaveBeenCalled());
    const ids = store.applyAutoplacement.mock.calls[0][0].proposals.map((p) => p.settlementId);
    // THE SELECTION SHAPE, with its liveness anchor: 'flat' travels the identical
    // path and proves the submission is live and correctly keyed, so the absence of
    // 'peak' measures the consent gate rather than an empty list.
    expectAbsentWithAnchor(ids, 'peak', 'flat');
  });

  test('a mismatch IS submitted once the user opts in — the gate is consent, not exclusion', async () => {
    bridge.pack = PLAINS_ONLY;
    render(<AutoplacementConsent saves={SAVES} onClose={() => {}} />);
    await screen.findByText(/cannot house/i);
    fireEvent.click(screen.getByLabelText(/Cragholt/i));
    fireEvent.click(screen.getByRole('button', { name: /Place \d+ settlement/i }));
    await waitFor(() => expect(store.applyAutoplacement).toHaveBeenCalled());
    const ids = store.applyAutoplacement.mock.calls[0][0].proposals.map((p) => p.settlementId);
    expect(ids).toContain('peak');
  });
});

describe('a canonized realm refuses out loud', () => {
  test('it states the lock and reaches no writer', async () => {
    store.campaigns = [{ id: 'camp-1', worldState: { canonizedAt: '2026-07-31T00:00:00.000Z' } }];
    render(<AutoplacementConsent saves={SAVES} onClose={() => {}} />);
    expect(await screen.findByText(/canonized/i)).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Place \d+ settlement/i })).toBeNull();
    expect(store.applyAutoplacement).not.toHaveBeenCalled();
  });

  test('a map that is not open says so instead of failing silently', async () => {
    bridge.pack = null;
    render(<AutoplacementConsent saves={SAVES} onClose={() => {}} />);
    expect(await screen.findByText(/not open/i)).toBeTruthy();
    expect(store.applyAutoplacement).not.toHaveBeenCalled();
  });
});
