/**
 * metronomeCooldownLint.test.js — the metronome/cooldown structural walker
 * (survey prescription; guards the E4-2a metronome-flood class the owner has fixed
 * more than once, most recently worldpulse-religion-trade-2).
 *
 * THE CLASS: applyWorldPulse.isDriftOnlyOutcome EXEMPTS any outcome carrying a
 * discrete-transition key (condition, stressor, tierChange, relationshipKey, …) from
 * the DRIFT_REEMIT_COOLDOWN metronome — a state CHANGE always emits. So a
 * DETERMINISTIC STANDING-STATE source that re-stamps a `condition`/`stressor` every
 * tick from STATIC inputs bypasses both the roll budget AND the metronome, flooding
 * the 240-cap feed and burying real arcs ("X finds an ear in Y" every tick). The fix
 * each time is a per-arc cooldown / once-per-state-change latch.
 *
 * THE WALKER: enumerate the worldPulse modules that build outcomes (candidateType)
 * carrying a metronome-exempt condition/stressor key, and partition by whether the
 * module names a cooldown/metronome mechanism. Both partitions are BASELINED and
 * ratcheted:
 *   • the CURRENT COMPLIANT set may only GROW — a source that has a cooldown can
 *     never silently lose it (the exact regression that would re-open the class);
 *   • the CURRENT non-cooldown set may only SHRINK — a NEW emitter that stamps a
 *     condition/stressor without naming a cooldown reds, forcing a cooldown or an
 *     explicit, rationaled baseline entry.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const WP_DIR = resolve(process.cwd(), 'src/domain/worldPulse');

// A module that names a cooldown / metronome / once-per-change mechanism.
const COOLDOWN = /cooldown|COOLDOWN|_COOLDOWN_TICKS|hasRecentIncident|lastFlipTick|metronome|isDriftOnlyOutcome|renewal|onlyOnFirst|onlyOnChange|latch/i;
// An OUTCOME builder (candidateType) that stamps a metronome-EXEMPT key. condition /
// stressor are the two the standing-state findings hit; both keep the outcome out of
// isDriftOnlyOutcome, so a deterministic re-stamp bypasses suppression.
const HAS_CANDIDATE = /candidateType\s*:/;
const EXEMPT_KEY = /(?:^|[\s,{])(?:condition|stressor)\s*:/m;

function partition() {
  const emitters = [];
  const compliant = [];
  const nonCompliant = [];
  for (const f of readdirSync(WP_DIR).filter((n) => n.endsWith('.js')).sort()) {
    const src = readFileSync(join(WP_DIR, f), 'utf-8');
    if (!(HAS_CANDIDATE.test(src) && EXEMPT_KEY.test(src))) continue;
    emitters.push(f);
    (COOLDOWN.test(src) ? compliant : nonCompliant).push(f);
  }
  return { emitters, compliant, nonCompliant };
}

// ── The three deterministic STANDING-STATE sources the review named (worldpulse-
// religion-trade-2), each fixed with a cooldown/latch. This is the load-bearing
// regression list: a foothold/pact/vassal-coercion re-stamp WITHOUT its cooldown is
// the flood bug returning.
const NAMED_STANDING_STATE = ['religiousContest.js', 'deityStanceLane.js', 'tradeWar.js'];

// The current cooldown-NAMING emitter set (BASELINE — may only GROW). A source that
// drops out of this set has silently lost its cooldown mechanism.
// razingExecution.js JOINED THIS SET at HK-4 (2026-08-30) rather than being
// grandfathered into the non-cooldown baseline below. Its `war_layer_razing` outcome
// carries a `condition`, so isDriftOnlyOutcome exempts it and its id carries the tick,
// so no upstream dedup catches a repeat either — and a razing leaves no occupation, so
// the same besieger can fall on the same town again. `razingReemitCooldownActive` is
// the once-per-state-change latch, at the metronome's OWN DRIFT_REEMIT_COOLDOWN_TICKS
// window (imported, not re-typed) and with no new persisted field. It is listed HERE
// because this arm's message names the regression precisely — "used to name a cooldown
// and no longer does" — where the SHRINK-only arm below would report the same deletion
// only as a new offender.
// ⭐ AND TWO MORE NAMES JOINED IN THE SAME ACT (2026-08-30, chair addendum from HERALD's
// landing proof, executed independently here rather than taken on report). `partition()` run
// standalone against `src/domain/worldPulse` reports TEN compliant emitters at this tip and
// this list held seven. `occupation.js` is the load-bearing one — it was sitting in
// NONCOMPLIANT_BASELINE below while measuring COMPLIANT, so the quarantine was over-broad and
// the file was guarded by nothing in either direction; it is delisted there and listed here in
// one act. `warRecordMode.js` was compliant and simply unlisted. Both now sit under the
// only-GROWS arm, so neither can lose its mechanism silently.
const COMPLIANT_BASELINE = [
  'deityStanceLane.js', 'factionCompetition.js', 'npcAgency.js',
  'occupation.js', 'razingExecution.js',
  'relationshipRulesAdversarial.js', 'relationshipRulesCore.js',
  'religiousContest.js', 'tradeWar.js', 'warRecordMode.js',
];

// The current non-cooldown emitter set (BASELINE — may only SHRINK). These reference
// a metronome-exempt key near an outcome build but are NOT confirmed deterministic
// standing-state re-emitters: event/one-shot-driven (coup, deploymentReturn,
// mobilization*, warDeployment, occupation), party-driven (partyImpact — isDriftOnly
// forces partySourced to ALWAYS emit BY DESIGN, never suppressed), transition-gated
// (populationDynamics, settlementStrategy), or registry/helper/data (candidateEvents,
// pulseHelpers, stressors, flows). Grandfathered pending audit; a NEW name here reds.
// stressorsCore.js is NOT a new emitter: it is the first-paint leaf split out of
// stressors.js (golden first-paint reclaim, 2026-07-14) and carries the RELOCATED
// residualOutcome builder verbatim — the same grandfathered registry/helper code,
// now in two files. Audit them together.
// convergence.js (W-CONVERGENCE) is EVENT/LOADED-DICE/ONE-SHOT, not a per-tick standing-
// state re-stamper: an intervention COMMITS once per (patron, target) behind the E0 loaded
// dice and PERSISTS in the interventions ledger (never re-emitted while it stands); the
// `condition:` key the scanner sees is the PURE overstayOccupation descriptor (a once-per-
// state-change occupation transition gated by OVERSTAY_TICKS, feeding freshConquestsFrom),
// and the aftermath ATTRITED dwell (canReEngage / ATTRITED_DWELL_TICKS) is itself a
// once-per-state-change latch. It floods nothing — same category as coup/occupation/
// warDeployment (the war-layer one-shots). Grandfathered pending the composer audit.
// ⛔ `occupation.js` DELISTED 2026-08-30 (chair addendum; ODQ §765.2's lane, car 8). It was
// carried here as a grandfathered non-cooldown emitter and it has NOT been one for some time:
// `partition()` executed standalone against `src/domain/worldPulse` puts it in the COMPLIANT
// set at this tip AND at base `518c40880` unedited — measured both sides, byte-identical
// verdict. A quarantine row for a file that is not in quarantine is worse than no row: the
// SHRINK-only arm cannot see it (an absent name is a shrink, which is lawful) and the
// only-GROWS arm never looked at it, so the file was guarded by nothing in either direction.
// It moves to COMPLIANT_BASELINE above in the same act, which is what makes this a
// re-classification rather than a deletion.
//   ⚠ THE LIST IS NOW EXACTLY THE LIVE NON-COMPLIANT SET — 14 names, measured, with zero
//   unlisted offenders and zero listed non-offenders. The new-name-reds rule is untouched.
const NONCOMPLIANT_BASELINE = [
  'candidateEvents.js', 'convergence.js', 'coup.js', 'deploymentReturn.js', 'flows.js',
  'mobilizationEffects.js', 'mobilizationReactions.js',
  'partyImpact.js', 'populationDynamics.js', 'pulseHelpers.js',
  'settlementStrategy.js', 'stressors.js', 'stressorsCore.js', 'warDeployment.js',
];

describe('metronome-cooldown lint — condition-bearing outcome sources self-limit', () => {
  it('the metronome class is real: isDriftOnlyOutcome exempts condition/stressor and a cooldown exists', () => {
    const curation = readFileSync(join(WP_DIR, 'worldPulseFeedCuration.js'), 'utf-8');
    const applied = readFileSync(join(WP_DIR, 'applyWorldPulse.js'), 'utf-8');
    expect(curation).toMatch(/function isDriftOnlyOutcome/);
    // The exemption still lists the two keys the standing-state findings hit.
    expect(curation).toMatch(/outcome\.condition/);
    expect(curation).toMatch(/outcome\.stressor/);
    // The metronome cooldown itself is defined.
    expect(curation).toMatch(/DRIFT_REEMIT_COOLDOWN_TICKS/);
    // The extracted curation seam remains connected to the pulse orchestrator.
    expect(applied).toMatch(/isDriftOnlyOutcome/);
    expect(applied).toMatch(/isMetronomeRepeat/);
  });

  it('the review-named standing-state sources still name a cooldown (worldpulse-religion-trade-2 regression guard)', () => {
    const regressed = NAMED_STANDING_STATE.filter((f) => !COOLDOWN.test(readFileSync(join(WP_DIR, f), 'utf-8')));
    expect(
      regressed,
      `${regressed.join(', ')} re-stamp a condition/stressor but no longer name a cooldown — the E4-2a metronome flood is back.`,
    ).toEqual([]);
  });

  it('the CURRENT COMPLIANT emitter set may only GROW (no source silently loses its cooldown)', () => {
    const { compliant } = partition();
    const lost = COMPLIANT_BASELINE.filter((f) => !compliant.includes(f));
    expect(
      lost,
      `${lost.join(', ')} used to name a cooldown/metronome mechanism and no longer do (or stopped `
        + 'being detected as a condition-bearing emitter). Restore the cooldown, or update the baseline deliberately.',
    ).toEqual([]);
  });

  it('the non-cooldown emitter set may only SHRINK (no NEW condition-bearing source bypasses the metronome)', () => {
    const { nonCompliant } = partition();
    const added = nonCompliant.filter((f) => !NONCOMPLIANT_BASELINE.includes(f));
    expect(
      added,
      `NEW worldPulse outcome source(s) ${added.join(', ')} stamp a condition/stressor (metronome-EXEMPT) `
        + 'but name NO cooldown/metronome mechanism — the E4-2a flood class. Add a per-arc cooldown / '
        + 'once-per-state-change latch, or add the file to NONCOMPLIANT_BASELINE with a rationale if it is '
        + 'genuinely event/one-shot/party-driven.',
    ).toEqual([]);
  });
});
