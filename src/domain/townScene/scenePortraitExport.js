/**
 * Deterministic CPU portrait renderer for complete settlement scenes.
 *
 * WebGL is the interactive presentation, not the export truth: driver, device,
 * antialiasing, and shader differences make GPU screenshots unsuitable as
 * golden artifacts. This fixed axonometric z-buffer renderer consumes the same
 * compiled geometry, material roles, AO, and crease topology and produces
 * byte-stable PNG input without requiring graphics hardware.
 */

import { encodePng } from '../../kernel/deterministicPng.js';
import { tone } from '../../kernel/toneCurve.js';
import { assertTownSceneManifest } from './manifestContract.js';
import { flattenTownSceneGeometry } from './sceneExportMesh.js';
import {
  resolveTownSceneExportMaterial,
  TOWN_SCENE_EXPORT_INK_ALBEDO,
} from './sceneExportPalette.js';

// A moderately elevated axonometric view keeps the canonical plan legible
// while retaining enough wall/building height for the diorama silhouette.
const VIEW_DIRECTION = normalize([0.62, -0.56, -0.66]);
/** @type {ScenePortraitVector} */
const VIEW_UP = [0, 1, 0];
const PORTRAIT_LIGHT_MODEL = normalize([-0.42, 0.50, 0.76]);
const AMBIENT = 0.42;
const DIFFUSE = 0.64;
// Roads and rivers are canonical surfaces, but their renderer-neutral meshes
// intentionally hug (or, for water, sit just below) the terrain datum. A small
// view-depth tolerance lets the portrait compose those co-planar surfaces in
// semantic order without moving a single canonical vertex.
const SURFACE_DEPTH_TOLERANCE_CM = 600;

const PRESENTATION_CLASS_CODE = /** @type {Readonly<Record<string, number>>} */ (
  Object.freeze({
    background: 0,
    ground: 1,
    water: 2,
    road: 3,
    building: 4,
    structure: 5,
    vegetation: 6,
    living: 7,
  })
);

const PRESENTATION_CLASS_NAME = Object.freeze([
  'background',
  'ground',
  'water',
  'road',
  'building',
  'structure',
  'vegetation',
  'living',
]);

// Only the three co-planar map surfaces participate in semantic overlap.
// Structures, vegetation, and living markers retain the ordinary z-test.
const SURFACE_ORDER_BY_CLASS = /** @type {Readonly<Record<number, number>>} */ (
  Object.freeze({
    [PRESENTATION_CLASS_CODE.ground]: 0,
    [PRESENTATION_CLASS_CODE.water]: 1,
    [PRESENTATION_CLASS_CODE.road]: 2,
  })
);

const INK_WEIGHT_BY_CLASS = /** @type {Readonly<Record<number, number>>} */ (
  Object.freeze({
    [PRESENTATION_CLASS_CODE.background]: 0,
    [PRESENTATION_CLASS_CODE.ground]: 0.08,
    [PRESENTATION_CLASS_CODE.water]: 0.54,
    [PRESENTATION_CLASS_CODE.road]: 0.52,
    [PRESENTATION_CLASS_CODE.building]: 1,
    [PRESENTATION_CLASS_CODE.structure]: 0.88,
    [PRESENTATION_CLASS_CODE.vegetation]: 0.46,
    [PRESENTATION_CLASS_CODE.living]: 1,
  })
);

/**
 * @typedef {[number, number, number]} ScenePortraitVector
 * @typedef {Record<string, unknown>} ScenePortraitRecord
 * @typedef {ReturnType<typeof flattenTownSceneGeometry>} TownSceneExportMesh
 * @typedef {ReturnType<typeof resolveTownSceneExportMaterial>} SceneExportMaterial
 * @typedef {{ min: number[], max: number[] }} ScenePortraitBounds
 * @typedef {{
 *   bufferWidth: number,
 *   bufferHeight: number,
 *   screenX: Float64Array,
 *   screenY: Float64Array,
 *   depth: Float64Array,
 * }} ScenePortraitProjection
 * @typedef {{
 *   background: number,
 *   ground: number,
 *   water: number,
 *   road: number,
 *   building: number,
 *   structure: number,
 *   vegetation: number,
 *   living: number,
 * }} ScenePortraitFeatureCoverage
 * @typedef {{
 *   width?: number,
 *   height?: number,
 *   supersample?: number,
 *   margin?: number,
 *   lod?: 0|1|2,
 *   includeInk?: boolean,
 * }} TownScenePortraitOptions
 */

