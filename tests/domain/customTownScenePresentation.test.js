/**
 * Custom content -> TownMapModel -> TownScene bounded presentation bridge.
 *
 * These tests pin the architectural boundary: custom definitions retain stable
 * identity and select registered presentation grammar, while TownMap still owns
 * placement and TownScene still owns dimensions, geometry, and living condition.
 */

import { describe, expect, it } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
import {
  CUSTOM_SETTLEMENT_GLYPH_IDS,
  glyphKindFor,
} from '../../src/domain/townMap/glyphAssign.js';
import {
  compileTownSceneManifest,
  CUSTOM_TOWN_SCENE_GLYPH_IDS,
  CUSTOM_TOWN_SCENE_LANDMARK_LEVELS,
  CUSTOM_TOWN_SCENE_MATERIALS,
  CUSTOM_TOWN_SCENE_PROFILE_IDS,
  projectCustomInstitutionSceneFields,
  resolveCustomBuildingPresentation,
  validateTownSceneManifest,
} from '../../src/domain/townScene/index.js';
import {
  getCustomContentField,
} from '../../src/domain/content/customContentManifest.js';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';

const LOCAL_UID = 'custom-scene-hall';
const DEFINITION_ID = 'definition:custom-scene-hall';
const REVISION_ID = 'revision:custom-scene-hall:7';
const CONTENT_HASH = 'sha256:7855c31e9b647f80-content';
const DEFINITION_FINGERPRINT = 'sha256:7855c31e9b647f80';

function customInstitution(overrides = {}) {
  return {
    name: 'The Lantern Archive',
    localUid: LOCAL_UID,
    isCustom: true,
    category: 'Government',
    priorityCategory: 'government',
    definitionId: DEFINITION_ID,
    revisionId: REVISION_ID,
    revisionNumber: 7,
    contentHash: CONTENT_HASH,
    customDefinitionVersion: '3.2.1',
    customDefinitionFingerprint: DEFINITION_FINGERPRINT,
    ...overrides,
  };
}

function planGeometry(model) {
  return {
    frame: model.frame,
    skeleton: model.skeleton,
    districts: model.districts,
    buildings: model.buildings.map((building) => ({
      anchorKey: building.anchorKey,
      districtId: building.districtId,
      kind: building.kind,
      position: building.position,
    })),
    fortifications: model.fortifications,
    overlays: model.overlays,
  };
}

