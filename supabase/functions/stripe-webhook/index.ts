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
 * Dual-write a credit grant to both the legacy credit_transactions
 * table and the new credit_ledger (migration 007). Also increments
 * profiles.credits so the legacy fallback path keeps showing the
 * correct balance until everyone is reading from get_credit_balance().
 *
 * Failures in either write are logged but don't throw — we'd rather
 * have a partial record than silently swallow a Stripe webhook.
 */
async function dualWriteGrant(
  supabase: ReturnType<typeof adminClient>,
  userId: string,
  amount: number,
  source: string,
  metadata: Record<string, unknown> = {},
) {
  // 1. Legacy table.
  const { error: legacyErr } = await supabase.from('credit_transactions').insert({
    user_id: userId,
    amount,
    reason: source,
  });
  if (legacyErr) console.error('Failed to write credit_transactions:', legacyErr);

  // 2. New ledger. The table may not exist yet if migration 007 hasn't
  // been applied — silently log and continue so the legacy path still
  // grants the credits.
  const { error: ledgerErr } = await supabase.from('credit_ledger').insert({
    user_id: userId,
    kind: 'grant',
    amount,
    source,
    metadata,
  });
  if (ledgerErr) console.warn('credit_ledger write skipped (migration 007 may not be applied):', ledgerErr.message);

  // 3. Bump the counter on profiles.credits so the legacy balance
  // reader stays accurate. The new RPC computes from the ledger and
  // doesn't depend on this — but until everyone's on the new client,
  // both paths need to agree.
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

serve(async (req) => {
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
