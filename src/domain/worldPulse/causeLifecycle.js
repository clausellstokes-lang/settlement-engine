/**
 * domain/worldPulse/causeLifecycle.js — W-C5: THE CAUSE-RESOLUTION LIFECYCLE.
 * The last simulation mechanic. A compromise (the guard captain is corrupt)
 * exists BECAUSE of a cause (the garrison is underfunded); when the cause
 * RESOLVES, the compromise must not silently persist with a stale story. It
 * evolves by exactly one of three CHARACTER-DERIVED paths, or is overridden by
 * one of two TERMINALS.
 *
 * ── THE GOLDEN LAW (WC5 brief §1) ────────────────────────────────────────────
 * Generation schemas do NOT change. A compromise born at generation carries no
 * cause field. The lifecycle attributes a cause LAZILY on first worldPulse touch,
 * derived from the settlement's ACTUAL concurrent state (causeVocabulary), stored
 * ONLY in worldPulse-owned state (worldState.causeLifecycle, conditionally
 * materialized). A never-advanced settlement is byte-identical. The ledger is a
 * PASSIVE annotation: it never feeds back into any simulated quantity. The ONLY
 * settlement mutation is REFORM (clearing a tag, undo-clean) — and reform fires
 * only after a real cause CLEARS and HOLDS the hysteresis window, so a world whose
 * causes never resolve is exact prior bytes (the dormancy law).
 *
 * ── THE THREE COVERT PATHS (chosen by trait plane + seeded fork) ─────────────
 *   RE-CAUSE     the corruption adopts a NEW cause that is REAL in-state right now
 *                (drawn from presentCauseClasses — never invented). Corruptible/
 *                greedy planes lean here.
 *   REFORM       the corruption ends — the resolved cause was its sole support.
 *                Principled planes (and clean climates) lean here. Clears the tag.
 *   HISTORICIZE  the corruption persists but its origin becomes PAST-TENSE (the
 *                cause is stamped resolved-at-tick). Entrenched-but-cautious lean here.
 *
 * ── THE TWO TERMINALS (override the covert lifecycle) ────────────────────────
 *   EXPOSURE → PUBLIC ARC   once the compromise crosses covert→revealed (the
 *                EXISTING bucket transition), quiet evolution stops. The arc is
 *                public and rides the EXISTING scandal/legitimacy machinery — we
 *                only stamp `exposed-public` and step aside (no second scandal system).
 *   INFRASTRUCTURE DEATH → RE-ADJUDICATE   when the criminal institution sustaining
 *                the arrangement is destroyed (conquest / abolition / tier-demotion
 *                fates), the dependent compromise is RE-ADJUDICATED from scratch: a
 *                fresh seeded determination of resolve (the paymaster died) vs
 *                re-cause to another live patron.
 *
 * Every lifecycle event stamps origin / resolution / historicization ticks (the
 * temporal constitution — age bands via the shared ageBands helper) and emits a
 * receipt carrying the CONJUNCTION KEY {role, situation, causeClass, lifecycleStage}
 * that W2 multiplies content against.
 *
 * PURE: no wall-clock, no mutation of inputs. rng is DI'd (a fork of the pulse
 * PRNG), drawn only through per-decision child forks so the master stream is
 * never perturbed.
 */

import { npcId } from './npcAgency.js';
import { npcTraitPlane } from './clergyTraitPlane.js';
import { hasRepressingDeity, npcHasTemperament } from '../corruption.js';
// The resolver rides a LAZY leaf (see corruptionLeash.js); causeLifecycle is the
// lazy engine chunk, so this import is free of first paint.
import { resolveLeash } from '../corruptionLeash.js';
// W-DOCTRINE-3b §4 — the foreign-endpoint re-pointing terminal reads the web gate + the
// endpoint-liveness predicate (both engine-lazy leaves; corruptionWeb never imports
// causeLifecycle, so the graph stays acyclic). Gate absent ⇒ Terminal 2b is inert.
import { corruptionWebActive, foreignEndpointLive } from './corruptionWeb.js';
import {
  readCauseContext, presentCauseClasses, causeIsClear,
  roleCauseAffinity, CAUSE_FAMILY_OF, CAUSE_LABEL_OF,
} from './causeVocabulary.js';
import { ageBandForElapsed, HISTORICIZE_BAND } from '../ageBands.js';

