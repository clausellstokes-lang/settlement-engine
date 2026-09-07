import { describe, expect, it } from 'vitest';
import {
  canonicalEdgeForLink,
  localPropagationType,
  relationshipDefinition,
  relationshipLinkMetadata,
  rolesForCanonicalEdge,
} from '../../src/domain/relationships/canonicalRelationship.js';
import { deriveRegionalGraphFromSaves } from '../../src/domain/region/graph.js';

function save(id, tier, population) {
  return {
    id,
    name: id,
    tier,
    settlement: { name: id, tier, population, neighbourNetwork: [] },
  };
}

describe('canonical relationship direction', () => {
  it('stores patron and client selections as patron -> client', () => {
    expect(relationshipDefinition('patron_of', 'a', 'b')).toMatchObject({
      relationshipType: 'patron', from: 'a', to: 'b',
      sourceRole: 'patron', targetRole: 'client',
    });
    expect(relationshipDefinition('client_of', 'a', 'b')).toMatchObject({
      relationshipType: 'patron', from: 'b', to: 'a',
      sourceRole: 'client', targetRole: 'patron',
    });
  });

  it('stores overlord and vassal selections as overlord -> vassal', () => {
    const edge = relationshipDefinition('vassal_of', 'a', 'b');
    expect(edge).toMatchObject({ relationshipType: 'vassal', from: 'b', to: 'a' });
    expect(rolesForCanonicalEdge(edge, 'a', 'b')).toEqual({
      sourceRole: 'vassal', targetRole: 'overlord',
    });
  });

  it('uses local role for asymmetric modifier meaning', () => {
    const definition = relationshipDefinition('client_of', 'a', 'b');
    expect(localPropagationType(relationshipLinkMetadata(definition, 'client'))).toBe('patron');
    expect(localPropagationType(relationshipLinkMetadata(definition, 'patron'))).toBe('client');
  });

  it('infers stronger legacy endpoint as hierarchical authority', () => {
    const village = save('village', 'village', 400);
    const city = save('city', 'city', 12000);
    expect(canonicalEdgeForLink({ relationshipType: 'vassal' }, village, city)).toEqual({
      relationshipType: 'vassal', from: 'city', to: 'village',
    });
  });

  it('deduplicates mirrored neighbour records into one regional edge', () => {
    const a = save('a', 'city', 12000);
    const b = save('b', 'village', 500);
    const definition = relationshipDefinition('overlord_of', 'a', 'b');
    a.settlement.neighbourNetwork = [{
      id: 'b', linkId: 'shared', ...relationshipLinkMetadata(definition, 'overlord'),
    }];
    b.settlement.neighbourNetwork = [{
      id: 'a', linkId: 'shared', ...relationshipLinkMetadata(definition, 'vassal'),
    }];
    const graph = deriveRegionalGraphFromSaves([a, b]);
    expect(graph.edges).toHaveLength(1);
    expect(graph.edges[0]).toMatchObject({ from: 'a', to: 'b', relationshipType: 'vassal' });
  });
});
