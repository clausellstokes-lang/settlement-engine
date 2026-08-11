/**
 * deadReaderRepairs.test.js — regression pins for the domain-side reader-without-a-writer
 * repairs (the observed-shape instrument's class-(a) findings, 2026-08-11 repair lane).
 *
 * THREE FINDING CLUSTERS, ALL REPAIRED READER-SIDE, ALL PROVABLY BEHAVIOUR-IDENTICAL
 * (every deleted term was an OR-arm that could never be true):
 *
 *   1. The herald's three caller-supplied markers `__adjudicationPending`, `__resolution`
 *      and `__forecast` — five read sites across heraldRouting.js and realmItemReadModel.js,
 *      zero writers on any branch in the repo's history.
 *   2. The singular `evidenceId` — three id-resolution chains that guessed a spelling no
 *      writer has ever produced (the plural `evidenceIds` array is a different contract on
 *      a different shape).
 *   3. `title` on a `currentTensions` entry — three readers, against a producer whose
 *      entries carry exactly {type, description, factions, lastingEffects, plotHooks,
 *      severity}.
 *
 * EVERY GROUP IS A POSITIVE CONTROL PLUS A NEGATIVE CONTROL, and the negative control is
 * the point. Each negative test feeds ONLY the dead spelling, with the live discriminator
 * absent, and asserts the value the code produces WITHOUT the dead arm. Re-adding any
 * deleted read as an extra OR-arm — the realistic regression, since a well-meaning author
 * restoring "tolerance" would append rather than replace — flips the asserted value and
 * reds. A pin that only asserted the live spelling still works would pass with every dead
 * arm restored, which is the vacuity this file exists to avoid.
 */
import { describe, expect, test } from 'vitest';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

import { heraldSectionOfRecord } from '../../src/domain/realm/heraldRouting.js';
import { buildRealmItemReadModel } from '../../src/domain/realm/realmItemReadModel.js';
import { warRulingNewsEntry } from '../../src/domain/worldPulse/warRulingsNews.js';
import { normalizeWarCoalitionEvidence } from '../../src/domain/worldPulse/warCoalitionEvidence.js';
import { sovereigntyNewsEntry } from '../../src/domain/worldPulse/sovereigntyNews.js';
import { extractSettlementContext } from '../../src/components/new/dailyLifeLogic.js';
import { extractFullContext } from '../../src/generators/aiLayer.js';
import { generateSiegeCapability } from '../../src/generators/narrative/siegeCapability.js';

// ── 1. THE HERALD'S CALLER-SUPPLIED MARKERS ─────────────────────────────────────

describe('herald routing: the three marker arms are deleted, not disabled', () => {
  test('POSITIVE — the structural fields that replaced them still drive all three steps', () => {
    // Step 1, a pending decision. Step 2, a resolved ruling (both spellings).
    expect(heraldSectionOfRecord({ status: 'pending', outcome: { impactKind: 'war_mobilization' } })).toBe('adjudication');
    expect(heraldSectionOfRecord({ status: 'resolved', outcome: { candidateType: 'coup_succeeded' } })).toBe('adjudication');
    expect(heraldSectionOfRecord({ status: 'applied_by_dm', impactKind: 'harvest' })).toBe('adjudication');
    // Step 3, an emerging-stage stressor.
    expect(heraldSectionOfRecord({ stressor: { type: 'siege', lifecycleStage: 'emerging' } })).toBe('divination');
    // The content router underneath, so the negative controls below are not asserting
    // a section the record would have landed on by accident.
    expect(heraldSectionOfRecord({ impactKind: 'harvest' })).toBe('trade');
  });

  test('NEGATIVE — __adjudicationPending alone cannot force adjudication', () => {
    // Under the deleted arm this record satisfied every conjunct (a proposalPayload, a
    // status that is none of applied/dismissed/resolved, and the marker) and filed to
    // adjudication. It must now file by its payload's content.
    expect(heraldSectionOfRecord({
      __adjudicationPending: true,
      proposalPayload: { kind: 'harvest' },
    })).toBe('trade');
  });

  test('NEGATIVE — __resolution alone cannot force adjudication', () => {
    expect(heraldSectionOfRecord({ __resolution: true, impactKind: 'harvest' })).toBe('trade');
  });

  test('NEGATIVE — __forecast alone cannot force divination', () => {
    expect(heraldSectionOfRecord({ __forecast: true, impactKind: 'harvest' })).toBe('trade');
  });
});

