import { describe, expect, test, vi } from 'vitest';
import { customContentCreateRevisionSpec } from '../../../src/application/commands/adapters/customContentApply.js';

describe('custom-content command adapter receipt honesty', () => {
  test('accepts only an explicitly confirmed applied writer receipt', async () => {
    const result = { landed: 1 };
    const receipt = await customContentCreateRevisionSpec.apply({}, {
      actions: {
        applyCustomContentCommand: vi.fn(async () => ({
          ok: true,
          status: 'applied',
          persistence: { state: 'confirmed' },
          result,
        })),
      },
    });

    expect(receipt).toMatchObject({
      ok: true,
      status: 'applied',
      persistence: { state: 'confirmed' },
      result,
    });
  });

  test.each([
    ['missing', undefined],
    [
      'unconfirmed',
      {
        ok: true,
        status: 'applied',
        persistence: { state: 'unconfirmed' },
      },
    ],
    [
      'contradictory',
      {
        ok: false,
        status: 'applied',
        persistence: { state: 'confirmed' },
      },
    ],
  ])('classifies a %s success receipt as reconciliation-required', async (
    _label,
    writerReceipt,
  ) => {
    const receipt = await customContentCreateRevisionSpec.apply({}, {
      actions: {
        applyCustomContentCommand: vi.fn(async () => writerReceipt),
      },
    });

    expect(receipt).toMatchObject({
      ok: false,
      status: 'reconcile-required',
      reason: 'custom_content_persistence_unconfirmed',
      needsReconciliation: true,
      persistence: { state: 'unconfirmed' },
    });
  });

  test('preserves an explicit refusal as a safe ordinary failure', async () => {
    const receipt = await customContentCreateRevisionSpec.apply({}, {
      actions: {
        applyCustomContentCommand: vi.fn(async () => ({
          ok: false,
          status: 'failed',
          reason: 'definition_unavailable',
          persistence: { state: 'not-required' },
        })),
      },
    });

    expect(receipt).toMatchObject({
      ok: false,
      status: 'failed',
      reason: 'definition_unavailable',
      needsReconciliation: false,
      persistence: { state: 'not-required' },
    });
  });
});
