/**
 * npcLadderGoals.js — THE LADDER dynamic-goal layer (a lazy sibling leaf of
 * npcLadderKernel.js; DESIGN_THE_LADDER.md §3.2, §9, §11.3, + the ATTRIBUTION RULE).
 *
 * A goal is a DERIVED READ, never a stored abstraction: a typed condition over
 * REGISTERED S7 signals, selected by the NPC's LENS (rung / faction domain / personality
 * + FLAWS), carrying STAKES priced at mint and a HORIZON minted WITH the stakes. This
 * leaf REUSES the S7 signalRegistry + StopCondition evaluator read-only (never forks it):
 * a goal's condition IS a StopCondition; evaluateStopCondition gives the non-short-
 * circuiting receipt the challenge engine cites (the S7 evaluator idiom).
 *
 * WEIGHTED DEEDS (§9): stakes = state-distance × scope × adversity × domain-relevance,
 * priced at mint and settled at outcome. Partial progress deposits proportionally (§11.3
 * — long works pay as they visibly advance; reversal withdraws). THE ATTRIBUTION RULE:
 * a deposit weights by OFFICE (the responsible seat) × DOMAIN (the faction's actual
 * domain over the signal) — out-of-domain achievements pay a stated fraction, so credit
 * over a shared settlement-state signal never free-rides.
 *
 * v1 goal vocabulary = the causal SYSTEM_VARIABLES scores (settlement-scoped, 0..100),
 * which resolve purely from the snapshot's memoized item.causal — NO pressures derivation
 * needed, freshness-safe. registerSignal mints NO new signals in v1 (the additive lane
 * exists; §6). Pure, deterministic, rng-free, clock-free.
 */
import { evaluateStopCondition } from '../autonomy/stopConditions.js';
import { factionArchetype } from '../factionArchetypes.js';
import { clamp01 } from '../../kernel/math.js';
import { num, asObject, round4 } from './npcLadderState.js';

// ── Tuning (JUDGMENT — say "veto" to retune) ──────────────────────────────────
export const GOAL_TUNING = Object.freeze({
  // Ambition thresholds (the causal score a goal drives its domain signal toward),
  // chosen by the NPC's risk appetite (flaws): proud/bold reach high (great works,
  // long horizons, high stakes), cautious grind a modest floor (small reliable deeds).
  THRESHOLD_HIGH: 78,
  THRESHOLD_MID: 60,
  THRESHOLD_LOW: 45,
  // Horizon (weeks): minted WITH stakes — a great work is years, a small deed is weeks.
  HORIZON_MIN_WEEKS: 26,
  HORIZON_PER_STAKE_WEEKS: 130, // × stakes (0..~2) ⇒ up to ~4½ years for a max-stakes work
  HORIZON_MAX_WEEKS: 520,
  // Adversity: a settlement in crisis (causal vars in the worst bands) multiplies stakes.
  ADVERSITY_BONUS: 1.0, // ×(1 + BONUS × crisisFraction)
  // Deposit scale: a fully-achieved max-stakes deed lifts standing by ≈ SEED_SPREAD (one
  // rung of head-start) at full attribution.
  DEPOSIT_SCALE: 1.5,
  // THE ATTRIBUTION RULE: office weight decays down the rungs (the top seat is the
  // responsible office); an out-of-domain achievement pays this fraction.
  OFFICE_DECAY: 0.25,
  OFFICE_FLOOR: 0.3,
  OUT_OF_DOMAIN_MULT: 0.35,
});

// The faction archetype → its domain causal SYSTEM_VARIABLES (primary first). The lens
// picks the primary; DOMAIN attribution credits a faction fully only for its own domain.
/** @type {Readonly<Record<string, readonly string[]>>} */
export const FACTION_DOMAIN = Object.freeze({
  government: ['ruling_authority', 'public_legitimacy', 'law_order'],
  noble: ['ruling_authority', 'public_legitimacy'],
  military: ['defense_readiness', 'law_order'],
  merchant: ['economic_capacity', 'trade_connectivity'],
  religious: ['religious_authority', 'social_trust'],
  criminal: ['criminal_opportunity'],
  arcane: ['magical_stability'],
  craft: ['economic_capacity', 'infrastructure_condition'],
  labor: ['labor_capacity', 'economic_capacity'],
  outsider: ['trade_connectivity', 'social_trust'],
  occupation: ['law_order', 'defense_readiness'],
  civic: ['public_legitimacy', 'infrastructure_condition', 'food_security', 'social_trust'],
  other: ['social_trust', 'public_legitimacy'],
});
const DEFAULT_DOMAIN = FACTION_DOMAIN.other;