describe('realm read model: the __forecast / __resolution arms are deleted', () => {
  const campaignWith = (worldState) => ({ id: 'realm-dead-reader-pin', worldState: { tick: 20, ...worldState } });
  const itemOf = (model, sourceClass) => model.items.find((item) => item.source.classes.includes(sourceClass));

  test('POSITIVE — lifecycleStage drives the phase and status drives the resolution', () => {
    const emerging = itemOf(buildRealmItemReadModel(campaignWith({
      stressors: [{ id: 'st-live', type: 'siege', lifecycleStage: 'emerging' }],
    })), 'live_stressor');
    expect(emerging.temporal.phase).toBe('emerging');

    const resolved = itemOf(buildRealmItemReadModel(campaignWith({
      proposals: [{ id: 'pr-resolved', status: 'resolved' }],
    })), 'proposal');
    expect(resolved.resolution.state).toBe('resolved');
  });

  test('NEGATIVE — __forecast alone leaves a live stressor in the current phase', () => {
    const item = itemOf(buildRealmItemReadModel(campaignWith({
      stressors: [{ id: 'st-marker', type: 'siege', __forecast: true }],
    })), 'live_stressor');
    expect(item.temporal.phase).toBe('current');
  });

  test('NEGATIVE — __resolution alone leaves a proposal unresolved and planned', () => {
    // Both dimensions move together: temporalPhaseOf short-circuits a proposal to
    // 'historical' the moment its resolution stops being 'unresolved', so restoring the
    // marker reds this test twice over.
    const item = itemOf(buildRealmItemReadModel(campaignWith({
      proposals: [{ id: 'pr-marker', __resolution: true }],
    })), 'proposal');
    expect(item.resolution.state).toBe('unresolved');
    expect(item.temporal.phase).toBe('planned');
  });
});

// ── 2. THE SINGULAR `evidenceId` ────────────────────────────────────────────────

describe('evidenceId: the singular spelling resolves no id, at all three readers', () => {
  const NOW = '2026-01-01T00:00:00.000Z';

  const rulingSnapshot = () => {
    const rows = [
      { id: 'ashford', name: 'Ashford', settlement: { name: 'Ashford', npcs: [], powerStructure: { factions: [] } } },
      { id: 'eastvale', name: 'Eastvale', settlement: { name: 'Eastvale', npcs: [], powerStructure: { factions: [] } } },
    ];
    return { settlements: rows, byId: new Map(rows.map((row) => [row.id, row])) };
  };
  const rulingRow = (patch) => ({
    kind: 'peace_refused',
    tick: 12,
    settlementId: 'ashford',
    counterpartId: 'eastvale',
    reason: 'the target court chose to hold the field',
    ...patch,
  });

  test('warRulingsNews — POSITIVE on `id`, NEGATIVE on `evidenceId` alone', () => {
    const live = warRulingNewsEntry({ evidence: rulingRow({ id: 'src.live' }), snapshot: rulingSnapshot(), now: NOW });
    expect(live).not.toBeNull();
    expect(live.sourceEventId).toBe('src.live');

    // The id guard is `!sourceEventId`, so an entry that resolved its id ONLY from the
    // dead spelling would come back non-null. It must be refused instead.
    expect(warRulingNewsEntry({
      evidence: rulingRow({ evidenceId: 'src.dead' }),
      snapshot: rulingSnapshot(),
      now: NOW,
    })).toBeNull();
  });

  test('warCoalitionEvidence — POSITIVE on `id`, NEGATIVE on `evidenceId` alone', () => {
    const fact = (patch) => ({
      kind: 'coalition_joined',
      tick: 8,
      settlementId: 'ashford',
      counterpartId: 'eastvale',
      thirdPartyId: 'greywatch',
      ...patch,
    });
    expect(normalizeWarCoalitionEvidence(fact({ id: 'call.live' }))).toMatchObject({ id: 'call.live' });
    // Same guard shape: `if (!id … ) return null`.
    expect(normalizeWarCoalitionEvidence(fact({ evidenceId: 'call.dead' }))).toBeNull();
  });

  test('sovereigntyNews — POSITIVE on `sourceEventId`, NEGATIVE on `evidenceId` alone', () => {
    const SNAPSHOT = {
      byId: {
        asset_town: { id: 'asset_town', name: 'Ashford' },
        seller_seat: { id: 'seller_seat', name: 'Irontown' },
        buyer_seat: { id: 'buyer_seat', name: 'Westmere' },
      },
    };
    const seed = (patch) => ({
      kind: 'sovereignty_sale_offered',
      assetId: 'asset_town',
      fromId: 'seller_seat',
      toId: 'buyer_seat',
      tick: 12,
      settlementIds: ['seller_seat', 'buyer_seat', 'asset_town'],
      ...patch,
    });
    const project = (patch) => sovereigntyNewsEntry({ evidence: seed(patch), snapshot: SNAPSHOT, now: null });

    expect(project({ sourceEventId: 'seed.live' }).sourceEventId).toBe('seed.live');

    // This reader has a DERIVED fallback rather than a null guard, so the assertion has
    // to name the derivation: with only the dead spelling present the source ref must be
    // the address join, and must not be the value smuggled in as `evidenceId`.
    const dead = project({ evidenceId: 'seed.dead' });
    expect(dead).not.toBeNull();
    expect(dead.sourceEventId).toBe('sovereignty_sale_offered.asset_town.seller_seat.buyer_seat.12');
    expect(dead.sourceEventId).not.toBe('seed.dead');
  });
});

