#!/usr/bin/env node
/**
 * Deterministic local audit for the settlement-scene projection.
 *
 * This is a developer diagnostic, not promotion evidence. It exercises a
 * pairwise matrix across the scene's product axes, checks deterministic CPU
 * exports and bounded geometry, and writes a small representative artifact
 * set. It does not render the production WebGL runtime, emulate a physical
 * device, exercise assistive technology, or substitute for human review.
 */

import { createHash } from 'node:crypto';
import {
  mkdirSync,
  renameSync,
  writeFileSync,
} from 'node:fs';
import {
  dirname,
  relative,
  resolve,
} from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  compileTownSceneGeometry,
  compileTownSceneManifest,
  encodeTownSceneGlb,
  encodeTownScenePortraitPng,
  flattenTownSceneGeometry,
  renderTownScenePortrait,
  sceneDigest,
  stableSceneStringify,
} from '../../src/domain/townScene/index.js';
import { makeTownFixture } from '../../tests/fixtures/townMapFixtures.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const LOCAL_ARTIFACT_ROOT = resolve(
  ROOT,
  'artifacts/town-scene/local-matrix',
);
const REPORT_NAME = 'local-matrix-report.json';
const PRIVATE_SENTINEL = 'TS3D_PRIVATE_MATRIX_SENTINEL_8efbb410';

const PORTRAIT_AUDIT_OPTIONS = Object.freeze({
  width: 320,
  height: 240,
  lod: 1,
  margin: 28,
  supersample: 1,
});
const REPRESENTATIVE_PNG_OPTIONS = Object.freeze({
  width: 480,
  height: 360,
  lod: 2,
  margin: 40,
  supersample: 1,
});

/**
 * Expanded CPU export triangles are a conservative draw-load proxy. The
 * manifest's triangle budgets apply to each reusable mesh at its matching LOD;
 * these separate ceilings catch aggregate explosions after instancing and
 * living-marker expansion.
 */
const LOCAL_DRAW_TRIANGLE_CEILINGS = Object.freeze([
  30_000,
  90_000,
  240_000,
]);
const LOCAL_BYTE_CEILINGS = Object.freeze({
  geometry: 32 * 1024 * 1024,
  glb: 16 * 1024 * 1024,
  png: 4 * 1024 * 1024,
});

export const TOWN_SCENE_MATRIX_AXES = Object.freeze({
  tier: Object.freeze([
    'thorp',
    'hamlet',
    'village',
    'town',
    'city',
    'metropolis',
  ]),
  biome: Object.freeze([
    'plains',
    'hills',
    'forest',
    'riverside',
    'coastal',
    'mountain',
    'desert',
  ]),
  walls: Object.freeze([false, true]),
  water: Object.freeze([false, true]),
  season: Object.freeze(['spring', 'summer', 'autumn', 'winter']),
  condition: Object.freeze(['none', 'fire', 'flood', 'plague', 'siege']),
  audience: Object.freeze(['dm', 'player']),
});

const REPRESENTATIVE_CASES = Object.freeze([
  {
    tier: 'thorp',
    biome: 'plains',
    walls: false,
    water: false,
    season: 'spring',
    condition: 'none',
    audience: 'player',
    representative: true,
  },
  {
    tier: 'hamlet',
    biome: 'forest',
    walls: false,
    water: false,
    season: 'summer',
    condition: 'fire',
    audience: 'dm',
    representative: true,
  },
  {
    tier: 'village',
    biome: 'riverside',
    walls: true,
    water: true,
    season: 'autumn',
    condition: 'flood',
    audience: 'player',
    representative: true,
  },
  {
    tier: 'town',
    biome: 'hills',
    walls: true,
    water: false,
    season: 'winter',
    condition: 'plague',
    audience: 'dm',
    representative: true,
  },
  {
    tier: 'city',
    biome: 'coastal',
    walls: true,
    water: true,
    season: 'spring',
    condition: 'siege',
    audience: 'player',
    representative: true,
  },
  {
    tier: 'metropolis',
    biome: 'mountain',
    walls: true,
    water: false,
    season: 'autumn',
    condition: 'none',
    audience: 'dm',
    representative: true,
  },
  {
    tier: 'town',
    biome: 'desert',
    walls: false,
    water: true,
    season: 'summer',
    condition: 'fire',
    audience: 'player',
    representative: true,
  },
  // The exact counterpart to the first representative is a privacy negative
  // control: DM must retain the covert sentinel that Player must not receive.
  {
    tier: 'thorp',
    biome: 'plains',
    walls: false,
    water: false,
    season: 'spring',
    condition: 'none',
    audience: 'dm',
    representative: false,
  },
]);

