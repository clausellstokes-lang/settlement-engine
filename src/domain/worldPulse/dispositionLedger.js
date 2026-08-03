/**
 * domain/worldPulse/dispositionLedger.js — the ONE ratcheted disposition ledger.
 *
 * A single shape + ratchet, instantiated TWICE:
 *  - worldState.dispositionStats — per settlement (aggressiveness memory)
 *  - worldState.pantheon         — per deity     (faith fortunes)
 *
 * An entry accumulates a signed win/loss `score`; `readDispositionMultiplier` turns
 * it into a centered-on-1.0 multiplier — EXACTLY 1.0 when the entry is absent or
 * net-zero, which is what keeps a legacy campaign (empty ledger) byte-identical at
 * the candidateBase chokepoint. Pure: no rng, no wall-clock, no mutation of inputs.
 *
 * Read/write timing (pinned across the substrate): callers READ last-tick ledger at
 * candidate-build and WRITE next-tick post-apply, so a contest that resolves on tick
 * N only colours behaviour from tick N+1 — never a half-updated mid-tick read.
 */

// Multiplier shape: ±MULTIPLIER_SPAN at full saturation, reached as |score| → SCORE_SAT.
const MULTIPLIER_SPAN = 0.5;
const SCORE_SAT = 8;
// Per-outcome score step; bounded accumulation so a long win streak saturates
// rather than exploding (determinism + balance: no runaway disposition).
const SCORE_MAX = 12;

// WR-2 extends the legacy score IN PLACE. The persisted channel stock is normalized
// around 0.5 (neutral), while the outer score remains the martial compatibility
// mirror used by every pre-WR2 caller. A twenty-year, week-scale half-life makes the
// memory generational without making it permanent; only resolved outcomes can push a
// stock away from neutral.
export const DISPOSITION_CHANNELS = Object.freeze([
  'martial',
  'mercantile',
  'diplomatic',
  'insular',
]);

// The bounded provenance vocabulary carried only on transition receipts. Producer
// modules may name one of these outcomes; arbitrary strings collapse to the honest
// generic rather than leaking engine tokens into prose or creating an open schema.
export const DISPOSITION_SOURCE_KINDS = Object.freeze([
  'resolved_outcome',
  'war_resolution',
  'trade_contest',
  'occupation_outcome',
  'treaty_held',
  'treaty_default',
  'treaty_repudiated',
  'mediation_landed',
  'coalition_reimbursement_paid',
  'coalition_reimbursement_unpaid',
  'coalition_settlement_profit',
  'coalition_settlement_honored',
  'coalition_settlement_shortfall',
]);
const DISPOSITION_SOURCE_KIND_SET = new Set(DISPOSITION_SOURCE_KINDS);

const NEUTRAL_STOCK01 = 0.5;
const CHANNEL_HALF_LIFE_TICKS = 1040;
const CHANNEL_THRESHOLD_CAP = 0.2;
const INSULAR_INVERSE_RATIO = 0.35;
const CHANNEL_LEARN_RATES = Object.freeze({
  martial: 0.12,
  mercantile: 0.1,
  diplomatic: 0.09,
  insular: 0.07,
});
const CHANNEL_BANDS = Object.freeze([
  Object.freeze({ maxExclusive: 0.2, name: 'restrained' }),
  Object.freeze({ maxExclusive: 0.4, name: 'measured' }),
  Object.freeze({ maxExclusive: 0.6, name: 'settled' }),
  Object.freeze({ maxExclusive: 0.8, name: 'marked' }),
  Object.freeze({ maxExclusive: Infinity, name: 'dominant' }),
]);

/** @param {number} value @param {number} lo @param {number} hi */
const clamp = (value, lo, hi) => (value < lo ? lo : value > hi ? hi : value);
/** @param {number} value */
const round6 = (value) => Math.round(value * 1_000_000) / 1_000_000;
/** @param {number} value */
const roundStock = (value) => Math.round(value * 1_000_000_000_000) / 1_000_000_000_000;
/** @param {unknown} value @param {number} fallback */
const finite = (value, fallback) => (typeof value === 'number' && Number.isFinite(value) ? value : fallback);

