/**
 * illustratedTownGolden.test.js — THE ILLUSTRATED TOWN (IT-1): the illustrated-lens golden.
 *
 * A NEW golden family (additive — no existing golden moves). It pins the illustrated
 * lens's draw output — the glyph buildings + the full illustrated map — across the v2
 * golden seed set (the largest, richest corpus) PLUS a tier-spanning v1 seed subset (so
 * the lens is pinned over BOTH geometry engines). A glyph-library edit, a compiler change,
 * a glyphAssign re-mapping, an LOD change, or an illustrated-lens tuning all trip THIS pin
 * — the correct signal — and are re-minted WITH a stated cause:
 *   UPDATE_ILLUSTRATED_GOLDEN=1 npx vitest run tests/property/illustratedTownGolden.test.js
 *
 * Because buildTownMapDrawList(model, 'illustrated') is a pure function with an internally-
 * derived seed and no trig (glyphAssign uses createPRNG; the compiler uses only round +
 * arithmetic), the hash is stable across runs and machines — like every sibling golden.
 */
import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import { buildTownMapDrawList, buildTownMapSvg } from '../../src/domain/townMap/townMapDraw.js';
import { GOLDEN_CONFIGS, V2_GOLDEN_CONFIGS } from '../fixtures/townMapFixtures.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'illustrated-town-golden.json');
const SEASON_MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'illustrated-town-season-golden.json');
const UPDATE = process.env.UPDATE_ILLUSTRATED_GOLDEN === '1';

// IT-3 seasonal variants — the season/severity contexts pinned over the same seed corpus. These
// are ADDITIVE (a NEW fixture); the seasonless base above is NEVER re-minted, so its byte-identity
// IS the dormancy proof at golden strength. Each variant is an explicit dress context (not the
// resolver) so this pins the season DRESS output directly.
const SEASON_VARIANTS = [
  { key: 'winter', dress: { season: 'winter' } },
  { key: 'winter-hard', dress: { season: 'winter', severity: 'hard_winter' } },
  { key: 'autumn', dress: { season: 'autumn' } },
  { key: 'summer-drought', dress: { season: 'summer', severity: 'drought' } },
];

// A tier-spanning v1 subset (thorp / hamlet / town / city / metropolis / village) so the
// illustrated lens is pinned over V1 geometry too, not only the v2 engine.
const V1_SUBSET = [0, 3, 6, 9, 12, 15].map((i) => GOLDEN_CONFIGS[i]);

/** The per-config illustrated draw lists (the hashed payload): v2 corpus + v1 subset. */
function illustratedOutputs() {
  const rows = [];
  for (const { settlement, mapEdits } of V2_GOLDEN_CONFIGS) {
    rows.push(buildTownMapDrawList(buildTownMapModel(settlement, mapEdits), 'illustrated'));
  }
  for (const { settlement } of V1_SUBSET) {
    rows.push(buildTownMapDrawList(buildTownMapModel(settlement), 'illustrated'));
  }
  return rows;
}

const hashOf = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

/** Legible meta beside the hash. */
function metaOf(outputs) {
  let totalOps = 0;
  for (const ops of outputs) totalOps += ops.length;
  // the rendered SVG byte total (the "illustrated SVG bytes" the exports carry)
  let svgBytes = 0;
  for (const { settlement, mapEdits } of V2_GOLDEN_CONFIGS) svgBytes += buildTownMapSvg(buildTownMapModel(settlement, mapEdits), { style: 'illustrated' }).length;
  for (const { settlement } of V1_SUBSET) svgBytes += buildTownMapSvg(buildTownMapModel(settlement), { style: 'illustrated' }).length;
  return { configs: outputs.length, totalOps, svgBytes, bytes: JSON.stringify(outputs).length };
}

