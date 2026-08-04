/**
 * sovereigntyNews.test.js — WR-10's reader projection, pinned at the projector.
 *
 * The kind-pool walker (tests/lint/sovereigntyKindPools.walker.test.js) owns the corpus,
 * the census and the desks. THIS file owns what the projector does with a typed fact:
 * the address chain, the per-kind slot roles, the covert row's fail-closed reading, and
 * the byte-neutrality of the actor-id keys.
 *
 * THE PAYLOAD CONTRACT IS INHERITED, NOT INVENTED. Every fixture below is shaped like the
 * `newsSeeds` the landed conveyance writer already emits (sovereigntyTransfer.js:
 * `{ kind, assetId, fromId, toId, tick, settlementIds, reasons, … }`). The writer mints no
 * receipt id — the treaty is the artifact, not the feed — so the projector derives the
 * source ref from the fact's own address, and that derivation is pinned here.
 */
import { describe, expect, test } from 'vitest';

import {
  SOVEREIGNTY_KINDS,
  sovereigntyNewsEntries,
  sovereigntyNewsEntry,
} from '../../src/domain/worldPulse/sovereigntyNews.js';

const SNAPSHOT = Object.freeze({
  byId: {
    asset_town: { id: 'asset_town', name: 'Ashford' },
    seller_seat: { id: 'seller_seat', name: 'Irontown', npcs: [{ id: 'reeve', name: 'Reeve Mara' }] },
    buyer_seat: { id: 'buyer_seat', name: 'Westmere' },
  },
});

/** A writer-shaped seed. */
function seed(kind, extra = {}) {
  return {
    kind,
    assetId: 'asset_town',
    fromId: 'seller_seat',
    toId: 'buyer_seat',
    tick: 12,
    settlementIds: ['seller_seat', 'buyer_seat', 'asset_town'],
    ...extra,
  };
}

function project(kind, extra = {}) {
  return sovereigntyNewsEntry({ evidence: seed(kind, extra), snapshot: SNAPSHOT, now: null });
}

/** Find an evidence id that lands the projection on a named family. */
function entryOnFamily(kind, familyId, extra = {}) {
  for (let index = 0; index < 900; index += 1) {
    const entry = project(kind, { ...extra, id: `probe:${index}` });
    if (entry?.familyId === familyId) return entry;
  }
  return null;
}

