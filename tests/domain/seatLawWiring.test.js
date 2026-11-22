/**
 * seatLawWiring.test.js — THE SEAT LAW (CS10), WIRED AND DARK (SEAT-1 train 1, unit U1).
 *
 * ⭐ WHAT THIS FILE PROVES. A third birth law, `_seatLawVersion`, rides the create boundary
 * beside the density and living-content laws, shaped exactly like the living-content law, so
 * every later unit of the train can ask "was this world born under the seat law?" through ONE
 * reader (`src/domain/seat/seatLaw.js`). It lands DARK: its dial sits at the default, so
 * `birthConfig` mints nothing and no byte of any born world, golden or born fixture moves. The
 * light is a later unit (U8), on the owner's word.
 *
 * THE ARMS, in the brief's order:
 *   1. CREATE (dark, the product path) — no `_seatLawVersion` on a birth, and `birthConfig(null)`
 *      byte-equal to the value `tests/domain/livingContentLawWiring.test.js` pins for it.
 *   2. CREATE/CLAMP — an incoming `_seatLawVersion: 2` (the Library-Load hop, walked) is clamped
 *      away: an imported marker never decides a birth.
 *   3. READ — the closed membership read, from a config, a settlement's `config` and a
 *      settlement's `_config`; everything that is not an enabled version fails closed to 1.
 *   4. THE REGISTER — `GENERATION_LAWS.seat` is a WIRED row whose why says the dial is dark.
 *   5. CREATE (lit, fired deliberately) — through the living-content file's own seam (a mocked
 *      law module, the boundary re-imported), the mint reaches `birthConfig` and the clamp does
 *      not defeat it; and the real reader still reads a markerless world as 1 under a lit dial.
 *
 * @enforced-by this test
 */
import { describe, expect, it, vi } from 'vitest';

import {
  birthConfig,
  GENERATION_LAWS,
} from '../../src/domain/density/densityCreateBoundary.js';
import {
  DEFAULT_SEAT_LAW_VERSION,
  HOLDER_SEAT_LAW_VERSION,
  NEW_SETTLEMENT_SEAT_LAW_VERSION,
  SEAT_LAW_CONFIG_KEY,
  SEAT_LAW_VERSIONS,
  newSettlementSeatLaw,
  readSeatLawVersion,
  resolveSeatLawVersion,
  seatsByHolder,
} from '../../src/domain/seat/seatLaw.js';
import {
  LIVING_CONTENT_LAW_CONFIG_KEY,
  ROSTER_LIVING_CONTENT_LAW_VERSION,
} from '../../src/domain/content/livingContentLawVersion.js';
import { newSettlementDensityLaw } from '../../src/domain/density/densityLaw.js';
import { isAllowedConfigKey } from '../../src/store/configSlice.js';
// The Library's Load runs a saved `settlement._config` through this before `updateConfig`; the
// clamp arm walks that hop rather than asserting about it (the living-content clamp arm's shape).
import { migrateSettlementConfig } from '../../src/lib/settlementConfigMigration.js';

const CONFIG = Object.freeze({ settType: 'town' });

/** Re-import the create boundary with the seat law's module replaced by a LIT one: the seam
 *  `livingContentLawWiring.test.js :: boundaryWithLitLaw` uses for the same proof. The product
 *  dial is never touched; the real module's reader is kept, and only the dial and the mint are
 *  lit. Torn down with the module registry. */
async function boundaryWithLitSeatLaw() {
  vi.resetModules();
  vi.doMock('../../src/domain/seat/seatLaw.js', async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      NEW_SETTLEMENT_SEAT_LAW_VERSION: actual.HOLDER_SEAT_LAW_VERSION,
      newSettlementSeatLaw: () => ({
        [actual.SEAT_LAW_CONFIG_KEY]: actual.HOLDER_SEAT_LAW_VERSION,
      }),
    };
  });
  return import('../../src/domain/density/densityCreateBoundary.js');
}

function tearDownLitSeatLaw() {
  vi.doUnmock('../../src/domain/seat/seatLaw.js');
  vi.resetModules();
}

