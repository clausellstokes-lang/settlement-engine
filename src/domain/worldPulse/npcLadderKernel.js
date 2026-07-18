/**
 * npcLadderKernel.js — THE LADDER (owner commission, ENGINE LIFT #3; the missing
 * MIDDLE rung between person-change (the growth layer) and regime-change (coups) —
 * DESIGN_THE_LADDER.md is binding law).
 *
 * Owner (one sentence, §0): "Every faction carries a persistent, contested rank
 * ladder; NPCs rise ONLY by displacing the rung above and fall when displaced — the
 * missing middle rung … converting the roster from a cast into a court."
 *
 * THE ARCHITECTURE (the fabric/growth deposit-ledger machinery at COURT scale):
 *   • THE CONSERVATION LAW (§1): ranks are neither created nor destroyed — promotion
 *     is DISPLACEMENT (winner and loser SWAP rungs; a failed challenger DROPS one
 *     rung). No title inflation; every promotion is a story with a named loser.
 *     Ladder length derives from institutional tier + base (3–5 rungs; a thorp is a
 *     single seat). Seats are SEAT-HELD-GLUE (the seat's obligations persist across
 *     holders); the person's people-held ties travel with the person.
 *   • THE STANDING STOCK (§11): per-NPC standing is an INTEGRATOR (the fabric
 *     prominence idiom — stakes-weighted deposits, magnitude-mirrored withdrawals on
 *     failure, slow decay toward baseline, interval-invariant over elapsed weeks).
 *     Challenges draw on the STOCK, never a recent window.
 *   • DYNAMIC GOALS (§3.2, the crux): a goal is a typed condition over REGISTERED S7
 *     signals — the signalRegistry + StopCondition evaluator REUSED read-only (never
 *     forked). Goals mint by the NPC's lens (rung/faction/personality/FLAWS/
 *     compromised/power), carry STAKES priced at mint (§9), and REMINT on rung/
 *     faction/state-band change.
 *   • THE CHALLENGE ENGINE (§2–§4): windows gate the contest; challengeScore vs
 *     defenseScore from the named inputs (alignment methods, deity/pantheon standing,
 *     compromised leverage, traits, D5 marks, clash metric, seat weight); E0-classed
 *     rare-sticky resolution with hysteresis + a per-faction years-scale cooldown; the
 *     receipt enumerates every input (non-short-circuiting, the S7 evaluator idiom).
 *   • THE THREE-BODY LADDER (§11.4): every holder defends below AND may challenge
 *     above on ONE stock; mounting a challenge WEAKENS your own defense for its
 *     duration; a successful displacement opens ONE chained vacancy succession below,
 *     then the cooldown seals the court. Adjacent rungs only, always.
 *   • CONSEQUENCES (§4, §8, §10): ladder outcomes deposit growth signals through the
 *     EXISTING 8-signal map additively; D5 marks recorded; the STIGMA mark (§10)
 *     halves a caught schemer's challengeScore for a lifespan-scaled term; the
 *     STANDING LOOP (§8) deposits bounded power/legitimacy modifiers the effective-
 *     power read consumes; every rise/fall/failed challenge is a narratable npc_ladder
 *     beat with the full reason receipt.
 *   • STATE, NEVER FATE (§4g): the engine moves RANKS only. The fallen remain full
 *     citizens; no engine-authored death/exile; the DM owns what the deposed does next.
 *
 * SINGLE-WRITER LAW (§8): the ladder kernel writes ONLY its sidecar
 * (spatialLedgers.npcLadder) + the compact settlement.npcLadder mirror. The power/
 * legitimacy reads CONSUME the mirror's modifiers when lit (absent ⇒ 1.0 ⇒ byte-
 * identical dark). The ladder never mutates any other system's state.
 *
 * THE DORMANCY GATE (constitutional §5): behind the VIRTUAL npcLadderEnabled flag
 * (ABSENT from DEFAULT_SIMULATION_RULES — the urbanFabric/npcGrowth/spatialConsequence
 * precedent). Absent ⇒ an immediate no-op: zero derivation, zero ledger key, zero
 * mirror, byte-identical (the npcLadder dormancy golden proves it). The flag is
 * DARK — it lights at THE ONE REGEN (joins the list; vetoable); this lane never lights it.
 *
 * THE PULSE SEAM (ceiling discipline §5): pulseKernel is at its frozen effective-line
 * ceiling, so this leaf exports advanceNpcGrowthWithFabricAndConsequenceAndLadder —
 * the growth+fabric+consequence chain composed with the ladder mover (the ladder runs
 * LAST, over the fully-settled tick). pulseKernel's existing chain import/call is
 * NAME-SWAPPED (the provenanceKernel idiom — a swap, not a new line).
 *
 * FIRST-PAINT LAW: a LAZY worldPulse leaf — imported ONLY from the lazy pulse engine
 * (pulseKernel, at the mover seam). Never from the first-paint entry closure.
 *
 * Pure, deterministic, side-effect-free, rng-free (contests draw ONLY from the seed
 * fork + registered signals), clock-free. AGGREGATE of durable state → per-faction
 * rank overlay; never a named soul's FATE.
 *
 * @enforced-by tests/property/npcLadderDormancyGolden.test.js (dormancy byte-identity
 *   + lit anti-vacuity), tests/domain/npcLadderKernel.test.js (the conservation /
 *   window / goal / coherence / three-body / stigma / standing-loop pins).
 */
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { clamp } from '../../kernel/math.js';
import { npcId } from './npcAgency.js';
import { advanceNpcGrowthWithFabricAndConsequence } from './spatialConsequenceKernel.js';
import {
  LADDER_TUNING, num, asObject, compareCodepoint, round4, ladderFactionKey, eligibleMembersOf,
  rungCapForTier, seedStandingForRung, decayStandingTowardBaseline, normalizeRecord,
  sortedRecord, mirrorOf,
} from './npcLadderState.js';
import { GOAL_TUNING, mintGoal, evaluateGoal, attributionWeight, goalSignalVar } from './npcLadderGoals.js';

