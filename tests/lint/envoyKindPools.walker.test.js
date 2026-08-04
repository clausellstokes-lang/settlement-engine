/**
 * WR-7 phrased-kind walker: exact sixteen-kind census, frequency-scaled
 * annex-authored families, governed metadata/desks, and no-fabrication
 * truth-slot selection.
 * This certifies presentation width only; it is not behavioral soak evidence.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import { receiptAnnexPool, WAR_ANNEX_URL } from '../helpers/receiptAnnex.js';
import { WHAT_PHRASES } from '../../src/domain/display/settlementRumors.js';
import { heraldSectionOfRecord, SECTION_OF } from '../../src/domain/realm/heraldRouting.js';
import { ENVOY_EVIDENCE_KINDS } from '../../src/domain/worldPulse/envoyErrand.js';
import {
  ENVOY_KIND_REGISTRY,
  ENVOY_KINDS,
  envoyReceipt,
} from '../../src/domain/worldPulse/eventProse.js';

const EXPECTED = Object.freeze([
  ['envoy_departed', 'notable', 'public', 'adjudication', 6],
  ['envoy_on_the_road', 'routine', 'public', 'events', 12],
  ['envoy_returning', 'notable', 'public', 'adjudication', 6],
  ['envoy_home', 'major', 'public', 'adjudication', 5],
  ['envoy_lost', 'major', 'dm-only', 'adjudication', 5],
  ['envoy_silence_inference', 'major', 'public', 'divination', 5],
  ['terms_never_reached', 'major', 'dm-only', 'adjudication', 5],
  ['envoy_intercepted', 'major', 'dm-only', 'war', 5],
  ['envoy_parlaying', 'notable', 'dm-only', 'adjudication', 6],
  ['envoy_terms_agreed', 'major', 'dm-only', 'adjudication', 5],
  ['envoy_held', 'major', 'dm-only', 'adjudication', 5],
  ['terms_signed_for_a_fallen_town', 'major', 'dm-only', 'adjudication', 5],
  ['parlay_at_an_occupied_venue', 'notable', 'dm-only', 'adjudication', 6],
  ['interceptor_dilemma', 'notable', 'dm-only', 'war', 6],
  ['interceptor_parlays_own_edge', 'major', 'dm-only', 'adjudication', 5],
  ['parlay_terms_neither_court_drafted', 'major', 'dm-only', 'adjudication', 5],
]);

const FLOOR_BY_SIGNIFICANCE = Object.freeze({ routine: 8, notable: 6, major: 4 });

const INTERP = Object.freeze({
  settlement: 'Ashford',
  counterpart: 'Irontown',
  npc: 'Reeve Mara',
  route: 'North Road',
  third_party: 'Westmere',
  term: 'road concession',
  reason: 'the sealed terms',
});

const LEGACY_ON_ROAD_TAIL = Object.freeze([
  'Each mile carries the messenger farther from the council that chose the words.',
  'A sealed message can be in motion while every power it names remains where it was.',
  'Those who hear of the journey may know more of it than either waiting court.',
  'The messenger has no new vote to cast between one mile and the next.',
  'A public road gives a sealed purpose no promise of privacy.',
  'The message moves; its authority waits.',
]);

const CORRECTED_SELF_PARLAY = Object.freeze([
  'Ashford opened a parley on its own edge with Irontown; the rest of the war remained standing.',
  'An ally looked for its own reason to keep fighting and found none.',
  'A new peace errand left through the coalition edge nobody was watching.',
  'The borrowed quarrel no longer answered for a fresh season in the field.',
  'One court sent its own legate because an alliance can open a war without deciding how long it lasts.',
]);

// The annex read is the shared, fail-closed one. No WR-7a kind took the one-kind-one-pool
// forward, so this site is here for the OTHER half of the cure: `indexOf('## WR-7a')` and
// `indexOf('### ${kind} ')` are unanchored first-match searches \u2014 a second heading anywhere
// in the volume, or a longer kind name sharing this one's prefix, retargets the slice with
// no red. The shared reader anchors to line start, requires exactly one match, and throws
// rather than returning the empty array that made this class invisible elsewhere (D-W1).
function annexPool(kind) {
  return receiptAnnexPool(kind, {
    source: readFileSync(WAR_ANNEX_URL, 'utf8'),
    section: '## WR-7a',
    until: '## WR-7c',
    interp: INTERP,
    strip: (line) => line.replace(/\s+\*\(\u00a78\)\*$/, ''),
  });
}

function annexLines(kind) {
  return annexPool(kind).lines;
}

describe('SP-6 phrased-kind registry — WR-7 envoy errands and parlays', () => {
  test('the sixteen-kind census and every reader join are exact', () => {
    expect(ENVOY_KINDS).toEqual(EXPECTED.map(([kind]) => kind));
    expect(ENVOY_EVIDENCE_KINDS).toEqual(ENVOY_KINDS);
    expect(ENVOY_KIND_REGISTRY).toHaveLength(16);
    for (const [kind, significance, audience, section, depth] of EXPECTED) {
      const row = ENVOY_KIND_REGISTRY.find((candidate) => candidate.kind === kind);
      expect(row).toMatchObject({ kind, significance, audience, section });
      expect(row.pool).toHaveLength(depth);
      expect(row.pool.length).toBeGreaterThanOrEqual(FLOOR_BY_SIGNIFICANCE[significance]);
      expect(row.requiredSlots).toHaveLength(depth);
      expect(Object.isFrozen(row)).toBe(true);
      expect(Object.isFrozen(row.requiredSlots)).toBe(true);
      expect(WHAT_PHRASES[kind], `${kind}: missing WHAT_PHRASES`).toBeTruthy();
      expect(WHAT_PHRASES[kind]).not.toMatch(/_/);
      expect(SECTION_OF(kind)).toBe(section === 'adjudication' ? 'events' : section);
      expect(heraldSectionOfRecord({
        kind,
        section,
        sectionAuthority: 'envoy_registry',
      })).toBe(section);
    }
  });

  test.each(ENVOY_KIND_REGISTRY)(
    '$kind retains its exact frequency-scaled receipt-annex families',
    (row) => {
      const rendered = row.pool.map((variant) => (
        typeof variant === 'function' ? String(variant(INTERP)) : String(variant)
      ));
      if (row.kind === 'envoy_on_the_road') {
        // The later receipt-corpus deepening rewrote the tail after WR-7a shipped.
        // Runtime compatibility is binding here: the original twelve reader
        // outputs remain unchanged while WR-7b adds only new kinds.
        expect(rendered.slice(0, 6)).toEqual(annexLines(row.kind).slice(0, 6));
        expect(rendered.slice(6)).toEqual(LEGACY_ON_ROAD_TAIL);
      } else if (row.kind === 'interceptor_parlays_own_edge') {
        // The later Convenience ruling supersedes this annex family: self-parlay
        // is proactive, with no collision and no commander ontology. Keep the
        // protected corpus untouched, but never project its contradictory lines.
        expect(rendered).toEqual(CORRECTED_SELF_PARLAY);
        expect(annexLines(row.kind).join('\n')).toMatch(/took the legate|commander/i);
        // anchored: `rendered` is pinned EXACTLY by the toEqual two lines up and the annex is proven to still CARRY the superseded vocabulary one line up, so an emptied pool or a rotted annex read reds there rather than passing vacuously here.
        expect(rendered.join('\n')).not.toMatch(/intercept|stopp(?:ed|ing)|commander|roadside|took the legate/i);
      } else if (row.kind === 'interceptor_dilemma') {
        const governed = annexLines(row.kind);
        governed[1] = "The column's court must choose between a paper and a position, and its books disagree.";
        governed[3] = 'The column can hold the field or carry home terms, and not both this season.';
        expect(annexLines(row.kind).join('\n')).toMatch(/commander/i);
        expect(rendered).toEqual(governed);
        // anchored: `rendered` is pinned EXACTLY by the toEqual one line up and the annex is proven to still CARRY `commander` two lines up, so an emptied pool or a rotted annex read reds there rather than passing vacuously here.
        expect(rendered.join('\n')).not.toMatch(/commander/i);
      } else if (row.kind === 'parlay_terms_neither_court_drafted') {
        const governed = annexLines(row.kind);
        governed[2] = 'The parties in the field drafted from what they had seen; the courts will read it from what they were told.';
        expect(annexLines(row.kind).join('\n')).toMatch(/commanders/i);
        expect(rendered).toEqual(governed);
        // anchored: `rendered` is pinned EXACTLY by the toEqual one line up and the annex is proven to still CARRY `commanders` two lines up, so an emptied pool or a rotted annex read reds there rather than passing vacuously here.
        expect(rendered.join('\n')).not.toMatch(/commander/i);
      } else {
        expect(rendered).toEqual(annexLines(row.kind));
      }
      expect(new Set(rendered).size).toBe(row.pool.length);
      for (const line of rendered) {
        expect(line).toBe(line.trim());
        expect(line).not.toMatch(/\d|%|×|_|\$\{|\bundefined\b|\bNaN\b/);
        expect(line).not.toMatch(/\b(?:rng|roll|score|ratio|tick|chance|probability|threshold|multiplier|schema|json|stateRead|flag)\b/i);
      }
    },
  );

  test.each(ENVOY_KIND_REGISTRY)(
    '$kind is deterministic and every structural family is reachable',
    (row) => {
      const receipts = Array.from({ length: 1200 }, (_, index) => (
        envoyReceipt(row.kind, `wr-seven-a:${index}`, INTERP)
      ));
      expect(receipts.every(Boolean)).toBe(true);
      expect(new Set(receipts.map((receipt) => receipt.familyId)).size).toBe(row.pool.length);
      expect(envoyReceipt(row.kind, 'same', INTERP))
        .toEqual(envoyReceipt(row.kind, 'same', INTERP));
    },
  );

  test.each(ENVOY_KIND_REGISTRY)(
    '$kind skips a named family when its typed evidence is absent',
    (row) => {
      for (const [templateIndex, requiredSlots] of row.requiredSlots.entries()) {
        if (!requiredSlots.length) continue;
        const familyId = `${row.kind}.${templateIndex + 1}`;
        const seed = Array.from({ length: 600 }, (_, index) => `slot:${index}`)
          .find((candidate) => envoyReceipt(row.kind, candidate, INTERP)?.familyId === familyId);
        expect(seed, `${familyId}: complete evidence reaches family`).toBeTruthy();
        const partial = { ...INTERP };
        for (const slot of requiredSlots) delete partial[slot];
        const fallback = envoyReceipt(row.kind, seed, partial);
        expect(fallback).toBeTruthy();
        expect(fallback.familyId).not.toBe(familyId);
        expect(fallback.line).not.toMatch(/\bundefined\b|\bNaN\b/);
      }
    },
  );

  test('the annex address of each pool is the one the corpus actually holds', () => {
    // The census, not a bare absence pin: every one of the sixteen kinds must RESOLVE (the
    // shared reader throws on a rotted or duplicated heading), and every resolution must land
    // in the war volume. If a later merge forwards a WR-7a pool to the legacy annex, this
    // reddens instead of the pool silently reading as five stale sentences.
    const address = ENVOY_KINDS.map((kind) => annexPool(kind).from);
    expect(address).toHaveLength(16);
    expect([...new Set(address)]).toEqual(['war']);
  });

  test('unknown kinds stay closed and every immediate WR-7b fact remains DM-only', () => {
    expect(envoyReceipt('envoy_unknown', 'seed', INTERP)).toBeNull();
    expect(Object.fromEntries(ENVOY_KIND_REGISTRY.map((row) => [row.kind, row.audience])))
      .toMatchObject({
        envoy_departed: 'public',
        envoy_silence_inference: 'public',
        envoy_lost: 'dm-only',
        terms_never_reached: 'dm-only',
        envoy_intercepted: 'dm-only',
        envoy_parlaying: 'dm-only',
        envoy_terms_agreed: 'dm-only',
        envoy_held: 'dm-only',
        terms_signed_for_a_fallen_town: 'dm-only',
        parlay_at_an_occupied_venue: 'dm-only',
        interceptor_dilemma: 'dm-only',
        interceptor_parlays_own_edge: 'dm-only',
        parlay_terms_neither_court_drafted: 'dm-only',
      });
  });
});
