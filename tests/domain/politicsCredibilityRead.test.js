/**
 * politicsCredibilityRead.test.js — domain-display-readmodels-4 (residue): the
 * politics-bloc + credibility read-model siblings. The engine's most dramatic new
 * state — covert conspiracies against a seat, the Blainey credibility stock — was
 * invisible display-side. These pin the DM-readable projections + the dormancy
 * (empty when the ledger is absent ⇒ byte-identical off-state).
 */
import { describe, it, expect } from 'vitest';
import {
  settlementBlocs, realmPolitics, hasPolitics, campaignHasPolitics, blocStrainBand,
} from '../../src/domain/display/politicsRead.js';
import {
  settlementCredibility, realmCredibility, hasCredibility, campaignHasCredibility, credibilityBand,
} from '../../src/domain/display/credibilityRead.js';

// ── politics blocs / conspiracies ───────────────────────────────────────────

function worldWithBlocs() {
  return { politicsLedgers: { s1: { blocs: [
    { id: 'b1', members: ['The Guildhall', 'The Docks'], glue: [{ type: 'commerce', detail: 'x' }], end: 'commerce', strain: 0.5, sinceTick: 3 },
    { id: 'c1', members: ['The Whispered Court'], glue: [{ type: 'threat', detail: 'y' }], end: 'seats', strain: 0.2, sinceTick: 4, covert: true },
  ] } } };
}

describe('politicsRead — blocs + conspiracies', () => {
  it('DORMANT: no politicsLedgers ⇒ null / [] / false (byte-identical off-state)', () => {
    expect(settlementBlocs({ worldState: {}, settlementId: 's1' })).toBeNull();
    expect(realmPolitics({ worldState: null })).toEqual([]);
    expect(hasPolitics({})).toBe(false);
  });

  it('the player view (includeCovert default false) hides the conspiracy', () => {
    const view = settlementBlocs({ worldState: worldWithBlocs(), settlementId: 's1' });
    expect(view.blocCount).toBe(1);
    expect(view.conspiracyCount).toBe(0);
    expect(view.blocs.every(b => !b.covert)).toBe(true);
  });

  it('the DM view (includeCovert true) surfaces the conspiracy as a quiet faction', () => {
    const view = settlementBlocs({ worldState: worldWithBlocs(), settlementId: 's1', includeCovert: true });
    expect(view.conspiracyCount).toBe(1);
    const conspiracy = view.blocs.find(b => b.kind === 'conspiracy');
    expect(conspiracy.covert).toBe(true);
    expect(conspiracy.presence).toMatch(/quiet faction/i);
  });

  it('includeGroundTruth adds the raw strain/end/glue truth block', () => {
    const view = settlementBlocs({ worldState: worldWithBlocs(), settlementId: 's1', includeGroundTruth: true });
    expect(view.blocs[0].truth).toBeTruthy();
    expect(view.blocs[0].truth.end).toBe('commerce');
  });

  it('presence gates + realm view', () => {
    const ws = worldWithBlocs();
    expect(hasPolitics(ws)).toBe(true);
    expect(realmPolitics({ worldState: ws, includeCovert: true })).toHaveLength(1);
    expect(campaignHasPolitics([{ settlementIds: ['s1'], worldState: ws }], 's1')).toBe(true);
    expect(campaignHasPolitics([{ settlementIds: ['other'], worldState: ws }], 's1')).toBe(false);
  });

  it('strain bands are ordered', () => {
    expect(blocStrainBand(0)).toBe(0);
    expect(blocStrainBand(0.5)).toBe(1);
    expect(blocStrainBand(0.8)).toBe(2);
  });
});

// ── credibility ─────────────────────────────────────────────────────────────

function worldWithCredibility(score = 8) {
  return { spatialLedgers: { credibility: { s1: { score, lastUpdateTick: 5, holder: 'people_held' } } } };
}

describe('credibilityRead — the Blainey stock', () => {
  it('DORMANT: no credibility ledger ⇒ null / [] / false (byte-identical off-state)', () => {
    expect(settlementCredibility({ worldState: {}, settlementId: 's1' })).toBeNull();
    expect(realmCredibility({ worldState: null })).toEqual([]);
    expect(hasCredibility({})).toBe(false);
  });

  it('a trusted settlement bands high with in-fiction presence', () => {
    const view = settlementCredibility({ worldState: worldWithCredibility(8), settlementId: 's1', tick: 5 });
    expect(view).toBeTruthy();
    expect(view.band).toBeGreaterThanOrEqual(2);
    expect(typeof view.reputation).toBe('string');
    expect(view.presence.length).toBeGreaterThan(0);
  });

  it('a discredited settlement bands low', () => {
    const view = settlementCredibility({ worldState: worldWithCredibility(-9), settlementId: 's1', tick: 5 });
    expect(view.band).toBe(0);
    expect(view.reputation).toBe('discredited');
  });

  it('includeGroundTruth adds the raw score/weight/discount', () => {
    const view = settlementCredibility({ worldState: worldWithCredibility(8), settlementId: 's1', tick: 5, includeGroundTruth: true });
    expect(view.truth).toBeTruthy();
    expect(typeof view.truth.score).toBe('number');
    expect(typeof view.truth.discount).toBe('number');
  });

  it('presence gates + realm view', () => {
    const ws = worldWithCredibility(8);
    expect(hasCredibility(ws)).toBe(true);
    expect(realmCredibility({ worldState: ws, tick: 5 })).toHaveLength(1);
    expect(campaignHasCredibility([{ settlementIds: ['s1'], worldState: ws }], 's1')).toBe(true);
  });

  it('credibility bands are ordered across the signed range', () => {
    expect(credibilityBand(-12)).toBe(0);
    expect(credibilityBand(0)).toBe(1);
    expect(credibilityBand(3)).toBe(2);
    expect(credibilityBand(12)).toBe(3);
  });
});
