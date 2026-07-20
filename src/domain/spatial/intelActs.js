/**
 * intelActs.js — THE INTEL SELL/GIFT LANE (deep-couplings D-3), a dark lazy leaf.
 *
 * docs/DESIGN_DEEP_COUPLINGS.md §7. The parked SELL/GIFT primitives (generosityEV
 * warningSacrifice / intelSalePrice — the orphan formulas) get their bounded callers: an
 * ally may be GIFTED knowledge (a belief transfer, binding as an obligation of gratitude) or
 * a trade-partner may BUY it (the belief for a consideration in the favor economy). The
 * TRANSFER itself is a belief-injection performed by the statecraft mover next tick (the
 * pinned deposit-and-consume choreography, design law 5/14) — this leaf owns only the PURE
 * decision + pricing; generosityKernel owns the generosity-side ledger writes.
 *
 * DISTINCT from `allyIntelSharingEnabled` (beliefMap M9a/b): that is the AUTOMATIC, free,
 * per-tick ally belief-sharing pass. D-3 (`intelTradeEnabled`) is the BOUNDED, EVENT-
 * TRIGGERED, RARE, OBLIGATION-BEARING gift/sell twin — the favor economy of intelligence.
 * They compose; neither is the other.
 *
 * THE ANTI-HUM LAW (design §1 law 4 — "no whisper-war hum", the E1a precedent): NO
 * autonomous per-tick scanner. A transfer is evaluated ONLY on a TRIGGER (a fresh seller
 * belief a bonded/trade counterparty would value), gated by a per-pair COOLDOWN, a
 * TICK-INVARIANT per-(pair, year) loaded-dice ELIGIBILITY draw (collapsed catch-up must not
 * shift who trades — the seasonalSeverityFor world-seed pattern), and a per-tick hot cap.
 * Zero triggers ⇒ zero acts ⇒ byte-identical.
 *
 * Lazy leaf: imported only by the (lazy) generosity + statecraft movers ⇒ zero eager bytes.
 * Pure, deterministic, clock-free; no store/React import (the layerBoundaries law).
 */

import { createPRNG } from '../../kernel/prng.js';
import { clamp01 } from '../../kernel/math.js';
import { compareCodepoint } from '../deterministicSort.js';
import { warningSacrifice, intelSalePrice } from './generosityEV.js';
import { tradeNeighbours } from './rumorNetwork.js';
import { GOVERNING_SEAT_KEY } from '../worldPulse/beliefMap.js';
import { ensureRelationshipState, relationshipKeyFromEdge, normalizeRelationshipType } from '../worldPulse/relationshipState.js';

/** The generosity-owned pending-transfer sub-ledger (statecraft READS + injects, never writes). */
export const INTEL_TRANSFERS_LEDGER = 'intelTransfers';
/** The generosity-owned per-pair cooldown sub-ledger (pairKey → lastTradeWeek). */
export const INTEL_COOLDOWN_LEDGER = 'intelCooldown';

/** The relationship kinds a GIFT rides (a bonded ally) — the generosity gate vocabulary. */
const BOND_KINDS = new Set(['allied', 'trade_partner', 'vassal', 'patron', 'client']);