/** @typedef {import('./causeVocabulary.js').CauseContext} CauseContext */
/** @typedef {import('../settlement.schema.js').SimSettlement} SimSettlement */
/** @typedef {import('../settlement.schema.js').SimNpc} SimNpc */
/** @typedef {{ status?: string, worldPulseFate?: unknown, _worldPulseInactive?: boolean, _worldPulseMorallyAbolished?: boolean, name?: string }} InstLike */
/** @typedef {{ id?: string|number, name?: string, corrupt?: boolean, ousted?: boolean, corruptionImpaired?: boolean, timesExposed?: number, corruptionVector?: string|null, corruptTies?: { criminalInstitution?: string, revealed?: boolean }, secondaryAffiliation?: string, personality?: unknown, compromiseLifecycle?: unknown }} NpcLike */
/** @typedef {{ institutions?: InstLike[], npcs?: NpcLike[], config?: { primaryDeitySnapshot?: unknown }, powerStructure?: { criminalCaptureState?: string }, activeConditions?: Array<{ archetype?: string }> }} SettlementLike */
/** @typedef {{ id?: string|number, settlement?: SettlementLike, causal?: { scores?: Record<string, number> }, activeConditions?: Array<{ archetype?: string }> }} SnapshotItem */
/** @typedef {{ npcStates?: Record<string, { roleArchetype?: string, corruption?: boolean }>, occupations?: Record<string, unknown>, deployments?: Record<string, unknown>, warPosture?: Record<string, { state?: string }>, causeLifecycle?: Ledger }} WorldStateLike */
/**
 * A worldPulse-owned lifecycle record for ONE compromise. Stored under
 * worldState.causeLifecycle[cid][conditionId]. Passive (no mechanic reads it).
 * @typedef {Object} LifecycleRecord
 * @property {string} causeClass  @property {string} family  @property {string} stage
 * @property {string} role  @property {string} situation  @property {number} originTick
 * @property {number} [resolveHold]  @property {number} [resolvedTick]
 * @property {number} [historicizedTick]  @property {number} [exposedTick]
 * @property {string[]} [priorCauses]  @property {boolean} [readjudicated]
 */
/** @typedef {Record<string, LifecycleRecord>} CidLedger */
/** @typedef {Record<string, CidLedger>} Ledger */
/**
 * A lifecycle event/receipt — the pulseRecord rollup unit carrying the conjunction key.
 * @typedef {Object} LifecycleEvent
 * @property {string} cid  @property {string} conditionId  @property {string} npcId
 * @property {string} name  @property {string} role  @property {string} situation
 * @property {string} causeClass  @property {string} family  @property {string} stage
 * @property {string|null} priorCause  @property {number|null} originTick
 * @property {number|null} resolvedTick  @property {number|null} historicizedTick
 * @property {number|null} exposedTick  @property {string|null} ageBand
 * @property {{ role: string, situation: string, causeClass: string, lifecycleStage: string }} conjunctionKey
 * @property {string|null} headline  @property {string|null} summary  @property {string[]} reasons
 */
/** @typedef {{ cid: string, conditionId: string, npcId: string, name: string, causeClass: string }} ReformClear */

export const LIFECYCLE_TUNING = Object.freeze({
  // HYSTERESIS: a resolved cause must HOLD this many consecutive ticks (WEEKS)
  // before the lifecycle judges it resolved and evolves the compromise. 4 wk = one
  // month: a compromised captain does not unwind an arrangement over a one-week
  // blip in the pay; the relief must hold a full month before it is trusted (owner:
  // "so a one-week blip doesn't reform a captain"). Below the age-band's this-month
  // boundary by construction, so a fresh resolution still reads fresh.
  RESOLUTION_HOLD_TICKS: 4,
  // ── the three-path selection weights (trait plane + climate) ────────────────
  REFORM_BASE: 0.20,
  RECAUSE_BASE: 0.20,
  HISTORICIZE_BASE: 0.30,     // the "habit outlives its reason" default leans here
  CONSCIENCE_W: 0.90,         // a good-leaning plane (e<0) pulls toward REFORM
  APPETITE_W: 0.90,           // an evil-leaning plane (e>0) pulls toward RE-CAUSE
  TEMPERAMENT_W: 0.40,        // a steady temperament pulls toward HISTORICIZE (cautious entrenchment)
  DISORDER_HIST_W: 0.20,      // moderate disorder (habit, not principle) also leans historicize
  // reformClimate multiplier span on the REFORM weight: rotten cities rarely
  // reform, a devout-LG purge climate invites it. Maps climate 0..1 → [0.4, 1.6].
  REFORM_CLIMATE_LO: 0.40,
  REFORM_CLIMATE_SPAN: 1.20,
});

/** @param {number} x @param {number} lo @param {number} hi */
const clamp = (x, lo, hi) => (x < lo ? lo : x > hi ? hi : x);
const clamp01 = (/** @type {number} */ x) => clamp(x, 0, 1);
/** @param {string} a @param {string} b */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
/** @param {unknown} s */
const norm = (s) => String(s || '').trim().toLowerCase();

