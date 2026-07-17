/**
 * Supabase Edge Function: surveyor-byok — the BYOK MANAGEMENT SURFACE's key
 * operations (owner commission #29, DESIGN_AI_CONTROL_SURFACE §3/§3e).
 *
 * ACTION 'verify' — VERIFY-BY-TEST-CALL: a minimal authenticated ping through the
 * provider proves the user's stored key actually works BEFORE it is ever presented as
 * healthy (the "never store as healthy unverified" rule). The result classifies into a
 * boundary class (healthy / out_of_credit / invalid / rate_limited / down) which is
 * persisted on the vault (surveyor_byok_set_health) so the settings surface shows a live
 * status, and — on a healthy key — the provider's list-models ∩ the adapter-supported
 * set is returned to drive the dynamic model dropdown (each with the §3e retention class).
 *
 * TRUST BOUNDARY (identical to ai-analyst): the browser never holds the key; the edge
 * decrypts it per request via the service-role surveyor_byok_get RPC and NEVER logs it
 * (tests/security/byokNeverLogged.test.js scans this file). This action does NOT spend
 * credits — verifying your own key is free — but it is rate-limited to bound test-call
 * abuse. Handler exported with a DI seam for the Deno/vitest pins.
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.108.2';
import { botGuard } from '../_shared/requestMeta.ts';
import { logError } from '../_shared/logError.ts';
import { getCorsHeaders as sharedCorsHeaders } from '../_shared/cors.ts';
import { resolveProviderKey } from '../ai-analyst/byok.ts';
import {
  ANTHROPIC_SUPPORTED_MODELS, ANTHROPIC_RETENTION_CLASS, intersectModels,
} from '../ai-analyst/analystCore.ts';
import {
  classifyProviderError, classifyProviderThrow, healthFromClass, refusalForClass,
} from '../ai-analyst/providerErrors.ts';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') || '';
const ANTHROPIC_VERSION = '2023-06-01';
const VERIFY_MODEL = Deno.env.get('ANTHROPIC_CLAUDE_HAIKU_4_5_MODEL') || 'claude-haiku-4-5';
const PROVIDER = 'anthropic';
const VERIFY_TIMEOUT_MS = 20_000;

function getCorsHeaders(req?: Request) {
  return sharedCorsHeaders(req, { methods: 'POST, OPTIONS' });
}
function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
}

function defaultUserClient(authHeader: string) {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );
}
function defaultAdminClient() {
  return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
}

/** The minimal verification ping (max_tokens: 1). A 200 proves the key authenticates AND
 *  has credit; a failure body classifies the boundary. NEVER logs the key. */
async function pingAnthropic(apiKey: string, model: string, providerFetch: typeof fetch, signal: AbortSignal): Promise<Response> {
  return providerFetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    signal,
    headers: { 'x-api-key': apiKey, 'anthropic-version': ANTHROPIC_VERSION, 'content-type': 'application/json' },
    body: JSON.stringify({ model, max_tokens: 1, messages: [{ role: 'user', content: 'ping' }] }),
  });
}

/** List the models the key can access (GET /v1/models). Returns the id list, or [] on
 *  any failure (the picker falls back to the adapter set). NEVER logs the key. */
async function listAnthropicModels(apiKey: string, providerFetch: typeof fetch, signal: AbortSignal): Promise<string[]> {
  try {
    const resp = await providerFetch('https://api.anthropic.com/v1/models?limit=100', {
      method: 'GET', signal,
      headers: { 'x-api-key': apiKey, 'anthropic-version': ANTHROPIC_VERSION },
    });
    if (!resp.ok) return [];
    const data = await resp.json().catch(() => null);
    const rows = Array.isArray(data?.data) ? data.data : [];
    return rows.map((r: any) => (typeof r?.id === 'string' ? r.id : '')).filter(Boolean);
  } catch { return []; }
}

