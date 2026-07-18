/**
 * npcLadderGoals.test.js — THE LADDER dynamic-goal + weighted-deed pins
 * (DESIGN_THE_LADDER.md §3.2, §9, §11.3, the ATTRIBUTION RULE).
 *
 * Goals REUSE the S7 signalRegistry + StopCondition evaluator (a goal IS a StopCondition
 * over a registered causal signal). These pins exercise the goal machinery directly
 * against a hand-built S7 frame carrying causal scores.
 */
import { describe, it, expect } from 'vitest';
import {
  mintGoal, evaluateGoal, attributionWeight, riskAppetiteOf, factionDomainVars,
  goalSignalVar, GOAL_TUNING,
} from '../../src/domain/worldPulse/npcLadderGoals.js';
import { validateStopCondition } from '../../src/domain/autonomy/stopConditions.js';

/** A minimal buildWorldSnapshot-shaped S7 frame carrying causal scores/bands for one town. */
function frameWith(sid, scores, bands = {}) {
  const item = { id: sid, name: sid, settlement: { name: sid }, causal: { scores, bands } };
  return {
    frame: { snapshot: { byId: new Map([[sid, item]]), worldState: {}, regionalGraph: {} }, pressures: { get: () => null }, tick: 100 },
    item,
  };
}
const merchant = { name: "Merchants' Guild", category: 'merchant' };
const proud = { personality: { dominant: 'shrewd', flaw: 'proud', modifier: 'ambitious' } };
const cautious = { personality: { dominant: 'careful', flaw: 'timid', modifier: 'loyal' } };
const cruel = { personality: { dominant: 'harsh', flaw: 'cruel', modifier: 'paranoid' } };

describe('goal minting — the lens (faction domain + FLAWS = risk appetite)', () => {
  it('a goal is a valid StopCondition over a REGISTERED causal signal, scoped to the settlement', () => {
    const { frame, item } = frameWith('a', { economic_capacity: 40 });
    const goal = mintGoal({ npc: proud, faction: merchant, rungIndex: 0, sid: 'a', frame, item, weeks: 100 });
    expect(goal).toBeTruthy();
    const v = validateStopCondition(goal.condition);
    expect(v.ok, `the condition must pass the S7 schema wall: ${v.errors.join(', ')}`).toBe(true);
    expect(goal.condition.root.settlementId).toBe('a');
    expect(goalSignalVar(goal)).toBe('economic_capacity'); // merchant's primary domain var
  });

  it('FLAWS = RISK APPETITE: proud reaches HIGH, cautious grinds a MODEST floor', () => {
    const { frame, item } = frameWith('a', { economic_capacity: 40 });
    const proudGoal = mintGoal({ npc: proud, faction: merchant, rungIndex: 0, sid: 'a', frame, item, weeks: 100 });
    const cautiousGoal = mintGoal({ npc: cautious, faction: merchant, rungIndex: 0, sid: 'a', frame, item, weeks: 100 });
    expect(riskAppetiteOf(proud)).toBe('high');
    expect(riskAppetiteOf(cautious)).toBe('low');
    expect(proudGoal.condition.root.test.value).toBe(GOAL_TUNING.THRESHOLD_HIGH);
    expect(cautiousGoal.condition.root.test.value).toBe(GOAL_TUNING.THRESHOLD_LOW);
    // The proud, higher-reaching goal carries MORE stakes and a LONGER horizon.
    expect(proudGoal.stakes).toBeGreaterThan(cautiousGoal.stakes);
    expect(proudGoal.horizonWeeks).toBeGreaterThan(cautiousGoal.horizonWeeks);
  });

  it('a suppressive flaw (cruel) targets law_order (impose harsh order)', () => {
    const { frame, item } = frameWith('a', { economic_capacity: 40, law_order: 30 });
    const goal = mintGoal({ npc: cruel, faction: merchant, rungIndex: 0, sid: 'a', frame, item, weeks: 100 });
    expect(goalSignalVar(goal)).toBe('law_order');
  });

  it('STAKES priced at mint: a great recovery (far state-distance) out-stakes a small nudge; adversity multiplies', () => {
    const far = frameWith('a', { economic_capacity: 20 });          // 20 → 78 is a great work
    const near = frameWith('a', { economic_capacity: 74 });         // 74 → 78 is a nudge
    const gFar = mintGoal({ npc: proud, faction: merchant, rungIndex: 0, sid: 'a', frame: far.frame, item: far.item, weeks: 100 });
    const gNear = mintGoal({ npc: proud, faction: merchant, rungIndex: 0, sid: 'a', frame: near.frame, item: near.item, weeks: 100 });
    expect(gFar.stakes).toBeGreaterThan(gNear.stakes);
    // Adversity: the SAME goal in a crisis town (many critical bands) stakes higher.
    const calm = frameWith('a', { economic_capacity: 20 }, { food_security: 'adequate', law_order: 'adequate' });
    const crisis = frameWith('a', { economic_capacity: 20 }, { food_security: 'critical', law_order: 'collapsed' });
    const gCalm = mintGoal({ npc: proud, faction: merchant, rungIndex: 0, sid: 'a', frame: calm.frame, item: calm.item, weeks: 100 });
    const gCrisis = mintGoal({ npc: proud, faction: merchant, rungIndex: 0, sid: 'a', frame: crisis.frame, item: crisis.item, weeks: 100 });
    expect(gCrisis.stakes).toBeGreaterThan(gCalm.stakes);
  });

  it('stakes-at-mint is DETERMINISTIC (same inputs ⇒ identical goal, JSON-equal)', () => {
    const a = frameWith('a', { economic_capacity: 40 });
    const b = frameWith('a', { economic_capacity: 40 });
    const g1 = mintGoal({ npc: proud, faction: merchant, rungIndex: 0, sid: 'a', frame: a.frame, item: a.item, weeks: 100 });
    const g2 = mintGoal({ npc: proud, faction: merchant, rungIndex: 0, sid: 'a', frame: b.frame, item: b.item, weeks: 100 });
    expect(JSON.stringify(g1)).toBe(JSON.stringify(g2));
  });
});

