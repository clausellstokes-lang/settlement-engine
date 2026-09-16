import { describe, expect, it } from 'vitest';

import { dispositionTransitionNewsEntries } from '../../src/domain/worldPulse/dispositionNews.js';
import {
  advanceDispositionChannels,
  coalesceDispositionTransitions,
  migrateDispositionStats,
} from '../../src/domain/worldPulse/dispositionLedger.js';

const NOW = '2026-01-01T00:00:00.000Z';

function item(id, name, patch = {}) {
  return {
    id,
    name,
    settlement: {
      name,
      config: patch.domain ? { primaryDeitySnapshot: { name: patch.deity || 'The Patron', domain: patch.domain } } : {},
      institutions: patch.institutions || [],
      economicState: { primaryExports: patch.exports || [] },
      powerStructure: {
        governingName: patch.house,
        factions: patch.house ? [{ faction: patch.house, isGoverning: true }] : [],
      },
    },
  };
}

function transition(id, channel, kind = 'band_crossing', patch = {}) {
  const direction = patch.direction === 'down' ? 'down' : 'up';
  return {
    kind,
    id,
    channel,
    fromBand: direction === 'up' ? 'settled' : 'marked',
    toBand: direction === 'up' ? 'marked' : 'settled',
    fromStock01: direction === 'up' ? 0.59 : 0.61,
    toStock01: direction === 'up' ? 0.61 : 0.59,
    direction,
    source: 'outcome',
    sourceKinds: ['resolved_outcome'],
    sourceEventIds: [`source.${id}.${channel}.${direction}`],
    outcomeKinds: [direction === 'up' ? 'win' : 'loss'],
    tick: 12,
    ...patch,
  };
}

