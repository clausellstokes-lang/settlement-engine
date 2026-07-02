# SettlementForge — Deploy guide

Deployment has two halves: the **client app** (Vite SPA on Vercel) and the
**backend** (Supabase Postgres + Edge Functions). The client redeploys from
`master` through a CI-gated path — a push does NOT ship directly; CI must go
green first, and (once the deploy-hook secret is set) a post-CI job triggers the
actual build. The backend pieces need manual commands run with your Supabase +
Stripe credentials.

## Quick status check (post-push)

After pushing to `origin/master`:

1. **CI**: `.github/workflows/ci.yml` runs the check gate (validate data/edge/map
   → typecheck → lint → the full Vitest suite → build). The test count grows every
   PR — the live number is whatever the CI run reports, not a figure pinned here.
   Watch:
   <https://github.com/clausellstokes-lang/settlement-engine/actions>

2. **Vercel deploy**: the push-triggered build is SKIPPED by the fail-closed
   ignore-gate (`vercel.json` → `scripts/vercel-ignore-build.mjs`) because CI
   hasn't reported yet. What actually ships is the `redeploy` job at the end of
   `ci.yml`: after `check` + `e2e` + `deno-tests` all go green on a `master`
   push, it POSTs the Vercel Deploy Hook, and that hook-triggered build passes
   the (now-green) gate. This is OPT-IN — it no-ops unless the
   `VERCEL_DEPLOY_HOOK_URL` secret is set (see *Gating production on CI*); until
   then a green CI run leaves the deploy waiting on a manual dashboard Redeploy.
   `vercel.json` points at `npx vite build` → `dist/`. Watch the Vercel
   dashboard for the project.

3. **Supabase**: nothing happens automatically. Run the manual steps
   below.

If the client app's already up but a new feature is missing, the cause
is almost always **a) missing migration** or **b) stale edge-function
bundle**. Check the two manual sections.

## Gating production on CI