// A criminal institution is "destroyed" (its arrangement can no longer be
// sustained) when the world pulse has retired it: an explicit fate stamp, moral
// abolition, inactive flag, or a non-standing status. Mirrors the standing checks
// across the engine (mercenaryMarket.isStanding / institutionLifecycle abolition guard).
const NONSTANDING_STATUS = new Set(['removed', 'destroyed', 'remnant', 'ruined', 'defunct', 'closed', 'disbanded', 'abolished']);
/** @param {InstLike|null|undefined} inst */
function institutionDestroyed(inst) {
  if (!inst) return false;
  if (inst._worldPulseInactive === true || inst._worldPulseMorallyAbolished === true) return true;
  if (inst.worldPulseFate) return true;
  return NONSTANDING_STATUS.has(norm(inst.status));
}

/** The named sustaining criminal institution of a bearer, resolved against the
 *  settlement's institution list (tolerant name match). null when the bearer names
 *  none or none matches. @param {SettlementLike} settlement @param {NpcLike} npc */
function sustainingInstitution(settlement, npc) {
  // The LOCAL sustaining org resolved through the chokepoint (§1): a foreign
  // leash has none locally (byte-identical — a betrayal traitor carries neither a
  // criminalInstitution nor a secondaryAffiliation), a cutout resolves its front.
  const leash = resolveLeash(/** @type {SimNpc} */ (npc));
  const name = (leash.foreign ? null : leash.criminalInstitution) || npc?.secondaryAffiliation || null;
  if (!name) return null;
  const insts = Array.isArray(settlement?.institutions) ? settlement.institutions : [];
  const n = norm(name);
  return insts.find((/** @type {InstLike} */ i) => {
    const xn = norm(i?.name);
    return xn && (xn === n || xn.includes(n) || n.includes(xn));
  }) || null;
}

/** The public-record REVEALED state of a bearer — the covert→revealed crossing the
 *  EXPOSURE terminal keys on. Reuses the corruption system's revealed signals
 *  (never a parallel representation). @param {NpcLike} npc @param {CauseContext} ctx */
function bearerRevealed(npc, ctx) {
  return npc?.ousted === true
    || npc?.corruptionImpaired === true
    || npc?.corruptTies?.revealed === true
    || (Number(npc?.timesExposed) || 0) > 0
    // A revealed compromised security institution in the settlement makes any
    // corruption homed in the watch/court public (the institution-bucket crossing).
    || ctx.revealedInstitutions > 0;
}

/** compromised-covert vs compromised-revealed — the `situation` half of the
 *  conjunction key. @param {NpcLike} npc @param {CauseContext} ctx */
function bearerSituation(npc, ctx) {
  return bearerRevealed(npc, ctx) ? 'compromised-revealed' : 'compromised-covert';
}

/**
 * The 0..1 REFORM CLIMATE of a settlement: a clean, ordered, devout-good town
 * invites redemption (→1); a captured, patron-rotted town rarely reforms (→0).
 * Reads causal law_order + the patron axis + the criminal capture ladder. Pure.
 * @param {CauseContext} ctx @param {SettlementLike} settlement
 */
export function reformClimate01(ctx, settlement) {
  const lawOrder = Number(ctx.scores?.law_order);
  const order = Number.isFinite(lawOrder) ? (lawOrder - 50) / 50 : 0;   // −1..+1
  let climate = 0.5 + 0.3 * order;
  if (hasRepressingDeity(/** @type {SimSettlement} */ (settlement))) climate += 0.2; // devout-good purge arc
  if (ctx.corruptingDeity) climate -= 0.2;                              // an evil patron shelters rot
  if (ctx.captureState === 'corrupted' || ctx.captureState === 'capture') climate -= 0.4; // a captured town
  else if (ctx.captureState === 'adversarial') climate += 0.1;
  return clamp01(climate);
}

/**
 * The three-path outcome WEIGHTS from the bearer's trait plane + settlement reform
 * climate. Exported so tests can pin the gradient (principled→reform,
 * greedy→re-cause, cautious→historicize) without a live pulse. `hasAlternative`
 * gates RE-CAUSE to zero when no OTHER real cause is present (never invents).
 * @param {{ plane: { e: number, c: number, spread: number }, hasTemperament: boolean, reformClimate: number, hasAlternative: boolean }} args
 * @returns {{ reform: number, recause: number, historicize: number }}
 */
