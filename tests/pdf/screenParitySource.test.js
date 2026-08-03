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
 *
 * CANNOT-CATCH (C3-experience finding 10): this pins TWO contracted facts, not
 * the whole surface. Any OTHER fact a screen tab reads from raw settlement.*
 * while the PDF derives it via viewModel.js can still diverge with all tests
 * green (e.g. a future legitimacy sub-score computed tab-side). A structural
 * guard needs an enumeration of the viewModel parity contract plus a per-fact
 * screen-source walker — a design lift deliberately NOT taken as a polish fix.
 * Residual: viewModelParity.test.js holds the PDF side; new contracted facts
 * must add their screen pin here when they land (deliberately deferred —
 * documented, not a bug to re-find).
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (p) => readFileSync(resolve(process.cwd(), p), 'utf-8');

// The PDF side is a MODULE SET, not one file. THE DECOMPOSITION WAVE (lane D)
// moved the food and defense derivations out of viewModel.js into
// viewModelPrimitives.js / viewModelBodySlices.js; a pin anchored on the single
// old filename would have failed on a pure relocation, and — worse — a later
// relocation could have left it green while guarding nothing. Globbing every
// src/pdf/lib/viewModel*.js keeps the pin attached to the CODE.
const VM_DIR = 'src/pdf/lib/';
const viewModelFiles = readdirSync(resolve(process.cwd(), VM_DIR))
  .filter((f) => /^viewModel.*\.js$/.test(f))
  .sort();
const readViewModelSet = () => viewModelFiles.map((f) => read(VM_DIR + f)).join('\n');

describe('PDF↔screen parity — shared derivation source is pinned on BOTH sides', () => {
  it('the view-model module set is non-empty (the glob cannot go vacuous)', () => {
    expect(viewModelFiles).toContain('viewModel.js');
  });

  it('the PDF view-model sources food + defense from the shared display helpers', () => {
    const vm = readViewModelSet();
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
