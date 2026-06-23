/**
 * domain/worldPulse/tradeSalience.js — Phase B4 strategic-trade-value model (pure).
 *
 * THE QUESTION: for a settlement PAIR (A,B) with a confirmed trade tie, how
 * VALUABLE is that tie to each side — and therefore how much does it raise the
 * COST of war between them? B4's headline (proposal §4–6, "trade-as-peace"):
 * valuable, recent, hard-to-replace trade does NOT make two settlements friendly,
 * but it makes hostility costlier ⇒ less likely. This module is the trade-value
 * SOURCE the candidateBase dampener (relationshipEvolution candidateBase) reads.
 *
 * SALIENCE is per-commodity, tied to actual supply-chain GAPS:
 *   - a FOOD-INSECURE buyer's grain tie is high-salience (losing it = famine);
 *   - a MILITARIZING settlement's iron/weapons tie is high-salience;
 *   - a redundant tie (many alternative suppliers) or a luxury tie is LOW.
 * Plus three modifiers the proposal names: how HARD-TO-REPLACE the supplier is
 * (few alternatives ⇒ high), how RECENT the tie is (a fresh realignment weighs
 * more), and how POLITICALLY-important it is (allied/patron/vassal ⇒ higher).
 *
 * Output (per directed buyer←supplier commodity tie) is a 0..1 salience + its
 * facets, and a pair-level rollup `pairTradeSalience(A,B)` taking the MAX salience
 * in either direction (the tie's value to whichever side needs it most) — the
 * scalar the hostility dampener consumes.
 *
 * DETERMINISM (sacred): pure. Reads only the SINGLE pre-tick snapshot
 * (settlement.economicState, foodLedger, militaryCapacity, the confirmed regional
 * channels, the trade-war realignment ledger for recency). No RNG, no Date, no
 * Map/Set output iteration — every scan reduces over an array; every multi-tie
 * rollup takes a MAX (commutative, order-independent). Codepoint-sorts commodity
 * ids before any iteration whose order could matter.
 *
 * GATING: this module is PURE — it computes salience whether or not the war layer
 * is on. The GATE lives at the CALL SITE (advanceCampaignWorld threads the
 * salience map only under warLayerEnabled), exactly like computeDispositionFactorMap.
 * Mounted nowhere on the OFF path ⇒ byte-identical.
 */

import { normalizeGood } from '../region/goodsCatalog.js';
import { foodLedger } from '../foodLedger.js';
import { deriveMilitaryCapacity } from './militaryStrength.js';
import { supplyCompleteness } from './supplyCompleteness.js';
import { isCompatible, isBattlefieldPrimary } from './relationshipCompatibility.js';

const clamp01 = (/** @type {any} */ v) => Math.max(0, Math.min(1, Number(v) || 0));
const codepoint = (/** @type {string} */ a, /** @type {string} */ b) => (a < b ? -1 : a > b ? 1 : 0);

/** Canonical good id for a label/object, or null. @param {any} v @returns {string|null} */
function goodId(v) {
  const good = normalizeGood(v);
  return good ? good.id : null;
}

// The confirmed trade carriers that count as a "trade tie" — the same set the
// trade-war contest + supplyCompleteness read.
const TRADE_CARRIERS = ['trade_dependency', 'trade_route', 'export_market'];

// Materiel pattern — a militarizing settlement's iron/weapons ties are high
// salience. Mirrors militaryStrength.MATERIEL_PATTERN's vocabulary so the two
// agree on "what is a war good"; kept local to avoid an export-coupling.
const MATERIEL_GOOD_PATTERN = /weapon|armor|armour|blade|sword|spear|bow|arrow|iron|steel|smith|forge|foundry|siege|mount|cavalry|warhorse|powder|cannon|munition|ore|metal/i;

