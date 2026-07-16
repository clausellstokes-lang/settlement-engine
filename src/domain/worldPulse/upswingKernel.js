/**
 * upswingKernel.js — THE UPSWING MOVER (W-UPSWING, DESIGN_UPSWING.md).
 *
 * The engine's variables (prosperity, population, institutions, legitimacy, conditions)
 * were built read-write, but write traffic ran mostly DOWNWARD (the stasis finding).
 * This mover completes the SIGN: booms, rebuilds, and golden ages are emergent READOUTS
 * over the SAME ledger the downswings write — never a separate system, never "new capital
 * from nothing" (THE UPSWING CONSTITUTION). Every upswing has a typed SOURCE that is
 * DEBITED, is LIMITED (aid ≤ giver capacity; absorption cap; extraction scaled by the
 * conqueror's own corruption leak), and is regional-or-local (shared sources correlate).
 *
 * The arcs (one condition per settlement per kind, via the existing activeConditions
 * lifecycle — the archetypes are registered LIFTS so they RAISE, not drain):
 *   • B1 RECONSTRUCTION — after a calamity stamp or a siege/occupation clearing: a
 *     positive `reconstruction` condition whose progress = f(prosperity, builder roster,
 *     inbound ally credit, peace) and REGRESSES on new shocks. Completion mints the
 *     permanent history beat, a legitimacy dividend, an institution UPGRADE up the same
 *     lattice calamity demotes down, and — no free candy — the reconstruction SKIM
 *     (funds × low conscience feeds a corruption-pressure condition).
 *   • B2 BOOM→BUST + B3 FLOURISHING land in later stages (this mover's siblings).
 *
 * THE DORMANCY GATE (design §6, constitutional): behind the VIRTUAL upswingArcsEnabled
 * flag (ABSENT from DEFAULT_SIMULATION_RULES — the constructiveFlowsEnabled precedent).
 * Absent ⇒ an immediate no-op: zero forks, zero ledger keys, byte-identical (the upswing
 * dormancy golden proves it). AGGREGATE-only — institutions/legitimacy/conditions, never
 * a named soul. Deterministic: seeded forks on `upswing:${id}:${tick}`, codepoint-sorted
 * iteration, conservation absolute (every progress receipt names source + debit).
 *
 * FIRST-PAINT LAW: a LAZY worldPulse leaf — imported ONLY from the lazy pulse engine
 * (pulseKernel, at the advanceGenerosity seam). Never from the first-paint entry closure.
 * @enforced-by tests/build/vendorPdfLazy.test.js (first-paint byte budget).
 */
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { withActiveCondition, withoutActiveCondition } from '../activeConditions.js';
import { PROSPERITY_TIERS, prosperityRank } from '../../data/constants.js';
import { computeMalice } from './disposition.js';
import { warFrontsInto, warFrontsFrom } from './warFrontReads.js';
import { activeBlockadeTargets } from '../spatial/navalLayer.js';
import { lifecycleStatusOf } from './settlementLifecycleFirstClass.js';
import { famineFor } from './foodStockpile.js';
import { foldObligations } from '../spatial/generosityReactions.js';
import { withCampaignHistoryEvent } from './stressorAftermath.js';
import { promotesTo } from './calamityKernel.js';
import { embattlementLevel } from '../spatial/embattlement.js';
import { clamp, clamp01 } from '../../kernel/math.js';

// ── Kernel-local read shapes (0-hole discipline: no `any`) ────────────────────
/** @typedef {{ name?: string, required?: boolean, category?: string, status?: string,
 *   promotedFrom?: string, worldPulseFate?: string }} UpInstitution */
/** @typedef {{ type?: string, year?: number, tick?: number, reconstructedAt?: number }} UpCalStamp */
/** @typedef {{ archetype?: string, id?: string }} UpCondition */
/** @typedef {{ population?: number, tier?: string, name?: string,
 *   institutions?: UpInstitution[],
 *   economicState?: { prosperity?: unknown, foodSecurity?: { storageMonths?: unknown } },
 *   powerStructure?: { publicLegitimacy?: { score?: unknown } },
 *   calamityHistory?: UpCalStamp[], activeConditions?: UpCondition[],
 *   history?: unknown }} UpSettlement */
/** @typedef {{ id?: (string|number), name?: string, settlement?: UpSettlement }} UpSnapItem */
/** @typedef {{ settlements?: UpSnapItem[] }} UpSnapshot */
/** @typedef {{ saveId?: (string|number), settlement?: UpSettlement }} UpUpdate */
/** @typedef {{ edges?: unknown[] }} UpGraph */
/** @typedef {{ from: string, to: string, kind: string, magnitude: number }} UpObligation */
/** @typedef {{ progress: number, startedTick: number, startedYear: number,
 *   srcInternal: number, srcAlly: number, srcPeace: number, srcBuilder: number,
 *   lastTick: number }} ReconRecord */
/** @typedef {{ phase: 'building'|'boom'|'bust', dwell: number, enteredTick: number,
 *   arteries: string[], fragile: boolean, throughput: number, prosperityAccrued: number,
 *   lastTick: number }} BoomRecord */
/** @typedef {{ phase: 'building'|'flourishing', dwell: number, enteredTick: number,
 *   endsTick: number, cooldownUntil: number, lastTick: number }} FlourishRecord */

/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

// ── THE DORMANCY GATE (§6) — a virtual, defensively-read flag (no serialized default) ──
/**
 * Is the upswing-arc layer LIT? Reads simulationRules.upswingArcsEnabled === true,
 * defensively — ABSENT ⇒ false ⇒ DORMANT ⇒ the mover is never even entered (byte-
 * identical; NO default in DEFAULT_SIMULATION_RULES, so goldens do not move). Mirrors
 * constructiveFlowsActive / narrativeTempoOf's fail-closed reader. Pure, total.
 * @param {{ simulationRules?: Record<string, unknown> }|null|undefined} worldState
 * @returns {boolean}
 */
export function upswingArcsActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  return !!(rules && typeof rules === 'object' && /** @type {Record<string, unknown>} */ (rules).upswingArcsEnabled === true);
}

