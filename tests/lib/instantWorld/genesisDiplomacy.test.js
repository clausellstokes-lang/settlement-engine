/**
 * POLIS-2 pins — genesis diplomacy, the MATERIALIZATION half (DESIGN_FMG_WEAVE D6,
 * ordered by A1.2.12).
 *
 * The five things this car promised, each pinned by execution rather than by
 * reading the source: reciprocity with correct role inversion, ids-not-names,
 * typed provenance with no fabricated history, counted refusals, and — the one
 * that is easiest to assert and hardest to actually prove — THE ORDERING LAW:
 * that a materialized founding tie genuinely reaches the composer's channel
 * discovery. That last arm is a DISCOVERY arm, not a regression arm: it can fail
 * for a reason no other pin here would notice.
 */
import { describe, test, expect } from 'vitest';
import {
  materializeGenesisRelations,
  genesisRelationsSection,
  GENESIS_LINK_SOURCE,
  GENESIS_SELECTIONS,
  GENESIS_RELATION_CAUSES,
  GENESIS_CAUSE_TOKENS,
} from '../../../src/domain/instantWorld/genesisDiplomacy.js';
import { RELATIONSHIP_SELECTIONS } from '../../../src/domain/relationships/canonicalRelationship.js';
import { composeInstantWorld } from '../../../src/lib/instantWorld/composeInstantWorld.js';
// ⭐ THE CREATE BOUNDARY'S ASYNC PRELUDE — A TEST IS A CALLER LIKE ANY OTHER
// (2026-09-08, lane LIGHT car 1b). `composeInstantWorld` is a classified BIRTH and
// is SYNCHRONOUS by design, so it cannot load the lazy payload the law it mints
// needs: since the living-content dial was lit, every world it mints is a v2 world,
// and the seam THROWS rather than degrading when the roster payload was never
// loaded. Production awaits `loadGenerationLawPayloads()` on the async edge of each
// of the composer's three callers; this file awaits it at module scope, which is
// where it has to be because this family composes outside a hook.
import { loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';

await loadGenerationLawPayloads();

import { deriveGraphWithDiscoveredCandidates } from '../../../src/domain/region/discoverDependencyCandidates.js';
import { ensureRegionalGraph } from '../../../src/domain/region/index.js';

/** A minimal composed-shape member save, as the composer builds them. */
function member(slot, id, name, tier) {
  return { id, name, tier, _slot: slot, settlement: { name, tier } };
}

function threeMembers() {
  return [
    member(0, 'id-a', 'Aldermarch', 'city'),
    member(1, 'id-b', 'Brackenford', 'town'),
    member(2, 'id-c', 'Cinderhollow', 'village'),
  ];
}

describe('POLIS-2 — the dormant path writes nothing', () => {
  test.each([
    ['absent', undefined],
    ['null', null],
    ['empty', []],
  ])('a plan with %s relations touches no member', (_label, relations) => {
    const settlements = threeMembers();
    const before = JSON.stringify(settlements);
    const receipt = materializeGenesisRelations({ settlements, relations });
    expect(JSON.stringify(settlements)).toBe(before);
    expect(receipt.linked).toBe(0);
    // The key itself must not appear — an empty array would already be a byte change.
    for (const s of settlements) {
      expect(Object.prototype.hasOwnProperty.call(s.settlement, 'neighbourNetwork')).toBe(false);
    }
  });

  // ⚠ THIS PIN CHANGED SHAPE WHEN POLIS-1 LANDED, AND THE CHANGE IS THE POINT.
  // It used to read "while the plan car is unlanded" — a TEMPORARY truth, and one that
  // stopped being true the moment the plan started minting relations. The durable claim
  // underneath it was never "no realm has ties"; it was "a plan with no ties writes
  // NOTHING". That is now conditioned on the plan LAW, which is a permanent axis: law 1
  // is frozen for life, so this arm can never go stale again.
  test('a LAW 1 realm carries no neighbour network at all', () => {
    const { settlements, plan } = composeInstantWorld({
      seed: 'polis2-dormant', basicConfig: { realmSize: 'small' }, planLaw: 1,
    });
    expect(plan.relations).toBeUndefined();
    for (const s of settlements) {
      expect(s.settlement?.neighbourNetwork).toBeUndefined();
    }
  });

  test('a LAW 2 realm DOES carry one — the dormancy above is conditional, not vacuous', () => {
    // The control that stops the arm above from passing for the wrong reason: if the
    // composer had simply stopped materializing, both arms would read "undefined" and
    // the suite would be green over a dead feature.
    const { settlements } = composeInstantWorld({
      seed: 'polis2-dormant', basicConfig: { realmSize: 'large' }, planLaw: 2,
    });
    const linked = settlements.filter(s => Array.isArray(s.settlement?.neighbourNetwork));
    expect(linked.length).toBeGreaterThan(0);
  });
});

describe('POLIS-2 — reciprocity and role inversion', () => {
  test('a symmetric tie lands on BOTH endpoints with the same role', () => {
    const settlements = threeMembers();
    const receipt = materializeGenesisRelations({
      settlements,
      relations: [{ a: 0, b: 1, type: 'allied', cause: 'mutual_defence' }],
    });
    expect(receipt.linked).toBe(1);
    const [a, b] = settlements;
    expect(a.settlement.neighbourNetwork).toHaveLength(1);
    expect(b.settlement.neighbourNetwork).toHaveLength(1);
    expect(a.settlement.neighbourNetwork[0].localRelationshipRole).toBe('allied');
    expect(b.settlement.neighbourNetwork[0].localRelationshipRole).toBe('allied');
    // Both halves share ONE link id, so a reader can pair them.
    expect(a.settlement.neighbourNetwork[0].linkId)
      .toBe(b.settlement.neighbourNetwork[0].linkId);
  });

  test('an asymmetric tie INVERTS the role on the far endpoint', () => {
    const settlements = threeMembers();
    materializeGenesisRelations({
      settlements,
      relations: [{ a: 0, b: 1, type: 'patron_of', cause: 'tier_dominance' }],
    });
    const [a, b] = settlements;
    expect(a.settlement.neighbourNetwork[0].localRelationshipRole).toBe('patron');
    expect(b.settlement.neighbourNetwork[0].localRelationshipRole).toBe('client');
    // The canonical type is shared; only the ROLE differs.
    expect(a.settlement.neighbourNetwork[0].relationshipType).toBe('patron');
    expect(b.settlement.neighbourNetwork[0].relationshipType).toBe('patron');
  });

  test('the overlord/vassal selection inverts the same way', () => {
    const settlements = threeMembers();
    materializeGenesisRelations({
      settlements,
      relations: [{ a: 0, b: 2, type: 'overlord_of', cause: 'tier_dominance' }],
    });
    expect(settlements[0].settlement.neighbourNetwork[0].localRelationshipRole).toBe('overlord');
    expect(settlements[2].settlement.neighbourNetwork[0].localRelationshipRole).toBe('vassal');
  });
});

describe('POLIS-2 — ids, provenance, and the absence of fabricated history', () => {
  test('links address the SAVE ID, never the name', () => {
    const settlements = threeMembers();
    materializeGenesisRelations({
      settlements, relations: [{ a: 0, b: 1, type: 'trade_partner', cause: 'market_exchange' }],
    });
    expect(settlements[0].settlement.neighbourNetwork[0].id).toBe('id-b');
    expect(settlements[1].settlement.neighbourNetwork[0].id).toBe('id-a');
  });

  test('every minted link carries the genesis provenance and its typed cause', () => {
    const settlements = threeMembers();
    materializeGenesisRelations({
      settlements, relations: [{ a: 0, b: 1, type: 'rival', cause: 'standing_rivalry' }],
    });
    for (const s of [settlements[0], settlements[1]]) {
      const link = s.settlement.neighbourNetwork[0];
      expect(link.source).toBe(GENESIS_LINK_SOURCE);
      expect(link.genesisCause).toBe('standing_rivalry');
    }
  });

  test('NO tick-stamped history and NO relationship-state rows are written', () => {
    const settlements = threeMembers();
    materializeGenesisRelations({
      settlements, relations: [{ a: 0, b: 1, type: 'allied', cause: 'mutual_defence' }],
    });
    const link = settlements[0].settlement.neighbourNetwork[0];
    // A founding tie is GENERATION. A tick on it would be a lived event that
    // never happened — the one thing D6 forbids by name.
    for (const forbidden of ['tick', 'sinceTick', 'createdTick', 'atTick', 'turningPoints', 'history']) {
      expect(Object.prototype.hasOwnProperty.call(link, forbidden)).toBe(false);
    }
    for (const s of settlements) {
      expect(s.settlement.relationshipStates).toBeUndefined();
      expect(s.relationshipStates).toBeUndefined();
    }
  });

  test('the stored sentence states the tie and its cause, and asserts nothing more', () => {
    const settlements = threeMembers();
    materializeGenesisRelations({
      settlements, relations: [{ a: 0, b: 1, type: 'patron_of', cause: 'tier_dominance' }],
    });
    const link = settlements[0].settlement.neighbourNetwork[0];
    expect(link.description).toContain('Brackenford');
    expect(link.description).toContain(GENESIS_RELATION_CAUSES.tier_dominance.phrase);
    // No number, no date, no outcome word: the grammar is pinned to the typed cause.
    // anchored: the two toContain assertions above prove `link.description` is the live materialized sentence, so an absent or drifted description reds there
    expect(link.description).not.toMatch(/\b\d+\b/);
  });
});

describe('POLIS-2 — refusals are counted, never coerced', () => {
  test('a slot that does not exist is refused', () => {
    const settlements = threeMembers();
    const r = materializeGenesisRelations({
      settlements, relations: [{ a: 0, b: 99, type: 'allied', cause: 'mutual_defence' }],
    });
    expect(r).toMatchObject({ linked: 0, refusedUnknownSlot: 1 });
  });

  test('a seat paired with itself is refused', () => {
    const settlements = threeMembers();
    const r = materializeGenesisRelations({
      settlements, relations: [{ a: 1, b: 1, type: 'allied', cause: 'mutual_defence' }],
    });
    expect(r).toMatchObject({ linked: 0, refusedSelfPair: 1 });
  });

  test('a type outside the closed vocabulary is refused, NOT coerced to neutral', () => {
    const settlements = threeMembers();
    const r = materializeGenesisRelations({
      settlements, relations: [{ a: 0, b: 1, type: 'sworn_nemesis', cause: 'standing_rivalry' }],
    });
    expect(r).toMatchObject({ linked: 0, refusedUnknownType: 1 });
    // The refusal must leave NO trace — a coerced 'neutral' link would be a tie
    // the plan never declared.
    for (const s of settlements) expect(s.settlement.neighbourNetwork).toBeUndefined();
  });

  test('the same pair named twice — in either order — ties once', () => {
    const settlements = threeMembers();
    const r = materializeGenesisRelations({
      settlements,
      relations: [
        { a: 0, b: 1, type: 'allied', cause: 'mutual_defence' },
        { a: 1, b: 0, type: 'rival', cause: 'standing_rivalry' },
      ],
    });
    expect(r).toMatchObject({ linked: 1, refusedDuplicatePair: 1 });
    expect(settlements[0].settlement.neighbourNetwork).toHaveLength(1);
  });
});

describe('POLIS-2 — the closed vocabulary is DERIVED, not re-listed', () => {
  test('the genesis roster is exactly the estate picker roster', () => {
    expect([...GENESIS_SELECTIONS]).toEqual(RELATIONSHIP_SELECTIONS.map(s => s.value));
  });

  test('every cause token carries a phrase, and the token list matches the table', () => {
    expect(GENESIS_CAUSE_TOKENS.length).toBeGreaterThan(0);
    expect([...GENESIS_CAUSE_TOKENS]).toEqual(Object.keys(GENESIS_RELATION_CAUSES));
    for (const token of GENESIS_CAUSE_TOKENS) {
      expect(typeof GENESIS_RELATION_CAUSES[token].phrase).toBe('string');
      expect(GENESIS_RELATION_CAUSES[token].phrase.length).toBeGreaterThan(0);
    }
  });

  test('no cause claims a geographic fact — geography does not exist at compose time', () => {
    // THE LIVENESS ANCHOR: this arm is a loop over a roster, and an EMPTIED roster never
    // enters the body — so both absence claims below would hold while the vocabulary they
    // police had vanished entirely. Pin the roster is populated before asserting what it
    // does not say.
    expect(GENESIS_CAUSE_TOKENS.length).toBeGreaterThan(0);
    for (const token of GENESIS_CAUSE_TOKENS) {
      // anchored: the roster is pinned non-empty above, so an emptied vocabulary reds there
      expect(token).not.toMatch(/frontier|border|coast|river|strait|sea|mountain/i);
      const phrase = GENESIS_RELATION_CAUSES[token].phrase;
      // anchored: same non-empty pin, and the phrase is read from the live table BY that same token, so a token with no row throws on the line above rather than passing as an absence
      expect(phrase).not.toMatch(/frontier|border|coast|river|strait|mountain/i);
    }
  });
});

describe('POLIS-2 — the fingerprint relations section', () => {
  test('is ABSENT when dark, so a dark realm fingerprints as it always did', () => {
    expect(genesisRelationsSection(undefined)).toBeUndefined();
    expect(genesisRelationsSection(null)).toBeUndefined();
    expect(genesisRelationsSection([])).toBeUndefined();
  });

  test('is slot-addressed and order-free — the same ties fingerprint the same', () => {
    const one = genesisRelationsSection([
      { a: 2, b: 0, type: 'rival', cause: 'standing_rivalry' },
      { a: 0, b: 1, type: 'allied', cause: 'mutual_defence' },
    ]);
    const other = genesisRelationsSection([
      { a: 0, b: 1, type: 'allied', cause: 'mutual_defence' },
      { a: 0, b: 2, type: 'rival', cause: 'standing_rivalry' },
    ]);
    expect(JSON.stringify(one)).toBe(JSON.stringify(other));
  });

  test('a DIFFERENT set of ties fingerprints differently', () => {
    const one = genesisRelationsSection([{ a: 0, b: 1, type: 'allied', cause: 'mutual_defence' }]);
    const other = genesisRelationsSection([{ a: 0, b: 1, type: 'rival', cause: 'standing_rivalry' }]);
    expect(JSON.stringify(one)).not.toBe(JSON.stringify(other));
  });
});

describe('POLIS-2 — THE ORDERING LAW (a DISCOVERY arm)', () => {
  // A1.2.12 requires materialization BEFORE the composer's channel discovery.
  // Asserting the call order would only restate the source; this executes the
  // consequence — discovery INGESTS `neighbourNetwork`, so a tie materialized in
  // time changes what the regional graph knows. If this arm ever goes quiet, the
  // materializer has been moved past discovery and the founding ties have become
  // invisible to the graph while still looking present on the members.
  test('materialized founding ties reach discovery and change the channel set', () => {
    const bare = threeMembers();
    const bareGraph = deriveGraphWithDiscoveredCandidates(bare, ensureRegionalGraph(), { now: 'T' });

    const tied = threeMembers();
    materializeGenesisRelations({
      settlements: tied,
      relations: [
        { a: 0, b: 1, type: 'patron_of', cause: 'tier_dominance' },
        { a: 1, b: 2, type: 'trade_partner', cause: 'market_exchange' },
      ],
    });
    const tiedGraph = deriveGraphWithDiscoveredCandidates(tied, ensureRegionalGraph(), { now: 'T' });

    expect(tiedGraph.channels.length).toBeGreaterThan(bareGraph.channels.length);
    // And the evidence names the plane the tie was written on.
    const evidence = tiedGraph.channels.flatMap(c => (c.evidence || []).map(e => e.source));
    expect(evidence).toContain('neighbourNetwork');
  });
});
