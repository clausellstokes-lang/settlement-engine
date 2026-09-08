import { describe, expect, it } from 'vitest';
import {
  directionalRelationshipLabel,
  relationshipDefinition,
  relationshipLinkMetadata,
} from '../../src/domain/relationships/canonicalRelationship.js';

// #4 — DIRECTIONALITY. For the two asymmetric pairs (overlord/vassal,
// patron/client) the neighbour-link label must state WHICH SIDE this settlement
// is, naming the neighbour ("Overlord of X" vs "Vassal to X"). Symmetric links and
// legacy rows fall back to null so the caller keeps its existing label.

// Build the link row exactly as the link composer does: relationshipDefinition →
// relationshipLinkMetadata stamps localRelationshipRole off the canonical role.
function linkFor(selection) {
  const def = relationshipDefinition(selection, 'home', 'partner');
  return relationshipLinkMetadata(def, def.sourceRole);
}

describe('#4 directionalRelationshipLabel', () => {
  it('labels the overlord side as "Overlord of {neighbour}"', () => {
    expect(directionalRelationshipLabel(linkFor('overlord_of'), 'Thornmere')).toBe('Overlord of Thornmere');
  });

  it('labels the vassal side as "Vassal to {neighbour}"', () => {
    expect(directionalRelationshipLabel(linkFor('vassal_of'), 'Ironhold')).toBe('Vassal to Ironhold');
  });

  it('labels the patron side as "Patron of {neighbour}"', () => {
    expect(directionalRelationshipLabel(linkFor('patron_of'), 'Saltmarsh')).toBe('Patron of Saltmarsh');
  });

  it('labels the client side as "Client of {neighbour}"', () => {
    expect(directionalRelationshipLabel(linkFor('client_of'), 'Highkeep')).toBe('Client of Highkeep');
  });

  it('reads the role off the legacy displayRelationshipType fallback', () => {
    expect(directionalRelationshipLabel({ displayRelationshipType: 'overlord' }, 'Thornmere')).toBe('Overlord of Thornmere');
  });

  it('returns null for symmetric relationships (no direction needed)', () => {
    for (const sel of ['allied', 'hostile', 'trade_partner', 'rival', 'cold_war']) {
      expect(directionalRelationshipLabel(linkFor(sel), 'Anywhere')).toBeNull();
    }
  });

  it('returns null for a legacy row with no role and for a missing neighbour name', () => {
    expect(directionalRelationshipLabel({ relationshipType: 'vassal' }, 'Thornmere')).toBeNull();
    expect(directionalRelationshipLabel(linkFor('overlord_of'), '')).toBeNull();
  });
});
