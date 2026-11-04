/**
 * Supabase Edge Function: engine-generate — THE ENGINE SERVICE'S GENERATE CALL (ENGINE-1 unit 3).
 *
 *   POST { seed, config, engineVersion? }  →  200 { settlement, pipelineHistory, engineVersion, generatedAt }
 *   POST { op: 'derive', seed, config, pins?, engineVersion? }
 *                                          →  200 { settlement, engineVersion, generatedAt }
 *   POST { op: 'stepMeta', engineVersion? } →  200 { stepMeta, engineVersion }
 *
 * THE TWO NON-BIRTH OPS (ENGINE-4 unit 1, the flag-on gaps). `derive` is the client's own
 * main-thread call `generateSettlementPipeline(config, null, { seed, pins? })` VERBATIM: no
 * `birthConfig`, no custom content, because its callers re-run an EXISTING world (the DM
 * layer's re-derivation, `src/store/settlementRederiveAction.js`) or preview a config without
 * minting a law (the surveyor's construction preview). Minting here would re-birth a world the
 * DM only meant to edit. `pins` is the re-derivation's bag (`src/domain/edit/dmLayer.js ::
 * rederive`), handed to the pipeline exactly as the local engine handle hands it.
 * `stepMeta` is the pipeline step registry's `getStepMeta()` — static engine metadata the
 * re-derivation reads to build that bag — so it skips identity and the rate guard, like
 * engine-version: it touches no account and generates nothing.
 *
 * `pipelineHistory` (ENGINE-2 unit 1) is the per-step list the generation reveal plays
 * back, `[{ id, summary }]`: the run goes through `runGenerationRequest`, the ONE core the
 * Web Worker and the in-thread fallback run, so the reply is the worker's result packet
 * and the client's `remote` transport (`src/lib/engineRemote.js`) hands phase B the same
 * shape. With no neighbour, no previous settlement and no locks the core's settlement IS
 * `generateSettlementPipeline(birthConfig(config), null, { seed, customContent: {} })`.
 *
 * Runs the app's own generator, bundled: `_shared/engineBundle.js` is esbuild's bundle of
 * `src/engine/serviceEntry.js` (scripts/build-edge-shared.mjs), and
 * `tests/build/engineBundleReplay.test.js` proves it generates, byte for byte, what the
 * in-process pipeline generates. A request is a BIRTH, exactly as the app's Generate is:
 * the create boundary's async half (`loadGenerationLawPayloads`) is awaited, then the
 * config passes through `birthConfig` and the pipeline runs with `customContent: {}`.
 *
 * THE SPINE (the order is the contract):
 *   CORS preflight → method gate (POST) → bot guard (403) → body cap + parse (413/400)
 *   → shape (400) → version pin (409 `engine_version_retired`, carrying the served
 *   version) → OPTIONAL identity (a Bearer JWT that resolves to a user; anything else is
 *   anonymous) → for a signed-in caller: single-session gate (401) and account_is_active
 *   (403; the design's spine, docs/DESIGN_ENGINE_SERVICE.md "The contract") → staff read →
 *   rate guard (429; staff skip it) → generate (422 on a generator throw) → 200.
 *
 * Anonymous callers are served (verify_jwt = false in supabase/config.toml): generation
 * spends no credits and touches no account row, so the rate guard is its only ceiling,
 * keyed per account when signed in and per IP otherwise. The guard FAILS CLOSED (a
 * limiter error is a 429), per `_shared/rateLimit.ts`.
 *
 * Staff (profiles.role 'developer' | 'admin' — `src/lib/staffEntitlements.js ::
 * STAFF_ROLES`, the roles `src/store/authSlice.js :: isElevated` reads, mirrored below)
 * are unlimited. A role read error reads as NOT staff.
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.108.2';
import { botGuard } from '../_shared/requestMeta.ts';
import { logError } from '../_shared/logError.ts';
import { getCorsHeaders as sharedCorsHeaders } from '../_shared/cors.ts';
import { checkUserIpRate } from '../_shared/rateLimit.ts';
import { isSessionSuperseded, deviceLabelFromRequest } from '../_shared/sessionGate.ts';
import {
  birthConfig,
  generateSettlementPipeline,
  getStepMeta,
  loadGenerationLawPayloads,
  runGenerationRequest,
} from '../_shared/engineBundle.js';
import engineMeta from '../_shared/engineBundle.meta.json' with { type: 'json' };

// ── THE OWNER'S DIALS (vetoable; the engine-service design's proposal) ───────────────
// Per account when signed in, per IP when anonymous; staff skip both. Fixed windows on
// the existing `ingest_check_rate` limiter, so a burst can straddle a boundary (~2x).
export const ENGINE_GENERATE_RATE_LIMITS = Object.freeze({
  perMinute: { max: 6, windowSeconds: 60, prefix: 'engm' },
  perDay: { max: 200, windowSeconds: 86_400, prefix: 'engd' },
});

/** profiles.role values that are staff (src/lib/staffEntitlements.js :: STAFF_ROLES). */
const STAFF_ROLES: ReadonlyArray<string> = Object.freeze(['developer', 'admin']);

