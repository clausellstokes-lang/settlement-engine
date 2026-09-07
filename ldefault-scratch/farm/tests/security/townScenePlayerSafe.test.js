/**
 * Player/public scene compilation is projection-first, never post-render hiding.
 */

import { describe, expect, it } from 'vitest';

import {
  compileTownSceneGeometry,
  compileTownSceneManifest,
  encodeTownSceneGlb,
  encodeTownScenePortraitPng,
  prepareTownSceneCompileInput,
  projectSettlementForScene,
  stableSceneStringify,
  validateTownSceneCompileInput,
  validateTownSceneManifest,
} from '../../src/domain/townScene/index.js';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';

const SENTINEL = 'COVERT_SCENE_SENTINEL_91X';

function sensitiveSettlement() {
  const base = makeTownFixture({
    tier: 'town',
    terrain: 'plains',
    walls: true,
    seed: 'security-scene',
    institutions: [
      {
        name: 'Public Market',
        catalogId: 'cat.public.market',
        priorityCategory: 'trade',
      },
      {
        name: SENTINEL,
        localUid: `uid-${SENTINEL}`,
        priorityCategory: 'criminal',
        covert: true,
        secret: SENTINEL,
      },
    ],
  });
  return {
    ...base,
    _seed: SENTINEL,
    dmNotes: SENTINEL,
    plotHooks: [SENTINEL],
    activeConditions: [
      {
        id: 'public-rain',
        archetype: 'weather',
        label: 'Heavy rain',
        severity: 0.2,
        severityBand: 'low',
      },
      {
        id: SENTINEL,
        label: SENTINEL,
        covert: true,
        severity: 1,
      },
    ],
    urbanFabric: {
      scars: [{ kind: SENTINEL, severity: 1, week: 4, wallSegmentId: 0 }],
      rebirths: [{ classes: ['criminal'], type: SENTINEL, week: 5 }],
    },
  };
}

