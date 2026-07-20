/**
 * contestBluffCharge.test.js — DEEP COUPLINGS D-4→D-2 THE BLUFF CHARGE (design §8 THE BLUFF).
 *
 * A contestant with a deceit flaw distorts what rivals hear; a bluff CONTRADICTED by the outcome
 * (bluffed AND lost) is "a lie, same as intel". The seam closes the loop the composite left DETECTED
 * but dropped (void res.bluffDeposits): the ladder DEPOSITS the exposure into the bluffExposures
 * sidecar (its own sanctioned write), and informationStatecraft CONSUMES it one tick later into a
 * PERSONAL credibility charge + the SAME lie-stigma the exposed-lie path mints — the ladder consuming
 * the lieExposure a further tick on. Mirror of the exposed-lie→credibility path; a REPUTATION cost,
 * never a fate (§0.5). Gated on contestedGoals ∧ npcCredibility ⇒ dark ⇒ byte-identical.
 */
import { describe, it, expect } from 'vitest';
import { advanceInformationStatecraft, credibilityScoreOf } from '../../src/domain/worldPulse/informationStatecraft.js';
import { advanceContests } from '../../src/domain/worldPulse/npcLadderContest.js';
import { advanceNpcLadder } from '../../src/domain/worldPulse/npcLadderKernel.js';
import { attributionWeight } from '../../src/domain/worldPulse/npcLadderGoals.js';
import { npcCredibilityScoreOf } from '../../src/domain/worldPulse/npcCredibility.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';

const rng = { fork: () => ({ random: () => 0 }) };

// ── THE SOURCE (pin advanceContests' bluffDeposit production — the loop's first link) ──
describe('D-4→D-2 source — advanceContests deposits a bluff exposure when a bluffer LOSES', () => {
  const gov = { faction: 'Crown', category: 'government' };
  const liar = { personality: { dominant: 'shrewd', flaw: 'deceitful', modifier: 'bold' } };
  const honest = { personality: { dominant: 'stern', flaw: 'proud', modifier: 'patient' } };
  const mkGoal = (v, threshold, start, progress) => ({
    condition: { version: 1, label: `${v}`, root: { kind: 'test', signalId: `causal.${v}.score`, settlementId: 's1', test: { op: 'gte', value: threshold } } },
    stakes: 1, horizonWeeks: 200, mintedWeek: 0, mintedRung: 0, startScore: start, progress, basis: 'raise',
  });
  const mkStanding = (goal, stock) => ({ stock, since: 0, week: 0, goal, stigma: null, grudges: {} });

  it('the LOSER who bluffed (deceit flaw + heardWeek set) is deposited; an honest loser is not', () => {
    // n_a fires first ⇒ n_b is forestalled (the loser). n_b's side heard the rival (heardWeek 12).
    const npcs = { n_a: mkStanding(mkGoal('ruling_authority', 78, 40, 1), 6), n_b: mkStanding(mkGoal('ruling_authority', 80, 45, 0.5), 6) };
    const priorContests = { 'contest.s1.ruling_authority.10': { id: 'contest.s1.ruling_authority.10', signalVar: 'ruling_authority', kind: 'convergent', a: { nid: 'n_a', verb: 'raise', awareSince: 12, heardProgress: 0.4, heardWeek: 12 }, b: { nid: 'n_b', verb: 'raise', awareSince: 12, heardProgress: 0.9, heardWeek: 12 }, openedWeek: 10, backedBy: null, resolvedWeek: null, outcome: null, loserNid: null } };
    const goalOutcomes = new Map([['n_a', { fired: true, expired: false, lapsed: false, signalVar: 'ruling_authority', endProgress: 1 }]]);
    const meta = (loserNpc) => new Map([
      ['n_a', { fkey: 'fac.crown', faction: gov, rungIndex: 0, rungCount: 2, npc: honest }],
      ['n_b', { fkey: 'fac.crown', faction: gov, rungIndex: 1, rungCount: 2, npc: loserNpc }],
    ]);
    const base = { sid: 's1', weeks: 30, tick: 30, seed: 'seed-1', townName: 'Town', worldState: { rngSeed: 'seed-1' }, priorContests, npcs, priorNpcs: npcs, goalOutcomes, remint: () => mkGoal('ruling_authority', 78, 50, 0), attributionWeight, memoryWeaveActive: false, now: null };
    const bluffed = advanceContests({ ...base, nidMeta: meta(liar) });
    expect(bluffed.contests['contest.s1.ruling_authority.10'].loserNid).toBe('n_b');
    expect(bluffed.bluffDeposits).toEqual([{ nid: 'n_b', band: 2 }]);
    // an honest loser deposits NOTHING (no bluff to contradict)
    expect(advanceContests({ ...base, nidMeta: meta(honest) }).bluffDeposits).toEqual([]);
  });
});

