// ────────────────────────────────────────────────────────────────────────────
// founder-transfer — the seat-transfer choreography (DESIGN_MONEY_WAVE §6.3, #17,
// slices M-6). JWT-authed, shared CORS, botGuard, 125-velocity + the single-session
// gate on EVERY action, MASTER SWITCH first (system_config 'founder_transfers').
// KEY-INERT: disabled → every action returns {error:'feature_unavailable'} and the
// UI renders the §12 "coming under the published terms" line.
//
// The DB owns the state machine (160): every transition is a claim-once service-role
// RPC. This function is the choreography glue: master switch, 2FA (password reauth is
// client-side; the server requires the emailed challenge codes), anomaly refusals,
// the case-bound Stripe Checkout session (LAW 2 trust boundary), and the abort/refund.
//
// SEQUENCING NOTE (JUDGMENT, vetoable): `initiate` opens the case (transfer_case_open)
// AND issues the outgoing 'initiate' challenge; `confirm_initiate` verifies it and only
// THEN emails the nominee. The "initiator confirmed before the nominee may proceed"
// invariant is enforced HERE (nominee_accept_start requires the initiate challenge to
// be consumed) rather than in the DB RPC — so 160 and its transition-matrix pins stay
// unchanged. Same security intent as the spec's "open at confirm": the nominee can
// never proceed until BOTH the outgoing password reauth (client) and the emailed
// challenge (server) have landed.
// ────────────────────────────────────────────────────────────────────────────
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.108.2';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import { getCorsHeaders } from '../_shared/cors.ts';
import { botGuard } from '../_shared/requestMeta.ts';
import { logError } from '../_shared/logError.ts';
import { isSessionSuperseded, deviceLabelFromRequest } from '../_shared/sessionGate.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', { apiVersion: '2023-10-16' });
const CLIENT_URL = Deno.env.get('CLIENT_URL') || Deno.env.get('ALLOWED_ORIGINS')?.split(',')[0] || 'https://settlementforge.com';

// deno-lint-ignore no-explicit-any
type AnyClient = any;
function defaultUserClient(authHeader: string): AnyClient {
  return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } } });
}
function defaultAdminClient(): AnyClient {
  return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
}

/** Never-throw transactional email against the Wave-E seam (template-name + payload).
 *  Inert until RESEND keys land — a mail failure NEVER fails a transfer action. */
export async function sendTransferEmail(
  to: string | null,
  subject: string,
  text: string,
  // deno-lint-ignore no-explicit-any
  dispatch?: (o: { to: string; from: string; subject: string; text: string; apiKey: string }) => Promise<any>,
): Promise<void> {
  try {
    const apiKey = Deno.env.get('RESEND_API_KEY');
    const from = Deno.env.get('RESEND_FROM_EMAIL');
    if (!to || !apiKey || !from) return; // seam inert until keys land
    const send = dispatch ?? (async (o) => {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${o.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: o.from, to: [o.to], subject: o.subject, text: o.text }),
      });
    });
    await send({ to, from, subject, text, apiKey });
  } catch (err) {
    console.warn('[founder-transfer] email send failed (non-fatal):', (err as Error)?.message ?? 'unknown');
  }
}

interface Deps {
  userClient?: (authHeader: string) => AnyClient;
  adminClient?: () => AnyClient;
  stripeClient?: typeof stripe;
  // deno-lint-ignore no-explicit-any
  emailDispatch?: (o: { to: string; from: string; subject: string; text: string; apiKey: string }) => Promise<any>;
  /** The expected due-runner cron secret. Defaults to FOUNDER_TRANSFER_CRON_SECRET; injectable for tests. */
  cronSecret?: () => string | undefined;
  /** Whether Stripe Connect is enabled (payout limb). Defaults to STRIPE_CONNECT_ENABLED; injectable for tests. */
  connectEnabled?: () => boolean;
}

