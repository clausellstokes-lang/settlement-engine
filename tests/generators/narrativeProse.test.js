/**
 * Focused contracts for generator-side narrative normalization.
 *
 * These helpers sit after template selection, so they must remain deterministic
 * and preserve sentence-position casing while repairing composition seams.
 */

import { describe, expect, it } from 'vitest';
import {
  collapseArticleSeams,
  sentenceCase,
} from '../../src/generators/narrativeProse.js';

describe('narrative prose normalization', () => {
  it('capitalizes the first character without changing the remaining fragment', () => {
    expect(sentenceCase('stone colonnades line the square')).toBe(
      'Stone colonnades line the square',
    );
    expect(sentenceCase('Already capitalized')).toBe('Already capitalized');
    expect(sentenceCase(null)).toBe('');
  });

  it('repairs doubled articles while preserving sentence-position casing', () => {
    expect(collapseArticleSeams('The The Succession Crisis remains unresolved.')).toBe(
      'The Succession Crisis remains unresolved.',
    );
    expect(collapseArticleSeams('reshaped the an old harbour')).toBe(
      'reshaped the old harbour',
    );
    expect(collapseArticleSeams('the harbour remains open')).toBe(
      'the harbour remains open',
    );
  });
});
