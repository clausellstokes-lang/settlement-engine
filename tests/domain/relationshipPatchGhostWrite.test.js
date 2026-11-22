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
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

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

// ─────────────────────────────────────────────────────────────────────────────
// ⚠️⚠️ CR-WZ5-A — THE VOCABULARY CLOSURE. The cure above let THE EDGE speak, and
// the first cut of it did not ask WHAT LANGUAGE the edge was speaking.
//
// The graph plane and the relationship plane do not share a type vocabulary.
// `ensureRegionalGraph` mints `channel_inferred` for every inferred channel, and
// `normalizeEdge` falls back to `other` for an edge that declares no type at
// all. Neither is a RELATIONSHIP_DEFAULTS key, and `normalizeRelationshipType`
// passes an unknown token straight through. So the edge was believed, the raw
// graph token was PERSISTED as the relationship's type, and the axes silently
// fell back to neutral's numbers — the label and the numbers disagreed, the raw
// token reached DM-facing headlines ("channel inferred may become rival"), and
// three whole-pipeline same-seed cells moved. Verification rejected the lane on
// it.
//
// WHY WZ-5's OWN PINS DID NOT CATCH THIS, which is the durable lesson: every
// fixture above hand-authors its edges, so not one of them ever MINTED an
// inferred channel. The byte-identity claim was true of the paths the fixtures
// walked and VACUOUS for the path that actually moved. The second pin below
// therefore drives the REAL pipeline on a world that mints inferred channels,
// and proves it did so before it claims anything.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The graph-plane tokens this plane has no defaults for. Both are MINTED by
 * `src/domain/region/graph.js` — `channel_inferred` for an inferred channel's
 * edge, `other` as `normalizeEdge`'s fallback for an edge with no declared type.
 */
const OUT_OF_VOCABULARY = Object.freeze(['channel_inferred', 'other']);

describe('⚠️⚠️ CR-WZ5-A — an out-of-vocabulary edge cannot type a relationship', () => {
  /**
   * BOTH POLARITIES OF THE OUTCOME SIGN. The leak is in the BASELINE derivation,
   * which runs before the patch is applied, so it is indifferent to the sign —
   * and a pin driven only by a wounding incident would look like a war-path bug
   * and invite a war-path fix.
   */
  const POLARITIES = Object.freeze([
    ['a wounding incident (fear up)', { fear: 0.5 }],
    ['a warming incident (trust up)', { trust: 0.9 }],
  ]);

  for (const token of OUT_OF_VOCABULARY) {
    for (const [polarity, relationshipPatch] of POLARITIES) {
      test(`\`${token}\` + ${polarity} persists \`neutral\`, never the raw token`, () => {
        const written = applyRelationshipPatch(
          unmaterialized(),
          { ...incident, relationshipPatch },
          NOW,
          { id: KEY, from: 'karrow', to: 'mereth', relationshipType: token, type: token },
        );
        const record = written.relationshipStates[KEY];
        // The label is in this plane's vocabulary...
        expect(record.relationshipType).toBe('neutral');
        expect(Object.prototype.hasOwnProperty.call(RELATIONSHIP_DEFAULTS, record.relationshipType))
          .toBe(true);
        // ...and the numbers AGREE with the label. Reading neutral's axes while
        // persisting a foreign token is exactly the defect: half the record was
        // already `neutral` and only the name lied.
        expect(record.resentment).toBe(RELATIONSHIP_DEFAULTS.neutral.resentment);
        expect(record.trust).toBe(relationshipPatch.trust ?? RELATIONSHIP_DEFAULTS.neutral.trust);
        // The patch's own axis still lands.
        for (const [axis, value] of Object.entries(relationshipPatch)) {
          expect(record[axis], axis).toBe(value);
        }
      });
    }
  }

  test('the closure is MEMBERSHIP, not a denylist — every authored type still speaks', () => {
    // A guard written as `!== 'channel_inferred'` would pass the four tests above
    // and still leak `other`, and the next token minted anywhere in the graph
    // plane after that. This is the assertion that says the rule is "has
    // defaults", so a token nobody has thought of yet is closed in advance.
    for (const type of AUTHORED_TYPES) {
      const written = applyRelationshipPatch(unmaterialized(), incident, NOW, edgeOf(type));
      expect(written.relationshipStates[KEY].relationshipType, type).toBe(type);
    }
    for (const token of OUT_OF_VOCABULARY) {
      expect(Object.prototype.hasOwnProperty.call(RELATIONSHIP_DEFAULTS, token), token).toBe(false);
    }
  });
});

