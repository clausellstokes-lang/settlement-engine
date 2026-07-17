/**
 * townMapProvenance.test.js — SM-5 (1) THE MAP EXPLAINS ITSELF.
 *
 * The pure view-time formatter over the v2 model's retained provenance +
 * latent-advantage map + response mode. Pins:
 *   • v2 district causes format into display rows (family + verbatim ref + humanised effect);
 *   • the map-level surveyor's read carries the response mode, site cause, and declined
 *     advantages;
 *   • GRACEFUL DEGRADATION — a v1 model (no provenance) yields empty rows / null story,
 *     never a broken affordance.
 */
import { describe, expect, it } from 'vitest';

import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import {
  districtProvenance, mapProvenanceStory, hasProvenance, effectLabel, familyLabel,
} from '../../src/components/townMap/provenanceModel.js';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';

const v2Model = () => buildTownMapModel(
  makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'prov-v2' }),
  { layoutLawVersion: 2 },
);
const v1Model = () => buildTownMapModel(
  makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'prov-v2' }),
  null,
);

describe('provenance — district causes (v2)', () => {
  it('formats a district’s recorded causes into display rows (verbatim ref, humanised effect)', () => {
    const m = v2Model();
    expect(hasProvenance(m)).toBe(true);
    // Every district that carries provenance yields ≥1 row; each row is well-formed.
    let seen = 0;
    for (const d of m.districts) {
      const rows = districtProvenance(m, d.id);
      for (const r of rows) {
        seen++;
        expect(typeof r.ref).toBe('string');
        expect(['region', 'resource', 'habit', '']).toContain(r.family);
        // the effect label is humanised (never the raw machine token)
        expect(r.effectLabel).not.toBe(r.effect);
        expect(r.effectLabel.length).toBeGreaterThan(0);
      }
    }
    expect(seen).toBeGreaterThan(0);
  });

  it('a regional-grain cause reads from the land, verbatim ref preserved', () => {
    const m = v2Model();
    const withGrain = m.districts
      .map((d) => districtProvenance(m, d.id))
      .flat()
      .find((r) => r.effect === 'regional-grain');
    expect(withGrain).toBeTruthy();
    expect(withGrain.family).toBe('region');
    expect(withGrain.familyLabel).toBe('The land');
    expect(withGrain.ref).toMatch(/terrain:/); // engine's own string, shown as-is
  });

  it('an unknown district id / non-district key yields []', () => {
    const m = v2Model();
    expect(districtProvenance(m, 'district.nope')).toEqual([]);
    expect(districtProvenance(m, undefined)).toEqual([]);
  });
});

describe('provenance — the map-level surveyor’s read (v2)', () => {
  it('carries the response mode, its label, a site cause, and the declined-advantage map', () => {
    const m = v2Model();
    const story = mapProvenanceStory(m);
    expect(story).toBeTruthy();
    expect(story.responseMode).toBe('fortify');
    expect(story.responseLabel).toMatch(/Fortify/);
    expect(story.site.length).toBeGreaterThan(0);          // site:water on a coastal town
    expect(story.declined.length).toBeGreaterThan(0);      // fortify declined the waterfront/market
    for (const d of story.declined) {
      expect(typeof d.ref).toBe('string');
      expect(['strong', 'moderate', 'slight']).toContain(d.band); // banded, never a false-precision number
    }
  });
});

describe('provenance — graceful degradation (v1 has none)', () => {
  it('a v1 model yields no rows, no story, no affordance', () => {
    const m = v1Model();
    expect(m.layoutLawVersion).toBe(1);
    expect(hasProvenance(m)).toBe(false);
    for (const d of m.districts) expect(districtProvenance(m, d.id)).toEqual([]);
    expect(mapProvenanceStory(m)).toBeNull();
  });

  it('null / garbage inputs never throw', () => {
    expect(districtProvenance(null, 'x')).toEqual([]);
    expect(districtProvenance({}, 'x')).toEqual([]);
    expect(mapProvenanceStory(null)).toBeNull();
    expect(mapProvenanceStory({})).toBeNull();
    expect(hasProvenance(null)).toBe(false);
    expect(effectLabel('no-such-effect')).toBe('shaped by');
    expect(familyLabel('no-such-family')).toBe('A cause');
  });
});