// ── Tunable weights (the salience blend) ─────────────────────────────────────
// Salience = how badly the buyer NEEDS this commodity (the GAP) modulated by the
// commodity's strategic character, scaled by how hard the supplier is to replace,
// and lifted by recency + political importance. NEED dominates: a redundant tie
// to a food-secure buyer is low salience no matter how friendly the parties.
export const TRADE_SALIENCE_TUNING = Object.freeze({
  W_NEED: 0.5,            // the supply-chain gap this tie fills (food insecurity / militarization / generic import-dependence)
  W_REPLACE: 0.28,        // hard-to-replace bonus (few alternative suppliers ⇒ high)
  W_RECENCY: 0.10,        // a freshly-realigned tie weighs more (decays over RECENCY_TICKS)
  W_POLITICAL: 0.12,      // allied/patron/vassal/critical political importance
  RECENCY_TICKS: 8,       // a realignment's recency bonus decays to 0 over this many ticks
  // A tie must clear this to register as "valuable" for the dampener (below it,
  // the factor stays ~1.0 — a redundant/luxury tie barely moves war probability).
  VALUABLE_GATE: 0.32,
  // How much a max-salience tie can dampen hostile/escalation candidates. The
  // factor handed to candidateBase is centered on 1.0; a full-salience tie pulls
  // it down to (1 - MAX_DAMPEN). Modest — trade lowers, never removes, war risk.
  MAX_DAMPEN: 0.4,
  // A CRITICAL-supplier dependency (high salience + hard-to-replace + a real
  // chain gap) earns EXTRA dampening between the dependent and its supplier
  // ("the dependent avoids war with its critical supplier").
  CRITICAL_GATE: 0.62,
  CRITICAL_EXTRA_DAMPEN: 0.18,
});

// Political-importance lift by primary relationship type. Allied/patron/vassal
// ties are strategically weighty; adversarial ties (rival/cold_war) get a small
// lift too (a trade tie across a rivalry is itself a restraint), hostile none
// (battlefield enemies — any tie is covert/forced, handled by the overlay).
const POLITICAL_LIFT = Object.freeze({
  allied: 1.0, patron: 0.9, vassal: 0.9, client: 0.7, trade_partner: 0.6,
  neutral: 0.3, criminal_network: 0.4, rival: 0.35, cold_war: 0.3, hostile: 0,
});

/** The settlement entry for an id from the snapshot, or null. */
function entryFor(/** @type {any} */ snapshot, /** @type {any} */ id) {
  return snapshot?.byId?.get?.(String(id)) || null;
}

/**
 * The codepoint-sorted canonical commodities a buyer imports.
 * @param {any} snapshot @param {any} buyerId @returns {string[]}
 */
function importedCommodities(snapshot, buyerId) {
  const eco = entryFor(snapshot, buyerId)?.settlement?.economicState
    || entryFor(snapshot, buyerId)?.settlement?.economy || {};
  const imports = eco.primaryImports || eco.imports || [];
  const ids = new Set();
  for (const imp of imports) { const id = goodId(imp); if (id) ids.add(id); }
  return [...ids].sort(codepoint);
}

/**
 * Confirmed suppliers of `commodityId` INTO `buyerId`: a Map supplierId→strength.
 * A declared-goods channel must include K; a general (goods-less) tie counts only
 * if the supplier actually exports K (checked by the caller via supplyCompleteness).
 * @param {any} snapshot @param {any} buyerId @param {string} commodityId
 */
function suppliersInto(snapshot, buyerId, commodityId) {
  const id = String(buyerId);
  const channels = snapshot?.regionalGraph?.channels || snapshot?.channels || [];
  const bySupplier = new Map();
  for (const channel of channels) {
    if (String(channel?.to) !== id) continue;
    if (!TRADE_CARRIERS.includes(String(channel?.type))) continue;
    if (String(channel?.status || 'confirmed') !== 'confirmed') continue;
    const goods = Array.isArray(channel?.goods) ? channel.goods : [];
    if (goods.length && !goods.some((/** @type {any} */ g) => goodId(g) === commodityId)) continue;
    const supplierId = String(channel.from);
    if (supplierId === id) continue;
    const strength = clamp01(channel.strength ?? channel.severity ?? 0.45);
    const prev = bySupplier.get(supplierId) || 0;
    if (strength > prev) bySupplier.set(supplierId, strength);
  }
  return bySupplier;
}

