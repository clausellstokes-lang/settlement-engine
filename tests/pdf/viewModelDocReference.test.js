/**
 * tests/pdf/viewModelDocReference.test.js — the income-source parity note in
 * the PDF view model must cite a REAL contract, not a phantom file.
 *
 * normalizeIncomeSources() intentionally drops zero-valued income sources — a
 * per-surface formatting choice the cross-bundle parity contract has to know
 * about. The doc comment used to point at "display/PARITY_EXEMPT", a path that
 * does not exist; the live contract is the PARITY_EXEMPT export in
 * domain/display/parityContract.js. A dangling reference rots silently, so this
 * test pins that the cited module + symbol actually resolve.
 */
import { describe, test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { PARITY_EXEMPT } from '../../src/domain/display/parityContract.js';

const viewModelSrc = readFileSync(
  fileURLToPath(new URL('../../src/pdf/lib/viewModel.js', import.meta.url)),
  'utf8',
);

describe('viewModel income-source note cites a real parity contract', () => {
  test('the note names the actual parityContract module, not a phantom path', () => {
    expect(viewModelSrc).toContain('domain/display/parityContract.js');
    // The dead reference must be gone.
    expect(viewModelSrc).not.toContain('display/PARITY_EXEMPT');
  });

  test('the cited PARITY_EXEMPT contract export actually exists', () => {
    expect(Array.isArray(PARITY_EXEMPT)).toBe(true);
  });
});
