/**
 * tests/domain/captureTransitionNews.test.js — Wave 7 #3 pins.
 *
 * factionCaptureEvents were emitted into the pulseRecord and consumed by
 * NOBODY — a faction could fall under criminal control and the DM would
 * never hear of it. Now:
 *   • transitions crossing the 'corrupted' boundary emit Wizard News
 *     (factual headlines; 'major' for full capture / liberation);
 *   • transitions into/out of full 'capture' stamp the settlement's
 *     permanent history (historicalEvents vocabulary, stressorAftermath
 *     idiom, idempotent, capped).
 */

import { describe, it, expect } from 'vitest';
import {
  captureTransitionNewsEntries,
  withCaptureHistoryEvent,
  recordCaptureTransitionsIntoHistory,
} from '../../src/domain/worldPulse/factionCapture.js';
import { advanceCampaignWorld } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const transition = (from, to) => ({
  factionId: 'a:city_watch',
  settlementId: 'a',
  name: 'City Watch',
  from,
  to,
});

const nameFor = () => 'Greyford';

describe('captureTransitionNewsEntries', () => {
  it('a transition to full capture emits exactly one major, factual entry', () => {
    const entries = captureTransitionNewsEntries([transition('corrupted', 'capture')], nameFor, 9, '2026-06-11T00:00:00.000Z');
    expect(entries).toHaveLength(1);
    expect(entries[0].significance).toBe('major');
    expect(entries[0].headline).toBe('City Watch of Greyford falls under criminal control');
    expect(entries[0].impactKind).toBe('faction_capture');
    expect(entries[0].tick).toBe(9);
    expect(entries[0].settlementIds).toEqual(['a']);
    expect(entries[0].createdAt).toBe('2026-06-11T00:00:00.000Z');
  });

  it('liberation (leaving capture) is major; the corrupted boundary is notable', () => {
    const [liberation] = captureTransitionNewsEntries([transition('capture', 'corrupted')], nameFor, 10);
    expect(liberation.significance).toBe('major');
    expect(liberation.headline).toContain('breaks the underworld');
    const [compromised] = captureTransitionNewsEntries([transition('equilibrium', 'corrupted')], nameFor, 10);
    expect(compromised.significance).toBe('notable');
    const [recovering] = captureTransitionNewsEntries([transition('corrupted', 'equilibrium')], nameFor, 10);
    expect(recovering.significance).toBe('notable');
  });

  it('rung moves wholly below the corrupted boundary are posture, not news', () => {
    expect(captureTransitionNewsEntries([transition('none', 'adversarial')], nameFor, 3)).toHaveLength(0);
    expect(captureTransitionNewsEntries([transition('equilibrium', 'adversarial')], nameFor, 3)).toHaveLength(0);
    expect(captureTransitionNewsEntries([transition('adversarial', 'equilibrium')], nameFor, 3)).toHaveLength(0);
  });
});

describe('withCaptureHistoryEvent', () => {
  const settlement = () => ({ name: 'Greyford', history: { historicalEvents: [] } });

  it('a fall to capture stamps exactly one campaign-era history event, idempotently', () => {
    const once = withCaptureHistoryEvent(settlement(), transition('corrupted', 'capture'), 9);
    const events = once.history.historicalEvents;
    expect(events).toHaveLength(1);
    expect(events[0].name).toBe('The Capture of City Watch');
    expect(events[0].type).toBe('corruption_scandal'); // historyData vocabulary
    expect(events[0].campaignEra).toBe(true);
    expect(events[0].tick).toBe(9);
    expect(Array.isArray(events[0].lastingEffects)).toBe(true);
    // Idempotent per (faction, tick).
    expect(withCaptureHistoryEvent(once, transition('corrupted', 'capture'), 9)).toBe(once);
  });

  it('liberation stamps history; lesser rung moves do not', () => {
    const liberated = withCaptureHistoryEvent(settlement(), transition('capture', 'corrupted'), 14);
    expect(liberated.history.historicalEvents[0].name).toBe('The Liberation of City Watch');
    const s = settlement();
    expect(withCaptureHistoryEvent(s, transition('equilibrium', 'corrupted'), 14)).toBe(s);
    expect(withCaptureHistoryEvent(s, transition('none', 'adversarial'), 14)).toBe(s);
  });

  it('recordCaptureTransitionsIntoHistory writes through a local settlement map', () => {
    const map = new Map([['a', settlement()]]);
    const written = recordCaptureTransitionsIntoHistory(map, [transition('corrupted', 'capture')], 9);
    expect(written).toBe(1);
    expect(map.get('a').history.historicalEvents).toHaveLength(1);
  });
});

