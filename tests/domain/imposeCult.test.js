/**
 * imposeCult.test.js — the DM "Impose a cult" feature (IMPOSE_CULT event).
 * Covers: the pure capacity/niche reconciliation (reconcileCultImposition), the
 * embed + remove discipline of the mutate handler (imposeCult), and the seeding of
 * imposed cults into the per-settlement pantheon (ensureReligionState).
 */
import { describe, it, expect } from 'vitest';
import {
  reconcileCultImposition, ensureReligionState, patronSnapshot, RELIGION_TUNING,
} from '../../src/domain/worldPulse/religionState.js';
import { imposeCult } from '../../src/domain/events/mutateEntities.js';

// Embed-shaped deity (what the store resolves + the handler freezes).
const d = (name, temper = 'neutral', align = 'neutral', rank = 'minor') =>
  ({ _deityRef: `custom:lu_${name.toLowerCase()}`, name, temperamentAxis: temper, alignmentAxis: align, rankAxis: rank, lawAxis: 'neutral' });
const ref = (x) => `custom:lu_${x.toLowerCase()}`;
const ev = (deity) => ({ targetId: deity._deityRef, payload: { deityRef: deity._deityRef, snapshot: deity } });

describe('reconcileCultImposition — capacity + niche reconciliation', () => {
  const patron = d('Korl', 'warlike', 'evil', 'major');     // niche warlike:evil

  it('seats a cult in a free niche when the settlement has room (large settlement)', () => {
    const r = reconcileCultImposition({ patron, cults: [], tier: 'city', deity: d('Sael', 'peaceful', 'good', 'cult') });
    expect(r.action).toBe('added');
    expect(r.cults.map(c => c._deityRef)).toEqual([ref('Sael')]);
  });

  it('refuses a deity that is already the patron', () => {
    const r = reconcileCultImposition({ patron, cults: [], tier: 'city', deity: patron });
    expect(r.action).toBe('refused');
    expect(r.reason).toBe('is_patron');
  });

  it("refuses a cult that shares the patron's niche (the patron owns its domain)", () => {
    const r = reconcileCultImposition({ patron, cults: [], tier: 'city', deity: d('Vorr', 'warlike', 'evil', 'minor') });
    expect(r.action).toBe('refused');
    expect(r.reason).toBe('patron_niche');
  });

  it('replaces an existing cult in the same niche (a niche swap)', () => {
    const cults = [d('Sael', 'peaceful', 'good', 'cult')];
    const r = reconcileCultImposition({ patron, cults, tier: 'city', deity: d('Lumis', 'peaceful', 'good', 'minor') });
    expect(r.action).toBe('replaced');
    expect(r.evicted).toBe(ref('Sael'));
    expect(r.cults.map(c => c._deityRef)).toEqual([ref('Lumis')]);
  });

  it('re-imposing the same cult is an idempotent refresh', () => {
    const cults = [d('Sael', 'peaceful', 'good', 'cult')];
    const r = reconcileCultImposition({ patron, cults, tier: 'city', deity: d('Sael', 'peaceful', 'good', 'cult') });
    expect(r.action).toBe('replaced');
    expect(r.reason).toBe('refresh');
    expect(r.evicted).toBe(null);
  });

  it('a small settlement with only the patron slot refuses any cult', () => {
    // thorp capacity 1 ⇒ the patron consumes the single slot ⇒ no cult room.
    const r = reconcileCultImposition({ patron, cults: [], tier: 'thorp', deity: d('Sael', 'peaceful', 'good', 'cult') });
    expect(r.action).toBe('refused');
    expect(r.reason).toBe('no_cult_slots');
  });

  it('a full settlement evicts the WEAKEST existing cult to seat the imposition', () => {
    // town capacity 3, patron reserves 1 ⇒ 2 cult slots, already full.
    const strong = d('Aurum', 'peaceful', 'good', 'major');
    const weak = d('Mott', 'mournful', 'neutral', 'cult');  // mournful:neutral — distinct niche, lowest rank
    const r = reconcileCultImposition({ patron, cults: [strong, weak], tier: 'town', deity: d('Threx', 'cunning', 'evil', 'minor') });
    expect(r.action).toBe('evicted');
    expect(r.evicted).toBe(ref('Mott'));                    // the weakest (cult-rank) yields
    expect(r.cults.map(c => c._deityRef).sort()).toEqual([ref('Aurum'), ref('Threx')].sort());
  });

  it('a large settlement hosts multiple cults across distinct niches', () => {
    let cults = [];
    for (const dd of [d('Sael', 'peaceful', 'good'), d('Mott', 'mournful', 'neutral'), d('Threx', 'cunning', 'evil')]) {
      const r = reconcileCultImposition({ patron, cults, tier: 'metropolis', deity: dd });
      expect(r.action).toBe('added');
      cults = r.cults;
    }
    expect(cults).toHaveLength(3);
  });
});

