/**
 * Supabase Edge Function: stripe-webhook
 *
 * Handles the Checkout, PaymentIntent, Refund, Invoice, Charge/Dispute, and
 * Subscription lifecycle events listed in docs/DEPLOY.md. Every settled
 * account-bound payment rechecks account state before fulfillment; an inactive
 * account is canceled/cleaned and refunded through the durable obligation
 * ledger instead of receiving credits or entitlements.
 *
 * Credit grants:
 *   All Stripe-originated grants go through the service-role-only
 *   `system_grant_credits` RPC. The RPC owns the compatibility writes
 *   to credit_ledger, credit_transactions, profiles.credits, and the
 *   admin audit trail in one database transaction.
 *
 * Idempotency (two belts):
 *   EVENT level — each verified event id receives a migration-181 processing
 *   lease. Completed duplicates ack 200, live concurrent work returns 409, a
 *   handler failure releases its lease, and a crashed handler's stale lease is
 *   reclaimable. This prevents both concurrent execution and permanent event
 *   loss after a runtime death.
 *   GRANT level (authoritative) — system_grant_credits' atomic claim (024)
 *   plus the per-invoice / per-session ledger dedup. These guards remain the
 *   money-authoritative protection even if an operator rolls the lease
 *   migration independently of the function deploy.
 *
 * Environment variables:
 *   STRIPE_SECRET_KEY       — Stripe secret key
 *   STRIPE_WEBHOOK_SECRET   — Webhook signing secret
 *   SUPABASE_SERVICE_ROLE_KEY — Service role key (bypasses RLS)
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
// Pinned EXACT version (not the floating `@2`): deno.lock only constrains local/CI
// deno tasks — at deploy time the edge runtime resolves the URL itself, so a
// floating major on the money path could silently ship a different client than CI
// tested. Keep in lockstep with deno.lock's resolution when upgrading.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.108.2';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
// Structured error logging for the money path (review B16 observability).
import { logError } from '../_shared/logError.ts';
import {
  buildPaymentRefundRequestMetadata,
  type PaymentRefundRequestIdentity,
} from '../_shared/paymentRefundRequest.ts';
import {
  claimStripeWebhookEvent,
  completeStripeWebhookEvent,
  releaseStripeWebhookEvent,
} from '../_shared/stripeWebhookLease.ts';
// Referral-reward notifications (107): inline templates + a never-throw Resend
// sender, kept OUT of send-email so they can never become a public mailer.
import {
  type ReferralEmailDispatch,
  type ReferralEmailRecipient,
  type ReferralParty,
  type ReferralRewardKind,
  sendReferralGrantEmails,
} from '../_shared/referralEmails.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' });
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const DEFAULT_PAYMENT_CURRENCY = 'usd';
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function adminClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
}

/**
 * Ledger-consistent credit grant through the system_grant_credits RPC.
 *
 * The RPC writes to credit_ledger + credit_transactions + profiles
 * atomically inside a single SECURITY DEFINER transaction, with an
 * admin_actions row for traceability. No more read-then-write race
 * on the profiles counter.
 */
async function grantCredits(
  supabase: ReturnType<typeof adminClient>,
  userId: string,
  amount: number,
  source: string,
  metadata: Record<string, unknown> = {},
  expiresAt: string | null = null,
) {
  const { error: rpcErr } = await supabase.rpc('system_grant_credits', {
    target_user: userId,
    amount,
    source,
    metadata,
    expires_at: expiresAt,
  });

  if (rpcErr) {
    logError('stripe-webhook', userId, rpcErr.message, { stage: 'grant_credits', source, amount });
    throw new Error(`Credit grant failed: ${rpcErr.message}`);
  }
}

/**
 * Idempotent credit grant for one-shot checkout.session.completed grants
 * (founder bonus, credit packs). Stripe delivers webhooks AT-LEAST-ONCE, so a
 * redelivered checkout event must not double-grant real money. This SELECT is a
 * cheap fast-path skip (mirroring grantMonthlyAllowanceIfNeeded's invoice dedup);
 * the AUTHORITATIVE, race-safe guarantee is in system_grant_credits, which
 * atomically claims (source, idempotency_key) via INSERT ... ON CONFLICT DO
 * NOTHING before granting — so even two truly-concurrent redeliveries that both
 * pass this SELECT cannot double-grant. The claim key is per-SESSION for credit
 * packs (idempotency_key=stripe_session_id) but per-ACCOUNT for the founder bonus
 * (idempotency_key='founder:'||user — see the founder per-account idempotency
 * migration): two concurrent founder checkouts with DIFFERENT sessions still grant
 * exactly once. Do not remove the RPC's atomic claim on the strength of this
 * pre-check alone.
 *
 * @param {ReturnType<typeof adminClient>} supabase
 * @param {string} userId
 * @param {number} amount
 * @param {string} source
 * @param {string} sessionId
 */
async function grantCreditsForSessionOnce(
  supabase: ReturnType<typeof adminClient>,
  userId: string,
  amount: number,
  source: string,
  sessionId: string,
  oncePerUser = false,
) {
  // Per-ACCOUNT idempotency FAST-PATH: the founder bonus is once-per-account, not
  // once-per-session — a SECOND founder_lifetime purchase (a new checkout session)
  // must not re-grant the 30-credit bonus. (Credit-pack purchases stay
  // once-per-session: a user can buy the same pack repeatedly.) NOTE this SELECT is
  // a non-atomic read — two truly-concurrent first-time founder checkouts can both
  // pass it. The AUTHORITATIVE once-per-account guarantee is system_grant_credits'
  // per-user claim key (idempotency_key='founder:'||user); this pre-check only
  // skips a doomed RPC round-trip on the common redelivery case.
  if (oncePerUser) {
    const { data: priorForUser } = await supabase
      .from('credit_ledger')
      .select('id')
      .eq('source', source)
      .eq('user_id', userId)
      .limit(1)
      .maybeSingle();
    if (priorForUser?.id) {
      console.log(`[stripe-webhook] ${source} already granted to user ${userId} — skipping (once-per-account)`);
      return;
    }
  }
  const { data: existing } = await supabase
    .from('credit_ledger')
    .select('id')
    .eq('source', source)
    .eq('metadata->>stripe_session_id', sessionId)
    .maybeSingle();
  if (existing?.id) {
    console.log(`[stripe-webhook] ${source} for session ${sessionId} already granted — skipping (idempotent redelivery)`);
    return;
  }
  await grantCredits(supabase, userId, amount, source, { stripe_session_id: sessionId });
}

async function findUserIdForStripeCustomer(
  supabase: ReturnType<typeof adminClient>,
  customerId: string | null,
  fallbackEmail?: string | null,
  subscriptionId?: string | null,
) {
  if (customerId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, is_founder, stripe_subscription_id, tier, banned_at, deleted_at, disabled_at')
      .eq('stripe_customer_id', customerId)
      .maybeSingle();
    if (profile?.id) {
      return {
        userId: profile.id as string,
        isFounder: Boolean(profile.is_founder),
        stripeSubscriptionId: (profile.stripe_subscription_id as string | null) ?? null,
        tier: (profile.tier as string | null) ?? null,
        isActive: profile.banned_at == null
          && profile.deleted_at == null
          && profile.disabled_at == null,
        deletionCleanupRequired: profile.deleted_at != null,
      };
    }
  }

  // Completed account cleanup deliberately clears the live profile bindings and
  // anonymizes email. Migration 178 keeps a non-client-readable identity history
  // on the durable cleanup job so a late Stripe invoice/subscription event can
  // still be attributed and neutralized instead of becoming an orphan charge.
  if (customerId || subscriptionId) {
    const { data: resolved, error: resolveError } = await supabase.rpc(
      'resolve_account_deletion_user_by_stripe_billing',
      {
        p_subscription_id: subscriptionId ?? null,
        p_customer_id: customerId ?? null,
      },
    );
    if (resolveError) {
      throw new Error(`Deleted-account billing identity lookup failed: ${resolveError.message}`);
    }
    const resolution = resolved as {
      ok?: boolean;
      reason?: string;
      user_id?: string;
    } | null;
    if (resolution?.reason === 'ambiguous') {
      throw new Error('Deleted-account billing identity is ambiguous');
    }
    if (resolution?.ok === true && resolution.user_id) {
      return {
        userId: resolution.user_id,
        isFounder: false,
        stripeSubscriptionId: subscriptionId ?? null,
        tier: null,
        isActive: false,
        deletionCleanupRequired: true,
      };
    }
  }

  let email = fallbackEmail || null;
  if (!email && customerId) {
    try {
      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
      email = customer.email || null;
    } catch (e) {
      // Log only the message — the raw Stripe error object can echo customer PII.
      console.warn('[stripe-webhook] customer lookup failed:', (e as Error)?.message ?? 'unknown');
    }
  }
  if (!email) return null;

  // Case-insensitive EXACT match — never a pattern. ILIKE treats %, _ and \ as
  // wildcards, so an unescaped email like `a_b@x.com` could bind this money
  // event (grants/downgrades) to the WRONG profile (`aXb@x.com`). Escape the
  // SQL metacharacters. PostgREST additionally rewrites `*` in ilike values to
  // `%` with no escape form, so for the rare email containing `*` fall back to
  // case-sensitive exact equality rather than risk a wrong-profile match.
  const baseQuery = () => supabase
    .from('profiles')
    .select('id, is_founder, stripe_subscription_id, tier, banned_at, deleted_at, disabled_at');
  const { data: profile } = email.includes('*')
    ? await baseQuery().eq('email', email).maybeSingle()
    : await baseQuery().ilike('email', email.replace(/([\\%_])/g, '\\$1')).maybeSingle();
  if (!profile?.id) return null;

  const isActive = profile.banned_at == null
    && profile.deleted_at == null
    && profile.disabled_at == null;
  if (customerId && isActive) {
    const { error } = await supabase.from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', profile.id);
    if (error) throw new Error(`Stripe customer binding failed: ${error.message}`);
  }
  return {
    userId: profile.id as string,
    isFounder: Boolean(profile.is_founder),
    stripeSubscriptionId: (profile.stripe_subscription_id as string | null) ?? null,
    tier: (profile.tier as string | null) ?? null,
    isActive,
    deletionCleanupRequired: profile.deleted_at != null,
  };
}

async function findBillingProfileByVerifiedUserId(
  supabase: ReturnType<typeof adminClient>,
  userId: string | null,
  subscriptionId: string | null,
) {
  if (!userId || !UUID_PATTERN.test(userId)) return null;
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, is_founder, stripe_subscription_id, tier, banned_at, deleted_at, disabled_at')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw new Error(`Stripe metadata profile lookup failed: ${error.message}`);
  if (!profile?.id) return null;
  const isActive = profile.banned_at == null
    && profile.deleted_at == null
    && profile.disabled_at == null;
  return {
    userId: profile.id as string,
    isFounder: Boolean(profile.is_founder),
    stripeSubscriptionId:
      (profile.stripe_subscription_id as string | null) ?? subscriptionId,
    tier: (profile.tier as string | null) ?? null,
    isActive,
    deletionCleanupRequired: profile.deleted_at != null,
  };
}

// Returns the resolved profile so the invoice.paid case can run the referral
// qualification (107) against the same customer→user binding without a second
// resolution round trip.
async function grantMonthlyAllowanceIfNeeded(
  supabase: ReturnType<typeof adminClient>,
  stripeApi: typeof stripe,
  invoice: Stripe.Invoice,
) {
  const customerId = typeof invoice.customer === 'string'
    ? invoice.customer
    : invoice.customer?.id || null;
  const subscriptionId = typeof invoice.subscription === 'string'
    ? invoice.subscription
    : invoice.subscription?.id ?? null;
  let profile = await findUserIdForStripeCustomer(
    supabase,
    customerId,
    invoice.customer_email || null,
    subscriptionId,
  );
  if (!profile && subscriptionId) {
    // A first invoice can arrive before Checkout completion. The subscription
    // itself carries server-authenticated owner metadata from create-checkout,
    // so it can recover attribution even after deletion cleared live profile
    // Stripe ids and before the cleanup job has checkpointed the new id.
    const invoiceWithSubscriptionDetails = invoice as Stripe.Invoice & {
      subscription_details?: {
        metadata?: Record<string, string> | null;
      } | null;
    };
    let metadataUserId =
      invoiceWithSubscriptionDetails.subscription_details?.metadata
        ?.supabase_user_id ?? null;
    if (!metadataUserId) {
      const liveSubscription = await stripeApi.subscriptions.retrieve(
        subscriptionId,
      );
      metadataUserId = liveSubscription.metadata?.supabase_user_id ?? null;
    }
    profile = await findBillingProfileByVerifiedUserId(
      supabase,
      metadataUserId,
      subscriptionId,
    );
  }
  if (!profile?.userId) {
    throw new Error(`Monthly allowance invoice ${invoice.id} has no matching profile`);
  }
  if (!profile.isActive) return profile;

  // Only SUBSCRIPTION invoices carry the monthly allowance. A non-subscription
  // invoice (manual / one-off) must NOT grant 30 credits or back-fill a sub id.
  // (Stripe always sets billing_reason; an absent value ⇒ proceed for back-compat.)
  if (invoice.billing_reason
    && invoice.billing_reason !== 'subscription_create'
    && invoice.billing_reason !== 'subscription_cycle') {
    return profile;
  }

  // THE ALLOWANCE PRICE-ID GATE (§5, §14 — load-bearing). The 30-credit monthly
  // allowance is the CARTOGRAPHER (premium) perk ONLY. Without this, a Surveyor
  // subscription invoice (also billing_reason subscription_create/cycle) would mint
  // the Cartographer allowance. Require the invoice's first line's price id to be
  // STRIPE_PRICE_PREMIUM. Read at call time so the check tracks the env. FAIL-OPEN
  // for back-compat: an unset env OR an absent line price proceeds (logged) — the
  // gate only ever SKIPS the allowance for an invoice we can positively identify as
  // a NON-Cartographer plan.
  const premiumPriceId = Deno.env.get('STRIPE_PRICE_PREMIUM') || '';
  const firstLinePriceId = invoice.lines?.data?.[0]?.price?.id ?? null;
  if (premiumPriceId && firstLinePriceId && firstLinePriceId !== premiumPriceId) {
    console.log(`[stripe-webhook] invoice ${invoice.id} price ${firstLinePriceId} is not the Cartographer plan (${premiumPriceId}) — skipping the monthly Cartographer allowance`);
    return profile;
  }
  if (!premiumPriceId || !firstLinePriceId) {
    console.log(`[stripe-webhook] monthly-allowance price-id gate inactive for invoice ${invoice.id} (env=${Boolean(premiumPriceId)}, line=${Boolean(firstLinePriceId)}) — proceeding for back-compat`);
  }

  // BACK-FILL (not overwrite) the recorded subscription id for legacy premium
  // users who pre-date the column. We deliberately do NOT overwrite an existing
  // recorded id from an invoice: Stripe reorders/redelivers, so a late OLD-sub
  // invoice must not clobber the current sub back to a cancelled one and re-arm a
  // stale customer.subscription.deleted. The authoritative "current sub" write is
  // the checkout premium branch (on subscribe/re-subscribe); invoices only fill
  // the gap once, when nothing is recorded yet.
  const renewalSubId = typeof invoice.subscription === 'string'
    ? invoice.subscription
    : invoice.subscription?.id || null;
  if (renewalSubId && !profile.stripeSubscriptionId) {
    const { error: subErr } = await supabase.from('profiles')
      .update({ stripe_subscription_id: renewalSubId })
      .eq('id', profile.userId)
      .is('stripe_subscription_id', null);   // atomic back-fill: write only if still unset
    if (subErr) throw new Error(`Recording subscription id failed: ${subErr.message}`);
  }

  const { data: existing } = await supabase
    .from('credit_ledger')
    .select('id')
    .eq('source', 'monthly_allowance')
    .eq('metadata->>stripe_invoice_id', invoice.id)
    .maybeSingle();
  if (existing?.id) return profile;

  const firstLine = invoice.lines?.data?.[0];
  const periodEnd = firstLine?.period?.end || invoice.period_end || null;
  const expiresAt = periodEnd ? new Date(periodEnd * 1000).toISOString() : null;
  await grantCredits(supabase, profile.userId, 30, 'monthly_allowance', {
    stripe_invoice_id: invoice.id,
    stripe_subscription_id: typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id || '',
    stripe_customer_id: customerId || '',
    period_end: periodEnd || null,
  }, expiresAt);
  console.log(`Granted 30 monthly credits to user ${profile.userId} for invoice ${invoice.id}`);
  return profile;
}

// ── Referral rewards (migration 107) ─────────────────────────────────────────
//
// QUALIFYING EVENTS — the referee's first REAL payment:
//   * invoice.paid / invoice.payment_succeeded with
//     billing_reason === 'subscription_create' AND amount_paid > 0
//     (the first Cartographer invoice), or
//   * a PAID founder_lifetime checkout.session.completed with
//     amount_total > 0 (session.id doubles as the invoice-id claim key).
// The amount > 0 gate is the zero-dollar red-team fix: a 100%-discounted or
// trialing first invoice moves no money and must mint no reward. It is checked
// here AND re-asserted inside grant_referral, so a regression in either layer
// cannot mint value on its own.
//
// IDEMPOTENCY LAYERS:
//   * grant_referral is the AUTHORITATIVE claim-once (pending → granted, one
//     UPDATE ... RETURNING): invoice.paid + invoice.payment_succeeded for the
//     same invoice, and any redelivery, collapse to one grant.
//   * The founder credit reward additionally carries a (source,
//     referral_party_key) ledger pre-check mirroring grantCreditsForSessionOnce.
//   * The Stripe coupon attach carries an Idempotency-Key derived from
//     referral_id + party, so a re-run cannot double-attach.
//
// FAILURE POSTURE (why reward errors log instead of throwing): once
// grant_referral has claimed, a thrown error would release the EVENT claim,
// but the redelivered event would read no_pending_referral and never re-run
// the reward step — the throw buys no retry, it just hides the partial state.
// Instead each party's reward is applied under its own try/catch with a
// structured logError; the referrals row (status=granted, per-party reward
// columns) is the operator's remediation surface for a half-rewarded grant.

const REFERRAL_COUPON_ID = 'referral_free_month';
const REFERRAL_CREDIT_REWARD = 10;
// The one-time bonus a founder_lifetime purchase grants (see the completion handler);
// reversed on refund/chargeback of that purchase. Keep in sync with the grant literal.
const FOUNDER_CREDIT_BONUS = 30;

