import { describe, expect, test } from 'vitest';

import { heraldSectionOfRecord } from '../../src/domain/realm/heraldRouting.js';
import {
  ensureWizardNewsFeed,
  projectWizardNewsForAudience,
} from '../../src/domain/region/wizardNews.js';
import { WAR_COALITION_KINDS } from '../../src/domain/worldPulse/eventProse.js';
import { coalitionDecisionEvidence } from '../../src/domain/worldPulse/warCoalitionDecision.js';
import { planCoalitionSettlement } from '../../src/domain/worldPulse/warCoalitionSettlement.js';
import {
  warCoalitionNewsEntries,
  warCoalitionNewsEntry,
} from '../../src/domain/worldPulse/warCoalitionNews.js';

const NOW = '2026-01-01T00:00:00.000Z';

function snapshot() {
  const settlements = [
    { id: 'ashford', name: 'Ashford', settlement: { name: 'Ashford' } },
    { id: 'eastvale', name: 'Eastvale', settlement: { name: 'Eastvale' } },
    { id: 'greywatch', name: 'Greywatch', settlement: { name: 'Greywatch' } },
  ];
  return { settlements, byId: new Map(settlements.map((row) => [row.id, row])) };
}

function evidence(kind, patch = {}) {
  return {
    kind,
    id: `source.${kind}`,
    tick: 12,
    settlementId: 'ashford',
    counterpartId: 'eastvale',
    thirdPartyId: 'greywatch',
    band: 'pressing',
    routeId: 'route.eastvale',
    routeName: 'the Eastvale road',
    goodId: 'good.grain',
    goodName: 'grain',
    relationshipKey: 'relationship.private',
    callId: 'coalition.call.private',
    coalitionSettlementId: 'coalition.settlement.private',
    ...patch,
  };
}

