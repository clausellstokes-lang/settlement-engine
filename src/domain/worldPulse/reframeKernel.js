/**
 * domain/worldPulse/reframeKernel.js — D7 THE REFRAME LAYER (DESIGN_SIM_DEPTH_R2 §D7):
 * the ledger of gifts and debts; motive attribution as belief.
 *
 * THE LAW: FACTS FROZEN, MEANING DERIVED. Receipts and transfer ledgers are
 * immutable (constitutional). What changes when relationships change is the
 * INTERPRETATION — a per-observer derived read: `interpretationOf(act, observer, now)`.
 * History is never rewritten; it is re-READ. And because interpretation is belief-side,
 * IT CAN BE WRONG — this layer extends the epistemics engine from misjudged FACTS to
 * misjudged MOTIVES. Nothing new is recorded: the mover reads the immutable obligations
 * ledger (kind + predatory = the TRUE mint intent) and the relationship state, and folds
 * a per-observer INTERPRETATION into spatialLedgers.reframes. It NEVER writes any
 * transfer/receipt/obligation ledger (the frozen-facts pin).
 *
 * TRANSITIONS ARE EVENTS (the mover half). A reframe TRANSITION ("Thornwall now speaks
 * of the grain years as a debt unpaid") is:
 *   - DORMANT behind the virtual flag `reframeEnabled` — absent ⇒ no transitions ⇒ prior
 *     bytes. The flag is PURELY virtual (NOT in DEFAULT_SIMULATION_RULES, NOT in the
 *     WAVES preset bundle), so EVERY golden — even a peaceEngine-lit one — is
 *     byte-identical: no reframe reading materialises, no war/peace/leash/term consumer
 *     moves. The reframe dormancy golden proves it.
 *   - E0-CLASSED (rare, story-grade): a global CAP on concurrent reframed readings, the
 *     scarcity-as-law precedent (the 8th drama class, decisionTier.js `reframe`).
 *   - HYSTERESIS-GUARDED (a warmth deadband; oscillation inside it mints ZERO transitions).
 *   - STICKY (a reading persists; reversal only through the reconciliation/souring lane —
 *     the opposing lean must clear ENTER + DEADBAND). BOTH SIGNS exist (the unification
 *     law): the DARK lane (gift → debt_unpaid → tribute_extracted) AND the BRIGHT
 *     MISREADING lane (an enemy's self-interested act read as deliberate kindness;
 *     debt_unpaid reconciled back to gift_forgiven). A NEGATIVITY BIAS (dark fires easier
 *     than bright) is coherent human realism, owner-retunable.
 *   - DETERMINISTIC: no rng. The interpretation is a deterministic function of state; a
 *     transition is a deterministic sticky threshold-crossing (hysteresis + cap +
 *     score-desc selection). Same-seed byte-identity holds by construction — no fork
 *     stream is consumed, so no other mover's draw order shifts even on the lit path.
 *     (JUDGMENT: deterministic crossings over rng draws — truer to "meaning DERIVED",
 *     matches the warReasons/peaceReasons "reads not rolls" law, and needs no rng plumbed
 *     through advanceWarReasons, which pulseKernel — at its unraisable line ceiling —
 *     calls without an rng.)
 *
 * CONSUMERS (all existing machinery, additive; each read returns 0/neutral when the
 * reframe ledger is absent ⇒ byte-identical): the new war-reason kinds ingratitude_debt +
 * dependency_by_design (warReasons.js), their DISTINCT peace mirrors debt_forgiven +
 * bonds_of_commerce (peaceReasons.js), the restitution peace TERM (peaceTerms.js), the
 * corruption-leash bounded input (corruptionWeb.recruitmentWeight), the DECLARE_CASUS
 * dials (auto — the reframe casus join WAR_REASON_TYPES), and THE LEDGER OF GIFTS AND
 * DEBTS irony read-model (display/giftsAndDebtsRead.js — true mint intent vs believed).
 *
 * REJECTED (recorded): a per-NPC emotion system, continuous emotion scalars, mutable
 * intent on receipts — state-never-fate extended to sentiment; blocs/settlements reframe,
 * NPCs never have engine-resolved feelings.
 *
 * Lazy leaf: imported only by dormant worldPulse kernels + the lazy display read-model +
 * tests ⇒ zero eager first-paint bytes. Imports NONE of {warReasons, peaceReasons,
 * peaceTerms, corruptionWeb} — the one-directional-import law that keeps the reasons DAG
 * acyclic (those four import THIS leaf, never the reverse).
 */