export async function handleFounderTransfer(req: Request, deps: Deps = {}): Promise<Response> {
  const makeUserClient = deps.userClient ?? defaultUserClient;
  const makeAdminClient = deps.adminClient ?? defaultAdminClient;
  const stripeApi = deps.stripeClient ?? stripe;
  const cors = getCorsHeaders(req);
  const json = (body: Record<string, unknown>, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const guard = botGuard(req, 'founder-transfer');
  if (guard.reject) return guard.reject;

  let payload: Record<string, unknown>;
  try { payload = await req.json(); } catch { return json({ error: 'Invalid JSON body' }, 400); }
  const action = typeof payload.action === 'string' ? payload.action : '';

  const admin = makeAdminClient();

  // ── run_due (§6.6): the hourly cron sweep. Handled BEFORE the master switch + JWT
  //    auth — the due-runner carries NO user token; it authenticates by the shared
  //    x-cron-secret header (constant-time compare) and must run the sweeps regardless
  //    of the USER-FACING master switch (its own gate is the 'founder_transfer_cron'
  //    config the dispatcher reads; in-flight cases still finalize/payout, and the
  //    auto-reload cancel sweep is independent of transfers entirely).
  if (action === 'run_due') {
    return handleRunDue(req, admin, stripeApi, deps, json);
  }

  // MASTER SWITCH FIRST (§6.3): disabled → feature_unavailable for every action.
  const { data: enabled, error: switchErr } = await admin.rpc('founder_transfer_enabled');
  if (switchErr) { logError('founder-transfer', null, switchErr.message, { stage: 'master_switch' }); return json({ error: 'feature_unavailable' }, 503); }
  if (enabled !== true) return json({ error: 'feature_unavailable' }, 503);

  // AUTH (JWT-verified) — every action is authed.
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return json({ error: 'Missing authorization' }, 401);
  const userClient = makeUserClient(authHeader);
  const { data: { user }, error: authError } = await userClient.auth.getUser();
  if (authError || !user) return json({ error: 'Unauthorized' }, 401);

  // SINGLE-SESSION GATE (§7.2): a superseded device takes NO transfer step — EXCEPT the
  // deliberately session-INDEPENDENT email-token abort (§6.3/§7.3): "a party locked out of
  // their session (§7 interplay) … can STILL halt the transfer." The one-click abort token
  // IS the authorization for that escape hatch, so a token-bearing abort skips the gate (the
  // token hash is validated in the abort handler; a bad token still 403s, and abort only
  // CANCELS a transfer — it never moves value to a superseded caller). Every OTHER action,
  // and a tokenless abort, still evicts a superseded device. (M-9f, §10.7.)
  const wantsTokenAbort = action === 'abort' && typeof payload.token === 'string' && payload.token.trim().length > 0;
  if (!wantsTokenAbort && await isSessionSuperseded(admin, user.id, authHeader, deviceLabelFromRequest(req))) {
    return json({ error: 'session_superseded' }, 401);
  }

  // 125-VELOCITY (fail CLOSED — a transfer moves ownership): per-user/action window.
  const { data: underRate, error: rateErr } = await admin.rpc('ingest_check_rate', {
    p_key: `founder_transfer:${action}:${user.id}`, p_max: 20, p_window_seconds: 3600,
  });
  if (rateErr || underRate === false) {
    if (rateErr) logError('founder-transfer', user.id, `velocity limiter error: ${rateErr.message}`, { stage: 'velocity' });
    return json({ error: 'rate_limited' }, 429);
  }

  const email = (user.email ?? '').trim().toLowerCase();

  try {
    switch (action) {
      // ── initiate (outgoing): anomaly checks → open the case → issue+email the code ─
      case 'initiate': {
        const toEmail = typeof payload.to_email === 'string' ? payload.to_email.trim().toLowerCase() : '';
        const payoutForm = payload.payout_form === 'account_credits' ? 'account_credits' : 'connect_cash';
        if (!toEmail || !toEmail.includes('@')) return json({ error: 'a nominee email is required' }, 400);

        // Anomaly pre-check: credentials changed within 7 days (auth.users updated_at
        // is the audit read — it bumps on password change / recovery; a broad signal,
        // so it conservatively HOLDS more often, the safe direction for a transfer).
        try {
          const { data: got } = await admin.auth.admin.getUserById(user.id);
          const updatedAt = got?.user?.updated_at ? new Date(got.user.updated_at).getTime() : 0;
          if (updatedAt && Date.now() - updatedAt < 7 * 24 * 3600 * 1000) {
            return json({ error: 'security_hold', reason: 'recent_credential_change' }, 403);
          }
        } catch (e) {
          logError('founder-transfer', user.id, (e as Error)?.message ?? 'getUserById failed', { stage: 'anomaly' });
        }

        // Find the caller's seat.
        const { data: seat, error: seatErr } = await admin.from('founder_seats').select('seat_id').eq('holder_user_id', user.id).maybeSingle();
        if (seatErr) throw new Error(seatErr.message);
        if (!seat) return json({ error: 'not_a_founder' }, 403);

        // Open the case (validates eligibility/cooldown/security/uniques in the RPC).
        const { data: opened, error: openErr } = await admin.rpc('transfer_case_open', {
          p_seat: seat.seat_id, p_from: user.id, p_to_email: toEmail, p_payout_form: payoutForm,
        });
        if (openErr) throw new Error(openErr.message);
        if (!opened?.ok) return json({ error: 'cannot_initiate', reason: opened?.reason ?? 'unknown' }, 409);

        // Issue + email the outgoing 'initiate' challenge (the emailed second factor).
        const { data: ch, error: chErr } = await admin.rpc('issue_transfer_challenge', {
          p_case: opened.case_id, p_party: 'outgoing', p_purpose: 'initiate',
        });
        if (chErr) throw new Error(chErr.message);
        if (ch?.ok) {
          await sendTransferEmail(email,
            'Confirm your SettlementForge seat transfer',
            `Your code to confirm starting a Founder seat transfer is: ${ch.code}\n\nIt expires in 10 minutes. If you did not request this, ignore this email and the transfer will not proceed.`,
            deps.emailDispatch);
        }
        return json({ ok: true, case_id: opened.case_id, challenge_issued: Boolean(ch?.ok) });
      }

      // ── confirm_initiate (outgoing): verify code → email the nominee invitation ────
      case 'confirm_initiate': {
        const caseId = typeof payload.case_id === 'string' ? payload.case_id : '';
        const code = typeof payload.code === 'string' ? payload.code : '';
        if (!caseId || !code) return json({ error: 'case_id and code are required' }, 400);
        // Confirm the caller owns this case (outgoing).
        const { data: c } = await admin.from('founder_transfer_cases').select('from_user, to_email_lower, seat_id, state').eq('id', caseId).maybeSingle();
        if (!c || c.from_user !== user.id) return json({ error: 'not_your_case' }, 403);
        const { data: v, error: vErr } = await admin.rpc('verify_transfer_challenge', {
          p_case: caseId, p_party: 'outgoing', p_purpose: 'initiate', p_code: code,
        });
        if (vErr) throw new Error(vErr.message);
        if (!v?.ok) return json({ error: 'bad_code', reason: v?.reason ?? 'bad_code' }, 400);
        // Now email the nominee their invitation (they act via nominee_accept_start).
        await sendTransferEmail(c.to_email_lower,
          'You have been offered a SettlementForge Founder seat',
          `A SettlementForge Founder has offered to transfer their seat (#${c.seat_id}) to you for $99, through the official transfer process. Sign in to the account this email was sent to and open Account → Subscription to review and accept. This offer follows the published terms.`,
          deps.emailDispatch);
        return json({ ok: true });
      }

      // ── nominee_accept_start (incoming): find the confirmed case → issue+email code ─
      case 'nominee_accept_start': {
        // Find an 'initiated' case invited to THIS caller whose initiate challenge is
        // consumed (the outgoing holder confirmed).
        const { data: c } = await admin.from('founder_transfer_cases')
          .select('id, seat_id').eq('to_email_lower', email).eq('state', 'initiated').maybeSingle();
        if (!c) return json({ error: 'no_invitation' }, 404);
        const { data: confirmed } = await admin.from('founder_transfer_challenges')
          .select('id').eq('case_id', c.id).eq('purpose', 'initiate').not('consumed_at', 'is', null).maybeSingle();
        if (!confirmed) return json({ error: 'awaiting_initiator_confirmation' }, 409);
        const { data: ch, error: chErr } = await admin.rpc('issue_transfer_challenge', {
          p_case: c.id, p_party: 'incoming', p_purpose: 'nominee_verify',
        });
        if (chErr) throw new Error(chErr.message);
        if (ch?.ok) {
          await sendTransferEmail(email,
            'Your SettlementForge seat-transfer verification code',
            `Your code to verify accepting a Founder seat transfer is: ${ch.code}\n\nIt expires in 10 minutes.`,
            deps.emailDispatch);
        }
        return json({ ok: true, case_id: c.id, challenge_issued: Boolean(ch?.ok) });
      }

      // ── nominee_confirm (incoming): verify → bind → case-bound Stripe session ──────
      case 'nominee_confirm': {
        const caseId = typeof payload.case_id === 'string' ? payload.case_id : '';
        const code = typeof payload.code === 'string' ? payload.code : '';
        if (!caseId || !code) return json({ error: 'case_id and code are required' }, 400);
        const { data: v, error: vErr } = await admin.rpc('verify_transfer_challenge', {
          p_case: caseId, p_party: 'incoming', p_purpose: 'nominee_verify', p_code: code,
        });
        if (vErr) throw new Error(vErr.message);
        if (!v?.ok) return json({ error: 'bad_code', reason: v?.reason ?? 'bad_code' }, 400);

        // Bind the nominee (validates email match / no-seat / no-live-case in the RPC).
        const { data: bound, error: bErr } = await admin.rpc('transfer_case_bind_nominee', { p_case: caseId, p_to_user: user.id });
        if (bErr) throw new Error(bErr.message);
        if (!bound?.ok) return json({ error: 'cannot_bind', reason: bound?.reason ?? 'unknown' }, 409);

        // TRUST BOUNDARY (LAW 2): the checkout session binds to a SERVER-VALIDATED
        // case. supabase_user_id comes from the verified JWT (this caller); the product
        // + price are server-controlled; the case id is validated state, never a client
        // assertion. A NEW session-creating entry point beyond create-checkout — so the
        // Tier 0.5 contract test's coverage extends to it (constructEvent-order N/A here;
        // this creates, the webhook consumes).
        const priceId = Deno.env.get('STRIPE_PRICE_SEAT_TRANSFER');
        if (!priceId) return json({ error: 'feature_unavailable', reason: 'no_transfer_price' }, 503);

        // Resolve/create the incoming holder's Stripe customer.
        let customerId: string | null = null;
        const { data: prof } = await admin.from('profiles').select('stripe_customer_id').eq('id', user.id).maybeSingle();
        customerId = (prof?.stripe_customer_id as string | null) ?? null;
        if (!customerId) {
          const created = await stripeApi.customers.create({ email: user.email ?? undefined, metadata: { supabase_user_id: user.id } });
          customerId = created.id;
          await admin.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id);
        }

        const session = await stripeApi.checkout.sessions.create({
          mode: 'payment',
          customer: customerId,
          line_items: [{ price: priceId, quantity: 1 }],
          metadata: { purpose: 'founder_seat_transfer', transfer_case_id: caseId, supabase_user_id: user.id },
          success_url: `${CLIENT_URL}/account?section=subscription&transfer=paid`,
          cancel_url: `${CLIENT_URL}/account?section=subscription&transfer=cancelled`,
        });

        const { data: marked, error: mErr } = await admin.rpc('transfer_case_mark_awaiting_payment', { p_case: caseId, p_session: session.id });
        if (mErr) throw new Error(mErr.message);
        if (!marked?.ok) return json({ error: 'cannot_await_payment', reason: marked?.reason ?? 'unknown' }, 409);
        return json({ ok: true, url: session.url });
      }

      // ── abort (either party): challenge code OR the single-use email token ─────────
      case 'abort': {
        const caseId = typeof payload.case_id === 'string' ? payload.case_id : '';
        const token = typeof payload.token === 'string' ? payload.token : '';
        if (!caseId) return json({ error: 'case_id is required' }, 400);
        const { data: c } = await admin.from('founder_transfer_cases')
          .select('from_user, to_user, state, stripe_session_id').eq('id', caseId).maybeSingle();
        if (!c) return json({ error: 'no_case' }, 404);
        const isParty = c.from_user === user.id || c.to_user === user.id;

        // Authorization: an authed party (session-gated above) may abort their own case
        // directly; OR anyone holding the deliberately session-INDEPENDENT email token
        // (the takeover-victim / locked-out escape hatch). The token is verified against
        // its hash stored in the case's cooling notification events (issued in M-7).
        let actor: string | null = null;
        if (isParty) {
          actor = c.from_user === user.id ? 'outgoing' : 'incoming';
        } else if (token) {
          const { data: ev } = await admin.from('founder_transfer_events')
            .select('id, detail').eq('case_id', caseId).eq('event', 'abort_token_issued');
          const ok = Array.isArray(ev) && ev.some((row) => {
            const h = (row.detail as Record<string, unknown> | null)?.token_hash;
            return typeof h === 'string' && h === hashToken(token);
          });
          if (!ok) return json({ error: 'invalid_token' }, 403);
          actor = 'outgoing';
        } else {
          return json({ error: 'not_authorized' }, 403);
        }

        const { data: aborted, error: aErr } = await admin.rpc('transfer_case_abort', { p_case: caseId, p_actor: actor, p_reason: 'party_abort' });
        if (aErr) throw new Error(aErr.message);
        if (!aborted?.ok) return json({ error: 'cannot_abort', reason: aborted?.reason ?? 'unknown' }, 409);

        // A paid (cooling) case aborts WITH REFUND (idempotency-keyed so a redelivery
        // re-sends the SAME refund request).
        if (aborted.was_paid && aborted.payment_session) {
          try {
            const sess = await stripeApi.checkout.sessions.retrieve(aborted.payment_session as string);
            const pi = typeof sess.payment_intent === 'string' ? sess.payment_intent : sess.payment_intent?.id ?? null;
            if (pi) await stripeApi.refunds.create({ payment_intent: pi }, { idempotencyKey: `abort-refund-${caseId}` });
          } catch (e) {
            logError('founder-transfer', user.id, (e as Error)?.message ?? 'refund failed', { stage: 'abort_refund', case_id: caseId });
          }
        }
        return json({ ok: true });
      }

      // ── status: the party-facing projection (USER context, RLS-scoped) ────────────
      case 'status': {
        const { data, error } = await userClient.rpc('my_transfer_case_status');
        if (error) throw new Error(error.message);
        return json({ ok: true, cases: Array.isArray(data) ? data : [] });
      }

      // ── reelect_payout (outgoing): re-open a PARKED cash election → credits ────────
      case 'reelect_payout': {
        // A 'connect_cash' payout that parked at 'held' (Connect absent) is re-opened
        // to 'account_credits' and re-armed to 'scheduled' by the RPC — the next
        // due-runner sweep then releases it as credits (§6.6, the immediate-fallback).
        const caseId = typeof payload.case_id === 'string' ? payload.case_id : '';
        if (!caseId) return json({ error: 'case_id is required' }, 400);
        const { data: r, error: rErr } = await admin.rpc('reelect_transfer_payout', { p_case: caseId, p_from: user.id });
        if (rErr) throw new Error(rErr.message);
        if (!r?.ok) return json({ error: 'cannot_reelect', reason: r?.reason ?? 'unknown' }, 409);
        return json({ ok: true });
      }

      // ── payout_onboarding (outgoing, ≥ cooling): Connect Express — KEY-INERT ───────
      case 'payout_onboarding': {
        // Connect is enabled only after platform onboarding + keys + LEGAL SIGN-OFF
        // (runbook §11 step 5). Without the platform key this refuses cleanly (LAW 1) —
        // no Stripe call is even attempted, so the surface is dark by construction.
        const connectOn = deps.connectEnabled?.() ?? Boolean(Deno.env.get('STRIPE_CONNECT_ENABLED'));
        if (!connectOn) {
          return json({ error: 'connect_unavailable' }, 503);
        }
        // The caller must have a cash-election payout awaiting a connected account.
        const { data: payoutCase } = await admin.from('founder_transfer_cases')
          .select('id').eq('from_user', user.id).eq('payout_form', 'connect_cash')
          .in('payout_status', ['scheduled', 'held', 'releasing']).limit(1).maybeSingle();
        if (!payoutCase) return json({ error: 'no_pending_payout' }, 404);
        try {
          const account = await stripeApi.accounts.create({ type: 'express', metadata: { supabase_user_id: user.id } });
          const link = await stripeApi.accountLinks.create({
            account: account.id, type: 'account_onboarding',
            refresh_url: `${CLIENT_URL}/account?section=subscription&connect=refresh`,
            return_url: `${CLIENT_URL}/account?section=subscription&connect=done`,
          });
          // Stash the connected account on this holder's cash-election payout(s) so the
          // due-runner can release to it. Never touches account data (LAW 10).
          await admin.from('founder_transfer_cases')
            .update({ connect_account_id: account.id, updated_at: new Date().toISOString() })
            .eq('from_user', user.id).eq('payout_form', 'connect_cash')
            .in('payout_status', ['scheduled', 'held', 'releasing']);
          // Re-arm cash payouts that PARKED at 'held' (Connect was absent at their due
          // time): now that a connected account exists, flip them back to 'scheduled'
          // so the next due-runner sweep releases them. Same payout-status sub-machine
          // sweepReleasePayouts already drives rawly. (scheduled/releasing untouched.)
          await admin.from('founder_transfer_cases')
            .update({ payout_status: 'scheduled', updated_at: new Date().toISOString() })
            .eq('from_user', user.id).eq('payout_form', 'connect_cash').eq('payout_status', 'held');
          return json({ ok: true, url: link.url });
        } catch (e) {
          logError('founder-transfer', user.id, (e as Error)?.message ?? 'connect onboarding failed', { stage: 'payout_onboarding' });
          return json({ error: 'connect_onboarding_failed' }, 500);
        }
      }

      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (err) {
    // Genericize (this is an authed but sensitive surface): log the real detail.
    logError('founder-transfer', user.id, (err as Error)?.message ?? 'unknown', { stage: 'handler', action });
    return json({ error: 'transfer_request_failed' }, 500);
  }
}

/** Deterministic single-use token hash (the abort email token; the cooling sweep
 *  stores it, the `abort` action verifies against it). */
export function hashToken(token: string): string {
  // A stable non-cryptographic fold is sufficient here — the token is high-entropy and
  // single-use; the hash only avoids storing the raw token in the events log.
  let h = 0x811c9dc5;
  for (let i = 0; i < token.length; i += 1) { h ^= token.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(16).padStart(8, '0');
}

/** A high-entropy single-use abort token (session-INDEPENDENT — §6.3, the takeover
 *  victim / locked-out escape hatch). Only its hash is stored (hashToken). */
export function makeAbortToken(): string {
  return `${crypto.randomUUID()}${crypto.randomUUID()}`.replace(/-/g, '');
}

/** Constant-time secret compare (SHA-256 → XOR-fold), the pricing-resync-cron idiom.
 *  Neither length nor an early-differing byte leaks a timing side channel. */
async function timingSafeEqualStr(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const [da, db] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(a)),
    crypto.subtle.digest('SHA-256', enc.encode(b)),
  ]);
  const va = new Uint8Array(da), vb = new Uint8Array(db);
  let diff = 0;
  for (let i = 0; i < va.length; i += 1) diff |= va[i] ^ vb[i];
  return diff === 0;
}

