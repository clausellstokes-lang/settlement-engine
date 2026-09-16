/**
 * @vitest-environment jsdom
 *
 * tests/components/createWorkflowRail.test.jsx — the Create-page workflow block.
 *
 * The generation-steps rail (components/PipelineRail.jsx) lost its Create-page
 * seat when the dossier's dead Simulation tab was excised (3176e22d) and lived
 * on only behind the SimulationDrawer trigger. The owner directive (2026-07-31)
 * restores it to the create flow, seated IMMEDIATELY BEFORE the film block — the
 * pipeline reveal, which is the create flow's video surface.
 *
 * What this pins, and why each one can go wrong on its own:
 *   • THE SEAT — the block renders in the create flow and precedes the video
 *     node in document order (a later insertion point would put the workflow
 *     behind the film it is meant to introduce). Pinned on the ONE shared
 *     column GenerateWizard renders at both breakpoints, and asserted on mobile
 *     too so a future breakpoint fork cannot drop one side silently.
 *   • THE LABELS ARE NOT FORKED — the rows read through the real step registry
 *     (generators/steps/stepMetadata.js). The assertion derives its expected
 *     text from metaForStep itself, so a hand-written label list in the UI would
 *     have to match the registry to pass, and a registry relabel drags the
 *     expectation with it.
 *   • IT IS LIVE — the rail re-renders off the store's pipelineHistory, the same
 *     onStep receipts the reveal plays back, so steps appear as a run lands them.
 *   • IT SELF-HIDES — no history, no block (a rail asserting nothing is worse
 *     than no rail), proven against a render where the video node IS present.
 *
 * The dossier/toolbar cluster is suppressed by the reveal being active, so only
 * the two lazy children need stubbing; the rail itself is deliberately REAL.
 */

import React from 'react';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import { metaForStep } from '../../src/generators/steps/stepMetadata.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

const H = vi.hoisted(() => ({ state: null }));

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

// The video surface. Stubbed to a bare marker: this test is about WHERE the
// workflow block sits relative to it, not about the film's own playback (which
// pulls the journey manifest + media assets and is pinned elsewhere).
vi.mock('../../src/components/generate/PipelineReveal.jsx', () => ({
  default: () => <div data-testid="video-node">film</div>,
}));
vi.mock('../../src/components/dossier/LockControls.jsx', () => ({
  default: () => <div>lock-controls</div>,
}));

vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(H.state);
  useStore.getState = () => H.state;
  return { useStore };
});

import GenerateWizard from '../../src/components/GenerateWizard.jsx';

const SETTLEMENT = { id: 's1', name: 'Westhollow', tier: 'village', population: 320 };

function makeState(overrides = {}) {
  return {
    settlement: SETTLEMENT,
    activeSaveId: null,
    wizardMode: 'basic',
    loadedFromSave: null,
    importedNeighbour: null,
    canSave: () => false,
    auth: { tier: 'wanderer', role: 'user' },
    aiSettlement: null,
    generateSettlement: vi.fn(),
    setWizardStep: vi.fn(),
    setWizardMode: vi.fn(),
    clearLoadedFromSave: vi.fn(),
    clearNeighbour: vi.fn(),
    clearSettlement: vi.fn(),
    setSettlement: vi.fn(),
    // The reveal is active, so the dossier/toolbar cluster below it is not
    // rendered — the workflow block and the video node are the surface here.
    pipelineRevealActive: true,
    dismissPipelineReveal: vi.fn(),
    pipelineHistory: [
      { id: 'generatePower', ts: 1, summary: '3 factions formed' },
      { id: 'generatePopulation', ts: 2, summary: '11 named NPCs cast' },
    ],
    ...overrides,
  };
}

/** The workflow block, found by the rail's own accessible name. */
const findBlock = () => screen.findByRole('complementary', { name: 'How this was simulated' });