/** The faction's domain vars (primary first). @param {unknown} faction @returns {readonly string[]} */
export function factionDomainVars(faction) {
  const arch = factionArchetype(/** @type {Parameters<typeof factionArchetype>[0]} */ (faction));
  return FACTION_DOMAIN[arch] || DEFAULT_DOMAIN;
}

// ── The NPC lens (personality + FLAWS bias goal selection) ────────────────────
const HIGH_RISK = new Set(['proud', 'ambitious', 'bold', 'brave', 'reckless', 'ruthless', 'arrogant', 'zealous', 'vengeful']);
const LOW_RISK = new Set(['cautious', 'timid', 'prudent', 'loyal', 'humble', 'patient', 'meek', 'careful']);
const SUPPRESSIVE = new Set(['cruel', 'ruthless', 'tyrannical', 'paranoid', 'vengeful']);

/** The core trait words of an NPC (dominant/flaw/modifier), lowercased.
 *  @param {Record<string, unknown>} npc @returns {string[]} */
function traitsOf(npc) {
  const p = npc.personality;
  if (typeof p === 'string') return [p.toLowerCase()];
  if (Array.isArray(p)) return p.filter((x) => typeof x === 'string').map((x) => x.toLowerCase());
  const o = asObject(p);
  return [o.dominant, o.flaw, o.modifier].filter((x) => typeof x === 'string').map((x) => String(x).toLowerCase());
}
/** The NPC's risk appetite from its flaws (the design's "flaws = risk appetite").
 *  @param {Record<string, unknown>} npc @returns {'high'|'low'|'mid'} */
export function riskAppetiteOf(npc) {
  const traits = traitsOf(npc);
  if (traits.some((t) => HIGH_RISK.has(t))) return 'high';
  if (traits.some((t) => LOW_RISK.has(t))) return 'low';
  return 'mid';
}

// ── Adversity (settlement-scoped, freshness-safe) ─────────────────────────────
/** The crisis fraction of a settlement: the share of causal vars sitting in the two
 *  worst bands (war/crisis multiplies stakes). Reads the snapshot's memoized causal.
 *  @param {{ causal?: unknown }|null|undefined} item @returns {number} */
export function crisisFractionOf(item) {
  const bands = asObject(asObject(item).causal).bands;
  const b = asObject(bands);
  const keys = Object.keys(b);
  if (!keys.length) return 0;
  let bad = 0;
  for (const k of keys) {
    const band = String(b[k]);
    if (band === 'critical' || band === 'collapsed' || band === 'crisis') bad += 1;
  }
  return clamp01(bad / keys.length);
}

// ── Goal minting (the lens → a typed StopCondition + stakes + horizon) ────────
/**
 * Mint a goal for a rung-holder. Selects a domain signal by the faction; the FLAW's risk
 * appetite sets the ambition threshold (proud reach high, cautious grind modest);
 * suppressive flaws bias toward law_order (impose harsh order). Stakes = state-distance ×
 * adversity; horizon minted with stakes. Returns null when the frame can't read the signal.
 * @param {Object} a
 * @param {Record<string, unknown>} a.npc
 * @param {unknown} a.faction
 * @param {number} a.rungIndex
 * @param {string} a.sid
 * @param {import('../autonomy/signalRegistry.js').SignalFrame} a.frame
 * @param {{ causal?: unknown }|null|undefined} a.item
 * @param {number} a.weeks
 * @returns {import('./npcLadderKernel.js').LadderGoal|null}
 */
