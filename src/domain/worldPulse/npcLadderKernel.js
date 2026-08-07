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
 *   AMEND (DEEP COUPLINGS D-4→D-2, design §8 write-list, sanctioned in place): the ladder ALSO
 *   writes the additive spatialLedgers.bluffExposures DEPOSIT sidecar — a contradicted-bluff
 *   exposure record consumed by informationStatecraft's D-2 pass one tick later (the ladder is
 *   its sole writer/pruner; the credibility CHARGE lands through the credibility system's OWN
 *   writer, never a parallel one). Gated on contestedGoals ∧ npcCredibility ⇒ dark ⇒ no key,
 *   byte-identical. This is a REPUTATION deposit, never a fate (§0.5 no-death carve preserved).
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
import { clamp, clamp01 } from '../../kernel/math.js';
import { isOffStage } from '../roads/state.js';
import { npcId } from './npcAgency.js';
import { memoryHorizonMultiplierOf, memoryWeaveActive } from './relationshipEvolution.js';
import { advanceNpcGrowthWithFabricAndConsequence } from './spatialConsequenceKernel.js';
import {
  LADDER_TUNING, num, asObject, compareCodepoint, round4, ladderFactionKey, eligibleMembersOf,
  rungCapForTier, seedStandingForRung, decayStandingTowardBaseline, normalizeRecord,
  normalizeSeatTransitions, sortedRecord, mirrorOf, maintainMarks, mintBond,
  designateHeir, swapIntoSeat, inheritSeatMemory,
} from './npcLadderState.js';
import { readRoadsBondEvents } from '../roads/thirdPartyRansom.js';
import { readGratitudeBondEvents, governingLadderFkeyOf, rulingSeatNidOf } from './gratitudeBonds.js';
import { GOAL_TUNING, mintGoal, evaluateGoal, attributionWeight, goalSignalVar } from './npcLadderGoals.js';
import { CHALLENGE_TUNING, resolveFactionChallenges, clashOf } from './npcLadderChallenge.js';
import { faithRuptured } from './npcLadderCoherence.js';
import { freshLieExposureFor, hasNpcCredibilityLedger, npcCredibilityActive } from './npcCredibility.js';
import { advanceContests, contestChallengeInputs } from './npcLadderContest.js';
import { mintFactionPairIncident } from './factionPairLedger.js';
import { authorityTransferEpochFor, previousGovernmentLabelsOf } from '../rulingPower.js';
// coherence-14: the ruling-bloc read (a PURE, dormant⇒null read; settlementPolitics imports only
// pure leaves, so no cycle). Consumed ONLY behind ladderPoliticalWindowsEnabled ⇒ dark ⇒ never called.
import { rulingBlocOf } from './settlementPolitics.js';

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
 * @property {Record<string, LadderBond>} [bonds] the D-7e positive twin (loyalty, gratitude,
 *   friendship), keyed by the other npcId; additive-optional (absent unless memoryWeave lit and
 *   a bond formed, the drop-when-empty dormancy contract); dies with the record (succession reset)
 * @property {number} [lastExposed] last-seen timesExposed count (fresh-exposure detection)
 * @property {boolean} [wasOusted] last-seen ousted flag (fresh-exposure detection)
 * @property {number} [lastLieSeen] D-2: last lie-exposure tick already stigmatized (consume-once)
 */
/** @typedef {{ condition: import('../autonomy/stopConditions.js').StopCondition, stakes: number,
 *   horizonWeeks: number, mintedWeek: number, mintedRung: number, startScore: number,
 *   progress: number, basis: string, supportOf?: string }} LadderGoal
 *   supportOf (D-4f): the patron npcId a LINKED SUPPORT goal is tied to — its condition IS the
 *   patron's, re-resolved each tick; the patron's goal failing cascades this one (§8). */
/** @typedef {{ sev: number, week: number, tick: number }} LadderStigma */
/** @typedef {{ sev: number, week: number, kind?: string, inherited?: boolean }} LadderGrudge
 *   kind (D-4c): a typed contest grudge ('contest_loss' | 'contest_forestalled'); absent on the
 *   ordinary failed-challenge grudge (the memory-weave WOUND_TYPE_RE reads it via recentIncidents).
 *   inherited (V-7): a grudge carried to an heir at a seat succession, dampened + marked. */
/** @typedef {{ sev: number, week: number, kind: string, foreignSid?: string, inherited?: boolean }} LadderBond
 *   inherited (V-7): a bond carried to an heir at a seat succession, dampened + marked. */
/** @typedef {{ rungs: string[], cooldownUntil: number, lastPower: number, instability: number, week: number }} LadderFactionRec */
/**
 * @typedef {Object} SeatTransition — WR-5's bounded legitimate-authority history.
 * @property {string} id stable transition identity (record-scoped)
 * @property {string|null} fromRulerId @property {string|null} toRulerId
 * @property {string} cause @property {number} tick
 * @property {string} [authorityEpoch] label-free governing-transfer epoch at the transition
 * @property {string} [installerFactionId] @property {string} [installerFactionName]
 * @property {string} [governingFactionId] @property {string} [governingFactionName]
 * @property {{actorId:string,targetId:string,decisionId:string,desiredAction:'peace'|'continue'}} [warDemand]
 */
/**
 * @typedef {Object} ContestSide — one contestant's per-contest view (§8 D-4b awareness fog).
 * @property {string} nid @property {string} [verb] the goal verb captured AT GENESIS ('raise'|'hold')
 * @property {number|null} awareSince the week discovery stamped (null ⇒ UNKNOWING — a blind race)
 * @property {number|null} heardProgress the STALE snapshot of the rival's progress at the last hear
 * @property {number|null} heardWeek the week of that snapshot
 */
/**
 * @typedef {Object} ContestRec — a head-to-head goal contest (§8; the THIRD ladder sub-key, a
 *   goal SHAPE, never a standing writer). Canonical: a.nid ≤ b.nid (codepoint).
 * @property {string} id `contest.${sid}.${signalVar}.${openedWeek}`
 * @property {string} signalVar @property {'convergent'|'opposed'} kind
 * @property {ContestSide} a @property {ContestSide} b
 * @property {number} openedWeek @property {'a'|'b'|null} backedBy the D-4e player-siding marker
 * @property {number|null} resolvedWeek @property {string|null} outcome @property {string|null} loserNid
 */
/** @typedef {{ factions: Record<string, LadderFactionRec>, npcs: Record<string, LadderStanding>,
 *   contests?: Record<string, ContestRec>, seatTransitions?: SeatTransition[] }} LadderRecord
 *   contests (D-4): the additive contested-goals sub-key (absent unless contestedGoals lit and a
 *   contest opened — the drop-when-empty dormancy contract).
 *   seatTransitions (WR-5): bounded, oldest-first facts about real governing-seat changes. */

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

