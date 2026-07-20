/**
 * npcLadderContest.js — DEEP COUPLINGS D-4: THE CONTESTED GOALS CLASS
 * (a lazy sibling leaf of npcLadderKernel.js; DESIGN_DEEP_COUPLINGS.md §8, cluster D-4a..f).
 *
 * Two named NPCs discover they pursue the SAME ambition — or opposing ones — and the
 * resolution is HEAD-TO-HEAD, judged against the peer (relative seat/stakes/attribution +
 * backing + the knowing-information advantage), NOT the solo goal threshold. A contest is a
 * NEW goal SHAPE laid over the ladder's own goals — it NEVER writes standing itself: the
 * ladder OWNS standing (single-writer §5), a contest deposits its stings/grudges/bonds
 * through the ladder kernel's own writers, and its awareness/discovery is a THIRD sub-key on
 * the ladder record (contests, beside factions/npcs). V1 SCOPE CUT (§8): goals are
 * settlement-scoped causal conditions ⇒ colliding goals are SAME-SETTLEMENT; cross-border
 * genesis is a vNext seam (§15). Its OUTCOME channel already exists (D-7f elite bleed).
 *
 * THE FOUR DETERMINISM DISCIPLINES (§8, binding): (i) genesis is a SEPARATE settlement-wide
 * pass AFTER the per-faction goal-mint loops (never inside applyGoalLifecycle — the
 * double-mint race) so cross-faction pairs are visible; (ii) every pair-keyed fork label
 * CANONICALIZES the two npcIds by codepoint sort before building the label; (iii) all
 * standing writes are PLAN-THEN-APPLY (collected, applied in one block after resolution — the
 * challenge kernel's :374-381 precedent); (iv) contests iterate in codepoint-sorted id order.
 *
 * NO-DEATH (§9 / §0.5): a contest resolves a GOAL, never a fate. A loser takes a standing
 * STING + a decaying typed grudge (the loss→grievance→fixation loop) through the ladder's own
 * writer; the rung roster stays a permutation; no named soul is removed, killed, or disappeared.
 *
 * RNG: hash01 over the world seed string (the challengeDraw idiom — NO rng.fork; the ladder is
 * rng-free) with canonicalized pair labels: `ladder-contest:aware:${id}:${nid}:${tick}`
 * (discovery) · `ladder-contest:resolve:${id}` (tie-break) · `ladder-contest:bluff:${id}:${nid}:${week}`
 * (skew) · `ladder-support:${sid}:${nid}:${year}` (tick-invariant support-goal cadence).
 *
 * Pure, deterministic, side-effect-free, clock-free. Gated by the caller on
 * contestedGoalsEnabled ∧ npcLadderEnabled; D-4f (support/join) additionally on memoryWeave.
 *
 * @enforced-by tests/domain/npcLadderContest.test.js, tests/property/contestedGoalsDormancyGolden.test.js
 */
import { hash01 } from '../region/contestMath.js';
import { clamp, clamp01 } from '../../kernel/math.js';
import { grievanceLean } from './grievanceRead.js';
import { factionPairOf } from './factionPairLedger.js';
import { goalSignalVar } from './npcLadderGoals.js';
import {
  LADDER_TUNING, num, asObject, compareCodepoint, round4, bondedPeersAbove,
} from './npcLadderState.js';

// ── Tuning (JUDGMENT — say "veto" to retune; §14 Q6 owner-gated, default = as specified) ──
export const CONTEST_TUNING = Object.freeze({
  // GENESIS: convergent = both `raise` toward thresholds within this many points (a race for
  // the same deed); at most ONE contest per signalVar per settlement, CAP live per settlement.
  CONTEST_BAND: 8,
  CONTESTS_PER_SETTLEMENT_CAP: 2,
  // AWARENESS (§8 D-4b): both sides start UNKNOWING; a per-advance discovery draw, court gossip
  // (same faction) and visible deeds (rival moved) amplify it, bounded. Re-hears refresh the
  // STALE snapshot at a lower rate (the contestant acts on old intelligence).
  DISCOVER_BASE: 0.04,
  DISCOVER_SAME_FACTION_MULT: 3.0,
  DISCOVER_MOVED_MULT: 2.0,
  DISCOVER_CAP: 0.35,
  REHEAR_MULT: 0.4,
  MOVED_EPS: 0.01,
  // THE BLUFF (§8 D-2 coupling): a deceitful contestant inflates what rivals hear; a bluff
  // CONTRADICTED by the outcome (bluffed AND lost) deposits a deception exposure D-2 consumes.
  BLUFF_SKEW: 0.2,
  // TUNNEL VISION (§8, owner refinement): fixation01 = 0.5·grudge + 0.3·grievanceLean +
  // 0.4·fixatingTrait − 0.5·rationalTrait, clamped 0..1. Biases three EXISTING draws:
  // (a) ENTRY — discovery rate & the contested_goal attempt rate ×(1 + gain·fixation);
  // (b) ODDS — heardProgress discounted ×(1 − discount·fixation) (he underrates the man he
  // despises); (c) AFTERMATH — the loss mints a typed grudge (a fixated loser one step deeper).
  FIXATION_GRUDGE_W: 0.5,
  FIXATION_GRIEVANCE_W: 0.3,
  FIXATION_TRAIT_W: 0.4,
  FIXATION_RATIONAL_W: 0.5,
  FIXATION_RATE_GAIN: 0.5,
  FIXATION_ODDS_DISCOUNT: 0.3,
  FIXATION_GRUDGE_DEEPEN: 0.15, // a fixated loser's grudge lands this much deeper (bounded by cap)
  // RESOLUTION (§8 D-4c): the forestalled rival keeps banked progress, books the terminal
  // deposit × MULT, takes a small STING, and mints a contest grudge; an opposed loser opens
  // the contested_goal window for a season. Tie-break = enumerated margin + a hash01 jitter.
  FORESTALLED_MULT: 0.25,
  STING_STAND: 0.5,
  WINDOW_SEASON_WEEKS: 13,
  CONTEST_LOSS_GRUDGE_SEV: 0.5,
  // A CROSS-FACTION contest loss also deposits a typed faction-pair incident (D-4c aftermath /
  // §10.5) when memoryWeave is lit — the loss→faction-pair-resentment→future-fixation loop the
  // grievanceLean read consumes. Gated: same-faction ⇒ no deposit; memoryWeave dark ⇒ no deposit.
  CONTEST_LOSS_PAIR_RESENTMENT: 0.15,
  CONTEST_LOSS_PAIR_SEV: 0.3,
  RESOLVE_JITTER: 0.05,
  // BACKING (D-4e player siding) + JOINING (D-4f bonded peers): margin bonuses on the tie-break.
  BACKED_MARGIN: 0.15,
  BOND_JOIN_MARGIN: 0.10,
  JOIN_CAP_PER_SIDE: 2,
  // D-4f SUPPORT GOALS: a supporter books attributionWeight × SHARE as the patron advances.
  SUPPORT_SHARE: 0.4,
  SUPPORT_BOND_DEEPEN: 0.5, // a shared victory forges friendship (both directions)
  SUPPORT_CONVERT_P: 0.5,   // the yearly seeded chance a strong-bonded backer mints a support goal
});

// The fixation trait sets (§8): a prideful/vengeful soul fixates; a pragmatic one stays rational.
const FIXATING_TRAITS = new Set(['proud', 'vengeful', 'zealous', 'arrogant', 'ruthless']);
const RATIONAL_TRAITS = new Set(['pragmatic', 'cautious', 'prudent', 'patient']);
const BLUFF_TRAITS = new Set(['deceitful', 'manipulative', 'mendacious']);