/**
 * @param {ScenePortraitVector} vector
 * @returns {ScenePortraitVector}
 */
function normalize(vector) {
  const magnitude = Math.sqrt(
    vector[0] * vector[0]
    + vector[1] * vector[1]
    + vector[2] * vector[2],
  ) || 1;
  return [
    vector[0] / magnitude,
    vector[1] / magnitude,
    vector[2] / magnitude,
  ];
}

/**
 * @param {ScenePortraitVector} a
 * @param {ScenePortraitVector} b
 * @returns {ScenePortraitVector}
 */
function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

/**
 * @param {unknown} value
 * @param {number} fallback
 * @param {number} minimum
 * @param {number} maximum
 */
function clampInteger(value, fallback, minimum, maximum) {
  const number = typeof value === 'number' && Number.isFinite(value)
    ? Math.round(value)
    : fallback;
  return Math.max(minimum, Math.min(maximum, number));
}

/** @param {unknown} value @returns {ScenePortraitRecord} */
function record(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {ScenePortraitRecord} */ (value)
    : {};
}

function projectionBasis() {
  const right = normalize(cross(VIEW_UP, VIEW_DIRECTION));
  return {
    right,
    up: normalize(cross(VIEW_DIRECTION, right)),
    direction: VIEW_DIRECTION,
  };
}

/**
 * Frame the inhabited footprint rather than the full 0..1000 terrain tile.
 * Roads and terrain still render outside this box and naturally clip at the
 * plate edge; they no longer reduce a city to a thumbnail inside empty land.
 * @param {ScenePortraitRecord} manifest
 * @param {TownSceneExportMesh} mesh
 * @returns {ScenePortraitBounds}
 */
function portraitFramingBounds(manifest, mesh) {
  const planUnitCm = Number(record(manifest.space).planUnitCm) || 30;
  let minimumX = Infinity;
  let maximumX = -Infinity;
  let minimumZ = Infinity;
  let maximumZ = -Infinity;
  /** @param {unknown} point */
  const include = (point) => {
    if (!Array.isArray(point) || point.length < 2) return;
    const x = Number(point[0]);
    const z = Number(point[1]);
    if (!Number.isFinite(x) || !Number.isFinite(z)) return;
    minimumX = Math.min(minimumX, x);
    maximumX = Math.max(maximumX, x);
    minimumZ = Math.min(minimumZ, z);
    maximumZ = Math.max(maximumZ, z);
  };
  for (const districtValue of Array.isArray(manifest.districts) ? manifest.districts : []) {
    const district = record(districtValue);
    for (const point of Array.isArray(district.footprint) ? district.footprint : []) {
      include(point);
    }
  }
  for (const wallValue of Array.isArray(manifest.walls) ? manifest.walls : []) {
    const wall = record(wallValue);
    for (const point of Array.isArray(wall.centerline) ? wall.centerline : []) {
      include(point);
    }
  }
  for (const buildingValue of Array.isArray(manifest.buildings) ? manifest.buildings : []) {
    const building = record(buildingValue);
    for (const point of Array.isArray(building.footprint) ? building.footprint : []) {
      include(point);
    }
  }
  if (![minimumX, maximumX, minimumZ, maximumZ].every(Number.isFinite)) {
    return { min: mesh.min, max: mesh.max };
  }
  const span = Math.max(maximumX - minimumX, maximumZ - minimumZ, 1);
  // The deterministic portrait is a settlement portrait, not a survey of the
  // entire 0..1000 terrain tile. A restrained gutter keeps walls and outer
  // roofs readable without shrinking the inhabited composition into the
  // center of an otherwise empty plate.
  const padding = Math.max(32, span * 0.07);
  return {
    min: [
      Math.max(0, minimumX - padding) * planUnitCm,
      mesh.min[1],
      Math.max(0, minimumZ - padding) * planUnitCm,
    ],
    max: [
      Math.min(1000, maximumX + padding) * planUnitCm,
      mesh.max[1],
      Math.min(1000, maximumZ + padding) * planUnitCm,
    ],
  };
}

