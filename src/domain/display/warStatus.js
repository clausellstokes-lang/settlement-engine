/**
 * domain/display/warStatus.js — read-side projection of the LIVE geopolitical
 * state (war / siege / trade-war / disposition / faith) for the world-map UI,
 * the chronicle grounding, and the gallery realm-arc summary (SUBSYSTEM
 * INTEGRATION PLAN §S3/§S4).
 *
 * PRESENTATION ONLY. Nothing here mutates worldState, forks rng, or reads a
 * wall clock — it is a pure projection of the already-computed live ledgers:
 *
 *   - worldState.deployments      — active armies ({ targetId, sinceTick, role })
 *   - worldState.tradeWarState    — per-prize primary-supplier crown + cooldown
 *   - worldState.dispositionStats — cross-settlement win/loss disposition memory
 *   - worldState.pantheon         — per-deity faith ledger (R4, conditional)
 *   - regionalGraph war_front     — the live siege coalition (besiegers per target)
 *   - regionalGraph trade_dependency goods — the contested commodity
 *
 * INERT, NOT CRASH, WHEN ABSENT. Every reader tolerates a missing ledger / graph
 * (a no-war, no-deity campaign) and returns an empty result — never throws. A
 * dormant campaign therefore renders byte-identically (the panels render nothing
 * extra; the helpers all return `[]` / `null`).
 *
 * DETERMINISM. Every list output is codepoint-sorted so the order is stable
 * regardless of Map/Object iteration order.
 *
 * @typedef {{ targetId?: any, sinceTick?: number, role?: string }} Deployment
 */

/** @param {any} a @param {any} b @returns {number} */
const codepoint = (a, b) => (String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0);

/**
 * The confirmed war_front channels on a regional graph, as { from, to } pairs.
 * Tolerates an absent graph / channels array.
 * @param {any} graph
 * @returns {Array<{ from: string, to: string, strength: number, visibility: string }>}
 */
function confirmedWarFronts(graph) {
  /** @type {Array<{ from: string, to: string, strength: number, visibility: string }>} */
  const out = [];
  const channels = Array.isArray(graph?.channels) ? graph.channels : [];
  for (const channel of channels) {
    if (channel?.type !== 'war_front') continue;
    if (channel.status !== 'confirmed') continue;
    if (channel.from == null || channel.to == null) continue;
    out.push({
      from: String(channel.from),
      to: String(channel.to),
      strength: Number.isFinite(channel.strength) ? channel.strength : 0.5,
      visibility: channel.visibility || 'public',
    });
  }
  return out;
}

/**
 * The live SIEGES on the map: one entry per besieged target, naming its coalition
 * (the union of war_front besiegers, codepoint-sorted) and any deployment-tracked
 * attackers that have not yet minted a front. The coalition is the STORY the
 * chronicle/panel names; a single-besieger siege still surfaces (coalition of 1).
 *
 * @param {Object} args
 * @param {any} args.worldState
 * @param {any} [args.regionalGraph]  the live regional graph (war_front source).
 * @returns {Array<{ targetId: string, coalition: string[], frontCount: number, visibility: string }>}
 *   codepoint-sorted by targetId; empty when no sieges are live.
 */
export function liveSieges({ worldState, regionalGraph } = /** @type {any} */ ({})) {
  const fronts = confirmedWarFronts(regionalGraph);
  /** @type {Map<string, Set<string>>} */
  const besiegersByTarget = new Map();
  /** @type {Map<string, string>} */
  const visibilityByTarget = new Map();
  for (const front of fronts) {
    const set = besiegersByTarget.get(front.to) || new Set();
    set.add(front.from);
    besiegersByTarget.set(front.to, set);
    // A target is GM-concealed only if EVERY front into it is concealed; one
    // public front makes the siege public. 'public' is the most-visible tier.
    const prior = visibilityByTarget.get(front.to);
    if (prior == null || front.visibility === 'public') visibilityByTarget.set(front.to, front.visibility);
  }
  // Deployments whose target has no front yet (just-marched army) still count as
  // a besieger of that target so a fresh siege surfaces before its mint lands.
  const deployments = worldState?.deployments && typeof worldState.deployments === 'object'
    ? worldState.deployments
    : {};
  for (const attackerId of Object.keys(deployments).sort(codepoint)) {
    const dep = deployments[attackerId];
    if (!dep?.targetId) continue;
    const target = String(dep.targetId);
    const set = besiegersByTarget.get(target) || new Set();
    set.add(String(attackerId));
    besiegersByTarget.set(target, set);
    if (!visibilityByTarget.has(target)) visibilityByTarget.set(target, 'public');
  }
  return [...besiegersByTarget.keys()].sort(codepoint).map(targetId => {
    const coalition = [...(besiegersByTarget.get(targetId) || new Set())].sort(codepoint);
    return {
      targetId,
      coalition,
      frontCount: coalition.length,
      visibility: visibilityByTarget.get(targetId) || 'public',
    };
  });
}