// ── Tuning (documented; owner-retunable in the checkpoint soaks) ───────────────
export const UPSWING_TUNING = Object.freeze({
  // RECONSTRUCTION.
  RECON_TRIGGER_CALAMITY_WINDOW: 3,  // years: a calamity stamp this recent arms a rebuild
  RECON_BASE_STEP: 0.06,             // baseline progress per tick (clearing rubble)
  RECON_PROSPERITY_GAIN: 0.06,       // × prosperity01 (a richer town rebuilds faster)
  RECON_BUILDER_GAIN: 0.05,          // × builderRoster01 (masons/carpenters/lodges)
  RECON_ALLY_GAIN: 0.10,             // × allyCredit01 (inbound investment — MATURES the debt)
  RECON_PEACE_GAIN: 0.04,            // × peace01 (no war ⇒ hands free to rebuild)
  RECON_SHOCK_REGRESS: 0.18,         // subtract on a NEW shock during the rebuild
  RECON_ABSORPTION_CAP: 0.18,        // THE one new bound: max progress absorbed per tick
  RECON_ALLY_MATURE_STEP: 0.20,      // the obligation portion matured per accelerated tick
  RECON_COMPLETE_AT: 1.0,
  RECON_LEGITIMACY_DIVIDEND: 4,      // the completion legitimacy nudge (bounded, integer)
  RECON_SKIM_MALICE_FLOOR: 0.55,     // malice above this (low conscience) ⇒ the skim fires
  // BOOM → BUST (B2). Hysteresis: enter after sustained surplus throughput + centrality;
  // exit/bust on a severance. Boom NAMES a composition the movers already produce.
  BOOM_ENTER_THROUGHPUT: 3.0,        // in+out at/above the M6d surplus ceiling
  BOOM_EXIT_THROUGHPUT: 1.5,         // hysteresis: below this a boom cools (not yet bust)
  BOOM_CENTRALITY_FLOOR: 0.3,        // an entrepôt, not a backwater (earned centrality)
  BOOM_MIN_DWELL: 3,                 // ticks of sustained surplus before the boom mints
  BOOM_DWELL_MAX: 24,                // cap the dwell counter (bounded state)
  BOOM_PROSPERITY_DRIFT: 0.14,       // per-tick prosperity band-step drift UP (receipted)
  BUST_THROUGHPUT: 1.0,              // a boom BUSTS when throughput collapses below this
  BUST_PROSPERITY_RETREAT: -0.9,     // the prosperity band-step retreat on the bust
  BUST_LEGITIMACY_HIT: -3,           // the bust legitimacy knock (emigration is EMERGENT:
                                     // M4 reads the fallen prosperity — no population write)
  BUST_HOLD: 3,                      // ticks the bust condition holds before the record drops
  // FLOURISHING (B3) — the golden-age homeostat, modest v1. war_exhaustion's mirror: a
  // gentle cultural attractor, NEVER a power snowball (NO martial/economic multiplier).
  FLOUR_PROSPERITY_FLOOR: 0.66,      // prosperity01 (≈ Prosperous+) — high, rare by construction
  FLOUR_LEGITIMACY_FLOOR: 0.66,      // legitimacy01 (publicLegitimacy.score/100)
  FLOUR_MIN_DWELL: 6,                // ticks of sustained prosperity+legitimacy+PEACE before it mints
  FLOUR_DURATION: 16,                // the capped condition lifetime (ticks)
  FLOUR_COOLDOWN: 12,                // ticks after it ends before a settlement may flourish again
});

// ── Reads (all pure over the settlement) ──────────────────────────────────────
/** prosperity 0..1 on the canonical ladder (unknown ⇒ mid). @param {UpSettlement|undefined} s */
function prosperity01Of(s) {
  const rank = prosperityRank(/** @type {Parameters<typeof prosperityRank>[0]} */ (asObject(s?.economicState).prosperity));
  if (rank < 0) return 0.4;
  return clamp01(rank / Math.max(1, PROSPERITY_TIERS.length - 1));
}

/** publicLegitimacy 0..1 (score/100), or 0 when unreadable. @param {UpSettlement|undefined} s */
function legitimacy01Of(s) {
  const pl = asObject(asObject(s?.powerStructure).publicLegitimacy);
  const sc = num(pl.score, NaN);
  return Number.isFinite(sc) ? clamp01(sc / 100) : 0;
}

/** Does the settlement already carry a cultural institution (temple/academy/library)?
 *  @param {UpSettlement|undefined} s */
function hasCulturalInstitution(s) {
  const insts = Array.isArray(s?.institutions) ? s.institutions : [];
  return insts.some((i) => {
    if (String(i?.status || 'active') !== 'active') return false;
    const n = String(i?.name || '').toLowerCase();
    const c = String(i?.category || '').toLowerCase();
    return /temple|academy|library|university|college|shrine|cathedral/.test(n) || c === 'religious' || c === 'academic' || c === 'cultural';
  });
}

/** The builder-roster strength 0..1: active mason/carpenter/lodge/quarry institutions.
 *  A ROSTER READ, never a toggle (design B1). @param {UpSettlement|undefined} s */
function builderRoster01(s) {
  const insts = Array.isArray(s?.institutions) ? s.institutions : [];
  let builders = 0;
  for (const i of insts) {
    if (String(i?.status || 'active') !== 'active') continue;
    const n = String(i?.name || '').toLowerCase();
    const c = String(i?.category || '').toLowerCase();
    if (/mason|carpenter|lodge|quarr|builder|stonework|timber|sawmill|lumber/.test(n)
      || c === 'crafts' || c === 'construction') builders += 1;
  }
  // 0 builders ⇒ 0; saturates by ~3 (a full build-trade roster).
  return clamp01(builders / 3);
}

/** Is `id` under a naval blockade OR a live supply-web campaign — a STRANGULATION the owner's
 *  "a blockade is the same as a siege" law (DESIGN_NAVY §4) says is NOT peace, even absent a
 *  war-layer front (r2 sim-cohesion-counterparts-3). Dormancy-safe: with naval/supply-web dark
 *  both reads are empty ⇒ false ⇒ peace01Of is unchanged. @param {Record<string, unknown>|null|undefined} worldState
 *  @param {string} id @returns {boolean} */
function underStrangulation(worldState, id) {
  if (!worldState) return false;
  if (activeBlockadeTargets(worldState).has(String(id))) return true;
  const campaigns = asObject(getSpatialLedger(/** @type {Record<string,unknown>} */ (worldState), 'campaignPlans'));
  for (const k of Object.keys(campaigns)) {
    if (String(asObject(campaigns[k]).targetId) === String(id)) return true;
  }
  return false;
}

/** Is the settlement currently at PEACE? 1 peace, 0 war. NOT peace when a war front points
 *  into/from it OR when it is under a naval blockade / supply-web strangulation (blockade-is-a-
 *  siege). @param {UpGraph|null|undefined} graph @param {string} id
 *  @param {Record<string, unknown>|null|undefined} [worldState] */
function peace01Of(graph, id, worldState) {
  const into = warFrontsInto(graph, id) || [];
  const from = warFrontsFrom(graph, id) || [];
  if (into.length !== 0 || from.length !== 0) return 0;
  if (underStrangulation(worldState, id)) return 0;
  return 1;
}

/** A NEW shock this tick (a fresh calamity within the arc, a live famine, a war front, or a
 *  blockade/strangulation) — the reconstruction regressor. @param {UpSettlement|undefined} s
 *  @param {UpGraph|null|undefined} graph @param {string} id
 *  @param {Record<string, unknown>|null|undefined} worldState @param {unknown[]} stressors
 *  @param {number} startedYear @param {number} year */
function hasNewShock(s, graph, id, worldState, stressors, startedYear, year) {
  if (peace01Of(graph, id, worldState) === 0) return true; // a war front reopened OR a blockade/strangulation
  if (famineFor(/** @type {[]} */ (stressors), id)) return true;
  // A fresh calamity stamp minted AFTER the rebuild began (a second blow).
  const hist = Array.isArray(s?.calamityHistory) ? s.calamityHistory : [];
  for (const st of hist) if (num(st?.year, -Infinity) > startedYear && num(st?.year, Infinity) <= year) return true;
  return false;
}

/** True iff a calamity stamp is recent (within the trigger window) AND not yet marked
 *  reconstructed — so a single calamity ARMS the rebuild ONCE, never perpetually.
 *  @param {UpSettlement|undefined} s @param {number} year */