/**
 * Lazy-create the shared referral coupon: 100% off, duration 'once', so it
 * covers exactly one invoice at the CUSTOMER level. Stripe coupon ids are
 * global per account, so the create races itself across webhook invocations —
 * resource_already_exists is the expected steady state and is swallowed.
 */
async function ensureReferralCoupon(stripeApi: typeof stripe): Promise<void> {
  try {
    await stripeApi.coupons.create({
      id: REFERRAL_COUPON_ID,
      percent_off: 100,
      duration: 'once',
      name: 'Referral: one month on us',
    });
  } catch (err) {
    if ((err as { code?: string })?.code !== 'resource_already_exists') throw err;
  }
}

/**
 * A coupon needs a customer to sit on. A free-tier referrer has never checked
 * out, so no stripe_customer_id exists yet — create the customer NOW (email
 * from the auth admin API, the source of truth) and persist the binding. The
 * coupon then applies to their FIRST subscription invoice automatically: the
 * reward waits gracefully instead of being forfeited.
 */
async function ensureStripeCustomerForUser(
  supabase: ReturnType<typeof adminClient>,
  stripeApi: typeof stripe,
  userId: string,
): Promise<string> {
  const { data: userRes, error: userErr } = await supabase.auth.admin.getUserById(userId);
  const email = userRes?.user?.email ?? null;
  if (userErr || !email) {
    throw new Error(`No auth email for user ${userId}: ${userErr?.message ?? 'missing email'}`);
  }
  const customer = await stripeApi.customers.create({
    email,
    metadata: { supabase_user_id: userId },
  });

  // Atomic back-fill (the grantMonthlyAllowanceIfNeeded idiom): only bind when
  // still unset, so a concurrent checkout that bound a customer first wins and
  // we attach the coupon to THAT customer instead of an orphan.
  const { data: bound, error: bindErr } = await supabase.from('profiles')
    .update({ stripe_customer_id: customer.id })
    .eq('id', userId)
    .is('stripe_customer_id', null)
    .select('stripe_customer_id')
    .maybeSingle();
  if (bindErr) throw new Error(`Binding referral customer failed: ${bindErr.message}`);
  if (bound?.stripe_customer_id) return customer.id;

  // Lost the race: re-read the winner's customer id (our created customer
  // stays an unbound Stripe record — harmless, and visible in Stripe search).
  const { data: fresh } = await supabase.from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .maybeSingle();
  return (fresh?.stripe_customer_id as string | null) ?? customer.id;
}

/**
 * Apply ONE party's referral reward and record it for clawback:
 *   * Founder → 10 credits (a coupon is worthless against a lifetime seat).
 *   * Everyone else → the 1-month 100%-off coupon at the customer level.
 * Returns the reward kind recorded, for the notification email.
 */
async function applyReferralReward(
  supabase: ReturnType<typeof adminClient>,
  stripeApi: typeof stripe,
  referralId: string,
  party: ReferralParty,
  userId: string,
): Promise<ReferralRewardKind> {
  const { data: profile, error: profileErr } = await supabase.from('profiles')
    .select('id, is_founder, stripe_customer_id')
    .eq('id', userId)
    .maybeSingle();
  if (profileErr || !profile?.id) {
    throw new Error(`Referral reward profile lookup failed for ${userId}: ${profileErr?.message ?? 'not found'}`);
  }

  if (profile.is_founder) {
    // Founder party: 10 credits through the same ledger path as every other
    // Stripe-originated grant. grant_referral's claim-once is the authoritative
    // guard; this (source, referral_party_key) pre-check mirrors
    // grantCreditsForSessionOnce's discipline so even a re-entered reward step
    // (operator replay) cannot double-grant.
    const partyKey = `${referralId}:${party}`;
    const { data: existing } = await supabase
      .from('credit_ledger')
      .select('id')
      .eq('source', 'referral_reward')
      .eq('metadata->>referral_party_key', partyKey)
      .maybeSingle();
    if (existing?.id) {
      console.log(`[stripe-webhook] referral_reward ${partyKey} already granted — skipping`);
    } else {
      await grantCredits(supabase, userId, REFERRAL_CREDIT_REWARD, 'referral_reward', {
        referral_id: referralId,
        party,
        referral_party_key: partyKey,
      });
    }
    const { error: detailErr } = await supabase.rpc('record_referral_grant_detail', {
      p_referral_id: referralId,
      p_party: party,
      p_reward: 'credits_10',
      p_coupon_id: null,
    });
    // The detail row is what clawback_referral hands back for reversal — a
    // missing stamp means a refund could not deduct these credits, so fail
    // loud into the per-party catch (logged, referral row shows the gap).
    if (detailErr) throw new Error(`record_referral_grant_detail failed: ${detailErr.message}`);
    return 'credits_10';
  }

  // Non-founder party: customer-level coupon. duration 'once' burns it on the
  // next invoice Stripe raises for this customer (a subscriber's next renewal,
  // or a free-tier referrer's first invoice whenever they subscribe).
  await ensureReferralCoupon(stripeApi);
  const customerId = (profile.stripe_customer_id as string | null)
    ?? await ensureStripeCustomerForUser(supabase, stripeApi, userId);
  await stripeApi.customers.update(
    customerId,
    { coupon: REFERRAL_COUPON_ID },
    // Party-scoped Idempotency-Key: a re-run of this step (operator replay,
    // partial failure recovery) re-sends the SAME request instead of racing a
    // second discount onto the customer.
    { idempotencyKey: `referral-${referralId}-${party}-coupon` },
  );
  const { error: detailErr } = await supabase.rpc('record_referral_grant_detail', {
    p_referral_id: referralId,
    p_party: party,
    p_reward: 'free_month',
    p_coupon_id: REFERRAL_COUPON_ID,
  });
  if (detailErr) throw new Error(`record_referral_grant_detail failed: ${detailErr.message}`);
  return 'free_month';
}

/**
 * The referral grant path, shared by the first-invoice and founder-checkout
 * qualifying events. Calls grant_referral (claim-once, zero-dollar-gated);
 * when it claims, rewards both parties and notifies them.
 *
 * THROW SEMANTICS: a grant_referral TRANSPORT failure throws (non-2xx →
 * Stripe redelivers; the allowance/founder grants that already ran are
 * idempotent, and the still-pending referral is claimed on the retry).
 * Failures AFTER the claim do not throw — see the failure-posture note above.
 */
async function settleReferralIfPending(
  supabase: ReturnType<typeof adminClient>,
  stripeApi: typeof stripe,
  opts: {
    refereeUserId: string;
    invoiceId: string;
    amountPaidCents: number;
    emailDispatch?: ReferralEmailDispatch;
  },
): Promise<void> {
  // Zero-dollar gate, layer 1 (layer 2 lives inside grant_referral).
  if (!Number.isFinite(opts.amountPaidCents) || opts.amountPaidCents <= 0) return;

  const { data: grant, error: grantErr } = await supabase.rpc('grant_referral', {
    p_referee: opts.refereeUserId,
    p_invoice_id: opts.invoiceId,
    p_amount_paid_cents: opts.amountPaidCents,
  });
  if (grantErr) {
    logError('stripe-webhook', opts.refereeUserId, grantErr.message, {
      stage: 'grant_referral', invoice_id: opts.invoiceId,
    });
    throw new Error(`grant_referral failed: ${grantErr.message}`);
  }
  if (!grant?.ok) {
    // The overwhelmingly common case: this payer was never referred
    // (no_pending_referral), or a duplicate delivery lost the claim. No-op.
    return;
  }

  const referralId = grant.referral_id as string;
  const referrerUserId = grant.referrer_user_id as string;
  console.log(`[stripe-webhook] referral ${referralId} granted on ${opts.invoiceId} (referee ${opts.refereeUserId}, referrer ${referrerUserId})`);

  const parties: Array<{ party: ReferralParty; userId: string }> = [
    { party: 'referee', userId: opts.refereeUserId },
    { party: 'referrer', userId: referrerUserId },
  ];
  const rewarded: Array<{ party: ReferralParty; userId: string; reward: ReferralRewardKind }> = [];
  for (const { party, userId } of parties) {
    try {
      const reward = await applyReferralReward(supabase, stripeApi, referralId, party, userId);
      rewarded.push({ party, userId, reward });
    } catch (err) {
      // Post-claim: log, don't throw (see the failure-posture note above).
      logError('stripe-webhook', userId, err, {
        stage: 'referral_reward', referral_id: referralId, party,
      });
    }
  }

  // Notifications — STRICTLY fire-and-forget. sendReferralGrantEmails never
  // throws by contract, and the recipient lookups sit inside this try too, so
  // no email-path failure can reach the money path. Only parties whose reward
  // actually landed are notified (no "month on us" mail for a reward the
  // operator still has to remediate).
  try {
    const recipients: ReferralEmailRecipient[] = [];
    for (const r of rewarded) {
      const { data: userRes } = await supabase.auth.admin.getUserById(r.userId);
      const email = userRes?.user?.email ?? null;
      if (email) recipients.push({ email, party: r.party, reward: r.reward });
    }
    await sendReferralGrantEmails({ recipients, dispatch: opts.emailDispatch });
  } catch (err) {
    console.warn(`[stripe-webhook] referral notification step failed (non-fatal): ${(err as Error)?.message ?? 'unknown'}`);
  }
}

// ── Referral clawback (red-team CRIT-1) ──────────────────────────────────────
// A refunded / disputed / failed qualifying payment reverses the reward:
// clawback_referral claims granted → clawed_back ONCE (a redelivery finds
// status already clawed_back and no-ops) and returns exactly what each party
// received so this code can reverse it. Reversal steps after the claim are
// best-effort with structured logs, for the same reason as the grant path.

/**
 * Deduct a clawed-back credit reward via service_adjust_credits (103): atomic,
 * ledger-first, clamped at zero by the RPC itself (a spent-down balance is
 * deducted as far as it goes and no further — 103's documented semantics).
 *
 * service_adjust_credits audits to admin_actions and therefore requires an
 * elevated ACTOR (profiles.role developer/admin). The webhook is a machine,
 * so it attributes the adjustment to the longest-standing elevated profile —
 * deterministic, and honest in the audit trail (the reason string carries the
 * referral id). No elevated profile at all is a deployment error: logged
 * loudly, remediated manually off the clawed-back referrals row.
 */
async function deductReferralCredits(
  supabase: ReturnType<typeof adminClient>,
  userId: string,
  referralId: string,
): Promise<void> {
  const { data: actor, error: actorErr } = await supabase.from('profiles')
    .select('id')
    .in('role', ['developer', 'admin'])
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (actorErr || !actor?.id) {
    throw new Error(`No elevated actor available for referral credit clawback: ${actorErr?.message ?? 'no developer/admin profile'}`);
  }
  const { error: adjustErr } = await supabase.rpc('service_adjust_credits', {
    actor_user: actor.id,
    target_user: userId,
    delta: -REFERRAL_CREDIT_REWARD,
    reason: `referral_clawback:${referralId}`,
  });
  if (adjustErr) throw new Error(`service_adjust_credits failed: ${adjustErr.message}`);
}

/**
 * Reverse a refunded / charged-back Founder Lifetime purchase. WITHOUT this, a
 * refunded founder kept lifetime premium (handle_premium_downgrade no-ops on
 * founders), kept the 30-credit bonus, and — worst — permanently consumed one of
 * the 30 advertised founder seats (founder_seats_taken() counts is_founder=true),
 * blocking a real paying customer from that now-refunded seat.
 *
 * `key` is one of the charge's resolved clawback keys (the founder checkout
 * SESSION id for a one-time payment). We act ONLY when that session actually
 * granted the founder bonus — its `founder_grant` ledger row names the buyer — so
 * a refund of ANY other charge (a credit pack, a different customer) never touches
 * founder state. Claim-once: the atomic is_founder true→false flip is the claim; a
 * redelivered refund/dispute finds it already false and no-ops, exactly like the
 * referral / dossier clawbacks. Once is_founder is false the standard downgrade
 * path applies (tier→free + the retention window + settlement/map locking), and
 * the bonus is reversed (service_adjust_credits clamps at zero if already spent).
 */
async function clawbackFounderForSession(
  supabase: ReturnType<typeof adminClient>,
  stripeApi: typeof stripe,
  key: string,
): Promise<void> {
  const { data: grantRow, error: grantErr } = await supabase
    .from('credit_ledger')
    .select('user_id')
    .eq('source', 'founder_grant')
    .eq('metadata->>stripe_session_id', key)
    .maybeSingle();
  if (grantErr) throw new Error(`founder clawback lookup failed: ${grantErr.message}`);
  const userId = grantRow?.user_id as string | undefined;
  if (!userId) return; // this key never granted the founder bonus — nothing to reverse.

  // FP-4 (§6.7): BEFORE reversing founder state, abort any LIVE transfer case for this
  // holder's seat (refunding the nominee's $99 if the case was paid — the abort-refund
  // path). Ordered FIRST so the subsequent transfer_case_finalize refuses (wrong_state):
  // otherwise the cooling case would still finalize, handing the just-unwound seat to the
  // nominee AND scheduling a $49.50 payout to the refunded holder (double recovery). The
  // live-state filter makes it idempotent — a redelivery finds no live case and no-ops.
  await abortLiveCaseForClawback(supabase, stripeApi, userId);

  // Claim-once: flip is_founder true→false in one atomic statement. A redelivered
  // refund/dispute finds it already false, claims no row, and no-ops.
  const { data: claimed, error: claimErr } = await supabase
    .from('profiles')
    .update({ is_founder: false })
    .eq('id', userId)
    .eq('is_founder', true)
    .select('id');
  if (claimErr) throw new Error(`founder clawback claim failed: ${claimErr.message}`);
  if (!claimed || claimed.length === 0) return; // already reversed by a prior delivery.

  // is_founder is now false, so the founder-guarded downgrade path applies.
  //
  // POST-CLAIM FAILURE POSTURE (mirrors the referral-clawback note above,
  // finding backend-functions-1): the is_founder flip IS the claim. A thrown
  // error here would release the EVENT claim, but the redelivered refund/dispute
  // finds is_founder already false and returns at the claim check (line 608) — so
  // the downgrade / auth / credit steps would NEVER re-run, permanently stranding
  // a refunded founder at tier=premium with the 30-credit bonus intact. Each step
  // therefore LOGS, not throws, and runs independently of the others' success:
  // the profiles row (is_founder=false while tier still premium) plus these
  // structured logs are the operator's remediation surface, and every step is
  // idempotent / hand-re-runnable (handle_premium_downgrade is founder-guarded off
  // the now-false flag; service_adjust_credits is ledger-atomic + zero-clamped).
  const { error: downgradeErr } = await supabase.rpc('handle_premium_downgrade', { target_user: userId });
  if (downgradeErr) logError('stripe-webhook', userId, downgradeErr.message, { stage: 'founder_clawback_downgrade', key });
  const { error: authErr } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { tier: 'free', is_founder: false },
  });
  if (authErr) logError('stripe-webhook', userId, authErr.message, { stage: 'founder_clawback_auth', key });
  try {
    await deductFounderCredits(supabase, userId, key);
  } catch (err) {
    logError('stripe-webhook', userId, err, { stage: 'founder_clawback_credits', key });
  }

  // SEAT REGISTER (137, §6.1): release the seat back to the unclaimed pool — the
  // mirror of claim_next_founder_seat. Post-claim + log-don't-throw like the steps
  // above: the is_founder flip is the claim, so a redelivered refund/dispute finds it
  // already false, returns at the claim check, and NEVER re-runs this (no double
  // release). release_founder_seat_on_clawback is itself claim-once (a cleared holder
  // no-ops). The fuller "abort any LIVE transfer case for this seat first" interplay
  // (§6.7) lands in M-7; this basic release is the mirror the seat register needs.
  try {
    const { error: seatErr } = await supabase.rpc('release_founder_seat_on_clawback', { p_user: userId });
    if (seatErr) logError('stripe-webhook', userId, seatErr.message, { stage: 'founder_clawback_seat_release', key });
  } catch (err) {
    logError('stripe-webhook', userId, err, { stage: 'founder_clawback_seat_release', key });
  }
}

/**
 * FP-4 (§6.7, family 2): abort any LIVE transfer case for a holder whose ORIGINAL $99 is
 * being goodwill-refunded, refunding the nominee's $99 if that case was already paid. This
 * is the §6.7 "clawback FIRST aborts any live case" ordering that M-7 deferred. Called by
 * clawbackFounderForSession BEFORE the is_founder flip so a subsequent transfer_case_finalize
 * refuses (the case is no longer 'cooling'). Idempotent: the partial-unique live-case filter
 * (one live case per from_user) returns nothing on a redelivery once aborted, so no second
 * abort or refund is attempted; the refund also carries the same `abort-refund-<case>` key
 * as the edge abort path, so even a racing edge abort dedups to ONE Stripe refund.
 * NEVER-throw — a failure here logs and lets the founder reversal proceed.
 */
async function abortLiveCaseForClawback(
  supabase: ReturnType<typeof adminClient>,
  stripeApi: typeof stripe,
  userId: string,
): Promise<void> {
  try {
    const { data: liveCase, error } = await supabase
      .from('founder_transfer_cases')
      .select('id, state, stripe_session_id')
      .eq('from_user', userId)
      .in('state', ['initiated', 'nominee_verified', 'awaiting_payment', 'cooling'])
      .maybeSingle();
    if (error) { logError('stripe-webhook', userId, error.message, { stage: 'founder_clawback_live_case_lookup' }); return; }
    if (!liveCase) return; // no live case for this holder's seat — nothing to abort.

    const { data: aborted, error: aErr } = await supabase.rpc('transfer_case_abort', {
      p_case: liveCase.id, p_actor: 'admin', p_reason: 'goodwill_refund_original',
    });
    if (aErr) { logError('stripe-webhook', userId, aErr.message, { stage: 'founder_clawback_case_abort', case_id: liveCase.id }); return; }

    // Refund the nominee's $99 iff the aborted case was paid (cooling). Same idempotency
    // key as the edge abort-refund path so both dedup to one Stripe refund object.
    if (aborted?.was_paid && aborted?.payment_session) {
      const sess = await stripeApi.checkout.sessions.retrieve(aborted.payment_session as string);
      const pi = typeof sess.payment_intent === 'string' ? sess.payment_intent : sess.payment_intent?.id ?? null;
      if (pi) {
        await stripeApi.refunds.create({ payment_intent: pi }, { idempotencyKey: `abort-refund-${liveCase.id}` });
      } else {
        logError('stripe-webhook', userId, 'aborted transfer case has no payment_intent to refund', { stage: 'founder_clawback_case_refund', case_id: liveCase.id });
      }
    }
  } catch (err) {
    logError('stripe-webhook', userId, err, { stage: 'founder_clawback_case_abort', user_id: userId });
  }
}