/** Resolve a user's email via the admin auth API (never throws → null). */
async function lookupEmail(admin: AnyClient, userId: string | null): Promise<string | null> {
  if (!userId) return null;
  try {
    const { data } = await admin.auth.admin.getUserById(userId);
    const e = data?.user?.email;
    return typeof e === 'string' && e ? e : null;
  } catch { return null; }
}

/** Run one sweep, swallowing any error (one failing sweep can never stall the others). */
async function safeSweep<T>(label: string, fn: () => Promise<T>, fallback: T): Promise<T> {
  try { return await fn(); }
  catch (e) { logError('founder-transfer', null, (e as Error)?.message ?? 'sweep failed', { stage: `run_due:${label}` }); return fallback; }
}

/**
 * handleRunDue — the hourly due-runner (§6.6). Secret-gated (constant-time), then runs
 * each sweep independently + never-throw:
 *   · cooling notifications + abort-token issuance (§6.3, idempotent per case)
 *   · finalize-due cases + the finalize EDGE LEG (§6.5, crash-recoverable)
 *   · release due payouts (§6.6/M-8 — added by the payout limb)
 *   · expire stale cases (§6.3) · cancel stale auto-reload attempts (§4.5)
 *   · stewardship: dormancy nudge + abandonment (§6.8/M-10 — added by the stewardship limb)
 */
