import { describe, expect, test, vi } from 'vitest';
import { createWeakReporterRegistry } from '../../src/store/weakReporterRegistry.js';

describe('weak reporter registry', () => {
  test('legacy registration is one strongly-held replacement slot', () => {
    const registry = createWeakReporterRegistry();
    const first = vi.fn();
    const second = vi.fn();

    registry.replaceLegacy(first);
    registry.publish('first');
    const disposeSecond = registry.replaceLegacy(second);
    registry.publish('second');
    disposeSecond();
    registry.publish('after-dispose');

    expect(first).toHaveBeenCalledTimes(1);
    expect(first).toHaveBeenCalledWith('first');
    expect(second).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledWith('second');
  });

  test('a keyed install replaces only that key and either install can unsubscribe', () => {
    const registry = createWeakReporterRegistry();
    const firstKey = () => {};
    const secondKey = () => {};
    const replaced = vi.fn();
    const first = vi.fn();
    const second = vi.fn();

    registry.subscribe(firstKey, replaced);
    const disposeFirst = registry.subscribe(firstKey, first);
    const disposeSecond = registry.subscribe(secondKey, second);
    registry.publish({ queued: 1 });

    expect(replaced).not.toHaveBeenCalled();
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);

    disposeFirst();
    registry.publish({ queued: 2 });
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(2);

    disposeSecond();
    registry.publish({ queued: 3 });
    expect(second).toHaveBeenCalledTimes(2);
  });

  test('publish prunes a collected weak callback deterministically', () => {
    const references = [];
    const registry = createWeakReporterRegistry(value => {
      const slot = { value };
      const reference = {
        clear: () => { slot.value = null; },
        deref: vi.fn(() => slot.value),
      };
      references.push(reference);
      return reference;
    });
    const storeKey = () => {};
    const reporter = vi.fn();
    registry.subscribe(storeKey, reporter);
    const [keyReference, reporterReference] = references;

    reporterReference.clear();
    registry.publish('first-prune');
    const keyReadsAfterPrune = keyReference.deref.mock.calls.length;
    registry.publish('already-pruned');

    expect(reporter).not.toHaveBeenCalled();
    expect(keyReference.deref).toHaveBeenCalledTimes(keyReadsAfterPrune);
  });
});