// ── Kernel-local read shapes (0-hole discipline: no `any`) ────────────────────
/** @typedef {{ id?: string, name?: string, label?: string, role?: string, title?: string,
 *   importance?: string, notability?: number, dots?: number, personality?: unknown,
 *   linkedFactionIds?: unknown, corrupt?: boolean, ousted?: boolean, stasis?: unknown,
 *   acquiredTraits?: unknown, corruptTies?: { revealed?: boolean } }} LadderNpc */
/** @typedef {{ id?: string, name?: string, archetype?: string, isGoverning?: boolean,
 *   power?: number }} LadderFaction */
/** @typedef {{ name?: string, tier?: string, population?: number, npcs?: LadderNpc[],
 *   institutions?: unknown[], config?: Record<string, unknown>,
 *   powerStructure?: Record<string, unknown>, calamityHistory?: unknown[],
 *   activeConditions?: unknown[], npcLadder?: unknown }} LadderSettlement */
/** @typedef {{ id?: (string|number), name?: string, settlement?: LadderSettlement }} LadderSnapItem */
/** @typedef {{ settlements?: LadderSnapItem[], byId?: Map<string, unknown> }} LadderSnapshot */
/** @typedef {{ saveId?: (string|number), settlement?: LadderSettlement }} LadderUpdate */

/**
 * The persisted per-NPC standing record (the fabric-stock idiom at soul scale).
 * @typedef {object} LadderStanding
 * @property {number} stock — the standing integrator (0..STAND_MAX)
 * @property {number} since — the week the record was born (byte-stable provenance)
 * @property {number} week — the week of the last integration (decay anchor)
 * @property {LadderGoal|null} goal — the current minted goal (null ⇒ none this state)
 * @property {LadderStigma|null} stigma — the §10 exposure mark (null ⇒ clean)
 * @property {Record<string, LadderGrudge>} grudges — §4e D5 marks, keyed by defender npcId
 */
/** @typedef {{ condition: import('../autonomy/stopConditions.js').StopCondition, stakes: number,
 *   horizonWeeks: number, mintedWeek: number, mintedRung: number, startScore: number,
 *   progress: number, basis: string }} LadderGoal */
/** @typedef {{ sev: number, week: number, tick: number }} LadderStigma */
/** @typedef {{ sev: number, week: number }} LadderGrudge */
/** @typedef {{ rungs: string[], cooldownUntil: number, lastPower: number }} LadderFactionRec */
/** @typedef {{ factions: Record<string, LadderFactionRec>, npcs: Record<string, LadderStanding> }} LadderRecord */

