/**
 * forecastRun.test.js — W-COMPOSER-2 Stage 4: THE FORECAST (Composer V2 §10).
 *
 * The §10 pin set, domain side: queue-inclusive baseline, marginal attribution
 * (with-vs-without, both queue-inclusive), replay determinism, zero
 * persistence (clone-and-discard — the inputs never mutate), realm-wide
 * staleness fingerprints, and the component-twin drift guard.
 * (Preview ≡ apply against the REAL committed advance is the joins pin:
 * tests/joins/realmForecast.test.js.)
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  simulatePendingFuture, runRealmForecast, forecastFingerprint, forecastDigest,
} from '../../src/domain/worldPulse/forecastRun.js';

function fixture(name) {
  return {
    id: name.toLowerCase(), name, tier: 'town', population: 1800,
    config: { tradeRouteAccess: 'road', monsterThreat: 'safe' },
    institutions: [{ id: 'institution.granary', name: 'Granary', category: 'civic', status: 'active' }],
    economicState: { primaryImports: [], primaryExports: [] },
    powerStructure: {
      publicLegitimacy: { score: 40, label: 'Contested' },
      factions: [{ faction: 'Council', category: 'governance', power: 60 }],
      conflicts: [],
    },
    npcs: [], activeConditions: [],
  };
}
function save(id) {
  return {
    id, name: id, tier: 'town', settlement: fixture(id), seed: `${id}-seed`,
    campaignState: { phase: 'canon', eventLog: [], systemState: null, canonizedAt: '2026-01-01T00:00:00.000Z' },
  };
}
function campaignOf(pendingEvents = []) {
  return {
    id: 'camp-f', name: 'Realm', settlementIds: ['ashford', 'brookmere'],
    regionalGraph: { edges: [], channels: [], queuedImpacts: [] },
    wizardNews: { currentTick: 0, entries: [] },
    worldState: {
      rngSeed: 'forecast-seed', tick: 0, canonizedAt: '2026-01-01T00:00:00.000Z',
      pendingEvents,
    },
  };
}
const SAVES = () => [save('ashford'), save('brookmere')];
const NOW = '2026-02-01T00:00:00.000Z';
const queuedStressor = (saveId, id = 'ev-q') => ({
  queueId: `pe_${saveId}_${id}`, saveId, queuedAt: '2026-01-15T00:00:00.000Z',
  event: { id, type: 'APPLY_STRESSOR', targetId: 'under_siege', payload: { stressorType: 'under_siege', label: 'Under Siege', severity: 0.7 }, cause: 'player_action' },
});

describe('THE FORECAST — the realm\'s pending future (§10)', () => {
  it('REPLAY DETERMINISM: same world + queue + interval ⇒ the identical forecast, forever', async () => {
    const a = await simulatePendingFuture({ campaign: campaignOf([queuedStressor('ashford')]), saves: SAVES(), interval: 'one_month', now: NOW });
    const b = await simulatePendingFuture({ campaign: campaignOf([queuedStressor('ashford')]), saves: SAVES(), interval: 'one_month', now: NOW });
    expect(JSON.parse(JSON.stringify(a.result.worldState))).toEqual(JSON.parse(JSON.stringify(b.result.worldState)));
    expect(JSON.parse(JSON.stringify(a.result.settlementUpdates))).toEqual(JSON.parse(JSON.stringify(b.result.settlementUpdates)));
  });

  it('NO-COMMIT DISCIPLINE: the inputs never mutate (clone-and-discard)', async () => {
    const campaign = campaignOf([queuedStressor('ashford')]);
    const saves = SAVES();
    const beforeCampaign = JSON.parse(JSON.stringify(campaign));
    const beforeSaves = JSON.parse(JSON.stringify(saves));
    await simulatePendingFuture({ campaign, saves, interval: 'one_month', now: NOW });
    expect(JSON.parse(JSON.stringify(campaign))).toEqual(beforeCampaign);
    expect(JSON.parse(JSON.stringify(saves))).toEqual(beforeSaves);
  });

  it('QUEUE-INCLUSIVE LAW: a forecast with a non-empty queue differs from the naked-world forecast exactly by the queue\'s effects', async () => {
    const withQueue = await simulatePendingFuture({ campaign: campaignOf([queuedStressor('ashford')]), saves: SAVES(), interval: 'one_week', now: NOW });
    const naked = await simulatePendingFuture({ campaign: campaignOf([]), saves: SAVES(), interval: 'one_week', now: NOW });
    const stressorsWith = (withQueue.result.worldState.stressors || []).map((/** @type {any} */ s) => s.type);
    const stressorsNaked = (naked.result.worldState.stressors || []).map((/** @type {any} */ s) => s.type);
    // The queued crisis' roaming twin drained in (twin type: the pulse vocabulary).
    expect(stressorsWith.some((/** @type {string} */ k) => /siege/.test(k))).toBe(true);
    expect(stressorsNaked.some((/** @type {string} */ k) => /siege/.test(k))).toBe(false);
    expect(withQueue.drainedCount).toBe(1);
    expect(naked.drainedCount).toBe(0);
  });

  it('MARGINAL ATTRIBUTION: candidate diff = with-vs-without, both queue-inclusive; the candidate drains LAST', async () => {
    const campaign = campaignOf([queuedStressor('ashford')]);
    const candidate = {
      saveId: 'brookmere',
      event: { id: 'ev-cand', type: 'APPLY_STRESSOR', targetId: 'plague_outbreak', payload: { stressorType: 'plague_outbreak', label: 'Plague', severity: 0.6 }, cause: 'player_action' },
    };
    const { baseline, withCandidate } = await runRealmForecast({ campaign, saves: SAVES(), interval: 'one_week', now: NOW, candidate });
    const baseTypes = (baseline.result.worldState.stressors || []).map((/** @type {any} */ s) => s.type);
    const candTypes = (withCandidate.result.worldState.stressors || []).map((/** @type {any} */ s) => s.type);
    expect(baseTypes.some((/** @type {string} */ k) => /siege/.test(k))).toBe(true);   // both runs are queue-inclusive
    expect(candTypes.some((/** @type {string} */ k) => /siege/.test(k))).toBe(true);
    expect(baseTypes.some((/** @type {string} */ k) => /plague/.test(k))).toBe(false);
    expect(candTypes.some((/** @type {string} */ k) => /plague/.test(k))).toBe(true);   // the marginal contribution
    expect(withCandidate.drainedCount).toBe(2);
  });

  it('the forecast surfaces queue-mouth refusals (the lapsed docket, previewed)', async () => {
    const doomed = {
      queueId: 'pe_ashford_doomed', saveId: 'ashford', queuedAt: NOW,
      event: { id: 'ev-doom', type: 'REMOVE_TRADE_GOOD', targetId: 'moon-sugar', payload: {}, cause: 'player_action' },
    };
    const run = await simulatePendingFuture({ campaign: campaignOf([doomed]), saves: SAVES(), interval: 'one_week', now: NOW });
    expect(run.refusals).toHaveLength(1);
    expect(run.refusals[0].code).toBe('trade_good_not_found');
  });

  it('REALM-WIDE STALENESS: the fingerprint moves on queue add, queue edit, advance, and proposal decisions', () => {
    const base = campaignOf([]);
    const fp0 = forecastFingerprint(base, 'one_month');
    expect(forecastFingerprint(base, 'one_year')).not.toBe(fp0);                        // interval
    expect(forecastFingerprint(campaignOf([queuedStressor('ashford')]), 'one_month')).not.toBe(fp0); // queue add
    const edited = campaignOf([{ ...queuedStressor('ashford'), queuedAt: '2026-01-16T00:00:00.000Z' }]);
    expect(forecastFingerprint(edited, 'one_month'))
      .not.toBe(forecastFingerprint(campaignOf([queuedStressor('ashford')]), 'one_month'));          // in-place edit
    const advanced = campaignOf([]);
    advanced.worldState.tick = 4;
    expect(forecastFingerprint(advanced, 'one_month')).not.toBe(fp0);                   // advance
    const withProposal = campaignOf([]);
    withProposal.worldState.proposals = [{ id: 'p1', status: 'pending' }];
    expect(forecastFingerprint(withProposal, 'one_month')).not.toBe(fp0);               // proposal minted
    // composer-realm-verbs-2: a DECIDED proposal now folds into the revision
    // (the mint-and-decide-between-frames case the pending set alone misses), so
    // a decided proposal no longer collides with the no-proposal baseline.
    const decided = campaignOf([]);
    decided.worldState.proposals = [{ id: 'p1', status: 'applied' }];
    expect(forecastFingerprint(decided, 'one_month')).not.toBe(fp0);                    // decided-count fold
  });

  it('REALM-WIDE STALENESS (composer-realm-verbs-2): tick-neutral world mutations void the forecast', () => {
    const base = campaignOf([]);
    const fp0 = forecastFingerprint(base, 'one_month');
    // A rules edit (updateCampaignSimulationRules folds an rc_<tick>_<seq> receipt
    // into worldState.rulesetLog) — invisible before this fold.
    const rulesEdited = campaignOf([]);
    rulesEdited.worldState.rulesetLog = { rc_0_1: { key: 'calamityEnabled', to: true } };
    expect(forecastFingerprint(rulesEdited, 'one_month')).not.toBe(fp0);                // rules edit
    // A party impact (recordPartyImpact rewrites worldState.stressors) — invisible
    // before this fold.
    const partyImpacted = campaignOf([]);
    partyImpacted.worldState.stressors = [{ id: 's1', type: 'under_siege', severity: 0.5 }];
    expect(forecastFingerprint(partyImpacted, 'one_month')).not.toBe(fp0);              // party impact (stressor add)
  });

  it('DRIFT GUARD: the component\'s inlined fingerprint twin is byte-identical source to the domain\'s', () => {
    const domainSrc = readFileSync(join(process.cwd(), 'src/domain/worldPulse/forecastRun.js'), 'utf-8');
    const uiSrc = readFileSync(join(process.cwd(), 'src/components/map/RealmForecast.jsx'), 'utf-8');
    // The UI-form derivation expressions must appear verbatim in the UI twin.
    for (const line of [
      '`${q.queueId}@${q.queuedAt}`',
      ".filter(p => p && p.status === 'pending').map(p => p.id).join('|')",
      '`${ws.tick ?? 0}:${interval}:${queue}:${proposals}:${revision}`',
    ]) {
      expect(uiSrc.includes(line), `UI twin missing: ${line}`).toBe(true);
    }
    // The world-revision fold (composer-realm-verbs-2) + the return template must
    // appear VERBATIM in BOTH files — the twin cannot drift on the new fold.
    for (const line of [
      'Object.keys(ws.rulesetLog || {}).length',
      '(ws.stressors || []).length',
      '`${ws.tick ?? 0}:${interval}:${queue}:${proposals}:${revision}`',
    ]) {
      expect(uiSrc.includes(line) && domainSrc.includes(line), `fingerprint twin drift on: ${line}`).toBe(true);
    }
  });

  it('THE DIGEST renders per-member, time-resolved, with pause markers', async () => {
    const saves = SAVES();
    const run = await simulatePendingFuture({ campaign: campaignOf([queuedStressor('ashford')]), saves, interval: 'one_week', now: NOW });
    const digest = forecastDigest(run, saves);
    expect(digest.members).toHaveLength(2);
    const ashford = digest.members.find((/** @type {any} */ m) => m.saveId === 'ashford');
    expect(ashford.name).toBe('ashford');
    expect(typeof ashford.populationBefore).toBe('number');
    expect(Array.isArray(ashford.beats)).toBe(true);
    expect(Array.isArray(digest.pauseMarkers)).toBe(true);
  });
});