export function causeLifecycleSelectionWeights({ plane, hasTemperament, reformClimate, hasAlternative }) {
  const T = LIFECYCLE_TUNING;
  const e = clamp(Number(plane?.e) || 0, -1, 1);            // +evil … −good
  const c = Math.abs(clamp(Number(plane?.c) || 0, -1, 1));  // disorder magnitude
  const conscience = Math.max(0, -e);                       // good-leaning
  const appetite = Math.max(0, e);                          // evil-leaning
  const climateMult = T.REFORM_CLIMATE_LO + T.REFORM_CLIMATE_SPAN * clamp01(reformClimate);

  const reform = (T.REFORM_BASE + T.CONSCIENCE_W * conscience) * climateMult;
  const recause = hasAlternative ? (T.RECAUSE_BASE + T.APPETITE_W * appetite) : 0;
  const historicize = T.HISTORICIZE_BASE
    + (hasTemperament ? T.TEMPERAMENT_W : 0)
    + T.DISORDER_HIST_W * c;
  return { reform: Math.max(0, reform), recause: Math.max(0, recause), historicize: Math.max(0, historicize) };
}

/** Weighted seeded pick among the three paths. Returns 'reform' | 'recause' |
 *  'historicize'. Deterministic given `fork`. @param {{reform:number,recause:number,historicize:number}} w
 *  @param {{ random: () => number }} fork */
function pickPath(w, fork) {
  const entries = [['reform', w.reform], ['recause', w.recause], ['historicize', w.historicize]];
  const total = entries.reduce((s, [, x]) => s + /** @type {number} */ (x), 0);
  if (total <= 0) return 'historicize';               // degenerate: persist the habit
  let roll = fork.random() * total;
  for (const [name, x] of entries) {
    roll -= /** @type {number} */ (x);
    if (roll <= 0) return /** @type {string} */ (name);
  }
  return 'historicize';
}

/** The most role-coherent cause among a candidate set, seeded tie-break. Pure.
 *  @param {string[]} candidates @param {string} role @param {{ random: () => number }} fork */
function pickCoherentCause(candidates, role, fork) {
  if (!candidates.length) return null;
  const bestAff = candidates.reduce((m, cls) => Math.max(m, roleCauseAffinity(role, cls)), -Infinity);
  // Gather ties at the max affinity and break with the fork (deterministic).
  const ties = candidates.filter((cls) => roleCauseAffinity(role, cls) === bestAff).sort(codepoint);
  if (ties.length === 1) return ties[0];
  return ties[Math.floor(fork.random() * ties.length)] || ties[0];
}

/** Compose a lifecycle event/receipt object (the pulseRecord rollup unit + the
 *  conjunction-key contract W2 consumes).
 *  @param {{ cid: string, conditionId: string, npcId: string, name: string, role: string, situation: string, causeClass: string, family: string, stage: string, priorCause?: string|null, originTick?: number|null, resolvedTick?: number|null, historicizedTick?: number|null, exposedTick?: number|null, ageBand?: string|null, headline?: string|null, summary?: string|null, reasons?: string[] }} base
 *  @returns {LifecycleEvent} */
function makeEvent(base) {
  const {
    cid, conditionId, npcId: nid, name, role, situation, causeClass, family,
    stage, priorCause, originTick, resolvedTick, historicizedTick, exposedTick,
    ageBand, headline, summary, reasons,
  } = base;
  return {
    cid, conditionId, npcId: nid, name, role, situation,
    causeClass, family, stage,
    priorCause: priorCause || null,
    originTick: originTick ?? null,
    resolvedTick: resolvedTick ?? null,
    historicizedTick: historicizedTick ?? null,
    exposedTick: exposedTick ?? null,
    ageBand: ageBand || null,
    // THE CONJUNCTION KEY — the seam W2 multiplies content against.
    conjunctionKey: { role: role || 'civic', situation, causeClass, lifecycleStage: stage },
    headline: headline || null,
    summary: summary || null,
    reasons: Array.isArray(reasons) ? reasons : [],
  };
}

const causeLabel = (/** @type {string} */ cls) => CAUSE_LABEL_OF[cls] || cls;

/**
 * Advance the cause-resolution lifecycle for one tick. READ-LAST/WRITE-NEXT: runs
 * post-apply, reading this tick's settled compromise + condition state. Returns
 * the next ledger (conditionally materialized), the reform clears (undo-clean tag
 * removals), and the lifecycle events (receipts + the notable-transition news).
 *
 * @param {{ snapshot?: { settlements?: SnapshotItem[] }, worldState?: WorldStateLike,
 *   priorLedger?: Ledger|null,
 *   rng?: { fork: (k: string) => { random: () => number } }|null, tick?: number }} args
 * @returns {{ causeLifecycleByCid: Ledger|null, reforms: ReformClear[], events: LifecycleEvent[] }}
 */
