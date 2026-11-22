/**
 * Detached AI-credit auto-reload trigger.
 *
 * Credit-spending edge functions schedule this only after a successful spend:
 *
 *     scheduleAutoReload(admin, userId);
 *
 * scheduleAutoReload registers the promise with EdgeRuntime.waitUntil so returning
 * the paid response cannot terminate the reload mid-flight. NEVER-THROW CONTRACT
 * (the referralEmails discipline): a reload failure can never fail a paid
 * generation. Every path is wrapped; the outer try swallows anything.
 *
 * FLOW (all money-authoritative decisions live in the DB, atomically):
 *   1. Read the starter-pack Stripe price (STRIPE_PRICE_CREDITS_25, cached 10 min).
 *      Missing key/price leaves the optional feature dark.
 *   2. claim_auto_reload_attempt(user, unit_amount, 25) — the atomic claim (158):
 *      re-reads settings+balance, gates below-threshold, derives delta+amount,
 *      enforces cooldown + monthly cap, and claims via the one-open unique index.
 *      A refusal (disabled / above threshold / cap / cooldown / open) is a no-op here.
 *   3. On a claim: resolve the customer's saved off-session card and create the
 *      off-session PaymentIntent (idempotencyKey auto-reload-{attempt}). SUCCESS IS
 *      NOT TRUSTED HERE — the webhook confirms payment_intent.succeeded and grants
 *      the credits. We only stamp the PaymentIntent id so confirmation links back.
 *   4. SCA (authentication_required) ⇒ attempt 'requires_action' + notify-to-verify
 *      (never silent-retry). Any other create error ⇒ attempt 'failed' + notify.
 *
 * The notification seam is optional and non-authoritative. It is inert unless a
 * caller supplies it, and a mail failure can never change the money path.
 */
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import { runDetached } from './edgeLifetime.ts';
import { logError } from './logError.ts';

// Must match create-checkout's CREDIT_AMOUNTS['credits_25'] (the rate denominator).
const CREDITS_25 = 25;
const PRICE_CACHE_MS = 10 * 60 * 1000;
const AUTO_RELOAD_CURRENCY = 'usd';

// deno-lint-ignore no-explicit-any
type Admin = any;
// deno-lint-ignore no-explicit-any
type StripeLike = any;

let _priceCache: { at: number; unitAmount: number; currency: string } | null = null;

/** Test-only: clear the in-memory starter-price cache between cases. */
export function __resetPriceCacheForTest(): void {
  _priceCache = null;
}

export type AutoReloadNotifyKind = 'sca' | 'failed' | 'low_balance';

export interface AutoReloadDeps {
  /** Injected Stripe client (tests); production builds it from STRIPE_SECRET_KEY. */
  stripe?: StripeLike;
  /** Optional non-authoritative notification callback; production leaves it unset. */
  notify?: (kind: AutoReloadNotifyKind, payload: Record<string, unknown>) => Promise<void> | void;
  /** Clock seam for deterministic tests. */
  now?: () => number;
}

type AutoReloadAttemptClaim = {
  ok?: boolean;
  reason?: string;
  below_threshold?: boolean;
  attempt_id?: string;
  amount_cents?: number;
  credits_delta?: number;
};

function defaultStripe(): StripeLike | null {
  const key = Deno.env.get('STRIPE_SECRET_KEY');
  if (!key) return null;
  return new Stripe(key, { apiVersion: '2023-10-16' });
}

/** Read the starter-pack unit price and cache it for ten minutes. */
async function starterPrice(
  stripeApi: StripeLike,
  now: number,
): Promise<{ unitAmount: number; currency: string } | null> {
  if (_priceCache && now - _priceCache.at < PRICE_CACHE_MS) {
    return { unitAmount: _priceCache.unitAmount, currency: _priceCache.currency };
  }
  const priceId = Deno.env.get('STRIPE_PRICE_CREDITS_25');
  if (!priceId) return null;
  try {
    const price = await stripeApi.prices.retrieve(priceId);
    const unitAmount = typeof price?.unit_amount === 'number'
      ? price.unit_amount
      : null;
    if (!unitAmount || unitAmount <= 0) return null;
    const currency = typeof price?.currency === 'string' ? price.currency.toLowerCase() : '';
    // Auto-reload is a USD-only product. Never claim an attempt (and therefore
    // never create a charge) from a miswired/non-USD Stripe Price: the attempt
    // table stores the expected cents but has no currency column, so silently
    // carrying another currency into the webhook would make the amount
    // comparison dimensionally unsafe.
    if (currency !== AUTO_RELOAD_CURRENCY) {
      logError('auto-reload', null, `starter price currency must be ${AUTO_RELOAD_CURRENCY}`, {
        stage: 'starter_price_currency',
        currency: currency || null,
      });
      return null;
    }
    _priceCache = { at: now, unitAmount, currency };
    return { unitAmount, currency };
  } catch {
    // Price lookup is an optional feature gate. A later spend retries it; the
    // already-paid generation must not inherit a Stripe availability failure.
    return null;
  }
}

