import { describe, expect, it } from 'vitest';

import { warCostTransitionNewsEntries } from '../../src/domain/worldPulse/warCostsNews.js';

const NOW = '2026-08-02T12:00:00.000Z';

function settlement(id, name) {
  return { id, name, settlement: { name } };
}

function snapshot() {
  const rows = [
    settlement('attacker', 'Alderwatch'),
    settlement('target', 'Brackenford'),
    settlement('market-partner', 'Copperhaven'),
  ];
  return { byId: new Map(rows.map((row) => [row.id, row])) };
}

function components(band = 'quiet') {
  return {
    roads: { band, stateRead: 'route_network_grade' },
    stores: { band, stateRead: 'food_stockpile_reserve' },
    hands: { band, stateRead: 'deployed_population' },
    institutions: { band, stateRead: 'institution_shell_status' },
    markets: { band, stateRead: 'trade_war_flip' },
  };
}

function receipt(patch = {}) {
  return {
    attackerId: 'attacker',
    targetId: 'target',
    tick: 17,
    trajectory: 'even',
    trajectoryMarginBand: 'narrow',
    trajectoryMisread: false,
    homeFrontBand: 'quiet',
    homeFrontComponents: components(),
    ...patch,
  };
}

function readerText(entry) {
  return [entry.headline, entry.summary, ...(entry.reasons || [])].join(' ');
}

function byKind(entries, kind) {
  const entry = entries.find((candidate) => candidate.impactKind === kind);
  expect(entry, `missing ${kind}`).toBeTruthy();
  return entry;
}

