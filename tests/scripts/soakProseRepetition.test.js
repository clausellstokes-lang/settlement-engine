/**
 * tests/scripts/soakProseRepetition.test.js — the soak's prose-only repetition instrument
 * (lane SOAK-2, unit 3; docs/SOAK_1000_2026-11-03.md §3: the audit's figure counts STORY
 * sentences only, docs/GENERATION_COHERENCE_AUDIT_2026-11-02.md item 9 "16%").
 *
 * scripts/audit/soak-review/prose.mjs :: proseOfHtml keeps a block only by its SURFACE — a
 * paragraph element set at body size — so labels (spans, badges), reference rows (divs led
 * by a bold label), small-type footers and relationship labels fall away without a word list.
 * :: pairwiseRepeat is the audit's measure: the share of a second settlement's story
 * sentences a DM has already read in the first, averaged over ordered pairs.
 */
import { describe, expect, it } from 'vitest';

import { resolve } from 'node:path';

import { proseOfHtml, storySentencesOf, skeletonOf, pairwiseRepeat, sourcePoolOf } from '../../scripts/audit/soak-review/prose.mjs';

const HTML = [
  '<div style="font-size:11px"><strong>Needs Grain</strong><span> · affects: meals, ale, lodging</span></div>',
  '<span style="font-size:9px;font-weight:800">Outstanding Debt</span>',
  '<p style="font-size:13px;line-height:1.55">The river was here before the town, and the town has never let anyone forget it.</p>',
  '<p data-testid="viability-vintage" style="font-size:11px;margin:6px 0 0">Judged at the first survey; not re-run since.</p>',
  '<p>A plain paragraph with no size of its own reads at body size and counts as story.</p>',
  '<p style="font-size:11px">Watertight barrels for ale, wine, salted meat, and fish. Essential packaging.</p>',
  '<p style="font-size:12.5px">The relationship between Anna &amp; Piotr is best understood as an old debt.</p>',
].join('');

describe('soak prose repetition — the surface filter', () => {
  it('keeps body-size paragraphs and drops labels, reference rows, small-type footers and badges', () => {
    expect(proseOfHtml(HTML)).toEqual([
      'The river was here before the town, and the town has never let anyone forget it.',
      'A plain paragraph with no size of its own reads at body size and counts as story.',
      'The relationship between Anna & Piotr is best understood as an old debt.',
    ]);
  });

  it('a story sentence is a complete sentence of six words or more', () => {
    expect(storySentencesOf(['Too short to count.', 'The mill turns when the river runs high in spring. It stops in August']))
      .toEqual(['the mill turns when the river runs high in spring.']);
  });

  it('a skeleton masks the place\'s own names and every number', () => {
    expect(skeletonOf('kovno keeps 3,200 sheep beside anna kowal\'s mill.', ['Anna Kowal', 'Kovno']))
      .toBe('@ keeps # sheep beside @\'s mill.');
  });

  it('pairwiseRepeat is the mean, over ordered pairs, of the share of B already read in A', () => {
    // A = {x, y}, B = {x, z}, C = {w}: B→A 1/2, A→B 1/2, others 0 → mean over 6 ordered pairs = 1/6.
    const towns = [{ tier: 'town', sentences: ['x', 'y'] }, { tier: 'town', sentences: ['x', 'z'] }, { tier: 'city', sentences: ['w'] }];
    const r = pairwiseRepeat(towns);
    expect(r.all).toBeCloseTo(1 / 6, 6);
    expect(r.sameTier).toBeCloseTo(1 / 2, 6); // only the A/B pair is same-tier
    expect(r.maxSameTier).toBeCloseTo(1 / 2, 6);
  });

  it('sourcePoolOf names the file and symbol a skeleton\'s words live in (a tab\'s own copy lives under src/components/)', () => {
    const src = sourcePoolOf('beside each telling, what the dm knows to be true.', resolve(__dirname, '../..'));
    expect(src?.file).toBe('src/components/new/tabs/RumorsTab.jsx');
    expect(sourcePoolOf('@ @ # @', resolve(__dirname, '../..'))).toBeNull();
  });
});
