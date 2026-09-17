/**
 * @vitest-environment jsdom
 *
 * tests/components/createWorkflowRail.test.jsx — the post-forge seat order.
 *
 * HISTORY OF THIS SEAT. The generation-steps rail held the Create-page seat
 * ahead of the film under the 2026-07-31 directive, and this file pinned that
 * seat. The owner's post-forge ruling (ODQ §767.2, amended by §777, 2026-08-30)
 * SUPERSEDES it: the above-dossier receipts panel was burying the star exhibit
 * (the dossier sat ~1,900px below the page head behind the receipts), so it is
 * deleted outright and the dossier lands HEAD-FIRST after forging. The
 * simulation record's one remaining door on this surface is the toolbar's
 * drawer trigger. This file now pins the RULED order, and each pin can go
 * wrong on its own:
 *
 *   • NO RECEIPTS ABOVE THE FOLD — the post-forge flow renders no
 *     "How this was simulated" rail block, on either breakpoint, proven
 *     against a render where the dossier body IS present (positive control —
 *     an empty render would pass a bare absence check vacuously).
 *   • THE DOSSIER LANDS HEAD-FIRST — the sticky toolbar is the first block
 *     and the dossier body follows it immediately, then the save row. The
 *     "What a new roll keeps" world-lock section that used to sit below the
 *     dossier is GONE (owner order 2026-09-17) and must not come back.
 *   • THE FORGE TICKER STILL GATES HONESTLY — while the reveal overlay is
 *     active the dossier cluster is withheld; dismissal is what lands the
 *     reader on the dossier head (the ticker itself is owner-signed to play
 *     through, a52a88b1).
 *   • THE RECORD STAYS REACHABLE AND LAZY — the rail's import graph
 *     (stepMetadata / trace / simulationSpine) is reached ONLY through the
 *     drawer's dynamic import; a static import anywhere in src/ would fold
 *     that graph into a first-paint chunk, and a second dynamic importer
 *     would mean someone re-seated the deleted panel.
 */

import React from 'react';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
// The §807(b) viewer-mode negative reads its expected label off the REAL step
// registry rather than a hand-written string, so a registry relabel can never
// make the absence pass for the wrong reason.
import { metaForStep } from '../../src/generators/steps/stepMetadata.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

const H = vi.hoisted(() => ({ state: null }));

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

// The forge ticker overlay. Stubbed to a bare marker: this test is about the
// order of the post-forge surface, not the ticker's own playback.
vi.mock('../../src/components/generate/PipelineReveal.jsx', () => ({
  default: () => <div data-testid="reveal-node">film</div>,
}));
// The dossier body — the star exhibit. A marker stands in for the ~457kB chunk.
vi.mock('../../src/components/OutputContainer', () => ({
  default: () => <div data-testid="dossier-body">dossier</div>,
}));
// (The LockControls marker mock left with the component itself: owner order 2026-09-17,
// "remove the other padlocks", deleted LockControls.jsx, so no import of it can build;
// tests/components/factionLockCoupShield.test.jsx pins that no component carries one.)
// Save-row leaves — presence is enough; their own behavior is pinned elsewhere.
vi.mock('../../src/components/generate/SaveToLibraryButton.jsx', () => ({
  SaveToLibraryButton: () => <div data-testid="save-row">save</div>,
}));
vi.mock('../../src/components/BuyThisDossier.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/generate/ExportDraftButton.jsx', () => ({ default: () => null }));

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
    // Post-dismissal: the ticker has played through; the dossier cluster is live.
    pipelineRevealActive: false,
    dismissPipelineReveal: vi.fn(),
    pipelineHistory: [
      { id: 'generatePower', ts: 1, summary: '3 factions formed' },
      { id: 'generatePopulation', ts: 2, summary: '11 named NPCs cast' },
    ],
    ...overrides,
  };
}

const NO_RAIL = () =>
  expect(screen.queryByRole('complementary', { name: 'How this was simulated' })).toBeNull();