export async function handleSurveyorByok(
  req: Request,
  deps: {
    userClient?: (authHeader: string) => ReturnType<typeof createClient>;
    adminClient?: () => ReturnType<typeof createClient>;
    anthropicFetch?: typeof fetch;
  } = {},
): Promise<Response> {
  const makeUserClient = deps.userClient ?? defaultUserClient;
  const makeAdminClient = deps.adminClient ?? defaultAdminClient;
  const providerFetch = deps.anthropicFetch ?? fetch;
  const cors = getCorsHeaders(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, cors);

  const guard = botGuard(req, 'surveyor-byok');
  if (guard.reject) return guard.reject;

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Missing authorization' }, 401, cors);

    const supabaseUser = makeUserClient(authHeader);
    const supabaseAdmin = makeAdminClient();
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) return json({ error: 'Unauthorized' }, 401, cors);

    const { data: isActive, error: activeErr } = await supabaseAdmin.rpc('account_is_active', { p_uid: user.id });
    if (activeErr) logError('surveyor-byok', user.id, `account_is_active errored: ${activeErr.message}`);
    if (isActive !== true) return json({ error: 'Account is not active' }, 403, cors);

    // Interface gate (§3/§4): key management is part of the Surveyor plan.
    const { data: entitled, error: entErr } = await supabaseUser.rpc('has_surveyor_entitlement');
    if (entErr) logError('surveyor-byok', user.id, `has_surveyor_entitlement errored: ${entErr.message}`, { stage: 'entitlement' });
    if (entitled !== true) return json({ error: 'Bringing your own key is part of the Surveyor plan.' }, 403, cors);

    const raw = await req.text().catch(() => '');
    let body: any = null;
    try { body = raw ? JSON.parse(raw) : {}; } catch { return json({ error: 'invalid_json' }, 400, cors); }
    const action = typeof body?.action === 'string' ? body.action : 'verify';
    const provider = typeof body?.provider === 'string' && body.provider ? body.provider : PROVIDER;
    if (action !== 'verify') return json({ error: 'unknown action' }, 400, cors);

    // Rate-limit the test-call (fail-open on RPC error). Verify spends NO credits.
    const { data: rl, error: rlErr } = await supabaseAdmin.rpc('consume_ai_generate_rate_limit', { p_user: user.id });
    if (rlErr) logError('surveyor-byok', user.id, `rate_limit errored: ${rlErr.message}`, { stage: 'rate-limit' });
    else if ((rl as { allowed?: boolean } | null)?.allowed === false) {
      return json({ error: "You have reached today's AI limit. Please try again tomorrow." }, 429, cors);
    }

    // Resolve the user's OWN key. If they have none (falls back to the server key), there
    // is nothing of theirs to verify — a graceful, specific refusal.
    const providerKey = await resolveProviderKey(
      supabaseAdmin, user.id, provider, ANTHROPIC_API_KEY,
      (note) => logError('surveyor-byok', user.id, note, { stage: 'byok' }),
    );
    if (!providerKey.byok) {
      return json({ ok: false, health: 'unverified', error: 'No key on file to verify. Paste your provider key first, then verify it.' }, 400, cors);
    }

    const setHealth = async (health: string, errClass: string | null, verified: boolean) => {
      const { error } = await supabaseAdmin.rpc('surveyor_byok_set_health', {
        p_user: user.id, p_provider: provider, p_health: health, p_error_class: errClass, p_verified: verified,
      });
      if (error) logError('surveyor-byok', user.id, `set_health failed: ${error.message}`, { stage: 'health' });
    };

    // ── the verify-by-test-call ────────────────────────────────────────────────
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), VERIFY_TIMEOUT_MS);
    let cls: ReturnType<typeof classifyProviderError>;
    try {
      let resp: Response;
      try {
        resp = await pingAnthropic(providerKey.key, VERIFY_MODEL, providerFetch, ac.signal);
      } catch (fetchErr) {
        // Network / timeout — provider-down, not a key fault.
        cls = classifyProviderThrow(fetchErr);
        const health = healthFromClass(cls) ?? 'down';
        await setHealth(health, cls, false);
        const refusal = refusalForClass(cls);
        return json({ ok: false, health, message: refusal.message, doors: refusal.doors, refusalClass: refusal.class }, 200, cors);
      }
      if (resp.ok) {
        await setHealth('healthy', null, true);
        // Healthy: offer the dynamic model dropdown (key list-models ∩ adapter set).
        const keyModels = await listAnthropicModels(providerKey.key, providerFetch, ac.signal);
        const models = intersectModels(keyModels, ANTHROPIC_SUPPORTED_MODELS);
        return json({
          ok: true, health: 'healthy', verifiedAt: new Date().toISOString(),
          provider, retentionClass: ANTHROPIC_RETENTION_CLASS,
          models: models.map((id) => ({ id, retentionClass: ANTHROPIC_RETENTION_CLASS })),
        }, 200, cors);
      }
      // Non-2xx: read a bounded slice of the body to classify (never logged).
      const bodyText = await resp.text().catch(() => '');
      cls = classifyProviderError(resp.status, bodyText.slice(0, 2000));
      const health = healthFromClass(cls) ?? 'down';
      await setHealth(health, cls, false);
      const refusal = refusalForClass(cls);
      return json({ ok: false, health, message: refusal.message, doors: refusal.doors, refusalClass: refusal.class }, 200, cors);
    } finally {
      clearTimeout(timer);
    }
  } catch (e) {
    logError('surveyor-byok', null, `outer handler error: ${(e as Error).message}`, { stage: 'outer' });
    return json({ error: 'Key verification failed. Please try again.' }, 500, cors);
  }
}

serve((req) => handleSurveyorByok(req));
