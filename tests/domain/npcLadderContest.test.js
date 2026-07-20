/**
 * npcLadderContest.test.js — DEEP COUPLINGS D-4: THE CONTESTED GOALS CLASS pins
 * (DESIGN_DEEP_COUPLINGS.md §8, cluster D-4a..f). Exercises the pure contest machinery
 * directly: genesis collisions, awareness/staleness/bluff, tunnel-vision fixation, the
 * head-to-head resolution matrix, D-4f support goals + cascade + joining, the challenge-engine
 * inputs, and the state chokepoint round-trip. NO-DEATH is asserted throughout (goals resolve,
 * never fates; the rung roster is conserved by the kernel-level integration pins).
 */
import { describe, it, expect } from 'vitest';
import {
  CONTEST_TUNING, fixation01, goalVerb, goalThreshold, canonicalPair, contestPairKey,
  genesisContests, advanceAwareness, resolveContest, contestMargin, joinersFor,
  buildSupportGoal, contestChallengeInputs, advanceContests, contestBackingMark,
} from '../../src/domain/worldPulse/npcLadderContest.js';
import { attributionWeight } from '../../src/domain/worldPulse/npcLadderGoals.js';
import { normalizeContests, sortedContests, LADDER_TUNING } from '../../src/domain/worldPulse/npcLadderState.js';

// ── Fixture builders ──────────────────────────────────────────────────────────
/** A goal fixture (verb derives from startScore vs threshold). */
function mkGoal(v, threshold, start, opts = {}) {
  return {
    condition: { version: 1, label: `${v}≥${threshold}`, root: { kind: 'test', signalId: `causal.${v}.score`, settlementId: 's1', test: { op: 'gte', value: threshold } } },
    stakes: opts.stakes ?? 1, horizonWeeks: opts.horizon ?? 200, mintedWeek: opts.mintedWeek ?? 0,
    mintedRung: opts.rung ?? 0, startScore: start, progress: opts.progress ?? 0,
    basis: `${start < threshold ? 'raise' : 'hold'} ${v}`, ...(opts.supportOf ? { supportOf: opts.supportOf } : {}),
  };
}
function mkStanding(goal, opts = {}) {
  return { stock: opts.stock ?? 5, since: 0, week: opts.week ?? 0, goal, stigma: null, grudges: opts.grudges ?? {}, ...(opts.bonds ? { bonds: opts.bonds } : {}) };
}
const gov = { faction: 'Crown', category: 'government' };
const proud = { personality: { dominant: 'shrewd', flaw: 'proud', modifier: 'ambitious' } };
const pragmatic = { personality: { dominant: 'pragmatic', flaw: 'cautious', modifier: 'patient' } };
const neutral = { personality: { dominant: 'stern', flaw: 'greedy', modifier: 'stubborn' } }; // neither fixating nor rational

