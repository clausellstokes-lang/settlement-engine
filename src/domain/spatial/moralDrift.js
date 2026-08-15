/**
 * domain/spatial/moralDrift.js — Phase 5.5 M9b, component (3): MORAL DRIFT FROM
 * UNJUST INSTIGATION (design §4g "MORAL DRIFT FROM UNJUST ACTION").
 *
 * The fog of war becomes MORALLY LOADED. A settlement that INSTIGATES a conflict
 * while IN THE WRONG — acting on a FALSE belief, marching on a target the world no
 * longer counts an enemy (a non-threat) — pays a MORAL PRICE: its derived
 * settlementAlignment DRIFTS (toward malice + lawlessness). The drift is:
 *   • SHARPEST for a LAWFUL-GOOD actor — the gap between the professed alignment
 *     and the unjust act (a saintly, orderly polity betraying its own creed drifts
 *     hardest; a already-malicious warlord barely moves — it has no creed to break).
 *   • scaled by VICTIM INNOCENCE — attacking the weak + the saintly is worse.
 *   • scaled by PAST RELATIONS — marching on a FORMER FRIEND is worse than on a
 *     stranger (the relationship misjudgment IS this: you believed them hostile,
 *     the truth is they were not — a bond betrayed).
 *
 * THE RECKONING ARC (W-C5-shaped, design §4g "a self-correcting arc — drift →
 * reckoning, or a spiral"): the drift is a PERSISTED accumulator that DECAYS toward
 * zero each silent tick — a settlement that stops waging unjust war lets its
 * conscience reassert (the reckoning). One that keeps instigating REINFORCES the
 * drift faster than it decays (the spiral). A settlement crossing the reckoning
 * threshold this tick surfaces a legible cause receipt (the unjust war as a CAUSE).
 *
 * WIRING (the constitutional substrate, PHASE55 §IV.4 / §VI.3):
 *   • W0 settlementAlignment — the DRIFT TARGET. moralDriftTerm(worldState, id) is
 *     read by disposition.computeMalice (folds into its recent-acts term) +
 *     computeLawfulness (a signed drag), so the DERIVED alignment MOVES. ABSENT
 *     ledger ⇒ {0,0} ⇒ the alignment reads are BYTE-IDENTICAL (the neutrality
 *     anchor; those reads have no other live consumer this wave, so a dormant world
 *     is untouched).
 *   • W-C2 conscience — the "sharpest for lawful-good" scaling reads the actor's
 *     derived lawfulness + goodness (computed by the caller from the conscience-
 *     weighted disposition kernel).
 *   • M9a misjudgment — the unjust-instigation SIGNAL is exactly M9a's
 *     `metadata.misjudgment` (kinds includes 'relationship': acting on a hostility
 *     the world has left behind). This wave gives that signal a MORAL consequence.
 *
 * DETERMINISM: PURE — no Date, no Math.random, no mutation. A worldPulse leaf (the
 * lazy engine chunk — zero first-paint bytes); the ledger nests under
 * spatialLedgers (the FP-R consolidation — budget-free). NO rng is forked, so the
 * drift cannot perturb any other layer's PRNG stream. ZERO imports (the nested-ledger
 * read is inlined, not routed through distanceRead) so this leaf adds no cross-chunk
 * preload edge — the first-paint index manifest is byte-unchanged.
 */

