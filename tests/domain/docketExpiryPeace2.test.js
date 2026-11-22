/**
 * docketExpiryPeace2.test.js — CURE UNIT FP-PEACE-2, unit U1 (the chair's ruling FP-22, taken under the owner's
 * word of 2026-09-24, "Again, I leave all judgment to you"; findings/FP-PEACE-SUIT.md §0 item 2):
 *
 *   The docket's rows never expire. Only the five actor-initiated majors do (actorMajorApproval.js). In the lit
 *   peace-suit realm a DM who never answers leaves the docket frozen from its first weeks: every one of the
 *   realm's sixteen places is held for twenty years by a question asked before the first war.
 *
 * An unanswered row now EXPIRES after DOCKET_TUNING.expiryWeeks of the world's 52-week clock (a DRAFT tuning row),
 * through the docket's own writer (proposalAdmission.js :: expireUnansweredDocketRows, composed into the tick's
 * one docket-row supersession seam, candidateEvents.js :: supersedeLegacyRecordModeProposals). The docket's read
 * (buildProposalDocket) stops counting the row in the tick it expires, so its lane frees there. The receipt is
 * written ONCE, in that tick: the terminal 'superseded' row with its stamp and reason, and one 'expired' feed
 * entry of the question's own kind (worldPulseFeedCuration.js :: reconcileSupersededProposalNews), the
 * transition the regional lifecycle already files and voices; the question's own queued entry stays, because
 * the question was asked. No flag governs the docket (buildProposalDocket and the seam are unconditional in
 * pulseKernel.js), so the horizon binds every campaign.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';
import { applyWorldPulseOutcomes } from '../../src/domain/worldPulse/applyWorldPulse.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { INTERVAL_WEEKS } from '../../src/domain/worldPulse/intervalWeeks.js';
import { ACTOR_MAJOR_HOLD_WEEKS } from '../../src/domain/worldPulse/actorMajorApproval.js';
import { REALM_VERB_PAYLOAD_KIND } from '../../src/domain/worldPulse/realmVerbExecution.js';
// Namespace imports, so each pin reds BY TITLE on the pre-cure tree (a missing named export would fail the
// whole file at link time and hide which arm the cure owes).
import * as admission from '../../src/domain/worldPulse/proposalAdmission.js';
import * as curation from '../../src/domain/worldPulse/worldPulseFeedCuration.js';

const { buildProposalDocket } = admission;

const NOW = '2026-01-01T00:00:00.000Z';
const LATER = '2027-01-01T00:00:00.000Z';
const HORIZON = 52;

function town(name) {
  return {
    name, tier: 'town', population: 3000,
    config: { tradeRouteAccess: 'road' },
    institutions: [],
    economicState: { prosperity: 'Stable', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: 62, label: 'Stable' },
      factions: [{ faction: `${name} Council`, category: 'civic', power: 60, isGoverning: true }],
      conflicts: [],
    },
    npcs: [], activeConditions: [],
  };
}

const save = (id, name) => ({ id, name, phase: 'canon', settlement: town(name), campaignState: { phase: 'canon', eventLog: [], locks: {} } });
const SAVES = [save('mere', 'Mere'), save('ford', 'Ford')];

/** A minor question of the court's own peace, in the shape the condition producers give it. */
function question(kind, sId, tick) {
  return {
    id: `candidate.condition.${kind}.${sId}.${tick}`,
    type: 'condition',
    candidateType: kind,
    ruleFamily: 'condition',
    targetSaveId: sId,
    severity: 0.5,
    probability: 1,
    applyMode: 'proposal',
    headline: `Unrest may gather in ${sId}`,
    summary: 'A question for the table.',
    reasons: ['The court asked for a ruling.'],
    generatedAtTick: tick,
  };
}

/** Mint the questions as PENDING docket rows through the real proposal arm (record-identical rows + queued news). */
function mintRows(outcomes, tick) {
  const graph = ensureRegionalGraph({ edges: [], channels: [] });
  const worldState = { rngSeed: 'peace2-docket-expiry', tick, simulationRules: {}, proposals: [] };
  const minted = applyWorldPulseOutcomes({
    snapshot: { regionalGraph: graph, settlements: SAVES.map((s) => ({ id: s.id, name: s.name, settlement: s.settlement })) },
    worldState, regionalGraph: graph, wizardNews: { currentTick: tick, entries: [] },
    settlementMap: new Map(SAVES.map((s) => [s.id, { saveId: s.id, save: s, settlement: s.settlement }])),
    outcomes, tick, now: NOW, advanceNewsTick: false, advanceRegionalImpacts: false,
    simulationRules: worldState.simulationRules,
  });
  return { worldState: minted.worldState, regionalGraph: minted.regionalGraph, wizardNews: minted.wizardNews };
}

