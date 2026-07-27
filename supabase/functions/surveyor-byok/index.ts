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
 * ACTION 'probe' — THE COMPETENCY PROBE (DESIGN_AI_CAPABILITY_LADDER §3 piece 4,
 * wave L-3b): the tier a BYOK model may be trusted with is MEASURED, never declared.
 * Three canonical bucketing tasks (a construct config, a custom-content draft, an
 * interpret op-set) run on the user's own key with their own chosen model, and each
 * answer is graded by the SAME schema-wall validator the live surface would run it
 * through. Grading reads nothing the model says about itself (the conflicted-witness
 * rule); the pass count picks the tier, which is persisted service-role beside the
 * health (migration 191) together with the exam VERSION and the per-task VERDICT PROFILE
 * (wave L-7a), so the measurement can later coach the model it measured rather than only
 * rank it. Like verify, the probe spends NO credits — but it costs the
 * user real provider tokens, so it takes one rate-limit unit PER TASK and runs under
 * both a per-call and a whole-probe deadline.
 *
 * TRUST BOUNDARY (identical to ai-analyst): the browser never holds the key; the edge
 * decrypts it per request via the service-role surveyor_byok_get RPC and NEVER logs it
 * (tests/security/byokNeverLogged.test.js scans this file). Neither action spends
 * credits — proving your own key is free — but both are rate-limited to bound test-call
 * abuse. Handler exported with a DI seam for the Deno/vitest pins.
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.108.2';
import { botGuard } from '../_shared/requestMeta.ts';
import { isSessionSuperseded, deviceLabelFromRequest } from '../_shared/sessionGate.ts';
import { logError } from '../_shared/logError.ts';
import { getCorsHeaders as sharedCorsHeaders } from '../_shared/cors.ts';
import { aiIpRateGuard } from '../_shared/rateLimit.ts';
import { resolveProviderKey } from '../ai-analyst/byok.ts';
import {
  ANTHROPIC_SUPPORTED_MODELS, ANTHROPIC_RETENTION_CLASS, intersectModels,
} from '../ai-analyst/analystCore.ts';
// THE ONE HOME OF THE ALLOWLIST RULE (wave L-3a, exemption retired at L-WIRE).
import { isSupportedModelPref } from '../ai-analyst/modelResolver.ts';
import {
  classifyProviderError, classifyProviderThrow, healthFromClass, refusalForClass,
} from '../ai-analyst/providerErrors.ts';
import {
  PROBE_TASK_KEYS, PROBE_PROMPTS, PROBE_MAX_TOKENS, PROBE_VERSION,
  gradeProbeTask, tierFromResults, buildProbeProfile, answerTextFromAnthropic,
} from './probeCore.ts';
import type { ProbeTaskResult } from './probeCore.ts';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') || '';
const ANTHROPIC_VERSION = '2023-06-01';
const VERIFY_MODEL = Deno.env.get('ANTHROPIC_CLAUDE_HAIKU_4_5_MODEL') || 'claude-haiku-4-5';
const PROVIDER = 'anthropic';
const VERIFY_TIMEOUT_MS = 20_000;
/** The actions this function serves. Anything else is a 400 — never a silent default. */
const ACTIONS = new Set(['verify', 'probe']);
/** Per-provider-call ceiling for one probe task, and the whole-probe deadline. Three
 *  tasks at 18s each fit inside 60s with room for the grading and the persist. */
const PROBE_CALL_TIMEOUT_MS = 18_000;
const PROBE_DEADLINE_MS = 60_000;
/** The task-class preferences the probe reads a model from, in precedence order. The
 *  preference is read from the DB and NEVER from the request body (the precedence law,
 *  generate-narrative/index.ts): the browser cannot pick which model gets measured. */
const PROBE_PREF_KEYS = ['analysis', 'brief'];

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

/** One probe task's provider call: the frozen task prompt, a bounded answer, the
 *  user's own key. Returns the raw Response so the caller classifies failures the same
 *  way verify does. NEVER logs the key. */
