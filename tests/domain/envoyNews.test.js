/** @vitest-environment node */
import { describe, expect, test } from 'vitest';

import { heraldSectionOfRecord } from '../../src/domain/realm/heraldRouting.js';
import {
  appendWizardNewsEntries,
  projectWizardNewsForAudience,
} from '../../src/domain/region/wizardNews.js';
import { ENVOY_EVIDENCE_KINDS } from '../../src/domain/worldPulse/envoyErrand.js';
import { envoyNewsEntries, envoyNewsEntry } from '../../src/domain/worldPulse/envoyNews.js';

const STATE_OF = Object.freeze({
  envoy_departed: 'travelling',
  envoy_on_the_road: 'travelling',
  envoy_returning: 'returning',
  envoy_home: 'home',
  envoy_lost: 'lost',
  envoy_silence_inference: 'travelling',
  terms_never_reached: 'lost',
  envoy_intercepted: 'intercepted',
  envoy_parlaying: 'parlaying',
  envoy_terms_agreed: 'returning',
  envoy_held: 'held',
  terms_signed_for_a_fallen_town: 'returning',
  parlay_at_an_occupied_venue: 'parlaying',
  interceptor_dilemma: 'intercepted',
  interceptor_parlays_own_edge: 'travelling',
  parlay_terms_neither_court_drafted: 'returning',
});

const LEGACY_KINDS = Object.freeze([
  'envoy_departed',
  'envoy_on_the_road',
  'envoy_returning',
  'envoy_home',
  'envoy_lost',
  'envoy_silence_inference',
  'terms_never_reached',
]);

const WR7B_KINDS = Object.freeze([
  'envoy_intercepted',
  'envoy_parlaying',
  'envoy_terms_agreed',
  'envoy_held',
  'terms_signed_for_a_fallen_town',
  'parlay_at_an_occupied_venue',
  'interceptor_dilemma',
  'interceptor_parlays_own_edge',
  'parlay_terms_neither_court_drafted',
]);

const DM_ONLY_KINDS = new Set(['envoy_lost', 'terms_never_reached', ...WR7B_KINDS]);

function snapshot() {
  return {
    byId: {
      ashford: { id: 'ashford', settlement: { name: 'Ashford' } },
      irontown: { id: 'irontown', settlement: { name: 'Irontown' } },
      westmere: { id: 'westmere', settlement: { name: 'Westmere' } },
      'occupied-hall': { id: 'occupied-hall', settlement: { name: 'Dunhall' } },
      'fallen-town': { id: 'fallen-town', settlement: { name: 'Lowbridge' } },
    },
    worldState: {
      spatialLedgers: {
        npcLedger: {
          roamers: {
            'npc-mara': { identityFacets: { name: 'Reeve Mara' } },
          },
        },
      },
    },
  };
}

function wr7bEvidence(kind, extra = {}) {
  const sharedEncounter = {
    encounterId: `encounter-${kind}`,
    thirdPartyId: 'westmere',
    thirdPartyName: 'Westmere',
    venueId: 'occupied-hall',
    venueName: 'Dunhall',
  };
  const byKind = {
    envoy_intercepted: sharedEncounter,
    envoy_parlaying: sharedEncounter,
    envoy_terms_agreed: {
      termSheetId: 'term-sheet-agreed',
      termName: 'road concession',
    },
    envoy_held: {
      ...sharedEncounter,
      reasonId: 'hold-cause-sealed-terms',
      reasonName: 'the sealed terms',
    },
    terms_signed_for_a_fallen_town: {
      venueId: 'fallen-town',
      venueName: 'Lowbridge',
      routeId: 'road-lowbridge',
      routeName: 'Lowbridge Road',
    },
    parlay_at_an_occupied_venue: sharedEncounter,
    interceptor_dilemma: sharedEncounter,
    interceptor_parlays_own_edge: {},
    parlay_terms_neither_court_drafted: {
      ...sharedEncounter,
      termSheetId: 'term-sheet-field',
      termName: 'field truce',
    },
  };
  return evidence(kind, { ...byKind[kind], ...extra });
}

function evidence(kind, extra = {}) {
  return {
    id: `envoy-evidence-${kind}`,
    kind,
    tick: 12,
    errandId: 'envoy-errand-private',
    npcId: 'npc-mara',
    settlementId: 'ashford',
    counterpartId: 'irontown',
    sourceOfferId: 'peace-offer-private',
    state: STATE_OF[kind],
    routeId: 'road-north',
    routeName: 'North Road',
    ...extra,
  };
}

function readerCopy(entry) {
  return [entry.headline, entry.summary, ...(entry.reasons || [])].join('\n');
}

