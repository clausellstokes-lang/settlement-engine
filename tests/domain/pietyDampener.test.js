/**
 * pietyDampener.test.js — the W-F3 opposed-runner-up dampener (owner addenda f683c0b3
 * + the per-axis refinement a80d4bd9). The seat's megaphone is muted by opposed
 * runners-up, decomposed PER AXIS: D_law and D_moral each = opposition(axis) ×
 * closeness, summed over the next 1–2 ranked rivals. Pins:
 *   • single-deity / per-axis-kin ⇒ that axis's D exactly 0 ⇒ byte-identical;
 *   • the canonical case (LE runner-up behind a CE seat): moral/corruption channel
 *     UNDILUTED (kin on the moral axis), chaos-derived channel DAMPENED (opposed law);
 *   • the floor (megaphone never below 1 − DAMP_MAX).
 */
import { describe, it, expect } from 'vitest';
import {
  oppositionDampener, pietyRecord, corruptionPlaneMultOf, pietyLawMegaphoneOf,
  pietyMultOf, PIETY_TUNING,
} from '../../src/domain/worldPulse/piety.js';

const entry = (align, law, share, legit) => ({ snapshot: { alignmentAxis: align, lawAxis: law }, share, legitimacy: legit, standing: 'ascendant', suppressed: false });
const state = (patronRef, deities) => ({ patronRef, deities });

describe('opposition dampener — neutrality (single-deity / per-axis kin)', () => {
  it('a single-deity pantheon yields zero on BOTH axes (byte-identical)', () => {
    const d = oppositionDampener(state('p', { p: entry('evil', 'chaotic', 100, 0.8) }));
    expect(d.dLaw).toBe(0);
    expect(d.dMoral).toBe(0);
    expect(d.megaphoneCombined).toBe(1);
  });
  it('a null / empty state yields the neutral dampener', () => {
    expect(oppositionDampener(null).megaphoneCombined).toBe(1);
    expect(oppositionDampener({ patronRef: null, deities: {} }).megaphoneCombined).toBe(1);
  });
  it('a moral-KIN runner-up leaves the moral axis exactly 0 (two evil deities)', () => {
    const d = oppositionDampener(state('a', { a: entry('evil', 'chaotic', 55, 0.7), b: entry('evil', 'lawful', 45, 0.6) }));
    expect(d.dMoral).toBe(0);          // both evil ⇒ no moral opposition
    expect(d.dLaw).toBeGreaterThan(0); // chaotic vs lawful ⇒ law opposition
  });
  it('a law-KIN runner-up leaves the law axis exactly 0 (both lawful)', () => {
    const d = oppositionDampener(state('a', { a: entry('good', 'lawful', 55, 0.7), b: entry('evil', 'lawful', 45, 0.6) }));
    expect(d.dLaw).toBe(0);            // both lawful ⇒ no law opposition
    expect(d.dMoral).toBeGreaterThan(0); // good vs evil ⇒ moral opposition
  });
});

describe('opposition dampener — the canonical LE-behind-CE case', () => {
  const ce_le = state('ce', { ce: entry('evil', 'chaotic', 60, 0.7), le: entry('evil', 'lawful', 40, 0.6) });

  it('moral channel UNDILUTED, chaos/law channel DAMPENED', () => {
    const d = oppositionDampener(ce_le);
    expect(d.dMoral).toBe(0);
    expect(d.megaphoneMoral).toBe(1);        // corruption/evil channels undiluted
    expect(d.dLaw).toBeGreaterThan(0);
    expect(d.megaphoneLaw).toBeLessThan(1);  // chaos-derived channels dampened
    expect(d.megaphoneCombined).toBeLessThan(1); // the seat's overall word is muted
  });

  it('the corruption plane (moral channel) stays undiluted for a CE seat with an LE rival', () => {
    const damp = oppositionDampener(ce_le);
    const rec = pietyRecord({ authority01: 1, institutionBacking: 1, devotion01: 1, realmMult: 1, dampener: damp });
    const seat = { config: { primaryDeitySnapshot: { alignmentAxis: 'evil', lawAxis: 'chaotic' }, faithProfile: { piety: rec } } };
    // moral bleed is undiluted ⇒ the plane multiplier matches a NO-rival CE seat.
    const soloRec = pietyRecord({ authority01: 1, institutionBacking: 1, devotion01: 1, realmMult: 1, dampener: null });
    const solo = { config: { primaryDeitySnapshot: { alignmentAxis: 'evil', lawAxis: 'chaotic' }, faithProfile: { piety: soloRec } } };
    expect(corruptionPlaneMultOf(seat)).toBeCloseTo(corruptionPlaneMultOf(solo), 10);
    // but the LAW megaphone (chaos-derived sites) is dampened, and the mixed composite is muted
    expect(pietyLawMegaphoneOf(seat)).toBeLessThan(1);
    expect(pietyMultOf(seat)).toBeLessThan(pietyMultOf(solo));
  });

  it('a MORAL-opposed rival (CG behind CE) DOES dilute the corruption channel', () => {
    const ce_cg = state('ce', { ce: entry('evil', 'chaotic', 60, 0.7), cg: entry('good', 'chaotic', 40, 0.6) });
    const d = oppositionDampener(ce_cg);
    expect(d.dMoral).toBeGreaterThan(0);   // good rival opposes the evil seat's moral drive
    expect(d.dLaw).toBe(0);                // both chaotic ⇒ law kin
    const rec = pietyRecord({ authority01: 1, institutionBacking: 1, devotion01: 1, realmMult: 1, dampener: d });
    const seat = { config: { primaryDeitySnapshot: { alignmentAxis: 'evil', lawAxis: 'chaotic' }, faithProfile: { piety: rec } } };
    const soloRec = pietyRecord({ authority01: 1, institutionBacking: 1, devotion01: 1, realmMult: 1 });
    const solo = { config: { primaryDeitySnapshot: { alignmentAxis: 'evil', lawAxis: 'chaotic' }, faithProfile: { piety: soloRec } } };
    expect(corruptionPlaneMultOf(seat)).toBeLessThan(corruptionPlaneMultOf(solo));
  });
});

describe('opposition dampener — the floor (seat always steers something)', () => {
  it('each per-axis D is capped at DAMP_MAX ⇒ megaphone ≥ 1 − DAMP_MAX', () => {
    // two maximally-opposed, neck-and-neck rivals behind a fully-legitimate seat
    const d = oppositionDampener(state('a', {
      a: entry('evil', 'chaotic', 40, 0.9),
      b: entry('good', 'lawful', 39, 0.9),
      c: entry('good', 'lawful', 38, 0.9),
    }));
    expect(d.dLaw).toBeLessThanOrEqual(PIETY_TUNING.DAMP_MAX + 1e-9);
    expect(d.dMoral).toBeLessThanOrEqual(PIETY_TUNING.DAMP_MAX + 1e-9);
    expect(d.megaphoneLaw).toBeGreaterThanOrEqual(1 - PIETY_TUNING.DAMP_MAX - 1e-9);
    expect(d.megaphoneMoral).toBeGreaterThanOrEqual(1 - PIETY_TUNING.DAMP_MAX - 1e-9);
  });
});
