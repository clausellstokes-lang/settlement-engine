/** @vitest-environment jsdom */
/**
 * tests/config/pricing.test.js — Pricing config single-source-of-truth tests.
 *
 * These tests are deliberately strict because pricing drift is one of
 * the highest-stakes bugs we can ship: any mismatch between client and
 * server numbers either over-charges users or lets them spend free
 * credits. The contract test below pins the client's AI cost schedule
 * to the values the edge function enforces — when either changes, the
 * test fails and forces a deliberate sync.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  TIERS,
  SINGLE_DOSSIER,
  getActivePacks,
  getActiveAiCosts,
  getAiCost,
  getAiCostForModel,
  getVisibleTiers,
  singleDossierEnabled,
  findPackByKey,
  AI_MODEL_OPTIONS,
  DEFAULT_MODEL_PREFERENCE,
  normalizeModelPreference,
  isFastModelPreference,
  CHRONICLE_CREDIT_COST,
  _internal,
} from '../../src/config/pricing.js';

beforeEach(() => {
  window.localStorage.clear();
  window.history.replaceState({}, '', '/');
});

// ── Server contract ───────────────────────────────────────────────────────
// These literal values mirror the server-side CREDIT_COSTS map in
// supabase/functions/generate-narrative/index.ts. When the server's
// pricing changes, this block has to change too (and so does the
// edge function). A grep for "CONTRACT_AI_COSTS" finds both ends.
const CONTRACT_AI_COSTS_LEGACY = { narrative: 8, dailyLife: 10, progression: 12 };
const CONTRACT_AI_COSTS_NEW    = { narrative: 3, dailyLife: 4,  progression: 5  };

describe('AI cost server contract', () => {
  it('legacy schedule matches the server-enforced legacy costs', () => {
    expect(_internal.LEGACY_AI_COSTS).toEqual(CONTRACT_AI_COSTS_LEGACY);
  });

  it('new schedule matches the server-enforced new costs', () => {
    expect(_internal.NEW_AI_COSTS).toEqual(CONTRACT_AI_COSTS_NEW);
  });
});

// ── Chronicle cost — single source of truth ────────────────────────────────
// The chronicle credit cost (2) used to live in THREE unpinned copies:
//   - supabase/functions/generate-chronicle/index.ts  CHRONICLE_COST
//   - the spend_credits SQL CASE 'chronicle' branch    (migration 057, net-current)
//   - src/config/pricing.js (which had no chronicle entry at all)
// None read each other and none were tested, so any one could drift silently
// and over-/under-charge. These tests pin all three to pricing.js's
// CHRONICLE_CREDIT_COST by reading the actual server text — drift fails the gate.
describe('chronicle cost server contract', () => {
  it('pricing.js exposes a flat chronicle cost of 2 through every selector', () => {
    expect(CHRONICLE_CREDIT_COST).toBe(2);
    expect(getAiCost('chronicle')).toBe(2);
    // Flat regardless of model preference (chronicle always runs on Haiku).
    expect(getAiCostForModel('chronicle', 'anthropic_claude_opus_4_8')).toBe(2);
    expect(getAiCostForModel('chronicle', 'anthropic_claude_haiku_4_5')).toBe(2);
  });

  it('matches the generate-chronicle edge function CHRONICLE_COST constant', () => {
    const src = readFileSync(
      resolve(process.cwd(), 'supabase', 'functions', 'generate-chronicle', 'index.ts'),
      'utf-8',
    );
    const m = src.match(/const\s+CHRONICLE_COST\s*=\s*(\d+)/);
    expect(m, 'CHRONICLE_COST constant not found in generate-chronicle/index.ts').toBeTruthy();
    expect(Number(m[1])).toBe(CHRONICLE_CREDIT_COST);
  });

  it('matches the spend_credits SQL CASE \'chronicle\' branch (migration 057, net-current)', () => {
    const sql = readFileSync(
      resolve(process.cwd(), 'supabase', 'migrations', '057_enforce_account_status_writes.sql'),
      'utf-8',
    );
    const m = sql.match(/when\s+'chronicle'\s+then\s+(\d+)/i);
    expect(m, "spend_credits CASE 'chronicle' branch not found in migration 057").toBeTruthy();
    expect(Number(m[1])).toBe(CHRONICLE_CREDIT_COST);
  });
});

describe('getActiveAiCosts() / getAiCost()', () => {
  it('returns the repriced cost schedule', () => {
    expect(getActiveAiCosts()).toEqual(CONTRACT_AI_COSTS_NEW);
    expect(getAiCost('narrative')).toBe(3);
    expect(getAiCost('dailyLife')).toBe(4);
    expect(getAiCost('progression')).toBe(5);
  });

  it('returns 0 for unknown features', () => {
    expect(getAiCost('totallyMadeUp')).toBe(0);
  });
});

describe('AI model preferences', () => {
  it('defaults to the explicit Claude Opus preference', () => {
    expect(DEFAULT_MODEL_PREFERENCE).toBe('anthropic_claude_opus_4_8');
    expect(AI_MODEL_OPTIONS.find(option => option.key === DEFAULT_MODEL_PREFERENCE)?.model).toBe('claude-opus-4-8');
  });

  it('offers explicit Anthropic and OpenAI model IDs', () => {
    expect(AI_MODEL_OPTIONS.map(option => option.key)).toEqual([
      'anthropic_claude_opus_4_8',
      'anthropic_claude_sonnet_4_6',
      'anthropic_claude_haiku_4_5',
      'openai_gpt_5_2',
      'openai_gpt_5_mini',
      'openai_gpt_5_nano',
      'openai_gpt_4_1',
      'openai_gpt_4_1_mini',
    ]);
    expect(AI_MODEL_OPTIONS.find(option => option.key === 'openai_gpt_5_2')?.model).toBe('gpt-5.2');
  });

  it('normalizes legacy aliases into current explicit preferences', () => {
    expect(normalizeModelPreference('claude_best')).toBe('anthropic_claude_opus_4_8');
    expect(normalizeModelPreference('chatgpt_fast')).toBe('openai_gpt_5_mini');
    expect(normalizeModelPreference('not_real')).toBe(DEFAULT_MODEL_PREFERENCE);
  });

  it('uses model cost tiers for fast pricing', () => {
    expect(isFastModelPreference('anthropic_claude_haiku_4_5')).toBe(true);
    expect(isFastModelPreference('openai_gpt_5_mini')).toBe(true);
    expect(isFastModelPreference('openai_gpt_5_2')).toBe(false);
  });
});

describe('getActivePacks()', () => {
  it('returns the new (repriced) packs', () => {
    const packs = getActivePacks();
    expect(Object.keys(packs)).toEqual(['credits_25', 'credits_60', 'credits_150']);
  });

  it('every pack has the fields the UI needs', () => {
    for (const pack of Object.values(getActivePacks())) {
      expect(pack).toEqual(expect.objectContaining({
        key:       expect.any(String),
        name:      expect.any(String),
        price:     expect.any(String),
        credits:   expect.any(Number),
        perCredit: expect.any(String),
        tier:      expect.any(String),
      }));
    }
  });
});

describe('findPackByKey()', () => {
  it('resolves new SKUs', () => {
    expect(findPackByKey('credits_60')?.credits).toBe(60);
  });

  it('resolves legacy SKUs even when packsRepriced is on (refund/replay safety)', () => {
    expect(findPackByKey('credits_15')?.credits).toBe(15);
  });

  it('returns null for unknown keys', () => {
    expect(findPackByKey('does_not_exist')).toBeNull();
  });
});

describe('TIERS', () => {
  it('has wanderer / cartographer / founder', () => {
    expect(TIERS).toHaveProperty('wanderer');
    expect(TIERS).toHaveProperty('cartographer');
    expect(TIERS).toHaveProperty('founder');
  });

  it('wanderer is free and generates any size up to metropolis (size is NOT a paywall)', () => {
    expect(TIERS.wanderer.priceCents).toBe(0);
    expect(TIERS.wanderer.saveLimit).toBe(3);
    // A free ACCOUNT reaches the top generation size; the premium product is the
    // living simulation, never settlement size. Anon still caps at town (authSlice).
    expect(TIERS.wanderer.maxSize).toBe('metropolis');
  });

  it('size is not a premium lever — every account tier reaches metropolis', () => {
    expect(TIERS.wanderer.maxSize).toBe('metropolis');
    expect(TIERS.cartographer.maxSize).toBe('metropolis');
    expect(TIERS.founder.maxSize).toBe('metropolis');
  });

  it('cartographer is $6/mo and unlocks neighbourhood + supply chain', () => {
    expect(TIERS.cartographer.priceCents).toBe(600);
    expect(TIERS.cartographer.billing).toBe('monthly');
    expect(TIERS.cartographer.features.neighbourhoodSystem).toBe(true);
    expect(TIERS.cartographer.features.supplyChainMap).toBe(true);
  });

  it('founder is $99 lifetime with a 500-seat cap', () => {
    expect(TIERS.founder.priceCents).toBe(9900);
    expect(TIERS.founder.billing).toBe('lifetime');
    expect(TIERS.founder.seatLimit).toBe(500);
    expect(TIERS.founder.features.founderBadge).toBe(true);
  });

  it('founder unlocks the same surface as cartographer', () => {
    for (const key of Object.keys(TIERS.cartographer.features)) {
      if (key === 'founderBadge') continue;
      expect(TIERS.founder.features[key]).toBe(TIERS.cartographer.features[key]);
    }
  });
});

describe('getVisibleTiers()', () => {
  it('shows all three tiers (wanderer / cartographer / founder)', () => {
    const tiers = getVisibleTiers();
    expect(tiers.map(t => t.key)).toEqual(['wanderer', 'cartographer', 'founder']);
  });
});

describe('SINGLE_DOSSIER', () => {
  it('is $2.99, requires no account, and ships a PDF', () => {
    expect(SINGLE_DOSSIER.priceCents).toBe(299);
    expect(SINGLE_DOSSIER.priceLabel).toBe('$2.99');
    expect(SINGLE_DOSSIER.requiresAccount).toBe(false);
    expect(SINGLE_DOSSIER.deliverables).toContain('pdf');
  });

  it('singleDossierEnabled() is true (the one-shot ships)', () => {
    expect(singleDossierEnabled()).toBe(true);
  });
});
