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

  // SINGLE-SESSION GATE (§7.2): a superseded device takes NO transfer step.
  if (await isSessionSuperseded(admin, user.id, authHeader, deviceLabelFromRequest(req))) {
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

      // ── payout_onboarding (outgoing, ≥ cooling): Connect Express — KEY-INERT ───────
      case 'payout_onboarding': {
        // Connect is enabled only after platform onboarding + keys + LEGAL SIGN-OFF
        // (runbook §11 step 5). Without the platform key this refuses cleanly (LAW 1).
        if (!Deno.env.get('STRIPE_CONNECT_ENABLED')) {
          return json({ error: 'connect_unavailable' }, 503);
        }
        // The Express account create + account link land in M-8 (the payout limb).
        return json({ error: 'connect_unavailable' }, 503);
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

/** Deterministic single-use token hash (the abort email token; M-7 stores it). */
export function hashToken(token: string): string {
  // A stable non-cryptographic fold is sufficient here — the token is high-entropy and
  // single-use; the hash only avoids storing the raw token. (M-7's issuer uses the same.)
  let h = 0x811c9dc5;
  for (let i = 0; i < token.length; i += 1) { h ^= token.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(16).padStart(8, '0');
}

serve((req) => handleFounderTransfer(req));
