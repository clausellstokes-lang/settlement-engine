/**
 * tests/config/tierFacts.contract.test.js — the drift ratchet for the tier
 * ENTITLEMENT FACTS the conversion surfaces render (findings components-commerce-1
 * & -3, -4).
 *
 * Two guarantees:
 *   1. DISPLAY ↔ ENFORCEMENT parity — every fact in src/config/tierFacts.js agrees
 *      with the authSlice TIER_GATE (the real gate `canExport()` / `maxSaves()` /
 *      … read) and with the pricing catalog + FOUNDER_SEAT_CAP. Display and
 *      enforcement can never split.
 *   2. NO RAW TIER-FACT LITERAL on the six conversion surfaces — a walker asserts
 *      the exact stale claims that drifted before ("10 saves", "unlimited drafts",
 *      "Thorp through Village", "every size", "500" seats) cannot creep back in,
 *      and that the fact-bearing surfaces read the module rather than restating a
 *      number. Same idiom as the emailTemplates ↔ send-email parity scan.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  TIER_FACTS, ANON_MAX_TIER, ANON_MAX_SIZE_LABEL,
  FREE_SAVE_LIMIT, FOUNDER_SEATS, SINGLE_DOSSIER_PRICE,
} from '../../src/config/tierFacts.js';
import { TIERS, SINGLE_DOSSIER } from '../../src/config/pricing.js';
import { TIER_GATE } from '../../src/store/authSlice.js';
import { FOUNDER_SEAT_CAP } from '../../src/lib/founderSeats.js';

const read = (rel) => readFileSync(resolve(process.cwd(), rel), 'utf-8');

describe('tierFacts ↔ TIER_GATE enforcement parity', () => {
  for (const tier of /** @type {const} */ (['anon', 'free', 'premium'])) {
    it(`${tier}: save cap, export mode, and custom-content gate match the enforcement gate`, () => {
      const facts = TIER_FACTS[tier];
      const gate = TIER_GATE[tier];
      // Save cap is the exact number the gate enforces.
      expect(facts.saveLimit).toBe(gate.maxSaves);
      // exportMode is the human name for gate.export: unlimited ⇔ true (free
      // export), per_dossier ⇔ false (the $2.99 single-dossier ladder).
      expect(facts.exportMode).toBe(gate.export ? 'unlimited' : 'per_dossier');
      // Custom content is premium-only; mirror the gate exactly.
      expect(facts.customContent).toBe(gate.customContent);
    });
  }

  it('the owner ruling is encoded: only premium exports freely; anon + free are per-dossier', () => {
    expect(TIER_FACTS.premium.exportMode).toBe('unlimited');
    expect(TIER_FACTS.free.exportMode).toBe('per_dossier');
    expect(TIER_FACTS.anon.exportMode).toBe('per_dossier');
    // …and that is exactly what the gate enforces.
    expect(TIER_GATE.free.export).toBe(false);
    expect(TIER_GATE.premium.export).toBe(true);
  });

  it('anon size ceiling matches the gate (Town, not Village)', () => {
    expect(ANON_MAX_TIER).toBe(TIER_GATE.anon.maxTier);
    expect(ANON_MAX_SIZE_LABEL).toBe('Town');
  });

  it('free save cap is 3 and sourced from the pricing catalog', () => {
    expect(FREE_SAVE_LIMIT).toBe(3);
    expect(FREE_SAVE_LIMIT).toBe(TIERS.wanderer.saveLimit);
  });

  it('founder seat count agrees across every source (catalog, RPC-clamp constant)', () => {
    expect(FOUNDER_SEATS).toBe(30);
    expect(FOUNDER_SEATS).toBe(TIERS.founder.seatLimit);
    expect(FOUNDER_SEATS).toBe(FOUNDER_SEAT_CAP);
  });

  it('single-dossier price label is the catalog value', () => {
    expect(SINGLE_DOSSIER_PRICE).toBe(SINGLE_DOSSIER.priceLabel);
    expect(SINGLE_DOSSIER_PRICE).toBe('$2.99');
  });
});

