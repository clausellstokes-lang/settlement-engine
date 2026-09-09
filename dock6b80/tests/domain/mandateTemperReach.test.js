/**
 * mandateTemperReach.test.js — W-FAITH F3c act 3: the two §866 docket rows.
 *
 *   ROW 1 — `mandateAlignmentFit`'s `'peaceful'` typo, at BOTH its sites. The branches
 *     were unreachable, so a peacelike patron never took the despot penalty nor the
 *     monarchy bonus. This file pins WHY one spelling is the whole cure — `deityTemper`
 *     cannot answer `'peaceful'` on either arm — and pins the behavioural consequence
 *     that the cure restores.
 *
 *   ROW 2 — §851's per-deity PRECEDENCE law: a deity carrying authored boon/bane reads
 *     THOSE and its legacy `domain` arm goes silent for that deity; a deity carrying
 *     only the legacy domain keeps its unchanged arm (THE PROMISE).
 *
 * ⚠ ROW 1 IS A DECLARED BEHAVIOUR CHANGE ON EXISTING SEEDS, not a latent one. It is
 * measured here rather than asserted: see the equilibrium arm below.
 */
import { describe, test, expect } from 'vitest';
import { deityTemper, deriveTemper, TEMPER_WORDS } from '../../src/domain/worldPulse/deityAxes.js';
import { applyDivineMandate } from '../../src/domain/worldPulse/religionState.js';
import { deityPressureOf } from '../../src/domain/worldPulse/dispositionProfile.js';

/** A settlement whose mandate can be driven to its fixpoint. */
function mandateTown({ deity, government, patronSecurity = 1, score = 50 }) {
  return {
    id: 's.mandate',
    config: { primaryDeitySnapshot: deity, faithProfile: { patronSecurity } },
    powerStructure: { government, publicLegitimacy: { score } },
  };
}

/**
 * The mandate pulls legitimacy toward a target, clamped to ±2 a tick and ROUNDED to an
 * integer — so a single tick rounds away any fit difference smaller than about one
 * point of target. The equilibrium is where a change in `fit` actually lives, and
 * measuring one step instead of the fixpoint is how this car first mis-measured its own
 * cure (the monarchy branch read as "unmoved" for exactly that reason).
 */
function mandateEquilibrium(args) {
  let s = mandateTown(args);
  for (let i = 0; i < 500; i += 1) {
    const next = applyDivineMandate(s);
    if (next === s) return s.powerStructure.publicLegitimacy.score;
    s = next;
  }
  throw new Error('the divine mandate did not settle in 500 ticks');
}

const GOOD_LAWFUL = Object.freeze({ name: 'Aurelia', rankAxis: 'major', alignmentAxis: 'good', lawAxis: 'lawful' });
const EVIL_CHAOTIC = Object.freeze({ name: 'Vharn', rankAxis: 'major', alignmentAxis: 'evil', lawAxis: 'chaotic' });
/**
 * ⚠⚠ A SECOND PEACELIKE PATRON, AND IT EXISTS BECAUSE THE OBVIOUS ONE CANNOT SEE THE CURE.
 * `GOOD_LAWFUL` derives `peacelike` and reads the monarchy branch — but its fit there
 * SATURATES: raw 1.02 uncured → 1.12 cured, and `clamp01` sends BOTH to 1.0, so its
 * equilibrium is 55 before the cure and 55 after. An arm built on it passes identically
 * against the uncured code — it witnesses nothing (§711.4: an arm that cannot discover
 * anything is a green that means less than it looks). This lane's first cut of the
 * monarchy arm did exactly that and was caught by a base-vs-tip measurement, not by a
 * red. `GOOD_CHAOTIC` derives `peacelike` too and lands clear of the clamp (0.780 →
 * 0.880), so it is the only honest witness for the `:686` branch.
 */
const GOOD_CHAOTIC = Object.freeze({ name: 'Sylwen', rankAxis: 'major', alignmentAxis: 'good', lawAxis: 'chaotic' });

