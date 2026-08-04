/**
 * WR-10 phrased-kind walker: the exact fifteen-kind census of the sovereignty market,
 * frequency-scaled annex-authored families, governed metadata/desks, the per-kind Herald
 * routing that five of the kinds cannot get from their token, and no-fabrication slot
 * selection. This certifies presentation width only; it is not behavioral soak evidence.
 *
 * THE ANNEX-READ POLICY, DECIDED UP FRONT: WAR-VOLUME-ONLY. The one-kind-one-pool merge
 * (2026-08-03) forwarded twenty-three older pools into RECEIPT_POOLS_LEGACY.md; NONE of
 * the WR-10 pools took that forward, and this walker asserts that positively (every kind
 * resolves `from === 'war'`) rather than leaving it to be discovered when a future merge
 * moves one and the pin goes quietly stale.
 *
 * THE THREE RED WAR WALKERS ARE NOT THIS LANE'S. warCoalitionKindPools, warCostKindPools
 * and warRulingKindPools carry pre-existing violation rows from the LEGACY pool-forward
 * and the chronic-tier deepening. The WR-10 kinds deliberately land in THEIR OWN walker
 * file so this wave neither launders that debt onto its own ledger nor hides behind it.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import { anchoredOnce, receiptAnnexPool, WAR_ANNEX_URL } from '../helpers/receiptAnnex.js';
import { WHAT_PHRASES } from '../../src/domain/display/settlementRumors.js';
import { heraldSectionOfRecord, SECTION_OF } from '../../src/domain/realm/heraldRouting.js';
import {
  SOVEREIGNTY_KIND_REGISTRY,
  SOVEREIGNTY_KINDS,
  sovereigntyReceipt,
} from '../../src/domain/worldPulse/sovereigntyNews.js';

/** kind, significance, audience, desk, authored depth. */
const EXPECTED = Object.freeze([
  ['sovereignty_sale_offered', 'notable', 'public', 'trade', 6],
  ['sovereignty_sale_cleared', 'major', 'public', 'trade', 5],
  ['sovereignty_no_trade', 'routine', 'public', 'trade', 10],
  ['sovereignty_swap', 'major', 'public', 'trade', 5],
  ['cession_for_peace', 'major', 'public', 'adjudication', 5],
  ['sovereignty_edge_rewritten', 'notable', 'public', 'events', 6],
  ['sold_settlement_grievance', 'major', 'public', 'events', 5],
  ['bought_seat_fragility', 'notable', 'public', 'adjudication', 6],
  ['lineage_survives_the_sale', 'notable', 'public', 'events', 6],
  ['wartime_firesale', 'notable', 'public', 'trade', 6],
  ['sovereignty_sale_judged', 'notable', 'public', 'faith', 6],
  ['kinship_opposes_the_sale', 'notable', 'public', 'adjudication', 6],
  ['sale_books_diverged', 'major', 'dm-only', 'adjudication', 5],
  ['overflow_valve_sold', 'notable', 'public', 'events', 6],
  ['streams_rerouted', 'routine', 'public', 'trade', 10],
]);

/** SP-6's frequency-scaled floor (spine §2 amendment 2026-08-03). */
const FLOOR_BY_SIGNIFICANCE = Object.freeze({ routine: 8, notable: 6, major: 4 });

const INTERP = Object.freeze({
  settlement: 'Ashford',
  counterpart: 'Irontown',
  third_party: 'Westmere',
  npc: 'Reeve Mara',
  house: 'House Rowan',
  temple: 'Harvest Chapter',
  good: 'grain',
  route: 'North Road',
  band: 'deeply',
  reason: 'the sealed terms',
});

const ANNEX_SOURCE = readFileSync(WAR_ANNEX_URL, 'utf8');

/**
 * The shared, fail-closed annex read: line-anchored headings asserted to occur EXACTLY
 * once, the legacy forward followed rather than read as an empty block, and a throw
 * instead of the `[]` that made the address-lie class invisible.
 */
