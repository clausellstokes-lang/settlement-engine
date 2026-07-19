/**
 * mailAdapter.ts — provider-neutral transactional-mail seam (Wave E).
 *
 * send-email was hard-wired to Resend. This is the small adapter layer the
 * "swap providers by editing one function" comment always promised but never
 * had: an env-selected provider (EMAIL_PROVIDER; default 'resend', 'postmark'
 * as a second), each reading its OWN secrets and INERT (configured:false) when
 * those secrets are unset. Mirrors ai-analyst's registerProviderAdapter shape —
 * a required id + a required send(), frozen — so the mail seam is provider-
 * neutral the same way the AI seam is.
 *
 * The caller checks `.configured` before calling `.send()` (send-email returns
 * {ok:false, reason:'unconfigured'} when false), so send() is never invoked on
 * an unconfigured provider. No template logic lives here — the adapter only
 * transports an already-rendered {to, subject, text}.
 */

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
}

export interface MailResult {
  id: string | null;
}

export interface MailAdapter {
  /** Provider id: 'resend' | 'postmark'. */
  id: string;
  /** True when this provider's secrets are present in the env. */
  configured: boolean;
  /** Configured From identity ('' when unconfigured). */
  from: string;
  /** Provider secret ('' when unconfigured) — retained for send-email's test-dispatch seam. */
  token: string;
  /** Transport an already-rendered message. Only called when configured. */
  send: (msg: MailMessage) => Promise<MailResult>;
}

type EnvGet = (key: string) => string | undefined;

function resendAdapter(env: EnvGet): MailAdapter {
  const token = env('RESEND_API_KEY') || '';
  const from = env('RESEND_FROM_EMAIL') || '';
  return Object.freeze({
    id: 'resend',
    configured: Boolean(token && from),
    from,
    token,
    send: async (msg: MailMessage): Promise<MailResult> => {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to: [msg.to], subject: msg.subject, text: msg.text }),
      });
      if (!res.ok) {
        throw new Error(`Resend ${res.status}: ${await res.text().catch(() => '')}`);
      }
      const body = await res.json().catch(() => ({}));
      return { id: body?.id ?? null };
    },
  });
}

function postmarkAdapter(env: EnvGet): MailAdapter {
  const token = env('POSTMARK_SERVER_TOKEN') || '';
  const from = env('POSTMARK_FROM_EMAIL') || '';
  return Object.freeze({
    id: 'postmark',
    configured: Boolean(token && from),
    from,
    token,
    send: async (msg: MailMessage): Promise<MailResult> => {
      const res = await fetch('https://api.postmarkapp.com/email', {
        method: 'POST',
        headers: {
          'X-Postmark-Server-Token': token,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ From: from, To: msg.to, Subject: msg.subject, TextBody: msg.text }),
      });
      if (!res.ok) {
        throw new Error(`Postmark ${res.status}: ${await res.text().catch(() => '')}`);
      }
      const body = await res.json().catch(() => ({}));
      return { id: body?.MessageID ?? null };
    },
  });
}

const BUILDERS: Record<string, (env: EnvGet) => MailAdapter> = {
  resend: resendAdapter,
  postmark: postmarkAdapter,
};

/** The providers this seam knows how to build (for docs/tests). */
export const MAIL_PROVIDERS = Object.freeze(Object.keys(BUILDERS));

/**
 * Select the mail adapter for the current env. EMAIL_PROVIDER picks the provider
 * (default 'resend'); an unknown value falls back to resend. The adapter is
 * INERT (configured:false) when its provider secrets are unset.
 */
export function selectMailAdapter(env: EnvGet = (k) => Deno.env.get(k)): MailAdapter {
  const id = (env('EMAIL_PROVIDER') || 'resend').toLowerCase();
  const build = BUILDERS[id] ?? BUILDERS.resend;
  return build(env);
}