async function handleRunDue(
  req: Request, admin: AnyClient, stripeApi: typeof stripe, deps: Deps,
  json: (body: Record<string, unknown>, status?: number) => Response,
): Promise<Response> {
  const expected = (deps.cronSecret?.() ?? Deno.env.get('FOUNDER_TRANSFER_CRON_SECRET') ?? '').trim();
  if (!expected) {
    logError('founder-transfer', null, 'due-runner secret not configured', { stage: 'run_due:secret' });
    return json({ error: 'cron_not_configured' }, 503);
  }
  const provided = req.headers.get('x-cron-secret') || '';
  if (!(await timingSafeEqualStr(provided, expected))) {
    logError('founder-transfer', null, 'due-runner secret mismatch', { stage: 'run_due:secret' });
    return json({ error: 'forbidden' }, 403);
  }

  const nowIso = new Date().toISOString();
  const swept: Record<string, number> = {};
  swept.coolingNotified = await safeSweep('cooling_notify', () => sweepCoolingNotifications(admin, deps), 0);
  swept.finalized = await safeSweep('finalize', () => sweepFinalizeDue(admin, deps, nowIso), 0);
  swept.payoutsReleased = await safeSweep('payout_release', () => sweepReleasePayouts(admin, stripeApi, deps, nowIso), 0);
  // Buyback payouts + the stewardship sweeps ride the same release machinery (M-10).
  swept.buybacksReleased = await safeSweep('buyback_release', () => sweepReleaseBuybacks(admin, stripeApi, deps, nowIso), 0);
  swept.stewardship = await safeSweep('stewardship', () => sweepStewardship(admin, deps, nowIso), 0);
  swept.expired = await safeSweep('expire', async () => {
    const { data } = await admin.rpc('expire_stale_transfer_cases');
    return typeof data === 'number' ? data : 0;
  }, 0);
  swept.autoReloadCanceled = await safeSweep('auto_reload_cancel', async () => {
    const { data } = await admin.rpc('cancel_stale_auto_reload_attempts');
    return typeof data === 'number' ? data : 0;
  }, 0);
  return json({ ok: true, swept });
}

