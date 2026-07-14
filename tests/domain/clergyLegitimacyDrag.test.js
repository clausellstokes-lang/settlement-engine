/**
 * tests/domain/clergyLegitimacyDrag.test.js — Phase 4 W-F4 clergy consumption (b).
 *
 * A scandalous priesthood drags the patron's legitimacy: the god's seat is only as
 * clean as the clergy who minister it (the loop that closes evil-corrupts-own-faithful
 * — an evil patron degrades its clergy, whose flaws erode the legitimacy keeping it
 * seated). Pinned on deityLegitimacyTarget:
 *  - a tainted priesthood drags legitimacy below an unflawed one;
 *  - a REVEALED scandal drags harder than a covert one of the same taint;
 *  - a HOSTILE court (ruler misaligned with the patron) amplifies the scandal; a
 *    synergistic court shields it;
 *  - an unflawed / no-clergy reading (weight 0) is EXACTLY inert ⇒ byte-identical.
 */

import { describe, it, expect } from 'vitest';
import { deityLegitimacyTarget } from '../../src/domain/worldPulse/religionLegitimacy.js';

const deity = (name, { align = 'neutral', law = 'neutral', temper = 'neutral', rank = 'minor' } = {}) => ({
  _deityRef: `custom:lu_${name.toLowerCase()}`, name, alignmentAxis: align, lawAxis: law, temperamentAxis: temper, rankAxis: rank,
});

const lensOf = ({ align = 0.5, compromise = 0, temper = 0.5 } = {}) => ({ align, compromise, temper, power: 0.6, corrupt: compromise });

const clergy = ({ taint = 0, revealedTaint = 0, weight = 1 } = {}) => ({ e: 0, c: 0, taint, variance: 0, revealedTaint, weight });

const fresh = { tenure: 0, heresyStain: 0, standing: 'cult' };

const target = ({ d, lens, clergy: cl }) => deityLegitimacyTarget({
  settlement: {}, snapshot: {}, worldState: {}, cid: 's1',
  deity: d, deityRef: d._deityRef, neighbourIds: [], entry: fresh, lens, deitySnapshotFor: () => null, clergy: cl,
});

const god = deity('Korl', { temper: 'warlike' });
const NEUTRAL_LENS = lensOf({ temper: 0.5 });

describe('clergy legitimacy drag — a scandalous priesthood erodes the seat', () => {
  it('a tainted priesthood drags legitimacy below an unflawed one', () => {
    const clean = target({ d: god, lens: NEUTRAL_LENS, clergy: clergy({ taint: 0 }) });
    const scandal = target({ d: god, lens: NEUTRAL_LENS, clergy: clergy({ taint: 0.8 }) });
    expect(scandal).toBeLessThan(clean);
  });

  it('a REVEALED scandal drags harder than a covert one of the same taint', () => {
    const covert = target({ d: god, lens: NEUTRAL_LENS, clergy: clergy({ taint: 0.8, revealedTaint: 0 }) });
    const revealed = target({ d: god, lens: NEUTRAL_LENS, clergy: clergy({ taint: 0.8, revealedTaint: 0.8 }) });
    expect(revealed).toBeLessThan(covert);
  });

  it('a HOSTILE court amplifies the scandal; a synergistic court shields it', () => {
    const warlikeRuler = lensOf({ temper: 0.9 });
    // Temper is DERIVED from the alignment/law axes now ([worldpulse-religion-trade-1] —
    // the stored temperamentAxis is retired), so the fitting/clashing pair differs on
    // evil+chaos vs good+law (which drive deriveTemper), not on the inert stored field.
    const fitting = deity('War', { align: 'evil', law: 'chaotic' });  // derives warlike ⇒ synergistic with the warlike ruler
    const clashing = deity('Peace', { align: 'good', law: 'lawful' }); // derives peacelike ⇒ hostile to the warlike ruler
    const scandal = clergy({ taint: 0.8, revealedTaint: 0.4 });
    const dragFitting = target({ d: fitting, lens: warlikeRuler, clergy: clergy({ weight: 0 }) }) - target({ d: fitting, lens: warlikeRuler, clergy: scandal });
    const dragClashing = target({ d: clashing, lens: warlikeRuler, clergy: clergy({ weight: 0 }) }) - target({ d: clashing, lens: warlikeRuler, clergy: scandal });
    expect(dragClashing).toBeGreaterThan(dragFitting);
  });

  it('BYTE-IDENTITY: an unflawed / no-clergy reading (weight 0) is exactly inert', () => {
    const noClergyArg = target({ d: god, lens: NEUTRAL_LENS, clergy: null });
    const emptyClergy = target({ d: god, lens: NEUTRAL_LENS, clergy: clergy({ weight: 0, taint: 0.9, revealedTaint: 0.9 }) });
    expect(emptyClergy).toBe(noClergyArg);
  });
});
