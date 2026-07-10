/**
 * divineMandate.test.js — the religion→governance PAYOFF. projectReligionStateOntoSettlement
 * writes config.faithProfile (patron flagged, contested, legitimacy-driven patronSecurity);
 * applyDivineMandate then PROPS or ERODES publicLegitimacy for royal/theocratic regimes,
 * feeding the coup cluster. This is what makes religious upheaval drive regime change.
 */
import { describe, it, expect } from 'vitest';
import { projectReligionStateOntoSettlement, applyDivineMandate, divineMandateStatus, nicheOf } from '../../src/domain/worldPulse/religionState.js';

const deity = (name, temper, align, rank = 'major') => ({ _deityRef: `custom:lu_${name.toLowerCase()}`, name, temperamentAxis: temper, alignmentAxis: align, rankAxis: rank });
const ref = (x) => `custom:lu_${x.toLowerCase()}`;

function stateWith(entries, patron, legitByRef = {}) {
  const deities = {};
  for (const [d, share] of entries) deities[String(d._deityRef)] = { deityRef: String(d._deityRef), snapshot: d, niche: nicheOf(d), share, standing: 'ascendant', legitimacy: legitByRef[String(d._deityRef)] ?? 0.6, suppressed: false };
  return { s: { deities, patronRef: String(patron._deityRef), capacity: 5 } };
}
const settlement = ({ government, legitimacy = 50, patron } = {}) => ({
  tier: 'city', population: 20000,
  config: { ...(patron ? { primaryDeityRef: patron._deityRef, primaryDeitySnapshot: patron } : {}) },
  powerStructure: { government, publicLegitimacy: { score: legitimacy, label: 'Stable' } },
});
const project = (govt, legit, states) => projectReligionStateOntoSettlement(settlement({ government: govt, legitimacy: legit, patron: deity('Aurum', 'peaceful', 'good') }), states, 's');

describe('projectReligionStateOntoSettlement → config.faithProfile', () => {
  it('flags the patron, share-sorts, and reads patronSecurity off legitimacy', () => {
    const A = deity('Aurum', 'peaceful', 'good'), F = deity('Faded', 'neutral', 'neutral', 'cult');
    const out = project('Theocratic Council', 50, stateWith([[A, 70], [F, 30]], A, { [ref('Aurum')]: 0.85 }));
    const fp = out.config.faithProfile;
    expect(fp.patron.name).toBe('Aurum');
    expect(fp.deities[0].isPatron).toBe(true);              // share-sorted, patron flagged
    expect(fp.contested).toBe(false);                       // lead 40 > flip margin
    expect(fp.patronSecurity).toBeGreaterThan(0.6);         // high legitimacy ⇒ secure
  });
  it('marks a contested patron with lower security', () => {
    const A = deity('Aurum', 'peaceful', 'good'), B = deity('Korl', 'warlike', 'evil');
    const fp = project('Theocratic Council', 50, stateWith([[A, 52], [B, 48]], A, { [ref('Aurum')]: 0.2 })).config.faithProfile;
    expect(fp.contested).toBe(true);                        // lead 4 < flip margin 6
    expect(fp.patronSecurity).toBeLessThan(0.3);            // contested + low legit
  });
  it('no-op when there is no state', () => {
    const s = settlement({ government: 'Theocratic Council' });
    expect(projectReligionStateOntoSettlement(s, {}, 's')).toBe(s);
  });
});

describe('applyDivineMandate → publicLegitimacy', () => {
  const A = deity('Aurum', 'peaceful', 'good');
  it('a theocracy with a secure, legitimate patron GAINS legitimacy', () => {
    const out = applyDivineMandate(project('Theocratic Council', 50, stateWith([[A, 80]], A, { [ref('Aurum')]: 0.9 })));
    expect(out.powerStructure.publicLegitimacy.score).toBeGreaterThan(50);
  });
  it('a theocracy with a CONTESTED, discredited patron LOSES legitimacy (feeds coups)', () => {
    const B = deity('Korl', 'warlike', 'evil');
    const out = applyDivineMandate(project('Theocratic Council', 50, stateWith([[A, 52], [B, 48]], A, { [ref('Aurum')]: 0.1 })));
    expect(out.powerStructure.publicLegitimacy.score).toBeLessThan(50);
  });
  it('a republic / council carries NO divine mandate (identity no-op)', () => {
    const projected = project('Merchant Council', 50, stateWith([[A, 80]], A, { [ref('Aurum')]: 0.9 }));
    expect(applyDivineMandate(projected)).toBe(projected);
  });
  it('a deity-free / faith-profile-less settlement is a no-op', () => {
    const s = settlement({ government: 'Theocratic Council' });
    expect(applyDivineMandate(s)).toBe(s);
  });
  it('is bounded per tick (never swings more than the step clamp)', () => {
    const out = applyDivineMandate(project('Theocratic Council', 20, stateWith([[A, 95]], A, { [ref('Aurum')]: 0.95 })));
    expect(out.powerStructure.publicLegitimacy.score - 20).toBeLessThanOrEqual(2);
  });
});

describe('divineMandateStatus — player-safe phrasing', () => {
  const A = deity('Aurum', 'peaceful', 'good');
  it('a secure patron props; a contested one weakens; no mandate ⇒ null', () => {
    const secure = project('Theocratic Council', 50, stateWith([[A, 90]], A, { [ref('Aurum')]: 0.9 }));
    expect(divineMandateStatus(secure).propping).toBe(true);
    const B = deity('Korl', 'warlike', 'evil');
    const contested = project('Theocratic Council', 50, stateWith([[A, 52], [B, 48]], A, { [ref('Aurum')]: 0.15 }));
    expect(divineMandateStatus(contested).propping).toBe(false);
    expect(divineMandateStatus(project('Merchant Council', 50, stateWith([[A, 90]], A)))).toBeNull();
  });
});
