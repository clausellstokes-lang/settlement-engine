/**
 * readerCorpusManifest.test.js — the reader corpus is composed from the golden key.
 *
 * SCOPE AT THIS TIP. This file covers the KEY DERIVATION half of the corpus law: that
 * `scripts/lib/golden-corpus-key.mjs` is the same derivation the golden test performs, and
 * that it round-trips every row of the real 525-row manifest. The COMPOSITION half — a
 * composed region's saves, the yearly advance, and the rendered documents' hashes — is owed
 * by the reader-corpus car and extends THIS file rather than adding another, so the
 * landing's new-test-file count stays at the two the bill predicts.
 *
 * NO `it.each` AND NO GENERATED TITLES: the each-family park ceiling has zero headroom, so
 * every arm is a plain `it` with its loop inside.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  GOLDEN_KEY_FIELDS,
  GOLDEN_KEY_SEPARATOR,
  goldenKeyOf,
  configFromGoldenKey,
  manifestRows,
} from '../../scripts/lib/golden-corpus-key.mjs';

const MANIFEST_PATH = resolve(process.cwd(), 'tests', 'fixtures', 'generator-golden-master.json');
const GOLDEN_TEST_PATH = resolve(process.cwd(), 'tests', 'property', 'generatorGoldenMaster.test.js');

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'));

describe('the reader corpus is composed from the golden key', () => {
  it('the field order is exactly the six the golden manifest is keyed by, and it is frozen', () => {
    expect([...GOLDEN_KEY_FIELDS]).toEqual([
      'settType', 'culture', 'terrainOverride', 'tradeRouteAccess', 'monsterThreat', '_seed',
    ]);
    expect(Object.isFrozen(GOLDEN_KEY_FIELDS)).toBe(true);
    expect(GOLDEN_KEY_SEPARATOR).toBe('|');
  });

  it('the derivation is the golden test own arrow, read from its source and compared field for field', () => {
    // THE POINT OF THIS ARM: the golden test's private `keyOf` is the authority for this
    // law, and this module only transcribes it. If a future car changes the golden's key
    // — adds a seventh field, reorders two — this arm reds HERE, at the transcription,
    // rather than letting every consumer silently read a corpus keyed differently from
    // the manifest they compare it against.
    const source = readFileSync(GOLDEN_TEST_PATH, 'utf-8');
    const arrow = /const keyOf = \(c\) => \[([^\]]+)\]\.join\('\|'\);/.exec(source);
    expect(Array.isArray(arrow)).toBe(true);
    const fields = arrow[1].split(',').map((part) => part.trim().replace(/^c\./, ''));
    expect(fields).toEqual([...GOLDEN_KEY_FIELDS]);
  });

  it('every key in the real manifest carries exactly six fields and round-trips unchanged', () => {
    const keys = Object.keys(manifest);
    expect(keys.length).toBe(525);
    const broken = [];
    for (const key of keys) {
      const config = configFromGoldenKey(key);
      if (goldenKeyOf(config) !== key) broken.push(key);
      if (Object.keys(config).length !== GOLDEN_KEY_FIELDS.length) broken.push(key);
    }
    expect(broken).toEqual([]);
  });

  it('a reconstructed config names a real generator vocabulary in every field of every row', () => {
    // A round-trip alone would pass on garbage that happens to survive a split and a join.
    // This arm asserts the reconstruction lands on the generator's OWN closed vocabularies,
    // so a key that round-trips but names nothing real is still caught.
    const seen = { settType: new Set(), culture: new Set(), terrainOverride: new Set(), tradeRouteAccess: new Set(), monsterThreat: new Set(), _seed: new Set() };
    for (const config of manifestRows(manifest)) {
      for (const field of GOLDEN_KEY_FIELDS) seen[field].add(config[field]);
    }
    expect([...seen.settType].sort()).toEqual(['city', 'hamlet', 'metropolis', 'thorp', 'town', 'village']);
    expect([...seen.monsterThreat].sort()).toEqual(['civilized', 'frontier', 'plagued', 'safe']);
    expect([...seen._seed].sort()).toEqual(['gm-seed-a', 'gm-seed-b', 'gm-seed-c', 'golden-master-v3']);
    expect([...seen.terrainOverride].sort()).toEqual(['auto', 'coastal', 'desert', 'forest', 'hills', 'mountain', 'plains', 'riverside']);
    expect([...seen.tradeRouteAccess].sort()).toEqual(['crossroads', 'isolated', 'mountain_pass', 'none', 'port', 'random_trade', 'river', 'road']);
    expect([...seen.culture].length).toBe(12);
  });

  it('manifestRows returns one config per manifest key, in the manifest own key order', () => {
    const rows = manifestRows(manifest);
    const keys = Object.keys(manifest);
    expect(rows.length).toBe(keys.length);
    const drift = [];
    for (let index = 0; index < rows.length; index += 1) {
      if (goldenKeyOf(rows[index]) !== keys[index]) drift.push(keys[index]);
    }
    expect(drift).toEqual([]);
    expect(manifestRows(null)).toEqual([]);
    expect(manifestRows(undefined)).toEqual([]);
  });

  it('a key with the wrong field count is refused, and the refusal names both counts', () => {
    // A caller that silently accepted five fields would generate a DIFFERENT settlement
    // and compare it against another row's hash — a false red that reads like real drift.
    expect(() => configFromGoldenKey('town|germanic|plains|road|civilized')).toThrow(/must carry 6 fields/);
    expect(() => configFromGoldenKey('town|germanic|plains|road|civilized|seed|extra')).toThrow(/got 7/);
    expect(() => configFromGoldenKey('')).toThrow(/got 1/);
  });

  it('a non-string key is refused by type before it can be split', () => {
    expect(() => configFromGoldenKey(null)).toThrow(TypeError);
    expect(() => configFromGoldenKey(undefined)).toThrow(TypeError);
    expect(() => configFromGoldenKey(42)).toThrow(/must be a string/);
    expect(() => configFromGoldenKey(['town'])).toThrow(/must be a string/);
  });

  it('a missing or nullish field joins as the empty string, exactly as the golden test join does', () => {
    // Divergence here would be invisible: the module would key an incomplete config
    // differently from the arrow it transcribes, and only the rows with a missing field
    // would disagree.
    const partial = { settType: 'town', culture: 'germanic' };
    const viaJoin = [
      partial.settType, partial.culture, partial.terrainOverride,
      partial.tradeRouteAccess, partial.monsterThreat, partial._seed,
    ].join('|');
    expect(goldenKeyOf(partial)).toBe(viaJoin);
    expect(goldenKeyOf({})).toBe('|||||');
    expect(goldenKeyOf(null)).toBe('|||||');
    expect(goldenKeyOf({ settType: null, culture: undefined })).toBe('|||||');
  });
});