export function advanceCauseLifecycle({ snapshot, worldState, priorLedger, rng, tick = 0 } = {}) {
  const prior = priorLedger && typeof priorLedger === 'object' ? priorLedger : {};
  const settlements = Array.isArray(snapshot?.settlements) ? snapshot.settlements : [];
  const npcStates = worldState?.npcStates || {};

  /** @type {Ledger} */
  const nextLedger = {};
  /** @type {ReformClear[]} */
  const reforms = [];
  /** @type {LifecycleEvent[]} */
  const events = [];

  for (const item of settlements) {
    const cid = String(item?.id);
    const settlement = item?.settlement || {};
    const npcs = Array.isArray(settlement?.npcs) ? settlement.npcs : [];
    // Only settlements with at least one live compromise are ever touched
    // (conditional materialization — no global scan of untouched worlds).
    const priorForCid = prior[cid] || {};
    /** @type {CauseContext|null} */
    let ctx = null;
    /** @type {CidLedger} */
    const cidLedger = {};

    npcs.forEach((/** @type {NpcLike} */ npc, /** @type {number} */ index) => {
      if (npc?.corrupt !== true || npc?.ousted === true) return;
      if (!ctx) ctx = readCauseContext(/** @type {import('./causeVocabulary.js').SnapshotItem} */ (/** @type {unknown} */ (item)), worldState || {}, cid);
      const conditionId = npcId(cid, /** @type {SimNpc} */ (npc), index);
      const role = String(npcStates[conditionId]?.roleArchetype || 'civic');
      const situation = bearerSituation(npc, ctx);
      const plane = npcTraitPlane(/** @type {SimNpc} */ (npc));
      const record = priorForCid[conditionId] || null;
      const forkKey = `cause-resolution::${tick}::${cid}::${conditionId}`;
      const fork = rng?.fork ? rng.fork(forkKey) : { random: () => 0 };
      const present = presentCauseClasses(/** @type {CauseContext} */ (ctx));

      // ── ATTRIBUTION (lazy, first touch) ──────────────────────────────────────
      if (!record) {
        const cls = pickCoherentCause(present, role, fork);
        if (!cls) return;                 // no legible live cause yet — never invent; wait.
        const rec = {
          causeClass: cls, family: CAUSE_FAMILY_OF[cls], stage: 'attributed',
          role, situation, originTick: tick, resolveHold: 0, priorCauses: [],
        };
        cidLedger[conditionId] = rec;
        events.push(makeEvent({
          cid, conditionId, npcId: conditionId, name: npc?.name || conditionId, role, situation,
          causeClass: cls, family: rec.family, stage: 'attributed', originTick: tick,
          ageBand: ageBandForElapsed(0),
          reasons: [`Compromise attributed to ${causeLabel(cls)} (the most coherent live cause for a ${role.replace(/_/g, ' ')}).`],
        }));
        return;
      }

      // Carry the record forward, refreshing the volatile display fields.
      const rec = { ...record, role, situation };

      // ── TERMINAL 1: EXPOSURE → PUBLIC ARC ────────────────────────────────────
      if (rec.stage !== 'exposed-public' && situation === 'compromised-revealed'
          && record.situation !== 'compromised-revealed') {
        rec.stage = 'exposed-public';
        rec.exposedTick = tick;
        cidLedger[conditionId] = rec;
        events.push(makeEvent({
          cid, conditionId, npcId: conditionId, name: npc?.name || conditionId, role, situation,
          causeClass: rec.causeClass, family: rec.family, stage: 'exposed-public',
          originTick: rec.originTick, exposedTick: tick, ageBand: ageBandForElapsed(tick - rec.originTick),
          headline: `${npc?.name || 'A compromised official'} is exposed`,
          summary: `${npc?.name || 'The official'}'s compromise — rooted in ${causeLabel(rec.causeClass)} — has become public. The quiet arrangement is now a scandal.`,
          reasons: ['The compromise crossed covert → revealed; the public arc supersedes the quiet lifecycle.'],
        }));
        return;
      }
      // Already public (or newly so): the existing scandal/legitimacy machinery
      // carries it — no quiet evolution. Keep the record as the public marker.
      if (rec.stage === 'exposed-public') { cidLedger[conditionId] = rec; return; }

      // ── TERMINAL 2: PAYMASTER DEATH → RE-ADJUDICATE ──────────────────────────
      // The sustaining paymaster lost: a LOCAL institution DEMOLISHED, or — when the
      // corruption web is lit (§4) — a FOREIGN endpoint destroyed / occupied / gone from
      // the realm. Either loss triggers the SAME resolve-vs-re-catch fork (habit never
      // survives a demolished paymaster). Terminal 2b (the foreign endpoint) is gated on
      // corruptionWebActive: a betrayal-seeded foreignPatron traitor in a NON-lit world
      // keeps today's behavior (sustainingInstitution already returns null for it) —
      // byte-identical dormancy.
      const sustainer = sustainingInstitution(settlement, npc);
      const localSustainerGone = !!(sustainer && institutionDestroyed(sustainer));
      const webLit = corruptionWebActive(/** @type {Parameters<typeof corruptionWebActive>[0]} */ (worldState));
      const foreignLeash = webLit ? resolveLeash(/** @type {SimNpc} */ (npc), /** @type {SimSettlement} */ (settlement)) : null;
      const foreignEndpointGone = !!(foreignLeash && foreignLeash.foreign
        && !foreignEndpointLive({ foreign: foreignLeash.foreign, settlementId: foreignLeash.settlementId },
          /** @type {Parameters<typeof foreignEndpointLive>[1]} */ (snapshot)));
      if (!rec.readjudicated && (localSustainerGone || foreignEndpointGone)) {
        const climate = reformClimate01(/** @type {CauseContext} */ (ctx), settlement);
        const alt = present.filter((cls) => cls !== rec.causeClass);
        const weights = causeLifecycleSelectionWeights({
          plane, hasTemperament: npcHasTemperament(/** @type {SimNpc} */ (npc)), reformClimate: climate, hasAlternative: alt.length > 0,
        });
        // Re-adjudication is resolve-vs-recatch only: historicize folds into
        // resolve (habit never survives DEMOLISHED infrastructure — owner).
        const reachForNewPatron = alt.length > 0 && pickPath({ reform: weights.reform + weights.historicize, recause: weights.recause, historicize: 0 }, fork) === 'recause';
        // The LOCAL-institution receipts are BYTE-IDENTICAL to today (existing tests pin the
        // exact strings); the FOREIGN-endpoint sibling carries its own copy. localSustainerGone
        // wins the copy when both fire (a local demolition is the concrete, named event).
        const localName = sustainer?.name;
        if (reachForNewPatron) {
          const newCause = pickCoherentCause(alt, role, fork) || alt[0];
          rec.priorCauses = [...(rec.priorCauses || []), rec.causeClass];
          rec.causeClass = newCause;
          rec.family = CAUSE_FAMILY_OF[newCause];
          rec.stage = 're-adjudicated';
          rec.readjudicated = true;
          rec.resolveHold = 0;
          cidLedger[conditionId] = rec;
          events.push(makeEvent({
            cid, conditionId, npcId: conditionId, name: npc?.name || conditionId, role, situation,
            causeClass: newCause, family: rec.family, stage: 're-adjudicated', priorCause: record.causeClass,
            originTick: rec.originTick, ageBand: ageBandForElapsed(tick - rec.originTick),
            headline: `${npc?.name || 'A compromised official'} finds a new patron`,
            summary: localSustainerGone
              ? `${localName || 'The syndicate'} is gone, but ${npc?.name || 'the official'} reaches for ${causeLabel(newCause)} — the arrangement re-forms around a live patron.`
              : `The foreign patron is gone, but ${npc?.name || 'the official'} reaches for ${causeLabel(newCause)} — the arrangement re-forms around a live patron.`,
            reasons: [localSustainerGone
              ? `Sustaining institution "${localName}" destroyed; re-adjudicated to ${causeLabel(newCause)}.`
              : `Foreign patron withdrawn or fallen; re-adjudicated to ${causeLabel(newCause)}.`],
          }));
        } else {
          // Resolve: the arrangement died with its paymaster.
          reforms.push({ cid, conditionId, npcId: conditionId, name: npc?.name || conditionId, causeClass: rec.causeClass });
          events.push(makeEvent({
            cid, conditionId, npcId: conditionId, name: npc?.name || conditionId, role, situation,
            causeClass: rec.causeClass, family: rec.family, stage: 're-adjudicated',
            originTick: rec.originTick, resolvedTick: tick, ageBand: ageBandForElapsed(tick - rec.originTick),
            headline: `${npc?.name || 'A compromised official'} is cut loose`,
            summary: localSustainerGone
              ? `${localName || 'The syndicate'} is destroyed, and with it the arrangement that held ${npc?.name || 'the official'}. The compromise dies with its paymaster.`
              : `The foreign patron is gone, and with it the arrangement that held ${npc?.name || 'the official'}. The compromise dies with its paymaster.`,
            reasons: [localSustainerGone
              ? `Sustaining institution "${localName}" destroyed; the compromise resolved (no live patron remained).`
              : `Foreign patron withdrawn or fallen; the compromise resolved (no live patron remained).`],
          }));
          return;   // record dropped — bearer will read clean
        }
        return;
      }

      // ── THE COVERT LIFECYCLE: resolution detection (hysteresis) ──────────────
      if (causeIsClear(rec.causeClass, /** @type {CauseContext} */ (ctx))) {
        rec.resolveHold = (record.resolveHold || 0) + 1;
        if (rec.resolveHold >= LIFECYCLE_TUNING.RESOLUTION_HOLD_TICKS) {
          const climate = reformClimate01(/** @type {CauseContext} */ (ctx), settlement);
          const alt = present.filter((cls) => cls !== rec.causeClass);
          const weights = causeLifecycleSelectionWeights({
            plane, hasTemperament: npcHasTemperament(/** @type {SimNpc} */ (npc)), reformClimate: climate, hasAlternative: alt.length > 0,
          });
          const path = pickPath(weights, fork);
          const band = ageBandForElapsed(tick - rec.originTick);

          if (path === 'recause' && alt.length > 0) {
            const newCause = pickCoherentCause(alt, role, fork) || alt[0];
            rec.priorCauses = [...(rec.priorCauses || []), rec.causeClass];
            const oldCause = rec.causeClass;
            rec.causeClass = newCause;
            rec.family = CAUSE_FAMILY_OF[newCause];
            rec.stage = 're-caused';
            rec.resolveHold = 0;
            cidLedger[conditionId] = rec;
            events.push(makeEvent({
              cid, conditionId, npcId: conditionId, name: npc?.name || conditionId, role, situation,
              causeClass: newCause, family: rec.family, stage: 're-caused', priorCause: oldCause,
              originTick: rec.originTick, ageBand: band,
              headline: `${npc?.name || 'A compromised official'}'s need becomes appetite`,
              summary: `${causeLabel(oldCause)} eased, but ${npc?.name || 'the official'} has quietly found a new reason: ${causeLabel(newCause)}. The habit outlives its first cause.`,
              reasons: [`${causeLabel(oldCause)} resolved; re-caused to ${causeLabel(newCause)} — the character reached for it.`],
            }));
          } else if (path === 'reform') {
            reforms.push({ cid, conditionId, npcId: conditionId, name: npc?.name || conditionId, causeClass: rec.causeClass });
            events.push(makeEvent({
              cid, conditionId, npcId: conditionId, name: npc?.name || conditionId, role, situation,
              causeClass: rec.causeClass, family: rec.family, stage: 'reformed',
              originTick: rec.originTick, resolvedTick: tick, ageBand: band,
              headline: `${npc?.name || 'A compromised official'} comes clean`,
              summary: `The pressure lifted — ${causeLabel(rec.causeClass)} resolved — and ${npc?.name || 'the official'}, whose corruption was purely situational, reforms.`,
              reasons: [`${causeLabel(rec.causeClass)} resolved; the sole-support corruption ended (reform).`],
            }));
            return;   // record dropped — reform clears the tag (undo-clean)
          } else {
            // HISTORICIZE — the compromise persists, its origin becomes past-tense.
            rec.stage = 'historicized';
            rec.resolvedTick = tick;
            rec.historicizedTick = tick;
            rec.resolveHold = 0;
            cidLedger[conditionId] = rec;
            const yearsPast = band === HISTORICIZE_BAND;
            events.push(makeEvent({
              cid, conditionId, npcId: conditionId, name: npc?.name || conditionId, role, situation,
              causeClass: rec.causeClass, family: rec.family, stage: 'historicized',
              originTick: rec.originTick, resolvedTick: tick, historicizedTick: tick, ageBand: band,
              headline: `${npc?.name || 'A compromised official'}'s habit outlives its reason`,
              summary: yearsPast
                ? `${causeLabel(rec.causeClass)} passed into the lean years, but ${npc?.name || 'the official'}'s habit endures — the ledger never closed.`
                : `${causeLabel(rec.causeClass)} eased, yet ${npc?.name || 'the official'} carries the compromise forward out of habit. Its origin is now past-tense.`,
              reasons: [`${causeLabel(rec.causeClass)} resolved; the compromise persists with a historicized origin.`],
            }));
          }
        } else {
          cidLedger[conditionId] = rec;   // resolved but still inside the hold window
        }
      } else {
        // Not clear (still present or ambiguous): reset the hold — a blip cannot
        // resolve a captain (owner). Refresh situation/role only.
        rec.resolveHold = 0;
        cidLedger[conditionId] = rec;
      }
    });

    if (Object.keys(cidLedger).length) nextLedger[cid] = cidLedger;
  }

  return {
    causeLifecycleByCid: Object.keys(nextLedger).length ? nextLedger : null,
    reforms,
    events,
  };
}

