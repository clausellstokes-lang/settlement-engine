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
import '../../src/generators/generateSettlementPipeline.js'; // side-effect: registers all steps
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