// ── Tuning (documented here; retuned in the checkpoint soak) ──────────────────
export const MORAL_DRIFT_TUNING = Object.freeze({
  // The base drift an unjust instigation banks (before the lawful-good / innocence /
  // past-relations scalings). Modest — one deceived march nudges; a campaign of them
  // corrupts.
  BASE_DRIFT: 0.12,
  // The reckoning arc: drift ×= DECAY per SILENT tick (no fresh unjust act). Half-life
  // ≈ 9 ticks — a settlement that stops waging unjust war reforms over a season.
  DECAY: 0.92,
  // Prune drift below this — the reckoning completed (the conscience reasserted), the
  // conditional ledger entry drops (byte-tidy, dormancy-restoring).
  MIN_DRIFT: 0.02,
  // Saturating cap on accumulated drift (a settlement cannot drift past this from
  // moral acts alone — the alignment axes are bounded regardless by their tanh squash).
  MAX_DRIFT: 1,
  // The lawful-good SHARPENING: the drift is scaled by (LG_FLOOR + LG_GAIN ×
  // lawfulGoodness), where lawfulGoodness ∈ [0,1] is the actor's professed-creed
  // magnitude. A perfectly lawful-good actor (1.0) drifts at the full gain; a neutral
  // one at the floor; an already-evil/chaotic one barely moves.
  LG_FLOOR: 0.35,
  LG_GAIN: 1.15,
  // VICTIM INNOCENCE: scaled by (INNO_FLOOR + INNO_GAIN × innocence), innocence ∈
  // [0,1] = the victim's saintliness × weakness.
  INNO_FLOOR: 0.5,
  INNO_GAIN: 0.6,
  // PAST RELATIONS: a march on a FORMER FRIEND (a friendly-axis true relationship)
  // multiplies the drift — a bond betrayed cuts deeper than aggression against a stranger.
  FORMER_FRIEND_MULT: 1.4,
  // The lawlessness drift is a fraction of the malice drift — an unjust war is first
  // an evil act, and secondarily a lawless one (it flouts the professed order).
  LAWLESSNESS_RATIO: 0.7,
  // The reckoning THRESHOLD: a settlement whose accumulated malice drift crosses this
  // (having risen this tick) surfaces the W-C5-shaped reckoning cause receipt.
  RECKONING_THRESHOLD: 0.3,
  // The disposition READ weights — how hard the accumulated drift pulls the derived
  // alignment. Malice folds into computeMalice's recent-acts term (saturating with it);
  // lawlessness is a signed drag on computeLawfulness's drive.
  LAW_DRAG_WEIGHT: 0.6,
});

const clamp01 = (/** @type {number} */ x) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** @param {unknown} v @param {number} f @returns {number} */
const finiteNumber = (v, f) => (typeof v === 'number' && Number.isFinite(v) ? v : f);
/** @param {number} v @returns {number} 4-dp round for byte-tidy persisted floats */
const round4 = (v) => Math.round(v * 10000) / 10000;

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** The moralDrift sub-ledger, read INLINE from the spatialLedgers namespace (the same
 *  shape distanceRead.getSpatialLedger reads) — kept import-free so this leaf never
 *  pulls a cross-chunk preload edge into the eager index manifest.
 *  @param {{ spatialLedgers?: unknown } | null | undefined} worldState @returns {Record<string, unknown>} */
function readMoralLedger(worldState) {
  if (!worldState || typeof worldState !== 'object') return {};
  const ns = /** @type {Record<string, unknown>} */ (worldState).spatialLedgers;
  if (!ns || typeof ns !== 'object' || Array.isArray(ns)) return {};
  return asObject(/** @type {Record<string, unknown>} */ (ns).moralDrift);
}

// The friendly relationship axis — a march on any of these (believed hostile, truly
// one of these) is a bond betrayed (the PAST-RELATIONS aggravator).
const FRIENDLY_TYPES = new Set(['allied', 'trade_partner', 'patron', 'client', 'vassal']);

/**
 * @typedef {Object} MoralDriftRecord
 * @property {number} malice        accumulated malice drift (0..MAX_DRIFT)
 * @property {number} lawlessness   accumulated lawlessness drift (0..MAX_DRIFT)
 * @property {number} instigations  count of unjust instigations banked (a spiral counter)
 * @property {number} sinceTick     tick the drift arc began
 * @property {number} lastTick      tick of the last refresh
 */

