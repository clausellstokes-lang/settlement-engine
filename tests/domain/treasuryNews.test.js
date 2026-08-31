/**
 * treasuryNews.test.js — W-COIN-2's coin beats, and the register they must keep.
 *
 * ── WHICH GREENS HERE ARE DISCOVERY AND WHICH ARE REGRESSION ──────────────────
 *   • DISCOVERY — the NO-SCALAR arm (it reads every rendered string of every entry a
 *     broad drive can produce, so a figure smuggled into any branch reds), the
 *     routing-totality join against the live Herald table, and the suppression arms
 *     (a routine tick and an opening tick must both be silent).
 *   • REGRESSION — the address-law shape and the determinism pin.
 *
 * The owner's directive is the bar, verbatim (ODQ §754.3): realm news is 100% contextual
 * narrative and NEVER a numerical delta. §776 cuts the same line from the other side: the
 * ledger keeps exact coin because it is a record; every surface speaks in bands.
 */
import { describe, expect, it } from 'vitest';

import { treasuryNewsEntries } from '../../src/domain/worldPulse/treasuryNews.js';
import { TREASURY_BANDS, treasuryBandOf, advanceTreasury } from '../../src/domain/worldPulse/treasury.js';
import { SECTION_OF, isExplicitlyRouted, HERALD_SECTIONS } from '../../src/domain/realm/heraldRouting.js';

const NOW = '2026-02-02T00:00:00.000Z';

/** A collected state row, the shape pulseKernel pushes out of the settlement loop. */
const state = (over = {}) => ({
  id: 's1',
  name: 'Ashford',
  powerStructure: { governingName: 'The Grey Council' },
  band: 'lean',
  previousBand: 'adequate',
  bandCrossed: true,
  shortfall: false,
  suspension: null,
  ...over,
});

/** Every rendered string an entry puts in front of a reader. */
const rendered = (entry) => [entry.headline, entry.summary, ...(entry.reasons || [])];

/** A broad drive: every branch this leaf has, so the register arm reads all of them. */
function everyBranch() {
  const rows = [];
  for (const suspension of [null, 'siege', 'occupation']) {
    rows.push(state({ id: `sf.${suspension}`, shortfall: true, band: 'empty', suspension }));
    for (const [previousBand, band] of [['adequate', 'lean'], ['lean', 'adequate'], ['lean', 'empty'], ['full', 'overflowing']]) {
      rows.push(state({ id: `bx.${suspension}.${previousBand}.${band}`, previousBand, band, suspension }));
    }
  }
  return treasuryNewsEntries({ tick: 12, now: NOW, states: rows });
}

describe('the coin beats keep the owner\'s register', () => {
  it('⛔ NOT ONE SCALAR reaches a headline, a summary or a reason — on ANY branch', () => {
    const entries = everyBranch();
    expect(entries.length, 'the drive produced nothing — this arm would prove nothing').toBeGreaterThan(10);
    for (const entry of entries) {
      for (const line of rendered(entry)) {
        // THE LIVENESS ANCHOR for both negatives below: the string exists, is really a
        // string, and really carries this court's prose. A bare absence assertion would
        // pass just as happily against '' or against a leaf that stopped rendering.
        expect(typeof line).toBe('string');
        expect(line.length).toBeGreaterThan(20);
        expect(line).toContain('Ashford');
        expect(line, `a figure reached a rendered string: ${line}`).not.toMatch(/\d/); // anchored: the three assertions above prove this line is a real, populated sentence about the right court, so an emptied renderer reds there rather than passing here.
        // …and no engine vocabulary leaked either: a band KEY is not a band WORD, and a
        // reader must never meet `merchant_league` or `great_host` in a sentence.
        expect(line, `an engine token reached a rendered string: ${line}`).not.toMatch(/_/); // anchored: as above — the same three liveness assertions stand immediately before this one.
      }
    }
  });

  it('every entry carries the four mandatory parts of the address law', () => {
    for (const entry of everyBranch()) {
      // 1 — the full subject address chain: the seat, then its town.
      expect(entry.headline).toMatch(/^The Grey Council of Ashford\b/);
      // 2 — the typed action.
      expect(typeof entry.impactKind).toBe('string');
      expect(entry.impactKind).toMatch(/^treasury_/);
      // 3 — the affected settlements, by id on the record and by NAME in the prose.
      expect(entry.settlementIds.length).toBeGreaterThan(0);
      expect(entry.summary + entry.reasons.join(' ')).toContain('Ashford');
      // 4 — a reason drawn from the recorded cause.
      expect(entry.reasons.length).toBeGreaterThan(0);
    }
  });

  it('a court with no authored seat is still addressed, never left bare', () => {
    const [entry] = treasuryNewsEntries({
      tick: 3, now: NOW, states: [state({ powerStructure: {}, shortfall: true })],
    });
    expect(entry.headline).toBe('The court of Ashford cannot pay its army');
  });
});

