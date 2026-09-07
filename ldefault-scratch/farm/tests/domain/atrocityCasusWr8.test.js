/**
 * atrocityCasusWr8.test.js — WR-8 / CR-WR8-C: THE SIXTEENTH CASUS PAIR.
 *
 * `atrocity_answer` ↔ `atrocity_atoned` is the one piece amendment R claimed
 * "already exists" and did not: the 2026-08-02 self-audit measured a thirteen-cause
 * taxonomy with no atrocity or moral-outrage entry, walker-enforced for totality AND
 * bijection, so the razing's whole moral ledger had nothing to hang off. The chair
 * ruled the spelling (CR-WR8-C) and this file is the proof that the pair landed
 * WHOLE rather than as a name in a list.
 *
 * WHAT THIS FILE IS FOR, and what it deliberately is NOT. The totality walkers in
 * warReasons.test.js / warReasonsPredationFaith.test.js / warTermination.test.js
 * already prove the pair is registered everywhere the taxonomy is enforced — this
 * file does not duplicate them. It proves the three things a registration can get
 * WRONG while every totality walker stays green:
 *
 *   1. THE DECAY BAND IS THE MECHANISM, not decoration. A casus minted from a fixed
 *      past fact burns forever unless something makes it fade, so the band is pinned
 *      from both ends: fresh outrage scores high, band-aged outrage scores ZERO, and
 *      the curve between them is monotone. A scorer that ignored `tick` entirely
 *      would pass every totality walker and fail here.
 *   2. IT MINTS ON THE BELIEVED FACT AND ON NOTHING ELSE. The scorer takes a list of
 *      razings and an accused id; a razing by SOMEBODY ELSE must score zero, or the
 *      casus is a general-purpose outrage rather than a directed cause.
 *   3. THE DECREE DOOR IS SHUT. `atrocity_answer` must NOT be DM-declarable —
 *      decreeing it would manufacture a razing, and through R2's license machinery a
 *      warrant to burn a city. This is the sharpest of the three and the one nobody
 *      would notice was missing.
 *
 * NOT YET PRODUCED, and said plainly rather than implied: R's razing writer does not
 * exist, so nothing feeds these scorers in the live pulse today. That is the same
 * registration-first seam `treaty_default` and `corruption_exposed` have held since
 * W-PEACE-1, and the LAST test here pins the consequence that matters — with no
 * producer, the lit pulse mints no atrocity record, so the pair is byte-neutral.
 */
import { describe, expect, it } from 'vitest';
import {
  ATROCITY_CASUS_PAIR,
  DECLARABLE_WAR_REASON_TYPES,
  PEACE_REASON_TYPES,
  REASON_MIRRORS,
  WAR_REASON_TYPES,
  isWarReasonType,
} from '../../src/domain/worldPulse/warReasonTaxonomy.js';
import { REASON_TUNING, scoreAtrocityAnswer } from '../../src/domain/worldPulse/warReasons.js';
import { scoreAtrocityAtoned } from '../../src/domain/worldPulse/peaceReasons.js';
import { WAR_CAUSE_DISSOLUTION } from '../../src/domain/worldPulse/warTermination.js';
import {
  DISSOLVED_CAUSE_PROSE,
  TERMINATION_PEACE_PROSE,
} from '../../src/domain/worldPulse/warTerminationCauseTables.js';

const RAZER = 'ash-court';
const OTHER = 'some-other-court';
const AT = 1000;

/** One believed razing by RAZER at tick `at`. */
const razingAt = (/** @type {number} */ at, /** @type {string} */ by = RAZER) => ({
  razerId: by, victimName: 'Thornwall', tick: at,
});

