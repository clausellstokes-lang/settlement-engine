# Production Email Runbook

SettlementForge has **three mail lanes over two transport systems**. Confusing
their authority or consent rules is the most common launch-email mistake, so
this runbook keeps them apart:

1. **Auth mail** — signup confirmation, password reset, magic links. Sent by
   Supabase's built-in **GoTrue** mailer (or your custom SMTP relay). §1.
2. **Transactional / lifecycle mail** — welcome, save/export confirmations, the
   low-balance notice, the ops error alert. Sent by the **`send-email` edge
   function** through the provider-neutral mail adapter. §2.
3. **Operator Messages courier** — direct notices and queued broadcasts whose
   authoritative copy is already in Account Messages. `admin-actions` handles
   direct delivery; `operator-message-worker` handles leased broadcast batches.
   Both use the same provider-neutral adapter, not GoTrue or the public
   `send-email` template endpoint. §4.

`docs/email-lifecycle.md` covers system (2)'s Resend account/DNS setup; this
runbook adds the auth-SMTP posture (system 1), the provider-adapter + template
consumers (system 2), and Operator Messages delivery law (lane 3). Steps marked
`[OWNER]` are dashboard actions.

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

## 4. Operator Messages — Account is authoritative, email is a courier

Operator-authored bodies are stored and rendered as plain text; neither the
Account surface nor email accepts arbitrary HTML. Direct messages, warnings,
and bans commit the message and the real operator audit in one database RPC
before any provider call. A provider outage therefore never loses or rolls back
the notice. Broadcasts are one message plus a durable leased job; recipients are
paged by stable `(created_at, user_id)` cursor under the active lease. A page is
discovery only: before every provider call the worker renews the job lease and
CAS-claims that recipient `pending -> sending`. Only the claim-returned address,
consent result, unsubscribe token, attempt token, and idempotency key authorize
the send. The terminal receipt write is bound to both that attempt token and its
job-lease token.

If a worker disappears with a receipt in `sending`, reclaiming its expired job
lease terminalizes that receipt as `delivery_outcome_unknown`; it is never put
back into `pending` and never resent. That state is deliberately honest: the
provider may have accepted the message before the worker lost its response, but
Account Messages still has the authoritative copy. Resend additionally honors
the stable key through its documented
[`Idempotency-Key`](https://resend.com/docs/dashboard/emails/idempotency-keys)
API contract. [Postmark does not support provider idempotency
keys](https://postmarkapp.com/support/article/what-is-an-idempotency-key), so its
safety comes from the same no-resend orphan rule; operators must not interpret
`delivery_outcome_unknown` as proof of either delivery or non-delivery.

The class is a legal delivery boundary:

- **`service`** is transactional. Account always receives it and email is
  attempted regardless of marketing preferences. It carries no unsubscribe
  header because preferences do not suppress it.
- **`announcement`** is optional email. Account always receives it, but the
  courier sends email only when `product_updates` consent is true. Every sent
  announcement includes a visible unsubscribe URL plus `List-Unsubscribe` and
  RFC 8058 `List-Unsubscribe-Post` headers.

There are no tracking pixels and no email-open events. In-product read state and
delivery receipts are the complete dataset. Provider failures are recorded as a
closed `provider_error` reason; raw provider exception text is only sent through
the PII-redacting structured logger.

### Public unsubscribe boundary

`unsubscribe` is intentionally `verify_jwt=false`: logged-out users and email
clients have no Supabase JWT. GET is confirmation-only and performs no RPC. POST
validates the opaque UUID token and a closed category, then uses the edge-held
service-role key to call the opt-out-only RPC. The database grants that RPC only
to service role; possession of a link can disable a preference, never enable one
or read account data. Do not add `botGuard` here because legitimate RFC 8058 mail
clients POST automatically.

### Broadcast worker launch posture

`operator-message-worker` ships **disabled**. Deploy the route, but leave the
private `operator_message_delivery_cron` row at `enabled=false`, `url=null`, and
`secret=null`, and do not set `OPERATOR_MESSAGE_CRON_SECRET` in this rollout.
Activation is a separate owner-attended operation after an end-to-end consent,
unsubscribe, provider-throughput, cancellation, concurrent-worker lease/CAS,
and crash-after-provider-before-receipt drill. See
`docs/DEPLOY.md`; this runbook does not authorize activation.

---

## See also
- `docs/email-lifecycle.md` — Resend account/DNS + the "add a template" checklist.
- `supabase/functions/_shared/mailAdapter.ts` — the provider-neutral adapter.
- `docs/ops/DEPLOY_ROLLBACK_RUNBOOK.md` — the uptime probe + health endpoint.
