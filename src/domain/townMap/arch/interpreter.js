/**
 * domain/townMap/arch/interpreter.js -- K-1 GRAMMAR: the deterministic two-phase interpreter.
 *
 * Expands a frozen RULESET (plain-data rules over the 12 ops) into a flat list of mesh TERMINALS.
 * The pipeline the kernel doc specifies:
 *   PHASE 1 (massing)   -- expand every rule to terminals; `occlude` ops record a PENDING branch
 *                          (their subtree is NOT expanded yet) since they need the frozen index.
 *   FREEZE              -- build the deterministic occlusion index over the massing terminals.
 *   PHASE 2 (events + occlusion) -- resolve pending occludes against the frozen index, then FIRE
 *                          cross-shape EVENTS in (eventName-codepoint, index) order (the CGA++ gate;
 *                          the buttress-flyer springs pier-subtree -> clerestory-subtree). Iterate
 *                          rounds until dry (a max-round guard FAILS CLOSED).
 *
 * `defer(tier)` yields all LOD tiers from one derivation prefix -- LOD-consistent by construction
 * (the massing prefix is shared across tiers; only detail branches gate on ctx.tier). Every
 * stochastic choice comes from createPRNG keyed by (seedId, shape.path) -- the never-restamp idiom,
 * so the same seed + path always draws the same value regardless of expansion order.
 *
 * FAIL-CLOSED: an unregistered symbol, an unregistered op, a structural-ceiling breach (rules/shapes
 * per tier, HARD_TIER_CEILINGS), or a runaway phase-2 round count all throw at build time -- never a
 * silent over-budget or a silent wrong shape.
 *
 * PURITY: {+,-,*,/} via helpers + a seeded PRNG import; 0 transcendental sites.
 *
 * @typedef {import('./grammarIR.js').Shape} Shape
 * @typedef {import('./grammarIR.js').InterpCtx} Ctx
 * @typedef {import('./grammarIR.js').Ruleset} Ruleset
 * @typedef {import('./grammarIR.js').OpArgs} OpArgs
 * @typedef {import('./grammarIR.js').EventSpec} EventSpec
 * @typedef {import('./grammarIR.js').OcclusionIndex} OcclusionIndex
 * @typedef {import('./ops.js').TerminalRec} TerminalRec
 */

import { createPRNG } from '../../../kernel/prng.js';
import { makeShape, childPath, HARD_TIER_CEILINGS, assertRole } from './grammarIR.js';
import { OPS } from './ops.js';
import { buildOcclusionIndex } from './occlusionIndex.js';
import { compareCodepoint } from './project.js';

const MAX_PHASE2_ROUNDS = 6;

/**
 * Validate a ruleset shape once, fail-closed. A ruleset:
 *   { name, symbols:[...], axiom:{ sym, scope, attrs }, rules:{ [sym]: [opInvocation...] }, events?:[...] }
 * @param {Ruleset} ruleset
 */
function validateRuleset(ruleset) {
  if (!ruleset || typeof ruleset !== 'object') throw new Error('arch/interpreter: ruleset must be an object');
  if (!Array.isArray(ruleset.symbols) || ruleset.symbols.length === 0) throw new Error('arch/interpreter: ruleset.symbols must be a non-empty array');
  if (!ruleset.axiom || !ruleset.axiom.sym) throw new Error('arch/interpreter: ruleset.axiom.sym required');
  if (!ruleset.rules || typeof ruleset.rules !== 'object') throw new Error('arch/interpreter: ruleset.rules required');
}

/**
 * Expand a set of seed shapes to terminals, honoring the frozen index if present (phase 2). Returns
 * the terminals produced + any PENDING occlude records (for the next round).
 * @param {Shape[]} seeds @param {Ctx} ctx
 * @returns {{ terminals: TerminalRec[], pending: Array<{ shape: Shape, args: OpArgs }> }}
 */
function expand(seeds, ctx) {
  /** @type {TerminalRec[]} */ const terminals = [];
  /** @type {Array<{ shape: Shape, args: OpArgs }>} */ const pending = [];
  /** @type {Shape[]} */ const stack = seeds.slice();
  const ceil = HARD_TIER_CEILINGS[ctx.tier];
  while (stack.length) {
    const shape = stack.pop();
    if (shape === undefined) break;
    ctx.meters.shapes++;
    if (ctx.meters.shapes > ceil.shapes) throw new Error(`arch/interpreter: shape ceiling ${ceil.shapes} breached at tier ${ctx.tier} (path ${shape.path})`);
    if (!ctx.symbols.has(shape.sym)) throw new Error(`arch/interpreter: symbol "${shape.sym}" is not in the ruleset's frozen symbol set (path ${shape.path})`);
    const body = ctx.ruleset.rules[shape.sym];
    if (!body) throw new Error(`arch/interpreter: no rule for symbol "${shape.sym}" (every symbol needs a rule; path ${shape.path})`);
    ctx.meters.rules++;
    if (ctx.meters.rules > ceil.rules) throw new Error(`arch/interpreter: rule ceiling ${ceil.rules} breached at tier ${ctx.tier}`);
    // A rule body is an ordered list of op-invocations; children preserve op-order (pushed reversed
    // so they pop in declared order -> deterministic, permutation-invariant given the same rules).
    /** @type {Shape[]} */ const localChildren = [];
    for (const inv of body) {
      const op = OPS[inv.op];
      if (!op) throw new Error(`arch/interpreter: op "${inv.op}" is not registered (12-op vocabulary; sym ${shape.sym})`);
      const r = op(ctx, shape, inv);
      for (const t of r.terminals) { terminals.push(t); ctx.meters.terminals++; }
      for (const p of r.pending) pending.push(p);
      for (const c of r.children) localChildren.push(c);
    }
    for (let i = localChildren.length - 1; i >= 0; i--) stack.push(localChildren[i]);
  }
  return { terminals, pending };
}