// ── THE CONSUME ARM (statecraft reads bluffExposures → the personal charge + the stigma deposit) ──
const bluffer = { id: 'schemer', name: 'The Schemer', importance: 'key' };
const byId = new Map([['court', { id: 'court', settlement: { npcs: [bluffer] } }]]);
const snapshot = { settlements: [{ id: 'court' }], byId };

/** Run the statecraft consume with a seeded bluffExposures sidecar. */
function consume({ depositTick, tick = 1, credLit = true }) {
  const rules = { infoStatecraftEnabled: true, infoMode: 'unreliable' };
  if (credLit) rules.npcCredibilityEnabled = true;
  const worldState = {
    simulationRules: rules, spatialCanonVersion: 1, calendar: { elapsedWeeks: 40 },
    spatialLedgers: { bluffExposures: { 'bluff.court:schemer.0': { nid: 'court:schemer', band: 2, depositTick } } },
  };
  return advanceInformationStatecraft({
    snapshot, worldState, graph: { edges: [] }, rng, tick, now: null,
    strengthOf: () => 0.5, alignmentOf: () => ({ malice01: 0.4, lawfulness01: 0.6 }), nameFor: (id) => String(id),
  }).worldState;
}

describe('D-4→D-2 consume — informationStatecraft charges the contradicted bluffer personally', () => {
  it('a couriered deposit (depositTick < now) charges the soul AND stamps the lie-stigma deposit', () => {
    const ws = consume({ depositTick: 0, tick: 1 });
    expect(npcCredibilityScoreOf(ws, 'court:schemer', 1)).toBeLessThan(0); // personal credibility falls
    // the lieExposure deposit is stamped so the ladder mints the exposed_liar stigma NEXT tick (mirror).
    expect(getSpatialLedger(ws, 'npcCredibility')['court:schemer'].lieExposure).toEqual({ tick: 1, band: 2 });
    // NO settlement-level charge: a private contest bluff implicates the soul, not the whole court.
    expect(getSpatialLedger(ws, 'credibility')).toBeFalsy();
  });
  it('ONE-TICK LAG: a deposit stamped THIS tick does NOT charge yet (the ladder runs LAST)', () => {
    const ws = consume({ depositTick: 1, tick: 1 });
    expect(getSpatialLedger(ws, 'npcCredibility')).toBeFalsy();
  });
  it('CREDIBILITY-DARK: npcCredibilityEnabled absent ⇒ no charge, no read (byte-identical)', () => {
    const ws = consume({ depositTick: 0, tick: 1, credLit: false });
    expect(getSpatialLedger(ws, 'npcCredibility')).toBeFalsy();
  });
});