// ── §8 D-4a GENESIS ─────────────────────────────────────────────────────────────
describe('D-4a genesis — the settlement-wide collision scan', () => {
  it('CONVERGENT: two raisers within CONTEST_BAND on the same var mint one contest', () => {
    const npcs = { n_a: mkStanding(mkGoal('ruling_authority', 78, 40)), n_b: mkStanding(mkGoal('ruling_authority', 80, 45)) };
    const added = genesisContests({ sid: 's1', weeks: 20, npcs, liveContests: {} });
    const ids = Object.keys(added);
    expect(ids).toHaveLength(1);
    const c = added[ids[0]];
    expect(c.kind).toBe('convergent');
    expect([c.a.nid, c.b.nid].sort()).toEqual(['n_a', 'n_b']);
    expect(c.a.awareSince).toBeNull();
    expect(c.b.awareSince).toBeNull(); // both start UNKNOWING
    expect(c.id).toBe('contest.s1.ruling_authority.20');
  });
  it('two raisers OUTSIDE the band do NOT collide', () => {
    const npcs = { n_a: mkStanding(mkGoal('ruling_authority', 60, 40)), n_b: mkStanding(mkGoal('ruling_authority', 90, 45)) };
    expect(Object.keys(genesisContests({ sid: 's1', weeks: 20, npcs, liveContests: {} }))).toHaveLength(0);
  });
  it('OPPOSED: a raiser vs a holder BELOW the raiser target mints an opposed contest with verbs', () => {
    const npcs = { n_a: mkStanding(mkGoal('law_order', 78, 40)), n_b: mkStanding(mkGoal('law_order', 55, 60)) }; // b holds (start 60 ≥ 55)
    const added = genesisContests({ sid: 's1', weeks: 5, npcs, liveContests: {} });
    const c = added[Object.keys(added)[0]];
    expect(c.kind).toBe('opposed');
    expect(c.a.verb).toBe('raise'); // n_a raises law_order to 78
    expect(c.b.verb).toBe('hold'); // n_b holds at 55 (below the raiser target)
  });
  it('CAP: at most one contest per signalVar and CONTESTS_PER_SETTLEMENT_CAP live', () => {
    const npcs = {
      a1: mkStanding(mkGoal('ruling_authority', 78, 40)), a2: mkStanding(mkGoal('ruling_authority', 80, 42)),
      b1: mkStanding(mkGoal('economic_capacity', 70, 40)), b2: mkStanding(mkGoal('economic_capacity', 72, 41)),
      c1: mkStanding(mkGoal('law_order', 70, 40)), c2: mkStanding(mkGoal('law_order', 72, 41)),
    };
    const added = genesisContests({ sid: 's1', weeks: 1, npcs, liveContests: {} });
    expect(Object.keys(added).length).toBe(CONTEST_TUNING.CONTESTS_PER_SETTLEMENT_CAP);
  });
  it('support goals never contest (supportOf excluded from genesis)', () => {
    const npcs = { n_a: mkStanding(mkGoal('ruling_authority', 78, 40, { supportOf: 'n_b' })), n_b: mkStanding(mkGoal('ruling_authority', 80, 45)) };
    expect(Object.keys(genesisContests({ sid: 's1', weeks: 1, npcs, liveContests: {} }))).toHaveLength(0);
  });
});

// ── §8 D-4b TUNNEL VISION (fixation) ─────────────────────────────────────────────
describe('D-4b tunnel vision — the fixation read', () => {
  it('a pragmatic soul with no history is fully rational (fixation 0)', () => {
    expect(fixation01({ npc: pragmatic, grudgeSev: 0, grievance: 0 })).toBe(0);
  });
  it('a prideful soul with a grudge fixates; the rational discount lowers it', () => {
    const hot = fixation01({ npc: proud, grudgeSev: 0.8, grievance: 0 });
    const cool = fixation01({ npc: pragmatic, grudgeSev: 0.8, grievance: 0 });
    expect(hot).toBeGreaterThan(cool);
    expect(hot).toBeGreaterThan(0.4); // 0.5*0.8 + 0.4*1 = 0.8
  });
  it('grievanceLean feeds fixation (cross-faction memory-weave term)', () => {
    expect(fixation01({ npc: neutral, grudgeSev: 0, grievance: 1 })).toBeGreaterThan(0); // 0.3 × 1
  });
});