/**
 * The buyer's NEED for `commodityId` in 0..1 — the supply-chain GAP this tie fills.
 * Three signals, MAX-combined (whichever pain is sharpest sets the need):
 *   - food gap: if K is a food/grain commodity and the buyer is food-insecure
 *     (low resilience / thin reserves), the need spikes.
 *   - materiel gap: if K is a war good and the buyer is militarizing (high will /
 *     a thin domestic materiel facet), the need spikes.
 *   - generic import-dependence: the buyer imports K and cannot self-supply it
 *     (low own supplyCompleteness) ⇒ a baseline need.
 * @param {any} snapshot @param {any} buyerId @param {string} commodityId
 */
function buyerNeed(snapshot, buyerId, commodityId) {
  const settlement = entryFor(snapshot, buyerId)?.settlement;
  if (!settlement) return 0;
  const good = normalizeGood(commodityId);
  const label = String(good?.label || good?.sourceLabel || commodityId || '');
  const isFood = /grain|food|wheat|rice|bread|fish|meat|produce|provision|foodstuff|staple/i.test(label)
    || good?.category === 'food';
  const isMateriel = MATERIEL_GOOD_PATTERN.test(label);

  let need = 0.34; // generic import-dependence baseline (the buyer imports K)
  // The buyer cannot self-supply K ⇒ the tie matters more. supplyCompleteness on
  // the BUYER for K is its own ability to make K; low ⇒ dependent.
  const ownChain = supplyCompleteness(snapshot, buyerId, commodityId);
  need = Math.max(need, clamp01(0.3 + (1 - ownChain) * 0.4));

  if (isFood) {
    const food = foodLedger(settlement);
    // resilienceScore 0..100, storageMonths buffer. A food-insecure city's grain
    // tie is the textbook high-salience case.
    const insecurity = clamp01(1 - food.resilienceScore / 100);
    const thinReserves = clamp01(1 - Math.min(food.storageMonths, 6) / 6);
    need = Math.max(need, clamp01(0.45 + insecurity * 0.4 + thinReserves * 0.15));
  }
  if (isMateriel) {
    const mil = deriveMilitaryCapacity(settlement);
    // A militarizing settlement (high will) with a THIN domestic materiel facet
    // depends on its iron/weapons import. materiel/will facets are 0..100.
    const willDrive = clamp01((mil.facets.will - 50) / 50); // >50 ⇒ war-leaning
    const materielGap = clamp01(1 - mil.facets.materiel / 100);
    need = Math.max(need, clamp01(0.4 + willDrive * 0.35 + materielGap * 0.25));
  }
  return clamp01(need);
}

/**
 * How HARD-TO-REPLACE this supplier is for K, in 0..1. Few credible alternative
 * suppliers (other confirmed carriers into the buyer whose settlements actually
 * export K) ⇒ high. The incumbent itself is excluded from the alternative count.
 * @param {any} snapshot @param {any} buyerId @param {string} commodityId
 * @param {string} supplierId @param {Map<string,number>} supplierStrengths
 */
function hardToReplace(snapshot, buyerId, commodityId, supplierId, supplierStrengths) {
  let alternatives = 0;
  for (const altId of supplierStrengths.keys()) {
    if (String(altId) === String(supplierId)) continue;
    // A credible alternative must actually be able to supply K.
    if (supplyCompleteness(snapshot, altId, commodityId) > 0) alternatives += 1;
  }
  // 0 alternatives ⇒ sole supplier ⇒ 1.0; each alternative roughly halves it.
  return clamp01(1 / (1 + alternatives));
}

