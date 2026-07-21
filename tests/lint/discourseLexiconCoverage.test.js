/**
 * discourseLexiconCoverage.test.js — TRANCHE 3c ENFORCER (d): THE LEXICON TOTALITY
 * WALKER.
 *
 * The discourse kernel types every cause-walk hop's relation from its recorded
 * `type` (dramaClass || kind) and selects a connective from a finite lexicon. This
 * walker proves the lexicon is TOTAL over the LIVE vocabulary: every drama class in
 * chronicleGraph.DRAMA_CLASSES, every node kind, and every structural fallback has
 * a relation mapping, and every relation family / causal band has a non-empty
 * connective pool (or the explicit default). A NEW drama class with no mapping REDS
 * here (deposit-and-consume) — the impactKind walker law, made a coverage gate.
 *
 * E-A: this file is on the enforcement spine; its planted regression lives in
 * scripts/mutation-sweep.sh ("discourse/lexicon relation-type coverage gap") and
 * is claimed in scripts/mutation-coverage-manifest.json.
 */
import { describe, it, expect } from 'vitest';
import { DRAMA_CLASSES } from '../../src/domain/display/chronicleGraph.js';
import {
  KNOWN_RELATION_TYPES, RELATION_FOR_TYPE, CONNECTIVE_LEXICON, DEFAULT_CONNECTIVE, ALL_CONNECTIVES,
} from '../../src/domain/display/discourseKernel.js';

// The node kinds nodesFromRecord mints when a node has no drama class, and the
// structural fallbacks causeWalk.resolveReceipt mints (a redacted covert hop and a
// ledger-only parent). LITERAL, mirrored here so a drift in either source reds.
const NODE_KINDS = ['outcome', 'impact'];
const STRUCTURAL_FALLBACKS = ['hidden', 'event'];

describe('3c (d) lexicon totality — the live vocabulary is fully covered', () => {
  it('guard-the-guard: the vocabulary and lexicon are not vacuous', () => {
    expect(DRAMA_CLASSES.length).toBeGreaterThanOrEqual(8);
    expect(KNOWN_RELATION_TYPES.length).toBeGreaterThanOrEqual(DRAMA_CLASSES.length + NODE_KINDS.length + STRUCTURAL_FALLBACKS.length);
    expect(ALL_CONNECTIVES.size).toBeGreaterThanOrEqual(6);
  });

  it('KNOWN_RELATION_TYPES covers every live drama class (a new class REDS)', () => {
    const known = new Set(KNOWN_RELATION_TYPES);
    const missing = DRAMA_CLASSES.filter((c) => !known.has(c));
    expect(missing, `drama classes with no discourse relation type — add to KNOWN_RELATION_TYPES + RELATION_FOR_TYPE:\n${missing.join('\n')}`).toEqual([]);
  });

  it('KNOWN_RELATION_TYPES covers every node kind and structural fallback', () => {
    const known = new Set(KNOWN_RELATION_TYPES);
    for (const t of [...NODE_KINDS, ...STRUCTURAL_FALLBACKS]) {
      expect(known.has(t), `missing relation type "${t}"`).toBe(true);
    }
  });

  it('RELATION_FOR_TYPE is total over KNOWN_RELATION_TYPES, each a real family', () => {
    const gaps = KNOWN_RELATION_TYPES.filter((t) => !RELATION_FOR_TYPE[t]);
    expect(gaps, `relation types with no family — every entry needs one (deposit-and-consume):\n${gaps.join('\n')}`).toEqual([]);
    for (const t of KNOWN_RELATION_TYPES) {
      expect(['causal', 'adversative']).toContain(RELATION_FOR_TYPE[t]);
    }
  });

  it('no stale relation entry: every RELATION_FOR_TYPE key is a known type', () => {
    const known = new Set(KNOWN_RELATION_TYPES);
    const stale = Object.keys(RELATION_FOR_TYPE).filter((t) => !known.has(t));
    expect(stale, `RELATION_FOR_TYPE entries for unknown types — remove them:\n${stale.join('\n')}`).toEqual([]);
  });

  it('every relation family and causal band has a non-empty connective pool', () => {
    for (const band of ['deep', 'near', 'pivot']) {
      const pool = CONNECTIVE_LEXICON.causal[band];
      expect(Array.isArray(pool) && pool.length >= 1, `causal.${band} pool is empty`).toBe(true);
    }
    // parallel, adversative, and the anticipatory register (prediction-elision rule 2).
    for (const family of ['parallel', 'adversative', 'anticipatory']) {
      const pool = CONNECTIVE_LEXICON[family];
      expect(Array.isArray(pool) && pool.length >= 1, `${family} pool is empty`).toBe(true);
    }
    expect(typeof DEFAULT_CONNECTIVE === 'string' && DEFAULT_CONNECTIVE.length > 0).toBe(true);
  });

  it('every adversative type actually maps to the adversative family', () => {
    // The abundance/reinterpretation classes read against the grain of their causes.
    for (const t of ['boom_flourishing', 'reframe']) {
      expect(RELATION_FOR_TYPE[t]).toBe('adversative');
    }
  });
});
