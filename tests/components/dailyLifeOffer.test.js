/**
 * tests/components/dailyLifeOffer.test.js — CENSUS-2, the Daily Life offer line (the chair's
 * ruling R10): the line names only what the place has — the market (`factsOf(r).market`), the
 * tavern (`factsOf(r).hasInstitution('tavern')`), the watch (`factsOf(r).defence.watch`) — and
 * with none of the three it reads "Ordinary life here in prose." alone. Before this, the line
 * named all three on every page, and the reader instrument `reader:daily-life-placeholder`
 * convicted it on 4,972 of 10,000 births (rung 2).
 */
import { describe, it, expect } from 'vitest';
import { dailyLifeOfferLine } from '../../src/components/new/dailyLifeLogic.js';
import { dailyLifePlaceholderFindings } from '../../src/domain/coherence/readerBattery.js';

const inst = (name, extra = {}) => ({ name, category: 'Civic', ...extra });
const MARKET = inst('Market square', { tags: ['market'] });
const TAVERN = inst('Tavern');
const WATCH = inst('Town watch');

describe('dailyLifeOfferLine — names only what the place has (R10)', () => {
  it('a place with none of the three reads the bare line', () => {
    expect(dailyLifeOfferLine({ institutions: [] }, true)).toBe('Ordinary life here in prose.');
    expect(dailyLifeOfferLine({ institutions: [] }, false)).toBe('Save this settlement to write its ordinary life in prose.');
  });

  it('a place with all three keeps the original wording byte for byte', () => {
    const s = { institutions: [MARKET, TAVERN, WATCH] };
    expect(dailyLifeOfferLine(s, true)).toBe('Ordinary life here in prose: dawn, the market, the tavern, the watch.');
    expect(dailyLifeOfferLine(s, false)).toBe('Save this settlement to write its ordinary life in prose: dawn, the market, the tavern, the watch.');
  });

  it('names each present item and only those', () => {
    expect(dailyLifeOfferLine({ institutions: [TAVERN] }, true)).toBe('Ordinary life here in prose: dawn, the tavern.');
    expect(dailyLifeOfferLine({ institutions: [MARKET, WATCH] }, true)).toBe('Ordinary life here in prose: dawn, the market, the watch.');
  });

  it('a ruined tavern is not a tavern (the live roster)', () => {
    expect(dailyLifeOfferLine({ institutions: [inst('Tavern', { status: 'ruined', ruined: true })] }, true))
      .toBe('Ordinary life here in prose.');
  });

  it('the placeholder instrument reads 0 on the line for a place that lacks them', () => {
    const s = { institutions: [TAVERN] };
    expect(dailyLifePlaceholderFindings(s, { daily_life: dailyLifeOfferLine(s, true) })).toEqual([]);
  });
});