/**
 * Recency lift in 0..1 from the trade-war realignment ledger: a tie that flipped
 * to this supplier recently weighs more (a fresh strategic realignment). Decays
 * linearly to 0 over RECENCY_TICKS. Absent ledger ⇒ 0 (no bonus).
 * @param {any} worldState @param {any} buyerId @param {string} commodityId
 * @param {string} supplierId @param {number} tick
 */
function recencyLift(worldState, buyerId, commodityId, supplierId, tick) {
  const ledger = worldState?.tradeWarState || {};
  // Prize ids are `${stablePart(buyer)}:${stablePart(commodity)}` in tradeWar.js;
  // we scan for any entry whose winner is this supplier and whose buyer/commodity
  // match by the stable-part embedding, taking the freshest flip.
  let best = 0;
  for (const [, entry] of Object.entries(ledger)) {
    const e = /** @type {any} */ (entry);
    if (String(e?.winnerId) !== String(supplierId)) continue;
    const last = Number.isFinite(e?.lastFlipTick) ? e.lastFlipTick : null;
    if (last == null) continue;
    const age = tick - last;
    if (age < 0 || age >= TRADE_SALIENCE_TUNING.RECENCY_TICKS) continue;
    best = Math.max(best, 1 - age / TRADE_SALIENCE_TUNING.RECENCY_TICKS);
  }
  return clamp01(best);
}

/**
 * @typedef {Object} TradeSalience
 * @property {number} salience    0..1 overall.
 * @property {number} need        buyer's supply-chain gap this tie fills.
 * @property {number} replace     hard-to-replace factor.
 * @property {number} recency     recency lift.
 * @property {number} political   political-importance lift.
 * @property {boolean} critical   salience cleared CRITICAL_GATE (a critical-supplier dependency).
 * @property {string} supplierId
 * @property {string} buyerId
 * @property {string} commodityId
 */

/**
 * Salience of the directed tie buyer←supplier for one commodity. The buyer NEEDS;
 * the supplier holds leverage proportional to that need × how hard it is to
 * replace. Returns null when there is no confirmed tie carrying K from the
 * supplier into the buyer.
 *
 * @param {any} snapshot @param {any} worldState @param {any} buyerId
 * @param {any} supplierId @param {string|object} commodity
 * @param {{ tick?: number, relationshipType?: string, channelStrength?: number }} [ctx]
 * @returns {TradeSalience|null}
 */
export function commodityTradeSalience(snapshot, worldState, buyerId, supplierId, commodity, ctx = {}) {
  const commodityId = goodId(commodity);
  if (!commodityId) return null;
  const supplierStrengths = suppliersInto(snapshot, buyerId, commodityId);
  const channelStrength = Number.isFinite(ctx.channelStrength)
    ? clamp01(ctx.channelStrength)
    : supplierStrengths.get(String(supplierId));
  // No confirmed carrier of K from this supplier into this buyer ⇒ no tie.
  if (!Number.isFinite(channelStrength) || channelStrength <= 0) return null;
  // The supplier must actually be able to supply K (a credible tie).
  if (supplyCompleteness(snapshot, supplierId, commodityId) <= 0) return null;

  const need = buyerNeed(snapshot, buyerId, commodityId);
  const replace = hardToReplace(snapshot, buyerId, commodityId, supplierId, supplierStrengths);
  const tick = Number.isFinite(ctx.tick) ? Number(ctx.tick) : (worldState?.tick || 0);
  const recency = recencyLift(worldState, buyerId, commodityId, supplierId, tick);
  const political = clamp01(
    /** @type {Record<string, number>} */ (POLITICAL_LIFT)[String(ctx.relationshipType || 'neutral')] ?? 0.3,
  );

  const T = TRADE_SALIENCE_TUNING;
  // NEED is the spine; the channel strength scales it (a thin tie is less load-
  // bearing); replace/recency/political lift it. Centered so a high-need,
  // hard-to-replace, recent, allied tie approaches 1, a redundant luxury tie ~0.
  const core = need * (0.55 + channelStrength * 0.45);
  const salience = clamp01(
    T.W_NEED * core
    + T.W_REPLACE * replace * core
    + T.W_RECENCY * recency
    + T.W_POLITICAL * political * core,
  );
  return {
    salience,
    need,
    replace,
    recency,
    political,
    critical: salience >= T.CRITICAL_GATE && replace >= 0.5,
    supplierId: String(supplierId),
    buyerId: String(buyerId),
    commodityId,
  };
}

