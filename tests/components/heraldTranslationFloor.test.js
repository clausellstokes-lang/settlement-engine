import { describe, expect, test } from 'vitest';

import { toHeraldItem } from '../../src/components/map/heraldFeed.js';
import { reasonOf } from '../../src/components/map/heraldGrammar.js';

describe('Herald translation floor', () => {
  test('an unlabelled source falls back by editorial section, never by kind/type token', () => {
    const item = toHeraldItem({
      id: 'raw-source',
      candidateType: 'internal_candidate_type',
      type: 'internal-record',
    }, 'war');

    expect(item.kind).toBe('internal_candidate_type');
    expect(item.headline).toBe('A military report from the realm');
    expect(item.headline).not.toMatch(/internal|candidate|type/i);
  });

  test('an authored label remains the readable fallback when no headline exists', () => {
    const item = toHeraldItem({
      id: 'labelled-source',
      type: 'disease_outbreak',
      label: 'The red cough',
    }, 'events');

    expect(item.headline).toBe('The red cough');
  });

  test('reason slots share Wizard News fiction-register phrases', () => {
    expect(reasonOf({ reasons: ['critical_impact_type'] })).toBe('a matter that cuts deep');
    expect(reasonOf({ reasons: ['unmapped-reason'] })).toBe('unmapped reason');
  });
});