/**
 * Fire cross-shape EVENTS against the frozen index, in (eventName-codepoint, index) order. Each event
 * spec: { name, produces: (indexed, ctx) => Shape[] } -- a pure function returning connector shapes
 * (e.g. the flyer springing from a pier terminal to a clerestory terminal). The connectors are then
 * expanded to terminals. Deterministic: events sort by name, pairs come from the sorted index.
 * @param {Ctx} ctx @returns {Shape[]} the connector seed shapes (unexpanded)
 */
function fireEvents(ctx) {
  const events = (ctx.ruleset.events || []).slice().sort((/** @type {EventSpec} */ a, /** @type {EventSpec} */ b) => compareCodepoint(a.name, b.name));
  /** @type {Shape[]} */ const seeds = [];
  for (const ev of events) {
    const produced = ev.produces(/** @type {OcclusionIndex} */ (ctx.occlusionIndex), ctx) || [];
    let i = 0;
    for (const s of produced) {
      // re-key each connector's path under the event name + index (stable, deterministic)
      seeds.push(makeShape(s.sym, s.scope, s.attrs, childPath(`event/${ev.name}`, String(i++))));
    }
  }
  return seeds;
}

/**
 * Interpret a ruleset at a tier into terminals + meters. Deterministic + fail-closed.
 * @param {Ruleset} ruleset
 * @param {{ seedId?: string, tier: number }} opts
 * @returns {{ terminals: TerminalRec[], meters: { rules: number, shapes: number, terminals: number, rounds: number } }}
 */
export function interpret(ruleset, opts) {
  validateRuleset(ruleset);
  const tier = opts.tier;
  if (!HARD_TIER_CEILINGS[tier]) throw new Error(`arch/interpreter: unknown LOD tier ${tier}`);
  const seedId = opts.seedId || 'k1';
  const symbols = new Set(ruleset.symbols);
  /** @type {Map<string, () => number>} */ const prngCache = new Map();
  const meters = { rules: 0, shapes: 0, terminals: 0, rounds: 0 };
  const ctx = {
    tier, ruleset, symbols, meters,
    occlusionIndex: /** @type {ReturnType<typeof buildOcclusionIndex> | null} */ (null),
    /** keyed uniform draw on a stable path (never restamped). @param {string} path @param {number} salt @returns {number} */
    rand(path, salt) {
      const key = `${seedId}:${path}:${salt}`;
      let fn = prngCache.get(key);
      if (!fn) { const p = createPRNG(key); fn = () => p.random(); prngCache.set(key, fn); }
      return fn();
    },
  };

  // axiom shape at path 'root'
  const ax = ruleset.axiom;
  const axiom = makeShape(ax.sym, ax.scope, {
    materialRole: assertRole(ax.attrs.materialRole),
    lodTier: tier,
    params: Object.freeze({ ...(ax.attrs.params || {}) }),
  }, 'root');

  // PHASE 1 -- massing
  const phase1 = expand([axiom], ctx);
  /** @type {TerminalRec[]} */ const all = phase1.terminals.slice();
  let pending = phase1.pending;

  // FREEZE the occlusion index over the massing terminals
  ctx.occlusionIndex = buildOcclusionIndex(all);

  // PHASE 2 -- resolve pending occludes + fire events, iterate until dry
  let firstRound = true;
  while (pending.length || firstRound) {
    if (meters.rounds++ > MAX_PHASE2_ROUNDS) throw new Error(`arch/interpreter: phase-2 exceeded ${MAX_PHASE2_ROUNDS} rounds (a runaway occlude/event cascade)`);
    /** @type {Shape[]} */ const seeds = [];
    // resolve pending occludes (index is set -> the op returns children this time)
    for (const p of pending) {
      const r = OPS.occlude(ctx, p.shape, p.args);
      for (const c of r.children) seeds.push(c);
    }
    // fire events exactly once (first round)
    if (firstRound) for (const s of fireEvents(ctx)) seeds.push(s);
    firstRound = false;
    if (seeds.length === 0) break;
    const round = expand(seeds, ctx);
    for (const t of round.terminals) all.push(t);
    pending = round.pending;
  }

  return { terminals: all, meters };
}