function recentUnreconstructedCalamity(s, year) {
  const hist = Array.isArray(s?.calamityHistory) ? s.calamityHistory : [];
  for (const st of hist) {
    const y = num(st?.year, -Infinity);
    if (!Number.isFinite(y)) continue;
    if ((year - y) >= 0 && (year - y) <= UPSWING_TUNING.RECON_TRIGGER_CALAMITY_WINDOW
      && !Number.isFinite(num(/** @type {{reconstructedAt?:number}} */ (st).reconstructedAt, NaN))) return true;
  }
  return false;
}

/** The cleared-siege / lifted-occupation condition (the war-aftermath trigger), or null
 *  — reconstruction CONSUMES it on arming so it does not re-trigger. @param {UpSettlement|undefined} s */
function clearingCondition(s) {
  const conds = Array.isArray(s?.activeConditions) ? s.activeConditions : [];
  return conds.find((c) => c?.archetype === 'siege_lifted' || c?.archetype === 'occupation_lifted') || null;
}

/** Has the settlement an active reconstruction condition already?  @param {UpSettlement|undefined} s */
function hasReconCondition(s) {
  const conds = Array.isArray(s?.activeConditions) ? s.activeConditions : [];
  return conds.some((c) => c?.archetype === 'reconstruction');
}

/** The strongest LIVE ally-credit obligation this settlement OWES (from===id) — inbound
 *  investment the rebuild can consume (and MATURE). @param {UpObligation[]} obls @param {string} id */
function strongestAllyDebt(obls, id) {
  let best = null;
  for (const o of obls) {
    if (String(o.from) !== id) continue;
    if (!(o.magnitude > 0)) continue;
    if (!best || o.magnitude > best.magnitude
      || (o.magnitude === best.magnitude && `${o.to}:${o.kind}` < `${best.to}:${best.kind}`)) best = o;
  }
  return best;
}

/** The upgrade candidate: the codepoint-first active non-required institution whose
 *  upgrade-chain greater is NOT already standing (the demote lattice read UP). Returns
 *  { from, to } or null. @param {UpSettlement|undefined} s */
function upgradeCandidate(s) {
  const insts = Array.isArray(s?.institutions) ? s.institutions : [];
  const standing = new Set(insts.map((i) => String(i?.name || '').toLowerCase()));
  const eligible = insts
    .filter((i) => i && i.required !== true && String(i.status || 'active') === 'active' && String(i.name || ''))
    .map((i) => String(i.name))
    .sort();
  for (const name of eligible) {
    const greater = promotesTo(name);
    if (greater && !standing.has(greater.toLowerCase())) return { from: name, to: greater };
  }
  return null;
}

// ── Read the obligations ledger into a flat list (from generosity's sub-ledger) ─
/** @param {Record<string, unknown>|null|undefined} obligationLedger @returns {UpObligation[]} */
function readObligations(obligationLedger) {
  const out = [];
  const src = asObject(obligationLedger);
  for (const key of Object.keys(src)) {
    const rec = asObject(src[key]);
    const from = String(rec.from ?? '');
    const to = String(rec.to ?? '');
    const kind = String(rec.kind ?? '');
    const magnitude = num(rec.magnitude, NaN);
    if (from && to && kind && Number.isFinite(magnitude)) out.push({ from, to, kind, magnitude: clamp01(magnitude) });
  }
  return out;
}

// ── B2 boom/bust reads (throughput, centrality, arteries) ──────────────────────
// W-DISCOVERY SEAM (design §2e): a resource-removal event plants a `vein_exhausted`
// condition; a discovery plants `resource_strike`. resourceRemoved feeds the SAME bust
// flip as a severed artery (the boom over a worked-out nonrenewable busts, naming the
// dead vein), and a live resource_strike joins the boom SOURCE taxonomy. Both are
// dormancy-safe: with resourceDynamicsEnabled dark neither condition ever exists, so
// these reads are always false and the upswing is byte-identical.
/** @param {{ activeConditions?: Array<{ archetype?: string }> }|null|undefined} s */
function resourceRemoved(s) {
  const conds = Array.isArray(s?.activeConditions) ? s.activeConditions : [];
  return conds.some((c) => c?.archetype === 'vein_exhausted');
}
/** @param {{ activeConditions?: Array<{ archetype?: string }> }|null|undefined} s */
function resourceStruck(s) {
  const conds = Array.isArray(s?.activeConditions) ? s.activeConditions : [];
  return conds.some((c) => c?.archetype === 'resource_strike');
}
/** The settlement's windowed trade throughput (in + out) from the M6d tradeFlow tally.
 *  @param {Record<string, unknown>|null|undefined} tradeFlowLedger @param {string} id */
function flowThroughput(tradeFlowLedger, id) {
  const rec = asObject(asObject(tradeFlowLedger)[id]);
  return Math.max(0, num(rec.in, 0)) + Math.max(0, num(rec.out, 0));
}

/** The settlement's earned entrepôt centrality 0..1 (M6b ledger), or 0.
 *  @param {Record<string, unknown>|null|undefined} entrepotLedger @param {string} id */
function entrepotCentrality(entrepotLedger, id) {
  const rec = asObject(asObject(entrepotLedger)[id]);
  return clamp01(num(rec.centrality, 0));
}

/** The settlement's trade ARTERIES — the codepoint-sorted ids of its trade-partner
 *  neighbours (the source set + fragile-edge read: <2 ⇒ single-sourced/fragile).
 *  @param {UpGraph|null|undefined} graph @param {string} id @returns {string[]} */
function tradeArteries(graph, id) {
  const edges = Array.isArray(graph?.edges) ? graph.edges : [];
  const out = new Set();
  for (const e of edges) {
    const edge = asObject(e);
    const kind = String(edge.relationshipType || '');
    if (!/trade|allied|vassal|patron/.test(kind)) continue;
    const a = String(edge.from ?? '');
    const b = String(edge.to ?? '');
    if (a === id && b) out.add(b);
    else if (b === id && a) out.add(a);
  }
  return [...out].sort();
}

// ── The advance ───────────────────────────────────────────────────────────────
/**
 * @typedef {Object} UpswingAdvanceResult
 * @property {UpUpdate[]} settlementUpdates
 * @property {Record<string, unknown>} worldState
 * @property {boolean} changed
 * @property {Array<Record<string, unknown>>} newsEntries
 * @property {Array<Record<string, unknown>>} receipts
 */

/**
 * Advance the upswing-arc layer one tick. DORMANT (flag absent) ⇒ a complete no-op
 * (byte-identical). Lit ⇒ mint/advance the reconstruction arc for each qualifying
 * settlement (codepoint-sorted), conserving every source and receipting every step.
 * @param {Object} args
 * @param {UpSnapshot} args.snapshot
 * @param {Record<string, unknown>} args.worldState
 * @param {UpUpdate[]} args.settlementUpdates
 * @param {UpGraph|null|undefined} args.graph
 * @param {{ fork?: (k: string) => { random: () => number } }|null} [args.rng]
 * @param {number} args.tick
 * @param {string|null} args.now
 * @returns {UpswingAdvanceResult}
 */
