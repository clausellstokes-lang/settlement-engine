/**
 * tests/domain/corpusStaging.test.js — THE CORPUS FACTORY canon-boundary pins (V-5).
 *
 * The load-bearing law: staged-never-canonical-without-approval. These prove that ONLY
 * approved candidates can pass toward canon, that every canon candidate carries provenance,
 * and that the fold serializer is deterministic.
 */
import { describe, it, expect } from 'vitest';
import {
  CORPUS_KINDS, APPROVED_CORPUS, isCorpusKind, normalizeProvenance, normalizeCandidate,
  approvedForCanon, serializeApprovedCorpus, corpusCompendiumBlock,
} from '../../src/domain/compendium/corpusStaging.js';

const mk = (over = {}) => ({
  id: 'c1', kind: 'institutionDesc', target: 'The Gilded Ledger', text: 'A counting-house that never sleeps.',
  status: 'staged', provenance: { model: 'claude-opus-4-8', promptFamily: 'custom-content', date: '2026-07-20', source: 'ai-draft' },
  ...over,
});

describe('corpus staging — staged-never-canonical (the approval boundary)', () => {
  it('APPROVED_CORPUS ships EMPTY (nothing canonical until the owner commits)', () => {
    expect(APPROVED_CORPUS).toEqual([]);
  });

  it('approvedForCanon passes ONLY status:approved — staged/rejected can never reach canon', () => {
    const candidates = [
      mk({ id: 'a', status: 'staged' }),
      mk({ id: 'b', status: 'rejected', text: 'Rejected slop.' }),
      mk({ id: 'c', status: 'approved', text: 'An approved gem.' }),
    ];
    const canon = approvedForCanon(candidates);
    expect(canon).toHaveLength(1);
    expect(canon[0].text).toBe('An approved gem.');
  });

  it('excludes an approved candidate with an invalid kind or empty text', () => {
    const canon = approvedForCanon([
      mk({ id: 'x', status: 'approved', kind: 'notAKind', text: 'Wrong kind.' }),
      mk({ id: 'y', status: 'approved', text: '   ' }),
      mk({ id: 'z', status: 'approved', kind: 'npcVoice', text: 'A gravelly drawl.' }),
    ]);
    expect(canon).toHaveLength(1);
    expect(canon[0].kind).toBe('npcVoice');
  });

  it('every canon candidate carries a full provenance', () => {
    const canon = approvedForCanon([mk({ status: 'approved', provenance: { model: 'm' } })]);
    expect(canon[0].provenance).toEqual({ model: 'm', promptFamily: 'unknown', date: 'unknown', source: 'ai-draft' });
  });

  it('canon order is deterministic (kind → target → text)', () => {
    const shuffled = [
      mk({ id: '1', status: 'approved', kind: 'traditionMotif', target: 'b', text: 't' }),
      mk({ id: '2', status: 'approved', kind: 'institutionDesc', target: 'a', text: 't' }),
      mk({ id: '3', status: 'approved', kind: 'institutionDesc', target: 'a', text: 's' }),
    ];
    const a = approvedForCanon(shuffled).map((c) => c.text);
    const b = approvedForCanon([...shuffled].reverse()).map((c) => c.text);
    expect(a).toEqual(b); // order-independent input ⇒ identical canon order
  });
});

describe('corpus staging — the fold serializer', () => {
  it('serializes ONLY approved candidates; staged/rejected never appear', () => {
    const src = serializeApprovedCorpus([
      mk({ id: 'a', status: 'staged', text: 'STAGED_SECRET' }),
      mk({ id: 'b', status: 'rejected', text: 'REJECTED_SECRET' }),
      mk({ id: 'c', status: 'approved', text: 'APPROVED_PUBLIC' }),
    ]);
    expect(src).toContain('APPROVED_PUBLIC');
    expect(src).not.toContain('STAGED_SECRET');
    expect(src).not.toContain('REJECTED_SECRET');
    expect(src.startsWith('export const APPROVED_CORPUS = Object.freeze([')).toBe(true);
  });

  it('an all-unapproved (or empty) set serializes to the empty canon leaf', () => {
    expect(serializeApprovedCorpus([mk({ status: 'staged' })]))
      .toBe('export const APPROVED_CORPUS = Object.freeze([]);');
    expect(serializeApprovedCorpus([])).toBe('export const APPROVED_CORPUS = Object.freeze([]);');
  });

  it('the serializer is deterministic (same input ⇒ same bytes)', () => {
    const c = [mk({ id: 'c', status: 'approved' })];
    expect(serializeApprovedCorpus(c)).toBe(serializeApprovedCorpus(c));
  });
});

describe('corpus staging — helpers + compendium block', () => {
  it('isCorpusKind honors the closed vocabulary', () => {
    expect(CORPUS_KINDS.every(isCorpusKind)).toBe(true);
    expect(isCorpusKind('nope')).toBe(false);
  });

  it('normalizeProvenance always yields the full honest shape', () => {
    expect(normalizeProvenance(undefined)).toEqual({ model: 'unknown', promptFamily: 'unknown', date: 'unknown', source: 'ai-draft' });
  });

  it('normalizeCandidate drops runtime-only fields (id/status)', () => {
    const n = normalizeCandidate(mk({ status: 'approved' }));
    expect(Object.keys(n).sort()).toEqual(['kind', 'provenance', 'target', 'text']);
  });

  it('corpusCompendiumBlock shape: count + kinds + byKind + entries', () => {
    const block = corpusCompendiumBlock([{ kind: 'npcVoice', target: 't', text: 'x', provenance: normalizeProvenance() }]);
    expect(block.count).toBe(1);
    expect(block.authored).toBe(true);
    expect(block.byKind.npcVoice).toBe(1);
    expect(block.entries[0].provenance.source).toBe('ai-draft');
  });
});
