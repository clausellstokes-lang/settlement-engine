/**
 * espionageCareer.test.js — ES-5c: §3.14 THE PROMOTION-RISK REGISTER, the career grain's
 * own pins.
 *
 * Acceptance cases A1, A3, A4 and A6 (A2, A5 and A7 live in the dormancy fence file).
 *
 * ⭐ THE CASE THAT CLAIMS "THE REACH" DRIVES THE LEAF AND `defenseScore` ON ONE FIXTURE.
 * The whole reason this packet is worth building is that §3.14's "the ladder CONTEST math
 * … no new contest code" is FALSE as measured — `npcLadderContest.js` has no defense term
 * at all — so the composition had to be built where the machinery actually is,
 * `npcLadderChallenge.js#defenseScore`. A pin that only measured the leaf's arithmetic
 * would leave the reach exactly as unproven as the design sentence was, so the register
 * value and the defense it discounts are asserted TOGETHER, off the same inputs.
 *
 * ⚠⚠ THE SPAN PIN IS THE ONE THAT CANNOT BE DROPPED. `RUNG_EXPOSURE_WINDOW_SPAN: 8` is a
 * LITERAL, and it divides the exposure term. If `openWindows` grew a ninth reason the
 * divisor would silently compress every exposure value and no test would say so. The pin
 * below DERIVES the reason count from `openWindows` itself — twice, by two instruments
 * that share no code — and never restates it.
 *
 * ⚠ NO BARE NEGATIVES. This file is new, so `negativeAssertionAnchor.walker` gives it a
 * ceiling of ZERO un-anchored `not.toContain`/`not.toMatch`/`not.toHaveProperty` sites.
 * The one genuine absence claim — that the away set excludes hostages — routes through
 * `expectAbsentWithAnchor`, whose liveness arm is an EXECUTED precondition rather than
 * prose claiming a control exists, and whose anchor (`traveling`) survives the hostage
 * regression while dying of every other drift, so the arm that fires names the real cause.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { careerRiskFor, promotionRisk01For } from '../../src/domain/worldPulse/espionage/espionageCareer.js';
import { ESPIONAGE_TUNING, promotionRisk01Core } from '../../src/domain/worldPulse/espionage/espionageMath.js';
import { gatherOrGovernRead } from '../../src/domain/worldPulse/espionage/espionageGauntlet.js';
import {
  CHALLENGE_TUNING,
  defenseScore,
  openWindows,
} from '../../src/domain/worldPulse/npcLadderChallenge.js';
import { LADDER_TUNING } from '../../src/domain/worldPulse/npcLadderState.js';
import { WHEREABOUTS_STATES } from '../../src/domain/roads/state.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const NID = 'S1:n1';
const WEEKS = 10;

/** A lit world: beliefs on (canon marker + a non-omniscient info mode), spine, espionage. */
function litWorld(npcStates = {}) {
  return {
    spatialCanonVersion: 1,
    simulationRules: { infoMode: 'full', errandSpineEnabled: true, espionageEnabled: true },
    npcStates,
  };
}

/** The defender's roster entry. `sinceTick` HOLDS A WEEK — the field name is the only lie. */
const npcAway = (state = 'traveling', sinceTick = 4) => ({
  id: 'n1', name: 'n1', whereabouts: { state, sinceTick, placeId: 'S2', purposeKind: 'trade' },
});

/** An agency row with a live rivalry and real promotion heat. */
const agency = (ambitionHeat = 0.6, rivalryTargets = ['S1:n2']) => ({ ambitionHeat, rivalryTargets });

const merchant = { name: "Merchants' Guild", category: 'merchant' };
const plainNpc = (name) => ({ name, personality: { dominant: 'shrewd', flaw: 'proud', modifier: 'bold' } });
/** The ladder's own Combatant shape, with the ES-5c stamp as `mk()` initialises it. */
const combatant = (risk) => ({
  nid: NID, npc: plainNpc(NID), standing: 8, stigma: false, grudgeVsDefender: 0,
  isChallenging: false, rungIndex: 0, rungCount: 3, promotionRisk01: risk,
});
const ladderCtx = { faction: merchant, factionRising: false, factionFalling: false, worldState: {} };