/**
 * The settlements currently fielding an army abroad, codepoint-sorted by home id.
 * @param {any} worldState
 * @returns {Array<{ homeId: string, targetId: string, sinceTick: number, role: string }>}
 */
export function activeDeployments(worldState) {
  const deployments = worldState?.deployments && typeof worldState.deployments === 'object'
    ? worldState.deployments
    : {};
  return Object.keys(deployments).sort(codepoint).map(homeId => {
    const dep = deployments[homeId] || {};
    return {
      homeId,
      targetId: dep.targetId != null ? String(dep.targetId) : '',
      sinceTick: Number.isFinite(dep.sinceTick) ? dep.sinceTick : 0,
      role: dep.role || 'siege',
    };
  }).filter(d => d.targetId);
}

/**
 * The live TRADE WARS: one entry per contested prize (`<buyer>:<commodity>`),
 * naming the current primary supplier (winnerId), the displaced incumbent, and —
 * when the regional graph carries the realigned `trade_dependency` channel — the
 * human commodity label (the STORY the chronicle names). Only prizes that have
 * actually FLIPPED at least once are returned (a never-contested supplier is not
 * a "trade war"); a prize with `lastFlipTick != null` qualifies.
 *
 * @param {Object} args
 * @param {any} args.worldState
 * @param {any} [args.regionalGraph]  the live graph (trade_dependency goods labels).
 * @returns {Array<{ prizeId: string, buyerId: string, commodityId: string, commodityLabel: string, winnerId: string, incumbentId: string, lastFlipTick: number }>}
 *   codepoint-sorted by prizeId; empty when no trade war is live.
 */
export function liveTradeWars({ worldState, regionalGraph } = /** @type {any} */ ({})) {
  const state = worldState?.tradeWarState && typeof worldState.tradeWarState === 'object'
    ? worldState.tradeWarState
    : {};
  const goodsLabels = commodityLabelsByPair(regionalGraph);
  /** @type {Array<{ prizeId: string, buyerId: string, commodityId: string, commodityLabel: string, winnerId: string, incumbentId: string, lastFlipTick: number }>} */
  const out = [];
  for (const prizeId of Object.keys(state).sort(codepoint)) {
    const entry = state[prizeId] || {};
    if (entry.lastFlipTick == null) continue; // never contested → not a trade war
    // prizeId is `<stablePart(buyer)>:<stablePart(commodity)>`. The pieces are
    // sanitized (no embedded colons), so a single split recovers them.
    const idx = String(prizeId).indexOf(':');
    const buyerId = idx >= 0 ? String(prizeId).slice(0, idx) : String(prizeId);
    const commodityId = idx >= 0 ? String(prizeId).slice(idx + 1) : '';
    out.push({
      prizeId: String(prizeId),
      buyerId,
      commodityId,
      commodityLabel: goodsLabels.get(`${String(entry.winnerId)}->${buyerId}`)
        || goodsLabels.get(commodityId)
        || humanize(commodityId),
      winnerId: entry.winnerId != null ? String(entry.winnerId) : '',
      incumbentId: entry.incumbentId != null ? String(entry.incumbentId) : '',
      lastFlipTick: Number.isFinite(entry.lastFlipTick) ? entry.lastFlipTick : 0,
    });
  }
  return out;
}

/**
 * Build a `<from>-><to>` (and bare commodityId) → commodity label lookup from the
 * realigned trade_dependency channels' `goods`. Tolerates an absent graph.
 * @param {any} graph
 * @returns {Map<string, string>}
 */
function commodityLabelsByPair(graph) {
  /** @type {Map<string, string>} */
  const labels = new Map();
  const channels = Array.isArray(graph?.channels) ? graph.channels : [];
  for (const channel of channels) {
    if (channel?.type !== 'trade_dependency') continue;
    const goods = Array.isArray(channel.goods) ? channel.goods : [];
    for (const good of goods) {
      const id = good?.id != null ? String(good.id) : null;
      const label = good?.label || (id ? humanize(id) : null);
      if (!id || !label) continue;
      labels.set(id, label);
      if (channel.from != null && channel.to != null) {
        labels.set(`${String(channel.from)}->${String(channel.to)}`, label);
      }
    }
  }
  return labels;
}

/**
 * The cross-settlement disposition standings: settlements with a net win/loss
 * record, codepoint-sorted by id. A net-zero (or absent) ledger yields []; this
 * surfaces the AGGRESSORS and the BEATEN, not every settlement.
 * @param {any} worldState
 * @returns {Array<{ id: string, wins: number, losses: number, score: number }>}
 */