/**
 * @typedef {Object} MoralDriftDeltaInput
 * @property {string} actorId
 * @property {string} victimId
 * @property {number} actorLawfulness01   the actor's derived lawfulness (0..1)
 * @property {number} actorMalice01       the actor's derived malice (0..1)
 * @property {number} victimMalice01      the victim's derived malice (0..1)
 * @property {number} victimStrength01    the victim's 0..1 strength (weakness = 1 − this)
 * @property {string} trueRelationship    the GROUND-TRUTH observer↔victim label
 */

/**
 * The malice + lawlessness drift ONE unjust instigation banks. Pure — the caller
 * supplies the derived alignment coordinates (breaking the disposition ↔ drift
 * import cycle: the kernel owns the computeLawfulness/computeMalice reads).
 *
 * lawfulGoodness = lawfulness × goodness (both 0..1; a lawful-good actor ≈ 1, a
 * chaotic-evil one ≈ 0) is the professed-creed magnitude — the SHARPNESS term.
 * innocence = victim saintliness × victim weakness. The former-friend multiplier
 * fires when the TRUE relationship was on the friendly axis.
 * @param {MoralDriftDeltaInput} args
 * @returns {{ malice: number, lawlessness: number }}
 */
export function moralDriftDeltaFor({
  actorLawfulness01, actorMalice01, victimMalice01, victimStrength01, trueRelationship,
}) {
  const T = MORAL_DRIFT_TUNING;
  const lawfulGoodness = clamp01(finiteNumber(actorLawfulness01, 0.5)) * (1 - clamp01(finiteNumber(actorMalice01, 0.5)));
  const innocence = (1 - clamp01(finiteNumber(victimMalice01, 0.5))) * (1 - clamp01(finiteNumber(victimStrength01, 0.5)));
  const lgScale = T.LG_FLOOR + T.LG_GAIN * lawfulGoodness;
  const innoScale = T.INNO_FLOOR + T.INNO_GAIN * innocence;
  const pastMult = FRIENDLY_TYPES.has(String(trueRelationship)) ? T.FORMER_FRIEND_MULT : 1;
  const malice = T.BASE_DRIFT * lgScale * innoScale * pastMult;
  return { malice, lawlessness: malice * T.LAWLESSNESS_RATIO };
}

/**
 * @typedef {Object} MoralReckoning
 * @property {string} settlementId
 * @property {string} victimId       the most-recent victim (for the receipt)
 * @property {number} malice         accumulated malice drift after this tick
 * @property {number} lawlessness
 * @property {number} instigations
 * @property {string} trueRelationship  the betrayed bond (for the receipt copy)
 */

/**
 * Advance the moral-drift ledger one tick. DECAY every existing entry toward zero
 * (the reckoning arc), then FOLD this tick's unjust-instigation deltas (the spiral).
 * Prune entries below MIN_DRIFT (reckoning complete). Pure + deterministic (no rng,
 * codepoint fold). Returns the next ledger (or null when empty) + the reckonings that
 * crossed the threshold this tick (for the W-C5-shaped receipt).
 *
 * @param {Object} args
 * @param {MoralDriftDeltaInput[]} args.instigations  this tick's unjust instigations (pre-sized deltas)
 * @param {{ spatialLedgers?: unknown } | null | undefined} args.worldState
 * @param {number} args.tick
 * @returns {{ next: Record<string, MoralDriftRecord> | null, changed: boolean, reckonings: MoralReckoning[] }}
 */