describe('notable-only — the feed is not spammed by bookkeeping', () => {
  it('a tick where nothing crossed and nothing failed is SILENT', () => {
    expect(treasuryNewsEntries({
      tick: 4, now: NOW, states: [state({ bandCrossed: false, shortfall: false })],
    })).toEqual([]);
    expect(treasuryNewsEntries({ tick: 4, now: NOW, states: [] })).toEqual([]);
  });

  it('⭐ AN OPENING IS NOT A CROSSING — the writer suppresses it at the source', () => {
    // Under Q10 the flag is lit by the PRESET TABLE, so every settlement in a lit world
    // opens its ledger on the same tick. Without this suppression the first taxed tick
    // would put one `empty → lean` beat per town into a single tick of the feed, for a
    // bookkeeping event nobody in the world experiences.
    const fresh = {
      tier: 'town',
      institutions: [],
      economicState: {
        prosperity: 'Moderate',
        incomeSources: [{ source: 'Agricultural Rents', percentage: 100 }],
      },
    };
    const opened = advanceTreasury(fresh, { tick: 1, rules: { treasuryEnabled: true } });
    expect(opened.summary.opened).toBe(true);
    expect(opened.summary.taxed, 'the opening tick did not tax — re-read this arm').toBeGreaterThan(0);
    // The band genuinely MOVED on that tick…
    expect(opened.summary.band).not.toBe(opened.summary.previousBand);
    // …and the crossing is still suppressed, which is the whole point.
    expect(opened.summary.bandCrossed).toBe(false);
    // The very next tick is a normal one and CAN cross, so the suppression is scoped to
    // the opening rather than being a permanently dead flag.
    const later = advanceTreasury(opened.settlement, { tick: 2, rules: { treasuryEnabled: true } });
    expect(later.summary.opened).toBe(false);
  });

  it('a shortfalling court gets ONE beat, not two', () => {
    // A crown that cannot pay is very likely also crossing a band downward. The band beat
    // defers to the sharper one rather than double-reporting a single misfortune.
    const entries = treasuryNewsEntries({
      tick: 5, now: NOW, states: [state({ shortfall: true, bandCrossed: true, band: 'empty' })],
    });
    expect(entries).toHaveLength(1);
    expect(entries[0].impactKind).toBe('treasury_shortfall');
  });
});