export function advanceUpswing({ snapshot, worldState, settlementUpdates, graph, tick, now }) {
  const updates = Array.isArray(settlementUpdates) ? settlementUpdates : [];
  // ── DORMANCY GATE: the flag absent ⇒ an immediate no-op. No fork, no key. ──
  if (!upswingArcsActive(worldState)) {
    return { worldState, settlementUpdates: updates, changed: false, newsEntries: [], receipts: [] };
  }

  const T = UPSWING_TUNING;
  const items = Array.isArray(snapshot?.settlements) ? snapshot.settlements : [];
  const itemById = new Map(items.map((it) => [String(it.id), it]));
  const stressors = Array.isArray(/** @type {{stressors?: unknown[]}} */ (worldState)?.stressors)
    ? /** @type {unknown[]} */ (/** @type {{stressors?: unknown[]}} */ (worldState).stressors) : [];
  const year = num(asObject(asObject(worldState).calendar).year, Math.floor(num(tick, 0) / 52) + 1);

  /** @type {Map<string, number>} */
  const updateIndex = new Map();
  updates.forEach((u, i) => updateIndex.set(String(u.saveId), i));
  /** @param {string} id @returns {UpSettlement|undefined} freshest (update ▸ snapshot). Reads
   *  nextUpdates (NOT the stale pre-clone `updates`) so a later same-tick arc pass composes onto
   *  an earlier pass's write instead of clobbering it — the settlementLifecycleKernel.js:471
   *  idiom, byte-identical to it (r2 determinism-constitution-1). Before any clone
   *  nextUpdates === updates, so the read is always at-least-as-fresh. Invoked only after the
   *  `let nextUpdates` declaration below (TDZ resolved by call time). */
  const freshSettlement = (id) => {
    const ui = updateIndex.get(String(id));
    if (ui !== undefined) return nextUpdates[ui]?.settlement;
    return itemById.get(String(id))?.settlement;
  };

  const upswingLedger = asObject(getSpatialLedger(worldState, 'upswing'));
  const reconLedger = asObject(upswingLedger.reconstruction);
  const boomLedger = asObject(upswingLedger.boom);
  const flourishLedger = asObject(upswingLedger.flourishing);
  const tradeFlowLedger = /** @type {Record<string,unknown>|null} */ (getSpatialLedger(worldState, 'tradeFlow'));
  const entrepotLedger = /** @type {Record<string,unknown>|null} */ (getSpatialLedger(worldState, 'entrepots'));
  const obligations = readObligations(/** @type {Record<string,unknown>|null} */ (getSpatialLedger(worldState, 'obligations')));

  let nextUpdates = updates;
  let cloned = false;
  const ensureCloned = () => { if (!cloned) { nextUpdates = updates.slice(); cloned = true; } };
  /** @type {Record<string, ReconRecord>} */
  const nextRecon = {};
  /** @type {Record<string, BoomRecord>} */
  const nextBoom = {};
  /** @type {Record<string, FlourishRecord>} */
  const nextFlourish = {};
  /** @type {Map<string, number>} the prosperity BAND-STEP delta per settlement (boom drift / bust retreat) */
  const prosperityDeltas = new Map();
  /** @type {Array<{ from: string, to: string, kind: string, amount: number }>} */
  const obligationRepayments = [];
  /** @type {Map<string, number>} */
  const legitimacyDeltas = new Map();
  /** @type {Array<Record<string, unknown>>} */
  const newsEntries = [];
  /** @type {Array<Record<string, unknown>>} */
  const receipts = [];

  // Codepoint-sorted settlement order (deterministic arc sequencing).
  const ordered = items.map((it) => String(it.id)).sort();

  for (const id of ordered) {
    const s = freshSettlement(id);
    if (!s) continue;
    if (lifecycleStatusOf(s)) continue; // MOVERS SKIP REMNANTS (r2 economy-upswing-1): a terminal-dead corpse never rebuilds
    const item = itemById.get(id);
    const prior = /** @type {ReconRecord|null} */ (asObject(reconLedger)[id] ? /** @type {ReconRecord} */ (reconLedger[id]) : null);
    const clearing = !prior ? clearingCondition(s) : null;
    const arming = !prior && !hasReconCondition(s) && (recentUnreconstructedCalamity(s, year) || !!clearing);

    if (!prior && !arming) continue; // not rebuilding, nothing arms it — sparse skip.

    const ui = updateIndex.get(id);
    if (ui === undefined) continue;

    // ── Compose the progress step (each term a NAMED source). ──
    const prosperity01 = prosperity01Of(s);
    const builder01 = builderRoster01(s);
    const peace01 = peace01Of(graph, id, worldState);
    const allyDebt = strongestAllyDebt(obligations, id);
    const ally01 = allyDebt ? allyDebt.magnitude : 0;

    const startedTick = prior ? prior.startedTick : tick;
    const startedYear = prior ? prior.startedYear : year;
    const shock = hasNewShock(s, graph, id, worldState, stressors, startedYear, year);

    let step = T.RECON_BASE_STEP
      + T.RECON_PROSPERITY_GAIN * prosperity01
      + T.RECON_BUILDER_GAIN * builder01
      + T.RECON_ALLY_GAIN * ally01
      + T.RECON_PEACE_GAIN * peace01;
    if (shock) step -= T.RECON_SHOCK_REGRESS;
    // ABSORPTION CAP — the one genuinely new bound: a settlement integrates at most a
    // capped rebuild per tick. When it BINDS, the receipt says so (deferral-visible).
    const rawStep = step;
    const capped = step > T.RECON_ABSORPTION_CAP;
    step = clamp(step, -1, T.RECON_ABSORPTION_CAP);

    const prevProgress = prior ? clamp01(prior.progress) : 0;
    const progress = clamp01(prevProgress + step);

    // ── CONSERVATION: an accelerated tick that DREW on ally credit MATURES the debt
    // (aid consumed is aid spent — the obligation ledger debit). Only when the ally
    // term actually contributed to a POSITIVE step. ──
    let allyMatured = 0;
    if (allyDebt && ally01 > 0 && step > 0) {
      allyMatured = Math.min(allyDebt.magnitude, T.RECON_ALLY_MATURE_STEP * ally01);
      if (allyMatured > 0) obligationRepayments.push({ from: allyDebt.from, to: allyDebt.to, kind: allyDebt.kind, amount: allyMatured });
    }

    const rec = /** @type {ReconRecord} */ ({
      progress,
      startedTick,
      startedYear,
      srcInternal: (prior ? prior.srcInternal : 0) + Math.max(0, T.RECON_BASE_STEP + T.RECON_PROSPERITY_GAIN * prosperity01 + T.RECON_BUILDER_GAIN * builder01),
      srcAlly: (prior ? prior.srcAlly : 0) + Math.max(0, T.RECON_ALLY_GAIN * ally01),
      srcPeace: (prior ? prior.srcPeace : 0) + Math.max(0, T.RECON_PEACE_GAIN * peace01),
      srcBuilder: (prior ? prior.srcBuilder : 0) + Math.max(0, T.RECON_BUILDER_GAIN * builder01),
      lastTick: tick,
    });

    if (progress >= T.RECON_COMPLETE_AT) {
      // ── COMPLETION — the history beat + legitimacy dividend + institution upgrade
      // + (no free candy) the reconstruction SKIM. The ledger record is consumed. ──
      ensureCloned();
      let settlement = /** @type {UpSettlement} */ ({ ...s });

      // MARK the addressed calamity stamps reconstructedAt (so the rebuilt calamity never
      // re-arms the arc — the trigger is consumed). Durable (persisted on the stamp), no
      // extra ledger state. Recent within-window stamps are the ones this rebuild closed.
      const hist = Array.isArray(settlement.calamityHistory) ? settlement.calamityHistory : [];
      if (hist.length) {
        let touched = false;
        const nextHist = hist.map((st) => {
          const y = num(st?.year, -Infinity);
          if ((year - y) >= 0 && (year - y) <= T.RECON_TRIGGER_CALAMITY_WINDOW
            && !Number.isFinite(num(/** @type {{reconstructedAt?:number}} */ (st).reconstructedAt, NaN))) {
            touched = true;
            return { ...st, reconstructedAt: tick };
          }
          return st;
        });
        if (touched) settlement = { ...settlement, calamityHistory: nextHist };
      }

      // Institution UPGRADE up the lattice (calamity's demote read in reverse; dedup).
      const upgrade = upgradeCandidate(settlement);
      if (upgrade) {
        const insts = Array.isArray(settlement.institutions) ? settlement.institutions.map((i) => ({ ...i })) : [];
        const idx = insts.findIndex((i) => String(i.name) === upgrade.from && String(i.status || 'active') === 'active');
        if (idx >= 0) {
          insts[idx] = { ...insts[idx], name: upgrade.to, promotedFrom: upgrade.from, worldPulseFate: 'upgraded_by_reconstruction' };
          settlement = { ...settlement, institutions: insts };
        }
      }

      // The legitimacy dividend (bounded, applied via the delta path).
      legitimacyDeltas.set(id, (legitimacyDeltas.get(id) || 0) + T.RECON_LEGITIMACY_DIVIDEND);

      // The permanent history beat ("rebuilt in the year …").
      settlement = /** @type {UpSettlement} */ (withCampaignHistoryEvent(
        /** @type {import('../settlement.schema.js').SimSettlement} */ (/** @type {unknown} */ (settlement)),
        { id: `reconstruction.${id}.${startedTick}`, label: 'Reconstruction', type: 'stressor_residual', resolvedAt: tick, severity: 0.4 },
        tick,
      ));

      // Clear the reconstruction condition (the arc is done).
      const reconCond = (Array.isArray(settlement.activeConditions) ? settlement.activeConditions : [])
        .find((c) => c?.archetype === 'reconstruction');
      if (reconCond?.id) settlement = /** @type {UpSettlement} */ (withoutActiveCondition(settlement, reconCond.id));

      // THE SKIM (§ no free candy): funds flowing × LOW conscience ⇒ corruption pressure.
      const malice01 = item ? clamp01(computeMalice(/** @type {Parameters<typeof computeMalice>[0]} */ (/** @type {unknown} */ (item)), worldState)) : 0.5;
      const fundsFlowed = rec.srcAlly > 0;
      let skimmed = false;
      if (fundsFlowed && malice01 >= T.RECON_SKIM_MALICE_FLOOR) {
        skimmed = true;
        settlement = /** @type {UpSettlement} */ (withActiveCondition(
          /** @type {import('../activeConditions.js').CondSettlement} */ (/** @type {unknown} */ (settlement)),
          {
            id: `condition.reconstruction_skim.${tick}`,
            archetype: 'custom_crisis',
            label: 'Reconstruction Skim',
            severity: clamp01(0.3 + 0.3 * malice01),
            affectedSystems: ['criminal_opportunity', 'social_trust', 'public_legitimacy'],
            description: 'The rebuild funds have leaked into corrupt hands; a graft network takes root amid the scaffolding.',
          },
        ));
      }

      nextUpdates[ui] = { ...nextUpdates[ui], settlement };
      // NOT written to nextRecon ⇒ the record is dropped (the arc completed).
      newsEntries.push(reconstructionNews(id, String(item?.name || settlement.name || id), upgrade, skimmed, year, tick, now));
      receipts.push({
        id, kind: 'reconstruction_complete', year,
        sources: { internal: round4(rec.srcInternal), ally: round4(rec.srcAlly), peace: round4(rec.srcPeace), builder: round4(rec.srcBuilder) },
        allyMatured: round4(allyMatured), upgraded: upgrade ? `${upgrade.from} → ${upgrade.to}` : null,
        legitimacyDividend: T.RECON_LEGITIMACY_DIVIDEND, skimmed,
      });
      continue;
    }

    // ── ONGOING — mint the condition on arming, carry the record, receipt the step. ──
    nextRecon[id] = rec;
    if (arming) {
      ensureCloned();
      let settlement = /** @type {UpSettlement} */ (withActiveCondition(
        /** @type {import('../activeConditions.js').CondSettlement} */ (/** @type {unknown} */ (s)),
        {
          id: `condition.reconstruction.${startedTick}`,
          archetype: 'reconstruction',
          label: 'Reconstruction',
          severity: 0.4,
          affectedSystems: ['public_legitimacy', 'labor_capacity', 'social_trust'],
          description: 'The settlement is rebuilding — the rebuild race is on.',
        },
      ));
      // CONSUME a siege/occupation-clearing trigger so it cannot re-arm the arc; the
      // reconstruction lift subsumes the recovery lift it was born from.
      if (clearing?.id) settlement = /** @type {UpSettlement} */ (withoutActiveCondition(settlement, clearing.id));
      nextUpdates[ui] = { ...nextUpdates[ui], settlement };
    }
    receipts.push({
      id, kind: 'reconstruction_progress', progress: round4(progress), step: round4(step),
      sources: { prosperity: round4(prosperity01), builder: round4(builder01), ally: round4(ally01), peace: peace01 },
      allyMatured: round4(allyMatured), regressed: shock, absorptionCapped: capped, rawStep: round4(rawStep),
    });
  }

  // ── B2 BOOM → BUST — NAME a composition the movers already produce (hysteresis). ──
  // Sustained M6d surplus throughput + earned entrepôt centrality mints a `boom`
  // (prosperity DRIFTS up — receipted, sourced from real trade arteries; migration pull
  // is EMERGENT, M4 already reads prosperity). The boom records its OWN FRAGILE EDGES
  // (<2 independent arteries). A severance (throughput collapse OR embattlement — or a
  // future W-DISCOVERY resource removal, SEAM below) flips boom → bust: a prosperity
  // retreat + a legitimacy knock + a receipt naming the severed artery.
  for (const id of ordered) {
    const s = freshSettlement(id);
    if (!s) continue;
    if (lifecycleStatusOf(s)) continue; // MOVERS SKIP REMNANTS (r2 economy-upswing-1): a corpse cannot boom
    const item = itemById.get(id);
    const prior = /** @type {BoomRecord|null} */ (boomLedger[id] ? /** @type {BoomRecord} */ (boomLedger[id]) : null);
    const throughput = flowThroughput(tradeFlowLedger, id);
    const centrality = entrepotCentrality(entrepotLedger, id);
    const embattled = embattlementLevel(worldState, id) > 0;
    const arteries = tradeArteries(graph, id);
    const fragile = arteries.length < 2;
    // W-DISCOVERY SEAM (now LANDED): a resource-removal event plants `vein_exhausted`,
    // which feeds the SAME bust flip as a severed artery (a boom over a worked-out
    // nonrenewable busts). Dormancy-safe — no such condition exists when
    // resourceDynamicsEnabled is dark.
    const veinGone = resourceRemoved(s);
    const severed = embattled || throughput < T.BUST_THROUGHPUT || veinGone;
    const ui = updateIndex.get(id);

    if (prior?.phase === 'boom') {
      if (severed) {
        // ── THE BUST — a prosperity retreat + legitimacy knock + a receipt naming the
        // artery. Emigration is EMERGENT (M4 reads the fallen prosperity). ──
        if (ui !== undefined) {
          ensureCloned();
          const settlement = /** @type {UpSettlement} */ (withActiveCondition(
            /** @type {import('../activeConditions.js').CondSettlement} */ (/** @type {unknown} */ (freshSettlement(id))),
            {
              id: `condition.bust.${tick}`, archetype: 'custom_crisis', label: 'Trade Bust',
              severity: 0.55, affectedSystems: ['trade_connectivity', 'public_legitimacy', 'labor_capacity'],
              description: 'The trade that fed the boom has failed; markets retreat and the town empties toward richer roads.',
            },
          ));
          // Clear any lingering boom condition.
          const boomCond = (Array.isArray(settlement.activeConditions) ? settlement.activeConditions : []).find((c) => c?.archetype === 'boom');
          nextUpdates[ui] = { ...nextUpdates[ui], settlement: boomCond?.id ? /** @type {UpSettlement} */ (withoutActiveCondition(settlement, boomCond.id)) : settlement };
        }
        prosperityDeltas.set(id, (prosperityDeltas.get(id) || 0) + T.BUST_PROSPERITY_RETREAT);
        legitimacyDeltas.set(id, (legitimacyDeltas.get(id) || 0) + T.BUST_LEGITIMACY_HIT);
        nextBoom[id] = { phase: 'bust', dwell: 0, enteredTick: tick, arteries: prior.arteries, fragile: prior.fragile, throughput, prosperityAccrued: 0, lastTick: tick };
        newsEntries.push(bustNews(id, String(item?.name || s.name || id), prior.arteries, embattled, tick, now));
        receipts.push({ id, kind: 'bust', severedArtery: prior.arteries[0] || null, arteries: prior.arteries, cause: embattled ? 'embattlement' : (veinGone ? 'resource_removal' : 'artery_collapse'), throughput: round4(throughput), fragile: prior.fragile });
      } else {
        // ── SUSTAIN — prosperity DRIFTS up (accrued fractionally; a BAND step emits only
        // when the accrual crosses 1.0 — a boom grows rich on VOLUME, receipted + sourced). ──
        const acc = num(prior.prosperityAccrued, 0) + T.BOOM_PROSPERITY_DRIFT;
        const bandStep = Math.floor(acc);
        if (bandStep > 0) prosperityDeltas.set(id, (prosperityDeltas.get(id) || 0) + bandStep);
        nextBoom[id] = { phase: 'boom', dwell: Math.min(T.BOOM_DWELL_MAX, prior.dwell + 1), enteredTick: prior.enteredTick, arteries, fragile, throughput, prosperityAccrued: acc - bandStep, lastTick: tick };
        receipts.push({ id, kind: 'boom_sustain', throughput: round4(throughput), centrality: round4(centrality), sources: { arteries, extraction: false, aid: false, discovery: resourceStruck(s) }, fragile, prosperityBandStep: bandStep });
      }
    } else if (prior?.phase === 'bust') {
      // The bust holds a few ticks (the retreat plays out via the condition), then drops.
      if (prior.dwell + 1 >= T.BUST_HOLD) {
        // drop (not written to nextBoom).
      } else {
        nextBoom[id] = { ...prior, phase: 'bust', dwell: prior.dwell + 1, lastTick: tick };
      }
    } else if (prior?.phase === 'building' || (throughput >= T.BOOM_ENTER_THROUGHPUT && centrality >= T.BOOM_CENTRALITY_FLOOR)) {
      // ── APPROACHING BOOM — accumulate the hysteresis dwell; mint at MIN_DWELL. ──
      const sustained = throughput >= T.BOOM_EXIT_THROUGHPUT && centrality >= T.BOOM_CENTRALITY_FLOOR;
      if (!sustained) {
        // Fell back below the exit band before minting — drop the building record.
      } else {
        const dwell = (prior?.dwell || 0) + 1;
        if (dwell >= T.BOOM_MIN_DWELL) {
          // MINT THE BOOM: the condition + the first prosperity drift, records fragile edges.
          if (ui !== undefined) {
            ensureCloned();
            const settlement = /** @type {UpSettlement} */ (withActiveCondition(
              /** @type {import('../activeConditions.js').CondSettlement} */ (/** @type {unknown} */ (freshSettlement(id))),
              {
                id: `condition.boom.${tick}`, archetype: 'boom', label: 'Boom',
                severity: 0.4, affectedSystems: ['public_legitimacy', 'trade_connectivity'],
                description: `A trade boom — prosperous, and quietly dependent on ${arteries.length} artery${arteries.length === 1 ? '' : 's'}${fragile ? ' (fragile: a single failure could bust it)' : ''}.`,
              },
            ));
            nextUpdates[ui] = { ...nextUpdates[ui], settlement };
          }
          nextBoom[id] = { phase: 'boom', dwell: 0, enteredTick: tick, arteries, fragile, throughput, prosperityAccrued: T.BOOM_PROSPERITY_DRIFT, lastTick: tick };
          newsEntries.push(boomNews(id, String(item?.name || s.name || id), arteries, fragile, tick, now));
          receipts.push({ id, kind: 'boom_enter', throughput: round4(throughput), centrality: round4(centrality), sources: { arteries, extraction: false, aid: false, discovery: resourceStruck(s) }, fragile });
        } else {
          nextBoom[id] = { phase: 'building', dwell, enteredTick: tick, arteries, fragile, throughput, prosperityAccrued: 0, lastTick: tick };
        }
      }
    }
  }

  // ── B3 FLOURISHING — the golden-age homeostat (war_exhaustion's MIRROR). A settlement
  // that holds high prosperity + high legitimacy + PEACE for FLOUR_MIN_DWELL ticks tips
  // into a bounded `flourishing` condition: tolerance/piety warmth (the LIFT) + a cultural
  // founding bias (ONE temple/academy if none stands) + a chronicle beat. NO martial or
  // economic multiplier — it never touches prosperity, army, or economic_capacity (the
  // never-snowballs pin). Capped duration + a cooldown. The PRE-DECLARED boom_flourishing
  // drama-class producer (decisionTier.upswing_flourishing). ──
  for (const id of ordered) {
    const s = freshSettlement(id);
    if (!s) continue;
    if (lifecycleStatusOf(s)) continue; // MOVERS SKIP REMNANTS (r2 economy-upswing-1): a corpse never flourishes
    const item = itemById.get(id);
    const prior = /** @type {FlourishRecord|null} */ (flourishLedger[id] ? /** @type {FlourishRecord} */ (flourishLedger[id]) : null);
    const peace = peace01Of(graph, id, worldState) === 1;
    const qualifies = prosperity01Of(s) >= T.FLOUR_PROSPERITY_FLOOR && legitimacy01Of(s) >= T.FLOUR_LEGITIMACY_FLOOR && peace;
    const ui = updateIndex.get(id);

    if (prior?.phase === 'flourishing') {
      if (tick >= num(prior.endsTick, 0) || !peace) {
        // END — capped duration reached OR peace broke: clear the condition, start cooldown.
        if (ui !== undefined) {
          const fresh = freshSettlement(id);
          const flourCond = (Array.isArray(fresh?.activeConditions) ? fresh.activeConditions : []).find((c) => c?.archetype === 'flourishing');
          if (flourCond?.id) { ensureCloned(); nextUpdates[ui] = { ...nextUpdates[ui], settlement: /** @type {UpSettlement} */ (withoutActiveCondition(fresh, flourCond.id)) }; }
        }
        nextFlourish[id] = { phase: 'building', dwell: 0, enteredTick: tick, endsTick: 0, cooldownUntil: tick + T.FLOUR_COOLDOWN, lastTick: tick };
        receipts.push({ id, kind: 'flourishing_end', reason: peace ? 'ran_its_course' : 'peace_broke' });
      } else {
        nextFlourish[id] = { ...prior, lastTick: tick }; // sustain (bounded — no drift, no multiplier)
      }
      continue;
    }

    // Not flourishing. Respect the cooldown, then accumulate the dwell.
    const cooldownUntil = num(prior?.cooldownUntil, 0);
    if (tick < cooldownUntil) { nextFlourish[id] = { phase: 'building', dwell: 0, enteredTick: tick, endsTick: 0, cooldownUntil, lastTick: tick }; continue; }
    if (!qualifies) continue; // dwell resets (record drops — sparse)

    const dwell = (prior?.phase === 'building' ? num(prior.dwell, 0) : 0) + 1;
    if (dwell >= T.FLOUR_MIN_DWELL && ui !== undefined) {
      // ── MINT FLOURISHING — the LIFT condition + the cultural founding bias + the beat. ──
      ensureCloned();
      let settlement = /** @type {UpSettlement} */ (withActiveCondition(
        /** @type {import('../activeConditions.js').CondSettlement} */ (/** @type {unknown} */ (freshSettlement(id))),
        {
          id: `condition.flourishing.${tick}`, archetype: 'flourishing', label: 'Flourishing',
          severity: 0.35, affectedSystems: ['public_legitimacy', 'social_trust'], // NO economic/martial system
          description: 'A long peace and steady legitimacy have made the settlement culturally fertile — a golden age, modest and bounded.',
        },
      ));
      // The founding BIAS made concrete + bounded: found ONE cultural institution if none.
      let founded = null;
      if (!hasCulturalInstitution(settlement)) {
        founded = 'Academy';
        const insts = Array.isArray(settlement.institutions) ? settlement.institutions.map((i) => ({ ...i })) : [];
        insts.push({ name: 'Academy', category: 'academic', status: 'active', worldPulseFate: 'founded_by_flourishing' });
        settlement = { ...settlement, institutions: insts };
      }
      nextUpdates[ui] = { ...nextUpdates[ui], settlement };
      nextFlourish[id] = { phase: 'flourishing', dwell: 0, enteredTick: tick, endsTick: tick + T.FLOUR_DURATION, cooldownUntil: 0, lastTick: tick };
      newsEntries.push(flourishingNews(id, String(item?.name || s.name || id), founded, tick, now));
      receipts.push({ id, kind: 'flourishing_enter', founded, endsTick: tick + T.FLOUR_DURATION, noMultiplier: true });
    } else {
      nextFlourish[id] = { phase: 'building', dwell, enteredTick: tick, endsTick: 0, cooldownUntil: 0, lastTick: tick };
    }
  }

  // ── PERSIST (drop-when-empty). Nothing arced ⇒ byte-identical. ──
  let nextWorldState = worldState;
  let changed = cloned;

  // The upswing ledger (reconstruction + boom + flourishing sub-maps). Rebuild from the
  // surviving sub-maps; drop the whole 'upswing' key when ALL are empty (drop-when-empty).
  const reconChanged = JSON.stringify(sortedRecord(nextRecon)) !== JSON.stringify(sortedRecord(reconLedger));
  const boomChanged = JSON.stringify(sortedRecord(nextBoom)) !== JSON.stringify(sortedRecord(boomLedger));
  const flourishChanged = JSON.stringify(sortedRecord(nextFlourish)) !== JSON.stringify(sortedRecord(flourishLedger));
  if (reconChanged || boomChanged || flourishChanged) {
    const nextUpswing = { ...upswingLedger };
    delete nextUpswing.reconstruction;
    delete nextUpswing.boom;
    delete nextUpswing.flourishing;
    if (Object.keys(nextRecon).length > 0) nextUpswing.reconstruction = sortedRecord(nextRecon);
    if (Object.keys(nextBoom).length > 0) nextUpswing.boom = sortedRecord(nextBoom);
    if (Object.keys(nextFlourish).length > 0) nextUpswing.flourishing = sortedRecord(nextFlourish);
    if (Object.keys(nextUpswing).length > 0) {
      nextWorldState = setSpatialLedger(nextWorldState, 'upswing', nextUpswing);
    } else {
      nextWorldState = dropSpatialLedger(nextWorldState, 'upswing');
    }
    changed = true;
  }

  // Mature consumed ally obligations (the conservation debit) into the obligations ledger.
  // SINGLE-DECAY LAW (r2 economy-upswing-4): decayPerTick:0 — advanceGenerosity (and, when
  // intervening, convergence) already folded+decayed this same ledger earlier THIS tick; a
  // second whole-ledger decay here would erode every debt faster than the tuned rate. This
  // pass is repayment-only.
  if (obligationRepayments.length) {
    const prevObl = /** @type {Record<string, unknown>|null} */ (getSpatialLedger(worldState, 'obligations'));
    const nextObl = foldObligations(prevObl, { mints: [], repayments: obligationRepayments, now: tick, decayPerTick: 0 });
    if (JSON.stringify(nextObl || null) !== JSON.stringify(prevObl || null)) {
      nextWorldState = nextObl
        ? setSpatialLedger(nextWorldState, 'obligations', nextObl)
        : dropSpatialLedger(nextWorldState, 'obligations');
      changed = true;
    }
  }

  // Apply the boom/bust prosperity band-step deltas + the legitimacy deltas.
  if (prosperityDeltas.size) {
    ensureCloned();
    nextUpdates = applyProsperityDeltasToUpdates(nextUpdates, updateIndex, prosperityDeltas);
    changed = true;
  }
  if (legitimacyDeltas.size) {
    ensureCloned();
    nextUpdates = applyLegitimacyDeltasToUpdates(nextUpdates, updateIndex, legitimacyDeltas);
    changed = true;
  }

  return { settlementUpdates: nextUpdates, worldState: nextWorldState, changed, newsEntries, receipts };
}

