/**
 * realmVerbExecution.test.js — W-COMPOSER-2 Stage 2: THE REALM VERB LIVE PATH.
 *
 * The force-as-proposal lane end to end: the DM mint is record-identical to a
 * sim mint (one lane), the apply arms resolve through each wave's OWN kernel
 * function (force ≡ organic, byte-compared), a lapsed order REFUSES VISIBLY
 * (news + status 'refused' — never a phantom commit), and the two documented
 * proposal re-mint deferrals (intervention_ordered / blockade_declared) are
 * CLOSED: the mover mints a pending proposal under a DM-driven authority mode,
 * and approval applies through the same arm the DM's own verb uses.
 */
import { describe, it, expect } from 'vitest';

import {
  buildRealmVerbOutcome, applyRealmVerbOrder, REALM_VERB_PAYLOAD_KIND,
} from '../../src/domain/worldPulse/realmVerbExecution.js';
import {
  mintRealmVerbProposal, applyWorldPulseProposal, applyWorldPulseOutcomes,
} from '../../src/domain/worldPulse/applyWorldPulse.js';
import { updateProposalStatus } from '../../src/domain/worldPulse/worldState.js';
import { declareCasus, warReasonsFor } from '../../src/domain/worldPulse/warReasons.js';
import { sueForPeaceOrder } from '../../src/domain/worldPulse/peaceReasons.js';
import { advanceIntervention } from '../../src/domain/worldPulse/convergence.js';
import { MOMENTUM_TUNING } from '../../src/domain/worldPulse/momentum.js';

const WAR_RULES = { warLayerEnabled: true, peaceEngineEnabled: true };

/** A minimal two-member campaign fixture. */
function campaignFixture(rules = WAR_RULES, worldExtra = {}) {
  return {
    id: 'c1',
    worldState: { tick: 4, simulationRules: { ...rules }, proposals: [], ...worldExtra },
    regionalGraph: { edges: [] },
    wizardNews: { entries: [], currentTick: 4 },
  };
}
const SAVES = [
  { id: 'a', settlement: { id: 'a', name: 'Aldford', population: 900, tier: 'village' } },
  { id: 'b', settlement: { id: 'b', name: 'Brackwater', population: 800, tier: 'village' } },
];

describe('the mint lane (one lane — DM mints ride the sim proposal path)', () => {
  it('a DECLARE_CASUS mint creates a record-identical pending proposal + a proposal news entry', () => {
    const campaign = campaignFixture();
    const r = mintRealmVerbProposal({
      campaign, saves: SAVES, verb: 'DECLARE_CASUS',
      args: { fromId: 'a', toId: 'b', type: 'grievance', severity01: 0.8 },
      now: '2026-01-01T00:00:00.000Z',
    });
    expect(r.ok).toBe(true);
    const proposals = r.result.worldState.proposals;
    expect(proposals).toHaveLength(1);
    const p = proposals[0];
    expect(p.status).toBe('pending');
    expect(p.tick).toBe(4);
    expect(p.outcome.candidateType).toBe('casus_declared');
    expect(p.outcome.applyMode).toBe('proposal');
    expect(p.outcome.proposalPayload.kind).toBe(REALM_VERB_PAYLOAD_KIND);
    expect(p.headline).toMatch(/Aldford/);
    expect(r.proposalId).toBe(p.id);
    expect(r.result.newsEntries.some((/** @type {any} */ n) => n.kind === 'queued')).toBe(true);
    // The world's OWN ledgers are untouched at mint (queue-not-commit).
    expect(warReasonsFor(r.result.worldState, 'a', 'b')).toBeNull();
  });

  it('dedup: an identical pending order refuses (the M10a hold guard)', () => {
    const campaign = campaignFixture();
    const first = mintRealmVerbProposal({
      campaign, saves: SAVES, verb: 'DECLARE_CASUS',
      args: { fromId: 'a', toId: 'b', type: 'grievance' }, now: '2026-01-01T00:00:00.000Z',
    });
    const withPending = { ...campaign, worldState: first.result.worldState };
    const second = mintRealmVerbProposal({
      campaign: withPending, saves: SAVES, verb: 'DECLARE_CASUS',
      args: { fromId: 'a', toId: 'b', type: 'treaty_default' }, now: '2026-01-01T00:00:00.000Z',
    });
    expect(second.ok).toBe(false);
    expect(second.code).toBe('order_already_pending');
  });

  it('BOUNDED BY CONSTRUCTION: a dark-gate mint refuses with the predicate\'s teaching reasons', () => {
    const campaign = campaignFixture({}); // war layer dark
    const r = mintRealmVerbProposal({
      campaign, saves: SAVES, verb: 'DECLARE_CASUS',
      args: { fromId: 'a', toId: 'b', type: 'grievance' },
    });
    expect(r.ok).toBe(false);
    expect(r.code).toBe('predicate_refused');
    expect(r.prose).toMatch(/causal reasons layer/i);
  });

  it('unknown and deferred verbs refuse at the builder', () => {
    expect(buildRealmVerbOutcome({ verb: 'NOT_A_VERB', args: {}, worldState: {}, snapshot: {}, tick: 0 }).ok).toBe(false);
    const deferred = buildRealmVerbOutcome({ verb: 'REINFORCE', args: {}, worldState: {}, snapshot: {}, tick: 0 });
    expect(deferred.ok).toBe(false);
    expect(deferred.code).toBe('verb_deferred');
  });
});

