/**
 * domain/worldPulse/npcGoalBranches.js — THE GOAL RULE TREE, AS A TABLE (W-LIVES
 * car L5; DESIGN_W_LIVES.md §4 and §15's F15, which OUTRANKS it).
 *
 * F15, verbatim: "`branchedGoals` is a rule tree, so car 5 carries an explicit
 * rule-tree → weighted-branch conversion sub-task (priced, not assumed)." This is
 * that conversion, and the pricing is the point — the tree it replaces was eleven
 * nested `if`s in `npcAgency.js`, whose behaviour was FIRST MATCH WINS and whose
 * every leaf was unreachable to a test except through the whole evaluator.
 *
 * ── ⭐⭐ THE CONVERSION'S ONE LAW: ZERO TILT MUST BE FIRST-MATCH-WINS ─────────
 *
 * A weighted branch table that merely "usually" agrees with the tree it replaced
 * is a live behaviour change wearing a refactor's commit message. So the weights
 * are built to make the old behaviour a THEOREM rather than a test result:
 *
 *   score(rule) = (RULES.length - priority) + tilt(rule)
 *
 * The base term is strictly decreasing in priority with a gap of exactly 1 between
 * neighbours, so with every tilt at zero the highest-priority ELIGIBLE rule has the
 * strictly highest score, always. That is first-match-wins, restated as arithmetic.
 *
 * ── ⭐ AND THE TILT IS BOUNDED TO ONE RUNG, BY DERIVATION ────────────────────
 *
 * §4 wants effective character to TILT the branch, not to choose it: "the dutiful
 * accept desperate errands, the self-serving refuse without pay" is a lean, and a
 * lean that could leapfrog four rungs would let a bold soul in a vassal town decide
 * he is not in a vassal town. So the tilt may move a branch AT MOST ONE RUNG:
 *
 *   two neighbours swap iff  2 × TILT_SPAN > 1     (mobility)
 *   no rule may pass two     2 × TILT_SPAN < 2     (the bound)
 *
 * which pins TILT_SPAN into the open interval (1/2, 1) and nowhere else. The value
 * is its midpoint — DERIVED from the two inequalities the design states, not a
 * number chosen and then justified.
 *
 * ── SEEDED, AND IT SPENDS NO PRNG ───────────────────────────────────────────
 *
 * Neither call site of the old tree had an `rng` in scope, and threading one in
 * would have been the expensive kind of change: a draw here advances a stream every
 * other consumer of that fork reads, so the same world would diverge downstream
 * from a branch nobody drew differently. The tie-break is therefore the estate's
 * OWN keyed-hash idiom (`proseSelection.fnv1a32`, "a pure FNV-1a hash of a STABLE
 * seed string — no rng"), which is deterministic, same-seed-stable, and costs the
 * stream nothing. Ties are the only place it is consulted; the tilt itself is a
 * pure read of the soul.
 *
 * PURE. No world state, no clock, no PRNG, no I/O, no mutation.
 *
 * @see docs/DESIGN_W_LIVES.md §4, §13 (R6), §15 (F15)
 * @enforced-by tests/domain/npcGoalBranches.test.js
 */

import { fnv1a32 } from './proseSelection.js';

/** The settlement-size ladder, low to high. Moved with the tree it serves. */
const TIER_ORDER = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);

/**
 * Which way a settlement moved between two ticks, or null when it did not move
 * (or when either tier is unreadable — an unknown tier is not a demotion).
 * @param {unknown} previousTier @param {unknown} nextTier
 * @returns {'promotion'|'demotion'|null}
 */
export function tierDirection(previousTier, nextTier) {
  const prev = TIER_ORDER.indexOf(/** @type {string} */ (previousTier));
  const next = TIER_ORDER.indexOf(/** @type {string} */ (nextTier));
  if (prev < 0 || next < 0 || prev === next) return null;
  return next > prev ? 'promotion' : 'demotion';
}

/**
 * THE BOUNDS THE ONE-RUNG LAW FIXES. Stated as the two inequalities rather than as
 * a single number, so a reader can check the derivation instead of trusting it.
 */
export const TILT_MOBILITY_MIN = 1 / 2;
export const TILT_BOUND_MAX = 1;
/** The midpoint of the only interval the law permits. */
export const TILT_SPAN = (TILT_MOBILITY_MIN + TILT_BOUND_MAX) / 2;

