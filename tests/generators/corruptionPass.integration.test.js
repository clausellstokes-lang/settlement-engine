import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { npcCorruptibleFlaw } from '../../src/domain/corruption.js';
import {
  allegianceOf, criminalHousesOf, criminalPowersOf, isCriminalFace,
  ALLEGIANCE_TUNING, ALLEGIANCE_VECTORS, ALLEGIANCE_VIAS, CORRUPT_SHORT_GOAL,
} from '../../src/domain/people/allegiance.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

// ALLEGIANCE-CAR1 (2026-11-08): the step corruptionPass is RETIRED (J-2). This file is rewritten IN PLACE as its
// successor's integration test: the hidden allegiance dealt at the coherence seam (domain/people/allegiance.js ::
// dealAllegiances → assignHandlers → leaveAllegianceReceipts), exercised through the REAL pipeline. The retired
// assertions map one to one: "corrupt iff a criminal institution" → an allegiance iff a criminal house WITH A FACE stands
// on the roster (J-4); corruptionVector → allegiance.vector; corruptTies.criminalInstitution → allegiance.house;
// corruptTies.thievesGuild → allegiance.power (set whenever the town holds a criminal power, J-1); the goal rewrite is
// kept (CORRUPT_SHORT_GOAL). Added by the successor's shape: the handler on the roster, the covert handler tie, the
// receipt. Asserts invariants rather than a seed-dependent outcome, so the test is stable while proving the wiring.
const gen = (seed) => generateSettlementPipeline(
  { settType: 'metropolis', culture: 'mediterranean', terrain: 'river', tradeRouteAccess: 'port' },
  null,
  { seed, customContent: {} },
);

const SEEDS = ['corr-1', 'corr-2', 'corr-3', 'corr-4', 'corr-5', 'corr-6'];
const RETIRED = ['corrupt', 'corruptionVector', 'corruptTies'];

describe('the hidden allegiance — generation-time deal (integration; the retired corruptionPass\'s successor)', () => {
  it('deals an allegiance iff a criminal house with a face stands, and every agent is fully wired', () => {
    let sawCriminalSettlement = false;
    let sawAgent = false;
    let sawCorruptGoal = false;

    const failures = collectSeedFailures(SEEDS, (seed) => {
      const s = gen(seed);
      const npcs = Array.isArray(s.npcs) ? s.npcs : [];
      const byId = new Map(npcs.map((n) => [n.id, n]));
      const houses = new Map(criminalHousesOf(s).map((h) => [h.name, h]));
      const powers = new Set(criminalPowersOf(s).map((p) => p.faction || p.name));
      const faced = npcs.some((n) => n?.institution?.kind === 'house' && houses.has(n.institution.key));
      const agents = npcs.filter((n) => allegianceOf(n));

      // the retired mark is gone from every card (the birth record carries none)
      for (const npc of npcs) for (const k of RETIRED) expect(k in npc, `${npc.id} carries the retired ${k}`).toBe(false);

      if (faced) {
        sawCriminalSettlement = true;
        // the roll ran over the cast: there are eligible cards (a corruptible flaw, not a criminal face)
        const eligible = npcs.filter((n) => npcCorruptibleFlaw(n) && !isCriminalFace(n, houses, powers));
        expect(eligible.length).toBeGreaterThan(0);
        const receipts = (s.simulationTrace || []).filter((t) => t?.step === 'people-allegiance');
        const ties = s.relationships || [];
        for (const npc of agents) {
          sawAgent = true;
          const a = allegianceOf(npc);
          // the shape: { power, house, vector, via, handler, share: 0.15, veiled: true, covert: true }
          expect(houses.has(a.house), `${npc.id}: the house is a roster criminal house`).toBe(true);
          expect(ALLEGIANCE_VECTORS).toContain(a.vector);
          expect(ALLEGIANCE_VIAS).toContain(a.via);
          expect(a.share).toBe(ALLEGIANCE_TUNING.share);
          expect(a.share).toBe(0.15);
          expect(a.veiled).toBe(true);
          expect(a.covert).toBe(true);
          if (powers.size) expect(powers.has(a.power), `${npc.id}: the power is the town's criminal power`).toBe(true);
          // the gate (J-3): a corruptible flaw, never an open criminal face
          expect(npcCorruptibleFlaw(npc), `${npc.id}: an agent has a corruptible flaw`).toBeTruthy();
          expect(isCriminalFace(npc, houses, powers), `${npc.id}: an agent is never a criminal face`).toBe(false);
          // the handler: a card on the roster, not the agent, holding no allegiance of its own
          const handler = byId.get(a.handler);
          expect(handler, `${npc.id}: the handler is on the roster`).toBeTruthy();
          expect(handler.id).not.toBe(npc.id);
          expect(allegianceOf(handler)).toBeNull();
          // the covert handler tie: the agent's tie runs to its handler, covert and marked
          const tie = ties.find((t) => t.from === npc.id && t.handler === true);
          expect(tie, `${npc.id}: the handler tie`).toBeTruthy();
          expect(tie.to).toBe(a.handler);
          expect(tie.covert).toBe(true);
          // the receipt: one people-allegiance trace per agent, with the four causes
          const mine = receipts.filter((t) => t.targetId === String(npc.id));
          expect(mine.length, `${npc.id}: one receipt`).toBe(1);
          const sources = mine[0].causes.map((c) => c.source);
          expect(sources).toEqual(expect.arrayContaining(['allegiance.gate', 'corruption.climate', `via.${a.via}`]));
          expect(sources.some((src) => /^flaw\./.test(src))).toBe(true);
          expect(mine[0].downstreamEffects.map((d) => d.target)).toEqual(expect.arrayContaining([a.house, a.handler]));
          // RE-KEYED (PEOPLE-1 CAST, dc655f712): a card whose goal pool is wholly held is born goal-less
          // (REVIEW-INTAKE-4's refusal); the rewrite reaches a card with a goal.
          if (npc.goal === null) continue;
          expect(npc.goal?.short).toBeTruthy(); // a goal survives the deal
          if (npc.goal.short === CORRUPT_SHORT_GOAL[a.vector]) sawCorruptGoal = true; // the compromised rewrite
        }
        // every receipt names an agent (no receipt for a card that holds none)
        for (const t of receipts) expect(allegianceOf(byId.get(t.targetId)), `receipt ${t.targetId}`).toBeTruthy();
        // every handler tie belongs to an agent
        for (const t of ties.filter((x) => x.handler === true)) expect(allegianceOf(byId.get(t.from))).toBeTruthy();
      } else {
        // no criminal house with a face → the rule forbids an allegiance (J-4)
        expect(agents.length).toBe(0);
      }
    });
    expectNoSeedFailures(failures, 'an allegiance is dealt iff a criminal house with a face is present');

    // A river-port metropolis across six seeds should surface a faced criminal house at least once, exercising the true path.
    expect(sawCriminalSettlement).toBe(true);
    // And with eligible cards under real crime pressure, an allegiance should be dealt.
    expect(sawAgent).toBe(true);
    // And at least one agent carries the compromised (rewritten) goal, so the goal arm is never vacuous.
    expect(sawCorruptGoal).toBe(true);
  });

  it('is deterministic — same seed yields identical allegiances', () => {
    const a = gen('corr-determinism');
    const b = gen('corr-determinism');
    const flagsOf = (s) => (s.npcs || []).map((n) => `${n.name}:${JSON.stringify(allegianceOf(n))}`);
    expect(flagsOf(a)).toEqual(flagsOf(b));
  });
});
