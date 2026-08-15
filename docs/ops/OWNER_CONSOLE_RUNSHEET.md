# OWNER CONSOLE RUNSHEET — every act only you can perform (2026-07-26)

> One sheet, in execution order. Each item is an act on YOUR accounts (registrar,
> Vercel, Supabase, Stripe) or with your signature. Repo-side work for every item
> is DONE and banked; nothing here needs code. Companion docs: the four runbooks
> in this directory, and docs/OWNER_DECISION_QUEUE.md (ledger branch) for the
> rulings each act executes. Check items off in place with the date.

## 1 · Map origin (blocks the app functioning at deploy — it fails closed without this)
Per FMG_ORIGIN_RUNBOOK.md, deploy MAP FIRST, then app:
- [ ] Create the Vercel project for `map.settlementforge.com` (same repo, map build).
- [ ] DNS: CNAME `map` → Vercel; confirm TLS issues cleanly.
- [ ] Set `VITE_FMG_URL=https://map.settlementforge.com` in the APP project's env.
- [ ] After both deploys: `npm run ops:post-deploy` must pass its origin-identity
      and frame-contract checks (api/release.js must answer on BOTH origins).

## 2 · Cron workers + obligation monitor (SERVICE_OBJECTIVES stays "unachieved" until this)
- [ ] Generate two secrets (e.g. `openssl rand -hex 32` each); set as Supabase
      function secrets: `ACCOUNT_DELETION_CRON_SECRET`, `PAYMENT_REFUND_CRON_SECRET`.
- [ ] Schedule pg_net cron invocations for `account-deletion-worker` and
      `payment-refund-worker` per migrations 175/180's cadence notes, sending
      `x-cron-secret`.
- [ ] Stand up the PRIVATE monitor: any always-on machine running
      `npm run ops:obligations` every ≤4 minutes with alert delivery to you;
      perform ONE alert-delivery drill and keep the receipt (SERVICE_OBJECTIVES.md
      requires the retained drill receipt).

## 3 · Migration rehearsal → the push (T9)
- [ ] Provision a PRODUCTION-SHAPED CLONE from a fresh backup (Supabase: restore
      backup to a new project). Never point tooling at the real host — the
      runbook denylists it.
- [ ] Mint the attestation and run: `npm run ops:migrations:rehearse` — 11 waves,
      122→192, per MIGRATION_REHEARSAL_RUNBOOK.md; keep every wave receipt.
- [ ] Only after rehearsal receipts + your deploy decision: `supabase db push`
      against production (the deploy sequencing in DEPLOY_ROLLBACK_RUNBOOK.md
      governs; admin-actions ships AFTER the client release per ruling D4).
- [ ] Bump supabase/applied-head.json ONLY after live-head verification passes.
- [ ] Deploy-time check (ruling D4): verify production GoTrue mints `amr`
      entries — sign in fresh, decode the access token, confirm a password amr
      with a fresh timestamp (twoKey freshness depends on it).
- [ ] Until the webhook migrations (177/180/181) are LIVE: **issue no partial
      refunds** — the deployed legacy webhook still claws back whole seats.

## 4 · Support email (T11 — no code involved)
- [x] Destination selected under owner delegation: `support@settlementforge.com`.
      The Gmail fallback stays live until the branded mailbox passes the next step.
- [ ] Configure MX/forwarding at the registrar; send a test mail and confirm the
      round-trip.
- [ ] Set `VITE_SUPPORT_EMAIL=support@settlementforge.com` in the deploy env — in the SAME
      deploy batch, never before the round-trip passes.

## 5 · Stripe Connect + founder transfers (D7/T13 — at PUSH #3)
- [ ] After legal sign-off (T10): activate Stripe Connect in the dashboard.
- [ ] Only then consider founder-transfer activation (T13) — transfers depend on
      Connect for payouts, and legal sign-off is their hard gate.

## 6 · CSP (ruling D1 — already decided, just verify)
- [ ] Nothing to configure: the banked vercel.json enforces from deploy one.
- [ ] At first deploy: browse the primary routes on both origins with devtools
      open — zero CSP violations expected. If a legitimate resource breaks, the
      rollback is the one-line rename to Report-Only; report it, don't allowlist
      blind.

## 7 · The off-machine bundle (housekeeping)
- [ ] `~/Desktop/settlementforge-banking-7a6603de.bundle` (139MB) is the interim
      backup of claude/composite-r4. Copy it somewhere off this machine today
      (any synced/cloud folder). Delete it once `git ls-remote origin
      claude/composite-r4` shows the branch on GitHub.