/**
 * @param {TownSceneExportMesh} mesh
 * @param {ScenePortraitBounds} framingBounds
 * @param {number} width
 * @param {number} height
 * @param {number} supersample
 * @param {number} margin
 * @returns {ScenePortraitProjection}
 */
function projectedVertices(mesh, framingBounds, width, height, supersample, margin) {
  const bufferWidth = width * supersample;
  const bufferHeight = height * supersample;
  const { right, up, direction } = projectionBasis();
  const center = [
    (framingBounds.min[0] + framingBounds.max[0]) / 2,
    (framingBounds.min[1] + framingBounds.max[1]) / 2,
    (framingBounds.min[2] + framingBounds.max[2]) / 2,
  ];
  const screenX = new Float64Array(mesh.vertexCount);
  const screenY = new Float64Array(mesh.vertexCount);
  const depth = new Float64Array(mesh.vertexCount);
  let minimumX = Infinity;
  let maximumX = -Infinity;
  let minimumY = Infinity;
  let maximumY = -Infinity;

  for (let index = 0; index < mesh.vertexCount; index++) {
    const offset = index * 3;
    const dx = mesh.positions[offset] - center[0];
    const dy = mesh.positions[offset + 1] - center[1];
    const dz = mesh.positions[offset + 2] - center[2];
    const x = dx * right[0] + dy * right[1] + dz * right[2];
    const y = dx * up[0] + dy * up[1] + dz * up[2];
    screenX[index] = x;
    screenY[index] = y;
    // VIEW_DIRECTION points from camera into the scene. Smaller dot products
    // are therefore nearer the camera and win the conventional `<` z-test.
    depth[index] = dx * direction[0] + dy * direction[1] + dz * direction[2];
  }
  for (const x of [framingBounds.min[0], framingBounds.max[0]]) {
    for (const y of [framingBounds.min[1], framingBounds.max[1]]) {
      for (const z of [framingBounds.min[2], framingBounds.max[2]]) {
        const dx = x - center[0];
        const dy = y - center[1];
        const dz = z - center[2];
        const projectedX = dx * right[0] + dy * right[1] + dz * right[2];
        const projectedY = dx * up[0] + dy * up[1] + dz * up[2];
        minimumX = Math.min(minimumX, projectedX);
        maximumX = Math.max(maximumX, projectedX);
        minimumY = Math.min(minimumY, projectedY);
        maximumY = Math.max(maximumY, projectedY);
      }
    }
  }

  const marginPixels = margin * supersample;
  const spanX = maximumX - minimumX || 1;
  const spanY = maximumY - minimumY || 1;
  const usableWidth = Math.max(1, bufferWidth - marginPixels * 2);
  const usableHeight = Math.max(1, bufferHeight - marginPixels * 2);
  const scale = Math.min(usableWidth / spanX, usableHeight / spanY);
  const offsetX = marginPixels - minimumX * scale + (usableWidth - spanX * scale) / 2;
  const offsetY = marginPixels - minimumY * scale + (usableHeight - spanY * scale) / 2;
  for (let index = 0; index < mesh.vertexCount; index++) {
    screenX[index] = screenX[index] * scale + offsetX;
    screenY[index] = bufferHeight - (screenY[index] * scale + offsetY);
  }
  return {
    bufferWidth,
    bufferHeight,
    screenX,
    screenY,
    depth,
  };
}

/**
 * @param {ScenePortraitRecord} manifest
 * @param {Float32Array} buffer
 * @param {number} width
 * @param {number} height
 */
