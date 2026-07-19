/**
 * customContentTraditions.test.js — THE TRADITIONS wave (T-5). The `traditions`
 * custom-content bucket: the validator (validateTradition, the validateDeity template),
 * the motif-key drift guard (the eager frozen literals must equal the lazy corpus), and
 * the AI schema-wall registration (CONTENT_BUCKETS + the motif mechanical fields + the
 * epithet flavor field).
 */
import { describe, it, expect } from 'vitest';
import {
  validateTradition, TRADITION_ELEMENT_KEYS, TRADITION_ACT_KEYS, TRADITION_EPITHET_MAX_LENGTH,
} from '../../src/domain/customContentSchema.js';
import { TRADITION_ELEMENTS, TRADITION_ACTS } from '../../src/data/traditionCorpus.js';
import { CONTENT_BUCKETS, classifyField, isRegisteredBucket } from '../../src/domain/content/contentVocabulary.js';

describe('validateTradition — the write-time gate (validateDeity template)', () => {
  it('requires a name', () => {
    expect(validateTradition({}).ok).toBe(false);
    expect(validateTradition({ name: '   ' }).ok).toBe(false);
    expect(validateTradition({ name: 'The Long Watch' }).ok).toBe(true); // bare name is valid (claims a genesis slot)
  });
  it('accepts a valid motif and rejects an out-of-set one', () => {
    expect(validateTradition({ name: 'X', motifElement: 'harvest', motifAct: 'feast' }).ok).toBe(true);
    expect(validateTradition({ name: 'X', motifElement: 'volcano' }).ok).toBe(false);
    expect(validateTradition({ name: 'X', motifAct: 'rave' }).ok).toBe(false);
  });
  it('tolerates absent motif fields (optional, like the deity lawAxis)', () => {
    expect(validateTradition({ name: 'X', motifElement: null, motifAct: undefined }).ok).toBe(true);
  });
  it('caps the epithet and requires it be free text', () => {
    expect(validateTradition({ name: 'X', epithet: 'a custom older than the walls' }).ok).toBe(true);
    expect(validateTradition({ name: 'X', epithet: 42 }).ok).toBe(false);
    expect(validateTradition({ name: 'X', epithet: 'a'.repeat(TRADITION_EPITHET_MAX_LENGTH + 1) }).ok).toBe(false);
  });
});

describe('customContentSchema — tradition motif-key drift guard', () => {
  it('the eager frozen literals equal the (lazy) corpus ids', () => {
    expect([...TRADITION_ELEMENT_KEYS]).toEqual(TRADITION_ELEMENTS.map((e) => e.id));
    expect([...TRADITION_ACT_KEYS]).toEqual(TRADITION_ACTS.map((a) => a.id));
  });
});

describe('contentVocabulary — the AI schema wall admits traditions', () => {
  it('traditions is a registered content bucket', () => {
    expect(CONTENT_BUCKETS).toContain('traditions');
    expect(isRegisteredBucket('traditions')).toBe(true);
  });
  it('the motif fields are mechanical (bounded) and epithet is flavor', () => {
    expect(classifyField('motifElement', 'harvest').kind).toBe('mechanical');
    expect(classifyField('motifElement', 'volcano')).toEqual({ kind: 'unsupported', reason: 'invalid_value' });
    expect(classifyField('motifAct', 'feast').kind).toBe('mechanical');
    expect(classifyField('epithet', 'kept since the first stone was laid').kind).toBe('flavor');
  });
});