/**
 * Project the lifecycle ledger onto a settlement's NPCs for DISPLAY: stamp the
 * lazy `compromiseLifecycle` read-model on each compromised bearer (the generic
 * floor reads it), and CLEAR the compromise tag on bearers reformed this tick
 * (undo-clean — the reformed captain reads as a clean incumbent). Identity no-op
 * when nothing changes. Pure. The stamp is a DISPLAY annotation only — no
 * simulated quantity reads it, so it is byte-inert to every mechanic.
 *
 * @template T
 * @param {T} settlement
 * @param {Ledger|null|undefined} ledger  worldState.causeLifecycle
 * @param {string} cid
 * @param {number} tick    the current world tick (for the age-band register)
 * @param {Set<string>|null|undefined} reformedIds  conditionIds reformed this tick
 * @returns {T}   the caller's settlement type is preserved (a display stamp, byte-inert)
 */
export function projectCauseLifecycleOntoSettlement(settlement, ledger, cid, tick, reformedIds = null) {
  const s = /** @type {SettlementLike} */ (settlement);
  const npcs = s?.npcs;
  if (!Array.isArray(npcs)) return settlement;
  const cidLedger = ledger?.[String(cid)] || null;
  const reformed = reformedIds instanceof Set ? reformedIds : new Set(reformedIds || []);
  if (!cidLedger && !reformed.size) return settlement;

  let changed = false;
  const nextNpcs = npcs.map((npc, index) => {
    const conditionId = npcId(cid, /** @type {SimNpc} */ (npc), index);
    // Reform clears the tag this tick (parity with the npcState clear the kernel applied).
    if (reformed.has(conditionId) && npc?.corrupt === true) {
      changed = true;
      const { compromiseLifecycle: _drop, ...rest } = npc;
      return { ...rest, corrupt: false, corruptionVector: null };
    }
    const rec = cidLedger?.[conditionId] || null;
    if (!rec || npc?.corrupt !== true) {
      // No record but a stale stamp lingers → drop it.
      if (npc?.compromiseLifecycle) { changed = true; const { compromiseLifecycle: _d, ...rest } = npc; return rest; }
      return npc;
    }
    const ageBand = ageBandForElapsed(Number(tick) - Number(rec.originTick));
    const stamp = {
      causeClass: rec.causeClass,
      family: rec.family,
      stage: rec.stage,
      situation: rec.situation,
      role: rec.role,
      originTick: rec.originTick ?? null,
      resolvedTick: rec.resolvedTick ?? null,
      historicizedTick: rec.historicizedTick ?? null,
      exposedTick: rec.exposedTick ?? null,
      ageBand,
    };
    const cur = /** @type {{ causeClass?: string, stage?: string, situation?: string, ageBand?: string, resolvedTick?: number|null, exposedTick?: number|null }|undefined} */ (npc.compromiseLifecycle);
    if (cur && cur.causeClass === stamp.causeClass && cur.stage === stamp.stage
      && cur.situation === stamp.situation && cur.ageBand === stamp.ageBand
      && cur.resolvedTick === stamp.resolvedTick && cur.exposedTick === stamp.exposedTick) {
      return npc;   // unchanged
    }
    changed = true;
    return { ...npc, compromiseLifecycle: stamp };
  });
  return changed ? /** @type {T} */ ({ ...s, npcs: nextNpcs }) : settlement;
}

