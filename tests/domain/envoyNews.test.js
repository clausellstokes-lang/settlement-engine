/** @vitest-environment node */
import { describe, expect, test } from 'vitest';

import { heraldSectionOfRecord } from '../../src/domain/realm/heraldRouting.js';
import { projectWizardNewsForAudience } from '../../src/domain/region/wizardNews.js';
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
});

const DM_ONLY_KINDS = new Set(['envoy_lost', 'terms_never_reached']);

function snapshot() {
  return {
    byId: {
      ashford: { id: 'ashford', settlement: { name: 'Ashford' } },
      irontown: { id: 'irontown', settlement: { name: 'Irontown' } },
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
  test('all seven authored kinds project with governed metadata and no private ids or scalars in prose', () => {
    expect(ENVOY_EVIDENCE_KINDS).toHaveLength(7);
    for (const kind of ENVOY_EVIDENCE_KINDS) {
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
      expect(entry.familyId).toMatch(new RegExp(`^${kind}\\.[1-5]$`));
      expect(entry.sourceEventId).toMatch(/^envoy_receipt\./);
      expect(entry.sourceEventId).not.toContain('private');
      const copy = readerCopy(entry);
      if (!['envoy_silence_inference', 'terms_never_reached'].includes(kind)) {
        expect(copy).toContain('Reeve Mara');
      }
      expect(copy).not.toMatch(/envoy-evidence|envoy-errand|peace-offer|npc-mara/);
      expect(copy).not.toContain('ashford');
      expect(copy).not.toContain('irontown');
      expect(copy).not.toMatch(/[\d%_×{}\[\]]/);
      expect(copy).not.toMatch(/\b(?:rng|roll|score|ratio|tick|chance|probability|threshold|multiplier)\b/i);
    }
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
});
