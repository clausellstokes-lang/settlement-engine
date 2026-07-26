/**
 * Imperative Three runtime for the settlement portrait.
 *
 * React owns product state; this module owns GPU objects and frame state. It
 * receives Three and OrbitControls as arguments so importing this source never
 * pulls the renderer into an eager graph.
 */
import {
  CARD_ALT,
  GOLD,
  GOLD_SOFT,
  INK,
  PARCH,
  SECOND,
} from '../../theme.js';
import {
  addTownSceneLivingMarkers,
  townSceneConditionTint,
} from './townSceneLivingPresentation.js';
import {
  createTownSceneBufferGeometry,
  finiteTownSceneVector,
  refreshTownSceneInstanceBounds,
  townSceneGeometryBounds,
  townSceneSemanticForFace,
  townSceneSemanticRangeCenter,
} from './townSceneRuntimeGeometry.js';
import {
  createTownSceneMaterial,
  townSceneMaterialIdForRole,
} from './townSceneRuntimeMaterials.js';
import {
  DEFAULT_TOWN_SCENE_QUALITY,
  disposeTownSceneRenderer,
  townSceneDefaultCameraPreset,
  townSceneLodForProjectedPixels,
} from './townSceneRuntimePolicy.js';

export {
  refreshTownSceneInstanceBounds,
} from './townSceneRuntimeGeometry.js';
export {
  townSceneAoShade,
  townSceneMaterialIdForRole,
  townSceneSeasonalMaterialColor,
} from './townSceneRuntimeMaterials.js';
export {
  disposeTownSceneRenderer,
  townSceneDefaultCameraPreset,
  townSceneLodForProjectedPixels,
} from './townSceneRuntimePolicy.js';

const TAU = Math.PI * 2;

/**
 * Resolve an instanced color without changing the base material for neutral
 * neighbors. Three allocates a black-filled color buffer on the first
 * `setColorAt`; groups that use any condition tint must therefore write white
 * for every untinted slot.
 *
 * @template T
 * @param {T|null|undefined} tint
 * @param {boolean} groupHasInstanceTints
 * @param {T} neutralColor
 * @returns {T|null}
 */
export function townSceneInstanceColorFor(
  tint,
  groupHasInstanceTints,
  neutralColor,
) {
  if (!groupHasInstanceTints) return null;
  return tint || neutralColor;
}

/**
 * @param {{
 *  THREE:any, OrbitControls:any, canvas:HTMLCanvasElement, manifest:any, geometry:any,
 *  quality?:any, reducedMotion?:boolean, onPick?:(sceneId:string|null)=>void,
 *  onCameraInteraction?:()=>void,
 * }} input
 */