function stripeErrorCode(error: unknown): string | null {
  if (error && typeof error === 'object') {
    const candidate = error as { code?: string; raw?: { code?: string } };
    return candidate.code ?? candidate.raw?.code ?? null;
  }
  return null;
}

function stripeErrorPaymentIntentId(error: unknown): string | null {
  const candidate = error as {
    raw?: { payment_intent?: { id?: string } };
    payment_intent?: { id?: string };
  };
  return candidate?.raw?.payment_intent?.id
    ?? candidate?.payment_intent?.id
    ?? null;
}

async function resolveAttempt(
  admin: Admin,
  userId: string,
  attemptId: string,
  state: string,
  reason: string,
  now: number,
  paymentIntentId: string | null = null,
): Promise<void> {
  try {
    let update = admin.from('credit_auto_reload_attempts')
      .update({ state, failure_reason: reason, resolved_at: new Date(now).toISOString() })
      .eq('id', attemptId)
      .in('state', ['pending', 'requires_action']);
    update = paymentIntentId
      ? update.eq('stripe_payment_intent_id', paymentIntentId)
      : update.is('stripe_payment_intent_id', null);
    const { error } = await update;
    if (error) {
      logError('auto-reload', userId, error.message, {
        stage: 'resolve_attempt',
        attempt_id: attemptId,
        state,
      });
    }
  } catch (error) {
    logError('auto-reload', userId, error, {
      stage: 'resolve_attempt',
      attempt_id: attemptId,
      state,
    });
  }
}

/** Atomically bind this attempt to one PI (176). Null-or-same is enforced in
 *  PostgreSQL, so neither a competing webhook nor a trigger continuation can
 *  overwrite another PI identity. Never throws into the paid generation path. */
async function claimPaymentIntentBinding(
  admin: Admin,
  userId: string,
  attemptId: string,
  paymentIntentId: string,
  amountCents: number,
  creditsDelta: number,
): Promise<boolean> {
  try {
    const { data, error } = await admin.rpc('claim_auto_reload_payment_intent', {
      p_attempt: attemptId,
      p_user: userId,
      p_payment_intent: paymentIntentId,
      p_amount_cents: amountCents,
      p_credits_delta: creditsDelta,
    });
    if (error) {
      logError('auto-reload', userId, error.message, {
        stage: 'claim_payment_intent',
        attempt_id: attemptId,
        payment_intent: paymentIntentId,
      });
      return false;
    }
    if (data?.ok !== true) {
      logError('auto-reload', userId, 'PaymentIntent binding was claimed by another identity', {
        stage: 'claim_payment_intent',
        attempt_id: attemptId,
        payment_intent: paymentIntentId,
        reason: data?.reason ?? null,
      });
      return false;
    }
    return true;
  } catch (error) {
    logError('auto-reload', userId, error, {
      stage: 'claim_payment_intent',
      attempt_id: attemptId,
      payment_intent: paymentIntentId,
    });
    return false;
  }
}

async function safeNotify(
  deps: AutoReloadDeps,
  kind: AutoReloadNotifyKind,
  payload: Record<string, unknown>,
): Promise<void> {
  try {
    if (deps.notify) await deps.notify(kind, payload);
  } catch {
    // Notifications never change a payment or attempt outcome.
  }
}

/** Notify at most once per month when a configured low-balance reload cannot run. */
async function maybeLowBalanceNotify(
  admin: Admin,
  userId: string,
  deps: AutoReloadDeps,
  now: number,
  claim: AutoReloadAttemptClaim | null,
): Promise<void> {
  try {
    const eligible = (
      claim?.reason === 'disabled'
      && claim?.below_threshold === true
    ) || claim?.reason === 'cap';
    if (!eligible) return;
    const bucket = new Date(now).toISOString().slice(0, 7); // 'YYYY-MM' (UTC)
    const { data: stamped, error } = await admin.rpc(
      'mark_low_balance_notified',
      { p_user: userId, p_bucket: bucket },
    );
    if (error || !stamped) return; // already nudged this bucket, or transient error
    await safeNotify(deps, 'low_balance', { userId });
  } catch {
    // A nudge is never allowed to change the reload or paid-generation path.
  }
}

async function resolvePaymentMethod(
  stripeApi: StripeLike,
  customerId: string,
  userId: string,
): Promise<string | null> {
  try {
    const customer = await stripeApi.customers.retrieve(customerId);
    const defaultPaymentMethod = (
      customer?.invoice_settings?.default_payment_method as string | null
    ) ?? null;
    if (defaultPaymentMethod) return defaultPaymentMethod;

    const paymentMethods = await stripeApi.paymentMethods.list({
      customer: customerId,
      type: 'card',
      limit: 1,
    });
    return (paymentMethods?.data?.[0]?.id as string | null) ?? null;
  } catch (error) {
    logError('auto-reload', userId, error, {
      stage: 'resolve_payment_method',
    });
    return null;
  }
}

