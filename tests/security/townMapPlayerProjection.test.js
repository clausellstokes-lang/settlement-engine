/**
 * The 2D fallback shares the 3D program's audience law: player artifacts derive
 * from an authorized projection, and non-open hazards never enter the draw
 * model. These pins are deliberately structural rather than SVG-pixel tests.
 */

import { describe, expect, it } from 'vitest';

import {
  projectMapEditsForAudience,
  projectSettlementForTownMapAudience,
  projectTownMapModelForAudience,
} from '../../src/domain/townMap/audienceProjection.js';

describe('town-map player projection', () => {
  it('starts from the public-safe settlement and reintroduces only player annotations', () => {
    const sentinel = 'NEVER_REACH_A_PLAYER_MAP';
    const source = {
      id: 'settlement.player-wall',
      name: 'Wall Test',
      tier: 'town',
      population: 1200,
      config: { terrainType: 'plains' },
      dmNotes: sentinel,
      institutions: [{ id: 'public-hall', name: 'Public Hall', secret: sentinel }],
      mapEdits: {
        annotations: [
          { x: 10, y: 20, label: sentinel, audience: 'dm' },
          { x: 30, y: 40, label: 'Known shrine', audience: 'player' },
        ],
      },
    };

    const projected = projectSettlementForTownMapAudience(source, 'player');
    expect(JSON.stringify(projected)).not.toContain(sentinel);
    expect(projected.mapEdits.annotations).toEqual([
      { x: 30, y: 40, label: 'Known shrine', audience: 'player' },
    ]);
    expect(source.dmNotes).toBe(sentinel); // input is never mutated
  });

  it('drops hidden, rumored, and unknown hazards at the model wall', () => {
    const base = {
      townMapGeometryVersion: 1,
      layoutLawVersion: 1,
      overlayVersion: 1,
      meta: {},
      frame: { water: null, roads: [] },
      skeleton: { anchor: { x: 0, y: 0, kind: 'none' }, pattern: '', streets: [] },
      districts: [],
      buildings: [],
      fortifications: null,
      overlays: {
        hazards: [
          { id: 'open', visibility: 'open' },
          { id: 'public', visibility: 'public' },
          { id: 'rumor', visibility: 'rumored' },
          { id: 'hidden', visibility: 'hidden' },
          { id: 'unknown' },
        ],
        conditions: [{ id: 'visible-condition' }],
      },
      provenance: { hidden: [{ sourceRef: 'private cause' }] },
      latentAdvantages: [{ declinedBy: 'secret choice' }],
      reserved: { scarHistory: null, thumbnail: null, pdfPlate: null },
    };

    const projected = projectTownMapModelForAudience(base, 'player');
    expect(projected.overlays.hazards.map((entry) => entry.id)).toEqual(['open', 'public']);
    expect(projected.overlays.conditions).toHaveLength(1);
    expect(projected.provenance).toBeUndefined();
    expect(projected.latentAdvantages).toBeUndefined();
  });

  it('normalizes a DM-only edit set back to absent', () => {
    const projected = projectMapEditsForAudience({
      annotations: [{ x: 5, y: 6, label: 'DM only', audience: 'dm' }],
    }, 'player');
    expect(projected).toBeNull();
  });
});