**In-repo gate (wired and ARMED): `vercel.json` → `ignoreCommand`.** `vercel.json`
sets `"ignoreCommand": "node scripts/vercel-ignore-build.mjs"`. Vercel runs that
BEFORE every build and reads its exit code (exit 0 = skip build, exit 1 =
proceed — Vercel's inverted convention). The script queries the GitHub Checks
API for the commit being deployed and only PROCEEDS when the required checks
(`check`, `e2e`, `deno-tests`) are all green.

**The gate is FAIL-CLOSED.** Inside a Vercel git deploy, anything that prevents
verifying CI — a missing `GITHUB_CI_STATUS_TOKEN`, a network error reaching
GitHub, a non-2xx response (bad/expired token, rate limit, 404), checks that
haven't reported yet, or any required check that isn't `success` — BLOCKS the
deploy (exit 0 = skip) rather than shipping unverified bytes. There is exactly
one documented escape hatch: setting `VERCEL_ALLOW_UNGATED_DEPLOY=1` makes the
script proceed UNGATED while emitting a loud warning (intended for a deliberate
hotfix while the token is being rotated, never as a steady state). Runs that are
NOT inside a Vercel git deploy (local `vercel build`, `vite preview`, missing git
metadata) always proceed — the gate only ever governs production/preview deploys.

To make the gate actually verify CI rather than just block, set a read-only
`GITHUB_CI_STATUS_TOKEN` (a PAT with `repo:status` / checks read) in Vercel →
Project → Settings → Environment Variables. Without that token every Vercel
deploy is blocked (unless you set the `VERCEL_ALLOW_UNGATED_DEPLOY=1` opt-out),
so provisioning the token is a required setup step, not an optional hardening one.
See the script header in `scripts/vercel-ignore-build.mjs` for the full decision
table.

**Auto-deploy loop (opt-in): the CI `redeploy` job + `VERCEL_DEPLOY_HOOK_URL`.**
The gate above only ever SKIPS or PROCEEDS — it never triggers a build. And it
skips the push-triggered deployment every time: Vercel runs the ignoreCommand
seconds after a push, long before CI (~10-15m) can conclude, so it always reads
"required checks not yet reported" and skips. Vercel does NOT re-evaluate on its
own once CI later goes green — that push's deployment is terminally skipped. The
`redeploy` job at the end of `.github/workflows/ci.yml` closes the loop: on a
`master` push, after `check` + `e2e` + `deno-tests` all succeed (`needs:` — a
red or cancelled gating job skips it), it POSTs the **Vercel Deploy Hook**. That
fires a FRESH deployment; Vercel re-runs the ignoreCommand on it, and this time
the required checks ARE green, so the gate PROCEEDS and the build ships.

This auto-deploy is **OFF until you set the secret** and non-breaking: the job
no-ops (exits 0 with a log line) unless the `VERCEL_DEPLOY_HOOK_URL` GitHub
Actions secret is present. To turn it on: Vercel → Project → Settings → Git →
Deploy Hooks → create a hook on branch `master`, then paste its URL into GitHub →
repo Settings → Secrets and variables → Actions as `VERCEL_DEPLOY_HOOK_URL`.
Until that secret exists, nothing about the current flow changes — a green CI run
leaves the deploy waiting on a manual dashboard Redeploy. Note the hook deploys
the branch HEAD, which may have advanced past the commit whose CI fired it; that
is safe because the ignoreCommand re-evaluates the required checks on whatever
commit actually builds, so a red HEAD still cannot ship (and the newer commit's
own CI run fires its own hook).

**Migration-currency gate (fail-closed).** Even when CI is green, the deploy is
BLOCKED if `supabase/applied-head.json` says production is behind the repo migration
head — i.e. the code being shipped may reference a schema the live DB doesn't have
yet. `npm run check`'s `validate:migration-head` only WARNS on this (the commit→push
window is normal); the deploy gate is where it turns fatal. To ship: run
`supabase db push`, bump `appliedHead` in the ledger, and redeploy. For a deliberate
schema-free deploy while the ledger is legitimately behind, set
`VERCEL_ALLOW_MIGRATION_DRIFT=1` (proceeds with a loud warning). Verified through the
real `decideDeploy` in `tests/build/ciGateHardening.test.js`.

**Edge functions are the one UNGATED path to production — deploy them by hand,
deliberately.** The client deploy is fail-closed CI-gated (`vercel-ignore-build.mjs`)
and the DB has the `applied-head.json` currency gate above, but edge functions ship
via a bare `npx supabase functions deploy` (or `scripts/deploy.sh`) straight from
whatever your **local working tree** contains. Nothing checks that CI is green,
nothing checks the tree is clean, and — unlike the migration ledger — nothing records
which commit's functions are live. This matters because the edge layer IS the money +
auth trust boundary (`stripe-webhook`, `create-checkout`, `auth-recovery`). Two
consequences to guard against by discipline:

- **Deploy only from a clean tree at a pushed, CI-green commit.** Before deploying any
  function, confirm `git status` is clean and the commit you're on is the one CI passed
  on `origin/master`. Deploying with local edits present ships bytes that were never
  tested and that no reviewer saw. Note the deploying commit SHA in your deploy record
  (there is no automated ledger to consult later).
- **`npm run check:edge-behavior` is FAIL-OPEN on a missing toolchain.** It runs the
  edge type-check + behavioral suite when `deno` is on `PATH`, but **exits 0 (skips)
  when deno is absent** — so a green local run does NOT prove the edge functions were
  exercised. Install deno so the pre-push hook actually gates them, and never treat a
  "skipped" edge check as a pass. CI's separate `deno-tests` job is the real gate, which
  is exactly why you must only deploy from a commit that job passed.

