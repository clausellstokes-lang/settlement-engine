/**
 * fortuneLawWiring.test.js — THE FORTUNE LAW (FS5), WIRED AND DARK (FORTUNE-1, unit U1).
 *
 * ⭐ WHAT THIS FILE PROVES. A fourth birth law, `_fortuneLawVersion`, rides the create boundary
 * beside the density and living-content laws (and the seat law, on its own lane), shaped exactly
 * like the seat law's U1, so every later unit of the build (U2 fortune, U3 standing) can ask "was
 * this world born under the fortune law?" through ONE reader (`src/domain/fortune/fortuneLaw.js`).
 * It lands DARK: its dial sits at the default, so `birthConfig` mints nothing and no byte of any
 * born world, golden or born fixture moves. The light is the owner's word, never a lane's, and
 * never before the seat's law.
 *
 * THE ARMS, in the brief's order:
 *   1. CREATE (dark, the product path) — no `_fortuneLawVersion` on a birth, and
 *      `birthConfig(null)` byte-equal to the value `tests/domain/livingContentLawWiring.test.js`
 *      pins for it. THIS IS THE DARK PROOF: birthConfig writes not one byte more than before.
 *   2. CREATE/CLAMP — an incoming `_fortuneLawVersion: 2` (the Library-Load hop, walked) is
 *      clamped away: an imported marker never decides a birth.
 *   3. READ — the closed membership read, from a config, a settlement's `config` and a
 *      settlement's `_config`; everything that is not an enabled version fails closed to 1.
 *   4. THE REGISTER — `GENERATION_LAWS.fortune` is a WIRED row whose why says the dial is dark.
 *   5. CREATE (lit, fired deliberately) — through the seat file's own seam (a mocked law module,
 *      the boundary re-imported), the mint reaches `birthConfig` and the clamp does not defeat
 *      it; and the real reader still reads a markerless world as 1 under a lit dial.
 *   6. THE TUNING TABLE — `FORTUNE_LAW_TUNING` is deep-frozen, and its two size maps name exactly
 *      the six sizes of the density ladder (read from `TIER_ORDER`, never re-typed here).
 *   7. THE HEADER — the leaf's own text says the law is never lit before the seat's law.
 *
 * @enforced-by this test
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it, vi } from 'vitest';

import {
  birthConfig,
  GENERATION_LAWS,
} from '../../src/domain/density/densityCreateBoundary.js';
import {
  DEFAULT_FORTUNE_LAW_VERSION,
  FORTUNE_LAW_CONFIG_KEY,
  FORTUNE_LAW_TUNING,
  FORTUNE_LAW_VERSIONS,
  NEW_SETTLEMENT_FORTUNE_LAW_VERSION,
  SIZE_RELATIVE_FORTUNE_LAW_VERSION,
  isSizeRelativeFortune,
  newSettlementFortuneLaw,
  readFortuneLawVersion,
  resolveFortuneLawVersion,
} from '../../src/domain/fortune/fortuneLaw.js';
import {
  LIVING_CONTENT_LAW_CONFIG_KEY,
  ROSTER_LIVING_CONTENT_LAW_VERSION,
} from '../../src/domain/content/livingContentLawVersion.js';
import { newSettlementDensityLaw } from '../../src/domain/density/densityLaw.js';
import { TIER_ORDER } from '../../src/domain/density/densityBands.js';
import { isAllowedConfigKey } from '../../src/store/configSlice.js';
// The Library's Load runs a saved `settlement._config` through this before `updateConfig`; the
// clamp arm walks that hop rather than asserting about it (the seat clamp arm's shape).
import { migrateSettlementConfig } from '../../src/lib/settlementConfigMigration.js';

const CONFIG = Object.freeze({ settType: 'town' });
const LEAF_REL = 'src/domain/fortune/fortuneLaw.js';

/** Re-import the create boundary with the fortune law's module replaced by a LIT one: the seam
 *  `seatLawWiring.test.js :: boundaryWithLitSeatLaw` uses for the same proof. The product dial is
 *  never touched; the real module's reader is kept, and only the dial and the mint are lit. Torn
 *  down with the module registry. */
async function boundaryWithLitFortuneLaw() {
  vi.resetModules();
  vi.doMock('../../src/domain/fortune/fortuneLaw.js', async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      NEW_SETTLEMENT_FORTUNE_LAW_VERSION: actual.SIZE_RELATIVE_FORTUNE_LAW_VERSION,
      newSettlementFortuneLaw: () => ({
        [actual.FORTUNE_LAW_CONFIG_KEY]: actual.SIZE_RELATIVE_FORTUNE_LAW_VERSION,
      }),
    };
  });
  return import('../../src/domain/density/densityCreateBoundary.js');
}

