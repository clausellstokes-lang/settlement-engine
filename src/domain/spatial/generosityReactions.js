/**
 * generosityReactions.js — THE REACTION LEDGER (E1a; design §3 — law 2, both
 * directions, all parties). "Every action has an equal-and-opposite reaction": giving
 * BINDS the receiver (gratitude scaled by the giver's sacrifice — the widow's mite) and
 * costs the giver at home; refusing WOUNDS the refused party through THEIR beliefs (a
 * known hardship is forgiven, an imagined comfort reads as betrayal). No free kindness.
 *
 * This is the WRITE side the generosityEV verdict feeds: the widow's-mite gratitude, the
 * OBLIGATION sub-ledger (a small {from,to,kind,magnitude,mintTick} record ≤1 active per
 * pair per kind, decaying slowly, consumed by repayment — nested under spatialLedgers,
 * ZERO eager bytes, drop-when-empty ⇒ byte-identical-dormant), the refusal memory with
 * FOG-MEDIATED forgiveness (§3.3 — the math here; the belief-map wiring lands with E1c),
 * the typed incidents that feed relationshipMemory (relief_given/received/refused,
 * credit_repaid/defaulted, refuge_granted — the existing incident machinery, no new
 * memory system), and the §G named-tie CLAMPED micro-history (privileged edges, bounded
 * modulators, never actors).
 *
 * CONSTITUTIONAL: PURE + LAZY spatial leaf (no worldPulse import); explicit now (no
 * Date); the obligation fold is interval-invariant + self-pruning (mirrors
 * foldNarrativeTempo); conservation is the caller's (this emits the reaction records,
 * not the stock transfer); bounded everywhere; the §G tie influence is house-clamped
 * (design §G.2.1: a dense web matters; a single friendship never overturns strategy).
 */

import { clamp, clamp01 } from '../../kernel/math.js';