/** The closed authored projection persisted beside a channel stock. @param {number} stock01 */
export function dispositionBandOf(stock01) {
  const stock = clamp(finite(stock01, NEUTRAL_STOCK01), 0, 1);
  return CHANNEL_BANDS.find((band) => stock < band.maxExclusive)?.name || 'dominant';
}

/** @param {number} stock01 */
function channelState(stock01) {
  const stock = roundStock(clamp(finite(stock01, NEUTRAL_STOCK01), 0, 1));
  return { stock01: stock, band: dispositionBandOf(stock) };
}

export function createLedgerEntry() {
  return { wins: 0, losses: 0, score: 0 };
}

/**
 * @param {any} entry
 * @returns {number}
 */
function entryScore(entry) {
  if (!entry) return 0;
  if (Number.isFinite(entry.score)) return entry.score;
  return (Number(entry.wins) || 0) - (Number(entry.losses) || 0);
}

/** Legacy signed score -> normalized martial stock, preserving neutral exactly. */
function legacyStock01(entry) {
  return roundStock(clamp(NEUTRAL_STOCK01 + clamp(entryScore(entry), -SCORE_MAX, SCORE_MAX) / (2 * SCORE_MAX), 0, 1));
}

/**
 * Tolerant read of one closed channel from an extended disposition entry. An absent
 * channel is neutral. The function returns a fresh bounded projection, never a state
 * writer; dispositionProfile imports this leaf rather than knowing ledger internals.
 * @param {any} entry
 * @param {string} channel
 */
export function readDispositionChannel(entry, channel) {
  if (!DISPOSITION_CHANNELS.includes(channel)) return channelState(NEUTRAL_STOCK01);
  const raw = entry?.channels?.[channel];
  return channelState(finite(raw?.stock01, channel === 'martial' ? legacyStock01(entry) : NEUTRAL_STOCK01));
}

/**
 * Extend the live legacy ledger into WR-2's four-channel shape. This is an additive,
 * same-schema migration and belongs here because dispositionLedger remains the ONE
 * writer. Legacy score becomes martial stock; the other three channels begin neutral.
 * Already-extended entries are normalized idempotently and never re-derived.
 *
 * @param {Record<string, any>} ledger
 * @param {number} [tick]
 * @returns {Record<string, any>}
 */
export function migrateDispositionStats(ledger, tick = 0) {
  if (!ledger || typeof ledger !== 'object' || Array.isArray(ledger)) return {};
  const now = Math.max(0, Math.floor(finite(tick, 0)));
  /** @type {Record<string, any>} */
  const out = {};
  for (const id of Object.keys(ledger).sort()) {
    const raw = ledger[id];
    const prev = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : createLedgerEntry();
    /** @type {Record<string, {stock01:number, band:string}>} */
    const channels = {};
    for (const channel of DISPOSITION_CHANNELS) channels[channel] = readDispositionChannel(prev, channel);
    out[id] = {
      ...prev,
      wins: Number(prev.wins) || 0,
      losses: Number(prev.losses) || 0,
      score: entryScore(prev),
      channels,
      updatedTick: Number.isFinite(prev.updatedTick)
        ? Math.max(0, Math.floor(Number(prev.updatedTick)))
        : now,
    };
  }
  return out;
}

/**
 * Centered-on-1.0 disposition multiplier for an entity. Absent / net-zero ⇒ exactly
 * 1.0. A positive score (won its contests / aggressive history) yields > 1.0; a
 * negative score yields < 1.0. Saturates smoothly toward 1 ± MULTIPLIER_SPAN.
 * @param {Record<string, any>} ledger
 * @param {string} id
 * @returns {number}
 */
export function readDispositionMultiplier(ledger, id) {
  const entry = ledger && id != null ? ledger[String(id)] : null;
  const score = entryScore(entry);
  if (!score) return 1.0;
  const t = Math.max(-1, Math.min(1, score / SCORE_SAT));
  return 1.0 + MULTIPLIER_SPAN * t;
}

