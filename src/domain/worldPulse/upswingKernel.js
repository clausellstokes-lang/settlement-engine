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
import { famineFor } from './foodStockpile.js';
import { foldObligations } from '../spatial/generosityReactions.js';
import { withCampaignHistoryEvent } from './stressorAftermath.js';
import { promotesTo } from './calamityKernel.js';
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
});

// ── Reads (all pure over the settlement) ──────────────────────────────────────
/** prosperity 0..1 on the canonical ladder (unknown ⇒ mid). @param {UpSettlement|undefined} s */
function prosperity01Of(s) {
  const rank = prosperityRank(/** @type {Parameters<typeof prosperityRank>[0]} */ (asObject(s?.economicState).prosperity));
  if (rank < 0) return 0.4;
  return clamp01(rank / Math.max(1, PROSPERITY_TIERS.length - 1));
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

/** Is the settlement currently at PEACE (no live war front into/from it)? 1 peace, 0 war.
 *  @param {UpGraph|null|undefined} graph @param {string} id */
function peace01Of(graph, id) {
  const into = warFrontsInto(graph, id) || [];
  const from = warFrontsFrom(graph, id) || [];
  return into.length === 0 && from.length === 0 ? 1 : 0;
}

/** A NEW shock this tick (a fresh calamity within the arc, a live famine, or a war
 *  front) — the reconstruction regressor. @param {UpSettlement|undefined} s
 *  @param {UpGraph|null|undefined} graph @param {string} id @param {unknown[]} stressors
 *  @param {number} startedYear @param {number} year */
function hasNewShock(s, graph, id, stressors, startedYear, year) {
  if (peace01Of(graph, id) === 0) return true; // a war front reopened
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
  /** @param {string} id @returns {UpSettlement|undefined} freshest (update ▸ snapshot) */
  const freshSettlement = (id) => {
    const ui = updateIndex.get(String(id));
    if (ui !== undefined) return updates[ui]?.settlement;
    return itemById.get(String(id))?.settlement;
  };

  const upswingLedger = asObject(getSpatialLedger(worldState, 'upswing'));
  const reconLedger = asObject(upswingLedger.reconstruction);
  const obligations = readObligations(/** @type {Record<string,unknown>|null} */ (getSpatialLedger(worldState, 'obligations')));

  let nextUpdates = updates;
  let cloned = false;
  const ensureCloned = () => { if (!cloned) { nextUpdates = updates.slice(); cloned = true; } };
  /** @type {Record<string, ReconRecord>} */
  const nextRecon = {};
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
    const peace01 = peace01Of(graph, id);
    const allyDebt = strongestAllyDebt(obligations, id);
    const ally01 = allyDebt ? allyDebt.magnitude : 0;

    const startedTick = prior ? prior.startedTick : tick;
    const startedYear = prior ? prior.startedYear : year;
    const shock = hasNewShock(s, graph, id, stressors, startedYear, year);

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

  // ── PERSIST (drop-when-empty). Nothing arced ⇒ byte-identical. ──
  let nextWorldState = worldState;
  let changed = cloned;

  // The upswing ledger (reconstruction sub-map). Drop the whole 'upswing' key when empty.
  const reconChanged = JSON.stringify(sortedRecord(nextRecon)) !== JSON.stringify(sortedRecord(reconLedger));
  if (reconChanged) {
    const hasRecon = Object.keys(nextRecon).length > 0;
    // Preserve any OTHER upswing sub-ledgers (boom/flourishing land in later stages).
    const others = { ...upswingLedger };
    delete others.reconstruction;
    const nextUpswing = hasRecon ? { ...others, reconstruction: sortedRecord(nextRecon) } : others;
    if (Object.keys(nextUpswing).length > 0) {
      nextWorldState = setSpatialLedger(nextWorldState, 'upswing', nextUpswing);
    } else {
      nextWorldState = dropSpatialLedger(nextWorldState, 'upswing');
    }
    changed = true;
  }

  // Mature consumed ally obligations (the conservation debit) into the obligations ledger.
  if (obligationRepayments.length) {
    const prevObl = /** @type {Record<string, unknown>|null} */ (getSpatialLedger(worldState, 'obligations'));
    const nextObl = foldObligations(prevObl, { mints: [], repayments: obligationRepayments, now: tick });
    if (JSON.stringify(nextObl || null) !== JSON.stringify(prevObl || null)) {
      nextWorldState = nextObl
        ? setSpatialLedger(nextWorldState, 'obligations', nextObl)
        : dropSpatialLedger(nextWorldState, 'obligations');
      changed = true;
    }
  }

  // Apply the legitimacy dividends via the bounded delta path.
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
