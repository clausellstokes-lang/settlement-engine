/**
 * settlementThreatVocabulary.test.js — cycle-3 Wave 2, H1 pin.
 *
 * THE BUG (H1). The shared threat-display helper (src/components/map/
 * settlementThreat.js) carried a dead 'embattled' arm no producer emits, and was
 * MISSING the 'heartland' arm resolveConfig commonly emits (~a third of default
 * random settlements). Both threat surfaces (DossierHeaderRow, SettlementPalette)
 * suppressed only 'frontier' (`!== 'frontier'`), so a heartland settlement —
 * the CALMEST tier — fell through and rendered a broken raw "HEARTLAND" chip.
 *
 * THE FIX. The display vocabulary is now EXACTLY the canonical producer set
 * {heartland, frontier, plagued} (src/data/monsterThreat.js MONSTER_THREAT_TIERS),
 * and isCalmThreat suppresses BOTH calm baselines (frontier + heartland). The
 * vocabularyTotality walker enforces the key-set correspondence structurally;
 * this pin asserts the exact H1 symptom is closed.
 */
import { describe, it, expect } from 'vitest';
import { threatDisplay, isCalmThreat } from '../../src/components/map/settlementThreat.js';
import { MONSTER_THREAT_TIERS } from '../../src/data/monsterThreat.js';

describe('H1 — settlement threat display vocabulary', () => {
  it('the dead "embattled" arm is gone (no producer ever emitted it)', () => {
    // BEFORE the fix this returned a non-null {label:'Embattled',...} arm.
    expect(threatDisplay('embattled')).toBeNull();
  });

  it('the previously-missing "heartland" arm is present', () => {
    const arm = threatDisplay('heartland');
    expect(arm).toBeTruthy();
    expect(arm.label).toBe('Heartland');
  });

  it('every canonical producer tier has a display arm, and ONLY those', () => {
    // Both directions: no producer tier lacks an arm, no arm lacks a producer.
    for (const tier of MONSTER_THREAT_TIERS) {
      expect(threatDisplay(tier), `producer tier "${tier}" must have a display arm`).toBeTruthy();
    }
    // The dead arm and any legacy alias resolve to nothing.
    for (const dead of ['embattled', 'safe', 'civilized', 'low', 'medium', 'high']) {
      expect(threatDisplay(dead), `"${dead}" must not have a display arm`).toBeNull();
    }
  });

  it('isCalmThreat suppresses BOTH calm baselines (frontier + heartland) but not plagued', () => {
    expect(isCalmThreat('heartland')).toBe(true); // the H1 fix — was rendered raw before
    expect(isCalmThreat('frontier')).toBe(true);
    expect(isCalmThreat('plagued')).toBe(false);
    expect(isCalmThreat('embattled')).toBe(false);
    expect(isCalmThreat(undefined)).toBe(false);
  });
});