export const INTEL_TRADE_TUNING = Object.freeze({
  // A belief updated within this many ticks of "now" is a FRESH trigger (the seller just
  // learned/updated something worth passing on). 1 ⇒ only this-tick updates fire.
  FRESH_WINDOW_TICKS: 1,
  // The seller must actually KNOW something — a hazy read is not worth telling/selling.
  MIN_CONFIDENCE: 0.35,
  // …and must know it BETTER than the receiver already does (else nothing is transferred).
  CONFIDENCE_EDGE: 0.1,
  // The qualifying bond floor (mirrors the generosity gate).
  BOND_FLOOR: 0.2,
  // Per-pair cooldown in WEEKS (design INTEL_PAIR_COOLDOWN_WEEKS) — measured on the
  // catch-up-stable elapsedWeeks clock so a collapsed advance prices the same as serial.
  COOLDOWN_WEEKS: 26,
  // The yearly loaded-dice ELIGIBILITY per pair (the rarity that turns triggers into a
  // handful of transfers a year rather than a steady trickle).
  ELIGIBILITY_BASE_CHANCE: 0.3,
  // A hot-path safety ceiling on transfers deposited per tick. Rarely binds (the trigger +
  // cooldown + yearly eligibility do the shaping); it only bounds a pathological fan-out.
  ACTS_PER_TICK_CAP: 12,
  WEEKS_PER_YEAR: 52,
  // Map the sacrifice/price [0,~1] onto an obligation magnitude (kept modest — a favor, not
  // a mortgage). The gift's obligation is scaled by the telling's sacrifice; the sale's
  // consideration by the fidelity/stakes price.
  OBLIGATION_SCALE: 0.6,
  // intelSalePrice's ceiling ≈ BASE(1)·fidelity(1)·(1+STAKES_GAIN)(1.6)·cred(1, neutral) ⇒
  // ~1.6; normalize the priced consideration into [0,1] against this.
  SALE_PRICE_NORM: 1.6,
  // THE SELF-POLICING RESOLVER (design §7 — "if the sold/gifted read later CONTRADICTS …
  // charges the seller's stock; if it PROVES OUT, the proven_true rise pays"): a transferred
  // read is CONTRADICTED (a bad product) when its band diverges from the subject's true band
  // by ≥ this (the LIE_TUNING.EXPOSE_CONTRADICT_BANDS semantics, mirrored at the sale grain);
  // within it, the read PROVED OUT. Resolved AT COURIER-ARRIVAL — the only window the record
  // survives (generosity prunes it the same tick, generosityKernel §1250).
  SALE_CONTRADICT_BANDS: 2,
  // The proven-true magnitude fed to the credibility rise (the slow TRUE_RISE side of the
  // asymmetry is already gentle; a full-magnitude honest sale is still a slow climb).
  SALE_TRUE_MAG: 1,
});

/**
 * Is the D-3 intel lane LIT? Reads simulationRules.intelTradeEnabled === true, defensively —
 * ABSENT ⇒ false ⇒ DORMANT (byte-identical; no DEFAULT_SIMULATION_RULES entry). Pure, total.
 * @param {{ simulationRules?: Record<string, unknown> }|null|undefined} worldState @returns {boolean}
 */
export function intelTradeActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  return !!(rules && typeof rules === 'object' && /** @type {Record<string, unknown>} */ (rules).intelTradeEnabled === true);
}

/** Canonical codepoint-ordered id pair (so a fork/key is orientation-independent). */
/** @param {string} a @param {string} b @returns {[string, string]} */
function canonPair(a, b) {
  return compareCodepoint(String(a), String(b)) <= 0 ? [String(a), String(b)] : [String(b), String(a)];
}
/** The per-pair cooldown ledger key (canonical). @param {string} a @param {string} b @returns {string} */
export function intelPairKey(a, b) {
  const [x, y] = canonPair(a, b);
  return `${x}|${y}`;
}
/** The year index from the catch-up-stable elapsedWeeks clock. @param {number} elapsedWeeks @returns {number} */
export function intelYearOf(elapsedWeeks) {
  return Math.floor(Math.max(0, Number(elapsedWeeks) || 0) / INTEL_TRADE_TUNING.WEEKS_PER_YEAR);
}

/**
 * THE TICK-INVARIANT YEARLY ELIGIBILITY DRAW (design §7 (d) — the roads cadence pattern):
 * a fork of the WORLD seed keyed on the canonical pair + year (NEVER the tick), so collapsed
 * catch-up never shifts which pairs trade. Loaded dice: fires with baseChance probability.
 * @param {string|number} rngSeed @param {string} a @param {string} b @param {number} year @param {number} baseChance @returns {boolean}
 */
export function intelEligible(rngSeed, a, b, year, baseChance) {
  const [x, y] = canonPair(a, b);
  const r = createPRNG(`${String(rngSeed)}::intel-trade:${x}:${y}:${year}`).random();
  return r < clamp01(baseChance);
}

/**
 * The BeliefRecord the receiver adopts from a transfer: the seller's snapshot, at the
 * seller's fidelity (confidence scaled down by the read's fidelity — you inherit the
 * seller's uncertainty). The injection is performed by the statecraft mover (this builds
 * the record it plants). Absent belief ⇒ null (no injection). Pure.
 * @param {{ belief?: Record<string, unknown>, fidelity01?: number }|null|undefined} record @param {number} tick
 * @returns {Record<string, unknown>|null}
 */
