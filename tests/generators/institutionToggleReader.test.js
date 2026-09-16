/**
 * institutionToggleReader.test.js — the ONE institution-toggle ladder, and the 23 inlined
 * copies it replaced.
 *
 * §759 weakness 4: the dual toggle-key format (`::` and `_`) with its tier/`all` precedence
 * was spelled by hand at 23 lookup sites across three files, so a format change, a precedence
 * fix or a category rename would land at some and not others — producing seed-visible roster
 * differences no census asks about. The sibling concern had already been bitten exactly that
 * way, which is why `categoryToggleReader.js` exists; this is the same cure for institutions.
 *
 * THE ARM THAT MATTERS is the PLANTED DIVERGENCE. A reader that agrees with an empty toggle
 * map agrees with everything, so each rung of the ladder is driven against a map that holds
 * ONLY that rung — and then against a ladder with the rung removed, which must disagree.
 *
 * @enforced-by this file
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import {
  institutionToggleFor, institutionToggleKeys,
} from '../../src/generators/institutionToggleReader.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

const CONSUMERS = Object.freeze([
  'src/generators/steps/assembleInstitutions.js',
  'src/generators/cascadeGenerator.js',
  'src/generators/factionCorrelation.js',
]);

describe('the ladder', () => {
  test('the key ORDER is the one the inlined chains resolved, most specific first', () => {
    expect(institutionToggleKeys(['town'], 'Religious', 'Parish church')).toEqual([
      'town::Religious::Parish church',
      'town_Religious_Parish church',
      'all::Religious::Parish church',
      'all_Religious_Parish church',
    ]);
    // The cascade pass reads TWO tier candidates; `all` is appended by the reader, never
    // passed in, so a caller cannot accidentally drop the sentinel.
    expect(institutionToggleKeys(['city', 'town'], 'Trade', 'Market')).toEqual([
      'city::Trade::Market', 'city_Trade_Market',
      'town::Trade::Market', 'town_Trade_Market',
      'all::Trade::Market', 'all_Trade_Market',
    ]);
  });

  test('EVERY rung is reachable, one at a time', () => {
    // Driven per rung against a map holding only that rung: a reader that quietly stopped
    // consulting one key would pass a test that only ever populates the first.
    const keys = institutionToggleKeys(['town'], 'Religious', 'Parish church');
    for (const [i, key] of keys.entries()) {
      const marker = { allow: false, rung: i };
      const got = institutionToggleFor({ [key]: marker }, ['town'], 'Religious', 'Parish church');
      expect(got, `rung ${i} (${key}) is unreachable`).toBe(marker);
    }
  });

  test('the FIRST truthy key wins, and a falsy one falls through', () => {
    const specific = { allow: false };
    const sentinel = { allow: true };
    expect(institutionToggleFor({
      'town::Religious::Parish church': specific,
      'all::Religious::Parish church': sentinel,
    }, ['town'], 'Religious', 'Parish church')).toBe(specific);

    // The inlined `||` chains fell through a falsy value; a legacy caller storing `false`
    // or `''` depends on that, so the reader must not switch to `??`.
    expect(institutionToggleFor({
      'town::Religious::Parish church': false,
      'town_Religious_Parish church': '',
      'all::Religious::Parish church': sentinel,
    }, ['town'], 'Religious', 'Parish church')).toBe(sentinel);
  });

  test('absent means undefined — each caller keeps its own default', () => {
    expect(institutionToggleFor({}, ['town'], 'Religious', 'Parish church')).toBeUndefined();
    expect(institutionToggleFor(null, ['town'], 'Religious', 'Parish church')).toBeUndefined();
    expect(institutionToggleFor(undefined, [], 'Religious', 'Parish church')).toBeUndefined();
  });

  test('PLANTED DIVERGENCE: a ladder missing a rung disagrees with the real one', () => {
    // The exact defect the 23 hand-spellings invited — one site updated, another not. Build
    // the ladder with the legacy `_` rungs dropped and show it reads a DIFFERENT answer on a
    // map that only carries the legacy spelling.
    const map = { 'town_Religious_Parish church': { allow: false } };

    const truncated = (toggles, tiers, category, name) => {
      for (const tier of [...tiers, 'all']) {
        const hit = toggles[`${tier}::${category}::${name}`];
        if (hit) return hit;
      }
      return undefined;
    };

    expect(institutionToggleFor(map, ['town'], 'Religious', 'Parish church'))
      .toEqual({ allow: false });
    expect(truncated(map, ['town'], 'Religious', 'Parish church'),
      'the truncated ladder must MISS the legacy key — otherwise this control proves nothing')
      .toBeUndefined();
  });
});

describe('the habitat is gone', () => {
  test('no consumer spells the ladder by hand any more', () => {
    // The fingerprint of a hand-spelled rung: a template key with the `::category::name`
    // or `_category_name` shape read straight off the toggles map.
    const INLINE = /institutionToggles\[`\$\{[^`]*\}(::|_)/;
    const offenders = CONSUMERS.filter((rel) => INLINE.test(read(rel)));
    expect(offenders, 'a hand-spelled institution-toggle key is back; call institutionToggleFor')
      .toEqual([]);
  });

  test('every consumer reads the ONE reader', () => {
    for (const rel of CONSUMERS) {
      expect(read(rel), `${rel} no longer imports the shared reader`)
        .toMatch(/institutionToggleFor/);
    }
  });

  test('the detector is not vacuous — it convicts the body it was built from', () => {
    const INLINE = /institutionToggles\[`\$\{[^`]*\}(::|_)/;
    expect(INLINE.test('const t = institutionToggles[`${tier}::${cat}::${name}`]')).toBe(true);
    expect(INLINE.test('const t = institutionToggles[`${tier}_${cat}_${name}`]')).toBe(true);
    // …and stays silent on the one legacy tail that is deliberately kept at its call site.
    expect(INLINE.test('|| institutionToggles[name];')).toBe(false);
  });
});
