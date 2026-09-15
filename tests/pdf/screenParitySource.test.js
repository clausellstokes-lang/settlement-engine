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
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { deriveFoodBalance } from '../../src/domain/display/dossierViewModel.js';

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
    expect(vm, 'PDF view-model must derive guard prose via deriveGuardAssessment').toContain('deriveGuardAssessment');
    expect(vm, 'PDF view-model must derive defense vulnerabilities via deriveDefenseVulnerabilities').toContain('deriveDefenseVulnerabilities');
  });

  it('EconomicsTab (screen) sources the contracted FOOD fact from the SAME helper the PDF uses', () => {
    const tab = read('src/components/new/tabs/EconomicsTab.jsx');
    // Same helper the PDF view-model + parity contract's foodBalance rows use.
    expect(tab, 'EconomicsTab must derive food via deriveFoodBalance (screen↔PDF parity)').toContain('deriveFoodBalance');
  });

  it('DefenseTab (screen) sources the contracted DEFENSE fact from the SAME helper the PDF uses', () => {
    const tab = read('src/components/new/tabs/DefenseTab.jsx');
    expect(tab, 'DefenseTab must derive defense via deriveDefenseReadiness (screen↔PDF parity)').toContain('deriveDefenseReadiness');
    expect(tab, 'DefenseTab must derive guard prose via deriveGuardAssessment (screen↔PDF parity)').toContain('deriveGuardAssessment');
    expect(tab, 'DefenseTab must derive vulnerabilities via deriveDefenseVulnerabilities (screen↔PDF parity)').toContain('deriveDefenseVulnerabilities');
  });
});

