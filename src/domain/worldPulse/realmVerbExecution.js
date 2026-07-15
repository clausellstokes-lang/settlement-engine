/**
 * domain/worldPulse/realmVerbExecution.js — THE REALM VERB LIVE PATH
 * (W-COMPOSER-2 Stage 2; Composer V2 §6 "zero new apply paths").
 *
 * Two halves of one lane:
 *   • buildRealmVerbOutcome — the PURE mint builder: verb + dial args →
 *     a proposal-mode outcome (applyMode:'proposal', proposalPayload
 *     { kind:'realm_verb_order', verb, args }). applyWorldPulse routes it
 *     through the EXACT sim proposal-mint path (upsert + news), so a DM-minted
 *     realm proposal is record-identical to a sim-minted one.
 *   • applyRealmVerbOrder — the apply ARM dispatcher applyWorldPulseOutcomes
 *     calls when an APPROVED realm_verb_order outcome reaches apply. Every arm
 *     resolves through its wave's OWN kernel function (force ≡ organic) and
 *     re-runs the verb's own gates against the CURRENT worldState — a lapsed
 *     order REFUSES VISIBLY (a typed refusal + a news entry), it never
 *     phantom-commits (the §10 queue-mouth law, realm edition).
 *
 * DETERMINISM: the strike/mint verbs that need randomness fork a PRNG off the
 * campaign's own rngSeed keyed on (verb, target, tick) — replay-identical,
 * never wall-clock. ENGINE CHUNK (lazy): imported only by applyWorldPulse.js
 * and tests — zero first-paint bytes.
 */

import { clamp01 } from '../../kernel/math.js';

/** The schema-owned loose record alias (the affordanceManifest Mut idiom):
 * every any-hole here would otherwise re-count what settlement.schema.js
 * already owns — the events layer's "schemaless open objects" read shape.
 * @typedef {NonNullable<import('../settlement.schema.js').SimSettlement['config']>} Mut */
import { createPRNG } from '../../kernel/prng.js';
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger, isPort, activeSpatialDigest } from '../spatial/distanceRead.js';
import { planConvoy, planBlockade } from '../spatial/navalLayer.js';
import { migrationActive } from '../spatial/migration.js';
import { declareCasus } from './warReasons.js';
import { sueForPeaceOrder } from './peaceReasons.js';
import { orderSupplyRaid, declareTradeEmbargo } from './supplyWebWarfare.js';
import {
  interventionActive, liveCoupContests, INTERVENTION_SIDES,
  patronStrength01Of, mercenaryReinforcementOf,
} from './convergence.js';
import { navalActive, blockadeNews } from './navalKernel.js';
import { navalStrengthOf } from './navalStrength.js';
import { seasonForTick } from './worldState.js';
import {
  momentumActive, commitmentStockOf, commitmentLedgerKey, entityThreshold, pastCliff,
  climbDownConsequence, climbDownNews, applyLegitimacyHits, MOMENTUM_TUNING,
} from './momentum.js';
import { advanceCredibility } from './informationStatecraft.js';
import { forceCalamityStrike, buildExodusOutcome, applyExodusToUpdates } from './calamityKernel.js';
import { collectRealizedEmigrationEvents, dispatchMigrations } from './migrationKernel.js';
import { settlementLifecycleActive, forceFoundSteading, satellitesOf } from './settlementLifecycleKernel.js';
import { forceAbandonSettlement, forceResettleSettlement } from './settlementLifecycleFirstClass.js';
import { calamityEnabled } from '../spatial/calamity.js';
import { realmVerbFor, realmVetoProse } from '../events/realmManifest.js';

/** The one payload kind the applier dispatches on (the siege_initiation idiom). */
export const REALM_VERB_PAYLOAD_KIND = 'realm_verb_order';

/** @param {unknown} v @param {number} f */
function num(v, f) { return typeof v === 'number' && Number.isFinite(v) ? v : f; }
/** @param {number} v */
function round4(v) { return Math.round(v * 10000) / 10000; }
/** @param {unknown} v @returns {Mut} */
function asObject(v) { return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Mut} */ (v) : {}; }
/** @param {string} a @param {string} b */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/** Snapshot shim: guarantee a byId Map over the snapshot's settlements items
 * (the proposal-apply snapshot carries settlements[] but no byId).
 * @param {Mut} snapshot @returns {Mut} */
export function withById(snapshot) {
  const snap = asObject(snapshot);
  if (snap.byId && typeof snap.byId.get === 'function') return snap;
  const byId = new Map((Array.isArray(snap.settlements) ? snap.settlements : []).map(
    (/** @type {Mut} */ i) => [String(i?.id ?? ''), i]));
  return { ...snap, byId };
}

