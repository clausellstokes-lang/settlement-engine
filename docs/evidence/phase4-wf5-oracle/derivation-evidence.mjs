/**
 * docs/evidence/phase4-wf5-oracle/derivation-evidence.mjs
 *
 * Reproducible field-level evidence for W-F5 STAGE 1 (AXIS RETIREMENT).
 *
 * The change: dropped `deityTemper`'s stored-value short-circuit in
 * src/domain/worldPulse/deityAxes.js. Temper is now DERIVED from the two alignment
 * axes (evil01, chaos01) for EVERY deity; the stored `temperamentAxis` field is
 * inert to every engine temper read.
 *
 * This script imports the ACTUAL engine leaves (deityAxes, cultImpositionApply,
 * disposition) and emits:
 *   1. the full 3×3 alignment×law derivation matrix (proving temper = f(alignment),
 *      law-independent under the current TEMPER_DERIVATION weights),
 *   2. per-fixture BEFORE (stored short-circuit) vs AFTER (derived) attribution for
 *      every deity input in the shifted oracle-pending fixtures,
 *   3. the "exactly-the-derivation" class assertion — every AFTER value equals
 *      deriveTemper(evil01, chaos01), so nothing shifts except the derivation,
 *   4. the deity-free identity anchor (an absent deity ⇒ undefined ⇒ no temper term).
 *
 * Run:  node docs/evidence/phase4-wf5-oracle/derivation-evidence.mjs
 */

import { deityTemper, deriveTemper, evil01, chaos01, TEMPER_DERIVATION } from '../../../src/domain/worldPulse/deityAxes.js';
import { nicheOf } from '../../../src/domain/worldPulse/cultImpositionApply.js';
import { DEITY_TEMPER_SIGN } from '../../../src/domain/worldPulse/disposition.js';

const ALIGNMENTS = ['good', 'neutral', 'evil'];
const LAWS = ['lawful', 'neutral', 'chaotic'];

/** BEFORE the retirement: the short-circuit returned the stored value verbatim. */
const storedTemper = (d) => (d && d.temperamentAxis != null ? d.temperamentAxis : deityTemper(d));
/** BEFORE niche, as cultImpositionApply.nicheOf computed it off the stored short-circuit. */
const storedNiche = (d) => `${storedTemper(d) || 'neutral'}:${d?.alignmentAxis || 'neutral'}`;
/** Disposition drive sign (warlike +1 / peacelike −1 / neutral 0). */
const driveSign = (t) => (DEITY_TEMPER_SIGN[t] ?? 0);

// ── 1. Derivation matrix — temper = deriveTemper(evil01, chaos01) over all combos.
const matrix = [];
for (const alignmentAxis of ALIGNMENTS) {
  for (const lawAxis of LAWS) {
    const d = { alignmentAxis, lawAxis };
    matrix.push({
      alignmentAxis, lawAxis,
      evil01: evil01(d), chaos01: chaos01(d),
      derivedTemper: deriveTemper(evil01(d), chaos01(d)),
      viaDeityTemper: deityTemper(d),
    });
  }
}
// Prove law-independence: for a fixed alignment, the derived temper is identical
// across all three law values (0.3·0.5 = 0.15 = THRESHOLD, never exceeds it).
const lawIndependent = ALIGNMENTS.every((a) => {
  const tempers = new Set(LAWS.map((l) => deityTemper({ alignmentAxis: a, lawAxis: l })));
  return tempers.size === 1;
});

// ── 2. Per-fixture attribution — the exact deity inputs in the shifted fixtures.
// (Values transcribed from the fixtures; recomputed here against the live engine.)
const fixtures = [
  {
    file: 'tests/domain/religionCorruption.test.js:27  (OQ22 WARLIKE)',
    deity: { name: 'Kaor', alignmentAxis: 'neutral', temperamentAxis: 'warlike', rankAxis: 'major' },
    downstream: 'disposition.deityTemperDrive → aggressiveness',
  },
  {
    file: 'tests/domain/religionCorruption.test.js:28  (OQ22 PEACELIKE)',
    deity: { name: 'Serel', alignmentAxis: 'neutral', temperamentAxis: 'peacelike', rankAxis: 'major' },
    downstream: 'disposition.deityTemperDrive → aggressiveness',
  },
  {
    file: 'tests/domain/crisisConversion.test.js:63  (incumbent "Faded")',
    deity: { name: 'Faded', alignmentAxis: 'neutral', temperamentAxis: 'peacelike', lawAxis: 'neutral', rankAxis: 'cult' },
    downstream: 'nicheOf → coexistence vs same-niche contest',
  },
  {
    file: 'tests/domain/crisisConversion.test.js:62  (source "Storm", control — NO shift)',
    deity: { name: 'Storm', alignmentAxis: 'neutral', temperamentAxis: 'neutral', lawAxis: 'chaotic', rankAxis: 'minor' },
    downstream: 'nicheOf (control — stored == derived)',
  },
];

const attribution = fixtures.map((f) => {
  const before = storedTemper(f.deity);
  const after = deityTemper(f.deity);
  const exact = after === deriveTemper(evil01(f.deity), chaos01(f.deity));
  return {
    file: f.file,
    deity: `${f.deity.name} (align=${f.deity.alignmentAxis}, law=${f.deity.lawAxis ?? 'absent'}, stored temper=${f.deity.temperamentAxis})`,
    temperBefore: before,
    temperAfter: after,
    shifted: before !== after,
    nicheBefore: storedNiche(f.deity),
    nicheAfter: nicheOf(f.deity),
    driveSignBefore: driveSign(before),
    driveSignAfter: driveSign(after),
    exactlyTheDerivation: exact,
    downstream: f.downstream,
  };
});

// ── 3. "Exactly-the-derivation" class assertion.
const allExact = attribution.every((a) => a.exactlyTheDerivation);
const onlyNeutralAlignmentShifts = attribution
  .filter((a) => a.shifted)
  .every((a) => /align=neutral/.test(a.deity)); // every shift is a neutral-alignment deity carrying a decoupled stored temper

// ── 4. Deity-free identity anchor.
const deityFree = {
  deityTemperNull: deityTemper(null),           // undefined
  deityTemperUndefined: deityTemper(undefined), // undefined
  driveSignForAbsent: driveSign(deityTemper(null) ?? 'neutral'), // 0 — no temper term
};

const out = {
  change: 'W-F5 STAGE 1 — dropped deityTemper stored-value short-circuit (temper now derived from evil01/chaos01)',
  TEMPER_DERIVATION,
  derivationMatrix: matrix,
  lawIndependent,
  perFixtureAttribution: attribution,
  exactlyTheDerivationClass: { allShiftsAreDerivation: allExact, everyShiftIsNeutralAlignmentDecoupled: onlyNeutralAlignmentShifts },
  deityFreeIdentityAnchor: deityFree,
};

console.log(JSON.stringify(out, null, 2));