/** The core trait words of an NPC (dominant/flaw/modifier), lowercased. @param {Record<string, unknown>} npc @returns {string[]} */
export function traitWordsOf(npc) {
  const p = asObject(npc).personality;
  if (typeof p === 'string') return [p.toLowerCase()];
  if (Array.isArray(p)) return p.filter((x) => typeof x === 'string').map((x) => String(x).toLowerCase());
  const o = asObject(p);
  return [o.dominant, o.flaw, o.modifier].filter((x) => typeof x === 'string').map((x) => String(x).toLowerCase());
}
const hasAny = (/** @type {string[]} */ traits, /** @type {Set<string>} */ set) => traits.some((t) => set.has(t));

// ── The goal shape reads a contest needs (verb / threshold, from the stored condition) ────
/** The goal's threshold (the `gte` test value). @param {import('./npcLadderKernel.js').LadderGoal|null|undefined} goal @returns {number} */
export function goalThreshold(goal) {
  const test = asObject(asObject(asObject(goal).condition).root).test;
  return num(asObject(test).value, NaN);
}
/** The goal's verb — 'raise' (below threshold at mint) or 'hold' (at/above). @param {import('./npcLadderKernel.js').LadderGoal|null|undefined} goal @returns {'raise'|'hold'|''} */
export function goalVerb(goal) {
  const g = asObject(goal);
  if (!g.condition) return '';
  const t = goalThreshold(goal);
  if (!Number.isFinite(t)) return '';
  return num(g.startScore, t) < t ? 'raise' : 'hold';
}

/** The canonical (codepoint-sorted) 'a'/'b' assignment for two nids: a.nid ≤ b.nid. Pure.
 *  @param {string} x @param {string} y @returns {{ aNid: string, bNid: string }} */
export function canonicalPair(x, y) {
  return compareCodepoint(String(x), String(y)) <= 0 ? { aNid: String(x), bNid: String(y) } : { aNid: String(y), bNid: String(x) };
}
/** The canonical pair key `${min}|${max}` (fork-label + membership base). @param {string} x @param {string} y @returns {string} */
export function contestPairKey(x, y) {
  const { aNid, bNid } = canonicalPair(x, y);
  return `${aNid}|${bNid}`;
}

// ── TUNNEL VISION — the fixation read (§8; EXISTING state only, no new memory machinery) ──
/**
 * fixation01 for a contestant toward a specific rival: grudge (the ladder's own rivalry memory)
 * + grievanceLean (the memory-weave faction-pair edge, cross-faction only) + a fixating
 * personality, less a rational one. Clamped 0..1. Pure. A pragmatic soul with no history ⇒ 0.
 * @param {{ npc: Record<string, unknown>, grudgeSev: number, grievance: number }} a @returns {number}
 */
export function fixation01({ npc, grudgeSev, grievance }) {
  const T = CONTEST_TUNING;
  const traits = traitWordsOf(npc);
  return clamp01(
    T.FIXATION_GRUDGE_W * clamp01(num(grudgeSev, 0))
    + T.FIXATION_GRIEVANCE_W * clamp01(num(grievance, 0))
    + T.FIXATION_TRAIT_W * (hasAny(traits, FIXATING_TRAITS) ? 1 : 0)
    - T.FIXATION_RATIONAL_W * (hasAny(traits, RATIONAL_TRAITS) ? 1 : 0),
  );
}

/** The grudge severity a standing holds toward another npc (0 when none). @param {import('./npcLadderKernel.js').LadderStanding|null|undefined} st @param {string} otherNid @returns {number} */
function grudgeSevToward(st, otherNid) {
  const g = st && st.grudges ? st.grudges[otherNid] : null;
  return g && typeof g.sev === 'number' ? g.sev : 0;
}

/**
 * D-4e THE PLAYER SIDING marker (§8): the contest id the DM backed this contestant in, read off
 * the contestant's SAVE npc record where the `champion-npc` store op stamps it (npc.contestBacking).
 * This pass is the ONLY reader — the deposit-and-consume contract (law 5): the op writes a marker,
 * the mover folds it into ContestRec.backedBy. Scoped to a specific contest id so a stale mark
 * (left after that contest resolves) never re-fires on a later contest. Pure; '' when unmarked.
 * @param {Record<string, unknown>|null|undefined} npc @returns {string}
 */
export function contestBackingMark(npc) {
  const m = asObject(npc).contestBacking;
  return typeof m === 'string' ? m : '';
}

/**
 * The cross-faction grievance lean between two contestants' factions via the D-7c faction-pair
 * ledger (memoryWeave only; same faction ⇒ 0 by construction — no faction-pair edge). Pure.
 * @param {Record<string, unknown>} worldState @param {string} fkeyFrom @param {string} fkeyTo
 * @param {number} tick @param {boolean} memoryWeaveActive @returns {number}
 */
export function pairGrievance(worldState, fkeyFrom, fkeyTo, tick, memoryWeaveActive) {
  if (!memoryWeaveActive || !fkeyFrom || !fkeyTo || fkeyFrom === fkeyTo) return 0;
  const rec = /** @type {{ resentment?: number, incidents?: Array<{ type?: string, tick?: number }> }|null} */ (factionPairOf(worldState, fkeyFrom, fkeyTo));
  if (!rec) return 0;
  // Adapt the faction-pair record ({trust, resentment, incidents}) to the grievanceRead shape.
  return grievanceLean({ resentment: rec.resentment, memoryScore: 0, recentIncidents: rec.incidents }, tick);
}

// ── CHALLENGE-ENGINE INPUTS (read PRIOR contests; consumed by resolveFactionChallenges) ──
/**
 * From the PRIOR tick's contests (cross-tick, law 14): the live contest pairs (the
 * contested_goal window opens on adjacent same-faction rivals), the recent opposed/convergent
 * losers still inside the window season, and the DIRECTIONAL fixation lookup for the challenge
 * attempt-rate bias. Intra-faction only reaches the challenge loop (a cross-faction pair is
 * never adjacent in one faction's rungs) so grievanceLean is 0 here (same faction). Pure.
 * @param {Object} a
 * @param {Record<string, import('./npcLadderKernel.js').ContestRec>} a.priorContests
 * @param {Record<string, import('./npcLadderKernel.js').LadderStanding>} a.priorNpcs
 * @param {Map<string, Record<string, unknown>>} a.npcByNid
 * @param {number} a.weeks
 * @returns {{ contestPairs: Set<string>, loserWindowNids: Set<string>, rateMultDir: Map<string, number> }}
 */
export function contestChallengeInputs({ priorContests, priorNpcs, npcByNid, weeks }) {
  const T = CONTEST_TUNING;
  /** @type {Set<string>} */
  const contestPairs = new Set();
  /** @type {Set<string>} */
  const loserWindowNids = new Set();
  // The DIRECTIONAL challenge attempt-rate MULTIPLIER (1 + gain·fixation) — precomputed so the
  // challenge engine stays contest-agnostic (no cross-import; the gain lives here).
  /** @type {Map<string, number>} */
  const rateMultDir = new Map();
  const contests = asObject(priorContests);
  for (const id of Object.keys(contests).sort(compareCodepoint)) {
    const c = /** @type {import('./npcLadderKernel.js').ContestRec} */ (contests[id]);
    if (!c || !c.a || !c.b) continue;
    if (c.resolvedWeek == null) {
      contestPairs.add(contestPairKey(c.a.nid, c.b.nid));
      for (const [from, to] of [[c.a.nid, c.b.nid], [c.b.nid, c.a.nid]]) {
        const fix = fixation01({ npc: npcByNid.get(from) || {}, grudgeSev: grudgeSevToward(priorNpcs[from], to), grievance: 0 });
        rateMultDir.set(`${from}|${to}`, 1 + T.FIXATION_RATE_GAIN * fix);
      }
    } else if (weeks - c.resolvedWeek < T.WINDOW_SEASON_WEEKS && c.loserNid) {
      loserWindowNids.add(String(c.loserNid));
    }
  }
  return { contestPairs, loserWindowNids, rateMultDir };
}