// ── THE REAL-PIPELINE PIN ────────────────────────────────────────────────────

/** A settlement shaped enough for the war/trade layers to have opinions. */
const settlementFor = (name, patch = {}) => ({
  name,
  tier: patch.tier || 'town',
  population: patch.population || 1800,
  config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: patch.priorityMilitary ?? 35 },
  institutions: patch.institutions || [],
  economicState: {
    prosperity: patch.prosperity || 'Prosperous',
    primaryExports: patch.exports || [],
    primaryImports: [],
  },
  powerStructure: {
    publicLegitimacy: { score: patch.legitimacy ?? 60, label: (patch.legitimacy ?? 60) < 40 ? 'Contested' : 'Stable' },
    factions: [
      { faction: 'Military Council', category: 'military', power: 78, isGoverning: true },
      { faction: 'Merchant League', category: 'economy', power: 52 },
    ],
    conflicts: [],
  },
  npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
  activeConditions: [],
});

const saveFor = (id, name, patch = {}) => ({
  id, name, phase: 'canon', settlement: settlementFor(name, patch),
  campaignState: { phase: 'canon', eventLog: [], locks: {} },
});

/**
 * FOUR SETTLEMENTS AND FIVE AUTHORED EDGES — the smallest world that MINTS.
 * `ensureRegionalGraph` keys its edge lookup DIRECTIONALLY (`from->to`), so a
 * channel that runs against an authored edge's direction, or between the one
 * pair this graph does not connect, finds nothing and mints `channel_inferred`.
 * A three-settlement fixture never gets there, which is precisely why WZ-5's
 * fixtures did not.
 */
function mintingWorld() {
  const saves = [
    saveFor('iron', 'Ironhold', {
      tier: 'city', population: 60000, legitimacy: 34, priorityMilitary: 40,
      institutions: [{ name: 'Great Citadel' }, { name: 'City Garrison' }, { name: 'Royal Armory' }, { name: 'War College' }],
      exports: [{ name: 'Forged Weapons' }],
    }),
    saveFor('weak', 'Weakmoor', {
      tier: 'village', population: 280, legitimacy: 24, priorityMilitary: 10,
      prosperity: 'Struggling', exports: ['Bulk grain and foodstuffs'],
    }),
    saveFor('mid', 'Midwater', { population: 2200, legitimacy: 62, priorityMilitary: 20 }),
    saveFor('far', 'Everdeep', { population: 5200, legitimacy: 55, priorityMilitary: 30 }),
  ];
  const campaign = {
    id: 'wz5r-vocab', name: 'WZ5r Vocabulary', settlementIds: ['iron', 'weak', 'mid', 'far'],
    worldState: {
      rngSeed: 'wz3-alpha', tick: 1,
      simulationRules: {
        warLayerEnabled: true, settlementStrategyEnabled: true, peaceEngineEnabled: true,
        coalitionLedgerEnabled: true, warTerminationEnabled: true, dispositionChannelsEnabled: true,
        envoyDiplomacyEnabled: true, demographicsEnabled: true, conquestDoctrineEnabled: true,
      },
      calendar: { elapsedWeeks: 30 },
      warPosture: { iron: { state: 'mobilized', progress: 1, sinceTick: 0 } },
      relationshipStates: {
        'edge.iron.weak': { relationshipType: 'hostile', resentment: 0.7, trust: 0.1 },
        'edge.weak.far': { relationshipType: 'allied', trust: 0.9, resentment: 0.02 },
        'edge.iron.far': { relationshipType: 'hostile', resentment: 0.5, trust: 0.1 },
      },
    },
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.iron.weak', from: 'iron', to: 'weak', relationshipType: 'hostile' },
        { id: 'edge.iron.mid', from: 'iron', to: 'mid', relationshipType: 'trade_partner' },
        { id: 'edge.weak.mid', from: 'weak', to: 'mid', relationshipType: 'trade_partner' },
        { id: 'edge.weak.far', from: 'weak', to: 'far', relationshipType: 'allied' },
        { id: 'edge.iron.far', from: 'iron', to: 'far', relationshipType: 'hostile' },
      ],
    }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  return { campaign, saves };
}