const nameOf = (/** @type {Mut} */ snapshot, /** @type {unknown} */ id) => {
  const item = withById(snapshot).byId.get(String(id));
  return String(item?.name || item?.settlement?.name || id);
};

// ── The mint builder (pure) ───────────────────────────────────────────────────
/** Which arg names the ACTING settlement, per verb (targetSaveId + the
 * pendingActorMajorFor dedup key — the M10a "acting settlement" convention). */
const ACTOR_ARG = Object.freeze({
  DECLARE_CASUS: 'fromId', SUE_FOR_PEACE: 'partyId',
  ORDER_SUPPLY_RAID: 'aggressorId', DECLARE_TRADE_EMBARGO: 'aggressorId',
  ORDER_INTERVENTION: 'patronId', ORDER_CONVOY: 'ownerId', DECLARE_BLOCKADE: 'ownerId',
  FORCE_RECONSIDERATION: 'targetId', FORCE_CALAMITY: 'targetId',
  FORCE_FOUND_STEADING: 'parentId', FORCE_ABANDON: 'targetId', FORCE_RESETTLE: 'targetId',
});

/** One-line DM-facing headline per verb (the proposal panel's card).
 * @param {string} verb @param {Mut} args @param {Mut} snapshot */
function headlineFor(verb, args, snapshot) {
  const n = (/** @type {unknown} */ id) => nameOf(snapshot, id);
  switch (verb) {
    case 'DECLARE_CASUS': return `${n(args.fromId)} declares a reason for war against ${n(args.toId)}`;
    case 'SUE_FOR_PEACE': return `${n(args.partyId)} sues for peace`;
    case 'ORDER_SUPPLY_RAID': return `${n(args.aggressorId)} opens a supply-web campaign against ${n(args.targetId)}`;
    case 'DECLARE_TRADE_EMBARGO': return `${n(args.aggressorId)} declares a trade embargo on ${n(args.targetId)}`;
    case 'ORDER_INTERVENTION': return `${n(args.patronId)} commits an army to the contest at ${n(args.targetId)}`;
    case 'ORDER_CONVOY': return `${n(args.ownerId)}'s fleet is ordered to convoy its army to ${n(args.destId)}`;
    case 'DECLARE_BLOCKADE': return `${n(args.ownerId)}'s fleet is ordered across ${n(args.targetId)}'s sea approaches`;
    case 'FORCE_RECONSIDERATION': return `${n(args.targetId)} is pressed to reconsider its course`;
    case 'FORCE_CALAMITY': return `Calamity is ordered upon ${n(args.targetId)}`;
    case 'FORCE_FOUND_STEADING': return `${n(args.parentId)} is ordered to found a steading`;
    case 'FORCE_ABANDON': return `${n(args.targetId)} is ordered abandoned`;
    case 'FORCE_RESETTLE': return `The remnant of ${n(args.targetId)} is ordered resettled`;
    default: return `A realm order: ${verb}`;
  }
}

/**
 * Build the proposal-mode outcome for a realm verb order (PURE). Derivable
 * mint-time facts (intervention strength via the mover's own reads) are folded
 * into args so apply is deterministic. Refuses unknown/deferred verbs.
 * @param {{ verb: string, args: Mut, worldState: Mut,
 *   snapshot: Mut, tick: number }} input
 * @returns {{ ok: true, predicate: { available: boolean, reasons: string[], unlocks: string[] }, outcome: Mut }
 *         | { ok: false, code: string, prose: string }}
 */
