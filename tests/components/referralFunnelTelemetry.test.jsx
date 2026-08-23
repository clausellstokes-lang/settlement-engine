/** @vitest-environment jsdom */
/**
 * referralFunnelTelemetry.test.jsx — WEB-3 (§359.8, charter ruled at ODQ §402):
 * the referral loop's emit wiring, end to end on the client side.
 *
 * Migration 107 shipped the whole money loop and NOTHING emitted, so the funnel
 * — intent recorded → first payment → grant claimed — was invisible to every
 * analytics read surface. This file is the acceptance evidence for the half of
 * the cure that lives in the browser, plus the two structural arms that keep the
 * money path out of it.
 *
 * WHY THE REAL ANALYTICS LAYER, NOT A MOCK. `src/lib/analytics.js` is deliberately
 * NOT mocked here. The consent/DNT gate these events inherit lives inside track()
 * itself, so mocking it away would leave A4 asserting a mock's behaviour instead
 * of the product's. Instead the third-party provider seam
 * (`window.__sf_analytics_provider`) is spied — the same idiom
 * tests/lib/analytics.test.js uses — which observes exactly the essential-class
 * events that survive the real gate.
 *
 *   A1  surface labelling: the modal emits 'purchase_modal', and EVERY call site
 *       of the hook is labelled with one of the two enum values (totality scan).
 *   A2  a failed intent emits outcome 'error' and checkout proceeds regardless;
 *       a THROWING analytics provider still cannot reach checkout.
 *   A3  the redeem verdicts collapse to valid/invalid/error and the payload
 *       carries the outcome and NOTHING else — never the code string.
 *   A4  the inherited consent gate: essential off, and DNT, each silence both.
 *   A5  EVENTS_REV is 13 and the generated dictionary carries both rows.
 *   A7  AdminTrendsPanel renders the funnel row from the report's own shape.
 *   A8  the money path is structurally untouched: no emit under stripe-webhook,
 *       and no new writer on the referral tables.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

const mocks = vi.hoisted(() => ({
  calls: /** @type {string[]} */ ([]),
  rpc: vi.fn(),
  priorReferralRows: { data: [], error: null },
  startCheckout: vi.fn(),
  adminRows: /** @type {Record<string, object[]>} */ ({}),
  storeState: {
    creditBalance: 3,
    auth: { user: { id: 'u1', email: 'me@example.test' }, tier: 'free', isFounder: false },
    isElevated: () => false,
  },
}));

// One client seam for all three surfaces: PurchaseModal + RedeemBlock reach the
// RPCs, AdminTrendsPanel reaches the admin-actions edge function.
vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  withTimeout: (p) => p,
  supabase: {
    rpc: (...a) => mocks.rpc(...a),
    from: () => ({ select: () => ({ eq: () => ({ limit: async () => mocks.priorReferralRows }) }) }),
    auth: { getSession: async () => ({ data: { session: {} } }) },
    functions: {
      invoke: async (_fn, { body } = {}) => ({
        data: { success: true, rows: mocks.adminRows[body?.action] || [] },
        error: null,
      }),
    },
  },
}));

vi.mock('../../src/lib/stripe.js', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, startCheckout: (...a) => mocks.startCheckout(...a) };
});

vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector(mocks.storeState),
}));

import PurchaseModal from '../../src/components/PurchaseModal.jsx';
import { RedeemBlock } from '../../src/components/account/ReferralRedeemBlocks.jsx';
import AdminTrendsPanel from '../../src/components/admin/AdminTrendsPanel.jsx';
import { EVENTS, EVENT_CLASS, EVENTS_REV } from '../../src/lib/analyticsEvents.js';
import { setConsent } from '../../src/lib/consent.js';
import { t } from '../../src/copy/index.js';

const REFERRER_LABEL = t('purchase.referredByLabel');
const CODE = 'SFC-SECRETCODE99';