// The pure state helpers (num/asObject/compareCodepoint/round4 + derivation, decay,
// normalization, byte-stable sort, mirror) live in the npcLadderState.js sibling leaf.

// ── THE DORMANCY GATE (constitutional) — a virtual, defensively-read flag ──────
/**
 * Is the ladder layer LIT? Reads simulationRules.npcLadderEnabled === true,
 * defensively — ABSENT ⇒ false ⇒ DORMANT ⇒ the mover is never entered (byte-
 * identical; NO default in DEFAULT_SIMULATION_RULES, so goldens do not move).
 * Mirrors urbanFabricActive. Pure, total.
 * @param {{ simulationRules?: Record<string, unknown> }|null|undefined} worldState
 * @returns {boolean}
 */
export function npcLadderActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  return !!(rules && typeof rules === 'object' && /** @type {Record<string, unknown>} */ (rules).npcLadderEnabled === true);
}

// v1 goals reference NO pressure signals, so an empty pressures stub satisfies the S7
// frame contract (resolveSignal touches frame.pressures ONLY for pressure.* reads).
const EMPTY_PRESSURES = Object.freeze({ get: () => null });

/**
 * The per-rung GOAL lifecycle (§3.2 dynamic goals · §9 weighted deeds · §11.3 partial-
 * progress deposits · the ATTRIBUTION RULE). Evaluate the current goal; deposit its
 * stakes-weighted, attribution-weighted PROGRESS DELTA into the standing stock (a
 * reversal withdraws, magnitude-mirrored); remint on completion / horizon expiry / rung
 * change; an unreadable signal ⇒ the premise LAPSED (honest null — remint, no reward or
 * penalty). Returns the updated standing. PURE.
 * @param {LadderStanding} st
 * @param {{ npc: Record<string, unknown>, faction: unknown, rungIndex: number, sid: string,
 *   frame: import('../autonomy/signalRegistry.js').SignalFrame,
 *   item: {causal?: unknown}|null, weeks: number }} ctx
 * @returns {LadderStanding}
 */
function applyGoalLifecycle(st, ctx) {
  const { npc, faction, rungIndex, sid, frame, item, weeks } = ctx;
  const mint = () => mintGoal({ npc, faction, rungIndex, sid, frame, item, weeks });
  let goal = st.goal;
  let stock = st.stock;
  if (!goal) return { ...st, goal: mint() };
  const ev = evaluateGoal(goal, frame);
  if (!ev.readable) {
    // LAPSED — the premise died by outside forces (the signal is gone): remint, no deposit.
    return { ...st, goal: mint() };
  }
  const delta = ev.progress - goal.progress;
  const aw = attributionWeight(rungIndex, faction, goalSignalVar(goal));
  const deposit = goal.stakes * delta * aw * GOAL_TUNING.DEPOSIT_SCALE;
  stock = clamp(stock + deposit, 0, LADDER_TUNING.STAND_MAX);
  goal = { ...goal, progress: ev.progress };
  // Settle at outcome: a fired deed, an expired horizon, or a rung change reminds a fresh
  // goal (the delta above is already banked — completion/expiry keep the earned deposits).
  const expired = (weeks - goal.mintedWeek) >= goal.horizonWeeks;
  const rungChanged = goal.mintedRung !== rungIndex;
  if (ev.fired || expired || rungChanged) goal = mint();
  return { ...st, stock: round4(stock), goal };
}

// ── The advance ───────────────────────────────────────────────────────────────
/**
 * @typedef {Object} NpcLadderAdvanceResult
 * @property {LadderUpdate[]} settlementUpdates
 * @property {Record<string, unknown>} worldState
 * @property {boolean} changed
 * @property {Array<Record<string, unknown>>} newsEntries
 */

/**
 * Advance the ladder layer one pulse. DORMANT (flag absent) ⇒ a complete no-op
 * (byte-identical). Lit behaviour is built up across the mechanism commits
 * (derivation → goals → challenge → consequences); until each lands, the lit path
 * simply persists nothing new. Deterministic; NO rng (contests draw from the seed
 * fork + registered signals only). Codepoint-sorted throughout.
 * @param {Object} args
 * @param {LadderSnapshot} args.snapshot
 * @param {Record<string, unknown>} args.worldState
 * @param {LadderUpdate[]} args.settlementUpdates
 * @param {number} args.tick
 * @param {string|null} args.now
 * @returns {NpcLadderAdvanceResult}
 */
