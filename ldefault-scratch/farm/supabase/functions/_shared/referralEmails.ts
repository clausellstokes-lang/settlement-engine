/**
 * _shared/referralEmails.ts — referral-reward notification emails (107).
 *
 * Sent DIRECTLY from the stripe-webhook after grant_referral claims a
 * referral, via the Resend HTTP API (the same POST shape as send-email's
 * sendViaResend). Deliberately NOT routed through the send-email edge
 * function: adding these templates to its anonymous set would create a
 * public mailer, and the webhook already holds the service-role context
 * it needs to resolve recipient addresses.
 *
 * CONTRACT — never throw. These sends sit inside the money path
 * (invoice.paid / checkout.session.completed fulfillment); a Resend
 * outage or a malformed address must never convert a granted reward
 * into a webhook failure that Stripe retries. Every failure collapses
 * to a console.warn.
 *
 * Templates: two reward variants ('free_month' coupon / 'credits_10'
 * founder credits) with a per-party opening line. Copy follows
 * docs/VOICE_AND_TONE.md; the "— SettlementForge" signature matches the
 * established send-email templates.
 */

export type ReferralParty = 'referrer' | 'referee';
export type ReferralRewardKind = 'free_month' | 'credits_10';

export interface ReferralEmailRecipient {
  email: string;
  party: ReferralParty;
  reward: ReferralRewardKind;
}

/** Injection seam for tests (production uses the Resend POST below). */
export type ReferralEmailDispatch = (opts: {
  to: string;
  from: string;
  subject: string;
  text: string;
  apiKey: string;
}) => Promise<unknown>;

// The reward is identical for both parties; only the reason differs.
const OPENINGS: Record<ReferralParty, string> = {
  referrer:
    'Someone you referred has made their first purchase. Thank you for the introduction.',
  referee: 'You arrived through a referral, and your first purchase has confirmed it.',
};

const REWARD_VARIANTS: Record<ReferralRewardKind, { subject: string; body: string[] }> = {
  free_month: {
    subject: 'Your next month of Cartographer is on us',
    body: [
      'Your next month of Cartographer is on us. A one-time 100%',
      'discount has been placed on your account and will cover your',
      'next subscription invoice automatically. If you are not',
      'subscribed yet, it will cover your first month when you are.',
    ],
  },
  credits_10: {
    subject: '10 credits, on the house',
    body: [
      'You hold a Founder seat, so your reward arrives as credits:',
      '10 credits, on the house. They are already on your balance,',
      'ready for narrative work.',
    ],
  },
};

/** Render one referral-grant email (exported so tests can assert the copy). */
export function renderReferralGrantEmail(
  reward: ReferralRewardKind,
  party: ReferralParty,
): { subject: string; text: string } {
  const variant = REWARD_VARIANTS[reward];
  return {
    subject: variant.subject,
    text: [
      'Hello,',
      '',
      OPENINGS[party],
      '',
      ...variant.body,
      '',
      'Forge well.',
      '',
      '— SettlementForge',
    ].join('\n'),
  };
}

/** Resend POST — the exact shape send-email/index.ts uses. */
async function postToResend(opts: {
  to: string;
  from: string;
  subject: string;
  text: string;
  apiKey: string;
}): Promise<unknown> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${opts.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: opts.from,
      to: [opts.to],
      subject: opts.subject,
      text: opts.text,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Resend ${res.status}: ${detail}`);
  }
  return res.json();
}

/**
 * Send the referral-grant notifications. NEVER throws — see the module
 * contract above. Missing Resend config is a soft skip (emails are
 * best-effort notifications, not part of the reward), and each recipient
 * fails independently so one bad address cannot mute the other party.
 */
export async function sendReferralGrantEmails(opts: {
  recipients: ReferralEmailRecipient[];
  dispatch?: ReferralEmailDispatch;
}): Promise<void> {
  try {
    const apiKey = Deno.env.get('RESEND_API_KEY');
    const from = Deno.env.get('RESEND_FROM_EMAIL');
    if (!apiKey || !from) {
      console.warn(
        '[referral-emails] RESEND_API_KEY or RESEND_FROM_EMAIL not set; skipping referral notifications',
      );
      return;
    }
    const dispatch = opts.dispatch ?? postToResend;
    for (const recipient of opts.recipients) {
      try {
        const { subject, text } = renderReferralGrantEmail(recipient.reward, recipient.party);
        await dispatch({ to: recipient.email, from, subject, text, apiKey });
      } catch (err) {
        console.warn(
          `[referral-emails] send failed for ${recipient.party}: ${
            (err as Error)?.message ?? 'unknown'
          }`,
        );
      }
    }
  } catch (err) {
    // Absolute backstop: a bug in this module must not reach the money path.
    console.warn(
      `[referral-emails] notification step failed: ${(err as Error)?.message ?? 'unknown'}`,
    );
  }
}
