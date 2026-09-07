/** @vitest-environment jsdom */
/**
 * advanceParanoia.test.js — R-18 WORKER PARANOIA MODE.
 *
 * Two things to pin: THE GATE (dev-only + flag, never on in production) and THE
 * DIFF (a worldState divergence is detected and surfaced; identical worlds are
 * silent). The gate is the load-bearing one — a paranoia mode that could run in
 * production would double every user's advance.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  PARANOIA_FLAG,
  paranoiaEnabled,
  firstDivergence,
  verifyAdvanceDeterminism,
} from '../../src/lib/advanceParanoia.js';

const FLAG_KEY = `flag.${PARANOIA_FLAG}`;

beforeEach(() => {
  localStorage.clear();
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  localStorage.clear();
});

function setDev(on) { vi.stubEnv('DEV', on); }
function setFlag(on) { localStorage.setItem(FLAG_KEY, String(on)); }

describe('R-18 the gate — dev-only AND flag-on', () => {
  it('the flag defaults OFF (so production is never on even without the DEV gate)', async () => {
    const { FLAGS } = await import('../../src/lib/flags.js');
    expect(FLAGS[PARANOIA_FLAG].default).toBe(false);
  });

  it('is FALSE in production (DEV=false) even when the flag is forced on', () => {
    setDev(false);
    setFlag(true);
    expect(paranoiaEnabled()).toBe(false);
  });

  it('is FALSE in dev when the flag is off (the default)', () => {
    setDev(true);
    // no flag override → default false
    expect(paranoiaEnabled()).toBe(false);
  });

  it('is TRUE only when BOTH dev and the flag are on', () => {
    setDev(true);
    setFlag(true);
    expect(paranoiaEnabled()).toBe(true);
  });
});

describe('R-18 firstDivergence — the worldState diff', () => {
  it('returns null for deep-equal worldStates', () => {
    const a = { tick: 5, factions: [{ id: 'x', power: 3 }], meta: { seed: 's' } };
    const b = { tick: 5, factions: [{ id: 'x', power: 3 }], meta: { seed: 's' } };
    expect(firstDivergence(a, b)).toBeNull();
  });

  it('reports a primitive divergence with its dotted path', () => {
    expect(firstDivergence({ tick: 5 }, { tick: 6 })).toMatch(/^worldState\.tick: primitive differs/);
  });

  it('reports differing key sets, an array length, and a nested path', () => {
    expect(firstDivergence({ a: 1 }, { a: 1, b: 2 })).toMatch(/keys differ/);
    expect(firstDivergence({ xs: [1, 2] }, { xs: [1, 2, 3] })).toMatch(/worldState\.xs: length 2 ≠ 3/);
    expect(firstDivergence({ f: { g: { h: 1 } } }, { f: { g: { h: 2 } } })).toMatch(/^worldState\.f\.g\.h:/);
  });

  it('the divergence message carries NO world state (only path + type/length reason)', () => {
    const msg = firstDivergence({ secret: 'covert-corruption-detail' }, { secret: 'different-secret' }, 'worldState');
    expect(msg).not.toContain('covert-corruption-detail');
    expect(msg).not.toContain('different-secret');
    expect(msg).toMatch(/str\(len \d+\)/); // reports the length, never the value
  });
});

describe('R-18 verifyAdvanceDeterminism — orchestration', () => {
  it('GATE CLOSED (prod): does NOT run the sync path at all, returns null', async () => {
    setDev(false);
    setFlag(true);
    const runSync = vi.fn(() => ({ worldState: { tick: 1 } }));
    const report = vi.fn();
    const out = await verifyAdvanceDeterminism({ workerResult: { worldState: { tick: 1 } }, runSync, report });
    expect(out).toBeNull();
    expect(runSync).not.toHaveBeenCalled();   // the byte-neutral no-op path
    expect(report).not.toHaveBeenCalled();
  });

  it('GATE OPEN + identical worlds: runs sync once, reports nothing, returns null', async () => {
    setDev(true);
    setFlag(true);
    const worldState = { tick: 9, factions: [{ id: 'a' }] };
    const runSync = vi.fn(() => ({ worldState: { tick: 9, factions: [{ id: 'a' }] } }));
    const report = vi.fn();
    const out = await verifyAdvanceDeterminism({ workerResult: { worldState }, runSync, report });
    expect(runSync).toHaveBeenCalledOnce();
    expect(out).toBeNull();
    expect(report).not.toHaveBeenCalled();
  });

  it('GATE OPEN + divergent worlds: reports the divergence through the R-14 kind, returns the path', async () => {
    setDev(true);
    setFlag(true);
    const runSync = vi.fn(() => ({ worldState: { tick: 10 } }));
    const report = vi.fn();
    const out = await verifyAdvanceDeterminism({ workerResult: { worldState: { tick: 9 } }, runSync, report });
    expect(out).toMatch(/^worldState\.tick: primitive differs/);
    expect(report).toHaveBeenCalledOnce();
    const [err, ctx] = report.mock.calls[0];
    expect(ctx.kind).toBe('determinism.worker-sync-divergence');
    expect(String(err?.message)).toMatch(/worker↔sync determinism divergence/);
  });

  it('GATE OPEN + sync throws: swallows it and returns null (real sim errors are the caller’s rollback)', async () => {
    setDev(true);
    setFlag(true);
    const runSync = vi.fn(() => { throw new Error('sim blew up'); });
    const report = vi.fn();
    const out = await verifyAdvanceDeterminism({ workerResult: { worldState: {} }, runSync, report });
    expect(out).toBeNull();
    expect(report).not.toHaveBeenCalled();
  });
});