describe('the beats are routable, banded and deterministic', () => {
  it('every kind this leaf mints has a Herald home — the live table, joined', () => {
    const kinds = [...new Set(everyBranch().map((e) => e.impactKind))];
    expect(kinds.sort()).toEqual(['treasury_band', 'treasury_shortfall']);
    for (const kind of kinds) {
      // ⛔ ASK THE GUARANTEE, NOT THE ALGORITHM. This arm used to index EXACT_SECTION
      // directly, which pinned the DOOR the routing happens to use rather than the
      // promise the beat depends on — and it reddened the moment the two beats moved to
      // the `treasury_` family prefix, even though every one of them still routes to
      // exactly the same section. SECTION_OF is the resolver every consumer actually
      // calls, and isExplicitlyRouted is the no-orphan guarantee (it is TRUE for an exact
      // row OR a family prefix, and FALSE only for a catch-all fall-through), so together
      // they assert what this test always meant and survive either door.
      const section = SECTION_OF(kind);
      expect(section, `${kind} has no Herald section`).toBeTruthy();
      expect(HERALD_SECTIONS).toContain(section);
      expect(section, 'the crown\'s purse is an economic event (routing law 3)').toBe('trade');
      expect(isExplicitlyRouted(kind), `${kind} reaches 'trade' only by catch-all fall-through`).toBe(true);
    }
  });

  it('⭐ BOTH TENSES are total over the closed band vocabulary', () => {
    // A DRIVEN WORLD FOUND THIS, NOT A FIXTURE. With a single present-tense phrase map the
    // crossing sentence read "the vault runs lean where it lately STANDS empty" on a real
    // 24-tick run; unit arms could not see it, because they assert that a band renders and
    // not that the sentence parses. So the pair is held in step by execution: every band
    // must supply a present phrase for the NOW clause and a past one for the LATELY clause.
    for (const now of TREASURY_BANDS) {
      for (const lately of TREASURY_BANDS) {
        if (now === lately) continue;
        const [entry] = treasuryNewsEntries({ tick: 9, now: NOW, states: [state({ band: now, previousBand: lately })] });
        expect(entry, `no beat for ${lately} → ${now}`).toBeTruthy();
        expect(entry.summary).toContain('where it lately ');
        // The LATELY clause must be in the past tense — no present-tense verb survives it.
        const tail = entry.summary.split('where it lately ')[1];
        expect(tail, `${lately} → ${now} says "${tail}"`).not.toMatch(/^(stands|runs|holds|overflows)\b/); // anchored: the assertion directly above proves the clause rendered at all, so a summary that lost the clause reds there rather than passing here.
        expect(tail).toMatch(/^(stood|ran|held|overflowed)\b/);
      }
    }
  });

  it('every band the derivation can produce has a phrase the prose can use', () => {
    // TOTALITY over the closed vocabulary, driven through the beats themselves: a band
    // added to TREASURY_BANDS without a phrase would print `undefined` at a reader.
    for (const band of TREASURY_BANDS) {
      const [entry] = treasuryNewsEntries({
        tick: 7, now: NOW, states: [state({ band, previousBand: band === 'empty' ? 'lean' : 'empty' })],
      });
      expect(entry, `no beat for band ${band}`).toBeTruthy();
      for (const line of rendered(entry)) {
        // The liveness anchor again: a real sentence naming the real court, so the
        // `undefined` hunt below cannot pass against an empty or missing string.
        expect(line).toContain('Ashford');
        expect(line, `band ${band} printed a hole`).not.toMatch(/undefined/); // anchored: the assertion directly above proves the line rendered real prose for this band, so a renderer that returned nothing reds there rather than passing here.
      }
    }
  });

  it('the direction of the crossing decides the sentence, both ways', () => {
    const [fell] = treasuryNewsEntries({ tick: 8, now: NOW, states: [state({ previousBand: 'full', band: 'lean' })] });
    const [rose] = treasuryNewsEntries({ tick: 8, now: NOW, states: [state({ previousBand: 'lean', band: 'full' })] });
    expect(fell.headline).toContain('draws down');
    expect(rose.headline).toContain('rebuilds');
    expect(fell.id).toBe(rose.id);            // same court, same tick, same stable id
    expect(fell.summary).not.toBe(rose.summary);
  });

  it('the derivation the beats band on is the ONE band reading', () => {
    // §711.6, applied to a display number: the chip (a later car) and these beats are two
    // consumers of one fraction. Both come through treasuryBandOf, so they cannot drift.
    const vault = (coin) => ({ tier: 'town', institutions: [], economicState: { treasury: { coin, openedTick: 1, lastTick: 1 } } });
    expect(treasuryBandOf(vault(0))).toBe('empty');
    expect(treasuryBandOf(vault(2400))).toBe('overflowing');
    expect(TREASURY_BANDS).toContain(treasuryBandOf(vault(900)));
    // An unopened ledger reads `empty` too — a court with no books and a court with no
    // coin look the same from outside, and a sixth word would put a mechanism on a surface.
    expect(treasuryBandOf({ tier: 'town' })).toBe('empty');
  });

  it('⛔ EVERY entry stamps the PINNED tick time — no wall clock, no shadow', () => {
    // THIS ARM EXISTS BECAUSE ITS ABSENCE ALMOST SHIPPED A BUG. A local named `now` inside
    // the crossing branch shadowed the `now` PARAMETER, and `createdAt` silently became the
    // band phrase ("runs lean") instead of the timestamp. Nothing that checks bands, prose
    // or routing could see it, and the whole reason the kernel threads a pinned `now` is to
    // keep the feed's stamps deterministic rather than wall-clock. So the stamp is pinned
    // by execution, on every branch, forever.
    const entries = everyBranch();
    expect(entries.length).toBeGreaterThan(10);
    for (const entry of entries) {
      expect(entry.createdAt, `${entry.impactKind} stamped "${entry.createdAt}"`).toBe(NOW);
    }
    // …and a DIFFERENT stamp really does come through, so the arm reads the argument
    // rather than a constant that happens to match.
    const other = treasuryNewsEntries({ tick: 2, now: '2030-01-01T00:00:00.000Z', states: [state()] });
    expect(other[0].createdAt).toBe('2030-01-01T00:00:00.000Z');
    // A null stamp stays null rather than becoming a string — the kernel's own contract.
    expect(treasuryNewsEntries({ tick: 2, now: null, states: [state()] })[0].createdAt).toBe(null);
  });

  it('the same inputs mint byte-identical entries', () => {
    expect(JSON.stringify(everyBranch())).toBe(JSON.stringify(everyBranch()));
  });
});
