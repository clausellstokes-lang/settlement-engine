/**
 * domain/autonomy/stopConditions.js — TYPED STOPCONDITIONS behind the schema wall
 * (SURVEYOR S7, DESIGN_AI_CONTROL_SURFACE §2 stage 7).
 *
 * A StopCondition is DATA: bounded combinators ('all' = AND, 'some' = OR) over typed tests, each test
 * referencing a REGISTERED signal id (signalRegistry). The wall is structural:
 *   • an unregistered signal id ⇒ validation failure ⇒ the condition is dead
 *     (no-op-type-no-effect, applied to reads);
 *   • a test whose shape mismatches the signal's TYPE (a threshold on a band, a set
 *     test naming values outside the signal's closed vocabulary) ⇒ failure;
 *   • depth > MAX_CONDITION_DEPTH or leaf tests > MAX_CONDITION_TESTS ⇒ failure
 *     (JUDGMENT: depth 3 / 8 leaves — enough for "food critical AND at war OR tick cap",
 *     small enough to audit at a glance; vetoable).
 *
 * The evaluator is a PURE read over a SignalFrame: zero writes, zero rng, zero Date —
 * "advance until condition" stays deterministic because evaluation IS a read-model
 * derivation, run at advance boundaries only (never inside the tick).
 */

import { signalById, resolveSignal } from './signalRegistry.js';

/** Combinator bounds (JUDGMENT — vetoable). */
export const MAX_CONDITION_DEPTH = 3;
export const MAX_CONDITION_TESTS = 8;

/**
 * @typedef {{ op: 'gte'|'lte', value: number }} ThresholdTest — number signals
 * @typedef {{ in: string[] }} SetTest — band/state signals (closed vocabulary)
 * @typedef {{ is: boolean }} BoolTest — bool signals
 * @typedef {ThresholdTest | SetTest | BoolTest} SignalTest
 *
 * @typedef {object} TestNode
 * @property {'test'} kind
 * @property {string} signalId
 * @property {string} [settlementId] - required for settlement/pair-scoped signals
 * @property {string} [otherId] - required for pair-scoped signals
 * @property {SignalTest} test
 *
 * @typedef {object} GroupNode
 * @property {'all'|'some'} kind
 * @property {ConditionNode[]} children
 *
 * @typedef {TestNode | GroupNode} ConditionNode
 *
 * @typedef {object} StopCondition
 * @property {1} version
 * @property {string} [label]
 * @property {ConditionNode} root
 */

/**
 * @typedef {object} ConditionValidation
 * @property {boolean} ok
 * @property {string[]} errors
 * @property {number} testCount
 * @property {number} depth
 */

/** @param {unknown} node @returns {node is TestNode} */
function isTestNode(node) {
  return Boolean(node) && typeof node === 'object' && /** @type {{ kind?: unknown }} */ (node).kind === 'test';
}

/** @param {unknown} node @returns {node is GroupNode} */
function isGroupNode(node) {
  const k = node && typeof node === 'object' ? /** @type {{ kind?: unknown }} */ (node).kind : null;
  return k === 'all' || k === 'some';
}

/**
 * @param {TestNode} node
 * @param {string[]} errors
 */
function validateTestNode(node, errors) {
  const entry = signalById(node.signalId || '');
  if (!entry) {
    errors.push(`unregistered signal "${String(node.signalId)}" — the schema wall rejects it`);
    return;
  }
  if ((entry.scope === 'settlement' || entry.scope === 'pair') && !node.settlementId) {
    errors.push(`signal "${entry.id}" is ${entry.scope}-scoped and requires settlementId`);
  }
  if (entry.scope === 'pair' && !node.otherId) {
    errors.push(`signal "${entry.id}" is pair-scoped and requires otherId`);
  }
  const test = /** @type {Record<string, unknown>} */ (node.test || {});
  if (entry.type === 'number') {
    const opOk = test.op === 'gte' || test.op === 'lte';
    const valOk = typeof test.value === 'number' && Number.isFinite(test.value);
    if (!opOk || !valOk) errors.push(`signal "${entry.id}" is a number — it takes { op: gte|lte, value }`);
  } else if (entry.type === 'band' || entry.type === 'state') {
    const set = Array.isArray(test.in) ? test.in : null;
    if (!set || set.length === 0) {
      errors.push(`signal "${entry.id}" is a ${entry.type} — it takes { in: [values] }`);
    } else {
      const vocab = entry.values || [];
      for (const v of set) {
        if (!vocab.includes(String(v))) {
          errors.push(`signal "${entry.id}": "${String(v)}" is outside its closed vocabulary (${vocab.join('/')})`);
        }
      }
    }
  } else if (entry.type === 'bool') {
    if (typeof test.is !== 'boolean') errors.push(`signal "${entry.id}" is a bool — it takes { is: true|false }`);
  }
}

/**
 * Validate a StopCondition against the schema wall. Pure; never throws.
 * @param {unknown} condition
 * @returns {ConditionValidation}
 */