// ── Tuning (documented; retuned in the E1a soak) ──────────────────────────────
export const REACTION_TUNING = Object.freeze({
  // Widow's-mite gratitude (§3.1): gratitude ∝ need-relieved × the giver's margin
  // SACRIFICE. A poor friend's small gift binds tighter than a rich state's surplus dump.
  // GRATITUDE_MITE weights the sacrifice multiplier (1 + MITE·sacrifice), so a costly gift
  // can bind up to (1+MITE)× a costless one. A gift that travelled a named TIE binds
  // faster (§G.1): a bounded TIE_BIND lift.
  GRATITUDE_MITE: 1.0,
  TIE_BIND: 0.25,

  // The obligation ledger: slow decay per tick (the old debt lingers — "the flood-year"),
  // a magnitude cap (≤1 active per pair per kind, a second relief DEEPENS one record), and
  // the prune epsilon (a drained record drops ⇒ dormant). Evil giving mints at a PREDATORY
  // weight (§2.1 / scenario 3): the leverage intent inflates the recorded magnitude.
  OBLIGATION_DECAY: 0.02,
  OBLIGATION_CAP: 1.0,
  OBLIGATION_EPS: 0.02,
  PREDATORY_WEIGHT: 0.5, // leverage intent 1.0 ⇒ up to +50% recorded obligation

  // Refusal (§3.2/§3.3): damage = desperation × (1 − forgiveness). Fog-forgiveness reads
  // the refused party's BELIEF of the giver's context — a believed-hungry, army-burdened
  // giver is largely forgiven; a giver believed fat behind full walls reads as betrayal.
  REFUSAL_FORGIVE_SCARCITY: 0.6,
  REFUSAL_FORGIVE_MILITARY: 0.4,

  // Moral-hazard buffer discipline (§2.2/scenario 10): repeated relief decays the
  // RECEIVER's own granary-discipline target (bounded), recovering when aid stops.
  BUFFER_DECAY: 0.12,
  BUFFER_RECOVER: 0.08,
  BUFFER_FLOOR: 0.4,   // discipline never decays below this (a bounded moral hazard)
  BUFFER_EPS: 0.02,

  // The §G named-tie CLAMP (design §G.2.1): the total named-tie influence on any single
  // decision is capped (the house clamp idiom) — a display-band tuning rail candidate. The
  // per-tie weight sets how fast the web saturates (a few strong ties reach the cap).
  TIE_INFLUENCE_CAP: 0.2,
  TIE_PER_WEIGHT: 0.08,

  // CREDIT MATURITY (§3.4 — E1b): a credit obligation (kind 'credit', minted when the
  // giver's leverage prefers a LOAN over a gift) MATURES CREDIT_TERM ticks after mint and
  // resolves to REPAYMENT (a solvent, non-malicious debtor clears the debt — gratitude +
  // trust) or DEFAULT (an insolvent OR malicious debtor — a grievance, the casus-belli
  // seam, and the lender's hardened heart). Deterministic: the debtor's solvency/malice
  // LOAD the outcome (§H — no flat draw). A GIFT obligation (kind 'grain_relief') never
  // matures; it only decays slowly.
  CREDIT_TERM: 12,                // ticks to maturity ("a season or two")
  CREDIT_REPAY_SOLVENCY_AT: 0.45, // debtor food/prosperity headroom at/above which repayment is affordable
  CREDIT_DEFAULT_MALICE_AT: 0.6,  // a debtor this malicious DEFAULTS even when solvent (won't pay)
  CREDIT_REPAY_TRUST: 0.5,        // the credit_repaid incident severity (gratitude + trust deposit)
  CREDIT_DEFAULT_GRIEVANCE: 0.7,  // the credit_defaulted incident severity (betrayal-class grievance)

  // THE LENDER'S APPETITE-TO-LEND accumulator (§3.4, the merchantAppetite pattern —
  // "hardened hearts, mechanically"; the bufferDiscipline sibling idiom): a default
  // suffered DECAYS the creditor's appetite (bounded by the floor — a burned lender never
  // fully stops), recovering slowly toward full and pruning when recovered. Read to
  // DAMPEN the credit-preference (a burned lender extends new credit more warily).
  LEND_APPETITE_HIT: 0.35,        // appetite drop per default suffered
  LEND_APPETITE_RECOVER: 0.05,    // slow recovery per tick without a default
  LEND_APPETITE_FLOOR: 0.2,       // bounded — a burned lender never fully stops lending
  LEND_APPETITE_EPS: 0.02,

  // THE TRADE-OVERTURE GIVE-STREAM accumulator (§9 TRADE / design A4 — E1d, the
  // bufferDiscipline/lendAppetite sibling idiom): a directed (giver→receiver) warmth
  // scalar that RISES on every gift this pair exchanges (a sustained aid corridor) and
  // slowly DECAYS on a silent tick — "the grain road of the famine year becomes the silk
  // road of the peace". When it crosses the mover's open threshold (with dwell) the giver
  // opens a TRADE OVERTURE: a byte-neutral trust-nudge into the existing
  // neutral_to_trade_partner evolution rule (NEVER an autonomous edge). Drop-when-cold ⇒
  // byte-identical-dormant. A gift gains more warmth than silence sheds (aid corridors
  // warm faster than they cool).
  TRADE_OVERTURE_GAIN: 0.2,       // warmth added per gift-bearing tick this pair exchanges
  TRADE_OVERTURE_DECAY: 0.08,     // warmth shed per silent tick (slower than the gain)
  TRADE_OVERTURE_EPS: 0.02,       // a warmth at/under this is cold ⇒ pruned (drop-when-empty)
});

/** The typed relief incident kinds (§2.1) — the existing incident machinery, extended.
 *  'trade_warmth' (E1d) is the MARKET-twin row: a PURCHASE closed between the pair (the
 *  post-REFUSE "you won't give? I'll pay" fall-through) OR a sustained aid-corridor
 *  warming into a trade overture — a positive, low-severity relationship deposit that is
 *  NOT a debt (a sale/trade clears; no obligation minted). */
export const RELIEF_INCIDENT_KINDS = Object.freeze([
  'relief_given', 'relief_received', 'relief_refused', 'credit_repaid', 'credit_defaulted', 'refuge_granted',
  'trade_warmth',
]);

// ── Small pure helpers (clamp/clamp01 are the sanctioned kernel primitives) ─────
/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {number} v @returns {number} 4-dp round for byte-tidy persisted floats */
function round4(v) {
  return Math.round(v * 10000) / 10000;
}