// ── Small helpers ──────────────────────────────────────────────────────────────
/** @param {number} v @returns {number} */
function round4(v) { return Math.round(num(v, 0) * 10000) / 10000; }

/** Codepoint-sorted key order for a byte-stable ledger. @param {Record<string, unknown>} rec */
function sortedRecord(rec) {
  const out = /** @type {Record<string, unknown>} */ ({});
  for (const k of Object.keys(asObject(rec)).sort()) out[k] = asObject(rec)[k];
  return out;
}

/**
 * The reconstruction-completion news (house voice, AGGREGATE). Bucket-neutral.
 * @param {string} id @param {string} name @param {{from:string,to:string}|null} upgrade
 * @param {boolean} skimmed @param {number} year @param {number} tick @param {string|null} now
 */
function reconstructionNews(id, name, upgrade, skimmed, year, tick, now) {
  const built = upgrade ? ` The ${upgrade.to} rises where the ${upgrade.from} stood.` : '';
  const graft = skimmed ? ' Yet not all the rebuilding coin reached the stonemasons — a quiet graft has taken root.' : '';
  return {
    id: `wizard_news.${tick}.reconstruction.${id}`,
    tick, createdAt: now, scope: 'local', significance: 'moderate', severity: 0.4, score: 62,
    headline: `${name} is rebuilt`,
    summary: `${name} has finished rebuilding in the year ${year}, its wounds closed by its own hands and its allies'.${built}${graft}`,
    kind: 'applied', impactKind: 'reconstruction', channelType: 'settlement',
    settlementIds: [id], impactIds: [], channelIds: [],
    sourceEventId: `reconstruction.${id}.${tick}`,
    tags: ['world_pulse', 'upswing', 'reconstruction'],
    reasons: ['A conserved rebuild — its own prosperity, builders, peace, and its allies\' investment repaid.'],
  };
}

