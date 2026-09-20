/**
 * participationWriteBase.test.js — EM-B1k: THE PARTICIPATION VIEW IS A READ PROJECTION
 * AND MUST NEVER BE THE WRITE BASE.
 *
 * THE DEFECT THIS PINS (confirmed by execution before the cure, 2026-09-19). The pulse
 * built the settlement it WRITES from `snapshot.settlements[].settlement` — the OFF-STAGE
 * filtered participation view (DESIGN_THE_ROADS.md §8) — so a DM-shelved person or a roads
 * hostage was born missing from the tick's own settlement, and `campaignPulseHelpers.js:197`
 * landed that shortened roster wholesale into both the store save and the DB payload. One
 * committed tick ERASED the person's record: not hidden, not flagged — gone, with their role,
 * importance, affiliation, personality, secrets and influence. Un-shelving then failed with
 * `npc_target_missing`, because the target no longer existed to un-shelve.
 *
 * THE CURE, in `pulseKernel.js` alone: `buildSettlementMap` prefers the RAW `item.save`
 * settlement, and the `localSettlements` seed keeps the raw roster on the tick's own
 * settlement-level work. The update's roster is therefore the raw roster FROM BIRTH, so there
 * is exactly one roster again and every mover's write lands on it.
 *
 * CURE-F NARROWED THE SEED'S CONDITION (2026-09-20) without weakening it. The landed line asked
 * whether the CLOCK CHAIN'S OUTPUT roster differed from the save's; it now asks whether the
 * TICK'S INPUT roster did. The two agree on every tree A8 can measure — no clock step writes
 * `npcs` — but they part the moment one does: the old question read a legitimate clock roster
 * write as evidence of filtering and discarded it for EVERY settlement, the new one discards
 * nothing that participation did not hide. The off-stage guarantee above is untouched.
 *
 * ⛔ THE SEAM IS THE SUBJECT, NEVER A RE-IMPLEMENTATION OF IT. Every arm below drives the
 * SHIPPED entry points — `applyNpcOp` (the Availability control's own writer),
 * `simulateCampaignWorldPulse`, and the real `applyWorldPulseResultToState` — and reads the
 * roster the save WOULD HOLD, in both homes the store writes.
 *
 * @enforced-by the EM-B1k acceptance matrix (A1, A2, A4, A8) + CURE-F
 */
import { describe, it, expect, vi } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { applyNpcOp } from '../../src/store/settlementPendingEditWriters.js';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';
import { applyWorldPulseResultToState } from '../../src/store/campaignPulseHelpers.js';
import { ensureRegionalGraph } from '../../src/domain/region/graph.js';
import { isOffStage } from '../../src/domain/roads/state.js';
import { npcId } from '../../src/domain/worldPulse/npcAgency.js';
import { killNpc, createNpc } from '../../src/domain/entities/npcs.js';
import { advanceTime } from '../../src/domain/timeProgression.js';
import { advanceFoodStockpile, blockadeFor } from '../../src/domain/worldPulse/foodStockpile.js';
import { applyBlockadeTransportImpairment } from '../../src/domain/worldPulse/blockadeTransport.js';
import { advanceTreasury } from '../../src/domain/worldPulse/treasury.js';
import { goldenCorpus } from '../helpers/goldenMasterCorpus.js';

const NOW = '2026-01-01T00:00:00.000Z';
const SAVE_ID = 'ashford';
const TOWN_CONFIG = {
  settType: 'town',
  culture: 'anglo_saxon',
  terrainOverride: 'plains',
  tradeRouteAccess: 'road',
  monsterThreat: 'civilized',
};
/** The overwrite this suite exists to keep honest, named once so every failure points at it. */
const OVERWRITE_SITE = 'src/domain/worldPulse/pulseKernel.js — the localSettlements seed in the'
  + ' settlement_clock stage, which restores the raw save roster over the roster the clock chain'
  + " hands it WHENEVER PARTICIPATION FILTERED THE TICK'S INPUT (CURE-F: the comparand is"
  + " `item.settlement`, the tick's own input, not `vaulted.settlement`, the clock's output)";

/** A real generated town, pinned by seed. @param {string} seed */
function generatedTown(seed) {
  const settlement = generateSettlementPipeline(TOWN_CONFIG, null, { seed, customContent: {} });
  settlement.id = SAVE_ID;
  return settlement;
}