// ── THE WIDOW'S MITE (§3.1) ────────────────────────────────────────────────────
/**
 * The gratitude a relief deposits: gratitude ∝ need-relieved × the giver's margin
 * SACRIFICE (the widow's-mite rule — a poor friend's small gift binds tighter than a
 * rich state's surplus dump; both margins are already computed, one multiplication buys
 * the human texture). A gift that travelled a named TIE binds faster (§G.1). Returns
 * gratitude in [0,1]. Pure.
 * @param {{ needRelieved01?: number, giverMarginSacrifice01?: number, throughTie?: boolean }} [inputs]
 * @returns {number}
 */
export function gratitudeDeposit({ needRelieved01 = 0, giverMarginSacrifice01 = 0, throughTie = false } = {}) {
  const need = clamp01(finiteNumber(needRelieved01, 0));
  const sacrifice = clamp01(finiteNumber(giverMarginSacrifice01, 0));
  const mite = 1 + REACTION_TUNING.GRATITUDE_MITE * sacrifice; // sacrifice deepens the bond
  const tie = throughTie === true ? 1 + REACTION_TUNING.TIE_BIND : 1;
  return round4(clamp01(need * mite * tie / (1 + REACTION_TUNING.GRATITUDE_MITE + REACTION_TUNING.TIE_BIND)));
}

/**
 * The giver's margin SACRIFICE for a relief (the widow's-mite numerator): how much the
 * gift cost RELATIVE to the giver's headroom. A gift from a thin reserve is a large
 * sacrifice; the same bushels from a deep surplus, small. Seasonal margin (autumn before
 * the hungry gap) makes the same gift a larger sacrifice (§5.8). Returns [0,1]. Pure.
 * @param {{ magnitudeFraction01?: number, giverHeadroom01?: number, seasonalScarcity01?: number }} [inputs]
 * @returns {number}
 */
export function giverMarginSacrifice({ magnitudeFraction01 = 0, giverHeadroom01 = 1, seasonalScarcity01 = 0 } = {}) {
  const mag = clamp01(finiteNumber(magnitudeFraction01, 0));
  const headroom = clamp01(finiteNumber(giverHeadroom01, 1));
  const season = clamp01(finiteNumber(seasonalScarcity01, 0));
  // Cost relative to headroom: giving X out of a thin reserve hurts more. Seasonal
  // scarcity lifts the felt sacrifice (giving when giving is dear).
  const base = mag / (headroom + 0.15); // +0.15 so a near-empty reserve doesn't divide-by-zero
  return round4(clamp01(base * (1 + 0.4 * season)));
}

// ── THE OBLIGATION SUB-LEDGER (§3.1) — fold + prune, drop-when-empty ────────────
/**
 * @typedef {Object} ObligationRecord
 * @property {string} from       the DEBTOR (the party who received the relief and now owes)
 * @property {string} to         the CREDITOR (the giver the obligation is owed to)
 * @property {string} kind       the instrument kind (grain_relief / credit / …)
 * @property {number} magnitude  the outstanding obligation in [0,1]
 * @property {number} mintTick   the tick the obligation was first minted
 * @property {number} lastTick   the tick the record last advanced
 * @property {boolean} [predatory] minted at a predatory (leverage) weight (§2.1 / scenario 3)
 */

/** The stable record key: one active obligation per (debtor, creditor, kind). */
/** @param {string} from @param {string} to @param {string} kind @returns {string} */
export function obligationKey(from, to, kind) {
  return `${String(from)}:${String(to)}:${String(kind)}`;
}

/**
 * The predatory-weighted mint magnitude (§2.1 / scenario 3): an evil/ambitious giver
 * records the obligation HEAVIER than the grain's face value — the debt is the asset it
 * was after. Leverage intent inflates the base magnitude up to +PREDATORY_WEIGHT. Pure.
 * @param {{ baseMagnitude01?: number, leverageIntent01?: number }} [inputs] @returns {number}
 */
export function obligationMintMagnitude({ baseMagnitude01 = 0, leverageIntent01 = 0 } = {}) {
  const base = clamp01(finiteNumber(baseMagnitude01, 0));
  const lev = clamp01(finiteNumber(leverageIntent01, 0));
  return round4(clamp01(base * (1 + REACTION_TUNING.PREDATORY_WEIGHT * lev)));
}

