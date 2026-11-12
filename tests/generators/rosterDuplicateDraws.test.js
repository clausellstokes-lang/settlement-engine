/**
 * tests/generators/rosterDuplicateDraws.test.js — REVIEW-INTAKE-4 (the chair's ruling): the
 * same secret or the same short goal on two named figures of ONE roster is cured at the DRAW
 * SITES, not filtered after.
 *
 * Every writer of `npc.secret.what` and `npc.goal.short` refuses a text another figure of the
 * roster already holds and falls through its own pool in seed order (the index the seeded roll
 * landed on, then the next row, wrapping), with no further roll; a pool with every row held
 * leaves the figure without one from that writer rather than repeating. The writers: the
 * population draws (`npc/factionLeaderSecret.js`, `npcGenerator.js :: generateNPCGoal`), the
 * coherence overlay's secret (`npcGenerator.js :: generateCrimeLevel`), and the three goal
 * rewriters (`mergeNPCLists`' stress override, `npcStructure.js :: enrichNPCsWithStructure`,
 * `steps/corruptionPass.js`).
 *
 * MEASURED over the 1,000 soak births (`scripts/audit/soak-review/corpus.mjs :: birth`), by the
 * soak's own instrument (`checks.mjs :: rosterDuplicate`, the `coh:roster-duplicate-*` checks):
 * at the parent (the review-intake lane merged onto rung 1's tip, 5fa38798a) 428 rosters
 * carried a repeated secret and 609 a repeated goal.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { rosterDuplicate } from '../../scripts/audit/soak-review/checks.mjs';

const BIRTHS = 1000;
/** @type {{secret: string[], goal: string[]}} */
const offenders = { secret: [], goal: [] };
let rosters = 0;

beforeAll(async () => {
  await ensureLaws();
  for (let i = 0; i < BIRTHS; i++) {
    const { settlement } = birth(i);
    if ((settlement.npcs || []).length >= 2) rosters += 1;
    const secret = rosterDuplicate(settlement.npcs, (npc) => npc?.secret?.what);
    const goal = rosterDuplicate(settlement.npcs, (npc) => npc?.goal?.short);
    if (secret) offenders.secret.push(`soak1k-${i}: "${secret.text}" (${secret.first} · ${secret.second})`);
    if (goal) offenders.goal.push(`soak1k-${i}: "${goal.text}" (${goal.first} · ${goal.second})`);
  }
}, 600_000);

describe('REVIEW-INTAKE-4 — no roster carries one secret or one goal twice', () => {
  it('the corpus is live: the 1,000 births carry rosters of two or more', () => {
    // 2026-11-07 PEOPLE-1 CAST: 101 thorps and hamlets of the 1,000 carry ONE card (a roster with one face-bearing
    // house and no `other` power to mint beside it; the envelope thorp 0–5), measured at the lane's tip; 899 carry
    // two or more (the 952 read at 5f455dcb9 counted the population-step mints of powers the record did not carry).
    // RE-MEASURED 2026-11-12, COHERENCE-POWERS cure (i) (the chair's ruling of 2026-11-11, "ONE PERSON, ONE FACE"): where a
    // house of the town leads, the seat's house bears no face and no seat is minted beside it, so 65 more births (thorps and
    // hamlets whose one house now leads) carry ONE card: 834 carry two or more, measured by this file at the lane's tip.
    expect(rosters).toBe(834);
  });

  it('no roster repeats a secret', () => {
    expect(offenders.secret.slice(0, 5), `${offenders.secret.length} of ${BIRTHS} rosters repeat a secret`).toEqual([]);
  });

  it('no roster repeats a short goal', () => {
    expect(offenders.goal.slice(0, 5), `${offenders.goal.length} of ${BIRTHS} rosters repeat a goal`).toEqual([]);
  });
});