/** The DM's own act, through the shipped writer behind the Availability control. */
function shelveThroughTheDmWriter(settlement, targetId, reason) {
  const store = { settlement };
  return applyNpcOp(() => store, (fn) => fn(store), {
    kind: 'stasis-npc',
    payload: { npcId: String(targetId), reason },
  });
}

/**
 * One tick through the SHIPPED entry, then the REAL store commit.
 * `tick` is the pulse entry point, defaulted to the shipped one; CURE-F's arm passes a
 * freshly-imported kernel whose treasury step is stubbed, so no other arm's module graph moves.
 */
function commitOneTick(settlement, simulationRules, rngSeed, tick = simulateCampaignWorldPulse) {
  const save = {
    id: SAVE_ID,
    name: settlement.name,
    phase: 'canon',
    settlement,
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
  const campaign = {
    id: 'campaign-em-b1k',
    name: 'EM-B1k',
    settlementIds: [SAVE_ID],
    worldState: { rngSeed, tick: 4, simulationRules },
    regionalGraph: ensureRegionalGraph({ edges: [], channels: [] }),
    wizardNews: { currentTick: 4, entries: [] },
  };
  const result = tick({
    campaign, saves: [save], interval: 'one_month', commit: true, now: NOW,
  });
  return { save, campaign, result, commit: () => {
    const state = {
      savedSettlements: [JSON.parse(JSON.stringify(save))],
      activeSaveId: SAVE_ID,
      settlement: null,
      systemState: null,
      editedAt: null,
    };
    return { state, persistUpdates: applyWorldPulseResultToState(state, campaign, result, NOW) };
  } };
}

/** Ids in roster order, as strings — the shape both persisted homes are compared in. */
function rosterIds(settlement) {
  return (settlement?.npcs || []).map((npc) => String(npc.id)).sort();
}

describe('EM-B1k — the tick writes the roster it was given, never the one participation hid', () => {
  it('A1 — the DM shelves somebody, one committed tick, and BOTH persisted homes still hold everyone', () => {
    // The seed is the packet's own reproduction shape: a SEVEN-person town, so the defect reports
    // itself in the figures the acceptance matrix quotes — `6 of 7`, then `npc_target_missing`.
    const settlement = generatedTown('em-b1k-a1-dm');
    const everyone = rosterIds(settlement);
    const shelved = settlement.npcs[0];
    expect(everyone.length, 'the generated town must have a roster to lose somebody from').toBeGreaterThan(1);

    const shelveResult = shelveThroughTheDmWriter(settlement, shelved.id, 'sequestered');
    expect(shelveResult, 'the shipped Availability writer applied the shelf').toEqual({ ok: true, status: 'applied', reason: null });
    expect(rosterIds(settlement), 'shelving removes nobody from the SAVE — it is a stage mark').toEqual(everyone);
    expect(isOffStage(settlement.npcs.find((npc) => String(npc.id) === String(shelved.id))), 'the shelved person is off-stage').toBe(true);

    const { commit } = commitOneTick(settlement, {}, 'em-b1k-a1-world');
    const { state, persistUpdates } = commit();
    const storeRoster = rosterIds(state.savedSettlements[0].settlement);
    const dbRoster = rosterIds(persistUpdates[0].settlement);
    // Un-shelving is attempted BEFORE the roster assertions so a single failure prints BOTH
    // halves of the defect the way the reproduction reports them, rather than stopping at the
    // first one and hiding the refusal that proves the record is gone rather than merely hidden.
    const after = { settlement: state.savedSettlements[0].settlement };
    const unshelve = applyNpcOp(() => after, (fn) => fn(after), { kind: 'return-npc', payload: { npcId: String(shelved.id) } });
    const asReported = `store ${storeRoster.length} of ${everyone.length} / DB ${dbRoster.length} of ${everyone.length};`
      + ` un-shelve afterwards -> ${JSON.stringify(unshelve)}`;
    expect(
      storeRoster,
      `THE STORE SAVE LOST SOMEBODY THE TICK DID NOT REMOVE (${asReported}). ${OVERWRITE_SITE}`,
    ).toEqual(everyone);
    expect(
      dbRoster,
      `THE DB PAYLOAD LOST SOMEBODY THE TICK DID NOT REMOVE (${asReported}). ${OVERWRITE_SITE}`,
    ).toEqual(everyone);
    expect(
      unshelve,
      'un-shelving must succeed: a `npc_target_missing` refusal here means the person was ERASED by the tick, not merely hidden',
    ).toEqual({ ok: true, status: 'applied', reason: null });
  });

  it('A2 — a roads HOSTAGE survives a committed tick, with the roads lane lit', () => {
    // ⚠ A CONSTRUCTION, NOT A CLAIM THAT THE MOVER RAN. The real ransom mover needs
    // roadsActive AND a spatial digest AND a capture roll across several ticks, so the
    // smallest lawful construction is used: the mover's OWN whereabouts shape, exactly as
    // roadsKernel writes it for a hostage, placed on the save before the tick. Roads is LIT
    // deliberately — the roads lane's own full-roster compensation is doubly gated (roadsActive
    // AND a spatial digest), so a lit realm with no digest has no protection either.
    const settlement = generatedTown('em-b1k-a2');
    const everyone = rosterIds(settlement);
    const captive = settlement.npcs[1];
    captive.whereabouts = {
      state: 'hostage',
      placeId: 'captor-hold',
      purposeKind: 'raid',
      sinceTick: 3,
      expectedReturnTick: null,
      missionId: 'mission-em-b1k-a2',
    };
    expect(isOffStage(captive), 'the constructed whereabouts really is off-stage').toBe(true);

    const { commit } = commitOneTick(settlement, { roadsEnabled: true }, 'em-b1k-a2-world');
    const { state, persistUpdates } = commit();
    expect(
      rosterIds(persistUpdates[0].settlement),
      `THE HOSTAGE WAS ERASED BY THE TICK — a captive is off-stage, never dead. ${OVERWRITE_SITE}`,
    ).toEqual(everyone);
    expect(rosterIds(state.savedSettlements[0].settlement), 'the store save holds the hostage too').toEqual(everyone);
    expect(
      (persistUpdates[0].settlement.npcs || []).find((npc) => String(npc.id) === String(captive.id))?.whereabouts?.state,
      'the captive is persisted STILL A HOSTAGE, not quietly released',
    ).toBe('hostage');
  });

  it('A4 — a death and an arrival during the tick both land, and the off-stage person is there too', () => {
    // ⚠ THE TWO MOVER WRITES ARE CONSTRUCTED IN THE MOVERS' OWN SHAPES (the A2 precedent), but
    // the BASE they are written onto is the real seam's own output: the death is the per-person
    // `.map` shape three movers use, through the estate's one death writer (`killNpc`); the
    // arrival is the `[...npcs, minted]` append shape two movers use, through the estate's one
    // NPC mint (`createNpc`). What is under test is that all three facts survive TOGETHER —
    // nothing a mover did is lost, and nothing the filter hid is dropped.
    const settlement = generatedTown('em-b1k-a4');
    const offStage = settlement.npcs[0];
    const victim = settlement.npcs[1];
    shelveThroughTheDmWriter(settlement, offStage.id, 'sequestered');

    const { result, commit } = commitOneTick(settlement, {}, 'em-b1k-a4-world');
    const base = result.settlementUpdates[0].settlement;
    const withDeath = {
      ...base,
      npcs: (base.npcs || []).map((npc) => (String(npc.id) === String(victim.id) ? killNpc(npc, 'event.em-b1k-a4').npc : npc)),
    };
    const arrival = createNpc({ name: 'Hallveig the Newcomer', role: 'factor', importance: 'notable', _idSeed: 'em-b1k-a4' });
    result.settlementUpdates[0].settlement = { ...withDeath, npcs: [...withDeath.npcs, arrival] };

    const { persistUpdates } = commit();
    const persisted = persistUpdates[0].settlement.npcs || [];
    const ids = persisted.map((npc) => String(npc.id));
    expect(
      persisted.find((npc) => String(npc.id) === String(victim.id))?.status,
      'THE DEATH WAS LOST: a mover marked this person dead during the tick and the write-back dropped the mark',
    ).toBe('dead');
    expect(ids.includes(String(arrival.id)), 'THE ARRIVAL WAS LOST: a person who joined during the tick is not in the persisted roster').toBe(true);
    expect(
      ids.includes(String(offStage.id)),
      `THE OFF-STAGE PERSON WAS DROPPED while the tick's own writes survived. ${OVERWRITE_SITE}`,
    ).toBe(true);

    // THE npcId FALLBACK PIN — asserted, never assumed. `npcId` is id-first with a POSITIONAL
    // fallback (`npc_<index>`), and the fallback can mis-pair across two rosters of different
    // length. Every member carries `id` and `name`, so the id branch is the one taken.
    const positionallyKeyed = persisted.filter((npc, index) => npcId(SAVE_ID, npc, index) !== `${SAVE_ID}:${String(npc.id)}`);
    expect(persisted.every((npc) => !!npc.id && !!npc.name), 'every roster member carries both `id` and `name`').toBe(true);
    expect(positionallyKeyed.map((npc) => String(npc.name)), 'a roster member resolved through the POSITIONAL fallback — the merge key can mis-pair').toEqual([]);
  });

  it('A8 — the settlement_clock chain returns the roster BY REFERENCE at every step, over corpus towns', () => {
    // ⛔ THE PREMISE OF THE OVERWRITE. When participation filtered the tick's input, the seed
    // line restores the save's roster over the one the clock chain hands it — which is right ONLY
    // because that chain never writes `npcs`. (Since CURE-F a clock roster write DOES survive a
    // tick with nobody off-stage, so the premise now binds the off-stage case alone; it is no
    // weaker there, and the arm below is what keeps it true.) This drives
    // all four exported clock functions IN THE KERNEL'S OWN ORDER — advanceTime, then the
    // granary, then the blockaded dock, then the vault — with the treasury DARK and LIT, a
    // blockade PRESENT and ABSENT, and three intervals, and asserts the roster comes back as the
    // SAME ARRAY. The day somebody adds a roster write to this stage, this reds and names the
    // line that would silently drop it.
    const stressors = [{ id: 'siege-em-b1k', type: 'siege', severity: 0.8, lifecycleStage: 'active', affectedSettlementIds: [SAVE_ID] }];
    const rows = goldenCorpus();
    const towns = [];
    for (let index = 0; index < rows.length; index += 131) {
      const { _seed: seed, ...config } = rows[index];
      const town = generateSettlementPipeline(config, null, { seed, customContent: {} });
      town.id = SAVE_ID;
      if (!Array.isArray(town.npcs) || !town.npcs.length) continue;
      towns.push({ label: `${config.settType}/${config.culture}`, town });
    }
    // ⛔ MEASURED AND RECORDED RATHER THAN ASSUMED: **zero of the golden corpus's 525
    // configurations** generates an institution whose name matches the blockade mover's own
    // /airship/i test, so over corpus towns alone that step is a pure pass-through and its
    // by-reference claim would be anchored by nothing it actually did. One corpus town is
    // therefore ALSO carried in a dock-bearing variant — the mover's own trigger, constructed —
    // so the step really stamps an `access` impairment under the siege and lifts it without one,
    // while the roster must still come back as the SAME array.
    const dockHost = towns[0];
    towns.push({
      label: `${dockHost.label}+airship-dock`,
      town: { ...dockHost.town, institutions: [...(dockHost.town.institutions || []), { id: 'inst.airship-dock', name: 'Airship Dock', type: 'transport', impairments: [] }] },
    });
    const broken = [];
    let steps = 0;
    let rosterRows = 0;
    let settlementIdentityChanges = 0;
    let granaryMoves = 0;
    let vaultSummaries = 0;
    let dockImpairments = 0;
    for (const { label, town } of towns) {
      rosterRows += town.npcs.length;
      for (const interval of ['one_week', 'one_month', 'one_season']) {
        for (const treasuryEnabled of [false, true]) {
          for (const besieged of [false, true]) {
            const blockade = besieged ? blockadeFor(stressors, SAVE_ID) : null;
            const where = `${label}/${interval}/treasury:${treasuryEnabled}/siege:${besieged}`;
            const timed = advanceTime(town, { interval, previousTickState: null });
            if (timed.newSettlement !== town) settlementIdentityChanges += 1;
            if (timed.newSettlement.npcs !== town.npcs) broken.push(`advanceTime @ ${where}`);
            const stocked = advanceFoodStockpile(timed.newSettlement, { interval, tick: 4, blockade, famine: null, deployment: null, seasonal: null });
            if (stocked.changed) granaryMoves += 1;
            if (stocked.settlement.npcs !== timed.newSettlement.npcs) broken.push(`advanceFoodStockpile @ ${where}`);
            const sieged = applyBlockadeTransportImpairment(stocked.settlement, blockade, { now: NOW });
            if (sieged !== stocked.settlement) dockImpairments += 1;
            if (sieged.npcs !== stocked.settlement.npcs) broken.push(`applyBlockadeTransportImpairment @ ${where}`);
            const vaulted = advanceTreasury(sieged, { interval, tick: 4, deployment: null, blockade, rules: { treasuryEnabled } });
            if (vaulted.summary) vaultSummaries += 1;
            if (vaulted.settlement.npcs !== sieged.npcs) broken.push(`advanceTreasury @ ${where}`);
            steps += 4;
          }
        }
      }
    }
    // Liveness: a by-reference claim over a chain that did nothing is worth nothing.
    expect(rosterRows, 'the corpus stride must exercise real rosters').toBeGreaterThan(0);
    expect(steps, 'the clock chain must actually have been driven').toBeGreaterThan(0);
    expect(settlementIdentityChanges, 'the chain must copy-on-write the SETTLEMENT at least once, or "the roster is the same array" is trivially true').toBeGreaterThan(0);
    expect(granaryMoves, 'the granary must really advance somewhere in the stride').toBeGreaterThan(0);
    expect(vaultSummaries, 'the treasury must really run in its LIT state somewhere in the stride').toBeGreaterThan(0);
    expect(dockImpairments, 'the blockaded-dock step must really stamp an impairment somewhere in the stride, or its by-reference claim is anchored by nothing it did').toBeGreaterThan(0);
    expect(
      [...new Set(broken)],
      'A SETTLEMENT_CLOCK STEP NOW WRITES `npcs`. That breaks the premise of'
      + ` ${OVERWRITE_SITE}: for a settlement carrying an off-stage person the seed restores the`
      + ' RAW save roster, so a roster written by this stage would be silently discarded for'
      + ' exactly those settlements — the ones whose rosters are already the fragile case. (Since'
      + " CURE-F the write survives when nobody is off-stage, so this is no longer EVERY"
      + ' settlement every tick; it is still a silent loss where it bites.) Cure the seed line to'
      + ' MERGE that write — do not relax this assertion.',
    ).toEqual([]);
  });

  it('CURE-F — a clock-stage roster write survives a dormant tick, and an off-stage person is still restored', async () => {
    // ⛔ THE COMPARAND IS THE TICK'S INPUT ROSTER, NOT THE CLOCK'S OUTPUT. EM-B1k's seed line
    // asked `item.save.settlement.npcs !== vaulted.settlement.npcs` — a question about the
    // CLOCK CHAIN'S OUTPUT. A8 measures that no clock step writes `npcs` today, so the two were
    // indistinguishable and the cure was correct as landed. But the moment a step DOES write a
    // roster, that comparand reads its new array as "participation filtered this" and restores
    // the raw save roster over it, dropping the write for EVERY settlement — including the
    // dormant ones the filter never touched. CURE-F asks `item.save.settlement.npcs !==
    // item.settlement.npcs` instead: a question about what the tick was HANDED. With nobody
    // off-stage `item.settlement` IS `saveSettlement(item.save)` by reference
    // (worldSnapshot.js:131, the `else` branch), so the condition is false and the clock's
    // settlement passes through whole; with somebody off-stage the filtered copy's `npcs` is a
    // NEW array, the condition is true, and the raw roster is restored exactly as before.
    //
    // ⚠ A STUB, AND IT IS NAMED AS ONE. No shipped clock step writes `npcs` (that is A8's
    // measurement), so the only way to drive this branch is to make one. The smallest lawful
    // stub is the real treasury module with its ONE clock writer replaced, applied through
    // `vi.doMock` + a fresh kernel import so that no other arm's module graph moves — A8 drives
    // the REAL `advanceTreasury` and must keep doing so.
    let clockRosterWrites = 0;
    const CLOCK_HIRE = createNpc({ name: 'Wystan the Clerk', role: 'factor', importance: 'minor', _idSeed: 'cure-f-clock' });
    vi.resetModules();
    vi.doMock('../../src/domain/worldPulse/treasury.js', async (importOriginal) => ({
      .../** @type {Record<string, unknown>} */ (await importOriginal()),
      advanceTreasury: (/** @type {any} */ settlement) => {
        clockRosterWrites += 1;
        return { settlement: { ...settlement, npcs: [...(settlement?.npcs || []), CLOCK_HIRE] }, summary: null };
      },
    }));
    const { simulateCampaignWorldPulse: tickWithRosterWritingClock } = await import('../../src/domain/worldPulse/pulseKernel.js');

    // HALF ONE — NOBODY OFF-STAGE. The clock's hire must reach both persisted homes.
    const dormant = generatedTown('cure-f-dormant');
    const dormantRoster = rosterIds(dormant);
    expect((dormant.npcs || []).some((npc) => isOffStage(npc)), 'half one requires a town with NOBODY off-stage').toBe(false);
    const withHire = [...dormantRoster, String(CLOCK_HIRE.id)].sort();
    expect(withHire.length, 'the hire must really be a new roster member').toBe(dormantRoster.length + 1);
    const dormantTick = commitOneTick(dormant, {}, 'cure-f-dormant-world', tickWithRosterWritingClock);
    const dormantCommit = dormantTick.commit();
    // Liveness: a claim about a stubbed step is worth nothing if the step never ran.
    expect(clockRosterWrites, 'the stubbed clock step must really have run').toBeGreaterThan(0);
    expect(
      rosterIds(dormantCommit.persistUpdates[0].settlement),
      'THE CLOCK STAGE\'S ROSTER WRITE WAS DROPPED ON A TICK WITH NOBODY OFF-STAGE. '
      + `${OVERWRITE_SITE}. The comparand read the clock's OUTPUT array as evidence that`
      + " participation had filtered the input, and restored the raw roster over a write nothing"
      + ' had hidden.',
    ).toEqual(withHire);
    expect(
      rosterIds(dormantCommit.state.savedSettlements[0].settlement),
      'the store save must carry the clock write too — the two homes may never disagree',
    ).toEqual(withHire);

    // HALF TWO — ONE PERSON SHELVED. Raw wins, exactly as EM-B1k landed it: the off-stage
    // person is restored and the clock's hire is dropped with the rest of the filtered copy.
    // Green before CURE-F and after it — this half is the control that the cure narrowed the
    // condition without weakening it.
    const shelvedTown = generatedTown('cure-f-offstage');
    const shelvedRoster = rosterIds(shelvedTown);
    const hidden = shelvedTown.npcs[0];
    shelveThroughTheDmWriter(shelvedTown, hidden.id, 'sequestered');
    expect(
      isOffStage(shelvedTown.npcs.find((npc) => String(npc.id) === String(hidden.id))),
      'half two requires somebody genuinely off-stage, or it is half one wearing a second seed',
    ).toBe(true);
    const shelvedTick = commitOneTick(shelvedTown, {}, 'cure-f-offstage-world', tickWithRosterWritingClock);
    const shelvedCommit = shelvedTick.commit();
    const shelvedPersisted = rosterIds(shelvedCommit.persistUpdates[0].settlement);
    expect(
      shelvedPersisted,
      `THE RAW ROSTER MUST STILL WIN WHEN PARTICIPATION FILTERED THE INPUT. ${OVERWRITE_SITE}.`
      + " EM-B1k's guarantee is unchanged by CURE-F: the off-stage person comes back, and the"
      + ' clock write is discarded with the filtered copy it rode in on.',
    ).toEqual(shelvedRoster);
    expect(
      shelvedPersisted.includes(String(hidden.id)),
      'the shelved person must be restored from the raw save — this is the data-loss defect EM-B1k cured',
    ).toBe(true);
    // anchored: the roster equality one assertion above proves the list is populated and is the raw roster, so this absence is the filtered copy losing its rider rather than an empty scan
    expect(shelvedPersisted.includes(String(CLOCK_HIRE.id)), 'the clock hire rode the filtered copy and goes with it').toBe(false);
  });
});