/**
 * Is THE CONTESTED GOALS CLASS lit (D-4)? Reads simulationRules.contestedGoalsEnabled === true,
 * defensively — ABSENT ⇒ false ⇒ DORMANT (NO entry in DEFAULT_SIMULATION_RULES, so goldens do
 * not move). AND-gated by the caller with npcLadderActive (D-4 requires the ladder). Pure, total.
 * @param {{ simulationRules?: Record<string, unknown> }|null|undefined} worldState @returns {boolean}
 */
export function contestedGoalsActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  return !!(rules && typeof rules === 'object' && /** @type {Record<string, unknown>} */ (rules).contestedGoalsEnabled === true);
}

/**
 * Are THE POLITICAL CHALLENGE WINDOWS lit (coherence-11 + coherence-14)? Reads the VIRTUAL flag
 * simulationRules.ladderPoliticalWindowsEnabled === true, defensively — ABSENT ⇒ false ⇒ DORMANT (NO
 * entry in DEFAULT_SIMULATION_RULES, so goldens do not move). AND-gated by the caller with the ladder
 * (already lit here). Opens the faction_captured window (a faction the underworld holds — captureState
 * corrupted/capture) and the bloc_backed window (the governing faction of a consolidated ruling bloc).
 * factionCompetition (captureState) and settlementPolitics (blocs) are default/opt-in subsystems, so
 * this dedicated flag — not their presence — is what keeps the windows dark. Pure, total.
 * @param {{ simulationRules?: Record<string, unknown> }|null|undefined} worldState @returns {boolean}
 */
export function ladderPoliticalWindowsActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  return !!(rules && typeof rules === 'object' && /** @type {Record<string, unknown>} */ (rules).ladderPoliticalWindowsEnabled === true);
}

/**
 * Is V-7 HEIRS-LITE lit? Reads the VIRTUAL flag simulationRules.heirsEnabled === true, defensively
 * — ABSENT ⇒ false ⇒ DORMANT (NO entry in DEFAULT_SIMULATION_RULES, so goldens do not move). AND-
 * gated by the caller with the ladder (already lit here). Lit ⇒ on the EXISTING succession events
 * (challenge/coup — no new triggers, no death) the governing seat's successor inherits the
 * predecessor's dampened bonds/grudges and an investiture beat fires. Pure, total.
 * @param {{ simulationRules?: Record<string, unknown> }|null|undefined} worldState @returns {boolean}
 */
export function heirsActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  return !!(rules && typeof rules === 'object' && /** @type {Record<string, unknown>} */ (rules).heirsEnabled === true);
}

/**
 * THE ONE SPELLING of a seat-transition row's `governingFactionId`.
 *
 * `appendNpcLadderSeatTransition` below is the sole writer of the row, but its
 * two CALLERS compose the row themselves, and they had drifted: this kernel's
 * organic-succession path resolved the ladder key while applyWorldPulse's
 * approved-transfer path read `governingFaction?.id` and fell back to the
 * INSTALLER's id. On generated data `governing.id` is absent from 100% of rows
 * (0 of 2,175 measured), so that fallback always fired and the field recorded
 * the faction that INSTALLED the seat under the name of the faction that HOLDS
 * it — silently wrong on every transfer where installer differs from governing,
 * which is the ordinary case for a war party seating a successor.
 *
 * `ladderFactionKey` is the canonical accessor: the authored `id` when present,
 * else the `fac.<slug>` key the ladder already persists its own rungs under, so
 * a transition row and the faction record it names share one key space.
 *
 * @param {unknown} faction  The GOVERNING faction record, not the installer's.
 * @returns {string}
 */
export function seatTransitionGoverningFactionId(faction) {
  return faction ? ladderFactionKey(/** @type {any} */ (faction)) : '';
}

/**
 * Append one real governing-seat transition through the ladder's sole authoritative
 * writer. The helper is deliberately usable outside the pulse mover: an applied
 * governing-power transfer occurs at the proposal applicator, while an organic court
 * succession occurs inside this kernel. Both converge on exactly this normalizer,
 * identity check, bound, and serializer.
 *
 * Idempotence is two-layered: a repeated transition id is a no-op, and a repeated
 * typed war-decision id is also a no-op even if a caller reconstructed the surrounding
 * transfer metadata differently. A malformed/no-seat row returns the caller's exact
 * worldState reference. Existing faction, standing, contest, and transition fields are
 * preserved through the record normalizer/serializer.
 *
 * @param {Record<string, unknown>} worldState
 * @param {string} cid
 * @param {unknown} transition
 * @returns {Record<string, unknown>}
 */