export function buildRealmVerbOutcome({ verb, args, worldState, snapshot, tick }) {
  const entry = realmVerbFor(verb);
  if (!entry) return { ok: false, code: 'verb_unknown', prose: `No realm verb "${verb}" is registered.` };
  if (entry.lane !== 'proposal') {
    return { ok: false, code: 'verb_deferred', prose: realmVetoProse(entry.coversVetoCodes[0] || 'verb_deferred') };
  }
  const a = { ...asObject(args) };
  const nowTick = Math.max(0, Math.floor(num(tick, 0)));
  // Mint-time derivations (the mover's own reads — same-function law).
  if (verb === 'ORDER_INTERVENTION') {
    const shim = withById(snapshot);
    const patron = String(a.patronId ?? '');
    const p01 = patronStrength01Of(/** @type {Mut} */ (shim), patron);
    const merc = mercenaryReinforcementOf(/** @type {Mut} */ (shim), patron);
    a.side = a.side === INTERVENTION_SIDES.CHALLENGER ? INTERVENTION_SIDES.CHALLENGER : INTERVENTION_SIDES.INCUMBENT;
    a.invited = a.invited === true;
    a.strength = round4(Math.max(1, num(a.strength, Math.max(1, p01 * 100) * (1 + merc.factor))));
    a.motive = String(a.motive || 'dm_order');
  }
  const actorId = String(a[/** @type {Record<string, string>} */ (ACTOR_ARG)[verb]] ?? a.targetId ?? '');
  // The manifest predicate verdict, surfaced for the mint's bounded-by-
  // construction gate (LAW 1). Total: never throws on a dark world.
  const predicate = entry.predicate(worldState, { settlements: asObject(snapshot).settlements || [], tick: nowTick });
  return {
    ok: true,
    predicate,
    outcome: {
      id: `realm_verb.${verb}.${actorId}.${nowTick}`,
      candidateType: String(entry.candidateType),
      type: 'realm_verb',
      targetSaveId: actorId,
      headline: headlineFor(verb, a, snapshot),
      summary: `A realm order staged from the composer: ${String(entry.label).toLowerCase()}. It applies on approval; the world's own walls still hold.`,
      severity: entry.candidateType === 'intervention_ordered' || entry.candidateType === 'blockade_declared'
        || entry.candidateType === 'settlement_terminal_death' ? 0.7 : 0.5,
      reasons: ['Ordered from the realm composer (DM provenance).'],
      applyMode: 'proposal',
      forced: true,
      provenance: 'dm',
      proposalPayload: { kind: REALM_VERB_PAYLOAD_KIND, verb, args: a },
    },
  };
}

// ── Refusal + small news builders ────────────────────────────────────────────
/** @param {string} code @param {string} [detail] */
const refuse = (code, detail = '') => ({ code, detail });

/** The visible refusal entry (the §10 law: refused VISIBLY, never dropped).
 * @param {string} verb @param {{ code: string, detail: string }} r @param {number} tick @param {string|null} now */
export function realmRefusalNews(verb, r, tick, now) {
  return {
    id: `realm_verb_refused.${verb}.${tick}.${r.code}`,
    tick, scope: 'regional', significance: 'notable', score: 55,
    headline: `An order was refused: ${String(verb).replace(/_/g, ' ').toLowerCase()}`,
    summary: realmVetoProse(r.code, r.detail),
    kind: 'refused', impactKind: 'realm_verb_refused',
    channelType: null, severity: 0.3,
    settlementIds: [], impactIds: [], channelIds: [],
    sourceEventId: `realm_verb_refused.${verb}.${tick}`,
    tags: ['world_pulse', 'realm_verb', 'refused'],
    reasons: [realmVetoProse(r.code, r.detail)],
    createdAt: now,
  };
}

/** A small applied-order news entry for the worldState-mutation verbs.
 * @param {string} verb @param {string} headline @param {string} summary
 * @param {string[]} ids @param {number} tick @param {string|null} now */
function orderNews(verb, headline, summary, ids, tick, now) {
  return {
    id: `realm_verb.${verb}.${ids.join('.')}.${tick}`,
    tick, scope: 'regional', significance: 'notable', score: 60,
    headline, summary, kind: 'applied', impactKind: `realm_verb_${verb.toLowerCase()}`,
    channelType: null, severity: 0.5,
    settlementIds: ids, impactIds: [], channelIds: [],
    sourceEventId: `realm_verb.${verb}.${ids.join('.')}.${tick}`,
    tags: ['world_pulse', 'realm_verb'],
    reasons: ['Applied by DM order through the world\'s own machinery.'],
    createdAt: now,
  };
}

// ── The arm dispatcher ────────────────────────────────────────────────────────
/**
 * Apply an APPROVED realm_verb_order outcome against the CURRENT world.
 * Called from applyWorldPulseOutcomes' per-outcome loop (the siege_initiation
 * slot). Returns the (possibly) new worldState, news, an optional refusal
 * (already rendered VISIBLY as news), an optional substitute outcome (the
 * lifecycle pair — the organic outcome falls through the organic apply), and
 * optional per-save settlement patches (calamity/steading/reconsideration).
 * @param {Object} io
 * @param {Mut} io.state @param {Mut} io.snapshot
 * @param {Map<string, Mut>} io.settlementUpdates @param {Mut} io.outcome
 * @param {number} io.tick @param {string|null} io.now
 * @returns {{ worldState: Mut, newsEntries: Mut[],
 *   refusal: { code: string, detail: string } | null,
 *   substituteOutcome?: Mut | null,
 *   settlementPatches?: Map<string, Mut> | null }}
 */
