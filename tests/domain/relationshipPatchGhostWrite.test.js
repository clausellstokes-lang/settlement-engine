/**
 * relationshipPatchGhostWrite.test.js — THE GHOST-MATERIALIZATION CURE, PINNED
 * AT THE WRITER.
 *
 * `applyRelationshipPatch` is the relationship plane's ONE sanctioned writer. It
 * rebuilt its baseline from an EMPTY edge, so a write addressed to a key whose
 * state record had never been written resolved the type to `neutral` and every
 * axis to NEUTRAL's defaults — and an authored hostile or allied edge came out
 * the other side re-typed. WZ-4 closed that at the razing's call site by carrying
 * the truth across by hand. WZ-5 measured the class instead of assuming its
 * shape: a probe over the domain suite recorded 36 absent-record writes across
 * SEVEN writer sites, including the mainline `applyWorldPulse` path reached
 * through the real kernel. So the cure moved into the writer.
 *
 * THIS FILE PINS THE THREE THINGS THAT CAN GO WRONG, and each fails silently:
 *
 *   1. THE DEFECT IS REAL, IN EVERY POLARITY. Writing through an unmaterialized
 *      key WITHOUT an edge still re-types — driven here so the cure is measured
 *      against a demonstrated failure rather than against a description of one.
 *      Every authored relationship type is driven, not just `hostile`: the bug
 *      was never type-specific and a one-type pin would have looked sufficient.
 *   2. THE CURE WORKS, IN EVERY POLARITY. With the edge, the authored type AND
 *      the type's own axis baseline survive the write.
 *   3. ⚠️ IT IS A NO-OP FOR EVERY MATERIALIZED RECORD. This is the byte-neutrality
 *      anchor and the reason the same-seed hashes did not move. `ensureRelationshipState`
 *      resolves `existing.relationshipType || edge.relationshipType` and every axis
 *      as `existing.x ?? defaults.x`, so a record that exists wins at every field.
 *      A future edit that let the EDGE win would move every live save's
 *      relationship axes at once, and nothing else in the tree would say so.
 *
 * @enforced-by this file
 */
import { describe, expect, test } from 'vitest';

import {
  applyRelationshipPatch,
  ensureRelationshipState,
  edgeBetween,
} from '../../src/domain/worldPulse/relationshipEvolution.js';
import { RELATIONSHIP_DEFAULTS } from '../../src/domain/worldPulse/relationshipState.js';

const KEY = 'rel.karrow.mereth';
const NOW = '2026-08-04T00:00:00.000Z';

/** The authored graph edge for one relationship type. */
const edgeOf = (relationshipType) => ({
  id: KEY, from: 'karrow', to: 'mereth', relationshipType, type: relationshipType,
});

/** One ordinary incident: it moves `fear` and names nothing else. */
const incident = {
  id: 'ghost-write-pin',
  relationshipKey: KEY,
  relationshipPatch: { fear: 0.5 },
  metadata: { incidentType: 'razing_witnessed' },
  proposalPayload: null,
};

/** A world whose relationshipStates has NO record for KEY — the ghost case. */
const unmaterialized = () => ({ tick: 12, relationshipStates: {} });

/**
 * THE POLARITIES. Every authored type the rule matrix knows, so the pin is total
 * over the vocabulary rather than a sample of it. `client` is deliberately
 * included: `normalizeRelationshipEdge` rewrites a client edge to `patron`, and
 * that normalization must survive the write too.
 */
const AUTHORED_TYPES = Object.freeze([
  'neutral', 'trade_partner', 'allied', 'patron', 'vassal',
  'rival', 'cold_war', 'hostile', 'criminal_network',
]);

describe('the defect is real — a write with no edge re-types an authored relationship', () => {
  test('every non-neutral authored type is flattened to `neutral` without the edge', () => {
    const flattened = [];
    for (const type of AUTHORED_TYPES) {
      const written = applyRelationshipPatch(unmaterialized(), incident, NOW);
      if (written.relationshipStates[KEY].relationshipType !== type) flattened.push(type);
    }
    // Everything except `neutral` itself is lost. This is the bug, executed.
    expect(flattened).toEqual(AUTHORED_TYPES.filter((t) => t !== 'neutral'));
  });
});