describe('WR-6 coalition news projection', () => {
  test('the live decision composer joins directly on both answer arms', () => {
    const decision = {
      callId: 'coalition.call.ashford',
      partyId: 'ashford',
      callerId: 'eastvale',
      enemyId: 'greywatch',
      relationshipKey: 'relationship.alliance',
      riskBand: 'pressing',
    };
    const joined = warCoalitionNewsEntries({
      evidence: coalitionDecisionEvidence(decision, true, 7),
      snapshot: snapshot(),
    });
    expect(joined.map((entry) => entry.kind).sort()).toEqual([
      'casus_alliance_obligation',
      'coalition_entry_priced',
      'coalition_joined',
    ]);
    expect(JSON.stringify(joined)).not.toContain(decision.callId);
    expect(JSON.stringify(joined)).not.toContain(decision.relationshipKey);

    const refused = warCoalitionNewsEntries({
      evidence: coalitionDecisionEvidence(decision, false, 7),
      snapshot: snapshot(),
    });
    expect(refused.map((entry) => entry.kind).sort()).toEqual([
      'coalition_entry_priced',
      'coalition_refused',
    ]);
  });

  test('the live settlement planner supplies pairwise names to apportionment and spoils', () => {
    const plan = planCoalitionSettlement({
      coalitionSettlementId: 'settlement.coalition',
      aggregateClaim01: 0.4,
      tick: 9,
      closures: [
        {
          coalitionSettlementId: 'settlement.coalition',
          closureId: 'closure.eastvale.ashford',
          relationshipKey: 'relationship.eastvale.ashford',
          winnerId: 'eastvale',
          loserId: 'ashford',
          capacity01: 0.6,
          culpability01: 0.7,
          fieldLoss01: 0.5,
          callerId: 'ashford',
          bled01: 0.8,
          led01: 0.7,
          late01: 0.1,
          goodId: 'good.grain',
          goodName: 'grain',
        },
        {
          coalitionSettlementId: 'settlement.coalition',
          closureId: 'closure.greywatch.ashford',
          relationshipKey: 'relationship.greywatch.ashford',
          winnerId: 'greywatch',
          loserId: 'ashford',
          capacity01: 0.6,
          culpability01: 0.7,
          fieldLoss01: 0.5,
          callerId: 'ashford',
          bled01: 0.4,
          led01: 0.2,
          late01: 0.6,
          goodId: 'good.grain',
          goodName: 'grain',
        },
      ],
    });
    expect(plan).toBeTruthy();
    const entries = warCoalitionNewsEntries({
      evidence: plan.coalitionEvidence,
      snapshot: snapshot(),
    });
    expect(entries.map((entry) => entry.kind).sort()).toEqual([
      'coalition_apportionment',
      'coalition_spoils_divided',
      'coalition_spoils_divided',
    ]);
    for (const entry of entries) {
      expect(entry.settlementIds).toHaveLength(2);
      expect(entry.settlementNames).toHaveLength(2);
    }
  });

  test('all twelve facts project with governed addresses, desks, and scalar-free prose', () => {
    const entries = warCoalitionNewsEntries({
      evidence: WAR_COALITION_KINDS.map((kind) => evidence(kind)),
      snapshot: snapshot(),
      now: NOW,
    });
    expect(entries).toHaveLength(12);
    expect(new Set(entries.map((entry) => entry.kind))).toEqual(new Set(WAR_COALITION_KINDS));
    expect(entries.find((entry) => entry.kind === 'coalition_expenditure_read')?.headline)
      .toBe('Ashford reckons the cost of answering Eastvale');

    for (const entry of entries) {
      expect(entry).toMatchObject({
        createdAt: NOW,
        tick: 12,
        scope: 'regional',
        audience: 'public',
        familyId: expect.stringMatching(new RegExp(`^${entry.kind}\\.`)),
        sectionAuthority: 'war_coalition_registry',
        sourceEventId: expect.stringMatching(new RegExp(`^coalition_receipt\\.${entry.kind}\\.[a-f0-9]+$`)),
        settlementIds: expect.arrayContaining(['ashford', 'eastvale']),
        settlementNames: expect.arrayContaining(['Ashford', 'Eastvale']),
      });
      expect(heraldSectionOfRecord(entry)).toBe(entry.section);
      const prose = [entry.headline, entry.summary, ...entry.reasons].join(' ');
      expect(prose).not.toMatch(/\d|%|×|_|\b(?:rng|score|ratio|tick|chance|candidate|probability|odds|threshold|coefficient|multiplier|percent(?:age)?|per\s+cent|state\s*read)\b/i);
      expect(prose).not.toMatch(/\bundefined\b|\bNaN\b|\{[^}]*\}/);
      expect(entry).not.toHaveProperty('relationshipKey');
      expect(entry).not.toHaveProperty('callId');
      expect(entry).not.toHaveProperty('coalitionSettlementId');
    }

    const feed = ensureWizardNewsFeed({ entries }, { now: NOW });
    expect(projectWizardNewsForAudience(feed, 'player').entries).toHaveLength(12);
  });

  test('adjudication is authorized by the coalition registry, not WR-5 impersonation', () => {
    const separate = warCoalitionNewsEntry({
      evidence: evidence('coalition_separate_peace'),
      snapshot: snapshot(),
    });
    const apportioned = warCoalitionNewsEntry({
      evidence: evidence('coalition_apportionment'),
      snapshot: snapshot(),
    });
    expect(separate).toMatchObject({
      section: 'adjudication',
      sectionAuthority: 'war_coalition_registry',
      channelType: 'political_authority',
    });
    expect(apportioned).toMatchObject({
      section: 'adjudication',
      sectionAuthority: 'war_coalition_registry',
      channelType: 'political_authority',
    });
  });

  test('unknown bands and unpaired route/good labels fall to authored slotless families', () => {
    const rows = [
      evidence('coalition_entry_priced', { id: 'numeric.risk', band: '0.62' }),
      evidence('coalition_expenditure_read', { id: 'numeric.cost', band: '62%' }),
      evidence('coalition_apportionment', {
        id: 'unpaired.good', band: '9.4', goodId: '', goodName: 'grain',
      }),
      evidence('coalition_debt_unpaid', {
        id: 'unpaired.route', routeId: '', routeName: 'route_01',
      }),
    ];
    const entries = warCoalitionNewsEntries({ evidence: rows, snapshot: snapshot() });
    expect(entries).toHaveLength(rows.length);
    for (const entry of entries) {
      const prose = [entry.headline, entry.summary, ...entry.reasons].join(' ');
      expect(prose).not.toMatch(/\d|%|×|_|\b(?:score|ratio|chance)\b/i);
    }
  });

  test('missing typed identities or names fail closed instead of fabricating prose', () => {
    expect(warCoalitionNewsEntry({
      evidence: evidence('coalition_joined', { id: '' }),
      snapshot: snapshot(),
    })).toBeNull();
    expect(warCoalitionNewsEntry({
      evidence: evidence('coalition_joined', { settlementId: 'missing', settlementName: '' }),
      snapshot: snapshot(),
    })).toBeNull();
    expect(warCoalitionNewsEntry({
      evidence: evidence('coalition_joined', { thirdPartyId: 'missing', thirdPartyName: '' }),
      snapshot: snapshot(),
    })).toBeNull();
  });

  test('receipt-paired names work without a snapshot, but unpaired names do not', () => {
    const paired = warCoalitionNewsEntry({
      evidence: evidence('coalition_refused', {
        settlementId: 'court-a', settlementName: 'Ashford',
        counterpartId: 'court-b', counterpartName: 'Eastvale',
        thirdPartyId: 'court-c', thirdPartyName: 'Greywatch',
      }),
    });
    expect(paired).toMatchObject({
      headline: "Ashford refuses Eastvale's call against Greywatch",
      settlementIds: ['court-a', 'court-b', 'court-c'],
      settlementNames: ['Ashford', 'Eastvale', 'Greywatch'],
    });
    expect(warCoalitionNewsEntry({
      evidence: evidence('coalition_refused', {
        settlementId: '', settlementName: 'Ashford',
      }),
    })).toBeNull();
  });
});