describe('TownSceneManifest — player-safe projection', () => {
  it('posts only a bounded player-authorized compile envelope to the live worker', () => {
    const compileInput = prepareTownSceneCompileInput({
      settlement: sensitiveSettlement(),
      mapEdits: {
        layoutLawVersion: 2,
        annotations: [{ x: 1, y: 2, label: SENTINEL, audience: 'dm' }],
      },
      worldState: {
        rngSeed: SENTINEL,
        calendar: { season: 'winter', year: 3 },
        privateCampaignCarrier: SENTINEL,
      },
      regionalGraph: { secret: SENTINEL },
      audience: 'player',
    });

    expect(validateTownSceneCompileInput(compileInput)).toEqual({
      ok: true,
      errors: [],
    });
    expect(Object.keys(compileInput).sort()).toEqual([
      'atmosphere',
      'audience',
      'inputDigest',
      'kind',
      'mapEdits',
      'schemaVersion',
      'settlement',
    ]);
    expect(compileInput).not.toHaveProperty('worldState');
    expect(compileInput).not.toHaveProperty('regionalGraph');
    expect(compileInput.audience).toBe('player');
    expect(compileInput.atmosphere).toMatchObject({
      season: 'winter',
      besieged: false,
      scarLevelPermille: 0,
      rebuiltCategories: [],
      festivalScale: null,
    });
    expect(stableSceneStringify({
      type: 'compile',
      generationId: 1,
      compileInput,
    })).not.toContain(SENTINEL);
  });

  it('omits optional undefined record fields without weakening array ordering', () => {
    const settlement = {
      ...makeTownFixture({ seed: 'scene-optional-fields' }),
      economicState: {
        activeChains: [{
          chainId: 'grain-market',
          status: 'running',
          entrepot: undefined,
        }],
      },
    };
    const compileInput = prepareTownSceneCompileInput({
      settlement,
      mapEdits: { layoutLawVersion: 2 },
      audience: 'dm',
    });

    expect(compileInput.settlement.economicState.activeChains[0])
      .not.toHaveProperty('entrepot');
    expect(validateTownSceneCompileInput(compileInput)).toEqual({
      ok: true,
      errors: [],
    });
    expect(() => prepareTownSceneCompileInput({
      settlement: {
        ...settlement,
        economicState: { activeChains: [undefined] },
      },
      audience: 'dm',
    })).toThrow(/cannot omit an array entry/);
  });

  it('removes covert institutions, conditions, notes, scars, seed, and annotations before derivation', () => {
    const settlement = sensitiveSettlement();
    const hiddenAnchor = `uid:uid-${SENTINEL}`;
    const mapEdits = {
      layoutLawVersion: 2,
      annotations: [{ x: 1, y: 2, label: SENTINEL, audience: 'dm' }],
      sceneOverrides: [{
        anchor: hiddenAnchor,
        // The override itself is valid. Safety must come from projecting out
        // the covert target, not from incidentally rejecting malformed input.
        variantId: 'mirror',
        skinId: 'ruinedGothic',
      }],
    };
    const player = compileTownSceneManifest({
      settlement,
      mapEdits,
      worldState: {
        rngSeed: SENTINEL,
        calendar: { season: 'winter', year: 3 },
        secret: SENTINEL,
      },
      regionalGraph: { secret: SENTINEL },
      audience: 'player',
    });
    const publicManifest = compileTownSceneManifest({
      settlement,
      mapEdits,
      audience: 'public',
    });
    const dm = compileTownSceneManifest({
      settlement,
      mapEdits,
      audience: 'dm',
    });

    expect(stableSceneStringify(player)).not.toContain(SENTINEL);
    expect(stableSceneStringify(publicManifest)).not.toContain(SENTINEL);
    expect(stableSceneStringify(dm)).toContain(SENTINEL); // negative-control: the fixture genuinely carries it
    expect(player.buildings.map((building) => building.anchorKey)).not.toContain(hiddenAnchor);
    expect(player.living.scars).toEqual([]);
    expect(player.living.reconstruction).toEqual([]);
    expect(player.source.audience).toBe('player');
    expect(publicManifest.source.audience).toBe('public');
  });

  it('an unknown audience fails closed to public, never DM', () => {
    const manifest = compileTownSceneManifest({
      settlement: sensitiveSettlement(),
      mapEdits: { layoutLawVersion: 2 },
      audience: 'trusted-ish',
    });
    expect(manifest.source.audience).toBe('public');
    expect(stableSceneStringify(manifest)).not.toContain(SENTINEL);
  });

  it('the explicit projection API strips raw security carriers and unsafe map-edit content', () => {
    const projection = projectSettlementForScene(
      sensitiveSettlement(),
      {
        layoutLawVersion: 2,
        annotations: [{ x: 2, y: 2, label: SENTINEL, audience: 'dm' }],
        bespokeStyles: { [SENTINEL]: { __resolved: true, label: SENTINEL } },
      },
      'player',
    );
    expect(projection.audience).toBe('player');
    expect(projection.settlement).not.toHaveProperty('_seed');
    expect(projection.settlement).not.toHaveProperty('dmNotes');
    expect(projection.mapEdits).not.toHaveProperty('annotations');
    expect(projection.mapEdits).not.toHaveProperty('bespokeStyles');
    expect(JSON.stringify(projection)).not.toContain(SENTINEL);
  });

  it('covert corruption is exactly zero on every authorized building condition profile', () => {
    const manifest = compileTownSceneManifest({
      settlement: sensitiveSettlement(),
      mapEdits: { layoutLawVersion: 2 },
      audience: 'player',
    });
    expect(manifest.buildings.length).toBeGreaterThan(0);
    for (const building of manifest.buildings) {
      expect(building.conditionProfile.corruptionCovert).toBe(0);
    }
  });

  it('uses the shared model wall to reject rumored and unknown derived hazards', () => {
    const settlement = {
      ...makeTownFixture({
        tier: 'town',
        terrain: 'plains',
        seed: 'scene-hazard-wall',
      }),
      defenseProfile: {
        threats: [
          {
            id: 'threat.rumored.scene',
            type: 'corruption',
            label: SENTINEL,
            severity: 0.9,
            visibility: 'rumored',
          },
          {
            id: 'threat.unknown.scene',
            type: 'other',
            label: `${SENTINEL}_UNKNOWN`,
            severity: 0.9,
            visibility: 'unknown',
          },
          {
            id: 'threat.open.scene',
            type: 'bandit_raids',
            label: 'Bandits at the north road',
            severity: 0.7,
            visibility: 'open',
          },
        ],
      },
    };
    const player = compileTownSceneManifest({
      settlement,
      mapEdits: { layoutLawVersion: 2 },
      audience: 'player',
    });
    const dm = compileTownSceneManifest({
      settlement,
      mapEdits: { layoutLawVersion: 2 },
      audience: 'dm',
    });
    expect(stableSceneStringify(player)).not.toContain(SENTINEL);
    expect(player.living.conditions.some((condition) => (
      condition.kind === 'bandit_raids'
      && condition.label === 'Bandits at the north road'
    ))).toBe(true);
    expect(stableSceneStringify(dm)).toContain(SENTINEL);
  });

  it('projects resolved dress before atmosphere can reveal siege, scars, rebuilding, or festivals', () => {
    const base = makeTownFixture({
      tier: 'town',
      terrain: 'plains',
      seed: 'scene-atmosphere-wall',
    });
    const settlement = {
      ...base,
      urbanFabric: {
        scars: [{ kind: SENTINEL, severity: 0.9, week: 7 }],
        rebirths: [{ classes: ['merchant'], type: SENTINEL, week: 8 }],
      },
      traditions: [{
        name: SENTINEL,
        window: { startWeekOfYear: 4, weeks: 1 },
        scaleBand: 6,
        suppressedBy: null,
      }],
    };
    const worldState = {
      rngSeed: SENTINEL,
      calendar: { season: 'spring', year: 2, elapsedWeeks: 3 },
      deployments: {
        [SENTINEL]: { targetId: settlement.id, role: 'siege' },
      },
    };
    const player = compileTownSceneManifest({
      settlement,
      worldState,
      mapEdits: { layoutLawVersion: 2 },
      audience: 'player',
    });
    const dm = compileTownSceneManifest({
      settlement,
      worldState,
      mapEdits: { layoutLawVersion: 2 },
      audience: 'dm',
    });
    expect(player.living.atmosphere).toEqual({
      season: 'spring',
      severity: expect.any(String),
      besieged: false,
      scarLevelPermille: 0,
      rebuiltCategories: [],
      festivalScale: null,
    });
    expect(stableSceneStringify(player)).not.toContain(SENTINEL);
    expect(dm.living.atmosphere).toMatchObject({
      season: 'spring',
      besieged: true,
      scarLevelPermille: 900,
      rebuiltCategories: ['merchant'],
      festivalScale: 6,
    });
  });

  it('the geometry artifact carries no hidden labels or source blobs', () => {
    const manifest = compileTownSceneManifest({
      settlement: sensitiveSettlement(),
      mapEdits: { layoutLawVersion: 2 },
      audience: 'player',
    });
    const geometry = compileTownSceneGeometry(manifest);
    expect(JSON.stringify({
      kind: geometry.kind,
      manifestDigest: geometry.manifestDigest,
      options: geometry.options,
      bounds: geometry.bounds,
      instances: geometry.instances,
      batchMetadata: geometry.batches.map(({ id, kind, materialId, semanticRanges }) => ({ id, kind, materialId, semanticRanges })),
      templateMetadata: geometry.templates.map(({ id, kind, materialId, semanticRanges }) => ({ id, kind, materialId, semanticRanges })),
    })).not.toContain(SENTINEL);
  });

  it('portable GLB metadata preserves the same audience wall', () => {
    const settlement = sensitiveSettlement();
    const player = compileTownSceneManifest({
      settlement,
      mapEdits: { layoutLawVersion: 2 },
      audience: 'player',
    });
    const dm = compileTownSceneManifest({
      settlement,
      mapEdits: { layoutLawVersion: 2 },
      audience: 'dm',
    });
    const playerText = new TextDecoder().decode(
      encodeTownSceneGlb(player, compileTownSceneGeometry(player)),
    );
    const dmText = new TextDecoder().decode(
      encodeTownSceneGlb(dm, compileTownSceneGeometry(dm)),
    );
    expect(playerText).not.toContain(SENTINEL);
    expect(dmText).toContain(SENTINEL);
  });

  it('covert living state cannot influence player PNG or GLB bytes', () => {
    const base = makeTownFixture({
      tier: 'village',
      terrain: 'plains',
      walls: true,
      seed: 'player-export-living-wall',
    });
    const clean = compileTownSceneManifest({
      settlement: base,
      mapEdits: { layoutLawVersion: 2 },
      worldState: { calendar: { season: 'summer', year: 2 } },
      audience: 'player',
    });
    const adversarial = compileTownSceneManifest({
      settlement: {
        ...base,
        activeConditions: [
          {
            id: `${SENTINEL}-fire`,
            archetype: 'fire',
            label: `${SENTINEL} fire`,
            severity: 1,
            covert: true,
          },
          {
            id: `${SENTINEL}-flood`,
            archetype: 'flood',
            label: `${SENTINEL} flood`,
            severity: 1,
            covert: true,
          },
          {
            id: `${SENTINEL}-plague`,
            archetype: 'plague',
            label: `${SENTINEL} plague`,
            severity: 1,
            covert: true,
          },
          {
            id: `${SENTINEL}-siege`,
            archetype: 'siege',
            label: `${SENTINEL} siege`,
            severity: 1,
            covert: true,
          },
        ],
        urbanFabric: {
          scars: [{ kind: SENTINEL, severity: 1, week: 9 }],
          rebirths: [{ classes: ['merchant'], type: SENTINEL, week: 10 }],
        },
      },
      mapEdits: { layoutLawVersion: 2 },
      worldState: {
        calendar: { season: 'summer', year: 2 },
        occupations: {
          [base.id]: { occupierId: SENTINEL, state: SENTINEL },
        },
      },
      audience: 'player',
    });
    expect(stableSceneStringify(adversarial)).toBe(stableSceneStringify(clean));
    const cleanGeometry = compileTownSceneGeometry(clean);
    const adversarialGeometry = compileTownSceneGeometry(adversarial);
    expect(encodeTownScenePortraitPng(
      adversarial,
      adversarialGeometry,
      { width: 96, height: 72 },
    )).toEqual(encodeTownScenePortraitPng(
      clean,
      cleanGeometry,
      { width: 96, height: 72 },
    ));
    expect(encodeTownSceneGlb(adversarial, adversarialGeometry)).toEqual(
      encodeTownSceneGlb(clean, cleanGeometry),
    );
  });
});

describe('TownSceneManifest — raw-input carrier wall', () => {
  it('rejects a manifest that later acquires a seed or raw settlement carrier', () => {
    const manifest = compileTownSceneManifest({
      settlement: makeTownFixture({ seed: 'carrier-wall' }),
      mapEdits: { layoutLawVersion: 2 },
      audience: 'dm',
    });
    const seeded = structuredClone(manifest);
    seeded.buildings[0].conditionProfile.seed = 'should-never-exist';
    const raw = structuredClone(manifest);
    raw.living.rawSettlement = {};
    expect(validateTownSceneManifest(seeded)).toEqual(expect.objectContaining({ ok: false }));
    expect(validateTownSceneManifest(seeded).errors.join('\n')).toMatch(/seed is forbidden/);
    expect(validateTownSceneManifest(raw).errors.join('\n')).toMatch(/rawSettlement is forbidden/);
  });
});