/** Every provider-visible emit of one event name, in order. */
let emitted;
const emitsOf = (name) => emitted.filter((e) => e.event === name);

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
  emitted = [];
  window.__sf_analytics_provider = (event, props) => emitted.push({ event, props });
  // The real gate is the point of A4, so establish it explicitly rather than
  // inheriting whatever a prior file in this worker left behind.
  try { Object.defineProperty(navigator, 'doNotTrack', { value: null, configurable: true }); } catch { /* jsdom */ }
  setConsent({ essential: true, research: false });
  mocks.calls.length = 0;
  mocks.rpc.mockReset();
  mocks.startCheckout.mockReset();
  mocks.priorReferralRows = { data: [], error: null };
  mocks.adminRows = {};
  mocks.rpc.mockImplementation(async () => {
    mocks.calls.push('intent');
    return { data: { ok: true, referral_id: 'r1' }, error: null };
  });
  mocks.startCheckout.mockImplementation(async () => {
    mocks.calls.push('checkout');
    return { redeemNotice: null };
  });
});

afterEach(() => {
  delete window.__sf_analytics_provider;
  cleanup();
});

const firstPackButton = () => screen.getAllByRole('button', { name: /^Buy \d+ credits/ })[0];

/** Drive the modal's referral field and buy. */
async function buyWithReferrer(handle = 'SF-QQQQQQQ') {
  render(<PurchaseModal onClose={() => {}} />);
  const field = await screen.findByLabelText(REFERRER_LABEL);
  fireEvent.change(field, { target: { value: handle } });
  fireEvent.click(firstPackButton());
  await waitFor(() => expect(mocks.startCheckout).toHaveBeenCalledTimes(1));
}

/** Drive the Account page's redeem block once. */
async function applyCode(code = CODE) {
  render(<RedeemBlock onNavigatePricing={() => {}} />);
  fireEvent.change(screen.getByLabelText(t('account.redeemLabel')), { target: { value: code } });
  fireEvent.click(screen.getByRole('button', { name: t('account.redeemApply') }));
}

