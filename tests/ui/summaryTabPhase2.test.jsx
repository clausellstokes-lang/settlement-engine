/** @vitest-environment jsdom */
/**
 * summaryTabPhase2.test.jsx — UX Phase 2 self-gating guarantees, repointed to the
 * dossier-keystone reality:
 *
 *   • The legacy single-column SummaryTab was deleted; SummaryTabV2 is the one
 *     Summary. The "What changed" deltas live in SummaryTabV2 and self-gate.
 *   • WarFaithSection was re-homed out of the Summary into its own War & Faith
 *     sub-tab (WarFaithTab). The peaceful/deity-free self-gating guarantee is now
 *     pinned on WarFaithTab.
 *   • The "state at a glance" 4-dim strip (ReadSystemStateBar) is BACK in the
 *     Summary, and pinned here again (R-5b #22 — the remount).
 *
 * DANGLING-POINTER CORRECTION (R-5b #22). This header used to say the strip
 * "moved to the editor Workshop … see workshop.test.jsx". Both halves were
 * false: no workshop.test.jsx has ever existed in tests/ui or tests/components,
 * and the editor mounts the STORE-BOUND SystemStateBar (SettlementDetail.jsx,
 * inside the editMode gate), never ReadSystemStateBar — which left the promoted
 * read-view strip with zero importers in src. The remount puts it under the
 * Summary header band, where OutputContainer serves it to the library/generate
 * dossier and PublicDossierView serves it to the public gallery. The assertion
 * the Phase-2 move dropped is restored below, closing the hand-off loop.
 */
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import SummaryTabV2 from '../../src/components/new/SummaryTabV2.jsx';
import WarFaithTab from '../../src/components/new/tabs/WarFaithTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

afterEach(cleanup);

let town;
beforeAll(() => {
  town = generateSettlementPipeline(
    { size: 'town', tradeRouteAccess: 'road' },
    null,
    { seed: 424242, customContent: {} },
  );
});

// LINEAGE NOTE (master merge W6): the assigned-deity War&Faith render test was
// removed — this lineage's WarFaithTab deliberately carries NO deity data (the
// fenced ungated-pantheon surface, plan fence-2).
describe('SummaryTabV2 + War & Faith (dossier keystone) — self-gating', () => {
  test('the one Summary renders for a generated town', () => {
    const { container } = render(<SummaryTabV2 settlement={town} />);
    expect(container.textContent).toMatch(/Tonight at the table|town in 4 sentences/);
  });

  test('a peaceful, never-advanced settlement renders NO "What changed" panel', () => {
    const { queryByTestId } = render(<SummaryTabV2 settlement={town} />);
    expect(queryByTestId('what-changed-panel')).toBeNull();
  });

  test('a peaceful, deity-free, non-campaign settlement renders NO War & Faith section', () => {
    const { queryByTestId } = render(<WarFaithTab settlement={town} saveId={null} />);
    expect(queryByTestId('war-faith-section')).toBeNull();
  });

  // R-5b #22 — the remount pin. This is the assertion the Phase-2 move dropped
  // on a hand-off that never landed. It fails the moment the Summary stops
  // mounting the 4-dim glance, which is also the moment read-mode and public
  // gallery readers silently lose it (no other read surface carries all four
  // dimensions — the Library pip is a one-dimension collapse of the worst band).
  test('the Summary mounts the read-view 4-dim glance for a generated town', () => {
    const { getByTestId } = render(<SummaryTabV2 settlement={town} />);
    expect(getByTestId('read-system-state-bar')).toBeTruthy();
    expect(getByTestId('system-state-grid').textContent).toMatch(/Resilience/);
  });

  // The mount must survive the gallery's shape too: PublicDossierView renders
  // this same tab through OutputContainer over a SANITIZED projection, which can
  // be missing derivation inputs. MEASURED behaviour (not assumed): deriveSystemState
  // is deliberately tolerant and NEVER throws — a sparse settlement yields a usable
  // state with neutral defaults, so the strip still renders rather than vanishing.
  // Pinned on a near-empty settlement so a future tightening of the derivation into
  // a throwing/null-returning shape is caught HERE, at the mount that would take the
  // whole public dossier down with it.
  test('a sparse (gallery-shaped) settlement renders the Summary and the strip, no crash', () => {
    const { getByTestId, container } = render(<SummaryTabV2 settlement={{ name: 'Bare' }} />);
    expect(container.textContent).toMatch(/Bare/);
    expect(getByTestId('read-system-state-bar')).toBeTruthy();
    expect(getByTestId('system-state-grid').textContent).toMatch(/Resilience/);
  });

});