export function advanceMoralDrift({ instigations, worldState, tick }) {
  const T = MORAL_DRIFT_TUNING;
  const now = Math.max(0, Math.floor(finiteNumber(tick, 0)));
  const prior = readMoralLedger(worldState);
  // Group this tick's instigations by actor (a settlement can march on ≤1 target per
  // tick via the strategy chooser, but be defensive: sum deltas per actor).
  /** @type {Map<string, { malice: number, lawlessness: number, count: number, victimId: string, trueRelationship: string }>} */
  const byActor = new Map();
  for (const inst of Array.isArray(instigations) ? instigations : []) {
    const id = String(inst.actorId);
    const delta = moralDriftDeltaFor(inst);
    const cur = byActor.get(id) || { malice: 0, lawlessness: 0, count: 0, victimId: String(inst.victimId), trueRelationship: String(inst.trueRelationship) };
    cur.malice += delta.malice;
    cur.lawlessness += delta.lawlessness;
    cur.count += 1;
    // Codepoint-first victim wins ties (stable receipt).
    if (String(inst.victimId) < cur.victimId) { cur.victimId = String(inst.victimId); cur.trueRelationship = String(inst.trueRelationship); }
    byActor.set(id, cur);
  }

  const ids = [...new Set([...Object.keys(prior), ...byActor.keys()])].sort();
  /** @type {Record<string, MoralDriftRecord>} */
  const next = {};
  /** @type {MoralReckoning[]} */
  const reckonings = [];
  let changed = false;

  for (const id of ids) {
    const priorRec = /** @type {MoralDriftRecord | null} */ (
      prior[id] && typeof prior[id] === 'object' ? prior[id] : null
    );
    const bank = byActor.get(id) || null;

    // DECAY the prior toward zero (silence = reckoning). A fresh act this tick counts
    // as its own tick of silence-since-last for the decay, then adds the delta.
    let malice = 0;
    let lawlessness = 0;
    let instigCount = 0;
    let sinceTick = now;
    if (priorRec) {
      const silent = Math.max(0, now - Math.floor(finiteNumber(priorRec.lastTick, now)));
      const decay = Math.pow(T.DECAY, silent);
      malice = clamp01(finiteNumber(priorRec.malice, 0)) * decay;
      lawlessness = clamp01(finiteNumber(priorRec.lawlessness, 0)) * decay;
      instigCount = Math.max(0, Math.floor(finiteNumber(priorRec.instigations, 0)));
      sinceTick = Math.floor(finiteNumber(priorRec.sinceTick, now));
    }

    const roseThisTick = !!bank;
    if (bank) {
      const before = malice;
      malice = Math.min(T.MAX_DRIFT, malice + bank.malice);
      lawlessness = Math.min(T.MAX_DRIFT, lawlessness + bank.lawlessness);
      instigCount += bank.count;
      if (!priorRec) sinceTick = now;
      // A reckoning FIRES when the malice drift crosses the threshold on the tick it rose.
      if (before < T.RECKONING_THRESHOLD && malice >= T.RECKONING_THRESHOLD) {
        reckonings.push({
          settlementId: id, victimId: bank.victimId,
          malice: round4(malice), lawlessness: round4(lawlessness),
          instigations: instigCount, trueRelationship: bank.trueRelationship,
        });
      }
    }

    if (malice < T.MIN_DRIFT && lawlessness < T.MIN_DRIFT) {
      // Reckoning complete: the drift faded below the floor — the entry drops.
      if (priorRec) changed = true;
      continue;
    }
    // lastTick re-anchors the decay ONLY when a fresh act landed this tick; a silent
    // tick keeps decaying from the ORIGINAL lastTick (never reset), so the reckoning
    // arc measures true elapsed silence.
    const lastTick = roseThisTick ? now : Math.floor(finiteNumber(priorRec?.lastTick, now));
    /** @type {MoralDriftRecord} */
    const rec = {
      malice: round4(malice), lawlessness: round4(lawlessness),
      instigations: instigCount, sinceTick, lastTick,
    };
    next[id] = rec;
    if (!priorRec || JSON.stringify(priorRec) !== JSON.stringify(rec)) changed = true;
  }

  const nextOrNull = Object.keys(next).length ? next : null;
  // Detect a pure-drop change (prior had entries, next is empty).
  if (!changed && Object.keys(prior).length !== Object.keys(next).length) changed = true;
  const priorAsLedger = /** @type {Record<string, MoralDriftRecord>} */ (prior);
  return { next: changed ? nextOrNull : (Object.keys(prior).length ? priorAsLedger : null), changed, reckonings };
}