/** One real weekly pulse from world tick `from`; the pulse itself runs as tick `from + 1`. */
function pulseFrom(minted, from) {
  const campaign = {
    id: 'peace2-docket-expiry', settlementIds: SAVES.map((s) => s.id),
    worldState: { ...minted.worldState, tick: from },
    regionalGraph: minted.regionalGraph,
    wizardNews: minted.wizardNews,
  };
  return simulateCampaignWorldPulse({ campaign, saves: SAVES, interval: 'one_week', now: LATER });
}

const MINTED_AT = 2;
const THREE = ['crime_pressure', 'faction_unrest', 'food_pressure'].map((kind) => question(kind, 'mere', MINTED_AT));
const rowFor = (worldState, outcomeId) => (worldState.proposals || []).find((p) => p.outcome?.id === outcomeId);
const entriesOf = (feed) => (Array.isArray(feed) ? feed : feed?.entries || []);
const receiptsFor = (feed, outcomeId) => entriesOf(feed).filter((e) => e.kind === 'expired' && String(e.sourceEventId) === outcomeId);
const queuedFor = (feed, outcomeId) => entriesOf(feed).filter((e) => e.kind === 'queued' && String(e.sourceEventId) === outcomeId);

describe('FP-22 U1 — an unanswered docket row expires after the measured horizon, its lane frees, and it is receipted once', () => {
  it('a row past the horizon is gone and its lane frees', () => {
    const minted = mintRows(THREE, MINTED_AT);
    expect(buildProposalDocket(minted.worldState).bySettlement.mere, 'the court\'s minor lane is full before the horizon').toEqual({ minor: 3, major: 0 });
    // The pulse runs as tick MINTED_AT + HORIZON: every row is exactly HORIZON weeks old there.
    const after = pulseFrom(minted, MINTED_AT + HORIZON - 1);
    for (const outcome of THREE) {
      expect(rowFor(after.worldState, outcome.id), outcome.id).toMatchObject({
        status: 'superseded',
        supersessionReason: 'unanswered_row_expired',
        supersededAtTick: MINTED_AT + HORIZON,
        supersededAt: LATER,
      });
    }
    expect(admission.UNANSWERED_ROW_EXPIRY_REASON).toBe('unanswered_row_expired');
    // anchored: the same court's lane was counted at three on the first line of this arm, so this zero is the expiry's.
    expect(buildProposalDocket(after.worldState).bySettlement.mere?.minor ?? 0).toBe(0);
  });

  it('the expiring tick\'s admission already sees the freed lane (the docket read skips the row before the writer runs)', () => {
    const { worldState } = mintRows(THREE, MINTED_AT);
    const atHorizon = { ...worldState, tick: MINTED_AT + HORIZON };
    const insideHorizon = { ...worldState, tick: MINTED_AT + HORIZON - 1 };
    expect(admission.proposalExpiredUnanswered?.(rowFor(atHorizon, THREE[0].id), atHorizon.tick)).toBe(true);
    // anchored: the same rows are counted as three one week earlier, on the next line but one.
    expect(buildProposalDocket(atHorizon).bySettlement.mere?.minor ?? 0).toBe(0);
    expect(buildProposalDocket(insideHorizon).bySettlement.mere).toEqual({ minor: 3, major: 0 });
  });

  it('a row inside the horizon stays, and nothing is receipted', () => {
    const minted = mintRows(THREE, MINTED_AT);
    const after = pulseFrom(minted, MINTED_AT + HORIZON - 2);
    for (const outcome of THREE) expect(rowFor(after.worldState, outcome.id)?.status, outcome.id).toBe('pending');
    expect(buildProposalDocket(after.worldState).bySettlement.mere).toEqual({ minor: 3, major: 0 });
    // anchored: the expiring twin above receipts each of these ids once through the same finder, so this empty set is the horizon's.
    expect(receiptsFor(after.wizardNews, THREE[0].id)).toHaveLength(0);
  });

  it('receipted once: one expired entry of the question\'s own kind in the expiring tick, the question kept, and no second receipt', () => {
    const minted = mintRows(THREE, MINTED_AT);
    const outcome = THREE[0];
    expect(queuedFor(minted.wizardNews, outcome.id), 'the question was asked on the feed').toHaveLength(1);
    const after = pulseFrom(minted, MINTED_AT + HORIZON - 1);
    const receipts = receiptsFor(after.wizardNews, outcome.id);
    expect(receipts).toHaveLength(1);
    expect(receipts[0]).toMatchObject({
      id: `wizard_news.${MINTED_AT + HORIZON}.world_pulse.expired.${outcome.id}`,
      tick: MINTED_AT + HORIZON,
      kind: 'expired',
      impactKind: outcome.candidateType,
      headline: outcome.headline,
      settlementIds: ['mere'],
      createdAt: LATER,
    });
    expect(receipts[0].tags).toEqual(['world_pulse', 'condition', outcome.candidateType, 'expired']);
    expect(queuedFor(after.wizardNews, outcome.id), 'the question stays on the feed: it was asked').toHaveLength(1);
    // The same tick's reconcile again (the apply mouth reruns it between advances): nothing new, the same feed.
    const again = curation.reconcileSupersededProposalNews(after.worldState, after.wizardNews);
    expect(again.wizardNews).toBe(after.wizardNews);
    // The next week: the row is terminal, so no second receipt.
    const next = pulseFrom({ worldState: after.worldState, regionalGraph: after.regionalGraph, wizardNews: after.wizardNews }, MINTED_AT + HORIZON);
    expect(receiptsFor(next.wizardNews, outcome.id)).toHaveLength(1);
  });

  it('the DM\'s own orders and the held actor-initiated majors are not the docket\'s to expire', () => {
    const tick = MINTED_AT + HORIZON * 3;
    // The realm composer's own order, by the payload kind the apply mouth routes on (never a spelled copy of it).
    const dmOrder = { ...question('crime_pressure', 'mere', MINTED_AT), id: 'realm_verb.FORCE_CALAMITY.mere', proposalPayload: { kind: REALM_VERB_PAYLOAD_KIND, verb: 'FORCE_CALAMITY', args: {} } };
    const heldMajor = { ...question('crime_pressure', 'ford', MINTED_AT), id: 'world_outcome.strategy_deploy.ford', candidateType: 'strategy_deploy', proposalPayload: { kind: 'siege_initiation', besieger: 'ford', besieged: 'mere' } };
    const organic = question('crime_pressure', 'ford', MINTED_AT);
    const rows = [dmOrder, heldMajor, organic].map((outcome, i) => ({ id: `row.${i}`, status: 'pending', recordModeVersion: 4, tick: MINTED_AT, outcome }));
    const world = { tick, proposals: rows };
    const expired = admission.expireUnansweredDocketRows?.(world, { tick, now: LATER });
    expect(expired?.proposals?.map((p) => p.status)).toEqual(['pending', 'pending', 'superseded']);
    expect(ACTOR_MAJOR_HOLD_WEEKS, 'the actor majors keep their own, shorter hold').toBeLessThan(HORIZON);
  });

  it('total and dark-stable: nothing past the horizon, no tick, or no row tick is the same world reference', () => {
    const { worldState } = mintRows(THREE, MINTED_AT);
    const expire = admission.expireUnansweredDocketRows;
    expect(typeof expire).toBe('function');
    expect(expire(worldState, { tick: MINTED_AT + HORIZON - 1, now: LATER })).toBe(worldState);
    expect(expire({ ...worldState, tick: undefined }, { now: LATER }).proposals).toBe(worldState.proposals);
    const tickless = { tick: 999, proposals: worldState.proposals.map(({ tick: _drop, ...row }) => ({ ...row, outcome: { ...row.outcome, generatedAtTick: undefined } })) };
    expect(expire(tickless, { tick: 999, now: LATER })).toBe(tickless);
    expect(expire({ proposals: [] }, { tick: 999 }).proposals).toEqual([]);
  });

  it('the horizon is a DRAFT tuning row on the 52-week clock that keeps the DM-attention law', () => {
    const { DOCKET_TUNING } = admission;
    expect(DOCKET_TUNING).toEqual({ expiryWeeks: HORIZON });
    expect(Object.isFrozen(DOCKET_TUNING)).toBe(true);
    // THE LAW (worldpulse-core-3, the actor-major precedent): no row expires inside the advance that minted it.
    // The seam cannot see the advance's start, so the horizon itself must reach past the longest advance's last pulse.
    const longestAdvance = Math.max(...Object.values(INTERVAL_WEEKS));
    expect(longestAdvance).toBe(52);
    expect(DOCKET_TUNING.expiryWeeks).toBeGreaterThanOrEqual(longestAdvance);
    const firstPulse = 105;
    const row = { status: 'pending', tick: firstPulse, outcome: question('crime_pressure', 'mere', firstPulse) };
    expect(admission.proposalExpiredUnanswered(row, firstPulse + longestAdvance - 1), 'the advance\'s last pulse').toBe(false);
    expect(admission.proposalExpiredUnanswered(row, firstPulse + longestAdvance), 'the next advance\'s first pulse, after one panel').toBe(true);
    const register = JSON.parse(readFileSync(new URL('../lint/.tuning-register.json', import.meta.url), 'utf8'));
    expect(register.tables['src/domain/worldPulse/proposalAdmission.js#DOCKET_TUNING']).toMatchObject({
      status: 'draft', signedAt: null, unit: { expiryWeeks: 'weeks' },
    });
  });
});
