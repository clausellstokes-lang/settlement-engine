# Email Lifecycle — Tier 8.5 Setup

This document covers the operational setup needed to make the email
lifecycle actually send mail. Code-wise the infrastructure is already
deployed; what remains is the provider account, the secrets, and the
verified sender domain.

## What ships in code

- `src/lib/emailTemplates.js` — Six lifecycle templates with subject +
  plain-text body, parchment-formal voice, "simulated not AI-generated"
  framing.
- `src/lib/emailLifecycle.js` — Fire-and-forget client helpers
  (`notifyWelcome`, `notifySaved`, `notifyExported`, `notifyCreditLow`,
  `notifyFounderThankYou`, `notifyCapWarning`).
- `supabase/functions/send-email/index.ts` — Edge function that
  authenticates the caller, resolves the recipient from `auth.uid()`,
  renders the template, and posts to Resend.
- `tests/lib/emailTemplates.test.js` — 16 tests including a
  client↔edge-function parity check.

What's already wired:
- **Welcome email** fires on first `SIGNED_IN` event per browser per
  user id (localStorage flag prevents repeat sends on token refresh).
  Other lifecycle moments (save, export, credit-low) have their
  helpers ready but the call sites are intentionally left to a later
  pass — wire them when you're ready to actually send.

## Provider choice: Resend

Resend (https://resend.com) is the right default for a Supabase
project: simple API, generous free tier (3000 emails/month), DKIM
out-of-the-box, no SMTP server to babysit. The edge function
dispatches via `https://api.resend.com/emails`.

You can swap providers (Postmark, SendGrid, SES) by editing the
`sendViaResend` function in `supabase/functions/send-email/index.ts`
— the rest of the function is provider-agnostic.

## One-time setup

1. **Create a Resend account** at https://resend.com and verify your
   sending domain (e.g. `settlementforge.com`). Resend walks you through
   the DNS records (SPF, DKIM, DMARC).

2. **Create an API key** in the Resend dashboard. Copy the
   `re_xxxxx...` token.

3. **Set the Supabase secrets** so the edge function can read them:

   ```bash
   npx supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
   npx supabase secrets set RESEND_FROM_EMAIL="SettlementForge <hello@settlementforge.com>"
   ```

   The `from` value must match a verified sender on your Resend
   domain. The display-name prefix (`SettlementForge <...>`) is
   recommended.

4. **Deploy the edge function**:

   ```bash
   npx supabase functions deploy send-email
   ```

5. **Verify it works** with the bundled smoke-test script:

   ```bash
   # Get your JWT from the live app's devtools:
   #   > (await window.__store.getState().auth.session)?.access_token
   scripts/verify-email-setup.sh <your-user-jwt>
   ```

   Expected output:

   ```
   { "ok": true, "id": "re_..." }
   ```

   If you see `{ "ok": false, "reason": "unconfigured" }`, the
   RESEND_API_KEY or RESEND_FROM_EMAIL secret isn't set on the
   Supabase project. Re-run the `npx supabase secrets set ...`
   commands from step 3.

   If you see `{ "ok": false, "reason": "provider_error", ... }`,
   the secrets are set but Resend rejected the request — usually
   means the sender domain isn't verified yet, or the API key
   is expired. Check the Resend dashboard.

   Expected: `{"ok":true,"id":"<resend-message-id>"}`.

## Behavior when unconfigured

If `RESEND_API_KEY` or `RESEND_FROM_EMAIL` are missing, the edge
function returns `{ ok: false, reason: "unconfigured" }` with HTTP
200. This is deliberate:

- Client-side `notifyXxx` calls are fire-and-forget. A 200 with
  `ok: false` is treated the same as success; the user action is
  never blocked.
- A 500 would cause client retries and noisy error logs.
- In dev, the function logs a warning so the missing config is
  visible.

So you can ship the infrastructure now and provision Resend later
without breaking anything.

## Trust boundary

The edge function only sends mail to the authenticated user's own
email address, except for the `cap_warning` template which accepts an
explicit `recipient` (used by anonymous cap-hit flows — the user is
volunteering their address to be notified). All paths route through
`botGuard` for per-IP rate limiting against the obvious-bot
signatures we keep in `_shared/requestMeta.ts`.

What this protects against:
- A malicious authenticated client cannot spam a third party — they
  can only spam themselves, which is self-limiting.
- An anonymous spammer can't bulk-send `cap_warning` emails to a
  third party at scale — botGuard rate limits + per-IP throttling.

What it does NOT protect against:
- A malicious user spamming their own email with `notifyWelcome` etc.
  — but they own the inbox, so the harm is bounded.
- Account-takeover attackers using a hijacked session to send to the
  victim's own email — again, bounded by what the victim owns.

If we ever add admin-driven email (e.g. "send all founders a
notification"), that endpoint MUST be a separate edge function with a
role-gated check, not an additional template here.

## Adding a new template

1. Add the entry to `TEMPLATES` in `src/lib/emailTemplates.js` with
   subject + text (and optional html for v2).
2. Copy the same entry into the `TEMPLATES` map in
   `supabase/functions/send-email/index.ts`.
3. If anonymous senders need it, add the key to `ANON_OK_TEMPLATES`
   in the edge function.
4. Add a tested client helper to `src/lib/emailLifecycle.js`.
5. The parity test in `tests/lib/emailTemplates.test.js` automatically
   verifies the new key exists in both places.

## Wiring the remaining lifecycle calls

The five not-yet-wired helpers need call sites:

| Helper | Call site | Trigger |
|--------|-----------|---------|
| `notifySaved` | `src/lib/saves.js` | After a successful new-save (not re-save). Pass `{ displayName, settlementName, tier }`. |
| `notifyExported` | `src/utils/generateSettlementPDF.js` | Once per export, after the PDF blob lands. Pass `{ displayName, settlementName, tier }`. |
| `notifyCreditLow` | `src/store/creditsSlice.js` | After spend, if previous balance was ≥ threshold and new balance is < threshold. Default threshold: 5. |
| `notifyFounderThankYou` | **Server-side**, in `supabase/functions/stripe-webhook/index.ts` | After the webhook upgrades the user to founder. Client-side helper exists for completeness; do NOT call from the client. |
| `notifyCapWarning` | `src/components/HomeHero.jsx` (cap-hit UI) | Optional — render a "want a reminder when caps reset?" form, post the email via `notifyCapWarning({ recipient })`. |

Each of these is a small wire-in. They're deferred so that landing
the infrastructure first lets us turn on email at any time without
shipping a half-broken UX.
