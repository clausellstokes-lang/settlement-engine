import { describe, expect, test } from 'vitest';

import { heraldSectionOfRecord } from '../../src/domain/realm/heraldRouting.js';
import {
  ensureWizardNewsFeed,
  projectWizardNewsForAudience,
} from '../../src/domain/region/wizardNews.js';
import { WAR_RULING_KINDS } from '../../src/domain/worldPulse/eventProse.js';
import {
  warRulingNewsEntries,
  warRulingNewsEntry,
} from '../../src/domain/worldPulse/warRulingsNews.js';

const NOW = '2026-01-01T00:00:00.000Z';

function item(id, name, { npcs = [], factions = [] } = {}) {
  return {
    id,
    name,
    settlement: {
      name,
      npcs,
      powerStructure: { factions },
    },
  };
}

function snapshot() {
  const rows = [
    item('ashford', 'Ashford', {
      npcs: [{ id: 'aldric', name: 'Aldric Venn' }],
      factions: [{ id: 'rowan', faction: 'House Rowan', isGoverning: true }],
    }),
    item('eastvale', 'Eastvale'),
    item('greywatch', 'Greywatch'),
    item('gloam', 'Gloamhold'),
  ];
  return { settlements: rows, byId: new Map(rows.map((row) => [row.id, row])) };
}

function evidence(kind) {
  const row = {
    kind,
    id: `source.${kind}`,
    tick: 12,
    settlementId: 'ashford',
    counterpartId: 'eastvale',
    npcId: 'ashford:aldric',
    factionId: 'ashford:rowan',
    thirdPartyId: 'greywatch',
    allyId: 'greywatch',
    reason: 'the target court chose to hold the field',
    routeName: 'the Eastvale road',
    rulerSecurityBand: 'precarious',
    // Deliberately present on every source. Public projections must ignore it.
    patronId: 'gloam',
    patronName: 'Gloamhold',
  };
  if (kind === 'sued_for_peace_seat') row.interestServed = 'seat';
  if (kind === 'sued_for_peace_realm') row.interestServed = 'realm';
  if (kind === 'ruler_books_compromised') row.booksInterest = 'patron';
  return row;
}

