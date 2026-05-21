/**
 * Supabase Edge Function: stripe-webhook
 *
 * Handles Stripe webhook events:
 *   - checkout.session.completed → credit top-up, subscription upgrade,
 *                                  founder lifetime grant, single dossier
 *   - customer.subscription.deleted → downgrade from premium
 *
 * Ledger dual-write:
 *   For credit purchases we write to BOTH tables — credit_transactions
 *   (legacy) and credit_ledger (new, see migration 007). The legacy
 *   table stays the system of record until we're confident the ledger
 *   is producing balances that match. The client falls back to the
 *   legacy profiles.credits counter when the ledger RPC isn't yet
 *   exposed, so dual-write is the safe path during the transition.
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
 * Ledger-consistent credit grant — migrated to the system_grant_credits
 * RPC (migration 012) as part of the Tier 9.9 refund-ledger audit.
 *
 * The RPC writes to credit_ledger + credit_transactions + profiles
 * atomically inside a single SECURITY DEFINER transaction, with an
 * admin_actions row for traceability. No more read-then-write race
 * on the profiles counter.
 *
 * Falls back to the legacy direct-write pattern if the RPC fails
 * (e.g. migration 012 hasn't been applied yet on a particular
 * environment). The fallback should be removed once migration 012 is
 * confirmed in all envs — track removal via the audit doc.
 */
async function dualWriteGrant(
  supabase: ReturnType<typeof adminClient>,
  userId: string,
  amount: number,
  source: string,
  metadata: Record<string, unknown> = {},
) {
  // Preferred path: ledger-consistent RPC. Single atomic transaction.
  const { error: rpcErr } = await supabase.rpc('system_grant_credits', {
    target_user: userId,
    amount,
    source,
    metadata,
  });

  if (!rpcErr) return;  // success — nothing else to do

  // Fallback: if the RPC isn't deployed yet (migration 012 missing on
  // staging / a fresh dev env), fall through to the legacy three-step
  // pattern so credits still land. Surface the RPC error so we know
  // to investigate.
  console.warn(
    '[stripe-webhook] system_grant_credits RPC failed; falling back to legacy direct-write path. Confirm migration 012 is applied. Error:',
    rpcErr.message,
  );

  // 1. Legacy table.
  const { error: legacyErr } = await supabase.from('credit_transactions').insert({
    user_id: userId,
    amount,
    reason: source,
  });
  if (legacyErr) console.error('Failed to write credit_transactions:', legacyErr);

  // 2. New ledger.
  const { error: ledgerErr } = await supabase.from('credit_ledger').insert({
    user_id: userId,
    kind: 'grant',
    amount,
    source,
    metadata,
  });
  if (ledgerErr) console.warn('credit_ledger write skipped (migration 007 may not be applied):', ledgerErr.message);

  // 3. Atomic profile counter bump using arithmetic increment to avoid
  // the read-then-write race in the original pattern.
  const { error: bumpErr } = await supabase.rpc('exec_sql_increment_credits', {
    target_user: userId,
    increment_by: amount,
  }).catch(() => ({ error: { message: 'fallback-rpc-missing' } }));

  if (bumpErr) {
    // Last-resort: read-then-write. Documented racy; remains because
    // a failed counter bump on a successful Stripe purchase is worse
    // than a (very narrow-window) racy bump.
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();
    if (profile) {
      await supabase.from('profiles')
        .update({ credits: (profile.credits || 0) + amount })
        .eq('id', userId);
    }
  }
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
        console.error('No supabase_user_id in session metadata');
        break;
      }

      if (product === 'premium') {
        // Cartographer subscription (legacy SKU key kept = "premium" so
        // existing customers' subscriptions keep flowing into the same code).
        const { error } = await supabase.auth.admin.updateUserById(userId!, {
          user_metadata: { tier: 'premium' },
        });
        if (error) console.error('Failed to upgrade user:', error);

        await supabase.from('profiles').update({ tier: 'premium' }).eq('id', userId);
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
        if (error) console.error('Failed to upgrade user to founder:', error);

        await supabase.from('profiles')
          .update({ tier: 'premium', is_founder: true })
          .eq('id', userId);

        // Founder bonus: also seed 100 credits as a welcome.
        await dualWriteGrant(supabase, userId!, 100, 'founder_grant', {
          stripe_session_id: session.id,
        });
        console.log(`User ${userId} upgraded to Founder Lifetime (+100 credits)`);
      } else if (product === 'single_dossier') {
        // One-shot purchase, no account required. Nothing to mutate on
        // user state — the customer's receipt + the success-page redirect
        // (handled client-side via session_id query param) deliver the PDF.
        // We log it so audit can match against Stripe payments.
        console.log(`single_dossier purchased: session=${session.id} email=${session.customer_email}`);
      } else if (credits > 0) {
        // Credit pack purchase. Dual-write: legacy credit_transactions
        // table (current source of truth) + new credit_ledger (forward).
        await dualWriteGrant(supabase, userId!, credits, 'purchase', {
          stripe_session_id: session.id,
        });
        console.log(`Added ${credits} credits to user ${userId}`);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      // Downgrade from premium
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      // Find user by Stripe customer ID — look up via email
      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
      if (customer.email) {
        const { data: users } = await supabase.auth.admin.listUsers();
        const user = users?.users?.find(u => u.email === customer.email);
        if (user) {
          await supabase.auth.admin.updateUserById(user.id, {
            user_metadata: { tier: 'free' },
          });
          await supabase.from('profiles').update({ tier: 'free' }).eq('id', user.id);
          console.log(`User ${user.id} downgraded to free`);
        }
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