import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { ensureRelationshipState, relationshipKeyFromEdge } from './relationshipState.js';
import { memoryHorizonMultiplierOf } from './relationshipEvolution.js';
import { settlementAlignment } from './settlementAlignment.js';
import { clamp, clamp01 } from '../../kernel/math.js';

// ── The gate (fail-closed; the virtual-flag idiom) ──────────────────────────

/**
 * THE REFRAME GATE: `reframeEnabled === true`, read fail-closed off
 * worldState.simulationRules. ABSENT ⇒ false ⇒ DORMANT. reframeEnabled is PURELY
 * virtual — no DEFAULT_SIMULATION_RULES entry AND no WAVES-preset entry — so no golden
 * moves (normalizeSimulationRules spreads unknown keys through, so an explicitly-lit
 * rules blob survives normalization; the constructiveFlowsEnabled precedent). Whether it
 * ever lights is an OWNER question for the regen batch. Independent of peaceEngineEnabled:
 * the war-reason CONSUMERS are additionally behind peaceCausalActive, so a reframe casus
 * only materialises when BOTH gates are lit.
 * @param {{ simulationRules?: Record<string, unknown> | null } | null | undefined} worldState
 * @returns {boolean}
 */
export function reframeActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  return !!rules && typeof rules === 'object' && /** @type {Record<string, unknown>} */ (rules).reframeEnabled === true;
}

// ── The bounded reframe vocabulary (design §D7 act-class table + the bright lane) ──

/**
 * THE 8 ACT CLASSES × their bounded reframe vocabulary. `base` is the frozen-fact
 * reading (never stored — a pair with no transition reads as its base); `dark` is the
 * ordered darkening band (band 0 at DARK_ENTER, band 1 at DEEPEN); `bright` is the
 * misreading lane's term. `role` documents whose POV the reframe is (the reframing side).
 * The war/peace/leash/term consumers read the `aid`, `tribute` and `trade_dependence`
 * classes (fully wired below); `military` rides the obligations enumeration
 * (intervention-kind); `intelligence`/`mediation`/`religion`/`kinship` are vocab-complete
 * for the read-model + glossary and enumerated as an IN-FILE SEAM (their fact sources —
 * credibility/disinfo, treaties.mediator, faith receipts, intervention kinship-motive —
 * exist; wiring each class's own enumeration is a v2 the generic fold below already
 * supports). FROZEN. The standalone false-POSITIVE terms (misattributed_aid,
 * noble_enemy_myth, common_threat_misread) name the bright lane on the read-model/glossary.
 * @type {Readonly<Record<string, { base: string, role: string, dark: readonly string[], bright: string }>>}
 */
export const REFRAME_VOCAB = Object.freeze({
  aid: Object.freeze({ base: 'gift', role: 'giver', dark: Object.freeze(['debt_unpaid', 'tribute_extracted']), bright: 'gift_forgiven' }),
  tribute: Object.freeze({ base: 'honored_terms', role: 'bearer', dark: Object.freeze(['obligation_resented', 'extortion_endured']), bright: 'honored_terms_true' }),
  trade_dependence: Object.freeze({ base: 'commerce', role: 'dependent', dark: Object.freeze(['dependency_by_design']), bright: 'bonds_of_commerce' }),
  military: Object.freeze({ base: 'protection', role: 'protector', dark: Object.freeze(['occupation_that_never_left']), bright: 'unintended_kindness' }),
  intelligence: Object.freeze({ base: 'candor', role: 'sharer', dark: Object.freeze(['espionage_all_along']), bright: 'candor_kept' }),
  mediation: Object.freeze({ base: 'goodwill', role: 'broker', dark: Object.freeze(['manipulation']), bright: 'goodwill_true' }),
  religion: Object.freeze({ base: 'piety', role: 'patron', dark: Object.freeze(['infiltration']), bright: 'piety_true' }),
  kinship: Object.freeze({ base: 'bond', role: 'kin', dark: Object.freeze(['leverage']), bright: 'bond_true' }),
});

