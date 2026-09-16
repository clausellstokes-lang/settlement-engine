/**
 * health — liveness + optional deep DB probe for uptime monitoring.
 *
 * A trivial, ALWAYS-anonymous endpoint an external uptime service (UptimeRobot /
 * Better Stack / Pingdom — all already on the requestMeta allow-list) or the
 * bundled scripts/ops/uptime-probe.mjs can poll:
 *
 *   GET /functions/v1/health          → 200 { ok, service, ts, release? }  (liveness)
 *   GET /functions/v1/health?deep=1   → 200 { ..., db:'up' }   when the DB round-trips
 *                                       503 { ..., db:'down' } when it does not
 *                                       200 { ..., db:'unknown' } when unconfigured
 *
 * DELIBERATELY not bot-guarded: monitors ARE automated clients. Liveness needs no
 * env and no DB — it proves the edge runtime serves. The deep probe is opt-in so
 * a transient DB blip never flaps the basic liveness signal. Deploy with
 * verify_jwt = false (config.toml). No PII, no request logging.
 */
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.108.2';
import { getCorsHeaders as sharedCorsHeaders } from '../_shared/cors.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const RELEASE = Deno.env.get('RELEASE') || Deno.env.get('VITE_RELEASE') || '';

function corsHeaders(req: Request) {
  return sharedCorsHeaders(req, { methods: 'GET, HEAD, OPTIONS' });
}

function json(payload: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

/** Cheap DB connectivity probe: a head-count on the bounded ops table (081). */
async function defaultDbPing(): Promise<boolean> {
  if (!SUPABASE_URL || !SERVICE_KEY) return false;
  const admin = createClient(SUPABASE_URL, SERVICE_KEY);
  const { error } = await admin
    .from('client_error_events')
    .select('id', { head: true, count: 'exact' })
    .limit(1);
  return !error;
}

/**
 * Exported handler with an injectable `dbPing` seam (production passes nothing)
 * so the method gate + liveness shape + deep up/down branches are testable
 * without a live Supabase.
 */
export async function handleHealth(
  req: Request,
  deps: { dbPing?: () => Promise<boolean> } = {},
): Promise<Response> {
  const cors = corsHeaders(req);
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return json({ ok: false, error: 'Method not allowed' }, 405, cors);
  }

  const base: Record<string, unknown> = {
    ok: true,
    service: 'settlementforge-edge',
    ts: new Date().toISOString(),
  };
  if (RELEASE) base.release = RELEASE;

  const deep = new URL(req.url).searchParams.get('deep') === '1';
  if (!deep) return json(base, 200, cors);

  // Deep probe: report DB reachability. Unconfigured (self-host/dev) → 'unknown',
  // still 200 so liveness monitoring is unaffected.
  if (!SUPABASE_URL || !SERVICE_KEY) return json({ ...base, db: 'unknown' }, 200, cors);

  const ping = deps.dbPing ?? defaultDbPing;
  let dbUp = false;
  try {
    dbUp = await ping();
  } catch {
    dbUp = false;
  }
  return json({ ...base, ok: dbUp, db: dbUp ? 'up' : 'down' }, dbUp ? 200 : 503, cors);
}

if (import.meta.main) {
  serve((req) => handleHealth(req));
}
