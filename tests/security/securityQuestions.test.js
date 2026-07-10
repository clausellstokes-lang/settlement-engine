/**
 * securityQuestions.test.js — pins the security-question CONTRACT shape and the
 * two-way match between the client constant and the DB allow-list.
 *
 * The id (not the free text) is the stored contract: src/data/securityQuestions.js
 * exports SECURITY_QUESTIONS[].id and migration 066 hard-codes the same id set in
 * public.is_allowed_security_question_id(). If those two drift, a user could be
 * shown a question whose id the RPCs reject (set fails) or a stored answer could
 * reference an id the client can't render. This guard makes that drift fail loudly.
 *
 * @see src/data/securityQuestions.js
 * @see supabase/migrations/066_security_questions_and_recovery.sql
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  SECURITY_QUESTIONS,
  SECURITY_QUESTION_IDS,
  securityQuestionText,
  isAllowedSecurityQuestionId,
} from '../../src/data/securityQuestions.js';

describe('SECURITY_QUESTIONS constant shape', () => {
  it('is a non-trivial fixed list (8–10 standard questions)', () => {
    expect(Array.isArray(SECURITY_QUESTIONS)).toBe(true);
    expect(SECURITY_QUESTIONS.length).toBeGreaterThanOrEqual(8);
    expect(SECURITY_QUESTIONS.length).toBeLessThanOrEqual(10);
  });

  it('every entry is { id, text } with a stable snake_case id and a real question', () => {
    for (const q of SECURITY_QUESTIONS) {
      expect(Object.keys(q).sort()).toEqual(['id', 'text']);
      expect(q.id).toMatch(/^[a-z][a-z0-9_]{0,39}$/);
      expect(typeof q.text).toBe('string');
      expect(q.text.trim().length).toBeGreaterThan(8);
      expect(q.text.trim().endsWith('?')).toBe(true);
    }
  });

  it('ids are unique (no collision in the stored contract)', () => {
    expect(new Set(SECURITY_QUESTION_IDS).size).toBe(SECURITY_QUESTION_IDS.length);
  });

  it('question text contains no em dash (house voice: em-dash ban)', () => {
    for (const q of SECURITY_QUESTIONS) {
      expect(q.text.includes('—'), `"${q.text}" must not use an em dash`).toBe(false);
    }
  });

  it('SECURITY_QUESTION_IDS mirrors SECURITY_QUESTIONS in order', () => {
    expect(SECURITY_QUESTION_IDS).toEqual(SECURITY_QUESTIONS.map((q) => q.id));
  });
});

describe('SECURITY_QUESTIONS helpers', () => {
  it('securityQuestionText resolves a known id and returns null for an unknown one', () => {
    expect(securityQuestionText(SECURITY_QUESTIONS[0].id)).toBe(SECURITY_QUESTIONS[0].text);
    expect(securityQuestionText('not_a_real_id')).toBeNull();
  });

  it('isAllowedSecurityQuestionId accepts every listed id and rejects others', () => {
    for (const id of SECURITY_QUESTION_IDS) expect(isAllowedSecurityQuestionId(id)).toBe(true);
    expect(isAllowedSecurityQuestionId('mothers_maiden_name')).toBe(false);
    expect(isAllowedSecurityQuestionId('')).toBe(false);
    expect(isAllowedSecurityQuestionId(undefined)).toBe(false);
  });
});

describe('client ↔ DB allow-list two-way match (066)', () => {
  const migration = resolve(
    process.cwd(),
    'supabase/migrations/066_security_questions_and_recovery.sql',
  );

  it('migration 066 exists on disk (a moved migration must fail loudly)', () => {
    expect(existsSync(migration)).toBe(true);
  });

  it('is_allowed_security_question_id() hard-codes EXACTLY the client id set', () => {
    const sql = readFileSync(migration, 'utf8');
    const fn = sql.match(
      /create or replace function public\.is_allowed_security_question_id[\s\S]*?\$\$;/i,
    );
    expect(fn, 'is_allowed_security_question_id must be defined in 066').toBeTruthy();
    // Pull every single-quoted id literal out of the function body.
    const dbIds = [...fn[0].matchAll(/'([a-z][a-z0-9_]{0,39})'/g)].map((m) => m[1]);
    // Every client id must be allowed by the DB...
    for (const id of SECURITY_QUESTION_IDS) {
      expect(dbIds, `DB allow-list is missing client id "${id}"`).toContain(id);
    }
    // ...and the DB must not allow an id the client never offers (drift the other way).
    for (const id of dbIds) {
      expect(SECURITY_QUESTION_IDS, `DB allows id "${id}" the client never offers`).toContain(id);
    }
    expect(new Set(dbIds).size).toBe(SECURITY_QUESTION_IDS.length);
  });
});
