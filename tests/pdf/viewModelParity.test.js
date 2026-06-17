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
import { deriveFoodBalance, deriveDossierViewModel } from '../../src/domain/display/dossierViewModel.js';
import { SHARED_FIELDS, getByPath } from '../../src/domain/display/parityContract.js';

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

// A+ pdf.5 — field-level VALUE parity driven by the SHARED_FIELDS contract (DATA,
// not hand-listed asserts). The PDF must render the SAME values the canonical
// display model (deriveDossierViewModel) produces, for every shared fact — so a
// slice can't silently read a raw/unclamped source and drift from the screen.
// New shared facts default to "must match": add a SHARED_FIELDS row (or a
// documented PARITY_EXEMPT entry), and this harness asserts it automatically.
describe('PDF viewModel — SHARED_FIELDS value parity (canon ↔ PDF view-model)', () => {
  const configs = [
    { settType: 'thorp', culture: 'norse', terrain: 'mountain', tradeRouteAccess: 'isolated' },
    { settType: 'town', culture: 'germanic', terrain: 'river', tradeRouteAccess: 'road' },
    { settType: 'city', culture: 'imperial', terrain: 'coast', tradeRouteAccess: 'port' },
  ];

  for (const cfg of configs) {
    it(`every SHARED_FIELDS fact matches canon for ${cfg.settType}/${cfg.terrain}`, () => {
      const s = generateSettlementPipeline(cfg, null, { seed: `parity-${cfg.settType}-2026`, customContent: {} });
      const canon = deriveDossierViewModel(s);
      const vm = buildViewModel({ settlement: s });

      for (const row of SHARED_FIELDS) {
        const canonVal = getByPath(canon, row.canonPath);
        for (const vmPath of row.vmPaths) {
          const raw = getByPath(vm, vmPath);
          const vmVal = row.normalizeVm ? row.normalizeVm(raw) : raw;
          expect(vmVal, `${row.fact} — PDF ${vmPath} must equal canon ${row.canonPath}`).toBe(canonVal);
        }
      }

      // Identity anchor mirrors the DailyLifeTab anchor (not a deriveDossierViewModel
      // path, so it stays a direct assertion alongside the registry walk).
      const fbal = deriveFoodBalance(s);
      expect(vm.identity.anchor.foodDeficit).toBe(fbal.deficit);
      expect(vm.identity.anchor.foodSurplus).toBe(fbal.surplus);
    });
  }
});
