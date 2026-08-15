/**
 * @vitest-environment jsdom
 *
 * tests/ui/pricingPageBands.test.jsx — W-DOC: THE PRICING DRIFT CONTRACT
 * (brief §3/§6 — the wave's headline law: every rendered number derives from
 * config; a diverging constant FAILS here, not in a screenshot review).
 *
 * Contracts pinned:
 *   1. TASK-MENU WALKER: every task in SURVEYOR_AI_COSTS + the active narrative
 *      schedule renders, with its EXACT config credit cost and the anchor-rate
 *      ≈$ figure (completeness + value agreement).
 *   2. THE ANCHOR: the conversion sentence carries the starter pack's exact
 *      per-credit label from config.
 *   3. THE CHARTER ARITHMETIC: the months figure on the page equals
 *      ceil(founder / cartographer) from config; the seat cap renders.
 *   4. THE BUNDLE: band 3's lead carries SINGLE_DOSSIER.priceLabel.
 *   5. LADDER WALKER: every ENTITLEMENT_LADDER row renders in the comparison
 *      table (a new ruled entitlement cannot silently vanish from display).
 *   6. NO ORPHAN TOKENS: no un-interpolated {token} survives to the DOM.
 *   7. THE RETENTION PIN: RETENTION_MONTHS matches migration 023's actual
 *      interval — the FAQ's data-longevity number can never drift from the SQL.
 *   8. COPY-SOURCE GUARD: no hand-typed money and no hand-typed fact-counts in
 *      the pricingPage copy module's strings (money/facts must interpolate).
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

beforeEach(() => { window.localStorage.clear(); window.history.replaceState({}, '', '/'); });
afterEach(() => { cleanup(); window.localStorage.clear(); });

// Stripe / supabase / founder-seats are network — stub them (the
// pricingPageVariant harness, verbatim).
vi.mock('../../src/lib/stripe.js', () => ({ startCheckout: vi.fn(), startCustomerPortal: vi.fn() }));
vi.mock('../../src/lib/supabase.js', () => ({ isConfigured: false, supabase: null, withTimeout: (p) => p }));
vi.mock('../../src/lib/founderSeats.js', () => ({ FOUNDER_SEAT_CAP: 30, fetchFounderSeatsRemaining: vi.fn(async () => 17) }));

const storeState = {
  auth: { tier: 'free', isFounder: false, displayName: '' },
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

import PricingPage from '../../src/components/PricingPage.jsx';
import {
  getActiveAiCosts, SINGLE_DOSSIER, TIERS,
} from '../../src/config/pricing.js';
import {
  getCreditAnchor, approxDollarsForCredits, getFounderBreakEvenMonths,
  SURVEYOR_SURFACE,
} from '../../src/config/pricingDisplay.js';
import { ENTITLEMENT_LADDER, RETENTION_MONTHS } from '../../src/config/entitlementLadder.js';
import { pricingPage, tp } from '../../src/copy/pricingPage.js';

const REPO = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..', '..');

function renderPage() {
  return render(<PricingPage onNavigate={() => {}} />);
}

describe('PricingPage — the five-band drift contract', () => {
  it('task-menu walker: every configured task renders with its exact cost + ≈$', () => {
    const { container } = renderPage();
    const text = container.textContent;
    const allTasks = { ...SURVEYOR_SURFACE.taskCosts, ...getActiveAiCosts() };
    const names = tp('band3.taskMenu.tasks');
    for (const [key, credits] of Object.entries(allTasks)) {
      expect(names[key], `task ${key} has no display name in copy`).toBeTruthy();
      expect(text, `task ${key} name missing`).toContain(names[key]);
      const line = tp('band3.taskMenu.perTask', { credits, approx: approxDollarsForCredits(credits) });
      expect(text, `task ${key} cost line diverges from config`).toContain(line);
    }
  });

  it('the anchor sentence carries the starter pack per-credit label', () => {
    const { container } = renderPage();
    const anchor = getCreditAnchor();
    expect(anchor).toBeTruthy();
    expect(container.textContent).toContain(
      tp('band3.taskMenu.anchor', { perCredit: anchor.perCreditLabel }),
    );
  });

  it('the charter arithmetic + seat cap derive from config', () => {
    const { container } = renderPage();
    const text = container.textContent;
    const months = getFounderBreakEvenMonths();
    expect(months).toBe(Math.ceil(TIERS.founder.priceCents / TIERS.cartographer.priceCents));
    expect(text).toContain(String(months));
    expect(text).toContain(tp('band2.charter.sustainability', { seats: 30 }));
    // The failure policy renders verbatim (the verified-refund promise).
    expect(text).toContain(tp('band3.taskMenu.failurePolicy'));
  });

  it('the bundle lead carries the single-dossier price label', () => {
    const { container } = renderPage();
    expect(container.textContent).toContain(
      tp('band3.bundle.lead', { price: SINGLE_DOSSIER.priceLabel }),
    );
  });

  it('ladder walker: every ruled entitlement row renders in the table', () => {
    const { container } = renderPage();
    const text = container.textContent;
    const rowLabels = tp('band4.rows');
    for (const group of ENTITLEMENT_LADDER) {
      for (const row of group.rows) {
        expect(rowLabels[row.id], `ladder row ${row.id} has no display label`).toBeTruthy();
        expect(text, `ladder row ${row.id} missing from the table`).toContain(rowLabels[row.id]);
        for (const v of [row.free, row.cartographer]) {
          if (typeof v === 'string') expect(text, `ladder cell "${v}" missing`).toContain(v);
        }
      }
    }
  });

  it('no un-interpolated {token} reaches the DOM', () => {
    const { container } = renderPage();
    expect(container.textContent).not.toMatch(/\{\w+\}/);
  });

  it('RETENTION_MONTHS matches migration 023 (the SQL is the source)', () => {
    const sql = fs.readFileSync(
      path.join(REPO, 'supabase', 'migrations', '023_explicit_models_and_plan_retention.sql'),
      'utf8',
    );
    expect(sql).toContain(`interval '${RETENTION_MONTHS} months'`);
  });

  it('RETENTION_MONTHS matches the ACTIVE handle_premium_downgrade re-mint (024), via searchpath baseline', () => {
    // [claims-parity-2] handle_premium_downgrade was RE-MINTED in migration 024 (line 341),
    // so 024 — not 023 — is the version the DB actually runs (the searchpath-baseline
    // resolves the active definition). Pinning ONLY 023 above would miss a reprice that
    // updated config + 023 but left 024's re-mint (and its 024:232 campaign backfill) on
    // the stale window. Resolve the active file via the searchpath baseline and pin it.
    const baseline = JSON.parse(fs.readFileSync(
      path.join(REPO, 'tests', 'lint', '.migration-searchpath-baseline.json'),
      'utf8',
    ));
    const activeFile = baseline['public.handle_premium_downgrade'];
    expect(activeFile, 'handle_premium_downgrade missing from the searchpath baseline').toBeTruthy();
    const sql = fs.readFileSync(path.join(REPO, 'supabase', 'migrations', activeFile), 'utf8');
    expect(
      sql,
      `the ACTIVE handle_premium_downgrade (${activeFile}) must derive its retention window from RETENTION_MONTHS`,
    ).toContain(`interval '${RETENTION_MONTHS} months'`);
  });

  it('copy-source guard: no hand-typed money or fact-counts in pricingPage strings', () => {
    const offenders = [];
    (function walk(node, trail) {
      if (typeof node === 'string') {
        // Money must interpolate ({price}, ≈$ derivations) — a literal $N is a bug.
        if (/\$\s*\d/.test(node)) offenders.push(`${trail}: hand-typed money`);
        // Fact-counts (N credits/seats/months/saves) must interpolate.
        if (/\b\d+\s+(credits?|seats?|months?|saves?)\b/i.test(node)) offenders.push(`${trail}: hand-typed count`);
      } else if (Array.isArray(node)) {
        node.forEach((v, i) => walk(v, `${trail}[${i}]`));
      } else if (node && typeof node === 'object') {
        for (const [k, v] of Object.entries(node)) walk(v, `${trail}.${k}`);
      }
    }(pricingPage, 'pricingPage'));
    expect(offenders).toEqual([]);
  });
});
