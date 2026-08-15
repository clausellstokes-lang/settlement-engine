/**
 * config/aiTaskConfig.js — the AI TASK EFFICIENCY config (OWNER COMMISSION: AI TOKEN
 * EFFICIENCY, 2026-07-17). The canonical per-task-class routing + budget config for the
 * Surveyor S4–S6 write stages, so token spend is CONFIG, not convention (directive 3), and
 * every stage is BORN EFFICIENT.
 *
 * WHY: user-visible AI cost is an adoption risk — hardest on BYOK users who see their own
 * spend. Efficiency = house margin on managed credits + visible cost relief for BYOK. The
 * levers (each vetoable; the QUALITY BAR wins any conflict — §5 acceptance metrics are the
 * regression check):
 *   • ROUTING CLASS per task (fast/balanced/deep, §3 design) — cheaper models where the
 *     schema wall makes worst case a refused draft, deep reserved for where reasoning demands.
 *   • MAX OUTPUT TOKENS per task — structured ops, never prose padding (directive 4).
 *   • SLICE BUDGET per task — send only what the task needs; the slicer trims to it (directive 1/2).
 *   • TOKEN BUDGET per task — a soft ceiling; a call past it is FLAGGED to the operator
 *     (directive 7), never silently expensive.
 *
 * OPERATOR-OVERRIDABLE: these are DEFAULTS. An operator retunes a task's routing/budgets via
 * system_config (the ai_credit_costs override precedent) without a deploy — the same config-
 * edit lane the kill-switch and price estimates ride. This module is the source of truth the
 * client reads (cost estimate, model-class display); the edge functions mirror these constants
 * (pinned by tests/config/aiTaskConfig.test.js). PURE — no store/React/transport; the edge
 * carries its own literal mirror (Deno cannot import src/).
 */

/** The three routing classes (§3 design). fast = cheapest, deep = strongest. */
export const AI_ROUTING_CLASSES = Object.freeze(['fast', 'balanced', 'deep']);

/**
 * Routing class → the Anthropic model id (must ∈ ANTHROPIC_SUPPORTED_MODELS, analystCore.ts).
 * The edge resolves the model from the task's class unless a BYOK model preference overrides.
 */
export const ROUTING_CLASS_MODEL = Object.freeze({
  fast:     'claude-haiku-4-5',
  balanced: 'claude-sonnet-4-5',
  deep:     'claude-opus-4-8',
});

/**
 * Per-task config. `routing` picks the model class; `maxTokens` bounds the structured output;
 * `sliceBudget` caps retrieval ({ maxSlices, maxChars } per slice); `tokenBudget` is the soft
 * ceiling for the anomaly flag. JUDGMENT (vetoable): styleOverhaul routes FAST — a cosmetic,
 * schema-walled, ugly-never-unsafe compile; the content + construction stages route BALANCED
 * (sonnet) — structured, schema-constrained emit where the deterministic comparator/validator
 * does the judging, so opus is reserved for a comparator-demanded deep revise, not the default.
 */
export const AI_TASK_CONFIG = Object.freeze({
  customContent:       Object.freeze({ routing: 'balanced', maxTokens: 3000, sliceBudget: Object.freeze({ maxSlices: 8, maxChars: 3000 }), tokenBudget: 14000 }),
  styleOverhaul:       Object.freeze({ routing: 'fast',     maxTokens: 1500, sliceBudget: Object.freeze({ maxSlices: 4, maxChars: 2000 }), tokenBudget: 8000 }),
  constructSettlement: Object.freeze({ routing: 'balanced', maxTokens: 1800, sliceBudget: Object.freeze({ maxSlices: 6, maxChars: 2500 }), tokenBudget: 12000 }),
  constructRealm:      Object.freeze({ routing: 'balanced', maxTokens: 1800, sliceBudget: Object.freeze({ maxSlices: 6, maxChars: 2500 }), tokenBudget: 12000 }),
  autonomy:            Object.freeze({ routing: 'balanced', maxTokens: 1500, sliceBudget: Object.freeze({ maxSlices: 6, maxChars: 2500 }), tokenBudget: 10000 }),
});

/** The task's routing class (default 'balanced' for an unknown task). */
export function routingFor(task) {
  return AI_TASK_CONFIG[task]?.routing ?? 'balanced';
}

/** The Anthropic model id for a task (via its routing class). */
export function modelForTask(task) {
  return ROUTING_CLASS_MODEL[routingFor(task)] ?? ROUTING_CLASS_MODEL.balanced;
}

/** The bounded max output tokens for a task (default 2000). */
export function maxTokensFor(task) {
  return AI_TASK_CONFIG[task]?.maxTokens ?? 2000;
}

/** The retrieval slice budget for a task. */
export function sliceBudgetFor(task) {
  return AI_TASK_CONFIG[task]?.sliceBudget ?? { maxSlices: 6, maxChars: 2500 };
}

/** The soft token budget for a task (the anomaly-flag ceiling; 0 ⇒ no ceiling). */
export function tokenBudgetFor(task) {
  return AI_TASK_CONFIG[task]?.tokenBudget ?? 0;
}

/** Whether a call's total tokens blew past its task's soft budget (the operator anomaly flag,
 *  directive 7). Pure — a 0/absent budget never flags. */
export function overTokenBudget(task, totalTokens) {
  const budget = tokenBudgetFor(task);
  return budget > 0 && Number(totalTokens) > budget;
}