// ── §8 D-4b AWARENESS / staleness / bluff ────────────────────────────────────────
describe('D-4b awareness — discovery, staleness, the bluff, the odds discount', () => {
  const side = { nid: 'n_a', verb: 'raise', awareSince: null, heardProgress: null, heardWeek: null };
  const cfg = (over) => ({ side, rival: { nid: 'n_b', progress: 0.6, bluffs: false }, contestId: 'c1', seed: 'S', sameFaction: true, rivalMoved: true, fixation: 0, newsHeat: 0, ...over });
  it('discovery stamps awareSince + a heard snapshot (the discovery draw fires within the season)', () => {
    let hit = null;
    for (let t = 1; t <= 100 && !hit; t++) { const r = advanceAwareness(cfg({ tick: t, weeks: t, fixation: 1 })); if (r.discovered) hit = r; }
    expect(hit).toBeTruthy();
    expect(hit.side.awareSince).toBeGreaterThan(0);
    expect(hit.side.heardProgress).toBeGreaterThan(0);
  });
  it('the odds discount LOWERS a fixated observer\'s heard progress (underrating the despised rival)', () => {
    let compared = false;
    for (let t = 1; t <= 100 && !compared; t++) {
      const base = advanceAwareness(cfg({ tick: t, weeks: t, fixation: 0, rival: { nid: 'n_b', progress: 0.8, bluffs: false } }));
      const fixated = advanceAwareness(cfg({ tick: t, weeks: t, fixation: 1, rival: { nid: 'n_b', progress: 0.8, bluffs: false } }));
      if (base.discovered && fixated.discovered) { expect(fixated.side.heardProgress).toBeLessThan(base.side.heardProgress); compared = true; }
    }
    expect(compared).toBe(true);
  });
  it('a bluffing rival INFLATES what is heard vs an honest one', () => {
    let compared = false;
    for (let t = 1; t <= 100 && !compared; t++) {
      const honest = advanceAwareness(cfg({ tick: t, weeks: t, rival: { nid: 'n_b', progress: 0.4, bluffs: false } }));
      const lied = advanceAwareness(cfg({ tick: t, weeks: t, rival: { nid: 'n_b', progress: 0.4, bluffs: true } }));
      if (honest.discovered && lied.discovered) { expect(lied.side.heardProgress).toBeGreaterThan(honest.side.heardProgress); compared = true; }
    }
    expect(compared).toBe(true);
  });
});

// ── §8 D-4c RESOLUTION ───────────────────────────────────────────────────────────
describe('D-4c resolution — the head-to-head matrix', () => {
  const contest = { id: 'c1', signalVar: 'ruling_authority', kind: 'convergent', a: { nid: 'n_a', verb: 'raise' }, b: { nid: 'n_b', verb: 'raise' }, backedBy: null, resolvedWeek: null, outcome: null, loserNid: null };
  const m = (backed = false, joiners = 0) => ({ seatWeight: 3, stakes: 1, attribution: 1, backed, joiners });
  it('CONVERGENT one fires ⇒ finisher wins, rival forestalled', () => {
    const v = resolveContest({ contest, outA: { fired: true, expired: false, lapsed: false }, outB: null, marginA: m(), marginB: m(), seed: 'S' });
    expect(v.winner).toBe('a'); expect(v.loser).toBe('b'); expect(v.forestalled).toBe(true);
  });
  it('CONVERGENT both fire ⇒ backing tips the tie-break', () => {
    const backedA = resolveContest({ contest, outA: { fired: true }, outB: { fired: true }, marginA: m(true), marginB: m(false), seed: 'S' });
    expect(backedA.winner).toBe('a');
  });
  it('OPPOSED raiser fires ⇒ the holder LOSES', () => {
    const opp = { ...contest, kind: 'opposed', b: { nid: 'n_b', verb: 'hold' } };
    const v = resolveContest({ contest: opp, outA: { fired: true }, outB: null, marginA: m(), marginB: m(), seed: 'S' });
    expect(v.winner).toBe('a'); expect(v.loser).toBe('b'); expect(v.forestalled).toBe(false);
  });
  it('still LIVE when neither goal has resolved', () => {
    expect(resolveContest({ contest, outA: null, outB: null, marginA: m(), marginB: m(), seed: 'S' })).toBeNull();
  });
  it('a lapsed premise voids the contest (no consequence)', () => {
    const v = resolveContest({ contest, outA: { fired: false, expired: false, lapsed: true }, outB: null, marginA: m(), marginB: m(), seed: 'S' });
    expect(v.outcome).toBe('lapsed'); expect(v.loser).toBeNull();
  });
  it('joiners add margin (D-4f BOND_JOIN_MARGIN, capped)', () => {
    expect(contestMargin(m(false, 2))).toBeGreaterThan(contestMargin(m(false, 0)));
    expect(contestMargin(m(false, 5))).toBe(contestMargin(m(false, 2))); // JOIN_CAP_PER_SIDE
  });
});

