# PERIMETER RUNBOOK

The owner's guide to SettlementForge's abuse-defense perimeter (Wave-D). It says
what each layer does, what it does **not** guarantee, and the exact steps to
activate the parts that ship **inert** (built, but off until you add keys/toggles).

> **The one honest sentence up front.** None of this stops a determined,
> well-resourced adversary, and none of it stops a person using their own AI
> assistant at human scale — that traffic is indistinguishable from the person at
> the wire. The perimeter raises the cost of *bulk* abuse (scraping, bot-waves,
> card-testing, model-training crawls) and makes non-compliance a contract breach.
> It is deterrence and defense-in-depth, not a wall.

---

## The layers (outermost to innermost)

| Layer | Where | Guarantees | Does NOT guarantee |
|---|---|---|---|
| Crawler directives | `public/robots.txt`, `X-Robots-Tag`/`TDM-Reservation` headers (`vercel.json`), `noai` meta (`index.html`) | Voluntary-compliance crawlers (the majors) will skip AI-training ingestion; the reservation is legible + on record | A hostile crawler that ignores the signals; these are advisory, not enforced |
| Host WAF / bot filter | Your host (Vercel / Cloudflare) dashboard — see below | Coarse volumetric + known-bot blocking at the edge, before requests reach the app | Application-aware abuse (a valid user hammering one endpoint) |
| Server rate limits | Deno edge functions + Postgres RPCs | Per-user / per-IP ceilings on expensive + auth-adjacent endpoints; fail-closed | A distributed wave across many IPs + accounts under each ceiling |
| Bot-wave telemetry | `ingest-events` velocity enrichment (`props._vband`) | Makes cadence anomalies **queryable** for review | Blocking (it observes; it does not stop) |
| Human verification | Turnstile seam (managed/invisible) — **INERT until activated** | Raises cost for scripted auth + checkout abuse when active | Stopping a real human, or a user-credentialed agent |
| Server invariant walls | RLS + quota triggers + payment gates (pinned) | The authoritative correctness boundary — a bypassed client still can't cross them | (this is the real wall; everything above is deterrence) |

**Rule of thumb:** everything above the last row is *deterrence and cost*. The
last row (RLS, quotas, payment/entitlement gates) is the *actual* security
boundary and is pinned by tests. If you have to trust one layer, trust that one.

---

## Host-level toggles (do these in the host dashboard — no code)

SettlementForge deploys on **Vercel** (`vercel.json`). At the host:

1. **Enable the platform WAF / Attack Challenge Mode** if/when a wave hits
   (Vercel Firewall, or Cloudflare if the domain is proxied through it). This is
   the fastest lever during an active bot-wave — it challenges/blocks at the edge
   before requests cost you function invocations.
2. **Bot filtering / managed rules** — turn on the managed bot ruleset. Keep an
   **allow** for the legitimate crawlers the funnel needs (Googlebot, Bingbot,
   Slackbot, Twitterbot, `facebookexternalhit`, Discordbot) — these are the ones
   `robots.txt` deliberately does NOT block.
3. **Rate-limit rules** at the edge for `/functions/v1/*` if the platform offers
   them — a coarse per-IP cap complements the in-function limits below.

These are the levers the app code cannot pull for you. Flip them during an
incident; the code-level limits are the always-on baseline.

---

## Turnstile human-verification — activation checklist (ships INERT)

The seam is built and **off**. With `perimeterCaptcha` false and no keys, the
widget is never imported (zero eager bytes), no `captchaToken` is sent, and the
server helper `verifyTurnstile` returns `{ ok: true, enforced: false }` — so
nothing changes for anyone. To activate:

1. **Create a Turnstile widget** in the Cloudflare dashboard (managed mode). Note
   the **site key** (public) and **secret key** (private).
2. **Client site key** — set `VITE_TURNSTILE_SITE_KEY=<site key>` in the build
   env (Vercel project env). Without it the widget renders nothing.
3. **Flip the flag** — set `perimeterCaptcha` on (env `VITE_FLAG_PERIMETER_CAPTCHA=true`,
   or `?flag.perimeterCaptcha=true` for a single-browser test). This makes the
   auth/checkout surfaces lazily import + render the widget.
4. **Auth flows (sign-in / sign-up / password reset):** the client already passes
   `captchaToken` into Supabase's native captcha support (additive). Turn on
   **Supabase Dashboard → Authentication → Settings → Enable Captcha protection**,
   provider **Turnstile**, and paste the **secret key** there. *This dashboard
   toggle is what actually enforces auth captcha* — the client token alone does
   nothing until it is on.