/**
 * The DM-facing news entries for the NOTABLE lifecycle transitions (re-caused,
 * reformed, historicized, exposed-public, re-adjudicated) — attribution is the
 * resting state and emits no headline. Mirrors captureTransitionNewsEntries.
 * @param {LifecycleEvent[]} events @param {(id: unknown)=>string} _nameFor @param {number} tick @param {string|null} now
 */
export function causeLifecycleNewsEntries(events, _nameFor = (id) => String(id), tick = 0, now = null) {
  const NEWSWORTHY = new Set(['re-caused', 'reformed', 'historicized', 'exposed-public', 're-adjudicated']);
  return (Array.isArray(events) ? events : [])
    .filter((e) => e && NEWSWORTHY.has(e.stage) && e.headline)
    .map((e) => {
      const major = e.stage === 'exposed-public';
      return {
        id: `wizard_news.${tick}.cause_lifecycle.${e.conditionId}.${e.stage}`,
        tick,
        scope: 'settlement',
        significance: major ? 'major' : 'notable',
        score: major ? 66 : 48,
        headline: e.headline,
        summary: e.summary || e.headline,
        kind: 'applied',
        impactKind: 'cause_lifecycle',
        channelType: null,
        severity: major ? 0.6 : 0.4,
        settlementIds: [String(e.cid)],
        impactIds: [],
        channelIds: [],
        sourceEventId: e.conditionId,
        tags: ['world_pulse', 'corruption', 'cause_lifecycle', e.stage, e.causeClass],
        reasons: e.reasons || [],
        createdAt: now,
      };
    });
}
