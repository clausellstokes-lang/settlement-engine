/**
 * Lazy browser transport for deterministic settlement Portrait artifacts.
 *
 * This module is imported only when a user chooses Portrait PNG or GLB. The
 * normal map/viewer path therefore pays for neither the CPU rasterizer nor the
 * portable encoder. A dedicated worker protects interaction latency; the exact
 * same pure domain functions provide a one-time compatibility fallback.
 */

import {
  compileTownSceneGeometry,
  compileTownSceneManifest,
  encodeTownSceneGlb,
  encodeTownScenePortraitPng,
} from '../../domain/townScene/index.js';
import { townCartographyActive } from '../../domain/townScene/cartographyContract.js';
import { slugify } from '../../kernel/slugify.js';
import { downloadBlob } from '../townMapExport.js';

export const TOWN_SCENE_EXPORT_LAZY_SENTINEL = 'settlementforge:town-scene-export:lazy-v1';

const EXPORT_WATCHDOG_MS = 60000;
let nextRequestId = 0;

/** @returns {{format:'png'|'glb',extension:string,mime:string,label:string}} */
function artifactDefinition(format) {
  return format === 'glb'
    ? { format: 'glb', extension: 'glb', mime: 'model/gltf-binary', label: 'scene' }
    : { format: 'png', extension: 'png', mime: 'image/png', label: 'portrait' };
}

function compileLocally(manifest, format, options) {
  const geometry = compileTownSceneGeometry(manifest, {
    lodBias: 0,
    massingOnly: false,
  });
  const bytes = format === 'glb'
    ? encodeTownSceneGlb(manifest, geometry, {
      lod: 2,
      includeInk: options.includeInk !== false,
    })
    : encodeTownScenePortraitPng(manifest, geometry, {
      width: options.width,
      height: options.height,
      supersample: options.supersample,
      lod: 2,
      includeInk: options.includeInk !== false,
    });
  return {
    bytes,
    manifestDigest: geometry.manifestDigest,
    transport: 'sync',
  };
}

/**
 * @param {any} manifest
 * @param {{format?:'png'|'glb',width?:number,height?:number,supersample?:number,includeInk?:boolean}} [options]
 * @param {{workerFactory?:()=>Worker,watchdogMs?:number}} [dependencies]
 */
export function requestTownSceneArtifact(
  manifest,
  options = {},
  dependencies = {},
) {
  const definition = artifactDefinition(options.format);
  const requestId = ++nextRequestId;
  const watchdogMs = Math.max(1000, dependencies.watchdogMs || EXPORT_WATCHDOG_MS);
  let worker = null;
  try {
    worker = dependencies.workerFactory
      ? dependencies.workerFactory()
      : typeof Worker === 'function'
        ? new Worker(
          new URL('../../workers/townSceneExport.worker.js', import.meta.url),
          { type: 'module' },
        )
        : null;
  } catch {
    worker = null;
  }
  if (!worker) {
    return Promise.resolve(compileLocally(manifest, definition.format, options));
  }

  return new Promise((resolve, reject) => {
    let settled = false;
    let watchdog = null;
    const finish = (mode, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(watchdog);
      worker.terminate();
      if (mode === 'resolve') resolve(value);
      else reject(value);
    };
    const fallback = () => {
      if (settled) return;
      settled = true;
      clearTimeout(watchdog);
      worker.terminate();
      try {
        resolve(compileLocally(manifest, definition.format, options));
      } catch (error) {
        reject(error);
      }
    };
    watchdog = setTimeout(fallback, watchdogMs);
    worker.onmessage = (event) => {
      const packet = event.data || {};
      if (packet.requestId !== requestId) return;
      if (packet.type === 'error') {
        finish('reject', Object.assign(
          new Error(packet.message || 'Town-scene export failed'),
          { workerStack: packet.stack },
        ));
        return;
      }
      if (packet.type !== 'result') return;
      finish('resolve', {
        bytes: packet.bytes instanceof Uint8Array
          ? packet.bytes
          : new Uint8Array(packet.bytes || 0),
        manifestDigest: packet.manifestDigest,
        transport: 'worker',
      });
    };
    worker.onerror = fallback;
    worker.onmessageerror = fallback;
    try {
      worker.postMessage({
        type: 'export',
        requestId,
        manifest,
        format: definition.format,
        options,
      });
    } catch {
      fallback();
    }
  });
}

/**
 * Compile the authorized manifest, render in a worker, and download the bytes.
 */
export async function downloadTownSceneArtifact({
  settlement,
  mapEdits = null,
  worldState = null,
  regionalGraph = null,
  audience = 'dm',
  format = 'png',
  width = 1600,
  height = 1200,
}) {
  const definition = artifactDefinition(format);
  // CR-TC3A-1: read the flag through the SAME predicate the prepare seam uses, so the
  // two cannot disagree, and fetch the naming pools only on the lit path.
  const namingPools = townCartographyActive(worldState?.simulationRules)
    ? (await import('../../data/namingData.js')).NAMING_DATA
    : null;
  const manifest = compileTownSceneManifest(
    { settlement, mapEdits, worldState, regionalGraph, audience },
    { namingPools },
  );
  const artifact = await requestTownSceneArtifact(manifest, {
    format: definition.format,
    width,
    height,
    supersample: 1,
    includeInk: true,
  });
  const safeName = slugify(settlement?.name, {
    max: 60,
    fallback: 'settlement',
  });
  const digest = String(artifact.manifestDigest || '').slice(0, 12);
  const filename = `${safeName}-${definition.label}-${digest}.${definition.extension}`;
  const bytes = artifact.bytes;
  const buffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  );
  downloadBlob(new Blob([buffer], { type: definition.mime }), filename);
  return {
    ...artifact,
    filename,
    mime: definition.mime,
  };
}
