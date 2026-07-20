/**
 * _shared/autoReload.ts — the AI-credit auto-reload trigger (DESIGN_MONEY_WAVE §4 /
 * #13, slice M-3). Called fire-and-forget AFTER a successful credit spend in the
 * credit-spending edge functions:
 *
 *     void maybeAutoReload(admin, userId).catch(() => {});
 *
 * NEVER-THROW CONTRACT (the referralEmails discipline): a reload failure can never
 * fail a paid generation. Every path is wrapped; the outer try swallows anything.
 *
 * FLOW (all money-authoritative decisions live in the DB, atomically):
 *   1. Read the starter-pack Stripe price (STRIPE_PRICE_CREDITS_25, cached 10 min) —
 *      the per-credit RATE (§4.4). Missing key/price ⇒ the feature is DARK (no-op).
 *   2. claim_auto_reload_attempt(user, unit_amount, 25) — the atomic claim (158):
 *      re-reads settings+balance, gates below-threshold, derives delta+amount,
 *      enforces cooldown + monthly cap, and claims via the one-open unique index.
 *      A refusal (disabled / above threshold / cap / cooldown / open) is a no-op here.
 *   3. On a claim: resolve the customer's saved off-session card and create the
 *      off-session PaymentIntent (idempotencyKey auto-reload-{attempt}). SUCCESS IS
 *      NOT TRUSTED HERE — the webhook confirms payment_intent.succeeded and grants
 *      the credits (M-3d). We only stamp the PI id so the confirm links back.
 *   4. SCA (authentication_required) ⇒ attempt 'requires_action' + notify-to-verify
 *      (never silent-retry). Any other create error ⇒ attempt 'failed' + notify.
 *
 * The notification seam is Wave E's transactional mail ('credit_low' template /
 * notifyCreditLow); it lands in a PARALLEL lane, so `deps.notify` is inert by
 * default here — wiring it is a fold-time coordination point.
 */
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import { logError } from './logError.ts';

// Must match create-checkout's CREDIT_AMOUNTS['credits_25'] (the rate denominator).
const CREDITS_25 = 25;
const PRICE_CACHE_MS = 10 * 60 * 1000;

// deno-lint-ignore no-explicit-any
type Admin = any;
// deno-lint-ignore no-explicit-any
type StripeLike = any;

let _priceCache: { at: number; unitAmount: number; currency: string } | null = null;

/** Test-only: clear the in-memory starter-price cache between cases. */
export function __resetPriceCacheForTest(): void { _priceCache = null; }

export type AutoReloadNotifyKind = 'sca' | 'failed' | 'low_balance';

export interface AutoReloadDeps {
  /** Injected Stripe client (tests); production builds it from STRIPE_SECRET_KEY. */
  stripe?: StripeLike;
  /** Wave E 'credit_low' notification seam. Inert (undefined) until folded. */
  notify?: (kind: AutoReloadNotifyKind, payload: Record<string, unknown>) => Promise<void> | void;
  /** Clock seam for deterministic tests. */
  now?: () => number;
}

function defaultStripe(): StripeLike | null {
  const key = Deno.env.get('STRIPE_SECRET_KEY');
  if (!key) return null;
  return new Stripe(key, { apiVersion: '2023-10-16' });
}

/** The starter-pack unit price (cents) + currency, cached 10 minutes (§4.4). */
async function starterPrice(stripe: StripeLike, now: number): Promise<{ unitAmount: number; currency: string } | null> {
  if (_priceCache && now - _priceCache.at < PRICE_CACHE_MS) {
    return { unitAmount: _priceCache.unitAmount, currency: _priceCache.currency };
  }
  const priceId = Deno.env.get('STRIPE_PRICE_CREDITS_25');
  if (!priceId) return null;
  try {
    const price = await stripe.prices.retrieve(priceId);
    const ua = typeof price?.unit_amount === 'number' ? price.unit_amount : null;
    if (!ua || ua <= 0) return null;
    const currency = typeof price?.currency === 'string' && price.currency ? price.currency : 'usd';
    _priceCache = { at: now, unitAmount: ua, currency };
    return { unitAmount: ua, currency };
  } catch {
    return null;
  }
}

function errCode(e: unknown): string | null {
  if (e && typeof e === 'object') {
    const anyE = e as { code?: string; raw?: { code?: string } };
    return anyE.code ?? anyE.raw?.code ?? null;
  }
  return null;
}
function errPaymentIntentId(e: unknown): string | null {
  const anyE = e as { raw?: { payment_intent?: { id?: string } }; payment_intent?: { id?: string } };
  return anyE?.raw?.payment_intent?.id ?? anyE?.payment_intent?.id ?? null;
}

async function resolveAttempt(admin: Admin, attemptId: string, state: string, reason: string, now: number): Promise<void> {
  try {
    await admin.from('credit_auto_reload_attempts')
      .update({ state, failure_reason: reason, resolved_at: new Date(now).toISOString() })
      .eq('id', attemptId);
  } catch { /* never throw */ }
}

async function safeNotify(deps: AutoReloadDeps, kind: AutoReloadNotifyKind, payload: Record<string, unknown>): Promise<void> {
  try {
    if (deps.notify) await deps.notify(kind, payload);
  } catch { /* notifications never break the money path */ }
}

