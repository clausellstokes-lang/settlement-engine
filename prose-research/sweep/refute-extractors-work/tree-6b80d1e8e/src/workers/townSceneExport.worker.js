/**
 * One-shot deterministic Portrait artifact worker.
 *
 * Rasterization can touch millions of pixels and complete-scene GLB expansion
 * can duplicate hundreds of instanced buildings. Both belong off the UI thread.
 * The worker receives an already audience-authorized manifest, compiles the same
 * renderer-neutral geometry as the viewer, and transfers only final bytes back.
 */

import {
  compileTownSceneGeometry,
  encodeTownSceneGlb,
  encodeTownScenePortraitPng,
} from '../domain/townScene/index.js';

self.onmessage = (event) => {
  const packet = event.data || {};
  if (packet.type !== 'export') return;
  const requestId = Number(packet.requestId) || 0;
  try {
    const geometry = compileTownSceneGeometry(packet.manifest, {
      lodBias: 0,
      massingOnly: false,
    });
    const format = packet.format === 'glb' ? 'glb' : 'png';
    const bytes = format === 'glb'
      ? encodeTownSceneGlb(packet.manifest, geometry, {
        lod: 2,
        includeInk: packet.options?.includeInk !== false,
      })
      : encodeTownScenePortraitPng(packet.manifest, geometry, {
        width: packet.options?.width,
        height: packet.options?.height,
        supersample: packet.options?.supersample,
        lod: 2,
        includeInk: packet.options?.includeInk !== false,
      });
    self.postMessage(
      {
        type: 'result',
        requestId,
        format,
        manifestDigest: geometry.manifestDigest,
        bytes,
      },
      [bytes.buffer],
    );
  } catch (error) {
    self.postMessage({
      type: 'error',
      requestId,
      message: String(error?.message || error),
      stack: error?.stack,
    });
  }
};