describe('CR-WR8-C — the sixteenth pair is the ruled spelling, and it is whole', () => {
  it('carries J-WR-14s spelling on both sides, prefix-stable under one grep family', () => {
    expect(ATROCITY_CASUS_PAIR.war).toBe('atrocity_answer');
    expect(ATROCITY_CASUS_PAIR.peace).toBe('atrocity_atoned');
    // The prefix property the ruling bought: ONE `atrocity_` family finds both halves.
    const family = [...WAR_REASON_TYPES, ...PEACE_REASON_TYPES].filter((t) => t.startsWith('atrocity_'));
    expect(family.sort()).toEqual(['atrocity_answer', 'atrocity_atoned']);
    // The retired 2026-08-02 spelling must never appear anywhere in the taxonomy.
    expect([...WAR_REASON_TYPES, ...PEACE_REASON_TYPES]).not.toContain('atrocity_outrage');
    expect([...WAR_REASON_TYPES, ...PEACE_REASON_TYPES]).not.toContain('atonement_accepted');
  });

  it('is a first-class member of every closed surface the taxonomy owns', () => {
    expect(WAR_REASON_TYPES).toContain('atrocity_answer');
    expect(PEACE_REASON_TYPES).toContain('atrocity_atoned');
    expect(REASON_MIRRORS.atrocity_answer).toBe('atrocity_atoned');
    expect(isWarReasonType('atrocity_answer')).toBe(true);
    // The dissolution mode + both prose clauses, which the module-load assertions in
    // warTerminationCauseTables.js also guard — asserted here so a reader of THIS
    // file can see the pair is whole without chasing a throw in another module.
    expect(WAR_CAUSE_DISSOLUTION.atrocity_answer).toBe('live_reason_absent');
    expect(DISSOLVED_CAUSE_PROSE.atrocity_answer).toMatch(/burning/);
    expect(TERMINATION_PEACE_PROSE.atrocity_atoned).toMatch(/atrocity/);
  });

  it('THE DECREE DOOR IS SHUT: it is derived, never DM-declarable', () => {
    // Decreeing this casus would manufacture the razing it is derived from, and
    // through R2 a licence to burn a city. It joins lineage_claim and
    // alliance_obligation in the derived set, taking that set from two to three.
    expect(DECLARABLE_WAR_REASON_TYPES).not.toContain('atrocity_answer');
    expect(DECLARABLE_WAR_REASON_TYPES).toHaveLength(WAR_REASON_TYPES.length - 3);
    // NEGATIVE CONTROL for the assertion above: the set is not simply empty or
    // uniformly closed — an ordinary state-derived cause IS decreeable, so the
    // exclusion above is a decision rather than a property of the whole list.
    expect(DECLARABLE_WAR_REASON_TYPES).toContain('grievance');
  });

  it('THE DM AUTHORING DIAL DID NOT MOVE: same thirteen, same order', () => {
    // A consequence worth pinning rather than noticing later. `realmManifest.js`
    // builds the DECLARE_CASUS enum dial straight off this list, so a taxonomy
    // growth that reached the dial would move a DM-facing surface and the
    // generated compendium data with it. It does not: the sixteenth member is
    // derived, so the list is the SAME thirteen in the SAME order it had at
    // fifteen — the growth is invisible to every authoring surface.
    expect([...DECLARABLE_WAR_REASON_TYPES]).toEqual([
      'grievance', 'revanchism', 'resource_pressure', 'treaty_default', 'encirclement',
      'legitimacy_hunger', 'corruption_exposed', 'foreign_clash', 'fear_of_dominance',
      'ingratitude_debt', 'dependency_by_design', 'opportunism', 'sacred_claim',
    ]);
  });
});

