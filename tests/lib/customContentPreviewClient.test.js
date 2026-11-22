import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import {
  CUSTOM_CONTENT_PREVIEW_WORKER_CONTRACT,
  runCustomContentPreview,
} from '../../src/lib/customContentPreviewClient.js';

class FakeWorker {
  constructor() {
    this.messages = [];
    this.terminated = false;
  }

  postMessage(packet) {
    this.messages.push(packet);
  }

  terminate() {
    this.terminated = true;
  }

  emit(packet) {
    this.onmessage?.({ data: packet });
  }
}

afterEach(() => {
  vi.useRealTimers();
});

describe('custom-content preview worker transport', () => {
  it('accepts only the matching request and protocol contract', async () => {
    const worker = new FakeWorker();
    const result = runCustomContentPreview(
      { seed: 'same-seed' },
      { workerFactory: () => worker },
    );
    const { requestId } = worker.messages[0];

    worker.emit({
      requestId: 'content-preview-stale',
      ok: true,
      result: { stale: true },
      workerContract: CUSTOM_CONTENT_PREVIEW_WORKER_CONTRACT,
    });
    worker.emit({
      requestId,
      ok: true,
      result: { seed: 'same-seed' },
      workerContract: CUSTOM_CONTENT_PREVIEW_WORKER_CONTRACT,
    });

    await expect(result).resolves.toEqual({ seed: 'same-seed' });
    expect(worker.terminated).toBe(true);
  });

  it('rejects a response from an incompatible cached worker', async () => {
    const worker = new FakeWorker();
    const result = runCustomContentPreview(
      {},
      { workerFactory: () => worker },
    );

    worker.emit({
      requestId: worker.messages[0].requestId,
      ok: true,
      result: {},
      workerContract: 'settlementforge:custom-content-preview:stale',
    });

    await expect(result).rejects.toThrow(/protocol is out of date/i);
    expect(worker.terminated).toBe(true);
  });

  it('cleans up when posting the request fails', async () => {
    const worker = new FakeWorker();
    worker.postMessage = () => {
      throw new DOMException('The request could not be cloned.', 'DataCloneError');
    };

    await expect(runCustomContentPreview(
      { invalid: () => {} },
      { workerFactory: () => worker },
    )).rejects.toMatchObject({ name: 'DataCloneError' });
    expect(worker.terminated).toBe(true);
  });

  it('rejects unreadable worker messages and aborts active work', async () => {
    const unreadableWorker = new FakeWorker();
    const unreadable = runCustomContentPreview(
      {},
      { workerFactory: () => unreadableWorker },
    );
    unreadableWorker.onmessageerror?.();
    await expect(unreadable).rejects.toThrow(/unreadable response/i);

    const activeWorker = new FakeWorker();
    const controller = new AbortController();
    const active = runCustomContentPreview(
      {},
      { signal: controller.signal, workerFactory: () => activeWorker },
    );
    controller.abort();
    await expect(active).rejects.toMatchObject({ name: 'AbortError' });
    expect(activeWorker.terminated).toBe(true);
  });

  it('times out a worker that never returns the matching request', async () => {
    vi.useFakeTimers();
    const worker = new FakeWorker();
    const result = runCustomContentPreview(
      {},
      { timeoutMs: 25, workerFactory: () => worker },
    );
    const timedOut = expect(result).rejects.toThrow(/timed out/i);

    await vi.advanceTimersByTimeAsync(25);
    await timedOut;
    expect(worker.terminated).toBe(true);
  });
});
