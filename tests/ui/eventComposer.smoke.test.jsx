/**
 * @vitest-environment jsdom
 *
 * tests/ui/eventComposer.smoke.test.jsx — Decomposition lock-in.
 *
 * EventComposer.jsx was partially decomposed: its module-scope helpers
 * (buildTargetOptions, labelOfTarget) and presentational sub-components
 * (PreviewPanel + DeltaRow, BatchCart, Field) moved into
 * src/components/settlement/eventComposer/*. This is a behavior-preserving
 * move, so the regression net is simply: the composer still mounts and
 * renders without throwing, wiring the extracted imports together correctly.
 * If a relative-path/import got broken in the split (e.g. helpers.js's bumped
 * '../../../domain/...' paths, or BatchCart importing DeltaRow from
 * PreviewPanel), the dynamic import or the render below throws and this fails.
 *
 * The store is a selector-over-plain-object stub (the same shape the existing
 * apply-flow test uses) so the real store (persist, supabase, analytics) stays
 * out of the render. A minimal settlement with empty collections is enough for
 * the composer to render its form.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

afterEach(cleanup);

// Selector-over-plain-object store stub. Every selector the composer reads is
// served from this single object; no zustand, no network.
const storeState = {
  phase: 'canon',
  settlement: {
    name: 'Greenhollow',
    institutions: [],
    npcs: [],
    factions: [],
    powerStructure: { factions: [] },
    config: {},
  },
  previewEvent: vi.fn(),
  applyEvent: vi.fn((event) => ({ event })),
  applyPendingPreview: vi.fn(() => ({ event: {} })),
  dismissPreview: vi.fn(),
  pendingPreview: null,
  previewEventBatch: vi.fn(),
  applyEventBatch: vi.fn(() => ({ ok: true, warnings: [], logEntries: [] })),
  pendingBatchPreview: null,
  dismissBatchPreview: vi.fn(),
  customContent: {},
  activeSaveId: 'save-1',
  requestNarrative: vi.fn(),
  aiSettlement: null,
  aiDailyLife: null,
};

vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector(storeState),
}));

describe('EventComposer — decomposition smoke', () => {
  test('module exports a component function', async () => {
    const EventComposer = (await import('../../src/components/settlement/EventComposer.jsx')).default;
    expect(typeof EventComposer).toBe('function');
  });

  test('mounts without throwing and renders the composer form', async () => {
    const EventComposer = (await import('../../src/components/settlement/EventComposer.jsx')).default;
    const { container } = render(<EventComposer />);

    // Mount succeeded — the DOM exists and the composer produced output.
    expect(document.body).toBeTruthy();
    expect(container.firstChild).not.toBeNull();

    // The composer's stable chrome is present (the "Make Changes" header and the
    // Preview/Apply controls), which means the extracted Field wrapper and the
    // main render wired together without an import break.
    expect(screen.getByText('Make Changes')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Preview/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Apply to Timeline/ })).toBeTruthy();
  });

  test('renders the extracted PreviewPanel when a preview is pending', async () => {
    storeState.pendingPreview = {
      event: { id: 'ev_1', type: 'KILL_NPC', targetId: 'mira', partyCaused: true },
      deltas: [{ change: -1, severity: 'major', explanation: 'Legitimacy falls', before: 5, after: 4 }],
      factionResponses: [],
      warnings: [],
      narrativeSummary: 'Mira dies.',
    };
    try {
      const EventComposer = (await import('../../src/components/settlement/EventComposer.jsx')).default;
      render(<EventComposer />);
      // PreviewPanel's narrative summary + a DeltaRow row (DeltaRow imported by
      // PreviewPanel) both render — exercising the PreviewPanel.jsx extraction.
      expect(screen.getByText('Mira dies.')).toBeTruthy();
      expect(screen.getByText('Legitimacy falls')).toBeTruthy();
    } finally {
      storeState.pendingPreview = null;
    }
  });
});
