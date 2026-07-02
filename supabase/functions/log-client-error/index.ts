/**
 * log-client-error — production sink for client-side error reports.
 *
 * src/lib/errorReporter.js fire-and-forgets a small JSON payload (sendBeacon →
 * fetch+keepalive) to VITE_ERROR_REPORT_URL on render crashes / unhandled
 * rejections. This is that endpoint: it bounds + stores the report in
 * public.client_error_events (migration 081) so a solo operator can SEE shipped
 * regressions instead of waiting for a user complaint.
 *
 * Trust posture: ANONYMOUS by design (sendBeacon cannot set an Authorization
 * header, and a crash may happen before/after auth). So it is hardened like the
 * other anon endpoints — bot-guarded, payload length-bounded, IP hashed (never
 * stored raw), and per-IP rate-limited so it cannot be flooded into a storage
 * bill. Deploy with verify_jwt = false (config.toml).
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { botGuard, readRequestMeta } from '../_shared/requestMeta.ts';
import { getCorsHeaders as sharedCorsHeaders } from '../_shared/cors.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
// Reuse the analytics IP pepper so a raw IP is never stored or correlatable
// across tables without the secret.
const PEPPER = Deno.env.get('ANALYTICS_HASH_PEPPER') || '';

// Per-IP throttle: at most this many reports per rolling minute. A genuine crash
// loop emits a handful; this only stops a deliberate flood.
const RATE_PER_MINUTE = 60;

function corsHeaders(req: Request) {
  return sharedCorsHeaders(req, { methods: 'POST, OPTIONS' });
}

function json(payload: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}

async function sha256hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Bound a free-text field: coerce to string, cap length, else null. */
function strBound(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null;
  const s = v.slice(0, max);
  return s.length ? s : null;
}

function defaultAdminClient() {
  return createClient(SUPABASE_URL!, SERVICE_KEY!);
}

/**
 * Exported handler with an injectable `deps` seam (production passes nothing) so
 * the trust boundary — bot reject, method gate, payload bounding, rate limit,
 * insert shape — is execution-testable without a live Supabase.
 */
export async function handleLogClientError(
  req: Request,
  deps: { adminClient?: () => ReturnType<typeof createClient> } = {},
): Promise<Response> {
  const makeAdminClient = deps.adminClient ?? defaultAdminClient;
  const cors = corsHeaders(req);

  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, cors);

  // Bot guard: a real browser's sendBeacon/fetch carries a browser UA; obvious
  // automation is rejected at the door (same policy as the other anon sinks).
  const guard = botGuard(req, 'log-client-error');
  if (guard.reject) return guard.reject;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400, cors);
  }
  if (!body || typeof body !== 'object') return json({ error: 'Invalid body' }, 400, cors);

  const meta = readRequestMeta(req);
  const ipHash = await sha256hex(`${meta.ip}|${PEPPER}`);

  const admin = makeAdminClient();

  // Per-IP rate limit. FAIL CLOSED on a limiter error: the count query and the
  // insert run through the same client against the same table, so if counting
  // can't run, storing almost certainly can't either — dropping loses no report
  // we could have kept, while failing open would let a limiter hiccup remove
  // the only throttle on this anonymous service-role insert path. Over-window
  // and limiter-error reports alike get a 202 accepted-but-not-stored; the
  // fire-and-forget reporter never sees an error.
  try {
    const since = new Date(Date.now() - 60_000).toISOString();
    const { count, error } = await admin
      .from('client_error_events')
      .select('id', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .gte('created_at', since);
    if (error || typeof count !== 'number' || count >= RATE_PER_MINUTE) {
      return json({ ok: true, throttled: true }, 202, cors);
    }
  } catch {
    // Same posture as a returned limiter error: drop, never surface a failure.
    return json({ ok: true, throttled: true }, 202, cors);
  }

  const row = {
    kind: strBound(body.kind, 64) ?? 'error',
    message: strBound(body.message, 1000) ?? 'unknown error',
    stack: strBound(body.stack, 4000),
    component_stack: strBound(body.componentStack, 4000),
    url: strBound(body.url, 2000),
    ua: strBound(meta.ua, 500),
    release: strBound(body.release, 100),
    ip_hash: ipHash,
  };

  const { error } = await admin.from('client_error_events').insert(row);
  if (error) {
    // The reporter is fire-and-forget; still log server-side for the operator.
    console.error('[log-client-error] insert failed:', error.message);
    return json({ ok: false }, 500, cors);
  }
  return json({ ok: true }, 200, cors);
}

if (import.meta.main) {
  serve((req) => handleLogClientError(req));
}
