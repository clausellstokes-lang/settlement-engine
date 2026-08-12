/**
 * neighbourMirror.test.js — FP IN-1b: the standing line's read-model, driven.
 *
 * The mirror leaf (IN-1a) answers "what does our own durable record say that court has
 * been shown of us?", and answers it with a frozen unknown whenever we have shown them
 * nothing. This read-model turns that into at most one row per counterpart, and THE
 * ABSENCE RULE is the property the whole dark path rests on: a counterpart we have shown
 * nothing produces NO ROW, rather than a row reading "unknown". Dark, every counterpart
 * takes that path, the array is empty, and the surface renders nothing — with no second
 * read of the gate anywhere in this layer.
 *
 * ⚠ THE ADAPTER RENAME IS INHERITED AND IT IS SILENT WHEN WRONG (D-A). The collector
 * reads a handover row's band from the NESTED shape and republishes it flat. A fixture
 * that writes the flat spelling onto the raw ledger row is the WRONG fixture: it produces
 * an empty mirror and greens every assertion below by measuring nothing. C3 fixes the
 * nested spelling deliberately and asserts a real band comes back out.
 *
 * @enforced-by this file
 */
import { describe, expect, test } from 'vitest';

import {
  MIRROR_BASIS_WORDS, MIRROR_BAND_WORDS, MIRROR_STALENESS_WORDS, neighbourMirrorLines,
} from '../../src/domain/display/neighbourMirror.js';

/** A flag that is genuinely ABSENT, distinguishable from one left to a default. */
const UNSET = Symbol('rules absent');

/** Our own seeded story in their court: the one durable outbound act at this HEAD. */
const PLANT = { liarId: 's', subjectId: 's', audienceId: 'o', assertedBand: 3, seededTick: 10 };

const NAMES = { o: 'Bramwell', p: 'Corvale', s: 'Ashford' };
const nameFor = (id) => NAMES[id] || String(id);

/**
 * A world carrying whatever ledgers a case needs, and nothing aimed at `p`.
 * @param {{ flag?: unknown, disinfo?: unknown, intelTransfers?: unknown }} args
 */
function world({ flag = true, disinfo = [PLANT], intelTransfers = [] } = {}) {
  return {
    ...(flag === UNSET ? {} : { simulationRules: { secondOrderBeliefEnabled: flag } }),
    spatialLedgers: { disinfo, intelTransfers },
  };
}

const call = (worldState, extra = {}) => neighbourMirrorLines({
  worldState, settlementId: 's', counterpartIds: ['o', 'p'], tick: 12, nameFor, ...extra,
});

describe('C1 — the main reachable behavior: one row per counterpart we have shown', () => {
  test('a seeded plant yields one frozen row, banded, dated and spoken in record voice', () => {
    const rows = call(world());
    expect(rows).toHaveLength(1);
    const [row] = rows;
    expect(Object.isFrozen(row)).toBe(true);
    expect(row.counterpartId).toBe('o');
    expect(row.counterpartName).toBe('Bramwell');
    // The band is the mirror's own rung, and the staleness is derived from tick - seededTick
    // (12 - 10 = 2 weeks, inside the fastest half-life rung).
    expect(row.band).toBe('strong');
    expect(row.staleness).toBe('a_season');
    expect(row.line).toBe('Bramwell has been shown a strong hand, within the season.');
  });

  test('the sentence names the counterpart and speaks the record, not a mind', () => {
    const [row] = call(world());
    expect(row.line).toContain('Bramwell');
    expect(row.line).toContain('has been shown');
    expect(row.line).toContain(MIRROR_BAND_WORDS.strong);
    expect(row.line).toContain(MIRROR_STALENESS_WORDS.a_season);
  });
});

describe('C2 — the absence rule, with its seeded sibling', () => {
  test('a counterpart shown nothing yields NO ROW, while the shown one yields exactly one', () => {
    const rows = call(world());
    // THE SEEDED SIBLING IS THE ANCHOR: `o` proves the call really derives rows on this
    // world, so `p`'s absence measures the absence rule rather than an empty pipeline.
    expect(rows.map((row) => row.counterpartId)).toEqual(['o']);
    expect(rows[0].counterpartName).toBe('Bramwell');
  });

  test('dark — an absent key and an explicit false both yield [] for BOTH counterparts', () => {
    expect(call(world({ flag: UNSET }))).toEqual([]);
    expect(call(world({ flag: false }))).toEqual([]);
  });

  test('no row is ever minted for a counterpart carrying only the head rungs', () => {
    // The same world with its one durable act removed: the leaf answers the frozen
    // unknown for every counterpart, so the array empties rather than filling with
    // rows that would say nothing at all.
    expect(call(world({ disinfo: [] }))).toEqual([]);
  });
});