/** The inferred-channel edges a graph is carrying, by id. */
const inferredEdgeIds = (graph) => (graph?.edges || [])
  .filter((edge) => edge.relationshipType === 'channel_inferred')
  .map((edge) => String(edge.id))
  .sort();

describe('⚠️⚠️ CR-WZ5-A — the closure holds through the REAL pipeline, and the drive PROVES it minted', () => {
  /**
   * SIX TICKS, AND THE BOUND IS DELIBERATE. The mint happens on tick index 5 of
   * this seed; the drive stops there because from tick 8 onward a DIFFERENT and
   * PRE-EXISTING population appears — `ensureAllRelationshipStates` materializes
   * a posture row for every edge in the tick's OPENING graph, including an
   * inferred one, and that row legitimately carries `channel_inferred`. That
   * behaviour is base-identical, is not this cure's business, and is pinned
   * elsewhere (tests/domain/tradeWar.test.js asserts exactly such a row). Widening
   * this drive past it would not find a bug; it would only make the pin assert
   * something untrue of the tree it guards.
   */
  const TICKS = 6;

  test('a minted `channel_inferred` edge reaches the writer, and comes out `neutral`', () => {
    let { campaign, saves } = mintingWorld();
    let mintTick = -1;
    /** Keys the drive materialized while their ONLY edge was an inferred one. */
    let ghostKeys = [];

    for (let tick = 0; tick < TICKS; tick += 1) {
      const beforeKeys = new Set(Object.keys(campaign.worldState.relationshipStates || {}));
      const beforeInferred = inferredEdgeIds(campaign.regionalGraph);
      const result = simulateCampaignWorldPulse({ campaign, saves, interval: 'week', now: NOW });
      const afterStates = result.worldState.relationshipStates || {};
      const afterInferred = inferredEdgeIds(result.regionalGraph);

      // THE NON-VACUITY LEDGER, counted rather than asserted in the abstract: a
      // tick that MINTS inferred edges AND materializes exactly those keys is a
      // tick in which the writer was handed a graph-plane token for a record
      // that did not exist. That is the leaked path, executed.
      const mintedThisTick = afterInferred.filter((id) => !beforeInferred.includes(id));
      const materialized = mintedThisTick.filter((id) => !beforeKeys.has(id) && afterStates[id]);
      if (materialized.length && mintTick === -1) {
        mintTick = tick;
        ghostKeys = materialized;
      }

      // TOTALITY, over the whole drive: no record anywhere carries a token this
      // plane has no defaults for.
      const outOfVocabulary = Object.entries(afterStates)
        .filter(([, row]) => !Object.prototype.hasOwnProperty.call(
          RELATIONSHIP_DEFAULTS, String(row?.relationshipType),
        ))
        .map(([key, row]) => `${key}=${row.relationshipType}`);
      expect(outOfVocabulary, `tick ${tick} persisted a graph-plane token`).toEqual([]);

      const updates = new Map((result.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
      saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
      campaign = { ...campaign, worldState: result.worldState, regionalGraph: result.regionalGraph || campaign.regionalGraph };
    }

    // ⚠️ THE ANTI-VACUITY ASSERTION, AND IT IS THE POINT OF THE WHOLE PIN. A pin
    // that cannot prove it exercised the path is the exact defect that let this
    // leak land — WZ-5's fixtures were green over a path they never walked.
    expect(mintTick, 'the drive never minted an inferred channel — the pin is vacuous').toBe(5);
    expect(ghostKeys).toEqual(['edge.far.iron', 'edge.far.weak']);
    expect(ghostKeys.length).toBeGreaterThanOrEqual(2);

    // And what those two keys persisted: this plane's vocabulary, with the
    // matching numbers. Pre-cure they read `channel_inferred` here.
    const finalStates = campaign.worldState.relationshipStates;
    for (const key of ghostKeys) {
      expect(finalStates[key].relationshipType, key).toBe('neutral');
      expect(inferredEdgeIds(campaign.regionalGraph), key).toContain(key);
    }
  });
});