**Local convenience.** `npm run check` mirrors CI's `check` job (deliberately excludes
the Deno edge tests, which are CI's separate `deno-tests` job). To run EVERYTHING CI
runs in one command locally, use `npm run check:full` (= `check` + `check:edge-behavior`).
The pre-push hook already runs both.

For defense in depth, also do one of the two below (weakest → strongest):

1. **Branch protection + PR flow (minimum).** GitHub → Settings → Branches
   → add a rule for `master`: *Require status checks to pass before
   merging* → select the **`check`** job, and *Require a pull request
   before merging*. Stop pushing straight to `master`; land work via PRs.
   Vercel still builds `master`, but `master` now only advances through a
   CI-passed merge.

2. **Deploy from CI (strongest).** Turn OFF Vercel's production auto-deploy
   on push (Vercel → Settings → Git), and add a deploy step to `ci.yml`
   that runs **after** Build, only on `master`, with a `VERCEL_TOKEN`
   secret:

   ```yaml
   - name: Deploy to Vercel (production)
     if: github.ref == 'refs/heads/master'
     run: npx vercel deploy --prod --token "$VERCEL_TOKEN" --yes
     env:
       VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
   ```

   Now CI is the only path to production: no green gate, no deploy.

The in-repo gate above is the first line of defense, but it lives in the deploy
step, not in `master`'s history — branch protection (option 1) is what stops a
red commit from reaching `master` at all. Regardless of which defenses are on,
**always let the `pre-push` hook run** (never `--no-verify` to `master`) and watch
the Actions tab after pushing.

## Client app (Vercel) — CI-gated auto-deploy

```bash
# `git push origin master` does NOT ship on its own.
# 1. The push-triggered Vercel build is SKIPPED by the fail-closed
#    ignoreCommand (CI hasn't reported yet).
# 2. CI runs (~10-15m). When check + e2e + deno-tests are green, the
#    `redeploy` job POSTs the Vercel Deploy Hook (if VERCEL_DEPLOY_HOOK_URL
#    is set), which fires a fresh build that now passes the gate.
# 3. Output: `npx vite build` → dist/ uploaded to the Vercel CDN.
#
# If VERCEL_DEPLOY_HOOK_URL is NOT set, step 2 no-ops — trigger the deploy
# with a manual dashboard Redeploy once CI is green. See "Gating production
# on CI" for the token + deploy-hook setup.
```