describe('ES-5c A1 — THE REACH: the register, and the defense it discounts, on one fixture', () => {
  it('a holder 6 weeks abroad on a windowed rung with a live rival defends measurably weaker', () => {
    const world = litWorld({ [NID]: agency() });
    // The exposure the ladder computes at the composition site: two open windows of the span.
    const exposure = 2 / CHALLENGE_TUNING.RUNG_EXPOSURE_WINDOW_SPAN;
    const risk = careerRiskFor(world, npcAway(), NID, WEEKS, exposure);

    // THE LEAF: the exact core value for those three inputs, derived here rather than
    // restated — `awayWeeks` is WEEKS minus the mirror's week, with NO conversion.
    expect(risk).toBe(promotionRisk01Core({
      awayWeeks: WEEKS - 4, rungExposure01: exposure, rivalPressure01: 0.6,
    }));
    expect(risk).toBeGreaterThan(0);

    // THE REACH, on the same number: the defense drops by exactly DEFENSE_WHEN_ABSENT × risk
    // of its pre-term score, and the receipt cites the term by name with a negative sign.
    const base = defenseScore(combatant(0), ladderCtx);
    const decayed = defenseScore(combatant(risk), ladderCtx);
    expect(base.receipt.absenceDecay).toBe(0);
    expect(decayed.receipt.absenceDecay).toBeLessThan(0);
    expect(decayed.receipt.absenceDecay)
      .toBe(-Math.round(base.score * CHALLENGE_TUNING.DEFENSE_WHEN_ABSENT * risk * 10000) / 10000);
    expect(decayed.score).toBeCloseTo(base.score * (1 - CHALLENGE_TUNING.DEFENSE_WHEN_ABSENT * risk), 4);
    expect(decayed.score).toBeLessThan(base.score);

    // ANTI-VACUITY: the discount is MONOTONE in the risk, so this is a live multiplier and
    // not a single hard-coded step that happens to land below the base.
    const heavier = defenseScore(combatant(Math.min(1, risk * 2)), ladderCtx);
    expect(heavier.score).toBeLessThan(decayed.score);
  });

  it('the leaf mints NO second arithmetic — it is the ES-0 core under a name (J-WR-10)', () => {
    // The `operativeNotoriety01` precedent: a consumer widening is pinned EQUAL to the leaf
    // it widens, so a future edit that quietly re-derives the fold reds here.
    for (const awayWeeks of [0, 3, 6, 12, 40]) {
      for (const rungExposure01 of [0, 0.25, 1]) {
        for (const rivalPressure01 of [0, 0.6, 1]) {
          const input = { awayWeeks, rungExposure01, rivalPressure01 };
          expect(promotionRisk01For(input), JSON.stringify(input))
            .toBe(promotionRisk01Core(input));
        }
      }
    }
    // …and the widened name really is reachable and really does vary, so the matrix above is
    // not nine readings of a constant.
    expect(promotionRisk01For({ awayWeeks: 12, rungExposure01: 1, rivalPressure01: 1 }))
      .toBeGreaterThan(promotionRisk01For({ awayWeeks: 1, rungExposure01: 1, rivalPressure01: 1 }));
  });
});