/** The low-balance nudge (§4.3): configured-but-can't-fire + below threshold →
 *  notify at most once per month_bucket (mark_low_balance_notified is the claim). */
async function maybeLowBalanceNotify(
  admin: Admin, userId: string, deps: AutoReloadDeps, now: number,
  // deno-lint-ignore no-explicit-any
  claim: any,
): Promise<void> {
  try {
    const eligible = (claim?.reason === 'disabled' && claim?.below_threshold === true) || claim?.reason === 'cap';
    if (!eligible) return;
    const bucket = new Date(now).toISOString().slice(0, 7); // 'YYYY-MM' (UTC)
    const { data: stamped, error } = await admin.rpc('mark_low_balance_notified', { p_user: userId, p_bucket: bucket });
    if (error || !stamped) return; // already nudged this bucket, or transient error
    await safeNotify(deps, 'low_balance', { userId });
  } catch { /* never throw */ }
}

/**
 * Fire-and-forget auto-reload check for one user, run AFTER a successful spend.
 * NEVER throws.
 */
export async function maybeAutoReload(admin: Admin, userId: string, deps: AutoReloadDeps = {}): Promise<void> {
  const now = deps.now ? deps.now() : Date.now();
  try {
    if (!userId) return;
    const stripe = deps.stripe ?? defaultStripe();
    if (!stripe) return;                       // dark: no Stripe secret
    const price = await starterPrice(stripe, now);
    if (!price) return;                        // dark: no starter price

    const { data: claim, error: claimErr } = await admin.rpc('claim_auto_reload_attempt', {
      p_user: userId, p_unit_amount_cents: price.unitAmount, p_credits_per_unit: CREDITS_25,
    });
    if (claimErr) { logError('auto-reload', userId, claimErr.message, { stage: 'claim' }); return; }
    if (!claim?.ok) {
      // Refused. The one refusal that warrants a nudge: the user CONFIGURED
      // auto-reload but it can't fire while they're below threshold — either it's
      // OFF (reason 'disabled' + below_threshold) or the monthly cap blocked it
      // (reason 'cap'). At most one nudge per month_bucket (§4.3).
      await maybeLowBalanceNotify(admin, userId, deps, now, claim);
      return;
    }

    const attemptId = claim.attempt_id as string;
    const amountCents = claim.amount_cents as number;
    const creditsDelta = claim.credits_delta as number;

    // Resolve the customer + a saved off-session card.
    const { data: profile } = await admin
      .from('profiles').select('stripe_customer_id').eq('id', userId).maybeSingle();
    const customerId = (profile?.stripe_customer_id as string | null) ?? null;
    if (!customerId) { await resolveAttempt(admin, attemptId, 'failed', 'no_customer', now); return; }

    let paymentMethod: string | null = null;
    try {
      const customer = await stripe.customers.retrieve(customerId);
      paymentMethod = (customer?.invoice_settings?.default_payment_method as string | null) ?? null;
      if (!paymentMethod) {
        const pms = await stripe.paymentMethods.list({ customer: customerId, type: 'card', limit: 1 });
        paymentMethod = (pms?.data?.[0]?.id as string | null) ?? null;
      }
    } catch (e) {
      logError('auto-reload', userId, e, { stage: 'resolve_payment_method' });
    }
    if (!paymentMethod) { await resolveAttempt(admin, attemptId, 'failed', 'no_payment_method', now); return; }

    // Off-session PI. The create RESULT is not trusted for the grant — the webhook
    // confirms + grants. Stamp the PI id so the confirm claims this attempt.
    try {
      const pi = await stripe.paymentIntents.create({
        amount: amountCents,
        currency: price.currency,
        customer: customerId,
        payment_method: paymentMethod,
        off_session: true,
        confirm: true,
        metadata: {
          purpose: 'credit_auto_reload',
          supabase_user_id: userId,
          attempt_id: attemptId,
          credits: String(creditsDelta),
        },
      }, { idempotencyKey: `auto-reload-${attemptId}` });
      await admin.from('credit_auto_reload_attempts')
        .update({ stripe_payment_intent_id: pi?.id ?? null })
        .eq('id', attemptId);
    } catch (e) {
      const code = errCode(e);
      const piId = errPaymentIntentId(e);
      if (code === 'authentication_required') {
        // SCA — needs on-session verification. requires_action + notify-to-complete;
        // NEVER silent-retry. The account panel offers a normal on-session top-up.
        await admin.from('credit_auto_reload_attempts')
          .update({ state: 'requires_action', failure_reason: 'authentication_required', ...(piId ? { stripe_payment_intent_id: piId } : {}) })
          .eq('id', attemptId);
        await safeNotify(deps, 'sca', { userId, attemptId, creditsDelta });
      } else {
        await resolveAttempt(admin, attemptId, 'failed', code || 'pi_create_failed', now);
        await safeNotify(deps, 'failed', { userId, attemptId, reason: code });
      }
    }
  } catch (err) {
    // The absolute backstop: a reload can never fail a paid generation.
    logError('auto-reload', userId, err, { stage: 'maybe_auto_reload' });
  }
}
