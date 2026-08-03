/**
 * envoyK3BeliefSeam.test.js — WR-7b's K3 structural pin set.
 *
 * Amendment K3 (NOBODY IS EVER CURRENT) says no negotiation path — terms, vote,
 * interceptor judgment, close-vote comparison, feasibility — may read true world
 * state; every read routes through belief machinery. The architecture volume
 * (§1b, §3 THE SEAM MECHANICS) requires that as STRUCTURAL ENFORCEMENT rather
 * than convention, in the P4 no-hidden-governor idiom:
 *
 *   IMPORT LISTS      each negotiation module's reachable set is a closed,
 *                     reviewed list, so a truth hop cannot appear by refactor.
 *   TOKEN SCAN        no true-state read token appears in the negotiation set.
 *   THE PURE SEAM     negotiationPictures reaches peaceTerms ONLY through
 *                     input-shaped leaves — never through a worldState reader —
 *                     which is what keeps the LIT path belief-sourced while
 *                     peaceTerms itself stays the single terms writer.
 *   GUARD-THE-GUARD   the same scan FINDS those tokens in a module that
 *                     legitimately reads truth, so a scan that silently stopped
 *                     matching cannot pass as compliance.
 *
 * peaceTerms.js sits OUTSIDE the pin set by ruling: its dark-path transport
 * legitimately builds truth internally, and it may never sit on both sides of
 * its own guard — so warDeployment.js is the positive control.
 *
 * @enforced-by this file
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * Source with every comment stripped. A source-scan claim about what a module
 * CANNOT reach must read the code, never the prose: these modules' own headers
 * describe the truth they refuse to import, and a raw scan would count that
 * refusal as the offence.
 */
const code = (rel) => readFileSync(join(ROOT, rel), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');

const importsOf = (source) => [...source.matchAll(/from '([^']+)'/g)].map((m) => m[1]).sort();

/**
 * The spellings by which real settlement state enters a scorer in this engine.
 * Each is present in the positive control below, so the list cannot rot into a
 * set of strings that no longer matches anything.
 */
const TRUE_STATE_TOKENS = Object.freeze([
  'militaryStrength',
  'deriveMilitaryCapacity',
  'deriveSettlementPressures',
  'pressureModel',
  'economicState',
  'foodSecurity',
]);

/** The negotiation set: every module WR-7b lets a negotiation read through. */
const NEGOTIATION_MODULES = Object.freeze({
  'src/domain/worldPulse/envoyErrand.js': [
    './namedPersonTransit.js',
    './negotiationPictures.js',
  ],
  'src/domain/worldPulse/negotiationPictures.js': [
    './peaceTerms.js',
  ],
  'src/domain/worldPulse/envoyEncounter.js': [
    './warCoalitionLedger.js',
  ],
  'src/domain/worldPulse/foreignGuestHold.js': [
    '../spatial/distanceRead.js',
  ],
});

const TRUTH_READER = 'src/domain/worldPulse/warDeployment.js';

describe('WR-7b K3 — nobody is ever current', () => {
  test('every negotiation module reaches only its reviewed closed import set', () => {
    for (const [rel, expected] of Object.entries(NEGOTIATION_MODULES)) {
      const source = code(rel);
      expect(source.length, `${rel} read empty`).toBeGreaterThan(1000);
      // A new import here is a reviewed event, not a refactor detail: it is the
      // one edit that could put true state within reach of a negotiation.
      expect(importsOf(source), `${rel} import list`).toEqual([...expected].sort());
    }
  });

  test('no true-state read token appears anywhere in the negotiation set', () => {
    for (const rel of Object.keys(NEGOTIATION_MODULES)) {
      const source = code(rel);
      // anchored: the file is asserted non-empty above and again here, so these
      // absences are real rather than an empty read passing as compliance.
      expect(source.length, `${rel} read empty`).toBeGreaterThan(1000);
      for (const token of TRUE_STATE_TOKENS) {
        // The file is asserted non-empty immediately above, and guard-the-guard
        // below proves this exact token list still matches a module that DOES
        // read truth — so an absence here is neither an empty read nor a rotted
        // string.
        expect(source, `${rel} must not reach ${token}`).not.toContain(token); // anchored: see above
      }
    }
  });

  test('the two-picture wrapper reaches peaceTerms only through input-shaped leaves', () => {
    const source = code('src/domain/worldPulse/negotiationPictures.js');
    const imported = [...source.matchAll(/import\s*\{([\s\S]*?)\}\s*from\s*'\.\/peaceTerms\.js'/g)]
      .flatMap((match) => match[1].split(','))
      .map((name) => name.trim())
      .filter(Boolean)
      .sort();
    // Each of these takes already-banded inputs, never a worldState. Importing a
    // world-reading export instead (advanceTreaties and its kin) is exactly how
    // truth would re-enter the lit path.
    expect(imported).toEqual([
      'alignmentPressFromInput',
      'appraiseLoserPortfolioFromInputs',
      'believedAdvantageFromInputs',
      'carriedClauseFromDraft',
      'draftTerms',
      'normalizeCarriedTermSheet',
      'termBudgetFor',
    ]);
    // The exact imported-symbol list is asserted above, so this file demonstrably
    // reads peaceTerms: the two absences below are a live selection within a
    // proven-present import, not a collection that drifted away.
    expect(source).not.toContain('advanceTreaties'); // anchored: import list asserted above
    expect(source).not.toContain('worldState'); // anchored: import list asserted above
  });

  test('GUARD-THE-GUARD: the same scan finds those tokens where truth is read', () => {
    const source = code(TRUTH_READER);
    expect(source.length, 'the positive control read empty').toBeGreaterThan(1000);
    // If this stops matching, the token list has rotted and the absences above
    // are proving nothing — the guard fails loudly instead of silently passing.
    for (const token of TRUE_STATE_TOKENS) {
      expect(source, `${TRUTH_READER} should read ${token}`).toContain(token);
    }
  });
});
