/**
 * sovereigntyDmVerbWr10w.test.js — LANE WW-D: the DM verb and the AI surface.
 *
 * WR-10 requirement 14 says every simulation capability has a forceable counterpart.
 * TRANSFER_SOVEREIGNTY is the conveyance's, and these pins exist because the ways of
 * getting a DM verb wrong in this estate are specific and already named:
 *
 *   • ONE WRITER, BOTH ROADS. The seam ruling asks for one executor with two
 *     transports. A DM road that rewrote `occupations` itself would compile, pass, and
 *     quietly become the second conveyance writer — so the arm is pinned to produce
 *     state IDENTICAL to calling executeSovereigntyTransfer directly, and the file is
 *     source-scanned for a second occupier write that does not exist.
 *   • THE SOVEREIGN-HAND LAW IS THE ELIGIBILITY READ. There is no `userPlaced` field
 *     anywhere in the tree, so a bypass arm cannot be tested for by looking for a flag
 *     it would ignore. It is tested by proving the POSITIVE derivation reaches the
 *     verb: a settlement no ledger names never appears in the dial and refuses at the
 *     arm with the read's own receipt.
 *   • THE QUEUE MOUTH. An order is approved later than it was staged. A holding that
 *     changed hands in between must refuse VISIBLY — the DM approved "this court gives
 *     up this place", and taking it from a court that never appeared in the order is
 *     the phantom commit §10 forbids.
 *   • THE LIFECYCLE. requirement 14's own clause: a DM-ordered conveyance rides the
 *     same state homes as the engine's. Order → approve → save/load → undo is executed
 *     end to end, with the §4 regen split asserted on BOTH sides — the durable
 *     fragility in the occupation record, the legitimacy echo on the generated field.
 *     Its immutability half is a STRUCTURAL CLONE of the world the approval is handed,
 *     deep-compared afterwards (CR-WR10-J): the mint copies the occupations map, so an
 *     in-place write inside the writer never reaches the campaign's own object and
 *     cannot be caught by reading that object — only by comparing the graph that was
 *     actually passed in. Identity proves nothing here in either direction.
 *
 * Every negative is anchored. No fixture mirrors the deriver: the ledgers are built in
 * the shape the real writers produce, and every read under test is the production one.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  REALM_MANIFEST, realmVerbFor, realmVerbs, executableRealmVerbs,
  conveyableAssetOptions, realmVetoProse,
} from '../../src/domain/events/realmManifest.js';
import {
  buildRealmVerbOutcome, applyRealmVerbOrder, REALM_VERB_PAYLOAD_KIND,
} from '../../src/domain/worldPulse/realmVerbExecution.js';
import {
  mintRealmVerbProposal, applyWorldPulseProposal,
} from '../../src/domain/worldPulse/applyWorldPulse.js';
import { ensureWorldState } from '../../src/domain/worldPulse/worldState.js';
import { CHANGE_AUTHORITY_POLICY } from '../../src/domain/worldPulse/changeAuthorityPolicy.js';
import { deriveDecisionTier } from '../../src/domain/worldPulse/decisionTier.js';
import {
  SOVEREIGNTY_REQUIRED_RULES, readSovereigntyAsset,
} from '../../src/domain/worldPulse/sovereigntyAssets.js';
import {
  SOVEREIGNTY_TRANSFER_TUNING, executeSovereigntyTransfer,
} from '../../src/domain/worldPulse/sovereigntyTransfer.js';
import { satellitesLedgerOf, satellitesOf } from '../../src/domain/worldPulse/settlementLifecycleKernel.js';
import { createOccupationRecord } from '../../src/domain/worldPulse/occupation.js';
import { heraldSectionOfRecord, isExplicitlyRouted } from '../../src/domain/realm/heraldRouting.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const ARM_SOURCE = join(ROOT, 'src/domain/worldPulse/realmVerbExecution.js');

/** Every prerequisite law explicitly true, derived from the exported conjunction so a
 *  rule joining it cannot leave these fixtures silently dark (the WW-A idiom). */
const LIT = Object.fromEntries(SOVEREIGNTY_REQUIRED_RULES.map((key) => [key, true]));

const STEADING = {
  id: 'steading.ironvale.4', name: 'Ash Camp', parentId: 'ironvale', tier: 'thorp',
  population: 40, foundedTick: 4, provenance: 'growth', orbit: 1, inflow: 40, backing01: 0.5,
};