export function intelInjectionBelief(record, tick) {
  const b = record && typeof record.belief === 'object' && record.belief ? record.belief : null;
  if (!b) return null;
  // b truthy ⇒ record is the non-null carrier (the guard above) — the checker cannot thread that.
  const rec = /** @type {{ fidelity01?: number }} */ (record);
  const fidelity = clamp01(typeof rec.fidelity01 === 'number' ? rec.fidelity01 : 0.7);
  const conf = typeof b.confidence01 === 'number' ? b.confidence01 : 0.5;
  return {
    readiness: b.readiness,
    strengthBand: b.strengthBand,
    allianceLabel: b.allianceLabel,
    faithLabel: b.faithLabel,
    confidence01: Math.round(clamp01(conf * fidelity) * 10000) / 10000,
    lastUpdateTick: Math.max(0, Math.floor(Number(tick) || 0)),
  };
}

/**
 * THE SELF-POLICING RESOLVER (design §7 — closes the intel lane's credibility loop). Given a
 * couriered transfer record and the subject's TRUE strength band at courier-arrival, judge
 * whether the seller's transferred read PROVED OUT (band within SALE_CONTRADICT_BANDS of truth)
 * or was CONTRADICTED (a stale/false product). Returns a ResolvedIntelSale-shaped verdict the
 * statecraft mover feeds to intelSaleCredibilityDeltas (the seller settlement's stock) AND
 * intelSaleNpcCredibilityDeltas (the seller SPOKESPERSON's stock, when D-2 stamped one — degrades
 * to settlement-only when absent, exactly as today). Applies to sold AND gifted reads (design §7
 * "the sold/gifted read"). Unresolvable band (no belief, non-finite truth) ⇒ null (no charge).
 * PURE. @param {{ sellerId?: string, belief?: Record<string, unknown>, spokespersonNpcId?: string }|null|undefined} rec
 * @param {number} trueBand @returns {{ sellerId: string, accurate: boolean, magnitude01: number, spokespersonNpcId?: string }|null}
 */
export function resolveIntelSale(rec, trueBand) {
  const r = asObject(rec);
  if (r.sellerId == null) return null;
  const belief = asObject(r.belief);
  const soldBand = Number(belief.strengthBand);
  const tb = Number(trueBand);
  if (!Number.isFinite(soldBand) || !Number.isFinite(tb)) return null;
  const diff = Math.abs(Math.round(soldBand) - Math.round(tb));
  const accurate = diff < INTEL_TRADE_TUNING.SALE_CONTRADICT_BANDS;
  const magnitude01 = accurate ? clamp01(INTEL_TRADE_TUNING.SALE_TRUE_MAG) : clamp01(diff / 4);
  /** @type {{ sellerId: string, accurate: boolean, magnitude01: number, spokespersonNpcId?: string }} */
  const out = { sellerId: String(r.sellerId), accurate, magnitude01 };
  if (r.spokespersonNpcId != null) out.spokespersonNpcId = String(r.spokespersonNpcId);
  return out;
}

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** The governing-seat belief slot record for (observer → subject), or null. */
/** @param {Record<string, unknown>} beliefMaps @param {string} observerId @param {string} subjectId */
function seatBelief(beliefMaps, observerId, subjectId) {
  const seat = asObject(asObject(beliefMaps[String(observerId)])[GOVERNING_SEAT_KEY]);
  const rec = seat[String(subjectId)];
  return rec && typeof rec === 'object' && !Array.isArray(rec) ? /** @type {Record<string, unknown>} */ (rec) : null;
}

/**
 * @typedef {Object} IntelOpportunity
 * @property {string} sellerId    the settlement that holds the fresh belief
 * @property {string} receiverId  the bonded ally (gift) or trade-partner (sale)
 * @property {string} subjectId   the settlement the belief is ABOUT
 * @property {'gift'|'sale'} mode
 * @property {Record<string, unknown>} belief  the seller's belief snapshot to transfer
 * @property {number} fidelity01  the seller's read fidelity (its belief confidence)
 * @property {number} stakes01    how much the receiver cares about the subject (bond strength)
 */

