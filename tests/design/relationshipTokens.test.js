import { describe, expect, test } from 'vitest';

import {
  RELATIONSHIP_TYPE_OPTIONS,
  relationshipEdgeStyle,
  relationshipToken,
} from '../../src/design/relationshipTokens.js';

describe('relationship design tokens', () => {
  test('every selectable relationship has a label and color', () => {
    expect(RELATIONSHIP_TYPE_OPTIONS.length).toBeGreaterThan(6);
    for (const option of RELATIONSHIP_TYPE_OPTIONS) {
      expect(option.id).toBeTruthy();
      expect(option.label).toBeTruthy();
      expect(option.color).toMatch(/^#/);
    }
  });

  test('map edge styles and chip tokens come from the same semantic source', () => {
    const allied = relationshipToken('allied');
    const edge = relationshipEdgeStyle('allied');

    expect(edge.color).toBe(allied.color);
    expect(edge.width).toBeGreaterThan(1);
    expect(edge.priority).toBeGreaterThan(0);
  });

  test('unknown relationship types fall back to neutral styling', () => {
    const unknown = relationshipToken('mystery_pact');
    const edge = relationshipEdgeStyle('mystery_pact');

    expect(unknown.label).toBe('Neutral');
    expect(edge.color).toBe(unknown.color);
  });
});
