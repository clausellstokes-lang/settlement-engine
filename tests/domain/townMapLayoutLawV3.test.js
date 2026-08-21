/**
 * tests/domain/townMapLayoutLawV3.test.js — MF-0, THE LAYOUT-LAW v3 AXIS.
 *
 * ⛔ THE ARM THAT REDS AT BASE is "the lifecycle walk". `readLayoutLawVersion` shipped as a
 * hardcoded `=== 2`, and `withLayoutLawVersion` carried the SAME literal on the opt-in
 * redraw path — so a v3 blob was storable, unrenderable and silently discarded at
 * normalize. It is invisible to every golden because goldens hand `mapEdits` straight to
 * `buildTownMapModel` and never round-trip the normalizer: the write survives the RENDER
 * path and ghosts the PERSIST path. This suite walks the WHOLE lifecycle instead of the
 * one path the bug report would have named.
 */
import { describe, it, expect } from 'vitest';
import {
  LAYOUT_LAW_VERSIONS, DEFAULT_LAYOUT_LAW_VERSION, NEW_SETTLEMENT_LAYOUT_LAW_VERSION,
  isLayoutLawVersion, readLayoutLawVersion, normalizeMapEdits, withLayoutLawVersion, readMapEdits,
} from '../../src/domain/townMap/mapEdits.js';
import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';

describe('layout law v3 — the fabric axis', () => {
  it('THE LIFECYCLE WALK: v3 survives create -> read -> normalize -> persist -> regen', () => {
    const created = withLayoutLawVersion(null, 3);
    expect(created).toEqual({ layoutLawVersion: 3 });
    expect(readLayoutLawVersion(created)).toBe(3);
    const normalized = normalizeMapEdits(created);
    expect(normalized).toEqual({ layoutLawVersion: 3 });
    const persisted = JSON.parse(JSON.stringify({ mapEdits: normalized }));
    expect(readLayoutLawVersion(readMapEdits(persisted))).toBe(3);
    const model = buildTownMapModel(makeTownFixture(), persisted.mapEdits);
    expect(model).toBeTruthy();
  });

  it('the version vocabulary is a MEMBERSHIP TEST, not a literal', () => {
    expect([...LAYOUT_LAW_VERSIONS]).toEqual([1, 2, 3]);
    for (const v of LAYOUT_LAW_VERSIONS) expect(isLayoutLawVersion(v)).toBe(true);
  });

  it('UNKNOWN COERCION is fail-closed in both directions', () => {
    for (const bad of [4, '3', null, 3.5, Number.NaN, true, undefined]) {
      expect(isLayoutLawVersion(bad)).toBe(false);
      expect(readLayoutLawVersion({ layoutLawVersion: bad })).toBe(DEFAULT_LAYOUT_LAW_VERSION);
      // anchored: the fail-closed direction — an unknown version is DROPPED at normalize
      expect(normalizeMapEdits({ layoutLawVersion: bad })).toBeNull();
      expect(withLayoutLawVersion(null, bad)).toBeNull();
    }
  });

  it('v1 DORMANCY: absent, v1 and a lens-only edit render identical bytes', () => {
    const s = makeTownFixture();
    const bare = JSON.stringify(buildTownMapModel(s));
    expect(JSON.stringify(buildTownMapModel(s, null))).toBe(bare);
    expect(JSON.stringify(buildTownMapModel(s, { layoutLawVersion: 1 }))).toBe(bare);
    expect(JSON.stringify(buildTownMapModel(s, { styleLens: 'vtt' }))).toBe(bare);
  });

  it('v2 DORMANCY: the v2 path is untouched by the v3 branch', () => {
    const s = makeTownFixture();
    const a = JSON.stringify(buildTownMapModel(s, { layoutLawVersion: 2 }));
    const b = JSON.stringify(buildTownMapModel(s, { layoutLawVersion: 2 }));
    expect(a).toBe(b);
    expect(a).not.toBe(JSON.stringify(buildTownMapModel(s, null)));
  });

  it('THE MINT IS UNMOVED — the v3 default flip is a separate, §109-gated act', () => {
    expect(NEW_SETTLEMENT_LAYOUT_LAW_VERSION).toBe(2);
  });
});