describe('no raw tier-fact literal on the conversion surfaces', () => {
  // The six surfaces the review found drifting. Each must not restate a stale
  // tier fact as a literal; the fact-bearing ones must read the module.
  const SURFACES = [
    'src/components/AuthModal.jsx',
    'src/components/HomeHero.jsx',
    'src/components/HowToUse.jsx',
    'src/components/account/AccountSubscriptionSection.jsx',
    'src/components/pricing/FounderTile.jsx',
    'src/components/GenerateWizard.jsx',
    // W-R2-TRUST (components-shell-commerce-3): the two post-purchase conversion
    // surfaces a buyer reads seconds after paying $2.99.
    'src/components/SingleDossierSuccessPage.jsx',
    // C4: the post-generate state-aware save-framing copy moved out of the
    // deleted WizardNextSteps card into its pure builder (nextSteps.js), which
    // PostGenCoach renders — so the stale-tier-fact guard follows the copy here.
    'src/components/generate/nextSteps.js',
  ];

  // The exact stale claims that drifted (findings -1/-3/-4). These are specific
  // enough not to false-positive on legitimate copy (e.g. premium's "Unlimited
  // saves" is fine; only the free-tier "save unlimited"/"unlimited drafts" phrasing
  // and the literal "500" seat count are forbidden).
  const FORBIDDEN = [
    { re: /\b10 saves\b/i,             why: 'free save cap is 3 — render TIER_FACTS.free.saveLimit' },
    { re: /save unlimited/i,           why: 'free is not unlimited saves — render the save cap fact' },
    { re: /unlimited drafts/i,         why: 'free is not unlimited drafts — render TIER_FACTS.free.saveLimit' },
    { re: /Thorp through Village/i,    why: 'anon reaches Town — render ANON_MAX_SIZE_LABEL' },
    { re: /every size,/i,              why: 'free already gets every size — do not sell it as a Cartographer unlock' },
    // Seat-context 500 only (avoids "500 years ago" / fontWeight:500 false hits).
    { re: /500\s*(seats|supporters)/i, why: 'the Founder cap is 30 — render FOUNDER_SEAT_CAP' },
    { re: /of 500\b/i,                 why: 'the Founder cap is 30 — render FOUNDER_SEAT_CAP' },
    { re: /first 500/i,                why: 'the Founder cap is 30 — render FOUNDER_SEAT_CAP' },
    { re: /500\s*-\s*seatsRemaining/,  why: 'the Founder cap is 30 — derive from FOUNDER_SEAT_CAP' },
    // W-R2-TRUST (components-shell-commerce-3): the post-purchase upsell claimed a
    // free account "unlocks full-screen edit" — but the SettlementDetail editor is
    // gated to premium/founder/elevated (canEdit); free gets inline name edits only.
    { re: /full-screen edit/i,         why: 'full-screen editing is a Cartographer capability — the free tier cannot; do not sell it as a free-account unlock' },
    // The free save count as a spelled-out literal — render TIER_FACTS.free.saveLimit
    // (FREE_SAVE_LIMIT) so it can never drift from the enforced cap.
    { re: /\bthree dossiers\b/i,        why: 'free save cap is a derived fact — render FREE_SAVE_LIMIT, not the word "three"' },
  ];

  for (const rel of SURFACES) {
    it(`${rel} restates no stale tier fact`, () => {
      const src = read(rel);
      const hits = FORBIDDEN.filter(f => f.re.test(src)).map(f => `${f.re} — ${f.why}`);
      expect(hits, hits.length ? `Stale tier-fact literal(s) in ${rel}:\n  ${hits.join('\n  ')}` : '').toEqual([]);
    });
  }

  it('the numeric-fact surfaces read the derived module (not a hardcoded number)', () => {
    // AuthModal dropped from this import check in the W5 re-apply: W5.1 removed its
    // dead in-modal account card (the ONLY tier-fact surface it carried — the card
    // was gated to anon-only, where auth.user is null, so it never rendered), so
    // AuthModal no longer imports tierFacts. It stays in the SURFACES stale-literal
    // scan above as defense-in-depth against future tier copy creeping back in.
    expect(read('src/components/HomeHero.jsx')).toMatch(/from ['"]\.\.\/config\/tierFacts\.js['"]/);
    expect(read('src/components/HowToUse.jsx')).toMatch(/from ['"]\.\.\/config\/tierFacts\.js['"]/);
    // FounderTile sources the seat count from the founderSeats constant.
    expect(read('src/components/pricing/FounderTile.jsx')).toMatch(/FOUNDER_SEAT_CAP/);
    // The post-purchase upsell now renders the free save cap from the module
    // (W-R2-TRUST components-shell-commerce-3) rather than the literal "three".
    expect(read('src/components/SingleDossierSuccessPage.jsx')).toMatch(/FREE_SAVE_LIMIT/);
  });
});
