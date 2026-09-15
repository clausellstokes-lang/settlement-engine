/**
 * tests/components/privacyPolicyParity.test.js — PRIVACY POLICY ↔ SHIPPED
 * REALITY parity (C3-experience findings 7 + 8, bar-16 honesty).
 *
 * The policy used to say "three settings" while PrivacySettings rendered FOUR
 * toggles — including a market-research licensing tier the policy never
 * disclosed — and promised "we will remove it" where the shipped mechanism is
 * anonymise-and-lock (054, soft-delete by design). Nothing failed when policy
 * and reality diverged. This binds the load-bearing claims:
 *
 *   • the policy's settings COUNT ⟷ the actual PrivacySettings toggle roster
 *   • the market/licensing tier is disclosed in the policy
 *   • the deletion promise matches 054's anonymise+lock soft-delete
 *   • the three-month lapsed-plan retention window ⟷ 024's interval '3 months'
 *
 * ── THE CANNOT-CATCH THAT CAUGHT US (LT38 car 3, 2026-09-15) ────────────────
 * This header used to name "consent BEHAVIOR changes (consent.js defaults)" as a
 * class this file could not catch, and then that exact class bit. ODQ §359.6 (the
 * person-adjacent split) flipped `research` from ON-by-default to OFF and shipped
 * at 547e4d58a; the in-app copy went on telling every new user their research
 * toggle was on by default, and NOTHING reddened — because the roster arm binds
 * the toggle IDS and the policy arms bind the POLICY, and no arm bound the
 * SETTINGS copy to the SHIPPED DEFAULT. The last describe below closes it, as a
 * BICONDITIONAL rather than a one-way ban: the copy must claim on-by-default when
 * the default IS on, and must not when it is not. A one-way ban would go green on
 * a future flip back to opt-OUT that left the copy saying "off by default", which
 * is the same defect wearing the other face.
 *
 * EVERY ABSENCE IN THAT DESCRIBE IS ANCHORED, and the anchors are assertions rather
 * than markers wherever one could be written: each arm asserts the ROW IS PRESENT in
 * the scanned source (or asserts the copy the row must carry) BEFORE it asserts what
 * the copy must not say. A bare absence over a source string is green when the file
 * drifts away entirely, which is the one failure this file cannot afford on a consent
 * surface. tests/lint/negativeAssertionAnchor.walker.test.js holds this file at its
 * frozen ceiling of two un-anchored negatives, both pre-existing, and the ceiling was
 * not raised to land this describe.
 *
 * STILL CANNOT-CATCH: semantic drift that keeps the bound tokens; policy claims
 * about Stripe/DNT/local storage. Residual: legal review (the page's own
 * under-review banner) owns final wording — and the PRIVACY POLICY's own
 * research sentence is OWNER + COUNSEL GATED, so the biconditional below is
 * deliberately scoped to PrivacySettings.jsx and does NOT bind PrivacyPage.jsx.
 * That gap is named, not hidden: see the LD-10 blockquote in
 * docs/FIRST_CONTACT_BACKLOG.md.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getConsent } from '../../src/lib/consent.js';

const read = (p) => readFileSync(resolve(process.cwd(), p), 'utf-8');
const policy = read('src/components/legal/PrivacyPage.jsx');
const settings = read('src/components/PrivacySettings.jsx');

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six'];

describe('privacy policy ↔ shipped consent model parity', () => {
  const toggleIds = [...settings.matchAll(/^\s*id="([a-z_]+)"/gm)].map((m) => m[1]);

  it('PrivacySettings renders the known toggle roster', () => {
    expect(toggleIds).toEqual(['essential', 'research', 'market', 'ai_prose']);
  });

  it('the policy states the settings COUNT that PrivacySettings actually renders', () => {
    const word = NUMBER_WORDS[toggleIds.length];
    expect(policy, `policy must say "${word} plain-language settings" — the real toggle count`)
      .toContain(`${word} plain-language settings`);
    // The stale count must not linger anywhere in the policy.
    for (const stale of NUMBER_WORDS.filter((w) => w !== word)) {
      expect(policy).not.toContain(`${stale} plain-language settings`);
    }
  });

  it('the market-research licensing tier is disclosed, with its opt-in default', () => {
    // The settings toggle says data "may be shared or licensed to the
    // worldbuilding market" — the policy must carry the same disclosure.
    expect(settings).toMatch(/shared or licensed to the\s+worldbuilding market/);
    expect(policy).toMatch(/market-research/);
    expect(policy).toMatch(/shared or\s+licensed/);
    expect(policy).toMatch(/off by\s+default/);
    expect(policy).toMatch(/We do not sell your\s+personal data/);
  });

  it('the deletion promise matches the shipped anonymise+lock soft-delete (054)', () => {
    const migration = read('supabase/migrations/054_account_deletion_processing.sql');
    expect(migration).toMatch(/anonymise/i);
    expect(migration).toMatch(/never a (hard|row) delete/i);
    expect(policy).toMatch(/anonymised and locked/);
    // The old overpromise ("contact us … and we will remove it") stays out.
    expect(policy).not.toMatch(/we\s+will remove it/);
  });

  it('the three-month lapsed-plan retention window is disclosed and matches 024', () => {
    const migration = read('supabase/migrations/024_billing_retention_and_atomic_mutations.sql');
    expect(migration).toMatch(/interval '3 months'/);
    expect(policy).toMatch(/three-month retention window/);
  });

  it('discloses operator-message records without claiming email-open tracking', () => {
    expect(policy).toMatch(/Operator communications/);
    expect(policy).toMatch(/consent-history record/);
    expect(policy).toMatch(/do not place tracking pixels in email/);
    expect(policy).toMatch(/Message bodies never enter analytics/);
    expect(policy).toMatch(/Deletion removes your direct\s+notices, message receipts, and consent history/);
  });
});

// ── THE DEFAULT ⟷ THE COPY (LT38 car 3, LD-10's real remainder) ─────────────
describe('the consent SETTINGS copy ⟷ the shipped default', () => {
  // The shipped default, read from the module that decides it rather than
  // restated here: no stored record and no DNT ⇒ defaults(). A restated constant
  // would be exactly the second truth this whole file exists to refuse.
  const shipped = getConsent();

  it('anti-vacuity: the research plane resolves to a real boolean', () => {
    // If getConsent() ever returned a partial, every arm below would pass on
    // undefined and the biconditional would be decoration.
    expect(typeof shipped.research).toBe('boolean');
    // And the settings source must actually carry the research row, or the
    // string scans are scanning nothing.
    expect(settings).toMatch(/id="research"/);
  });

  it('the research row cannot claim on-by-default while the shipped default is OFF', () => {
    // THE LIVENESS ANCHOR every absence below leans on, asserted FIRST and in this
    // same arm: the row must actually be in the scanned source. If PrivacySettings.jsx
    // were renamed, emptied or restructured, this reds here rather than letting the
    // absences below pass for the wrong reason.
    expect(settings, 'the research Row must be present in the scanned source')
      .toMatch(/id="research" title=/);
    const onClaims = [
      /Research is on by default/i,
      /It's on by default/i,
      /on by default \(opt-OUT\)/i,
    ];
    if (shipped.research === false) {
      for (const claim of onClaims) {
        expect(
          settings,
          `PrivacySettings.jsx still promises the v2 posture (${claim}) while consent.js `
          + 'defaults research to FALSE. ODQ §359.6 flipped the default; the copy must follow, '
          + 'or every new account is told it is contributing when it is not.',
        ).not.toMatch(claim); // anchored: the id="research" row probe at the top of this arm proves the source is live
      }
      // …and it must say the true thing, not merely omit the false one. An
      // omission would leave the row silent about a default a user is entitled to.
      expect(settings, 'the research row must state the opt-IN posture in words')
        .toMatch(/off by default|off unless you turn it on/i);
    } else {
      // THE OTHER DIRECTION, and it is why this is a biconditional: a future flip
      // back to opt-OUT that left "off by default" standing is the same defect.
      expect(settings, 'research defaults ON, so the copy must say so')
        .toMatch(/on by default/i);
      expect(settings, 'research defaults ON, so the copy must not claim it is off')
        .not.toMatch(/off by default|off unless you turn it on/i); // anchored: the on-by-default claim two lines up is this branch's live positive on the same subject
    }
  });

  it('the research row\'s TITLE does not assert a participation that is not happening', () => {
    // "You're helping improve the generator" is a statement of fact about the
    // reader. Under an opt-IN default it is false for every new account, and a
    // title is the one line a user cannot skip. An invitation is true in both states.
    if (shipped.research === false) {
      // The POSITIVE first, which is the stronger assertion of the pair: the row must
      // carry the invitation. Banning only the old title would go green on a row whose
      // title attribute had been deleted outright.
      expect(settings, 'the research row must carry the invitation title')
        .toMatch(/title="Help improve the generator"/);
      expect(settings, 'the research row title asserts participation while the plane ships OFF')
        .not.toMatch(/title="You're helping improve the generator"/); // anchored: the invitation-title assertion above proves the row and its title attribute are live
    }
  });

  it('the market plane\'s copy agrees with MARKET_INSIGHTS_DEFAULT the same way', () => {
    // The third plane already shipped opt-IN and already says so; binding it here
    // keeps the pair honest if either half ever moves. Same anchor discipline: the
    // row's presence is asserted before either branch reads its wording.
    expect(settings, 'the market Row must be present in the scanned source')
      .toMatch(/id="market" title=/);
    if (shipped.market === false) {
      expect(settings, 'market ships opt-IN, so the row must say so').toMatch(/Off by default/);
    } else {
      expect(settings, 'market defaults ON, so the row must say so').toMatch(/on by default/i);
      expect(settings, 'market defaults ON, so the copy must not claim it is off')
        .not.toMatch(/Off by default/); // anchored: the id="market" probe and the on-by-default assertion above are this branch's live positives
    }
  });
});
