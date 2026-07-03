/**
 * Supabase Edge Function: stripe-webhook
 *
 * Handles Stripe webhook events:
 *   - checkout.session.completed → credit top-up, subscription upgrade,
 *                                  founder lifetime grant, single dossier,
 *                                  redeem-code apply (107)
 *   - checkout.session.expired → redeem-code seat release (107)
 *   - customer.subscription.deleted → downgrade from premium
 *   - invoice.paid → monthly allowance + referral qualification (107)
 *   - charge.refunded / charge.dispute.created / invoice.payment_failed
 *     → referral clawback (107)
 *
 * Credit grants:
 *   All Stripe-originated grants go through the service-role-only
 *   `system_grant_credits` RPC. The RPC owns the compatibility writes
 *   to credit_ledger, credit_transactions, profiles.credits, and the
 *   admin audit trail in one database transaction.
 *
 * Idempotency (two belts):
 *   EVENT level — each verified event id is claimed once in
 *   processed_webhook_events (107); a duplicate delivery acks 200
 *   '[duplicate]' without running any handler, and a handler failure
 *   releases the claim so Stripe's retry re-runs.
 *   GRANT level (authoritative) — system_grant_credits' atomic claim (024)
 *   plus the per-invoice / per-session ledger dedup. The event claim fails
 *   OPEN because these inner guards are the real protection for money.
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
 * the AUTHORITATIVE, race-safe guarantee is in system_grant_credits (migration
 * 024), which atomically claims (source, idempotency_key=stripe_session_id) via
 * INSERT ... ON CONFLICT DO NOTHING before granting — so even two truly-concurrent
 * redeliveries that both pass this SELECT cannot double-grant. Do not remove the
 * RPC's atomic claim on the strength of this pre-check alone.
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
  // Per-ACCOUNT idempotency: the founder bonus is once-per-account, not
  // once-per-session — a SECOND founder_lifetime purchase (a new checkout session)
  // must not re-grant the 30-credit bonus. (Credit-pack purchases stay
  // once-per-session: a user can buy the same pack repeatedly.)
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
) {
  if (customerId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, is_founder, stripe_subscription_id, tier')
      .eq('stripe_customer_id', customerId)
      .maybeSingle();
    if (profile?.id) return { userId: profile.id as string, isFounder: Boolean(profile.is_founder), stripeSubscriptionId: (profile.stripe_subscription_id as string | null) ?? null, tier: (profile.tier as string | null) ?? null };
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
    .select('id, is_founder, stripe_subscription_id, tier');
  const { data: profile } = email.includes('*')
    ? await baseQuery().eq('email', email).maybeSingle()
    : await baseQuery().ilike('email', email.replace(/([\\%_])/g, '\\$1')).maybeSingle();
  if (!profile?.id) return null;

  if (customerId) {
    const { error } = await supabase.from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', profile.id);
    if (error) throw new Error(`Stripe customer binding failed: ${error.message}`);
  }
  return { userId: profile.id as string, isFounder: Boolean(profile.is_founder), stripeSubscriptionId: (profile.stripe_subscription_id as string | null) ?? null, tier: (profile.tier as string | null) ?? null };
}

// Returns the resolved profile so the invoice.paid case can run the referral
// qualification (107) against the same customer→user binding without a second
// resolution round trip.
async function grantMonthlyAllowanceIfNeeded(
  supabase: ReturnType<typeof adminClient>,
  invoice: Stripe.Invoice,
) {
  const customerId = typeof invoice.customer === 'string'
    ? invoice.customer
    : invoice.customer?.id || null;
  const profile = await findUserIdForStripeCustomer(supabase, customerId, invoice.customer_email || null);
  if (!profile?.userId) {
    throw new Error(`Monthly allowance invoice ${invoice.id} has no matching profile`);
  }

  // Only SUBSCRIPTION invoices carry the monthly allowance. A non-subscription
  // invoice (manual / one-off) must NOT grant 30 credits or back-fill a sub id.
  // (Stripe always sets billing_reason; an absent value ⇒ proceed for back-compat.)
  if (invoice.billing_reason
    && invoice.billing_reason !== 'subscription_create'
    && invoice.billing_reason !== 'subscription_cycle') {
    return profile;
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

  // ── Event-level idempotency claim (107) ─────────────────────────────
  // Stripe delivers at-least-once: the same event id can arrive twice
  // (retry backoff, endpoint timeout, dashboard resend). Every grant below
  // carries its own AUTHORITATIVE per-grant guard (system_grant_credits'
  // atomic claim from 024, the invoice/session ledger dedup, the 087
  // stale-sub checks) — this claim is the outer belt that stops a duplicate
  // delivery from re-running any handler at all, which matters for
  // multi-step handlers whose steps are not individually deduped.
  // processed_webhook_events.event_id is the PRIMARY KEY, so the INSERT is
  // an atomic claim: of two truly-concurrent deliveries exactly one wins;
  // the loser reads the unique violation (or a zero-row insert under
  // ON CONFLICT DO NOTHING semantics) and acks without acting.
  // This runs strictly AFTER signature verification — an unsigned POST must
  // never be able to write a claim row (or squat on a future event id).
  let eventClaimed = false;
  const { data: claimRow, error: claimErr } = await supabase
    .from('processed_webhook_events')
    .insert({ event_id: event.id, event_type: event.type })
    .select('event_id')
    .maybeSingle();
  if (claimErr) {
    if (claimErr.code === '23505') {
      // unique_violation → this event id was already claimed by a prior
      // (or concurrent) delivery. Ack 200 so Stripe stops redelivering.
      console.log(`[stripe-webhook] event ${event.id} already processed — skipping (duplicate delivery)`);
      return new Response('[duplicate]', { status: 200 });
    }
    // Any OTHER claim failure (table not yet migrated, transient PostgREST
    // error) fails OPEN into the handlers: the per-grant idempotency is
    // authoritative for money, so availability beats strictness here —
    // a broken claim table must not stall real fulfillment.
    console.warn(`[stripe-webhook] event claim failed for ${event.id} (${claimErr.message}) — proceeding; per-grant idempotency still protects the money path`);
  } else if (!claimRow) {
    // Zero-row insert = the ON CONFLICT DO NOTHING path swallowed a duplicate.
    console.log(`[stripe-webhook] event ${event.id} already processed — skipping (duplicate delivery)`);
    return new Response('[duplicate]', { status: 200 });
  } else {
    eventClaimed = true;
  }

  try {
    await dispatchStripeEvent(event, supabase, stripeApi, deps.referralEmailDispatch);
  } catch (handlerErr) {
    // A handler failure must keep Stripe's retry loop alive: every `throw`
    // inside the handlers exists precisely so a non-2xx makes Stripe
    // redeliver. Holding the claim here would turn that redelivery into
    // '[duplicate]' and silently drop the fulfillment — so release the claim
    // (best-effort) before rethrowing. If the release itself fails we warn
    // and still rethrow; the operator sees the failure in Stripe's dashboard
    // either way, and a manual resend after fixing the claim row recovers.
    if (eventClaimed) {
      const { error: releaseErr } = await supabase
        .from('processed_webhook_events')
        .delete()
        .eq('event_id', event.id);
      if (releaseErr) {
        console.warn(`[stripe-webhook] failed to release event claim ${event.id} after handler error (${releaseErr.message}) — a redelivery will read [duplicate]; resolve via the processed_webhook_events row`);
      }
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

// The per-event handlers, extracted from the inline switch so the claim/release
// bracket above stays readable. Behavior is IDENTICAL to the previous inline
// switch — every guard, log line, and throw is preserved verbatim.
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

      // REDEEM (107): a paid session that carried a reserved redeem code is
      // flipped BEFORE fulfilment, whatever product it bought, so a
      // fulfilment failure's redelivery finds the claim already taken and
      // cannot re-run the redeem grant; the fulfilment steps below are each
      // individually idempotent and re-run fine. A session with no code
      // no-ops here (no_reserved_redemption).
      await applyRedemptionIfBound(supabase, session.id);

      const userId  = session.metadata?.supabase_user_id;
      const product = session.metadata?.product;
      const credits = parseInt(session.metadata?.credits || '0', 10);

      // single_dossier is the only product that may legitimately have no
      // supabase_user_id (it doesn't require an account). Everything else
      // does — bail with a log so we get a Stripe dashboard breadcrumb.
      if (!userId && product !== 'single_dossier') {
        throw new Error('No supabase_user_id in session metadata');
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

        const { error } = await supabase.auth.admin.updateUserById(userId!, {
          user_metadata: { tier: 'premium' },
        });
        if (error) throw new Error(`Failed to upgrade user: ${error.message}`);

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
        console.log(`User ${userId} upgraded to premium (Cartographer)`);
      } else if (product === 'founder_lifetime') {
        // Founder Lifetime: $99 one-time. Gives Cartographer access forever +
        // the founder badge. We store tier='premium' (so all the existing
        // tier-gated UI keeps working) and set is_founder=true so the badge
        // and Founder-only surfaces can light up. A NULL expires_at in the
        // ledger marks this as a perpetual grant.
        const { error } = await supabase.auth.admin.updateUserById(userId!, {
          user_metadata: { tier: 'premium', is_founder: true },
        });
        if (error) throw new Error(`Failed to upgrade user to founder: ${error.message}`);

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

        // Founder bonus: one-time 30-credit grant (idempotent on session id).
        await grantCreditsForSessionOnce(supabase, userId!, 30, 'founder_grant', session.id, /* oncePerUser */ true);
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
        console.log(`single_dossier purchased: session=${session.id}`);
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
      break;
    }

    case 'invoice.paid':
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      const profile = await grantMonthlyAllowanceIfNeeded(supabase, invoice);
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
      }
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

    case 'customer.subscription.deleted': {
      // Downgrade from premium
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const profile = await findUserIdForStripeCustomer(supabase, customerId);
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