describe('advanceCampaignWorld — capture transition integration', () => {
  it('a fall to capture reaches the DM: one news entry and one history event', () => {
    // A corrupt faction leader in a criminal-institution town, faction
    // already at 'corrupted': the §corruption Phase 2 climb has only the
    // final rung left, so the capture transition lands within the loop.
    let saves = [{
      id: 'a',
      name: 'Greyford',
      phase: 'canon',
      settlement: {
        name: 'Greyford',
        tier: 'town',
        population: 1400,
        institutions: [
          { id: 'guild_a', name: "Thieves' Guild", category: 'criminal' },
          { id: 'market_a', name: 'Market square' },
        ],
        economicState: { prosperity: 'Poor', primaryExports: [], primaryImports: [] },
        powerStructure: {
          publicLegitimacy: { score: 30, label: 'Contested' },
          factions: [
            { faction: 'Merchant League', category: 'economy', power: 60, isGoverning: true },
            { faction: 'Temple Wardens', category: 'religious', power: 40 },
          ],
          conflicts: [],
        },
        npcs: [
          { id: 'boss', name: 'Boss Vane', importance: 'key', faction: 'Merchant League', corrupt: true, flaw: 'greedy' },
        ],
        activeConditions: [],
        history: { historicalEvents: [] },
      },
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    }];
    let campaign = {
      id: 'capture-news',
      name: 'Capture Region',
      settlementIds: ['a'],
      worldState: {
        rngSeed: 'capture-news-seed',
        tick: 0,
        stressors: [],
        factionStates: {
          'a:merchant_league': {
            factionId: 'a:merchant_league',
            settlementId: 'a',
            name: 'Merchant League',
            archetype: 'merchant',
            governmentPreference: 'merchant_charter',
            powerBases: ['wealth', 'trade_connectivity', 'debt'],
            lawPreferences: ['contract_priority', 'tariff_control', 'debt_enforcement'],
            internalSeats: { leader_champion: null, lieutenant_operator: null, agent_protege: null },
            legitimacyClaim: 0.3,
            riskTolerance: 0.4,
            momentum: 0,
            exhaustion: 0,
            captureState: 'corrupted',
            rivals: [],
            controlledInstitutions: [],
            suppressedInstitutions: [],
            lastActedTick: null,
            recentAction: null,
          },
        },
      },
      regionalGraph: ensureRegionalGraph({ channels: [] }),
      wizardNews: { currentTick: 0, entries: [] },
    };

    let captureTick = null;
    for (let i = 0; i < 40 && captureTick == null; i++) {
      const result = advanceCampaignWorld({
        campaign,
        saves,
        interval: 'one_month',
        now: `2026-06-01T00:00:${String(i).padStart(2, '0')}.000Z`,
      });
      const fell = (result.pulseRecord.factionCaptureEvents || [])
        .find(t => t.to === 'capture' && t.name === 'Merchant League');
      if (fell) {
        captureTick = result.worldState.tick;
        // Exactly ONE news entry for the fall, major and factual.
        const captureEntries = (result.wizardNews.entries || [])
          .filter(e => e.impactKind === 'faction_capture' && e.tick === captureTick && /falls under criminal control/.test(e.headline));
        expect(captureEntries).toHaveLength(1);
        expect(captureEntries[0].significance).toBe('major');
        expect(captureEntries[0].headline).toContain('Merchant League of Greyford');
        // Exactly ONE permanent history event stamped on the settlement.
        const update = result.settlementUpdates.find(u => String(u.saveId) === 'a');
        const events = (update.settlement.history?.historicalEvents || [])
          .filter(e => e.campaignEventId === `campaign.faction_capture.a:merchant_league.${captureTick}`);
        expect(events).toHaveLength(1);
        expect(events[0].name).toBe('The Capture of Merchant League');
        // ...and the projected roster agrees with the live rung.
        const merchant = update.settlement.powerStructure.factions.find(f => f.faction === 'Merchant League');
        expect(merchant.captureState).toBe('capture');
      }
      campaign = {
        ...campaign,
        worldState: result.worldState,
        regionalGraph: result.regionalGraph,
        wizardNews: result.wizardNews,
      };
      saves = saves.map(s => {
        const update = result.settlementUpdates.find(u => String(u.saveId) === String(s.id));
        return update ? { ...s, settlement: update.settlement } : s;
      });
    }
    expect(captureTick).not.toBeNull();
  });
});