/** The act classes the mover ENUMERATES in v1 (the rest are vocab-complete + seamed). */
export const REFRAME_ACT_CLASSES = Object.freeze(Object.keys(REFRAME_VOCAB).sort());

/** The standalone bright-lane misreadings (design §D7 the bright misreading lane). */
export const BRIGHT_MISREADINGS = Object.freeze(['gift_forgiven', 'unintended_kindness', 'misattributed_aid', 'noble_enemy_myth', 'common_threat_misread', 'honored_terms_true', 'bonds_of_commerce', 'candor_kept', 'goodwill_true', 'piety_true', 'bond_true']);

/** Every dark reading term, for the consumer/display dark-classification. */
const DARK_TERMS = Object.freeze(new Set(Object.values(REFRAME_VOCAB).flatMap((v) => v.dark)));
/** Every bright reading term. */
const BRIGHT_TERMS = Object.freeze(new Set([...Object.values(REFRAME_VOCAB).map((v) => v.bright), 'misattributed_aid', 'noble_enemy_myth', 'common_threat_misread']));

/** @param {string} reading @returns {boolean} */
export function isDarkReading(reading) { return DARK_TERMS.has(String(reading)); }
/** @param {string} reading @returns {boolean} */
export function isBrightReading(reading) { return BRIGHT_TERMS.has(String(reading)); }

// ── Bounded, owner-retunable tuning (soak) ──────────────────────────────────

export const REFRAME_TUNING = Object.freeze({
  /** Dark reading fires when the dark lean clears this (negativity bias: below bright). */
  DARK_ENTER: 0.35,
  /** Bright (misreading) fires when the bright lean clears this — harder than dark. */
  BRIGHT_ENTER: 0.55,
  /** Within-dark band deepen (debt_unpaid → tribute_extracted) at this dark lean. */
  DEEPEN: 0.7,
  /** Hysteresis: a reversal requires the OPPOSING lean to clear ENTER + this deadband. */
  DEADBAND: 0.2,
  /** Scarcity-as-law: max concurrent non-neutral readings across the ledger (E0-rare). */
  CAP: 6,
  /** Below this |lean| a reading does not deepen its band (band-0 floor). */
  MIN_LEAN: 0.05,
  /** Base memory window (ticks) at horizon 1 (generational); scaled by memoryHorizon. */
  BASE_MEMORY_TICKS: 24,
  /** A trade edge is a "dependence" only above this dependency scalar. */
  DEPENDENCE_FLOOR: 0.4,
  // Lean weights (dark pressure − bright pressure, clamped to [-1, 1]).
  W_GRIEVANCE: 0.6,   // resentment (already D5-relaxed) darkens
  W_FEAR: 0.4,        // D4 hegemony fear tilts a feared power's gifts toward tribute
  W_LIAR: 0.5,        // a proven liar's past acts reframe darker
  W_PREDATORY: 0.5,   // the TRUE predatory mint-intent leaks in once warmth has cooled
  W_MALICE: 0.5,      // a malicious/paranoid court darkens; a benign one is nearly immune to good news
  W_WARMTH: 0.85,     // live warmth brightens (the misreading lane) — high enough that near-full
                      //   warmth alone can clear the sticky reconciliation deadband (the forgiveness lane)

  W_BENIGN: 0.4,      // a benign/trusting court misreads generously
});

// ── The pure interpretation read (facts frozen, meaning derived) ────────────

/**
 * The signed interpretation lean for one observer reading one act, in [-1, 1]:
 * negative = darkening (gift → debt), positive = brightening (a kindness misread). A pure
 * deterministic function of already-existing state; no rng, no writes. `warmth` and
 * `resentment` are the edge's D5-relaxed scalars (grievance is memory-scaled through
 * eligibility, not re-multiplied here — the memory law composes at the enumeration gate).
 * @param {{ warmth: number, resentment: number, fear01: number, liar01: number,
 *           predatory: boolean, malice01: number }} inputs
 * @returns {number}
 */