// ── §8 D-4f JOINING ──────────────────────────────────────────────────────────────
describe('D-4f joining — bonded peers join a contestant', () => {
  it('joinersFor returns bonded peers above JOIN_BOND_FLOOR, capped, excluding the contestants', () => {
    const npcs = {
      n_a: mkStanding(mkGoal('x', 78, 40)),
      j1: mkStanding(mkGoal('x', 60, 40), { bonds: { n_a: { sev: 0.9, week: 0, kind: 'loyalty' } } }),
      j2: mkStanding(mkGoal('x', 60, 40), { bonds: { n_a: { sev: 0.5, week: 0, kind: 'friendship' } } }),
      j3: mkStanding(mkGoal('x', 60, 40), { bonds: { n_a: { sev: 0.2, week: 0, kind: 'friendship' } } }), // below floor
    };
    const joined = joinersFor(npcs, 'n_a', new Set(['n_a', 'n_b']));
    expect(joined).toContain('j1');
    expect(joined).not.toContain('j3'); // below JOIN_BOND_FLOOR
    expect(joined.length).toBeLessThanOrEqual(CONTEST_TUNING.JOIN_CAP_PER_SIDE);
  });
});

// ── D-4b CHALLENGE-ENGINE INPUTS ────────────────────────────────────────────────
describe('D-4b challenge inputs — the contested_goal window + rate multiplier', () => {
  it('a live contest yields its pair + directional rate multipliers; a resolved one yields a loser window', () => {
    const priorContests = {
      c1: { id: 'c1', signalVar: 'x', kind: 'convergent', a: { nid: 'n_a' }, b: { nid: 'n_b' }, resolvedWeek: null, loserNid: null },
      c2: { id: 'c2', signalVar: 'y', kind: 'opposed', a: { nid: 'n_c' }, b: { nid: 'n_d' }, resolvedWeek: 90, loserNid: 'n_d' },
    };
    const priorNpcs = { n_a: mkStanding(null, { grudges: { n_b: { sev: 0.6, week: 0 } } }), n_b: mkStanding(null) };
    const npcByNid = new Map([['n_a', proud], ['n_b', pragmatic]]);
    const out = contestChallengeInputs({ priorContests, priorNpcs, npcByNid, weeks: 95 });
    expect(out.contestPairs.has(contestPairKey('n_a', 'n_b'))).toBe(true);
    expect(out.loserWindowNids.has('n_d')).toBe(true);
    expect(out.rateMultDir.get('n_a|n_b')).toBeGreaterThan(1); // proud + grudge ⇒ tunnel-vision rate bias
  });
});

// ── State chokepoint round-trip ─────────────────────────────────────────────────
describe('D-4 state chokepoints — normalize/sort byte-stable round-trip', () => {
  it('an UNKNOWING side serializes compactly; a resolved contest carries its outcome', () => {
    const live = { c1: { id: 'c1', signalVar: 'x', kind: 'convergent', a: { nid: 'n_a', verb: 'raise', awareSince: null, heardProgress: null, heardWeek: null }, b: { nid: 'n_b', verb: 'raise', awareSince: 10, heardProgress: 0.4, heardWeek: 10 }, openedWeek: 5, backedBy: null, resolvedWeek: null, outcome: null, loserNid: null } };
    const sorted = sortedContests(live);
    expect(sorted.c1.a).toEqual({ nid: 'n_a', verb: 'raise' }); // null fog fields dropped
    expect(sorted.c1.b.heardProgress).toBe(0.4);
    expect('resolvedWeek' in sorted.c1).toBe(false); // live ⇒ dropped
    // round-trips through normalize identically
    const re = normalizeContests(sorted);
    expect(sortedContests(re)).toEqual(sorted);
  });
  it('empty contests serialize to null (drop-when-empty ⇒ byte-identical dark)', () => {
    expect(sortedContests({})).toBeNull();
    expect(sortedContests(undefined)).toBeNull();
  });
});

