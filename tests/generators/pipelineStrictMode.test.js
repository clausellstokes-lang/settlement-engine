/**
 * pipelineStrictMode.test.js — A+ P1.7.
 *
 * Pins the strict-mode tripwire MECHANISM itself (the integration pin in
 * pipelineContract.test.js proves the real steps are clean; this proves the
 * detector actually fires). Uses a private registry of fake steps — it does NOT
 * import generateSettlementPipeline, so the real step registrations never load
 * here and clearSteps() leaves nothing of consequence behind.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { registerStep, runPipeline, clearSteps } from '../../src/generators/pipeline.js';
import { createPRNG } from '../../src/generators/prng.js';

beforeEach(() => clearSteps());

const rng = () => createPRNG('strict-mode-spec');

describe('runPipeline strict mode — undeclared-write detector', () => {
  it('throws when a step writes a ctx key it never declared', () => {
    registerStep('rogue', { deps: [], provides: [] }, (ctx) => { ctx.sneaky = 1; return {}; });
    expect(() => runPipeline({}, rng(), { strict: true }))
      .toThrow(/undeclared ctx key\(s\) \[sneaky\]/);
  });

  it('throws for an undeclared key arriving via the returned patch', () => {
    // provides:[] but the patch introduces `leaked` — Object.assign writes it.
    registerStep('leaky', { deps: [], provides: [] }, () => ({ leaked: 7 }));
    expect(() => runPipeline({}, rng(), { strict: true })).toThrow(/\[leaked\]/);
  });

  it('passes when the write is declared via provides', () => {
    registerStep('clean', { deps: [], provides: ['out'] }, () => ({ out: 1 }));
    expect(() => runPipeline({}, rng(), { strict: true })).not.toThrow();
  });

  it('passes when an in-place mutation is declared via mutates', () => {
    registerStep('mutator', { deps: [], provides: [], mutates: ['shared'] },
      (ctx) => { ctx.shared = (ctx.shared || 0) + 1; return {}; });
    expect(() => runPipeline({ shared: 0 }, rng(), { strict: true })).not.toThrow();
  });

  it('passes when an internal flag is declared via scratch', () => {
    registerStep('flagger', { deps: [], provides: [], scratch: ['_flag'] },
      (ctx) => { ctx._flag = true; return {}; });
    expect(() => runPipeline({}, rng(), { strict: true })).not.toThrow();
  });

  it('exempts the trace ledger keys globally (no declaration needed)', () => {
    registerStep('tracer', { deps: [], provides: [] }, (ctx) => {
      ctx.simulationTrace = [{ step: 'tracer' }];
      ctx._traceClock = 1;
      return {};
    });
    expect(() => runPipeline({}, rng(), { strict: true })).not.toThrow();
  });

  it('off by default — an undeclared write is silently tolerated', () => {
    registerStep('rogue', { deps: [], provides: [] }, (ctx) => { ctx.sneaky = 1; return {}; });
    expect(() => runPipeline({}, rng())).not.toThrow();
  });

  it('collects violations via onStrictViolation instead of throwing', () => {
    registerStep('rogue', { deps: [], provides: [] }, (ctx) => { ctx.sneaky = 1; return {}; });
    const seen = [];
    expect(() => runPipeline({}, rng(), { onStrictViolation: (v) => seen.push(v) })).not.toThrow();
    expect(seen).toEqual([{ step: 'rogue', keys: ['sneaky'] }]);
  });

  // ── reads-availability (A+ generators.3) ──
  it('throws when a step declares a read of a key no prior step produced', () => {
    registerStep('reader', { deps: [], provides: [], reads: ['absent'] }, () => ({}));
    expect(() => runPipeline({}, rng(), { strict: true })).toThrow(/reads ctx key\(s\) \[absent\] not yet produced/);
  });

  it('passes when the read key was produced by an earlier step', () => {
    registerStep('producer', { deps: [], provides: ['k'] }, () => ({ k: 1 }));
    registerStep('consumer', { deps: ['producer'], provides: [], reads: ['k'] }, (ctx) => { void ctx.k; return {}; });
    expect(() => runPipeline({}, rng(), { strict: true })).not.toThrow();
  });

  it('passes when the read key is supplied by the initial context', () => {
    registerStep('reader', { deps: [], provides: [], reads: ['config'] }, (ctx) => { void ctx.config; return {}; });
    expect(() => runPipeline({ config: {} }, rng(), { strict: true })).not.toThrow();
  });
});
