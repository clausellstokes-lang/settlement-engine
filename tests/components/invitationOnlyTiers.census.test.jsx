/** @vitest-environment jsdom */
/**
 * invitationOnlyTiers.census.test.jsx — AN INVITATION-ONLY TIER DOES NOT APPEAR ON THE
 * PUBLIC PATH.
 *
 * ── THE ORDER (the owner, 2026-09-19) ──────────────────────────────────────────
 * The owner attached the Create page at phone width: the at-cap teaser drew a "Founder
 * Lifetime / By invitation / Thirty chairs in the credits…" card at an ANONYMOUS visitor.
 * "an invitation-only tier does not appear on the public path." The order also names HOW:
 * filter it out of the teaser's tier list "the way PricingPage already filters Founder out
 * of its row (one shared predicate … not a hard-coded id)", and CENSUS every other surface
 * that lists tiers so the Founder appears on none of them. It may remain reachable only
 * where the owner invites.
 *
 * ── WHY A HARD-CODED ID WAS THE DEFECT, NOT JUST THE TASTE ─────────────────────
 * The pricing page had excluded the Founder since W-DOC — with `tier.key !== 'founder'`,
 * a fact about one spelling, written at one call site. The teaser, written later, walked
 * `getVisibleTiers()` whole and had no such line. Nothing could red, because nothing in
 * the estate knew that "the Founder is not an offer" was a rule rather than a habit. It
 * is now a property of the tier (`invitationOnly`) with one predicate over it, and this
 * census holds every listing surface to it.
 *
 * ⛔ THE REGISTER IS EXACT IN BOTH DIRECTIONS. A new module that reads the catalogue and
 * is not admitted here reds; an admitted module that stopped reading it reds as a stale
 * row. That is what makes "every other surface" a measurement instead of a claim.
 */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = process.cwd();

// Network leaves, stubbed as the sibling pricing suites stub them.
vi.mock('../../src/lib/stripe.js', () => ({ startCheckout: vi.fn(), startCustomerPortal: vi.fn() }));
vi.mock('../../src/lib/supabase.js', () => ({ isConfigured: false, supabase: null, withTimeout: (p) => p }));
vi.mock('../../src/lib/founderSeats.js', () => ({ FOUNDER_SEAT_CAP: 30, fetchFounderSeatsRemaining: vi.fn(async () => 17) }));

const storeState = {
  auth: { tier: 'anon', isFounder: false, displayName: '', loading: false },
  savedSettlements: [],
  lifetimeNarrateCount: 0,
  isElevated: () => false,
};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

// The viewport flag is a hook, so the two widths the order names are driven through it.
const H = vi.hoisted(() => ({ mobile: false }));
vi.mock('../../src/hooks/useIsMobile.js', () => ({
  default: () => H.mobile,
  getIsMobile: () => H.mobile,
}));

import AnonTierTeaser from '../../src/components/AnonTierTeaser.jsx';
import {
  TIERS, getPublicTiers, getVisibleTiers, isInvitationOnly,
} from '../../src/config/pricing.js';

/**
 * ⭐ THE REGISTER — every module under src/ that READS THE TIER CATALOGUE, and how each
 * one is allowed to. `public` means it must list only `getPublicTiers()`.
 */
const CATALOGUE_READERS = Object.freeze({
  'src/components/AnonTierTeaser.jsx': Object.freeze({
    surface: "the Create page's at-cap teaser — the surface the owner's finding was about",
    rule: 'public',
  }),
  'src/components/PricingPage.jsx': Object.freeze({
    surface: 'the pricing page: the card ROW lists the public tiers; the Founder renders '
      + 'below it as the charter band, a different KIND of object, and that handling is '
      + "left exactly as it was by the owner's order",
    rule: 'public-row',
  }),
});

function walkSource(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkSource(p, out);
    else if (/\.jsx?$/.test(entry) && !/\.test\./.test(entry)) out.push(p);
  }
  return out;
}

/**
 * The catalogue's OWN module is the definition site, not a reader: it declares both
 * enumerators and `getPublicTiers` necessarily calls `getVisibleTiers`. Excluded by PATH
 * rather than admitted by prose, because "the module that defines it" is a structural
 * fact and not a judgement anyone should have to re-make — the same treatment
 * tests/lint/refusalNoticeCoverage.walker.test.js gives the cap counter's own module.
 */
const CATALOGUE = 'src/config/pricing.js';

/**
 * Source with its comments stripped. Every arm below asks what a file DOES, and these
 * files legitimately NAME the retired call in prose to say what they replaced — a check
 * over raw text would red on its own explanation, which teaches people to delete the
 * history instead of the code.
 */
