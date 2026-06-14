import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import { botGuard } from '../_shared/requestMeta.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' });

function corsHeaders(req: Request) {
  const configured = Deno.env.get('CLIENT_URL') || '';
  const allowed = [
    configured,
    'https://settlementforge.com',
    'https://www.settlementforge.com',
    'https://settlementwork.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
  ].filter(Boolean);
  const origin = req.headers.get('Origin') || '';
  const accepted = !origin || allowed.includes(origin);
  return {
    'Access-Control-Allow-Origin': accepted ? (origin || '*') : allowed[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    ...(accepted ? { Vary: 'Origin' } : {}),
  };
}

serve(async req => {
  const headers = corsHeaders(req);
  if (req.method === 'OPTIONS') return new Response(null, { headers });

  const guard = botGuard(req, 'verify-single-dossier');
  if (guard.reject) return guard.reject;

  try {
    const { sessionId, checkoutToken } = await req.json();
    // Bound the length before the charset check: a real Stripe checkout session
    // id is well under 100 chars, so cap generously. Without this the
    // `[A-Za-z0-9]+` pattern would accept a multi-megabyte string and still
    // forward it to Stripe — cheap to reject here, wasteful to send.
    if (typeof sessionId !== 'string' || sessionId.length > 200
      || !/^cs_(test_|live_)?[A-Za-z0-9]+$/.test(sessionId)) {
      throw new Error('Invalid checkout session');
    }
    if (typeof checkoutToken !== 'string' || checkoutToken.length < 24 || checkoutToken.length > 128) {
      throw new Error('Invalid checkout token');
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === 'paid' || session.payment_status === 'no_payment_required';
    const verified = session.status === 'complete'
      && paid
      && session.metadata?.product === 'single_dossier'
      && session.metadata?.checkout_token === checkoutToken;

    if (!verified) {
      return new Response(JSON.stringify({ verified: false, error: 'Purchase not verified' }), {
        status: 403,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ verified: true, sessionId: session.id }), {
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Purchase verification failed';
    return new Response(JSON.stringify({ verified: false, error: message }), {
      status: 400,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }
});
