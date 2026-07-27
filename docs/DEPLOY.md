# SettlementForge — Deploy guide

Deployment has two halves: the **client app** (Vite SPA on Vercel) and the
**backend** (Supabase Postgres + Edge Functions). A production client deployment
may start only after the required CI jobs are green for the exact source commit;
the backend pieces need attended commands with Supabase + Stripe credentials.

## Quick status check (post-push)

After pushing to `origin/master`:

1. **CI**: `.github/workflows/ci.yml` runs the same `npm run check` gate you run
   locally (validate data/migration-head/edge/map → typecheck [full + domain-strict]
   → lint → the full test suite → build → verify:dist). Watch:
   <https://github.com/clausellstokes-lang/settlement-engine/actions>

2. **Vercel deployment**: the push-time build is deliberately skipped while CI
   is pending. The post-CI deploy/retrigger jobs proceed only after every required
   check is green. `vercel.json` points at `npx vite build` → `dist/`.

3. **Supabase**: nothing happens automatically. Run the manual steps
   below.

4. **Release proof**: after the client, database, and functions are all live,
   run `npm run ops:post-deploy` with the production health/database
   configuration. It verifies source identity, both sides of the app/map CSP,
   public health, contiguous migration history, and combined
   obligation/application-command health before writing a release receipt. See
   `docs/ops/POST_DEPLOY_VERIFICATION_RUNBOOK.md`.

If the client app's already up but a new feature is missing, the cause
is almost always **a) missing migration** or **b) stale edge-function
bundle**. Check the two manual sections.

## Gating production on CI

**In-repo half — DONE (finding F35).** `.github/workflows/ci.yml` now:
- runs on **every branch push** (not just `master`/`main`), so feature branches
  get the gate before a PR even exists;
- runs the **domain strict-type ratchet** (`typecheck:domain:strict`) that the
  local `npm run check` runs — CI and the local gate no longer diverge;
- has **`deploy` and `redeploy` jobs** gated on the code/build, functional E2E,
  production-build performance, Deno execution, security-coverage, and
  hostile-locale determinism jobs. Both are `master`-only and safely no-op when
  their respective secret is absent.

**Dashboard half — still required to make CI governance complete** (cannot be
done from the repo). The checked-in ignore command fails closed while CI is
pending, but repository code cannot configure branch protection, Vercel tokens,
deploy-hook secrets, or disable a dashboard-side bypass. Complete one of the
following operating models:

1. **Branch protection + PR flow (minimum).** GitHub → Settings → Branches
   → add a rule for `master`: *Require status checks to pass before
   merging* → select **Validate, test, build**, **Chromium end-to-end**,
   **Production-build browser performance**, **Edge function execution tests
   (Deno)**, **Coverage floors (money / security)**, and **Golden master under
   tr_TR + Chatham TZ**; then enable *Require a pull request before merging*.
   Stop pushing straight to `master`; land work through reviewed PRs.

2. **Deploy from CI (strongest).** Turn OFF Vercel's production auto-deploy
   on push (Vercel → Settings → Git), then add the **`VERCEL_TOKEN`** secret
   (GitHub → Settings → Secrets → Actions). The `deploy` job already in
   `ci.yml` then activates automatically after the same complete required-check
   set passes, on `master` only. No green gate, no deploy.

Until one of these is in place, **always let the `pre-push` hook run** (never
`--no-verify` to `master`) and watch the Actions tab after pushing.

## Client app (Vercel) — CI-gated

```bash
# A push starts CI; the gated deploy/retrigger runs only after required checks.
# Vercel then runs `npx vite build`.
# Output: dist/ uploaded to the Vercel CDN.
```