export function dispositionStandings(worldState) {
  const stats = worldState?.dispositionStats && typeof worldState.dispositionStats === 'object'
    ? worldState.dispositionStats
    : {};
  /** @type {Array<{ id: string, wins: number, losses: number, score: number }>} */
  const out = [];
  for (const id of Object.keys(stats).sort(codepoint)) {
    const entry = stats[id] || {};
    const wins = Number(entry.wins) || 0;
    const losses = Number(entry.losses) || 0;
    const score = Number.isFinite(entry.score) ? entry.score : wins - losses;
    if (!wins && !losses) continue;
    out.push({ id, wins, losses, score });
  }
  return out;
}

/**
 * Whether ANY live geopolitical status (war/trade/disposition) is present — the
 * gate the panels use to decide whether to render their live block at all. A
 * dormant campaign (no deployments, no flipped trade prize, no disposition
 * record) yields false ⇒ nothing renders ⇒ byte-identical.
 * @param {Object} args
 * @param {any} args.worldState
 * @param {any} [args.regionalGraph]
 * @returns {boolean}
 */
export function hasLiveWarState({ worldState, regionalGraph } = /** @type {any} */ ({})) {
  if (activeDeployments(worldState).length) return true;
  if (liveSieges({ worldState, regionalGraph }).length) return true;
  if (liveTradeWars({ worldState, regionalGraph }).length) return true;
  if (dispositionStandings(worldState).length) return true;
  return false;
}

/**
 * Resolve the live military status of ONE settlement from the live ledgers — what
 * SummaryTab's Faith & War block reads (the LIVE path the plan flags SummaryTab as
 * missing today). Returns the roles the settlement plays: besieger of (targets),
 * besieged by (a coalition), and an at-war / occupied flag. Null when the
 * settlement has no live military status.
 *
 * @param {Object} args
 * @param {any} args.settlementId
 * @param {any} args.worldState
 * @param {any} [args.regionalGraph]
 * @returns {{ besiegingTargets: string[], besiegedBy: string[], atWar: boolean } | null}
 */
export function settlementWarStatus({ settlementId, worldState, regionalGraph } = /** @type {any} */ ({})) {
  if (settlementId == null) return null;
  const id = String(settlementId);
  const sieges = liveSieges({ worldState, regionalGraph });
  const deployments = activeDeployments(worldState);

  const besiegingTargets = deployments
    .filter(d => d.homeId === id)
    .map(d => d.targetId)
    .sort(codepoint);
  const besiegedSelf = sieges.find(s => s.targetId === id);
  const besiegedBy = besiegedSelf ? besiegedSelf.coalition.filter(c => c !== id) : [];

  if (!besiegingTargets.length && !besiegedBy.length) return null;
  return { besiegingTargets, besiegedBy, atWar: true };
}

/** @param {any} value @returns {string} */
function humanize(value) {
  return String(value || '').replace(/_/g, ' ');
}

/**
 * The settlements currently under an OCCUPATION AUTHORITY — conquered nodes whose
 * most recent ruling-power transfer was a `conquest` (warDeployment.js mints a
 * `conquest`-cause power transfer when a siege falls; the provenance lands on
 * `powerStructure.previousGovernments`). The spatial overlay shades these nodes.
 *
 * Reads the EMBEDDED settlement snapshots only (presentation-only); a non-campaign
 * / no-war save carries no conquest provenance ⇒ [] (byte-identical off-state).
 * Codepoint-sorted by settlement id.
 *
 * @param {Array<{ id?: any, settlement?: any }>} [settlementItems]  saves / snapshot items
 * @returns {Array<{ id: string, occupier: string, sinceTick: number|null }>}
 */
export function occupiedSettlements(settlementItems) {
  const items = Array.isArray(settlementItems) ? settlementItems : [];
  /** @type {Array<{ id: string, occupier: string, sinceTick: number|null }>} */
  const out = [];
  for (const item of items) {
    const id = item?.id != null ? String(item.id) : (item?.settlement?.id != null ? String(item.settlement.id) : null);
    if (!id) continue;
    const prev = item?.settlement?.powerStructure?.previousGovernments;
    if (!Array.isArray(prev) || !prev.length) continue;
    // The most recent transfer (last entry) decides the current provenance — an
    // older conquest later overthrown by a coup is NOT a live occupation.
    const last = prev[prev.length - 1];
    if (!last || last.cause !== 'conquest') continue;
    out.push({
      id,
      occupier: item?.settlement?.powerStructure?.governingName
        || item?.settlement?.powerStructure?.government
        || 'occupation authority',
      sinceTick: Number.isFinite(last.tick) ? last.tick : null,
    });
  }
  return out.sort((a, b) => codepoint(a.id, b.id));
}