/**
 * The pair-level trade salience between A and B: the MAX commodity-tie salience
 * across BOTH directions (A buying from B, B buying from A) and all commodities.
 * This is the value of the tie to whichever side needs it most — the scalar the
 * hostility dampener consumes. Returns a rollup with the dominant tie + whether
 * either side has a CRITICAL-supplier dependency on the other (for coercion).
 *
 * @param {any} snapshot @param {any} worldState @param {any} aId @param {any} bId
 * @param {{ tick?: number, relationshipType?: string }} [ctx]
 * @returns {{ salience: number, critical: boolean,
 *   dependentId: string|null, supplierId: string|null,
 *   ties: TradeSalience[] }}
 */
export function pairTradeSalience(snapshot, worldState, aId, bId, ctx = {}) {
  /** @type {TradeSalience[]} */
  const ties = [];
  // Both directions: A imports from B, B imports from A. Iterate buyer's imported
  // commodities (codepoint-sorted) so the scan order is stable.
  for (const [buyer, supplier] of [[aId, bId], [bId, aId]]) {
    for (const commodityId of importedCommodities(snapshot, buyer)) {
      const tie = commodityTradeSalience(snapshot, worldState, buyer, supplier, commodityId, ctx);
      if (tie) ties.push(tie);
    }
  }
  if (!ties.length) {
    return { salience: 0, critical: false, dependentId: null, supplierId: null, ties };
  }
  // MAX over ties (commutative ⇒ order-independent). The dominant tie names the
  // dependent (buyer) + its supplier — the coercion/war-avoidance direction.
  let dominant = ties[0];
  for (const t of ties) if (t.salience > dominant.salience) dominant = t;
  const critical = ties.some(t => t.critical);
  // The critical tie (if any) names the dependency direction; else the dominant.
  const criticalTie = ties.find(t => t.critical) || dominant;
  return {
    salience: dominant.salience,
    critical,
    dependentId: criticalTie.buyerId,
    supplierId: criticalTie.supplierId,
    ties,
  };
}

/**
 * The centered-on-1.0 trade-salience FACTOR for a settlement pair — the value the
 * candidateBase dampener consumes, MIRRORING signedDispositionFactor's contract.
 * A valuable tie returns a factor BELOW 1.0 (it dampens hostile/escalation
 * candidates); no valuable tie returns EXACTLY 1.0 (byte-neutral). The factor is
 * the RAW (unsigned) damp magnitude — relationshipEvolution signs it by candidate
 * direction so it dampens escalation and RAISES de-escalation symmetrically.
 *
 * @param {number} salience 0..1
 * @param {boolean} [critical] a critical-supplier dependency earns extra dampening
 * @returns {number} 1.0 when no valuable tie; < 1.0 when valuable.
 */
export function tradeSalienceFactor(salience, critical = false) {
  const T = TRADE_SALIENCE_TUNING;
  const s = clamp01(salience);
  if (s < T.VALUABLE_GATE) return 1.0; // not valuable enough ⇒ byte-neutral
  // Scale the dampening by how far above the gate the salience sits (0 at the
  // gate, MAX_DAMPEN at full salience), so a marginal tie barely moves it.
  const span = 1 - T.VALUABLE_GATE;
  const above = span > 0 ? (s - T.VALUABLE_GATE) / span : 0;
  let damp = T.MAX_DAMPEN * above;
  if (critical && s >= T.CRITICAL_GATE) damp += T.CRITICAL_EXTRA_DAMPEN;
  return clamp01(1 - Math.min(damp, T.MAX_DAMPEN + T.CRITICAL_EXTRA_DAMPEN));
}

