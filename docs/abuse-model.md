# SettlementForge — Abuse model (Tier 0.10)

This document captures the threat model the product faces, the
mitigations currently in place, and the gaps that remain. It's
written for engineers adding new endpoints / features — read it
before exposing new attack surface.

## Threat actors

1. **Casual scraper.** Tries to pull every public gallery dossier or
   every PDF export for resale on a generic-content marketplace.
   Volume-bound, UA-identifiable, no auth.

2. **Credit thief.** Signs up, drains AI credits beyond their tier's
   allowance, or tries to escalate their role / tier / is_founder
   flag to bypass payment.

3. **Privilege escalator.** Authenticated user trying to gain
   developer / admin access via direct DB writes or
   metadata-manipulation.

4. **Stripe / payment forger.** Replays old webhooks, crafts fake
   `checkout.session.completed` events, or tampers with metadata to
   provision premium / founder to another user's account.

5. **Prompt injector.** Embeds fact-injection in any user-controlled
   string (NPC name, settlement description, narrative direction)
   to make the AI overlay output contradictions or invent entities.

## Surfaces + mitigations

### Generation (client-side)

- **Surface.** `HomeHero` runs the generator in-process via the
  Vite-bundled pipeline. No server cost. Saves to localStorage for
  anonymous users.
- **Threat.** Casual scraper generates thousands of dossiers to
  scrape names / data.
- **Mitigation.**
  - localStorage cap (`anonGenCounter.js`, 3/day default).
  - PDF watermark on anonymous exports (`Cover.jsx`).
  - Bypassable by clearing localStorage — but each bypass requires
    a fresh session, so a scraper hitting volume becomes
    UA/IP-traceable.
- **Gap.** No server-side telemetry of generations. Volume anomalies
  invisible.

### Edge functions

All four edge functions (`stripe-webhook`, `create-checkout`,
`generate-narrative`, `admin-actions`) inherit the same defense
pattern as of Tier 0.10:

- **Obvious-bot guard.** `_shared/requestMeta.ts#botGuard` rejects
  obvious scrapers (curl / python-requests / headless browsers / bot
  UAs) with 403 before any other work. Real users are never blocked;
  the bot pattern list is deliberately conservative.
- **Allow-list.** Stripe's own UA, monitoring services (UptimeRobot,
  Pingdom, BetterStack), Supabase health checks bypass the bot
  guard so legitimate infra isn't broken.
- **Auth gate.** Every function that takes user input requires either
  a Supabase JWT (`create-checkout`, `generate-narrative`,
  `admin-actions`) or a verified Stripe signature (`stripe-webhook`).
- **Role gate.** `admin-actions` additionally requires
  `profile.role IN ('developer', 'admin')`.

### Database (Postgres + RLS)

- **Surface.** Direct `UPDATE` of `profiles` row via the user's JWT.
- **Threat.** Self-escalation by setting `role='developer'`, etc.
- **Mitigation.** Migration 009 column-locked RLS policy: every
  protected column (role / tier / credits / is_founder) must equal
  its prior value or the UPDATE is rejected at row level.
- **Coverage.** `supabase/tests/profile_security.sql` (Tier 0.6)
  proves every escalation path is blocked. Run via `supabase test
  db` before deploy.

### Stripe payments

- **Surface.** `stripe-webhook` ingests checkout-completed events
  and grants tier upgrades / credits.
- **Threat.** Forged webhooks, replayed webhooks, tampered metadata.
- **Mitigation.**
  - `stripe.webhooks.constructEvent` verifies the request signature
    against `STRIPE_WEBHOOK_SECRET` BEFORE any metadata read.
  - `create-checkout` is the only path that populates
    `session.metadata` with the user-id + product — it derives
    `supabase_user_id` from `user.id` of the server-verified JWT
    (never from the request body), and validates `product` against
    a server-controlled `PRICE_MAP`. So a user cannot upgrade
    another account.
- **Coverage.** Contract tests in
  `tests/edgeFunctions/contracts.test.js` (Tier 0.5) lock both
  invariants in place.

### AI overlay

- **Surface.** `generate-narrative` runs the AI pass over the
  settlement and merges the refined object back.
- **Threat.** Prompt injection: a user embeds fact-injection text in
  an NPC name or narrative direction that tricks the AI into
  inventing entities or contradicting facts.
- **Mitigation.**
  - **Prompt-injection-safe ordering** (Tier 6.9): system →
    developer → dossier → user direction → format. User direction
    NEVER precedes facts.
  - **Dossier strips user direction from constraints** before
    JSON.stringify so adversarial text doesn't sit alongside the
    canon.
  - **Runtime verifier** (Tier 6.4 / `aiOverlayVerifier`) compares
    pre- and post-AI settlements; refuses to mark an overlay clean
    if any of: invented_entity, removed_entity, renamed_entity,
    changed_fact, changed_canon, changed_user_field, or
    removed_history_beat fires.
  - **Dynamic PRESERVATION_RULES** emitted from
    `forbiddenChanges(settlement)` so every refinement-pass prompt
    explicitly names every locked entity + user-edited field.
- **Coverage.** 24 grounding integration tests + 22 violations-UI
  tests + 12 contract tests on the edge function. Each prompt-
  injection canary asserts user-direction text never appears in the
  dossier JSON.

## Gaps (open work)

- **No structured anomaly logging.** Bot rejections emit
  `console.warn` lines; there's no `anonymous_telemetry` /
  `edge_function_telemetry` table aggregating volume per IP/UA. A
  future phase could add this once volume data justifies the
  storage.
- **No per-IP rate-limit at the edge.** The bot guard rejects
  obvious-bot UAs, but a polite-UA scraper hitting 1000 endpoints/
  second isn't rejected. Auth gating + Supabase's connection limit
  is the de-facto throttle today. A future phase could wire
  Cloudflare Workers KV or Postgres-backed bucketing.
- **No CAPTCHA on signup.** Bot signups → unused accounts. Low cost
  to the system but pollutes analytics. Future phase.
- **No bot detection on the gallery.** Public dossier pages are
  fully indexable (intentional for SEO) but also fully scrapable.
  Watermarking applies only to PDF exports, not to gallery HTML.

## When to update this document

- New edge function: add a surfaces entry + ensure botGuard is wired
  in OR document why it isn't.
- New escalation path discovered: add to mitigations OR move to
  Gaps with a phase plan.
- Bot-pattern false positive reported: update
  `_shared/requestMeta.ts#OBVIOUS_BOT_PATTERNS` and note here.