describe('envoyNews — typed WR-7a evidence to governed reader records', () => {
  test('all seven legacy kinds retain governed metadata and scalar-free prose', () => {
    expect(ENVOY_EVIDENCE_KINDS.slice(0, 7)).toEqual(LEGACY_KINDS);
    for (const kind of LEGACY_KINDS) {
      const entry = envoyNewsEntry({ evidence: evidence(kind), snapshot: snapshot(), now: null });
      expect(entry).toBeTruthy();
      expect(entry).toMatchObject({
        kind,
        impactKind: kind,
        audience: DM_ONLY_KINDS.has(kind) ? 'dm-only' : 'public',
        sectionAuthority: 'envoy_registry',
        settlementIds: ['ashford', 'irontown'],
        settlementNames: ['Ashford', 'Irontown'],
        npcIds: ['npc-mara'],
      });
      expect(heraldSectionOfRecord(entry)).toBe(entry.section);
      expect(entry.familyId).toMatch(new RegExp(`^${kind}\\.\\d+$`));
      expect(entry.sourceEventId).toMatch(/^envoy_receipt\./);
      expect(entry.sourceEventId).not.toContain('private');
      const copy = readerCopy(entry);
      if (!['envoy_silence_inference', 'terms_never_reached'].includes(kind)) {
        expect(copy).toContain('Reeve Mara');
      }
      expect(copy).not.toMatch(/envoy-evidence|envoy-errand|peace-offer|npc-mara/);
      expect(copy).not.toContain('ashford');
      expect(copy).not.toContain('irontown');
      expect(copy).not.toMatch(/[\d%_×{}\u005b\u005d]/);
      expect(copy).not.toMatch(/\b(?:rng|roll|score|ratio|tick|chance|probability|threshold|multiplier)\b/i);
    }
  });

  test('all nine WR-7b kinds project only from complete typed addresses and remain DM-only', () => {
    expect(ENVOY_EVIDENCE_KINDS).toEqual([...LEGACY_KINDS, ...WR7B_KINDS]);
    for (const kind of WR7B_KINDS) {
      const entry = envoyNewsEntry({ evidence: wr7bEvidence(kind), snapshot: snapshot(), now: null });
      expect(entry).toBeTruthy();
      expect(entry).toMatchObject({
        kind,
        impactKind: kind,
        audience: 'dm-only',
        sectionAuthority: 'envoy_registry',
        npcIds: ['npc-mara'],
      });
      expect(heraldSectionOfRecord(entry)).toBe(entry.section);
      expect(entry.familyId).toMatch(new RegExp(`^${kind}\\.\\d+$`));
      const copy = readerCopy(entry);
      // LIVENESS ANCHOR for every exclusion below: the projection must actually have
      // produced prose from this evidence. Without it, a drifted producer emitting an
      // EMPTY headline/summary would satisfy all five negatives, and the "no raw id /
      // no scalar / no engine token" guarantees would go vacuously green forever.
      expect(entry.headline, `${kind} produced no headline`).toBeTruthy();
      expect(entry.summary, `${kind} produced no summary`).toBeTruthy();
      // anchored: `copy` is proven to be live prose by the two assertions above.
      expect(copy).not.toMatch(/envoy-evidence|envoy-errand|peace-offer|npc-mara|westmere|occupied-hall|fallen-town|term-sheet|hold-cause/);
      expect(copy).not.toContain('ashford'); // anchored: live prose proven above
      expect(copy).not.toContain('irontown'); // anchored: live prose proven above
      // anchored: `copy` is proven to be live prose by the headline/summary anchors above.
      expect(copy).not.toMatch(/[\d%_×{}\u005b\u005d]/);
      // anchored: `copy` is proven to be live prose by the headline/summary anchors above.
      expect(copy).not.toMatch(/\b(?:rng|roll|score|ratio|tick|chance|probability|threshold|multiplier|schema|json|stateRead|flag)\b/i);
    }
  });

  test('WR-7b incomplete and unpaired addresses fail closed instead of fabricating names', () => {
    const cases = [
      ['envoy_intercepted', { thirdPartyId: '', thirdPartyName: 'Invented Captor' }],
      ['envoy_parlaying', { thirdPartyId: '', thirdPartyName: 'Invented Captor' }],
      ['envoy_terms_agreed', { termSheetId: '', termName: 'Invented Terms' }],
      ['envoy_held', { venueId: '', venueName: 'Invented Hall' }],
      ['terms_signed_for_a_fallen_town', { venueId: '', venueName: 'Invented Town' }],
      ['parlay_at_an_occupied_venue', { venueId: '', venueName: 'Invented Hall' }],
      ['interceptor_dilemma', { thirdPartyId: '', thirdPartyName: 'Invented Court' }],
      ['parlay_terms_neither_court_drafted', { termSheetId: '', termName: 'Invented Terms' }],
    ];
    for (const [kind, missing] of cases) {
      expect(envoyNewsEntry({ evidence: wr7bEvidence(kind, missing), snapshot: snapshot() }), kind)
        .toBeNull();
    }
    expect(envoyNewsEntry({
      evidence: wr7bEvidence('interceptor_parlays_own_edge', { counterpartId: '' }),
      snapshot: snapshot(),
    })).toBeNull();
  });

  test('missing identities fail closed; paired evidence labels may resolve an unavailable snapshot', () => {
    expect(envoyNewsEntry({ evidence: evidence('envoy_departed'), snapshot: {} })).toBeNull();
    const projected = envoyNewsEntry({
      evidence: evidence('envoy_departed', {
        npcName: 'Reeve Mara',
        settlementName: 'Ashford',
        counterpartName: 'Irontown',
      }),
      snapshot: {},
    });
    expect(projected).toBeTruthy();
    expect(projected.headline).toContain('Reeve Mara');
  });

  test('an unpaired route label is discarded and the authored slotless families remain available', () => {
    const entry = envoyNewsEntry({
      evidence: evidence('terms_never_reached', { routeId: '', routeName: 'Invented Road' }),
      snapshot: snapshot(),
    });
    expect(entry).toBeTruthy();
    expect(readerCopy(entry)).not.toContain('Invented Road');
  });

  test('unknown or malformed evidence remains closed', () => {
    expect(envoyNewsEntry({
      evidence: { ...evidence('envoy_home'), kind: 'envoy_not_authored' },
      snapshot: snapshot(),
    })).toBeNull();
    expect(envoyNewsEntry({
      evidence: { ...evidence('envoy_home'), tick: '12' },
      snapshot: snapshot(),
    })).toBeNull();
    expect(envoyNewsEntry({
      evidence: { ...evidence('envoy_home'), settlementId: 'irontown' },
      snapshot: snapshot(),
    })).toBeNull();
  });

  test('batch projection is stable, exact-once, and independent of input order', () => {
    const rows = [evidence('envoy_home'), evidence('envoy_departed')];
    const first = envoyNewsEntries({ evidence: [...rows, rows[0]], snapshot: snapshot() });
    const second = envoyNewsEntries({ evidence: [...rows].reverse(), snapshot: snapshot() });
    expect(first).toHaveLength(2);
    expect(second).toEqual(first);
    expect(new Set(first.map((entry) => entry.id)).size).toBe(2);
  });

  test('the one truthful feed projects remote loss facts out of player views', () => {
    const entries = envoyNewsEntries({
      evidence: [
        evidence('envoy_departed'),
        evidence('envoy_silence_inference'),
        evidence('envoy_lost'),
        evidence('terms_never_reached'),
      ],
      snapshot: snapshot(),
    });
    const feed = { currentTick: 12, entries };
    expect(projectWizardNewsForAudience(feed, 'dm')).toBe(feed);
    expect(projectWizardNewsForAudience(feed, 'player').entries.map((entry) => entry.kind))
      .toEqual(['envoy_departed', 'envoy_silence_inference']);
  });

  test('the one truthful feed removes every immediate WR-7b fact from player views', () => {
    const entries = envoyNewsEntries({
      evidence: [evidence('envoy_departed'), ...WR7B_KINDS.map((kind) => wr7bEvidence(kind))],
      snapshot: snapshot(),
    });
    expect(entries).toHaveLength(10);
    const feed = { currentTick: 12, entries };
    expect(projectWizardNewsForAudience(feed, 'player').entries.map((entry) => entry.kind))
      .toEqual(['envoy_departed']);
    expect(projectWizardNewsForAudience(feed, 'dm')).toBe(feed);
  });

  test('canonical feed normalization preserves the closed envoy desk authority', () => {
    const raw = [
      envoyNewsEntry({ evidence: evidence('envoy_home'), snapshot: snapshot(), now: 'fixed' }),
      ...WR7B_KINDS.map((kind) => envoyNewsEntry({
        evidence: wr7bEvidence(kind),
        snapshot: snapshot(),
        now: 'fixed',
      })),
    ];
    const feed = appendWizardNewsEntries({}, raw, { now: 'fixed' });
    expect(feed.entries).toHaveLength(10);
    for (const entry of feed.entries) {
      expect(entry.sectionAuthority).toBe('envoy_registry');
      expect(heraldSectionOfRecord(entry)).toBe(entry.section);
    }
    const normalizedByKind = Object.fromEntries(feed.entries.map((entry) => [entry.kind, entry]));
    expect(normalizedByKind.envoy_intercepted.thirdPartyIds).toEqual(['westmere']);
    expect(normalizedByKind.envoy_intercepted.venueIds).toEqual(['occupied-hall']);
    expect(normalizedByKind.envoy_terms_agreed.termSheetIds).toEqual(['term-sheet-agreed']);
    const forged = appendWizardNewsEntries({}, [{
      ...raw[0],
      id: 'forged-section-authority',
      sectionAuthority: 'unregistered_registry',
    }], { now: 'fixed' }).entries[0];
    expect(forged.sectionAuthority).toBeUndefined();
  });
});
