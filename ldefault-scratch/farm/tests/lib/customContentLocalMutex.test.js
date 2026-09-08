import {
  afterEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';

import {
  withCustomContentLocalLock,
} from '../../src/lib/customContentLocalMutex.js';

const originalNavigator = Object.getOwnPropertyDescriptor(
  globalThis,
  'navigator',
);
const originalIndexedDb = Object.getOwnPropertyDescriptor(
  globalThis,
  'indexedDB',
);

function restoreGlobal(name, descriptor) {
  if (descriptor) {
    Object.defineProperty(globalThis, name, descriptor);
  } else {
    delete globalThis[name];
  }
}

afterEach(() => {
  restoreGlobal('navigator', originalNavigator);
  restoreGlobal('indexedDB', originalIndexedDb);
  vi.restoreAllMocks();
});

describe('withCustomContentLocalLock', () => {
  test('uses one owner-scoped exclusive Web Lock across browser documents', async () => {
    const request = vi.fn(async (_name, _options, criticalSection) => (
      criticalSection()
    ));
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { locks: { request } },
    });

    const result = await withCustomContentLocalLock(
      'account:ada@example.test',
      () => ({ status: 'applied' }),
    );

    expect(result).toEqual({ status: 'applied' });
    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith(
      'settlementforge:custom-content-ledger:account:ada@example.test',
      { mode: 'exclusive' },
      expect.any(Function),
    );
  });

  test('retains a deterministic process-local fallback outside the browser', async () => {
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(globalThis, 'indexedDB', {
      configurable: true,
      value: undefined,
    });

    await expect(withCustomContentLocalLock('owner-a', () => 17))
      .resolves.toBe(17);
    await expect(withCustomContentLocalLock('owner-a', () => 23))
      .resolves.toBe(23);
  });

  test('releases the owner queue after a failed critical section', async () => {
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(globalThis, 'indexedDB', {
      configurable: true,
      value: undefined,
    });

    await expect(withCustomContentLocalLock('owner-b', () => {
      throw new Error('simulated command failure');
    })).rejects.toThrow('simulated command failure');

    await expect(withCustomContentLocalLock('owner-b', () => 'recovered'))
      .resolves.toBe('recovered');
  });

  test('rethrows only after a Web Lock callback releases normally', async () => {
    let callbackRejected = false;
    const request = vi.fn(async (_name, _options, criticalSection) => {
      try {
        return await criticalSection();
      } catch (error) {
        callbackRejected = true;
        throw error;
      }
    });
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { locks: { request } },
    });

    await expect(withCustomContentLocalLock('owner-web-failure', () => {
      throw new Error('simulated Web Lock failure');
    })).rejects.toThrow('simulated Web Lock failure');
    await expect(withCustomContentLocalLock(
      'owner-web-failure',
      () => 'recovered',
    )).resolves.toBe('recovered');

    expect(callbackRejected).toBe(false);
    expect(request).toHaveBeenCalledTimes(2);
  });

  test('rejects an async critical section before it can outlive the lock turn', async () => {
    const request = vi.fn(async (_name, _options, criticalSection) => (
      criticalSection()
    ));
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { locks: { request } },
    });

    await expect(withCustomContentLocalLock(
      'owner-async',
      async () => 'too-late',
    )).rejects.toThrow(/must be synchronous/i);
  });
});
