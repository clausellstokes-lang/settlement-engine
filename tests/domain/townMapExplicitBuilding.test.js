import { describe, expect, it } from 'vitest';

import {
  compileExplicitBuildingMass,
  firstSliceProjectionToSvg,
  firstSliceScreenDrawOps,
  projectFirstSliceFixedSurvey,
  resolveFirstSliceContent,
} from '../../src/domain/townMap/fabric/index.js';
import {
  makeFirstSliceDocument,
  makeFirstSliceMass,
} from '../fixtures/townMapFirstSliceFixtures.js';

describe('MF-VS1 explicit mass and fixed-survey projection', () => {
  it('compiles one closed explicit mass with no inferred geometry fields', () => {
    const { mass } = makeFirstSliceMass();
    expect(mass.geometry.shell.length).toBeGreaterThanOrEqual(9);
    expect(mass.geometry.roof).toEqual({ kind: 'GABLE', eaveQ: 60, ridgeQ: 90, ridgeAxis: 'X' });
    expect(mass.geometry.materials).toEqual({
      wallMaterialId: 'material:dressed-stone',
      roofMaterialId: 'material:slate',
    });
    expect(mass.geometry.maxHeightQ).toBe(90);
  });

  it('fails closed when roof, height, material, or exact W3 footprint is missing', () => {
    const fixture = makeFirstSliceMass();
    const compile = (spec) => compileExplicitBuildingMass({
      foundation: fixture.foundation,
      subdivision: fixture.subdivision,
      spec,
      recipeSnapshot: fixture.recipeSnapshot,
      origin: fixture.origin,
    });
    const { roof: _roof, ...withoutRoof } = fixture.spec;
    expect(() => compile(withoutRoof)).toThrow(/exactly/);
    expect(() => compile({ ...fixture.spec, wallTopQ: undefined })).toThrow(/integer/);
    expect(() => compile({ ...fixture.spec, materials: { wallMaterialId: 'material:stone' } })).toThrow(/exactly/);
    expect(() => compile({ ...fixture.spec, footprint: [[1, 1], [2, 1], [2, 2], [1, 2]] })).toThrow(/fitted W3/);
  });

  it('feeds one ordered draw list to screen and the shared SVG serializer', () => {
    const { document } = makeFirstSliceDocument();
    const resolutionReport = resolveFirstSliceContent(document, []);
    const projection = projectFirstSliceFixedSurvey({ document, resolutionReport, audience: 'PUBLIC' });
    expect(firstSliceScreenDrawOps(projection)).toBe(projection.drawOps);
    expect(projection.semanticPrimitives.some((row) => row.kind === 'SHADOW')).toBe(true);
    expect(projection.semanticPrimitives.some((row) => row.kind === 'BUILDING')).toBe(true);
    const svg = firstSliceProjectionToSvg(projection, { width: 640, height: 480 });
    expect(svg).toContain('width="640"');
    expect(svg).toContain('height="480"');
    expect(svg).toBe(firstSliceProjectionToSvg(projection, { width: 640, height: 480 }));
  });
});