No manual build command needed (the gate + hook drive it), but two Vercel-side
env prerequisites govern whether it deploys at all: the `GITHUB_CI_STATUS_TOKEN`
that arms the CI gate and the `VERCEL_DEPLOY_HOOK_URL` secret that arms the
auto-redeploy (both under *Gating production on CI*). The other Vercel-side
gotcha: **client environment variables**. The client needs:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_STRIPE_PUBLISHABLE_KEY=...     # for Stripe.js
VITE_GENERATE_NARRATIVE_URL=...      # the edge function URL
```

Set these in Vercel's dashboard → Project → Settings → Environment
Variables. Redeploy after changing them so the new values bake into the
client bundle.

## Database migrations (Supabase) — manual

Migrations live in `supabase/migrations/*.sql`. Each new migration is
applied on top of the current schema. Run:

```bash
# Link the local repo to your Supabase project (one-time):
npx supabase login
npx supabase link --project-ref <your-project-ref>

# Apply every pending migration:
npx supabase db push

# Optional: verify the migration ran without errors:
npx supabase db diff

# Verify the LIVE schema head caught up to the repo head (review M5). Obtain the
# deployed head, then let check-migration-head.mjs compare it to the repo head —
# it exits non-zero on drift (e.g. an unpushed hardening migration whose defense
# is then silently absent in production):
DEPLOYED_HEAD=$(npx supabase migration list --linked 2>/dev/null | grep -oE '^[[:space:]]*[0-9]+' | tail -1)
SUPABASE_MIGRATION_HEAD="$DEPLOYED_HEAD" npm run validate:migration-head
```

**After `db push`, bump the applied-head ledger.** `supabase/applied-head.json` records the
last migration number live in production (currently `097`, applied 2026-07-01). It is the
in-repo record that makes "is the deployed DB at head?" a reviewable fact instead of tribal
knowledge — and unlike the `SUPABASE_MIGRATION_HEAD` probe (which needs a live DB), it is
checked on **every** `npm run check`: when the repo head is ahead of `appliedHead`,
`validate:migration-head` prints the exact list of pending (undeployed) migrations, so the
"code ahead of deployed DB" state is visible in the gate output rather than silent. Bump
`appliedHead` (and `appliedAt`) in the SAME commit/PR as the `db push` that applied the new
migrations. `tests/docs/migrationAppliedHead.test.js` keeps it honest: the value must
reference a real, committed migration and can never exceed the repo head.

**Apply every file in `supabase/migrations/` in lexical order — do not stop at a
remembered number.** `db push` does this for you (it applies all pending migrations
on top of the current schema). Migration numbers grow every release, so this guide
deliberately does NOT pin a "latest" number that would rot and cause an operator to
under-apply. Highlights of the later set a production DB that predates this work
still needs:

- analytics core, settlement snapshots, rollups, cron, trends
- system-mutation capture; regional NPC reports + regional propagation report
- map-backdrop storage (bucket + RLS); gallery maps + map-with-campaign share +
  importable dossiers
- admin least-privilege, audit log, deletion-request + account-deletion
  processing, support tickets

**SECURITY — MUST APPLY.** Migrations **057, 059, 060** enforce account-status
writes and RLS (a disabled/banned account must not be able to write), **058**
scopes `system_config` public reads, **061** locks profile moderation
columns, and **062** closes three authz gaps (enables RLS on the two analytics
tables, drops the un-audited privileged `profiles`-UPDATE bypass so every
privileged write goes through the audited RPCs, and column-locks owner
support-ticket edits). Migration **066** (Auth Phase 2) adds the server-write-only
`security_answers` bcrypt table — the answer hash is reachable ONLY through the
SECURITY DEFINER question RPCs and the service-role recovery RPCs, never a client
SELECT — plus the per-IP/per-email recovery rate limiter. These are not optional
hardening — skipping them leaves the trust-boundary open. `db push` applies them
with everything else; if you ever hand-apply, never stop before this set has
landed.

**Auth Phase 2 — also flip email confirmations in the hosted dashboard.** Migration
066 expects email-confirm-locked signups. `supabase/config.toml` sets
`enable_confirmations = true`, but that governs `supabase start` (local) ONLY — you
MUST also enable email confirmations in the hosted **Supabase → Authentication →
Sign In / Providers → Email** settings for production, or the signup auto-login
poll never locks/unlocks as designed.

`db push` applies every pending migration on top of the current schema; they must
ALL land before deploying the corresponding functions and client. Confirm what is
applied vs pending (don't assume):

```bash
npx supabase migration list   # applied (local + remote) vs pending
npx supabase db diff          # an empty diff means remote schema matches the tree
```

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

Deploy each function:

> **This is the ungated path to production.** Unlike the client (fail-closed
> CI gate) and the DB (migration-currency gate), nothing here checks CI is green
> or the tree is clean, and nothing records the live commit. Deploy only from a
> clean `git status` at a pushed, CI-green commit, and note the SHA — see "Edge
> functions are the one UNGATED path to production" under *Gating production on CI*.

```bash
npx supabase functions deploy stripe-webhook          # Stripe posts a signature, not a JWT
npx supabase functions deploy create-checkout
npx supabase functions deploy create-customer-portal  # "Manage subscription" billing portal
npx supabase functions deploy verify-single-dossier   # anonymous, Stripe session id
npx supabase functions deploy generate-narrative
npx supabase functions deploy generate-chronicle
npx supabase functions deploy admin-actions
npx supabase functions deploy account-actions         # self-serve account export/deletion requests
npx supabase functions deploy send-email              # per-template self-auth; anon cap_warning path
npx supabase functions deploy ingest-events           # public analytics event sink (anon traffic)
npx supabase functions deploy analytics-export        # cron export, x-export-secret shared secret
npx supabase functions deploy auth-recovery           # logged-out password recovery (Auth Phase 2)
npx supabase functions deploy log-client-error        # public client-error sink (anon traffic, bot-guarded)
```

**No `--no-verify-jwt` flags needed.** `verify_jwt` is pinned EXPLICITLY for every
function in `config.toml` (the deploy source of truth), so the platform JWT gate
can't be flipped by a forgotten/stray flag. Seven functions that authenticate
themselves are pinned `false` (`stripe-webhook`, `verify-single-dossier`,
`ingest-events`, `analytics-export`, `send-email`, `auth-recovery`,
`log-client-error`); the rest are pinned `true`.
The pins are enforced by `tests/edgeFunctions/verifyJwtPins.test.js` (every
function must have an explicit pin). Deploy **every** function directory under
`supabase/functions/` — the only non-deployable one is `_shared/` (a helper
bundle, not a function). There are 13 functions total; on a first cutover deploy
all of them, and after adding a new function confirm the list with
`ls -d supabase/functions/*/ | grep -v _shared` rather than trusting this block.
<!-- @enforced-by tests/docs/docCounts.test.js -->

Set the required env vars in the Supabase dashboard → Project →
Functions → Secrets:

```
ANTHROPIC_API_KEY            # for generate-narrative + generate-chronicle
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
SUPABASE_URL                 # already set by Supabase
SUPABASE_ANON_KEY            # already set by Supabase
SUPABASE_SERVICE_ROLE_KEY    # required for admin operations
CLIENT_URL                   # e.g. https://settlementforge.com
```

Legacy SKU keys (`credits_5`, `credits_15`, `credits_40`, etc.) are
kept in the price map for refund/replay continuity — set them if you
want old refund links to resolve, otherwise leave them unset.

## Stripe webhook endpoint

Set the webhook destination in Stripe dashboard → Developers →
Webhooks → Add endpoint:

```
URL:    https://<your-supabase-project>.supabase.co/functions/v1/stripe-webhook
Events: checkout.session.completed, invoice.paid,
        invoice.payment_succeeded, customer.subscription.deleted