// ── GENESIS (§8 D-4a) — the settlement-wide collision scan ────────────────────────────────
/**
 * Scan the settled goals of DISTINCT rung-holders for COLLISIONS on the same signalVar and mint
 * new contests. Convergent = both `raise` within CONTEST_BAND; opposed = one `raise`, one `hold`
 * below the raiser's target. At most ONE per signalVar (earliest-minted pair wins; codepoint
 * tiebreak), CAP live per settlement. Never re-pairs an already-live/recent pair. Pure.
 * @param {Object} a
 * @param {string} a.sid @param {number} a.weeks
 * @param {Record<string, import('./npcLadderKernel.js').LadderStanding>} a.npcs
 * @param {Record<string, import('./npcLadderKernel.js').ContestRec>} a.liveContests the surviving contests
 * @returns {Record<string, import('./npcLadderKernel.js').ContestRec>} the NEW contests to add
 */
export function genesisContests({ sid, weeks, npcs, liveContests }) {
  const T = CONTEST_TUNING;
  const existing = asObject(liveContests);
  const liveCount = Object.keys(existing).length;
  const existingRecs = /** @type {import('./npcLadderKernel.js').ContestRec[]} */ (Object.values(existing).filter(Boolean));
  const usedSignalVars = new Set(existingRecs.map((c) => c.signalVar).filter(Boolean));
  /** @type {Set<string>} pairs already engaged (live or recently resolved, window-open) */
  const engagedPairs = new Set(existingRecs.map((c) => contestPairKey(c.a.nid, c.b.nid)));
  // Candidate primary goals by signalVar (support goals never contest — they ARE a bond, not a race).
  /** @type {Map<string, Array<{ nid: string, goal: import('./npcLadderKernel.js').LadderGoal }>>} */
  const bySignal = new Map();
  for (const nid of Object.keys(npcs).sort(compareCodepoint)) {
    const st = npcs[nid];
    const goal = st && st.goal;
    if (!goal || goal.supportOf) continue;
    const v = goalSignalVar(goal);
    if (!v) continue;
    if (!bySignal.has(v)) bySignal.set(v, []);
    (bySignal.get(v) || []).push({ nid, goal });
  }
  /** @type {Record<string, import('./npcLadderKernel.js').ContestRec>} */
  const added = {};
  let room = T.CONTESTS_PER_SETTLEMENT_CAP - liveCount;
  for (const v of [...bySignal.keys()].sort(compareCodepoint)) {
    if (room <= 0) break;
    if (usedSignalVars.has(v)) continue; // one contest per signalVar
    const holders = bySignal.get(v) || [];
    if (holders.length < 2) continue;
    /** @type {{ aNid: string, bNid: string, kind: 'convergent'|'opposed', mint: number }|null} */
    let best = null;
    for (let i = 0; i < holders.length; i++) {
      for (let j = i + 1; j < holders.length; j++) {
        const cand = collisionOf(holders[i], holders[j]);
        if (!cand) continue;
        if (engagedPairs.has(contestPairKey(cand.aNid, cand.bNid))) continue;
        // earliest-minted pair wins the slot (codepoint pair-key tiebreak).
        if (!best || cand.mint < best.mint
          || (cand.mint === best.mint && contestPairKey(cand.aNid, cand.bNid) < contestPairKey(best.aNid, best.bNid))) {
          best = cand;
        }
      }
    }
    if (!best) continue;
    const id = `contest.${sid}.${v}.${weeks}`;
    // Capture each side's verb AT GENESIS (opposed resolution stays robust to a later remint).
    const verbA = goalVerb(/** @type {import('./npcLadderKernel.js').LadderGoal|null} */ (asObject(npcs[best.aNid]).goal));
    const verbB = goalVerb(/** @type {import('./npcLadderKernel.js').LadderGoal|null} */ (asObject(npcs[best.bNid]).goal));
    added[id] = {
      id, signalVar: v, kind: best.kind,
      a: { nid: best.aNid, verb: verbA, awareSince: null, heardProgress: null, heardWeek: null },
      b: { nid: best.bNid, verb: verbB, awareSince: null, heardProgress: null, heardWeek: null },
      openedWeek: weeks, backedBy: null, resolvedWeek: null, outcome: null, loserNid: null,
    };
    usedSignalVars.add(v);
    engagedPairs.add(contestPairKey(best.aNid, best.bNid));
    room -= 1;
  }
  return added;
}

/** Detect a collision between two holders of the same signalVar. @param {{nid:string,goal:import('./npcLadderKernel.js').LadderGoal}} x
 *  @param {{nid:string,goal:import('./npcLadderKernel.js').LadderGoal}} y
 *  @returns {{ aNid: string, bNid: string, kind: 'convergent'|'opposed', mint: number }|null} */
function collisionOf(x, y) {
  const vx = goalVerb(x.goal); const vy = goalVerb(y.goal);
  const tx = goalThreshold(x.goal); const ty = goalThreshold(y.goal);
  if (!vx || !vy || !Number.isFinite(tx) || !Number.isFinite(ty)) return null;
  const { aNid, bNid } = canonicalPair(x.nid, y.nid);
  const mint = Math.min(num(x.goal.mintedWeek, 0), num(y.goal.mintedWeek, 0));
  if (vx === 'raise' && vy === 'raise') {
    if (Math.abs(tx - ty) <= CONTEST_TUNING.CONTEST_BAND) return { aNid, bNid, kind: 'convergent', mint };
    return null;
  }
  // opposed: one raise, one hold whose threshold sits BELOW the raiser's target.
  const raiser = vx === 'raise' ? { v: vx, t: tx } : vy === 'raise' ? { v: vy, t: ty } : null;
  const holder = vx === 'hold' ? { v: vx, t: tx } : vy === 'hold' ? { v: vy, t: ty } : null;
  if (raiser && holder && holder.t < raiser.t) return { aNid, bNid, kind: 'opposed', mint };
  return null;
}

// ── AWARENESS (§8 D-4b) — knowing vs unknowing, staleness, the bluff, the fixation biases ──
/**
 * Run the per-advance discovery draw for one UNAWARE (or re-hearing) side of a LIVE contest and
 * return the updated side. KNOWING = the belief picture includes the rival's parallel goal ⇒ the
 * side can act on it; UNKNOWING = a blind parallel race. On discovery, heardProgress snapshots the
 * rival's TRUE progress, then goes STALE until a later (lower-rate) re-hear. The snapshot carries
 * (a) the rival's BLUFF (a deceitful rival inflates it, seeded) and (b) the observer's TUNNEL
 * VISION odds discount (a fixated observer underrates the man he despises). Pure.
 * @param {Object} a
 * @param {import('./npcLadderKernel.js').ContestSide} a.side the observing side (updated)
 * @param {{ nid: string, progress: number, bluffs: boolean }} a.rival the rival's live read
 * @param {string} a.contestId @param {number} a.tick @param {number} a.weeks @param {string} a.seed
 * @param {boolean} a.sameFaction @param {boolean} a.rivalMoved @param {number} a.fixation @param {number} a.newsHeat
 * @returns {{ side: import('./npcLadderKernel.js').ContestSide, discovered: boolean }}
 */
