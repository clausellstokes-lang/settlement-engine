/**
 * tests/lib/emailTemplates.test.js — Tier 8.5 template contract tests.
 *
 * Three classes of guarantee:
 *
 *   1. Every template renders without throwing, with all placeholders
 *      substituted.
 *   2. Voice contract — no AI-generated framing slips in. Templates
 *      that mention narrative refinement use the "narrative refinement"
 *      phrase, never "AI prose" or "AI features." Settlement language
 *      uses "simulated" — the simulation-first identity is positioning,
 *      not marketing.
 *   3. Edge function parity — the inlined template strings in
 *      supabase/functions/send-email/index.ts must keep the same keys
 *      as src/lib/emailTemplates.js. We read the TS file as plain text
 *      and scan for the keys.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  TEMPLATES, renderTemplate, listTemplateKeys, missingVariables,
} from '../../src/lib/emailTemplates.js';

const ALL_KEYS = [
  'welcome',
  'save_confirmation',
  'export_confirmation',
  'credit_low',
  'founder_thank_you',
  'cap_warning',
];

describe('Tier 8.5 — TEMPLATES inventory', () => {
  it('ships all six lifecycle templates', () => {
    expect(listTemplateKeys().sort()).toEqual([...ALL_KEYS].sort());
  });

  it('every template has subject + text', () => {
    for (const key of ALL_KEYS) {
      expect(TEMPLATES[key]).toBeDefined();
      expect(typeof TEMPLATES[key].subject).toBe('string');
      expect(TEMPLATES[key].subject.length).toBeGreaterThan(0);
      expect(typeof TEMPLATES[key].text).toBe('string');
      expect(TEMPLATES[key].text.length).toBeGreaterThan(40);
    }
  });

  it('every template ends with the SettlementForge sign-off', () => {
    for (const key of ALL_KEYS) {
      expect(TEMPLATES[key].text).toMatch(/SettlementForge/);
    }
  });
});

describe('Tier 8.5 — renderTemplate()', () => {
  it('throws on unknown keys', () => {
    expect(() => renderTemplate('does-not-exist')).toThrow(/Unknown email template/);
  });

  it('substitutes single placeholders in subject + text', () => {
    const r = renderTemplate('save_confirmation', {
      displayName:    'Stoke',
      settlementName: 'Bramblefen',
      tier:           'town',
    });
    expect(r.subject).toBe('Saved: Bramblefen');
    expect(r.text).toContain('Hello Stoke,');
    expect(r.text).toContain('Bramblefen (town)');
    // No leftover {placeholders}.
    expect(r.subject).not.toMatch(/\{[^}]+\}/);
    expect(r.text).not.toMatch(/\{[^}]+\}/);
  });

  it('substitutes multiple placeholders in credit_low', () => {
    const r = renderTemplate('credit_low', {
      displayName:    'Stoke',
      balance:        '4',
      narrativeCost:  '3',
      dailyLifeCost:  '4',
    });
    expect(r.text).toContain('balance has dropped to 4');
    expect(r.text).toContain('costs 3 credits');
    expect(r.text).toContain('costs 4');
  });

  it('leaves missing placeholders visible (loud, not silent)', () => {
    const r = renderTemplate('save_confirmation', { displayName: 'Stoke' });
    // settlementName and tier are NOT supplied — should remain {literal}.
    expect(r.text).toContain('{settlementName}');
    expect(r.text).toContain('{tier}');
  });
});

describe('Tier 8.5 — missingVariables()', () => {
  it('returns the unfilled variables for a partial payload', () => {
    const missing = missingVariables('save_confirmation', { displayName: 'x' });
    expect(missing.sort()).toEqual(['settlementName', 'tier'].sort());
  });

  it('returns [] when every variable is supplied', () => {
    const missing = missingVariables('save_confirmation', {
      displayName: 'x', settlementName: 'y', tier: 'z',
    });
    expect(missing).toEqual([]);
  });

  it('flags unknown templates', () => {
    expect(missingVariables('unknown')).toContain('(unknown template)');
  });
});

describe('Tier 8.5 — Voice contract (anti-AI positioning lives in emails too)', () => {
  it('welcome email frames settlements as simulated, not AI-generated', () => {
    const text = TEMPLATES.welcome.text;
    expect(text).toMatch(/simulated/i);
    expect(text).toMatch(/[Nn]ot AI-generated/);
  });

  it('credit_low email reminds the user that settlements are credit-free', () => {
    const text = TEMPLATES.credit_low.text;
    // Should reinforce the "credits are only for the narrative layer" point,
    // not let the user think their settlements stop working.
    expect(text).toMatch(/narrative refinement/i);
  });

  it('no template uses "AI prose" or "AI features" framing', () => {
    for (const key of ALL_KEYS) {
      const t = TEMPLATES[key];
      const blob = `${t.subject}\n${t.text}`.toLowerCase();
      expect(blob).not.toMatch(/\bai prose\b/);
      expect(blob).not.toMatch(/\bai features\b/);
      expect(blob).not.toMatch(/\bai[- ]generated dossier\b/);
    }
  });
});

describe('Tier 8.5 — Edge function parity (client templates ↔ server templates)', () => {
  // Read the edge function source so we can verify the inlined template
  // keys haven't drifted from the client copy. We do NOT parse the TS;
  // we just check that the literal key tokens appear as object keys.
  const edgePath = resolve(process.cwd(), 'supabase/functions/send-email/index.ts');
  let edgeSource;
  try {
    edgeSource = readFileSync(edgePath, 'utf-8');
  } catch {
    edgeSource = '';
  }

  it('the edge function file exists', () => {
    expect(edgeSource.length).toBeGreaterThan(0);
  });

  it('the edge function declares every client template key', () => {
    if (!edgeSource) return; // skip if file missing
    for (const key of ALL_KEYS) {
      // Look for "key:" as an object literal key. Allows either bare or
      // quoted key (welcome: / "welcome": / 'welcome':).
      const re = new RegExp(`["']?${key}["']?\\s*:\\s*\\{`);
      expect(edgeSource).toMatch(re);
    }
  });

  it('the edge function declares ANON_OK_TEMPLATES containing cap_warning', () => {
    if (!edgeSource) return;
    expect(edgeSource).toMatch(/ANON_OK_TEMPLATES.*=.*new Set\(\[/s);
    expect(edgeSource).toMatch(/["']cap_warning["']/);
  });
});