// ── THE FULL CHAIN (bluff exposure → personal charge → ladder stigma), through the real movers ──
describe('D-4→D-2 lit walkthrough — a contradicted bluff becomes a personal charge, then a stigma', () => {
  const guild = { name: "Merchants' Guild", isGoverning: true, power: 60 };
  const npc = (id, name, importance) => ({ id, name, role: name, importance, factionAffiliation: "Merchants' Guild", personality: { dominant: 'shrewd', flaw: 'deceitful', modifier: 'bold' } });
  const court = { name: 'Ashford', tier: 'city', population: 9000, powerStructure: { factions: [guild], publicLegitimacy: { score: 55 } }, npcs: [npc('n_master', 'Guildmaster Aldric', 'pillar'), npc('n_factor', 'Factor Maera', 'key')], institutions: [], activeConditions: [] };
  const courtSnapshot = { settlements: [{ id: 'a', settlement: court }], byId: new Map([['a', { id: 'a', name: 'Ashford', settlement: court }]]) };

  it('T1 statecraft charges + deposits lieExposure; T2 the ladder consumes it into the stigma', () => {
    // ── T1: the ladder deposited a contradicted bluff for the Guildmaster last tick. ──
    let ws = {
      simulationRules: { npcCredibilityEnabled: true, npcLadderEnabled: true, infoStatecraftEnabled: true, infoMode: 'unreliable' },
      spatialCanonVersion: 1, calendar: { elapsedWeeks: 260 },
      spatialLedgers: { bluffExposures: { 'bluff.a:n_master.259': { nid: 'a:n_master', band: 2, depositTick: 259 } } },
    };
    ws = advanceInformationStatecraft({
      snapshot: courtSnapshot, worldState: ws, graph: { edges: [] }, rng, tick: 260, now: null,
      strengthOf: () => 0.5, alignmentOf: () => ({ malice01: 0.4, lawfulness01: 0.6 }), nameFor: (id) => String(id),
    }).worldState;
    expect(npcCredibilityScoreOf(ws, 'a:n_master', 260)).toBeLessThan(0);
    expect(ws.spatialLedgers.npcCredibility['a:n_master'].lieExposure).toEqual({ tick: 260, band: 2 });

    // ── T2: the ladder (Ashford's court) consumes the exposure → the lie-stigma. ──
    const ladder = advanceNpcLadder({
      snapshot: courtSnapshot, worldState: { ...ws, calendar: { elapsedWeeks: 261 } },
      settlementUpdates: [{ saveId: 'a', settlement: court }], tick: 261, now: null,
    });
    const st = ladder.worldState.spatialLedgers.npcLadder.a.npcs['a:n_master'];
    expect(st.stigma, 'the caught bluffer wears the exposed_liar stigma').toBeTruthy();
    expect(st.lastLieSeen).toBe(260);
    // NO-DEATH: the Guildmaster keeps his rung, marked.
    expect(ladder.worldState.spatialLedgers.npcLadder.a.factions).toBeTruthy();
  });
});

// ── THE LADDER SIDECAR (prune the consumed deposit; dormancy) ─────────────────────
describe('D-4→D-2 sidecar — the ladder is the sole writer/pruner of bluffExposures', () => {
  const guild = { name: 'Guild', isGoverning: true, power: 60 };
  const court = { name: 'Riverton', tier: 'city', population: 9000, powerStructure: { factions: [guild], publicLegitimacy: { score: 55 } }, npcs: [{ id: 'n1', name: 'One', role: 'One', importance: 'pillar', factionAffiliation: 'Guild', personality: { dominant: 'shrewd', flaw: 'proud', modifier: 'bold' } }], institutions: [], activeConditions: [] };
  const item = { id: 'r', name: 'Riverton', settlement: court };
  const snap = { settlements: [item], byId: new Map([['r', item]]) };

  function driveLadder({ bluffPrior, rules, weeks = 300, tick = 300 }) {
    const spatialLedgers = {};
    if (bluffPrior) spatialLedgers.bluffExposures = bluffPrior;
    const worldState = { simulationRules: rules, calendar: { elapsedWeeks: weeks }, ...(Object.keys(spatialLedgers).length ? { spatialLedgers } : {}) };
    return advanceNpcLadder({ snapshot: snap, worldState, settlementUpdates: [{ saveId: 'r', settlement: court }], tick, now: null });
  }

  it('PRUNE: a prior deposit (depositTick < now) is drained — it has served its one-tick courier', () => {
    const r = driveLadder({
      bluffPrior: { 'bluff.court:x.290': { nid: 'court:x', band: 2, depositTick: 290 } },
      rules: { npcLadderEnabled: true, contestedGoalsEnabled: true, npcCredibilityEnabled: true },
    });
    expect(getSpatialLedger(r.worldState, 'bluffExposures')).toBeFalsy(); // consumed ⇒ pruned
  });

  it('DORMANT: ladder lit but contestedGoals absent ⇒ no bluffExposures write ever (byte-identical)', () => {
    const r = driveLadder({ bluffPrior: null, rules: { npcLadderEnabled: true } });
    expect(getSpatialLedger(r.worldState, 'bluffExposures')).toBeFalsy();
  });
});