beforeEach(() => { H.state = makeState(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('the workflow block holds its Create-page seat ahead of the video', () => {
  test('it renders in the create flow and precedes the video node (desktop)', async () => {
    render(<GenerateWizard isMobile={false} />);

    const block = await findBlock();
    const video = screen.getByTestId('video-node');
    expect(block).toBeTruthy();
    expect(video).toBeTruthy();
    // DOCUMENT_POSITION_FOLLOWING (4) — the video comes AFTER the block.
    expect(block.compareDocumentPosition(video) & 4).toBe(4);
  });

  test('the same seat holds on mobile (one column, no breakpoint fork)', async () => {
    render(<GenerateWizard isMobile />);

    const block = await findBlock();
    const video = screen.getByTestId('video-node');
    // DOCUMENT_POSITION_FOLLOWING (4) — the video comes AFTER the block here too.
    expect(block.compareDocumentPosition(video) & 4).toBe(4);
  });
});

describe('the rows come from the real step registry, not a forked list', () => {
  test('each history entry renders the registry’s own label for its step id', async () => {
    render(<GenerateWizard isMobile={false} />);
    const block = await findBlock();

    for (const entry of H.state.pipelineHistory) {
      const registryLabel = metaForStep(entry.id).label;
      // A real label, not the raw machine name falling through metaForStep.
      expect(registryLabel).not.toBe(entry.id);
      expect(block.textContent).toContain(registryLabel);
      // The per-run receipt rides alongside the label.
      expect(block.textContent).toContain(entry.summary);
    }
  });
});

describe('the block is live — it follows the run’s step receipts', () => {
  test('a step landing in pipelineHistory appears without remounting the flow', async () => {
    const { rerender } = render(<GenerateWizard isMobile={false} />);
    const block = await findBlock();

    const laterStep = 'generateNarratives';
    const laterLabel = metaForStep(laterStep).label;
    expect(laterLabel).not.toBe(laterStep);
    // It is genuinely absent before the step lands (the update is observable).
    expect(block.textContent.includes(laterLabel)).toBe(false);

    H.state = makeState({
      pipelineHistory: [
        ...H.state.pipelineHistory,
        { id: laterStep, ts: 3, summary: 'A founding and two turns of trouble' },
      ],
    });
    rerender(<GenerateWizard isMobile={false} />);

    const updated = await findBlock();
    expect(updated.textContent).toContain(laterLabel);
    expect(updated.textContent).toContain('A founding and two turns of trouble');
  });
});

describe('the seat costs zero eager bytes', () => {
  // The dist byte-budget pin (tests/build/vendorPdfLazy.test.js) can only speak
  // after a build; this is the source-side guard that keeps it honest, and it is
  // the one that reds the moment someone "simplifies" the lazy() away. Every
  // route to the rail must be a DYNAMIC import — a static `from '…PipelineRail'`
  // anywhere would fold the rail's graph (stepMetadata / trace / simulationSpine)
  // into whatever chunk did it.
  test('nothing in src/ reaches PipelineRail through a static import', () => {
    const roots = [join(ROOT, 'src')];
    const files = [];
    while (roots.length) {
      const dir = roots.pop();
      for (const entry of readdirSync(dir)) {
        const p = join(dir, entry);
        if (statSync(p).isDirectory()) roots.push(p);
        else if (/\.(js|jsx)$/.test(entry)) files.push(p);
      }
    }
    // Positive control: the scan really did see the consumers it is judging.
    const dynamic = files.filter((p) => /import\(\s*['"][^'"]*PipelineRail\.jsx['"]\s*\)/.test(readFileSync(p, 'utf8')));
    expect(dynamic.map((p) => relative(ROOT, p)).sort()).toEqual([
      'src/components/GenerateWizard.jsx',
      'src/components/dossier/SimulationDrawer.jsx',
    ]);

    const staticImporters = files
      .filter((p) => /^\s*import[^\n]*from\s*['"][^'"]*PipelineRail\.jsx['"]/m.test(readFileSync(p, 'utf8')))
      .map((p) => relative(ROOT, p));
    expect(staticImporters).toEqual([]);
  });
});

describe('the block self-hides until a run has produced receipts', () => {
  test('no pipeline history, no block — while the video node still renders', async () => {
    H.state = makeState({ pipelineHistory: [] });
    render(<GenerateWizard isMobile={false} />);

    // Positive control: the create flow really did render its video surface, so
    // the absence below is about the rail's own gate and not an empty render.
    expect(await screen.findByTestId('video-node')).toBeTruthy();
    expect(screen.queryByRole('complementary', { name: 'How this was simulated' })).toBeNull();
  });
});
