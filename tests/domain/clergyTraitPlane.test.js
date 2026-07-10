/**
 * clergyTraitPlane.test.js — the W-F3 clergy-lens per-trait plane projection (the
 * owner's 61f935fb refinement): each temperament/flaw carries a lean on BOTH axes;
 * conflicting traits read as VARIANCE not a bland mean; influence-weighted by orgPower;
 * trait-neutral / unflawed clergy = EXACT zero. Also pins the corruption-plane pressure
 * seam (onsetHazard/captureAdvanceChance pressureMult) is byte-neutral at 1.0 and
 * tilts the rate in the designed direction.
 */
import { describe, it, expect } from 'vitest';
import { npcTraitPlane, readClergyPlane, TRAIT_PLANE } from '../../src/domain/worldPulse/clergyTraitPlane.js';
import { onsetHazard, captureAdvanceChance } from '../../src/domain/corruption.js';
import { corruptionPlaneMult } from '../../src/domain/worldPulse/piety.js';

describe('per-trait plane projection', () => {
  it('maps conscience vs malice onto the evil axis, order vs disorder onto the chaos axis', () => {
    expect(npcTraitPlane({ personality: { flaw: 'cruel' } }).e).toBeGreaterThan(0);        // evil-leaning
    expect(npcTraitPlane({ personality: { dominant: 'compassionate' } }).e).toBeLessThan(0); // good-leaning
    expect(npcTraitPlane({ personality: { flaw: 'reckless' } }).c).toBeGreaterThan(0);      // chaotic method
    expect(npcTraitPlane({ personality: { dominant: 'disciplined' } }).c).toBeLessThan(0);  // lawful method
  });
  it('conflicting traits raise SPREAD even as the signed sums cancel (variance, not a bland zero)', () => {
    const conflicted = npcTraitPlane({ personality: { dominant: 'compassionate', flaw: 'corrupt' } });
    expect(conflicted.spread).toBeGreaterThan(0.5);   // both leans present…
    expect(Math.abs(conflicted.e)).toBeLessThan(conflicted.spread);  // …but partially cancel in the net
  });
  it('every table entry is bounded |x| ≤ 1', () => {
    for (const { e, c } of Object.values(TRAIT_PLANE)) {
      expect(Math.abs(e)).toBeLessThanOrEqual(1);
      expect(Math.abs(c)).toBeLessThanOrEqual(1);
    }
  });
});

describe('readClergyPlane — influence-weighted, variance-preserving', () => {
  const clergyFaction = { id: 'temple', archetype: 'religious' };
  const npc = (importance, personality) => ({ importance, personality, linkedFactionIds: ['temple'] });

  it('a corrupt high priest taints the reading; a minor acolyte carries no weight', () => {
    const s = {
      powerStructure: { factions: [clergyFaction] },
      npcs: [npc('pillar', { dominant: 'ruthless', flaw: 'corrupt' }), npc('minor', { dominant: 'compassionate' })],
    };
    const r = readClergyPlane(s);
    expect(r.weight).toBeGreaterThan(0);
    expect(r.taint).toBeGreaterThan(0);
    expect(r.e).toBeGreaterThan(0);          // the weighted priesthood reads evil-leaning
  });

  it('a divided priesthood (opposed leads) reads high variance', () => {
    const s = {
      powerStructure: { factions: [clergyFaction] },
      npcs: [npc('pillar', { dominant: 'cruel' }), npc('pillar', { dominant: 'compassionate' })],
    };
    expect(readClergyPlane(s).variance).toBeGreaterThan(0);
  });

  it('a clean, unflawed priesthood reads EXACT zero taint (neutrality anchor)', () => {
    const s = { powerStructure: { factions: [clergyFaction] }, npcs: [npc('key', { dominant: 'principled' })] };
    const r = readClergyPlane(s);
    expect(r.taint).toBe(0);
    expect(r.revealedTaint).toBe(0);
  });
});

describe('corruption-plane pressure seam — byte-neutral at 1.0, tilts in the designed direction', () => {
  it('onsetHazard/captureAdvanceChance are byte-identical when pressureMult defaults to 1', () => {
    const base = { crime: 0.4, security: 0.5, prosperity: 0.5 };
    expect(onsetHazard(base)).toBe(onsetHazard({ ...base, pressureMult: 1 }));
    expect(captureAdvanceChance({ rank: 2 })).toBe(captureAdvanceChance({ rank: 2, pressureMult: 1 }));
  });
  it('a devout chaotic-evil patron raises the onset rate; a lawful-good one starves it', () => {
    const climate = { crime: 0.3, security: 0.5, prosperity: 0.5 };
    const ceMult = corruptionPlaneMult({ alignmentAxis: 'evil', lawAxis: 'chaotic' }, 0.6);
    const lgMult = corruptionPlaneMult({ alignmentAxis: 'good', lawAxis: 'lawful' }, 0.6);
    const baseRate = onsetHazard(climate);
    expect(onsetHazard({ ...climate, pressureMult: ceMult })).toBeGreaterThan(baseRate);
    expect(onsetHazard({ ...climate, pressureMult: lgMult })).toBeLessThan(baseRate);
  });
});