export function mintGoal({ npc, faction, rungIndex, sid, frame, item, weeks }) {
  const T = GOAL_TUNING;
  const domain = factionDomainVars(faction);
  const risk = riskAppetiteOf(npc);
  const traits = traitsOf(npc);
  // Suppressive flaws target law_order (impose order) when it isn't already the domain lead.
  let signalVar = domain[0];
  if (traits.some((t) => SUPPRESSIVE.has(t))) signalVar = 'law_order';
  const threshold = risk === 'high' ? T.THRESHOLD_HIGH : risk === 'low' ? T.THRESHOLD_LOW : T.THRESHOLD_MID;

  const signalId = `causal.${signalVar}.score`;
  const condition = {
    version: /** @type {1} */ (1),
    label: `${signalVar}≥${threshold}`,
    root: { kind: /** @type {'test'} */ ('test'), signalId, settlementId: sid, test: { op: /** @type {'gte'} */ ('gte'), value: threshold } },
  };
  const evalResult = evaluateStopCondition(condition, frame);
  const startScore = readLeafValue(evalResult);
  if (startScore == null) return null; // unreadable ⇒ no goal this state (honest null)

  // Stakes (§9): state-distance (how far the current state is from the ambition) ×
  // adversity (crisis multiplies). Scope = settlement-wide (causal) ⇒ 1. Domain-relevance
  // folds into the deposit's attribution, not the mint stakes.
  const distance01 = clamp01(Math.abs(threshold - startScore) / 100) + (risk === 'high' ? 0.15 : 0);
  const adversity = 1 + T.ADVERSITY_BONUS * crisisFractionOf(item);
  const stakes = round4(clamp01(distance01) * adversity);
  const horizonWeeks = Math.min(T.HORIZON_MAX_WEEKS, Math.max(T.HORIZON_MIN_WEEKS, Math.round(T.HORIZON_MIN_WEEKS + stakes * T.HORIZON_PER_STAKE_WEEKS)));

  return {
    condition,
    stakes,
    horizonWeeks,
    mintedWeek: weeks,
    mintedRung: rungIndex,
    startScore: round4(startScore),
    progress: 0, // banked progress starts at zero (only FUTURE advance earns deposits)
    basis: describeGoal(signalVar, threshold, startScore),
  };
}

/** Read the single leaf's numeric value from an evaluation (v1 goals are one causal test).
 *  @param {import('../autonomy/stopConditions.js').StopEvaluation} evalResult @returns {number|null} */
function readLeafValue(evalResult) {
  for (const e of evalResult.evaluations || []) {
    if (typeof e.value === 'number' && Number.isFinite(e.value)) return e.value;
  }
  return null;
}

/** Progress toward the ambition from the mint baseline: 0 at start, 1 at threshold.
 *  @param {number} startScore @param {number} nowScore @param {number} threshold @returns {number} */
export function progressOf(startScore, nowScore, threshold) {
  const span = threshold - startScore;
  if (Math.abs(span) < 1e-9) return nowScore >= threshold ? 1 : 0;
  return clamp01((nowScore - startScore) / span);
}

/** A human-readable goal basis (receipts + the NPC-card display stock).
 *  @param {string} signalVar @param {number} threshold @param {number} startScore @returns {string} */
function describeGoal(signalVar, threshold, startScore) {
  const noun = signalVar.replace(/_/g, ' ');
  const verb = startScore < threshold ? 'raise' : 'hold';
  return `${verb} ${noun} above ${threshold}`;
}

/**
 * Evaluate a goal this advance against the frame. Progress is computed from the goal's
 * stored mint baseline (startScore→threshold), so it is fully deterministic and
 * serializable. Unreadable signal ⇒ the premise LAPSED (honest null — the kernel reminds
 * without reward/penalty). @param {import('./npcLadderKernel.js').LadderGoal} goal
 * @param {import('../autonomy/signalRegistry.js').SignalFrame} frame
 * @returns {{ progress: number, value: number|null, readable: boolean, fired: boolean }}
 */
export function evaluateGoal(goal, frame) {
  const evalResult = evaluateStopCondition(goal.condition, frame);
  const value = readLeafValue(evalResult);
  if (value == null) return { progress: goal.progress, value: null, readable: false, fired: false };
  const threshold = num(asObject(asObject(goal.condition.root).test).value, 0);
  const progress = progressOf(num(goal.startScore, value), value, threshold);
  return { progress: round4(progress), value, readable: true, fired: evalResult.fired };
}

/**
 * THE ATTRIBUTION RULE weight for a deposit: OFFICE (the responsible seat — top rung full,
 * decaying down) × DOMAIN (the faction's actual domain over the signal — full in-domain,
 * a stated fraction out-of-domain). @param {number} rungIndex @param {unknown} faction
 * @param {string} signalVar @returns {number}
 */
export function attributionWeight(rungIndex, faction, signalVar) {
  const T = GOAL_TUNING;
  const office = Math.max(T.OFFICE_FLOOR, 1 - Math.max(0, rungIndex) * T.OFFICE_DECAY);
  const domain = factionDomainVars(faction);
  const inDomain = domain.includes(signalVar);
  return round4(office * (inDomain ? 1 : T.OUT_OF_DOMAIN_MULT));
}

/** The goal's target causal var (for attribution). @param {import('./npcLadderKernel.js').LadderGoal} goal */
export function goalSignalVar(goal) {
  const id = String(asObject(asObject(goal.condition).root).signalId || '');
  const m = id.match(/^causal\.(.+)\.score$/);
  return m ? m[1] : '';
}