describe('force ≡ organic at the arm (byte-compared against the kernel functions)', () => {
  it('an approved DECLARE_CASUS equals the direct decree on the same world', () => {
    const campaign = campaignFixture();
    const minted = mintRealmVerbProposal({
      campaign, saves: SAVES, verb: 'DECLARE_CASUS',
      args: { fromId: 'a', toId: 'b', type: 'grievance', severity01: 0.8 },
      now: '2026-01-01T00:00:00.000Z',
    });
    const withPending = { ...campaign, worldState: minted.result.worldState };
    const applied = applyWorldPulseProposal({
      campaign: withPending, saves: SAVES, proposalId: minted.proposalId, now: '2026-01-02T00:00:00.000Z',
    });
    // The organic twin: the pure decree on the same input world at the same tick.
    const direct = declareCasus(campaign.worldState, { fromId: 'a', toId: 'b', type: 'grievance', severity01: 0.8, tick: 4 });
    expect(warReasonsFor(applied.worldState, 'a', 'b'))
      .toEqual(warReasonsFor(direct.worldState, 'a', 'b'));
    const p = applied.worldState.proposals.find((/** @type {any} */ x) => x.id === minted.proposalId);
    expect(p.status).toBe('applied');
  });

  it('an approved SUE_FOR_PEACE stamps the SAME recall contract as the direct order', () => {
    const world = { tick: 6, simulationRules: { ...WAR_RULES }, proposals: [], deployments: { a: { targetId: 'b', currentEffectiveStrength: 40 } } };
    const campaign = campaignFixture(WAR_RULES, world);
    campaign.worldState = world;
    const minted = mintRealmVerbProposal({
      campaign, saves: SAVES, verb: 'SUE_FOR_PEACE', args: { partyId: 'a' }, now: '2026-01-01T00:00:00.000Z',
    });
    expect(minted.ok).toBe(true);
    const withPending = { ...campaign, worldState: minted.result.worldState };
    const applied = applyWorldPulseProposal({
      campaign: withPending, saves: SAVES, proposalId: minted.proposalId, now: '2026-01-02T00:00:00.000Z',
    });
    const direct = sueForPeaceOrder(world, { partyId: 'a', foeId: 'b', tick: 6 });
    expect(applied.worldState.deployments).toEqual(direct.worldState.deployments);
    expect(applied.worldState.deployments.a.recalled.cause).toBe('sue_for_peace_decree');
  });

  it('LAPSE HONESTY: an order whose gate darkened before approval REFUSES VISIBLY (news + status refused)', () => {
    const campaign = campaignFixture();
    const minted = mintRealmVerbProposal({
      campaign, saves: SAVES, verb: 'DECLARE_CASUS',
      args: { fromId: 'a', toId: 'b', type: 'grievance' }, now: '2026-01-01T00:00:00.000Z',
    });
    // The world changes underneath: the war layer goes dark before approval.
    const darkened = {
      ...campaign,
      worldState: { ...minted.result.worldState, simulationRules: {} },
    };
    const applied = applyWorldPulseProposal({
      campaign: darkened, saves: SAVES, proposalId: minted.proposalId, now: '2026-01-02T00:00:00.000Z',
    });
    expect(applied.newsEntries.some((/** @type {any} */ n) => n.impactKind === 'realm_verb_refused')).toBe(true);
    expect(warReasonsFor(applied.worldState, 'a', 'b')).toBeNull(); // no phantom commit
    const p = applied.worldState.proposals.find((/** @type {any} */ x) => x.id === minted.proposalId);
    expect(p.status).toBe('refused');
    // The refused order never enters the applied ledger.
    expect(applied.autoApplied).toHaveLength(0);
  });
});