describe('GOLDEN — illustrated town (v2 corpus + v1 subset) → bytes', () => {
  it('the illustrated corpus hashes to the committed manifest', () => {
    const outputs = illustratedOutputs();
    const hash = hashOf(outputs);
    const meta = metaOf(outputs);
    const record = { hash, ...meta };
    if (UPDATE) {
      mkdirSync(dirname(MANIFEST), { recursive: true });
      writeFileSync(MANIFEST, JSON.stringify(record, Object.keys(record).sort(), 2) + '\n');
    }
    expect(
      existsSync(MANIFEST),
      'illustrated-town-golden.json missing — for an APPROVED illustrated change run: UPDATE_ILLUSTRATED_GOLDEN=1 npx vitest run tests/property/illustratedTownGolden.test.js',
    ).toBe(true);
    const pinned = JSON.parse(readFileSync(MANIFEST, 'utf-8'));
    expect(hash).toBe(pinned.hash);
    expect(meta.configs).toBe(pinned.configs);
    expect(meta.totalOps).toBe(pinned.totalOps);
    expect(meta.svgBytes).toBe(pinned.svgBytes);
  });

  it('is reproducible — a second build hashes identically', () => {
    expect(hashOf(illustratedOutputs())).toBe(hashOf(illustratedOutputs()));
  });

  it('anti-vacuity — every seed draws a non-empty, all-typed illustrated op list', () => {
    const KNOWN = new Set(['poly', 'line', 'circle', 'rect', 'path']);
    for (const ops of illustratedOutputs()) {
      expect(ops.length).toBeGreaterThan(0);
      for (const o of ops) expect(KNOWN.has(o.t)).toBe(true);
    }
  });

  it('the illustrated lens carries NO legacy 16×16 building rects (glyphs replaced them)', () => {
    for (const ops of illustratedOutputs()) {
      expect(ops.some((o) => o.t === 'rect' && o.w === 16 && o.h === 16 && o.rx === 3)).toBe(false);
    }
  });
});

/** The per-config seasonal draw lists (v2 corpus + v1 subset × the season variants). */
function seasonOutputs() {
  const rows = [];
  for (const { settlement, mapEdits } of V2_GOLDEN_CONFIGS) {
    const model = buildTownMapModel(settlement, mapEdits);
    for (const v of SEASON_VARIANTS) rows.push(buildTownMapDrawList(model, 'illustrated', v.dress));
  }
  for (const { settlement } of V1_SUBSET) {
    const model = buildTownMapModel(settlement);
    for (const v of SEASON_VARIANTS) rows.push(buildTownMapDrawList(model, 'illustrated', v.dress));
  }
  return rows;
}

describe('GOLDEN — illustrated town SEASONAL variants (additive; the base stays byte-identical)', () => {
  it('the seasonal corpus hashes to the committed manifest', () => {
    const outputs = seasonOutputs();
    const hash = hashOf(outputs);
    let totalOps = 0;
    for (const ops of outputs) totalOps += ops.length;
    const record = { hash, configs: outputs.length, totalOps, bytes: JSON.stringify(outputs).length };
    if (UPDATE) {
      mkdirSync(dirname(SEASON_MANIFEST), { recursive: true });
      writeFileSync(SEASON_MANIFEST, JSON.stringify(record, Object.keys(record).sort(), 2) + '\n');
    }
    expect(
      existsSync(SEASON_MANIFEST),
      'illustrated-town-season-golden.json missing — mint: UPDATE_ILLUSTRATED_GOLDEN=1 npx vitest run tests/property/illustratedTownGolden.test.js',
    ).toBe(true);
    const pinned = JSON.parse(readFileSync(SEASON_MANIFEST, 'utf-8'));
    expect(hash).toBe(pinned.hash);
    expect(record.configs).toBe(pinned.configs);
    expect(record.totalOps).toBe(pinned.totalOps);
  });

  it('is reproducible — a second seasonal build hashes identically', () => {
    expect(hashOf(seasonOutputs())).toBe(hashOf(seasonOutputs()));
  });

  it('every seasonal variant DIFFERS from the seasonless base (the dress actually paints)', () => {
    for (const { settlement, mapEdits } of V2_GOLDEN_CONFIGS.slice(0, 4)) {
      const model = buildTownMapModel(settlement, mapEdits);
      const base = JSON.stringify(buildTownMapDrawList(model, 'illustrated'));
      for (const v of SEASON_VARIANTS) {
        expect(JSON.stringify(buildTownMapDrawList(model, 'illustrated', v.dress)), `${v.key} == base`).not.toBe(base);
      }
    }
  });
});