/**
 * Apply bounded publicLegitimacy.score dividends (the generosityKernel idiom): integer,
 * clamped [0,100], skips a legacy bare-number / absent legitimacy. Pure.
 * @param {UpUpdate[]} updates @param {Map<string, number>} updateIndex @param {Map<string, number>} legitimacyDeltas
 * @returns {UpUpdate[]}
 */
function applyLegitimacyDeltasToUpdates(updates, updateIndex, legitimacyDeltas) {
  let next = updates;
  let cloned = false;
  for (const [id, delta] of legitimacyDeltas) {
    if (!delta) continue;
    const ui = updateIndex.get(String(id));
    if (ui === undefined) continue;
    const entry = next[ui];
    const settlement = entry?.settlement;
    if (!settlement) continue;
    const ps = asObject(settlement.powerStructure);
    const plRaw = ps.publicLegitimacy;
    const pl = plRaw && typeof plRaw === 'object' && !Array.isArray(plRaw) ? /** @type {Record<string, unknown>} */ (plRaw) : null;
    if (!pl || !Number.isFinite(Number(pl.score))) continue;
    const nextScore = Math.round(Math.max(0, Math.min(100, Number(pl.score) + delta)));
    if (nextScore === Number(pl.score)) continue;
    if (!cloned) { next = updates.slice(); cloned = true; }
    next[ui] = /** @type {UpUpdate} */ ({
      ...entry,
      settlement: /** @type {UpSettlement} */ ({ ...settlement, powerStructure: { ...ps, publicLegitimacy: { ...pl, score: nextScore } } }),
    });
  }
  return next;
}

