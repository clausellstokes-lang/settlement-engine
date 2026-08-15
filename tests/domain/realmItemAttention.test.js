import { describe, expect, test } from 'vitest';

import {
  REALM_ATTENTION_CLASSES,
  REALM_ATTENTION_DEFINITIONS,
  realmAttentionDefinition,
  realmAttentionRank,
} from '../../src/domain/realm/realmItemAttention.js';

describe('RealmItem attention vocabulary', () => {
  test('pins the complete six-class order used by the Game Grade brief', () => {
    expect(REALM_ATTENTION_CLASSES).toEqual([
      'blocking_decision',
      'lapsed_order',
      'critical_condition',
      'major_change',
      'emerging_pressure',
      'routine_record',
    ]);
    expect(REALM_ATTENTION_CLASSES.map(realmAttentionRank)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  test('gives every class one reader-facing label and one explanatory reason', () => {
    for (const attentionClass of REALM_ATTENTION_CLASSES) {
      const definition = REALM_ATTENTION_DEFINITIONS[attentionClass];
      expect(definition.label.trim()).not.toBe('');
      expect(definition.reason.trim()).not.toBe('');
      expect(definition.reason).not.toMatch(/[_-][a-z]/i);
    }
  });

  test('does not promote an unknown imported class', () => {
    expect(realmAttentionDefinition('future_unknown')).toBe(
      REALM_ATTENTION_DEFINITIONS.routine_record,
    );
    expect(realmAttentionRank('future_unknown')).toBe(Number.POSITIVE_INFINITY);
  });
});

