/**
 * worldMapTourSteps.test.js — V-25f WORLDMAPTOOLBAR TEACHING TRANCHE, the anti-drift pin.
 *
 * The guided tour spotlights controls by their data-tour anchor; a step whose anchor no longer
 * exists silently degrades to a centered card (how the "Wizard News" step went stale). This pin
 * closes that habitat: EVERY tour step's `sel` must match a real data-tour anchor rendered by a
 * map component, so the tour cannot drift from the toolbar again. Plus the specific regression
 * guard (the retitled Realm Inspector step) and copy-shape floors.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { WORLD_MAP_TOUR_STEPS } from '../../src/components/map/WorldMapTourSteps.js';

// Collect every data-tour anchor rendered anywhere under src/components/map.
function collectAnchors() {
  const dir = resolve(process.cwd(), 'src', 'components', 'map');
  const anchors = new Set();
  const re = /data-tour="([a-z-]+)"/g;
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.jsx') && !f.endsWith('.js')) continue;
    const src = readFileSync(join(dir, f), 'utf-8');
    let m;
    while ((m = re.exec(src)) !== null) anchors.add(m[1]);
  }
  return anchors;
}

describe('V-25f — the world-map tour matches the real toolbar', () => {
  const anchors = collectAnchors();

  it('every tour step spotlights a control that actually exists (no orphan steps)', () => {
    const orphans = WORLD_MAP_TOUR_STEPS.filter((s) => !anchors.has(s.sel)).map((s) => s.sel);
    expect(orphans, `tour steps whose data-tour anchor no longer exists: ${orphans.join(', ')}`).toEqual([]);
  });

  it('the History and control-reference controls are now taught (the owed tranche)', () => {
    const sels = WORLD_MAP_TOUR_STEPS.map((s) => s.sel);
    expect(sels).toContain('history');
    expect(sels).toContain('controls');
    expect(sels).toContain('inspector');
  });

  it('the stale "Wizard News" step is gone — the inspector step names the inspector', () => {
    for (const s of WORLD_MAP_TOUR_STEPS) {
      expect(/wizard news/i.test(`${s.title} ${s.body}`), `a step still says "Wizard News": ${s.sel}`).toBe(false);
    }
    const inspector = WORLD_MAP_TOUR_STEPS.find((s) => s.sel === 'inspector');
    expect(inspector.title).toMatch(/inspector/i);
  });

  it('every step carries non-empty teaching copy and a unique anchor', () => {
    const seen = new Set();
    for (const s of WORLD_MAP_TOUR_STEPS) {
      expect(typeof s.title === 'string' && s.title.length > 0, `empty title: ${s.sel}`).toBe(true);
      expect(typeof s.body === 'string' && s.body.length > 10, `thin body: ${s.sel}`).toBe(true);
      expect(seen.has(s.sel), `duplicate step anchor: ${s.sel}`).toBe(false);
      seen.add(s.sel);
    }
  });
});
