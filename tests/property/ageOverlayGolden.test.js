/**
 * ageOverlayGolden.test.js — VISION V-15, the (model, portrait) → AGE ops golden.
 *
 * The age overlay is a pure function of (model, age style, portrait), so a fixed
 * fixture hashes to a stable, machine-independent digest. A derivation change (mark
 * counts, decay, ordering) trips this — the correct signal — and is re-minted WITH
 * a stated cause:
 *   UPDATE_AGE_GOLDEN=1 npx vitest run tests/property/ageOverlayGolden.test.js
 *
 * NOTE: this golden is a SEPARATE manifest; the town-map v1/v2/style goldens are
 * UNTOUCHED (V-15 never enters buildTownMapDrawList) — proven in ageOverlay.test.js
 * (the dormancy-wall clause) and by those goldens staying green.
 */
import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { ageOverlayOps } from '../../src/domain/townMap/ageOverlay.js';
import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import { GOLDEN_CONFIGS } from '../fixtures/townMapFixtures.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'age-overlay-golden.json');
const UPDATE = process.env.UPDATE_AGE_GOLDEN === '1';
const AGE_STYLE = { ink: '#4a4030', opacity: { age: 0.5 }, stroke: { age: 1.4 } };

/** A fixed portrait keyed to each fixture model's own district classes. */
function opsFor(config) {
  const model = buildTownMapModel(config.settlement);
  /** @type {Record<string, number>} */
  const growth = {};
  for (const d of model.districts) growth[d.category] = 0.8;
  const rebirthClasses = model.districts.length ? [model.districts[0].category] : [];
  const portrait = { growth, scars: [{ kind: 'burn_lots', week: 0, displaySeverity: 0.8 }], rebirthClasses, asOfWeek: 400 };
  return ageOverlayOps(model, AGE_STYLE, portrait);
}

const hashOf = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex');

describe('GOLDEN — V-15 age overlay (model, portrait) → bytes', () => {
  it('the corpus hashes to the committed manifest', () => {
    const outputs = GOLDEN_CONFIGS.map((c) => opsFor(c));
    const record = { hash: hashOf(outputs), configs: outputs.length, totalOps: outputs.reduce((n, o) => n + o.length, 0) };
    if (UPDATE) {
      mkdirSync(dirname(MANIFEST), { recursive: true });
      writeFileSync(MANIFEST, JSON.stringify(record, null, 2) + '\n');
    }
    expect(
      existsSync(MANIFEST),
      'age-overlay-golden.json missing — for an APPROVED derivation change run: UPDATE_AGE_GOLDEN=1 npx vitest run tests/property/ageOverlayGolden.test.js',
    ).toBe(true);
    const pinned = JSON.parse(readFileSync(MANIFEST, 'utf-8'));
    expect(record.hash).toBe(pinned.hash);
    expect(record.configs).toBe(pinned.configs);
    expect(record.totalOps).toBe(pinned.totalOps);
  });

  it('anti-vacuity — the corpus draws a non-trivial op population', () => {
    const total = GOLDEN_CONFIGS.reduce((n, c) => n + opsFor(c).length, 0);
    expect(total).toBeGreaterThan(0);
  });

  it('is reproducible — a second build hashes identically', () => {
    const a = GOLDEN_CONFIGS.map((c) => opsFor(c));
    const b = GOLDEN_CONFIGS.map((c) => opsFor(c));
    expect(hashOf(a)).toBe(hashOf(b));
  });
});