// ── ORCHESTRATOR integration (advanceContests) ──────────────────────────────────
describe('advanceContests — the settlement-wide pass', () => {
  const worldState = { rngSeed: 'seed-1' };
  function metaFor(nids, faction = gov) {
    const m = new Map();
    nids.forEach((nid, i) => m.set(nid, { fkey: 'fac.crown', faction, rungIndex: i, rungCount: nids.length, npc: proud }));
    return m;
  }
  it('genesis mints a contest from settled colliding primaries', () => {
    const npcs = { n_a: mkStanding(mkGoal('ruling_authority', 78, 40)), n_b: mkStanding(mkGoal('ruling_authority', 80, 45)) };
    const res = advanceContests({
      sid: 's1', weeks: 20, tick: 20, seed: 'seed-1', townName: 'Town', worldState,
      priorContests: {}, npcs, priorNpcs: {}, nidMeta: metaFor(['n_a', 'n_b']),
      goalOutcomes: new Map(), remint: () => null, attributionWeight, memoryWeaveActive: false, now: null,
    });
    expect(Object.keys(res.contests)).toHaveLength(1);
  });
  it('RESOLUTION: a finisher fires ⇒ the loser takes a STING and a typed contest grudge (NO-DEATH)', () => {
    const npcs = { n_a: mkStanding(mkGoal('ruling_authority', 78, 40, { progress: 1 }), { stock: 6 }), n_b: mkStanding(mkGoal('ruling_authority', 80, 45, { progress: 0.5 }), { stock: 6 }) };
    const priorContests = { 'contest.s1.ruling_authority.10': { id: 'contest.s1.ruling_authority.10', signalVar: 'ruling_authority', kind: 'convergent', a: { nid: 'n_a', verb: 'raise', awareSince: 12, heardProgress: 0.4, heardWeek: 12 }, b: { nid: 'n_b', verb: 'raise', awareSince: 12, heardProgress: 0.9, heardWeek: 12 }, openedWeek: 10, backedBy: null, resolvedWeek: null, outcome: null, loserNid: null } };
    const goalOutcomes = new Map([['n_a', { fired: true, expired: false, lapsed: false, signalVar: 'ruling_authority', endProgress: 1 }]]);
    const res = advanceContests({
      sid: 's1', weeks: 30, tick: 30, seed: 'seed-1', townName: 'Town', worldState,
      priorContests, npcs, priorNpcs: npcs, nidMeta: metaFor(['n_a', 'n_b']),
      goalOutcomes, remint: () => mkGoal('ruling_authority', 78, 50), attributionWeight, memoryWeaveActive: false, now: null,
    });
    const c = res.contests['contest.s1.ruling_authority.10'];
    expect(c.resolvedWeek).toBe(30);
    expect(c.loserNid).toBe('n_b');
    // the loser carries a TYPED contest grudge toward the winner, and is STILL PRESENT (no-death)
    expect(res.npcs.n_b).toBeTruthy();
    expect(res.npcs.n_b.grudges.n_a).toBeTruthy();
    expect(res.npcs.n_b.grudges.n_a.kind).toMatch(/contest/);
    // a resolution news beat was minted
    expect(res.news.some((n) => n.impactKind === 'npc_contest')).toBe(true);
  });
  it('D-4f CASCADE: a support goal fails the same tick its patron\'s goal fails', () => {
    const supporter = mkStanding(mkGoal('ruling_authority', 78, 40, { supportOf: 'n_pat', progress: 0.3 }), { bonds: { n_pat: { sev: 0.9, week: 0, kind: 'loyalty' } } });
    const npcs = { n_sup: supporter, n_pat: mkStanding(mkGoal('ruling_authority', 78, 40, { progress: 0.3 })) };
    // the patron's goal EXPIRED un-fired this tick
    const goalOutcomes = new Map([['n_pat', { fired: false, expired: true, lapsed: false, signalVar: 'ruling_authority', endProgress: 0.3 }]]);
    let reminted = false;
    const res = advanceContests({
      sid: 's1', weeks: 30, tick: 30, seed: 'seed-1', townName: 'Town', worldState,
      priorContests: {}, npcs, priorNpcs: npcs, nidMeta: metaFor(['n_pat', 'n_sup']),
      goalOutcomes, remint: () => { reminted = true; return mkGoal('economic_capacity', 60, 40); }, attributionWeight, memoryWeaveActive: true, now: null,
    });
    // the supporter's linked goal cascaded to a fresh (non-support) primary
    expect(res.npcs.n_sup.goal.supportOf).toBeUndefined();
    expect(reminted).toBe(true);
    expect(res.news.some((n) => n.impactKind === 'npc_support')).toBe(true);
  });
  it('D-4f CONTEST-SUPPORT: a bonded peer joins the WINNER\'s side and the win STRENGTHENS the bond', () => {
    const npcs = {
      n_a: mkStanding(mkGoal('ruling_authority', 78, 40, { progress: 1 }), { stock: 6 }),
      n_b: mkStanding(mkGoal('ruling_authority', 80, 45, { progress: 0.5 }), { stock: 6 }),
      // a rung-holder bonded to n_a above JOIN_BOND_FLOOR ⇒ he takes the field on n_a's side
      j1: mkStanding(mkGoal('economic_capacity', 60, 40), { bonds: { n_a: { sev: 0.6, week: 0, kind: 'loyalty' } } }),
    };
    const priorContests = { 'contest.s1.ruling_authority.10': { id: 'contest.s1.ruling_authority.10', signalVar: 'ruling_authority', kind: 'convergent', a: { nid: 'n_a', verb: 'raise', awareSince: 12, heardProgress: 0.4, heardWeek: 12 }, b: { nid: 'n_b', verb: 'raise', awareSince: 12, heardProgress: 0.9, heardWeek: 12 }, openedWeek: 10, backedBy: null, resolvedWeek: null, outcome: null, loserNid: null } };
    const goalOutcomes = new Map([['n_a', { fired: true, expired: false, lapsed: false, signalVar: 'ruling_authority', endProgress: 1 }]]);
    const res = advanceContests({
      sid: 's1', weeks: 30, tick: 30, seed: 'seed-1', townName: 'Town', worldState,
      priorContests, npcs, priorNpcs: npcs, nidMeta: metaFor(['n_a', 'n_b', 'j1']),
      goalOutcomes, remint: () => mkGoal('ruling_authority', 78, 50), attributionWeight, memoryWeaveActive: true, now: null,
    });
    // n_a prevailed; his bonded backer j1 shared the victory ⇒ the bond deepened (sev rose above 0.6)
    expect(res.contests['contest.s1.ruling_authority.10'].outcome).toBe('a_finished');
    expect(res.npcs.j1.bonds.n_a.sev).toBeGreaterThan(0.6);
  });
  it('§10.5 CROSS-FACTION loss deposits a faction-pair incident (memoryWeave lit); same-faction / dark ⇒ none', () => {
    const npcs = { n_a: mkStanding(mkGoal('ruling_authority', 78, 40, { progress: 1 }), { stock: 6 }), n_b: mkStanding(mkGoal('ruling_authority', 80, 45, { progress: 0.5 }), { stock: 6 }) };
    const priorContests = { 'contest.s1.ruling_authority.10': { id: 'contest.s1.ruling_authority.10', signalVar: 'ruling_authority', kind: 'convergent', a: { nid: 'n_a', verb: 'raise', awareSince: 12, heardProgress: 0.4, heardWeek: 12 }, b: { nid: 'n_b', verb: 'raise', awareSince: 12, heardProgress: 0.9, heardWeek: 12 }, openedWeek: 10, backedBy: null, resolvedWeek: null, outcome: null, loserNid: null } };
    const goalOutcomes = new Map([['n_a', { fired: true, expired: false, lapsed: false, signalVar: 'ruling_authority', endProgress: 1 }]]);
    // cross-faction meta: n_a in fac.crown, n_b in fac.watch
    const crossMeta = new Map([
      ['n_a', { fkey: 'fac.crown', faction: gov, rungIndex: 0, rungCount: 1, npc: proud }],
      ['n_b', { fkey: 'fac.watch', faction: gov, rungIndex: 0, rungCount: 1, npc: proud }],
    ]);
    const base = { sid: 's1', weeks: 30, tick: 30, seed: 'seed-1', townName: 'Town', worldState, priorContests, npcs, priorNpcs: npcs, goalOutcomes, remint: () => mkGoal('ruling_authority', 78, 50), attributionWeight, now: null };
    const litCross = advanceContests({ ...base, nidMeta: crossMeta, memoryWeaveActive: true });
    expect(litCross.factionPairDeposits.length).toBe(1);
    expect(litCross.factionPairDeposits[0].type).toBe('contest_loss');
    // same faction ⇒ no faction-pair edge ⇒ no deposit
    const sameMeta = new Map([
      ['n_a', { fkey: 'fac.crown', faction: gov, rungIndex: 0, rungCount: 2, npc: proud }],
      ['n_b', { fkey: 'fac.crown', faction: gov, rungIndex: 1, rungCount: 2, npc: proud }],
    ]);
    expect(advanceContests({ ...base, nidMeta: sameMeta, memoryWeaveActive: true }).factionPairDeposits.length).toBe(0);
    // memoryWeave dark ⇒ no deposit even cross-faction
    expect(advanceContests({ ...base, nidMeta: crossMeta, memoryWeaveActive: false }).factionPairDeposits.length).toBe(0);
  });
  it('D-4f support/join is inert when memoryWeave is DARK (no bonds ⇒ no conversion, no joiners)', () => {
    const npcs = { n_sup: mkStanding(mkGoal('ruling_authority', 78, 40), { bonds: { n_pat: { sev: 0.9, week: 0, kind: 'loyalty' } } }), n_pat: mkStanding(mkGoal('ruling_authority', 78, 40)) };
    const res = advanceContests({
      sid: 's1', weeks: 30, tick: 30, seed: 'seed-1', townName: 'Town', worldState,
      priorContests: {}, npcs, priorNpcs: npcs, nidMeta: metaFor(['n_pat', 'n_sup']),
      goalOutcomes: new Map(), remint: () => null, attributionWeight, memoryWeaveActive: false, now: null,
    });
    // no support conversion happened (memoryWeave dark) — the supporter keeps its primary
    expect(res.npcs.n_sup.goal.supportOf).toBeUndefined();
  });
});