/** Cooling notifications + abort-token issuance (§6.3). For each cooling case with no
 *  abort_token_issued event yet: mint a single-use token, store its HASH in the event
 *  (the idempotency claim — the token itself is emailed once), and email BOTH parties
 *  the cooling notification carrying the session-independent abort link. */
async function sweepCoolingNotifications(admin: AnyClient, deps: Deps): Promise<number> {
  const { data: cooling, error } = await admin.from('founder_transfer_cases')
    .select('id, from_user, to_user, seat_id, to_email_lower').eq('state', 'cooling');
  if (error || !Array.isArray(cooling)) return 0;
  let issued = 0;
  for (const c of cooling) {
    const { data: existing } = await admin.from('founder_transfer_events')
      .select('id').eq('case_id', c.id).eq('event', 'abort_token_issued').maybeSingle();
    if (existing) continue;
    const token = makeAbortToken();
    // Store the hash FIRST — its existence is the per-case idempotency claim (so the
    // sweep re-mints nothing on the next hour). The token is emailed in the same pass.
    await admin.rpc('_log_founder_transfer_event', {
      p_case: c.id, p_actor: 'system', p_event: 'abort_token_issued',
      p_detail: { token_hash: hashToken(token) },
    });
    const abortUrl = `${CLIENT_URL}/account?section=subscription&transfer_case=${c.id}&transfer_abort=${encodeURIComponent(token)}`;
    const fromEmail = await lookupEmail(admin, c.from_user);
    const toEmail = c.to_user ? (await lookupEmail(admin, c.to_user)) : (c.to_email_lower as string | null);
    const body = (who: 'outgoing' | 'incoming') =>
      `A Founder seat transfer (#${c.seat_id}) is now in its 72-hour review period. If it should NOT proceed — for any reason, including a lost or compromised account — you can stop it immediately with this one-click link, which works even if you cannot sign in:\n\n${abortUrl}\n\nThe transfer completes automatically after the review period unless it is stopped. This link is single-use.`;
    await sendTransferEmail(fromEmail, 'Your SettlementForge seat transfer is under review (72 hours)', body('outgoing'), deps.emailDispatch);
    await sendTransferEmail(toEmail, 'Your SettlementForge seat transfer is under review (72 hours)', body('incoming'), deps.emailDispatch);
    issued += 1;
  }
  return issued;
}