// ── War-exhaustion scar (Z2a) read-side ──────────────────────────────────────
// The NON-REVERTING per-home war-weariness scar (warDeployment.js): a 0..1 ledger
// (`worldState.warExhaustion[homeId]`) that ratchets up under sustained war and
// decays only slowly when the army comes home. EXHAUSTION_CONDITION_FLOOR (0.20)
// is the engine threshold at which the scar registers as a `war_exhaustion`
// condition — so a reading at/above it is genuinely "war-weary", below it is the
// recovering tail ("near peace"). These bands MIRROR that floor (they do not
// re-tune the engine); a deeper scar reads "exhausted".
const WAR_EXHAUSTION_FLOOR = 0.20;

/**
 * Human war-weariness band for a 0..1 war-exhaustion scar. Below the engine's
 * condition floor reads as recovery ("near peace"); at/above it the realm is
 * war-weary, and a deep scar is exhausted. Mirrors the warDeployment scar floor,
 * never re-tunes it.
 * @param {number} value 0..1
 * @returns {'rested'|'near peace'|'war-weary'|'exhausted'}
 */
export function warExhaustionBand(value) {
  const v = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
  if (v <= 0) return 'rested';
  if (v < WAR_EXHAUSTION_FLOOR) return 'near peace';
  if (v < 0.6) return 'war-weary';
  return 'exhausted';
}

/**
 * The raw 0..1 war-exhaustion scar for ONE settlement (the dossier/library
 * reader). 0 when the home carries no scar (dormant / no-war / absent ledger) —
 * never throws.
 * @param {Object} args
 * @param {any} args.settlementId
 * @param {any} args.worldState
 * @returns {number} 0..1
 */
export function settlementWarExhaustion({ settlementId, worldState } = /** @type {any} */ ({})) {
  if (settlementId == null) return 0;
  const ledger = worldState?.warExhaustion && typeof worldState.warExhaustion === 'object'
    ? worldState.warExhaustion
    : {};
  const raw = ledger[String(settlementId)];
  return Number.isFinite(raw) ? Math.max(0, Math.min(1, raw)) : 0;
}

/**
 * The cross-settlement WAR-WEARINESS standings: one entry per home carrying a
 * live war-exhaustion scar (`worldState.warExhaustion[homeId] > 0`), each with
 * its 0..1 value and a human band ("war-weary" / "near peace" / "exhausted"),
 * codepoint-sorted by id. A home with a zeroed/absent scar is omitted — this
 * surfaces the WAR-WEARY, not every settlement. Returns [] when the ledger is
 * dormant/absent ⇒ byte-identical off-state.
 *
 * Pure, rng-free, no worldState mutation. `snapshot` is accepted for signature
 * parity with the other warStatus selectors but is not required — the scar lives
 * entirely on worldState; when a snapshot is supplied it is used only to skip ids
 * the world no longer knows (a settlement removed from the campaign).
 *
 * @param {any} worldState
 * @param {any} [snapshot] optional worldSnapshot ({ byId } / { settlements }).
 * @returns {Array<{ id: string, warExhaustion: number, band: string }>}
 *   codepoint-sorted by id; [] when dormant.
 */
export function warExhaustionStandings(worldState, snapshot) {
  const ledger = worldState?.warExhaustion && typeof worldState.warExhaustion === 'object'
    ? worldState.warExhaustion
    : {};
  const known = knownIdSet(snapshot);
  /** @type {Array<{ id: string, warExhaustion: number, band: string }>} */
  const out = [];
  for (const id of Object.keys(ledger).sort(codepoint)) {
    if (known && !known.has(id)) continue;
    const raw = ledger[id];
    const value = Number.isFinite(raw) ? Math.max(0, Math.min(1, raw)) : 0;
    if (value <= 0) continue; // a zeroed scar is not war-weariness
    out.push({ id, warExhaustion: value, band: warExhaustionBand(value) });
  }
  return out;
}

/**
 * The set of settlement ids a snapshot knows, or null when no snapshot is given
 * (⇒ do not filter). Tolerates both the `byId` Map and a `settlements[]` array.
 * @param {any} snapshot
 * @returns {Set<string> | null}
 */
function knownIdSet(snapshot) {
  if (!snapshot) return null;
  if (snapshot.byId && typeof snapshot.byId.keys === 'function') {
    return new Set([...snapshot.byId.keys()].map(String));
  }
  if (Array.isArray(snapshot.settlements)) {
    return new Set(snapshot.settlements.map((/** @type {any} */ s) => String(s?.id)).filter(Boolean));
  }
  return null;
}
