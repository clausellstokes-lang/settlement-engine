import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { botGuard, readRequestMeta } from '../_shared/requestMeta.ts';
import { EVENTS, EVENT_CLASS, EVENT_NAME_RE, EDIT_KINDS } from '../_shared/analyticsEventsBundle.js';

/**
 * ingest-events — first-party analytics sink (docs/simulation-intelligence-layer.md §5).
 *
 * Deploy with `--no-verify-jwt` (anonymous traffic is the point). The JWT, when
 * present, is verified here to resolve a stable actor and to gate research-tier.
 * Validates against the SAME frozen event contract the client uses (bundled from
 * src/lib/analyticsEvents.js), clamps consent server-side, peppers the device
 * token, rate-limits, and inserts idempotently (on conflict batch_id,seq).
 */

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const PEPPER = Deno.env.get('ANALYTICS_HASH_PEPPER') || '';

const KNOWN_EVENTS = new Set(Object.values(EVENTS));
const RESEARCH_NAMES = new Set(
  Object.entries(EVENTS).filter(([k]) => EVENT_CLASS[k] === 'research').map(([, v]) => v),
);
const KNOWN_EDIT_KINDS = new Set(EDIT_KINDS);

function corsHeaders(req: Request) {
  const allowed = [
    Deno.env.get('CLIENT_URL') || '',
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

function json(payload: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(payload), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
}

async function sha256hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const uuidOrNull = (v: unknown) => (typeof v === 'string' && UUID_RE.test(v) ? v : null);
const strShort = (v: unknown) => (typeof v === 'string' && v.length <= 64 ? v : null);
const tsOrNull = (v: unknown) => (typeof v === 'number' && isFinite(v) ? new Date(v).toISOString() : null);

/** Server-side prose backstop: drop string props longer than 64 chars. */
function stripProps(props: unknown): Record<string, unknown> {
  if (!props || typeof props !== 'object') return {};
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props as Record<string, unknown>)) {
    if (typeof v === 'string' && v.length > 64) continue;
    out[k] = v;
  }
  return out;
}

// deno-lint-ignore no-explicit-any
async function resolveDeviceActor(admin: any, deviceKey: string): Promise<string> {
  const { data } = await admin.from('analytics_device_links').select('actor_id').eq('device_key', deviceKey).maybeSingle();
  if (data?.actor_id) return data.actor_id;
  const actor = crypto.randomUUID();
  await admin.from('analytics_device_links').insert({ device_key: deviceKey, actor_id: actor });
  return actor;
}

// deno-lint-ignore no-explicit-any
async function resolveUserActor(admin: any, userId: string, deviceKey: string | null): Promise<string> {
  const { data } = await admin.from('analytics_identity_links').select('actor_id').eq('user_id', userId).maybeSingle();
  if (data?.actor_id) return data.actor_id;
  // No actor yet — adopt the device's actor so the anon funnel stitches to signup.
  let actor: string | null = null;
  if (deviceKey) {
    const { data: dev } = await admin.from('analytics_device_links').select('actor_id').eq('device_key', deviceKey).maybeSingle();
    if (dev?.actor_id) actor = dev.actor_id;
  }
  if (!actor) actor = crypto.randomUUID();
  await admin.from('analytics_identity_links').upsert({ user_id: userId, actor_id: actor }, { onConflict: 'user_id', ignoreDuplicates: true });
  return actor;
}