describe('ES-5c ⚠⚠ THE SPAN IS PINNED TO ITS PRODUCER (chair ruling on O2)', () => {
  it('RUNG_EXPOSURE_WINDOW_SPAN equals the number of distinct reasons openWindows can push', () => {
    // INSTRUMENT 1 — DRIVE THE PRODUCER. Every window argument is opened at once, so the
    // returned list is every reason the function can actually push on one defender.
    const everyWindow = openWindows(
      { nid: NID, npc: plainNpc(NID), standing: LADDER_TUNING.STAND_BASELINE - 1, stigma: true,
        grudgeVsDefender: 0, isChallenging: false, rungIndex: 0, rungCount: 3, promotionRisk01: 0 },
      { faction: merchant, factionRising: false, factionFalling: true, worldState: {} },
      true, true, true, true, true, true,
    );
    const driven = new Set(everyWindow);
    expect(driven.size, 'the maximal drive opened fewer reasons than the function spells —'
      + ' a window reason is unreachable, or the drive stopped opening one')
      .toBe(CHALLENGE_TUNING.RUNG_EXPOSURE_WINDOW_SPAN);

    // INSTRUMENT 2 — READ THE PRODUCER'S SOURCE. A ninth reason gated on something this
    // fixture cannot reach would leave instrument 1 green at 8; a reason spelled in a form
    // the regex misses would leave instrument 2 low. Only the UNION covers both blind spots.
    const source = readFileSync(join(ROOT, 'src/domain/worldPulse/npcLadderChallenge.js'), 'utf8');
    const start = source.indexOf('export function openWindows');
    expect(start, 'openWindows was renamed or removed — this pin is measuring nothing')
      .toBeGreaterThan(-1);
    const body = source.slice(start, source.indexOf('\n}', start))
      .replace(/^\s*\/\/.*$/gm, ''); // prose names these words too; read the CODE
    const spelled = new Set([...body.matchAll(/w\.push\(\s*'([a-z_]+)'\s*\)/g)].map((m) => m[1]));
    expect(spelled.size, 'the source spells a different number of window reasons than the span')
      .toBe(CHALLENGE_TUNING.RUNG_EXPOSURE_WINDOW_SPAN);
    // The two instruments must agree MEMBER BY MEMBER, not merely in count.
    expect([...spelled].sort()).toEqual([...driven].sort());

    // …and the span is load-bearing: it really is the divisor, so a drifted span moves the
    // register rather than sitting inert beside it.
    const world = litWorld({ [NID]: agency() });
    const full = careerRiskFor(world, npcAway(), NID, WEEKS, driven.size / CHALLENGE_TUNING.RUNG_EXPOSURE_WINDOW_SPAN);
    const half = careerRiskFor(world, npcAway(), NID, WEEKS, (driven.size / 2) / CHALLENGE_TUNING.RUNG_EXPOSURE_WINDOW_SPAN);
    expect(full).toBeGreaterThan(half);
  });
});

describe('ES-5c A3 — THE COUNTERFORCE: hostages are already off-stage', () => {
  it('the away set is the FROZEN EXPORT minus hostage, derived by driving every member', () => {
    const world = litWorld({ [NID]: agency() });
    const exposure = 2 / CHALLENGE_TUNING.RUNG_EXPOSURE_WINDOW_SPAN;
    // TOTAL OVER THE FROZEN EXPORT: every roads state is driven through the real producer,
    // so a FIFTH state added to WHEREABOUTS_STATES joins this partition automatically
    // instead of escaping the discount in silence.
    const decaying = WHEREABOUTS_STATES
      .filter((state) => careerRiskFor(world, npcAway(state), NID, WEEKS, exposure) > 0);

    // THE NEGATIVE, ANCHORED: `traveling` is a live sibling that travels the SAME path and
    // survives the exact regression this guards (a hostage wrongly counted as away), while
    // dying of any drift that breaks the producer — so the arm that fires names the cause.
    expectAbsentWithAnchor(decaying, 'hostage', 'traveling', 'the §3.14 away set');
    // …and the partition is EXACT, so no member is quietly missing from either side.
    expect([...decaying].sort()).toEqual(WHEREABOUTS_STATES.filter((s) => s !== 'hostage').sort());
    // The positive control, stated as a number rather than as membership: a captive is
    // discounted ZERO and his defense is the identity.
    expect(careerRiskFor(world, npcAway('hostage'), NID, WEEKS, exposure)).toBe(0);
    expect(defenseScore(combatant(0), ladderCtx).score)
      .toBe(defenseScore(combatant(careerRiskFor(world, npcAway('hostage'), NID, WEEKS, exposure)), ladderCtx).score);
  });
});

