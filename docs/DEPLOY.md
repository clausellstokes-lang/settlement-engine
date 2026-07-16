# SettlementForge — Deploy guide

Deployment has two halves: the **client app** (Vite SPA on Vercel) and the
**backend** (Supabase Postgres + Edge Functions). The client redeploys
automatically on every push to `master`; the backend pieces need manual
commands run with your Supabase + Stripe credentials.

## Quick status check (post-push)

After pushing to `origin/master`:

1. **CI**: `.github/workflows/ci.yml` runs the same `npm run check` gate you run
   locally (validate data/migration-head/edge/map → typecheck [full + domain-strict]
   → lint → the full test suite → build → verify:dist). Watch:
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

**In-repo half — DONE (finding F35).** `.github/workflows/ci.yml` now:
- runs on **every branch push** (not just `master`/`main`), so feature branches
  get the gate before a PR even exists;
- runs the **domain strict-type ratchet** (`typecheck:domain:strict`) that the
  local `npm run check` runs — CI and the local gate no longer diverge;
- has a **`deploy` job** gated on `needs: [check, e2e, deno-tests]`, `master`
  only. It is a safe no-op until you finish the dashboard half below (it logs
  and skips when `VERCEL_TOKEN` is unset), so adding it can't break today's flow.

**Dashboard half — still required to make CI the ONLY path** (cannot be done from
the repo). Today a push to `master` ALSO triggers Vercel's own production build
immediately, so until you do ONE of the below the gate is still advisory to that
auto-deploy. Weakest → strongest:

1. **Branch protection + PR flow (minimum).** GitHub → Settings → Branches
   → add a rule for `master`: *Require status checks to pass before
   merging* → select the **`check`**, **`e2e`**, and **`deno-tests`** jobs, and
   *Require a pull request before merging*. Stop pushing straight to `master`;
   land work via PRs. Vercel still builds `master`, but `master` now only
   advances through a CI-passed merge.

2. **Deploy from CI (strongest).** Turn OFF Vercel's production auto-deploy
   on push (Vercel → Settings → Git), then add the **`VERCEL_TOKEN`** secret
   (GitHub → Settings → Secrets → Actions). The `deploy` job already in
   `ci.yml` then activates automatically: it runs after check + e2e + deno-tests
   pass, on `master` only. No green gate, no deploy.

Until one of these is in place, **always let the `pre-push` hook run** (never
`--no-verify` to `master`) and watch the Actions tab after pushing.

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

**Current migration head: `135_world_snapshot_deny_census_lift.sql`** (this filename is kept
current by a freshness pin — `tests/docs/deployRunbookFreshness.test.js` derives the
head from `supabase/migrations/` and fails the gate if this line drifts).

Do **not** hand-count from a fixed starting migration — `db push` applies EVERY
pending migration on top of the current schema, in order, and self-corrects
regardless of how far behind prod is. They must ALL land before deploying the
corresponding functions and client. Confirm applied vs pending (don't trust any
number written here — ask the tooling):

```bash
npx supabase migration list   # applied (local + remote) vs pending — the authority
npx supabase db diff          # an empty diff means remote schema matches the tree
```

**Is prod actually at head?** Two in-repo checks answer this:

- `npm run validate:migration-head` reads the checked-in applied-head ledger
  (`supabase/applied-head.json`) and warns when prod is behind the repo head — the
  documented-normal commit→deploy window. Bump `appliedHead` only *after* a
  successful `db push`.
- The live probe: `SUPABASE_MIGRATION_HEAD=<live head number> npm run
  validate:migration-head` compares the live DB head against the repo head and
  fails hard on a mismatch (use it in the deploy pipeline, where a live DB exists).

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

Deploy them. **The canonical path is `bash scripts/deploy.sh` (Step 5)** — it
auto-discovers every `supabase/functions/*` directory (skipping `_shared`) and
derives each one's `--no-verify-jwt` flag from `config.toml`, so a newly-added
function can never be silently left undeployed and the platform JWT gate can never
drift from config. To deploy by hand, mirror what the script derives — the nine
self-authenticating functions get `--no-verify-jwt`, the seven authenticated ones
get no flag:

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
# verify_jwt = true (require an authenticated user — no flag):
npx supabase functions deploy create-checkout
npx supabase functions deploy verify-checkout-session                 # account-bound checkout verification
npx supabase functions deploy create-customer-portal                  # "Manage subscription" billing portal
npx supabase functions deploy generate-narrative
npx supabase functions deploy generate-chronicle
npx supabase functions deploy account-actions
npx supabase functions deploy admin-actions
```

There are **16 deployable functions** (every `supabase/functions/*` dir except
`_shared`) — deploy all of them on a first cutover. The nine `verify_jwt = false`
and seven `verify_jwt = true` postures above are pinned in `config.toml`, the
single source of truth `deploy.sh` parses. The freshness pin
(`tests/docs/deployRunbookFreshness.test.js`) fails the gate if any function dir
stops being named here.

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
npm run check        # the full 10-step gate (validate → typecheck → lint → test → build → verify:dist)
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
