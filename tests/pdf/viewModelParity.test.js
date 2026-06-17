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
import { deriveFoodBalance } from '../../src/domain/display/dossierViewModel.js';

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

// A+ P1.8 — field-level VALUE parity (not just key-existence). The PDF must render
// the SAME food-balance numbers the shared deriveFoodBalance produces (the value the
// on-screen dossier shows), across every slice that surfaces them — so a slice can't
// silently read the raw, unclamped metrics.foodBalance and drift from the screen.
// (Convergence of the remaining richer foodBalance objects — viability slice — is
// Phase-2 Track G; this harness pins the headline scalar facts now.)
describe('PDF viewModel — food-balance value parity with deriveFoodBalance', () => {
  const configs = [
    { settType: 'thorp', culture: 'norse', terrain: 'mountain', tradeRouteAccess: 'isolated' },
    { settType: 'town', culture: 'germanic', terrain: 'river', tradeRouteAccess: 'road' },
    { settType: 'city', culture: 'imperial', terrain: 'coast', tradeRouteAccess: 'port' },
  ];

  for (const cfg of configs) {
    it(`overview + identity-anchor food match canonical for ${cfg.settType}/${cfg.terrain}`, () => {
      const s = generateSettlementPipeline(cfg, null, { seed: `parity-${cfg.settType}-2026`, customContent: {} });
      const canonical = deriveFoodBalance(s);
      const vm = buildViewModel({ settlement: s });

      // overview slice coalesces 0 → null (`m.deficit || null`); normalize for compare.
      expect(vm.overview.foodBalance.deficit ?? 0).toBe(canonical.deficit);
      expect(vm.overview.foodBalance.surplus ?? 0).toBe(canonical.surplus);
      expect(vm.overview.foodBalance.deficitPct).toBe(canonical.deficitPct);

      // identity anchor (mirrors the DailyLifeTab anchor) must use the clamped helper
      // value, not the raw unclamped field (the divergence this harness closed).
      expect(vm.identity.anchor.foodDeficit).toBe(canonical.deficit);
      expect(vm.identity.anchor.foodSurplus).toBe(canonical.surplus);
    });
  }
});