export function advanceAwareness(a) {
  const T = CONTEST_TUNING;
  const { side, rival, contestId, tick, weeks, seed, sameFaction, rivalMoved, fixation, newsHeat } = a;
  const known = side.awareSince != null;
  let rate = T.DISCOVER_BASE
    * (sameFaction ? T.DISCOVER_SAME_FACTION_MULT : 1)
    * (rivalMoved ? T.DISCOVER_MOVED_MULT : 1)
    * (1 + clamp01(num(newsHeat, 0)))
    * (1 + T.FIXATION_RATE_GAIN * clamp01(fixation)); // (a) ENTRY — the obsessed watch their enemy
  rate = Math.min(T.DISCOVER_CAP, rate);
  if (known) rate *= T.REHEAR_MULT; // a known contest only RE-HEARS (refresh the stale snapshot)
  const label = `${seed}|ladder-contest:aware:${contestId}:${side.nid}:${tick}`;
  if (hash01(label) >= rate) return { side, discovered: false };
  // Discovery / re-hear: snapshot the rival's TRUE progress, skewed by the rival's bluff and the
  // observer's fixation-driven underrating (both bounded to 0..1).
  let heard = clamp01(num(rival.progress, 0));
  if (rival.bluffs) {
    const bl = hash01(`${seed}|ladder-contest:bluff:${contestId}:${rival.nid}:${weeks}`);
    heard = clamp01(heard + T.BLUFF_SKEW * (0.5 + 0.5 * bl)); // inflate (project strength)
  }
  heard = clamp01(heard * (1 - T.FIXATION_ODDS_DISCOUNT * clamp01(fixation))); // (b) ODDS
  return {
    side: { ...side, awareSince: known ? side.awareSince : weeks, heardProgress: round4(heard), heardWeek: weeks },
    discovered: !known,
  };
}

// ── RESOLUTION (§8 D-4c) — the head-to-head outcome + plan-then-apply standing writes ─────
/** @typedef {{ seatWeight: number, stakes: number, attribution: number, backed: boolean, joiners: number }} ContestMarginInputs */
/** The enumerated contest MARGIN for a side (§8 D-4c tie-break): seat weight + stakes +
 *  attribution + backing + bonded joiners. Higher = stronger claim. Pure.
 *  @param {ContestMarginInputs} s @returns {number} */
export function contestMargin(s) {
  const T = CONTEST_TUNING;
  return num(s.seatWeight, 0) + num(s.stakes, 0) + num(s.attribution, 0)
    + (s.backed ? T.BACKED_MARGIN : 0)
    + T.BOND_JOIN_MARGIN * Math.min(T.JOIN_CAP_PER_SIDE, Math.max(0, Math.floor(num(s.joiners, 0))));
}

/**
 * Resolve a LIVE contest given each side's goal OUTCOME this advance (fired / expired / lapsed /
 * null-still-live) and its enumerated margin inputs. Returns the resolution verdict — which side
 * WON (the finisher / raiser / holder) and which took the loss — plus the outcome label, or null
 * when the contest is still live. Deterministic (hash01 jitter breaks exact-margin ties). Pure.
 * @param {Object} a
 * @param {import('./npcLadderKernel.js').ContestRec} a.contest
 * @param {{ fired: boolean, expired: boolean, lapsed: boolean }|null} a.outA
 * @param {{ fired: boolean, expired: boolean, lapsed: boolean }|null} a.outB
 * @param {{ seatWeight: number, stakes: number, attribution: number, backed: boolean, joiners: number }} a.marginA
 * @param {{ seatWeight: number, stakes: number, attribution: number, backed: boolean, joiners: number }} a.marginB
 * @param {string} a.seed
 * @returns {{ outcome: string, winner: 'a'|'b'|null, loser: 'a'|'b'|null, forestalled: boolean }|null}
 */
export function resolveContest({ contest, outA, outB, marginA, marginB, seed }) {
  const firedA = !!(outA && outA.fired); const firedB = !!(outB && outB.fired);
  const lapsedA = !!(outA && (outA.lapsed)); const lapsedB = !!(outB && (outB.lapsed));
  const expiredA = !!(outA && outA.expired); const expiredB = !!(outB && outB.expired);
  // A premise dying (rung change / unreadable signal) voids the contest — no consequence.
  if (lapsedA || lapsedB) return { outcome: 'lapsed', winner: null, loser: null, forestalled: false };
  if (contest.kind === 'convergent') {
    if (!firedA && !firedB) {
      if (expiredA && expiredB) return { outcome: 'stalemate', winner: null, loser: null, forestalled: false };
      return null; // still live
    }
    if (firedA && !firedB) return { outcome: 'a_finished', winner: 'a', loser: 'b', forestalled: true };
    if (firedB && !firedA) return { outcome: 'b_finished', winner: 'b', loser: 'a', forestalled: true };
    // both fired the same advance — the tie-break (enumerated margin + hash01 jitter).
    const win = tieBreak(contest, marginA, marginB, seed);
    return win === 'a'
      ? { outcome: 'a_finished', winner: 'a', loser: 'b', forestalled: true }
      : { outcome: 'b_finished', winner: 'b', loser: 'a', forestalled: true };
  }
  // opposed: the raiser winning ⇒ the holder LOSES (sting + grudge + window). Held ⇒ no loss.
  const raiser = goalIsRaiserSide(contest);
  if (raiser == null) {
    if (expiredA && expiredB) return { outcome: 'held', winner: null, loser: null, forestalled: false };
    return null;
  }
  const raiserFired = raiser === 'a' ? firedA : firedB;
  const holder = raiser === 'a' ? 'b' : 'a';
  if (raiserFired) return { outcome: `${raiser}_prevailed`, winner: raiser, loser: holder, forestalled: false };
  const raiserDone = raiser === 'a' ? expiredA : expiredB;
  if (raiserDone) return { outcome: 'held', winner: holder, loser: null, forestalled: false };
  return null; // still live
}

/** hash01-jittered tie-break over the enumerated margins (§8 D-4c). @returns {'a'|'b'} */
function tieBreak(/** @type {import('./npcLadderKernel.js').ContestRec} */ contest, /** @type {ContestMarginInputs} */ marginA, /** @type {ContestMarginInputs} */ marginB, /** @type {string} */ seed) {
  const T = CONTEST_TUNING;
  const jitter = hash01(`${seed}|ladder-contest:resolve:${contest.id}`);
  const sa = contestMargin(marginA) + T.RESOLVE_JITTER * jitter;
  const sb = contestMargin(marginB) + T.RESOLVE_JITTER * (1 - jitter);
  if (sa > sb) return 'a';
  if (sb > sa) return 'b';
  return jitter < 0.5 ? 'a' : 'b';
}

/** Which side (if any) is the raiser in an opposed contest — derived from the stored verbs.
 *  A convergent contest ⇒ null. @param {import('./npcLadderKernel.js').ContestRec} contest @returns {'a'|'b'|null} */
function goalIsRaiserSide(contest) {
  if (contest.kind !== 'opposed') return null;
  if (contest.a && contest.a.verb === 'raise') return 'a';
  if (contest.b && contest.b.verb === 'raise') return 'b';
  return null;
}