/** The version this deployment serves: the content hash of the bundle it imports. */
export const ENGINE_VERSION: string = engineMeta.engineVersion;

const FN = 'engine-generate';
const MAX_BODY_BYTES = 32 * 1024;
/** `derive` carries a pins bag cut from a whole settlement record (a city's record is ~250 KB). */
const MAX_DERIVE_BODY_BYTES = 1024 * 1024;
const OPS: ReadonlyArray<string> = Object.freeze(['generate', 'derive', 'stepMeta']);
const MAX_SEED_CHARS = 256;

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

function getCorsHeaders(req?: Request) { return sharedCorsHeaders(req, { methods: 'POST, OPTIONS' }); }
function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function defaultAdminClient() {
  return createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
}

/** The subset of a service-role client this function touches (stub-friendly). */
type EngineAdmin = {
  auth: { getUser: (jwt: string) => PromiseLike<{ data: { user: { id: string } | null } | null; error: unknown }> };
  // deno-lint-ignore no-explicit-any
  from: (table: string) => any;
  rpc: (fn: string, args?: Record<string, unknown>) => PromiseLike<{ data: unknown; error: unknown }>;
};

type Deps = {
  adminClient?: () => EngineAdmin;
  now?: () => Date;
};

/** A Bearer JWT that resolves to a user, or null (anonymous). Never throws. */
async function resolveUserId(admin: EngineAdmin, authHeader: string | null): Promise<string | null> {
  const jwt = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!jwt) return null;
  try {
    const { data, error } = await admin.auth.getUser(jwt);
    if (error) return null;
    return data?.user?.id ?? null;
  } catch {
    return null;
  }
}

/** Staff only on a definite role read; any error reads as not staff (fail closed). */
async function isStaff(admin: EngineAdmin, userId: string): Promise<boolean> {
  try {
    const { data, error } = await admin.from('profiles').select('role').eq('id', userId).maybeSingle();
    if (error) return false;
    return typeof data?.role === 'string' && STAFF_ROLES.includes(data.role);
  } catch {
    return false;
  }
}