describe('FORCE_RECONSIDERATION — the priced crack, delivered by the DM', () => {
  // momentum lit + info-statecraft lit (the credibility stock only exists then;
  // the crack's legitimacy hit lands regardless — the organic contract).
  const MOMENTUM_LIT = { infoMode: 'unreliable', momentumEnabled: true, infoStatecraftEnabled: true };
  const cliff = MOMENTUM_TUNING.BASE_CLIFF_STOCK;
  /** @param {number} stock */
  const worldWithCourse = (stock) => ({
    tick: 9, simulationRules: { ...MOMENTUM_LIT }, spatialCanonVersion: 1, proposals: [],
    deployments: { a: { targetId: 'b', currentEffectiveStrength: 40 } },
    spatialLedgers: { commitments: { 'a>war:b': { stock, sinceTick: 0, lastDepositTick: 9, deposits: [] } } },
  });
  const updatesMap = () => new Map([
    ['a', { saveId: 'a', settlement: { id: 'a', name: 'Aldford', powerStructure: { publicLegitimacy: { score: 50 } } } }],
    ['b', { saveId: 'b', settlement: { id: 'b', name: 'Brackwater' } }],
  ]);
  const snapshot = { settlements: [{ id: 'a', name: 'Aldford', settlement: {} }, { id: 'b', name: 'Brackwater', settlement: {} }] };
  /** @param {number} stock @param {number} pressure01 */
  const press = (stock, pressure01) => applyRealmVerbOrder({
    state: worldWithCourse(stock), snapshot, settlementUpdates: updatesMap(),
    outcome: {
      proposalPayload: { kind: REALM_VERB_PAYLOAD_KIND, verb: 'FORCE_RECONSIDERATION', args: { targetId: 'a', courseKey: 'war:b', pressure01 } },
    },
    tick: 9, now: '2026-01-01T00:00:00.000Z',
  });

  it('the voice of reason: partial pressure withdraws stock through the ledger, receipted', () => {
    const r = press(cliff * 2, 0.35);
    expect(r.refusal).toBeNull();
    const entry = r.worldState.spatialLedgers.commitments['a>war:b'];
    expect(entry.stock).toBeLessThan(cliff * 2);
    expect(entry.deposits.at(-1).kind).toBe('dm_reconsideration');
    expect(r.worldState.deployments.a.recalled).toBeUndefined(); // the course holds
  });

  it('the final push on a PAST-CLIFF course cracks it: recall stamped, stock spent, the SAME priced climb-down lands', () => {
    // Stock exactly AT the cliff (pastCliff ≥) and maximal pressure (withdrawal
    // = 1 × cliff ≥ stock) ⇒ the push empties the course AND the crack prices.
    const r = applyRealmVerbOrder({
      state: worldWithCourse(cliff * 1.0), snapshot, settlementUpdates: updatesMap(),
      outcome: { proposalPayload: { kind: REALM_VERB_PAYLOAD_KIND, verb: 'FORCE_RECONSIDERATION', args: { targetId: 'a', courseKey: 'war:b', pressure01: 1 } } },
      tick: 9, now: '2026-01-01T00:00:00.000Z',
    });
    expect(r.refusal).toBeNull();
    // The physical wind-down: the standing sue-for-peace recall contract.
    expect(r.worldState.deployments.a.recalled.cause).toBe('sue_for_peace_decree');
    // The stock is spent (ledger entry dropped).
    expect(r.worldState.spatialLedgers?.commitments?.['a>war:b']).toBeUndefined();
    // The priced crack: the climb_down credibility charge + the legitimacy hit.
    expect(r.worldState.spatialLedgers?.credibility?.a?.score).toBeLessThan(0);
    const patched = r.settlementPatches?.get('a');
    expect(patched.powerStructure.publicLegitimacy.score).toBeLessThan(50);
    expect(r.newsEntries.some((/** @type {any} */ n) => n.kind === 'momentum_climb_down')).toBe(true);
  });

  it('a BELOW-CLIFF push is free physics: wind-down without the price', () => {
    const r = applyRealmVerbOrder({
      state: worldWithCourse(cliff * 0.5), snapshot, settlementUpdates: updatesMap(),
      outcome: { proposalPayload: { kind: REALM_VERB_PAYLOAD_KIND, verb: 'FORCE_RECONSIDERATION', args: { targetId: 'a', courseKey: 'war:b', pressure01: 1 } } },
      tick: 9, now: '2026-01-01T00:00:00.000Z',
    });
    expect(r.refusal).toBeNull();
    expect(r.worldState.deployments.a.recalled.cause).toBe('sue_for_peace_decree');
    expect(r.worldState.spatialLedgers?.credibility).toBeUndefined();
    expect(r.settlementPatches).toBeNull();
  });

  it('no live course ⇒ typed refusal', () => {
    const r = applyRealmVerbOrder({
      state: { tick: 9, simulationRules: { ...MOMENTUM_LIT }, spatialCanonVersion: 1 },
      snapshot, settlementUpdates: updatesMap(),
      outcome: { proposalPayload: { kind: REALM_VERB_PAYLOAD_KIND, verb: 'FORCE_RECONSIDERATION', args: { targetId: 'a', courseKey: 'war:b', pressure01: 1 } } },
      tick: 9, now: null,
    });
    expect(r.refusal?.code).toBe('reconsideration_no_course');
  });
});