/** @param {ObligationRecord|null|undefined} rec @returns {ObligationRecord|null} */
function normalizeObligation(rec) {
  if (!rec || typeof rec !== 'object') return null;
  const from = String(rec.from ?? '');
  const to = String(rec.to ?? '');
  const kind = String(rec.kind ?? '');
  const magnitude = finiteNumber(rec.magnitude, NaN);
  if (!from || !to || !kind || !Number.isFinite(magnitude)) return null;
  return {
    from, to, kind,
    magnitude: clamp01(magnitude),
    mintTick: Math.max(0, Math.floor(finiteNumber(rec.mintTick, 0))),
    lastTick: Math.max(0, Math.floor(finiteNumber(rec.lastTick, 0))),
    ...(rec.predatory === true ? { predatory: true } : {}),
  };
}

/**
 * Fold this tick's obligation mints + repayments into the next obligations ledger, decaying
 * every record slowly and self-pruning to null when drained (so an emptied world stays
 * byte-identical-dormant — the foldNarrativeTempo idiom). A mint UPSERTS the ≤1 record for
 * its (debtor, creditor, kind), DEEPENING an existing debt (capped); a repayment reduces
 * it; a record at/under EPS is dropped. Returns the next ledger record-map, or NULL when
 * empty. Pure.
 * @param {Record<string, unknown>|null|undefined} prevLedger  the obligations sub-ledger (key → ObligationRecord)
 * @param {Object} args
 * @param {ReadonlyArray<ObligationRecord>} [args.mints]        new/deepened obligations this tick
 * @param {ReadonlyArray<{ from: string, to: string, kind: string, amount: number }>} [args.repayments]  repayments/defaults consuming obligations
 * @param {number} args.now                                     the tick (window basis + lastTick stamp)
 * @param {number} [args.decayPerTick]                          slow decay (default OBLIGATION_DECAY)
 * @returns {Record<string, ObligationRecord>|null}
 */
export function foldObligations(prevLedger, args) {
  const { mints = [], repayments = [], now, decayPerTick } = args || {};
  const tick = Math.max(0, Math.floor(finiteNumber(now, 0)));
  const decay = clamp01(finiteNumber(decayPerTick, REACTION_TUNING.OBLIGATION_DECAY));
  /** @type {Record<string, ObligationRecord>} */
  const draft = {};
  const src = prevLedger && typeof prevLedger === 'object' && !Array.isArray(prevLedger)
    ? /** @type {Record<string, unknown>} */ (prevLedger) : {};
  // Decay every carried record.
  for (const key of Object.keys(src)) {
    const rec = normalizeObligation(/** @type {ObligationRecord} */ (src[key]));
    if (!rec) continue;
    draft[key] = { ...rec, magnitude: clamp01(rec.magnitude * (1 - decay)) };
  }
  // Mints: upsert (deepen an existing debt, capped; keep the original mintTick).
  for (const m of mints || []) {
    const rec = normalizeObligation(m);
    if (!rec) continue;
    const key = obligationKey(rec.from, rec.to, rec.kind);
    const existing = draft[key];
    const magnitude = clamp(
      (existing ? existing.magnitude : 0) + rec.magnitude,
      0, REACTION_TUNING.OBLIGATION_CAP,
    );
    draft[key] = {
      from: rec.from, to: rec.to, kind: rec.kind,
      magnitude,
      mintTick: existing ? existing.mintTick : tick,
      lastTick: tick,
      ...(rec.predatory === true || existing?.predatory === true ? { predatory: true } : {}),
    };
  }
  // Repayments/defaults: consume the outstanding obligation.
  for (const rp of repayments || []) {
    if (!rp || typeof rp !== 'object') continue;
    const key = obligationKey(String(rp.from), String(rp.to), String(rp.kind));
    const existing = draft[key];
    if (!existing) continue;
    const magnitude = clamp01(existing.magnitude - Math.max(0, finiteNumber(rp.amount, 0)));
    draft[key] = { ...existing, magnitude, lastTick: tick };
  }
  // Prune drained records; round survivors.
  /** @type {Record<string, ObligationRecord>} */
  const next = {};
  for (const key of Object.keys(draft).sort()) {
    const rec = draft[key];
    if (rec.magnitude <= REACTION_TUNING.OBLIGATION_EPS) continue;
    next[key] = { ...rec, magnitude: round4(rec.magnitude) };
  }
  return Object.keys(next).length ? next : null;
}

