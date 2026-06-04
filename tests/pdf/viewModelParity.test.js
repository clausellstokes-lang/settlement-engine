/**
 * PDF parity guard.
 *
 * The on-screen dossier and the PDF render from related but SEPARATE code.
 * `buildViewModel` is the PDF's single source of truth and promises "parity by
 * default": every on-screen dossier section has a corresponding slice. This
 * pins that promise so a section can't be silently dropped from the PDF when
 * the screen tabs change - the failure mode the PDF_PARITY_AUDIT tracks by hand.
 *
 * If you add a dossier tab, add its slice to buildViewModel AND to the list
 * below; if you remove one, do the reverse. The test fails on either drift.
 */
import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';

// One key per on-screen dossier section (OutputContainer tabs). aiAppendix is
// intentionally excluded - it only exists in the AI-narrative path.
const REQUIRED_SECTION_SLICES = [
  'summary', 'identity', 'overview', 'daily', 'power', 'economics',
  'defense', 'services', 'resources', 'viability', 'history', 'npcs',
  'hooks', 'relationships',
];

describe('PDF viewModel parity', () => {
  const settlement = generateSettlementPipeline(
    { settType: 'town', culture: 'germanic', terrain: 'river', tradeRouteAccess: 'road' },
    null,
    { seed: 'pdf-parity-2026', customContent: {} },
  );
  const vm = buildViewModel({ settlement });

  it('surfaces a slice for every on-screen dossier section', () => {
    const missing = REQUIRED_SECTION_SLICES.filter((key) => !(key in vm));
    expect(missing).toEqual([]);
  });

  it('wires the raw settlement through and defaults to the non-AI data path', () => {
    expect(vm.raw).toBe(settlement);
    expect(vm.active).toBeTruthy();
    expect(vm.narrativeMode).toBe(false);
  });
});