// ── JOINING (§8 D-4f) — bonded peers join a contestant's side (the positive mirror) ───────
/** The nids that JOIN a contestant's side: rung-holders bonded toward the contestant at/above
 *  JOIN_BOND_FLOOR (excluding the two contestants), strongest-first, capped. memoryWeave-gated
 *  by the caller (dark ⇒ no bonds ⇒ empty). Pure. @param {Record<string, import('./npcLadderKernel.js').LadderStanding>} npcs
 *  @param {string} contestantNid @param {Set<string>} exclude @returns {string[]} */
export function joinersFor(npcs, contestantNid, exclude) {
  const T = CONTEST_TUNING;
  /** @type {Array<{ nid: string, sev: number }>} */
  const rows = [];
  for (const nid of Object.keys(npcs).sort(compareCodepoint)) {
    if (nid === contestantNid || exclude.has(nid)) continue;
    const b = npcs[nid] && npcs[nid].bonds ? npcs[nid].bonds[contestantNid] : null;
    const sev = b ? num(b.sev, 0) : 0;
    if (sev >= LADDER_TUNING.JOIN_BOND_FLOOR) rows.push({ nid, sev });
  }
  rows.sort((x, y) => (y.sev - x.sev) || compareCodepoint(x.nid, y.nid));
  return rows.slice(0, T.JOIN_CAP_PER_SIDE).map((r) => r.nid);
}

// ── SUPPORT GOALS (§8 D-4f) — the linked/supportive goal + the cascade (positive mirror) ──
/** Build a SUPPORT goal referencing a patron's live primary (its condition IS the patron's,
 *  re-resolved each tick; supportOf carries the patron nid). @param {import('./npcLadderKernel.js').LadderGoal} patronGoal
 *  @param {string} patronNid @param {number} weeks @param {number} rungIndex @returns {import('./npcLadderKernel.js').LadderGoal} */
export function buildSupportGoal(patronGoal, patronNid, weeks, rungIndex) {
  return {
    condition: patronGoal.condition,
    stakes: patronGoal.stakes,
    horizonWeeks: patronGoal.horizonWeeks,
    mintedWeek: weeks,
    mintedRung: rungIndex,
    startScore: patronGoal.startScore,
    progress: num(patronGoal.progress, 0),
    basis: `support ${String(patronGoal.basis || '').trim()}`.trim(),
    supportOf: patronNid,
  };
}

/** The year (tick-invariant support-goal cadence bucket). @param {number} weeks @returns {number} */
function yearOf(weeks) { return Math.floor(num(weeks, 0) / 52); }

// A monotone seat weight (higher seat ⇒ larger; only the RELATIVE value matters in a margin).
const seatWeightOf = (/** @type {number} */ rungIndex, /** @type {number} */ rungCount) => Math.max(0, num(rungCount, 1) - num(rungIndex, 0));

/**
 * THE SETTLEMENT-WIDE CONTEST PASS (§8, the four determinism disciplines). Runs AFTER the
 * per-faction goal-mint + challenge loops. Prunes dead contests, runs awareness discovery,
 * resolves fired/expired contests (plan-then-apply standing STOCK writes), drives + cascades
 * D-4f support goals, mints new contests from settled collisions, and narrates. Returns the
 * updated per-settlement npcs map, the next contests sub-record, news beats, and the D-4→D-2
 * bluff-exposure deposits (consumed by the statecraft pass). Pure; hash01-seeded.
 * @param {Object} a
 * @param {string} a.sid @param {number} a.weeks @param {number} a.tick @param {string} a.seed @param {string} a.townName
 * @param {Record<string, unknown>} a.worldState
 * @param {Record<string, import('./npcLadderKernel.js').ContestRec>} a.priorContests
 * @param {Record<string, import('./npcLadderKernel.js').LadderStanding>} a.npcs settled standings (post goal-lifecycle)
 * @param {Record<string, import('./npcLadderKernel.js').LadderStanding>} a.priorNpcs the prior-tick standings (rivalMoved)
 * @param {Map<string, { fkey: string, faction: unknown, rungIndex: number, rungCount: number, npc: Record<string, unknown> }>} a.nidMeta
 * @param {Map<string, { fired: boolean, expired: boolean, lapsed: boolean, signalVar: string, endProgress: number }>} a.goalOutcomes
 * @param {(nid: string) => import('./npcLadderKernel.js').LadderGoal|null} a.remint mint a fresh primary for a nid
 * @param {typeof import('./npcLadderGoals.js').attributionWeight} a.attributionWeight
 * @param {boolean} a.memoryWeaveActive gates D-4f support/join + the cross-faction grievance read
 * @param {string|null} a.now
 * @returns {{ npcs: Record<string, import('./npcLadderKernel.js').LadderStanding>,
 *   contests: Record<string, import('./npcLadderKernel.js').ContestRec>,
 *   news: Array<Record<string, unknown>>, bluffDeposits: Array<{ nid: string, band: number }>,
 *   factionPairDeposits: Array<{ a: string, b: string, type: string, resentmentDelta: number, sev: number }> }}
 */