describe('WR-2 disposition transition news', () => {
  const items = [
    item('march', 'Marchwall', { domain: 'war', deity: 'The Spear', institutions: [{ name: 'Temple of the Spear' }] }),
    item('market', 'Marketmere', { exports: [{ label: 'Dyed wool' }] }),
    item('parley', 'Parleyford'),
    item('inward', 'Inward Keep', { house: 'The Gatewardens' }),
    item('turn', 'Turnwater'),
    item('harvest', 'Harveston', { domain: 'harvest', deity: 'The Sower', institutions: [{ name: 'Harvest Chapel' }] }),
    item('quiet', 'Quietfield', { domain: 'harvest', deity: 'The Sower', institutions: [{ name: 'Rain Shrine' }] }),
  ];
  const snapshot = { byId: new Map(items.map((row) => [row.id, row])) };
  const stats = migrateDispositionStats({
    march: { wins: 5, losses: 1, score: 4 },
    market: { wins: 0, losses: 0, score: 0 },
    parley: { wins: 0, losses: 0, score: 0 },
    inward: { wins: 0, losses: 0, score: 0 },
    turn: { wins: 2, losses: 2, score: 0 },
    harvest: { wins: 2, losses: 1, score: 1 },
    quiet: { wins: 1, losses: 6, score: -5 },
  }, 12);
  const transitions = [
    transition('march', 'martial'),
    transition('market', 'mercantile'),
    transition('parley', 'diplomatic'),
    transition('inward', 'insular'),
    transition('turn', 'martial', 'reversal'),
    transition('harvest', 'martial'),
    transition('quiet', 'martial'),
  ];

  it('makes all eight governed kinds reachable with stable family and full address metadata', () => {
    const input = { transitions, snapshot, worldState: { dispositionStats: stats }, now: NOW };
    const entries = dispositionTransitionNewsEntries(input);
    expect(dispositionTransitionNewsEntries(input)).toEqual(entries);
    expect([...new Set(entries.map((entry) => entry.impactKind))].sort()).toEqual([
      'deity_peace_pressure',
      'deity_war_pressure',
      'disposition_diplomatic_crossed',
      'disposition_insular_crossed',
      'disposition_martial_crossed',
      'disposition_mercantile_crossed',
      'disposition_reversal',
      'war_culture_suppressed',
    ]);
    for (const entry of entries) {
      expect(entry.id).toMatch(/^wizard_news\./);
      expect(entry.kind).toBe(entry.impactKind);
      expect(entry.familyId).toMatch(new RegExp(`^${entry.kind}\\.[1-5]$`));
      expect(entry.settlementIds).toHaveLength(1);
      expect(entry.settlementNames).toHaveLength(1);
      expect(entry.headline).toContain(entry.settlementNames[0]);
      expect(entry.reasons[0]).toBeTruthy();
      expect(entry.scope).toBe('settlement');
      expect(`${entry.headline} ${entry.summary} ${entry.reasons.join(' ')}`)
        .not.toMatch(/\b(?:restrained|measured|settled|marked|dominant)\b|\d|%/i);
    }
    expect(entries.find((entry) => entry.kind === 'war_culture_suppressed')?.covert).toBe(true);
    expect(entries.filter((entry) => entry.kind !== 'war_culture_suppressed').every((entry) => entry.covert !== true)).toBe(true);
  });

  it('uses only truthful optional slots and falls back within the same authored pool', () => {
    const bare = item('bare', 'Bareford');
    const [entry] = dispositionTransitionNewsEntries({
      transitions: [transition('bare', 'mercantile')],
      snapshot: { byId: new Map([['bare', bare]]) },
      worldState: { dispositionStats: migrateDispositionStats({ bare: { wins: 0, losses: 0, score: 0 } }, 12) },
      now: NOW,
    });
    expect(entry.kind).toBe('disposition_mercantile_crossed');
    expect(entry.summary).not.toContain('undefined');
    expect(entry.summary).not.toContain('Bareford goods');
  });

  it('renders both directions truthfully for every channel and for non-martial reversals', () => {
    const channels = {
      martial: {
        up: /toward force|more weight|bolder/i,
        down: /away from force|less weight|more cautious/i,
      },
      mercantile: {
        up: /toward commerce|more weight|more eager/i,
        down: /away from commerce|less weight|more cautious/i,
      },
      diplomatic: {
        up: /toward parley|more weight|more willing/i,
        down: /away from parley|less weight|more guarded/i,
      },
      insular: {
        up: /toward its own walls|less weight|more guarded|more warily/i,
        down: /beyond its own walls|more weight|more open|more readily/i,
      },
    };
    const rows = [];
    const localItems = [];
    for (const channel of Object.keys(channels)) {
      for (const direction of ['up', 'down']) {
        const id = `${channel}-${direction}`;
        localItems.push(item(id, id));
        rows.push(transition(id, channel, 'band_crossing', { direction }));
      }
    }
    for (const direction of ['up', 'down']) {
      const id = `reversal-diplomatic-${direction}`;
      localItems.push(item(id, id));
      rows.push(transition(id, 'diplomatic', 'reversal', {
        direction,
        fromStock01: direction === 'up' ? 0.49 : 0.51,
        toStock01: direction === 'up' ? 0.51 : 0.49,
        fromBand: 'settled',
        toBand: 'settled',
      }));
    }
    const localSnapshot = { byId: new Map(localItems.map((row) => [row.id, row])) };
    const entries = dispositionTransitionNewsEntries({
      transitions: rows,
      snapshot: localSnapshot,
      worldState: { dispositionStats: {} },
      now: NOW,
    });
    expect(entries).toHaveLength(rows.length);
    for (const entry of entries) {
      const source = rows.find((row) => row.id === entry.settlementIds[0]);
      expect(entry.summary).toMatch(channels[source.channel][source.direction]);
      expect(entry.summary).not.toMatch(/\b(?:restrained|measured|settled|marked|dominant)\b|\d|%/i);
    }
  });

  it('ties each receipt to producer-supplied cause evidence instead of inventing a source id', () => {
    const advanced = advanceDispositionChannels({}, [{
      id: 'cause',
      channel: 'mercantile',
      outcome: 'win',
      magnitude: 2,
      sourceKind: 'trade_contest',
      sourceEventId: 'world_outcome.trade_realignment.prize.12',
    }], { enabled: true, tick: 12 });
    const causeItem = item('cause', 'Causeway');
    const entries = dispositionTransitionNewsEntries({
      transitions: advanced.transitions,
      snapshot: { byId: new Map([['cause', causeItem]]) },
      worldState: { dispositionStats: advanced.ledger },
      now: NOW,
    });
    const mercantile = entries.find((entry) => entry.kind === 'disposition_mercantile_crossed');
    expect(mercantile).toBeTruthy();
    expect(mercantile.sourceEventId).toBe('world_outcome.trade_realignment.prize.12');
    expect(mercantile.reasons).toContain(
      'A resolved supplier contest changed what this court expects commerce to accomplish.',
    );
  });

  it('coalesces a temporary same-tick crossing away before narration', () => {
    const netQuiet = coalesceDispositionTransitions([
      {
        ...transition('seat', 'insular'),
        fromBand: 'measured', toBand: 'settled',
        fromStock01: 0.395, toStock01: 0.4195,
        sourceKinds: ['war_resolution'],
      },
      {
        ...transition('seat', 'insular', 'band_crossing', { direction: 'down' }),
        fromBand: 'settled', toBand: 'measured',
        fromStock01: 0.4195, toStock01: 0.388,
        sourceKinds: ['treaty_held'],
      },
    ]);
    expect(netQuiet).toEqual([]);
  });

  it('never turns hunt rites into a war god or an arbitrary export into seed', () => {
    const many = Array.from({ length: 80 }, (_, index) => item(`hunt-${index}`, `Hunt ${index}`, {
      domain: 'hunt',
      deity: 'The Tracker',
      institutions: [{ name: 'Temple of the River' }],
      exports: [{ label: 'Dyed wool' }],
    }));
    const rows = many.flatMap((row, index) => [
      transition(row.id, 'martial', 'band_crossing', {
        sourceKinds: [index % 2 ? 'war_resolution' : 'occupation_outcome'],
      }),
    ]);
    const entries = dispositionTransitionNewsEntries({
      transitions: rows,
      snapshot: { byId: new Map(many.map((row) => [row.id, row])) },
      worldState: { dispositionStats: {} },
      now: NOW,
    });
    expect(new Set(entries
      .filter((entry) => entry.kind === 'disposition_martial_crossed')
      .map((entry) => entry.familyId)).size).toBe(5);
    const prose = entries.map((entry) => `${entry.headline} ${entry.summary} ${entry.reasons.join(' ')}`).join('\n');
    expect(prose).not.toMatch(/war god|bless(?:ed|es|ing)?|seed dyed wool|sow(?:n|ing)? dyed wool/i);
  });

  it('keeps opposite directions and causes collision-free', () => {
    const turn = item('collision', 'Collision Ford');
    const entries = dispositionTransitionNewsEntries({
      transitions: [
        transition('collision', 'martial', 'band_crossing', {
          direction: 'up', sourceKinds: ['war_resolution'], sourceEventIds: ['war.one'],
        }),
        transition('collision', 'martial', 'band_crossing', {
          direction: 'down', sourceKinds: ['occupation_outcome'], sourceEventIds: ['occupation.one'],
        }),
      ],
      snapshot: { byId: new Map([['collision', turn]]) },
      worldState: { dispositionStats: {} },
      now: NOW,
    });
    expect(entries).toHaveLength(2);
    expect(new Set(entries.map((entry) => entry.id)).size).toBe(2);
    expect(new Set(entries.map((entry) => entry.sourceEventId)))
      .toEqual(new Set(['war.one', 'occupation.one']));
  });
});