/**
 * Apply prosperity BAND-STEP deltas on the canonical PROSPERITY_TIERS ladder (the
 * generosityKernel A2 idiom): clamp [0,6], write back IN KIND (string label / {tier}
 * object). Skips a settlement with no readable band. Pure.
 * @param {UpUpdate[]} updates @param {Map<string, number>} updateIndex @param {Map<string, number>} prosperityDeltas
 * @returns {UpUpdate[]}
 */
function applyProsperityDeltasToUpdates(updates, updateIndex, prosperityDeltas) {
  let next = updates;
  let cloned = false;
  const maxRank = Math.max(1, PROSPERITY_TIERS.length - 1);
  for (const [id, delta] of prosperityDeltas) {
    if (!delta) continue;
    const ui = updateIndex.get(String(id));
    if (ui === undefined) continue;
    const entry = next[ui];
    const settlement = entry?.settlement;
    const ec = asObject(settlement?.economicState);
    const cur = ec.prosperity;
    const rank = prosperityRank(/** @type {Parameters<typeof prosperityRank>[0]} */ (cur));
    if (rank < 0) continue;
    const nextRank = Math.round(Math.max(0, Math.min(maxRank, rank + delta)));
    if (nextRank === rank) continue;
    const nextLabel = PROSPERITY_TIERS[nextRank];
    const nextProsperity = cur && typeof cur === 'object' && !Array.isArray(cur)
      ? { .../** @type {Record<string, unknown>} */ (cur), tier: nextLabel } : nextLabel;
    if (!cloned) { next = updates.slice(); cloned = true; }
    next[ui] = /** @type {UpUpdate} */ ({
      ...entry,
      settlement: /** @type {UpSettlement} */ ({ ...settlement, economicState: { ...ec, prosperity: nextProsperity } }),
    });
  }
  return next;
}