export function advanceContests(a) {
  const T = CONTEST_TUNING;
  const { sid, weeks, tick, seed, townName, worldState, priorNpcs, nidMeta, goalOutcomes, remint, attributionWeight, memoryWeaveActive, now } = a;
  /** @type {Record<string, import('./npcLadderKernel.js').LadderStanding>} */
  const work = { ...a.npcs };
  const mutate = (/** @type {string} */ nid, /** @type {(st: import('./npcLadderKernel.js').LadderStanding) => import('./npcLadderKernel.js').LadderStanding} */ fn) => {
    if (work[nid]) work[nid] = fn(work[nid]);
  };
  /** @type {Array<Record<string, unknown>>} */
  const news = [];
  /** @type {Array<{ nid: string, band: number }>} */
  const bluffDeposits = [];
  /** D-4c §10.5: cross-faction contest-loss faction-pair incidents (applied by the faction-pair
   *  ledger's OWN writer in the kernel; deposit-and-consume — the ladder never writes that ledger). */
  /** @type {Array<{ a: string, b: string, type: string, resentmentDelta: number, sev: number }>} */
  const factionPairDeposits = [];
  /** Stock deltas + grudges + bonds — PLAN-THEN-APPLY (§8 iii; applied after the pass). */
  /** @type {Array<{ nid: string, stock?: number, grudge?: { to: string, kind: string, sev: number }, bond?: { to: string, kind: string, sev: number } }>} */
  const plan = [];
  const alive = (/** @type {string} */ nid) => Object.prototype.hasOwnProperty.call(work, nid) || nidMeta.has(nid);
  const metaOf = (/** @type {string} */ nid) => nidMeta.get(nid) || { fkey: '', faction: null, rungIndex: 0, rungCount: 1, npc: {} };
  const progressOf = (/** @type {Record<string, import('./npcLadderKernel.js').LadderStanding>} */ m, /** @type {string} */ nid) => num(asObject(m[nid]).goal && asObject(asObject(m[nid]).goal).progress, 0);

  // ── Carry surviving contests forward (prune vanished contestants / spent windows). ──
  /** @type {Record<string, import('./npcLadderKernel.js').ContestRec>} */
  const contests = {};
  const prior = asObject(a.priorContests);
  const patronFailed = new Set(); const patronSucceeded = new Set();
  for (const id of Object.keys(prior).sort(compareCodepoint)) {
    const c = /** @type {import('./npcLadderKernel.js').ContestRec} */ (prior[id]);
    if (!c || !c.a || !c.b) continue;
    if (!alive(c.a.nid) || !alive(c.b.nid)) continue; // a removed contestant voids the contest
    if (c.resolvedWeek != null) {
      if (weeks - c.resolvedWeek < T.WINDOW_SEASON_WEEKS) contests[id] = c; // linger for the window
      continue;
    }
    const carried = { ...c, a: { ...c.a }, b: { ...c.b } };
    // ── D-4e THE PLAYER SIDING consume (§8): a `champion-npc` edit stamped npc.contestBacking =
    // <this contest id> on the backed contestant's save record; fold it into backedBy ONCE
    // (idempotent — only while still null). Scoped to THIS id, so a stale mark left after a
    // prior contest resolved never re-fires. The op never writes the ladder ledger; this is the
    // contest-side consume of the marker (the roads whereabouts.partyRelease precedent). ──
    if (carried.backedBy == null) {
      if (contestBackingMark(metaOf(carried.a.nid).npc) === id) carried.backedBy = 'a';
      else if (contestBackingMark(metaOf(carried.b.nid).npc) === id) carried.backedBy = 'b';
    }
    contests[id] = carried;
  }

  // ── AWARENESS (§8 D-4b) — discovery draws on live contests. ──
  for (const id of Object.keys(contests).sort(compareCodepoint)) {
    const c = contests[id];
    if (c.resolvedWeek != null) continue;
    for (const side of /** @type {const} */ (['a', 'b'])) {
      const me = c[side]; const other = c[side === 'a' ? 'b' : 'a'];
      const meMeta = metaOf(me.nid); const otherMeta = metaOf(other.nid);
      const rivalMoved = Math.abs(progressOf(a.npcs, other.nid) - progressOf(priorNpcs, other.nid)) > T.MOVED_EPS;
      const fix = fixation01({
        npc: meMeta.npc, grudgeSev: grudgeSevToward(a.npcs[me.nid], other.nid),
        grievance: pairGrievance(worldState, meMeta.fkey, otherMeta.fkey, tick, memoryWeaveActive),
      });
      const res = advanceAwareness({
        side: me, rival: { nid: other.nid, progress: progressOf(a.npcs, other.nid), bluffs: hasAny(traitWordsOf(otherMeta.npc), BLUFF_TRAITS) },
        contestId: id, tick, weeks, seed, sameFaction: meMeta.fkey === otherMeta.fkey, rivalMoved, fixation: fix, newsHeat: 0,
      });
      c[side] = res.side;
      if (res.discovered && c.a.awareSince != null && c.b.awareSince != null) {
        news.push(contestBeat(sid, townName, id, 'discovered', c, meMeta, otherMeta, tick, now));
      }
    }
  }

  // ── RESOLUTION (§8 D-4c) — fired / expired ⇒ head-to-head verdict + plan-then-apply. ──
  for (const id of Object.keys(contests).sort(compareCodepoint)) {
    const c = contests[id];
    if (c.resolvedWeek != null) continue;
    const outA = goalOutcomes.get(c.a.nid) || null;
    const outB = goalOutcomes.get(c.b.nid) || null;
    const marginOf = (/** @type {'a'|'b'} */ side, /** @type {string[]} */ joiners) => {
      const m = metaOf(c[side].nid);
      return {
        seatWeight: seatWeightOf(m.rungIndex, m.rungCount),
        stakes: num(asObject(a.npcs[c[side].nid]).goal && asObject(asObject(a.npcs[c[side].nid]).goal).stakes, 0),
        attribution: attributionWeight(m.rungIndex, m.faction, c.signalVar),
        backed: c.backedBy === side,
        joiners: joiners.length,
      };
    };
    const joinersA = memoryWeaveActive ? joinersFor(a.npcs, c.a.nid, new Set([c.a.nid, c.b.nid])) : [];
    const joinersB = memoryWeaveActive ? joinersFor(a.npcs, c.b.nid, new Set([c.a.nid, c.b.nid, ...joinersA])) : [];
    const verdict = resolveContest({ contest: c, outA, outB, marginA: marginOf('a', joinersA), marginB: marginOf('b', joinersB), seed });
    if (!verdict) continue;
    c.resolvedWeek = weeks; c.outcome = verdict.outcome;
    if (verdict.winner && verdict.loser) {
      const winNid = c[verdict.winner].nid; const loseNid = c[verdict.loser].nid;
      const loserOut = verdict.loser === 'a' ? outA : outB;
      const loserFired = !!(loserOut && loserOut.fired);
      c.loserNid = loseNid;
      const lm = metaOf(loseNid);
      const loserGoal = asObject(a.npcs[loseNid]).goal;
      const loserFix = fixation01({ npc: lm.npc, grudgeSev: grudgeSevToward(a.npcs[loseNid], winNid), grievance: pairGrievance(worldState, lm.fkey, metaOf(winNid).fkey, tick, memoryWeaveActive) });
      let stockDelta = -T.STING_STAND;
      let grudgeKind = 'contest_loss';
      if (verdict.forestalled && !loserFired) {
        // A cut-short rival keeps banked progress + the reduced terminal deposit (partial credit).
        const dep = num(asObject(loserGoal).stakes, 0) * attributionWeight(lm.rungIndex, lm.faction, c.signalVar) * 1.5 * T.FORESTALLED_MULT * clamp01(progressOf(a.npcs, loseNid));
        stockDelta += dep;
        grudgeKind = 'contest_forestalled';
        mutate(loseNid, (st) => ({ ...st, goal: remint(loseNid) })); // the race is over — a fresh ambition
      } else if (verdict.forestalled) {
        grudgeKind = 'contest_forestalled';
        mutate(loseNid, (st) => ({ ...st, goal: remint(loseNid) }));
      } else {
        mutate(loseNid, (st) => ({ ...st, goal: remint(loseNid) })); // opposed loser: a public defeat, fresh goal
      }
      plan.push({ nid: loseNid, stock: stockDelta });
      // (c) AFTERMATH — the loss WRITES MEMORY: a typed, decaying grudge toward the winner
      // (a fixated loser one step deeper, bounded by the cap). The loss→grievance→fixation loop.
      plan.push({ nid: loseNid, grudge: { to: winNid, kind: grudgeKind, sev: clamp(T.CONTEST_LOSS_GRUDGE_SEV + T.FIXATION_GRUDGE_DEEPEN * loserFix, 0, 1) } });
      patronFailed.add(loseNid); patronSucceeded.add(winNid);
      // §10.5 THE CROSS-FACTION LOOP: a loss between DIFFERENT factions ALSO deepens the
      // faction-pair resentment (memoryWeave-gated; the faction-pair ledger's own writer applies
      // it in the kernel). Same-faction ⇒ no faction-pair edge ⇒ no deposit (byte-safe).
      const winFkey = metaOf(winNid).fkey;
      if (memoryWeaveActive && lm.fkey && winFkey && lm.fkey !== winFkey) {
        factionPairDeposits.push({ a: lm.fkey, b: winFkey, type: 'contest_loss', resentmentDelta: T.CONTEST_LOSS_PAIR_RESENTMENT, sev: T.CONTEST_LOSS_PAIR_SEV });
      }
      // THE BLUFF CONTRADICTED (§8 D-2 coupling): a bluffer who LOST deposits a deception exposure.
      const loserSide = c[verdict.loser];
      if (loserSide.heardWeek != null && hasAny(traitWordsOf(lm.npc), BLUFF_TRAITS) && verdict.loser != null) {
        bluffDeposits.push({ nid: loseNid, band: 2 });
      }
      // Winning-side joiners book a bond deepen with the winner (memoryWeave; both took the field).
      if (memoryWeaveActive) {
        const winJoiners = verdict.winner === 'a' ? joinersA : joinersB;
        for (const j of winJoiners) plan.push({ nid: j, bond: { to: winNid, kind: 'loyalty', sev: LADDER_TUNING.BOND_MINT_SEV } });
      }
      news.push(contestBeat(sid, townName, id, 'resolved', c, metaOf(winNid), lm, tick, now));
    } else {
      // held / stalemate / lapsed — no standing consequence; the contest simply closes.
      news.push(contestBeat(sid, townName, id, 'closed', c, metaOf(c.a.nid), metaOf(c.b.nid), tick, now));
    }
  }

  // ── D-4f SUPPORT GOALS — drive existing ties (cascade / book), then convert eligibles. ──
  if (memoryWeaveActive) {
    driveSupportGoals({ work, mutate, plan, npcs: a.npcs, priorNpcs, goalOutcomes, patronFailed, patronSucceeded, nidMeta, remint, attributionWeight, sid, townName, tick, now, news });
    /** @type {Set<string>} contestants of still-live contests — never pull them into a support tie */
    const liveContestantNids = new Set();
    for (const id of Object.keys(contests)) { const c = contests[id]; if (c && c.resolvedWeek == null) { liveContestantNids.add(c.a.nid); liveContestantNids.add(c.b.nid); } }
    convertSupporters({ work, mutate, npcs: a.npcs, nidMeta, sid, seed, weeks, liveContestantNids });
  }

  // ── GENESIS (§8 D-4a) — pair settled primaries into new contests (caps + engaged-guard). ──
  const genesisNpcs = /** @type {Record<string, import('./npcLadderKernel.js').LadderStanding>} */ (work);
  const added = genesisContests({ sid, weeks, npcs: genesisNpcs, liveContests: liveOnly(contests, weeks) });
  for (const id of Object.keys(added).sort(compareCodepoint)) {
    contests[id] = added[id];
    news.push(contestBeat(sid, townName, id, 'opened', added[id], metaOf(added[id].a.nid), metaOf(added[id].b.nid), tick, now));
  }

  // ── PLAN-THEN-APPLY the standing STOCK / grudge / bond writes (one block; §8 iii). ──
  for (const p of plan) {
    mutate(p.nid, (st) => {
      let next = st;
      if (typeof p.stock === 'number') next = { ...next, stock: round4(clamp(next.stock + p.stock, 0, LADDER_TUNING.STAND_MAX)) };
      if (p.grudge) next = { ...next, grudges: { ...next.grudges, [p.grudge.to]: stackGrudge(next.grudges[p.grudge.to], p.grudge, weeks) } };
      if (p.bond) next = { ...next, bonds: stackBond(next.bonds, p.bond, weeks) };
      return next;
    });
  }
  return { npcs: work, contests, news, bluffDeposits, factionPairDeposits };
}