function askAnthropic(
  apiKey: string, model: string, prompt: string, providerFetch: typeof fetch, signal: AbortSignal,
): Promise<Response> {
  return providerFetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    signal,
    headers: { 'x-api-key': apiKey, 'anthropic-version': ANTHROPIC_VERSION, 'content-type': 'application/json' },
    body: JSON.stringify({
      model, max_tokens: PROBE_MAX_TOKENS, messages: [{ role: 'user', content: prompt }],
    }),
  });
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
    // SINGLE-SESSION GATE (161, §7.2): a superseded device's JWT is rejected here.
    if (await isSessionSuperseded(supabaseAdmin, user.id, authHeader, deviceLabelFromRequest(req))) return json({ error: 'session_superseded' }, 401, cors);

    // Wave-D per-IP AI burst gate (item 2): FAIL-CLOSED on the cross-instance token
    // bucket (migration 156) — 429 over-limit, 503 on a limiter-infra error, never a
    // silent open. Inert in tests / local (no cf-connecting-ip → sentinel IP → no RPC).
    const ipGate = await aiIpRateGuard(supabaseAdmin, guard.meta.ip, cors);
    if (ipGate) return ipGate;

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
    if (!ACTIONS.has(action)) return json({ error: 'unknown action' }, 400, cors);

    // Rate-limit the test-call (fail-open on RPC error). NEITHER action spends credits;
    // the limiter is what bounds provider-ping abuse. `verify` takes one unit; `probe`
    // takes one PER TASK (this call covers its first task, the loop takes the rest).
    const consumeRate = async (): Promise<boolean> => {
      const { data: rl, error: rlErr } = await supabaseAdmin.rpc('consume_ai_generate_rate_limit', { p_user: user.id });
      if (rlErr) {
        logError('surveyor-byok', user.id, `rate_limit errored: ${rlErr.message}`, { stage: 'rate-limit' });
        return true; // fail-open on a limiter-infra error, as verify always has
      }
      return (rl as { allowed?: boolean } | null)?.allowed !== false;
    };
    if (!await consumeRate()) {
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

    // ── the competency probe (demonstrated, not declared) ──────────────────────
    if (action === 'probe') {
      // WHICH MODEL GETS MEASURED: the user's OWN stored task-class preference,
      // validated against the adapter set — read from the DB, NEVER from the request
      // body (the precedence law). No preference, or one this adapter does not serve,
      // measures the default model, and the answer records which model it was, so a
      // tier is never mistaken for a claim about a model that was not run.
      let probeModel = VERIFY_MODEL;
      try {
        const { data: settings, error: setErr } = await supabaseUser.rpc('surveyor_settings_get');
        if (setErr) logError('surveyor-byok', user.id, `surveyor_settings_get errored: ${setErr.message}`, { stage: 'probe-model' });
        const prefs = (settings as { model_prefs?: Record<string, unknown> } | null)?.model_prefs;
        // THE EXEMPTION IS RETIRED (wave L-WIRE). This shape is genuinely not the
        // nine-surface expression - it picks the FIRST allowlisted preference across
        // several task keys and needs no byok gate, because the handler already refused a
        // managed key above - but the MEMBERSHIP TEST inside it was the same rule, spelled
        // a second time. isSupportedModelPref() exists for exactly this shape: the
        // predicate without the default-fallback wrapper. Routing through it means the
        // allowlist rule now has exactly one home, and the written exemption in
        // tests/edgeFunctions/edgeModelDefaultsCensus.test.js EXEMPT_CARRIERS is deleted,
        // so the census enforces ZERO exemptions from here on.
        // BEHAVIOUR-NEUTRAL: isSupportedModelPref is the same plain Array.includes over the
        // same ANTHROPIC_SUPPORTED_MODELS, with the same non-empty-string precondition the
        // `pref &&` guard supplied. The D2 dated-id seam is preserved exactly as it was.
        for (const task of PROBE_PREF_KEYS) {
          const pref = prefs && typeof prefs[task] === 'string' ? String(prefs[task]) : '';
          if (isSupportedModelPref(pref)) { probeModel = pref; break; }
        }
      } catch (e) {
        logError('surveyor-byok', user.id, `probe model resolution failed: ${(e as Error).message}`, { stage: 'probe-model' });
      }

      // A provider failure at ANY task abandons the whole probe and persists NOTHING:
      // a tier assembled from a partial run would be a measurement of the outage.
      const probeRefusal = (cls: ReturnType<typeof classifyProviderError>) => {
        const refusal = refusalForClass(cls);
        return json({
          ok: false, tier: null, model: probeModel, probeVersion: PROBE_VERSION,
          message: refusal.message, doors: refusal.doors, refusalClass: refusal.class,
        }, 200, cors);
      };

      const deadline = Date.now() + PROBE_DEADLINE_MS;
      const results: ProbeTaskResult[] = [];
      for (let i = 0; i < PROBE_TASK_KEYS.length; i++) {
        const taskKey = PROBE_TASK_KEYS[i];
        // One rate-limit unit PER TASK. The shared chain above already paid for the
        // first, so each further task takes its own before it reaches the provider.
        if (i > 0 && !await consumeRate()) {
          return json({ error: "You have reached today's AI limit. Please try again tomorrow." }, 429, cors);
        }
        // The whole-probe deadline. Classified 'down' because the honest thing to tell
        // the user is that the run did not finish and nothing was recorded.
        if (Date.now() >= deadline) return probeRefusal('down');

        const ac = new AbortController();
        const timer = setTimeout(() => ac.abort(), PROBE_CALL_TIMEOUT_MS);
        try {
          let resp: Response;
          try {
            resp = await askAnthropic(providerKey.key, probeModel, PROBE_PROMPTS[taskKey], providerFetch, ac.signal);
          } catch (fetchErr) {
            return probeRefusal(classifyProviderThrow(fetchErr));
          }
          if (!resp.ok) {
            const failBody = await resp.text().catch(() => '');
            return probeRefusal(classifyProviderError(resp.status, failBody.slice(0, 2000)));
          }
          const payload = await resp.json().catch(() => null);
          // THE GRADE: a pure function of the schema wall's verdict on this answer.
          results.push(gradeProbeTask(taskKey, answerTextFromAnthropic(payload)));
        } finally {
          clearTimeout(timer);
        }
      }

      const { tier, passes } = tierFromResults(results);
      // L-7a: the exam's TEXTURE is persisted with the tier, in one atomic write, so a
      // profile can never outlive or contradict the tier it summarises. The version says
      // WHICH exam earned it (two tiers from different exams are not comparable), and the
      // profile is the per-task verdict list the coaching renderer reads. Both are
      // verdicts from the repo's own validators; nothing the model wrote goes to storage.
      const { error: tierErr } = await supabaseAdmin.rpc('surveyor_byok_set_probe_tier', {
        p_user: user.id, p_provider: provider, p_tier: tier, p_model: probeModel,
        p_probe_version: PROBE_VERSION, p_profile: buildProbeProfile(results),
      });
      if (tierErr) logError('surveyor-byok', user.id, `set_probe_tier failed: ${tierErr.message}`, { stage: 'probe-tier' });
      return json({
        ok: true, tier, passes, model: probeModel, probeVersion: PROBE_VERSION,
        checkedAt: new Date().toISOString(), tasks: results,
      }, 200, cors);
    }

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