describe('WR-4 war-cost transition news', () => {
  it('emits every newly-reachable winning and home-front kind with governed reader metadata', () => {
    const previous = receipt();
    const current = receipt({
      tick: 18,
      trajectory: 'winning',
      trajectoryMarginBand: 'clear',
      truthTrajectory: 'winning',
      trajectoryMisread: false,
      homeFrontBand: 'pressing',
      homeFrontComponents: {
        roads: {
          band: 'present', stateRead: 'route_network_grade', route: 'North Causeway',
        },
        stores: {
          band: 'pressing', stateRead: 'food_stockpile_reserve', good: 'winter wheat',
        },
        hands: {
          band: 'decisive', stateRead: 'deployed_population', npc: 'Mara Smith',
        },
        institutions: {
          band: 'present', stateRead: 'institution_shell_status', temple: 'Temple of Dawn',
        },
        markets: {
          band: 'pressing', stateRead: 'trade_war_flip', good: 'dyed wool',
          house: 'House Rowan', counterpartId: 'market-partner',
        },
      },
    });
    const before = structuredClone(current);
    const input = { current, previous, snapshot: snapshot(), now: NOW };
    const entries = warCostTransitionNewsEntries(input);

    expect(warCostTransitionNewsEntries(input)).toEqual(entries);
    expect(current).toEqual(before);
    expect(entries.map((entry) => entry.impactKind)).toEqual([
      'war_trajectory_winning',
      'home_front_roads',
      'home_front_stores',
      'home_front_hands',
      'home_front_institutions',
      'home_front_markets',
      'winning_abroad_losing_at_home',
    ]);

    const expected = {
      war_trajectory_winning: {
        section: 'war', headline: 'Alderwatch believes the war against Brackenford is turning its way',
        reason: "The court's latest reading has changed how it weighs peace now against peace later.",
      },
      home_front_roads: {
        section: 'trade', headline: "Wartime strain deepens on Alderwatch's roads",
        reason: 'The recorded road condition has worsened while the deployment remains active.',
      },
      home_front_stores: {
        section: 'events', headline: "Wartime strain deepens in Alderwatch's stores",
        reason: 'The recorded reserve condition has entered more serious wartime strain.',
      },
      home_front_hands: {
        section: 'events', headline: 'The muster weighs more heavily on Alderwatch',
        reason: 'The recorded burden on working hands has entered more serious wartime strain.',
      },
      home_front_institutions: {
        section: 'events', headline: "Alderwatch's institutions thin under wartime demands",
        reason: 'The recorded institutional condition has worsened while the deployment remains active.',
      },
      home_front_markets: {
        section: 'trade', headline: "Alderwatch's wartime markets lose more ground",
        reason: 'The recorded market condition has worsened while the deployment remains active.',
      },
      winning_abroad_losing_at_home: {
        section: 'war', headline: 'Alderwatch gains against Brackenford while its home front frays',
        reason: 'Real gains in the war now coincide with serious strain behind the lines.',
      },
    };

    for (const entry of entries) {
      expect(entry).toMatchObject({
        tick: 18,
        createdAt: NOW,
        scope: 'regional',
        kind: entry.impactKind,
        audience: 'public',
        section: expected[entry.impactKind].section,
        headline: expected[entry.impactKind].headline,
        reasons: [expected[entry.impactKind].reason],
      });
      expect(entry.settlementIds.slice(0, 2)).toEqual(['attacker', 'target']);
      expect(entry.settlementNames.slice(0, 2)).toEqual(['Alderwatch', 'Brackenford']);
      expect(entry.id).toMatch(new RegExp(`^wizard_news\\.18\\.${entry.kind}\\.`));
      expect(entry.sourceEventId).toMatch(new RegExp(`^war_cost_transition\\.${entry.kind}\\.`));
      expect(entry.familyId).toMatch(new RegExp(`^${entry.kind}\\.[1-5]$`));
      expect(entry.reasons).toHaveLength(1);
      expect(readerText(entry)).not.toMatch(
        /\d|%|\u00d7|\b(?:quiet|present|pressing|decisive|narrow|clear)\b|(?:route_network|food_stockpile|deployed_population|institution_shell|trade_war)|undefined/i,
      );
    }

    const market = byKind(entries, 'home_front_markets');
    expect(market.settlementIds).toEqual(['attacker', 'target', 'market-partner']);
    expect(market.settlementNames).toEqual(['Alderwatch', 'Brackenford', 'Copperhaven']);
    const combined = byKind(entries, 'winning_abroad_losing_at_home');
    expect(combined.significance).toBe('major');
    expect(combined.covert).toBeUndefined();
  });

  it('emits only directional onset and upward crossings, never held or recovering states', () => {
    const held = receipt({
      trajectory: 'winning',
      trajectoryMarginBand: 'narrow',
      trajectoryMisread: true,
      homeFrontBand: 'pressing',
      homeFrontComponents: {
        ...components('quiet'),
        roads: { band: 'pressing', stateRead: 'route_network_grade' },
      },
    });
    expect(warCostTransitionNewsEntries({
      current: { ...held, tick: 18, trajectoryMarginBand: 'clear' },
      previous: held,
      snapshot: snapshot(),
    })).toEqual([]);

    const selectivePrevious = receipt({
      trajectory: 'winning',
      trajectoryMarginBand: 'narrow',
      trajectoryMisread: true,
      homeFrontBand: 'present',
      homeFrontComponents: {
        ...components('quiet'),
        roads: { band: 'present', stateRead: 'route_network_grade' },
      },
    });
    const selectiveCurrent = receipt({
      tick: 18,
      trajectory: 'losing',
      trajectoryMarginBand: 'clear',
      trajectoryMisread: true,
      homeFrontBand: 'pressing',
      homeFrontComponents: {
        ...components('quiet'),
        roads: { band: 'pressing', stateRead: 'route_network_grade' },
      },
    });
    const selective = warCostTransitionNewsEntries({
      current: selectiveCurrent, previous: selectivePrevious, snapshot: snapshot(),
    });
    expect(selective.map((entry) => entry.impactKind)).toEqual([
      'war_trajectory_losing',
      'home_front_roads',
    ]);
    expect(byKind(selective, 'war_trajectory_losing')).toMatchObject({
      headline: 'Alderwatch believes the war against Brackenford is turning against it',
      section: 'war', audience: 'public',
      reasons: ["The court's latest reading has changed how it weighs peace now against peace later."],
    });

    const recovering = receipt({
      tick: 18,
      trajectory: 'even',
      homeFrontBand: 'present',
      homeFrontComponents: {
        ...components('quiet'),
        roads: { band: 'present', stateRead: 'route_network_grade' },
      },
    });
    expect(warCostTransitionNewsEntries({
      current: recovering, previous: selectiveCurrent, snapshot: snapshot(),
    })).toEqual([]);
  });

  it('emits combined strain and a private misread only when each condition first becomes true', () => {
    const homeQuiet = receipt({
      trajectory: 'winning',
      trajectoryMarginBand: 'clear',
      truthTrajectory: 'winning',
      homeFrontBand: 'present',
      homeFrontComponents: {
        ...components('quiet'),
        stores: { band: 'present', stateRead: 'food_stockpile_reserve' },
      },
    });
    const homePressing = receipt({
      ...homeQuiet,
      tick: 18,
      homeFrontBand: 'pressing',
      homeFrontComponents: homeQuiet.homeFrontComponents,
    });
    const combined = warCostTransitionNewsEntries({
      current: homePressing, previous: homeQuiet, snapshot: snapshot(),
    });
    expect(combined.map((entry) => entry.impactKind)).toEqual(['winning_abroad_losing_at_home']);

    const believedWinning = receipt({
      trajectory: 'winning',
      trajectoryMarginBand: 'clear',
      truthTrajectory: 'winning',
      homeFrontBand: 'present',
    });
    const misreadCurrent = receipt({
      tick: 18,
      trajectory: 'winning',
      trajectoryMarginBand: 'clear',
      truthTrajectory: 'losing',
      trajectoryMisread: true,
      homeFrontBand: 'pressing',
    });
    const misread = warCostTransitionNewsEntries({
      current: misreadCurrent,
      previous: believedWinning,
      snapshot: snapshot(),
    });
    expect(misread.map((entry) => entry.impactKind)).toEqual(['trajectory_misread']);
    expect(misread[0]).toMatchObject({ audience: 'dm-only', covert: true, section: 'war' });
    expect(warCostTransitionNewsEntries({
      current: { ...misreadCurrent, tick: 19 },
      previous: misreadCurrent,
      snapshot: snapshot(),
    })).toEqual([]);
  });

  it('requires source evidence and authored names while refusing optional id-shaped prose', () => {
    const bareMarket = receipt({
      tick: 18,
      homeFrontBand: 'present',
      homeFrontComponents: {
        ...components('quiet'),
        markets: {
          band: 'present',
          stateRead: 'trade_war_flip',
          good: 'good_17',
          house: 'house_9',
          counterpartId: 'missing-partner',
        },
      },
    });
    const [entry] = warCostTransitionNewsEntries({
      current: bareMarket, previous: receipt(), snapshot: snapshot(),
    });
    expect(entry).toMatchObject({
      impactKind: 'home_front_markets',
      settlementIds: ['attacker', 'target'],
      settlementNames: ['Alderwatch', 'Brackenford'],
    });
    expect(readerText(entry)).not.toMatch(/good_17|house_9|missing-partner|undefined|\d/);

    const noEvidence = structuredClone(bareMarket);
    delete noEvidence.homeFrontComponents.markets.stateRead;
    expect(warCostTransitionNewsEntries({
      current: noEvidence, previous: receipt(), snapshot: snapshot(),
    })).toEqual([]);

    const idFallbackSnapshot = snapshot();
    idFallbackSnapshot.byId.set('target', { id: 'target', name: 'target' });
    expect(warCostTransitionNewsEntries({
      current: bareMarket, previous: receipt(), snapshot: idFallbackSnapshot,
    })).toEqual([]);
  });
});
