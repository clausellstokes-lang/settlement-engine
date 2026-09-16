/**
 * Parity pins for the compact first-paint admission contract.
 *
 * The rich authoring adapter may add review labels, but it must never disagree
 * with the compact persistence wall about accepted data or error ordering.
 */

import { describe, expect, it } from 'vitest';

import {
  admitCustomContentDefinitionShape,
} from '../../src/domain/content/customContentAdmission.js';
import {
  admitCustomContentDefinition,
} from '../../src/domain/content/customContentManifest.js';

function withoutRichLabels(admission) {
  return {
    ...admission,
    fieldLabels: [],
  };
}

describe('compact custom-content admission', () => {
  it.each([
    {
      name: 'unknown bucket',
      bucket: 'starships',
      value: { name: 'Wayfarer' },
      options: {},
    },
    {
      name: 'non-object definition',
      bucket: 'resources',
      value: ['ore'],
      options: {},
    },
    {
      name: 'missing required field',
      bucket: 'resources',
      value: { scarcity: 'scarce' },
      options: {},
    },
    {
      name: 'unknown field',
      bucket: 'resources',
      value: { name: 'Star iron', warpYield: 10 },
      options: {},
    },
    {
      name: 'invalid enum',
      bucket: 'resources',
      value: { name: 'Star iron', scarcity: 'mythic-plus' },
      options: {},
    },
    {
      name: 'admitted persistence envelope',
      bucket: 'resources',
      value: {
        name: 'Star iron',
        localUid: '  local-star-iron  ',
        isCustom: true,
      },
      options: { allowSystemFields: true },
    },
    {
      name: 'invalid persistence identity',
      bucket: 'resources',
      value: { name: 'Star iron', localUid: '   ' },
      options: { allowSystemFields: true },
    },
    {
      name: 'partial editor definition',
      bucket: 'resources',
      value: { scarcity: 'scarce' },
      options: { requireRequired: false },
    },
  ])('matches rich admission for $name', ({ bucket, value, options }) => {
    const compact = admitCustomContentDefinitionShape(bucket, value, options);
    const rich = admitCustomContentDefinition(bucket, value, options);

    expect(compact).toEqual(withoutRichLabels(rich));
    expect(compact.entry).toBe(compact.definition);
  });
});