/**
 * ⭐ THE RULE TABLE — the eleven leaves of the old `if` chain, in the SAME ORDER,
 * each now addressable, testable and tiltable on its own.
 *
 * `nerve` is how BOLD the branch is on 0..1, and it is the only new authored column
 * in the conversion. It is read against the soul's risk-register CENTRE, so a
 * branch whose nerve matches what a person is drawn to gains score and one at the
 * far end loses it. The values are ordinal, not measured: `break_vassalage` is the
 * boldest thing a subject can want and `survive_tribute` is the least bold, and
 * everything else sits between them. An owner row, carried in the provenance below.
 *
 * @typedef {Object} GoalBranchRule
 * @property {string} id
 * @property {number} nerve  0..1, how bold this branch is
 * @property {(ctx: { state: Record<string, unknown>, context: Record<string, unknown>, dir: string|null }) => boolean} when
 * @property {{ shortGoal: string, longGoal: string }} goals
 *
 * ⚠ THE TABLE IS A CONTEXTUALLY-TYPED ARRAY LITERAL AND IS FROZEN AFTERWARDS, not
 * a list of `Object.freeze({...})` calls. `Object.freeze` is generic, so wrapping
 * each row defeats the contextual typing and every predicate's destructured
 * parameter lands as an implicit `any` — twenty strict errors on a leaf that must
 * contribute zero. Annotating the literal once types all thirteen.
 *
 * ⚠ AND THE `@type` LIVES IN ITS OWN COMMENT, one line above the literal: a single
 * JSDoc block that both DECLARES a typedef and annotates a binding does not carry
 * the annotation through, which is how the first cut still reported all twenty.
 */

/** @type {readonly GoalBranchRule[]} */
const RULE_TABLE = [
  ({
    id: 'vassal_dissident', nerve: 1,
    when: ({ state, context }) => context.relationship === 'vassal'
      && ['dissident', 'military', 'civic'].includes(/** @type {string} */ (state.roleArchetype)),
    goals: { shortGoal: 'organize_autonomy', longGoal: 'break_vassalage' },
  }),
  ({
    id: 'vassal_enduring', nerve: 0,
    when: ({ context }) => context.relationship === 'vassal',
    goals: { shortGoal: 'survive_tribute', longGoal: 'bind_external_patron' },
  }),
  ({
    id: 'overlord', nerve: 0.7,
    when: ({ context }) => context.relationship === 'overlord',
    goals: { shortGoal: 'secure_tribute', longGoal: 'expand_influence' },
  }),
  ({
    id: 'crisis_shepherd', nerve: 0.4,
    when: ({ state, context }) => Boolean(context.crisis)
      && ['healer', 'religious', 'labor_resource'].includes(/** @type {string} */ (state.roleArchetype)),
    goals: { shortGoal: 'protect_followers', longGoal: 'restore_order' },
  }),
  ({
    id: 'crisis_predator', nerve: 0.9,
    when: ({ state, context }) => Boolean(context.crisis) && Boolean(state.corruption),
    goals: { shortGoal: 'exploit_desperation', longGoal: 'expand_influence' },
  }),
  ({
    id: 'crisis_survivor', nerve: 0.1,
    when: ({ context }) => Boolean(context.crisis),
    goals: { shortGoal: 'survive_crisis', longGoal: 'restore_order' },
  }),
  ({
    id: 'promotion_merchant', nerve: 0.6,
    when: ({ state, dir }) => dir === 'promotion' && state.roleArchetype === 'merchant',
    goals: { shortGoal: 'join_guild', longGoal: 'expand_trade_house' },
  }),
  ({
    id: 'promotion_military', nerve: 0.6,
    when: ({ state, dir }) => dir === 'promotion' && state.roleArchetype === 'military',
    goals: { shortGoal: 'secure_new_garrison', longGoal: 'professionalize_guard' },
  }),
  ({
    id: 'promotion_seat', nerve: 0.5,
    when: ({ state, dir }) => dir === 'promotion'
      && ['ruler', 'civic', 'heir'].includes(/** @type {string} */ (state.roleArchetype)),
    goals: { shortGoal: 'formalize_new_charter', longGoal: 'secure_office' },
  }),
  ({
    id: 'promotion_opportunist', nerve: 0.75,
    when: ({ dir }) => dir === 'promotion',
    goals: { shortGoal: 'profit_from_change', longGoal: 'expand_influence' },
  }),
  ({
    id: 'demotion_vengeful', nerve: 0.8,
    when: ({ state, dir }) => dir === 'demotion' && Boolean(state.corruption),
    goals: { shortGoal: 'punish_rivals', longGoal: 'exploit_desperation' },
  }),
  ({
    id: 'demotion_shelter', nerve: 0.2,
    when: ({ dir }) => dir === 'demotion',
    goals: { shortGoal: 'survive_crisis', longGoal: 'protect_followers' },
  }),
  ({
    id: 'rivalry', nerve: 0.65,
    when: ({ context }) => context.relationship === 'hostile' || context.relationship === 'cold_war',
    goals: { shortGoal: 'mobilize_defenses', longGoal: 'settle_rivalry' },
  }),
];