function annexPool(kind) {
  return receiptAnnexPool(kind, {
    source: ANNEX_SOURCE,
    section: '# WR-10',
    until: '## OPEN ITEMS FOR THE VALIDATION CHAIR',
    interp: INTERP,
    strip: (line) => line.replace(/\s+\*\(§8\)\*$/, ''),
  });
}

function annexLines(kind) {
  return annexPool(kind).lines;
}

describe('SP-6 phrased-kind registry — WR-10 the sovereignty market', () => {
  test('the fifteen-kind census and every reader join are exact', () => {
    expect(SOVEREIGNTY_KINDS).toEqual(EXPECTED.map(([kind]) => kind));
    expect(SOVEREIGNTY_KIND_REGISTRY).toHaveLength(15);
    for (const [kind, significance, audience, section, depth] of EXPECTED) {
      const row = SOVEREIGNTY_KIND_REGISTRY.find((candidate) => candidate.kind === kind);
      expect(row).toMatchObject({ kind, significance, audience, section });
      expect(row.pool).toHaveLength(depth);
      expect(row.pool.length).toBeGreaterThanOrEqual(FLOOR_BY_SIGNIFICANCE[significance]);
      expect(row.requiredSlots).toHaveLength(depth);
      expect(Object.isFrozen(row)).toBe(true);
      expect(Object.isFrozen(row.requiredSlots)).toBe(true);
      // Every pool keeps at least one SLOTLESS family, so a receipt whose named evidence
      // is absent still has an honest authored sentence instead of a fabricated name.
      expect(row.requiredSlots.some((slots) => slots.length === 0)).toBe(true);
      expect(WHAT_PHRASES[kind], `${kind}: missing WHAT_PHRASES`).toBeTruthy();
      // The exclusion below is read against a phrase already proven to exist, so the only
      // way to satisfy both is a real phrase carrying no de-underscored engine token.
      // anchored: the toBeTruthy on the line above pins the entry present and non-empty.
      expect(WHAT_PHRASES[kind]).not.toMatch(/_/);
    }
  });

  test('the five kinds their token cannot file are filed by the registry authority', () => {
    // SECTION_OF structurally never returns `adjudication`, so the four adjudication
    // kinds fall to the events catch-all by token — exactly as the WR-5 decision records
    // do — and only the governed `sovereignty_registry` authority files them right. The
    // faith-desk kind is pinned on BOTH roads because its token entry and its registry
    // desk must agree; a token-map regression there would otherwise be invisible.
    for (const [kind, , , section] of EXPECTED) {
      expect(SECTION_OF(kind), `${kind}: token routing`)
        .toBe(section === 'adjudication' ? 'events' : section);
      expect(heraldSectionOfRecord({ kind, section, sectionAuthority: 'sovereignty_registry' }), `${kind}: record routing`)
        .toBe(section);
    }
    // NON-VACUITY: the two roads must actually DISAGREE somewhere, or this test would
    // pass just as happily against a registry whose every desk equalled its token.
    const disagreeing = EXPECTED.filter(([kind, , , section]) => SECTION_OF(kind) !== section).map(([kind]) => kind);
    expect(disagreeing).toEqual([
      'cession_for_peace', 'bought_seat_fragility', 'kinship_opposes_the_sale', 'sale_books_diverged',
    ]);
    // anchored: the four adjudication desks are named exactly, so a registry that quietly
    // re-desked one of them to `events` (which its token already answers) reds here
    // instead of passing because both roads happen to agree on the catch-all.
    expect(EXPECTED.filter(([, , , s]) => s === 'adjudication').map(([k]) => k)).toEqual([
      'cession_for_peace', 'bought_seat_fragility', 'kinship_opposes_the_sale', 'sale_books_diverged',
    ]);
    expect(EXPECTED.filter(([, , , s]) => s === 'faith').map(([k]) => k)).toEqual(['sovereignty_sale_judged']);
  });

  test('an UNGOVERNED record carrying the same section never borrows the authority', () => {
    // The authority token is what separates a governed projection from a record that
    // merely happens to carry a `section` field. Without this the disjunction could be
    // widened to "any record with a section" and nothing would red.
    expect(heraldSectionOfRecord({ kind: 'cession_for_peace', section: 'adjudication' })).toBe('events');
    // anchored: the identical record WITH the authority answers `adjudication` one line
    // below, so this pin cannot pass because the routing collapsed to the catch-all.
    expect(heraldSectionOfRecord({
      kind: 'cession_for_peace', section: 'adjudication', sectionAuthority: 'sovereignty_registry',
    })).toBe('adjudication');
    expect(heraldSectionOfRecord({
      kind: 'cession_for_peace', section: 'adjudication', sectionAuthority: 'not_a_registry',
    })).toBe('events');
  });

  test.each(SOVEREIGNTY_KIND_REGISTRY)(
    '$kind retains its exact frequency-scaled receipt-annex families',
    (row) => {
      const rendered = row.pool.map((variant) => (
        typeof variant === 'function' ? String(variant(INTERP)) : String(variant)
      ));
      expect(rendered).toEqual(annexLines(row.kind));
      expect(new Set(rendered).size).toBe(row.pool.length);
      for (const line of rendered) {
        expect(line).toBe(line.trim());
        expect(line.length).toBeGreaterThan(0);
        // `rendered` is pinned EQUAL to the annex lines and to the authored depth above,
        // and each line is pinned non-empty, so this loop always runs over real sentences:
        // an emptied pool reds at the equality rather than passing these for free. The
        // pattern also matches `undefined`, so a lost slot renders the word and reds.
        // anchored: annex-equality, authored depth, and per-line non-emptiness above.
        expect(line).not.toMatch(/\d|%|×|_|\$\{|\bundefined\b|\bNaN\b/);
        // anchored: same liveness — the rendered set is annex-equal and non-empty above.
        expect(line).not.toMatch(/\b(?:rng|roll|score|ratio|tick|chance|probability|threshold|multiplier|schema|json|stateRead|flag)\b/i);
      }
    },
  );

  test('the annex address of every pool is the war volume, not the legacy forward', () => {
    // The census, not a bare absence pin: every one of the fifteen must RESOLVE (the
    // shared reader throws on a rotted or duplicated heading), and every resolution must
    // land in the war volume. If a later merge forwards a WR-10 pool to the legacy annex,
    // this reddens instead of the pool silently reading as stale sentences.
    const address = SOVEREIGNTY_KINDS.map((kind) => annexPool(kind).from);
    expect(address).toHaveLength(15);
    expect([...new Set(address)]).toEqual(['war']);
  });

  test('THE FIRST-MATCH LAW: every document anchor this walker rides matches exactly once', () => {
    // An `exec`/`indexOf` document pin retargets SILENTLY when a second matching heading
    // appears (the CR-WR10-A/B hazard class). Both of this walker's slice anchors, and
    // all fifteen kind headings, are asserted single here — and the mutants below prove
    // the guard actually fires rather than being decorative.
    expect(() => anchoredOnce(ANNEX_SOURCE, /^# WR-10(?=[ \n])/gm, 'WR-10 section')).not.toThrow();
    expect(() => anchoredOnce(ANNEX_SOURCE, /^## OPEN ITEMS FOR THE VALIDATION CHAIR(?=[ \n])/gm, 'terminator')).not.toThrow();
    for (const kind of SOVEREIGNTY_KINDS) {
      const hits = [...ANNEX_SOURCE.matchAll(new RegExp(`^### ${kind}(?= )`, 'gm'))];
      expect(hits, `${kind}: annex heading count`).toHaveLength(1);
    }
  });

  test('MUTANT — a duplicated section heading throws instead of retargeting the slice', () => {
    const doctored = `${ANNEX_SOURCE}\n# WR-10 — A SECOND HEADING NOBODY NOTICED\n`;
    expect(() => receiptAnnexPool('streams_rerouted', {
      source: doctored,
      section: '# WR-10',
      until: '## OPEN ITEMS FOR THE VALIDATION CHAIR',
      interp: INTERP,
    })).toThrow(/expected exactly 1 match/);
  });

  test('MUTANT — a rotted kind heading throws instead of returning an empty pool', () => {
    const doctored = ANNEX_SOURCE.replace('### streams_rerouted (WR-10)', '### streams_reroutedX (WR-10)');
    // anchored: the UNdoctored source resolves this exact kind to ten lines two lines
    // below, so a reader that had stopped resolving anything at all would fail there
    // rather than let this throw-pin pass for the wrong reason.
    expect(() => receiptAnnexPool('streams_rerouted', {
      source: doctored,
      section: '# WR-10',
      until: '## OPEN ITEMS FOR THE VALIDATION CHAIR',
      interp: INTERP,
    })).toThrow(/expected exactly 1 match/);
    expect(annexLines('streams_rerouted')).toHaveLength(10);
  });

  test.each(SOVEREIGNTY_KIND_REGISTRY)(
    '$kind is deterministic and every structural family is reachable',
    (row) => {
      const receipts = Array.from({ length: 1200 }, (_, index) => (
        sovereigntyReceipt(row.kind, `wr-ten:${index}`, INTERP)
      ));
      expect(receipts.every(Boolean)).toBe(true);
      expect(new Set(receipts.map((receipt) => receipt.familyId)).size).toBe(row.pool.length);
      expect(sovereigntyReceipt(row.kind, 'same', INTERP))
        .toEqual(sovereigntyReceipt(row.kind, 'same', INTERP));
    },
  );

  test.each(SOVEREIGNTY_KIND_REGISTRY)(
    '$kind skips a named family when its typed evidence is absent',
    (row) => {
      for (const [templateIndex, requiredSlots] of row.requiredSlots.entries()) {
        if (!requiredSlots.length) continue;
        const familyId = `${row.kind}.${templateIndex + 1}`;
        const seed = Array.from({ length: 900 }, (_, index) => `slot:${index}`)
          .find((candidate) => sovereigntyReceipt(row.kind, candidate, INTERP)?.familyId === familyId);
        expect(seed, `${familyId}: complete evidence reaches family`).toBeTruthy();
        const partial = { ...INTERP };
        for (const slot of requiredSlots) delete partial[slot];
        const fallback = sovereigntyReceipt(row.kind, seed, partial);
        expect(fallback).toBeTruthy();
        expect(fallback.familyId).not.toBe(familyId);
        // The degraded receipt is a REAL authored sentence from this kind's own pool, not
        // a blank — which is the whole point of keeping slotless siblings — and the family
        // it fell back to asks only for evidence the caller still holds.
        expect(fallback.line.length).toBeGreaterThan(0);
        expect(row.requiredSlots[fallback.templateIndex].every((slot) => partial[slot])).toBe(true);
        // Read against a sentence known to exist: an empty or absent line reds at the
        // non-emptiness pin above rather than satisfying this exclusion for free.
        // anchored: fallback line pinned non-empty and its family satisfiable above.
        expect(fallback.line).not.toMatch(/\bundefined\b|\bNaN\b/);
      }
    },
  );

  test('unknown kinds stay closed and the sole covert row is exact', () => {
    expect(sovereigntyReceipt('sovereignty_unknown', 'seed', INTERP)).toBeNull();
    expect(SOVEREIGNTY_KIND_REGISTRY.filter((row) => row.audience === 'dm-only'))
      .toEqual([expect.objectContaining({ kind: 'sale_books_diverged', section: 'adjudication' })]);
  });
});