export function interpretationLean({ warmth, resentment, fear01, liar01, predatory, malice01 }) {
  const w = clamp(Number(warmth) || 0, -1, 1);
  const warmthPos = Math.max(0, w);
  const res = clamp01(Number(resentment) || 0);
  const fear = clamp01(Number(fear01) || 0);
  const liar = clamp01(Number(liar01) || 0);
  const mal = clamp01(Number(malice01) || 0.5);
  const malicePos = Math.max(0, mal - 0.5) * 2;   // 0 saintly-neutral … 1 fully malicious
  const benignPos = Math.max(0, 0.5 - mal) * 2;   // 0 malicious-neutral … 1 fully benign
  const T = REFRAME_TUNING;
  // The predatory mint-intent only darkens once the relationship has cooled — "the old aid
  // reads differently AFTER the border seizure" (coherent sunk-warmth psychology).
  const predatoryDark = predatory ? T.W_PREDATORY * (1 - warmthPos) : 0;
  const darkPressure = T.W_GRIEVANCE * res + T.W_FEAR * fear + T.W_LIAR * liar + predatoryDark + T.W_MALICE * malicePos;
  const brightPressure = T.W_WARMTH * warmthPos + T.W_BENIGN * benignPos;
  return clamp(brightPressure - darkPressure, -1, 1);
}

/**
 * The vocabulary term for an act class at a signed lean (deterministic). Null when the
 * lean is inside the neutral band (no transition). `role`-agnostic: the class already
 * encodes whose POV it is (the enumeration picks the class per observer role).
 * @param {string} actClass @param {number} lean @returns {string | null}
 */
export function readingForLean(actClass, lean) {
  const vocab = REFRAME_VOCAB[actClass];
  if (!vocab) return null;
  const T = REFRAME_TUNING;
  if (lean <= -T.DARK_ENTER) {
    const band = -lean >= T.DEEPEN && vocab.dark.length > 1 ? 1 : 0;
    return vocab.dark[band];
  }
  if (lean >= T.BRIGHT_ENTER) return vocab.bright;
  return null;
}

// ── The reframe ledger reads (pure worldState reads; absent ⇒ 0/neutral) ────

/** The directed reframe key: observer's reading OF subject. @param {unknown} a @param {unknown} b */
export function reframePairKey(a, b) { return `${String(a)}>${String(b)}`; }

/** @param {unknown} worldState @returns {Record<string, ReframeEntry> | null} */
function reframeLedgerOf(worldState) {
  return /** @type {Record<string, ReframeEntry> | null} */ (getSpatialLedger(worldState, 'reframes'));
}

/**
 * @typedef {Object} ReframeReading
 * @property {string} reading   the current vocabulary term
 * @property {number} lean      signed [-1,1], round4
 * @property {'dark'|'bright'} sign
 * @property {number} sinceTick the tick this reading first materialised (survives refolds)
 * @property {number} tick
 */
/**
 * @typedef {Object} ReframeEntry
 * @property {Record<string, ReframeReading>} readings keyed by act class
 * @property {number} updatedTick
 */

/**
 * The observer's current reading of a subject's act class (or null). Pure; absent ledger
 * ⇒ null ⇒ every consumer reads the frozen fact.
 * @param {unknown} worldState @param {unknown} observerId @param {unknown} subjectId @param {string} actClass
 * @returns {ReframeReading | null}
 */
export function reframeReadingOf(worldState, observerId, subjectId, actClass) {
  const ledger = reframeLedgerOf(worldState);
  if (!ledger) return null;
  const entry = ledger[reframePairKey(observerId, subjectId)];
  const rec = entry?.readings?.[actClass];
  return rec || null;
}

/** The full directed entry (for the read-model). @param {unknown} worldState @param {unknown} a @param {unknown} b */
export function reframeEntryFor(worldState, a, b) {
  const ledger = reframeLedgerOf(worldState);
  if (!ledger) return null;
  return ledger[reframePairKey(a, b)] || null;
}

/** Dark-aid-reading strength: `from` (the giver) reads the aid it gave `to` as an unpaid
 *  debt (debt_unpaid / tribute_extracted). 0 when absent/neutral/bright. The ingratitude_debt
 *  + restitution fuel. @returns {number} */
export function debtClaim01(worldState, from, to) {
  const r = reframeReadingOf(worldState, from, to, 'aid');
  return r && isDarkReading(r.reading) ? Math.abs(r.lean) : 0;
}