const CONDITION_FIXTURES = Object.freeze({
  fire: Object.freeze({
    archetype: 'fire',
    label: 'A recent fire strains the settlement',
    severity: 0.72,
    severityBand: 'high',
  }),
  flood: Object.freeze({
    archetype: 'flood',
    label: 'Floodwater disrupts low ground',
    severity: 0.58,
    severityBand: 'medium',
  }),
  plague: Object.freeze({
    archetype: 'plague',
    label: 'Illness burdens the settlement',
    severity: 0.64,
    severityBand: 'high',
  }),
  siege: Object.freeze({
    archetype: 'occupation',
    label: 'Occupation weighs on the settlement',
    severity: 0.81,
    severityBand: 'severe',
  }),
});

/** @param {unknown} value */
function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

/** @param {unknown} value */
function canonicalAxisValue(value) {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

/** @param {Record<string, unknown>} row */
function rowKey(row) {
  return Object.keys(TOWN_SCENE_MATRIX_AXES)
    .map((axis) => `${axis}=${canonicalAxisValue(row[axis])}`)
    .join('|');
}

/**
 * Produce every Cartesian candidate. The full set is small (6,720 rows) and is
 * only used while selecting the much smaller pairwise covering matrix.
 */
function cartesianCandidates() {
  const axes = Object.entries(TOWN_SCENE_MATRIX_AXES);
  /** @type {Array<Record<string, unknown>>} */
  const rows = [];
  const visit = (index, current) => {
    if (index === axes.length) {
      rows.push({ ...current });
      return;
    }
    const [axis, values] = axes[index];
    for (const value of values) {
      current[axis] = value;
      visit(index + 1, current);
    }
  };
  visit(0, {});
  return rows;
}

/** @param {Record<string, unknown>} row */
function pairKeysForRow(row) {
  const axes = Object.keys(TOWN_SCENE_MATRIX_AXES);
  const pairs = [];
  for (let left = 0; left < axes.length; left++) {
    for (let right = left + 1; right < axes.length; right++) {
      const leftAxis = axes[left];
      const rightAxis = axes[right];
      pairs.push(
        `${leftAxis}=${canonicalAxisValue(row[leftAxis])}`
        + `|${rightAxis}=${canonicalAxisValue(row[rightAxis])}`,
      );
    }
  }
  return pairs;
}

function everyRequiredPair() {
  const axes = Object.entries(TOWN_SCENE_MATRIX_AXES);
  const pairs = new Set();
  for (let left = 0; left < axes.length; left++) {
    for (let right = left + 1; right < axes.length; right++) {
      const [leftAxis, leftValues] = axes[left];
      const [rightAxis, rightValues] = axes[right];
      for (const leftValue of leftValues) {
        for (const rightValue of rightValues) {
          pairs.add(
            `${leftAxis}=${canonicalAxisValue(leftValue)}`
            + `|${rightAxis}=${canonicalAxisValue(rightValue)}`,
          );
        }
      }
    }
  }
  return pairs;
}

/**
 * Return the pairwise combinations not covered by a proposed matrix.
 *
 * @param {Array<Record<string, unknown>>} rows
 */
export function townSceneMatrixMissingPairs(rows) {
  const missing = everyRequiredPair();
  for (const row of rows) {
    for (const pair of pairKeysForRow(row)) missing.delete(pair);
  }
  return [...missing].sort();
}

/**
 * Deterministically select a pairwise covering matrix.
 *
 * Representative rows are admitted first so the artifact corpus has authored
 * product meaning. The greedy pass then chooses the lexicographically earliest
 * candidate that covers the most still-missing pairs.
 */
export function buildTownSceneAuditMatrix() {
  const candidates = cartesianCandidates();
  const candidateByKey = new Map(
    candidates.map((candidate) => [rowKey(candidate), candidate]),
  );
  const selected = REPRESENTATIVE_CASES.map((row) => ({ ...row }));
  const selectedKeys = new Set(selected.map(rowKey));
  const missing = everyRequiredPair();
  for (const row of selected) {
    for (const pair of pairKeysForRow(row)) missing.delete(pair);
  }

  while (missing.size > 0) {
    let best = null;
    let bestScore = -1;
    for (const candidate of candidates) {
      if (selectedKeys.has(rowKey(candidate))) continue;
      let score = 0;
      for (const pair of pairKeysForRow(candidate)) {
        if (missing.has(pair)) score += 1;
      }
      if (score > bestScore) {
        best = candidate;
        bestScore = score;
      }
    }
    if (!best || bestScore <= 0) {
      throw new Error('Could not construct complete TownScene pairwise matrix');
    }
    const chosen = candidateByKey.get(rowKey(best));
    selected.push({ ...chosen, representative: false });
    selectedKeys.add(rowKey(chosen));
    for (const pair of pairKeysForRow(chosen)) missing.delete(pair);
  }

  return Object.freeze(selected.map((row, index) => Object.freeze({
    ...row,
    id: [
      String(index + 1).padStart(3, '0'),
      row.tier,
      row.biome,
      row.walls ? 'walled' : 'open',
      row.water ? 'wet' : 'dry',
      row.season,
      row.condition,
      row.audience,
    ].join('-'),
  })));
}

/** @param {Record<string, unknown>} scenario */
function settlementForScenario(scenario) {
  const fixture = makeTownFixture({
    tier: String(scenario.tier),
    terrain: String(scenario.biome),
    walls: Boolean(scenario.walls),
    water: Boolean(scenario.water),
    seed: `town-scene-matrix:${scenario.id}`,
  });
  const condition = CONDITION_FIXTURES[scenario.condition];
  const activeConditions = condition
    ? [{
      id: `matrix.${scenario.condition}`,
      ...condition,
    }]
    : [];

  return {
    ...fixture,
    dmNotes: PRIVATE_SENTINEL,
    institutions: [
      ...fixture.institutions,
      {
        name: PRIVATE_SENTINEL,
        localUid: `uid-${PRIVATE_SENTINEL}`,
        priorityCategory: 'criminal',
        covert: true,
        secret: PRIVATE_SENTINEL,
      },
    ],
    activeConditions,
    ...(scenario.condition === 'fire' || scenario.condition === 'siege'
      ? {
        urbanFabric: {
          scars: [{
            kind: String(scenario.condition),
            severity: condition.severity,
            week: 12,
          }],
          rebirths: [],
        },
      }
      : {}),
  };
}

/** @param {Record<string, unknown>} scenario */
function compileInputForScenario(scenario) {
  return {
    settlement: settlementForScenario(scenario),
    mapEdits: { layoutLawVersion: 2 },
    worldState: {
      rngSeed: 'town-scene-local-matrix-world',
      calendar: {
        season: String(scenario.season),
        year: 3,
        elapsedWeeks: 124,
      },
    },
    audience: String(scenario.audience),
  };
}

/**
 * Hash a geometry bundle without coercing typed arrays into enormous JSON
 * objects. Type tags, sorted object keys, array order, and exact view bytes are
 * all included.
 */
function geometryDigest(bundle) {
  const hash = createHash('sha256');
  const visit = (value) => {
    if (value === null) {
      hash.update('null;');
    } else if (ArrayBuffer.isView(value)) {
      hash.update(`view:${value.constructor.name}:${value.byteLength}:`);
      hash.update(
        Buffer.from(value.buffer, value.byteOffset, value.byteLength),
      );
      hash.update(';');
    } else if (Array.isArray(value)) {
      hash.update(`array:${value.length}:[`);
      for (const entry of value) visit(entry);
      hash.update('];');
    } else if (value && typeof value === 'object') {
      const record = /** @type {Record<string, unknown>} */ (value);
      const keys = Object.keys(record).sort();
      hash.update(`object:${keys.length}:{`);
      for (const key of keys) {
        hash.update(`${key.length}:${key}=`);
        visit(record[key]);
      }
      hash.update('};');
    } else {
      hash.update(`${typeof value}:${JSON.stringify(value)};`);
    }
  };
  visit(bundle);
  return hash.digest('hex');
}

/** @param {unknown} value */
function typedArrayBytes(value) {
  if (ArrayBuffer.isView(value)) return value.byteLength;
  if (Array.isArray(value)) {
    return value.reduce((total, entry) => total + typedArrayBytes(entry), 0);
  }
  if (value && typeof value === 'object') {
    return Object.values(value).reduce(
      (total, entry) => total + typedArrayBytes(entry),
      0,
    );
  }
  return 0;
}

/** @param {Uint8Array} bytes */
function pngDimensions(bytes) {
  if (
    bytes.length < 24
    || !bytes.subarray(0, 8).every(
      (value, index) => value === [137, 80, 78, 71, 13, 10, 26, 10][index],
    )
  ) {
    return null;
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return [view.getUint32(16, false), view.getUint32(20, false)];
}

/** @param {Uint8Array} bytes */
function glbMetadata(bytes) {
  if (bytes.length < 20) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (
    view.getUint32(0, true) !== 0x46546c67
    || view.getUint32(4, true) !== 2
    || view.getUint32(8, true) !== bytes.length
  ) {
    return null;
  }
  const jsonLength = view.getUint32(12, true);
  if (20 + jsonLength > bytes.length) return null;
  try {
    const json = JSON.parse(
      new TextDecoder().decode(bytes.subarray(20, 20 + jsonLength)).trimEnd(),
    );
    return {
      manifestDigest: json.nodes?.[0]?.extras?.townScene?.manifestDigest || null,
    };
  } catch {
    return null;
  }
}

/** @param {Uint8Array} bytes */
function containsPrivateSentinel(bytes) {
  return Buffer.from(bytes).includes(Buffer.from(PRIVATE_SENTINEL));
}

/** @param {Uint8Array} rgb */
function portraitColorMetrics(rgb) {
  const colors = new Set();
  let minimumLuminance = 255;
  let maximumLuminance = 0;
  for (let offset = 0; offset < rgb.length; offset += 3) {
    const red = rgb[offset];
    const green = rgb[offset + 1];
    const blue = rgb[offset + 2];
    colors.add((red << 16) | (green << 8) | blue);
    const luminance = Math.round(
      red * 0.2126 + green * 0.7152 + blue * 0.0722,
    );
    minimumLuminance = Math.min(minimumLuminance, luminance);
    maximumLuminance = Math.max(maximumLuminance, luminance);
  }
  return {
    distinctRgbColors: colors.size,
    luminanceRange: maximumLuminance - minimumLuminance,
  };
}

/** @param {unknown} error */
function safeErrorMessage(error) {
  const message = error instanceof Error ? error.message : String(error);
  return message.replaceAll(PRIVATE_SENTINEL, '[private sentinel redacted]');
}

/**
 * Audit one fully specified matrix row.
 *
 * @param {Record<string, unknown>} scenario
 */
export function auditTownSceneMatrixCase(scenario) {
  /** @type {Array<{ code: string, detail: string }>} */
  const errors = [];
  const requireCheck = (condition, code, detail) => {
    if (!condition) errors.push({ code, detail });
  };

  try {
    const input = compileInputForScenario(scenario);
    const firstManifest = compileTownSceneManifest(input);
    const secondManifest = compileTownSceneManifest(input);
    const firstManifestText = stableSceneStringify(firstManifest);
    const secondManifestText = stableSceneStringify(secondManifest);
    const manifestDigest = sceneDigest(firstManifest);
    requireCheck(
      firstManifestText === secondManifestText,
      'manifest_parity',
      'Repeated manifest compilation was not byte-identical.',
    );

    const firstGeometry = compileTownSceneGeometry(firstManifest);
    const secondGeometry = compileTownSceneGeometry(secondManifest);
    const firstGeometryDigest = geometryDigest(firstGeometry);
    requireCheck(
      firstGeometryDigest === geometryDigest(secondGeometry),
      'geometry_parity',
      'Repeated geometry compilation was not byte-identical.',
    );
    requireCheck(
      firstGeometry.manifestDigest === manifestDigest,
      'geometry_join',
      'Geometry did not retain the exact manifest digest.',
    );

    const uniqueMeshes = firstGeometry.templates.length;
    const geometryBytes = typedArrayBytes(firstGeometry);
    requireCheck(
      firstManifest.buildings.length
        <= firstManifest.budgets.maximumBuildings,
      'building_budget',
      'Building count exceeded the manifest budget.',
    );
    requireCheck(
      firstManifest.vegetation.length
        <= firstManifest.budgets.maximumVegetationInstances,
      'vegetation_budget',
      'Vegetation count exceeded the manifest budget.',
    );
    requireCheck(
      uniqueMeshes <= firstManifest.budgets.maximumUniqueMeshes,
      'unique_mesh_budget',
      'Reusable mesh count exceeded the manifest budget.',
    );
    requireCheck(
      geometryBytes <= LOCAL_BYTE_CEILINGS.geometry,
      'geometry_byte_budget',
      'Transfer-ready geometry exceeded the local byte ceiling.',
    );

    const largestReusableMeshTrianglesByLod = [0, 1, 2].map((lod) => (
      firstGeometry.templates
        .filter((template) => Number(template.lod) === lod)
        .reduce(
          (largest, template) => Math.max(
            largest,
            template.indices.length / 3,
          ),
          0,
        )
    ));
    for (const lod of [0, 1, 2]) {
      requireCheck(
        largestReusableMeshTrianglesByLod[lod]
          <= firstManifest.budgets.maximumTrianglesByLod[lod],
        `reusable_mesh_triangle_budget_lod_${lod}`,
        `A reusable LOD ${lod} mesh exceeded its triangle budget.`,
      );
    }

    const drawTrianglesByLod = [0, 1, 2].map((lod) => {
      const mesh = flattenTownSceneGeometry(
        firstManifest,
        firstGeometry,
        { lod },
      );
      requireCheck(
        mesh.min.every(Number.isFinite)
          && mesh.max.every(Number.isFinite)
          && mesh.min.every((value, axis) => value <= mesh.max[axis]),
        `finite_bounds_lod_${lod}`,
        `LOD ${lod} export bounds were invalid.`,
      );
      return mesh.indices.length / 3;
    });
    for (const lod of [0, 1, 2]) {
      requireCheck(
        drawTrianglesByLod[lod] <= LOCAL_DRAW_TRIANGLE_CEILINGS[lod],
        `expanded_triangle_ceiling_lod_${lod}`,
        `Expanded LOD ${lod} draw load exceeded the local ceiling.`,
      );
    }

    const portrait = renderTownScenePortrait(
      firstManifest,
      firstGeometry,
      PORTRAIT_AUDIT_OPTIONS,
    );
    const coverage = portrait.featureCoverage;
    const pixelCount = portrait.width * portrait.height;
    const occupiedPixels = pixelCount - coverage.background;
    const frameOccupancyPermille = Math.round(
      occupiedPixels / pixelCount * 1000,
    );
    const featurePixels = occupiedPixels - coverage.ground;
    const featureOccupancyPermille = Math.round(
      featurePixels / pixelCount * 1000,
    );
    const colorMetrics = portraitColorMetrics(portrait.rgb);
    requireCheck(
      coverage.building > 0 && coverage.ground > 0,
      'blank_portrait',
      'Portrait did not contain both settlement buildings and ground.',
    );
    requireCheck(
      colorMetrics.distinctRgbColors >= 32
        && colorMetrics.luminanceRange >= 24,
      'flat_portrait',
      'Portrait lacked the color or luminance variation of a rendered scene.',
    );
    requireCheck(
      featureOccupancyPermille >= 2 && featureOccupancyPermille <= 700,
      'gross_frame_clipping',
      'Foreground occupancy indicates an empty thumbnail or a grossly clipped frame.',
    );
    if (firstManifest.terrain.waterBodies.length > 0) {
      requireCheck(
        coverage.water > 0,
        'water_visibility',
        'A water-bearing scene rendered no water pixels.',
      );
    }
    if (scenario.walls) {
      requireCheck(
        firstManifest.walls.length > 0 && coverage.structure > 0,
        'wall_visibility',
        'A walled scenario produced no wall records or structure pixels.',
      );
    }
    if (scenario.condition !== 'none') {
      const expectedCondition = CONDITION_FIXTURES[scenario.condition];
      requireCheck(
        firstManifest.living.conditions.some(
          (condition) => (
            condition.archetype === expectedCondition.archetype
            && condition.label === expectedCondition.label
          ),
        ),
        'condition_projection',
        'The visible matrix condition was absent from the scene.',
      );
    }

    const firstPng = encodeTownScenePortraitPng(
      firstManifest,
      firstGeometry,
      PORTRAIT_AUDIT_OPTIONS,
    );
    const secondPng = encodeTownScenePortraitPng(
      secondManifest,
      secondGeometry,
      PORTRAIT_AUDIT_OPTIONS,
    );
    const pngSize = pngDimensions(firstPng);
    requireCheck(
      sha256(firstPng) === sha256(secondPng),
      'png_parity',
      'Repeated deterministic PNG exports were not byte-identical.',
    );
    requireCheck(
      pngSize?.[0] === PORTRAIT_AUDIT_OPTIONS.width
        && pngSize?.[1] === PORTRAIT_AUDIT_OPTIONS.height,
      'png_contract',
      'PNG signature or dimensions were invalid.',
    );
    requireCheck(
      firstPng.length <= LOCAL_BYTE_CEILINGS.png,
      'png_byte_budget',
      'PNG exceeded the local byte ceiling.',
    );

    const firstGlb = encodeTownSceneGlb(
      firstManifest,
      firstGeometry,
      { lod: 2 },
    );
    const secondGlb = encodeTownSceneGlb(
      secondManifest,
      secondGeometry,
      { lod: 2 },
    );
    const glb = glbMetadata(firstGlb);
    requireCheck(
      sha256(firstGlb) === sha256(secondGlb),
      'glb_parity',
      'Repeated GLB exports were not byte-identical.',
    );
    requireCheck(
      glb?.manifestDigest === manifestDigest,
      'glb_contract',
      'GLB was invalid or did not retain the manifest digest.',
    );
    requireCheck(
      firstGlb.length <= LOCAL_BYTE_CEILINGS.glb,
      'glb_byte_budget',
      'GLB exceeded the local byte ceiling.',
    );

    const manifestContainsSentinel = firstManifestText.includes(
      PRIVATE_SENTINEL,
    );
    const glbContainsSentinel = containsPrivateSentinel(firstGlb);
    const pngContainsSentinel = containsPrivateSentinel(firstPng);
    if (scenario.audience === 'player') {
      requireCheck(
        !manifestContainsSentinel
          && !glbContainsSentinel
          && !pngContainsSentinel,
        'player_secret_leak',
        'Player manifest or export contained the private audit sentinel.',
      );
    } else {
      requireCheck(
        manifestContainsSentinel && glbContainsSentinel,
        'dm_privacy_negative_control',
        'DM manifest/GLB did not retain the sentinel used to prove the probe is live.',
      );
    }

    return {
      id: scenario.id,
      axes: {
        tier: scenario.tier,
        biome: scenario.biome,
        walls: scenario.walls,
        water: scenario.water,
        season: scenario.season,
        condition: scenario.condition,
        audience: scenario.audience,
      },
      representative: Boolean(scenario.representative),
      status: errors.length === 0 ? 'passed' : 'failed',
      errors,
      metrics: {
        manifestDigest,
        structureDigest: firstManifest.source.structureDigest,
        dressDigest: firstManifest.source.dressDigest,
        geometryDigest: firstGeometryDigest,
        buildings: firstManifest.buildings.length,
        vegetationInstances: firstManifest.vegetation.length,
        reusableMeshes: uniqueMeshes,
        geometryBytes,
        largestReusableMeshTrianglesByLod,
        expandedDrawTrianglesByLod: drawTrianglesByLod,
        portrait: {
          width: portrait.width,
          height: portrait.height,
          featureCoverage: coverage,
          frameOccupancyPermille,
          featureOccupancyPermille,
          ...colorMetrics,
          pngBytes: firstPng.length,
          pngSha256: sha256(firstPng),
        },
        glbBytes: firstGlb.length,
        glbSha256: sha256(firstGlb),
        privacyProbe: {
          sentinelExpected: scenario.audience === 'dm',
          manifestContainsSentinel,
          glbContainsSentinel,
          pngContainsSentinel,
        },
      },
    };
  } catch (error) {
    return {
      id: scenario.id,
      axes: {
        tier: scenario.tier,
        biome: scenario.biome,
        walls: scenario.walls,
        water: scenario.water,
        season: scenario.season,
        condition: scenario.condition,
        audience: scenario.audience,
      },
      representative: Boolean(scenario.representative),
      status: 'failed',
      errors: [{
        code: 'audit_exception',
        detail: safeErrorMessage(error),
      }],
      metrics: null,
    };
  }
}

/** Write one artifact atomically with owner-only permissions. */
function writeAtomic(path, bytes) {
  mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
  const temporary = `${path}.${process.pid}.tmp`;
  writeFileSync(temporary, bytes, { mode: 0o600 });
  renameSync(temporary, path);
}

/** @param {string} outputRoot @param {Record<string, unknown>} scenario */
function writeRepresentativeArtifacts(outputRoot, scenario) {
  const input = compileInputForScenario(scenario);
  const manifest = compileTownSceneManifest(input);
  const geometry = compileTownSceneGeometry(manifest);
  const png = encodeTownScenePortraitPng(
    manifest,
    geometry,
    REPRESENTATIVE_PNG_OPTIONS,
  );
  const glb = encodeTownSceneGlb(manifest, geometry, { lod: 2 });
  const rows = [
    { kind: 'cpu-reference-png', extension: 'png', bytes: png },
    { kind: 'portable-glb', extension: 'glb', bytes: glb },
  ];
  return rows.map((row) => {
    const path = resolve(outputRoot, `${scenario.id}.${row.extension}`);
    writeAtomic(path, row.bytes);
    return {
      caseId: scenario.id,
      kind: row.kind,
      path: relative(ROOT, path),
      bytes: row.bytes.length,
      sha256: sha256(row.bytes),
    };
  });
}

/**
 * Run the local matrix and optionally materialize representative artifacts.
 *
 * @param {{
 *   matrix?: ReadonlyArray<Record<string, unknown>>,
 *   outputRoot?: string,
 *   writeArtifacts?: boolean,
 *   requirePairwiseCoverage?: boolean,
 * }} [options]
 */
export function runTownSceneLocalMatrixAudit(options = {}) {
  const matrix = options.matrix || buildTownSceneAuditMatrix();
  const outputRoot = options.outputRoot || LOCAL_ARTIFACT_ROOT;
  const writeArtifacts = options.writeArtifacts !== false;
  const requirePairwiseCoverage = options.requirePairwiseCoverage !== false;
  const missingPairs = townSceneMatrixMissingPairs([...matrix]);
  const cases = matrix.map(auditTownSceneMatrixCase);
  const artifacts = writeArtifacts
    ? matrix
      .filter((scenario) => scenario.representative)
      .flatMap((scenario) => writeRepresentativeArtifacts(outputRoot, scenario))
    : [];
  const failedCases = cases.filter((entry) => entry.status !== 'passed');
  const report = {
    schemaVersion: 1,
    kind: 'town_scene_local_matrix_audit',
    evidenceClass: 'automated_local_deterministic_non_promotion',
    promotionEligible: false,
    promotionReason: (
      'CPU reference exports and js-domain checks do not prove production '
      + 'WebGL rendering, physical-device behavior, assistive-technology '
      + 'journeys, performance in the field, recognition, or human taste.'
    ),
    status: (
      failedCases.length === 0
      && (!requirePairwiseCoverage || missingPairs.length === 0)
    )
      ? 'passed'
      : 'failed',
    matrix: {
      strategy: 'deterministic_greedy_pairwise_with_authored_representatives',
      pairwiseCoverageRequired: requirePairwiseCoverage,
      axes: TOWN_SCENE_MATRIX_AXES,
      expectedPairCount: everyRequiredPair().size,
      missingPairs,
      caseCount: matrix.length,
      representativeCount: matrix.filter(
        (scenario) => scenario.representative,
      ).length,
    },
    budgetPolicy: {
      manifestTriangleBudgetMeaning: (
        'maximum triangles in one reusable mesh at the matching LOD'
      ),
      expandedDrawTriangleCeilingsByLod: LOCAL_DRAW_TRIANGLE_CEILINGS,
      byteCeilings: LOCAL_BYTE_CEILINGS,
    },
    summary: {
      passedCases: cases.length - failedCases.length,
      failedCases: failedCases.length,
      errorCount: failedCases.reduce(
        (total, entry) => total + entry.errors.length,
        0,
      ),
      playerLeakFailures: cases.filter((entry) => entry.errors.some(
        (error) => error.code === 'player_secret_leak',
      )).length,
    },
    artifacts,
    cases,
  };

  if (writeArtifacts) {
    writeAtomic(
      resolve(outputRoot, REPORT_NAME),
      `${JSON.stringify(report, null, 2)}\n`,
    );
  }
  return report;
}

function cliOption(argv, name, fallback) {
  const index = argv.indexOf(`--${name}`);
  return index >= 0 && argv[index + 1] ? argv[index + 1] : fallback;
}

function assertLocalArtifactPath(path) {
  if (
    path !== LOCAL_ARTIFACT_ROOT
    && !path.startsWith(`${LOCAL_ARTIFACT_ROOT}/`)
  ) {
    throw new Error(
      'TownScene local matrix output must remain below '
      + relative(ROOT, LOCAL_ARTIFACT_ROOT),
    );
  }
}

function main(argv) {
  const outputRoot = resolve(
    ROOT,
    cliOption(argv, 'out-dir', relative(ROOT, LOCAL_ARTIFACT_ROOT)),
  );
  assertLocalArtifactPath(outputRoot);
  const report = runTownSceneLocalMatrixAudit({ outputRoot });
  const reportPath = relative(ROOT, resolve(outputRoot, REPORT_NAME));
  process.stdout.write(
    `TownScene local matrix: ${report.status}; `
    + `${report.summary.passedCases}/${report.matrix.caseCount} cases passed; `
    + `report ${reportPath}\n`,
  );
  if (report.status !== 'passed') process.exitCode = 1;
}

if (
  process.argv[1]
  && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main(process.argv.slice(2));
}