/** Both windows, one identity key. True only when both are under rate. */
async function underRate(admin: EngineAdmin, identity: string): Promise<boolean> {
  for (const dial of [ENGINE_GENERATE_RATE_LIMITS.perMinute, ENGINE_GENERATE_RATE_LIMITS.perDay]) {
    const ok = await checkUserIpRate(admin, {
      prefix: dial.prefix,
      userId: identity,
      userMax: dial.max,
      userWindowSeconds: dial.windowSeconds,
    });
    if (!ok) return false;
  }
  return true;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export async function handleEngineGenerate(req: Request, deps: Deps = {}): Promise<Response> {
  const cors = getCorsHeaders(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, cors);

  const guard = botGuard(req, FN);
  if (guard.reject) return guard.reject;

  // ── Body: capped, parsed, shaped ───────────────────────────────────────────────────
  // The larger cap is read first (no body exceeds it); a `generate` body is then held to its
  // own 32 KB once the op is known.
  const raw = await req.text();
  const rawBytes = new TextEncoder().encode(raw).length;
  if (rawBytes > MAX_DERIVE_BODY_BYTES) {
    return json({ error: 'payload_too_large', maxBytes: MAX_DERIVE_BODY_BYTES }, 413, cors);
  }
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: 'invalid_json' }, 400, cors);
  }
  if (!isPlainObject(body)) return json({ error: 'invalid_body' }, 400, cors);
  const op = body.op === undefined ? 'generate' : body.op;
  if (typeof op !== 'string' || !OPS.includes(op)) return json({ error: 'invalid_op', ops: OPS }, 400, cors);
  if (op !== 'derive' && rawBytes > MAX_BODY_BYTES) {
    return json({ error: 'payload_too_large', maxBytes: MAX_BODY_BYTES }, 413, cors);
  }
  const { seed, config, engineVersion, pins } = body;
  if (op !== 'stepMeta') {
    if (typeof seed !== 'string' || seed.length === 0 || seed.length > MAX_SEED_CHARS) {
      return json({ error: 'invalid_seed', maxChars: MAX_SEED_CHARS }, 400, cors);
    }
    if (!isPlainObject(config)) return json({ error: 'invalid_config' }, 400, cors);
  }
  if (op === 'derive' && pins !== undefined && !isPlainObject(pins)) {
    return json({ error: 'invalid_pins' }, 400, cors);
  }
  if (engineVersion !== undefined && typeof engineVersion !== 'string') {
    return json({ error: 'invalid_engine_version' }, 400, cors);
  }

  // ── The pin: a version this deployment does not serve is refused, never approximated ─
  if (engineVersion !== undefined && engineVersion !== ENGINE_VERSION) {
    return json({ error: 'engine_version_retired', requested: engineVersion, engineVersion: ENGINE_VERSION }, 409, cors);
  }

  // ── stepMeta: the step registry's static metadata; no account, no generation ────────
  if (op === 'stepMeta') {
    return json({ stepMeta: getStepMeta(), engineVersion: ENGINE_VERSION }, 200, cors);
  }

  // No service-role client means no rate guard; refuse rather than serve unmetered.
  if (!deps.adminClient && (!SUPABASE_URL || !SERVICE_KEY)) {
    logError(FN, null, 'service-role environment missing', { stage: 'config' });
    return json({ error: 'engine_unavailable' }, 503, cors);
  }
  const admin = (deps.adminClient ?? (defaultAdminClient as unknown as () => EngineAdmin))();

  // ── Identity (optional), session gate, staff ────────────────────────────────────────
  const authHeader = req.headers.get('Authorization');
  const userId = await resolveUserId(admin, authHeader);
  if (userId && await isSessionSuperseded(admin, userId, authHeader, deviceLabelFromRequest(req))) {
    return json({ error: 'session_superseded' }, 401, cors);
  }
  if (userId) {
    // Fail closed, as construct-settlement does: only a definite `true` proceeds.
    const { data: isActive, error: activeErr } = await admin.rpc('account_is_active', { p_uid: userId });
    if (activeErr) logError(FN, userId, 'account_is_active errored', { stage: 'account' });
    if (isActive !== true) return json({ error: 'Account is not active' }, 403, cors);
  }
  const staff = userId ? await isStaff(admin, userId) : false;

  // ── Rate guard (fail closed) ────────────────────────────────────────────────────────
  if (!staff) {
    const identity = userId ? `u:${userId}` : `ip:${guard.meta.ip}`;
    if (!(await underRate(admin, identity))) {
      return json({ error: 'rate_limited', limits: ENGINE_GENERATE_RATE_LIMITS }, 429, cors);
    }
  }

  // ── Derive: the client's own non-birth pipeline call, verbatim ───────────────────────
  if (op === 'derive') {
    try {
      await loadGenerationLawPayloads();
      const settlement = generateSettlementPipeline(config as Record<string, unknown>, null,
        pins === undefined ? { seed } : { seed, pins });
      const generatedAt = (deps.now ?? (() => new Date()))().toISOString();
      return json({ settlement, engineVersion: ENGINE_VERSION, generatedAt }, 200, cors);
    } catch (e) {
      logError(FN, userId, e, { stage: 'derive', engineVersion: ENGINE_VERSION });
      return json({ error: 'generation_failed' }, 422, cors);
    }
  }

  // ── Generate: the app's birth, unchanged ────────────────────────────────────────────
  try {
    await loadGenerationLawPayloads();
    const { settlement, pipelineHistory } = runGenerationRequest({
      op: 'settlement',
      requestId: null,
      payload: { fullConfig: birthConfig(config), neighbour: null, seed, contentRuntime: { customContent: {} } },
    });
    const generatedAt = (deps.now ?? (() => new Date()))().toISOString();
    return json({ settlement, pipelineHistory, engineVersion: ENGINE_VERSION, generatedAt }, 200, cors);
  } catch (e) {
    logError(FN, userId, e, { stage: 'generate', engineVersion: ENGINE_VERSION });
    return json({ error: 'generation_failed' }, 422, cors);
  }
}

if (import.meta.main) {
  serve((req) => handleEngineGenerate(req));
}