/**
 * ⚠⚠ A4 IS SPLIT IN TWO, AND THE SPLIT IS A REFUSED-FORWARD MEASUREMENT, NOT A WEAKENING.
 *
 * The packet's A4 asks for FIVE inputs — `whereabouts` absent, `sinceTick` absent,
 * `sinceTick` in the future, no `npcStates` row, `windowCount` 0 — to yield "risk exactly
 * `0` and multiplier exactly `1` in all five", and §5's absence rule lists "no `npcStates`
 * row" among its total-zero conditions. TWO OF THE FIVE CANNOT, and the reason is the ES-0
 * core's own arithmetic, which §6.5 and J-WR-10 forbid this wave to re-derive:
 *
 *     promotionRisk01Core = away × (PROMOTION_EXPOSURE_W·exposure + PROMOTION_RIVAL_W·rival)
 *
 * The two pressure terms are SUMMED, so each one alone still produces a register. MEASURED
 * on the packet's own A1 fixture: a missing agency row reads 0.0625 and a zero window count
 * reads 0.15 — neither is 0, and both are correct. Only the STRUCTURAL absences drive
 * `away` to 0 (or return before it), and those really are exactly 0.
 *
 * Making all five zero would require the register to vanish unless BOTH terms are present.
 * That is not a smaller change than the "declare `rungExposure01` ABSENT and ship at half
 * strength" alternative the chair REJECTED at §13b O2 — it is a strictly larger one, since
 * it ships the register at ZERO strength whenever either half is missing. So the literal
 * wording is refused and the executable content is pinned instead, in two groups: the
 * structural absences at EXACTLY zero, and the term absences as a bounded, monotone
 * DEGRADATION whose sparse-world case (both terms absent) really is exactly zero. Nothing
 * anywhere is NaN, negative, or undefined.
 */
describe('ES-5c A4 — SPARSE AND MALFORMED: never NaN, never negative, never undefined', () => {
  const world = litWorld({ [NID]: agency() });
  const exposure = 2 / CHALLENGE_TUNING.RUNG_EXPOSURE_WINDOW_SPAN;
  const identity = defenseScore(combatant(0), ladderCtx).score;

  it('STRUCTURAL absence ⇒ risk EXACTLY 0 and a defense multiplier of EXACTLY 1', () => {
    const cases = [
      ['whereabouts absent', world, { id: 'n1' }, NID, WEEKS, exposure],
      ['sinceTick absent', world, { id: 'n1', whereabouts: { state: 'traveling' } }, NID, WEEKS, exposure],
      ['sinceTick in the FUTURE', world, npcAway('traveling', WEEKS + 6), NID, WEEKS, exposure],
      ['sinceTick malformed', world, npcAway('traveling', 'soon'), NID, WEEKS, exposure],
      ['npc null', world, null, NID, WEEKS, exposure],
      ['npc undefined', world, undefined, NID, WEEKS, exposure],
      ['weeks NaN', world, npcAway(), NID, Number.NaN, exposure],
      ['hostage', world, npcAway('hostage'), NID, WEEKS, exposure],
      ['an unknown whereabouts word', world, npcAway('rusticating'), NID, WEEKS, exposure],
      ['a sparse world — BOTH pressure terms absent', litWorld({}), npcAway(), NID, WEEKS, 0],
    ];
    for (const [label, w, npc, nid, weeks, exposure01] of cases) {
      const risk = careerRiskFor(w, npc, nid, weeks, exposure01);
      expect(risk, `${label}: risk`).toBe(0);
      expect(defenseScore(combatant(risk), ladderCtx).score, `${label}: multiplier`).toBe(identity);
    }
    // ANTI-VACUITY: the same fixture WITHOUT the defect really does decay, so the ten zeros
    // above are refusals rather than ten readings of a dead function.
    expect(careerRiskFor(world, npcAway(), NID, WEEKS, exposure)).toBeGreaterThan(0);
    expect(defenseScore(combatant(careerRiskFor(world, npcAway(), NID, WEEKS, exposure)), ladderCtx).score)
      .toBeLessThan(identity);
  });

  it('a MISSING PRESSURE TERM degrades the register — it never zeroes it, and never NaNs it', () => {
    const full = careerRiskFor(world, npcAway(), NID, WEEKS, exposure);
    const cases = [
      ['no npcStates row', litWorld({}), exposure],
      ['a rivalry-free agency row', litWorld({ [NID]: agency(0.9, []) }), exposure],
      ['a heatless agency row', litWorld({ [NID]: agency(0, ['S1:n2']) }), exposure],
      ['a malformed agency row', litWorld({ [NID]: { ambitionHeat: 'hot', rivalryTargets: 'n2' } }), exposure],
      ['windowCount 0', world, 0],
      ['exposure NaN', world, Number.NaN],
      ['exposure out of range', world, 42],
    ];
    for (const [label, w, exposure01] of cases) {
      const risk = careerRiskFor(w, npcAway(), NID, WEEKS, exposure01);
      // The whole defensive contract, stated where it can fail.
      expect(Number.isFinite(risk), `${label}: finite`).toBe(true);
      expect(risk >= 0, `${label}: non-negative`).toBe(true);
      expect(risk <= 1, `${label}: bounded`).toBe(true);
      expect(defenseScore(combatant(risk), ladderCtx).receipt.absenceDecay <= 0, `${label}: sign`).toBe(true);
      expect(defenseScore(combatant(risk), ladderCtx).score <= identity, `${label}: no bonus`).toBe(true);
    }
    // …and the degradation is REAL: dropping either term alone lands strictly between the
    // sparse world's zero and the full fixture, which is what "degrades, never zeroes" means.
    for (const partial of [
      careerRiskFor(litWorld({}), npcAway(), NID, WEEKS, exposure),   // exposure alone
      careerRiskFor(world, npcAway(), NID, WEEKS, 0),                  // rival alone
    ]) {
      expect(partial).toBeGreaterThan(0);
      expect(partial).toBeLessThan(full);
    }
    // An out-of-range exposure CLAMPS rather than escaping the bound — 42 reads as 1.
    expect(careerRiskFor(world, npcAway(), NID, WEEKS, 42))
      .toBe(careerRiskFor(world, npcAway(), NID, WEEKS, 1));
  });
});

