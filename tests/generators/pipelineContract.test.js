/**
 * pipelineContract.test.js — A+ P1.7.
 *
 * The pipeline topo-sorts steps by `deps` (step names), but the REAL data flow is
 * the set of ctx keys each step writes — including in-place mutation of shared ctx
 * objects (institutions, factions, effectiveConfig, …) that the old provides:[]
 * declarations hid. runPipeline strict mode asserts every step DECLARED every key
 * it changed (provides ∪ mutates ∪ scratch; the trace ledger is globally exempt).
 *
 * This integration pin runs the real pipeline in strict mode across a spread of
 * configs (covering the isolated-route / tier / terrain branches that trigger the
 * config-dependent in-place mutations). A new undeclared write fails the gate.
 *
 * ── THE STANDING CONTROL (ODQ 764.2, lane T9) ──────────────────────────────────
 * This file was one of the five `kind:"uncovered"` rows in the mutation-coverage
 * manifest, and the reason is worth stating precisely: every assertion in it is
 * `.not.toThrow()`. That is a shape which passes when the guard is REMOVED — a
 * strict mode that had quietly stopped checking anything would leave this suite
 * entirely green, and the twelve configs and six relationship families would go on
 * reporting eighteen greens over a disarmed instrument.
 *
 * The cure is at the bottom: a control that drives the SAME `runPipeline` strict
 * path over an ISOLATED registry (`vi.resetModules()` + a dynamic import, so the
 * process-wide `_steps` singleton every sibling suite shares is never touched) and
 * proves the throw is real, attributable, and discriminating. It runs on every
 * ordinary invocation, not weekly; the sweep's disk-mutate path is closed to build
 * lanes because its revert is the checkout family this program's shared-tree
 * protocol forbids outright.
 */
import { describe, it, expect, vi } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js'; // side-effect: registers all steps
import { getStepMeta, runPipeline } from '../../src/generators/pipeline.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { withCustomContent } from '../../src/lib/dependencyEngine.js';

const CONFIGS = [
  { settType: 'thorp', terrain: 'mountain', tradeRouteAccess: 'isolated', culture: 'norse' },
  { settType: 'hamlet', terrain: 'desert', tradeRouteAccess: 'road', culture: 'desert' },
  { settType: 'village', terrain: 'coast', tradeRouteAccess: 'river', culture: 'coastal' },
  { settType: 'village', terrain: 'arctic', tradeRouteAccess: 'road', culture: 'norse' },
  { settType: 'town', terrain: 'river', tradeRouteAccess: 'road', culture: 'germanic' },
  { settType: 'town', terrain: 'forest', tradeRouteAccess: 'isolated', culture: 'elvish' },
  { settType: 'town', terrain: 'mountain', tradeRouteAccess: 'isolated', culture: 'dwarven' },
  { settType: 'city', terrain: 'coast', tradeRouteAccess: 'port', culture: 'imperial' },
  { settType: 'city', terrain: 'plains', tradeRouteAccess: 'crossroads', culture: 'imperial' },
  { settType: 'metropolis', terrain: 'plains', tradeRouteAccess: 'crossroads', culture: 'imperial' },
  { settType: 'metropolis', terrain: 'swamp', tradeRouteAccess: 'isolated', culture: 'germanic' },
  { settType: 'hamlet', terrain: 'jungle', tradeRouteAccess: 'river', culture: 'coastal' },
];

describe('pipeline data-flow contract — strict mode finds no undeclared writes', () => {
  for (const cfg of CONFIGS) {
    it(`every step declares its writes (${cfg.settType}/${cfg.terrain}/${cfg.tradeRouteAccess})`, () => {
      const seed = `contract-${cfg.settType}-${cfg.terrain}-${cfg.tradeRouteAccess}`;
      const rng = createPRNG(seed);
      const ic = { config: cfg, importedNeighbour: null, _seed: seed, _traceClock: 0 };
      expect(() => withCustomContent({}, () => runPipeline(ic, rng, { strict: true }))).not.toThrow();
    });
  }
});