// ── §8 D-4e THE PLAYER SIDING (the champion producer) ────────────────────────────
describe('D-4e player siding — the champion producer (marker → backedBy consume)', () => {
  const worldState = { rngSeed: 'seed-1' };
  const ID = 'contest.s1.ruling_authority.10';
  const marked = (/** @type {string} */ contestId) => ({ ...proud, contestBacking: contestId });
  const liveContest = (/** @type {'a'|'b'|null} */ backedBy = null) => ({
    [ID]: {
      id: ID, signalVar: 'ruling_authority', kind: 'convergent',
      a: { nid: 'n_a', verb: 'raise', awareSince: 12, heardProgress: 0.4, heardWeek: 12 },
      b: { nid: 'n_b', verb: 'raise', awareSince: 12, heardProgress: 0.9, heardWeek: 12 },
      openedWeek: 10, backedBy, resolvedWeek: null, outcome: null, loserNid: null,
    },
  });
  const metaWith = (/** @type {any} */ aNpc, /** @type {any} */ bNpc) => new Map([
    ['n_a', { fkey: 'fac.crown', faction: gov, rungIndex: 0, rungCount: 2, npc: aNpc }],
    ['n_b', { fkey: 'fac.crown', faction: gov, rungIndex: 1, rungCount: 2, npc: bNpc }],
  ]);
  const advance = (/** @type {any} */ nidMeta, /** @type {any} */ priorContests) => advanceContests({
    sid: 's1', weeks: 30, tick: 30, seed: 'seed-1', townName: 'Town', worldState,
    priorContests, npcs: { n_a: mkStanding(mkGoal('ruling_authority', 78, 40)), n_b: mkStanding(mkGoal('ruling_authority', 80, 45)) },
    priorNpcs: {}, nidMeta, goalOutcomes: new Map(), remint: () => null, attributionWeight, memoryWeaveActive: false, now: null,
  });

  it('a champion-npc marker on a contestant folds into backedBy (the DM sided; the mover reacted)', () => {
    expect(advance(metaWith(marked(ID), proud), liveContest()).contests[ID].backedBy).toBe('a');
    expect(advance(metaWith(proud, marked(ID)), liveContest()).contests[ID].backedBy).toBe('b');
  });
  it('contest-SCOPED: a stale marker (a different, resolved contest id) never re-fires', () => {
    const res = advance(metaWith(marked('contest.s1.ruling_authority.99'), proud), liveContest());
    expect(res.contests[ID].backedBy).toBeNull();
  });
  it('idempotent: an already-backed contest is not flipped by a marker on the other side', () => {
    expect(advance(metaWith(proud, marked(ID)), liveContest('a')).contests[ID].backedBy).toBe('a');
  });
  it('contestBackingMark reads the save-npc marker; unmarked / null ⇒ empty', () => {
    expect(contestBackingMark({ contestBacking: 'x' })).toBe('x');
    expect(contestBackingMark(proud)).toBe('');
    expect(contestBackingMark(null)).toBe('');
  });
  it('shifts the resolution: with equal claims, the backed side takes a both-fire tie', () => {
    const contest = liveContest()[ID];
    const m = (/** @type {boolean} */ backed) => ({ seatWeight: 1, stakes: 1, attribution: 1, backed, joiners: 0 });
    expect(contestMargin(m(true))).toBeGreaterThan(contestMargin(m(false)));
    const v = resolveContest({ contest, outA: { fired: true }, outB: { fired: true }, marginA: m(true), marginB: m(false), seed: 'seed-1' });
    expect(v.winner).toBe('a'); // the backed side prevails the dead heat
  });
});

