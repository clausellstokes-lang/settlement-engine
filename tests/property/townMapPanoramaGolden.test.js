/**
 * townMapPanoramaGolden.test.js — THE ILLUSTRATED TOWN (IT-5): the PANORAMA golden.
 *
 * A NEW golden family (additive — no existing golden moves) that closes a real pin GAP:
 * the oblique-panorama projection (buildTownMapPanoramaDrawList / …Svg — townPanorama.js)
 * was pinned by NO committed golden, so an enrichment could have shifted its bytes silently.
 * This pins the panorama's draw output — the SAME primitive op vocabulary the exports carry —
 * across the v2 golden seed set (the largest, richest corpus) PLUS a tier-spanning v1 seed
 * subset, under EVERY pickable lens (the five re-skins + the illustrated glyph lens).
 *
 * A PER-LENS HASH MAP is recorded beside the aggregate hash. This is load-bearing for IT-5:
 * the glyph-facade + ground-dress enrichment (IT5-b) touches ONLY the `illustrated` lens
 * (gated on style.glyphSet / the dress fields, exactly like the plan view). So the FIVE base
 * re-skin lenses' per-lens hashes stay BYTE-IDENTICAL across the enrichment's declared
 * additive re-mint, and this map proves that isolation at golden strength — a diff shows
 * exactly which lens moved. A projection-transform change, a lens-palette drift, or (for the
 * illustrated row) a glyph/facade/dress change all trip THIS pin — the correct signal —
 * re-minted WITH a stated cause:
 *   UPDATE_PANORAMA_GOLDEN=1 npx vitest run tests/property/townMapPanoramaGolden.test.js
 *
 * buildTownMapPanoramaDrawList is a pure function with an internally-derived seed and no trig,
 * so the hash is stable across runs and machines — like every sibling golden.
 */
import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import { buildTownMapPanoramaDrawList, buildTownMapPanoramaSvg } from '../../src/domain/townMap/townPanorama.js';
import { TOWN_MAP_LENS_IDS, TOWN_MAP_STYLE_IDS, ILLUSTRATED_STYLE_ID } from '../../src/design/townMapStyles.js';
import { GOLDEN_CONFIGS, V2_GOLDEN_CONFIGS } from '../fixtures/townMapFixtures.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'town-panorama-golden.json');
const UPDATE = process.env.UPDATE_PANORAMA_GOLDEN === '1';

// A tier-spanning v1 subset (thorp / hamlet / town / city / metropolis / village) so the
// panorama is pinned over V1 geometry too, not only the v2 engine.
const V1_SUBSET = [0, 3, 6, 9, 12, 15].map((i) => GOLDEN_CONFIGS[i]);

const hashOf = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

/** The per-config panorama draw lists for ONE lens: v2 corpus + v1 subset. */
function lensOutputs(lens) {
  const rows = [];
  for (const { settlement, mapEdits } of V2_GOLDEN_CONFIGS) {
    rows.push(buildTownMapPanoramaDrawList(buildTownMapModel(settlement, mapEdits), lens));
  }
  for (const { settlement } of V1_SUBSET) {
    rows.push(buildTownMapPanoramaDrawList(buildTownMapModel(settlement), lens));
  }
  return rows;
}

/** The full record: aggregate hash + a per-lens hash/op/svg-byte map (the isolation proof). */
function panoramaRecord() {
  const perLens = {};
  const all = [];
  let totalOps = 0;
  for (const lens of TOWN_MAP_LENS_IDS) {
    const rows = lensOutputs(lens);
    all.push([lens, rows]);
    let ops = 0;
    for (const r of rows) ops += r.length;
    let svgBytes = 0;
    for (const { settlement, mapEdits } of V2_GOLDEN_CONFIGS) svgBytes += buildTownMapPanoramaSvg(buildTownMapModel(settlement, mapEdits), { style: lens }).length;
    for (const { settlement } of V1_SUBSET) svgBytes += buildTownMapPanoramaSvg(buildTownMapModel(settlement), { style: lens }).length;
    perLens[lens] = { hash: hashOf(rows), ops, svgBytes };
    totalOps += ops;
  }
  return { hash: hashOf(all), configs: V2_GOLDEN_CONFIGS.length + V1_SUBSET.length, lenses: TOWN_MAP_LENS_IDS.length, totalOps, perLens };
}