describe('FORCE_ABANDON / FORCE_RESETTLE — the organic outcome substituted (zero new apply paths)', () => {
  const LIFECYCLE_LIT = { settlementLifecycleEnabled: true };

  it('FORCE_ABANDON substitutes the ORGANIC settlement_terminal_death outcome and the standard lane applies it', () => {
    const thorp = { id: 't', name: 'Dust End', tier: 'thorp', population: 40, institutions: [], npcs: [] };
    const state = { tick: 3, simulationRules: { ...LIFECYCLE_LIT }, proposals: [] };
    const snapshot = {
      settlements: [{ id: 't', name: 'Dust End', settlement: thorp }, { id: 'b', name: 'Brackwater', settlement: SAVES[1].settlement }],
      regionalGraph: { edges: [] },
    };
    const settlementUpdates = new Map([
      ['t', { saveId: 't', settlement: thorp }],
      ['b', { saveId: 'b', settlement: SAVES[1].settlement }],
    ]);
    const armed = applyRealmVerbOrder({
      state, snapshot, settlementUpdates,
      outcome: { proposalPayload: { kind: REALM_VERB_PAYLOAD_KIND, verb: 'FORCE_ABANDON', args: { targetId: 't' } } },
      tick: 3, now: '2026-01-01T00:00:00.000Z',
    });
    expect(armed.refusal).toBeNull();
    const sub = armed.substituteOutcome;
    expect(sub.candidateType).toBe('settlement_terminal_death');
    expect(sub.lifecyclePatch).toEqual({ kind: 'terminal_death', saveId: 't' });
    expect(sub.metadata?.lifecycle?.forced).toBe(true);
    // The FULL lane: the outcome applies through applyWorldPulseOutcomes exactly
    // as an organic terminal death does.
    const result = applyWorldPulseOutcomes({
      snapshot, worldState: state, regionalGraph: snapshot.regionalGraph,
      wizardNews: { entries: [], currentTick: 3 },
      settlementMap: settlementUpdates,
      outcomes: [{ ...sub, applyMode: 'auto' }], tick: 3, now: '2026-01-01T00:00:00.000Z',
      advanceNewsTick: false, advanceRegionalImpacts: false,
      simulationRules: state.simulationRules,
    });
    const dead = result.settlementUpdates.find((/** @type {any} */ u) => u.saveId === 't').settlement;
    expect(dead.population).toBe(0);
    expect(dead.lifecycleStatus).toBeTruthy();
    expect(result.autoApplied).toHaveLength(1);
  });

  it('FORCE_ABANDON refuses an above-thorp target (the walls hold under force)', () => {
    const town = { id: 't', name: 'Highwall', tier: 'town', population: 2000 };
    const armed = applyRealmVerbOrder({
      state: { tick: 3, simulationRules: { ...LIFECYCLE_LIT } },
      snapshot: { settlements: [{ id: 't', name: 'Highwall', settlement: town }] },
      settlementUpdates: new Map([['t', { saveId: 't', settlement: town }]]),
      outcome: { proposalPayload: { kind: REALM_VERB_PAYLOAD_KIND, verb: 'FORCE_ABANDON', args: { targetId: 't' } } },
      tick: 3, now: null,
    });
    expect(armed.refusal?.code).toBe('abandon_refused');
    expect(armed.newsEntries.some((/** @type {any} */ n) => n.impactKind === 'realm_verb_refused')).toBe(true);
  });
});