// ── END-TO-END WRITE (a real contest resolves through the full ladder ⇒ the sidecar deposit) ──
describe('D-4→D-2 end-to-end — a resolving contest with a bluffing loser writes the sidecar', () => {
  const liar = (id) => ({ id, name: id, role: id, importance: 'pillar', factionAffiliation: 'Crown', personality: { dominant: 'shrewd', flaw: 'deceitful', modifier: 'bold' } });
  const gov = { faction: 'Crown', category: 'government', isGoverning: true, power: 60 };
  const capital = { name: 'Capital', tier: 'city', population: 9000, powerStructure: { factions: [gov], publicLegitimacy: { score: 55 } }, npcs: [liar('n1'), liar('n2')], institutions: [], activeConditions: [] };
  // A ruling_authority goal poised to FIRE this tick (causal score 95 ≥ threshold 78).
  const goalRA = () => ({ condition: { version: 1, label: 'ruling_authority', root: { kind: 'test', signalId: 'causal.ruling_authority.score', settlementId: 'r', test: { op: 'gte', value: 78 } } }, stakes: 1, horizonWeeks: 200, mintedWeek: 250, mintedRung: 0, startScore: 40, progress: 0.9, basis: 'raise' });
  const standing = () => ({ stock: 6, since: 0, week: 258, goal: goalRA(), stigma: null, grudges: {} });
  const priorLadder = {
    r: {
      factions: { 'fac.crown': { rungs: ['r:n1', 'r:n2'], cooldownUntil: 0, lastPower: 60, instability: 0, week: 258 } },
      npcs: { 'r:n1': standing(), 'r:n2': standing() },
      contests: { 'contest.r.ruling_authority.250': { id: 'contest.r.ruling_authority.250', signalVar: 'ruling_authority', kind: 'convergent', a: { nid: 'r:n1', verb: 'raise', awareSince: 255, heardProgress: 0.4, heardWeek: 255 }, b: { nid: 'r:n2', verb: 'raise', awareSince: 255, heardProgress: 0.9, heardWeek: 255 }, openedWeek: 250, backedBy: null, resolvedWeek: null, outcome: null, loserNid: null } },
    },
  };
  const item = { id: 'r', name: 'Capital', settlement: capital, causal: { scores: { ruling_authority: 95 } } };
  const snap = { settlements: [item], byId: new Map([['r', item]]) };

  it('the loser (a bluffer) is deposited into bluffExposures, ready for D-2 to charge next tick', () => {
    const worldState = {
      simulationRules: { npcLadderEnabled: true, contestedGoalsEnabled: true, npcCredibilityEnabled: true },
      rngSeed: 'seed-x', calendar: { elapsedWeeks: 260 }, spatialLedgers: { npcLadder: priorLadder },
    };
    const r = advanceNpcLadder({ snapshot: snap, worldState, settlementUpdates: [{ saveId: 'r', settlement: capital }], tick: 260, now: null });
    const contest = r.worldState.spatialLedgers.npcLadder.r.contests['contest.r.ruling_authority.250'];
    expect(contest.resolvedWeek, 'the contest resolved this tick').toBe(260);
    const bluff = getSpatialLedger(r.worldState, 'bluffExposures');
    expect(bluff, 'a bluff exposure was deposited').toBeTruthy();
    const dep = Object.values(bluff)[0];
    expect(dep).toMatchObject({ nid: contest.loserNid, band: 2, depositTick: 260 });
  });
});