/** The boom-enter news (house voice, AGGREGATE). @param {string} id @param {string} name
 *  @param {string[]} arteries @param {boolean} fragile @param {number} tick @param {string|null} now */
function boomNews(id, name, arteries, fragile, tick, now) {
  const dep = fragile ? ' Its wealth rides on a single artery — a fragile prosperity.' : '';
  return {
    id: `wizard_news.${tick}.boom.${id}`,
    tick, createdAt: now, scope: 'regional', significance: 'moderate', severity: 0.4, score: 60,
    headline: `${name} is booming`,
    summary: `Brisk and sustained trade has tipped ${name} into a boom — markets swell and coin flows.${dep}`,
    kind: 'applied', impactKind: 'boom', channelType: 'trade_route',
    settlementIds: [id], impactIds: [], channelIds: [],
    sourceEventId: `boom.${id}.${tick}`,
    tags: ['world_pulse', 'upswing', 'boom'],
    reasons: [`The boom is fed by ${arteries.length} trade artery${arteries.length === 1 ? '' : 's'} — a composition the trade movers already built.`],
  };
}

/** The bust news (house voice, AGGREGATE) — NAMES the severed artery. @param {string} id
 *  @param {string} name @param {string[]} arteries @param {boolean} embattled @param {number} tick @param {string|null} now */
function bustNews(id, name, arteries, embattled, tick, now) {
  const cause = embattled ? 'the roads to it have turned dangerous' : `the ${arteries[0] || 'trade'} artery has failed`;
  return {
    id: `wizard_news.${tick}.bust.${id}`,
    tick, createdAt: now, scope: 'regional', significance: 'major', severity: 0.6, score: 70,
    headline: `${name}'s boom has busted`,
    summary: `The trade that made ${name} rich has collapsed — ${cause}, and the boom curdles into flight and empty stalls.`,
    kind: 'applied', impactKind: 'bust', channelType: 'trade_route',
    settlementIds: [id], impactIds: [], channelIds: [],
    sourceEventId: `bust.${id}.${tick}`,
    tags: ['world_pulse', 'upswing', 'bust'],
    reasons: [`The boom's own dependency concentration was its undoing${arteries[0] ? ` — the ${arteries[0]} artery` : ''}.`],
  };
}

/** The flourishing (golden-age) chronicle beat. @param {string} id @param {string} name
 *  @param {string|null} founded @param {number} tick @param {string|null} now */
function flourishingNews(id, name, founded, tick, now) {
  const built = founded ? ` A new ${founded} opens its doors — the founding bias of a fertile peace.` : '';
  return {
    id: `wizard_news.${tick}.flourishing.${id}`,
    tick, createdAt: now, scope: 'regional', significance: 'moderate', severity: 0.3, score: 55,
    headline: `${name} enters a golden age`,
    summary: `A long peace and steady rule have made ${name} culturally fertile — tolerance broadens and the temples keep warm.${built}`,
    kind: 'applied', impactKind: 'flourishing', channelType: 'settlement',
    settlementIds: [id], impactIds: [], channelIds: [],
    sourceEventId: `flourishing.${id}.${tick}`,
    tags: ['world_pulse', 'upswing', 'flourishing', 'boom_flourishing'],
    reasons: ['A bounded cultural attractor — no army, no treasury swell, only the fertility of a long peace.'],
  };
}