describe('ROW 1a — WHY ONE SPELLING IS THE WHOLE CURE', () => {
  test('⛔ `deityTemper` can NEVER answer \'peaceful\', on either arm', () => {
    // This is the assertion that licenses a single-spelling cure. If it ever fails,
    // `mandateAlignmentFit` needs a both-spellings arm and this file is the warning.
    // anchored: the NEXT line pins TEMPER_WORDS to its exact three members
    expect(TEMPER_WORDS).not.toContain('peaceful');
    expect([...TEMPER_WORDS]).toEqual(['warlike', 'peacelike', 'neutral']);

    // The DERIVED arm, swept over its entire input space at fine grain.
    for (let evil = 0; evil <= 1.0001; evil += 0.05) {
      for (let chaos = 0; chaos <= 1.0001; chaos += 0.05) {
        expect(TEMPER_WORDS).toContain(deriveTemper(evil, chaos));
      }
    }
    // The AUTHORED arm: a word outside the closed set falls through to the derivation
    // rather than being returned, so no authored spelling can leak either.
    for (const authoredTemper of ['peaceful', 'PEACELIKE', 'calm', '', 'warlike ']) {
      const answer = deityTemper({ ...GOOD_LAWFUL, authoredTemper });
      expect(answer, `authoredTemper=${JSON.stringify(authoredTemper)}`).not.toBe('peaceful');
      expect(TEMPER_WORDS).toContain(answer);
    }
  });

  test('⚠ the RETIRED stored axis is where \'peaceful\' really lives — and neither arm reads it', () => {
    // `religionLegitimacy.js:54` and `religiousContest.js:132` map BOTH spellings and
    // call `'peaceful'` "the legacy stored spelling". They are right, and they are
    // reading a RAW STORED AXIS. This site reads `deityTemper`'s OUTPUT, which is why
    // copying their both-spellings idiom here would have shipped dead code wearing a
    // legacy-compatibility comment.
    const legacyStored = { ...GOOD_LAWFUL, temperamentAxis: 'peaceful' };
    expect(deityTemper(legacyStored)).toBe(deityTemper(GOOD_LAWFUL));
    expect(deityTemper(legacyStored)).toBe('peacelike');
  });

  test('a good/lawful deity DERIVES peacelike with no authoring at all — the live-today half', () => {
    // The docket row said "the day authored words exist". It is live now: this deity
    // authors nothing and still reaches both cured branches.
    // anchored: the NEXT line drives GOOD_LAWFUL through deityTemper and pins the answer
    expect(GOOD_LAWFUL).not.toHaveProperty('authoredTemper');
    expect(deityTemper(GOOD_LAWFUL)).toBe('peacelike');
  });
});

describe('ROW 1b — THE BEHAVIOUR THE CURE RESTORES (a DECLARED shift on existing seeds)', () => {
  test('a peacelike patron now LOSES the despot\'s prop it was always meant to lose', () => {
    // Base equilibrium was 52 (the −0.25 never applied); cured it is 50 — the mandate
    // stops propping a warlike regime on a peaceable god's authority.
    expect(mandateEquilibrium({ deity: GOOD_LAWFUL, government: 'Despotate' })).toBe(50);
    // The control: a warlike patron under the same despotate is UNMOVED by this cure
    // and still props hard, so the comparator is measuring the peacelike class alone.
    expect(mandateEquilibrium({ deity: EVIL_CHAOTIC, government: 'Despotate' })).toBeGreaterThan(50);
  });

  test('a peacelike patron now GAINS the monarchy bonus (the `:686` branch, which only `neutral` could reach)', () => {
    // EXACT, because only an exact value discriminates. Measured base-vs-tip against a
    // copy of this module with the two `'peacelike'` sites spelled back to `'peaceful'`:
    // this equilibrium is 53 UNCURED and 54 CURED. A `>50` assertion holds under BOTH and
    // would have shipped the vacuous arm described at GOOD_CHAOTIC above.
    expect(deityTemper(GOOD_CHAOTIC)).toBe('peacelike');
    expect(mandateEquilibrium({ deity: GOOD_CHAOTIC, government: 'Monarchy' })).toBe(54);
  });

  test('⚠ the SATURATED peacelike patron is unmoved — the cure is real but invisible at the clamp', () => {
    // Recorded, not hidden: `GOOD_LAWFUL` reaches the same cured branch and its fit is
    // already at `clamp01`'s ceiling, so the +0.1 changes nothing. This arm exists so the
    // next reader cannot mistake that 55 for evidence the cure fired.
    expect(deityTemper(GOOD_LAWFUL)).toBe('peacelike');
    expect(mandateEquilibrium({ deity: GOOD_LAWFUL, government: 'Monarchy' })).toBe(55);
    // ...and it settles level with a neutral-tempered patron, which is the branch's intent.
    expect(mandateEquilibrium({
      deity: { name: 'Mera', rankAxis: 'major', alignmentAxis: 'neutral', lawAxis: 'lawful', authoredTemper: 'neutral' },
      government: 'Monarchy',
    })).toBe(55);
  });

  test('a theocracy is untouched — its fit short-circuits to 1 before any temper is read', () => {
    expect(mandateEquilibrium({ deity: GOOD_LAWFUL, government: 'Theocracy' }))
      .toBe(mandateEquilibrium({ deity: EVIL_CHAOTIC, government: 'Theocracy' }));
  });

  test('a mandate-free government is untouched, whatever the patron', () => {
    for (const government of ['Merchant Republic', 'Council', 'Oligarchy']) {
      expect(mandateEquilibrium({ deity: GOOD_LAWFUL, government }), government).toBe(50);
    }
  });
});

