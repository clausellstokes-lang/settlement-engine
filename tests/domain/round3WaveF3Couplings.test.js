/**
 * round3WaveF3Couplings.test.js — the LIT direction pins for Round 3 wave F3 (the missing
 * couplings built DARK). Each build's DARK byte-identity is proven by its family's dormancy
 * golden (traditions / npcLadder / generosity / upswing / npcGrowth / migrationRumors /
 * corruptionWeb / settlementPolitics); THESE pins prove the coupling FIRES in the designed
 * direction when its flag is lit — and that the dark default contributes exactly nothing.
 *
 * Covered here: coherence-11 (faction_captured window), coherence-14 (bloc_backed window),
 * coherence-13 (economicAdj into the coup verdict), coherence-15 (migration corruption push),
 * coherence-16 (reconstruction-skim onset amplifier), D-7e(i) (the generosity person-bond).
 * coherence-10 (traditions quartet 10a/10b) rides tests/domain/traditionsKernel.test.js and
 * coherence-12 (institution political control) rides tests/domain/evaluateInstitutionLifecycle.test.js
 * (they reuse those files' seeded drivers).
 */
import { describe, it, expect } from 'vitest';
import { openWindows } from '../../src/domain/worldPulse/npcLadderChallenge.js';
import { resolveCoupVerdict } from '../../src/domain/rulingPowerCoup.js';
import { migrationCorruptionPushMult } from '../../src/domain/worldPulse/migrationKernel.js';
import { skimPressureMultFor } from '../../src/domain/worldPulse/piety.js';
import { generosityEV } from '../../src/domain/spatial/generosityEV.js';

// ── openWindows fixtures (mirrors npcLadderChallenge.test.js) ──────────────────
const merchant = { name: "Merchants' Guild", category: 'merchant' };
const plainNpc = (name) => ({ name, personality: { dominant: 'shrewd', flaw: 'proud', modifier: 'bold' } });
const combatant = (nid, standing) => ({ nid, npc: plainNpc(nid), standing, stigma: false, grudgeVsDefender: 0, isChallenging: false, rungIndex: 0, rungCount: 2 });
const ctx = () => ({ faction: merchant, factionRising: false, factionFalling: false, worldState: {} });

describe('coherence-11 / coherence-14 — the political challenge windows (openWindows)', () => {
  const strong = combatant('a:d', 8); // stable, clean, performing ⇒ no baseline window

  it('DARK default: neither political window opens for a strong clean defender', () => {
    expect(openWindows(strong, ctx(), false)).toEqual([]);
  });
  it('coherence-11: factionCaptured=true opens the faction_captured window', () => {
    expect(openWindows(strong, ctx(), false, false, false, false, true)).toContain('faction_captured');
    // and does not spuriously open the bloc window
    expect(openWindows(strong, ctx(), false, false, false, false, true)).not.toContain('bloc_backed');
  });
  it('coherence-14: blocBacked=true opens the bloc_backed window', () => {
    expect(openWindows(strong, ctx(), false, false, false, false, false, true)).toContain('bloc_backed');
    expect(openWindows(strong, ctx(), false, false, false, false, false, true)).not.toContain('faction_captured');
  });
});

// ── coherence-13: economicAdj into the coup verdict (rulingPowerCoup) ───────────
function coupSettlement() {
  return {
    powerStructure: {
      publicLegitimacy: { score: 50, govMultiplier: 1.0 },
      governingName: 'The Crown',
      factions: [
        { name: 'The Crown', isGoverning: true, power: 50, archetype: 'government' },
        { name: 'The Generals', power: 50, archetype: 'military' },
      ],
    },
  };
}

