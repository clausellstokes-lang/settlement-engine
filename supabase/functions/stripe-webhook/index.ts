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

/**
 * STRICT binding lookup (finding F5): resolve a profile ONLY by an
 * already-established stripe_customer_id link. That link is written exactly
 * once, at checkout.session.completed, from the server-verified
 * metadata.supabase_user_id — never from an email. This function never falls
 * back to email and never mutates the binding, so it is safe to gate
 * DESTRUCTIVE lifecycle events (subscription downgrade → settlement purge) on it.
 */
async function findUserByStripeCustomerId(
  supabase: ReturnType<typeof adminClient>,
  customerId: string | null,
) {
  if (!customerId) return null;
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, is_founder')
    .eq('stripe_customer_id', customerId)
    .maybeSingle();
  return profile?.id ? { userId: profile.id as string, isFounder: Boolean(profile.is_founder) } : null;
}

/**
 * ADDITIVE-grant lookup for invoice events: prefer the customer-id binding,
 * else an EXACT, case-normalized email match. Deliberately does NOT bind
 * stripe_customer_id from the email match — that unconditional overwrite was an
 * account-hijack primitive: a paying attacker who set their Stripe customer
 * email to a victim's address would clobber the victim's binding and feed the
 * downgrade/purge path (finding F5). `ilike` is replaced by `eq` on a
 * lowercased value to kill %/_ wildcard injection. Read-only and idempotent;
 * a miss is fail-safe (no state change). Used only for CREDIT GRANTS, never for
 * a destructive action.
 */
async function findUserForInvoiceGrant(
  supabase: ReturnType<typeof adminClient>,
  customerId: string | null,
  fallbackEmail?: string | null,
) {
  const byId = await findUserByStripeCustomerId(supabase, customerId);
  if (byId) return byId;

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

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, is_founder')
    .eq('email', email.trim().toLowerCase())
    .maybeSingle();
  return profile?.id ? { userId: profile.id as string, isFounder: Boolean(profile.is_founder) } : null;
}

async function grantMonthlyAllowanceIfNeeded(
  supabase: ReturnType<typeof adminClient>,
  invoice: Stripe.Invoice,
) {
  const customerId = typeof invoice.customer === 'string'
    ? invoice.customer
    : invoice.customer?.id || null;
  const profile = await findUserForInvoiceGrant(supabase, customerId, invoice.customer_email || null);
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

// Exported (not just inlined into serve) so the trust boundary can be
// EXECUTION-tested: index.test.ts feeds forged vs. correctly-signed requests and
// asserts no DB write happens before signature verification. `deps.adminClient`
// is an optional injection seam for the test's recording stub; production passes
// nothing, so behavior is identical to the previous inline handler.
export async function handleStripeWebhook(
  req: Request,
  deps: { adminClient?: typeof adminClient } = {},
): Promise<Response> {
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
    console.error('Webhook signature verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  const supabase = (deps.adminClient ?? adminClient)();

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
        // One-shot purchase, no account required. Bind the paid Stripe session
        // to the server-persisted dossier (findings F21/F23) so the settlement
        // is recoverable server-side even if the buyer's browser never returns.
        // Idempotent: re-processing the same event writes the same session id to
        // the same token row (a no-op). A missing row (persistence hiccuped at
        // checkout) is not an error — the client stash is the fallback.
        const token = session.metadata?.checkout_token;
        if (token) {
          const { error: bindErr } = await supabase
            .from('dossier_purchases')
            .update({ stripe_session_id: session.id })
            .eq('checkout_token', token);
          if (bindErr) {
            console.warn(`[stripe-webhook] dossier session bind failed for token: ${bindErr.message}`);
          }
        }
        // PII: do NOT log customer_email — the session id reconciles to the email
        // inside Stripe's own access controls. (A+ P0.2)
        console.log(`single_dossier purchased: session=${session.id}`);
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

      // Destructive path (downgrade → retention purge): resolve ONLY by the
      // established customer-id binding, never by email (finding F5). An
      // unbound customer we can't safely map is logged and skipped, not guessed.
      const profile = await findUserByStripeCustomerId(supabase, customerId);
      if (!profile?.userId) {
        console.warn(`[stripe-webhook] subscription.deleted for unbound customer ${customerId} — no profile bound; skipping downgrade`);
      }
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
}

serve(handleStripeWebhook);
