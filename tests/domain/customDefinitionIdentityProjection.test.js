import { describe, expect, it } from 'vitest';

import {
  mergeCustomDefinitionIdentity,
  projectCustomDefinitionIdentity,
} from '../../src/domain/content/customDefinitionIdentityProjection.js';

describe('custom-definition identity projection', () => {
  it('normalizes immutable revision metadata into generated-entity fields', () => {
    expect(projectCustomDefinitionIdentity({
      definitionId: 'definition:glassworks',
      revisionId: 'revision:glassworks:4',
      revisionNumber: 4,
      contentHash: 'a'.repeat(64),
    })).toEqual({
      customDefinitionId: 'definition:glassworks',
      customDefinitionRevisionId: 'revision:glassworks:4',
      customDefinitionContentHash: 'a'.repeat(64),
      customDefinitionVersion: 4,
      customDefinitionFingerprint: 'a'.repeat(64),
    });
  });

  it('rejects overlong identity instead of truncating it into a false match', () => {
    expect(projectCustomDefinitionIdentity({
      definitionId: `definition:${'x'.repeat(241)}`,
      revisionId: `revision:${'y'.repeat(241)}`,
      contentHash: 'z'.repeat(241),
    })).toEqual({});
  });

  it('clears exact identity when distinct definitions collapse onto one entity', () => {
    const target = {
      name: 'Twin Counsel',
      ...projectCustomDefinitionIdentity({
        definitionId: 'definition:first',
        revisionId: 'revision:first:1',
        contentHash: 'a'.repeat(64),
      }),
    };

    expect(mergeCustomDefinitionIdentity(target, {
      definitionId: 'definition:second',
      revisionId: 'revision:second:1',
      contentHash: 'b'.repeat(64),
    })).toBe('conflict');
    expect(target).toEqual({ name: 'Twin Counsel' });
  });

  it('fails closed when the same definition arrives from a different revision', () => {
    const target = {
      name: 'Revision-crossed service',
      ...projectCustomDefinitionIdentity({
        definitionId: 'definition:shared',
        revisionId: 'revision:shared:1',
        contentHash: 'a'.repeat(64),
      }),
    };

    expect(mergeCustomDefinitionIdentity(target, {
      definitionId: 'definition:shared',
      revisionId: 'revision:shared:2',
      contentHash: 'b'.repeat(64),
    })).toBe('conflict');
    expect(target).toEqual({ name: 'Revision-crossed service' });
  });

  it('fails closed when a claimed revision id carries a different content hash', () => {
    const target = {
      name: 'Hash-crossed service',
      ...projectCustomDefinitionIdentity({
        definitionId: 'definition:shared',
        revisionId: 'revision:shared:1',
        contentHash: 'a'.repeat(64),
      }),
    };

    expect(mergeCustomDefinitionIdentity(target, {
      definitionId: 'definition:shared',
      revisionId: 'revision:shared:1',
      contentHash: 'b'.repeat(64),
    })).toBe('conflict');
    expect(target).toEqual({ name: 'Hash-crossed service' });
  });
});