/** The table, deep-frozen once. */
export const GOAL_BRANCH_RULES = Object.freeze(
  RULE_TABLE.map((rule) => Object.freeze({ ...rule, goals: Object.freeze(rule.goals) })),
);

/**
 * ⭐ THE CONVERSION. Every eligible rule scored; the highest score wins; ties break
 * on a stable keyed hash and then on rule order, so a branch is a property of the
 * world rather than of the iteration.
 *
 * `riskCenter` ABSENT (or unreadable) ⇒ EVERY TILT IS ZERO ⇒ first-match-wins,
 * which is exactly the tree this replaced. That is the call every production caller
 * makes today, and it is why this conversion moves no byte.
 *
 * @param {Object} args
 * @param {Record<string, unknown>} args.state
 * @param {Record<string, unknown>} args.context
 * @param {number} [args.riskCenter]  0..1 from `riskRegister().center`; absent ⇒ no tilt
 * @param {string} [args.seedKey]     a stable string for the tie-break
 * @returns {{ shortGoal: string, longGoal: string }|null}
 */
export function branchedGoalsFor({ state, context, riskCenter, seedKey }) {
  const s = state && typeof state === 'object' ? state : {};
  const c = context && typeof context === 'object' ? context : {};
  const dir = tierDirection(s.contextTier, c.tier);
  // ⚠⚠ `typeof === 'number'` BEFORE the finite check, and it is not belt-and-braces.
  // `Number(null)` is 0 and `Number('')` is 0, both of which pass `Number.isFinite`,
  // so a NULL risk centre would have read as a MAXIMALLY TIMID soul and quietly
  // re-branched every NPC whose caller had nothing to say. That is the estate's
  // `Number(null)`-is-finite class (§865's clock bug), and its second sighting in
  // this program: the register's centre is always a number when it exists, so an
  // absent one must be told apart by its TYPE and not by its numeric value.
  const tilted = typeof riskCenter === 'number' && Number.isFinite(riskCenter);
  const center = tilted ? Math.max(0, Math.min(1, riskCenter)) : 0;

  let best = null;
  for (const [priority, rule] of GOAL_BRANCH_RULES.entries()) {
    if (!rule.when({ state: s, context: c, dir })) continue;
    // A branch whose nerve MATCHES the soul's centre gains; one at the opposite end
    // loses. `1 - 2|Δ|` runs +1 at a perfect match to −1 at the far corner, so the
    // whole swing is exactly 2·TILT_SPAN and the one-rung law above binds it.
    const tilt = tilted ? TILT_SPAN * (1 - 2 * Math.abs(rule.nerve - center)) : 0;
    const score = (GOAL_BRANCH_RULES.length - priority) + tilt;
    if (!best || score > best.score) { best = { score, rule, priority }; continue; }
    if (score === best.score) {
      // A TIE IS THE ONLY PLACE THE SEED IS SPENT, and it spends no stream: an
      // FNV-1a over a stable key, the estate's own `pickLine` idiom.
      const key = `${String(seedKey || '')}:${rule.id}|${best.rule.id}`;
      if ((fnv1a32(key) & 1) === 1) best = { score, rule, priority };
    }
  }
  return best ? best.rule.goals : null;
}

/**
 * Provenance, in the module, the L1 catalog's idiom.
 * @type {Readonly<{ status: string, signedBy: string|null, ownerRows: readonly string[] }>}
 */
export const GOAL_BRANCH_PROVENANCE = Object.freeze({
  status: 'CANDIDATE, OWNER-UNSIGNED (the nerve column is the conversion\'s one authored addition)',
  signedBy: null,
  ownerRows: Object.freeze([
    'the `nerve` column: thirteen ordinal values saying how bold each branch is. They are the only numbers this conversion authored, they change NOTHING while the tilt is absent, and they are what a signed pass would tune first',
    'the ONE-RUNG bound. TILT_SPAN is derived from two inequalities (a tilt must be able to swap neighbours, and must never pass two), so the pen signs the LAW rather than the number. Widening it past 1 lets character overrule the world',
  ]),
});