describe('goal evaluation — partial progress + lapsed (§11.3)', () => {
  it('progress advances from the mint baseline toward the ambition; fires at the threshold', () => {
    const start = frameWith('a', { economic_capacity: 40 });
    const goal = mintGoal({ npc: proud, faction: merchant, rungIndex: 0, sid: 'a', frame: start.frame, item: start.item, weeks: 100 });
    expect(goal.progress).toBe(0);
    // Halfway from 40 to 78 (≈59): progress ≈ 0.5.
    const mid = frameWith('a', { economic_capacity: 59 });
    const evMid = evaluateGoal(goal, mid.frame);
    expect(evMid.readable).toBe(true);
    expect(evMid.fired).toBe(false);
    expect(evMid.progress).toBeGreaterThan(0.4);
    expect(evMid.progress).toBeLessThan(0.6);
    // At/above the threshold: fired, progress 1.
    const done = frameWith('a', { economic_capacity: 80 });
    const evDone = evaluateGoal(goal, done.frame);
    expect(evDone.fired).toBe(true);
    expect(evDone.progress).toBe(1);
  });

  it('LAPSED: an unreadable signal (the premise died) resolves readable:false, no progress', () => {
    const start = frameWith('a', { economic_capacity: 40 });
    const goal = mintGoal({ npc: proud, faction: merchant, rungIndex: 0, sid: 'a', frame: start.frame, item: start.item, weeks: 100 });
    // A frame where the settlement is unknown ⇒ the causal signal cannot resolve.
    const gone = { snapshot: { byId: new Map(), worldState: {}, regionalGraph: {} }, pressures: { get: () => null }, tick: 200 };
    const ev = evaluateGoal(goal, gone);
    expect(ev.readable).toBe(false);
    expect(ev.value).toBeNull();
  });
});

describe('THE ATTRIBUTION RULE — office × domain, no full-credit free-riding', () => {
  it('the multi-claimant case: three NPCs satisfy conditions over ONE signal; credit differs by office and domain', () => {
    // One recovered signal: economic_capacity. Three claimants:
    //   (A) merchant faction, TOP rung  — full office, in-domain      ⇒ highest
    //   (B) merchant faction, 3rd rung  — reduced office, in-domain    ⇒ middle
    //   (C) civic faction,   TOP rung   — full office, OUT-of-domain   ⇒ lowest
    const civic = { name: 'City Council', category: 'civic' };
    const wA = attributionWeight(0, merchant, 'economic_capacity');
    const wB = attributionWeight(2, merchant, 'economic_capacity');
    const wC = attributionWeight(0, civic, 'economic_capacity');
    expect(factionDomainVars(merchant)[0]).toBe('economic_capacity'); // merchant owns the signal
    expect(factionDomainVars(civic).includes('economic_capacity')).toBe(false); // civic does not
    expect(wA).toBeGreaterThan(wB);            // office: the responsible seat out-credits the junior
    expect(wA).toBeGreaterThan(wC);            // domain: in-domain out-credits out-of-domain
    expect(wB).toBeGreaterThan(wC);            // even a junior in-domain beats a senior free-rider
    // No full-credit free-riding: the out-of-domain claimant is strictly discounted.
    expect(wC).toBeLessThanOrEqual(GOAL_TUNING.OUT_OF_DOMAIN_MULT);
    expect(wA).toBe(1); // the responsible in-domain office earns full credit
  });
});