function paintBackground(manifest, buffer, width, height) {
  const top = resolveTownSceneExportMaterial(manifest, 'skyTop').color;
  const bottom = resolveTownSceneExportMaterial(manifest, 'skyBottom').color;
  for (let y = 0; y < height; y++) {
    const amount = height > 1 ? y / (height - 1) : 0;
    const red = top[0] + (bottom[0] - top[0]) * amount;
    const green = top[1] + (bottom[1] - top[1]) * amount;
    const blue = top[2] + (bottom[2] - top[2]) * amount;
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * 3;
      buffer[offset] = red;
      buffer[offset + 1] = green;
      buffer[offset + 2] = blue;
    }
  }
}

/**
 * @param {string} presentationClass
 */
function presentationClassCode(presentationClass) {
  return PRESENTATION_CLASS_CODE[presentationClass]
    || PRESENTATION_CLASS_CODE.structure;
}

/**
 * Semantic ordering is deliberately limited to surfaces whose authored meshes
 * share the terrain datum. The tolerance is smaller than a storey, so a road
 * or river can never punch through a canonical wall or roof. The six-metre
 * bound covers the shallow terrain datum plus axonometric interpolation error,
 * while remaining tiny beside settlement-scale feature separation.
 *
 * @param {number} incomingClass
 * @param {number} existingClass
 * @param {number} incomingDepth
 * @param {number} existingDepth
 */
function surfacePresentationWins(
  incomingClass,
  existingClass,
  incomingDepth,
  existingDepth,
) {
  const incomingOrder = SURFACE_ORDER_BY_CLASS[incomingClass];
  const existingOrder = SURFACE_ORDER_BY_CLASS[existingClass];
  if (incomingOrder == null || existingOrder == null) {
    return incomingDepth < existingDepth;
  }
  if (
    Math.abs(incomingDepth - existingDepth)
    > SURFACE_DEPTH_TOLERANCE_CM
  ) {
    return incomingDepth < existingDepth;
  }
  return incomingOrder >= existingOrder;
}

/**
 * @param {Uint8Array} presentationBuffer
 * @returns {ScenePortraitFeatureCoverage}
 */
function featureCoverage(presentationBuffer) {
  const counts = new Uint32Array(PRESENTATION_CLASS_NAME.length);
  for (const code of presentationBuffer) counts[code] += 1;
  return /** @type {ScenePortraitFeatureCoverage} */ (
    Object.fromEntries(
      PRESENTATION_CLASS_NAME.map((name, code) => [name, counts[code]]),
    )
  );
}

/**
 * @param {ScenePortraitRecord} manifest
 * @param {TownSceneExportMesh} mesh
 * @param {ScenePortraitProjection} projection
 * @param {Float32Array} colorBuffer
 * @param {Float32Array} depthBuffer
 * @param {Uint8Array} presentationBuffer
 */
