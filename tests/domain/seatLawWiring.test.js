/**
 * seatLawWiring.test.js — THE SEAT LAW (CS10), WIRED, LANDED DARK, LIT AT THE FLIP (SEAT-1 train 1, unit U1).
 *
 * ⭐ WHAT THIS FILE PROVES. A third birth law, `_seatLawVersion`, rides the create boundary
 * beside the density and living-content laws, shaped exactly like the living-content law, so
 * every later unit of the train can ask "was this world born under the seat law?" through ONE
 * reader (`src/domain/seat/seatLaw.js`). It landed DARK: its dial sat at the default, so
 * `birthConfig` minted nothing and no byte of any born world, golden or born fixture moved. The
 * light came last (U8), at the flip of 2026-11-23.
 *
 * THE ARMS, in the brief's order:
 *   1. CREATE (lit, the product path) — `_seatLawVersion: 2` on every birth (its own key only: the
 *      one pin of `birthConfig(null)` is `tests/domain/generationLawsSavedPlace.test.js` (g), E61 (5)).
 *   2. CREATE/CLAMP (lit) — an incoming `_seatLawVersion` (the Library-Load hop, walked) is clamped
 *      away and the dial's own is minted: an imported marker never decides a birth.
 *   3. READ — the closed membership read, from a config, a settlement's `config` and a
 *      settlement's `_config`; everything that is not an enabled version fails closed to 1.
 *   4. THE REGISTER — `GENERATION_LAWS.seat` is a WIRED row whose why says the dial is lit.
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
  it('the vocabulary: one key, two versions, the dial lit', () => {
    expect(SEAT_LAW_CONFIG_KEY).toBe('_seatLawVersion');
    expect([...SEAT_LAW_VERSIONS]).toEqual([1, 2]);
    expect(Object.isFrozen(SEAT_LAW_VERSIONS)).toBe(true);
    expect(DEFAULT_SEAT_LAW_VERSION).toBe(1);
    expect(HOLDER_SEAT_LAW_VERSION).toBe(2);
    // the lit dial (the flip, 2026-11-23): this arm pinned the default and a mint of {} until that day
    expect(
      NEW_SETTLEMENT_SEAT_LAW_VERSION,
      'the seat dial is not lit. It was lit at the flip (2026-11-23), and reverting it is the same'
      + ' one line that moves every born pin at once; revert this arm with it, never before.',
    ).toBe(HOLDER_SEAT_LAW_VERSION);
    expect(newSettlementSeatLaw()).toEqual({ _seatLawVersion: 2 });
  });

  // ── 1. CREATE (lit) ──────────────────────────────────────────────────────────
  it('1. CREATE (lit): birthConfig carries _seatLawVersion: 2 — its own key only, on a config, null and undefined', () => {
    const born = birthConfig({ ...CONFIG });
    // the lit dial (the flip, 2026-11-23): this arm pinned the marker absent until that day
    expect(Object.hasOwn(born, SEAT_LAW_CONFIG_KEY)).toBe(true);
    expect(born[SEAT_LAW_CONFIG_KEY]).toBe(HOLDER_SEAT_LAW_VERSION);
    expect(seatsByHolder(born)).toBe(true);
    // ⭐ THE WHOLE VALUE OF `birthConfig(null)` IS PINNED ONCE, NOT HERE (CLOSE-1 JOIN, the chair's E61 (5),
    // COMMON-RULES 14 (c)): `tests/domain/generationLawsSavedPlace.test.js` (g) pins it from every register row's own
    // mint, dark and lit. This arm keeps the seat law's own key: present on every birth since its dial was lit (absent
    // while it was dark).
    for (const empty of [null, undefined]) {
      expect(birthConfig(empty)[SEAT_LAW_CONFIG_KEY], `birthConfig(${empty})`).toBe(HOLDER_SEAT_LAW_VERSION);
    }
  });

  // ── 2. CREATE/CLAMP (lit) ────────────────────────────────────────────────────
  it('2. CREATE (THE CLAMP, LIT): an incoming _seatLawVersion is clamped away and the dial mints 2 — an imported marker never decides a birth', () => {
    // THE LIT CLAMP (the flip, 2026-11-23): this arm drove an incoming 2 against the dark dial until that day. Lit, the
    // mint re-adds 2, so the adversarial direction is now an imported LAW-1 world's marker (the living-content file's
    // lit clamp arm's shape). Each hop of the Library-Load path is measured, so this arm cannot go green because the
    // path stopped existing: the saved config survives the migration with its marker, and the store's `updateConfig`
    // admits the underscore family by prefix.
    const hydrated = migrateSettlementConfig({ ...CONFIG, [SEAT_LAW_CONFIG_KEY]: DEFAULT_SEAT_LAW_VERSION });
    expect(
      hydrated[SEAT_LAW_CONFIG_KEY],
      'migrateSettlementConfig stopped carrying the marker — this arm no longer tests the'
      + ' Library-Load path it was written for',
    ).toBe(DEFAULT_SEAT_LAW_VERSION);
    expect(isAllowedConfigKey(SEAT_LAW_CONFIG_KEY)).toBe(true);
    // THE POSITIVE CONTROL: unclamped, that config really is a law-1 world.
    expect(seatsByHolder(hydrated)).toBe(false);
    expect(resolveSeatLawVersion(hydrated)).toBe(DEFAULT_SEAT_LAW_VERSION);

    const born = birthConfig(hydrated);
    expect(
      born[SEAT_LAW_CONFIG_KEY],
      'the incoming marker survived birthConfig — a birth\'s seat law is no longer the dial\'s law',
    ).toBe(HOLDER_SEAT_LAW_VERSION);
    expect(seatsByHolder(born)).toBe(true);
    expect(resolveSeatLawVersion(born)).toBe(HOLDER_SEAT_LAW_VERSION);
    // …and a marker for a version that HAS NOT SHIPPED loses too, the same rule a future v3 would arrive by.
    expect(birthConfig(migrateSettlementConfig({ ...CONFIG, [SEAT_LAW_CONFIG_KEY]: 3 }))[SEAT_LAW_CONFIG_KEY]).toBe(HOLDER_SEAT_LAW_VERSION);
    // The clamp takes the marker and NOTHING ELSE: every other incoming key is carried, and the
    // lit laws add exactly their own keys.
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
  it('4. GENERATION_LAWS.seat is a WIRED row that says the dial is lit, and why', () => {
    const row = GENERATION_LAWS.seat;
    expect(row, 'the create boundary carries no seat-law row').toBeTruthy();
    expect(row.configKey).toBe('_seatLawVersion');
    expect(row.configKey).toBe(SEAT_LAW_CONFIG_KEY);
    expect(row.mint).toBe('newSettlementSeatLaw');
    expect(row.dial).toBe('NEW_SETTLEMENT_SEAT_LAW_VERSION');
    expect(row.module).toBe('src/domain/seat/seatLaw.js');
    expect(row.wiring).toBe('WIRED');
    expect(String(row.why).length).toBeGreaterThan(60);
    // the lit why (the flip, 2026-11-23): this arm matched /\bdark\b/i until that day
    expect(row.why).toMatch(/\bDIAL IS LIT\b/);
    expect(row.why).toMatch(/owner/i);
    // THE TOOTH (the chair's Q6): with the quoted history cut out, the text holds no "dark"
    const history = /This row read ".*" until that day\./;
    expect(row.why).toMatch(history);
    const outside = String(row.why).replace(history, '');
    expect(outside).toMatch(/\bDIAL IS LIT\b/);
    // anchored: the quoted history is matched above and the lit sentence survives the cut, so the read is live
    expect(outside).not.toMatch(/\bdark\b/i);
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
