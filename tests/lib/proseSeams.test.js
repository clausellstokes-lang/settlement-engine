/**
 * proseSeams.test.js - unit pins for the shared display-time prose-seam
 * chokepoint (src/lib/proseSeams.js).
 *
 * Contract:
 *   normalizePlotHook - strips a leading ' PLOT HOOK: ' authoring marker
 *     (whitespace + case tolerant) and trims; non-strings coerce to ''. Must be
 *     byte-identical to the per-surface strippers it replaced (plotHooks.cleanHook
 *     and the tail of ViabilityTab._cleanHook) so consolidation shifts no output.
 *   collapseDoubledArticles - folds 'the the '/'the a '/'the an ' and the
 *     capitalised 'the The '/'the A '/'the An ' seam joins down to a single
 *     lowercase 'the '; non-strings coerce to ''. Mirrors the generator-side
 *     regex pair (historyGenerator / narrativeGenerator) exactly.
 */
import { describe, expect, test } from 'vitest';

import { normalizePlotHook, collapseDoubledArticles } from '../../src/lib/proseSeams.js';

// The exact stripper implementations proseSeams replaced, re-declared here as
// the byte-identity oracle: consolidation must not change what they returned.
const legacyCleanHook = (text) => String(text || '').replace(/^\s*PLOT HOOK:\s*/i, '').trim();
const legacyArticleCollapse = (text) =>
  String(text || '')
    .replace(/\bthe\s+(the|a|an)\s+/gi, 'the ')
    .replace(/\bthe\s+(The|A|An)\s+/g, 'the ');

describe('normalizePlotHook', () => {
  test('strips the authored " PLOT HOOK: " marker foodBalance bakes in', () => {
    expect(normalizePlotHook(' PLOT HOOK: The road trade route is cut off. Famine threatens.'))
      .toBe('The road trade route is cut off. Famine threatens.');
  });

  test('is whitespace- and case-tolerant on the marker', () => {
    expect(normalizePlotHook('PLOT HOOK: no leading space')).toBe('no leading space');
    expect(normalizePlotHook('   plot hook:  lowercase and padded ')).toBe('lowercase and padded');
    expect(normalizePlotHook('\tPLOT HOOK:\ttabbed')).toBe('tabbed');
  });

  test('leaves a hook with no marker untouched (apart from a trim)', () => {
    expect(normalizePlotHook('A hook with no marker')).toBe('A hook with no marker');
    expect(normalizePlotHook('  padded but markerless  ')).toBe('padded but markerless');
  });

  test('only the LEADING marker is stripped, not a mid-string occurrence', () => {
    expect(normalizePlotHook('See PLOT HOOK: below')).toBe('See PLOT HOOK: below');
  });

  test('non-string / falsy input coerces to the empty string', () => {
    expect(normalizePlotHook(null)).toBe('');
    expect(normalizePlotHook(undefined)).toBe('');
    expect(normalizePlotHook('')).toBe('');
    expect(normalizePlotHook(0)).toBe('');
  });

  test('byte-identical to the legacy per-surface stripper across a corpus', () => {
    const cases = [
      ' PLOT HOOK: A single merchant guild controls grain imports.',
      'plot hook: lowercase marker',
      'no marker here',
      '   PLOT HOOK:   double spaced   ',
      'Mentions PLOT HOOK: in the middle',
      '',
      'trailing space ',
    ];
    for (const c of cases) expect(normalizePlotHook(c)).toBe(legacyCleanHook(c));
  });
});

describe('collapseDoubledArticles', () => {
  test('folds a lowercase doubled article at a seam join', () => {
    expect(collapseDoubledArticles('reshaped the the lower districts')).toBe('reshaped the lower districts');
    expect(collapseDoubledArticles('flooded the a harbour')).toBe('flooded the harbour');
    expect(collapseDoubledArticles('drowned the an isle')).toBe('drowned the isle');
  });

  test('folds a following CAPITALISED article down to a single lowercase "the "', () => {
    expect(collapseDoubledArticles('reshaped the The lower districts')).toBe('reshaped the lower districts');
    expect(collapseDoubledArticles('by the A great fire')).toBe('by the great fire');
  });

  test('leaves a single, correct article untouched', () => {
    expect(collapseDoubledArticles('the harbour and coastal districts')).toBe('the harbour and coastal districts');
    expect(collapseDoubledArticles('a single article stands')).toBe('a single article stands');
  });

  test('non-string / falsy input coerces to the empty string', () => {
    expect(collapseDoubledArticles(null)).toBe('');
    expect(collapseDoubledArticles(undefined)).toBe('');
    expect(collapseDoubledArticles('')).toBe('');
  });

  test('byte-identical to the generator-side regex pair across a corpus', () => {
    const cases = [
      'reshaped the the lower districts',
      'reshaped the The lower districts',
      'the harbour and coastal districts',
      'by the A great fire and the the flood',
      'no articles at all',
      '',
    ];
    for (const c of cases) expect(collapseDoubledArticles(c)).toBe(legacyArticleCollapse(c));
  });
});
