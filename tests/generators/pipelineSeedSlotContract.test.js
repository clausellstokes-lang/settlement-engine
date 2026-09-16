/**
 * tests/generators/pipelineSeedSlotContract.test.js — WHICH ARGUMENT IS THE SEED.
 *
 * `generateSettlementPipeline(config, importedNeighbour, options)` takes a seed
 * in exactly one place: `options.seed`, the third argument. There are two ways
 * to get that wrong, they look identical to a reader, and BOTH used to fail
 * silently — the seed was dropped on the floor and generation fell through to
 * `generateSeed()`, so the call site believed it was seeded and was not:
 *
 *   generateSettlementPipeline(config, { seed })   — options in the NEIGHBOUR slot
 *   generateSettlementPipeline({ seed, settType }) — seed in the CONFIG slot
 *
 * ── WHY THIS FILE EXISTS ──────────────────────────────────────────────────
 *
 * The second spelling shipped. The simulation spine's real-generation pins ran
 * unseeded for their entire life while asserting seed-stable prose, and the
 * spine's jsdom render pin did the same. Nothing failed, because nothing could
 * tell the difference between "this seed produces this world" and "some world
 * produced something acceptable" — the pins were flaky by construction and
 * passed on the draw. A determinism assertion cannot be written over a call
 * that is not actually seeded, and no test could see that it wasn't.
 *
 * So the pipeline now REFUSES both spellings at the door rather than
 * reproducing them, and this file is the pin on that refusal. It also pins the
 * two LEGITIMATE seed paths as negative controls — a guard that rejects
 * everything would satisfy the throw assertions perfectly while breaking
 * generation, and `config._seed` in particular must keep working because it is
 * how a saved settlement replays itself under THE PROMISE.
 */

import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const CFG = Object.freeze({ settType: 'village' });

describe('the seed belongs in the options slot, and nowhere else', () => {
  it('REFUSES a seed placed in the config slot', () => {
    expect(() => generateSettlementPipeline({ ...CFG, seed: 'wrong-slot' }))
      .toThrow(/carries a `seed` key/);
    // The message has to name the cure, because the whole failure mode is a
    // caller who is confident and wrong.
    expect(() => generateSettlementPipeline({ ...CFG, seed: 'wrong-slot' }))
      .toThrow(/generateSettlementPipeline\(config, null, \{ seed/);
  });

  it('REFUSES an options bag placed in the importedNeighbour slot', () => {
    expect(() => generateSettlementPipeline(CFG, { seed: 'wrong-slot' }))
      .toThrow(/second argument is importedNeighbour/);
  });

  it('the refusal is specific: a config with no seed key generates normally', () => {
    // NEGATIVE CONTROL for both guards. Without this, a guard that threw on
    // every call would pass every assertion above.
    const settlement = generateSettlementPipeline(CFG, null, {
      seed: 'right-slot', customContent: {},
    });
    expect(settlement.name).toBeTruthy();
    expect(settlement._seed).toBe('right-slot');
  });

  it('options.seed is honoured: the same seed reproduces the same world', () => {
    const a = generateSettlementPipeline(CFG, null, { seed: 'repro', customContent: {} });
    const b = generateSettlementPipeline(CFG, null, { seed: 'repro', customContent: {} });
    expect(a._seed).toBe('repro');
    expect(b.name).toBe(a.name);
    expect(b.settlementReason).toEqual(a.settlementReason);
  });

  it('config._seed REPLAY stays legitimate and is not caught by the config guard', () => {
    // `_seed` is the saved-settlement replay path. The guard rejects `seed`
    // and must not graze `_seed`, or every replay of an existing world throws.
    const original = generateSettlementPipeline(CFG, null, { seed: 'replay-me', customContent: {} });
    const replayed = generateSettlementPipeline(
      { ...CFG, _seed: original._seed }, null, { customContent: {} },
    );
    expect(replayed._seed).toBe('replay-me');
    expect(replayed.name).toBe(original.name);
  });

  it('different seeds really do produce different worlds', () => {
    // The control that makes the reproduction pins above non-vacuous: if
    // generation ignored the seed entirely, "same seed, same world" would hold
    // trivially and prove nothing.
    const names = new Set(
      ['div-1', 'div-2', 'div-3', 'div-4'].map(
        seed => generateSettlementPipeline(CFG, null, { seed, customContent: {} }).name,
      ),
    );
    expect(names.size).toBeGreaterThan(1);
  });
});