export function advanceNpcLadder({ snapshot, worldState, settlementUpdates, tick, now }) {
  const updates = Array.isArray(settlementUpdates) ? settlementUpdates : [];
  // ── DORMANCY GATE: the flag absent ⇒ an immediate no-op. No key, no mirror. ──
  if (!npcLadderActive(worldState)) {
    return { worldState, settlementUpdates: updates, changed: false, newsEntries: [] };
  }
  // Lit path (built up across mechanism commits). Reads the freshest settlement
  // structure (updates-first) + the ladder sidecar; writes only the sidecar + mirror.
  return advanceLitLadder({ snapshot, worldState, settlementUpdates: updates, tick, now });
}

/**
 * The LIT ladder advance (never entered dark). Structured as the fabric/growth mover:
 * per settlement, derive/decay the ladder, evaluate goals, resolve contests, apply
 * consequences, project the mirror, narrate. Built up mechanism-by-mechanism.
 * @param {Object} args
 * @param {LadderSnapshot} args.snapshot
 * @param {Record<string, unknown>} args.worldState
 * @param {LadderUpdate[]} args.settlementUpdates
 * @param {number} args.tick
 * @param {string|null} args.now
 * @returns {NpcLadderAdvanceResult}
 */
function advanceLitLadder({ snapshot, worldState, settlementUpdates, tick, now }) {
  void now;
  const T = LADDER_TUNING;
  const now2 = Math.max(0, Math.floor(num(tick, 0)));
  const weeks = num(asObject(asObject(worldState).calendar).elapsedWeeks, now2);
  const items = Array.isArray(snapshot?.settlements) ? snapshot.settlements : [];
  const itemById = new Map(items.map((it) => [String(it.id), it]));

  // The S7 reading frame for goal predicates — the registry evaluator resolves causal
  // signals from the snapshot's memoized item.causal (settlement-scoped, freshness-safe).
  // v1 goals reference NO pressure signals, so an empty pressures stub suffices. Ensure a
  // byId Map is present (the pulse's postTimeSnapshot always carries one with causal; a
  // bare snapshot falls back to itemById — its items lack causal ⇒ goals read unreadable
  // ⇒ mint null, which is safe).
  const frameSnapshot = snapshot && snapshot.byId instanceof Map ? snapshot : { ...snapshot, byId: itemById };
  const goalFrame = /** @type {import('../autonomy/signalRegistry.js').SignalFrame} */ (
    /** @type {unknown} */ ({ snapshot: frameSnapshot, pressures: EMPTY_PRESSURES, tick: now2 }));

  /** @type {Map<string, number>} */
  const updateIndex = new Map();
  settlementUpdates.forEach((u, i) => updateIndex.set(String(u.saveId), i));
  const freshSettlement = (/** @type {string} */ id) => {
    const ui = updateIndex.get(String(id));
    if (ui !== undefined) return settlementUpdates[ui]?.settlement;
    return itemById.get(String(id))?.settlement;
  };

  const priorLedger = asObject(getSpatialLedger(worldState, 'npcLadder'));
  /** @type {Record<string, LadderRecord>} */
  const nextLedger = {};
  /** @type {Map<string, Map<string, string>>} sid → (npcId → name) for the mirror */
  const nameBySettlement = new Map();

  const orderedIds = items.map((it) => String(it.id)).sort(compareCodepoint);

  // ── PASS 1: per live settlement — derive/reconcile ladders, decay standings. ──
  for (const sid of orderedIds) {
    const s = freshSettlement(sid);
    if (!s) continue;
    const prior = normalizeRecord(priorLedger[sid], weeks);
    const factionsList = Array.isArray(asObject(asObject(s).powerStructure).factions)
      ? /** @type {Array<Record<string, unknown>>} */ (asObject(asObject(s).powerStructure).factions) : [];
    const cap = rungCapForTier(/** @type {string} */ (asObject(s).tier));
    const causalItem = snapshot?.byId?.get?.(sid) || itemById.get(sid) || null;
    // npcId → npc object (for the goal lens); the SAME key the growth layer computes.
    /** @type {Map<string, Record<string, unknown>>} */
    const npcByNid = new Map();
    const roster = Array.isArray(asObject(s).npcs) ? /** @type {unknown[]} */ (asObject(s).npcs) : [];
    roster.forEach((n, i) => { npcByNid.set(npcId(sid, /** @type {Parameters<typeof npcId>[1]} */ (n), i), asObject(n)); });

    /** @type {Record<string, import('./npcLadderKernel.js').LadderFactionRec>} */
    const factions = {};
    /** @type {Record<string, import('./npcLadderKernel.js').LadderStanding>} */
    const npcs = {};
    /** @type {Map<string, string>} */
    const nameByNid = new Map();
    /** @type {Set<string>} */
    const activeNids = new Set();

    for (const faction of factionsList) {
      const fkey = ladderFactionKey(faction);
      if (factions[fkey]) continue; // first faction wins a duplicate key (byte-stable)
      const eligible = eligibleMembersOf(sid, s, faction, fkey);
      for (const m of eligible) nameByNid.set(m.npcId, m.name);
      const eligibleIds = eligible.map((m) => m.npcId);
      const eligibleSet = new Set(eligibleIds);
      const priorRec = prior.factions[fkey];

      // Reconcile the persistent ordering: keep prior rungs still eligible (the ladder
      // is CONTESTED, not re-derived — challenges own the ordering); append new eligible
      // members at the FLOOR (they enter at the bottom and must climb); cap new additions.
      let rungs;
      if (priorRec && priorRec.rungs.length) {
        const keptPrior = priorRec.rungs.filter((nid) => eligibleSet.has(nid));
        const priorSet = new Set(priorRec.rungs);
        const newOnes = eligibleIds.filter((nid) => !priorSet.has(nid));
        const room = Math.max(0, cap - keptPrior.length);
        rungs = [...keptPrior, ...newOnes.slice(0, room)];
      } else {
        rungs = eligibleIds.slice(0, cap); // first-lit derivation from structural order
      }
      if (!rungs.length) continue;

      // Standings: decay an existing record toward baseline; seed a new rung by its
      // structural height (the defender's-advantage head start). Then run the GOAL
      // lifecycle (§3.2 mint/evolve, §9 weighted deeds, §11.3 partial-progress deposits).
      rungs.forEach((nid, rungIndex) => {
        activeNids.add(nid);
        const priorSt = prior.npcs[nid];
        /** @type {LadderStanding} */
        let st;
        if (priorSt) {
          const decayed = decayStandingTowardBaseline(priorSt.stock, Math.max(0, weeks - priorSt.week));
          st = { ...priorSt, stock: round4(decayed), week: weeks };
        } else {
          st = {
            stock: round4(seedStandingForRung(rungIndex, rungs.length)),
            since: weeks, week: weeks, goal: null, stigma: null, grudges: {},
          };
        }
        npcs[nid] = applyGoalLifecycle(st, {
          npc: npcByNid.get(nid) || {}, faction, rungIndex, sid, frame: goalFrame, item: causalItem, weeks,
        });
      });

      const power = num(asObject(faction).power, 0);
      factions[fkey] = {
        rungs,
        cooldownUntil: priorRec ? priorRec.cooldownUntil : 0,
        lastPower: power,
      };
    }

    // Orphan standings (an NPC that held a rung last tick but is on none now): decay on
    // the base clock; keep only while still meaningful, else prune (drop-when-empty).
    for (const nid of Object.keys(prior.npcs)) {
      if (activeNids.has(nid)) continue;
      const priorSt = prior.npcs[nid];
      const decayed = decayStandingTowardBaseline(priorSt.stock, Math.max(0, weeks - priorSt.week));
      const meaningful = Math.abs(decayed - T.STAND_BASELINE) >= T.PRUNE_EPSILON
        || priorSt.goal || priorSt.stigma || Object.keys(priorSt.grudges).length > 0;
      if (!meaningful) continue;
      npcs[nid] = { ...priorSt, stock: round4(decayed), week: weeks };
    }

    nameBySettlement.set(sid, nameByNid);
    nextLedger[sid] = { factions, npcs };
  }

  // ── PASS 2: mirror the read model onto the roster (self-healing projection). ──
  let nextUpdates = settlementUpdates;
  let cloned = false;
  for (const sid of orderedIds) {
    const ui = updateIndex.get(sid);
    if (ui === undefined) continue;
    const s = freshSettlement(sid);
    if (!s) continue;
    const rec = nextLedger[sid];
    // Modifiers are neutral until the §8 standing loop lands — an empty map ⇒ the mirror
    // omits every modifier ⇒ ladderRead coalesces to null/0 ⇒ byte-identical at the read.
    const desired = rec ? mirrorOf(/** @type {import('./npcLadderKernel.js').LadderRecord} */ (rec), nameBySettlement.get(sid) || new Map(), new Map()) : null;
    const current = asObject(s).npcLadder;
    const same = JSON.stringify(current ?? null) === JSON.stringify(desired ?? null);
    if (same) continue;
    if (!cloned) { nextUpdates = settlementUpdates.slice(); cloned = true; }
    if (desired == null) {
      const { npcLadder: _drop, ...rest } = /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (s));
      nextUpdates[ui] = { ...nextUpdates[ui], settlement: /** @type {import('./npcLadderKernel.js').LadderSettlement} */ (rest) };
    } else {
      nextUpdates[ui] = { ...nextUpdates[ui], settlement: { ...s, npcLadder: desired } };
    }
  }

  // ── PERSIST (drop-when-empty). Nothing changed ⇒ byte-identical. ──
  /** @type {Record<string, unknown>} */
  const persisted = {};
  for (const sid of Object.keys(nextLedger).sort(compareCodepoint)) {
    const sorted = sortedRecord(/** @type {import('./npcLadderKernel.js').LadderRecord} */ (nextLedger[sid]));
    if (sorted) persisted[sid] = sorted;
  }
  let nextWorldState = worldState;
  let changed = cloned;
  const prevSerialized = JSON.stringify(Object.keys(priorLedger).length ? priorLedger : null);
  const nextSerialized = JSON.stringify(Object.keys(persisted).length ? persisted : null);
  if (prevSerialized !== nextSerialized) {
    nextWorldState = Object.keys(persisted).length
      ? setSpatialLedger(worldState, 'npcLadder', persisted)
      : dropSpatialLedger(worldState, 'npcLadder');
    changed = true;
  }

  return { settlementUpdates: nextUpdates, worldState: nextWorldState, changed, newsEntries: [] };
}