/**
 * Accumulate one resolved outcome into the ledger (immutably — returns a NEW
 * ledger). magnitude defaults to 1; the running score is clamped to ±SCORE_MAX so
 * disposition saturates rather than runs away.
 * @param {Record<string, any>} ledger
 * @param {string} id
 * @param {{ outcome: 'win'|'loss', magnitude?: number }} delta
 * @returns {Record<string, any>}
 */
export function ratchetDisposition(ledger, id, delta) {
  if (id == null || !delta || (delta.outcome !== 'win' && delta.outcome !== 'loss')) return ledger || {};
  const key = String(id);
  const prev = (ledger && ledger[key]) || createLedgerEntry();
  const mag = Number.isFinite(delta.magnitude) ? Math.max(0, Number(delta.magnitude)) : 1;
  const signed = delta.outcome === 'win' ? mag : -mag;
  const nextScore = Math.max(-SCORE_MAX, Math.min(SCORE_MAX, entryScore(prev) + signed));
  // A campaign may be lit, then deliberately darkened while ordinary legacy
  // outcomes continue. Preserve the already-migrated channel authority verbatim;
  // otherwise the legacy writer would erase three non-martial histories and force
  // a forbidden re-derivation on the next flip. While dark, those channels are
  // frozen and the compatibility score continues its established legacy path.
  const extended = prev?.channels && typeof prev.channels === 'object' && !Array.isArray(prev.channels)
    ? {
      channels: prev.channels,
      ...(Number.isFinite(prev.updatedTick) ? { updatedTick: prev.updatedTick } : {}),
    }
    : {};
  return {
    ...(ledger || {}),
    [key]: {
      wins: (Number(prev.wins) || 0) + (delta.outcome === 'win' ? 1 : 0),
      losses: (Number(prev.losses) || 0) + (delta.outcome === 'loss' ? 1 : 0),
      score: nextScore,
      ...extended,
    },
  };
}

/**
 * Fold a list of disposition deltas into the ledger in a deterministic, order-
 * stable way (sorted by id so apply order can't change the result for commutative
 * accumulation). Each delta: { id, outcome:'win'|'loss', magnitude? }. Returns a
 * NEW ledger. Empty deltas ⇒ the input ledger unchanged (byte-neutral) — this is
 * the no-op the F4 post-apply seam relies on until contests (C1+) emit deltas.
 * @param {Record<string, any>} ledger
 * @param {Array<{id:string, outcome:'win'|'loss', magnitude?:number}>} deltas
 * @returns {Record<string, any>}
 */
export function applyDispositionDeltas(ledger, deltas = []) {
  if (!Array.isArray(deltas) || deltas.length === 0) return ledger || {};
  // Same-id deltas are NOT commutative under the ±SCORE_MAX clamp in
  // ratchetDisposition: clamp(clamp(x+a)+b) ≠ clamp(clamp(x+b)+a) once an
  // intermediate saturates. Sorting by id alone leaves the fold of two same-id
  // deltas dependent on their saves-array order. A total secondary key (signed
  // magnitude ascending) makes the fold deterministic for any input permutation;
  // ties on signed magnitude are genuinely commutative, so this is a strict
  // strengthening with no effect on the ≤1-delta-per-id common path.
  /** @param {{ outcome: 'win'|'loss', magnitude?: number }} d */
  const signedOf = (d) => {
    const mag = Number.isFinite(d.magnitude) ? Math.max(0, Number(d.magnitude)) : 1;
    return d.outcome === 'win' ? mag : -mag;
  };
  const ordered = [...deltas]
    .filter((d) => d && d.id != null)
    .sort((a, b) => {
      const ai = String(a.id), bi = String(b.id);
      if (ai !== bi) return ai < bi ? -1 : 1;
      return signedOf(a) - signedOf(b);
    });
  return ordered.reduce((acc, d) => ratchetDisposition(acc, d.id, d), ledger || {});
}

/** @param {any} delta */
function deltaChannel(delta) {
  const channel = typeof delta?.channel === 'string' ? delta.channel : 'martial';
  return DISPOSITION_CHANNELS.includes(channel) ? channel : null;
}

