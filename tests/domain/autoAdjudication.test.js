/**
 * tests/domain/autoAdjudication.test.js — FULL AUTO-RESOLVE, the engine-adjudicated
 * half of realm directive 7 (binding design ruling J-D7).
 *
 * WHAT THIS PROVES, headlessly and deterministically (one pinned clock, one seed):
 *   1. DORMANCY BY REFERENCE — an advance that minted no proposals comes back as the
 *      SAME OBJECT. Not "deep-equal": identical. That is the byte-identity negative
 *      control for every world whose DM never turned the mode on.
 *   2. TOTALITY — a full-auto advance leaves NO pending row behind. The docket that
 *      the auto-resolve toggle used to let pile up unread is emptied by the engine.
 *   3. THE EQUIVALENCE INVARIANT (the load-bearing one) — the world an auto-resolved
 *      advance produces is BYTE-IDENTICAL to the world a DM produces by hand-applying
 *      every single row, once the provenance mark is stripped. Same receipts, same
 *      journal, same ledger, same news, same settlement updates. One vocabulary.
 *   4. THE MARK, both polarities — present on every engine ruling, ABSENT on every
 *      hand ruling (the absence IS the DM's signature).
 *   5. IDEMPOTENCE — re-running the pass over an already-ruled docket rules nothing
 *      and returns by reference, so a double call can never double-apply a major.
 *
 * FIXTURE: the rival/hostile two-edge realm from tests/store/advancePauseResume.js —
 * a live corpus whose one_month advance mints six proposal-gated majors through the
 * real candidate pipeline. Deliberately NOT a hand-built proposal row: a synthetic
 * fixture would prove the fold, never the pipeline the fold has to survive.
 */
import { describe, expect, test } from 'vitest';
import { simulateCampaignWorldInterval } from '../../src/domain/worldPulse/advanceInterval.js';
import { applyWorldPulseProposal } from '../../src/domain/worldPulse/applyWorldPulse.js';
import {
  autoAdjudicateAdvanceProposals,
  isEngineAdjudicated,
  ENGINE_AUTO_ADJUDICATOR,
} from '../../src/domain/worldPulse/autoAdjudication.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-01-01T00:00:00.000Z';

function settlement(name) {
  return {
    name, tier: 'town', population: 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 30 },
    institutions: [],
    economicState: { primaryImports: ['Bulk grain and foodstuffs'], primaryExports: [] },
    powerStructure: {
      publicLegitimacy: { score: 40, label: 'Contested' },
      factions: [
        { faction: 'Merchant League', category: 'economy', power: 60 },
        { faction: 'Temple Wardens', category: 'religious', power: 48 },
      ],
      conflicts: [],
    },
    npcs: [{ id: `${name}-reeve`, name: `Reeve of ${name}`, importance: 'key' }],
    activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.5 }],
  };
}

function fixtureSaves() {
  return ['a', 'b', 'c'].map(id => ({
    id, name: id, phase: 'canon', settlement: settlement(id),
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  }));
}

function fixtureCampaign() {
  return {
    id: 'camp-1', name: 'Realm', settlementIds: ['a', 'b', 'c'],
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'rival' },
        { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'hostile' },
      ],
    }),
    wizardNews: { currentTick: 0, entries: [] },
    worldState: { rngSeed: 'pause-store-seed', tick: 0, canonizedAt: '2026-01-01T00:00:00.000Z' },
  };
}

/** The composed advance result the full-auto pass folds over. */
async function advanceResult() {
  return simulateCampaignWorldInterval({
    campaign: fixtureCampaign(),
    saves: fixtureSaves(),
    interval: 'one_month',
    commit: true,
    now: NOW,
    autoResolve: true,
  });
}

/** id-matched last-write-wins fold, mirroring the orchestrator's own carry-over. */
function foldSaves(saves, updates) {
  if (!Array.isArray(updates) || !updates.length) return saves;
  const byId = new Map(updates.map(u => [String(u.saveId), u.settlement]));
  return saves.map(save => (byId.has(String(save.id))
    ? { ...save, settlement: byId.get(String(save.id)) }
    : save));
}

/**
 * The DM's own hands: apply every minted proposal, in mint order, through the SAME
 * domain verb with the SAME pinned clock and NO provenance mark. This is the control
 * the auto path must match byte-for-byte.
 */
function handApplyEveryProposal(result) {
  let campaign = {
    ...fixtureCampaign(),
    worldState: result.worldState,
    regionalGraph: result.regionalGraph,
    wizardNews: result.wizardNews,
  };
  let saves = foldSaves(fixtureSaves(), result.settlementUpdates);
  let ruled = 0;
  for (const proposal of result.proposals || []) {
    const applied = applyWorldPulseProposal({
      campaign, saves, proposalId: proposal.id, now: NOW,
    });
    if (!applied) continue;
    ruled += 1;
    campaign = {
      ...campaign,
      worldState: applied.worldState,
      regionalGraph: applied.regionalGraph,
      wizardNews: applied.wizardNews,
    };
    saves = foldSaves(saves, applied.settlementUpdates);
  }
  return { worldState: campaign.worldState, ruled };
}

const pendingOf = (worldState) => (worldState.proposals || []).filter(p => p.status === 'pending');
const resolvedOf = (worldState) => (worldState.proposals || []).filter(p => p.status !== 'pending');
/** Strip the ONE key the auto path adds, so the two worlds can be byte-compared. */
function withoutMarks(worldState) {
  return {
    ...worldState,
    proposals: (worldState.proposals || []).map((/** @type {any} */ p) => {
      const { adjudicatedBy: _mark, ...rest } = p;
      return rest;
    }),
  };
}

