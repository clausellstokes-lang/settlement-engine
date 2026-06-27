/**
 * divineMandate.test.js — pantheon projection (config.faithProfile) + the divine-mandate
 * legitimacy coupling (royal/authoritative regimes lean on the chief deity + religious
 * authority; a secure kindred chief props legitimacy, a contested chief erodes it).
 */
import { describe, it, expect } from 'vitest';
import { projectReligionStateOntoSettlement, applyDivineMandate, nicheOf } from '../../src/domain/worldPulse/religionState.js';

const deity = (name, temper, align, rank = 'major') => ({ _deityRef: `custom:lu_${name.toLowerCase()}`, name, temperamentAxis: temper, alignmentAxis: align, rankAxis: rank });
const ref = (x) => `custom:lu_${x.toLowerCase()}`;

function stateWith(entries, chiefRef) {
  const deities = {};
  for (const [d, share] of entries) deities[String(d._deityRef)] = { deityRef: String(d._deityRef), snapshot: d, niche: nicheOf(d), share, standing: 'ascendant', suppressed: false };
  return { [`s`]: { deities, chiefRef: String(chiefRef._deityRef), capacity: 5 } };
}
function settlement({ government, legitimacy = 50, chief } = {}) {
  return {
    tier: 'city', population: 20000,
    config: { ...(chief ? { primaryDeityRef: chief._deityRef, primaryDeitySnapshot: chief } : {}) },
    powerStructure: { government, publicLegitimacy: { score: legitimacy, label: 'Stable' } },
  };
}

describe('projectReligionStateOntoSettlement', () => {
  it('writes config.faithProfile (share-sorted, chief flagged, contested)', () => {
    const A = deity('Aurum', 'peaceful', 'good'), F = deity('Faded', 'neutral', 'neutral', 'cult');
    const states = stateWith([[A, 70], [F, 30]], A);
    const out = projectReligionStateOntoSettlement(settlement(), states, 's');
    const fp = out.config.faithProfile;
    expect(fp.chief.name).toBe('Aurum');
    expect(fp.deities[0].name).toBe('Aurum');                 // share-sorted
    expect(fp.deities[0].isChief).toBe(true);
    expect(fp.contested).toBe(false);                          // 70 vs 30, lead 40 > flip margin
    expect(fp.chiefSecurity).toBeGreaterThan(0.5);
  });
  it('marks a contested chief + lower security', () => {
    const A = deity('Aurum', 'peaceful', 'good'), B = deity('Korl', 'warlike', 'evil');
    const states = stateWith([[A, 52], [B, 48]], A);          // lead 4 < flip margin 6
    const fp = projectReligionStateOntoSettlement(settlement(), states, 's').config.faithProfile;
    expect(fp.contested).toBe(true);
    expect(fp.chiefSecurity).toBeLessThan(0.4);
  });
  it('no-op when there is no state', () => {
    const s = settlement();
    expect(projectReligionStateOntoSettlement(s, {}, 's')).toBe(s);
  });
});

describe('applyDivineMandate', () => {
  const A = deity('Aurum', 'peaceful', 'good');
  const states = (entries, chief) => stateWith(entries, chief);
  const withProfile = (govt, legitimacy, st) => projectReligionStateOntoSettlement(settlement({ government: govt, legitimacy, chief: st === undefined ? A : st }), st === undefined ? states([[A, 80]], A) : st, 's');

  it('a theocracy with a secure chief gains legitimacy', () => {
    const before = settlement({ government: 'theocracy', legitimacy: 50, chief: A });
    const projected = projectReligionStateOntoSettlement(before, states([[A, 85]], A), 's');
    const after = applyDivineMandate(projected);
    expect(after.powerStructure.publicLegitimacy.score).toBeGreaterThan(50);
  });
  it('a theocracy with a CONTESTED chief loses legitimacy (feeds coups)', () => {
    const B = deity('Korl', 'warlike', 'evil');
    const before = settlement({ government: 'theocracy', legitimacy: 50, chief: A });
    const projected = projectReligionStateOntoSettlement(before, states([[A, 52], [B, 48]], A), 's');
    const after = applyDivineMandate(projected);
    expect(after.powerStructure.publicLegitimacy.score).toBeLessThan(50);
  });
  it('a merchant council gets NO divine mandate (identity)', () => {
    const before = settlement({ government: 'Merchant council', legitimacy: 50, chief: A });
    const projected = projectReligionStateOntoSettlement(before, states([[A, 85]], A), 's');
    expect(applyDivineMandate(projected)).toBe(projected);
  });
  it('a kindred chief props a despot more than a mismatched one (fit modulates, never punishes)', () => {
    const warEvil = deity('Korl', 'warlike', 'evil');
    const peaceGood = deity('Aurum', 'peaceful', 'good');
    const kindred = applyDivineMandate(projectReligionStateOntoSettlement(settlement({ government: 'despotate', legitimacy: 50, chief: warEvil }), states([[warEvil, 85]], warEvil), 's'));
    const mismatch = applyDivineMandate(projectReligionStateOntoSettlement(settlement({ government: 'despotate', legitimacy: 50, chief: peaceGood }), states([[peaceGood, 85]], peaceGood), 's'));
    expect(kindred.powerStructure.publicLegitimacy.score).toBeGreaterThan(mismatch.powerStructure.publicLegitimacy.score);
    expect(mismatch.powerStructure.publicLegitimacy.score).toBeGreaterThanOrEqual(50);   // mismatch still props (never punishes a secure chief)
  });
});