/** Finalize-due sweep (§6.5). (a) Finalize cooling-elapsed cases via the claim-once RPC.
 *  (b) Run the idempotent EDGE LEG for every finalized case lacking a finalized_edge_leg
 *  event — crash-recoverable: the DB flags are already correct (the RPC set them), the
 *  edge leg only mirrors auth metadata + retention + emails and re-runs safely. */
async function sweepFinalizeDue(admin: AnyClient, deps: Deps, nowIso: string): Promise<number> {
  // (a) Transition cooling-elapsed cases.
  const { data: due } = await admin.from('founder_transfer_cases')
    .select('id').eq('state', 'cooling').lte('cooling_ends_at', nowIso);
  if (Array.isArray(due)) {
    for (const c of due) {
      await admin.rpc('transfer_case_finalize', { p_case: c.id });
    }
  }
  // (b) Run the edge leg for finalized cases that have not had it yet.
  const { data: finalized } = await admin.from('founder_transfer_cases')
    .select('id, from_user, to_user').eq('state', 'finalized');
  if (!Array.isArray(finalized)) return 0;
  let legged = 0;
  for (const c of finalized) {
    const { data: done } = await admin.from('founder_transfer_events')
      .select('id').eq('case_id', c.id).eq('event', 'finalized_edge_leg').maybeSingle();
    if (done) continue;
    await runFinalizeEdgeLeg(admin, c, deps);
    await admin.rpc('_log_founder_transfer_event', { p_case: c.id, p_actor: 'system', p_event: 'finalized_edge_leg', p_detail: {} });
    legged += 1;
  }
  return legged;
}

/** The finalize EDGE LEG (§6.5, M-7b): the non-DB steps, each idempotent + log-don't-throw.
 *  auth.admin metadata for both users · the SUBSCRIBED-EX-FOUNDER guard (downgrade the
 *  outgoing holder ONLY if they hold no live Cartographer subscription — a subscribed
 *  ex-founder keeps premium via their sub) · restore_premium_settlements for the incoming
 *  holder · both notification emails. NO credit movement of any kind (LAW 10). */