// A BOUND neighbour activates an entire second write-set the null-neighbour
// configs above never reach: resolveNeighbour, generateEconomy, and
// neighbourFactions all thread neighbour-derived state into effectiveConfig /
// powerStructure IN PLACE only when `rawNeighbour` is truthy. Without this
// block those three in-place writes ship undeclared and invisible — the exact
// coverage hole an adversarial verification caught. Generate one real neighbour
// and run strict mode across the relationship families that gate the branches.
const NEIGHBOUR = withCustomContent({}, () =>
  generateSettlementPipeline(
    { settType: 'city', culture: 'imperial', tradeRouteAccess: 'port' },
    null,
    { seed: 'contract-neighbour-fixture', customContent: {} },
  ));

const REL_TYPES = ['hostile', 'allied', 'rival', 'neutral', 'trade_partner', 'cold_war'];

describe('pipeline data-flow contract — bound-neighbour branch (the writes null-neighbour configs miss)', () => {
  // Breadth: strict across the relationship families. A bound neighbour can
  // activate undeclared writes under any of them; this catches a NEW one.
  for (const rel of REL_TYPES) {
    it(`every step declares its writes with a bound ${rel} neighbour`, () => {
      const seed = `contract-neighbour-${rel}`;
      const rng = createPRNG(seed);
      const cfg = {
        settType: 'town', culture: 'germanic', terrain: 'river',
        tradeRouteAccess: 'road', _neighbourRelType: rel,
      };
      const ic = { config: cfg, importedNeighbour: NEIGHBOUR, _seed: seed, _traceClock: 0 };
      expect(() => withCustomContent({}, () => runPipeline(ic, rng, { strict: true }))).not.toThrow();
    });
  }

  // Teeth: the three bound-neighbour in-place writes are CONDITIONAL (econ bias
  // needs goods overlap; faction mirroring is rng-gated), so a strict run that
  // simply doesn't fire them passes vacuously. This case pins a deterministic
  // (fixture, config, seed) where ALL THREE provably fire, and asserts the
  // observable marker of each — so the strict assertion above is load-bearing:
  // drop any of the three `mutates` declarations and runPipeline throws here.
  it('all three bound-neighbour in-place writes fire and are declared (strict has teeth)', () => {
    const seed = 'contract-bound-all-writes';
    const rng = createPRNG(seed);
    const cfg = {
      settType: 'hamlet', culture: 'germanic', terrain: 'river',
      tradeRouteAccess: 'road', _neighbourRelType: 'hostile',
    };
    const ic = { config: cfg, importedNeighbour: NEIGHBOUR, _seed: seed, _traceClock: 0 };
    let ctx;
    expect(() => { ctx = withCustomContent({}, () => runPipeline(ic, rng, { strict: true })); }).not.toThrow();
    // resolveNeighbour wrote effectiveConfig.neighborRelationship:
    expect(ctx.effectiveConfig.neighborRelationship).toBeTruthy();
    // generateEconomy threaded the neighbour econ bias onto effectiveConfig:
    expect(ctx.effectiveConfig._neighbourEconBias).toBeDefined();
    // neighbourFactions mirrored/opposed a faction into powerStructure in place:
    expect((ctx.powerStructure?.factions || []).some(
      (f) => f.source === 'neighbour_mirror' || f.source === 'neighbour_opposition',
    )).toBe(true);
  });
});