/** Is there a live obligation between a pair (either direction) in the ledger? (feeds the
 *  §0.1 gate — a standing debt keeps the channel open). Pure. @returns {boolean}
 * @param {Record<string, unknown>|null|undefined} ledger @param {string} a @param {string} b */
export function hasLiveObligation(ledger, a, b) {
  if (!ledger || typeof ledger !== 'object' || Array.isArray(ledger)) return false;
  const A = String(a);
  const B = String(b);
  for (const key of Object.keys(ledger)) {
    const rec = normalizeObligation(/** @type {ObligationRecord} */ (/** @type {Record<string, unknown>} */ (ledger)[key]));
    if (!rec) continue;
    if (rec.magnitude <= REACTION_TUNING.OBLIGATION_EPS) continue;
    if ((rec.from === A && rec.to === B) || (rec.from === B && rec.to === A)) return true;
  }
  return false;
}

// ── REFUSAL + FOG-MEDIATED FORGIVENESS (§3.2 / §3.3) ───────────────────────────
/**
 * FOG-MEDIATED forgiveness (§3.3 — the signature mechanic): the refused party's judgment
 * of a refusal is weighted by what they BELIEVE about the giver's context. Rumours of the
 * giver's own hunger and deployed army LARGELY FORGIVE the refusal ("they had nothing to
 * send"); stale/wrong information that the giver sat fat behind full walls reads the same
 * refusal as BETRAYAL. Returns the forgiveness factor in [0,1] (1 = fully forgiven). The
 * belief-map wiring lands with E1c; the math is here. Pure.
 * @param {{ believedGiverScarcity01?: number, believedGiverMilitaryLoad01?: number }} [inputs]
 * @returns {number}
 */
export function fogForgiveness({ believedGiverScarcity01 = 0, believedGiverMilitaryLoad01 = 0 } = {}) {
  const scarcity = clamp01(finiteNumber(believedGiverScarcity01, 0));
  const military = clamp01(finiteNumber(believedGiverMilitaryLoad01, 0));
  const T = REACTION_TUNING;
  return round4(clamp01(T.REFUSAL_FORGIVE_SCARCITY * scarcity + T.REFUSAL_FORGIVE_MILITARY * military));
}

/**
 * The REFUSAL damage banked by the refused party (§3.2): scaled by their desperation AND
 * discounted by the fog-forgiveness. A desperate refusal believed unjust wounds deeply; a
 * refusal believed unavoidable barely marks. A refused VASSAL reads an additional
 * legitimacy breach of the patron duty (vassalBreach lift). Returns damage in [0,1]. Pure.
 * @param {{ refusedDesperation01?: number, forgiveness01?: number, vassalBreach?: boolean }} [inputs]
 * @returns {number}
 */
export function refusalDamage({ refusedDesperation01 = 0, forgiveness01 = 0, vassalBreach = false } = {}) {
  const desperation = clamp01(finiteNumber(refusedDesperation01, 0));
  const forgiveness = clamp01(finiteNumber(forgiveness01, 0));
  const breach = vassalBreach === true ? 0.15 : 0;
  return round4(clamp01(desperation * (1 - forgiveness) + breach * desperation));
}

// ── TYPED INCIDENTS (§2.1) — the relationshipMemory rows the reaction writes ────
/**
 * Build a typed relief INCIDENT row for relationshipMemory (the existing incident
 * machinery — recentIncidents; scored by memoryEntry via {tick, type, severity, summary}).
 * A generational-memory holder tag (people-held by default; seat-held only for
 * institutional ties — cohesion §F.6) rides along for the succession-softening rule. Pure.
 * @param {Object} args
 * @param {string} args.kind      one of RELIEF_INCIDENT_KINDS
 * @param {number} args.tick
 * @param {number} args.magnitude01
 * @param {string} [args.summary]
 * @param {'people_held'|'seat_held'} [args.holder]
 * @returns {{ tick: number, type: string, severity: number, summary: string, holder: string }|null}
 */