beforeEach(() => { H.state = makeState(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('the post-forge surface carries no above-dossier receipts (§767.2/§777)', () => {
  test('desktop: the dossier renders and no receipts rail block exists', async () => {
    render(<GenerateWizard isMobile={false} />);
    // Positive control first — the flow really rendered its dossier.
    expect(await screen.findByTestId('dossier-body')).toBeTruthy();
    NO_RAIL();
  });

  test('mobile: the same absence holds (one column, no breakpoint fork)', async () => {
    render(<GenerateWizard isMobile />);
    expect(await screen.findByTestId('dossier-body')).toBeTruthy();
    NO_RAIL();
  });
});

describe('the dossier lands head-first', () => {
  test('toolbar → dossier → save row, and NO "What a new roll keeps" section (owner order 2026-09-17)', async () => {
    const { container } = render(<GenerateWizard isMobile={false} />);
    const dossier = await screen.findByTestId('dossier-body');
    const back = screen.getByRole('button', { name: 'Back' });
    const saveRow = await screen.findByTestId('save-row');
    // DOCUMENT_POSITION_FOLLOWING (4): the dossier follows the toolbar…
    expect(back.compareDocumentPosition(dossier) & 4).toBe(4);
    // …and the save row follows the dossier.
    expect(dossier.compareDocumentPosition(saveRow) & 4).toBe(4);
    // The owner: "Remove the entire section that says what a new roll keeps and any button
    // associated with that." The render above is live (dossier and save row present).
    expectAbsentWithAnchor(container.textContent, 'What a new roll keeps', 'dossier',
      'the "What a new roll keeps" section is back below the dossier');
  });
});

describe('the forge ticker still gates the landing honestly', () => {
  test('while the reveal is active the dossier cluster is withheld', async () => {
    H.state = makeState({ pipelineRevealActive: true });
    render(<GenerateWizard isMobile={false} />);
    expect(await screen.findByTestId('reveal-node')).toBeTruthy();
    expect(screen.queryByTestId('dossier-body')).toBeNull();
    // Dismissal lands the reader directly on the dossier head — pinned above.
  });
});

describe('the simulation record stays reachable, lazy, and single-doored', () => {
  test('the rail is dynamically imported by the drawer alone; nothing imports it statically', () => {
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
    // Positive control: the scan really did see the one sanctioned consumer.
    const dynamic = files.filter((p) => /import\(\s*['"][^'"]*PipelineRail\.jsx['"]\s*\)/.test(readFileSync(p, 'utf8')));
    expect(dynamic.map((p) => relative(ROOT, p)).sort()).toEqual([
      'src/components/dossier/SimulationDrawer.jsx',
    ]);

    const staticImporters = files
      .filter((p) => /^\s*import[^\n]*from\s*['"][^'"]*PipelineRail\.jsx['"]/m.test(readFileSync(p, 'utf8')))
      .map((p) => relative(ROOT, p));
    expect(staticImporters).toEqual([]);
  });
});

// ── §807(b) — the rail's VIEWER MODE (a shared dossier, no pipelineHistory) ───
// The read-only public dossier keeps "How this was simulated": the drawer passes
// the SHARED settlement, and the rail renders the settlement-derived simulation
// spine alone — the step list belongs to the generating session and is honestly
// absent for a viewer, never fabricated from nothing.
// ⚠ THE SINGLE-DOOR PIN ABOVE STILL HOLDS AND IS WHY THIS SITS HERE: §807(b)'s
// PublicSimulationBand mounts the DRAWER, not the rail, so `src/` still has
// exactly one dynamic importer of PipelineRail.jsx. The dynamic import below is
// in tests/, outside that scan's root.
describe('PipelineRail viewer mode — §807(b)', () => {
  test('a passed settlement with NO store history renders the spine, and no step rows', async () => {
    H.state = makeState({ pipelineHistory: [], settlement: null });
    const { default: PipelineRail } = await import('../../src/components/PipelineRail.jsx');
    render(<PipelineRail settlement={SETTLEMENT} />);
    const block = await screen.findByRole('complementary', { name: 'How this was simulated' });
    expect(block).toBeTruthy();
    // No fabricated step receipts: the registry labels of a generating session
    // are absent (anchored: the block itself rendered above).
    expect(block.textContent).not.toContain(metaForStep('generatePower').label); // anchored: the rail's complementary role was found above, so the surface lives; the absent label is the viewer-mode claim itself.
  });

  test('no settlement prop and no history ⇒ the rail stays null (the pre-§807 gate, unchanged)', async () => {
    H.state = makeState({ pipelineHistory: [], settlement: null });
    const { default: PipelineRail } = await import('../../src/components/PipelineRail.jsx');
    const { container } = render(<PipelineRail />);
    expect(container.firstChild).toBeNull();
  });
});