async function markAttemptRequiresAction(
  admin: Admin,
  userId: string,
  attemptId: string,
  paymentIntentId: string | null,
): Promise<void> {
  let update = admin.from('credit_auto_reload_attempts')
    .update({
      state: 'requires_action',
      failure_reason: 'authentication_required',
    })
    .eq('id', attemptId)
    .in('state', ['pending', 'requires_action']);
  update = paymentIntentId
    ? update.eq('stripe_payment_intent_id', paymentIntentId)
    : update.is('stripe_payment_intent_id', null);

  const { error } = await update;
  if (error) {
    logError('auto-reload', userId, error.message, {
      stage: 'mark_requires_action',
      attempt_id: attemptId,
      payment_intent: paymentIntentId,
    });
  }
}

/**
 * Fire-and-forget auto-reload check for one user, run AFTER a successful spend.
 * NEVER throws.
 */
export async function maybeAutoReload(
  admin: Admin,
  userId: string,
  deps: AutoReloadDeps = {},
): Promise<void> {
  const now = deps.now ? deps.now() : Date.now();
  try {
    if (!userId) return;
    const stripeApi = deps.stripe ?? defaultStripe();
    if (!stripeApi) return;
    const price = await starterPrice(stripeApi, now);
    if (!price) return;

    const { data, error: claimError } = await admin.rpc(
      'claim_auto_reload_attempt',
      {
        p_user: userId,
        p_unit_amount_cents: price.unitAmount,
        p_credits_per_unit: CREDITS_25,
      },
    );
    const claim = data as AutoReloadAttemptClaim | null;
    if (claimError) {
      logError('auto-reload', userId, claimError.message, { stage: 'claim' });
      return;
    }
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
    if (!customerId) {
      await resolveAttempt(
        admin,
        userId,
        attemptId,
        'failed',
        'no_customer',
        now,
      );
      return;
    }

    const paymentMethod = await resolvePaymentMethod(
      stripeApi,
      customerId,
      userId,
    );
    if (!paymentMethod) {
      await resolveAttempt(
        admin,
        userId,
        attemptId,
        'failed',
        'no_payment_method',
        now,
      );
      return;
    }

    // The generation spend and this detached task straddle an async boundary.
    // Account deletion can begin after the database claim but before Stripe is
    // called, so re-check immediately before creating real money movement. The
    // webhook repeats this guard and refunds if deletion wins the final race.
    const { data: stillActive, error: activeError } = await admin.rpc(
      'account_is_active',
      { p_uid: userId },
    );
    if (activeError || stillActive !== true) {
      if (activeError) {
        logError('auto-reload', userId, activeError.message, {
          stage: 'pre_charge_account_active',
          attempt_id: attemptId,
        });
      }
      await resolveAttempt(
        admin,
        userId,
        attemptId,
        'canceled',
        'account_inactive',
        now,
      );
      return;
    }

    // Off-session PI. The create RESULT is not trusted for the grant — the webhook
    // confirms + grants. Stamp the PI id so the confirm claims this attempt.
    try {
      const paymentIntent = await stripeApi.paymentIntents.create(
        {
          amount: amountCents,
          currency: AUTO_RELOAD_CURRENCY,
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
        },
        { idempotencyKey: `auto-reload-${attemptId}` },
      );
      const paymentIntentId = typeof paymentIntent?.id === 'string'
        ? paymentIntent.id
        : null;
      if (!paymentIntentId) {
        await resolveAttempt(admin, userId, attemptId, 'failed', 'pi_missing_id', now);
        return;
      }
      await claimPaymentIntentBinding(
        admin,
        userId,
        attemptId,
        paymentIntentId,
        amountCents,
        creditsDelta,
      );
    } catch (error) {
      const code = stripeErrorCode(error);
      const paymentIntentId = stripeErrorPaymentIntentId(error);
      const bindingClaimed = paymentIntentId
        ? await claimPaymentIntentBinding(
          admin,
          userId,
          attemptId,
          paymentIntentId,
          amountCents,
          creditsDelta,
        )
        : true;
      if (!bindingClaimed) return;
      if (code === 'authentication_required') {
        // SCA — needs on-session verification. requires_action + notify-to-complete;
        // NEVER silent-retry. The account panel offers a normal on-session top-up.
        await markAttemptRequiresAction(
          admin,
          userId,
          attemptId,
          paymentIntentId,
        );
        await safeNotify(deps, 'sca', { userId, attemptId, creditsDelta });
      } else {
        await resolveAttempt(
          admin,
          userId,
          attemptId,
          'failed',
          code || 'pi_create_failed',
          now,
          paymentIntentId,
        );
        await safeNotify(deps, 'failed', { userId, attemptId, reason: code });
      }
    }
  } catch (err) {
    // The absolute backstop: a reload can never fail a paid generation.
    logError('auto-reload', userId, err, { stage: 'maybe_auto_reload' });
  }
}

/**
 * Production entry point after a successful credit spend. Keeps the reload check
 * alive past the response/stream close without adding it to response latency.
 */
export function scheduleAutoReload(admin: Admin, userId: string, deps: AutoReloadDeps = {}): void {
  runDetached(maybeAutoReload(admin, userId, deps), 'auto-reload');
}
