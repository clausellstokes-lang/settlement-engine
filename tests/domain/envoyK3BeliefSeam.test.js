/**
 * envoyK3BeliefSeam.test.js — the K3 structural pin set (WR-7b, extended WR-7c).
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

/**
 * The negotiation set: every module a negotiation is let read through.
 *
 * WR-7c extends it by three, and the extension is the point of the amendment's
 * own list — "terms, VOTE, interceptor judgment, CLOSE-VOTE COMPARISON,
 * feasibility". The ratification vote and the compromise round are negotiation
 * paths as surely as the parlay is, so they are pinned the same way.
 *
 * `envoyTestimony.js` and `compromiseRound.js` are pinned to the EMPTY import
 * list: they consume closed bands their callers already read through belief
 * machinery, and there is no module they may reach for. `envoyTestimony`
 * deliberately re-declares the reliability ladder rather than importing
 * brokerageStamps (which reads institutions); a pin in
 * envoyTestimonyWr7c.test.js asserts the two spellings are equal, so refusing
 * the import costs no drift.
 *
 * REVIEWED ADDITION (WR-7c repair slice): `coalitionRatification.js` reaches
 * `envoyTestimony.js` for ONE thing — the closed court-desire vocabulary a
 * ballot and a seat must share, because two spellings of peace would break
 * unanimity (the finite-semantics law). The reach is K3-safe by construction
 * and the guard is the pin directly below it: `envoyTestimony` is pinned to
 * ZERO imports, so a module that reaches nothing cannot pass truth along. The
 * empty-list pin is therefore now load-bearing for two modules, not one.
 */
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
  'src/domain/worldPulse/coalitionRatification.js': [
    './envoyTestimony.js',
    './negotiationPictures.js',
  ],
  'src/domain/worldPulse/envoyTestimony.js': [],
  'src/domain/worldPulse/compromiseRound.js': [],
  // WR-7d. The ransom leaves are negotiation paths too: a price on a person is
  // a demand a court believes, and it must be believed on the same terms as
  // every other. `ransomClaim` reaches ONLY the shared transit kernel — the
  // same reach WR-7a's errand writer already has — and re-declares the I2 claim
  // kind rather than importing `warCoalitionExpenditure`, which reads truth.
  // `sendTwoDivergence` reaches the ladder leaf, which reaches nothing.
  'src/domain/worldPulse/ransomClaim.js': [
    './namedPersonTransit.js',
  ],
  'src/domain/worldPulse/ransomChoices.js': [],
  'src/domain/worldPulse/sendTwoDivergence.js': [
    './envoyTestimony.js',
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

  test('WR-7c: the vote reaches the terms math only through the two-picture wrapper', () => {
    const source = code('src/domain/worldPulse/coalitionRatification.js');
    expect(source.length, 'the ratification module read empty').toBeGreaterThan(1000);
    // The ballot is drawn under one member's own frozen picture, through the
    // same wrapper the parlay uses. A direct peaceTerms import here would be a
    // second terms evaluator — the design defect the seam ruling names.
    // The second entry is the reviewed vocabulary reach documented above; the
    // test below proves the module it reaches for reaches nothing itself.
    expect(importsOf(source)).toEqual(['./envoyTestimony.js', './negotiationPictures.js']);
    expect(source).not.toContain('peaceTerms'); // anchored: import list asserted above
    expect(source).not.toContain('worldState'); // anchored: import list asserted above
  });

  test('WR-7c: the two band-only leaves reach nothing at all', () => {
    for (const rel of [
      'src/domain/worldPulse/envoyTestimony.js',
      'src/domain/worldPulse/compromiseRound.js',
    ]) {
      const source = code(rel);
      expect(source.length, `${rel} read empty`).toBeGreaterThan(1000);
      // Zero imports is the strongest form of this pin: a module that reaches
      // nothing cannot reach truth, and adding the first import is a reviewed
      // event rather than a refactor detail.
      expect(importsOf(source), `${rel} import list`).toEqual([]);
      expect(source, `${rel} must not name worldState`).not.toContain('worldState'); // anchored: see above
    }
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