5. **Checkout flows (session creation):** set the edge-function secret
   `TURNSTILE_SECRET_KEY=<secret key>` (`supabase secrets set`), then wire
   `verifyTurnstile(token, ip)` into the checkout-session-creation functions
   (`create-checkout`, `verify-single-dossier`) before the Stripe session is
   created, returning a house-register error (never a stuck button) when
   `ok === false`. The helper is inert until this secret is set.
6. **CSP** — add `https://challenges.cloudflare.com` to `script-src` **and**
   `frame-src` in `vercel.json` (both the app block and, if the widget can appear
   there, keep the map block as-is). While inert this is deliberately NOT shipped.
7. **Test:** with everything on, do a real sign-in, a sign-up, a password reset,
   and a $2.99 dossier purchase (including the **anonymous** buy path). Confirm the
   widget is invisible for a normal human and that a blocked/expired token shows
   the house error idiom, not a dead-end.

**Deliberate exclusions (do NOT add captcha here):** the anonymous **generation**
funnel (the conversion surface stays frictionless — rate limits + bot-wave
telemetry cover it), and anything **inside Stripe's own hosted checkout page**
(Stripe + Radar own that; we gate our door, not theirs).

---

## Rate limits shipped (always on once deployed)

- `create-customer-portal` — per-user (20/hr) + per-IP (60/hr), fail-closed,
  before the three Stripe calls (Wave-D, `_shared/rateLimit.ts` via
  `ingest_check_rate`).
- Pre-existing: `ingest-events` (per-IP `ipall:` 2000/hr + per-actor 120/hr,
  fail-closed), `create-checkout` anon path + `verify-single-dossier` (per-IP),
  `send-email`, `auth-recovery` (per-IP + lockout), `log-client-error`, and the
  per-user/day AI generation limit.

**Owner-gated follow-ups (recommended, not yet built — need a migration or touch
the pin-dense paid paths):** a cross-instance `consume_token_bucket` table/RPC
(smooth refill, replaces the per-instance in-memory backstops); a per-IP burst
dimension on the 11 AI functions (their per-user/day limit is fail-**open** with
no IP dimension); a per-user limit on `create-checkout`'s authed products and on
`verify-checkout-session`. See the Wave-D rate-limit audit table.

---

## Bot-wave telemetry

`ingest-events` stamps a coarse `_vband` (`elevated` / `burst`) prop on ingested
analytics events when per-IP / per-actor cadence crosses a threshold. Query it:
`select event, count(*) from analytics_events where props->>'_vband' = 'burst'
group by 1`. `elevated` is a **lead, not a verdict** — a shared corporate NAT of
honest users trips it. It is best-effort per-instance (a stronger cross-instance
signal is an owner-gated migration).

---

## Honest limits (read this before trusting any layer)

- **robots.txt / X-Robots-Tag / TDM-Reservation** are voluntary. The majors honor
  them; a hostile scraper ignores them. They matter for the record and for the
  compliant majority, and they back the Terms' AI-training reservation.
- **Turnstile managed mode** is invisible for humans and raises the cost of
  scripted abuse — but a determined operator can farm challenges, and a real human
  passes trivially. It is friction for bots, not a gate for people.
- **A user's own AI agent, at human scale, through the normal UI, looks exactly
  like the user.** We deliberately do not try to block it; the line is drawn at
  *volume, scraping, bulk generation, and circumvention*, enforced by rate limits
  and the server walls — not at "a human used an assistant."
- **Client-generated artifacts** (dossiers / PDFs) are built from the user's own
  data in the browser. The anonymous single-dossier purchase IS hard-walled
  server-side (the settlement is withheld until paid) and AI spend IS hard-walled
  (the reservation gate), but signed-in re-export / premium-unlimited is enforced
  at the **offer surface** (a server-authoritative entitlement read), not by a
  server PDF-byte wall — inherent to a client-generated-artifact product. This is
  a conscious design fact, not a hole.
- **The real wall is the server.** RLS, quota triggers, and payment/entitlement
  gates are the boundary a bypassed or hostile client still cannot cross, and they
  are pinned by tests. Everything else buys time and cost.

---

*Companion docs: `docs/legal/TOS_AUTOMATION_CLAUSES_DRAFT.md` (the contractual
layer), `docs/DEPLOY.md` (cutover), and the Wave-D report (the full audit tables).*