describe('WR-5 war-rulings news projection', () => {
  test('all fourteen explicit evidence kinds project with governed addresses and desks', () => {
    const entries = warRulingNewsEntries({
      evidence: WAR_RULING_KINDS.map(evidence),
      snapshot: snapshot(),
      now: NOW,
    });
    expect(entries).toHaveLength(14);
    expect(new Set(entries.map((entry) => entry.kind))).toEqual(new Set(WAR_RULING_KINDS));

    for (const entry of entries) {
      expect(entry).toMatchObject({
        createdAt: NOW,
        tick: 12,
        scope: 'regional',
        familyId: expect.stringMatching(new RegExp(`^${entry.kind}\\.`)),
        sectionAuthority: 'war_rulings_registry',
        settlementIds: expect.arrayContaining(['ashford']),
        settlementNames: expect.arrayContaining(['Ashford']),
      });
      expect(heraldSectionOfRecord(entry)).toBe(entry.section);
      const prose = [entry.headline, entry.summary, ...entry.reasons].join(' ');
      expect(prose).not.toMatch(/\d|%|×|_|\b(?:rng|roll|score|ratio|tick|chance)\b/i);
      expect(prose).not.toMatch(/\bundefined\b|\bNaN\b|\{[^}]*\}/);
    }
  });

  test('the compromised-books receipt is private and patron identity cannot enter public rows', () => {
    const entries = warRulingNewsEntries({
      evidence: WAR_RULING_KINDS.map(evidence),
      snapshot: snapshot(),
      now: NOW,
    });
    const privateEntry = entries.find((entry) => entry.kind === 'ruler_books_compromised');
    expect(privateEntry).toMatchObject({
      audience: 'dm-only',
      covert: true,
      section: 'adjudication',
      factionIds: ['gloam'],
    });

    const publicEntries = entries.filter((entry) => entry.audience === 'public');
    expect(JSON.stringify(publicEntries)).not.toContain('Gloamhold');
    expect(JSON.stringify(publicEntries)).not.toContain('gloam');

    const feed = ensureWizardNewsFeed({ entries }, { now: NOW });
    expect(projectWizardNewsForAudience(feed, 'dm')).toBe(feed);
    const player = projectWizardNewsForAudience(feed, 'player');
    expect(player.entries).toHaveLength(13);
    expect(player.entries.some((entry) => entry.kind === 'ruler_books_compromised')).toBe(false);
  });

  test('missing evidence, names, or typed identities fail closed instead of fabricating prose', () => {
    const complete = evidence('peace_refused');
    expect(warRulingNewsEntry({ evidence: { ...complete, id: '' }, snapshot: snapshot() })).toBeNull();
    expect(warRulingNewsEntry({
      evidence: { ...complete, settlementId: 'unknown', settlementName: '' },
      snapshot: snapshot(),
    })).toBeNull();
    expect(warRulingNewsEntry({
      evidence: { ...evidence('successor_repudiates_war'), npcId: '', rulerId: '', npcName: '' },
      snapshot: snapshot(),
    })).toBeNull();
    expect(warRulingNewsEntry({
      evidence: { ...evidence('ruler_books_compromised'), booksInterest: 'seat' },
      snapshot: snapshot(),
    })).toBeNull();
    expect(warRulingNewsEntry({
      evidence: { ...evidence('sued_for_peace_seat'), interestServed: 'realm' },
      snapshot: snapshot(),
    })).toBeNull();
    expect(warRulingNewsEntry({
      evidence: { ...complete, settlementName: 'ashford_01', settlementId: 'missing' },
    })).toBeNull();
  });

  test('typed receipt-authored names work without a snapshot, but unpaired names do not', () => {
    const entry = warRulingNewsEntry({
      evidence: {
        kind: 'peace_refused',
        id: 'offer.receipt',
        tick: 4,
        settlementId: 'court-a',
        settlementName: 'Ashford',
        counterpartId: 'court-b',
        counterpartName: 'Eastvale',
      },
      now: NOW,
    });
    expect(entry).toMatchObject({
      headline: "Ashford refuses Eastvale's peace",
      settlementIds: ['court-a', 'court-b'],
      settlementNames: ['Ashford', 'Eastvale'],
    });
    expect(warRulingNewsEntry({
      evidence: {
        kind: 'peace_refused', id: 'offer.receipt', tick: 4,
        settlementName: 'Ashford', counterpartName: 'Eastvale',
      },
    })).toBeNull();
  });

  test('the existing termination, peace-decision, and seat-transition shapes project directly', () => {
    const snap = snapshot();
    const termination = warRulingNewsEntry({
      evidence: {
        kind: 'sued_for_peace_seat',
        receipt: {
          id: 'war-termination.ashford.eastvale',
          tick: 8,
          attackerId: 'ashford',
          targetId: 'eastvale',
          rulerId: 'ashford:aldric',
          booksInterest: 'seat',
          booksPublicReason: "Aldric Venn's own account changes how Ashford weighs the war.",
        },
      },
      snapshot: snap,
      now: NOW,
    });
    expect(termination).toMatchObject({
      kind: 'sued_for_peace_seat',
      settlementIds: ['ashford', 'eastvale'],
      npcIds: ['ashford:aldric'],
    });

    const decision = warRulingNewsEntry({
      evidence: {
        kind: 'peace_refused',
        receipt: {
          id: 'war-peace-decision.eastvale.ashford',
          tick: 9,
          offererId: 'eastvale',
          targetId: 'ashford',
          reason: 'The target court chose to keep the war open.',
        },
      },
      snapshot: snap,
      now: NOW,
    });
    expect(decision).toMatchObject({
      kind: 'peace_refused',
      settlementIds: ['ashford', 'eastvale'],
      headline: "Ashford refuses Eastvale's peace",
    });

    const transition = warRulingNewsEntry({
      evidence: {
        kind: 'succession_demand_inherited',
        id: 'seat-transition.ashford',
        tick: 10,
        toRulerId: 'ashford:aldric',
        installerFactionId: 'fac.peace',
        installerFactionName: 'Peace League',
        warDemand: {
          actorId: 'ashford',
          targetId: 'eastvale',
          decisionId: 'peace-choice',
          desiredAction: 'peace',
        },
      },
      snapshot: snap,
      now: NOW,
    });
    expect(transition).toMatchObject({
      kind: 'succession_demand_inherited',
      settlementIds: ['ashford', 'eastvale'],
      npcIds: ['ashford:aldric'],
      factionIds: ['fac.peace'],
    });
  });
});
