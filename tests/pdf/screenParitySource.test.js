/**
 * screenParitySource.test.js — pins the SCREEN side of the PDF parity contract.
 *
 * viewModelParity.test.js proves PDF === deriveDossierViewModel (the canonical
 * helper). But that only guarantees PDF-matches-the-helper; it does NOT catch an
 * on-screen tab that stops using the shared helper and reads settlement.* directly
 * (which would diverge from the PDF while every parity test stayed green). Today
 * the screen and PDF DO agree because both source the contracted food/defense facts
 * from the SAME domain/display helpers — this test locks that invariant so it can't
 * silently regress.
 *
 * If a future edit makes EconomicsTab compute food (or DefenseTab compute defense)
 * from raw settlement fields instead of the shared helper, this fails, naming the
 * file — turning the "pins helper-not-screen" gap into a build failure.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (p) => readFileSync(resolve(process.cwd(), p), 'utf-8');

describe('PDF↔screen parity — shared derivation source is pinned on BOTH sides', () => {
  it('the PDF view-model sources food + defense from the shared display helpers', () => {
    const vm = read('src/pdf/lib/viewModel.js');
    expect(vm, 'PDF view-model must derive food via deriveFoodBalance').toContain('deriveFoodBalance');
    expect(vm, 'PDF view-model must derive defense via deriveDefenseReadiness').toContain('deriveDefenseReadiness');
  });

  it('EconomicsTab (screen) sources the contracted FOOD fact from the SAME helper the PDF uses', () => {
    const tab = read('src/components/new/tabs/EconomicsTab.jsx');
    // Same helper the PDF view-model + parity contract's foodBalance rows use.
    expect(tab, 'EconomicsTab must derive food via deriveFoodBalance (screen↔PDF parity)').toContain('deriveFoodBalance');
  });

  it('DefenseTab (screen) sources the contracted DEFENSE fact from the SAME helper the PDF uses', () => {
    const tab = read('src/components/new/tabs/DefenseTab.jsx');
    expect(tab, 'DefenseTab must derive defense via deriveDefenseReadiness (screen↔PDF parity)').toContain('deriveDefenseReadiness');
  });
});