describe('the seat law (CS10) is WIRED and lands DARK', () => {
  it('the vocabulary: one key, two versions, the dial at the default', () => {
    expect(SEAT_LAW_CONFIG_KEY).toBe('_seatLawVersion');
    expect([...SEAT_LAW_VERSIONS]).toEqual([1, 2]);
    expect(Object.isFrozen(SEAT_LAW_VERSIONS)).toBe(true);
    expect(DEFAULT_SEAT_LAW_VERSION).toBe(1);
    expect(HOLDER_SEAT_LAW_VERSION).toBe(2);
    expect(
      NEW_SETTLEMENT_SEAT_LAW_VERSION,
      'the seat dial is not at the default. Lighting it is U8, on the owner\'s word, and moves'
      + ' every born pin at once; revert this arm with it, never before.',
    ).toBe(DEFAULT_SEAT_LAW_VERSION);
    expect(newSettlementSeatLaw()).toEqual({});
  });

  // ── 1. CREATE (dark) ─────────────────────────────────────────────────────────
  it('1. CREATE (dark): birthConfig carries no _seatLawVersion, and birthConfig(null) is byte-equal to its pinned value', () => {
    const born = birthConfig({ ...CONFIG });
    expect(Object.hasOwn(born, SEAT_LAW_CONFIG_KEY)).toBe(false);
    expect(born[SEAT_LAW_CONFIG_KEY]).toBeUndefined();
    expect(seatsByHolder(born)).toBe(false);
    // The value `livingContentLawWiring.test.js` ("CREATE (LIT, the product path)") pins for
    // `birthConfig(null)`, copied from that arm's own expression and not re-derived: the density
    // mint's marker, then the living-content law's one key. Compared as BYTES as well as by
    // deep equality, so a key the seat law added (or a key order it moved) reds here.
    const pinned = {
      ...newSettlementDensityLaw(),
      [LIVING_CONTENT_LAW_CONFIG_KEY]: ROSTER_LIVING_CONTENT_LAW_VERSION,
    };
    expect(birthConfig(null)).toEqual(pinned);
    expect(JSON.stringify(birthConfig(null))).toBe(JSON.stringify(pinned));
    expect(JSON.stringify(birthConfig(undefined))).toBe(JSON.stringify(pinned));
    // …and a real config is carried byte for byte, the seat law adding nothing to it.
    expect(JSON.stringify(born)).toBe(JSON.stringify({ ...CONFIG, ...pinned }));
  });

  // ── 2. CREATE/CLAMP ──────────────────────────────────────────────────────────
  it('2. CREATE (THE CLAMP): an incoming _seatLawVersion: 2 is clamped away — an imported marker never decides a birth', () => {
    // Each hop of the Library-Load path is measured, so this arm cannot go green because the
    // path stopped existing: the saved config survives the migration with its marker, and the
    // store's `updateConfig` admits the underscore family by prefix.
    const hydrated = migrateSettlementConfig({ ...CONFIG, [SEAT_LAW_CONFIG_KEY]: 2 });
    expect(
      hydrated[SEAT_LAW_CONFIG_KEY],
      'migrateSettlementConfig stopped carrying the marker — this arm no longer tests the'
      + ' Library-Load path it was written for',
    ).toBe(HOLDER_SEAT_LAW_VERSION);
    expect(isAllowedConfigKey(SEAT_LAW_CONFIG_KEY)).toBe(true);
    // THE POSITIVE CONTROL: unclamped, that config really is a seat-law world.
    expect(seatsByHolder(hydrated)).toBe(true);

    const born = birthConfig(hydrated);
    expect(
      Object.hasOwn(born, SEAT_LAW_CONFIG_KEY),
      'the marker survived birthConfig — a birth\'s seat law is no longer the dial\'s law',
    ).toBe(false);
    expect(seatsByHolder(born)).toBe(false);
    expect(resolveSeatLawVersion(born)).toBe(DEFAULT_SEAT_LAW_VERSION);
    // The clamp takes the marker and NOTHING ELSE: every other incoming key is carried, and the
    // two lit laws add exactly their own keys.
    expect(born).toEqual(birthConfig(migrateSettlementConfig({ ...CONFIG })));
  });

  // ── 3. READ ──────────────────────────────────────────────────────────────────
  it('3. READ: resolveSeatLawVersion reads 2 from a config, a settlement\'s config and its _config; everything else fails closed to 1', () => {
    expect(resolveSeatLawVersion({ [SEAT_LAW_CONFIG_KEY]: 2 })).toBe(2);
    expect(resolveSeatLawVersion({ config: { [SEAT_LAW_CONFIG_KEY]: 2 } })).toBe(2);
    expect(resolveSeatLawVersion({ _config: { [SEAT_LAW_CONFIG_KEY]: 2 } })).toBe(2);
    expect(seatsByHolder({ [SEAT_LAW_CONFIG_KEY]: 2 })).toBe(true);
    expect(seatsByHolder({ config: { [SEAT_LAW_CONFIG_KEY]: 2 } })).toBe(true);
    expect(seatsByHolder({ _config: { [SEAT_LAW_CONFIG_KEY]: 2 } })).toBe(true);

    // FAIL CLOSED — absent, a string, an unshipped version, null, NaN, an empty bag.
    const failClosed = [undefined, '2', 3, null, Number.NaN, {}];
    for (const value of failClosed) {
      expect(readSeatLawVersion(value), `readSeatLawVersion(${String(value)})`).toBe(1);
      for (const shape of [
        { [SEAT_LAW_CONFIG_KEY]: value },
        { config: { [SEAT_LAW_CONFIG_KEY]: value } },
        { _config: { [SEAT_LAW_CONFIG_KEY]: value } },
      ]) {
        expect(resolveSeatLawVersion(shape), `resolve ${JSON.stringify(shape)}`).toBe(1);
        expect(seatsByHolder(shape)).toBe(false);
      }
    }
    for (const bag of [undefined, null, {}, '2', 3, Number.NaN, { config: null }, { _config: 'x' }]) {
      expect(resolveSeatLawVersion(bag), `resolve ${String(bag)}`).toBe(1);
      expect(seatsByHolder(bag)).toBe(false);
    }
    // The explicit default is a v1 world, not a marker of anything else.
    expect(resolveSeatLawVersion({ [SEAT_LAW_CONFIG_KEY]: 1 })).toBe(1);
    // A settlement's own `config` is read FIRST (the order `regenSection` reads), so a
    // markerless config is not overridden by a lit `_config` echo.
    expect(resolveSeatLawVersion({ config: {}, _config: { [SEAT_LAW_CONFIG_KEY]: 2 } })).toBe(1);
  });

  // ── 4. THE REGISTER ──────────────────────────────────────────────────────────
  it('4. GENERATION_LAWS.seat is a WIRED row that says the dial is dark, and why', () => {
    const row = GENERATION_LAWS.seat;
    expect(row, 'the create boundary carries no seat-law row').toBeTruthy();
    expect(row.configKey).toBe('_seatLawVersion');
    expect(row.configKey).toBe(SEAT_LAW_CONFIG_KEY);
    expect(row.mint).toBe('newSettlementSeatLaw');
    expect(row.dial).toBe('NEW_SETTLEMENT_SEAT_LAW_VERSION');
    expect(row.module).toBe('src/domain/seat/seatLaw.js');
    expect(row.wiring).toBe('WIRED');
    expect(String(row.why).length).toBeGreaterThan(60);
    expect(row.why).toMatch(/\bdark\b/i);
    expect(row.why).toMatch(/owner/i);
  });

  // ── 5. CREATE (lit, fired deliberately) ──────────────────────────────────────
  it('5. CREATE (LIT, fired deliberately): the mint reaches birthConfig, and the clamp does not defeat it', async () => {
    // THE ANTI-VACUITY ARM FOR ARMS 1 AND 2: without it "birthConfig writes nothing" is equally
    // true of a boundary that never calls the mint at all.
    const mod = await boundaryWithLitSeatLaw();
    try {
      const lit = await import('../../src/domain/seat/seatLaw.js');
      expect(lit.NEW_SETTLEMENT_SEAT_LAW_VERSION).toBe(HOLDER_SEAT_LAW_VERSION);
      expect(lit.newSettlementSeatLaw()).toEqual({ _seatLawVersion: 2 });

      const minted = mod.birthConfig({ ...CONFIG });
      expect(
        minted[SEAT_LAW_CONFIG_KEY],
        'the seat mint is not reaching birthConfig — every dark arm in this file is vacuous',
      ).toBe(HOLDER_SEAT_LAW_VERSION);
      expect(lit.seatsByHolder(minted)).toBe(true);
      // Exactly one key more than the dark birth: the seat marker, and nothing else moved.
      expect(minted).toEqual({ ...birthConfig({ ...CONFIG }), [SEAT_LAW_CONFIG_KEY]: 2 });
      // The mint is spread LAST, so an incoming dark (or unshipped) marker is overruled by the dial.
      expect(mod.birthConfig({ ...CONFIG, [SEAT_LAW_CONFIG_KEY]: 1 })[SEAT_LAW_CONFIG_KEY]).toBe(2);
      expect(mod.birthConfig({ ...CONFIG, [SEAT_LAW_CONFIG_KEY]: 3 })[SEAT_LAW_CONFIG_KEY]).toBe(2);
      // READ (LIT dial): the real reader still reads a markerless world as 1 — the version comes
      // from the world's own config and never from the dial.
      expect(lit.resolveSeatLawVersion({})).toBe(DEFAULT_SEAT_LAW_VERSION);
      expect(lit.resolveSeatLawVersion({ ...CONFIG })).toBe(DEFAULT_SEAT_LAW_VERSION);
      expect(lit.seatsByHolder({ config: { ...CONFIG } })).toBe(false);
    } finally {
      tearDownLitSeatLaw();
    }
  });
});