describe('WR-10 sovereignty news — the address chain', () => {
  test('a cleared sale carries the full governed address chain', () => {
    const entry = project('sovereignty_sale_cleared');
    expect(entry).toBeTruthy();
    expect(entry).toMatchObject({
      tick: 12,
      scope: 'regional',
      significance: 'major',
      kind: 'sovereignty_sale_cleared',
      impactKind: 'sovereignty_sale_cleared',
      audience: 'public',
      section: 'trade',
      sectionAuthority: 'sovereignty_registry',
      channelType: null,
    });
    expect(entry.id).toBe('wizard_news.12.sovereignty_sale_cleared.sovereignty_sale_cleared_asset_town_seller_seat_buyer_seat_12');
    expect(entry.settlementIds).toEqual(['asset_town', 'seller_seat', 'buyer_seat']);
    expect(entry.settlementNames).toEqual(['Ashford', 'Irontown', 'Westmere']);
    expect(entry.tags).toEqual(['world_pulse', 'sovereignty', 'trade']);
    expect(entry.reasons.length).toBeGreaterThan(0);
    expect(entry.familyId).toMatch(/^sovereignty_sale_cleared\.\d+$/);
    // The reader surfaces never carry engine vocabulary or figures. Both surfaces are
    // pinned to their exact authored text first, so the exclusion below is read against a
    // string that is known to be present and correct rather than against a hole.
    expect(entry.headline).toBe('Ashford passes from Irontown to Westmere');
    expect(entry.summary.length).toBeGreaterThan(0);
    // The pattern itself matches `undefined`, so a surface that drifted away renders the
    // word and reds here instead of passing because there was nothing left to scan.
    // anchored: headline pinned verbatim and summary pinned non-empty two lines above.
    expect(`${entry.headline} ${entry.summary}`).not.toMatch(/\d|_|\$\{|\bundefined\b|\bNaN\b/);
  });

  test('the writer-supplied reason rides beside the governed one, deduped', () => {
    const entry = project('sovereignty_edge_rewritten', {
      reasons: ['The steading answers to a new parent; its people and its founding line are untouched.'],
    });
    expect(entry.reasons).toHaveLength(2);
    expect(entry.reasons[1]).toMatch(/steading answers to a new parent/);
    // A reason carrying a figure or an engine token is dropped rather than rendered.
    const noisy = project('sovereignty_edge_rewritten', { reasons: ['resistance rose to 0.3'] });
    expect(noisy.reasons).toHaveLength(1);
  });

  test('a kind missing its required identities returns null rather than throwing', () => {
    for (const kind of SOVEREIGNTY_KINDS) {
      expect(() => sovereigntyNewsEntry({ evidence: { kind, tick: 1 }, snapshot: SNAPSHOT })).not.toThrow();
      expect(sovereigntyNewsEntry({ evidence: { kind, tick: 1 }, snapshot: SNAPSHOT })).toBeNull();
    }
    // anchored: the identical kinds DO project when their address is complete (the
    // cleared-sale pin above resolves one), so this is a fail-closed proof rather than a
    // projector that returns null for everything.
    expect(project('sovereignty_sale_cleared')).toBeTruthy();
    expect(sovereigntyNewsEntry({ evidence: seed('not_a_sovereignty_kind'), snapshot: SNAPSHOT })).toBeNull();
  });

  test('an unnamed party fails the row closed instead of rendering a raw id', () => {
    const entry = sovereigntyNewsEntry({
      evidence: seed('sovereignty_sale_cleared'),
      snapshot: { byId: { asset_town: { id: 'asset_town', name: 'Ashford' } } },
    });
    expect(entry).toBeNull();
  });
});

describe('WR-10 sovereignty news — THE PER-KIND SLOT ROLES', () => {
  test('sovereignty_no_trade INVERTS counterpart/third_party, and the sibling kind does not', () => {
    // The authored no-trade line reads "{counterpart} would not take what {third_party}
    // could bear to give" — the refusing party is the BUYER. Every other kind binds
    // {counterpart} to the SELLER. A single global binding would render this sentence
    // with the seller refusing its own sale: compiling, passing, and exactly backwards.
    const noTrade = entryOnFamily('sovereignty_no_trade', 'sovereignty_no_trade.1');
    expect(noTrade, 'the slotted no-trade family must be reachable').toBeTruthy();
    expect(noTrade.summary).toBe(
      'The machinery ran and produced nothing: Westmere would not take what Irontown could bear to give.',
    );

    // THE CONTRAST, on the same projector: here {counterpart} IS the seller (its reserve)
    // and {third_party} the buyer (its ceiling). Both sentences passing proves the
    // per-kind table is consulted rather than one binding hardcoded for all fifteen.
    const cleared = entryOnFamily('sovereignty_sale_cleared', 'sovereignty_sale_cleared.1');
    expect(cleared, 'the slotted cleared family must be reachable').toBeTruthy();
    expect(cleared.summary).toBe(
      "The trade cleared: Irontown's reserve was met and Westmere's ceiling was not reached.",
    );
    // anchored: the two summaries above name Irontown (seller) and Westmere (buyer) in
    // OPPOSITE slots, so a projector that collapsed to one binding cannot satisfy both.
    expect(noTrade.summary).not.toBe(cleared.summary);
  });

  test('the buyer is the party a rewritten edge now answers to', () => {
    const entry = entryOnFamily('sovereignty_edge_rewritten', 'sovereignty_edge_rewritten.1');
    expect(entry.summary).toBe(
      "Ashford's overlord is Westmere now; the people are the same people and the tolls go elsewhere.",
    );
  });
});

describe('WR-10 sovereignty news — THE COVERT ROW', () => {
  test('sale_books_diverged is dm-only, covert, and fail-closed on the books reading', () => {
    const withSeat = project('sale_books_diverged', {
      npcId: 'reeve', booksInterest: 'seat',
    });
    expect(withSeat).toMatchObject({
      audience: 'dm-only',
      covert: true,
      section: 'adjudication',
      channelType: 'political_authority',
    });
    expect(withSeat.npcIds).toEqual(['reeve']);

    // FAIL-CLOSED UPSTREAM: a books divergence that does not positively record the SEAT
    // as the interest served is REFUSED, not redacted. Redacting downstream would still
    // admit the fact existed, which is the leak the ruler_books_compromised discipline
    // forbids.
    expect(project('sale_books_diverged', { npcId: 'reeve', booksInterest: 'realm' })).toBeNull();
    expect(project('sale_books_diverged', { npcId: 'reeve' })).toBeNull();
    // …and the seat is not a free pass either: the row still needs its named seat.
    expect(project('sale_books_diverged', { booksInterest: 'seat' })).toBeNull();
  });

  test('every other kind is public and carries no covert key at all', () => {
    for (const kind of SOVEREIGNTY_KINDS.filter((k) => k !== 'sale_books_diverged')) {
      const entry = project(kind, { band: 'pressing', temple: 'Harvest Chapter' });
      if (!entry) continue;
      expect(entry.audience, `${kind}: audience`).toBe('public');
      expect(Object.hasOwn(entry, 'covert'), `${kind}: covert key present`).toBe(false);
    }
    // anchored: the covert kind DOES carry the key (asserted in the pin above), so this
    // absence pin cannot pass because nothing ever sets it.
    expect(project('sale_books_diverged', { npcId: 'reeve', booksInterest: 'seat' }).covert).toBe(true);
  });
});

describe('WR-10 sovereignty news — byte neutrality and folding', () => {
  test('T4: an actor-id key spreads in only when it carries something', () => {
    const withoutNpc = project('sovereignty_sale_cleared');
    expect(Object.hasOwn(withoutNpc, 'npcIds')).toBe(false);
    const withNpc = project('sovereignty_sale_cleared', { npcId: 'reeve' });
    // anchored: the same kind DOES gain the key when the actor resolves, so the absence
    // above is byte-neutrality rather than a key nothing ever writes.
    expect(withNpc.npcIds).toEqual(['reeve']);
    // An id that resolves to no name is not an actor — the key stays out.
    expect(Object.hasOwn(project('sovereignty_sale_cleared', { npcId: 'ghost' }), 'npcIds')).toBe(false);
  });

  test('the same fact projects identically and folds exactly once', () => {
    const once = project('sovereignty_sale_cleared');
    expect(project('sovereignty_sale_cleared')).toEqual(once);
    const batch = sovereigntyNewsEntries({
      evidence: [seed('sovereignty_sale_cleared'), seed('sovereignty_sale_cleared'), seed('sovereignty_edge_rewritten')],
      snapshot: SNAPSHOT,
    });
    expect(batch).toHaveLength(2);
    expect(batch.map((entry) => entry.id)).toEqual([...batch.map((entry) => entry.id)].sort());
  });

  test('a malformed batch yields silence, not throws', () => {
    expect(sovereigntyNewsEntries({ evidence: [null, 7, 'x', {}], snapshot: SNAPSHOT })).toEqual([]);
    expect(sovereigntyNewsEntries({})).toEqual([]);
  });
});