/**
 * ENUMERATE the intel-transfer opportunities this tick (design §7 (a)/(b)) — PURE, bounded,
 * codepoint-deterministic. NO world scan: for each settlement that holds a FRESH belief about
 * a subject, only its bonded allies (gift) / confirmed trade-partners (sale) that (i) have
 * STAKES in that subject (a qualifying edge or a live obligation to it) and (ii) do not
 * already know it as well are considered. Empty when no fresh belief / no qualifying pair.
 * @param {Object} a
 * @param {Record<string, unknown>} a.beliefMaps
 * @param {Array<Record<string, unknown>>} a.edges          the regional graph edges
 * @param {{ channels?: unknown[], edges?: unknown[] }|null|undefined} a.graph  the regional graph (for tradeNeighbours)
 * @param {Record<string, unknown>} a.relStates             the relationshipStates
 * @param {Record<string, unknown>|null|undefined} a.obligationLedger
 * @param {(a: string, b: string) => boolean} a.atWar        pair-at-war predicate (sale bar)
 * @param {number} a.tick
 * @returns {IntelOpportunity[]}
 */
export function enumerateIntelOpportunities({ beliefMaps, edges, graph, relStates, obligationLedger, atWar, tick }) {
  const T = INTEL_TRADE_TUNING;
  const now = Math.max(0, Math.floor(Number(tick) || 0));
  const maps = asObject(beliefMaps);
  const edgeList = Array.isArray(edges) ? edges : [];
  const obl = asObject(obligationLedger);
  const isAtWar = typeof atWar === 'function' ? atWar : () => false;

  // ── Bonded adjacency (qualifying kind above the floor) — the gift channel + the "stakes"
  //    read (does R hold a bond to the subject J?). Built once, codepoint-stable. ──
  /** @type {Map<string, Map<string, { kind: string, strength01: number }>>} */
  const bonds = new Map();
  const addBond = (/** @type {string} */ x, /** @type {string} */ y, /** @type {string} */ kind, /** @type {number} */ s) => {
    if (!bonds.has(x)) bonds.set(x, new Map());
    /** @type {Map<string, { kind: string, strength01: number }>} */ (bonds.get(x)).set(y, { kind, strength01: s });
  };
  for (const edge of edgeList) {
    const from = edge && edge.from != null ? String(edge.from) : '';
    const to = edge && edge.to != null ? String(edge.to) : '';
    if (!from || !to || from === to) continue;
    const kind = normalizeRelationshipType(String(edge.relationshipType || 'neutral'));
    if (!BOND_KINDS.has(kind)) continue;
    const rel = ensureRelationshipState(edge, relStates[relationshipKeyFromEdge(edge)]);
    const strength01 = clamp01(0.7 * (Number(rel.trust) || 0) + 0.3 * (Number(rel.pactStrength) || 0));
    if (strength01 < T.BOND_FLOOR) continue;
    addBond(from, to, kind, strength01);
    addBond(to, from, kind, strength01);
  }
  // Obligation adjacency index (id → Set of counterpart ids), built ONCE per enumerate call
  // (O(obligations)) — mirrors the `bonds` Map above so hasLiveObl is an O(1) membership check
  // instead of a full-ledger scan per seller×subject×receiver triple. Both directions are added,
  // so a lookup is order-independent — behaviour-identical to the prior linear scan.
  /** @type {Map<string, Set<string>>} */
  const oblAdj = new Map();
  const addObl = (/** @type {string} */ x, /** @type {string} */ y) => {
    let s = oblAdj.get(x);
    if (!s) { s = new Set(); oblAdj.set(x, s); }
    s.add(y);
  };
  for (const k of Object.keys(obl)) {
    const r = asObject(obl[k]);
    const f = String(r.from); const t = String(r.to);
    addObl(f, t); addObl(t, f);
  }
  const hasLiveObl = (/** @type {string} */ x, /** @type {string} */ y) => oblAdj.get(x)?.has(y) || false;
  // R has STAKES in subject J when it holds a qualifying bond to J or a live obligation with J.
  const hasStakes = (/** @type {string} */ r, /** @type {string} */ j) => (bonds.get(r)?.has(j) || hasLiveObl(r, j));

  /** @type {Map<string, Set<string>>} confirmed trade partners per settlement (sale channel). */
  const tradeCache = new Map();
  const tradeSetOf = (/** @type {string} */ id) => {
    let s = tradeCache.get(id);
    if (!s) { s = new Set(tradeNeighbours(/** @type {import('./rumorNetwork.js').RumorGraphRead} */ (graph), id).map((n) => String(n.neighbourId))); tradeCache.set(id, s); }
    return s;
  };

  /** @type {IntelOpportunity[]} */
  const out = [];
  const seen = new Set();
  for (const sellerId of Object.keys(maps).sort(compareCodepoint)) {
    const seat = asObject(asObject(maps[sellerId])[GOVERNING_SEAT_KEY]);
    // The bonded + trade counterparties of this seller (the only receivers ever considered).
    const bondedR = bonds.get(sellerId);
    const tradeR = tradeSetOf(sellerId);
    if ((!bondedR || bondedR.size === 0) && tradeR.size === 0) continue;
    for (const subjectId of Object.keys(seat).sort(compareCodepoint)) {
      if (subjectId === sellerId) continue;
      const sBelief = asObject(seat[subjectId]);
      const conf = Number(sBelief.confidence01) || 0;
      if (conf < T.MIN_CONFIDENCE) continue;
      const last = Number(sBelief.lastUpdateTick);
      if (!Number.isFinite(last) || now - last > T.FRESH_WINDOW_TICKS) continue; // not a fresh trigger
      // The candidate receivers: bonded allies (gift) ∪ trade-partners (sale), codepoint-sorted.
      const receivers = new Set([...(bondedR ? bondedR.keys() : []), ...tradeR]);
      for (const receiverId of [...receivers].sort(compareCodepoint)) {
        if (receiverId === sellerId || receiverId === subjectId) continue;
        if (!hasStakes(receiverId, subjectId)) continue; // the receiver must care about the subject
        const rBelief = seatBelief(maps, receiverId, subjectId);
        const rConf = rBelief ? (Number(rBelief.confidence01) || 0) : 0;
        if (rConf >= conf - T.CONFIDENCE_EDGE) continue; // the receiver already knows as well ⇒ nothing to transfer
        const bond = bondedR ? bondedR.get(receiverId) : undefined;
        const mode = bond ? 'gift' : 'sale';
        if (mode === 'sale' && isAtWar(sellerId, receiverId)) continue; // no selling to an enemy
        const key = `${sellerId}|${receiverId}|${subjectId}`;
        if (seen.has(key)) continue;
        seen.add(key);
        // stakes = the receiver's bond strength to the subject (how much the intel matters to it).
        const rj = bonds.get(receiverId)?.get(subjectId);
        const stakes01 = rj ? rj.strength01 : 0.3;
        out.push({
          sellerId, receiverId, subjectId, mode: /** @type {'gift'|'sale'} */ (mode),
          belief: {
            readiness: sBelief.readiness, strengthBand: sBelief.strengthBand,
            allianceLabel: sBelief.allianceLabel, faithLabel: sBelief.faithLabel,
            confidence01: conf,
          },
          fidelity01: clamp01(conf),
          stakes01: clamp01(stakes01),
        });
      }
    }
  }
  return out;
}

