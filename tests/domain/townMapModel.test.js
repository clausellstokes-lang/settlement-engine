/**
 * townMapModel.test.js — town-map model unit pins (design §7 parity/lifecycle).
 *
 * Purity source-scan, determinism, TOTAL assignment (every institution placed
 * exactly once — incl. the quarter-less hamlet-cluster floor), anchor stability
 * across roster drift, mapEdits dormancy + pin nudge + dangling-drop, and
 * no-input-mutation.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import { anchorForInstitution } from '../../src/domain/townMap/anchors.js';
import { HAMLET_CLUSTER_ID } from '../../src/domain/townMap/institutionAssignment.js';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = resolve(HERE, '../../src/domain/townMap');

const clone = (v) => JSON.parse(JSON.stringify(v));
const stable = (v) => JSON.stringify(v);

describe('town-map model — purity', () => {
  it('the domain source carries no wall-clock / entropy / locale reads', () => {
    const files = readdirSync(SRC_DIR).filter((f) => f.endsWith('.js'));
    expect(files.length).toBeGreaterThan(0);
    for (const f of files) {
      const text = readFileSync(join(SRC_DIR, f), 'utf-8');
      // Match the actual CALL forms (banned by the determinism guard), not the
      // word appearing in a docstring that describes the ban.
      expect(/Math\.random\s*\(/.test(text), `${f} calls Math.random()`).toBe(false);
      expect(/Date\.now\s*\(/.test(text), `${f} calls Date.now()`).toBe(false);
      expect(/new\s+Date\s*\(/.test(text), `${f} uses new Date()`).toBe(false);
      expect(/\.localeCompare\s*\(/.test(text), `${f} calls localeCompare()`).toBe(false);
    }
  });
});

describe('town-map model — determinism', () => {
  it('the same settlement builds byte-identically twice', () => {
    const s = makeTownFixture({ tier: 'city', terrain: 'riverside', walls: true, water: true, seed: 'det-1' });
    expect(stable(buildTownMapModel(s))).toBe(stable(buildTownMapModel(s)));
  });
});

describe('town-map model — total assignment', () => {
  it('every institution is placed exactly once (no drop, no dup)', () => {
    const s = makeTownFixture({ tier: 'city', terrain: 'plains', walls: true, water: false, seed: 'total-1' });
    const model = buildTownMapModel(s);
    const expected = s.institutions.map(anchorForInstitution).sort();
    const placed = model.buildings.map((b) => b.anchorKey).sort();
    expect(placed).toEqual(expected);
    expect(model.buildings.length).toBe(s.institutions.length);
    // no duplicate anchorKeys
    expect(new Set(placed).size).toBe(placed.length);
  });

  it('colliding fallback anchors keep each institution in its OWN assigned district (no Map collapse)', () => {
    // Two institutions with NEITHER catalogId NOR localUid whose names slug to the
    // SAME fallback anchor ('name:sable-hand'). A previous version keyed the district
    // lookup by anchorKey through a Map, which collapsed the collision (last-wins) and
    // rendered BOTH buildings in one district — silently dropping the assigner's decision
    // for the other. The model now reads the assigner's placements POSITIONALLY, so each
    // institution keeps its own category-affine district.
    const s = makeTownFixture({
      tier: 'city', terrain: 'plains', walls: false, water: false, seed: 'collide-1',
      quarters: [
        { name: 'Garrison Quarter', location: 'north gate', desc: 'barracks and watch', landmarks: ['Barracks'] },
        { name: 'Temple Ward', location: 'central', desc: 'shrines and cloisters', landmarks: ['Great Cathedral'] },
      ],
      institutions: [
        { name: 'Sable Hand!', priorityCategory: 'military' }, // → name:sable-hand
        { name: 'Sable Hand', priorityCategory: 'religion' },  // → name:sable-hand (collision)
      ],
    });
    const model = buildTownMapModel(s);
    // both placed (count invariant holds even under collision)
    expect(model.buildings.length).toBe(2);
    // the two colliding-anchor buildings are NOT collapsed into a single district
    const districtIds = model.buildings.map((b) => b.districtId).sort();
    expect(new Set(districtIds).size).toBe(2);
    // and each landed in its category-affine district (military→garrison, religion→temple)
    const military = model.districts.find((d) => d.category === 'military');
    const religious = model.districts.find((d) => d.category === 'religious');
    expect(military && religious).toBeTruthy();
    expect(districtIds).toEqual([military.id, religious.id].sort());
    // the duplicate anchorKey is inherent to two truly-anchorless same-slug institutions
    // (real institutions carry catalogId/localUid — uniqueness is pinned above).
    expect(model.buildings.every((b) => b.anchorKey === 'name:sable-hand')).toBe(true);
  });

  it('the quarter-less floor still places every institution in the hamlet-cluster', () => {
    const s = makeTownFixture({ tier: 'hamlet', terrain: 'hills', walls: false, water: false, seed: 'floor-1', quarters: [] });
    const model = buildTownMapModel(s);
    expect(model.meta.hamletCluster).toBe(true);
    expect(model.meta.districtCount).toBe(1);
    expect(model.districts[0].id).toBe(HAMLET_CLUSTER_ID);
    expect(model.districts[0].synthetic).toBe(true);
    expect(model.buildings.length).toBe(s.institutions.length);
    for (const b of model.buildings) expect(b.districtId).toBe(HAMLET_CLUSTER_ID);
  });
});

describe('town-map model — anchor stability', () => {
  it('removing one institution leaves the others’ anchorKeys unchanged', () => {
    const s = makeTownFixture({ tier: 'city', terrain: 'hills', walls: true, water: false, seed: 'stab-1' });
    const base = buildTownMapModel(s);
    const baseAnchors = new Set(base.buildings.map((b) => b.anchorKey));

    const removed = clone(s);
    const gone = anchorForInstitution(removed.institutions[3]);
    removed.institutions.splice(3, 1);
    const after = buildTownMapModel(removed);
    const afterAnchors = new Set(after.buildings.map((b) => b.anchorKey));

    expect(afterAnchors.has(gone)).toBe(false);
    for (const a of afterAnchors) expect(baseAnchors.has(a)).toBe(true);
    expect(afterAnchors.size).toBe(baseAnchors.size - 1);
  });

  it('adding one institution leaves the others’ anchorKeys unchanged', () => {
    const s = makeTownFixture({ tier: 'town', terrain: 'forest', walls: false, water: false, seed: 'stab-2' });
    const base = buildTownMapModel(s);
    const baseAnchors = new Set(base.buildings.map((b) => b.anchorKey));

    const added = clone(s);
    added.institutions.push({ name: 'A Brand New Order', priorityCategory: 'noble', localUid: 'uid-new-1' });
    const after = buildTownMapModel(added);
    const afterAnchors = new Set(after.buildings.map((b) => b.anchorKey));

    for (const a of baseAnchors) expect(afterAnchors.has(a)).toBe(true);
    expect(afterAnchors.size).toBe(baseAnchors.size + 1);
  });
});

describe('town-map model — mapEdits dormancy + application', () => {
  const s = makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'edit-1' });

  it('absent ⇒ empty ⇒ layoutVariant 0 are byte-identical (dormancy law)', () => {
    const a = stable(buildTownMapModel(s, null));
    const b = stable(buildTownMapModel(s, {}));
    const c = stable(buildTownMapModel(s, { layoutVariant: 0 }));
    expect(a).toBe(b);
    expect(b).toBe(c);
  });

  it('a positive layoutVariant produces a different but deterministic arrangement', () => {
    const base = stable(buildTownMapModel(s, null));
    const v2a = stable(buildTownMapModel(s, { layoutVariant: 2 }));
    const v2b = stable(buildTownMapModel(s, { layoutVariant: 2 }));
    expect(v2a).not.toBe(base);
    expect(v2a).toBe(v2b);
    expect(buildTownMapModel(s, { layoutVariant: 2 }).meta.layoutVariant).toBe(2);
  });

  it('a pin with a matching anchor nudges exactly that element', () => {
    const base = buildTownMapModel(s, null);
    const target = base.buildings[2].anchorKey;
    const dx = 20;
    const dy = -15;
    const edited = buildTownMapModel(s, { pins: [{ anchor: target, dx, dy }] });

    for (let i = 0; i < base.buildings.length; i++) {
      const b0 = base.buildings[i];
      const b1 = edited.buildings.find((x) => x.anchorKey === b0.anchorKey);
      expect(b1).toBeTruthy();
      if (b0.anchorKey === target) {
        expect(b1.position.x).toBe(Math.max(0, Math.min(1000, b0.position.x + dx)));
        expect(b1.position.y).toBe(Math.max(0, Math.min(1000, b0.position.y + dy)));
      } else {
        expect(stable(b1)).toBe(stable(b0));
      }
    }
    // everything else is untouched
    expect(stable(edited.districts)).toBe(stable(base.districts));
    expect(stable(edited.overlays)).toBe(stable(base.overlays));
  });

  it('a dangling-anchor pin is dropped (no throw, no phantom)', () => {
    const base = stable(buildTownMapModel(s, null));
    let edited;
    expect(() => { edited = buildTownMapModel(s, { pins: [{ anchor: 'name:no-such-anchor-zzz', dx: 40, dy: 40 }] }); }).not.toThrow();
    expect(stable(edited)).toBe(base);
  });
});

describe('town-map model — no input mutation', () => {
  it('leaves the settlement and mapEdits objects unchanged', () => {
    const s = makeTownFixture({ tier: 'metropolis', terrain: 'plains', walls: true, water: false, seed: 'nomut-1' });
    const sBefore = clone(s);
    const edits = { layoutVariant: 3, pins: [{ anchor: 'name:whatever', dx: 5, dy: 5 }] };
    const editsBefore = clone(edits);
    buildTownMapModel(s, edits);
    expect(s).toEqual(sBefore);
    expect(edits).toEqual(editsBefore);
  });
});