export function reliefIncident({ kind, tick, magnitude01, summary, holder = 'people_held' }) {
  if (!RELIEF_INCIDENT_KINDS.includes(String(kind))) return null;
  const severity = clamp01(finiteNumber(magnitude01, 0));
  const defaultSummary = {
    relief_given: 'Grain was sent in the lean season.',
    relief_received: 'Relief arrived when the granaries ran low.',
    relief_refused: 'The ask for relief was turned away.',
    credit_repaid: 'A grain-debt was repaid.',
    credit_defaulted: 'A grain-debt fell into default.',
    refuge_granted: 'Refuge was opened to the displaced.',
    trade_warmth: 'A trade was struck — the market warmed the relationship.',
  }[String(kind)] || 'A relief decision touched the relationship.';
  return {
    tick: Math.max(0, Math.floor(finiteNumber(tick, 0))),
    type: String(kind),
    severity: round4(severity),
    summary: String(summary || defaultSummary),
    holder: holder === 'seat_held' ? 'seat_held' : 'people_held',
  };
}

// ── §G NAMED-TIE CLAMPED MICRO-HISTORY ─────────────────────────────────────────
/**
 * The §G named-tie contribution to a bond (design §G.1 generosity hook): named ties add
 * a people-held micro-history (a caravan master owes a harbormaster) that feeds the
 * settlement-level bond as a BOUNDED contribution. Guardrail §G.2.1: the TOTAL named-tie
 * influence on any single decision is CLAMPED (the house clamp idiom) — a dense web
 * visibly matters; a single friendship never overturns strategy. Returns the clamped
 * contribution in [0, cap] and whether the clamp bit. Pure.
 * @param {ReadonlyArray<{ gratitude01?: number, strain01?: number }>|null|undefined} ties
 * @param {number} [cap]  the influence cap (default TIE_INFLUENCE_CAP)
 * @returns {{ contribution: number, capped: boolean }}
 */
export function tieContribution(ties, cap = REACTION_TUNING.TIE_INFLUENCE_CAP) {
  const list = Array.isArray(ties) ? ties : [];
  const ceiling = clamp01(finiteNumber(cap, REACTION_TUNING.TIE_INFLUENCE_CAP));
  let sum = 0;
  for (const t of list) {
    if (!t || typeof t !== 'object') continue;
    sum += clamp01(finiteNumber(t.gratitude01, 0)) - clamp01(finiteNumber(t.strain01, 0));
  }
  // Per-tie weight, then the HARD house clamp (§G.2.1): a handful of strong ties reaches the
  // cap (a dense web visibly matters); the clamp then bites (one friendship never overturns
  // strategy). `capped` reports whether the clamp actually bit.
  const raw = sum * REACTION_TUNING.TIE_PER_WEIGHT;
  const clamped = clamp(raw, -ceiling, ceiling);
  return { contribution: round4(clamped), capped: Math.abs(raw) >= ceiling - 1e-9 };
}

// ── MORAL-HAZARD BUFFER DISCIPLINE (§2.2 / scenario 10) ────────────────────────
/**
 * @typedef {Object} BufferDisciplineRecord
 * @property {number} discipline  the receiver's granary-discipline target in [BUFFER_FLOOR, 1]
 * @property {number} lastTick
 */

/**
 * Step the RECEIVER's granary-discipline under repeated relief (§2.2 dependency / scenario
 * 10): relief this tick DECAYS discipline (bounded by BUFFER_FLOOR — "why keep a full
 * granary when the neighbour always sends grain?"); a tick WITHOUT relief RECOVERS it
 * toward 1. Returns the next record, or NULL when discipline has recovered to full and
 * there is nothing to persist (the sparse-ledger prune). Pure.
 * @param {BufferDisciplineRecord|null|undefined} prior
 * @param {{ reliefThisTick?: boolean, now: number }} args
 * @returns {BufferDisciplineRecord|null}
 */
