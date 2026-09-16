import { describe, expect, it } from 'vitest';
import {
  contentFieldTruth,
  projectContentEffects,
} from '../../src/domain/content/contentEffectProjection.js';

describe('custom-content effect projection', () => {
  it('derives four honest display labels from category-specific contracts', () => {
    expect(contentFieldTruth('institutions', 'name').label).toBe('presentation');
    expect(contentFieldTruth('institutions', 'essential').label).toBe('conditional');
    expect(contentFieldTruth('institutions', 'teleports').label).toBe('unsupported');
    expect(contentFieldTruth('deities', 'alignmentAxis').label).toBe('conditional');
    expect(contentFieldTruth('deities', 'temperamentAxis')).toMatchObject({
      label: 'presentation',
      effectKind: 'presentation',
      activation: 'always',
      consumers: ['deitySnapshot'],
    });
    expect(contentFieldTruth('tradeGoods', 'satisfies', 'military').label).toBe('conditional');
    expect(contentFieldTruth('tradeGoods', 'satisfies', 'custom-curios').label).toBe('presentation');
  });

  it('does not grant a field authority merely because another bucket owns it', () => {
    expect(contentFieldTruth('traditions', 'foodImpact').label).toBe('unsupported');
    expect(contentFieldTruth('resources', 'rankAxis').label).toBe('unsupported');
  });

  it('reports mapping and registered consumers without provider-authored claims', () => {
    const report = projectContentEffects({
      entries: [{
        bucket: 'institutions',
        entry: {
          name: 'Haunted Glassworks',
          essential: true,
          description: 'Moonlit furnaces sing.',
          teleports: true,
        },
      }],
      unsupported: [{ requested: 'teleport network', reason: 'unregistered_field' }],
      assumptions: ['Interpreted the glassworks as an institution.'],
    }, { 0: { action: 'approve' } });

    expect(report.totals).toMatchObject({
      conditional: 1,
      presentation: 2,
      unsupported: 2,
    });
    expect(report.entries[0].mechanicalConsumers).toEqual([
      'assembleInstitutions',
    ]);
    expect(report.entries[0].presentationConsumers).toEqual([
      'compendium',
      'customRegistry',
      'dossier',
    ]);
    expect(report.assumptions[0]).toMatch(/institution/i);
  });
});