// ── THE PULSE SEAM — growth+fabric+consequence composed with the ladder mover ──
/**
 * The growth+fabric+consequence chain composed with the ladder mover: the chain
 * first (people → stone → spatial narration), then the ladder LAST over the fully-
 * settled tick (it reads the settled outcomes + the fresh growth ledger). pulseKernel
 * calls THIS in place of advanceNpcGrowthWithFabricAndConsequence (a name swap on the
 * existing import/call — zero new effective lines in the ceiling'd file; the
 * provenanceKernel idiom). The ladder dark ⇒ an exact no-op inside the composition
 * (the prior result passes through byte-identical). No cycle: this leaf imports the
 * consequence kernel (which imports fabric); none import back.
 * @param {Parameters<typeof advanceNpcGrowthWithFabricAndConsequence>[0]} args
 * @returns {import('./urbanFabricKernel.js').UrbanFabricAdvanceResult}
 */
export function advanceNpcGrowthWithFabricAndConsequenceAndLadder(args) {
  const prior = advanceNpcGrowthWithFabricAndConsequence(args);
  const ladder = advanceNpcLadder({
    snapshot: /** @type {LadderSnapshot} */ (/** @type {unknown} */ (args.snapshot)),
    worldState: prior.worldState,
    settlementUpdates: /** @type {LadderUpdate[]} */ (/** @type {unknown} */ (prior.settlementUpdates)),
    tick: args.tick,
    now: args.now,
  });
  if (!ladder.changed) return prior;
  return {
    settlementUpdates: /** @type {typeof prior.settlementUpdates} */ (/** @type {unknown} */ (ladder.settlementUpdates)),
    worldState: ladder.worldState,
    changed: prior.changed || ladder.changed,
    newsEntries: [...prior.newsEntries, ...ladder.newsEntries],
  };
}