/**
 * TRANSFER dispute/refund interplay (§6.7, M-7). A refund/dispute resolving to a
 * TRANSFER checkout session (the case's stripe_session_id) reverses the transfer by
 * its case state — claim-once via the 160 RPCs (a redelivery finds a non-live state
 * and no-ops). NEVER-throw: a mirror failure must not stall the other clawbacks.
 *   - cooling            → abort (chargeback); no seat ever moved.
 *   - finalized, payout not released → reverse; the seat moves BACK.
 *   - finalized, payout released     → flag the seat + loud operator log; the company
 *     is out $49.50 (the 14-day floor covers fast fraud; slow disputes are a support
 *     case). money_events is flipped to 'disputed' by flipMoneyEventStatus on the same key.
 */
async function clawbackTransferForSession(
  supabase: ReturnType<typeof adminClient>,
  key: string,
): Promise<void> {
  const { data: c, error } = await supabase
    .from('founder_transfer_cases')
    .select('id, state, payout_status, seat_id')
    .eq('stripe_session_id', key)
    .maybeSingle();
  if (error) { logError('stripe-webhook', null, error.message, { stage: 'transfer_clawback_lookup', key }); return; }
  if (!c) return; // this key is not a transfer session — nothing to reverse.

  if (c.state === 'cooling') {
    const { error: aErr } = await supabase.rpc('transfer_case_abort', { p_case: c.id, p_actor: 'chargeback', p_reason: 'dispute_or_refund' });
    if (aErr) logError('stripe-webhook', null, aErr.message, { stage: 'transfer_clawback_abort', case_id: c.id });
  } else if (c.state === 'finalized' && c.payout_status !== 'released' && c.payout_status !== 'releasing') {
    const { error: rErr } = await supabase.rpc('transfer_case_reverse', { p_case: c.id, p_reason: 'dispute_or_refund' });
    if (rErr) logError('stripe-webhook', null, rErr.message, { stage: 'transfer_clawback_reverse', case_id: c.id });
  } else if (c.state === 'finalized') {
    // Payout already out — the seat is administratively flagged; recorded accepted-risk.
    const { error: fErr } = await supabase.from('founder_seats').update({ security_status: 'flagged' }).eq('seat_id', c.seat_id);
    if (fErr) logError('stripe-webhook', null, fErr.message, { stage: 'transfer_clawback_flag', case_id: c.id });
    logError('stripe-webhook', null, 'transfer disputed AFTER payout released — seat flagged, company out $49.50 (accepted residual)', { stage: 'transfer_post_payout_dispute', case_id: c.id });
  }
}

/**
 * Reverse the 30-credit founder bonus via service_adjust_credits (103) — atomic,
 * ledger-first, clamped at zero (a spent-down balance is deducted only as far as it
 * goes). Attributed to the longest-standing elevated profile, same as the referral
 * clawback; the reason string carries the session id for the audit trail.
 */
async function deductFounderCredits(
  supabase: ReturnType<typeof adminClient>,
  userId: string,
  sessionId: string,
): Promise<void> {
  const { data: actor, error: actorErr } = await supabase.from('profiles')
    .select('id')
    .in('role', ['developer', 'admin'])
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (actorErr || !actor?.id) {
    throw new Error(`No elevated actor available for founder credit clawback: ${actorErr?.message ?? 'no developer/admin profile'}`);
  }
  const { error: adjustErr } = await supabase.rpc('service_adjust_credits', {
    actor_user: actor.id,
    target_user: userId,
    delta: -FOUNDER_CREDIT_BONUS,
    reason: `founder_clawback:${sessionId}`,
  });
  if (adjustErr) throw new Error(`service_adjust_credits failed: ${adjustErr.message}`);
}

/**
 * Remove the referral discount from a party's Stripe customer — but ONLY when
 * the discount currently sitting there is the recorded referral coupon. An
 * already-consumed coupon (duration 'once' burns on use) leaves no discount,
 * and a DIFFERENT active discount (an operator promo) must not be collateral
 * damage. Missing discount / customer reads (404) are tolerated: the desired
 * end state — no referral discount — already holds.
 */
async function removeReferralDiscountIfPresent(
  supabase: ReturnType<typeof adminClient>,
  stripeApi: typeof stripe,
  userId: string,
  couponId: string,
): Promise<void> {
  const { data: profile } = await supabase.from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .maybeSingle();
  const customerId = (profile?.stripe_customer_id as string | null) ?? null;
  if (!customerId) {
    // The grant recorded a coupon, so a customer existed then; a missing
    // binding now is unusual but not reversible from here. Log and move on.
    console.warn(`[stripe-webhook] referral clawback: user ${userId} has no stripe_customer_id; cannot check discount ${couponId}`);
    return;
  }
  let customer: Stripe.Customer | Stripe.DeletedCustomer;
  try {
    customer = await stripeApi.customers.retrieve(customerId);
  } catch (err) {
    if ((err as { statusCode?: number })?.statusCode === 404
      || (err as { code?: string })?.code === 'resource_missing') return;
    throw err;
  }
  if ((customer as Stripe.DeletedCustomer).deleted) return;
  const activeCoupon = (customer as Stripe.Customer).discount?.coupon?.id ?? null;
  if (activeCoupon !== couponId) return; // consumed or replaced — nothing to remove
  try {
    await stripeApi.customers.deleteDiscount(customerId);
  } catch (err) {
    if ((err as { statusCode?: number })?.statusCode === 404
      || (err as { code?: string })?.code === 'resource_missing') return;
    throw err;
  }
}

/**
 * Claim + reverse the referral keyed by one invoice/session id. Returns true
 * when a granted referral was claimed (so a caller probing several candidate
 * keys can stop). ok:false (no_granted_referral) covers BOTH "this payment
 * never rewarded a referral" and "already clawed back" — idempotent by
 * construction.
 */
async function clawbackReferralByKey(
  supabase: ReturnType<typeof adminClient>,
  stripeApi: typeof stripe,
  invoiceId: string,
): Promise<boolean> {
  const { data: claw, error: clawErr } = await supabase.rpc('clawback_referral', {
    p_invoice_id: invoiceId,
  });
  if (clawErr) {
    // Transport failure BEFORE any claim: throw so Stripe redelivers.
    logError('stripe-webhook', null, clawErr.message, { stage: 'clawback_referral', invoice_id: invoiceId });
    throw new Error(`clawback_referral failed: ${clawErr.message}`);
  }
  if (!claw?.ok) return false;

  console.log(`[stripe-webhook] referral ${claw.referral_id} clawed back on ${invoiceId}`);
  const parties: Array<{ party: ReferralParty; userId: string; reward: string | null; coupon: string | null }> = [
    { party: 'referrer', userId: claw.referrer_user_id as string, reward: claw.referrer_reward ?? null, coupon: claw.referrer_coupon_applied ?? null },
    { party: 'referee', userId: claw.referee_user_id as string, reward: claw.referee_reward ?? null, coupon: claw.referee_coupon_applied ?? null },
  ];
  for (const p of parties) {
    try {
      if (p.coupon) {
        await removeReferralDiscountIfPresent(supabase, stripeApi, p.userId, p.coupon);
      } else if (p.reward === 'credits_10') {
        await deductReferralCredits(supabase, p.userId, claw.referral_id as string);
      }
      // reward null = that party's grant step never landed → nothing to reverse.
    } catch (err) {
      // Post-claim: the flip already happened, and a redelivery would no-op —
      // so log for the operator instead of throwing away the other party's
      // reversal. The clawed-back referrals row records what was owed.
      logError('stripe-webhook', p.userId, err, {
        stage: 'referral_clawback', referral_id: claw.referral_id, party: p.party,
      });
    }
  }
  return true;
}

/**
 * Resolve the invoice/session ids a charge-level event (refund / dispute)
 * could have rewarded under. A subscription charge carries its invoice id; a
 * founder checkout charge carries none, so its checkout session is looked up
 * by payment_intent (the session id was the grant's claim key). Most refunds
 * touch payments that never rewarded a referral — those keys simply read
 * no_granted_referral downstream.
 */
async function resolveChargeClawbackKeys(
  event: Stripe.Event,
  stripeApi: typeof stripe,
): Promise<string[]> {
  let charge: Stripe.Charge | null;
  if (event.type === 'charge.dispute.created') {
    const dispute = event.data.object as Stripe.Dispute;
    charge = typeof dispute.charge === 'string'
      ? await stripeApi.charges.retrieve(dispute.charge)
      : dispute.charge;
  } else {
    charge = event.data.object as Stripe.Charge;
  }
  if (!charge) return [];

  const invoiceId = typeof charge.invoice === 'string' ? charge.invoice : charge.invoice?.id ?? null;
  if (invoiceId) return [invoiceId];

  const paymentIntent = typeof charge.payment_intent === 'string'
    ? charge.payment_intent
    : charge.payment_intent?.id ?? null;
  if (!paymentIntent) return [];
  const sessions = await stripeApi.checkout.sessions.list({ payment_intent: paymentIntent, limit: 1 });
  const sessionId = sessions?.data?.[0]?.id;
  return sessionId ? [sessionId] : [];
}

/** The named reversal classes a charge-level event can carry (Wave 8 H20/M22). */
export type ChargeReversalClass = 'full_refund' | 'partial_refund' | 'dispute';

/**
 * Name the reversal class of a charge.refunded / charge.dispute.created event:
 * 'dispute' for dispute events; for refunds, amount_refunded vs amount decides
 * 'partial_refund' (walked back in part) vs 'full_refund'. Classification is
 * OBSERVATIONAL ONLY — BY POLICY (red-team CRIT-1, ruling 2026-07-26) every
 * class routes to the SAME full clawback lattice; goodwill flows are credit
 * GRANTS, never partial refunds, so no partial-clawback path exists. NEVER
 * throws: any ambiguity (missing/odd amounts, unexpected shape) defaults to
 * 'full_refund' semantics — which is what every class receives anyway.
 *
 * The optional `charge` lets a caller that already retrieved the dispute's
 * charge refine a future class without a second fetch; the default reads the
 * event's own object (for charge.refunded, that IS the charge).
 */
export function classifyChargeReversal(
  event: Stripe.Event,
  charge?: Stripe.Charge | null,
): ChargeReversalClass {
  try {
    if (event.type === 'charge.dispute.created') return 'dispute';
    const c = charge ?? (event.data.object as Stripe.Charge);
    const refunded = typeof c?.amount_refunded === 'number' ? c.amount_refunded : null;
    const total = typeof c?.amount === 'number' ? c.amount : null;
    if (refunded !== null && total !== null && refunded > 0 && refunded < total) {
      return 'partial_refund';
    }
    return 'full_refund';
  } catch {
    return 'full_refund';
  }
}

// ── Redeem codes (migration 107) ─────────────────────────────────────────────
//
// create-checkout reserved the seat (reserve_redemption) and stamped the
// session id (bind_redemption_session). When the PAID session completes,
// apply_redemption flips reserved → applied exactly once — that flip is the
// AUTHORITATIVE claim for this money: system_grant_credits takes NO atomic
// claim for source 'redeem_code' (024's delivery-key list), so the RPC's
// claim-once plus the ledger pre-check in grantCreditsForSessionOnce carry
// the idempotency, mirroring the referral_reward discipline exactly.
//
//   * kind='credits'    → grant credit_amount through the same idempotent
//                         session-scoped path the credit packs use.
//   * kind='free_month' → no DB action here: the 100%-off coupon already rode
//                         the checkout session itself (server-attached by
//                         create-checkout; never allow_promotion_codes).
//
// FAILURE POSTURE (mirrors the referral grant): a TRANSPORT failure on the
// apply RPC throws (non-2xx → Stripe redelivers; nothing was claimed). A
// credits-grant failure AFTER the claim logs instead of throwing — the
// redelivered event would read no_reserved_redemption and never re-run the
// grant, so the throw buys no retry; the applied redemptions row with no
// matching credit_ledger row is the operator's remediation surface.
//
// RED-TEAM NOTE: a session carrying a redeem discount can complete at $0.
// That must fulfil the PURCHASE (the customer legitimately paid with the
// code) but must never mint a REFERRAL reward — the amount_paid > 0 /
// amount_total > 0 gates on the referral path (re-asserted inside
// grant_referral) enforce that; the execution test pins it.

/**
 * Flip the session's reserved redemption (if any) and grant a credits-kind
 * code. The overwhelmingly common case — a session that never carried a
 * redeem code — reads no_reserved_redemption and no-ops.
 */
async function applyRedemptionIfBound(
  supabase: ReturnType<typeof adminClient>,
  sessionId: string,
): Promise<void> {
  const { data: redemption, error: applyErr } = await supabase.rpc('apply_redemption', {
    p_session_id: sessionId,
  });
  if (applyErr) {
    // Transport failure BEFORE any claim: throw so Stripe redelivers.
    logError('stripe-webhook', null, applyErr.message, { stage: 'apply_redemption', session_id: sessionId });
    throw new Error(`apply_redemption failed: ${applyErr.message}`);
  }
  if (!redemption?.ok) return;

  console.log(`[stripe-webhook] redemption ${redemption.redemption_id} applied on session ${sessionId} (kind ${redemption.kind})`);
  if (redemption.kind !== 'credits') return; // free_month: the coupon rode the session

  const userId = (redemption.user_id as string | null) ?? null;
  const creditAmount = typeof redemption.credit_amount === 'number' ? redemption.credit_amount : 0;
  if (!userId || creditAmount <= 0) {
    // Barred by the redeem_codes shape constraints (a credits code must carry
    // a positive amount), so reaching this means the code row was mutated out
    // of band. The claim already flipped — log loudly for the operator.
    logError('stripe-webhook', userId, 'credits redemption with no grantable amount', {
      stage: 'redeem_grant', redemption_id: redemption.redemption_id,
    });
    return;
  }
  try {
    await grantCreditsForSessionOnce(supabase, userId, creditAmount, 'redeem_code', sessionId);
  } catch (err) {
    // Post-claim: log, don't throw (see the failure-posture note above).
    logError('stripe-webhook', userId, err, {
      stage: 'redeem_grant', redemption_id: redemption.redemption_id,
    });
  }
}

// The durable single-dossier export-rights helpers (migration 108) are defined
// BELOW handleStripeWebhook, next to dispatchStripeEvent that calls them — so the
// FIRST lexical session-metadata read stays AFTER the signature check (the Tier
// 0.5 signature-order contract test asserts on textual position). They only ever
// run from the dispatch switch, i.e. after the event signature is verified.

// ── Trust boundary documentation (Tier 0.5 audit) ──────────────────────────
//
// EVERY METADATA READ BELOW IS ONLY SAFE BECAUSE:
//
//   1. We require a stripe-signature header AND verify it against
//      STRIPE_WEBHOOK_SECRET via stripe.webhooks.constructEvent. Without
//      this, an attacker could POST a fake session.completed event with
//      any metadata they like.
//
//   2. The METADATA POPULATED in session.metadata is set ONLY by
//      `create-checkout/index.ts`, which:
//        a. requires a Supabase JWT (line 107 in create-checkout)
//        b. uses `user.id` from the server-verified JWT for
//           `metadata.supabase_user_id` — NOT from the request body.
//           So a user cannot upgrade someone else's account.
//        c. validates `product` against the server-controlled PRICE_MAP
//           before passing it into metadata. So a user cannot smuggle
//           a fake product (e.g. trick the webhook into the
//           `founder_lifetime` branch via a credit pack purchase).
//        d. computes `credits` from the server-side CREDIT_AMOUNTS
//           map, NOT from the request body.
//
//   3. Manual Stripe-dashboard invoice creation could in principle
//      populate arbitrary metadata, but that requires operator-level
//      Stripe access. Not a user-attackable vector.
//
// If you ADD a new entry point that creates Stripe checkout sessions,
// it MUST follow the same pattern. Otherwise the trust chain breaks.
// The contract test in tests/edgeFunctions/contracts.test.js
// (Tier 0.5 — webhook trust boundaries) locks this in.

