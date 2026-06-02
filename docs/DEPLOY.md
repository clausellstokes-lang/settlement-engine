# SettlementForge — Deploy guide

Deployment has two halves: the **client app** (Vite SPA on Vercel) and the
**backend** (Supabase Postgres + Edge Functions). The client redeploys
automatically on every push to `master`; the backend pieces need manual
commands run with your Supabase + Stripe credentials.

## Quick status check (post-push)

After pushing to `origin/master`:

1. **CI**: `.github/workflows/ci.yml` runs the check gate (validate-data →
   typecheck → lint → ~2,400 tests → build). Watch:
   <https://github.com/clausellstokes-lang/settlement-engine/actions>

2. **Vercel auto-deploy**: triggers on push to master. `vercel.json`
   points at `npx vite build` → `dist/`. Watch the Vercel dashboard for
   the project.

3. **Supabase**: nothing happens automatically. Run the manual steps
   below.

If the client app's already up but a new feature is missing, the cause
is almost always **a) missing migration** or **b) stale edge-function
bundle**. Check the two manual sections.

## Gating production on CI (recommended)

Today CI and the Vercel deploy are **independent**: a push to `master`
triggers the Vercel production build immediately, regardless of whether
`.github/workflows/ci.yml` passed. The local `pre-push` hook is the only
thing between a red gate and a live deploy — and hooks can be skipped
(`--no-verify`). For a product that handles payments, make CI a hard gate.
Two ways, weakest → strongest:

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

**The last migration in tree (`016_version_history.sql`)** adds the
`version_history` jsonb column to `public.settlements`, giving the
version-timeline feature (VersionsTab.jsx) a durable, owner-only home
for per-settlement edit snapshots that survive page reload + device
switch. It MUST be applied before the version history feature can
persist anything. Test it ran:

```bash
# Should return one row: version_history | jsonb
npx supabase db remote sql --query \
  "select column_name, data_type from information_schema.columns where table_schema = 'public' and table_name = 'settlements' and column_name = 'version_history';"
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
npx supabase functions deploy stripe-webhook
npx supabase functions deploy create-checkout
npx supabase functions deploy generate-narrative
npx supabase functions deploy admin-actions
npx supabase functions deploy send-email
```

Set the required env vars in the Supabase dashboard → Project →
Functions → Secrets:

```
ANTHROPIC_API_KEY            # for generate-narrative
RESEND_API_KEY               # for send-email (Resend provider key)
RESEND_FROM_EMAIL            # for send-email (verified sender address)
STRIPE_SECRET_KEY            # for stripe-webhook + create-checkout
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
Events: checkout.session.completed, customer.subscription.deleted
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
