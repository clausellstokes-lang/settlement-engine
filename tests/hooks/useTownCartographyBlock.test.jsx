/**
 * @vitest-environment jsdom
 *
 * tests/hooks/useTownCartographyBlock.test.jsx — TC-5b-i, the seam's lifecycle.
 *
 * C2 (absent/disabled costs nothing), C4 (failure is owned once and never rethrown)
 * and C6 (idempotence + supersession) live here. C1/C3/C5/C7/C8 are the transport's
 * and live in tests/lib/townCartographyBlock.test.js.
 *
 * THE DYNAMIC-IMPORT BOUNDARY IS SPIED, NOT TIMED. C2 must prove the transport module
 * is never imported on a dark render. A timing assertion would be a flake factory, so
 * the transport is mocked with a factory that COUNTS its own instantiation: the count
 * is zero exactly when the module was never imported. `vi.resetModules()` per test
 * makes that count meaningful per test rather than per file.
 *
 * ⚠ Every test here is registered STRAIGHT-LINE — a `test(`/`it(` inside a `for` loop
 * parks the WHOLE file out of the sovereignty-lighting evidence layer while passing.
 */
import { act, renderHook, waitFor } from '@testing-library/react';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const seam = vi.hoisted(() => ({
  factoryCalls: 0,
  compile: vi.fn(),
}));

vi.mock('../../src/lib/townScene/townCartographyBlock.js', () => {
  seam.factoryCalls += 1;
  return { compileTownCartographyBlock: seam.compile };
});

import { useTownCartographyBlock } from '../../src/components/townMap/useTownCartographyBlock.js';

const SETTLEMENT = { id: 'carto-fixture', name: 'Carto Fixture' };
const LIT = { simulationRules: { townCartographyEnabled: true } };
const DARK = { simulationRules: { townCartographyEnabled: false } };

const READY_BLOCK = { wards: [], parcels: [], buildings: [], streets: {}, schemaVersion: 2 };
const readyResult = (block = READY_BLOCK) => ({ status: 'ready', block, planExtent: 1000 });

/** A promise whose settlement this test controls, so ordering is deterministic. */
function deferred() {
  /** @type {(value: unknown) => void} */ let resolve;
  /** @type {(reason: unknown) => void} */ let reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  // @ts-expect-error assigned synchronously by the Promise executor above
  return { promise, resolve, reject };
}

/**
 * Drain the microtask queue AND one macrotask turn inside act(), so any state
 * update a settled promise chain would produce has actually been applied by the
 * time the next assertion runs.
 */
const flush = () => act(async () => {
  await new Promise((resolve) => { setTimeout(resolve, 0); });
});

let warnSpy;

beforeEach(() => {
  vi.resetModules();
  seam.factoryCalls = 0;
  seam.compile.mockReset();
  warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  warnSpy.mockRestore();
});

describe('TC-5b-i C2 — a dark reader pays nothing, and a lit one demonstrably does not', () => {
  it('settles on idle without ever importing the transport, while the lit hook does import it', async () => {
    seam.compile.mockResolvedValue(readyResult());

    const dark = renderHook(() => useTownCartographyBlock({
      settlement: SETTLEMENT,
      worldState: DARK,
      audience: 'dm',
    }));

    await waitFor(() => expect(dark.result.current.status).toBe('idle'));
    expect(dark.result.current.available).toBe(false);
    expect(dark.result.current.block).toBeNull();
    expect(dark.result.current.planExtent).toBeNull();
    // THE MEASUREMENT: the mock factory runs on first import of the transport, so a
    // zero count is proof the module was never fetched at all.
    expect(seam.factoryCalls).toBe(0);
    expect(seam.compile).not.toHaveBeenCalled();
    dark.unmount();

    // THE LIVENESS ANCHOR, same test: the identical hook LIT does reach the transport.
    // Without this, `factoryCalls === 0` would also be green if the boundary had
    // drifted out from under the spy entirely.
    const litHook = renderHook(() => useTownCartographyBlock({
      settlement: SETTLEMENT,
      worldState: LIT,
      audience: 'dm',
    }));
    await waitFor(() => expect(litHook.result.current.status).toBe('ready'));
    expect(seam.factoryCalls).toBeGreaterThan(0);
    expect(litHook.result.current.available).toBe(true);
    litHook.unmount();
  });

  it('an absent settlement is idle even when the world is lit', async () => {
    seam.compile.mockResolvedValue(readyResult());

    const { result } = renderHook(() => useTownCartographyBlock({
      settlement: null,
      worldState: LIT,
      audience: 'dm',
    }));

    await waitFor(() => expect(result.current.status).toBe('idle'));
    expect(result.current.available).toBe(false);
    expect(seam.factoryCalls).toBe(0);
  });

  // ⚠ SCOPE OF THIS TEST, stated honestly. It pins the OUTCOME — a world that goes
  // dark reports idle with no block — and NOT the mechanism. The hook discards the
  // stale state during render rather than in an effect, which in production avoids
  // one painted frame still reporting the previous settlement as available; but
  // renderHook's `rerender` wraps in act(), which flushes effects before returning,
  // so an effect-based reset passes this test too (measured: it does). The
  // render-phase reset is kept because production has no act(), not because this
  // test could tell the difference.
  it('a world that goes dark reports idle, with no block and not available', async () => {
    seam.compile.mockResolvedValue(readyResult());

    const { result, rerender } = renderHook(
      ({ world }) => useTownCartographyBlock({
        settlement: SETTLEMENT,
        worldState: world,
        audience: 'dm',
      }),
      { initialProps: { world: LIT } },
    );

    await waitFor(() => expect(result.current.status).toBe('ready'));
    // anchored: the hook is proven to reach `ready` on the line above, so the
    // idle assertion below measures the dark transition rather than a hook that
    // never produced a block in the first place.
    expect(result.current.available).toBe(true);

    rerender({ world: DARK });

    expect(result.current.status).toBe('idle');
    expect(result.current.available).toBe(false);
    expect(result.current.block).toBeNull();
  });

  it('a compile that yields no block reports unavailable, not ready', async () => {
    seam.compile.mockResolvedValue({ status: 'unavailable', block: null, planExtent: null });

    const { result } = renderHook(() => useTownCartographyBlock({
      settlement: SETTLEMENT,
      worldState: LIT,
      audience: 'dm',
    }));

    await waitFor(() => expect(result.current.status).toBe('unavailable'));
    expect(result.current.available).toBe(false);
    expect(result.current.block).toBeNull();
  });
});

