/**
 * tests/domain/newsBody.test.js — the wizardNews card-body sidecar (content-immersion-5).
 *
 * Behavioural gate for the pure display read-model src/domain/display/newsBody.js:
 * the card body is re-composed in the house voice from the entry's structured
 * fields (never the engine's "Applied via trade dependency…" summary), and the
 * terse scoring reasons are recast into fiction. BYTE-SAFE: this module is
 * imported only by the lazy WizardNewsPanel; it never mutates an entry.
 */

import { describe, it, expect } from 'vitest';

import { newsBodyText, newsReasonPhrases } from '../../src/domain/display/newsBody.js';

const TRANSITIONS = ['queued', 'ready', 'applied', 'resolved', 'ignored', 'expired'];

describe('newsBody — the card body speaks the house voice, not system-log', () => {
  it('every transition yields a non-empty in-world sentence with no engine vocabulary', () => {
    for (const kind of TRANSITIONS) {
      const text = newsBodyText({ kind, scope: 'regional', severity: 0.5 });
      expect(typeof text, kind).toBe('string');
      expect(text.length, kind).toBeGreaterThan(0);
      expect(/[.!?]$/.test(text), `${kind} terminal punct`).toBe(true);
      const lc = text.toLowerCase();
      // The engine lifecycle words and the "via <channel>" seam never appear.
      for (const bad of ['queued', 'ready', 'applied', 'resolved', 'expired', 'via ', '_']) {
        expect(lc.includes(bad), `${kind} leaks "${bad}": ${text}`).toBe(false);
      }
    }
  });

  it('scope colours the impact body; a heavy blow reads harder', () => {
    expect(newsBodyText({ kind: 'applied', scope: 'settlement', severity: 0.3 })).toContain('in the town');
    expect(newsBodyText({ kind: 'applied', scope: 'realm', severity: 0.3 })).toContain('across the realm');
    expect(newsBodyText({ kind: 'applied', scope: 'regional', severity: 0.9 })).toContain('hard');
    expect(newsBodyText({ kind: 'applied', scope: 'regional', severity: 0.4 })).not.toContain('hard');
  });

  it('is inert on a null/unknown entry (no throw, neutral line)', () => {
    expect(newsBodyText(null)).toBe('');
    expect(newsBodyText(undefined)).toBe('');
    const unknown = newsBodyText({ kind: 'weird_state', scope: 'realm' });
    expect(typeof unknown).toBe('string');
    expect(unknown.length).toBeGreaterThan(0);
    expect(unknown.toLowerCase().includes('weird_state')).toBe(false);
  });
});

describe('newsBody — reasons recast into fiction', () => {
  it('terse scoring receipts become fiction phrases; prose passes through; dupes collapse', () => {
    const entry = {
      reasons: ['high severity', 'critical regional channel', 'chain propagation', 'high severity'],
    };
    const phrases = newsReasonPhrases(entry);
    expect(phrases).toContain('a heavy blow');
    expect(phrases).toContain('carried along a vital road');
    expect(phrases).toContain('spreading from town to town');
    // The engine receipt vocabulary is gone.
    for (const p of phrases) {
      expect(p.toLowerCase().includes('severity'), p).toBe(false);
      expect(p.toLowerCase().includes('channel'), p).toBe(false);
    }
    // Deduped: 'high severity' appeared twice, 'a heavy blow' appears once.
    expect(phrases.filter(p => p === 'a heavy blow').length).toBe(1);
  });

  it('a world-pulse prose reason passes through unchanged', () => {
    const entry = { reasons: ['The sponsoring relationship de-escalated.'] };
    expect(newsReasonPhrases(entry)).toEqual(['The sponsoring relationship de-escalated.']);
  });

  it('is inert on absent reasons', () => {
    expect(newsReasonPhrases(null)).toEqual([]);
    expect(newsReasonPhrases({})).toEqual([]);
    expect(newsReasonPhrases({ reasons: [null, '', undefined] })).toEqual([]);
  });
});