async function runFinalizeEdgeLeg(admin: AnyClient, c: { id: string; from_user: string; to_user: string }, deps: Deps): Promise<void> {
  // ── Outgoing holder: is_founder is already false (finalize RPC). Downgrade tier ONLY
  //    if they hold no live subscription; a subscribed ex-founder keeps premium.
  let fromSubscribed = false;
  try {
    const { data: prof } = await admin.from('profiles').select('stripe_subscription_id').eq('id', c.from_user).maybeSingle();
    fromSubscribed = Boolean(prof?.stripe_subscription_id);
  } catch (e) { logError('founder-transfer', c.from_user, (e as Error)?.message ?? 'profile read failed', { stage: 'edge_leg:from_profile', case_id: c.id }); }
  if (!fromSubscribed) {
    try { await admin.rpc('handle_premium_downgrade', { target_user: c.from_user }); }
    catch (e) { logError('founder-transfer', c.from_user, (e as Error)?.message ?? 'downgrade failed', { stage: 'edge_leg:downgrade', case_id: c.id }); }
  }
  try {
    // updateUserById MERGES user_metadata: a subscribed ex-founder keeps tier:'premium'
    // (only is_founder flips); a non-subscribed one drops to tier:'free'.
    await admin.auth.admin.updateUserById(c.from_user, {
      user_metadata: fromSubscribed ? { is_founder: false } : { tier: 'free', is_founder: false },
    });
  } catch (e) { logError('founder-transfer', c.from_user, (e as Error)?.message ?? 'auth mirror failed', { stage: 'edge_leg:from_auth', case_id: c.id }); }

  // ── Incoming holder: is_founder=true + tier='premium' are already set (finalize RPC);
  //    restore any retention-purged settlements + mirror the auth metadata.
  try { await admin.rpc('restore_premium_settlements', { target_user: c.to_user }); }
  catch (e) { logError('founder-transfer', c.to_user, (e as Error)?.message ?? 'restore failed', { stage: 'edge_leg:restore', case_id: c.id }); }
  try {
    await admin.auth.admin.updateUserById(c.to_user, { user_metadata: { tier: 'premium', is_founder: true } });
  } catch (e) { logError('founder-transfer', c.to_user, (e as Error)?.message ?? 'auth mirror failed', { stage: 'edge_leg:to_auth', case_id: c.id }); }

  // ── Both notification emails (seam-inert until keys land).
  const fromEmail = await lookupEmail(admin, c.from_user);
  const toEmail = await lookupEmail(admin, c.to_user);
  await sendTransferEmail(fromEmail, 'Your Founder seat transfer is complete',
    'Your SettlementForge Founder seat transfer has completed. Your payout will follow within 14-30 days, at the payout form you elected. Thank you.', deps.emailDispatch);
  await sendTransferEmail(toEmail, 'You are now a SettlementForge Founder',
    'Your SettlementForge Founder seat transfer has completed and the seat is now yours. Your Founder benefits are active on your next sign-in.', deps.emailDispatch);
}

// ── THE PAYOUT LIMB (§6.6/M-8) ──────────────────────────────────────────────────
// Must match create-checkout's CREDIT_AMOUNTS['credits_25'] (the §4.4 rate denominator).
const CREDITS_25 = 25;
let _rateCache: { at: number; unitAmount: number; currency: string } | null = null;
/** Test-only: clear the in-memory starter-price cache between cases. */
export function __resetRateCacheForTest(): void { _rateCache = null; }

/** The per-credit rate (§4.4): STRIPE_PRICE_CREDITS_25 unit_amount / 25, cached 10 min.
 *  Missing env / retrieve failure ⇒ null (the credits election parks 'held', LAW 1). */
async function creditRate(stripeApi: typeof stripe): Promise<{ unitAmount: number; currency: string } | null> {
  const now = Date.now();
  if (_rateCache && now - _rateCache.at < 10 * 60 * 1000) {
    return { unitAmount: _rateCache.unitAmount, currency: _rateCache.currency };
  }
  const priceId = Deno.env.get('STRIPE_PRICE_CREDITS_25');
  if (!priceId) return null;
  try {
    const price = await stripeApi.prices.retrieve(priceId);
    const ua = typeof price?.unit_amount === 'number' ? price.unit_amount : null;
    if (!ua || ua <= 0) return null;
    const currency = typeof price?.currency === 'string' && price.currency ? price.currency : 'usd';
    _rateCache = { at: now, unitAmount: ua, currency };
    return { unitAmount: ua, currency };
  } catch { return null; }
}

/** Mirror the payout into money_events (idempotent per event_key). */
async function writePayoutMoneyEvent(admin: AnyClient, p: {
  eventKey: string; fromUser: string; amountCents: number; kind: string; description: string;
  meta: Record<string, unknown>; nowIso: string;
}): Promise<void> {
  try {
    await admin.from('money_events').upsert([{
      event_key: p.eventKey, user_id: p.fromUser, occurred_at: p.nowIso,
      kind: p.kind, amount_cents: p.amountCents, currency: 'usd',
      description: p.description, status: 'paid', metadata: p.meta,
    }], { onConflict: 'event_key', ignoreDuplicates: true });
  } catch (e) { logError('founder-transfer', p.fromUser, (e as Error)?.message ?? 'money_events write failed', { stage: 'payout_money_event' }); }
}