// ── 3. `title` ON A currentTensions ENTRY ───────────────────────────────────────

describe('currentTensions.title: the arm is deleted at all three readers', () => {
  // A producer-shaped entry (historyData.HISTORICAL_EVENTS_DATA spreads) versus one
  // carrying ONLY the spelling nothing writes.
  const LIVE = { type: 'succession_crisis', description: 'Heirs jockeyed for position' };
  const DEAD_ONLY = { title: 'A Title No Writer Produces' };

  test('POSITIVE — the two prompt contexts read the live `type`', () => {
    const settlement = { history: { currentTensions: [LIVE] } };
    expect(extractSettlementContext(settlement).tensions).toEqual(['succession_crisis']);
    expect(extractFullContext(settlement).tensions).toEqual(['succession_crisis']);
  });

  test('NEGATIVE — a tension carrying only `title` contributes nothing to either prompt', () => {
    const settlement = { history: { currentTensions: [DEAD_ONLY] } };
    expect(extractSettlementContext(settlement).tensions).toEqual([]);
    expect(extractFullContext(settlement).tensions).toEqual([]);
  });

  test('siegeCapability — POSITIVE on `description`, NEGATIVE on `title` alone', () => {
    const events = [{ type: 'political', name: 'the Rowan Succession', yearsAgo: 5 }];

    const live = generateSiegeCapability(events, [{ type: 'succession_crisis', description: 'the levy still rankles' }], 100);
    expect(String(live)).toContain('the levy still rankles');

    const dead = generateSiegeCapability(events, [DEAD_ONLY], 100);
    // THE ANTI-VACUITY CONTROL IS NOW A PRECONDITION OF THE DENIAL RATHER THAN AN
    // ADJACENT LINE, which is the ratified preference: routed through the helper, the
    // control is an EXECUTED assertion coupled to the exclusion instead of a second
    // statement a later edit could delete out from under it.
    //
    // ⚠⚠ THE ANCHOR IS THE SENTENCE FRAME, NOT THE TENSION CLAUSE, AND THAT CHOICE WAS
    // MADE BY MUTANT RATHER THAN BY TASTE. The obvious anchor is the fallback clause
    // `'its effects shape current decisions'`, because siegeCapability.js builds
    // `tensionClause` as `primaryTension || <fallback>` and so the fallback and the
    // refused title are MUTUALLY EXCLUSIVE OCCUPANTS OF ONE SLOT. Measured: with the
    // deleted `tension?.title` OR-arm spliced back in, that version DOES red — but on
    // the helper's LIVENESS arm, whose message reads "the anchor sibling is missing …
    // cannot distinguish correctly-excluded from the whole collection drifted away".
    // That sends the next reader hunting a drifted collection when the truth is the
    // opposite: the collection is perfectly live and the dead title got IN and evicted
    // the clause. A pin that reds for the right reason with the wrong message costs the
    // next lane the debugging time the pin was supposed to save.
    // ⭐ THE FRAME SURVIVES THAT REGRESSION AND DIES OF EVERY OTHER ONE, which is exactly
    // the ordering wanted: it is emitted by the same `return` statement, so it vanishes
    // if the generator short-circuits (each early return hands back the raw array, which
    // carries no frame at all) — but it is untouched by which tension wins the slot. So
    // the exclusion arm is the one that fires, and it names the real cause.
    expectAbsentWithAnchor(
      String(dead),
      'A Title No Writer Produces',
      'is still present in living memory',
      'siegeCapability ignores a tension carrying only the dead `title` spelling',
    );
    // …and the same-slot fact is kept, asserted POSITIVELY rather than as the vacuity
    // control: the tension slot must have resolved to the authored fallback. Under the
    // restored-arm regression this reds ALONGSIDE the exclusion above, so the pair names
    // both halves — the dead spelling got in, and the fallback it displaced is gone.
    expect(String(dead)).toContain('its effects shape current decisions');
  });
});
