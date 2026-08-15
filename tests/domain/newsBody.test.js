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

import {
  newsBodyText, newsReaderSummary, newsReasonPhrases, BODY_POOLS,
} from '../../src/domain/display/newsBody.js';

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

  it('uses authored phrases for known reason tokens and never leaks token punctuation', () => {
    expect(newsReasonPhrases({
      reasons: ['border_raid', 'critical_impact_type', 'unmapped-reason'],
    })).toEqual([
      'a raid across the border',
      'a matter that cuts deep',
      'unmapped reason',
    ]);
  });

  it('is inert on absent reasons', () => {
    expect(newsReasonPhrases(null)).toEqual([]);
    expect(newsReasonPhrases({})).toEqual([]);
    expect(newsReasonPhrases({ reasons: [null, '', undefined] })).toEqual([]);
  });

  it('fails closed for legacy climb-down analytics and replaces the raw tooltip', () => {
    const entry = {
      kind: 'momentum_climb_down',
      summary: 'Commitment 3.2× its cliff; price 0.62.',
      reasons: ['Stock 3.2× the cliff.', 'Relief 38%.'],
    };
    expect(newsReasonPhrases(entry)).toEqual([
      'the court held to the war beyond an easy retreat',
      'the reversal exacted a real political price',
    ]);
    expect(newsReaderSummary(entry)).toBe(
      'The court held to the war too long; reversing course carried a real political price.',
    );
    // anchored: the exact reader summary above proves the kind-specific projection fired.
    expect(newsReaderSummary(entry)).not.toMatch(/\d|%|×|\b(?:stock|commitment|cliff)\b/i);
  });
});

describe('newsBody — VIEW-TIME variety (CONTENT-VT-2)', () => {
  const BANNED = ['queued', 'ready', 'applied', 'resolved', 'expired', 'via ', '_'];

  it('every pool line (all variants, both scopes) stays in the house voice', () => {
    for (const [cell, pool] of Object.entries(BODY_POOLS)) {
      expect(pool.length, `${cell} has variety`).toBeGreaterThanOrEqual(2);
      for (const raw of pool) {
        // Fill the scope token both ways so scope-bearing lines are scanned whole.
        for (const scope of ['in the town', 'across the region', 'across the realm']) {
          const text = raw.replace('{scope}', scope);
          expect(/[.!?]$/.test(text), `${cell}: "${text}" terminal punct`).toBe(true);
          const lc = text.toLowerCase();
          for (const bad of BANNED) {
            expect(lc.includes(bad), `${cell} leaks "${bad}": ${text}`).toBe(false);
          }
        }
      }
    }
  });

  it('CANONICAL-AT-ZERO: an entry with no id renders the original single line, byte-identical', () => {
    // Index 0 of each pool is the pre-CONTENT-VT-2 string; an id-less entry must
    // pick it, so every legacy / id-less caller is unchanged.
    expect(newsBodyText({ kind: 'queued' })).toBe(BODY_POOLS.queued[0]);
    expect(newsBodyText({ kind: 'ready' })).toBe(BODY_POOLS.ready[0]);
    expect(newsBodyText({ kind: 'resolved' })).toBe(BODY_POOLS.resolved[0]);
    expect(newsBodyText({ kind: 'ignored' })).toBe(BODY_POOLS.ignored[0]);
    expect(newsBodyText({ kind: 'expired' })).toBe(BODY_POOLS.expired[0]);
    expect(newsBodyText({ kind: 'weird_state', scope: 'realm' })).toBe(BODY_POOLS.default[0].replace('{scope}', 'across the realm'));
    expect(newsBodyText({ kind: 'applied', scope: 'settlement', severity: 0.3 }))
      .toBe(BODY_POOLS.appliedLight[0].replace('{scope}', 'in the town'));
    expect(newsBodyText({ kind: 'applied', scope: 'regional', severity: 0.9 }))
      .toBe(BODY_POOLS.appliedHeavy[0].replace('{scope}', 'across the region'));
    // The same holds when id is explicitly null/empty (the `?? ''` path).
    expect(newsBodyText({ kind: 'queued', id: null })).toBe(BODY_POOLS.queued[0]);
    expect(newsBodyText({ kind: 'queued', id: '' })).toBe(BODY_POOLS.queued[0]);
  });

  it('DETERMINISM: same id ⇒ same line; the pick is stable across calls', () => {
    for (const kind of ['queued', 'ready', 'resolved', 'ignored', 'expired']) {
      const a = newsBodyText({ kind, id: 'wizard_news.7.x.evt42' });
      const b = newsBodyText({ kind, id: 'wizard_news.7.x.evt42' });
      expect(a, kind).toBe(b);
    }
    // applied is keyed by severity band too — same id + same band is stable.
    const h1 = newsBodyText({ kind: 'applied', scope: 'realm', severity: 0.9, id: 'e1' });
    const h2 = newsBodyText({ kind: 'applied', scope: 'realm', severity: 0.9, id: 'e1' });
    expect(h1).toBe(h2);
  });

  it('ANTI-REPETITION: distinct ids reach the whole pool (full reachability)', () => {
    // Sweep enough ids that every variant of every pool is drawn at least once.
    const seen = /** @type {Record<string, Set<string>>} */ ({});
    for (const cell of Object.keys(BODY_POOLS)) seen[cell] = new Set();
    for (let i = 0; i < 400; i++) {
      const id = `evt_${i}`;
      seen.queued.add(newsBodyText({ kind: 'queued', id }));
      seen.ready.add(newsBodyText({ kind: 'ready', id }));
      seen.resolved.add(newsBodyText({ kind: 'resolved', id }));
      seen.ignored.add(newsBodyText({ kind: 'ignored', id }));
      seen.expired.add(newsBodyText({ kind: 'expired', id }));
      seen.default.add(newsBodyText({ kind: 'other', scope: 'regional', id }));
      seen.appliedHeavy.add(newsBodyText({ kind: 'applied', scope: 'regional', severity: 0.9, id }));
      seen.appliedLight.add(newsBodyText({ kind: 'applied', scope: 'regional', severity: 0.3, id }));
    }
    for (const [cell, pool] of Object.entries(BODY_POOLS)) {
      expect(seen[cell].size, `${cell} fully reachable`).toBe(pool.length);
    }
  });
});