/** The still-LIVE contests (resolvedWeek null). @param {Record<string, import('./npcLadderKernel.js').ContestRec>} contests @param {number} weeks */
function liveOnly(contests, weeks) {
  /** @type {Record<string, import('./npcLadderKernel.js').ContestRec>} */
  const out = {};
  for (const id of Object.keys(contests)) { const c = contests[id]; if (c && (c.resolvedWeek == null || weeks - c.resolvedWeek < CONTEST_TUNING.WINDOW_SEASON_WEEKS)) out[id] = c; }
  return out;
}

/** Additive typed-grudge stacking (the ladder grudge shape gains an optional kind). @returns {import('./npcLadderKernel.js').LadderGrudge} */
function stackGrudge(/** @type {import('./npcLadderKernel.js').LadderGrudge|undefined} */ prior, /** @type {{ kind: string, sev: number }} */ g, /** @type {number} */ weeks) {
  const priorSev = prior ? num(prior.sev, 0) : 0;
  return { sev: round4(clamp01(priorSev + g.sev)), week: weeks, kind: g.kind };
}
/** Additive bond stacking through the plan (memoryWeave). @returns {Record<string, import('./npcLadderKernel.js').LadderBond>} */
function stackBond(/** @type {Record<string, import('./npcLadderKernel.js').LadderBond>|undefined} */ bonds, /** @type {{ to: string, kind: string, sev: number }} */ b, /** @type {number} */ weeks) {
  const cur = /** @type {Record<string, import('./npcLadderKernel.js').LadderBond>} */ (asObject(bonds));
  const prior = asObject(cur[b.to]);
  const sev = round4(clamp(num(prior.sev, 0) + b.sev, 0, LADDER_TUNING.BOND_MAX_SEV));
  return { ...cur, [b.to]: { sev, week: weeks, kind: b.kind } };
}

/** D-4f: drive every LIVE support goal — cascade on the patron's fall (SAME TICK), book on the
 *  patron's success (deposit + bond deepen both ways), else mirror the patron's live progress and
 *  book the incremental SUPPORT_SHARE. All standing writes ride the plan (§8 iii). Pure over args.
 *  @param {{ work: Record<string, import('./npcLadderKernel.js').LadderStanding>,
 *    mutate: (nid: string, fn: (st: import('./npcLadderKernel.js').LadderStanding) => import('./npcLadderKernel.js').LadderStanding) => void,
 *    plan: Array<{ nid: string, stock?: number, grudge?: { to: string, kind: string, sev: number }, bond?: { to: string, kind: string, sev: number } }>,
 *    npcs: Record<string, import('./npcLadderKernel.js').LadderStanding>,
 *    priorNpcs: Record<string, import('./npcLadderKernel.js').LadderStanding>,
 *    goalOutcomes: Map<string, { fired: boolean, expired: boolean, lapsed: boolean }>,
 *    patronFailed: Set<string>, patronSucceeded: Set<string>,
 *    nidMeta: Map<string, { rungIndex: number, faction: unknown }>,
 *    remint: (nid: string) => import('./npcLadderKernel.js').LadderGoal|null,
 *    attributionWeight: typeof import('./npcLadderGoals.js').attributionWeight,
 *    sid: string, townName: string, tick: number, now: string|null,
 *    news: Array<Record<string, unknown>> }} a */
function driveSupportGoals(a) {
  const T = CONTEST_TUNING;
  const { work, mutate, plan, npcs, priorNpcs, goalOutcomes, patronFailed, patronSucceeded, nidMeta, remint, attributionWeight, sid, townName, tick, now, news } = a;
  for (const nid of Object.keys(work).sort(compareCodepoint)) {
    const goal = work[nid].goal;
    if (!goal || !goal.supportOf) continue;
    const patronNid = String(goal.supportOf);
    const patronSt = work[patronNid] || npcs[patronNid];
    const meta = nidMeta.get(nid) || { rungIndex: 0, faction: null };
    const patronOut = goalOutcomes.get(patronNid) || null;
    const patronGone = !patronSt || !patronSt.goal || patronSt.goal.supportOf;
    const failed = patronGone || patronFailed.has(patronNid) || (patronOut && (patronOut.expired || patronOut.lapsed) && !patronOut.fired);
    const succeeded = !failed && (patronSucceeded.has(patronNid) || (patronOut && patronOut.fired));
    if (failed) {
      mutate(nid, (st) => ({ ...st, goal: remint(nid) })); // their cause fell with their patron's
      news.push(contestSupportBeat(sid, townName, nid, patronNid, 'cascade', tick, now));
      continue;
    }
    if (succeeded) {
      const dep = num(goal.stakes, 0) * attributionWeight(meta.rungIndex, meta.faction, goalSignalVar(goal)) * 1.5 * T.SUPPORT_SHARE;
      plan.push({ nid, stock: dep });
      plan.push({ nid, bond: { to: patronNid, kind: 'friendship', sev: T.SUPPORT_BOND_DEEPEN } });
      plan.push({ nid: patronNid, bond: { to: nid, kind: 'friendship', sev: T.SUPPORT_BOND_DEEPEN } });
      mutate(nid, (st) => ({ ...st, goal: remint(nid) }));
      news.push(contestSupportBeat(sid, townName, nid, patronNid, 'booked', tick, now));
      continue;
    }
    // Patron still pursuing — mirror progress + book the incremental SUPPORT_SHARE of the advance.
    if (!patronSt || !patronSt.goal) continue;
    const patronProg = clamp01(num(patronSt.goal.progress, 0));
    const priorSupport = asObject(asObject(priorNpcs[nid]).goal);
    const priorProg = num(priorSupport.progress, 0);
    const delta = patronProg - priorProg;
    if (delta !== 0) plan.push({ nid, stock: num(goal.stakes, 0) * attributionWeight(meta.rungIndex, meta.faction, goalSignalVar(goal)) * 1.5 * T.SUPPORT_SHARE * delta });
    mutate(nid, (st) => ({ ...st, goal: { ...goal, progress: round4(patronProg) } }));
  }
}