/**
 * The GIFT obligation magnitude (design §7 THE GIFT): the receiver owes the giver GRATITUDE
 * scaled by the SACRIFICE of the telling (warningSacrifice — advantage spent + eyes exposed),
 * not the value heard. Returns [0,1]. Pure.
 * @param {{ fidelity01?: number, stakes01?: number }} a @returns {number}
 */
export function intelGiftMagnitude({ fidelity01 = 0, stakes01 = 0 } = {}) {
  const sacrifice = warningSacrifice({ strategicAdvantageSpent01: clamp01(fidelity01), eyesExposed01: clamp01(stakes01) * 0.5 });
  return clamp01(INTEL_TRADE_TUNING.OBLIGATION_SCALE * sacrifice);
}

/**
 * The SALE consideration magnitude (design §7 THE SALE): the priced value of the intel
 * (intelSalePrice — fidelity-discounted, stakes-scaled), normalized to [0,1]. Seller
 * credibility is NEUTRAL (1.0) at this PRICING base; the CONSEQUENCE side — a sale later
 * proven false charging the seller's stock so its FUTURE prices fall — is now closed by the
 * self-policing loop (resolveIntelSale → the statecraft mover's intelSaleCredibilityDeltas /
 * intelSaleNpcCredibilityDeltas folds). Pure.
 * @param {{ fidelity01?: number, stakes01?: number }} a @returns {number}
 */