// Exported (not just inlined into serve) so the trust boundary can be
// EXECUTION-tested: index.test.ts feeds forged vs. correctly-signed requests and
// asserts no DB write happens before signature verification. `deps.adminClient`
// is an optional injection seam for the test's recording stub; production passes
// nothing, so behavior is identical to the previous inline handler.
export async function handleStripeWebhook(
  req: Request,
  deps: {
    adminClient?: typeof adminClient;
    stripeClient?: typeof stripe;
    // Test seam for the referral notification sender only — the money path
    // never depends on it (emails are fire-and-forget by contract).
    referralEmailDispatch?: ReferralEmailDispatch;
  } = {},
): Promise<Response> {
  // Injection seam for the live-subscription-status check in the premium branch
  // (tests stub subscriptions.retrieve); production passes nothing.
  const stripeApi = deps.stripeClient ?? stripe;
  // ── Signature verification — MUST run before any metadata read ─────
  const signature = req.headers.get('stripe-signature');
  if (!signature) return new Response('Missing signature', { status: 400 });

  let event: Stripe.Event;
  try {
    const body = await req.text();
    // Deno has no synchronous crypto: the sync constructEvent throws at runtime in
    // Edge Functions. Use the async verifier with the SubtleCrypto provider.
    event = await stripe.webhooks.constructEventAsync(
      body, signature, webhookSecret, undefined, Stripe.createSubtleCryptoProvider(),
    );
  } catch (err) {
    logError('stripe-webhook', null, err, { stage: 'signature_verification' });
    return new Response('Invalid signature', { status: 400 });
  }

  const supabase = (deps.adminClient ?? adminClient)();

  // ── Crash-recoverable event-level idempotency claim (107/181) ───────
  // This call MUST remain after signature verification. Every grant below keeps
  // its authoritative per-grant claim; the event lease is the outer belt that
  // prevents duplicate execution and makes an interrupted handler reclaimable.
  const eventClaim = await claimStripeWebhookEvent(
    supabase,
    event.id,
    event.type,
  );
  if (eventClaim.status === 'in_progress') {
    return new Response('[in-progress]', {
      status: 409,
      headers: eventClaim.retryAfterSeconds
        ? { 'Retry-After': String(eventClaim.retryAfterSeconds) }
        : undefined,
    });
  }
  if (eventClaim.status === 'duplicate') {
    console.log(
      `[stripe-webhook] event ${event.id} already processed — skipping (duplicate delivery)`,
    );
    return new Response('[duplicate]', { status: 200 });
  }

  try {
    await dispatchStripeEvent(event, supabase, stripeApi, deps.referralEmailDispatch);
    await completeStripeWebhookEvent(supabase, event.id, eventClaim);
  } catch (handlerErr) {
    // A handler failure must keep Stripe's retry loop alive: every `throw`
    // inside the handlers exists precisely so a non-2xx makes Stripe
    // redeliver. Holding the claim here would turn that redelivery into
    // '[duplicate]' and silently drop the fulfillment — so release the claim
    // (best-effort) before rethrowing. If the release itself fails we warn
    // and still rethrow; the operator sees the failure in Stripe's dashboard
    // either way, and a manual resend after fixing the claim row recovers.
    const releaseError = await releaseStripeWebhookEvent(
      supabase,
      event.id,
      eventClaim,
    );
    if (releaseError) {
      console.warn(
        `[stripe-webhook] failed to release event claim ${event.id} after handler error `
          + `(${releaseError}); the stale lease remains reclaimable`,
      );
    }
    throw handlerErr;
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// ── Durable single-dossier export rights (migration 108) ─────────────────────
//
// Defined here (after handleStripeWebhook / constructEvent, next to the dispatch
// switch that calls them) so the FIRST lexical `session.metadata?.` read in this
// file stays AFTER signature verification — the Tier 0.5 trust-boundary contract
// test asserts on textual order. These helpers run ONLY from dispatchStripeEvent,
// i.e. strictly after constructEvent has verified the signature.
//
// PDF export moves to a ladder (user-locked): a signed-in $2.99 single_dossier
// purchase mints a DURABLE re-download right bound to one SAVED settlement; an
// anonymous $2.99 purchase stays a one-shot download but is RECORDED as a
// same-device token-claim voucher (the retro upgrade is same-device + same-
// settlement + automatic only — the original device still holds the checkout
// token in its purchase stash, and a silent post-save call claims the right).
//
// This webhook is the ONLY writer on both value-moving paths:
//   * SIGNED-IN paid single_dossier session carrying supabase_user_id + save_id
//     → grant_dossier_entitlement mints the durable right (claim-once on
//       stripe_session_id). A grant failure must NOT break fulfilment — the
//       one-shot download (client verify-single-dossier flow) is unchanged, so a
//       failed durable grant is logged and the operator remediates off the
//       (missing) entitlement row; throwing here would only strand the whole
//       session in Stripe's retry loop for a right the buyer can still retro-claim.
//   * ANONYMOUS paid single_dossier session (metadata.anonymous === 'true')
//     → record single_dossier_purchases: the sha256 of the checkout token so the
//       same-device token-claim path can prove the original buyer WITHOUT ever
//       storing the token, plus the buyer's Stripe email (lowercased) for AUDIT /
//       SUPPORT ONLY (no claim path reads it). Idempotent (PK = stripe_session_id,
//       upsert ignoreDuplicates), so a redelivery re-inserts nothing. Stripe may
//       return no email on a session (rare); we still record when a token hash is
//       present — the email is audit-only, so its absence never blocks the claim
//       voucher. A record failure never fails fulfilment of a paid one-shot download.
//   * REFUND / dispute of a single_dossier charge (charge.refunded /
//     charge.dispute.created) → clawback_dossier_entitlement reverses the durable
//     right AND poisons the purchase voucher so it can never be retro-claimed
//     (even the anonymous-refund case where no entitlement was ever minted). Wired
//     into the EXISTING referral clawback resolver, keyed by the same session id.

/** sha256 hex of a string (crypto.subtle, the ingest-events idiom). Used to hash
 *  the anonymous checkout token before it is stored — the raw token never lands. */
async function sha256hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * SIGNED-IN single_dossier grant: mint the durable export right on the paid
 * session. Validates nothing itself — grant_dossier_entitlement re-checks that
 * the save exists AND belongs to the user ("save it first"), and is claim-once on
 * the session id. NEVER throws into the fulfilment path: a grant failure is logged
 * and swallowed (see the failure posture above).
 */
async function grantDossierEntitlementForSession(
  supabase: ReturnType<typeof adminClient>,
  userId: string,
  saveId: string,
  sessionId: string,
): Promise<void> {
  try {
    const { data: grant, error: grantErr } = await supabase.rpc('grant_dossier_entitlement', {
      p_user: userId,
      p_save_id: saveId,
      p_session_id: sessionId,
      p_source: 'purchase',
    });
    if (grantErr) {
      logError('stripe-webhook', userId, grantErr.message, {
        stage: 'grant_dossier_entitlement', session_id: sessionId, save_id: saveId,
      });
      return;
    }
    if (!grant?.ok) {
      // save_not_found / already_entitled / invalid_source — a business reason,
      // not a transport failure. The one-shot download still worked; log so the
      // operator can see a durable right that could not attach.
      logError('stripe-webhook', userId, `grant_dossier_entitlement declined: ${grant?.reason ?? 'unknown'}`, {
        stage: 'grant_dossier_entitlement', session_id: sessionId, save_id: saveId,
      });
      return;
    }
    console.log(`[stripe-webhook] dossier entitlement ${grant.entitlement_id} granted on session ${sessionId} (user ${userId}, save ${saveId}, already_existed=${grant.already_existed})`);
  } catch (err) {
    // Post-fulfilment convenience path: never let it reach the throw that would
    // stall the whole session's retry loop.
    logError('stripe-webhook', userId, err, {
      stage: 'grant_dossier_entitlement', session_id: sessionId, save_id: saveId,
    });
  }
}

/**
 * ANONYMOUS single_dossier purchase: record the same-device token-claim voucher.
 * The checkout_token_hash (sha256 of metadata.checkout_token, NEVER the token) is
 * the load-bearing proof for the retro claim; buyer_email_lower is recorded for
 * AUDIT / SUPPORT ONLY (no claim path reads it). Also writes amount_cents
 * (session.amount_total). Idempotent on the session id (PK) via upsert
 * ignoreDuplicates. NEVER throws: absence of a token (nothing to claim against)
 * skips the record with a warning; an insert error is logged. This is a
 * convenience ledger — its absence must never fail a paid one-shot download.
 */
async function recordAnonymousDossierPurchase(
  supabase: ReturnType<typeof adminClient>,
  session: Stripe.Checkout.Session,
): Promise<void> {
  const rawToken = session.metadata?.checkout_token ?? '';
  if (!rawToken) {
    // No checkout token on this session → the same-device claim has no proof to
    // verify against, so there is nothing to record. The one-shot download still
    // works (it verifies against the session, not this row). Warn, never throw.
    console.warn(`[stripe-webhook] anonymous single_dossier session ${session.id} has no checkout token — skipping token-claim record`);
    return;
  }
  const checkoutTokenHash = await sha256hex(rawToken);

  // Audit/support-only. Stripe may return no email on a session (rare); an empty
  // string satisfies the NOT NULL column and is honest — no claim path reads it.
  const rawEmail = session.customer_details?.email ?? null;
  const buyerEmailLower = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';
  const amountCents = typeof session.amount_total === 'number' ? session.amount_total : null;

  const { error: insertErr } = await supabase
    .from('single_dossier_purchases')
    .upsert(
      {
        stripe_session_id: session.id,
        buyer_email_lower: buyerEmailLower,
        checkout_token_hash: checkoutTokenHash,
        amount_cents: amountCents,
      },
      // PK = stripe_session_id: a redelivery of the same paid session re-inserts
      // nothing (ON CONFLICT DO NOTHING). Never overwrite — the first record is
      // the paid truth; a later delivery must not flip a claimed/refunded row.
      { onConflict: 'stripe_session_id', ignoreDuplicates: true },
    );
  if (insertErr) {
    // A failed voucher record is not fatal: the paid download already worked, and
    // the buyer can still retro-claim once the operator repairs the ledger.
    logError('stripe-webhook', null, insertErr.message, {
      stage: 'record_single_dossier_purchase', session_id: session.id,
    });
    return;
  }
  console.log(`[stripe-webhook] anonymous single_dossier purchase recorded for retro-claim: session=${session.id}`);
}

/**
 * Reverse a refunded/disputed single_dossier durable right and poison its voucher.
 * clawback_dossier_entitlement flips the purchase row to 'refunded' UNCONDITIONALLY
 * (so an anonymous-refund can never be claimed even when no entitlement existed)
 * and claims the active entitlement → clawed_back atomically. Idempotent + tolerant
 * of absence (a session that never held a right returns entitlement_id:null).
 * Best-effort like the referral clawback: a transport failure throws so Stripe
 * redelivers; a business no-op is silent.
 */
async function clawbackDossierEntitlementForSession(
  supabase: ReturnType<typeof adminClient>,
  sessionId: string,
): Promise<void> {
  const { data: claw, error: clawErr } = await supabase.rpc('clawback_dossier_entitlement', {
    p_session_id: sessionId,
  });
  if (clawErr) {
    logError('stripe-webhook', null, clawErr.message, { stage: 'clawback_dossier_entitlement', session_id: sessionId });
    throw new Error(`clawback_dossier_entitlement failed: ${clawErr.message}`);
  }
  if (claw?.ok && claw.entitlement_id) {
    console.log(`[stripe-webhook] dossier entitlement ${claw.entitlement_id} clawed back on session ${sessionId}`);
  }
}

/**
 * CREDIT-PACK clawback (Wave 8 M2): a refunded/disputed credit-pack charge
 * reverses the FULL granted amount through the narrow system_clawback_credits
 * RPC (migration 190) — one atomic transaction that claims once per session key
 * (mirroring the grant's own delivery claim), writes the reversal ledger row,
 * and refreshes the cache. The balance MAY go negative: the debt nets against
 * future grants (ruling 2026-07-26; goodwill flows are credit GRANTS, never
 * partial refunds). Run for EVERY candidate key like the dossier clawback —
 * a key that never granted a pack reads no_pack_grant and no-ops; a redelivery
 * reads already_clawed_back and no-ops. A transport failure THROWS so Stripe
 * redelivers: the RPC is one transaction, so an error means nothing committed
 * and the retry loses no claim (the dossier/referral posture, NOT the
 * flipMoneyEventStatus never-throw — this step moves real money).
 */
async function clawbackCreditPackForSession(
  supabase: ReturnType<typeof adminClient>,
  sessionId: string,
  reversalClass: ChargeReversalClass,
): Promise<void> {
  const { data: claw, error: clawErr } = await supabase.rpc('system_clawback_credits', {
    p_session_id: sessionId,
    p_reason: reversalClass,
  });
  if (clawErr) {
    logError('stripe-webhook', null, clawErr.message, { stage: 'clawback_credit_pack', session_id: sessionId });
    throw new Error(`system_clawback_credits failed: ${clawErr.message}`);
  }
  if (claw?.ok) {
    console.log(`[stripe-webhook] credit pack clawed back on session ${sessionId}: ${claw.amount} credits reversed for user ${claw.user_id} (balance ${claw.prev} -> ${claw.next})`);
  }
}

// ── The money ledger mirror (156, DESIGN_MONEY_WAVE §2) ──────────────────────
//
// Every successful money movement mirrors ONE row into money_events (the purchase
// ledger reads it). Defined here (below handleStripeWebhook, with the 108 set) so
// this file's signature-first textual order is untouched — none of these helpers
// read session.metadata, and they run only from dispatchStripeEvent (after the
// signature is verified). EVERY writer is NEVER-THROW into the money path: a mirror
// failure logs via logError and must not stall fulfillment (the referralEmails /
// dossier-voucher posture). event_key is the redelivery shield — the upsert
// ignoreDuplicates makes a replayed webhook re-insert nothing.
type MoneyEventKind =
  | 'credit_pack' | 'founder_seat' | 'single_dossier'
  | 'subscription_start' | 'subscription_renewal'
  | 'surveyor_start' | 'surveyor_renewal' | 'auto_reload'
  | 'seat_transfer_payment' | 'seat_transfer_payout' | 'refund_note';

/** Server-composed, human-readable description for a mirrored row (NOT NULL). The
 *  UI maps kind→label itself (purchaseHistory.js); this is the durable audit text. */
function describeMoneyKind(kind: MoneyEventKind, extra: { credits?: number } = {}): string {
  switch (kind) {
    case 'credit_pack': return extra.credits ? `Credit pack (${extra.credits} credits)` : 'Credit pack';
    case 'founder_seat': return 'Founder Lifetime seat';
    case 'single_dossier': return 'Single dossier export';
    case 'subscription_start': return 'Cartographer subscription';
    case 'subscription_renewal': return 'Cartographer subscription renewal';
    case 'surveyor_start': return 'Surveyor subscription';
    case 'surveyor_renewal': return 'Surveyor subscription renewal';
    case 'auto_reload': return 'AI credit auto-reload';
    case 'seat_transfer_payment': return 'Founder seat transfer';
    case 'seat_transfer_payout': return 'Founder seat transfer payout';
    case 'refund_note': return 'Refund note';
    default: return 'Purchase';
  }
}

interface MoneyEventRow {
  event_key: string;
  user_id: string | null;
  occurred_at: string;
  kind: MoneyEventKind;
  amount_cents: number;
  currency: string;
  description: string;
  receipt_url: string | null;
  status?: 'paid' | 'refunded' | 'disputed' | 'reversed';   // default 'paid'; a refund_note sets 'refunded'
  stripe_session_id?: string | null;
  stripe_invoice_id?: string | null;
  stripe_payment_intent_id?: string | null;
  stripe_charge_id?: string | null;
  metadata?: Record<string, unknown>;
}

/** Upsert one money_events row, deduped on event_key (a replayed webhook re-inserts
 *  nothing). NEVER throws — a mirror-write failure is logged, not propagated. */
async function writeMoneyEvent(
  supabase: ReturnType<typeof adminClient>,
  row: MoneyEventRow,
): Promise<void> {
  try {
    const { error } = await supabase
      .from('money_events')
      .upsert(row, { onConflict: 'event_key', ignoreDuplicates: true });
    if (error) {
      logError('stripe-webhook', row.user_id, error.message, { stage: 'write_money_event', event_key: row.event_key });
    }
  } catch (err) {
    logError('stripe-webhook', row.user_id, err, { stage: 'write_money_event', event_key: row.event_key });
  }
}

/** Retrieve a one-time payment's hosted receipt via payment_intent → latest_charge.
 *  One extra Stripe call on the fulfillment path; the caller isolates it so a miss
 *  leaves receipt_url NULL (honest degradation) without dropping the ledger row. */
async function captureChargeReceipt(
  stripeApi: typeof stripe,
  paymentIntentId: string,
): Promise<{ receiptUrl: string | null; chargeId: string | null }> {
  const pi = await stripeApi.paymentIntents.retrieve(paymentIntentId, { expand: ['latest_charge'] });
  const charge = pi?.latest_charge;
  if (charge && typeof charge === 'object') {
    return { receiptUrl: (charge as Stripe.Charge).receipt_url ?? null, chargeId: (charge as Stripe.Charge).id ?? null };
  }
  return { receiptUrl: null, chargeId: null };
}

/** Mirror ONE checkout fulfillment into money_events (event_key sess:{id}). One-time
 *  products capture the charge receipt (payment_intent → latest_charge); subscription
 *  starts capture the hosted invoice receipt (session.invoice). Subscriptions are
 *  mirrored HERE (the *_start row); their renewals come from invoice.paid on
 *  billing_reason='subscription_cycle', so a Checkout-created subscription — which
 *  fires BOTH completed AND a subscription_create invoice — is never double-counted. */
async function mirrorCheckoutMoneyEvent(
  supabase: ReturnType<typeof adminClient>,
  stripeApi: typeof stripe,
  session: Stripe.Checkout.Session,
  kind: MoneyEventKind,
  userId: string | null,
  credits: number,
): Promise<void> {
  try {
    const isSubscription = kind === 'subscription_start' || kind === 'surveyor_start';
    const paymentIntentId = typeof session.payment_intent === 'string'
      ? session.payment_intent : session.payment_intent?.id ?? null;
    const invoiceId = typeof session.invoice === 'string'
      ? session.invoice : session.invoice?.id ?? null;

    let receiptUrl: string | null = null;
    let chargeId: string | null = null;
    try {
      if (isSubscription && invoiceId) {
        const inv = await stripeApi.invoices.retrieve(invoiceId);
        receiptUrl = inv?.hosted_invoice_url ?? null;
        chargeId = typeof inv?.charge === 'string' ? inv.charge : (inv?.charge as Stripe.Charge | null)?.id ?? null;
      } else if (!isSubscription && paymentIntentId) {
        const cap = await captureChargeReceipt(stripeApi, paymentIntentId);
        receiptUrl = cap.receiptUrl;
        chargeId = cap.chargeId;
      }
    } catch (recErr) {
      // Receipt is optional — a miss leaves the column NULL and the UI shows no
      // link (honest degradation). Log, still write the row.
      logError('stripe-webhook', userId, recErr, { stage: 'mirror_receipt_capture', session_id: session.id });
    }

    await writeMoneyEvent(supabase, {
      event_key: `sess:${session.id}`,
      user_id: userId,
      occurred_at: new Date().toISOString(),
      kind,
      amount_cents: typeof session.amount_total === 'number' ? session.amount_total : 0,
      currency: session.currency ?? 'usd',
      description: describeMoneyKind(kind, { credits }),
      receipt_url: receiptUrl,
      stripe_session_id: session.id,
      stripe_invoice_id: invoiceId,
      stripe_payment_intent_id: paymentIntentId,
      stripe_charge_id: chargeId,
    });
  } catch (err) {
    logError('stripe-webhook', userId, err, { stage: 'mirror_checkout_money_event', session_id: session.id, kind });
  }
}

/** Mirror a subscription RENEWAL invoice into money_events (event_key inv:{id}). The
 *  hosted invoice url is the permanent receipt. NEVER throws. */
async function mirrorInvoiceMoneyEvent(
  supabase: ReturnType<typeof adminClient>,
  invoice: Stripe.Invoice,
  userId: string,
  kind: MoneyEventKind,
): Promise<void> {
  try {
    await writeMoneyEvent(supabase, {
      event_key: `inv:${invoice.id}`,
      user_id: userId,
      occurred_at: new Date().toISOString(),
      kind,
      amount_cents: typeof invoice.amount_paid === 'number' ? invoice.amount_paid : 0,
      currency: invoice.currency ?? 'usd',
      description: describeMoneyKind(kind),
      receipt_url: invoice.hosted_invoice_url ?? null,
      stripe_invoice_id: invoice.id,
      stripe_payment_intent_id: typeof invoice.payment_intent === 'string'
        ? invoice.payment_intent : invoice.payment_intent?.id ?? null,
      stripe_charge_id: typeof invoice.charge === 'string'
        ? invoice.charge : (invoice.charge as Stripe.Charge | null)?.id ?? null,
    });
  } catch (err) {
    logError('stripe-webhook', userId, err, { stage: 'mirror_invoice_money_event', invoice_id: invoice.id, kind });
  }
}

/** Flip the mirrored row's status on a refund/dispute. Keyed on the SAME candidate
 *  keys resolveChargeClawbackKeys already computes (sess:/inv: forms) — the one
 *  sanctioned mutation on money_events. NEVER throws (a status-mirror failure must
 *  not stall the referral/dossier/founder clawbacks running alongside it). */
async function flipMoneyEventStatus(
  supabase: ReturnType<typeof adminClient>,
  keys: string[],
  status: 'refunded' | 'disputed',
): Promise<void> {
  if (keys.length === 0) return;
  try {
    const eventKeys = keys.flatMap((k) => [`sess:${k}`, `inv:${k}`]);
    const { error } = await supabase
      .from('money_events')
      .update({ status })
      .in('event_key', eventKeys);
    if (error) {
      logError('stripe-webhook', null, error.message, { stage: 'flip_money_event_status', status });
    }
  } catch (err) {
    logError('stripe-webhook', null, err, { stage: 'flip_money_event_status', status });
  }
}

/**
 * FP-2 (§6.8 family 8 / §6.6): refund a $99 transfer charge that COMPLETED for a case
 * that is no longer awaiting_payment. transfer_case_mark_paid no-opped (wrong_state), so
 * the seat never moved for THIS session — the nominee's charge is orphaned and must be
 * returned. The ONE exception is a redelivery of the session that LEGITIMATELY paid the
 * case (paid_at set AND stripe_session_id === this session): that money bought the cooling
 * seat and must NOT be clawed back. Redelivery-safe by construction: the Stripe
 * idempotencyKey dedups the refund and the money_events event_key dedups the note, so a
 * replay re-sends the same refund request and re-inserts no row. NEVER-throw — a
 * refund/mirror failure must not turn the ack into a redelivery loop that keeps
 * re-completing the same charge (the operator log is the remediation surface).
 */
async function refundOrphanedTransferCharge(
  supabase: ReturnType<typeof adminClient>,
  stripeApi: typeof stripe,
  session: Stripe.Checkout.Session,
  caseId: string,
  reason: string,
): Promise<void> {
  const userId = session.metadata?.supabase_user_id ?? null;
  try {
    // Only refund when THIS session did not legitimately pay the case. A found case whose
    // paid_at is set AND whose bound session IS this one is the seat-buying payment
    // (redelivered) — leave it. An absent case row means the $99 has no valid home → refund.
    const { data: c, error: cErr } = await supabase
      .from('founder_transfer_cases')
      .select('paid_at, stripe_session_id')
      .eq('id', caseId)
      .maybeSingle();
    if (cErr) { logError('stripe-webhook', userId, cErr.message, { stage: 'transfer_orphan_lookup', session_id: session.id, case_id: caseId }); return; }
    const paidByThisSession = !!c && c.paid_at != null && c.stripe_session_id === session.id;
    if (paidByThisSession) {
      console.log(`[stripe-webhook] transfer session ${session.id} mark_paid no-op (${reason}) — this session legitimately paid case ${caseId}; NOT refunding`);
      return;
    }

    // Resolve the charge's payment_intent and refund it, idempotency-keyed on the session.
    const full = await stripeApi.checkout.sessions.retrieve(session.id);
    const pi = typeof full.payment_intent === 'string' ? full.payment_intent : full.payment_intent?.id ?? null;
    if (pi) {
      await stripeApi.refunds.create({ payment_intent: pi }, { idempotencyKey: `transfer-orphan-refund-${session.id}` });
      console.log(`[stripe-webhook] orphaned transfer session ${session.id} (case ${caseId}, ${reason}) refunded`);
    } else {
      logError('stripe-webhook', userId, 'orphaned transfer charge has no payment_intent to refund', { stage: 'transfer_orphan_refund', session_id: session.id, case_id: caseId });
    }

    // Mirror a refund_note into the money ledger (redelivery-safe via the event_key upsert).
    await writeMoneyEvent(supabase, {
      event_key: `refund:transfer-orphan:${session.id}`,
      user_id: userId,
      occurred_at: new Date().toISOString(),
      kind: 'refund_note',
      amount_cents: typeof session.amount_total === 'number' ? session.amount_total : 0,
      currency: session.currency ?? 'usd',
      description: describeMoneyKind('refund_note'),
      receipt_url: null,
      status: 'refunded',
      stripe_session_id: session.id,
      stripe_payment_intent_id: pi,
      metadata: { reason: 'transfer_orphan_refund', transfer_case_id: caseId, mark_paid_reason: reason },
    });
  } catch (err) {
    logError('stripe-webhook', userId, err, { stage: 'transfer_orphan_refund', session_id: session.id, case_id: caseId });
  }
}

// ── Auto-reload payment identity (migration 158) ─────────────────────────────
//
// These helpers validate the immutable attempt/PaymentIntent tuple before any
// credit grant. Fulfillment handlers live below the durable-refund and
// inactive-account sections because they depend on both.
//
// The off-session PaymentIntent's create result is NOT trusted for the grant.
// Stripe can deliver the succeeded event before _shared/autoReload.ts resumes
// from confirm=true and stamps the PI id, so metadata.attempt_id is the primary
// lookup and the row's user/credits/amount are re-validated before any grant.
// The WEBHOOK is authoritative:
//   payment_intent.succeeded (purpose credit_auto_reload) → grant credits (atomic
//     per-PI claim via system_grant_credits 'auto_reload' key → exactly once
//     across redelivery) → attempt 'succeeded' (claim-once) → money_events row.
//   payment_intent.payment_failed → attempt 'failed' + reason.

type AutoReloadAttempt = {
  id: string;
  user_id: string;
  state: string;
  credits_delta: number;
  amount_cents: number;
  stripe_payment_intent_id: string | null;
};

const AUTO_RELOAD_SUCCESS_TRANSITION_STATES = ['pending', 'requires_action', 'failed', 'canceled'];
const AUTO_RELOAD_FAILURE_TRANSITION_STATES = ['pending', 'requires_action', 'failed'];

function positiveMetadataInteger(raw: string | undefined): number | null {
  if (!raw || !/^[1-9]\d*$/.test(raw)) return null;
  const value = Number(raw);
  return Number.isSafeInteger(value) ? value : null;
}

async function readAutoReloadAttempt(
  supabase: ReturnType<typeof adminClient>,
  attemptId: string,
  stage: string,
): Promise<AutoReloadAttempt | null> {
  const { data, error } = await supabase
    .from('credit_auto_reload_attempts')
    .select('id, user_id, state, credits_delta, amount_cents, stripe_payment_intent_id')
    .eq('id', attemptId)
    .maybeSingle();
  if (error) throw new Error(`${stage} attempt lookup failed: ${error.message}`);
  return (data as AutoReloadAttempt | null) ?? null;
}

function autoReloadAttemptMatches(
  attempt: AutoReloadAttempt | null,
  userId: string,
  pi: Stripe.PaymentIntent,
  credits?: number,
  requireCollected = false,
): attempt is AutoReloadAttempt {
  if (!attempt || attempt.user_id !== userId) return false;
  if (attempt.stripe_payment_intent_id && attempt.stripe_payment_intent_id !== pi.id) return false;
  if (pi.currency?.toLowerCase() !== DEFAULT_PAYMENT_CURRENCY) return false;
  if (!Number.isSafeInteger(pi.amount) || pi.amount <= 0 || attempt.amount_cents !== pi.amount) return false;
  if (credits !== undefined && attempt.credits_delta !== credits) return false;
  if (requireCollected) {
    // A succeeded event must additionally prove that Stripe collected the exact
    // amount. A partially captured/manual PI must never mint the full delta.
    if (!Number.isSafeInteger(pi.amount_received) || pi.amount_received <= 0) return false;
    if (attempt.amount_cents !== pi.amount_received) return false;
  }
  return true;
}

async function claimAutoReloadPaymentIntent(
  supabase: ReturnType<typeof adminClient>,
  attemptId: string,
  userId: string,
  paymentIntentId: string,
  amountCents: number,
  creditsDelta: number,
): Promise<{ ok: boolean; state?: string; reason?: string }> {
  const { data, error } = await supabase.rpc('claim_auto_reload_payment_intent', {
    p_attempt: attemptId,
    p_user: userId,
    p_payment_intent: paymentIntentId,
    p_amount_cents: amountCents,
    p_credits_delta: creditsDelta,
  });
  if (error) throw new Error(`Claiming auto-reload PaymentIntent failed: ${error.message}`);
  return (data as { ok?: boolean; state?: string; reason?: string } | null)?.ok === true
    ? { ok: true, state: (data as { state?: string }).state }
    : { ok: false, reason: (data as { reason?: string } | null)?.reason ?? 'not_claimed' };
}

async function billingAccountIsActive(
  supabase: ReturnType<typeof adminClient>,
  userId: string,
  stage: string,
): Promise<boolean> {
  const { data, error } = await supabase.rpc('account_is_active', { p_uid: userId });
  if (error) {
    throw new Error(`${stage} account-active lookup failed: ${error.message}`);
  }
  return data === true;
}

async function billingAccountRequiresDeletionCleanup(
  supabase: ReturnType<typeof adminClient>,
  userId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('deleted_at')
    .eq('id', userId)
    .maybeSingle();
  if (error) {
    throw new Error(`billing account status lookup failed: ${error.message}`);
  }
  // A missing profile is fail-closed as deleted: the cleanup resolver/job is the
  // only durable external-identity surface left. Moderation-only rows remain
  // present with deleted_at null and use the non-deletion cancel/refund path.
  return !data || data.deleted_at != null;
}

// ── Durable unfulfilled-payment refunds (migrations 177/180) ─────────────────
//
// Refunds are durable-before-side-effect: the database obligation is written
// before Stripe is called. Stripe idempotency handles a lost create response;
// lifecycle events and the scheduled recovery worker advance the same ordered
// obligation row. Only a confirmed `succeeded` status mirrors refunded money.

type PaymentRefundStatus = 'pending' | 'requires_action' | 'succeeded' | 'failed' | 'canceled';

type PaymentRefundContext = {
  paymentIntentId: string;
  purpose: string;
  amountCents: number;
  currency: string;
  reason: string;
  idempotencyKey: string;
  userId?: string | null;
  attemptId?: string | null;
  checkoutSessionId?: string | null;
};

type RecordedPaymentRefundObligation = PaymentRefundRequestIdentity & {
  status: PaymentRefundStatus;
};

const PAYMENT_REFUND_STATUSES = new Set<PaymentRefundStatus>([
  'pending',
  'requires_action',
  'succeeded',
  'failed',
  'canceled',
]);

function paymentRefundStatus(value: unknown): PaymentRefundStatus {
  return typeof value === 'string'
      && PAYMENT_REFUND_STATUSES.has(value as PaymentRefundStatus)
    ? value as PaymentRefundStatus
    : 'pending';
}

function refundLedgerEventKey(purpose: string, paymentIntentId: string): string {
  return purpose === 'auto_reload_unfulfilled'
    ? `refund:auto-reload:${paymentIntentId}`
    : `refund:unfulfilled:${paymentIntentId}`;
}

async function recordPaymentRefundObligation(
  supabase: ReturnType<typeof adminClient>,
  context: PaymentRefundContext,
  status: PaymentRefundStatus,
  refundId: string | null,
  failureReason: string | null = null,
  stripeEventCreatedAt: string | null = null,
): Promise<RecordedPaymentRefundObligation> {
  const terminal = status === 'succeeded' || status === 'failed' || status === 'canceled';
  const { data, error } = await supabase.rpc('record_payment_refund_obligation', {
    p_payment_intent_id: context.paymentIntentId,
    p_purpose: context.purpose,
    p_amount_cents: context.amountCents,
    p_currency: context.currency.toLowerCase(),
    p_reason: context.reason,
    p_status: status,
    p_stripe_refund_id: refundId,
    p_checkout_session_id: context.checkoutSessionId ?? null,
    p_user_id: context.userId && UUID_PATTERN.test(context.userId) ? context.userId : null,
    p_attempt_id: context.attemptId && UUID_PATTERN.test(context.attemptId) ? context.attemptId : null,
    p_failure_reason: failureReason,
    p_stripe_event_created_at: stripeEventCreatedAt,
    p_resolved_at: terminal ? new Date().toISOString() : null,
  });
  if (error) {
    throw new Error(`Recording payment refund obligation failed: ${error.message}`);
  }
  const row = data as {
    status?: unknown;
    payment_intent_id?: unknown;
    purpose?: unknown;
    amount_cents?: unknown;
    reason?: unknown;
  } | null;
  const identity: PaymentRefundRequestIdentity = {
    payment_intent_id: typeof row?.payment_intent_id === 'string'
      ? row.payment_intent_id
      : '',
    purpose: typeof row?.purpose === 'string' ? row.purpose : '',
    amount_cents: typeof row?.amount_cents === 'number'
      ? row.amount_cents
      : Number.NaN,
    reason: typeof row?.reason === 'string' ? row.reason : '',
  };
  // Fail closed before Stripe if the RPC does not return the canonical row.
  // Replays must never rebuild request parameters from mutable webhook context.
  buildPaymentRefundRequestMetadata(identity);
  return {
    ...identity,
    status: paymentRefundStatus(row?.status ?? status),
  };
}

async function setRefundMoneyEventStatus(
  supabase: ReturnType<typeof adminClient>,
  eventKey: string,
  status: 'reversed',
): Promise<void> {
  try {
    const { error } = await supabase.from('money_events')
      .update({ status })
      .eq('event_key', eventKey);
    if (error) {
      logError('stripe-webhook', null, error.message, {
        stage: 'update_refund_money_event',
        event_key: eventKey,
      });
    }
  } catch (err) {
    logError('stripe-webhook', null, err, {
      stage: 'update_refund_money_event',
      event_key: eventKey,
    });
  }
}

async function mirrorSucceededPaymentRefund(
  supabase: ReturnType<typeof adminClient>,
  context: PaymentRefundContext,
): Promise<void> {
  await writeMoneyEvent(supabase, {
    event_key: refundLedgerEventKey(context.purpose, context.paymentIntentId),
    user_id: context.userId ?? null,
    occurred_at: new Date().toISOString(),
    kind: 'refund_note',
    amount_cents: context.amountCents,
    currency: context.currency,
    description: describeMoneyKind('refund_note'),
    receipt_url: null,
    status: 'refunded',
    stripe_session_id: context.checkoutSessionId ?? null,
    stripe_payment_intent_id: context.paymentIntentId,
    metadata: {
      reason: context.reason,
      attempt_id: context.attemptId ?? null,
      refund_purpose: context.purpose,
    },
  });
}

/**
 * Return money that SettlementForge accepted but cannot fulfill.
 *
 * Stripe's idempotency key makes a retry safe even if the first response is
 * lost. The returned Refund may still be pending: every state is durably
 * recorded, later lifecycle events advance it, and only `succeeded` mirrors
 * "refunded". A create/record failure throws so the outer event claim releases.
 */
async function requestDurablePaymentRefund(
  supabase: ReturnType<typeof adminClient>,
  stripeApi: typeof stripe,
  context: PaymentRefundContext,
): Promise<PaymentRefundStatus> {
  // Durable-before-side-effect: an Edge-runtime crash after Stripe accepts the
  // refund cannot execute the webhook claim-release catch. Persist the obligation
  // first so recovery never depends solely on that original event redelivering.
  const prior = await recordPaymentRefundObligation(
    supabase,
    context,
    'pending',
    null,
  );
  const priorStatus = prior.status;
  if (priorStatus === 'succeeded') {
    await mirrorSucceededPaymentRefund(supabase, context);
    return priorStatus;
  }
  if (priorStatus === 'failed' || priorStatus === 'canceled') {
    return priorStatus;
  }

  let refundId: string | null = null;
  let status: PaymentRefundStatus;
  let failureReason: string | null = null;
  try {
    const refund = await stripeApi.refunds.create(
      {
        payment_intent: prior.payment_intent_id,
        metadata: buildPaymentRefundRequestMetadata(prior),
      },
      { idempotencyKey: context.idempotencyKey },
    );
    refundId = refund.id ?? null;
    status = paymentRefundStatus(refund.status);
    failureReason = refund.failure_reason ?? null;
  } catch (err) {
    const code = (err as { code?: string; raw?: { code?: string } } | null)?.code
      ?? (err as { raw?: { code?: string } } | null)?.raw?.code;
    if (code === 'charge_already_refunded') {
      // Prove the pre-existing full refund and retain its durable Stripe id;
      // never translate the error code alone into a false "succeeded" row.
      const existing = await stripeApi.refunds.list({
        payment_intent: context.paymentIntentId,
        limit: 100,
      });
      const succeeded: Stripe.Refund[] = existing.data.filter(
        (candidate: Stripe.Refund) =>
          candidate.status === 'succeeded' && typeof candidate.amount === 'number',
      );
      const refundedCents = succeeded.reduce(
        (sum: number, candidate: Stripe.Refund) => sum + candidate.amount,
        0,
      );
      if (refundedCents < context.amountCents || succeeded.length === 0) throw err;
      refundId = succeeded.at(-1)!.id;
      status = 'succeeded';
    } else {
      logError('stripe-webhook', context.userId ?? null, err, {
        stage: 'unfulfilled_payment_refund',
        payment_intent: context.paymentIntentId,
        reason: context.reason,
      });
      throw err;
    }
  }

  const effectiveStatus = (await recordPaymentRefundObligation(
    supabase,
    context,
    status,
    refundId,
    failureReason,
  )).status;
  if (effectiveStatus === 'succeeded') {
    await mirrorSucceededPaymentRefund(supabase, context);
  } else if (effectiveStatus === 'failed' || effectiveStatus === 'canceled') {
    logError('stripe-webhook', context.userId ?? null, 'unfulfilled payment refund needs manual reimbursement', {
      stage: 'unfulfilled_payment_refund_terminal',
      payment_intent: context.paymentIntentId,
      refund_id: refundId,
      status: effectiveStatus,
      failure_reason: failureReason,
    });
  }
  return effectiveStatus;
}

/** Return a succeeded auto-reload charge that cannot be fulfilled. */
async function refundUnfulfilledAutoReloadPayment(
  supabase: ReturnType<typeof adminClient>,
  stripeApi: typeof stripe,
  pi: Stripe.PaymentIntent,
  userId: string | null,
  attemptId: string | null,
  reason: string,
): Promise<void> {
  await requestDurablePaymentRefund(supabase, stripeApi, {
    paymentIntentId: pi.id,
    purpose: 'auto_reload_unfulfilled',
    amountCents: typeof pi.amount_received === 'number' ? pi.amount_received
      : (typeof pi.amount === 'number' ? pi.amount : 0),
    currency: pi.currency ?? DEFAULT_PAYMENT_CURRENCY,
    reason,
    idempotencyKey: `auto-reload-unfulfilled-refund-${pi.id}`,
    userId,
    attemptId,
  });
}

async function handlePaymentRefundLifecycle(
  supabase: ReturnType<typeof adminClient>,
  stripeApi: typeof stripe,
  event: Stripe.Event,
): Promise<void> {
  const snapshot = event.data.object as Stripe.Refund;
  if (snapshot.metadata?.purpose !== 'settlementforge_unfulfilled_payment') return;

  // Event timestamps have one-second resolution and deliveries can be reordered.
  // Retrieve the live Refund so two same-second lifecycle events converge on
  // Stripe's current authoritative state before the database ordering RPC runs.
  const refund = await stripeApi.refunds.retrieve(snapshot.id);
  const paymentIntentId = typeof refund.payment_intent === 'string'
    ? refund.payment_intent
    : refund.payment_intent?.id ?? refund.metadata?.payment_intent_id ?? null;
  if (!paymentIntentId || !Number.isSafeInteger(refund.amount) || refund.amount <= 0) {
    throw new Error(`Tracked refund ${refund.id} is missing payment identity`);
  }
  const purpose = refund.metadata?.refund_purpose || 'unfulfilled_payment';
  const obligationAmount = positiveMetadataInteger(
    refund.metadata?.obligation_amount_cents,
  );
  const context: PaymentRefundContext = {
    paymentIntentId,
    purpose,
    amountCents: obligationAmount ?? refund.amount,
    currency: refund.currency || DEFAULT_PAYMENT_CURRENCY,
    reason: refund.metadata?.reason || 'unfulfilled_payment',
    idempotencyKey: `refund-event-${refund.id}`,
    userId: refund.metadata?.supabase_user_id || null,
    attemptId: refund.metadata?.attempt_id || null,
    checkoutSessionId: refund.metadata?.checkout_session_id || null,
  };
  const effectiveStatus = (await recordPaymentRefundObligation(
    supabase,
    context,
    paymentRefundStatus(refund.status),
    refund.id,
    refund.failure_reason ?? null,
    new Date(event.created * 1000).toISOString(),
  )).status;
  const eventKey = refundLedgerEventKey(purpose, paymentIntentId);
  if (effectiveStatus === 'succeeded') {
    await mirrorSucceededPaymentRefund(supabase, context);
  } else if (effectiveStatus === 'failed' || effectiveStatus === 'canceled') {
    await setRefundMoneyEventStatus(supabase, eventKey, 'reversed');
    logError('stripe-webhook', context.userId ?? null, 'tracked refund failed; manual reimbursement required', {
      stage: 'tracked_refund_terminal',
      payment_intent: paymentIntentId,
      refund_id: refund.id,
      status: effectiveStatus,
      failure_reason: refund.failure_reason ?? null,
    });
  }
}

// ── Inactive-account billing cleanup ─────────────────────────────────────────
//
// A payment may settle after account deletion or moderation has crossed its
// final pre-charge check. Late Stripe identities are checkpointed into the
// durable deletion job before cancellation/deletion, and any collected money is
// routed through the refund obligation above.

function stripeResourceAlreadyAbsent(error: unknown): boolean {
  const candidate = error as { code?: string; statusCode?: number; message?: string } | null;
  const message = String(candidate?.message ?? '').toLowerCase();
  return candidate?.code === 'resource_missing'
    || candidate?.statusCode === 404
    || /no such (customer|subscription)|already.{0,12}cancell?ed|has been cancell?ed/.test(message);
}

async function requeueDeletedAccountBillingCleanup(
  supabase: ReturnType<typeof adminClient>,
  userId: string,
  subscriptionId: string | null,
  customerId: string | null,
  reason: string,
): Promise<void> {
  const { data, error } = await supabase.rpc(
    'requeue_account_deletion_cleanup_for_late_billing',
    {
      p_user: userId,
      p_subscription_id: subscriptionId,
      p_customer_id: customerId,
      p_reason: reason,
    },
  );
  if (error) throw new Error(`Requeueing late account-deletion billing failed: ${error.message}`);
  if ((data as { ok?: boolean } | null)?.ok !== true) {
    throw new Error(`Deleted account ${userId} has no durable cleanup job`);
  }
}

async function closeInactiveStripeBillingIdentity(
  stripeApi: typeof stripe,
  {
    subscriptionId,
    customerId,
    subscriptionAlreadyCanceled = false,
  }: {
    subscriptionId: string | null;
    customerId: string | null;
    subscriptionAlreadyCanceled?: boolean;
  },
): Promise<void> {
  if (subscriptionId && !subscriptionAlreadyCanceled) {
    try {
      await stripeApi.subscriptions.cancel(subscriptionId);
    } catch (error) {
      if (!stripeResourceAlreadyAbsent(error)) throw error;
    }
  }
  if (customerId) {
    try {
      await stripeApi.customers.del(customerId);
    } catch (error) {
      if (!stripeResourceAlreadyAbsent(error)) throw error;
    }
  }
}

async function inactiveCheckoutPaymentContext(
  stripeApi: typeof stripe,
  session: Stripe.Checkout.Session,
  userId: string,
): Promise<PaymentRefundContext | null> {
  let paymentIntentId = typeof session.payment_intent === 'string'
    ? session.payment_intent
    : session.payment_intent?.id ?? null;
  let amountCents = typeof session.amount_total === 'number' ? session.amount_total : 0;
  let currency = session.currency ?? DEFAULT_PAYMENT_CURRENCY;
  if (!paymentIntentId && session.invoice) {
    const invoiceId = typeof session.invoice === 'string'
      ? session.invoice
      : session.invoice.id;
    const invoice = typeof session.invoice === 'string'
      ? await stripeApi.invoices.retrieve(invoiceId)
      : session.invoice;
    const invoicePaymentIntent = (invoice as Stripe.Invoice & {
      payment_intent?: string | Stripe.PaymentIntent | null;
    }).payment_intent;
    paymentIntentId = typeof invoicePaymentIntent === 'string'
      ? invoicePaymentIntent
      : invoicePaymentIntent?.id ?? null;
    if (typeof invoice.amount_paid === 'number') amountCents = invoice.amount_paid;
    if (invoice.currency) currency = invoice.currency;
  }
  if (amountCents <= 0) return null;
  if (!paymentIntentId) {
    throw new Error(`Paid inactive-account Checkout ${session.id} has no PaymentIntent`);
  }
  return {
    paymentIntentId,
    purpose: 'deleted_account_checkout',
    amountCents,
    currency,
    reason: 'account_inactive_before_checkout_fulfillment',
    idempotencyKey: `deleted-account-checkout-refund-${paymentIntentId}`,
    userId,
    checkoutSessionId: session.id,
  };
}

async function handleInactiveAccountCheckout(
  supabase: ReturnType<typeof adminClient>,
  stripeApi: typeof stripe,
  session: Stripe.Checkout.Session,
  userId: string,
  deletionCleanupRequired: boolean,
): Promise<void> {
  const subscriptionId = typeof session.subscription === 'string'
    ? session.subscription
    : session.subscription?.id ?? null;
  const customerId = typeof session.customer === 'string'
    ? session.customer
    : session.customer?.id ?? null;
  const refundContext = await inactiveCheckoutPaymentContext(stripeApi, session, userId);

  // Persist the late external identities before touching Stripe. Reopening the
  // queue invalidates a completion lease, so a worker that swept just before
  // this event cannot permanently mark the account clean.
  if (deletionCleanupRequired) {
    await requeueDeletedAccountBillingCleanup(
      supabase,
      userId,
      subscriptionId,
      customerId,
      'checkout_completed_after_account_deletion',
    );
  }

  await closeInactiveStripeBillingIdentity(stripeApi, {
    subscriptionId,
    customerId,
  });
  if (refundContext) {
    await requestDurablePaymentRefund(supabase, stripeApi, refundContext);
  }
}

async function handleInactiveAccountInvoice(
  supabase: ReturnType<typeof adminClient>,
  stripeApi: typeof stripe,
  invoice: Stripe.Invoice,
  userId: string,
  deletionCleanupRequired: boolean,
): Promise<void> {
  const subscriptionId = typeof invoice.subscription === 'string'
    ? invoice.subscription
    : invoice.subscription?.id ?? null;
  const customerId = typeof invoice.customer === 'string'
    ? invoice.customer
    : invoice.customer?.id ?? null;
  const invoicePaymentIntent = (invoice as Stripe.Invoice & {
    payment_intent?: string | Stripe.PaymentIntent | null;
  }).payment_intent;
  const paymentIntentId = typeof invoicePaymentIntent === 'string'
    ? invoicePaymentIntent
    : invoicePaymentIntent?.id ?? null;

  if (deletionCleanupRequired) {
    await requeueDeletedAccountBillingCleanup(
      supabase,
      userId,
      subscriptionId,
      customerId,
      'invoice_paid_after_account_deletion',
    );
  }
  await closeInactiveStripeBillingIdentity(stripeApi, {
    subscriptionId,
    customerId,
  });
  if (typeof invoice.amount_paid === 'number' && invoice.amount_paid > 0) {
    if (!paymentIntentId) {
      throw new Error(`Paid inactive-account invoice ${invoice.id} has no PaymentIntent`);
    }
    // A subscription-start payment is reported by both Checkout completion and
    // invoice.paid. They share one PaymentIntent, so they must also share one
    // immutable refund purpose and Stripe idempotency key regardless of which
    // event arrives first. The later Checkout delivery may safely fill the
    // nullable checkout_session_id on the same durable obligation.
    const isSubscriptionStart = invoice.billing_reason === 'subscription_create';
    await requestDurablePaymentRefund(supabase, stripeApi, {
      paymentIntentId,
      purpose: isSubscriptionStart
        ? 'deleted_account_checkout'
        : 'deleted_account_invoice',
      amountCents: invoice.amount_paid,
      currency: invoice.currency || DEFAULT_PAYMENT_CURRENCY,
      reason: isSubscriptionStart
        ? 'account_inactive_before_checkout_fulfillment'
        : 'account_inactive_before_invoice_fulfillment',
      idempotencyKey: isSubscriptionStart
        ? `deleted-account-checkout-refund-${paymentIntentId}`
        : `deleted-account-invoice-refund-${paymentIntentId}`,
      userId,
    });
  }
}

async function handleInactiveAccountSubscription(
  supabase: ReturnType<typeof adminClient>,
  stripeApi: typeof stripe,
  subscription: Stripe.Subscription,
  userId: string,
  reason: string,
  deletionCleanupRequired: boolean,
): Promise<void> {
  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer?.id ?? null;
  if (deletionCleanupRequired) {
    await requeueDeletedAccountBillingCleanup(
      supabase,
      userId,
      subscription.id,
      customerId,
      reason,
    );
  }
  await closeInactiveStripeBillingIdentity(stripeApi, {
    subscriptionId: subscription.id,
    customerId,
    subscriptionAlreadyCanceled: subscription.status === 'canceled',
  });
}

// ── Auto-reload fulfillment ──────────────────────────────────────────────────

/**
 * Grant reloaded credits, complete the attempt, and mirror the money event.
 *
 * Grant/bind/complete database failures throw, releasing the event claim so
 * Stripe can redeliver. The credit grant is idempotent on the PaymentIntent key;
 * receipt and ledger mirroring remain best-effort after authoritative steps.
 */
async function handleAutoReloadSucceeded(
  supabase: ReturnType<typeof adminClient>,
  stripeApi: typeof stripe,
  pi: Stripe.PaymentIntent,
): Promise<void> {
  const userId = pi.metadata?.supabase_user_id;
  const attemptId = pi.metadata?.attempt_id;
  const credits = positiveMetadataInteger(pi.metadata?.credits);
  if (!attemptId || !UUID_PATTERN.test(attemptId)) {
    logError('stripe-webhook', userId ?? null, 'auto_reload PI missing metadata', { stage: 'auto_reload_succeeded', payment_intent: pi.id });
    await refundUnfulfilledAutoReloadPayment(
      supabase,
      stripeApi,
      pi,
      userId ?? null,
      attemptId ?? null,
      'invalid_attempt_metadata',
    );
    return;
  }

  const attempt = await readAutoReloadAttempt(supabase, attemptId, 'auto_reload_succeeded');
  const canSettle = attempt != null && AUTO_RELOAD_SUCCESS_TRANSITION_STATES.includes(attempt.state);
  const alreadySucceeded = attempt?.state === 'succeeded'
    && attempt.stripe_payment_intent_id === pi.id;

  // A detached reload can cross the deletion boundary after its last pre-charge
  // check. Never mint unusable credits into a disabled/deleted account: refund
  // the still-unfulfilled charge. A same-PI completed redelivery is exempt because
  // its credits were authoritatively granted while the account was active.
  const authoritativeUserId = attempt?.user_id ?? userId ?? null;
  if (!alreadySucceeded && authoritativeUserId
    && !await billingAccountIsActive(supabase, authoritativeUserId, 'auto_reload_succeeded')) {
    await refundUnfulfilledAutoReloadPayment(
      supabase,
      stripeApi,
      pi,
      authoritativeUserId,
      attemptId,
      'account_inactive',
    );
    return;
  }

  // Once this exact PI is already fulfilled, never turn a later malformed
  // snapshot into a refund after credits were granted. Log and leave the
  // authoritative completed attempt untouched.
  if (!userId || credits === null || !Number.isSafeInteger(pi.amount) || pi.amount <= 0) {
    logError('stripe-webhook', userId, 'auto_reload PI metadata does not match its attempt', {
      stage: 'auto_reload_succeeded',
      payment_intent: pi.id,
      attempt_id: attemptId,
    });
    if (!alreadySucceeded) {
      await refundUnfulfilledAutoReloadPayment(
        supabase,
        stripeApi,
        pi,
        attempt?.user_id ?? userId ?? null,
        attemptId,
        'invalid_payment_metadata',
      );
    }
    return;
  }

  const attemptMatches = autoReloadAttemptMatches(attempt, userId, pi, credits, true);
  if (alreadySucceeded && !attemptMatches) {
    logError('stripe-webhook', userId, 'auto_reload PI metadata does not match its completed attempt', {
      stage: 'auto_reload_succeeded',
      payment_intent: pi.id,
      attempt_id: attemptId,
    });
    return;
  }

  if (!attemptMatches || (!canSettle && !alreadySucceeded)) {
    logError('stripe-webhook', userId ?? null, 'auto_reload PI cannot fulfill its attempt', {
      stage: 'auto_reload_succeeded',
      payment_intent: pi.id,
      attempt_id: attemptId,
    });
    await refundUnfulfilledAutoReloadPayment(
      supabase,
      stripeApi,
      pi,
      attempt?.user_id ?? userId ?? null,
      attemptId,
      attempt?.stripe_payment_intent_id && attempt.stripe_payment_intent_id !== pi.id
        ? 'payment_intent_identity_conflict'
        : 'attempt_mismatch',
    );
    return;
  }

  let matchedAttempt = attempt as AutoReloadAttempt;

  // Atomic identity claim (176) BEFORE granting. The SQL UPDATE allows only a
  // null-or-same PI, so two distinct succeeded PIs racing on an unbound attempt
  // cannot both win and cannot both exploit the per-PI grant idempotency key.
  if (canSettle) {
    const binding = await claimAutoReloadPaymentIntent(
      supabase,
      attemptId,
      userId,
      pi.id,
      matchedAttempt.amount_cents,
      matchedAttempt.credits_delta,
    );
    if (!binding.ok) {
      logError('stripe-webhook', userId, 'auto_reload PaymentIntent identity claim lost', {
        stage: 'auto_reload_bind_race',
        payment_intent: pi.id,
        attempt_id: attemptId,
        reason: binding.reason ?? null,
      });
      await refundUnfulfilledAutoReloadPayment(
        supabase,
        stripeApi,
        pi,
        matchedAttempt.user_id,
        attemptId,
        `identity_claim_${binding.reason ?? 'lost'}`,
      );
      return;
    }
    matchedAttempt = {
      ...matchedAttempt,
      state: binding.state ?? matchedAttempt.state,
      stripe_payment_intent_id: pi.id,
    };
  }

  // AUTHORITATIVE grant: system_grant_credits claims once per PI id (158 delivery
  // key), so a redelivered succeeded event grants exactly once. Throws on error.
  await grantCredits(supabase, userId, credits, 'auto_reload', { stripe_payment_intent_id: pi.id });

  if (matchedAttempt.state !== 'succeeded') {
    const { data: completed, error: completeErr } = await supabase
      .from('credit_auto_reload_attempts')
      .update({ state: 'succeeded', failure_reason: null, resolved_at: new Date().toISOString() })
      .eq('id', attemptId)
      .eq('user_id', userId)
      .eq('stripe_payment_intent_id', pi.id)
      .in('state', AUTO_RELOAD_SUCCESS_TRANSITION_STATES)
      .select('id')
      .maybeSingle();
    if (completeErr) throw new Error(`Completing auto-reload attempt failed: ${completeErr.message}`);
    if (!completed) {
      const current = await readAutoReloadAttempt(supabase, attemptId, 'auto_reload_complete_race');
      if (current?.state !== 'succeeded' || current.stripe_payment_intent_id !== pi.id) {
        throw new Error(`Auto-reload attempt ${attemptId} changed before completion`);
      }
    }
  }

  let receiptUrl: string | null = null;
  let chargeId: string | null = null;
  try {
    const cap = await captureChargeReceipt(stripeApi, pi.id);
    receiptUrl = cap.receiptUrl;
    chargeId = cap.chargeId;
  } catch (err) {
    logError('stripe-webhook', userId, err, { stage: 'auto_reload_receipt', payment_intent: pi.id });
  }
  await writeMoneyEvent(supabase, {
    event_key: `pi:${pi.id}`,
    user_id: userId,
    occurred_at: new Date().toISOString(),
    kind: 'auto_reload',
    amount_cents: typeof pi.amount_received === 'number' ? pi.amount_received
      : (typeof pi.amount === 'number' ? pi.amount : 0),
    currency: pi.currency ?? 'usd',
    description: describeMoneyKind('auto_reload', { credits }),
    receipt_url: receiptUrl,
    stripe_payment_intent_id: pi.id,
    stripe_charge_id: chargeId,
  });
}

/** Mark a failed auto-reload attempt. Uses metadata.attempt_id so an event that
 *  beats the trigger's PI-id stamp still closes the correct open attempt. */
async function handleAutoReloadFailed(
  supabase: ReturnType<typeof adminClient>,
  pi: Stripe.PaymentIntent,
): Promise<void> {
  const userId = pi.metadata?.supabase_user_id;
  const attemptId = pi.metadata?.attempt_id;
  const credits = positiveMetadataInteger(pi.metadata?.credits);
  if (!userId || !attemptId || !UUID_PATTERN.test(attemptId) || credits === null
    || !Number.isSafeInteger(pi.amount) || pi.amount <= 0) {
    logError('stripe-webhook', userId ?? null, 'auto_reload failed PI missing metadata', {
      stage: 'auto_reload_mark_failed',
      payment_intent: pi.id,
    });
    return;
  }

  const attempt = await readAutoReloadAttempt(supabase, attemptId, 'auto_reload_failed');
  if (!autoReloadAttemptMatches(attempt, userId, pi, credits)
    || (attempt.state !== 'pending' && attempt.state !== 'requires_action' && attempt.state !== 'failed')) {
    logError('stripe-webhook', userId, 'auto_reload failed PI metadata does not match its attempt', {
      stage: 'auto_reload_mark_failed',
      payment_intent: pi.id,
      attempt_id: attemptId,
    });
    return;
  }
  const binding = await claimAutoReloadPaymentIntent(
    supabase,
    attemptId,
    userId,
    pi.id,
    attempt.amount_cents,
    attempt.credits_delta,
  );
  if (!binding.ok) {
    logError('stripe-webhook', userId, 'auto_reload failed PaymentIntent identity claim lost', {
      stage: 'auto_reload_fail_race',
      payment_intent: pi.id,
      attempt_id: attemptId,
      reason: binding.reason ?? null,
    });
    return;
  }
  const { data: failed, error: failErr } = await supabase
    .from('credit_auto_reload_attempts')
    .update({
      state: 'failed',
      failure_reason: pi.last_payment_error?.code || 'payment_failed',
      resolved_at: new Date().toISOString(),
    })
    .eq('id', attemptId)
    .eq('user_id', userId)
    .eq('stripe_payment_intent_id', pi.id)
    .in('state', AUTO_RELOAD_FAILURE_TRANSITION_STATES)
    .select('id')
    .maybeSingle();
  if (failErr) throw new Error(`Failing auto-reload attempt failed: ${failErr.message}`);
  if (!failed) {
    const current = await readAutoReloadAttempt(supabase, attemptId, 'auto_reload_fail_race');
    if (current?.state !== 'failed' || current.stripe_payment_intent_id !== pi.id) {
      throw new Error(`Auto-reload attempt ${attemptId} changed before failure resolution`);
    }
  }
}

// Event routing stays separate from the signature and lease bracket above so a
// reviewer can inspect one verified event's full business sequence in one case.
// Each case owns its fulfillment/refund guards; cross-event idempotency remains
// in the database claims and shared lifecycle helpers those cases invoke.
async function dispatchStripeEvent(
  event: Stripe.Event,
  supabase: ReturnType<typeof adminClient>,
  stripeApi: typeof stripe,
  referralEmailDispatch?: ReferralEmailDispatch,
): Promise<void> {
  switch (event.type) {
    // async_payment_succeeded is the settlement signal for delayed-notification
    // methods (ACH debit, some wallets): those sessions fire `completed` with
    // payment_status='unpaid' (deferred below), then this event once the funds
    // actually clear. Same fulfillment branch — the session-id idempotency in
    // grantCreditsForSessionOnce makes the two deliveries safe to share, and the
    // premium/founder profile writes are same-value re-runs.
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded': {
      const session = event.data.object as Stripe.Checkout.Session;

      // Do NOT fulfil unsettled money. `completed` only means the checkout flow
      // finished; with async payment methods the charge can still fail, so
      // granting credits/premium here would hand out goods for money that never
      // arrives. Ack (200) and wait for async_payment_succeeded — a non-2xx would
      // just make Stripe redeliver the same unpaid event. 'paid' and
      // 'no_payment_required' (trials, 100%-off promos) both fulfil; an absent
      // payment_status (older API payloads) proceeds for back-compat.
      if (session.payment_status === 'unpaid') {
        console.log(`[stripe-webhook] session ${session.id} completed but unpaid — deferring fulfillment to async_payment_succeeded`);
        break;
      }

      const userId = session.metadata?.supabase_user_id;
      const product = session.metadata?.product;
      const credits = parseInt(session.metadata?.credits || '0', 10);

      // single_dossier is the only product that may legitimately have no
      // account. Every account-bound settlement checks the durable profile
      // state before touching a grant/redeem/relink path. If deletion won, stop
      // recurring billing and durably refund any settled first payment.
      if (!userId && product !== 'single_dossier') {
        throw new Error('No supabase_user_id in session metadata');
      }
      if (userId && product !== 'single_dossier'
        && !await billingAccountIsActive(supabase, userId, 'checkout_fulfillment')) {
        await handleInactiveAccountCheckout(
          supabase,
          stripeApi,
          session,
          userId,
          await billingAccountRequiresDeletionCleanup(supabase, userId),
        );
        break;
      }

      // REDEEM (107): a paid session that carried a reserved redeem code is
      // flipped BEFORE fulfilment, whatever product it bought, so a
      // fulfilment failure's redelivery finds the claim already taken and
      // cannot re-run the redeem grant; the fulfilment steps below are each
      // individually idempotent and re-run fine. A session with no code
      // no-ops here (no_reserved_redemption).
      await applyRedemptionIfBound(supabase, session.id);

      // FOUNDER SEAT TRANSFER (§6.6, M-7): a case-bound $99 payment. This session
      // carries purpose='founder_seat_transfer' + transfer_case_id (server-validated
      // state, set by founder-transfer/nominee_confirm), NOT a `product`. Mark the case
      // paid → cooling (claim-once on the awaiting_payment state + the bound session)
      // and mirror a seat_transfer_payment money_events row. Handled BEFORE the product
      // dispatch so it never falls into the "unhandled product" throw.
      if (session.metadata?.purpose === 'founder_seat_transfer') {
        const transferCaseId = session.metadata?.transfer_case_id;
        if (!transferCaseId) throw new Error('founder_seat_transfer session missing transfer_case_id');
        const { data: paid, error: paidErr } = await supabase.rpc('transfer_case_mark_paid', {
          p_case: transferCaseId, p_session: session.id, p_price_cents: session.amount_total ?? 0,
        });
        if (paidErr) throw new Error(`transfer_case_mark_paid failed: ${paidErr.message}`);
        if (paid?.ok) {
          await mirrorCheckoutMoneyEvent(supabase, stripeApi, session, 'seat_transfer_payment', session.metadata?.supabase_user_id ?? null, 0);
        } else {
          // FP-2 (§6.8 family 8): a wrong-state session (aborted/expired, or a stale
          // nominee session superseded by a re-minted one). The seat never moved for THIS
          // session, so the orphaned charge is refunded — UNLESS this is a redelivery of
          // the session that legitimately paid the case (that money bought the cooling
          // seat). Redelivery-safe (idempotency-keyed refund + event_key-deduped note).
          await refundOrphanedTransferCharge(supabase, stripeApi, session, transferCaseId, paid?.reason ?? 'unknown');
        }
        break;
      }

      if (product === 'premium') {
        // Cartographer subscription (legacy SKU key kept = "premium" so
        // existing customers' subscriptions keep flowing into the same code).

        // OUT-OF-ORDER GUARD: Stripe does not guarantee delivery order. If this
        // session's customer.subscription.deleted arrived FIRST (e.g. this
        // completed event sat in retry backoff while the user cancelled), the
        // deleted handler no-opped (tier was not yet premium) — so upgrading now
        // would record an already-dead subscription id and grant premium that no
        // future event ever revokes. Check the subscription's LIVE status before
        // granting; a dead one is skipped (ack 200 — retrying won't revive it).
        // A throw here (network) is fine: non-2xx → Stripe redelivers.
        const premiumSubId = typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription?.id || null;
        if (premiumSubId) {
          const liveSub = await stripeApi.subscriptions.retrieve(premiumSubId);
          if (liveSub.status === 'canceled' || liveSub.status === 'incomplete_expired') {
            console.log(`[stripe-webhook] session ${session.id} completed but subscription ${premiumSubId} is already ${liveSub.status} (out-of-order delete) — not upgrading user ${userId}`);
            break;
          }
        }

        const { error: profileError } = await supabase.from('profiles').update({
          tier: 'premium',
          stripe_customer_id: typeof session.customer === 'string' ? session.customer : session.customer?.id || null,
          // Record THIS subscription so a later stale/redelivered .deleted for an
          // OLD subscription can't downgrade this re-subscribed user (087).
          stripe_subscription_id: premiumSubId,
          premium_downgraded_at: null,
          premium_retention_expires_at: null,
        }).eq('id', userId);
        if (profileError) throw new Error(`Failed to update premium profile: ${profileError.message}`);
        const { error: restoreError } = await supabase.rpc('restore_premium_settlements', { target_user: userId! });
        if (restoreError) throw new Error(`Premium restore failed: ${restoreError.message}`);
        const { error } = await supabase.auth.admin.updateUserById(userId!, {
          user_metadata: { tier: 'premium' },
        });
        if (error) throw new Error(`Failed to upgrade user: ${error.message}`);
        console.log(`User ${userId} upgraded to premium (Cartographer)`);
      } else if (product === 'founder_lifetime') {
        // Founder Lifetime: $99 one-time. Gives Cartographer access forever +
        // the founder badge. We store tier='premium' (so all the existing
        // tier-gated UI keeps working) and set is_founder=true so the badge
        // and Founder-only surfaces can light up. A NULL expires_at in the
        // ledger marks this as a perpetual grant.
        const { error: profileError } = await supabase.from('profiles')
          .update({
            tier: 'premium',
            is_founder: true,
            stripe_customer_id: typeof session.customer === 'string' ? session.customer : session.customer?.id || null,
            premium_downgraded_at: null,
            premium_retention_expires_at: null,
          })
          .eq('id', userId);
        if (profileError) throw new Error(`Failed to update founder profile: ${profileError.message}`);
        const { error: restoreError } = await supabase.rpc('restore_premium_settlements', { target_user: userId! });
        if (restoreError) throw new Error(`Premium restore failed: ${restoreError.message}`);
        const { error } = await supabase.auth.admin.updateUserById(userId!, {
          user_metadata: { tier: 'premium', is_founder: true },
        });
        if (error) throw new Error(`Failed to upgrade user to founder: ${error.message}`);

        // SEAT REGISTER (137, §6.1): claim the durable seat entitlement now that the
        // profile writes have landed. NEVER-throw into fulfillment — is_founder stays
        // the fast flag + the money truth, and a missed seat row is operator-repairable
        // via the idempotent primitive (log-don't-throw). 137's deliberate deferral ends.
        try {
          const { error: seatErr } = await supabase.rpc('claim_next_founder_seat', { p_user: userId! });
          if (seatErr) logError('stripe-webhook', userId!, seatErr.message, { stage: 'founder_seat_claim', session: session.id });
        } catch (err) {
          logError('stripe-webhook', userId!, err, { stage: 'founder_seat_claim', session: session.id });
        }

        // Founder bonus: one-time 30-credit grant (idempotent on session id).
        await grantCreditsForSessionOnce(supabase, userId!, FOUNDER_CREDIT_BONUS, 'founder_grant', session.id, /* oncePerUser */ true);
        console.log(`User ${userId} upgraded to Founder Lifetime (+30 credits)`);

        // REFERRAL (107): a PAID founder purchase is a qualifying first
        // payment too. The session id doubles as the UNIQUE invoice-id claim
        // key (one-time payments raise no invoice). amount_total > 0 is the
        // zero-dollar gate — a fully-discounted seat moved no money.
        if (typeof session.amount_total === 'number' && session.amount_total > 0) {
          await settleReferralIfPending(supabase, stripeApi, {
            refereeUserId: userId!,
            invoiceId: session.id,
            amountPaidCents: session.amount_total,
            emailDispatch: referralEmailDispatch,
          });
        }
      } else if (product === 'single_dossier') {
        // One-shot purchase, no account required. The customer's receipt + the
        // success-page redirect (handled client-side via session_id query param)
        // deliver the PDF; the client verify-single-dossier flow is unchanged.
        // PII: do NOT log customer_email — the session id reconciles to the email
        // inside Stripe's own access controls. (A+ P0.2)
        //
        // DURABLE RIGHTS (108): the purchase ALSO feeds the export-rights ladder.
        // Both branches are additive to the one-shot download and NEVER throw:
        //   * a SIGNED-IN buyer who bound a saved settlement at checkout gets a
        //     durable re-download right on it (grant_dossier_entitlement);
        //   * an ANONYMOUS buyer's purchase is recorded as a same-device
        //     token-claim voucher (single_dossier_purchases).
        const dossierSaveId = session.metadata?.save_id || '';
        if (userId && dossierSaveId) {
          await grantDossierEntitlementForSession(supabase, userId, dossierSaveId, session.id);
        } else if (session.metadata?.anonymous === 'true') {
          await recordAnonymousDossierPurchase(supabase, session);
        }
        // DELIVERY STASH (122): bind the paid Stripe session to the server-stashed
        // settlement so verify-single-dossier can read it back keyed on the session.
        // Additive to the entitlement/voucher above and applies to BOTH signed-in
        // and anonymous buyers (the stash was written for any single_dossier that
        // carried a settlement). Idempotent on replay (same session id → same row);
        // a bind failure is non-fatal (the client-side stash remains the fallback).
        const dossierToken = session.metadata?.checkout_token;
        if (dossierToken) {
          const { error: bindErr } = await supabase
            .from('dossier_purchases')
            .update({ stripe_session_id: session.id })
            .eq('checkout_token', dossierToken);
          if (bindErr) {
            console.warn(`[stripe-webhook] dossier session bind failed for token: ${bindErr.message}`);
          }
        }
        console.log(`single_dossier purchased: session=${session.id}`);
      } else if (product === 'surveyor') {
        // Surveyor subscription (#16). Grants an ENTITLEMENT (139) — NOT a
        // profiles.tier value and NOT auth metadata (the sim never reads it; the
        // client tier bit is Wave B #15's lane). Out-of-order guard verbatim-adapted
        // from the premium branch: a dead subscription (delivery reorder) is skipped.
        const surveyorSubId = typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription?.id || null;
        if (surveyorSubId) {
          const liveSub = await stripeApi.subscriptions.retrieve(surveyorSubId);
          if (liveSub.status === 'canceled' || liveSub.status === 'incomplete_expired') {
            console.log(`[stripe-webhook] session ${session.id} completed but surveyor subscription ${surveyorSubId} is already ${liveSub.status} (out-of-order delete) — not granting user ${userId}`);
            break;
          }
        }
        const surveyorCustomerId = typeof session.customer === 'string' ? session.customer : session.customer?.id || null;
        const { error: surveyorErr } = await supabase.rpc('grant_surveyor_entitlement', {
          p_user: userId!,
          p_source: 'subscription',
          p_subscription_id: surveyorSubId,
          p_customer_id: surveyorCustomerId,
        });
        if (surveyorErr) throw new Error(`Surveyor entitlement grant failed: ${surveyorErr.message}`);
        console.log(`User ${userId} granted Surveyor entitlement (subscription ${surveyorSubId})`);
      } else if (credits > 0) {
        // Credit pack purchase. The RPC handles ledger, legacy counter,
        // compatibility table, and audit writes atomically; the wrapper makes
        // the grant idempotent against Stripe's at-least-once redelivery.
        await grantCreditsForSessionOnce(supabase, userId!, credits, 'purchase', session.id);
        console.log(`Added ${credits} credits to user ${userId}`);
      } else {
        // A completed checkout whose product matches none of the above AND carries
        // no credits. create-checkout validates product keys server-side, so this is
        // unreachable in normal operation — fail LOUD rather than silently ack a paid
        // session we did not fulfil, so a metadata misconfiguration surfaces in
        // Stripe's webhook dashboard + retries instead of being swallowed.
        throw new Error(`Unhandled checkout product: ${product || '(missing)'} (session=${session.id})`);
      }

      // MONEY LEDGER MIRROR (156): one money_events row per successful fulfilment.
      // Runs only after the branches above complete — the unpaid-defer and the
      // out-of-order dead-subscription paths `break` before reaching here, so no
      // un-fulfilled session is ever mirrored. Anonymous single_dossier mirrors
      // with user_id NULL (a financial record with no owner). NEVER-throw.
      let mirrorKind: MoneyEventKind | null = null;
      if (product === 'premium') mirrorKind = 'subscription_start';
      else if (product === 'founder_lifetime') mirrorKind = 'founder_seat';
      else if (product === 'single_dossier') mirrorKind = 'single_dossier';
      else if (product === 'surveyor') mirrorKind = 'surveyor_start';
      else if (credits > 0) mirrorKind = 'credit_pack';
      if (mirrorKind) {
        await mirrorCheckoutMoneyEvent(supabase, stripeApi, session, mirrorKind, userId ?? null, credits);
      }
      break;
    }

    case 'checkout.session.async_payment_failed': {
      // create-checkout intentionally leaves payment-method selection to Stripe,
      // so dashboard-enabled delayed methods can finish Checkout while still
      // unpaid. No entitlement is granted by the unpaid completed event above,
      // but two pre-payment claims must be released when settlement later fails:
      // a reserved redeem-code seat and a founder transfer case bound to this
      // now-terminal session. Both RPCs claim by session + current state, so a
      // duplicate failure (or a failure racing success) is an idempotent no-op.
      const failed = event.data.object as Stripe.Checkout.Session;
      const { data: reverted, error: revertErr } = await supabase.rpc('revert_redemption', {
        p_session_id: failed.id,
      });
      if (revertErr) {
        logError('stripe-webhook', null, revertErr.message, {
          stage: 'async_payment_failed_revert_redemption',
          session_id: failed.id,
        });
        throw new Error(`Async payment redemption release failed: ${revertErr.message}`);
      }
      if (reverted?.ok) {
        console.log(`[stripe-webhook] redemption ${reverted.redemption_id} reverted after async payment failure for session ${failed.id}`);
      }

      const { error: regressErr } = await supabase.rpc('transfer_case_regress_awaiting_payment', {
        p_session: failed.id,
      });
      if (regressErr) {
        logError('stripe-webhook', null, regressErr.message, {
          stage: 'async_payment_failed_transfer_regress',
          session_id: failed.id,
        });
        throw new Error(`Async payment transfer regression failed: ${regressErr.message}`);
      }
      break;
    }

    case 'checkout.session.expired': {
      // REDEEM (107): an abandoned checkout hands its reserved redeem-code
      // seat back so the code (and, for other users, its max_uses budget)
      // isn't burned by a session nobody paid for. revert_redemption is
      // claim-once — only a reserved row flips — so a redelivered expiry, or
      // an expiry racing the completion, no-ops; an APPLIED redemption is
      // never reverted. Sessions that carried no code (the overwhelming
      // majority of expiries) read no_reserved_redemption and no-op.
      const expired = event.data.object as Stripe.Checkout.Session;
      const { data: reverted, error: revertErr } = await supabase.rpc('revert_redemption', {
        p_session_id: expired.id,
      });
      if (revertErr) {
        // Transport failure BEFORE any claim: throw so Stripe redelivers.
        logError('stripe-webhook', null, revertErr.message, { stage: 'revert_redemption', session_id: expired.id });
        throw new Error(`revert_redemption failed: ${revertErr.message}`);
      }
      if (reverted?.ok) {
        console.log(`[stripe-webhook] redemption ${reverted.redemption_id} reverted on expired session ${expired.id}`);
      }
      // FOUNDER SEAT TRANSFER (§6.3, M-7): an expired unpaid transfer session regresses
      // its case to nominee_verified so acceptance can re-mint a session. Claim-once
      // (only an awaiting_payment case bound to THIS session regresses). NEVER-throw.
      try {
        const { error: regressErr } = await supabase.rpc('transfer_case_regress_awaiting_payment', { p_session: expired.id });
        if (regressErr) logError('stripe-webhook', null, regressErr.message, { stage: 'transfer_session_expired_regress', session_id: expired.id });
      } catch (err) {
        logError('stripe-webhook', null, err, { stage: 'transfer_session_expired_regress', session_id: expired.id });
      }
      break;
    }

    // ── Auto-reload off-session confirmation (158, §4.5) ───────────────────
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent;
      if (pi.metadata?.purpose !== 'credit_auto_reload') break; // not ours — ignore
      await handleAutoReloadSucceeded(supabase, stripeApi, pi);
      break;
    }

    case 'payment_intent.payment_failed': {
      const pi = event.data.object as Stripe.PaymentIntent;
      if (pi.metadata?.purpose !== 'credit_auto_reload') break;
      await handleAutoReloadFailed(supabase, pi);
      break;
    }

    case 'refund.created':
    case 'refund.updated':
    case 'refund.failed': {
      await handlePaymentRefundLifecycle(supabase, stripeApi, event);
      break;
    }

    case 'invoice.paid':
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      const profile = await grantMonthlyAllowanceIfNeeded(
        supabase,
        stripeApi,
        invoice,
      );
      if (profile && !profile.isActive) {
        await handleInactiveAccountInvoice(
          supabase,
          stripeApi,
          invoice,
          profile.userId,
          profile.deletionCleanupRequired,
        );
        break;
      }
      // MONEY LEDGER (156): mirror RENEWALS only (billing_reason 'subscription_
      // cycle'). The *_start row is written from the checkout session, so a
      // subscription_create invoice must NOT write a second row (a Checkout-created
      // subscription fires both events). Discriminate Surveyor vs Cartographer by the
      // line price id (#16). NEVER-throw.
      if (profile?.userId && invoice.billing_reason === 'subscription_cycle') {
        const surveyorPriceId = Deno.env.get('STRIPE_PRICE_SURVEYOR') || '';
        const renewalLinePriceId = invoice.lines?.data?.[0]?.price?.id ?? null;
        const renewalKind: MoneyEventKind = (surveyorPriceId && renewalLinePriceId === surveyorPriceId)
          ? 'surveyor_renewal' : 'subscription_renewal';
        await mirrorInvoiceMoneyEvent(supabase, invoice, profile.userId, renewalKind);
      }
      // REFERRAL (107): the referee's FIRST paid subscription invoice
      // (billing_reason 'subscription_create' — renewals are 'subscription_
      // cycle') with real money moved. grant_referral re-asserts both gates.
      if (profile?.userId
        && invoice.billing_reason === 'subscription_create'
        && typeof invoice.amount_paid === 'number' && invoice.amount_paid > 0) {
        await settleReferralIfPending(supabase, stripeApi, {
          refereeUserId: profile.userId,
          invoiceId: invoice.id,
          amountPaidCents: invoice.amount_paid,
          emailDispatch: referralEmailDispatch,
        });
      }
      break;
    }

    // ── Referral clawback triggers (107, red-team CRIT-1) ──────────────────
    // Any reversal of the qualifying payment reverses the reward. A PARTIAL
    // refund also claws back (charge.refunded fires for both): a payment the
    // customer walked back in any amount no longer anchors a reward. Almost
    // all of these events concern payments that never rewarded a referral;
    // clawback_referral answers no_granted_referral and the case no-ops.
    case 'charge.refunded':
    case 'charge.dispute.created': {
      // POLICY (CRIT-1; Wave 8 H20/M22 ruling 2026-07-26): the class is named and
      // recorded so the routing is EXPLICIT, and ALL classes — full_refund,
      // partial_refund, dispute — route to the SAME full clawback lattice below.
      // A partial refund is a payment the customer walked back; goodwill flows
      // are credit GRANTS, never partial refunds, so no partial-clawback path
      // exists BY POLICY. classifyChargeReversal never throws (ambiguity reads
      // as full_refund semantics — which every class receives anyway).
      const reversalClass = classifyChargeReversal(event);
      console.log(`[stripe-webhook] ${event.type} (${event.id}) classified '${reversalClass}' — routing to the full clawback lattice (all reversal classes claw back fully by policy)`);
      const keys = await resolveChargeClawbackKeys(event, stripeApi);
      let referralClawed = false;
      for (const key of keys) {
        // REFERRAL clawback (107): stop after the first key that claimed a
        // granted referral — one payment rewarded at most one.
        if (!referralClawed && await clawbackReferralByKey(supabase, stripeApi, key)) {
          referralClawed = true;
        }
        // DOSSIER clawback (108): a refunded/disputed single_dossier charge
        // carries no invoice, so its key is the checkout SESSION id — the same
        // id the durable grant / purchase voucher keyed on. clawback_dossier_
        // entitlement is idempotent and tolerant of absence (most refunds touch
        // charges that never held a dossier right → entitlement_id:null, no-op),
        // and it ALSO poisons any anonymous purchase voucher so a refunded
        // purchase can never be retro-claimed. Run it for EVERY candidate key
        // (independent of the referral outcome — a single charge is one or the
        // other, but resolving keys is cheap and the RPC no-ops when nothing
        // matches). A subscription-invoice key (referral case) simply finds no
        // dossier row and no-ops.
        await clawbackDossierEntitlementForSession(supabase, key);
        // FOUNDER clawback: a refunded/disputed founder_lifetime charge carries no
        // invoice, so its key is the checkout SESSION id — the same id its founder_grant
        // ledger row keyed on. Reverses is_founder (freeing the seat), the premium tier,
        // and the 30-credit bonus. No-ops for every key that never granted the bonus.
        await clawbackFounderForSession(supabase, stripeApi, key);
        // TRANSFER clawback (§6.7): a refunded/disputed transfer charge's key is the
        // case's checkout SESSION id — reverse the transfer by its case state.
        await clawbackTransferForSession(supabase, key);
        // CREDIT-PACK clawback (Wave 8 M2): a refunded/disputed pack charge's key
        // is the checkout SESSION id — the same id its 'purchase' grant keyed on.
        // Reverses the FULL granted amount (balance may go negative; the debt nets
        // against future grants). No-ops for every key that never granted a pack.
        await clawbackCreditPackForSession(supabase, key, reversalClass);
      }
      // MONEY LEDGER (156): flip the mirrored row's status (refund → 'refunded',
      // dispute → 'disputed') on the SAME candidate keys. The one sanctioned
      // mutation on money_events; NEVER-throw so it can't stall the clawbacks above.
      await flipMoneyEventStatus(supabase, keys, event.type === 'charge.dispute.created' ? 'disputed' : 'refunded');
      break;
    }

    case 'invoice.payment_failed': {
      // A first invoice that FAILS was never paid, so no grant exists and this
      // no-ops; the case matters for the pay-then-fail edge (e.g. a bank-debit
      // payment that clears optimistically and later bounces).
      const failedInvoice = event.data.object as Stripe.Invoice;
      await clawbackReferralByKey(supabase, stripeApi, failedInvoice.id);
      break;
    }

    case 'customer.subscription.updated': {
      // SUBSCRIPTION PAUSE / RESUME (downgrade audit; manager addendum). Stripe's
      // customer-portal "pause" sets pause_collection on the subscription WITHOUT a
      // .deleted event — so a paused Cartographer sub previously retained premium
      // indefinitely (the audit's UNHANDLED finding). Treat pause_collection-active
      // as a downgrade-equivalent and resumption as a restore.
      //
      // SURVEYOR DISCRIMINATION FIRST (like .deleted): a surveyor sub id lives ONLY in
      // surveyor_entitlements (never profiles.stripe_subscription_id). A surveyor
      // .updated must not touch Cartographer premium — surveyor pause is out of scope
      // here (it keeps its entitlement; a future item may revisit).
      const subscription = event.data.object as Stripe.Subscription;
      const subId = subscription.id;
      const updatedCustomerId = typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer?.id ?? null;
      let updatedProfile = await findUserIdForStripeCustomer(
        supabase,
        updatedCustomerId,
        null,
        subId,
      );
      if (!updatedProfile) {
        updatedProfile = await findBillingProfileByVerifiedUserId(
          supabase,
          subscription.metadata?.supabase_user_id ?? null,
          subId,
        );
      }
      if (updatedProfile && !updatedProfile.isActive) {
        await handleInactiveAccountSubscription(
          supabase,
          stripeApi,
          subscription,
          updatedProfile.userId,
          'subscription_updated_after_account_deletion',
          updatedProfile.deletionCleanupRequired,
        );
        break;
      }

      const { data: surveyorRow, error: survProbeErr } = await supabase
        .from('surveyor_entitlements').select('user_id').eq('stripe_subscription_id', subId).maybeSingle();
      if (survProbeErr) throw new Error(`Surveyor sub probe failed: ${survProbeErr.message}`);
      if (surveyorRow) {
        console.log(`[stripe-webhook] subscription.updated ${subId} is a Surveyor sub — pause handling is Cartographer-only, ignoring`);
        break;
      }

      if (!updatedProfile?.userId) break;
      // Founders hold premium for life regardless of any subscription state.
      if (updatedProfile.isFounder) {
        console.log(`[stripe-webhook] subscription.updated ${subId} for founder ${updatedProfile.userId} — premium is lifetime, ignoring`);
        break;
      }
      // STALE-SUB GUARD (087 idiom): only act on the user's CURRENTLY-recorded sub, so
      // a redelivered/reordered .updated for an old subscription can't move their tier.
      if (updatedProfile.stripeSubscriptionId && updatedProfile.stripeSubscriptionId !== subId) {
        console.log(`[stripe-webhook] ignoring subscription.updated for ${subId}; user ${updatedProfile.userId}'s current sub is ${updatedProfile.stripeSubscriptionId}`);
        break;
      }

      const isPaused = subscription.pause_collection != null;
      if (isPaused) {
        // JUDGMENT (vetoable): reuse handle_premium_downgrade rather than a new
        // pause-specific state — a paused sub IS a loss of premium access, and the
        // downgrade's 3-month retention window protects the user's assets exactly as a
        // cancellation would (a resume within the window restores cleanly). Idempotent:
        // only a currently-premium user downgrades (a redelivered pause no-ops).
        if (updatedProfile.tier !== 'premium') {
          console.log(`[stripe-webhook] subscription ${subId} paused but user ${updatedProfile.userId} is already not premium — no-op`);
          break;
        }
        const { error: pauseDowngradeErr } = await supabase.rpc('handle_premium_downgrade', { target_user: updatedProfile.userId });
        if (pauseDowngradeErr) throw new Error(`Premium pause-downgrade failed: ${pauseDowngradeErr.message}`);
        const { error: pauseAuthErr } = await supabase.auth.admin.updateUserById(updatedProfile.userId, { user_metadata: { tier: 'free' } });
        if (pauseAuthErr) throw new Error(`Auth pause-downgrade failed: ${pauseAuthErr.message}`);
        // The recorded stripe_subscription_id is deliberately KEPT (unlike .deleted) so
        // a later resume matches it and restores premium.
        console.log(`[stripe-webhook] user ${updatedProfile.userId} downgraded to free while subscription ${subId} is paused`);
      } else if (subscription.status === 'active') {
        // Resume: restore premium ONLY if a prior pause left the user non-premium.
        // A normal active .updated on an already-premium user is a no-op (the common
        // case — most .updated events are routine and must not thrash the tier).
        if (updatedProfile.tier === 'premium') break;
        const { error: resumeProfileErr } = await supabase.from('profiles')
          .update({ tier: 'premium', premium_downgraded_at: null, premium_retention_expires_at: null })
          .eq('id', updatedProfile.userId);
        if (resumeProfileErr) throw new Error(`Resume profile update failed: ${resumeProfileErr.message}`);
        const { error: resumeRestoreErr } = await supabase.rpc('restore_premium_settlements', { target_user: updatedProfile.userId });
        if (resumeRestoreErr) throw new Error(`Resume restore failed: ${resumeRestoreErr.message}`);
        // Auth metadata is only a UI cache. Update it after the database's
        // migration-178 inactive-account trigger and atomic restore have accepted
        // the entitlement, never before.
        const { error: resumeAuthErr } = await supabase.auth.admin.updateUserById(updatedProfile.userId, { user_metadata: { tier: 'premium' } });
        if (resumeAuthErr) throw new Error(`Auth resume-upgrade failed: ${resumeAuthErr.message}`);
        console.log(`[stripe-webhook] user ${updatedProfile.userId} restored to premium after subscription ${subId} resumed`);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      // Downgrade from premium
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer?.id ?? null;
      let profile = await findUserIdForStripeCustomer(
        supabase,
        customerId,
        null,
        subscription.id,
      );
      if (!profile) {
        profile = await findBillingProfileByVerifiedUserId(
          supabase,
          subscription.metadata?.supabase_user_id ?? null,
          subscription.id,
        );
      }

      // SURVEYOR DISCRIMINATION (#16, §14 — must run BEFORE the premium path). A
      // deleted subscription may be a Surveyor sub, not the Cartographer one. Probe
      // the surveyor revoke keyed on THIS sub id first; if it revoked a row, this
      // deletion WAS a Surveyor sub — break, leaving the Cartographer downgrade
      // untouched (its behavioral pins stay green). A non-surveyor sub revokes
      // nothing (returns false) and falls through to the premium logic below.
      const { data: surveyorRevoked, error: surveyorRevokeErr } = await supabase
        .rpc('revoke_surveyor_entitlement_by_subscription', { p_subscription_id: subscription.id });
      if (surveyorRevokeErr) throw new Error(`Surveyor revoke probe failed: ${surveyorRevokeErr.message}`);
      if (profile && !profile.isActive) {
        await handleInactiveAccountSubscription(
          supabase,
          stripeApi,
          subscription,
          profile.userId,
          'subscription_deleted_after_account_deletion',
          profile.deletionCleanupRequired,
        );
        break;
      }
      if (surveyorRevoked) {
        console.log(`[stripe-webhook] subscription ${subscription.id} deleted → Surveyor entitlement revoked (not a Cartographer downgrade)`);
        break;
      }

      if (profile?.userId) {
        if (profile.isFounder) {
          console.log(`User ${profile.userId} kept premium after subscription deletion (Founder Lifetime)`);
          break;
        }
        // IDEMPOTENT (087): a redelivered .deleted on an already-downgraded user
        // must not re-run handle_premium_downgrade (which would re-stamp the
        // retention window each time). Only a currently-premium user downgrades.
        if (profile.tier !== 'premium') {
          console.log(`User ${profile.userId} is already not premium; ignoring subscription.deleted ${subscription.id}`);
          break;
        }
        // STALE-DELETE GUARD (087): Stripe redelivers + reorders webhooks. A
        // .deleted for an OLD subscription must NOT downgrade a user who has since
        // re-subscribed and is currently premium. Only downgrade when the deleted
        // subscription is the user's CURRENTLY-RECORDED one. When we have no
        // recorded id (legacy premium predating the column), fall back to the
        // prior customer-match behavior so a genuine cancellation still downgrades;
        // the next renewal back-fills the id and closes the gap.
        const recordedSub = profile.stripeSubscriptionId;
        if (recordedSub && recordedSub !== subscription.id) {
          console.log(`Ignoring stale subscription.deleted ${subscription.id} for user ${profile.userId}; current subscription is ${recordedSub}`);
          break;
        }
        const { error: downgradeError } = await supabase.rpc('handle_premium_downgrade', {
          target_user: profile.userId,
        });
        if (downgradeError) {
          throw new Error(`Premium downgrade failed: ${downgradeError.message}`);
        }
        const { error: authDowngradeError } = await supabase.auth.admin.updateUserById(profile.userId, {
          user_metadata: { tier: 'free' },
        });
        if (authDowngradeError) {
          throw new Error(`Auth downgrade failed: ${authDowngradeError.message}`);
        }
        // Clear the recorded subscription now that it's gone, so a future
        // re-subscribe records a fresh id and this one can't match again. Fail
        // loud like every other write in this handler.
        const { error: clearErr } = await supabase.from('profiles')
          .update({ stripe_subscription_id: null })
          .eq('id', profile.userId)
          .eq('stripe_subscription_id', subscription.id);   // only if it still matches the deleted sub (race-safe)
        if (clearErr) throw new Error(`Clearing subscription id failed: ${clearErr.message}`);
        console.log(`User ${profile.userId} downgraded to free with retention window`);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

// Wrap in a 1-arg lambda so the handler's optional `deps` param doesn't clash with
// std/http's Handler signature (req, connInfo) — `deno check` (check:edge) flagged
// the direct `serve(handler)` as a Handler-shape mismatch. The deps default applies.
serve((req) => handleStripeWebhook(req));