describe('ROW 2 — §851: ONE ARM PER DEITY, never both', () => {
  const harvestPatron = { name: 'Demera', rankAxis: 'major', alignmentAxis: 'good', domain: 'harvest' };
  const town = (deity) => ({ id: 's.d', config: { primaryDeitySnapshot: deity } });

  test('THE PROMISE: a deity carrying ONLY the legacy domain keeps its unchanged arm', () => {
    const out = deityPressureOf(town(harvestPatron));
    expect(out.domain).toBe('harvest');
    expect(out.direction).toBe('peace');
    expect(out.thresholdFactor).not.toBe(1);
  });

  test('a deity carrying an authored BOON goes silent on its legacy domain', () => {
    const out = deityPressureOf(town({ ...harvestPatron, boonChannel: 'harvest', boonStrength: 'firm' }));
    expect(out.domain).toBeNull();
    expect(out.direction).toBe('neutral');
    expect(out.pressure).toBe(0);
    expect(out.thresholdFactor).toBe(1);
  });

  test('an authored BANE alone supersedes too — the law is about authored aspects, not about boons', () => {
    const out = deityPressureOf(town({ ...harvestPatron, baneChannel: 'sea', baneStrength: 'heavy' }));
    expect(out.domain).toBeNull();
  });

  test('⭐ the receipt TELLS THE TWO ABSENCES APART', () => {
    // "no war-moving patron" and "the patron moves war through its blessing instead"
    // are different facts, and reporting the precedence as an absence would be the
    // confusion the law exists to remove.
    const superseded = deityPressureOf(town({ ...harvestPatron, boonChannel: 'harvest', boonStrength: 'firm' })).receipt;
    const plainlyAbsent = deityPressureOf(town({ name: 'Nul', rankAxis: 'minor' })).receipt;
    expect(superseded).not.toBe(plainlyAbsent);
    expect(superseded).toMatch(/authored blessing and blight/);
    expect(plainlyAbsent).toMatch(/No supported local patron domain/);
  });

  test('a deity with an UNSUPPORTED domain does not claim a precedence that never fired', () => {
    // `moonlight` has no mechanics, so this deity was always silent here. Marking it
    // "superseded" would report a law firing where nothing was ever displaced.
    const out = deityPressureOf(town({ name: 'Sela', rankAxis: 'minor', domain: 'moonlight', boonChannel: 'learning', boonStrength: 'faint' }));
    expect(out.domain).toBeNull();
    expect(out.receipt).toMatch(/No supported local patron domain/);
  });

  test('⭐ DORMANT-BY-ABSENCE: an empty or absent aspect never supersedes', () => {
    // The whole safety argument for landing this before any content exists. An empty
    // string is not an authored aspect, and a strength without a channel is not one
    // either — otherwise a half-filled draft would silence a live domain arm.
    for (const aspects of [
      {},
      { boonChannel: '' },
      { baneChannel: '' },
      { boonChannel: '', baneChannel: '' },
      { boonStrength: 'heavy' },
      { baneStrength: 'faint' },
    ]) {
      const out = deityPressureOf(town({ ...harvestPatron, ...aspects }));
      expect(out.domain, JSON.stringify(aspects)).toBe('harvest');
    }
  });

  test('⚠ THE COLLISION THIS PREVENTS, named: `harvest` is BOTH a domain and a channel', () => {
    // Wire F4c's channels without this law and a deity authored `boon: harvest` would
    // push the war bar through deityPressureOf AND through the faith field — the same
    // intent counted twice. The precedence makes that unconstructible.
    const collided = { ...harvestPatron, boonChannel: 'harvest', boonStrength: 'heavy' };
    expect(deityPressureOf(town(collided)).pressure).toBe(0);
  });
});