export function bufferDisciplineStep(prior, { reliefThisTick = false, now }) {
  const T = REACTION_TUNING;
  const tick = Math.max(0, Math.floor(finiteNumber(now, 0)));
  const prev = prior && typeof prior === 'object' ? clamp(finiteNumber(prior.discipline, 1), T.BUFFER_FLOOR, 1) : 1;
  let next;
  if (reliefThisTick === true) {
    next = clamp(prev - T.BUFFER_DECAY, T.BUFFER_FLOOR, 1);
  } else {
    next = clamp(prev + T.BUFFER_RECOVER, T.BUFFER_FLOOR, 1);
  }
  if (!reliefThisTick && next >= 1 - T.BUFFER_EPS) return null; // recovered ⇒ prune
  return { discipline: round4(next), lastTick: tick };
}

// ── CREDIT MATURITY + THE LENDER'S APPETITE (§3.4 — E1b) ───────────────────────
/**
 * Resolve a matured CREDIT obligation (§3.4). A 'credit'-kind obligation matures
 * CREDIT_TERM ticks after mint, then resolves to 'repaid' (a solvent, non-malicious debtor
 * clears the debt — gratitude + trust) or 'defaulted' (an insolvent OR malicious debtor —
 * a grievance, the casus-belli seam, the lender's hardened heart). Before maturity it is
 * 'pending'; a GIFT obligation (kind 'grain_relief') never matures (returns 'pending'
 * forever — it only decays). DETERMINISTIC: the debtor's solvency/malice LOAD the outcome
 * (§H — no flat draw; the caller supplies both as live reads). Pure, total.
 * @param {{ obligation?: ObligationRecord|null, now?: number, debtorSolvency01?: number, debtorMalice01?: number, term?: number }} args
 * @returns {'pending'|'repaid'|'defaulted'}
 */
export function creditMaturityResolution({ obligation = null, now = 0, debtorSolvency01 = 0, debtorMalice01 = 0, term } = {}) {
  const rec = normalizeObligation(obligation);
  if (!rec || rec.kind !== 'credit') return 'pending'; // only credit matures; gifts just decay
  const tick = Math.max(0, Math.floor(finiteNumber(now, 0)));
  const T = REACTION_TUNING;
  const maturityTerm = Math.max(1, Math.floor(finiteNumber(term, T.CREDIT_TERM)));
  if (tick - rec.mintTick < maturityTerm) return 'pending';
  const solvency = clamp01(finiteNumber(debtorSolvency01, 0));
  const malice = clamp01(finiteNumber(debtorMalice01, 0));
  const canPay = solvency >= T.CREDIT_REPAY_SOLVENCY_AT;   // insolvent ⇒ can't pay
  const willPay = malice < T.CREDIT_DEFAULT_MALICE_AT;     // malicious ⇒ won't pay
  return (canPay && willPay) ? 'repaid' : 'defaulted';
}

/**
 * @typedef {Object} LendAppetiteRecord
 * @property {number} appetite  the lender's appetite-to-lend in [LEND_APPETITE_FLOOR, 1] (1 = unburned)
 * @property {number} lastTick
 */

/**
 * Step a LENDER's appetite-to-lend (§3.4, the merchantAppetite accumulator pattern —
 * "hardened hearts, mechanically"; the bufferDiscipline sibling idiom): a default suffered
 * this tick DECAYS it (bounded by LEND_APPETITE_FLOOR — a burned lender never fully stops),
 * a tick without a default RECOVERS it toward full. Returns the next record, or NULL when
 * recovered to full (drop-when-empty prune — the ledger drains to absent). Pure, total.
 * @param {LendAppetiteRecord|null|undefined} prior
 * @param {{ defaultedThisTick?: boolean, now: number }} args
 * @returns {LendAppetiteRecord|null}
 */
export function lendAppetiteStep(prior, { defaultedThisTick = false, now }) {
  const T = REACTION_TUNING;
  const tick = Math.max(0, Math.floor(finiteNumber(now, 0)));
  const prev = prior && typeof prior === 'object' ? clamp(finiteNumber(prior.appetite, 1), T.LEND_APPETITE_FLOOR, 1) : 1;
  const next = defaultedThisTick === true
    ? clamp(prev - T.LEND_APPETITE_HIT, T.LEND_APPETITE_FLOOR, 1)
    : clamp(prev + T.LEND_APPETITE_RECOVER, T.LEND_APPETITE_FLOOR, 1);
  if (!defaultedThisTick && next >= 1 - T.LEND_APPETITE_EPS) return null; // recovered ⇒ prune
  return { appetite: round4(next), lastTick: tick };
}