describe('THE RE-MINT CLOSED: intervention_ordered mints a pending proposal under a DM-driven mode', () => {
  it('advanceIntervention under dm_only mints the proposal (dedup held), and approval commits the record through the same arm', () => {
    const contested = {
      id: 't', name: 'Thornwall',
      settlement: {
        id: 't', name: 'Thornwall',
        powerStructure: {
          government: 'Council', factions: [
            { faction: 'Old Guard', power: 6, isGoverning: true },
            { faction: 'Young Blades', power: 5, stance: 'opposed' },
          ],
        },
      },
    };
    const patron = { id: 'p', name: 'Aldford', settlement: { id: 'p', name: 'Aldford' }, causal: { scores: { economic_capacity: 80 } } };
    const snapshot = {
      byId: new Map([['t', contested], ['p', patron]]),
      settlements: [contested, patron],
      regionalGraph: { edges: [{ from: 'p', to: 't', relationshipType: 'hostile' }] },
    };
    const worldState = {
      tick: 12,
      simulationRules: { warLayerEnabled: true, interventionEnabled: true, politicalAutonomy: 'dm_only' },
      proposals: [],
      stressors: [{ type: 'coup_detat', originSettlementId: 't' }],
      deployments: {},
    };
    const r = advanceIntervention({ snapshot, worldState, graph: snapshot.regionalGraph, rng: null, tick: 12, now: '2026-01-01T00:00:00.000Z' });
    expect(r.changed).toBe(true);
    const minted = (r.worldState.proposals || []).filter((/** @type {any} */ p) => p.outcome?.candidateType === 'intervention_ordered');
    expect(minted).toHaveLength(1);
    expect(minted[0].status).toBe('pending');
    expect(minted[0].outcome.proposalPayload.kind).toBe(REALM_VERB_PAYLOAD_KIND);
    expect(minted[0].outcome.proposalPayload.verb).toBe('ORDER_INTERVENTION');
    expect(r.deferrals.some((/** @type {any} */ d) => d.reason === 'dm_approval')).toBe(true);
    // No ledger write yet (the mint is a QUEUE, not a commit).
    expect(r.worldState.spatialLedgers?.interventions).toBeUndefined();

    // Dedup: a second tick with the proposal pending mints NOTHING new.
    const again = advanceIntervention({ snapshot, worldState: r.worldState, graph: snapshot.regionalGraph, rng: null, tick: 13, now: '2026-01-02T00:00:00.000Z' });
    const mintedAgain = (again.worldState.proposals || []).filter((/** @type {any} */ p) => p.outcome?.candidateType === 'intervention_ordered');
    expect(mintedAgain).toHaveLength(1);

    // APPROVAL: the same arm the DM's own ORDER_INTERVENTION uses commits the
    // record in the mover's own shape.
    const campaign = { id: 'c1', worldState: r.worldState, regionalGraph: snapshot.regionalGraph, wizardNews: { entries: [], currentTick: 12 } };
    const saves = [
      { id: 't', settlement: contested.settlement },
      { id: 'p', settlement: patron.settlement },
    ];
    const applied = applyWorldPulseProposal({ campaign, saves, proposalId: minted[0].id, now: '2026-01-03T00:00:00.000Z' });
    const rec = applied.worldState.spatialLedgers?.interventions?.['p:t'];
    expect(rec).toBeTruthy();
    expect(rec).toMatchObject({ interId: 'p', target: 't' });
    expect(rec.strength).toBeGreaterThan(0);
    expect(['incumbent', 'challenger']).toContain(rec.side);
    expect(typeof rec.sinceTick).toBe('number');
  });
});