describe('the cure — the edge carries the truth the record does not have yet', () => {
  test('every authored type survives a write to a record that never existed', () => {
    for (const type of AUTHORED_TYPES) {
      const written = applyRelationshipPatch(unmaterialized(), incident, NOW, edgeOf(type));
      // `client` normalizes to `patron` at the edge; every other type is itself.
      expect(written.relationshipStates[KEY].relationshipType, type).toBe(type);
    }
  });

  test("the untouched axes come from the EDGE's own baseline, not from neutral's", () => {
    // A hostile edge and an allied edge disagree about trust by construction; if
    // the writer were still reading neutral's defaults both would come out equal,
    // and a type-only pin above would not have noticed.
    const hostile = applyRelationshipPatch(unmaterialized(), incident, NOW, edgeOf('hostile'));
    const allied = applyRelationshipPatch(unmaterialized(), incident, NOW, edgeOf('allied'));
    expect(hostile.relationshipStates[KEY].trust).toBe(RELATIONSHIP_DEFAULTS.hostile.trust);
    expect(allied.relationshipStates[KEY].trust).toBe(RELATIONSHIP_DEFAULTS.allied.trust);
    expect(hostile.relationshipStates[KEY].trust).not.toBe(allied.relationshipStates[KEY].trust);
    // And the patch's own axis still wins over both baselines.
    expect(hostile.relationshipStates[KEY].fear).toBe(0.5);
  });

  test('an edge for a DIFFERENT pair is still only consulted for the key it was handed', () => {
    // The writer does not search; it uses what the caller resolved. A caller that
    // hands the wrong edge gets the wrong type — which is why the walker requires
    // the edge to be resolved at the call site that already owns the key.
    const stray = { id: 'rel.other.pair', from: 'x', to: 'y', relationshipType: 'allied' };
    const written = applyRelationshipPatch(unmaterialized(), incident, NOW, stray);
    expect(written.relationshipStates[KEY].relationshipType).toBe('allied');
  });
});

describe('⚠️ THE BYTE-NEUTRALITY ANCHOR — a materialized record is untouched by the edge', () => {
  /** A world whose record for KEY already exists, as the pulse materializes it. */
  const materialized = (type) => ({
    tick: 12,
    relationshipStates: { [KEY]: ensureRelationshipState(edgeOf(type), {}) },
  });

  test('with and without the edge produce IDENTICAL state for every authored type', () => {
    for (const type of AUTHORED_TYPES) {
      const blind = applyRelationshipPatch(materialized(type), incident, NOW);
      const seeing = applyRelationshipPatch(materialized(type), incident, NOW, edgeOf(type));
      expect(JSON.stringify(seeing), type).toBe(JSON.stringify(blind));
    }
  });

  test('a materialized record whose stored type DISAGREES with the edge keeps the STORED one', () => {
    // The record is the world's live truth; the edge is only consulted when the
    // record is silent. If this ever inverted, a save's whole relationship plane
    // would be re-typed from the graph on the next incident.
    const world = {
      tick: 12,
      relationshipStates: { [KEY]: ensureRelationshipState(edgeOf('hostile'), {}) },
    };
    const written = applyRelationshipPatch(world, incident, NOW, edgeOf('allied'));
    expect(written.relationshipStates[KEY].relationshipType).toBe('hostile');
  });
});

describe('the shared edge resolver the four forks collapsed into', () => {
  test('edgeBetween finds the pair in either orientation and invents nothing', () => {
    const edges = [edgeOf('hostile')];
    expect(edgeBetween(edges, 'karrow', 'mereth')).toBe(edges[0]);
    expect(edgeBetween(edges, 'mereth', 'karrow')).toBe(edges[0]);
    expect(edgeBetween(edges, 'karrow', 'stranger')).toBeNull();
    expect(edgeBetween(null, 'karrow', 'mereth')).toBeNull();
    expect(edgeBetween(undefined, 'karrow', 'mereth')).toBeNull();
  });
});