describe('WEB-3 — the referral loop emit wiring', () => {
  test('A1: the modal emits referral_intent_recorded with its own surface and the real outcome', async () => {
    await buyWithReferrer();
    await waitFor(() => expect(emitsOf(EVENTS.REFERRAL_INTENT_RECORDED)).toHaveLength(1));
    const [e] = emitsOf(EVENTS.REFERRAL_INTENT_RECORDED);
    expect(e.props).toEqual({ surface: 'purchase_modal', outcome: 'recorded' });
    // ORDERING (M3): the emit is POST-HOC. The RPC ran before the event existed,
    // so an intent that never landed can never be reported as one.
    expect(mocks.calls).toEqual(['intent', 'checkout']);
    // …and the referrer's account number never leaves the client.
    // anchored: the assertion above proves exactly one emit with a two-key payload,
    // so this cannot pass because nothing was emitted.
    expect(JSON.stringify(emitted)).not.toContain('SF-QQQQQQQ');
  });

  test('A1b: EVERY call site of the hook labels its surface, and only from the ruled enum', () => {
    // Totality, not a spot check: the emit lives in the hook, so an unlabelled
    // mount would emit `surface: undefined` and nothing else would notice.
    const files = ['src/components/PricingPage.jsx', 'src/components/PurchaseModal.jsx'];
    const found = [];
    for (const rel of ['src', 'src/components', 'src/components/account', 'src/components/purchase', 'src/hooks']
      .flatMap((dir) => readdirSync(join(ROOT, dir), { withFileTypes: true })
        .filter((d) => d.isFile() && /\.jsx?$/.test(d.name))
        .map((d) => `${dir}/${d.name}`))) {
      const src = read(rel);
      for (const m of src.matchAll(/useReferralIntent\((.*?)\)/g)) {
        if (rel === 'src/hooks/useReferralIntent.js') continue; // the declaration itself
        found.push({ rel, arg: m[1].trim() });
      }
    }
    // Guard-the-guard: the scan really reaches the two known call sites.
    expect(found.map((f) => f.rel).sort()).toEqual(files);
    expect(found.find((f) => f.rel === 'src/components/PricingPage.jsx').arg).toBe("'pricing'");
    expect(found.find((f) => f.rel === 'src/components/PurchaseModal.jsx').arg).toBe("'purchase_modal'");
  });

  test('A2: a failed intent emits outcome error, and neither the failure nor a throwing provider blocks checkout', async () => {
    mocks.rpc.mockImplementation(async () => { mocks.calls.push('intent'); throw new Error('transport down'); });
    // The analytics provider throws too — the emit is the LAST thing that could
    // interfere with a purchase, so it is made hostile on purpose here.
    window.__sf_analytics_provider = (event, props) => {
      emitted.push({ event, props });
      throw new Error('provider exploded');
    };
    await buyWithReferrer();
    await waitFor(() => expect(emitsOf(EVENTS.REFERRAL_INTENT_RECORDED)).toHaveLength(1));
    expect(emitsOf(EVENTS.REFERRAL_INTENT_RECORDED)[0].props)
      .toEqual({ surface: 'purchase_modal', outcome: 'error' });
    // Checkout ran anyway, and in the right order.
    expect(mocks.calls).toEqual(['intent', 'checkout']);
    expect(mocks.startCheckout).toHaveBeenCalledTimes(1);
  });

  test('A2b: a server rejection reads as outcome rejected, not as an error', async () => {
    mocks.rpc.mockImplementation(async () => {
      mocks.calls.push('intent');
      return { data: { ok: false, reason: 'referrer_cap_reached' }, error: null };
    });
    await buyWithReferrer();
    await waitFor(() => expect(emitsOf(EVENTS.REFERRAL_INTENT_RECORDED)).toHaveLength(1));
    expect(emitsOf(EVENTS.REFERRAL_INTENT_RECORDED)[0].props.outcome).toBe('rejected');
    await screen.findByText(t('purchase.referralCap'));
  });

  test('A3: the redeem verdicts collapse to valid/invalid/error and carry the outcome ALONE', async () => {
    mocks.rpc.mockImplementation(async () => ({ data: { valid: true, kind: 'free_month' }, error: null }));
    await applyCode();
    await waitFor(() => expect(emitsOf(EVENTS.REDEEM_CODE_CHECKED)).toHaveLength(1));
    const first = emitsOf(EVENTS.REDEEM_CODE_CHECKED)[0];
    // THE STRUCTURAL CONTENT-ABSENCE ARM (M2): the payload's KEY SET is the
    // contract. A code field added later reds here even if no test reads it.
    expect(Object.keys(first.props)).toEqual(['outcome']);
    expect(first.props.outcome).toBe('valid');
    // anchored: the key-set assertion above proves a real, non-empty payload was
    // observed, so the code's absence is a fact about it rather than about nothing.
    expect(JSON.stringify(emitted)).not.toContain(CODE);

    cleanup();
    emitted = [];
    // already_used is the caller's own history — it folds into 'invalid' because
    // the ruled enum has three values and a fourth would re-widen 107's collapse.
    mocks.rpc.mockImplementation(async () => ({ data: { valid: false, reason: 'already_used' }, error: null }));
    await applyCode();
    await waitFor(() => expect(emitsOf(EVENTS.REDEEM_CODE_CHECKED)).toHaveLength(1));
    expect(emitsOf(EVENTS.REDEEM_CODE_CHECKED)[0].props).toEqual({ outcome: 'invalid' });

    cleanup();
    emitted = [];
    mocks.rpc.mockImplementation(async () => { throw new Error('transport down'); });
    await applyCode();
    await waitFor(() => expect(emitsOf(EVENTS.REDEEM_CODE_CHECKED)).toHaveLength(1));
    expect(emitsOf(EVENTS.REDEEM_CODE_CHECKED)[0].props).toEqual({ outcome: 'error' });
  });

  test('A4: the inherited gate silences both events when essential consent is off, and under DNT', async () => {
    setConsent({ essential: false });
    await buyWithReferrer();
    mocks.rpc.mockImplementation(async () => ({ data: { valid: true, kind: 'credits' }, error: null }));
    await applyCode();
    await waitFor(() => expect(mocks.rpc).toHaveBeenCalled());
    expect(emitted).toEqual([]);

    cleanup();
    emitted = [];
    setConsent({ essential: true });
    Object.defineProperty(navigator, 'doNotTrack', { value: '1', configurable: true });
    await applyCode();
    await waitFor(() => expect(mocks.rpc).toHaveBeenCalled());
    expect(emitted).toEqual([]);
  });

  test('A5: the contract revision is 13, both events are essential, and the dictionary carries both rows', () => {
    expect(EVENTS_REV).toBe(13);
    expect(EVENTS.REFERRAL_INTENT_RECORDED).toBe('referral_intent_recorded');
    expect(EVENTS.REDEEM_CODE_CHECKED).toBe('redeem_code_checked');
    expect(EVENT_CLASS.REFERRAL_INTENT_RECORDED).toBe('essential');
    expect(EVENT_CLASS.REDEEM_CODE_CHECKED).toBe('essential');
    // The dictionary is GENERATED, so the pin is on the generated ROW rather than
    // on prose that would name the event either way (the doc-agreement vacuity).
    const dict = read('docs/analytics-event-dictionary.md');
    expect(dict).toContain('- **EVENTS_REV:** 13');
    expect(dict).toContain('| `REFERRAL_INTENT_RECORDED` | `referral_intent_recorded` | essential |');
    expect(dict).toContain('| `REDEEM_CODE_CHECKED` | `redeem_code_checked` | essential |');
  });

  test('A7: AdminTrendsPanel renders the referral funnel row from the report shape', async () => {
    mocks.adminRows.get_referral_funnel = [
      { bucket: '2026-08-20', intents_recorded: 7, referrals_granted: 3, referrals_clawed_back: 1 },
    ];
    render(<AdminTrendsPanel />);
    await screen.findByText('Referral funnel (intents → grants)');
    // The figures reach the card, not just its title.
    await screen.findByText('2026-08-20');
    await waitFor(() => {
      expect(screen.getAllByText('7').length).toBeGreaterThan(0);
      expect(screen.getAllByText('3').length).toBeGreaterThan(0);
    });
  });

  test('A8: the money path is untouched — no emit under stripe-webhook, no new writer on the referral tables', () => {
    const webhook = read('supabase/functions/stripe-webhook/index.ts');
    // Guard-the-guard: the file really was read, so the three absences below are
    // facts about the handler rather than about an empty string.
    expect(webhook).toContain('grant_referral');
    // anchored: the grant_referral assertion above proves this is the real handler.
    expect(webhook).not.toMatch(/from ['"][^'"]*analytics[^'"]*['"]/);
    // anchored: same file, same reason — the handler is non-empty and is the one
    // that owns the referral grant.
    expect(webhook).not.toMatch(/\btrack\s*\(/);

    // The referral tables' writers: exactly one migration writes them, and 199 is
    // not it. Enumerated from the corpus so a new writer cannot arrive unnoticed.
    const migDir = join(ROOT, 'supabase/migrations');
    const writers = readdirSync(migDir)
      .filter((f) => /^\d+_.*\.sql$/.test(f))
      .filter((f) => /(insert\s+into|update)\s+public\.referrals\b/i.test(readFileSync(join(migDir, f), 'utf8')))
      .sort();
    expect(writers).toEqual(['107_referral_redeem.sql']);
    // The client library reads the table and never writes it.
    const lib = read('src/lib/referralRedeem.js');
    const tableCalls = [...lib.matchAll(/\.from\('referrals'\)\.(\w+)\(/g)].map((m) => m[1]);
    expect(tableCalls).toEqual(['select']);
  });
});
