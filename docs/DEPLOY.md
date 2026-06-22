# SettlementForge — Deploy guide

Deployment has two halves: the **client app** (Vite SPA on Vercel) and the
**backend** (Supabase Postgres + Edge Functions). The client redeploys
automatically on every push to `master`; the backend pieces need manual
commands run with your Supabase + Stripe credentials.

## Quick status check (post-push)

After pushing to `origin/master`:

1. **CI**: `.github/workflows/ci.yml` runs the check gate (validate data/edge/map
   → typecheck → lint → the full Vitest suite → build). The test count grows every
   PR — the live number is whatever the CI run reports, not a figure pinned here.
   Watch:
   <https://github.com/clausellstokes-lang/settlement-engine/actions>

2. **Vercel auto-deploy**: triggers on push to master. `vercel.json`
   points at `npx vite build` → `dist/`. Watch the Vercel dashboard for
   the project.

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

## Client app (Vercel) — automatic

```bash
# Already done by `git push origin master`.
# Vercel sees the push and runs `npx vite build`.
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
```

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
support-ticket edits). These are not optional hardening — skipping them leaves
the trust-boundary open. `db push` applies them with everything else; if you ever
hand-apply, never stop before this set has landed.

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
```

**No `--no-verify-jwt` flags needed.** `verify_jwt` is pinned EXPLICITLY for every
function in `config.toml` (the deploy source of truth), so the platform JWT gate
can't be flipped by a forgotten/stray flag. Five functions that authenticate
themselves are pinned `false` (`stripe-webhook`, `verify-single-dossier`,
`ingest-events`, `analytics-export`, `send-email`); the rest are pinned `true`.
The pins are enforced by `tests/edgeFunctions/verifyJwtPins.test.js` (every
function must have an explicit pin). Deploy **every** function directory under
`supabase/functions/` — the only non-deployable one is `_shared/` (a helper
bundle, not a function). There are 11 functions total; on a first cutover deploy
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

Vercel will auto-deploy the revert. For an edge-function regression,
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
