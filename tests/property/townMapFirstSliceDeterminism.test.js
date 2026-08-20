import { describe, expect, it } from 'vitest';

import {
  firstSliceProjectionToSvg,
  loadFirstSliceDocument,
  projectFirstSliceFixedSurvey,
  saveFirstSliceDocument,
} from '../../src/domain/townMap/fabric/index.js';
import { stableSceneStringify } from '../../src/domain/townScene/stableScene.js';
import { makeFirstSliceDocument } from '../fixtures/townMapFirstSliceFixtures.js';
import {
  expectAbsentWithAnchor,
  expectPresentThenAbsent,
} from '../helpers/anchoredNegatives.js';

describe('MF-VS1 privacy and whole-slice deterministic replay', () => {
  it('PUBLIC emits zero DM-only semantic or custom-package bytes', () => {
    const fixture = makeFirstSliceDocument('CUSTOM', {
      buildingId: 'building:dm-necromantic-vault:001',
      privacy: 'DM',
    });
    const loaded = loadFirstSliceDocument(saveFirstSliceDocument(fixture.document), []);
    const publicProjection = projectFirstSliceFixedSurvey({
      document: loaded.document,
      resolutionReport: loaded.resolutionReport,
      audience: 'PUBLIC',
    });
    const dmProjection = projectFirstSliceFixedSurvey({
      document: loaded.document,
      resolutionReport: loaded.resolutionReport,
      audience: 'DM',
    });
    const publicBytes = stableSceneStringify(publicProjection);
    const dmBytes = stableSceneStringify(dmProjection);
    expectPresentThenAbsent(
      dmBytes,
      publicBytes,
      'building:dm-necromantic-vault:001',
      'PUBLIC building filter',
    );
    expectPresentThenAbsent(
      dmBytes,
      publicBytes,
      'UNRESOLVED_CUSTOM_CONTENT',
      'PUBLIC unresolved-warning filter',
    );
    expectAbsentWithAnchor(
      publicBytes,
      'package:owner-necromancy',
      'PUBLIC_DERIVATION',
      'PUBLIC package metadata filter',
    );
    expect(dmProjection.drawOps.length).toBeGreaterThan(publicProjection.drawOps.length);
  });

  it('PUBLIC bytes do not move when only a DM building identity moves', () => {
    const projectHidden = (buildingId) => {
      const fixture = makeFirstSliceDocument('CUSTOM', { buildingId, privacy: 'DM' });
      const loaded = loadFirstSliceDocument(saveFirstSliceDocument(fixture.document), []);
      return projectFirstSliceFixedSurvey({
        document: loaded.document,
        resolutionReport: loaded.resolutionReport,
        audience: 'PUBLIC',
      });
    };
    const first = projectHidden('building:dm-necromantic-vault:001');
    const second = projectHidden('building:dm-necromantic-vault:002');
    expect(stableSceneStringify(first)).toBe(stableSceneStringify(second));
    expect(firstSliceProjectionToSvg(first)).toBe(firstSliceProjectionToSvg(second));
  });

  it('compile → save → load → project → SVG is byte-identical across replays', () => {
    const first = makeFirstSliceDocument('CUSTOM');
    const second = makeFirstSliceDocument('CUSTOM');
    const bytesA = saveFirstSliceDocument(first.document);
    const bytesB = saveFirstSliceDocument(second.document);
    expect(bytesA).toBe(bytesB);
    const loadA = loadFirstSliceDocument(bytesA, [first.recipeSnapshot]);
    const loadB = loadFirstSliceDocument(bytesB, [second.recipeSnapshot]);
    const projectA = projectFirstSliceFixedSurvey({
      document: loadA.document,
      resolutionReport: loadA.resolutionReport,
      audience: 'PUBLIC',
    });
    const projectB = projectFirstSliceFixedSurvey({
      document: loadB.document,
      resolutionReport: loadB.resolutionReport,
      audience: 'PUBLIC',
    });
    expect(stableSceneStringify(projectA)).toBe(stableSceneStringify(projectB));
    expect(firstSliceProjectionToSvg(projectA)).toBe(firstSliceProjectionToSvg(projectB));
  });
});