describe('TC-5b-i C4 — failure is owned once, and never reaches React or the reader', () => {
  it('drives the hook to failed, warns exactly once, and leaks no error text', async () => {
    const secret = 'townScene compile premise: SENTINEL-DO-NOT-SURFACE';
    seam.compile.mockRejectedValue(new TypeError(secret));

    const { result } = renderHook(() => useTownCartographyBlock({
      settlement: SETTLEMENT,
      worldState: LIT,
      audience: 'dm',
    }));

    await waitFor(() => expect(result.current.status).toBe('failed'));
    expect(result.current.block).toBeNull();
    expect(result.current.planExtent).toBeNull();
    expect(result.current.available).toBe(false);
    expect(warnSpy).toHaveBeenCalledTimes(1);

    // The reader-facing notice is TC-5b-ii's A-4 copy, never a raw premise string:
    // no part of the compiler's message may appear anywhere in the returned value.
    // Anchored on 'failed', which proves this really is the live serialized result.
    expectAbsentWithAnchor(
      JSON.stringify(result.current),
      'SENTINEL-DO-NOT-SURFACE',
      'failed',
      'useTownCartographyBlock result (no error text)',
    );
  });
});

describe('TC-5b-i C6 — idempotence, supersession, and a silent unmount', () => {
  it('compiles once across re-renders with the same input', async () => {
    seam.compile.mockResolvedValue(readyResult());

    const { result, rerender } = renderHook(
      ({ audience }) => useTownCartographyBlock({
        settlement: SETTLEMENT,
        worldState: LIT,
        audience,
      }),
      { initialProps: { audience: 'dm' } },
    );

    await waitFor(() => expect(result.current.status).toBe('ready'));
    rerender({ audience: 'dm' });
    rerender({ audience: 'dm' });
    await waitFor(() => expect(result.current.status).toBe('ready'));

    expect(seam.compile).toHaveBeenCalledTimes(1);
  });

  it('recompiles when audience changes, and the LATER generation wins even settling first', async () => {
    const first = deferred();
    const second = deferred();
    seam.compile
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);

    const { result, rerender } = renderHook(
      ({ audience }) => useTownCartographyBlock({
        settlement: SETTLEMENT,
        worldState: LIT,
        audience,
      }),
      { initialProps: { audience: 'dm' } },
    );

    await waitFor(() => expect(result.current.status).toBe('compiling'));
    rerender({ audience: 'public' });
    await waitFor(() => expect(seam.compile).toHaveBeenCalledTimes(2));

    // The SECOND generation settles FIRST, then the stale first generation settles.
    second.resolve(readyResult({ ...READY_BLOCK, marker: 'second' }));
    await waitFor(() => expect(result.current.block?.marker).toBe('second'));

    first.resolve(readyResult({ ...READY_BLOCK, marker: 'first' }));
    // ⚠ FLUSH HARD, and this is load-bearing. An earlier cut used a single
    // `await Promise.resolve()` here, which returns before the stale chain's
    // remaining microtasks run — so the assertion below passed BEFORE the stale
    // result could land, and a mutant with the generation guard deleted still went
    // green. Draining real macrotasks is what makes this measure the drop.
    await flush();
    await flush();

    // The stale result is DROPPED, not applied: the later generation still holds.
    expect(result.current.block.marker).toBe('second');
    expect(seam.compile).toHaveBeenNthCalledWith(1, expect.objectContaining({ audience: 'dm' }));
    expect(seam.compile).toHaveBeenNthCalledWith(2, expect.objectContaining({ audience: 'public' }));
  });

  it('an unmount before settlement updates no state and warns not at all', async () => {
    const pending = deferred();
    seam.compile.mockReturnValueOnce(pending.promise);

    const { result, unmount } = renderHook(() => useTownCartographyBlock({
      settlement: SETTLEMENT,
      worldState: LIT,
      audience: 'dm',
    }));

    await waitFor(() => expect(result.current.status).toBe('compiling'));
    unmount();

    // The rejection lands AFTER the unmount and must be silent. Flushed hard for
    // the same reason as the supersession case: a shallow flush would let this
    // assertion run before the guard was ever consulted.
    pending.reject(new Error('rejected after unmount'));
    await flush();
    await flush();

    expect(warnSpy).not.toHaveBeenCalled();
    expect(result.current.status).toBe('compiling');
  });
});