export function validateStopCondition(condition) {
  /** @type {string[]} */
  const errors = [];
  let testCount = 0;
  let maxDepth = 0;
  const cond = /** @type {{ version?: unknown, root?: unknown }} */ (
    condition && typeof condition === 'object' ? condition : {});
  if (cond.version !== 1) errors.push('a StopCondition carries version: 1');

  /** @param {unknown} node @param {number} depth */
  const walk = (node, depth) => {
    maxDepth = Math.max(maxDepth, depth);
    if (depth > MAX_CONDITION_DEPTH) {
      errors.push(`condition depth ${depth} exceeds the cap (${MAX_CONDITION_DEPTH})`);
      return;
    }
    if (isTestNode(node)) {
      testCount += 1;
      if (testCount > MAX_CONDITION_TESTS) {
        if (testCount === MAX_CONDITION_TESTS + 1) {
          errors.push(`more than ${MAX_CONDITION_TESTS} tests — the combinator cap rejects it`);
        }
        return;
      }
      validateTestNode(node, errors);
      return;
    }
    if (isGroupNode(node)) {
      if (!Array.isArray(node.children) || node.children.length === 0) {
        errors.push(`an "${node.kind}" group requires at least one child`);
        return;
      }
      for (const child of node.children) walk(child, depth + 1);
      return;
    }
    errors.push('unknown condition node kind (expected test | all | some)');
  };
  walk(cond.root, 1);
  return { ok: errors.length === 0, errors, testCount, depth: maxDepth };
}

/**
 * @typedef {object} SignalEvaluation
 * @property {string} signalId
 * @property {string | null} settlementId
 * @property {string | null} otherId
 * @property {number | string | boolean | null} value — null when unreadable
 * @property {boolean} pass
 * @property {string} [reason] - set when unreadable
 */

/**
 * @typedef {object} StopEvaluation
 * @property {boolean} fired
 * @property {SignalEvaluation[]} evaluations
 * @property {string[]} errors — non-empty ⇒ the condition was structurally dead (never fires)
 */

/**
 * @param {TestNode} node
 * @param {import('./signalRegistry.js').SignalFrame} frame
 * @param {SignalEvaluation[]} evaluations
 * @returns {boolean}
 */
function evaluateTest(node, frame, evaluations) {
  const resolution = resolveSignal(node.signalId, frame, {
    settlementId: node.settlementId || null, otherId: node.otherId || null,
  });
  /** @type {SignalEvaluation} */
  const record = {
    signalId: node.signalId,
    settlementId: node.settlementId || null,
    otherId: node.otherId || null,
    value: null,
    pass: false,
  };
  // `=== false` (not `!`) so BOTH tsconfigs narrow the discriminated union — the
  // non-strict full config misses the `!x.ok` narrowing (caught by the full gate).
  if (resolution.ok === false) {
    record.reason = resolution.reason;
    evaluations.push(record);
    return false; // an unreadable signal NEVER fires a condition
  }
  record.value = resolution.value;
  const test = /** @type {Record<string, unknown>} */ (node.test || {});
  if (typeof resolution.value === 'number' && (test.op === 'gte' || test.op === 'lte')) {
    const threshold = typeof test.value === 'number' ? test.value : NaN;
    record.pass = test.op === 'gte' ? resolution.value >= threshold : resolution.value <= threshold;
  } else if (typeof resolution.value === 'string' && Array.isArray(test.in)) {
    record.pass = test.in.map(String).includes(resolution.value);
  } else if (typeof resolution.value === 'boolean' && typeof test.is === 'boolean') {
    record.pass = resolution.value === test.is;
  }
  evaluations.push(record);
  return record.pass;
}

/**
 * Evaluate a StopCondition against one frame (one advance boundary). PURE — no writes,
 * no rng, no clock. An invalid condition is STRUCTURALLY DEAD: fired stays false and the
 * wall's errors ride the result (the caller surfaces them; nothing advances on them).
 * @param {StopCondition} condition
 * @param {import('./signalRegistry.js').SignalFrame} frame
 * @returns {StopEvaluation}
 */
export function evaluateStopCondition(condition, frame) {
  const validation = validateStopCondition(condition);
  /** @type {SignalEvaluation[]} */
  const evaluations = [];
  if (!validation.ok) return { fired: false, evaluations, errors: validation.errors };

  /** @param {ConditionNode} node @returns {boolean} */
  const evalNode = (node) => {
    if (isTestNode(node)) return evaluateTest(node, frame, evaluations);
    if (isGroupNode(node)) {
      // Deliberately NOT short-circuiting: every leaf lands in `evaluations` so the
      // stop receipt shows the full picture the decision was made on.
      const results = node.children.map(evalNode);
      return node.kind === 'all' ? results.every(Boolean) : results.some(Boolean);
    }
    return false;
  };
  const fired = evalNode(condition.root);
  return { fired, evaluations, errors: [] };
}

/**
 * A one-line human reading of a condition (for receipts + the panel).
 * @param {StopCondition | null | undefined} condition
 * @returns {string}
 */
export function describeStopCondition(condition) {
  if (!condition || typeof condition !== 'object' || !condition.root) return '(no condition)';
  /** @param {ConditionNode} node @returns {string} */
  const part = (node) => {
    if (isTestNode(node)) {
      const test = /** @type {Record<string, unknown>} */ (node.test || {});
      const target = node.settlementId ? ` @${node.settlementId}${node.otherId ? `↔${node.otherId}` : ''}` : '';
      if (test.op === 'gte' || test.op === 'lte') {
        return `${node.signalId}${target} ${test.op === 'gte' ? '≥' : '≤'} ${String(test.value)}`;
      }
      if (Array.isArray(test.in)) return `${node.signalId}${target} in [${test.in.join(', ')}]`;
      if (typeof test.is === 'boolean') return `${node.signalId}${target} is ${String(test.is)}`;
      return node.signalId;
    }
    if (isGroupNode(node)) {
      return `(${node.children.map(part).join(node.kind === 'all' ? ' AND ' : ' OR ')})`;
    }
    return '?';
  };
  return condition.label ? `${condition.label}: ${part(condition.root)}` : part(condition.root);
}