describe('custom TownScene presentation contract', () => {
  it('keeps authoring choices identical to implemented TownScene vocabulary', () => {
    const values = field => getCustomContentField('institutions', field)?.values;
    expect(values('sceneProfileId')).toEqual(CUSTOM_TOWN_SCENE_PROFILE_IDS);
    expect(values('landmarkLevel')).toEqual(CUSTOM_TOWN_SCENE_LANDMARK_LEVELS);
    expect(values('materialFamily')).toEqual(
      Object.keys(CUSTOM_TOWN_SCENE_MATERIALS).sort(),
    );
    expect(values('glyph')).toEqual(CUSTOM_TOWN_SCENE_GLYPH_IDS);
  });

  it('gives illustrated 2D and TownScene the same registered glyph contract', () => {
    expect(CUSTOM_TOWN_SCENE_GLYPH_IDS).toBe(CUSTOM_SETTLEMENT_GLYPH_IDS);

    for (const glyph of CUSTOM_SETTLEMENT_GLYPH_IDS) {
      const building = {
        anchorKey: `custom-glyph:${glyph}`,
        name: 'The Ordinary Smithy',
        kind: 'landmark',
        sceneProfileId: 'sacred-sanctuary',
        glyph,
      };

      expect(glyphKindFor(building, 'religious').kind).toBe(glyph);
      expect(resolveCustomBuildingPresentation(building).glyphKind).toBe(glyph);
    }
  });

  it('admits only registered semantic presentation fields', () => {
    const projected = projectCustomInstitutionSceneFields({
      definitionId: DEFINITION_ID,
      revisionId: REVISION_ID,
      revisionNumber: 7,
      contentHash: CONTENT_HASH,
      _schemaVersion: 1,
      sceneProfileId: 'sacred-sanctuary',
      landmarkLevel: 'standard',
      materialFamily: 'brick',
      glyph: 'small-spire',
      heightCm: 999999,
      mesh: 'https://untrusted.invalid/model.glb',
      shader: 'arbitrary-source',
      deterioration: 'ruined',
    });

    expect(projected).toEqual({
      customDefinitionId: DEFINITION_ID,
      customDefinitionRevisionId: REVISION_ID,
      customDefinitionContentHash: CONTENT_HASH,
      customDefinitionVersion: 7,
      customDefinitionFingerprint: CONTENT_HASH,
      sceneProfileId: 'sacred-sanctuary',
      landmarkLevel: 'standard',
      materialFamily: 'brick',
      glyph: 'small-spire',
    });
    expect(resolveCustomBuildingPresentation(projected)).toEqual({
      profileId: 'sacred-sanctuary',
      glyphKind: 'small-spire',
      skinId: 'brickGuild',
      landmark: false,
    });
  });

  it('reads the retired nested shape as an alias but emits only canonical flat fields', () => {
    const projected = projectCustomInstitutionSceneFields({
      sceneProfileId: 'domestic-house',
      scenePresentation: {
        landmark: true,
        material: 'steel',
        glyph: 'watchtower',
      },
    });

    expect(projected).toEqual({
      sceneProfileId: 'domestic-house',
      landmarkLevel: 'landmark',
      materialFamily: 'steel',
      glyph: 'watchtower',
    });
    expect(projected).not.toHaveProperty('scenePresentation');
  });

  it('retains bounded visual intent and exact definition identity through generation', () => {
    const generated = generateSettlementPipeline(
      {
        settType: 'town',
        culture: 'germanic',
        terrain: 'river',
        tradeRouteAccess: 'road',
        monsterThreat: 'civilized',
      },
      null,
      {
        seed: 'custom-scene-generation',
        customContent: {
          institutions: [{
            name: 'The Lantern Archive',
            localUid: LOCAL_UID,
            definitionId: DEFINITION_ID,
            revisionId: REVISION_ID,
            revisionNumber: 7,
            contentHash: CONTENT_HASH,
            category: 'Government',
            essential: true,
            _schemaVersion: 1,
            sceneProfileId: 'civic-archive',
            materialFamily: 'brick',
            glyph: 'archive-hall',
            heightCm: 999999,
          }],
        },
      },
    );
    const institution = generated.institutions.find(
      (entry) => entry.localUid === LOCAL_UID,
    );

    expect(institution).toMatchObject({
      name: 'The Lantern Archive',
      localUid: LOCAL_UID,
      category: 'Government',
      customDefinitionId: DEFINITION_ID,
      customDefinitionRevisionId: REVISION_ID,
      customDefinitionContentHash: CONTENT_HASH,
      customDefinitionVersion: 7,
      customDefinitionFingerprint: CONTENT_HASH,
      sceneProfileId: 'civic-archive',
      materialFamily: 'brick',
      glyph: 'archive-hall',
    });
    expect(institution).not.toHaveProperty('heightCm');
  });

  it.each([
    ['layout v1', null],
    ['layout v2', { layoutLawVersion: 2 }],
  ])('keeps %s 2D plan geometry invariant', (_label, mapEdits) => {
    const plain = makeTownFixture({
      tier: 'town',
      terrain: 'plains',
      walls: true,
      seed: `custom-scene-plan-${_label}`,
      institutions: [customInstitution({
        customDefinitionVersion: undefined,
        customDefinitionFingerprint: undefined,
      })],
    });
    const presented = {
      ...plain,
      institutions: [customInstitution({
        sceneProfileId: 'martial-keep',
        landmarkLevel: 'standard',
        materialFamily: 'steel',
        glyph: 'watchtower',
      })],
    };

    const plainModel = buildTownMapModel(plain, mapEdits);
    const presentedModel = buildTownMapModel(presented, mapEdits);
    const presentedBuilding = presentedModel.buildings.find(
      (building) => building.anchorKey === `uid:${LOCAL_UID}`,
    );
    const presentedDistrict = presentedModel.districts.find(
      (district) => district.id === presentedBuilding?.districtId,
    );

    expect(planGeometry(presentedModel)).toEqual(planGeometry(plainModel));
    expect(presentedBuilding).toMatchObject({
      localUid: LOCAL_UID,
      category: 'Government',
      sceneProfileId: 'martial-keep',
      landmarkLevel: 'standard',
      materialFamily: 'steel',
      glyph: 'watchtower',
    });
    expect(glyphKindFor(presentedBuilding, presentedDistrict?.category).kind).toBe(
      'watchtower',
    );
  });

  it('resolves registered portrait grammar and provenance without accepting raw geometry', () => {
    const settlement = makeTownFixture({
      tier: 'town',
      terrain: 'plains',
      walls: true,
      seed: 'custom-scene-manifest',
      institutions: [customInstitution({
        sceneProfileId: 'sacred-sanctuary',
        landmarkLevel: 'standard',
        materialFamily: 'brick',
        glyph: 'small-spire',
        heightCm: 1,
        deterioration: 'ruined',
      })],
    });
    const manifest = compileTownSceneManifest({
      settlement,
      mapEdits: { layoutLawVersion: 2 },
      audience: 'dm',
    });
    const building = manifest.buildings.find(
      (entry) => entry.anchorKey === `uid:${LOCAL_UID}`,
    );
    const semantic = manifest.semantics.find(
      (entry) => entry.sceneId === building.id,
    );
    const customProvenance = manifest.provenance.filter(
      (entry) => building.provenanceRefs.includes(entry.id),
    );

    expect(validateTownSceneManifest(manifest)).toEqual({ ok: true, errors: [] });
    expect(building).toMatchObject({
      sceneProfileId: 'sacred-sanctuary',
      shapeFamily: 'sacred',
      shapeKind: 'small-spire',
      skinId: 'brickGuild',
      materialKey: 'skin:brickGuild',
      landmark: false,
    });
    expect(building.heightCm).toBeGreaterThan(1);
    expect(building).not.toHaveProperty('deterioration');
    expect(building.conditionProfile.corruptionCovert).toBe(0);
    expect(semantic).toMatchObject({
      canonicalRef: {
        kind: 'institution',
        id: LOCAL_UID,
        localUid: LOCAL_UID,
        definitionId: DEFINITION_ID,
        revisionId: REVISION_ID,
        contentHash: CONTENT_HASH,
        definitionVersion: '3.2.1',
        definitionFingerprint: DEFINITION_FINGERPRINT,
      },
      details: {
        category: 'Government',
        sceneProfileId: 'sacred-sanctuary',
      },
    });
    expect(customProvenance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        family: 'custom-definition',
        sourceRef: `custom:${LOCAL_UID}`,
        effect: 'scene-profile:sacred-sanctuary',
        localUid: LOCAL_UID,
        definitionId: DEFINITION_ID,
        revisionId: REVISION_ID,
        contentHash: CONTENT_HASH,
        definitionVersion: '3.2.1',
        definitionFingerprint: DEFINITION_FINGERPRINT,
      }),
    ]));

    const localOverride = compileTownSceneManifest({
      settlement,
      mapEdits: {
        layoutLawVersion: 2,
        sceneOverrides: [{
          anchor: `uid:${LOCAL_UID}`,
          skinId: 'marbleTemple',
        }],
      },
      audience: 'dm',
    });
    const overridden = localOverride.buildings.find(
      (entry) => entry.anchorKey === `uid:${LOCAL_UID}`,
    );
    expect(overridden.mapAnchor).toEqual(building.mapAnchor);
    expect(overridden.skinId).toBe('marbleTemple');
  });

  it('falls back byte-identically on invalid visual tokens and admits ruined grammar', () => {
    const base = makeTownFixture({
      tier: 'village',
      terrain: 'plains',
      seed: 'custom-scene-fallback',
      institutions: [customInstitution()],
    });
    const invalid = {
      ...base,
      institutions: [customInstitution({
        sceneProfileId: 'arbitrary-webgl-model',
        landmarkLevel: 'monumental',
        materialFamily: 'unobtainium',
        glyph: 'uploaded-mesh',
        heightCm: 999999,
      })],
    };

    expect(buildTownMapModel(invalid, { layoutLawVersion: 2 })).toEqual(
      buildTownMapModel(base, { layoutLawVersion: 2 }),
    );
    expect(compileTownSceneManifest({
      settlement: invalid,
      mapEdits: { layoutLawVersion: 2 },
      audience: 'dm',
    })).toEqual(compileTownSceneManifest({
      settlement: base,
      mapEdits: { layoutLawVersion: 2 },
      audience: 'dm',
    }));

    const ruined = {
      ...base,
      institutions: [customInstitution({
        sceneProfileId: 'ruined-landmark',
      })],
    };
    const ruinedManifest = compileTownSceneManifest({
      settlement: ruined,
      mapEdits: { layoutLawVersion: 2 },
      audience: 'dm',
    });
    const ruinedBuilding = ruinedManifest.buildings.find(
      (entry) => entry.anchorKey === `uid:${LOCAL_UID}`,
    );
    expect(validateTownSceneManifest(ruinedManifest)).toEqual({
      ok: true,
      errors: [],
    });
    expect(ruinedBuilding).toMatchObject({
      sceneProfileId: 'ruined-landmark',
      shapeFamily: 'ruined',
      shapeKind: 'ruin-shell',
      skinId: 'ruinedGothic',
    });
  });
});