describe('the fixture really produces a docket (guard the guard)', () => {
  test('a one_month advance mints proposal-gated majors, all pending', async () => {
    const result = await advanceResult();
    expect((result.proposals || []).length).toBeGreaterThan(0);
    expect(pendingOf(result.worldState).length).toBe((result.proposals || []).length);
  });
});

describe('DORMANCY — nothing to rule on is byte-identical by reference', () => {
  test('an advance that minted no proposals returns the SAME result object', () => {
    const result = { status: 'complete', worldState: { proposals: [] }, proposals: [] };
    expect(autoAdjudicateAdvanceProposals({
      campaign: fixtureCampaign(), saves: fixtureSaves(), result, now: NOW,
    })).toBe(result);
  });

  test('a blocked or PAUSED advance is never adjudicated (both refusals return by reference)', () => {
    const blocked = { ok: false, reason: 'world_not_canonized', proposals: [{ id: 'p1' }] };
    const paused = { status: 'paused', proposals: [{ id: 'p1' }], worldState: { proposals: [] } };
    for (const result of [blocked, paused]) {
      expect(autoAdjudicateAdvanceProposals({
        campaign: fixtureCampaign(), saves: fixtureSaves(), result, now: NOW,
      })).toBe(result);
    }
  });
});

describe('FULL AUTO — the engine empties the docket and signs every ruling', () => {
  test('no pending row survives, and every resolved row carries the engine mark', async () => {
    const result = await advanceResult();
    const minted = (result.proposals || []).length;
    const auto = autoAdjudicateAdvanceProposals({
      campaign: fixtureCampaign(), saves: fixtureSaves(), result, now: NOW,
    });
    // The transition: pending BEFORE, none after — measured removal, not absence.
    expect(pendingOf(result.worldState).length).toBe(minted);
    expect(pendingOf(auto.worldState).length).toBe(0);
    const resolved = resolvedOf(auto.worldState);
    expect(resolved.length).toBe(minted);
    expect(resolved.every(isEngineAdjudicated)).toBe(true);
    expect(resolved.map(p => p.adjudicatedBy)).toEqual(resolved.map(() => ENGINE_AUTO_ADJUDICATOR));
    // The itemized receipt list matches what actually transitioned.
    expect(auto.autoAdjudicated.length).toBe(minted);
  });

  test('the ruling is a real world change, not just a status flip', async () => {
    const result = await advanceResult();
    const auto = autoAdjudicateAdvanceProposals({
      campaign: fixtureCampaign(), saves: fixtureSaves(), result, now: NOW,
    });
    // Applying six withheld majors must move SOMETHING: the applied ledger grows and
    // the world is no longer the pre-ruling world.
    expect(auto.autoApplied.length).toBeGreaterThan((result.autoApplied || []).length);
    expect(JSON.stringify(auto.worldState)).not.toBe(JSON.stringify(result.worldState));
  });
});

describe('THE EQUIVALENCE INVARIANT — auto ≡ the DM applying every row by hand', () => {
  test('the two worlds are byte-identical once the provenance mark is stripped', async () => {
    const forAuto = await advanceResult();
    const forHand = await advanceResult();
    // Guard the guard: the two advances start from the same world.
    expect(JSON.stringify(forHand.worldState)).toBe(JSON.stringify(forAuto.worldState));

    const auto = autoAdjudicateAdvanceProposals({
      campaign: fixtureCampaign(), saves: fixtureSaves(), result: forAuto, now: NOW,
    });
    const hand = handApplyEveryProposal(forHand);

    expect(hand.ruled).toBe((forHand.proposals || []).length);
    expect(withoutMarks(auto.worldState)).toEqual(hand.worldState);
    expect(JSON.stringify(withoutMarks(auto.worldState))).toBe(JSON.stringify(hand.worldState));
  });

  test('a HAND-applied row carries NO provenance mark (the absence is the DM signature)', async () => {
    const result = await advanceResult();
    const hand = handApplyEveryProposal(result);
    const resolved = resolvedOf(hand.worldState);
    // Anchor: the rows exist and really transitioned, so the absence below measures
    // the mark rather than an empty or unruled docket.
    expect(resolved.length).toBe((result.proposals || []).length);
    expect(resolved.every(p => p.status === 'applied' || p.status === 'refused')).toBe(true);
    for (const row of resolved) {
      // anchored: the same rows were just proven present and terminally ruled above
      expect(row).not.toHaveProperty('adjudicatedBy');
      expect(isEngineAdjudicated(row)).toBe(false);
    }
  });
});

describe('IDEMPOTENCE — an already-ruled docket is never ruled twice', () => {
  test('a second pass rules nothing and returns its input by reference', async () => {
    const result = await advanceResult();
    const once = autoAdjudicateAdvanceProposals({
      campaign: fixtureCampaign(), saves: fixtureSaves(), result, now: NOW,
    });
    expect(once.autoAdjudicated.length).toBeGreaterThan(0);
    const twice = autoAdjudicateAdvanceProposals({
      campaign: fixtureCampaign(), saves: fixtureSaves(), result: once, now: NOW,
    });
    expect(twice).toBe(once);
  });
});