export function applyRealmVerbOrder({ state, snapshot, settlementUpdates, outcome, tick, now }) {
  const pay = asObject(outcome.proposalPayload);
  const verb = String(pay.verb || '');
  const args = asObject(pay.args);
  const nowTick = Math.max(0, Math.floor(num(tick, 0)));
  const shim = withById(snapshot);
  /** The arm result shape (the dispatcher's own contract).
   * @typedef {{ worldState: Mut, newsEntries: Mut[], refusal: { code: string, detail: string } | null,
   *   substituteOutcome?: Mut | null, settlementPatches?: Map<string, Mut> | null }} ArmResult */
  /** @type {(r: { code: string, detail: string }) => ArmResult} */
  const refused = (r) => ({ worldState: state, newsEntries: [realmRefusalNews(verb, r, nowTick, now)], refusal: r });
  /** @type {(ws: Mut, news: Mut[], patches?: Map<string, Mut> | null, substitute?: Mut | null) => ArmResult} */
  const applied = (ws, news, patches = null, substitute = null) =>
    ({ worldState: ws, newsEntries: news, refusal: null, settlementPatches: patches, substituteOutcome: substitute });

  switch (verb) {
    // ── The decree four (pure gated worldState mutations — verbatim) ─────
    case 'DECLARE_CASUS': {
      const r = declareCasus(state, {
        fromId: args.fromId, toId: args.toId, type: String(args.type || ''),
        severity01: num(args.severity01, 0.6), receipt: String(args.receipt || ''), tick: nowTick,
      });
      if (r.ok !== true) return refused(refuse(r.code, r.detail));
      return applied(r.worldState, [orderNews(verb,
        headlineFor(verb, args, shim),
        `A typed grievance (${String(args.type)}) now stands on the ledger — the war layer weighs it as it weighs the world's own.`,
        [String(args.fromId), String(args.toId)], nowTick, now)]);
    }
    case 'SUE_FOR_PEACE': {
      const partyId = String(args.partyId ?? '');
      const foeId = args.foeId != null ? String(args.foeId)
        : String(asObject(asObject(state.deployments)[partyId]).targetId ?? '');
      const r = sueForPeaceOrder(state, { partyId, foeId, tick: nowTick });
      if (r.ok !== true) return refused(refuse(r.code, r.detail));
      return applied(r.worldState, [orderNews(verb,
        headlineFor(verb, args, shim),
        `${nameOf(shim, partyId)}'s army is ordered home — the recall resolves through the standing withdrawal next tick.`,
        [partyId, foeId].filter(Boolean), nowTick, now)]);
    }
    case 'ORDER_SUPPLY_RAID':
    case 'DECLARE_TRADE_EMBARGO': {
      const fn = verb === 'ORDER_SUPPLY_RAID' ? orderSupplyRaid : declareTradeEmbargo;
      const r = fn(state, {
        aggressorId: args.aggressorId, targetId: args.targetId,
        snapshot: /** @type {Mut} */ (shim), digest: activeSpatialDigest(state), tick: nowTick,
      });
      if (r.ok !== true) return refused(refuse(r.code, r.detail));
      return applied(r.worldState, [orderNews(verb,
        headlineFor(verb, args, shim),
        verb === 'ORDER_SUPPLY_RAID'
          ? 'The indirect campaign is planned — the supply web, not the walls, takes the blow.'
          : 'The embargo rides the target\'s cheapest supply artery — a bloodless single stage.',
        [String(args.aggressorId), String(args.targetId)], nowTick, now)]);
    }

    // ── ORDER_INTERVENTION (the re-mint arm — the convergence deferral closed) ─
    case 'ORDER_INTERVENTION': {
      if (!interventionActive(state)) return refused(refuse('intervention_gate_dark'));
      const patron = String(args.patronId ?? '');
      const target = String(args.targetId ?? '');
      const contests = liveCoupContests(state, /** @type {Mut} */ (shim));
      if (!contests.some(c => c.targetId === target)) return refused(refuse('intervention_no_contest', nameOf(shim, target)));
      if (asObject(state.deployments)[patron]) return refused(refuse('intervention_busy', nameOf(shim, patron)));
      const ledger = asObject(getSpatialLedger(state, 'interventions'));
      const key = `${patron}:${target}`;
      if (ledger[key]) return refused(refuse('intervention_already', nameOf(shim, patron)));
      // The record the mover writes, verbatim shape (strength derived at mint).
      const record = {
        interId: patron, target,
        side: args.side === INTERVENTION_SIDES.CHALLENGER ? INTERVENTION_SIDES.CHALLENGER : INTERVENTION_SIDES.INCUMBENT,
        motive: String(args.motive || 'dm_order'), invited: args.invited === true,
        strength: round4(Math.max(1, num(args.strength, 50))),
        sinceTick: nowTick, lastTick: nowTick,
      };
      const next = { ...ledger, [key]: record };
      /** @type {Mut} */
      const ordered = {};
      for (const k of Object.keys(next).sort(codepoint)) ordered[k] = next[k];
      return applied(setSpatialLedger(state, 'interventions', ordered), [orderNews(verb,
        headlineFor(verb, args, shim),
        `${nameOf(shim, patron)} backs the ${record.side} at ${nameOf(shim, target)} — the column joins the contest and the verdict tilts with it.`,
        [patron, target], nowTick, now)]);
    }

    // ── The naval pair ────────────────────────────────────────────────────
    case 'ORDER_CONVOY': {
      if (!navalActive(state)) return refused(refuse('convoy_gate_dark'));
      const digest = activeSpatialDigest(state);
      if (!digest) return refused(refuse('convoy_gate_dark'));
      const ownerId = String(args.ownerId ?? '');
      const destId = String(args.destId ?? '');
      if (!isPort(digest, ownerId) || !isPort(digest, destId)) {
        return refused(refuse('convoy_not_ports', `${nameOf(shim, ownerId)} / ${nameOf(shim, destId)}`));
      }
      const dep = asObject(asObject(state.deployments)[ownerId]);
      if (dep.targetId == null || dep.recalled) return refused(refuse('convoy_no_deployment', nameOf(shim, ownerId)));
      const records = asObject(getSpatialLedger(state, 'navalTransit'));
      if (records[ownerId]) return refused(refuse('convoy_refused', 'the fleet is already at sea'));
      const navStrength = navalStrengthOf(digest, /** @type {Mut} */ (shim).byId.get(ownerId), ownerId);
      if (navStrength <= 0) return refused(refuse('convoy_refused', 'no war navy to escort the crossing'));
      const plan = planConvoy(digest, state, {
        ownerId, cargoId: ownerId, destId,
        ownerStrength: navStrength, cargoStrength: Math.max(0, num(dep.currentEffectiveStrength, 0)),
        readiness01: clamp01(num(dep.readiness, 0.5)), departTick: nowTick, season: null, activeRecords: records,
      });
      if (!plan || !('record' in plan)) {
        return refused(refuse('convoy_refused', plan && 'deferred' in plan ? 'the sea lane is at capacity' : 'no sea route'));
      }
      return applied(setSpatialLedger(state, 'navalTransit', { ...records, [ownerId]: plan.record }), [orderNews(verb,
        headlineFor(verb, args, shim),
        `${nameOf(shim, ownerId)}'s war fleet takes its army aboard for ${nameOf(shim, destId)} — the crossing carries the sea's own risks.`,
        [ownerId, destId], nowTick, now)]);
    }
    case 'DECLARE_BLOCKADE': {
      if (!navalActive(state)) return refused(refuse('blockade_gate_dark'));
      const digest = activeSpatialDigest(state);
      if (!digest) return refused(refuse('blockade_gate_dark'));
      const ownerId = String(args.ownerId ?? '');
      const targetId = String(args.targetId ?? '');
      if (!isPort(digest, ownerId) || !isPort(digest, targetId)) {
        return refused(refuse('blockade_not_ports', `${nameOf(shim, ownerId)} / ${nameOf(shim, targetId)}`));
      }
      const records = asObject(getSpatialLedger(state, 'navalTransit'));
      if (records[ownerId]) return refused(refuse('blockade_refused', 'the fleet is already at sea'));
      const navStrength = num(args.ownerStrength, navalStrengthOf(digest, /** @type {Mut} */ (shim).byId.get(ownerId), ownerId));
      if (navStrength <= 0) return refused(refuse('blockade_no_navy', nameOf(shim, ownerId)));
      const plan = planBlockade(digest, state, { ownerId, targetId, ownerStrength: navStrength, departTick: nowTick, season: null });
      if (!plan || !('record' in plan)) return refused(refuse('blockade_refused', 'no reachable sea route'));
      const withRecord = setSpatialLedger(state, 'navalTransit', { ...records, [ownerId]: plan.record });
      // The mover's own news builder (force ≡ organic down to the entry shape).
      return applied(withRecord, [blockadeNews({ ownerId, targetId }, /** @type {Mut} */ (shim), nowTick, now)]);
    }

    // ── FORCE_RECONSIDERATION (the priced crack, delivered by the DM) ─────
    case 'FORCE_RECONSIDERATION': {
      if (!momentumActive(state)) return refused(refuse('reconsideration_gate_dark'));
      const actorId = String(args.targetId ?? '');
      const courseKey = String(args.courseKey ?? '');
      const key = commitmentLedgerKey(actorId, courseKey);
      const stock = commitmentStockOf(state, actorId, courseKey, nowTick);
      if (!key || stock <= 0) return refused(refuse('reconsideration_no_course', nameOf(shim, actorId)));
      const th = entityThreshold(/** @type {Mut} */ (shim).byId.get(actorId), /** @type {Mut} */ (state));
      const pressure01 = clamp01(num(args.pressure01, 0.6));
      const withdrawal = pressure01 * Math.max(1e-6, th.cliff);
      const remaining = stock - withdrawal;
      const ledger = asObject(getSpatialLedger(state, 'commitments'));
      /** @type {Mut[]} */
      const news = [];
      if (remaining > 0) {
        // The voice of reason: a withdrawal against the stock (the same entry
        // shape the fold writes; decay re-anchors at this tick).
        const cur = asObject(ledger[key]);
        const deposits = [...(Array.isArray(cur.deposits) ? cur.deposits : []),
          { tick: nowTick, kind: 'dm_reconsideration', mag: round4(-withdrawal) }].slice(-MOMENTUM_TUNING.RECEIPT_CAP);
        const withdrawn = setSpatialLedger(state, 'commitments', {
          ...ledger,
          [key]: { ...cur, stock: round4(remaining), lastDepositTick: nowTick, deposits },
        });
        news.push(orderNews(verb, `${nameOf(shim, actorId)} is pressed toward reconsideration`,
          `Counsel and pressure eat at the court's committed course (${courseKey}) — the commitment thins, though the course holds for now.`,
          [actorId], nowTick, now));
        return applied(withdrawn, news);
      }
      /** @type {Mut} */
      let ws;
      // THE FINAL PUSH: the course cracks NOW. Spend the stock, execute the
      // physical wind-down through the standing contracts, and — when the court
      // stood PAST ITS CLIFF — land the SAME priced climb-down the counterforces
      // reach (climbDownConsequence + advanceCredibility + the legitimacy hit).
      const nextLedger = { ...ledger };
      delete nextLedger[key];
      ws = Object.keys(nextLedger).length
        ? setSpatialLedger(state, 'commitments', nextLedger)
        : dropSpatialLedger(state, 'commitments');
      const colon = courseKey.indexOf(':');
      const kind = colon > 0 ? courseKey.slice(0, colon) : courseKey;
      const rest = colon > 0 ? courseKey.slice(colon + 1) : '';
      const target = kind === 'contest' ? rest.split('|')[0] : rest;
      if (kind === 'war') {
        const deployments = asObject(ws.deployments);
        const dep = asObject(deployments[actorId]);
        if (dep.targetId != null && String(dep.targetId) === target && !dep.recalled) {
          ws = { ...ws, deployments: { ...deployments, [actorId]: { ...dep, recalled: { cause: 'sue_for_peace_decree', tick: nowTick } } } };
        }
      } else if (kind === 'blockade') {
        const records = asObject(getSpatialLedger(ws, 'navalTransit'));
        const rec = asObject(records[actorId]);
        if (rec.role === 'blockade' && String(rec.targetId ?? '') === target) {
          const nextRecords = { ...records };
          delete nextRecords[actorId];
          ws = Object.keys(nextRecords).length
            ? setSpatialLedger(ws, 'navalTransit', nextRecords)
            : dropSpatialLedger(ws, 'navalTransit');
        }
      } else if (kind === 'campaign') {
        const plans = asObject(getSpatialLedger(ws, 'campaignPlans'));
        if (plans[actorId] && String(asObject(plans[actorId]).targetId ?? '') === target) {
          const nextPlans = { ...plans };
          delete nextPlans[actorId];
          ws = Object.keys(nextPlans).length
            ? setSpatialLedger(ws, 'campaignPlans', nextPlans)
            : dropSpatialLedger(ws, 'campaignPlans');
        }
      } else if (kind === 'contest') {
        const inter = asObject(getSpatialLedger(ws, 'interventions'));
        const ikey = `${actorId}:${target}`;
        if (inter[ikey]) {
          const nextInter = { ...inter };
          delete nextInter[ikey];
          ws = Object.keys(nextInter).length
            ? setSpatialLedger(ws, 'interventions', nextInter)
            : dropSpatialLedger(ws, 'interventions');
        }
      }
      /** @type {Map<string, Mut> | null} */
      let patches = null;
      if (pastCliff(stock, th.cliff)) {
        const crack = climbDownConsequence({ actorId, lawfulness01: th.lawfulness01, exitKind: '' });
        const cred = advanceCredibility({ worldState: /** @type {Mut} */ (ws), tick: nowTick, deltas: [crack.credibilityDelta] });
        if (cred.changed) ws = /** @type {Mut} */ (cred.worldState);
        const entry = settlementUpdates.get(actorId);
        if (entry && crack.legitimacyHit > 0) {
          const patched = applyLegitimacyHits(
            [{ saveId: actorId, settlement: entry.settlement }], new Map([[actorId, -crack.legitimacyHit]]));
          patches = new Map([[actorId, /** @type {Mut} */ (patched[0].settlement)]]);
        }
        news.push(climbDownNews(actorId, target, (/** @type {string} */ id) => nameOf(shim, id), stock, th.cliff, crack, '', nowTick));
      } else {
        news.push(orderNews(verb, `${nameOf(shim, actorId)} reconsiders its course`,
          `The pressed court lets its course (${courseKey}) go — below its cliff, the reversal is felt but not priced.`,
          [actorId], nowTick, now));
      }
      return applied(ws, news, patches);
    }

    // ── FORCE_CALAMITY (the same strike resolver as the annual draw, exodus
    // threaded through the SAME buildExodusOutcome path the organic loop uses) ─
    case 'FORCE_CALAMITY': {
      if (!calamityEnabled(state.simulationRules)) return refused(refuse('calamity_gate_dark'));
      const targetId = String(args.targetId ?? '');
      const entry = settlementUpdates.get(targetId);
      if (!entry || !entry.settlement) return refused(refuse('calamity_gate_dark', targetId));
      const seed = `${String(state.rngSeed ?? 'realm')}:realm_verb:${nowTick}`;
      const forkFn = (/** @type {string} */ k) => createPRNG(`${seed}:${k}`);
      const year = seasonForTick(nowTick).year;
      const result = forceCalamityStrike({
        settlement: /** @type {Mut} */ (entry.settlement),
        item: /** @type {Mut} */ (shim).byId.get(targetId),
        id: targetId, year, tick: nowTick, forkFn,
        severity: args.severity != null ? String(args.severity) : null,
        flavorText: args.flavor != null && String(args.flavor).trim() ? String(args.flavor) : null,
      });
      let ws = state;
      /** @type {Map<string, Mut>} */
      const patches = new Map([[targetId, result.settlement]]);
      if (result.loss.exodus > 0) {
        const spatial = migrationActive(state);
        const exodusOutcome = buildExodusOutcome({
          id: targetId, exodus: result.loss.exodus, spatial,
          snapshot: /** @type {Mut} */ (shim), pIndex: null, tick: nowTick,
        });
        // Fold source debit + (aspatial) destination credits through the SAME
        // population writer advanceCalamity uses — over a working updates array
        // seeded from the strike patch + the live update entries.
        const affectedIds = [...new Set([targetId,
          ...(/** @type {Mut[]} */ (exodusOutcome.populationDeltas || [])).map((/** @type {Mut} */ d) => String(d.saveId))])];
        /** @type {Array<{ saveId: string, settlement: Mut }>} */
        const working = [];
        /** @type {Map<string, number>} */
        const workingIndex = new Map();
        for (const sid of affectedIds) {
          const s = patches.get(sid) || settlementUpdates.get(sid)?.settlement;
          if (!s) continue;
          workingIndex.set(sid, working.length);
          working.push({ saveId: sid, settlement: s });
        }
        const foldedUpdates = applyExodusToUpdates(
          /** @type {import('./calamityKernel.js').CalUpdate[]} */ (/** @type {unknown} */ (working)),
          workingIndex,
          /** @type {import('./calamityKernel.js').CalOutcome} */ (/** @type {unknown} */ (exodusOutcome)), targetId);
        for (const u of foldedUpdates) patches.set(String(u.saveId), /** @type {Mut} */ (/** @type {unknown} */ (u.settlement)));
        if (spatial) {
          // The realized-debit dispatch (conservation asserted inside).
          const events = collectRealizedEmigrationEvents([/** @type {Mut} */ (/** @type {unknown} */ (exodusOutcome))]);
          const migration = dispatchMigrations({
            events, snapshot: /** @type {Mut} */ (shim),
            pIndex: /** @type {import('./migrationKernel.js').PressureIndex} */ (/** @type {unknown} */ (null)),
            digest: activeSpatialDigest(state), worldState: ws,
            rng: createPRNG(`${seed}:exodus`), season: null, tick: nowTick,
          });
          if (migration.changed) ws = /** @type {Mut} */ (migration.worldState);
        }
      }
      return applied(ws, [orderNews(verb,
        `Calamity strikes ${nameOf(shim, targetId)}`,
        `The blow lands through the world's own strike path — ${result.loss.deaths} dead, ${result.loss.exodus} fled; the walls of the severity band held.`,
        [targetId], nowTick, now)], patches);
    }

    // ── FORCE_FOUND_STEADING (the ONE shared mint; the kernel's own fold) ──
    case 'FORCE_FOUND_STEADING': {
      if (!settlementLifecycleActive(state)) return refused(refuse('lifecycle_gate_dark'));
      const parentId = String(args.parentId ?? '');
      const entry = settlementUpdates.get(parentId);
      if (!entry || !entry.settlement) return refused(refuse('steading_refused', 'no such parent settlement'));
      const satLedger = asObject(getSpatialLedger(state, 'satellites'));
      // The kernel's own sats read (satellitesOf — sorted record array).
      const sats = satellitesOf(/** @type {Mut} */ (satLedger), parentId);
      const seed = `${String(state.rngSeed ?? 'realm')}:realm_verb:${nowTick}`;
      const forkFn = (/** @type {string} */ k) => createPRNG(`${seed}:${k}`);
      const minted = forceFoundSteading({
        parent: /** @type {Mut} */ (entry.settlement), parentId,
        sats: /** @type {import('./settlementLifecycleKernel.js').SatelliteRecord[]} */ (/** @type {unknown} */ (sats)), tick: nowTick, forkFn,
        name: args.name != null && String(args.name).trim() ? String(args.name) : null,
        resourceKey: args.resource != null && String(args.resource).trim() ? String(args.resource) : null,
      });
      if ('refusal' in minted) return refused(refuse('steading_refused', minted.refusal));
      // The kernel's ledger fold shape: entry { steadings: { [rec.id]: rec } }.
      const parentCell = asObject(satLedger[parentId]);
      const nextCell = {
        ...(Object.keys(parentCell).length ? parentCell : { steadings: {} }),
        steadings: { ...asObject(parentCell.steadings), [String(minted.record.id)]: minted.record },
        lastSeedTick: nowTick,
      };
      const ws = setSpatialLedger(state, 'satellites', { ...satLedger, [parentId]: nextCell });
      // The parent debit through the kernel's shiftPopulation contract:
      // population decrement + a receipted populationHistory entry.
      const parent = asObject(entry.settlement);
      const prevPop = Math.max(0, Math.round(num(Number(parent.population), 0)));
      const nextPop = Math.max(0, prevPop - minted.debit);
      const history = Array.isArray(parent.populationHistory) ? parent.populationHistory : [];
      const patches = new Map([[parentId, {
        ...parent,
        population: nextPop,
        populationHistory: [...history, {
          tick: nowTick, delta: nextPop - prevPop, population: nextPop,
          reason: `Families strike out to found the steading of ${String(minted.record.name)}.`,
          outcomeId: `lifecycle.found.${String(minted.record.id)}`,
        }],
      }]]);
      return applied(ws, [orderNews(verb,
        `${nameOf(shim, parentId)} founds ${String(minted.record.name)}`,
        `${minted.debit} settlers strike out under decree — the tier caps and headroom walls held, and the camp exists for what the land offers.`,
        [parentId], nowTick, now)], patches);
    }

    // ── The lifecycle pair: build the ORGANIC outcome, let it fall through ─
    case 'FORCE_ABANDON': {
      if (!settlementLifecycleActive(state)) return refused(refuse('lifecycle_gate_dark'));
      const targetId = String(args.targetId ?? '');
      const item = /** @type {Mut} */ (shim).byId.get(targetId);
      if (!item) return refused(refuse('abandon_refused', 'no such settlement'));
      const built = forceAbandonSettlement({
        item, snapshot: /** @type {Mut} */ (shim), pIndex: /** @type {Mut} */ (/** @type {unknown} */ (null)), tick: nowTick,
        spatialActive: migrationActive(state),
      });
      if ('refusal' in built) return refused(refuse('abandon_refused', String(/** @type {Mut} */ (built).refusal)));
      return applied(state, [], null, /** @type {Mut} */ (built));
    }
    case 'FORCE_RESETTLE': {
      if (!settlementLifecycleActive(state)) return refused(refuse('lifecycle_gate_dark'));
      const targetId = String(args.targetId ?? '');
      const item = /** @type {Mut} */ (shim).byId.get(targetId);
      if (!item) return refused(refuse('resettle_refused', 'no such settlement'));
      const donorPool = (Array.isArray(/** @type {Mut} */ (shim).settlements) ? /** @type {Mut} */ (shim).settlements : [])
        .filter((/** @type {Mut} */ i) => String(i?.id ?? '') !== targetId);
      const seed = `${String(state.rngSeed ?? 'realm')}:realm_verb`;
      const forkFn = (/** @type {string} */ k) => createPRNG(`${seed}:${k}`);
      const built = forceResettleSettlement({
        item, donorPool: /** @type {import('./settlementLifecycleFirstClass.js').LcSnapItem[]} */ (/** @type {unknown} */ (donorPool)), tick: nowTick, forkFn,
        name: args.name != null && String(args.name).trim() ? String(args.name) : null,
      });
      if ('refusal' in built) return refused(refuse('resettle_refused', String(/** @type {Mut} */ (built).refusal)));
      return applied(state, [], null, /** @type {Mut} */ (built));
    }

    default:
      return refused(refuse('verb_unknown', verb));
  }
}