function tearDownLitFortuneLaw() {
  vi.doUnmock('../../src/domain/fortune/fortuneLaw.js');
  vi.resetModules();
}

/** Every object reachable from `value` (itself included), arrays among them. */
function objectsWithin(value, seen = []) {
  if (value === null || typeof value !== 'object') return seen;
  seen.push(value);
  for (const child of Object.values(value)) objectsWithin(child, seen);
  return seen;
}

describe('the fortune law (FS5) is WIRED and lands DARK', () => {
  it('the vocabulary: one key, two versions, the dial at the default', () => {
    expect(FORTUNE_LAW_CONFIG_KEY).toBe('_fortuneLawVersion');
    expect([...FORTUNE_LAW_VERSIONS]).toEqual([1, 2]);
    expect(Object.isFrozen(FORTUNE_LAW_VERSIONS)).toBe(true);
    expect(DEFAULT_FORTUNE_LAW_VERSION).toBe(FORTUNE_LAW_VERSIONS[0]);
    expect(SIZE_RELATIVE_FORTUNE_LAW_VERSION).toBe(FORTUNE_LAW_VERSIONS[1]);
    expect(DEFAULT_FORTUNE_LAW_VERSION).toBe(1);
    expect(SIZE_RELATIVE_FORTUNE_LAW_VERSION).toBe(2);
    expect(
      NEW_SETTLEMENT_FORTUNE_LAW_VERSION,
      'the fortune dial is not at the default. Lighting it is the owner\'s word, never before the'
      + ' seat\'s law, and moves every born pin at once; revert this arm with it, never before.',
    ).toBe(DEFAULT_FORTUNE_LAW_VERSION);
    expect(newSettlementFortuneLaw()).toEqual({});
  });

  // ── 1. CREATE (dark) ─────────────────────────────────────────────────────────
  it('1. CREATE (dark): birthConfig carries no _fortuneLawVersion, and birthConfig(null) is byte-equal to its pinned value', () => {
    const born = birthConfig({ ...CONFIG });
    expect(Object.hasOwn(born, FORTUNE_LAW_CONFIG_KEY)).toBe(false);
    expect(born[FORTUNE_LAW_CONFIG_KEY]).toBeUndefined();
    expect(isSizeRelativeFortune(born)).toBe(false);
    // The value `livingContentLawWiring.test.js` ("CREATE (LIT, the product path)") pins for
    // `birthConfig(null)`, copied from that arm's own expression and not re-derived: the density
    // mint's marker, then the living-content law's one key. Compared as BYTES as well as by deep
    // equality, so a key the fortune law added (or a key order it moved) reds here.
    const pinned = {
      ...newSettlementDensityLaw(),
      [LIVING_CONTENT_LAW_CONFIG_KEY]: ROSTER_LIVING_CONTENT_LAW_VERSION,
    };
    expect(birthConfig(null)).toEqual(pinned);
    expect(JSON.stringify(birthConfig(null))).toBe(JSON.stringify(pinned));
    expect(JSON.stringify(birthConfig(undefined))).toBe(JSON.stringify(pinned));
    // …and a real config is carried byte for byte, the fortune law adding nothing to it.
    expect(JSON.stringify(born)).toBe(JSON.stringify({ ...CONFIG, ...pinned }));
  });

  // ── 2. CREATE/CLAMP ──────────────────────────────────────────────────────────
  it('2. CREATE (THE CLAMP): an incoming _fortuneLawVersion: 2 is clamped away — an imported marker never decides a birth', () => {
    // Each hop of the Library-Load path is measured, so this arm cannot go green because the
    // path stopped existing: the saved config survives the migration with its marker, and the
    // store's `updateConfig` admits the underscore family by prefix.
    const hydrated = migrateSettlementConfig({ ...CONFIG, [FORTUNE_LAW_CONFIG_KEY]: 2 });
    expect(
      hydrated[FORTUNE_LAW_CONFIG_KEY],
      'migrateSettlementConfig stopped carrying the marker — this arm no longer tests the'
      + ' Library-Load path it was written for',
    ).toBe(SIZE_RELATIVE_FORTUNE_LAW_VERSION);
    expect(isAllowedConfigKey(FORTUNE_LAW_CONFIG_KEY)).toBe(true);
    // THE POSITIVE CONTROL: unclamped, that config really is a fortune-law world.
    expect(isSizeRelativeFortune(hydrated)).toBe(true);

    const born = birthConfig(hydrated);
    expect(
      Object.hasOwn(born, FORTUNE_LAW_CONFIG_KEY),
      'the marker survived birthConfig — a birth\'s fortune law is no longer the dial\'s law',
    ).toBe(false);
    expect(isSizeRelativeFortune(born)).toBe(false);
    expect(resolveFortuneLawVersion(born)).toBe(DEFAULT_FORTUNE_LAW_VERSION);
    // The clamp takes the marker and NOTHING ELSE: every other incoming key is carried, and the
    // lit laws add exactly their own keys.
    expect(born).toEqual(birthConfig(migrateSettlementConfig({ ...CONFIG })));
  });

  // ── 3. READ ──────────────────────────────────────────────────────────────────
  it('3. READ: resolveFortuneLawVersion reads 2 from a config, a settlement\'s config and its _config; everything else fails closed to 1', () => {
    expect(resolveFortuneLawVersion({ [FORTUNE_LAW_CONFIG_KEY]: 2 })).toBe(2);
    expect(resolveFortuneLawVersion({ config: { [FORTUNE_LAW_CONFIG_KEY]: 2 } })).toBe(2);
    expect(resolveFortuneLawVersion({ _config: { [FORTUNE_LAW_CONFIG_KEY]: 2 } })).toBe(2);
    expect(isSizeRelativeFortune({ [FORTUNE_LAW_CONFIG_KEY]: 2 })).toBe(true);
    expect(isSizeRelativeFortune({ config: { [FORTUNE_LAW_CONFIG_KEY]: 2 } })).toBe(true);
    expect(isSizeRelativeFortune({ _config: { [FORTUNE_LAW_CONFIG_KEY]: 2 } })).toBe(true);

    // FAIL CLOSED — absent, a string, an unshipped version, null, NaN, an empty bag.
    const failClosed = [undefined, '2', 3, null, Number.NaN, {}];
    for (const value of failClosed) {
      expect(readFortuneLawVersion(value), `readFortuneLawVersion(${String(value)})`).toBe(1);
      for (const shape of [
        { [FORTUNE_LAW_CONFIG_KEY]: value },
        { config: { [FORTUNE_LAW_CONFIG_KEY]: value } },
        { _config: { [FORTUNE_LAW_CONFIG_KEY]: value } },
      ]) {
        expect(resolveFortuneLawVersion(shape), `resolve ${JSON.stringify(shape)}`).toBe(1);
        expect(isSizeRelativeFortune(shape)).toBe(false);
      }
    }
    for (const bag of [undefined, null, {}, '2', 3, Number.NaN, { config: null }, { _config: 'x' }]) {
      expect(resolveFortuneLawVersion(bag), `resolve ${String(bag)}`).toBe(1);
      expect(isSizeRelativeFortune(bag)).toBe(false);
    }
    // The explicit default is a v1 world, not a marker of anything else.
    expect(resolveFortuneLawVersion({ [FORTUNE_LAW_CONFIG_KEY]: 1 })).toBe(1);
    // A settlement's own `config` is read FIRST (the order `regenSection` reads), so a
    // markerless config is not overridden by a lit `_config` echo.
    expect(resolveFortuneLawVersion({ config: {}, _config: { [FORTUNE_LAW_CONFIG_KEY]: 2 } })).toBe(1);
  });

  // ── 4. THE REGISTER ──────────────────────────────────────────────────────────
  it('4. GENERATION_LAWS.fortune is a WIRED row that says the dial is dark, and why', () => {
    const row = GENERATION_LAWS.fortune;
    expect(row, 'the create boundary carries no fortune-law row').toBeTruthy();
    expect(row.configKey).toBe('_fortuneLawVersion');
    expect(row.configKey).toBe(FORTUNE_LAW_CONFIG_KEY);
    expect(row.mint).toBe('newSettlementFortuneLaw');
    expect(row.dial).toBe('NEW_SETTLEMENT_FORTUNE_LAW_VERSION');
    expect(row.module).toBe(LEAF_REL);
    expect(row.wiring).toBe('WIRED');
    expect(String(row.why).length).toBeGreaterThan(60);
    expect(row.why).toMatch(/\bdark\b/i);
    expect(row.why).toMatch(/owner/i);
  });

  // ── 5. CREATE (lit, fired deliberately) ──────────────────────────────────────
  it('5. CREATE (LIT, fired deliberately): the mint reaches birthConfig, and the clamp does not defeat it', async () => {
    // THE ANTI-VACUITY ARM FOR ARMS 1 AND 2: without it "birthConfig writes nothing" is equally
    // true of a boundary that never calls the mint at all.
    const mod = await boundaryWithLitFortuneLaw();
    try {
      const lit = await import('../../src/domain/fortune/fortuneLaw.js');
      expect(lit.NEW_SETTLEMENT_FORTUNE_LAW_VERSION).toBe(SIZE_RELATIVE_FORTUNE_LAW_VERSION);
      expect(lit.newSettlementFortuneLaw()).toEqual({ _fortuneLawVersion: 2 });

      const minted = mod.birthConfig({ ...CONFIG });
      expect(
        minted[FORTUNE_LAW_CONFIG_KEY],
        'the fortune mint is not reaching birthConfig — every dark arm in this file is vacuous',
      ).toBe(SIZE_RELATIVE_FORTUNE_LAW_VERSION);
      expect(lit.isSizeRelativeFortune(minted)).toBe(true);
      // Exactly one key more than the dark birth: the fortune marker, and nothing else moved.
      expect(minted).toEqual({ ...birthConfig({ ...CONFIG }), [FORTUNE_LAW_CONFIG_KEY]: 2 });
      // The mint is spread LAST, so an incoming dark (or unshipped) marker is overruled by the dial.
      expect(mod.birthConfig({ ...CONFIG, [FORTUNE_LAW_CONFIG_KEY]: 1 })[FORTUNE_LAW_CONFIG_KEY]).toBe(2);
      expect(mod.birthConfig({ ...CONFIG, [FORTUNE_LAW_CONFIG_KEY]: 3 })[FORTUNE_LAW_CONFIG_KEY]).toBe(2);
      // READ (LIT dial): the real reader still reads a markerless world as 1 — the version comes
      // from the world's own config and never from the dial.
      expect(lit.resolveFortuneLawVersion({})).toBe(DEFAULT_FORTUNE_LAW_VERSION);
      expect(lit.resolveFortuneLawVersion({ ...CONFIG })).toBe(DEFAULT_FORTUNE_LAW_VERSION);
      expect(lit.isSizeRelativeFortune({ config: { ...CONFIG } })).toBe(false);
    } finally {
      tearDownLitFortuneLaw();
    }
  });

  // ── 6. THE TUNING TABLE ──────────────────────────────────────────────────────
  it('6. FORTUNE_LAW_TUNING is deep-frozen, and its two size maps name exactly the six sizes', () => {
    const within = objectsWithin(FORTUNE_LAW_TUNING);
    // A real denominator: the table, standing, the three maps beneath it and six ranges at least.
    expect(within.length).toBeGreaterThanOrEqual(1 + 1 + 3 + TIER_ORDER.length);
    const thawed = within.filter((node) => !Object.isFrozen(node));
    expect(thawed, 'a nested object of the law\'s table is writable — a DRAFT figure must change'
      + ' only by an edit of the leaf, never by a caller').toEqual([]);

    const sizes = [...TIER_ORDER].sort();
    expect(sizes.length).toBe(6);
    expect(Object.keys(FORTUNE_LAW_TUNING.depthExpectation).sort()).toEqual(sizes);
    expect(Object.keys(FORTUNE_LAW_TUNING.standing.defenceUsualRange).sort()).toEqual(sizes);
    // Each usual range is a [low, high] pair of band names.
    for (const size of TIER_ORDER) {
      const range = FORTUNE_LAW_TUNING.standing.defenceUsualRange[size];
      expect(range, size).toHaveLength(2);
      for (const band of range) expect(typeof band, `${size} ${band}`).toBe('string');
    }
  });

  // ── 7. THE HEADER ────────────────────────────────────────────────────────────
  it('7. the leaf\'s header says the fortune law is never lit before the seat\'s law', () => {
    const text = readFileSync(join(process.cwd(), LEAF_REL), 'utf8');
    const header = text.slice(0, text.indexOf('*/'));
    expect(header).toMatch(/NEVER LIT BEFORE THE SEAT'S LAW/);
    expect(header).toContain('src/domain/seat/seatLaw.js');
    expect(header).toMatch(/A WORLD BORN BEFORE THE LIGHT NEVER CHANGES/);
    expect(header).toMatch(/\bDARK\b/);
    // The leaf imports nothing: no cycle can form through it. The liveness anchor first: the
    // text read is the leaf itself (it declares the mint), so an absent import is the leaf's.
    expect(text).toMatch(/^export function newSettlementFortuneLaw\(\)/m);
    // anchored: the text is proven to be the leaf's own source by the declaration pinned above
    expect(text).not.toMatch(/^\s*import\s/m);
  });
});