/**
 * Build the per-edge trade-salience factor map for the candidate-build chokepoint,
 * when the geopolitical layer is ACTIVE. Keyed by relationship edge key (the same
 * key candidateBase resolves via relationshipKeyFromEdge), value = a
 * centered-on-1.0 factor (< 1.0 dampens). Only entries that DIFFER from 1.0 are
 * emitted — a pair with no valuable tie is omitted ⇒ candidateBase reads EXACTLY
 * 1.0 for it (`{}`-equivalent, byte-neutral). Also carries the per-edge critical-
 * dependency direction (for the coercion/war-avoidance rules).
 *
 * Pure, deterministic, order-independent (object keys + MAX rollups). Mirrors
 * computeDispositionFactorMap so advanceCampaignWorld threads it the same way.
 *
 * @param {any} snapshot @param {any} worldState
 * @param {{ tick?: number }} [ctx]
 * @returns {{ factors: Record<string, number>, salience: Record<string, any> }}
 *   factors: edgeKey → centered-on-1.0 factor (1.0 entries omitted).
 *   salience: edgeKey → { salience, critical, dependentId, supplierId } for the rules.
 */
export function computeTradeSalienceMap(snapshot, worldState, ctx = {}) {
  /** @type {Record<string, number>} */
  const factors = {};
  /** @type {Record<string, any>} */
  const salience = {};
  const states = snapshot?.worldState?.relationshipStates || worldState?.relationshipStates || {};
  const tick = Number.isFinite(ctx.tick) ? Number(ctx.tick) : (worldState?.tick || 0);

  for (const edge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const key = edge?.id || `rel.${edge?.from}.${edge?.to}`;
    const from = edge?.from || edge?.source || edge?.a;
    const to = edge?.to || edge?.target || edge?.b;
    if (from == null || to == null) continue;
    const relationshipType = String(states[key]?.relationshipType || edge?.relationshipType || 'neutral');
    const pair = pairTradeSalience(snapshot, worldState, from, to, { tick, relationshipType });
    if (pair.salience <= 0) continue;
    const factor = tradeSalienceFactor(pair.salience, pair.critical);
    salience[key] = {
      salience: pair.salience,
      critical: pair.critical,
      dependentId: pair.dependentId,
      supplierId: pair.supplierId,
    };
    if (factor !== 1.0) factors[key] = factor;
  }
  return { factors, salience };
}

// ── Secondary-status overlay (compatibility-enforced) ────────────────────────
// Trade ties create/reinforce SECONDARY relationship statuses layered OVER the
// primary `relationshipType` (never replacing it). The status RANK comes from the
// tie's salience + materiel character:
//   - critical_supplier  : a critical-supplier dependency (salience ≥ CRITICAL_GATE, hard-to-replace);
//   - military_supplier   : a war-good tie (materiel commodity);
//   - preferred_supplier  : a valuable-but-not-critical tie;
//   - trade_partner       : any other confirmed tie.
// EVERY derived status is run through the isCompatible(primary, secondary)
// gate: a hostile (battlefield) primary BLOCKS all normal commerce — its trade
// can only exist as a covert/forced/mediated/temporary exception channel, so a
// battlefield primary downgrades any normal status to `smuggling` (covert) and
// drops it unless that exception is coherent. The rule: "battlefield
// enemies as normal trade is NOT OK".
const MATERIEL_STATUS_PATTERN = MATERIEL_GOOD_PATTERN;