```

Copy the signing secret into `STRIPE_WEBHOOK_SECRET` (above).

## Pre-deploy sanity check

Run locally before pushing:

```bash
npm run check        # validate-data + typecheck + lint + tests + build
npm run build:edge-shared   # regenerate bundle if src/domain/ changed
```

Both must pass exit code 0. Any failure means CI will fail too.

## Rollback

The simplest rollback is to revert the bad commit and push:

```bash
git revert <bad-sha>
git push origin master
```

The revert ships the same CI-gated way as any push: it deploys once its CI run
is green and the `redeploy` job fires the hook (or via a manual dashboard
Redeploy if the deploy-hook secret isn't set) — it is NOT an instant push-to-live
rollback. For an edge-function regression,
also re-deploy from the prior good commit:

```bash
git checkout <good-sha> -- supabase/functions/<name>/
npx supabase functions deploy <name>
git checkout master
```

Database migrations CANNOT be rolled back automatically; restoring a
schema requires a downward migration written ahead of time. The
`schemaVersion` + migration chain in `domain/settlementMigrations.js`
covers settlement-shape rollbacks; SQL schema rollbacks are a separate
discipline that this project hasn't yet exercised.

## Common breakage modes

| Symptom | Likely cause | Fix |
|---|---|---|
| "Insufficient credits" but balance is fine | spend_credits RPC missing | Apply migration 009 |
| Webhook 400 on every event | Bad STRIPE_WEBHOOK_SECRET | Copy fresh secret from Stripe |
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