describe('GOLDEN — town-map PANORAMA (v2 corpus + v1 subset × every lens) → bytes', () => {
  it('the panorama corpus hashes to the committed manifest — with per-lens isolation', () => {
    const record = panoramaRecord();
    if (UPDATE) {
      // A nested per-lens map ⇒ the key-allowlist replacer (the flat siblings' idiom) would
      // strip the lens keys; write with deterministic insertion order (lens keys in
      // TOWN_MAP_LENS_IDS order) instead. The read-back compares fields explicitly, so file
      // key order is a tidiness choice, not a correctness one.
      mkdirSync(dirname(MANIFEST), { recursive: true });
      writeFileSync(MANIFEST, JSON.stringify(record, null, 2) + '\n');
    }
    expect(
      existsSync(MANIFEST),
      'town-panorama-golden.json missing — for an APPROVED panorama change run: UPDATE_PANORAMA_GOLDEN=1 npx vitest run tests/property/townMapPanoramaGolden.test.js',
    ).toBe(true);
    const pinned = JSON.parse(readFileSync(MANIFEST, 'utf-8'));
    expect(record.hash).toBe(pinned.hash);
    expect(record.configs).toBe(pinned.configs);
    expect(record.lenses).toBe(pinned.lenses);
    expect(record.totalOps).toBe(pinned.totalOps);
    // per-lens isolation: EVERY lens hash + op count matches its pin (a moved lens names itself).
    for (const lens of TOWN_MAP_LENS_IDS) {
      expect(record.perLens[lens].hash, `panorama lens ${lens} moved`).toBe(pinned.perLens[lens].hash);
      expect(record.perLens[lens].ops, `panorama lens ${lens} op count moved`).toBe(pinned.perLens[lens].ops);
      expect(record.perLens[lens].svgBytes, `panorama lens ${lens} svg bytes moved`).toBe(pinned.perLens[lens].svgBytes);
    }
  });

  it('is reproducible — a second build hashes identically', () => {
    expect(panoramaRecord().hash).toBe(panoramaRecord().hash);
  });

  it('anti-vacuity — every lens/seed draws a non-empty, all-typed panorama op list', () => {
    const KNOWN = new Set(['poly', 'line', 'circle', 'rect', 'path']);
    for (const lens of TOWN_MAP_LENS_IDS) {
      for (const ops of lensOutputs(lens)) {
        expect(ops.length).toBeGreaterThan(0);
        for (const o of ops) expect(KNOWN.has(o.t)).toBe(true);
      }
    }
  });

  it('the five re-skin lenses re-pose ONE geometry — identical op count, distinct bytes', () => {
    // Same projection, different skin: the base re-skins share the panorama op count but
    // paint distinct bytes (the lens-composition law). The illustrated lens RE-SHAPES
    // (facades/dress) so it is excluded from the equal-count invariant.
    const counts = TOWN_MAP_STYLE_IDS.map((l) => panoramaRecord().perLens[l].ops);
    expect(new Set(counts).size).toBe(1);
    const record = panoramaRecord();
    expect(record.perLens.parchment.hash).not.toBe(record.perLens.darkFantasy.hash);
    expect(record.perLens.watercolor.hash).not.toBe(record.perLens.vtt.hash);
  });

  it('the illustrated panorama stays under a generous per-map op ceiling (no explosion)', () => {
    // The facade + dress enrichment multiplies the plain-prism op count; this guard catches
    // the explosion CLASS on the largest seeds (the metropolis configs) — generous, not tight.
    const PANORAMA_OP_CEILING = 1200;
    let worst = 0;
    let worstLabel = '';
    for (const { spec, settlement, mapEdits } of V2_GOLDEN_CONFIGS) {
      const n = buildTownMapPanoramaDrawList(buildTownMapModel(settlement, mapEdits), ILLUSTRATED_STYLE_ID).length;
      if (n > worst) { worst = n; worstLabel = `${spec.tier}/${spec.terrain}`; }
    }
    expect(worst, `${worstLabel} panorama emitted ${worst} illustrated ops (> ${PANORAMA_OP_CEILING})`).toBeLessThanOrEqual(PANORAMA_OP_CEILING);
    expect(worst).toBeGreaterThan(0);
  });
});