function rasterizeTriangles(
  manifest,
  mesh,
  projection,
  colorBuffer,
  depthBuffer,
  presentationBuffer,
) {
  const { bufferWidth, bufferHeight, screenX, screenY, depth } = projection;
  /** @type {Map<string, SceneExportMaterial>} */
  const materialCache = new Map();
  /** @param {string} materialId @returns {SceneExportMaterial} */
  const materialFor = (materialId) => {
    if (!materialCache.has(materialId)) {
      materialCache.set(
        materialId,
        resolveTownSceneExportMaterial(manifest, materialId),
      );
    }
    return /** @type {SceneExportMaterial} */ (materialCache.get(materialId));
  };

  for (let triangle = 0; triangle < mesh.indices.length / 3; triangle++) {
    const ia = mesh.indices[triangle * 3];
    const ib = mesh.indices[triangle * 3 + 1];
    const ic = mesh.indices[triangle * 3 + 2];
    const ax = screenX[ia];
    const ay = screenY[ia];
    const bx = screenX[ib];
    const by = screenY[ib];
    const cx = screenX[ic];
    const cy = screenY[ic];
    const area = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
    if (area === 0) continue;

    const material = materialFor(
      mesh.triangleMaterialIds[triangle] || 'material:ground',
    );
    const classCode = presentationClassCode(material.presentationClass);
    const normalOffset = ia * 3;
    let nx = mesh.normals[normalOffset];
    let ny = mesh.normals[normalOffset + 1];
    let nz = mesh.normals[normalOffset + 2];
    const facing = (
      nx * VIEW_DIRECTION[0]
      + ny * VIEW_DIRECTION[1]
      + nz * VIEW_DIRECTION[2]
    );
    const doubleSidedSurface = material.presentationClass === 'water'
      || material.presentationClass === 'road';
    if (facing > 0 && !doubleSidedSurface) continue;
    if (facing > 0) {
      nx = -nx;
      ny = -ny;
      nz = -nz;
    }
    const light = Math.max(
      0,
      nx * PORTRAIT_LIGHT_MODEL[0]
        + ny * PORTRAIT_LIGHT_MODEL[1]
        + nz * PORTRAIT_LIGHT_MODEL[2],
    );
    const illumination = material.presentationClass === 'water'
      ? 0.94
      : material.presentationClass === 'ground'
        ? 0.62 + light * 0.34
        : material.presentationClass === 'road'
          ? 0.72 + light * 0.26
          : AMBIENT + DIFFUSE * light;
    const [red, green, blue, alpha] = material.color;

    const minimumX = Math.max(0, Math.floor(Math.min(ax, bx, cx)));
    const maximumX = Math.min(bufferWidth - 1, Math.ceil(Math.max(ax, bx, cx)));
    const minimumY = Math.max(0, Math.floor(Math.min(ay, by, cy)));
    const maximumY = Math.min(bufferHeight - 1, Math.ceil(Math.max(ay, by, cy)));
    const inverseArea = 1 / area;
    for (let y = minimumY; y <= maximumY; y++) {
      for (let x = minimumX; x <= maximumX; x++) {
        const pointX = x + 0.5;
        const pointY = y + 0.5;
        const weightA = (
          (bx - pointX) * (cy - pointY)
          - (by - pointY) * (cx - pointX)
        ) * inverseArea;
        const weightB = (
          (cx - pointX) * (ay - pointY)
          - (cy - pointY) * (ax - pointX)
        ) * inverseArea;
        const weightC = 1 - weightA - weightB;
        if (weightA < 0 || weightB < 0 || weightC < 0) continue;
        const sampleDepth = weightA * depth[ia]
          + weightB * depth[ib]
          + weightC * depth[ic];
        const pixel = y * bufferWidth + x;
        if (!surfacePresentationWins(
          classCode,
          presentationBuffer[pixel],
          sampleDepth,
          depthBuffer[pixel],
        )) continue;
        depthBuffer[pixel] = sampleDepth;
        presentationBuffer[pixel] = classCode;
        const occlusion = weightA * mesh.ao[ia]
          + weightB * mesh.ao[ib]
          + weightC * mesh.ao[ic];
        const shade = illumination * Math.max(0.28, Math.min(1, occlusion));
        const tintRed = weightA * mesh.tints[ia * 3]
          + weightB * mesh.tints[ib * 3]
          + weightC * mesh.tints[ic * 3];
        const tintGreen = weightA * mesh.tints[ia * 3 + 1]
          + weightB * mesh.tints[ib * 3 + 1]
          + weightC * mesh.tints[ic * 3 + 1];
        const tintBlue = weightA * mesh.tints[ia * 3 + 2]
          + weightB * mesh.tints[ib * 3 + 2]
          + weightC * mesh.tints[ic * 3 + 2];
        const offset = pixel * 3;
        const opacity = material.water ? alpha : 1;
        colorBuffer[offset] = red * tintRed * shade * opacity
          + colorBuffer[offset] * (1 - opacity);
        colorBuffer[offset + 1] = green * tintGreen * shade * opacity
          + colorBuffer[offset + 1] * (1 - opacity);
        colorBuffer[offset + 2] = blue * tintBlue * shade * opacity
          + colorBuffer[offset + 2] * (1 - opacity);
      }
    }
  }
}

