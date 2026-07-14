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
const COMPLIANT_BASELINE = [
  'deityStanceLane.js', 'factionCompetition.js', 'npcAgency.js',
  'relationshipRulesAdversarial.js', 'relationshipRulesCore.js',
  'religiousContest.js', 'tradeWar.js',
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
const NONCOMPLIANT_BASELINE = [
  'candidateEvents.js', 'coup.js', 'deploymentReturn.js', 'flows.js',
  'mobilizationEffects.js', 'mobilizationReactions.js', 'occupation.js',
  'partyImpact.js', 'populationDynamics.js', 'pulseHelpers.js',
  'settlementStrategy.js', 'stressors.js', 'stressorsCore.js', 'warDeployment.js',
];

describe('metronome-cooldown lint — condition-bearing outcome sources self-limit', () => {
  it('the metronome class is real: isDriftOnlyOutcome exempts condition/stressor and a cooldown exists', () => {
    const applied = readFileSync(join(WP_DIR, 'applyWorldPulse.js'), 'utf-8');
    expect(applied).toMatch(/function isDriftOnlyOutcome/);
    // The exemption still lists the two keys the standing-state findings hit.
    expect(applied).toMatch(/outcome\.condition/);
    expect(applied).toMatch(/outcome\.stressor/);
    // The metronome cooldown itself is defined.
    expect(applied).toMatch(/DRIFT_REEMIT_COOLDOWN_TICKS/);
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