/**
 * A world whose ledgers say who holds what:
 *   • saltmarch holds greenhollow at the vassalized rung (conveyable),
 *   • saltmarch holds thornwick at `contested` (a fight in progress — NOT conveyable),
 *   • ironvale holds a steading (conveyable),
 *   • freehold appears in NO ledger (the DM-placed case — free, never for sale).
 */
function heldWorld(patch = {}) {
  return {
    tick: 9,
    simulationRules: { ...LIT },
    proposals: [],
    spatialLedgers: {
      satellites: { ironvale: { steadings: { [STEADING.id]: { ...STEADING } }, lastSeedTick: 4 } },
    },
    occupations: {
      greenhollow: {
        ...createOccupationRecord('saltmarch', 2),
        state: 'vassalized', stateHeld: 9, resistance: 0.04, benefitYield: 0.3,
      },
      thornwick: { ...createOccupationRecord('saltmarch', 8), state: 'contested' },
    },
    relationshipStates: {},
    ...patch,
  };
}

const save = (id, name, legitimacy = null) => ({
  id,
  settlement: {
    id, name, population: 800, tier: 'village',
    ...(legitimacy == null ? {} : { powerStructure: { publicLegitimacy: { score: legitimacy } } }),
  },
});

const SAVES = [
  save('ironvale', 'Ironvale'),
  save('saltmarch', 'Saltmarch'),
  save('greenhollow', 'Greenhollow', 60),
  save('thornwick', 'Thornwick'),
  save('freehold', 'Freehold'),
];

const CTX = {
  settlements: SAVES.map((s) => ({ id: s.id, name: s.settlement.name, settlement: s.settlement })),
  tick: 9,
};

const EDGES = [
  { id: 'edge.greenhollow.saltmarch', from: 'greenhollow', to: 'saltmarch', relationshipType: 'neutral' },
];

const snapshotOf = () => ({
  settlements: CTX.settlements,
  regionalGraph: { edges: EDGES },
});

const updatesOf = () => new Map(SAVES.map((s) => [s.id, { saveId: s.id, settlement: { ...s.settlement } }]));