interface PayoutJob {
  fromUser: string; form: string; amountCents: number; connectAccountId: string | null;
  refKey: 'case_id' | 'buyback_id'; refId: string;
  idemKey: string; eventKey: string; kind: string; description: string;
}

/** Perform ONE payout (§6.6). Returns the outcome — the caller maps it to its own
 *  table's status column (transfer cases: payout_status; buybacks: state). Pure of any
 *  status writes so the SAME machinery drives both transfers and buybacks.
 *  · account_credits → system_grant_credits('seat_payout', keyed by refId) → grant-once.
 *  · connect_cash    → stripe.transfers.create with idempotencyKey (double-payout-proof).
 *  · Connect absent / no rate → 'held' (LAW 1 posture). Stripe error → 'failed'. */
async function performPayout(
  admin: AnyClient, stripeApi: typeof stripe, job: PayoutJob, connectOn: boolean, nowIso: string,
): Promise<{ outcome: 'released' | 'held' | 'failed'; transferId: string | null; credits: number | null }> {
  if (job.form === 'account_credits') {
    const rate = await creditRate(stripeApi);
    if (!rate) { logError('founder-transfer', job.fromUser, 'no credit rate — payout parked held', { stage: 'payout_credits', ref: job.refId }); return { outcome: 'held', transferId: null, credits: null }; }
    const credits = Math.round((job.amountCents * CREDITS_25) / rate.unitAmount);
    if (credits <= 0) return { outcome: 'held', transferId: null, credits: null };
    const { error } = await admin.rpc('system_grant_credits', {
      target_user: job.fromUser, amount: credits, source: 'seat_payout',
      metadata: { [job.refKey]: job.refId },
    });
    if (error) { logError('founder-transfer', job.fromUser, error.message, { stage: 'payout_grant', ref: job.refId }); return { outcome: 'held', transferId: null, credits: null }; }
    await writePayoutMoneyEvent(admin, { eventKey: job.eventKey, fromUser: job.fromUser, amountCents: job.amountCents, kind: job.kind, description: job.description, meta: { form: 'credits', [job.refKey]: job.refId, credits }, nowIso });
    return { outcome: 'released', transferId: null, credits };
  }
  // connect_cash
  if (!connectOn || !job.connectAccountId) {
    return { outcome: 'held', transferId: null, credits: null }; // Connect absent → park (LAW 1).
  }
  try {
    const transfer = await stripeApi.transfers.create(
      { amount: job.amountCents, currency: 'usd', destination: job.connectAccountId, metadata: { [job.refKey]: job.refId } },
      { idempotencyKey: job.idemKey },
    );
    const transferId = (transfer?.id as string | null) ?? null;
    await writePayoutMoneyEvent(admin, { eventKey: job.eventKey, fromUser: job.fromUser, amountCents: job.amountCents, kind: job.kind, description: job.description, meta: { form: 'cash', [job.refKey]: job.refId, stripe_transfer_id: transferId }, nowIso });
    return { outcome: 'released', transferId, credits: null };
  } catch (e) {
    logError('founder-transfer', job.fromUser, (e as Error)?.message ?? 'transfer failed', { stage: 'payout_transfer', ref: job.refId });
    return { outcome: 'failed', transferId: null, credits: null };
  }
}

/** Release due transfer payouts (§6.6). Claims one at a time (claim_due_transfer_payout),
 *  performs the payout, maps the outcome to payout_status. The atomic claim + the Stripe
 *  idempotency key make double-release impossible. */
async function sweepReleasePayouts(admin: AnyClient, stripeApi: typeof stripe, deps: Deps, nowIso: string): Promise<number> {
  const connectOn = deps.connectEnabled?.() ?? Boolean(Deno.env.get('STRIPE_CONNECT_ENABLED'));
  let released = 0;
  for (let i = 0; i < 200; i += 1) {
    const { data: claim } = await admin.rpc('claim_due_transfer_payout');
    if (!claim?.ok) break;
    const r = await performPayout(admin, stripeApi, {
      fromUser: claim.from_user, form: claim.payout_form, amountCents: claim.payout_amount_cents,
      connectAccountId: claim.connect_account_id ?? null,
      refKey: 'case_id', refId: claim.case_id,
      idemKey: `payout-${claim.case_id}`, eventKey: `payout:${claim.case_id}`,
      kind: 'seat_transfer_payout', description: 'Founder seat transfer payout',
    }, connectOn, nowIso);
    await admin.from('founder_transfer_cases')
      .update({ payout_status: r.outcome, updated_at: nowIso, ...(r.transferId ? { stripe_transfer_id: r.transferId } : {}) })
      .eq('id', claim.case_id);
    if (r.outcome === 'released') released += 1;
  }
  return released;
}

// ── The stewardship limb (§6.8/M-10) plugs its buyback release + sweeps here. Stubs
//    until that slice lands.
// deno-lint-ignore no-unused-vars
async function sweepReleaseBuybacks(admin: AnyClient, stripeApi: typeof stripe, deps: Deps, nowIso: string): Promise<number> {
  return 0; // M-10: the standing-buyback payouts ride the same performPayout machinery.
}
// deno-lint-ignore no-unused-vars
async function sweepStewardship(admin: AnyClient, deps: Deps, nowIso: string): Promise<number> {
  return 0; // M-10: dormancy nudge (18mo) + abandonment (5y/90d/3 notices) sweeps.
}

serve((req) => handleFounderTransfer(req));
