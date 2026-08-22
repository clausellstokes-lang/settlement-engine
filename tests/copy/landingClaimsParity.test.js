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
 *
 * ⚠ WHY THERE ARE NOW TWO ARMS ON THE CEILING (§363.1, closing §320.3). Between
 * 2026-07-22 and this member, the sentence above was TRUE OF A STRING NOBODY COULD
 * READ: the Instant Draft widget's removal orphaned forge.ceiling, and the copy-side
 * arm went on passing on prose that reached no visitor. A claims-parity gate that
 * binds a claim to enforcement but never checks the claim is SHOWN is only half a
 * gate. So the ceiling now carries BOTH: the copy-side arm (the claim matches
 * tierFacts) and a RENDERED arm (the claim is in the HTML the page emits), each
 * failing for a different, real reason.
 */
import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { landing } from '../../src/copy/landing.js';
import { ANON_MAX_SIZE_LABEL } from '../../src/config/tierFacts.js';
import LandingBelowFold from '../../src/components/home/LandingBelowFold.jsx';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const has = (rel) => existsSync(join(ROOT, rel));

/**
 * The below-fold landing, rendered to static HTML. react-dom/server needs no DOM,
 * so this runs in THIS FILE'S default node env (the tests/design/organicSamples
 * idiom) — no jsdom, no environment split. Effects never run under SSR, so the
 * gallery fetch stays quiet; every string below is the FIRST, always-visible
 * paint an anonymous visitor gets.
 */
const belowFoldHtml = () => renderToStaticMarkup(
  createElement(LandingBelowFold, { isMobile: false, onNavigate: () => {} }),
);

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

  it('the anon size ceiling is actually RENDERED in §01 Forge, not merely stored (§363.1)', () => {
    // ⚠ THE VACUITY THIS ARM EXISTS TO CURE (§320.3): the arm above passed for a
    // month on a string NO VISITOR COULD SEE. The Instant Draft widget's removal
    // (owner order 2026-07-22) orphaned forge.ceiling — the key stayed in the copy
    // registry, its parity pin stayed green, and the disclosure left the page.
    // A copy-side assertion cannot see that. This one renders the real component
    // and reads the real output HTML.
    const html = belowFoldHtml();
    // POSITIVE CONTROL, FIRST — the rendered-surface-negative law: an arm that
    // never rendered proves nothing, and a "contains" assertion over an empty
    // string is green forever. These two §01 siblings ANCHOR the render: if the
    // section stops rendering, or the component throws, or the copy keys move,
    // the anchor reds before the disclosure assertion is ever reached.
    expect(html, 'ANCHOR: §01 Forge did not render — the arm below would be vacuous').toContain(landing.forge.h2);
    expect(html, 'ANCHOR: §01 Forge body did not render').toContain(landing.forge.body);
    // The disclosure itself, in the bytes an anonymous visitor receives.
    expect(html, 'the anon size ceiling is not rendered on the landing (§363.1 / §320.3)').toContain(landing.forge.ceiling);
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