export function intelSaleMagnitude({ fidelity01 = 0, stakes01 = 0 } = {}) {
  const price = intelSalePrice({ fidelity01: clamp01(fidelity01), stakes01: clamp01(stakes01), sellerCredibility01: 1 });
  return clamp01(price / INTEL_TRADE_TUNING.SALE_PRICE_NORM);
}

/**
 * PLAN the favor-economy side of one firing opportunity (design §7 THE GIFT / THE SALE) —
 * pure; the generosityKernel applies the returned mints/repayments through its OWN obligation
 * writer (foldObligations) and deposits the transfer. GIFT ⇒ the receiver owes the giver a
 * 'warning' obligation of gratitude. SALE ⇒ the consideration REPAYS a debt the seller owes
 * the buyer (information as repayment), else mints a REVERSE 'intel_sale' debt (buyer indebted).
 * D-3 SELF-POLICING COORDINATION POINT (seller-side stamp): the transfer record carries an
 * optional `spokespersonNpcId` — the named carrier of the sold/gifted read — so the statecraft
 * consume arm can charge that soul's PERSONAL credibility when the read is later contradicted
 * (design §6/§7). This leaf only PASSES it onto the record when the caller supplies it; PICKING
 * the mouthpiece (a seeded importance-weighted roster draw, the informationStatecraft.pickMouthpiece
 * idiom) belongs to the SELLER SIDE at deposit time — the generosity kernel owns the intelTransfers
 * writes, so wiring `ctx.spokespersonNpcId` through generosityKernel's planIntelAct call is a D-3-lane
 * coordination point (deliberately NOT edited from the statecraft lane). Absent ⇒ the field is omitted
 * ⇒ the transfer record is byte-identical to today and the loop degrades to settlement-level.
 * @param {IntelOpportunity} opp
 * @param {{ obligationLedger?: Record<string, unknown>|null, tick: number, spokespersonNpcId?: string|null }} ctx
 * @returns {{ mints: Array<Record<string, unknown>>, repayments: Array<Record<string, unknown>>, giftMag: number, transfer: Record<string, unknown> }}
 */
export function planIntelAct(opp, { obligationLedger, tick, spokespersonNpcId = null }) {
  const obl = asObject(obligationLedger);
  const now = Math.max(0, Math.floor(Number(tick) || 0));
  /** @type {Array<Record<string, unknown>>} */
  const mints = [];
  /** @type {Array<Record<string, unknown>>} */
  const repayments = [];
  let giftMag = 0;
  if (opp.mode === 'gift') {
    giftMag = intelGiftMagnitude(opp);
    if (giftMag > 0) mints.push({ from: opp.receiverId, to: opp.sellerId, kind: 'warning', magnitude: giftMag, mintTick: now, lastTick: now });
  } else {
    const mag = intelSaleMagnitude(opp);
    const owedKey = Object.keys(obl).find((k) => {
      const r = asObject(obl[k]);
      return String(r.from) === opp.sellerId && String(r.to) === opp.receiverId;
    });
    if (owedKey) repayments.push({ from: opp.sellerId, to: opp.receiverId, kind: String(asObject(obl[owedKey]).kind), amount: mag });
    else if (mag > 0) mints.push({ from: opp.receiverId, to: opp.sellerId, kind: 'intel_sale', magnitude: mag, mintTick: now, lastTick: now });
  }
  const transfer = {
    sellerId: opp.sellerId, receiverId: opp.receiverId, subjectId: opp.subjectId,
    mode: opp.mode, belief: opp.belief, fidelity01: opp.fidelity01, depositTick: now,
    // D-3 self-policing: the seller's mouthpiece, stamped ONLY when the caller supplies one
    // (the coordination point above) — additive-optional, absent ⇒ byte-identical.
    ...(spokespersonNpcId != null ? { spokespersonNpcId: String(spokespersonNpcId) } : {}),
  };
  return { mints, repayments, giftMag, transfer };
}