describe('ES-5c A6 — ARM C: the register is a real carrier for the gather-or-govern read', () => {
  it('the value the ladder computes flips the gauntlet term and pushes the trade to govern', () => {
    const world = litWorld({ [NID]: agency() });
    const risk = careerRiskFor(world, npcAway(), NID, WEEKS, 2 / CHALLENGE_TUNING.RUNG_EXPOSURE_WINDOW_SPAN);
    const factors = {
      hostRung: 3, securityEff01: 0.5, orderBand: 'adequate', stressLoad01: 0.2,
      hasUnderways: false, hasInsideAsset: false, wariness01: 0.3, competence01: 0.5, stops: 1,
    };
    const args = { dwell: { intervalIdx: 1 }, appetite01: 1, demandMet: false, factors };
    const bare = gatherOrGovernRead(args);
    const carried = gatherOrGovernRead({ ...args, promotionRisk01: risk });

    // The term is DECLARED ABSENT with no carrier and PRESENT with one — and the negative
    // control is the same fixture, so the empty list cannot be a drifted producer.
    expect(bare.termsAbsent).toEqual(['promotionRisk']);
    expect(carried.termsAbsent).toEqual([]);
    // The register really is a usable carrier: a live 0..1 value that raises the weighed
    // risk, so `govern` becomes strictly more likely and never less.
    expect(risk).toBeGreaterThan(0);
    expect(carried.dwellRisk01).toBeGreaterThan(bare.dwellRisk01);
    const between = (bare.dwellRisk01 + carried.dwellRisk01) / 2;
    expect(gatherOrGovernRead({ ...args, appetite01: between }).choice).toBe('gather');
    expect(gatherOrGovernRead({ ...args, appetite01: between, promotionRisk01: risk }).choice).toBe('govern');
    // …and the espionage tuning the register folds is ES-0's, unforked: the away cap is what
    // makes six weeks half a register rather than a whole one.
    expect(ESPIONAGE_TUNING.PROMOTION_AWAY_CAP_WEEKS).toBe(12);
  });
});
