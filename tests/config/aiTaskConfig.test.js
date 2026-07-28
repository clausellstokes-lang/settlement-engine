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

  it('styleOverhaul is FAST (cosmetic, ugly-never-unsafe); content + construction are BALANCED', () => {
    expect(routingFor('styleOverhaul')).toBe('fast');
    expect(modelForTask('styleOverhaul')).toBe('claude-haiku-4-5');
    expect(routingFor('customContent')).toBe('balanced');
    expect(routingFor('constructSettlement')).toBe('balanced');
    expect(routingFor('constructRealm')).toBe('balanced');
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
