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
import { advanceNpcGrowthWithFabricAndConsequence } from './spatialConsequenceKernel.js';

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
 *   horizonWeeks: number, mintedWeek: number, mintedRung: number, progress: number,
 *   basis: string }} LadderGoal */
/** @typedef {{ sev: number, week: number, tick: number }} LadderStigma */
/** @typedef {{ sev: number, week: number }} LadderGrudge */
/** @typedef {{ rungs: string[], cooldownUntil: number }} LadderFactionRec */
/** @typedef {{ factions: Record<string, LadderFactionRec>, npcs: Record<string, LadderStanding> }} LadderRecord */

/** @param {unknown} v @param {number} fallback @returns {number} */
export function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {unknown} v @returns {Record<string, unknown>} */
export function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** Codepoint compare for byte-stable iteration. @param {string} a @param {string} b */
export function compareCodepoint(a, b) { return a < b ? -1 : a > b ? 1 : 0; }
/** @param {number} v @returns {number} */
export function round4(v) { return Math.round(num(v, 0) * 10000) / 10000; }

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
  // Placeholder for the mechanism build-out. Until derivation lands, the lit path is
  // itself a no-op (no ladder can move before it exists); the dormancy golden pins
  // the DARK path, which never reaches here.
  void snapshot; void tick; void now;
  return { worldState, settlementUpdates, changed: false, newsEntries: [] };
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
