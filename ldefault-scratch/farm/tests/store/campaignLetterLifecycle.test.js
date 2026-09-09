/**
 * campaignLetterLifecycle.test.js — VISION V-2, the lastReadTick / flagsSeen state
 * lifecycle pins (the persisted-state risk this item carries).
 *
 * migrateCampaign is the single load chokepoint every campaign flows through (local
 * cache, remote fetch, gallery import → createCampaign). These pins prove the read
 * floor + the R-16 flags-seen baseline are NORMALIZED there (no campaign enters the
 * store without them), are PRESERVED verbatim when present (idempotent), and SURVIVE
 * the persist clone (JSON round-trip). The pulse-undo path swaps worldState only —
 * lastReadTick / flagsSeen are TOP-LEVEL campaign fields, structurally untouched.
 */
import { describe, it, expect, beforeAll } from 'vitest';

beforeAll(() => {
  if (typeof globalThis.localStorage === 'undefined') {
    const data = new Map();
    globalThis.localStorage = {
      getItem: (k) => data.get(String(k)) ?? null,
      setItem: (k, v) => { data.set(String(k), String(v)); },
      removeItem: (k) => { data.delete(String(k)); },
      clear: () => data.clear(),
    };
  }
});

const { migrateCampaign } = await import('../../src/store/campaignSlice.js');

describe('V-2 — migrateCampaign normalizes the letter state (load chokepoint)', () => {
  it('a legacy campaign missing the fields gains lastReadTick 0 + flagsSeen null', () => {
    const out = migrateCampaign({ name: 'Realm' });
    expect(out.lastReadTick).toBe(0);
    expect(out.flagsSeen).toBeNull(); // R-16 dark until first recorded
  });

  it('preserves an existing lastReadTick and flagsSeen verbatim (idempotent)', () => {
    const out = migrateCampaign({ name: 'Realm', lastReadTick: 42, flagsSeen: ['warLayerEnabled'] });
    expect(out.lastReadTick).toBe(42);
    expect(out.flagsSeen).toEqual(['warLayerEnabled']);
    // idempotent: a second pass is stable
    const again = migrateCampaign(out);
    expect(again.lastReadTick).toBe(42);
    expect(again.flagsSeen).toEqual(['warLayerEnabled']);
  });

  it('coerces a malformed lastReadTick to 0 and a non-array flagsSeen to null', () => {
    expect(migrateCampaign({ lastReadTick: 'oops' }).lastReadTick).toBe(0);
    expect(migrateCampaign({ lastReadTick: NaN }).lastReadTick).toBe(0);
    expect(migrateCampaign({ flagsSeen: 'oops' }).flagsSeen).toBeNull();
    expect(migrateCampaign({ flagsSeen: {} }).flagsSeen).toBeNull();
  });
});

describe('V-2 — the letter state survives the lifecycle paths', () => {
  it('survives the persist clone (a JSON round-trip preserves both fields)', () => {
    const camp = migrateCampaign({ name: 'Realm', lastReadTick: 17, flagsSeen: ['a', 'b'] });
    const persisted = JSON.parse(JSON.stringify(camp)); // the cloneJson persist path
    const reloaded = migrateCampaign(persisted); // load re-normalizes
    expect(reloaded.lastReadTick).toBe(17);
    expect(reloaded.flagsSeen).toEqual(['a', 'b']);
  });

  it('is a TOP-LEVEL field, so a worldState swap (pulse undo) cannot touch it', () => {
    const camp = migrateCampaign({ name: 'Realm', lastReadTick: 9, flagsSeen: ['x'] });
    // the pulse-undo idiom: c.worldState = <restored snapshot>; top-level fields intact
    const afterUndo = { ...camp, worldState: { tick: 3, simulationRules: {} } };
    expect(afterUndo.lastReadTick).toBe(9);
    expect(afterUndo.flagsSeen).toEqual(['x']);
  });
});
