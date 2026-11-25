/**
 * troubleLawWiring.test.js — THE TROUBLE LAW, WIRED AND DARK (lane KINDS-1, unit K1).
 *
 * ⭐ WHAT THIS FILE PROVES. A birth law, `_troubleLawVersion`, rides the create boundary beside the
 * density and living-content laws (and the fortune and seat laws, on their own lanes), on the
 * fortune law's exact shape (`tests/domain/fortuneLawWiring.test.js` on the fortune lane), so
 * `historyGenerator.js :: buildHistoricalEvent` asks "was this world born under the weighted trouble
 * law?" through ONE reader (`src/domain/trouble/troubleLaw.js`). It lands DARK: its dial sits at the
 * default, so `birthConfig` mints nothing and no byte of any born world, golden or born fixture
 * moves. The light is the owner's word, never a lane's (the chair's one unit at the close).
 *
 * THE ARMS, in the brief's order (K1.md, MANIFEST item 6):
 *   1. CREATE (lit, the product path; point 116) — every birth mints `_troubleLawVersion: 2` (its own
 *      key only: the one pin of `birthConfig(null)` is `tests/domain/generationLawsSavedPlace.test.js`
 *      (g), E61 (5), which spreads every register row's mint, this law's included).
 *   2. CREATE/CLAMP — an incoming `_troubleLawVersion: 2` (the Library-Load hop, walked) is
 *      clamped away: an imported marker never decides a birth.
 *   3. READ — the closed membership read, from a config, a settlement's `config` and its `_config`;
 *      everything that is not an enabled version fails closed to 1.
 *   4. THE REGISTER — `GENERATION_LAWS.trouble` is a WIRED row whose why says the dial is lit, by whom.
 *   5. CREATE (lit, fired deliberately) — through the mocked-module seam, the mint reaches
 *      `birthConfig` and the clamp does not defeat it; the real reader still reads a markerless
 *      world as 1 under a lit dial.
 *   6. THE TABLE — `TROUBLE_WEIGHT_TUNING` is deep-frozen, and every row has 0 < floor <= ceiling < 1.
 *   7. THE HEADER — the leaf carries the owner's two rules VERBATIM, says it is LIT and by whose
 *      decision (its numbers drafts), and imports nothing.
 *
 * @enforced-by this test
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it, vi } from 'vitest';

import {
  birthConfig,
  GENERATION_LAWS,
} from '../../../src/domain/density/densityCreateBoundary.js';
import {
  DEFAULT_TROUBLE_LAW_VERSION,
  NEW_SETTLEMENT_TROUBLE_LAW_VERSION,
  TROUBLE_LAW_CONFIG_KEY,
  TROUBLE_LAW_VERSIONS,
  TROUBLE_WEIGHT_TUNING,
  WEIGHTED_TROUBLE_LAW_VERSION,
  isWeightedTrouble,
  newSettlementTroubleLaw,
  readTroubleLawVersion,
  resolveTroubleLawVersion,
} from '../../../src/domain/trouble/troubleLaw.js';
import { isAllowedConfigKey } from '../../../src/store/configSlice.js';
// The Library's Load runs a saved `settlement._config` through this before `updateConfig`; the
// clamp arm walks that hop rather than asserting about it (the fortune clamp arm's shape).
import { migrateSettlementConfig } from '../../../src/lib/settlementConfigMigration.js';

const CONFIG = Object.freeze({ settType: 'town' });
const LEAF_REL = 'src/domain/trouble/troubleLaw.js';
const LEAF_SPEC = '../../../src/domain/trouble/troubleLaw.js';

/** THE OWNER'S TWO RULES, VERBATIM (the chair's prompt KINDS-1.txt quotes them; the leaf's header
 *  must carry them word for word). */
const OWNER_RULES = Object.freeze([
  'culture only shifts the weight of RNG, never determines it by itself. It goes with the other considered factors.',
  'A calm town should be as it currently is… Don\'t invent drama capitalize on what\'s already there if it\'s there. Sometimes a calm place is precisely what\'s needed… We are not creating the campaign.',
]);

