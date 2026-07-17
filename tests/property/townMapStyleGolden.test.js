/**
 * townMapStyleGolden.test.js — MAP STYLES: the (seed, style) → bytes golden.
 *
 * The style-layer re-mint of the determinism pin. The ~18-config synthetic corpus
 * (townMapFixtures.GOLDEN_CONFIGS) × the four base lenses ⇒ a sha256-pinned set of
 * per-(config, style) DRAW LISTS. A palette shift, a weight/opacity change, a
 * furniture tweak (the craft pass), or a geometry drift trips this. Because the
 * draw projection is a pure function of (model, style) with no trig, the hash is
 * stable across machines and runs.
 *
 * This golden is minted ONCE, at the CRAFTED output (post craft-pass), so it never
 * needs an in-wave regen. A future DELIBERATE style change (a new craft tweak, a
 * recolor) reds it — the correct signal — and is re-minted WITH a stated cause:
 *   UPDATE_STYLE_GOLDEN=1 npx vitest run tests/property/townMapStyleGolden.test.js
 */
import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import { buildTownMapDrawList } from '../../src/domain/townMap/townMapDraw.js';
import { TOWN_MAP_STYLE_IDS } from '../../src/design/townMapStyles.js';
import { GOLDEN_CONFIGS } from '../fixtures/townMapFixtures.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'town-map-style-golden.json');
const UPDATE = process.env.UPDATE_STYLE_GOLDEN === '1';

/** The per-(config, style) draw lists (the hashed payload). */
function styleOutputs() {
  return GOLDEN_CONFIGS.map(({ settlement }) => {
    const model = buildTownMapModel(settlement);
    const perStyle = {};
    for (const id of TOWN_MAP_STYLE_IDS) perStyle[id] = buildTownMapDrawList(model, id);
    return perStyle;
  });
}

const hashOf = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

/** Legible meta beside the hash — total op counts per lens (a shape-drift guard). */
function metaOf(outputs) {
  const opsByStyle = {};
  for (const id of TOWN_MAP_STYLE_IDS) opsByStyle[id] = 0;
  for (const perStyle of outputs) {
    for (const id of TOWN_MAP_STYLE_IDS) opsByStyle[id] += perStyle[id].length;
  }
  return { configs: outputs.length, styles: TOWN_MAP_STYLE_IDS.length, opsByStyle, bytes: JSON.stringify(outputs).length };
}

describe('GOLDEN — town-map STYLE (seed, style) → bytes', () => {
  it('the corpus × four lenses hashes to the committed manifest', () => {
    const outputs = styleOutputs();
    const hash = hashOf(outputs);
    const meta = metaOf(outputs);
    // Fixed key order for a tidy manifest diff; a plain (non-allowlist) replacer so
    // the NESTED opsByStyle survives serialization.
    const record = { hash, bytes: meta.bytes, configs: meta.configs, styles: meta.styles, opsByStyle: meta.opsByStyle };
    if (UPDATE) {
      mkdirSync(dirname(MANIFEST), { recursive: true });
      writeFileSync(MANIFEST, JSON.stringify(record, null, 2) + '\n');
    }
    expect(
      existsSync(MANIFEST),
      'town-map-style-golden.json missing — for an APPROVED style change run: UPDATE_STYLE_GOLDEN=1 npx vitest run tests/property/townMapStyleGolden.test.js',
    ).toBe(true);
    const pinned = JSON.parse(readFileSync(MANIFEST, 'utf-8'));
    expect(hash).toBe(pinned.hash);
    expect(meta.configs).toBe(pinned.configs);
    expect(meta.styles).toBe(pinned.styles);
    expect(meta.opsByStyle).toEqual(pinned.opsByStyle);
  });

  it('is reproducible — a second build hashes identically', () => {
    expect(hashOf(styleOutputs())).toBe(hashOf(styleOutputs()));
  });

  it('anti-vacuity — every lens draws a non-trivial op population', () => {
    const meta = metaOf(styleOutputs());
    for (const id of TOWN_MAP_STYLE_IDS) expect(meta.opsByStyle[id]).toBeGreaterThan(100);
    // VTT carries the most ops (its grid), the fantasy lenses the least.
    expect(meta.opsByStyle.vtt).toBeGreaterThan(meta.opsByStyle.parchment);
  });
});