/**
 * The additive alignment-drift terms for a settlement — read by
 * disposition.computeMalice / computeLawfulness. ABSENT ledger / entry ⇒ {0,0} ⇒
 * the alignment reads are BYTE-IDENTICAL (adding +0 to the drive is exact; the
 * recent-acts saturation with +0 is exact).
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @param {string | null | undefined} id
 * @returns {{ malice: number, lawlessness: number }}
 */
export function moralDriftTerm(worldState, id) {
  if (id == null) return { malice: 0, lawlessness: 0 };
  const rec = readMoralLedger(worldState)[String(id)];
  if (!rec || typeof rec !== 'object') return { malice: 0, lawlessness: 0 };
  const r = /** @type {MoralDriftRecord} */ (rec);
  return {
    malice: clamp01(finiteNumber(r.malice, 0)),
    lawlessness: clamp01(finiteNumber(r.lawlessness, 0)),
  };
}

/**
 * The W-C5-shaped reckoning receipts (house voice): the unjust war made a legible
 * CAUSE. Mirrors beliefMisjudgmentNewsEntries — empty when nothing crossed the
 * threshold ⇒ byte-neutral. The DM watches a good polity's conscience curdle.
 * @param {MoralReckoning[]} reckonings
 * @param {(id: string) => string} nameFor
 * @param {number} tick
 * @param {string | null} now
 * @returns {Array<Record<string, unknown>>}
 */
export function moralReckoningNewsEntries(reckonings, nameFor = (id) => String(id), tick = 0, now = null) {
  const rows = (Array.isArray(reckonings) ? reckonings : [])
    .slice()
    .sort((a, b) => (a.settlementId < b.settlementId ? -1 : a.settlementId > b.settlementId ? 1 : 0));
  return rows.map((r) => {
    const mover = nameFor(r.settlementId);
    const victim = nameFor(r.victimId);
    const betrayed = FRIENDLY_TYPES.has(String(r.trueRelationship));
    const headline = `${mover} reckons with an unjust war`;
    const summary = betrayed
      ? `${mover} marched on ${victim} — a former friend, not the enemy it believed. The gap between what it professed and what it did drifts its very character.`
      : `${mover} marched on ${victim}, a settlement that was no threat. An unjust war leaves a moral scar on the aggressor.`;
    const reasons = [
      `${mover} instigated conflict against ${victim} on a belief the world had already left behind.`,
      `The reckoning: its derived alignment drifts (malice ${r.malice.toFixed(2)}, lawlessness ${r.lawlessness.toFixed(2)}) — sharpest for a lawful-good aggressor.`,
      r.instigations > 1
        ? `This is unjust war number ${r.instigations} — the drift compounds into a spiral, not a lapse.`
        : 'Left un-repeated, the drift decays as the settlement’s conscience reasserts (the reckoning).',
    ];
    return {
      id: `wizard_news.${tick}.moral_reckoning.${r.settlementId}.${r.victimId}`,
      tick,
      scope: 'regional',
      significance: 'notable',
      score: 60,
      headline,
      summary,
      kind: 'applied',
      impactKind: 'moral_reckoning',
      channelType: null,
      severity: 0.55,
      settlementIds: [r.settlementId, r.victimId],
      impactIds: [],
      channelIds: [],
      sourceEventId: `moral_reckoning.${r.settlementId}.${r.victimId}.${tick}`,
      tags: ['world_pulse', 'belief', 'moral_drift', 'reckoning', ...(betrayed ? ['betrayal'] : [])],
      reasons,
      createdAt: now,
    };
  });
}