// ── LT37 car 5 — THE THIRD FOOD-DEFICIT SURFACE, MEASURED ────────────────────
// The cannot-catch above says "any OTHER fact a screen tab reads from raw
// settlement.* while the PDF derives it via viewModel.js can still diverge with
// all tests green". LT37 went looking for a LIVE instance of it and found the
// one the recon named: src/components/new/dailyLifeLogic.js:54 reads
// `fb.deficitPercent` straight off the engine struct, and
// src/components/new/tabs/DailyLifeTab.jsx bands food pressure on that reading,
// while EconomicsTab and SummaryTab were converged by pdf.3 onto
// `deriveFoodBalance(s).deficitPct`. Two readings of "the food deficit", two
// surfaces, one settlement.
//
// ⛔ WHAT THE MEASUREMENT ACTUALLY SAYS, AND IT IS NOT WHAT THE BRIEF EXPECTED.
// The feared divergence ("Deficit 12% in Economics, band Severe in Daily Life")
// IS NOT LIVE at this tree. Measured over 360 generated settlements across six
// configs (348 of them carrying a food deficit): 337 agree EXACTLY, 21 differ by
// 1 point, 2 differ by 2, and the DailyLife band is IDENTICAL in every one of
// the 360. Zero readings straddle any of the band cuts (10 / 20 / 35).
//
// THE CAUSE, read out of the producer rather than guessed: the canonical
// reconcile in src/generators/economy/foodBalance.js (generators-domain-4,
// :281-294) makes both readings descend from the SAME foodSecurity model.
// `dailyNeed` is written as `Math.round(dailyNeedFinal)` and `deficit` is
// RECONSTRUCTED from `deficitPercent` and that same `dailyNeed`
// (`round((cDeficitPct / 100) * dailyNeedFinal)`, clamped into the gross gap),
// so `round(deficit / dailyNeed * 100)` recovers `deficitPercent` up to DOUBLE
// ROUNDING. The residual 1-2 point spread is that double rounding and nothing
// else. The roadmap's pdf.2/pdf.3 framing (the engine's ratio is "pre-import",
// so the two "disagree on every import-dependent settlement") described the tree
// BEFORE that reconcile landed; it no longer describes this one.
//
// SO THIS BLOCK IS A CHARACTERIZING PIN, NOT A BUG REPORT. It freezes the
// measured relationship over a pinned corpus so the divergence is a counted fact
// rather than an impression: if a future change to either side widens the spread
// past 2 points, or moves a band word, this reds and names the seed.
//
// ⛔ THE CURE IS REFUSED, ON THIS MEASUREMENT, BY THE CHAIR (2026-09-15). It was
// carried to the owner's desk as an output-moving question under §764.3 and came
// back a NO: the band word is identical in 360 of 360 settlements, so routing
// dailyLifeLogic through deriveFoodBalance buys no reader-visible correctness and
// spends a same-seed output risk (a 1-2 point spread sitting exactly on a band cut
// CAN move one band word, and one of the three rows it moves is reader-facing
// prose). docs/implementation/LT37-dailylife-food-deficit-cure.md is therefore THE
// RECORD OF A REFUSED CURE, not a pending one: read it to learn why the second
// read is tolerated, and do not re-open it without a new measurement.
describe('the third food-deficit surface — DailyLife bands the engine reading (LT37 car 5)', () => {
  // The DailyLife band table, replicated from DailyLifeTab.jsx:129-133. The arm
  // below pins the replica against that file so it cannot rot into a private
  // opinion about what the tab does.
  const bandOf = (deficitPct, surplusPct) =>
    deficitPct > 35 ? 'Severe'
      : deficitPct > 20 ? 'Serious'
        : deficitPct > 10 ? 'Strained'
          : deficitPct > 0 ? 'Tightening'
            : surplusPct > 10 ? 'Surplus' : 'Adequate';

  const CONFIGS = Object.freeze({
    'desert-thorp': { settType: 'thorp', terrainOverride: 'desert', tradeRouteAccess: 'isolated', priorityEconomy: 15 },
    'isolated-hamlet': { settType: 'hamlet', terrainOverride: 'mountains', tradeRouteAccess: 'isolated', priorityEconomy: 25 },
    'road-town': { settType: 'town', terrainOverride: 'plains', tradeRouteAccess: 'road', priorityEconomy: 55 },
    'port-city': { settType: 'city', terrainOverride: 'coastal', tradeRouteAccess: 'port', priorityEconomy: 70 },
    'swamp-village-nomagic': { settType: 'village', terrainOverride: 'swamp', tradeRouteAccess: 'isolated', priorityEconomy: 20, magicExists: false },
    'isolated-village-poor': { settType: 'village', terrainOverride: 'plains', tradeRouteAccess: 'isolated', priorityEconomy: 20, magicExists: true },
  });

  // PINNED CORPUS. Eight (config, seed) pairs taken out of the 360-settlement
  // sweep and frozen: the two WIDEST observed spreads in both directions, two
  // 1-point cases, and four exact agreements spanning the Tightening / Strained /
  // Severe bands. `delta` is the ACTUAL measured spread at f73bdbf16, not a
  // tolerance: a changed number here means the relationship moved.
  const CORPUS = Object.freeze([
    { pick: 'desert-thorp-46', name: 'Maloya', gross: 92, derived: 94, band: 'Severe' },
    { pick: 'desert-thorp-48', name: 'Silberhausen', gross: 77, derived: 75, band: 'Severe' },
    { pick: 'isolated-hamlet-3', name: 'Dunford', gross: 66, derived: 65, band: 'Severe' },
    { pick: 'isolated-hamlet-45', name: 'Zelenoki', gross: 46, derived: 45, band: 'Severe' },
    { pick: 'road-town-0', name: 'Saraiabad', gross: 5, derived: 5, band: 'Tightening' },
    { pick: 'port-city-0', name: 'Rasfort', gross: 6, derived: 6, band: 'Tightening' },
    { pick: 'swamp-village-nomagic-0', name: 'Khutulunhan', gross: 14, derived: 14, band: 'Strained' },
    { pick: 'isolated-village-poor-0', name: 'Penworth', gross: 18, derived: 18, band: 'Strained' },
  ]);

  /** The two readings for one pinned pair, computed the way each surface computes it. */
  function readBothSurfaces(pick) {
    const configName = pick.replace(/-\d+$/, '');
    const s = generateSettlementPipeline(CONFIGS[configName], null, { seed: `lt37-car5-${pick}`, customContent: {} });
    const fb = s?.economicViability?.metrics?.foodBalance;
    // dailyLifeLogic.js:54 verbatim: the engine's own rounded percentage.
    const gross = fb?.deficit ? (fb.deficitPercent || 0) : 0;
    // The pdf.3 convergence layer EconomicsTab and SummaryTab read.
    const dfb = deriveFoodBalance(s);
    const derived = dfb.deficitPct == null ? 0 : dfb.deficitPct;
    // dailyLifeLogic.js:60-62: the surplus side is the same arithmetic on both
    // surfaces, so it is carried, not compared.
    const surplusPct = fb && !fb.deficit && fb.dailyNeed > 0
      ? Math.round(((fb.surplus || 0) / fb.dailyNeed) * 100)
      : 0;
    return { settlement: s, gross, derived, surplusPct };
  }

  it('the replicated band table still matches DailyLifeTab (the replica cannot rot)', () => {
    const tab = read('src/components/new/tabs/DailyLifeTab.jsx');
    for (const [cut, label] of [[35, 'Severe'], [20, 'Serious'], [10, 'Strained']]) {
      expect(
        new RegExp(`foodDeficit > ${cut}\\s*\\?\\s*'${label}'`).test(tab),
        `DailyLifeTab no longer cuts ${label} at >${cut}; the band table replicated above is stale`,
      ).toBe(true);
    }
    expect(tab, 'DailyLifeTab must still band on ctx.foodDeficit').toContain('ctx.foodDeficit >');
  });

  it('dailyLifeLogic still reads the ENGINE field, and the two converged tabs still do not', () => {
    // The structural fact the measurement is ABOUT, and it is now a REFUSED-cure
    // pin rather than a waiting-for-the-owner one: the second read is tolerated
    // deliberately. If a later change converges it anyway, this arm reds, and it
    // should, so the convergence is recorded rather than silently agreed with.
    const logic = read('src/components/new/dailyLifeLogic.js');
    expect(logic, 'dailyLifeLogic.js no longer reads fb.deficitPercent — if the cure landed, re-measure this block')
      .toContain('deficitPercent');
    // anchored: the toContain directly above is the liveness anchor, proving this same file was read, is non-empty and still carries the engine read, so this absence cannot pass on a vanished or emptied file.
    expect(logic, 'dailyLifeLogic.js does not route through deriveFoodBalance (the REFUSED cure)').not.toContain('deriveFoodBalance');
  });

  // ⛔ ONE PARAMETERLESS TEST LOOPING OVER THE ROWS, NOT `it.each`. The estate's
  // each-family park debt (tests/lint/sovereigntyLightingContract.walker.test.js)
  // is shrink-only and its message names the cure in exactly these words. Every
  // assertion below still names its pinned pair, so a red says which one moved.
  it('every pinned pair: both readings, their measured spread, and one band word', () => {
    for (const row of CORPUS) {
      const { settlement, gross, derived, surplusPct } = readBothSurfaces(row.pick);
      expect(settlement.name, `${row.pick}: the pinned seed no longer produces the pinned settlement`).toBe(row.name);
      expect(gross, `${row.pick}: the ENGINE reading moved`).toBe(row.gross);
      expect(derived, `${row.pick}: the CONVERGENCE-LAYER reading moved`).toBe(row.derived);
      // The reader-visible claim: whatever the spread, both readings land in the
      // SAME DailyLife band, so no settlement shows one pressure word while its
      // sibling tab shows another.
      expect(bandOf(gross, surplusPct), `${row.pick}: band from the engine reading`).toBe(row.band);
      expect(bandOf(derived, surplusPct), `${row.pick}: the two readings band DIFFERENTLY — the divergence pdf.3 exists to kill is now live`)
        .toBe(bandOf(gross, surplusPct));
    }
  });

  it('the corpus is not vacuous: the two readings DO differ on at least one pinned pair', () => {
    // Without this, a corpus of exact agreements would pass even if both sides
    // read the same field, and the block would measure nothing.
    const spreads = CORPUS.map((row) => Math.abs(row.gross - row.derived));
    expect(Math.max(...spreads), 'no pinned pair separates the two readings').toBeGreaterThan(0);
    expect(Math.max(...spreads), 'the measured spread widened past the 2 points double rounding explains')
      .toBeLessThanOrEqual(2);
  });
});
