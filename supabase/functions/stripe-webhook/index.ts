/**
 * Supabase Edge Function: stripe-webhook
 *
 * Handles Stripe webhook events:
 *   - checkout.session.completed → credit top-up or premium upgrade
 *   - customer.subscription.deleted → downgrade from premium
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

      if (!userId) {
        console.error('No supabase_user_id in session metadata');
        break;
      }

      if (product === 'premium') {
        // Upgrade user tier to premium
        const { error } = await supabase.auth.admin.updateUserById(userId, {
          user_metadata: { tier: 'premium' },
        });
        if (error) console.error('Failed to upgrade user:', error);

        // Also update profiles table
        await supabase.from('profiles').update({ tier: 'premium' }).eq('id', userId);

        console.log(`User ${userId} upgraded to premium`);
      } else if (credits > 0) {
        // Add credits to user's balance
        const { error } = await supabase.from('credit_transactions').insert({
          user_id: userId,
          amount: credits,
          reason: 'purchase',
        });
        if (error) console.error('Failed to record credit purchase:', error);

        // Update credits in profiles (running total)
        const { data: profile } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', userId)
          .single();

        if (profile) {
          await supabase.from('profiles')
            .update({ credits: (profile.credits || 0) + credits })
            .eq('id', userId);
        }

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
