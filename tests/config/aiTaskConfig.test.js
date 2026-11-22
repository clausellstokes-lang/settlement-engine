/**
 * tests/config/aiTaskConfig.test.js — the AI TASK EFFICIENCY config pins
 * (OWNER COMMISSION: AI TOKEN EFFICIENCY, 2026-07-17). Routing/budgets are CONFIG, not
 * convention (directive 3); the models are real supported ids; the anomaly flag is honest.
 */
import { describe, it, expect } from 'vitest';
import {
  AI_ROUTING_CLASSES, ROUTING_CLASS_MODEL, AI_TASK_CONFIG,
  routingFor, modelForTask, maxTokensFor, sliceBudgetFor, tokenBudgetFor, overTokenBudget,
} from '../../src/config/aiTaskConfig.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

// Mirrors ANTHROPIC_SUPPORTED_MODELS in supabase/functions/ai-analyst/analystCore.ts — a
// routing model that isn't supported would be rejected by routeWorldDataAdapter at runtime.
const SUPPORTED_MODELS = [
  'claude-opus-4-8',
  'claude-sonnet-4-6',
  'claude-sonnet-4-5',
  'claude-haiku-4-5',
];

describe('aiTaskConfig — routing classes', () => {
  it('the three classes map to real supported models', () => {
    expect(AI_ROUTING_CLASSES).toEqual(['fast', 'balanced', 'deep']);
    for (const cls of AI_ROUTING_CLASSES) {
      expect(SUPPORTED_MODELS, `${cls} model`).toContain(ROUTING_CLASS_MODEL[cls]);
    }
  });

  it('every S4–S6 task routes to a valid class + supported model', () => {
    for (const task of Object.keys(AI_TASK_CONFIG)) {
      expect(AI_ROUTING_CLASSES).toContain(routingFor(task));
      expect(SUPPORTED_MODELS, `${task} model`).toContain(modelForTask(task));
    }
  });

  it('content + construction are BALANCED', () => {
    expect(routingFor('customContent')).toBe('balanced');
    expect(routingFor('constructSettlement')).toBe('balanced');
    expect(routingFor('constructRealm')).toBe('balanced');
  });

  // ⚰ THE RETIRED FAST ROW, MIRRORED (ODQ §763.2, Q-STYLE arm 2). styleOverhaul was this
  // map's ONLY `routing: 'fast'` task, so its removal is the one change here that alters
  // what the config can DEMONSTRATE, and saying so is the point of keeping an arm at all.
  it('RETIRED: styleOverhaul is no longer a task, and degrades to the unknown-task default', () => {
    // Driven through the estate's anchored-negative helper: an emptied config would satisfy
    // a bare not.toContain just as happily. 'customContent' is a sibling task on the same map.
    expectAbsentWithAnchor(
      Object.keys(AI_TASK_CONFIG), 'styleOverhaul', 'customContent', 'ODQ §763.2 de-list',
    );
    expect(routingFor('styleOverhaul')).toBe('balanced');
  });

  it('the FAST class stays wired even with no task routing to it', () => {
    // The class survives its last task. Asserted because a routing class that nothing
    // exercises is exactly the kind of thing a later cleanup deletes as "unused", and
    // ROUTING_CLASS_MODEL is the contract a re-homed style capability would route through.
    expect(AI_ROUTING_CLASSES).toContain('fast');
    expect(ROUTING_CLASS_MODEL.fast).toBe('claude-haiku-4-5');
    // ...and no task routes to it. Anchored on 'balanced', which every surviving task uses:
    // an emptied AI_TASK_CONFIG would satisfy the bare negative and hide a real de-wiring.
    expectAbsentWithAnchor(
      Object.values(AI_TASK_CONFIG).map((c) => c.routing), 'fast', 'balanced',
      'no task routes FAST after ODQ §763.2',
    );
  });
});

describe('aiTaskConfig — bounded budgets (ops, not essays)', () => {
  it('every task has a bounded max output, a slice budget, and a token budget', () => {
    for (const task of Object.keys(AI_TASK_CONFIG)) {
      expect(maxTokensFor(task)).toBeGreaterThan(0);
      expect(maxTokensFor(task)).toBeLessThanOrEqual(3000);   // ops, not prose padding
      const sb = sliceBudgetFor(task);
      expect(sb.maxSlices).toBeGreaterThan(0);
      expect(sb.maxChars).toBeGreaterThan(0);
      expect(tokenBudgetFor(task)).toBeGreaterThan(0);
    }
  });

  it('unknown tasks degrade to safe defaults', () => {
    expect(routingFor('nope')).toBe('balanced');
    expect(maxTokensFor('nope')).toBe(2000);
    expect(tokenBudgetFor('nope')).toBe(0);
  });
});

describe('aiTaskConfig — the anomaly flag (directive 7)', () => {
  it('flags only a call past its task budget; a 0/absent budget never flags', () => {
    expect(overTokenBudget('customContent', 20000)).toBe(true);   // > 14000
    expect(overTokenBudget('customContent', 5000)).toBe(false);
    expect(overTokenBudget('nope', 999999)).toBe(false);          // no budget ⇒ never flags
  });
});