// ── helpers sanity ──────────────────────────────────────────────────────────────
describe('contest helpers', () => {
  it('goalVerb / goalThreshold read the stored condition', () => {
    expect(goalVerb(mkGoal('x', 78, 40))).toBe('raise');
    expect(goalVerb(mkGoal('x', 55, 60))).toBe('hold');
    expect(goalThreshold(mkGoal('x', 78, 40))).toBe(78);
  });
  it('canonicalPair / contestPairKey are codepoint-canonical (order-independent)', () => {
    expect(contestPairKey('z', 'a')).toBe(contestPairKey('a', 'z'));
    expect(canonicalPair('z', 'a')).toEqual({ aNid: 'a', bNid: 'z' });
  });
  it('buildSupportGoal references the patron condition + carries supportOf', () => {
    const patron = mkGoal('ruling_authority', 78, 40, { progress: 0.5 });
    const sg = buildSupportGoal(patron, 'n_pat', 10, 1);
    expect(sg.supportOf).toBe('n_pat');
    expect(sg.condition).toBe(patron.condition);
    expect(sg.progress).toBe(0.5);
  });
  it('JOIN_BOND_FLOOR / SUPPORT_BOND_FLOOR are the inherited D-7e floors', () => {
    expect(LADDER_TUNING.JOIN_BOND_FLOOR).toBe(0.4);
    expect(LADDER_TUNING.SUPPORT_BOND_FLOOR).toBe(0.5);
  });
});
