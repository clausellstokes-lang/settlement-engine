/**
 * ai-analyst/providerErrors.ts — PURE provider-error classification + the §3d
 * GRACEFUL REFUSAL contract for the BYOK MANAGEMENT SURFACE (owner commission #29).
 *
 * The adapter classifies a provider failure into ONE boundary class, and every class
 * maps to a cordial refusal that NAMES the boundary + the nearest door (including the
 * always-available "switch to managed credits" door). Deno-global-free + remote-import
 * free, so the SAME code the edge runs is exercised by the vitest pin
 * (tests/edgeFunctions/providerErrors.test.js).
 *
 * The classes double as BYOK key-health states (migration 144): out_of_credit /
 * invalid / rate_limited / down are persisted on the key so the settings surface shows
 * a live status. 'other'/'ok' never overwrite a key's health (a transient request-shape
 * error must not flip a healthy key to unhealthy).
 */

/** The boundary a provider failure hit. */
export type ProviderErrorClass =
  | 'ok'
  | 'out_of_credit'
  | 'invalid'
  | 'rate_limited'
  | 'down'
  | 'other';

/** A governor refusal (the edge, not the provider) also flows through refusalForClass. */
export type RefusalClass = ProviderErrorClass | 'cap' | 'paused' | 'read_only';

// Billing / credit-exhaustion signatures appear in the RESPONSE BODY (Anthropic returns
// HTTP 400 "Your credit balance is too low …", others use 402). Matched case-insensitively.
const OUT_OF_CREDIT_RE = /credit balance|insufficient (?:funds|credit|quota)|too low to access|billing|payment required|quota (?:exceeded|exhausted)|insufficient_quota/i;

/**
 * Classify a provider HTTP failure by status + (optional) response body. Never throws.
 * Order matters: an explicit billing signal wins over the status bucket, so a 400/429
 * that is really "out of credit" is not mis-read as a bad request / rate limit.
 */
export function classifyProviderError(status: unknown, bodyText: unknown = ''): ProviderErrorClass {
  const code = typeof status === 'number' ? status : Number.parseInt(String(status ?? ''), 10);
  const body = typeof bodyText === 'string' ? bodyText : '';

  if (Number.isFinite(code) && code >= 200 && code < 300) return 'ok';
  // Billing exhaustion first — it can arrive on 400 or 402 (or a body-only signal).
  if (OUT_OF_CREDIT_RE.test(body) || code === 402) return 'out_of_credit';
  // Auth / permission → the key itself is invalid or lacks access.
  if (code === 401 || code === 403) return 'invalid';
  if (code === 429) return 'rate_limited';
  // Provider-side outage (incl. Anthropic's 529 overloaded).
  if (code === 500 || code === 502 || code === 503 || code === 504 || code === 529) return 'down';
  // Everything else (incl. a non-billing 400 request-shape error) is NOT a key-health
  // signal — it must not flip a healthy key to unhealthy.
  return 'other';
}

/** Classify a thrown network/timeout error (no HTTP status). AbortError / TypeError
 *  ('fetch failed') / 'timed out' ⇒ provider-down; otherwise 'other'. */
export function classifyProviderThrow(err: unknown): ProviderErrorClass {
  const name = (err as { name?: string })?.name ?? '';
  const msg = err instanceof Error ? err.message : String(err ?? '');
  if (name === 'AbortError' || name === 'TimeoutError' || name === 'TypeError') return 'down';
  if (/timed out|timeout|fetch failed|network|ECONN|socket|unavailable|overloaded/i.test(msg)) return 'down';
  return 'other';
}

/** The key-health state a class implies. 'ok'/'other' ⇒ null (leave health untouched). */
export function healthFromClass(cls: ProviderErrorClass): string | null {
  switch (cls) {
    case 'ok': return 'healthy';
    case 'out_of_credit': return 'out_of_credit';
    case 'invalid': return 'invalid';
    case 'rate_limited': return 'rate_limited';
    case 'down': return 'down';
    default: return null; // 'other' — not a health signal
  }
}

export interface GracefulRefusal {
  /** The class, for the aiOperationLog refusal_class receipt. */
  class: RefusalClass;
  /** A cordial, specific message naming the boundary. */
  message: string;
  /** Machine-readable door hints the client renders as actions. Always includes a
   *  fallback; provider-money classes always offer 'managed' (switch to managed credits). */
  doors: string[];
}

/**
 * §3d THE GRACEFUL REFUSAL CONTRACT: map a boundary class to a cordial refusal that
 * names WHAT happened and the NEAREST door — including switch-to-managed-credits for
 * every provider-money class. A dead-end refusal is a scored failure; every branch
 * offers a next step. Pure + total (an unknown class degrades to a safe generic).
 */
export function refusalForClass(cls: RefusalClass, ctx: { window?: string } = {}): GracefulRefusal {
  switch (cls) {
    case 'out_of_credit':
      return {
        class: cls,
        message: 'Your provider key is out of credit, so the request was not sent and nothing was charged. Top up your balance in your provider’s console, or switch to SettlementForge managed credits to keep going.',
        doors: ['provider_console', 'managed'],
      };
    case 'invalid':
      return {
        class: cls,
        message: 'Your provider key was rejected as invalid or expired, so nothing was charged. Re-paste a current key and verify it, or switch to SettlementForge managed credits.',
        doors: ['rekey', 'managed'],
      };
    case 'rate_limited':
      return {
        class: cls,
        message: 'Your provider is rate-limiting requests right now, so nothing was charged. Wait a moment and retry, or switch to SettlementForge managed credits.',
        doors: ['retry', 'managed'],
      };
    case 'down':
      return {
        class: cls,
        message: 'The provider is temporarily unavailable, so nothing was charged. Please try again shortly, or switch to SettlementForge managed credits.',
        doors: ['retry', 'managed'],
      };
    case 'cap':
      return {
        class: cls,
        message: `You’ve reached your ${ctx.window ? ctx.window.replace(/_/g, ' ') + ' ' : ''}usage cap, so the request was not sent and nothing was charged. Adjust your caps in AI settings, or wait for the window to reset.`,
        doors: ['edit_caps'],
      };
    case 'paused':
      return {
        class: cls,
        message: 'AI usage is paused, so the request was not sent and nothing was charged. Turn it back on in AI settings whenever you’re ready.',
        doors: ['unpause'],
      };
    case 'read_only':
      return {
        class: cls,
        message: 'The analyst reads the world; it cannot change it (yet). Acting on the world arrives with a later Surveyor stage — for now, ask what the records already show.',
        doors: ['ask_readonly'],
      };
    default:
      return {
        class: 'other',
        message: 'The request couldn’t be completed, so nothing was charged. Please try again.',
        doors: ['retry'],
      };
  }
}
