/** @vitest-environment jsdom */

/**
 * authIntentsFailure.test.js — data-integrity regressions for the
 * "click → auth → continue" intent registry.
 *
 * Two failure modes, both of which silently dropped a stashed dossier:
 *
 *   L14  writeStored() cleared _memoryStore on a successful sessionStorage
 *        write, and readStored() prefers a present sessionStorage value over
 *        _memoryStore. If a LATER write threw (quota/disabled), the stale
 *        sessionStorage value shadowed the correct in-memory fallback.
 *
 *   L15  consume() cleared the pending intent BEFORE awaiting the handler and
 *        treated a thrown/falsy handler the same as success. The
 *        SAVE_SETTLEMENT handler returns null on save failure, so a failed
 *        post-auth save silently discarded the stashed dossier.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  INTENTS,
  setPending,
  readPending,
  consume,
  registerHandler,
  _resetForTests,
} from '../../src/lib/authIntents.js';

beforeEach(() => {
  _resetForTests();
});

afterEach(() => {
  vi.restoreAllMocks();
  _resetForTests();
});

const PAYLOAD = { settlement: { name: 'Greycairn' }, name: 'Greycairn', tier: 'town' };

describe('consume() — failed handler does not discard the stash (L15)', () => {
  it('keeps the intent stashed when the handler returns null (save failure)', async () => {
    setPending(INTENTS.SAVE_SETTLEMENT, PAYLOAD);
    // Mirrors the real SAVE_SETTLEMENT handler: it catches its own error and
    // returns null on save failure rather than throwing.
    registerHandler(INTENTS.SAVE_SETTLEMENT, async () => null);

    const result = await consume({});

    expect(result).toBeNull();
    // The dossier must survive for a retry, not vanish.
    expect(readPending()).toEqual({ type: INTENTS.SAVE_SETTLEMENT, payload: PAYLOAD });
  });

  it('keeps the intent stashed when the handler throws', async () => {
    setPending(INTENTS.SAVE_SETTLEMENT, PAYLOAD);
    registerHandler(INTENTS.SAVE_SETTLEMENT, async () => {
      throw new Error('network down');
    });

    const result = await consume({});

    expect(result).toBeNull();
    expect(readPending()).toEqual({ type: INTENTS.SAVE_SETTLEMENT, payload: PAYLOAD });
  });

  it('clears the intent on a successful handler', async () => {
    setPending(INTENTS.SAVE_SETTLEMENT, PAYLOAD);
    registerHandler(INTENTS.SAVE_SETTLEMENT, async () => ({ id: 'save_1' }));

    const result = await consume({});

    expect(result).toEqual({ id: 'save_1' });
    expect(readPending()).toBeNull();
  });
});

describe('consume() — idempotent against concurrent SIGNED_IN re-fire', () => {
  it('does not dispatch the same stash twice when consume re-fires mid-flight', async () => {
    setPending(INTENTS.SAVE_SETTLEMENT, PAYLOAD);

    let calls = 0;
    let release;
    const gate = new Promise((resolve) => { release = resolve; });
    // A slow handler models a real network save still in flight when a second
    // SIGNED_IN (token refresh / second tab) fires consume() again.
    registerHandler(INTENTS.SAVE_SETTLEMENT, async () => {
      calls += 1;
      await gate;
      return { id: 'save_1' };
    });

    const first = consume({});
    // Second consume of the SAME stash while the first is still awaiting must
    // be a no-op — otherwise the save fires twice (duplicate dossier).
    const second = await consume({});
    expect(second).toBeNull();
    expect(calls).toBe(1);

    release();
    await first;
    expect(calls).toBe(1);
    expect(readPending()).toBeNull();
  });

  it('dedups a re-fire of a stash that has NO id (older / external stash format)', async () => {
    // setPending always assigns an id, but a stash can reach consume() without
    // one — an older stash format, or an intent written straight to storage
    // outside setPending. The in-flight guard keyed on id alone, so a no-id
    // stash would never match and could re-fire → duplicate save.
    window.sessionStorage.setItem(
      'sf:auth_intent',
      JSON.stringify({ type: INTENTS.SAVE_SETTLEMENT, payload: PAYLOAD, stashedAt: Date.now() }),
    );

    let calls = 0;
    let release;
    const gate = new Promise((resolve) => { release = resolve; });
    registerHandler(INTENTS.SAVE_SETTLEMENT, async () => {
      calls += 1;
      await gate;
      return { id: 'save_1' };
    });

    const first = consume({});
    // The second consume re-fires the SAME no-id stash while the first is still
    // in flight. It must be a no-op — not a duplicate dispatch.
    const second = await consume({});
    expect(second).toBeNull();
    expect(calls).toBe(1);

    release();
    await first;
    expect(calls).toBe(1);
    expect(readPending()).toBeNull();
  });

  it('allows a re-stashed intent to dispatch again after a failed save', async () => {
    setPending(INTENTS.SAVE_SETTLEMENT, PAYLOAD);
    let calls = 0;
    registerHandler(INTENTS.SAVE_SETTLEMENT, async () => {
      calls += 1;
      return calls === 1 ? null : { id: 'save_ok' };
    });

    // First dispatch fails (returns null) — stash survives per the L15 contract.
    expect(await consume({})).toBeNull();
    expect(readPending()).not.toBeNull();

    // The user retries: re-stash gives a fresh id, so the guard never suppresses
    // the legitimate second dispatch.
    setPending(INTENTS.SAVE_SETTLEMENT, PAYLOAD);
    expect(await consume({})).toEqual({ id: 'save_ok' });
    expect(calls).toBe(2);
    expect(readPending()).toBeNull();
  });
});

describe('writeStored fallback — a failed write does not leave a stale shadow (L14)', () => {
  it('does not let a stale sessionStorage value shadow the in-memory fallback', () => {
    // First intent writes cleanly to sessionStorage.
    setPending(INTENTS.SAVE_SETTLEMENT, { ...PAYLOAD, name: 'Stale Town' });
    expect(window.sessionStorage.getItem('sf:auth_intent')).not.toBeNull();

    // A later setItem throws (quota exceeded / storage disabled). The fresh
    // intent must fall back to the in-memory store WITHOUT the stale
    // sessionStorage value masking it.
    const setSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    setPending(INTENTS.SAVE_SETTLEMENT, { ...PAYLOAD, name: 'Fresh Town' });
    setSpy.mockRestore();

    // readPending must surface the fresh in-memory value, not the stale one.
    expect(readPending()?.payload.name).toBe('Fresh Town');
  });
});