describe('outcome-id args fold — a decided proposal survives a same-verb re-stage (composer-realm-verbs-4)', () => {
  const snapshot = { settlements: [{ id: 'a', settlement: SAVES[0].settlement }, { id: 'b', settlement: SAVES[1].settlement }] };
  const mk = (/** @type {any} */ args) => buildRealmVerbOutcome({ verb: 'DECLARE_CASUS', args, worldState: {}, snapshot, tick: 4 });

  it('different args for the SAME verb/actor/tick mint DISTINCT outcome ids', () => {
    const o1 = mk({ fromId: 'a', toId: 'b', type: 'grievance', severity01: 0.8 });
    const o2 = mk({ fromId: 'a', toId: 'b', type: 'grievance', severity01: 0.4 }); // an edited severity
    expect(o1.ok && o2.ok).toBe(true);
    expect(o1.outcome.id).not.toBe(o2.outcome.id);
    // The id keeps its (verb, actor, tick) prefix + a 6-char stable arg hash.
    expect(o1.outcome.id).toMatch(/^realm_verb\.DECLARE_CASUS\.a\.4\.[0-9a-z]{6}$/);
  });

  it('identical args re-mint the SAME id (an unedited re-stage coalesces — no ledger bloat)', () => {
    const args = { fromId: 'a', toId: 'b', type: 'grievance', severity01: 0.8 };
    expect(mk(args).outcome.id).toBe(mk({ ...args }).outcome.id);
  });

  it('arg key order does not change the id (stable sort)', () => {
    const a1 = mk({ fromId: 'a', toId: 'b', type: 'grievance', severity01: 0.8 });
    const a2 = mk({ severity01: 0.8, type: 'grievance', toId: 'b', fromId: 'a' });
    expect(a1.outcome.id).toBe(a2.outcome.id);
  });

  it('a DECIDED proposal is NOT overwritten when an EDITED order is re-staged in the same tick', () => {
    const campaign = campaignFixture();
    const r1 = mintRealmVerbProposal({
      campaign, saves: SAVES, verb: 'DECLARE_CASUS',
      args: { fromId: 'a', toId: 'b', type: 'grievance', severity01: 0.8 },
      now: '2026-01-01T00:00:00.000Z',
    });
    expect(r1.ok).toBe(true);
    const p1 = r1.result.worldState.proposals[0];
    // Decide it (dismiss) so it is no longer pending — the actor-dedup guard
    // (pendingActorMajorFor) only blocks PENDING orders, so a re-stage is allowed.
    const ws2 = updateProposalStatus(r1.result.worldState, p1.id, 'dismissed');
    const r2 = mintRealmVerbProposal({
      campaign: { ...campaign, worldState: ws2 }, saves: SAVES, verb: 'DECLARE_CASUS',
      args: { fromId: 'a', toId: 'b', type: 'grievance', severity01: 0.4 }, // the DM edited the severity
      now: '2026-01-02T00:00:00.000Z',
    });
    expect(r2.ok).toBe(true);
    const props = r2.result.worldState.proposals;
    expect(props).toHaveLength(2); // both survive — the edited re-stage did NOT upsert over the decided record
    const decided = props.find((/** @type {any} */ p) => p.id === p1.id);
    expect(decided.status).toBe('dismissed'); // the decided record's history is intact
    const fresh = props.find((/** @type {any} */ p) => p.id !== p1.id);
    expect(fresh.status).toBe('pending');
  });
});
