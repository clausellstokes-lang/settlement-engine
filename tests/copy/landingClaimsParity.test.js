/**
 * landingClaimsParity.test.js — SS4: bar-13 claims parity for the PRIMARY
 * marketing surface (src/copy/landing.js).
 *
 * pricingPage and the /covenant page both carry parity gates; the landing —
 * the copy every visitor reads first — had only a render pin
 * (tests/ui/homeLanding.test.jsx), so its capability claims were bound to
 * nothing. This gate binds each checkable landing claim to the config value or
 * enforcer that makes it true, in BOTH directions:
 *   • if the enforcement/config changes, the stale copy reddens here;
 *   • if the copy is reworded away from the claim, the pin reddens so the
 *     binding is consciously revisited (the covenant idiom).
 *
 * Adjudication note (2026-07-20): the review claim that "Up to three forges a
 * day" OVERSTATES enforcement was REFUTED against the code — the single
 * enforcement point (settlementSlice.generateSettlement → anonAtCap()) gates on
 * the COMBINED daily cap (DEFAULT_DAILY_FULL_CAP 1 + DEFAULT_DAILY_REROLL_CAP 2
 * = 3 generations/day), so "three forges a day" matched what an anon actually got.
 *
 * Walk W1 (owner order 2026-07-21): the ANONYMOUS tier card was REMOVED from the
 * set-out strip, so the "three forges a day" claim no longer lives on the landing —
 * its binding is retired below. The anon SIZE ceiling still appears in §01 Forge
 * (forge.ceiling) and stays bound; the hero's "free, no account" line is unbound copy.
 */
import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { landing } from '../../src/copy/landing.js';
import { ANON_MAX_SIZE_LABEL } from '../../src/config/tierFacts.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const has = (rel) => existsSync(join(ROOT, rel));

const tierByName = (name) => landing.closer.tiers.find((t) => t.name === name);

describe('landing copy — claims-vs-enforcement parity (bar 13)', () => {
  it('the ANONYMOUS tier card stays removed from the set-out strip (W1 demotion)', () => {
    // The Anonymous card was removed (owner order 2026-07-21). If it is re-added,
    // its daily-cap + {anonSize} claims must be re-bound to enforcement here.
    expect(tierByName('Anonymous')).toBeUndefined();
  });

  it('the anon size ceiling in §01 Forge matches tierFacts (the enforced gate label)', () => {
    // forge.ceiling hand-writes the anon max size; TIER_GATE.anon.maxTier is the
    // enforcement, tierFacts.ANON_MAX_SIZE_LABEL its pinned display label.
    expect(landing.forge.ceiling).toContain(`up to a ${ANON_MAX_SIZE_LABEL}`);
  });

  it('the tier numeric facts stay CONFIG-INTERPOLATED, never hand-typed', () => {
    // TierStrip interpolates these from config/tierFacts.js. If someone inlines
    // a literal number, the placeholder disappears and this reddens. (The Anonymous
    // {anonSize} binding was retired with the Anonymous card in W1; only Wanderer's
    // {freeSaves} remains on the strip.)
    expect(tierByName('Wanderer').body).toContain('{freeSaves}');
  });

  it("'wars that end themselves' is backed by the live war-resolution layer", () => {
    expect(tierByName('Cartographer').body).toMatch(/wars that end themselves/);
    expect(has('src/domain/worldPulse/warDeployment.js'), 'war layer module missing').toBe(true);
    expect(has('tests/domain/warResolveLeadership.test.js'), 'war-resolution suite missing — the landing claim is no longer proven').toBe(true);
  });

  it("'It never invents facts' is backed by the grounding layer + its suites", () => {
    expect(landing.voice.body).toMatch(/never invents facts/);
    expect(landing.voice.aiNote).toMatch(/only the deterministic engine writes canon/);
    expect(has('src/domain/aiGrounding.js'), 'grounding module missing').toBe(true);
    expect(has('tests/domain/aiGrounding.test.js'), 'grounding suite missing — the landing claim is no longer proven').toBe(true);
    expect(has('tests/edgeFunctions/aiGroundingContract.test.js'), 'edge grounding contract missing').toBe(true);
  });

  it("'Same seed, same town. Every time.' is backed by the golden master", () => {
    expect(landing.brief.deterministic).toBe('Same seed, same town. Every time.');
    expect(has('tests/property/generatorGoldenMaster.test.js'), 'golden-master suite missing — the determinism claim is no longer proven').toBe(true);
    expect(has('tests/fixtures/generator-golden-master.json'), 'golden-master fixture missing').toBe(true);
  });
});
