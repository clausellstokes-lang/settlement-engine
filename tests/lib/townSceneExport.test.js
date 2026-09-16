/**
 * Lazy Portrait export worker transport.
 */

import { describe, expect, it, vi } from 'vitest';
import {
  requestTownSceneArtifact,
} from '../../src/lib/townScene/townSceneExport.js';

class ExportWorkerStub {
  constructor(response) {
    this.response = response;
    this.messages = [];
    this.terminate = vi.fn();
  }

  postMessage(packet) {
    this.messages.push(packet);
    queueMicrotask(() => this.onmessage?.({
      data: {
        requestId: packet.requestId,
        ...this.response,
      },
    }));
  }
}

describe('requestTownSceneArtifact', () => {
  it('uses the dedicated worker and preserves transferred result bytes', async () => {
    const worker = new ExportWorkerStub({
      type: 'result',
      format: 'glb',
      manifestDigest: 'scene-digest',
      bytes: Uint8Array.from([1, 2, 3, 4]),
    });
    const result = await requestTownSceneArtifact(
      { kind: 'TownSceneManifest' },
      { format: 'glb' },
      { workerFactory: () => worker, watchdogMs: 1000 },
    );

    expect(worker.messages).toHaveLength(1);
    expect(worker.messages[0]).toMatchObject({
      type: 'export',
      format: 'glb',
    });
    expect(result).toEqual({
      bytes: Uint8Array.from([1, 2, 3, 4]),
      manifestDigest: 'scene-digest',
      transport: 'worker',
    });
    expect(worker.terminate).toHaveBeenCalledOnce();
  });

  it('rejects canonical export errors instead of disguising them as transport fallback', async () => {
    const worker = new ExportWorkerStub({
      type: 'error',
      message: 'manifest rejected',
      stack: 'worker stack',
    });
    await expect(requestTownSceneArtifact(
      { kind: 'TownSceneManifest' },
      { format: 'png' },
      { workerFactory: () => worker, watchdogMs: 1000 },
    )).rejects.toThrow('manifest rejected');
    expect(worker.terminate).toHaveBeenCalledOnce();
  });
});