/**
 * Derive the COMPATIBILITY-ENFORCED secondary trade statuses for one edge from its
 * salience ties + primary relationship type. Returns a codepoint-sorted, de-duped
 * array of `{ status, covert? }` overlay entries (covert set only for exception
 * channels). Empty when no valuable tie or every candidate status is blocked by
 * the primary. Pure + deterministic.
 *
 * @param {{ ties: TradeSalience[] }} pair  the pairTradeSalience rollup
 * @param {string} primary                  the edge's primary relationshipType
 * @returns {Array<{ status: string, covert?: boolean }>}
 */
export function deriveSecondaryStatuses(pair, primary) {
  const battlefield = isBattlefieldPrimary(primary);
  /** @type {Map<string, { status: string, covert?: boolean }>} */
  const byStatus = new Map();
  for (const tie of (pair?.ties || [])) {
    if (!tie || !Number.isFinite(tie.salience) || tie.salience <= 0) continue;
    const good = normalizeGood(tie.commodityId);
    const label = String(good?.label || good?.sourceLabel || tie.commodityId || '');
    const isMateriel = MATERIEL_STATUS_PATTERN.test(label);
    // The NORMAL status this tie wants.
    let status;
    if (tie.critical) status = 'critical_supplier';
    else if (isMateriel) status = 'military_supplier';
    else if (tie.salience >= TRADE_SALIENCE_TUNING.VALUABLE_GATE) status = 'preferred_supplier';
    else status = 'trade_partner';

    if (battlefield) {
      // A battlefield primary forbids normal commerce — the only coherent tie is
      // a covert smuggling channel (the exception path). Downgrade + flag covert.
      if (isCompatible(primary, 'smuggling', { covert: true })) {
        byStatus.set('smuggling', { status: 'smuggling', covert: true });
      }
      continue;
    }
    // Non-battlefield: keep the status only if the overlay says it is coherent.
    if (isCompatible(primary, status)) {
      // Prefer the strongest status if multiple ties map to different ranks.
      if (!byStatus.has(status)) byStatus.set(status, { status });
    } else if (isCompatible(primary, 'trade_partner')) {
      // Fall back to a plain trade_partner if the richer status is incompatible
      // but plain commerce is allowed (e.g. a primary that allows trade but not
      // military_supplier).
      if (!byStatus.has('trade_partner')) byStatus.set('trade_partner', { status: 'trade_partner' });
    }
  }
  return [...byStatus.values()].sort((a, b) => codepoint(a.status, b.status));
}

/**
 * The per-edge secondary-status overlay map, codepoint-stable. Keyed by edge key,
 * value = the B0-validated `{ status, covert? }[]` overlay derived from each edge's
 * salience ties. Only edges WITH at least one coherent status are emitted ⇒ a
 * legacy/no-tie edge is omitted (byte-neutral). Stored as a LAYERED overlay on the
 * relationshipState (never replacing the primary `relationshipType`).
 *
 * @param {any} snapshot @param {any} worldState @param {{ tick?: number }} [ctx]
 * @returns {Record<string, Array<{ status: string, covert?: boolean }>>}
 */
export function computeSecondaryStatusOverlay(snapshot, worldState, ctx = {}) {
  /** @type {Record<string, Array<{ status: string, covert?: boolean }>>} */
  const overlay = {};
  const states = snapshot?.worldState?.relationshipStates || worldState?.relationshipStates || {};
  const tick = Number.isFinite(ctx.tick) ? Number(ctx.tick) : (worldState?.tick || 0);
  for (const edge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const key = edge?.id || `rel.${edge?.from}.${edge?.to}`;
    const from = edge?.from || edge?.source || edge?.a;
    const to = edge?.to || edge?.target || edge?.b;
    if (from == null || to == null) continue;
    const primary = String(states[key]?.relationshipType || edge?.relationshipType || 'neutral');
    const pair = pairTradeSalience(snapshot, worldState, from, to, { tick, relationshipType: primary });
    if (!pair.ties.length) continue;
    const statuses = deriveSecondaryStatuses(pair, primary);
    if (statuses.length) overlay[key] = statuses;
  }
  return overlay;
}