describe('coherence-13 — economicAdj shifts the coup hold-chance (economicCoupReadEnabled)', () => {
  const rng = { random: () => 0.5 };
  it('economicAdj:0 is byte-identical to the dark default; +economy holds, −economy falls', () => {
    const s = coupSettlement();
    const base = resolveCoupVerdict({ settlement: s, rng, severity: 0.6 });
    const zero = resolveCoupVerdict({ settlement: s, rng, severity: 0.6, economicAdj: 0 });
    const richer = resolveCoupVerdict({ settlement: s, rng, severity: 0.6, economicAdj: 0.2 });
    const poorer = resolveCoupVerdict({ settlement: s, rng, severity: 0.6, economicAdj: -0.2 });
    expect(zero.pHold).toBe(base.pHold);
    expect(base.pHold).toBeGreaterThan(0.1);
    expect(base.pHold).toBeLessThan(0.9); // interior, so the shift is visible (not clamped)
    expect(richer.pHold).toBeGreaterThan(base.pHold);
    expect(poorer.pHold).toBeLessThan(base.pHold);
  });
});

// ── coherence-15: migration corruption push (migrationKernel) ──────────────────
describe('coherence-15 — the corruption push lowers τ only when lit', () => {
  const off = { simulationRules: {} };
  const on = { simulationRules: { migrationCorruptionPushEnabled: true } };
  it('DARK ⇒ ×1 regardless of grip; lit + grip ⇒ <1; lit + no grip ⇒ ×1', () => {
    expect(migrationCorruptionPushMult(off, { thievesGuildStrength: 0.8 })).toBe(1);
    expect(migrationCorruptionPushMult(on, { thievesGuildStrength: 0 })).toBe(1);
    expect(migrationCorruptionPushMult(on, { thievesGuildStrength: 0.8 })).toBeLessThan(1);
    // the captureState ladder floor (guild stamp absent)
    expect(migrationCorruptionPushMult(on, { powerStructure: { criminalCaptureState: 'capture' } })).toBeLessThan(1);
    expect(migrationCorruptionPushMult(on, { powerStructure: { criminalCaptureState: 'none' } })).toBe(1);
  });
});

// ── coherence-16: the reconstruction-skim onset amplifier (piety) ──────────────
describe('coherence-16 — the reconstruction skim raises onset pressure only when lit', () => {
  const skimCond = [{ id: 'condition.reconstruction_skim.5', archetype: 'custom_crisis', severity: 0.6 }];
  const off = { simulationRules: {} };
  const on = { simulationRules: { upswingHazardReadEnabled: true } };
  it('DARK ⇒ ×1; lit + skim ⇒ >1; lit + no skim ⇒ ×1', () => {
    expect(skimPressureMultFor({ settlement: { activeConditions: skimCond } }, off)).toBe(1);
    expect(skimPressureMultFor({ settlement: { activeConditions: [] } }, on)).toBe(1);
    expect(skimPressureMultFor({ settlement: { activeConditions: skimCond } }, on)).toBeGreaterThan(1);
    // the derived item.activeConditions path is read too
    expect(skimPressureMultFor({ activeConditions: skimCond }, on)).toBeGreaterThan(1);
  });
});

// ── D-7e (i): the generosity person-bond term (generosityEV) ───────────────────
const RICH_MARGIN = { reserveAboveFloor01: 0.9, granaryTrend01: 0.7, seasonalOutlook01: 0.8 };
const NO_COMMIT = { deployedArmies: 0, mobilization01: 0, warDrain01: 0 };

describe('D-7e (i) — a seat gratitude bond tilts GIVE (generosityEV seatBond01)', () => {
  it('seatBond01:0 is byte-identical to absent (dark); a positive bond raises giveScore', () => {
    const inputs = { giverId: 'a', receiverId: 'b', now: 0, bond: { kind: 'allied', strength01: 0.5 }, margin: RICH_MARGIN, commitment: NO_COMMIT };
    const absent = generosityEV(inputs);
    const none = generosityEV({ ...inputs, seatBond01: 0 });
    const bonded = generosityEV({ ...inputs, seatBond01: 0.8 });
    expect(none.giveScore).toBe(absent.giveScore);
    expect(bonded.giveScore).toBeGreaterThan(none.giveScore);
    expect(bonded.giveScore).toBeLessThanOrEqual(1); // clamp01 holds — never overturns the floor
  });
});