/** @param {any} delta */
function signedDelta(delta) {
  const magnitude = Number.isFinite(delta?.magnitude) ? Math.max(0, Number(delta.magnitude)) : 1;
  return delta?.outcome === 'win' ? magnitude : -magnitude;
}

/** @param {any} delta */
function sourceKindOf(delta) {
  const raw = typeof delta?.sourceKind === 'string' ? delta.sourceKind : '';
  return DISPOSITION_SOURCE_KIND_SET.has(raw) ? raw : 'resolved_outcome';
}

/** @param {any} delta */
function sourceEventIdsOf(delta) {
  const ids = [
    ...(Array.isArray(delta?.sourceEventIds) ? delta.sourceEventIds : []),
    delta?.sourceEventId,
    delta?.sourceConquestId,
  ].filter((value) => value != null && String(value).trim()).map(String);
  return [...new Set(ids)].sort();
}

/** @param {number} stock01 @param {number} age */
function decayedStock01(stock01, age) {
  if (age <= 0 || stock01 === NEUTRAL_STOCK01) return stock01;
  const keep = Math.pow(0.5, age / CHANNEL_HALF_LIFE_TICKS);
  return roundStock(NEUTRAL_STOCK01 + (stock01 - NEUTRAL_STOCK01) * keep);
}

/**
 * Compare two ledger moments without writing either. Keeping decay and resolved
 * outcomes as distinct moments prevents a same-tick retreat-and-rebound from being
 * narrated as if nothing happened, and gives prose the actual cause of a crossing.
 * @param {Record<string, any>} beforeLedger
 * @param {Record<string, any>} afterLedger
 * @param {number} tick
 * @param {'decay'|'outcome'} source
 * @param {Map<string, {sourceKinds:string[],sourceEventIds:string[],outcomeKinds:string[]}> | null} [evidenceByChannel]
 */
function dispositionTransitionsBetween(beforeLedger, afterLedger, tick, source, evidenceByChannel = null) {
  /** @type {Array<{kind:'band_crossing'|'reversal', id:string, channel:string, fromBand:string, toBand:string, fromStock01:number, toStock01:number, direction:'up'|'down', source:'decay'|'outcome', sourceKinds:string[],sourceEventIds:string[],outcomeKinds:string[],tick:number}>} */
  const transitions = [];
  const ids = [...new Set([...Object.keys(beforeLedger || {}), ...Object.keys(afterLedger || {})])].sort();
  for (const id of ids) {
    const beforeEntry = beforeLedger?.[id] || createLedgerEntry();
    const afterEntry = afterLedger?.[id] || createLedgerEntry();
    for (const channel of DISPOSITION_CHANNELS) {
      const before = readDispositionChannel(beforeEntry, channel);
      const after = readDispositionChannel(afterEntry, channel);
      if (before.stock01 === after.stock01) continue;
      const direction = after.stock01 > before.stock01 ? 'up' : 'down';
      const evidence = source === 'decay'
        ? { sourceKinds: ['decay'], sourceEventIds: [], outcomeKinds: [] }
        : evidenceByChannel?.get(`${id}\u0000${channel}`)
          || { sourceKinds: ['resolved_outcome'], sourceEventIds: [], outcomeKinds: [] };
      if (before.band !== after.band) {
        transitions.push({ kind: 'band_crossing', id, channel, fromBand: before.band, toBand: after.band, fromStock01: before.stock01, toStock01: after.stock01, direction, source, ...evidence, tick });
      }
      if ((before.stock01 - NEUTRAL_STOCK01) * (after.stock01 - NEUTRAL_STOCK01) < 0) {
        transitions.push({ kind: 'reversal', id, channel, fromBand: before.band, toBand: after.band, fromStock01: before.stock01, toStock01: after.stock01, direction, source, ...evidence, tick });
      }
    }
  }
  return transitions;
}

/**
 * Collapse every writer in one tick to the state a reader actually inherits next
 * tick. A temporary crossing that is undone by a later treaty verdict is not news;
 * an end-to-end reversal remains news even when both stocks occupy the same broad
 * band. Input order is causal (early outcome, then late treaty), while group output
 * is codepoint-stable.
 * @param {Array<any>} transitions
 */