/**
 * @param {TownSceneExportMesh} mesh
 * @param {ScenePortraitProjection} projection
 * @param {Float32Array} colorBuffer
 * @param {Float32Array} depthBuffer
 * @param {Uint8Array} presentationBuffer
 */
function rasterizeCreaseInk(
  mesh,
  projection,
  colorBuffer,
  depthBuffer,
  presentationBuffer,
) {
  const { bufferWidth, bufferHeight, screenX, screenY, depth } = projection;
  const ink = TOWN_SCENE_EXPORT_INK_ALBEDO;
  const diagonalX = mesh.max[0] - mesh.min[0];
  const diagonalY = mesh.max[1] - mesh.min[1];
  const diagonalZ = mesh.max[2] - mesh.min[2];
  const diagonal = Math.sqrt(
    diagonalX * diagonalX
    + diagonalY * diagonalY
    + diagonalZ * diagonalZ,
  );
  const depthBias = Math.max(0.75, diagonal / 20000);
  for (let edge = 0; edge < mesh.creaseEdges.length; edge += 2) {
    const a = mesh.creaseEdges[edge];
    const b = mesh.creaseEdges[edge + 1];
    const x0 = screenX[a];
    const y0 = screenY[a];
    const x1 = screenX[b];
    const y1 = screenY[b];
    const steps = Math.max(
      1,
      Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))),
    );
    for (let step = 0; step <= steps; step++) {
      const amount = step / steps;
      const x = Math.round(x0 + (x1 - x0) * amount);
      const y = Math.round(y0 + (y1 - y0) * amount);
      if (x < 0 || x >= bufferWidth || y < 0 || y >= bufferHeight) continue;
      const sampleDepth = depth[a] + (depth[b] - depth[a]) * amount;
      const pixel = y * bufferWidth + x;
      if (sampleDepth > depthBuffer[pixel] + depthBias) continue;
      const offset = pixel * 3;
      const inkWeight = INK_WEIGHT_BY_CLASS[presentationBuffer[pixel]] || 0;
      const alpha = ink[3] * inkWeight;
      colorBuffer[offset] = colorBuffer[offset] * (1 - alpha) + ink[0] * alpha;
      colorBuffer[offset + 1] = colorBuffer[offset + 1] * (1 - alpha)
        + ink[1] * alpha;
      colorBuffer[offset + 2] = colorBuffer[offset + 2] * (1 - alpha)
        + ink[2] * alpha;
    }
  }
}

/**
 * Give the finite terrain plate a restrained diorama drop shadow. The mask is
 * derived solely from already-rasterized canonical ground/water/road pixels;
 * it cannot imply a building, district, or condition that is not in the scene.
 *
 * @param {Float32Array} colorBuffer
 * @param {Uint8Array} presentationBuffer
 * @param {number} width
 * @param {number} height
 */
function paintPlateDropShadow(
  colorBuffer,
  presentationBuffer,
  width,
  height,
) {
  const scale = Math.max(1, Math.round(Math.min(width, height) / 300));
  const passes = [
    { dx: scale, dy: scale * 2, alpha: 0.055 },
    { dx: scale * 2, dy: scale * 4, alpha: 0.035 },
  ];
  const shadowAlpha = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const source = y * width + x;
      const classCode = presentationBuffer[source];
      if (
        classCode < PRESENTATION_CLASS_CODE.ground
        || classCode > PRESENTATION_CLASS_CODE.road
      ) continue;
      for (const pass of passes) {
        const targetX = x + pass.dx;
        const targetY = y + pass.dy;
        if (targetX >= width || targetY >= height) continue;
        const target = targetY * width + targetX;
        if (presentationBuffer[target] !== PRESENTATION_CLASS_CODE.background) {
          continue;
        }
        shadowAlpha[target] = Math.max(shadowAlpha[target], pass.alpha);
      }
    }
  }
  for (let pixel = 0; pixel < shadowAlpha.length; pixel++) {
    const alpha = shadowAlpha[pixel];
    if (alpha === 0) continue;
    const offset = pixel * 3;
    colorBuffer[offset] *= 1 - alpha;
    colorBuffer[offset + 1] *= 1 - alpha;
    colorBuffer[offset + 2] *= 1 - alpha;
  }
}

