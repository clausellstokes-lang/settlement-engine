/**
 * Supabase Edge Function: stripe-webhook
 *
 * Handles Stripe webhook events:
 *   - checkout.session.completed → credit top-up, subscription upgrade,
 *                                  founder lifetime grant, single dossier
 *   - customer.subscription.deleted → downgrade from premium
 *
 * Credit grants:
 *   All Stripe-originated grants go through the service-role-only
 *   `system_grant_credits` RPC. The RPC owns the compatibility writes
 *   to credit_ledger, credit_transactions, profiles.credits, and the
 *   admin audit trail in one database transaction.
 *
 * Environment variables:
 *   STRIPE_SECRET_KEY       — Stripe secret key
 *   STRIPE_WEBHOOK_SECRET   — Webhook signing secret
 *   SUPABASE_SERVICE_ROLE_KEY — Service role key (bypasses RLS)
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';

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
    console.error('[stripe-webhook] system_grant_credits RPC failed:', rpcErr.message);
    throw new Error(`Credit grant failed: ${rpcErr.message}`);
  }
}

async function findUserIdForStripeCustomer(
  supabase: ReturnType<typeof adminClient>,
  customerId: string | null,
  fallbackEmail?: string | null,
) {
  if (customerId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, is_founder')
      .eq('stripe_customer_id', customerId)
      .maybeSingle();
    if (profile?.id) return { userId: profile.id as string, isFounder: Boolean(profile.is_founder) };
  }

  let email = fallbackEmail || null;
  if (!email && customerId) {
    try {
      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
      email = customer.email || null;
    } catch (e) {
      console.warn('[stripe-webhook] customer lookup failed:', e);
    }
  }
  if (!email) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, is_founder')
    .ilike('email', email)
    .maybeSingle();
  if (!profile?.id) return null;

  if (customerId) {
    const { error } = await supabase.from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', profile.id);
    if (error) throw new Error(`Stripe customer binding failed: ${error.message}`);
  }
  return { userId: profile.id as string, isFounder: Boolean(profile.is_founder) };
}

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

  const { data: existing } = await supabase
    .from('credit_ledger')
    .select('id')
    .eq('source', 'monthly_allowance')
    .eq('metadata->>stripe_invoice_id', invoice.id)
    .maybeSingle();
  if (existing?.id) return;

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
}

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

serve(async (req) => {
  // ── Signature verification — MUST run before any metadata read ─────
  const signature = req.headers.get('stripe-signature');
  if (!signature) return new Response('Missing signature', { status: 400 });

  let event: Stripe.Event;
  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  const supabase = adminClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
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
        const { error } = await supabase.auth.admin.updateUserById(userId!, {
          user_metadata: { tier: 'premium' },
        });
        if (error) throw new Error(`Failed to upgrade user: ${error.message}`);

        const { error: profileError } = await supabase.from('profiles').update({
          tier: 'premium',
          stripe_customer_id: typeof session.customer === 'string' ? session.customer : session.customer?.id || null,
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

        // Founder bonus: one-time 30-credit grant.
        await grantCredits(supabase, userId!, 30, 'founder_grant', {
          stripe_session_id: session.id,
        });
        console.log(`User ${userId} upgraded to Founder Lifetime (+30 credits)`);
      } else if (product === 'single_dossier') {
        // One-shot purchase, no account required. Nothing to mutate on
        // user state — the customer's receipt + the success-page redirect
        // (handled client-side via session_id query param) deliver the PDF.
        // We log it so audit can match against Stripe payments.
        console.log(`single_dossier purchased: session=${session.id} email=${session.customer_email}`);
      } else if (credits > 0) {
        // Credit pack purchase. The RPC handles ledger, legacy counter,
        // compatibility table, and audit writes atomically.
        await grantCredits(supabase, userId!, credits, 'purchase', {
          stripe_session_id: session.id,
        });
        console.log(`Added ${credits} credits to user ${userId}`);
      }
      break;
    }

    case 'invoice.paid':
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      await grantMonthlyAllowanceIfNeeded(supabase, invoice);
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
        console.log(`User ${profile.userId} downgraded to free with retention window`);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