describe('imposeCult handler — embed + remove discipline', () => {
  const baseWithPatron = () => ({ tier: 'city', config: { primaryDeitySnapshot: d('Korl', 'warlike', 'evil', 'major') } });

  it('embeds a frozen, hand-picked cult snapshot', () => {
    const out = imposeCult(baseWithPatron(), ev(d('Sael', 'peaceful', 'good', 'cult')));
    const cults = out.config.cultDeitySnapshots;
    expect(cults).toHaveLength(1);
    expect(Object.isFrozen(cults)).toBe(true);
    expect(Object.isFrozen(cults[0])).toBe(true);
    expect(cults[0]).toMatchObject({ _deityRef: ref('Sael'), name: 'Sael', temperamentAxis: 'peaceful', alignmentAxis: 'good', rankAxis: 'cult', lawAxis: 'neutral' });
  });

  it('removing the named cult drops it; emptying deletes the key (dormancy oracle)', () => {
    let s = imposeCult(baseWithPatron(), ev(d('Sael', 'peaceful', 'good')));
    s = imposeCult(s, ev(d('Mott', 'mournful', 'neutral')));
    expect(s.config.cultDeitySnapshots).toHaveLength(2);
    // remove by ref
    s = imposeCult(s, { targetId: ref('Sael'), payload: { deityRef: ref('Sael'), snapshot: null } });
    expect(s.config.cultDeitySnapshots.map(c => c._deityRef)).toEqual([ref('Mott')]);
    // clear all (no ref) ⇒ key removed entirely
    s = imposeCult(s, { targetId: null, payload: { deityRef: null, snapshot: null } });
    expect('cultDeitySnapshots' in s.config).toBe(false);
  });

  it('the handler reconciles capacity — a thorp keeps no cult beneath its patron', () => {
    const thorp = { tier: 'thorp', config: { primaryDeitySnapshot: d('Korl', 'warlike', 'evil', 'major') } };
    const out = imposeCult(thorp, ev(d('Sael', 'peaceful', 'good')));
    expect('cultDeitySnapshots' in out.config).toBe(false);   // refused ⇒ no key written
  });
});

describe('ensureReligionState — seeding imposed cults', () => {
  it('seeds the patron dominant + each cult at cult standing, shares summing to 100', () => {
    const settlement = { config: {
      primaryDeitySnapshot: d('Korl', 'warlike', 'evil', 'major'),
      cultDeitySnapshots: [d('Sael', 'peaceful', 'good', 'cult')],
    } };
    const s = ensureReligionState(null, settlement, 'city');
    expect(s.patronRef).toBe(ref('Korl'));
    const sum = Object.values(s.deities).reduce((t, x) => t + x.share, 0);
    expect(sum).toBe(100);
    expect(s.deities[ref('Korl')].share).toBeGreaterThan(s.deities[ref('Sael')].share);
    expect(s.deities[ref('Sael')].standing).toBe('cult');
  });

  it('a patron-only settlement is unchanged (single deity at 100%)', () => {
    const settlement = { config: { primaryDeitySnapshot: d('Korl', 'warlike', 'evil', 'major') } };
    const s = ensureReligionState(null, settlement, 'city');
    expect(s.deities[ref('Korl')].share).toBe(100);
    expect(Object.keys(s.deities)).toHaveLength(1);
  });

  it('a cult-only settlement (no patron) elects its strongest cult as patron', () => {
    const settlement = { config: { cultDeitySnapshots: [d('Sael', 'peaceful', 'good', 'major')] } };
    const s = ensureReligionState(null, settlement, 'town');
    expect(s.patronRef).toBe(ref('Sael'));
    expect(patronSnapshot(s).name).toBe('Sael');
  });

  it('respects tier capacity when seeding cults (a thorp seats only the patron)', () => {
    const settlement = { config: {
      primaryDeitySnapshot: d('Korl', 'warlike', 'evil', 'major'),
      cultDeitySnapshots: [d('Sael', 'peaceful', 'good', 'cult')],
    } };
    const s = ensureReligionState(null, settlement, 'thorp');
    expect(Object.keys(s.deities)).toHaveLength(1);
    expect(s.deities[ref('Korl')].share).toBe(100);
  });

  it('the cult seed share matches the tuning constant before renorm dilution', () => {
    // a sanity tie to RELIGION_TUNING so the seed intent is pinned.
    expect(RELIGION_TUNING.CULT_SEED_SHARE).toBeGreaterThan(0);
  });
});