/** Drive the arm exactly as applyWorldPulseOutcomes does. */
function order(state, args, extra = {}) {
  return applyRealmVerbOrder({
    state,
    snapshot: snapshotOf(),
    settlementUpdates: updatesOf(),
    outcome: { proposalPayload: { kind: REALM_VERB_PAYLOAD_KIND, verb: 'TRANSFER_SOVEREIGNTY', args } },
    tick: 12,
    now: '2026-01-01T00:00:00.000Z',
    ...extra,
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
describe('WW-D — the manifest row', () => {
  it('registers TRANSFER_SOVEREIGNTY with the §2 surface and grows the census to 16/14', () => {
    const entry = realmVerbFor('TRANSFER_SOVEREIGNTY');
    expect(entry).toBeTruthy();
    expect(entry).toMatchObject({
      verb: 'TRANSFER_SOVEREIGNTY', family: 'War', scope: 'realm', lane: 'proposal',
      candidateType: 'sovereignty_conveyed', authority: 'sovereignty_conveyed',
    });
    expect(entry.dials.length).toBeLessThanOrEqual(4);
    expect(entry.dials.map((/** @type {{ key: string }} */ d) => d.key)).toEqual(['assetId', 'buyerId']);
    expect(realmVerbs()).toHaveLength(16);
    expect(executableRealmVerbs()).toHaveLength(14);
    expect(Object.keys(REALM_MANIFEST)).toContain('TRANSFER_SOVEREIGNTY');
  });

  it('every covered veto code renders DM-facing prose, and the arm can actually emit each one', () => {
    const entry = realmVerbFor('TRANSFER_SOVEREIGNTY');
    for (const code of entry.coversVetoCodes) {
      const prose = realmVetoProse(code, 'X');
      expect(prose, code).toBeTruthy();
      // anchored: the toBeTruthy above proves the feed resolved this code to real prose, so this cannot pass on an empty/absent lookup
      expect(prose).not.toMatch(/^The (change|order) was refused \(/);
    }
    // BOTH covered codes are REACHED by the arm on a real world (a covered code the arm
    // can never emit is dead prose, which is why only two are claimed).
    expect(order({ ...heldWorld(), simulationRules: {} }, { assetId: 'greenhollow', buyerId: 'ironvale' })
      .refusal?.code).toBe('sovereignty_gate_dark');
    expect(order(heldWorld(), { assetId: 'freehold', buyerId: 'ironvale' })
      .refusal?.code).toBe('sovereignty_ineligible');
  });

  it('the authority row is always-proposal + campaignAltering, and the tier classifier agrees', () => {
    expect(CHANGE_AUTHORITY_POLICY.sovereignty_conveyed).toMatchObject({
      authority: 'always-proposal',
      module: 'realmVerbExecution.js',
      consultsProposalFlag: false,
      campaignAltering: true,
    });
    expect(CHANGE_AUTHORITY_POLICY.sovereignty_conveyed.rationale.length).toBeGreaterThan(80);
    expect(deriveDecisionTier({ candidateType: 'sovereignty_conveyed', type: 'realm_verb', severity: 0.7 })).toBe('major');
  });

  it('both routing keys are explicitly filed (the Herald never files a conveyance by accident)', () => {
    expect(isExplicitlyRouted('sovereignty_conveyed')).toBe(true);
    expect(isExplicitlyRouted('realm_verb_transfer_sovereignty')).toBe(true);
    expect(heraldSectionOfRecord({ impactKind: 'realm_verb_transfer_sovereignty' })).toBe('trade');
  });

  it('the predicate TEACHES when dark, and when the campaign holds nothing conveyable', () => {
    const dark = realmVerbFor('TRANSFER_SOVEREIGNTY').predicate({ simulationRules: {} }, CTX);
    expect(dark.available).toBe(false);
    expect(dark.reasons.join(' ')).toMatch(/sovereignty market is not active/i);
    expect(dark.unlocks.join(' ')).toMatch(/envoy layer/i);

    const emptyLedgers = realmVerbFor('TRANSFER_SOVEREIGNTY')
      .predicate({ simulationRules: { ...LIT } }, CTX);
    expect(emptyLedgers.available).toBe(false);
    expect(emptyLedgers.reasons.join(' ')).toMatch(/holds anything it could convey/i);

    expect(realmVerbFor('TRANSFER_SOVEREIGNTY').predicate(heldWorld(), CTX).available).toBe(true);
  });

  it('THE SOVEREIGN-HAND LAW IS THE DIAL: only ledger-named holdings are offered', () => {
    const offered = conveyableAssetOptions(heldWorld(), CTX).map((o) => o.id);
    // The positive control: BOTH conveyable kinds are present, so the list is real.
    expect(offered).toEqual(['greenhollow', STEADING.id]); // codepoint order, both kinds
    // anchored: the exact-equality assertion above proves the list is built and non-empty, so this absence is an exclusion and not an empty collection
    expect(offered).not.toContain('freehold'); // a DM-placed settlement no ledger names
    // anchored: same non-empty list — a fight in progress is not a holding.
    expect(offered).not.toContain('thornwick');
    // And the law is the READ, not a flag: freehold's own receipt says why.
    expect(readSovereigntyAsset(heldWorld(), 'freehold').kind).toBe('free');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('WW-D — the mint refuses a doomed order before it reaches the queue', () => {
  const build = (/** @type {Record<string, unknown>} */ args, state = heldWorld()) =>
    buildRealmVerbOutcome({ verb: 'TRANSFER_SOVEREIGNTY', args, worldState: state, snapshot: snapshotOf(), tick: 9 });

  it('derives the SELLER from the ledgers rather than asking for it', () => {
    const built = build({ assetId: 'greenhollow', buyerId: 'ironvale' });
    expect(built.ok).toBe(true);
    expect(built.outcome.proposalPayload.args.sellerId).toBe('saltmarch');
    expect(built.outcome.targetSaveId).toBe('saltmarch');
    expect(built.outcome.candidateType).toBe('sovereignty_conveyed');
    expect(built.outcome.applyMode).toBe('proposal');
    expect(built.outcome.headline).toContain('Saltmarch');
  });

  it('refuses a free settlement, a self-purchase, and a buyer that is the holding itself', () => {
    expect(build({ assetId: 'freehold', buyerId: 'ironvale' }).code).toBe('sovereignty_ineligible');
    expect(build({ assetId: 'thornwick', buyerId: 'ironvale' }).code).toBe('sovereignty_ineligible');
    expect(build({ assetId: 'greenhollow', buyerId: 'saltmarch' }).code).toBe('sovereignty_ineligible');
    expect(build({ assetId: 'greenhollow', buyerId: 'greenhollow' }).code).toBe('sovereignty_ineligible');
    expect(build({ assetId: 'greenhollow', buyerId: '' }).code).toBe('sovereignty_ineligible');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('WW-D — the executor arm re-runs the gates against the CURRENT world', () => {
  it('DARK: the gate refuses visibly and the world comes back by REFERENCE', () => {
    const state = { ...heldWorld(), simulationRules: {} };
    const r = order(state, { assetId: 'greenhollow', buyerId: 'ironvale', sellerId: 'saltmarch' });
    expect(r.refusal?.code).toBe('sovereignty_gate_dark');
    expect(r.worldState).toBe(state);
    expect(r.newsEntries.some((/** @type {any} */ n) => n.impactKind === 'realm_verb_refused')).toBe(true);
  });

  it('INELIGIBLE: a free settlement refuses with the eligibility read\'s OWN receipt, and writes nothing', () => {
    const state = heldWorld();
    const r = order(state, { assetId: 'freehold', buyerId: 'ironvale', sellerId: 'saltmarch' });
    expect(r.refusal?.code).toBe('sovereignty_ineligible');
    expect(r.refusal.detail).toContain('answers to no one');
    expect(r.worldState).toBe(state);
    expect(r.worldState.occupations.greenhollow.occupierId).toBe('saltmarch');
  });

  it('THE QUEUE MOUTH: a holding that changed hands after the order REFUSES, never phantom-commits', () => {
    // The order was staged while saltmarch held greenhollow; by approval, thornwick does.
    const moved = heldWorld();
    moved.occupations = {
      ...moved.occupations,
      greenhollow: { ...moved.occupations.greenhollow, occupierId: 'thornwick' },
    };
    const r = order(moved, { assetId: 'greenhollow', buyerId: 'ironvale', sellerId: 'saltmarch' });
    expect(r.refusal?.code).toBe('sovereignty_ineligible');
    expect(r.refusal.detail).toMatch(/changed hands since the order was staged/);
    // No phantom commit: the live holder keeps the holding.
    expect(r.worldState.occupations.greenhollow.occupierId).toBe('thornwick');
    // The POSITIVE control on the same fixture: with the live holder named, it conveys.
    const honoured = order(moved, { assetId: 'greenhollow', buyerId: 'ironvale', sellerId: 'thornwick' });
    expect(honoured.refusal).toBeNull();
    expect(honoured.worldState.occupations.greenhollow.occupierId).toBe('ironvale');
  });

  it('THE VASSAL CONVEYANCE: the rung is preserved, the fragility is raised, the echo is a settlement patch', () => {
    const state = heldWorld();
    const r = order(state, { assetId: 'greenhollow', buyerId: 'ironvale', sellerId: 'saltmarch' });
    expect(r.refusal).toBeNull();
    const record = r.worldState.occupations.greenhollow;
    expect(record.occupierId).toBe('ironvale');
    expect(record.state).toBe('vassalized');          // deliberately NOT reset to contested
    expect(record.stateHeld).toBe(0);
    expect(record.sinceTick).toBe(12);
    expect(record.resistance).toBeGreaterThanOrEqual(SOVEREIGNTY_TRANSFER_TUNING.RESISTANCE_START);
    // THE §4 REGEN SPLIT, both halves: the DURABLE fragility is campaign worldState…
    expect(state.occupations.greenhollow.occupierId).toBe('saltmarch'); // the input is untouched
    // …and the VOLATILE echo is a patch on the generated settlement field.
    const patched = r.settlementPatches?.get('greenhollow');
    expect(patched.powerStructure.publicLegitimacy.score).toBe(60 + SOVEREIGNTY_TRANSFER_TUNING.LEGITIMACY_DELTA);
    // One registered beat, addressed to all three parties.
    const beats = r.newsEntries.filter((/** @type {any} */ n) => n.impactKind === 'realm_verb_transfer_sovereignty');
    expect(beats).toHaveLength(1);
    expect(beats[0].settlementIds).toEqual(['saltmarch', 'ironvale', 'greenhollow']);
    expect(beats[0].summary).toContain('Greenhollow');
  });

  it('THE GRIEVANCE reaches the sold town\'s own edge (the writer\'s fuel, through the DM road)', () => {
    const r = order(heldWorld(), { assetId: 'greenhollow', buyerId: 'ironvale', sellerId: 'saltmarch' });
    const states = r.worldState.relationshipStates || {};
    const resentments = Object.values(states).map((/** @type {any} */ s) => Number(s?.resentment) || 0);
    expect(Math.max(0, ...resentments)).toBeCloseTo(SOVEREIGNTY_TRANSFER_TUNING.GRIEVANCE_MAGNITUDE, 6);
  });

  it('THE SATELLITE CONVEYANCE: the steading row moves parents through the arm too', () => {
    const state = heldWorld();
    const r = order(state, { assetId: STEADING.id, buyerId: 'saltmarch', sellerId: 'ironvale' });
    expect(r.refusal).toBeNull();
    const ledger = satellitesLedgerOf(r.worldState);
    expect(satellitesOf(ledger, 'saltmarch').map((/** @type {any} */ s) => s.id)).toEqual([STEADING.id]);
    expect(satellitesOf(ledger, 'ironvale')).toEqual([]);
    expect(satellitesOf(ledger, 'saltmarch')[0].conveyed).toMatchObject({ fromId: 'ironvale', tick: 12 });
    // A steading has no seat and no relationship object, so no legitimacy echo is owed.
    expect(r.settlementPatches).toBeNull();
  });

  it('ONE WRITER, BOTH ROADS: the arm\'s state is IDENTICAL to calling the writer directly', () => {
    const state = heldWorld();
    const armed = order(state, { assetId: 'greenhollow', buyerId: 'ironvale', sellerId: 'saltmarch' });
    const direct = executeSovereigntyTransfer({
      worldState: state,
      term: { type: 'sovereignty_transfer', assetId: 'greenhollow' },
      sellerId: 'saltmarch', buyerId: 'ironvale', tick: 12,
      edges: EDGES, now: '2026-01-01T00:00:00.000Z',
    });
    expect(direct.executed).toBe(true);
    expect(armed.worldState.occupations).toEqual(direct.worldState.occupations);
    expect(armed.worldState.relationshipStates).toEqual(direct.worldState.relationshipStates);
  });

  it('NO BYPASS ARM EXISTS TO WRITE: the verb\'s file holds exactly one conveyance call and no second occupier writer', () => {
    const src = readFileSync(ARM_SOURCE, 'utf8');
    // The scan reached real source (the non-vacuity anchor for every count below).
    expect(src).toContain('readSovereigntyAsset(');
    expect(src.match(/executeSovereigntyTransfer\(/g)).toHaveLength(1);
    // A second occupier writer would be the whole defect; there is none to find.
    expect(src.match(/createOccupationRecord|conveyOccupationRecord/g)).toBe(null);
    expect(src.match(/occupations:\s*\{/g)).toBe(null);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('WW-D — requirement 14\'s lifecycle clause: order → approve → save/load → undo', () => {
  it('the conveyance survives every state home a campaign has, and the regen split holds', () => {
    const campaign = {
      id: 'c1',
      worldState: heldWorld(),
      regionalGraph: { edges: EDGES },
      wizardNews: { entries: [], currentTick: 9 },
    };
    const preApply = campaign.worldState;
    const preApplyClone = structuredClone(preApply);

    // ORDER — the DM stages it through the one realm-verb mint.
    const minted = mintRealmVerbProposal({
      campaign, saves: SAVES, verb: 'TRANSFER_SOVEREIGNTY',
      args: { assetId: 'greenhollow', buyerId: 'ironvale' },
      now: '2026-01-01T00:00:00.000Z',
    });
    expect(minted.ok).toBe(true);
    const queued = minted.result.worldState;
    const pending = queued.proposals.find((/** @type {any} */ p) => p.id === minted.proposalId);
    expect(pending.status).toBe('pending');
    // QUEUE, NOT COMMIT: the ledgers are untouched while the order waits.
    expect(queued.occupations.greenhollow.occupierId).toBe('saltmarch');

    /* THE PRE-STATE, CLONED BEFORE THE ORDER EXECUTES — CR-WR10-J.
     *
     * This pin used to claim the alias trap by asserting `preApply` still named the
     * seller after the apply, and that claim was VACUOUS, for a reason that had to be
     * measured rather than reasoned: `mintRealmVerbProposal` hands the approval a world
     * whose `occupations` map AND whose greenhollow record are FRESH OBJECTS (identity
     * measured false on all three of worldState / occupations / the record). So a writer
     * that abandoned its immutable rebuild and wrote `occupations[assetId] = next`
     * straight into the map it was given would land that write on the mint's private
     * copy, leave the campaign's own object pristine, and pass here — which is exactly
     * what the round-1 Mutant E did.
     *
     * The graph that must be proven untouched is therefore the one the approval is
     * actually HANDED, and the proof is a structural clone taken before it runs and a
     * DEEP COMPARE afterwards. Identity is no proof in either direction: a legitimate
     * immutable rebuild returns a different reference, and an in-place write returns the
     * same one, so only the values can say which happened. The campaign's own worldState
     * is cloned and compared too — weaker, because the mint's copy stands between it and
     * the writer, but it is what the undo ring actually holds. */
    const queuedClone = structuredClone(queued);
    expect(queuedClone.occupations.greenhollow).toMatchObject({ occupierId: 'saltmarch', state: 'vassalized' });

    // APPROVE — through the standard proposal applier, no realm-verb side door.
    const applied = applyWorldPulseProposal({
      campaign: { ...campaign, worldState: queued }, saves: SAVES,
      proposalId: minted.proposalId, now: '2026-01-02T00:00:00.000Z',
    });
    expect(applied.worldState.proposals.find((/** @type {any} */ p) => p.id === minted.proposalId).status).toBe('applied');
    expect(applied.worldState.occupations.greenhollow).toMatchObject({
      occupierId: 'ironvale', state: 'vassalized', stateHeld: 0,
    });
    const conveyedSave = applied.settlementUpdates.find((/** @type {any} */ u) => u.saveId === 'greenhollow');
    expect(conveyedSave.settlement.powerStructure.publicLegitimacy.score)
      .toBe(60 + SOVEREIGNTY_TRANSFER_TUNING.LEGITIMACY_DELTA);

    // THE ORIGINAL GRAPH WAS NEVER MUTATED. The two assertions above prove the write
    // really landed on this same call, so the comparison below runs over a conveyance
    // that happened rather than passing for free on an apply that did nothing.
    expect(queued).toEqual(queuedClone);
    expect(JSON.stringify(queued)).toBe(JSON.stringify(queuedClone));
    expect(preApply).toEqual(preApplyClone);
    // The rebuild is a NEW graph rather than the old one edited — read against the deep
    // equality above, which is what makes this an immutability claim instead of a
    // reference-counting one.
    // anchored: `queued` is pinned deep-equal to its pre-order clone two lines above, so
    // this cannot pass on an apply that returned an unwritten world.
    expect(applied.worldState).not.toBe(queued);
    // anchored: same deep equality, and the rebuilt map is pinned to carry the new holder
    // by the toMatchObject above, so neither side of this comparison is an empty world.
    expect(applied.worldState.occupations).not.toBe(queued.occupations);

    // SAVE / LOAD — the durable halves ride the conditional-ledger clone and a JSON
    // round trip (the alias trap: a shared reference would survive a clone and lie).
    const reloaded = ensureWorldState(JSON.parse(JSON.stringify(applied.worldState)));
    expect(reloaded.occupations.greenhollow).toEqual(applied.worldState.occupations.greenhollow);
    expect(reloaded.occupations.greenhollow.resistance)
      .toBeGreaterThanOrEqual(SOVEREIGNTY_TRANSFER_TUNING.RESISTANCE_START);
    expect(reloaded.relationshipStates).toEqual(applied.worldState.relationshipStates);

    // UNDO — the pulse ring restores the pre-apply worldState wholesale, which is only
    // honest if the apply never mutated it. Both the object the ring holds and a
    // reload of it still name the seller.
    expect(preApply.occupations.greenhollow.occupierId).toBe('saltmarch');
    expect(ensureWorldState(JSON.parse(JSON.stringify(preApply))).occupations.greenhollow.occupierId)
      .toBe('saltmarch');

    // THE §4 REGEN SPLIT, executed: a single-settlement regeneration recomputes the
    // GENERATED publicLegitimacy field and keeps campaign worldState. Modelled by
    // dropping the generated block and re-reading — the durable half is untouched.
    const regenerated = { ...conveyedSave.settlement, powerStructure: { publicLegitimacy: { score: 60 } } };
    expect(regenerated.powerStructure.publicLegitimacy.score).toBe(60); // the echo is volatile, by declaration
    expect(reloaded.occupations.greenhollow.occupierId).toBe('ironvale'); // the conveyance is not
  });
});