const codeOf = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^[^\n'"`]*\/\/.*$/gm, '');

const SOURCES = walkSource(join(ROOT, 'src'))
  .map((abs) => ({ rel: relative(ROOT, abs).replace(/\\/g, '/'), src: readFileSync(abs, 'utf8') }))
  .map((f) => ({ ...f, code: codeOf(f.src) }));

beforeEach(() => { H.mobile = false; window.localStorage.clear(); });
afterEach(() => { cleanup(); });

describe('THE PREDICATE — a property of the tier, not a spelling', () => {
  test('exactly one visible tier is invitation-only, and it is the Founder', () => {
    const visible = getVisibleTiers();
    expect(visible.length, 'the catalogue is empty').toBeGreaterThanOrEqual(3);
    expect(visible.filter(isInvitationOnly).map((t) => t.key)).toEqual(['founder']);
  });

  test('getPublicTiers is getVisibleTiers minus the invitation-only ones, in order', () => {
    expect(getPublicTiers().map((t) => t.key)).toEqual(['wanderer', 'cartographer']);
    // The relation, not the snapshot — so a fourth public tier does not need this edited.
    expect(getPublicTiers()).toEqual(getVisibleTiers().filter((t) => !isInvitationOnly(t)));
    // …and it really FILTERS: an identity function would satisfy the line above too.
    expect(getPublicTiers().length).toBe(getVisibleTiers().length - 1);
  });

  test('the predicate answers no on everything that is not flagged (executed controls)', () => {
    expect(isInvitationOnly(TIERS.wanderer)).toBe(false);
    expect(isInvitationOnly(TIERS.cartographer)).toBe(false);
    expect(isInvitationOnly(TIERS.founder)).toBe(true);
    // Shapes from outside the catalogue must not throw or answer yes by accident.
    expect(isInvitationOnly(null)).toBe(false);
    expect(isInvitationOnly(undefined)).toBe(false);
    expect(isInvitationOnly({})).toBe(false);
    expect(isInvitationOnly({ key: 'founder' }), 'the NAME must not be what decides').toBe(false);
    expect(isInvitationOnly({ invitationOnly: true })).toBe(true);
  });
});

describe('THE CENSUS — every surface that lists tiers', () => {
  test('the walk is live', () => {
    expect(SOURCES.length, 'the src tree is empty — has it moved?').toBeGreaterThanOrEqual(2200);
  });

  test('the register is EXACT: no unadmitted reader, no stale row', () => {
    // A module "lists tiers" when it reads the catalogue's enumerators. TIERS.<key> on
    // its own is a single-tier read (a price, a seat cap) and is not a listing.
    const readers = SOURCES
      .filter(({ rel, code }) => rel !== CATALOGUE && /\bget(Visible|Public)Tiers\s*\(/.test(code))
      .map((f) => f.rel)
      .sort();
    expect(
      readers,
      '\nA module lists the tier catalogue and this census does not know about it.\n'
      + "An invitation-only tier does not appear on the public path (the owner, 2026-09-19), so a new "
      + 'listing surface must read getPublicTiers() and be admitted here with the surface it draws.\n',
    ).toEqual(Object.keys(CATALOGUE_READERS).sort());
  });

  test('every admitted reader really filters, and the way its row says', () => {
    for (const [rel, row] of Object.entries(CATALOGUE_READERS)) {
      const found = SOURCES.find((f) => f.rel === rel);
      expect(found, `${rel} is gone — delete or re-point its row`).toBeTruthy();
      const { code } = found;
      // Anti-vacuity for the stripper: an emptied file would satisfy every negative below.
      expect(code.length, `the comment stripper ate ${rel}`).toBeGreaterThan(200);
      if (row.rule === 'public') {
        expect(code, `${rel} lists the catalogue WHOLE — it must read getPublicTiers()`)
          .toMatch(/getPublicTiers\s*\(/);
        expect(/getVisibleTiers\s*\(/.test(code), `${rel} still reaches for the whole catalogue`).toBe(false);
      } else {
        // The pricing page keeps `getVisibleTiers()` (the charter band needs the Founder)
        // and filters its ROW through the shared predicate — never by a hard-coded id.
        expect(code, `${rel} no longer filters its row by the shared predicate`)
          .toMatch(/isInvitationOnly\s*\(/);
      }
      // ⛔ NOBODY FILTERS BY THE NAME ANY MORE. That line is the defect's other half:
      // it worked on one surface and was forgotten on the other.
      expect(
        /key\s*!==\s*['"]founder['"]/.test(code),
        `${rel} filters the tier list by the literal id 'founder' — use isInvitationOnly()`,
      ).toBe(false);
    }
  });
});

describe('THE TEASER — the surface the owner walked', () => {
  /** Render the at-cap teaser and return its text nodes. */
  const teaserText = () => {
    const { container } = render(<AnonTierTeaser onSignIn={() => {}} />);
    return container.textContent;
  };

  for (const [label, mobile] of [['1440 (desktop)', false], ['375 (phone)', true]]) {
    test(`at ${label}: the public tiers are drawn and the Founder is not`, () => {
      H.mobile = mobile;
      const text = teaserText();
      // ⛔ ANTI-VACUITY, AND IT IS THE ANCHOR THE ORDER ASKED FOR: the other tier cards
      // must be PRESENT on this same render, so "no Founder" cannot pass because the
      // teaser drew nothing at all.
      for (const tier of getPublicTiers()) {
        const name = tier.key === 'wanderer' ? 'Wanderer' : 'Cartographer';
        expect(text, `the teaser lost its ${name} card`).toContain(name);
      }
      const names = [...getPublicTiers().map((t) => (t.key === 'wanderer' ? 'Wanderer' : 'Cartographer')), ...(/Founder/.test(text) ? ['Founder'] : [])];
      expectAbsentWithAnchor(names, 'Founder', 'Cartographer', `the at-cap teaser at ${label}`);
      // …and none of the Founder card's own copy survives by another route.
      for (const phrase of ['By invitation', 'A founding place', 'chairs in the credits', 'Request a chair']) {
        // anchored: the teaser rendered — expectAbsentWithAnchor above proved Cartographer present in its names.
        expect(text, `the teaser still carries Founder copy: ${phrase}`).not.toContain(phrase);
      }
    });
  }

  test('the teaser draws exactly one card per public tier', () => {
    const { container } = render(<AnonTierTeaser onSignIn={() => {}} />);
    expect(container.querySelectorAll('article')).toHaveLength(getPublicTiers().length);
  });

  test('a capped visitor is still offered a door (the cards did not simply vanish)', () => {
    render(<AnonTierTeaser onSignIn={() => {}} />);
    expect(screen.getAllByRole('button').length, 'the teaser offers no action at all').toBeGreaterThanOrEqual(2);
  });
});