export function appendNpcLadderSeatTransition(worldState, cid, transition) {
  const settlementId = String(cid || '').trim();
  if (!settlementId || !worldState || typeof worldState !== 'object') return worldState;
  const row = normalizeSeatTransitions([transition])[0];
  if (!row) return worldState;
  const ledger = asObject(getSpatialLedger(worldState, 'npcLadder'));
  const rec = normalizeRecord(ledger[settlementId], row.tick);
  const prior = rec.seatTransitions || [];
  const decisionId = row.warDemand?.decisionId || null;
  if (prior.some((existing) => existing.id === row.id)) return worldState;
  // A decision id may organize more than one opposition faction. If another
  // faction later wins a distinct, real authority transition, preserve that
  // seat fact but do not duplicate the already-carried command.
  const repeatedDemand = decisionId != null
    && prior.some((existing) => existing.warDemand?.decisionId === decisionId);
  const appendRow = repeatedDemand
    ? /** @type {SeatTransition} */ (({ warDemand: _duplicateDemand, ...rest }) => rest)(row)
    : row;
  /** @type {LadderRecord} */
  const nextRec = {
    ...rec,
    seatTransitions: normalizeSeatTransitions([...prior, appendRow]),
  };
  const serialized = sortedRecord(nextRec);
  if (!serialized) return worldState; // defensive: a valid transition makes this unreachable
  /** @type {Record<string, unknown>} */
  const nextLedger = {};
  const keys = Array.from(new Set([...Object.keys(ledger), settlementId])).sort(compareCodepoint);
  for (const key of keys) nextLedger[key] = key === settlementId ? serialized : ledger[key];
  return setSpatialLedger(worldState, 'npcLadder', nextLedger);
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
 * @returns {{ st: LadderStanding, outcome: { fired: boolean, expired: boolean, lapsed: boolean, signalVar: string, endProgress: number }|null }}
 */
function applyGoalLifecycle(st, ctx) {
  const { npc, faction, rungIndex, sid, frame, item, weeks } = ctx;
  const mint = () => mintGoal({ npc, faction, rungIndex, sid, frame, item, weeks });
  let goal = st.goal;
  let stock = st.stock;
  if (!goal) return { st: { ...st, goal: mint() }, outcome: null };
  // D-4f: a LINKED SUPPORT goal is driven by the settlement-wide contest pass (its progress
  // mirrors the patron's, its fate cascades with the patron's) — the per-rung lifecycle leaves
  // it untouched here (the pass owns its deposit/cascade/remint).
  if (goal.supportOf) return { st, outcome: null };
  const signalVar = goalSignalVar(goal);
  const ev = evaluateGoal(goal, frame);
  if (!ev.readable) {
    // LAPSED — the premise died by outside forces (the signal is gone): remint, no deposit; the
    // contest pass (D-4c) reads this outcome and voids any race grounded on it.
    return { st: { ...st, goal: mint() }, outcome: { fired: false, expired: false, lapsed: true, signalVar, endProgress: goal.progress } };
  }
  const delta = ev.progress - goal.progress;
  const aw = attributionWeight(rungIndex, faction, signalVar);
  const deposit = goal.stakes * delta * aw * GOAL_TUNING.DEPOSIT_SCALE;
  stock = clamp(stock + deposit, 0, LADDER_TUNING.STAND_MAX);
  goal = { ...goal, progress: ev.progress };
  // Settle at outcome: a fired deed, an expired horizon, or a rung change reminds a fresh
  // goal (the delta above is already banked — completion/expiry keep the earned deposits).
  const expired = (weeks - goal.mintedWeek) >= goal.horizonWeeks;
  const rungChanged = goal.mintedRung !== rungIndex;
  const settled = ev.fired || expired || rungChanged;
  if (settled) goal = mint();
  // The D-4 goal OUTCOME (consumed by the settlement-wide contest pass): fired ⇒ finisher/prevailed,
  // expired-unfired ⇒ the horizon lapse, rungChanged ⇒ the premise moved (a contest lapse).
  const outcome = settled
    ? { fired: ev.fired, expired: expired && !ev.fired, lapsed: rungChanged && !ev.fired && !expired, signalVar, endProgress: ev.progress }
    : null;
  return { st: { ...st, stock: round4(stock), goal }, outcome };
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
  const T = LADDER_TUNING;
  /** @type {Array<Record<string, unknown>>} */
  const newsEntries = [];
  let realmSuccessions = 0; // (4) the realm-wide E0 cap on successions per advance
  const now2 = Math.max(0, Math.floor(num(tick, 0)));
  const weeks = num(asObject(asObject(worldState).calendar).elapsedWeeks, now2);
  const items = Array.isArray(snapshot?.settlements) ? snapshot.settlements : [];
  const itemById = new Map(items.map((it) => [String(it.id), it]));
  // D-2: the lie-stigma hook is live only when the per-NPC credibility ledger has
  // materialized (⇒ npcCredibilityEnabled was lit). Dark ⇒ no deposit read, no stigma, the
  // ladder is byte-identical (the ladder-dark twin's mirror image — credibility runs, ladder
  // doesn't; here the ladder runs, credibility didn't).
  const lieStigmaLit = hasNpcCredibilityLedger(worldState);
  // D-4: the contested-goals class (AND-gated with the ladder, already lit here). Dark ⇒ the
  // settlement-wide contest pass never runs, no contests key, byte-identical. D-4f (support/join
  // + the cross-faction grievance read) additionally requires the memory weave.
  const contestsLit = contestedGoalsActive(worldState);
  const memWeave = memoryWeaveActive(worldState);
  // coherence-11/14: the political challenge windows (faction_captured + bloc_backed). Dark ⇒ the
  // per-faction window inputs stay false ⇒ openWindows never pushes them ⇒ byte-identical.
  const politicalWindowsLit = ladderPoliticalWindowsActive(worldState);
  // V-7 HEIRS-LITE: the governing seat gains a designated heir + inherited memory on the EXISTING
  // succession events. Dark ⇒ no heir swap, no inheritance, no investiture beat ⇒ byte-identical.
  const heirsLit = heirsActive(worldState);
  // D-5 §9: the roads gratitude-bond deposits (a friend ransomed an NPC home) — consumed into
  // person bonds through this kernel's own writer (mintBond), memoryWeave-gated. Absent ⇒ empty.
  const roadsBondEvents = memWeave ? readRoadsBondEvents(worldState, now2) : new Map();
  // D-7e (ii) THE GENEROSITY GRATITUDE consume — the same-tick twin of the roads deposit
  // (generosity ran earlier THIS tick; events carry tick === now and the ledger lives one
  // tick). The receiving COURT is grateful: its ruling-seat NPC bonds toward the GIVER's
  // ruling-seat NPC (cross-border ⇒ foreignSid = giver sid), through mintBond only.
  const gratitudeBondEvents = memWeave ? readGratitudeBondEvents(worldState, now2) : new Map();
  // D-4→D-2 THE BLUFF CHARGE rides BOTH flags (contestedGoals ∧ npcCredibility): the ladder
  // deposits a contradicted-bluff exposure into the bluffExposures sidecar ONLY when the credibility
  // system that consumes it is lit. Dark ⇒ no deposit, no sidecar key, byte-identical (a bluff that
  // no one can charge is dropped, exactly as before this seam closed).
  const bluffChargeLit = contestsLit && npcCredibilityActive(worldState);
  const warRulingsLit = asObject(worldState.simulationRules).warLayerEnabled === true
    && asObject(worldState.simulationRules).warTerminationEnabled === true;
  /** @type {Array<{ a: string, b: string, type: string, resentmentDelta: number, sev: number }>} D-4c §10.5 cross-faction loss deposits */
  const factionPairDeposits = [];
  /** @type {Array<{ nid: string, band: number }>} D-4→D-2 contradicted-bluff exposures carried to the bluffExposures sidecar */
  const bluffDeposits = [];
  /** @type {Array<{ cid: string, transition: SeatTransition }>} WR-5 organic governing-seat changes, applied through the shared writer after ladder persistence */
  const organicSeatTransitions = [];

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
  /** @type {Map<string, Map<string, { power: number, legit: number, instab: number }>>} sid → §8 modifiers */
  const modBySettlement = new Map();

  const orderedIds = items.map((it) => String(it.id)).sort(compareCodepoint);

  // ── PASS 1: per live settlement — derive/reconcile ladders, decay standings. ──
  for (const sid of orderedIds) {
    const s = freshSettlement(sid);
    if (!s) continue;
    const prior = normalizeRecord(priorLedger[sid], weeks);
    const factionsList = Array.isArray(asObject(asObject(s).powerStructure).factions)
      ? /** @type {Array<Record<string, unknown>>} */ (asObject(asObject(s).powerStructure).factions) : [];
    const governingFkey = governingLadderFkeyOf(s);
    const priorGovernmentLabels = warRulingsLit
      ? previousGovernmentLabelsOf(/** @type {any} */ (s))
      : [];
    const priorGovernmentAliases = priorGovernmentLabels.map((label) => ({
      label,
      key: ladderFactionKey({ faction: label }),
    }));
    const aliasedPriorGoverningRec = priorGovernmentAliases
      .map((alias) => prior.factions[alias.key])
      .find(Boolean) || null;
    const priorGoverningRec = governingFkey
      ? (prior.factions[governingFkey]
        || aliasedPriorGoverningRec)
      : null;
    const priorGoverningSeat = priorGoverningRec?.rungs?.[0] || null;
    let governingSeatCause = 'succession';
    const cap = rungCapForTier(/** @type {string} */ (asObject(s).tier));
    const causalItem = snapshot?.byId?.get?.(sid) || itemById.get(sid) || null;
    const bandMult = memoryHorizonMultiplierOf(/** @type {Parameters<typeof memoryHorizonMultiplierOf>[0]} */ (/** @type {unknown} */ (s)));
    const townName = String(itemById.get(sid)?.name || asObject(s).name || sid);
    const seed = String(asObject(worldState).rngSeed || '');
    // npcId → npc object (for the goal lens); the SAME key the growth layer computes.
    /** @type {Map<string, Record<string, unknown>>} */
    const npcByNid = new Map();
    const roster = Array.isArray(asObject(s).npcs) ? /** @type {unknown[]} */ (asObject(s).npcs) : [];
    roster.forEach((n, i) => { npcByNid.set(npcId(sid, /** @type {Parameters<typeof npcId>[1]} */ (n), i), asObject(n)); });

    /** @type {Record<string, import('./npcLadderKernel.js').LadderFactionRec>} */
    const factions = {};
    /** @type {Record<string, import('./npcLadderKernel.js').LadderStanding>} */
    let npcs = {}; // reassigned by the D-4 contest pass (plan-then-apply produces a new map)
    /** @type {Map<string, string>} */
    const nameByNid = new Map();
    /** @type {Set<string>} */
    const activeNids = new Set();
    /** @type {Map<string, { power: number, legit: number, instab: number }>} §8 mirror modifiers */
    const modByFkey = new Map();
    // D-4: per-NPC contest metadata (faction/rung/npc) + the per-advance goal OUTCOMES the
    // settlement-wide contest pass consumes, and the challenge-window inputs derived from the
    // PRIOR tick's contests (cross-tick, law 14 — the contested_goal window + fixation rate bias).
    /** @type {Map<string, { fkey: string, faction: unknown, rungIndex: number, rungCount: number, npc: Record<string, unknown> }>} */
    const nidMeta = new Map();
    /** @type {Map<string, { fired: boolean, expired: boolean, lapsed: boolean, signalVar: string, endProgress: number }>} */
    const goalOutcomes = new Map();
    const contestInputs = contestsLit
      ? contestChallengeInputs({ priorContests: prior.contests || {}, priorNpcs: prior.npcs, npcByNid, weeks })
      : null;
    // COUP TRUNCATION (§7): a fresh coup this tick replaces the top rung wholesale — the
    // ladder DEFERS (truncates the stage faction's pending challenges + seals it).
    const coupTruncated = coupTruncatedFkeys(s, factionsList, now2);
    // D-7e (ii): this settlement's gratitude deposits (if any) land on its RULING seat —
    // resolve the governing faction's ladder key once per settlement (canonical accessor).
    const gratSidEvents = gratitudeBondEvents.size ? (gratitudeBondEvents.get(sid) || null) : null;
    const gratGovFkey = gratSidEvents ? governingFkey : null;
    // coherence-14: the settlement's ruling bloc (rulingBlocOf is dormant⇒null and needs
    // settlementPolitics lit; only consulted when the political-windows flag is lit). The GOVERNING
    // faction of a consolidated bloc — definitionally a bloc member — gets the bloc_backed window,
    // so no fragile faction-name match against bloc.members is needed (the isGoverning read suffices).
    const rulingBloc = politicalWindowsLit ? rulingBlocOf(worldState, sid, /** @type {Parameters<typeof rulingBlocOf>[2]} */ (causalItem)) : null;

    for (const faction of factionsList) {
      const fkey = ladderFactionKey(faction);
      if (factions[fkey]) continue; // first faction wins a duplicate key (byte-stable)
      const directEligible = eligibleMembersOf(sid, s, faction, fkey, { excludeDead: warRulingsLit });
      const aliasEligible = warRulingsLit && fkey === governingFkey
        ? priorGovernmentAliases.flatMap((alias) => alias.key === fkey ? [] : eligibleMembersOf(
          sid,
          s,
          { faction: alias.label },
          alias.key,
          { excludeDead: true },
        ))
        : [];
      const eligible = [...directEligible];
      const eligibleNids = new Set(directEligible.map((member) => member.npcId));
      for (const member of aliasEligible) {
        if (!eligibleNids.has(member.npcId)) {
          eligible.push(member);
          eligibleNids.add(member.npcId);
        }
      }
      // Once WR-5 has migrated a name-keyed governing ladder, its exact prior
      // governing record is the durable membership bridge across later label
      // transfers. Preserve only live, on-stage persisted rungs; this prevents
      // the bounded previous-government label history from ejecting a ruler on
      // transfer seven without reviving a dead or absent office-holder.
      if (warRulingsLit && fkey === governingFkey && aliasedPriorGoverningRec) {
        for (const rawNid of aliasedPriorGoverningRec.rungs || []) {
          const nid = typeof rawNid === 'string' && rawNid ? rawNid : null;
          const member = nid ? npcByNid.get(nid) : null;
          if (!nid || !member || eligibleNids.has(nid)
            || String(member.status || '').toLowerCase() === 'dead'
            || isOffStage(member)) continue;
          eligible.push({ npcId: nid, name: String(member.name || member.label || nid) });
          eligibleNids.add(nid);
        }
      }
      for (const m of eligible) nameByNid.set(m.npcId, m.name);
      const eligibleIds = eligible.map((m) => m.npcId);
      const eligibleSet = new Set(eligibleIds);
      const priorRec = prior.factions[fkey]
        || (warRulingsLit && fkey === governingFkey ? aliasedPriorGoverningRec : null);

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
      // structural height (the defender's-advantage head start). Maintain the §10 stigma +
      // §4e grudge marks (band-scaled decay + fresh-exposure mint), then run the GOAL
      // lifecycle (§3.2 mint/evolve, §9 weighted deeds, §11.3 partial-progress deposits).
      /** @type {Set<string>} the rung-holders freshly exposed for corruption THIS advance */
      const freshExposed = new Set();
      /** @type {Set<string>} D-2: the rung-holders freshly exposed as LIARS THIS advance */
      const freshLieExposed = new Set();
      /** @type {Set<string>} §4b religious-faction heads standing AGAINST their faith */
      const ruptured = new Set();
      rungs.forEach((nid, rungIndex) => {
        activeNids.add(nid);
        const npcObj = npcByNid.get(nid) || {};
        if (faithRuptured(npcObj, faction, worldState, sid)) ruptured.add(nid);
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
        // D-2 (design §6, law 14): consume a fresh lie-exposure deposit — one tick after
        // exposure, once (freshLieExposureFor filters the lag + the last-seen). The stigma
        // is minted through the ladder's own writer (maintainMarks); statecraft only deposits.
        const lieExp = lieStigmaLit ? freshLieExposureFor(worldState, nid, num(st.lastLieSeen, -1), now2) : null;
        const marks = maintainMarks(st, npcObj, bandMult, weeks, now2, lieExp);
        if (marks.freshExposed) freshExposed.add(nid);
        if (marks.freshLieExposed) freshLieExposed.add(nid);
        const gl = applyGoalLifecycle(marks.st, {
          npc: npcObj, faction, rungIndex, sid, frame: goalFrame, item: causalItem, weeks,
        });
        npcs[nid] = gl.st;
        // D-5 §9: a friend's ransom forms a gratitude bond toward the payer's NPC (the ladder is
        // the bonds writer; roads only deposited the event). Cross-border ⇒ foreignSid = payer sid.
        if (roadsBondEvents.size) {
          const bev = roadsBondEvents.get(`${sid}|${nid}`);
          if (bev) npcs[nid].bonds = mintBond(npcs[nid].bonds, bev.targetNpcKey, 'gratitude', bev.sev, weeks, bev.targetSid);
        }
        // D-7e (ii): generosity's gratitude lands COURT-TO-COURT — only on the receiving
        // settlement's ruling-seat NPC (top rung of the governing faction), toward the giver
        // court's seat resolved from the PRIOR persisted ladder (deterministic, order-free).
        // Any unresolvable hop (vacant court, no ladder yet) skips — absent machinery no-ops.
        if (gratSidEvents && rungIndex === 0 && fkey === gratGovFkey) {
          for (const gev of gratSidEvents) {
            const giverSeatNid = rulingSeatNidOf(priorLedger[gev.giverSid], freshSettlement(gev.giverSid));
            if (giverSeatNid) npcs[nid].bonds = mintBond(npcs[nid].bonds, giverSeatNid, 'gratitude', gev.sev, weeks, gev.giverSid);
          }
        }
        if (contestsLit) {
          nidMeta.set(nid, { fkey, faction, rungIndex, rungCount: rungs.length, npc: npcObj });
          if (gl.outcome) goalOutcomes.set(nid, gl.outcome);
        }
      });

      const power = num(asObject(faction).power, 0);
      const priorPower = priorRec ? priorRec.lastPower : power;
      const factionRising = power > priorPower + CHALLENGE_TUNING.POWER_TRAJECTORY_EPS;
      const factionFalling = power < priorPower - CHALLENGE_TUNING.POWER_TRAJECTORY_EPS;
      // coherence-11: this faction is held by the underworld (captureState corrupted/capture) ⇒ the
      // faction_captured window. coherence-14: the governing faction of a consolidated ruling bloc ⇒
      // the bloc_backed window. Both false unless ladderPoliticalWindowsEnabled is lit (⇒ byte-dark).
      const captureRung = String(asObject(faction).captureState || 'none');
      const factionCaptured = politicalWindowsLit && (captureRung === 'corrupted' || captureRung === 'capture');
      const blocBacked = politicalWindowsLit && rulingBloc != null && asObject(faction).isGoverning === true;

      // ── THE CHALLENGE ENGINE (§2/§3/§11.4): windowed, seeded, margin-gated contests
      // (a win SWAPS the pair — conservation; a loss drops the challenger — the stake). ──
      /** @type {LadderFactionRec} */
      const rec = { rungs, cooldownUntil: priorRec ? priorRec.cooldownUntil : 0, lastPower: power, instability: priorRec ? priorRec.instability : 0, week: weeks };
      const truncated = coupTruncated.has(fkey);
      const plan = truncated
        ? /** @type {ReturnType<typeof resolveFactionChallenges>} */ ({ nextRungs: rungs, events: [], grudgeMints: [], withdraws: [], successions: 0 })
        : resolveFactionChallenges({
          rungs, npcs, npcByNid, faction, fkey, cooldownUntil: rec.cooldownUntil, weeks, tick: now2,
          seed, factionRising, factionFalling, freshExposed, freshLieExposed, faithRuptured: ruptured, worldState,
          realmBudget: CHALLENGE_TUNING.REALM_SUCCESSION_CAP - realmSuccessions,
          // D-4b: the contested_goal window (live-contest adjacent rivals + recent losers) +
          // the tunnel-vision attempt-rate bias. Absent ⇒ no window, no bias (byte-identical dark).
          contestPairs: contestInputs ? contestInputs.contestPairs : null,
          loserWindowNids: contestInputs ? contestInputs.loserWindowNids : null,
          rateMultDir: contestInputs ? contestInputs.rateMultDir : null,
          // coherence-11/14: the political challenge windows (false unless the flag is lit ⇒ dark).
          factionCaptured, blocBacked,
        });
      if (truncated) rec.cooldownUntil = Math.max(rec.cooldownUntil, weeks + CHALLENGE_TUNING.COOLDOWN_WEEKS);
      let normBreakingWins = 0;
      if (plan.events.length) {
        rec.rungs = plan.nextRungs;
        // The STAKE (§2): a failed challenge stamps a D5 grudge (hardens the same defender
        // on a repeat) + withdraws a share of the challenger's standing.
        for (const gm of plan.grudgeMints) {
          const cr = npcs[gm.challengerNid];
          if (cr) cr.grudges = { ...cr.grudges, [gm.defenderNid]: { sev: CHALLENGE_TUNING.GRUDGE_MINT_SEV, week: weeks } };
        }
        for (const w of plan.withdraws) {
          const cr = npcs[w.nid];
          if (cr) cr.stock = round4(clamp(cr.stock - cr.stock * w.share, 0, T.STAND_MAX));
        }
        if (plan.successions > 0) {
          rec.cooldownUntil = weeks + CHALLENGE_TUNING.COOLDOWN_WEEKS; // (3) the interregnum
          realmSuccessions += plan.successions;
        }
        // §8c LEGITIMACY READS THE HOW: a norm-breaking usurpation (a stigmatized or covert-
        // compromised climber taking the seat) taxes legitimacy; a clean windowed rise is renewal.
        for (const ev of plan.events) {
          if (ev.kind === 'rise') {
            const cst = npcs[ev.challengerNid];
            const cobj = npcByNid.get(ev.challengerNid) || {};
            if ((cst && cst.stigma) || cobj.corrupt === true) normBreakingWins += 1;
          }
          newsEntries.push(ladderBeat(sid, townName, fkey, ev, now2, now));
        }
      }
      // ── V-7 HEIRS-LITE: on a GOVERNING-seat succession the seat gains a face + inherited
      // memory. NO new trigger (rides the EXISTING coup-truncation / challenge rise), NO death,
      // CONSERVATION held (the heir SWAP is a permutation of the rungs). Dark ⇒ skipped entirely
      // ⇒ byte-identical. Governing factions only ("who follows the old lion?" is the ruler). ──
      if (heirsLit && asObject(faction).isGoverning === true && rungs.length) {
        const seatBefore = rungs[0];
        if (truncated) {
          // COUP: the ladder deferred (rungs untouched) — seat the DESIGNATED HEIR (the most-bonded
          // lieutenant below the seat), a permutation swap, so a coup has a real successor face
          // rather than a faceless regime change. On a challenge the merited climber already holds it.
          const heir = designateHeir(rec.rungs, npcs);
          if (heir && heir !== seatBefore) rec.rungs = swapIntoSeat(rec.rungs, heir);
        }
        const seatAfter = rec.rungs[0];
        if (seatAfter && seatBefore && seatAfter !== seatBefore) {
          // The new seat-holder inherits a bounded, dampened fraction of the predecessor's bonds/
          // grudges (marked inherited — the memory carries) + an investiture beat via the ladder's
          // own writer. Single-writer preserved: the copy lands on the heir's OWN standing (no graph).
          const predSt = npcs[seatBefore] || prior.npcs[seatBefore] || null;
          if (npcs[seatAfter]) npcs[seatAfter] = inheritSeatMemory(npcs[seatAfter], predSt, seatAfter, weeks);
          newsEntries.push(investitureBeat(sid, townName, fkey, seatAfter, seatBefore, nameByNid, truncated ? 'coup' : 'challenge', now2, now));
        }
      }
      if (governingFkey && fkey === governingFkey) {
        if (truncated && rec.rungs[0] !== priorGoverningSeat) governingSeatCause = 'coup';
        else if (plan.events.some((event) => event.kind === 'rise'
          && event.challengerNid === rec.rungs[0]
          && event.defenderNid === priorGoverningSeat)) governingSeatCause = 'challenge';
      }
      // §8 THE STANDING LOOP (single-writer to the mirror): leadership quality → the power
      // modifier; churn → the decaying instability tax; the HOW → the legitimacy modifier.
      const decayWeeks = priorRec ? Math.max(0, weeks - priorRec.week) : 0;
      const loop = factionLoopModifiers({
        rungs: rec.rungs, npcs, npcByNid, faction,
        priorInstability: priorRec ? priorRec.instability : 0, decayWeeks,
        contests: plan.events.length, normBreakingWins,
      });
      rec.instability = loop.instab;
      modByFkey.set(fkey, { power: loop.power, legit: loop.legit, instab: loop.instab });
      factions[fkey] = rec;
    }

    // WR-5: first derivation is not a historical transition. Once a governing ladder
    // existed, however, a changed top rung (including a genuine vacancy) is a durable
    // authority fact. Queue it now and apply it later through the SAME exported writer
    // governing-power transfers use; this loop never grows a second append path.
    const nextGoverningSeat = governingFkey ? (factions[governingFkey]?.rungs?.[0] || null) : null;
    if (warRulingsLit && governingFkey && priorGoverningRec && priorGoverningSeat !== nextGoverningSeat) {
      const governingFaction = factionsList.find((faction) => ladderFactionKey(faction) === governingFkey) || null;
      const faction = asObject(governingFaction);
      const governingFactionName = String(faction.faction || faction.name || faction.label || '').trim();
      /** @type {SeatTransition} */
      const transition = /** @type {SeatTransition} */ ({
        id: `ladder:${sid}:${now2}:${priorGoverningSeat || 'vacant'}:${nextGoverningSeat || 'vacant'}`,
        fromRulerId: priorGoverningSeat,
        toRulerId: nextGoverningSeat,
        cause: nextGoverningSeat ? governingSeatCause : 'vacancy',
        tick: now2,
        authorityEpoch: authorityTransferEpochFor(/** @type {any} */ (s)),
        // Routed through the shared helper so this path and applyWorldPulse's
        // approved-transfer path cannot drift again; `governingFkey` still
        // covers the case where the governing record itself did not resolve.
        governingFactionId: seatTransitionGoverningFactionId(governingFaction) || governingFkey,
        ...(governingFactionName ? { governingFactionName } : {}),
      });
      organicSeatTransitions.push({ cid: sid, transition });
    }

    // Orphan standings (an NPC that held a rung last tick but is on none now): decay on the base
    // clock. DECAY THE MARKS TOO (stigma/grudges/bonds on their band clocks, via the ladder's own
    // writer) — an orphan's marks must not freeze immortal — and DROP its goal: an off-ladder NPC
    // holds no rung to pursue, so a lingering goal is neither advanceable NOR meaningful, and the
    // mirror must stop reporting it as an active goal for an NPC on no rung. The record then
    // survives ONLY for decaying stigma/grudge memory and finally PRUNES when that fades
    // (drop-when-empty). Today any goal/stigma/grudge kept the record immortal (a churn/remove_npc
    // leak) and mirrorOf emitted a stale active goal (which ladderGoalOf/roads then read).
    for (const nid of Object.keys(prior.npcs)) {
      if (activeNids.has(nid)) continue;
      const priorSt = prior.npcs[nid];
      const decayed = round4(decayStandingTowardBaseline(priorSt.stock, Math.max(0, weeks - priorSt.week)));
      // Exposure-preserving stub (off-ladder ⇒ no fresh exposure; keep timesExposed/ousted so no
      // false second-exposure fires should the NPC ever re-seat) — only the marks decay here.
      const orphanSt = maintainMarks(
        { ...priorSt, stock: decayed },
        { timesExposed: num(priorSt.lastExposed, 0), ousted: priorSt.wasOusted === true },
        bandMult, weeks, now2, null,
      ).st;
      // goal is written null (dropped): an off-ladder NPC holds no rung to pursue, so it must not
      // be mirrored as an active goal, and dropping it lets the record prune once its marks fade.
      const meaningful = Math.abs(decayed - T.STAND_BASELINE) >= T.PRUNE_EPSILON
        || !!orphanSt.stigma || Object.keys(orphanSt.grudges).length > 0;
      if (!meaningful) continue;
      npcs[nid] = { ...orphanSt, goal: null, stock: decayed, week: weeks };
    }

    // ── D-4 THE SETTLEMENT-WIDE CONTEST PASS (§8) — runs AFTER the per-faction goal + challenge
    // loops (determinism discipline i: a separate settlement-wide pass, so cross-faction pairs are
    // visible and no NPC mints "vs B" while B mints "vs A"). Prunes dead contests, runs awareness
    // discovery, resolves fired/expired contests (plan-then-apply standing writes), drives + mints
    // D-4f support goals, and mints new contests. Dark ⇒ skipped, byte-identical. ──
    /** @type {Record<string, import('./npcLadderKernel.js').ContestRec>|undefined} */
    let contests;
    if (contestsLit) {
      const remint = (/** @type {string} */ nid) => {
        const meta = nidMeta.get(nid);
        return meta ? mintGoal({ npc: meta.npc, faction: meta.faction, rungIndex: meta.rungIndex, sid, frame: goalFrame, item: causalItem, weeks }) : null;
      };
      const res = advanceContests({
        sid, weeks, tick: now2, seed, townName, worldState,
        priorContests: prior.contests || {}, npcs, priorNpcs: prior.npcs, nidMeta, goalOutcomes,
        remint, attributionWeight, memoryWeaveActive: memWeave, now,
      });
      npcs = res.npcs;
      if (Object.keys(res.contests).length) contests = res.contests;
      for (const n of res.news) newsEntries.push(n);
      for (const d of res.factionPairDeposits) factionPairDeposits.push(d);
      // res.bluffDeposits (D-4→D-2, design §8 THE BLUFF): a contestant who bluffed a rival about
      // his progress and then LOST is a contradicted liar — "a lie, same as intel". CARRY the
      // deposits to the bluffExposures sidecar (persist below); informationStatecraft consumes them
      // one tick later into a PERSONAL credibility charge + the same lie-stigma the exposed-lie path
      // mints (mirror). The charge rides the credibility system's OWN writer (no parallel writer) —
      // the ladder only DEPOSITS. Gated on npcCredibility lit (bluffChargeLit): dark ⇒ dropped,
      // byte-identical (the pre-seam behaviour).
      if (bluffChargeLit) for (const b of res.bluffDeposits) bluffDeposits.push(b);
    }

    nameBySettlement.set(sid, nameByNid);
    modBySettlement.set(sid, modByFkey);
    /** @type {LadderRecord} */
    const settlementRec = { factions, npcs };
    if (contests) settlementRec.contests = contests;
    if (prior.seatTransitions?.length) settlementRec.seatTransitions = prior.seatTransitions;
    nextLedger[sid] = settlementRec;
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
    // §8 modifiers ride the mirror when non-neutral (absent ⇒ ladderRead coalesces to
    // null/0 ⇒ byte-identical at the flag-gated read site).
    const desired = rec ? mirrorOf(/** @type {import('./npcLadderKernel.js').LadderRecord} */ (rec), nameBySettlement.get(sid) || new Map(), modBySettlement.get(sid) || new Map()) : null;
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
  // WR-5's organic succession half: use the exact public writer applied governing-
  // power transfers call. Running after the base ladder fold means the helper reads
  // the final rungs while preserving every record field and prior transition.
  for (const queued of organicSeatTransitions) {
    const withTransition = appendNpcLadderSeatTransition(nextWorldState, queued.cid, queued.transition);
    if (withTransition !== nextWorldState) changed = true;
    nextWorldState = withTransition;
  }
  // ── D-4c §10.5 THE CROSS-FACTION LOSS LOOP: apply the collected faction-pair incidents through
  // the faction-pair ledger's OWN writer (the sanctioned applicator idiom — the ladder requests,
  // factionPairLedger writes its own ledger). memoryWeave-gated at deposit time, so an empty list
  // when dark ⇒ no write ⇒ byte-identical. Codepoint-ordered for determinism. ──
  if (factionPairDeposits.length) {
    for (const d of factionPairDeposits.slice().sort((x, y) => compareCodepoint(`${x.a}|${x.b}`, `${y.a}|${y.b}`))) {
      nextWorldState = mintFactionPairIncident(nextWorldState, { a: d.a, b: d.b, type: d.type, resentmentDelta: d.resentmentDelta, sev: d.sev, tick: now2, weeks });
    }
    changed = true;
  }

  // ── D-4→D-2 THE BLUFF-EXPOSURE SIDECAR (design §8 write-list: "the bluff-exposure deposit record,
  // consumed by D-2's pass"): DEPOSIT this tick's contradicted bluffs (depositTick = now2) + carry
  // forward any not-yet-couriered; PRUNE any from a PRIOR tick (informationStatecraft runs EARLIER in
  // the tick and already charged them — law 14 one-tick courier). The ladder is the SOLE writer/pruner
  // of this sidecar; statecraft only READS it (the intelTransfers ownership idiom, roles reversed).
  // Dedupe by nid (one charge per bluffer per tick, max band). Drop-when-empty ⇒ byte-identical when
  // bluffChargeLit is dark (zero deposits) or the sidecar has drained. The 'bluffExposures' literal on
  // this WRITE is what the spatialUsage coverage walker registers (EXEMPT). ──
  {
    const bluffPrior = asObject(getSpatialLedger(nextWorldState, 'bluffExposures'));
    if (bluffDeposits.length || Object.keys(bluffPrior).length) {
      /** @type {Record<string, unknown>} */
      const nextBluff = {};
      for (const [k, v] of Object.entries(bluffPrior)) {
        if (Math.floor(num(asObject(v).depositTick, now2)) < now2) continue; // consumed ⇒ prune
        nextBluff[k] = v;
      }
      /** @type {Map<string, number>} */
      const byNid = new Map();
      for (const d of bluffDeposits) {
        const nid = String(d.nid);
        const band = clamp(Math.round(num(d.band, 2)), 0, 4);
        byNid.set(nid, Math.max(byNid.get(nid) ?? 0, band));
      }
      for (const nid of [...byNid.keys()].sort(compareCodepoint)) {
        nextBluff[`bluff.${nid}.${now2}`] = { nid, band: byNid.get(nid), depositTick: now2 };
      }
      const sortObj = (/** @type {Record<string, unknown>} */ o) => {
        /** @type {Record<string, unknown>} */
        const s = {};
        for (const k of Object.keys(o).sort(compareCodepoint)) s[k] = o[k];
        return s;
      };
      const sortedBluff = sortObj(nextBluff);
      if (JSON.stringify(sortedBluff) !== JSON.stringify(sortObj(bluffPrior))) {
        nextWorldState = Object.keys(sortedBluff).length
          ? setSpatialLedger(nextWorldState, 'bluffExposures', sortedBluff)
          : dropSpatialLedger(nextWorldState, 'bluffExposures');
        changed = true;
      }
    }
  }
  if (newsEntries.length) changed = true;

  return { settlementUpdates: nextUpdates, worldState: nextWorldState, changed, newsEntries };
}

// ── §8 THE STANDING LOOP + §7 coup truncation ─────────────────────────────────
/**
 * The faction's §8 mirror modifiers (single-writer — projected onto the mirror; the read
 * side consumes them when lit): (a) LEADERSHIP QUALITY → a bounded power modifier (the
 * rung-holders' mean standing + goal service − clash lifts/sinks the faction above its
 * institutional base); (b) CHURN → a decaying instability tax (the fabric half-life idiom,
 * bumped per contested challenge); (c) LEGITIMACY-OF-THE-HOW → a modifier taxed by norm-
 * breaking usurpations. PURE.
 * @param {{ rungs: string[], npcs: Record<string, LadderStanding>, npcByNid: Map<string, Record<string, unknown>>,
 *   faction: unknown, priorInstability: number, decayWeeks: number, contests: number, normBreakingWins: number }} a
 * @returns {{ power: number, legit: number, instab: number }}
 */
function factionLoopModifiers(a) {
  const { rungs, npcs, npcByNid, faction, priorInstability, decayWeeks, contests, normBreakingWins } = a;
  let q = 0;
  let n = 0;
  for (const nid of rungs) {
    const st = npcs[nid];
    if (!st) continue;
    const clash = clashOf(npcByNid.get(nid) || {}, faction);
    const goalProg = st.goal ? st.goal.progress : 0;
    q += clamp01(st.stock / LADDER_TUNING.STAND_MAX) - 0.5 * clash + 0.3 * goalProg;
    n += 1;
  }
  const quality = n ? q / n : 0.5;
  const power = clamp(1 + LADDER_TUNING.LEADERSHIP_GAIN * (quality - 0.5) * 2, LADDER_TUNING.POWER_MOD_MIN, LADDER_TUNING.POWER_MOD_MAX);
  const decayed = decayWeeks > 0 ? priorInstability * Math.pow(0.5, decayWeeks / LADDER_TUNING.INSTABILITY_HALF_LIFE_WEEKS) : priorInstability;
  const instab = clamp01(decayed + LADDER_TUNING.CHURN_BUMP * contests);
  const legit = clamp(1 - LADDER_TUNING.LEGIT_TAX * normBreakingWins, LADDER_TUNING.LEGIT_MOD_MIN, 1);
  return { power: round4(power), legit: round4(legit), instab: round4(instab) };
}

/**
 * The faction keys whose ladder a FRESH coup this tick truncates (§7 — a coup replaces the
 * top rung wholesale; the ladder defers, never contradicts it). Reads the settlement's
 * fresh coup condition (government_overthrown / coup_suppressed, triggeredAt.tick === now)
 * and truncates the GOVERNING faction (the coup's stage). PURE.
 * @param {Record<string, unknown>} s @param {Array<Record<string, unknown>>} factionsList @param {number} now2
 * @returns {Set<string>}
 */
function coupTruncatedFkeys(s, factionsList, now2) {
  /** @type {Set<string>} */
  const set = new Set();
  const conds = Array.isArray(asObject(s).activeConditions) ? /** @type {unknown[]} */ (asObject(s).activeConditions) : [];
  const fresh = conds.some((c) => {
    const co = asObject(c);
    const arch = String(co.archetype || '');
    if (arch !== 'government_overthrown' && arch !== 'coup_suppressed') return false;
    return Math.floor(num(asObject(co.triggeredAt).tick, -1)) === now2;
  });
  if (!fresh) return set;
  for (const f of factionsList) if (asObject(f).isGoverning === true) set.add(ladderFactionKey(f));
  return set;
}

// ── The ladder beat (house voice) ─────────────────────────────────────────────
/**
 * The npc_ladder chronicle beat — a rise (a challenger displaced the rung above) or a
 * failed challenge (ambition punished). Unvoiced crier-wise (the urban_fabric precedent);
 * the FULL reason receipt enumerates every window + score input. AGGREGATE court motion —
 * ranks move, never a named soul's FATE (state-never-fate §4g).
 * @param {string} sid @param {string} townName @param {string} fkey
 * @param {import('./npcLadderChallenge.js').ChallengeEvent} ev @param {number} tick @param {string|null} now
 * @returns {Record<string, unknown>}
 */
function ladderBeat(sid, townName, fkey, ev, tick, now) {
  const win = ev.kind === 'rise';
  const windows = ev.windows.length ? ev.windows.join(', ') : 'an open contest';
  const headline = win
    ? `${ev.challengerName} takes the seat above ${ev.defenderName}`
    : `${ev.challengerName}'s bid against ${ev.defenderName} fails`;
  const summary = win
    ? `In ${townName}, ${ev.challengerName} has displaced ${ev.defenderName} and risen a rung — a promotion is a displacement, and every rise has a named loser.`
    : `In ${townName}, ${ev.challengerName} moved against ${ev.defenderName} and was thrown back — ambition risked something real, and the challenger drops a rung for it.`;
  const reason = win
    ? `A windowed challenge (${windows}) cleared the sustained margin: challenge ${ev.cScore} vs defense ${ev.dScore}. The ranks swapped — conservation holds, no title inflation.`
    : `A windowed challenge (${windows}) fell short of the sustained margin: challenge ${ev.cScore} vs defense ${ev.dScore}. The defender held; the challenger dropped a rung and carries the grudge.`;
  const slug = `${ev.kind}.${fkey}.${ev.challengerNid}.${ev.defenderNid}`;
  return {
    id: `wizard_news.${tick}.npc_ladder.${sid}.${slug}`,
    tick, createdAt: now, scope: 'local', significance: 'notable', severity: win ? 0.35 : 0.25, score: win ? 48 : 43,
    headline,
    summary,
    kind: 'applied', impactKind: 'npc_ladder', channelType: 'settlement',
    settlementIds: [sid], impactIds: [], channelIds: [],
    // Actor layer (NEWS ADDRESS LAW): both parties to the challenge, as the
    // canonical npc pulse ids npcAgency.npcId minted — the same spelling the
    // realm entity web resolves. Ranks move, never a fate: linking the record
    // does not change what the beat says about them.
    npcIds: [ev.challengerNid, ev.defenderNid],
    sourceEventId: `npc_ladder.${sid}.${slug}.${tick}`,
    tags: ['world_pulse', 'npc_ladder', ev.kind],
    reasons: [reason],
  };
}

/**
 * V-7 THE INVESTITURE BEAT — a governing seat has a new holder after a succession (a coup that
 * toppled the old ruler, or a challenge that unseated them), and the office's dampened memory
 * carries to them. Reuses impactKind 'npc_ladder' (registered), unvoiced crier-wise. AGGREGATE
 * court motion — ranks move, never a named soul's FATE (state-never-fate §4g). PURE.
 * @param {string} sid @param {string} townName @param {string} fkey
 * @param {string} heirNid @param {string} predNid @param {Map<string, string>} nameByNid
 * @param {'coup'|'challenge'} kind @param {number} tick @param {string|null} now
 * @returns {Record<string, unknown>}
 */
function investitureBeat(sid, townName, fkey, heirNid, predNid, nameByNid, kind, tick, now) {
  const heirName = nameByNid.get(heirNid) || heirNid;
  const predName = nameByNid.get(predNid) || predNid;
  const headline = `${heirName} takes the seat after ${predName}`;
  const summary = kind === 'coup'
    ? `In ${townName}, a coup has thrown down ${predName}; ${heirName}, the closest of the old court, takes the seat and inherits its ties — the friends and the grudges carried on, dampened but not forgotten.`
    : `In ${townName}, ${heirName} has taken the seat from ${predName} and inherits the office's memory — its friends and its enemies, carried forward and faded by the succession.`;
  const reason = `A ${kind} succession seated ${heirName} above ${predName}; the seat's bonds and grudges pass to the heir at a bounded, dampened fraction (marked inherited) — the memory carries, the ranks stay a permutation.`;
  const slug = `investiture.${fkey}.${heirNid}.${predNid}`;
  return {
    id: `wizard_news.${tick}.npc_ladder.${sid}.${slug}`,
    tick, createdAt: now, scope: 'local', significance: 'notable', severity: 0.4, score: 50,
    headline,
    summary,
    kind: 'applied', impactKind: 'npc_ladder', channelType: 'settlement',
    settlementIds: [sid], impactIds: [], channelIds: [],
    npcIds: [heirNid, predNid],   // actor layer: the heir and the predecessor
    sourceEventId: `npc_ladder.${sid}.${slug}.${tick}`,
    tags: ['world_pulse', 'npc_ladder', 'investiture', kind],
    reasons: [reason],
  };
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
