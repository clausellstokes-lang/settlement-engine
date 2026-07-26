import { describe, expect, it } from 'vitest';
import { buildCustomContentUsage } from '../../src/domain/content/customContentUsage.js';

describe('custom-content usage echo', () => {
  const item = {
    localUid: 'glassworks',
    name: 'Haunted Glassworks',
    tierMin: 'village',
  };

  it('prefers stable-reference evidence and distinguishes activation', () => {
    const usage = buildCustomContentUsage({
      bucket: 'institutions',
      item,
      savedSettlements: [{
        id: 's1',
        name: 'Ashford',
        settlement: {
          institutions: [{
            name: item.name,
            localUid: item.localUid,
            source: 'custom',
          }],
          simulationTrace: [{
            targetId: `institution.${item.localUid}`,
            result: 'present',
            causes: [{ source: 'custom' }],
          }],
          townMap: {
            buildings: [{ customContentRef: `custom:${item.localUid}` }],
          },
        },
      }],
    });

    expect(usage.settlements).toEqual([
      expect.objectContaining({
        id: 's1',
        confidence: 'exact',
        mechanicallyActive: true,
      }),
    ]);
    expect(usage.counts.activations).toBe(1);
    expect(usage.counts.mapStructures).toBe(1);
  });

  it('labels name-only legacy usage as inferred rather than exact', () => {
    const usage = buildCustomContentUsage({
      bucket: 'resources',
      item,
      savedSettlements: [{
        id: 'legacy',
        settlement: { nearbyResourcesCustom: [item.name] },
      }],
    });
    expect(usage.settlements[0].confidence).toBe('legacy-name');
    expect(usage.settlements[0].mechanicallyActive).toBe(false);
  });

  it('finds inferred custom-resource usage at the current generated address', () => {
    const usage = buildCustomContentUsage({
      bucket: 'resources',
      item,
      savedSettlements: [{
        id: 'current-resource-shape',
        settlement: {
          config: {
            nearbyResourcesCustom: [item.name],
          },
        },
      }],
    });

    expect(usage.settlements).toEqual([
      expect.objectContaining({
        id: 'current-resource-shape',
        confidence: 'legacy-name',
        evidence: ['custom-resource-name'],
      }),
    ]);
  });

  it('finds inferred trade-good usage in the current directional label object', () => {
    const usage = buildCustomContentUsage({
      bucket: 'tradeGoods',
      item: {
        localUid: 'moon-glass',
        name: 'Moon Glass',
      },
      savedSettlements: [{
        id: 'current-trade-shape',
        settlement: {
          economicState: {
            customTradeLabels: {
              exports: ['Moon Glass'],
              imports: [],
            },
          },
        },
      }],
    });

    expect(usage.settlements).toEqual([
      expect.objectContaining({
        id: 'current-trade-shape',
        confidence: 'legacy-name',
        evidence: ['economy-customTradeLabels'],
      }),
    ]);
  });

  it('recognizes immutable definition ids and retains their corroborating hashes', () => {
    const versionedItem = {
      ...item,
      definitionId: 'definition:glassworks',
      revisionId: 'revision:glassworks:4',
      contentHash: 'sha256:glassworks-revision-four',
    };
    const usage = buildCustomContentUsage({
      bucket: 'institutions',
      item: versionedItem,
      savedSettlements: [{
        id: 'versioned',
        settlement: {
          townMap: {
            buildings: [{
              customDefinitionId: versionedItem.definitionId,
              customDefinitionContentHash: versionedItem.contentHash,
            }],
          },
        },
      }],
    });

    expect(usage.definition).toMatchObject({
      definitionId: versionedItem.definitionId,
      revisionId: versionedItem.revisionId,
      contentHash: versionedItem.contentHash,
    });
    expect(usage.settlements).toEqual([
      expect.objectContaining({
        id: 'versioned',
        confidence: 'exact',
      }),
    ]);
    expect(usage.counts.mapStructures).toBeGreaterThan(0);
  });

  it('never treats a shared hash or fingerprint as definition-exact identity', () => {
    const sharedHash = 'f'.repeat(64);
    const settlement = {
      townMap: {
        buildings: [{
          customDefinitionContentHash: sharedHash,
          customDefinitionFingerprint: sharedHash,
        }],
      },
    };
    const first = buildCustomContentUsage({
      bucket: 'institutions',
      item: {
        ...item,
        localUid: 'shared-digest-a',
        definitionId: 'definition:shared-digest-a',
        revisionId: 'revision:shared-digest-a:1',
        contentHash: sharedHash,
        fingerprint: sharedHash,
      },
      savedSettlements: [{ id: 'hash-only', settlement }],
    });
    const second = buildCustomContentUsage({
      bucket: 'institutions',
      item: {
        ...item,
        localUid: 'shared-digest-b',
        definitionId: 'definition:shared-digest-b',
        revisionId: 'revision:shared-digest-b:1',
        contentHash: sharedHash,
        fingerprint: sharedHash,
      },
      savedSettlements: [{ id: 'hash-only', settlement }],
    });

    expect(first.settlements).toEqual([]);
    expect(second.settlements).toEqual([]);
  });

  it('recognizes the settlement materialization receipt as exact usage', () => {
    const versionedItem = {
      ...item,
      definitionId: 'definition:glassworks',
      revisionId: 'revision:glassworks:5',
      contentHash: 'a'.repeat(64),
    };
    const usage = buildCustomContentUsage({
      bucket: 'institutions',
      item: versionedItem,
      savedSettlements: [{
        id: 'receipt-backed',
        settlement: {
          customContentProvenance: {
            schemaVersion: 1,
            materializedDefinitions: [{
              category: 'institutions',
              definitionId: versionedItem.definitionId,
              revisionId: versionedItem.revisionId,
              contentHash: versionedItem.contentHash,
              surfaces: ['institutions'],
            }],
          },
        },
      }],
    });

    expect(usage.settlements).toEqual([
      expect.objectContaining({
        id: 'receipt-backed',
        confidence: 'exact',
      }),
    ]);
  });

  it('reports dependents and Herald mentions without making them mechanics', () => {
    const usage = buildCustomContentUsage({
      bucket: 'institutions',
      item,
      customContent: {
        services: [{
          localUid: 'service',
          name: 'Glass blessing',
          providedBy: `custom:${item.localUid}`,
        }],
      },
      campaigns: [{
        id: 'c1',
        name: 'Ember Coast',
        wizardNews: {
          entries: [{ id: 'h1', headline: `${item.name} closes after midnight` }],
        },
      }],
    });
    expect(usage.dependents[0]).toMatchObject({
      name: 'Glass blessing',
      field: 'providedBy',
    });
    expect(usage.heraldMentions[0]).toMatchObject({
      source: 'Herald',
      confidence: 'legacy-name',
    });
  });

  it('does not promote identifier-prefix collisions into exact usage', () => {
    const usage = buildCustomContentUsage({
      bucket: 'institutions',
      item: {
        localUid: 'lu_a',
        name: 'Target House',
      },
      savedSettlements: [{
        id: 's1',
        settlement: {
          placements: [{ customRef: 'custom:lu_a' }],
          simulationTrace: [{
            source: 'engine',
            reference: 'custom:lu_ab',
            result: 'unrelated',
          }],
        },
      }],
      campaigns: [{
        id: 'c1',
        chronicles: [{
          id: 'h1',
          title: 'Another definition',
          customContentRef: 'custom:lu_ab',
        }],
      }],
    });

    expect(usage.settlements[0]).toMatchObject({
      id: 's1',
      confidence: 'exact',
      mechanicallyActive: false,
    });
    expect(usage.activations).toEqual([]);
    expect(usage.heraldMentions).toEqual([]);
    expect(usage.campaigns).toEqual([]);
  });

  it('does not treat an opaque token pasted into prose as exact provenance', () => {
    const usage = buildCustomContentUsage({
      bucket: 'institutions',
      item: {
        localUid: 'lu_a',
        name: 'Target House',
      },
      savedSettlements: [{
        id: 'notes-only',
        settlement: {
          notes: 'lu_a',
          description: 'The old record mentions custom:lu_a.',
        },
      }],
    });

    expect(usage.settlements).toEqual([]);
    expect(usage.activations).toEqual([]);
    expect(usage.mapStructures).toEqual([]);
  });

  it('recognizes a complete token inside a structured trace identifier', () => {
    const usage = buildCustomContentUsage({
      bucket: 'institutions',
      item,
      savedSettlements: [{
        id: 'structured-ref',
        settlement: {
          institutions: [{
            name: item.name,
            localUid: item.localUid,
            source: 'custom',
          }],
          simulationTrace: [{
            targetId: `institution.${item.localUid}`,
            result: 'present',
          }],
        },
      }],
    });

    expect(usage.activations).toEqual([
      expect.objectContaining({
        settlementId: 'structured-ref',
        confidence: 'exact',
      }),
    ]);
  });
});