No manual command needed. The only Vercel-side gotcha: **environment
variables**. The client needs:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_STRIPE_PUBLISHABLE_KEY=...     # for Stripe.js
VITE_GENERATE_NARRATIVE_URL=...      # the edge function URL
```

Set these in Vercel's dashboard → Project → Settings → Environment
Variables. Redeploy after changing them so the new values bake into the
client bundle.

**Sitemap (GALLERY-2 phase 2, 2026-07-17):** the gallery per-slug fan-out is
ON BY DEFAULT — `prebuild` (scripts/generate-sitemap.mjs) appends every public
`/gallery/:slug` whenever `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` exist
in the build env, which they do on Vercel per the block above (no extra flag
to set; `SITEMAP_INCLUDE_GALLERY=0` suppresses it). The COMMITTED
`public/sitemap.xml` is the offline artifact — static routes + the 15 gallery
facet hubs — and stays byte-pinned by tests/build/sitemap.test.js; the
deployed `dist/sitemap.xml` is the superset with slugs.

## Database migrations (Supabase) — manual

Migrations live in `supabase/migrations/*.sql`. Each new migration is
applied on top of the current schema.

**Rehearse before production.** The current production-ledger gap is divided
into reviewed, bounded waves and must first pass on an isolated
production-shaped clone:

```bash
npm run ops:migrations:rehearse
# Then follow docs/ops/MIGRATION_REHEARSAL_RUNBOOK.md for the attended clone run.
```

The runner refuses local/unattested targets, stages no migration above the
current wave, records pre/post integrity queries, and emits a source-bound
receipt. A clone pass is required release evidence; it does not perform or
authorize a production write by itself.

For the attended production push:

```bash
# Link the local repo to your Supabase project (one-time):
npx supabase login
npx supabase link --project-ref <your-project-ref>

# Apply every pending migration:
npx supabase db push

# Optional: verify the migration ran without errors:
npx supabase db diff
```

**SECURITY — MUST APPLY.** Migrations **057, 059, 060** enforce account-status
writes and RLS (a disabled/banned account must not be able to write), **058**
scopes `system_config` public reads, **061** locks profile moderation columns,
and **062** closes three authz gaps (RLS on the analytics tables, drops the
un-audited privileged `profiles`-UPDATE bypass, column-locks owner
support-ticket edits). Migration **066** (Auth Phase 2) adds the
server-write-only `security_answers` bcrypt table. **128–130** strip the latent
pantheon from every public projection, **135** revokes the PUBLIC grant on the
role/tier RPC, and **136** lifts the world-snapshot deny census. A by-the-book
operator must never under-apply this trust-boundary set.

**Apply every file in `supabase/migrations/` in lexical order — do not stop at a
remembered number.** Migration numbers grow every release, so this guide
deliberately does NOT pin a "latest" number that would rot and cause an operator
to under-apply.

**Current migration head: `190_credit_pack_clawback.sql`** (this filename is kept
current by a freshness pin — `tests/docs/deployRunbookFreshness.test.js` derives the
head from `supabase/migrations/` and fails the gate if this line drifts).
<!-- @enforced-by tests/docs/deployRunbookFreshness.test.js -->

Do **not** hand-count from a fixed starting migration — `db push` applies EVERY
pending migration on top of the current schema, in order, and self-corrects
regardless of how far behind prod is. They must land before the corresponding
client and ordinary functions. The two durable workers are deliberately deployed
inert before migrations 175/180, and `stripe-webhook` is held until migration
181's lease RPC is visible through PostgREST; `scripts/deploy.sh` enforces that
two-phase exception. Confirm applied vs pending (don't trust any number written
here — ask the tooling):

```bash
npx supabase migration list   # applied (local + remote) vs pending — the authority
npx supabase db diff          # an empty diff means remote schema matches the tree
```

**Is prod actually at head?** Three in-repo checks answer this:

- `npm run validate:migration-head` reads the checked-in applied-head ledger
  (`supabase/applied-head.json`) and warns when prod is behind the repo head — the
  documented-normal commit→deploy window. Bump `appliedHead` only *after* a
  successful `db push`.
- The live probe: `SUPABASE_MIGRATION_HEAD=<live head number> npm run
  validate:migration-head` compares the live DB head against the repo head and
  fails hard on a mismatch (use it in the deploy pipeline, where a live DB exists).
- `npm run ops:post-deploy` independently reads the live history through a
  transaction-forced read-only connection, compares it with the filesystem
  head, and includes that result in the final release receipt.

**Edge functions are the one UNGATED path to production — deploy them by hand,
deliberately.** The client deploy is fail-closed CI-gated (`vercel-ignore-build.mjs`)
and the DB has the `applied-head.json` currency gate, but edge functions ship via a
bare `npx supabase functions deploy` (or `scripts/deploy.sh`) straight from whatever
your **local working tree** contains. Nothing checks that CI is green, nothing checks
the tree is clean, and — unlike the migration ledger — nothing records which commit's
functions are live. This matters because the edge layer IS the money + auth trust
boundary (`stripe-webhook`, `create-checkout`, `auth-recovery`). Two consequences to
guard against by discipline:

- **Deploy only from a clean tree at a pushed, CI-green commit.** Before deploying any
  function, confirm `git status` is clean and the commit you're on is the one CI passed.
  Deploying with local edits present ships bytes that were never tested and that no
  reviewer saw. Note the deploying commit SHA in your deploy record (there is no
  automated ledger to consult later).
- **`npm run check:edge-behavior` is FAIL-OPEN on a missing toolchain.** It runs the
  edge behavioral suite when `deno` is on `PATH`, but **exits 0 (skips) when deno is
  absent** — so a green local run does NOT prove the edge functions were exercised.
  Install deno so the pre-push hook actually gates them, and never treat a "skipped"
  edge check as a pass. CI's separate `deno-tests` job is the real gate, which is
  exactly why you must only deploy from a commit that job passed.
  (`npm run check:full` = `check` + `check:edge-behavior` mirrors everything CI runs.)

There are 31 functions total — deploy all of them on a first cutover.

## Edge function — manual

The `generate-narrative` edge function depends on the bundled
aiGrounding contract at `supabase/functions/_shared/aiGroundingBundle.js`.
**Rebuild it BEFORE deploying** if anything under `src/domain/` has
changed since the last bundle:

```bash
npm run build:edge-shared
# Verify the freshness contract:
npm test -- tests/edgeFunctions/aiGroundingBundle.freshness.test.js
```

Deploy them. **The canonical path is `bash scripts/deploy.sh`** — it
auto-discovers every `supabase/functions/*` directory (skipping `_shared`) and
derives each one's `--no-verify-jwt` flag from `config.toml`, so a newly-added
function can never be silently left undeployed and the platform JWT gate can never
drift from config. It bootstraps the deletion/refund workers and their shared
secrets before `db push`, waits for both routes to answer their non-mutating
method probe, activates and verifies both migration-seeded dispatcher rows
immediately afterward, then readiness-probes the migration-181 lease RPC before
creating or deploying the Stripe webhook. To deploy by hand, preserve that ordering
and mirror what the script derives — the fourteen self-authenticating functions get
`--no-verify-jwt`, the seventeen authenticated ones get no flag:

```bash
# verify_jwt = false (self-authenticating — signature, shared secret, or anon path):
npx supabase functions deploy stripe-webhook --no-verify-jwt          # Stripe posts a signature, not a JWT
npx supabase functions deploy verify-single-dossier --no-verify-jwt   # Stripe session id, not auth
npx supabase functions deploy ingest-events --no-verify-jwt           # anonymous analytics sink
npx supabase functions deploy log-client-error --no-verify-jwt        # anonymous crash-report sink
npx supabase functions deploy analytics-export --no-verify-jwt        # x-export-secret shared secret (cron)
npx supabase functions deploy pricing-resync-cron --no-verify-jwt     # x-cron-secret shared secret (nightly)
npx supabase functions deploy send-email --no-verify-jwt              # per-template self-auth + anon cap-warning
npx supabase functions deploy auth-recovery --no-verify-jwt           # logged-out password recovery (no JWT)
npx supabase functions deploy og-image --no-verify-jwt                # social-unfurl bots (no JWT), public data only
npx supabase functions deploy health --no-verify-jwt                  # uptime liveness + deep DB probe (no JWT)
npx supabase functions deploy founder-transfer --no-verify-jwt        # run_due cron x-cron-secret; user actions self-auth in-handler
npx supabase functions deploy retention-warning-cron --no-verify-jwt  # nightly pg_net cron, x-cron-secret shared secret
npx supabase functions deploy account-deletion-worker --no-verify-jwt # hourly durable deletion cleanup, x-cron-secret
npx supabase functions deploy payment-refund-worker --no-verify-jwt   # five-minute durable Stripe refund recovery, x-cron-secret
# verify_jwt = true (require an authenticated user — no flag):
npx supabase functions deploy create-checkout
npx supabase functions deploy verify-checkout-session                 # account-bound checkout verification
npx supabase functions deploy create-customer-portal                  # "Manage subscription" billing portal
npx supabase functions deploy generate-narrative
npx supabase functions deploy generate-chronicle
npx supabase functions deploy ai-analyst                             # Surveyor S1 analyst (requires ANTHROPIC_API_KEY)
npx supabase functions deploy surveyor-byok                          # Surveyor BYOK key verification + health
npx supabase functions deploy interview                               # V-1 THE INTERVIEW — cited answers + conjecture register (JWT + entitlement, metered 'analysis')
npx supabase functions deploy interpret-session                       # Surveyor S3 intent compiler (JWT + entitlement + kill-switch)
npx supabase functions deploy parley                                  # Surveyor S3 in-character parley (JWT + entitlement + kill-switch)
npx supabase functions deploy custom-content                          # Surveyor S4 custom-content compiler (JWT + entitlement + kill-switch)
npx supabase functions deploy style-overhaul                          # Surveyor style-overhaul compiler (JWT + entitlement + kill-switch)
npx supabase functions deploy construct-settlement                    # Surveyor S5 settlement construction (JWT + entitlement + kill-switch)
npx supabase functions deploy construct-realm                         # Surveyor S6 realm construction (JWT + entitlement + kill-switch)
npx supabase functions deploy surveyor-autonomy                       # Surveyor S7 autonomy composer (JWT + entitlement + kill-switch)
npx supabase functions deploy account-actions
npx supabase functions deploy admin-actions
```

There are **31 deployable functions** (every `supabase/functions/*` dir except
`_shared`) — deploy all of them on a first cutover. The fourteen `verify_jwt = false`
and seventeen `verify_jwt = true` postures above are pinned in `config.toml`, the
single source of truth `deploy.sh` parses. The freshness pin
(`tests/docs/deployRunbookFreshness.test.js`) fails the gate if any function dir
stops being named here. <!-- @enforced-by tests/docs/deployRunbookFreshness.test.js -->

Set the required env vars in the Supabase dashboard → Project →
Functions → Secrets:

```
ANTHROPIC_API_KEY            # for generate-narrative + generate-chronicle + ai-analyst
# BYOK (ai-analyst): also set the DB secret `app.settings.byok_secret` (pgcrypto passphrase
# for surveyor_byok_keys); BYOK is fail-closed/unavailable until it is configured.
RESEND_API_KEY               # for send-email (Resend provider key)
RESEND_FROM_EMAIL            # for send-email (verified sender address)
STRIPE_SECRET_KEY            # for webhook, checkout, and dossier verification
STRIPE_WEBHOOK_SECRET        # for stripe-webhook signature verification
STRIPE_PRICE_CREDITS_25      # per the PRICE_MAP in create-checkout
STRIPE_PRICE_CREDITS_60
STRIPE_PRICE_CREDITS_150
STRIPE_PRICE_PREMIUM
STRIPE_PRICE_FOUNDER_LIFETIME
STRIPE_PRICE_SINGLE_DOSSIER
ACCOUNT_DELETION_CRON_SECRET # random high-entropy secret for the pg_net deletion worker
PAYMENT_REFUND_CRON_SECRET  # random high-entropy secret for the pg_net refund worker
SUPABASE_URL                 # already set by Supabase
SUPABASE_ANON_KEY            # already set by Supabase
SUPABASE_SERVICE_ROLE_KEY    # required for admin operations
CLIENT_URL                   # e.g. https://settlementforge.com
```

### Activate the durable account-deletion worker

Migration 175 deliberately replaces the old SQL-only deletion cron with an
inert-until-configured Edge dispatch. To minimize the paused window, set the
function secret and deploy `account-deletion-worker` before applying 175 (it
remains inert while the config row is absent). Applying 175 unschedules the old
cron immediately; apply it and update the database config in the same maintenance
window. Deletions safely remain queued meanwhile. Use one high-entropy value in
both places:

The canonical script performs and verifies this whole sequence. On a re-deploy it
reuses the secret already stored in the private dispatcher row; on first install
it generates one. The commands below are the manual equivalent.

```bash
npx supabase secrets set ACCOUNT_DELETION_CRON_SECRET='<random-secret>'
```

```sql
-- Service-role/operator SQL only. system_config is not public-readable.
update public.system_config
   set value = value || jsonb_build_object(
     'url', 'https://<project-ref>.supabase.co/functions/v1/account-deletion-worker',
     'secret', '<the same random secret>'
   )
 where key = 'account_deletion_cron';
```

Until both `url` and `secret` are non-empty, the hourly dispatcher returns
`not_configured` and does no work. Set `enabled=false` in that row to pause
dispatch without losing queued jobs. `STRIPE_SECRET_KEY` is also required to
finish any queued account that still has billing linkage; without it the job
stays retryable and the deletion request remains `processing`. Completion
irreversibly soft-deletes the GoTrue user (replacing its id with a hash and
removing its login identities, credentials, and sessions), deletes linked
Stripe customers, and only then marks the request done.

### Activate the durable payment-refund worker

Migration 180 turns migration 177's durable refund records into an unattended
recovery queue. Deploy `payment-refund-worker` and set its secret before applying
180; it remains inert while the config row is absent. Then apply migrations and
set the same high-entropy secret in the private dispatcher row:

The canonical script performs this in the same two-phase bootstrap as account
deletion and refuses to finish unless the persisted row has `enabled=true`, the
deployed worker URL, and the exact function-side secret.

```bash
npx supabase secrets set PAYMENT_REFUND_CRON_SECRET='<random-secret>'
```

```sql
-- Service-role/operator SQL only. system_config is not public-readable.
update public.system_config
   set value = value || jsonb_build_object(
     'url', 'https://<project-ref>.supabase.co/functions/v1/payment-refund-worker',
     'secret', '<the same random secret>'
   )
 where key = 'payment_refund_recovery_cron';
```

Until both values are non-empty, the five-minute dispatcher returns
`not_configured` and performs no claims. Set `enabled=false` to pause without
losing obligations. `STRIPE_SECRET_KEY` is required; when it is absent or Stripe
is transiently unavailable, the leased row is released into bounded durable
retry instead of being marked refunded. Recovery reuses the original
idempotency key and rebuilds Stripe metadata only from immutable obligation
identity; nullable user, auto-reload-attempt, and Checkout links stay
database-only so later fill/null transitions cannot change replay parameters.

Legacy SKU keys (`credits_5`, `credits_15`, `credits_40`, etc.) are
kept in the price map for refund/replay continuity — set them if you
want old refund links to resolve, otherwise leave them unset.

## Stripe webhook endpoint

Set the webhook destination in Stripe dashboard → Developers →
Webhooks → Add endpoint:

```
URL:    https://<your-supabase-project>.supabase.co/functions/v1/stripe-webhook
Events: checkout.session.completed,
        checkout.session.async_payment_succeeded,
        checkout.session.async_payment_failed,
        checkout.session.expired,
        payment_intent.succeeded,
        payment_intent.payment_failed,
        refund.created,
        refund.updated,
        refund.failed,
        invoice.paid,
        invoice.payment_succeeded,
        invoice.payment_failed,
        charge.refunded,
        charge.dispute.created,
        customer.subscription.updated,
        customer.subscription.deleted
```

Copy the signing secret into `STRIPE_WEBHOOK_SECRET` (above).

Migration 181 retains its direct-table claim only as transitional compatibility
for an older webhook instance during a rolling deployment. It is not the canonical
cutover path: `scripts/deploy.sh` calls `claim_stripe_webhook_event` with an empty
event id and waits for the expected non-mutating `event id is required` response
before it creates the endpoint or deploys `stripe-webhook`. That response proves
PostgREST has reloaded the RPC schema; a lingering `PGRST202` aborts the cutover
instead of exposing the crash-weaker legacy claim. Retire the fallback/default
after every pre-181 webhook instance has been removed.

After cutover, monitor the two durable external-work queues:

```sql
select status, count(*) from public.account_deletion_cleanup_jobs group by status;
select status, count(*) from public.payment_refund_obligations group by status;
```

Deletion jobs in `retry` and refund obligations in `pending` or
`requires_action` should advance on later worker runs. A refund in `failed` or
`canceled` is terminal and requires operator review/manual reimbursement; never
delete the row to make the dashboard look green.

## Pre-deploy sanity check

Run locally before pushing:

```bash
npm run check        # the full 13-stage gate (validate → typecheck → lint → test → build → verify:dist)
npm run build:edge-shared   # regenerate bundle if src/domain/ changed
npm run ops:migrations:rehearse   # review the exact applied-head → repo-head waves
```

The code/build commands must pass exit code 0. The migration plan must match the
reviewed clone-rehearsal receipt. Any drift after that receipt invalidates it.

## Post-deploy release proof

After Vercel, migrations, dispatcher activation, and edge functions are live,
run the fail-closed verifier:

```bash
POST_DEPLOY_DATABASE_URL='postgresql://release_verifier:REDACTED@db.production-ref.supabase.co:5432/postgres?sslmode=verify-full' \
SF_PRODUCTION_DATABASE_HOST='db.production-ref.supabase.co' \
SUPABASE_URL='https://production-ref.supabase.co' \
SUPABASE_SERVICE_ROLE_KEY='REDACTED' \
npm run ops:post-deploy -- \
  --health 'edge=https://production-ref.functions.supabase.co/health?deep=1' \
  --receipt /secure/release/post-deploy.json
```

Run from the clean commit that should be deployed. A release receipt is written
only when both live `/api/release` identities, application/map CSP and pinned
map artifact, public deep health, contiguous migration history, and combined
external-obligation/application-command severity all pass. Full configuration,
evidence fields, and failure actions are in
`docs/ops/POST_DEPLOY_VERIFICATION_RUNBOOK.md`.

## Rollback

The simplest rollback is to revert the bad commit and push:

```bash
git revert <bad-sha>
git push origin master
```

Vercel will auto-deploy the revert. For an edge-function regression,
also re-deploy from the prior good commit:

```bash
git checkout <good-sha> -- supabase/functions/<name>/
npx supabase functions deploy <name>
git checkout master
```

Database migrations CANNOT be rolled back automatically. The default is a
reviewed forward-fix; the few data-safe partial reversals and every migration
train rollback classification live under `supabase/rollback/`. The
`schemaVersion` + migration chain in `domain/settlementMigrations.js` covers
saved-settlement shapes, not the PostgreSQL schema. Follow
`docs/ops/DEPLOY_ROLLBACK_RUNBOOK.md` and never improvise a data/RLS reversal
during an incident.

## Common breakage modes

| Symptom | Likely cause | Fix |
|---|---|---|
| "Insufficient credits" but balance is fine | spend_credits RPC missing | Apply migration 009 |
| Webhook 400 on every event | Bad STRIPE_WEBHOOK_SECRET | Copy fresh secret from Stripe |
| Account deletion remains `processing` | Worker URL/secret or Stripe key is missing | Check `account_deletion_cron`, function logs, and `STRIPE_SECRET_KEY` |
| Refund remains `pending` | Refund worker is inert or Stripe is unavailable | Check `payment_refund_recovery_cron`, worker logs, and the obligation retry fields |
| AI narrative streams "Invalid JSON" repeatedly | Stale aiGroundingBundle | `npm run build:edge-shared` + redeploy |
| "Price ID not configured for X" | Missing STRIPE_PRICE_X env var | Set in Supabase Functions secrets |
| Bot guard rejects real traffic | Aggressive UA pattern | Update `_shared/requestMeta.ts` ALLOWED_BOT_PATTERNS |
| Premium feature shows for free user | Migration 009 didn't apply | Re-run `supabase db push` |

## Where to look when it breaks

- **Client-side errors**: browser console + Vercel function logs
- **Edge-function errors**: Supabase dashboard → Functions → Logs
- **Database errors**: Supabase dashboard → Database → Logs
- **Stripe webhook errors**: Stripe dashboard → Developers → Webhooks →
  the endpoint → recent deliveries
- **CI failures**: GitHub Actions → the failing workflow run
