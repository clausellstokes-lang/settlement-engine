/**
 * tests/copy/copy.test.js — Copy module contract tests.
 *
 * These are deliberately picky. The copy module is one of the few
 * places where a silent failure (missing key, broken interpolation)
 * surfaces directly to users, so we lock the behavior down hard.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { t, tx, en } from '../../src/copy/index.js';

afterEach(() => vi.restoreAllMocks());

describe('t()', () => {
  it('resolves a single-level key', () => {
    expect(t('common.save')).toBe('Save');
  });

  it('resolves a deeply nested key', () => {
    expect(t('pricing.tiers.wanderer.name')).toBe('Wanderer');
  });

  it('interpolates {var} placeholders', () => {
    expect(t('ai.narrative.button', { cost: 3 })).toBe('Generate narrative — 3 credits');
  });

  it('leaves unknown placeholders as literal {name} (loud, not silent)', () => {
    // "Generate narrative — {cost} credits" with no vars provided.
    expect(t('ai.narrative.button')).toBe('Generate narrative — {cost} credits');
  });

  it('returns the key string when missing (prod-safe fallback)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(t('does.not.exist')).toBe('does.not.exist');
    // In dev (vitest sets DEV=true) we expect a console.warn.
    expect(warn).toHaveBeenCalled();
  });

  it('handles multiple variables in one string', () => {
    expect(t('ai.insufficient', { cost: 12, balance: 4 }))
      .toBe('You need 12 credits for this. You have 4.');
  });

  it('does not interpolate when no vars passed (preserves braces)', () => {
    // footer.copyright = "© {year} SettlementForge"
    expect(t('footer.copyright')).toBe('© {year} SettlementForge');
  });
});

describe('tx()', () => {
  it('returns an array subtree', () => {
    const features = tx('pricing.tiers.wanderer.features');
    expect(Array.isArray(features)).toBe(true);
    expect(features.length).toBeGreaterThan(0);
  });

  it('returns an object subtree', () => {
    const sizes = tx('generate.sizes');
    expect(sizes).toEqual(expect.objectContaining({ hamlet: 'Hamlet', village: 'Village' }));
  });

  it('returns null for missing subtrees', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(tx('does.not.exist')).toBeNull();
    expect(warn).toHaveBeenCalled();
  });
});

describe('en map shape (drift guards)', () => {
  it('exposes all top-level namespaces components depend on', () => {
    const required = ['common', 'hero', 'generate', 'pipeline', 'auth', 'pricing', 'ai', 'tabs', 'onboarding', 'errors', 'footer'];
    for (const ns of required) {
      expect(en).toHaveProperty(ns);
      expect(typeof en[ns]).toBe('object');
    }
  });

  it('has every tab name referenced by the redesign §18.9 spec', () => {
    const requiredTabs = [
      'overview', 'summary', 'economics', 'power', 'defense', 'history',
      'relationships', 'plotHooks', 'dailyLife', 'services', 'resources',
      'viability', 'npcs', 'dmCompass',
    ];
    for (const tab of requiredTabs) {
      expect(en.tabs).toHaveProperty(tab);
      expect(typeof en.tabs[tab]).toBe('string');
      expect(en.tabs[tab].length).toBeGreaterThan(0);
    }
  });

  it('has all three pricing tiers with name + cta + features', () => {
    for (const tier of ['wanderer', 'cartographer', 'founder']) {
      const t = en.pricing.tiers[tier];
      expect(t).toBeDefined();
      expect(typeof t.name).toBe('string');
      expect(typeof t.cta).toBe('string');
      expect(Array.isArray(t.features)).toBe(true);
      expect(t.features.length).toBeGreaterThan(0);
    }
  });

  it('has button + running labels for every AI feature', () => {
    for (const feature of ['narrative', 'dailyLife', 'progression']) {
      const f = en.ai[feature];
      expect(f).toBeDefined();
      expect(f.button).toContain('{cost}');
      expect(typeof f.running).toBe('string');
    }
  });
});