export function createTownSceneRuntime(input) {
  const {
    THREE,
    OrbitControls,
    canvas,
    manifest,
    geometry,
    reducedMotion = false,
    onPick,
    onCameraInteraction,
  } = input;
  let quality = { ...DEFAULT_TOWN_SCENE_QUALITY, ...(input.quality || {}) };
  let selectedSceneId = null;
  let running = false;
  let paused = false;
  let animationFrame = 0;
  let cameraAnimation = 0;
  const bounds = townSceneGeometryBounds(geometry);
  const atmosphere = manifest?.living?.atmosphere || {};
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(CARD_ALT);
  scene.fog = new THREE.Fog(CARD_ALT, bounds.diagonal * 1.3, bounds.diagonal * 3.5);

  const camera = new THREE.PerspectiveCamera(38, 1, Math.max(1, bounds.diagonal / 2000), bounds.diagonal * 12);
  camera.up.set(0, 1, 0);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });
  if ('outputColorSpace' in renderer && THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
  if ('toneMapping' in renderer && THREE.ACESFilmicToneMapping != null) {
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
  }
  renderer.shadowMap.enabled = Boolean(quality.contactShadows);
  if (THREE.PCFSoftShadowMap != null) renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const hemisphere = new THREE.HemisphereLight(PARCH, SECOND, 1.55);
  hemisphere.name = 'settlement-hemi';
  scene.add(hemisphere);
  const sun = new THREE.DirectionalLight(GOLD_SOFT, 2.15);
  sun.name = 'settlement-sun';
  sun.intensity = atmosphere.besieged ? 1.78 : 2.15;
  sun.position.set(
    bounds.center[0] - bounds.diagonal * 0.7,
    bounds.center[1] + bounds.diagonal * 1.2,
    bounds.center[2] + bounds.diagonal * 0.55,
  );
  sun.target.position.set(...bounds.center);
  sun.castShadow = Boolean(quality.contactShadows);
  const shadowSpan = bounds.diagonal * 0.65;
  Object.assign(sun.shadow.camera, {
    left: -shadowSpan,
    right: shadowSpan,
    top: shadowSpan,
    bottom: -shadowSpan,
    near: 1,
    far: bounds.diagonal * 3,
  });
  sun.shadow.mapSize.set(1024, 1024);
  scene.add(sun, sun.target);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = !reducedMotion;
  controls.dampingFactor = 0.08;
  controls.screenSpacePanning = true;
  controls.minDistance = Math.max(20, bounds.diagonal * 0.08);
  controls.maxDistance = bounds.diagonal * 4.5;
  controls.maxPolarAngle = Math.PI * 0.49;
  controls.minPolarAngle = Math.PI * 0.06;
  controls.target.set(...bounds.center);
  const handleControlStart = () => onCameraInteraction?.();
  controls.addEventListener('start', handleControlStart);

  /** @type {Map<string, any>} */
  const materials = new Map();
  const materialDefinitions = new Map(
    (manifest?.materials || []).map((definition) => [definition.id, definition]),
  );
  /** @type {Map<string, any>} */
  const templateGeometries = new Map();
  /** @type {Map<string, any>} */
  const templateRecords = new Map();
  /** @type {Map<string, any>} */
  const semanticPositions = new Map();
  /** @type {any[]} */
  const pickables = [];
  /** @type {any[]} */
  const inkObjects = [];
  /** @type {any[]} */
  const instancedObjects = [];
  const ownedGeometries = new Set();
  // Three initializes a newly-created instanceColor buffer to black. If only
  // condition-affected buildings received explicit colors, every unaffected
  // neighbor sharing that draw call would therefore render black. Supply white
  // for neutral instances whenever a group uses condition tinting so the base
  // material remains unchanged.
  const neutralInstanceColor = new THREE.Color(0xffffff);

  const getMaterial = (materialId, kind) => {
    const key = `${materialId || 'default'}:${kind || 'mesh'}`;
    if (!materials.has(key)) {
      materials.set(
        key,
        createTownSceneMaterial(
          THREE,
          materialId,
          kind,
          materialDefinitions.get(materialId),
          atmosphere,
        ),
      );
    }
    return materials.get(key);
  };

  const materialForRole = (skinMaterialId, role, explicitMaterialId) => {
    const skin = materialDefinitions.get(skinMaterialId);
    return townSceneMaterialIdForRole(skin, role, explicitMaterialId, skinMaterialId);
  };

  const materialsForRecord = (record, bufferGeometry, skinMaterialId, kind) => {
    const ranges = record.roleRanges || record.materialRanges || [];
    if (!ranges.length) return getMaterial(skinMaterialId, kind);
    bufferGeometry.clearGroups();
    const resolved = [];
    for (let index = 0; index < ranges.length; index++) {
      const range = ranges[index];
      const roleMaterialId = materialForRole(
        skinMaterialId,
        range.role,
        range.materialId,
      );
      bufferGeometry.addGroup(range.start, range.count, index);
      resolved.push(getMaterial(roleMaterialId, range.role || kind));
    }
    return resolved;
  };

  const addInk = (record, parentMatrix = null) => {
    if (!record.creaseEdges?.length) return;
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = record.positions instanceof Float32Array
      ? record.positions.slice()
      : Float32Array.from(record.positions || []);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineIndices = record.creaseEdges instanceof Uint32Array
      ? record.creaseEdges.slice()
      : Uint32Array.from(record.creaseEdges);
    lineGeometry.setIndex(new THREE.BufferAttribute(lineIndices, 1));
    const lineMaterial = new THREE.LineBasicMaterial({
      color: INK,
      transparent: true,
      opacity: 0.48,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    lines.name = `ink:${record.id}`;
    lines.renderOrder = 2;
    lines.visible = Boolean(quality.creaseInk);
    if (parentMatrix) {
      lines.matrixAutoUpdate = false;
      lines.matrix.copy(parentMatrix);
    }
    lines.userData.townSceneInk = true;
    scene.add(lines);
    inkObjects.push(lines);
    ownedGeometries.add(lineGeometry);
    materials.set(`ink:${record.id}`, lineMaterial);
  };

  for (const batch of geometry?.batches || []) {
    if (!batch?.positions?.length) continue;
    const batchGeometry = createTownSceneBufferGeometry(THREE, batch);
    ownedGeometries.add(batchGeometry);
    const mesh = new THREE.Mesh(
      batchGeometry,
      materialsForRecord(batch, batchGeometry, batch.materialId, batch.kind),
    );
    mesh.name = `batch:${batch.id}`;
    mesh.userData.semanticRanges = batch.semanticRanges || [];
    mesh.userData.lod = batch.lod || 0;
    mesh.userData.townScenePickable = mesh.userData.semanticRanges.length > 0;
    mesh.castShadow = !['terrain', 'ground', 'water', 'road', 'street'].includes(batch.kind);
    mesh.receiveShadow = batch.kind !== 'water';
    scene.add(mesh);
    if (mesh.userData.townScenePickable) pickables.push(mesh);
    for (const center of batch.semanticCenters || []) {
      if (center?.semanticId && Array.isArray(center.position)) {
        semanticPositions.set(
          center.semanticId,
          new THREE.Vector3(...finiteTownSceneVector(center.position)),
        );
      }
    }
    for (const range of mesh.userData.semanticRanges) {
      if (semanticPositions.has(range.semanticId)) continue;
      const center = townSceneSemanticRangeCenter(batch, range);
      if (center) semanticPositions.set(range.semanticId, new THREE.Vector3(...center));
    }
    addInk(batch);
  }

  for (const template of geometry?.templates || []) {
    if (!template?.positions?.length) continue;
    const templateGeometry = createTownSceneBufferGeometry(THREE, template);
    templateGeometries.set(template.id, templateGeometry);
    templateRecords.set(template.id, template);
    ownedGeometries.add(templateGeometry);
  }

  const instanceGroups = new Map();
  const conditionProfileBySemantic = new Map(
    (manifest?.buildings || []).map((building) => [
      building.semanticId,
      building.conditionProfile,
    ]),
  );
  for (const instance of geometry?.instances || []) {
    const explicitLods = instance.templateIdsByLod && typeof instance.templateIdsByLod === 'object'
      ? Object.entries(instance.templateIdsByLod)
        .map(([lod, templateId]) => [Number(lod), templateId])
        .filter(([lod, templateId]) => Number.isInteger(lod) && typeof templateId === 'string')
      : [];
    const available = explicitLods.length
      ? explicitLods
      : [[Number.isInteger(instance.lod) ? instance.lod : 0, instance.templateId]];
    const availableLods = available.map(([lod]) => lod).sort((a, b) => a - b);
    for (const [templateLod, templateId] of available) {
      const expanded = {
        ...instance,
        templateId,
        templateLod,
        availableLods,
      };
      const key = [
        templateId,
        instance.materialId || 'default',
        instance.kind || 'building',
        templateLod,
      ].join(':');
      if (!instanceGroups.has(key)) instanceGroups.set(key, []);
      instanceGroups.get(key).push(expanded);
    }
  }
  const headingDenominator = Math.max(1, manifest?.space?.headingTurnDenominator || 16);
  for (const records of instanceGroups.values()) {
    const first = records[0];
    const template = templateGeometries.get(first.templateId);
    const templateRecord = templateRecords.get(first.templateId);
    if (!template) continue;
    const mesh = new THREE.InstancedMesh(
      template,
      materialsForRecord(templateRecord || {}, template, first.materialId, first.kind),
      records.length,
    );
    mesh.name = `instances:${first.templateId}:${first.materialId || 'default'}`;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.allInstances = records.map((record) => {
      const position = finiteTownSceneVector(record.position);
      const scale = finiteTownSceneVector(record.scale, [1, 1, 1]);
      const yaw = (Number(record.yawStep) || 0) * TAU / headingDenominator;
      const matrix = new THREE.Matrix4();
      matrix.compose(
        new THREE.Vector3(...position),
        new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw),
        new THREE.Vector3(...scale),
      );
      semanticPositions.set(record.semanticId, new THREE.Vector3(...position));
      const conditionTint = record.kind === 'building'
        ? townSceneConditionTint(conditionProfileBySemantic.get(record.semanticId))
        : null;
      return {
        record,
        matrix,
        position: new THREE.Vector3(...position),
        tint: conditionTint
          ? new THREE.Color().setRGB(...conditionTint)
          : null,
      };
    });
    mesh.userData.visibleInstances = mesh.userData.allInstances;
    mesh.userData.hasInstanceTints = mesh.userData.allInstances.some((item) => item.tint);
    mesh.userData.townSceneInstanced = true;
    mesh.userData.templateLod = first.templateLod || 0;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(mesh);
    pickables.push(mesh);
    instancedObjects.push(mesh);

    // LineSegments has no InstancedMesh counterpart. Keep the illustrated
    // crease treatment to one draw per template/material/LOD group by
    // consolidating the transformed visible edges into a dynamic buffer.
    if (templateRecord?.creaseEdges?.length) {
      const maxFloats = templateRecord.creaseEdges.length * 3 * records.length;
      const lineGeometry = new THREE.BufferGeometry();
      const lineArray = new Float32Array(maxFloats);
      const lineAttribute = new THREE.BufferAttribute(lineArray, 3);
      lineAttribute.setUsage(THREE.DynamicDrawUsage);
      lineGeometry.setAttribute('position', lineAttribute);
      lineGeometry.setDrawRange(0, 0);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: INK,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      });
      const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
      lines.name = `ink:${mesh.name}`;
      lines.renderOrder = 3;
      lines.frustumCulled = false;
      scene.add(lines);
      mesh.userData.instanceInk = {
        array: lineArray,
        attribute: lineAttribute,
        edges: templateRecord.creaseEdges,
        positions: templateRecord.positions,
        lines,
      };
      inkObjects.push(lines);
      ownedGeometries.add(lineGeometry);
      materials.set(`ink:${mesh.name}`, lineMaterial);
    }
  }

  // Batch-owned landmarks may not have an instance position. Their manifest
  // center is still enough to place a selection halo.
  for (const building of manifest?.buildings || []) {
    if (semanticPositions.has(building.semanticId)) continue;
    const center = finiteTownSceneVector(building.renderCenter || building.position || [
      building.mapAnchor?.[0] || 0,
      0,
      building.mapAnchor?.[1] || 0,
    ]);
    semanticPositions.set(building.semanticId, new THREE.Vector3(...center));
  }
  const planUnitCm = Number(manifest?.space?.planUnitCm) || 1;
  for (const district of manifest?.districts || []) {
    const semanticId = `district:${district.id}`;
    if (semanticPositions.has(semanticId)) continue;
    const centroid = district.centroid || [0, 0];
    semanticPositions.set(semanticId, new THREE.Vector3(
      (Number(centroid[0]) || 0) * planUnitCm,
      Number(district.elevationCm) || 0,
      (Number(centroid[1]) || 0) * planUnitCm,
    ));
  }

  addTownSceneLivingMarkers({
    THREE,
    scene,
    manifest,
    bounds,
    semanticPositions,
    pickables,
    materials,
    ownedGeometries,
  });

  const selectionGeometry = new THREE.TorusGeometry(
    Math.max(8, bounds.diagonal * 0.012),
    Math.max(1.5, bounds.diagonal * 0.0015),
    8,
    32,
  );
  const selectionMaterial = new THREE.MeshBasicMaterial({
    color: GOLD,
    transparent: true,
    opacity: 0.9,
    depthTest: false,
  });
  const selectionHalo = new THREE.Mesh(selectionGeometry, selectionMaterial);
  selectionHalo.rotation.x = Math.PI / 2;
  selectionHalo.renderOrder = 10;
  selectionHalo.visible = false;
  scene.add(selectionHalo);
  ownedGeometries.add(selectionGeometry);
  materials.set('selection-halo', selectionMaterial);

  const projectionMatrix = new THREE.Matrix4();
  const frustum = new THREE.Frustum();
  const inkVertex = new THREE.Vector3();
  const cullInstances = () => {
    camera.updateMatrixWorld();
    projectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(projectionMatrix);
    const cullScale = Number.isFinite(quality.cullScale) ? quality.cullScale : 1;
    const maxDistance = bounds.diagonal * (1.6 + Math.max(0.3, cullScale) * 2.2);
    const viewportHeight = Math.max(1, renderer.domElement.clientHeight || canvas.clientHeight || 720);
    const pixelsPerWorldUnitAtOne = viewportHeight / (
      2 * Math.tan((camera.fov * Math.PI / 180) / 2)
    );
    for (const mesh of instancedObjects) {
      let visibleCount = 0;
      const visible = [];
      let inkOffset = 0;
      const instanceInk = mesh.userData.instanceInk;
      for (const item of mesh.userData.allInstances) {
        const selected = item.record.semanticId === selectedSceneId;
        const distance = Math.max(1, camera.position.distanceTo(item.position));
        if (!selected && (!frustum.containsPoint(item.position) || distance > maxDistance)) {
          continue;
        }
        const height = Math.max(1, Number(item.record.scale?.[1]) || 1);
        const projectedPixels = height * pixelsPerWorldUnitAtOne / distance;
        const desiredLod = townSceneLodForProjectedPixels(projectedPixels, {
          lodBias: quality.lodBias,
          massingOnly: quality.massingOnly,
          availableLods: item.record.availableLods,
        });
        if (mesh.userData.templateLod !== desiredLod) continue;
        mesh.setMatrixAt(visibleCount, item.matrix);
        const instanceColor = townSceneInstanceColorFor(
          item.tint,
          mesh.userData.hasInstanceTints,
          neutralInstanceColor,
        );
        if (instanceColor) mesh.setColorAt(visibleCount, instanceColor);
        visible.push(item);
        visibleCount += 1;
        if (instanceInk) {
          const sourcePositions = instanceInk.positions;
          for (const vertexIndex of instanceInk.edges) {
            inkVertex.fromArray(sourcePositions, vertexIndex * 3).applyMatrix4(item.matrix);
            instanceInk.array[inkOffset++] = inkVertex.x;
            instanceInk.array[inkOffset++] = inkVertex.y;
            instanceInk.array[inkOffset++] = inkVertex.z;
          }
        }
      }
      mesh.count = visibleCount;
      mesh.userData.visibleInstances = visible;
      refreshTownSceneInstanceBounds(mesh);
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      if (instanceInk) {
        instanceInk.lines.geometry.setDrawRange(0, inkOffset / 3);
        instanceInk.attribute.needsUpdate = true;
        instanceInk.lines.visible = Boolean(quality.creaseInk && visibleCount);
      }
    }
  };
  controls.addEventListener('change', cullInstances);

  const preset = townSceneDefaultCameraPreset(manifest?.cameraPresets);
  const applyPresetImmediately = (cameraPreset) => {
    if (!cameraPreset) {
      camera.position.set(
        bounds.center[0] + bounds.diagonal * 0.78,
        bounds.center[1] + bounds.diagonal * 0.62,
        bounds.center[2] + bounds.diagonal * 0.78,
      );
      controls.target.set(...bounds.center);
      controls.update();
      return;
    }
    const target = finiteTownSceneVector(cameraPreset.target, bounds.center);
    const azimuthDenominator = Math.max(1, manifest?.space?.headingTurnDenominator || 16);
    const elevationDenominator = Math.max(1, manifest?.space?.elevationTurnDenominator || 16);
    const azimuth = (Number(cameraPreset.azimuthStep) || 0) * TAU / azimuthDenominator;
    const elevation = Math.max(0.08, (Number(cameraPreset.elevationStep) || 2) * TAU / elevationDenominator);
    const distance = Math.max(10, Number(cameraPreset.distanceCm) || bounds.diagonal * 1.3);
    const horizontal = Math.cos(elevation) * distance;
    controls.target.set(...target);
    camera.position.set(
      target[0] + Math.sin(azimuth) * horizontal,
      target[1] + Math.sin(elevation) * distance,
      target[2] + Math.cos(azimuth) * horizontal,
    );
    controls.update();
  };
  applyPresetImmediately(preset);
  cullInstances();

  const animateToPreset = (cameraPreset) => {
    if (!cameraPreset) return;
    if (cameraAnimation) cancelAnimationFrame(cameraAnimation);
    const startPosition = camera.position.clone();
    const startTarget = controls.target.clone();
    const target = new THREE.Vector3(
      ...finiteTownSceneVector(cameraPreset.target, bounds.center),
    );
    const azimuthDenominator = Math.max(1, manifest?.space?.headingTurnDenominator || 16);
    const elevationDenominator = Math.max(1, manifest?.space?.elevationTurnDenominator || 16);
    const azimuth = (Number(cameraPreset.azimuthStep) || 0) * TAU / azimuthDenominator;
    const elevation = Math.max(0.08, (Number(cameraPreset.elevationStep) || 2) * TAU / elevationDenominator);
    const distance = Math.max(10, Number(cameraPreset.distanceCm) || bounds.diagonal * 1.3);
    const horizontal = Math.cos(elevation) * distance;
    const endPosition = new THREE.Vector3(
      target.x + Math.sin(azimuth) * horizontal,
      target.y + Math.sin(elevation) * distance,
      target.z + Math.cos(azimuth) * horizontal,
    );
    if (reducedMotion) {
      camera.position.copy(endPosition);
      controls.target.copy(target);
      controls.update();
      cullInstances();
      return;
    }
    const started = performance.now();
    const step = (now) => {
      const linear = Math.min(1, (now - started) / 360);
      const eased = 1 - ((1 - linear) ** 3);
      camera.position.lerpVectors(startPosition, endPosition, eased);
      controls.target.lerpVectors(startTarget, target, eased);
      controls.update();
      if (linear < 1) cameraAnimation = requestAnimationFrame(step);
      else {
        cameraAnimation = 0;
        cullInstances();
      }
    };
    cameraAnimation = requestAnimationFrame(step);
  };

  const focusSemanticPosition = (position) => {
    if (!position) return;
    if (cameraAnimation) cancelAnimationFrame(cameraAnimation);
    const startPosition = camera.position.clone();
    const startTarget = controls.target.clone();
    const endTarget = position.clone();
    endTarget.y += Math.max(2, bounds.diagonal * 0.004);
    const endPosition = endTarget.clone().add(startPosition.clone().sub(startTarget));
    if (reducedMotion) {
      camera.position.copy(endPosition);
      controls.target.copy(endTarget);
      controls.update();
      cullInstances();
      return;
    }
    const started = performance.now();
    const step = (now) => {
      const linear = Math.min(1, (now - started) / 300);
      const eased = 1 - ((1 - linear) ** 3);
      camera.position.lerpVectors(startPosition, endPosition, eased);
      controls.target.lerpVectors(startTarget, endTarget, eased);
      controls.update();
      if (linear < 1) cameraAnimation = requestAnimationFrame(step);
      else {
        cameraAnimation = 0;
        cullInstances();
      }
    };
    cameraAnimation = requestAnimationFrame(step);
  };

  const zoomBy = (scale) => {
    const safeScale = Number.isFinite(scale) && scale > 0 ? scale : 1;
    const startPosition = camera.position.clone();
    const offset = startPosition.clone().sub(controls.target);
    const startDistance = Math.max(1, offset.length());
    const endDistance = Math.max(
      controls.minDistance,
      Math.min(controls.maxDistance, startDistance * safeScale),
    );
    const endPosition = controls.target.clone().add(offset.setLength(endDistance));
    if (cameraAnimation) cancelAnimationFrame(cameraAnimation);
    if (reducedMotion) {
      camera.position.copy(endPosition);
      controls.update();
      cullInstances();
      return;
    }
    const started = performance.now();
    const step = (now) => {
      const linear = Math.min(1, (now - started) / 180);
      const eased = 1 - ((1 - linear) ** 3);
      camera.position.lerpVectors(startPosition, endPosition, eased);
      controls.update();
      if (linear < 1) cameraAnimation = requestAnimationFrame(step);
      else {
        cameraAnimation = 0;
        cullInstances();
      }
    };
    cameraAnimation = requestAnimationFrame(step);
  };

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const pick = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(pickables, false)[0];
    if (!hit) {
      onPick?.(null);
      return null;
    }
    const sceneId = hit.object.userData.townSceneInstanced && Number.isInteger(hit.instanceId)
      ? hit.object.userData.visibleInstances?.[hit.instanceId]?.record?.semanticId || null
      : townSceneSemanticForFace(
        hit.object.userData.semanticRanges,
        hit.faceIndex,
      );
    onPick?.(sceneId);
    return sceneId;
  };

  const setSelected = (sceneId) => {
    const changed = selectedSceneId !== (sceneId || null);
    selectedSceneId = sceneId || null;
    const position = semanticPositions.get(selectedSceneId);
    selectionHalo.visible = Boolean(position);
    if (position) {
      selectionHalo.position.copy(position);
      selectionHalo.position.y += Math.max(3, bounds.diagonal * 0.002);
    }
    if (changed && position) focusSemanticPosition(position);
    cullInstances();
  };

  const setQuality = (next) => {
    quality = { ...quality, ...(next || {}) };
    const deviceScale = Math.min(2, globalThis.devicePixelRatio || 1);
    renderer.setPixelRatio(Math.max(0.45, deviceScale * (quality.renderScale || 1)));
    renderer.shadowMap.enabled = Boolean(quality.contactShadows);
    sun.castShadow = Boolean(quality.contactShadows);
    for (const object of inkObjects) object.visible = Boolean(quality.creaseInk);
    cullInstances();
  };
  setQuality(quality);

  const resize = (width, height) => {
    const safeWidth = Math.max(1, Math.floor(width));
    const safeHeight = Math.max(1, Math.floor(height));
    renderer.setSize(safeWidth, safeHeight, false);
    camera.aspect = safeWidth / safeHeight;
    camera.updateProjectionMatrix();
    cullInstances();
  };

  const loop = () => {
    animationFrame = 0;
    if (!running || paused) return;
    controls.update();
    renderer.render(scene, camera);
    animationFrame = requestAnimationFrame(loop);
  };

  return {
    start() {
      if (running) return;
      running = true;
      if (!paused) animationFrame = requestAnimationFrame(loop);
    },
    setPaused(value) {
      const nextPaused = Boolean(value);
      if (paused === nextPaused) return;
      paused = nextPaused;
      if (paused) {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        }
        if (cameraAnimation) {
          cancelAnimationFrame(cameraAnimation);
          cameraAnimation = 0;
        }
      } else if (!paused && running && !animationFrame) {
        animationFrame = requestAnimationFrame(loop);
      }
    },
    resize,
    pick,
    setSelected,
    setQuality,
    moveCamera: animateToPreset,
    zoomBy,
    dispose({ releaseContext = true } = {}) {
      running = false;
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (cameraAnimation) cancelAnimationFrame(cameraAnimation);
      controls.removeEventListener('change', cullInstances);
      controls.removeEventListener('start', handleControlStart);
      controls.dispose();
      scene.traverse((object) => {
        if (object !== scene && object.geometry && !ownedGeometries.has(object.geometry)) {
          object.geometry.dispose?.();
        }
      });
      for (const owned of ownedGeometries) owned.dispose?.();
      for (const material of materials.values()) material.dispose?.();
      disposeTownSceneRenderer(renderer, { releaseContext });
    },
    releaseContext() {
      renderer.forceContextLoss?.();
    },
  };
}