/** D-4f: convert an eligible primary-goal holder (strong bond ≥ SUPPORT_BOND_FLOOR toward a patron
 *  with an active primary; ≤1 supporter per patron; a live contestant is never pulled in) into a
 *  SUPPORT goal on the yearly tick-invariant draw. Pure over args.
 *  @param {{ work: Record<string, import('./npcLadderKernel.js').LadderStanding>,
 *    mutate: (nid: string, fn: (st: import('./npcLadderKernel.js').LadderStanding) => import('./npcLadderKernel.js').LadderStanding) => void,
 *    npcs: Record<string, import('./npcLadderKernel.js').LadderStanding>,
 *    nidMeta: Map<string, { rungIndex: number }>,
 *    sid: string, seed: string, weeks: number, liveContestantNids: Set<string> }} a */
function convertSupporters(a) {
  const T = CONTEST_TUNING;
  const { work, mutate, npcs, nidMeta, sid, seed, weeks, liveContestantNids } = a;
  const year = yearOf(weeks);
  /** @type {Set<string>} ≤1 supporter per patron goal (pre-seeded with existing ties) */
  const supportedPatrons = new Set();
  for (const nid of Object.keys(work)) { const g = work[nid].goal; if (g && g.supportOf) supportedPatrons.add(String(g.supportOf)); }
  for (const nid of Object.keys(work).sort(compareCodepoint)) {
    const st = work[nid];
    const goal = st.goal;
    if (!goal || goal.supportOf) continue;         // no goal, or already a supporter
    if (liveContestantNids.has(nid)) continue;     // a live contestant stays in the race
    let patronNid = null;
    for (const p of bondedPeersAbove(st, LADDER_TUNING.SUPPORT_BOND_FLOOR)) {
      if (p.nid === nid || supportedPatrons.has(p.nid)) continue;
      const pst = work[p.nid] || npcs[p.nid];
      if (!pst || !pst.goal || pst.goal.supportOf) continue; // patron must hold an active primary
      patronNid = p.nid; break;
    }
    if (!patronNid) continue;
    if (hash01(`${seed}|ladder-support:${sid}:${nid}:${year}`) >= T.SUPPORT_CONVERT_P) continue;
    const meta = nidMeta.get(nid) || { rungIndex: 0 };
    const patronGoal = (work[patronNid] || npcs[patronNid]).goal;
    mutate(nid, (s) => ({ ...s, goal: buildSupportGoal(/** @type {import('./npcLadderKernel.js').LadderGoal} */ (patronGoal), patronNid, weeks, meta.rungIndex) }));
    supportedPatrons.add(patronNid);
  }
}

// ── The contest chronicle beat (house voice; unvoiced crier-wise — the ladder precedent) ──
/** @param {string} sid @param {string} townName @param {string} id @param {'opened'|'discovered'|'resolved'|'closed'} phase
 *  @param {import('./npcLadderKernel.js').ContestRec} c @param {{ npc: Record<string, unknown> }} m1 @param {{ npc: Record<string, unknown> }} m2
 *  @param {number} tick @param {string|null} now @returns {Record<string, unknown>} */
function contestBeat(sid, townName, id, phase, c, m1, m2, tick, now) {
  const n1 = String(asObject(m1.npc).name || asObject(m1.npc).label || c.a.nid);
  const n2 = String(asObject(m2.npc).name || asObject(m2.npc).label || c.b.nid);
  const noun = String(c.signalVar).replace(/_/g, ' ');
  const map = {
    opened: { h: `${n1} and ${n2} reach for the same prize`, s: `In ${townName}, ${n1} and ${n2} both bend their ambition to ${noun} — two hands reach for the same prize.`, sig: 'notable', sc: 46, sev: 0.3 },
    discovered: { h: `${n1} learns of a rival's parallel ambition`, s: `In ${townName}, ${n1} has learned that ${n2} pursues the very same end — the race is now known to both.`, sig: 'notable', sc: 44, sev: 0.25 },
    resolved: { h: `${n1} prevails over ${n2}`, s: `In ${townName}, the contest for ${noun} resolved head-to-head: ${n1} prevailed, ${n2} was thrown back — a goal decided, never a fate.`, sig: 'notable', sc: 48, sev: 0.35 },
    closed: { h: `The contest for ${noun} closes`, s: `In ${townName}, the rivalry over ${noun} between ${n1} and ${n2} closed without a victor.`, sig: 'notable', sc: 42, sev: 0.2 },
  };
  const e = map[phase] || map.closed;
  const slug = `${phase}.${id}`;
  return {
    id: `wizard_news.${tick}.npc_contest.${sid}.${slug}`,
    tick, createdAt: now, scope: 'local', significance: e.sig, severity: e.sev, score: e.sc,
    headline: e.h, summary: e.s, kind: 'applied', impactKind: 'npc_contest', channelType: 'settlement',
    settlementIds: [sid], impactIds: [], channelIds: [], sourceEventId: `npc_contest.${sid}.${slug}.${tick}`,
    tags: ['world_pulse', 'npc_contest', phase], reasons: [`A contested-goals resolution (${c.kind}) over ${noun}.`],
  };
}

/** @param {string} sid @param {string} townName @param {string} nid @param {string} patronNid
 *  @param {'cascade'|'booked'} phase @param {number} tick @param {string|null} now @returns {Record<string, unknown>} */
function contestSupportBeat(sid, townName, nid, patronNid, phase, tick, now) {
  const cascade = phase === 'cascade';
  return {
    id: `wizard_news.${tick}.npc_support.${sid}.${phase}.${nid}.${patronNid}`,
    tick, createdAt: now, scope: 'local', significance: 'notable', severity: cascade ? 0.3 : 0.25, score: cascade ? 44 : 43,
    headline: cascade ? 'A supporter\'s cause falls with their patron\'s' : 'A supporter shares in their patron\'s victory',
    summary: cascade
      ? `In ${townName}, a linked supporter's cause fell with their patron's — the dependency ran to its end.`
      : `In ${townName}, a supporter shared in their patron's victory, and the bond deepened both ways.`,
    kind: 'applied', impactKind: 'npc_support', channelType: 'settlement',
    settlementIds: [sid], impactIds: [], channelIds: [], sourceEventId: `npc_support.${sid}.${phase}.${nid}.${patronNid}.${tick}`,
    tags: ['world_pulse', 'npc_support', phase], reasons: ['A D-4f linked support-goal outcome.'],
  };
}