/** `from` (the dependent) reads its trade tie with `to` as deliberately engineered
 *  (dependency_by_design). 0 otherwise. The dependency_by_design fuel. @returns {number} */
export function dependencyByDesign01(worldState, from, to) {
  const r = reframeReadingOf(worldState, from, to, 'trade_dependence');
  return r && r.reading === 'dependency_by_design' ? Math.abs(r.lean) : 0;
}

/** Bright-aid/military reading: `party` reads `foe`'s past aid/protection as a genuine or
 *  forgiven kindness (gift_forgiven / unintended_kindness). The debt_forgiven peace fuel. */
export function debtForgiven01(worldState, party, foe) {
  const aid = reframeReadingOf(worldState, party, foe, 'aid');
  const mil = reframeReadingOf(worldState, party, foe, 'military');
  const best = Math.max(
    aid && isBrightReading(aid.reading) ? Math.abs(aid.lean) : 0,
    mil && isBrightReading(mil.reading) ? Math.abs(mil.lean) : 0,
  );
  return best;
}

/** Bright-trade reading: `party` reads its tie with `foe` as a mutual bond
 *  (bonds_of_commerce). The bonds_of_commerce peace fuel. @returns {number} */
export function bondsOfCommerce01(worldState, party, foe) {
  const r = reframeReadingOf(worldState, party, foe, 'trade_dependence');
  return r && r.reading === 'bonds_of_commerce' ? Math.abs(r.lean) : 0;
}

/** A darkly-reframed obligation `target` holds against `patron` (the debtor's resented
 *  debt — extortion_endured / obligation_resented). Leash-eligible material (the corruption
 *  bounded input). 0 when absent/neutral/bright. @returns {number} */
export function darkReframe01(worldState, target, patron) {
  const r = reframeReadingOf(worldState, target, patron, 'tribute');
  return r && isDarkReading(r.reading) ? Math.abs(r.lean) : 0;
}

/** A victor's reframed debt claim against a loser (the restitution peace-term producer).
 *  Same read as debtClaim01 — the reframed claim, priced and settleable. @returns {number} */
export function restitutionClaim01(worldState, victorId, loserId) {
  return debtClaim01(worldState, victorId, loserId);
}

// ── The mover ────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} ReframeAdvanceResult
 * @property {Record<string, unknown>} worldState
 * @property {boolean} changed
 * @property {Array<Record<string, unknown>>} newsEntries
 */

/** @param {number} n @returns {number} */
function round4(n) { return Math.round(n * 10000) / 10000; }

/**
 * Advance the reframe interpretation ledger one tick. DETERMINISTIC (no rng); gate absent
 * ⇒ an immediate no-op (no key, no read). It re-reads the immutable obligations ledger
 * (kind + predatory = true intent) and the trade-dependence relationship scalars, computes
 * each candidate observer's interpretation lean, and folds sticky, hysteresis-guarded,
 * capped transitions into spatialLedgers.reframes (drop-when-empty; serialize-compare).
 * NEVER writes any transfer/receipt/obligation ledger (the frozen-facts pin).
 *
 * `hegemonyFear` (the D4 belief-side context) and `credibilityOf` (a subject→liar01 closure)
 * are INJECTED by the caller (advanceWarReasons builds both); absent ⇒ their tilts are 0.
 *
 * @param {{ snapshot: { byId?: Map<string, { id: string, settlement?: unknown }>,
 *                       regionalGraph?: { edges?: Array<Record<string, unknown>> } },
 *           worldState: Record<string, unknown>,
 *           graph?: { edges?: Array<Record<string, unknown>> } | null,
 *           hegemonyFear?: { fearOf?: (o: string, s: string) => { score: number } } | null,
 *           credibilityOf?: ((subjectId: string) => number) | null,
 *           tick: number }} args
 * @returns {ReframeAdvanceResult}
 */