export function coalesceDispositionTransitions(transitions = []) {
  /** @type {Map<string, any[]>} */
  const groups = new Map();
  for (const transition of Array.isArray(transitions) ? transitions : []) {
    if (!transition || transition.id == null || !DISPOSITION_CHANNELS.includes(transition.channel)) continue;
    const key = `${Math.max(0, Math.floor(finite(transition.tick, 0)))}\u0000${String(transition.id)}\u0000${transition.channel}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(transition);
  }
  const out = [];
  for (const key of [...groups.keys()].sort()) {
    const rows = groups.get(key);
    const first = rows[0];
    const last = rows[rows.length - 1];
    const fromStock01 = finite(first.fromStock01, NEUTRAL_STOCK01);
    const toStock01 = finite(last.toStock01, NEUTRAL_STOCK01);
    if (fromStock01 === toStock01) continue;
    const fromBand = dispositionBandOf(fromStock01);
    const toBand = dispositionBandOf(toStock01);
    const direction = toStock01 > fromStock01 ? 'up' : 'down';
    const sourceSet = new Set(rows.map((row) => row.source || 'outcome'));
    const source = sourceSet.size === 1 ? [...sourceSet][0] : 'mixed';
    const sourceKinds = [...new Set(rows.flatMap((row) => (
      Array.isArray(row.sourceKinds) ? row.sourceKinds : []
    )))].sort();
    const sourceEventIds = [...new Set(rows.flatMap((row) => (
      Array.isArray(row.sourceEventIds) ? row.sourceEventIds : []
    )))].sort();
    const outcomeKinds = [...new Set(rows.flatMap((row) => (
      Array.isArray(row.outcomeKinds) ? row.outcomeKinds : []
    )))].sort();
    const base = {
      id: String(first.id), channel: first.channel, fromBand, toBand,
      fromStock01, toStock01, direction, source,
      sourceKinds: sourceKinds.length ? sourceKinds : [source === 'decay' ? 'decay' : 'resolved_outcome'],
      sourceEventIds,
      outcomeKinds,
      tick: Math.max(0, Math.floor(finite(first.tick, 0))),
    };
    if (fromBand !== toBand) out.push({ kind: 'band_crossing', ...base });
    if ((fromStock01 - NEUTRAL_STOCK01) * (toStock01 - NEUTRAL_STOCK01) < 0) {
      out.push({ kind: 'reversal', ...base });
    }
  }
  return out;
}

/**
 * WR-2's lit writer. The legacy two-argument applyDispositionDeltas function above is
 * intentionally untouched; callers opt into this richer fold explicitly. With the
 * gate dark this delegates to the legacy writer exactly. With it lit, every prior
 * channel decays toward neutral, then outcome-only deltas move their named channel.
 * Successful outward outcomes weaken insularity and failures strengthen it, at the
 * deliberately smaller inverse rate. Deltas without a channel are martial for legacy
 * compatibility.
 *
 * Transition metadata is read-side evidence for the later receipt fold; it is never
 * persisted as a second ledger. A reversal means the stock crossed neutral, proving
 * that the disposition is not an irreversible ratchet.
 *
 * @param {Record<string, any>} ledger
 * @param {Array<{id:string, channel?:string, outcome:'win'|'loss', magnitude?:number,
 *   sourceKind?:string,sourceEventId?:string,sourceEventIds?:string[],sourceConquestId?:string}>} [deltas]
 * @param {{enabled?:boolean, tick?:number}} [options]
 * @returns {{ledger:Record<string, any>, transitions:Array<{kind:'band_crossing'|'reversal', id:string, channel:string, fromBand:string, toBand:string, fromStock01:number, toStock01:number, direction:'up'|'down', source:'decay'|'outcome'|'mixed', sourceKinds:string[],sourceEventIds:string[],outcomeKinds:string[],tick:number}>}}
 */
export function advanceDispositionChannels(ledger, deltas = [], options = {}) {
  if (options?.enabled !== true) {
    return { ledger: applyDispositionDeltas(ledger, deltas), transitions: [] };
  }

  const now = Math.max(0, Math.floor(finite(options.tick, 0)));
  const migrated = migrateDispositionStats(ledger, now);
  /** @type {Record<string, any>} */
  const next = {};

  // Decay first. This is the only non-outcome movement and it can only approach
  // neutral; no clock passage can manufacture a directional appetite.
  for (const id of Object.keys(migrated).sort()) {
    const prev = migrated[id];
    const age = Math.max(0, now - Math.floor(finite(prev.updatedTick, now)));
    /** @type {Record<string, {stock01:number, band:string}>} */
    const channels = {};
    for (const channel of DISPOSITION_CHANNELS) {
      const state = readDispositionChannel(prev, channel);
      channels[channel] = channelState(decayedStock01(state.stock01, age));
    }
    next[id] = {
      ...prev,
      channels,
      score: round6((channels.martial.stock01 - NEUTRAL_STOCK01) * 2 * SCORE_MAX),
      updatedTick: now,
    };
  }
  const decayTransitions = dispositionTransitionsBetween(migrated, next, now, 'decay');
  // Later assignments replace whole entries, so a shallow snapshot is sufficient
  // to retain the post-decay/pre-outcome moment for causal transition receipts.
  const afterDecay = { ...next };

  // Total-order before aggregation keeps floating-point sums permutation-stable.
  const ordered = (Array.isArray(deltas) ? [...deltas] : [])
    .filter((delta) => delta && delta.id != null
      && (delta.outcome === 'win' || delta.outcome === 'loss')
      && deltaChannel(delta) !== null)
    .sort((a, b) => {
      const ai = String(a.id), bi = String(b.id);
      if (ai !== bi) return ai < bi ? -1 : 1;
      const ac = /** @type {string} */ (deltaChannel(a));
      const bc = /** @type {string} */ (deltaChannel(b));
      if (ac !== bc) return ac < bc ? -1 : 1;
      return signedDelta(a) - signedDelta(b);
    });

  /** @type {Map<string, Map<string, {signed:number,wins:number,losses:number,
   *   sourceKinds:Set<string>,sourceEventIds:Set<string>,outcomeKinds:Set<string>}>>} */
  const aggregate = new Map();
  for (const delta of ordered) {
    const id = String(delta.id);
    const channel = /** @type {string} */ (deltaChannel(delta));
    if (!aggregate.has(id)) aggregate.set(id, new Map());
    const byChannel = /** @type {Map<string, {signed:number,wins:number,losses:number,
     * sourceKinds:Set<string>,sourceEventIds:Set<string>,outcomeKinds:Set<string>}>} */ (aggregate.get(id));
    const row = byChannel.get(channel) || {
      signed: 0,
      wins: 0,
      losses: 0,
      sourceKinds: new Set(),
      sourceEventIds: new Set(),
      outcomeKinds: new Set(),
    };
    row.signed += signedDelta(delta);
    row.wins += delta.outcome === 'win' ? 1 : 0;
    row.losses += delta.outcome === 'loss' ? 1 : 0;
    row.sourceKinds.add(sourceKindOf(delta));
    for (const sourceEventId of sourceEventIdsOf(delta)) row.sourceEventIds.add(sourceEventId);
    row.outcomeKinds.add(delta.outcome);
    byChannel.set(channel, row);
  }

  // Bind each transition to the resolved records that actually moved it. The
  // inverse insular lesson inherits the same causes as its outward channel; no
  // later prose composer is allowed to guess an event after the fact.
  /** @type {Map<string, {sourceKinds:string[],sourceEventIds:string[],outcomeKinds:string[]}>} */
  const outcomeEvidence = new Map();
  const addEvidence = (id, channel, row) => {
    const key = `${id}\u0000${channel}`;
    const previous = outcomeEvidence.get(key) || { sourceKinds: [], sourceEventIds: [], outcomeKinds: [] };
    outcomeEvidence.set(key, {
      sourceKinds: [...new Set([...previous.sourceKinds, ...row.sourceKinds])].sort(),
      sourceEventIds: [...new Set([...previous.sourceEventIds, ...row.sourceEventIds])].sort(),
      outcomeKinds: [...new Set([...previous.outcomeKinds, ...row.outcomeKinds])].sort(),
    });
  };
  for (const id of [...aggregate.keys()].sort()) {
    const byChannel = aggregate.get(id);
    for (const channel of [...byChannel.keys()].sort()) {
      const row = byChannel.get(channel);
      addEvidence(id, channel, row);
      if (channel !== 'insular') addEvidence(id, 'insular', row);
    }
  }

  for (const id of [...aggregate.keys()].sort()) {
    if (!next[id]) next[id] = migrateDispositionStats({ [id]: createLedgerEntry() }, now)[id];
    const prev = next[id];
    /** @type {Record<string, {stock01:number, band:string}>} */
    const channels = Object.fromEntries(DISPOSITION_CHANNELS.map((channel) => [channel, readDispositionChannel(prev, channel)]));
    const byChannel = /** @type {Map<string, {signed:number,wins:number,losses:number,
     * sourceKinds:Set<string>,sourceEventIds:Set<string>,outcomeKinds:Set<string>}>} */ (aggregate.get(id));
    let martialWins = 0;
    let martialLosses = 0;
    for (const channel of [...byChannel.keys()].sort()) {
      const row = /** @type {{signed:number,wins:number,losses:number,
       * sourceKinds:Set<string>,sourceEventIds:Set<string>,outcomeKinds:Set<string>}} */ (byChannel.get(channel));
      const rate = /** @type {Record<string, number>} */ (CHANNEL_LEARN_RATES)[channel];
      channels[channel] = channelState(channels[channel].stock01 + rate * row.signed);
      if (channel === 'martial') {
        martialWins += row.wins;
        martialLosses += row.losses;
      }
      if (channel !== 'insular') {
        // Every successful outward lesson makes the house a little less insular;
        // every failure makes withdrawal a little more attractive. The weaker
        // inverse cannot overwhelm the channel that actually learned the outcome.
        channels.insular = channelState(channels.insular.stock01
          - CHANNEL_LEARN_RATES.insular * INSULAR_INVERSE_RATIO * row.signed);
      }
    }
    next[id] = {
      ...prev,
      wins: (Number(prev.wins) || 0) + martialWins,
      losses: (Number(prev.losses) || 0) + martialLosses,
      score: round6((channels.martial.stock01 - NEUTRAL_STOCK01) * 2 * SCORE_MAX),
      channels,
      updatedTick: now,
    };
  }

  const outcomeTransitions = dispositionTransitionsBetween(afterDecay, next, now, 'outcome', outcomeEvidence);
  return { ledger: next, transitions: coalesceDispositionTransitions([...decayTransitions, ...outcomeTransitions]) };
}

/**
 * Build the per-entity factor map consumed at candidate-build: { id → multiplier }.
 * Only entities whose multiplier differs from 1.0 are included, so a legacy/empty
 * (or net-zero) ledger yields {} — and every candidate factor defaults to exactly
 * 1.0, keeping the pulse byte-identical. Pure, order-independent (object).
 * @param {Record<string, any>} ledger
 * @returns {Record<string, number>}
 */
export function dispositionFactorMap(ledger) {
  /** @type {Record<string, number>} */
  const out = {};
  if (!ledger || typeof ledger !== 'object') return out;
  for (const id of Object.keys(ledger)) {
    const m = readDispositionMultiplier(ledger, id);
    if (m !== 1.0) out[id] = m;
  }
  return out;
}

export const DISPOSITION_TUNING = Object.freeze({ MULTIPLIER_SPAN, SCORE_SAT, SCORE_MAX });
export const DISPOSITION_CHANNEL_TUNING = Object.freeze({
  NEUTRAL_STOCK01,
  HALF_LIFE_TICKS: CHANNEL_HALF_LIFE_TICKS,
  THRESHOLD_FACTOR_CAP: CHANNEL_THRESHOLD_CAP,
  INSULAR_INVERSE_RATIO,
  LEARN_RATES: CHANNEL_LEARN_RATES,
  BANDS: CHANNEL_BANDS,
});
