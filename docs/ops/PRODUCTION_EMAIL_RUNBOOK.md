# Production Email Runbook

SettlementForge sends mail through **two entirely separate systems**. Confusing
them is the most common launch-email mistake, so this runbook keeps them apart:

1. **Auth mail** — signup confirmation, password reset, magic links. Sent by
   Supabase's built-in **GoTrue** mailer (or your custom SMTP relay). §1.
2. **Transactional / lifecycle mail** — welcome, save/export confirmations, the
   low-balance notice, the ops error alert. Sent by the **`send-email` edge
   function** through the provider-neutral mail adapter. §2.

`docs/email-lifecycle.md` covers system (2)'s Resend account/DNS setup; this
runbook adds the auth-SMTP posture (system 1) and the provider-adapter + template
consumers (system 2). Steps marked `[OWNER]` are dashboard actions.

---

## 1. Auth mail — the default mailer is unfit for production

**The problem:** without a custom SMTP relay, Supabase's built-in auth mailer is
rate-limited to **2 emails/hour, project-wide** (`supabase/config.toml`
`[auth.rate_limit] email_sent = 2`, whose own comment notes it "Requires
auth.email.smtp to be enabled"). At any real signup volume, confirmation and
password-reset emails silently fail to send — users can't verify or reset. The
`[auth.email.smtp]` block in `config.toml` is present only as a **commented-out
template**, i.e. unconfigured.

**The fix — [OWNER] configure custom SMTP in the dashboard:**

1. Supabase dashboard → **Authentication → Emails → SMTP Settings** (Project
   Settings → Auth on some dashboard versions).
2. Enable **Custom SMTP** and fill in a real relay's credentials — e.g. Resend SMTP
   (`smtp.resend.com`, port 465/587, user `resend`, pass = your API key), or
   SendGrid / Postmark / SES. Set the sender name + a verified sender address on a
   domain you control (SPF/DKIM configured — the same DNS you set up for
   transactional mail).
3. Save. Supabase then routes all auth emails through your relay and the
   2/hour cap no longer applies.
4. Verify: trigger a password reset for a test account and confirm delivery +
   headers (SPF/DKIM `pass`).

This is dashboard-only config; there is no code change and nothing in the repo can
verify it is done. The `config.toml` `[auth.email.smtp]` template is for local
`supabase start` only — production SMTP is set in the dashboard.

---

## 2. Transactional mail — the `send-email` seam

**Provider-neutral adapter** (`supabase/functions/_shared/mailAdapter.ts`, Wave E):
`send-email` no longer hard-codes Resend. `EMAIL_PROVIDER` selects the provider
(default `resend`; `postmark` as a second), each reading its own secrets and
**INERT (a soft `{ok:false, reason:"unconfigured"}` 200) when the secrets are
unset** — so dev and self-host stay quiet and a missing key never blocks a user
action.

**[OWNER] set the provider secrets** (Supabase → Project Settings → Edge Functions
→ Secrets, or `npx supabase secrets set`):

| Provider | Secrets | Notes |
|---|---|---|
| Resend (default) | `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | `EMAIL_PROVIDER` may be unset |
| Postmark | `POSTMARK_SERVER_TOKEN`, `POSTMARK_FROM_EMAIL` + `EMAIL_PROVIDER=postmark` | |

`RESEND_FROM_EMAIL` format: `"SettlementForge <hello@settlementforge.com>"` on a
domain with SPF/DKIM set (`docs/email-lifecycle.md`).

### Template registry + the two Wave-E consumers

Templates are a small registry kept in sync across the edge copy
(`send-email/index.ts` `TEMPLATES`) and the client copy
(`src/lib/emailTemplates.js`), pinned by `tests/lib/emailTemplates.test.js`. To add
one, edit **both** maps (same key) — the parity test enforces it.

Two consumers were named as the seam's first customers:

- **Low-balance notice** — template **`credit_low`** (already defined; fields
  `{displayName, balance, narrativeCost, dailyLifeCost}`). Its client helper
  `notifyCreditLow` exists but is **not yet wired to a call site**
  (`docs/email-lifecycle.md` documents the intended site: `src/store/creditsSlice.js`,
  after a spend crosses below the threshold). Wiring it is a small follow-up.
- **Error alert** — template **`ops_error_alert`** (Wave E; fields
  `{distinctSignatures, threshold, windowMinutes}`). Fed by
  `report_client_error_alert()` (migration 156). It is **authenticated-only** —
  deliberately NOT in `ANON_OK_TEMPLATES`, so it never widens the anonymous mailer
  surface. See §3 for how it fires.

---

## 3. Error alerting — how it flags

The threshold logic (`> N distinct crash signatures/hour`, default 8) lives in
`report_client_error_alert()` (migration 156). It surfaces two ways:

1. **Always-on, in-app (built):** the admin panel → **Client Errors** shows a
   banner every time it's opened — red + `role="alert"` when over threshold. This
   needs no email and no scheduling; it is the reliable operator signal.
2. **Proactive email via the mail seam (contract defined; live wiring deferred):**
   the `ops_error_alert` template is the payload. A proactive hourly email would be
   a `pg_cron` job that calls `send-email` when the threshold is crossed. **That
   path is deliberately not wired live**, because a cron caller has no user JWT and
   would require adding `ops_error_alert` to the anonymous mailer surface
   (`ANON_OK_TEMPLATES` + placeholder rules) — an owner-gated change to the
   perimeter that widens the anon attack surface. Options for [OWNER]:
   - **Recommended:** point an external uptime/log service (Better Stack, etc.) at
     the `health` endpoint / the admin banner, and let *it* own alerting — no anon
     surface change.
   - Or, if an in-house email alert is wanted, treat the anon-template addition as a
     deliberate perimeter decision and add the rate-limit + placeholder rules that
     `send-email`'s `ANON_OK_TEMPLATES` policy requires.

Like the whole error pipeline, the email side is **inert until keys + wiring are
added** — the always-on admin banner is what launch relies on.

**2026-07-28 posture ruling.** Use the recommended external-monitor path; do not
widen `send-email`'s anonymous template surface for launch. The urgent operator
destination is `ops@settlementforge.com`, deliberately separate from customer
support. This selects the channel but does not claim it works: mailbox/DNS setup,
provider routing, and an end-to-end alert drill remain operator evidence required
before the five-minute service objective can be claimed.

---

## See also
- `docs/email-lifecycle.md` — Resend account/DNS + the "add a template" checklist.
- `supabase/functions/_shared/mailAdapter.ts` — the provider-neutral adapter.
- `docs/ops/DEPLOY_ROLLBACK_RUNBOOK.md` — the uptime probe + health endpoint.