export function advanceReframe({ snapshot, worldState, graph, hegemonyFear = null, credibilityOf = null, tick }) {
  // ── DORMANCY GATE: the flag absent ⇒ an immediate no-op. No key, no read. ──
  if (!reframeActive(/** @type {{ simulationRules?: Record<string, unknown> }} */(worldState))) {
    return { worldState, changed: false, newsEntries: [] };
  }

  const prevLedger = reframeLedgerOf(worldState);
  const states = /** @type {Record<string, unknown>} */ (
    worldState.relationshipStates && typeof worldState.relationshipStates === 'object' ? worldState.relationshipStates : {});
  const byId = snapshot?.byId;
  const fearOf = hegemonyFear && typeof hegemonyFear.fearOf === 'function'
    ? (/** @type {string} */ o, /** @type {string} */ s) => clamp01(Number(hegemonyFear.fearOf(o, s)?.score) || 0)
    : () => 0;
  const liarOf = typeof credibilityOf === 'function'
    ? (/** @type {string} */ s) => clamp01(Number(credibilityOf(s)) || 0)
    : () => 0;

  // Resolve the relationship STATE from the REAL graph edges (relationshipStates are keyed by
  // relationshipKeyFromEdge of the authored edge — edge.id or the directional `rel.from.to`, NOT
  // a canonical pair key). Map BOTH orientations of every edge to its one ensured state, so a
  // directed reframe (observer→subject) reads the same shared relationship temperature whichever
  // way the pair's edge was authored. A pair with no edge reads neutral (a reframe can still form
  // from fear/credibility/malice alone). Built ONCE per tick.
  const edges = (graph?.edges && Array.isArray(graph.edges) ? graph.edges : null)
    || (Array.isArray(snapshot?.regionalGraph?.edges) ? snapshot.regionalGraph.edges : []);
  /** @type {Map<string, Record<string, unknown>>} */
  const stateByPair = new Map();
  for (const edge of edges) {
    const a = edge?.from != null ? String(edge.from) : '';
    const b = edge?.to != null ? String(edge.to) : '';
    if (!a || !b || a === b) continue;
    const st = ensureRelationshipState(edge, /** @type {Record<string, unknown>} */(states[relationshipKeyFromEdge(edge)]) || {});
    if (!stateByPair.has(`${a}|${b}`)) stateByPair.set(`${a}|${b}`, st);
    if (!stateByPair.has(`${b}|${a}`)) stateByPair.set(`${b}|${a}`, st);
  }
  const NEUTRAL_STATE = ensureRelationshipState({ from: '_', to: '__' }, {});
  const edgeState = (/** @type {string} */ a, /** @type {string} */ b) =>
    ({ state: stateByPair.get(`${a}|${b}`) || NEUTRAL_STATE });
  const malOf = (/** @type {string} */ id) => {
    const item = byId?.get?.(String(id));
    const mal = Number(settlementAlignment(/** @type {any} */ (item), worldState)?.malice01);
    return Number.isFinite(mal) ? clamp01(mal) : 0.5; // neutral (0.5) when unresolvable
  };
  const memWindowOf = (/** @type {string} */ id) => {
    const item = byId?.get?.(String(id));
    const mult = memoryHorizonMultiplierOf(/** @type {any} */ (item && typeof item === 'object' && 'settlement' in item ? item.settlement : item));
    return REFRAME_TUNING.BASE_MEMORY_TICKS * mult; // Infinity (undying) ⇒ never forgotten
  };

  /** One candidate reframe: observer reads subject's act class, with the underlying fact age. */
  /** @type {Array<{ observer: string, subject: string, actClass: string, lean: number }>} */
  const candidates = [];
  const addCandidate = (/** @type {string} */ observer, /** @type {string} */ subject, /** @type {string} */ actClass, /** @type {number} */ mintTick, /** @type {boolean} */ predatory) => {
    if (!observer || !subject || observer === subject || !REFRAME_VOCAB[actClass]) return;
    // Memory law: an act older than the observer's memory window is FORGOTTEN — forgetting
    // forecloses re-litigation (making peace before the grudge hardens matters).
    if (Number.isFinite(mintTick) && (tick - Number(mintTick)) > memWindowOf(observer)) return;
    const { state } = edgeState(observer, subject);
    const warmth = clamp01(Number(state.trust) || 0) - clamp01(Number(state.resentment) || 0);
    const lean = interpretationLean({
      warmth,
      resentment: Number(state.resentment) || 0,
      fear01: fearOf(observer, subject),
      liar01: liarOf(subject),
      predatory: !!predatory,
      malice01: malOf(observer),
    });
    candidates.push({ observer, subject, actClass, lean: round4(lean) });
  };

  // ── FACT SOURCE 1: the obligations ledger (aid/credit/intervention) — kind + predatory
  // = the frozen TRUE mint intent. Each debt yields the GIVER's reading of the aid it gave
  // (aid/military class) and the BEARER's reading of the debt it owes (tribute class). ──
  const obligations = /** @type {Record<string, { from?: unknown, to?: unknown, kind?: unknown, mintTick?: unknown, predatory?: unknown }> | null} */ (getSpatialLedger(worldState, 'obligations'));
  if (obligations && typeof obligations === 'object') {
    for (const k of Object.keys(obligations).sort()) {
      const rec = obligations[k];
      const debtor = rec?.from != null ? String(rec.from) : '';
      const creditor = rec?.to != null ? String(rec.to) : '';
      if (!debtor || !creditor || debtor === creditor) continue;
      const predatory = rec?.predatory === true;
      const mintTick = Number(rec?.mintTick);
      const givenClass = String(rec?.kind) === 'intervention' ? 'military' : 'aid';
      // The GIVER (creditor) reframes the aid it gave the debtor: gift → debt_unpaid /
      // protection → occupation; brightly, gift_forgiven / unintended_kindness.
      addCandidate(creditor, debtor, givenClass, mintTick, false);
      // The BEARER (debtor) reframes the obligation held over it: honored_terms →
      // extortion_endured; the predatory mint-intent leaks in as the relationship cools.
      addCandidate(debtor, creditor, 'tribute', mintTick, predatory);
    }
  }

  // ── FACT SOURCE 2: trade-dependence relationship edges (M6 dependence). The DEPENDENT
  // side reframes commerce → dependency_by_design (dark) / bonds_of_commerce (bright). ──
  for (const edge of edges) {
    const a = edge?.from != null ? String(edge.from) : '';
    const b = edge?.to != null ? String(edge.to) : '';
    if (!a || !b || a === b) continue;
    const key = relationshipKeyFromEdge(edge);
    const state = ensureRelationshipState(edge, /** @type {Record<string, unknown>} */(states[key]) || {});
    const dependency = clamp01(Number(state.dependency) || 0);
    if (dependency < REFRAME_TUNING.DEPENDENCE_FLOOR) continue;
    // The dependent side is the one with the LOWER leverage (the trade-weaker party); ties
    // resolve codepoint-stable so the reframe is deterministic.
    const leverage = clamp01(Number(state.leverage) || 0);
    const dependent = leverage <= 0.5 ? (a < b ? a : b) : (a < b ? b : a);
    const patron = dependent === a ? b : a;
    // A trade tie has no mint tick — it is a standing structure, always within memory.
    addCandidate(dependent, patron, 'trade_dependence', NaN, false);
  }

  // ── Fold: sticky, hysteresis-guarded, capped, both-signs, deterministic. ──
  const nextLedger = foldReframes(prevLedger, candidates, tick);

  const hasNext = Object.keys(nextLedger).length > 0;
  const prevSerialized = JSON.stringify(prevLedger || null);
  const nextSerialized = JSON.stringify(hasNext ? nextLedger : null);
  if (prevSerialized === nextSerialized) {
    return { worldState, changed: false, newsEntries: [] };
  }
  const nextWorldState = hasNext
    ? setSpatialLedger(worldState, 'reframes', nextLedger)
    : dropSpatialLedger(worldState, 'reframes');
  return { worldState: nextWorldState, changed: true, newsEntries: [] };
}