/**
 * Read a lender's appetite-to-lend from the (sparse) ledger, or 1 (unburned baseline) when
 * absent — a lender with no default history lends at full appetite (mirrors appetiteOf). The
 * kernel DAMPENS the credit-preference by this. Pure, total.
 * @param {Record<string, unknown>|null|undefined} ledger @param {string} lenderId @returns {number}
 */
export function lendAppetiteOf(ledger, lenderId) {
  const ns = ledger && typeof ledger === 'object' && !Array.isArray(ledger)
    ? /** @type {Record<string, unknown>} */ (ledger) : null;
  const rec = ns ? ns[String(lenderId)] : null;
  const level = rec && typeof rec === 'object' && !Array.isArray(rec)
    ? finiteNumber(/** @type {Record<string, unknown>} */ (rec).appetite, NaN) : NaN;
  return Number.isFinite(level) ? clamp(level, REACTION_TUNING.LEND_APPETITE_FLOOR, 1) : 1;
}

// ── THE TRADE-OVERTURE GIVE-STREAM (§9 TRADE / design A4 — E1d) ─────────────────
/**
 * @typedef {Object} TradeOvertureRecord
 * @property {number} warmth    the directed give-stream warmth in [0,1] (the corridor strength)
 * @property {number} sinceTick the tick warmth first accumulated (the dwell clock — "sustained")
 * @property {number} lastTick  the tick this record last advanced
 */

/**
 * Step a directed (giver→receiver) TRADE-OVERTURE warmth accumulator (the merchantAppetite/
 * bufferDiscipline sibling idiom, §9 TRADE): a gift this tick RAISES warmth (TRADE_OVERTURE_GAIN),
 * a silent tick lets it slowly DECAY (TRADE_OVERTURE_DECAY, gentler than the gain — aid corridors
 * warm faster than they cool). Returns the next record, or NULL when warmth has drained to cold
 * (drop-when-empty prune ⇒ the ledger drains to absent — byte-identical-dormant). The dwell clock
 * (sinceTick) is carried from the prior; a cold-then-reheated pair restarts it. Pure, total.
 * @param {TradeOvertureRecord|null|undefined} prior
 * @param {{ gaveThisTick?: boolean, now: number }} args
 * @returns {TradeOvertureRecord|null}
 */
export function tradeOvertureStep(prior, { gaveThisTick = false, now }) {
  const T = REACTION_TUNING;
  const tick = Math.max(0, Math.floor(finiteNumber(now, 0)));
  const had = prior && typeof prior === 'object';
  const prev = had ? clamp01(finiteNumber(prior.warmth, 0)) : 0;
  const next = gaveThisTick === true
    ? clamp01(prev + T.TRADE_OVERTURE_GAIN)
    : clamp01(prev - T.TRADE_OVERTURE_DECAY);
  if (next <= T.TRADE_OVERTURE_EPS) return null; // cold ⇒ prune (drop-when-empty)
  // Carry the dwell clock while warm; (re)start it when the record first (re)appears.
  const sinceTick = had && prev > T.TRADE_OVERTURE_EPS ? Math.max(0, Math.floor(finiteNumber(prior.sinceTick, tick))) : tick;
  return { warmth: round4(next), sinceTick, lastTick: tick };
}

/**
 * Read a directed pair's trade-overture warmth from the (sparse) ledger, or 0 when absent
 * (a pair with no give-stream history is cold). Pure, total.
 * @param {Record<string, unknown>|null|undefined} ledger @param {string} key  the `giver:receiver` composite
 * @returns {number}
 */
export function tradeOvertureWarmthOf(ledger, key) {
  const ns = ledger && typeof ledger === 'object' && !Array.isArray(ledger)
    ? /** @type {Record<string, unknown>} */ (ledger) : null;
  const rec = ns ? ns[String(key)] : null;
  const w = rec && typeof rec === 'object' && !Array.isArray(rec)
    ? finiteNumber(/** @type {Record<string, unknown>} */ (rec).warmth, NaN) : NaN;
  return Number.isFinite(w) ? clamp01(w) : 0;
}