// ── THE STANDING CONTROL (ODQ 764.2) ─────────────────────────────────────────
describe('THE STANDING CONTROL: strict mode is proved able to throw', () => {
  it('the breadth above is not vacuous — the config and relationship spreads are populated', () => {
    // Eighteen `.not.toThrow()` greens over an EMPTY loop is the same green.
    expect(CONFIGS.length).toBeGreaterThanOrEqual(12);
    expect(REL_TYPES.length).toBeGreaterThanOrEqual(6);
    expect(NEIGHBOUR).toBeTruthy();
  });

  it('an UNDECLARED write throws by name, a DECLARED one does not, and a read before its producer throws', async () => {
    // An isolated module graph: the fresh pipeline.js has its own empty step
    // registry, so nothing here can reach the singleton the real steps live in.
    vi.resetModules();
    const iso = await import('../../src/generators/pipeline.js');
    const { createPRNG: isoPRNG } = await import('../../src/kernel/prng.js');
    const run = (seed) => iso.runPipeline({ config: {} }, isoPRNG(seed), { strict: true });

    // 1. A step that declares what it writes passes.
    iso.registerStep('declaresItsWrite', { deps: [], provides: ['alpha'] }, () => ({ alpha: 1 }));
    expect(() => run('control-declared')).not.toThrow();

    // 2. A step that writes a key it never declared is convicted BY NAME.
    iso.registerStep('writesUndeclared', { deps: ['declaresItsWrite'], provides: [] }, (ctx) => {
      ctx.betaWrittenInPlace = 2;
      return null;
    });
    expect(() => run('control-undeclared'))
      .toThrow(/step "writesUndeclared" wrote undeclared ctx key\(s\) \[betaWrittenInPlace\]/);

    // 3. …and the OTHER half of strict — a declared read with no earlier producer —
    //    throws too. Both halves matter: the suite above depends on each.
    vi.resetModules();
    const iso2 = await import('../../src/generators/pipeline.js');
    const { createPRNG: iso2PRNG } = await import('../../src/kernel/prng.js');
    iso2.registerStep('readsWhatNobodyMade', { deps: [], provides: [], reads: ['neverProduced'] }, () => ({}));
    expect(() => iso2.runPipeline({ config: {} }, iso2PRNG('control-read'), { strict: true }))
      .toThrow(/step "readsWhatNobodyMade" reads ctx key\(s\) \[neverProduced\] not yet produced/);

    // 4. DISCRIMINATION: the same undeclared write is SILENT with strict off, so
    //    the throws above are strict mode's doing and not some unrelated failure.
    vi.resetModules();
    const iso3 = await import('../../src/generators/pipeline.js');
    const { createPRNG: iso3PRNG } = await import('../../src/kernel/prng.js');
    iso3.registerStep('writesUndeclared', { deps: [], provides: [] }, (ctx) => {
      ctx.betaWrittenInPlace = 2;
      return null;
    });
    expect(() => iso3.runPipeline({ config: {} }, iso3PRNG('control-lax'), { strict: false })).not.toThrow();
  });

  it('the isolated registry never reached the live one (the control cannot poison a sibling suite)', () => {
    // ⚠ THE LIVE REGISTRY IS THE ONE BOUND BY THIS FILE'S STATIC IMPORT, and only
    // that one. A dynamic `await import(...)` here would hand back the LAST graph
    // vi.resetModules() minted — which is how the first draft of this arm reported
    // a poisoned live registry that was in fact a synthetic one. The arm caught it;
    // the receipt stays because the mistake is the natural one to make.
    // ⚠ ANCHORED, AND THE FIRST DRAFT WAS NOT. These three exclusions were bare
    // negative membership assertions with one shared positive anchor sitting BELOW
    // them as a separate statement — precisely the shape
    // negativeAssertionAnchor.walker refuses, because an anchor that is its own
    // assertion does not travel with the negative: delete or reorder either one and
    // the vacuity silently re-opens. A registry that had drifted to empty would have
    // passed all three. Each exclusion now carries its anchor in the same call.
    // ⚠⚠ AND THE SECOND DRAFT REDDENED TOO, on this very comment: the walker reads
    // SOURCE TEXT and cannot tell a comment from code, so spelling the offending
    // call out here re-introduced it. Describe the shape; never quote it.
    const names = getStepMeta().map((m) => m.name);
    const LIVE = 'resolveConfig'; // a real registered step: same code path, same drift
    for (const synthetic of ['writesUndeclared', 'declaresItsWrite', 'readsWhatNobodyMade']) {
      expectAbsentWithAnchor(names, synthetic, LIVE, 'the isolated registry never reached the live one');
    }
  });
});