/**
 * Fold this tick's candidate leans over the prior ledger — the STICKY, HYSTERESIS,
 * CAP and BOTH-SIGNS discipline in one place. A reading is set on a neutral pair only
 * when its lean clears ENTER; it reverses only when the OPPOSING lean clears ENTER +
 * DEADBAND (the reconciliation/souring lane — no flapping); it persists otherwise. The
 * global CAP bounds concurrent non-neutral readings (existing sticky readings hold their
 * slots; new transitions fill the remainder strongest-first, codepoint tiebreak). Keys +
 * act-class keys codepoint-ordered so the serialization is byte-stable. Returns a plain
 * object (possibly empty) — the caller drops-when-empty.
 * @param {Record<string, ReframeEntry> | null | undefined} prevLedger
 * @param {Array<{ observer: string, subject: string, actClass: string, lean: number }>} candidates
 * @param {number} tick
 * @returns {Record<string, ReframeEntry>}
 */
function foldReframes(prevLedger, candidates, tick) {
  const T = REFRAME_TUNING;
  // Resolve each candidate to its proposed next reading (or null), carrying the prior.
  /** @type {Array<{ pairKey: string, actClass: string, reading: string | null, lean: number, priorSince: number | undefined, wasNonNeutral: boolean, isNew: boolean }>} */
  const resolved = [];
  for (const c of candidates) {
    const pairKey = reframePairKey(c.observer, c.subject);
    const prior = prevLedger?.[pairKey]?.readings?.[c.actClass];
    const priorReading = prior?.reading;
    const priorDark = priorReading ? isDarkReading(priorReading) : false;
    const priorBright = priorReading ? isBrightReading(priorReading) : false;
    const darkLean = Math.max(0, -c.lean);
    const brightLean = Math.max(0, c.lean);
    let reading = /** @type {string | null} */ (priorReading || null);
    if (!priorReading) {
      reading = readingForLean(c.actClass, c.lean); // neutral → transition only at ENTER
    } else if (priorDark) {
      // Sticky dark; reconcile to bright only when bright clears ENTER + DEADBAND.
      if (brightLean >= T.BRIGHT_ENTER + T.DEADBAND) reading = REFRAME_VOCAB[c.actClass].bright;
      else reading = readingForLean(c.actClass, Math.min(c.lean, -T.DARK_ENTER)); // hold dark, allow band deepen
    } else if (priorBright) {
      // Sticky bright; sour to dark only when dark clears ENTER + DEADBAND.
      if (darkLean >= T.DARK_ENTER + T.DEADBAND) reading = readingForLean(c.actClass, -Math.max(darkLean, T.DARK_ENTER));
      else reading = REFRAME_VOCAB[c.actClass].bright; // hold bright
    }
    resolved.push({
      pairKey, actClass: c.actClass, reading, lean: c.lean,
      priorSince: prior?.sinceTick,
      wasNonNeutral: !!priorReading,
      isNew: !priorReading && !!reading,
    });
  }
  // CAP: existing non-neutral readings hold their slots; new transitions fill the rest,
  // strongest |lean| first (codepoint tiebreak). Deterministic — no rng.
  const existingCount = resolved.filter((r) => r.wasNonNeutral && r.reading).length;
  const newOnes = resolved.filter((r) => r.isNew)
    .sort((a, b) => (Math.abs(b.lean) - Math.abs(a.lean)) || (a.pairKey < b.pairKey ? -1 : a.pairKey > b.pairKey ? 1 : (a.actClass < b.actClass ? -1 : 1)));
  const allowedNew = Math.max(0, T.CAP - existingCount);
  const admitted = new Set(newOnes.slice(0, allowedNew).map((r) => `${r.pairKey} ${r.actClass}`));
  for (const r of resolved) {
    if (r.isNew && !admitted.has(`${r.pairKey} ${r.actClass}`)) r.reading = null; // over cap ⇒ stays neutral
  }
  // Assemble the next ledger, codepoint-ordered.
  /** @type {Record<string, ReframeEntry>} */
  const byPair = {};
  for (const r of resolved) {
    if (!r.reading) continue;
    const sign = isDarkReading(r.reading) ? 'dark' : 'bright';
    (byPair[r.pairKey] || (byPair[r.pairKey] = { readings: {}, updatedTick: tick })).readings[r.actClass] = {
      reading: r.reading,
      lean: r.lean,
      sign,
      sinceTick: Number.isFinite(r.priorSince) ? Number(r.priorSince) : tick,
      tick,
    };
  }
  /** @type {Record<string, ReframeEntry>} */
  const ordered = {};
  for (const pk of Object.keys(byPair).sort()) {
    const readings = byPair[pk].readings;
    /** @type {Record<string, ReframeReading>} */
    const orderedReadings = {};
    for (const ac of Object.keys(readings).sort()) orderedReadings[ac] = readings[ac];
    ordered[pk] = { readings: orderedReadings, updatedTick: tick };
  }
  return ordered;
}
