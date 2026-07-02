/**
 * Supabase Edge Function: create-customer-portal
 *
 * Creates a Stripe Billing Portal session for the signed-in user.
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.108.2';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import { botGuard } from '../_shared/requestMeta.ts';
import { logError } from '../_shared/logError.ts';
// One CORS allowlist for every edge function (incl. Cloudflare Pages preview).
import { getCorsHeaders as sharedCorsHeaders } from '../_shared/cors.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' });

// CORS: fail-closed via the shared allowlist; never '*' for this credentialed
// endpoint. Advertises POST/OPTIONS.
function getCorsHeaders(req?: Request) {
  return sharedCorsHeaders(req, { methods: 'POST, OPTIONS' });
}

/** Default user-scoped client (anon key + the caller's Authorization header). */
function defaultUserClient(authHeader: string) {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );
}

/** Default service-role client (bypasses RLS for the profile read/write). */
function defaultAdminClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
}

// Exported (not just inlined into serve) so the portal gate can be EXECUTION-
// tested: index.test.ts feeds requests with injected stubs and asserts the
// customer the portal session binds to is claimed by verified identity
// (metadata.supabase_user_id), never by bare email match. `deps` is the
// optional injection seam; production passes nothing. Mirrors create-checkout.
export async function handleCreateCustomerPortal(
  req: Request,
  deps: {
    stripeClient?: typeof stripe;
    userClient?: (authHeader: string) => ReturnType<typeof createClient>;
    adminClient?: () => ReturnType<typeof createClient>;
  } = {},
): Promise<Response> {
  const stripeApi = deps.stripeClient ?? stripe;
  const userClient = deps.userClient ?? defaultUserClient;
  const adminClient = deps.adminClient ?? defaultAdminClient;
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const guard = botGuard(req, 'create-customer-portal');
  if (guard.reject) return guard.reject;

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing authorization header');

    const supabaseUser = userClient(authHeader);
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) throw new Error('Not authenticated');

    const supabaseAdmin = adminClient();
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .maybeSingle();

    let customerId = profile?.stripe_customer_id || null;
    if (!customerId) {
      if (!user.email) throw new Error('Account email required for billing portal');
      // Bind by VERIFIED identity, never bare email: only reuse an existing
      // customer whose metadata.supabase_user_id matches the JWT-verified user
      // (covers a prior create-checkout customer whose profile write raced).
      // An email-only match could be someone else's customer — opening the
      // billing portal on it would expose their payment methods and let this
      // caller cancel their subscription. Otherwise create a fresh customer
      // keyed to the user id, matching create-checkout's own path.
      const existing = await stripeApi.customers.list({ email: user.email, limit: 10 });
      const identityMatch = existing.data.find(
        (c: { metadata?: Record<string, string> }) => c.metadata?.supabase_user_id === user.id,
      );
      const customer = identityMatch ?? await stripeApi.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      await supabaseAdmin
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    const clientUrl = Deno.env.get('CLIENT_URL') || 'http://localhost:5173';
    const session = await stripeApi.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${clientUrl}?view=account`,
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    // Log the raw Stripe/RPC message server-side (greppable), but return a
    // generic client message — raw .message can echo Stripe internals or
    // Postgres function/constraint names. Mirrors create-checkout's catch.
    const message = err instanceof Error ? err.message : 'Unknown error';
    logError('create-customer-portal', null, message);
    return new Response(
      JSON.stringify({ error: 'The billing portal could not be opened. Please try again.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
}

// Wrap in a 1-arg lambda so the handler's optional `deps` param doesn't clash with
// std/http's Handler signature (req, connInfo) — same as create-checkout.
serve((req) => handleCreateCustomerPortal(req));