describe('C3 — the sparse and malformed cases, and the inherited adapter rename', () => {
  test('a LIVE-tick handover yields a row, read through the NESTED band the adapter renames', () => {
    const transfer = {
      sellerId: 's', receiverId: 'o', subjectId: 's', mode: 'sale',
      belief: { strengthBand: 2 }, fidelity01: 0.4, depositTick: 12,
    };
    const rows = call(world({ disinfo: [], intelTransfers: [transfer] }));
    expect(rows).toHaveLength(1);
    expect(rows[0].band).toBe('ready');
    // The handover ledger is LIVE BUT MEMORYLESS — it carries no durable date, so the
    // sentence says so rather than inventing one.
    expect(rows[0].staleness).toBe('unknown');
  });

  test('a PRIOR-tick handover yields nothing, because the ledger prunes it', () => {
    const stale = {
      sellerId: 's', receiverId: 'o', subjectId: 's', mode: 'sale',
      belief: { strengthBand: 2 }, fidelity01: 1, depositTick: 11,
    };
    expect(call(world({ disinfo: [], intelTransfers: [stale] }))).toEqual([]);
  });

  test('every malformed shape answers the empty array without throwing', () => {
    const cases = [
      ['null world', { worldState: null }],
      ['garbage world', { worldState: 'not a world' }],
      ['missing settlementId', { settlementId: undefined }],
      ['non-array counterpartIds', { counterpartIds: 'o' }],
      ['counterpart equals self', { counterpartIds: ['s'] }],
      ['non-finite tick', { tick: Number.NaN }],
      ['missing nameFor', { nameFor: undefined }],
    ];
    for (const [label, override] of cases) {
      const run = () => neighbourMirrorLines({
        worldState: world(), settlementId: 's', counterpartIds: ['o', 'p'], tick: 12, nameFor, ...override,
      });
      expect(run, label).not.toThrow();
      expect(run(), label).toEqual([]);
    }
    // THE NON-VACUITY CONTROL: the same call with none of those overrides does produce a
    // row, so the seven empties above measure totality rather than a broken fixture.
    expect(call(world())).toHaveLength(1);
  });

  test('a counterpart id repeated in the list still yields exactly one row', () => {
    const rows = neighbourMirrorLines({
      worldState: world(), settlementId: 's', counterpartIds: ['o', 'o', 'o'], tick: 12, nameFor,
    });
    expect(rows).toHaveLength(1);
  });
});

describe('C6 — determinism and the DM privacy boundary', () => {
  test('two identical calls are byte-identical, and order is codepoint-stable', () => {
    const lit = world({ disinfo: [PLANT, { ...PLANT, audienceId: 'p', seededTick: 11 }] });
    const first = neighbourMirrorLines({
      worldState: lit, settlementId: 's', counterpartIds: ['o', 'p'], tick: 12, nameFor,
    });
    const second = neighbourMirrorLines({
      worldState: lit, settlementId: 's', counterpartIds: ['o', 'p'], tick: 12, nameFor,
    });
    expect(JSON.stringify(second)).toBe(JSON.stringify(first));
    expect(first.map((row) => row.counterpartId)).toEqual(['o', 'p']);
    // The SAME two counterparts handed over in the opposite order sort identically.
    const shuffled = neighbourMirrorLines({
      worldState: lit, settlementId: 's', counterpartIds: ['p', 'o'], tick: 12, nameFor,
    });
    expect(JSON.stringify(shuffled)).toBe(JSON.stringify(first));
  });

  test('the DM seam is DRIVEN in both directions on the same world', () => {
    const player = call(world())[0];
    const dm = call(world(), { includeGroundTruth: true })[0];
    // Fail closed: the default and an explicit false both withhold the deriving record.
    expect(player.basis).toBeNull();
    expect(player.lastShownTick).toBeNull();
    // …and the DM view populates BOTH, so the nulls above are a boundary rather than an
    // empty derivation.
    expect(dm.basis).toEqual([MIRROR_BASIS_WORDS['plant:strengthBand']]);
    expect(dm.lastShownTick).toBe(10);
    // The player-facing sentence is identical across the seam — only the expansion moves.
    expect(dm.line).toBe(player.line);
  });

  test('the DM expansion names every deriving act it is handed, and drops nothing silently', () => {
    const sealedWorld = {
      simulationRules: { secondOrderBeliefEnabled: true },
      spatialLedgers: {
        disinfo: [PLANT],
        intelTransfers: [],
        secrecyPostures: { s: { level01: 0.8, enteredTick: 12 } },
      },
    };
    const [row] = neighbourMirrorLines({
      worldState: sealedWorld, settlementId: 's', counterpartIds: ['o'], tick: 12, nameFor, includeGroundTruth: true,
    });
    expect(row.basis).toEqual([
      MIRROR_BASIS_WORDS['plant:strengthBand'],
      MIRROR_BASIS_WORDS['posture:sealed'],
    ]);
    // A standing silence is part of the record, and the sentence says so.
    expect(row.line).toContain('Nothing has left our hand since.');
  });
});