/** Re-import the create boundary with the trouble law's module replaced by a LIT one (the fortune
 *  file's seam). The product dial is never touched; the real reader is kept, and only the dial and
 *  the mint are lit. Torn down with the module registry. */
async function boundaryWithLitTroubleLaw() {
  vi.resetModules();
  vi.doMock(LEAF_SPEC, async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      NEW_SETTLEMENT_TROUBLE_LAW_VERSION: actual.WEIGHTED_TROUBLE_LAW_VERSION,
      newSettlementTroubleLaw: () => ({
        [actual.TROUBLE_LAW_CONFIG_KEY]: actual.WEIGHTED_TROUBLE_LAW_VERSION,
      }),
    };
  });
  return import('../../../src/domain/density/densityCreateBoundary.js');
}

function tearDownLitTroubleLaw() {
  vi.doUnmock(LEAF_SPEC);
  vi.resetModules();
}

/** Every object reachable from `value` (itself included). */
function objectsWithin(value, seen = []) {
  if (value === null || typeof value !== 'object') return seen;
  seen.push(value);
  for (const child of Object.values(value)) objectsWithin(child, seen);
  return seen;
}

describe('the trouble law (KINDS-1 K1) is WIRED and lands DARK', () => {
  it('the vocabulary: one key, two versions, the dial at the default', () => {
    expect(TROUBLE_LAW_CONFIG_KEY).toBe('_troubleLawVersion');
    expect([...TROUBLE_LAW_VERSIONS]).toEqual([1, 2]);
    expect(Object.isFrozen(TROUBLE_LAW_VERSIONS)).toBe(true);
    expect(DEFAULT_TROUBLE_LAW_VERSION).toBe(TROUBLE_LAW_VERSIONS[0]);
    expect(WEIGHTED_TROUBLE_LAW_VERSION).toBe(TROUBLE_LAW_VERSIONS[1]);
    expect(DEFAULT_TROUBLE_LAW_VERSION).toBe(1);
    expect(WEIGHTED_TROUBLE_LAW_VERSION).toBe(2);
    // The dial's value is pinned in ONE test only, "1. CREATE (lit)" below (the chair's rule of 22:01 UTC).
  });

  // ── 1. CREATE (lit) ──────────────────────────────────────────────────────────
  // ⭐ THE ONE ARM OF THIS FILE THAT MOVES WITH THE DIAL: it follows `NEW_SETTLEMENT_TROUBLE_LAW_VERSION`. LIT AT POINT
  // 116 ON 2026-11-25 BY THE TENTH CHAIR'S DECISION, THE OWNER HAVING DEFERRED THE QUESTION TO IT; ITS NUMBERS
  // (`TROUBLE_WEIGHT_TUNING`) STAY DRAFTS UNTIL THE OWNER'S TUNING SIGNATURE. Until then this arm asserted the dial at
  // the default and no key on a birth. Every other arm of the lane's files forces its law in its own config.
  it('1. CREATE (lit): birthConfig mints _troubleLawVersion: 2 — its own key only, on a config, null and undefined', () => {
    expect(
      NEW_SETTLEMENT_TROUBLE_LAW_VERSION,
      'the trouble dial is not lit. It was lit at point 116 by the tenth chair\'s decision, the owner'
      + ' having deferred the question to it; this is the one arm that moves with it.',
    ).toBe(WEIGHTED_TROUBLE_LAW_VERSION);
    expect(NEW_SETTLEMENT_TROUBLE_LAW_VERSION).not.toBe(DEFAULT_TROUBLE_LAW_VERSION);
    expect(newSettlementTroubleLaw()).toEqual({ [TROUBLE_LAW_CONFIG_KEY]: 2 });
    const born = birthConfig({ ...CONFIG });
    expect(Object.hasOwn(born, TROUBLE_LAW_CONFIG_KEY)).toBe(true);
    expect(born[TROUBLE_LAW_CONFIG_KEY]).toBe(2);
    expect(isWeightedTrouble(born)).toBe(true);
    // ⭐ THE WHOLE VALUE OF `birthConfig(null)` IS PINNED ONCE, NOT HERE (CLOSE-1 JOIN, the chair's E61 (5),
    // COMMON-RULES 14 (c)): `tests/domain/generationLawsSavedPlace.test.js` (g) pins it from every register row's own
    // mint, dark and lit, this law's included; it is the pin on the flip's list. This arm keeps the trouble law's own
    // key: 2 on every birth now its dial is lit.
    for (const empty of [null, undefined]) {
      expect(birthConfig(empty)[TROUBLE_LAW_CONFIG_KEY], `birthConfig(${empty})`).toBe(2);
    }
  });

  // ── 2. CREATE/CLAMP ──────────────────────────────────────────────────────────
  it('2. CREATE (THE CLAMP): an incoming _troubleLawVersion: 2 is clamped away — an imported marker never decides a birth', () => {
    const hydrated = migrateSettlementConfig({ ...CONFIG, [TROUBLE_LAW_CONFIG_KEY]: 2 });
    expect(
      hydrated[TROUBLE_LAW_CONFIG_KEY],
      'migrateSettlementConfig stopped carrying the marker — this arm no longer tests the'
      + ' Library-Load path it was written for',
    ).toBe(WEIGHTED_TROUBLE_LAW_VERSION);
    expect(isAllowedConfigKey(TROUBLE_LAW_CONFIG_KEY)).toBe(true);
    // THE POSITIVE CONTROL: unclamped, that config really is a weighted-trouble world.
    expect(isWeightedTrouble(hydrated)).toBe(true);

    // A DIFFERENTIAL, so it holds at either setting of the dial: a birth from a config that carries an incoming
    // marker (2, 1 or a foreign 3) is exactly the birth from the same config without one — the clamp takes the
    // marker and NOTHING ELSE, and the law a birth gets is the dial's, never the incoming one.
    const markerless = birthConfig(migrateSettlementConfig({ ...CONFIG }));
    expect(
      birthConfig(hydrated),
      'the incoming marker survived birthConfig — a birth\'s trouble law is no longer the dial\'s law',
    ).toEqual(markerless);
    for (const incoming of [1, 3, '2']) {
      expect(birthConfig({ ...CONFIG, [TROUBLE_LAW_CONFIG_KEY]: incoming })).toEqual(birthConfig({ ...CONFIG }));
    }
    expect(resolveTroubleLawVersion(birthConfig(hydrated))).toBe(resolveTroubleLawVersion(markerless));
  });

  // ── 3. READ ──────────────────────────────────────────────────────────────────
  it('3. READ: resolveTroubleLawVersion reads 2 from a config, a settlement\'s config and its _config; everything else fails closed to 1', () => {
    expect(resolveTroubleLawVersion({ [TROUBLE_LAW_CONFIG_KEY]: 2 })).toBe(2);
    expect(resolveTroubleLawVersion({ config: { [TROUBLE_LAW_CONFIG_KEY]: 2 } })).toBe(2);
    expect(resolveTroubleLawVersion({ _config: { [TROUBLE_LAW_CONFIG_KEY]: 2 } })).toBe(2);
    expect(isWeightedTrouble({ [TROUBLE_LAW_CONFIG_KEY]: 2 })).toBe(true);
    expect(isWeightedTrouble({ config: { [TROUBLE_LAW_CONFIG_KEY]: 2 } })).toBe(true);
    expect(isWeightedTrouble({ _config: { [TROUBLE_LAW_CONFIG_KEY]: 2 } })).toBe(true);

    // FAIL CLOSED — absent, a string, an unshipped version, null, NaN, an empty bag.
    const failClosed = [undefined, '2', 3, null, Number.NaN, {}];
    for (const value of failClosed) {
      expect(readTroubleLawVersion(value), `readTroubleLawVersion(${String(value)})`).toBe(1);
      for (const shape of [
        { [TROUBLE_LAW_CONFIG_KEY]: value },
        { config: { [TROUBLE_LAW_CONFIG_KEY]: value } },
        { _config: { [TROUBLE_LAW_CONFIG_KEY]: value } },
      ]) {
        expect(resolveTroubleLawVersion(shape), `resolve ${JSON.stringify(shape)}`).toBe(1);
        expect(isWeightedTrouble(shape)).toBe(false);
      }
    }
    for (const bag of [undefined, null, {}, '2', 3, Number.NaN, { config: null }, { _config: 'x' }]) {
      expect(resolveTroubleLawVersion(bag), `resolve ${String(bag)}`).toBe(1);
      expect(isWeightedTrouble(bag)).toBe(false);
    }
    // The explicit default is a v1 world.
    expect(resolveTroubleLawVersion({ [TROUBLE_LAW_CONFIG_KEY]: 1 })).toBe(1);
    // A settlement's own `config` is read FIRST, so a markerless config is not overridden by a lit
    // `_config` echo.
    expect(resolveTroubleLawVersion({ config: {}, _config: { [TROUBLE_LAW_CONFIG_KEY]: 2 } })).toBe(1);
  });

  // ── 4. THE REGISTER ──────────────────────────────────────────────────────────
  it('4. GENERATION_LAWS.trouble is a WIRED row that says the dial is lit, by whose decision, and why', () => {
    const row = GENERATION_LAWS.trouble;
    expect(row, 'the create boundary carries no trouble-law row').toBeTruthy();
    expect(row.configKey).toBe('_troubleLawVersion');
    expect(row.configKey).toBe(TROUBLE_LAW_CONFIG_KEY);
    expect(row.mint).toBe('newSettlementTroubleLaw');
    expect(row.dial).toBe('NEW_SETTLEMENT_TROUBLE_LAW_VERSION');
    expect(row.module).toBe(LEAF_REL);
    expect(row.wiring).toBe('WIRED');
    expect(String(row.why).length).toBeGreaterThan(60);
    // Until point 116 this read /\bdark\b/i: the row now says the dial is lit, by whom, and that its numbers are drafts.
    expect(row.why).toMatch(/THE DIAL IS LIT AT POINT 116 ON 2026-11-25 BY THE TENTH CHAIR'S DECISION/);
    expect(row.why).toMatch(/THE OWNER HAVING DEFERRED THE QUESTION TO IT/);
    expect(row.why).toMatch(/STAY DRAFTS UNTIL THE OWNER'S TUNING SIGNATURE/);
    expect(row.why).not.toMatch(/THE DIAL IS DARK/); // anchored: the same why is matched positively on the three lines above
    expect(row.why).toMatch(/owner/i);
    expect(row.why).toMatch(/zero-import leaf/i);
    expect(row.why).toMatch(/own chunk/i);
  });

  // ── 5. CREATE (lit, fired deliberately) ──────────────────────────────────────
  it('5. CREATE (LIT, fired deliberately): the mint reaches birthConfig, and the clamp does not defeat it', async () => {
    // THE ANTI-VACUITY ARM FOR ARMS 1 AND 2: without it "birthConfig writes nothing" is equally
    // true of a boundary that never calls the mint at all.
    const mod = await boundaryWithLitTroubleLaw();
    try {
      const lit = await import(LEAF_SPEC);
      expect(lit.NEW_SETTLEMENT_TROUBLE_LAW_VERSION).toBe(WEIGHTED_TROUBLE_LAW_VERSION);
      expect(lit.newSettlementTroubleLaw()).toEqual({ _troubleLawVersion: 2 });

      const minted = mod.birthConfig({ ...CONFIG });
      expect(
        minted[TROUBLE_LAW_CONFIG_KEY],
        'the trouble mint is not reaching birthConfig — every dark arm in this file is vacuous',
      ).toBe(WEIGHTED_TROUBLE_LAW_VERSION);
      expect(lit.isWeightedTrouble(minted)).toBe(true);
      // Exactly one key more than the dark birth: the trouble marker, and nothing else moved.
      expect(minted).toEqual({ ...birthConfig({ ...CONFIG }), [TROUBLE_LAW_CONFIG_KEY]: 2 });
      // The mint is spread LAST, so an incoming dark (or unshipped) marker is overruled by the dial.
      expect(mod.birthConfig({ ...CONFIG, [TROUBLE_LAW_CONFIG_KEY]: 1 })[TROUBLE_LAW_CONFIG_KEY]).toBe(2);
      expect(mod.birthConfig({ ...CONFIG, [TROUBLE_LAW_CONFIG_KEY]: 3 })[TROUBLE_LAW_CONFIG_KEY]).toBe(2);
      // READ (LIT dial): the real reader still reads a markerless world as 1.
      expect(lit.resolveTroubleLawVersion({})).toBe(DEFAULT_TROUBLE_LAW_VERSION);
      expect(lit.resolveTroubleLawVersion({ ...CONFIG })).toBe(DEFAULT_TROUBLE_LAW_VERSION);
      expect(lit.isWeightedTrouble({ config: { ...CONFIG } })).toBe(false);
    } finally {
      tearDownLitTroubleLaw();
    }
  });

  // ── 6. THE TABLE ─────────────────────────────────────────────────────────────
  it('6. TROUBLE_WEIGHT_TUNING is deep-frozen, and every row has 0 < floor <= ceiling < 1', () => {
    const within = objectsWithin(TROUBLE_WEIGHT_TUNING);
    // A real denominator: the table and its three rows.
    expect(within.length).toBeGreaterThanOrEqual(4);
    const thawed = within.filter((node) => !Object.isFrozen(node));
    expect(thawed, 'a nested object of the law\'s table is writable — a DRAFT figure must change'
      + ' only by an edit of the leaf, never by a caller').toEqual([]);

    expect(Object.keys(TROUBLE_WEIGHT_TUNING).sort()).toEqual(['crimeWave', 'guildConflict', 'smallPlaceCrime']);
    for (const [name, row] of Object.entries(TROUBLE_WEIGHT_TUNING)) {
      expect(typeof row.read, `${name}.read`).toBe('string');
      for (const field of ['floor', 'ceiling', 'readLow', 'readHigh']) {
        expect(Number.isFinite(row[field]), `${name}.${field}`).toBe(true);
      }
      // THE OWNER'S RULE: no read alone sets a chance to 0 or to 1.
      expect(row.floor > 0, `${name}: floor ${row.floor} is not above 0`).toBe(true);
      expect(row.floor <= row.ceiling, `${name}: floor ${row.floor} is above its ceiling ${row.ceiling}`).toBe(true);
      expect(row.ceiling < 1, `${name}: ceiling ${row.ceiling} is not below 1`).toBe(true);
      expect(row.readLow < row.readHigh, `${name}: an empty read range`).toBe(true);
    }
  });

  // ── 7. THE HEADER ────────────────────────────────────────────────────────────
  it('7. the leaf\'s header carries the owner\'s two rules verbatim, says it is LIT and by whose decision, and the leaf imports nothing', () => {
    const text = readFileSync(join(process.cwd(), LEAF_REL), 'utf8');
    const header = text.slice(0, text.indexOf('*/'));
    for (const rule of OWNER_RULES) {
      expect(header, `the owner's rule is not in the header verbatim: ${rule}`).toContain(rule);
    }
    expect(header).toMatch(/A WORLD BORN BEFORE THE LIGHT NEVER CHANGES/);
    // Until point 116 this read /\bDARK\b/ and /owner's word/i: the header now says the law is lit, by whom, and that
    // its numbers stay drafts (the idiom's "DARK BY DEFAULT" property still stands, so DARK alone proves nothing).
    expect(header).toMatch(/THE LAW IS LIT AT POINT 116 ON 2026-11-25 BY THE TENTH CHAIR'S DECISION/);
    expect(header).toMatch(/THE OWNER HAVING DEFERRED\s+\*\s+THE QUESTION TO IT/);
    expect(header).toMatch(/STAY DRAFTS UNTIL THE OWNER'S TUNING SIGNATURE/);
    expect(header).not.toMatch(/THE LAW IS DARK/); // anchored: the same header is matched positively on the three lines above
    // The leaf imports nothing: no cycle can form through it. The liveness anchor first: the text
    // read is the leaf itself (it declares the mint), so an absent import is the leaf's.
    expect(text).toMatch(/^export function newSettlementTroubleLaw\(\)/m);
    const importLines = text.split('\n').filter((line) => /^\s*import\s/.test(line));
    expect(importLines, 'the trouble law is a zero-import leaf').toEqual([]);
  });
});