describe('the atrocity casus mints on the believed fact and fades on its own band', () => {
  it('fires at full heat on a razing believed to have happened this tick', () => {
    const read = scoreAtrocityAnswer({ razings: [razingAt(AT)], razerId: RAZER, tick: AT });
    expect(read.score).toBe(1);
    expect(read.receipt).toContain('Thornwall');
    expect(read.receipt).toContain('Someone must stop them');
  });

  it('DECAYS MONOTONELY and reaches EXACTLY ZERO at the band edge', () => {
    const band = REASON_TUNING.ATROCITY_DECAY_TICKS;
    const at = (/** @type {number} */ age) => scoreAtrocityAnswer({
      razings: [razingAt(AT - age)], razerId: RAZER, tick: AT,
    }).score;
    const quarter = at(Math.round(band * 0.25));
    const half = at(Math.round(band * 0.5));
    const threeQuarters = at(Math.round(band * 0.75));
    expect(quarter).toBeGreaterThan(half);
    expect(half).toBeGreaterThan(threeQuarters);
    expect(threeQuarters).toBeGreaterThan(0);
    // The far end: at the band and beyond, the cause is gone, not merely small.
    expect(at(band)).toBe(0);
    expect(at(band + 1)).toBe(0);
    expect(at(band * 4)).toBe(0);
    // ...and the mid-band value is a real number, so the ladder above is not three
    // zeroes agreeing with each other.
    expect(half).toBeGreaterThan(0.4);
    expect(half).toBeLessThan(0.6);
  });

  it('reads the FRESHEST believed razing when a court has burned more than one town', () => {
    const old = razingAt(AT - Math.round(REASON_TUNING.ATROCITY_DECAY_TICKS * 0.9));
    const recent = razingAt(AT - 10);
    const read = scoreAtrocityAnswer({ razings: [old, recent], razerId: RAZER, tick: AT });
    const recentAlone = scoreAtrocityAnswer({ razings: [recent], razerId: RAZER, tick: AT });
    expect(read.score).toBe(recentAlone.score);
    expect(read.score).toBeGreaterThan(0.9);
  });

  it('IS DIRECTED: a razing by somebody else raises no cause against this court', () => {
    const read = scoreAtrocityAnswer({
      razings: [razingAt(AT, OTHER)], razerId: RAZER, tick: AT,
    });
    expect(read.score).toBe(0);
    expect(read.receipt).toBe('');
    // The same list DOES raise a cause against the court that actually burned it —
    // so the zero above is the direction check, not an unreadable fixture.
    expect(scoreAtrocityAnswer({
      razings: [razingAt(AT, OTHER)], razerId: OTHER, tick: AT,
    }).score).toBe(1);
  });

  it('refuses every unreadable shape rather than inventing a neutral score', () => {
    expect(scoreAtrocityAnswer().score).toBe(0);
    expect(scoreAtrocityAnswer({ razings: [], razerId: RAZER, tick: AT }).score).toBe(0);
    expect(scoreAtrocityAnswer({ razings: [razingAt(AT)], tick: AT }).score).toBe(0);
    expect(scoreAtrocityAnswer({ razings: [razingAt(AT)], razerId: RAZER }).score).toBe(0);
    // A razing the observer believes is in the FUTURE is not news yet.
    expect(scoreAtrocityAnswer({
      razings: [razingAt(AT + 5)], razerId: RAZER, tick: AT,
    }).score).toBe(0);
  });
});

describe('R2 CLOSES THE LOOP — both polarities switch a real cause', () => {
  it('the JUST razing atones the atrocity rather than minting a new one', () => {
    const read = scoreAtrocityAtoned({ answered: true });
    expect(read.score).toBe(1);
    expect(read.receipt).toContain('answered in kind');
  });

  it('a razer destroyed by any other road also discharges the cause', () => {
    const read = scoreAtrocityAtoned({ razerGone: true });
    expect(read.score).toBe(1);
    expect(read.receipt).toContain('no longer stands');
  });

  it('and an unanswered atrocity is NOT atoned — the mirror is not a default', () => {
    expect(scoreAtrocityAtoned().score).toBe(0);
    expect(scoreAtrocityAtoned({ answered: false, razerGone: false }).score).toBe(0);
    expect(scoreAtrocityAtoned({ answered: 'yes' }).score).toBe(0);
  });
});
