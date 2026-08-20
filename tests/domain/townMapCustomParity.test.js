import { describe, expect, it } from 'vitest';

import {
  assertFirstSliceMutable,
  bindBuildingOrigin,
  createSpatialRecipeSnapshot,
  firstSliceProjectionToSvg,
  loadFirstSliceDocument,
  projectFirstSliceFixedSurvey,
  resolveFirstSliceContent,
  saveFirstSliceDocument,
} from '../../src/domain/townMap/fabric/index.js';
import { stableSceneStringify } from '../../src/domain/townScene/stableScene.js';
import {
  makeFirstSliceDocument,
} from '../fixtures/townMapFirstSliceFixtures.js';

describe('MF-VS1 built-in/custom parity and package removal', () => {
  it('keeps origin identity separate from origin-neutral geometry and rendering', () => {
    const builtIn = makeFirstSliceDocument('BUILT_IN');
    const custom = makeFirstSliceDocument('CUSTOM');
    expect(custom.recipeSnapshot.contentHash).not.toBe(builtIn.recipeSnapshot.contentHash);
    expect(custom.mass.contentHash).not.toBe(builtIn.mass.contentHash);
    expect(custom.mass.geometry).toEqual(builtIn.mass.geometry);
    const builtProjection = projectFirstSliceFixedSurvey({
      document: builtIn.document,
      resolutionReport: resolveFirstSliceContent(builtIn.document, []),
      audience: 'PUBLIC',
    });
    const customProjection = projectFirstSliceFixedSurvey({
      document: custom.document,
      resolutionReport: resolveFirstSliceContent(custom.document, [custom.recipeSnapshot]),
      audience: 'PUBLIC',
    });
    expect(customProjection.semanticPrimitives).toEqual(builtProjection.semanticPrimitives);
    expect(customProjection.drawOps).toEqual(builtProjection.drawOps);
  });

  it('refuses semantic substitution at the origin-binding boundary', () => {
    const fixture = makeFirstSliceDocument('CUSTOM');
    const otherRecipe = createSpatialRecipeSnapshot({
      packageClass: 'CUSTOM',
      packageId: 'package:other',
      packageVersion: 1,
      entryId: 'recipe:cathedral',
      entryVersion: 1,
      semanticTypeId: 'semantic:cathedral',
    });
    expect(() => bindBuildingOrigin({
      geometry: fixture.mass.geometry,
      recipeSnapshot: otherRecipe,
      origin: fixture.origin,
    })).toThrow(/cannot be substituted/);
  });

  it('preserves a missing-package building and reloads visibly read-only', () => {
    const fixture = makeFirstSliceDocument('CUSTOM');
    const bytes = saveFirstSliceDocument(fixture.document);
    const loaded = loadFirstSliceDocument(bytes, []);
    expect(loaded.document.masses).toHaveLength(1);
    expect(loaded.document.masses[0].geometry).toEqual(fixture.mass.geometry);
    expect(loaded.resolutionReport.unresolved).toHaveLength(1);
    expect(loaded.readOnly).toBe(true);
    expect(() => assertFirstSliceMutable(loaded)).toThrow(/read-only/);
    expect(saveFirstSliceDocument(loaded.document)).toBe(bytes);

    const projection = projectFirstSliceFixedSurvey({
      document: loaded.document,
      resolutionReport: loaded.resolutionReport,
      audience: 'PUBLIC',
    });
    expect(projection.semanticPrimitives.some((row) => row.kind === 'BUILDING')).toBe(true);
    expect(projection.semanticPrimitives.some((row) => row.kind === 'UNRESOLVED_CUSTOM_CONTENT')).toBe(true);
    expect(projection.warnings).toEqual([{ code: 'UNRESOLVED_CUSTOM_CONTENT', entityId: fixture.spec.buildingId }]);
    expect(firstSliceProjectionToSvg(projection)).toContain('<circle');
    expect(stableSceneStringify(loaded.document)).toBe(bytes);
  });
});
