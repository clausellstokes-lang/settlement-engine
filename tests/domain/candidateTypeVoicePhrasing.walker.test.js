/**
 * candidateTypeVoicePhrasing.walker.test.js — the candidateType → impactKind
 * coverage walker (C1 engine-cohesion, finding bar2 "no walker binds every
 * candidateType to an effect pathway").
 *
 * THE DYNAMIC PATH impactKindWalkers DISCLAIMS. applyWorldPulse.newsEntryForOutcome
 * stamps `impactKind: outcome.candidateType || outcome.type` — so every minted
 * candidateType is PROMOTED to an impactKind on its wizard-news entry. But
 * impactKindWalkers.test.js scans only LITERAL `impactKind: '<lit>'` write sites;
 * it explicitly leaves this dynamic candidateType→impactKind path uncovered (its
 * own note: "those tokens are candidateTypes already phrased in WHAT_PHRASES").
 * That claim is UNENFORCED — nothing failed when candidateTypes drifted out of
 * WHAT_PHRASES, and nothing stops a future candidateType from colliding with a
 * crier-voice classifier. This walker makes the two reader-facing invariants
 * structural, closing the survey's "a force citing no law" gap at the two display
 * chokepoints a promoted candidateType reaches:
 *
 *   1. PHRASING — whatPhrase() (settlementRumors.js) turns an impactKind into the
 *      subject phrase a rumor headline speaks. Every minted candidateType must
 *      resolve to a NON-EMPTY, UNDERSCORE-FREE phrase (never a raw slug like
 *      "settlement_terminal_death" in prose). Today the graceful prefix-strip
 *      fallback guarantees this; the walker LOCKS it so a fallback regression or a
 *      new slug-shaped candidateType reds loudly.
 *
 *   2. VOICE — newsVoiceCategory() (newsVoice.js) routes an impactKind to a
 *      town-crier VoiceCategory. A candidateType is an event-SHAPE label, not a
 *      semantic impact-nature token, so it must route to NO voice (null) via the
 *      set-but-unclassified guard — otherwise a new candidateType that happens to
 *      equal/collide with a classifier ('calamity', 'boom', …) would borrow that
 *      crier's line beneath a headline it does not fit. A candidateType that
 *      genuinely deserves a crier is registered as a SEMANTIC impactKind (the
 *      literal-mint path impactKindWalkers governs), not routed by its shape
 *      label; the VOICED_CANDIDATE_TYPES allowlist (empty today) is the conscious
 *      escape hatch, and a collision reds until it is filled or the mint renamed.
 *
 * The manifest-walker idiom (structural prevention §2): discovery is automatic
 * (the source scan), the invariants are enforced against the REAL display
 * functions, and a new mint that breaks either reds the gate. Pure reads of pure
 * functions — no engine state, no rng, no clock, byte-inert to first paint and to
 * every golden.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { whatPhrase } from '../../src/domain/display/settlementRumors.js';
import { newsVoiceCategory } from '../../src/domain/display/newsVoice.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const WORLD_PULSE = join(ROOT, 'src', 'domain', 'worldPulse');

/** @param {string} dir @param {string[]} out */
function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.js$/.test(e) && !/\.test\./.test(e)) out.push(p);
  }
  return out;
}

// Every `candidateType: '<literal>'` a world-pulse kernel mints. (Dynamic
// `candidateType: <var>` assignments are out of this literal scan's reach, exactly
// as impactKindWalkers scans literal impactKind mints — same idiom, sibling path.)
const MINT_RE = /candidateType:\s*['"]([a-z][a-z0-9_]*)['"]/g;

function mintedCandidateTypes() {
  const kinds = new Set();
  for (const abs of walk(WORLD_PULSE)) {
    const src = readFileSync(abs, 'utf8');
    for (const m of src.matchAll(MINT_RE)) kinds.add(m[1]);
  }
  return [...kinds].sort();
}

// Candidate types that DELIBERATELY carry a town-crier voice (routed through
// newsVoiceCategory to a real VoiceCategory rather than null). EMPTY today: no
// candidateType is a semantic impact-nature token, so none should voice. A future
// wave that wants a promoted candidateType voiced adds it here (a conscious,
// vetoable decision) — this is the manifest half of the walker.
/** @type {Record<string, string>} */
const VOICED_CANDIDATE_TYPES = {};

describe('candidateType → impactKind coverage walker (C1 bar2)', () => {
  const minted = mintedCandidateTypes();

  test('the mint scan is non-vacuous', () => {
    // A silent regex/rename that empties the scan must not turn the walker green.
    expect(minted.length).toBeGreaterThan(30);
  });

  test('every minted candidateType phrases to readable words, never a raw slug', () => {
    const leaks = [];
    for (const ct of minted) {
      const phrase = whatPhrase(ct);
      // A raw slug is an empty string or one still carrying an underscore — the
      // exact "de-underscored enum reaches a headline" defect. To comply: author a
      // WHAT_PHRASES entry, or confirm the prefix-strip fallback yields real words.
      if (!phrase || /_/.test(phrase)) leaks.push(`${ct} -> "${phrase}"`);
    }
    expect(leaks).toEqual([]);
  });

  test('every minted candidateType routes to NO crier voice (set-but-unclassified guard holds)', () => {
    const misrouted = [];
    for (const ct of minted) {
      const got = newsVoiceCategory({ impactKind: ct });
      const expected = VOICED_CANDIDATE_TYPES[ct] ?? null;
      if (got !== expected) misrouted.push(`${ct}: expected ${expected}, got ${got}`);
    }
    // A non-null hit means a candidateType collided with a voice classifier and
    // would borrow that crier's line. To comply: rename the mint, or (if the crier
    // line genuinely fits) add it to VOICED_CANDIDATE_TYPES.
    expect(misrouted).toEqual([]);
  });

  // Positive controls: the invariants mean something only if they catch a seeded
  // break (a green negative result needs a proven detector).
  describe('the invariants discriminate (positive controls)', () => {
    test('whatPhrase check would catch a slug-shaped token that strips to nothing readable', () => {
      // An unknown token whose whole body is a stripped prefix collapses to
      // 'unrest' (still readable); a genuinely underscore-bearing residue would
      // fail. Prove the detector fires on a raw underscore-bearing string.
      expect(/_/.test('plague_mutation')).toBe(true);
      expect(whatPhrase('plague_mutation')).not.toMatch(/_/); // fallback de-underscores
    });
    test('voice check would catch a candidateType that collides with a classifier', () => {
      // If some future kernel minted candidateType:'calamity', the promotion would
      // route it to the calamity crier — the exact mis-route this test guards.
      expect(newsVoiceCategory({ impactKind: 'calamity' })).toBe('calamity');
      expect(newsVoiceCategory({ impactKind: 'boom' })).toBe('prosperity');
    });
  });
});