/**
 * @param {Float32Array} colorBuffer
 * @param {number} width
 * @param {number} height
 * @param {number} supersample
 * @returns {Uint8Array}
 */
function downsample(colorBuffer, width, height, supersample) {
  const bufferWidth = width * supersample;
  const rgb = new Uint8Array(width * height * 3);
  const divisor = supersample * supersample;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let red = 0;
      let green = 0;
      let blue = 0;
      for (let sy = 0; sy < supersample; sy++) {
        for (let sx = 0; sx < supersample; sx++) {
          const source = (
            ((y * supersample + sy) * bufferWidth)
            + x * supersample
            + sx
          ) * 3;
          red += colorBuffer[source];
          green += colorBuffer[source + 1];
          blue += colorBuffer[source + 2];
        }
      }
      const target = (y * width + x) * 3;
      rgb[target] = tone(red / divisor);
      rgb[target + 1] = tone(green / divisor);
      rgb[target + 2] = tone(blue / divisor);
    }
  }
  return rgb;
}

/**
 * Render RGB bytes for inspection or an alternate deterministic container.
 * @param {unknown} manifestValue
 * @param {unknown} bundle
 * @param {TownScenePortraitOptions} [options]
 */
export function renderTownScenePortrait(manifestValue, bundle, options = {}) {
  const manifest = assertTownSceneManifest(manifestValue);
  const width = clampInteger(options.width, 1200, 64, 2400);
  const height = clampInteger(options.height, Math.round(width * 0.75), 64, 1800);
  const supersample = clampInteger(options.supersample, 1, 1, 2);
  const margin = clampInteger(options.margin, 56, 8, 240);
  const mesh = flattenTownSceneGeometry(manifest, bundle, {
    lod: options.lod ?? 2,
  });
  const framingBounds = portraitFramingBounds(manifest, mesh);
  const projection = projectedVertices(
    mesh,
    framingBounds,
    width,
    height,
    supersample,
    margin,
  );
  const colorBuffer = new Float32Array(
    projection.bufferWidth * projection.bufferHeight * 3,
  );
  const depthBuffer = new Float32Array(
    projection.bufferWidth * projection.bufferHeight,
  );
  const presentationBuffer = new Uint8Array(
    projection.bufferWidth * projection.bufferHeight,
  );
  depthBuffer.fill(Infinity);
  paintBackground(
    manifest,
    colorBuffer,
    projection.bufferWidth,
    projection.bufferHeight,
  );
  rasterizeTriangles(
    manifest,
    mesh,
    projection,
    colorBuffer,
    depthBuffer,
    presentationBuffer,
  );
  paintPlateDropShadow(
    colorBuffer,
    presentationBuffer,
    projection.bufferWidth,
    projection.bufferHeight,
  );
  if (options.includeInk !== false) {
    rasterizeCreaseInk(
      mesh,
      projection,
      colorBuffer,
      depthBuffer,
      presentationBuffer,
    );
  }
  return {
    width,
    height,
    rgb: downsample(colorBuffer, width, height, supersample),
    manifestDigest: mesh.manifestDigest,
    featureCoverage: featureCoverage(presentationBuffer),
  };
}

/**
 * Render and encode a byte-reproducible PNG.
 * @param {unknown} manifest
 * @param {unknown} bundle
 * @param {TownScenePortraitOptions} [options]
 * @returns {Uint8Array}
 */
export function encodeTownScenePortraitPng(manifest, bundle, options = {}) {
  const portrait = renderTownScenePortrait(manifest, bundle, options);
  return encodePng(portrait.width, portrait.height, portrait.rgb);
}
