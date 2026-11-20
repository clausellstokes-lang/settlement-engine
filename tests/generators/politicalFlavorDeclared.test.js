/**
 * tests/generators/politicalFlavorDeclared.test.js — CENSUS-1f unit 3: the historical-character
 * cascade (`narrative/historyCoherence.js :: buildStressProfile`, Appendix B row 36) resolves its
 * drawn POLITICAL_FLAVOR template through `drawDeclared`. `stable` is `{crisis-scoped}` (CENSUS-2e):
 * under a crisis only its `crisis: any` rows may print.
 *
 * @enforced-by npx vitest run tests/generators/politicalFlavorDeclared.test.js
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { clearActiveRng, setActiveRng } from '../../src/kernel/rngContext.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { buildStressProfile } from '../../src/generators/narrative/historyCoherence.js';
import { POLITICAL_FLAVOR } from '../../src/generators/narrativeText.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { collapseArticleSeams } from '../../src/generators/narrativeProse.js';

const UNDER_SIEGE = factsOf({ institutions: [], config: {}, stress: [{ type: 'under_siege' }] });
const CALM = factsOf({ institutions: [], config: {}, stress: [] });
/** One political event: the cascade lands on `stable` (political < 2, nothing else qualifies). */
const EVENTS = [{ type: 'political', name: 'The Quiet Charter', severity: 'minor' }];
const render = (/** @type {any} */ row) => collapseArticleSeams((typeof row === 'object' ? row.text : row)(EVENTS));
// RE-KEYED BY IDENTITY 2026-11-18 (BAR8-SCENES-3, the chair's message under BR25 (4)): the anchor was `crisis: any` alone; BAR8-SCENES
// (BR23 (2), K's 12c) gave the stable pool a twin for the five hard crises, which declares them BY NAME (R6: never `crisis: any`),
// and under the siege it prints. The same claim: a row is crisis-safe for the test's crisis (the siege) where its declaration
// ADMITS that crisis (`any`, or `under_siege` named, and not excluded), with no other need
const SIEGE = 'under_siege';
const CRISIS_SAFE = new Set(POLITICAL_FLAVOR.stable.filter((r) => typeof r === 'object' && ((r.crisis || []).includes('any') || (r.crisis || []).includes(SIEGE))
  && !(r.excludes || []).includes(`crisis: ${SIEGE}`) && !(r.needs || []).length).map(render));
const ALL_STABLE = new Set(POLITICAL_FLAVOR.stable.map(render));

describe('the POLITICAL_FLAVOR cascade resolves through drawDeclared (CENSUS-1f unit 3)', () => {
  beforeEach(() => { setActiveRng(createPRNG('political-flavor-declared')); });
  afterEach(() => { clearActiveRng(); });

  it('under a crisis, a stable character is one of the crisis-safe rows', () => {
    expect(CRISIS_SAFE.size).toBeGreaterThan(0);
    for (let n = 0; n < 60; n++) {
      const out = buildStressProfile(EVENTS, 'town', {}, UNDER_SIEGE);
      if (ALL_STABLE.has(out)) expect(CRISIS_SAFE.has(out), out).toBe(true);
    }
  });

  it('in a calm place every stable row can still print (the draw is unchanged)', () => {
    const seen = new Set();
    for (let n = 0; n < 400; n++) seen.add(buildStressProfile(EVENTS, 'town', {}, CALM));
    expect([...seen].some((t) => ALL_STABLE.has(t) && !CRISIS_SAFE.has(t))).toBe(true);
  });
});
