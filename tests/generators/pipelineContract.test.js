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
 */
import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js'; // side-effect: registers all steps
import { runPipeline } from '../../src/generators/pipeline.js';
import { createPRNG } from '../../src/generators/prng.js';
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