serve(async (req: Request) => {
  const headers = corsHeaders(req);
  if (req.method === 'OPTIONS') return new Response(null, { headers });

  const guard = botGuard(req, 'ingest-events');
  if (guard.reject) return guard.reject;

  // Fail-soft: if the sink is unconfigured, telemetry is simply off (the client
  // queue tolerates a non-2xx and re-spills; this is never a user-facing error).
  if (!SUPABASE_URL || !SERVICE_KEY) return json({ error: 'sink_unavailable' }, 503, headers);

  let body: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > 64 * 1024) return json({ error: 'too_large' }, 413, headers);
    body = JSON.parse(text);
  } catch {
    return json({ error: 'invalid_json' }, 400, headers);
  }

  const admin = createClient(SUPABASE_URL, SERVICE_KEY);
  const meta = readRequestMeta(req);

  // ── Resolve actor (JWT → identity link, adopting device actor; else device) ──
  const authHeader = req.headers.get('Authorization') || '';
  const jwt = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const deviceToken = typeof body.deviceToken === 'string' ? body.deviceToken : null;
  const deviceKey = (deviceToken && PEPPER) ? await sha256hex(PEPPER + deviceToken) : null;

  let actorId: string | null = null;
  let userId: string | null = null;
  if (jwt) {
    const { data } = await admin.auth.getUser(jwt);
    userId = data?.user?.id || null;
    if (userId) actorId = await resolveUserActor(admin, userId, deviceKey);
  }
  if (!actorId && deviceKey) actorId = await resolveDeviceActor(admin, deviceKey);

  // ── Consent clamp: research requires a signed-in user with research consent ──
  let tier = body.consent === 'research' ? 'research' : 'product';
  if (tier === 'research') {
    let ok = false;
    if (userId) {
      const { data: prof } = await admin.from('profiles').select('telemetry_consent').eq('id', userId).maybeSingle();
      ok = prof?.telemetry_consent?.research === true;
    }
    if (!ok) tier = 'product';
  }

  // ── Rate limit (per actor / device / ip) ────────────────────────────────────
  const rateKey = actorId ? `u:${actorId}` : (deviceKey ? `d:${deviceKey}` : `ip:${meta.ip}`);
  const { data: underRate } = await admin.rpc('ingest_check_rate', { p_key: rateKey });
  if (underRate === false) return json({ error: 'rate_limited' }, 429, headers);

  const batchId = uuidOrNull(body.batchId) || crypto.randomUUID();
  const sessionId = uuidOrNull(body.sessionId);
  const country = (req.headers.get('cf-ipcountry') || req.headers.get('x-vercel-ip-country') || '').slice(0, 2).toUpperCase() || null;
  const eventsRev = Number(body.eventsRev) || 1;
  const accepted = { events: 0, edits: 0, snapshots: 0 };
  const rejected: Array<{ seq: unknown; reason: string }> = [];

  // ── Events ──────────────────────────────────────────────────────────────────
  const eventRows: Record<string, unknown>[] = [];
  const events = Array.isArray(body.events) ? body.events.slice(0, 50) : [];
  for (const e of events) {
    const name = typeof e?.event === 'string' ? e.event : '';
    if (!EVENT_NAME_RE.test(name) || !KNOWN_EVENTS.has(name)) { rejected.push({ seq: e?.seq, reason: 'unknown_event' }); continue; }
    if (RESEARCH_NAMES.has(name) && tier !== 'research') { rejected.push({ seq: e?.seq, reason: 'consent_insufficient' }); continue; }
    eventRows.push({
      event: name, actor_id: actorId, session_id: sessionId, subject_id: uuidOrNull(e.subjectId),
      props: stripProps(e.props), consent_tier: tier, country, app_version: strShort(body.appVersion),
      events_rev: eventsRev, client_ts: tsOrNull(e.ts), batch_id: batchId, seq: Number(e.seq) || eventRows.length,
    });
  }
  if (eventRows.length) {
    const { error } = await admin.from('analytics_events').upsert(eventRows, { onConflict: 'batch_id,seq', ignoreDuplicates: true });
    if (!error) accepted.events = eventRows.length;
  }

  // ── Edits (research plane only) ──────────────────────────────────────────────
  if (tier === 'research') {
    const editRows: Record<string, unknown>[] = [];
    const edits = Array.isArray(body.edits) ? body.edits.slice(0, 20) : [];
    for (const ed of edits) {
      if (!KNOWN_EDIT_KINDS.has(ed?.kind)) { rejected.push({ seq: ed?.seq, reason: 'unknown_kind' }); continue; }
      const su = uuidOrNull(ed.settlementUuid);
      if (!su) { rejected.push({ seq: ed?.seq, reason: 'invalid_settlement' }); continue; }
      editRows.push({
        actor_id: actorId, session_id: sessionId, settlement_uuid: su, snapshot_id: null,
        kind: ed.kind, target_kind: strShort(ed.targetKind),
        payload_redacted: (ed.payloadRedacted && typeof ed.payloadRedacted === 'object') ? ed.payloadRedacted : {},
        cascade: (ed.cascade && typeof ed.cascade === 'object') ? ed.cascade : null,
        edit_seq: Number(ed.editSeq) || 0, reverted: ed.reverted === true,
        client_ts: tsOrNull(ed.ts), batch_id: batchId, seq: Number(ed.seq) || (1000 + editRows.length),
      });
    }
    if (editRows.length) {
      const { error } = await admin.from('edit_events').upsert(editRows, { onConflict: 'batch_id,seq', ignoreDuplicates: true });
      if (!error) accepted.edits = editRows.length;
    }
  }

  // ── Snapshots (product = hot columns only; full structural needs research) ───
  const snapRows: Record<string, unknown>[] = [];
  const snapshots = Array.isArray(body.snapshots) ? body.snapshots.slice(0, 2) : [];
  for (const s of snapshots) {
    const su = uuidOrNull(s.settlementUuid);
    const cp = strShort(s.capturePoint);
    if (!su || !cp || typeof s.fingerprintHash !== 'string') { rejected.push({ seq: s?.seq, reason: 'invalid_snapshot' }); continue; }
    const hot = (s.hot && typeof s.hot === 'object') ? s.hot : {};
    const structural = (tier === 'research' && s.structural && typeof s.structural === 'object') ? s.structural : {};
    snapRows.push({
      actor_id: actorId, session_id: sessionId, settlement_uuid: su, capture_point: cp, consent_tier: tier,
      tier: strShort(hot.tier), population_band: strShort(hot.population_band), prosperity: strShort(hot.prosperity),
      faction_count: Number(hot.faction_count) || null, institution_count: Number(hot.institution_count) || null,
      npc_count: Number(hot.npc_count) || null, condition_count: Number(hot.condition_count) || null,
      stressor_count: Number(hot.stressor_count) || null, campaign_phase: strShort(hot.campaign_phase),
      narrative_mode: strShort(hot.narrative_mode),
      structural, fingerprint_hash: s.fingerprintHash.slice(0, 64),
    });
  }
  if (snapRows.length) {
    const { error } = await admin.from('settlement_snapshots').upsert(snapRows, { onConflict: 'settlement_uuid,capture_point,fingerprint_hash', ignoreDuplicates: true });
    if (!error) accepted.snapshots = snapRows.length;
  }

  return json({ accepted, rejected }, 202, headers);
});
